// MCV4U 30 Derivatives of Tangent and Cotangent. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/30-derivatives-of-tangent-and-cotangent.md
// misconception core sentences (plan §3)
const M1 = "`tan x = sin x/cos x`; the quotient rule gives `1/cos^2 x = sec^2 x`: squared, and positive.";
const M2 = "`cot x` falls everywhere, so its derivative is negative: `-csc^2 x`.";
const M3 = "`cos x · cos x - sin x · (-sin x)`: minus a negative is plus.";
const M4 = "`sec x = 1/cos x`, so `sec(π/3) = 2` and `sec^2(π/3) = 4`.";
const M6 = "At `x = 0` the slope is `sec^2 0 = 1`, not 0. `tan x` never levels off.";
const M7 = "`50 sec^2 θ` tells how fast the height changes per radian, not the height itself.";
const PI = Math.PI, R3 = Math.sqrt(3);
const DH = "`{dh}/{dθ}`", DS = "`{ds}/{dθ}`";

export default {
  id:"30-derivatives-of-tangent-and-cotangent",
  kind:"topic",
  title:"Derivatives of tangent and cotangent",
  topic:"Derivatives of Tangent and Cotangent",
  readyTopic:"the derivatives of tangent and cotangent",
  hero:{
    eq:"`{d}/{dx} tan x = sec^2 x = {1}/{cos^2 x}` <span class=\"tn-heq2\">`{d}/{dx} cot x = -csc^2 x`</span>",
    eqLabel:"d by d x of tan x equals sec squared x, which equals 1 over cos squared x. d by d x of cot x equals negative csc squared x.",
    eqSize:"sm",
    headline:"Never gentler than slope 1",
    text:"Between its <strong>vertical asymptotes</strong>, the graph of `y = tan x` rises all the way from −∞ to ∞. The <strong>quotient rule</strong> shows exactly how steeply: its slope is `sec^2 x`, which is never less than 1. That’s why the graph rises everywhere and never levels off, not even at the origin.",
    fig:{ html:'<div class="tn-hero"><canvas class="plot tn-htop" id="hero-plot" role="img" aria-label="Top panel: y = tan x between dashed asymptotes at x = −π/2 and x = π/2, with a tangent line at the origin labelled slope 1."></canvas>' +
      '<canvas class="plot tn-hlow" id="hero-d" role="img" aria-label="Bottom panel: the slope of the tangent plotted against x, with a dashed line at y = 1."></canvas></div>' }
  },
  goals:[
    "I can derive `d/dx tan x = sec^2 x` with the quotient rule and the Pythagorean identity.",
    "I can differentiate `tan x` and `cot x`, including with the chain rule.",
    "I can explain why every tangent line to `y = tan x` has slope at least 1.",
    "I can find exact slopes and tangent lines at special angles.",
    "I can use these derivatives to find rates of change involving angles."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Quotient rule", goal:1, prompt:"Which is the quotient rule for `d/dx (f/g)`?",
          options:[
            { t:"`{f′g - fg′}/{g^2}`", ok:true, why:"Bottom times derivative of top, minus top times derivative of bottom, over bottom squared." },
            { t:"`{f′g + fg′}/{g^2}`", why:"That’s the product rule’s numerator; the quotient rule subtracts." },
            { t:"`{fg′ - f′g}/{g^2}`", why:"The order is reversed, so the sign is flipped." },
            { t:"`{f′}/{g′}`", why:"Dividing derivatives doesn’t work: try `x/x`." }],
          hints:["Test with `x^2/x = x`, whose derivative is 1.", "`(2x · x - x^2 · 1)/x^2 = 1`.", "`(f′g - fg′)/g^2`."] },
        { id:"w2", skill:"Sine and cosine derivatives", goal:1, prompt:"`d/dx cos x` = ?",
          options:[
            { t:"`-sin x`", ok:true, why:"`cos` falls just after 0." },
            { t:"`sin x`", why:"The sign is negative." },
            { t:"`-cos x`", why:"That’s the second derivative of `cos x`." },
            { t:"`cos x`", why:"Only `e^x` is its own derivative." }],
          hints:["Is `cos x` rising or falling just after `x = 0`?", "Falling.", "`-sin x`."] },
        { id:"w3", skill:"Identities and reciprocal ratios", goal:1, prompt:"`sin^2 x + cos^2 x` = ?",
          options:[
            { t:"1", ok:true, why:"The Pythagorean identity." },
            { t:"0", why:"Two squares can’t add to 0 unless both are 0." },
            { t:"`tan^2 x`", why:"`tan^2 x = sin^2 x/cos^2 x`." },
            { t:"`sec^2 x`", why:"`1 + tan^2 x = sec^2 x` is a different identity." }],
          hints:["Think of the unit circle.", "`x^2 + y^2 = 1` with `x` = cos, `y` = sin.", "1."] },
        { id:"w4", skill:"Identities and reciprocal ratios", goal:2, prompt:"`sec x` = ?",
          options:[
            { t:"`1/cos x`", ok:true, why:"Secant is the reciprocal of cosine." },
            { t:"`1/sin x`", why:"That’s `csc x`." },
            { t:"`cos^{-1} x`", why:"`cos^{-1}` means the inverse function, not the reciprocal." },
            { t:"`1/tan x`", why:"That’s `cot x`." }],
          hints:["Each reciprocal pairs with one ratio.", "csc ↔ sin, sec ↔ cos, cot ↔ tan.", "`1/cos x`."] },
        { id:"w5", skill:"Special angles", goal:4, prompt:"`sec^2(π/4)` = ?",
          options:[
            { t:"2", ok:true, why:"`cos(π/4) = √2/2`, so `sec(π/4) = √2` and `sec^2 = 2`." },
            { t:"`√2`", why:"That’s `sec(π/4)`; square it." },
            { t:"1/2", why:"That’s `cos^2(π/4)`; take the reciprocal." },
            { t:"1", why:"That’s `tan(π/4)`." }],
          hints:["`cos(π/4)` = ?", "`√2/2`; reciprocal `√2`.", "`(√2)^2 = 2`."] },
        { id:"w6", skill:"Special angles", goal:4, prompt:"`csc(π/6)` = ?",
          options:[
            { t:"2", ok:true, why:"`sin(π/6) = 1/2`, reciprocal 2." },
            { t:"1/2", why:"That’s `sin(π/6)`." },
            { t:"`2/√3`", why:"That’s `sec(π/6)`." },
            { t:"`√3`", why:"That’s `cot(π/6)`." }],
          hints:["`csc = 1/sin`.", "`sin(π/6) = 1/2`.", "2."] }
      ],
      refreshers:{
        "Quotient rule":"`(f/g)′ = (f′g - fg′)/g^2`. The order matters.",
        "Sine and cosine derivatives":"`(sin x)′ = cos x`; `(cos x)′ = -sin x`.",
        "Identities and reciprocal ratios":"`sin^2 x + cos^2 x = 1`; `sec = 1/cos`, `csc = 1/sin`, `cot = cos/sin`.",
        "Special angles":"`sec^2(π/6) = 4/3`, `sec^2(π/4) = 2`, `sec^2(π/3) = 4`; `csc^2` gives the same values at `π/3`, `π/4`, `π/6`."
      }
    }
  },
  explore:{
    heading:"Steep tangent",
    intro:"Slide the tangent along `y = tan x`. Its slope is plotted below. How small can the slope get?",
    fns:[{ id:"tan", t:"`tan x`" }, { id:"cot", t:"`cot x`" }, { id:"tm4", t:"`tan x - 4x`" }],
    modes:[{ id:"trail", t:"Slope trail" }, { id:"derive", t:"Derive it" }],
    cands:[{ id:"sec2", t:"`sec^2 x`" }, { id:"sec", t:"`sec x`" }, { id:"tan2", t:"`1 + tan^2 x`" }, { id:"csc2", t:"`-csc^2 x`" }],
    txt:{
      fn:"Function", mode:"Mode", point:"Point `x`",
      pointNote:"Arrow keys move the point by `π/24` (Shift + arrows: 0.01). Enter marks the point. You can also tap the top graph.",
      angles:"Special angles", mark:"Mark point", clearMarks:"Clear marks", marksH:"Marked points", noMarks:"No points marked yet.",
      remove:"Remove", max:"max", min:"min", markFull:"You can mark up to four points. Remove one first.",
      clearTrail:"Clear trail", showAll:"Show the whole trail",
      candH:"The trail matches…", candNone:"Tap a curve to lay it over the trail in long dashes.",
      candYes:"✓ The trail lies exactly on this curve.", candNo:"✗ The trail leaves this curve.",
      key:"`f` in blue with dashed asymptotes; the tangent in black. Lower panel: the slope trail in teal.",
      rows:{ fn:"Function", point:"Point", slope:"Slope (measured)", sec2:"`sec^2 x`", tan2:"`1 + tan^2 x`", cot2:"`-(1 + cot^2 x)`", dist:"Distance to asymptote" },
      big:"> 50", bigNeg:"< −50", both:"from both asymptotes", from:"from",
      lowLabel:"slope", deriveH:"Derive it: the quotient rule, one line at a time",
      deriveHow:"Step through the lines. Each line has a <strong>Check this line</strong> button that puts `x = π/6` into both sides.",
      checkLine:"Check this line", agree:"✓ Both sides agree."
    },
    derive:{
      tan:[
        { t:"`tan x = {sin x}/{cos x}`", c:"Left: `tan(π/6) = √3/3`. Right: `{1/2}/{√3/2} = 1/√3 = √3/3`." },
        { t:"`{d}/{dx} tan x = {(cos x)(cos x) - (sin x)(-sin x)}/{cos^2 x}`", c:"Left: the measured slope at `π/6` is 1.333. Right: `{(√3/2)(√3/2) - (1/2)(-1/2)}/{3/4} = 4/3` ≈ 1.333." },
        { t:"`= {cos^2 x + sin^2 x}/{cos^2 x}`", c:"`{3/4 + 1/4}/{3/4} = 4/3`." },
        { t:"`= {1}/{cos^2 x}`", c:"`{1}/{3/4} = 4/3`: the Pythagorean identity made the top 1." },
        { t:"`= sec^2 x`", c:"`sec(π/6) = 2/√3`, so `sec^2(π/6) = 4/3`." },
        { t:"`= 1 + tan^2 x`", c:"`1 + (√3/3)^2 = 1 + 1/3 = 4/3`." }
      ],
      tm4:{ t:"So `{d}/{dx}(tan x - 4x) = sec^2 x - 4`.", c:"At `π/6`: `4/3 - 4 = -8/3` ≈ −2.667, the measured slope of `tan x - 4x`." },
      cot:[
        { t:"`cot x = {cos x}/{sin x}`", c:"Left: `cot(π/6) = √3`. Right: `{√3/2}/{1/2} = √3`." },
        { t:"`{d}/{dx} cot x = {(-sin x)(sin x) - (cos x)(cos x)}/{sin^2 x}`", c:"Left: the measured slope at `π/6` is −4.000. Right: `{(-1/2)(1/2) - (√3/2)(√3/2)}/{1/4} = -4`." },
        { t:"`= {-(sin^2 x + cos^2 x)}/{sin^2 x}`", c:"`{-(1/4 + 3/4)}/{1/4} = -4`." },
        { t:"`= {-1}/{sin^2 x}`", c:"`{-1}/{1/4} = -4`." },
        { t:"`= -csc^2 x`", c:"`csc(π/6) = 2`, so `-csc^2(π/6) = -4`." }
      ]
    },
    predIntro:"Make a prediction first. Then the steep-tangent tool shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"What is the smallest slope of any tangent line to `y = tan x`?",
        options:[{ t:"1, at `x = 0`", ok:true }, { t:"0, at `x = 0`" }, { t:"There’s no smallest; it goes to −∞" }, { t:"1/2, at `x = π/6`" }],
        explain:"`sec^2 0 = 1` and `sec^2 x > 1` everywhere else. The graph never levels off." },
      { id:"p2", prompt:"`y = tan x`. What is the slope at `x = π/4`?",
        options:[{ t:"2", ok:true }, { t:"1" }, { t:"`√2`" }, { t:"1/2" }],
        explain:"`sec^2(π/4) = (√2)^2 = 2`. The height there is 1, but the slope is 2." },
      { id:"p3", prompt:"`y = cot x` on (0, π). What can you say about every slope of `y = cot x`?",
        options:[{ t:"Always −1 or less", ok:true }, { t:"Always 1 or more" }, { t:"Zero at `x = π/2`" }, { t:"Positive near `x = 0`" }],
        explain:"`-csc^2 x ≤ -1`, since `csc^2 x ≥ 1`." },
      { id:"p4", prompt:"`y = tan x`. As `x → π/2^-`, what happens to the slope?",
        options:[{ t:"It grows without bound", ok:true }, { t:"It approaches 1" }, { t:"It approaches 0" }, { t:"It becomes negative" }],
        explain:"`cos x → 0`, so `1/cos^2 x → ∞`." }
    ],
    chalIntro:"Use the steep-tangent tool, mark the points with <strong>Mark point</strong> (or Enter on the point slider), then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"`tan x`: put the point where the slope is exactly 4. Then find the other place on this branch.",
        why:"`sec^2 x = 4` means `cos x = ±1/2`, so `x = ±π/3`: one on each side of 0, because `sec^2` is even.",
        hints:["Solve `sec^2 x = 4`.", "`cos^2 x = 1/4`, so `cos x = ±1/2`.", "On `(-π/2, π/2)`: `x = ±π/3`."],
        msgs:{ fn:"Choose `tan x`, then mark the points.", none:"Mark a point first: move the point, then press <strong>Mark point</strong>.",
          pi6:"`sec^2(π/6) = 4/3`.", height:"That’s where the <strong>height</strong> is 4.", mirror:"`sec^2` is even: try the mirror point.",
          extra:"Keep only the two points where the slope is exactly 4: remove the others.",
          general:"Not yet: the slope must be exactly 4 at each marked point. Watch the slope readout." } },
      { id:"tc2", goal:[2, 4], prompt:"`cot x`: put the point where the slope is −2. Find both places on (0, π).",
        why:"`-csc^2 x = -2` means `sin^2 x = 1/2`, so `x = π/4` or `3π/4`.",
        hints:["Solve `-csc^2 x = -2`.", "`sin^2 x = 1/2`.", "`x = π/4` or `3π/4`."],
        msgs:{ fn:"Choose `cot x`, then mark the points.", none:"Mark a point first: move the point, then press <strong>Mark point</strong>.",
          pi6:"`csc^2(π/6) = 4`, so the slope there is −4.", one:"`sin^2 x = 1/2` has two solutions on (0, π).",
          extra:"Keep only the two points where the slope is exactly −2: remove the others.",
          general:"Not yet: the slope must be exactly −2 at each marked point. Watch the slope readout." } },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"`tan x - 4x`: mark every horizontal tangent on `(-π/2, π/2)` and label each as a local maximum or minimum.",
        why:"`y′ = sec^2 x - 4` goes + to − at `-π/3` (a local maximum) and − to + at `π/3` (a local minimum).",
        hints:["`y′ = sec^2 x - 4`.", "`sec^2 x = 4` at `x = ±π/3`.", "`y′` goes + to − at `-π/3` (max) and − to + at `π/3` (min)."],
        msgs:{ fn:"Choose `tan x - 4x`, then mark the points.", none:"Mark a point first: move the point, then press <strong>Mark point</strong>.",
          swapped:"Just right of `-π/3` the slope `sec^2 x - 4` is negative, so the graph turns down there: a maximum.",
          swapped2:"Just right of `π/3` the slope `sec^2 x - 4` is positive, so the graph turns up there: a minimum.",
          pi6:"`sec^2(π/6) = 4/3`, not 4.", one:"`sec^2 x = 4` has two solutions on this branch.",
          label:"Label each marked point: tap <strong>max</strong> or <strong>min</strong> beside it.",
          extra:"Keep only the horizontal tangents: remove the other points.",
          general:"Not yet: a horizontal tangent has slope 0. Watch the slope readout." } }
    ]
  },
  part3:{
    slug:"apply", name:"Apply",
    heading:"Using the trig derivatives",
    intro:"Put the new derivatives to work: a tangent line at an exact angle, then two short angle problems, a rising drone and a shrinking shadow. Then try the quick check.",
    labels:{ check:"Check", fill:"Fill in every box first.", err:"Type exact numbers only, such as 3, −4/3 or √3.",
      dec:"Give the exact value: whole numbers or fractions, not decimals.", piIn:"The π is already there: type only the number in front of it.",
      play:"Play", pause:"Pause", reset:"Reset", working:"Check it with algebra",
      qGeneral:"Not yet. Differentiate first, then substitute the moment’s values." },
    st1:{ title:"Station 1: Tangent line at a special angle",
      text:"`y = tan x` at `x = π/4`: the slope is `sec^2(π/4) = 2` and the line passes through `(π/4, 1)`. Fill in the tangent line, then press Check. Your line draws on the graph. (A blank box in front of π means 1.)",
      graph:"Graph of y = tan x with the point (π/4, 1).",
      good:"<strong>✓ Right:</strong> `y - 1 = 2(x - π/4)`, so `y = 2x + 1 - π/2`. The line touches the curve at `(π/4, 1)`.",
      w1:"The height there is 1, but the slope is 2.", wr2:"`sec(π/4) = √2`; square it: the slope is 2.",
      general:"Not yet: put the point `(π/4, 1)` into `y = 2x + b` and solve for `b`." },
    st2:{ title:"Station 2: The rising drone",
      text:"A drone rises straight up from a point 40 m from you. When its angle of elevation is θ, its height is `h = 40 tan θ`. So " + DH + " `= 40 sec^2 θ`. Press Play: θ grows at 0.05 rad/s.",
      fig:"Side view: you on the ground, the drone 40 m away and its height h above the ground.",
      theta:"Angle θ", rows:{ t:"Time `t`", th:"Angle θ", h:"Height `h`", dhdth:DH, dhdt:"`{dh}/{dt}`" },
      qs:[
        { id:"d1", q:"How fast does the height change with the angle at `θ = π/3`? " + DH + " =", unit:"m per radian", answer:160,
          wrong:[{ v:80, fb:"Square `sec(π/3) = 2`." }, { v:40 * R3, fb:"That uses the height formula `40 tan θ`, not its derivative." }],
          good:"`40 sec^2(π/3) = 40 · 4 = 160` m per radian." },
        { id:"d2", q:"If θ is increasing at 0.05 rad/s at that moment, how fast is the drone rising?", unit:"m/s", answer:8,
          wrong:[{ v:160, fb:"That’s " + DH + ". Multiply by `{dθ}/{dt} = 0.05`: the chain rule in time, as in related rates." }, { v:4, fb:"`sec^2(π/3) = 4`, not 2." }],
          good:"`{dh}/{dt} = 160 × 0.05 = 8` m/s." },
        { id:"d3", q:"The drone rises at 4 m/s. How fast is θ changing when `h = 40` m?", unit:"rad/s", answer:0.05,
          wrong:[{ v:0.1, fb:"At `h = 40` m, `tan θ = 1`, so `θ = π/4` and `sec^2 θ = 2`." }, { v:10, fb:"Solve `4 = 40 sec^2 θ · {dθ}/{dt}` for `{dθ}/{dt}`." }],
          good:"`θ = π/4`, so `4 = 40 · 2 · {dθ}/{dt}` and `{dθ}/{dt} = 1/20` rad/s." }
      ],
      alg:["`h = 40 tan θ`, so " + DH + " `= 40 sec^2 θ`.", "At `θ = π/3`: `40 · 4 = 160` m per radian.",
        "Chain rule in time: `{dh}/{dt} = {dh}/{dθ} · {dθ}/{dt} = 160 × 0.05 = 8` m/s.",
        "Reverse: `h = 40` m means `tan θ = 1`, so `θ = π/4`. Then `4 = 40 · 2 · {dθ}/{dt}`, so `{dθ}/{dt} = 1/20` rad/s."] },
    st3:{ title:"Station 3: The shrinking shadow",
      text:"A pole 6 m tall casts a shadow `s = 6 cot θ` when the sun’s elevation is θ. So " + DS + " `= -6 csc^2 θ`. Move the sun and watch the shadow.",
      fig:"Side view: a 6 m pole, the sun’s ray at elevation θ and the shadow s on the ground.",
      theta:"Sun’s elevation θ", rows:{ th:"Angle θ", s:"Shadow `s`", dsdth:DS },
      q:{ id:"s1", q:"How fast is the shadow length changing with respect to θ at `θ = π/6`? " + DS + " =", unit:"m per radian", answer:-24,
        wrong:[{ v:24, fb:"The shadow shortens as the sun rises, so the rate is negative." }, { v:-12, fb:"`csc(π/6) = 2` must be squared." }, { v:-8, fb:"That uses `csc^2(π/3) = 4/3`." }],
        good:"`-6 csc^2(π/6) = -6 · 4 = -24` m per radian. The negative sign means the shadow shortens as the sun rises." },
      alg:["`s = 6 cot θ`, so " + DS + " `= -6 csc^2 θ`.", "At `θ = π/6`: `csc(π/6) = 2`, so `-6 · 4 = -24` m per radian.", "The negative sign means the shadow shortens as the sun rises."] },
    quickCheck:{
      title:"Quick check", summary:"Using the trig derivatives quick check",
      items:[
        { id:"q1", goal:2, prompt:"`d/dx tan(2x)` = ?",
          choices:[{ t:"`2 sec^2(2x)`", ok:true, fb:"Right. Times the inside’s derivative, 2; the sec is squared." }, { t:"`sec^2(2x)`", fb:"Times the inside’s derivative, 2; the sec is squared." },
            { t:"`2 sec(2x)`", fb:"Times the inside’s derivative, 2; the sec is squared." }, { t:"`2x sec^2(2x)`", fb:"Times the inside’s derivative, 2; the sec is squared." }] },
        { id:"q2", goal:4, prompt:"Slope of `y = cot x` at `x = π/4`?",
          choices:[{ t:"−2", ok:true, fb:"Right. `-csc^2(π/4) = -(√2)^2 = -2`." }, { t:"2", fb:"`-csc^2(π/4) = -(√2)^2`." },
            { t:"−1", fb:"`-csc^2(π/4) = -(√2)^2`." }, { t:"`-√2`", fb:"`-csc^2(π/4) = -(√2)^2`." }] },
        { id:"q3", goal:5, prompt:"`h = 30 tan θ`. `{dh}/{dθ}` at `θ = π/6`?",
          choices:[{ t:"40", ok:true, fb:"Right. `30 sec^2(π/6) = 30 · 4/3 = 40`." }, { t:"30", fb:"`30 sec^2(π/6) = 30 · 4/3`." },
            { t:"`10√3`", fb:"`30 sec^2(π/6) = 30 · 4/3`." }, { t:"120", fb:"`30 sec^2(π/6) = 30 · 4/3`." }] },
        { id:"q4", goal:5, prompt:"Shadow `s = 6 cot θ`. As θ increases, `s` is…",
          choices:[{ t:"decreasing", ok:true, fb:"Right. `{ds}/{dθ} = -6 csc^2 θ < 0`." }, { t:"increasing", fb:"`{ds}/{dθ} = -6 csc^2 θ < 0`." },
            { t:"constant", fb:"`{ds}/{dθ} = -6 csc^2 θ < 0`." }, { t:"undefined", fb:"`{ds}/{dθ} = -6 csc^2 θ < 0`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:2,
        instruction:"Match each function with its derivative. One card on the right has no partner.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`tan(3x)`" },
          { id:"l2", t:"`cot(x/2)`", hints:["Inside `x/2` has derivative 1/2.", "`-csc^2(x/2) · (1/2)`.", "`-(1/2) csc^2(x/2)`."] },
          { id:"l3", t:"`tan^2 x`", hints:["Write it as `(tan x)^2`.", "`2 tan x · (tan x)′`.", "`2 tan x sec^2 x`."] },
          { id:"l4", t:"`x tan x`" },
          { id:"l5", t:"`tan(x^2)`" },
          { id:"l6", t:"`tan x + cot x`" }
        ],
        right:[
          { id:"r1", t:"`3 sec^2(3x)`" }, { id:"r2", t:"`-(1/2) csc^2(x/2)`" }, { id:"r3", t:"`2 tan x sec^2 x`" },
          { id:"r4", t:"`tan x + x sec^2 x`" }, { id:"r5", t:"`2x sec^2(x^2)`" }, { id:"r6", t:"`sec^2 x - csc^2 x`" }, { id:"r7", t:"`(1/2) csc^2(x/2)`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l3|r5":"`tan^2 x = (tan x)^2`; `tan(x^2)` has `x^2` inside.", "l5|r3":"`tan^2 x = (tan x)^2`; `tan(x^2)` has `x^2` inside.",
          "l2|r7":"`cot`’s derivative is negative.", "l4|r1":"`x tan x` is a product: use the product rule." },
        wrongDefault:"Outside derivative, inside kept, times the inside’s derivative." },
      { id:"slopes", type:"custom", title:"Exact slopes and tangent lines", summary:"Exact slopes and tangent lines", star:true, goal:[2, 3, 4],
        instruction:"Give exact slopes, tangent lines and `x`-values. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers or fractions in the boxes (`√3` is allowed). A blank box in front of π means 1; a blank bottom box means 1. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact numbers only, such as 3, −4/3 or √3.",
          dec:"Give the exact value: whole numbers or fractions, not decimals.", piIn:"The π is already there: type only the number in front of it.",
          general:"Not yet. Check your work and try again." },
        items:[
          { id:"t1", goal:4, prompt:"Slope of `y = tan x` at `x = π/6`.", form:"frac",
            parts:["slope =", { k:"n" }, "/", { k:"d", den:true }],
            answer:{ v:4 / 3 }, display:"4/3",
            wrong:[{ v:R3 / 3, fb:"That’s `tan(π/6)`, the height." }, { v:2 / R3, fb:"Square `sec(π/6)`." }],
            why:"`sec^2(π/6) = (2/√3)^2 = 4/3`." },
          { id:"t2", goal:[2, 4], prompt:"Slope of `y = 2 cot x` at `x = π/3`.", form:"frac",
            parts:["slope =", { k:"n" }, "/", { k:"d", den:true }],
            answer:{ v:-8 / 3 }, display:"−8/3",
            wrong:[{ v:8 / 3, fb:M2 }, { v:-4 / 3, fb:"Don’t drop the factor 2." }],
            why:"`y′ = -2 csc^2 x`, and `csc^2(π/3) = 4/3`: `-2 · 4/3 = -8/3`." },
          { id:"t3", goal:4, star:true, prompt:"Tangent to `y = tan x` at `x = -π/4`: enter the slope and `y`-intercept.", form:"lineT3",
            parts:["`y =`", { k:"m" }, "`x +`", { k:"p", pi:true }, "π /", { k:"q", den:true }, "−", { k:"c" }],
            answer:{ m:2, b:PI / 2 - 1 }, display:"`y = 2x + π/2 - 1`: slope 2, intercept `π/2 - 1`",
            wrong:[{ m:-2, fb:"`sec^2` is never negative, even at negative angles." }],
            general:"Not yet. The tangent passes through `(-π/4, -1)`: find its slope, then its intercept.",
            why:"Slope `sec^2(-π/4) = 2` through `(-π/4, -1)`: `y + 1 = 2(x + π/4)`, so `y = 2x + π/2 - 1`." },
          { id:"t4", goal:[2, 4], star:true, prompt:"Where on (0, π) is the slope of `y = cot x` equal to −4/3?", form:"pi2",
            parts:["`x =`", { k:"p1", pi:true }, "π /", { k:"q1", den:true }, "and `x =`", { k:"p2", pi:true }, "π /", { k:"q2", den:true }],
            answer:{ set:[PI / 3, 2 * PI / 3] }, display:"`x = π/3` and `x = 2π/3`",
            wrong:[{ has:PI / 6, fb:"`csc^2(π/6) = 4`." }, { has:5 * PI / 6, fb:"`csc^2(5π/6) = 4`." }],
            general:"Not yet. Solve `-csc^2 x = -4/3`: `sin^2 x = 3/4`.",
            why:"`csc^2 x = 4/3` means `sin x = √3/2`: `x = π/3` or `2π/3`." },
          { id:"t5", goal:3, star:true, prompt:"`y = tan x - 2x` on `(-π/2, π/2)`: at what `x` is the local minimum?", form:"pi1",
            parts:["`x =`", { k:"p", pi:true }, "π /", { k:"q", den:true }],
            answer:{ v:PI / 4 }, display:"`x = π/4`",
            wrong:[{ v:-PI / 4, fb:"That’s the local maximum: `y′ = sec^2 x - 2` goes + to − there." }],
            general:"Not yet. Set `y′ = sec^2 x - 2 = 0` and test the signs.",
            why:"`y′ = sec^2 x - 2` is − on `(-π/4, π/4)` and + after `π/4`: a minimum at `π/4`.",
            hints:["`y′ = sec^2 x - 2 = 0`.", "`cos^2 x = 1/2`, so `x = ±π/4`.", "Signs of `y′`: − on `(-π/4, π/4)`, + after `π/4`: a minimum at `π/4`."] },
          { id:"t6", goal:4, star:true, prompt:"The tangent to `y = tan x` at `x = π/4` crosses the `x`-axis where?", form:"piMinusFrac",
            parts:["`x =`", { k:"p", pi:true }, "π /", { k:"q", den:true }, "−", { k:"a" }, "/", { k:"b", den:true }],
            answer:{ v:PI / 4 - 1 / 2 }, display:"`x = π/4 - 1/2`",
            wrong:[],
            general:"The tangent is `y = 2x + 1 - π/2`. Set `y = 0`.",
            why:"`0 = 2x + 1 - π/2`, so `x = π/4 - 1/2`.",
            hints:["Write the tangent first.", "`y = 2x + 1 - π/2`.", "`0 = 2x + 1 - π/2`, so `x = π/4 - 1/2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Dmitri", how:"", goal:[1, 4],
        instruction:"Dmitri made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Show that `d/dx tan x = sec^2 x`.",
            steps:["`tan x = sin x/cos x`.", "Quotient rule: `{(cos x)(cos x) - (sin x)(-sin x)}/{cos^2 x}`.", "`= {cos^2 x - sin^2 x}/{cos^2 x}`.", "`= 1 - tan^2 x`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 simplifies step 3 correctly."],
            fixes:[
              { t:"`= {cos^2 x + sin^2 x}/{cos^2 x} = {1}/{cos^2 x} = sec^2 x`.", ok:true, why:M3 },
              { t:"`= {cos 2x}/{cos^2 x}`.", why:"That keeps the sign mistake, just renamed." },
              { t:"`cos^2 x - sin^2 x = 1`, so the answer is `sec^2 x`.", why:"`cos^2 x - sin^2 x` is `cos 2x`, not 1." },
              { t:"Step 3 is correct.", why:"Minus a negative is plus." }],
            hints:["Look at `- (sin x)(-sin x)`.", "That’s `+ sin^2 x`.", "`cos^2 x + sin^2 x = 1`."] },
          { id:"e2", goal:4, task:"Find the slope of `y = cot(2x)` at `x = π/8`.",
            steps:["`y′ = -csc^2(2x) · 2`.", "At `x = π/8`, `2x = π/4`.", "`csc(π/4) = √2/2`.", "`y′ = -2(√2/2)^2 = -2 · 1/2 = -1`."],
            answer:2,
            stepFb:["Step 1 is correct: chain factor 2.", "Step 2 is correct.", "", "Step 4 uses step 3’s value correctly."],
            fixes:[
              { t:"`csc(π/4) = 1/sin(π/4) = √2`, so `y′ = -2 · 2 = -4`.", ok:true, why:"csc is the reciprocal of sin: `csc(π/4) = √2` and `csc^2(π/4) = 2`." },
              { t:"`csc(π/4) = 1`.", why:"That’s `tan(π/4)`." },
              { t:"`csc(π/4) = √2/2`, but square it to 1/4.", why:"`√2/2` is `sin(π/4)`, and `(√2/2)^2 = 1/2`." },
              { t:"Step 3 is correct.", why:"`√2/2` is `sin(π/4)`; csc is its reciprocal." }],
            hints:["`csc = 1/sin`.", "`sin(π/4) = √2/2`.", "`csc(π/4) = √2`; `csc^2 = 2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the tangent graph: that the slope never drops below 1, or that `sec^2 x` and `1 + tan^2 x` gave the same curve?" },
      { id:"j2", q:"In your own words, why does the quotient rule for `sin x/cos x` simplify so neatly?" },
      { id:"j3", q:"Explain to a friend how to remember the signs of the tan and cot derivatives by looking at their graphs." },
      { id:"j4", q:"What part of using these derivatives in angle problems are you unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"`d/dx (3 tan x)` = ?", options:[
          { t:"`3 sec^2 x`", ok:true, why:"`d/dx tan x = sec^2 x`, times 3." },
          { t:"`3 sec x`", why:"sec is squared. " + M1 },
          { t:"`-3 sec^2 x`", why:"tan rises: positive derivative." },
          { t:"`3 sec x tan x`", why:"That’s the derivative of `3 sec x`." }] },
        b:{ prompt:"`d/dx (5 cot x)` = ?", options:[
          { t:"`-5 csc^2 x`", ok:true, why:"`d/dx cot x = -csc^2 x`, times 5." },
          { t:"`5 csc^2 x`", why:M2 },
          { t:"`-5 sec^2 x`", why:"cot pairs with csc." },
          { t:"`-5 csc x cot x`", why:"That’s the derivative of `5 csc x`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`d/dx tan(4x)` = ?", options:[
          { t:"`4 sec^2(4x)`", ok:true, why:"The inside `4x` changes 4 times as fast, and the sec is squared." },
          { t:"`sec^2(4x)`", why:"The inside `4x` changes 4 times as fast: `4 sec^2(4x)`." },
          { t:"`4 sec^2 x`", why:"Keep the inside `4x`." },
          { t:"`4 sec(4x)`", why:"sec is squared. " + M1 }] },
        b:{ prompt:"`d/dx cot(3x)` = ?", options:[
          { t:"`-3 csc^2(3x)`", ok:true, why:"The inside `3x` changes 3 times as fast, and cot’s derivative is negative." },
          { t:"`-csc^2(3x)`", why:"The inside `3x` changes 3 times as fast: `-3 csc^2(3x)`." },
          { t:"`3 csc^2(3x)`", why:M2 },
          { t:"`-3 csc^2 x`", why:"Keep the inside `3x`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What is the slope of `y = tan x` at `x = π/3`?", options:[
          { t:"4", ok:true, why:"`sec^2(π/3) = 2^2 = 4`." },
          { t:"2", why:"That’s `sec(π/3)`; square it." },
          { t:"`√3`", why:"That’s `tan(π/3)`, the height." },
          { t:"4/3", why:"That’s `sec^2(π/6)`." }] },
        b:{ prompt:"What is the slope of `y = tan x` at `x = -π/6`?", options:[
          { t:"4/3", ok:true, why:"`sec^2(-π/6) = 4/3`: squaring removes the sign." },
          { t:"−4/3", why:"tan is odd, but its slope `sec^2 x` is never negative." },
          { t:"`2/√3`", why:"That’s `sec(-π/6)`; square it." },
          { t:"`-1/√3`", why:"That’s `tan(-π/6)`, the height." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Which statement about `y = tan x` on `(-π/2, π/2)` is true?", options:[
          { t:"It is increasing everywhere, because `sec^2 x ≥ 1 > 0`.", ok:true, why:"Every slope is `sec^2 x`, at least 1." },
          { t:"It has a local minimum at `x = 0`, where its slope is 0.", why:"The slope at 0 is 1. " + M6 },
          { t:"Its slope is greatest at `x = 0`.", why:"That’s where it’s least." },
          { t:"Its slope is negative for `x < 0`.", why:"The height is negative there; the slope `sec^2 x` isn’t." }] },
        b:{ prompt:"Which statement about `y = cot x` on (0, π) is true?", options:[
          { t:"It is decreasing everywhere, because `-csc^2 x ≤ -1 < 0`.", ok:true, why:"Every slope is `-csc^2 x`, at most −1." },
          { t:"It has a local maximum at `x = π/2`, where its slope is 0.", why:"The slope at `π/2` is −1." },
          { t:"Its slope is closest to 0 near `x = 0`.", why:"Near 0 the slope goes to −∞." },
          { t:"Its slope is positive for `x > π/2`.", why:"The height is negative there; the slope is still negative." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"What is the `y`-intercept of the tangent to `y = tan x` at `x = π/4`?", options:[
          { t:"`1 - π/2`", ok:true, why:"Slope 2 through `(π/4, 1)`: `y = 2x + 1 - π/2`." },
          { t:"`1 - π/4`", why:"That uses slope 1 (the height) instead of 2." },
          { t:"`1 - √2π/4`", why:"That uses slope `√2`: square `sec(π/4)`." },
          { t:"1", why:"That’s the height of the point, not the intercept." }] },
        b:{ prompt:"What is the `y`-intercept of the tangent to `y = tan x` at `x = π/3`?", options:[
          { t:"`√3 - 4π/3`", ok:true, why:"Slope 4 through `(π/3, √3)`." },
          { t:"`√3 - 2π/3`", why:"That uses slope 2: square `sec(π/3)`." },
          { t:"`√3 - √3π/3`", why:"That uses the height `√3` as the slope." },
          { t:"`√3`", why:"That’s the height of the point." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"`f(x) = tan x · cot x` on `(0, π/2)`. What is `f′(x)`?", options:[
          { t:"0", ok:true, why:"`tan x · cot x = 1`, a constant." },
          { t:"`sec^2 x`", why:"`cot x` is a factor too; the product is 1." },
          { t:"`-sec^2 x csc^2 x`", why:"That multiplies the two derivatives; use the product rule, or simplify first." },
          { t:"`csc^2 x`", why:"The product is constant, so its derivative is 0." }] },
        b:{ prompt:"`g(x) = 1/cot x` on `(0, π/2)`. What is `g′(x)`?", options:[
          { t:"`sec^2 x`", ok:true, why:"`1/cot x = tan x`." },
          { t:"`-sin^2 x`", why:"That’s 1 over the derivative of `cot x`; the reciprocal of a derivative isn’t the derivative of the reciprocal." },
          { t:"`-csc^2 x`", why:"That’s the derivative of `cot x`, not of `1/cot x`." },
          { t:"`-sec^2 x`", why:"`1/cot x = tan x`, which rises: positive derivative." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"In deriving `d/dx tan x`, which step makes the result simplify to `sec^2 x`?", options:[
          { t:"“`(cos x)(cos x) - (sin x)(-sin x) = cos^2 x + sin^2 x = 1`, so the quotient is `1/cos^2 x`.”", ok:true, why:"Minus a negative is plus, and the Pythagorean identity makes the numerator 1." },
          { t:"“`sin x/cos x` simplifies to `sec x` before differentiating.”", why:"`sin x/cos x = tan x`, not `sec x`." },
          { t:"“The derivative of `sin x/cos x` is `cos x/(-sin x)`.”", why:"That divides the derivatives; use the quotient rule." },
          { t:"“`cos^2 x - sin^2 x = 1`.”", why:"The numerator is a sum, and `cos^2 x - sin^2 x = cos 2x`." }] },
        b:{ prompt:"In deriving `d/dx cot x`, which step makes the result simplify to `-csc^2 x`?", options:[
          { t:"“`(-sin x)(sin x) - (cos x)(cos x) = -(sin^2 x + cos^2 x) = -1`, so the quotient is `-1/sin^2 x`.”", ok:true, why:"Both products are subtracted, and the Pythagorean identity makes the numerator −1." },
          { t:"“`cos x/sin x` simplifies to `csc x` before differentiating.”", why:"`cos x/sin x = cot x`, not `csc x`." },
          { t:"“The derivative of `cos x/sin x` is `(-sin x)/cos x`.”", why:"That divides the derivatives; use the quotient rule." },
          { t:"“`sin^2 x - cos^2 x = 1`.”", why:"The numerator is `-(sin^2 x + cos^2 x)`, and `sin^2 x - cos^2 x` isn’t 1." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A drone’s height is `h = 50 tan θ` m when the angle of elevation from a point 50 m away is θ. Which statement about `{dh}/{dθ} = 50 sec^2 θ` at `θ = π/3` is best?", options:[
          { t:"“At `θ = π/3` the height increases about 200 m per radian, so a small extra angle of 0.01 rad means about 2 m more height.”", ok:true, why:"`50 sec^2(π/3) = 200` m per radian is a rate: `200 × 0.01 = 2` m." },
          { t:"“The drone is 200 m high.”", why:"Its height is `50√3 ≈ 87` m; 200 is a rate. " + M7 },
          { t:"“The height increases 200 m per degree.”", why:"The rate is per radian." },
          { t:"“`{dh}/{dθ}` = 100 m per radian.”", why:"`sec^2(π/3) = 4`, not 2." }] },
        b:{ prompt:"A balloon’s height is `h = 30 tan θ` m when seen from 30 m away. Which statement about `{dh}/{dθ}` at `θ = π/4` is best?", options:[
          { t:"“At `θ = π/4` the height increases about 60 m per radian, so 0.01 rad more angle means about 0.6 m more height.”", ok:true, why:"`30 sec^2(π/4) = 60` m per radian, and `60 × 0.01 = 0.6` m." },
          { t:"“The balloon is 60 m high.”", why:"Its height is 30 m." },
          { t:"“The height increases 60 m per degree.”", why:"The rate is per radian." },
          { t:"“`{dh}/{dθ} = 30√2` m per radian.”", why:"`sec^2(π/4) = 2`, not `√2`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A camera 20 m from a launch pad tracks a rocket rising straight up, so `h = 20 tan θ`. When `θ = π/4`, θ is increasing at 0.1 rad/s. How fast is the rocket rising?", options:[
          { t:"4 m/s", ok:true, why:"`{dh}/{dt} = 20 sec^2 θ · {dθ}/{dt} = 20 · 2 · 0.1`." },
          { t:"2 m/s", why:"That uses `tan(π/4) = 1` instead of `sec^2(π/4) = 2`." },
          { t:"`2√2` m/s", why:"`sec(π/4)` must be squared." },
          { t:"40 m/s", why:"Multiply by `{dθ}/{dt} = 0.1`." }] },
        b:{ prompt:"A camera 30 m away tracks a rising rocket: `h = 30 tan θ`. When `θ = π/3`, θ is increasing at 0.05 rad/s. How fast is the rocket rising?", options:[
          { t:"6 m/s", ok:true, why:"`30 · 4 · 0.05`." },
          { t:"3 m/s", why:"That uses `sec(π/3) = 2` without squaring." },
          { t:"`3√3/2` m/s", why:"That uses `tan(π/3) = √3`." },
          { t:"120 m/s", why:"Multiply by `{dθ}/{dt}`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A 9 m pole casts a shadow `s = 9 cot θ`, where θ is the sun’s elevation. How fast is the shadow length changing with respect to θ when `θ = π/6`?", options:[
          { t:"−36 m per radian", ok:true, why:"`-9 csc^2(π/6) = -9 · 4`." },
          { t:"36 m per radian", why:"The shadow shortens as the sun rises." },
          { t:"−18 m per radian", why:"`csc(π/6) = 2` must be squared." },
          { t:"−12 m per radian", why:"That uses `csc^2(π/3) = 4/3`." }] },
        b:{ prompt:"An 8 m pole casts a shadow `s = 8 cot θ`. How fast is the shadow length changing with respect to θ when `θ = π/4`?", options:[
          { t:"−16 m per radian", ok:true, why:"`-8 csc^2(π/4) = -8 · 2`." },
          { t:"16 m per radian", why:"The shadow shortens as the sun rises: " + M2 },
          { t:"`-8√2` m per radian", why:"`csc(π/4) = √2` must be squared." },
          { t:"−32/3 m per radian", why:"That uses `csc^2(π/3)`." }] } }
    ]
  },
  task:{
    title:"Two flat spots", summary:"Two flat spots",
    statement:"<p>Design `f(x) = a tan x + bx` on `(-π/2, π/2)` that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has horizontal tangents at `x = π/3` and `x = -π/3`.</li><li>The graph is concave down at `x = -π/3` (so that flat spot is a local maximum).</li><li>The local maximum value, `f(-π/3)`, is less than 8. (Use `π ≈ 3.14` and `√3 ≈ 1.73`.)</li></ol></div>" +
      "<p class=\"tiny muted\">`a` is a whole number from −4 to 4, not 0; `b` is a whole number from −16 to 16. The graph, the tangents at `±π/3` and the value `f(-π/3)` update as you go.</p>",
    checks:["Horizontal tangents at `±π/3`", "Concave down at `-π/3`", "`f(-π/3) < 8`"],
    tips:["`f′(x) = a sec^2 x + b`, and `sec^2(±π/3) = 4`. So you need `b = -4a`.",
      "`f″(x) = 2a sec^2 x tan x`. At `-π/3`, tan is negative, so concave down needs `a > 0`.",
      "With `b = -4a`: `f(-π/3) = a(4π/3 - √3) ≈ 2.46a`."],
    explainPrompt:"Explain how `sec^2(π/3) = 4` forced `b = -4a`, and how you used the second derivative to tell the maximum from the minimum.",
    vocab:"Use the words derivative, sec², concave down and local maximum.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"(4, −16) gives `f(-π/3) ≈ 9.83`, too high. Line 1 links `b` to `a`; line 2 makes `a` positive; line 3 caps `a` at 3.",
    labels:{ a:"`a`", b:"`b`", rangeA:"(−4 to 4, not 0)", rangeB:"(−16 to 16)",
      invalid:"Choose whole numbers: `a` from −4 to 4 (not 0) and `b` from −16 to 16.",
      fRow:"`f(x)`", dRow:"`f′(x)`", d1:"`f′(±π/3)`", d2:"`f″(-π/3)`", fv:"`f(-π/3)`",
      flat:"horizontal", down:"negative: concave down", up:"positive: concave up",
      graph:"Graph of `f` with the tangents at `x = ±π/3`" }
  },
  cards:[
    ["`d/dx tan x`", "`sec^2 x = 1/cos^2 x = 1 + tan^2 x`."],
    ["`d/dx cot x`", "`-csc^2 x = -1/sin^2 x`."],
    ["Derivation", "Quotient rule on `sin x/cos x`; the numerator is `cos^2 x + sin^2 x = 1`."],
    ["Smallest slope of `tan x`", "1, at `x = 0` (and every `x = nπ`)."],
    ["Signs", "tan rises everywhere (+); cot falls everywhere (−)."],
    ["Chain rule", "`d/dx tan(g(x)) = sec^2(g(x)) · g′(x)`."],
    ["`sec^2` at special angles", "`π/6`: 4/3 · `π/4`: 2 · `π/3`: 4."],
    ["`csc^2` at special angles", "`π/6`: 4 · `π/4`: 2 · `π/3`: 4/3."],
    ["Near an asymptote", "The slope of `tan x` grows without bound."],
    ["Angle of elevation", "`h = d tan θ`, so `{dh}/{dt} = d sec^2 θ · {dθ}/{dt}`."]
  ]
};
