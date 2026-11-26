// MCV4U 46 The Cross Product: hero (a⃗ × b⃗ built up in 3D), Explore "Right-hand rotator" (V1 3D view with Build, Swap and
// Angle modes, readout with tap-for-determinant components), Part 3 "Cross product properties" (five stations sharing one
// 3D view) and the "Area 9, pointing up" performance task. Practice uses toolkit activities (match, numeric, spot).
(function(){
"use strict";
var $ = MV.$, num = MV.num, MINUS = MV.MINUS, D2R = Math.PI / 180, AR = "⃗";
function m(s){ return MV.m(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]].map(function(v){ return v + 0; }); }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sc(k, a){ return [k * a[0], k * a[1], k * a[2]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function same(a, b){ return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
function sg(v){ v = Math.round(v * 1e9) / 1e9; return (v < 0 ? MINUS : "") + Math.abs(v); }
function vt(v){ return "(" + v.map(sg).join(", ") + ")"; }
function vs(v){ return "(" + v.map(function(x){ return String(Math.round(x * 1e9) / 1e9 + 0); }).join(", ") + ")"; }   // m() source
// n = k²r with r square-free -> m() source "k√{r}"
function radSrc(n){ var k = 1, r = n; for (var f = 2; f * f <= r; f++) while (r % (f * f) === 0) { r /= f * f; k *= f; } return r === 1 ? String(k) : (k === 1 ? "" : k) + "√{" + r + "}"; }
function lenHTML(n){ var s = radSrc(n); if (n === 0) return "0"; if (s.indexOf("√") < 0) return m("√{" + n + "} = " + s); return s === "√{" + n + "}" ? m(s) : m("√{" + n + "} = " + s); }
// special angles, exact (m() source): sine, cosine; for |b| = 2: 2cos, 2sin
var SPEC = {
  0:{ s:"0", c:"1", bx:"2", by:"0" }, 30:{ s:"1/2", c:"√3/2", bx:"√3", by:"1" }, 45:{ s:"√2/2", c:"√2/2", bx:"√2", by:"√2" },
  60:{ s:"√3/2", c:"1/2", bx:"1", by:"√3" }, 90:{ s:"1", c:"0", bx:"0", by:"2" }, 120:{ s:"√3/2", c:"-1/2", bx:"-1", by:"√3" },
  135:{ s:"√2/2", c:"-√2/2", bx:"-√2", by:"√2" }, 150:{ s:"1/2", c:"-√3/2", bx:"-√3", by:"1" }, 180:{ s:"0", c:"-1", bx:"-2", by:"0" }
};
// k·sin θ (k = 8 or 6) exact at the special angles
function kSin(k, th){
  var t = { 0:"0", 30:String(k / 2), 45:(k / 2) + "√2", 60:(k / 2) + "√3", 90:String(k), 120:(k / 2) + "√3", 135:(k / 2) + "√2", 150:String(k / 2), 180:"0" };
  return t[th] != null ? m(t[th]) : "≈ " + num(k * Math.sin(th * D2R), 2);
}
function kCos(k, th){
  var t = { 0:String(k), 30:(k / 2) + "√3", 45:(k / 2) + "√2", 60:String(k / 2), 90:"0", 120:"-" + (k / 2), 135:"-" + (k / 2) + "√2", 150:"-" + (k / 2) + "√3", 180:"-" + k };
  return t[th] != null ? m(t[th]) : "≈ " + num(k * Math.cos(th * D2R), 2);
}
// angle between integer vectors, exact at the special angles
function angInt(a, b){
  var A = dot(a, a), B = dot(b, b), d = dot(a, b), d2 = d * d, AB = A * B, k = null;
  if (!A || !B) return null;
  if (d === 0) k = 90; else if (d2 === AB) k = d > 0 ? 0 : 180; else if (4 * d2 === 3 * AB) k = d > 0 ? 30 : 150;
  else if (2 * d2 === AB) k = d > 0 ? 45 : 135; else if (4 * d2 === AB) k = d > 0 ? 60 : 120;
  return k != null ? { deg:k, exact:true, d:d } : { deg:Math.acos(clamp(d / Math.sqrt(AB), -1, 1)) / D2R, exact:false, d:d };
}
function degTxt(g){ return g.exact ? g.deg + "°" : "≈ " + num(g.deg, 1) + "°"; }

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view in SVG (course plan V1; built for MCV4U 46, self-contained, no libraries).
// Right-handed axes with z up. Drag or arrow keys rotate (Shift: 15° steps); set(name) jumps to a preset view: "iso"
// (isometric), "front" (xz), "side" (yz), "top" (xy). Colours are token names; text labels use a mini syntax: "~a" is the
// vector a⃗ (italic with an over-arrow), other letters italic, "-" becomes a true minus.
//   var V = view3d(host, {view:"iso", onTurn}); V.draw(scene); V.set("top");
//   scene = {R (half-length of the axes), axesAlpha, describe (screen-reader sentence),
//            vecs:[{v:[x,y,z], from, col:"--pen", w:3, dash:"11 7", lab:"~a", alpha}], polys:[{pts:[[x,y,z],…], col, alpha}],
//            marks:[{u, v, alpha}] (right-angle marks at the origin between directions u and v),
//            curl:{from, to, t (0–1), lab} (right-hand curl arc from one vector toward another), notes:[{p, text, col}],
//            caption:{text, alpha}}
// Styles: .cx-v … in app.css (tokens only; plane fills 14% light, 22% dark).
var VIEWS = { iso:{ phi:45, eps:35.26 }, front:{ phi:-90, eps:0 }, side:{ phi:0, eps:0 }, top:{ phi:-90, eps:90 } };
function svgTx(s){
  var out = "", t = String(s);
  for (var i = 0; i < t.length; i++) {
    var ch = t[i];
    if (ch === "~" && /[A-Za-z0-9]/.test(t[i + 1] || "")) { out += '<tspan class="cx-it">' + t[i + 1] + AR + "</tspan>"; i++; }
    else if (/[A-Za-z]/.test(ch)) out += '<tspan class="cx-it">' + ch + "</tspan>";
    else if (ch === "-") out += MINUS;
    else if (ch === "&") out += "&amp;"; else if (ch === "<") out += "&lt;"; else if (ch === ">") out += "&gt;";
    else out += ch;
  }
  return out;
}
function view3d(host, o){
  o = o || {};
  var v0 = VIEWS[o.view || "iso"], cam = { phi:v0.phi, eps:v0.eps }, scene = null, CX = 200, CY = 200, drag = null;
  host.innerHTML = '<div class="cx-v" tabindex="0" role="img" aria-label="3D view"><svg viewBox="0 0 400 400" aria-hidden="true" focusable="false"></svg></div>';
  var box = host.firstChild, svg = box.firstChild;
  function q(v){ return Math.round(v * 10) / 10; }
  function render(S){
    var p = cam.phi * D2R, e = cam.eps * D2R, R = S.R || 5, k = 160 / R;
    var r = [-Math.sin(p), Math.cos(p), 0], u = [-Math.cos(p) * Math.sin(e), -Math.sin(p) * Math.sin(e), Math.cos(e)];
    function P(x){ return [CX + dot(x, r) * k, CY - dot(x, u) * k]; }
    function ln(a, b, st, cls){ return '<line' + (cls ? ' class="' + cls + '"' : "") + ' x1="' + q(a[0]) + '" y1="' + q(a[1]) + '" x2="' + q(b[0]) + '" y2="' + q(b[1]) + '" style="' + st + '"/>'; }
    function head(a, b, hl, col){
      var d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]); if (L < 0.5) return "";
      var w = [d[0] / L, d[1] / L], n = [-w[1], w[0]], hw = hl * 0.42, c = [b[0] - w[0] * hl, b[1] - w[1] * hl];
      return '<polygon points="' + q(b[0]) + "," + q(b[1]) + " " + q(c[0] + n[0] * hw) + "," + q(c[1] + n[1] * hw) + " " + q(c[0] - n[0] * hw) + "," + q(c[1] - n[1] * hw) + '" style="fill:var(' + col + ')"/>';
    }
    function txt(x, y, s, cls, anchor, st){ return '<text class="' + (cls || "cx-lab") + '" x="' + q(x) + '" y="' + q(y) + '" text-anchor="' + (anchor || "middle") + '"' + (st ? ' style="' + st + '"' : "") + ">" + svgTx(s) + "</text>"; }
    function labAt(tip, dir, s, st){
      var L = Math.hypot(dir[0], dir[1]), w = L > 1 ? [dir[0] / L, dir[1] / L] : [0.7, -0.7];
      var x = tip[0] + w[0] * 15, y = tip[1] + w[1] * 15 + 5, an = w[0] > 0.35 ? "start" : w[0] < -0.35 ? "end" : "middle";
      return txt(clamp(x, 8, 392), clamp(y, 16, 394), s, "cx-lab", an, st);
    }
    var O = P([0, 0, 0]), h = "", labs = "";
    (S.polys || []).forEach(function(g){
      h += '<polygon class="cx-poly" points="' + g.pts.map(function(x){ var s = P(x); return q(s[0]) + "," + q(s[1]); }).join(" ") + '" style="fill:var(' + (g.col || "--pen") + ");opacity:" + (g.alpha == null ? 1 : g.alpha) + '"/>';
    });
    var aa = S.axesAlpha == null ? 1 : S.axesAlpha, step = R <= 6 ? 1 : R <= 14 ? 2 : 5;
    h += '<g style="opacity:' + q(aa * 100) / 100 + '">';
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function(ax, i){
      var pp = P(sc(R, ax)), pn = P(sc(-R, ax)), d = [pp[0] - O[0], pp[1] - O[1]], L = Math.hypot(d[0], d[1]);
      h += ln(O, pn, "", "cx-axn") + ln(O, pp, "", "cx-ax") + head(O, pp, 9, "--ink-2");
      if (L > 2) {
        var w = [d[0] / L, d[1] / L], nn = [-w[1] * 4, w[0] * 4], last = 0;
        for (var t = step; t <= R - 0.35 * step; t += step) { var c = P(sc(t, ax)); h += ln([c[0] - nn[0], c[1] - nn[1]], [c[0] + nn[0], c[1] + nn[1]], "", "cx-tick"); last = t; }
        if (last && L > 60) { var cl = P(sc(last, ax)); h += txt(cl[0] + nn[0] * 3, cl[1] + nn[1] * 3 + 4, String(last), "cx-tl"); }
      }
      labs += labAt(pp, d, ["x", "y", "z"][i], "");
    });
    h += "</g>";
    (S.marks || []).forEach(function(mk){
      var lu = len(mk.u), lv = len(mk.v); if (lu < 1e-9 || lv < 1e-9) return;
      var s = R * 0.08, a = sc(s / lu, mk.u), b = sc(s / lv, mk.v), A = P(a), B = P(add(a, b)), C = P(b);
      h += '<polyline class="cx-mark" points="' + [A, B, C].map(function(x){ return q(x[0]) + "," + q(x[1]); }).join(" ") + '" style="opacity:' + (mk.alpha == null ? 1 : mk.alpha) + '"/>';
    });
    if (S.curl) {
      var f = S.curl.from, g = S.curl.to, lf = len(f), lg = len(g);
      if (lf > 1e-9 && lg > 1e-9) {
        var ah = sc(1 / lf, f), perp = add(g, sc(-dot(g, ah), ah)), lp = len(perp);
        if (lp > 1e-6 * lg) {
          var eh = sc(1 / lp, perp), th = Math.acos(clamp(dot(f, g) / (lf * lg), -1, 1)) * (S.curl.t == null ? 1 : S.curl.t), rr = Math.min(lf, lg, R * 0.6) * 0.5, pts = [];
          for (var j = 0; j <= 28; j++) { var tt = th * j / 28; pts.push(P(add(sc(rr * Math.cos(tt), ah), sc(rr * Math.sin(tt), eh)))); }
          if (th > 0.05) {
            h += '<polyline class="cx-curl" points="' + pts.map(function(x){ return q(x[0]) + "," + q(x[1]); }).join(" ") + '"/>' + head(pts[pts.length - 3], pts[pts.length - 1], 10, "--ink-2");
            if (S.curl.lab) { var mid = pts[14]; labs += txt(mid[0] + (mid[0] - O[0]) * 0.25, mid[1] + (mid[1] - O[1]) * 0.25 + 4, S.curl.lab, "cx-tl", "middle"); }
          }
        }
      }
    }
    (S.vecs || []).forEach(function(V){
      if (!V) return;
      var from = V.from || [0, 0, 0], a = P(from), b = P(add(from, V.v)), d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]), w = V.w || 3, op = V.alpha == null ? 1 : V.alpha;
      if (L < 0.8) return;
      var hl = Math.min(12 + w, L * 0.45), wv = [d[0] / L, d[1] / L], base = [b[0] - wv[0] * hl * 0.8, b[1] - wv[1] * hl * 0.8];
      h += '<g style="opacity:' + op + '">' + ln(a, base, "stroke:var(" + V.col + ");stroke-width:" + w + "px" + (V.dash ? ";stroke-dasharray:" + V.dash : ""), "cx-vl") + head(a, b, hl, V.col) + "</g>";
      if (V.lab) labs += labAt(b, d, V.lab, "fill:var(" + (V.labCol || "--ink") + ");opacity:" + op);
    });
    (S.notes || []).forEach(function(n){ var p0 = P(n.p); labs += txt(p0[0] + (n.dx || 0), p0[1] + (n.dy || 0), n.text, "cx-lab", n.anchor || "middle", n.col ? "fill:var(" + n.col + ")" : ""); });
    if (S.caption && S.caption.text) labs += txt(200, 388, S.caption.text, "cx-cap", "middle", "opacity:" + (S.caption.alpha == null ? 1 : S.caption.alpha));
    return h + labs;
  }
  function draw(s){ if (s) scene = s; if (!scene) return; svg.innerHTML = render(scene); box.setAttribute("aria-label", (scene.describe || "3D view.") + " Drag, or use the arrow keys, to rotate the view."); }
  function turn(dp, de){ cam.phi = ((cam.phi + dp + 540) % 360) - 180; cam.eps = clamp(cam.eps + de, -90, 90); draw(); if (o.onTurn) o.onTurn(); }
  box.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, id:e.pointerId }; box.classList.add("grab"); try { box.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
  box.addEventListener("pointermove", function(e){ if (!drag || e.pointerId !== drag.id) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; if (dx || dy) turn(-dx * 0.5, dy * 0.5); });
  function end(){ drag = null; box.classList.remove("grab"); }
  box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
  box.addEventListener("keydown", function(e){
    var st = e.shiftKey ? 15 : 5, k = e.key;
    if (k === "ArrowLeft") turn(-st, 0); else if (k === "ArrowRight") turn(st, 0); else if (k === "ArrowUp") turn(0, st); else if (k === "ArrowDown") turn(0, -st); else return;
    e.preventDefault();
  });
  return { draw:draw, set:function(n){ var v = VIEWS[n]; if (!v) return; cam.phi = v.phi; cam.eps = v.eps; draw(); }, box:box };
}
// view presets as a segmented control under a view
function viewSeg(host, V){
  var seg = MV.seg(host, { label:"View", options:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"top", t:"Top" }, { id:"side", t:"Side" }], value:"iso",
    onChange:function(id){ V.set(id); } });
  return seg;
}
// ------------------------------------------------- end of V1 view3d -----------------------------------------------------

