// MCV4U 23 Concavity and Points of Inflection. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/23-concavity-and-points-of-inflection.md
// misconception core sentences (plan §3)
const M1 = "Check for a sign change. `f″ = 12x^2` is 0 at 0, but positive on both sides: no inflection.";
const M2 = "Concavity is about the <strong>slope</strong> changing. A graph can rise while bending down.";
const M3 = "`f″ > 0` means concave up, a cup shape: that’s a local <strong>minimum</strong>.";
const M4 = "A point of inflection must be on the graph. `x = 0` isn’t in the domain of `1/x`.";
const M5 = "`∛x` changes concavity at 0 even though `f″(0)` doesn’t exist.";
const M6 = "Zeros of `f′` are candidates for max and min. Points of inflection come from `f″`.";
const M7 = "Fastest growth is the maximum of `f′`, which is a point of inflection of `f`.";
// hero equation: f″ in magenta (--f4)
const F2 = '<span class="cv-f4">`f″`</span>';
const HERO_EQ = '<span class="cv-heq"><span class="cv-ht">' + F2 + "` > 0` ⟹ concave up ∪</span>" +
  '<span class="cv-hdot" aria-hidden="true">·</span><span class="cv-ht">' + F2 + "` < 0` ⟹ concave down ∩</span></span>";

