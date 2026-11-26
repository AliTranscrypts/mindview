// MCV4U 26 The Derivative of y = bˣ: hero (tangents on y = 2ˣ and the constant slope ÷ height), Ratio meter (Explore: y = bˣ with
// its tangent, a slope ÷ height dial, a V5 slope trail, a ratio-vs-ln b plot, two bases and the "rewrite as e^(kx)" overlay with a
// V8 "□ ln □" box), Growth and decay rates (Part 3: three context stations with a time slider and an N13 algebra stepper), Rates
// by hand (Practice 2: typed exact answers with ln and e) and the "Safe dose" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function segBtns(name, opts, val, label, dis){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>";
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
// Shift + arrow on a range input moves it by ten steps (plan: "Shift for ×10")
function shiftKeys(inp, step, apply){
  inp.addEventListener("keydown", function(e){
    if (!e.shiftKey || !/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault(); if (inp.disabled) return;
    apply(+inp.value + (/Left|Down/.test(e.key) ? -10 : 10) * step);
  });
}

// =====================================================================================================================
// @component V8 lnExact — exact answers typed with numbers, fractions, ln and e (no variables): "9 ln 3", "−1/ln 3", "ln(1/4)",
// "−2 ln 2", "e", "e^−2", "5/2". Implicit products ("9ln3"), ^ for powers, ln binds to the next power ("ln 2/4" = (ln 2)/4).
//   lnParse(str) -> { v, dec (a decimal was typed), sym (ln or e was used) } or { err:"syntax" | "lnneg" }
//   specVal(spec) -> number; spec = number | ["ln", c, b] (c ln b) | ["rln", c, b] (c/ln b) | ["e", p] (e^p)
function lnParse(str){
  var s = String(str == null ? "" : str).toLowerCase().replace(/[−–—]/g, "-").replace(/[·×*]/g, "*").trim();
  var toks = [], i = 0, dec = false;
  while (i < s.length) {
    var c = s[i];
    if (c === " ") { i++; continue; }
    var mm = /^(\d+(?:\.\d*)?|\.\d+)/.exec(s.slice(i));
    if (mm) { toks.push({ t:"n", v:parseFloat(mm[1]) }); if (mm[1].indexOf(".") >= 0) dec = true; i += mm[1].length; continue; }
    if (s.substr(i, 2) === "ln") { toks.push({ t:"ln" }); i += 2; continue; }
    if (c === "e") { toks.push({ t:"e" }); i++; continue; }
    if ("+-*/^()".indexOf(c) >= 0) { toks.push({ t:c }); i++; continue; }
    return { err:"syntax" };
  }
  if (!toks.length) return { err:"syntax" };
  var p = 0, bad = null;
  function pk(){ return toks[p]; }
  function starts(k){ return k && (k.t === "n" || k.t === "e" || k.t === "ln" || k.t === "("); }
  function expr(){ var v = term(); while (pk() && (pk().t === "+" || pk().t === "-")) { var o = toks[p++].t, w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){
    var v = unary();
    for (;;) {
      var k = pk();
      if (k && (k.t === "*" || k.t === "/")) { p++; var w = unary(); v = k.t === "*" ? v * w : v / w; }
      else if (starts(k)) v = v * power();
      else break;
    }
    return v;
  }
  function unary(){ var k = pk(); if (k && k.t === "-") { p++; return -unary(); } if (k && k.t === "+") { p++; return unary(); } return power(); }
  function power(){ var b = atom(); if (pk() && pk().t === "^") { p++; return Math.pow(b, unary()); } return b; }
  function atom(){
    var k = toks[p++];
    if (!k) { bad = bad || "syntax"; return NaN; }
    if (k.t === "n") return k.v;
    if (k.t === "e") return Math.E;
    if (k.t === "(") { var v = expr(); if (!pk() || pk().t !== ")") { bad = bad || "syntax"; return NaN; } p++; return v; }
    if (k.t === "ln") { var a = power(); if (!(a > 0)) { bad = bad || (isFinite(a) ? "lnneg" : "syntax"); return NaN; } return Math.log(a); }
    bad = bad || "syntax"; return NaN;
  }
  var v = expr();
  if (p !== toks.length) bad = bad || "syntax";
  if (bad || !isFinite(v)) return { err:bad || "syntax" };
  return { v:v, dec:dec, sym:toks.some(function(k){ return k.t === "ln" || k.t === "e"; }) };
}
function specVal(sp){
  if (typeof sp === "number") return sp;
  if (!Array.isArray(sp)) return NaN;
  if (sp[0] === "ln") return sp[1] * Math.log(sp[2]);
  if (sp[0] === "rln") return sp[1] / Math.log(sp[2]);
  if (sp[0] === "e") return Math.exp(sp[1]);
  return NaN;
}
function specExact(sp){ return Array.isArray(sp); }

// ---------- bases: names, values, the measured slope ----------
var E = Math.E, HS = 1e-4;
function bName(b){ return near(b, 0.25) ? "1/4" : near(b, 0.5) ? "1/2" : near(b, E) ? "e" : num(b, 3); }
function bSrc(b){ var n = bName(b); return n.indexOf("/") >= 0 ? "(" + n + ")" : n; }
function lnSrc(b){ var n = bName(b); return n.indexOf("/") >= 0 ? "ln(" + n + ")" : "ln " + n; }
function fnSrc(b, col){ return "y = " + (col ? "@b{" + bSrc(b) + "}" : bSrc(b)) + "^x"; }
function lnHTML(b){ if (near(b, E)) return m("ln e = 1"); if (near(b, 1)) return m("ln 1 = 0"); return m(lnSrc(b)) + " ≈ " + num(Math.log(b), 3); }
function hgt(b, x){ return Math.pow(b, x); }
function slopeM(b, x){ return (Math.pow(b, x + HS) - Math.pow(b, x - HS)) / (2 * HS); }
function ratioM(b, x){ return slopeM(b, x) / hgt(b, x); }
function measured(v){ return Math.abs(v) < 5e-7 ? "0" : "≈ " + num(v, 3); }
function exact3(v){ return Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6; }
function ptHTML(b, x){ var h = hgt(b, x); return (exact3(h) ? "" : "≈ ") + m("(" + num(x, 1) + ", " + num(h, 3) + ")"); }
function behHTML(b){ return b > 1 + 1e-9 ? "Growing: " + m(lnSrc(b) + " > 0") : b < 1 - 1e-9 ? "Decaying: " + m(lnSrc(b) + " < 0") : "Constant: " + m("ln 1 = 0"); }
var TOPS = [2.5, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
function niceTop(v){ for (var i = 0; i < TOPS.length; i++) if (v <= TOPS[i]) return TOPS[i]; return TOPS[TOPS.length - 1]; }
function topFor(b, x){ return Math.max(hgt(b, x - 0.5), hgt(b, x + 0.5), 1.6 * hgt(b, x)) * 1.1; }

// =====================================================================================================================
// @component ratioDial — "the meter" (MCV4U 26): an SVG half-dial for a ratio from −2.5 (left) through 0 (up) to 2.5 (right);
// track --ink-2 at 40%, ticks every 0.5, labelled ticks at ±ln 2, ±1 and ln 3, one or two needles (colours per needle).
//   var d = ratioDial(host);  d.set([{ v, cls, name }])   (cls: bx-n1 --pen, bx-n2 --f3; default --ink; sets the aria-label too)
function ratioDial(host){
  var CX = 120, CY = 124, R = 94, MAXV = 2.5;
  function ang(v){ return Math.PI / 2 - clamp(v, -MAXV, MAXV) / MAXV * Math.PI / 2; }
  function pt(r, v){ var a = ang(v); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; }
  function f1(v){ return Math.round(v * 10) / 10; }
  var L2 = Math.LN2, L3 = Math.log(3);
  var h = '<svg class="bx-dial" viewBox="0 0 240 156" role="img" aria-label="The meter"><path class="bx-track" d="M' + (CX - R) + " " + CY + " A" + R + " " + R + " 0 0 1 " + (CX + R) + " " + CY + '"/>';
  for (var v = -2.5; v <= 2.501; v += 0.5) { var a = pt(R - 8, v), b = pt(R + 3, v); h += '<line class="bx-tk" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; }
  [[-L2, "−ln 2", 1], [L2, "ln 2", 1], [L3, "ln 3", 1], [-1, "−1", 0], [1, "1", 0], [0, "0", 1]].forEach(function(q){
    var a = pt(R - 13, q[0]), b = pt(R + 6, q[0]), l = pt(q[2] ? R + 17 : R - 25, q[0]);
    h += '<line class="bx-tkL" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/><text class="bx-tl" x="' + f1(l[0]) + '" y="' + f1(l[1]) + '">' + q[1] + "</text>";
  });
  h += '<text class="bx-end" x="' + (CX - R) + '" y="' + (CY + 15) + '">decay</text><text class="bx-end" x="' + (CX + R) + '" y="' + (CY + 15) + '">growth</text>';
  h += '<line class="bx-needle" data-n="0" x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - R + 16) + '"/><line class="bx-needle" data-n="1" x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - R + 16) + '" visibility="hidden"/><circle class="bx-hub" cx="' + CX + '" cy="' + CY + '" r="6"/></svg>';
  host.innerHTML = h;
  var svg = host.querySelector("svg"), nd = $$(".bx-needle", svg);
  return { set:function(list){
    nd.forEach(function(n, i){
      var q = list[i];
      if (!q || !isFinite(q.v)) { n.setAttribute("visibility", "hidden"); return; }
      n.removeAttribute("visibility");
      var tip = pt(R - 16 - i * 10, q.v);
      n.setAttribute("x2", f1(tip[0])); n.setAttribute("y2", f1(tip[1])); n.setAttribute("class", "bx-needle" + (q.cls ? " " + q.cls : ""));
    });
    svg.setAttribute("aria-label", "The meter: " + list.filter(function(q){ return q && isFinite(q.v); }).map(function(q){ return (q.name ? q.name + ", " : "") + "slope divided by height " + MV.plain(measured(q.v)); }).join("; ") + ".");
  } };
}

// ---------- hero: tangents on y = 2ˣ at x = 0, 1, 2; slope ÷ height chips merge into "0.69 ≈ ln 2" ----------
function hero(f){
  var c = f.canvas; if (!c) return;
  var V = { xmin:-2.6, xmax:3.1, ymin:-0.8, ymax:6.2 }, p = new MV.Plot(c, V);
  var F = function(x){ return Math.pow(2, x); }, D = function(x){ return Math.LN2 * Math.pow(2, x); };
  var st = { draw:V.xmin, x:null, dots:[], chips:0, merged:false };
  var eq = $(".hero .hero-eq");
  if (f.cap) f.cap.innerHTML = '<span class="bx-hchips"></span>';
  var chipsEl = f.cap ? $(".bx-hchips", f.cap) : null;
  function chips(){
    if (!chipsEl) return;
    if (st.merged) { chipsEl.innerHTML = '<span class="bx-hchip bx-hm">' + m("0.69 ≈ ln 2") + "</span>"; return; }
    var h = ""; for (var i = 0; i < st.chips; i++) h += '<span class="bx-hchip">slope ÷ height ≈ 0.69</span>';
    chipsEl.innerHTML = h;
  }
  function draw(){
    var ink = css("--ink"), sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ f:F, color:css("--pen"), width:3, domain:[V.xmin, st.draw] }], lines:[], points:[], labels:[] };
    st.dots.forEach(function(x){ sc.points.push({ x:x, y:F(x), r:4, color:css("--ink-2") }); });
    var d = "The graph of y = 2ˣ";
    if (st.x != null) {
      var x = st.x, y = F(x), s = D(x), txt = "slope ≈ " + num(s, 2) + ", height " + num(y, 2);
      sc.lines.push({ p:[x, y], q:[x + 1, y + s], color:ink, width:2 });
      sc.points.push({ x:x, y:y, r:5.5, color:ink });
      sc.labels.push({ x:x, y:y, text:txt, dx:-14, dy:-16, align:"right", bg:true, font:ui(13) });
      d += " with its tangent at (" + num(x, 2) + ", " + num(y, 2) + "): slope about " + num(s, 2) + ", height " + num(y, 2) + ".";
      if (st.merged) d += " At x = 0, 1 and 2, slope divided by height is about 0.69, which is ln 2.";
    } else d += ".";
    sc.describe = d;
    p.draw(sc);
  }
  p.render = draw;
  function finish(){ st.draw = V.xmax; st.x = 2; st.dots = [0, 1]; st.chips = 3; st.merged = true; chips(); draw(); if (eq) eq.style.opacity = ""; }
  if (MV.reduceMotion) { finish(); return; }
  if (eq) { eq.style.transition = "opacity .9s ease"; eq.style.opacity = "0"; }
  MV.wait(12000, function(){ if (eq) eq.style.opacity = ""; });       // safety: never leave the equation hidden
  draw(); chips();
  function lin(t){ return t; }
  function slide(a, b, cb){ MV.tween({ dur:1100, step:function(t){ st.x = a + (b - a) * t; draw(); }, done:function(){ st.x = b; draw(); cb(); } }); }
  function stop(cb){ MV.wait(650, function(){ st.chips++; chips(); MV.wait(850, cb); }); }
  MV.tween({ dur:1400, ease:lin, step:function(t){ st.draw = V.xmin + (V.xmax - V.xmin) * t; draw(); }, done:function(){
    st.x = 0; draw();
    stop(function(){
      st.dots = [0]; slide(0, 1, function(){
        stop(function(){
          st.dots = [0, 1]; slide(1, 2, function(){
            stop(function(){
              if (chipsEl) chipsEl.classList.add("bx-merging");
              MV.wait(550, function(){ if (chipsEl) chipsEl.classList.remove("bx-merging"); finish(); });
            });
          });
        });
      });
    });
  } });
}

// ---------- Explore: ratio meter ----------
var CHIPS = [{ id:"q", v:0.25, t:"1/4" }, { id:"h", v:0.5, t:"1/2" }, { id:"1", v:1, t:"1" }, { id:"2", v:2, t:"2" }, { id:"e", v:E, t:"`e`" },
  { id:"3", v:3, t:"3" }, { id:"4", v:4, t:"4" }, { id:"9", v:9, t:"9" }, { id:"10", v:10, t:"10" }];
var XCHIPS = [-1, 0, 1, 2], XV = { xmin:-3.4, xmax:3.4 };
function explore(host, api){
  var S = api.S, C = api.content, U = C.ui, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["one", "ratio", "two"].indexOf(S.mode) < 0) S.mode = "one";
  if (!(S.b >= 0.1 && S.b <= 10)) S.b = 2;
  if (!(S.b2 >= 0.1 && S.b2 <= 10)) S.b2 = 4;
  if (!(typeof S.x === "number" && S.x >= -3 && S.x <= 3)) S.x = 1;
  if (!(typeof S.k === "number" && S.k >= -3 && S.k <= 3)) S.k = 1;
  S.rw = !!S.rw; S.kc = S.kc || ""; S.ka = S.ka || ""; if (S.kSrc !== "exact") S.kSrc = "slider";
  if (!Array.isArray(S.seen)) S.seen = [];
  if (!S.tr || !Array.isArray(S.tr.keys)) S.tr = { b:S.b, keys:[Math.round(S.x * 10)] };
  var busy = false, pv = null, mark = null, anim = null;

  host.innerHTML = '<div class="bx-ex"><div class="bx-colL">' +
      '<div class="bx-main" data-mv="graph"><p class="eq-cap bx-eq" id="bx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
        '<div class="plot-wrap"><canvas class="plot bx-top" id="bx-top" role="img" aria-label="Graph"></canvas></div>' +
        '<div class="bx-low" id="bx-low"><p class="bx-pcap" id="bx-lcap"></p><div class="plot-wrap"><canvas class="plot bx-lowc" id="bx-lowc" role="img" aria-label="Lower panel"></canvas></div></div></div>' +
      '<div class="bx-ctrl" id="bx-ctrl"></div></div>' +
    '<div class="bx-colR"><div class="bx-meter"><p class="bx-mt">' + U.meter + '</p><div id="bx-dial"></div><p class="bx-mv" id="bx-mv"></p></div>' +
      '<div class="bx-read" id="bx-read" aria-live="polite"></div></div></div>';

  var ctrl = $("#bx-ctrl", host);
  function slider(id, label, min, max, step, col, aria){
    return '<label class="slider bx-sl"><span class="slider-top"><span>' + label + '</span><output id="bx-' + id + 'out" style="color:var(' + col + ')"></output></span>' +
      '<input type="range" id="bx-' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(aria) + '"></label>';
  }
  ctrl.innerHTML = '<div class="seg-wrap" id="bx-mode"></div><p class="tiny muted bx-how" id="bx-how"></p>' +
    '<div class="bx-grp">' + slider("b", '<span id="bx-blab">' + U.base + "</span>", 0.1, 10, 0.1, "--p-b", "Base b, from 0.1 to 10 (Shift + arrow moves by 1)") +
      '<div class="chips bx-chips" id="bx-bc" role="group" aria-label="Base chips"></div></div>' +
    '<div class="bx-grp" id="bx-b2w" hidden>' + slider("b2", U.base2 + ' <span class="bx-b2tag">' + m("b_2") + "</span>", 0.1, 10, 0.1, "--p-b", "Base b2, from 0.1 to 10 (Shift + arrow moves by 1)") +
      '<div class="chips bx-chips" id="bx-b2c" role="group" aria-label="Chips for the second base"></div></div>' +
    '<div class="bx-grp">' + slider("x", U.point, -3, 3, 0.1, "--ink", "Point x0, from −3 to 3 (Shift + arrow moves by 1)") +
      '<div class="chips bx-chips" id="bx-xc" role="group" aria-label="Point chips"></div></div>' +
    '<div class="bx-rw" id="bx-rww"><button type="button" class="chip" id="bx-rw" data-k="bxrw" aria-pressed="false">' + U.rewrite + '</button>' +
      '<div id="bx-rwin" hidden>' + slider("k", U.kLabel, -3, 3, 0.001, "--ink", "k, from −3 to 3 (Shift + arrow moves by 0.01)") +
        '<div class="bx-kx"><span class="bx-kl">' + U.exact + '</span><input class="numin short" id="bx-kc" data-k="bxkc" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Exact k: the number in front of ln (blank means 1)">' +
        '<span class="m bx-ln"><span class="fnm">ln</span></span><input class="numin short" id="bx-ka" data-k="bxka" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Exact k: the number inside ln"></div>' +
        '<p class="tiny muted bx-kh">' + U.exactHow + '</p><p class="tiny bx-km" id="bx-km" aria-live="polite"></p></div></div>';

  var top = new MV.Plot($("#bx-top", host), { xmin:-3.4, xmax:3.4, ymin:-1, ymax:5 });
  var low = new MV.Plot($("#bx-lowc", host), { xmin:-3.4, xmax:3.4, ymin:-1, ymax:5 });
  var dial = ratioDial($("#bx-dial", host));
  function two(){ return S.mode === "two"; }
  function rwOn(){ return S.mode === "one" && S.rw; }
  // ---- exact k ----
  function kExact(){
    var c = String(S.kc).trim(), a = String(S.ka).trim(), cv;
    if (!c && !a) return { empty:true };
    if (!c || c === "+") cv = 1; else if (/^[-−]$/.test(c)) cv = -1; else { var pc = lnParse(c); if (pc.err) return { err:true }; cv = pc.v; }
    if (!a) return { ok:true, v:cv, plain:true };
    var pa = lnParse(a); if (pa.err || !(pa.v > 0)) return { err:true };
    return { ok:true, v:cv * Math.log(pa.v) };
  }
  function kVal(){ if (S.kSrc === "exact") { var r = kExact(); if (r.ok) return r.v; } return S.k; }
  function kEcho(){
    var c = String(S.kc).trim().replace(/−/g, "-"), a = String(S.ka).trim().replace(/−/g, "-");
    var cs = !c || c === "+" ? "" : c === "-" ? "-" : c + " ";
    return m("k = " + (a ? cs + (a.indexOf("/") >= 0 && a.charAt(0) !== "(" ? "ln(" + a + ")" : "ln " + a) : c));
  }
  // ---- views ----
  function topView(){
    if (pv && pv.view) return { xmin:XV.xmin, xmax:XV.xmax, ymin:pv.view.ymin, ymax:pv.view.ymax };
    var t = topFor(S.b, S.x); if (two()) t = Math.max(t, topFor(S.b2, S.x));
    var T = niceTop(t); return { xmin:XV.xmin, xmax:XV.xmax, ymin:-0.12 * T, ymax:T };
  }
  function lowView(){
    var V = topView(), L = Math.log(S.b);
    if (Math.abs(L) < 1e-9) return { xmin:XV.xmin, xmax:XV.xmax, ymin:-1, ymax:1 };
    if (L > 0) return { xmin:XV.xmin, xmax:XV.xmax, ymin:V.ymin * L, ymax:V.ymax * L };
    return { xmin:XV.xmin, xmax:XV.xmax, ymin:V.ymax * L, ymax:-V.ymax * L * 0.12 };
  }
  // ---- state changes ----
  function addSeen(b){ b = Math.round(b * 1e4) / 1e4; if (!S.seen.some(function(q){ return near(q, b, 1e-6); })) { S.seen.push(b); if (S.seen.length > 120) S.seen.shift(); } }
  function setB(v, how){
    v = clamp(v, 0.1, 10); if (how !== "anim" && how !== "chip") v = r9(Math.round(v * 10) / 10);
    S.b = v;
    if (!near(S.tr.b, v, 1e-12)) S.tr = { b:v, keys:[Math.round(S.x * 10)] };
    if (how !== "anim") addSeen(v);
  }
  function setX(v, how){
    v = clamp(v, -3, 3); if (how !== "anim") v = r9(Math.round(v * 10) / 10);
    var a = Math.round(S.x * 10), b = Math.round(v * 10), lo = Math.min(a, b), hi = Math.max(a, b);
    S.x = v;
    for (var k = lo; k <= hi; k++) if (S.tr.keys.indexOf(k) < 0) S.tr.keys.push(k);
  }
  function after(how){
    if (how !== "anim") { mark = null; api.save(); }
    paintRead(); paintMeter(); paintEq(); syncCtrl(); draw();
    if (how !== "anim") MV.changed();
  }
  // ---- drawing ----
  function tangentBits(sc, b, x, col, lab, dy, V){
    var y = hgt(b, x), s = slopeM(b, x), ink = css("--ink"), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55, yc = clamp(y, V.ymin, V.ymax);
    sc.lines.push({ p:[x, y], q:[x + 1, y + s], color:ink, width:2 });
    if (y <= V.ymax) sc.points.push({ x:x, y:y, r:6, color:col, ring:lab === "main" });
    var t = (lab && lab !== "main" ? lab + ": " : "") + "slope " + (Math.abs(s) < 5e-7 ? "= 0" : "≈ " + num(s, 3));
    sc.labels.push({ x:x, y:yc, text:t, dx:right ? -14 : 14, dy:dy != null ? dy : (yc > V.ymax - (V.ymax - V.ymin) * 0.22 ? 24 : -22), align:right ? "right" : "left", bg:true, font:ui(13) });
  }
  function draw(){
    var V = topView(), b = S.b, x = S.x, pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ f:function(t){ return hgt(b, t); }, color:pen, width:3 }], lines:[], points:[], labels:[] };
    if (two()) sc.curves.push({ f:function(t){ return hgt(S.b2, t); }, color:f3, width:3 });
    var k = kVal();
    if (rwOn()) sc.curves.push({ f:function(t){ return Math.exp(k * t); }, color:ink, width:2.6, dash:[14, 8] });
    if (two()) {
      var up = hgt(b, x) >= hgt(S.b2, x);
      tangentBits(sc, S.b2, x, f3, "b₂", up ? 26 : -24, V);
      tangentBits(sc, b, x, pen, "b₁", up ? -24 : 26, V);
    } else tangentBits(sc, b, x, ink, "main", null, V);
    (mark || []).filter(function(q){ return q.p === "top"; }).forEach(function(q){ sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 0, dy:q.dy || -18, align:q.align || "center", bg:true, font:ui(13, 700) }); });
    var d = "Graph of " + MV.plain(m(fnSrc(b))) + ". Tangent at " + MV.plain(ptHTML(b, x)) + ", slope about " + num(slopeM(b, x), 2) + ". Slope divided by height about " + num(ratioM(b, x), 2) + ", equal to " + MV.plain(lnHTML(b)) + ".";
    if (two()) d += " Second graph " + MV.plain(m(fnSrc(S.b2))) + ": tangent slope about " + num(slopeM(S.b2, x), 2) + ".";
    if (rwOn()) d += " Dashed: y = e^(kx) with k about " + num(k, 3) + ".";
    sc.describe = d;
    sc.after = function(ctx, pl){ probeLine(ctx, pl, x); };
    top.draw(sc);
    drawLow();
  }
  function drawLow(){
    var lw = $("#bx-low", host); lw.hidden = two();
    if (two()) return;
    var f3 = css("--f3"), ink = css("--ink"), b = S.b, x = S.x;
    if (S.mode === "ratio") {
      var RV = { xmin:-0.6, xmax:10.4, ymin:-2.6, ymax:2.6 }, pts = S.seen.map(function(q){ return { x:q, y:ratioM(q, 0), r:4.2, color:ink }; });
      pts.push({ x:b, y:ratioM(b, x), r:6.5, color:ink, ring:true });
      var r = ratioM(b, x), right = b > 6.5;
      low.draw({ view:RV, xTicks:{ step:1 }, yTicks:{ step:1 }, xLabel:"b", yLabel:"slope ÷ height",
        curves:[{ f:function(t){ return t > 0 ? Math.log(t) : NaN; }, color:css("--ink-2"), width:2, dash:[6, 6], domain:[0.1, 10] }],
        points:pts, labels:[{ x:b, y:r, text:"(" + bName(b) + ", " + MV.plain(measured(r)).replace("≈ ", "") + ")", dx:right ? -12 : 12, dy:r > 1.6 ? 20 : -18, align:right ? "right" : "left", bg:true, font:ui(13) }],
        after:function(ctx, pl){ probeLine(ctx, pl, b); },
        describe:"Slope divided by height against the base b, from 0.1 to 10, with the dashed curve y = ln b. " + S.seen.length + " base" + (S.seen.length === 1 ? "" : "s") + " visited; every dot sits on the curve. Current base " + bName(b) + ": ratio about " + num(r, 3) + "." });
      return;
    }
    var LV = lowView(), keys = S.tr.keys.slice().sort(function(p, q){ return p - q; }), runs = [], cur = [];
    var fp = function(t){ return Math.log(b) * hgt(b, t); };
    keys.forEach(function(k){ if (cur.length && k !== cur[cur.length - 1] + 1) { runs.push(cur); cur = []; } cur.push(k); });
    if (cur.length) runs.push(cur);
    var sc = { view:LV, xLabel:"x", yLabel:"f′(x)", curves:[], points:[], labels:[] };
    runs.forEach(function(rn){
      if (rn.length > 1) sc.curves.push({ pts:rn.map(function(k){ return [k / 10, fp(k / 10)]; }), color:f3, width:2.6 });
      else sc.points.push({ x:rn[0] / 10, y:fp(rn[0] / 10), r:3.2, color:f3 });
    });
    sc.points.push({ x:x, y:slopeM(b, x), r:5.5, color:f3 });
    (mark || []).filter(function(q){ return q.p === "low"; }).forEach(function(q){ sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 0, dy:q.dy || -18, align:q.align || "center", bg:true, font:ui(13, 700) }); });
    sc.after = function(ctx, pl){ probeLine(ctx, pl, x); };
    sc.describe = "Slope graph for " + MV.plain(m(fnSrc(b))) + ": the slope at each point visited is traced in teal, from x = " + num(keys[0] / 10, 1) + " to " + num(keys[keys.length - 1] / 10, 1) + ". At x = " + num(x, 1) + " the slope is about " + num(slopeM(b, x), 3) + ".";
    low.draw(sc);
  }
  top.render = draw; low.render = drawLow;
  var drg = MV.drag(top, { axis:"x", step:{ x:0.1, y:0.1 }, big:10,
    handles:function(){ var V = top.v || topView(); return [{ id:"pt", x:S.x, y:clamp(hgt(S.b, S.x), V.ymin, V.ymax), label:"Point on the graph at x = " + num(S.x, 1) + ", slope about " + num(slopeM(S.b, S.x), 3) + ". Arrow keys move it by 0.1; Shift moves it by 1." }]; },
    move:function(id, nx){ if (busy) return; setX(nx, "drag"); after("drag"); } });
  void drg;
  // ---- readouts ----
  function block(b, title){
    var R = U.rows, x = S.x, rows = [[R.fn, m(fnSrc(b, true))], [R.pt, ptHTML(b, x)], [R.slope, measured(slopeM(b, x))], [R.ratio, measured(ratioM(b, x))], [m("ln b"), lnHTML(b)], [R.beh, behHTML(b)]];
    return (title ? '<p class="bx-rt">' + title + "</p>" : "") + '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
  }
  function paintRead(){
    var el = $("#bx-read", host), x = S.x, h;
    if (two()) {
      var s1 = slopeM(S.b, x), s2 = slopeM(S.b2, x), par = Math.round(s1 * 1000) === Math.round(s2 * 1000);
      h = '<div class="bx-two">' + '<div>' + block(S.b, '<span class="bx-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m("b_1 = " + bName(S.b))) + "</div>" +
        "<div>" + block(S.b2, '<span class="bx-sw" style="background:var(--f3)" aria-hidden="true"></span>' + m("b_2 = " + bName(S.b2))) + "</div></div>" +
        '<dl class="read bx-par">' + MV.readoutHTML([[U.rows.two, "Slopes: " + num(s1, 3) + " and " + num(s2, 3) + "; " + (par ? "<strong>Parallel ✓</strong>" : "parallel? no")]]) + "</dl>";
    } else {
      h = block(S.b, "");
      if (rwOn()) {
        var k = kVal(), on = Math.abs(k - Math.log(S.b)) < 5e-4, ex = S.kSrc === "exact" && kExact().ok;
        h += '<dl class="read bx-par">' + MV.readoutHTML([[U.rows.over, (ex ? kEcho() + " ≈ " + num(k, 3) : m("k") + " ≈ " + num(k, 3)) + "; " + (on ? "on top of " + m(fnSrc(S.b)) + " ✓" : "not on top of " + m(fnSrc(S.b)) + " yet")]]) + "</dl>";
      }
    }
    el.innerHTML = h;
  }
  function paintMeter(){
    var x = S.x;
    if (two()) {
      var r1 = ratioM(S.b, x), r2 = ratioM(S.b2, x);
      dial.set([{ v:r1, cls:"bx-n1", name:"b1 = " + bName(S.b) }, { v:r2, cls:"bx-n2", name:"b2 = " + bName(S.b2) }]);
      $("#bx-mv", host).innerHTML = '<span class="bx-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m("b_1") + ": " + measured(r1) + ' &nbsp; <span class="bx-sw" style="background:var(--f3)" aria-hidden="true"></span>' + m("b_2") + ": " + measured(r2);
    } else {
      var r = ratioM(S.b, x);
      dial.set([{ v:r }]);
      $("#bx-mv", host).innerHTML = "slope ÷ height " + measured(r);
    }
  }
  function paintEq(){
    var h = '<span class="bx-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m(fnSrc(S.b, true));
    if (two()) h += ' &nbsp; <span class="bx-sw" style="background:var(--f3)" aria-hidden="true"></span>' + m("y = @b{" + bSrc(S.b2) + "}^x");
    if (rwOn()) h += ' &nbsp; <span class="bx-sw bx-swd" aria-hidden="true"></span>' + m("y = e^{kx}");
    $("#bx-eq", host).innerHTML = h;
    $("#bx-lcap", host).innerHTML = S.mode === "ratio" ? U.lowRatio : '<span class="bx-sw" style="background:var(--f3)" aria-hidden="true"></span>' + U.lowOne;
  }
  function chipRow(el, list, val, key){
    MV.keepFocus(el, function(){
      el.innerHTML = list.map(function(c){ var on = near(val, c.v, 1e-9); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + key + '="' + c.id + '" data-k="' + key + c.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + MV.md(c.t) + "</button>"; }).join("");
    });
  }
  function syncCtrl(){
    MV.keepFocus($("#bx-mode", host), function(){ $("#bx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("md", U.modes, S.mode, "Mode", busy); });
    $("#bx-how", host).innerHTML = U.modeHow[S.mode];
    $("#bx-blab", host).innerHTML = two() ? U.base1 : U.base;
    $("#bx-b", host).value = S.b; $("#bx-bout", host).innerHTML = m(bName(S.b));
    $("#bx-b2w", host).hidden = !two();
    $("#bx-b2", host).value = S.b2; $("#bx-b2out", host).innerHTML = m(bName(S.b2));
    $("#bx-x", host).value = S.x; $("#bx-xout", host).textContent = num(S.x, 1);
    chipRow($("#bx-bc", host), CHIPS, S.b, "bc");
    chipRow($("#bx-b2c", host), CHIPS, S.b2, "bd");
    chipRow($("#bx-xc", host), XCHIPS.map(function(v){ return { id:String(v), v:v, t:num(v) }; }), S.x, "xc");
    $("#bx-rww", host).hidden = S.mode !== "one";
    var rb = $("#bx-rw", host); rb.setAttribute("aria-pressed", String(S.rw)); rb.classList.toggle("on", S.rw); rb.disabled = busy;
    $("#bx-rwin", host).hidden = !rwOn();
    var k = kVal(); $("#bx-k", host).value = clamp(Math.round(k * 1000) / 1000, -3, 3); $("#bx-kout", host).textContent = num(k, 3);
    var kc = $("#bx-kc", host), ka = $("#bx-ka", host);
    if (document.activeElement !== kc) kc.value = S.kc; if (document.activeElement !== ka) ka.value = S.ka;
    var r = kExact(), km = $("#bx-km", host);
    km.innerHTML = r.empty ? "" : r.err ? "Type a number in each box; the ln box needs a positive number." : kEcho() + " ≈ " + num(r.v, 3);
    km.classList.toggle("bx-kerr", !!r.err);
    $$("input", ctrl).forEach(function(i){ i.disabled = busy; });
  }
  function paintAll(){ paintEq(); syncCtrl(); paintRead(); paintMeter(); draw(); }
  // ---- events ----
  ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.md) { S.mode = b.dataset.md; if (S.mode !== "two") S.tr = { b:S.b, keys:[Math.round(S.x * 10)] }; after("set"); return; }
    if (b.dataset.bc) { setB(CHIPS.filter(function(c){ return c.id === b.dataset.bc; })[0].v, "chip"); after("chip"); return; }
    if (b.dataset.bd) { S.b2 = CHIPS.filter(function(c){ return c.id === b.dataset.bd; })[0].v; after("chip"); return; }
    if (b.dataset.xc != null) { setX(+b.dataset.xc, "chip"); after("chip"); return; }
    if (b.id === "bx-rw") { S.rw = !S.rw; after("set"); }
  });
  function onRange(id, fn){ var inp = $("#bx-" + id, host); inp.addEventListener("input", function(){ if (busy) { syncCtrl(); return; } fn(+inp.value); }); return inp; }
  shiftKeys(onRange("b", function(v){ setB(v, "slider"); after("slider"); }), 0.1, function(v){ if (!busy) { setB(v, "slider"); after("slider"); } });
  shiftKeys(onRange("b2", function(v){ S.b2 = clamp(r9(Math.round(v * 10) / 10), 0.1, 10); after("slider"); }), 0.1, function(v){ if (!busy) { S.b2 = clamp(r9(Math.round(v * 10) / 10), 0.1, 10); after("slider"); } });
  shiftKeys(onRange("x", function(v){ setX(v, "slider"); after("slider"); }), 0.1, function(v){ if (!busy) { setX(v, "slider"); after("slider"); } });
  function setK(v){ S.k = clamp(r9(Math.round(v * 1000) / 1000), -3, 3); S.kSrc = "slider"; S.kc = ""; S.ka = ""; $("#bx-kc", host).value = ""; $("#bx-ka", host).value = ""; after("slider"); }
  shiftKeys(onRange("k", setK), 0.001, function(v){ if (!busy) setK(v); });
  ctrl.addEventListener("input", function(e){
    var t = e.target; if (busy || (t.id !== "bx-kc" && t.id !== "bx-ka")) return;
    if (t.id === "bx-kc") S.kc = t.value; else S.ka = t.value;
    var r = kExact(); S.kSrc = r.ok ? "exact" : "slider";
    if (r.ok) S.k = clamp(Math.round(r.v * 1000) / 1000, -3, 3);
    after("type");
  });
  setB(S.b, "chip"); paintAll();

  // ---- predictions ----
  var START = { p1:{ b:2, x:0, view:{ ymin:-1.2, ymax:10 } }, p2:{ b:2, x:1, view:{ ymin:-1.2, ymax:10 } }, p3:{ b:2, x:1 }, p4:{ b:2, x:1 } };
  function tw(dur, step, cb){ anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ anim = null; cb(); } }); }
  function chal(id){
    var M = MS[id], x = S.x;
    if (id === "tc1") {
      if (S.mode !== "one") return { ok:false, msg:M.mode };
      if (!near(x, 0, 1e-9)) return { ok:false, msg:M.x };
      if (near(S.b, 9)) return { ok:true };
      if (near(S.b, 6)) return { ok:false, msg:M.b6 };
      if (near(S.b, 3)) return { ok:false, msg:M.b3 };
      if (near(S.b, 8)) return { ok:false, msg:M.b8 };
      return { ok:false, msg:tpl(M.other, { v:num(Math.log(S.b), 3) }) };
    }
    if (id === "tc2") {
      if (S.mode !== "one") return { ok:false, msg:M.mode };
      if (!S.rw) return { ok:false, msg:M.rw };
      if (!near(S.b, 0.25)) return { ok:false, msg:M.b };
      var L4 = Math.log(4), r = kExact();
      if (S.kSrc === "exact" && r.ok) {
        if (near(r.v, -L4, 1e-9)) return { ok:true };
        if (near(r.v, L4, 1e-9)) return { ok:false, msg:M.ln4 };
        if (near(Math.abs(r.v), 0.25, 1e-9)) return { ok:false, msg:M.quarter };
        return { ok:false, msg:tpl(M.other, { v:num(r.v, 3) }) };
      }
      var k = S.k;
      if (near(k, L4, 6e-4)) return { ok:false, msg:M.ln4 };
      if (near(Math.abs(k), 0.25, 1e-9)) return { ok:false, msg:M.quarter };
      if (near(k, -L4, 6e-4)) return { ok:false, msg:M.slider };
      return { ok:false, msg:tpl(M.other, { v:num(k, 3) }) };
    }
    if (id === "tc3") {
      if (!two() || !near(S.b, 2) || !near(S.b2, 4)) return { ok:false, msg:M.set };
      if (near(x, -1)) return { ok:true };
      if (near(x, 0)) return { ok:false, msg:M.x0 };
      if (near(x, 1)) return { ok:false, msg:M.x1 };
      return { ok:false, msg:tpl(M.other, { s1:num(slopeM(2, x), 3), s2:num(slopeM(4, x), 3) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        busy = true; mark = null;
        var s = START[p.id] || START.p1;
        S.mode = "one"; S.rw = false; pv = { view:s.view || null };
        setB(s.b, "chip"); S.x = s.x; S.tr = { b:S.b, keys:[Math.round(s.x * 10)] };
        api.save(); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; pv = null; api.save(); paintAll(); MV.changed(); done(); }
        function show(pts, ms){ mark = pts; draw(); MV.wait(ms || 1200, fin); }
        if (p.id === "p1") tw(2600, function(t){ setX(3 * t, "anim"); after("anim"); }, function(){
          setX(3, "set"); after("anim");
          show([{ p:"top", x:3, y:8, text:"height 8: slope ≈ 8 × 0.693", dx:-12, dy:22, align:"right" }, { p:"low", x:3, y:8 * Math.LN2, text:"slope ≈ 5.55", dx:-12, dy:18, align:"right" }]);
        });
        else if (p.id === "p2") tw(2200, function(t){ setB(2 + 2 * t, "anim"); after("anim"); }, function(){ setB(4, "chip"); after("anim"); show([{ p:"top", x:1, y:4, text:"ratio 0.693 → 1.386", dx:-12, dy:-26, align:"right" }]); });
        else if (p.id === "p3") tw(2600, function(t){ setB(2 - 1.5 * t, "anim"); after("anim"); }, function(){ setB(0.5, "chip"); after("anim"); show([{ p:"top", x:1, y:0.5, text:"every slope negative: decay", dx:12, dy:-24, align:"left" }]); });
        else if (p.id === "p4") tw(2000, function(t){ setB(2 - t, "anim"); after("anim"); }, function(){ setB(1, "chip"); after("anim"); show([{ p:"top", x:1, y:1, text:"flat: slope 0 everywhere", dx:12, dy:-24, align:"left" }]); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Growth and decay rates (N13 station stepper: three context stations, each with an algebra step-through) ----------
var LN2 = Math.LN2;
var ST = {
  s1:{ f:function(t){ return 300 * Math.pow(2, t / 4); }, d:function(t){ return 300 * Math.pow(2, t / 4) * LN2 / 4; }, lo:0, hi:16, t0:0, every:4,
    view:{ xmin:-2.6, xmax:16.8, ymin:-450, ymax:5400 }, yStep:1000, name:"N", noun:"bacteria", rate:"bacteria/h", dp:0, bar:0.25 },
  s2:{ f:function(t){ return 80 * Math.pow(0.5, t / 6); }, d:function(t){ return -80 * Math.pow(0.5, t / 6) * LN2 / 6; }, lo:0, hi:24, t0:0, every:6,
    view:{ xmin:-2.4, xmax:25.2, ymin:-7, ymax:90 }, yStep:20, name:"A", noun:"mg", rate:"mg/h", dp:2, bar:0.25 },
  s3:{ f:function(t){ return 200 * Math.pow(2, t / 5); }, d:function(t){ return 40 * LN2 * Math.pow(2, t / 5); }, lo:0, hi:20, t0:5, every:5,
    view:{ xmin:-2.6, xmax:21, ymin:-280, ymax:3600 }, yStep:500, dview:{ xmin:-2.6, xmax:21, ymin:-40, ymax:480 }, name:"N", noun:"bacteria", rate:"bacteria/h", dp:0, target:320 * LN2 }
};
function rateExact(id, t){
  var K = ST[id]; if (Math.abs(t / K.every - Math.round(t / K.every)) > 1e-9) return null;
  var n = Math.round(t / K.every);
  if (id === "s1") { var q1 = Q.of(300 * Math.pow(2, n), 4); return Q.src(q1) + " ln 2"; }
  if (id === "s2") { var q2 = Q.of(80, 6 * Math.pow(2, n)); return q2.d === 1 ? "-" + q2.n + " ln 2" : "-(" + q2.n + "/" + q2.d + ") ln 2"; }
  return (40 * Math.pow(2, n)) + " ln 2";
}
function part3(host, api){
  var S = api.S, C = api.content, SL = C.stations;
  if (!ST[S.st]) S.st = "s1";
  S.t = S.t || {};
  host.innerHTML = '<div class="chips bx-stc" id="bx-stc" role="group" aria-label="Choose a station"></div>' + SL.map(function(st){
    var K = ST[st.id];
    return '<div class="bx-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + '</p><div class="sym bx-stg"><div class="bx-stl">' +
      '<div class="plot-wrap"><canvas class="plot bx-stp" role="img" aria-label="Graph of ' + K.name + '(t)"></canvas></div>' +
      (K.dview ? '<p class="bx-pcap"><span class="bx-sw" style="background:var(--f3)" aria-hidden="true"></span>' + m("N′(t)") + ", with the target line</p>" +
        '<div class="plot-wrap"><canvas class="plot bx-stp2" role="img" aria-label="Graph of N′(t)"></canvas></div>' : "") +
      '<label class="slider bx-sl"><span class="slider-top"><span>Time ' + m("t") + '</span><output class="bx-tout" style="color:var(--ink)"></output></span>' +
      '<input type="range" class="bx-t" min="' + K.lo + '" max="' + K.hi + '" step="0.1" style="accent-color:var(--ink)" aria-label="Time t in hours, from ' + K.lo + " to " + K.hi + ' (Shift + arrow moves by 1 hour)"></label></div>' +
      '<div class="bx-str"><dl class="read bx-sread" aria-live="polite"></dl>' + (st.bar ? '<div class="bx-bar"><p class="bx-barl"></p><div class="bx-bart" aria-hidden="true"><span></span></div><p class="tiny muted">' + st.bar + "</p></div>" : "") +
      '<details class="alg bx-alg"><summary>Check it with algebra</summary><ol class="bx-steps" aria-live="polite"></ol><div class="bx-pl"></div>' + (st.use ? MV.usesHTML(st.use) : "") + "</details></div></div>" +
      (st.id !== "s3" ? '<div class="q-actions"><button type="button" class="btn ghost sm" data-next="' + st.id + '" data-k="bxnx' + st.id + '">Next station</button></div>' : "") + "</div>";
  }).join("");
  var P = {};
  SL.forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host), K = ST[st.id];
    if (!(typeof S.t[st.id] === "number" && S.t[st.id] >= K.lo && S.t[st.id] <= K.hi)) S.t[st.id] = K.t0;
    P[st.id] = { p:new MV.Plot($(".bx-stp", box), K.view), p2:K.dview ? new MV.Plot($(".bx-stp2", box), K.dview) : null };
    P[st.id].p.render = function(){ drawSt(st.id); };
    if (P[st.id].p2) P[st.id].p2.render = function(){ drawSt(st.id); };
    MV.player($(".bx-pl", box), { count:st.alg.length, interval:1500, label:function(i){ return "Step " + (i + 1) + " of " + st.alg.length; },
      render:function(i){ $(".bx-steps", box).innerHTML = st.alg.map(function(l, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '">' + l + "</li>" : ""; }).join(""); } });
    var inp = $(".bx-t", box);
    inp.addEventListener("input", function(){ setT(st.id, +inp.value); });
    shiftKeys(inp, 0.1, function(v){ setT(st.id, v); });
  });
  function setT(id, v){ var K = ST[id]; S.t[id] = clamp(r9(Math.round(v * 10) / 10), K.lo, K.hi); api.save(); paintSt(id); }
  function rateTxt(K, v){ return (v < 0 ? MINUS : "") + num(Math.abs(v), K.dp) + " " + K.rate; }
  function drawSt(id){
    var K = ST[id], t = S.t[id], y = K.f(t), d = K.d(t), V = K.view, ink = css("--ink"), right = t > (V.xmin + V.xmax) / 2;
    P[id].p.draw({ view:V, xLabel:"t (h)", yLabel:K.name, yTicks:{ step:K.yStep }, xTicks:{ step:id === "s2" ? 6 : id === "s1" ? 4 : 5 },
      curves:[{ f:K.f, color:css("--pen"), width:3, domain:[K.lo, K.hi] }], lines:[{ p:[t, y], q:[t + 1, y + d], color:ink, width:2 }],
      points:[{ x:t, y:y, r:6, color:ink }], labels:[{ x:t, y:y, text:"rate ≈ " + rateTxt(K, d), dx:right ? -14 : 14, dy:-20, align:right ? "right" : "left", bg:true, font:ui(13) }],
      describe:"Graph of " + K.name + "(t) for t from " + K.lo + " to " + K.hi + " hours, with the tangent at t = " + num(t, 1) + ": " + K.name + " about " + num(y, K.dp ? 2 : 0) + " " + K.noun + ", rate about " + rateTxt(K, d) + "." });
    if (P[id].p2) {
      var DV = K.dview, hit = near(t, 15, 1e-9), f3 = css("--f3");
      P[id].p2.draw({ view:DV, xLabel:"t (h)", yLabel:"N′", yTicks:{ step:100 }, xTicks:{ step:5 },
        curves:[{ f:K.d, color:f3, width:2.6, domain:[K.lo, K.hi] }], segments:[{ x1:DV.xmin, y1:K.target, x2:DV.xmax, y2:K.target, color:ink, width:1.8, dash:[8, 6] }],
        points:[{ x:t, y:d, r:hit ? 8 : 5.5, color:f3, ring:hit }], labels:[{ x:0.2, y:K.target, text:"target 320 ln 2", dy:-12, align:"left", bg:true, font:ui(12) }],
        after:function(ctx, pl){ probeLine(ctx, pl, t); },
        describe:"Graph of N′(t) = 40 ln 2 · 2^(t/5) with a dashed target line at 320 ln 2, about 221.8. At t = " + num(t, 1) + " the rate is about " + num(d, 1) + (hit ? ": exactly on the target." : ".") });
    }
  }
  function paintSt(id){
    var K = ST[id], t = S.t[id], box = $('[data-st="' + id + '"]', host), y = K.f(t), d = K.d(t), ex = rateExact(id, t), nm = K.name;
    $(".bx-t", box).value = t; $(".bx-tout", box).textContent = num(t, 1) + " h";
    var yEx = Math.abs(y - Math.round(y)) < 1e-9, rows = [];
    rows.push([m(nm + "(t)"), (yEx ? "" : "≈ ") + num(y, yEx ? 0 : (K.dp ? 2 : 1)) + " " + K.noun]);
    rows.push(["Rate " + m(nm + "′(t)"), (ex ? m(ex) + " " : "") + "≈ " + rateTxt(K, d)]);
    rows.push([m(nm + "′(t) ÷ " + nm + "(t)"), "≈ " + num(d / y, 3)]);
    if (id === "s1") rows.push(["The population is…", "growing by about " + num(d, 0) + " bacteria per hour"]);
    if (id === "s2") rows.push(["The amount is…", "decreasing by about " + num(-d, 2) + " mg per hour"]);
    if (id === "s3") { var on = near(t, 15, 1e-9), diff = d - K.target; rows.push([C.stations[2].target, on ? "<strong>On target ✓</strong> " + m("N′(15) = 320 ln 2") : (diff < 0 ? "below the target" : "above the target") + " (" + num(d, 1) + ")"]); }
    $(".bx-sread", box).innerHTML = MV.readoutHTML(rows);
    var bl = $(".bx-barl", box);
    if (bl) { var r = d / y; bl.innerHTML = m(nm + "′/" + nm) + " ≈ " + num(r, 3); $(".bx-bart span", box).style.width = clamp(Math.abs(r) / K.bar * 100, 0, 100) + "%"; }
    drawSt(id);
  }
  function show(){
    MV.keepFocus($("#bx-stc", host), function(){
      $("#bx-stc", host).innerHTML = SL.map(function(st){ var on = st.id === S.st; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-stc="' + st.id + '" data-k="stc' + st.id + '" aria-pressed="' + on + '">' + st.chip + "</button>"; }).join("");
    });
    SL.forEach(function(st){ $('[data-st="' + st.id + '"]', host).hidden = st.id !== S.st; });
    paintSt(S.st);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.stc) { S.st = b.dataset.stc; api.save(); show(); return; }
    if (b.dataset.next) { var i = SL.map(function(s){ return s.id; }).indexOf(b.dataset.next); S.st = SL[i + 1].id; api.save(); show(); var c = $('[data-stc="' + S.st + '"]', host); if (c) c.focus(); }
  });
  show();
  return {};
}

// ---------- Practice 2: Rates by hand (V8 lnExact boxes: one typed exact answer per item, named wrong values, first-try scoring) ----------
function ratesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q bx-rq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="bx-rin"></div><div class="bx-rcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .bx-rin', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<label class="bx-rbox"><span>' + it.label + '</span><input class="numin bx-rinp" data-bx="v" data-k="' + it.id + 'v" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(it.label).replace(/\s*=\s*$/, "") || "Answer") + '" value="' + MV.esc(x.v || "") + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</label>";
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .bx-rcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), raw = String(x.v || "").trim();
    if (!raw) return { err:TX.empty };
    var p = lnParse(raw);
    if (p.err) return { err:p.err === "lnneg" ? TX.lnneg : TX.err };
    var sp = MV.ans(it), A = specVal(sp), tol = 1e-9 * Math.max(1, Math.abs(A)), W = it.wrong || [], i;
    var exactNeeded = specExact(sp);
    if (near(p.v, A, tol) && (!exactNeeded || p.sym)) return { ok:true };
    for (i = 0; i < W.length; i++) if (near(p.v, specVal(W[i].v), 1e-9 * Math.max(1, Math.abs(specVal(W[i].v))))) return { ok:false, msg:W[i].fb };
    if (exactNeeded && !p.sym && near(p.v, A, 0.01 * Math.max(1, Math.abs(A)))) return { ok:false, msg:TX.approx, soft:true };
    return { ok:false, msg:it.wrongDefault || "Use " + '<span class="m">d/d<i>x</i></span> ' + m("b^x = b^x ln b") + ", with the chain rule where the exponent isn’t just " + m("x") + "." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { if (!r.soft) x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Safe dose ----------
var task = (function(){
  var api, plot, HL = [2, 3, 4, 6, 12, 24];
  function read(){ var s = api ? api.S : {}, A0 = +s.A0, h = +s.h; return { A0:A0, h:h, valid:A0 >= 10 && A0 <= 300 && HL.indexOf(h) >= 0 }; }
  function amt(d, t){ return d.A0 * Math.pow(0.5, t / d.h); }
  function rate0(d){ return Q.of(d.A0, d.h); }                         // A′(0) = −(A₀/h) ln 2
  function r0src(d){ var q = rate0(d); return q.d === 1 ? "-" + q.n + " ln 2" : "-({" + q.n + "}/{" + q.d + "}) ln 2"; }
  function draw(){
    var d = read(), V0 = { xmin:-1.2, xmax:28.5, ymin:-10, ymax:110 };
    if (!plot) return;
    if (!d.valid) { plot.draw({ view:V0, xLabel:"t (h)", yLabel:"A", describe:"Choose a starting dose and a half-life to draw the model." }); return; }
    var T = Math.max(60, Math.ceil(d.A0 * 1.15 / 20) * 20), V = { xmin:-1.6, xmax:28.5, ymin:-T * 0.09, ymax:T }, ink = css("--ink"), ink2 = css("--ink-2");
    var s0 = -d.A0 * LN2 / d.h, a12 = amt(d, 12), a24 = amt(d, 24);
    plot.draw({ view:V, xLabel:"t (h)", yLabel:"A", xTicks:{ step:6 }, yTicks:{ step:T > 200 ? 50 : 20 },
      curves:[{ f:function(t){ return amt(d, t); }, color:css("--pen"), width:3, domain:[0, 24] }],
      segments:[{ x1:V.xmin, y1:5, x2:V.xmax, y2:5, color:ink2, width:1.4, dash:[6, 6] }, { x1:V.xmin, y1:50, x2:V.xmax, y2:50, color:ink2, width:1.4, dash:[6, 6] },
        { x1:0, y1:d.A0, x2:Math.min(24, d.A0 / -s0), y2:d.A0 + s0 * Math.min(24, d.A0 / -s0), color:ink, width:2 }],
      points:[{ x:0, y:d.A0, r:5.5, color:ink }, { x:12, y:a12, r:5.5, color:ink }, { x:24, y:a24, r:5.5, color:ink }],
      labels:[{ x:24.9, y:50, text:"50 mg", dy:-9, align:"left", font:ui(12), color:ink2 }, { x:24.9, y:5, text:"5 mg", dy:-9, align:"left", font:ui(12), color:ink2 },
        { x:12, y:a12, text:num(a12, 3) + " mg", dx:10, dy:-14, align:"left", bg:true, font:ui(12) }, { x:24, y:a24, text:num(a24, 3) + " mg", dx:-10, dy:-14, align:"right", bg:true, font:ui(12) }],
      describe:"Graph of A(t) = " + d.A0 + "(1/2)^(t/" + d.h + ") for 0 to 24 hours, with the tangent at t = 0 (slope " + MV.plain(m(r0src(d))) + " mg/h), " + num(a12, 3) + " mg at 12 h and " + num(a24, 3) + " mg at 24 h. Dashed lines mark 5 mg and 50 mg." });
  }
  function readout(){
    var d = read(), el = $("#bx-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Choose a starting dose and a half-life.</dd></div>'; return; }
    el.innerHTML = MV.readoutHTML([["Model", m("A(t) = " + d.A0 + "(1/2)^{t/" + d.h + "}")], ["Rate at the start", m("A′(0) = " + r0src(d)) + " mg/h"],
      ["After 12 h", m("A(12)") + " = " + num(amt(d, 12), 3) + " mg"], ["After 24 h", m("A(24)") + " = " + num(amt(d, 24), 3) + " mg"]]);
  }
  function paintIn(inp){
    var S = api.S;
    $("#bx-a0", inp).value = S.A0; $("#bx-a0out", inp).textContent = num(+S.A0) + " mg";
    MV.keepFocus($("#bx-hc", inp), function(){
      $("#bx-hc", inp).innerHTML = HL.map(function(v){ var on = +S.h === v; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-hl="' + v + '" data-k="hl' + v + '" aria-pressed="' + on + '">' + v + " h</button>"; }).join("");
    });
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.A0 == null) { a.S.A0 = 100; a.S.h = 3; }
      inp.innerHTML = '<label class="slider bx-sl"><span class="slider-top"><span>Starting dose ' + m("A_0") + '</span><output id="bx-a0out" style="color:var(--ink)"></output></span>' +
        '<input type="range" id="bx-a0" min="10" max="300" step="10" style="accent-color:var(--ink)" aria-label="Starting dose A0 in mg, from 10 to 300"></label>' +
        '<p class="bx-hl">Half-life ' + m("h") + '</p><div class="chips" id="bx-hc" role="group" aria-label="Half-life in hours"></div>';
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot bx-tp" role="img" aria-label="Graph of your model"></canvas></div><dl class="read" id="bx-tread" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("canvas", pv), { xmin:-1.6, xmax:28.5, ymin:-10, ymax:110 }); plot.render = draw;
      $("#bx-a0", inp).addEventListener("input", function(e){ a.S.A0 = +e.target.value; a.save(); paintIn(inp); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-hl]"); if (!b) return; a.S.h = +b.dataset.hl; a.save(); paintIn(inp); draw(); readout(); a.update(); });
      paintIn(inp); draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose a starting dose and a half-life."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      return [d.A0 <= 150, d.A0 === 10 * d.h, amt(d, 12) >= 5 - 1e-9, amt(d, 24) < 50 - 1e-9];
    },
    key:function(d){ return d.A0 + "|" + d.h; },
    label:function(k){ var p = k.split("|"); return m("A_0 = " + p[0]) + " mg, " + m("h = " + p[1]) + " h"; },
    text:function(k){ var p = k.split("|"); return "A₀ = " + p[0] + " mg, h = " + p[1] + " h"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ rates:ratesAct },
  task:task
});
})();
