// MHF4U 34 Solving Trig Equations. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/34-solving-trig-equations.md
// Angles in data are whole numbers of π/12 (0 … 24); app.js turns them into 5π/6 etc.
const S1 = "Step 1 is correct. Keep checking the steps after it.";
const G1H = "Get one ratio on its own (or factor), then find the reference angle.";

export default {
  id:"34-solving-trig-equations",
  kind:"topic",
  title:"Solving trig equations",
  topic:"Solving Trig Equations",
  readyTopic:"solving trig equations",
  hero:{
    eq:'<span class="m">2 <span class="fnm">sin</span> <i>x</i> − <span class="ts-one">1</span> = 0</span>', eqLabel:"2 sine x minus 1 equals 0", eqSize:"md",
    headline:"One equation, many angles",
    text:"A <strong>trig equation</strong> such as `2 sin x - 1 = 0` is true only for certain angles. To <strong>solve</strong> it, find every angle in <strong>`0 ≤ x ≤ 2π`</strong> that works. On the graph, the solutions are where the wave `y = sin x` meets a horizontal line; on the unit circle, they’re where that line cuts the circle. A <strong>quadratic trig equation</strong> splits into two such lines, and <strong>identities</strong> turn a mixed equation into one you can split.",
    fig:{ aria:"The wave y = sin x from 0 to 2π meets the line y = 1/2 at π/6 and 5π/6; an inset unit circle shows the same line cutting the circle twice" }
  },
  goals:[
    "I can solve a linear trig equation such as `2 sin x + 1 = 0` by isolating the ratio and finding every exact solution from 0 to 2π.",
    "I can explain the solutions of a trig equation as the points where a line meets a graph and where a line cuts the unit circle, and predict how many solutions there are.",
    "I can find approximate solutions from a given value, such as `sin 0.41 ≈ 0.40`, using the partner angles `π - x`, `π + x` and `2π - x`.",
    "I can solve a quadratic trig equation by factoring, and reject any factor that asks for an impossible value.",
    "I can use identities to rewrite an equation in one ratio before solving, and factor instead of dividing so that no solution is lost.",
    "I can solve equations with a multiple angle, such as `sin 2x = √3/2`, and use trig equations to answer questions in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Unit circle", goal:1, fixedOrder:true,
          prompt:"What is the exact value of `cos(4π/3)`?",
          options:[
            { t:"`-2`", why:"−2 is `sec(4π/3) = 1/cos(4π/3)`. The question asks for the cosine itself." },
            { t:"`-√3/2`", why:"`√3/2` is the cosine of π/6. The reference angle of 4π/3 is π/3, whose cosine is 1/2." },
            { t:"`-1/2`", ok:true, why:"4π/3 is in quadrant 3 with reference angle `4π/3 - π = π/3`. `cos(π/3) = 1/2`, and cosine is negative in quadrant 3." },
            { t:"`1/2`", why:"Right size, wrong sign. 4π/3 is left of the `y`-axis, where cosine is negative." }],
          hints:["Find the quadrant and the reference angle of 4π/3.", "4π/3 is between π and 3π/2: quadrant 3. The reference angle is `4π/3 - π = π/3`. In quadrant 3, cosine is negative.", "`cos(π/3) = 1/2`, so `cos(4π/3) = -1/2`."] },
        { id:"w2", skill:"Unit circle", goal:3, fixedOrder:true,
          prompt:"Which angle in quadrant 3 has a reference angle of π/5?",
          options:[
            { t:"`7π/10`", why:"`π/5 + π/2 = 7π/10` is in quadrant 2. A quadrant 3 angle is π plus the reference angle." },
            { t:"`4π/5`", why:"`π - π/5 = 4π/5` is the quadrant 2 angle with this reference angle." },
            { t:"`6π/5`", ok:true, why:"In quadrant 3 the angle is π + (reference angle): `π + π/5 = 6π/5`." },
            { t:"`9π/5`", why:"`2π - π/5 = 9π/5` is the quadrant 4 angle with this reference angle." }],
          hints:["A quadrant 3 angle is a half turn plus a bit.", "Quadrant 3 angles are `π + α`, where α is the reference angle.", "`π + π/5 = 5π/5 + π/5 = 6π/5`."] },
        { id:"w3", skill:"Trig graphs", goal:2, fixedOrder:true,
          prompt:"On `0 ≤ x ≤ 2π`, where does the graph of `y = sin x` meet the `x`-axis?",
          options:[
            { t:"`x = π` only", why:"`sin 0 = 0` and `sin 2π = 0` too. The interval includes both ends." },
            { t:"`x = 0` and `x = π`", why:"The interval `0 ≤ x ≤ 2π` includes 2π, and `sin 2π = 0`." },
            { t:"`x = 0`, `x = π` and `x = 2π`", ok:true, why:"`sin x` is the height of the unit-circle point. It’s 0 at the points (1, 0) and (−1, 0), which are the angles 0, π and 2π." },
            { t:"`x = π/2` and `x = 3π/2`", why:"At π/2 and 3π/2 it’s <strong>cosine</strong> that is 0. There, `sin x` is 1 and −1." }],
          hints:["`sin x` is the `y`-coordinate of the point on the unit circle.", "The `y`-coordinate is 0 where the point is on the `x`-axis. Which angles from 0 to 2π land there?", "0, π and 2π (2π lands on the same point as 0). All three are in `0 ≤ x ≤ 2π`."] },
        { id:"w4", skill:"Quadratic equations", goal:4, fixedOrder:true,
          prompt:"Solve `2u^2 - u - 1 = 0`.",
          options:[
            { t:"`u = -2` or `u = 1`", why:"From `2u + 1 = 0` you get `2u = -1`, so `u = -1/2`, not −2." },
            { t:"`u = -1` or `u = 1/2`", why:"Those solve `2u^2 + u - 1 = 0`, which is `(2u - 1)(u + 1)`. Expand your factors to check the middle term." },
            { t:"`u = -1/2` or `u = 1`", ok:true, why:"`2u^2 - u - 1 = (2u + 1)(u - 1)`. Each factor can be 0: `u = -1/2` or `u = 1`." },
            { t:"`u = 0` or `u = 1/2`", why:"Writing `u(2u - 1) = 1` and setting each factor to 0 doesn’t work: the product must equal <strong>0</strong>. Check `u = 0`: 0 − 0 − 1 = −1, not 0." }],
          hints:["Factor the trinomial: two numbers with product 2 × (−1) = −2 and sum −1.", "−2 and 1 work: `2u^2 - 2u + u - 1 = 2u(u - 1) + (u - 1) = (2u + 1)(u - 1)`.", "`2u + 1 = 0` gives `u = -1/2`, and `u - 1 = 0` gives `u = 1`."] },
        { id:"w5", skill:"Quadratic equations", goal:5, fixedOrder:true,
          prompt:"Solve `u^2 = 3u`.",
          options:[
            { t:"`u = -3` or `u = 0`", why:"`u^2 - 3u = u(u - 3)`, so the roots are 0 and +3. Check `u = -3`: 9 ≠ −9." },
            { t:"`u = -√3` or `u = √3`", why:"That solves `u^2 = 3`. The right side here is `3u`, which depends on `u`." },
            { t:"`u = 0` or `u = 3`", ok:true, why:"`u^2 - 3u = 0`, so `u(u - 3) = 0`: `u = 0` or `u = 3`." },
            { t:"`u = 3` only", why:"Dividing by `u` assumes `u ≠ 0`, and loses the solution `u = 0`: `0^2 = 3 × 0`. Move everything to one side and factor instead." }],
          hints:["Don’t divide by `u`: it might be 0. Move everything to one side.", "`u^2 - 3u = 0`. Factor out the common factor `u`.", "`u(u - 3) = 0`, so `u = 0` or `u = 3`."] },
        { id:"w6", skill:"Trig identities", goal:5,
          prompt:"Which expression is equal to `cos 2x` for every value of `x`?",
          options:[
            { t:"`2 cos x`", why:"Test `x = 0`: `cos 0 = 1`, but `2 cos 0 = 2`. The 2 is inside the cosine." },
            { t:"`1 - sin^2x`", why:"`1 - sin^2x` is `cos^2x`, the square of `cos x`. Test `x = π/2`: `cos π = -1`, but `1 - sin^2(π/2) = 0`." },
            { t:"`1 - 2 sin^2x`", ok:true, why:"This is one form of the double-angle identity. The others are `2 cos^2x - 1` and `cos^2x - sin^2x`." },
            { t:"`2 sin^2x - 1`", why:"`2 sin^2x - 1` is `-cos 2x`. Test `x = 0`: it gives −1, but `cos 0 = 1`." }],
          hints:["Test each option at `x = 0`, where `cos 2x = cos 0 = 1`.", "At 0, `2 cos x` gives 2 and `2 sin^2x - 1` gives −1, so both fail. Test the other two at `x = π/2`, where `cos 2x = cos π = -1`.", "At π/2, `1 - 2 sin^2(π/2) = 1 - 2 = -1` matches. It’s the double-angle identity `cos 2x = 1 - 2 sin^2x`."] }
      ],
      refreshers:{
        "Unit circle":"To find an exact value, find the quadrant and the reference angle (the angle to the `x`-axis). Quadrant 2: `π - α`; quadrant 3: `π + α`; quadrant 4: `2π - α`. The special triangle gives the size and CAST gives the sign. Example: `4π/3 = π + π/3`, so `cos(4π/3) = -cos(π/3) = -1/2`.",
        "Trig graphs":"On `0 ≤ x ≤ 2π`, `y = sin x` starts at 0, peaks at (π/2, 1), crosses at π, dips to (3π/2, −1) and returns to 0 at 2π. `y = cos x` starts at its peak (0, 1), crosses at π/2, dips to (π, −1), crosses at 3π/2 and returns to 1 at 2π. Both ends, 0 and 2π, are part of the interval.",
        "Quadratic equations":"Get 0 on one side, factor, then set each factor to 0. Never divide by an expression that could be 0: in `u^2 = 3u`, dividing by `u` loses `u = 0`. Example: `2u^2 - u - 1 = (2u + 1)(u - 1) = 0`, so `u = -1/2` or `u = 1`.",
        "Trig identities":"`sin^2x + cos^2x = 1`, so `sin^2x = 1 - cos^2x` and `cos^2x = 1 - sin^2x`. The double angles are `sin 2x = 2 sin x cos x` and `cos 2x = 1 - 2 sin^2x = 2 cos^2x - 1`. `sin^2x` means `(sin x)^2`, and `cos 2x` is not `2 cos x`."
      }
    }
  },
  explore:{
    heading:"Line meets wave",
    intro:"Every solution of `sin x =` □ is a place where the wave meets the line `y =` □. Move the line, change the function, and watch the same solutions appear on the unit circle. Then split quadratic equations into two lines.",
    predIntro:"Make a prediction first. Until the reveal runs, anything on screen that would give the answer away is covered by “Predict first”.",
    chalIntro:"Set the explorer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    // Two lines mode equation bank (B1–B6; B7 is "Build your own"). Roots are line heights; "lab" names the exact value.
    bank:[
      { id:"B1", f:"sin", q:[2, -1, -1], eq:"`2 sin^2x - sin x - 1 = 0`", fac:"`(2 sin x + 1)(sin x - 1) = 0`", lines:[-0.5, 1] },
      { id:"B2", f:"cos", q:[2, 1, -1], eq:"`2 cos^2x + cos x - 1 = 0`", fac:"`(2 cos x - 1)(cos x + 1) = 0`", lines:[0.5, -1] },
      { id:"B3", f:"sin", q:[1, -1, 0], eq:"`sin^2x - sin x = 0`", fac:"`sin x (sin x - 1) = 0`", lines:[0, 1] },
      { id:"B4", f:"sin", q:[2, 3, -2], eq:"`2 sin^2x + 3 sin x - 2 = 0`", fac:"`(2 sin x - 1)(sin x + 2) = 0`", lines:[0.5, -2] },
      { id:"B5", f:"tan", q:[1, 0, -3], eq:"`tan^2x - 3 = 0`", fac:"`(tan x - √3)(tan x + √3) = 0`", lines:[1.7320508075688772, -1.7320508075688772] },
      { id:"B6", f:"sin", q:[3, -2, -1], eq:"`3 sin^2x - 2 sin x - 1 = 0`", fac:"`(3 sin x + 1)(sin x - 1) = 0`", lines:[-1 / 3, 1] }
    ],
    predictions:[
      { id:"p1", start:{ mode:"one", f:"sin", k:"1", v:0.5, ex:true },
        prompt:"The line will rise slowly from `y = 1/2` to `y = 1.2`. How will the number of solutions change on the way up?",
        options:[{ t:"It stays at 2 the whole way" }, { t:"2, then 0" }, { t:"2, then 1, then 0", ok:true }, { t:"2, then 3, then 0" }],
        banner1:"□ = 1: the line touches the peak. 1 solution.", banner2:"No meeting points.",
        explain:"Below the peak, a horizontal line crosses the hump twice: once on the way up and once on the way down. At `y = 1` it only touches the top, at `x = π/2`. Above 1 it misses, because `sin x` is never more than 1. The circle shows the same thing: the line cuts the circle twice, touches it at the top, then misses it." },
      { id:"p2", start:{ mode:"one", f:"cos", k:"1", v:0.5, ex:true }, fixedOrder:true,
        prompt:"One solution of `cos x = 1/2` is `x = π/3`. Where is the other solution in `0 ≤ x ≤ 2π`?",
        options:[{ t:"`-π/3`" }, { t:"`2π/3`" }, { t:"`4π/3`" }, { t:"`5π/3`", ok:true }],
        explain:"`cos x` is the `x`-coordinate. The vertical line `x = 1/2` cuts the unit circle at two points that are mirror images in the `x`-axis: the angles π/3 and −π/3. −π/3 is outside `0 ≤ x ≤ 2π`, so go once more round: `-π/3 + 2π = 5π/3`. For cosine the partner of `x` is `2π - x`. (2π/3 has cosine −1/2, and 4π/3 is a half turn from π/3.)" },
      { id:"p3", start:{ mode:"one", f:"sin", k:"1", v:0.5, ex:true },
        prompt:"The inside angle will change from `x` to `2x`, giving `sin 2x = 1/2`. How many solutions will there be on `0 ≤ x ≤ 2π`?",
        options:[{ t:"1" }, { t:"2" }, { t:"4", ok:true }, { t:"6" }],
        explain:"With `2x` inside, the wave repeats twice as fast: its period is π, so `0 ≤ x ≤ 2π` holds two whole waves, and the line cuts each one twice. In the algebra, `u = 2x` runs from 0 to 4π, two laps: `u = π/6`, 5π/6, 13π/6, 17π/6. Dividing by 2 gives `x = π/12`, 5π/12, 13π/12, 17π/12. (6 would be the count for `sin 3x = 1/2`.)" },
      { id:"p4", start:{ mode:"two", bank:"B1" },
        prompt:"This equation factors as `(2 sin x + 1)(sin x - 1) = 0`. How many solutions does it have on `0 ≤ x ≤ 2π`?",
        options:[{ t:"1" }, { t:"2" }, { t:"3", ok:true }, { t:"4" }],
        explain:"Each factor is a line. `2 sin x + 1 = 0` is the line `y = -1/2`, which cuts the wave twice. `sin x - 1 = 0` is the line `y = 1`, which only touches the peak. That’s 2 + 1 = 3 solutions: π/2, 7π/6 and 11π/6. A quadratic trig equation doesn’t always have 4 solutions. (This is the quadratic from warm-up W4, with `u = sin x`.)" }
    ],
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"One line mode. Make the solutions <strong>exactly</strong> 3π/4 and 5π/4.",
        why:"`cos x = -√2/2` gives exactly 3π/4 and 5π/4: they’re mirror images in the `x`-axis, so they share their `x`-coordinate, the cosine.",
        msgs:{
          mode:"Switch to One line mode first.",
          cosR2:"Your solutions are π/4 and 7π/4. Right size, but the angles you want are left of the `y`-axis, where cosine is negative.",
          sinNR2:"`sin x = -√2/2` gives 5π/4 and 7π/4, both below the `x`-axis. 3π/4 is above it.",
          sinR2:"`sin x = √2/2` gives π/4 and 3π/4. 3π/4 is right, but its sine partner is π/4, not 5π/4.",
          cosNH:"`cos x = -1/2` gives 2π/3 and 4π/3. Right sign, wrong size: 3π/4 needs reference angle π/4.",
          tanN1:"`tan x = -1` gives 3π/4 and 7π/4: tangent’s partner is a half turn away.",
          close:"Close, but not exact: your solutions are about {values}. `3π/4 ≈ 2.36` and `5π/4 ≈ 3.93`. Use the exact chip.",
          half:"Clever: half a wave can work. Your solutions are about {values} (0.92 gives 2.34 and 3.95; 0.93 gives 2.39 and 3.89), close to `3π/4 ≈ 2.36` and `5π/4 ≈ 3.93`. The exact value would be `sin(3π/8) ≈ 0.924`, which isn’t a special value, so no chip or slider position hits it. Find a special value that works with `x` itself.",
          kNot1:"With {k} inside there are {n}. Set the inside angle back to `x`.",
          other:"Your solutions are {list}. Compare them with 3π/4 and 5π/4."
        },
        hints:["Picture 3π/4 and 5π/4 on the circle. They’re mirror images in one of the axes. Which coordinate do they share?", "They’re mirror images in the `x`-axis, so they share their `x`-coordinate, `-√2/2`. That’s their cosine.", "Choose cos, keep the inside angle `x`, and tap the chip `-√2/2`. `cos x = -√2/2` gives exactly 3π/4 and 5π/4."] },
      { id:"tc2", goal:[2, 4], prompt:"Two lines mode, Build your own, with sin. Choose the heights so that `(sin x - p)(sin x - q) = 0` has <strong>exactly 3 solutions, all with `π ≤ x ≤ 2π`</strong>.",
        why:"`y = -1` touches the trough at 3π/2, and a second line strictly between −1 and 0 cuts the bottom half of the wave twice: 1 + 2 = 3 solutions, all from π to 2π.",
        msgs:{
          mode:"Switch to Two lines mode, choose “Build your own” and the function sin.",
          m10:"`y = 0` adds 0, π and 2π, so you have 4 solutions, and 0 isn’t in `π ≤ x ≤ 2π`.",
          both:"Each line cuts the bottom half of the wave twice: 4 solutions. To get an odd number, one line must only touch.",
          p1:"`y = 1` touches the peak at π/2, which is in the top half. Which line touches in the bottom half?",
          top:"The second line cuts the top half of the wave, between 0 and π.",
          miss:"The second line misses the wave, so only 3π/2 is left.",
          same:"Both factors give the same line, so its solutions count once.",
          other:"Your equation has {n}: {list}."
        },
        hints:["3 is odd. A line that crosses the wave gives solutions in pairs. What kind of line gives just one?", "Only `y = 1` and `y = -1` touch the wave, with one solution each. Which of them touches between π and 2π?", "Set `p = -1` (that’s 3π/2), and set `q` strictly between −1 and 0, for example −1/2. Then 7π/6 and 11π/6 join 3π/2."] },
      { id:"tc3", goal:[2, 6], stretch:true,
        prompt:"Commit first. Find `f`, `k` and □ so that the solutions are <strong>exactly</strong> π/6, 5π/6 and 3π/2. The graph and the circle stay hidden until you press Check challenge.<br><button type=\"button\" class=\"btn sm ts-tc3go\" data-tc3=\"on\" data-k=\"tc3go\">Hide the views and start</button>",
        why:"`sin 3x = 1` touches the three peaks of `y = sin 3x`: `3x = π/2`, 5π/2, 9π/2 gives `x = π/6`, 5π/6, 3π/2.",
        msgs:{
          mode:"Use One line mode for this challenge.",
          s3n1:"Your solutions are π/2, 7π/6 and 11π/6: the line touches the three troughs. The targets are where `sin 3x` reaches its peaks.",
          s1h:"`sin x = 1/2` gives π/6 and 5π/6, but not 3π/2: `sin(3π/2) = -1`. Three equally spaced solutions need a faster wave.",
          s3h:"`sin 3x = 1/2` has 6 solutions: the line cuts each of the three waves twice. For one solution per wave, the line must touch.",
          c30:"`cos 3x = 0` has 6 solutions: your three targets plus π/2, 7π/6 and 11π/6.",
          s21:"`sin 2x = 1` gives π/4 and 5π/4: two waves, one touch each.",
          other:"Your equation’s solutions are {list}."
        },
        hints:["Look at the spacing. How far apart are π/6, 5π/6 and 3π/2? And how can a line meet a wave only once per period?", "They’re 2π/3 apart, so the period is 2π/3 and `k = 3`. A line meets a wave once per period only where it touches a peak or a trough: □ = 1 or □ = −1.", "`sin(3 · π/6) = sin(π/2) = 1`, so □ = 1: `sin 3x = 1`. Check: `3x = π/2`, 5π/2, 9π/2 gives `x = π/6`, 5π/6, 3π/2."] }
    ]
  },
  part3:{
    slug:"quadratics", name:"Quadratics",
    heading:"Quadratic equations and identities",
    intro:"First, see what dividing by a trig ratio costs. Then solve three equations step by step, and watch each solution appear on the graph.",
    stageA:{
      title:"Stage A: Lost solutions",
      eq:"`2 sin x cos x = √3 cos x`",
      shortcut:"Divide both sides by `cos x`: `2 sin x = √3`, so `sin x = √3/2`, giving `x = π/3` and `x = 2π/3`.",
      task:"The graph crosses the `x`-axis more than twice. Tap every `x`-intercept the shortcut missed.",
      already:"The shortcut already found that one.",
      away:"`D` isn’t 0 there. Look for the other places the graph crosses the axis.",
      one:"One found. There’s one more.",
      success:"At π/2 and 3π/2, `cos x = 0`, so both sides are 0: those are solutions. Dividing by `cos x` is only allowed where `cos x ≠ 0`, so it deleted them. Factor instead: `cos x (2 sin x - √3) = 0` gives `cos x = 0` (π/2, 3π/2) or `sin x = √3/2` (π/3, 2π/3). Four solutions.",
      twin:"Graph of D(x) = 2 sin x cos x − √3 cos x from −π/6 to 13π/6. It crosses the x-axis at π/3, π/2, 2π/3 and 3π/2."
    },
    predictQ:"How many solutions do you expect?",
    builds:[
      { id:"b1", goal:4, eq:"`2 cos^2x - 3 cos x + 1 = 0`",
        steps:[
          { q:"What’s the best first move?", after:"`2u^2 - 3u + 1 = 0`, with `u = cos x`", options:[
            { t:"Factor it as a quadratic in `cos x`", ok:true, why:"It already has one ratio and 0 on the right. Think of it as `2u^2 - 3u + 1 = 0` with `u = cos x`." },
            { t:"Divide every term by `cos x`", why:"That leaves `2 cos x - 3 + 1/cos x = 0`, which is harder, and dividing is only allowed where `cos x ≠ 0`." },
            { t:"Replace `cos^2x` with `1 - sin^2x`", why:"That’s a true identity, but it mixes sin and cos. Use an identity only to get down to one ratio; this equation already has one." },
            { t:"Take the square root of both sides", why:"Square roots don’t split over sums. Factor instead." }] },
          { q:"Which factoring is correct?", after:"`(2 cos x - 1)(cos x - 1) = 0`", options:[
            { t:"`(2 cos x - 1)(cos x - 1) = 0`", ok:true, why:"Expand: `2 cos^2x - 2 cos x - cos x + 1 = 2 cos^2x - 3 cos x + 1`." },
            { t:"`(2 cos x + 1)(cos x + 1) = 0`", why:"That expands to `2 cos^2x + 3 cos x + 1`. The middle sign is wrong." },
            { t:"`(2 cos x - 1)(cos x + 1) = 0`", why:"That expands to `2 cos^2x + cos x - 1`." },
            { t:"`(2 cos x - 3)(cos x - 1) = 0`", why:"That expands to `2 cos^2x - 5 cos x + 3`." }] }
        ],
        factors:[{ f:"cos", v:0.5, sol:[4, 20] }, { f:"cos", v:1, sol:[0, 24], only:{ set:[0], fb:"Both ends of `0 ≤ x ≤ 2π` count. Which other angle in the interval has cosine 1?" } }],
        twin:"Graph of D(x) = 2cos²x − 3 cos x + 1. It touches the x-axis from below at 0 and 2π and crosses it at π/3 and 5π/3.",
        result:"4 solutions: 0, π/3, 5π/3, 2π.",
        hints:["It’s a quadratic in `cos x`. What two numbers have product 2 × 1 = 2 and sum −3?", "−2 and −1: `(2 cos x - 1)(cos x - 1) = 0`. So `cos x = 1/2` or `cos x = 1`.", "`cos x = 1/2` gives π/3 and 5π/3. `cos x = 1` gives 0 and 2π. Four solutions."] },
      { id:"b2", goal:5, eq:"`2 sin^2x = 3 cos x`",
        steps:[
          { q:"What’s the best first move?", after:"`2(1 - cos^2x) = 3 cos x`, so `2 - 2 cos^2x = 3 cos x`", options:[
            { t:"Replace `sin^2x` with `1 - cos^2x`", ok:true, why:"Now every term is in `cos x`: `2(1 - cos^2x) = 3 cos x`." },
            { t:"Divide both sides by `cos x`", why:"`2 sin^2x/cos x = 3` still mixes two ratios, and dividing by `cos x` is only safe where `cos x ≠ 0`." },
            { t:"Replace `sin^2x` with `1 + cos^2x`", why:"The identity is `sin^2x + cos^2x = 1`, so `sin^2x = 1 - cos^2x`. Test `x = 0`: `sin^2 0 = 0`, but `1 + cos^2 0 = 2`." },
            { t:"Replace `sin^2x` with `(1 - cos x)^2`", why:"`(1 - cos x)^2 = 1 - 2 cos x + cos^2x`, which isn’t `sin^2x`. Test `x = π`: `sin^2π = 0`, but `(1 - cos π)^2 = 4`." }] },
          { q:"Move everything to one side.", after:"`2 cos^2x + 3 cos x - 2 = 0`", options:[
            { t:"`2 cos^2x + 3 cos x - 2 = 0`", ok:true, why:"`0 = 2 cos^2x + 3 cos x - 2`: move the left side across so the `cos^2x` term is positive." },
            { t:"`2 cos^2x - 3 cos x + 2 = 0`", why:"Only the `cos^2x` term changed sign. Moving `2 - 2 cos^2x` across to the right changes the sign of both its terms, and the `3 cos x` was already on the right, so it keeps its + sign: `0 = 2 cos^2x + 3 cos x - 2`." },
            { t:"`2 cos^2x + 3 cos x - 1 = 0`", why:"`2(1 - cos^2x) = 2 - 2 cos^2x`: the 2 multiplies the 1 as well." },
            { t:"`-2 cos^2x + 3 cos x + 2 = 0`", why:"The `3 cos x` was on the right side. Moving it to the left makes it `-3 cos x`." }] },
          { q:"Which factoring is correct?", after:"`(2 cos x - 1)(cos x + 2) = 0`", options:[
            { t:"`(2 cos x - 1)(cos x + 2) = 0`", ok:true, why:"Expand: `2 cos^2x + 4 cos x - cos x - 2 = 2 cos^2x + 3 cos x - 2`." },
            { t:"`(2 cos x + 1)(cos x - 2) = 0`", why:"That expands to `2 cos^2x - 3 cos x - 2`." },
            { t:"`(2 cos x - 1)(cos x - 2) = 0`", why:"That expands to `2 cos^2x - 5 cos x + 2`." },
            { t:"`(2 cos x + 2)(cos x - 1) = 0`", why:"That expands to `2 cos^2x - 2`." }] }
        ],
        factors:[{ f:"cos", v:0.5, sol:[4, 20] }, { f:"cos", v:-2, none:true, tapFb:"`cos x` is never less than −1, so `cos x = -2` has no angle. Press ‘No solutions’." }],
        twin:"Graph of D(x) = 2sin²x − 3 cos x. It crosses the x-axis only at π/3 and 5π/3.",
        result:"2 solutions: π/3, 5π/3.",
        hints:["The equation mixes `sin^2x` and `cos x`. Which identity turns `sin^2x` into cosines?", "`sin^2x = 1 - cos^2x`, so `2 - 2 cos^2x = 3 cos x`, which rearranges to `2 cos^2x + 3 cos x - 2 = 0`.", "`(2 cos x - 1)(cos x + 2) = 0`. `cos x = 1/2` gives π/3 and 5π/3; `cos x = -2` is impossible. Two solutions."] },
      { id:"b3", goal:5, eq:"`cos 2x + 3 sin x = 2`",
        steps:[
          { q:"Which identity should replace `cos 2x`?", after:"`1 - 2 sin^2x + 3 sin x = 2`", options:[
            { t:"`cos 2x = 1 - 2 sin^2x`", ok:true, why:"It matches the other term, `sin x`, so the whole equation is in `sin x`." },
            { t:"`cos 2x = 2 cos^2x - 1`", why:"True, but then the equation has `cos^2x` and `sin x`: two different ratios." },
            { t:"`cos 2x = cos^2x - sin^2x`", why:"True, but it brings in `cos^2x`. Choose the form that uses only `sin x`." },
            { t:"`cos 2x = 2 cos x`", why:"Not an identity: at `x = 0`, `cos 0 = 1` but `2 cos 0 = 2`." }] },
          { q:"Move everything to one side.", after:"`2 sin^2x - 3 sin x + 1 = 0`", options:[
            { t:"`2 sin^2x - 3 sin x + 1 = 0`", ok:true, why:"Subtract 2: `-2 sin^2x + 3 sin x - 1 = 0`. Multiply every term by −1." },
            { t:"`2 sin^2x - 3 sin x - 1 = 0`", why:"1 − 2 = −1, and multiplying by −1 makes it +1." },
            { t:"`-2 sin^2x + 3 sin x + 1 = 0`", why:"Subtracting 2 from 1 gives −1, not +1." },
            { t:"`2 sin^2x + 3 sin x + 1 = 0`", why:"Multiplying by −1 changes the sign of <strong>every</strong> term, including `3 sin x`." }] },
          { q:"Which factoring is correct?", after:"`(2 sin x - 1)(sin x - 1) = 0`", options:[
            { t:"`(2 sin x - 1)(sin x - 1) = 0`", ok:true, why:"Expand: `2 sin^2x - 2 sin x - sin x + 1`." },
            { t:"`(2 sin x + 1)(sin x + 1) = 0`", why:"That expands to `2 sin^2x + 3 sin x + 1`." },
            { t:"`(2 sin x - 1)(sin x + 1) = 0`", why:"That expands to `2 sin^2x + sin x - 1`." },
            { t:"`(2 sin x + 1)(sin x - 1) = 0`", why:"That expands to `2 sin^2x - sin x - 1`." }] }
        ],
        factors:[{ f:"sin", v:0.5, sol:[2, 10] }, { f:"sin", v:1, sol:[6] }],
        twin:"Graph of D(x) = cos 2x + 3 sin x − 2. It crosses the x-axis at π/6 and 5π/6 and touches it from above at π/2.",
        result:"3 solutions: π/6, π/2, 5π/6.",
        hints:["The other term is `sin x`. Which form of `cos 2x` uses only `sin x`?", "`cos 2x = 1 - 2 sin^2x`, so `1 - 2 sin^2x + 3 sin x = 2`, which rearranges to `2 sin^2x - 3 sin x + 1 = 0`.", "`(2 sin x - 1)(sin x - 1) = 0`. `sin x = 1/2` gives π/6 and 5π/6; `sin x = 1` gives π/2. Three solutions."] }
    ],
    msgs:{
      noneWrong:"This value is between −1 and 1, so the line meets the wave. Tap its solutions on the strip.",
      missing:"This line has another solution in `0 ≤ x ≤ 2π`. Use the partner rule and check both ends of the interval.",
      probe:"`D`({x}) {val}, not 0.",
      predicted:"You predicted {p}. There are {n}."
    },
    blocks:[{ title:"What the method means", html:"<p><strong>Solving a trig equation, in five steps</strong></p><ol><li><strong>One ratio.</strong> If the equation mixes ratios or has a double angle, use an identity. Pick the form that matches the other terms.</li><li><strong>Zero on one side.</strong> Never divide by a ratio that could be 0: factor it out.</li><li><strong>Factor</strong> as a quadratic in the ratio (think `u = sin x`).</li><li><strong>Split.</strong> Each factor is a line meeting the wave. Reject any value outside −1 to 1 (for sin and cos).</li><li><strong>Solve each line</strong> with a reference angle and CAST, and list every solution in `0 ≤ x ≤ 2π`. Both ends count.</li></ol><p>The graph of `D(x) =` left side − right side crosses or touches the `x`-axis exactly at the solutions, so it’s a check on every answer.</p>" }],
    quickCheck:{
      title:"Before you solve", summary:"Before you solve",
      items:[
        { id:"q1", goal:4, prompt:"How many solutions does `sin x (2 cos x + 1) = 0` have on `0 ≤ x ≤ 2π`?",
          choices:[{ t:"2", fb:"That’s only the second factor. `sin x = 0` also gives solutions." }, { t:"3", fb:"That’s only the first factor. `cos x = -1/2` adds 2π/3 and 4π/3." }, { t:"5", ok:true, fb:"Right. `sin x = 0` gives 0, π and 2π; `cos x = -1/2` gives 2π/3 and 4π/3. 3 + 2 = 5." }, { t:"6", fb:"`sin x = 0` gives three solutions, 0, π and 2π, not four." }] },
        { id:"q2", goal:4, prompt:"How many solutions does `cos^2x = 1/4` have on `0 ≤ x ≤ 2π`?",
          choices:[{ t:"1", fb:"Each value of `cos x` gives two angles here, and there are two values." }, { t:"2", fb:"`cos x` can be −1/2 too, since `(-1/2)^2 = 1/4`." }, { t:"4", ok:true, fb:"Right. `cos x = 1/2` (π/3, 5π/3) or `cos x = -1/2` (2π/3, 4π/3)." }, { t:"8", fb:"There are two values of `cos x`, each with two angles: 4." }] },
        { id:"q3", goal:5, prompt:"Which first move turns `2 cos^2x + sin x - 1 = 0` into an equation in one ratio?",
          choices:[{ t:"Replace `cos^2x` with `1 - sin^2x`", ok:true, fb:"Right. It becomes `2 - 2 sin^2x + sin x - 1 = 0`, all in `sin x`." }, { t:"Replace `sin x` with `1 - cos x`", fb:"`sin x = 1 - cos x` isn’t an identity: at `x = π`, `sin π = 0` but `1 - cos π = 2`." }, { t:"Divide every term by `cos x`", fb:"Dividing by `cos x` risks losing solutions and leaves `sin x/cos x` and `1/cos x`." }, { t:"Factor out `cos x`", fb:"Not every term has a factor `cos x`: `sin x` and −1 don’t." }] },
        { id:"q4", goal:4, prompt:"`(3 sin x - 1)(sin x + 2) = 0`. How many solutions on `0 ≤ x ≤ 2π`?",
          choices:[{ t:"0", fb:"`sin x = 1/3` is possible even though it isn’t a special value: the line `y = 1/3` cuts the wave twice." }, { t:"2", ok:true, fb:"Right. `sin x = 1/3` gives two angles (quadrants 1 and 2); `sin x = -2` is impossible." }, { t:"3", fb:"Only `y = ±1` touch the wave. `y = 1/3` cuts it twice." }, { t:"4", fb:"`sin x = -2` is impossible: sine never goes below −1." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"every", type:"custom", title:"Find every solution", summary:"Find every solution", goal:[1, 4, 5, 6],
        instruction:"Solve each equation on paper. Then tap <strong>every</strong> solution from 0 to 2π, and press Check.",
        how:"Tap the angles on the strip (tapped angles turn yellow), then press Check.",
        fallback:"Some of your angles don’t fit, or some are missing. Check each one: does it make the equation true?",
        countMsg:"You have {have} of the {n} solutions.",
        items:[
          { id:"f1", goal:1, eq:"`2 sin x + √3 = 0`", answer:[16, 20],
            wrong:[{ set:[4, 8], fb:"Those have sin = +√3/2. Isolate first: `sin x = -√3/2` is negative, so look in quadrants 3 and 4." }, { set:[14, 22], fb:"Right quadrants, wrong size: those have sine −1/2. `√3/2` belongs to reference angle π/3." }, { set:[16], fb:"There’s a second angle. Sine is negative in quadrant 4 as well." }],
            hints:[G1H, "`sin x = -√3/2`. Sine is negative in quadrants 3 and 4, and the reference angle is π/3.", "`π + π/3 = 4π/3` and `2π - π/3 = 5π/3`. The answer is 4π/3, 5π/3."] },
          { id:"f2", goal:1, eq:"`√2 cos x + 1 = 0`", answer:[9, 15],
            wrong:[{ set:[3, 21], fb:"`cos x = -√2/2` is negative: quadrants 2 and 3." }, { set:[15, 21], fb:"Those are the angles where <strong>sine</strong> is `-√2/2`. Cosine is negative in quadrants 2 and 3." }, { set:[9], fb:"Cosine is negative in quadrant 3 too." }],
            hints:[G1H, "`cos x = -1/√2 = -√2/2`. Cosine is negative in quadrants 2 and 3, and the reference angle is π/4.", "`π - π/4 = 3π/4` and `π + π/4 = 5π/4`. The answer is 3π/4, 5π/4."] },
          { id:"f3", goal:1, eq:"`tan x + 1 = 0`", answer:[9, 21],
            wrong:[{ set:[3, 15], fb:"There `tan x = +1`." }, { set:[9, 15], fb:"`tan(5π/4) = +1`. Tangent’s partner is a half turn away, not a mirror image." }, { set:[9], fb:"Tangent repeats every π, so there’s a second angle in `0 ≤ x ≤ 2π`." }],
            hints:[G1H, "`tan x = -1`. Tangent is negative in quadrants 2 and 4, and the reference angle is π/4.", "`π - π/4 = 3π/4`, and a half turn later, `3π/4 + π = 7π/4`. The answer is 3π/4, 7π/4."] },
          { id:"f4", goal:5, eq:"`cos^2x = cos x`", answer:[0, 6, 18, 24],
            wrong:[{ set:[0, 24], fb:"Dividing by `cos x` lost the solutions where `cos x = 0`. Move everything to one side and factor instead." }, { set:[6, 18], fb:"You’ve solved one factor. The other factor, `cos x - 1 = 0`, also gives solutions." }, { set:[0, 6, 18], fb:"Both ends of `0 ≤ x ≤ 2π` count. Is there another angle in the interval where `cos x = 1`?" }],
            hints:["Don’t divide by `cos x`: it might be 0. Move everything to one side.", "`cos^2x - cos x = 0`, so `cos x (cos x - 1) = 0`. Solve `cos x = 0` and `cos x = 1` separately.", "`cos x = 0` gives π/2 and 3π/2. `cos x = 1` gives 0 and 2π. The answer is 0, π/2, 3π/2, 2π."] },
          { id:"f5", goal:4, eq:"`4 sin^2x - 3 = 0`", answer:[4, 8, 16, 20],
            wrong:[{ set:[4, 8], fb:"`sin^2x = 3/4` means `sin x = ±√3/2`. You’ve solved only the positive root. Where is sine `-√3/2`?" }, { set:[2, 10, 14, 22], fb:"Those have sine ±1/2. Which reference angle has sine `√3/2`?" }],
            hints:[G1H, "`sin^2x = 3/4`, so `sin x = ±√3/2`. The reference angle is π/3, and there are angles in all four quadrants.", "`sin x = √3/2` gives π/3 and 2π/3; `sin x = -√3/2` gives 4π/3 and 5π/3. The answer is π/3, 2π/3, 4π/3, 5π/3."] },
          { id:"f6", goal:4, eq:"`2 sin^2x + sin x - 1 = 0`", answer:[2, 10, 18],
            wrong:[{ set:[6, 14, 22], fb:"Those solve `(2 sin x + 1)(sin x - 1) = 0`, which expands to `2 sin^2x - sin x - 1`. Check the signs in your factors." }, { set:[2, 10], fb:"You’ve solved one factor. The other factor, `sin x + 1 = 0`, also gives a solution." }],
            hints:[G1H, "`(2 sin x - 1)(sin x + 1) = 0`. Solve the lines `sin x = 1/2` and `sin x = -1`.", "`sin x = 1/2` gives π/6 and 5π/6; `sin x = -1` gives 3π/2. The answer is π/6, 5π/6, 3π/2."] },
          { id:"f7", goal:5, eq:"`sin^2x + cos x + 1 = 0`", answer:[12],
            wrong:[{ set:[0, 24], fb:"Those make `cos x = 1`. Replace `sin^2x` with `1 - cos^2x` and collect terms: `cos^2x - cos x - 2 = 0`. Check the signs when you factor." }, { extra:true, fb:"One factor asks for a value of `cos x` that’s impossible. Only the other factor gives solutions." }],
            hints:[G1H, "Replace `sin^2x` with `1 - cos^2x`: `cos^2x - cos x - 2 = 0`, so `(cos x - 2)(cos x + 1) = 0`. Solve the lines `cos x = 2` and `cos x = -1`.", "`cos x = 2` is impossible. `cos x = -1` gives π. The answer is π."] },
          { id:"f8", goal:6, eq:"`cos 2x = 1/2`", answer:[2, 10, 14, 22],
            wrong:[{ set:[2, 10], fb:"That’s only the first lap. If `0 ≤ x ≤ 2π`, then `2x` runs up to 4π: find the second lap’s values of `2x` too, then halve them." }, { set:[4, 20], fb:"Those solve `cos x = 1/2`. Here it’s `2x` that has cosine 1/2, so find the values of `2x` first, then divide by 2." }],
            hints:["Let `u = 2x`. If `0 ≤ x ≤ 2π`, what interval does `u` cover?", "`0 ≤ u ≤ 4π`, two laps. `cos u = 1/2` at π/3 and 5π/3 on the first lap, and 2π more on the second.", "`u = π/3`, 5π/3, 7π/3, 11π/3, so `x = u/2 = π/6`, 5π/6, 7π/6, 11π/6."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Isabelle", how:"",
        instruction:"Isabelle made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Solve `2 sin x cos x + sin x = 0` for `0 ≤ x ≤ 2π`.",
            steps:["Subtract `sin x` from both sides: `2 sin x cos x = -sin x`.", "Divide both sides by `sin x`: `2 cos x = -1`.", "So `cos x = -1/2`.", "Cosine is negative in quadrants 2 and 3, and the reference angle is π/3.", "`x = 2π/3` or `x = 4π/3`."],
            answer:1,
            stepFb:[S1, "", "Step 3 divides correctly, but it builds on step 2. The mistake is earlier.", "Step 4 is true for `cos x = -1/2`. The mistake is earlier.", "Step 5 follows from steps 3 and 4. The mistake is earlier."],
            fixes:[
              { t:"Factor instead: `sin x (2 cos x + 1) = 0`. So `sin x = 0` (`x = 0`, π, 2π) or `cos x = -1/2` (`x = 2π/3`, 4π/3): five solutions.", ok:true, why:"Factoring keeps the solutions where `sin x = 0`. Check `x = π`: `2(0)(-1) + 0 = 0`." },
              { t:"Divide both sides by `cos x` instead.", why:"That also divides by a ratio that can be 0, and leaves `2 sin x = -sin x/cos x`, which still mixes ratios." },
              { t:"Keep step 2, and add `x = π/2` and `x = 3π/2`, where dividing failed.", why:"Dividing by `sin x` fails where <strong>`sin x`</strong> = 0, which is at 0, π and 2π. At π/2, `sin x = 1`." },
              { t:"Step 2 is correct as written.", why:"Check `x = π`: `2 sin π cos π + sin π = 0`, so π is a solution, but Isabelle’s answer doesn’t include it." }],
            hints:["Check each step for a move that could lose solutions.", "Step 2 divides by `sin x`. What happens at angles where `sin x = 0`?", "Step 2 is wrong. Factor: `sin x (2 cos x + 1) = 0` gives `x = 0`, 2π/3, π, 4π/3, 2π."] },
          { id:"e2", goal:4, task:"Solve `4 cos^2x - 3 = 0` for `0 ≤ x ≤ 2π`.",
            steps:["Add 3: `4 cos^2x = 3`.", "Divide by 4: `cos^2x = 3/4`.", "Take the square root: `cos x = √3/2`.", "The reference angle is π/6, and cosine is positive in quadrants 1 and 4.", "`x = π/6` or `x = 11π/6`."],
            answer:2,
            stepFb:[S1, "Step 2 is correct.", "", "Step 4 is true for `cos x = √3/2`. The mistake is earlier.", "Step 5 follows from steps 3 and 4. The mistake is earlier."],
            fixes:[
              { t:"`cos x = ±√3/2`. `cos x = √3/2` gives π/6 and 11π/6; `cos x = -√3/2` gives 5π/6 and 7π/6: four solutions.", ok:true, why:"Both square roots of 3/4 give angles." },
              { t:"`cos x = √3/4`.", why:"`√(3/4) = √3/√4 = √3/2`. The problem is the missing negative root, not the size." },
              { t:"`cos x = -√3/2` only, because the equation has a minus sign.", why:"The minus sign in the equation doesn’t decide the sign of `cos x`. Both `√3/2` and `-√3/2` square to 3/4." },
              { t:"Step 3 is correct as written.", why:"Try `x = 5π/6`: `cos^2(5π/6) = (-√3/2)^2 = 3/4`, so it’s a solution that Isabelle missed." }],
            hints:["Look for the step where a value could have been lost.", "Step 3 takes a square root. How many numbers have a square of 3/4?", "Step 3 is wrong: `cos x = ±√3/2`, giving π/6, 5π/6, 7π/6 and 11π/6."] },
          { id:"e3", goal:6, task:"Solve `cos 2x = -√2/2` for `0 ≤ x ≤ 2π`.",
            steps:["Let `u = 2x`.", "As `x` runs from 0 to 2π, `u` runs from 0 to 4π.", "`cos u = -√2/2` has reference angle π/4, and cosine is negative in quadrants 2 and 3.", "So `u = 3π/4` or `u = 5π/4`.", "`x = u/2`, so `x = 3π/8` or `x = 5π/8`."],
            answer:3,
            stepFb:[S1, "Step 2 is correct: double the interval.", "Step 3 is correct.", "", "Step 5 halves correctly, but it uses step 4’s list. The mistake is earlier."],
            fixes:[
              { t:"`u = 3π/4`, 5π/4, 11π/4 or 13π/4 (add 2π for the second lap), so `x = 3π/8`, 5π/8, 11π/8 or 13π/8.", ok:true, why:"Step 2 said `u` goes up to 4π, so the second lap’s solutions count too." },
              { t:"`u = 3π/4`, 5π/4, 7π/4 or 9π/4.", why:"Adding π/2 isn’t the pattern. `cos(7π/4) = +√2/2`. The second lap adds 2π: `3π/4 + 2π = 11π/4`." },
              { t:"`u = 3π/4` or 5π/4, so `x = 3π/2` or 5π/2.", why:"That multiplies by 2 instead of dividing: `x = u/2`. And the second lap is still missing." },
              { t:"Step 4 is correct as written.", why:"Step 2 said `u` runs to 4π, but step 4 stops at 2π. Check `x = 11π/8`: `2x = 11π/4`, and `cos(11π/4) = cos(3π/4) = -√2/2`." }],
            hints:["Compare step 4 with step 2. Does step 4 search the whole interval?", "`u` runs from 0 to 4π: two laps. Each lap has two angles with cosine `-√2/2`.", "Step 4 is wrong: `u = 3π/4`, 5π/4, 11π/4, 13π/4, so `x = 3π/8`, 5π/8, 11π/8, 13π/8."] }
        ] },
      { id:"beyond", type:"custom", title:"Beyond the special angles", summary:"Beyond the special angles", star:true, goal:[3, 4, 6],
        instruction:"These go past routine solving: approximate answers, multiple angles and working backwards. Use paper, then enter your answers.",
        how:"Type each answer in its box (two decimal places where asked), or tap the strip. Then press Check.",
        general:"One or more of your answers don’t fit yet. Check each value in the equation.",
        items:[
          { id:"r1", goal:3, label:"Approximate solutions", use:"`cos 1.16 ≈ 0.40`, `π ≈ 3.14`",
            prompt:"Solve `5 cos x - 2 = 0` for `0 ≤ x ≤ 2π`, to two decimal places.",
            boxes:[{ k:"dec", lab:"`x ≈`" }, { k:"dec", lab:"`x ≈`" }], answer:[1.16, 5.12],
            wrong:[{ has:[1.98], fb:"That’s `π - 1.16`, the partner for <strong>sine</strong>. Which angle is cosine’s partner?" }, { has:[4.30], fb:"That’s `π + 1.16`, where cosine is negative. `cos x = 0.40` is positive: quadrants 1 and 4." }, { has:[0.40], fb:"0.40 is the value of `cos x`, not the angle. Use the given value to find the angle." }, { has:[7.44], fb:"`1.16 + 2π` is past 2π, so it’s outside the interval. Cosine’s second angle is in quadrant 4." }],
            hints:["Isolate `cos x` first.", "`cos x = 2/5 = 0.40`, so the reference angle is about 1.16. Cosine is positive in quadrants 1 and 4.", "`x ≈ 1.16` and `x ≈ 2π - 1.16 ≈ 6.28 - 1.16 = 5.12`."] },
          { id:"r2", goal:[3, 4], label:"A quadratic with a non-special value", use:"`sin 0.25 ≈ 0.25`, `π ≈ 3.14`",
            prompt:"Solve `4 sin^2x - 3 sin x - 1 = 0` for `0 ≤ x ≤ 2π`, to two decimal places.",
            boxes:[{ k:"dec", lab:"`x ≈`" }, { k:"dec", lab:"`x ≈`" }, { k:"dec", lab:"`x ≈`" }], answer:[1.57, 3.39, 6.03],
            wrong:[{ has:[0.25], fb:"Those make `sin x = +1/4`. The factor is `4 sin x + 1 = 0`, so `sin x = -1/4`: quadrants 3 and 4." }, { has:[2.89], fb:"Those make `sin x = +1/4`. The factor is `4 sin x + 1 = 0`, so `sin x = -1/4`: quadrants 3 and 4." },
              { has:[4.71], fb:"That’s 3π/2, where `sin x = -1`. `(4 sin x - 1)(sin x + 1)` expands to `4 sin^2x + 3 sin x - 1`: the middle sign is wrong. Check the signs in your factors." },
              { has:[3.39, 6.03], lacks:[1.57], fb:"Your two angles are right, but the equation has another factor. Which line does it give, and where does that line meet the wave?" },
              { has:[-0.25], fb:"That angle has sine −1/4, but it’s outside `0 ≤ x ≤ 2π`. Add a full turn to bring it into the interval." }],
            hints:["Factor as a quadratic in `sin x`: two numbers with product 4 × (−1) = −4 and sum −3.", "`(4 sin x + 1)(sin x - 1) = 0`, so `sin x = -1/4` or `sin x = 1`.", "`sin x = 1` gives `π/2 ≈ 1.57`. `sin x = -1/4` has reference angle about 0.25 in quadrants 3 and 4: `π + 0.25 ≈ 3.39` and `2π - 0.25 ≈ 6.03`."] },
          { id:"r3", goal:6, label:"A multiple angle with a given value", use:"`tan 1.2 ≈ 2.6`, `π ≈ 3.14`",
            prompt:"Solve `5 tan 2x = 13` for `0 ≤ x ≤ 2π`. Enter how many solutions there are, then the smallest and the largest, to two decimal places.",
            boxes:[{ k:"int", lab:"Number of solutions" }, { k:"dec", lab:"Smallest `x ≈`" }, { k:"dec", lab:"Largest `x ≈`" }], answer:[4, 0.60, 5.31], ordered:true,
            wrong:[{ box:0, val:2, fb:"`u = 2x` runs from 0 to 4π, and tangent repeats every π. How many values of `u` fit in that interval?" }, { box:1, val:1.20, fb:"1.2 is the value of `u = 2x`, not of `x`. What do you do to `u` to get `x`?" }, { box:2, val:2.17, fb:"That’s the last solution with `u ≤ 2π`. But `u = 2x` runs up to 4π, so there are more values of `u`." }, { box:2, val:10.62, fb:"That’s the largest `u`, which is `2x`, not `x`." }, { box:2, val:10.63, fb:"That’s the largest `u`, which is `2x`, not `x`." }],
            hints:["Isolate `tan 2x`, then let `u = 2x`. What interval does `u` cover?", "`tan u = 2.6` with `0 ≤ u ≤ 4π`. Tangent repeats every π: `u ≈ 1.2`, `1.2 + π`, `1.2 + 2π`, `1.2 + 3π`.", "`u ≈ 1.20`, 4.34, 7.48, 10.62, so `x = u/2 ≈ 0.60`, 2.17, 3.74, 5.31: 4 solutions."] },
          { id:"r4", goal:[1, 4], label:"Working backwards",
            prompt:"`x = 5π/6` is a solution of `4 sin^2x + b sin x - 3 = 0`. Find `b`, then tap every solution on the strip.",
            boxes:[{ k:"int", lab:"`b =`" }], strip:true, answer:{ nums:[4], set:[2, 10] }, ordered:true,
            wrong:[{ box:0, val:-4, fb:"`sin(5π/6)` is +1/2 (quadrant 2), not −1/2." }, { box:0, val:2, fb:"The first term is `4 sin^2x = 4 × (1/2)^2 = 1`, not 4 × 1/2." }, { neg:true, fb:"Factor `4 sin^2x + 4 sin x - 3`. One factor asks for a value of `sin x` below −1, which is impossible, so it adds nothing." }, { set:[10], fb:"`sin x = 1/2` has a second solution: sine is positive in quadrant 1 as well." }],
            hints:["If 5π/6 is a solution, the equation is true when `sin x = sin(5π/6)`. What’s `sin(5π/6)`?", "`sin(5π/6) = 1/2`: `4(1/4) + b(1/2) - 3 = 0`, so `1 + b/2 - 3 = 0` and `b = 4`.", "`4 sin^2x + 4 sin x - 3 = (2 sin x - 1)(2 sin x + 3) = 0`. `sin x = 1/2` gives π/6 and 5π/6; `sin x = -3/2` is impossible."] },
          { id:"r5", goal:[4, 6], label:"Square roots and laps together",
            prompt:"How many solutions does `2 sin^2(2x) = 1` have on `0 ≤ x ≤ 2π`? Enter the count and the largest solution.",
            boxes:[{ k:"int", lab:"Number of solutions" }, { k:"pi", lab:"Largest solution" }], answer:[8, 1.875], ordered:true,
            wrong:[{ all:[[0, 4], [1, 1.375]], fb:"That’s `sin 2x = +√2/2` only. `sin^2(2x) = 1/2` also allows `sin 2x = -√2/2`." }, { all:[[0, 4], [1, 0.875]], fb:"That’s only the first lap of `u = 2x`. `u` runs to 4π." }, { box:0, val:2, fb:"Both the ± roots and the second lap are missing." }, { box:1, val:3.75, fb:"That’s the largest value of `u = 2x`, not of `x`." }],
            hints:["Get `sin^2(2x)` alone, then take square roots. How many values of `sin 2x` do you get?", "`sin 2x = ±√2/2`. With `u = 2x` from 0 to 4π, each lap has four angles: π/4, 3π/4, 5π/4, 7π/4.", "`u = π/4`, 3π/4, …, 15π/4 (8 values), so `x = π/8`, 3π/8, …, 15π/8: 8 solutions, the largest 15π/8."] },
          { id:"r6", goal:4, label:"Reasoning backwards from a count",
            prompt:"There are two values of `c` for which `2 sin^2x - 3 sin x + c = 0` has <strong>exactly 3 solutions</strong> on `0 ≤ x ≤ 2π`. Find both.",
            boxes:[{ k:"frac", lab:"`c =`" }, { k:"frac", lab:"`c =`" }], answer:[0, 1], anyOrder:true,
            wrong:[{ has:[1.125], fb:"That makes a double root, `sin x = 3/4`, which is one line cutting the wave twice: 2 solutions." }, { has:[-5], fb:"The roots are `sin x = -1` and 5/2: only 3π/2. 1 solution." }, { has:[-1], fb:"The roots are about 1.78 (impossible) and −0.28: 2 solutions." }, { has:[2], fb:"`2u^2 - 3u + 2 = 0` has no real roots (the discriminant is 9 − 16 < 0): no solutions." }],
            hints:["Each root `u` of `2u^2 - 3u + c = 0` is a line `y = u`. Which line heights give 1 solution, which give 2, and which give 3?", "Heights ±1 give 1 solution, `u = 0` gives 3 (0, π, 2π), other heights between −1 and 1 give 2. The two roots add to 3/2. So you need `u = 1` with `u = 1/2` (1 + 2), or `u = 0` with `u = 3/2` (3 + 0).", "Roots 1 and 1/2: `c = 2 × 1 × 1/2 = 1`. Roots 0 and 3/2: `c = 0`. Both give exactly 3 solutions."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the number of solutions as the line moved, what happened at the ends of the interval, or what changed with `2x` and `3x`?" },
      { id:"j2", q:"In your own words, why does `sin x = 0.4` have two solutions between 0 and 2π, and how does the unit circle show where the second one is?" },
      { id:"j3", q:"Explain to a friend, step by step, how to solve `2 sin^2x - 3 sin x - 2 = 0`, including how you’d know you have every solution." },
      { id:"j4", q:"Which step do you still find hardest: getting one ratio, factoring, finding every angle, or handling `2x`? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ fixedOrder:true, prompt:"Solve `2 cos x + 1 = 0` for `0 ≤ x ≤ 2π`.", options:[
          { t:"`x = π/3` or `x = 5π/3`", why:"Those make `cos x = +1/2`. Isolating gives `cos x = -1/2`, which is negative: quadrants 2 and 3." },
          { t:"`x = 2π/3` only", why:"Cosine is negative in quadrant 3 too: 4π/3 also works." },
          { t:"`x = 2π/3` or `x = 4π/3`", ok:true, why:"`cos x = -1/2` has reference angle π/3; cosine is negative in quadrants 2 and 3: `π - π/3` and `π + π/3`." },
          { t:"`x = 5π/6` or `x = 7π/6`", why:"Right quadrants, wrong size: those have cosine `-√3/2`. The value 1/2 belongs to reference angle π/3." }] },
        b:{ fixedOrder:true, prompt:"Solve `2 sin x + √2 = 0` for `0 ≤ x ≤ 2π`.", options:[
          { t:"`x = π/4` or `x = 3π/4`", why:"Those make `sin x = +√2/2`. Isolating gives `sin x = -√2/2`, which is negative: quadrants 3 and 4." },
          { t:"`x = 5π/4` only", why:"Sine is negative in quadrant 4 too: 7π/4 also works." },
          { t:"`x = 5π/4` or `x = 7π/4`", ok:true, why:"`sin x = -√2/2` has reference angle π/4; sine is negative in quadrants 3 and 4: `π + π/4` and `2π - π/4`." },
          { t:"`x = 4π/3` or `x = 5π/3`", why:"Right quadrants, wrong size: those have sine `-√3/2`." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Factoring `2 sin^2x - 5 sin x - 3 = 0` gives `(2 sin x + 1)(sin x - 3) = 0`. What does the factor `sin x - 3` add to the solutions?", options:[
          { t:"No solutions, because `sin x` is never 3", ok:true, why:"Sine stays between −1 and 1, so the line `y = 3` never meets the wave. The other factor still gives 7π/6 and 11π/6." },
          { t:"One solution, the angle `x = 3`", why:"That treats the value of `sin x` as the angle. `sin 3` is between −1 and 1 (about 0.14), not 3." },
          { t:"It makes the whole equation have no solutions.", why:"Only that factor is impossible. `2 sin x + 1 = 0` still gives 7π/6 and 11π/6." },
          { t:"Two solutions, like the other factor.", why:"The line `y = 3` is above the whole wave, so it never meets it." }] },
        b:{ prompt:"Factoring `3 cos^2x + 5 cos x - 2 = 0` gives `(3 cos x - 1)(cos x + 2) = 0`. What does the factor `cos x + 2` add to the solutions?", options:[
          { t:"No solutions, because `cos x` is never −2", ok:true, why:"Cosine stays between −1 and 1, so the line `y = -2` never meets the wave. The other factor, `cos x = 1/3`, still gives two solutions." },
          { t:"One solution, the angle `x = -2`", why:"That treats the value of `cos x` as the angle. −2 isn’t even in `0 ≤ x ≤ 2π`." },
          { t:"It makes the whole equation have no solutions.", why:"Only that factor is impossible. `3 cos x - 1 = 0` still gives two angles." },
          { t:"Two solutions, like the other factor.", why:"The line `y = -2` is below the whole wave, so it never meets it." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ fixedOrder:true, prompt:"To solve `sin 2x = 1/2` for `0 ≤ x ≤ 2π`, you let `u = 2x`. Which values of `u` must you search?", options:[
          { t:"`0 ≤ u ≤ π`", why:"That divides the interval by 2. Since `u = 2x`, multiply: the largest `u` is 2 × 2π." },
          { t:"`0 ≤ u ≤ 2π`", why:"That keeps `x`’s interval and misses the second lap." },
          { t:"`2 ≤ u ≤ 2π + 2`", why:"That’s the interval for `x + 2`, not `2x`." },
          { t:"`0 ≤ u ≤ 4π`", ok:true, why:"If `0 ≤ x ≤ 2π`, then `0 ≤ 2x ≤ 4π`: two laps of the circle." }] },
        b:{ fixedOrder:true, prompt:"To solve `cos 3x = -1/2` for `0 ≤ x ≤ 2π`, you let `u = 3x`. Which values of `u` must you search?", options:[
          { t:"`0 ≤ u ≤ 2π/3`", why:"That divides the interval by 3. Since `u = 3x`, multiply: the largest `u` is 3 × 2π." },
          { t:"`0 ≤ u ≤ 2π`", why:"That keeps `x`’s interval and misses two laps." },
          { t:"`3 ≤ u ≤ 2π + 3`", why:"That’s the interval for `x + 3`, not `3x`." },
          { t:"`0 ≤ u ≤ 6π`", ok:true, why:"If `0 ≤ x ≤ 2π`, then `0 ≤ 3x ≤ 6π`: three laps of the circle." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ fixedOrder:true, prompt:"The equation `3 sin x = m` has <strong>exactly one</strong> solution on `0 ≤ x ≤ 2π`. Which could `m` be?", options:[
          { t:"`m = -3`", ok:true, why:"`sin x = -1` has only one solution, 3π/2: the line `y = -1` touches the wave at its lowest point." },
          { t:"`m = 0`", why:"`sin x = 0` has three solutions: 0, π and 2π." },
          { t:"`m = 1.5`", why:"`sin x = 1/2` has two solutions, π/6 and 5π/6." },
          { t:"`m = 4`", why:"`sin x = 4/3` has no solutions: sine is never more than 1." }] },
        b:{ fixedOrder:true, prompt:"The equation `2 cos x = m` has <strong>exactly one</strong> solution on `0 ≤ x ≤ 2π`. Which could `m` be?", options:[
          { t:"`m = -2`", ok:true, why:"`cos x = -1` has only one solution, π: the line touches the wave at its lowest point." },
          { t:"`m = 0`", why:"`cos x = 0` has two solutions, π/2 and 3π/2." },
          { t:"`m = 1`", why:"`cos x = 1/2` has two solutions, π/3 and 5π/3." },
          { t:"`m = 2`", why:"`cos x = 1` has two solutions in `0 ≤ x ≤ 2π`: 0 <strong>and</strong> 2π. Both ends count." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ fixedOrder:true, prompt:"Solve `cos 2x + 3 cos x + 2 = 0` for `0 ≤ x ≤ 2π`.", options:[
          { t:"`x = 0`, π/3, 5π/3, 2π", why:"Those solve `(2 cos x - 1)(cos x - 1) = 0`. Using `cos 2x = 2 cos^2x - 1` gives `2 cos^2x + 3 cos x + 1 = 0 = (2 cos x + 1)(cos x + 1)`: the signs are +." },
          { t:"`x = 2π/3`, 4π/3", why:"That’s only the factor `2 cos x + 1`. `cos x + 1 = 0` adds π." },
          { t:"`x = 2π/3`, π, 4π/3", ok:true, why:"With `cos 2x = 2 cos^2x - 1`: `2 cos^2x + 3 cos x + 1 = 0`, so `(2 cos x + 1)(cos x + 1) = 0`. `cos x = -1/2` gives 2π/3, 4π/3; `cos x = -1` gives π." },
          { t:"`x = π` only", why:"That’s only the factor `cos x + 1`. `cos x = -1/2` adds 2π/3 and 4π/3." }] },
        b:{ fixedOrder:true, prompt:"Solve `cos 2x = 3 cos x + 1` for `0 ≤ x ≤ 2π`.", options:[
          { t:"`x = π/3`, 5π/3", why:"Those make `cos x = +1/2`. `2 cos^2x - 3 cos x - 2 = (2 cos x + 1)(cos x - 2)`, so `cos x = -1/2`." },
          { t:"`x = 2π/3` only", why:"`cos x = -1/2` has a quadrant 3 solution too: 4π/3." },
          { t:"`x = 2π/3`, 4π/3", ok:true, why:"With `cos 2x = 2 cos^2x - 1`: `2 cos^2x - 3 cos x - 2 = 0`, so `(2 cos x + 1)(cos x - 2) = 0`. `cos x = 2` is impossible; `cos x = -1/2` gives 2π/3 and 4π/3." },
          { t:"`x = π` only", why:"That comes from treating `cos 2x` as `2 cos x`: `2 cos x = 3 cos x + 1` gives `cos x = -1`. But `cos 2x` isn’t `2 cos x`; at `x = π`, `cos 2π = 1` while `3 cos π + 1 = -2`." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ fixedOrder:true, prompt:"How many solutions does `2 sin 3x = 1` have on `0 ≤ x ≤ 2π`, and what is the largest?", options:[
          { t:"2 solutions; the largest is 5π/18", why:"That’s only the first lap of `u = 3x`. `u` runs from 0 to 6π." },
          { t:"4 solutions; the largest is 17π/18", why:"That’s two laps. `u = 3x` runs to 6π: three laps." },
          { t:"6 solutions; the largest is 29π/18", ok:true, why:"`sin u = 1/2` with `0 ≤ u ≤ 6π`: `u = π/6`, 5π/6, 13π/6, 17π/6, 25π/6, 29π/6. Divide by 3: the largest is 29π/18." },
          { t:"6 solutions; the largest is 29π/6", why:"29π/6 is the largest `u = 3x`. Divide by 3. (29π/6 is past 2π.)" }] },
        b:{ fixedOrder:true, prompt:"How many solutions does `2 cos 3x = √3` have on `0 ≤ x ≤ 2π`, and what is the largest?", options:[
          { t:"2 solutions; the largest is 11π/18", why:"That’s only the first lap of `u = 3x`. `u` runs from 0 to 6π." },
          { t:"4 solutions; the largest is 23π/18", why:"That’s two laps. `u = 3x` runs to 6π: three laps." },
          { t:"6 solutions; the largest is 35π/18", ok:true, why:"`cos u = √3/2` with `0 ≤ u ≤ 6π`: `u = π/6`, 11π/6, 13π/6, 23π/6, 25π/6, 35π/6. Divide by 3: the largest is 35π/18." },
          { t:"6 solutions; the largest is 35π/6", why:"35π/6 is the largest `u = 3x`. Divide by 3." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `sin x = 1/2` has two solutions on `0 ≤ x ≤ 2π`, but `sin x = 1` has only one?", options:[
          { t:"“The line `y = 1/2` crosses the wave twice, at π/6 and 5π/6, but the line `y = 1` only touches it at the peak, π/2. On the unit circle, `y = 1/2` cuts the circle twice, but `y = 1` touches it once, at (0, 1).”", ok:true, why:"This connects the graph, the circle and the count." },
          { t:"“1/2 is a fraction, and the wave reaches a fraction twice in a turn, once rising and once falling. 1 is a whole number, and the wave reaches a whole number only once.”", why:"Whether the value is a whole number has nothing to do with it: `sin x = 0` has three solutions, and 0 is a whole number." },
          { t:"“Sine is positive in two quadrants, so every positive value of sine has exactly two solutions on `0 ≤ x ≤ 2π`, one in quadrant 1 and one in quadrant 2.”", why:"1 is positive too, and it has only one. The two-quadrant rule fails at the peak, π/2, which is on the border between quadrants 1 and 2." },
          { t:"“On the whole number line, `sin x = 1` has just one solution, `x = π/2`, while `sin x = 1/2` has exactly two, so the interval `0 ≤ x ≤ 2π` makes no difference.”", why:"Both have infinitely many solutions on the whole number line (`sin x = 1` at π/2, 5π/2, …). The difference is how many fall in one turn." }] },
        b:{ prompt:"Which is the best explanation of why `cos x = -1/2` has two solutions on `0 ≤ x ≤ 2π`, but `cos x = -1` has only one?", options:[
          { t:"“The vertical line `x = -1/2` cuts the unit circle twice, at 2π/3 and 4π/3, but the line `x = -1` only touches it at (−1, 0), the angle π. On the graph, `y = -1` only touches the wave at its lowest point.”", ok:true, why:"This connects the circle, the graph and the count." },
          { t:"“−1/2 is a fraction, and the wave reaches a fraction twice in a turn, once falling and once rising. −1 is a whole number, and the wave reaches a whole number only once.”", why:"Whether the value is a whole number has nothing to do with it: `cos x = 0` has two solutions, and 0 is a whole number." },
          { t:"“Cosine is negative in two quadrants, so every negative value of cosine has exactly two solutions on `0 ≤ x ≤ 2π`, one in quadrant 2 and one in quadrant 3.”", why:"−1 is negative too, and it has only one. The two-quadrant rule fails at the lowest point, π, which is on the border between quadrants 2 and 3." },
          { t:"“On the whole number line, `cos x = -1` has just one solution, `x = π`, while `cos x = -1/2` has exactly two, so the interval `0 ≤ x ≤ 2π` makes no difference.”", why:"Both have infinitely many solutions on the whole number line (`cos x = -1` at π, 3π, …). The difference is how many fall in one turn." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Kai solves `sin x cos x = sin x` by dividing both sides by `sin x`. He gets `cos x = 1`, so `x = 0` and `x = 2π`. Which statement best describes his work?", options:[
          { t:"“His answer is missing `x = π`. Dividing by `sin x` assumes `sin x ≠ 0`. Factoring, `sin x (cos x - 1) = 0`, keeps `sin x = 0`, which adds π.”", ok:true, why:"`sin x = 0` gives 0, π and 2π; `cos x = 1` gives 0 and 2π. Together: 0, π, 2π." },
          { t:"“His work is correct: dividing both sides of an equation by the same expression always keeps it balanced, so none of its solutions are lost.”", why:"Only by something that isn’t 0. Check `x = π`: `sin π cos π = 0 = sin π`, so π is a solution he lost." },
          { t:"“His answer is right, but dividing both sides by `cos x` instead would be quicker: it gives `sin x = tan x`, which is easier to solve.”", why:"That also assumes the ratio isn’t 0, and `sin x = tan x` still mixes ratios. His answer is also missing π." },
          { t:"“His answer has too many solutions: 2π is the same angle as 0, so it should be left out when solving on `0 ≤ x ≤ 2π`.”", why:"`0 ≤ x ≤ 2π` includes both ends, so 0 and 2π both count. What’s missing is π." }] },
        b:{ prompt:"Mei solves `2 cos^2x = cos x` by dividing both sides by `cos x`. She gets `cos x = 1/2`, so `x = π/3` and `x = 5π/3`. Which statement best describes her work?", options:[
          { t:"“Her answer is missing `x = π/2` and `x = 3π/2`. Dividing by `cos x` assumes `cos x ≠ 0`. Factoring, `cos x (2 cos x - 1) = 0`, keeps `cos x = 0`, which adds π/2 and 3π/2.”", ok:true, why:"`cos x = 0` gives π/2 and 3π/2; `cos x = 1/2` gives π/3 and 5π/3." },
          { t:"“Her work is correct: dividing both sides of an equation by the same expression always keeps it balanced, so none of its solutions are lost.”", why:"Only by something that isn’t 0. Check `x = π/2`: `2 cos^2(π/2) = 0 = cos(π/2)`, so π/2 is a solution she lost." },
          { t:"“Her answer is right, but dividing both sides by `cos^2x` instead would be quicker: it gives `2 = 1/cos x`, so `cos x = 1/2` at once.”", why:"Dividing by `cos^2x` also assumes `cos x ≠ 0`, so it loses the same solutions. Her answer is missing π/2 and 3π/2." },
          { t:"“Her answer has too many solutions: `cos x = 1/2` has only one solution on `0 ≤ x ≤ 2π`, the angle π/3, so 5π/3 should be left out.”", why:"`cos x = 1/2` has two: π/3 and 5π/3 (`2π - π/3`). What’s missing is π/2 and 3π/2." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ fixedOrder:true, use:"`sin 0.41 ≈ 0.40`, `π ≈ 3.14`", prompt:"A robot arm 2 m long turns about a pivot. After it turns through an angle `x` (`0 ≤ x ≤ 2π`) from the positive `x`-axis, its tip is `2 sin x` metres above the pivot. For which angles is the tip 0.8 m above the pivot?", options:[
          { t:"`x ≈ 0.41` only", why:"The tip is 0.8 m up twice in a turn: on the way up and on the way down." },
          { t:"`x ≈ 0.41` or `x ≈ 2.73`", ok:true, why:"`2 sin x = 0.8` gives `sin x = 0.40`, so the reference angle is about 0.41. Sine is positive in quadrants 1 and 2: `x ≈ 0.41` and `π - 0.41 ≈ 2.73`." },
          { t:"`x ≈ 0.41` or `x ≈ 3.55`", why:"`π + 0.41` is in quadrant 3, where the tip is <strong>below</strong> the pivot." },
          { t:"`x ≈ 0.41` or `x ≈ 5.87`", why:"`2π - 0.41` is cosine’s partner. In quadrant 4 the tip is below the pivot." }] },
        b:{ fixedOrder:true, use:"`cos 1.37 ≈ 0.20`, `π ≈ 3.14`", prompt:"A crane arm 5 m long turns about a pivot. After it turns through an angle `x` (`0 ≤ x ≤ 2π`) from the positive `x`-axis, its tip is `5 cos x` metres to the right of the pivot (a negative value means to the left). For which angles is the tip 1 m to the right of the pivot?", options:[
          { t:"`x ≈ 1.37` only", why:"The tip is 1 m to the right twice in a turn: once above the pivot and once below." },
          { t:"`x ≈ 1.37` or `x ≈ 1.77`", why:"`π - 1.37` is in quadrant 2, where the tip is to the <strong>left</strong> of the pivot." },
          { t:"`x ≈ 1.37` or `x ≈ 4.51`", why:"`π + 1.37` is in quadrant 3, where the tip is to the left of the pivot." },
          { t:"`x ≈ 1.37` or `x ≈ 4.91`", ok:true, why:"`5 cos x = 1` gives `cos x = 0.20`, so the reference angle is about 1.37. Cosine is positive in quadrants 1 and 4: `x ≈ 1.37` and `2π - 1.37 ≈ 4.91`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ fixedOrder:true, prompt:"A soccer ball is kicked from level ground at an angle `θ` above the ground, with `0 < θ < π/2`. Ignoring air resistance, it lands `R = 40 sin 2θ` metres away. At which angles does it land 20 m away?", options:[
          { t:"`θ = π/12` only", why:"`sin 2θ = 1/2` also at `2θ = 5π/6`, which gives a second angle, 5π/12." },
          { t:"`θ = π/12` or `θ = 5π/12`", ok:true, why:"`sin 2θ = 1/2`. Since `0 < θ < π/2`, `0 < 2θ < π`, so `2θ = π/6` or 5π/6, and `θ = π/12` or 5π/12." },
          { t:"`θ = π/12`, 5π/12, 13π/12 or 17π/12", why:"The angles 13π/12 and 17π/12 point into the ground. The context only allows `0 < θ < π/2`." },
          { t:"`θ = π/6` or `θ = 5π/6`", why:"Those are the values of `2θ`. Divide by 2 (and 5π/6 isn’t a launch angle above the ground)." }] },
        b:{ fixedOrder:true, prompt:"A golf ball is hit from level ground at an angle `θ` above the ground, with `0 < θ < π/2`. Ignoring air resistance, it lands `R = 60 sin 2θ` metres away. At which angles does it land `30√2` m (about 42.4 m) away?", options:[
          { t:"`θ = π/8` only", why:"`sin 2θ = √2/2` also at `2θ = 3π/4`, which gives a second angle, 3π/8." },
          { t:"`θ = π/8` or `θ = 3π/8`", ok:true, why:"`sin 2θ = √2/2`. Since `0 < 2θ < π`, `2θ = π/4` or 3π/4, so `θ = π/8` or 3π/8." },
          { t:"`θ = π/8`, 3π/8, 9π/8 or 11π/8", why:"The angles 9π/8 and 11π/8 point into the ground. The context only allows `0 < θ < π/2`." },
          { t:"`θ = π/4` or `θ = 3π/4`", why:"Those are the values of `2θ`. Divide by 2." }] } }
    ]
  },
  task:{
    title:"Design a four-solution equation", summary:"Design a four-solution equation",
    statement:"<p>Design a quadratic equation `a cos^2x + b cos x + c = 0` that has `x = 2π/3` as a solution and <strong>exactly four</strong> solutions on `0 ≤ x ≤ 2π`, all of them special angles. There’s more than one design. Can you find them all?</p>",
    checks:["A quadratic in lowest terms", "`x = 2π/3` is a solution", "Exactly four solutions on `0 ≤ x ≤ 2π`", "Every solution is a special angle"],
    tips:["Make `a` positive, and divide out any number that goes into `a`, `b` and `c` (for example, 4, −2, −2 is 2 × (2, −1, −1)).",
      "`cos(2π/3) = -1/2`. Substitute `u = -1/2`: `a/4 - b/2 + c` must be 0. So `2 cos x + 1` must be a factor.",
      "Right now there are {n} solutions. The factor `2 cos x + 1` gives two (2π/3 and 4π/3). The other factor must give exactly two more: which values of `cos x` give two angles in `0 ≤ x ≤ 2π`?",
      "`cos x =` {root} isn’t a special value, so its angles aren’t special angles. Try a value of `cos x` from the unit circle."],
    explainPrompt:"Explain how you chose your coefficients and how you know there are exactly four solutions.",
    vocab:"Use the words factor, root, special angle and both ends of the interval.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found all three. Each one has the factor `2 cos x + 1` (for 2π/3 and 4π/3). The other factor adds exactly two special angles: `cos x = 0` (π/2, 3π/2), `cos x = 1/2` (π/3, 5π/3) or `cos x = 1` (0 and 2π, both ends of the interval). `cos x = -1` would add only one."
  },
  cards:[
    ["Solving a trig equation", "Find <strong>every</strong> angle in `0 ≤ x ≤ 2π` that makes it true. On the graph: where `y = sin x` meets the line `y =` value. On the circle: where that line cuts the circle."],
    ["Isolate the ratio first", "`2 sin x + 1 = 0 → sin x = -1/2`. Then find the reference angle (π/6) and the quadrants (3 and 4): `x = 7π/6`, 11π/6."],
    ["Partner angles", "sin: `x` and `π - x`. cos: `x` and `2π - x`. tan: `x` and `x + π`."],
    ["How many solutions does `sin x = v` have on `0 ≤ x ≤ 2π`?", "2 if `-1 < v < 1` and `v ≠ 0`; 3 if `v = 0` (0, π, 2π); 1 if `v = ±1`; none if `|v| > 1`."],
    ["Both ends count", "`0 ≤ x ≤ 2π` includes 0 and 2π. `cos x = 1` has two solutions there: 0 and 2π."],
    ["Impossible values", "`sin x` and `cos x` stay between −1 and 1. A factor such as `sin x - 3 = 0` gives no solutions; the other factor still counts."],
    ["Quadratic trig equation", "Treat it as a quadratic in `u = sin x`: `2 sin^2x - sin x - 1 = (2 sin x + 1)(sin x - 1) = 0 → sin x = -1/2` or 1 → 7π/6, 11π/6, π/2."],
    ["Never divide by a trig ratio", "It deletes the solutions where that ratio is 0. `sin x cos x = sin x → sin x (cos x - 1) = 0` → 0, π, 2π."],
    ["Square roots give ±", "`sin^2x = 1/4 → sin x = ±1/2` → π/6, 5π/6, 7π/6, 11π/6."],
    ["Which identity?", "Pick the form that matches the other terms. With `sin x`: `cos 2x = 1 - 2 sin^2x`, `cos^2x = 1 - sin^2x`. With `cos x`: `cos 2x = 2 cos^2x - 1`, `sin^2x = 1 - cos^2x`."],
    ["Multiple angles", "For `sin 2x = 1/2` on `0 ≤ x ≤ 2π`, let `u = 2x`, so `0 ≤ u ≤ 4π` (two laps): `u = π/6`, 5π/6, 13π/6, 17π/6 → `x = π/12`, 5π/12, 13π/12, 17π/12."],
    ["Approximate solutions", "Given `sin 0.41 ≈ 0.40`: `sin x = 0.40 → x ≈ 0.41` and `π - 0.41 ≈ 2.73`. `sin x = -0.40 → π + 0.41 ≈ 3.55` and `2π - 0.41 ≈ 5.87`."]
  ]
};
