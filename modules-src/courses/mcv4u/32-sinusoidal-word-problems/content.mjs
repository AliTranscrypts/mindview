// MCV4U 32 Sinusoidal Word Problems. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/32-sinusoidal-word-problems.md
// misconception core sentences (plan §3)
const M1 = "The inside `πt/10` has derivative `π/10`. Multiply by it.";
const M2 = "At the top the height stops increasing: `h′ = 0`. The rate is largest at the axis.";
const M3 = "The axle height lifts the whole graph; the derivative of a constant is 0.";
const M4 = "`d/dt cos u = -sin u · u′`. Falling fastest means `h′` is most negative.";
const M5 = "The rate is a sinusoid too: half the top speed when sin = 1/2, at 1/12 of a period, not 1/8.";
const M6 = "The wheel turns at a steady speed; only the <strong>vertical</strong> part of the motion changes.";
const M7 = "Check the allowed angles, and compare the critical value with the endpoints.";
const PI = Math.PI, R3 = Math.sqrt(3), R2 = Math.sqrt(2);

export default {
  id:"32-sinusoidal-word-problems",
  kind:"topic",
  title:"Sinusoidal word problems",
  topic:"Sinusoidal Word Problems",
  readyTopic:"sinusoidal word problems",
  hero:{
    eq:"<span class=\"sr-heq1\">`h(t) = @a{-10} cos(πt/30) + @c{12}`</span><span class=\"sr-heq1\">⟶ `h′(t) = (π/3) sin(πt/30)`</span>",
    eqLabel:"h of t equals negative 10 cosine of pi t over 30, plus 12, so h prime of t equals pi over 3 times sine of pi t over 30",
    eqSize:"sm",
    headline:"The rate is a wave too",
    text:"A Ferris wheel, a tide or the hours of daylight rise and fall like a sine curve. The <strong>derivative</strong> is another wave: it is <strong>zero at every maximum and minimum</strong> and <strong>largest at the axis</strong>, where the graph changes concavity. Its size is the amplitude times 2π/period, so the model tells you the <strong>fastest rate</strong> before you draw anything.",
    fig:{ html:"<div class=\"sr-hero\"><canvas class=\"plot sr-hw\" id=\"hero-wheel\" role=\"img\" aria-label=\"A Ferris wheel turns at a steady speed with a rider on it.\"></canvas><div class=\"sr-hg\"><canvas class=\"plot sr-hp\" id=\"hero-plot\" role=\"img\" aria-label=\"The rider’s height graph draws as the wheel turns.\"></canvas><canvas class=\"plot sr-hp\" id=\"hero-d\" role=\"img\" aria-label=\"The rate graph h′ draws in step below.\"></canvas></div></div>" },
    cap:{ start:"The rider’s height `h` (blue) and its rate `h′` (teal) draw in step as the wheel turns.",
      end:"Level with the axle the rate is fastest; at the top `h′ = 0`." }
  },
  goals:[
    "I can differentiate a sinusoidal model and state the rate with units.",
    "I can explain where a sinusoidal model’s rate is zero and where it is greatest.",
    "I can find the fastest rate of change from the amplitude and period.",
    "I can find the rate at a given time using special-angle values.",
    "I can find the times when a model is rising or falling fastest, or changing at a given rate.",
    "I can solve optimization problems where the variable is an angle."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Derivatives of sine and cosine", goal:1, prompt:"Differentiate `y = 3 sin(2t)`.",
          options:[
            { t:"`6 cos(2t)`", ok:true, why:"Chain rule: `3 · cos(2t) · 2`." },
            { t:"`3 cos(2t)`", why:"The inside `2t` has derivative 2." },
            { t:"`-6 cos(2t)`", why:"`d/dt sin u = +cos u · u′`." },
            { t:"`6 sin(2t)`", why:"Sine’s derivative is cosine." }],
          hints:["Outer: sin → cos. Inner: `2t` → 2.", "`3 · cos(2t) · 2`.", "`6 cos(2t)`."] },
        { id:"w2", skill:"Derivatives of sine and cosine", goal:1, prompt:"Differentiate `y = 5 cos(πt/4) + 2`.",
          options:[
            { t:"`-(5π/4) sin(πt/4)`", ok:true, why:"`d/dt cos u = -sin u · u′`; the 2 disappears." },
            { t:"`(5π/4) sin(πt/4)`", why:"Cosine’s derivative is <strong>−</strong>sine." },
            { t:"`-5 sin(πt/4)`", why:"Multiply by `π/4`." },
            { t:"`-(5π/4) sin(πt/4) + 2`", why:"The derivative of 2 is 0." }],
          hints:["Three parts: the 5, the cosine, the inside.", "`5 · (-sin(πt/4)) · π/4`.", "`-(5π/4) sin(πt/4)`."] },
        { id:"w3", skill:"Model features", goal:3, prompt:"For `h(t) = 4 sin(πt/6) + 9`, what are the amplitude and the period?",
          options:[
            { t:"Amplitude 4, period 12", ok:true, why:"Period = `2π ÷ (π/6) = 12`." },
            { t:"Amplitude 4, period `π/6`", why:"Period = `2π/k`." },
            { t:"Amplitude 9, period 12", why:"9 is the axis `y = 9`." },
            { t:"Amplitude 13, period 12", why:"13 is the maximum." }],
          hints:["Amplitude = `|a|`; period = `2π/k`.", "`k = π/6`.", "4 and 12."] },
        { id:"w4", skill:"Model features", goal:2, prompt:"A Ferris wheel’s height is `h(t) = -10 cos(πt/30) + 12`, starting at the bottom. When does the rider first reach the axle height (12 m)?",
          options:[
            { t:"`t = 15` s", ok:true, why:"A quarter of the 60 s period." },
            { t:"`t = 30` s", why:"At 30 s the rider is at the top." },
            { t:"`t = 0` s", why:"At 0 the rider is at the bottom, 2 m." },
            { t:"`t = 7.5` s", why:"`cos(πt/30) = 0` first at `πt/30 = π/2`." }],
          hints:["Axle height when `cos(πt/30) = 0`.", "`πt/30 = π/2`.", "`t = 15` s."] },
        { id:"w5", skill:"Special angles", goal:4, prompt:"`sin(π/3)` = ?",
          options:[
            { t:"`√3/2`", ok:true, why:"From the 30-60-90 triangle: opposite 60° is `√3`, hypotenuse 2." },
            { t:"`1/2`", why:"`1/2` is `cos(π/3)`." },
            { t:"`√2/2`", why:"`√2/2` is for `π/4`." },
            { t:"`√3`", why:"That’s tan." }],
          hints:["Picture the 30-60-90 triangle.", "Opposite the 60° angle is `√3`; the hypotenuse is 2.", "`√3/2`."] },
        { id:"w6", skill:"Special angles", goal:5, prompt:"For `0 ≤ θ ≤ 2π`, when is `sin θ = -1/2`?",
          options:[
            { t:"`θ = 7π/6` and `11π/6`", ok:true, why:"Reference angle `π/6`, in quadrants 3 and 4." },
            { t:"`θ = π/6` and `5π/6`", why:"Those give `+1/2`." },
            { t:"`θ = 4π/3` and `5π/3`", why:"`sin(π/3) = √3/2`." },
            { t:"`θ = 7π/6` only", why:"Sine is negative in quadrants 3 <strong>and</strong> 4." }],
          hints:["Reference angle?", "`π/6`; sine negative in Q3 and Q4.", "`7π/6`, `11π/6`."] }
      ],
      refreshers:{
        "Derivatives of sine and cosine":"`d/dt sin u = cos u · u′`; `d/dt cos u = -sin u · u′`. Example: `d/dt [2 cos(3t)] = -6 sin(3t)`.",
        "Model features":"`y = a sin[k(t - d)] + c`: amplitude `|a|`, period `2π/|k|`, axis `y = c`, max `c + |a|`, min `c - |a|`.",
        "Special angles":"`sin(π/6) = 1/2`, `sin(π/4) = √2/2`, `sin(π/3) = √3/2`; cosine swaps `π/6` and `π/3`. Use CAST for the sign."
      }
    }
  },
  explore:{
    heading:"Ride the model",
    intro:"Pick a scenario, press Play, and watch the height (or depth, or daylight) and its rate of change together. Then tune the wheel.",
    scenarios:[{ id:"ferris", t:"Ferris wheel" }, { id:"tide", t:"Tide" }, { id:"daylight", t:"Daylight" }],
    txt:{
      scenario:"Scenario", r:"radius `@a{r}`", H:"axle height `@c{H}`", T:"period `T`",
      ferrisNote:"Boarding is at the bottom, so `h(t) = @c{H} - @a{r} cos(2πt/T)`.",
      tideNote:"Depth in metres, `t` hours after high tide, `0 ≤ t ≤ 24`.",
      dayNote:"Hours of daylight in a prairie city on day `t` (`0 ≤ t ≤ 365`).",
      use:"`π ≈ 3.14`",
      time:"Time `t`", play:"Play", pause:"Pause", step:"Step",
      timeNote:"Arrow keys step one tick; Shift + arrow steps 10 ticks. Space plays or pauses.",
      show:"Show", rate:"rate graph", conc:"concavity marks",
      more:"More", less:"Less",
      rows:{ model:"Model", rate:"Rate", now:"Now", rateNow:"Rate now", state:"State", fastest:"Fastest rate" },
      states:{ rise:"rising", riseF:"rising fastest", max:"at a maximum", fall:"falling", fallF:"falling fastest", min:"at a minimum" },
      atAxis:"at the axis",
      keyFerris:"Black arrow: the rider’s velocity (steady length). Teal arrow: its vertical part, the rate `h′`.",
      keyConc:"Black dots: points of inflection. Black long dashes: the second derivative.",
      capModel:"model", capRate:"rate of change", capD2:"second derivative"
    },
    predIntro:"Make a prediction first. Then the model shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Ferris wheel (`r = 10`, `H = 12`, `T = 60`), starting at `t = 0`. When in the first half-turn is the rider rising fastest?",
        options:[{ t:"`t = 15` s, level with the axle", ok:true }, { t:"`t = 30` s, at the top" }, { t:"`t = 0` s, at the bottom" }, { t:"`t = 7.5` s" }],
        explain:"`h′ = (π/3) sin(πt/30)` is largest when sin = 1, at `t = 15` s. That’s where the height curve changes from concave up to concave down." },
      { id:"p2", prompt:"Same wheel, `t = 30`. At the top, how fast is the rider’s height changing?",
        options:[{ t:"0 m/s", ok:true }, { t:"`π/3` m/s" }, { t:"22 m/s" }, { t:"`2π` m/s" }],
        explain:"The height has a maximum, so `h′ = 0`. The rider is still moving, but sideways." },
      { id:"p3", prompt:"Change `r` to 15 (and `H` to 17). What happens to the fastest vertical speed?",
        options:[{ t:"It is multiplied by 1.5", ok:true }, { t:"It stays the same" }, { t:"It is multiplied by 2.25" }, { t:"It halves" }],
        explain:"Fastest rate = `2πr/T = 2π(15)/60 = π/2`: proportional to the radius." },
      { id:"p4", prompt:"Back to `r = 10`; change `T` from 60 to 30. What happens to the fastest vertical speed?",
        options:[{ t:"It doubles", ok:true }, { t:"It halves" }, { t:"It stays the same" }, { t:"It is multiplied by 4" }],
        explain:"`k = 2π/T` doubles, and the chain rule multiplies by `k`." }
    ],
    chalIntro:"Use the model to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:5, prompt:"Tide: set the time to a moment when the water is falling fastest.",
        why:"`d′(t) = -(π/2) sin(πt/6)` is most negative when `sin(πt/6) = 1`: `t = 3` h (and 15 h, one period later).",
        hints:["`d′(t) = -(π/2) sin(πt/6)`. Falling fastest means most negative.", "`sin(πt/6) = 1`.", "`πt/6 = π/2` gives `t = 3` (and 15, one period later)."],
        msgs:{ sc:"Choose the Tide scenario first.", low:"That’s low tide: the rate is 0.", rise:"That’s rising fastest: `d′ = +π/2`.", high:"High tide: rate 0.",
          general:"`d′(t) = -(π/2) sin(πt/6)`. Falling fastest means most negative." } },
      { id:"tc2", goal:3, prompt:"Ferris: choose `@a{r}` and `T` so that the fastest vertical speed is exactly `π/2` m/s.",
        why:"Fastest rate = `2πr/T = π/2` gives `T = 4r`: (5, 20), (10, 40) or (15, 60).",
        hints:["Fastest rate = amplitude × `2π/`period.", "`2πr/T = π/2` gives `T = 4r`.", "`r = 10`, `T = 40` (or 5 and 20, or 15 and 60)."],
        msgs:{ sc:"Choose the Ferris wheel scenario first.", twice:"That’s `π` m/s, twice too fast.", half:"`π/4` m/s: half the target.",
          general:"Fastest rate = `2πr/T`. Set it equal to `π/2`." } },
      { id:"tc3", goal:5, stretch:true, prompt:"Ferris (`r = 10`, `H = 12`, `T = 60`): set the first time the rider is rising at exactly <strong>half</strong> the fastest rate.",
        why:"`(π/3) sin(πt/30) = π/6` gives `sin(πt/30) = 1/2`, so `πt/30 = π/6` and `t = 5` s (height `12 - 5√3 ≈ 3.3` m).",
        hints:["Half the fastest rate: `(π/3) sin(πt/30) = π/6`.", "`sin(πt/30) = 1/2`.", "`πt/30 = π/6`, so `t = 5` s (height `12 - 5√3 ≈ 3.3` m)."],
        msgs:{ sc:"Choose the Ferris wheel scenario first.", wheel:"Set the wheel to `r = 10`, `H = 12`, `T = 60` first.",
          lin:"Half of 15 s, but the rate isn’t linear in time.", second:"That’s the second time (on the way to the top). The first comes earlier.",
          top:"That’s the fastest rate itself.", general:"Half the fastest rate: `(π/3) sin(πt/30) = π/6`." } }
    ]
  },
  part3:{
    slug:"trig-opt", name:"Angles",
    heading:"Optimization with angles",
    intro:"Here the variable is an angle. Drag `θ`, watch the figure and its graph, then press <strong>Check it with algebra</strong>: write the quantity as a function of `θ`, solve `f′(θ) = 0` on the allowed interval, and compare with the endpoints.",
    txt:{ theta:"Angle `θ`", thetaNote:"Arrow keys step by `π/24`.", alg:"Check it with algebra", hideAlg:"Hide the algebra",
      area:"Area", angle:"Angle", fold:"sides fold inward", outside:"outside the interval", allowed:"allowed interval" },
    stations:[
      { id:"pen", title:"Station 1: the triangle pen",
        text:"Two fences, each 10 m long, meet at a post at angle `θ`. A rope closes the triangle. Which `θ` gives the largest area?",
        fn:"`A(θ) = ½(10)(10) sin θ = 50 sin θ`", unit:"m²",
        alg:["`A′(θ) = 50 cos θ = 0` at `θ = π/2` on `0 < θ < π`.", "Endpoints give 0.", "Maximum 50 m² at `θ = π/2`."] },
      { id:"gutter", title:"Station 2: the gutter",
        text:"A strip 30 cm wide is bent into a gutter: a 10 cm base with 10 cm sides, each tilted up at angle `θ` from the horizontal. Which `θ` holds the most water?",
        fn:"`A(θ) = 100 sin θ + 100 sin θ cos θ = 100 sin θ(1 + cos θ)`, for `0 ≤ θ ≤ π/2`", unit:"cm²",
        alg:["`A′ = 100(cos θ + cos^2 θ - sin^2 θ) = 100(2cos^2 θ + cos θ - 1) = 100(2 cos θ - 1)(cos θ + 1)`.",
          "`cos θ = 1/2` gives `θ = π/3`; `cos θ = -1` gives `θ = π`, outside the interval.",
          "`A(π/3) = 100(√3/2)(3/2) = 75√3 ≈ 130` cm². Endpoints: `A(0) = 0`, `A(π/2) = 100`."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Optimization with angles quick check",
      items:[
        { id:"q1", goal:6, prompt:"Area of a triangle with sides `p` and `q` and included angle `θ`?",
          choices:[{ t:"`½pq sin θ`", ok:true, fb:"Right. Base `p`, height `q sin θ`, then halve." }, { t:"`pq sin θ`", fb:"Base `p`, height `q sin θ`, then halve." },
            { t:"`½pq cos θ`", fb:"Base `p`, height `q sin θ`, then halve." }, { t:"`½(p + q) sin θ`", fb:"Base `p`, height `q sin θ`, then halve." }] },
        { id:"q2", goal:6, prompt:"`A′(θ) = 0` gives `cos θ = -1`. On `0 ≤ θ ≤ π/2`, what do you do with it?",
          choices:[{ t:"Reject it", ok:true, fb:"Right. `θ = π` is outside the interval." }, { t:"Use `θ = π`", fb:"`θ = π` is outside the interval." },
            { t:"Use `θ = 0`", fb:"`θ = π` is outside the interval." }, { t:"Use `θ = -1`", fb:"`θ = π` is outside the interval." }] },
        { id:"q3", goal:6, prompt:"Why compare with the endpoints?",
          choices:[{ t:"The maximum could be at an end", ok:true, fb:"Right. On a closed interval, the absolute max is at a critical value or an endpoint." },
            { t:"Endpoints are always the maximum", fb:"On a closed interval, the absolute max is at a critical value or an endpoint." },
            { t:"To check the derivative", fb:"On a closed interval, the absolute max is at a critical value or an endpoint." },
            { t:"They never matter", fb:"On a closed interval, the absolute max is at a critical value or an endpoint." }] },
        { id:"q4", goal:6, prompt:"Max of `50 sin θ` on `0 ≤ θ ≤ π/3`?",
          choices:[{ t:"`25√3`", ok:true, fb:"Right. No critical value inside; the max is at the endpoint `θ = π/3`." }, { t:"50", fb:"No critical value inside; the max is at the endpoint `θ = π/3`." },
            { t:"25", fb:"No critical value inside; the max is at the endpoint `θ = π/3`." }, { t:"0", fb:"No critical value inside; the max is at the endpoint `θ = π/3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Model ↔ fastest rate", summary:"Model ↔ fastest rate", goal:[1, 3],
        instruction:"Match each model with its fastest rate (the largest size of its rate). Two cards on the right have no partner.",
        leftTitle:"Model", rightTitle:"Fastest rate (largest |rate|)",
        left:[
          { id:"l1", t:"`5 sin(πt/10) + 9`", goal:3, why:"`|a|k = 5 × π/10 = π/2`." },
          { id:"l2", t:"`2 cos(πt/6) + 7`", goal:3, why:"`|a|k = 2 × π/6 = π/3`." },
          { id:"l3", t:"`6 sin(πt/2) - 1`", goal:3, why:"`|a|k = 6 × π/2 = 3π`.",
            hints:["`|a| = 6`, `k = π/2`.", "`6 × π/2`.", "`3π`."] },
          { id:"l4", t:"`4 cos(2t) + 10`", goal:3, why:"`|a|k = 4 × 2 = 8`; no `π` here." },
          { id:"l5", t:"`-3 sin(πt/4) + 3`", goal:3, why:"`|a|k = 3 × π/4 = 3π/4`; the minus only flips direction." },
          { id:"l6", t:"`12 cos(πt/30) + 14`", goal:3, why:"`|a|k = 12 × π/30 = 2π/5`.",
            hints:["`|a| = 12`, `k = π/30`.", "`12 × π/30`.", "`2π/5`."] }
        ],
        right:[
          { id:"r1", t:"`π/2`" }, { id:"r2", t:"`π/3`" }, { id:"r3", t:"`3π`" }, { id:"r4", t:"8" }, { id:"r5", t:"`3π/4`" }, { id:"r6", t:"`2π/5`" },
          { id:"r7", t:"5" }, { id:"r8", t:"`-3π/4`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l1|r7":"Multiply the amplitude by `k`.",
          "l5|r8":"The size of the rate is `|a|k`; the minus only flips direction.",
          "l4|r1":"`k = 2`, so `4 × 2 = 8`; no `π` here.", "l4|r2":"`k = 2`, so `4 × 2 = 8`; no `π` here.", "l4|r3":"`k = 2`, so `4 × 2 = 8`; no `π` here.",
          "l4|r5":"`k = 2`, so `4 × 2 = 8`; no `π` here.", "l4|r6":"`k = 2`, so `4 × 2 = 8`; no `π` here.", "l4|r8":"`k = 2`, so `4 × 2 = 8`; no `π` here." },
        wrongDefault:"Fastest rate = `|a| × k = |a| × 2π/`period; ignore `c`." },
      { id:"rates", type:"custom", title:"Rates and times", summary:"Rates and times", star:true, goal:[4, 5, 6],
        instruction:"Find exact rates, times and maximums. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions, `√` and `π` (such as `π√3/6`, `-2π^2`, `20√2`). You can type sqrt for √ and pi for π. Separate two values with a comma. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as 35, `π√3/6` or `-2π^2`.",
          exact:"Close, but give the exact value (with `√` or `π`), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:4, prompt:"`h(t) = -10 cos(πt/30) + 12`. Find `h′(10)` in m/s.",
            boxes:[{ k:"v", pre:"`h′(10) =`", post:"m/s" }], answer:{ v:PI * R3 / 6 }, display:"`π√3/6` m/s",
            wrong:[{ k:"v", eq:10 * R3 / 2, fb:"Multiply by `π/30`." }, { k:"v", eq:PI / 6, fb:"`sin(π/3) = √3/2`, not `1/2`." }],
            general:"`h′(t) = (π/3) sin(πt/30)`. Evaluate it at `t = 10`.",
            why:"`h′(t) = 10 · (π/30) sin(πt/30) = (π/3) sin(πt/30)`, and `(π/3) sin(π/3) = π√3/6 ≈ 0.91` m/s.",
            hints:["`d/dt [-10 cos(πt/30)] = 10 · (π/30) sin(πt/30)`.", "`h′(10) = (π/3) sin(π/3)`.", "`(π/3)(√3/2) = π√3/6`."] },
          { id:"s2", goal:4, prompt:"`d(t) = 3 cos(πt/6) + 5`. Find `d′(2)` in m/h.",
            boxes:[{ k:"v", pre:"`d′(2) =`", post:"m/h" }], answer:{ v:-PI * R3 / 4 }, display:"`-π√3/4` m/h",
            wrong:[{ k:"v", eq:PI * R3 / 4, fb:"`cos′ = -sin`." }],
            general:"`d′(t) = -(π/2) sin(πt/6)`. Evaluate it at `t = 2`.",
            why:"`d′(t) = -(π/2) sin(πt/6)`, and `-(π/2) sin(π/3) = -π√3/4`.",
            hints:["`d′(t) = -3 · (π/6) sin(πt/6)`.", "`d′(2) = -(π/2) sin(π/3)`.", "`-(π/2)(√3/2) = -π√3/4`."] },
          { id:"s3", goal:5, star:true, prompt:"For the wheel in item 1, the first time (s) the rider is <strong>descending</strong> at `π/6` m/s.",
            boxes:[{ k:"t", pre:"`t =`", post:"s" }], answer:{ t:35 }, display:"`t = 35` s",
            wrong:[{ k:"t", eq:5, fb:"That’s rising at `π/6`." }, { k:"t", eq:25, fb:"Also rising." }, { k:"t", eq:55, fb:"That’s the second time descending; the first is at 35 s." }],
            general:"Descending at `π/6` means `h′ = -π/6`.",
            why:"`(π/3) sin(πt/30) = -π/6` gives `sin(πt/30) = -1/2`; first at `πt/30 = 7π/6`, so `t = 35` s.",
            hints:["Descending at `π/6` means `h′ = -π/6`.", "`sin(πt/30) = -1/2`.", "`πt/30 = 7π/6`, so `t = 35` s."] },
          { id:"s4", goal:4, star:true, prompt:"A weight on a spring: `y(t) = 4 cos(πt)` cm. Find its acceleration at `t = 1/3` s, in cm/s².",
            boxes:[{ k:"a", pre:"`y″(1/3) =`", post:"cm/s²" }], answer:{ a:-2 * PI * PI }, display:"`-2π^2` cm/s²",
            wrong:[{ k:"a", eq:2 * PI * PI, fb:"`y″ = -4π^2 cos(πt)`." }, { k:"a", eq:-2 * PI, fb:"Differentiate twice: the factor is `π^2`, not `π`." }],
            general:"Differentiate twice, then substitute `t = 1/3`.",
            why:"`y′ = -4π sin(πt)`, `y″ = -4π^2 cos(πt)`, and `-4π^2 cos(π/3) = -2π^2`.",
            hints:["`y′ = -4π sin(πt)`.", "`y″ = -4π^2 cos(πt)`.", "`-4π^2 · 1/2 = -2π^2`."] },
          { id:"s5", goal:5, star:true, prompt:"For the tide `d(t) = 3 cos(πt/6) + 5` on `0 ≤ t ≤ 6`, at which times is the depth falling at exactly half its fastest rate? (Enter both.)",
            boxes:[{ k:"t", pre:"`t =`", post:"h", list:true }], answer:{ t:[1, 5] }, display:"`t = 1` h and `t = 5` h",
            wrong:[{ k:"t", eq:[3], fb:"That’s the fastest rate." }, { k:"t", eq:[2, 4], fb:"`sin(πt/6) = 1/2`, not `√3/2`." }],
            general:"Fastest falling rate is `π/2`, so half is `π/4`.",
            why:"`(π/2) sin(πt/6) = π/4` gives `sin(πt/6) = 1/2`: `πt/6 = π/6` or `5π/6`, so `t = 1` or 5.",
            hints:["Fastest falling rate is `π/2`, so half is `π/4`.", "`(π/2) sin(πt/6) = π/4` gives `sin(πt/6) = 1/2`.", "`πt/6 = π/6` or `5π/6`: `t = 1` or 5."] },
          { id:"s6", goal:6, star:true, prompt:"A rectangle is inscribed in a circle of radius 5 (its diagonal is a diameter). Its sides are `10 cos θ` and `10 sin θ`. Find the largest possible perimeter.",
            boxes:[{ k:"p", pre:"Largest perimeter" }], answer:{ p:20 * R2 }, display:"`20√2`",
            wrong:[{ k:"p", eq:20, fb:"That’s the endpoint value (a flat rectangle)." }, { k:"p", eq:40, fb:"Perimeter = `2(10 cos θ + 10 sin θ)`; at `π/4` that’s `20√2`." }],
            general:"`P(θ) = 20 cos θ + 20 sin θ`, `0 < θ < π/2`.",
            why:"`P′ = -20 sin θ + 20 cos θ = 0` at `θ = π/4`; `P(π/4) = 20√2 ≈ 28.3`, and the ends approach 20.",
            hints:["`P(θ) = 20 cos θ + 20 sin θ`, `0 < θ < π/2`.", "`P′ = -20 sin θ + 20 cos θ = 0` at `θ = π/4`.", "`P(π/4) = 20√2 ≈ 28.3`; the ends approach 20."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Felix", how:"", goal:[4, 5, 6],
        instruction:"Felix made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"A wheel’s height is `h(t) = -8 cos(πt/20) + 10`. Find the vertical speed at `t = 5` s.",
            steps:["`h′(t) = 8 sin(πt/20)`.", "`h′(5) = 8 sin(π/4)`.", "`= 8(√2/2) = 4√2` m/s.", "So the rider rises at about 5.7 m/s."],
            answer:0,
            stepFb:["", "Step 2 substitutes correctly into step 1. Look earlier.", "The arithmetic is right.", "This follows from step 3."],
            fixes:[
              { t:"`h′(t) = (8π/20) sin(πt/20) = (2π/5) sin(πt/20)`, so `h′(5) = π√2/5 ≈ 0.89` m/s.", ok:true, why:"The inside `πt/20` has derivative `π/20`." },
              { t:"`h′(t) = -8 sin(πt/20)`.", why:"`d/dt cos u = -sin u · u′`, so `-8 cos` gives `+8 sin`; the missing piece is the factor `π/20`." },
              { t:"`h′(t) = 8 sin(πt/20) + 10`.", why:"The axle height lifts the whole graph; the derivative of a constant is 0." },
              { t:"Step 1 is correct.", why:"The inside `πt/20` has derivative `π/20`." }],
            hints:["What’s the inside function?", "`πt/20`, with derivative `π/20`.", "`(2π/5) sin(πt/20)`."] },
          { id:"e2", goal:5, task:"Depth `d(t) = 2 cos(πt/6) + 6` (m, `t` in hours). When in `0 ≤ t ≤ 12` is the water falling fastest?",
            steps:["`d′(t) = -(π/3) sin(πt/6)`.", "Falling fastest means `d′` is as negative as possible.", "That happens when `sin(πt/6) = -1`.", "So `πt/6 = 3π/2` and `t = 9` h."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"`d′` is most negative when `sin(πt/6) = +1`, so `t = 3` h, falling at `π/3` m/h.", ok:true, why:"`-(π/3)(+1) = -π/3`: the most negative rate." },
              { t:"When `sin(πt/6) = 0`, so `t = 6` h.", why:"That’s low tide: rate 0." },
              { t:"When `cos(πt/6) = -1`.", why:"That gives the minimum depth, not the fastest fall." },
              { t:"Step 3 is correct.", why:"`-(π/3)(-1) = +π/3`: that’s rising fastest." }],
            hints:["Substitute sin = −1 into step 1. What sign do you get?", "`+π/3`: rising.", "sin = +1: `t = 3` h."] },
          { id:"e3", goal:6, task:"Maximize `A(θ) = 18 sin θ(1 + cos θ)` for `0 ≤ θ ≤ π/2`.",
            steps:["`A′ = 18[cos θ(1 + cos θ) - sin^2 θ]`.", "`= 18[2cos^2 θ + cos θ - 1]`.", "`= 18(2 cos θ - 1)(cos θ + 1)`.", "So `cos θ = 1/2` or `cos θ = 1`.", "`θ = π/3` or `θ = 0`; the maximum is at `θ = 0`."],
            answer:3,
            stepFb:["Step 1 is correct: product rule.", "Step 2 is correct: `sin^2 θ = 1 - cos^2 θ`.", "Step 3 factors correctly.", "", "Step 5 follows from step 4."],
            fixes:[
              { t:"`cos θ + 1 = 0` gives `cos θ = -1` (`θ = π`, outside the interval). Only `θ = π/3` remains: `A(π/3) = 27√3/2`, larger than `A(0) = 0` and `A(π/2) = 18`.", ok:true, why:"Check the allowed angles, and compare the critical value with the endpoints." },
              { t:"`cos θ = -1/2` or 1.", why:"`2 cos θ - 1 = 0` gives `+1/2`." },
              { t:"Divide by `(cos θ + 1)` first.", why:"Legal here, but it hides why `θ = π` is rejected." },
              { t:"Step 4 is correct.", why:"`cos θ + 1 = 0` means `cos θ = -1`." }],
            hints:["Solve `cos θ + 1 = 0` carefully.", "`cos θ = -1` at `θ = π`.", "Reject `π`; compare `A(π/3)` with the endpoints."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the Ferris wheel: that the rider rises fastest at the axle height, not at the top?" },
      { id:"j2", q:"In your own words, why does the amplitude times 2π/period give the fastest rate?" },
      { id:"j3", q:"Explain to a friend how to find the times when a tide is falling fastest." },
      { id:"j4", q:"Which step still trips you up: the chain-rule factor, the sign, or reading the answer in context? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`h(t) = 4 sin(πt/5) + 6`. Which is `h′(t)`?", options:[
          { t:"`(4π/5) cos(πt/5)`", ok:true, why:"`4 · cos(πt/5) · π/5`." },
          { t:"`4 cos(πt/5)`", why:"The inside `πt/5` has derivative `π/5`. Multiply by it." },
          { t:"`(4π/5) cos(πt/5) + 6`", why:M3 },
          { t:"`-(4π/5) cos(πt/5)`", why:"`d/dt sin = +cos`." }] },
        b:{ prompt:"`h(t) = 3 cos(πt/4) + 8`. Which is `h′(t)`?", options:[
          { t:"`-(3π/4) sin(πt/4)`", ok:true, why:"`3 · (-sin(πt/4)) · π/4`." },
          { t:"`-3 sin(πt/4)`", why:"The inside `πt/4` has derivative `π/4`. Multiply by it." },
          { t:"`-(3π/4) sin(πt/4) + 8`", why:M3 },
          { t:"`(3π/4) sin(πt/4)`", why:"`d/dt cos u = -sin u · u′`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Where on a sinusoidal model is the rate of change zero?", options:[
          { t:"At every maximum and minimum", ok:true, why:"The graph turns there, so the tangent is horizontal." },
          { t:"At the axis", why:"That’s where the rate is largest." },
          { t:"Only at the maximum", why:"Minimums too: the graph turns there." },
          { t:"Nowhere: the graph never stops changing", why:"At a turning point the tangent is horizontal." }] },
        b:{ prompt:"Where on a sinusoidal model is the rate of change largest in size?", options:[
          { t:"Where the graph crosses its axis", ok:true, why:"The rate peaks at the points of inflection, on the axis." },
          { t:"At every maximum", why:M2 },
          { t:"At `t = 0`", why:"That depends on the start, not on the shape." },
          { t:"Halfway between a maximum and the axis", why:"The rate is largest at the axis itself." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What is the fastest rate of change of `h(t) = 5 sin(πt/10) + 9`?", options:[
          { t:"`π/10`", why:"That’s `k` alone." },
          { t:"`π/2`", ok:true, why:"`|a|k = 5 × π/10`." },
          { t:"5", why:"Multiply the amplitude by `k = π/10`." },
          { t:"14", why:"That’s the maximum height." }] },
        b:{ prompt:"What is the fastest rate of change of `h(t) = 8 cos(πt/6) + 10`?", options:[
          { t:"`π/6`", why:"That’s `k` alone." },
          { t:"`4π/3`", ok:true, why:"`8 × π/6`." },
          { t:"8", why:"Multiply the amplitude by `k = π/6`." },
          { t:"18", why:"That’s the maximum height." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A Ferris wheel has radius 9 m, axle 11 m and period 36 s; the rider boards at the bottom. How fast is the rider rising at `t = 6` s?", options:[
          { t:"`π/4` m/s", why:"`sin(π/3) = √3/2`, not `1/2`." },
          { t:"`π√3/4` m/s", ok:true, why:"`h = 11 - 9 cos(πt/18)`; `h′ = (π/2) sin(πt/18)`; `h′(6) = (π/2)(√3/2)`." },
          { t:"`π/2` m/s", why:"That’s the fastest rate, reached only at `t = 9` s." },
          { t:"`9√3/2` m/s", why:"The inside `πt/18` has derivative `π/18`. Multiply by it." }] },
        b:{ prompt:"A Ferris wheel has radius 6 m, axle 8 m and period 24 s; the rider boards at the bottom. How fast is the rider rising at `t = 2` s?", options:[
          { t:"`π/4` m/s", ok:true, why:"`h′ = (π/2) sin(πt/12)`; `h′(2) = (π/2)(1/2)`." },
          { t:"`π√3/4` m/s", why:"`sin(π/6) = 1/2`." },
          { t:"`π/2` m/s", why:"That’s the fastest rate, reached only at `t = 6` s." },
          { t:"3 m/s", why:"The inside `πt/12` has derivative `π/12`. Multiply by it." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"The depth at a dock is `d(t) = 2 cos(πt/6) + 7` metres, `t` hours after high tide. On `0 ≤ t ≤ 12`, when is the depth decreasing fastest, and how fast?", options:[
          { t:"`t = 3` h, at `π/3` m/h", ok:true, why:"`d′ = -(π/3) sin(πt/6)`, most negative at `t = 3`." },
          { t:"`t = 6` h, at 0 m/h", why:"That’s low tide." },
          { t:"`t = 3` h, at 2 m/h", why:"The inside `πt/6` has derivative `π/6`: `2 × π/6 = π/3`." },
          { t:"`t = 9` h, at `π/3` m/h", why:"At 9 h the water is rising fastest." }] },
        b:{ prompt:"The depth at a dock is `d(t) = 4 cos(πt/6) + 9` metres, `t` hours after high tide. On `0 ≤ t ≤ 12`, when is the depth decreasing fastest, and how fast?", options:[
          { t:"`t = 3` h, at `2π/3` m/h", ok:true, why:"`d′ = -(2π/3) sin(πt/6)`, most negative at `t = 3`." },
          { t:"`t = 6` h, at 0 m/h", why:"That’s low tide." },
          { t:"`t = 3` h, at 4 m/h", why:"The inside `πt/6` has derivative `π/6`: `4 × π/6 = 2π/3`." },
          { t:"`t = 9` h, at `2π/3` m/h", why:"At 9 h the water is rising fastest." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A rectangle sits inside a semicircle of radius 5, its base on the diameter and its top corners on the arc at angle `θ` from the centre. Its area is `A(θ) = 2(5 cos θ)(5 sin θ)`. What is the largest area?", options:[
          { t:"12.5", why:"That’s half the rectangle." },
          { t:"`25√3/2`", why:"That’s `A(π/6)` or `A(π/3)`, not the maximum." },
          { t:"25", ok:true, why:"`A = 25 sin 2θ`, so `A′ = 50 cos 2θ = 0` at `θ = π/4`; `A(π/4) = 25`." },
          { t:"50", why:"`2(5 cos θ)(5 sin θ) = 50 sin θ cos θ = 25 sin 2θ`, whose maximum is 25." }] },
        b:{ prompt:"Same setup with a semicircle of radius 4: `A(θ) = 2(4 cos θ)(4 sin θ)`. What is the largest area?", options:[
          { t:"8", why:"That’s half the rectangle." },
          { t:"`8√3`", why:"That’s `A(π/6)` or `A(π/3)`, not the maximum." },
          { t:"16", ok:true, why:"`A = 16 sin 2θ`, max 16 at `θ = π/4`." },
          { t:"32", why:"`2(4 cos θ)(4 sin θ) = 32 sin θ cos θ = 16 sin 2θ`, whose maximum is 16." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why a Ferris wheel rider rises fastest when level with the axle?", options:[
          { t:"The height is a sinusoid, so its rate is a sinusoid a quarter-period ahead. The rate peaks where the height crosses its axis, which is the axle height. There the height graph changes concavity.", ok:true, why:"The rate peaks at the axis, where the height graph changes concavity." },
          { t:"Because the wheel spins fastest there.", why:"The wheel turns at a steady speed." },
          { t:"Because the rider is highest there.", why:M2 },
          { t:"Because the derivative of the axle height is largest.", why:"A constant’s derivative is 0." }] },
        b:{ prompt:"Which is the best explanation of why the rider’s height isn’t changing at the very top?", options:[
          { t:"The height reaches a maximum there, so `h′ = 0`. The rider is moving horizontally at that instant.", ok:true, why:"At a maximum the tangent is horizontal." },
          { t:"Because the wheel stops at the top.", why:M6 },
          { t:"Because the axle height is constant.", why:M3 },
          { t:"Because sin is 0 at the top.", why:"For this model, `h′` involves sin, and it’s 0 at the top, but the reason is the maximum, not the function name." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"For a Ferris wheel, `h′(10) = -π/6` (`h` in metres, `t` in seconds). Which sentence interprets this correctly?", options:[
          { t:"At 10 s, the rider’s height is decreasing at `π/6 ≈ 0.52` m/s.", ok:true, why:"The negative sign means decreasing; the units are m/s." },
          { t:"At 10 s, the rider is `π/6` m below the axle.", why:"`h′` is a rate, not a height." },
          { t:"Over the first 10 s, the height fell by `π/6` m.", why:"That describes an average change." },
          { t:"At 10 s, the rider moves around the wheel at `π/6` m/s.", why:M6 }] },
        b:{ prompt:"For hours of daylight, `L′(100) = 0.06` (`L` in hours, `t` in days). Which sentence interprets this correctly?", use:"1 h = 60 min", options:[
          { t:"On day 100, daylight is increasing by about 0.06 h (about 3.6 min) per day.", ok:true, why:"`L′` is a rate: hours of daylight gained per day." },
          { t:"On day 100, there are 0.06 more hours of daylight than on day 0.", why:"That’s a total change." },
          { t:"On day 100, daylight lasts 0.06 h.", why:"`L′` is a rate." },
          { t:"Daylight increases by 0.06 h every day of the year.", why:"The rate changes through the year." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"In a prairie city, `L(t) = 4 sin[2π(t - 80)/365] + 12` hours of daylight on day `t`. How fast is daylight increasing on day 80?", use:"`π ≈ 3.14`, 1 h = 60 min", options:[
          { t:"0 h/day", why:"Day 80 is on the axis, where the rate is largest." },
          { t:"`2π/365` h/day", why:"Multiply by the amplitude 4." },
          { t:"`8π/365` h/day (about 4 min/day)", ok:true, why:"`L′ = 4 · (2π/365) cos[2π(t - 80)/365]`, and `cos 0 = 1`." },
          { t:"4 h/day", why:"The inside has derivative `2π/365`. Multiply by it." }] },
        b:{ prompt:"In another city, `L(t) = 3 sin[2π(t - 80)/365] + 12`. How fast is daylight increasing on day 80?", use:"`π ≈ 3.14`, 1 h = 60 min", options:[
          { t:"0 h/day", why:"Day 80 is on the axis, where the rate is largest." },
          { t:"`2π/365` h/day", why:"Multiply by the amplitude 3." },
          { t:"`6π/365` h/day (about 3 min/day)", ok:true, why:"`L′ = 3 · (2π/365) cos[2π(t - 80)/365]`, and `cos 0 = 1`." },
          { t:"3 h/day", why:"The inside has derivative `2π/365`. Multiply by it." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A ball is kicked at 20 m/s at angle `θ` above level ground. Its range is `R(θ) = 40 sin 2θ` metres, `0 ≤ θ ≤ π/2`. Which angle gives the greatest range, and what is it?", options:[
          { t:"`θ = π/4`, 40 m", ok:true, why:"`R′ = 80 cos 2θ = 0` at `θ = π/4`; the endpoints give 0." },
          { t:"`θ = π/2`, 40 m", why:"`sin 2θ = 1` needs `2θ = π/2`." },
          { t:"`θ = π/4`, `20√2` m", why:"`R(π/4) = 40 sin(π/2) = 40`." },
          { t:"`θ = π/3`, `20√3` m", why:"`R′(π/3) ≠ 0`; that range is smaller." }] },
        b:{ prompt:"A ball is kicked at 30 m/s: `R(θ) = 90 sin 2θ` metres, `0 ≤ θ ≤ π/2`. Which angle gives the greatest range, and what is it?", options:[
          { t:"`θ = π/4`, 90 m", ok:true, why:"`R′ = 180 cos 2θ = 0` at `θ = π/4`; the endpoints give 0." },
          { t:"`θ = π/2`, 90 m", why:"`sin 2θ = 1` needs `2θ = π/2`." },
          { t:"`θ = π/4`, `45√2` m", why:"`R(π/4) = 90 sin(π/2) = 90`." },
          { t:"`θ = π/3`, `45√3` m", why:"`R′(π/3) ≠ 0`; that range is smaller." }] } }
    ]
  },
  task:{
    title:"Design a Ferris wheel", summary:"Design a Ferris wheel",
    statement:"<p>Choose the radius, axle height and period of a Ferris wheel that meets every condition. Riders board at the bottom. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The top of the wheel is exactly 30 m above the ground.</li><li>Riders at the bottom are at least 6 m above the ground.</li><li>The fastest vertical speed is exactly `π/3` m/s.</li><li>One turn takes more than 45 s.</li></ol></div>" +
      "<p class=\"tiny muted\">Radius `@a{r}` from 4 to 16 m, axle height `@c{H}` from 5 to 30 m, period `T` from 20 to 120 s (steps of 2).</p>",
    checks:["Top at 30 m", "Bottom at least 6 m up", "Fastest vertical speed `π/3` m/s", "A turn takes more than 45 s"],
    tips:["The top is the axle height plus the radius.", "The bottom is `H - r`.", "`h(t) = H - r cos(2πt/T)`, so the fastest rate is `r × 2π/T`.", "Increase the period."],
    explainPrompt:"Explain how the derivative told you the period once you’d picked a radius.",
    vocab:"Use the words amplitude, period, derivative and fastest rate.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:5,
    after3:"Line 3 ties the period to the radius: `T = 6r`. Line 4 needs `r ≥ 8`; line 2 (`30 - 2r ≥ 6`) needs `r ≤ 12`.",
    labels:{ r:"radius `@a{r}`", H:"axle height `@c{H}`", T:"period `T`", model:"Model", rate:"Rate", top:"Top", bottom:"Bottom", fastest:"Fastest vertical speed", graph:"Height (blue) and rate (teal) over one turn" }
  },
  cards:[
    ["`d/dt [a sin(kt) + c]`", "`ak cos(kt)`; the `c` disappears."],
    ["`d/dt [a cos(kt) + c]`", "`-ak sin(kt)`."],
    ["Rate zero", "At every maximum and minimum of the model."],
    ["Rate largest", "Where the model crosses its axis (points of inflection, `h″ = 0`)."],
    ["Fastest rate", "`|a| × k = |a| × 2π/`period."],
    ["Bigger wheel, same period", "Fastest vertical speed grows in proportion to the radius."],
    ["Shorter period", "Halving the period doubles every rate."],
    ["Falling fastest", "`h′` is most negative, not most positive."],
    ["Interpreting `h′(t)`", "“At time `t`, the height is increasing (or decreasing) at … units per …”"],
    ["Half the fastest rate", "Reached 1/12 of a period after a max or min (where sin or cos = ±1/2), not halfway in time."],
    ["Angle optimization", "Write `f(θ)`, solve `f′(θ) = 0` on the allowed interval, compare with the endpoints."],
    ["Triangle area", "`½pq sin θ`, greatest at `θ = π/2`."]
  ]
};