// plain-text vector for screen readers
function pv(v){ return "(" + v.map(function(x){ return (x < 0 ? "−" : "") + num(Math.abs(Math.round(x * 100) / 100), 2); }).join(", ") + ")"; }
function stepperHTML(id, lab, aria){
  return '<span class="cx-st"><span class="cx-stl">' + lab + '</span><button type="button" class="btn ghost sm" data-st="' + id + '" data-d="-1" data-k="cxst' + id + 'm" aria-label="Decrease ' + aria + '">' + MINUS + "</button>" +
    '<input class="numin cx-in" type="number" min="-4" max="4" step="1" id="cx-in-' + id + '" data-sti="' + id + '" aria-label="' + aria + ', a whole number from −4 to 4">' +
    '<button type="button" class="btn ghost sm" data-st="' + id + '" data-d="1" data-k="cxst' + id + 'p" aria-label="Increase ' + aria + '">+</button></span>';
}
var SUBS = ["₁", "₂", "₃"];

// ---------- hero: axes, a⃗, b⃗, the parallelogram, the curl, a⃗ × b⃗ rising, right-angle marks, the caption ----------
function hero(f){
  var host = $("#cx-hero-v"); if (!host) return;
  var V = view3d(host, {}), stop = null, a = [3, 0, 0], b = [1, 2, 0], c = [0, 0, 6];
  if (f.cap && MV.C.hero.caption) f.cap.innerHTML = MV.C.hero.caption;
  function seg(t, t0, t1){ return clamp((t - t0) / (t1 - t0), 0, 1); }
  function scene(t){
    var sa = seg(t, 0.1, 0.24), sb = seg(t, 0.24, 0.38), pf = seg(t, 0.38, 0.48), cu = seg(t, 0.48, 0.62), cr = seg(t, 0.62, 0.78), mk = seg(t, 0.78, 0.88), cp = seg(t, 0.88, 1);
    return { R:6.8, axesAlpha:seg(t, 0, 0.1),
      polys:pf > 0 ? [{ pts:[[0, 0, 0], a, add(a, b), b], col:"--pen", alpha:pf }] : [],
      curl:cu > 0 ? { from:a, to:b, t:cu, lab:cu === 1 ? "right hand" : "" } : null,
      marks:mk > 0 ? [{ u:c, v:a, alpha:mk }, { u:c, v:b, alpha:mk }] : [],
      vecs:[sa > 0 ? { v:sc(sa, a), col:"--pen", w:3, lab:sa === 1 ? "~a" : "" } : null, sb > 0 ? { v:sc(sb, b), col:"--f3", w:3, lab:sb === 1 ? "~b" : "" } : null,
        cr > 0 ? { v:sc(cr, c), col:"--ink", w:3.6, lab:cr === 1 ? "~a × ~b" : "" } : null],
      caption:{ text:"length 6 = area 6", alpha:cp },
      describe:"a = (3, 0, 0) in blue and b = (1, 2, 0) in teal span a shaded parallelogram. A right-hand curl turns from a toward b, and a × b = (0, 0, 6) rises straight up from the origin at right angles to both. Length 6 = area 6." };
  }
  function play(){ if (stop) stop(); stop = MV.tween({ dur:7000, ease:function(t){ return t; }, step:function(t){ V.draw(scene(t)); }, done:function(){ stop = null; } }); }
  V.draw(scene(MV.reduceMotion ? 1 : 0));
  var rb = $("#cx-hero-replay"); if (rb) rb.addEventListener("click", play);
  if (!MV.reduceMotion) MV.wait(700, play);
}

