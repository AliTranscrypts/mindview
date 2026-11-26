// MDM4U 07 Permutations of Distinct Objects: hero (runners hop onto a podium, 8!/5! cancels), Podium and seats (Explore:
// D3 counting slots + D4 arrangement tiles; Podium / Seats with a lock tool / List them all with group view / Repeats
// allowed), Permutations as equations (Part 3: expanded-form chips, consecutive-products ladder, algebra), Code designer task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function big(v){ return MV.mdm.fmt(v).replace(/ /g, " "); }        // 13 800 with a no-break space
function ordinal(n){ return n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"); }
function nPr(n, r){ var v = MV.mdm.nPr(n, r); return typeof v === "bigint" ? Number(v) : v; }
function M(s){ return MV.m(s); }
function times(list){ return list.join(" × "); }

// @component radioGroup (copied from MDM4U 02 / 01) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// @component D3 countingSlots — permutation version (adapted from MDM4U 02): a row of places to fill (ranked places,
// named roles or digit positions) that wraps after 5. Each place shows its badge, its "k choices" count (or "?" while a
// reveal is pending), the tile placed there and optional per-place controls; the place being counted is highlighted.
// D3.html(places, o) -> html.  places: [{name, badge, count, tile (html | ""), put (button attrs html | null), ctrl (html),
//   hi, lock, aria}]   o: {noPut (no tile area)}
var D3 = {
  html:function(places, o){
    o = o || {};
    var c = Math.min(5, Math.max(1, places.length));
    return '<div class="pm-slots" style="--pm-c:' + c + '">' + places.map(function(p, i){
      var cnt = p.count == null ? "?" : p.count;
      var x = '<div class="pm-slot' + (p.hi ? " hi" : "") + (p.lock ? " lk" : "") + '" role="group" aria-label="' + MV.esc(p.aria || (MV.plain(p.name) + ": " + (cnt === "?" ? "count hidden" : cnt + " choice" + (cnt === 1 ? "" : "s")))) + '">';
      x += '<span class="pm-badge">' + p.badge + "</span>";
      x += '<span class="pm-n" aria-hidden="true">' + cnt + '</span><span class="pm-cw" aria-hidden="true">' + (cnt === 1 ? "choice" : "choices") + "</span>";
      if (!o.noPut) x += p.put ? '<button type="button" class="pm-put"' + p.put + ">" + (p.tile || '<span class="pm-empty">empty</span>') + "</button>" : '<span class="pm-put" aria-hidden="true">' + (p.tile || '<span class="pm-empty"></span>') + "</span>";
      return x + (p.ctrl || "") + "</div>";
    }).join("") + "</div>";
  }
};

// @component D4 arrangementTiles — object tiles for counting arrangements (course plan D4): a pool of tiles (letters, names
// or digits) that can be tapped to select (aria-pressed) and are hatched once used; perms(n, r) lists every arrangement of
// r of n objects in dictionary order (small cases); listHTML() shows the list in one column per first object, every row a
// button, and highlights every row that uses the same set of objects (group view).
var D4 = {
  pool:function(items, o){
    o = o || {};
    return '<div class="pm-pool" role="group" aria-label="' + MV.esc(o.label || "Objects") + '">' + items.map(function(t, i){
      var used = o.used && o.used[i], cls = "pm-tile" + (used ? " used" : "") + (o.lockP === i ? " lkd" : "");
      if (o.buttons) return '<button type="button" class="' + cls + '" data-pm-p="' + i + '" data-k="pp' + i + '" aria-pressed="' + (o.sel === i) + '"' + (used ? ' aria-label="' + MV.esc(t + " (in use)") + '"' : "") + ">" + t + "</button>";
      return '<span class="' + cls + '">' + t + "</span>";
    }).join("") + "</div>";
  },
  perms:function(n, r){
    var out = [];
    (function rec(cur, used){
      if (cur.length === r) { out.push(cur.slice()); return; }
      for (var i = 0; i < n; i++) if (!used[i]) { used[i] = 1; cur.push(i); rec(cur, used); cur.pop(); used[i] = 0; }
    })([], {});
    return out;
  },
  key:function(row){ return row.slice().sort(function(a, b){ return a - b; }).join(","); },
  // rows: from perms(); names: tile text per object; o: {group: key | null, shown: number of rows revealed (null = all)}
  listHTML:function(rows, n, names, o){
    o = o || {};
    var cols = [], i; for (i = 0; i < n; i++) cols.push([]);
    rows.forEach(function(row, k){ cols[row[0]].push([row, k]); });
    return '<div class="pm-lwrap"><div class="pm-lgrid" style="--pm-lc:' + n + '">' + cols.map(function(col){
      return '<div class="pm-lcol">' + col.map(function(e){
        var row = e[0], k = e[1], txt = row.map(function(j){ return names[j]; }).join(""), shown = o.shown == null || k < o.shown, on = shown && o.group != null && D4.key(row) === o.group;
        return shown ? '<button type="button" class="pm-row' + (on ? " on" : "") + '" data-row="' + D4.key(row) + '" data-k="row' + k + '" aria-pressed="' + on + '">' + txt + "</button>" : '<span class="pm-row pend" aria-hidden="true">' + row.map(function(){ return "·"; }).join("") + "</span>";
      }).join("") + "</div>";
    }).join("") + "</div></div>";
  }
};

// ---------- the group ----------
var LETTERS = "ABCDEFGHIJ".split("");
var NAMES = ["Ana", "Bo", "Cy", "Dev", "Emi", "Femi", "Gia", "Hiro", "Isa", "Jun"];
var ROLES = ["President", "VP", "Treasurer", "Secretary", "Social rep", "Events lead", "Webmaster", "Historian", "Fundraiser", "Outreach lead"];
var MODES = [{ id:"podium", t:"Podium" }, { id:"seats", t:"Seats" }, { id:"list", t:"List them all" }, { id:"rep", t:"Repeats allowed" }];
var NOTE = {
  podium:"Ranked places: 1st, 2nd, 3rd, … A runner can win only one place.",
  seats:"Named roles in a club. Lock tool: tap a member, then tap a seat, or use a seat’s menu.",
  list:"Every permutation as a row (for " + M("n ≤ 5") + " and " + M("r ≤ 3") + "). Tap a row to highlight every row with the same people.",
  rep:"Digit codes where digits may repeat: every place keeps all " + M("n") + " choices."
};
var FILL = { podium:"Award the places one at a time", seats:"Fill the seats one at a time", rep:"Fill the digits one at a time", list:"Build the list again" };

// ---------- Explore: Podium and seats ----------
function explore(host, api){
  var S = api.S;
  if (!MODES.some(function(m){ return m.id === S.mode; })) S.mode = "podium";
  S.n = Math.max(2, Math.min(10, Math.round(+S.n) || 8));
  S.r = Math.max(1, Math.min(S.n, Math.round(+S.r) || 3));
  if (S.mode === "list") { S.n = Math.min(S.n, 5); S.r = Math.min(S.r, 3); }
  if (!S.lock || typeof S.lock !== "object" || !(S.lock.p >= 0 && S.lock.p < S.n) || !(S.lock.seat >= -1 && S.lock.seat < S.r)) S.lock = null;
  S.found = Array.isArray(S.found) ? S.found.filter(function(k){ return ["6,5", "6,6", "10,3"].indexOf(k) >= 0; }) : [];
  if (typeof S.group !== "string") S.group = null;
  var pv = {}, anim = null, sel = null, lockMsg = "", fills = 0;

  host.innerHTML =
    '<div class="pm-top"><div id="pm-modes"></div><p class="tiny muted pm-mnote" id="pm-mnote"></p></div>' +
    '<div class="pg pm-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap pm-cap" id="pm-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="pm-slots"></div><div id="pm-vs" hidden></div><div id="pm-poolw"></div><div id="pm-lockbar" class="pm-lockbar" hidden></div><div id="pm-list" hidden></div><div id="pm-fact" class="pm-fact" aria-live="polite"></div></div>' +
    '<div class="pg-ctrl"><div class="pm-sl" id="pm-sl"></div><div class="q-actions"><button type="button" class="btn primary sm" id="pm-fill" data-k="pmfill"></button></div></div>' +
    '<div class="pg-read"><dl class="read" id="pm-read" aria-live="polite"></dl></div></div>';

  var modeR = radios($("#pm-modes", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; sel = null; lockMsg = ""; if (v === "list") { S.n = Math.min(S.n, 5); S.r = Math.min(S.r, 3); } fixLock(); record(); save(); render(); MV.changed(); } });
  var sl = MV.sliders($("#pm-sl", host), [
    { id:"pmn", label:"Group size " + M("n"), min:2, max:10, step:1, value:S.n },
    { id:"pmr", label:"Places " + M("r"), min:1, max:10, step:1, value:S.r }
  ], function(id, v){
    user();
    if (id === "pmn") S.n = v; else S.r = v;
    clampR(); fixLock(); record(); save(); render(); MV.changed();
  });

  function save(){ api.save(); }
  function nMax(){ return S.mode === "list" ? 5 : 10; }
  function rMax(){ return Math.min(S.n, S.mode === "list" ? 3 : 10); }
  function clampR(){ S.n = Math.min(S.n, nMax()); S.r = Math.max(1, Math.min(S.r, rMax())); }
  function syncSliders(){
    var ni = $("#sl-pmn", host), ri = $("#sl-pmr", host);
    ni.max = nMax(); ri.max = rMax();
    sl.set("pmn", S.n); sl.set("pmr", S.r);
  }
  function lockOn(){ return S.mode === "seats" ? S.lock : null; }
  function fixLock(){ if (S.lock && (S.lock.p >= S.n || S.lock.seat >= S.r)) S.lock = null; if (sel != null && sel >= S.n) sel = null; }
  // TC3: record every pair with P(n, r) = 720 (permutation modes, no lock, r ≥ 2)
  function record(){
    if (S.mode === "rep" || lockOn() || S.r < 2 || nPr(S.n, S.r) !== 720) return;
    var k = S.n + "," + S.r; if (S.found.indexOf(k) < 0) S.found.push(k);
  }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping (predictions and the Fill button); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- the model: places in display order, each with its counting step k ---
  function tileText(i){ return S.mode === "seats" ? NAMES[i] : S.mode === "rep" ? String(i) : LETTERS[i]; }
  function badge(i){ return S.mode === "podium" ? ordinal(i + 1) : S.mode === "seats" ? ROLES[i] : S.mode === "rep" ? "Digit " + (i + 1) : "Place " + (i + 1); }
  function model(){
    var n = S.n, r = S.r, L = lockOn(), places = [], i;
    if (S.mode === "rep") for (i = 0; i < r; i++) places.push({ name:badge(i), count:n, k:i });
    else if (L && L.seat >= 0) {
      var c = n - 1, k = 1;
      for (i = 0; i < r; i++) places.push(i === L.seat ? { name:badge(i), count:1, k:0, lockP:L.p } : { name:badge(i), count:c--, k:k++ });
    } else if (L) {
      places.push({ name:NAMES[L.p] + "’s role", count:r, k:0, lockP:L.p, some:true });
      for (i = 1; i < r; i++) places.push({ name:"Another role", count:n - i, k:i });
    } else for (i = 0; i < r; i++) places.push({ name:badge(i), count:n - i, k:i });
    var byK = places.slice().sort(function(a, b){ return a.k - b.k; }), factors = byK.map(function(p){ return p.count; });
    return { places:places, byK:byK, factors:factors, product:factors.reduce(function(a, b){ return a * b; }, 1), L:L };
  }
  function count(){ return model().product; }

  // --- painting ---
  function render(){
    modeR.set(S.mode); syncSliders();
    $("#pm-mnote", host).innerHTML = NOTE[S.mode];
    $("#pm-fill", host).textContent = FILL[S.mode];
    var m = model(), list = S.mode === "list";
    paintSlots(m); paintPool(m); paintLockbar(m); paintVs(m);
    var lh = $("#pm-list", host); lh.hidden = !list; if (list) paintList(); else lh.innerHTML = "";
    paintFact(m); paintCap(m); paintRead(m);
  }
  function shownK(){ return pv.hide ? (pv.shown || 0) : Infinity; }
  function paintSlots(m){
    var seats = S.mode === "seats", fill = pv.fill || {}, sk = shownK();
    var places = m.places.map(function(p, i){
      var rev = p.k < sk, t = fill[i] != null && p.k < (pv.fillK == null ? Infinity : pv.fillK) ? fill[i] : (p.lockP != null ? p.lockP : null);
      var tile = t != null ? '<span class="pm-tile sm' + (p.lockP != null ? " lkd" : "") + '">' + tileText(t) + "</span>" + (p.some && pv.someSeat != null && p.k < (pv.fillK == null ? Infinity : pv.fillK) ? '<span class="pm-as">as ' + ROLES[pv.someSeat] + "</span>" : "") : "";
      var o = { name:p.name, badge:p.name, count:rev ? p.count : null, tile:tile, hi:pv.hi === i, lock:p.lockP != null };
      if (seats && !(m.L && m.L.seat < 0)) {
        var lk = p.lockP != null;
        o.put = ' data-pm-seat="' + i + '" data-k="ps' + i + '" aria-label="' + MV.esc(p.name + ": " + (lk ? NAMES[p.lockP] + " locked here. Tap to remove the lock." : sel != null ? "tap to lock " + NAMES[sel] + " here." : "no lock. Tap a member first, then tap here.")) + '"';
        o.ctrl = '<select class="pm-lsel" data-pm-lsel="' + i + '" data-k="pl' + i + '" aria-label="' + MV.esc(p.name + ": lock a person here") + '"><option value="">Lock a person here…</option>' +
          NAMES.slice(0, S.n).map(function(nm, j){ return '<option value="' + j + '"' + (lk && p.lockP === j ? " selected" : "") + ">" + nm + "</option>"; }).join("") + "</select>";
      }
      if (p.some) o.aria = p.name + ": " + (rev ? p.count + " choices of role" : "count hidden");
      return o;
    });
    var box = $("#pm-slots", host);
    MV.keepFocus(box, function(){ box.innerHTML = D3.html(places, { noPut:S.mode === "list" }); });
  }
  function usedTiles(m){
    var u = {}, fill = pv.fill || {}, fk = pv.fillK == null ? Infinity : pv.fillK;
    if (S.mode === "rep") return u;
    m.places.forEach(function(p, i){ if (p.lockP != null) u[p.lockP] = 1; if (fill[i] != null && p.k < fk) u[fill[i]] = 1; });
    return u;
  }
  function paintPool(m){
    var w = $("#pm-poolw", host);
    if (S.mode === "list") { w.innerHTML = ""; return; }
    var items = []; for (var i = 0; i < S.n; i++) items.push(tileText(i));
    var lab = S.mode === "podium" ? S.n + " runners" : S.mode === "seats" ? S.n + " club members" : "Digits 0–" + (S.n - 1);
    MV.keepFocus(w, function(){
      w.innerHTML = '<p class="pm-plab">' + lab + "</p>" + D4.pool(items, { label:lab, buttons:S.mode === "seats" && !(m.L && m.L.seat < 0), sel:sel, used:usedTiles(m), lockP:m.L ? m.L.p : null });
    });
  }
  function paintLockbar(m){
    var b = $("#pm-lockbar", host);
    b.hidden = S.mode !== "seats";
    if (b.hidden) { b.innerHTML = ""; return; }
    var L = m.L, h;
    if (sel != null) h = "<p><strong>" + NAMES[sel] + "</strong> selected. Tap a seat to lock " + NAMES[sel] + " there, or:</p>" +
      '<div class="q-actions"><button type="button" class="btn sm" id="pm-some" data-k="pmsome">' + NAMES[sel] + " somewhere in the slate</button>" +
      '<button type="button" class="btn ghost sm" id="pm-cancel" data-k="pmcancel">Cancel</button></div>';
    else if (L) h = "<p>Locked: <strong>" + NAMES[L.p] + "</strong> " + (L.seat >= 0 ? "as " + ROLES[L.seat] : "somewhere in the slate (any role)") + ".</p>" +
      '<div class="q-actions">' + (L.seat < 0 ? '<select class="pm-ssel" data-pm-ssel="1" data-k="pmssel" aria-label="' + MV.esc("Lock " + NAMES[L.p] + " in one role instead") + '"><option value="">Lock ' + NAMES[L.p] + " in one role instead…</option>" +
        ROLES.slice(0, S.r).map(function(rl, j){ return '<option value="' + j + '">' + rl + "</option>"; }).join("") + "</select>" : "") +
      '<button type="button" class="btn ghost sm" id="pm-unlock" data-k="pmunlock">Remove the lock</button></div>';
    else h = "<p>Lock tool: tap a member, then tap a seat, or use a seat’s menu.</p>";
    if (lockMsg) h += '<p class="tiny pm-lmsg">' + lockMsg + "</p>";
    MV.keepFocus(b, function(){ b.innerHTML = h; });
  }
  function paintVs(m){
    var v = $("#pm-vs", host), rep = S.mode === "rep";
    v.hidden = !rep; if (!rep) { v.innerHTML = ""; return; }
    var n = S.n, r = S.r, A = Math.pow(n, r), B = nPr(n, r), t = pv.vs, hide = pv.hide && t == null;
    var fa = [], fb = [], i; for (i = 0; i < r; i++) { fa.push(n); fb.push(n - i); }
    var a = hide ? "?" : big(t == null ? A : Math.round(A * t)), b = hide ? "?" : big(t == null ? B : Math.round(B * t));
    v.innerHTML = '<div class="pm-vs"><div class="pm-vsc"><span class="pm-vsl">Repeats allowed</span><span class="pm-vsf">' + (hide ? "?" : times(fa)) + '</span><b class="pm-vsn">' + a + "</b></div>" +
      '<div class="pm-vsc"><span class="pm-vsl">No repeats</span><span class="pm-vsf">' + (hide ? "?" : times(fb)) + '</span><b class="pm-vsn">' + b + "</b></div></div>";
  }
  function paintList(){
    var lh = $("#pm-list", host), rows = D4.perms(S.n, S.r);
    MV.keepFocus(lh, function(){ lh.innerHTML = D4.listHTML(rows, S.n, LETTERS, { group:S.group, shown:pv.listN == null ? null : pv.listN }); });
  }
  function factHTML(N, R, pre){
    var h = '<div class="pm-fg" style="--pm-fn:' + N + '" aria-hidden="true">', v;
    for (v = N; v >= 1; v--) h += '<span class="pm-ft' + (v <= N - R ? " x" : "") + '">' + v + "</span>";
    h += '<i class="pm-fbar"></i>';
    if (N - R >= 1) for (v = N - R; v >= 1; v--) h += '<span class="pm-ft x"' + (v === N - R ? ' style="grid-column-start:' + (R + 1) + '"' : "") + ">" + v + "</span>";
    else h += '<span class="pm-ft one" style="grid-column-start:' + N + '">1</span>';
    h += "</div>";
    var left = []; for (v = N; v > N - R; v--) left.push(v);
    var res = (pre ? pre + " × " : "") + (left.length ? times(left) : "1");
    return h + '<p class="pm-fres">' + (N - R === 0 ? M("0! = 1") + ", so nothing cancels: " : "The " + M((N - R) + "!") + " tail cancels: ") + res + " = <strong>" + big((pre || 1) * nPr(N, R)) + "</strong></p>";
  }
  function paintFact(m){
    var f = $("#pm-fact", host), n = S.n, r = S.r, L = m.L;
    f.classList.toggle("fresh", !!pv.fresh);
    if (pv.hide) { f.innerHTML = '<p class="pm-fl">' + (S.mode === "rep" ? M(n + "^" + r) : M("P(" + n + ", " + r + ")")) + " = ?</p>"; return; }
    if (S.mode === "rep") {
      f.innerHTML = '<p class="pm-fl">Repeats allowed: ' + M(n + "^" + r) + " = " + big(Math.pow(n, r)) + ". Every place keeps all " + n + " choices, so this isn’t a permutation. Without repeats it would be " + M("P(" + n + ", " + r + ")") + " = " + big(nPr(n, r)) + ".</p>";
      return;
    }
    var N = n, R = r, pre = 0, lab = "";
    if (L && L.seat >= 0) { N = n - 1; R = r - 1; pre = 1; lab = NAMES[L.p] + " is fixed as " + ROLES[L.seat] + ". Fill the other " + R + " role" + (R === 1 ? "" : "s") + " from the " + N + " others: "; }
    else if (L) { N = n - 1; R = r - 1; pre = r; lab = NAMES[L.p] + " takes one of the " + r + " roles. Fill the other " + R + " from the " + N + " others: "; }
    var head = lab + (pre ? pre + " × " : "") + M("P(" + N + ", " + R + ") = " + (pre ? "" : "") + "{" + N + "!}/{" + (N - R) + "!}");
    f.innerHTML = '<p class="pm-fl">' + head + "</p>" + factHTML(N, R, pre);
  }
  function capText(m){
    var f = m.factors, sk = shownK();
    if (pv.hide) { var k = Math.min(sk, f.length); return k ? times(f.slice(0, k)) + (k === f.length ? " = " + big(m.product) : " × …") : "?"; }
    return f.length > 1 ? times(f) + " = " + big(m.product) : big(m.product) + " choice" + (m.product === 1 ? "" : "s");
  }
  function paintCap(m){ var c = $("#pm-cap", host); c.textContent = capText(m); c.classList.toggle("long", m.factors.length > 5); }
  function paintRead(m){
    var hide = !!pv.hide, n = S.n, r = S.r, L = m.L, rows = [];
    rows.push(["Group size " + M("n"), String(n)]);
    rows.push(["Places " + M("r"), String(r)]);
    var per = m.places.map(function(p){ return (L ? p.name + " " : "") + (hide && p.k >= shownK() ? "?" : p.count) + (p.lockP != null && !p.some ? " (" + NAMES[p.lockP] + ")" : ""); });
    rows.push(["Choices per place", per.join(", ") + (S.mode === "rep" ? "" : L ? "" : ' <span class="muted">(shrinks by 1 each place)</span>')]);
    rows.push(["Count", hide ? "?" : "<strong>" + capText(m) + "</strong>" + (S.mode === "rep" ? " (repeats allowed)" : "")]);
    if (S.mode === "rep") rows.push(["Without repeats", hide ? "?" : M("P(" + n + ", " + r + ")") + " = " + big(nPr(n, r))]);
    else rows.push(["As factorials", hide ? "?" : (L ? (L.seat >= 0 ? "1" : r) + " × " + M("P(" + (n - 1) + ", " + (r - 1) + ") = {" + (n - 1) + "!}/{" + (n - r) + "!}") : M("P(" + n + ", " + r + ") = {" + n + "!}/{" + (n - r) + "!}"))]);
    if (S.mode !== "rep" && MV.S.preds && MV.S.preds.p2) rows.push(["If repeats were allowed", hide ? "?" : M(n + "^" + r) + " = " + big(Math.pow(n, r))]);
    if (S.mode === "list") {
      var g = S.group, rf = []; for (var i = 2; i <= r; i++) rf.push(i);
      rows.push(["Same people, different order", "each group of " + r + " appears " + M(r + "!") + " = " + nPr(r, r) + " time" + (r === 1 ? "" : "s") +
        (g && !hide ? '<br><span class="muted">Group {' + g.split(",").map(function(j){ return LETTERS[+j]; }).join(", ") + "}: " + D4.perms(n, r).filter(function(row){ return D4.key(row) === g; }).map(function(row){ return row.map(function(j){ return LETTERS[j]; }).join(""); }).join(", ") + "</span>" : "")]);
    }
    if (S.mode === "seats") rows.push(["Lock", L ? NAMES[L.p] + (L.seat >= 0 ? " as " + ROLES[L.seat] : " somewhere in the slate") : "none"]);
    rows.push([M("P(n, r) = 720") + " pairs recorded", S.found.length ? S.found.map(function(k){ return "(" + k.replace(",", ", ") + ")"; }).join(", ") : '<span class="muted">none yet</span>']);
    $("#pm-read", host).innerHTML = MV.readoutHTML(rows);
  }

  // --- the Fill button: places fill one at a time in counting order (a seeded, repeatable example) ---
  function fillAnim(done, after){
    newAnim(done); var m = model(), rnd = MV.mdm.seededRandom("pm07-" + (fills++)), used = {}, fill = {};
    pv = { hide:true, shown:0, fill:fill, fillK:0 };
    if (S.mode === "list") { listAnim(); return; }
    var steps = m.byK, k = 0;
    if (m.L && m.L.seat >= 0) used[m.L.p] = 1;
    render();
    (function step(){
      var p = steps[k], i = m.places.indexOf(p), t;
      if (p.lockP != null) { t = p.lockP; used[t] = 1; if (p.some) pv.someSeat = rnd.int(S.r); }
      else { var av = []; for (var j = 0; j < S.n; j++) if (S.mode === "rep" || !used[j]) av.push(j); t = av[rnd.int(av.length)]; if (S.mode !== "rep") used[t] = 1; }
      fill[i] = t; pv.hi = i; pv.shown = k + 1; pv.fillK = k + 1;
      render();
      k++;
      if (k < steps.length) later(MV.reduceMotion ? 0 : 750, step);
      else later(MV.reduceMotion ? 0 : 650, function(){
        if (after) { after(fill); return; }
        pv = { fill:fill, fillK:Infinity, fresh:true, someSeat:pv.someSeat }; render(); MV.changed();
        later(MV.reduceMotion ? 0 : 400, endAnim);
      });
    })();
  }
  function listAnim(){
    var N = nPr(S.n, S.r);
    pv = { listN:0 }; render();
    (function tick(){ pv.listN++; paintList(); if (pv.listN < N) later(MV.reduceMotion ? 0 : 110, tick); else later(200, function(){ pv = {}; render(); MV.changed(); endAnim(); }); })();
  }
  function vsAnim(){
    pv.vs = 0; paintVs(model());
    var stop = MV.tween({ dur:1100, step:function(t){ pv.vs = t; paintVs(model()); }, done:function(){ pv = { fresh:true }; render(); MV.changed(); later(300, endAnim); } });
    if (anim) anim.stops.push(stop);
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "pm-fill") { MV.banner("", ""); fillAnim(null); return; }
    if (b.dataset.pmP != null) { user(); var p = +b.dataset.pmP; sel = sel === p ? null : p; lockMsg = ""; render(); return; }
    if (b.dataset.pmSeat != null) {
      user(); var s = +b.dataset.pmSeat;
      if (sel != null) { S.lock = { p:sel, seat:s }; sel = null; lockMsg = ""; }
      else if (S.lock && S.lock.seat === s) { S.lock = null; lockMsg = ""; }
      else lockMsg = "Tap a member first, then tap a seat.";
      record(); save(); render(); MV.changed(); return;
    }
    if (b.id === "pm-some") { user(); if (sel != null) { S.lock = { p:sel, seat:-1 }; sel = null; lockMsg = ""; save(); render(); MV.changed(); } return; }
    if (b.id === "pm-cancel") { user(); sel = null; lockMsg = ""; render(); return; }
    if (b.id === "pm-unlock") { user(); S.lock = null; lockMsg = ""; record(); save(); render(); MV.changed(); return; }
    if (b.dataset.row != null) { user(); S.group = S.group === b.dataset.row ? null : b.dataset.row; save(); render(); return; }
  });
  host.addEventListener("change", function(e){
    var t = e.target; if (!t.dataset) return;
    if (t.dataset.pmSsel != null) { if (t.value === "" || !S.lock) return; user(); S.lock = { p:S.lock.p, seat:+t.value }; sel = null; lockMsg = ""; save(); render(); MV.changed(); return; }
    if (t.dataset.pmLsel == null) return;
    user(); var s = +t.dataset.pmLsel;
    if (t.value === "") { if (S.lock && S.lock.seat === s) S.lock = null; }
    else S.lock = { p:+t.value, seat:s };
    sel = null; lockMsg = ""; record(); save(); render(); MV.changed();
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.mode = s.mode; S.n = s.n; S.r = s.r; S.group = null; sel = null; lockMsg = "";
    if (S.mode === "seats") S.lock = null;
    pv = s.mode === "list" ? { listN:0 } : { hide:true, shown:0 };
    save(); render();
  }
  function runPred(p, done){
    if (p.id === "p4") {
      newAnim(done); pv = { listN:0 }; render();
      var N = nPr(S.n, S.r);
      (function tick(){ pv.listN++; paintList(); if (pv.listN < N) later(MV.reduceMotion ? 0 : 140, tick); else later(MV.reduceMotion ? 0 : 450, function(){ pv = {}; S.group = "0,1"; save(); render(); MV.changed(); later(MV.reduceMotion ? 0 : 500, endAnim); }); })();
      return;
    }
    if (p.id === "p2") {
      // the digit slots reveal 5, 5, 5; then the two counters race side by side
      fillAnim(done, function(fill){ pv = { fill:fill, fillK:Infinity, vs:0 }; render(); vsAnim(); });
      return;
    }
    fillAnim(done);
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var c = count(), L = lockOn(), pr = function(n, r){ return M("P(" + n + ", " + r + ")") + " = " + big(nPr(n, r)); };
    if (id === "tc1") {
      if (S.mode === "rep") return { ok:false, msg:"Repeats mode counts " + M("n^r") + ". Switch to Podium or Seats: a permutation has no repeats." };
      if (L) return { ok:false, msg:"Remove the lock first: this challenge counts every arrangement." };
      if (S.n === 5 && S.r === 3) return { ok:true };
      if (S.n === 5 && S.r === 2) return { ok:false, msg:pr(5, 2) + ". Add a place." };
      if (S.n === 4 && S.r === 3) return { ok:false, msg:pr(4, 3) + ". Add a person." };
      if (S.n === 6 && S.r === 3) return { ok:false, msg:pr(6, 3) + ". One person too many." };
      return { ok:false, msg:"Your count is " + big(c) + ", not 60." };
    }
    if (id === "tc2") {
      if (S.mode !== "seats") return { ok:false, msg:"Switch to Seats mode first." };
      if (S.n !== 7) return { ok:false, msg:"Set " + M("n") + " to 7 club members." };
      if (S.r !== 3) return { ok:false, msg:"Set " + M("r") + " to 3 roles: President, VP and Treasurer." };
      if (!L) return { ok:false, msg:"Your count is " + big(c) + ". Lock Ana in the President seat." };
      if (L.p !== 0) return { ok:false, msg:"That locks " + NAMES[L.p] + ". Lock Ana as President." };
      if (L.seat < 0) return { ok:false, msg:"Your count is " + big(c) + ". That allows Ana in any role. Lock her as President." };
      if (L.seat !== 0) return { ok:false, msg:"Ana is locked as " + ROLES[L.seat] + ". Lock her as President." };
      return c === 30 ? { ok:true } : { ok:false, msg:"Your count is " + big(c) + "." };
    }
    if (id === "tc3") {
      var f = S.found, has = function(k){ return f.indexOf(k) >= 0; };
      if (has("6,5") && has("6,6") && has("10,3")) return { ok:true };
      if (S.n === 9 && S.r === 3 && S.mode !== "rep") return { ok:false, msg:pr(9, 3) + ". Close: try a larger " + M("n") + " with 3 places." };
      if (!f.length) return { ok:false, msg:"No pairs recorded yet. Set " + M("n") + " and " + M("r") + " so the count is 720 (no repeats, no lock)." };
      if (f.length === 1 && has("6,6")) return { ok:false, msg:"720 = " + M("6!") + ". Is there another " + M("r") + " with the same product?" };
      if (f.length === 1 && has("6,5")) return { ok:false, msg:M("P(6, 5) = 6!/1!") + ". Is there another " + M("r") + " with the same product?" };
      if (!has("10,3")) return { ok:false, msg:"Both 6-person pairs found. 720 is also a product of three consecutive numbers." };
      return { ok:false, msg:"You’ve found " + f.length + " of the pairs. 720 = " + M("6!") + ": look at " + M("n = 6") + " too." };
    }
    return { ok:false };
  }
}

