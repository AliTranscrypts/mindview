// MCV4U 02 Slope of a Tangent to a Curve. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/02-slope-of-a-tangent.md
const LIM = '<span class="tg-lim"><span class="tg-lt">lim</span> <span class="tg-lu">`h → 0`</span></span>';
const DQ = "`{f(a + h) - f(a)}/{h}`";
const Q1FB = "Slope 2(−1) = −2; `y - 1 = -2(x + 1)`.";
const Q2FB = "`2a = 6` gives `a = 3`, and the point is (3, 3²).";
const Q3FB = "A corner: the two one-sided slopes disagree.";
const Q4FB = "A tangent matches the slope at the point; crossing is allowed.";

export default {
  id:"02-slope-of-a-tangent",
  kind:"topic",
  title:"Slope of a tangent to a curve",
  topic:"Slope of a Tangent to a Curve",
  readyTopic:"the slope of a tangent",
  hero:{
    eq:'<span class="tg-hw">slope of the tangent at `a` =</span> ' + LIM + ' <span class="tg-qbox">' + DQ + "</span>",
    eqLabel:"Slope of the tangent at a equals the limit, as h approaches 0, of f of a plus h, minus f of a, all over h.",
    eqSize:"sm",
    headline:"Squeeze the secant until it becomes the tangent",
    text:"A <strong>secant</strong> joins two points on a curve; its slope is an average rate of change. Slide the second point toward the first and the secant turns into the <strong>tangent</strong>, the line that matches the curve’s direction at that point. Its slope is what the <strong>difference quotient</strong> approaches as `h` gets close to 0.",
    fig:{ aria:"The parabola y = x squared with P at (2, 4). Q slides down the curve toward P from the right, then from the left, and the secant settles into the tangent with slope 4." }
  },
  goals:[
    "I can calculate the slope of a secant and connect it to the average rate of change.",
    "I can estimate the slope of a tangent with secants on shrinking intervals from both sides.",
    "I can write and simplify the difference quotient " + DQ + ".",
    "I can find the exact slope of a tangent by letting `h → 0` in the simplified quotient.",
    "I can write the equation of a tangent and find the point where the tangent has a given slope.",
    "I can recognize points where a graph has no tangent."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Slopes and lines", goal:1, prompt:"What is the slope of the line through (1, 3) and (4, 12)?",
          options:[
            { t:"3", ok:true, why:"(12 − 3)/(4 − 1) = 9/3." },
            { t:"1/3", why:"That’s run over rise. Slope is rise ÷ run." },
            { t:"−3", why:"You subtracted in opposite orders. Keep the same order on top and bottom." },
            { t:"9", why:"That’s the rise only. Divide by the run, 3." }],
          hints:["Slope = `Δy/Δx`.", "`Δy = 9`, `Δx = 3`.", "3."] },
        { id:"w2", skill:"Slopes and lines", goal:5, prompt:"Which is the equation of the line with slope −2 through (3, 1)?",
          options:[
            { t:"`y = -2x + 7`", ok:true, why:"`y - 1 = -2(x - 3)`." },
            { t:"`y = -2x + 1`", why:"That uses the point’s `y`-value as the intercept, but (3, 1) isn’t on the `y`-axis." },
            { t:"`y = -2x - 5`", why:"That’s `y - 1 = -2(x + 3)`. Use `x - 3` for the point (3, 1)." },
            { t:"`y = -2x + 5`", why:"An arithmetic slip: `y = -2x + 6 + 1`." }],
          hints:["Use `y - y_1 = m(x - x_1)`.", "`y - 1 = -2(x - 3)`.", "`y = -2x + 7`."] },
        { id:"w3", skill:"Function notation", goal:3, prompt:"`f(x) = x^2 + 1`. Simplify `f(2 + h)`.",
          options:[
            { t:"`h^2 + 4h + 5`", ok:true, why:"`(2 + h)^2 + 1 = 4 + 4h + h^2 + 1`." },
            { t:"`h^2 + 5`", why:"That uses `(2 + h)^2 = 4 + h^2`. Squaring a sum gives a middle term." },
            { t:"`5 + h`", why:"That’s `f(2) + h`. Substitute `2 + h` for `x`." },
            { t:"`h^2 + 2h + 5`", why:"The middle term is `2 · 2 · h = 4h`." }],
          hints:["Replace every `x` with `(2 + h)`.", "`(2 + h)^2 + 1`.", "`h^2 + 4h + 5`."] },
        { id:"w4", skill:"Function notation", goal:3, prompt:"`f(x) = 3x - 4`. Simplify `f(a + h) - f(a)`.",
          options:[
            { t:"`3h`", ok:true, why:"`3a + 3h - 4 - (3a - 4)`." },
            { t:"`3h - 8`", why:"The minus wasn’t distributed: `-(3a - 4) = -3a + 4`." },
            { t:"`h`", why:"That uses `f(a + h) = f(a) + h`. Multiply `a + h` by 3." },
            { t:"`3a + 3h - 4`", why:"That forgets to subtract `f(a)`. Subtract `f(a) = 3a - 4`." }],
          hints:["Find `f(a + h)` first.", "`3(a + h) - 4 = 3a + 3h - 4`.", "Subtract `3a - 4`: `3h`."] },
        { id:"w5", skill:"Algebra with <i>h</i>", goal:3, prompt:"Expand `(3 + h)^2`.",
          options:[
            { t:"`9 + 6h + h^2`", ok:true, why:"Three terms." },
            { t:"`9 + h^2`", why:"Squaring a sum gives a middle term: `2 · 3 · h`." },
            { t:"`9 + 3h + h^2`", why:"The middle term wasn’t doubled: `(3 + h)(3 + h)` has two `3h` terms." },
            { t:"`9 + 6h`", why:"The `h^2` was dropped: `h · h = h^2`." }],
          hints:["`(3 + h)(3 + h)`.", "`9 + 3h + 3h + h^2`.", "`9 + 6h + h^2`."] },
        { id:"w6", skill:"Algebra with <i>h</i>", goal:4, prompt:"Simplify `{8h + h^2}/{h}`, where `h ≠ 0`.",
          options:[
            { t:"`8 + h`", ok:true, why:"Factor out `h`: `{h(8 + h)}/{h}`." },
            { t:"`8 + h^2`", why:"Only the first term was divided. Both terms share the factor `h`." },
            { t:"`9h`", why:"`8h` and `h^2` aren’t like terms." },
            { t:"8", why:"Every `h` was cancelled, but `h^2/h = h`, not 0." }],
          hints:["Factor the numerator.", "`h(8 + h)`.", "`8 + h`."] }
      ],
      refreshers:{
        "Slopes and lines":"Slope = `{y_2 - y_1}/{x_2 - x_1}`. A line through `(x_1, y_1)` with slope `m` is `y - y_1 = m(x - x_1)`; expand to get `y = mx + b`.",
        "Function notation":"`f(2 + h)` means put `(2 + h)` wherever `x` appears. For `f(x) = x^2 - x`: `f(2 + h) = (2 + h)^2 - (2 + h) = 2 + 3h + h^2`.",
        "Algebra with <i>h</i>":"`(a + h)^2 = a^2 + 2ah + h^2`. To divide by `h`, factor it out of every term first: `{6h - h^2}/{h} = 6 - h`."
      }
    }
  },
  explore:{
    heading:"Secant squeeze",
    intro:"Fix P on the curve, then slide Q toward it from either side. Watch the secant slopes in the table, and compare them with the algebra.",
    predictions:[
      { id:"p1", prompt:"`f(x) = x^2`, `a = 2`, `h = 1` (slope 5). As `h` shrinks toward 0.001, what happens to the secant slope?",
        options:[{ t:"It decreases toward 4", ok:true }, { t:"It increases toward 6" }, { t:"It decreases toward 0" }, { t:"It stays 5" }],
        explain:"The table fills 5, 4.5, 4.1, 4.01, 4.001. The simplified quotient is `4 + h`, so the slope approaches 4." },
      { id:"p2", prompt:"Flip to `h = -1` (slope 3). From the left, the slopes …",
        options:[{ t:"increase toward 4", ok:true }, { t:"decrease toward 2" }, { t:"approach a different number from the right-hand side" }, { t:"stay 3" }],
        explain:"The left column fills 3, 3.5, 3.9, 3.99, 3.999. On a smooth curve both sides squeeze the same tangent slope." },
      { id:"p3", prompt:"`f(x) = x^3`, `a = 1`, Algebra mode, with `f(1 + h) = 1 + 3h + 3h^2 + h^3` shown. What does the simplified quotient look like?",
        options:[{ t:"`3 + 3h + h^2`", ok:true }, { t:"`3h + 3h^2 + h^3`" }, { t:"`1 + 3h`" }, { t:"0/0" }],
        explain:"Subtract `f(1) = 1`, then divide every term by `h`: the tangent slope is 3. Forgetting to divide leaves the rise, not the slope." },
      { id:"p4", prompt:"`f(x) = |x - 1| + 1`, `a = 1`. What do the secant slopes do as `h → 0` from each side?",
        options:[{ t:"Right side always 1, left side always −1: no single tangent", ok:true }, { t:"Both approach 0" }, { t:"Both approach 1" }, { t:"They approach 0 from both sides, so the tangent is horizontal" }],
        explain:"The zoom never straightens; the corner stays sharp. A corner has two different one-sided slopes." }
    ],
    chalIntro:"Use the secant squeeze to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"`f(x) = x^2`, `a = 2`. Set `h` so that the secant slope is exactly 4.5.",
        why:"The secant slope is `4 + h`, and `4 + 0.5 = 4.5`.",
        hints:["Switch to Algebra mode.", "The secant slope is `4 + h`.", "`4 + h = 4.5`, so `h = 0.5`."] },
      { id:"tc2", goal:4, prompt:"`f(x) = {1}/{x}`, `a = 1`. Find the exact slope of the tangent. Assemble the simplified quotient from the chips in the <strong>Exact slope</strong> box below the controls, then enter the slope.",
        why:"`{1}/{1 + h} - 1 = {-h}/{1 + h}`, so the quotient is `{-1}/{1 + h}`, which approaches −1 as `h → 0`.",
        hints:["`{1/(1 + h) - 1}/{h}`: combine the top over a common denominator.", "The top is `{-h}/{1 + h}`, so the quotient is `{-1}/{1 + h}`.", "As `h → 0`, `{-1}/{1 + h} → -1`."] },
      { id:"tc3", goal:5, stretch:true, prompt:"`f(x) = x^2 - 4x`. Move P so that the tangent is <strong>parallel</strong> to the secant joining (0, 0) and (5, 5) on the curve.",
        why:"The secant’s slope is 1 and the tangent’s slope at `a` is `2a - 4`. `2a - 4 = 1` gives `a = 2.5`.",
        hints:["Parallel means equal slopes. Find the secant’s slope first.", "The secant slope is (5 − 0)/(5 − 0) = 1. The simplified quotient at `a` is `2a - 4 + h`.", "`2a - 4 = 1` gives `a = 2.5`."] }
    ]
  },
  part3:{
    slug:"tangent-line", name:"Tangent lines",
    heading:"Tangent lines and where they fail",
    intro:"Turn a slope into a line, work backwards from a slope to a point, then look at two cases people misread: a corner with no tangent, and a tangent that crosses the curve. Work through the three stations, then try the quick check.",
    quickCheck:{
      title:"Quick check", summary:"Tangent lines quick check",
      items:[
        { id:"q1", goal:5, prompt:"Tangent to `y = x^2` at (−1, 1)?",
          choices:[
            { t:"`y = -2x - 1`", ok:true, fb:"Right. " + Q1FB + " So `y = -2x - 1`." },
            { t:"`y = -2x + 1`", fb:Q1FB },
            { t:"`y = 2x + 3`", fb:Q1FB },
            { t:"`y = -x`", fb:Q1FB }] },
        { id:"q2", goal:5, prompt:"On `y = x^2`, where is the tangent slope 6?",
          choices:[
            { t:"(3, 9)", ok:true, fb:"Right. " + Q2FB },
            { t:"(6, 36)", fb:Q2FB },
            { t:"(3, 6)", fb:Q2FB },
            { t:"(9, 81)", fb:Q2FB }] },
        { id:"q3", goal:6, prompt:"Does `y = |x + 2|` have a tangent at `x = -2`?",
          choices:[
            { t:"No: the slopes are −1 and 1", ok:true, fb:"Right. " + Q3FB },
            { t:"Yes, slope 0", fb:Q3FB },
            { t:"Yes, slope 1", fb:Q3FB },
            { t:"Yes, slope −1", fb:Q3FB }] },
        { id:"q4", goal:6, prompt:"The tangent to `y = x^3` at (0, 0) is `y = 0`. Does it cross the curve?",
          choices:[
            { t:"Yes, and it’s still a tangent", ok:true, fb:"Right. " + Q4FB },
            { t:"No, tangents never cross", fb:Q4FB },
            { t:"It crosses, so it isn’t a tangent", fb:Q4FB },
            { t:"It touches at two points", fb:Q4FB }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sectab", type:"numeric", title:"Secant table", summary:"Secant table", goal:[1, 2],
        instruction:"Find each secant slope, then estimate the tangent slope.",
        items:[
          { id:"s1", goal:1, prompt:"`f(x) = x^2 + 1`, `a = 1`, `h = 0.1`: secant slope", answer:2.1, display:"2.1",
            why:"`f(1.1) = 2.21` and `f(1) = 2`, so the slope is 0.21 ÷ 0.1 = 2.1.",
            wrong:[{ match:0.21, fb:"Divide the rise by `h = 0.1`." }],
            hints:["Find `f(1.1)` and `f(1)`.", "`f(1.1) = 2.21` and `f(1) = 2`, so the rise is 0.21.", "0.21 ÷ 0.1 = 2.1."] },
          { id:"s2", goal:1, prompt:"Same, `h = -0.1`", answer:1.9, display:"1.9",
            why:"`f(0.9) = 1.81`, so the slope is (1.81 − 2) ÷ (−0.1) = 1.9.",
            wrong:[{ match:2.1, fb:"A negative `h` uses the point on the left." }],
            hints:["With `h = -0.1`, Q is at `x = 0.9`.", "`f(0.9) = 1.81`, so the rise is 1.81 − 2 = −0.19.", "−0.19 ÷ (−0.1) = 1.9."] },
          { id:"s3", goal:2, prompt:"Estimate the tangent slope at `a = 1`", answer:2, display:"2",
            why:"From the right 2.1, from the left 1.9: both sides squeeze 2.",
            wrong:[{ match:2.1, fb:"That’s one secant. Both sides squeeze 2." }],
            hints:["Compare the slopes from both sides: 2.1 and 1.9.", "The simplified quotient is `2 + h`.", "Both sides squeeze 2."] },
          { id:"s4", goal:1, prompt:"`f(x) = 2x^2 - x`, `a = -1`, `h = 0.01`: secant slope", answer:-4.98, display:"−4.98",
            why:"The quotient is `-5 + 2h`, and `-5 + 0.02 = -4.98`.",
            wrong:[{ match:-5, fb:"That’s the tangent slope; the secant slope is `-5 + 2h`." }],
            hints:["Simplify the quotient for `2x^2 - x` at `a`: `4a - 1 + 2h`.", "At `a = -1`: `-5 + 2h`.", "`h = 0.01`: −4.98."] },
          { id:"s5", goal:2, prompt:"Tangent slope at `a = -1`", answer:-5, display:"−5",
            why:"`-5 + 2h → -5` as `h → 0`.",
            wrong:[{ match:3, fb:"`f(-1) = 3` is a height, not a slope." }],
            hints:["The quotient at `a = -1` is `-5 + 2h`.", "Let `h → 0`.", "The slope is −5."] },
          { id:"s6", goal:1, prompt:"`f(x) = 5 - x^3`, `a = 2`, `h = -0.1`: secant slope", answer:-11.41, display:"−11.41",
            why:"`-(12 + 6h + h^2)` at `h = -0.1` is `-(12 - 0.6 + 0.01) = -11.41`.",
            wrong:[{ match:11.41, fb:"The function is `5 - x^3`, so the slope is negative." }],
            hints:["The quotient for `-x^3` is `-(3a^2 + 3ah + h^2)`.", "At `a = 2`: `-(12 + 6h + h^2)`.", "`h = -0.1`: `-(12 - 0.6 + 0.01) = -11.41`."] }
        ] },
      { id:"simp", type:"custom", title:"Simplify, then let <i>h</i> shrink", summary:"Simplify, then let h shrink", star:true, goal:[3, 4, 5],
        instruction:"Simplify the difference quotient " + DQ + ", then let `h → 0`. Fill in the boxes.",
        how:"Type whole numbers or fractions such as −1/4 in the boxes. A box in front of `h` takes the coefficient, with its sign (−6 for −6<i>h</i>).",
        items:[
          { id:"d1", goal:[3, 4], frame:"lin", fn:"d1", a:4, prompt:"`f(x) = x^2 - 3x`, `a = 4`: simplified quotient and tangent slope",
            answer:{ q:[5, 1], m:"5" },
            why:"`{(4 + h)^2 - 3(4 + h) - 4}/{h} = {5h + h^2}/{h} = 5 + h`, which approaches 5.",
            wrong:[{ m:"4", fb:"`f(4) = 4` is the height." }],
            hints:["Expand `f(4 + h) = (4 + h)^2 - 3(4 + h)` and subtract `f(4) = 4`.", "`f(4 + h) - f(4) = 5h + h^2`.", "`{5h + h^2}/{h} = 5 + h`, which approaches 5."] },
          { id:"d2", goal:[3, 4], frame:"quad", fn:"d2", a:-2, prompt:"`f(x) = x^3`, `a = -2`",
            answer:{ q:[12, -6, 1], m:"12" },
            why:"`3a^2 + 3ah + h^2` at `a = -2` is `12 - 6h + h^2`, which approaches 12.",
            wrong:[{ m:"−12", fb:"`3a^2` is positive." }],
            hints:["The quotient for `x^3` is `3a^2 + 3ah + h^2`.", "At `a = -2`: `12 - 6h + h^2`.", "As `h → 0`, the slope is 12."] },
          { id:"d3", goal:[3, 4], star:true, frame:"rat", fn:"d3", a:1, prompt:"`f(x) = {1}/{x + 1}`, `a = 1`",
            answer:{ q:{ n:-1, k:2, c:2 }, m:"-1/4" },
            why:"`{1}/{2 + h} - {1}/{2} = {-h}/{2(2 + h)}`, so the quotient is `{-1}/{2(2 + h)}`, which approaches `-{1}/{4}`.",
            wrong:[{ m:"1/4", fb:"`{1}/{2 + h} - {1}/{2} = {-h}/{2(2 + h)}`." }],
            hints:["Combine `{1}/{2 + h} - {1}/{2}` over `2(2 + h)`.", "The top is `2 - (2 + h) = -h`.", "`{-1}/{2(2 + h)} → -{1}/{4}`."] },
          { id:"d4", goal:[3, 4], star:true, frame:"root", fn:"d4", a:9, prompt:"`f(x) = √x`, `a = 9` (rationalize, as in 01)",
            answer:{ q:{ n:1, r:9, c:3 }, m:"1/6" },
            why:"`{√{9 + h} - 3}/{h} · {√{9 + h} + 3}/{√{9 + h} + 3} = {h}/{h(√{9 + h} + 3)} = {1}/{√{9 + h} + 3}`, which approaches `{1}/{6}`.",
            wrong:[{ m:"1/3", fb:"The denominator approaches 3 + 3." }],
            hints:["Multiply the top and bottom by `√{9 + h} + 3`.", "The top becomes `(9 + h) - 9 = h`, which cancels.", "`{1}/{√{9 + h} + 3} → {1}/{3 + 3} = {1}/{6}`."] },
          { id:"d5", goal:5, star:true, frame:"b", prompt:"For `f(x) = x^2 + bx`, the tangent at `x = 1` has slope 7. Find `b`.",
            answer:{ m:"5" },
            why:"The quotient at 1 is `2 + b + h`, so the slope is `2 + b = 7` and `b = 5`.",
            wrong:[{ m:"7", fb:"The slope is `2(1) + b`." }],
            hints:["Find the quotient for `x^2 + bx` at `x = 1`.", "It simplifies to `2 + b + h`, so the slope is `2 + b`.", "`2 + b = 7`, so `b = 5`."] },
          { id:"d6", goal:5, star:true, frame:"pts", prompt:"Find every point on `y = x^2 - 2x` whose tangent passes through (2, −1).",
            answer:{ pts:[[1, -1], [3, 3]] },
            why:"The tangent at `a` is `y = (2a - 2)(x - a) + a^2 - 2a`. Through (2, −1): `a^2 - 4a + 3 = 0`, so `a = 1` or 3.",
            wrong:[{ only:[1, -1], fb:"There’s a second tangent through (2, −1)." }],
            hints:["The tangent at `a` has slope `2a - 2` and passes through `(a, a^2 - 2a)`.", "Substitute (2, −1) into `y = (2a - 2)(x - a) + a^2 - 2a`: `-1 = -a^2 + 4a - 4`.", "`a^2 - 4a + 3 = 0`, so `a = 1` or 3: points (1, −1) and (3, 3)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Bianca", how:"", goal:[3, 4, 5],
        instruction:"Bianca made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the slope of the tangent to `f(x) = x^2 + 3` at `x = 2`.",
            steps:["`{f(2 + h) - f(2)}/{h} = {(2 + h)^2 + 3 - 7}/{h}`", "`= {4 + h^2 + 3 - 7}/{h}`", "`= {h^2}/{h} = h`", "As `h → 0`, the slope is 0."],
            answer:1,
            stepFb:["Step 1 is correct: `f(2) = 7`. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"`(2 + h)^2 = 4 + 4h + h^2`, so the quotient is `4 + h` and the slope is 4.", ok:true, why:"Squaring a sum gives a middle term: `(2 + h)^2 = 4 + 4h + h^2`." },
              { t:"`(2 + h)^2 = 4 + 2h + h^2`, so the slope is 2.", why:"The middle term is `2 · 2 · h = 4h`." },
              { t:"Steps 2 to 4 are right; the slope is 0.", why:"`(2 + h)^2` has a middle term, `4h`, so step 2 is wrong." },
              { t:"Step 1 should use `f(2) = 4`.", why:"`f(2) = 4 + 3 = 7`." }],
            hints:["Expand `(2 + h)^2` carefully.", "There’s a middle term, `4h`.", "`4 + h → 4`."] },
          { id:"e2", goal:4, task:"Find the slope of the tangent to `f(x) = 3x^2` at `x = -1`.",
            steps:["Quotient: `{3(-1 + h)^2 - 3(-1)^2}/{h}`", "`= {3(1 - 2h + h^2) - 3}/{h}`", "`= {-6h + 3h^2}/{h}`", "Substitute `h = 0`: 0/0, so there’s no tangent."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Simplify first: `-6 + 3h`. Then let `h → 0`: the slope is −6.", ok:true, why:"At `h = 0` the quotient is 0/0, which has no value. Simplify first, then let `h → 0`." },
              { t:"0/0 = 0, so the slope is 0.", why:"0/0 has no value. Simplify first, then let `h → 0`." },
              { t:"The slope is 6.", why:"Check the sign: `-6h/h = -6`." },
              { t:"Step 4 is correct.", why:"0/0 means simplify first, not ‘no tangent’." }],
            hints:["Can you divide by `h` before substituting?", "`{-6h + 3h^2}/{h} = -6 + 3h`.", "−6."] },
          { id:"e3", goal:5, task:"Find the equation of the tangent to `y = x^2 - x` at `x = 3`.",
            steps:["The quotient simplifies to `2(3) - 1 + h = 5 + h`.", "Slope = 5.", "Point: `x = 3`, `y = 9 - 3 = 6`.", "Tangent: `y = 5x + 6`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`y - 6 = 5(x - 3)`, so `y = 5x - 9`.", ok:true, why:"The tangent passes through (3, 6), not (0, 6). Use `y - f(a) = m(x - a)`." },
              { t:"`y = 5x - 6`.", why:"Check it: 5(3) − 6 = 9, not 6. Use `y - 6 = 5(x - 3)`." },
              { t:"`y = 6x + 5`.", why:"The slope is 5 and the point is (3, 6): the numbers are swapped, and 6 still isn’t the intercept." },
              { t:"Step 4 is correct.", why:"(3, 6) isn’t on the `y`-axis, so 6 isn’t the intercept." }],
            hints:["Does `y = 5x + 6` pass through (3, 6)?", "5(3) + 6 = 21, not 6.", "`y = 5x - 9`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you squeezed the secant: how fast the slopes settled, or the corner that never settled?" },
      { id:"j2", q:"In your own words, what’s the difference between the slope of a secant and the slope of a tangent?" },
      { id:"j3", q:"Explain to a friend why you simplify the difference quotient before letting `h → 0`." },
      { id:"j4", q:"Which part of finding a tangent line still trips you up? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`f(x) = x^2 - 1`. What is the slope of the secant from `x = 1` to `x = 4`?", options:[
          { t:"5", ok:true, why:"(15 − 0)/(4 − 1)." },
          { t:"1/5", why:"That’s run over rise." },
          { t:"15", why:"That’s the rise. Divide by the run, 3." },
          { t:"8", why:"That’s the tangent slope at `x = 4`, not the secant slope." }] },
        b:{ prompt:"`f(x) = x^2 + 2`. What is the slope of the secant from `x = -1` to `x = 3`?", options:[
          { t:"2", ok:true, why:"(11 − 3)/4." },
          { t:"1/2", why:"That’s run over rise." },
          { t:"8", why:"That’s the rise. Divide by the run, 4." },
          { t:"6", why:"That’s the tangent slope at `x = 3`, not the secant slope." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"For `f(x) = x^2`, what is `{f(5 + h) - f(5)}/{h}` simplified (`h ≠ 0`)?", options:[
          { t:"`10 + h`", ok:true, why:"`{25 + 10h + h^2 - 25}/{h}`." },
          { t:"`h`", why:"`(5 + h)^2` has a middle term, `10h`." },
          { t:"`10h + h^2`", why:"Divide by `h`." },
          { t:"10", why:"That’s the limit as `h → 0`, not the simplified quotient." }] },
        b:{ prompt:"For `f(x) = x^2`, what is `{f(-3 + h) - f(-3)}/{h}` simplified?", options:[
          { t:"`-6 + h`", ok:true, why:"`{9 - 6h + h^2 - 9}/{h}`." },
          { t:"`h`", why:"`(-3 + h)^2` has a middle term, `-6h`." },
          { t:"`-6h + h^2`", why:"Divide by `h`." },
          { t:"−6", why:"That’s the limit as `h → 0`, not the simplified quotient." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"At which point does `y = |x - 2| + 3` have no tangent?", options:[
          { t:"(2, 3)", ok:true, why:"The corner: slopes −1 on the left and 1 on the right." },
          { t:"(0, 5)", why:"That’s the `y`-intercept; the graph is straight there." },
          { t:"(−2, 7)", why:"Sign slip: the corner is where `x - 2 = 0`." },
          { t:"Every point has a tangent.", why:"Not at the corner." }] },
        b:{ prompt:"At which point does `y = |x + 1| - 2` have no tangent?", options:[
          { t:"(−1, −2)", ok:true, why:"The corner: slopes −1 on the left and 1 on the right." },
          { t:"(0, −1)", why:"That’s the `y`-intercept; the graph is straight there." },
          { t:"(1, 0)", why:"Sign slip: the corner is where `x + 1 = 0`." },
          { t:"Every point has a tangent.", why:"Not at the corner." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"What is the slope of the tangent to `f(x) = x^3 - 2x` at `x = 1`?", options:[
          { t:"1", ok:true, why:"The quotient is `3 + 3h + h^2 - 2`, which approaches 1." },
          { t:"3", why:"The `-2x` term adds −2 to the quotient." },
          { t:"−1", why:"`f(1) = -1` is the height, not the slope." },
          { t:"There’s no tangent: the quotient is 0/0.", why:"Simplify first." }] },
        b:{ prompt:"What is the slope of the tangent to `f(x) = x^3 + x` at `x = 2`?", options:[
          { t:"13", ok:true, why:"12 + 1." },
          { t:"12", why:"Include the `x` term: it adds 1 to the quotient." },
          { t:"10", why:"`f(2) = 10` is the height, not the slope." },
          { t:"There’s no tangent: the quotient is 0/0.", why:"Simplify first." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"On `y = x^2 + 4x`, where is the tangent horizontal?", options:[
          { t:"(−2, −4)", ok:true, why:"The slope `2a + 4 = 0` at `a = -2`." },
          { t:"(0, 0)", why:"That’s where `y = 0`, not where the slope is 0." },
          { t:"(2, 12)", why:"Sign slip: `2a + 4 = 0` gives `a = -2`." },
          { t:"(−4, 0)", why:"That’s the other `x`-intercept." }] },
        b:{ prompt:"On `y = x^2 - 6x`, where is the tangent horizontal?", options:[
          { t:"(3, −9)", ok:true, why:"The slope `2a - 6 = 0` at `a = 3`." },
          { t:"(0, 0)", why:"That’s where `y = 0`, not where the slope is 0." },
          { t:"(−3, 27)", why:"Sign slip: `2a - 6 = 0` gives `a = 3`." },
          { t:"(6, 0)", why:"That’s the other `x`-intercept." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"What is the slope of the tangent to `f(x) = {2}/{x}` at `x = 2`?", options:[
          { t:"−1/2", ok:true, why:"`{2/(2 + h) - 1}/{h} = {-1}/{2 + h}`, which approaches `-{1}/{2}`." },
          { t:"1/2", why:"Combining `{2}/{2 + h} - 1` gives `{-h}/{2 + h}`: negative." },
          { t:"1", why:"`f(2) = 1` is the height." },
          { t:"0", why:"Substituting `h = 0` in the numerator first loses the information." }] },
        b:{ prompt:"What is the slope of the tangent to `f(x) = {6}/{x}` at `x = 3`?", options:[
          { t:"−2/3", ok:true, why:"The quotient is `{-2}/{3 + h}`, which approaches `-{2}/{3}`." },
          { t:"2/3", why:"Combining `{6}/{3 + h} - 2` gives `{-2h}/{3 + h}`: negative." },
          { t:"2", why:"`f(3) = 2` is the height." },
          { t:"0", why:"Substituting `h = 0` in the numerator first loses the information." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"A table shows secant slopes at `x = 1`: `h = 0.1` gives 3.31, `h = 0.01` gives 3.0301, `h = -0.01` gives 2.9701, `h = -0.1` gives 2.71. Which conclusion is best?", options:[
          { t:"“The slopes close in on 3 from both sides, so the tangent slope at `x = 1` is about 3.”", ok:true, why:"Both sides head to the same number, 3." },
          { t:"“The tangent slope is 3.0301, the slope of the closest secant.”", why:"Every secant is an average; look where they’re heading." },
          { t:"“The tangent slope is somewhere between 2.71 and 3.31; it can’t be narrowed down.”", why:"The smaller `h` values narrow it to about 3." },
          { t:"“The right side gives about 3.03 and the left about 2.97, so there’s no tangent.”", why:"Both sides head to 3." }] },
        b:{ prompt:"Secant slopes at `x = 2`: `h = 0.1` gives 5.1, `h = 0.01` gives 5.01, `h = -0.01` gives 4.99, `h = -0.1` gives 4.9. Which conclusion is best?", options:[
          { t:"“The slopes close in on 5 from both sides, so the tangent slope is about 5.”", ok:true, why:"Both sides head to the same number, 5." },
          { t:"“The tangent slope is 5.01.”", why:"That’s one secant, an average; look where the slopes are heading." },
          { t:"“Between 4.9 and 5.1; it can’t be narrowed down.”", why:"The smaller `h` values narrow it to about 5." },
          { t:"“The sides disagree, so there’s no tangent.”", why:"Both sides head to 5." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Why can’t you find the tangent slope by substituting `h = 0` straight into " + DQ + "?", options:[
          { t:"“At `h = 0` the quotient is 0/0, which has no value. Simplify first so `h` no longer divides, then let `h → 0`.”", ok:true, why:"0/0 tells you nothing; the simplified quotient can be evaluated at `h = 0`." },
          { t:"“Because the slope at `h = 0` is always 0.”", why:"0/0 isn’t 0." },
          { t:"“Because `h` must be negative.”", why:"`h` can have either sign, just not 0." },
          { t:"“You can: 0/0 = 1.”", why:"0/0 has no value." }] },
        b:{ prompt:"A student says the tangent slope of `y = x^2` at `x = 3` is undefined, because the difference quotient is 0/0 at `h = 0`. What’s the best reply?", options:[
          { t:"“For `h ≠ 0` the quotient simplifies to `6 + h`, which approaches 6 as `h → 0`. The tangent slope is 6.”", ok:true, why:"Simplify first, then let `h → 0`." },
          { t:"“They’re right: 0/0 means there’s no tangent.”", why:"0/0 means simplify first, not ‘no tangent’." },
          { t:"“The slope is 0, because the numerator is 0 at `h = 0`.”", why:"The denominator is 0 too: 0/0 has no value. Simplify first." },
          { t:"“The slope is 9, the value of `f(3)`.”", why:"That’s the height." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A skateboard ramp’s profile is `y = {x^2}/{8}` (metres), `0 ≤ x ≤ 4`. A straight support beam lies along the tangent at `x = 4`. What is the beam’s equation?", options:[
          { t:"`y = x - 2`", ok:true, why:"The quotient is `{2a + h}/{8}`, so the slope at 4 is 1; the point is (4, 2)." },
          { t:"`y = x + 2`", why:"The beam passes through (4, 2), not (0, 2)." },
          { t:"`y = 2x - 6`", why:"2 is the height at `x = 4`, not the slope." },
          { t:"`y = {x}/{2}`", why:"The slope is `{2a}/{8} = {a}/{4}`, not `{a}/{8}`: `(a + h)^2` gives `2ah`." }] },
        b:{ prompt:"The profile is `y = {x^2}/{12}`, and the beam lies along the tangent at `x = 6`. What is its equation?", options:[
          { t:"`y = x - 3`", ok:true, why:"Slope `{2(6)}/{12} = 1`; point (6, 3)." },
          { t:"`y = x + 3`", why:"The beam passes through (6, 3), not (0, 3)." },
          { t:"`y = 3x - 15`", why:"3 is the height at `x = 6`, not the slope." },
          { t:"`y = {x}/{2}`", why:"A slope of `{a}/{12}` forgets the 2: `(a + h)^2` gives `2ah`, so the slope is `{2a}/{12}`." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A tank drains so its volume is `V(t) = 400 - 40t + t^2` litres after `t` minutes (`0 ≤ t ≤ 20`). How fast is the volume changing at `t = 5`?", options:[
          { t:"−30 L/min", ok:true, why:"The quotient is `-40 + 2t + h` at `t = 5`, which approaches −30." },
          { t:"225 L/min", why:"`V(5) = 225` L is the volume, not a rate." },
          { t:"−35 L/min", why:"That’s the average rate over [0, 5]." },
          { t:"−40 L/min", why:"The `t^2` term changes the rate." }] },
        b:{ prompt:"`V(t) = 900 - 60t + t^2` litres (`0 ≤ t ≤ 30`). How fast is the volume changing at `t = 10`?", options:[
          { t:"−40 L/min", ok:true, why:"The quotient is `-60 + 2t + h` at `t = 10`, which approaches −40." },
          { t:"400 L/min", why:"`V(10) = 400` L is the volume, not a rate." },
          { t:"−50 L/min", why:"That’s the average rate over [0, 10]." },
          { t:"−60 L/min", why:"The `t^2` term changes the rate." }] } }
    ]
  },
  task:{
    title:"Tangent through a target", summary:"Tangent through a target",
    statement:"<p>Design a parabola `y = x^2 + bx + c` and choose a point of tangency `x = a` so that every condition is met. Can you find all the answers?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The tangent at `x = a` has slope 2.</li><li>The tangent passes through (0, −3).</li><li>The parabola’s vertex is to the left of the `y`-axis.</li></ol></div><p class=\"tiny muted\">Choose whole numbers from −6 to 6 for `a`, `b` and `c`. The graph shows the parabola, the point of tangency, its tangent and the target (0, −3).</p>",
    checks:["Tangent slope 2 at `x = a`", "Tangent passes through (0, −3)", "Vertex left of the `y`-axis"],
    tips:["The simplified quotient at `a` is `2a + b + h`, so the slope is `2a + b`.",
      "The tangent is `y = (2a + b)(x - a) + a^2 + ab + c`. Put `x = 0`: its intercept simplifies to `c - a^2`.",
      "The vertex is at `x = -b/2`. For it to be left of the axis, `b` must be positive."],
    explainPrompt:"Explain how you used the slope condition to find `b`, and why the tangent’s `y`-intercept is `c - a^2`.",
    vocab:"Use the words tangent, slope, difference quotient and intercept.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find them all?",
    after3:"`b = 2 - 2a` and `c = a^2 - 3`. `a = 1` makes `b = 0`, which puts the vertex on the axis, and `a = -3` needs `b = 8`, which is outside the range."
  },
  cards:[
    ["Secant", "A line through two points on a curve. Its slope is the average rate of change between them."],
    ["Tangent", "The line that matches the curve’s direction at a point. Its slope is the instantaneous rate of change."],
    ["Difference quotient", DQ + ": the slope of the secant from `a` to `a + h`."],
    ["Slope of the tangent", LIM + " " + DQ + "."],
    ["Simplify first", "For `x^2` at `a = 2`: `{4h + h^2}/{h} = 4 + h`, which approaches 4."],
    ["0/0", "No value. It means “simplify first”, not “no tangent”."],
    ["Both sides", "On a smooth curve, secant slopes from the left and from the right approach the same number."],
    ["Tangent line", "`y - f(a) = m(x - a)`, where `m` is the tangent slope."],
    ["Slope of `x^2` at `a`", "`2a` (the quotient is `2a + h`)."],
    ["Slope of `x^3` at `a`", "`3a^2` (the quotient is `3a^2 + 3ah + h^2`)."],
    ["No tangent", "At a corner, such as `y = |x - 1|` at `x = 1`, the one-sided slopes disagree."],
    ["Crossing tangent", "`y = 0` is tangent to `y = x^3` at the origin and crosses it."]
  ]
};