// ---------- Explore: right-hand rotator ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["build", "swap", "angle"].indexOf(S.mode) < 0) S.mode = "build";
  if (!Array.isArray(S.a)) S.a = [1, 2, 2];
  if (!Array.isArray(S.b)) S.b = [2, 1, -2];
  if (typeof S.th !== "number") S.th = 90;
  ["par", "hand", "ra"].forEach(function(k){ if (typeof S[k] !== "boolean") S[k] = true; });
  if (!Array.isArray(S.tc3)) S.tc3 = [];
  var busy = false, live = {}, stop = null, comp = null;
  host.innerHTML = '<div class="cx-ex"><div class="cx-main" data-mv="graph"><p class="eq-cap cx-eq" id="cx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="cx-view" class="cx-vhost"></div><div id="cx-views" class="cx-views"></div>' +
    '<div class="cx-tog" role="group" aria-label="Show or hide">' +
      '<label class="cx-ck"><input type="checkbox" id="cx-par"> Show parallelogram</label>' +
      '<label class="cx-ck"><input type="checkbox" id="cx-hand"> Show right hand</label>' +
      '<label class="cx-ck"><input type="checkbox" id="cx-ra"> Show right-angle marks</label></div>' +
    '<p class="tiny muted cx-key">' + m("vec{a}") + ' blue · ' + m("vec{b}") + ' teal · ' + m("vec{a} × vec{b}") + ' ink, thickest' + ' · ' + m("vec{b} × vec{a}") + ' ink, long dashes (Swap) · shaded: the parallelogram. Drag the view or use the arrow keys (Shift for 15°) to rotate.</p></div>' +
    '<div class="cx-side"><div id="cx-mode"></div><p class="tiny muted" id="cx-how"></p>' +
      '<div id="cx-build"><p class="tiny cx-lab2">Presets</p><div class="chips" role="group" aria-label="Presets">' + C.presets.map(function(p){ return '<button type="button" class="chip" data-pre="' + p.id + '" data-k="cxpre' + p.id + '">' + p.t + "</button>"; }).join("") + "</div>" +
        ["a", "b"].map(function(v){ return '<div class="cx-strow"><span class="cx-vn">' + m("vec{" + v + "}") + '</span><div class="cx-sts">' + [0, 1, 2].map(function(i){ return stepperHTML(v + i, m(v + "_" + (i + 1)), v + SUBS[i]); }).join("") + "</div></div>"; }).join("") + "</div>" +
      '<div id="cx-angle"><label class="slider"><span class="slider-top"><span>Angle θ</span><output id="cx-thout"></output></span><input type="range" id="cx-th" min="0" max="180" step="15" style="accent-color:var(--ink)" aria-label="Angle θ between a and b, 0° to 180° in steps of 15°"></label></div>' +
      '<dl class="read cx-read" id="cx-read" aria-live="polite"></dl><p class="tiny cx-detl" id="cx-det" aria-live="polite"></p><p class="tiny muted" id="cx-tc3"></p></div></div>';
  var V = view3d($("#cx-view", host), { onTurn:function(){ vseg.set(null); } }), vseg = viewSeg($("#cx-views", host), V);
  var mseg = MV.seg($("#cx-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(id){
    if (busy) { mseg.set(S.mode); return; }
    S.mode = id; comp = null; api.save(); paintAll(); MV.changed();
  } });
  function vecs(){
    if (S.mode === "angle") { var th = live.th != null ? live.th : S.th; return { a:[4, 0, 0], b:[2 * Math.cos(th * D2R), 2 * Math.sin(th * D2R), 0], th:th }; }
    return { a:S.a, b:live.b || S.b };
  }
  function paintView(){
    var W = vecs(), a = W.a, b = W.b, c = cross(a, b), lc = len(c), cs = live.cross == null ? 1 : live.cross, sw = S.mode === "swap" ? (live.swap == null ? 1 : live.swap) : 0;
    var R = S.mode === "angle" ? 9 : Math.max(1.6, len(a), len(b), len(add(a, b)) * 0.8, lc) * 1.12;
    var par = len(a) > 1e-9 && len(b) > 1e-9 && lc < 1e-9;
    var sc0 = { R:R, polys:S.par ? [{ pts:[[0, 0, 0], a, add(a, b), b], col:"--pen" }] : [], vecs:[], marks:[], notes:[] };
    sc0.vecs.push({ v:a, col:"--pen", w:3, lab:"~a" }, { v:b, col:"--f3", w:3, lab:"~b" });
    if (cs > 0 && lc > 1e-9) sc0.vecs.push({ v:sc(cs, c), col:"--ink", w:3.6, lab:cs === 1 ? "~a × ~b" : "" });
    if (sw > 0 && lc > 1e-9) sc0.vecs.push({ v:sc(-sw, c), col:"--ink", w:3, dash:"11 7", lab:sw === 1 ? "~b × ~a" : "" });
    if (cs === 1 && lc < 1e-9) sc0.notes.push({ p:[0, 0, 0], text:par ? "~a × ~b = ~0 (parallel)" : "~a × ~b = ~0", dy:-14 });
    if (S.ra && cs === 1 && lc > 1e-9) sc0.marks.push({ u:c, v:a }, { u:c, v:b });
    if (S.hand && !par) sc0.curl = S.mode === "swap" ? { from:b, to:a, t:live.curl == null ? 1 : live.curl, lab:"right hand" } : { from:a, to:b, t:live.curl == null ? 1 : live.curl, lab:"right hand" };
    sc0.describe = "a = " + pv(a) + ", b = " + pv(b) + ", a × b = " + pv(c) + ", length " + num(lc, 2) + "." + (S.mode === "swap" ? " b × a = " + pv(sc(-1, c)) + " points the opposite way." : "") + (S.par ? " The parallelogram on a and b is shaded." : "");
    V.draw(sc0);
    // equation caption
    var eq = $("#cx-eq", host);
    if (S.mode === "angle") eq.innerHTML = m("vec{a} = (4, 0, 0)") + ", " + m("|vec{b}| = 2") + ", θ = " + (live.th != null ? "≈ " + Math.round(W.th) : W.th) + "°";
    else eq.innerHTML = m("vec{a} = " + vs(a)) + ", " + m("vec{b} = " + vs(b.map(function(x){ return Math.round(x * 100) / 100; })));
    paintRead(W, c);
  }
  function paintRead(W, c){
    var a = W.a, b = W.b, el = $("#cx-read", host), rows = [], hidden = live.cross === 0 || live.swap === 0, det = $("#cx-det", host);
    if (S.mode === "angle") {
      var th = W.th, ex = live.th == null && SPEC[th] != null;
      rows.push([m("vec{b}"), ex ? m("(" + SPEC[th].bx + ", " + SPEC[th].by + ", 0)") : "≈ " + vt(b.map(function(x){ return Math.round(x * 100) / 100; }))]);
      rows.push([m("vec{a} × vec{b}"), hidden ? "?" : ex ? m("(0, 0, ") + kSin(8, th) + m(")") : "≈ " + vt([0, 0, Math.round(c[2] * 100) / 100])]);
      rows.push(["Perpendicular check", m("vec{a} · (vec{a} × vec{b}) = 0") + " ✓ · " + m("vec{b} · (vec{a} × vec{b}) = 0") + " ✓"]);
      rows.push(["Length " + m("|vec{a} × vec{b}|"), ex ? kSin(8, th) : "≈ " + num(Math.abs(c[2]), 2)]);
      rows.push(["Parallelogram area", ex ? kSin(8, th) : "≈ " + num(Math.abs(c[2]), 2)]);
      rows.push(["Angle θ", (ex ? th : "≈ " + Math.round(th)) + "° (" + m("vec{a} · vec{b}") + " = " + (ex ? kCos(8, th) : "≈ " + num(8 * Math.cos(th * D2R), 2)) + ")"]);
      rows.push([m("|vec{a}||vec{b}| sin θ"), "4 × 2 × " + (ex ? m(SPEC[th].s) : "sin θ") + " = " + (ex ? kSin(8, th) : "≈ " + num(8 * Math.sin(th * D2R), 2))]);
      det.innerHTML = "";
    } else {
      var n = dot(c, c), g = angInt(a, b);
      rows.push([m("vec{a} × vec{b}"), hidden && live.cross === 0 ? "?" : "(" + c.map(function(v, i){ return '<button type="button" class="cx-cb" data-comp="' + i + '" data-k="cxcomp' + i + '" aria-pressed="' + (comp === i) + '" aria-label="Component ' + (i + 1) + ": " + sg(v) + ', show its determinant">' + sg(v) + "</button>"; }).join(", ") + ")"]);
      rows.push(["Perpendicular check", m("vec{a} · (vec{a} × vec{b}) = " + sg(dot(a, c))) + " ✓ · " + m("vec{b} · (vec{a} × vec{b}) = " + sg(dot(b, c))) + " ✓"]);
      rows.push(["Length " + m("|vec{a} × vec{b}|"), lenHTML(n)]);
      rows.push(["Parallelogram area", m(radSrc(n))]);
      rows.push(["Angle θ", g ? degTxt(g) + " (" + m("vec{a} · vec{b} = " + sg(g.d)) + ")" : "undefined (a zero vector)"]);
      rows.push([m("|vec{a}||vec{b}| sin θ"), g ? m(radSrc(dot(a, a))) + " × " + m(radSrc(dot(b, b))) + " × " + (g.exact ? m(SPEC[g.deg].s) + " = " + m(radSrc(n)) : "sin " + num(g.deg, 1) + "° ≈ " + num(Math.sqrt(n), 2)) : "0"]);
      if (S.mode === "swap") rows.push([m("vec{b} × vec{a}"), live.swap === 0 ? "?" : m(vs(sc(-1, c)) + " = -(vec{a} × vec{b})")]);
      if (comp != null && !(hidden && live.cross === 0)) {
        var F = [["a_2b_3 - a_3b_2", 1, 2, 2, 1], ["a_3b_1 - a_1b_3", 2, 0, 0, 2], ["a_1b_2 - a_2b_1", 0, 1, 1, 0]][comp];
        det.innerHTML = "Component " + (comp + 1) + ": " + m(F[0]) + " = " + sg(a[F[1]]) + "(" + sg(b[F[2]]) + ") " + MINUS + " " + sg(a[F[3]]) + "(" + sg(b[F[4]]) + ") = " + sg(c[comp]);
      } else det.innerHTML = '<span class="muted">Tap a component of ' + m("vec{a} × vec{b}") + " to see its 2 × 2 determinant.</span>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = MV.readoutHTML(rows); });
    paintTc3();
  }
  // TC3 tracker: every b⃗ in the answer set is recorded as soon as it is set
  var TC3 = [[0, 0, 1], [1, 2, 3], [-1, -2, -1], [-2, -4, -3]];
  function tc3Live(){
    if (S.mode === "angle" || !same(S.a, [1, 2, 2])) return false;
    var hit = TC3.some(function(t){ return same(t, S.b); }), key = S.b.join(",");
    if (hit && S.tc3.indexOf(key) < 0) { S.tc3.push(key); api.save(); }
    return hit;
  }
  function paintTc3(){
    var el = $("#cx-tc3", host), M = MS.tc3;
    if (S.mode === "angle" || !same(S.a, [1, 2, 2])) { el.innerHTML = ""; return; }
    tc3Live();
    el.innerHTML = "Stretch challenge, " + M.found.toLowerCase() + ": " + (S.tc3.length ? S.tc3.map(function(k){ return m("vec{b} = (" + k.split(",").join(", ") + ")"); }).join("; ") : M.none) + ".";
  }
  function syncInputs(){
    ["a", "b"].forEach(function(v){ [0, 1, 2].forEach(function(i){ var inp = $("#cx-in-" + v + i, host); if (inp && document.activeElement !== inp) inp.value = S[v][i]; }); });
    $("#cx-th", host).value = S.th; $("#cx-thout", host).textContent = S.th + "°";
    $("#cx-par", host).checked = S.par; $("#cx-hand", host).checked = S.hand; $("#cx-ra", host).checked = S.ra;
    $("#cx-build", host).hidden = S.mode === "angle"; $("#cx-angle", host).hidden = S.mode !== "angle";
    $("#cx-how", host).innerHTML = C.modeHow[S.mode];
  }
  function paintAll(){ mseg.set(S.mode); syncInputs(); paintView(); }
  function changed(){ api.save(); paintView(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.comp != null) { comp = comp === +b.dataset.comp ? null : +b.dataset.comp; paintView(); return; }
    if (busy) return;
    if (b.dataset.pre) { var p = C.presets.filter(function(x){ return x.id === b.dataset.pre; })[0]; S.a = p.a.slice(); S.b = p.b.slice(); if (S.mode === "angle") S.mode = "build"; comp = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.st) { var v = b.dataset.st[0], i = +b.dataset.st[1]; S[v] = S[v].slice(); S[v][i] = clamp(S[v][i] + (+b.dataset.d), -4, 4); syncInputs(); changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (busy) { syncInputs(); return; }
    if (t.dataset.sti) { var n = Number(String(t.value).replace(/−/g, "-")); if (t.value === "" || !Number.isInteger(n)) return; var v = t.dataset.sti[0], i = +t.dataset.sti[1]; S[v] = S[v].slice(); S[v][i] = clamp(n, -4, 4); changed(); }
    else if (t.id === "cx-th") { S.th = +t.value; $("#cx-thout", host).textContent = S.th + "°"; changed(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset.sti) { syncInputs(); return; }
    if (t.id === "cx-par" || t.id === "cx-hand" || t.id === "cx-ra") { S[t.id.slice(3)] = t.checked; api.save(); paintView(); }
  });
  paintAll();

  // ---- predictions ----
  function anim(dur, step, cb){ stop = MV.tween({ dur:dur, step:step, done:function(){ stop = null; if (cb) cb(); } }); }
  // ---- challenges ----
  function chal(id, opt){
    var M = MS[id], c;
    if (id === "tc1") {
      if (S.mode === "angle" || !same(S.a, [3, 0, 0])) return { ok:false, msg:M.seta };
      c = cross(S.a, S.b);
      if (S.b[1] === 2 && S.b[2] === 0) return { ok:true };
      if (same(c, [0, 0, -6])) return { ok:false, msg:M.down };
      if (same(c, [0, -6, 0])) return { ok:false, msg:M.zb };
      if (S.b[1] === 0 && S.b[2] === 0) return { ok:false, msg:M.par };
      return { ok:false, msg:tpl(M.other, { v:vt(c) }) };
    }
    if (id === "tc2") {
      if (S.mode !== "angle") return { ok:false, msg:M.mode };
      if (S.th === 60 || S.th === 120) return { ok:true };
      if (S.th === 30 || S.th === 150) return { ok:false, msg:M.cos };
      if (S.th === 90) return { ok:false, msg:M.max };
      return { ok:false, msg:tpl(M.other, { t:S.th + "°", v:kSin(8, S.th) }) };
    }
    if (id === "tc3") {
      if (S.mode === "angle" || !same(S.a, [1, 2, 2])) return { ok:false, msg:M.seta };
      var hit = tc3Live();
      if (S.tc3.length >= 2) return { ok:true };
      if (opt && opt.live) return { ok:false };
      if (hit) return { ok:false, msg:M.one };
      if (same(S.b, [2, -1, 0])) return { ok:false, msg:M.target };
      if (same(S.b, [0, 0, -1])) return { ok:false, msg:M.opp };
      return { ok:false, msg:tpl(M.other, { v:vt(cross(S.a, S.b)) }) + (S.tc3.length ? " " + M.one : "") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; live = {}; comp = null;
        if (p.id === "p1") { S.mode = "build"; S.a = [1, 0, 0]; S.b = [0, 1, 0]; S.hand = true; live = { cross:0, curl:0 }; }
        else if (p.id === "p2") { S.mode = "swap"; S.a = [1, 0, 0]; S.b = [0, 1, 0]; S.hand = true; live = { swap:0, curl:0 }; }
        else if (p.id === "p3") { S.mode = "angle"; S.th = 90; S.par = true; }
        else if (p.id === "p4") { S.mode = "build"; S.a = [1, 2, 3]; S.b = [2, 4, 6]; S.par = true; live = { cross:0 }; }
        paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; live = {}; api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") anim(1000, function(t){ live.curl = t; paintView(); }, function(){ anim(1100, function(t){ live.cross = t; paintView(); }, function(){ MV.wait(500, fin); }); });
        else if (p.id === "p2") anim(1000, function(t){ live.curl = t; paintView(); }, function(){ anim(1100, function(t){ live.swap = t; paintView(); }, function(){ MV.wait(500, fin); }); });
        else if (p.id === "p3") anim(2600, function(t){ live.th = 90 + 90 * t; paintView(); }, function(){ live.th = null; S.th = 180; MV.wait(600, fin); });
        else if (p.id === "p4") { live.cross = 1; anim(2200, function(t){ live.b = [2 + 2 * (1 - t), 4 - 2 * (1 - t), 6]; paintView(); }, function(){ live.b = null; MV.wait(600, fin); }); }
        else fin();
      }
    },
    challenge:function(id, opt){ return chal(id, opt); }
  };
}

// ---------- Part 3: cross product properties (five stations, one shared 3D view) ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, s1 = ST[0], s3 = ST[2], s4 = ST[3];
  if (typeof S.st !== "number") S.st = 0;
  S.s1 = S.s1 || { ab:["", "", ""], ba:["", "", ""], okab:false, okba:false, verdict:null };
  S.s2 = S.s2 || { f:"i", g:"j" };
  S.s3 = S.s3 || { k:1, sum:false };
  S.s4 = S.s4 || { l:false, r:false, show:null };
  S.s5 = S.s5 || { phi:90 };
  var msg1 = {}, grow = 1, stop = null;
  host.innerHTML = '<div class="cx-p3"><div class="cx-tabs" role="group" aria-label="Stations">' + ST.map(function(s, i){ return '<button type="button" class="chip" data-tab="' + i + '" data-k="cxtab' + i + '">' + (i + 1) + ". " + s.title + "</button>"; }).join("") + "</div>" +
    '<div class="cx-p3grid"><div class="cx-p3v"><div id="cx-p3view" class="cx-vhost"></div><div id="cx-p3views" class="cx-views"></div></div><div class="cx-p3panel" id="cx-p3panel"></div></div></div>';
  var V = view3d($("#cx-p3view", host), { onTurn:function(){ vseg.set(null); } }), vseg = viewSeg($("#cx-p3views", host), V);
  var UV = { i:[1, 0, 0], j:[0, 1, 0], k:[0, 0, 1] }, CYC = ["i", "j", "k"];
  function uvName(v){ var s = v[0] + v[1] + v[2]; if (!s && !v[0] && !v[1] && !v[2]) return "vec{0}"; var i = v[0] ? 0 : v[1] ? 1 : 2; return (v[i] < 0 ? "-" : "") + "vec{" + CYC[i] + "}"; }
  function rule(html){ return '<div class="refresh cx-rule"><h4>Rule</h4><p>' + html + "</p></div>"; }
  function boxes(key, vals, dis){ return "(" + [0, 1, 2].map(function(i){ return '<input class="numin cx-cin" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-cb="' + key + '" data-ci="' + i + '" data-k="cx' + key + i + '" aria-label="' + (key === "ab" ? "a cross b" : "b cross a") + ", component " + (i + 1) + '" value="' + MV.esc(vals[i] || "") + '"' + (dis ? " disabled" : "") + ">"; }).join(", ") + ")"; }
  function scene(){
    var st = S.st, sc0 = { R:5, vecs:[], polys:[], marks:[], notes:[] };
    if (st === 0) {
      var a = s1.a, b = s1.b, c = cross(a, b);
      sc0.R = Math.max(len(c), len(add(a, b))) * 1.12; sc0.polys.push({ pts:[[0, 0, 0], a, add(a, b), b], col:"--pen" });
      sc0.vecs.push({ v:a, col:"--pen", w:3, lab:"~a" }, { v:b, col:"--f3", w:3, lab:"~b" });
      if (S.s1.okab) sc0.vecs.push({ v:c, col:"--ink", w:3.6, lab:"~a × ~b" });
      if (S.s1.okba) sc0.vecs.push({ v:sc(-1, c), col:"--ink", w:3, dash:"11 7", lab:"~b × ~a" });
      sc0.describe = "a = (2, 1, 0) and b = (0, 1, 3)." + (S.s1.okab ? " a × b = (3, −6, 2)." : "") + (S.s1.okba ? " b × a = (−3, 6, −2) points the opposite way." : "");
    } else if (st === 1) {
      var f = UV[S.s2.f], g = UV[S.s2.g], p = cross(f, g);
      sc0.R = 1.8; sc0.vecs.push({ v:f, col:"--pen", w:3, lab:"~" + S.s2.f }, { v:g, col:"--f3", w:3, dash:S.s2.f === S.s2.g ? "6 5" : "", lab:S.s2.f === S.s2.g ? "" : "~" + S.s2.g });
      if (len(p) > 0) { sc0.vecs.push({ v:sc(grow, p), col:"--ink", w:3.6, lab:grow === 1 ? "~" + S.s2.f + " × ~" + S.s2.g : "" }); sc0.curl = { from:f, to:g, t:grow }; }
      else sc0.notes.push({ p:[0, 0, 0], text:"~" + S.s2.f + " × ~" + S.s2.g + " = ~0", dy:-14 });
      sc0.describe = S.s2.f + " × " + S.s2.g + " = " + MV.plain(m(uvName(p))) + ".";
    } else if (st === 2) {
      var A = s1.a, B = s1.b, k = S.s3.k, ka = sc(k, A);
      if (!S.s3.sum) {
        var kc = cross(ka, B);
        sc0.R = Math.max(len(kc), len(ka), len(B), 3) * 1.12;
        sc0.polys.push({ pts:[[0, 0, 0], ka, add(ka, B), B], col:"--pen" });
        sc0.vecs.push({ v:ka, col:"--pen", w:3, lab:"k~a" }, { v:B, col:"--f3", w:3, lab:"~b" });
        if (len(kc)) sc0.vecs.push({ v:kc, col:"--ink", w:3.6, lab:"(k~a) × ~b" }); else sc0.notes.push({ p:[0, 0, 0], text:"(k~a) × ~b = ~0", dy:-14 });
        sc0.describe = "k = " + k + ". k a = " + pv(ka) + ", b = (0, 1, 3), (k a) × b = " + pv(kc) + " = k(a × b).";
      } else {
        var Cc = s3.c, bc = add(B, Cc), r = cross(A, bc);
        sc0.R = Math.max(len(r), len(bc)) * 1.12;
        sc0.vecs.push({ v:A, col:"--pen", w:3, lab:"~a" }, { v:B, col:"--f3", w:3, lab:"~b" }, { v:Cc, from:B, col:"--f5", w:3, lab:"~c" }, { v:bc, col:"--f3", w:2.4, dash:"11 7", lab:"~b + ~c" }, { v:r, col:"--ink", w:3.6, lab:"~a × (~b + ~c)" });
        sc0.describe = "a = (2, 1, 0), b = (0, 1, 3), c = (1, 0, 1) drawn from the tip of b, b + c = (1, 1, 4), and a × (b + c) = (4, −8, 1).";
      }
    } else if (st === 3) {
      sc0.R = 1.8; sc0.vecs.push({ v:[1, 0, 0], col:"--pen", w:3, lab:"~i" }, { v:[0, 1, 0], col:"--f3", w:3, lab:"~j" });
      if (S.s4.show === "l") { sc0.notes.push({ p:[0, 0, 0], text:"(~i × ~i) × ~j = ~0", dy:-16 }); sc0.describe = "i and j. (i × i) × j = 0 × j is the zero vector: nothing to draw."; }
      else if (S.s4.show === "r") { sc0.vecs.push({ v:[0, 0, 1], col:"--ink-2", w:2, dash:"5 5", lab:"~i × ~j" }, { v:sc(grow, [0, -1, 0]), col:"--ink", w:3.6, lab:grow === 1 ? "~i × (~i × ~j)" : "" }); sc0.describe = "i and j. i × j = k (dashed), and i × k = −j, an arrow down the negative y-axis."; }
      else sc0.describe = "The unit vectors i and j.";
    } else {
      var ph = S.s5.phi, a5 = [3, 0, 0], b5 = [2 * Math.cos(ph * D2R), 2 * Math.sin(ph * D2R), 0], c5 = cross(a5, b5);
      sc0.R = 6.8; sc0.polys.push({ pts:[[0, 0, 0], a5, add(a5, b5), b5], col:"--pen" });
      sc0.vecs.push({ v:a5, col:"--pen", w:3, lab:"~a" }, { v:b5, col:"--f3", w:3, lab:"~b" });
      if (len(c5) > 1e-9) { sc0.vecs.push({ v:c5, col:"--ink", w:3.6, lab:"~a × ~b" }); sc0.marks.push({ u:c5, v:a5 }, { u:c5, v:b5 }); }
      else sc0.notes.push({ p:[0, 0, 0], text:"~a × ~b = ~0", dy:-16 });
      sc0.describe = "a = (3, 0, 0), b at " + ph + "° to a with length 2, a × b = " + pv(c5) + ".";
    }
    V.draw(sc0);
  }
  function panel(){
    var st = S.st, s = ST[st], h = "<h4>Station " + (st + 1) + ": " + s.title + '</h4><p class="cx-ptxt">' + s.text + "</p>";
    if (st === 0) {
      var x = S.s1;
      h += '<div class="cx-det3" role="img" aria-label="Memory aid: a 3 by 3 layout with rows i j k, then 2 1 0, then 0 1 3"><span>' + m("vec{i}") + "</span><span>" + m("vec{j}") + "</span><span>" + m("vec{k}") + "</span><span>2</span><span>1</span><span>0</span><span>0</span><span>1</span><span>3</span></div>";
      h += '<p class="tiny muted">Memory aid: cover a column and take the 2 × 2 determinant of what’s left (the middle one with a minus sign). The component formula is what counts.</p>';
      h += '<div class="cx-crow" data-row="ab"><span>' + m("vec{a} × vec{b}") + " = " + boxes("ab", x.ab, x.okab) + "</span>" + (x.okab ? "" : ' <button type="button" class="btn primary sm" data-c1="ab" data-k="cxc1ab">Check</button>') + "</div>" + (x.okab ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + m("vec{a} × vec{b} = (3, -6, 2)")) : msg1.ab ? MV.fbHTML("bad", msg1.ab) : "");
      h += '<div class="cx-crow" data-row="ba"><span>' + m("vec{b} × vec{a}") + " = " + boxes("ba", x.ba, x.okba) + "</span>" + (x.okba ? "" : ' <button type="button" class="btn primary sm" data-c1="ba" data-k="cxc1ba">Check</button>') + "</div>" + (x.okba ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + m("vec{b} × vec{a} = (-3, 6, -2)")) : msg1.ba ? MV.fbHTML("bad", msg1.ba) : "");
      if (x.okab && x.okba) {
        h += '<p class="cx-ptxt">' + s1.verdictQ + '</p><div class="chips" role="group" aria-label="Verdict">' + s1.verdicts.map(function(v){ return '<button type="button" class="chip" data-v1="' + v.id + '" data-k="cxv1' + v.id + '" aria-pressed="' + (x.verdict === v.id) + '">' + v.t + "</button>"; }).join("") + "</div>";
        if (x.verdict) h += MV.fbHTML(x.verdict === "opp" ? "good" : "bad", (x.verdict === "opp" ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + s1.verdictFb[x.verdict]);
        if (x.verdict === "opp") h += rule(s.rule);
      }
    } else if (st === 1) {
      var f = S.s2.f, g = S.s2.g, p = cross(UV[f], UV[g]), fi = CYC.indexOf(f), gi = CYC.indexOf(g), fwd = (fi + 1) % 3 === gi;
      h += '<div class="cx-cyc">' + cycleSVG(f, g) + "</div>";
      ["f", "g"].forEach(function(w){ h += '<div class="cx-pick"><span class="tiny cx-lab2">' + (w === "f" ? "First" : "Second") + '</span><span class="chips" role="group" aria-label="' + (w === "f" ? "First vector" : "Second vector") + '">' + CYC.map(function(n){ return '<button type="button" class="chip" data-s2' + w + '="' + n + '" data-k="cxs2' + w + n + '" aria-pressed="' + (S.s2[w] === n) + '">' + m("vec{" + n + "}") + "</button>"; }).join("") + "</span></div>"; });
      h += '<p class="cx-res" aria-live="polite">' + m("vec{" + f + "} × vec{" + g + "} = " + uvName(p)) + " " + (f === g ? "(a vector and itself are parallel: no area)" : fwd ? "(forward around the circle: +)" : "(backward around the circle: −)") + "</p>";
      h += rule(s.rule);
    } else if (st === 2) {
      var k = S.s3.k, ka = sc(k, s1.a), kc = cross(ka, s1.b), base = cross(s1.a, s1.b);
      h += '<label class="slider"><span class="slider-top"><span>' + m("@a{k}") + '</span><output style="color:var(--acol)">' + sg(k) + '</output></span><input type="range" id="cx-k" min="-3" max="3" step="1" value="' + k + '" style="accent-color:var(--acol)" aria-label="k, from −3 to 3"></label>';
      h += '<dl class="read" aria-live="polite">' + MV.readoutHTML([
        [m("@a{k}vec{a}"), m(vs(ka))],
        [m("(@a{k}vec{a}) × vec{b}"), m(vs(kc))],
        [m("@a{k}(vec{a} × vec{b})"), m(sg(k).replace(MINUS, "-") + vs(base)) + " = " + m(vs(sc(k, base)))],
        ["Same?", same(kc, sc(k, base)) ? "✓ equal" : "✗"]]) + "</dl>";
      h += '<div class="q-actions"><button type="button" class="btn ' + (S.s3.sum ? "ghost" : "primary") + ' sm" data-s3sum="1" data-k="cxs3sum" aria-pressed="' + S.s3.sum + '">' + (S.s3.sum ? "Back to the scalar " + m("@a{k}") : "Add " + m("@k{vec{c}} = (1, 0, 1)")) + "</button></div>";
      if (S.s3.sum) {
        var bc = add(s1.b, s3.c), l = cross(s1.a, bc), ac = cross(s1.a, s3.c);
        h += '<div class="cx-sbs"><div><h4>' + m("vec{a} × (vec{b} + @k{vec{c}})") + "</h4><p>" + m("vec{b} + vec{c} = " + vs(bc)) + "</p><p>" + m("vec{a} × " + vs(bc) + " = " + vs(l)) + "</p></div>" +
          "<div><h4>" + m("vec{a} × vec{b} + vec{a} × @k{vec{c}}") + "</h4><p>" + m(vs(base) + " + " + vs(ac)) + "</p><p>= " + m(vs(add(base, ac))) + "</p></div></div>";
        h += MV.fbHTML("good", "<strong>✓ They match:</strong> " + m(vs(l)) + " on both sides.");
        h += '<details class="alg"><summary>Check it with algebra</summary><p>' + '<span class="cx-hb">' + m("a_2b_3") + "</span> + " + '<span class="cx-hc">' + m("a_2c_3") + "</span> " + MINUS + " " + '<span class="cx-hb">' + m("a_3b_2") + "</span> " + MINUS + " " + '<span class="cx-hc">' + m("a_3c_2") + "</span> = (" +
          '<span class="cx-hb">' + m("a_2b_3") + "</span> " + MINUS + " " + '<span class="cx-hb">' + m("a_3b_2") + "</span>) + (" + '<span class="cx-hc">' + m("a_2c_3") + "</span> " + MINUS + " " + '<span class="cx-hc">' + m("a_3c_2") + "</span>)</p><p>" + s.alg + "</p></details>";
        h += rule(s.rule);
      }
    } else if (st === 3) {
      h += '<div class="q-actions">' + [["l", "(vec{i} × vec{i}) × vec{j}"], ["r", "vec{i} × (vec{i} × vec{j})"]].map(function(x){ return '<button type="button" class="btn ' + (S.s4.show === x[0] ? "primary" : "ghost") + ' sm" data-s4="' + x[0] + '" data-k="cxs4' + x[0] + '" aria-pressed="' + (S.s4.show === x[0]) + '">' + m(x[1]) + "</button>"; }).join("") + "</div>";
      if (S.s4.l) h += "<p>" + s4.left + "</p>";
      if (S.s4.r) h += "<p>" + s4.right + "</p>";
      if (S.s4.l && S.s4.r) h += rule(s.rule); else h += '<p class="tiny muted">Work out both bracketings to compare them.</p>';
    } else {
      var ph = S.s5.phi;
      h += '<label class="slider"><span class="slider-top"><span>Angle between ' + m("vec{a}") + " and " + m("vec{b}") + '</span><output>' + ph + '°</output></span><input type="range" id="cx-phi" min="0" max="90" step="15" value="' + ph + '" style="accent-color:var(--ink)" aria-label="Angle between a and b, 0° to 90°"></label>';
      var sn = { 0:"0", 30:"3", 45:"3√2", 60:"3√3", 90:"6" }[ph];
      h += '<dl class="read" aria-live="polite">' + MV.readoutHTML([
        [m("vec{b}"), SPEC[ph] ? m("(" + SPEC[ph].bx + ", " + SPEC[ph].by + ", 0)") : "≈ " + vt([2 * Math.cos(ph * D2R), 2 * Math.sin(ph * D2R), 0].map(function(x){ return Math.round(x * 100) / 100; }))],
        [m("vec{a} × vec{b}"), ph === 0 ? m("(0, 0, 0) = vec{0}") : sn ? m("(0, 0, " + sn + ")") : "≈ (0, 0, " + num(6 * Math.sin(ph * D2R), 2) + ")"],
        ["Length", sn ? m(sn) : "≈ " + num(6 * Math.sin(ph * D2R), 2)]]) + "</dl>";
      h += ph === 0 ? rule(s.rule) : '<p class="tiny muted">Turn ' + m("vec{b}") + " all the way to 0°.</p>";
    }
    h += '<div class="q-actions cx-pnav"><button type="button" class="btn ghost sm" data-nav="-1" data-k="cxprev"' + (st === 0 ? " disabled" : "") + '>Previous station</button><button type="button" class="btn ghost sm" data-nav="1" data-k="cxnext"' + (st === ST.length - 1 ? " disabled" : "") + ">Next station</button></div>";
    var el = $("#cx-p3panel", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
    MV.keepFocus($(".cx-tabs", host), function(){ $$tabs().forEach(function(b){ b.setAttribute("aria-pressed", String(+b.dataset.tab === st)); }); });
  }
  function $$tabs(){ return MV.$$(".cx-tabs [data-tab]", host); }
  function paint(){ panel(); scene(); }
  function growIn(){ if (stop) stop(); grow = 0; stop = MV.tween({ dur:700, step:function(t){ grow = t; scene(); }, done:function(){ stop = null; grow = 1; scene(); } }); }
  function judge1(key){
    var x = S.s1, raw = x[key], vals = [];
    for (var i = 0; i < 3; i++) { var p = MV.parseNum(raw[i]); if (!p || p.length !== 1) { msg1[key] = "Type a number in each of the three boxes."; return; } vals.push(p[0]); }
    var t = key === "ab" ? cross(s1.a, s1.b) : cross(s1.b, s1.a), M = s1.msgs;
    if (same(vals, t)) { x["ok" + key] = true; msg1[key] = null; return; }
    var w = "";
    if (same(vals, [t[0], -t[1], t[2]])) w = M.m1;
    else if (same(vals, [s1.a[0] * s1.b[0], s1.a[1] * s1.b[1], s1.a[2] * s1.b[2]])) w = M.m7;
    else if (key === "ba" && same(vals, sc(-1, t))) w = M.m3;
    else w = M.gen;
    msg1[key] = "<strong>✗ Not quite.</strong> " + w + " Try again.";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tab != null) { S.st = +b.dataset.tab; api.save(); paint(); return; }
    if (b.dataset.nav) { S.st = clamp(S.st + (+b.dataset.nav), 0, ST.length - 1); api.save(); paint(); return; }
    if (b.dataset.c1) { judge1(b.dataset.c1); api.save(); paint(); MV.focusFb($('#cx-p3panel', host)); return; }
    if (b.dataset.v1) { S.s1.verdict = b.dataset.v1; api.save(); paint(); MV.focusFb($('#cx-p3panel', host)); return; }
    if (b.dataset.s2f || b.dataset.s2g) { if (b.dataset.s2f) S.s2.f = b.dataset.s2f; else S.s2.g = b.dataset.s2g; api.save(); panel(); growIn(); return; }
    if (b.dataset.s3sum) { S.s3.sum = !S.s3.sum; api.save(); paint(); return; }
    if (b.dataset.s4) { var w = b.dataset.s4; S.s4[w] = true; S.s4.show = w; api.save(); panel(); if (w === "r") growIn(); else scene(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.cb) { S.s1[t.dataset.cb][+t.dataset.ci] = t.value; api.save(); return; }
    if (t.id === "cx-k") { S.s3.k = +t.value; api.save(); paint(); return; }
    if (t.id === "cx-phi") { S.s5.phi = +t.value; api.save(); paint(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.cb) return; var bt = $('[data-c1="' + e.target.dataset.cb + '"]', host); if (bt) { e.preventDefault(); bt.click(); } });
  paint();
  return {};
}
// the i → j → k → i cycle (Station 2): three nodes on a circle, arrows forward; the current pair's arc is highlighted
function cycleSVG(f, g){
  var P = { i:[90, 24], j:[150, 128], k:[30, 128] }, CX = 90, CY = 93, R = 69, ang = { i:-90, j:30, k:150 }, order = ["i", "j", "k"], h = "";
  function pt(a){ return [CX + R * Math.cos(a * D2R), CY + R * Math.sin(a * D2R)]; }
  function arc(a0, a1){ var s = pt(a0), e = pt(a1); return "M" + s[0].toFixed(1) + " " + s[1].toFixed(1) + " A" + R + " " + R + " 0 0 1 " + e[0].toFixed(1) + " " + e[1].toFixed(1); }
  var fi = order.indexOf(f), gi = order.indexOf(g), hiFrom = null;
  if (f !== g) hiFrom = (fi + 1) % 3 === gi ? f : g;   // forward pair: arc f→g; backward pair: arc g→f is the one walked against
  order.forEach(function(n, i){
    var nx = order[(i + 1) % 3], a0 = ang[n] + 18, a1 = ang[nx] - 18 + (nx === "i" ? 360 : 0), on = hiFrom === n, back = on && n === g;
    var e = pt(a1), e0 = pt(a1 - 6), d = [e[0] - e0[0], e[1] - e0[1]], L = Math.hypot(d[0], d[1]), w = [d[0] / L, d[1] / L], nn = [-w[1], w[0]];
    h += '<path d="' + arc(a0, a1) + '" class="cx-cy' + (on ? " on" : "") + (back ? " back" : "") + '"/>';
    h += '<polygon class="cx-cyh' + (on ? " on" : "") + '" points="' + [[e[0] + w[0] * 4, e[1] + w[1] * 4], [e[0] - w[0] * 7 + nn[0] * 5, e[1] - w[1] * 7 + nn[1] * 5], [e[0] - w[0] * 7 - nn[0] * 5, e[1] - w[1] * 7 - nn[1] * 5]].map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>';
  });
  order.forEach(function(n){ var p = P[n]; h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" class="cx-cyn' + (n === f || n === g ? " on" : "") + '"/><text x="' + p[0] + '" y="' + (p[1] + 6) + '" text-anchor="middle" class="cx-lab"><tspan class="cx-it">' + n + AR + "</tspan></text>"; });
  var lab = f === g ? "same vector: 0⃗" : (fi + 1) % 3 === gi ? "forward: +" : "backward: −";
  return '<svg viewBox="0 0 180 170" role="img" aria-label="Cycle i to j to k to i. ' + MV.esc(lab) + '"><g>' + h + '</g><text x="90" y="98" text-anchor="middle" class="cx-tl">' + lab + "</text></svg>";
}

// ---------- performance task: Area 9, pointing up ----------
var task = (function(){
  var api, V, A0 = [1, 2, 2];
  function g(i){ var s = String(api && api.S["b" + i] != null ? api.S["b" + i] : "").trim().replace(/−/g, "-"); if (s === "") return null; var v = Number(s); return Number.isInteger(v) && v >= -4 && v <= 4 ? v : NaN; }
  function read(){ var b = [g(0), g(1), g(2)]; return { b:b, ok:b.every(function(v){ return Number.isInteger(v); }) }; }
  function draw(){
    var d = read(), el = $("#cx-tkread");
    if (!d.ok) { V.draw({ R:5, vecs:[{ v:A0, col:"--pen", w:3, lab:"~a" }], describe:"a = (1, 2, 2). Choose whole numbers from −4 to 4 for b." }); if (el) el.innerHTML = MV.readoutHTML([["", "Choose whole numbers from −4 to 4 for " + m("b_1") + ", " + m("b_2") + " and " + m("b_3") + "."]]); return; }
    var b = d.b, c = cross(A0, b), n = dot(c, c), lc = Math.sqrt(n), sc0 = { R:Math.max(3, len(b), len(add(A0, b)) * 0.8, lc) * 1.12, polys:[{ pts:[[0, 0, 0], A0, add(A0, b), b], col:"--pen" }], vecs:[{ v:A0, col:"--pen", w:3, lab:"~a" }, { v:b, col:"--f3", w:3, lab:"~b" }], marks:[], notes:[] };
    if (lc > 0) { sc0.vecs.push({ v:c, col:"--ink", w:3.6, lab:"~a × ~b" }); sc0.marks.push({ u:c, v:A0 }, { u:c, v:b }); } else sc0.notes.push({ p:[0, 0, 0], text:"~a × ~b = ~0", dy:-14 });
    sc0.describe = "a = (1, 2, 2), b = " + pv(b) + ", a × b = " + pv(c) + " with length " + num(lc, 2) + ", a · b = " + sg(dot(A0, b)) + ".";
    V.draw(sc0);
    if (el) el.innerHTML = MV.readoutHTML([[m("vec{a} × vec{b}"), m(vs(c))], ["Length (area)", n ? lenHTML(n) : "0"], [m("z") + "-component", m("b_2 - 2b_1 = " + sg(c[2]))], [m("vec{a} · vec{b}"), sg(dot(A0, b))]]);
  }
  function upd(){ draw(); api.update(); }
  return {
    render:function(inp, pvh, a){
      api = a; [0, 1, 2].forEach(function(i){ if (a.S["b" + i] == null) a.S["b" + i] = "0"; });
      inp.innerHTML = '<div class="cx-tk"><span class="cx-vn">' + m("vec{b}") + '</span><div class="cx-sts">' + [0, 1, 2].map(function(i){ return stepperHTML("t" + i, m("b_" + (i + 1)), "b" + SUBS[i]); }).join("") + "</div></div>";
      pvh.innerHTML = '<div id="cx-tkview" class="cx-vhost"></div><div id="cx-tkviews" class="cx-views"></div><dl class="read" id="cx-tkread" aria-live="polite"></dl>';
      V = view3d($("#cx-tkview"), { onTurn:function(){ vs2.set(null); } }); var vs2 = viewSeg($("#cx-tkviews"), V);
      [0, 1, 2].forEach(function(i){ $("#cx-in-t" + i).value = a.S["b" + i]; });
      inp.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.sti; if (!id) return; a.S["b" + id[1]] = e.target.value; a.save(); upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button[data-st]"); if (!b) return;
        var i = b.dataset.st[1], v = Number(String(a.S["b" + i]).replace(/−/g, "-")); if (!Number.isInteger(v)) v = 0;
        v = clamp(v + Number(b.dataset.d), -4, 4); a.S["b" + i] = String(v); $("#cx-in-t" + i).value = v; a.save(); upd();
      });
      draw();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Choose whole numbers from −4 to 4 for " + m("b_1") + ", " + m("b_2") + " and " + m("b_3") + "."; },
    checks:function(d){ if (!d.ok) return [false, false, false]; var c = cross(A0, d.b); return [dot(c, c) === 81, c[2] > 0, dot(A0, d.b) !== 0]; },
    key:function(d){ return d.b.join(","); },
    label:function(k){ return m("vec{b} = (" + k.split(",").join(", ") + ")"); },
    text:function(k){ return "b = (" + k.split(",").map(function(x){ return sg(+x); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
