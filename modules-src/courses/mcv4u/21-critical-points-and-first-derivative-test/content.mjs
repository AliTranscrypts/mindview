// MCV4U 21 Critical Points and the First Derivative Test. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/21-critical-points-and-first-derivative-test.md
// misconception core sentences (plan §3)
const M1 = "A corner, cusp or vertical tangent is also critical: `f′` doesn’t exist there, but `f` does.";
const M2 = (x) => "`x = " + x + "` isn’t in the domain of `f`, so it can’t be a critical number. It still splits the sign chart.";
const M3 = "`f′` must <strong>change sign</strong>. For `y = x^3`, `f′ ≥ 0` on both sides of 0, so there’s neither.";
const M4 = "Rising then falling makes a peak: + to − is a local <strong>maximum</strong>.";
const M4m = "Falling then rising makes a valley: − to + is a local <strong>minimum</strong>.";
const M5 = "The critical number is the `x`. The max or min value is `f(c)`, not `f′(c)`.";
const M6 = "Test a value in each interval. An even power like `x^2` never changes sign.";
const M7 = "Local means ‘compared with nearby points’. On different branches, a local max can be lower than a local min.";
// Activity 1: one feedback line per item, used for every wrong box
const BOXES = ["max", "min", "nei", "nc"];
const sortItem = (id, t, answer, fb, extra) => Object.assign({ id, t, answer, why:fb,
  wrong:Object.fromEntries(BOXES.filter(b => b !== answer).map(b => [b, fb])) }, extra || {});

