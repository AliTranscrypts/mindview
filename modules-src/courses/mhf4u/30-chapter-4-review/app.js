// MHF4U 30 Chapter 4 Summary & Review: hero (one circle, five identities), per-topic tables (diagnostic, mixed practice,
// Final Check), Connect "Identity toolbox map" (N18 connection builder + the chapter on one page), the mixed-practice set
// (choice, number and fraction entry, π-multiple entry, select-all on the unit circle) and the "Build an exact value" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, PI = Math.PI;
var TOPICS = ["25", "26", "27", "28", "29"];
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(mm, k){ var v = a[+k - 1]; return v == null ? mm : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function modsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }
function scrollTo(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10 and 16 ----------
function modLink(t){ var mm = MV.topicMod(t); return mm.slug ? '<a href="' + mm.nn + "-" + mm.slug + '.html">Revisit module ' + mm.nn + "</a>" : "Revisit module " + t; }
function keyIdea(t){ var k = (MV.C.keyIdeas || {})[t]; return k ? '<div class="tt-key"><p><strong>Key idea:</strong> ' + k.idea + "</p><p><strong>Where to look:</strong> " + k.look + "</p></div>" : ""; }
// rows: [{t, r, n}] -> Module | <head> | Status; "◆ Revisit" rows add the key idea and where to look.
function topicTable(rows, head, caption){
  return '<div class="tt-wrap"><table class="topic-tbl tt"><caption class="vh">' + caption + '</caption><thead><tr><th scope="col">Module</th><th scope="col">' + head + '</th><th scope="col">Status</th></tr></thead><tbody>' +
    rows.map(function(o){
      var mm = MV.topicMod(o.t), pend = !o.n, ok = !pend && o.r === o.n;
      var st = pend ? '<span class="muted">Not tried yet</span>' : ok ? "✓ Ready" : "◆ " + modLink(o.t);
      var h = '<tr class="' + (ok || pend ? "" : "tt-rev") + '"><td>' + mm.nn + ". " + mm.title + "</td><td>" + (pend ? "—" : o.r + "/" + o.n) + "</td><td>" + st + "</td></tr>";
      if (!ok && !pend) h += '<tr class="tt-more"><td colspan="3">' + keyIdea(o.t) + "</td></tr>";
      return h;
    }).join("") + "</tbody></table></div>";
}
// Diagnostic results: the toolkit's review messages, then the per-topic Ready / Revisit table with key ideas.
MV.paintWarmResult = function(){
  var host = $("#warmup-result"), W = MV.warmCfg(), S = MV.S, ws = MV.warmStats();
  if (ws.checked < ws.total) { host.innerHTML = '<p class="tiny muted" style="margin-top:12px">' + ws.checked + " of " + ws.total + " answered.</p>"; return; }
  var frac = ws.score / ws.total;
  var msg = frac >= 5 / 6 - 1e-9 ? "You’re in good shape for this review. Use it to sharpen the details." : frac >= 0.5 ? "Good start. The table below shows which modules to revisit." : "Use the table below: revisit the modules marked before you go further.";
  var rows = TOPICS.map(function(t){
    var qs = W.list.filter(function(q){ return q.topic === t; });
    return { t:t, n:qs.length, r:qs.filter(function(q){ return S.warm[q.id] && S.warm[q.id].correct; }).length };
  }).filter(function(o){ return o.n; });
  host.innerHTML = '<div class="result"><p class="big-score">' + ws.score + " / " + ws.total + "</p>" + (ws.withSol ? '<p class="tiny muted">(' + ws.withSol + " more correct with the worked solution)</p>" : "") +
    "<p>" + msg + "</p>" + topicTable(rows, "Right", "Diagnostic results by module") + "</div>";
};
// Final Check: swap the toolkit's per-topic table for the same table with key ideas.
var finalCtl0 = MV.paintFinalCtl;
MV.paintFinalCtl = function(){
  finalCtl0.apply(this, arguments);
  if (!MV.S.final.submitted) return;
  var tbl = $("#final-ctl .topic-tbl"); if (!tbl) return;
  var tp = MV.finalStats().topics, d = document.createElement("div");
  d.innerHTML = topicTable(TOPICS.filter(function(t){ return tp[t]; }).map(function(t){ return { t:t, r:tp[t][0], n:tp[t][1] }; }), "Right", "Final Check results by module");
  tbl.parentNode.replaceChild(d.firstChild, tbl);
};
// "Modules to revisit" combines the diagnostic, mixed practice and the Final Check.
function mixedWeak(){
  var A = (MV.S.act || {}).mx, out = {}; if (!A || !A.items) return [];
  ((MV.C.mixed || {}).activities || []).forEach(function(a){ (a.items || []).forEach(function(it){ var x = A.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) out[it.topic] = 1; }); });
  return Object.keys(out);
}
var summaryData0 = MV.summaryData;
MV.summaryData = function(){
  var d = summaryData0.apply(this, arguments), w = {};
  d.weak.concat(mixedWeak()).forEach(function(t){ w[t] = 1; });
  d.weak = Object.keys(w).sort();
  return d;
};
var summaryText0 = MV.summaryText;
MV.summaryText = function(){
  var L = summaryText0.apply(this, arguments).split("\n"), S = MV.S, W = MV.warmCfg();
  var flagged = TOPICS.filter(function(t){ return W.list.some(function(q){ var st = S.warm[q.id]; return q.topic === t && st && st.checked && !st.correct; }); });
  return L.map(function(l){ return /^Diagnostic: \d/.test(l) ? l + "; modules flagged: " + (flagged.length ? flagged.join(", ") : "none") : l; }).join("\n");
};

