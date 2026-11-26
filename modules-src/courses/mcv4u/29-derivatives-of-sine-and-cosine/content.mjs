// MCV4U 29 Derivatives of Sine and Cosine. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/29-derivatives-of-sine-and-cosine.md
// misconception core sentences (plan §3)
const M1 = "At `x = π/2`, `cos x` is falling (slope −1), and `sin(π/2) = 1`. So the derivative must be `-sin x`.";
const M2 = "The inside `5x` changes 5 times as fast as `x`: `5 cos(5x)`.";
const M3 = "`sin^2 x = (sin x)^2`. Power first, then the inside: `2 sin x · cos x`.";
const M4 = "Keep the inside as it is and multiply by its derivative: `2x cos(x^2)`.";
const M5 = "In degrees, `sin x° = sin(πx/180)`, so the slope is `(π/180) cos x°`.";
const M6 = "Both factors change: `sin x + x cos x`.";
const M7 = "At a peak the tangent is horizontal. The wave is steepest where it crosses its axis.";
const R3 = Math.sqrt(3), PI = Math.PI;
const S5FB = "`y′ = cos x - √3 sin x = 0` gives `tan x = 1/√3`: `π/6` (max) or `7π/6` (min, −2).";
const S6FB = "The slope at 0 is `k`, and the slope of a line at 60° is `tan 60° = √3`.";

