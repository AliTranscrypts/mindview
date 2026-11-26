// N10 interval builder (pilot: MHF4U 02; also for 10, 15, 16, 22, 24). Number line (G14) with draggable endpoint handles (G7),
// open/closed/±∞ chips, up to N pieces, ½-step toggle, "The set / Everything else" mode, "Test a number", live readout.
//
// var b = MV.intervalBuilder(host, {
//   min:-10, max:10, maxPieces:2, pieces:[{a:-2, b:5, aIn:false, bIn:true}],   // a/b may be -Infinity / Infinity
//   modes:true, test:true, readout:true, halfToggle:true, caption:true, aria:"Interval builder",
//   onChange:function(state){}                                                // state is JSON-safe (see get())
// });
// b.get() -> {pieces:[{a,b,aIn,bIn,aInf,bInf}], mode:"set"|"else", half:false}   b.set(state)   b.iv() -> MV.iv pieces of the SET
// b.shown() -> pieces currently shown (the set, or its complement in "Everything else" mode)   b.slide(pieceIndex, end, toValue, done)
(function(){
"use strict";
var MV = window.MV, num = MV.num, MINUS = MV.MINUS;
var ORD = ["first", "second", "third", "fourth"];

MV.intervalBuilder = function(host, o){
  o = Object.assign({ min:-10, max:10, maxPieces:2, modes:true, test:true, readout:true, halfToggle:true, caption:true }, o || {});
  var S = { pieces:[], mode:"set", half:false, testVal:"" };
  var uid = "ib" + Math.random().toString(36).slice(2, 7);
  function fromIv(p){ var q = { a:isFinite(p.a) ? p.a : null, b:isFinite(p.b) ? p.b : null, aIn:!!p.aIn, bIn:!!p.bIn, aInf:p.a === -Infinity, bInf:p.b === Infinity };
    if (q.a === null) q.a = (q.b !== null ? Math.max(o.min, q.b - 3) : -3); if (q.b === null) q.b = Math.min(o.max, q.a + 3); return q; }
  function load(st){
    S.pieces = (st.pieces || []).map(function(p){ return p.aInf !== undefined ? Object.assign({}, p) : fromIv(p); });
    if (!S.pieces.length) S.pieces = [fromIv({ a:-2, b:3, aIn:true, bIn:true })];
    S.mode = st.mode || "set"; S.half = !!st.half; S.testVal = st.testVal || "";
  }
  load({ pieces:o.pieces });
  function toIv(p){ return { a:p.aInf ? -Infinity : p.a, b:p.bInf ? Infinity : p.b, aIn:p.aInf ? false : p.aIn, bIn:p.bInf ? false : p.bIn }; }
  function setIv(){ return S.pieces.map(toIv); }
  function merged(){ return MV.iv.norm(setIv()); }
  function shown(){ return S.mode === "else" ? MV.iv.complement(setIv()) : merged(); }

  host.innerHTML =
    (o.caption ? '<div class="eq-cap ib-cap" aria-live="polite"></div>' : "") +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot nl" role="img" aria-label="' + MV.esc(o.aria || "Number line") + '"></canvas></div>' +
    '<div class="ib-ends"></div>' +
    '<div class="q-actions ib-tools"></div>' +
    (o.modes ? '<div class="ib-mode"></div>' : "") +
    (o.test ? '<div class="numrow"><label for="' + uid + '-t">Test a number:</label><input class="numin short" id="' + uid + '-t" type="text" inputmode="decimal" autocomplete="off" placeholder="e.g. 4"></div>' : "") +
    (o.readout ? '<dl class="read ib-read" aria-live="polite" style="margin-top:14px"></dl>' : "");
  var $ = function(s){ return host.querySelector(s); };
  var plot = new MV.Plot($("canvas"), { xmin:o.min, xmax:o.max, ymin:-1, ymax:1 });
  var extraMarks = [], ringed = null;
  plot.render = function(){
    var nl = { min:o.min, max:o.max, step:1, pieces:[], marks:extraMarks };
    if (S.mode === "else") { nl.pieces = merged(); nl.style = "outline"; nl.hatch = shown(); nl.dots = []; shown().forEach(function(p){ if (isFinite(p.a)) nl.dots.push({ x:p.a, closed:p.aIn, color:MV.css("--ink-2") }); if (isFinite(p.b) && p.b !== p.a) nl.dots.push({ x:p.b, closed:p.bIn, color:MV.css("--ink-2") }); }); }
    else { nl.pieces = setIv(); }
    if (ringed) { nl.dots = (nl.dots || []).concat([{ x:ringed.x, closed:ringed.closed, ring:true }]); }
    plot.draw({ numberLine:nl, describe:describe() });
  };
  function describe(){
    var ps = shown();
    return "Number line from " + num(o.min) + " to " + num(o.max) + ". " + (S.mode === "else" ? "Everything else: " : "Shaded set: ") + MV.iv.text(ps).replace(/∞/g, "infinity") + ".";
  }
  // drag handles: one per finite endpoint
  var drag = MV.drag(plot, {
    axis:"x", step:{ get x(){ return S.half ? 0.5 : 1; } },   // arrow keys follow the ½-step toggle
    handles:function(){ var hs = []; S.pieces.forEach(function(p, i){ if (!p.aInf) hs.push({ id:i + "a", x:p.a, y:0, label:"Left end of piece " + (i + 1) + " at " + num(p.a) + ", " + (p.aIn ? "closed" : "open") + ". Arrow keys move it; O or C sets open or closed." }); if (!p.bInf) hs.push({ id:i + "b", x:p.b, y:0, label:"Right end of piece " + (i + 1) + " at " + num(p.b) + ", " + (p.bIn ? "closed" : "open") + ". Arrow keys move it; O or C sets open or closed." }); }); return hs; },
    snap:function(x){ var st = S.half ? 0.5 : 1; return [Math.max(o.min, Math.min(o.max, Math.round(x / st) * st)), 0]; },
    move:function(id, x){ moveEnd(+id[0], id[1], x); },
    key:function(id, e){
      var k = e.key.toLowerCase(); if (k !== "o" && k !== "c") return false;
      var p = S.pieces[+id[0]]; if (id[1] === "a") p.aIn = k === "c"; else p.bIn = k === "c"; changed(); return true;
    }
  });
  function moveEnd(i, end, x){
    var p = S.pieces[i], gap = 0.5;
    if (end === "a") p.a = Math.min(x, p.bInf ? o.max - gap : p.b - gap);
    else p.b = Math.max(x, p.aInf ? o.min + gap : p.a + gap);
    p.a = Math.max(o.min, p.a); p.b = Math.min(o.max, p.b);
    changed();
  }
  function chip(label, on, data, extra){ return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ib="' + data + '" data-k="' + uid + data + '"' + (extra || "") + ">" + label + "</button>"; }
  function paintControls(){
    var n = S.pieces.length;
    $(".ib-ends").innerHTML = S.pieces.map(function(p, i){
      var leftOuter = i === 0, rightOuter = i === n - 1;
      return '<div class="ib-piece" style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;margin-top:10px">' + (n > 1 ? '<strong class="tiny">Piece ' + (i + 1) + ":</strong>" : "") +
        '<span role="group" aria-label="Left end of piece ' + (i + 1) + '" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="tiny muted">Left end' + (p.aInf ? "" : " (" + num(p.a) + ")") + ":</span>" +
        chip("Open ○", !p.aInf && !p.aIn, i + "a-open") + chip("Closed ●", !p.aInf && p.aIn, i + "a-closed") + (leftOuter ? chip("To " + MINUS + "∞", p.aInf, i + "a-inf") : "") + "</span>" +
        '<span role="group" aria-label="Right end of piece ' + (i + 1) + '" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="tiny muted">Right end' + (p.bInf ? "" : " (" + num(p.b) + ")") + ":</span>" +
        chip("Open ○", !p.bInf && !p.bIn, i + "b-open") + chip("Closed ●", !p.bInf && p.bIn, i + "b-closed") + (rightOuter ? chip("To ∞", p.bInf, i + "b-inf") : "") + "</span></div>";
    }).join("");
    $(".ib-tools").innerHTML = (n < o.maxPieces ? '<button type="button" class="btn ghost sm" data-ib="add" data-k="' + uid + 'add">+ Add a piece</button>' : "") +
      (n > 1 ? '<button type="button" class="btn ghost sm" data-ib="remove" data-k="' + uid + 'rm">Remove piece</button>' : "") +
      (o.halfToggle ? chip("½ steps", S.half, "half") : "");
    if (o.modes) $(".ib-mode").innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Show:</span><span class="seg" role="group" aria-label="What to show"><button type="button" data-ib="mode-set" data-k="' + uid + 'ms" aria-pressed="' + (S.mode === "set") + '">The set</button><button type="button" data-ib="mode-else" data-k="' + uid + 'me" aria-pressed="' + (S.mode === "else") + '">Everything else</button></span></div>';
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ib]"); if (!b) return;
    var d = b.dataset.ib, m = /^(\d)(a|b)-(open|closed|inf)$/.exec(d);
    if (m) {
      var p = S.pieces[+m[1]], end = m[2];
      if (m[3] === "inf") { if (end === "a") p.aInf = !p.aInf; else p.bInf = !p.bInf; }
      else { if (end === "a") { if (p.aInf) { p.aInf = false; p.a = Math.min(p.a, (p.bInf ? o.max : p.b) - 1); } p.aIn = m[3] === "closed"; } else { if (p.bInf) { p.bInf = false; p.b = Math.max(p.b, (p.aInf ? o.min : p.a) + 1); } p.bIn = m[3] === "closed"; } }
    } else if (d === "add") {
      var last = S.pieces[S.pieces.length - 1], start = last.bInf ? Math.min(o.max - 2, last.a + 2) : Math.min(o.max - 2, last.b + 2);
      if (last.bInf) { last.bInf = false; last.b = Math.max(last.a + 1, start - 2); }
      S.pieces.push({ a:start, b:Math.min(o.max, start + 2), aIn:true, bIn:true, aInf:false, bInf:false });
    } else if (d === "remove") { var r = S.pieces.pop(); if (r.bInf) S.pieces[S.pieces.length - 1].bInf = true; }
    else if (d === "half") { S.half = !S.half; }
    else if (d === "mode-set") S.mode = "set";
    else if (d === "mode-else") S.mode = "else";
    changed();
  });
  if (o.test) $("#" + uid + "-t").addEventListener("input", function(e){ S.testVal = e.target.value; paintReadout(); fire(); });

  // ---------- readout ----------
  function pieceWord(i, n){ return n > 1 ? "the " + ORD[i] + " piece" : "the set"; }
  function testLine(ps){
    var raw = (S.testVal || "").trim(); if (!raw) return '<span class="muted">Type a number above.</span>';
    var v = MV.parseNum(raw); if (!v || v.length !== 1) return '<span class="muted">Enter a single number, such as 4 or ' + MINUS + "2.5.</span>";
    var x = v[0], xs = num(x), q = "Is " + xs + " in the " + (S.mode === "else" ? "shown set (everything else)" : "set") + "? ";
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (x === p.a && isFinite(p.a)) return q + (p.aIn ? "<strong>Yes:</strong> " + xs + " is a closed endpoint." : "<strong>No:</strong> " + xs + " is an open endpoint, so it’s left out.");
      if (x === p.b && isFinite(p.b)) return q + (p.bIn ? "<strong>Yes:</strong> " + xs + " is a closed endpoint." : "<strong>No:</strong> " + xs + " is an open endpoint, so it’s left out.");
      if (x > p.a && x < p.b) return q + "<strong>Yes:</strong> " + xs + " is inside " + pieceWord(i, ps.length) + ".";
    }
    return q + "<strong>No:</strong> " + xs + " is outside every piece.";
  }
  function paintReadout(){
    var ps = shown(), raw = setIv(), cap = $(".ib-cap");
    if (cap) cap.innerHTML = MV.m(MV.iv.text(ps));
    var rd = $(".ib-read"); if (!rd) return;
    var rows = [];
    rows.push(["Inequality", MV.m(MV.iv.ineq(ps))]);
    rows.push(["Set notation", MV.m(MV.iv.set(ps))]);
    var join = "";
    if (S.mode === "set" && raw.length > 1) {
      var sorted = raw.slice().sort(function(x, y){ return x.a - y.a; });
      for (var i = 0; i + 1 < sorted.length; i++) {
        var L = sorted[i], R = sorted[i + 1];
        if (R.a < L.b || (R.a === L.b && (L.bIn || R.aIn))) join = '<br><span class="tiny">These pieces join into one interval.</span>';
        else if (R.a === L.b) join = '<br><span class="tiny">The value ' + num(R.a) + " is left out between them.</span>";
      }
    }
    rows.push(["Interval notation", MV.m(MV.iv.text(ps)) + join]);
    var ends = [];
    ps.forEach(function(p){
      if (p.a === -Infinity) ends.push((ps.length > 1 ? "One piece" : "This piece") + " goes on forever to the left (∞ always takes a round bracket).");
      else ends.push(num(p.a) + (p.aIn ? " is included (closed dot, square bracket)." : " is left out (open dot, round bracket)."));
      if (p.b === Infinity) ends.push((ps.length > 1 ? "One piece" : "This piece") + " goes on forever to the right (∞ always takes a round bracket).");
      else if (p.b !== p.a) ends.push(num(p.b) + (p.bIn ? " is included (closed dot, square bracket)." : " is left out (open dot, round bracket)."));
    });
    rows.push(["Endpoints", ends.join(" ") || "none"]);
    var bounded = ps.filter(function(p){ return isFinite(p.a) && isFinite(p.b); });
    var size = !ps.length ? "Empty." : bounded.length === ps.length ? (ps.length === 1 ? num(ps[0].b - ps[0].a) + " units long" : bounded.map(function(p){ return num(p.b - p.a); }).join(" + ") + " = " + num(bounded.reduce(function(s, p){ return s + p.b - p.a; }, 0)) + " units in total")
      : bounded.length === 0 ? (ps.length > 1 ? "Both pieces go on forever." : "It goes on forever.") : "One piece goes on forever.";
    rows.push(["Size", size]);
    var ints;
    if (bounded.length !== ps.length) ints = "Infinitely many";
    else {
      var list = [];
      ps.forEach(function(p){ for (var k = Math.ceil(p.a); k <= Math.floor(p.b); k++) if (MV.iv.contains([p], k)) list.push(k); });
      ints = !list.length ? "None" : list.length <= 12 ? list.map(function(k){ return num(k); }).join(", ") + ": " + list.length + " integer" + (list.length > 1 ? "s" : "") : list.length + " integers";
    }
    rows.push(["Integers in the set", ints]);
    if (o.test) rows.push(["Test a number", testLine(ps)]);
    rd.innerHTML = MV.readoutHTML(rows);
  }
  function fire(){ if (o.onChange) o.onChange(api.get()); }
  function changed(silent){ MV.keepFocus(host, paintControls); paintReadout(); plot.render(); if (!silent) fire(); }
  var api = {
    plot:plot, drag:drag,
    get:function(){ return { pieces:S.pieces.map(function(p){ return Object.assign({}, p); }), mode:S.mode, half:S.half, testVal:S.testVal }; },
    set:function(st, silent){ load(st || {}); if (o.test) $("#" + uid + "-t").value = S.testVal; changed(silent); },
    iv:setIv, merged:merged, shown:shown,
    setMode:function(m){ S.mode = m; changed(); },
    marks:function(list){ extraMarks = list || []; plot.render(); },
    ring:function(r){ ringed = r; plot.render(); },
    // animate one endpoint to a value (∞ allowed): b.slide(0, "b", Infinity, done)
    slide:function(i, end, to, done){
      var p = S.pieces[i], from = end === "a" ? p.a : p.b, target = to === Infinity ? o.max : to === -Infinity ? o.min : to;
      MV.tween({ dur:900, step:function(t){ var v = from + (target - from) * t; if (end === "a") p.a = v; else p.b = v; changed(true); },
        done:function(){ if (to === Infinity) p.bInf = true; else if (to === -Infinity) p.aInf = true; else if (end === "a") p.a = to; else p.b = to; changed(); if (done) done(); } });
    },
    render:function(){ plot.render(); }
  };
  changed(true);
  return api;
};
})();