// ---------- hero: runners line up, three podium steps light, runners hop up; 8!/5! cancels ----------
function hero(f){
  var svg = $("#pm-hsvg"), prod = $("#pm-hprod"), fact = $("#pm-hfact"), cap = f.cap;
  if (!svg) return;
  var RX = [], i; for (i = 0; i < 8; i++) RX.push(40 + i * 40);
  var RY = 26, BASE = 182;
  var STEPS = [{ lab:"1st", x:150, top:110, who:2, ch:8 }, { lab:"2nd", x:90, top:130, who:5, ch:7 }, { lab:"3rd", x:210, top:148, who:0, ch:6 }];
  var pos = RX.map(function(x){ return { x:x, y:RY }; }), lit = -1, landed = 0;
  var r1 = function(v){ return Math.round(v * 10) / 10; };
  function draw(){
    var h = '<line class="pm-hg" x1="20" y1="' + BASE + '" x2="340" y2="' + BASE + '"/>';
    STEPS.forEach(function(s, k){
      var cls = k === lit ? " on" : k < lit ? " was" : "";
      h += '<rect class="pm-hstep' + cls + '" x="' + s.x + '" y="' + s.top + '" width="60" height="' + (BASE - s.top) + '" rx="3"/>';
      h += '<text class="pm-hlab" x="' + (s.x + 30) + '" y="' + (s.top + 22) + '">' + s.lab + "</text>";
      if (k <= lit) h += '<text class="pm-hch" x="' + (s.x + 30) + '" y="' + (s.top - 36) + '">' + s.ch + " choices</text>";
    });
    for (var k = 0; k < landed; k++) h += '<circle class="pm-hgap" cx="' + RX[STEPS[k].who] + '" cy="' + RY + '" r="13"/>';
    pos.forEach(function(p, j){ h += '<g class="pm-hr' + (STEPS.some(function(s, k){ return s.who === j && k < landed; }) ? " up" : "") + '"><circle cx="' + r1(p.x) + '" cy="' + r1(p.y) + '" r="13"/><text x="' + r1(p.x) + '" y="' + r1(p.y + 4.5) + '">' + "ABCDEFGH"[j] + "</text></g>"; });
    svg.innerHTML = h;
  }
  function prodText(k){ var f = [8, 7, 6].slice(0, k); prod.textContent = f.length ? f.join(" × ") + (k === 3 ? " = 336" : "") : ""; }
  function factHTML(){
    var h = '<div class="pm-hfg">';
    for (var v = 8; v >= 1; v--) h += '<span class="pm-hft' + (v <= 5 ? " t" : "") + '">' + v + "</span>";
    h += '<i class="pm-hbar"></i>';
    for (v = 5; v >= 1; v--) h += '<span class="pm-hft t"' + (v === 5 ? ' style="grid-column-start:4"' : "") + ">" + v + "</span>";
    return '<span class="pm-hfl">' + M("{8!}/{5!}") + " =</span>" + h + '</div><span class="pm-hfr">= 8 × 7 × 6</span>';
  }
  function last(){ lit = 3; landed = 3; STEPS.forEach(function(s){ pos[s.who] = { x:s.x + 30, y:s.top - 15 }; }); draw(); prodText(3); fact.innerHTML = factHTML(); fact.classList.add("on", "gone"); cap.textContent = "8!/5!: the 5! tail cancels, leaving 8 × 7 × 6 = 336"; }
  if (MV.reduceMotion) { last(); return; }
  draw(); cap.textContent = "8 runners line up";
  function hop(k, done){
    var s = STEPS[k], j = s.who, x0 = RX[j], y0 = RY, x1 = s.x + 30, y1 = s.top - 15;
    MV.tween({ dur:650, step:function(t){ pos[j] = { x:x0 + (x1 - x0) * t, y:y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 34 }; draw(); }, done:function(){ landed = k + 1; draw(); prodText(k + 1); done(); } });
  }
  var NAMEK = ["Gold", "Silver", "Bronze"], LEFT = ["", " left", " left"];
  function stage(k){
    lit = k; draw(); cap.textContent = NAMEK[k] + ": " + STEPS[k].ch + " choices" + LEFT[k];
    MV.wait(500, function(){ hop(k, function(){ MV.wait(650, function(){ if (k < 2) stage(k + 1); else finale(); }); }); });
  }
  function finale(){
    lit = 3; draw(); cap.textContent = "8 × 7 × 6 = 336";
    MV.wait(900, function(){ fact.innerHTML = factHTML(); fact.classList.add("on"); cap.textContent = "8! over 5!";
      MV.wait(1300, function(){ fact.classList.add("gone"); cap.textContent = "8!/5!: the 5! tail cancels, leaving 8 × 7 × 6 = 336"; }); });
  }
  MV.wait(700, function(){ stage(0); });
}

