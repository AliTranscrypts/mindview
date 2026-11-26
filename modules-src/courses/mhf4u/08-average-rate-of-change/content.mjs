// MHF4U 08 Average Rate of Change. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/08-average-rate-of-change.md

// Small sketch graphs for "which graph fits?" options (Final T2, Part 3 C3). f maps 0…1 to 0…1.
function sk(f, yl){
  const X = x => (14 + x * 94).toFixed(1), Y = y => (50 - y * 40).toFixed(1), n = 16, pts = [];
  for (let i = 0; i <= n; i++) pts.push(X(i / n) + " " + Y(f(i / n)));
  return '<svg class="sk" width="124" height="62" viewBox="0 0 124 62" aria-hidden="true"><path d="M12 4V54H118" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
    '<text x="116" y="50" font-size="11" font-style="italic" text-anchor="end" fill="currentColor">t</text><text x="16" y="12" font-size="11" font-style="italic" fill="currentColor">' + yl + "</text>" +
    '<path d="M' + pts.join("L") + '" fill="none" stroke="var(--pen)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
const opt = (svg, words) => svg + "<span>" + words + "</span>";
const SK = {
  upThenLine: x => x < 0.5 ? 1.6 * x * x / 1.2 : (0.4 + 1.6 * (x - 0.5)) / 1.2,
  line: x => 0.08 + 0.84 * x,
  steepThenFlat: x => x < 0.7 ? 1 - Math.pow(1 - x / 0.7, 2) : 1,
  upThenFlat: x => x < 0.55 ? 0.95 * Math.pow(x / 0.55, 2) : 0.95,
  coolFast: x => 0.1 + 0.85 * Math.exp(-3.4 * x),
  coolLine: x => 0.95 - 0.8 * x,
  coolSlowFirst: x => 0.95 - 0.85 * x * x,
  riseFlatten: x => 0.1 + 0.85 * (1 - Math.exp(-3.4 * x)),
  concaveDown: x => (Math.cbrt(1 + 7 * x) - 1),
  concaveUp: x => 0.05 + 0.9 * x * x,
  riseThenFlat: x => Math.min(0.9, 0.05 + 1.5 * x)
};

// Sorter feedback (plan: Activity 1 mistake feedback)
const SIGN = "Find `f` at both ends first: the sign of the rate is the sign of `f(b) - f(a)`.";
const M6 = "A graph can rise and fall inside the interval and still have average rate 0.";
const zeroWrong = { p:M6, n:M6 };

export default {
  id:"08-average-rate-of-change",
  kind:"topic",
  title:"Average rate of change",
  topic:"Average Rate of Change",
  readyTopic:"average rates of change",
  hero:{
    eq:'<span class="ar-w">average rate =</span> <span class="ar-big">`{Δy}/{Δx}`</span> <span class="ar-eq">`= {f(b) - f(a)}/{b - a}`</span>',
    eqLabel:"average rate equals delta y over delta x, which equals f of b minus f of a, over b minus a", eqSize:"sm",
    headline:"How fast, on average?",
    text:"Between two moments, a quantity changes by `Δy` while the input changes by `Δx`. Their ratio `Δy/Δx` is the <strong>average rate of change</strong>: the slope of the <strong>secant</strong> line joining the two points. It always comes with units, such as metres per second or dollars per item.",
    fig:{ aria:"A ball’s height h of t equals negative 5 t squared plus 20 t plus 1, for t from 0 to 4 seconds, with a secant line from t = 0 to a second point that slides to t = 1, 2 and 4 seconds" }
  },
  goals:[
    "I can calculate an average rate of change from an equation, a table or a graph.",
    "I can state an average rate with its units and explain what it means in context.",
    "I can connect the average rate of change to the slope of a secant line.",
    "I can recognize zero, constant and changing rates, and sketch a graph from a description of how something changes.",
    "I can compare average rates over different intervals and for different kinds of functions."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Slope", goal:3,
          prompt:"What is the slope of the line through (2, 5) and (6, 13)?",
          options:[
            { t:"2", ok:true, why:"(13 − 5)/(6 − 2) = 8/4 = 2." },
            { t:"1/2", why:"Slope is rise ÷ run: 8 ÷ 4." },
            { t:"−2", why:"(13 − 5)/(2 − 6) mixes the order." },
            { t:"13/6", why:"Slope compares changes between two points." }],
          hints:["Slope = change in `y` ÷ change in `x`.", "`Δy` = 13 − 5, `Δx` = 6 − 2.", "8/4 = 2."] },
        { id:"w2", skill:"Slope", goal:3,
          prompt:"A line falls 6 units as `x` increases by 3. What is its slope?",
          options:[
            { t:"−2", ok:true, why:"`Δy = -6`, `Δx = 3`: −6/3." },
            { t:"2", why:"Falling means `Δy` is negative." },
            { t:"−1/2", why:"−6 ÷ 3, not 3 ÷ (−6)." },
            { t:"−18", why:"Slope divides the changes." }],
          hints:["Is `Δy` positive or negative?", "−6 over 3.", "−2."] },
        { id:"w3", skill:"Evaluating functions", goal:1,
          prompt:"`f(x) = x^2 - 3x`. What is `f(5) - f(1)`?",
          options:[
            { t:"12", ok:true, why:"`f(5) = 10`, `f(1) = -2`; 10 − (−2) = 12." },
            { t:"8", why:"`f(1)` = 1 − 3 = −2." },
            { t:"10", why:"You need both values." },
            { t:"4", why:"5 − 1 = 4 is `Δx`." }],
          hints:["Find each value first.", "`f(5)` = 25 − 15; `f(1)` = 1 − 3.", "10 − (−2) = 12."] },
        { id:"w4", skill:"Evaluating functions", goal:1,
          prompt:"`N(t) = 200 · 2^t`. What is `N(3)`?",
          options:[
            { t:"1600", ok:true, why:"`2^3 = 8`, and 200 × 8 = 1600." },
            { t:"1200", why:"`2^3` means 2 × 2 × 2 = 8." },
            { t:"`400^3`", why:"Powers come before multiplication." },
            { t:"800", why:"The exponent is 3." }],
          hints:["Work out `2^3` first.", "`2^3 = 8`.", "200 × 8 = 1600."] },
        { id:"w5", skill:"Units", goal:2,
          prompt:"A pump moves 120 L in 8 minutes. What is its average rate?",
          options:[
            { t:"15 L/min", ok:true, why:"120 L ÷ 8 min." },
            { t:"15 min/L", why:"Litres ÷ minutes gives L/min." },
            { t:"960 L/min", why:"Rate divides." },
            { t:"0.067 L/min", why:"8 ÷ 120 is minutes per litre." }],
          hints:["Rate = amount ÷ time.", "120 ÷ 8.", "15 L/min."] },
        { id:"w6", skill:"Reading graphs", goal:4,
          prompt:"A distance–time graph is a horizontal segment from `t` = 2 h to `t` = 3 h. What was happening?",
          options:[
            { t:"The traveller was stopped", ok:true, why:"Distance didn’t change: speed 0." },
            { t:"Moving at a steady speed", why:"Steady speed is a straight line that slopes up." },
            { t:"Moving backward", why:"Backward would slope down." },
            { t:"Moving very fast", why:"Height is distance, not speed." }],
          hints:["What does the slope of a distance–time graph mean?", "Slope = speed.", "Flat: slope 0, stopped."] }
      ],
      refreshers:{
        "Slope":"Slope = `Δy/Δx = (y_2 - y_1)/(x_2 - x_1)`, same order on top and bottom. Falling lines have negative slopes.",
        "Evaluating functions":"Substitute in brackets and do powers first: `f(1)` for `x^2 - 3x` is 1 − 3 = −2.",
        "Units":"A rate’s units are (units of the top) per (units of the bottom): L ÷ min = L/min.",
        "Reading graphs":"On a distance–time graph, steepness is speed. Flat means stopped; steeper means faster."
      }
    }
  },
  explore:{
    heading:"Secant lab",
    intro:"Pick a situation, then drag the two points along the curve. The rise-and-run triangle and the secant line show the average rate of change, with its units.",
    predIntro:"Make a prediction first. Then the secant lab will show you what really happens.",
    predictions:[
      { id:"p1", start:{ sit:"ball", P:0, Q:1 }, run:{ to:{ Q:4 } },
        prompt:"Ball, with `P` at 0. `Q` will move to `t` = 4 s. What is the average rate over `[0, 4]`?",
        options:[{ t:"0 m/s", ok:true }, { t:"5 m/s" }, { t:"21 m/s" }, { t:"It can’t be found" }],
        explain:"`h(4) = h(0) = 1`: no net change. The ball went up 20 m and came down 20 m." },
      { id:"p2", start:{ sit:"bact", P:0, Q:1 }, run:{ from:{ P2:0, Q2:1 }, to:{ P2:4, Q2:5 } },
        prompt:"Bacteria. Compare the average rate over `[0, 1]` with the rate over `[4, 5]`. How many times bigger is the second?",
        options:[{ t:"16 times", ok:true }, { t:"2 times" }, { t:"5 times" }, { t:"The same" }],
        explain:"Each hour the count doubles, so the hourly change doubles too: 200, 400, 800, 1600, 3200. Over 4 doublings: `2^4 = 16`." },
      { id:"p3", start:{ sit:"taxi", P:0, Q:1 }, run:{ from:{ P2:0, Q2:1 }, to:{ P2:3, Q2:8 }, extra:[9, 10] },
        prompt:"Taxi. Which interval gives the biggest average rate: `[0, 1]`, `[3, 8]` or `[9, 10]` km?",
        options:[{ t:"They’re all the same", ok:true }, { t:"`[0, 1]`" }, { t:"`[3, 8]`" }, { t:"`[9, 10]`" }],
        explain:"A linear function’s secant is the line itself: 2 $/km on every interval." },
      { id:"p4", start:{ sit:"wheel", P:0, Q:4 }, run:{ from:{ P2:0, Q2:4 }, to:{ P2:2, Q2:6 } },
        prompt:"Ferris wheel. Which is bigger: the average rate over `[0, 4]` or over `[2, 6]`?",
        options:[{ t:"`[0, 4]`", ok:true }, { t:"`[2, 6]`" }, { t:"They’re equal" }, { t:"You can’t compare them" }],
        explain:"`[0, 4]`: (21 − 1)/4 = 5 m/s; `[2, 6]`: (11 − 11)/4 = 0. `[2, 6]` contains the top of the wheel, but it starts and ends at 11 m, so its secant is flat. Height isn’t rate." }
    ],
    chalIntro:"Use the secant lab to meet each goal, then press <strong>Check challenge</strong>. The check looks at the main pair, `P` and `Q`. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 5], prompt:"Ball: place `P` and `Q` so the average rate is 10 m/s.",
        why:"`[0, 2]`: 20 ÷ 2 = 10. It’s the only interval on the 1-s grid with rate 10 m/s.",
        hints:["You need `Δh ÷ Δt = 10`.", "From `t = 0` the heights are 1, 16, 21.", "`[0, 2]`: 20 ÷ 2 = 10."] },
      { id:"tc2", goal:[1, 5], prompt:"Bacteria: find an interval whose average rate is exactly 1200 bacteria per hour.",
        why:"3200 − 800 = 2400 on `[2, 4]`, and 2400 ÷ 2 = 1200. No other interval on the 1-h grid gives 1200.",
        hints:["Try intervals 2 h long: what change would give 1200 per hour?", "A change of 2400 over 2 h.", "3200 − 800 = 2400 on `[2, 4]`."] },
      { id:"tc3", goal:[1, 5], stretch:true,
        prompt:"Ferris wheel: find an interval 4 s long with average rate 0 that does <strong>not</strong> contain the top of the wheel.",
        why:"The bottom is at `t` = 8: `[6, 10]` starts and ends at 11 m. It’s the only such interval on the grid from 0 to 16.",
        hints:["Zero average rate means equal heights at the two ends.", "The wheel is symmetric about its lowest points too.", "The bottom is at `t` = 8: `[6, 10]` starts and ends at 11 m."] }
    ]
  },
  part3:{
    slug:"context", name:"Context",
    heading:"Rates in context",
    intro:"Real rates come from tables and words, with units to manage and meaning to state. In the first two rounds, work out `Δy`, `Δx` and the rate, choose its units, then build the sentence that says what it means. The last round goes the other way: from words to a sketch.",
    rounds:[
      { id:"c1", name:"C1 Tank", kind:"rate",
        prompt:"The table shows the volume of water in a tank. What is the average rate of change of the volume from 0 to 10 min?",
        table:{ head:["`t` (min)", "0", "5", "10", "15"], rows:[["`V` (L)", "600", "450", "350", "300"]], caption:"Volume of water in the tank" },
        pts:[[0, 600], [5, 450], [10, 350], [15, 300]], iv:[0, 10], view:{ xmin:-3, xmax:16.5, ymin:-60, ymax:690 }, xLabel:"t (min)", yLabel:"V (L)",
        boxes:[{ k:"dy", label:"Change in volume, `ΔV`", unit:"L" }, { k:"dx", label:"Change in time, `Δt`", unit:"min" }, { k:"rate", label:"Average rate" }],
        answer:{ dy:-250, dx:10, rate:-25 },
        wrong:{ dy:[{ v:250, fb:"The volume dropped, so `ΔV` is negative: later minus earlier, 350 − 600." }],
          dx:[{ v:-10, fb:"Subtract in the same order: later minus earlier, 10 − 0." }],
          rate:[{ v:25, fb:"The volume dropped: the rate is negative." }, { v:-0.04, fb:"Rate of `V` per unit of `t`: change in `V` on top, change in `t` underneath." }, { v:-250, fb:"−250 L is the change. A rate divides it by the 10 minutes." }] },
        unitLabel:"Units of the rate",
        units:[{ t:"L/min", ok:true, fb:"Litres ÷ minutes." }, { t:"min/L", fb:"The units follow the division: litres ÷ minutes = L/min." }, { t:"L", fb:"A rate compares two changes: litres per minute." }, { t:"min", fb:"A rate compares two changes: litres per minute." }],
        sentence:"From {from} to {to}, the {what} {dir} by {amt} per {per}, on average.",
        slots:{
          from:{ label:"start", chips:[{ t:"0 min", ok:true }, { t:"5 min", fb:"The question asks about 0 to 10 min." }, { t:"10 min", fb:"The interval starts at 0 min." }, { t:"15 min", fb:"The question asks about 0 to 10 min." }] },
          to:{ label:"end", chips:[{ t:"0 min", fb:"The interval ends at 10 min." }, { t:"5 min", fb:"The question asks about 0 to 10 min." }, { t:"10 min", ok:true }, { t:"15 min", fb:"The question asks about 0 to 10 min." }] },
          what:{ label:"what changes", chips:[{ t:"volume", ok:true }, { t:"time", fb:"Time is the input. The volume is what changes." }, { t:"rate", fb:"The volume is what changes; the rate says how fast." }] },
          dir:{ label:"which way", chips:[{ t:"rose", fb:"The volume dropped: the rate is negative." }, { t:"fell", ok:true }] },
          amt:{ label:"how much", chips:[{ t:"25 L", ok:true }, { t:"−25 L", fb:"“Fell” already says the volume went down, so the amount is 25 L." }, { t:"250 L", fb:"250 L is the whole drop over 10 minutes. Per minute it’s 25 L." }, { t:"10 L", fb:"10 is `Δt`, in minutes, not a volume." }] },
          per:{ label:"per", chips:[{ t:"minute", ok:true }, { t:"litre", fb:"The units follow the division: litres per minute, not minutes per litre." }, { t:"10 minutes", fb:"The rate is per one minute: 25 L each minute." }] }
        },
        alg:"`{V(10) - V(0)}/{10 - 0} = {350 - 600}/{10} = {-250}/{10} = -25` L/min",
        done:"The volume fell by 25 L per minute, on average." },
      { id:"c2", name:"C2 Cyclist", kind:"rate",
        prompt:"A cyclist’s odometer reads 12 km at 9:20 and 30 km at 10:05. What is the average speed in km/h?",
        table:{ head:["Time", "9:20", "10:05"], rows:[["Odometer (km)", "12", "30"]], caption:"Odometer readings" },
        boxes:[{ k:"dy", label:"Change in distance, `Δd`", unit:"km" }, { k:"dx", label:"Change in time, `Δt`", unit:"h" }, { k:"rate", label:"Average speed" }],
        answer:{ dy:18, dx:0.75, rate:24 },
        wrong:{ dy:[{ v:-18, fb:"Subtract later minus earlier: 30 − 12." }, { v:30, fb:"30 km is a reading. The rate needs the change: 30 − 12." }],
          dx:[{ v:45, fb:"45 minutes is 0.75 h. Convert before dividing if the rate is per hour." }, { v:0.45, fb:"45 minutes is 45/60 h = 0.75 h, not 0.45 h." }],
          rate:[{ v:0.4, fb:"18 ÷ 45 gives km per <strong>minute</strong>. Convert 45 min to 0.75 h." }, { v:13.5, fb:"18 × 0.75 multiplies. A rate divides: 18 ÷ 0.75." }, { v:40, fb:"18 ÷ 0.45 uses 0.45 h. 45 minutes is 0.75 h." }] },
        unitLabel:"Units of the speed",
        units:[{ t:"km/h", ok:true, fb:"Kilometres ÷ hours." }, { t:"h/km", fb:"The units follow the division: kilometres ÷ hours = km/h." }, { t:"km/min", fb:"The question asks for a rate per hour, so `Δt` is in hours." }, { t:"km", fb:"A rate compares two changes: kilometres per hour." }],
        sentence:"From {from} to {to}, the {what} {dir} by {amt} per {per}, on average.",
        slots:{
          from:{ label:"start", chips:[{ t:"9:20", ok:true }, { t:"10:05", fb:"The trip starts at 9:20." }, { t:"12 km", fb:"Start and end are times: the interval is in the input, time." }, { t:"30 km", fb:"Start and end are times: the interval is in the input, time." }] },
          to:{ label:"end", chips:[{ t:"9:20", fb:"The trip ends at 10:05." }, { t:"10:05", ok:true }, { t:"12 km", fb:"Start and end are times: the interval is in the input, time." }, { t:"30 km", fb:"Start and end are times: the interval is in the input, time." }] },
          what:{ label:"what changes", chips:[{ t:"distance", ok:true }, { t:"time", fb:"Time is the input. The distance is what changes." }, { t:"speed", fb:"The distance is what changes; the speed says how fast." }] },
          dir:{ label:"which way", chips:[{ t:"rose", ok:true }, { t:"fell", fb:"The odometer went up, from 12 km to 30 km." }] },
          amt:{ label:"how much", chips:[{ t:"24 km", ok:true }, { t:"18 km", fb:"18 km is the whole change, over 45 minutes. Per hour it’s 24 km." }, { t:"0.4 km", fb:"18 ÷ 45 gives km per <strong>minute</strong>. Convert 45 min to 0.75 h." }, { t:"45 km", fb:"45 is the number of minutes, not a distance." }] },
          per:{ label:"per", chips:[{ t:"hour", ok:true }, { t:"kilometre", fb:"The units follow the division: kilometres per hour." }] }
        },
        alg:"9:20 to 10:05 is 45 min = 45/60 h = 0.75 h. `{30 - 12}/{0.75} = {18}/{0.75} = 24` km/h",
        done:"The distance rose by 24 km per hour, on average." },
      { id:"c3", name:"C3 Vase", kind:"sketch",
        prompt:"Water is poured at a steady rate into a vase that is narrow at the bottom and wide at the top. Which depth–time graph fits?",
        options:[
          { t:opt(sk(SK.line, "h"), "A straight rising line"), fb:"A steady pour raises the depth steadily only if the vase is the same width all the way up." },
          { t:opt(sk(SK.concaveUp, "h"), "Rising, gently at first and then more steeply"), fb:"That’s a vase wide at the bottom." },
          { t:opt(sk(SK.concaveDown, "h"), "Rising, steep at first and then less steep"), ok:true, fb:"Narrow at the bottom, so each second’s water makes a tall layer and the depth rises fast. Higher up the vase is wider, so the same water makes a thinner layer: the depth rises more slowly." },
          { t:opt(sk(SK.riseThenFlat, "h"), "Rising, then flat"), fb:"Flat would mean the depth stopped rising. The pour never stops, so the depth keeps rising, just more slowly." }],
        alg:"The pour adds the same volume every second. Near the bottom the vase is narrow, so that volume makes a tall layer; higher up it’s wide, so the same volume makes a thinner layer. The average rates over equal 10-second intervals get smaller:",
        done:"Rising, steep at first and then less steep: the graph is concave down." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Rates in context quick check",
      items:[
        { id:"q1", goal:1, prompt:"Average rate of `y = x^2` from `x = 1` to `x = 4`?",
          choices:[{ t:"3", fb:"(16 − 1) ÷ (4 − 1) = 5." }, { t:"5", ok:true, fb:"Right. (16 − 1) ÷ (4 − 1) = 5." }, { t:"15", fb:"(16 − 1) ÷ (4 − 1) = 5." }, { t:"16", fb:"(16 − 1) ÷ (4 − 1) = 5." }] },
        { id:"q2", goal:2, prompt:"Fuel `F` (L) against distance `d` (km): units of the average rate?",
          choices:[{ t:"L/km", ok:true, fb:"Right. Litres ÷ kilometres." }, { t:"km/L", fb:"Litres ÷ kilometres." }, { t:"L", fb:"Litres ÷ kilometres." }, { t:"km", fb:"Litres ÷ kilometres." }] },
        { id:"q3", goal:[3, 4], prompt:"The average rate of `f` on `[a, b]` is 0. What must be true?",
          choices:[{ t:"`f(a) = f(b)`", ok:true, fb:"Right. 0 only says the ends match." }, { t:"`f` is constant", fb:"0 only says the ends match. The ball in Explore wasn’t constant." }, { t:"`f(a) = 0`", fb:"0 only says the ends match. The ball in Explore wasn’t constant." }, { t:"`a = b`", fb:"0 only says the ends match. The ball in Explore wasn’t constant." }] },
        { id:"q4", goal:[4, 5], prompt:"Which kind of function has the same average rate on every interval?",
          choices:[{ t:"linear", ok:true, fb:"Right. Only a line’s secants all have the same slope." }, { t:"quadratic", fb:"Only a line’s secants all have the same slope." }, { t:"exponential", fb:"Only a line’s secants all have the same slope." }, { t:"sinusoidal", fb:"Only a line’s secants all have the same slope." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sign", type:"sorter", title:"Positive, zero or negative?", summary:"Positive, zero or negative?",
        instruction:"Sort each situation by the sign of its average rate over the interval given.", noun:"situation", goal:[1, 4], txt:true,
        boxes:[{ id:"p", label:"Positive" }, { id:"z", label:"Zero" }, { id:"n", label:"Negative" }],
        wrongDefault:SIGN,
        items:[
          { id:"i1", t:"`y = x^2` on `[-2, 2]`", answer:"z", why:"`f(2) = f(-2) = 4`.", wrong:zeroWrong,
            hints:["Find `f(-2)` and `f(2)`.", "`f(-2) = 4` and `f(2) = 4`.", "No net change: Zero."] },
          { id:"i2", t:"`y = x^3` on `[-2, 1]`", answer:"p", why:"(1 − (−8))/3 = 3.",
            hints:["Find `f(-2)` and `f(1)`.", "`f(-2) = -8` and `f(1) = 1`.", "It increased: (1 − (−8))/3 = 3. Positive."] },
          { id:"i3", t:"`y = -2x + 5` on `[0, 3]`", answer:"n", why:"A line with slope −2.",
            hints:["Find `f(0)` and `f(3)`.", "`f(0) = 5` and `f(3) = -1`.", "It decreased: a line with slope −2. Negative."] },
          { id:"i4", t:"Table: `t` = 0, 2, 4; `h` = 5, 9, 5; interval `[0, 4]`", answer:"z", why:"Same value at both ends.", wrong:zeroWrong,
            hints:["Read `h` at `t = 0` and at `t = 4`.", "`h` = 5 at both ends.", "No net change: Zero."] },
          { id:"i5", t:"“A ball is thrown up and caught at the same height.”", answer:"z", why:"Same height at the start and end.", wrong:zeroWrong,
            hints:["Compare the height at the start with the height at the end.", "It’s caught at the same height it was thrown from.", "No net change: Zero."] },
          { id:"i6", t:"`y = 2^x` on `[-3, -1]`", answer:"p", why:"1/2 − 1/8 > 0.",
            hints:["Find `2^{-3}` and `2^{-1}`.", "1/8 and 1/2.", "It increased: Positive."] },
          { id:"i7", t:"`y = (x - 1)(x - 5)` on `[1, 3]`", answer:"n", why:"From 0 to −4: (−4 − 0)/2 = −2.",
            hints:["Find `f(1)` and `f(3)`.", "`f(1) = 0` and `f(3) = (2)(-2) = -4`.", "It decreased: (−4 − 0)/2 = −2. Negative."] },
          { id:"i8", t:"“12 °C at 6 a.m., 9 °C at 9 a.m.”", answer:"n", why:"It cooled 1 °C per hour.",
            hints:["Compare the first temperature with the last.", "12 °C down to 9 °C over 3 hours.", "It cooled 3 °C in 3 hours: Negative."] },
          { id:"i9", t:"`y = x^3 - 4x` on `[-2, 2]`", answer:"z", why:"`f(-2) = f(2) = 0`.", wrong:zeroWrong,
            hints:["Find `f(-2)` and `f(2)`.", "`f(-2) = -8 + 8 = 0`; `f(2) = 8 - 8 = 0`.", "No net change: Zero."] },
          { id:"i10", t:"`y = -x^2 + 6x` on `[1, 4]`", answer:"p", why:"`f(1) = 5`, `f(4) = 8`: (8 − 5)/3 = 1.",
            hints:["Find `f(1)` and `f(4)`.", "`f(1) = -1 + 6 = 5`; `f(4) = -16 + 24 = 8`.", "It increased: (8 − 5)/3 = 1. Positive."] }
        ] },
      { id:"back", type:"numeric", title:"Work it backwards", summary:"Work it backwards", star:true, goal:[1, 2, 5],
        instruction:"Find each value. In the starred questions the unknown is inside the rate, so work backwards from it.",
        items:[
          { id:"r1", goal:1, prompt:"Average rate of `f(x) = x^2 - 3x` from `x = 1` to `x = 5`.", answer:3, display:"3",
            why:"`f(5) - f(1)` = 10 − (−2) = 12, and 12 ÷ 4 = 3.",
            wrong:[{ match:12, fb:"That’s `Δy`. Divide by `Δx = 4`." }],
            hints:["Find `f(1)` and `f(5)` first.", "`f(5) = 25 - 15 = 10` and `f(1) = 1 - 3 = -2`, so `Δy = 12` and `Δx = 4`.", "12 ÷ 4 = 3."] },
          { id:"r2", goal:1, prompt:"Average rate of `f(x) = 3^x` from `x = 0` to `x = 2`.", answer:4, display:"4",
            why:"(9 − 1) ÷ 2 = 4.",
            wrong:[{ match:8, fb:"Divide by 2." }, { match:4.5, fb:"That’s `f(2)/2`." }],
            hints:["Find `f(0)` and `f(2)`.", "`3^0 = 1` and `3^2 = 9`: `Δy = 8`, `Δx = 2`.", "8 ÷ 2 = 4."] },
          { id:"r3", goal:1, star:true, prompt:"`f(x) = x^2 + bx` has average rate 7 from `x = 1` to `x = 3`. Find `b`.", answer:3, display:"`b = 3`",
            why:"(9 + 3`b` − 1 − `b`)/2 = 4 + `b` = 7.",
            wrong:[{ match:7, fb:"That’s the rate, not `b`. (9 + 3`b` − 1 − `b`)/2 = 4 + `b`." }],
            hints:["Write the rate with `b` in it.", "`f(3) = 9 + 3b` and `f(1) = 1 + b`, so the rate is (9 + 3`b` − 1 − `b`)/2 = 4 + `b`.", "4 + `b` = 7, so `b` = 3."] },
          { id:"r4", goal:[1, 2], star:true, prompt:"The average rate of `f` from 0 to 4 is 5, and `f(0) = 2`. Find `f(4)`.", answer:22, display:"`f(4) = 22`",
            why:"The change is 5 × 4 = 20, so `f(4)` = 2 + 20.",
            wrong:[{ match:20, fb:"That’s the change. Add it to `f(0)`." }, { match:7, fb:"That adds the rate once." }],
            hints:["Rate × run = change.", "The change is 5 × 4 = 20.", "`f(4) = f(0) + 20` = 2 + 20 = 22."] },
          { id:"r5", goal:[2, 5], star:true, prompt:"A car averages 60 km/h for 2 h, then 90 km/h for 1 h. What is its average speed for the whole 3 h?", answer:70, display:"70 km/h", unit:"km/h",
            why:"Total distance 120 km + 90 km = 210 km, in 3 h.",
            wrong:[{ match:75, fb:"That averages the two speeds, but the car spent twice as long at 60. Total distance 210 km ÷ 3 h." }],
            hints:["Average speed = total distance ÷ total time.", "120 km + 90 km in 3 h.", "210 ÷ 3 = 70 km/h."] },
          { id:"r6", goal:[1, 5], star:true, prompt:"For `f(x) = x^2`, find `a` so that the average rate from `a` to `a + 2` is 10.", answer:4, display:"`a = 4`",
            why:"`((a + 2)^2 - a^2)/2 = 2a + 2`, and 2(4) + 2 = 10.",
            wrong:[{ match:5, fb:"`((a + 2)^2 - a^2)/2 = 2a + 2`, so `2a + 2 = 10`." }],
            hints:["Write the rate in terms of `a`.", "`((a + 2)^2 - a^2)/2 = (4a + 4)/2`.", "`2a + 2 = 10`, so `a = 4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ethan", how:"", goal:[1, 2, 5],
        instruction:"Ethan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Average rate of `h(t) = -5t^2 + 25t` (m) from `t` = 1 to `t` = 3 s.",
            steps:["`h(1) = 20`.", "`h(3) = 30`.", "Rate = (30 − 20)/(1 − 3) = −5 m/s.", "So the height fell 5 m per second."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 uses step 3. The mistake is earlier."],
            fixes:[
              { t:"(30 − 20)/(3 − 1) = 5 m/s: it rose 5 m per second on average.", ok:true, why:"Subtract in the same order: `(y_2 - y_1)/(x_2 - x_1)`." },
              { t:"(1 − 3)/(30 − 20) = −0.2.", why:"Rate of `y` per unit of `x`: change in `y` on top, change in `x` underneath." },
              { t:"30/3 = 10 m/s.", why:"A rate compares two <strong>changes</strong>. `h(3) = 30` is a height; the rate needs `h(3) - h(1)`." },
              { t:"Step 3 is correct.", why:"The top subtracts later minus earlier; the bottom must too." }],
            hints:["Check the order of subtraction.", "Top: 30 − 20 (later − earlier). Bottom?", "3 − 1 = 2: 5 m/s."] },
          { id:"e2", goal:2, task:"A car’s tank has 40 L at 0 km and 28 L at 150 km. Find and interpret the average rate.",
            steps:["`ΔF` = 28 − 40 = −12 L.", "`Δd` = 150 km.", "Rate = −12 ÷ 150 = −0.08.", "Units: km/L.", "So the car uses 0.08 km per litre."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 uses step 4. The mistake is earlier."],
            fixes:[
              { t:"Units L/km: the car uses 0.08 L each kilometre, on average.", ok:true, why:"The units follow the division: litres ÷ kilometres = L/km." },
              { t:"Units L: it used 0.08 L.", why:"The rate compares two changes." },
              { t:"Units km: it drove 0.08 km.", why:"The rate compares two changes: litres per kilometre." },
              { t:"Step 4 is correct.", why:"L ÷ km = L/km." }],
            hints:["What did you divide by what?", "Litres ÷ kilometres.", "L/km."] },
          { id:"e3", goal:5, task:"A runner averages 12 km/h for 1 h, then 6 km/h for 2 h. Average speed overall?",
            steps:["First part: 12 km/h.", "Second part: 6 km/h.", "Average speed = (12 + 6)/2 = 9 km/h."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Total distance 12 + 12 = 24 km in 3 h: 8 km/h.", ok:true, why:"The average rate over a whole trip is total change ÷ total time, not the mean of the separate rates (unless the times are equal)." },
              { t:"(12 + 6)/3 = 6 km/h.", why:"That divides the sum of two speeds by the time." },
              { t:"12 × 6 ÷ 18 = 4 km/h.", why:"Average speed = total distance ÷ total time: 24 km in 3 h." },
              { t:"Step 3 is correct.", why:"Averaging speeds only works for equal times; the runner spent 2 h at 6 km/h." }],
            hints:["Average speed = total distance ÷ total time.", "12 km in the first hour, 12 km in the next two.", "24 ÷ 3 = 8."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the secant lab: the ball’s 0 m/s, or the bacteria’s 16 times?" },
      { id:"j2", q:"In your own words, what does an average rate of change tell you, and what does it hide?" },
      { id:"j3", q:"Explain to a friend how to find an average speed for a trip with two parts." },
      { id:"j4", q:"Which still trips you up: the order of subtraction, units, or averaging rates? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Average rate of change of `f(x) = x^2 + 1` from `x = 1` to `x = 3`?", options:[
          { t:"4", ok:true, why:"(10 − 2)/(3 − 1) = 4." },
          { t:"1/4", why:"`Δy` on top: 8/2." },
          { t:"6", why:"That’s the average of the values 2 and 10." },
          { t:"10", why:"That’s `f(3)`, a value." }] },
        b:{ prompt:"Average rate of change of `f(x) = 2x^2` from `x = 1` to `x = 4`?", options:[
          { t:"10", ok:true, why:"(32 − 2)/(4 − 1) = 10." },
          { t:"1/10", why:"`Δy` on top: 30/3." },
          { t:"17", why:"That’s the average of the values 2 and 32." },
          { t:"32", why:"That’s `f(4)`, a value." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`V(t)` is a bath’s volume in litres after `t` minutes. What are the units of its average rate of change?", options:[
          { t:"L/min", ok:true, why:"The units follow the division: litres ÷ minutes = L/min." },
          { t:"min/L", why:"Litres ÷ minutes." },
          { t:"L", why:"A rate compares two quantities." },
          { t:"L·min", why:"Rates divide." }] },
        b:{ prompt:"`C(n)` is the cost in dollars of `n` tickets. What are the units of its average rate of change?", options:[
          { t:"$/ticket", ok:true, why:"The units follow the division: dollars ÷ tickets = $/ticket (dollars per ticket)." },
          { t:"tickets/$", why:"Dollars ÷ tickets." },
          { t:"$", why:"A rate compares two quantities." },
          { t:"$·tickets", why:"Rates divide." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The average rate of change of `f` from `x = 2` to `x = 6` equals…", options:[
          { t:"the slope of the secant line through (2, `f(2)`) and (6, `f(6)`)", ok:true, why:"The secant joins the two points, and its slope is `Δy/Δx`: the average rate." },
          { t:"the slope of the tangent line at `x = 4`", why:"That’s an instantaneous rate (module 09)." },
          { t:"`(f(2) + f(6))/2`", why:"That’s an average of values." },
          { t:"`f(6) - f(2)`", why:"That’s `Δy`; divide by `Δx = 4`." }] },
        b:{ prompt:"The slope of the secant line through (−1, `f(-1)`) and (3, `f(3)`) equals…", options:[
          { t:"the average rate of change of `f` from `x = -1` to `x = 3`", ok:true, why:"A secant’s slope is `Δy/Δx` between its two points: the average rate." },
          { t:"the instantaneous rate of change at `x = 1`", why:"That’s a tangent slope (module 09)." },
          { t:"`(f(3) - f(-1))/2`", why:"The run is 3 − (−1) = 4." },
          { t:"`f(3)/3`", why:"That’s a value divided by an input." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"A ball’s height is `h(t) = -5t^2 + 40t` metres. Which interval has the greatest average rate of change?", options:[
          { t:"`[0, 2]`", ok:true, why:"(60 − 0)/2 = 30 m/s. The others: `[2, 4]`: 10; `[1, 7]`: 0; `[4, 8]`: −20." },
          { t:"`[2, 4]`", why:"It ends at the highest point, but it’s only 10 m/s." },
          { t:"`[1, 7]`", why:"The longest interval, but `h(1) = h(7) = 35`: rate 0." },
          { t:"`[4, 8]`", why:"Its change is large (80 m) but downward: −20 m/s." }] },
        b:{ prompt:"A bacteria count is `N(t) = 100 · 2^t`. Which interval has the greatest average rate of change?", options:[
          { t:"`[2, 3]`", ok:true, why:"(800 − 400)/1 = 400 per hour. The others: `[0, 3]`: 700/3 ≈ 233; `[0, 2]`: 150; `[1, 2]`: 200." },
          { t:"`[0, 3]`", why:"It has the largest total change (700), but over 3 hours." },
          { t:"`[0, 2]`", why:"300 over 2 hours: 150 per hour." },
          { t:"`[1, 2]`", why:"200 per hour; growth is faster later." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A car pulls away from a stop sign, speeds up, then drives at a steady speed. Which distance–time graph fits?", options:[
          { t:opt(sk(SK.upThenLine, "d"), "Curving upward (getting steeper), then a straight rising line"), ok:true, why:"Speeding up makes the graph steeper and steeper; a steady speed is a straight rising line." },
          { t:opt(sk(SK.line, "d"), "A straight rising line from the start"), why:"That’s a steady speed from the start." },
          { t:opt(sk(SK.steepThenFlat, "d"), "Steep at first, flattening, then flat"), why:"That’s slowing to a stop." },
          { t:opt(sk(SK.upThenFlat, "d"), "Curving upward, then flat"), why:"Flat means stopped, not steady speed." }] },
        b:{ prompt:"A hot drink cools quickly at first, then more and more slowly. Which temperature–time graph fits?", options:[
          { t:opt(sk(SK.coolFast, "T"), "Falling, steep at first and flattening out"), ok:true, why:"Cooling quickly is a steep fall; cooling more and more slowly makes the graph flatten." },
          { t:opt(sk(SK.coolLine, "T"), "A straight falling line"), why:"That’s cooling at a steady rate." },
          { t:opt(sk(SK.coolSlowFirst, "T"), "Falling, gently at first and then more steeply"), why:"That’s cooling faster and faster." },
          { t:opt(sk(SK.riseFlatten, "T"), "Rising and flattening"), why:"The drink is cooling: the graph falls." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"`f(x) = x^2 + bx` has an average rate of change of 9 from `x = 2` to `x = 5`. Find `b`.", options:[
          { t:"−4", why:"That forgets to divide by `Δx = 3`: 21 + 3`b` = 9." },
          { t:"2", ok:true, why:"((25 + 5`b`) − (4 + 2`b`))/3 = 7 + `b` = 9." },
          { t:"4", why:"That uses `f(5)/5 = 5 + b`." },
          { t:"9", why:"9 is the rate, not `b`." }] },
        b:{ prompt:"`f(x) = x^2 + bx` has an average rate of change of 4 from `x = -1` to `x = 3`. Find `b`.", options:[
          { t:"−1", why:"That forgets to divide by `Δx = 4`: 8 + 4`b` = 4." },
          { t:"1", why:"That uses `f(3)/3 = 3 + b`." },
          { t:"2", ok:true, why:"((9 + 3`b`) − (1 − `b`))/4 = 2 + `b` = 4." },
          { t:"4", why:"4 is the rate, not `b`." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"`P(t)` is a town’s population in year `t`. Its average rate of change from 2015 to 2020 is −120 people per year. Which statement is best?", options:[
          { t:"“From 2015 to 2020 the population fell by 600 in total, an average of 120 people per year.”", ok:true, why:"Over 5 years at −120 people per year, the total change is −600." },
          { t:"“In 2020 the population was −120.”", why:"−120 is a rate, not a population." },
          { t:"“The population fell by exactly 120 every year.”", why:"An average doesn’t say each year was the same." },
          { t:"“The population fell by 120 in total.”", why:"That’s one year’s worth; over 5 years it’s 600." }] },
        b:{ prompt:"`V(t)` is a reservoir’s volume in megalitres in week `t`. Its average rate of change from week 2 to week 6 is 35 ML per week. Which statement is best?", options:[
          { t:"“Over those 4 weeks the volume rose by 140 ML, an average of 35 ML per week.”", ok:true, why:"Over 4 weeks at 35 ML per week, the total change is 140 ML." },
          { t:"“In week 6 the volume was 35 ML.”", why:"35 is a rate, not a volume." },
          { t:"“The volume rose by exactly 35 ML every week.”", why:"An average doesn’t say each week was the same." },
          { t:"“The volume rose by 35 ML in total.”", why:"Over 4 weeks it’s 140 ML." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which expression is the average rate of change of `f` from `x = a` to `x = b`?", options:[
          { t:"`{f(b) - f(a)}/{b - a}`", ok:true, why:"Change in `f` on top, change in `x` underneath, subtracted in the same order." },
          { t:"`{b - a}/{f(b) - f(a)}`", why:"Rate of `y` per unit of `x`: change in `y` on top, change in `x` underneath." },
          { t:"`{f(b) - f(a)}/{a - b}`", why:"Subtract in the same order: `(y_2 - y_1)/(x_2 - x_1)`." },
          { t:"`{f(a) + f(b)}/2`", why:"That averages two values. A rate divides a change in `f` by a change in `x`." }] },
        b:{ prompt:"Which expression is the average rate of change of `f` from `x = 3` to `x = 7`?", options:[
          { t:"`{f(7) - f(3)}/4`", ok:true, why:"Change in `f` on top; underneath, `Δx` = 7 − 3 = 4." },
          { t:"`4/{f(7) - f(3)}`", why:"Rate of `y` per unit of `x`: change in `y` on top, change in `x` underneath." },
          { t:"`{f(7) - f(3)}/{-4}`", why:"Subtract in the same order: 7 − 3 = 4 underneath." },
          { t:"`{f(7) + f(3)}/2`", why:"That averages two values. A rate divides a change in `f` by a change in `x`." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A tide’s height is 1.2 m at 6:00, 3.0 m at 9:00 and 0.8 m at 14:00. What is the average rate of change from 6:00 to 14:00?", options:[
          { t:"−0.05 m/h", ok:true, why:"(0.8 − 1.2) ÷ 8 h = −0.4 ÷ 8." },
          { t:"0.6 m/h", why:"That’s 6:00 to 9:00 only." },
          { t:"−0.4 m/h", why:"That’s the change; divide by 8 h." },
          { t:"−20 h/m", why:"Height change on top." }] },
        b:{ prompt:"A culture has 300 bacteria at 1 h, 1200 at 3 h and 4800 at 5 h. What is the average rate of change from 1 h to 5 h?", options:[
          { t:"1125 bacteria per hour", ok:true, why:"(4800 − 300) ÷ 4." },
          { t:"450 bacteria per hour", why:"That’s 1 h to 3 h only." },
          { t:"4500 bacteria per hour", why:"That’s the change; divide by 4 h." },
          { t:"1/1125 h per bacterium", why:"Bacteria change on top." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A phone plan has cost $45 in total after 3 months and $117 after 9 months. If the average rate continues, what will the total be after 13 months?", options:[
          { t:"$165", ok:true, why:"Rate (117 − 45)/6 = $12 per month; 4 more months: 117 + 48." },
          { t:"$169", why:"That uses 117 ÷ 9 = 13 as the rate." },
          { t:"$156", why:"That multiplies 12 by 13, ignoring the $117 already paid and the start." },
          { t:"$129", why:"That adds only one month." }] },
        b:{ prompt:"A tank holds 950 L at minute 4 and 650 L at minute 10. If the average rate continues, how much will it hold at minute 16?", options:[
          { t:"350 L", ok:true, why:"Rate −300/6 = −50 L/min; 6 more minutes: 650 − 300." },
          { t:"260 L", why:"That uses 650 ÷ 10 = 65 as the rate." },
          { t:"−800 L", why:"That multiplies −50 by 16, ignoring the 650 L." },
          { t:"600 L", why:"That subtracts only one minute." }] } }
    ]
  },
  task:{
    title:"Plan the road trip", summary:"Plan the road trip",
    statement:"<p>Design a 4-hour trip (distance from home at `t` = 0, 1, 2, 3, 4 h) that matches the whole plan. There are many answers. Can you find more than one?</p>" +
      '<div class="refresh" style="margin:0 0 12px"><h4>The plan</h4><ol class="rt-plan"><li>Average speed for the whole trip: 50 km/h.</li><li>Average speed for the first 2 hours: 40 km/h.</li><li>One full hour is a rest stop (average rate 0).</li><li>The car never moves back toward home.</li><li>No single hour averages more than 100 km/h.</li></ol></div>' +
      '<p class="tiny muted">Enter the distance from home, in km, at the end of each hour: a multiple of 10 from 0 to 300. The trip starts at home, so `d(0) = 0`.</p>',
    checks:["Whole trip 50 km/h", "First 2 h: 40 km/h", "A rest hour", "Never back toward home", "No hour over 100 km/h"],
    tips:["`d(4)` must be 4 × 50.", "`d(2)` must be 2 × 40.", "One hour’s distance must not change.", "Your distance drops between {t} and {t1}.", "Hour {i} averages {v} km/h. If the rest hour is in the second half, the other hour must cover 120 km."],
    explainPrompt:"Explain why the rest stop had to be in the first two hours.",
    vocab:"Use the words average rate, total distance and total time.",
    success:"Your trip matches the whole plan!",
    after3:"Notice the rest stop always lands in the first two hours: in the last two hours the car must cover 120 km, and with a stop that would mean 120 km/h for one hour."
  },
  cards:[
    ["Average rate of change", "`{f(b) - f(a)}/{b - a} = {Δy}/{Δx}`."],
    ["Secant line", "The line through two points of a graph. Its slope is the average rate of change between them."],
    ["Units of a rate", "(units of `y`) per (units of `x`): m/s, L/min, $/item."],
    ["Average rate 0", "The function has the same value at both ends. It may have changed in between."],
    ["Constant average rate on every interval", "Only linear functions."],
    ["Same order on top and bottom", "`(y_2 - y_1)/(x_2 - x_1)`. Mixing orders flips the sign."],
    ["Average speed for a trip in parts", "Total distance ÷ total time, not the mean of the speeds."],
    ["Exponential growth and rates", "Equal steps in `x` give growing changes: `200 · 2^t` changes by 200, 400, 800, … per hour."],
    ["Steeper vs higher", "Rate is steepness between two points, not how high the graph is."],
    ["Converting time", "45 min = 0.75 h. Convert before giving a per-hour rate."],
    ["Concave down rising graph", "Rising, but more and more slowly: average rates on later intervals are smaller."],
    ["Predicting with an average rate", "New value = known value + rate × (change in input)."]
  ]
};
