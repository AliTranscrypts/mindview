// MHF4U 36 Chapter 5 Summary & Review: the plan's content as data (plan modules/36-chapter-5-review.md).
// Review module: Start (goals + diagnostic), Connect (four forms, four waves), Mixed practice, Reflect, Final Check.

// M-table core sentences (plan section 3), used where the plan tags an option with the misconception.
const M1 = "`k` squeezes 2π: the period is `2π/|k|`.";
const M2 = "Factor out `k`: `sin[2(x - π/6)]` shifts `π/6`.";
const M3 = "Amplitude = (max − min)/2; axis `y = (max + min)/2`.";
const M4 = "A horizontal line meets the wave twice per period: use the related angle too.";
const M5 = "Factor instead: `sin x(2 sin x - 1) = 0` keeps `sin x = 0`.";
const M6 = "Shift a sine by a quarter period and it becomes a cosine; check one max and the period.";
const M7 = "`csc x = 1/sin x`: asymptotes where `sin x = 0`.";
const M8 = "A cosine with `a > 0` starts at a maximum; −cos starts at a minimum.";

export default {
  id:"36-chapter-5-review",
  kind:"review",
  title:"Chapter 5 summary and review",
  topic:"Chapter 5 Summary & Review",
  hero:{
    eq:"`y = @a{a} sin[@k{k}(x - @d{d})] + @c{c}`", eqLabel:"y equals a sine of k times the quantity x minus d, plus c", eqSize:"md",
    headline:"One wave, four ways to say it",
    text:"A tide, a Ferris wheel and a sound are all waves. You can draw one, write its equation, list its values, or describe it in words. Amplitude, period, phase shift and axis connect all four, and the unit circle is where every wave comes from.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ shape:"wide",
      aria:"Graph of y = 3 sin(πt/6) + 1 for t from 0 to 12, with amplitude 3, period 12 and axis y = 1 marked. A dashed cosine, y = 3 cos[π/6(t − 3)] + 1, lies exactly on it. The line y = 2.5 meets the wave at t = 1 and t = 5. The axes are labelled time (h) and water level (m).",
      steps:[
        { cap:"A point on the unit circle unwraps into `y = sin x` · module 31" },
        { cap:"`@a{a} = 3`, period `2π ÷ @k{π/6} = 12`, axis `y = @c{1}`: `y = 3 sin(πt/6) + 1` · module 32" },
        { cap:"A cosine slides `@d{d} = 3` onto it: same wave, another equation · module 33" },
        { cap:"The line `y = 2.5` meets it twice, at `t = 1` and `t = 5` · module 34" },
        { cap:"The axes become time (h) and water level (m) · module 35" }] }
  },
  goals:[
    "I can sketch and describe the six trig functions in radians, including periods, zeros, asymptotes and ranges.",
    "I can state the amplitude, period, phase shift and axis of a transformed sinusoid and sketch it.",
    "I can write an equation for a sinusoid from its graph or features, in more than one correct way.",
    "I can solve linear and quadratic trig equations on `0 ≤ x ≤ 2π`.",
    "I can model periodic situations and interpret the parameters and rates in context.",
    "I can move between a wave’s graph, equation, table and description."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "31":{ idea:"The graphs unwrap the unit circle; csc, sec, cot have asymptotes where sin, cos, tan are 0 and stay put where they’re ±1.",
      look:"Unwrap the circle (Explore); Build the reciprocal graphs (Reciprocals)" },
    "32":{ idea:"Amplitude `|a|`, period `2π/|k|`, phase shift `d` (after factoring), axis `y = c`.",
      look:"Wave tuner: four numbers, four brackets (Explore); Period and phase detective (Detective)" },
    "33":{ idea:"Amplitude and axis from max and min; period from max to max; choose sine or cosine and the matching `d`. Many equations can be right.",
      look:"Read the wave (Explore); Many right answers (Rewrite)" },
    "34":{ idea:"Isolate the trig function (or factor), find the reference angle, use CAST for every solution in `[0, 2π]`.",
      look:"Line meets wave (Explore); Quadratic equations and identities (Quadratics)" },
    "35":{ idea:"Read amplitude, axis, period and start from the situation; interpret each parameter with units.",
      look:"Ferris wheel lab (Explore); Real data: tides and daylight (Real data)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Eight questions, one or two from each Chapter 5 module. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"31", goal:1,
          prompt:"Which of these functions has vertical asymptotes at `x = 0`, π and 2π?",
          options:[
            { t:"`csc x`", ok:true, why:"`csc x = 1/sin x`, undefined where `sin x = 0`." },
            { t:"`sec x`", why:"`sec x` is undefined where `cos x = 0`: `π/2`, `3π/2`. " + M7 },
            { t:"`tan x`", why:"`tan x` has asymptotes at `π/2` and `3π/2`." },
            { t:"`cos x`", why:"Cosine has no asymptotes." }],
          hints:["Asymptotes come from dividing by 0.", "Which function divides by `sin x`?", "`csc x`."] },
        { id:"d2", topic:"31", goal:1,
          prompt:"Which set is the range of `y = sec x`?",
          options:[
            { t:"`(-∞, -1] ∪ [1, ∞)`", ok:true, why:"`|cos x| ≤ 1`, so `|1/cos x| ≥ 1`." },
            { t:"`[-1, 1]`", why:"That’s the range of `cos x`." },
            { t:"`(-∞, ∞)`", why:"`sec x` never takes values between −1 and 1." },
            { t:"`(-1, 1)`", why:"Those are exactly the values `sec x` can’t take." }],
          hints:["`sec = 1/cos`.", "What happens to `1/c` when `|c| ≤ 1`?", "`|sec x| ≥ 1`."] },
        { id:"d3", topic:"32", goal:2, fixedOrder:true,   // values in increasing order
          prompt:"What is the period of `y = 3 sin[4(x - π/6)] + 2`?",
          options:[
            { t:"`π/6`", why:"That’s the phase shift." },
            { t:"`π/2`", ok:true, why:"`2π/4`." },
            { t:"4", why:"That’s `k`. " + M1 },
            { t:"`8π`", why:"That multiplies by 4." }],
          hints:["Period = `2π/|k|`.", "`k = 4`.", "`π/2`."] },
        { id:"d4", topic:"32", goal:2,
          prompt:"What are the maximum and minimum values of `y = -2 cos x + 5`?",
          options:[
            { t:"Maximum 7, minimum 3", ok:true, why:"Axis 5, amplitude 2." },
            { t:"Maximum 5, minimum −2", why:"5 is the axis; −2 is `a`." },
            { t:"Maximum 3, minimum 7", why:"The maximum is the larger: 5 + 2." },
            { t:"Maximum 7, minimum −3", why:"5 − 2 = 3." }],
          hints:["Axis `c = 5`, amplitude `|a| = 2`.", "5 ± 2.", "7 and 3."] },
        { id:"d5", topic:"33", goal:3,
          prompt:"A sinusoid has a maximum at `(π/4, 6)` and the next minimum at `(3π/4, -2)`. Which equation fits?",
          options:[
            { t:"`y = 4 cos[2(x - π/4)] + 2`", ok:true, why:"Amplitude (6 − (−2))/2 = 4; axis 2; half a period is `π/2`, so the period is π and `k = 2`; cosine with `a > 0` has its max at `d = π/4`." },
            { t:"`y = 4 cos[2(x - π/4)] + 6`", why:"6 is the maximum, not the axis." },
            { t:"`y = 8 cos[2(x - π/4)] + 2`", why:"8 is max − min; the amplitude is half that. " + M3 },
            { t:"`y = 4 cos[{1}/{2}(x - π/4)] + 2`", why:"Period π gives `k = 2π/π = 2`. " + M1 }],
          hints:["Max and min give amplitude and axis.", "Max to min is half a period.", "`y = 4 cos[2(x - π/4)] + 2`."] },
        { id:"d6", topic:"34", goal:4,
          prompt:"Solve `2 sin x - 1 = 0` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`x = π/6` or `5π/6`", ok:true, why:"`sin x = 1/2` in quadrants 1 and 2." },
            { t:"`x = π/6` only", why:"Sine is also `1/2` in quadrant 2. " + M4 },
            { t:"`x = π/3` or `2π/3`", why:"That’s `sin x = √3/2`." },
            { t:"`x = π/6` or `7π/6`", why:"Sine is negative at `7π/6`." }],
          hints:["Isolate `sin x`.", "`sin x = 1/2`.", "`π/6` and `5π/6`."] },
        { id:"d7", topic:"34", goal:4,
          prompt:"Solve `2 cos^2 x - cos x - 1 = 0` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`x = 0`, `2π/3`, `4π/3` or `2π`", ok:true, why:"`(2 cos x + 1)(cos x - 1) = 0`: `cos x = -1/2` or 1." },
            { t:"`x = 2π/3` or `4π/3`", why:"`cos x = 1` also gives 0 and 2π." },
            { t:"`x = π/3`, `5π/3` or 0", why:"`cos x = -1/2`, not `+1/2`." },
            { t:"`x = 0` or `2π`", why:"`cos x = -1/2` gives two more." }],
          hints:["Let `u = cos x` and factor.", "`(2u + 1)(u - 1) = 0`.", "0, `2π/3`, `4π/3`, 2π."] },
        { id:"d8", topic:"35", goal:5,
          prompt:"A rider’s height is `h(t) = -10 cos(πt/30) + 12` metres after `t` seconds. What are the period and the maximum height?",
          options:[
            { t:"60 s; 22 m", ok:true, why:"2π ÷ (`π/30`) = 60; 12 + 10 = 22." },
            { t:"30 s; 22 m", why:"Period = 2π ÷ (`π/30`). " + M1 },
            { t:"60 s; 12 m", why:"12 m is the axle height." },
            { t:"`2π` s; 10 m", why:"The period is in seconds: 60." }],
          hints:["Period = `2π/k`.", "`k = π/30`.", "60 s; 22 m."] }
      ]
    }
  },

  // ---------- Connect: four forms, four waves (K12 grouping with multi-form cards, rendered by app.connect) ----------
  connect:{
    heading:"Four forms, four waves",
    intro:"Each tide below appears in four forms: an equation, a graph, a table and words. Time `t` is in hours; heights `h` are in metres relative to a dock marker. Each wave’s words card is already in place. Build its group by adding the equation, the graph and the table that describe the same wave.",
    summary:"Four forms",
    how:"Tap a card, then tap “Place in wave §1”.",
    ui:{ forms:{ eq:"Equation", graph:"Graph", table:"Table", words:"Words" }, rows:{ eq:"Equations", graph:"Graphs", table:"Tables" },
      tray:"Cards", inWave:"in wave §1", put:"Place in wave §1", pick:"Tap a card first, then tap “Place in wave §1”.",
      placed:"That card belongs to wave §1: §2 of 3 placed.", done:"Wave §1’s group is complete.", wait:"Its group is built in challenge §1.",
      check:"Check", needAll:"Choose a form for every wave first.", wave:"Wave §1", empty:"empty slot", selected:"Selected:", none:"Tap a card to select it.",
      graphCard:"graph card", tableCard:"table", chal:"Challenge §1 of §2", prev:"Previous", next:"Next challenge",
      progress:"§1 of §2 challenges done. “The chapter on one page” appears when all §2 are done." },
    groups:[
      { id:"A", words:"Starts at the middle level and rising; high tide 3 h later; repeats every 12 h." },
      { id:"B", words:"Starts at high tide, 4 m; repeats every 12 h." },
      { id:"C", words:"Starts at low tide, −2 m; repeats every 12 h." },
      { id:"D", words:"Starts at the middle level and rising; high tide 1.5 h later; repeats every 6 h." }],
    // p = {f, a, kd (k = π/kd), c}; rows = [t, h]
    cards:[
      { id:"e1", form:"eq", t:"`h = 3 sin(πt/3) + 1`", answer:"D" },
      { id:"e2", form:"eq", t:"`h = 3 cos(πt/6) + 1`", answer:"B" },
      { id:"e3", form:"eq", t:"`h = 3 sin(πt/6) + 1`", answer:"A" },
      { id:"e4", form:"eq", t:"`h = -3 cos(πt/6) + 1`", answer:"C" },
      { id:"g1", form:"graph", p:{ f:"cos", a:-3, kd:6, c:1 }, answer:"C" },
      { id:"g2", form:"graph", p:{ f:"sin", a:3, kd:6, c:1 }, answer:"A" },
      { id:"g3", form:"graph", p:{ f:"sin", a:3, kd:3, c:1 }, answer:"D" },
      { id:"g4", form:"graph", p:{ f:"cos", a:3, kd:6, c:1 }, answer:"B" },
      { id:"t1", form:"table", rows:[[0, 4], [3, 1], [6, -2], [9, 1]], answer:"B" },
      { id:"t2", form:"table", rows:[[0, 1], [1.5, 4], [3, 1], [4.5, -2]], answer:"D" },
      { id:"t3", form:"table", rows:[[0, -2], [3, 1], [6, 4], [9, 1]], answer:"C" },
      { id:"t4", form:"table", rows:[[0, 1], [3, 4], [6, 1], [9, -2]], answer:"A" }],
    def:{
      eq:"Compare this equation with the words: what is `h` at `t = 0`, and what period does `2π ÷ k` give?",
      graph:"Read this graph at `t = 0`, then find its first high tide. Do they match the words?",
      table:"Read the `t`-column as well as the `h`-column: where does the table start, and when does it reach 4 m?" },
    challenges:[
      { id:"FF1", type:"group", wave:"A", topics:["32", "33"], goal:6,
        prompt:"Build wave A’s group of four.",
        fb:{ t2:"Check the times: this wave peaks at 1.5 h, not 3 h." },
        why:"Wave A starts on its axis, `h = 1`, and rises to its high tide of 4 m at `t = 3`; its period is `2π ÷ π/6 = 12` h." },
      { id:"FF2", type:"group", wave:"B", topics:["32", "33"], goal:6,
        prompt:"Build wave B’s group.",
        fb:{ g1:"This graph starts at its lowest point: a −cos wave." },
        why:"Wave B starts at its high tide, 4 m, so it’s a cosine with `a > 0`; it repeats every `2π ÷ π/6 = 12` h." },
      { id:"FF3", type:"group", wave:"C", topics:["32", "33"], goal:6,
        prompt:"Build wave C’s group.",
        fb:{ e2:"`-3 cos` starts at 1 − 3 = −2." },
        why:"Wave C starts at its low tide, 1 − 3 = −2 m, so it’s a cosine with `a < 0`; its period is 12 h." },
      { id:"FF4", type:"group", wave:"D", topics:["32", "33"], goal:6,
        prompt:"Build wave D’s group.",
        fb:{ e3:"`πt/6` gives period 12 h; this wave repeats every 6 h. " + M1 },
        why:"Wave D starts on its axis and rises, like wave A, but `k = π/3` gives a period of `2π ÷ π/3 = 6` h, so its high tide comes at `t = 1.5`." },
      { id:"FF5", type:"mc", stretch:true, topics:["33"], goal:[3, 6],
        prompt:"Which second equation also describes wave A?",
        options:[
          { t:"`h = 3 cos[{π}/{6}(t - 3)] + 1`", ok:true, why:"Its max is at `t = 3`, where wave A has its high tide, with the same amplitude, axis and period. " + M6 },
          { t:"`h = 3 cos[{π}/{6}(t + 3)] + 1`", why:"That peaks at `t = -3`, i.e. 9." },
          { t:"`h = 3 sin[{π}/{6}(t - 3)] + 1`", why:"That starts at the minimum." },
          { t:"`h = -3 sin(πt/6) + 1`", why:"That starts at the middle but falling." }] },
      { id:"FF6", type:"period", stretch:true, topics:["32"], goal:[2, 6],
        prompt:"For each wave, which form shows the period most directly?",
        forms:[{ id:"eq", t:"Equation" }, { id:"table", t:"Table" }],
        note:"The equation gives it by `2π/k`; the table needs a full cycle of times.",
        periods:"Waves A, B and C repeat every 12 h; wave D repeats every 6 h." }
    ],
    onePage:{
      title:"The chapter on one page",
      intro:"Wave A in all four forms. The same four facts sit in each one: amplitude 3, axis `h = 1`, period 12 h and the start.",
      key:[{ id:"amp", name:"Amplitude", t:"amplitude 3" }, { id:"axis", name:"Axis", t:"axis `h = 1`" }, { id:"per", name:"Period", t:"period 12 h" }, { id:"start", name:"Start", t:"start: middle, rising" }],
      aria:"Graph of wave A, h = 3 sin(πt/6) + 1, for t from 0 to 12. A bracket shows the amplitude 3 below the axis, a dashed line marks the axis h = 1, a bracket over the top spans one period from t = 0 to t = 12, and a ring marks the start (0, 1), rising.",
      cells:{
        eq:{ html:"`h = @a{3} sin(@k{{π}/{6}}t) + @c{1}`",
          notes:[["amp", "`|a| = 3`"], ["axis", "`c = 1`, so the axis is `h = 1`"], ["per", "`2π ÷ π/6 = 12` h"], ["start", "sin with `a > 0`: middle, rising"]] },
        graph:{ notes:[["amp", "high 4, low −2: half the gap is 3"], ["axis", "halfway between: `h = 1`"], ["per", "one full cycle from `t = 0` to `t = 12`"], ["start", "at `t = 0`, `h = 1` and rising"]] },
        table:{ notes:[["amp", "(4 − (−2))/2 = 3"], ["axis", "(4 + (−2))/2 = 1"], ["per", "middle at 0, high at 3: a quarter period is 3 h, so the period is 12 h"], ["start", "`t = 0`: `h = 1`, then up to 4"]] },
        words:{ html:"Starts at the <span class=\"ff-h ff-h-axis\">middle level</span> and <span class=\"ff-h ff-h-start\">rising</span>; high tide <span class=\"ff-h ff-h-per\">3 h later</span>; <span class=\"ff-h ff-h-per\">repeats every 12 h</span>.",
          notes:[["amp", "not stated: these words give times, not heights"], ["axis", "“the middle level”"], ["per", "“repeats every 12 h” (and “3 h later” is a quarter of it)"], ["start", "“starts at the middle level and rising”"]] } } }
  },

  // ---------- Mixed practice: 12 items in the plan's interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Twelve questions from every Chapter 5 module, mixed up on purpose, so you practise choosing the right idea. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Twelve questions from all five modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"33", goal:3, kind:"mc", star:true,
            prompt:"A wave has maximum 5 at `x = π/2` and minimum −1 at `x = 3π/2`. Which equation fits?",
            options:[
              { t:"`y = 3 sin x + 2`", ok:true, why:"Amplitude 3, axis 2, period 2π, and `sin x` peaks at `π/2`." },
              { t:"`y = 3 cos x + 2`", why:"`cos x` peaks at 0." },
              { t:"`y = 6 sin x + 2`", why:"6 is max − min. " + M3 },
              { t:"`y = 3 sin x + 5`", why:"5 is the max, not the axis." }],
            hints:["Amplitude, axis, period.", "3, 2, 2π.", "sin peaks at `π/2`: `3 sin x + 2`."] },
          { id:"mp2", topic:"31", goal:1, kind:"strip",
            prompt:"Zeros of `y = tan x` on `[0, 2π]`.",
            answer:[0, 12, 24], display:"`x = 0`, π and 2π",
            why:"`tan x = sin x/cos x` is 0 where `sin x = 0`.",
            rules:[{ any:[6, 18], fb:"That’s an asymptote: `tan x` is undefined there." }],
            hints:["`tan x = sin x/cos x` is 0 where its top is 0.", "`sin x = 0` at 0, π and 2π.", "0, π and 2π."] },
          { id:"mp3", topic:"34", goal:4, kind:"strip",
            prompt:"Solve `tan x = √3` on `[0, 2π]`.",
            answer:[4, 16], display:"`x = π/3` and `4π/3`",
            why:"Reference angle `π/3`; tangent is positive in quadrants 1 and 3.",
            rules:[{ any:[8], fb:"`tan(2π/3) = -√3`." }],
            hints:["`tan(π/3) = √3`, so the reference angle is `π/3`.", "Tangent is positive in quadrants 1 and 3.", "`π/3` and `4π/3`."] },
          { id:"mp4", topic:"32", goal:2, kind:"mc",
            prompt:"What is the phase shift of `y = sin(2x - π/3)`?",
            options:[
              { t:"`π/6` to the right", ok:true, why:"`2x - π/3 = 2(x - π/6)`: `π/6` to the right." },
              { t:"`π/3` to the right", why:M2 },
              { t:"`π/6` to the left", why:"`x - π/6` means a shift to the right." },
              { t:"`π/3` to the left", why:"Factor out `k` first; then `x - d` with `d > 0` shifts to the right." }],
            hints:["Write the inside as `k(x - d)`.", "`2x - π/3 = 2(x - π/6)`.", "`π/6` to the right."] },
          { id:"mp5", topic:"35", goal:5, kind:"num", keypad:"decimal",
            prompt:"Daylight hours on day `t` of the year are `D(t) = 3 sin[{2π}/{365}(t - 80)] + 12`. What is the longest day’s length?",
            label:"Longest day:", unit:"h", answer:15, display:"15 h",
            why:"The longest day is the maximum: `c + |a|` = 12 + 3 = 15 h.",
            wrong:[{ match:12, fb:"12 h is the axis: the average day." }, { match:9, fb:"That’s the shortest day, `c - |a|`." }, { match:3, fb:"3 is the amplitude: how far the longest day is above the average." }],
            hints:["The longest day is the maximum of `D`.", "Maximum = axis + amplitude.", "12 + 3 = 15 h."] },
          { id:"mp6", topic:"31", goal:1, kind:"strip",
            prompt:"Where is `csc x` undefined on `[0, 2π]`?",
            answer:[0, 12, 24], display:"`x = 0`, π and 2π",
            why:"`csc x = 1/sin x` is undefined where `sin x = 0`: 0, π and 2π.",
            rules:[{ any:[6], fb:"`csc = 1/sin`; `sin(π/2) = 1`. " + M7 }, { any:[18], fb:"`csc = 1/sin`; `sin(3π/2) = -1`. " + M7 }],
            hints:["`csc x = 1/sin x`.", "It’s undefined where `sin x = 0`.", "0, π and 2π."] },
          { id:"mp7", topic:"33", goal:3, kind:"mc", star:true,
            prompt:"Which cosine equation is equivalent to `y = 2 sin[3(x - π/6)] - 1`?",
            options:[
              { t:"`y = 2 cos[3(x - π/3)] - 1`", ok:true, why:"The sine starts its cycle at `π/6` and peaks a quarter period, `2π/3 ÷ 4 = π/6`, later, at `π/3`: that’s where the cosine’s maximum goes." },
              { t:"`y = 2 cos[3(x - π/6)] - 1`", why:"Sine and cosine differ by a quarter period: `2π/3 ÷ 4 = π/6` more." },
              { t:"`y = 2 cos[3(x - π/2)] - 1`", why:"That shifts by `π/2`, a full quarter of 2π, not of the period." },
              { t:"`y = -2 cos[3(x - π/6)] - 1`", why:"That starts at a minimum." }],
            hints:["`sin θ = cos(θ - π/2)`.", "`3(x - π/6) - π/2 = 3(x - π/6 - π/6)`.", "`2 cos[3(x - π/3)] - 1`."] },
          { id:"mp8", topic:"34", goal:4, kind:"strip", star:true,
            prompt:"Solve `2 sin^2 x = sin x` on `[0, 2π]`.",
            answer:[0, 2, 10, 12, 24], display:"`x = 0`, `π/6`, `5π/6`, π and 2π",
            why:"`sin x(2 sin x - 1) = 0` keeps `sin x = 0` (0, π, 2π) as well as `sin x = 1/2` (`π/6`, `5π/6`).",
            rules:[{ set:[2, 10], fb:"Dividing by `sin x` lost `sin x = 0`: factor `sin x(2 sin x - 1) = 0`. " + M5 }],
            hints:["Bring everything to one side: `2 sin^2 x - sin x = 0`.", "Factor: `sin x(2 sin x - 1) = 0`.", "`sin x = 0`: 0, π, 2π; `sin x = 1/2`: `π/6`, `5π/6`."] },
          { id:"mp9", topic:"32", goal:2, kind:"mc",
            prompt:"Amplitude and axis of `y = -4 sin x - 3`?",
            options:[
              { t:"Amplitude 4, axis `y = -3`", ok:true, why:"Amplitude `|a| = |-4| = 4`; axis `y = c = -3`." },
              { t:"Amplitude −4, axis `y = -3`", why:"Amplitude is `|a|`." },
              { t:"Amplitude 4, axis `y = 3`", why:"The axis is `y = c`, and here `c = -3`." },
              { t:"Amplitude 3, axis `y = -4`", why:"That swaps them: `a = -4` sets the amplitude and `c = -3` the axis." }],
            hints:["Amplitude = `|a|`; axis `y = c`.", "`a = -4`, `c = -3`.", "Amplitude 4, axis `y = -3`."] },
          { id:"mp10", topic:"35", goal:5, kind:"mc", star:true,
            prompt:"A Ferris wheel has radius 15 m, its axle 17 m above the ground, one turn every 40 s, and the rider starts at the bottom. Which model gives the height?",
            options:[
              { t:"`h = -15 cos(πt/20) + 17`", ok:true, why:"Amplitude = radius 15, axis = axle 17, `k = 2π/40 = π/20`, and a bottom start is −cos." },
              { t:"`h = 15 cos(πt/20) + 17`", why:"That starts at the top. " + M8 },
              { t:"`h = -15 cos(40t) + 17`", why:M1 + " Here `k = 2π/40`." },
              { t:"`h = -17 cos(πt/20) + 15`", why:"Radius and axle swapped." }],
            hints:["Amplitude = radius, axis = axle.", "`k = 2π/40 = π/20`.", "Bottom start: −cos."] },
          { id:"mp11", topic:"31", goal:1, kind:"num", star:true, keypad:"decimal",
            prompt:"How many solutions does `sin x = 0.3` have for `0 ≤ x ≤ 4π`?",
            label:"Number of solutions:", answer:4, display:"4 solutions",
            why:"The line `y = 0.3` meets each period of `sin x` twice, and `[0, 4π]` holds two periods.",
            wrong:[{ match:2, fb:"That’s one period; `[0, 4π]` is two periods." }],
            hints:["How many times does the line `y = 0.3` cross one period of `sin x`?", "Twice per period: 0.3 is between −1 and 1, and isn’t ±1.", "Two periods × 2 = 4."] },
          { id:"mp12", topic:"34", goal:4, kind:"strip", star:true,
            prompt:"Solve `cos 2x = cos x` on `[0, 2π]`.",
            answer:[0, 8, 16, 24], display:"`x = 0`, `2π/3`, `4π/3` and 2π",
            why:"`2 cos^2 x - cos x - 1 = (2 cos x + 1)(cos x - 1) = 0`: `cos x = -1/2` gives `2π/3` and `4π/3`; `cos x = 1` gives 0 and 2π.",
            general:"`cos 2x = 2 cos^2 x - 1`, so `2 cos^2 x - cos x - 1 = 0`.",
            hints:["Use a double-angle identity with cosine only.", "`(2 cos x + 1)(cos x - 1) = 0`.", "0, `2π/3`, `4π/3`, 2π."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which Connect card was hardest to place, and what finally gave it away?" },
      { id:"j2", q:"In your own words, why can two different equations describe exactly the same wave?" },
      { id:"j3", q:"Explain to a friend how to make sure you’ve found every solution of a trig equation in `[0, 2π]`." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across the whole chapter, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"31", goal:1,
        a:{ fixedOrder:true, prompt:"What is the period of `y = tan x`?",
          options:[
            { t:"`π/2`", why:"That’s only from a zero of `tan x` to the next asymptote." },
            { t:"`π`", ok:true, why:"`tan x` repeats every half turn: `tan(x + π) = tan x`." },
            { t:"`2π`", why:"tan repeats every half turn." },
            { t:"`4π`", why:"That’s two full turns; `tan x` repeats every π." }] },
        b:{ fixedOrder:true, prompt:"What is the period of `y = sec x`?",
          options:[
            { t:"`π/2`", why:"That’s only from `x = 0` to the first asymptote." },
            { t:"`π`", why:"sec follows cos, period 2π." },
            { t:"`2π`", ok:true, why:"`sec x = 1/cos x` repeats when `cos x` does: every 2π." },
            { t:"`4π`", why:"That’s two full periods." }] } },
      { id:"f2", cat:"K", topic:"32", goal:2,
        a:{ fixedOrder:true, prompt:"What is the period of `y = 5 cos(3x) - 1`?",
          options:[
            { t:"`π/3`", why:"That divides π, not 2π, by 3." },
            { t:"`2π/3`", ok:true, why:"`2π/|k| = 2π/3`." },
            { t:"3", why:"That’s `k`. " + M1 },
            { t:"`6π`", why:"That multiplies 2π by 3; `k = 3` squeezes the wave." }] },
        b:{ fixedOrder:true, prompt:"What is the period of `y = 2 sin(x/4) + 3`?",
          options:[
            { t:"`1/4`", why:"That’s `k`. " + M1 },
            { t:"`π/2`", why:"That divides 2π by 4, but here `k = 1/4`." },
            { t:"4", why:"That’s `1/k`; the period is `2π/k`." },
            { t:"`8π`", ok:true, why:"`k = 1/4`, so the period is 2π ÷ `1/4` = 8π." }] } },
      { id:"f3", cat:"K", topic:"34", goal:4,
        a:{ prompt:"Solve `cos x = -√2/2` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`3π/4` and `5π/4`", ok:true, why:"Reference angle `π/4`; cosine is negative in quadrants 2 and 3." },
            { t:"`π/4` and `7π/4`", why:"Cosine is negative in quadrants 2 and 3." },
            { t:"`3π/4` only", why:M4 },
            { t:"`5π/4` and `7π/4`", why:"`cos(7π/4)` is positive: `7π/4` is in quadrant 4." }] },
        b:{ prompt:"Solve `sin x = -√3/2` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`4π/3` and `5π/3`", ok:true, why:"Reference angle `π/3`; sine is negative in quadrants 3 and 4." },
            { t:"`π/3` and `2π/3`", why:"Those give `sin x = +√3/2`; sine is negative in quadrants 3 and 4." },
            { t:"`4π/3` only", why:M4 },
            { t:"`2π/3` and `4π/3`", why:"`sin(2π/3)` is positive: `2π/3` is in quadrant 2." }] } },
      { id:"f4", cat:"K", topic:"33", goal:3,
        a:{ fixedOrder:true, prompt:"A sinusoid has maximum 9 and minimum −3. What is the equation of its axis?",
          options:[
            { t:"`y = 3`", ok:true, why:"(9 + (−3))/2 = 3." },
            { t:"`y = 6`", why:"That’s the amplitude. " + M3 },
            { t:"`y = 9`", why:"9 is the maximum; the axis is halfway between the maximum and the minimum." },
            { t:"`y = 12`", why:"That’s max − min." }] },
        b:{ fixedOrder:true, prompt:"A sinusoid has maximum 4 and minimum −8. What is the equation of its axis?",
          options:[
            { t:"`y = -8`", why:"−8 is the minimum; the axis is halfway between the maximum and the minimum." },
            { t:"`y = -2`", ok:true, why:"(4 + (−8))/2 = −2." },
            { t:"`y = 6`", why:"That’s the amplitude. " + M3 },
            { t:"`y = 12`", why:"That’s max − min." }] } },
      { id:"f5", cat:"T", topic:"32", goal:2,
        a:{ prompt:"Where is the first maximum to the right of `x = π/4` on `y = 2 sin[3(x - π/4)] + 1`?",
          options:[
            { t:"`(5π/12, 3)`", ok:true, why:"`3(x - π/4) = π/2` gives `x = π/4 + π/6`." },
            { t:"`(3π/4, 3)`", why:"That ignores `k`: `π/2 ÷ 3 = π/6`." },
            { t:"`(5π/12, 2)`", why:"Max = 1 + 2 = 3." },
            { t:"`(π/4, 3)`", why:"At `x = π/4` the wave is on its axis, rising." }] },
        b:{ prompt:"Where is the first maximum to the right of `x = 0` on `y = 3 cos[2(x + π/6)] - 1`?",
          options:[
            { t:"`(5π/6, 2)`", ok:true, why:"Maxima where `2(x + π/6) = 2πn`: `x = -π/6 + πn`; the first positive is `5π/6`." },
            { t:"`(-π/6, 2)`", why:"That’s left of 0." },
            { t:"`(5π/6, 3)`", why:"Max = −1 + 3 = 2." },
            { t:"`(π/6, 2)`", why:"`x + π/6` means a shift left, so the max is at `-π/6 + π`." }] } },
      { id:"f6", cat:"T", topic:"33", goal:3,
        a:{ prompt:"Which equation is <strong>not</strong> equivalent to `y = 2 sin x`?",
          options:[
            { t:"`y = 2 cos(x + π/2)`", ok:true, why:"`cos(x + π/2) = -sin x`." },
            { t:"`y = 2 cos(x - π/2)`", why:"Equivalent: `cos(x - π/2) = sin x`." },
            { t:"`y = -2 sin(x - π)`", why:"Equivalent: `sin(x - π) = -sin x`." },
            { t:"`y = 2 sin(x + 2π)`", why:"Equivalent: a full period." }] },
        b:{ prompt:"Which equation is <strong>not</strong> equivalent to `y = 3 cos x`?",
          options:[
            { t:"`y = 3 sin(x - π/2)`", ok:true, why:"`sin(x - π/2) = -cos x`." },
            { t:"`y = 3 sin(x + π/2)`", why:"Equivalent: `sin(x + π/2) = cos x`." },
            { t:"`y = -3 cos(x + π)`", why:"Equivalent: `cos(x + π) = -cos x`." },
            { t:"`y = 3 cos(x - 2π)`", why:"Equivalent: a full period." }] } },
      { id:"f7", cat:"T", topic:"34", goal:4,
        a:{ prompt:"Solve `2 sin^2 x - 3 sin x + 1 = 0` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`x = π/6`, `π/2` or `5π/6`", ok:true, why:"`(2 sin x - 1)(sin x - 1) = 0`." },
            { t:"`x = π/6` or `π/2`", why:"`sin x = 1/2` also at `5π/6`. " + M4 },
            { t:"`x = π/6` or `5π/6`", why:"`sin x = 1` gives `π/2`." },
            { t:"`x = π/3`, `π/2` or `2π/3`", why:"`sin x = 1/2`, not `√3/2`." }] },
        b:{ prompt:"Solve `2 cos^2 x + 3 cos x + 1 = 0` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`x = 2π/3`, `π` or `4π/3`", ok:true, why:"`(2 cos x + 1)(cos x + 1) = 0`." },
            { t:"`x = 2π/3` or `π`", why:"`cos x = -1/2` also at `4π/3`. " + M4 },
            { t:"`x = 2π/3` or `4π/3`", why:"`cos x = -1` gives π." },
            { t:"`x = π/3`, `π` or `5π/3`", why:"`cos x = -1/2`, not `1/2`." }] } },
      { id:"f8", cat:"T", topic:"31", goal:1,
        a:{ prompt:"On `0 < x < 2π`, where are `sin x` and `tan x` both negative?",
          options:[
            { t:"`3π/2 < x < 2π`", ok:true, why:"`sin < 0` in quadrants 3–4; `tan < 0` in quadrants 2 and 4." },
            { t:"`π < x < 3π/2`", why:"tan is positive in quadrant 3." },
            { t:"`π/2 < x < π`", why:"sin is positive in quadrant 2." },
            { t:"`π < x < 2π`", why:"Only part of that has `tan < 0`." }] },
        b:{ prompt:"On `0 < x < 2π`, where are `cos x` negative and `csc x` positive?",
          options:[
            { t:"`π/2 < x < π`", ok:true, why:"`cos < 0` in quadrants 2–3; `csc > 0` where `sin > 0`, quadrants 1–2." },
            { t:"`π < x < 3π/2`", why:"sin (and csc) is negative in quadrant 3." },
            { t:"`0 < x < π/2`", why:"cos is positive in quadrant 1." },
            { t:"`π/2 < x < 3π/2`", why:"Only part of that has `csc > 0`." }] } },
      { id:"f9", cat:"C", topic:"31", goal:1,
        a:{ prompt:"Which is the best explanation of why `y = sec x` has vertical asymptotes at `x = π/2` and `3π/2`?",
          options:[
            { t:"“`sec x = 1/cos x`, and `cos x = 0` there, so `sec x` is undefined and grows without bound nearby.”", ok:true, why:"A reciprocal is undefined where its partner is 0, and huge in size close by." },
            { t:"“Because `sin x = 0` there.”", why:"`sin x = ±1` there." },
            { t:"“Because the period of `sec x` is 2π.”", why:"Period doesn’t place asymptotes." },
            { t:"“Because sec is the inverse of cos.”", why:"Reciprocal, not inverse: `sec x = 1/cos x`." }] },
        b:{ prompt:"Which is the best explanation of why `y = cot x` has zeros at `x = π/2` and `3π/2`?",
          options:[
            { t:"“`cot x = cos x/sin x`; there `cos x = 0` while `sin x = ±1`, so `cot x = 0`.”", ok:true, why:"A fraction is 0 where its top is 0 and its bottom isn’t." },
            { t:"“Because `tan x = 0` there.”", why:"tan is undefined there." },
            { t:"“Because cot is the inverse of tan.”", why:"Reciprocal, not inverse: `cot x = 1/tan x`." },
            { t:"“Because `sin x = 0` there.”", why:"Then cot would be undefined." }] } },
      { id:"f10", cat:"C", topic:"33", goal:3,
        a:{ prompt:"Which is the best explanation of why `y = 4 sin x` and `y = 4 cos(x - π/2)` have the same graph?",
          options:[
            { t:"“Shifting `cos x` right by `π/2` moves its maximum from 0 to `π/2`, where `sin x` peaks; same amplitude and period, so the curves coincide.”", ok:true, why:M6 },
            { t:"“Because sine and cosine have the same amplitude.”", why:"Same amplitude isn’t enough: the peaks must line up." },
            { t:"“Because `π/2` is the period.”", why:"The period is 2π." },
            { t:"“Because cos is the reciprocal of sin.”", why:"Reciprocal of sin is csc." }] },
        b:{ prompt:"Which is the best explanation of why `y = -3 sin x` and `y = 3 sin(x + π)` have the same graph?",
          options:[
            { t:"“Shifting `sin x` by half a period, π, changes the sign of every value: `sin(x + π) = -sin x`.”", ok:true, why:"Half a period moves every maximum onto a minimum, so `3 sin(x + π) = -3 sin x`." },
            { t:"“Because both have amplitude 3.”", why:"Not enough on its own." },
            { t:"“Because π is the period of sine.”", why:"The period is 2π." },
            { t:"“Because negative `a` and positive `a` always give the same graph.”", why:"`-3 sin x` is a reflection of `3 sin x`." }] } },
      { id:"f11", cat:"C", topic:"35", goal:5,
        a:{ prompt:"A day’s temperature is `T(t) = 6 sin[{π}/{12}(t - 9)] + 18` °C, `t` hours after midnight. What does the 18 represent?",
          options:[
            { t:"The average temperature, halfway between the high of 24 °C and the low of 12 °C", ok:true, why:"18 is `c`: the axis, halfway between 18 + 6 and 18 − 6." },
            { t:"The highest temperature", why:"That’s 18 + 6." },
            { t:"The temperature at midnight", why:"`T(0) = 18 + 6 sin(-3π/4) ≈ 13.8` °C." },
            { t:"The time of the highest temperature", why:"Times are `t`-values; 18 is a temperature." }] },
        b:{ prompt:"A day’s temperature is `T(t) = 6 sin[{π}/{12}(t - 9)] + 18` °C, `t` hours after midnight. For this model, what does the 9 represent?",
          options:[
            { t:"9 a.m., when the temperature passes its average value while rising", ok:true, why:"`d = 9`: the sine cycle starts at `t = 9`, on its axis and rising." },
            { t:"9 a.m., the time of the highest temperature", why:"The max is a quarter period later: 3 p.m." },
            { t:"A temperature of 9 °C", why:"`d` is a time." },
            { t:"The amplitude in °C", why:"The amplitude is 6." }] } },
      { id:"f12", cat:"A", topic:"35", goal:5,
        a:{ prompt:"High tide (8 m) is at 2:00 and the next low tide (2 m) at 8:15. Using `h(t) = a cos[k(t - d)] + c`, `t` in hours after midnight, which is correct?",
          options:[
            { t:"`a = 3`, `c = 5`, `k = 4π/25`, `d = 2`", ok:true, why:"Amplitude (8 − 2)/2; axis 5; half a period is 6.25 h, so the period is 12.5 h and `k = 2π/12.5`." },
            { t:"`a = 6`, `c = 5`, `k = 4π/25`, `d = 2`", why:"That’s max − min. " + M3 },
            { t:"`a = 3`, `c = 5`, `k = 4π/25`, `d = 8.25`", why:"A cosine with `a > 0` starts at the high tide." },
            { t:"`a = 3`, `c = 5`, `k = 8π/25`, `d = 2`", why:"That uses 6.25 h as the whole period." }] },
        b:{ prompt:"A buoy’s highest point (10 m) is at 3:00 and its next lowest (4 m) at 9:00. Using `h(t) = a cos[k(t - d)] + c`, `t` in hours after midnight, which is correct?",
          options:[
            { t:"`a = 3`, `c = 7`, `k = π/6`, `d = 3`", ok:true, why:"Amplitude (10 − 4)/2 = 3; axis 7; half a period is 6 h, so the period is 12 h and `k = 2π/12 = π/6`; a cosine with `a > 0` starts at the highest point, `d = 3`." },
            { t:"`a = 6`, `c = 7`, `k = π/6`, `d = 3`", why:"That’s max − min. " + M3 },
            { t:"`a = 3`, `c = 7`, `k = π/6`, `d = 9`", why:"A cosine with `a > 0` starts at the highest point, at 3:00." },
            { t:"`a = 3`, `c = 7`, `k = π/3`, `d = 3`", why:"That uses 6 h as the whole period." }] } },
      { id:"f13", cat:"A", topic:"34", goal:4,
        a:{ prompt:"A model gives `h(t) = 2 sin(πt/6) + 3`. For `0 ≤ t ≤ 12`, when is `h = 4`?",
          options:[
            { t:"`t = 1` and `t = 5`", ok:true, why:"`sin(πt/6) = 1/2`: `πt/6 = π/6` or `5π/6`." },
            { t:"`t = 1` only", why:M4 },
            { t:"`t = 1` and `t = 7`", why:"sin is negative at `7π/6`." },
            { t:"`t = 3` and `t = 9`", why:"Those are the max and min times." }] },
        b:{ prompt:"A model gives `h(t) = 4 cos(πt/4) + 5`. For `0 ≤ t ≤ 8`, when is `h = 7`?",
          options:[
            { t:"`t = 4/3` and `t = 20/3`", ok:true, why:"`cos(πt/4) = 1/2`: `πt/4 = π/3` or `5π/3`." },
            { t:"`t = 4/3` only", why:M4 },
            { t:"`t = 4/3` and `t = 8/3`", why:"cos is negative at `2π/3`." },
            { t:"`t = 0` and `t = 4`", why:"Those are the max and min times." }] } },
      { id:"f14", cat:"A", topic:"32", goal:2,
        a:{ fixedOrder:true, prompt:"A tuning fork’s sound is `y = 0.5 sin(880πt)`, `t` in seconds. How many complete cycles happen each second?",
          options:[
            { t:"`1/440`", why:"That’s the period, in seconds." },
            { t:"440", ok:true, why:"Period `2π/(880π) = 1/440` s." },
            { t:"880", why:"That’s `k ÷ π`. " + M1 },
            { t:"`880π`", why:"That’s `k`. " + M1 }] },
        b:{ fixedOrder:true, prompt:"A sound is `y = 0.2 sin(500πt)`, `t` in seconds. How many complete cycles happen each second?",
          options:[
            { t:"`1/250`", why:"That’s the period, in seconds." },
            { t:"250", ok:true, why:"Period `2π/(500π) = 1/250` s, so 250 cycles fit in each second." },
            { t:"500", why:"That’s `k ÷ π`. " + M1 },
            { t:"`500π`", why:"That’s `k`. " + M1 }] } },
      { id:"f15", cat:"A", topic:"33", goal:3,
        a:{ prompt:"A pendulum’s horizontal position swings between −12 cm and 12 cm. It starts at its rightmost point and takes 2 s for a full swing there and back. Which model fits?",
          options:[
            { t:"`x = 12 cos(πt)`", ok:true, why:"Amplitude 12; period 2 s gives `k = π`; cosine starts at the max." },
            { t:"`x = 12 sin(πt)`", why:"sin starts at the middle. " + M8 },
            { t:"`x = 12 cos(2t)`", why:"Period 2 gives `k = 2π/2 = π`. " + M1 },
            { t:"`x = 24 cos(πt)`", why:"24 is max − min. " + M3 }] },
        b:{ prompt:"A weight on a spring bobs between 3 cm and 11 cm above a table. It starts at its lowest point, and one full bob takes 4 s. Which model fits?",
          options:[
            { t:"`y = -4 cos(πt/2) + 7`", ok:true, why:"Amplitude (11 − 3)/2 = 4; axis 7; period 4 s gives `k = π/2`; −cos starts at the minimum." },
            { t:"`y = 4 cos(πt/2) + 7`", why:M8 },
            { t:"`y = -4 cos(4t) + 7`", why:"Period 4 gives `k = 2π/4 = π/2`. " + M1 },
            { t:"`y = -8 cos(πt/2) + 7`", why:"8 is max − min. " + M3 }] } }
    ]
  },

  task:{
    title:"Many equations, one wave", summary:"Many equations, one wave",
    statement:"<p>Use the wave tuner to match the spec. Then find <strong>three different equations</strong> that all give the same graph.</p><ol class=\"ww-spec\"><li>Maximum 5 and minimum −1.</li><li>Period π.</li><li>Passes through `(π/4, 5)`.</li></ol>",
    checks:[
      "`c + |a| = 5` and `c - |a| = -1`",
      "`2π/|k| = π`",
      "`y(π/4) = 5` exactly"],
    tips:[
      "The amplitude is half of 5 − (−1), and the axis is halfway between 5 and −1.",
      "Period π needs `|k| = 2`.",
      "A sine starts on its axis, not at its maximum: the maximum comes a quarter period after the start, so the maximum’s `x`-value isn’t the sine’s phase shift."],
    tipNow:[
      "Right now the maximum is {mx} and the minimum is {mn}.",
      "Right now the period is {p}.",
      "Right now `y(π/4)` {v}."],
    ui:{ how:"Move each slider, or use − and +. The ring marks `(π/4, 5)`; the dashed lines are `y = 5` and `y = -1`.",
      tuner:"Wave tuner", names:{ a:"a", k:"k", d:"d", c:"c" },
      rows:{ eq:"Equation", mm:"Maximum and minimum", per:"Period", val:"`y(π/4)`" } },
    explainPrompt:"Explain why your three equations give the same graph.",
    vocab:"Use the words amplitude, period, phase shift and axis.",
    success:"These settings match all three lines.",
    more:"Three different equations for the same graph solve the task. Find another setting that draws the same wave.",
    after3:"That’s three different equations for one wave: task solved."
  },

  cards:[
    ["`sin x` and `cos x`", "Period 2π, amplitude 1, range `[-1, 1]`."],
    ["`tan x`", "Period π; asymptotes at `π/2 + nπ`; zeros at `nπ`."],
    ["csc, sec, cot", "Asymptotes where sin, cos, tan are 0; graphs touch ±1 where their partners do."],
    ["Amplitude", "`|a| = (max - min)/2`."],
    ["Period", "`2π/|k|`."],
    ["Phase shift", "`d` in `y = a sin[k(x - d)] + c`, after factoring out `k`."],
    ["Axis", "`y = c = (max + min)/2`."],
    ["Sine vs cosine starts", "sin: middle, rising; cos: max; −cos: min; −sin: middle, falling."],
    ["Many equations, one graph", "Shift by a full period, or swap sin ↔ cos with a quarter-period shift."],
    ["Solving `sin x = k`", "Reference angle, then CAST: two solutions per period (or one at ±1)."],
    ["Quadratic trig equations", "Factor; never divide by `sin x` or `cos x`."],
    ["Modelling", "Amplitude = radius or half the range; axis = middle; period from the situation; start decides sin or cos."],
    ["Rates in models", "The steepest points are on the axis; the rate is 0 at maxima and minima."]
  ]
};