// ---------- unit circle (copied from MHF4U 26; exact values extended to odd twelfths for the task) ----------
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
    s2:["√2", "√2", "square root 2", R2], "2":["2", "2", "2", 2], c3:["{2√3}/{3}", "2√3/3", "2 square root 3 over 3", 2 * R3 / 3], u:["undefined", "undefined", "undefined", NaN],
    // MHF4U 30: odd twelfths (reference angles π/12 and 5π/12) for the task readout
    p:["{√6 + √2}/{4}", "(√6 + √2)/4", "square root 6 plus square root 2, over 4", (Math.sqrt(6) + R2) / 4],
    q:["{√6 - √2}/{4}", "(√6 − √2)/4", "square root 6 minus square root 2, over 4", (Math.sqrt(6) - R2) / 4],
    tq:["2 - √3", "2 − √3", "2 minus square root 3", 2 - R3], tp:["2 + √3", "2 + √3", "2 plus square root 3", 2 + R3],
    cp:["√6 + √2", "√6 + √2", "square root 6 plus square root 2", Math.sqrt(6) + R2], cq:["√6 - √2", "√6 − √2", "square root 6 minus square root 2", Math.sqrt(6) - R2] };
  var REF = { 0:{ sin:"0", cos:"1", tan:"0", csc:"u", sec:"1", cot:"u" }, 2:{ sin:"h", cos:"r3", tan:"t3", csc:"2", sec:"c3", cot:"s3" },
    3:{ sin:"r2", cos:"r2", tan:"1", csc:"s2", sec:"s2", cot:"1" }, 4:{ sin:"r3", cos:"h", tan:"s3", csc:"c3", sec:"2", cot:"t3" },
    6:{ sin:"1", cos:"0", tan:"u", csc:"1", sec:"u", cot:"0" },
    1:{ sin:"q", cos:"p", tan:"tq", csc:"cp", sec:"cq", cot:"tp" }, 5:{ sin:"p", cos:"q", tan:"tp", csc:"cq", sec:"cp", cot:"tq" } };
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }
  function sg(x){ return Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1; }
  function fr(k){ if (!k) return { n:0, d:1 }; var g = gcd(k, 12); return { n:k / g, d:12 / g }; }
  function angT(k){ var f = fr(k); if (!f.n) return "0"; return (f.n === 1 ? "" : f.n) + "π" + (f.d === 1 ? "" : "/" + f.d); }
  function angM(k){ var f = fr(k); if (!f.n) return "0"; var top = (f.n === 1 ? "" : f.n) + "π"; return f.d === 1 ? top : "{" + top + "}/{" + f.d + "}"; }
  function V(key, s){
    var z = SZ[key]; s = (key === "0" || key === "u") ? 0 : s;
    var wrap = s < 0 && / [+-] /.test(z[0]) && z[0][0] !== "{";   // −(2 − √3), not −2 − √3
    return { key:key, s:s, undef:key === "u", v:key === "u" ? NaN : s < 0 ? -z[3] : z[3], m:(s < 0 ? "-" : "") + (wrap ? "(" + z[0] + ")" : z[0]), t:(s < 0 ? MINUS : "") + (wrap ? "(" + z[1] + ")" : z[1]), sp:(s < 0 ? "negative " : "") + z[2] };
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

var angT = UC.angT;
// signed angle sources for k twelfths of π (k may be negative or above 24)
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function angS(k){ if (!k) return "0"; var g = gcd(k, 12), n = Math.abs(k) / g, d = 12 / g; return (k < 0 ? "-" : "") + (n === 1 ? "" : n) + "π" + (d === 1 ? "" : "/" + d); }
function angPlain(k){ return angS(k).replace("-", MINUS); }
function isSpecial(k){ return k != null && k >= 0 && k <= 24 && (k % 2 === 0 || k % 3 === 0); }
function kOf(c){ if (c == null || !isFinite(c)) return null; var k = c * 12, r = Math.round(k); return Math.abs(k - r) < 1e-7 ? r : null; }
function quadA(a){ var c = Math.cos(a), s = Math.sin(a); if (Math.abs(c) < 1e-9 || Math.abs(s) < 1e-9) return 0; return s > 0 ? (c > 0 ? 1 : 2) : (c < 0 ? 3 : 4); }
function rrect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
var REPAINT = [];   // canvases that need a redraw when their part is shown

// ---------- hero: one circle, the whole toolbox (storyboard in the plan; reduced motion shows the final frame) ----------
var HV = { xmin:-2.1, xmax:2.1, ymin:-2.1, ymax:2.1 }, A5 = 5 * PI / 6, R3 = Math.sqrt(3);
// the five identity tags: text parts ({t:1} = θ in cerulean), centre in data units, the point its thin line joins
var HT = [
  { parts:[{ src:"a = r" }, { src:"θ", t:1 }], at:[0.42, 1.8], to:[Math.cos(5 * PI / 12), Math.sin(5 * PI / 12)] },
  { parts:[{ src:"(cos " }, { src:"θ", t:1 }, { src:", sin " }, { src:"θ", t:1 }, { src:")" }], at:[-1.28, 1.8], to:[-R3 / 2, 0.5] },
  { parts:[{ src:"sin(π - " }, { src:"θ", t:1 }, { src:") = sin " }, { src:"θ", t:1 }], at:[1.25, 1.12], to:[R3 / 2, 0.5] },
  { parts:[{ src:"sin(a + b)" }], at:[-1.45, -1.25], to:[Math.cos(13 * PI / 12), Math.sin(13 * PI / 12)] },
  { parts:[{ src:"(√3/2)² + (1/2)² = 1" }], at:[0.08, -0.68], to:[-0.55, 0.15] }
];
function heroTag(ctx, p, tg, on){
  var pt = css("--p-t"), X = p.X(tg.at[0]), Y = p.Y(tg.at[1]), tx = p.X(tg.to[0]), ty = p.Y(tg.to[1]);
  ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(tx, ty); ctx.stroke();
  ctx.fillStyle = css("--ink-2"); ctx.beginPath(); ctx.arc(tx, ty, 2.6, 0, 2 * PI); ctx.fill(); ctx.restore();
  var parts = tg.parts.map(function(q){ return { src:q.src, color:q.t && !on ? pt : null }; });
  var b = UC.label(ctx, p, parts, X, Y, { size:13, align:"center", bgColor:css(on ? "--hi" : "--sheet"), color:css(on ? "--hi-ink" : "--ink") });
  var Yc = Math.max(b.h / 2 + 2, Math.min(p.H - b.h / 2 - 2, Y));
  ctx.save(); ctx.strokeStyle = css(on ? "--ink" : "--ink-2"); ctx.lineWidth = on ? 1.6 : 1.1; rrect(ctx, b.x - 4, Yc - b.h / 2 - 1, b.w + 8, b.h + 2, 6); ctx.stroke(); ctx.restore();
}
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, HV, { equal:true }), steps = (MV.C.hero.fig || {}).steps || [];
  var st = { arm:A5, pt:1, mir:1, arm2:1, tri:1, k:steps.length, cur:-1 };
  function cap(){
    f.cap.innerHTML = st.k ? steps.slice(0, st.k).map(function(s, i){ return '<span class="hc-l' + (i === st.cur ? " cur" : "") + '">' + s.cap + "</span>"; }).join("") : "&nbsp;";
  }
  p.render = function(){
    var done = st.k >= steps.length && st.tri >= 1;
    p.draw({ view:HV, equal:true, xTicks:{ step:0.5, fmt:function(){ return ""; } }, yTicks:{ step:0.5, fmt:function(){ return ""; } },
      describe:done ? MV.plain(MV.C.hero.fig.aria) : "Unit circle. " + steps.slice(0, st.k).map(function(s){ return MV.plain(s.cap); }).join(" "),
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), pt = css("--p-t");
        UC.arc(ctx, p, 0, 2 * PI, 1, ink2, 2);
        if (st.tri > 0) {
          UC.poly(ctx, p, [[0, 0], [-R3 / 2, 0], [-R3 / 2, 0.5]], { fill:css("--hi-soft"), alpha:st.tri });
          UC.seg(ctx, p, 0, 0, -R3 / 2, 0, ink2, 2, [6, 5], st.tri); UC.seg(ctx, p, -R3 / 2, 0, -R3 / 2, 0.5, ink2, 2, [6, 5], st.tri);
        }
        if (st.arm > 1e-6) { UC.arc(ctx, p, 0, st.arm, 1, pt, 5); UC.arc(ctx, p, 0, st.arm, 0.2, pt, 2.5); }
        if (st.mir > 0) {
          var mx = -R3 / 2 + R3 * st.mir;
          UC.seg(ctx, p, 0, -1.2, 0, 1.2, ink2, 1.5, [2, 5]);
          UC.seg(ctx, p, -R3 / 2, 0.5, mx, 0.5, ink2, 1.5, [4, 4]);
          if (st.mir >= 1) UC.seg(ctx, p, 0, 0, R3 / 2, 0.5, ink2, 2.2, [7, 5]);
          UC.dot(ctx, p, mx, 0.5, 6, css("--sheet"), ink2, 2.2);
        }
        if (st.arm2 > 0) {
          var a2 = A5 + PI / 4 * st.arm2;
          UC.seg(ctx, p, 0, 0, Math.cos(a2), Math.sin(a2), ink, 2.5, [10, 6]);
          UC.arc(ctx, p, A5, a2, 0.36, ink2, 1.6); UC.arc(ctx, p, A5, a2, 0.41, ink2, 1.6);
        }
        if (st.arm > 1e-6) UC.seg(ctx, p, 0, 0, Math.cos(st.arm), Math.sin(st.arm), pen, 3);
        if (st.arm >= A5 - 1e-6) UC.label(ctx, p, [{ src:"θ", color:pt }], p.X(0.3 * Math.cos(A5 / 2)), p.Y(0.3 * Math.sin(A5 / 2)), { size:14, align:"center" });
        if (st.pt) {
          UC.dot(ctx, p, -R3 / 2, 0.5, 10, css("--hi"), null); UC.dot(ctx, p, -R3 / 2, 0.5, 5.5, ink, css("--sheet"), 2);
          UC.label(ctx, p, "(-{√3}/{2}, {1}/{2})", p.X(-R3 / 2) - 14, p.Y(0.5) - 4, { size:13, align:"right" });
        }
        if (st.tri >= 1) {
          UC.label(ctx, p, "{√3}/{2}", p.X(-R3 / 4), p.Y(0) + 17, { size:12, align:"center" });
          UC.label(ctx, p, "{1}/{2}", p.X(-R3 / 2) + 6, p.Y(0.2), { size:12, align:"left", bg:false });
          UC.label(ctx, p, "1", p.X(-R3 / 4) + 7, p.Y(0.25) - 11, { size:12, align:"center", bg:false });
        }
        for (var i = 0; i < st.k; i++) heroTag(ctx, p, HT[i], i === st.cur);
      } });
  };
  cap();
  if (MV.reduceMotion) { p.render(); return; }
  st = { arm:0, pt:0, mir:0, arm2:0, tri:0, k:0, cur:-1 }; p.render(); cap();
  function tw(dur, key, then){ MV.tween({ dur:dur, step:function(t){ st[key] = key === "arm" ? A5 * t : t; p.render(); }, done:function(){ st[key] = key === "arm" ? A5 : 1; p.render(); then(); } }); }
  function step(i){
    st.k = i + 1; st.cur = i; cap(); p.render();
    var next = function(){ MV.wait(1000, function(){ if (i + 1 < steps.length) step(i + 1); else MV.wait(1600, function(){ st.cur = -1; cap(); p.render(); }); }); };
    if (i === 0) tw(1500, "arm", next);
    else if (i === 1) { st.pt = 1; p.render(); next(); }
    else if (i === 2) tw(1100, "mir", next);
    else if (i === 3) tw(1100, "arm2", next);
    else tw(800, "tri", next);
  }
  MV.wait(400, function(){ step(0); });
}

