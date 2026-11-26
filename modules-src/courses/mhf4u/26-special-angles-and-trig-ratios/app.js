// MHF4U 26 Special Angles and Trig Ratios: hero sweep, unit circle explorer (Explore), angle families and the sign grid
// (Part 3, #cast), "Find the angles" (Practice 2) and the "Make sine meet cosine" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, PI = Math.PI;

// @component N12 unitCircle — exact special-angle values (angles in twelfths of π), canvas maths labels (stacked fractions,
//   radicals), a unit-circle scene (arms, θ arc, reference arc and triangle, CAST letters, dots, point label) and tappable
//   dot buttons with roving focus. Pilot in MHF4U 26: stepper explorer, family reflections, multi-select dots, two arms.
var UC = (function(){
  var SPECIAL = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22];
  var SETS = { all:SPECIAL, six:[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], quart:[0, 3, 6, 9, 12, 15, 18, 21] };
  var R3 = Math.sqrt(3), R2 = Math.SQRT2;
  // size key -> [stacked m() source, plain text, spoken, value]
  var SZ = { "0":["0", "0", "0", 0], "1":["1", "1", "1", 1], h:["{1}/{2}", "1/2", "one half", 0.5], r2:["{√2}/{2}", "√2/2", "square root 2 over 2", R2 / 2],
    r3:["{√3}/{2}", "√3/2", "square root 3 over 2", R3 / 2], t3:["{√3}/{3}", "√3/3", "square root 3 over 3", R3 / 3], s3:["√3", "√3", "square root 3", R3],
    s2:["√2", "√2", "square root 2", R2], "2":["2", "2", "2", 2], c3:["{2√3}/{3}", "2√3/3", "2 square root 3 over 3", 2 * R3 / 3], u:["undefined", "undefined", "undefined", NaN] };
  var REF = { 0:{ sin:"0", cos:"1", tan:"0", csc:"u", sec:"1", cot:"u" }, 2:{ sin:"h", cos:"r3", tan:"t3", csc:"2", sec:"c3", cot:"s3" },
    3:{ sin:"r2", cos:"r2", tan:"1", csc:"s2", sec:"s2", cot:"1" }, 4:{ sin:"r3", cos:"h", tan:"s3", csc:"c3", sec:"2", cot:"t3" },
    6:{ sin:"1", cos:"0", tan:"u", csc:"1", sec:"u", cot:"0" } };
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }
  function sg(x){ return Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1; }
  function fr(k){ if (!k) return { n:0, d:1 }; var g = gcd(k, 12); return { n:k / g, d:12 / g }; }
  function angT(k){ var f = fr(k); if (!f.n) return "0"; return (f.n === 1 ? "" : f.n) + "π" + (f.d === 1 ? "" : "/" + f.d); }
  function angM(k){ var f = fr(k); if (!f.n) return "0"; var top = (f.n === 1 ? "" : f.n) + "π"; return f.d === 1 ? top : "{" + top + "}/{" + f.d + "}"; }
  function V(key, s){
    var z = SZ[key]; s = (key === "0" || key === "u") ? 0 : s;
    return { key:key, s:s, undef:key === "u", v:key === "u" ? NaN : s < 0 ? -z[3] : z[3], m:(s < 0 ? "-" : "") + z[0], t:(s < 0 ? MINUS : "") + z[1], sp:(s < 0 ? "negative " : "") + z[2] };
  }
  // everything exact about the angle kπ/12 (k = 0 … 24)
  function info(k){
    var kk = ((k % 24) + 24) % 24, a = kk * PI / 12, c = sg(Math.cos(a)), s = sg(Math.sin(a)), m = kk % 12, ref = m <= 6 ? m : 12 - m, R = REF[ref];
    var quad = (c && s) ? (s > 0 ? (c > 0 ? 1 : 2) : (c < 0 ? 3 : 4)) : 0;
    return { k:k, a:k * PI / 12, deg:k * 15, quad:quad, axis:quad ? null : c > 0 ? "+x" : c < 0 ? "-x" : s > 0 ? "+y" : "-y", ref:quad ? ref : null,
      cos:V(R.cos, c), sin:V(R.sin, s), tan:V(R.tan, c * s), sec:V(R.sec, c), csc:V(R.csc, s), cot:V(R.cot, c * s) };
  }
  function quadOf(a){ var c = sg(Math.cos(a)), s = sg(Math.sin(a)); return (c && s) ? (s > 0 ? (c > 0 ? 1 : 2) : (c < 0 ? 3 : 4)) : 0; }
  // HTML for an exact value: typeset for the eye, spoken words for screen readers (N3)
  function exHTML(src, spoken){ return '<span aria-hidden="true">' + MV.m(src) + '</span><span class="vh">' + spoken + "</span>"; }
  function valHTML(v){ return exHTML(v.m, v.sp); }
  function ptHTML(I){ return exHTML("(" + I.cos.m + ", " + I.sin.m + ")", "(" + I.cos.sp + ", " + I.sin.sp + ")"); }

  // ---- canvas maths labels: "{a}/{b}" stacked, "√3" with a bar, "-" -> minus, single letters italic ----
  var FN = { sin:1, cos:1, tan:1, csc:1, sec:1, cot:1, ref:1, undefined:1, pinned:1 };
  function grp(s, i){ var d = 0, j = i; for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) break; } } return [s.slice(i + 1, j), j + 1]; }
  function parse(src){
    var out = [], i = 0, buf = "";
    function flush(){ if (buf) { out.push({ t:buf }); buf = ""; } }
    while (i < src.length) {
      var ch = src[i];
      if (ch === "{") {
        var g = grp(src, i);
        if (src[g[1]] === "/" && src[g[1] + 1] === "{") { var g2 = grp(src, g[1] + 1); flush(); out.push({ fn:parse(g[0]), fd:parse(g2[0]) }); i = g2[1]; continue; }
        flush(); out = out.concat(parse(g[0])); i = g[1]; continue;
      }
      if (ch === "√") { var mm = /^\d+/.exec(src.slice(i + 1)) || [""]; flush(); out.push({ r:mm[0] }); i += 1 + mm[0].length; continue; }
      if (/[A-Za-z]/.test(ch)) {
        var w = /^[A-Za-z]+/.exec(src.slice(i))[0];
        if (FN[w]) buf += w; else { flush(); w.split("").forEach(function(c){ out.push({ t:c, i:true }); }); }
        i += w.length; continue;
      }
      buf += ch === "-" ? MINUS : ch; i++;
    }
    flush();
    return out;
  }
  function fnt(sz, it, fm){ return (it ? "italic " : "") + "600 " + sz + "px " + fm; }
  function sum(a){ return a.reduce(function(s, x){ return s + x; }, 0); }
  function widths(ctx, toks, sz, fm){
    return toks.map(function(tk){
      if (tk.fn) { var fs = Math.max(9, Math.round(sz * 0.78)); return Math.max(sum(widths(ctx, tk.fn, fs, fm)), sum(widths(ctx, tk.fd, fs, fm))) + 4; }
      if (tk.r != null) { ctx.font = fnt(sz, false, fm); return sz * 0.62 + ctx.measureText(tk.r).width + 1.5; }
      ctx.font = fnt(sz, tk.i, fm); return ctx.measureText(tk.t).width;
    });
  }
  function hasFrac(toks){ return toks.some(function(t){ return t.fn; }); }
  function drawToks(ctx, toks, x, y, sz, fm, col){
    var ws = widths(ctx, toks, sz, fm);
    toks.forEach(function(tk, i){
      if (tk.fn) {
        var fs = Math.max(9, Math.round(sz * 0.78)), wn = sum(widths(ctx, tk.fn, fs, fm)), wd = sum(widths(ctx, tk.fd, fs, fm));
        drawToks(ctx, tk.fn, x + (ws[i] - wn) / 2, y - fs * 0.64, fs, fm, col);
        drawToks(ctx, tk.fd, x + (ws[i] - wd) / 2, y + fs * 0.68, fs, fm, col);
        ctx.fillStyle = col; ctx.fillRect(x + 1.5, y - 0.6, ws[i] - 3, Math.max(1.1, sz / 12));
      } else if (tk.r != null) {
        ctx.font = fnt(sz, false, fm); var rw = ctx.measureText(tk.r).width, h = sz * 0.5;
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, sz / 13); ctx.lineJoin = "round"; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x + sz * 0.03, y + h * 0.1); ctx.lineTo(x + sz * 0.13, y); ctx.lineTo(x + sz * 0.3, y + h * 0.82); ctx.lineTo(x + sz * 0.55, y - h * 1.02); ctx.lineTo(x + sz * 0.62 + rw + 1, y - h * 1.02); ctx.stroke(); ctx.restore();
        ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.r, x + sz * 0.6, y + sz * 0.05);
      } else { ctx.font = fnt(sz, tk.i, fm); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.t, x, y + sz * 0.05); }
      x += ws[i];
    });
  }
  // label(ctx, plot, parts, X, Y, o): parts = "src" or [{src, color, hl}]; X, Y in pixels (Y = vertical middle);
  // o = {size, color, align:"left"|"right"|"center", bg (default true), bgColor}
  function label(ctx, p, parts, X, Y, o){
    o = o || {};
    if (typeof parts === "string") parts = [{ src:parts }];
    var sz = o.size || 14, fm = p.fontM || css("--font-math") || "serif", base = o.color || css("--ink");
    var P = parts.map(function(pt){ var tk = parse(pt.src); return { tk:tk, w:sum(widths(ctx, tk, sz, fm)), c:pt.color, hl:pt.hl }; });
    var w = sum(P.map(function(x){ return x.w; })), frac = P.some(function(x){ return hasFrac(x.tk); }), hh = frac ? sz * 2.05 : sz * 1.35;
    var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
    x0 = Math.max(3, Math.min(p.W - w - 3, x0)); Y = Math.max(hh / 2 + 2, Math.min(p.H - hh / 2 - 2, Y));
    ctx.save();
    if (o.bg !== false) { ctx.globalAlpha = 0.9; ctx.fillStyle = o.bgColor || css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
    var x = x0;
    P.forEach(function(pt){
      if (pt.hl) { ctx.fillStyle = css("--hi"); ctx.fillRect(x - 1, Y - hh / 2 + 1, pt.w + 2, hh - 2); }
      drawToks(ctx, pt.tk, x, Y, sz, fm, pt.hl ? css("--hi-ink") : (pt.c || base)); x += pt.w;
    });
    ctx.restore();
    return { x:x0, w:w, h:hh };
  }

  // ---- scene drawing ----
  var VIEW = { xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 };
  function tickFmt(){ return ""; }
  function arc(ctx, p, a0, a1, r, col, w){
    var R = p.X(r) - p.X(0);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2.5; ctx.lineCap = "butt"; ctx.beginPath();
    ctx.arc(p.X(0), p.Y(0), R, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore();
  }
  function seg(ctx, p, x1, y1, x2, y2, col, w, dash, alpha){
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(p.X(x1), p.Y(y1)); ctx.lineTo(p.X(x2), p.Y(y2)); ctx.stroke(); ctx.restore();
  }
  function poly(ctx, p, pts, o){
    ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.beginPath();
    pts.forEach(function(q, i){ if (i) ctx.lineTo(p.X(q[0]), p.Y(q[1])); else ctx.moveTo(p.X(q[0]), p.Y(q[1])); }); ctx.closePath();
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.width || 2; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
    ctx.restore();
  }
  function dot(ctx, p, x, y, r, fill, stroke, sw){
    ctx.save(); ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, 0, 2 * PI);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); }
    ctx.restore();
  }
  function castLetters(ctx, p, bold){
    var L = { 1:["A", 1, 1], 2:["S", -1, 1], 3:["T", -1, -1], 4:["C", 1, -1] }, fm = p.fontM || "serif";
    ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    [1, 2, 3, 4].forEach(function(q){
      var on = q === bold, l = L[q];
      ctx.font = (on ? "700 30px " : "400 23px ") + fm; ctx.fillStyle = on ? css("--ink") : css("--ink-2");
      ctx.fillText(l[0], p.X(l[1] * 1.27), p.Y(l[2] * 1.27));
    });
    ctx.restore();
  }
  // label position just outside the circle at angle a (pixels), with alignment
  function outside(p, a, gap){
    var c = Math.cos(a), s = Math.sin(a), X = p.X(c) + c * gap, Y = p.Y(s) - s * gap;
    return { X:X, Y:Y, align:c > 0.35 ? "left" : c < -0.35 ? "right" : "center", s:s };
  }
  // scene: {quad, circle (0..1), dots:[{k, fill, ring, bad}], dotLabels:[k], labelSize, tri:{a, cosLab, sinLab}, ghost:[[x,y]…],
  //   thetaArc:{a, label}, refArc:{a, label}, arms:[{a, color, width, dash, alpha}], P:{a, parts}, cast:{bold}, extra(ctx, p), describe}
  function scene(p, sc){
    p.draw({ view:VIEW, equal:true, xTicks:{ step:0.5, fmt:tickFmt }, yTicks:{ step:0.5, fmt:tickFmt }, shade:sc.quad ? [sc.quad] : [], describe:sc.describe,
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), R = p.X(1) - p.X(0);
        // circle
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath();
        ctx.arc(p.X(0), p.Y(0), R, 0, -2 * PI * (sc.circle == null ? 1 : sc.circle), true); ctx.stroke(); ctx.restore();
        if (sc.ghost) poly(ctx, p, sc.ghost, { stroke:ink2, dash:[5, 4], alpha:0.75, width:1.8 });
        if (sc.tri) {
          var c = Math.cos(sc.tri.a), s = Math.sin(sc.tri.a);
          if (sc.tri.fill) poly(ctx, p, [[0, 0], [c, 0], [c, s]], { fill:sc.tri.fill });
          seg(ctx, p, 0, 0, c, 0, ink2, 2, [6, 5]); seg(ctx, p, c, 0, c, s, ink2, 2, [6, 5]);
        }
        if (sc.thetaArc && Math.abs(sc.thetaArc.a) > 1e-6) arc(ctx, p, 0, sc.thetaArc.a, 0.16, css("--p-t"), 2.5);
        if (sc.refArc) {
          var ra = sc.refArc.a, rq = quadOf(ra), base = (rq === 2 || rq === 3) ? PI : (rq === 4 ? 2 * PI : 0);
          if (rq) arc(ctx, p, Math.min(base, ra), Math.max(base, ra), 0.42, css("--hi"), 4.5);
        }
        (sc.arms || []).forEach(function(am){ seg(ctx, p, 0, 0, Math.cos(am.a), Math.sin(am.a), am.color || pen, am.width || 3, am.dash, am.alpha); });
        (sc.dots || []).forEach(function(d){
          var a = d.k * PI / 12, x = Math.cos(a), y = Math.sin(a);
          if (d.fill) dot(ctx, p, x, y, 7.5, d.fill, ink, 1.6); else dot(ctx, p, x, y, 4.2, ink2, null);
          if (d.bad) dot(ctx, p, x, y, 11.5, null, css("--red"), 2.8);
        });
        if (sc.P) {
          var px = Math.cos(sc.P.a), py = Math.sin(sc.P.a);
          dot(ctx, p, px, py, 11, css("--hi"), null); dot(ctx, p, px, py, 6, sc.P.color || ink, css("--sheet"), 2);
        }
        // labels last, so they sit on top
        var lsz = sc.labelSize || 14;
        (sc.dotLabels || []).forEach(function(k){
          var a = k * PI / 12;
          if (sc.P && sc.P.parts && Math.abs(Math.atan2(Math.sin(a - sc.P.a), Math.cos(a - sc.P.a))) < 0.5) return;
          label(ctx, p, angM(k), p.X(1.25 * Math.cos(a)), p.Y(1.25 * Math.sin(a)), { size:lsz, color:ink2, align:"center" });
        });
        if (sc.tri && sc.tri.cosLab) {
          var tc = Math.cos(sc.tri.a), ts = Math.sin(sc.tri.a), up = ts >= 0;
          if (Math.abs(tc) > 0.18) label(ctx, p, sc.tri.cosLab, p.X(tc * 0.62), p.Y(0) + (up ? 19 : -19), { size:14, align:"center" });
          if (Math.abs(ts) > 0.18) label(ctx, p, sc.tri.sinLab, p.X(tc) + (tc >= 0 ? 7 : -7), p.Y(ts * 0.66), { size:14, align:tc >= 0 ? "left" : "right" });
          var flip = tc * ts >= 0 ? 1 : -1, nx = -ts * flip, ny = tc * flip;
          label(ctx, p, "1", p.X(tc / 2) + nx * 13, p.Y(ts / 2) - ny * 13, { size:14, align:"center" });
        }
        if (sc.thetaArc && sc.thetaArc.label && Math.abs(sc.thetaArc.a) > 1e-6) {
          var ma = sc.thetaArc.a / 2;
          label(ctx, p, sc.thetaArc.label, p.X(0.31 * Math.cos(ma)), p.Y(0.31 * Math.sin(ma)), { size:15, color:css("--p-t"), align:"center" });
        }
        if (sc.refArc && sc.refArc.label) {
          var ra2 = sc.refArc.a, rq2 = quadOf(ra2), b2 = (rq2 === 2 || rq2 === 3) ? PI : (rq2 === 4 ? 2 * PI : 0), mid = (ra2 + b2) / 2;
          if (rq2) label(ctx, p, sc.refArc.label, p.X(0.58 * Math.cos(mid)), p.Y(0.58 * Math.sin(mid)), { size:14, align:"center", bgColor:css("--hi"), color:css("--hi-ink") });
        }
        if (sc.P && sc.P.parts) {
          var o = outside(p, sc.P.a, 16), h = 34;
          label(ctx, p, sc.P.parts, o.X, o.Y - (o.align === "center" ? o.s * h / 2 + o.s * 4 : 0), { size:sc.P.size || 16, align:o.align });
        }
        if (sc.cast) castLetters(ctx, p, sc.cast.bold);
        if (sc.extra) sc.extra(ctx, p);
      } });
  }
  // Tappable special-angle dots: invisible 32 px buttons over the canvas, one tab stop (roving focus).
  // o = {aria, list() -> [k], label(k), pressed(k)?, focusK() -> k, onPick(k), onKey(k, e) -> handled?}
  function dots(p, o){
    var wrap = p.c.parentNode, btns = {}, box = document.createElement("div");
    box.className = "uc-dots"; box.setAttribute("role", "group"); box.setAttribute("aria-label", o.aria || "Special angles");
    wrap.appendChild(box);
    function sync(){
      var ks = o.list(), seen = {}, fk = o.focusK();
      ks.forEach(function(k){
        seen[k] = 1;
        var b = btns[k];
        if (!b) { b = document.createElement("button"); b.type = "button"; b.className = "uc-dot"; b.dataset.uk = k; box.appendChild(b); btns[k] = b; }
        var a = k * PI / 12;
        b.style.left = (p.c.offsetLeft + p.X(Math.cos(a))) + "px"; b.style.top = (p.c.offsetTop + p.Y(Math.sin(a))) + "px";
        b.setAttribute("aria-label", o.label(k));
        if (o.pressed) b.setAttribute("aria-pressed", String(!!o.pressed(k)));
        b.tabIndex = k === fk ? 0 : -1;
      });
      Object.keys(btns).forEach(function(k){ if (!seen[k]) { btns[k].remove(); delete btns[k]; } });
    }
    box.addEventListener("click", function(e){ var b = e.target.closest(".uc-dot"); if (b) o.onPick(+b.dataset.uk); });
    box.addEventListener("keydown", function(e){ var b = e.target.closest(".uc-dot"); if (b && o.onKey && o.onKey(+b.dataset.uk, e)) e.preventDefault(); });
    p.onDrawn(sync);
    return { sync:sync, focus:function(k){ sync(); var b = btns[k]; if (b) b.focus({ preventScroll:true }); } };
  }
  return { SPECIAL:SPECIAL, SETS:SETS, VIEW:VIEW, info:info, quadOf:quadOf, angT:angT, angM:angM, exHTML:exHTML, valHTML:valHTML, ptHTML:ptHTML,
    label:label, scene:scene, dots:dots, seg:seg, dot:dot, poly:poly, arc:arc, castLetters:castLetters, outside:outside };
})();

