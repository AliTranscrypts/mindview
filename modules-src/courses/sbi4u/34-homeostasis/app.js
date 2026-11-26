// SBI4U 34 Homeostasis: hero (blood pressure dips on standing, the five loop boxes light, the line returns to the band),
// Feedback loop builder (S8: card tray → five slots, return-arrow sign, blood-pressure run with strength / delay / broken
// links on a Plot time graph; childbirth positive-feedback mode with an end event), "Two systems" (nerve vs hormone race,
// S1 hypothalamus–pituitary explorer with two traced paths, data rows), practice (two-round loop sorter, "What happens
// next?", Spot the Error), "Steady breathing" task (S8 loop design with a live CO₂ graph).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 20 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function frac(v){ return v - Math.floor(v); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ho-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function fmt(v){ return MV.num(Math.round(v * 100) / 100, 2); }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function pathD(pts){ return pts.map(function(p, i){ return (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "); }

// ---------- @component radioGroup (copied from SBI4U 20 / 14 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
// ---------- @component switchBtn (from SBI4U 09 / HFA4U 09) — role="switch" button with a visible On/Off word ----------
function switchHTML(id, label, on, dis){
  return '<button type="button" role="switch" class="ho-sw" aria-checked="' + !!on + '" data-sw="' + id + '" data-k="hosw' + id + '"' + (dis ? " disabled" : "") + '><span class="ho-swt" aria-hidden="true"></span><span class="ho-swl">' + label + '</span><span class="ho-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- model (plan: "The model", deterministic; tests use exact values) ----------
// P(t + 1) = P(t) − s·g·[P(t − d) − set], P(t) = set before t = 0. s = 1 for a − arrow, −1 for +. A loop with a wrong part
// or a broken link has g = 0. "Back in range and staying": the first t after which the value stays in the range; the
// series is run to 60 s to tell "stays" from "comes back for a moment", and only answers of 20 s or less count.
var GAIN = { weak:0.25, medium:0.5, strong:1 }, GNAME = { weak:"Weak", medium:"Medium", strong:"Strong" };
function series(set, start, g, d, sign, N){
  var P = [start], i;
  for (i = 0; i < N; i++) { var old = i - d < 0 ? set : P[i - d]; P.push(P[i] - sign * g * (old - set)); }
  return P;
}
function backAt(P, lo, hi){
  var T = null;
  for (var i = P.length - 1; i >= 0; i--) { if (P[i] >= lo - 1e-9 && P[i] <= hi + 1e-9) T = i; else break; }
  return T != null && T <= 20 ? T : null;
}

// ---------- @component S8 feedbackLoop — loop builder + simulator (course plan S8; modules 35–39 and 42 can copy it).
// The five slots, card tray, sign toggle, run controls, the time graph (Plot) and readouts live in explore(). ----------
var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S, SL = C.slots, CARDS = C.cards;
  var D = { scn:"bp", slots:{}, sign:"-", str:"medium", del:0, brkR:false, brkE:false, dist:false, t:0, bt:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k] && typeof D[k] === "object" ? {} : D[k]; });
  S.t = clamp(Math.round(+S.t || 0), 0, 20); S.bt = clamp(Math.round(+S.bt || 0), 0, 8); S.del = clamp(+S.del || 0, 0, 2);
  var sel = null, msg = null, busy = false, anim = null, playing = false, Td = S.t, Tb = S.bt, lit = null, cap = "", pend = null, warnSig = "";
  var tray = MV.shuffle(CARDS.map(function(c){ return c.id; }), "ho34tray");
  function cardOf(id){ return byId(CARDS, id); }
  function correctCard(sid){ for (var i = 0; i < CARDS.length; i++) if (MV.ans(CARDS[i]) === sid) return CARDS[i].id; return null; }

  host.innerHTML = '<div class="ho-ex">' +
    '<div class="ho-top"><div id="ho-scn"></div></div>' +
    '<div class="ho-build"><p class="how ho-how" id="ho-how">' + C.buildHow + '</p>' +
      '<div class="ho-tray" id="ho-tray" role="group" aria-label="Cards to place"></div>' +
      '<div class="ho-loop" id="ho-loop"><div class="ho-row" id="ho-row"></div>' +
        '<div class="ho-ret"><span class="ho-retl"><span class="ho-reta" aria-hidden="true"></span>Return arrow: the response feeds back on the stimulus</span><div id="ho-sign"></div></div></div>' +
      '<div class="ho-msg" id="ho-msg" aria-live="polite"></div></div>' +
    '<div class="pg ho-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<p class="ho-warn" id="ho-warn" role="status" hidden></p>' +
      '<div class="plot-wrap"><canvas class="plot wide" id="ho-plot" role="img"></canvas></div>' +
      '<p class="tiny muted ho-note" id="ho-note"></p><p class="ho-cap" id="ho-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="ho-panel" id="ho-run"><h4 class="ho-ph">Run mode</h4><p class="ho-lock" id="ho-lock">Fill all five slots to unlock Run mode.</p>' +
      '<div id="ho-bpc"><button type="button" class="btn primary" data-act="stand" data-k="hostand">Stand up quickly</button>' +
        '<div id="ho-str"></div><div id="ho-del"></div><div class="ho-brk" id="ho-brk" role="group" aria-label="Break a link"></div></div>' +
      '<div class="ho-player" role="group" aria-label="Time controls"><button type="button" class="btn ghost sm" data-pa="play" data-k="hoplay">Play</button><button type="button" class="btn ghost sm" data-pa="step" data-k="hostep">Step 1 s</button><button type="button" class="btn ghost sm" data-pa="reset" data-k="horeset">Reset</button></div>' +
      '<p class="ho-time" id="ho-time" aria-live="polite"></p></div></div>' +
    '<div class="pg-read"><dl class="read ho-read" id="ho-read" aria-live="polite"></dl><div class="ho-heartw" id="ho-heartw"></div></div></div></div>';

  var plot = new MV.Plot($("#ho-plot", host), { xmin:-2.6, xmax:20.6, ymin:30, ymax:150 });
  var scnR = radios($("#ho-scn", host), { label:"Scenario", key:"s", options:[{ id:"bp", t:"Blood pressure", aria:"Blood pressure (negative feedback)" }, { id:"birth", t:"Childbirth", aria:"Childbirth (positive feedback)" }], value:S.scn, onChange:function(v){ setting({ scn:v }); } });
  var signR = radios($("#ho-sign", host), { label:"Sign", key:"g", options:[{ id:"-", t:"− opposes", aria:"Minus: opposes the change" }, { id:"+", t:"+ amplifies", aria:"Plus: amplifies the change" }], value:S.sign, onChange:function(v){ setting({ sign:v }); } });
  var strR = radios($("#ho-str", host), { label:"Response strength", key:"r", options:[{ id:"weak", t:"Weak" }, { id:"medium", t:"Medium" }, { id:"strong", t:"Strong" }], value:S.str, onChange:function(v){ setting({ str:v }); } });
  var delR = radios($("#ho-del", host), { label:"Sensor delay", key:"d", options:[{ id:0, t:"0 s" }, { id:1, t:"1 s" }, { id:2, t:"2 s" }], value:S.del, onChange:function(v){ setting({ del:+v }); } });

  // ---- model views ----
  function filled(){ return SL.every(function(s){ return !!S.slots[s.id]; }); }
  function nCorrect(){ return SL.filter(function(s){ var c = cardOf(S.slots[s.id]); return c && MV.ans(c) === s.id; }).length; }
  function bp(){
    var built = nCorrect() === 5, works = built && !S.brkR && !S.brkE, g = works ? GAIN[S.str] : 0, sg = S.sign === "+" ? -1 : 1;
    var P = series(90, 70, g, S.del, sg, 60), stop = null;
    for (var i = 1; i <= 20; i++) if (P[i] < 40 || P[i] > 140) { stop = i; break; }
    var m = { built:built, works:works, g:g, P:P, stop:stop, tMax:stop == null ? 20 : stop, back:stop == null ? backAt(P, 80, 100) : null };
    var mx = -Infinity; for (i = 1; i <= m.tMax; i++) mx = Math.max(mx, P[i]); m.max = mx;
    return m;
  }
  function birthS(n){ return 2 * Math.pow(1.5, n); }   // 2, 3, 4.5, 6.75, 10.1, 15.2, 22.8: first passes 20 at contraction 6
  var DELIV = 6;
  function valAt(m, T){ var i = Math.floor(T), k = T - i; if (i >= m.tMax) return m.P[m.tMax]; return lerp(m.P[i], m.P[i + 1], k); }

  // ---- painting ----
  function paintTray(){
    var el = $("#ho-tray", host), used = {};
    SL.forEach(function(s){ if (S.slots[s.id]) used[S.slots[s.id]] = true; });
    var left = tray.filter(function(id){ return !used[id]; });
    var h = left.length ? left.map(function(id){ var c = cardOf(id); return '<button type="button" class="ho-card" data-card="' + id + '" data-k="hoc' + id + '" aria-pressed="' + (sel === id) + '"' + (busy ? " disabled" : "") + ">" + c.t + "</button>"; }).join("")
      : '<p class="ho-trayd">Every slot is filled. The four cards left over don’t belong in this loop.</p>';
    if (left.length && left.length === 4 && nCorrect() === 5) h = '<p class="ho-trayd">Left over: ' + left.map(function(id){ return cardOf(id).t; }).join(" · ") + ".</p>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintLoop(){
    var row = $("#ho-row", host), birth = S.scn === "birth", deliv = birth && Tb >= DELIV - 1e-6;
    var h = SL.map(function(s, i){
      var off = !birth && ((s.id === "rec" && S.brkR) || (s.id === "eff" && S.brkE)) || (deliv && s.id === "stim");
      var inner, box;
      if (birth) inner = '<span class="ho-ct">' + C.birthCards[i] + "</span>";
      else { var c = cardOf(S.slots[s.id]); inner = c ? '<span class="ho-ct">' + c.t + "</span>" : '<span class="ho-empty">Empty</span>'; }
      var tag = off ? '<span class="ho-off">' + (s.id === "stim" ? "ended" : s.id === "rec" ? "damaged" : "blocked") + "</span>" : "";
      if (birth) box = '<div class="ho-drop is-fixed">' + inner + "</div>";
      else box = '<button type="button" class="ho-drop' + (sel ? " ready" : "") + '" data-slot="' + s.id + '" data-k="hos' + s.id + '" aria-label="' + MV.esc(s.t + " slot: " + (S.slots[s.id] ? MV.plain(cardOf(S.slots[s.id]).t) : "empty")) + '"' + (busy ? " disabled" : "") + ">" + inner + "</button>";
      return (i ? '<span class="ho-arr" aria-hidden="true"></span>' : "") + '<div class="ho-slot' + (off ? " off" : "") + '" data-sid="' + s.id + '"><span class="ho-sn">' + s.t + "</span>" + box + tag + "</div>";
    }).join("");
    MV.keepFocus(row, function(){ row.innerHTML = h; });
    paintLit();
  }
  function paintLit(){
    $$(".ho-slot", host).forEach(function(el, i){ el.classList.toggle("lit", lit === "all" || lit === i); });
  }
  function paintMsg(){ var el = $("#ho-msg", host); el.innerHTML = msg ? MV.fbHTML(msg[0], msg[1]) : ""; }
  function warnText(m){
    if (S.scn !== "bp" || !S.dist || m.stop == null || Td < m.stop - 1e-6) return "";
    return S.sign === "+" ? "Dangerously low: this loop makes things worse." : "Off the scale: the swings keep growing, so the display stops.";
  }
  function paintWarn(m){ var w = warnText(m), el = $("#ho-warn", host); if (w !== warnSig) { warnSig = w; el.hidden = !w; el.textContent = w; } }
  function bpPts(m, T){
    var pts = [[-2.6, 90], [0, 90]]; if (!S.dist) return pts;
    pts.push([0, 70]);
    var end = Math.min(T, m.tMax);
    for (var i = 1; i <= Math.ceil(end - 1e-9); i++) {
      var x = Math.min(i, end), y = i > end ? lerp(m.P[i - 1], m.P[i], end - (i - 1)) : m.P[i];
      if (y < 40 || y > 140) { var lim = y < 40 ? 40 : 140, k = (lim - m.P[i - 1]) / (m.P[i] - m.P[i - 1]); pts.push([i - 1 + k, lim]); return pts; }
      pts.push([x, y]);
    }
    return pts;
  }
  function paintPlot(){
    var ink2 = MV.css("--ink-2"), pen = MV.css("--pen"), ink = MV.css("--ink");
    if (S.scn === "bp") {
      var m = bp(), pts = bpPts(m, Td), last = pts[pts.length - 1];
      plot.render = function(){
        plot.draw({ view:{ xmin:-2.6, xmax:20.6, ymin:30, ymax:150 }, xTicks:{ step:2 }, yTicks:{ step:20 }, xLabel:"time (s)", yLabel:"blood pressure (mmHg)",
          regions:[{ f:function(){ return 100; }, g:function(){ return 80; }, color:MV.css("--hi-soft") }],
          segments:[{ x1:-2.6, y1:90, x2:20.6, y2:90, color:ink2, width:1.5, dash:[6, 5] }].concat(S.dist ? [{ x1:0, y1:32, x2:0, y2:146, color:ink2, width:1, dash:[2, 4] }] : []),
          curves:[{ pts:pts, color:pen, width:3 }],
          points:[{ x:last[0], y:last[1], r:5.5, color:pen }],
          labels:[{ x:20.4, y:104, text:"normal range 80–100", color:ink2, align:"right", bg:true }, { x:20.4, y:86, text:"set point 90", color:ink2, align:"right", bg:true }]
            .concat(S.dist ? [{ x:0.3, y:142, text:"stands up", color:ink, align:"left", bg:true }] : []),
          describe:describePlot() });
      };
    } else {
      var n = Tb, sp = [], ox = [], i;
      for (i = 0; i <= Math.min(Math.floor(n + 1e-9), DELIV); i++) sp.push([i, birthS(i)]);
      if (n < DELIV && frac(n) > 1e-6) sp.push([n, lerp(birthS(Math.floor(n)), birthS(Math.floor(n) + 1), frac(n))]);
      sp.forEach(function(p){ ox.push([p[0], 0.75 * p[1]]); });
      if (n > DELIV) { var k = seg(n, DELIV, DELIV + 0.4); ox.push([DELIV + 0.4 * k, lerp(0.75 * birthS(DELIV), 0, k)]); if (n > DELIV + 0.4) ox.push([n, 0]); }
      plot.render = function(){
        plot.draw({ view:{ xmin:-0.7, xmax:8.6, ymin:-2, ymax:27 }, xTicks:{ step:1 }, yTicks:{ step:5 }, xLabel:"contraction", yLabel:"strength (units)",
          segments:n >= DELIV - 1e-6 ? [{ x1:DELIV, y1:-2, x2:DELIV, y2:26, color:ink2, width:1.6, dash:[6, 5] }] : [],
          curves:[{ pts:ox, color:ink, width:2.2, dash:[2, 3] }, { pts:sp, color:pen, width:3 }],
          points:sp.filter(function(p){ return Math.abs(p[0] - Math.round(p[0])) < 1e-6; }).map(function(p){ return { x:p[0], y:p[1], r:4.5, color:pen }; }),
          labels:(n >= DELIV - 1e-6 ? [{ x:DELIV - 0.1, y:25, text:"Delivery (end event)", color:ink, align:"right", bg:true }] : [])
            .concat([{ x:0.2, y:24, text:"— contraction strength", color:pen, align:"left", bg:true }, { x:0.2, y:21, text:"··· oxytocin (relative)", color:ink, align:"left", bg:true }]),
          describe:describePlot() });
      };
    }
    plot.render();
  }
  function describePlot(){
    if (S.scn === "birth") {
      var n = Math.floor(Tb + 1e-9);
      return "Childbirth model graph: contraction strength rises 2, 3, 4.5, 6.75, 10.1, 15.2, 22.8 units. Now at contraction " + Math.min(n, 8) + (n >= DELIV ? ": delivery happened at contraction 6, the stimulus ended and oxytocin dropped to 0." : ", strength " + fmt(birthS(n)) + " units, oxytocin rising.");
    }
    var m = bp();
    if (!S.dist) return "Blood pressure graph, time 0 to 20 s, normal range 80 to 100 mmHg shaded, set point 90 dashed. The person hasn’t stood up yet: pressure is 90 mmHg.";
    var upto = Math.min(S.t, m.tMax), vals = []; for (var i = 0; i <= upto; i++) vals.push(m.P[i] < 40 ? "below 40" : m.P[i] > 140 ? "above 140" : fmt(m.P[i]));
    return "Blood pressure graph, normal range 80 to 100 mmHg shaded, set point 90 dashed. Values from 0 s to " + upto + " s: " + vals.join(", ") + " mmHg.";
  }
  function status(v){ return v < 80 - 1e-9 ? "Below range" : v > 100 + 1e-9 ? "Above range" : "In range"; }
  function paintRead(){
    var rows;
    if (S.scn === "bp") {
      var m = bp(), t = Math.min(S.t, m.tMax), v = S.dist ? m.P[t] : 90, mx = -Infinity;
      for (var i = 0; i <= (S.dist ? t : -1); i++) mx = Math.max(mx, m.P[i]);
      var pv = v < 40 ? "Below 40 mmHg (off the scale)" : v > 140 ? "Above 140 mmHg (off the scale)" : fmt(v) + " mmHg" + (S.dist ? "" : " (seated)");
      var backT = !S.dist ? "Not yet" : m.back != null && t >= m.back ? "at " + m.back + " s" : (t >= m.tMax && m.back == null ? "Never in this run" : "Not yet");
      rows = [["Blood pressure", pv], ["Set point and normal range", "90 mmHg; 80–100 mmHg"], ["Status", S.dist ? status(v) : "In range"],
        ["Loop type", S.sign === "+" ? "Positive feedback: the response amplifies the change" : "Negative feedback: the response opposes the change"],
        ["Time since disturbance", S.dist ? t + " s" : "Not standing yet"], ["Back in range and staying", backT],
        ["Furthest past the set point", mx >= 90 - 1e-9 ? (mx > 140 ? "More than +50 mmHg" : "+" + fmt(mx - 90) + " mmHg") : "Hasn’t reached 90 yet"],
        ["Loop parts placed", nCorrect() + " of 5 correct"]];
    } else {
      var n = Math.floor(Tb + 1e-9), dv = n >= DELIV;
      rows = [["Contraction", String(Math.min(n, 8))], ["Contraction strength", n > DELIV ? "None: the baby is delivered" : fmt(birthS(n)) + " units"],
        ["Oxytocin", dv ? "0: the stimulus has ended" : "Rising with each contraction"], ["Stimulus", dv ? "Ended: the baby is delivered" : "The baby’s head stretches the cervix"],
        ["Loop type", "Positive feedback: the response amplifies the change"], ["End event", dv ? "Delivery, at contraction 6 (strength first passes 20)" : "Not yet"]];
    }
    var el = $("#ho-read", host), h = MV.readoutHTML(rows); if (el.innerHTML !== h) el.innerHTML = h;
    paintHeart();
  }
  // heart icon: its beat follows the correction (faster while the loop is raising pressure)
  function paintHeart(){
    var el = $("#ho-heartw", host); if (S.scn !== "bp") { el.innerHTML = ""; return; }
    var m = bp(), t = Math.min(S.t, m.tMax), d = S.dist && t < 60 ? m.P[t + 1] - m.P[t] : 0, eff = !S.brkE && m.built;
    var st = !S.dist || !eff || Math.abs(d) < 0.05 ? "rest" : d > 0 ? "fast" : "slow";
    var word = { rest:"resting rate", fast:"beating faster (raising pressure)", slow:"beating slower (lowering pressure)" }[st];
    el.innerHTML = '<div class="ho-heart ho-h-' + st + '"><svg viewBox="0 0 40 36" aria-hidden="true" focusable="false"><path d="M20 33 C6 23 2 16 2 10 C2 5 6 2 11 2 C15 2 18 4 20 7 C22 4 25 2 29 2 C34 2 38 5 38 10 C38 16 34 23 20 33 Z"/></svg><span>Heart: ' + word + "</span></div>";
  }
  function capFor(){
    if (S.scn === "birth") {
      var n = Math.floor(Tb + 1e-9);
      if (n >= DELIV) return "Delivery removed the stretch stimulus, so the loop stopped and oxytocin fell to 0. Positive feedback needs an end event.";
      return n === 0 ? "Each contraction pushes the baby’s head against the cervix, which releases more oxytocin. Press Play or Step." : "Contraction " + n + ": strength " + fmt(birthS(n)) + " units. Each one makes the next 1.5 times stronger.";
    }
    if (!filled()) return "Place a card in every slot to unlock Run mode.";
    var m = bp();
    if (!S.dist) return "Ready. Press “Stand up quickly”: pressure drops from 90 to 70 mmHg at 0 s.";
    if (!m.built) return "Your loop has a part that doesn’t belong, so nothing corrects the drop. Check the “Loop parts placed” readout.";
    if (S.brkR) return "The receptor is damaged, so the control centre is never told the pressure fell. Nothing corrects it.";
    if (S.brkE) return "The effector is blocked, so the control centre’s signals change nothing. The pressure stays low.";
    if (S.sign === "+") return "A + arrow amplifies the change: the farther pressure is from 90, the harder it is pushed down.";
    if (S.t < m.tMax) return "The control centre acts on a reading " + S.del + " s old and corrects by " + { weak:"a quarter", medium:"a half", strong:"all" }[S.str] + " of the gap it sees.";
    if (m.back == null) return "With a strong response and a delay, each correction overshoots. The pressure never settles.";
    return "Back in range at " + m.back + " s and staying. Highest value after the drop: " + fmt(m.max) + " mmHg.";
  }
  function paintCtrl(){
    var birth = S.scn === "birth", unlocked = birth || filled();
    scnR.set(S.scn); signR.set(birth ? "+" : S.sign); strR.set(S.str); delR.set(S.del);
    scnR.disable(busy); signR.disable(busy || birth); strR.disable(busy || !unlocked || birth); delR.disable(busy || !unlocked || birth);
    $("#ho-tray", host).hidden = birth; $("#ho-how", host).hidden = birth; $("#ho-bpc", host).hidden = birth;
    $("#ho-lock", host).hidden = unlocked;
    var brk = $("#ho-brk", host);
    MV.keepFocus(brk, function(){ brk.innerHTML = '<span class="rg-lab">Break a link</span>' + switchHTML("brkR", "Receptor damaged", S.brkR, busy || !unlocked) + switchHTML("brkE", "Effector blocked", S.brkE, busy || !unlocked); });
    var stand = $("[data-act=stand]", host); stand.disabled = busy || !unlocked;
    var tMax = birth ? 8 : bp().tMax, cur = birth ? S.bt : S.t, started = birth || S.dist;
    $$("[data-pa]", host).forEach(function(b){
      var a = b.dataset.pa;
      if (a === "play") { b.textContent = playing ? "Pause" : "Play"; b.disabled = (busy && !playing) || !unlocked || busy; }
      else if (a === "step") { b.textContent = birth ? "Step 1 contraction" : "Step 1 s"; b.disabled = busy || !unlocked || (started && cur >= tMax); }
      else b.disabled = busy || !unlocked;
    });
    $("#ho-time", host).textContent = birth ? "Contraction " + S.bt + " of 8" : S.dist ? "t = " + Math.min(S.t, tMax) + " s (of 20 s)" : "Before standing";
    $("#ho-note", host).innerHTML = '<span class="bio-model">Model</span> ' + (birth ? C.birthNote : C.modelNote);
  }
  function paintCap(){ $("#ho-cap", host).textContent = cap || capFor(); }
  function paintAll(){ paintCtrl(); paintTray(); paintLoop(); paintMsg(); paintPlot(); paintRead(); paintCap(); paintWarn(bp()); }

  // ---- time ----
  function stopPlay(){
    if (anim) { anim(); anim = null; }
    if (playing) { playing = false; if (S.scn === "bp") { S.t = clamp(Math.floor(Td + 1e-6), 0, 20); Td = S.t; } else { S.bt = clamp(Math.floor(Tb + 1e-6), 0, 8); Tb = S.bt; } lit = S.dist || S.scn === "birth" ? "all" : null; api.save(); }
  }
  function tickBP(v, m){ Td = v; var it = clamp(Math.floor(v + 1e-6), 0, m.tMax); lit = MV.reduceMotion ? "all" : Math.floor(frac(v) * 5); paintLit(); if (it !== S.t) { S.t = it; paintRead(); paintCtrl(); MV.changed(); } paintPlot(); paintWarn(m); }
  function tickB(v){ Tb = v; var it = clamp(Math.floor(v + 1e-6), 0, 8); lit = MV.reduceMotion ? "all" : Math.floor(frac(v) * 5); if (it !== S.bt) { S.bt = it; paintRead(); paintCtrl(); paintLoop(); MV.changed(); } paintLit(); paintPlot(); }
  function runTo(to, msPer, done){
    var birth = S.scn === "birth", from = birth ? S.bt : S.t, m = birth ? null : bp();
    if (!birth) to = Math.min(to, m.tMax);
    if (to <= from) { if (done) done(); return; }
    anim = MV.tween({ dur:(to - from) * msPer, ease:lin, step:function(k){ var v = lerp(from, to, k); if (birth) tickB(v); else tickBP(v, m); },
      done:function(){ anim = null; if (birth) { S.bt = to; Tb = to; } else { S.t = to; Td = to; } lit = "all"; api.save(); if (done) done(); } });
  }
  function play(){
    if (playing) { stopPlay(); cap = ""; paintAll(); MV.changed(); return; }
    var birth = S.scn === "birth";
    if (!birth && !S.dist) { S.dist = true; S.t = 0; Td = 0; }
    var tMax = birth ? 8 : bp().tMax;
    if ((birth ? S.bt : S.t) >= tMax) { if (birth) { S.bt = 0; Tb = 0; } else { S.t = 0; Td = 0; } }
    playing = true; cap = ""; paintAll();
    runTo(tMax, birth ? 650 : 320, function(){ playing = false; paintAll(); MV.changed(); });
  }
  function step(){
    stopPlay(); cap = "";
    var birth = S.scn === "birth";
    if (!birth && !S.dist) { S.dist = true; S.t = 0; Td = 0; lit = "all"; api.save(); paintAll(); MV.changed(); return; }
    var cur = birth ? S.bt : S.t, tMax = birth ? 8 : bp().tMax; if (cur >= tMax) return;
    playing = true; paintCtrl();
    runTo(cur + 1, birth ? 650 : 320, function(){ playing = false; paintAll(); MV.changed(); });
  }
  function reset(){ stopPlay(); cap = ""; if (S.scn === "birth") { S.bt = 0; Tb = 0; } else { S.dist = false; S.t = 0; Td = 0; } lit = null; api.save(); paintAll(); MV.changed(); }
  function stand(){ stopPlay(); S.dist = true; S.t = 0; Td = 0; cap = ""; api.save(); play(); }
  function setting(p){
    stopPlay(); msg = null;
    Object.keys(p).forEach(function(k){ S[k] = p[k]; });
    if (p.scn) { Td = S.t; Tb = S.bt; lit = null; }
    if (p.sign === "+") msg = ["bad", C.signFb];
    cap = ""; Td = S.t; api.save(); paintAll(); MV.changed();
  }

  // ---- build interactions ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.card) { sel = sel === b.dataset.card ? null : b.dataset.card; msg = null; paintTray(); paintLoop(); paintMsg(); return; }
    if (b.dataset.slot) {
      var sid = b.dataset.slot, slotName = byId(SL, sid).t;
      if (!sel) {
        if (S.slots[sid]) { var back = cardOf(S.slots[sid]); delete S.slots[sid]; msg = ["", "“" + back.t + "” went back to the tray."]; }
        else msg = ["", "Tap a card first, then tap the slot it belongs in."];
      } else {
        stopPlay();
        var c = cardOf(sel); S.slots[sid] = sel; sel = null;
        var fb = C.cardFb[c.id + "|" + sid];
        msg = fb ? ["bad", "<strong>" + c.t + " in " + slotName + ":</strong> " + fb] : ["", "Placed “" + c.t + "” in " + slotName + "."];
        if (filled() && !fb) msg[1] += " All five slots are filled: Run mode is unlocked.";
      }
      api.save(); paintAll(); MV.changed(); return;
    }
    if (b.dataset.sw) { stopPlay(); S[b.dataset.sw] = !S[b.dataset.sw]; cap = ""; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.act === "stand") { stand(); return; }
    if (b.dataset.pa) { if (b.dataset.pa === "play") play(); else if (b.dataset.pa === "step") step(); else reset(); }
  });
  paintAll();

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {};
    if (S.scn !== "bp") return { ok:false, msg:N.scn };
    if (id === "tc1") {
      if (!filled()) return { ok:false, msg:N.empty };
      var s = S.slots, cRec = correctCard("rec"), cEff = correctCard("eff");
      if (s.rec === cEff && s.eff === cRec) return { ok:false, msg:N.swap };
      if (s.cc === "d3") return { ok:false, msg:N.pancreas };
      if (nCorrect() < 5) return { ok:false, msg:c.general };
      if (S.sign === "+") return { ok:false, msg:N.plus };
      return { ok:true };
    }
    if (nCorrect() < 5) return { ok:false, msg:N.build };
    if (S.sign === "+") return { ok:false, msg:N.plus };
    if (S.brkR || S.brkE) return { ok:false, msg:N.broken };
    var k = S.str + "/" + S.del;
    if (id === "tc2") {
      if (k === "medium/0" || k === "strong/0" || k === "medium/1") return { ok:true };
      if (S.str === "weak") return { ok:false, msg:N.weak };
      if (k === "strong/1") return { ok:false, msg:N.s1 };
      if (k === "medium/2") return { ok:false, msg:N.m2 };
      return { ok:false, msg:c.general };
    }
    if (id === "tc3") {
      if (S.del !== 2) return { ok:false, msg:c.general };
      if (S.str === "weak") return { ok:true };
      return { ok:false, msg:S.str === "medium" ? N.m2 : N.s2 };
    }
    return { ok:false };
  }
  EXF = { show:function(v){ if (v) paintAll(); else if (playing) { stopPlay(); paintAll(); } } };
  function finishPred(p){ busy = false; playing = false; cap = p.reveal; lit = "all"; api.save(); paintAll(); MV.changed(); var d = pend; pend = null; if (d) MV.wait(250, d); }
  return {
    predict:{
      start:function(p){
        stopPlay(); busy = true; sel = null; msg = null; cap = "";
        var s = p.start;
        if (s.scn === "birth") { S.scn = "birth"; S.bt = 0; Tb = 0; }
        else {
          S.scn = "bp"; SL.forEach(function(x){ S.slots[x.id] = correctCard(x.id); });
          S.str = s.str; S.del = s.del; S.sign = s.sign; S.brkR = s.brkR; S.brkE = s.brkE; S.dist = false; S.t = 0; Td = 0;
        }
        lit = null; api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done; playing = true;
        if (S.scn === "birth") { runTo(8, 650, function(){ finishPred(p); }); return; }
        S.dist = true; S.t = 0; Td = 0; paintAll();
        runTo(20, 330, function(){ finishPred(p); });
      }
    },
    challenge:chal
  };
}