export default {
  id:"23-concavity-and-points-of-inflection",
  kind:"topic",
  title:"Concavity and points of inflection",
  topic:"Concavity and Points of Inflection",
  readyTopic:"concavity and points of inflection",
  hero:{
    eq:HERO_EQ,
    eqLabel:"f double prime greater than 0 implies concave up, a cup; f double prime less than 0 implies concave down, a cap",
    eqSize:"sm",
    headline:"Which way is the graph bending?",
    text:"When the slopes of the tangents keep increasing, the graph bends upward: it’s <strong>concave up</strong>. When they keep decreasing, it’s <strong>concave down</strong>. The second derivative measures that change. Where the bending switches direction, there’s a <strong>point of inflection</strong>.",
    fig:{ aria:"The graph of y = x³ − 6x² + 9x + 1 with a tangent line sliding along it.", shape:"wide" }
  },
  goals:[
    "I can find intervals of concavity from the sign of `f″` and explain concavity using slopes of tangents.",
    "I can connect the graphs of `f`, `f′` and `f″`: concave up ↔ `f′` increasing ↔ `f″ > 0`.",
    "I can find points of inflection, checking that the concavity really changes at a point on the graph.",
    "I can use the second derivative test to classify critical points, and recognize when it gives no conclusion.",
    "I can analyse concavity for rational functions and functions with fractional exponents.",
    "I can interpret concavity and points of inflection in context (“growing, but more slowly”)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Second derivatives", goal:1, prompt:"`f(x) = x^4 - 2x^3`. What is `f″(x)`?",
          options:[
            { t:"`12x^2 - 12x`", ok:true, why:"`f′ = 4x^3 - 6x^2`, then differentiate again." },
            { t:"`4x^3 - 6x^2`", why:"That’s the first derivative." },
            { t:"`12x - 12`", why:"That’s `f‴`." },
            { t:"`12x^2 - 6x`", why:"`-6x^2` becomes `-12x`." }],
          hints:["Differentiate, then differentiate again.", "`f′ = 4x^3 - 6x^2`.", "`f″ = 12x^2 - 12x`."] },
        { id:"w2", skill:"Second derivatives", goal:5, prompt:"`f(x) = 1/x`. What is `f″(x)`?",
          options:[
            { t:"`2/x^3`", ok:true, why:"`f = x^{-1}`, `f′ = -x^{-2}`, `f″ = 2x^{-3}`." },
            { t:"`-1/x^2`", why:"Differentiate once more." },
            { t:"`-2/x^3`", why:"(−1)(−2) = 2." },
            { t:"`1/(2x)`", why:"Write `1/x` as `x^{-1}` first." }],
          hints:["Write `f = x^{-1}`.", "`f′ = -x^{-2}`.", "`f″ = 2x^{-3}`."] },
        { id:"w3", skill:"Sign charts", goal:1, prompt:"Where is `6x - 12` negative?",
          options:[
            { t:"`x < 2`", ok:true, why:"`6x - 12 < 0` when `x < 2`." },
            { t:"`x > 2`", why:"Try `x = 0`: −12." },
            { t:"`x < -2`", why:"`6x = 12` at `x = 2`." },
            { t:"`x < 12`", why:"Divide by 6." }],
          hints:["Solve `6x - 12 = 0`.", "`x = 2`.", "Negative to the left: `x < 2`."] },
        { id:"w4", skill:"Sign charts", goal:3, prompt:"On which intervals is `12(x - 1)(x + 1)` positive?",
          options:[
            { t:"`(-∞, -1)` and `(1, ∞)`", ok:true, why:"Test 0: negative in the middle." },
            { t:"`(-1, 1)`", why:"At `x = 0`: `12(-1)(1) < 0`." },
            { t:"`(1, ∞)` only", why:"Try `x = -2`: `12(-3)(-1) > 0`." },
            { t:"All `x`", why:"It’s 0 at ±1 and negative between." }],
          hints:["Zeros at ±1.", "Test `x = -2`, 0, 2.", "+, −, +."] },
        { id:"w5", skill:"First derivative test", goal:4, prompt:"`f′` changes from + to − at `x = 3`. What does `f` have there?",
          options:[
            { t:"A local maximum", ok:true, why:"Rising, then falling." },
            { t:"A local minimum", why:"+ to − is a peak." },
            { t:"A point of inflection", why:"That’s about `f″`, not `f′`." },
            { t:"Nothing", why:"A sign change in `f′` gives an extremum." }],
          hints:["+ means rising.", "Rising, then falling.", "A local max."] },
        { id:"w6", skill:"First derivative test", goal:4, prompt:"`f′(x) = 3x^2`. Does `f` have a local extremum at `x = 0`?",
          options:[
            { t:"No: `f′` is positive on both sides", ok:true, why:"No sign change." },
            { t:"Yes, a minimum", why:"`f′` must change sign." },
            { t:"Yes, a maximum", why:"`f′` is never negative." },
            { t:"Yes, because `f′(0) = 0`", why:"That makes 0 critical, not an extremum." }],
          hints:["Test `x = -1` and `x = 1`.", "Both give 3.", "No sign change: no extremum."] }
      ],
      refreshers:{
        "Second derivatives":"Differentiate the first derivative. Rewrite fractions as powers first: `1/x = x^{-1}`.",
        "Sign charts":"Mark the zeros, test one value in each interval, and write open intervals.",
        "First derivative test":"+ to −: max. − to +: min. No sign change: neither."
      }
    }
  },
  explore:{
    heading:"Bend detector",
    intro:"Slide the tangent along the curve. Watch whether the curve sits above or below it, and how the slopes change. Then find where the bending switches.",
    fns:[
      { id:"C1", chip:"`x^3 - 6x^2 + 9x + 1`", f:"x^3 - 6x^2 + 9x + 1", d1:"3x^2 - 12x + 9", d2:"6x - 12", d1x:"3(x - 1)(x - 3)", d2x:"6(x - 2)" },
      { id:"C2", chip:"`x^4 - 6x^2`", f:"x^4 - 6x^2", d1:"4x^3 - 12x", d2:"12x^2 - 12", fx:"x^2(x^2 - 6)", d1x:"4x(x^2 - 3)", d2x:"12(x - 1)(x + 1)" },
      { id:"C3", chip:"`x^4`", f:"x^4", d1:"4x^3", d2:"12x^2" },
      { id:"C4", chip:"`∛x`", f:"∛x", d1:"{1}/{3}x^{-2/3}", d2:"-{2}/{9}x^{-5/3}", d1x:"{1}/{3∛{x^2}}", d2x:"-{2}/{9x∛{x^2}}" },
      { id:"C5", chip:"`1/x`", f:"{1}/{x}", d1:"-{1}/{x^2}", d2:"{2}/{x^3}" },
      { id:"C6", chip:"`x^3`", f:"x^3", d1:"3x^2", d2:"6x" },
      { id:"B", chip:"Build", form:"`x^4 + bx^3 + cx^2`" }
    ],
    modes:[{ id:"tan", t:"Tangent" }, { id:"slopes", t:"Slopes" }, { id:"three", t:"Three panels" }],
    modeHow:{
      tan:"The tangent follows the probe. Solid tint: the curve is above the tangent (∪ concave up). Hatched tint: the curve is below it (∩ concave down).",
      slopes:"Short tangents every 0.5 units show their slopes. Read them left to right: are they increasing or decreasing? The `f′` panel shows the same slopes as heights.",
      three:"`f`, `f′` and `f″` share one probe line. Hollow rings mark the candidates: where `f″ = 0` or `f″` doesn’t exist."
    },
    probeHow:"Drag the point on the graph, or use the slider. Arrow keys move the probe by 0.05; Shift + arrow keys move it by 0.5.",
    buildNote:"`b` and `c` are whole numbers from −20 to 20.",
    stripCap:"Slopes of `f`: trace the curve to fill in the strip. ∪ means the slopes are increasing; ∩ means they’re decreasing.",
    rows:{ fx:"`f(x)`", d1:"`f′(x)`", d2:"`f″(x)`", at:"At the probe", vs:"Curve vs tangent", slopes:"Slopes", ivs:"Concavity intervals", pois:"Points of inflection" },
    vs:{ up:"above the tangent: concave up", down:"below the tangent: concave down", cross:"crosses the tangent: point of inflection",
      vert:"the vertical tangent crosses the curve: point of inflection", upBoth:"above the tangent on both sides: concave up", downBoth:"below the tangent on both sides: concave down" },
    slopes:{ up:"increasing as `x` increases", down:"decreasing as `x` increases", fmin:"stop decreasing and start increasing: `f′` has a local minimum here",
      fmax:"stop increasing and start decreasing: `f′` has a local maximum here",
      steepDown:" (the steepest moment going down)", steepUp:" (the steepest moment going up)", least:" (the least steep moment)", flatPt:" (a flat point of inflection)", flatUp:"momentarily steady, then increasing again", flatDown:"momentarily steady, then decreasing again",
      undef:"undefined here: the tangent is vertical" },
    none:{ zero:"none (`f″ = 0` at {x} but no sign change)", domain:"none ({x} isn’t in the domain)", never:"none (`f″` never changes sign)" },
    summaryLabel:"Show the concavity summary",
    skip:"Skipped `x = 0`: `1/x` isn’t defined there.",
    markBtn:"Mark point of inflection", clearBtn:"Clear marks", factBtn:"Factored forms",
    markNote:{ yes:"Marked: the concavity changes here, so this is a point of inflection.", no:"Marked. Check whether the concavity really changes here.", off:"Mark removed.", cleared:"Marks cleared." },
    ibTitle:"Interval builder (challenge 2)",
    ibText:"Build an interval for challenge 2 here. Drag the ends, or Tab to an end and use the arrow keys; O and C set open or closed.",
    predIntro:"Make a prediction first. Then the bend detector shows you what really happens.",
    predictions:[
      { id:"p1", fn:"C1", prompt:"C1: `f″(2) = 0`. What will the tangent do at `x = 2`?",
        options:[{ t:"Cross the curve", ok:true }, { t:"Stay above the curve" }, { t:"Stay below the curve" }, { t:"Be horizontal" }],
        explain:"Concavity changes at 2, so the curve switches from below the tangent to above it. `f′(2) = -3`, so the tangent isn’t horizontal." },
      { id:"p2", fn:"C3", prompt:"C3 `x^4`: `f″(0) = 0`. Is (0, 0) a point of inflection?",
        options:[{ t:"No: concave up on both sides", ok:true }, { t:"Yes" }, { t:"Yes, and also a maximum" }, { t:"Can’t tell from a graph" }],
        explain:"`f″ = 12x^2 >= 0`: no sign change, no inflection." },
      { id:"p3", fn:"C4", prompt:"C4 `∛x`: `f″(0)` doesn’t exist. Is (0, 0) a point of inflection?",
        options:[{ t:"Yes: the concavity changes there", ok:true }, { t:"No: `f″` must be 0" }, { t:"No: the tangent is vertical" }, { t:"No: `f′` doesn’t exist" }],
        explain:"`f″ = -{2}/{9x^{5/3}}` is + for `x < 0` and − for `x > 0`, and (0, 0) is on the graph." },
      { id:"p4", fn:"C5", prompt:"C5 `1/x`: it’s concave down on `(-∞, 0)` and up on `(0, ∞)`. Is there a point of inflection at `x = 0`?",
        options:[{ t:"No: 0 isn’t in the domain", ok:true }, { t:"Yes, at (0, 0)" }, { t:"Yes, at the asymptote" }, { t:"Yes, because `f″` changes sign" }],
        explain:"A point of inflection has to be a point of the graph." }
    ],
    chalIntro:"Use the bend detector to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"On C2, move the probe to each point of inflection and press <strong>Mark point of inflection</strong>.",
        why:"`f″ = 12(x - 1)(x + 1)` changes sign at −1 and at 1: the points of inflection are (−1, −5) and (1, −5).",
        hints:["Use Three panels: where does `f″` change sign?", "`f″ = 12(x - 1)(x + 1)`.", "`x = -1` and `x = 1`: (−1, −5) and (1, −5)."],
        msgs:{ fn:"Choose C2 first, then mark its points of inflection.", none:"Move the probe to a point of inflection and press Mark point of inflection.",
          zero:"At `x = 0` the curve is concave down on both sides (`f″(0) = -12`): that’s a local max, not an inflection.",
          mins:"Those are the local minimums (`f′ = 0`).", other:"The concavity doesn’t change at {x}: `f″` has the same sign on both sides. Clear that mark.",
          one:"One more: C2 has two points of inflection." } },
      { id:"tc2", goal:[1, 2], prompt:"For C1, build the interval where `f` is <strong>concave up and decreasing</strong> (use the interval builder below the graph).",
        why:"Decreasing on (1, 3), where `f′ = 3(x - 1)(x - 3) < 0`; concave up on (2, ∞). Both: (2, 3).",
        hints:["Decreasing: where `f′ = 3(x - 1)(x - 3) < 0`.", "Decreasing on (1, 3); concave up where `6x - 12 > 0`, on (2, ∞).", "Both: (2, 3)."],
        msgs:{ dec:"That’s all of the decreasing part; it’s concave down on (1, 2).", up:"That’s all of the concave-up part; `f` increases after 3.",
          closed:"Use open intervals for concavity and for increasing and decreasing.",
          general:"Find where `f′ < 0` (decreasing) and where `f″ > 0` (concave up), then keep only the part where both are true." } },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Build mode: choose `b` and `c` (sliders −20 to 20, step 1) so that `f(x) = x^4 + bx^3 + cx^2` has points of inflection at `x = 1` and `x = 3`.",
        why:"`f″ = 12x^2 + 6bx + 2c` must equal `12(x - 1)(x - 3) = 12x^2 - 48x + 36`: `6b = -48` and `2c = 36`, so `b = -8`, `c = 18`.",
        hints:["Differentiate twice: `f″ = 12x^2 + 6bx + 2c`.", "It must equal `12(x - 1)(x - 3) = 12x^2 - 48x + 36`.", "`6b = -48` and `2c = 36`: `b = -8`, `c = 18`."],
        msgs:{ fn:"Choose Build first, then set `b` and `c` with the sliders.",
          quad:"You matched `x^2 - 4x + 3`, but `f″ = 12x^2 + 6bx + 2c`. Match `12(x - 1)(x - 3)` instead.",
          sign:"Inflections at −1 and −3: check the sign of `b`.",
          one3:"`f″(3)` must also be 0.", one1:"`f″(1)` must also be 0.",
          other:"Your `f″` has value {v1} at `x = 1` and {v3} at `x = 3`. Both must be 0." } }
    ]
  },
  part3:{
    slug:"second-test", name:"2nd derivative test",
    heading:"The second derivative test",
    intro:"Concavity gives a second way to classify critical points. A cup shape at a stationary point must be a valley, and a cap must be a peak. Try it, watch it fail when `f″ = 0`, then use it on rational functions and growth. Then try the quick check.",
    radioAria:"Cup or cap",
    st1:{ title:"Station 1: Cups and caps",
      text:"`f(x) = x^3 - 3x^2`, with `f′(x) = 3x(x - 2)` and `f″(x) = 6x - 6`. The critical numbers are 0 and 2. For each one, choose cup or cap from the sign of `f″`, then press <strong>Reveal</strong>.",
      choices:[{ id:"cup", t:"Cup ∪ (local min)" }, { id:"cap", t:"Cap ∩ (local max)" }],
      pts:[
        { x:0, y:0, d2:-6, answer:"cap", label:"`x = 0`", right:"`f″(0) = -6 < 0`: a cap, so a local max at (0, 0).", wrong:"`f″(0) = -6 < 0`: concave down, a cap. It’s a local max at (0, 0)." },
        { x:2, y:-4, d2:6, answer:"cup", label:"`x = 2`", right:"`f″(2) = 6 > 0`: a cup, so a local min at (2, −4).", wrong:"`f″(2) = 6 > 0`: concave up, a cup. It’s a local min at (2, −4)." }],
      alg:["`f′(x) = 3x(x - 2)` is + on `(-∞, 0)`, − on `(0, 2)` and + on `(2, ∞)`.", "At 0, `f′` changes from + to −: a local max at (0, 0).", "At 2, `f′` changes from − to +: a local min at (2, −4).", "The first derivative test gives the same answers as the cups and caps."] },
    st2:{ title:"Station 2: When the test is silent",
      text:"Each card has `f′(0) = 0` and `f″(0) = 0`, so the second derivative test can’t decide. Predict what each function has at `x = 0`, then press <strong>Reveal</strong>.",
      choices:[{ id:"min", t:"Local min" }, { id:"max", t:"Local max" }, { id:"neither", t:"Neither" }],
      cards:[
        { id:"a", f:"`f(x) = x^4`", plain:"y = x⁴", answer:"min", reveal:"`f′ = 4x^3`: − then +, so a local min at (0, 0)." },
        { id:"b", f:"`f(x) = -x^4`", plain:"y = −x⁴", answer:"max", reveal:"`f′ = -4x^3`: + then −, so a local max at (0, 0)." },
        { id:"c", f:"`f(x) = x^3`", plain:"y = x³", answer:"neither", reveal:"`f′ = 3x^2`: + on both sides, so neither. (0, 0) is a point of inflection." }],
      done:"`f″(c) = 0` gives no conclusion. Use the first derivative test.",
      right:"✓ Correct.", wrong:"✗ Not quite." },
    st3:{ title:"Station 3: Rational functions and steepest moments",
      textA:"`f(x) = x + 1/x`. Step through the second derivative test.",
      steps:[
        "`f′(x) = 1 - 1/x^2 = 0` when `x^2 = 1`: critical numbers −1 and 1.",
        "`f″(x) = 2/x^3`.",
        "`f″(1) = 2 > 0`: concave up, so a local min at (1, 2).",
        "`f″(-1) = -2 < 0`: concave down, so a local max at (−1, −2).",
        "Concave down on `(-∞, 0)` and up on `(0, ∞)`. The concavity changes at 0, but 0 isn’t in the domain: no point of inflection."],
      textB:"A growth curve: `N(t) = -t^3 + 9t^2 + 3t`. Move the time slider to the moment of <strong>fastest growth</strong>, then press <strong>Check</strong>.",
      fast:"Right. `N″ = -6t + 18 = 0` at `t = 3`, changing from + to −, so `N′(3) = 30` is the maximum of `N′`. " + M7,
      biggest:"At `t = 6`, `N` is largest on this window, but it’s growing at only `N′(6) = 3`. " + M7,
      other:"Here `N′` = {v}. Look at the `N′` panel: where is it highest?",
      alg:["`N′(t) = -3t^2 + 18t + 3`", "`N″(t) = -6t + 18`, which is 0 at `t = 3`, + before and − after.", "So `N′` rises, then falls: its maximum is `N′(3) = -27 + 54 + 3 = 30`.", "The point of inflection (3, 63) of `N` is the moment of fastest growth."] },
    quickCheck:{
      title:"Quick check", summary:"Second derivative test quick check",
      items:[
        { id:"q1", goal:4, prompt:"`f′(1) = 0` and `f″(1) = -4`. At `x = 1`, `f` has…",
          choices:[
            { t:"a local max", ok:true, fb:"Right. `f″ < 0`: concave down, a cap." },
            { t:"a local min", fb:"`f″ < 0`: concave down, a cap." },
            { t:"a point of inflection", fb:"`f″ < 0`: concave down, a cap." },
            { t:"no conclusion", fb:"`f″ < 0`: concave down, a cap." }] },
        { id:"q2", goal:4, prompt:"`f′(0) = 0` and `f″(0) = 0`. The second derivative test says…",
          choices:[
            { t:"nothing", ok:true, fb:"Right. Use the first derivative test instead." },
            { t:"a local min", fb:"Use the first derivative test instead." },
            { t:"a local max", fb:"Use the first derivative test instead." },
            { t:"a point of inflection", fb:"Use the first derivative test instead." }] },
        { id:"q3", goal:1, prompt:"`f″(x) = 6(x + 2)`. Where is `f` concave up?",
          choices:[
            { t:"`(-2, ∞)`", ok:true, fb:"Right. `6(x + 2) > 0` when `x > -2`." },
            { t:"`(-∞, -2)`", fb:"`6(x + 2) > 0` when `x > -2`." },
            { t:"`(2, ∞)`", fb:"`6(x + 2) > 0` when `x > -2`." },
            { t:"everywhere", fb:"`6(x + 2) > 0` when `x > -2`." }] },
        { id:"q4", goal:6, prompt:"A population model has `P″ = 0` at `t = 5`, with `P″` changing from + to −. What happens at `t = 5`?",
          choices:[
            { t:"It grows fastest", ok:true, fb:"Right. `P′` is largest where `P″` changes from + to −." },
            { t:"It is largest", fb:"`P′` is largest where `P″` changes from + to −." },
            { t:"It stops growing", fb:"`P′` is largest where `P″` changes from + to −." },
            { t:"It grows slowest", fb:"`P′` is largest where `P″` changes from + to −." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Inflection or not?", summary:"Inflection or not?", noun:"function", goal:[3, 5],
        instruction:"Decide whether each function has a point of inflection at the given `x`-value.",
        boxes:[{ id:"yes", label:"Point of inflection here" }, { id:"no", label:"No point of inflection here" }],
        items:[
          { id:"i1", goal:3, t:"`f(x) = x^3 - 3x`, at `x = 0`", answer:"yes", why:"`f″ = 6x` changes sign at 0.", wrong:{ no:"`f″ = 6x` changes sign at 0." } },
          { id:"i2", goal:3, t:"`f(x) = x^4 + x`, at `x = 0`", answer:"no", why:"`f″ = 12x^2` doesn’t change sign.", wrong:{ yes:"`f″ = 12x^2` doesn’t change sign." } },
          { id:"i3", goal:5, t:"`f(x) = x^{5/3}`, at `x = 0`", answer:"yes", why:"`f″ = {10}/{9}x^{-1/3}` changes sign; `f″(0)` doesn’t exist.",
            wrong:{ no:"`f″ = {10}/{9}x^{-1/3}` changes sign; `f″(0)` doesn’t exist." },
            hints:["Find `f′` and `f″`.", "`f″ = {10}/{9}x^{-1/3}`, undefined at 0.", "Negative for `x < 0`, positive for `x > 0`: concavity changes at (0, 0)."] },
          { id:"i4", goal:5, t:"`f(x) = (x - 2)^{2/3}`, at `x = 2`", answer:"no", why:"`f″ = -{2}/{9}(x - 2)^{-4/3} < 0` on both sides: a cusp, concave down on both sides.",
            wrong:{ yes:"`f″ = -{2}/{9}(x - 2)^{-4/3} < 0` on both sides: a cusp, concave down on both sides." } },
          { id:"i5", goal:[3, 5], t:"`f(x) = 1/(x - 1)`, at `x = 1`", answer:"no", why:"`x = 1` isn’t in the domain.", wrong:{ yes:"`x = 1` isn’t in the domain." } },
          { id:"i6", goal:3, t:"`f(x) = x^5`, at `x = 0`", answer:"yes", why:"`f″ = 20x^3` changes sign.", wrong:{ no:"`f″ = 20x^3` changes sign." } },
          { id:"i7", goal:3, t:"`f(x) = x^4 - 4x^3`, at `x = 0`", answer:"yes", why:"`f″ = 12x(x - 2)` changes sign at 0 (a flat point of inflection).",
            wrong:{ no:"`f″ = 12x(x - 2)` changes sign at 0 (a flat point of inflection)." } },
          { id:"i8", goal:3, t:"`f(x) = x^4 - 4x^3`, at `x = 2`", answer:"yes", why:"`f″` changes sign at 2 as well.", wrong:{ no:"`f″` changes sign at 2 as well." } },
          { id:"i9", goal:3, t:"`f″(x) = (x - 1)^2`, at `x = 1`", answer:"no", why:"A square doesn’t change sign.", wrong:{ yes:"A square doesn’t change sign." } },
          { id:"i10", goal:3, t:"`f″(x) = x(x + 2)^2`, at `x = -2`", answer:"no", why:"`(x + 2)^2` doesn’t change sign, and `x < 0` on both sides of −2.",
            wrong:{ yes:"`(x + 2)^2` doesn’t change sign, and `x < 0` on both sides of −2." },
            hints:["What sign is `x(x + 2)^2` just left and just right of −2?", "`x` is negative and `(x + 2)^2` positive on both sides.", "Negative on both sides: no change."] }
        ],
        wrongDefault:"Check whether `f″` changes sign there, and whether the point is on the graph." },
      { id:"bend", type:"custom", title:"Bend it", summary:"Bend it", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Find intervals of concavity, points of inflection and missing coefficients. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Build intervals on the number lines (drag the ends, or Tab to an end and use the arrow keys; O and C set open or closed). Type numbers or fractions such as 1/4 in the boxes, then press Check.",
        msgs:{ empty:"Fill in every answer first.", num:"Type a number or a fraction, such as −2 or 1/4, in each box.",
          ivEnds:"Check your interval: where does `f″` change sign?", closed:"Use open intervals for concavity.", inf:"Infinity always takes a round bracket.",
          pts:"Check your points: where does `f″` change sign, and what is `f` there?", onePt:"One point is right. Find the other one." },
        items:[
          { id:"s1", goal:1, prompt:"Intervals of concavity and the point of inflection of `f(x) = x^3 + 3x^2 - 9x`.",
            fields:[{ k:"down", kind:"iv", label:"Concave down on", min:-5, max:5 }, { k:"up", kind:"iv", label:"Concave up on", min:-5, max:5 }, { k:"p", kind:"pts", n:1, label:"Point of inflection" }],
            answer:{ down:[null, -1], up:[-1, null], p:[[-1, 11]] }, display:"concave down on `(-∞, -1)`, up on `(-1, ∞)`; point of inflection (−1, 11)",
            wrong:[{ k:"p", pts:[[-1, 0]], fb:"The point’s `y`-value is `f(-1)`, not `f″(-1)`." }],
            why:"`f″ = 6x + 6` is negative for `x < -1` and positive for `x > -1`, and `f(-1) = -1 + 3 + 9 = 11`." },
          { id:"s2", goal:3, prompt:"Points of inflection of `f(x) = x^4 - 4x^3 + 10`.",
            fields:[{ k:"p", kind:"pts", n:2, label:"Points of inflection" }],
            answer:{ p:[[0, 10], [2, -6]] }, display:"(0, 10) and (2, −6)",
            wrong:[{ k:"p", only:[[2, -6]], fb:"`f″ = 12x(x - 2)` changes sign at 0 too." }],
            why:"`f″ = 12x^2 - 24x = 12x(x - 2)` changes sign at 0 and at 2; `f(0) = 10` and `f(2) = -6`." },
          { id:"s3", goal:3, star:true, prompt:"`f(x) = ax^3 + bx^2` has a point of inflection at (1, 4). Find `a` and `b`.",
            fields:[{ k:"a", kind:"num", label:"`a =`" }, { k:"b", kind:"num", label:"`b =`" }],
            answer:{ a:-2, b:6 }, display:"`a = -2`, `b = 6`",
            wrongDefault:"Two conditions: `f″(1) = 6a + 2b = 0` and `f(1) = a + b = 4`.",
            why:"`f″(1) = 6a + 2b = 0` gives `b = -3a`; `f(1) = a + b = 4` gives `-2a = 4`, so `a = -2` and `b = 6`." },
          { id:"s4", goal:[3, 5], star:true, prompt:"For which values of `k` does `f(x) = x^4 + kx^3 + 6x^2` have <strong>no</strong> points of inflection?",
            fields:[{ k:"k", kind:"iv", label:"Values of `k`", min:-8, max:8, v:"k" }],
            answer:{ k:[-4, 4, true, true] }, display:"`-4 <= k <= 4`",
            wrong:[{ k:"k", iv:[-4, 4, false, false], fb:"At `k = ±4`, `f″ = 12(x ± 1)^2` never changes sign: include the endpoints." }],
            why:"`f″ = 12x^2 + 6kx + 12` must never change sign, so its discriminant `36k^2 - 576 <= 0`: `k^2 <= 16`.",
            hints:["`f″ = 12x^2 + 6kx + 12`.", "No inflection means `f″` never changes sign: the quadratic can’t have two different roots.", "Discriminant `36k^2 - 576 <= 0`: `k^2 <= 16`."] },
          { id:"s5", goal:2, star:true, prompt:"The graph of `f′` is a parabola opening up with vertex (2, −3). Where does `f` have a point of inflection, and what is its concavity on each side?",
            fields:[{ k:"x", kind:"num", label:"Point of inflection at `x =`" }, { k:"down", kind:"iv", label:"Concave down on", min:-5, max:5 }, { k:"up", kind:"iv", label:"Concave up on", min:-5, max:5 }],
            answer:{ x:2, down:[null, 2], up:[2, null] }, display:"`x = 2`; concave down on `(-∞, 2)`, concave up on `(2, ∞)`",
            wrong:[{ k:"x", notv:2, fb:"Inflections of `f` are at the max or min of `f′`, here its vertex. " + M6 }],
            why:"`f′` decreases until its vertex at 2 and increases after, so `f″ < 0` on `(-∞, 2)` and `f″ > 0` on `(2, ∞)`." },
          { id:"s6", goal:5, star:true, prompt:"Find the points of inflection of `f(x) = x^2/(x^2 + 3)`.",
            fields:[{ k:"p", kind:"pts", n:2, label:"Points of inflection" }],
            answer:{ p:[[-1, 0.25], [1, 0.25]] }, display:"(−1, 1/4) and (1, 1/4)",
            wrong:[{ k:"p", has:[0, 0], fb:"That’s where `f′ = 0` (a minimum). " + M6 }],
            why:"`f″ = 18(1 - x^2)/(x^2 + 3)^3` changes sign at ±1, where `f = 1/4`.",
            hints:["Write `f = 1 - 3/(x^2 + 3)`.", "`f′ = 6x/(x^2 + 3)^2`.", "`f″ = 18(1 - x^2)/(x^2 + 3)^3`: sign changes at ±1, where `f = 1/4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Wren", how:"", goal:[3, 4],
        instruction:"Wren made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the points of inflection of `f(x) = x^4 - 4x^3 + 6x^2`.",
            steps:["`f′(x) = 4x^3 - 12x^2 + 12x`.", "`f″(x) = 12x^2 - 24x + 12 = 12(x - 1)^2`.", "`f″ = 0` at `x = 1`, so there’s a point of inflection at (1, 3)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`12(x - 1)^2` is positive on both sides of 1, so the concavity doesn’t change: there is no point of inflection (`f` is concave up everywhere else).", ok:true, why:M1 },
              { t:"The point of inflection is (1, 0).", why:"`f(1) = 3`, but that isn’t the issue." },
              { t:"There are inflections at `x = 1` and `x = -1`.", why:"`f″` has only the double zero 1." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["What sign is `f″` at `x = 0` and at `x = 2`?", "12 and 12.", "No sign change: no point of inflection."] },
          { id:"e2", goal:4, task:"Use the second derivative test on `f(x) = 2x^3 - 3x^2 - 12x`.",
            steps:["`f′ = 6x^2 - 6x - 12 = 6(x - 2)(x + 1)`.", "Critical numbers: 2 and −1. `f″ = 12x - 6`.", "`f″(2) = 18 > 0`, so there’s a local max at (2, −20).", "`f″(-1) = -18 < 0`, so there’s a local min at (−1, 7)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 repeats the same reversal."],
            fixes:[
              { t:"`f″ > 0` means concave up (a cup), so (2, −20) is a local min; `f″(-1) < 0` makes (−1, 7) a local max.", ok:true, why:M3 },
              { t:"`f″(2) = 18` means the max value is 18.", why:"`f″` gives the shape, not the value." },
              { t:"The test fails because `f″(2) != 0`.", why:"The test works when `f″ != 0`." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["What shape does `f″ > 0` give?", "Concave up: ∪.", "The bottom of a ∪ is a minimum."] },
          { id:"e3", goal:4, task:"Classify the critical point of `f(x) = (x - 1)^4 + 2`.",
            steps:["`f′(x) = 4(x - 1)^3`.", "The critical number is `x = 1`.", "`f″(x) = 12(x - 1)^2`, so `f″(1) = 0`.", "`f″(1) = 0`, so (1, 2) is a point of inflection."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`f″(1) = 0` means the second derivative test gives no conclusion. `f′` changes from − to + at 1, so (1, 2) is a local minimum; `f″ >= 0` on both sides, so it’s not a point of inflection.", ok:true, why:M1 },
              { t:"(1, 2) is a local maximum.", why:"`f′` goes from − to +." },
              { t:"There’s no critical point.", why:"`f′(1) = 0`." },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["What does the test say when `f″(c) = 0`?", "Nothing. Use the first derivative test.", "− then +: a local min."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the bend detector: the tangent crossing the curve, `x^4` with no inflection, or `∛x` having one?" },
      { id:"j2", q:"In your own words, how are ‘concave up’, ‘slopes increasing’ and ‘`f″ > 0`’ the same idea?" },
      { id:"j3", q:"Explain to a friend how to check whether a point where `f″ = 0` is really a point of inflection." },
      { id:"j4", q:"When would you choose the first derivative test over the second? What are you still unsure about?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"On which interval is `f(x) = x^3 - 9x^2 + 5` concave down?", options:[
          { t:"`(-∞, 3)`", ok:true, why:"`f″ = 6x - 18 < 0` when `x < 3`." },
          { t:"`(3, ∞)`", why:"That’s where `f″ > 0`." },
          { t:"`(0, 6)`", why:"That’s where `f′ = 3x(x - 6) < 0`: decreasing, not concave down. " + M2 },
          { t:"`(-∞, 0)` and `(6, ∞)`", why:"That’s where `f` increases. " + M2 }] },
        b:{ prompt:"On which interval is `f(x) = x^3 + 6x^2 - 2` concave down?", options:[
          { t:"`(-∞, -2)`", ok:true, why:"`f″ = 6x + 12 < 0` when `x < -2`." },
          { t:"`(-2, ∞)`", why:"That’s where `f″ > 0`." },
          { t:"`(-4, 0)`", why:"That’s where `f` decreases. " + M2 },
          { t:"`(-∞, -4)` and `(0, ∞)`", why:"That’s where `f` increases. " + M2 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What are the points of inflection of `f(x) = x^4 - 6x^2 + 1`?", options:[
          { t:"(−1, −4) and (1, −4)", ok:true, why:"`f″ = 12(x - 1)(x + 1)` changes sign at ±1; `f(±1) = -4`." },
          { t:"(0, 1) only", why:"That’s where `f′ = 0` (a local max). " + M6 },
          { t:"(−√3, −8) and (√3, −8)", why:"Those are the local minimums. " + M6 },
          { t:"(−1, 0) and (1, 0)", why:"The `y`-value is `f(±1)`, not `f″(±1)`." }] },
        b:{ prompt:"What are the points of inflection of `f(x) = x^4 - 24x^2 + 3`?", options:[
          { t:"(−2, −77) and (2, −77)", ok:true, why:"`f″ = 12(x - 2)(x + 2)`." },
          { t:"(0, 3) only", why:"That’s where `f′ = 0` (a local max). " + M6 },
          { t:"(−2√3, −141) and (2√3, −141)", why:"Those are the local minimums. " + M6 },
          { t:"(−2, 0) and (2, 0)", why:"The `y`-value is `f(±2)`, not `f″(±2)`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`f′(4) = 0` and `f″(4) = -3`. What does `f` have at `x = 4`?", options:[
          { t:"A local maximum", ok:true, why:"Concave down at a stationary point: a cap." },
          { t:"A local minimum", why:"`f″ < 0` means concave down, a cap shape: that’s a local <strong>maximum</strong>." },
          { t:"A point of inflection", why:"`f″(4) != 0` and the concavity doesn’t change there." },
          { t:"No conclusion is possible", why:"The test is silent only when `f″(c) = 0`." }] },
        b:{ prompt:"`f′(-1) = 0` and `f″(-1) = 5`. What does `f` have at `x = -1`?", options:[
          { t:"A local minimum", ok:true, why:"Concave up at a stationary point: a cup." },
          { t:"A local maximum", why:M3 },
          { t:"A point of inflection", why:"`f″(-1) != 0` and the concavity doesn’t change there." },
          { t:"No conclusion is possible", why:"The test is silent only when `f″(c) = 0`." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Which is a point of inflection of `f(x) = x^{5/3} - 5x^{2/3}`?", options:[
          { t:"(−1, −6) only", ok:true, why:"`f″ = {10}/{9}x^{-4/3}(x + 1)`: it changes sign at −1. At 0 it’s undefined but positive on both sides." },
          { t:"(0, 0) only, where `f″` doesn’t exist", why:"`f″ > 0` on both sides of 0: no change." },
          { t:"(−1, −6) and (0, 0)", why:"Undefined isn’t enough: the sign must change." },
          { t:"(2, −3∛4), where `f′ = 0`", why:M6 }] },
        b:{ prompt:"Which is a point of inflection of `f(x) = x^{5/3} + 5x^{2/3}`?", options:[
          { t:"(1, 6) only", ok:true, why:"`f″ = {10}/{9}x^{-4/3}(x - 1)`." },
          { t:"(0, 0) only, where `f″` doesn’t exist", why:"`f″ < 0` on both sides of 0: no change." },
          { t:"(1, 6) and (0, 0)", why:"Undefined isn’t enough: the sign must change." },
          { t:"(−2, 3∛4), where `f′ = 0`", why:M6 }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"`f′(x) = x^2 - 4x`. Which statement about `f` is true?", options:[
          { t:"`f` is concave down on `(-∞, 2)` and up on `(2, ∞)`, with a point of inflection at `x = 2`", ok:true, why:"`f″ = 2x - 4`." },
          { t:"`f` is concave up on `(-∞, 0)` and `(4, ∞)`", why:"That’s where `f′ > 0`, so `f` increases. " + M2 },
          { t:"`f` has points of inflection at `x = 0` and `x = 4`", why:"Those are the zeros of `f′`: the max and min of `f`. " + M6 },
          { t:"`f` is concave down on `(0, 4)`", why:"That’s where `f` decreases. " + M2 }] },
        b:{ prompt:"`f′(x) = 6x - x^2`. Which statement about `f` is true?", options:[
          { t:"`f` is concave up on `(-∞, 3)` and down on `(3, ∞)`, with a point of inflection at `x = 3`", ok:true, why:"`f″ = 6 - 2x`." },
          { t:"`f` is concave up on `(0, 6)`", why:"That’s where `f′ > 0`, so `f` increases. " + M2 },
          { t:"`f` has points of inflection at `x = 0` and `x = 6`", why:"Those are the zeros of `f′`: the min and max of `f`. " + M6 },
          { t:"`f` is concave down on `(-∞, 0)` and `(6, ∞)`", why:"That’s where `f` decreases. " + M2 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which is true for `f(x) = x^2 + 16/x`?", options:[
          { t:"It has a local min at (2, 12), and `f″(2) = 6 > 0` confirms it", ok:true, why:"`f′ = 2x - 16/x^2 = 0` at `x = 2`; `f″ = 2 + 32/x^3`." },
          { t:"It has a local max at (2, 12), since `f″(2) = 6`", why:M3 },
          { t:"It has a local min at (2, 12) and a point of inflection at `x = 0`", why:"0 isn’t in the domain." },
          { t:"It has a local min at (2, 12) and a local max at `x = -2`", why:"`x^3 = 8` has only one real solution; `f′(-2) = -8`." }] },
        b:{ prompt:"Which is true for `f(x) = x^2 + 54/x`?", options:[
          { t:"It has a local min at (3, 27), and `f″(3) = 6 > 0` confirms it", ok:true, why:"`x^3 = 27`; `f″ = 2 + 108/x^3`." },
          { t:"It has a local max at (3, 27), since `f″(3) = 6`", why:M3 },
          { t:"It has a local min at (3, 27) and a point of inflection at `x = 0`", why:"0 isn’t in the domain." },
          { t:"It has a local min at (3, 27) and a local max at `x = -3`", why:"`x^3 = 27` has only one real solution; `f′(-3) = -12`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of what ‘concave down on an interval’ means?", options:[
          { t:"“As `x` increases, the slopes of the tangents decrease, so `f′` is decreasing and the curve lies below its tangent lines.”", ok:true, why:"Concave down is about the slopes decreasing: `f′` decreasing, `f″ < 0`." },
          { t:"“The function is decreasing on the interval.”", why:M2 },
          { t:"“`f″ = 0` on the interval.”", why:"`f″ < 0` on the interval." },
          { t:"“The curve has a maximum on the interval.”", why:"`y = √x` is concave down and has no maximum." }] },
        b:{ prompt:"Which is the best description of what ‘concave up on an interval’ means?", options:[
          { t:"“As `x` increases, the slopes of the tangents increase, so `f′` is increasing and the curve lies above its tangent lines.”", ok:true, why:"Concave up is about the slopes increasing: `f′` increasing, `f″ > 0`." },
          { t:"“The function is increasing on the interval.”", why:M2 },
          { t:"“`f′ > 0` on the interval.”", why:"That’s increasing. " + M2 },
          { t:"“The curve has a minimum on the interval.”", why:"`y = 1/x` for `x > 0` is concave up and has no minimum." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which statement correctly justifies that (0, 0) is a point of inflection of `f(x) = x^5 + x`?", options:[
          { t:"“`f″(x) = 20x^3` changes from negative to positive at `x = 0`, and (0, 0) is on the graph, so the concavity changes at that point.”", ok:true, why:"A sign change of `f″` at a point on the graph." },
          { t:"“`f″(0) = 0`, so (0, 0) is a point of inflection.”", why:M1 },
          { t:"“`f′(0) = 0`, so it’s a flat point of inflection.”", why:"`f′(0) = 1`." },
          { t:"“`f` changes from decreasing to increasing at 0.”", why:"`f′ = 5x^4 + 1 > 0`: always increasing. " + M2 }] },
        b:{ prompt:"Which statement correctly justifies that (1, −2) is a point of inflection of `f(x) = x^3 - 3x^2`?", options:[
          { t:"“`f″(x) = 6x - 6` changes from negative to positive at `x = 1`, and (1, −2) is on the graph.”", ok:true, why:"A sign change of `f″` at a point on the graph." },
          { t:"“`f″(1) = 0`, so (1, −2) is a point of inflection.”", why:M1 },
          { t:"“`f′(1) = 0`, so it’s a flat point of inflection.”", why:"`f′(1) = -3`." },
          { t:"“`f` changes from increasing to decreasing at 1.”", why:"`f′(1) = -3`: `f` is decreasing on both sides of 1. " + M2 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"`N(t) = -t^3 + 9t^2 + 3t` is the number of people (in hundreds) who have heard a rumour `t` days after it starts, `0 <= t <= 6`. When is the rumour spreading fastest, and how fast?", options:[
          { t:"Day 3, at 3000 people per day", ok:true, why:"`N″ = -6t + 18 = 0` at `t = 3`, changing from + to −; `N′(3) = -27 + 54 + 3 = 30` hundred per day." },
          { t:"Day 3, at 6300 people per day", why:"`N(3) = 63` hundred is the number who have heard, not the rate." },
          { t:"Day 3, at 30 people per day", why:"`N` is in hundreds: 30 hundred = 3000." },
          { t:"About day 6.2, when `N′ = 0`", why:"`N′ = 0` is when the spreading stops (the max of `N`), not when it’s fastest." }] },
        b:{ prompt:"`N(t) = -t^3 + 12t^2 + 4t` (hundreds of people), `0 <= t <= 8`. When is the rumour spreading fastest, and how fast?", options:[
          { t:"Day 4, at 5200 people per day", ok:true, why:"`N″ = -6t + 24 = 0` at `t = 4`; `N′(4) = -48 + 96 + 4 = 52` hundred per day." },
          { t:"Day 4, at 14 400 people per day", why:"`N(4) = 144` hundred." },
          { t:"Day 4, at 52 people per day", why:"Hundreds." },
          { t:"About day 8.2, when `N′ = 0`", why:"`N′ = 0` is when the spreading stops (the max of `N`), not when it’s fastest." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A town’s population (thousands) `t` years after 2020 is `P(t) = 40 + 6t - t^2/4` for `0 <= t <= 10`. Which describes the population over this decade?", options:[
          { t:"It grew every year, but by less each year", ok:true, why:"`P′ = 6 - t/2 > 0` for `t < 12`; `P″ = -1/2 < 0`." },
          { t:"It grew by more each year", why:"`P″ < 0`: the growth rate decreases." },
          { t:"It grew, then shrank", why:"`P′ = 0` only at `t = 12`, after the decade." },
          { t:"It shrank by less each year", why:"`P′ > 0`: it grew." }] },
        b:{ prompt:"`P(t) = 60 - 8t + t^2/2` (thousands) for `0 <= t <= 6`. Which describes the population?", options:[
          { t:"It shrank every year, but by less each year", ok:true, why:"`P′ = -8 + t < 0` for `t < 8`; `P″ = 1 > 0`." },
          { t:"It shrank by more each year", why:"`P″ > 0`: the rate is rising toward 0." },
          { t:"It shrank, then grew", why:"`P′ = 0` only at `t = 8`." },
          { t:"It grew by more each year", why:"`P′ < 0`: it shrank." }] } }
    ]
  },
  task:{
    title:"Design a bend", summary:"Design a bend",
    statement:"<p>Choose `b` and `c` so that `f(x) = x^4 + bx^3 + cx^2` meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has a point of inflection at `x = 1`.</li><li>`f` has exactly two points of inflection.</li><li>`f` has a local minimum at `x = 0`.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −12 to 12. The graph shows `f` with its points of inflection ringed, and `f″` beneath it.</p>",
    checks:["Point of inflection at `x = 1`", "Exactly two points of inflection", "Local minimum at `x = 0`"],
    tips:["`f″ = 12x^2 + 6bx + 2c`. Substitute `x = 1`.",
      "`f″` must have two different zeros: a double zero means no sign change.",
      "`f′(0)` is always 0 here. The second derivative test needs `f″(0) > 0`."],
    explainPrompt:"Explain how each condition limited `b` and `c`, and why `b = -4` doesn’t work.",
    vocab:"Use the words point of inflection, sign change, second derivative test and concave up.",
    more:"There’s more than one answer. Find them all.",
    after3:"Line 1 forces `c = -6 - 3b`. Line 3 needs `c > 0`, so `b < -2`, and the range caps `c` at 12. `b = -4` fails: `f″ = 12(x - 1)^2`, a double zero."
  },
  cards:[
    ["Concave up", "Slopes increase; `f′` increasing; `f″ > 0`; the curve lies above its tangents (∪)."],
    ["Concave down", "Slopes decrease; `f′` decreasing; `f″ < 0`; the curve lies below its tangents (∩)."],
    ["Point of inflection", "A point on the graph where the concavity changes."],
    ["Candidates", "`f″ = 0` or `f″` undefined, but only if the sign of `f″` changes."],
    ["`y = x^4`", "`f″(0) = 0` but no inflection: concave up on both sides."],
    ["`y = ∛x`", "Inflection at (0, 0) where `f″` doesn’t exist."],
    ["`y = 1/x`", "Concavity changes at 0, but 0 isn’t in the domain: no inflection."],
    ["Second derivative test", "`f′(c) = 0`: `f″(c) > 0` gives a min; `f″(c) < 0` gives a max; `f″(c) = 0` gives no conclusion."],
    ["Tangent at an inflection", "Crosses the curve."],
    ["Inflection and `f′`", "`f′` has a local max or min there: the steepest or least steep moment."],
    ["Fastest growth", "Where `f″` changes from + to − (the max of `f′`)."],
    ["“Increasing at a decreasing rate”", "`f′ > 0` and `f″ < 0`: rising and concave down."]
  ]
};