export default {
  id:"21-critical-points-and-first-derivative-test",
  kind:"topic",
  title:"Critical points and the first derivative test",
  topic:"Critical Points and the First Derivative Test",
  readyTopic:"critical points and the first derivative test",
  hero:{
    eq:"`f′(c) = 0` <strong>or</strong> `f′(c)` does not exist ⟶ `c` is a <strong>critical number</strong>",
    eqLabel:"f prime of c equals 0, or f prime of c does not exist, so c is a critical number",
    eqSize:"sm",
    headline:"Every peak and valley starts as a candidate",
    text:"Local maximums and minimums can only happen at <strong>critical numbers</strong>: places in the domain where the tangent is horizontal or where no tangent slope exists. But not every candidate is a peak or a valley. The <strong>first derivative test</strong> checks the sign of `f′` on each side to decide.",
    fig:{ aria:"A graph with four critical points: a corner, a smooth peak, a cusp and a flat point. Each gets its tangent, sign chips for f′ on each side, and a label.", shape:"wide" }
  },
  goals:[
    "I can find the critical numbers of a function where `f′(x) = 0`.",
    "I can find critical numbers where `f′` does not exist (corners, cusps, vertical tangents) and exclude values outside the domain.",
    "I can use the first derivative test to classify each critical point as a local maximum, local minimum or neither.",
    "I can explain why `f′(c) = 0` does not guarantee a maximum or minimum.",
    "I can analyse critical points of rational functions and functions with fractional exponents.",
    "I can use critical points to answer questions in context and to design functions with given extrema."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rational exponents", goal:2, prompt:"Differentiate `f(x) = x^{2/3}`.",
          options:[
            { t:"`{2}/{3}x^{-1/3}`", ok:true, why:"Bring down `{2}/{3}` and subtract 1 from the exponent." },
            { t:"`{2}/{3}x^{1/3}`", why:"`{2}/{3} - 1 = -{1}/{3}`." },
            { t:"`{3}/{2}x^{1/2}`", why:"The exponent comes down as it is." },
            { t:"`x^{-1/3}`", why:"The `{2}/{3}` multiplies." }],
          hints:["Power rule: `nx^{n - 1}`.", "`n = {2}/{3}`, so `n - 1 = -{1}/{3}`.", "`{2}/{3}x^{-1/3} = {2}/{3∛x}`."] },
        { id:"w2", skill:"Rational exponents", goal:2, prompt:"For which `x` is `{2}/{3∛x}` undefined?",
          options:[
            { t:"`x = 0`", ok:true, why:"The denominator is 0 only when `∛x = 0`." },
            { t:"`x < 0`", why:"`∛{-8} = -2`." },
            { t:"No `x`", why:"Division by 0 at `x = 0`." },
            { t:"`x = {2}/{3}`", why:"Look for a zero denominator." }],
          hints:["When is a fraction undefined?", "When `∛x = 0`.", "`x = 0`."] },
        { id:"w3", skill:"Solving f′ = 0", goal:1, prompt:"Solve `3x^2 - 12 = 0`.",
          options:[
            { t:"`x = -2` or `x = 2`", ok:true, why:"`x^2 = 4`." },
            { t:"`x = 2`", why:"`(-2)^2 = 4` too." },
            { t:"`x = ±2√3`", why:"`3x^2 = 12` gives `x^2 = 4`." },
            { t:"`x = 4`", why:"That’s `x^2`, not `x`." }],
          hints:["Isolate `x^2`.", "`x^2 = 4`.", "±2."] },
        { id:"w4", skill:"Solving f′ = 0", goal:1, prompt:"Solve `4x^3 - 12x^2 = 0`.",
          options:[
            { t:"`x = 0` or `x = 3`", ok:true, why:"`4x^2(x - 3) = 0`." },
            { t:"`x = 3`", why:"That loses `x = 0`." },
            { t:"`x = 0`, 3 or −3", why:"`4x^2 = 0` only at 0." },
            { t:"`x = 12`", why:"Factor out `4x^2` first." }],
          hints:["Common factor?", "`4x^2(x - 3)`.", "0 or 3."] },
        { id:"w5", skill:"Sign of a factored expression", goal:3, prompt:"What is the sign of `(x + 1)(x - 4)` when `x = 2`?",
          options:[
            { t:"Negative", ok:true, why:"`(3)(-2) = -6`." },
            { t:"Positive", why:"Substitute: 3 × (−2)." },
            { t:"Zero", why:"The zeros are −1 and 4." },
            { t:"It depends on the leading coefficient.", why:"Here the leading coefficient is 1." }],
          hints:["Substitute `x = 2`.", "`(2 + 1)(2 - 4)`.", "3 × (−2) < 0."] },
        { id:"w6", skill:"Sign of a factored expression", goal:3, prompt:"On which intervals is `x^2(x - 5)` negative?",
          options:[
            { t:"`(-∞, 0)` and `(0, 5)`", ok:true, why:"`x^2 > 0` except at 0, so the sign follows `x - 5`." },
            { t:"`(0, 5)`", why:"Try `x = -1`: `(1)(-6) < 0`." },
            { t:"`(-∞, 0)`", why:"Try `x = 1`: `(1)(-4) < 0`." },
            { t:"`(5, ∞)`", why:"At `x = 6`: 36 × 1 > 0." }],
          hints:["Can `x^2` be negative?", "So the sign is the sign of `x - 5` (when `x ≠ 0`).", "Negative for `x < 5`, except `x = 0`."] }
      ],
      refreshers:{
        "Rational exponents":"`{d}/{dx} x^{p/q} = {p}/{q}x^{p/q - 1}`. A negative exponent means a denominator: `x^{-1/3} = {1}/{∛x}`, undefined at 0.",
        "Solving f′ = 0":"Factor; never divide by a variable factor. Each factor set to 0 gives a candidate.",
        "Sign of a factored expression":"Test one value in each interval between zeros. Even powers never change sign; odd powers do."
      }
    }
  },
  explore:{
    heading:"Critical point classifier",
    intro:"Pick a function. Find where the tangent is flat or where no tangent slope exists, zoom in to see what’s happening, and use the signs of `f′` to classify each point.",
    fns:[
      { id:"F1", chip:"F1 `x^3 - 3x`" },
      { id:"F2", chip:"F2 `x^3`" },
      { id:"F3", chip:"F3 `|x^2 - 4|`" },
      { id:"F4", chip:"F4 `x^{2/3}`" },
      { id:"F5", chip:"F5 `x^{1/3}`" },
      { id:"F6", chip:"F6 `x^4 - 4x^3`" },
      { id:"F7", chip:"F7 `x + {4}/{x}`" },
      { id:"F8", chip:"F8 `x^{2/3}(x - 5)`", lock:"unlocks after challenge 1" }
    ],
    modes:[{ id:"probe", t:"Probe" }, { id:"zoom", t:"Zoom" }, { id:"classify", t:"Classify" }, { id:"build", t:"Build" }],
    modeHow:{
      probe:"Drag along either graph, or use the probe slider (arrows move it by 0.05, Shift + arrow by 0.5). The tangent and the value of `f′` follow the probe.",
      zoom:"Tap a critical point (on the graph or with its button), then zoom in from ×1 to ×1000. Smooth points straighten out; corners and cusps never do.",
      classify:"Build the sign chart of `f′` below the graphs: tap the critical numbers, choose + or − on each interval, then classify each critical number. Press <strong>Check my chart</strong>.",
      build:"Choose `a`, `b`, `c` and `d` in `f(x) = ax^3 + bx^2 + cx + d`. The critical points are found and classified for you."
    },
    rows:{ f:"`f(x)`", d:"`f′(x)`", probe:"Probe", crit:"Critical numbers", nd:"Not in the domain", sign:"Sign of `f′`", cls:"Classification", zoom:"Window" },
    txt:{
      zero:"`f′ = 0`", dne:"`f′` does not exist", corner:"corner", cusp:"cusp", vtan:"vertical tangent", none:"none",
      ndRow:"`x = #1` is not in the domain: not critical",
      probeVal:"`x = #1`, `f′(#1) = #2`", probeApprox:"`x = #1`, `f′(#1) ≈ #2`",
      probeDne:"`x = #1`: `f′` does not exist here (#2)", probeNd:"`x = #1` is not in the domain of `f`",
      signOn:"#1 on #2", every:"every `x` (`f` is constant)", noCrit:"none: `f′` is never 0",
      local:{ max:"local maximum", min:"local minimum", neither:"neither" },
      notYet:"<span class=\"muted\">Not classified yet: build the chart in Classify mode.</span>",
      findIt:"<span class=\"muted\">Find them in the chart below the graphs.</span>",
      zoomOn:"×#1 around #2", zoomPick:"Zoom in on", zoomLabel:"Zoom", probeLabel:"Probe `x`",
      noTan:"no single tangent", vTan:"vertical tangent", ndLabel:"not in the domain",
      key:"Top: `f` with its tangent at the probe. Bottom: `f′`. Diamonds mark the critical numbers: hollow until you classify them.",
      buildLabel:"Coefficients (whole numbers from −6 to 6)",
      chart:{
        title:"Sign chart of `f′`", pick:"Critical numbers: tap to add or remove", check:"Check my chart", clear:"Clear",
        rowX:"`x`", rowTest:"test value", rowSign:"sign of `f′`", rowF:"`f`", nd:"not in the domain", und:"undefined", notZero:"≠ 0",
        kinds:{ max:"local max", min:"local min", neither:"neither" }, unset:"?", how:"Tap a sign or a classification to change it.",
        valTitle:"The local minimum value", valHow:"Type `f(2) = □∛□`: the number in front, then the number under the cube root.",
        mNd:M2("#1"), mMissDne:M1, mMissZero:"`f′(#1) = 0`, so `x = #1` is a critical number.",
        mExtra:"`f′(#1)` exists and isn’t 0, so `x = #1` isn’t a critical number.",
        mSignBlank:"Choose + or − for every interval.", mSign:"Check the sign on #1. " + M6,
        mArrowBlank:"Choose ↗ or ↘ for every interval.", mArrow:"Where `f′ > 0`, `f` is increasing (↗); where `f′ < 0`, it’s decreasing (↘).",
        mKindBlank:"Classify every critical number: local max, local min or neither.",
        mNeither:"At `x = #1`, `f′` doesn’t change sign. `f′` must <strong>change sign</strong> for a max or min, so there’s neither.",
        mMax:M4, mMin:M4m, mExt:"`f′` changes sign at `x = #1`, so there is a local maximum or minimum there.",
        mVal:"Your chart is right. Now type the local minimum value `f(2)` in the □∛□ box.",
        mValBad:"Not quite: `f(2) = 2^{2/3}(2 - 5)`, and `2^{2/3} = ∛4`.",
        good:"<strong>✓ Chart complete.</strong> The diamonds on the graphs are now filled in and labelled."
      }
    },
    predIntro:"Make a prediction first. Then the classifier shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"F2 `x^3`. `f′(0) = 0`. What happens at `x = 0`?",
        options:[{ t:"Neither: the graph flattens but keeps rising", ok:true }, { t:"A local minimum" }, { t:"A local maximum" }, { t:"`f′` doesn’t exist there" }],
        explain:"`f′ = 3x^2` is positive on both sides of 0. No sign change, no max or min." },
      { id:"p2", prompt:"F4 `x^{2/3}`. Is there a critical number at `x = 0`?",
        options:[{ t:"Yes: `f′` doesn’t exist there (a cusp)", ok:true }, { t:"No: `f′` is never 0" }, { t:"Yes: `f′(0) = 0`" }, { t:"No: 0 isn’t in the domain" }],
        explain:"`f′ = {2}/{3∛x}` is undefined at 0, but `f(0) = 0` exists. That makes 0 critical, and it’s a local minimum." },
      { id:"p3", prompt:"F7 `x + {4}/{x}`. `f′(x) = {x^2 - 4}/{x^2}` is undefined at `x = 0`. Is 0 a critical number?",
        options:[{ t:"No: 0 isn’t in the domain of `f`", ok:true }, { t:"Yes: `f′` doesn’t exist there" }, { t:"Yes: it’s a local maximum" }, { t:"Yes: it’s a local minimum" }],
        explain:"Critical numbers must be in the domain. `x = 0` is an asymptote; it still divides the sign chart." },
      { id:"p4", prompt:"F3 `|x^2 - 4|`, zoomed on (2, 0). As you zoom in on (2, 0), what will the graph look like?",
        options:[{ t:"A sharp corner that never straightens", ok:true }, { t:"A straight line" }, { t:"A horizontal segment" }, { t:"A smooth U" }],
        explain:"Smooth graphs look straight when you zoom in. A corner never does: the left and right slopes are −4 and 4, so `f′(2)` doesn’t exist." }
    ],
    chalIntro:"Use the classifier to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"In Classify mode, find and classify every critical number of F6, `f(x) = x^4 - 4x^3`.",
        why:"`f′ = 4x^2(x - 3)`: − on `(-∞, 0)`, − on `(0, 3)`, + on `(3, ∞)`. Neither at 0, and a local minimum at (3, −27). F8 is now unlocked.",
        hints:["Factor `f′`.", "`f′ = 4x^2(x - 3)`. Test `x = -1`, 1 and 4.", "− on `(-∞, 0)`, − on `(0, 3)`, + on `(3, ∞)`: neither at 0, a local minimum at (3, −27)."],
        msgs:{ fn:"Choose F6 and build its chart in Classify mode.",
          zeroExt:"`f′ = 4x^2(x - 3)` is negative on both sides of 0. No sign change.",
          miss0:"`4x^2 = 0` at `x = 0`. A squared factor still gives a critical number.",
          crit:"The critical numbers of F6 are where `f′ = 4x^3 - 12x^2` is 0. Check your chart’s list.",
          kind:"Classify each critical number using the signs of `f′` on each side." } },
      { id:"tc2", goal:[2, 3], prompt:"Add the function `f(x) = x^{2/3}(x - 5)` (chip F8, unlocked by challenge 1). Find and classify every critical number, and type the local minimum value in the □∛□ box under the chart.",
        why:"Critical numbers 0 and 2; signs + | − | +: a max at (0, 0) and a min at (2, −3∛4).",
        hints:["Write `f = x^{5/3} - 5x^{2/3}` and differentiate.", "`f′ = {5}/{3}x^{2/3} - {10}/{3}x^{-1/3} = {5(x - 2)}/{3∛x}`.", "Critical numbers 0 and 2; signs + | − | +: a max at (0, 0) and a min at (2, −3∛4)."],
        msgs:{ lock:"Meet challenge 1 first: it unlocks F8.", fn:"Choose F8 and build its chart in Classify mode.",
          only2:"`f′ = {5(x - 2)}/{3∛x}` is undefined at 0, and 0 is in the domain.",
          min0:"`f′` is + just left of 0 (numerator −, denominator −) and − just right of 0.",
          crit:"Find every critical number of F8: where `f′` is 0 and where it doesn’t exist.",
          kind:"Classify each critical number using the signs of `f′` on each side.",
          val:"Type the local minimum value `f(2)` in the □∛□ box.", valBad:"Not quite: `f(2) = 2^{2/3}(2 - 5)`, and `2^{2/3} = ∛4`." } },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Build mode: choose `a`, `b`, `c`, `d` (sliders −6 to 6, step 1) so that `f(x) = ax^3 + bx^2 + cx + d` has a <strong>local maximum at (−1, 6)</strong> and a <strong>local minimum at (1, 2)</strong>.",
        why:"`f′ = 3a(x^2 - 1)` makes `b = 0` and `c = -3a`; then `2a + d = 6` and `-2a + d = 2` give `a = 1` and `d = 4`: `f = x^3 - 3x + 4`.",
        hints:["`f′` must be 0 at `x = -1` and `x = 1`, so `f′ = 3a(x^2 - 1)`.", "That makes `b = 0` and `c = -3a`. Now `f(-1) = 2a + d` and `f(1) = -2a + d`.", "`2a + d = 6` and `-2a + d = 2` give `a = 1` and `d = 4`: `f = x^3 - 3x + 4`."],
        msgs:{ shift:"The critical numbers are right, but `f(-1) = #1`. Shift the graph #2.", up:"up", down:"down",
          neg:"With `a < 0` the maximum is on the right: this has a min at −1 and a max at 1.",
          c1:"`f′ = 3x^2 - 1` has zeros `±{1}/{√3}`, not ±1.",
          general:"Make `f′` zero at `x = -1` and `x = 1` first, then fix the heights." } }
    ]
  },
  part3:{
    slug:"test", name:"Test it",
    heading:"Test it",
    intro:"In Explore you found and classified points with a probe and zoom. Here you carry out the first derivative test the way you’ll write it, as a table, on polynomials and rational functions. Then you run it backwards. Finish with the quick check.",
    chart:{ pick:"Critical numbers: tap to add or remove", check:"Check the table", rowX:"`x`", rowTest:"test value", rowSign:"sign of `f′`", rowF:"`f`",
      testAt:"`x = #1`", how:"Tap a sign, an arrow or a classification to change it." },
    s1:{ title:"Station 1: The test table (polynomial)",
      text:"`f(x) = 3x^4 - 4x^3 - 12x^2 + 5`, so `f′(x) = 12x^3 - 12x^2 - 24x`.",
      step1:"<strong>Step 1.</strong> Factor `f′`: fill in the coefficients.",
      step2:"<strong>Step 2.</strong> Place the critical numbers on the chart, test one value in each interval, choose the sign of `f′` and an arrow, then classify each critical number.",
      check:"Check the factors",
      f:{ pre:"`f′(x) =`", mid1:"`x(x -`", mid2:"`)(x +`", post:"`)`" },
      fGood:"<strong>✓ Right:</strong> `f′(x) = 12x(x - 2)(x + 1)`. Its zeros are the critical numbers.",
      fFill:"Fill in all three boxes with whole numbers.",
      fCommon:"Take out the common factor `12x` first: `12x^3 - 12x^2 - 24x = 12x(x^2 - x - 2)`.",
      fSwap:"`(x - 1)(x + 2) = x^2 + x - 2`, but you need `x^2 - x - 2`. Swap the numbers.",
      fPair:"Factor `x^2 - x - 2`: find two numbers that multiply to −2 and add to −1.",
      result:"<strong>✓ First derivative test done:</strong> local min (−1, 0), local max (0, 5), local min (2, −27).",
      alg:["`f(-1) = 3 + 4 - 12 + 5 = 0`", "`f(0) = 5`", "`f(2) = 48 - 32 - 48 + 5 = -27`"],
      graph:"Graph of `f(x) = 3x^4 - 4x^3 - 12x^2 + 5` with the three critical points." },
    s2:{ title:"Station 2: The test table (rational)",
      tabs:[{ id:"r1", t:"`x + {4}/{x}`" }, { id:"r2", t:"`{x}/{x^2 + 4}`" }],
      r1:{ text:"`f(x) = x + {4}/{x}`, so `f′(x) = {(x - 2)(x + 2)}/{x^2}`. The chart already has `x = 0` as a boundary: it isn’t in the domain.",
        result:"<strong>✓ Signs + | − | − | +:</strong> a local max at (−2, −4) and a local min at (2, 4)." },
      r2:{ text:"`f(x) = {x}/{x^2 + 4}`, so `f′(x) = {4 - x^2}/{(x^2 + 4)^2}`.",
        result:"<strong>✓ Signs − | + | −:</strong> a local min at `(-2, -{1}/{4})` and a local max at `(2, {1}/{4})`." },
      callout:"The local max is lower than the local min. How?", reveal:"Show the answer",
      because:"They’re on different branches. Local means ‘compared with nearby points’.",
      graphHow:"The graph appears when your table is right." },
    s3:{ title:"Station 3: Run it backwards",
      text:"Here is `f′(x) = (x + 1)^2(x - 2)`. Tap the sketch that could be `f`.",
      sketches:[
        { id:"a", ok:true, aria:"Sketch: falls, levels off for a moment at x = −1 and keeps falling, then turns up at a minimum at x = 2.",
          fb:"<strong>✓ Right.</strong> `(x + 1)^2` never changes sign, so `f` levels off at −1 and keeps falling; `f′` goes from − to + at 2: a minimum." },
        { id:"b", aria:"Sketch: a maximum at x = −1 and a minimum at x = 2.",
          fb:"`(x + 1)^2` doesn’t change sign at −1, so there’s no maximum there." },
        { id:"c", aria:"Sketch: a minimum at x = −1 and a maximum at x = 2.",
          fb:"`f′` goes from − to + at 2, so `f` has a minimum there, not a maximum. And `(x + 1)^2` doesn’t change sign at −1." },
        { id:"d", aria:"Sketch: a minimum at x = −1 and a minimum at x = 2.",
          fb:"Two minimums need a maximum between them, but `f′` is only 0 at −1 and 2. And `(x + 1)^2` doesn’t change sign at −1." }],
      shift:"Shift the sketch up or down", shiftNote:"Every one of these has the same `f′`. Infinitely many graphs fit." },
    quickCheck:{
      title:"Quick check", summary:"Test it quick check",
      items:[
        { id:"q1", goal:1, prompt:"Critical numbers of `f(x) = x^3 - 27x`?",
          choices:[
            { t:"±3", ok:true, fb:"Right. `3x^2 - 27 = 0` gives `x^2 = 9`." },
            { t:"3", fb:"`3x^2 - 27 = 0` gives `x^2 = 9`." },
            { t:"±3√3", fb:"`3x^2 - 27 = 0` gives `x^2 = 9`." },
            { t:"0, ±3", fb:"`3x^2 - 27 = 0` gives `x^2 = 9`." }] },
        { id:"q2", goal:3, prompt:"`f′` is − on `(-∞, 1)` and + on `(1, ∞)`. At `x = 1`, `f` has …",
          choices:[
            { t:"a local min", ok:true, fb:"Right. Falling then rising makes a valley." },
            { t:"a local max", fb:"Falling then rising makes a valley." },
            { t:"neither", fb:"Falling then rising makes a valley." },
            { t:"a vertical asymptote", fb:"Falling then rising makes a valley." }] },
        { id:"q3", goal:[3, 4], prompt:"`f′(x) = (x - 3)^2(x + 2)`. How many local extrema?",
          choices:[
            { t:"1", ok:true, fb:"Right. Only `x = -2` changes sign; `(x - 3)^2` doesn’t." },
            { t:"2", fb:"Only `x = -2` changes sign; `(x - 3)^2` doesn’t." },
            { t:"0", fb:"Only `x = -2` changes sign; `(x - 3)^2` doesn’t." },
            { t:"3", fb:"Only `x = -2` changes sign; `(x - 3)^2` doesn’t." }] },
        { id:"q4", goal:2, prompt:"`f(x) = {1}/{x - 4}`. Is `x = 4` a critical number?",
          choices:[
            { t:"No, it’s not in the domain", ok:true, fb:"Right. Critical numbers must be in the domain." },
            { t:"Yes, `f′` doesn’t exist", fb:"Critical numbers must be in the domain." },
            { t:"Yes, it’s a max", fb:"Critical numbers must be in the domain." },
            { t:"Yes, it’s a min", fb:"Critical numbers must be in the domain." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"What happens at this `x`?", summary:"What happens at this x?", noun:"function", goal:[1, 2, 3, 5],
        instruction:"Decide what happens at the given `x`. Tap an item, then tap its box.",
        how:"Tap an item, then tap the box it belongs in.",
        boxes:[{ id:"max", label:"Local max" }, { id:"min", label:"Local min" }, { id:"nei", label:"Critical, but neither" }, { id:"nc", label:"Not a critical number" }],
        items:[
          sortItem("i1", "`f(x) = x^2 - 6x`, at `x = 3`", "min", "`f′ = 2x - 6`: − then +.", { goal:3 }),
          sortItem("i2", "`f(x) = 12x - x^3`, at `x = 2`", "max", "`f′ = 12 - 3x^2` is + just left of 2 and − just right.", { goal:3 }),
          sortItem("i3", "`f(x) = x^3 + 2`, at `x = 0`", "nei", "`f′ = 3x^2 ≥ 0` on both sides.", { goal:3 }),
          sortItem("i4", "`f(x) = |x + 4|`, at `x = -4`", "min", "A corner: `f′` doesn’t exist, and the graph goes down then up.", { goal:2 }),
          sortItem("i5", "`f(x) = x^{1/3}`, at `x = 0`", "nei", "A vertical tangent: `f′` doesn’t exist, but `f` keeps increasing.", { goal:[2, 5] }),
          sortItem("i6", "`f(x) = {1}/{x - 1}`, at `x = 1`", "nc", "`x = 1` isn’t in the domain.", { goal:2 }),
          sortItem("i7", "`f(x) = -(x - 2)^{2/3}`, at `x = 2`", "max", "An upside-down cusp: `f′` doesn’t exist; up then down.",
            { goal:[2, 5], hints:["Differentiate: `f′ = -{2}/{3}(x - 2)^{-1/3}`.", "Undefined at 2. Test `x = 1` and `x = 3`.", "`f′(1) = {2}/{3} > 0`, `f′(3) = -{2}/{3} < 0`: a local max."] }),
          sortItem("i8", "`f(x) = x^3 - 3x^2`, at `x = 1`", "nc", "`f′(1) = 3 - 6 = -3 ≠ 0`. The critical numbers are 0 and 2.", { goal:1 }),
          sortItem("i9", "`f′(x) = (x - 5)^2(x + 1)`, at `x = 5`", "nei", "`(x - 5)^2` doesn’t change sign.",
            { goal:3, hints:["Which factor changes sign at 5?", "Neither: `(x - 5)^2 ≥ 0` and `x + 1 > 0` near 5.", "`f′ > 0` on both sides: neither."] }),
          sortItem("i10", "`f′(x) = (x - 5)^2(x + 1)`, at `x = -1`", "min", "Just left of −1, `f′ < 0`; just right, `f′ > 0`.", { goal:3 })
        ],
        wrongDefault:"Find `f′`, check where it is 0 or doesn’t exist, then test its sign on each side." },
      { id:"design", type:"custom", title:"Find and design", summary:"Find and design", star:true, goal:[2, 5, 6],
        instruction:"Find the missing values, count and classify extrema, and design functions. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type numbers (fractions such as 1/2 are fine). Where a box asks for every `x`, separate values with commas, or type “none”. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type numbers only, such as −3, 1/2 or −1, 4 (or “none”).", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:6, prompt:"`f(x) = x^3 + kx` has critical numbers ±3. Find `k`.",
            boxes:[{ k:"k", pre:"`k =`" }], answer:{ k:-27 }, display:"`k = -27`",
            wrong:[{ k:"k", eq:27, fb:"`f′ = 3x^2 + k = 0` at `x = 3` gives `k = -27`." }],
            why:"`f′ = 3x^2 + k = 0` at `x = 3`: `27 + k = 0`." },
          { id:"s2", goal:[5, 6], prompt:"`f(x) = x^2 + {a}/{x}` has a critical number at `x = 2`. Find `a`.",
            boxes:[{ k:"a", pre:"`a =`" }], answer:{ a:16 }, display:"`a = 16`",
            wrong:[{ k:"a", eq:4, fb:"`f′ = 2x - {a}/{x^2}`; `4 - {a}/{4} = 0`." }],
            why:"`f′ = 2x - {a}/{x^2}`, so `f′(2) = 4 - {a}/{4} = 0`." },
          { id:"s3", goal:[3, 4], star:true, prompt:"`f′(x) = (x + 2)^3(x - 1)^2(x - 4)`. How many local extrema does `f` have, and of which kind?",
            boxes:[{ k:"n", pre:"Number of local extrema:" }, { k:"max", pre:"Local max at `x =`", list:true }, { k:"min", pre:"Local min at `x =`", list:true }],
            answer:{ n:2, max:[-2], min:[4] }, display:"2: a local max at −2, a local min at 4",
            wrong:[{ k:"n", eq:3, fb:"`(x - 1)^2` has even power: no sign change at 1." }, { any:1, fb:"`(x - 1)^2` has even power: no sign change at 1." }],
            why:"Signs + | − | − | +: `(x + 2)^3` changes sign at −2, `(x - 1)^2` doesn’t change sign at 1, and `x - 4` changes sign at 4." },
          { id:"s4", goal:[2, 5], star:true, prompt:"Classify every critical point of `f(x) = x - 3x^{1/3}`.",
            boxes:[{ k:"max", pre:"Local max at", pt:true }, { k:"min", pre:"Local min at", pt:true }, { k:"nei", pre:"Critical, but neither: `x =`", list:true }],
            answer:{ max:[-1, 2], min:[1, -2], nei:[0] }, display:"local max (−1, 2); local min (1, −2); `x = 0` neither",
            wrong:[{ k:"nei", missing:0, fb:"Missing 0: `f′ = {x^{2/3} - 1}/{x^{2/3}}` is undefined at 0, in the domain." }],
            why:"Signs + | − | − | +: max (−1, 2), neither at 0, min (1, −2).",
            hints:["`f′ = 1 - x^{-2/3}`.", "Common denominator: `{x^{2/3} - 1}/{x^{2/3}}`. Zero when `x^{2/3} = 1`, so `x = ±1`; undefined at 0.", "Signs + | − | − | +: max (−1, 2), neither at 0, min (1, −2)."] },
          { id:"s5", goal:6, star:true, prompt:"`f(x) = x^3 + bx^2 + cx + d` has a local max at `x = 1` and a local min at (5, −20). Find `b`, `c` and `d`.",
            boxes:[{ k:"b", pre:"`b =`" }, { k:"c", pre:"`c =`" }, { k:"d", pre:"`d =`" }], answer:{ b:-9, c:15, d:5 }, display:"`b = -9`, `c = 15`, `d = 5`",
            wrong:[{ k:"d", eq:-20, fb:"`f(5) = 125 - 225 + 75 + d = -25 + d`." }],
            why:"`f′ = 3(x - 1)(x - 5) = 3x^2 - 18x + 15`, so `b = -9` and `c = 15`; `f(5) = -25 + d = -20`." },
          { id:"s6", goal:[4, 6], star:true, prompt:"For which values of `k` does `f(x) = x^3 + kx^2 + 3x` have <strong>no</strong> local extrema? Enter your answer as an interval.",
            boxes:[{ k:"iv", pre:"`k` in", iv:true }], answer:{ iv:{ a:-3, b:3, aIn:true, bIn:true } }, display:"`-3 ≤ k ≤ 3`",
            wrong:[{ k:"iv", open:true, fb:"At `k = ±3`, `f′ = 3(x ± 1)^2 ≥ 0`: no sign change, so no extremum. Include the endpoints." }],
            why:"No extrema means `f′ = 3x^2 + 2kx + 3` never changes sign: the discriminant `4k^2 - 36 ≤ 0`.",
            hints:["No extrema means `f′` never changes sign.", "`f′ = 3x^2 + 2kx + 3` must not have two different roots.", "Discriminant `4k^2 - 36 ≤ 0`: `-3 ≤ k ≤ 3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Uma", how:"", goal:[2, 4, 5],
        instruction:"Uma made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find and classify the critical points of `f(x) = 3x^{2/3} - x`.",
            steps:["`f′(x) = 2x^{-1/3} - 1`.", "`f′ = 0`: `{2}/{∛x} = 1`, so `∛x = 2` and `x = 8`.", "So the only critical number is `x = 8`.", "`f′` is + before 8 and − after, so there’s a local max at (8, 4)."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is fine, but something was missed before it."],
            fixes:[
              { t:"`f′ = {2 - ∛x}/{∛x}` is also undefined at `x = 0`, which is in the domain. So 0 is critical too: `f′` is − then +, a local min at (0, 0).", ok:true, why:"`x = 0` is critical: a local min (a cusp)." },
              { t:"`x = -8` is also critical.", why:"`f′(-8) = {2}/{-2} - 1 = -2 ≠ 0`." },
              { t:"Step 3 is correct: critical numbers come only from `f′ = 0`.", why:M1 },
              { t:"`x = 8` isn’t critical, because `f(8) ≠ 0`.", why:"Critical numbers come from `f′`, not `f`." }],
            hints:["Is there an `x` where `f′` doesn’t exist?", "`x^{-1/3} = {1}/{∛x}`.", "`x = 0` is critical: a local min (a cusp)."] },
          { id:"e2", goal:4, task:"Classify the critical points of `f(x) = 3x^5 - 5x^3`.",
            steps:["`f′ = 15x^4 - 15x^2` `= 15x^2(x - 1)(x + 1)`.", "Critical numbers: −1, 0, 1.", "Signs of `f′`: + on `(-∞, -1)`, − on `(-1, 0)`, − on `(0, 1)`, + on `(1, ∞)`.", "`f′(0) = 0`, so there’s a turning point at `x = 0`: a local min at (0, 0).", "Local max at (−1, 2), local min at (1, −2)."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct. Check what’s concluded from it.", "", "Step 5 is right. The mistake is earlier."],
            fixes:[
              { t:"`f′` is negative on both sides of 0, so `x = 0` is neither a max nor a min.", ok:true, why:"No sign change: neither." },
              { t:"It’s a local max at (0, 0).", why:"That needs + then −." },
              { t:"`x = 0` isn’t a critical number.", why:"`f′(0) = 0`, so it is critical." },
              { t:"Step 4 is correct.", why:"`f′` must <strong>change sign</strong>. Here it’s − on both sides of 0, so there’s neither." }],
            hints:["What does step 3 say about the signs around 0?", "− and −.", "No sign change: neither."] },
          { id:"e3", goal:5, task:"Find the local extrema of `f(x) = {x^2}/{x - 1}`.",
            steps:["Quotient rule: `f′(x) = {x(x - 2)}/{(x - 1)^2}`.", "`f′ = 0` at 0 and 2; `f′` is undefined at 1. Critical numbers: 0, 1, 2.", "Signs: + | − | − | +. So a max at 0 and a min at 2."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3’s signs and conclusions are right."],
            fixes:[
              { t:"`x = 1` isn’t in the domain of `f` (it’s a vertical asymptote), so the critical numbers are only 0 and 2: a local max (0, 0) and a local min (2, 4).", ok:true, why:"Only 0 and 2 are critical." },
              { t:"`x = 1` is a local min.", why:"`f` doesn’t exist there." },
              { t:"Also `x = -1`.", why:"`f′(-1) ≠ 0`." },
              { t:"Step 2 is correct.", why:M2("1") }],
            hints:["Is `f(1)` defined?", "No: `{1}/{0}`.", "Only 0 and 2 are critical."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the classifier: the cusp that counts as a minimum, or the local max that sits below a local min?" },
      { id:"j2", q:"In your own words, what makes a number critical, and why isn’t every critical number a max or min?" },
      { id:"j3", q:"Explain to a friend how the first derivative test works, using a sign chart." },
      { id:"j4", q:"Which kind of critical point is still tricky for you (corner, cusp, vertical tangent, asymptote)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What are the critical numbers of `f(x) = x^3 - 12x + 1`?", options:[
          { t:"`x = -2` and `x = 2`", ok:true, why:"`f′ = 3x^2 - 12 = 3(x - 2)(x + 2)`." },
          { t:"`x = 2` only", why:"`(-2)^2 = 4` too." },
          { t:"`x = -2√3` and `x = 2√3`", why:"That solves `x^2 = 12`: divide by 3 first." },
          { t:"`x = 0`, −2 and 2", why:"`f′(0) = -12 ≠ 0`." }] },
        b:{ prompt:"What are the critical numbers of `f(x) = x^3 - 27x + 4`?", options:[
          { t:"`x = -3` and `x = 3`", ok:true, why:"`f′ = 3(x - 3)(x + 3)`." },
          { t:"`x = 3` only", why:"`(-3)^2 = 9` too." },
          { t:"`x = -3√3` and `x = 3√3`", why:"Divide by 3 first." },
          { t:"`x = 0`, −3 and 3", why:"`f′(0) = -27 ≠ 0`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is a critical number of `f(x) = (x - 3)^{2/3}`?", options:[
          { t:"`x = 3`, where `f′` doesn’t exist", ok:true, why:"`f′ = {2}/{3∛{x - 3}}` is undefined at 3, and `f(3) = 0`." },
          { t:"None, because `f′` is never 0.", why:M1 },
          { t:"`x = -3`", why:"`x - 3 = 0` at `x = 3`." },
          { t:"`x = 0`", why:"`f′(0) = {2}/{3∛{-3}} ≠ 0` and exists." }] },
        b:{ prompt:"Which is a critical number of `f(x) = (x + 2)^{1/3} + 1`?", options:[
          { t:"`x = -2`, where `f′` doesn’t exist", ok:true, why:"`f′ = {1}/{3(x + 2)^{2/3}}` is undefined at −2 (a vertical tangent)." },
          { t:"None, because `f′` is never 0.", why:M1 },
          { t:"`x = 2`", why:"`x + 2 = 0` at −2." },
          { t:"`x = -1`", why:"That’s where `f = 0`, not where `f′` fails." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`f′` is negative on `(-∞, 4)` and positive on `(4, ∞)`. What does `f` have at `x = 4`?", options:[
          { t:"A local minimum", ok:true, why:"Falling then rising." },
          { t:"A local maximum", why:M4m },
          { t:"Neither, because `f′(4)` might not be 0", why:"If `f′` changes sign and `f(4)` exists, there’s an extremum either way." },
          { t:"A point where `f` is undefined", why:"Nothing says that." }] },
        b:{ prompt:"`f′` is positive on `(-∞, -1)` and negative on `(-1, ∞)`. What does `f` have at `x = -1`?", options:[
          { t:"A local maximum", ok:true, why:"Rising then falling." },
          { t:"A local minimum", why:M4 },
          { t:"Neither, because `f′(-1)` might not be 0", why:"If `f′` changes sign and `f(-1)` exists, there’s an extremum either way." },
          { t:"A point where `f` is undefined", why:"Nothing says that." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Classify the critical points of `f(x) = 3x^4 - 8x^3`.", options:[
          { t:"Neither at `x = 0`; a local minimum at (2, −16)", ok:true, why:"`f′ = 12x^2(x - 2)`: − | − | +." },
          { t:"A local max at (0, 0) and a local min at (2, −16)", why:"`f′` doesn’t change sign at 0." },
          { t:"A local min at (2, −16) only, because 0 isn’t a critical number", why:"`f′(0) = 0`, so 0 is critical; it just isn’t an extremum." },
          { t:"Neither at 0; a local maximum at (2, −16)", why:"`f′` goes from − to + at 2: " + M4m }] },
        b:{ prompt:"Classify the critical points of `f(x) = 3x^4 + 4x^3`.", options:[
          { t:"A local minimum at (−1, −1); neither at `x = 0`", ok:true, why:"`f′ = 12x^2(x + 1)`: − | + | +." },
          { t:"A local min at (−1, −1) and a local max at (0, 0)", why:"`f′` doesn’t change sign at 0." },
          { t:"A local min at (−1, −1) only, because 0 isn’t a critical number", why:"`f′(0) = 0`, so 0 is critical; it just isn’t an extremum." },
          { t:"A local maximum at (−1, −1); neither at 0", why:"`f′` goes from − to + at −1: " + M4m }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Which statement about `f(x) = x^{1/3}(x + 4)` is true?", options:[
          { t:"Local min at (−1, −3); `x = 0` is critical but neither", ok:true, why:"`f′ = {4(x + 1)}/{3x^{2/3}}`: − | + | +, undefined at 0." },
          { t:"The only critical number is −1, a local minimum", why:"`f′` is undefined at 0, and 0 is in the domain. " + M1 },
          { t:"Local min at (−1, −3) and local max at (0, 0)", why:"`f′` is + on both sides of 0: no sign change, so neither." },
          { t:"Local max at (−1, −3); `x = 0` isn’t critical", why:"`f′` goes from − to + at −1 (a minimum), and 0 is critical because `f′` doesn’t exist there." }] },
        b:{ prompt:"Which statement about `f(x) = x^{1/3}(x - 4)` is true?", options:[
          { t:"Local min at (1, −3); `x = 0` is critical but neither", ok:true, why:"`f′ = {4(x - 1)}/{3x^{2/3}}`: − | − | +." },
          { t:"The only critical number is 1, a local minimum", why:"`f′` is undefined at 0, and 0 is in the domain. " + M1 },
          { t:"Local min at (1, −3) and local max at (0, 0)", why:"`f′` is − on both sides of 0: no sign change, so neither." },
          { t:"Local max at (1, −3); `x = 0` isn’t critical", why:"`f′` goes from − to + at 1 (a minimum), and 0 is critical because `f′` doesn’t exist there." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which is true for `f(x) = x + {9}/{x}`?", options:[
          { t:"Local max (−3, −6) and local min (3, 6)", ok:true, why:"`f′ = {(x - 3)(x + 3)}/{x^2}`: + | − | − | +, with 0 not in the domain." },
          { t:"Local min (−3, −6) and local max (3, 6)", why:"A local max can be lower than a local min on another branch." },
          { t:"Critical numbers −3, 0 and 3, with a local max at 0", why:M2("0") },
          { t:"Critical numbers ±9", why:"`1 - {9}/{x^2} = 0` gives `x^2 = 9`." }] },
        b:{ prompt:"Which is true for `f(x) = 4x + {1}/{x}`?", options:[
          { t:"Local max `(-{1}/{2}, -4)` and local min `({1}/{2}, 4)`", ok:true, why:"`f′ = {4x^2 - 1}/{x^2}`." },
          { t:"Local min `(-{1}/{2}, -4)` and local max `({1}/{2}, 4)`", why:"A local max can be lower than a local min on another branch." },
          { t:"Critical numbers `-{1}/{2}`, 0 and `{1}/{2}`, with a local max at 0", why:M2("0") },
          { t:"Critical numbers `±{1}/{4}`", why:"`4x^2 = 1` gives `x^2 = {1}/{4}`, so `x = ±{1}/{2}`." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"A student says: “`f′(2) = 0`, so `f` has a max or a min at `x = 2`.” Which response is best?", options:[
          { t:"“Not necessarily. `f′(2) = 0` makes 2 a critical number, but there’s an extremum only if `f′` changes sign there. For `f(x) = (x - 2)^3`, `f′ ≥ 0` on both sides, so there’s neither.”", ok:true, why:"A critical number is only a candidate; the sign change decides." },
          { t:"“Yes: every critical number gives a max or a min.”", why:M3 },
          { t:"“Not necessarily, because `f′` might not exist at 2.”", why:"It does exist; it’s 0." },
          { t:"“No: `f′(2) = 0` means `f` is constant near 2.”", why:"Only the tangent is flat, and only at that point." }] },
        b:{ prompt:"A student says: “`f′` doesn’t exist at `x = 1`, so `f` can’t have a max or min there.” Which response is best?", options:[
          { t:"“That’s not true. `f(x) = |x - 1|` has a local min at `x = 1`, where `f′` doesn’t exist. Check the signs of `f′` on each side.”", ok:true, why:"Corners and cusps can be extrema; the sign change decides." },
          { t:"“True: extrema need a horizontal tangent.”", why:M1 },
          { t:"“True, unless `f(1) = 0`.”", why:"The value of `f` doesn’t decide it." },
          { t:"“False, because every point where `f′` fails is a maximum.”", why:"Vertical tangents (like `∛x`) give neither." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"`f′(x) = -2(x + 1)(x - 3)`. Which summary is correct and correctly written?", options:[
          { t:"“`f` decreases on `(-∞, -1)` and `(3, ∞)` and increases on `(-1, 3)`; local min at `x = -1`, local max at `x = 3`.”", ok:true, why:"The −2 makes `f′` negative outside −1 and 3 and positive between them." },
          { t:"“`f` increases on `(-∞, -1)` and `(3, ∞)` and decreases on `(-1, 3)`; local max at `x = -1`, local min at `x = 3`.”", why:"The −2 flips every sign." },
          { t:"“`f` decreases on `(-∞, -1]` and `[3, ∞)` and increases on `[-1, 3]`; local min at −1, local max at 3.”", why:"Intervals of increase and decrease are written as open intervals." },
          { t:"“`f` decreases on `(-∞, -1)` and `(3, ∞)` and increases on `(-1, 3)`; local min at (−1, 0), local max at (3, 0).”", why:"`f′ = 0` there, not `f`. " + M5 }] },
        b:{ prompt:"`f′(x) = -3(x + 2)(x - 1)`. Which summary is correct and correctly written?", options:[
          { t:"“`f` decreases on `(-∞, -2)` and `(1, ∞)` and increases on `(-2, 1)`; local min at `x = -2`, local max at `x = 1`.”", ok:true, why:"The −3 makes `f′` negative outside −2 and 1 and positive between them." },
          { t:"“`f` increases on `(-∞, -2)` and `(1, ∞)` and decreases on `(-2, 1)`; local max at −2, local min at 1.”", why:"The −3 flips every sign." },
          { t:"“`f` decreases on `(-∞, -2]` and `[1, ∞)` and increases on `[-2, 1]`; local min at −2, local max at 1.”", why:"Intervals of increase and decrease are written as open intervals." },
          { t:"“`f` decreases on `(-∞, -2)` and `(1, ∞)` and increases on `(-2, 1)`; local min at (−2, 0), local max at (1, 0).”", why:"`f′ = 0` there, not `f`. " + M5 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A reservoir holds `V(t) = t^3 - 15t^2 + 63t + 200` megalitres `t` months after January 1, for `0 ≤ t ≤ 12`. When does the volume reach a local maximum, and what is it?", options:[
          { t:"After 3 months: 281 ML", ok:true, why:"`V′ = 3(t - 3)(t - 7)`: + then − at 3; `V(3) = 27 - 135 + 189 + 200 = 281`." },
          { t:"After 7 months: 249 ML", why:"That’s the local minimum." },
          { t:"After 5 months, halfway between the critical numbers", why:"A max happens at a critical number, not between them." },
          { t:"After 3 months: 281 ML, and again after 7 months", why:"At 7, `V′` goes − to +: a minimum." }] },
        b:{ prompt:"`V(t) = t^3 - 18t^2 + 96t + 100`, for `0 ≤ t ≤ 12`. When does the volume reach a local maximum, and what is it?", options:[
          { t:"After 4 months: 260 ML", ok:true, why:"`V′ = 3(t - 4)(t - 8)`; `V(4) = 64 - 288 + 384 + 100 = 260`." },
          { t:"After 8 months: 228 ML", why:"That’s the local minimum." },
          { t:"After 6 months", why:"Not a critical number." },
          { t:"After 4 months: 260 ML, and again after 8 months", why:"At 8, `V′` goes − to +: a minimum." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"The average cost of making `x` thousand phone cases is `A(x) = x + {16}/{x} + 2` (dollars per case), `x > 0`. At what production level does the average cost have a local minimum, and what is it?", options:[
          { t:"4 thousand cases, $10 per case", ok:true, why:"`A′ = 1 - {16}/{x^2} = 0` at `x = 4` (−4 isn’t in the domain); − then +; `A(4) = 4 + 4 + 2 = 10`." },
          { t:"16 thousand cases, $19 per case", why:"`1 = {16}/{x^2}` gives `x^2 = 16`, so `x = 4`." },
          { t:"At `x = -4` and `x = 4`", why:"Production can’t be negative: −4 isn’t in the domain." },
          { t:"4 thousand cases, $0 per case", why:"`A′(4) = 0`; the cost is `A(4)`." }] },
        b:{ prompt:"`A(x) = x + {25}/{x} + 1`, `x > 0`. At what production level does the average cost have a local minimum, and what is it?", options:[
          { t:"5 thousand cases, $11 per case", ok:true, why:"`A′ = 1 - {25}/{x^2} = 0` at `x = 5`; `A(5) = 5 + 5 + 1 = 11`." },
          { t:"25 thousand cases, $27 per case", why:"`x^2 = 25` gives `x = 5`." },
          { t:"At `x = -5` and `x = 5`", why:"Production can’t be negative: −5 isn’t in the domain." },
          { t:"5 thousand cases, $0 per case", why:"`A′(5) = 0`; the cost is `A(5)`." }] } }
    ]
  },
  task:{
    title:"Design the derivative", summary:"Design the derivative",
    statement:"<p>Choose a derivative `f′(x) = a(x - p)^m(x - q)^n` so that the function `f` meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has a local minimum at `x = 1`.</li><li>`f` has a critical number at a negative `x` where it has neither a max nor a min.</li><li>`f′(0) = -4`.</li></ol></div>" +
      "<p class=\"tiny muted\">`a` is a whole number from −5 to 5 (not 0); `p` and `q` are whole numbers from −5 to 5; `m` and `n` are 1, 2 or 3. The sign chart and the sketch of `f` (drawn with `f(0) = 0`) update as you go.</p>",
    checks:["Local min at `x = 1`", "A negative critical number that is neither", "`f′(0) = -4`"],
    tips:["A minimum needs `f′` to go from − to +. Use an odd power for the factor `(x - 1)`, and check the sign of `a`.",
      "A critical point with no sign change needs an even power: `(x - q)^2` with `q < 0`.",
      "Substitute `x = 0` into your `f′`."],
    explainPrompt:"Explain how you chose the powers and why `f′(0) = -4` left so few choices.",
    vocab:"Use the words critical number, sign change, local minimum and even power.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"`f′(0) = -aq^2` when the power on `(x - 1)` is odd, so `aq^2 = 4`. That allows only `a = 1`, `q = -2` or `a = 4`, `q = -1`.",
    labels:{ a:"`a`", p:"`p`", q:"`q`", m:"`m`", n:"`n`", aRange:"(−5 to 5, not 0)", pRange:"(−5 to 5)", pow:"power",
      invalid:"Choose whole numbers: `a` from −5 to 5 (not 0), `p` and `q` from −5 to 5, and a power for each factor.",
      chart:"Sign chart of your `f′`", sketch:"Sketch of `f` with `f(0) = 0`" }
  },
  cards:[
    ["Critical number", "`c` in the domain with `f′(c) = 0` or `f′(c)` undefined."],
    ["Critical point", "The point `(c, f(c))`."],
    ["Stationary point", "`f′(c) = 0`: the tangent is horizontal."],
    ["Where `f′` doesn’t exist", "Corners (`|x|`), cusps (`x^{2/3}`), vertical tangents (`x^{1/3}`)."],
    ["Not critical", "Values outside the domain (asymptotes, holes), even if `f′` is undefined there."],
    ["First derivative test: + to −", "Local maximum."],
    ["First derivative test: − to +", "Local minimum."],
    ["No sign change", "Neither: e.g. `y = x^3` at 0, or a squared factor in `f′`."],
    ["Even power in `f′`", "`(x - c)^2` doesn’t change sign: no extremum at `c`."],
    ["Local vs absolute", "Local compares with nearby points only; a local max can be lower than a local min."],
    ["Zoom test", "Smooth points straighten when you zoom in; corners and cusps never do."],
    ["Infinitely many `f`", "The same `f′` fits `f + C` for every constant `C`."]
  ]
};
