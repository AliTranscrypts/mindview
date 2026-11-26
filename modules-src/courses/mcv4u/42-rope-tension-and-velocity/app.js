// MCV4U 42 Rope Tension and Velocity: hero (a lantern's ropes flatten while their tension climbs; a plane's heading and track
// split in a crosswind), Hanging mass and river crossing (Explore: V3 vector board in three skins: rope rig with a triangle-of-
// forces view and strain bars, overhead river with an animated crossing, compass map), Wind and current (Part 3: label the
// velocity triangle, straight-across planner, fastest vs shortest race), Tension builder and Navigation set (Practice: V8
// boxes with exact roots) and the "Plan the crossing" task (live river preview).
(function(){
"use strict";
var $ = MV.$, num = MV.num, MINUS = MV.MINUS;

function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function f1(v){ return Math.round(v * 10) / 10; }
function rad(d){ return d * Math.PI / 180; }
function deg(r){ return r * 180 / Math.PI; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function lin(t){ return t; }
function sgn(s){ return String(s).replace(/-/g, MINUS); }
function fx1(v){ v = f1(v); if (Object.is(v, -0) || v === 0) return "0.0"; return (v < 0 ? MINUS : "") + Math.abs(v).toFixed(1); }   // "−1.0"
function n1(v){ return num(f1(r9(v)), 1); }                                                                                 // "11.5", "20"
function isInt(v){ return near(v, Math.round(v), 1e-7); }
function snap(v, lo, hi, st, d){ v = Number(v); if (!isFinite(v)) return d; return clamp(Math.round((v - lo) / st) * st + lo, lo, hi); }
function nb(d){ d = ((d % 360) + 360) % 360; if (near(d, 360, 0.05)) d = 0; return d; }
function brg(d){ d = nb(d); var s = isInt(d) ? String(Math.round(d)) : d.toFixed(1); var w = s.split(".")[0]; while (w.length < 3) { w = "0" + w; s = "0" + s; } return s + "°"; }
// exact single-term surd for a positive value: "60√3", "100√3/3", "20" (null if none with a small denominator)
function surd(v){
  if (!isFinite(v)) return null;
  if (near(v, 0, 1e-9)) return "0";
  var a = Math.abs(v), R = [1, 2, 3, 5, 6, 7];
  for (var i = 0; i < R.length; i++) {
    var c = a / Math.sqrt(R[i]);
    for (var q = 1; q <= 12; q++) {
      var n = c * q, rn = Math.round(n);
      if (rn >= 1 && Math.abs(n - rn) < 1e-7 * Math.max(1, n)) {
        var g = gcd(rn, q), p = rn / g, qq = q / g;
        return (v < 0 ? "-" : "") + (R[i] === 1 ? String(p) : (p === 1 ? "" : p) + "√" + R[i]) + (qq === 1 ? "" : "/" + qq);
      }
    }
  }
  return null;
}
function exactTxt(v, unit, ok){   // "60√3 N ≈ 103.9 N", "60 N", or "≈ 103.9 N"
  var s = ok ? surd(v) : null;
  if (s && s.indexOf("√") < 0 && s.indexOf("/") < 0) return s + " " + unit;
  if (s) return m(s) + " " + unit + " ≈ " + n1(v) + " " + unit;
  return (isInt(v) ? "" : "≈ ") + n1(v) + " " + unit;
}

// ---------- small markup helpers ----------
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(MV.plain(label)) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function togBtn(id, label, on){ return '<button type="button" class="chip rtv-tog" data-tog="' + id + '" data-k="tog' + id + '" aria-pressed="' + on + '">' + (on ? "✓ " : "") + label + "</button>"; }
function slider(id, label, min, max, step, val, out){
  return '<label class="slider rtv-sl"><span class="slider-top"><span>' + label + '</span><output id="rtv-o-' + id + '">' + out + "</output></span>" +
    '<input type="range" id="rtv-s-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
}

// ---------- SVG helpers ----------
function P(v){ return f1(v); }
function arrow(x1, y1, x2, y2, c, w, extra){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 2) return "";
  w = w || 3; var ux = dx / L, uy = dy / L, h = Math.min(8 + w * 1.4, L * 0.5), hw = h * 0.5, bx = x2 - ux * h, by = y2 - uy * h;
  return '<line class="rtv-s rtv-s' + c + (extra ? " " + extra : "") + '" x1="' + P(x1) + '" y1="' + P(y1) + '" x2="' + P(bx + ux * 0.5) + '" y2="' + P(by + uy * 0.5) + '" style="stroke-width:' + P(w) + 'px"/>' +
    '<polygon class="rtv-h rtv-h' + c + '" points="' + P(x2) + "," + P(y2) + " " + P(bx - uy * hw) + "," + P(by + ux * hw) + " " + P(bx + uy * hw) + "," + P(by - ux * hw) + '"/>';
}
function txt(x, y, t, cls, anchor){ return '<text class="rtv-t' + (cls ? " " + cls : "") + '" x="' + P(x) + '" y="' + P(y) + '" text-anchor="' + (anchor || "middle") + '">' + t + "</text>"; }
function it(v){ return '<tspan class="rtv-i">' + v + "</tspan>"; }
function sub(v){ return '<tspan class="rtv-sub" dy="3">' + v + '</tspan><tspan dy="-3"></tspan>'; }
var PLANE = "M0,-12 L2,-4 L11,1 L11,3.5 L2,1.5 L1.6,8 L4.5,10.5 L4.5,12 L0,11 L-4.5,12 L-4.5,10.5 L-1.6,8 L-2,1.5 L-11,3.5 L-11,1 L-2,-4 Z";
var BOAT = "M0,-11 C4,-6 5,-1 5,4 L5,9 L-5,9 L-5,4 C-5,-1 -4,-6 0,-11 Z";

// =====================================================================================================================
// physics
function tens(W, a, b){   // tensions for ropes at a (left) and b (right) above the horizontal, degrees
  if (near(a, 90, 1e-9) && near(b, 90, 1e-9)) return [W / 2, W / 2];
  var s = Math.sin(rad(a + b));
  return [r9(W * Math.cos(rad(b)) / s), r9(W * Math.cos(rad(a)) / s)];
}
function crossing(w, c, b, phi){   // phi degrees from straight across, + upstream
  var gx = c - b * Math.sin(rad(phi)), gy = b * Math.cos(rad(phi)), T = w / gy;
  return { gx:r9(gx), gy:r9(gy), sp:Math.hypot(gx, gy), T:T, d:r9(gx * T) };
}
function landTxt(d){ d = r9(d); if (near(d, 0, 1e-6)) return "0 m: directly opposite"; return n1(Math.abs(d)) + " m " + (d > 0 ? "downstream" : "upstream"); }
function flight(as, ah, ws, wf){
  var ax = as * Math.sin(rad(ah)), ay = as * Math.cos(rad(ah)), wx = ws * Math.sin(rad(wf + 180)), wy = ws * Math.cos(rad(wf + 180));
  var gx = r9(ax + wx), gy = r9(ay + wy), sp = Math.hypot(gx, gy);
  return { ax:ax, ay:ay, wx:wx, wy:wy, gx:gx, gy:gy, sp:sp, tr:sp > 1e-6 ? nb(deg(Math.atan2(gx, gy))) : null };
}
var DIRS = ["north", "east", "south", "west"];
function driftTxt(ah, tr){
  if (tr == null) return "No track: the wind cancels the air velocity, so the plane hovers over one spot.";
  var d = nb(tr - ah); if (d > 180) d -= 360; d = r9(d);
  if (near(d, 0, 0.05)) return "Track = heading: no drift.";
  var amt = (isInt(d) ? Math.round(Math.abs(d)) : Math.abs(d).toFixed(1)) + "°", q = ah % 90 === 0 ? ah / 90 : -1;
  if (near(Math.abs(d), 180, 0.05)) return "The track points opposite the heading: the wind is stronger than the airspeed.";
  if (q >= 0) return "Track is " + amt + " " + DIRS[(q + (d > 0 ? 1 : 3)) % 4] + " of the heading";
  return "Track is " + amt + (d > 0 ? " clockwise (right) of the heading" : " counterclockwise (left) of the heading");
}
function trackTxt(F){ return F.tr == null ? "0 km/h (no track)" : (isInt(F.sp) ? Math.round(F.sp) : "≈ " + n1(F.sp)) + " km/h on a track of " + brg(F.tr); }

// =====================================================================================================================
// figures
// Rope rig (viewBox 0 0 360 250): ring at (180, 160), ropes 140 long to their hooks, lantern below.
function rigFig(o){   // {W, a, b, T:[t1, t2], hide, grow (0..1)}
  var cx = 180, cy = 158, L = 140, g = o.grow == null ? 1 : o.grow, s = "";
  var lx = cx - L * Math.cos(rad(o.a)), ly = cy - L * Math.sin(rad(o.a)), rx = cx + L * Math.cos(rad(o.b)), ry = cy - L * Math.sin(rad(o.b));
  function w(T){ return clamp(1.4 + (T * g) / 36, 1.4, 12); }
  [[lx, ly], [rx, ry]].forEach(function(h){ s += '<rect class="rtv-hook" x="' + P(h[0] - 14) + '" y="' + P(h[1] - 9) + '" width="28" height="5" rx="1.5"/><line class="rtv-hk" x1="' + P(h[0]) + '" y1="' + P(h[1] - 4) + '" x2="' + P(h[0]) + '" y2="' + P(h[1]) + '"/>'; });
  s += '<line class="rtv-ref" x1="' + (cx - 58) + '" y1="' + cy + '" x2="' + (cx + 58) + '" y2="' + cy + '"/>';
  s += '<line class="rtv-rope rtv-ropep" x1="' + P(lx) + '" y1="' + P(ly) + '" x2="' + cx + '" y2="' + cy + '" style="stroke-width:' + P(w(o.T[0])) + 'px"/>';
  s += '<line class="rtv-rope rtv-ropef" x1="' + P(rx) + '" y1="' + P(ry) + '" x2="' + cx + '" y2="' + cy + '" style="stroke-width:' + P(w(o.T[1])) + 'px"/>';
  var r = 30;
  s += '<path class="rtv-arc" d="M' + (cx - r) + "," + cy + " A" + r + "," + r + " 0 0 1 " + P(cx - r * Math.cos(rad(o.a))) + "," + P(cy - r * Math.sin(rad(o.a))) + '"/>';
  s += '<path class="rtv-arc" d="M' + (cx + r) + "," + cy + " A" + r + "," + r + " 0 0 0 " + P(cx + r * Math.cos(rad(o.b))) + "," + P(cy - r * Math.sin(rad(o.b))) + '"/>';
  s += txt(cx - 44 * Math.cos(rad(o.a / 2)), cy - 44 * Math.sin(rad(o.a / 2)) + 4, it("α") + " " + Math.round(o.a) + "°", "rtv-ts");
  s += txt(cx + 44 * Math.cos(rad(o.b / 2)), cy - 44 * Math.sin(rad(o.b / 2)) + 4, it("β") + " " + Math.round(o.b) + "°", "rtv-ts");
  // tension labels at the rope middles, pushed outward
  function lab(x, y, nx, ny, name, T, cls, anchor){ return txt(x + nx * 16, y + ny * 16, it("T") + sub(name) + (o.hide ? " = ?" : " = " + n1(T) + " N"), cls, anchor); }
  s += lab((lx + cx) / 2, (ly + cy) / 2, -Math.sin(rad(o.a)), -Math.cos(rad(o.a)), "1", o.T[0], "rtv-tp", "end");
  s += lab((rx + cx) / 2, (ry + cy) / 2, Math.sin(rad(o.b)), -Math.cos(rad(o.b)), "2", o.T[1], "rtv-tf", "start");
  // ring, cord and lantern
  s += '<line class="rtv-cord" x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy + 20) + '"/><circle class="rtv-ring" cx="' + cx + '" cy="' + cy + '" r="5"/>';
  s += '<path class="rtv-lamp" d="M' + (cx - 11) + "," + (cy + 22) + " h22 l5,8 v26 l-5,8 h-22 l-5,-8 v-26 Z" + '"/><rect class="rtv-glow" x="' + (cx - 8) + '" y="' + (cy + 33) + '" width="16" height="18" rx="3"/>';
  s += txt(cx + 26, cy + 50, it("W") + " = " + num(o.W) + " N", "rtv-tk", "start");
  return s;
}
// Triangle of forces (viewBox 0 0 360 250): W, then T1, then T2, tip to tail.
function triFig(o){
  var V = [[0, -o.W], [-o.T[0] * Math.cos(rad(o.a)), o.T[0] * Math.sin(rad(o.a))], [o.T[1] * Math.cos(rad(o.b)), o.T[1] * Math.sin(rad(o.b))]];
  var pts = [[0, 0]]; V.forEach(function(v){ var l = pts[pts.length - 1]; pts.push([l[0] + v[0], l[1] + v[1]]); });
  var xs = pts.map(function(p){ return p[0]; }), ys = pts.map(function(p){ return p[1]; });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var k = Math.min(250 / Math.max(1, x1 - x0), 190 / Math.max(1, y1 - y0)), ox = 180 - k * (x0 + x1) / 2, oy = 125 + k * (y0 + y1) / 2;
  function X(p){ return ox + k * p[0]; } function Y(p){ return oy - k * p[1]; }
  var cxm = (X(pts[0]) + X(pts[1]) + X(pts[2])) / 3, cym = (Y(pts[0]) + Y(pts[1]) + Y(pts[2])) / 3, s = "";
  var C = ["k", "p", "f"], N = [it("W") + " = " + num(o.W) + " N", it("T") + sub("1") + (o.hide ? " = ?" : " = " + n1(o.T[0]) + " N"), it("T") + sub("2") + (o.hide ? " = ?" : " = " + n1(o.T[1]) + " N")];
  for (var i = 0; i < 3; i++) {
    var a = pts[i], b = pts[i + 1];
    if (Math.hypot(X(b) - X(a), Y(b) - Y(a)) < 2) continue;
    s += arrow(X(a), Y(a), X(b), Y(b), C[i], 3.2);
    var mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2, dx = mx - cxm, dy = my - cym, dl = Math.hypot(dx, dy) || 1;
    s += txt(mx + dx / dl * 22, my + dy / dl * 22 + 4, N[i], "rtv-t" + C[i], dx < -4 ? "end" : dx > 4 ? "start" : "middle");
  }
  return s + txt(180, 244, "The three forces close tip to tail: their sum is " + it("0") + ".", "rtv-ts");
}
// Overhead river (viewBox 0 0 360 260): north bank on top, current flows east (left to right).
var RT = 36, RB = 216;
function riverFig(o){   // {w, c, boats:[{b, phi, f, x0, vec, pin, tag}], clock}
  var H = RB - RT, sc = H / o.w, s = "";
  s += '<rect class="rtv-land" x="0" y="0" width="360" height="' + RT + '"/><rect class="rtv-land" x="0" y="' + RB + '" width="360" height="' + (260 - RB) + '"/>';
  s += '<rect class="rtv-water" x="0" y="' + RT + '" width="360" height="' + H + '"/>';
  s += '<line class="rtv-bank" x1="0" y1="' + RT + '" x2="360" y2="' + RT + '"/><line class="rtv-bank" x1="0" y1="' + RB + '" x2="360" y2="' + RB + '"/>';
  if (o.c > 0) [[30, RT + 26], [200, RT + 26], [110, RT + 90], [280, RT + 90], [40, RT + 154], [210, RT + 154]].forEach(function(p){
    s += '<line class="rtv-flow" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (p[0] + 46) + '" y2="' + p[1] + '"/><path class="rtv-flowh" d="M' + (p[0] + 46) + "," + (p[1] - 3.5) + " l6,3.5 l-6,3.5 Z" + '"/>';
  });
  s += txt(8, 22, "North bank", "rtv-ts", "start") + txt(8, 250, "South bank", "rtv-ts", "start");
  s += txt(352, 22, "current " + num(o.c) + " m/s →", "rtv-ts", "end");
  s += '<line class="rtv-dim" x1="16" y1="' + (RT + 4) + '" x2="16" y2="' + (RB - 4) + '"/>' + txt(22, (RT + RB) / 2 + 4, num(o.w) + " m", "rtv-ts", "start");
  if (o.clock) s += txt(352, 250, o.clock, "rtv-tk", "end");
  (o.boats || []).forEach(function(bt){
    var K = crossing(o.w, o.c, bt.b, bt.phi), dpx = K.d * sc, x0 = bt.x0 != null ? bt.x0 : clamp(180 - dpx / 2, 70, 300), Lx = x0 + dpx;
    var fe = 1; if (Lx < 8) fe = (8 - x0) / (Lx - x0); else if (Lx > 352) fe = (352 - x0) / (Lx - x0);
    var f = Math.min(bt.f || 0, fe), px = x0 + dpx * f, py = RB - H * f, ex = x0 + dpx * fe, ey = RB - H * fe;
    s += '<circle class="rtv-dock" cx="' + P(x0) + '" cy="' + RB + '" r="4"/>';
    if (bt.pin || f > 0) s += '<line class="rtv-opp" x1="' + P(x0) + '" y1="' + RT + '" x2="' + P(x0) + '" y2="' + (RT - 10) + '"/>';
    if (f > 0) s += '<line class="rtv-track" x1="' + P(x0) + '" y1="' + RB + '" x2="' + P(px) + '" y2="' + P(py) + '"/>';
    if (bt.pin) {
      s += '<path class="rtv-pin" d="M' + P(ex) + "," + P(ey) + " l-6,-13 a6.5,6.5 0 1 1 12,0 Z" + '"/>';
      var lt = fe < 1 ? "off the map: " + landTxt(K.d).replace("0 m: ", "") : (near(K.d, 0, 1e-6) ? "directly opposite" : landTxt(K.d));
      s += txt(clamp(ex, 70, 290), RT - 22 < 8 ? 10 : RT - 22, (bt.tag ? bt.tag + ": " : "") + lt, "rtv-tk");
    }
    if (bt.vec) {
      var vs = 9, wx = -bt.b * Math.sin(rad(bt.phi)) * vs, wy = -bt.b * Math.cos(rad(bt.phi)) * vs;
      s += arrow(x0, RB, x0 + wx + o.c * vs, RB + wy, "k", 3) + arrow(x0, RB, x0 + wx, RB + wy, "p", 3) + arrow(x0 + wx, RB + wy, x0 + wx + o.c * vs, RB + wy, "f", 3);
    }
    s += '<path class="rtv-boat" d="' + BOAT + '" transform="translate(' + P(px) + "," + P(py) + ") rotate(" + P(-bt.phi) + ')"/>';
    if (bt.tag) s += txt(px + 10, py + 18, bt.tag, "rtv-tk", "start");
  });
  return s;
}
// Compass map (viewBox 0 0 360 300): start at the centre; heading dashed, track solid.
function airFig(o){   // {as, ah, ws, wf, hideG, gf}
  var Ox = 180, Oy = 150, R = 122, F = flight(o.as, o.ah, o.ws, o.wf), sc = 100 / Math.max(o.as, F.sp, 1), s = "";
  s += '<circle class="rtv-comp" cx="' + Ox + '" cy="' + Oy + '" r="' + R + '"/>';
  for (var d = 0; d < 360; d += 30) { var ca = Math.sin(rad(d)), cb = -Math.cos(rad(d)), ln = d % 90 === 0 ? 10 : 5; s += '<line class="rtv-tick" x1="' + P(Ox + ca * R) + '" y1="' + P(Oy + cb * R) + '" x2="' + P(Ox + ca * (R - ln)) + '" y2="' + P(Oy + cb * (R - ln)) + '"/>'; }
  s += txt(Ox, Oy - R - 8, "N", "rtv-tk") + txt(Ox + R + 12, Oy + 4, "E", "rtv-tk") + txt(Ox, Oy + R + 18, "S", "rtv-tk") + txt(Ox - R - 12, Oy + 4, "W", "rtv-tk");
  function far(b, r){ return [Ox + Math.sin(rad(b)) * r, Oy - Math.cos(rad(b)) * r]; }
  var hp = far(o.ah, R - 2);
  s += '<line class="rtv-head" x1="' + Ox + '" y1="' + Oy + '" x2="' + P(hp[0]) + '" y2="' + P(hp[1]) + '"/>';
  var hl = far(o.ah, R - 22); s += txt(hl[0] + 16 * Math.cos(rad(o.ah)), hl[1] + 16 * Math.sin(rad(o.ah)) + 4, "heading " + brg(o.ah), "rtv-tp");
  var Ax = Ox + F.ax * sc, Ay = Oy - F.ay * sc, Gx = Ax + F.wx * sc, Gy = Ay - F.wy * sc;
  if (!o.hideG && F.tr != null) {
    var tp = far(F.tr, R - 2), tl = far(F.tr, R - 40);
    s += '<line class="rtv-trk" x1="' + Ox + '" y1="' + Oy + '" x2="' + P(tp[0]) + '" y2="' + P(tp[1]) + '"/>';
    s += txt(tl[0] - 16 * Math.cos(rad(F.tr)), tl[1] - 16 * Math.sin(rad(F.tr)) + 4, "track " + brg(F.tr), "rtv-tk");
  }
  var gf = o.hideG ? 0 : (o.gf == null ? 1 : o.gf);
  if (gf > 0) s += arrow(Ox, Oy, Ox + (Gx - Ox) * gf, Oy + (Gy - Oy) * gf, "k", 3.4);
  s += arrow(Ox, Oy, Ax, Ay, "p", 3.2) + arrow(Ax, Ay, Gx, Gy, "f", 3.2);
  s += '<path class="rtv-plane" d="' + PLANE + '" transform="translate(' + Ox + "," + Oy + ") rotate(" + o.ah + ')"/>';
  return s;
}
function legend(rows){ return rows.map(function(r){ return '<span class="rtv-lg"><i class="rtv-sw rtv-sw' + r[0] + '" aria-hidden="true"></i>' + r[1] + "</span>"; }).join(""); }

// =====================================================================================================================
// hero: lantern ropes flatten from 60° to 15° (tension 58 N -> 193 N); plane heads north in an east wind
function hero(f){
  var host = $("#rtv-hero"); if (!host) return;
  host.innerHTML = '<svg class="rtv-svg rtv-hsvg" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"></svg>';
  var svg = $("svg", host);
  svg.setAttribute("aria-label", "Left: a 100 N lantern hangs from two ropes. The ropes flatten from 60° to 15° above the horizontal and grow thicker as the tension in each climbs from 58 N to 193 N. Right: a plane points north (blue heading arrow) while a teal wind arrow blows east; its actual path over the ground (ink) leans north-east. The dashed line is the heading, the solid line the track.");
  function draw(t){
    var th = 60 - 45 * t, T = 100 / (2 * Math.sin(rad(th))), cx = 125, cy = 132, L = 108, s = "";
    var lx = cx - L * Math.cos(rad(th)), ly = cy - L * Math.sin(rad(th)), rx = cx + L * Math.cos(rad(th)), w = 1.4 + T / 30;
    [[lx, ly], [rx, ly]].forEach(function(h){ s += '<rect class="rtv-hook" x="' + P(h[0] - 12) + '" y="' + P(h[1] - 8) + '" width="24" height="5" rx="1.5"/>'; });
    s += '<line class="rtv-rope rtv-ropep" x1="' + P(lx) + '" y1="' + P(ly) + '" x2="' + cx + '" y2="' + cy + '" style="stroke-width:' + P(w) + 'px"/>';
    s += '<line class="rtv-rope rtv-ropef" x1="' + P(rx) + '" y1="' + P(ly) + '" x2="' + cx + '" y2="' + cy + '" style="stroke-width:' + P(w) + 'px"/>';
    s += '<line class="rtv-cord" x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy + 16) + '"/><circle class="rtv-ring" cx="' + cx + '" cy="' + cy + '" r="4.5"/>';
    s += '<path class="rtv-lamp" d="M' + (cx - 10) + "," + (cy + 18) + " h20 l5,7 v22 l-5,7 h-20 l-5,-7 v-22 Z" + '"/><rect class="rtv-glow" x="' + (cx - 7) + '" y="' + (cy + 27) + '" width="14" height="16" rx="3"/>';
    s += txt(cx + 22, cy + 44, "100 N", "rtv-tk", "start") + txt(cx, 212, "each rope: " + Math.round(T) + " N at " + Math.round(th) + "°", "rtv-tk rtv-big");
    // plane: heading north at 300, wind east at 100 (scaled 0.5 px per km/h)
    var Ox = 395, Oy = 200, k = 0.5, Ax = Ox, Ay = Oy - 300 * k * Math.min(1, t * 1.6), Gx = Ax + 100 * k * clamp(t * 1.6 - 0.25, 0, 1), Gy = Ay;
    s += '<line class="rtv-head" x1="' + Ox + '" y1="' + Oy + '" x2="' + Ox + '" y2="' + (Oy - 178) + '"/>' + txt(Ox - 6, Oy - 182, "heading", "rtv-tp", "end");
    if (t > 0.55) { var q = clamp((t - 0.55) / 0.45, 0, 1), ex = Ox + (Gx - Ox) * 1.18 * q, ey = Oy + (Gy - Oy) * 1.18 * q;
      s += '<line class="rtv-trk" x1="' + Ox + '" y1="' + Oy + '" x2="' + P(ex) + '" y2="' + P(ey) + '"/>'; if (q > 0.9) s += txt(ex + 6, ey + 2, "track", "rtv-tk", "start"); }
    s += arrow(Ox, Oy, Ax, Ay, "p", 3.2); if (Gx > Ax + 2) s += arrow(Ax, Ay, Gx, Gy, "f", 3.2);
    if (t > 0.55) s += arrow(Ox, Oy, Ox + (Gx - Ox) * clamp((t - 0.55) / 0.3, 0, 1), Oy + (Gy - Oy) * clamp((t - 0.55) / 0.3, 0, 1), "k", 3.2);
    s += txt(Ax + 52, Ay - 8, "wind", "rtv-tf") + '<path class="rtv-plane" d="' + PLANE + '" transform="translate(' + Ox + "," + Oy + ')"/>';
    s += '<line class="rtv-div" x1="262" y1="14" x2="262" y2="226"/>';
    svg.innerHTML = s;
  }
  function finish(){ draw(1); if (f.cap) f.cap.textContent = "Flatter ropes, bigger tensions. Heading isn’t track."; }
  if (MV.reduceMotion) { finish(); return; }
  draw(0);
  MV.wait(700, function(){ MV.tween({ dur:5200, ease:lin, step:draw, done:finish }); });
}

// =====================================================================================================================
// Explore: @component V3 vectorBoard (MCV4U 42: three skins — rope rig + triangle of forces, overhead river, compass map;
// tip-to-tail arrows in --pen / --f3 / --ink, live readouts, strain bars, animated crossing; self-contained)
var EXS = null;
function explore(host, api){
  var S = api.S, C = api.content, U = C.ui, R = U.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["tension", "river", "air"].indexOf(S.mode) < 0) S.mode = "tension";
  S.W = snap(S.W, 10, 200, 10, 100); S.a = snap(S.a, 15, 90, 15, 60); S.b = snap(S.b, 15, 90, 15, 60); S.sym = S.sym == null ? true : !!S.sym;
  if (S.sym) S.b = S.a;
  if (["ropes", "tri"].indexOf(S.view) < 0) S.view = "ropes";
  S.rw = snap(S.rw, 40, 200, 20, 80); S.rc = snap(S.rc, 0, 6, 1, 3); S.rb = snap(S.rb, 1, 10, 1, 4); S.rp = snap(S.rp, -75, 75, 15, 0); S.landed = !!S.landed;
  S.as = snap(S.as, 100, 600, 50, 300); S.ah = snap(S.ah, 0, 345, 15, 0); S.ws = snap(S.ws, 0, 200, 25, 100); S.wf = snap(S.wf, 0, 345, 15, 270); S.tc3rev = !!S.tc3rev;
  var busy = false, hideT = false, hideR = false, hideA = false, grow = null, gf = null, prog = null, anim = null;
  host.innerHTML = '<div class="rtv-ex"><div class="rtv-top" data-mv="graph"><div class="seg-wrap" id="rtv-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="rtv-grid"><div class="rtv-scene"><svg class="rtv-svg" id="rtv-svg" viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"></svg>' +
    '<p class="tiny rtv-legend" id="rtv-leg"></p><div id="rtv-extra"></div></div>' +
    '<div class="rtv-side"><div id="rtv-ctl"></div><p class="tiny muted rtv-how" id="rtv-how"></p><dl class="read" id="rtv-read" aria-live="polite"></dl></div></div></div></div>';
  var svg = $("#rtv-svg", host);
  function tc3Setup(){ return S.mode === "air" && S.wf === 90 && S.ws === 100 && S.as === 200; }
  function tc3Hidden(){ var cs = MV.S && MV.S.chal && MV.S.chal.tc3; return tc3Setup() && !S.tc3rev && !(cs && cs.solved); }
  function exactAng(){ return [30, 45, 60, 90].indexOf(S.a) >= 0 && [30, 45, 60, 90].indexOf(S.b) >= 0; }
  // ---- controls ----
  function fmtP(v){ return v === 0 ? "0° (straight across)" : Math.abs(v) + "° " + (v > 0 ? "upstream" : "downstream"); }
  function fmtWf(v){ return brg(v) + " (toward " + brg(v + 180) + ")"; }
  var FMT = { W:function(v){ return v + " N"; }, a:function(v){ return Math.round(v) + "°"; }, b:function(v){ return Math.round(v) + "°"; },
    rw:function(v){ return v + " m"; }, rc:function(v){ return v + " m/s"; }, rb:function(v){ return v + " m/s"; }, rp:fmtP,
    as:function(v){ return v + " km/h"; }, ah:brg, ws:function(v){ return v + " km/h"; }, wf:fmtWf };
  function sl(id, min, max, step){ return slider(id, U.lab[id], min, max, step, S[id], FMT[id](S[id])); }
  function paintCtl(){
    var mc = $("#rtv-mode", host), ct = $("#rtv-ctl", host);
    MV.keepFocus(mc, function(){ mc.innerHTML = '<span class="tiny rtv-lab">' + U.modeLab + "</span>" + segBtns("mode", U.modes, S.mode, U.modeLab); });
    MV.keepFocus(ct, function(){
      var h = "";
      if (S.mode === "tension") h = sl("W", 10, 200, 10) + sl("a", 15, 90, 15) + sl("b", 15, 90, 15) +
        '<div class="rtv-crow">' + togBtn("sym", U.sym, S.sym) + '</div><div class="rtv-crow"><span class="tiny rtv-lab">' + U.viewLab + "</span>" + segBtns("view", U.views, S.view, U.viewLab) + "</div>";
      else if (S.mode === "river") h = sl("rw", 40, 200, 20) + sl("rc", 0, 6, 1) + sl("rb", 1, 10, 1) + sl("rp", -75, 75, 15) +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="rtv-go" data-k="rtvgo">' + U.go + '</button><button type="button" class="btn ghost sm" id="rtv-back" data-k="rtvback">' + U.reset + "</button></div>";
      else h = sl("as", 100, 600, 50) + sl("ah", 0, 345, 15) + sl("ws", 0, 200, 25) + sl("wf", 0, 345, 15);
      ct.innerHTML = h;
    });
    $("#rtv-how", host).innerHTML = U.how[S.mode];
    lock();
  }
  function lock(){
    [].forEach.call(host.querySelectorAll("#rtv-mode button, #rtv-ctl button, #rtv-ctl input"), function(b){ b.disabled = busy; });
    var bi = $("#rtv-s-b", host); if (bi && S.sym) bi.disabled = true;
  }
  function setSl(id, v){ var i = $("#rtv-s-" + id, host), o = $("#rtv-o-" + id, host); if (i) i.value = v; if (o) o.textContent = FMT[id](v); }
  // ---- scene + readout ----
  function paint(){
    var rows = [], extra = "", leg = "", s = "";
    if (S.mode === "tension") {
      var T = tens(S.W, S.a, S.b), ex = exactAng();
      svg.setAttribute("viewBox", "0 0 360 250");
      s = S.view === "tri" ? triFig({ W:S.W, a:S.a, b:S.b, T:T, hide:hideT }) : rigFig({ W:S.W, a:S.a, b:S.b, T:T, hide:hideT, grow:grow });
      svg.setAttribute("aria-label", S.view === "tri" ? "Triangle of forces: the weight " + S.W + " N straight down, then the left rope’s tension, then the right rope’s, closing tip to tail." + (hideT ? "" : " Left rope " + n1(T[0]) + " N, right rope " + n1(T[1]) + " N.")
        : "Weight " + S.W + " N; left rope " + Math.round(S.a) + "°, " + (hideT ? "tension hidden" : n1(T[0]) + " N") + "; right rope " + Math.round(S.b) + "°, " + (hideT ? "tension hidden" : n1(T[1]) + " N") + ".");
      var h1 = T[0] * Math.cos(rad(S.a)), v1 = T[0] * Math.sin(rad(S.a)) + T[1] * Math.sin(rad(S.b));
      rows = [[R.t1, hideT ? "?" : exactTxt(T[0], "N", ex)], [R.t2, hideT ? "?" : exactTxt(T[1], "N", ex)],
        [R.check, hideT ? "?" : "Horizontal: " + m("T_1 cos α = T_2 cos β") + " = " + n1(h1) + " N ✓ · Vertical: " + m("T_1 sin α + T_2 sin β") + " = " + n1(v1) + " N = " + m("W") + " ✓"],
        [R.between, n1(180 - S.a - S.b) + "°"]];
      leg = legend([["p", "left rope " + m("vec{T}_1")], ["f", "right rope " + m("vec{T}_2")], ["k", "weight " + m("vec{W}")]]);
      extra = '<div class="rtv-strain" aria-hidden="' + hideT + '">' + [0, 1].map(function(i){
        var fr = hideT ? 0 : clamp(T[i] / (2 * S.W), 0, 1), hi = !hideT && T[i] > 1.5 * S.W;
        return '<div class="rtv-sbrow"><span class="tiny">' + (i ? "Right rope" : "Left rope") + '</span><span class="rtv-sbar"><i class="' + (hi ? "hi" : "") + '" style="width:' + P(fr * 100) + '%"></i></span><span class="tiny muted">2' + m("W") + "</span></div>";
      }).join("") + (!hideT && (T[0] > 1.5 * S.W || T[1] > 1.5 * S.W) ? '<p class="tiny rtv-snote">' + U.strain + "</p>" : "") + "</div>";
    } else if (S.mode === "river") {
      var K = crossing(S.rw, S.rc, S.rb, S.rp), f = prog != null ? prog : (S.landed ? 1 : 0);
      svg.setAttribute("viewBox", "0 0 360 260");
      s = riverFig({ w:S.rw, c:S.rc, boats:[{ b:S.rb, phi:S.rp, f:f, vec:true, pin:S.landed || prog === 1 }], clock:f > 0 ? "t = " + n1(f * K.T) + " s" : "" });
      svg.setAttribute("aria-label", "River " + S.rw + " m wide, current " + S.rc + " m/s east. Boat " + S.rb + " m/s through the water, heading " + fmtP(S.rp) + "." + (hideR ? "" : " It crosses in " + n1(K.T) + " s and lands " + landTxt(K.d) + "."));
      rows = [[R.gv, "(" + fx1(K.gx) + ", " + fx1(K.gy) + ") m/s · " + n1(K.sp) + " m/s"], [R.time, hideR ? "?" : n1(K.T) + " s"], [R.land, hideR ? "?" : landTxt(K.d)]];
      leg = legend([["p", "through the water"], ["f", "current"], ["k", "over the ground"]]);
    } else {
      var F = flight(S.as, S.ah, S.ws, S.wf), hid = tc3Hidden();
      svg.setAttribute("viewBox", "0 0 360 300");
      s = airFig({ as:S.as, ah:S.ah, ws:S.ws, wf:S.wf, hideG:hid || (hideA && gf == null), gf:gf });
      svg.setAttribute("aria-label", "Compass map. Heading " + brg(S.ah) + " at " + S.as + " km/h; wind from " + brg(S.wf) + " (toward " + brg(S.wf + 180) + ") at " + S.ws + " km/h." + (hid || hideA ? " Ground velocity hidden." : " Ground velocity " + trackTxt(F) + "."));
      rows = [[R.agv, hid ? U.hidden : hideA ? "?" : trackTxt(F)], [R.drift, hid ? U.hidden : hideA ? "?" : driftTxt(S.ah, F.tr)]];
      leg = legend([["p", "air velocity (heading)"], ["f", "wind"], ["k", "ground velocity (track)"]]);
    }
    svg.innerHTML = s;
    $("#rtv-read", host).innerHTML = MV.readoutHTML(rows);
    $("#rtv-leg", host).innerHTML = leg;
    $("#rtv-extra", host).innerHTML = extra;
  }
  function stop(){ if (anim) { anim(); anim = null; } prog = null; }
  function changed(){ api.save(); paint(); MV.changed(); }
  // ---- events ----
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || busy) return;
    var v = +e.target.value; S[id] = v; $("#rtv-o-" + id, host).textContent = FMT[id](v);
    if (id === "a" && S.sym) { S.b = v; setSl("b", v); }
    if (S.mode === "river") { S.landed = false; stop(); }
    if (id === "ah") S.tc3rev = false;
    hideT = hideR = hideA = false; grow = gf = null;
    changed();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.mode) { if (S.mode === b.dataset.mode) return; stop(); S.mode = b.dataset.mode; hideT = hideR = hideA = false; paintCtl(); changed(); return; }
    if (b.dataset.view) { if (S.view === b.dataset.view) return; S.view = b.dataset.view; paintCtl(); changed(); return; }
    if (b.dataset.tog === "sym") { S.sym = !S.sym; if (S.sym) S.b = S.a; paintCtl(); changed(); return; }
    if (b.id === "rtv-back") { stop(); S.landed = false; changed(); return; }
    if (b.id === "rtv-go") { go(null); }
  });
  function go(done){
    stop(); S.landed = false; busy = true; lock();
    var K = crossing(S.rw, S.rc, S.rb, S.rp);
    function fin(){ anim = null; prog = null; S.landed = true; busy = false; hideR = false; lock(); changed(); if (done) done(); }
    anim = MV.tween({ dur:clamp(K.T * 110, 2200, 4200), ease:lin, step:function(t){ prog = t; paint(); }, done:fin });
  }
  paintCtl(); paint();

  // ---- challenges ----
  function chal(id, opt){
    var Ms = MS[id], live = opt && opt.live;
    if (id === "tc1") {
      if (S.mode !== "tension") return { ok:false, msg:Ms.mode };
      if (S.W !== 120) return { ok:false, msg:Ms.w };
      if (!S.sym || S.a !== S.b) return { ok:false, msg:Ms.sym };
      if (S.a === 30) return { ok:true };
      return { ok:false, msg:Ms["a" + S.a] || Ms.a45 };
    }
    if (id === "tc2") {
      if (S.mode !== "river") return { ok:false, msg:Ms.mode };
      if (S.rc !== 3 || S.rb !== 6) return { ok:false, msg:Ms.set };
      if (S.rp === 30) return { ok:true };
      if (S.rp === -30) return { ok:false, msg:Ms.dn30 };
      if (S.rp === 0) return { ok:false, msg:Ms.zero };
      if (S.rp > 30) return { ok:false, msg:Ms.up };
      return { ok:false, msg:tpl(Ms.other, { d:landTxt(crossing(S.rw, 3, 6, S.rp).d) }) };
    }
    if (id === "tc3") {
      if (live) return { ok:false };   // the track stays hidden until Check challenge
      if (S.mode !== "air") return { ok:false, msg:Ms.mode };
      if (!tc3Setup()) return { ok:false, msg:Ms.set };
      S.tc3rev = true; api.save(); paint();
      if (S.ah === 30) return { ok:true };
      if (S.ah === 330) return { ok:false, msg:Ms.h330 };
      if (S.ah === 0) return { ok:false, msg:Ms.h000 };
      if (S.ah === 45 || S.ah === 60) return { ok:false, msg:Ms.over };
      var F = flight(S.as, S.ah, S.ws, S.wf);
      return { ok:false, msg:tpl(Ms.other, { h:brg(S.ah), t:F.tr == null ? "undefined" : brg(F.tr) }) };
    }
    return { ok:false };
  }
  // ---- predictions ----
  function setMode(md){ stop(); S.mode = md; paintCtl(); }
  return {
    predict:{
      start:function(p){
        stop(); busy = true; hideT = hideR = hideA = false; grow = gf = null;
        if (p.id === "p1") { S.mode = "tension"; S.view = "ropes"; S.sym = true; S.W = 100; S.a = S.b = 60; }
        if (p.id === "p2") { S.mode = "tension"; S.view = "ropes"; S.sym = false; S.W = 100; S.a = 30; S.b = 60; hideT = true; grow = 0; }
        if (p.id === "p3") { S.mode = "river"; S.rw = 80; S.rc = 3; S.rb = 4; S.rp = 0; S.landed = false; hideR = true; }
        if (p.id === "p4") { S.mode = "air"; S.as = 300; S.ah = 0; S.ws = 100; S.wf = 270; hideA = true; }
        setMode(S.mode); api.save(); paint();
      },
      run:function(p, done){
        function fin(){ busy = false; anim = null; hideT = hideR = hideA = false; grow = gf = null; prog = null; lock(); changed(); done(); }
        if (p.id === "p1") {
          anim = MV.tween({ dur:3600, ease:lin, step:function(t){ var th = 60 - 30 * t; S.a = S.b = th; setSl("a", Math.round(th)); setSl("b", Math.round(th)); paint(); },
            done:function(){ S.a = S.b = 30; setSl("a", 30); setSl("b", 30); fin(); } });
        } else if (p.id === "p2") {
          anim = MV.tween({ dur:1800, ease:lin, step:function(t){ grow = t; paint(); }, done:function(){ grow = null; hideT = false; paint(); MV.wait(500, fin); } });
        } else if (p.id === "p3") {
          go(function(){ fin(); });
        } else if (p.id === "p4") {
          gf = 0;
          anim = MV.tween({ dur:2200, ease:lin, step:function(t){ gf = t; paint(); }, done:function(){ gf = null; hideA = false; paint(); MV.wait(500, fin); } });
        } else fin();
      }
    },
    challenge:function(id, opt){ return chal(id, opt); },
    stop:function(){ if (anim && !busy) stop(); }
  };
}