// ---------- Connect: identity toolbox map ----------
// @component N18 connectionBuilder (adapted from MHF4U 24 for a concept map) — three columns of tappable cards (where it
// comes from | identities | jobs); tap two cards, choose the link word ("comes from" / "is used to") and press Link in a
// sticky bar. Correct links draw --hi SVG connectors that stay (curves between the columns; arcs in the left margin when the
// columns stack on phones). One challenge card at a time: a link, a link with a follow-up choice, or an ordered chain of
// links; first-try tracking; named wrong-link feedback (by the other card, then a default; a wrong link word has its own).
var CN = null;
function connect(host, api){
  var C = api.content, U = C.ui, CH = C.challenges, S = api.S, msg = {}, CARD = {}, COLS = ["src", "id", "job"];
  COLS.forEach(function(col, ci){ C.cards[col].forEach(function(c){ CARD[c.id] = { col:col, ci:ci, c:c }; }); });
  S.cur = clamp(S.cur || 0, 0, CH.length - 1); S.ch = S.ch || {}; S.sel = S.sel || { a:null, b:null, w:null };
  function st(c){ var x = S.ch[c.id] || (S.ch[c.id] = { tries:0, linked:false, solved:false, first:null, other:null, seq:[], pick:null }); x.seq = x.seq || []; return x; }
  function solved(id){ var x = S.ch[id]; return !!(x && x.solved); }
  function acc(c){ return String(MV.ans(c)).split(c.type === "chain" ? ">" : "|"); }
  function live(c){ var x = st(c); return c.type === "chain" ? !x.solved : !x.linked; }
  function short(id){ var o = CARD[id]; return o.col === "id" ? "<strong>" + o.c.name + "</strong>" : o.c.t; }
  function stemHTML(c){ var o = CARD[c.stem]; return o.col === "id" ? o.c.t : "“" + o.c.t + "”"; }
  function ph(t){ return '<span class="muted">[' + t + "]</span>"; }
  function cardBtn(id){
    var o = CARD[id], c = o.c;
    return '<button type="button" class="tm-card tm-' + o.col + '" data-card="' + id + '" data-k="tmc' + id + '" aria-pressed="false" aria-label="' + MV.esc(MV.plain((c.name ? c.name + ": " : "") + c.t)) + '">' +
      (c.name ? '<span class="tm-n">' + c.name + "</span>" : "") + '<span class="tm-t">' + c.t + "</span></button>";
  }
  host.innerHTML = '<div class="tm"><div class="cv-chal" id="tm-chal"></div><div class="tm-board" id="tm-board">' +
    COLS.map(function(col){ return '<div class="tm-col" data-col="' + col + '"><h3 class="tm-h">' + U[col] + '</h3><div class="tm-cards" role="group" aria-label="' + MV.esc(MV.plain(U[col])) + '">' + C.cards[col].map(function(c){ return cardBtn(c.id); }).join("") + "</div></div>"; }).join("") +
    '<svg class="tm-links" aria-hidden="true"></svg></div><div class="tm-bar" id="tm-bar"></div><div class="tm-one" id="tm-one"></div></div>';
  var root = $(".tm", host), board = $("#tm-board", root);

  // ---- links made so far ----
  function pairsOf(c){
    var x = S.ch[c.id]; if (!x) return { list:[], pend:false };
    if (c.type === "chain") return x.solved ? { list:acc(c), pend:false } : { list:x.seq.slice(), pend:true };
    return x.linked ? { list:[x.other], pend:false } : { list:[], pend:false };
  }
  function linkedCards(){ var o = {}; CH.forEach(function(c){ var pr = pairsOf(c); if (pr.pend) return; pr.list.forEach(function(id){ o[id] = 1; o[c.stem] = 1; }); }); return o; }
  function cardEl(id){ return board.querySelector('[data-card="' + id + '"]'); }
  function links(){
    var svg = $(".tm-links", board), base = board.getBoundingClientRect(); if (!base.width) return;
    var stacked = getComputedStyle(board).gridTemplateColumns.split(" ").length < 2, out = "";
    CH.forEach(function(c, ci){
      var pr = pairsOf(c);
      pr.list.forEach(function(o){
        var A = cardEl(c.stem).getBoundingClientRect(), B = cardEl(o).getBoundingClientRect(), d, x1, y1, x2, y2;
        if (stacked) {
          x1 = A.left - base.left; y1 = A.top + A.height / 2 - base.top; x2 = B.left - base.left; y2 = B.top + B.height / 2 - base.top;
          var bu = clamp(12 + Math.abs(y2 - y1) * 0.035, 12, 32);
          d = "M" + x1 + " " + y1 + " C" + (x1 - bu) + " " + y1 + " " + (x2 - bu) + " " + y2 + " " + x2 + " " + y2;
        } else {
          var L = CARD[c.stem].ci < CARD[o].ci ? A : B, R = L === A ? B : A;
          x1 = L.right - base.left; y1 = L.top + L.height / 2 - base.top; x2 = R.left - base.left; y2 = R.top + R.height / 2 - base.top;
          var mx = (x1 + x2) / 2;
          d = "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2;
        }
        out += '<path class="tm-ln' + (ci === S.cur ? " cur" : "") + (pr.pend ? " pend" : "") + '" d="' + d + '"/><circle class="tm-end" cx="' + x1 + '" cy="' + y1 + '" r="3.5"/><circle class="tm-end" cx="' + x2 + '" cy="' + y2 + '" r="3.5"/>';
      });
    });
    svg.innerHTML = out;
  }

  // ---- painting ----
  function sentence(){
    var s = S.sel, a = s.a, b = s.b;
    if (a && b && s.w) {
      var ca = CARD[a], cb = CARD[b];
      if (s.w === "from" ? (cb.col === "id" && ca.col !== "id") : (cb.col === "id" && ca.col === "job")) { var t = a; a = b; b = t; }
    }
    return (a ? short(a) : ph(U.card1)) + " " + (s.w ? "<strong>" + U[s.w] + "</strong>" : ph("…")) + " " + (b ? short(b) : ph(U.card2));
  }
  function paintBoard(){
    var c = CH[S.cur], lv = live(c), lk = linkedCards();
    $$(".tm-card", root).forEach(function(b){
      var id = b.dataset.card, on = S.sel.a === id || S.sel.b === id;
      b.classList.toggle("on", on); b.classList.toggle("linked", !!lk[id]); b.classList.toggle("stem", lv && id === c.stem);
      b.setAttribute("aria-pressed", String(on)); b.disabled = !lv;
    });
    root.classList.toggle("live", lv);
    links();
  }
  function paintBar(){
    var c = CH[S.cur], bar = $("#tm-bar", root);
    bar.hidden = !live(c); if (bar.hidden) return;
    MV.keepFocus(bar, function(){
      bar.innerHTML = '<p class="tm-sent" aria-live="polite">' + sentence() + '</p><div class="tm-row"><span class="tm-wl">' + U.word + '</span><span class="tm-words" role="group" aria-label="' + MV.esc(MV.plain(U.word)) + '">' +
        ["from", "use"].map(function(w){ return '<button type="button" class="chip' + (S.sel.w === w ? " on" : "") + '" data-w="' + w + '" data-k="tmw' + w + '" aria-pressed="' + (S.sel.w === w) + '">' + U[w] + "</button>"; }).join("") +
        '</span><span class="q-actions"><button type="button" class="btn primary sm" data-tm="link" data-k="tmlink">' + U.link + '</button><button type="button" class="btn ghost sm" data-tm="clear" data-k="tmclear">' + U.clear + "</button></span></div>";
    });
  }
  function doneLine(c, x){
    if (c.type === "chain") return "“" + CARD[c.stem].c.t + "” uses " + acc(c).map(short).join(", then ");
    return c.label === "from" ? short(c.stem) + " " + U.from + " " + short(x.other) : short(x.other) + " " + U.use + " " + short(c.stem);
  }
  function paintChal(){
    var c = CH[S.cur], x = st(c), i = S.cur, box = $("#tm-chal", root), h, M = msg[c.id];
    h = '<div class="pred-top cv-top"><span class="tiny muted">Link ' + (i + 1) + " of " + CH.length + '</span><span class="cv-tags"><span class="tag">' + modsLabel(c.topics) + "</span>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + '</span><span class="dots" aria-hidden="true">' +
      CH.map(function(q, k){ return '<span class="dot' + (solved(q.id) ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="q-head"><div class="q-prompt">' + c.prompt + "</div></div>";
    if (c.type === "chain") {
      var seq = x.solved ? acc(c) : x.seq;
      h += '<p class="tm-seq"><strong>' + U.chainHead + "</strong> " + (seq.length ? seq.map(function(id, k){ return '<span class="tm-si">' + (k + 1) + ". " + short(id) + "</span>"; }).join(" ") : '<span class="muted">' + U.none + "</span>") + "</p>";
      if (!x.solved) h += '<p class="how">' + C.how + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-tm="check" data-k="tmcheck">' + U.chainCheck + '</button><button type="button" class="btn ghost sm" data-tm="reset" data-k="tmreset"' + (seq.length ? "" : " disabled") + ">" + U.chainReset + "</button></div>";
    } else if (!x.linked) h += '<p class="how">' + C.how + "</p>";
    var nf = x.first ? "" : ' <span class="muted">(not first try)</span>';
    if (x.solved) {
      var w = c.type === "chain" ? c.why.chain : c.why[x.other];
      if (c.split && x.pick != null) w += " " + c.split[x.pick].why;
      h += MV.fbHTML("good", "<strong>✓ Linked:</strong> " + doneLine(c, x) + ". " + w + nf);
    } else if (x.linked && c.split) {
      h += MV.fbHTML("good", "<strong>✓ Linked:</strong> " + doneLine(c, x) + ". " + c.why[x.other]);
      h += '<p class="tm-sq">' + U.splitQ + '</p><div class="tm-split" role="group" aria-label="' + MV.esc(MV.plain(U.splitQ)) + '">' +
        c.split.map(function(o, k){ return '<button type="button" class="btn ghost tm-sp" data-split="' + k + '" data-k="tms' + k + '">' + o.t + "</button>"; }).join("") + "</div>";
      if (M) h += M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
    } else if (M) h += M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="tmprev"' + (i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="tmnext"' + (i === CH.length - 1 ? " disabled" : "") + ">Next link</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  var onePlot = null;
  function paintOne(){
    var el = $("#tm-one", root), n = CH.filter(function(c){ return solved(c.id); }).length, O = C.onePage;
    if (n < CH.length) { el.dataset.done = ""; onePlot = null; el.innerHTML = '<p class="tiny muted">' + n + " of " + CH.length + " links done. “" + MV.plain(O.title) + "” appears when all " + CH.length + " are done.</p>"; return; }
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var cells = O.ids.map(function(q, i){
      var c = CARD[q.id].c;
      return '<div class="tm-oc tm-oc' + i + '"><span class="tm-n">' + c.name + '</span><span class="tm-t">' + c.t + '</span><span class="tm-from">' + q.from + '</span><span class="tag">' + (/ and /.test(q.mods) ? "Modules " : "Module ") + q.mods + "</span></div>";
    }).join("");
    el.innerHTML = "<h3>" + O.title + '</h3><p class="muted">' + O.intro + '</p><div class="tm-onegrid">' + cells + '<div class="tm-ocirc"><canvas class="plot square" id="tm-anat" role="img" aria-label="' + MV.esc(MV.plain(O.aria)) + '"></canvas></div></div>' +
      '<h4 class="tm-jh">' + O.jobsTitle + '</h4><ul class="tm-jobs">' + O.jobs.map(function(j){ return "<li>" + j + "</li>"; }).join("") + "</ul>";
    onePlot = new MV.Plot($("#tm-anat", el), UC.VIEW, { equal:true });
    var A = 0.95, ink2 = css("--ink-2");
    onePlot.render = function(){
      UC.scene(onePlot, { tri:{ a:A, cosLab:"cos x", sinLab:"sin x", fill:css("--hi-soft") }, arms:[{ a:A }], P:{ a:A, parts:"(cos x, sin x)" }, describe:MV.plain(O.aria),
        extra:function(ctx, p){ UC.arc(ctx, p, 0, A, 0.2, css("--ink-2"), 2); UC.label(ctx, p, "x", p.X(0.3 * Math.cos(A / 2)), p.Y(0.3 * Math.sin(A / 2)), { size:14, color:ink2, align:"center" }); } });
    };
    onePlot.render();
  }
  function paintAll(){ paintChal(); paintBar(); paintBoard(); paintOne(); }

  // ---- judging ----
  function bad(t){ return { bad:true, html:"<strong>✗ Not quite.</strong> " + t + " Try again." }; }
  function info(t){ return { bad:false, html:t }; }
  function link(c, x){
    var s = S.sel;
    if (!s.a || !s.b || !s.w) { msg[c.id] = info(U.needAll); return; }
    if (s.a !== c.stem && s.b !== c.stem) { msg[c.id] = info(F(U.notStem, [stemHTML(c)])); return; }
    var other = s.a === c.stem ? s.b : s.a;
    if (c.type === "chain") {
      if (s.w !== c.label) { x.tries++; msg[c.id] = bad(U.labelUse); return; }
      if (x.seq.length >= 2) { msg[c.id] = info(U.chainFull); return; }
      x.seq.push(other); S.sel = { a:c.stem, b:null, w:s.w }; msg[c.id] = info(F(U.chainAdded, [x.seq.length]));
      return;
    }
    if (acc(c).indexOf(other) < 0) { x.tries++; msg[c.id] = bad(c.fb[other] || c.fb.def); return; }
    if (s.w !== c.label) { x.tries++; msg[c.id] = bad(c.label === "from" ? U.labelFrom : U.labelUse); return; }
    x.linked = true; x.other = other; S.sel = { a:null, b:null, w:null }; msg[c.id] = null;
    if (!c.split) { x.solved = true; x.first = x.tries === 0; }
  }
  function checkChain(c, x){
    var want = acc(c), seq = x.seq;
    if (!seq.length) { msg[c.id] = info(U.chainNeed); return; }
    if (seq.join(">") === want.join(">")) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; S.sel = { a:null, b:null, w:null }; return; }
    x.tries++;
    var f = seq.length === 1 && seq[0] === want[0] ? c.fb.one : (seq.length === 2 && seq[0] === want[1] && seq[1] === want[0]) ? c.fb.order : c.fb.def;
    msg[c.id] = bad(f);
  }
  function after(scroll){ api.save(); paintAll(); var bx = $("#tm-chal", root); if (scroll) scrollTo(bx); MV.focusFb(bx); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CH[S.cur], x = st(c);
    if (b.dataset.cv) {
      S.cur = clamp(S.cur + (b.dataset.cv === "next" ? 1 : -1), 0, CH.length - 1); S.sel = { a:null, b:null, w:null };
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.card) {
      var id = b.dataset.card, s = S.sel;
      if (s.a === id) { s.a = s.b; s.b = null; } else if (s.b === id) s.b = null; else if (!s.a) s.a = id; else s.b = id;
      msg[c.id] = null; api.save(); paintBar(); paintBoard(); return;
    }
    if (b.dataset.w) { S.sel.w = S.sel.w === b.dataset.w ? null : b.dataset.w; api.save(); paintBar(); return; }
    if (b.dataset.tm === "clear") { S.sel = { a:null, b:null, w:null }; msg[c.id] = null; api.save(); paintBar(); paintBoard(); return; }
    if (b.dataset.tm === "link") { link(c, x); after(true); return; }
    if (b.dataset.tm === "check") { checkChain(c, x); after(true); return; }
    if (b.dataset.tm === "reset") { x.seq = []; msg[c.id] = null; S.sel = { a:null, b:null, w:null }; after(false); return; }
    if (b.dataset.split != null && c.split && x.linked && !x.solved) {
      var o = c.split[+b.dataset.split];
      if (MV.ok(o)) { x.solved = true; x.pick = +b.dataset.split; x.first = x.tries === 0; msg[c.id] = null; }
      else { x.tries++; msg[c.id] = bad(o.why); }
      after(false);
    }
  });
  paintAll();
  CN = { repaint:function(){ links(); if (onePlot) onePlot.render(); } };
  if (window.ResizeObserver) new ResizeObserver(links).observe(board);

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:CH.length, done:d, line:C.summary + " (first try): " + f + "/" + CH.length + (d < CH.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.tries > 0) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}

// ---------- Mixed practice: choice (retry), number and fraction entry, π-multiple entry (N4), select-all on the unit circle (N7) ----------
var GENERAL = "Check your work, or use a hint.";
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {}, ucs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>"; }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    var M = msgs[it.id]; if (!M) return "";
    return M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
  }
  function actions(it, x){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.kind === "circle" ? '<button type="button" class="btn ghost sm" data-act="clear" data-k="' + it.id + 'clr">Clear</button>' : "") + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  function inp(it, x){
    var id = "mxn-" + it.id, im = it.keypad === "decimal" ? "decimal" : "text";
    return '<label class="mx-lab" for="' + id + '">' + (it.label || "Your answer:") + '</label><span class="mx-cell"><input class="numin short" id="' + id + '" data-mxn="' + it.id + '" type="text" inputmode="' + im + '" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + ">" +
      (it.kind === "pi" ? '<span class="mx-pi">' + m("π") + "</span>" : "") + (it.unit ? '<span class="mx-unit">' + it.unit + "</span>" : "") + "</span>";
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  // ---- select-all on the unit circle (N7 on the N12 circle, as in MHF4U 26's "Find the angles") ----
  function has(list, k){ return list.indexOf(k) >= 0; }
  function setHTML(list){ return list.slice().sort(function(p, q){ return p - q; }).map(function(k){ return m(angT(k)); }).join(", "); }
  function buildCircle(it, el, i){
    el.innerHTML = head(it, i) + '<p class="how">Tap every angle on the circle that fits (tap again to remove it). On a keyboard, tab to the dots and use the arrow keys.</p>' +
      '<div class="mx-ucw"><div class="mx-ucp"><div class="plot-wrap"><canvas class="plot square" role="img" aria-label="Unit circle with the 16 special angles"></canvas></div></div><div class="mx-ucs"><p class="mx-yours" aria-live="polite"></p><div class="mx-dyn"></div></div></div>';
    var plot = new MV.Plot($("canvas", el), UC.VIEW, { equal:true }), o = { plot:plot, focusK:0 };
    o.dl = UC.dots(plot, { aria:"Special angles. Choose every angle that fits.", list:function(){ return UC.SPECIAL; },
      label:function(k){ return "θ = " + angT(k); }, pressed:function(k){ return has(ist(it.id).sel || [], k); }, focusK:function(){ return o.focusK; },
      onPick:function(k){
        var x = ist(it.id); o.focusK = k; if (x.solved) return;
        x.sel = x.sel || []; var j = x.sel.indexOf(k); if (j < 0) x.sel.push(k); else x.sel.splice(j, 1);
        x.bad = (x.bad || []).filter(function(q){ return has(x.sel, q); }); msgs[it.id] = null;
        api.save(); paint(it);
      },
      onKey:function(k, e){
        var L = UC.SPECIAL, j = L.indexOf(k), n = L.length;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") o.focusK = L[(j + 1) % n];
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") o.focusK = L[(j + n - 1) % n];
        else if (e.key === "Home") o.focusK = L[0];
        else if (e.key === "End") o.focusK = L[n - 1];
        else return false;
        o.dl.focus(o.focusK); return true;
      } });
    plot.render = function(){
      var x = ist(it.id), sel = x.sel || [], bd = x.bad || [];
      UC.scene(plot, { dots:UC.SPECIAL.map(function(k){ return { k:k, fill:has(sel, k) ? css("--hi") : null, bad:has(bd, k) }; }), dotLabels:UC.SPECIAL,
        describe:"Unit circle with the 16 special angles. Selected: " + (sel.length ? sel.slice().sort(function(p, q){ return p - q; }).map(angT).join(", ") : "none") + "." });
    };
    ucs[it.id] = o; REPAINT.push(function(){ plot.render(); });
  }

  function paint(it){
    var i = items.indexOf(it), x = ist(it.id), el = box(it);
    if (it.kind === "mc") {
      MV.keepFocus(el, function(){
        el.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:MV.topicLabel(it.topic) + (it.star ? '</span><span class="tag">★ Challenge' : "") }) +
          (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "");
      });
    } else if (it.kind === "circle") {
      if (!ucs[it.id]) buildCircle(it, el, i);
      var sel = x.sel || [];
      $(".mx-yours", el).innerHTML = "<strong>Your angles:</strong> " + (sel.length ? setHTML(sel) : '<span class="muted">none yet</span>');
      var dyn = $(".mx-dyn", el);
      MV.keepFocus(dyn, function(){ dyn.innerHTML = actions(it, x) + feedback(it, x); });
      ucs[it.id].plot.render();
    } else {
      MV.keepFocus(el, function(){ el.innerHTML = head(it, i) + '<div class="numrow">' + inp(it, x) + "</div>" + actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
    }
    paintSum();
  }
  function paintSum(){
    var el = $(".mx-sum", host), done = items.filter(function(it){ return ist(it.id).solved; }).length;
    if (done < items.length) { el.innerHTML = '<p class="tiny muted">' + done + " of " + items.length + " done. Your first-try table by module appears when all " + items.length + " are done.</p>"; return; }
    var rows = TOPICS.map(function(t){ var its = items.filter(function(it){ return it.topic === t; }); return { t:t, n:its.length, r:its.filter(function(it){ return ist(it.id).first; }).length }; }).filter(function(o){ return o.n; });
    el.innerHTML = '<div class="part"><h3>Your first tries by module</h3>' + topicTable(rows, "First try", "Mixed practice first tries by module") + "</div>";
  }
  function bad(text){ return { bad:true, html:"<strong>✗ Not quite.</strong> " + text + " Try again." }; }
  function close(v, w){ return Math.abs(v - w) <= 1e-6 * Math.max(1, Math.abs(w)); }
  function judge(it, x){
    var ans = MV.ans(it), v, w;
    if (it.kind === "num" || it.kind === "pi") {
      var raw = String(x.val || "").replace(/°|degrees?|cm|rad\/s/gi, "").trim();
      v = MV.parseNum(raw);
      if (!v || v.length !== 1) return { msg:{ bad:false, html:it.kind === "pi" ? "Enter the number in front of π, such as 3 or 1/2." : "Enter a number, such as 12, 0.5 or 3/4." } };
      var val = it.kind === "pi" && /π|pi/i.test(raw) ? v[0] / PI : v[0];
      if (close(val, ans)) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return close(val, q.match); })[0];
      return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "circle") {
      var sel = x.sel || [];
      if (!sel.length) return { msg:{ bad:false, html:"Tap at least one dot first." } };
      if (sel.length === ans.length && sel.every(function(k){ return has(ans, k); })) return { ok:true };
      x.bad = sel.filter(function(k){ return !has(ans, k); });
      var rules = it.rules || [];
      for (var r = 0; r < rules.length; r++) { var hit = rules[r].any.filter(function(k){ return has(sel, k); })[0]; if (hit != null) return { msg:bad(rules[r].fb) }; }
      if (!x.bad.length) return { msg:bad("Every angle you chose fits, but there’s at least one more. Check the other quadrants.") };
      var k0 = x.bad[0], I = UC.info(k0)[it.ratio];
      return { msg:bad(I.undef ? m(it.ratio + "(" + angS(k0) + ")") + " is undefined." : m(it.ratio + "(" + angS(k0) + ") = " + I.m) + ", not " + it.value + ".") };
    }
  }
  host.addEventListener("input", function(e){ var t = e.target, id = t.dataset && t.dataset.mxn; if (!id) return; ist(id).val = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.mxn) return;
    var b = host.querySelector('[data-k="' + e.target.dataset.mxn + 'chk"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.classList.contains("uc-dot")) return;
    var el = b.closest("[data-mx]"); if (!el) return;
    var it = items.filter(function(q){ return q.id === el.dataset.mx; })[0], x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paint(it); return; }
    if (b.dataset.act === "clear") { x.sel = []; x.bad = []; msgs[it.id] = null; api.save(); paint(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "mc") {
      if (x.choice == null) return;
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.bad = []; msgs[it.id] = null; }
      else { if (r.msg.bad) x.tries++; msgs[it.id] = r.msg; }
    }
    api.save(); paint(it); MV.focusFb(el);
  });
  items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: build an exact value ----------