// ---------- hero: storyboard (plan) — the BP line runs along the band, the figure stands and the line dips to 70, the five
// loop boxes light in order, the line climbs back and settles. Reduced motion: the final frame with all five boxes lit. ----------
function hero(f){
  var box = $("#ho-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, W = 420, H = 300;
  var CAPS = ["Blood pressure stays in its normal range, around a set point of 90 mmHg.", "The person stands up: pressure dips to 70 mmHg.",
    "The loop runs: stimulus, baroreceptors, the medulla, then the heart beats faster.", "Back in range in about 2 seconds"];
  var NAMES = ["Stimulus", "Receptor", "Control", "Effector", "Response"], SUBS = ["pressure falls", "baroreceptor", "medulla", "heart", "pressure rises"];
  box.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" class="ho-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var GX0 = 52, GX1 = 404, GY0 = 132, GY1 = 282;   // graph box; time 0–10 s, pressure 60–110 mmHg
  function X(t){ return GX0 + (GX1 - GX0) * t / 10; }
  function Y(p){ return GY1 - (GY1 - GY0) * (p - 60) / 50; }
  function P(t){ return t < 3 ? 90 + 1.2 * Math.sin(t * 2.4) : 90 - 20 * Math.exp(-(t - 3) / 2.9); }
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function scene(T){
    var h = "", i;
    // loop boxes
    for (i = 0; i < 5; i++) {
      var x = 8 + i * 82, on = T >= 3 + i * 0.6, pulse = on && T < 3.6 + i * 0.6;
      h += sv("rect", { x:x, y:10, width:72, height:52, rx:12, "class":"ho-hb" + (on ? " on" : "") + (pulse ? " pulse" : "") }) + txt(x + 36, 31, NAMES[i], "ho-hbt", "middle") + txt(x + 36, 49, SUBS[i], "ho-hbs", "middle");
      if (i) h += sv("path", { d:"M" + (x - 9) + " 36 L" + (x - 2) + " 36 M" + (x - 6) + " 32 L" + (x - 2) + " 36 L" + (x - 6) + " 40", "class":"ho-har" });
    }
    h += sv("path", { d:"M372 62 L372 80 L44 80 L44 66 M40 70 L44 64 L48 70", "class":"ho-har" }) + sv("circle", { cx:208, cy:80, r:10, "class":"ho-hsg" }) + txt(208, 85, "−", "ho-hsgt", "middle");
    h += txt(232, 98, "opposes the change", "ho-hbs");
    // graph
    h += sv("rect", { x:GX0, y:f1(Y(100)), width:GX1 - GX0, height:f1(Y(80) - Y(100)), "class":"ho-hband" });
    h += sv("path", { d:"M" + GX0 + " " + Y(90) + " L" + GX1 + " " + Y(90), "class":"ho-hset" });
    h += sv("path", { d:"M" + GX0 + " " + GY0 + " L" + GX0 + " " + GY1 + " L" + GX1 + " " + GY1, "class":"ho-hax" });
    [70, 90, 110].forEach(function(p){ h += txt(GX0 - 6, Y(p) + 4, String(p), "ho-hbs", "end"); });
    h += txt(GX0 + 4, GY0 - 6, "blood pressure (mmHg)", "ho-hbs") + txt(GX1, GY1 + 14, "time (s)", "ho-hbs", "end");
    var gt = T < 2 ? T * 1.5 : T < 2.6 ? 3 : T < 6 ? 3 : Math.min(10, 3 + (T - 6) * 3), pts = [];
    for (var t = 0; t <= gt + 1e-9; t += 0.1) pts.push([X(t), Y(P(t))]);
    if (T >= 2.3 && gt <= 3.01) { pts.push([X(3), Y(lerp(90, 70, seg(T, 2.3, 2.6)))]); }
    if (pts.length > 1) h += sv("path", { d:pathD(pts), "class":"ho-hline" }) + sv("circle", { cx:f1(pts[pts.length - 1][0]), cy:f1(pts[pts.length - 1][1]), r:4.5, "class":"ho-hdot" });
    // figure: seated, then standing (at t = 3 s)
    var up = seg(T, 2, 2.5), fx = 388, fy = 150;
    h += sv("circle", { cx:fx, cy:f1(fy - 26 - 10 * up), r:6, "class":"ho-hfig" }) + sv("path", { d:"M" + fx + " " + f1(fy - 20 - 10 * up) + " L" + fx + " " + f1(fy - 2 - 4 * up) + " L" + f1(fx + 12 * (1 - up)) + " " + f1(fy - 2 * up) + " L" + f1(fx + 12 * (1 - up)) + " " + f1(fy + 12 + 2 * up), "class":"ho-hfig" });
    if (up < 1) h += op(1 - up, sv("path", { d:"M" + (fx - 6) + " " + (fy - 2) + " L" + (fx + 16) + " " + (fy - 2) + " M" + (fx + 16) + " " + (fy - 2) + " L" + (fx + 16) + " " + (fy + 14), "class":"ho-hax" }));
    if (T >= 8.4) h += op(seg(T, 8.4, 8.9), txt(240, GY0 + 6, "Back in range in about 2 seconds", "ho-hok", "middle"));
    setCap(T < 2 ? 0 : T < 3 ? 1 : T < 8.4 ? 2 : 3);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(9.5); return; }
  draw(0);
  MV.tween({ dur:9500, ease:lin, step:function(k){ draw(k * 9.5); }, done:function(){ draw(9.5); } });
}

// ---------- Part 3: Two systems ----------
// Station 1 race (N13-style run: Start, Reset; reduced motion shows the final times). Station 2: @component S1 diagramExplorer
// ("trace a signal" form, self-contained): hypothalamus, stalk, posterior and anterior pituitary, portal vessels; structure
// buttons highlight a part and show its job; two traced paths animate hormone tokens (ADH cerulean, others ink with labels).
function part3(host, api){
  var C = api.content, S = api.S, A = C.st1, B = C.st2, DT = C.data;
  var D = { race:0, thy:false, part:null, path:null, ask:{} };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k] && typeof D[k] === "object" ? {} : D[k]; });
  var raceT = S.race ? 6 : 0, rAnim = null, pAnim = null, pK = S.path ? 3 : 0;
  host.innerHTML = '<div class="ho-p3">' +
    '<section class="ho-sta" aria-labelledby="ho-s1h"><h3 id="ho-s1h">' + A.title + "</h3><p>" + A.text + '</p>' +
      '<div class="ho-fig"><svg id="ho-race" viewBox="0 0 520 250" role="img" focusable="false"></svg></div>' +
      '<div class="q-actions" id="ho-rbtn"></div><div id="ho-rtbl" aria-live="polite"></div><p class="tiny muted">' + A.note + "</p></section>" +
    '<section class="ho-sta part" aria-labelledby="ho-s2h"><h3 id="ho-s2h">' + B.title + "</h3><p>" + B.text + '</p>' +
      '<div class="ho-two"><div class="ho-fig"><svg id="ho-hp" viewBox="0 0 460 330" role="img" focusable="false"></svg></div>' +
      '<div><div class="q-actions" id="ho-pbtn"></div><ol class="ho-steps" id="ho-psteps" aria-live="polite"></ol>' +
        '<h4>Structures</h4><div class="ho-parts" id="ho-parts" role="group" aria-label="Structures"></div><div id="ho-info" aria-live="polite"></div></div></div></section>' +
    '<section class="ho-sta part" aria-labelledby="ho-s3h"><h3 id="ho-s3h">' + DT.title + '</h3><details class="alg" open><summary>Open the data table</summary>' +
      MV.tableHTML({ head:DT.head, rows:DT.rows }) + '<div id="ho-asks"></div></details></section></div>';

  // ---- station 1: the race ----
  var LANES = function(){ return A.lanes.filter(function(l){ return l.id !== "thy" || S.thy; }); };
  function prog(id, t){ return id === "nerve" ? clamp(t / 0.05, 0, 1) : id === "epi" ? clamp(t / 3, 0, 1) : clamp(t / 150, 0, 0.05); }
  function raceSVG(t){
    var L = LANES(), h = "", y0 = 46, gap = 66;
    h += txt(510, 22, "time: " + (t < 1 ? MV.num(t, 2) : MV.num(t, 1)) + " s", "ho-clock", "end");
    L.forEach(function(l, i){
      var y = y0 + i * gap, p = prog(l.id, t), x0 = 34, x1 = 404, x = lerp(x0, x1, p), done = p >= 1;
      h += txt(x0 - 8, y - 16, l.name, "ho-ln");
      if (l.id === "nerve") {
        h += sv("path", { d:"M" + x0 + " " + y + " L" + x1 + " " + y, "class":"ho-neuron" });
        for (var k = 0; k < 6; k++) h += sv("circle", { cx:x0 + 30 + k * 64, cy:y, r:2.6, "class":"ho-node" });
        if (p > 0 && !done) h += sv("circle", { cx:f1(x), cy:y, r:6, "class":"ho-imp" });
      } else {
        h += sv("path", { d:"M" + x0 + " " + (y - 7) + " L" + x1 + " " + (y - 7) + " M" + x0 + " " + (y + 7) + " L" + x1 + " " + (y + 7), "class":"ho-vessel" });
        if (t > 0) for (var j = 0; j < 4; j++) { var q = clamp(p - j * 0.05, 0, 1); if (q > 0 && !(done && j > 0)) h += sv("circle", { cx:f1(lerp(x0, x1, q)), cy:y + (j % 2 ? 3 : -3), r:4, "class":"ho-hor" }); }
        h += txt(x0 + 4, y + 22, l.id === "epi" ? "epinephrine in the blood" : "thyroid hormone in the blood", "ho-sm");
      }
      var lasting = done && (l.id !== "nerve" || t < 0.6);
      h += sv("rect", { x:412, y:y - 15, width:96, height:30, rx:8, "class":"ho-goal" + (lasting ? " on" : "") }) + txt(460, y + 4, l.end, "ho-gt", "middle");
      if (done) h += txt(460, y + 28, (l.id === "nerve" ? "0.05 s" : "a few seconds") + (l.id === "nerve" && t >= 0.6 ? " · already over" : " · lasts " + l.lasts.toLowerCase()), "ho-sm", "middle");
      else if (l.id === "thy" && t >= 6) h += txt(460, y + 28, "still building: hours to days", "ho-sm", "middle");
    });
    return h;
  }
  function paintRace(){
    var el = $("#ho-race", host), L = LANES();
    el.setAttribute("viewBox", "0 0 520 " + (L.length === 3 ? 250 : 180));
    el.innerHTML = raceSVG(raceT);
    el.setAttribute("aria-label", "Race between " + L.map(function(l){ return l.name; }).join(", ") + ". " + (S.race ? "Finished: the nerve signal arrives in about 0.05 s and is over almost at once; epinephrine arrives after a few seconds and lasts minutes" + (S.thy ? "; thyroid hormone is still building after the race: it takes hours to days and lasts days." : ".") : "Not started."));
    var bb = $("#ho-rbtn", host);
    MV.keepFocus(bb, function(){ bb.innerHTML = '<button type="button" class="btn primary sm" data-race="go" data-k="horgo"' + (rAnim ? " disabled" : "") + ">" + (S.race ? "Run the race again" : "Start the race") + '</button><button type="button" class="btn ghost sm" data-race="thy" data-k="horthy" aria-pressed="' + S.thy + '"' + (rAnim ? " disabled" : "") + ">" + (S.thy ? "Remove thyroid hormone" : A.addThy) + "</button>"; });
    var cols = L, rows = A.rows.map(function(r, ri){ return [r].concat(cols.map(function(l){ var ok = S.race || prog(l.id, raceT) >= 1; return ok ? [l.by, l.time, l.lasts, l.cells][ri] : "…"; })); });
    var th = $("#ho-rtbl", host), hh = MV.tableHTML({ head:[""].concat(cols.map(function(l){ return l.name; })), rows:rows });
    if (th.innerHTML !== hh) th.innerHTML = hh;
  }
  function race(){
    if (rAnim) rAnim(); S.race = 0; raceT = 0; paintRace();
    rAnim = MV.tween({ dur:4200, ease:lin, step:function(k){ raceT = 6 * k * k; paintRace(); }, done:function(){ rAnim = null; raceT = 6; S.race = 1; api.save(); paintRace(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-race]"); if (!b || b.disabled) return;
    if (b.dataset.race === "go") race(); else { S.thy = !S.thy; S.race = 0; raceT = 0; api.save(); paintRace(); }
  });
  paintRace();

  // ---- station 2: hypothalamus–pituitary explorer ----
  var PATH1 = [[262, 60], [252, 92], [214, 128], [212, 186], [244, 214], [258, 232], [262, 264], [262, 300]];
  var PATH2 = [[136, 62], [176, 104], [192, 128], [190, 160], [184, 190], [168, 222], [160, 250], [160, 300]];
  function hpSVG(){
    var on = function(id){ return S.part === id ? " on" : ""; }, h = "";
    h += sv("path", { d:"M40 92 Q40 22 200 20 Q370 22 380 92 Q370 132 230 128 L170 128 Q48 132 40 92 Z", "class":"ho-reg" + on("hyp") }) + txt(56, 50, "Hypothalamus", "ho-st");
    h += sv("path", { d:"M182 128 L182 196 M226 128 L226 192", "class":"ho-stalk" });
    h += sv("ellipse", { cx:160, cy:240, rx:60, ry:44, "class":"ho-lobe" + on("ant") }) + txt(160, 236, "Anterior", "ho-st", "middle") + txt(160, 252, "pituitary", "ho-st", "middle");
    h += sv("ellipse", { cx:266, cy:236, rx:44, ry:40, "class":"ho-lobe post" + on("post") }) + txt(266, 232, "Posterior", "ho-st", "middle") + txt(266, 248, "pituitary", "ho-st", "middle");
    h += sv("circle", { cx:262, cy:60, r:10, "class":"ho-nc" + on("axon") }) + sv("path", { d:pathD(PATH1.slice(0, 6)), "class":"ho-axon" + on("axon") }) + sv("circle", { cx:258, cy:232, r:4, "class":"ho-term" });
    h += sv("circle", { cx:136, cy:62, r:10, "class":"ho-nc" }) + sv("path", { d:pathD(PATH2.slice(0, 3)), "class":"ho-axon" });
    h += sv("path", { d:pathD(PATH2.slice(2, 6)), "class":"ho-portal" + on("portal") }) + sv("path", { d:"M184 124 q8 -6 16 0 q-8 6 -16 0 Z", "class":"ho-cap1" + on("portal") });
    h += sv("path", { d:"M60 310 L420 310", "class":"ho-blood" + on("blood") }) + sv("path", { d:"M160 284 L160 306 M262 276 L262 306", "class":"ho-blood thin" + on("blood") }) + txt(420, 326, "blood, to the body", "ho-sm", "end");
    if (S.path) {
      var P = S.path === "p1" ? PATH1 : PATH2, k = pK, p = k < 1 ? k * 0.45 : k < 2 ? 0.45 + (k - 1) * 0.35 : 0.8 + (k - 2) * 0.2, pt = polyAt(P, p);
      if (S.path === "p1") h += sv("circle", { cx:f1(pt[0]), cy:f1(pt[1]), r:8, "class":"ho-adh" }) + txt(pt[0] + 12, pt[1] + 4, "ADH", "ho-adht");
      else {
        var lab = p < 0.8 ? "RH" : "TSH";
        h += sv("circle", { cx:f1(pt[0]), cy:f1(pt[1]), r:8, "class":"ho-rh" }) + txt(pt[0] - 12, pt[1] + 4, lab, "ho-rht", "end");
      }
    }
    return h;
  }
  function paintHP(){
    var el = $("#ho-hp", host); el.innerHTML = hpSVG();
    var part = byId(B.parts, S.part);
    el.setAttribute("aria-label", "Hypothalamus above the pituitary stalk; the anterior pituitary (left) and posterior pituitary (right) below; blood leaves at the bottom." + (part ? " Highlighted: " + part.t + "." : "") + (S.path ? " Tracing " + (S.path === "p1" ? "path 1, ADH." : "path 2, a releasing hormone.") : ""));
    var pb = $("#ho-pbtn", host);
    MV.keepFocus(pb, function(){ pb.innerHTML = B.paths.map(function(p){ return '<button type="button" class="btn ' + (S.path === p.id ? "primary" : "ghost") + ' sm" data-path="' + p.id + '" data-k="hop' + p.id + '"' + (pAnim ? " disabled" : "") + ">" + p.t + "</button>"; }).join(""); });
    var steps = S.path ? byId(B.paths, S.path).steps : [];
    $("#ho-psteps", host).innerHTML = steps.map(function(s, i){ return '<li class="' + (i <= Math.floor(pK - 1e-6) || pK >= 3 ? "on" : "") + '">' + s + "</li>"; }).join("");
    var pp = $("#ho-parts", host);
    MV.keepFocus(pp, function(){ pp.innerHTML = B.parts.map(function(x){ return '<button type="button" class="chip" data-part="' + x.id + '" data-k="hopt' + x.id + '" aria-pressed="' + (S.part === x.id) + '">' + x.t + "</button>"; }).join(""); });
    $("#ho-info", host).innerHTML = part ? '<div class="refresh ho-infob"><h4>' + part.t + "</h4><p>" + part.job + "</p></div>" : '<p class="tiny muted">Tap a structure to see its name and job.</p>';
  }
  function trace(id){
    if (pAnim) pAnim(); S.path = id; pK = 0; api.save(); paintHP();
    pAnim = MV.tween({ dur:4200, ease:lin, step:function(k){ pK = 3 * k; paintHP(); }, done:function(){ pAnim = null; pK = 3; paintHP(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-path],[data-part]"); if (!b || b.disabled) return;
    if (b.dataset.path) trace(b.dataset.path);
    else { S.part = S.part === b.dataset.part ? null : b.dataset.part; api.save(); paintHP(); }
  });
  paintHP();

  // ---- check it with data: tap the row ----
  function paintAsks(){
    var el = $("#ho-asks", host);
    MV.keepFocus(el, function(){
      el.innerHTML = DT.asks.map(function(q){
        var ch = S.ask[q.id], right = MV.ans(q), done = ch === right;
        return '<div class="ho-ask"><p><strong>' + q.t + '</strong></p><div class="ho-rowbtns" role="group" aria-label="Rows">' + DT.rows.map(function(r, i){
          return '<button type="button" class="opt' + (ch === i ? (i === right ? " right" : " wrong") : "") + '" data-ask="' + q.id + '" data-ri="' + i + '" data-k="hoa' + q.id + i + '"' + (done ? " disabled" : "") + "><span>" + r[0] + "</span></button>";
        }).join("") + "</div>" + (ch != null ? MV.fbHTML(ch === right ? "good" : "bad", q.fb[ch]) : "") + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ask]"); if (!b || b.disabled) return;
    S.ask[b.dataset.ask] = +b.dataset.ri; api.save(); paintAsks(); MV.focusFb(b.closest(".ho-ask"));
  });
  paintAsks();
}

// ---------- Practice activity 1: Build the loop (two K12 sorter rounds; one first-try line out of 10) ----------
function loopsActivity(host, api, a){
  var made = [];
  host.innerHTML = a.rounds.map(function(r){ return '<div class="ho-round"><h4>' + r.title + '</h4><div id="ho-r-' + r.id + '"></div></div>'; }).join("");
  a.rounds.forEach(function(r){
    var sub = { id:a.id + "-" + r.id, type:"sorter", noun:a.noun, txt:a.txt, boxes:a.boxes, items:r.items, wrongDefault:a.wrongDefault, goal:a.goal };
    made.push({ sub:sub, api:MV.activityTypes.sorter($("#ho-r-" + r.id, host), sub) });
  });
  return {
    stats:function(){
      var f = 0, t = 0, d = 0; made.forEach(function(m){ var s = m.api.stats(); f += s.first; t += s.total; d += s.done; });
      return { first:f, total:t, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + t + (d < t ? " (unfinished)" : "") };
    },
    missed:function(){ var g = []; made.forEach(function(m){ g = g.concat(m.api.missed()); }); return g; }
  };
}

// ---------- Performance task: Steady breathing (S8 loop design; plan model C(t + 1) = C(t) − g × [C(t − d) − 40]) ----------
var task = (function(){
  var api = null, T = null, plot = null;
  function read(){ var s = api ? api.S : {}; return { rec:s.rec || "thermo", cc:s.cc || "hypo", eff:s.eff || "heart", sign:s.sign || "+", str:s.str || "weak", del:s.del == null ? 2 : +s.del }; }
  function run(d){
    var works = d.rec === "chemo" && d.cc === "resp" && d.eff === "dia";
    var C = series(40, 55, works ? GAIN[d.str] : 0, d.del, d.sign === "+" ? -1 : 1, 60);
    var mn = Infinity; for (var i = 0; i <= 20; i++) mn = Math.min(mn, C[i]);
    return { works:works, C:C, back:backAt(C, 35, 45), min:mn };
  }
  function nm(list, id){ var x = byId(list, id); return x ? x.t : id; }
  function text(d){ return nm(T.recs, d.rec) + " → " + nm(T.ccs, d.cc) + " → " + nm(T.effs, d.eff) + ", sign " + (d.sign === "+" ? "+" : "−") + ", " + GNAME[d.str] + " / " + d.del + " s"; }
  function parse(k){ var p = String(k).split("|"); return { rec:p[0], cc:p[1], eff:p[2], sign:p[3] === "p" ? "+" : "-", str:p[4], del:+p[5] }; }
  function paintPv(){
    var el = $("#ho-tpv"); if (!el) return;
    var d = read(), r = run(d), pen = MV.css("--pen"), ink2 = MV.css("--ink-2");
    var pts = []; for (var i = 0; i <= 20; i++) pts.push([i, clamp(r.C[i], 0, 100)]);
    plot.render = function(){
      plot.draw({ view:{ xmin:-2.6, xmax:20.6, ymin:15, ymax:75 }, xTicks:{ step:2 }, yTicks:{ step:10 }, xLabel:"time (s)", yLabel:"blood CO₂ (mmHg)",
        regions:[{ f:function(){ return 45; }, g:function(){ return 35; }, color:MV.css("--hi-soft") }],
        segments:[{ x1:-2.6, y1:40, x2:20.6, y2:40, color:ink2, width:1.5, dash:[6, 5] }, { x1:-2.6, y1:40, x2:0, y2:40, color:pen, width:3 }, { x1:0, y1:40, x2:0, y2:55, color:pen, width:3 }],
        curves:[{ pts:pts, color:pen, width:3 }],
        labels:[{ x:20.4, y:48, text:"normal range 35–45", color:ink2, align:"right", bg:true }, { x:20.4, y:37, text:"set point 40", color:ink2, align:"right", bg:true }],
        describe:"Blood CO₂ after exercise, model data, 0 to 20 s: " + pts.map(function(p){ return r.C[p[0]] < 0 || r.C[p[0]] > 100 ? "off the scale" : fmt(r.C[p[0]]); }).join(", ") + " mmHg. Normal range 35 to 45 shaded." });
    };
    plot.render();
    el.innerHTML = MV.readoutHTML([["Your loop", text(d)], ["Loop type", d.sign === "+" ? "Positive feedback: CO₂ climbs" : "Negative feedback"],
      ["Back in range and staying", r.back == null ? "Never in this run" : "at " + r.back + " s"], ["Lowest CO₂", r.min < 0 ? "Off the scale" : fmt(r.min) + " mmHg"],
      ["Correction", r.works ? "The loop can sense and change CO₂" : "None: a part of this loop can’t sense CO₂ or change breathing"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      var d0 = read(); Object.keys(d0).forEach(function(k){ if (s[k] == null) s[k] = d0[k]; });
      inp.innerHTML = '<div class="ho-tin">' + ["rec", "cc", "eff", "sign", "str", "del"].map(function(k){ return '<div id="ho-tg-' + k + '"></div>'; }).join("") + "</div>";
      function upd(){ a.save(); paintPv(); a.update(); }
      radios($("#ho-tg-rec"), { label:T.inputs.rec, key:"tr", cls:"chips", options:T.recs, value:s.rec, onChange:function(v){ s.rec = v; upd(); } });
      radios($("#ho-tg-cc"), { label:T.inputs.cc, key:"tc", cls:"chips", options:T.ccs, value:s.cc, onChange:function(v){ s.cc = v; upd(); } });
      radios($("#ho-tg-eff"), { label:T.inputs.eff, key:"te", cls:"chips", options:T.effs, value:s.eff, onChange:function(v){ s.eff = v; upd(); } });
      radios($("#ho-tg-sign"), { label:T.inputs.sign, key:"tg", options:[{ id:"-", t:"−", aria:"Minus: opposes the change" }, { id:"+", t:"+", aria:"Plus: amplifies the change" }], value:s.sign, onChange:function(v){ s.sign = v; upd(); } });
      radios($("#ho-tg-str"), { label:T.inputs.str, key:"ts", options:[{ id:"weak", t:"Weak" }, { id:"medium", t:"Medium" }, { id:"strong", t:"Strong" }], value:s.str, onChange:function(v){ s.str = v; upd(); } });
      radios($("#ho-tg-del"), { label:T.inputs.del, key:"td", options:[{ id:0, t:"0 s" }, { id:1, t:"1 s" }, { id:2, t:"2 s" }], value:s.del, onChange:function(v){ s.del = +v; upd(); } });
      pv.innerHTML = '<div class="ho-tpvw"><h4>Your loop after exercise</h4><div class="plot-wrap"><canvas class="plot wide" id="ho-tplot" role="img"></canvas></div><dl class="read" id="ho-tpv" aria-live="polite"></dl><p class="tiny muted"><span class="bio-model">Model</span> ' + T.modelNote + "</p></div>";
      plot = new MV.Plot($("#ho-tplot"), { xmin:-2.6, xmax:20.6, ymin:15, ymax:75 });
      paintPv();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var r = run(d); return [d.rec === "chemo", d.cc === "resp", d.eff === "dia", d.sign === "-", r.back != null && r.back <= 4, r.min >= 38 - 1e-9]; },
    key:function(d){ return [d.rec, d.cc, d.eff, d.sign === "+" ? "p" : "m", d.str, d.del].join("|"); },
    label:function(k){ var d = parse(k); return MV.esc(GNAME[d.str] + " / " + d.del + " s"); },
    text:function(k){ var d = parse(k); return GNAME[d.str] + " / " + d.del + " s"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ loops:loopsActivity },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
