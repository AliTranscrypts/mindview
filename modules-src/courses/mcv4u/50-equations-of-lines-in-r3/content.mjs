// MCV4U 50 Vector, Parametric and Symmetric Equations of Lines in R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/50-equations-of-lines-in-r3.md
// misconception core sentences (plan §3)
const M1 = "One equation in `x`, `y` and `z` is a plane. A line needs a parameter, or two equations together.";
const M2 = "If `m_2 = 0`, `y` never changes. Write `y = y_0` separately and use symmetric form for the others.";
const M3 = "All three coordinates must give the <strong>same</strong> `t`.";
const M4 = "The direction from A to B is B − A.";
const M5 = "`(x - x_0)`: the point (4, −2, 1) gives `(x - 4)`, `(y + 2)`, `(z - 1)`.";
const M6 = "A parallel line keeps the direction but uses its own point. Parallel directions alone don’t make lines the same.";
const M7 = "The `xy`-plane is where `z = 0`; the `yz`-plane is `x = 0`; the `xz`-plane is `y = 0`.";
const M8 = "`vec{m} = (3, 0, 4)` has no `y`-change, so the line is parallel to the `xz`-plane, not to the `y`-axis.";
const MV_ = '<span class="l3-pen">`vec{m}`</span>';

export default {
  id:"50-equations-of-lines-in-r3",
  kind:"topic",
  title:"Equations of lines in R³",
  topic:"Vector, Parametric and Symmetric Equations of Lines in R³",
  readyTopic:"equations of lines in R³",
  hero:{
    eq:'<span class="l3-heq"><span class="l3-hf">`vec{r} = vec{r}_0 + t`' + MV_ + '</span> <span class="l3-hx">⟷</span> <span class="l3-hf">`x = x_0 + t m_1`, `y = y_0 + t m_2`, `z = z_0 + t m_3`</span> <span class="l3-hx">⟷</span> <span class="l3-hf">`(x - x_0)/m_1 = (y - y_0)/m_2 = (z - z_0)/m_3`</span></span>',
    eqLabel:"r equals r zero plus t m; x equals x zero plus t m one, y equals y zero plus t m two, z equals z zero plus t m three; x minus x zero over m one equals y minus y zero over m two equals z minus z zero over m three",
    eqSize:"sm",
    headline:"Same idea, one more coordinate",
    text:"A line in space is still <strong>a point and a direction</strong>. Its <strong>vector equation</strong> adds multiples of " + MV_ + " to a starting point; its <strong>parametric equations</strong> do it one coordinate at a time; its <strong>symmetric equations</strong> remove `t` altogether. What you can’t do in R³ is describe a line with one equation like `ax + by + cz = d`: that’s a <strong>plane</strong>.",
    fig:{ html:'<div class="l3-hero" id="l3-hero"></div>' }
  },
  goals:[
    "I can write vector and parametric equations of a line in R³ from a point and a direction, or from two points.",
    "I can write symmetric equations, including when a direction component is 0.",
    "I can decide whether a point is on a line in R³, using one value of `t` for all three coordinates.",
    "I can find where a line meets the coordinate planes.",
    "I can explain why one scalar equation in R³ is a plane, and write a line as the intersection of two planes.",
    "I can tell when two equations describe the same line, and write a line parallel to a given one."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Vectors in R³", goal:1, prompt:"A(1, 0, 2) and B(3, 4, 0). `vec{AB}` = ?",
          options:[
            { t:"(2, 4, −2)", ok:true, why:"B − A." },
            { t:"(4, 4, 2)", why:"That’s A + B." },
            { t:"(−2, −4, 2)", why:"That’s A − B = `vec{BA}`." },
            { t:"(2, 4, 2)", why:"0 − 2 = −2." }],
          hints:["Head minus tail.", "(3 − 1, 4 − 0, 0 − 2).", "(2, 4, −2)."] },
        { id:"w2", skill:"Vectors in R³", goal:6, prompt:"Which vector is parallel to (2, −4, 6)?",
          options:[
            { t:"(−1, 2, −3)", ok:true, why:"−½(2, −4, 6)." },
            { t:"(1, 2, 3)", why:"The middle component must be −2 × the first." },
            { t:"(2, 4, 6)", why:"Not a multiple: the signs don’t match." },
            { t:"(3, −6, 8)", why:"3/2 times (2, −4, 6) is (3, −6, 9)." }],
          hints:["Parallel means a scalar multiple.", "Divide each component by the same number.", "÷ (−2) gives (−1, 2, −3)."] },
        { id:"w3", skill:"Lines in R²", goal:1, prompt:"Which is a vector equation of the line through (2, 5) and (4, 1)?",
          options:[
            { t:"`vec{r} = (2, 5) + t(1, -2)`", ok:true, why:"(4, 1) − (2, 5) = (2, −4) = 2(1, −2)." },
            { t:"`vec{r} = (2, 5) + t(6, 6)`", why:"That uses the sum of the points." },
            { t:"`vec{r} = (1, -2) + t(2, 5)`", why:"The added vector must be a point on the line." },
            { t:"`vec{r} = (2, 5) + t(-2, 1)`", why:"Slope from (2, 5) to (4, 1) is −2." }],
          hints:["Direction = second point − first.", "(2, −4).", "`vec{r} = (2, 5) + t(1, -2)`."] },
        { id:"w4", skill:"Lines in R²", goal:3, prompt:"Is (7, −1) on `x = 1 + 3t`, `y = 3 - 2t`?",
          options:[
            { t:"Yes, at `t = 2`", ok:true, why:"`x`: `t = 2`; `y`: 3 − 4 = −1." },
            { t:"No", why:"Both coordinates give `t = 2`." },
            { t:"Yes, at `t = 7`", why:"`t` isn’t the `x`-coordinate." },
            { t:"Only if `t` is positive", why:"Any real `t` is allowed; here `t = 2` works anyway." }],
          hints:["Find `t` from `x`.", "`t = 2`.", "Check `y`: 3 − 4 = −1 ✓."] },
        { id:"w5", skill:"Coordinate planes", goal:4, prompt:"Which equation describes the `xy`-plane in R³?",
          options:[
            { t:"`z = 0`", ok:true, why:"Every point in the `xy`-plane has height 0." },
            { t:"`x = 0`", why:"That’s the `yz`-plane." },
            { t:"`y = 0`", why:"That’s the `xz`-plane." },
            { t:"`x + y = 0`", why:"That’s a vertical plane through the `z`-axis." }],
          hints:["Which coordinate is zero for every point on the floor?", "Height `z`.", "`z = 0`."] },
        { id:"w6", skill:"Coordinate planes", goal:5, prompt:"In R³, what shape is the set of points with `x = 3`?",
          options:[
            { t:"A plane parallel to the `yz`-plane", ok:true, why:"`y` and `z` are free; only `x` is fixed." },
            { t:"A line parallel to the `y`-axis", why:"In R² `x = 3` is a line; in R³, `z` is free too." },
            { t:"A single point", why:"Two coordinates are still free." },
            { t:"A plane parallel to the `xy`-plane", why:"That would be `z` = constant." }],
          hints:["Which coordinates are free?", "`y` and `z`: two directions of freedom.", "A plane, parallel to the `yz`-plane."] }
      ],
      refreshers:{
        "Vectors in R³":"`vec{AB}` = B − A, component by component. Parallel vectors are scalar multiples (module 39).",
        "Lines in R²":"`vec{r} = vec{r}_0 + t vec{m}`; a point is on the line when one `t` works for every coordinate (module 48).",
        "Coordinate planes":"`xy`-plane: `z = 0`; `yz`-plane: `x = 0`; `xz`-plane: `y = 0`. One equation in R³ fixes one condition and leaves a plane (module 37)."
      }
    }
  },
  explore:{
    heading:"3D line tracer",
    intro:"Set a point and a direction, then slide `t` to trace the line through space. Watch all three forms update, and find where the line pierces the coordinate planes.",
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Trace, `vec{r} = (1, 2, 3) + t(2, -1, 1)`. Where does the line meet the `xy`-plane?",
        options:[{ t:"(−5, 5, 0)", ok:true }, { t:"(1, 2, 0)" }, { t:"(7, −1, 0)" }, { t:"(0, 5/2, 5/2)" }],
        explain:"`z = 3 + t = 0` at `t = -3`. (1, 2, 0) just drops the starting point’s height; (7, −1, 0) uses `t = +3`; (0, 5/2, 5/2) is where it meets the `yz`-plane." },
      { id:"p2", prompt:"Equations mode, one chip: `x + 2y - z = 4`. What shape will appear?",
        options:[{ t:"a plane", ok:true }, { t:"a line" }, { t:"a point" }, { t:"two lines" }],
        explain:"Pick any `x` and `y`; `z` is then fixed. Two free choices make a plane." },
      { id:"p3", prompt:"Trace, `vec{m} = (3, 0, 4)`. What’s special about this line?",
        options:[{ t:"every point has the same `y`: it’s parallel to the `xz`-plane", ok:true }, { t:"it’s parallel to the `y`-axis" }, { t:"it passes through the origin" }, { t:"it has no symmetric equations at all" }],
        explain:"`y = y_0 + 0t`. Symmetric form still works for `x` and `z`, with `y = y_0` written separately." },
      { id:"p4", prompt:"Two points, A(1, 0, 2), B(3, 4, 0). Where is the point at `t = ½`?",
        options:[{ t:"(2, 2, 1)", ok:true }, { t:"(4, 4, 2)" }, { t:"(1, 2, −1)" }, { t:"(3, 4, 0)" }],
        explain:"A + ½(B − A) = (1, 0, 2) + (1, 2, −1). (4, 4, 2) is A + B; (1, 2, −1) forgets to start at A; (3, 4, 0) is `t = 1`." }
    ],
    chalIntro:"Use the 3D line tracer to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Trace mode: make the line pass through A(2, −1, 3) and B(4, 3, 1).",
        why:"B − A = (2, 4, −2), a multiple of (1, 2, −1), and your starting point is on the line through A and B.",
        hints:["Direction = B − A.", "(2, 4, −2), or (1, 2, −1).", "`vec{r} = (2, -1, 3) + t(1, 2, -1)`."],
        msgs:{ mode:"Switch to Trace mode first.",
          m242:"The `z`-components were subtracted in the other order: 1 − 3 = −2.",
          m312:"That’s ½(A + B). " + M4,
          off:"Parallel to AB, but A isn’t on it.",
          other:"This line doesn’t pass through both A and B yet. Start with the direction B − A." } },
      { id:"tc2", goal:4, prompt:"Make a line through (1, 2, −2) that <strong>never</strong> meets the `xy`-plane.",
        why:"With `m_3 = 0`, `z` stays at −2 for every `t`, so the line never reaches `z = 0`.",
        hints:["Which coordinate must never become 0?", "`z` must stay at −2, so `z` can’t change.", "Any `vec{m} = (a, b, 0)`, e.g. `vec{r} = (1, 2, -2) + t(1, 0, 0)`."],
        msgs:{ mode:"Switch to Trace mode first.",
          up:"Straight up: it hits `z = 0` at (1, 2, 0) when `t = 2`.",
          zc:"Any change in `z` eventually reaches `z = 0`.",
          lies:"That line lies <strong>in</strong> the `xy`-plane. " + M7,
          miss:"This line never meets the `xy`-plane, but it doesn’t pass through (1, 2, −2)." } },
      { id:"tc3", goal:5, stretch:true, prompt:"Equations mode: choose <strong>two</strong> chips whose planes meet in exactly the line through (1, 2, 3) with direction (1, −1, 0).",
        why:"Every point (1 + `t`, 2 − `t`, 3) satisfies both of your equations, and they are different planes.",
        hints:["Every point (1 + `t`, 2 − `t`, 3) must satisfy both equations.", "`x + y` stays 3 and `z` stays 3 along the line.", "`x + y = 3` and `z = 3` work; so does any pair of the chips that are true all along the line, as long as they aren’t the same plane."],
        msgs:{ mode:"Switch to Equations mode first.", none:"Choose two chips first.",
          one:"One equation is a plane. " + M1,
          same:"These are the same plane, so there’s no single line.",
          xy:"Through (1, 2, 3), but the line runs along (1, 1, 0).",
          yz:"Through (1, 2, 3), but along (0, 1, −1).",
          other:"These planes meet in the line {line}. That isn’t the line through (1, 2, 3) with direction (1, −1, 0).",
          par:"These planes are parallel: they never meet." } }
    ]
  },
  part3:{
    slug:"two-points", name:"Two points",
    heading:"Two points, one line",
    intro:"One line through A(1, 3, −4) and B(3, 1, 0), four jobs. Work through the stations: each answer is checked and then drawn in the 3D view beside it. Then try the quick check.",
    stations:[
      { id:"s1", chip:"Station 1: three forms", title:"Station 1: three forms",
        text:"Build the direction, then write the line three ways. Any equivalent form is accepted (for example, starting from B).",
        msgs:{ ok:"✓ Correct. `vec{m} = B - A = (2, -2, 4)`, or simplified, (1, −1, 2).",
          sum:"That’s A + B. " + M4, rev:"That’s A − B, which points from B to A. " + M4,
          dir:"Subtract coordinate by coordinate: B − A = (3 − 1, 1 − 3, 0 − (−4)).",
          formOk:"✓ Correct. It passes through the line’s points with a direction parallel to (1, −1, 2).",
          swap:"Point and direction are swapped: the point goes first, the direction is multiplied by `t`.",
          par:"That direction isn’t parallel to B − A = (2, −2, 4).",
          pt:"That point isn’t on the line. Use A(1, 3, −4) or B(3, 1, 0).",
          zero:"Never divide by 0. Every direction component of this line is non-zero, so all three fractions are needed.",
          empty:"Fill in every box first (whole numbers or fractions)." } },
      { id:"s2", chip:"Station 2: on the line or not?", title:"Station 2: on the line or not?",
        text:"Use `vec{r} = (1, 3, -4) + t(1, -1, 2)`. For each point, find `t` from each coordinate, then decide.",
        pts:[ { id:"a", p:[5, -1, 4], ts:[4, 4, 4], on:true, why:"`t = 4` in all three coordinates, so <strong>yes</strong>." },
              { id:"b", p:[2, 2, -1], ts:[1, 1, 1.5], on:false, why:"`x` and `y` give `t = 1`, but `z` gives `t = 3/2`, so <strong>no</strong>. The view shows (2, 2, −2) on the line next to (2, 2, −1) just above it." } ],
        msgs:{ t:"Solve each coordinate for `t`: for example, `x`: 1 + `t` = {x}.", verdict:M3, empty:"Fill in the three `t`-values and choose a verdict." } },
      { id:"s3", chip:"Station 3: piercing the planes", title:"Station 3: piercing the coordinate planes",
        text:"Set the right coordinate to 0, solve for `t`, then find the point. Rings appear in the view as each one is found.",
        rows:[ { id:"xy", k:2, lab:"`xy`-plane (`z = 0`)", t:2, p:[3, 1, 0], note:"which is B itself" },
               { id:"yz", k:0, lab:"`yz`-plane (`x = 0`)", t:-1, p:[0, 4, -6] },
               { id:"xz", k:1, lab:"`xz`-plane (`y = 0`)", t:3, p:[4, 0, 2] } ],
        msgs:{ plane:M7, t:"Set that coordinate of (1 + `t`, 3 − `t`, −4 + 2`t`) equal to 0 and solve for `t`.", pt:"Substitute your `t` into all three coordinates.", empty:"Fill in `t` and all three coordinates." } },
      { id:"s4", chip:"Station 4: a line as two planes", title:"Station 4: a line as two planes",
        text:"Split the symmetric equations `(x - 1)/1 = (y - 3)/(-1) = (z + 4)/2` into two equations. Each one is a plane; the line is where they meet.",
        eqs:[ { id:"e1", from:"`(x - 1)/1 = (y - 3)/(-1)` gives", vars:["x", "y"], n:[1, 1, -4], show:"`x + y - 4 = 0`" },
              { id:"e2", from:"`(x - 1)/1 = (z + 4)/2` gives", vars:["x", "z"], n:[2, -1, -6], show:"`2x - z - 6 = 0`" } ],
        alg:["B(3, 1, 0) in `x + y - 4 = 0`: 3 + 1 − 4 = 0 ✓", "B(3, 1, 0) in `2x - z - 6 = 0`: 6 − 0 − 6 = 0 ✓", "Both planes contain the line, and they aren’t the same plane, so they meet in exactly this line."],
        msgs:{ ok:"✓ Correct.", bad:"Cross-multiply the two fractions, then bring every term to one side.", empty:"Fill in all three boxes.", zero:"The coefficients can’t all be 0." } }
    ],
    quickCheck:{
      title:"Quick check", summary:"Two points, one line quick check",
      items:[
        { id:"q1", goal:3, prompt:"Is (0, 4, −6) on `(x - 1)/1 = (y - 3)/(-1) = (z + 4)/2`?",
          choices:[
            { t:"Yes, `t = -1`", ok:true, fb:"Right. Each fraction equals −1." },
            { t:"No", fb:"Each fraction equals −1." },
            { t:"Yes, `t = 1`", fb:"Each fraction equals −1." },
            { t:"Only two coordinates match", fb:"Each fraction equals −1." }] },
        { id:"q2", goal:4, prompt:"Where does `vec{r} = (2, -1, 6) + t(1, 1, -3)` meet the `xy`-plane?",
          choices:[
            { t:"(4, 1, 0)", ok:true, fb:"Right. `z = 6 - 3t = 0` at `t = 2`." },
            { t:"(2, −1, 0)", fb:"`z = 6 - 3t = 0` at `t = 2`." },
            { t:"(0, −3, 12)", fb:"`z = 6 - 3t = 0` at `t = 2`." },
            { t:"(8, 5, −12)", fb:"`z = 6 - 3t = 0` at `t = 2`." }] },
        { id:"q3", goal:5, prompt:"Which pair of planes contains the line `x = t`, `y = 2`, `z = 1 + t`?",
          choices:[
            { t:"`y = 2` and `z - x = 1`", ok:true, fb:"Right. `y` never changes, and `z` is always 1 more than `x`." },
            { t:"`y = 2` only", fb:"`y` never changes, and `z` is always 1 more than `x`. One plane alone isn’t a line." },
            { t:"`x + z = 1` and `y = 2`", fb:"`y` never changes, and `z` is always 1 more than `x`. One plane alone isn’t a line." },
            { t:"`x = z` and `y = 2`", fb:"`y` never changes, and `z` is always 1 more than `x`. One plane alone isn’t a line." }] },
        { id:"q4", goal:2, prompt:"Symmetric equations of `vec{r} = (0, 5, -1) + t(4, 0, 3)`?",
          choices:[
            { t:"`x/4 = (z + 1)/3`, `y = 5`", ok:true, fb:"Right. Never divide by 0; `y` stays 5." },
            { t:"`x/4 = (y - 5)/0 = (z + 1)/3`", fb:"Never divide by 0; `y` stays 5." },
            { t:"`x/4 = (y - 5)/1 = (z + 1)/3`", fb:"Never divide by 0; `y` stays 5." },
            { t:"`(x - 4)/0 = …`", fb:"Never divide by 0; `y` stays 5." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Description ↔ equation", summary:"Description ↔ equation", goal:[1, 2, 6],
        instruction:"Tap a description, then tap the equation of the same line.",
        leftTitle:"Description", rightTitle:"Equation",
        left:[
          { id:"l1", t:"Through (1, −2, 3), direction (2, 0, −1)", why:"The `y`-component of the direction is 0, so `y` stays −2." },
          { id:"l2", t:"Through (0, 0, 0) and (2, 1, 3)", why:"Start at the origin; the direction is (2, 1, 3) − (0, 0, 0)." },
          { id:"l3", t:"`(x - 1)/2 = (y + 2)/3 = (z - 3)/(-1)`", why:"Point from the numerators (1, −2, 3), direction from the denominators (2, 3, −1)." },
          { id:"l4", t:"Parallel to the `z`-axis through (4, −1, 0)", why:"The `z`-axis direction is (0, 0, 1)." },
          { id:"l5", t:"Through A(1, 1, 1) and B(3, 0, 5)", why:"B − A = (2, −1, 4).",
            hints:["B − A.", "(2, −1, 4).", "`vec{r} = (1, 1, 1) + t(2, -1, 4)`."] },
          { id:"l6", t:"`x = -1 + t`, `y = 2t`, `z = 5`", why:"`z` doesn’t involve `t`, so it’s written separately.",
            hints:["Which coordinate doesn’t involve `t`?", "`z = 5` always.", "`(x + 1)/1 = y/2`, `z = 5`."] },
          { id:"l7", t:"Through (2, 0, −1), parallel to `vec{r} = (5, 5, 5) + s(1, -2, 2)`", why:"Same direction (1, −2, 2), new point (2, 0, −1)." },
          { id:"l8", t:"The `x`-axis", why:"Through the origin with direction (1, 0, 0)." }
        ],
        right:[
          { id:"r1", t:"`x = 1 + 2t`, `y = -2`, `z = 3 - t`" },
          { id:"r2", t:"`vec{r} = t(2, 1, 3)`" },
          { id:"r3", t:"`vec{r} = (1, -2, 3) + t(2, 3, -1)`" },
          { id:"r4", t:"`vec{r} = (4, -1, 0) + t(0, 0, 1)`" },
          { id:"r5", t:"`vec{r} = (1, 1, 1) + t(2, -1, 4)`" },
          { id:"r6", t:"`(x + 1)/1 = y/2`, `z = 5`" },
          { id:"r7", t:"`vec{r} = (2, 0, -1) + t(1, -2, 2)`" },
          { id:"r8", t:"`vec{r} = t(1, 0, 0)`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r3":"Same point (1, −2, 3), but direction (2, 3, −1) has a `y`-change; line 1’s `y` never changes.",
          "l3|r1":"Same point (1, −2, 3), but direction (2, 3, −1) has a `y`-change; line 1’s `y` never changes.",
          "l4|r8":"The `z`-axis direction is (0, 0, 1); the `x`-axis is (1, 0, 0).",
          "l8|r4":"The `z`-axis direction is (0, 0, 1); the `x`-axis is (1, 0, 0)."
        },
        wrongDefault:"Check the point first, then the direction." },
      { id:"space", type:"custom", title:"Find it in space", summary:"Find it in space", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Find each answer. Items 4 to 7 are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −5/2 in the boxes, then press Check.",
        msgs:{ empty:"Fill in every box first.", err:"Type whole numbers or fractions, such as 4 or −5/2.", yn:"Choose Yes or No first." },
        items:[
          { id:"n1", goal:1, kind:"pt", prompt:"The point at `t = -2` on `vec{r} = (3, 1, -4) + t(1, -2, 3)`.", answer:[1, 5, -10], display:"(1, 5, −10)",
            wrong:[{ v:[5, -3, 2], fb:"That’s `t = +2`." }], wrongDefault:"Substitute `t = -2` into each coordinate: 3 + (−2)(1), 1 + (−2)(−2), −4 + (−2)(3).",
            why:"(3 − 2, 1 + 4, −4 − 6) = (1, 5, −10)." },
          { id:"n2", goal:3, kind:"ab", prompt:"(5, `a`, `b`) is on `x = 1 + 2t`, `y = 3 - t`, `z = 4t`. Find `a` and `b`.", answer:[1, 8], display:"`a = 1`, `b = 8`",
            wrong:[{ v:[5, null], fb:"Find `t` from `x` first: `t = 2`." }], wrongDefault:"Find `t` from `x` first: `t = 2`. Then use the same `t` for `y` and `z`.",
            why:"`x`: 1 + 2`t` = 5 gives `t = 2`, so `a` = 3 − 2 = 1 and `b` = 4(2) = 8." },
          { id:"n3", goal:4, kind:"pt", prompt:"Where does `vec{r} = (2, -1, 4) + t(1, 1, -2)` meet the `xy`-plane?", answer:[4, 1, 0], display:"(4, 1, 0)",
            wrong:[{ v:[2, -1, 0], fb:"The other coordinates change too. " + M7 }], wrongDefault:"The `xy`-plane is where `z = 0`: solve 4 − 2`t` = 0 first.",
            why:"`z = 4 - 2t = 0` at `t = 2`: (2 + 2, −1 + 2, 0) = (4, 1, 0)." },
          { id:"n4", goal:3, kind:"yn", star:true, prompt:"Is (7, −3, 2) on `(x - 1)/3 = (y + 1)/(-1) = (z - 6)/(-2)`? If yes, enter `t`.", answer:["yes", 2], display:"Yes, `t = 2`",
            wrongDefault:"All three fractions equal 2.",
            why:"6/3 = 2, (−2)/(−1) = 2 and (−4)/(−2) = 2: all three fractions equal 2." },
          { id:"n5", goal:4, kind:"pt", star:true, prompt:"The line through A(1, 2, −1) and B(3, −2, 5): where does it cross the `yz`-plane?", answer:[0, 4, -4], display:"(0, 4, −4)",
            wrong:[{ v:[1, 2, 0], fb:"The `yz`-plane is `x = 0`." }], wrongDefault:"The `yz`-plane is `x = 0`. Use the direction B − A and solve for `t` from `x`.",
            hints:["Direction B − A = (2, −4, 6).", "`x = 1 + 2t = 0` at `t = -½`.", "(0, 2 + 2, −1 − 3) = (0, 4, −4)."],
            why:"`x = 1 + 2t = 0` at `t = -½`, giving (0, 4, −4)." },
          { id:"n6", goal:6, kind:"k", star:true, prompt:"For which `k` is `vec{r} = (1, 0, 2) + t(2, k, -1)` parallel to `(x - 3)/(-4) = (y + 1)/6 = z/2`?", answer:[-3], display:"`k = -3`",
            wrong:[{ v:[3], fb:"(−4, 6, 2) = −2(2, −3, −1)." }], wrongDefault:"Parallel lines have parallel directions: (2, `k`, −1) must be a multiple of (−4, 6, 2).",
            hints:["Parallel lines have parallel directions.", "Divide (−4, 6, 2) by −2.", "(2, −3, −1): `k = -3`."],
            why:"(−4, 6, 2) = −2(2, −3, −1), so `k = -3`." },
          { id:"n7", goal:5, kind:"two", star:true, prompt:"Write the line `x = 1 + 2t`, `y = -3 + t`, `z = 4 - 3t` as two planes: `x - 2y +` □ = 0 and `3y + z +` □ = 0.", answer:[-7, 5], display:"−7 and 5",
            wrongDefault:"`t = y + 3`. Then `x = 2y + 7` and `z = -3y - 5`.",
            hints:["Solve the `y`-equation for `t`.", "`t = y + 3`; substitute into `x` and `z`.", "`x - 2y - 7 = 0` and `3y + z + 5 = 0`; check (1, −3, 4): 1 + 6 − 7 = 0 and −9 + 4 + 5 = 0."],
            why:"`x - 2y - 7 = 0` and `3y + z + 5 = 0`; (1, −3, 4) satisfies both." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Anika", how:"", goal:[2, 3, 6],
        instruction:"Anika made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write symmetric equations of the line through (2, −1, 4) with direction (3, 0, −2).",
            steps:["Parametric: `x = 2 + 3t`, `y = -1`, `z = 4 - 2t`.", "Solve each for `t`: `t = (x - 2)/3`, `t = (y + 1)/0`, `t = (z - 4)/(-2)`.", "`(x - 2)/3 = (y + 1)/0 = (z - 4)/(-2)`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 copies step 2. The mistake is earlier."],
            fixes:[
              { t:"`y` doesn’t involve `t`: write `(x - 2)/3 = (z - 4)/(-2)`, `y = -1`.", ok:true, why:"`y` is −1 for every `t`, so it is stated on its own." },
              { t:"Replace the 0 with 1: `(y + 1)/1`.", why:"That changes the line: `y` would vary." },
              { t:"`(x + 2)/3 = (y - 1)/0 = (z + 4)/(-2)`.", why:M5 },
              { t:"Step 2 is correct.", why:"Division by 0 is undefined." }],
            hints:["Can you solve `y = -1` for `t`?", "No: `y` is the same for every `t`.", "State `y = -1` separately."] },
          { id:"e2", goal:3, task:"Is P(5, 1, 0) on `vec{r} = (1, 3, 2) + t(2, -1, -2)`?",
            steps:["`x`: 1 + 2`t` = 5, so `t = 2`.", "`y`: 3 − `t` = 1, so `t = 2`.", "Two coordinates agree, so P is on the line.", "P is the point at `t = 2`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Check `z` too: 2 − 2(2) = −2 ≠ 0, so P is <strong>not</strong> on the line.", ok:true, why:M3 },
              { t:"Use the `z`-equation instead: `t = 1`, so P is on the line at `t = 1`.", why:"`t = 1` gives (3, 2, 0), not P." },
              { t:"Average the `t`-values.", why:"A point on the line has one `t` for every coordinate; averaging hides a mismatch. " + M3 },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["How many coordinates does a point in R³ have?", "Three, so all three must agree.", "`z` at `t = 2` is −2, not 0."] },
          { id:"e3", goal:6, task:"Write a vector equation of the line through A(3, 0, −1) parallel to `(x - 1)/2 = (y + 5)/(-1) = z/4`.",
            steps:["The given line’s direction is (2, −1, 4).", "A point on the given line is (1, −5, 0).", "`vec{r} = (1, -5, 0) + t(2, -1, 4)`.", "Done."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is true, but not needed.", "", "Step 4 accepts step 3."],
            fixes:[
              { t:"Use A as the point: `vec{r} = (3, 0, -1) + t(2, -1, 4)`.", ok:true, why:"Keep the direction, change the point." },
              { t:"Use the direction A − (1, −5, 0) = (2, 5, −1).", why:"That line goes through both points, so it isn’t parallel." },
              { t:"`vec{r} = (3, 0, -1) + t(1, -5, 0)`.", why:"(1, −5, 0) is a point, not the direction." },
              { t:"Step 3 is correct.", why:"That’s the given line itself; it doesn’t pass through A. " + M6 }],
            hints:["Which point must the new line pass through?", "A(3, 0, −1).", "Keep the direction, change the point."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the 3D view: one equation drawing a whole plane, or a line that never touches the floor?" },
      { id:"j2", q:"In your own words, why can’t one equation like `x + 2y - z = 4` describe a line in R³?" },
      { id:"j3", q:"Explain to a friend how to write symmetric equations when one direction component is 0." },
      { id:"j4", q:"Which job (three forms, testing a point, plane crossings, or two-plane form) still feels slow? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a vector equation of the line through (2, 0, −3) with direction (1, −4, 5)?", options:[
          { t:"`vec{r} = (2, 0, -3) + t(1, -4, 5)`", ok:true, why:"Point first, then `t` times the direction." },
          { t:"`vec{r} = (1, -4, 5) + t(2, 0, -3)`", why:"Point and direction swapped." },
          { t:"`vec{r} = (2, 0, -3) + t(-1, 4, 5)`", why:"Only the first two signs changed: a different direction." },
          { t:"`x - 4y + 5z + 13 = 0`", why:"One equation in R³ is a plane." }] },
        b:{ prompt:"Which is a vector equation of the line through (−1, 3, 0) with direction (2, 2, −1)?", options:[
          { t:"`vec{r} = (-1, 3, 0) + t(2, 2, -1)`", ok:true, why:"Point first, then `t` times the direction." },
          { t:"`vec{r} = (2, 2, -1) + t(-1, 3, 0)`", why:"Swapped." },
          { t:"`vec{r} = (-1, 3, 0) + t(2, -2, -1)`", why:"A different direction." },
          { t:"`2x + 2y - z - 4 = 0`", why:M1 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Symmetric equations of `vec{r} = (4, -2, 1) + t(3, 5, -2)`?", options:[
          { t:"`(x - 4)/3 = (y + 2)/5 = (z - 1)/(-2)`", ok:true, why:"Numerators `(x - x_0)` from the point, denominators from the direction." },
          { t:"`(x + 4)/3 = (y - 2)/5 = (z + 1)/(-2)`", why:"The signs come from `(x - x_0)`." },
          { t:"`(x - 3)/4 = (y - 5)/(-2) = (z + 2)/1`", why:"The point and direction roles are swapped." },
          { t:"`(x - 4)/3 + (y + 2)/5 + (z - 1)/(-2) = 0`", why:"Adding the fractions makes one equation: a plane." }] },
        b:{ prompt:"Symmetric equations of `vec{r} = (-3, 0, 2) + t(1, -4, 6)`?", options:[
          { t:"`(x + 3)/1 = y/(-4) = (z - 2)/6`", ok:true, why:"`x - (-3) = x + 3`, `y - 0 = y`, `z - 2`; denominators from the direction." },
          { t:"`(x - 3)/1 = y/(-4) = (z + 2)/6`", why:"The signs come from `(x - x_0)`: `x_0 = -3` gives `(x + 3)`." },
          { t:"`(x + 3)/1 = y/(-4)`, `z = 2`", why:"`z` does change: its direction component is 6." },
          { t:"`(x + 3)/1 + y/(-4) + (z - 2)/6 = 0`", why:"Adding the fractions makes one equation: a plane." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the set of points (`x`, `y`, `z`) with `2x - y + 3z = 6`?", options:[
          { t:"A plane", ok:true, why:"One equation leaves two free choices." },
          { t:"A line", why:M1 },
          { t:"A single point", why:"One equation can’t pin down three coordinates." },
          { t:"Three lines through the axes", why:"Those are just the plane’s traces on the coordinate planes." }] },
        b:{ prompt:"In R³, what is the set of points with `y = 4`?", options:[
          { t:"A plane parallel to the `xz`-plane", ok:true, why:"`x` and `z` are free; only `y` is fixed." },
          { t:"A line parallel to the `x`-axis", why:"That’s the answer in R²; in R³, `z` is free too." },
          { t:"A plane parallel to the `xy`-plane", why:"That would be `z` = constant." },
          { t:"The point (0, 4, 0)", why:"`x` and `z` can be anything." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"For which `a` and `b` is (`a`, 7, `b`) on `vec{r} = (1, 1, 2) + t(2, 3, -1)`?", options:[
          { t:"`a = 5`, `b = 0`", ok:true, why:"1 + 3`t` = 7 gives `t = 2`." },
          { t:"`a = 15`, `b = -5`", why:"That uses `t = 7`, the `y`-value." },
          { t:"`a = 5`, `b = 4`", why:"`z = 2 - t`, not 2 + `t`." },
          { t:"`a = 3`, `b = 1`", why:"`t = 1` gives `y = 4`, not 7." }] },
        b:{ prompt:"For which `a` and `b` is (`a`, `b`, −4) on `vec{r} = (2, 0, 2) + t(-1, 2, 3)`?", options:[
          { t:"`a = 4`, `b = -4`", ok:true, why:"2 + 3`t` = −4 gives `t = -2`." },
          { t:"`a = 6`, `b = -8`", why:"That uses `t = -4`, the `z`-value." },
          { t:"`a = 0`, `b = 4`", why:"Sign slip: `t = -2`, not 2." },
          { t:"`a = 3`, `b = -2`", why:"`t = -1` gives `z = -1`, not −4." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Where does `(x - 1)/2 = (y + 3)/1 = (z - 4)/(-2)` meet the `xz`-plane?", options:[
          { t:"(7, 0, −2)", ok:true, why:"`y = -3 + t = 0` at `t = 3`." },
          { t:"(5, −1, 0)", why:"That’s the `xy`-plane (`z = 0`)." },
          { t:"(1, 0, 4)", why:"Setting `y = 0` in the point alone ignores how `x` and `z` change." },
          { t:"(−5, 0, 10)", why:"−3 + `t` = 0 gives `t = 3`, not −3." }] },
        b:{ prompt:"Where does `vec{r} = (2, -1, 3) + t(-1, 2, 1)` meet the `yz`-plane?", options:[
          { t:"(0, 3, 5)", ok:true, why:"`x = 2 - t = 0` at `t = 2`." },
          { t:"(5, −7, 0)", why:"That’s the `xy`-plane." },
          { t:"(0, −1, 3)", why:"`y` and `z` change too." },
          { t:"(0, −5, 1)", why:"2 − `t` = 0 gives `t = 2`, not −2." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which pair of equations describes exactly the line `vec{r} = (1, 2, 0) + t(1, 0, 1)`?", options:[
          { t:"`y = 2` and `x - z = 1`", ok:true, why:"Along the line, `y` stays 2 and `x` is always 1 more than `z`." },
          { t:"`x - z = 1` on its own", why:"One equation is a plane." },
          { t:"`y = 2` and `x + z = 1`", why:"At `t = 1` the point (2, 2, 1) gives `x + z = 3`." },
          { t:"`x = 1 + t` and `z = t`", why:"With no condition on `y`, that’s a plane." }] },
        b:{ prompt:"Which pair describes exactly the line `vec{r} = (0, 1, 3) + t(2, 1, 0)`?", options:[
          { t:"`z = 3` and `x - 2y + 2 = 0`", ok:true, why:"Along the line, `z` stays 3 and `x = 2t = 2(y - 1)`, so `x - 2y + 2 = 0`." },
          { t:"`x - 2y + 2 = 0` on its own", why:M1 },
          { t:"`z = 3` and `2x - y + 1 = 0`", why:"It passes through (0, 1, 3), but at `t = 1` the point (2, 2, 3) gives 3, not 0: wrong direction." },
          { t:"`x = 2t` and `y = 1 + t`", why:"`z` is left free: a plane." }] } },
      { id:"c1", cat:"C", goal:[2, 5],
        a:{ prompt:"Which best explains why a line in R³ can’t be written as one equation like `2x + y - z = 4`?", options:[
          { t:"“One linear equation in `x`, `y` and `z` leaves two variables free, so its solutions form a plane; a line needs two equations together, or a parameter.”", ok:true, why:"Two free choices make a plane; a line has only one, the parameter `t`." },
          { t:"“It can: `2x + y - z = 4` is a line with slope 2.”", why:M1 },
          { t:"“Lines in R³ have no direction vector.”", why:"They do; that’s how we write them." },
          { t:"“Equations containing `z` always describe points.”", why:"Points need three conditions." }] },
        b:{ prompt:"Why are the symmetric equations of `vec{r} = (1, 4, -2) + t(0, 3, 5)` written as `x = 1`, `(y - 4)/3 = (z + 2)/5`?", options:[
          { t:"“`x` never changes (its direction component is 0) and division by 0 is undefined, so `x = 1` is stated on its own while `y` and `z` share the parameter.”", ok:true, why:"A zero component means that coordinate is constant." },
          { t:"“`(x - 1)/0 = (y - 4)/3 = (z + 2)/5` would be just as good.”", why:"Division by 0 is undefined. If `m_1 = 0`, `x` never changes: write `x = x_0` separately." },
          { t:"“Because the line lies in the `yz`-plane.”", why:"`x = 1`, not 0: the line is parallel to the `yz`-plane." },
          { t:"“Because the line is parallel to the `x`-axis.”", why:"A zero `x`-component means the line is perpendicular to the `x`-axis." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which statement is true?", options:[
          { t:"`vec{r} = (1, 0, 2) + t(2, -1, 3)` and `vec{r} = (5, -2, 8) + s(-4, 2, -6)` are the same line.", ok:true, why:"Parallel directions, and (5, −2, 8) is the first line’s point at `t = 2`." },
          { t:"`vec{r} = (1, 0, 2) + t(2, -1, 3)` and `vec{r} = (3, 1, 5) + s(2, -1, 3)` are the same line.", why:"(3, 1, 5) isn’t on the first line: `t = 1` gives (3, −1, 5)." },
          { t:"A direction vector of a line can’t have a zero component.", why:"(3, 0, 4) is a fine direction." },
          { t:"Each line in R³ has exactly one vector equation.", why:"Any point and any parallel direction work." }] },
        b:{ prompt:"Which statement is true?", options:[
          { t:"`vec{r} = (0, 1, -1) + t(1, 2, -2)` and `vec{r} = (2, 5, -5) + s(-3, -6, 6)` are the same line.", ok:true, why:"Parallel, and `t = 2` gives (2, 5, −5)." },
          { t:"`vec{r} = (0, 1, -1) + t(1, 2, -2)` and `vec{r} = (1, 2, -2) + s(1, 2, -2)` are the same line.", why:"(1, 2, −2) isn’t on the first line: `t = 1` gives (1, 3, −3)." },
          { t:"A direction vector can’t have a zero component.", why:"(3, 0, 4) is a fine direction." },
          { t:"Each line has exactly one vector equation.", why:"Any point and any parallel direction work." }] } },
      { id:"a1", cat:"A", goal:[1, 4],
        a:{ prompt:"A drone climbs in a straight line. Its position (m) after `t` seconds is (10, −6, 0) + `t`(4, 3, 2). When is it 30 m high, and where is it then?", options:[
          { t:"After 15 s, at (70, 39, 30)", ok:true, why:"2`t` = 30 gives `t = 15`." },
          { t:"After 15 s, at (10, −6, 30)", why:"`x` and `y` change too." },
          { t:"After 15 s, at (60, 45, 30)", why:"15(4, 3, 2) without adding the start (10, −6, 0)." },
          { t:"After 30 s, at (130, 84, 60)", why:"`z = 2t`, so `z = 30` needs `t = 15`." }] },
        b:{ prompt:"Position (m) after `t` seconds: (−20, 8, 0) + `t`(5, −2, 3). When is it 45 m high, and where?", options:[
          { t:"After 15 s, at (55, −22, 45)", ok:true, why:"3`t` = 45 gives `t = 15`." },
          { t:"After 15 s, at (−20, 8, 45)", why:"`x` and `y` change too." },
          { t:"After 15 s, at (75, −30, 45)", why:"Forgot the start." },
          { t:"After 45 s, at (205, −82, 135)", why:"`z = 3t`." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A straight tunnel is drilled from A(0, 0, 40) on a hillside toward B(30, 60, 20) (metres; `z` is height above sea level). If it continues in the same direction, where does it reach sea level (`z = 0`)?", options:[
          { t:"(60, 120, 0)", ok:true, why:"`vec{m} = (30, 60, -20)`; 40 − 20`t` = 0 at `t = 2`." },
          { t:"(30, 60, 0)", why:"B is at height 20; the tunnel must keep going past B." },
          { t:"(90, 180, −20)", why:"Adding 2`vec{m}` to B instead of A overshoots." },
          { t:"(20, 40, 0)", why:"`t` = 40 ÷ 60 divides the height by the `y`-change, not by the drop per step." }] },
        b:{ prompt:"A tunnel runs from A(0, 0, 60) toward B(20, 10, 40). Where does its line reach `z = 0`?", options:[
          { t:"(60, 30, 0)", ok:true, why:"60 − 20`t` = 0 at `t = 3`." },
          { t:"(20, 10, 0)", why:"B is at height 40." },
          { t:"(80, 40, −20)", why:"3`vec{m}` added to B." },
          { t:"(120, 60, 0)", why:"`t` = 60 ÷ 10 uses the `y`-change." }] } }
    ]
  },
  task:{
    title:"Through P, tilted just right", summary:"Through P, tilted just right",
    statement:"<p>Design a line `vec{r} = (a, b, c) + t(d, e, f)` that meets every condition. Can you find all the different lines?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It passes through P(2, 1, −1).</li><li>It meets the `xy`-plane at a point with whole-number coordinates.</li><li>Its direction is perpendicular to (1, 1, 1).</li><li>Its direction isn’t parallel to any coordinate plane (no zero component).</li></ol></div>",
    checks:["Passes through P", "Whole-number crossing with `z = 0`", "Perpendicular to (1, 1, 1)", "No zero component"],
    tips:["Easiest start: use P itself as (`a`, `b`, `c`).",
      "From P, `z = -1 + tf` reaches 0 at `t = 1/f`. The crossing (2 + `d/f`, 1 + `e/f`, 0) is whole when `f` divides `d` and `e`; try `f = 1`.",
      "The components must add to 0.",
      "No component may be 0."],
    explainPrompt:"Explain how each condition limited your choice of direction, and why choosing `f = 1` made line 2 easy.",
    vocab:"Use the words direction vector, parameter, `xy`-plane and perpendicular.",
    more:"Equivalent descriptions of one line count once. Can you find them all?",
    afterAt:6,
    after3:"With `f = 1`, line 3 forces `e = -1 - d`, and line 4 rules out `d = 0` and `d = -1`. The range of the inputs leaves these six."
  },
  cards:[
    ["Vector equation (R³)", "`vec{r} = vec{r}_0 + t vec{m}`, `t ∈ ℝ`."],
    ["Parametric equations (R³)", "`x = x_0 + t m_1`, `y = y_0 + t m_2`, `z = z_0 + t m_3`."],
    ["Symmetric equations", "`(x - x_0)/m_1 = (y - y_0)/m_2 = (z - z_0)/m_3` (no `m` equal to 0)."],
    ["Zero direction component", "That coordinate is constant: write it separately, e.g. “`(x - 1)/3 = (z + 2)/4`, `y = 2`”."],
    ["Direction through A and B", "B − A."],
    ["Point on the line?", "One `t` must work for <strong>all three</strong> coordinates."],
    ["Coordinate planes", "`xy`: `z = 0` · `yz`: `x = 0` · `xz`: `y = 0`."],
    ["One equation in R³", "A plane, not a line."],
    ["Line as two planes", "Split the symmetric equations into two equations; their planes meet in the line."],
    ["Never meets the `xy`-plane", "`m_3 = 0` and `z_0 ≠ 0`."],
    ["Parallel line through a new point", "Same direction, new point."],
    ["Same line", "Parallel directions <strong>and</strong> a shared point."]
  ]
};