// =====================================================================================================================
// Part 3: wind and current
// @component V3 triangleLabeller (MCV4U 42; tap-to-place chips adapted from MCV4U 19 setupSlots) — a velocity triangle with
// unlabelled sides a, b, c; tap a label chip, then a side (or a side, then a chip). A right label locks and colours its side
// (air --pen, wind --f3, ground --ink); a wrong one gets the role's feedback. When done, heading (dashed) and track (solid) show.
function triLabeller(host, o){   // o: {tri, chips, fb, st:{placed:{side:role}}, save, both}
  var st = o.st, sel = null, act = null, msg = null, T = o.tri;
  st.placed = st.placed || {};
  var ROLE = {}; Object.keys(T.sides).forEach(function(k){ ROLE[T.sides[k]] = k; });
  var vec = { air:T.air, wind:T.wind }; vec.ground = [T.air[0] + T.wind[0], T.air[1] + T.wind[1]];
  var second = T.first === "air" ? "wind" : "air", p0 = [0, 0], p1 = vec[T.first], p2 = vec.ground;
  var seg = {}; seg[T.first] = [p0, p1]; seg[second] = [p1, p2]; seg.ground = [p0, p2];
  function done(){ return ["a", "b", "c"].every(function(k){ return st.placed[k]; }); }
  function fig(){
    var pts = [p0, p1, p2], xs = pts.map(function(p){ return p[0]; }), ys = pts.map(function(p){ return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var k = Math.min(200 / Math.max(1, x1 - x0), 150 / Math.max(1, y1 - y0)), ox = 160 - k * (x0 + x1) / 2, oy = 112 + k * (y0 + y1) / 2;
    function X(p){ return ox + k * p[0]; } function Y(p){ return oy - k * p[1]; }
    var cx = (X(p0) + X(p1) + X(p2)) / 3, cy = (Y(p0) + Y(p1) + Y(p2)) / 3, s = "", D = done();
    s += arrow(26, 50, 26, 18, "k", 2) + txt(26, 64, "N", "rtv-tk");
    if (D) {   // heading (dashed, along the air velocity from the start) and track (solid, along the ground velocity)
      var al = Math.hypot(T.air[0], T.air[1]), gl = Math.hypot(vec.ground[0], vec.ground[1]);
      s += '<line class="rtv-head" x1="' + P(X(p0)) + '" y1="' + P(Y(p0)) + '" x2="' + P(X(p0) + T.air[0] / al * 230) + '" y2="' + P(Y(p0) - T.air[1] / al * 230) + '"/>';
      s += '<line class="rtv-trk" x1="' + P(X(p0)) + '" y1="' + P(Y(p0)) + '" x2="' + P(X(p0) + vec.ground[0] / gl * 230) + '" y2="' + P(Y(p0) - vec.ground[1] / gl * 230) + '"/>';
    }
    ["a", "b", "c"].forEach(function(sd){
      var role = T.sides[sd], sg = seg[role], A = sg[0], B = sg[1], lab = st.placed[sd];
      s += arrow(X(A), Y(A), X(B), Y(B), lab ? { air:"p", wind:"f", ground:"k" }[role] : "n", 3);
      var mx = (X(A) + X(B)) / 2, my = (Y(A) + Y(B)) / 2, dx = mx - cx, dy = my - cy, dl = Math.hypot(dx, dy) || 1;
      s += txt(mx + dx / dl * 16, my + dy / dl * 16 + 4, lab ? sd + ": " + { air:"air", wind:"wind", ground:"ground" }[role] : sd, lab ? "rtv-t" + { air:"p", wind:"f", ground:"k" }[role] : "rtv-tk rtv-big", dx < -4 ? "end" : dx > 4 ? "start" : "middle");
    });
    s += '<circle class="rtv-ring" cx="' + P(X(p0)) + '" cy="' + P(Y(p0)) + '" r="3.5"/>';
    return '<svg class="rtv-svg rtv-tsvg" viewBox="0 0 320 224" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="' + MV.esc("Velocity triangle with sides a, b and c joined tip to tail from a start point. " + T.brief.replace(/<[^>]+>/g, "") + (D ? " All sides labelled; the dashed line is the heading and the solid line the track." : "")) + '">' + s + "</svg>";
  }
  function paint(){
    var D = done(), F = flight(Math.hypot(T.air[0], T.air[1]), nb(deg(Math.atan2(T.air[0], T.air[1]))), Math.hypot(T.wind[0], T.wind[1]), nb(deg(Math.atan2(T.wind[0], T.wind[1])) + 180));
    MV.keepFocus(host, function(){
      var h = '<div class="rtv-s1grid"><div>' + fig() + '</div><div><div class="rtv-slots">' + ["a", "b", "c"].map(function(sd){
        var lab = st.placed[sd], ch = lab ? o.chips.filter(function(c){ return c.id === lab; })[0] : null;
        return '<button type="button" class="rtv-slot' + (lab ? " full" : "") + (act === sd ? " on" : "") + '" data-side="' + sd + '" data-k="s1' + T.id + sd + '" aria-pressed="' + (act === sd) + '"' + (lab ? " disabled" : "") +
          ' aria-label="' + MV.esc("Side " + sd + ": " + (ch ? MV.plain(ch.t) : "unlabelled")) + '"><span class="rtv-sll">Side ' + sd + '</span><span class="rtv-slv">' + (ch ? "✓ " + ch.t : "unlabelled") + "</span></button>";
      }).join("") + "</div>";
      if (!D) h += '<div class="rtv-tray" role="group" aria-label="Labels">' + o.chips.map(function(c){
        var used = Object.keys(st.placed).some(function(k){ return st.placed[k] === c.id; });
        return used ? "" : '<button type="button" class="chip" data-chip="' + c.id + '" data-k="s1c' + T.id + c.id + '" aria-pressed="' + (sel === c.id) + '">' + c.t + "</button>";
      }).join("") + "</div>";
      if (D) h += MV.fbHTML("good", "<strong>✓ Triangle named.</strong> Heading " + brg(F ? nb(deg(Math.atan2(T.air[0], T.air[1]))) : 0) + ", airspeed " + Math.round(Math.hypot(T.air[0], T.air[1])) + " km/h; track " + brg(F.tr) + ", ground speed " + (isInt(F.sp) ? Math.round(F.sp) : "≈ " + n1(F.sp)) + " km/h. " + o.both);
      else if (msg) h += MV.fbHTML(msg.good ? "good" : "bad", msg.html);
      else h += '<p class="tiny muted">' + (sel ? "Now tap the side for this label." : act ? "Now tap the label for this side." : "Tap a label, then its side.") + "</p>";
      host.innerHTML = h + "</div></div>";
    });
  }
  function place(cid, sd){
    sel = null; act = null;
    if (T.sides[sd] === cid) { st.placed[sd] = cid; msg = done() ? null : { good:true, html:"<strong>✓ Side " + sd + "</strong> is the " + MV.plain(o.chips.filter(function(c){ return c.id === cid; })[0].t) + "." }; }
    else msg = { good:false, html:"<strong>✗ Not quite.</strong> " + o.fb[cid] + " Try again." };
    o.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.chip) { msg = null; if (act) place(b.dataset.chip, act); else { sel = sel === b.dataset.chip ? null : b.dataset.chip; paint(); } return; }
    if (b.dataset.side) { msg = null; if (sel) place(sel, b.dataset.side); else { act = act === b.dataset.side ? null : b.dataset.side; paint(); } }
  });
  paint();
}

