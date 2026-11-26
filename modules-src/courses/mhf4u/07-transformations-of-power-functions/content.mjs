// MHF4U 07 Transformations of Power Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/07-transformations-of-power-functions.md
const FORM = "`y = @a{a}[@k{k}(x - @d{d})]^{@n{n}} + @c{c}`";
const RULE = "`(x, y) -> (x/@k{k} + @d{d}, @a{a}y + @c{c})`";
// M1 core sentence (plan §3), with the numbers of the case at hand.
const M1 = (br, v) => "`(x - d)` moves the graph `d` units right, so `" + br + " = (x - (-" + v + "))` moves it " + v + " unit" + (v === "1" ? "" : "s") + " <strong>left</strong>.";

export default {
  id:"07-transformations-of-power-functions",
  kind:"topic",
  title:"Transformations of power functions",
  topic:"Transformations of Power Functions",
  readyTopic:"transformations of power functions",
  hero:{
    eq:FORM, eqLabel:"y equals a times the quantity k times x minus d, all to the power n, plus c", eqSize:"md",
    headline:"Four dials, one rule for every point",
    text:"Each parameter does one job. The ones <strong>outside</strong> the bracket act vertically: `@a{a}` stretches (and flips), `@c{c}` shifts up or down. The ones <strong>inside</strong> act horizontally, and backwards: `@k{k}` compresses by `1/@k{k}`, and `(x - @d{d})` shifts right by `@d{d}`. Every point follows the <strong>mapping rule</strong> " + RULE + ".</p>" +
      "<p class=\"hook\"><strong>Memory hook:</strong> Stretches are warm colours (`@a{a}`, `@k{k}`); shifts are cool colours (`@d{d}`, `@c{c}`).",
    fig:{ aria:"y equals x cubed, then stretched vertically by 2, compressed horizontally by a factor of 1/2, moved 2 right and lifted 3 up, leaving a faded copy after each step", shape:"square" }
  },
  goals:[
    "I can describe the effect of `@a{a}`, `@k{k}`, `@d{d}` and `@c{c}` in " + FORM + ", using stretch and compression factors, reflections and translations.",
    "I can map key points with " + RULE + ".",
    "I can apply the transformations in a correct order and sketch the result.",
    "I can write the equation from a description, a graph or mapped points.",
    "I can state the domain, range, end behaviour and vertex or point of inflection of a transformed power function.",
    "I can factor `@k{k}` out of the bracket to find the true horizontal shift."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Transformations", goal:1,
          prompt:"How does `y = (x - 4)^2 + 1` compare with `y = x^2`?",
          options:[
            { t:"4 right and 1 up", ok:true, why:"`(x - 4)` moves it right 4; +1 moves it up 1." },
            { t:"4 left and 1 up", why:"`x - 4 = 0` at `x = 4`: the vertex moves to (4, 1)." },
            { t:"4 right and 1 down", why:"+1 outside the bracket raises every point." },
            { t:"4 left and 1 down", why:"The vertex is at (4, 1)." }],
          hints:["Where is the new vertex?", "`(x - 4)^2` is 0 when `x = 4`.", "Vertex (4, 1): right 4, up 1."] },
        { id:"w2", skill:"Transformations", goal:1,
          prompt:"What does `y = 3f(x)` do to the graph of `y = f(x)`?",
          options:[
            { t:"A vertical stretch by a factor of 3", ok:true, why:"Every `y`-value is tripled." },
            { t:"A horizontal stretch by a factor of 3", why:"The 3 is outside: it acts on `y`." },
            { t:"A vertical compression by a factor of 1/3", why:"Multiplying `y` by 3 makes points 3 times as far from the `x`-axis." },
            { t:"A shift up 3", why:"That’s `f(x) + 3`." }],
          hints:["Is the 3 inside or outside `f`?", "Outside: it multiplies the `y`-values.", "Vertical stretch by 3."] },
        { id:"w3", skill:"Transformations", goal:1,
          prompt:"What does `y = f(2x)` do to the graph of `y = f(x)`?",
          options:[
            { t:"A horizontal compression by a factor of 1/2", ok:true, why:"The point that was at `x = 4` is now reached at `x = 2`." },
            { t:"A horizontal stretch by a factor of 2", why:"Inside changes work backwards: `2x` reaches each value twice as fast." },
            { t:"A vertical compression by a factor of 1/2", why:"The 2 is inside: it acts on `x`." },
            { t:"A vertical stretch by a factor of 2", why:"That would be `2f(x)`." }],
          hints:["Inside or outside?", "Inside acts on `x`, backwards.", "Compression by 1/2."] },
        { id:"w4", skill:"Key points", goal:5,
          prompt:"Which point is on `y = x^4`?",
          options:[
            { t:"(−2, 16)", ok:true, why:"`(-2)^4 = 16`." },
            { t:"(−2, −16)", why:"An even power of −2 is positive." },
            { t:"(2, 8)", why:"`2^3 = 8`; `2^4 = 16`." },
            { t:"(3, 12)", why:"`3^4 = 81`." }],
          hints:["Substitute the `x`-value.", "`(-2)^4 = (-2)(-2)(-2)(-2)`.", "16."] },
        { id:"w5", skill:"Factoring", goal:6,
          prompt:"Factor `3x - 12`.",
          options:[
            { t:"`3(x - 4)`", ok:true, why:"3 × `x` − 3 × 4 = `3x - 12`." },
            { t:"`3(x - 12)`", why:"`3(x - 12) = 3x - 36`." },
            { t:"`3(x + 4)`", why:"`3(x + 4) = 3x + 12`." },
            { t:"`x(3 - 12)`", why:"−12 has no factor of `x`." }],
          hints:["Divide each term by 3.", "`3x ÷ 3 = x`; `-12 ÷ 3 = -4`.", "`3(x - 4)`."] },
        { id:"w6", skill:"Mapping points", goal:2,
          prompt:"Under `y = 2f(x) + 3`, where does the point (1, 4) on `y = f(x)` go?",
          options:[
            { t:"(1, 11)", ok:true, why:"Multiply the `y`-value by 2, then add 3: 8 + 3 = 11. `x` doesn’t change." },
            { t:"(1, 14)", why:"(4 + 3) × 2 = 14 does the steps in the wrong order." },
            { t:"(5, 4)", why:"2 and 3 are outside `f`: they act on `y`." },
            { t:"(2, 7)", why:"Only `y` changes here." }],
          hints:["Outside changes act on `y`.", "`y -> 2y + 3`.", "2 × 4 + 3 = 11: (1, 11)."] }
      ],
      refreshers:{
        "Transformations":"Outside the function: `a` multiplies `y` (vertical stretch), `c` adds to `y` (vertical shift). Inside: `x - d` shifts right by `d`; `kx` compresses horizontally by `1/k`. Inside changes work backwards.",
        "Key points":"`y = x^3`: (−2, −8), (−1, −1), (0, 0), (1, 1), (2, 8). `y = x^4`: (−2, 16), (−1, 1), (0, 0), (1, 1), (2, 16).",
        "Factoring":"Take out the common factor: `3x - 12 = 3(x - 4)`. Check by expanding.",
        "Mapping points":"For `y = af(x) + c`, each point `(x, y)` goes to `(x, ay + c)`: multiply first, then add."
      }
    }
  },
  explore:{
    heading:"Key-point mapper",
    intro:"Move the four sliders. The parent graph stays as a dashed ghost, and the table shows where every key point goes.",
    predictions:[
      { id:"p1", start:{ n:3, a:1, k:1, d:0, c:0, hl:0 },
        prompt:"Start with `y = x^3`. The equation will become `y = (x + 3)^3`. Where will the point (0, 0) go?",
        options:[{ t:"(−3, 0)", ok:true }, { t:"(3, 0)" }, { t:"(0, 3)" }, { t:"(0, −3)" }],
        explain:"`x + 3 = 0` at `x = -3`. `(x - d)` with `d = -3` moves everything 3 left." },
      { id:"p2", start:{ n:4, a:1, k:1, d:0, c:0, hl:2 },
        prompt:"Start with `y = x^4`, key point (2, 16) highlighted. `k` will change to 2: `y = (2x)^4`. Where will (2, 16) go?",
        options:[{ t:"(1, 16)", ok:true }, { t:"(4, 16)" }, { t:"(2, 32)" }, { t:"(2, 8)" }],
        explain:"`(2 · 1)^4 = 16`, so the height 16 is now reached at `x = 1`. Points move to `x/k`: a compression by 1/2, not a stretch by 2." },
      { id:"p3", start:{ n:3, a:1, k:1, d:0, c:0, hl:1 },
        prompt:"Start with `y = x^3` and the point (1, 1). `y = 2(x - 1)^3 + 3`. Where does (1, 1) go?",
        options:[{ t:"(2, 5)", ok:true }, { t:"(2, 8)" }, { t:"(3, 5)" }, { t:"(0, 5)" }],
        explain:"`x`: 1/1 + 1 = 2. `y`: 2 × 1 + 3 = 5. Adding before multiplying gives (1 + 3) × 2 = 8; doubling `x` gives 3; subtracting `d` gives 0." },
      { id:"p4", start:{ n:4, a:1, k:1, d:0, c:0 },
        prompt:"Start with `y = x^4`. `k` will change to −1: `y = (-x)^4`. What will happen to the graph?",
        options:[{ t:"Nothing visible changes", ok:true }, { t:"It flips upside down" }, { t:"Its arms point left and right" }, { t:"It shifts left 1" }],
        explain:"`(-x)^4 = x^4`: the reflection in the `y`-axis maps an even function onto itself. A negative `k` still reflects; you just can’t see it for `x^4`." }
    ],
    chalIntro:"Use the mapper to meet each goal, then press <strong>Check challenge</strong>. Choose the challenge’s number under <strong>Show a target</strong> to see its target on the graph. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 4], target:{ pts:[[-2, 5]] },
        prompt:"Move `y = x^3`, without stretching it, so its point of inflection is at (−2, 5).",
        why:"`y = (x + 2)^3 + 5`.",
        hints:["The point of inflection is at `(d, c)`.", "`d = -2`, `c = 5`.", "`y = (x + 2)^3 + 5`."] },
      { id:"tc2", goal:[1, 4], target:{ n:4, a:-2, k:1, d:3, c:4, pts:[[3, 4], [4, 2]] },
        prompt:"Match the dashed target: a quartic opening down with vertex (3, 4), passing through (4, 2).",
        why:"`a + 4 = 2`, so `a = -2`.",
        hints:["Set the vertex first.", "Then `y = a(x - 3)^4 + 4` must pass through (4, 2).", "`a + 4 = 2`, so `a = -2`."] },
      { id:"tc3", goal:[1, 4], stretch:true, target:{ pts:[[1, -4], [2, 4], [3, 12]] },
        prompt:"Make `y = x^3` pass through (1, −4), (2, 4) and (3, 12).",
        why:"`a` can’t reach 8, but `k = 2` gives `k^3 = 8`: `y = [2(x - 2)]^3 + 4`.",
        hints:["A cubic is symmetric about its point of inflection. Which of the three points is the centre?", "(2, 4). From there, one step right raises the graph by 8: `a·k^3 = 8`.", "`a` can’t reach 8, but `k = 2` gives `k^3 = 8`: `y = [2(x - 2)]^3 + 4`."] }
    ],
    // named wrong-state feedback for the challenges (tests live in app.js)
    chalFb:{
      tc1:{ d2:"Your point is at (2, {c}). `(x - d)` with `d = -2` moves it left.", cm5:"`c` moves it up or down: you need +5.", stretch:"The challenge says no stretch: `a = 1`, `k = 1`." },
      tc2:{ value:"At `x = 4` your graph is at {v}. `a(1)^4 + 4 = 2` gives `a = -2`.", dm3:"Vertex at (−3, {c}): check the sign of `d`.", apos:"Opening down needs `a < 0`." },
      tc3:{ a3:"`a` alone can only reach 3; you need the vertical change of 8 from the centre to `x = 3`. What else stretches the graph vertically?", d13:"The point of symmetry of the three points is the middle one, (2, 4)." }
    }
  },
  part3:{
    slug:"order", name:"Order",
    heading:"Order matters",
    intro:"Put the transformation cards in order. Press Play to watch each one happen to the key points. Reach the dashed target.",
    rounds:[
      { id:"r1", n:4, target:{ a:-2, k:1, d:-1, c:3 }, eq:"`y = -2(x + 1)^4 + 3`", keyName:"vertex (−1, 3)",
        cards:[
          { id:"sv2", t:"Stretch vertically by 2", sy:2 },
          { id:"rx", t:"Reflect in the `x`-axis", sy:-1 },
          { id:"l1", t:"Translate 1 left", tx:-1 },
          { id:"u3", t:"Translate 3 up", ty:3 },
          { id:"rt1", t:"Translate 1 right", tx:1, decoy:true }],
        named:[
          { uses:"rt1", fb:M1("(x + 1)", "1") },
          { first:"u3", then:"rx", fb:"Your vertex ended at {v}: the reflection flipped the shift. Stretch and reflect first." }],
        keyPts:"(1, 1) → (0, 1), (2, 16) → (1, −29), vertex (−1, 3)" },
      { id:"r2", n:3, target:{ a:0.5, k:2, d:3, c:-1 }, eq:"`y = ½[2(x - 3)]^3 - 1`", keyName:"point of inflection (3, −1)",
        cards:[
          { id:"cv", t:"Compress vertically by 1/2", sy:0.5 },
          { id:"ch", t:"Compress horizontally by 1/2", sx:0.5 },
          { id:"r3", t:"Translate 3 right", tx:3 },
          { id:"d1", t:"Translate 1 down", ty:-1 },
          { id:"r6", t:"Translate 6 right", tx:6, decoy:true }],
        named:[
          { uses:"r6", fb:"That’s the shift for `(2x - 6)`, compressing <strong>after</strong> shifting. With the compression first, the shift is 3." }],
        keyPts:"(1, 1) → (3.5, −0.5), (2, 8) → (4, 3)" },
      { id:"r3", n:4, target:{ a:1, k:2, d:-3, c:-5 }, eq:"`y = (2x + 6)^4 - 5`", keyName:"vertex (−3, −5)",
        cards:[
          { id:"ch", t:"Compress horizontally by 1/2", sx:0.5 },
          { id:"l3", t:"Translate 3 left", tx:-3 },
          { id:"l6", t:"Translate 6 left", tx:-6 },
          { id:"d5", t:"Translate 5 down", ty:-5 }],
        named:[
          { first:"ch", then:"l6", without:"l3", fb:"Vertex at (−6, −5). After compressing, the shift is the factored `d = -3`." },
          { first:"l3", then:"ch", without:"l6", fb:"Vertex at (−1.5, −5): compressing after the shift halves it. Shift 6 first, or compress first." }],
        keyPts:"(1, 1) → (−2.5, −4), (−1, 1) → (−3.5, −4)",
        after:"Both paths work, with different shift amounts. The course’s standard order is stretches and reflections first, then translations, using the factored form `[k(x - d)]`." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Order matters quick check",
      items:[
        { id:"q1", goal:5, prompt:"Vertex of `y = 3(x - 2)^4 + 1`?",
          choices:[{ t:"(2, 1)", ok:true }, { t:"(−2, 1)" }, { t:"(2, 3)" }, { t:"(1, 2)" }],
          right:"Right. The vertex is `(d, c)` = (2, 1).", wrong:"The vertex is `(d, c)` = (2, 1)." },
        { id:"q2", goal:2, prompt:"In `y = [½(x + 4)]^3`, the horizontal change is…",
          choices:[{ t:"stretch by 2", ok:true }, { t:"compress by 1/2" }, { t:"stretch by 4" }, { t:"shift 4 right" }],
          right:"Right. `k = 1/2`: points move to `x/(1/2) = 2x`, twice as far out.", wrong:"`k = 1/2`: points move to `x/(1/2) = 2x`, twice as far out." },
        { id:"q3", goal:2, prompt:"Where does (2, 16) on `y = x^4` go under `y = -(x - 1)^4 + 5`?",
          choices:[{ t:"(3, −11)", ok:true }, { t:"(1, −11)" }, { t:"(3, 21)" }, { t:"(3, −21)" }],
          right:"Right. `x`: 2 + 1 = 3. `y`: −16 + 5 = −11.", wrong:"`x`: 2 + 1 = 3. `y`: −16 + 5 = −11." },
        { id:"q4", goal:6, prompt:"`y = (3x - 9)^3` in the form `[k(x - d)]^3` is…",
          choices:[{ t:"`[3(x - 3)]^3`", ok:true }, { t:"`[3(x - 9)]^3`" }, { t:"`[3(x + 3)]^3`" }, { t:"`3(x - 3)^3`" }],
          right:"Right. Factor 3 from both terms: `3x - 9 = 3(x - 3)`.", wrong:"Factor 3 from both terms: `3x - 9 = 3(x - 3)`. `3(x - 3)^3` is different: it equals `[3(x - 3)]^3 ÷ 9`." }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Equation ↔ description", summary:"Equation ↔ description", goal:[1, 6],
        instruction:"Match each equation to its description (parent `x^3` or `x^4`).",
        leftTitle:"Equation", rightTitle:"Description",
        left:[
          { id:"l1", t:"`y = 2(x - 3)^4`" },
          { id:"l2", t:"`y = [2(x - 3)]^4`" },
          { id:"l3", t:"`y = (2x - 3)^4`", hints:["Factor the 2.", "`2x - 3 = 2(x - 3/2)`.", "Compression by 1/2, then 3/2 right."] },
          { id:"l4", t:"`y = -(x + 3)^3`" },
          { id:"l5", t:"`y = (-x + 3)^3`", hints:["Factor −1 from `-x + 3`.", "`-x + 3 = -(x - 3)`: `k = -1`, `d = 3`.", "Reflection in the `y`-axis, then 3 right."] },
          { id:"l6", t:"`y = ½(x - 3)^3 + 2`" },
          { id:"l7", t:"`y = (x + 2)^4 - 3`" },
          { id:"l8", t:"`y = -2[½(x - 1)]^4`" }],
        right:[
          { id:"r1", t:"Vertical stretch by 2, then 3 right" },
          { id:"r2", t:"Horizontal compression by 1/2, then 3 right" },
          { id:"r3", t:"Horizontal compression by 1/2, then 3/2 right" },
          { id:"r4", t:"Reflection in the `x`-axis, then 3 left" },
          { id:"r5", t:"Reflection in the `y`-axis, then 3 right" },
          { id:"r6", t:"Vertical compression by 1/2, then 3 right and 2 up" },
          { id:"r7", t:"2 left and 3 down" },
          { id:"r8", t:"Vertical stretch by 2 and reflection in the `x`-axis, horizontal stretch by 2, then 1 right" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"Is the 2 outside (vertical) or inside (horizontal)?", "l2|r1":"Is the 2 outside (vertical) or inside (horizontal)?",
          "l2|r3":"Factor `2x - 3 = 2(x - 3/2)`.", "l3|r2":"Factor `2x - 3 = 2(x - 3/2)`.",
          "l4|r5":"A minus outside reflects in the `x`-axis; inside, in the `y`-axis. And `-x + 3 = -(x - 3)`: 3 right.",
          "l5|r4":"A minus outside reflects in the `x`-axis; inside, in the `y`-axis. And `-x + 3 = -(x - 3)`: 3 right." },
        wrongDefault:"Check outside (vertical) and inside (horizontal) separately." },
      { id:"params", type:"custom", title:"Find the parameters", summary:"Find the parameters", star:true, goal:[2, 4, 6],
        instruction:"Fill in `@a{a}`, `@k{k}`, `@d{d}` and `@c{c}` for each description. Items marked ★ work backwards from points.",
        how:"Type a number in each box, then press Check. Fractions such as 3/4 are fine.",
        items:[
          { id:"n1", goal:4, ask:["a", "k", "d", "c"],
            prompt:"`y = x^4` is reflected in the `x`-axis, compressed horizontally by a factor of 1/3, then translated 2 left and 5 up.",
            answer:{ a:-1, k:3, d:-2, c:5 },
            wrong:{ k:[{ v:0.3333333333, fb:"Compression by 1/3 means `k = 3`." }], d:[{ v:2, fb:M1("(x + 2)", "2") }] } },
          { id:"n2", goal:6, ask:["a", "k", "d", "c"],
            prompt:"Write `y = -(4x + 8)^3 + 1` as `a[k(x - d)]^3 + c`.",
            answer:{ a:-1, k:4, d:-2, c:1 },
            wrong:{ d:[{ v:-8, fb:"Factor out 4: `4x + 8 = 4(x + 2)`." }] },
            hints:["Factor the inside.", "`-(4x + 8)^3 = -[4(x + 2)]^3`.", "`a = -1`, `k = 4`, `d = -2`, `c = 1`."] },
          { id:"n3", goal:4, star:true, ask:["a"],
            prompt:"`y = a(x - d)^3 + c` has point of inflection (2, −1) and passes through (3, 1). Find `a`.",
            answer:{ a:2 },
            wrong:{ a:[{ v:1, fb:"`a(1)^3 - 1 = 1` gives `a = 2`." }] } },
          { id:"n4", goal:4, star:true, ask:["a"],
            prompt:"`y = a(x - d)^4 + c` has vertex (−1, 6) and passes through (1, −10). Find `a`.",
            answer:{ a:-1 },
            wrong:{ a:[{ v:-4, fb:"`(1 - (-1))^4 = 2^4 = 16`, so `16a = -16`." }, { v:-8, fb:"That uses `2^3 = 8`; the power is 4." }] } },
          { id:"n5", goal:2, star:true, ask:["a", "d"],
            prompt:"(2, 8) on `y = x^3` maps to (5, −13) under `y = a[k(x - d)]^3 + c` with `k = 1` and `c = 3`. Find `a` and `d`.",
            answer:{ a:-2, d:3 },
            wrong:{ a:[{ v:-1.25, fb:"Subtract `c`: `8a = -13 - 3 = -16`, not −13 + 3." }], d:[{ v:-3, fb:"`x`: `2 + d = 5`, so `d = 3`." }] } },
          { id:"n6", goal:2, star:true, ask:["a", "k", "d", "c"],
            prompt:"Under `y = a[k(x - d)]^4 + c` with `k > 0`, the vertex of `y = x^4` goes to (4, −2) and (2, 16) goes to (5, 30). Find `a`, `k`, `d`, `c`.",
            answer:{ a:2, k:2, d:4, c:-2 },
            wrong:{ k:[{ v:0.5, fb:"`2/k + 4 = 5` gives `2/k = 1`, so `k = 2`." }] },
            hints:["The vertex (0, 0) goes to `(d, c)`.", "`d = 4`, `c = -2`. Now map (2, 16): `(2/k + 4, 16a - 2) = (5, 30)`.", "`2/k = 1` gives `k = 2`; `16a = 32` gives `a = 2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Fatima", how:"",
        instruction:"Fatima made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:6, task:"Describe `y = (3x - 12)^4 + 2` as a transformation of `y = x^4`.",
            steps:["The 3 multiplies `x` inside the bracket: a horizontal compression by a factor of 1/3.", "The −12 translates the graph 12 units right.", "The +2 translates it 2 up.", "So the vertex is (12, 2)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct. The mistake is earlier.", "Step 4 uses step 2. The mistake is earlier."],
            fixes:[
              { t:"Factor first: `(3x - 12)^4 = [3(x - 4)]^4`, so it’s 4 right and the vertex is (4, 2).", ok:true, why:"`3x - 12 = 0` at `x = 4`." },
              { t:"12 left.", why:"The shift’s direction is right, and its size needs factoring." },
              { t:"36 right.", why:"Factoring divides by 3; it doesn’t multiply." },
              { t:"Step 2 is correct.", why:"Check: at `x = 12` the bracket is 24, not 0. It’s 0 at `x = 4`." }],
            hints:["Where is the bracket equal to 0?", "`3x - 12 = 0` at `x = 4`.", "Step 2 is wrong: 4 right; vertex (4, 2)."] },
          { id:"e2", goal:2, task:"Where does (1, 1) on `y = x^3` go under `y = 2[½(x + 1)]^3 - 3`?",
            steps:["`a = 2`, `k = ½`, `d = -1`, `c = -3`.", "New `x = kx + d = ½(1) - 1 = -½`.", "New `y = ay + c = 2(1) - 3 = -1`.", "Image: (−½, −1)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct. The mistake is earlier.", "Step 4 uses step 2. The mistake is earlier."],
            fixes:[
              { t:"New `x = x/k + d = 1 ÷ ½ - 1 = 1`: the image is (1, −1).", ok:true, why:"Solve `k(X - d) = x` for the new `X`: `X = x/k + d`." },
              { t:"New `x = x/k - d = 2 + 1 = 3`.", why:M1("(x + 1)", "1") },
              { t:"New `x = kx - d = ½ + 1 = 3/2`.", why:"Solve `k(X - d) = x` for the new `X`: `X = x/k + d`. And " + M1("(x + 1)", "1") },
              { t:"Step 2 is correct.", why:"Inside changes work backwards: divide by `k`." }],
            hints:["Check the `x`-part of the mapping rule.", "It’s `x/k + d`.", "1 ÷ ½ − 1 = 1: (1, −1)."] },
          { id:"e3", goal:5, task:"State the range of `y = -½(x - 2)^4 + 3`.",
            steps:["The vertex is (2, 3).", "`a = -½ < 0`, so the graph opens down.", "So 3 is the lowest value.", "Range: `{y ∈ ℝ | y ≥ 3}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 uses step 3. The mistake is earlier."],
            fixes:[
              { t:"Opening down, the vertex is the highest point: range `{y ∈ ℝ | y ≤ 3}`.", ok:true, why:"With `a < 0` the quartic opens down: the vertex is the highest point, so the range is `y ≤ c`." },
              { t:"Range `{y ∈ ℝ}`.", why:"That’s for odd powers; `x^4` is even." },
              { t:"Range `{y ∈ ℝ | y ≤ 2}`.", why:"2 is the vertex’s `x`-coordinate." },
              { t:"Step 3 is correct.", why:"A downward quartic’s vertex is its highest point." }],
            hints:["Opening down: is the vertex a top or a bottom?", "A top.", "Range `y ≤ 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the key-point mapper: inside changes working backwards, or `(-x)^4`?" },
      { id:"j2", q:"In your own words, why does the shift in `(2x - 6)^3` turn out to be 3, not 6?" },
      { id:"j3", q:"Explain to a friend how to sketch `y = -2[½(x - 1)]^4 + 3` from three key points." },
      { id:"j4", q:"Which parameter do you still misread? What will you check every time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In `y = 3[½(x + 2)]^4 - 1`, what is the horizontal change?", options:[
          { t:"A horizontal stretch by a factor of 2, and a translation 2 left", ok:true, why:"`k = ½` stretches by `1/k = 2`; `(x + 2)` is 2 left." },
          { t:"A horizontal compression by a factor of ½, and a translation 2 left", why:"`k = ½` moves points to `x/(½) = 2x`: a stretch." },
          { t:"A horizontal stretch by a factor of 2, and a translation 2 right", why:"`(x + 2) = (x - (-2))`: left." },
          { t:"A horizontal compression by a factor of ½, and a translation 2 right", why:"Both parts are reversed." }] },
        b:{ prompt:"In `y = -[4(x - 1)]^3 + 5`, what is the horizontal change?", options:[
          { t:"A horizontal compression by a factor of ¼, and a translation 1 right", ok:true, why:"`k = 4` compresses by `1/k = ¼`; `(x - 1)` is 1 right." },
          { t:"A horizontal stretch by a factor of 4, and a translation 1 right", why:"`k = 4` compresses by ¼." },
          { t:"A horizontal compression by a factor of ¼, and a translation 1 left", why:"`(x - 1)` is 1 right." },
          { t:"A horizontal stretch by a factor of 4, and a translation 1 left", why:"Both parts are reversed." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Under `y = 2(x - 3)^3 + 1`, where does (2, 8) on `y = x^3` go?", options:[
          { t:"(5, 17)", ok:true, why:"`x`: 2 + 3 = 5. `y`: 2 × 8 + 1 = 17." },
          { t:"(−1, 17)", why:"`(x - 3)` moves points right: 2 + 3." },
          { t:"(5, 18)", why:"Multiply first, then add: 2 × 8 + 1, not 2 × (8 + 1)." },
          { t:"(7, 17)", why:"`a` acts on `y` only; `x` becomes 2 + 3." }] },
        b:{ prompt:"Under `y = -(x + 1)^4 + 4`, where does (2, 16) on `y = x^4` go?", options:[
          { t:"(1, −12)", ok:true, why:"`x`: 2 − 1 = 1. `y`: −16 + 4 = −12." },
          { t:"(3, −12)", why:"`(x + 1)` moves points left." },
          { t:"(1, −20)", why:"Multiply first, then add: −16 + 4." },
          { t:"(1, 20)", why:"`a = -1` makes the `y`-value −16 before adding 4." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the range of `y = -2(x + 1)^4 + 5`?", options:[
          { t:"`{y ∈ ℝ | y ≤ 5}`", ok:true, why:"Opens down (`a < 0`); vertex (−1, 5) is the top." },
          { t:"`{y ∈ ℝ | y ≥ 5}`", why:"`a < 0`: the vertex is the highest point." },
          { t:"`{y ∈ ℝ}`", why:"That’s for odd powers." },
          { t:"`{y ∈ ℝ | y ≤ -1}`", why:"−1 is the vertex’s `x`-coordinate." }] },
        b:{ prompt:"What is the range of `y = ½(x - 4)^4 - 3`?", options:[
          { t:"`{y ∈ ℝ | y ≥ -3}`", ok:true, why:"Opens up; vertex (4, −3) is the bottom." },
          { t:"`{y ∈ ℝ | y ≤ -3}`", why:"`a > 0`: the vertex is the lowest point." },
          { t:"`{y ∈ ℝ}`", why:"That’s for odd powers." },
          { t:"`{y ∈ ℝ | y ≥ 4}`", why:"4 is the vertex’s `x`-coordinate." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"Which describes `y = (2x - 8)^3` as a transformation of `y = x^3`?", options:[
          { t:"Horizontal compression by a factor of ½, then 4 right", ok:true, why:"`(2x - 8) = 2(x - 4)`." },
          { t:"Horizontal compression by a factor of ½, then 8 right", why:"Factor out the 2 first." },
          { t:"Horizontal stretch by a factor of 2, then 4 right", why:"`k = 2` compresses." },
          { t:"Horizontal compression by a factor of ½, then 4 left", why:"`2(x - 4)` is 4 right." }] },
        b:{ prompt:"Which describes `y = (½x + 3)^4` as a transformation of `y = x^4`?", options:[
          { t:"Horizontal stretch by a factor of 2, then 6 left", ok:true, why:"`(½x + 3) = ½(x + 6)`." },
          { t:"Horizontal stretch by a factor of 2, then 3 left", why:"Factor out ½: 3 ÷ ½ = 6." },
          { t:"Horizontal compression by a factor of ½, then 6 left", why:"`k = ½` stretches." },
          { t:"Horizontal stretch by a factor of 2, then 6 right", why:"`½(x + 6)` is 6 left." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A cubic `y = a(x - d)^3 + c` has its point of inflection at (−1, 4) and passes through (1, −12). What is its equation?", options:[
          { t:"`y = -2(x + 1)^3 + 4`", ok:true, why:"`a(2)^3 + 4 = -12`, so `8a = -16` and `a = -2`." },
          { t:"`y = -2(x - 1)^3 + 4`", why:"The inflection at `x = -1` needs `(x + 1)`." },
          { t:"`y = -8(x + 1)^3 + 4`", why:"That uses 2 instead of `2^3`: `2a = -16`." },
          { t:"`y = -4(x + 1)^3 + 4`", why:"That uses `2^2 = 4`: the power is 3." }] },
        b:{ prompt:"A quartic `y = a(x - d)^4 + c` has vertex (2, −3) and passes through (4, 29). What is its equation?", options:[
          { t:"`y = 2(x - 2)^4 - 3`", ok:true, why:"`a(2)^4 - 3 = 29`, so `16a = 32` and `a = 2`." },
          { t:"`y = 2(x + 2)^4 - 3`", why:"The vertex at `x = 2` needs `(x - 2)`." },
          { t:"`y = 16(x - 2)^4 - 3`", why:"That uses 2 instead of `2^4`: `2a = 32`." },
          { t:"`y = 8(x - 2)^4 - 3`", why:"That uses `2^2 = 4`: the power is 4." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`y = x^4` is translated 3 right, <strong>then</strong> compressed horizontally by a factor of ½. What is the new equation?", options:[
          { t:"`y = (2x - 3)^4`", ok:true, why:"Right 3: `(x - 3)^4`. Then replace `x` with `2x`: `(2x - 3)^4 = [2(x - 3/2)]^4`: the compression halves the shift." },
          { t:"`y = (2x - 6)^4`", why:"That’s the result of compressing <strong>first</strong>: `[2(x - 3)]^4`." },
          { t:"`y = (½x - 3)^4`", why:"Compression by ½ replaces `x` with `2x`." },
          { t:"`y = (2x + 3)^4`", why:"Right 3 gives `x - 3`." }] },
        b:{ prompt:"`y = x^3` is translated 4 left, <strong>then</strong> stretched horizontally by a factor of 2. What is the new equation?", options:[
          { t:"`y = (½x + 4)^3`", ok:true, why:"Left 4: `(x + 4)^3`. Then replace `x` with `½x`: `(½x + 4)^3 = [½(x + 8)]^3`: the stretch doubles the shift." },
          { t:"`y = (½x + 2)^3`", why:"That’s the result of stretching <strong>first</strong>: `[½(x + 4)]^3`." },
          { t:"`y = (2x + 4)^3`", why:"A stretch by 2 replaces `x` with `½x`." },
          { t:"`y = (½x - 4)^3`", why:"Left 4 gives `x + 4`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of how to get `y = -3(x - 2)^4 + 1` from `y = x^4`?", options:[
          { t:"Stretch vertically by a factor of 3 and reflect in the `x`-axis, then translate 2 right and 1 up.", ok:true, why:"Stretches and reflections first, then translations: `a = -3` stretches by 3 and reflects in the `x`-axis; `(x - 2)` is 2 right and +1 is 1 up." },
          { t:"Translate 2 right and 1 up, then stretch vertically by 3 and reflect in the `x`-axis.", why:"That order sends the vertex to (2, −3)." },
          { t:"Reflect in the `y`-axis, stretch vertically by 3, then translate 2 left and 1 up.", why:"The minus is outside: `x`-axis. `(x - 2)` is right." },
          { t:"Compress vertically by a factor of 1/3, reflect in the `x`-axis, then translate 2 right and 1 up.", why:"`a = -3` stretches by 3." }] },
        b:{ prompt:"Which is the best description of how to get `y = ½(x + 3)^3 - 4` from `y = x^3`?", options:[
          { t:"Compress vertically by a factor of ½, then translate 3 left and 4 down.", ok:true, why:"Stretches and compressions first, then translations: `a = ½` compresses by ½; `(x + 3)` is 3 left and −4 is 4 down." },
          { t:"Translate 3 left and 4 down, then compress vertically by ½.", why:"That order sends the point of inflection to (−3, −2)." },
          { t:"Stretch vertically by a factor of 2, then translate 3 left and 4 down.", why:"`a = ½` compresses." },
          { t:"Compress vertically by a factor of ½, then translate 3 right and 4 down.", why:"`(x + 3)` is left." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which mapping rule matches `y = a[k(x - d)]^n + c`?", options:[
          { t:"`(x, y) -> (x/k + d, ay + c)`", ok:true, why:"Solve `k(X - d) = x` for the new `X`: `X = x/k + d`. Then multiply, then add: `ay + c`." },
          { t:"`(x, y) -> (kx + d, ay + c)`", why:"Inside changes are undone: divide by `k`." },
          { t:"`(x, y) -> (x/k - d, ay + c)`", why:"`(x - d)` moves points right: + `d`." },
          { t:"`(x, y) -> (x/k + d, a(y + c))`", why:"Multiply, then add." }] },
        b:{ prompt:"Which mapping rule matches `y = 4[-2(x + 5)]^3 - 1`?", options:[
          { t:"`(x, y) -> (-x/2 - 5, 4y - 1)`", ok:true, why:"`k = -2` and `d = -5`: `x/(-2) + (-5) = -x/2 - 5`; and `y -> 4y - 1`." },
          { t:"`(x, y) -> (-2x - 5, 4y - 1)`", why:"Divide by `k = -2`." },
          { t:"`(x, y) -> (-x/2 + 5, 4y - 1)`", why:"`d = -5`." },
          { t:"`(x, y) -> (-x/2 - 5, 4(y - 1))`", why:"Multiply, then add." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A bowl’s cross-section is `y = a(x - d)^4 + c` (cm). Its bottom is at (10, 2) and the rim passes through (12, 34). How high is the bowl’s wall at `x = 11`?", options:[
          { t:"4 cm", ok:true, why:"`a(2)^4 + 2 = 34` gives `a = 2`. At `x = 11`: `2(1)^4 + 2 = 4`." },
          { t:"10 cm", why:"That uses `2^2 = 4`: `4a = 32`, `a = 8`." },
          { t:"18 cm", why:"That uses 2 instead of `2^4` (`a = 16`), which also matches a straight-line guess." },
          { t:"34 cm", why:"34 cm is the height at `x = 12`, the rim." }] },
        b:{ prompt:"A ramp’s profile is `y = a(x - d)^3 + c` (m), with its point of inflection at (5, 3), and it passes through (7, 7). How high is it at `x = 6`?", options:[
          { t:"3.5 m", ok:true, why:"`a(2)^3 + 3 = 7` gives `a = ½`. At `x = 6`: `½(1)^3 + 3 = 3.5`." },
          { t:"4 m", why:"That uses `2^2 = 4`: `a = 1`." },
          { t:"5 m", why:"That uses 2 instead of `2^3` (`a = 2`), which also matches a straight-line guess." },
          { t:"7 m", why:"7 m is the height at `x = 7`." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"`y = x^3` is transformed so its point of inflection moves to (3, −2) and the point (1, 1) moves to (3.5, 4). What is the equation?", options:[
          { t:"`y = 6[2(x - 3)]^3 - 2`", ok:true, why:"`x`: `1/k + 3 = 3.5`, so `k = 2`. `y`: `a - 2 = 4`, so `a = 6`." },
          { t:"`y = 6[½(x - 3)]^3 - 2`", why:"`1/k = 0.5` means `k = 2`." },
          { t:"`y = 6[2(x + 3)]^3 - 2`", why:"The point of inflection at `x = 3` needs `(x - 3)`." },
          { t:"`y = 4[2(x - 3)]^3 - 2`", why:"4 is the new `y`-value; `a` comes from `a - 2 = 4`." }] },
        b:{ prompt:"`y = x^4` is transformed so its vertex moves to (−2, 1) and the point (1, 1) moves to (0, 7). What is the equation?", options:[
          { t:"`y = 6[½(x + 2)]^4 + 1`", ok:true, why:"`x`: `1/k - 2 = 0`, so `k = ½`. `y`: `a + 1 = 7`, so `a = 6`." },
          { t:"`y = 6[2(x + 2)]^4 + 1`", why:"`1/k = 2` means `k = ½`." },
          { t:"`y = 6[½(x - 2)]^4 + 1`", why:"The vertex at `x = -2` needs `(x + 2)`." },
          { t:"`y = 7[½(x + 2)]^4 + 1`", why:"7 is the new `y`-value; `a` comes from `a + 1 = 7`." }] } }
    ]
  },
  task:{
    title:"Logo through the origin", summary:"Logo through the origin",
    statement:"<p>A designer needs a power-function curve for a logo. Use the key-point mapper to meet the whole spec. There’s more than one answer. Can you find them all?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The spec</h4><ol class=\"spec\"><li>The key point (vertex or point of inflection) is in quadrant 2.</li><li>The graph passes through the origin.</li><li>The graph has exactly two `x`-intercepts.</li><li>The range is `{y ∈ ℝ | y ≤ 8}`.</li></ol></div>",
    checks:["Key point in quadrant 2", "Through the origin", "Exactly two `x`-intercepts", "Range `y ≤ 8`"],
    tips:["Quadrant 2 means `d < 0` and `c > 0`.", "At `x = 0` your curve is at {v}. You need `a(-kd)^n = -c`.", "A cubic crosses only once. A quartic that opens down with its vertex above the axis crosses twice.", "A range `y ≤ 8` means the vertex is the top, at height 8."],
    explainPrompt:"Explain why every working design has `a = -½`.",
    vocab:"Use the words vertex, mapping rule and range.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every answer has `a = -½` and `|k·d| = 2`: passing through the origin means `a(kd)^4 = -8`."
  },
  cards:[
    [FORM.replace("`y", "`@a{a}` in `y"), "Vertical stretch by `|a|` (compression if `|a| < 1`); `a < 0` reflects in the `x`-axis."],
    ["`@k{k}`", "Horizontal compression by `1/|k|` (stretch if `|k| < 1`); `k < 0` reflects in the `y`-axis."],
    ["`@d{d}`", "Horizontal translation: right if `d > 0`. `(x + 3)` means `d = -3`: 3 left."],
    ["`@c{c}`", "Vertical translation: up if `c > 0`."],
    ["The mapping rule", "`(x, y) -> (x/k + d, ay + c)`."],
    ["The standard order", "Stretches and reflections first, then translations."],
    ["Factor out `@k{k}`", "`(2x - 6)^3 = [2(x - 3)]^3`: compression by ½, then 3 right."],
    ["Key point of " + FORM, "`(d, c)`: the vertex for `n = 4`, the point of inflection for `n = 3`."],
    ["Range of a transformed quartic", "`y ≥ c` if `a > 0`; `y ≤ c` if `a < 0`. A transformed cubic: all reals."],
    ["`(-x)^4` vs `(-x)^3`", "`(-x)^4 = x^4` (no visible change); `(-x)^3 = -x^3` (it flips)."],
    ["Memory hook", "Outside the bracket: vertical (`a`, `c`). Inside: horizontal, and backwards (`k`, `d`)."],
    ["Key points to map", "`x^3`: (−1, −1), (0, 0), (1, 1), (±2, ±8). `x^4`: (±1, 1), (0, 0), (±2, 16)."]
  ]
};