var angT = UC.angT, angM = UC.angM;
function th(){ return "@t{θ}"; }
function approx(v){ return "≈ " + num(v, 2); }
function axisWords(ax){ return { "+x":"On the positive `x`-axis", "-x":"On the negative `x`-axis", "+y":"On the positive `y`-axis", "-y":"On the negative `y`-axis" }[ax]; }
function spokenPt(I){ return "Point (" + I.cos.sp + ", " + I.sin.sp + ")."; }
function describeAt(I, extra){
  return "Unit circle. Terminal arm at " + angT(I.k) + (I.quad ? " in quadrant " + I.quad : ", " + MV.plain(MV.md(axisWords(I.axis))).toLowerCase()) + ". " + spokenPt(I) +
    (I.quad ? " Reference angle " + angT(I.ref) + "." : "") + (extra || "");
}

// ---------- hero: the 16 special angles (storyboard in the plan; reduced motion shows the last frame) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, UC.VIEW, { equal:true }), K = UC.SPECIAL, st = { circle:1, a:0, n:K.length, cur:null };
  function cap(k){
    if (k == null) { f.cap.innerHTML = "16 special angles, 16 exact points"; return; }
    var I = UC.info(k);
    f.cap.innerHTML = MV.m(th() + " = " + angM(k) + " → (" + I.cos.m + ", " + I.sin.m + ")");
  }
  p.render = function(){
    var dots = K.slice(0, st.n).map(function(k){ return { k:k }; });
    UC.scene(p, { circle:st.circle, dots:dots, arms:st.circle >= 1 ? [{ a:st.a }] : [], P:st.circle >= 1 ? { a:st.a } : null,
      describe:st.n >= K.length ? "Unit circle with a dot at each of the 16 special angles." : "Unit circle. The terminal arm is sweeping through the special angles." });
  };
  if (MV.reduceMotion) { st.a = 0; p.render(); cap(null); return; }
  st.circle = 0; st.n = 0; p.render(); f.cap.innerHTML = "&nbsp;";
  var i = 0;
  function pause(){
    st.n = i + 1; cap(K[i]); p.render();
    setTimeout(function(){
      var from = K[i] * PI / 12, to = (i + 1 < K.length ? K[i + 1] : 24) * PI / 12;
      MV.tween({ dur:i + 1 < K.length ? 420 : 900, step:function(t){ st.a = from + (to - from) * t; p.render(); }, done:function(){
        i++;
        if (i < K.length) pause(); else { st.a = 0; p.render(); cap(null); }
      } });
    }, 600);
  }
  MV.tween({ dur:1300, step:function(t){ st.circle = t; p.render(); }, done:function(){ st.circle = 1; st.a = 0; pause(); } });
}