function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2, D = C.st3;
  if (!A.tris.some(function(t){ return t.id === S.tri; })) S.tri = A.tris[0].id;
  S.lab = S.lab || {};
  var s2 = S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {};
  s2.b = snap(s2.b, 1, 10, 1, 6); s2.c = snap(s2.c, 0, 6, 1, 3); s2.p = snap(s2.p, -75, 75, 15, 0); s2.lock = !!s2.lock;
  host.innerHTML = '<div class="rtv-p3">' +
    '<section class="rtv-st"><h3>' + A.title + '</h3><p class="how">' + A.how + '</p><div class="seg-wrap" id="rtv-p3tabs"></div><p class="rtv-brief" id="rtv-brief"></p><div id="rtv-s1"></div></section>' +
    '<section class="rtv-st"><h3>' + B.title + '</h3><p class="how">' + B.how + '</p><div class="rtv-grid"><div class="rtv-scene"><svg class="rtv-svg" id="rtv-s2svg" viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"></svg>' +
      '<p class="tiny rtv-legend">' + legend([["p", "through the water"], ["f", "current"], ["k", "over the ground"]]) + '</p></div><div class="rtv-side"><div id="rtv-s2ctl"></div><dl class="read" id="rtv-s2read" aria-live="polite"></dl>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + B.alg.map(function(l, i){ return '<div class="rtv-line"><span class="rtv-ln">' + (i + 1) + ".</span> " + l + "</div>"; }).join("") + "</div></details></div></div></section>" +
    '<section class="rtv-st"><h3>' + D.title + '</h3><p class="how">' + D.how + '</p><svg class="rtv-svg" id="rtv-s3svg" viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"></svg>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="rtv-race" data-k="rtvrace">' + D.race + '</button></div><div id="rtv-s3out" aria-live="polite"></div></section></div>';
  // ---- station 1 ----
  var tabs = $("#rtv-p3tabs", host);
  function cur(){ return A.tris.filter(function(t){ return t.id === S.tri; })[0]; }
  function tdone(t){ var st = S.lab[t.id]; return !!(st && st.placed && ["a", "b", "c"].every(function(k){ return st.placed[k]; })); }
  function paintTabs(){ MV.keepFocus(tabs, function(){ tabs.innerHTML = '<span class="tiny rtv-lab">Flight plan</span>' + segBtns("tri", A.tris.map(function(t){ return { id:t.id, t:(tdone(t) ? "✓ " : "") + t.tab }; }), S.tri, "Flight plan"); }); }
  function paintTri(){
    var t = cur(); $("#rtv-brief", host).innerHTML = "<strong>Flight plan.</strong> " + t.brief;
    var box = $("#rtv-s1", host), fresh = box.cloneNode(false); box.parentNode.replaceChild(fresh, box);
    triLabeller(fresh, { tri:t, chips:A.chips, fb:A.fb, both:A.both, st:(S.lab[t.id] = S.lab[t.id] || {}), save:function(){ api.save(); paintTabs(); } });
  }
  tabs.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b || !b.dataset.tri || b.dataset.tri === S.tri) return; S.tri = b.dataset.tri; api.save(); paintTabs(); paintTri(); });
  paintTabs(); paintTri();
  // ---- station 2 ----
  var W2 = B.width, ctl = $("#rtv-s2ctl", host);
  function phiLock(){ return s2.c < s2.b ? deg(Math.asin(s2.c / s2.b)) : null; }
  function fmtP(v){ v = r9(v); return near(v, 0, 1e-9) ? "0° (straight across)" : (isInt(v) ? Math.round(Math.abs(v)) : Math.abs(v).toFixed(1)) + "° " + (v > 0 ? "upstream" : "downstream"); }
  function paintCtl2(){
    MV.keepFocus(ctl, function(){
      ctl.innerHTML = slider("s2b", "Boat speed through the water " + m("b"), 1, 10, 1, s2.b, s2.b + " m/s") + slider("s2c", "Current " + m("c"), 0, 6, 1, s2.c, s2.c + " m/s") +
        slider("s2p", "Heading " + m("φ"), -75, 75, 15, s2.p, fmtP(s2.p)) + '<div class="rtv-crow">' + togBtn("lock", B.lock, s2.lock) + "</div>";
    });
    var pi = $("#rtv-s-s2p", host); if (pi) pi.disabled = s2.lock;
  }
  function paint2(){
    var pl = phiLock(), phi = s2.lock && pl != null ? pl : s2.p, K = crossing(W2, s2.c, s2.b, phi), rows = [];
    $("#rtv-o-s2p", host).textContent = fmtP(phi);
    var sv = $("#rtv-s2svg", host);
    sv.innerHTML = riverFig({ w:W2, c:s2.c, boats:[{ b:s2.b, phi:phi, f:1, vec:true, pin:true }] });
    sv.setAttribute("aria-label", "River " + W2 + " m wide, current " + s2.c + " m/s. Boat " + s2.b + " m/s heading " + fmtP(phi) + "; it lands " + landTxt(K.d) + ".");
    if (pl == null) rows.push([B.rows.phi, '<span class="rtv-bad">' + B.impossible + "</span>"]);
    else {
      var ac = Math.sqrt(s2.b * s2.b - s2.c * s2.c), as = surd(ac), ts = surd(W2 / ac);
      rows.push([B.rows.phi, (isInt(pl) ? Math.round(pl) + "°" : "≈ " + pl.toFixed(1) + "°") + " upstream"]);
      rows.push([B.rows.across, m("√{" + s2.b + "^2 - " + s2.c + "^2}") + " = " + (as ? m(as) + (as.indexOf("√") >= 0 ? " ≈ " + n1(ac) : "") : "≈ " + n1(ac)) + " m/s"]);
      rows.push([B.rows.time, W2 + " ÷ " + n1(ac) + " " + (ts && ts.indexOf("√") < 0 && ts.indexOf("/") < 0 ? "= " + ts : "≈ " + n1(W2 / ac)) + " s"]);
    }
    rows.push(["This heading", fmtP(phi) + ": crosses in " + n1(K.T) + " s and lands " + landTxt(K.d)]);
    $("#rtv-s2read", host).innerHTML = MV.readoutHTML(rows);
  }
  ctl.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id) return;
    var v = +e.target.value, k = id.slice(2); s2[k] = v;
    if (k === "b") $("#rtv-o-s2b", host).textContent = v + " m/s"; if (k === "c") $("#rtv-o-s2c", host).textContent = v + " m/s";
    api.save(); paint2();
  });
  ctl.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b || b.dataset.tog !== "lock") return; s2.lock = !s2.lock; api.save(); paintCtl2(); paint2(); });
  paintCtl2(); paint2();
  // ---- station 3 ----
  var s3 = $("#rtv-s3svg", host), out = $("#rtv-s3out", host), race = $("#rtv-race", host), TA = 10, TB = 20 / Math.sqrt(3);
  function draw3(t){   // t in seconds of river time
    s3.innerHTML = riverFig({ w:60, c:3, boats:[{ b:6, phi:0, f:Math.min(1, t / TA), x0:70, pin:t >= TA, tag:"A" }, { b:6, phi:30, f:Math.min(1, t / TB), x0:250, pin:t >= TB, tag:"B" }], clock:"t = " + n1(t) + " s" });
    s3.setAttribute("aria-label", "Two boats cross a 60 m river with a 3 m/s current. Boat A heads straight across; boat B aims 30° upstream. " + (t >= TB ? "A lands 30 m downstream after 10 s; B lands directly opposite after about 11.5 s." : "Time " + n1(t) + " s."));
  }
  function result(){ out.innerHTML = '<dl class="read">' + MV.readoutHTML([["Boat A", D.a], ["Boat B", D.b]]) + "</dl>" + MV.fbHTML("good", "<strong>" + D.verdict + "</strong>"); }
  race.addEventListener("click", function(){
    race.disabled = true; out.innerHTML = "";
    MV.tween({ dur:4200, ease:lin, step:function(t){ draw3(t * TB); }, done:function(){ draw3(TB); result(); race.disabled = false; S.raced = true; api.save(); } });
  });
  draw3(S.raced ? TB : 0); if (S.raced) result();
  return {};
}

