// MCV4U 38 Cartesian Vectors in R². Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/38-cartesian-vectors-in-r2.md
// misconception core sentences (plan §3)
const M1 = "Measured from the `x`-axis, the `x`-component uses cosine: `x = r cos θ`.";
const M3 = "Bearings start at north and turn clockwise. Standard angles start at east and turn counterclockwise: θ = 90° − bearing.";
const M4 = "Add the components, not the lengths: `(3, 4) + (-3, 4) = (0, 8)`, length 8, not 10.";
const M5 = "`vec{AB}` goes from A to B: B − A.";
const M6 = "Square each component (squares are positive), add, then take the root.";
const M7 = "Parallel means one vector is `k` times the other: <strong>both</strong> components scale by the same `k`.";

export default {
  id:"38-cartesian-vectors-in-r2",
  kind:"topic",
  title:"Cartesian vectors in R²",
  topic:"Cartesian Vectors in R²",
  readyTopic:"Cartesian vectors in R²",
  hero:{
    eq:"`@n{vec{u}} = (r cos @t{θ}, r sin @t{θ}) = a vec{i} + b vec{j}` <span class=\"cv-heq2\">`r = √{a^2 + b^2}`</span>",
    eqLabel:"Vector u equals r cos theta, r sin theta, which equals a i plus b j. r equals the square root of a squared plus b squared.",
    eqSize:"sm",
    headline:"Every arrow has a shadow on each axis",
    text:"Describe a vector by how long it is and which way it points, or by its <strong>components</strong>: how far it goes across and how far up. Trig converts one description into the other. `vec{i}` and `vec{j}` are the one-step arrows along the axes. <strong>Bearings</strong> describe the same directions starting from north. Once a vector is in components, adding and scaling are just arithmetic.",
    fig:{ aria:"An arrow of length 8 sweeps from 0° to 150°, its components −4√3 and 4 drop onto the axes, and a compass rose labels the same arrow true bearing 300°, N 60° W.", shape:"square" }
  },
  goals:[
    "I can write a vector given by magnitude and direction in Cartesian form, `(a, b) = a vec{i} + b vec{j}`, using special angles.",
    "I can find the magnitude and direction of a vector from its components, placing the angle in the correct quadrant.",
    "I can convert between standard angles, true bearings and quadrant bearings.",
    "I can add, subtract and multiply vectors by scalars using components, and find magnitudes of the results.",
    "I can find `vec{AB}` from two points and test whether two vectors are parallel.",
    "I can solve problems with Cartesian vectors, such as routes and displacements."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Special angles", goal:1, prompt:"`cos 60°` = ?",
          options:[
            { t:"`1/2`", ok:true, why:"In the 30-60-90 triangle with hypotenuse 2, the side next to 60° is 1: `cos 60° = 1/2`." },
            { t:"`√3/2`", why:"That’s `sin 60°`." },
            { t:"`√2/2`", why:"That’s the 45° value." },
            { t:"2", why:"That’s `sec 60°`, the reciprocal." }],
          hints:["Picture the 30-60-90 triangle with hypotenuse 2.", "The side next to 60° is 1.", "`1/2`."] },
        { id:"w2", skill:"Special angles", goal:1, prompt:"`sin 135°` = ?",
          options:[
            { t:"`√2/2`", ok:true, why:"Reference angle 45°; sine is positive in quadrant II." },
            { t:"`-√2/2`", why:"Sine is positive above the `x`-axis." },
            { t:"`1/2`", why:"That uses the wrong reference angle: 135° is 45° from the `x`-axis." },
            { t:"`-1/2`", why:"Two slips: the reference angle is 45°, and sine is positive above the `x`-axis." }],
          hints:["Which quadrant is 135° in?", "Quadrant II, reference angle 45°.", "`√2/2`."] },
        { id:"w3", skill:"Reference angles", goal:2, prompt:"An angle in standard position has reference angle 30° and lies in quadrant III. What is it?",
          options:[
            { t:"210°", ok:true, why:"180° + 30°." },
            { t:"150°", why:"180° − 30° is in quadrant II." },
            { t:"330°", why:"330° is in quadrant IV." },
            { t:"120°", why:"Reference angles are measured from the `x`-axis." }],
          hints:["Quadrant III runs from 180° to 270°.", "Add the reference angle to 180°.", "210°."] },
        { id:"w4", skill:"Reference angles", goal:2, prompt:"The terminal arm of θ passes through `(-1, √3)`. What is θ (from 0° to 360°)?",
          options:[
            { t:"120°", ok:true, why:"Reference angle 60° in quadrant II." },
            { t:"60°", why:"That ignores the quadrant: `(-1, √3)` points left and up, into quadrant II." },
            { t:"−60°", why:"−60° points into quadrant IV." },
            { t:"150°", why:"`tan(ref) = √3/1`, so ref = 60°." }],
          hints:["Which quadrant is `(-1, √3)` in?", "`tan(ref) = √3`, so ref = 60°.", "180° − 60° = 120°."] },
        { id:"w5", skill:"Bearings", goal:3, prompt:"A true bearing of 240° is the same as which quadrant bearing?",
          options:[
            { t:"S 60° W", ok:true, why:"240° − 180° = 60° past south, toward west." },
            { t:"S 30° W", why:"Quadrant bearings measure from north or south." },
            { t:"N 60° W", why:"240° is in the south-west, not the north-west." },
            { t:"S 60° E", why:"Past 180° the bearing heads west." }],
          hints:["Which quarter does 240° point into?", "Between 180° (south) and 270° (west).", "60° from south toward west: S 60° W."] },
        { id:"w6", skill:"Magnitude", goal:2, prompt:"A vector goes 5 left and 12 up. How long is it?",
          options:[
            { t:"13", ok:true, why:"`√{(-5)^2 + 12^2} = √{25 + 144} = √169 = 13`." },
            { t:"17", why:"That adds the steps. " + M6 },
            { t:"7", why:"That’s −5 + 12. Square each component." },
            { t:"`√119`", why:"`(-5)^2 = 25`, not −25. " + M6 }],
          hints:["Pythagoras on the components.", "25 + 144.", "13."] }
      ],
      refreshers:{
        "Special angles":"30-60-90 triangle: sides 1, `√3`, 2. 45-45-90: 1, 1, `√2`. cos is adjacent/hypotenuse, sin is opposite/hypotenuse.",
        "Reference angles":"Find the angle to the `x`-axis, then place it: QI θ, QII 180° − θ, QIII 180° + θ, QIV 360° − θ. CAST tells the signs.",
        "Bearings":"True bearings are three digits, clockwise from north (090° is east). Quadrant bearings name N or S first, then the angle toward E or W.",
        "Magnitude":"`|(a, b)| = √{a^2 + b^2}`."
      }
    }
  },
  explore:{
    heading:"Component converter",
    intro:"Set a vector by length and direction, or drag its tip to a point. Watch both descriptions update, and catch the quadrant traps.",
    modes:[{ id:"polar", t:"Polar → Cartesian" }, { id:"cart", t:"Cartesian → polar" }, { id:"bear", t:"Bearing" }],
    specials:[
      { id:"s1", t:"`(-3, 3√3)`", x:{ p:-3, d:1, k:1 }, y:{ p:3, d:1, k:3 }, r:{ p:6, d:1, k:1 }, deg:120 },
      { id:"s2", t:"`(4√3, -4)`", x:{ p:4, d:1, k:3 }, y:{ p:-4, d:1, k:1 }, r:{ p:8, d:1, k:1 }, deg:330 },
      { id:"s3", t:"`(-5, -5)`", x:{ p:-5, d:1, k:1 }, y:{ p:-5, d:1, k:1 }, r:{ p:5, d:1, k:2 }, deg:225 },
      { id:"s4", t:"`(6, 6√3)`", x:{ p:6, d:1, k:1 }, y:{ p:6, d:1, k:3 }, r:{ p:12, d:1, k:1 }, deg:60 }
    ],
    txt:{
      mode:"Mode", r:"Length `r`", th:"Angle θ", snap:"Special angles only", br:"True bearing", qb:"Quadrant bearing",
      sp:"Special points", spNote:"These points can’t be reached on the integer grid.",
      dragNote:"Drag the tip to any grid point, or focus the tip and use the arrow keys (Shift + arrow: 5 steps).",
      toggles:"Show", legs:"Show components", tri:"Show reference triangle", ij:"Show `vec{i}`, `vec{j}`",
      more:"More", less:"Less",
      key:"`vec{u}` in blue; dashed legs are its components; θ in cerulean from the positive `x`-axis; in Bearing mode the bearing β is in black from north.",
      rows:{ cart:"Cartesian form", mag:"Magnitude", th:"Standard angle θ", ref:"Reference angle", tan:"`tan^{-1}(b/a)` check", br:"True bearing", qb:"Quadrant bearing" },
      quad:["quadrant I", "quadrant II", "quadrant III", "quadrant IV"],
      axis:{ px:"on the positive `x`-axis", nx:"on the negative `x`-axis", py:"on the positive `y`-axis", ny:"on the negative `y`-axis" },
      add:"add 180°"
    },
    predIntro:"Make a prediction first. Then the converter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Polar mode, `r = 6`. θ is about to move to 150°. What signs will the components have?",
        options:[{ t:"(−, +)", ok:true }, { t:"(+, +)" }, { t:"(+, −)" }, { t:"(−, −)" }],
        explain:"The arrow swings into quadrant II and the legs read `(-3√3, 3)`. Quadrant II: left of the `y`-axis and above the `x`-axis." },
      { id:"p2", prompt:"Cartesian mode; the tip jumps to `(-4, -4)`. `tan^{-1}(b/a) = tan^{-1}(1) = 45°`. Where does the vector actually point?",
        options:[{ t:"225°", ok:true }, { t:"45°" }, { t:"135°" }, { t:"315°" }],
        explain:"The arrow lies in quadrant III, so add 180°. `(-4, -4)` and `(4, 4)` have the same ratio, but point opposite ways." },
      { id:"p3", prompt:"Bearing mode; the true bearing is set to 030°. What standard angle is this?",
        options:[{ t:"60°", ok:true }, { t:"30°" }, { t:"120°" }, { t:"300°" }],
        explain:"The arcs measure 30° from north and 60° from east. θ = 90° − 30° = 60°." },
      { id:"p4", prompt:"Two vectors, `vec{u} = (3, 4)` and `vec{v} = (-3, 4)`, each of length 5. What is `|vec{u} + vec{v}|`?",
        options:[{ t:"8", ok:true }, { t:"10" }, { t:"0" }, { t:"6" }],
        explain:"The tip-to-tail sum `(0, 8)` points straight up. Add the components: `(0, 8)`, length 8. 10 adds the lengths, which only works if they point the same way." }
    ],
    chalIntro:"Use the converter, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Polar mode: set `r` and θ so that the vector is `(-5, 5√3)`.",
        why:"`|(-5, 5√3)| = √{25 + 75} = 10`, and the reference angle is `tan^{-1}(√3) = 60°` in quadrant II: θ = 120°.",
        hints:["Find the magnitude first.", "`√{25 + 75} = 10`; reference angle `tan^{-1}(√3) = 60°`.", "Quadrant II: θ = 120°."],
        msgs:{ mode:"Choose Polar → Cartesian mode, then set `r` and θ.",
          q1:"`(5, 5√3)` is in quadrant I. You need a negative `x`.",
          swap:"`(-5√3, 5)`: the components are swapped. " + M1,
          half:"Half as long: `|(-5, 5√3)| = √{25 + 75} = 10`.",
          general:"Not yet: the Cartesian form must read `(-5, 5√3)`. Watch the readout." } },
      { id:"tc2", goal:3, prompt:"Cartesian mode: a ship’s displacement is `6√2` km on a true bearing of 135°. Drag the tip to the right point.",
        why:"θ = 90° − 135° = −45°, so `6√2(cos(-45°), sin(-45°)) = (6, -6)`.",
        hints:["Bearing 135° is halfway between east (090°) and south (180°).", "θ = 90° − 135° = −45°.", "`6√2(cos(-45°), sin(-45°)) = (6, -6)`."],
        msgs:{ mode:"Choose Cartesian → polar mode, then drag the tip to a grid point.",
          ccw:"That’s 135° counterclockwise from east. Bearings start at north and turn clockwise.",
          ne:"That’s bearing 045° (north-east).",
          sw:"That’s bearing 225° (south-west).",
          general:"Not yet: the vector needs length `6√2` on a true bearing of 135°. Watch the readout." } },
      { id:"tc3", goal:[2, 3, 5], stretch:true, prompt:"Cartesian mode: place a vector `vec{w}` with integer components that is parallel to `(6, -8)`, has magnitude 15, and points on a true bearing between 180° and 360°.",
        why:"`(-9, 12) = -3(3, -4)`: parallel to `(6, -8)`, magnitude `5 × 3 = 15`, and `x < 0`, so it points west (bearing ≈ 323°).",
        hints:["Parallel to `(6, -8)` means `k(3, -4)` for some `k`.", "`|k(3, -4)| = 5|k| = 15`, so `k = ±3`.", "Bearings between 180° and 360° point west, so `x < 0`: `k = -3` gives `(-9, 12)`."],
        msgs:{ mode:"Choose Cartesian → polar mode, then drag the tip to a grid point.",
          east:"Parallel with magnitude 15, but it points east of south (bearing ≈ 143°).",
          short:"Parallel and pointing the right way, but its magnitude is 10.",
          notpar:"Magnitude 15, but not parallel: `(-12, 9)` isn’t a multiple of `(3, -4)`.",
          general:"Not yet: check parallel (a multiple of `(3, -4)`), magnitude 15 and a bearing between 180° and 360°." } }
    ]
  },
  part3:{
    slug:"components", name:"Components",
    heading:"Algebra with components",
    intro:"In components, the diagrams of tip-to-tail addition become arithmetic. Work through the three stations; each diagram keeps showing that the arithmetic matches the picture. Then try the quick check.",
    labels:{ check:"Check", fill:"Fill in every box first.", err:"Type exact numbers only, such as 3, −2 or 2√3.",
      dec:"Give exact values, such as 2√3, not decimals.", working:"Check it with algebra" },
    st1:{ title:"Station 1: Add by components",
      text:"Two vectors are given in polar form: `vec{u}` = 4 at 0° and `vec{v}` = 4 at 120°. Convert each one, add, then convert back.",
      rows:{ u:"`vec{u}` = 4 at 0° =", v:"`vec{v}` = 4 at 120° =", s:"`vec{u} + vec{v}` =", m:"`|vec{u} + vec{v}|` =", at:"at θ =" },
      graph:"Diagram: u in blue along the x-axis and v in teal from the tip of u, tip to tail.",
      good:"<strong>✓ Right:</strong> `(4, 0) + (-2, 2√3) = (2, 2√3)`: length `√{4 + 12} = 4`, at 60°. The tip-to-tail picture is an equilateral triangle.",
      eight:"That adds the lengths and averages the angles. Components first.",
      wu:"Check `vec{u}`: `(4 cos 0°, 4 sin 0°)`.",
      wvSwap:M1,
      wvSign:"`cos 120°` is negative: `vec{v}` points left.",
      wv:"Check `vec{v}`: `(4 cos 120°, 4 sin 120°)`.",
      ws:"Add one component at a time: `(4 + (-2), 0 + 2√3)`.",
      wm:"`|(2, 2√3)| = √{4 + 12}`.",
      wa:"`tan(ref) = 2√3/2 = √3`, so the angle is 60°.",
      tri:"equilateral: every side is 4" },
    st2:{ title:"Station 2: `vec{AB}` and equal vectors",
      text:"Tap two grid points: the first tap places A, the next places B. (You can also drag A and B, or focus them and use the arrow keys.) `vec{AB}` = B − A appears as an arrow and in components. Then press <strong>Copy</strong> to slide the arrow to another tail.",
      graph:"Grid with points A and B and the arrow from A to B.",
      copy:"Copy", note:"Equal vectors have equal components, wherever they start.",
      rows:{ a:"A", b:"B", ab:"`vec{AB} = B - A`", copy:"Copy at" } },
    st3:{ title:"Station 3: The parallel test",
      text:"The slider sets `k` in `(k, 6)`. Turn the arrow until it lines up with `(2, -3)`.",
      graph:"Grid with the vector (2, −3) and its dashed line, and the vector (k, 6).",
      k:"`k`",
      rows:{ v:"Vector", r1:"`k/2`", r2:"`6/(-3)`" },
      yes:"✓ The ratios match: `(k, 6)` is parallel to `(2, -3)`.", no:"✗ The ratios differ: not parallel yet.",
      alg:["`(k, 6) = m(2, -3)` gives `6 = -3m`, so `m = -2`.", "Then `k = 2m = -4`.", "Both components scale by the same number, −2."] },
    quickCheck:{
      title:"Quick check", summary:"Algebra with components quick check",
      items:[
        { id:"q1", goal:4, prompt:"`vec{u} = (2, -1)`, `vec{v} = (-3, 4)`. `2vec{u} - vec{v}` = ?",
          choices:[{ t:"`(7, -6)`", ok:true, fb:"Right. `(4, -2) - (-3, 4) = (7, -6)`." }, { t:"`(1, 2)`", fb:"That’s `2vec{u} + vec{v}`." },
            { t:"`(5, -5)`", fb:"Double `vec{u}` first." }, { t:"`(7, 2)`", fb:"Subtract both components: `-2 - 4 = -6`." }] },
        { id:"q2", goal:5, prompt:"`A(-2, 5)`, `B(4, 1)`. `vec{AB}` = ?",
          choices:[{ t:"`(6, -4)`", ok:true, fb:"Right. B − A = `(4 - (-2), 1 - 5)`." }, { t:"`(-6, 4)`", fb:"That’s A − B. " + M5 },
            { t:"`(2, 6)`", fb:"Subtract, don’t add. " + M5 }, { t:"`(6, 4)`", fb:"`1 - 5 = -4`." }] },
        { id:"q3", goal:5, prompt:"Which vector is parallel to `(4, -6)`?",
          choices:[{ t:"`(-6, 9)`", ok:true, fb:"Right. `(-6, 9) = -1.5(4, -6)`. Both components scale by the same number." },
            { t:"`(6, -4)`", fb:"`(-6, 9) = -1.5(4, -6)`. Both components scale by the same number." },
            { t:"`(-4, -6)`", fb:"`(-6, 9) = -1.5(4, -6)`. Both components scale by the same number." },
            { t:"`(2, 3)`", fb:"`(-6, 9) = -1.5(4, -6)`. Both components scale by the same number." }] },
        { id:"q4", goal:[1, 4], prompt:"`vec{u}` is 4 at 0° and `vec{v}` is 4 at 120°. `vec{u} + vec{v}` = ?",
          choices:[{ t:"4 at 60°", ok:true, fb:"Right. `(4, 0) + (-2, 2√3) = (2, 2√3)`: length 4, at 60°." },
            { t:"8 at 60°", fb:"`(4, 0) + (-2, 2√3) = (2, 2√3)`: length 4, at 60°." },
            { t:"8 at 120°", fb:"`(4, 0) + (-2, 2√3) = (2, 2√3)`: length 4, at 60°." },
            { t:"4 at 120°", fb:"`(4, 0) + (-2, 2√3) = (2, 2√3)`: length 4, at 60°." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Same vector, different description", summary:"Same vector, different description", goal:[1, 3],
        instruction:"Match each description with its Cartesian form.",
        leftTitle:"Description", rightTitle:"Cartesian form",
        left:[
          { id:"l1", t:"6 at 30°" },
          { id:"l2", t:"6 at 150°" },
          { id:"l3", t:"8 on a true bearing of 090°" },
          { id:"l4", t:"`4√2` at 225°" },
          { id:"l5", t:"10 on a true bearing of 300° (N 60° W)", hints:["θ = 90° − 300° = −210°, which is 150°.", "`10(cos 150°, sin 150°)`.", "`(-5√3, 5)`."] },
          { id:"l6", t:"2 at 270°" },
          { id:"l7", t:"4 on a quadrant bearing of S 30° E", hints:["S 30° E: start at south, turn 30° toward east.", "True bearing 150°, so θ = 90° − 150° = −60°.", "`4(cos(-60°), sin(-60°)) = (2, -2√3)`."] },
          { id:"l8", t:"12 at 60°" }
        ],
        right:[
          { id:"r1", t:"`(3√3, 3)`" }, { id:"r2", t:"`(-3√3, 3)`" }, { id:"r3", t:"`(8, 0)`" }, { id:"r4", t:"`(-4, -4)`" },
          { id:"r5", t:"`(-5√3, 5)`" }, { id:"r6", t:"`(0, -2)`" }, { id:"r7", t:"`(2, -2√3)`" }, { id:"r8", t:"`(6, 6√3)`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r8":"Check the length: `(6, 6√3)` has magnitude 12.", "l8|r1":"Check the length: `(6, 6√3)` has magnitude 12.",
          "l5|r2":"Same direction (150°), but the magnitudes are 10 and 6.", "l2|r5":"Same direction (150°), but the magnitudes are 10 and 6.",
          "l7|r4":"S 30° E is bearing 150°, which is θ = 300°: right and down, but not at 45°." },
        wrongDefault:"Convert to a standard angle, then use `(r cos θ, r sin θ)`." },
      { id:"work", type:"custom", title:"Components at work", summary:"Components at work", star:true, goal:[2, 4, 5, 6],
        instruction:"Find each answer with components. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact numbers in the boxes: whole numbers, fractions such as 5/13, or roots such as 2√3. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact numbers only, such as 3, −5/13 or 2√3.",
          dec:"Give exact values: whole numbers, fractions or roots, not decimals.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:2, prompt:"`|(-7, 24)|`",
            parts:["`|(-7, 24)|` =", { k:"r" }],
            answer:{ r:25 }, display:"25",
            wrong:[{ v:{ r:17 }, fb:"Square each component; `(-7)^2 = 49`." }],
            why:"`√{49 + 576} = √625 = 25`." },
          { id:"s2", goal:2, prompt:"Magnitude and standard angle of `(-2√3, -2)`",
            parts:["magnitude", { k:"r" }, "at θ =", { k:"th" }, "°"],
            answer:{ r:4, th:210 }, display:"4 at 210°",
            wrong:[{ v:{ r:4, th:30 }, fb:"Both components are negative: quadrant III." }],
            why:"`√{12 + 4} = 4`; the reference angle is 30°, in quadrant III: 180° + 30° = 210°." },
          { id:"s3", goal:5, star:true, prompt:"Find `k` so that `(k, 3)` is parallel to `(8, -6)`.",
            parts:["`k` =", { k:"k" }],
            answer:{ k:-4 }, display:"`k = -4`",
            wrong:[{ v:{ k:4 }, fb:"`3 = m(-6)` gives `m = -1/2`, so `k = -1/2 × 8`." }],
            why:"`(k, 3) = m(8, -6)`: `3 = -6m` gives `m = -1/2`, so `k = -4`." },
          { id:"s4", goal:4, star:true, prompt:"The unit vector in the direction of `(5, -12)`",
            parts:["(", { k:"x" }, ",", { k:"y" }, ")"],
            answer:{ x:5 / 13, y:-12 / 13 }, display:"`(5/13, -12/13)`",
            wrong:[{ v:{ x:5 / 17, y:-12 / 17 }, fb:"Divide by the magnitude, 13." }],
            why:"`|(5, -12)| = √{25 + 144} = 13`; divide each component by 13." },
          { id:"s5", goal:4, star:true, prompt:"Find `s` and `t` with `s(3, 1) + t(-1, 2) = (1, 5)`.",
            parts:["`s` =", { k:"s" }, "`t` =", { k:"t" }],
            answer:{ s:1, t:2 }, display:"`s = 1`, `t = 2`",
            wrong:[{ v:{ s:2, t:1 }, fb:"Check the `x`-part: `3s - t = 1`." }],
            why:"`3s - t = 1` and `s + 2t = 5` give `s = 1`, `t = 2`.",
            hints:["Write one equation per component.", "`3s - t = 1` and `s + 2t = 5`.", "`t = 3s - 1`, so `7s - 2 = 5`: `s = 1`, `t = 2`."] },
          { id:"s6", goal:6, star:true, prompt:"A hiker walks 6 km on a true bearing of 030°, then 6 km on a true bearing of 150°. Find her displacement from the start (magnitude and true bearing).",
            parts:["", { k:"r" }, "km on a true bearing of", { k:"b" }, "°"],
            answer:{ r:6, b:90 }, display:"6 km on a true bearing of 090°",
            wrong:[{ v:{ r:12 }, fb:"Add components, not lengths." }, { v:{ b:180 }, fb:"The northward parts cancel; the eastward parts add." }],
            why:"`(3, 3√3) + (3, -3√3) = (6, 0)`: 6 km due east.",
            hints:["Convert each bearing to a standard angle: 030° → 60°, 150° → −60°.", "Leg 1: `(3, 3√3)`; leg 2: `(3, -3√3)`.", "Sum `(6, 0)`: 6 km due east, a true bearing of 090°."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Lucia", how:"", goal:[2, 3, 4],
        instruction:"Lucia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Write 10 units on a true bearing of 120° in Cartesian form.",
            steps:["The standard angle is θ = 120°.", "`x = 10 cos 120° = -5`", "`y = 10 sin 120° = 5√3`", "So the vector is `(-5, 5√3)`."],
            answer:0,
            stepFb:["", "Step 2 uses step 1’s angle correctly. The mistake is earlier.", "Step 3 follows step 1.", "Step 4 follows."],
            fixes:[
              { t:"θ = 90° − 120° = −30°, so `(10 cos(-30°), 10 sin(-30°)) = (5√3, -5)`.", ok:true, why:"A shortcut for bearings: `x = r sin(bearing)` and `y = r cos(bearing)` give the same answer." },
              { t:"θ = 120° + 90° = 210°, giving `(-5√3, -5)`.", why:"Adding 90° turns the wrong way." },
              { t:"θ = 180° − 120° = 60°, giving `(5, 5√3)`.", why:"That points north-east; 120° is south-east." },
              { t:"Step 1 is correct: bearings are standard angles.", why:"They start at north and turn clockwise. " + M3 }],
            hints:["Where does a bearing of 120° point?", "South of east: θ = 90° − 120°.", "`(5√3, -5)`."] },
          { id:"e2", goal:2, task:"Find the magnitude and standard angle of `vec{u} = (-6, 6)`.",
            steps:["`|vec{u}| = √{(-6)^2 + 6^2} = √72 = 6√2`", "`tan θ = 6/(-6) = -1`", "θ = `tan^{-1}(-1)` = −45°, which is 315°.", "So `vec{u}` is `6√2` at 315°."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"`(-6, 6)` is in quadrant II: θ = 180° − 45° = 135°.", ok:true, why:"`(-6, 6)` points left and up. `tan^{-1}` gave the quadrant IV angle with the same tangent." },
              { t:"θ = 45°.", why:"Quadrant I would need both components positive." },
              { t:"θ = 225°.", why:"That’s quadrant III: both negative." },
              { t:"Step 3 is correct; `tan^{-1}` always gives the angle.", why:"`tan^{-1}` only returns angles between −90° and 90°." }],
            hints:["Which way does `(-6, 6)` point?", "Left and up: quadrant II.", "135°."] },
          { id:"e3", goal:4, task:"`vec{u} = (4, -2)` and `vec{v} = (-1, 3)`. Find `|2vec{u} - 3vec{v}|`.",
            steps:["`2vec{u} = (8, -4)` and `3vec{v} = (-3, 9)`", "`2vec{u} - 3vec{v} = (8 - 3, -4 - 9)`", "`= (5, -13)`", "`|2vec{u} - 3vec{v}| = √{25 + 169} = √194`"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows."],
            fixes:[
              { t:"`8 - (-3) = 11`, so `2vec{u} - 3vec{v} = (11, -13)` and its magnitude is `√290`.", ok:true, why:"Subtracting −3 adds 3: `√{121 + 169} = √290`." },
              { t:"`2vec{u} - 3vec{v} = (8 + 3, -4 + 9) = (11, 5)`.", why:"Subtract both components." },
              { t:"`|2vec{u} - 3vec{v}| = |2vec{u}| - |3vec{v}|`.", why:"Magnitudes don’t subtract." },
              { t:"Step 2 is correct.", why:"Subtracting −3 adds 3." }],
            hints:["What is `8 - (-3)`?", "11.", "`(11, -13)`, `√290`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the converter: the `tan^{-1}` trap, or how bearings and standard angles relate?" },
      { id:"j2", q:"In your own words, why is the `x`-component `r cos θ`?" },
      { id:"j3", q:"Explain to a friend how to find the direction of `(-3, -3√3)`, including the quadrant check." },
      { id:"j4", q:"Which conversion still slows you down? What will you do about it?" }
    ]
  },
  final:{
    intro:"Ten questions: 3 K, 3 T, 2 C, 2 A. No hints; choose your confidence for each. Angles are standard angles (counterclockwise from the positive `x`-axis) unless a bearing is named.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Write 8 units at 60° in Cartesian form.", options:[
          { t:"`(4, 4√3)`", ok:true, why:"`(8 cos 60°, 8 sin 60°)`." },
          { t:"`(4√3, 4)`", why:"The `x`-component uses cosine. " + M1 },
          { t:"`(-4, 4√3)`", why:"`cos 60°` is positive." },
          { t:"`(4, 4)`", why:"`sin 60° = √3/2`, not `1/2`." }] },
        b:{ prompt:"Write 6 units at 210° in Cartesian form.", options:[
          { t:"`(-3√3, -3)`", ok:true, why:"`(6 cos 210°, 6 sin 210°)`: reference angle 30°, both components negative." },
          { t:"`(-3, -3√3)`", why:"The `x`-component uses cosine. " + M1 },
          { t:"`(3√3, 3)`", why:"210° is in quadrant III: both components negative." },
          { t:"`(-3√3, 3)`", why:"`sin 210°` is negative." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"A true bearing of 300° is the same as which standard angle?", options:[
          { t:"150°", ok:true, why:"90° − 300° = −210°, and −210° + 360° = 150°." },
          { t:"300°", why:"Bearings and standard angles start in different places. " + M3 },
          { t:"210°", why:"Subtracting 90° turns the wrong way." },
          { t:"60°", why:"360° − 300° measures from north, counterclockwise." }] },
        b:{ prompt:"Which standard angle matches the quadrant bearing N 20° E?", options:[
          { t:"70°", ok:true, why:"20° east of north is 70° north of east." },
          { t:"20°", why:M3 },
          { t:"110°", why:"That’s N 20° W." },
          { t:"250°", why:"That’s S 20° W." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`P(3, -1)` and `Q(-2, 4)`. What is `vec{PQ}`?", options:[
          { t:"`(-5, 5)`", ok:true, why:"Q − P = `(-2 - 3, 4 - (-1))`." },
          { t:"`(5, -5)`", why:"That’s `vec{QP}`. `vec{PQ}` goes from P to Q: Q − P." },
          { t:"`(1, 3)`", why:"Subtract, don’t add." },
          { t:"`(-5, 3)`", why:"`4 - (-1) = 5`." }] },
        b:{ prompt:"`C(-4, 2)` and `D(1, -5)`. What is `vec{CD}`?", options:[
          { t:"`(5, -7)`", ok:true, why:"D − C = `(1 - (-4), -5 - 2)`." },
          { t:"`(-5, 7)`", why:"That’s `vec{DC}`. `vec{CD}` goes from C to D: D − C." },
          { t:"`(-3, -3)`", why:"Subtract, don’t add." },
          { t:"`(5, -3)`", why:"`-5 - 2 = -7`." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Find the standard angle of `vec{u} = (-2, -2√3)`.", options:[
          { t:"240°", ok:true, why:"Reference angle `tan^{-1}(√3) = 60°`, quadrant III." },
          { t:"60°", why:"Both components are negative." },
          { t:"210°", why:"`tan(ref) = √3`, so the reference angle is 60°, not 30°." },
          { t:"120°", why:"Quadrant II needs a positive `y`." }] },
        b:{ prompt:"Find the standard angle of `vec{v} = (2√3, -2)`.", options:[
          { t:"330°", ok:true, why:"Reference angle 30°, quadrant IV." },
          { t:"30°", why:"`y` is negative: quadrant IV." },
          { t:"300°", why:"`tan(ref) = 1/√3`, so the reference angle is 30°." },
          { t:"150°", why:"Quadrant II needs a negative `x`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`vec{u}` is 6 units at 0° and `vec{v}` is 6 units at 120°. Find `vec{u} - vec{v}`.", options:[
          { t:"`6√3` units at 330°", ok:true, why:"`(6, 0) - (-3, 3√3) = (9, -3√3)`." },
          { t:"`6√3` units at 30°", why:"`y` is negative: quadrant IV." },
          { t:"`6√3` units at 150°", why:"That’s `vec{v} - vec{u}`." },
          { t:"0, since 6 − 6 = 0", why:"Subtract the components, not the lengths." }] },
        b:{ prompt:"`vec{u}` is 4 units at 90° and `vec{v}` is 4 units at 210°. Find `vec{u} - vec{v}`.", options:[
          { t:"`4√3` units at 60°", ok:true, why:"`(0, 4) - (-2√3, -2) = (2√3, 6)`." },
          { t:"`4√3` units at 240°", why:"That’s `vec{v} - vec{u}`." },
          { t:"`4√3` units at 30°", why:"`tan(ref) = 6/(2√3) = √3`, so 60°." },
          { t:"0", why:"Subtract the components, not the lengths." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"For which `k` are `(k, 8)` and `(2, k)` parallel and pointing the <strong>same</strong> way?", options:[
          { t:"`k = 4`", ok:true, why:"`(k, 8) = m(2, k)` gives `k = 2m` and `8 = 2m^2`, so `m = 2` (same way) and `k = 4`." },
          { t:"`k = ±4`", why:"`k = -4` makes them point opposite ways." },
          { t:"`k = 16`", why:"Multiplying 2 × 8 doesn’t test parallel." },
          { t:"`k = -4`", why:"`(-4, 8) = -2(2, -4)`: opposite directions." }] },
        b:{ prompt:"For which `k` are `(k, 9)` and `(4, k)` parallel and pointing <strong>opposite</strong> ways?", options:[
          { t:"`k = -6`", ok:true, why:"`k = 4m`, `9 = 4m^2`, so `m = -3/2` and `k = -6`." },
          { t:"`k = ±6`", why:"`k = 6` points the same way." },
          { t:"`k = 6`", why:"Same direction." },
          { t:"`k = 36`", why:"Multiplying 4 × 9 doesn’t test parallel. " + M7 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the direction of `(-3, 3)` is 135°, not −45°?", options:[
          { t:"“`(-3, 3)` points left and up, into quadrant II. `tan^{-1}(-1)` gives −45°, a quadrant IV angle with the same tangent; adding 180° gives 135°.”", ok:true, why:"The signs of the components place the angle." },
          { t:"“Directions can’t be negative, so add 180°.”", why:"−45° is a fine angle (it’s 315°); the issue is the quadrant." },
          { t:"“−45° and 135° are the same direction.”", why:"They’re opposite." },
          { t:"“Because `tan 135° = 1`.”", why:"`tan 135° = -1`." }] },
        b:{ prompt:"Which is the best explanation of why the direction of `(4, -4)` is 315°, not 135°?", options:[
          { t:"“`(4, -4)` points right and down (quadrant IV). `tan^{-1}(-1) = -45°`, which is 315°. 135° has the same tangent but points left and up.”", ok:true, why:"The signs of the components place the angle." },
          { t:"“Add 180° whenever the tangent is negative.”", why:"That rule would give 135°, the wrong quadrant." },
          { t:"“135° and 315° are the same direction.”", why:"They’re opposite." },
          { t:"“Because `cos 315°` is negative.”", why:"`cos 315° = √2/2 > 0`." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which correctly describes the direction of `(-4, -4)` in all three ways?", options:[
          { t:"225° from the positive `x`-axis, a true bearing of 225°, or S 45° W", ok:true, why:"Both components are negative: south-west, 45° from south toward west." },
          { t:"225° from the positive `x`-axis, a true bearing of 135°, or S 45° E", why:"Bearing 135° is south-east." },
          { t:"45° from the positive `x`-axis, a true bearing of 045°, or N 45° E", why:"Both components are negative: `tan^{-1}(1) = 45°` points the opposite way." },
          { t:"135° from the positive `x`-axis, a true bearing of 315°, or N 45° W", why:"Both components are negative: south-west." }] },
        b:{ prompt:"Which correctly describes the direction of `(0, -5)` in all three ways?", options:[
          { t:"270° from the positive `x`-axis, a true bearing of 180°, or due south", ok:true, why:"Straight down: south." },
          { t:"270° from the positive `x`-axis, a true bearing of 270°, or due west", why:M3 },
          { t:"90° from the positive `x`-axis, a true bearing of 000°, or due north", why:"`y` is negative." },
          { t:"180° from the positive `x`-axis, a true bearing of 270°, or due west", why:"That’s `(-5, 0)`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A drone flies 8 km on a true bearing of 060°, then 8 km on a true bearing of 300°. Where does it end, relative to its start?", options:[
          { t:"8 km due north", ok:true, why:"`(4√3, 4) + (-4√3, 4) = (0, 8)`." },
          { t:"16 km due north", why:"Lengths add only for parallel legs." },
          { t:"8 km due east", why:"That treats the bearings as standard angles." },
          { t:"Back at the start", why:"The east–west parts cancel, but the north parts add." }] },
        b:{ prompt:"A drone flies 6 km on a true bearing of 120°, then 6 km on a true bearing of 240°. Where does it end, relative to its start?", options:[
          { t:"6 km due south", ok:true, why:"`(3√3, -3) + (-3√3, -3) = (0, -6)`." },
          { t:"12 km due south", why:"Lengths add only for parallel legs." },
          { t:"6 km due west", why:"That treats the bearings as standard angles." },
          { t:"Back at the start", why:"The east–west parts cancel, but the south parts add." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A robot starts at `A(1, 2)` on a floor grid (metres). It moves by `vec{u} = (3, -1)` three times, then by `vec{v} = (-2, 4)` twice. Where does it end, and how far is it from A?", options:[
          { t:"At `(6, 7)`, `5√2` m from A", ok:true, why:"A + `3vec{u} + 2vec{v}` = `(1, 2) + (9, -3) + (-4, 8)`." },
          { t:"At `(5, 5)`, `5√2` m from A", why:"`(5, 5)` is the displacement; add A for the position." },
          { t:"At `(6, 7)`, 10 m from A", why:"`√{5^2 + 5^2}`, not 5 + 5." },
          { t:"At `(1, 12)`, 10 m from A", why:"That uses `vec{u}` twice and `vec{v}` three times." }] },
        b:{ prompt:"A robot starts at `A(-2, 3)` on a floor grid (metres). It moves by `vec{u} = (2, 1)` four times, then by `vec{v} = (-1, -3)` twice. Where does it end, and how far is it from A?", options:[
          { t:"At `(4, 1)`, `2√10` m from A", ok:true, why:"`4vec{u} + 2vec{v} = (6, -2)`." },
          { t:"At `(6, -2)`, `2√10` m from A", why:"That’s the displacement." },
          { t:"At `(4, 1)`, 8 m from A", why:"`√{6^2 + 2^2}`, not 6 + 2." },
          { t:"At `(-2, -7)`, 10 m from A", why:"The counts are swapped." }] } }
    ]
  },
  task:{
    title:"First leg west", summary:"First leg west",
    statement:"<p>A hiker’s route has two legs: first `vec{u}`, then 6 km due east. Design the first leg. Find every answer.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The first leg is exactly 10 km long.</li><li>The first leg heads west of the north–south line (a true bearing strictly between 180° and 360°).</li><li>At the end of the route, the hiker is a whole number of kilometres from her start.</li></ol></div>" +
      "<p class=\"tiny muted\">Drag the tip of `vec{u}` (whole-number components from −12 to 12; 1 unit = 1 km) or type its components. The second leg `(6, 0)` is drawn from the tip of `vec{u}`.</p>",
    checks:["First leg 10 km", "Heads west", "Ends a whole number of km away"],
    tips:["Whole-number vectors of length 10: think of 6-8-10 and 10-0-10.",
      "A bearing between 180° and 360° means the `x`-component is negative.",
      "Add `(6, 0)` to `vec{u}` and check the length of the total."],
    explainPrompt:"For one of your answers, give the first leg’s true bearing or quadrant bearing (approximately is fine) and explain why the hiker ends where she does.",
    vocab:"Use the words component, magnitude and bearing.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"The other westward length-10 legs, `(-8, 6)` and `(-8, -6)`, end `√40` km away: not a whole number.",
    labels:{ a:"`a` (east)", b:"`b` (north)", range:"(−12 to 12)", inNote:"Type the components of `vec{u} = (a, b)`, or drag its tip on the board.",
      invalid:"Choose whole numbers from −12 to 12 for `a` and `b`, not both 0.",
      u:"`vec{u}`", mag:"`|vec{u}|`", br:"True bearing of `vec{u}`", tot:"Total displacement", dist:"Distance from start",
      graph:"Board: the first leg u in blue, the second leg (6, 0) in teal from its tip, and the total displacement in black." }
  },
  cards:[
    ["Cartesian form", "`vec{u} = (a, b) = a vec{i} + b vec{j}`."],
    ["`vec{i}`, `vec{j}`", "`vec{i} = (1, 0)`, `vec{j} = (0, 1)`: unit vectors along the axes."],
    ["Polar to Cartesian", "`(r cos θ, r sin θ)`, θ counterclockwise from the positive `x`-axis."],
    ["Magnitude", "`|(a, b)| = √{a^2 + b^2}`."],
    ["Direction from components", "Reference angle `tan^{-1}(|b|/|a|)`, then place it in the quadrant of `(a, b)`."],
    ["The `tan^{-1}` trap", "`tan^{-1}` gives only −90° to 90°; add 180° when `a < 0`."],
    ["Bearing → standard angle", "θ = 90° − bearing (add 360° if negative)."],
    ["Quadrant bearing", "S 30° E: 30° from south toward east (true bearing 150°)."],
    ["Adding vectors", "Add components: `(a, b) + (c, d) = (a + c, b + d)`."],
    ["`vec{AB}`", "`(x_B - x_A, y_B - y_A)`."],
    ["Parallel test", "`vec{v} = k vec{u}`: both components scale by the same `k`."],
    ["Unit vector", "`vec{u}/|vec{u}|`, e.g. `(3, 4)` → `(3/5, 4/5)`."]
  ]
};