export default {
  id:"29-derivatives-of-sine-and-cosine",
  kind:"topic",
  title:"Derivatives of sine and cosine",
  topic:"Derivatives of Sine and Cosine",
  readyTopic:"derivatives of sine and cosine",
  hero:{
    eq:"<span class=\"sw-heq1\">`{d}/{dx} sin x = cos x`</span><span class=\"sw-heq1\">`{d}/{dx} cos x = -sin x`</span><span class=\"sw-heq\">(`x` in radians)</span>",
    eqLabel:"d by d x of sine x equals cosine x, and d by d x of cosine x equals negative sine x, with x in radians",
    eqSize:"sm",
    headline:"The slope of a sine wave is a cosine wave",
    text:"Slide a <strong>tangent line</strong> along the graph of `y = sin x` and record its slope. The slopes trace out a second wave, shifted a quarter-period to the left: the graph of <strong>`cos x`</strong>. This only works when `x` is measured in <strong>radians</strong>.",
    fig:{ html:"<div class=\"sw-hero\"><canvas class=\"plot sw-hp\" id=\"hero-plot\" role=\"img\" aria-label=\"y = sin x draws from 0 to 2π. A tangent line slides along it from the origin.\"></canvas><canvas class=\"plot sw-hp sw-hp2\" id=\"hero-d\" role=\"img\" aria-label=\"The tangent’s slopes are recorded as a teal trail.\"></canvas></div>" },
    cap:{ start:"`y = sin x`: a tangent slides along it, and its slope is recorded below.", end:"The slope trail lands exactly on `y = cos x`: `f′(x) = cos x`." }
  },
  goals:[
    "I can explain, from tangent slopes on `y = sin x`, why `d/dx sin x = cos x`.",
    "I can differentiate `sin x` and `cos x`, and explain why the rules need radians.",
    "I can use the chain rule with sine and cosine, such as `sin(kx)`, `cos(x^2)` and `sin^2 x`.",
    "I can use the product rule with trigonometric functions.",
    "I can find exact slopes and horizontal tangents at special angles.",
    "I can interpret derivatives of sinusoidal models as rates in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Special angles", goal:5, prompt:"`cos(π/3)` = ?",
          options:[
            { t:"`1/2`", ok:true, why:"From the 30°–60°–90° triangle: adjacent 1, hypotenuse 2." },
            { t:"`√3/2`", why:"That’s `sin(π/3)` or `cos(π/6)`." },
            { t:"`-1/2`", why:"`π/3` is in quadrant 1, where cosine is positive." },
            { t:"`√2/2`", why:"That’s for `π/4`." }],
          hints:["`π/3 = 60°`.", "In the 30–60–90 triangle, the side next to 60° is 1 and the hypotenuse is 2.", "`1/2`."] },
        { id:"w2", skill:"Special angles", goal:5, prompt:"`sin(5π/6)` = ?",
          options:[
            { t:"`1/2`", ok:true, why:"Reference angle `π/6`, quadrant 2, sine positive." },
            { t:"`-1/2`", why:"Sine is positive in quadrant 2." },
            { t:"`√3/2`", why:"The reference angle is `π/6`, not `π/3`." },
            { t:"`-√3/2`", why:"Wrong reference angle and sign." }],
          hints:["Find the reference angle.", "`π - 5π/6 = π/6`; quadrant 2.", "`sin(π/6) = 1/2`, positive."] },
        { id:"w3", skill:"Chain and product rules", goal:3, prompt:"Differentiate `(3x^2 + 1)^4`.",
          options:[
            { t:"`24x(3x^2 + 1)^3`", ok:true, why:"`4(3x^2 + 1)^3 · 6x`." },
            { t:"`4(3x^2 + 1)^3`", why:"Multiply by the inside’s derivative, `6x`." },
            { t:"`24x(3x^2 + 1)^4`", why:"The power drops by 1." },
            { t:"`4(6x)^3`", why:"The inside stays as it is." }],
          hints:["Outside `u^4`, inside `3x^2 + 1`.", "`4u^3 · 6x`.", "`24x(3x^2 + 1)^3`."] },
        { id:"w4", skill:"Chain and product rules", goal:4, prompt:"Differentiate `x^3 · g(x)`.",
          options:[
            { t:"`3x^2 g(x) + x^3 g′(x)`", ok:true, why:"Product rule." },
            { t:"`3x^2 g′(x)`", why:"That multiplies the derivatives." },
            { t:"`x^3 g′(x)`", why:"Only half of the product rule." },
            { t:"`3x^2 + g′(x)`", why:"A product doesn’t differentiate into a sum of derivatives." }],
          hints:["Two factors, both changing.", "`f′g + fg′`.", "`3x^2 g(x) + x^3 g′(x)`."] },
        { id:"w5", skill:"Slopes on a graph", goal:1, prompt:"On `y = sin x`, `0 ≤ x ≤ 2π`, where are the tangent lines horizontal?",
          options:[
            { t:"`x = π/2` and `x = 3π/2`", ok:true, why:"At the maximum and the minimum." },
            { t:"`x = 0`, `π` and `2π`", why:"Those are where the wave crosses its axis, where it’s steepest." },
            { t:"`x = π` only", why:"At `π` the wave is falling at its fastest." },
            { t:"`x = π/4` and `5π/4`", why:"Those are partway up and down the wave." }],
          hints:["Horizontal tangent = slope 0.", "That happens at peaks and troughs.", "`π/2` and `3π/2`."] },
        { id:"w6", skill:"Radians", goal:2, prompt:"`3π/4` radians in degrees?",
          options:[
            { t:"135°", ok:true, why:"`π = 180°`, so `3π/4 = 3 × 45°`." },
            { t:"45°", why:"That’s `π/4`." },
            { t:"270°", why:"That’s `3π/2`." },
            { t:"240°", why:"That’s `4π/3`." }],
          hints:["`π` radians = 180°.", "`π/4 = 45°`.", "3 × 45° = 135°."] }
      ],
      refreshers:{
        "Special angles":"sin and cos of `π/6`, `π/4`, `π/3` are `1/2`, `√2/2`, `√3/2` in some order. Use the reference angle and the CAST rule for the sign.",
        "Chain and product rules":"`(f(g))′ = f′(g) · g′`; `(fg)′ = f′g + fg′`.",
        "Slopes on a graph":"Peaks and troughs have slope 0. A wave is steepest where it crosses its axis.",
        "Radians":"`π` radians = 180°. Calculus uses radians."
      }
    }
  },
  explore:{
    heading:"Slope of a wave",
    intro:"Slide the tangent along the wave. Its slope is plotted below. Which wave do the slopes make?",
    fns:[{ id:"sin", t:"`sin x`" }, { id:"cos", t:"`cos x`" }, { id:"sum", t:"`sin x + cos x`" }, { id:"sink", t:"`sin(@k{k}x)`" }],
    modes:[{ id:"trail", t:"Slope trail" }, { id:"circle", t:"Unit circle twin" }, { id:"deg", t:"Degrees trap" }],
    modeHow:{
      trail:"Move the point: the tangent’s slope at each `x` is plotted on the lower panel as a teal trail. Then pick the wave you think the trail makes.",
      circle:"The point on the unit circle sits at angle `θ = x`. It moves at unit speed, so its velocity arrow has length 1. Watch the arrow’s vertical and horizontal parts.",
      deg:"The `x`-axis is now in degrees, so the wave is stretched over 360 units. Read the measured slope in units per degree."
    },
    guesses:[{ id:"sin", t:"`sin x`" }, { id:"cos", t:"`cos x`" }, { id:"nsin", t:"`-sin x`" }, { id:"ncos", t:"`-cos x`" }],
    txt:{
      fn:"Function", mode:"Mode", point:"Point `x`",
      pointNote:"Arrow keys move the point by `π/12`; Shift + arrow by 0.01. Press Enter to mark the point. You can also tap the graph.",
      k:"`@k{k}`", kNote:"`@k{k}` compresses the wave horizontally.",
      guess:"The trail looks like…", f2:"Show `f″`", clearTrail:"Clear trail", showAll:"Show the whole trail",
      mark:"Mark this point", unmark:"Unmark this point", clearMarks:"Clear marks", marks:"Marked points:", noMarks:"none yet",
      rows:{ fn:"Function", point:"Point", slope:"Slope of tangent (measured)", guess:"Your guess", dir:"Direction", vel:"Unit circle twin", deg:"Degrees trap" },
      rising:"Rising", falling:"Falling", flat:"Horizontal tangent", pickGuess:"Choose a guess chip to compare.",
      circleOnly:"The unit circle twin works with `sin x` and `cos x`.",
      keyTrail:"`f` in blue with the tangent in black; the measured slopes of `f` in teal below.",
      keyGuess:"Your guess: black long dashes.", keyF2:"`f″` in magenta on the third panel.",
      keyCircle:"Black arrow: the point’s velocity (length 1). Its vertical part is the <strong>rate of change of height = `cos θ`</strong>; its horizontal part is the <strong>rate of change of run = `-sin θ`</strong>.",
      keyDeg:"On equal axes this wave would be 360 units long and only 2 units tall, so the vertical scale here is stretched. The lower panel shows the slopes in units per degree (teal) on the same scale as the radian slopes (grey dashes).",
      slopePanel:"slope of `f` (measured)", slopeDeg:"slope per degree (measured)", radGhost:"slopes in radians"
    },
    predIntro:"Make a prediction first. Then the slope tool shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Where on `[0, 2π]` is `y = sin x` rising most steeply?",
        options:[{ t:"At `x = 0` (and `2π`)", ok:true }, { t:"At `π/2`" }, { t:"At `π`" }, { t:"At `3π/2`" }],
        explain:"The slope is `cos x`, which is largest (1) at `x = 0`. At the peak `π/2` the slope is 0." },
      { id:"p2", prompt:"What is the slope of `y = sin x` at `x = π`?",
        options:[{ t:"−1", ok:true }, { t:"0" }, { t:"1" }, { t:"`π`" }],
        explain:"`cos π = -1`. The wave is falling fastest as it crosses its axis." },
      { id:"p3", prompt:"Switch to `cos x`. The slope trail of `y = cos x` will match…",
        options:[{ t:"`-sin x`", ok:true }, { t:"`sin x`" }, { t:"`cos x`" }, { t:"`-cos x`" }],
        explain:"`cos x` falls right after `x = 0`, so its slopes start negative, the opposite of `sin x`." },
      { id:"p4", prompt:"With `x` in degrees, what is the slope of `y = sin x` at `x = 0°`?",
        options:[{ t:"About 0.0175", ok:true }, { t:"1" }, { t:"0" }, { t:"About 57.3" }],
        explain:"One degree is `π/180 ≈ 0.0175` radians, so each degree of run gives only 0.0175 of rise near 0." }
    ],
    chalIntro:"Use the slope tool to meet each goal, then press <strong>Check challenge</strong>. Mark points with <strong>Mark this point</strong> (or Enter on the point slider). Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"Function `cos x`: put the point where the slope is `-√3/2`. Find both places in `[0, 2π]` and mark them.",
        why:"The slope of `cos x` is `-sin x`, and `-sin x = -√3/2` at `x = π/3` and `x = 2π/3`.",
        hints:["The slope of `cos x` is `-sin x`.", "`-sin x = -√3/2` means `sin x = √3/2`.", "`x = π/3` or `2π/3`."],
        msgs:{ fn:"Choose the function `cos x` first.", none:"Mark the points with <strong>Mark this point</strong> (or Enter on the point slider).",
          pi6:"There, `cos x = √3/2`: that’s the height, not the slope.",
          q34:"The slope there is `+√3/2`: `-sin x` is positive when `sin x < 0`.",
          one:"There’s a second angle with the same sine.",
          extra:"Mark only the points where the slope is `-√3/2`, and remove the others.",
          general:"The slope of `cos x` is `-sin x`. Where is `sin x = √3/2`?" } },
      { id:"tc2", goal:[2, 3], prompt:"Function `sin(@k{k}x)`: choose the smallest `@k{k}` on the slider so that the tangent at `x = π/6` is horizontal.",
        why:"The slope is `@k{k} cos(@k{k}x)`. At `x = π/6` you need `cos(@k{k}π/6) = 0`, so `@k{k}π/6 = π/2` and `@k{k} = 3`.",
        hints:["The slope of `sin(@k{k}x)` is `@k{k} cos(@k{k}x)`.", "You need `cos(@k{k}π/6) = 0`, so `@k{k}π/6 = π/2`.", "`@k{k} = 3`."],
        msgs:{ fn:"Choose the function `sin(@k{k}x)` first.", k1:"`cos(π/6) ≠ 0`.", k15:"`cos(π/4) ≠ 0`.", k2:"`cos(π/3) = 1/2`, not 0.",
          general:"At `x = π/6` the slope is `@k{k} cos(@k{k}π/6)` ≈ #1, not 0." } },
      { id:"tc3", goal:[2, 5], stretch:true, prompt:"Function `sin x + cos x`: mark every `x` in `[0, 2π]` where the tangent is horizontal.",
        why:"`y′ = cos x - sin x = 0` gives `tan x = 1`: `x = π/4` and `x = 5π/4`.",
        hints:["Differentiate each term.", "`cos x - sin x = 0`, so `sin x = cos x`.", "`tan x = 1`: `x = π/4` or `5π/4`."],
        msgs:{ fn:"Choose the function `sin x + cos x` first.", none:"Mark the points with <strong>Mark this point</strong> (or Enter on the point slider).",
          one:"There’s a second solution half a turn later.",
          pair:"Those solve `cos x + sin x = 0`. The derivative is `cos x - sin x`.",
          extra:"Mark only the points with a horizontal tangent, and remove the others.",
          general:"Differentiate each term, then solve `y′ = 0`." } }
    ]
  },
  part3:{
    slug:"chain", name:"Chain",
    heading:"Chain rule on waves",
    intro:"The chain and product rules with trig are where most errors happen. At each station, build the derivative from chips, then press <strong>Graph check</strong>: your candidate (black dashes) is drawn over the measured slopes of the function (teal). Only the right derivative lands exactly on them. Then try the quick check.",
    txt:{ station:"Station", of:"of", prev:"Previous station", next:"Next station",
      build:"Build the derivative", check:"Graph check", cand:"Your derivative:", pick:"Choose a chip in every row first.",
      trail:"measured slopes of `f`", yours:"your derivative", fLab:"the function `f`",
      gauge:"How far apart are the curves?", gap:"Largest gap ≈ #1", match:"✓ Exact match: your derivative lands on the measured slopes.",
      noMatch:"Not a match yet.", tryAgain:"Change a chip and press Graph check again.", alg:"Check it with algebra", solved:"solved" },
    stations:[
      { id:"st1", fn:"s3", title:"Station 1: `sin(3x)`", text:"Build the derivative of `y = sin(3x)`.",
        form:"cfa", view:{ xmin:-0.2, xmax:6.48, f:[-1.5, 1.5], d:[-3.8, 3.8] }, piTicks:true,
        rows:[
          { label:"Number", chips:[{ t:"1", v:1 }, { t:"3", v:3 }, { t:"−3", v:-3 }, { t:"`1/3`", v:1 / 3 }] },
          { label:"Function", chips:[{ t:"`sin`", v:"sin" }, { t:"`cos`", v:"cos" }] },
          { label:"Inside", chips:[{ t:"`x`", v:"x" }, { t:"`3x`", v:"3x" }] }],
        msgs:{ "1|cos|3x":"Right shape, but only a third of the height. The inside `3x` changes 3 times as fast as `x`: multiply by 3.",
          "3|cos|x":"`3 cos x` has the wrong period. Keep the inside `3x` as it is.",
          "-3|cos|3x":"The derivative of sin is `+cos`.", "3|sin|3x":"Differentiate the outside: sin becomes cos." },
        general:"Outside first (sin becomes cos, inside unchanged), then multiply by the inside’s derivative.",
        alg:["Outside: `sin u` → `cos u`. Inside: `u = 3x`, so `u′ = 3`.", "`d/dx sin(3x) = cos(3x) · 3 = 3 cos(3x)`."] },
      { id:"st2", fn:"sq", title:"Station 2: `sin^2 x`", text:"Build the derivative of `y = sin^2 x = (sin x)^2`.",
        form:"cef", view:{ xmin:-0.2, xmax:6.48, f:[-0.3, 1.3], d:[-1.6, 1.6] }, piTicks:true,
        rows:[
          { label:"Number", chips:[{ t:"1", v:1 }, { t:"2", v:2 }] },
          { label:"Factor", chips:[{ t:"none", v:"1" }, { t:"`sin x`", v:"sin" }, { t:"`cos x`", v:"cos" }] },
          { label:"Times", chips:[{ t:"`sin x`", v:"sin" }, { t:"`cos x`", v:"cos" }] }],
        msgs:{ "1|cos|cos":"`cos^2 x` is never negative, but the trail is. " + M3,
          "2|1|cos":"`2 cos x` loses the factor `sin x`. " + M3,
          "1|sin|cos":"Right shape, but half the height. The power 2 comes down in front." },
        general:M3,
        alg:["`sin^2 x = (sin x)^2`: outside `u^2`, inside `u = sin x`.", "`d/dx (sin x)^2 = 2 sin x · cos x`.", "And `2 sin x cos x = sin 2x` (the double-angle formula), so the slope graph is itself a wave."] },
      { id:"st3", fn:"cx2", title:"Station 3: `cos(x^2)`", text:"Build the derivative of `y = cos(x^2)`.",
        form:"cefa", view:{ xmin:-2.6, xmax:2.6, f:[-1.5, 1.5], d:[-5.8, 5.8] }, piTicks:false,
        rows:[
          { label:"Number", chips:[{ t:"1", v:1 }, { t:"−1", v:-1 }, { t:"2", v:2 }, { t:"−2", v:-2 }] },
          { label:"Factor", chips:[{ t:"none", v:"1" }, { t:"`x`", v:"x" }] },
          { label:"Function", chips:[{ t:"`sin`", v:"sin" }, { t:"`cos`", v:"cos" }] },
          { label:"Inside", chips:[{ t:"`x^2`", v:"x2" }, { t:"`2x`", v:"2x" }, { t:"`x`", v:"x" }] }],
        msgs:{ "-1|1|sin|2x":"`-sin(2x)` follows the trail near 0 and then drifts off. Keep the inside `x^2` as it is and multiply by its derivative `2x`.",
          "-1|1|sin|x2":"Right zeros, wrong heights: multiply by the inside’s derivative, `2x`.",
          "2|x|sin|x2":"cos differentiates to `-sin`.", "-2|x|cos|x2":"Differentiate the outside: cos becomes `-sin`." },
        general:"Outside first (cos becomes `-sin`, inside unchanged), then multiply by the inside’s derivative.",
        alg:["Outside: `cos u` → `-sin u`. Inside: `u = x^2`, so `u′ = 2x`.", "`d/dx cos(x^2) = -sin(x^2) · 2x = -2x sin(x^2)`."] },
      { id:"st4", fn:"xs", title:"Station 4: `x sin x`", text:"Build the derivative of `y = x sin x`.",
        form:"terms", view:{ xmin:-0.2, xmax:6.48, f:[-5.6, 2.6], d:[-4.6, 7.4] }, piTicks:true,
        rows:[
          { label:"First term", chips:[{ t:"`sin x`", v:"sinx" }, { t:"`cos x`", v:"cosx" }, { t:"`x sin x`", v:"xsinx" }, { t:"0", v:"0" }] },
          { label:"Second term", chips:[{ t:"`+ x cos x`", v:"xcosx" }, { t:"`- x cos x`", v:"-xcosx" }, { t:"`+ cos x`", v:"cosx" }, { t:"none", v:"0" }] }],
        msgs:{ "cosx|0":"`cos x` multiplies the derivatives, and it misses badly as `x` grows. " + M6,
          "sinx|-xcosx":"`sin x` differentiates to `+cos x`." },
        general:"Product rule: (first)′ · second + first · (second)′.",
        alg:["Product rule with `f = x` and `g = sin x`: `f′ = 1`, `g′ = cos x`.", "`d/dx (x sin x) = 1 · sin x + x · cos x = sin x + x cos x`."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Chain rule on waves quick check",
      items:[
        { id:"q1", goal:3, prompt:"`d/dx cos(4x)` = ?",
          choices:[{ t:"`-4 sin(4x)`", ok:true, fb:"Right. Outside: `-sin`; inside’s derivative: 4." }, { t:"`-sin(4x)`", fb:"Outside: `-sin`; inside’s derivative: 4." }, { t:"`4 sin(4x)`", fb:"Outside: `-sin`; inside’s derivative: 4." }, { t:"`-4 sin x`", fb:"Outside: `-sin`; inside’s derivative: 4." }] },
        { id:"q2", goal:3, prompt:"`d/dx sin^3 x` = ?",
          choices:[{ t:"`3 sin^2 x cos x`", ok:true, fb:"Right. `(sin x)^3`: power rule, then times `cos x`." }, { t:"`3 cos^2 x`", fb:"`(sin x)^3`: power rule, then times `cos x`." }, { t:"`cos^3 x`", fb:"`(sin x)^3`: power rule, then times `cos x`." }, { t:"`3 sin^2 x`", fb:"`(sin x)^3`: power rule, then times `cos x`." }] },
        { id:"q3", goal:3, prompt:"`d/dx sin(x^2 + 1)` = ?",
          choices:[{ t:"`2x cos(x^2 + 1)`", ok:true, fb:"Right. Keep the inside, multiply by its derivative." }, { t:"`cos(2x)`", fb:"Keep the inside, multiply by its derivative." }, { t:"`cos(x^2 + 1)`", fb:"Keep the inside, multiply by its derivative." }, { t:"`2x cos x`", fb:"Keep the inside, multiply by its derivative." }] },
        { id:"q4", goal:4, prompt:"`d/dx (e^x cos x)` = ?",
          choices:[{ t:"`e^x cos x - e^x sin x`", ok:true, fb:"Right. Product rule; `cos x` differentiates to `-sin x`." }, { t:"`-e^x sin x`", fb:"Product rule; `cos x` differentiates to `-sin x`." }, { t:"`e^x cos x + e^x sin x`", fb:"Product rule; `cos x` differentiates to `-sin x`." }, { t:"`e^x`", fb:"Product rule; `cos x` differentiates to `-sin x`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[2, 3, 4],
        instruction:"Match each function with its derivative. One card on the right has no partner.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`sin(2x)`", goal:3, why:"Chain factor 2: `2 cos(2x)`." },
          { id:"l2", t:"`cos(2x)`", goal:3, why:"cos becomes `-sin`, times the chain factor 2: `-2 sin(2x)`." },
          { id:"l3", t:"`sin^2 x`", goal:3, why:"`2 sin x cos x = sin(2x)`.",
            hints:["Write it as `(sin x)^2`.", "`2 sin x · cos x`.", "That’s `sin(2x)`."] },
          { id:"l4", t:"`cos^2 x`", goal:3, why:"`2 cos x · (-sin x) = -sin(2x)`." },
          { id:"l5", t:"`x^2 cos x`", goal:4, why:"Product rule: `2x cos x + x^2(-sin x)`." },
          { id:"l6", t:"`sin(x^2)`", goal:3, why:"Keep the inside, times its derivative `2x`: `2x cos(x^2)`." },
          { id:"l7", t:"`3 sin x - 2 cos x`", goal:2, why:"`3 cos x - 2(-sin x) = 3 cos x + 2 sin x`." },
          { id:"l8", t:"`sin x cos x`", goal:4, why:"Product rule: `cos^2 x - sin^2 x = cos(2x)`.",
            hints:["Product rule on `sin x · cos x`.", "`cos x · cos x + sin x · (-sin x)`.", "`cos^2 x - sin^2 x = cos(2x)`."] }
        ],
        right:[
          { id:"r1", t:"`2 cos(2x)`" }, { id:"r2", t:"`-2 sin(2x)`" }, { id:"r3", t:"`sin(2x)`" }, { id:"r4", t:"`-sin(2x)`" },
          { id:"r5", t:"`2x cos x - x^2 sin x`" }, { id:"r6", t:"`2x cos(x^2)`" }, { id:"r7", t:"`3 cos x + 2 sin x`" }, { id:"r8", t:"`cos(2x)`" },
          { id:"r9", t:"`3 cos x - 2 sin x`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l3|r1":"`sin^2 x = (sin x)^2`. Its derivative is `2 sin x cos x = sin(2x)`. `2 cos(2x)` belongs to `sin(2x)`.",
          "l4|r3":"`cos^2 x` decreases at first: `-2 cos x sin x = -sin(2x)`.",
          "l6|r1":M4,
          "l7|r9":"`-2 cos x` differentiates to `+2 sin x`." },
        wrongDefault:"Check the sign and the chain factor." },
      { id:"exact", type:"custom", title:"Exact slopes and tangents", summary:"Exact slopes and tangents", star:true, goal:[3, 5],
        instruction:"Find exact slopes, tangent lines and horizontal tangents at special angles. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions, `√` and `π` (such as `-1/2`, `√3/2 - π/6`, `5π/6`, `√3`). You can type sqrt for √ and pi for π. Separate several values with commas. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as −1/2, `√3/2`, `π/6` or `√3/2 - π/6`.",
          exact:"Close, but give the exact value (with `√` or `π`), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:5, prompt:"Slope of `y = cos x` at `x = π/6`.",
            boxes:[{ k:"m", pre:"Slope" }], answer:{ m:-0.5 }, display:"`-1/2`",
            wrong:[{ k:"m", eq:0.5, fb:M1 }, { k:"m", eq:R3 / 2, fb:"That’s `cos(π/6)`, the height." }],
            general:"The slope of `cos x` is `-sin x`.",
            why:"`y′ = -sin x`, and `-sin(π/6) = -1/2`.",
            hints:["The slope of `cos x` is `-sin x`.", "`sin(π/6) = 1/2`.", "`-sin(π/6) = -1/2`."] },
          { id:"s2", goal:[3, 5], prompt:"Slope of `y = 4 sin(2x)` at `x = π/6`.",
            boxes:[{ k:"m", pre:"Slope" }], answer:{ m:4 }, display:"4",
            wrong:[{ k:"m", eq:2, fb:"`8 cos(2x)`: the inside’s derivative 2 multiplies." }, { k:"m", eq:4 * R3, fb:"`cos(π/3) = 1/2`." }],
            general:"`y′ = 4 · 2 cos(2x)`. Evaluate it at `x = π/6`.",
            why:"`y′ = 8 cos(2x)`, and `8 cos(π/3) = 8 · 1/2 = 4`.",
            hints:["Chain rule: the inside `2x` gives a factor 2.", "`y′ = 8 cos(2x)`; at `π/6` the inside is `π/3`.", "`8 · 1/2 = 4`."] },
          { id:"s3", goal:5, star:true, prompt:"Tangent to `y = sin x` at `x = π/3`: enter the slope and `y`-intercept.",
            boxes:[{ k:"m", pre:"Slope" }, { k:"b", pre:"`y`-intercept" }], answer:{ m:0.5, b:R3 / 2 - PI / 6 }, display:"slope `1/2`, intercept `√3/2 - π/6`",
            wrong:[{ k:"b", eq:R3 / 2, fb:"The tangent passes through `(π/3, √3/2)`, not `(0, √3/2)`." }],
            general:"Slope `cos(π/3)`; the tangent passes through `(π/3, √3/2)`.",
            why:"Slope `cos(π/3) = 1/2`. `y - √3/2 = 1/2(x - π/3)` gives `y = 1/2 x + √3/2 - π/6`.",
            hints:["The slope is `cos(π/3)`.", "The point is `(π/3, √3/2)`: `y - √3/2 = 1/2(x - π/3)`.", "Slope `1/2`; intercept `√3/2 - π/6`."] },
          { id:"s4", goal:5, star:true, prompt:"Where in `[0, 2π]` does `y = x + 2 cos x` have horizontal tangents?",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[PI / 6, 5 * PI / 6] }, display:"`x = π/6` and `x = 5π/6`",
            wrong:[{ k:"x", eq:[7 * PI / 6, 11 * PI / 6], fb:"`1 - 2 sin x = 0` gives `sin x = +1/2`." }],
            general:"`y′ = 1 - 2 sin x`. Solve `y′ = 0` in `[0, 2π]`: there are two angles.",
            why:"`y′ = 1 - 2 sin x = 0` gives `sin x = 1/2`: `x = π/6` and `5π/6`.",
            hints:["Differentiate: `y′ = 1 - 2 sin x`.", "`y′ = 0` gives `sin x = 1/2`.", "`x = π/6` and `5π/6`."] },
          { id:"s5", goal:5, star:true, prompt:"`y = sin x + √3 cos x`: its maximum value, and where in `[0, 2π]`.",
            boxes:[{ k:"v", pre:"Maximum value" }, { k:"x", pre:"at `x =`" }], answer:{ v:2, x:PI / 6 }, display:"2, at `x = π/6`",
            wrong:[{ k:"x", eq:7 * PI / 6, fb:S5FB }, { k:"v", eq:-2, fb:S5FB }],
            general:S5FB,
            why:"`y′ = cos x - √3 sin x = 0` gives `tan x = 1/√3`. At `π/6`: `1/2 + √3 · √3/2 = 2`.",
            hints:["Set `y′ = 0`.", "`cos x = √3 sin x`, so `tan x = 1/√3`.", "At `π/6`: `1/2 + √3 · √3/2 = 2`."] },
          { id:"s6", goal:[3, 5], star:true, prompt:"For what positive `k` does the tangent to `y = sin(kx)` at the origin make a 60° angle with the `x`-axis?",
            boxes:[{ k:"k", pre:"`k =`" }], answer:{ k:R3 }, display:"`k = √3`",
            wrong:[{ k:"k", eq:60, fb:S6FB }, { k:"k", eq:PI / 3, fb:S6FB }],
            general:S6FB,
            why:"The slope at 0 is `k cos 0 = k`, and a 60° line has slope `tan 60° = √3`.",
            hints:["What is the slope of `y = sin(kx)` at `x = 0`?", "`k cos 0 = k`.", "A 60° line has slope `tan 60° = √3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Chen", how:"", goal:[2, 3],
        instruction:"Chen made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Differentiate `y = cos(3x^2)`.",
            steps:["Outside: `cos u`. Inside: `u = 3x^2`.", "`d/du cos u = sin u`.", "`du/dx = 6x`.", "`y′ = 6x sin(3x^2)`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct on its own; the mistake is earlier.", "Step 4 combines steps 2 and 3."],
            fixes:[
              { t:"`d/du cos u = -sin u`, so `y′ = -6x sin(3x^2)`.", ok:true, why:"Cosine’s derivative is `-sin`; the chain factor `6x` stays." },
              { t:"`d/du cos u = -cos u`.", why:"Cosine’s derivative is `-sin`." },
              { t:"`y′ = -sin(6x)`.", why:"Keep the inside as it is and multiply by its derivative: `-6x sin(3x^2)`." },
              { t:"Step 2 is correct.", why:"cos falls right after 0, so its derivative starts negative." }],
            hints:["What is the derivative of cos?", "`-sin`.", "`-6x sin(3x^2)`."] },
          { id:"e2", goal:3, task:"Find the slope of `y = sin^2 x` at `x = π/4`.",
            steps:["`y = (sin x)^2`.", "`y′ = 2 sin x`.", "At `π/4`: `2 · √2/2 = √2`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 evaluates step 2 correctly."],
            fixes:[
              { t:"`y′ = 2 sin x · cos x`; at `π/4`: `2(√2/2)(√2/2) = 1`.", ok:true, why:"Power first, then times the inside’s derivative `cos x`." },
              { t:"`y′ = cos^2 x`: at `π/4`, `1/2`.", why:M3 },
              { t:"`y′ = 2 cos x`: `√2`.", why:"That differentiates sin but loses the power’s factor `sin x`." },
              { t:"Step 2 is correct.", why:"The inside `sin x` has derivative `cos x`." }],
            hints:["Power of a function: chain rule.", "Outside `u^2`, inside `sin x`.", "`2 sin x cos x = 1` at `π/4`."] },
          { id:"e3", goal:2, task:"The height of a point on a turning wheel is `h(θ) = sin θ`, with `θ` in <strong>degrees</strong>. Find `dh/dθ` at `θ = 60°`.",
            steps:["`dh/dθ = cos θ`.", "At 60°: `cos 60° = 1/2`.", "So `h` rises `1/2` unit per degree at 60°."],
            answer:0,
            stepFb:["", "Step 2 evaluates step 1 correctly.", "This follows; but could the height (at most 1) rise half a unit per degree?"],
            fixes:[
              { t:"In degrees, `sin θ° = sin(πθ/180)`, so `dh/dθ = (π/180) cos θ°`: at 60°, `π/360` per degree.", ok:true, why:"The chain rule brings in the factor `π/180`." },
              { t:"`dh/dθ = -cos θ`.", why:"The derivative of sine is `+cos`; the problem is the degrees." },
              { t:"`dh/dθ = (180/π) cos θ`.", why:"That makes the slope bigger, not smaller." },
              { t:"Step 1 is correct.", why:"The rule `cos θ` needs radians." }],
            hints:["Is `θ` in radians?", "Convert: `θ° = πθ/180` radians.", "Chain rule: `(π/180) cos θ°`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the slope trail: that the slopes made a cosine wave, or that the degrees trap shrank every slope?" },
      { id:"j2", q:"In your own words, why is `d/dx cos x` negative just after `x = 0`?" },
      { id:"j3", q:"Explain to a friend how to differentiate `sin^2(3x)` one layer at a time." },
      { id:"j4", q:"Which trig derivative still slows you down? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"`d/dx (5 sin x - 2 cos x)` = ?", options:[
          { t:"`5 cos x + 2 sin x`", ok:true, why:"`sin x` → `cos x`, and `-2 cos x` → `+2 sin x`." },
          { t:"`5 cos x - 2 sin x`", why:"`-2 cos x` differentiates to `+2 sin x`." },
          { t:"`-5 cos x - 2 sin x`", why:"`sin′ = +cos`." },
          { t:"`-5 cos x + 2 sin x`", why:"Both signs flipped." }] },
        b:{ prompt:"`d/dx (3 cos x + 4 sin x)` = ?", options:[
          { t:"`-3 sin x + 4 cos x`", ok:true, why:"`cos x` → `-sin x`, and `sin x` → `cos x`." },
          { t:"`3 sin x + 4 cos x`", why:"`3 cos x` differentiates to `-3 sin x`." },
          { t:"`-3 sin x - 4 cos x`", why:"`sin′ = +cos`, so `4 sin x` gives `+4 cos x`." },
          { t:"`3 sin x - 4 cos x`", why:"Both signs flipped." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`d/dx sin(5x)` = ?", options:[
          { t:"`5 cos(5x)`", ok:true, why:"Chain factor 5: the inside `5x` changes 5 times as fast as `x`." },
          { t:"`cos(5x)`", why:M2 },
          { t:"`5 cos x`", why:"Keep the inside `5x`." },
          { t:"`-5 cos(5x)`", why:"sin differentiates to `+cos`." }] },
        b:{ prompt:"`d/dx cos(6x)` = ?", options:[
          { t:"`-6 sin(6x)`", ok:true, why:"Outside: `-sin`; inside’s derivative: 6." },
          { t:"`-sin(6x)`", why:"The inside `6x` changes 6 times as fast as `x`: multiply by 6." },
          { t:"`6 sin(6x)`", why:"cos differentiates to `-sin`." },
          { t:"`-6 sin x`", why:"Keep the inside `6x`." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the slope of `y = cos x` at `x = 2π/3`?", options:[
          { t:"`-√3/2`", ok:true, why:"`-sin(2π/3) = -√3/2`." },
          { t:"`-1/2`", why:"That’s `cos(2π/3)`, the height." },
          { t:"`√3/2`", why:"The slope of cos is `-sin`." },
          { t:"`1/2`", why:"That’s neither `-sin` nor `cos` at `2π/3`; check the reference angle." }] },
        b:{ prompt:"What is the slope of `y = sin x` at `x = 5π/6`?", options:[
          { t:"`-√3/2`", ok:true, why:"`cos(5π/6) = -√3/2`." },
          { t:"`1/2`", why:"That’s `sin(5π/6)`, the height." },
          { t:"`√3/2`", why:"Cosine is negative in quadrant 2." },
          { t:"`-1/2`", why:"The reference angle `π/6` gives `√3/2` for cosine." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`y = x^2 sin x`. Find `y′` at `x = π`.", options:[
          { t:"`-π^2`", ok:true, why:"`y′ = 2x sin x + x^2 cos x = 0 + π^2(-1)`." },
          { t:"`-2π`", why:"That’s `2x cos x`, the product of the derivatives." },
          { t:"`π^2`", why:"`cos π = -1`, so the second term is negative." },
          { t:"0", why:"`sin π = 0` removes only the first term." }] },
        b:{ prompt:"`y = x^2 cos x`. Find `y′` at `x = π/2`.", options:[
          { t:"`-π^2/4`", ok:true, why:"`2x cos x - x^2 sin x = 0 - π^2/4`." },
          { t:"`-π`", why:"`2x · (-sin x)` multiplies the derivatives." },
          { t:"`π^2/4`", why:"cos differentiates to `-sin`, so the second term is `-x^2 sin x`." },
          { t:"0", why:"`cos(π/2) = 0` removes only the first term." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Where in `[0, 2π]` does `y = 2 sin x + x` have horizontal tangents?", options:[
          { t:"`x = 2π/3` and `4π/3`", ok:true, why:"`2 cos x + 1 = 0` gives `cos x = -1/2`." },
          { t:"`x = π/3` and `5π/3`", why:"Those give `cos x = +1/2`." },
          { t:"`x = 7π/6` and `11π/6`", why:"Those solve `2 sin x + 1 = 0`; the derivative of sin is cos." },
          { t:"Nowhere", why:"`2 cos x + 1` does reach 0." }] },
        b:{ prompt:"Where in `[0, 2π]` does `y = 2 cos x + x` have horizontal tangents?", options:[
          { t:"`x = π/6` and `5π/6`", ok:true, why:"`-2 sin x + 1 = 0` gives `sin x = 1/2`." },
          { t:"`x = 7π/6` and `11π/6`", why:"That uses `+2 sin x`." },
          { t:"`x = π/3` and `5π/3`", why:"Those solve `cos x = 1/2`." },
          { t:"Nowhere", why:"`-2 sin x + 1` does reach 0." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`f(x) = sin(πx)`. What is `f′(1/3)`?", options:[
          { t:"`π/2`", ok:true, why:"`f′ = π cos(πx) = π cos(π/3)`." },
          { t:"`1/2`", why:"The inside `πx` contributes a factor `π`." },
          { t:"`π√3/2`", why:"That uses `sin(π/3)` instead of cos." },
          { t:"`-π/2`", why:"sin differentiates to `+cos`." }] },
        b:{ prompt:"`g(x) = cos(πx/2)`. What is `g′(1)`?", options:[
          { t:"`-π/2`", ok:true, why:"`g′ = -(π/2) sin(πx/2) = -(π/2) sin(π/2)`." },
          { t:"−1", why:"The inside `πx/2` contributes a factor `π/2`." },
          { t:"`π/2`", why:"cos differentiates to `-sin`." },
          { t:"0", why:"That’s `cos(π/2)`, the height." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `d/dx sin x = cos x`?", options:[
          { t:"As a tangent slides along `y = sin x` (in radians), its slope is 1 at `x = 0`, 0 at `π/2`, −1 at `π` and 0 at `3π/2`: the values of `cos x` at those points.", ok:true, why:"The slopes, point by point, are the values of `cos x`." },
          { t:"Sine and cosine are the same wave shifted, and shifting a graph doesn’t change its slope.", why:"Shifting moves where each slope happens; the slopes of sin are a shifted copy of sin, which is cos." },
          { t:"Both `sin x` and `cos x` stay between −1 and 1.", why:"Many functions do; that says nothing about slopes." },
          { t:"The slope of `sin x` is greatest at its peak, where `cos x = 1`.", why:"At the peak the slope is 0." }] },
        b:{ prompt:"Which is the best explanation of why `d/dx cos x = -sin x`?", options:[
          { t:"The slopes of `y = cos x` are 0 at `x = 0`, −1 at `π/2`, 0 at `π` and 1 at `3π/2`: the values of `-sin x`.", ok:true, why:"The slopes, point by point, are the values of `-sin x`." },
          { t:"Cosine is sine shifted, so its derivative is the same: `cos x`.", why:"The slopes start at 0 and go negative; `cos x` starts at 1." },
          { t:"Cosine’s derivative is sine, and the minus sign is optional.", why:M1 },
          { t:"The slope of `cos x` is largest at `x = 0`, where `cos x = 1`.", why:"At `x = 0`, cos has a peak: slope 0." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Why do the rules `d/dx sin x = cos x` and `d/dx cos x = -sin x` need `x` in radians?", options:[
          { t:"Only in radians is the slope of `sin x` at 0 exactly 1. In degrees the slope at 0 is `π/180`, and every derivative picks up that factor.", ok:true, why:"The size of the unit on the `x`-axis sets every slope." },
          { t:"Radians make the graph periodic.", why:"The graph is periodic in degrees too." },
          { t:"Calculators work in radians.", why:"The reason is about slopes, not calculators." },
          { t:"In degrees, the derivative of sin is `-cos`.", why:M5 }] },
        b:{ prompt:"A student graphs `y = sin x` with `x` in degrees and measures a slope of about 0.0175 at `x = 0`. Which explains it?", options:[
          { t:"In degrees, `sin x° = sin(πx/180)`, so the slope at 0 is `π/180 ≈ 0.0175`. The rule `cos x` needs radians.", ok:true, why:"The chain rule brings in the factor `π/180`." },
          { t:"The graph was drawn wrong; the slope at 0 is always 1.", why:M5 },
          { t:"The slope is small because `sin 0 = 0`.", why:"The height is 0, but the slope isn’t the height." },
          { t:"Degrees make the derivative `-sin x`, which is 0 at `x = 0`.", why:"The derivative of sin is `+cos`; degrees only add the factor `π/180`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A mass on a spring is at `s(t) = 6 cos(πt/2)` cm, `t` in seconds. What is its velocity at `t = 1/3` s?", options:[
          { t:"`-3π/2` cm/s", ok:true, why:"`v = -6(π/2) sin(πt/2) = -3π sin(π/6)`." },
          { t:"−3 cm/s", why:"The inside’s derivative `π/2` multiplies." },
          { t:"`3π/2` cm/s", why:"cos differentiates to `-sin`." },
          { t:"`-3π√3/2` cm/s", why:"`πt/2 = π/6` and `sin(π/6) = 1/2`." }] },
        b:{ prompt:"A mass on a spring is at `s(t) = 4 sin(πt/3)` cm. What is its velocity at `t = 1` s?", options:[
          { t:"`2π/3` cm/s", ok:true, why:"`v = 4(π/3) cos(π/3)`." },
          { t:"2 cm/s", why:"The inside’s derivative `π/3` multiplies." },
          { t:"`-2π/3` cm/s", why:"sin differentiates to `+cos`." },
          { t:"`2π√3/3` cm/s", why:"`cos(π/3) = 1/2`, not `√3/2`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A Ferris wheel rider’s height is `h(t) = 12 - 10 cos(πt/30)` m, `t` in seconds. When in the first 60 s is the rider rising fastest?", options:[
          { t:"At `t = 15` s", ok:true, why:"`h′ = (π/3) sin(πt/30)`, largest when `πt/30 = π/2`." },
          { t:"At `t = 30` s", why:"That’s the top, where `h′ = 0`." },
          { t:"At `t = 0` s", why:"The rider is at the bottom, momentarily not rising." },
          { t:"At `t = 45` s", why:"That’s where the rider falls fastest." }] },
        b:{ prompt:"A Ferris wheel rider’s height is `h(t) = 9 - 8 cos(πt/20)` m. When in the first 40 s is the rider rising fastest?", options:[
          { t:"At `t = 10` s", ok:true, why:"`h′ = (2π/5) sin(πt/20)`, largest at `πt/20 = π/2`." },
          { t:"At `t = 20` s", why:"That’s the top, where `h′ = 0`." },
          { t:"At `t = 0` s", why:"The rider is at the bottom, momentarily not rising." },
          { t:"At `t = 30` s", why:"That’s where the rider falls fastest." }] } }
    ]
  },
  task:{
    title:"Wave design", summary:"Wave design",
    statement:"<p>Design `y = @a{a} sin(@k{k}x)` that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The tangent at the origin has slope 6.</li><li>The wave’s maximum value is at least 2.</li><li>The tangent at `x = π/4` does not slope downward.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose `@a{a}` (a whole number from 1 to 8) and `@k{k}`. The graph shows the tangent lines at `x = 0` and `x = π/4` with their slopes.</p>",
    checks:["Slope 6 at the origin", "Maximum value at least 2", "Tangent at `π/4` not sloping down"],
    tips:["`y′ = @a{a}@k{k} cos(@k{k}x)`, so the slope at 0 is `@a{a}@k{k}`.",
      "The maximum of `@a{a} sin(@k{k}x)` is `@a{a}`.",
      "You need `cos(@k{k}π/4) ≥ 0`, so `@k{k}π/4` can’t be past `π/2` (for these `@k{k}`)."],
    explainPrompt:"Explain how the derivative `@a{a}@k{k} cos(@k{k}x)` linked the three conditions, and why (2, 3) fails.",
    vocab:"Use the words derivative, slope, chain rule and maximum.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"(2, 3) has slope 6 at the origin, but at `π/4` its slope is `6 cos(3π/4) = -3√2`. (1, 6) passes line 3 (slope 0) but its maximum is only 1. At (3, 2) the tangent at `π/4` is exactly horizontal, which still counts as not sloping down.",
    labels:{ a:"`@a{a}`", k:"`@k{k}`", aAria:"a", kAria:"k", fRow:"Function", dRow:"Derivative", s0:"Slope at `x = 0`", s4:"Slope at `x = π/4`", max:"Maximum value",
      graph:"Graph with the tangents at `x = 0` and `x = π/4`", flat:"horizontal" }
  },
  cards:[
    ["`d/dx sin x`", "`cos x` (radians)."],
    ["`d/dx cos x`", "`-sin x` (radians)."],
    ["Why the minus?", "`cos x` falls right after `x = 0`, so its slope starts negative."],
    ["Radians only", "In degrees, every trig derivative has an extra factor `π/180`."],
    ["`d/dx sin(kx)`", "`k cos(kx)`."],
    ["`d/dx cos(g(x))`", "`-sin(g(x)) · g′(x)`."],
    ["`d/dx sin^2 x`", "`2 sin x cos x = sin 2x`."],
    ["`sin(x^2)` vs `sin^2 x`", "`2x cos(x^2)` vs `2 sin x cos x`."],
    ["Steepest point of a sine wave", "Where it crosses its axis; slope ±(amplitude × `k`)."],
    ["Horizontal tangents of `sin x`", "At peaks and troughs: `π/2 + nπ`."],
    ["Unit circle picture", "Moving at unit speed, the height `sin θ` changes at rate `cos θ`."],
    ["Product with trig", "`d/dx (x sin x) = sin x + x cos x`."]
  ]
};