// =====================================================================================================================
// Practice — @component V8 vecBoxes (adapted from MCV4U 19 rateBoxes) — labelled answer boxes with units for tension and
// navigation answers: whole numbers, fractions and exact roots (20√3, 100/√3, 120/√80 through MV.mcv.S.parse; equivalent forms
// accepted, decimals refused when the answer is irrational), several boxes per item, named wrong values ({v, fb} on the first
// box or on box k; {vals:{k:v}, fb} for a whole set such as swapped tensions), first-try scoring, three-level hints.
function boxAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, SS = MV.mcv.S, EX = MV.mcv.exact;
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(q, i){
    return '<div class="q rtv-q" data-q="' + q.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + q.prompt + "</div>" + (q.star ? '<span class="tag">★</span>' : "") + '</div><div class="rtv-in"></div><div class="rtv-cl"></div></div>';
  }).join("");
  function clean(raw){
    return String(raw || "").replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/°$/, "").replace(/(km\/h|m\/s|N|m|s)$/, "")
      .replace(/sqrt\(?(\d+)\)?/gi, "√$1").replace(/√\((\d+)\)/g, "√$1");
  }
  function parse(raw){
    var t = clean(raw); if (!t) return { empty:true };
    var p = null; try { p = SS.parse(t); } catch (e) { p = null; }
    if (p) { var v = EX.value(p); if (isFinite(v)) return { v:v, dec:/\./.test(t) }; }
    var q = MV.parseNum(t); if (q && q.length === 1 && isFinite(q[0])) return { v:q[0], dec:/\./.test(t) };
    return { bad:true };
  }
  function target(s){ return parse(s).v; }
  function eq(x, y){ return near(x, y, 1e-9 * Math.max(1, Math.abs(y))); }
  function paintIn(q){
    var x = ist(q.id), el = $('[data-q="' + q.id + '"] .rtv-in', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="rtv-bxs">' + q.boxes.map(function(b){
        return '<label class="rtv-bx"><span>' + b.label + '</span><input class="numin rtv-num" data-bx="' + b.k + '" data-k="' + q.id + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(b.label).replace(/\s*=\s*$/, "") + (b.unit ? " in " + b.unit : "")) + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (b.unit ? '<span class="rtv-bu">' + b.unit + "</span>" : "") + "</label>";
      }).join("") + "</div>";
    });
  }
  function paintCl(q){
    var x = ist(q.id), c = $('[data-q="' + q.id + '"] .rtv-cl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + q.id + 'chk">Check</button>' + MV.hintBtn(q.id + "hint", x.hint) + "</div>" + MV.hintsHTML(q.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + q.display + ".</strong> " + (q.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[q.id]) h += MV.fbHTML(msgs[q.id].bad ? "bad" : "", msgs[q.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(q){ paintIn(q); paintCl(q); });
  function judge(q){
    var x = ist(q.id), ans = MV.ans(q), vals = {}, okK = {};
    for (var i = 0; i < q.boxes.length; i++) {
      var bx = q.boxes[i], r = parse(x.v[bx.k]), tv = target(ans[bx.k]);
      if (r.empty) return { err:"Type " + (q.boxes.length > 1 ? "every answer" : "your answer") + " first." };
      if (r.bad) return { err:"Type a number or an exact root, such as 80, 20√3 or 100/√3." };
      if (r.dec && !surdFree(ans[bx.k]) && !eq(r.v, tv)) return { err:"Give the exact value (with a root), not a decimal." };
      vals[bx.k] = r.v; okK[bx.k] = eq(r.v, tv);
    }
    if (q.boxes.every(function(b){ return okK[b.k]; })) return { ok:true };
    var k0 = q.boxes[0].k, w = (q.wrong || []).filter(function(z){
      if (z.vals) return Object.keys(z.vals).every(function(k){ return vals[k] != null && eq(vals[k], target(z.vals[k])); });
      var k = z.k || k0; return vals[k] != null && eq(vals[k], target(z.v));
    })[0];
    var part = q.boxes.length > 1 ? q.boxes.filter(function(b){ return okK[b.k]; }).map(function(b){ return MV.plain(b.label).replace(/\s*=\s*$/, ""); }) : [];
    var msg = w ? w.fb : (q.general || a.general);
    if (part.length) msg = "Your " + part.join(" and ") + " value is right; check the other. " + msg;
    return { ok:false, msg:msg };
  }
  function surdFree(s){ return String(s).indexOf("√") < 0; }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var qe = b.closest("[data-q]"); if (!qe) return;
    var q = a.items.filter(function(z){ return z.id === qe.dataset.q; })[0], x = ist(q.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(q); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(q);
    if (r.err) msgs[q.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[q.id] = null; paintIn(q); }
    else { x.tries++; msgs[q.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(q); MV.focusFb(qe);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(q){ var x = ist(q.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(q){ var x = ist(q.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(q.goal != null ? q.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// Performance task: Plan the crossing (60 m river, land opposite)
var task = (function(){
  var api = null, svg = null, W = 60;
  function gi(k, lo, hi, st){ var t = String(api.S[k] == null ? "" : api.S[k]).trim(), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi && (v - lo) % (st || 1) === 0 ? v : null; }
  function read(){ var c = gi("c", 1, 6), b = gi("b", 1, 10), p = gi("p", -75, 75, 15); return { c:c, b:b, p:p, valid:c != null && b != null && p != null }; }
  function pTxt(p){ return p === 0 ? "0° (straight across)" : Math.abs(p) + "° " + (p > 0 ? "upstream" : "downstream"); }
  function stepper(id, label, v, min, max, step){
    return '<div class="rtv-tstep"><label for="rtv-t' + id + '">' + label + "</label>" +
      '<button type="button" class="btn ghost sm" data-st="' + id + '" data-dir="-1" data-k="rtvt' + id + 'm" aria-label="Decrease ' + MV.esc(MV.plain(label)) + '">' + MINUS + "</button>" +
      '<input class="numin short" id="rtv-t' + id + '" data-tk="' + id + '" type="number" min="' + min + '" max="' + max + '" step="' + step + '" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + id + '" data-dir="1" data-k="rtvt' + id + 'p" aria-label="Increase ' + MV.esc(MV.plain(label)) + '">+</button></div>';
  }
  function refresh(){
    if (!svg) return;
    var d = read(), el = $("#rtv-tread");
    if (!d.valid) {
      svg.innerHTML = ""; svg.setAttribute("aria-label", "Enter a current, a ferry speed and a heading to see the crossing.");
      if (el) el.innerHTML = '<div><dd class="muted">Current: whole number from 1 to 6 m/s. Ferry speed: whole number from 1 to 10 m/s. Heading: −75 to 75 in steps of 15 (positive is upstream).</dd></div>';
      return;
    }
    var K = crossing(W, d.c, d.b, d.p), ac = r9(d.b * Math.cos(rad(d.p))), as = surd(ac);
    svg.innerHTML = riverFig({ w:W, c:d.c, boats:[{ b:d.b, phi:d.p, f:1, vec:true, pin:true }] });
    svg.setAttribute("aria-label", "Ferry " + d.b + " m/s heading " + pTxt(d.p) + " in a " + d.c + " m/s current on a 60 m river: it lands " + landTxt(K.d) + " after " + n1(K.T) + " s.");
    if (el) el.innerHTML = MV.readoutHTML([
      ["Upstream part " + m("b sin φ"), (as && d.p % 30 === 0 ? "" : "≈ ") + n1(d.b * Math.sin(rad(d.p))) + " m/s (current " + d.c + " m/s)"],
      ["Across speed " + m("b cos φ"), (as ? m(as) + (as.indexOf("√") >= 0 ? " ≈ " + n1(ac) : "") : "≈ " + n1(ac)) + " m/s"],
      ["Crossing time", "60 ÷ " + n1(ac) + " " + (isInt(K.T) ? "= " : "≈ ") + n1(K.T) + " s"],
      ["Landing point", landTxt(K.d)]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.c == null) { a.S.c = "2"; a.S.b = "5"; a.S.p = "0"; }
      inp.innerHTML = stepper("c", "Current " + m("c") + " (m/s)", a.S.c, 1, 6, 1) + stepper("b", "Ferry speed " + m("b") + " (m/s)", a.S.b, 1, 10, 1) + stepper("p", "Heading " + m("φ") + " (°, + upstream)", a.S.p, -75, 75, 15);
      pv.innerHTML = '<svg class="rtv-svg" viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="River"></svg><p class="tiny rtv-legend">' +
        legend([["p", "through the water"], ["f", "current"], ["k", "over the ground"]]) + '</p><dl class="read" id="rtv-tread" aria-live="polite" style="margin-top:10px"></dl>';
      svg = $("svg", pv);
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); refresh(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, dir = +b.dataset.dir, c0 = Number(a.S[k]), lim = { c:[1, 6, 1], b:[1, 10, 1], p:[-75, 75, 15] }[k];
        var base = isFinite(c0) ? Math.round((c0 - lim[0]) / lim[2]) * lim[2] + lim[0] : lim[0];
        a.S[k] = String(clamp(base + dir * lim[2], lim[0], lim[1]));
        $("#rtv-t" + k).value = a.S[k]; a.save(); refresh(); a.update();
      });
      refresh();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Current: whole number from 1 to 6 m/s. Ferry speed: whole number from 1 to 10 m/s. Heading: −75 to 75 in steps of 15."; },
    checks:function(d){
      if (!d.valid) return [false, false, false];
      var up = d.b * Math.sin(rad(d.p)), ac = d.b * Math.cos(rad(d.p));
      return [d.p > 0 && near(up, d.c, 1e-9), ac >= 4 - 1e-9, d.c >= 2];
    },
    key:function(d){ return d.c + "|" + d.b + "|" + d.p; },
    label:function(k){ var p = k.split("|"); return m("c") + " = " + p[0] + " m/s, " + m("b") + " = " + p[1] + " m/s, " + m("φ") + " = " + pTxt(+p[2]); },
    text:function(k){ var p = k.split("|"); return "c = " + p[0] + " m/s, b = " + p[1] + " m/s, φ = " + pTxt(+p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); EXS = r; return r; },
  part3:part3,
  activities:{ tension:boxAct, nav:boxAct },
  task:task,
  onShow:function(){ if (EXS && EXS.stop) EXS.stop(); }
});
})();