// @component N4 piBoxes (adapted from MHF4U 25) — angle boxes for the number in front of π ("5/4" or "5π/4" both work) with
// − / + steppers through the special angles; the preview is the N12 unit circle with arms a and b, θ = a − b in cerulean
// (between the arms and in standard position) and an exact readout of sin θ and cos θ (odd twelfths included).
var STEPS = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24];
var task = (function(){
  var api, plot, T, U;
  function parse(raw){ var s = String(raw == null ? "" : raw).trim(); if (!s) return null; var r = MV.parseNum(s); if (!r || r.length !== 1) return null; return /π|pi/i.test(s) ? r[0] / PI : r[0]; }
  function coefText(k){ if (!k) return "0"; var g = gcd(k, 12), n = k / g, d = 12 / g; return d === 1 ? String(n) : n + "/" + d; }
  function read(){
    var S = api ? api.S : {}, ca = parse(S.a), cb = parse(S.b), d = { ca:ca, cb:cb, valid:ca != null && cb != null };
    if (!d.valid) return d;
    d.ka = kOf(ca); d.kb = kOf(cb); d.aa = ca * PI; d.ab = cb * PI; d.th = d.aa - d.ab;
    d.kt = d.ka != null && d.kb != null ? d.ka - d.kb : kOf(ca - cb);
    d.I = d.kt != null ? UC.info(d.kt) : null;
    d.qa = quadA(d.aa); d.qb = quadA(d.ab);
    return d;
  }
  function checks(d){
    if (!d.valid) return [false, false, false, false, false];
    return [isSpecial(d.ka) && isSpecial(d.kb),
      d.th > 1e-9 && d.th < 2 * PI - 1e-9,
      !!d.I && d.I.sin.key === "p" && d.I.sin.s > 0,
      d.I ? d.I.cos.s < 0 : Math.cos(d.th) < -1e-9,
      [2, 3, 4].indexOf(d.qa) >= 0 && [2, 3, 4].indexOf(d.qb) >= 0 && d.qa !== d.qb];
  }
  function angHTML(c, k){ return k != null ? m(angS(k)) : "≈ " + num(c * PI, 3) + " (" + U.notSpecial + ")"; }
  function valHTML(d, fn){ return d.I ? "= " + m(d.I[fn].m) : "≈ " + num(Math[fn](d.th), 3); }
  function preview(){
    var d = read(), ink = css("--ink"), ink2 = css("--ink-2"), pt = css("--p-t"), arms = [];
    if (d.valid) arms = [{ a:d.ab, color:ink2, width:2.5, dash:[7, 5] }, { a:d.aa, color:ink, width:2.5 }, { a:d.th, color:pt, width:3 }];
    UC.scene(plot, { dots:UC.SPECIAL.map(function(k){ return { k:k }; }), arms:arms, P:d.valid ? { a:d.th, color:pt } : null,
      describe:d.valid ? "Unit circle. Arm a at " + MV.plain(angHTML(d.ca, d.ka)) + " (" + U.q[d.qa] + "), arm b at " + MV.plain(angHTML(d.cb, d.kb)) + " (" + U.q[d.qb] + "), and θ = a − b at " + MV.plain(angHTML(d.ca - d.cb, d.kt)) +
        " in standard position: sin θ " + MV.plain(valHTML(d, "sin")) + ", cos θ " + MV.plain(valHTML(d, "cos")) + "." : "Unit circle with the 16 special angles. Enter a and b to see their arms.",
      extra:function(ctx, p){
        if (!d.valid) return;
        UC.arc(ctx, p, d.ab, d.aa, 0.5, pt, 2.5); UC.arc(ctx, p, 0, d.th, 0.17, pt, 2);
        function tip(a, r, src, col){ UC.label(ctx, p, [{ src:src, color:col }], p.X(r * Math.cos(a)), p.Y(r * Math.sin(a)), { size:15, align:"center" }); }
        var mid = (d.aa + d.ab) / 2;
        tip(mid, 0.66, "θ", pt); tip(d.aa, 1.2, "a", ink); tip(d.ab, Math.abs(Math.sin((d.aa - d.ab) / 2)) < 0.12 ? 0.86 : 1.2, "b", ink); tip(d.th, 1.2, "θ", pt);
      } });
    var R = U.rows;
    $("#tk-read").innerHTML = d.valid ? MV.readoutHTML([[R.a, angHTML(d.ca, d.ka) + " (" + U.q[d.qa] + ")"], [R.b, angHTML(d.cb, d.kb) + " (" + U.q[d.qb] + ")"],
      [R.th, angHTML(d.ca - d.cb, d.kt)], [R.sin, valHTML(d, "sin")], [R.cos, valHTML(d, "cos")]]) : MV.readoutHTML([[R.a, "—"], [R.b, "—"]]);
  }
  function setBox(w, v){ api.S[w] = v; var el = $("#tk-" + w); if (el) el.value = v; api.save(); preview(); api.update(); }
  function stepBox(w, dir){
    var c = parse(api.S[w]), k = c == null ? null : c * 12, next;
    if (k == null) next = dir > 0 ? 0 : 24;
    else if (dir > 0) next = STEPS.filter(function(s){ return s > k + 1e-9; })[0];
    else next = STEPS.filter(function(s){ return s < k - 1e-9; }).pop();
    if (next != null) setBox(w, coefText(next));
  }
  function key(d){ return d.ka + "|" + d.kb; }
  function unkey(k){ var p = String(k).split("|"); return [+p[0], +p[1]]; }
  function text(k){ var p = unkey(k); return "a = " + angPlain(p[0]) + ", b = " + angPlain(p[1]); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; U = T.ui;
      inp.innerHTML = '<p class="tiny muted pt-how">' + U.how + '</p><div class="tk-in">' + ["a", "b"].map(function(w){
        return '<div class="tk-row"><label class="tk-name" for="tk-' + w + '">' + m(w + " =") + '</label><button type="button" class="btn ghost tk-pm" data-tk="' + w + '" data-dir="-1" aria-label="' + w + ": " + U.dec + '">' + MINUS + "</button>" +
          '<input class="numin short tk-box" id="tk-' + w + '" data-tkin="' + w + '" type="text" inputmode="text" autocomplete="off" value="' + MV.esc(a.S[w] || "") + '"><span class="tk-pi">' + m("π") + "</span>" +
          '<button type="button" class="btn ghost tk-pm" data-tk="' + w + '" data-dir="1" aria-label="' + w + ": " + U.inc + '">+</button></div>';
      }).join("") + "</div>";
      pv.innerHTML = '<h4 class="tk-h">' + U.preview + '</h4><div class="plot-wrap tk-pw"><canvas class="plot square" id="tk-plot" role="img" aria-label="Unit circle preview"></canvas></div><dl class="read" id="tk-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#tk-plot"), UC.VIEW, { equal:true }); plot.render = preview;
      REPAINT.push(function(){ plot.render(); });
      inp.addEventListener("input", function(e){ var w = e.target.dataset && e.target.dataset.tkin; if (!w) return; a.S[w] = e.target.value; a.save(); preview(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("button[data-tk]"); if (!b) return; stepBox(b.dataset.tk, +b.dataset.dir); });
      preview();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"), ts = MV.taskState();
        if (g && ts.found.length >= 4 && !g.querySelector(".tk-all")) g.insertAdjacentHTML("beforeend", '<p class="tk-all">' + T.all4 + "</p>");
      }, 0); });
    },
    read:read,
    valid:function(d){ return d.valid ? true : U.invalid; },
    checks:checks,
    tips:function(d, res){
      var out = [], now = T.tipNow;
      if (!res[0]) { var bd = []; if (!isSpecial(d.ka)) bd.push(m("a")); if (!isSpecial(d.kb)) bd.push(m("b")); out.push(fill(now[0], { who:bd.join(" and "), isnt:bd.length > 1 ? "aren’t" : "isn’t" })); }
      if (!res[1]) out.push(fill(now[1], { th:angHTML(d.ca - d.cb, d.kt) }));
      if (!res[2]) out.push(fill(now[2], { sin:valHTML(d, "sin") }) + " " + T.tips[2]);
      if (!res[3]) out.push(fill(now[3], { cos:valHTML(d, "cos") }));
      if (!res[4]) out.push(fill(now[4], { qa:U.q[d.qa], qb:U.q[d.qb] }) + " " + T.tips[4]);
      return out;
    },
    key:key,
    label:function(k){ var p = unkey(k); return m("a = " + angS(p[0])) + ", " + m("b = " + angS(p[1])); },
    text:text,
    summary:function(ts){ var T = MV.C.task; return [(T.summary || T.title) + ": " + (ts.found.length ? "solved (" + ts.found.map(text).join("; ") + ")" : "not solved yet")]; }
  };
})();

MV.module({
  hero:hero,
  connect:connect,
  activities:{ mx:mixed },
  task:task,
  onShow:function(v){
    if (v === "connect" && CN) CN.repaint();
    if (v === "mixed-practice" || v === "final-check") REPAINT.forEach(function(f){ try { f(); } catch (e) {} });
  }
});
})();