// ---------- Explore: unit circle explorer ----------
function explore(host, api){
  var S = api.S;
  if (S.k == null) S.k = 0;
  if (!UC.SETS[S.set]) S.set = "all";
  if (S.tri == null) S.tri = true;
  if (S.pin === undefined) S.pin = null;
  var A = { anim:null, ghost:null, hl:null, flashNow:false, tanRed:false, cancel:null, pending:null, timers:[] };
  var L = MV.pgLayout(host, { shape:"square", aria:"Unit circle" });
  var plot = new MV.Plot(L.canvas, UC.VIEW, { equal:true });
  L.cap.removeAttribute("aria-live"); L.cap.setAttribute("aria-hidden", "true"); // the readout below says the same in words
  L.ctrl.innerHTML =
    '<div class="ux-step" role="group" aria-label="Angle stepper"><button type="button" class="btn sm ux-pm" data-ux="prev" data-k="uxprev" aria-label="Previous angle">−</button>' +
    '<span class="ux-now" id="ux-now" aria-hidden="true"></span><button type="button" class="btn sm ux-pm" data-ux="next" data-k="uxnext" aria-label="Next angle">+</button></div>' +
    '<div id="ux-set"></div><div class="chips ux-tg" id="ux-tg" role="group" aria-label="Show on the circle"></div>' +
    '<div class="ux-pin"><button type="button" class="btn ghost sm" data-ux="pin" data-k="uxpin">Pin</button><span class="tiny" id="ux-pinned"></span></div>' +
    '<p class="tiny muted ux-tip">Tap a dot to jump there. On a keyboard, tab to the circle’s dots: the arrow keys step, Home goes to 0 and End to the last angle.</p>';
  var setSeg = MV.seg($("#ux-set", host), { label:"Step set:", value:S.set, options:[{ id:"six", t:"Sixths" }, { id:"quart", t:"Quarters" }, { id:"all", t:"All special" }],
    onChange:function(v){ stop(); S.set = v; api.save(); paint(); } });
  var dl = UC.dots(plot, { aria:"Special angles. Choose one to move the arm there.", list:function(){ return UC.SETS[S.set]; },
    label:function(k){ return "θ = " + angT(k) + ((S.k % 24) === k ? " (current angle)" : ""); },
    focusK:function(){ var ks = UC.SETS[S.set], c = S.k % 24; return ks.indexOf(c) >= 0 ? c : ks[0]; },
    onPick:function(k){ stop(); S.k = k; api.save(); paint(); }, onKey:keyNav });

  function labelsOn(){ return S.labels != null ? S.labels : (plot.W || 0) >= 430; }
  function curA(){ return A.anim != null ? A.anim : S.k * PI / 12; }
  function special(){ return A.anim == null; }
  function draw(){
    var a = curA(), I = special() ? UC.info(S.k) : null, q = I ? I.quad : UC.quadOf(a), c = Math.cos(a), s = Math.sin(a);
    var ks = UC.SETS[S.set], pin = S.pin;
    var parts = I ? [{ src:"(" + I.cos.m + ", " + I.sin.m + ")" }] : [{ src:"(" + num(c, 2) + ", " + num(s, 2) + ")" }];
    UC.scene(plot, {
      quad:q, dots:ks.map(function(k){ return { k:k }; }), dotLabels:labelsOn() ? ks : [],
      ghost:A.ghost ? (function(g){ var gc = Math.cos(g.a), gs = Math.sin(g.a); return [[0, 0], [gc * g.sx, 0], [gc * g.sx, gs]]; })(A.ghost) : null,
      tri:S.tri && q ? { a:a, cosLab:I ? I.cos.m : num(c, 2), sinLab:I ? I.sin.m : num(s, 2) } : null,
      thetaArc:{ a:a, label:I ? angM(S.k) : null },
      refArc:q ? { a:a, label:I ? "ref. " + angM(I.ref) : null } : null,
      arms:(pin != null ? [{ a:pin * PI / 12, color:css("--ink-2"), width:2.2, dash:[7, 5] }] : []).concat([{ a:a }]),
      P:{ a:a, parts:parts },
      cast:S.cast ? { bold:q } : null,
      extra:pin != null ? function(ctx, p){
        var pa = pin * PI / 12, pc = Math.cos(pa), ps = Math.sin(pa), side = pc * ps >= 0 ? 1 : -1;
        UC.dot(ctx, p, pc, ps, 8, null, css("--ink-2"), 2.4);
        if ((S.k % 24) !== pin || A.anim != null) UC.label(ctx, p, "pinned", p.X(0.72 * pc) - ps * side * 14, p.Y(0.72 * ps) - pc * side * 14, { size:12, color:css("--ink-2"), align:"center" });
      } : null,
      describe:I ? describeAt(I, pin != null ? " Pinned angle " + angT(pin) + "." : "") : "Unit circle. The terminal arm is turning."
    });
  }
  plot.render = function(){ draw(); controls(); };
  function posHTML(I){
    if (I.quad) return ["All three (A)", "Only sine (S)", "Only tangent (T)", "Only cosine (C)"][I.quad - 1];
    var g = { pos:[], zero:[], neg:[], und:[] };
    ["sin", "cos", "tan"].forEach(function(r){ var v = I[r]; (v.undef ? g.und : v.s > 0 ? g.pos : v.s < 0 ? g.neg : g.zero).push(r); });
    var out = ["Positive: " + (g.pos.join(", ") || "none")];
    if (g.zero.length) out.push("zero: " + g.zero.join(", "));
    if (g.neg.length) out.push("negative: " + g.neg.join(", "));
    if (g.und.length) out.push("undefined: " + g.und.join(", "));
    return out.join("; ") + ".";
  }
  function recipHTML(I){
    return ["csc", "sec", "cot"].map(function(r){
      var v = I[r];
      return '<span class="nw">' + (v.undef ? MV.m(r + " " + th()) + " is undefined" : '<span aria-hidden="true">' + MV.m(r + " " + th() + " = " + v.m) + '</span><span class="vh">' + r + " theta = " + v.sp + "</span>") + "</span>";
    }).join(", ");
  }
  function row(key, dt, dd){ return '<div class="' + (A.hl === key ? "uc-hl" + (A.flashNow ? " uc-flash" : "") : "") + '"><dt>' + dt + "</dt><dd>" + dd + "</dd></div>"; }
  function readout(){
    var a = curA(), sp = special(), I = sp ? UC.info(S.k) : null, h = "";
    h += row("ang", "Angle", sp ? MV.m(th() + " = " + angM(S.k)) + ' <span class="muted">(' + num(I.deg) + "°)" + (S.k === 24 ? ", the same point as 0" : "") + "</span>" : MV.m(th() + " " + approx(a)));
    if (!sp) {
      h += row("cos", MV.m("cos " + th()) + ' <span class="muted">(the ' + MV.m("x") + "-coordinate)</span>", MV.m(approx(Math.cos(a))));
      h += row("sin", MV.m("sin " + th()) + ' <span class="muted">(the ' + MV.m("y") + "-coordinate)</span>", MV.m(approx(Math.sin(a))));
      L.read.setAttribute("aria-busy", "true"); L.read.innerHTML = h; return;
    }
    h += row("where", "Where", I.quad ? "Quadrant " + I.quad : MV.md(axisWords(I.axis)));
    h += row("ref", "Reference angle", I.quad ? MV.m(angM(I.ref)) + ", measured to the " + (I.quad === 1 || I.quad === 4 ? "positive" : "negative") + " " + MV.m("x") + "-axis" : "None: the arm lies on an axis");
    h += row("pt", "Point " + MV.m("P"), UC.ptHTML(I));
    h += row("sin", MV.m("sin " + th()) + ' <span class="muted">(the ' + MV.m("y") + "-coordinate)</span>", UC.valHTML(I.sin));
    h += row("cos", MV.m("cos " + th()) + ' <span class="muted">(the ' + MV.m("x") + "-coordinate)</span>", UC.valHTML(I.cos));
    var tan = I.tan.undef ? (A.tanRed ? '<span class="uc-red">' + MV.m("{1}/{0}") + ": undefined</span>" : "undefined") + ' <span class="muted">(' + MV.m("x = 0") + ", so " + MV.m("y/x") + " means dividing by 0)</span>" : UC.valHTML(I.tan);
    h += row("tan", MV.m("tan " + th()) + ' <span class="muted">(= ' + MV.m("y/x") + ")</span>", tan);
    h += row("pos", "Positive here", posHTML(I));
    if (S.recip) h += row("recip", "Reciprocals", recipHTML(I));
    L.read.setAttribute("aria-busy", "false");
    h += row("note", "Note", '<span class="muted">' + MV.m("{√2}/{2}") + " is the same as " + MV.m("{1}/{√2}") + ", and " + MV.m("{√3}/{3}") + " is the same as " + MV.m("{1}/{√3}") + ".</span>");
    L.read.innerHTML = h;
  }
  function controls(){
    var sp = special(), I = UC.info(S.k);
    $("#ux-now", host).innerHTML = sp ? MV.m(th() + " = " + angM(S.k)) : MV.m(th() + " " + approx(curA()));
    var tg = [["tri", "Reference triangle"], ["cast", "CAST letters"], ["recip", "Reciprocal ratios"], ["labels", "Show all angle labels"]];
    MV.keepFocus($("#ux-tg", host), function(){
      $("#ux-tg", host).innerHTML = tg.map(function(t){ var on = t[0] === "labels" ? labelsOn() : !!S[t[0]]; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-tg="' + t[0] + '" data-k="uxtg' + t[0] + '" aria-pressed="' + on + '">' + (on ? "✓ " : "") + t[1] + "</button>"; }).join("");
    });
    var pinTxt = S.pin != null ? "Pinned: " + MV.m(th() + " = " + angM(S.pin)) + ' <button type="button" class="linkbtn" data-ux="unpin" data-k="uxunpin">Clear pin</button>' : '<span class="muted">Pin keeps one angle on the circle (challenge 3).</span>';
    MV.keepFocus($("#ux-pinned", host), function(){ $("#ux-pinned", host).innerHTML = pinTxt; });
    L.cap.innerHTML = sp ? MV.m(th() + " = " + angM(S.k) + " → (" + I.cos.m + ", " + I.sin.m + ")") : MV.m(th() + " " + approx(curA()));
  }
  function paint(){ draw(); readout(); controls(); MV.changed(); }
  function frame(){ draw(); readout(); controls(); }
  // ---- stepping ----
  function step(dir){
    var ks = UC.SETS[S.set], k = S.k;
    if (dir > 0) {
      if (k === 24) { S.k = 0; return; }
      var nx = ks.filter(function(x){ return x > k; })[0];
      S.k = nx == null ? 24 : nx;
    } else {
      if (k === 0) { S.k = ks[ks.length - 1]; return; }
      var pv = ks.filter(function(x){ return x < k; }); S.k = pv[pv.length - 1];
    }
  }
  function keyNav(k, e){
    var key = e.key, ks = UC.SETS[S.set];
    if (key === "ArrowRight" || key === "ArrowUp") { stop(); step(1); }
    else if (key === "ArrowLeft" || key === "ArrowDown") { stop(); step(-1); }
    else if (key === "Home") { stop(); S.k = 0; }
    else if (key === "End") { stop(); S.k = ks[ks.length - 1]; }
    else return false;
    api.save(); paint(); dl.focus(S.k % 24);
    return true;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var u = b.dataset.ux, t = b.dataset.tg;
    if (u === "prev" || u === "next") { stop(); step(u === "next" ? 1 : -1); }
    else if (u === "pin") { stop(); S.pin = S.k % 24; }
    else if (u === "unpin") S.pin = null;
    else if (t) { if (t === "labels") S.labels = !labelsOn(); else S[t] = !S[t]; }
    else return;
    api.save(); paint();
  });
  // ---- animation (K10) for the predictions; any control press stops it and finishes the reveal ----
  function stop(){
    A.ghost = null; A.hl = null; A.tanRed = false;
    if (A.cancel) { A.cancel(); A.cancel = null; }
    A.timers.forEach(clearTimeout); A.timers = [];
    A.anim = null;
    var d = A.pending; A.pending = null;
    if (d) d();
  }
  function later(ms, fn){ A.timers.push(MV.wait(ms, fn)); }
  function sweepTo(k, dur, fn, each, ease){
    var from = S.k * PI / 12, to = k * PI / 12;
    A.cancel = MV.tween({ dur:dur, ease:ease, step:function(t){ A.anim = from + (to - from) * t; if (each) each(t); frame(); },
      done:function(){ A.cancel = null; A.anim = null; S.k = k; api.save(); paint(); if (fn) fn(); } });
  }
  function finish(){ var d = A.pending; A.pending = null; if (d) d(); }
  function steps(list, dur, pauseMs, atStop, end){
    var i = 0;
    (function next(){
      if (i >= list.length) { end(); return; }
      sweepTo(list[i], dur, function(){ if (atStop) atStop(list[i]); i++; later(pauseMs, next); });
    })();
  }
  paint();
  return {
    predict:{
      start:function(p){ stop(); S.k = p.start.k; if (p.id === "p1" || p.id === "p2") S.tri = true; api.save(); paint(); },
      run:function(p, done){
        A.pending = done;
        if (p.id === "p1") {
          A.ghost = { a:PI / 6, sx:1 };
          sweepTo(10, 1700, function(){ later(300, finish); }, function(t){ A.ghost.sx = 1 - 2 * t; });
        } else if (p.id === "p2") {
          A.hl = "cos";
          sweepTo(6, 2800, function(){ later(300, finish); }, null, function(t){ return t; });
        } else if (p.id === "p3") {
          S.cast = true; A.hl = "tan"; paint();
          later(500, function(){ steps([9, 15, 21], 700, 900, function(){ A.flashNow = true; readout(); A.flashNow = false; }, finish); });
        } else if (p.id === "p4") {
          A.hl = "tan";
          steps([2, 3, 4, 6], 500, 700, function(k){ if (k === 6) { A.tanRed = true; readout(); } }, finish);
        } else finish();
      }
    },
    challenge:function(id){
      var k = S.k % 24, I = UC.info(k);
      if (id === "tc1") {
        if (k === 15) return { ok:true };
        if (k === 9) return { ok:false, msg:MV.md("Your point is `(-{√2}/{2}, {√2}/{2})`. The `x` is right, but `y` must be negative too: go below the `x`-axis.") };
        if (k === 21) return { ok:false, msg:MV.md("Your point is `({√2}/{2}, -{√2}/{2})`. The `y` is right, but `x` must be negative: go left of the `y`-axis.") };
        if (k === 3) return { ok:false, msg:"Both coordinates have the right size but the wrong sign. Which quadrant has both negative?" };
        return { ok:false, msg:MV.md("The size is wrong: `±{√2}/{2}` belongs to reference angle `π/4`.") };
      }
      if (id === "tc2") {
        if (k === 22) return { ok:true };
        if (k === 20) return { ok:false, msg:MV.md("`tan(5π/3) = -√3`. The sign is right, but `√3` belongs to reference angle `π/3`. You need `{√3}/{3}`.") };
        if (k === 10) return { ok:false, msg:MV.md("`tan(5π/6) = -{√3}/{3}`, but `5π/6` is in quadrant 2.") };
        if (k === 21) return { ok:false, msg:MV.md("`tan(7π/4) = -1`.") };
        return { ok:false, msg:"Check the quadrant first, then the size of tan." };
      }
      if (id === "tc3") {
        var pin = S.pin;
        if (pin == null) return { ok:false, msg:"Set the first angle and press <strong>Pin</strong>, then set the second angle." };
        var P = UC.info(pin);
        if (pin === k) return { ok:false, msg:"Pick two different angles." };
        if (!P.quad || !I.quad) return { ok:false, msg:"Choose angles off the axes." };
        if ((pin + k) % 24 === 0) return { ok:true };
        if ((pin + k) % 24 === 12) return { ok:false, msg:MV.md("That’s a flip across the `y`-axis: same sine, opposite cosine. You need a flip across the `x`-axis.") };
        if (Math.abs(pin - k) === 12) return { ok:false, msg:"A half turn flips <strong>both</strong> coordinates." };
        return { ok:false, msg:MV.md("Compare the two points: the `x`-coordinates must match, and the `y`-coordinates must be opposites.") };
      }
      return { ok:false };
    }
  };
}

// ---------- Part 3: angle families, the reference triangle in four quadrants, and the sign grid ----------
var FAM_POS = { 1:{ sx:1, sy:1, rot:0 }, 2:{ sx:-1, sy:1, rot:0 }, 3:{ sx:1, sy:1, rot:PI }, 4:{ sx:1, sy:-1, rot:0 } };
function famK(al, q){ return [al, 12 - al, 12 + al, 24 - al][q - 1]; }
function famExpr(al, q){ var a = angT(al), k = famK(al, q); return q === 1 ? a : (q === 2 ? "π - " + a : q === 3 ? "π + " + a : "2π - " + a) + " = " + angT(k); }
function part3(host, api){
  var S = api.S;
  if ([2, 3, 4].indexOf(S.al) < 0) S.al = 2;
  if (!FAM_POS[S.pos]) S.pos = 1;
  S.grid = S.grid || {};
  var T = Object.assign({}, FAM_POS[S.pos]), moving = false, msgs = null;
  host.innerHTML = '<div class="sym fam">' +
    '<div><div class="plot-wrap"><canvas class="plot square" id="fam-plot" role="img" aria-label="Unit circle with a reference triangle"></canvas></div><p class="fam-cap" id="fam-cap" aria-live="polite"></p></div>' +
    '<div><h3 class="fam-h">1. Choose a reference angle</h3><div class="chips" id="fam-al" role="group" aria-label="Reference angle"></div>' +
    '<h3 class="fam-h">2. Move the triangle</h3><div class="fam-mv" id="fam-mv" role="group" aria-label="Move the triangle"></div>' +
    '<p class="tiny muted">Each move starts from quadrant 1. The faded outline is the quadrant 1 triangle.</p></div></div>' +
    '<div class="part"><h3>3. Sign grid</h3><p class="muted">For the four angles in this family, choose + or − for each ratio. Fill all 12 cells, then press <strong>Check signs</strong>.</p>' +
    '<div id="fam-grid"></div><div class="q-actions"><button type="button" class="btn primary sm" id="fam-check" data-k="famcheck">Check signs</button></div><div id="fam-fb" aria-live="polite"></div>' +
    '<details class="alg" id="fam-num"><summary>Check it with numbers</summary><div id="fam-num-b"></div></details></div>';
  var plot = new MV.Plot($("#fam-plot", host), UC.VIEW, { equal:true });
  function g(){ return S.grid[S.al] || (S.grid[S.al] = { v:{}, tries:0, solved:false }); }
  function castOn(){ return Object.keys(S.grid).some(function(k){ return S.grid[k].solved; }); }
  function triPts(){
    var c = Math.cos(S.al * PI / 12), s = Math.sin(S.al * PI / 12);
    return [[0, 0], [c, 0], [c, s]].map(function(q){
      var x = q[0] * T.sx, y = q[1] * T.sy, cr = Math.cos(T.rot), sr = Math.sin(T.rot);
      return [x * cr - y * sr, x * sr + y * cr];
    });
  }
  function draw(){
    var al = S.al, pts = triPts(), P = pts[2], a = Math.atan2(P[1], P[0]); if (a < 0) a += 2 * PI;
    var rest = !moving, I = UC.info(famK(al, S.pos)), q = S.pos;
    var fx = q === 2 || q === 3, fy = q === 3 || q === 4;
    var parts = [{ src:"(" }, { src:I.cos.m, hl:fx }, { src:", " }, { src:I.sin.m, hl:fy }, { src:")" }];
    var c1 = Math.cos(al * PI / 12), s1 = Math.sin(al * PI / 12);
    UC.scene(plot, {
      dots:[1, 2, 3, 4].map(function(qq){ return { k:famK(al, qq) }; }),
      ghost:(q !== 1 || moving) ? [[0, 0], [c1, 0], [c1, s1]] : null,
      thetaArc:rest ? { a:I.a, label:angM(I.k) } : null,
      arms:[{ a:a }], P:{ a:a, parts:rest ? parts : null },
      cast:castOn() ? { bold:rest ? q : 0 } : null,
      extra:function(ctx, p){
        UC.poly(ctx, p, pts, { fill:css("--hi-soft") });
        UC.seg(ctx, p, pts[0][0], pts[0][1], pts[1][0], pts[1][1], css("--ink-2"), 2, [6, 5]);
        UC.seg(ctx, p, pts[1][0], pts[1][1], pts[2][0], pts[2][1], css("--ink-2"), 2, [6, 5]);
      },
      describe:"Unit circle. Reference angle " + angT(al) + ". The triangle is in quadrant " + q + " at angle " + angT(I.k) + ". Point (" + I.cos.sp + ", " + I.sin.sp + ")." + (castOn() ? " CAST letters: A in quadrant 1, S in 2, T in 3, C in 4." : "")
    });
  }
  plot.render = draw;
  function capHTML(){
    var q = S.pos, I = UC.info(famK(S.al, q)), what = q === 1 ? "" : q === 3 ? " Both coordinates changed sign." : q === 2 ? " The " + MV.m("x") + "-coordinate changed sign." : " The " + MV.m("y") + "-coordinate changed sign.";
    return "Quadrant " + q + ": " + MV.m(th() + " = " + famExpr(S.al, q)) + ", point " + UC.ptHTML(I) + "." + what;
  }
  function paintCtl(){
    MV.keepFocus($("#fam-al", host), function(){
      $("#fam-al", host).innerHTML = [2, 3, 4].map(function(k){ return '<button type="button" class="fchip" data-al="' + k + '" data-k="fal' + k + '" aria-pressed="' + (S.al === k) + '"' + (moving ? " disabled" : "") + ">" + MV.m(angT(k)) + "</button>"; }).join("");
    });
    var mv = [[2, "Flip across the " + MV.m("y") + "-axis"], [3, "Half turn"], [4, "Flip across the " + MV.m("x") + "-axis"], [1, "Back to quadrant 1"]];
    MV.keepFocus($("#fam-mv", host), function(){
      $("#fam-mv", host).innerHTML = mv.map(function(m){ return '<button type="button" class="btn ' + (S.pos === m[0] ? "primary" : "ghost") + ' sm" data-mv="' + m[0] + '" data-k="fmv' + m[0] + '" aria-pressed="' + (S.pos === m[0]) + '"' + (moving ? " disabled" : "") + ">" + m[1] + "</button>"; }).join("");
    });
    $("#fam-cap", host).innerHTML = moving ? "Moving…" : capHTML();
  }
  function cellMsg(r, k){
    var I = UC.info(k), q = I.quad, n = "In quadrant " + q + " the point is ";
    if (r === "sin") return n + (I.sin.s > 0 ? "above" : "below") + " the " + MV.m("x") + "-axis, so its " + MV.m("y") + "-coordinate (sin) is " + (I.sin.s > 0 ? "positive" : "negative") + ".";
    if (r === "cos") return n + (I.cos.s > 0 ? "right" : "left") + " of the " + MV.m("y") + "-axis, so cos is " + (I.cos.s > 0 ? "positive" : "negative") + ".";
    var same = I.sin.s === I.cos.s;
    return MV.m("tan = sin/cos") + ". Here they have the " + (same ? "same" : "opposite") + " signs, so tan is " + (same ? "positive" : "negative") + ".";
  }
  var RAT = ["sin", "cos", "tan"];
  function paintGrid(){
    var G = g(), wrong = G.wrong || {};
    var h = '<div class="tbl-wrap"><table class="vt sg"><caption class="vh">Sign grid for the family of ' + angT(S.al) + '</caption><thead><tr><th scope="col">Angle</th>' + RAT.map(function(r){ return '<th scope="col">' + r + "</th>"; }).join("") + "</tr></thead><tbody>";
    [1, 2, 3, 4].forEach(function(q){
      var k = famK(S.al, q);
      h += '<tr><th scope="row">' + MV.m(angT(k)) + "</th>" + RAT.map(function(r){
        var id = q + r, v = G.v[id], bad = wrong[id];
        return '<td class="' + (bad ? "bad" : G.solved ? "good" : "") + '"><span class="sg-pair" role="group" aria-label="Sign of ' + r + " " + angT(k) + '">' +
          ["+", "-"].map(function(s){ return '<button type="button" data-cell="' + id + '" data-v="' + s + '" data-k="sg' + id + s + '" aria-pressed="' + (v === s) + '"' + (G.solved ? " disabled" : "") + ' aria-label="' + (s === "+" ? "positive" : "negative") + '">' + (s === "+" ? "+" : MINUS) + "</button>"; }).join("") +
          "</span>" + (bad ? '<span class="sg-x" aria-label="wrong">✗</span>' : G.solved ? '<span class="sg-ok" aria-hidden="true">✓</span>' : "") + "</td>";
      }).join("") + "</tr>";
    });
    h += "</tbody></table></div>";
    MV.keepFocus($("#fam-grid", host), function(){ $("#fam-grid", host).innerHTML = h; });
    $("#fam-check", host).disabled = G.solved;
    var fb = $("#fam-fb", host);
    if (G.solved) fb.innerHTML = MV.fbHTML("good", "<strong>✓ All 12 signs are right.</strong> This is the CAST rule: in each quadrant, the letter tells you which ratio is positive. <strong>A</strong>ll in quadrant 1; only <strong>S</strong>ine in 2; only <strong>T</strong>angent in 3; only <strong>C</strong>osine in 4.");
    else if (msgs) fb.innerHTML = '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + (msgs.length === 1 && msgs[0].fill ? msgs[0].fill : "Check the cells marked ✗:") + "</p>" + (msgs[0].fill ? "" : '<ul class="sg-fb">' + msgs.map(function(m){ return "<li>" + m + "</li>"; }).join("") + "</ul>") + "</div>";
    else fb.innerHTML = "";
    // numbers panel
    var ks = [1, 2, 3, 4].map(function(q){ return famK(S.al, q); });
    var cell = function(v){ return '<span class="sgn">' + (v.s < 0 ? MINUS : "") + "</span>" + UC.exHTML(v.m.replace(/^-/, ""), v.sp); };
    $("#fam-num-b", host).innerHTML = '<div class="tbl-wrap" style="margin-top:10px"><table class="vt fam-num"><thead><tr><th scope="col"></th>' + ks.map(function(k){ return '<th scope="col">' + MV.m(angT(k)) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      RAT.map(function(r){ return '<tr><th scope="row">' + r + "</th>" + ks.map(function(k){ return "<td>" + cell(UC.info(k)[r]) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><p style="margin:10px 0 0">Same size in every quadrant. Only the sign changes.</p>';
  }
  function paint(){ draw(); paintCtl(); paintGrid(); }
  function animate(from, to, done){
    // one move between quadrant 1 and another quadrant: a flip (scale through 0) or a half turn (rotation)
    var other = from === 1 ? to : from, back = to === 1;
    MV.tween({ dur:1200, step:function(t){
      var u = back ? 1 - t : t;
      if (other === 2) T = { sx:1 - 2 * u, sy:1, rot:0 }; else if (other === 4) T = { sx:1, sy:1 - 2 * u, rot:0 }; else T = { sx:1, sy:1, rot:PI * u };
      draw();
    }, done:function(){ T = Object.assign({}, FAM_POS[to]); done(); } });
  }
  function moveTo(q){
    if (moving || q === S.pos) return;
    var from = S.pos; moving = true; paintCtl();
    var go = function(){ animate(1, q, end); };
    var end = function(){ moving = false; S.pos = q; api.save(); paint(); };
    if (from !== 1 && q !== 1) animate(from, 1, function(){ S.pos = 1; go(); });
    else animate(from, q, end);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.al) { S.al = +b.dataset.al; msgs = null; api.save(); paint(); return; }
    if (b.dataset.mv) { moveTo(+b.dataset.mv); return; }
    if (b.dataset.cell) { var G = g(); G.v[b.dataset.cell] = b.dataset.v; if (G.wrong) delete G.wrong[b.dataset.cell]; api.save(); paintGrid(); return; }
    if (b.id === "fam-check") {
      var G2 = g(), filled = 0, wrong = {}, list = [];
      [1, 2, 3, 4].forEach(function(q){
        var k = famK(S.al, q), I = UC.info(k);
        RAT.forEach(function(r){
          var id = q + r, v = G2.v[id]; if (!v) return; filled++;
          if ((v === "+") !== (I[r].s > 0)) { wrong[id] = 1; list.push("<strong>" + MV.m(r + "(" + angT(k) + ")") + ":</strong> " + cellMsg(r, k)); }
        });
      });
      if (filled < 12) { msgs = [{ fill:"Fill all 12 cells first. " + (12 - filled) + " still need a sign." }]; G2.wrong = wrong; }
      else { G2.tries++; G2.wrong = wrong; msgs = list.length ? list : null; if (!list.length) G2.solved = true; }
      api.save(); paint(); MV.focusFb($("#fam-fb", host).parentNode);
    }
  });
  paint();
}

// ---------- Practice 2: Find the angles (N7 select-all on the N12 circle) ----------
function angles(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  if (S.i >= a.items.length) S.i = 0;
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="fa-n"></span><span class="dots" id="fa-dots" aria-hidden="true"></span></div>' +
    '<div class="fa"><div class="fa-plot"><div class="plot-wrap"><canvas class="plot square" id="fa-plot" role="img" aria-label="Unit circle with the 16 special angles"></canvas></div></div>' +
    '<div class="fa-side"><p class="fa-q" id="fa-q"></p><p class="tiny" id="fa-sel" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="fa-check" data-k="facheck">Check</button><button type="button" class="btn ghost sm" id="fa-clear" data-k="faclear">Clear</button><span id="fa-hint"></span></div>' +
    '<div id="fa-hints"></div><div id="fa-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="fa-prev" data-k="faprev">Previous</button><button type="button" class="btn ghost sm" id="fa-next" data-k="fanext">Next item</button></div></div></div>';
  var plot = new MV.Plot($("#fa-plot", host), UC.VIEW, { equal:true }), focusK = 0;
  function it(){ return a.items[S.i]; }
  function st(){ var x = it(); return S.items[x.id] || (S.items[x.id] = { sel:[], tries:0, hint:0, solved:false, first:null, bad:[], msg:null }); }
  function has(list, k){ return list.indexOf(k) >= 0; }
  function same(x, y){ return x.length === y.length && x.every(function(k){ return has(y, k); }); }
  var dl = UC.dots(plot, { aria:"Special angles. Choose every angle that fits.", list:function(){ return UC.SPECIAL; },
    label:function(k){ return "θ = " + angT(k); }, pressed:function(k){ return has(st().sel, k); }, focusK:function(){ return focusK; },
    onPick:function(k){
      var x = st(); focusK = k; if (x.solved) return;
      var i = x.sel.indexOf(k); if (i < 0) x.sel.push(k); else x.sel.splice(i, 1);
      x.bad = x.bad.filter(function(b){ return has(x.sel, b); }); x.msg = null;
      api.save(); paint();
    },
    onKey:function(k, e){
      var L = UC.SPECIAL, i = L.indexOf(k), n = L.length;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") focusK = L[(i + 1) % n];
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") focusK = L[(i + n - 1) % n];
      else if (e.key === "Home") focusK = L[0];
      else if (e.key === "End") focusK = L[n - 1];
      else return false;
      dl.focus(focusK); return true;
    } });
  plot.render = function(){
    var x = st(), q = it();
    UC.scene(plot, { dots:UC.SPECIAL.map(function(k){ return { k:k, fill:has(x.sel, k) ? css("--hi") : null, bad:has(x.bad, k) }; }), dotLabels:UC.SPECIAL,
      describe:"Unit circle with the 16 special angles for " + MV.plain(q.prompt) + ". Selected: " + (x.sel.length ? x.sel.slice().sort(function(p, r){ return p - r; }).map(angT).join(", ") : "none") + "." });
  };
  function setHTML(list){ return list.slice().sort(function(p, q){ return p - q; }).map(function(k){ return MV.m(angT(k)); }).join(", "); }
  function paint(){
    var q = it(), x = st(), ans = MV.ans(q);
    $("#fa-n", host).textContent = "Item " + (S.i + 1) + " of " + a.items.length;
    $("#fa-dots", host).innerHTML = a.items.map(function(z, i){ var y = S.items[z.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#fa-q", host).innerHTML = q.prompt;
    $("#fa-sel", host).innerHTML = "Your angles: " + (x.sel.length ? setHTML(x.sel) : '<span class="muted">none yet</span>');
    $("#fa-check", host).disabled = x.solved; $("#fa-clear", host).disabled = x.solved;
    MV.keepFocus($("#fa-hint", host), function(){ $("#fa-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("fah" + q.id, x.hint); });
    $("#fa-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(q.hints, x.hint);
    $("#fa-fb", host).innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct: " + MV.m(th()) + " = " + setHTML(ans) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>')) :
      x.msg ? '<div class="fb' + (x.msg.plain ? "" : " bad") + '" role="status"><p>' + (x.msg.plain ? "" : "<strong>✗ Not quite.</strong> ") + x.msg.html + "</p></div>" : "";
    $("#fa-prev", host).disabled = S.i === 0; $("#fa-next", host).disabled = S.i === a.items.length - 1;
    plot.render();
  }
  function judge(q, sel){
    var ans = MV.ans(q), rules = q.rules || [];
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.only && same(sel, r.only)) return r.fb;
      if (r.any) { var hit = r.any.filter(function(k){ return has(sel, k); })[0]; if (hit != null) return r.fb.split("§").join(MV.m(angT(hit))); }
    }
    var bad = sel.filter(function(k){ return !has(ans, k); });
    if (!bad.length) return "Every angle you chose fits, but there’s at least one more. Check the other quadrants.";
    return a.fallback.replace("{r}", MV.m(q.ratio + "(" + angT(bad[0]) + ")")).replace("{v}", q.value);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.classList.contains("uc-dot")) return;
    var q = it(), x = st();
    if (b.id === "fa-prev" || b.id === "fa-next") { S.i += b.id === "fa-prev" ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "fa-clear") { x.sel = []; x.bad = []; x.msg = null; api.save(); paint(); return; }
    if (b.id === "fa-check") {
      var ans = MV.ans(q);
      if (!x.sel.length) { x.msg = { plain:true, html:"Tap at least one dot first." }; paint(); return; }
      if (same(x.sel, ans)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.bad = []; x.msg = null; }
      else { x.tries++; x.bad = x.sel.filter(function(k){ return !has(ans, k); }); x.msg = { html:judge(q, x.sel) }; }
      api.save(); paint(); MV.focusFb(host.querySelector(".fa-side"));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(z){ var y = S.items[z.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var out = []; a.items.forEach(function(z){ var y = S.items[z.id]; if (y && (y.tries > 0 || y.hint >= 3)) out = out.concat(MV.goalIdx(z.goal)); }); return out; }
  };
}

// ---------- Performance task: Make sine meet cosine ----------
var task = (function(){
  var api, plot, QS = ["1", "2", "3", "4", "6"];
  function kOf(p, q){
    p = String(p == null ? "" : p).trim();
    if (!/^\d+$/.test(p) || QS.indexOf(String(q)) < 0) return null;
    var k = (+p) * 12 / (+q);
    return { k:k, ok:k >= 0 && k <= 24 };
  }
  function read(){
    var s = api ? api.S : {};
    return { pA:s.pA || "", qA:s.qA || "", pB:s.pB || "", qB:s.qB || "", A:kOf(s.pA, s.qA), B:kOf(s.pB, s.qB) };
  }
  function both(d){ return !!(d.A && d.A.ok && d.B && d.B.ok); }
  function checks(d){
    var A = d.A && d.A.ok ? d.A.k : null, B = d.B && d.B.ok ? d.B.k : null;
    var eq = both(d) && Math.abs(UC.info(A).sin.v - UC.info(B).cos.v) < 1e-9;
    return [both(d), A != null && A > 6 && A < 12, B != null && B > 18 && B < 24, eq];
  }
  function capHTML(d){
    var f = function(n, x){ return MV.m(n) + " = " + (x && x.ok ? MV.m(angM(x.k)) : x ? '<span class="muted">out of range</span>' : '<span class="muted">?</span>'); };
    return f("A", d.A) + ", " + f("B", d.B);
  }
  function draw(){
    var d = read(), A = d.A && d.A.ok ? d.A.k : null, B = d.B && d.B.ok ? d.B.k : null, arms = [];
    if (A != null) arms.push({ a:A * PI / 12 });
    if (B != null) arms.push({ a:B * PI / 12, color:css("--f3") });
    UC.scene(plot, { arms:arms, dots:UC.SPECIAL.map(function(k){ return { k:k }; }),
      extra:function(ctx, p){
        var hi = css("--hi");
        if (A != null) {
          var ca = Math.cos(A * PI / 12), sa = Math.sin(A * PI / 12);
          UC.seg(ctx, p, ca, 0, ca, sa, hi, 7, null, 0.9); UC.seg(ctx, p, 0, 0, ca, sa, css("--pen"), 3);
          UC.dot(ctx, p, ca, sa, 6, css("--pen"), css("--sheet"), 2);
          var oa = UC.outside(p, A * PI / 12, 14); UC.label(ctx, p, "A", oa.X, oa.Y, { size:16, color:css("--pen"), align:oa.align });
          if (Math.abs(sa) > 0.12) UC.label(ctx, p, "sin A", p.X(ca) + (ca < 0 ? -8 : 8), p.Y(sa / 2), { size:13, align:ca < 0 ? "right" : "left" });
        }
        if (B != null) {
          var cb = Math.cos(B * PI / 12), sb = Math.sin(B * PI / 12);
          UC.seg(ctx, p, 0, sb, cb, sb, hi, 7, null, 0.9); UC.seg(ctx, p, 0, 0, cb, sb, css("--f3"), 3);
          UC.dot(ctx, p, cb, sb, 6, css("--f3"), css("--sheet"), 2);
          var ob = UC.outside(p, B * PI / 12, 14); UC.label(ctx, p, "B", ob.X, ob.Y, { size:16, color:css("--f3"), align:ob.align });
          if (Math.abs(cb) > 0.12) UC.label(ctx, p, "cos B", p.X(cb / 2), p.Y(sb) + (sb <= 0 ? 15 : -15), { size:13, align:"center" });
        }
      },
      describe:"Unit circle with " + (A != null ? "arm A at " + angT(A) + " (sin A = " + UC.info(A).sin.sp + ")" : "no angle A yet") + " and " + (B != null ? "arm B at " + angT(B) + " (cos B = " + UC.info(B).cos.sp + ")" : "no angle B yet") + "." });
  }
  function bars(){
    var d = read(), el = $("#tk-bars"); if (!el) return;
    var A = d.A && d.A.ok ? d.A.k : null, B = d.B && d.B.ok ? d.B.k : null;
    var bar = function(name, col, v){
      if (!v) return '<div class="tk-bar-row"><span class="tk-bl">' + MV.m(name) + '</span><span class="tk-track"><i class="tk-zero"></i></span><span class="tk-bv muted">?</span></div>';
      var w = Math.abs(v.v) * 50, left = v.v < 0 ? 50 - w : 50;
      return '<div class="tk-bar-row"><span class="tk-bl">' + MV.m(name) + '</span><span class="tk-track"><i class="tk-zero"></i><b style="left:' + left + "%;width:" + w + "%;background:var(" + col + ')"></b></span><span class="tk-bv">' + UC.valHTML(v) + "</span></div>";
    };
    var sa = A != null ? UC.info(A).sin : null, cb = B != null ? UC.info(B).cos : null, eq = sa && cb && Math.abs(sa.v - cb.v) < 1e-9;
    el.innerHTML = bar("sin A", "--pen", sa) + bar("cos B", "--f3", cb) + '<p class="tiny tk-verdict">' + (sa && cb ? (eq ? "✓ The bars match: " + MV.m("sin A = cos B") + "." : "✗ The bars don’t match yet.") : '<span class="muted">Enter both angles to compare the lengths.</span>') + "</p>";
  }
  function paintAll(){ draw(); bars(); var c = $("#tk-cap"); if (c) c.innerHTML = capHTML(read()); }
  return {
    render:function(inp, pv, a){
      api = a;
      var box = function(n){
        var q = a.S["q" + n] || "";
        return '<div class="tk-row"><span class="tk-name">' + MV.m(n) + ' =</span><span class="tk-frac"><input id="tk-p' + n + '" data-tk="p' + n + '" type="text" inputmode="numeric" autocomplete="off" maxlength="2" aria-label="' + n + ': the number in front of π, p (0 to 24)" value="' + MV.esc(a.S["p" + n] || "") + '">' +
          '<span class="tk-line" aria-hidden="true"></span><select id="tk-q' + n + '" data-tk="q' + n + '" aria-label="' + n + ': the denominator q"><option value="">q</option>' + QS.map(function(x){ return '<option value="' + x + '"' + (q === x ? " selected" : "") + ">" + x + "</option>"; }).join("") + '</select></span><span class="tk-pi">π</span></div>';
      };
      inp.innerHTML = '<div class="tk-in">' + box("A") + box("B") + "</div>";
      pv.innerHTML = '<p class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square" id="tk-plot" role="img" aria-label="Unit circle with arms A and B"></canvas></div><div class="tk-bars" id="tk-bars"></div>';
      plot = new MV.Plot($("#tk-plot"), UC.VIEW, { equal:true }); plot.render = draw;
      var on = function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); paintAll(); a.update(); };
      inp.addEventListener("input", on); inp.addEventListener("change", on);
      paintAll();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, c){
      var T = MV.C.task.tips, out = [];
      [0, 1, 2].forEach(function(i){ if (!c[i]) out.push(T[i]); });
      if (!c[3] && both(d)) out.push(T[3].replace("{sa}", UC.valHTML(UC.info(d.A.k).sin)).replace("{cb}", UC.valHTML(UC.info(d.B.k).cos)));
      return out;
    },
    key:function(d){ return d.A.k + "|" + d.B.k; },
    label:function(k){ var p = k.split("|"); return "(" + MV.m(angT(+p[0])) + ", " + MV.m(angT(+p[1])) + ")"; },
    text:function(k){ var p = k.split("|"); return "A = " + angT(+p[0]) + ", B = " + angT(+p[1]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ angles:angles },
  task:task
});
})();
