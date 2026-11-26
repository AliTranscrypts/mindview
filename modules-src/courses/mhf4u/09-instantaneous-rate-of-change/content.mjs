// MHF4U 09 Instantaneous Rate of Change. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/09-instantaneous-rate-of-change.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

export default {
  id:"09-instantaneous-rate-of-change",
  kind:"topic",
  title:"Instantaneous rate of change",
  topic:"Instantaneous Rate of Change",
  readyTopic:"instantaneous rates of change",
  hero:{
    eq:'<span style="font-style:normal">slope = ?</span>', eqLabel:"slope equals what?", eqSize:"md",
    headline:"How fast, right now?",
    text:"A speedometer shows your speed at this instant, not your average for the trip. On a graph, the <strong>instantaneous rate of change</strong> at a point is the slope of the <strong>tangent</strong> there. You can’t compute a slope from one point, so you <strong>estimate</strong> it: take secants from `P` to closer and closer points `Q`, and watch their slopes settle.",
    fig:{ html:'<div class="hero-sec"><canvas class="plot square" id="hero-plot" role="img" aria-label="The parabola y = x squared with a fixed point P at (3, 9). A point Q slides toward P along the curve and the secant through P and Q is redrawn at each stop."></canvas><div id="hero-tbl" class="hero-tbl" aria-live="polite"></div></div>' }
  },
  goals:[
    "I can estimate an instantaneous rate of change using secants over shrinking intervals.",
    "I can explain the instantaneous rate as the slope of the tangent, and the average rate as the slope of a secant.",
    "I can tell from a graph where the instantaneous rate is positive, negative or zero.",
    "I can interpret an instantaneous rate with units in a real situation.",
    "I can compare instantaneous and average rates, and use centred intervals for better estimates.",
    "I can sketch or choose a graph from a description of how its rate changes."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Average rate", goal:2,
          prompt:"Average rate of change of `f(x) = x^2` from `x = 3` to `x = 5`?",
          options:[
            { t:"1/8", why:"`Δy` on top." },
            { t:"8", ok:true, why:"(25 − 9)/(5 − 3) = 16/2." },
            { t:"16", why:"16 is `Δy`." },
            { t:"17", why:"(9 + 25)/2 is an average of heights." }],
          hints:["Find `f(3)` and `f(5)`.", "9 and 25; `Δx` = 2.", "16 ÷ 2 = 8."] },
        { id:"w2", skill:"Average rate", goal:2,
          prompt:"A secant through (1, 4) and (1.5, 5) has what slope?",
          options:[
            { t:"0.5", why:"Rise ÷ run: 1 ÷ 0.5." },
            { t:"1", why:"Divide by the run, 0.5." },
            { t:"2", ok:true, why:"1 ÷ 0.5 = 2." },
            { t:"5", why:"5 is a `y`-value." }],
          hints:["Rise and run?", "Rise 1, run 0.5.", "1 ÷ 0.5 = 2."] },
        { id:"w3", skill:"Decimals", goal:1,
          prompt:"What is 3.1²?",
          options:[
            { t:"6.2", why:"Squaring means 3.1 × 3.1." },
            { t:"9.01", why:"(3 + 0.1)² = 9 + 2(3)(0.1) + 0.01." },
            { t:"9.1", why:"0.1 also matters: 3.1² = 9 + 0.6 + 0.01." },
            { t:"9.61", ok:true, why:"3.1 × 3.1 = 9.61." }],
          hints:["Write 3.1 as 3 + 0.1.", "(3 + 0.1)² = 9 + 0.6 + 0.01.", "9.61."] },
        { id:"w4", skill:"Decimals", goal:1,
          prompt:"What is 0.61 ÷ 0.1?",
          options:[
            { t:"0.061", why:"÷ 0.1 makes it bigger." },
            { t:"0.51", why:"Divide, don’t subtract." },
            { t:"6.1", ok:true, why:"Dividing by 0.1 multiplies by 10." },
            { t:"61", why:"That’s ÷ 0.01." }],
          hints:["How many 0.1s are in 0.61?", "÷ 0.1 is × 10.", "6.1."] },
        { id:"w5", skill:"Reading graphs", goal:3,
          prompt:"On a distance–time graph, the curve gets steeper as time goes on. What is happening?",
          options:[
            { t:"It is slowing down.", why:"A steeper graph covers more distance each second." },
            { t:"The object is speeding up.", ok:true, why:"Steeper means more distance per unit of time." },
            { t:"It is moving at a steady speed.", why:"Steady speed would be a straight line." },
            { t:"It is going back toward the start.", why:"Going back would make the distance fall." }],
          hints:["Steepness = speed.", "Is the steepness growing?", "Yes: speeding up."] },
        { id:"w6", skill:"Reading graphs", goal:3,
          prompt:"At the top of a hill-shaped graph, which way does the graph go just before and just after?",
          options:[
            { t:"Down before, up after", why:"That’s a low point." },
            { t:"Level on both sides", why:"Only at the very top is it level." },
            { t:"Up just before, down just after", ok:true, why:"The peak is where rising turns into falling." },
            { t:"Up on both sides", why:"After the top it must fall." }],
          hints:["Trace the hill with your finger.", "Climb, top, descend.", "Up, then down."] }
      ],
      refreshers:{
        "Average rate":"`{f(b) - f(a)}/{b - a}`: the slope of the secant through the two points.",
        "Decimals":"Squaring 3 + 0.1 gives 9 + 0.6 + 0.01 = 9.61. Dividing by 0.1 multiplies by 10; by 0.01, by 100.",
        "Reading graphs":"Steeper means changing faster. At a peak or valley the graph is momentarily level."
      }
    }
  },
  explore:{
    heading:"Secant-to-tangent zoom",
    intro:"`P` stays put. Slide `Q` toward it and watch the secant slopes settle in the table. Then zoom in on `P` until the curve looks straight.",
    predictions:[
      { id:"p1", start:{ fn:"sq", P:3, mag:"1", side:1, cen:false, mode:"sec", rows:["1"] },
        prompt:"`y = x^2`, `P` = (3, 9), `h` = 1. `Q` will move to 3.1, then 3.01. What will the secant slopes do?",
        options:[{ t:"Shrink toward 0" }, { t:"Settle toward 6", ok:true }, { t:"Settle toward 9" }, { t:"Grow without limit" }],
        explain:"The slope from 3 to 3 + `h` works out to 6 + `h`. As `h` shrinks, 6 + `h` → 6. 9 is the height, not the slope." },
      { id:"p2", start:{ fn:"sq", P:3, mag:"0.01", side:1, cen:false, mode:"sec", rows:["1", "0.1", "0.01"] },
        prompt:"Same graph, `h` = 0.01. What happens if `Q` lands exactly on `P` (`h` = 0)?",
        options:[{ t:"The slope is 0" }, { t:"The slope is exactly 6" }, { t:"No slope can be found: 0 ÷ 0", ok:true }, { t:"The slope is infinite" }],
        explain:"A secant needs two different points. That’s why the instantaneous rate is estimated with tiny gaps, never `h` = 0." },
      { id:"p3", start:{ fn:"cube", P:2, mag:"1", side:1, cen:false, mode:"zoom", zoom:1 },
        prompt:"`y = x^3`, `P` = (2, 8), Zoom mode. Zoom ×1000 on `P`. What will you see?",
        options:[{ t:"A flat line" }, { t:"A small cubic shape" }, { t:"A vertical line" }, { t:"An almost straight line, slope about 12", ok:true }],
        explain:"Close enough, a smooth curve is indistinguishable from its tangent. Its slope there is the instantaneous rate: 12." },
      { id:"p4", start:{ fn:"sq", P:3, mag:"0.5", side:1, cen:true, mode:"sec", rows:[] },
        prompt:"`y = x^2`, `P` = (3, 9), Centred on. What is the slope of the secant from 2.9 to 3.1?",
        options:[{ t:"5.9" }, { t:"6", ok:true }, { t:"6.1" }, { t:"9" }],
        explain:"For a parabola, a secant centred on `P` has exactly the tangent’s slope. For other curves it’s usually much closer than a one-sided secant." }
    ],
    challenges:[
      { id:"tc1", goal:[1, 5], prompt:"Ball: choose `h` so the secant slope from `t = 1` is within 0.1 m/s of the instantaneous rate.",
        why:"The slope from 1 to 1 + `h` is 10 − 5`h`, so it’s within 0.1 of 10 m/s when |5`h`| ≤ 0.1: `h` = ±0.01 or ±0.001.",
        general:"Check the secant slope against the value the table settles on.",
        hints:["Watch how far the slope is from the value it’s settling on.", "It settles on 10 m/s.", "`h` = 0.01 gives 9.95: within 0.1."] },
      { id:"tc2", goal:1, prompt:"`y = x^3`: find <strong>every</strong> whole-number `x` from −2 to 2 where the instantaneous rate is 12. Pin each one.",
        why:"At `x = 2` the slopes settle on 12, and the half-turn symmetry gives the same slope at `x = -2`. At −1 and 1 they settle on 3, and at 0 the curve is level.",
        hints:["Use the secant table at each whole number.", "At `x = 2` the slopes settle on 12.", "The half-turn symmetry gives the same slope at `x = -2`."] },
      { id:"tc3", goal:[5, 2], stretch:true,
        prompt:"On `y = x^2 - 4x`, put `P` where the instantaneous rate is 0. Then place two points `A` and `B` (on the 0.5 grid, neither at `P`) so the <strong>secant</strong> `AB` also has slope 0.",
        why:"Points at equal distances from the vertex are at equal heights, so the secant `AB` is level: an average rate of 0, like the instantaneous rate at 2. But it’s a different line from the tangent `y = -4`.",
        hints:["Rate 0 at a vertex. Where’s the vertex?", "`x = 2`. A secant has slope 0 when its ends are at equal heights.", "`A` = 1, `B` = 3: both at −3. The average rate on [1, 3] is 0, like the instantaneous rate at 2, but the secant is the line `y = -3`, not the tangent `y = -4`."] }
    ]
  },
  part3:{
    slug:"sign", name:"Sign", heading:"Sign of the rate",
    intro:"Drag the tangent along the curve. Watch the slope tracker below. Then mark where the rate is positive, negative and zero.",
    rounds:[
      { id:"r1", name:"Round 1", eq:"`f(x) = x^3 - 3x`", note:"Local maximum (−1, 2), local minimum (1, −2).",
        value:"That’s where the <strong>value</strong> is {sign}. The rate is about rising or falling.",
        why:"The graph rises on `(-∞, -1) ∪ (1, ∞)`, falls on `(-1, 1)` and is level at the turning points `x = -1` and 1. The value is negative on `(-∞, -√3) ∪ (0, √3)`: a different set." },
      { id:"r2", name:"Round 2", eq:"`g(x) = x^4 - 4x^3`", note:"Level at (0, 0), local minimum (3, −27).",
        value:"That’s where the <strong>value</strong> is {sign}. The rate is about rising or falling.",
        special:"The rate is 0 at `x = 0`, but the graph keeps falling on both sides. Zero rate doesn’t always mean a turn.",
        why:"The rate is 0 at `x = 0` and `x = 3`. At 3 the graph turns; at 0 it only levels off, falling on both sides." },
      { id:"r3", name:"Round 3", eq:"A walker’s distance–time graph", note:"The walker speeds up from rest, then slows to a stop at `t` = 10 min.",
        value:"That’s where the <strong>value</strong> is {sign}. The rate is about rising or falling.",
        special:"Distance never falls, so the rate is never negative here.",
        why:"The walker moves forward the whole time (rate positive on `(0, 10)`), fastest at `t` = 5 min, and is at rest at `t = 0` and `t = 10`." }
    ],
    blocks:[{ title:"What the tracker shows", html:"<p>Where the tracker is above its 0 line, the graph is rising; below, falling; on it, level. The tracker crosses 0 at turning points, and touches 0 without crossing where the graph levels off without turning.</p>" }],
    quickCheck:{
      title:"Quick check", summary:"Sign of the rate quick check",
      items:[
        { id:"q1", goal:3, prompt:"At a local maximum, the instantaneous rate is…",
          choices:[{ t:"positive", fb:"The tangent at a peak is horizontal." }, { t:"negative", fb:"The tangent at a peak is horizontal." }, { t:"0", ok:true, fb:"Right. The tangent at a peak is horizontal: slope 0." }, { t:"undefined", fb:"The tangent at a peak is horizontal." }] },
        { id:"q2", goal:3, prompt:"A graph is below the `x`-axis and rising. Its rate is…",
          choices:[{ t:"positive", ok:true, fb:"Right. Rising means positive rate, whatever the height." }, { t:"negative", fb:"Rising means positive rate, whatever the height." }, { t:"0", fb:"Rising means positive rate, whatever the height." }, { t:"undefined", fb:"Rising means positive rate, whatever the height." }] },
        { id:"q3", goal:1, prompt:"Secant slopes 3.9, 3.99, 3.999 estimate a rate of about…",
          choices:[{ t:"0", fb:"They settle on 4." }, { t:"3.9", fb:"They settle on 4." }, { t:"3.999", fb:"They settle on 4." }, { t:"4", ok:true, fb:"Right. They settle on 4." }] },
        { id:"q4", goal:3, prompt:"Instantaneous rate 0 at `x = 2` means…",
          choices:[{ t:"`f(2) = 0`", fb:"Rate 0 is about the slope, not the value." }, { t:"the tangent at `x = 2` is horizontal", ok:true, fb:"Right. Rate 0 is about the slope, not the value." }, { t:"`f` is constant", fb:"Rate 0 is about the slope, not the value." }, { t:"the graph crosses the axis at 2", fb:"Rate 0 is about the slope, not the value." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tap", type:"custom", title:"Tap the point", summary:"Tap the point", goal:[3, 5],
        instruction:"Tap the point the question asks for. The tangent tool appears where you tap, so you can check.",
        how:"Tap the graph or move the point with the arrow keys, then press Check. Answers within 0.15 of the right value count.",
        wrongTap:"At {v} = {x} the tangent’s slope is about {m}.",
        missing:"Those are right, but there’s another point. Tap every point the question asks for.",
        items:[
          { id:"t1", goal:3, g:"cubic", multi:true, prompt:"`y = x^3 - 3x`. Tap every point where the rate is 0.", answer:[-1, 1],
            why:"The tangent is horizontal at the turning points (−1, 2) and (1, −2).",
            hints:["Rate 0 means the tangent is horizontal.", "Look for the peak and the valley.", "The turning points are at `x = -1` and `x = 1`: tap both."] },
          { id:"t2", goal:3, g:"ball", prompt:"Ball `h(t) = -5t^2 + 20t + 1`. Tap where the ball’s speed is 0.", answer:[2],
            why:"At the peak (2, 21) the tangent is flat: the ball stops rising and starts to fall.",
            hints:["Speed 0 means the height isn’t changing at that instant.", "That happens at the top of the flight, where the tangent is flat.", "The peak is at `t` = 2 s."] },
          { id:"t3", goal:5, g:"square", prompt:"`y = x^2` on [0, 4]. Tap where the instantaneous rate equals the average rate over [0, 4].", answer:[2],
            why:"Both are 4: the average rate is (16 − 0)/4 = 4, and the tangent at `x = 2` has slope 4.",
            hints:["Find the average rate over [0, 4] first.", "(16 − 0)/4 = 4.", "Find where the tangent slope is 4: at `x = 2`."] },
          { id:"t4", goal:3, g:"walker", prompt:"Walker graph (Part 3, round 3). Tap where the walker is moving fastest.", answer:[5],
            high:"Highest distance isn’t fastest; the steepest point is.",
            why:"The steepest point is at `t` = 5 min, where the walker covers about 150 m per minute.",
            hints:["Speed is the slope of the distance–time graph.", "Find where the graph is steepest, not where it’s highest.", "The graph is steepest halfway, at `t` = 5 min."] },
          { id:"t5", goal:3, g:"hill", prompt:"`y = -x^2 + 6x`. Tap where the rate is −2.", answer:[4],
            why:"Right of the vertex the graph falls, and at `x = 4` the slopes settle on −2.",
            hints:["Use the tangent tool and read the slope.", "Left of the vertex (3, 9) the rate is positive; right, negative.", "At `x = 4` the slope settles on −2."] },
          { id:"t6", goal:3, g:"cube", multi:true, prompt:"`y = x^3`. Tap every point where the rate is 3.", answer:[-1, 1],
            why:"At `x = -1` and `x = 1` the tangent’s slope is 3: the half-turn symmetry makes the slopes match.",
            hints:["Use the tangent tool and read the slope.", "`y = x^3` has half-turn symmetry, so a point on one side has a partner on the other with the same slope.", "At `x = 1` the slopes settle on 3, and so do they at `x = -1`."] }
        ] },
      { id:"secant", type:"numeric", title:"Secant tables", summary:"Secant tables", star:true, goal:[1, 4, 5],
        instruction:"Work out each secant slope or estimate by hand. A “Use these values” box gives any power you need.",
        how:"Type your answer, then press Check. Decimals and fractions are fine.",
        items:[
          { id:"s1", goal:1, prompt:"`f(x) = x^2`. Slope of the secant from 5 to 5.1?", use:"5.1² = 26.01", answer:10.1, display:"10.1",
            why:"(26.01 − 25) ÷ 0.1 = 1.01 ÷ 0.1 = 10.1.",
            wrong:[{ match:1.01, fb:"Divide by 0.1." }, { match:26.01, fb:"That’s a value." }],
            hints:["Find `f(5)` and `f(5.1)`.", "25 and 26.01: a rise of 1.01 over a run of 0.1.", "1.01 ÷ 0.1 = 10.1."] },
          { id:"s2", goal:1, prompt:"Secant slopes at `x = 5` for `h` = 1, 0.1, 0.01 are 11, 10.1, 10.01. Estimate the instantaneous rate.", answer:10, display:"10",
            why:"The slopes are settling on 10.",
            wrong:[{ match:10.01, fb:"That’s the last secant. They’re settling on 10." }, { match:11, fb:"That’s the biggest interval’s slope, an average. They’re settling on 10." }],
            hints:["Are the slopes still changing?", "11, 10.1, 10.01: each one is closer to the same number.", "They settle on 10."] },
          { id:"s3", goal:1, star:true, prompt:"`g(x) = x^3`. Slope of the secant from 1 to 1.1, and the rate it suggests at `x = 1`?", use:"1.1³ = 1.331",
            label:"Secant slope, then the rate it suggests (separate them with a comma):", answer:[3, 3.31], display:"3.31; about 3",
            why:"(1.331 − 1) ÷ 0.1 = 3.31, which suggests a rate of about 3 at `x = 1`.",
            wrong:[{ match:0.331, fb:"Divide by 0.1." }, { match:[0.3, 0.331], fb:"Divide by 0.1." }, { match:[0.331, 3], fb:"Divide by 0.1." }, { missing:3, fb:"3.31 is the secant slope. Now give the rate it suggests at `x = 1`." }, { missing:3.31, fb:"Give the secant slope too, then the rate." }],
            hints:["Find `g(1)` and `g(1.1)`.", "1 and 1.331: a rise of 0.331 over a run of 0.1.", "0.331 ÷ 0.1 = 3.31, so the rate at `x = 1` is about 3. Enter 3.31, 3."] },
          { id:"s4", goal:4, star:true, prompt:"A tank holds `V(t) = 100 - t^2` litres after `t` minutes. Using `t = 4` and `t = 4.01`, estimate the rate at `t = 4`, with units.", use:"4.01² = 16.0801",
            unit:"L/min", answer:-8, tol:0.0015, display:"−8.01, so about −8 L/min",
            why:"`V(4)` = 84 and `V(4.01)` = 83.9199, so the slope is −0.0801 ÷ 0.01 = −8.01: the volume is falling at about 8 L/min.",
            wrong:[{ match:8, fb:"The volume is falling: negative." }, { match:84, fb:"That’s `V(4)`, a volume." }],
            hints:["Find `V(4)` and `V(4.01)`.", "`V(4)` = 84; `V(4.01)` = 83.9199.", "−0.0801 ÷ 0.01 = −8.01: about −8 L/min."] },
          { id:"s5", goal:5, star:true, prompt:"`h(t) = -5t^2 + 20t + 1`. Average rate over the centred interval [1.9, 2.1]?", use:"`h(1.9) = h(2.1)` = 20.95",
            answer:0, display:"0",
            why:"Equal heights at both ends: 0. The ball is at its peak at `t = 2`.",
            wrong:[{ match:20.95, fb:"That’s a height. Equal heights at both ends: what’s the rise?" }],
            hints:["The average rate is (`h(2.1) - h(1.9)`) ÷ 0.2.", "The two heights are equal, so the rise is 0.", "0 ÷ 0.2 = 0."] },
          { id:"s6", goal:5, star:true, prompt:"For `f(x) = x^2`, what is the slope of the secant from 3 − `k` to 3 + `k`, for any `k` ≠ 0?",
            answer:6, display:"6",
            why:"(3 + `k`)² − (3 − `k`)² = 12`k`, divided by 2`k`: always 6.",
            wrong:[{ match:9, fb:"9 is `f(3)`, a value. Expand both squares and subtract." }, { match:12, fb:"12`k` is the rise. Divide by the run, 2`k`." }],
            hints:["Expand both squares.", "9 + 6`k` + `k`² minus 9 − 6`k` + `k`² is 12`k`.", "12`k` ÷ 2`k` = 6."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Zara", how:"",
        instruction:"Zara made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Estimate the instantaneous rate of `f(x) = x^2` at `x = 4`.",
            steps:["Secant from 4 to 5: (25 − 16)/1 = 9.", "From 4 to 4.1: (16.81 − 16)/0.1 = 8.1.", "From 4 to 4.01: (16.0801 − 16)/0.01 = 8.01.", "So the instantaneous rate is exactly 8.01."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"It’s 9, the first slope.", why:"9 is the slope over [4, 5], an average. Shrink the interval until the slopes settle." },
              { t:"The slopes 9, 8.1, 8.01 are settling toward 8: the rate is 8.", ok:true, why:"The instantaneous rate is the value the slopes settle on." },
              { t:"It’s 16, `f(4)`.", why:"16 is a value. The rate is a slope: how fast `f` is changing." },
              { t:"Step 4 is correct.", why:"8.01 is still a secant; the trend is the answer." }],
            hints:["Are the slopes still changing?", "What value are they approaching?", "8."] },
          { id:"e2", goal:4, task:"A ball’s height is `h(t) = -5t^2 + 20t + 1` m. How fast is it moving at `t` = 3 s?",
            steps:["`h(3)` = −45 + 60 + 1 = 16 m.", "So at `t = 3` the ball is rising at 16 m/s."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", ""],
            fixes:[
              { t:"16 ÷ 3 ≈ 5.3 m/s.", why:"That’s height ÷ time, not a slope." },
              { t:"The average from 0 to 3 is 5 m/s.", why:"An average over [0, 3] describes the whole interval; at `t` = 3 the rate can be very different." },
              { t:"Use secants: from 3 to 3.01 the slope is about −10.05, settling toward −10. It’s falling at about 10 m/s.", ok:true, why:"The rate is a slope, and the slopes settle on −10 m/s." },
              { t:"Step 2 is correct.", why:"16 m is a height." }],
            hints:["Is 16 a height or a speed?", "Build a secant table at `t = 3`.", "Slopes settle toward −10: falling at about 10 m/s."] },
          { id:"e3", goal:3, task:"`f(x) = x^2 - 6x`. Where is the rate 0, and what is `f` there?",
            steps:["The vertex is at `x = 3`.", "The tangent there is horizontal, so the rate is 0.", "So `f(3) = 0`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`f(3)` = 9 − 18 = −9: the graph is level at height −9.", ok:true, why:"Rate 0 means level, not zero height." },
              { t:"`f(3) = 3`.", why:"3 is the `x`-value of the vertex. Substitute it: 3² − 6(3)." },
              { t:"`f(3) = 6`.", why:"Substitute `x = 3`: 9 − 18 = −9." },
              { t:"Step 3 is correct.", why:"Rate 0 means level, not zero height." }],
            hints:["Is a zero rate the same as a zero value?", "Substitute `x = 3`.", "`f(3)` = −9."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: the slopes settling, the curve looking straight up close, or the centred secant?" },
      { id:"j2", q:"In your own words, why can’t you just put `h` = 0 into the secant slope?" },
      { id:"j3", q:"Explain to a friend how to estimate how fast something is changing at one instant." },
      { id:"j4", q:"What’s still unclear about the difference between average and instantaneous rates? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"The instantaneous rate of change of `f` at `x = 2` is…", options:[
          { t:"`f(2)`.", why:"That’s a value." },
          { t:"the slope of the tangent to the graph at (2, `f(2)`)", ok:true, why:"The instantaneous rate is the tangent’s slope." },
          { t:"the slope of the secant from `x = 0` to `x = 2`.", why:"That’s an average rate." },
          { t:"`f(2)` ÷ 2.", why:"A value divided by an input isn’t a slope." }] },
        b:{ prompt:"The slope of the tangent to `y = f(x)` at `x = -1` is…", options:[
          { t:"the average rate of change from `x = -1` to `x = 1`.", why:"That’s a secant’s slope: an average over an interval." },
          { t:"`f(-1)`.", why:"That’s a value." },
          { t:"the instantaneous rate of change of `f` at `x = -1`", ok:true, why:"The tangent’s slope is the instantaneous rate." },
          { t:"`f(-1)` ÷ (−1).", why:"Not a slope." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Secant slopes of `f` at `x = 3`, for `h` = 0.1, 0.01 and 0.001, are 6.1, 6.01 and 6.001. Best estimate of the instantaneous rate at `x = 3`?", options:[
          { t:"6", ok:true, why:"The slopes settle on 6." },
          { t:"6.001", why:"Still a secant slope." },
          { t:"6.1", why:"The biggest interval’s slope." },
          { t:"9", why:"That would be `f(3)` for `x^2`: a value." }] },
        b:{ prompt:"Secant slopes of `g` at `x = -2` are −3.9, −3.99 and −3.999. Best estimate of the instantaneous rate at `x = -2`?", options:[
          { t:"−4", ok:true, why:"They settle on −4." },
          { t:"−3.999", why:"Still a secant slope." },
          { t:"−3.9", why:"The biggest interval’s slope." },
          { t:"4", why:"The slopes are negative." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The tangent to a graph at `P` is horizontal. What is the instantaneous rate at `P`?", options:[
          { t:"It’s undefined.", why:"Vertical lines have undefined slope." },
          { t:"0", ok:true, why:"Horizontal line: slope 0." },
          { t:"1", why:"Slope 1 rises at 45°." },
          { t:"The `y`-value of `P` is 0.", why:"Level at any height." }] },
        b:{ prompt:"The tangent to a graph at `Q` falls from left to right. What does that tell you?", options:[
          { t:"The `y`-value at `Q` is negative.", why:"Falling isn’t the same as below the axis." },
          { t:"The rate at `Q` is 0.", why:"Falling means a negative slope." },
          { t:"The instantaneous rate at `Q` is negative", ok:true, why:"A tangent that falls from left to right has a negative slope." },
          { t:"The rate at `Q` is undefined.", why:"A falling tangent has a definite slope." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"Use 1.01³ = 1.030301. What is the slope of the secant on `y = x^3` from `x = 1` to `x = 1.01`?", options:[
          { t:"0.030301", why:"That’s `Δy`; divide by 0.01." },
          { t:"1.030301", why:"That’s `f(1.01)`." },
          { t:"3.0301", ok:true, why:"(1.030301 − 1) ÷ 0.01." },
          { t:"103.0301", why:"That divides `f(1.01)` by 0.01, skipping the subtraction." }] },
        b:{ prompt:"Use 2.01² = 4.0401. What is the slope of the secant on `y = x^2` from `x = 2` to `x = 2.01`?", options:[
          { t:"0.0401", why:"That’s `Δy`." },
          { t:"4.01", ok:true, why:"(4.0401 − 4) ÷ 0.01." },
          { t:"4.0401", why:"That’s `f(2.01)`." },
          { t:"404.01", why:"That divides `f(2.01)` by 0.01." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"For `h(t) = -5t^2 + 20t + 1`, whose instantaneous rate at `t = 2` is 0, which interval has an average rate equal to that?", options:[
          { t:"[0, 2]", why:"(21 − 1)/2 = 10." },
          { t:"[1, 3]", ok:true, why:"`h(1) = h(3)` = 16: average 0." },
          { t:"[1.5, 2]", why:"(21 − 19.75)/0.5 = 2.5." },
          { t:"[2, 4]", why:"(1 − 21)/2 = −10." }] },
        b:{ prompt:"For `y = x^2`, whose instantaneous rate at `x = 3` is 6, which interval has an average rate equal to that?", options:[
          { t:"[0, 3]", why:"(9 − 0)/3 = 3." },
          { t:"[2, 3]", why:"(9 − 4)/1 = 5." },
          { t:"[2, 4]", ok:true, why:"(16 − 4)/2 = 6: centred on 3." },
          { t:"[3, 4]", why:"(16 − 9)/1 = 7." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"The graph of `f(x) = x^3 - 3x` is shown, with local maximum (−1, 2) and local minimum (1, −2). Where is the instantaneous rate negative?" + fig("t3a", "Cubic f of x equals x cubed minus 3x, with local maximum (negative 1, 2) and local minimum (1, negative 2)"), options:[
          { t:"`(-∞, -√3) ∪ (0, √3)`", why:"That’s where the <strong>value</strong> is negative." },
          { t:"`(-∞, -1) ∪ (1, ∞)`", why:"That’s where it rises." },
          { t:"`[-1, 1]`", why:"At the turning points the rate is 0, not negative." },
          { t:"`(-1, 1)`", ok:true, why:"The graph falls between its turning points." }] },
        b:{ prompt:"The graph of `g(x) = -x^3 + 12x` is shown, with local minimum (−2, −16) and local maximum (2, 16). Where is the instantaneous rate positive?" + fig("t3b", "Cubic g of x equals negative x cubed plus 12x, with local minimum (negative 2, negative 16) and local maximum (2, 16)"), options:[
          { t:"`(-∞, -2) ∪ (2, ∞)`", why:"That’s where it falls." },
          { t:"`(-2, 2)`", ok:true, why:"The graph rises between its turning points." },
          { t:"`[-2, 2]`", why:"At the turning points the rate is 0." },
          { t:"`(-∞, -2√3) ∪ (0, 2√3)`", why:"That’s where the <strong>value</strong> is positive." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why secant slopes approach the tangent slope as `h` shrinks?", options:[
          { t:"“Because the secant slopes get closer to `f(P)`.”", why:"`f(P)` is a value, not a slope." },
          { t:"“Because at `h` = 0 the secant becomes the tangent, so you can substitute `h` = 0.”", why:"At `h` = 0 there’s only one point: 0 ÷ 0." },
          { t:"“Because the whole curve becomes a straight line when `h` is small.”", why:"Only the part near `P` looks straight." },
          { t:"“As `Q` moves toward `P`, the secant through `P` and `Q` swings toward the tangent at `P`, so its slope approaches the tangent’s slope.”", ok:true, why:"The secants swing toward the tangent, so their slopes settle on its slope." }] },
        b:{ prompt:"Which is the best explanation of why you can’t find the instantaneous rate by putting `h` = 0 in `{f(a + h) - f(a)}/{h}`?", options:[
          { t:"“Because `f(a)` might be 0.”", why:"`f(a)` being 0 is no problem." },
          { t:"“Because `h` must be positive.”", why:"Negative `h` works too: secants to the left." },
          { t:"“With `h` = 0 there’s only one point, and the expression becomes 0 ÷ 0, which has no value. So you estimate with smaller and smaller `h`.”", ok:true, why:"A secant needs two different points." },
          { t:"“Because the answer would always be 0.”", why:"0 ÷ 0 isn’t 0; it has no value." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"`s(t)` is a cyclist’s distance in km after `t` hours. “The instantaneous rate of change of `s` at `t = 2` is 18” means…", options:[
          { t:"the cyclist has ridden 18 km after 2 hours.", why:"That would be `s(2)` = 18, a distance, not a rate." },
          { t:"the cyclist averaged 18 km/h for the first 2 hours.", why:"That’s an average rate over [0, 2], not the rate at one instant." },
          { t:"at exactly 2 hours, the cyclist is riding at 18 km/h", ok:true, why:"An instantaneous rate is the speed at that moment, in km per hour." },
          { t:"the cyclist rides 18 km every 2 hours.", why:"That’s an average of 9 km/h." }] },
        b:{ prompt:"`V(t)` is the volume of water in a tank, in litres, after `t` minutes. “The instantaneous rate of change of `V` at `t = 5` is −3” means…", options:[
          { t:"the tank holds −3 L at 5 minutes.", why:"That would be `V(5)`, a volume. The rate is how fast the volume changes." },
          { t:"at exactly 5 minutes, the volume is decreasing at 3 L/min", ok:true, why:"A negative rate means falling, here by 3 litres per minute at that moment." },
          { t:"the volume fell by 3 L over the first 5 minutes.", why:"That describes an average over [0, 5], not the rate at one instant." },
          { t:"the tank holds 3 L at 5 minutes and is emptying.", why:"The rate tells you how fast the volume changes, not how much is in the tank." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"A stone’s height is `h(t) = 45 - 5t^2` m. Using `t = 2` and `t = 2.01` (2.01² = 4.0401), estimate how fast it is falling at `t` = 2 s.", options:[
          { t:"About 0.2 m/s", why:"Divide by 0.01." },
          { t:"About 10 m/s", why:"That’s the average over [0, 2]: (25 − 45)/2." },
          { t:"About 20 m/s", ok:true, why:"`h(2)` = 25, `h(2.01)` = 24.7995; slope −0.2005 ÷ 0.01 = −20.05: falling at about 20 m/s." },
          { t:"About 25 m/s", why:"25 m is its height." }] },
        b:{ prompt:"A square tile’s area is `A(s) = s^2` cm². Using `s = 5` and `s = 5.01` (5.01² = 25.1001), estimate how fast the area grows per centimetre of side at `s = 5`.", options:[
          { t:"About 0.1 cm² per cm", why:"Divide by 0.01." },
          { t:"About 5 cm² per cm", why:"That’s the average over [0, 5]." },
          { t:"About 10 cm² per cm", ok:true, why:"(25.1001 − 25) ÷ 0.01 = 10.01." },
          { t:"About 25 cm² per cm", why:"25 cm² is the area." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A tank’s water level rises from 2 m at `t = 0` to a peak of 5 m at `t` = 6 h, then falls. A technician says: “The level was rising fastest at `t` = 6 h, because that’s when it was highest.” What is correct?", options:[
          { t:"“The technician is right: highest means fastest.”", why:"At a peak the tangent is flat: the rate there is 0." },
          { t:"“At `t` = 6 h the rate is 5 m/h.”", why:"5 m is the level, a value, not a rate." },
          { t:"“At `t` = 6 h the rate is 0.5 m/h, the average (5 − 2)/6.”", why:"That’s an average over [0, 6]. At the peak itself the rate is 0." },
          { t:"At `t` = 6 h the rate is 0 (the tangent is flat). The fastest rise was earlier, where the graph was steepest.", ok:true, why:"At a peak the tangent is flat; speed shows up as steepness." }] },
        b:{ prompt:"A runner’s distance–time graph is steep at first and gets flatter. A coach says: “She was running fastest at the end, because she’d covered the most distance.” What is correct?", options:[
          { t:"“The coach is right: most distance means fastest.”", why:"Distance covered is a value. Speed is the steepness of the graph." },
          { t:"Her speed is the steepness of the tangent, which is smallest at the end. She ran fastest at the start.", ok:true, why:"The graph is steepest at the start, so her speed was greatest then." },
          { t:"“Her speed at the end equals her average speed.”", why:"The average describes the whole run; at the end the rate can be very different." },
          { t:"“Her speed at the end is 0, because the graph ends there.”", why:"The graph ending doesn’t make the slope 0." }] } }
    ]
  },
  task:{
    title:"Design the ramp", summary:"Design the ramp",
    statement:"<p>A skate-ramp profile is a parabola `y = ax^2 + bx + c` for `0 ≤ x ≤ 4`. Use the sliders and the tangent tool to meet the whole spec. There’s more than one answer.</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The spec</h4><ol style=\"margin:4px 0 0;padding-left:1.3em\"><li>Average rate of change over [0, 4] is 2.</li><li>At `x = 0` the ramp starts by going down (instantaneous rate negative).</li><li>At `x = 3` the ramp climbs at a rate of at least 4.</li><li>It starts at height 1 (`y`-intercept 1).</li></ol></div>",
    checks:["Average rate on [0, 4] is 2", "Starts going down", "Climbs at least 4 at `x = 3`", "Starts at height 1"],
    tips:["(`f(4) - f(0)`) ÷ 4 is {v}; it must be 2.", "Use the tangent tool at `x = 0`: the slope must be negative.", "At `x = 3` the slope is {v}.", "`c` is the height at `x = 0`."],
    explainPrompt:"Explain how you used the tangent tool and what you noticed at `x = 2`.",
    vocab:"Use the words average rate, instantaneous rate, secant and tangent.",
    after3:"Use the tangent tool at `x = 2` on each answer. What do you notice?"
  },
  cards:[
    ["Instantaneous rate of change", "How fast `f` is changing at one input: the slope of the tangent there."],
    ["Average vs instantaneous", "Average: secant slope over an interval. Instantaneous: tangent slope at a point."],
    ["Estimating with secants", "Slopes from `P` to `Q` for `h` = 1, 0.1, 0.01, …; the value they settle on."],
    ["Why not `h` = 0?", "One point only: 0 ÷ 0 has no value."],
    ["Centred secant", "From `a - h` to `a + h`: usually a better estimate. For a parabola it’s exact."],
    ["Local straightness", "Zoomed in, a smooth curve looks like its tangent line."],
    ["Rate 0", "The tangent is horizontal: a peak, a valley, or a level point. Not the same as `f` = 0."],
    ["Sign of the rate", "Positive: rising. Negative: falling. Unrelated to whether the value is positive."],
    ["Units", "The same as the average rate: units of `y` per unit of `x` (m/s, L/min)."],
    ["Highest point", "The rate there is 0, not the largest."],
    ["Slopes 6.1, 6.01, 6.001", "Estimate 6, the value they approach."],
    ["Parabola fact", "The average rate over [`a`, `b`] equals the instantaneous rate at the midpoint `{a + b}/{2}`."]
  ]
};