// ---------- Part 3: Permutations as equations (expanded form, consecutive-products ladder, algebra) ----------
// @component productLadder — consecutive-products ladder: rungs n(n − 1) (two factors), paired rungs P(n, 2) and P(n, 3)
// (three-factor ladder beside the two-factor one), or running products 7, 7 × 6, … for P(7, r); every rung is a button.
var LAD = {
  two:function(){ var o = []; for (var n = 2; n <= 12; n++) o.push({ v:n, val:n * (n - 1), html:"<b>" + n * (n - 1) + "</b><small>" + n + " × " + (n - 1) + "</small>", aria:n + " times " + (n - 1) + " equals " + n * (n - 1) }); return o; },
  pair:function(){ var o = []; for (var n = 3; n <= 12; n++) { var a = nPr(n, 2), b = nPr(n, 3); o.push({ v:n, val:b, two:a, html:'<span class="pq-c">' + M("n = " + n) + '</span><span class="pq-c"><b>' + a + "</b><small>" + n + " × " + (n - 1) + '</small></span><span class="pq-c"><b>' + big(b) + "</b><small>" + n + " × " + (n - 1) + " × " + (n - 2) + "</small></span>", aria:"n = " + n + ": P(n, 2) = " + a + ", P(n, 3) = " + b }); } return o; },
  seven:function(){ var o = [], f = []; for (var r = 1; r <= 7; r++) { f.push(8 - r); var v = nPr(7, r); o.push({ v:r, val:v, html:'<span class="pq-c">' + M("r = " + r) + '</span><span class="pq-c"><b>' + big(v) + "</b><small>" + f.join(" × ") + "</small></span>", aria:"r = " + r + ": " + f.join(" times ") + " = " + v }); } return o; }
};
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  S.st = S.st && typeof S.st === "object" ? S.st : {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  var msgs = {};
  host.innerHTML = '<div id="pq-tabs" class="pq-tabs"></div><div id="pq-body" class="pq-body" aria-live="polite"></div>';
  function sst(id){ return S.st[id] || (S.st[id] = { a1:null, ok1:false, rung:null, ok2:false, a3:null, ok3:false }); }
  function done(s){ var x = sst(s.id); return x.ok2 && (!s.roots || x.ok3); }
  var tabOpts = ST.map(function(s, i){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "S" + (i + 1) + ": " + s.eq + (done(s) ? ' <span class="pq-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#pq-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function roots(s){ return s.roots ? MV.shuffle(s.roots.map(function(r, i){ return i; }), "pq" + s.id).map(function(i){ return { i:i, o:s.roots[i] }; }) : []; }
  function ladderAsk(s){
    if (s.ladder === "pair") return "Tap the row where " + M("P(n, 3)") + " is " + s.mult + " times " + M("P(n, 2)") + ".";
    if (s.ladder === "seven") return "Tap the rung equal to " + s.target + ".";
    return "Tap the rung equal to " + s.target + ".";
  }
  function rungFb(s, rg){
    var ans = MV.ans(s);
    if (s.ladder === "two") return rg.val === s.target ? "<strong>✓ " + M("n(n - 1) = " + s.target) + " when " + M("n = " + ans) + ":</strong> " + ans + " × " + (ans - 1) + " = " + s.target + "."
      : "<strong>✗ Not that rung.</strong> " + M("P(" + rg.v + ", 2)") + " = " + rg.val + ", not " + s.target + ". " + (rg.val < s.target ? "Climb higher." : "Go lower.");
    if (s.ladder === "pair") return rg.val === s.mult * rg.two ? "<strong>✓ " + M("n = " + ans) + ":</strong> " + M("P(" + ans + ", 3)") + " = " + big(rg.val) + " = " + s.mult + " × " + rg.two + "."
      : "<strong>✗ Not that row.</strong> " + M("P(" + rg.v + ", 3)") + " = " + big(rg.val) + " = " + (rg.v - 2) + " × " + rg.two + ". You need " + s.mult + " times.";
    return rg.val === s.target ? "<strong>✓ " + times([7, 6, 5]) + " = 210:</strong> three factors, so " + M("r = 3") + "."
      : "<strong>✗ Not that rung.</strong> " + M("P(7, " + rg.v + ")") + " = " + big(rg.val) + ", not " + s.target + ".";
  }
  function paint(){
    tabText(); tabs.refresh();
    var s = ST.filter(function(x){ return x.id === S.cur; })[0], x = sst(s.id), body = $("#pq-body", host), ans = MV.ans(s);
    var dOld = $("details.alg", body), algOpen = dOld ? dOld.open : true;
    var h = '<div class="pq-card"><span class="pq-lab">Station ' + (ST.indexOf(s) + 1) + '</span><span class="pq-eq">' + s.eq + "</span></div>";
    h += '<div class="sym pq-sym"><div>';
    h += '<h4 class="pq-h">Step 1. Expand it</h4><p class="pq-ask">' + (s.ask || "Which expression matches?") + '</p><div class="pq-chips" role="group" aria-label="Expanded forms">' +
      s.options.map(function(o, i){ var on = x.a1 === i; return '<button type="button" class="chip pq-chip' + (on ? " on" : "") + (on && x.ok1 ? " right" : "") + '" data-pq1="' + i + '" data-k="pq1' + i + '" aria-pressed="' + on + '"' + (x.ok1 ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (x.a1 != null) { var o1 = s.options[x.a1]; h += MV.fbHTML(x.ok1 ? "good" : "bad", (x.ok1 ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + (o1.why || "") + (x.ok1 ? "" : " Try another.")); }
    if (x.ok2) {
      h += '<h4 class="pq-h">Step 3. Confirm it</h4><details class="alg"' + (algOpen ? " open" : "") + '><summary>Check it with algebra</summary><div class="alg-lines">' + s.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("") + "</div></details>";
      if (s.roots) {
        h += '<p class="pq-ask">Which root do you keep?</p><div class="pq-chips" role="group" aria-label="Roots">' + roots(s).map(function(e){ var on = x.a3 === e.i; return '<button type="button" class="chip pq-chip' + (on ? " on" : "") + '" data-pq3="' + e.i + '" data-k="pq3' + e.i + '" aria-pressed="' + on + '"' + (x.ok3 ? " disabled" : "") + ">" + e.o.t + "</button>"; }).join("") + "</div>";
        if (x.a3 != null) { var o3 = s.roots[x.a3]; h += MV.fbHTML(x.ok3 ? "good" : "bad", (x.ok3 ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + (o3.why || "") + (x.ok3 ? "" : " Try again.")); }
      }
      if (done(s)) h += '<p class="pq-done"><strong>✓ Station ' + (ST.indexOf(s) + 1) + " complete: " + M(s.unknown + " = " + ans) + ".</strong>" + (ST.every(done) ? " All four stations done. Try the quick check below." : " Choose another station above.") + "</p>";
    }
    h += '</div><div><h4 class="pq-h">Step 2. Find it on the ladder</h4>';
    if (!x.ok1) h += '<p class="muted pq-ask">The ladder opens after step 1.</p>';
    else {
      var rungs = LAD[s.ladder]();
      h += '<p class="pq-ask">' + ladderAsk(s) + "</p>";
      if (s.ladder === "pair") h += '<div class="pq-hdr" aria-hidden="true"><span class="pq-c"></span><span class="pq-c">' + M("P(n, 2)") + '</span><span class="pq-c">' + M("P(n, 3)") + "</span></div>";
      h += '<div class="pq-ladder ' + s.ladder + '" role="group" aria-label="Consecutive-products ladder">' + rungs.map(function(rg){
        var on = x.rung === rg.v, good = on && x.ok2;
        return '<button type="button" class="pq-rung' + (on ? (good ? " right" : " wrong") : "") + '" data-pq2="' + rg.v + '" data-k="pq2' + rg.v + '" aria-label="' + MV.esc(rg.aria) + '" aria-pressed="' + on + '"' + (x.ok2 ? " disabled" : "") + ">" + rg.html + "</button>";
      }).join("") + "</div>";
      if (x.rung != null) { var rg0 = rungs.filter(function(q){ return q.v === x.rung; })[0]; if (rg0) h += MV.fbHTML(x.ok2 ? "good" : "bad", rungFb(s, rg0)); }
    }
    h += "</div></div>";
    MV.keepFocus(body, function(){ body.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#pq-body", host).contains(b)) return;
    var s = ST.filter(function(q){ return q.id === S.cur; })[0], x = sst(s.id), ans = MV.ans(s), box = $("#pq-body", host);
    if (b.dataset.pq1 != null) { x.a1 = +b.dataset.pq1; x.ok1 = MV.ok(s.options[x.a1]); }
    else if (b.dataset.pq2 != null) {
      x.rung = +b.dataset.pq2;
      var rg = LAD[s.ladder]().filter(function(q){ return q.v === x.rung; })[0];
      x.ok2 = s.ladder === "pair" ? rg.val === s.mult * rg.two : rg.val === s.target;
      if (x.ok2 && x.rung !== ans) x.ok2 = false;
    }
    else if (b.dataset.pq3 != null) { x.a3 = +b.dataset.pq3; x.ok3 = MV.ok(s.roots[x.a3]); }
    else return;
    api.save(); paint(); MV.focusFb(box);
  });
  paint();
  return {};
}

// ---------- Performance task: Code designer ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { n:s.n == null ? 6 : s.n, r:s.r == null ? 2 : s.r }; }
  function fac(d){ var f = []; for (var i = 0; i < d.r; i++) f.push(d.n - i); return f; }
  function paint(){
    var d = read(), f = fac(d), c = nPr(d.n, d.r);
    $("#cd-n").textContent = d.n; $("#cd-r").textContent = d.r;
    $('[data-cd="n"][data-d="-1"]').disabled = d.n <= 2; $('[data-cd="n"][data-d="1"]').disabled = d.n >= 12;
    $('[data-cd="r"][data-d="-1"]').disabled = d.r <= 1; $('[data-cd="r"][data-d="1"]').disabled = d.r >= Math.min(6, d.n);
    $("#cd-strip").innerHTML = f.map(function(v, i){ return '<span class="cd-cell"><small>symbol ' + (i + 1) + "</small><b>" + v + "</b></span>"; }).join("");
    $("#cd-prod").innerHTML = M("P(" + d.n + ", " + d.r + ")") + " = " + (f.length > 1 ? times(f) + " = " : "") + "<strong>" + big(c) + "</strong>";
    $("#cd-sum").textContent = d.n + " symbols, codes " + d.r + " long, no repeats: " + big(c) + " possible code" + (c === 1 ? "" : "s");
  }
  function keyText(k){ var p = k.split(","); return "P(" + p[0] + ", " + p[1] + ") = " + big(nPr(+p[0], +p[1])); }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.n == null) a.S.n = 6; if (a.S.r == null) a.S.r = 2;
      var row = function(id, lab, aria){ return '<div class="cd-row" role="group" aria-label="' + aria + '"><span class="cd-lab">' + lab + '</span><button type="button" class="btn ghost sm cd-b" data-cd="' + id + '" data-d="-1" aria-label="' + aria + ': fewer">−</button><output class="cd-out" id="cd-' + id + '" aria-live="polite"></output><button type="button" class="btn ghost sm cd-b" data-cd="' + id + '" data-d="1" aria-label="' + aria + ': more">+</button></div>'; };
      inp.innerHTML = '<div class="cd-in">' + row("n", "Symbols available " + M("n"), "Symbols available") + row("r", "Code length " + M("r"), "Code length") +
        '<p class="tiny muted">' + M("n") + " from 2 to 12; " + M("r") + " from 1 to 6, at most " + M("n") + ". No symbol repeats in a code.</p></div>";
      pv.innerHTML = '<div class="cd-pv"><p class="tiny muted" style="margin:0 0 4px">Your code system</p><div class="cd-strip" id="cd-strip" aria-hidden="true"></div><p class="cd-prod" id="cd-prod" aria-live="polite"></p><p class="tiny muted" id="cd-sum"></p></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-cd]"); if (!b || b.disabled) return;
        var id = b.dataset.cd, s = a.S;
        if (id === "n") { s.n = Math.max(2, Math.min(12, s.n + +b.dataset.d)); s.r = Math.min(s.r, s.n); }
        else s.r = Math.max(1, Math.min(Math.min(6, s.n), s.r + +b.dataset.d));
        a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = nPr(d.n, d.r); return [c >= 1000, c <= 3000, d.r >= 3]; },
    key:function(d){ return d.n + "," + d.r; },
    label:function(k){ return M(keyText(k).replace(/ /g, " ")); },
    text:function(k){ return keyText(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
