// MCV4U 34 Adding and Subtracting Vectors. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/34-adding-and-subtracting-vectors.md
// Vector names use `vec{u}` (toolkit over-arrow); bearings and compass directions stay outside math.
const M1 = "Magnitudes add only when the vectors point the same way. Otherwise the triangle’s third side is shorter.";
const M2 = "Tip to tail, the angle inside the triangle is `180° - θ`. Using `θ` gives `|vec{u} - vec{v}|` instead.";
const M3 = "Joining the tips gives a difference. The sum is the parallelogram’s other diagonal, from the shared tail.";
const M4 = "`vec{u} - vec{v}` is what you add to `vec{v}` to get `vec{u}`: from the tip of `vec{v}` to the tip of `vec{u}`.";
const M5 = "`vec{v} - vec{u} = -(vec{u} - vec{v})`: same length, opposite direction.";
const M6 = "Back where you started means no displacement: the sum is `vec{0}`.";
const M7 = "Convert the triangle’s angle into a bearing; to go back, add 180°.";
const ABCD = "<canvas class=\"plot wide vs-abcd\" data-fig=\"abcd\" role=\"img\" aria-label=\"Parallelogram ABCD. A is at the bottom left. The arrow from A to B along the bottom is u; the arrow from A to D up the left side is v. C is the corner opposite A.\"></canvas>";

export default {
  id:"34-adding-and-subtracting-vectors",
  kind:"topic",
  title:"Adding and subtracting vectors",
  topic:"Adding and Subtracting Vectors",
  readyTopic:"adding and subtracting vectors",
  hero:{
    eq:"`|vec{u} + vec{v}| <= |vec{u}| + |vec{v}|`",
    eqLabel:"The magnitude of u plus v is less than or equal to the magnitude of u plus the magnitude of v.",
    eqSize:"md",
    headline:"Tip to tail, then the shortcut",
    text:"Walking one vector and then another gets you to the same place as walking the single <strong>resultant</strong> from the start to the finish. Place vectors <strong>tip to tail</strong> to add them, or tails together and take the <strong>parallelogram’s diagonal</strong>. To subtract, add the <strong>opposite</strong>. The resultant’s length comes from the <strong>cosine law</strong>, not from adding lengths.",
    fig:{ aria:"A walker goes 3 units east along u, then 4 units north along v. A thick arrow from the start to the finish is the resultant u + v, labelled 5, not 7. Ghost copies of u and v complete a parallelogram, and the same arrow is its diagonal from the shared tail.", shape:"square" }
  },
  goals:[
    "I can add vectors with the triangle (tip-to-tail) and parallelogram methods.",
    "I can subtract vectors as `vec{u} + (-vec{v})` and as the diagonal from the tip of `vec{v}` to the tip of `vec{u}`.",
    "I can find the magnitude of a sum or difference with the cosine law, using the correct angle.",
    "I can find the direction of a resultant with the sine law or a special triangle, and state it as a bearing.",
    "I can add several vectors tip to tail and recognize when the resultant is `vec{0}`.",
    "I can solve displacement problems by adding vectors."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Cosine law", goal:3, prompt:"A triangle has sides 3 and 5 with a 120° angle between them. How long is the third side?",
          options:[
            { t:"7", ok:true, why:"`c^2 = 9 + 25 - 2(3)(5) cos 120° = 34 + 15 = 49`." },
            { t:"`√19`", why:"cos 120° = −1/2." },
            { t:"8", why:"That’s only when the angle is 180°." },
            { t:"49", why:"49 is `c^2`." }],
          hints:["`c^2 = a^2 + b^2 - 2ab cos C`.", "cos 120° = −1/2, so −2(15)(−1/2) = +15.", "`c = 7`."] },
        { id:"w2", skill:"Cosine law", goal:3, prompt:"cos 120° = ?",
          options:[
            { t:"`-{1}/{2}`", ok:true, why:"120° is in quadrant 2, reference angle 60°." },
            { t:"`{1}/{2}`", why:"Cosine is negative in quadrant 2." },
            { t:"`-{√3}/{2}`", why:"cos 60° = 1/2." },
            { t:"`{√3}/{2}`", why:"That’s sin 120°." }],
          hints:["Reference angle?", "60°; cosine is negative in quadrant 2.", "−1/2."] },
        { id:"w3", skill:"Sine law and special angles", goal:4, prompt:"sin 150° = ?",
          options:[
            { t:"`{1}/{2}`", ok:true, why:"Reference angle 30°; sine is positive in quadrant 2." },
            { t:"`-{1}/{2}`", why:"Sine is positive in quadrant 2." },
            { t:"`{√3}/{2}`", why:"The reference angle is 30°." },
            { t:"`-{√3}/{2}`", why:"Both the value and the sign are off." }],
          hints:["Reference angle?", "180° − 150° = 30°.", "sin 30° = 1/2, positive."] },
        { id:"w4", skill:"Sine law and special angles", goal:4, prompt:"In a triangle, the angle opposite a side of length 4 is 30°, and another side is `4√3`. What could the angle opposite `4√3` be? (Choose the acute case.)",
          options:[
            { t:"60°", ok:true, why:"`sin B = {4√3 · sin 30°}/{4} = {√3}/{2}`." },
            { t:"30°", why:"The sides 4 and `4√3` aren’t equal." },
            { t:"45°", why:"`sin 45° = {√2}/{2}`." },
            { t:"90°", why:"`sin B` would be 1." }],
          hints:["`{sin B}/{b} = {sin A}/{a}`.", "`sin B = 4√3 × {1}/{2} ÷ 4`.", "`{√3}/{2}`, so 60° (or 120°)."] },
        { id:"w5", skill:"Vector basics", goal:2, prompt:"`vec{u}` has run 3 and rise −2. What are the run and rise of `-vec{u}`?",
          options:[
            { t:"−3 and 2", ok:true, why:"Both signs flip." },
            { t:"3 and 2", why:"That’s a reflection, not the opposite." },
            { t:"−2 and 3", why:"Swapping turns the arrow." },
            { t:"−3 and −2", why:"Flip both." }],
          hints:["Opposite: same length, reversed.", "Every component changes sign.", "(−3, 2)."] },
        { id:"w6", skill:"Vector basics", goal:6, prompt:"What is the angle between the directions with true bearings 030° and 120°?",
          options:[
            { t:"90°", ok:true, why:"120° − 30°." },
            { t:"150°", why:"Subtract the bearings." },
            { t:"60°", why:"That’s 90° − 30°." },
            { t:"210°", why:"Take the smaller angle, at most 180°." }],
          hints:["Both are measured from north.", "Subtract.", "90°."] }
      ],
      refreshers:{
        "Cosine law":"`c^2 = a^2 + b^2 - 2ab cos C`, where `C` is the angle between sides `a` and `b`. If `C` is obtuse, cos `C` < 0, so the third side gets longer.",
        "Sine law and special angles":"`{sin A}/{a} = {sin B}/{b}`. Special values: sin 30° = sin 150° = 1/2, sin 60° = sin 120° = `{√3}/{2}`, cos 120° = −1/2.",
        "Vector basics":"`-vec{u}` flips both run and rise. The angle between two bearings is their difference (take the smaller one)."
      }
    }
  },
  explore:{
    heading:"Tip-to-tail table",
    intro:"Drag the tips of the vectors. Switch between the triangle and parallelogram views of a sum, and the two views of a difference. Then chain three vectors.",
    predictions:[
      { id:"p1", prompt:"Grid: `vec{u}` = run 3, rise 0; `vec{v}` = run 0, rise 4. What is `|vec{u} + vec{v}|`?",
        options:[{ t:"5", ok:true }, { t:"7" }, { t:"1" }, { t:"12" }],
        explain:"A 3-4-5 right triangle. 7 is the length of the path, not of the resultant." },
      { id:"p2", prompt:"Add mode, Parallelogram view, tails together. Where does `vec{u} + vec{v}` end?",
        options:[{ t:"at the far corner of the parallelogram", ok:true }, { t:"at the tip of `vec{v}`" }, { t:"halfway between the tips" }, { t:"at the tip of `vec{u}`" }],
        explain:"Sliding `vec{v}` to `vec{u}`’s tip lands on the far corner: the parallelogram is two tip-to-tail triangles." },
      { id:"p3", prompt:"Subtract mode, Tails together. Which arrow is `vec{u} - vec{v}`?",
        options:[{ t:"from the tip of `vec{v}` to the tip of `vec{u}`", ok:true }, { t:"from the tip of `vec{u}` to the tip of `vec{v}`" }, { t:"from the origin to the far corner" }, { t:"from the origin to the tip of `vec{u}`" }],
        explain:"`vec{v} + (vec{u} - vec{v}) = vec{u}`: start at `vec{v}`’s tip and finish at `vec{u}`’s." },
      { id:"p4", prompt:"Polar: `|vec{u}| = 3`, `|vec{v}| = 5`, `θ = 0°`. As `θ` grows from 0° to 180°, what happens to `|vec{u} + vec{v}|`?",
        options:[{ t:"it shrinks from 8 to 2", ok:true }, { t:"it grows from 2 to 8" }, { t:"it stays 8" }, { t:"it shrinks to 0" }],
        explain:"Pointing together, lengths add; pointing apart, they partly cancel." }
    ],
    chalIntro:"Use the table, then press <strong>Check challenge</strong>. The <strong>Set up</strong> buttons under the table put it in the right mode for each challenge. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Add mode, Triangle view, Grid input: `vec{u}` is fixed at run 2, rise 5. Set `vec{v}` so that `vec{u} + vec{v}` lands on the target point (6, 2).",
        why:"From `vec{u}`’s tip (2, 5), go across 4 and down 3: `vec{v}` = run 4, rise −3.",
        hints:["From `vec{u}`’s tip (2, 5), how do you get to (6, 2)?", "Across 4, down 3.", "`vec{v}` = run 4, rise −3."] },
      { id:"tc2", goal:3, prompt:"Add mode, Polar input: `|vec{u}| = 5` and `|vec{v}| = 8`. Set the angle between them so that `|vec{u} + vec{v}| = 7`.",
        why:"Inside the triangle the angle is 60°, so `7^2 = 25 + 64 - 80 cos 60°`. The angle between is 180° − 60° = 120°.",
        hints:["Cosine law in the triangle: `7^2 = 5^2 + 8^2 - 2(5)(8) cos(angle in the triangle)`.", "`49 = 89 - 80 cos T`, so `cos T = {1}/{2}` and `T = 60°`.", "The angle between is 180° − 60° = 120°."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Chain mode, Polar input: set three vectors, each of magnitude 4, so that they add to `vec{0}`.",
        why:"Tip to tail they make an equilateral triangle: each arrow turns 120° from the last.",
        hints:["Tip to tail, the three arrows must close up into a triangle.", "Three equal sides: an equilateral triangle, with 60° inside each corner.", "Each arrow turns 180° − 60° = 120° from the last: directions 0°, 120°, 240°."] }
    ]
  },
  part3:{
    slug:"triangle", name:"By hand",
    heading:"Resultants by hand",
    intro:"Real problems come without a grid. When the angles are special, the cosine and sine laws find a resultant without a calculator. Station 1 shows which angle goes in the cosine law; station 2 walks a two-leg trip from start to bearing. Then try the quick check.",
    quickCheck:{
      title:"Quick check", summary:"Resultants by hand quick check",
      items:[
        { id:"q1", goal:3, prompt:"The angle between `vec{u}` and `vec{v}` is 50°. What angle is inside the tip-to-tail triangle?",
          choices:[
            { t:"130°", ok:true, fb:"Right. Inside the triangle the angle is 180° − 50° = 130°." },
            { t:"50°", fb:M2 },
            { t:"40°", fb:M2 },
            { t:"310°", fb:M2 }] },
        { id:"q2", goal:3, prompt:"`|vec{u}| = |vec{v}| = 5`, perpendicular. `|vec{u} + vec{v}|`?",
          choices:[
            { t:"`5√2`", ok:true, fb:"Right. Legs 5 and 5: `√{25 + 25} = 5√2`." },
            { t:"10", fb:"Legs 5 and 5." },
            { t:"5", fb:"Legs 5 and 5." },
            { t:"0", fb:"Legs 5 and 5." }] },
        { id:"q3", goal:3, prompt:"`|vec{u}| = 2`, `|vec{v}| = 2`, `θ = 120°`. `|vec{u} + vec{v}|`?",
          choices:[
            { t:"2", ok:true, fb:"Right. 4 + 4 + 8 cos 120° = 4, so the length is 2." },
            { t:"`2√3`", fb:"4 + 4 + 8 cos 120° = 4." },
            { t:"4", fb:"4 + 4 + 8 cos 120° = 4." },
            { t:"0", fb:"4 + 4 + 8 cos 120° = 4." }] },
        { id:"q4", goal:4, prompt:"A resultant points at N 60° E. Bearing for the return trip?",
          choices:[
            { t:"240°", ok:true, fb:"Right. N 60° E is 060°; 060° + 180° = 240°." },
            { t:"060°", fb:"060° + 180°. " + M7 },
            { t:"120°", fb:"060° + 180°. " + M7 },
            { t:"300°", fb:"060° + 180°. " + M7 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"arrows", type:"match", title:"Name the arrows", summary:"Name the arrows", goal:[1, 2],
        instruction:"A parallelogram ABCD has `vec{AB} = vec{u}` and `vec{AD} = vec{v}`. Match each arrow with the expression it equals." + ABCD,
        leftTitle:"Arrow", rightTitle:"Expression",
        left:[
          { id:"l1", goal:1, t:"`vec{AC}`", why:"A → B → C is `vec{u} + vec{v}`." },
          { id:"l2", goal:2, t:"`vec{DB}`", why:"D → A → B is `-vec{v} + vec{u} = vec{u} - vec{v}`.",
            hints:["Go from D to B along the sides.", "D → A is `-vec{v}`, then A → B is `vec{u}`.", "`vec{DB} = -vec{v} + vec{u} = vec{u} - vec{v}`."] },
          { id:"l3", goal:2, t:"`vec{BD}`", why:"B → A → D is `-vec{u} + vec{v} = vec{v} - vec{u}`." },
          { id:"l4", goal:1, t:"`vec{CA}`", why:"C → B → A is `-vec{v} - vec{u}`.",
            hints:["From C to A along the sides.", "C → B is `-vec{v}`, B → A is `-vec{u}`.", "`-vec{u} - vec{v}`."] },
          { id:"l5", goal:1, t:"`vec{DC}`", why:"`vec{DC}` is the side opposite `vec{AB}`, pointing the same way." },
          { id:"l6", goal:2, t:"`vec{CB}`", why:"`vec{CB}` is opposite in direction to `vec{AD}`." },
          { id:"l7", goal:1, t:"`vec{BC}`", why:"`vec{BC}` is the side opposite `vec{AD}`, pointing the same way." },
          { id:"l8", goal:2, t:"`vec{CD}`", why:"`vec{CD}` points opposite to `vec{AB}`." }
        ],
        right:[
          { id:"r1", t:"`vec{u} + vec{v}`" }, { id:"r2", t:"`vec{u} - vec{v}`" }, { id:"r3", t:"`vec{v} - vec{u}`" }, { id:"r4", t:"`-vec{u} - vec{v}`" },
          { id:"r5", t:"`vec{u}`" }, { id:"r6", t:"`-vec{v}`" }, { id:"r7", t:"`vec{v}`" }, { id:"r8", t:"`-vec{u}`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r3":"`vec{DB}` goes from D (tip of `vec{v}`) to B (tip of `vec{u}`): `vec{u} - vec{v}`.",
          "l3|r2":"`vec{BD}` goes from B (tip of `vec{u}`) to D (tip of `vec{v}`). " + M5,
          "l5|r8":"`vec{DC}` points the same way as `vec{AB}`.",
          "l8|r5":"`vec{CD}` points the opposite way to `vec{AB}`.",
          "l1|r2":"From the shared tail to the far corner is the sum.",
          "l2|r1":"From the shared tail to the far corner is the sum; `vec{DB}` joins the tips. " + M3
        },
        wrongDefault:"Trace a tip-to-tail path from the arrow’s start to its end using `vec{u}` and `vec{v}`." },
      { id:"resultants", type:"custom", title:"Resultants", summary:"Resultants", goal:[3, 4, 5, 6],
        instruction:"Find each answer exactly. Use the cosine law with the angle inside the triangle.",
        how:"Type the number in front of the root and the number under it: 5√2 is 5 and 2. For a whole number, leave the √ box empty; for √19, leave the front box empty.",
        items:[
          { id:"r1", goal:3, ask:"`|vec{u}| = 6`, `|vec{v}| = 8`, perpendicular. `|vec{u} + vec{v}|`?", lead:"`|vec{u} + vec{v}| =`", answer:"10",
            why:"`√{36 + 64} = √100 = 10`.", wrong:[{ v:"14", fb:M1 }] },
          { id:"r2", goal:3, ask:"`|vec{u}| = 3`, `|vec{v}| = 5`, angle between 60°. `|vec{u} + vec{v}|`?", lead:"`|vec{u} + vec{v}| =`", answer:"7",
            why:"Inside the triangle the angle is 120°: `9 + 25 + 15 = 49`.", wrong:[{ v:"√19", fb:"Inside the triangle the angle is 120°. " + M2 }] },
          { id:"r3", goal:3, star:true, ask:"Same vectors as the last one (`|vec{u}| = 3`, `|vec{v}| = 5`, angle between 60°). `|vec{u} - vec{v}|`?", lead:"`|vec{u} - vec{v}| =`", answer:"√19",
            why:"With tails together, `vec{u} - vec{v}` closes a triangle whose angle is 60°: `9 + 25 - 15 = 19`.", wrong:[{ v:"7", fb:"That’s the sum. For the difference, the angle inside is `θ` itself." }] },
          { id:"r4", goal:6, star:true, ask:"A drone flies 8 km at bearing 090°, then 7 km at bearing 030°. How far is it from the start?", lead:"Distance =", unit:"km", answer:"13",
            why:"The turn is 60°, so the triangle’s angle is 120°: `64 + 49 + 56 = 169`.",
            wrong:[{ v:"15", fb:M1 }, { v:"√57", fb:"The turn is 60°, so the triangle’s angle is 120°. " + M2 }],
            hints:["Angle between the legs’ directions: 90° − 30° = 60°.", "Inside the triangle: 120°.", "64 + 49 + 56 = 169: 13 km."] },
          { id:"r5", goal:5, star:true, deg:true, ask:"`|vec{u}| = |vec{v}| = 6` and `|vec{u} + vec{v}| = 6`. Find the angle between `vec{u}` and `vec{v}` (degrees).", lead:"Angle between =", answer:"120",
            why:"Tip to tail the triangle is equilateral, 60° inside; the angle between is 180° − 60° = 120°.",
            wrong:[{ v:"60", fb:"60° is the angle inside the equilateral triangle; the angle between is 180° − 60°. " + M2 }],
            hints:["Tip to tail, the three lengths are 6, 6, 6.", "An equilateral triangle: 60° inside.", "Angle between = 180° − 60° = 120°."] },
          { id:"r6", goal:3, star:true, ask:"`|vec{u}| = 2`, `|vec{v}| = 3` and `|vec{u} + vec{v}| = √19`. Find `|vec{u} - vec{v}|`.", lead:"`|vec{u} - vec{v}| =`", answer:"√7",
            why:"`19 = 4 + 9 + 12 cos θ` gives `cos θ = {1}/{2}`; then `|vec{u} - vec{v}|^2 = 4 + 9 - 6 = 7`.",
            wrong:[{ v:"√19", fb:"The difference is the other diagonal." }, { v:"1", fb:"Not |3 − 2|: that’s only when they’re parallel." }],
            hints:["Find cos `θ` from the sum first.", "`19 = 4 + 9 + 12 cos θ`, so `cos θ = {1}/{2}`.", "`|vec{u} - vec{v}|^2 = 4 + 9 - 12({1}/{2}) = 7`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Hassan", how:"", goal:[3, 2, 6],
        instruction:"Hassan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"`|vec{u}| = 5`, `|vec{v}| = 8`, and the angle between them is 60°. Find `|vec{u} + vec{v}|`.",
            steps:["Place `vec{v}` at the tip of `vec{u}`.", "The angle inside the triangle is 60°.", "`|vec{u} + vec{v}|^2 = 25 + 64 - 80 cos 60° = 49`.", "`|vec{u} + vec{v}| = 7`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is the cosine law with step 2’s angle.", "Step 4 follows step 3."],
            fixes:[
              { t:"The angle inside is 180° − 60° = 120°: 25 + 64 + 40 = 129, so `|vec{u} + vec{v}| = √129`.", ok:true, why:"Tip to tail, the straight line through `vec{u}` makes 180°, so the angle at the joint is 120°." },
              { t:"The angle inside is 30°.", why:"Not 90° − 60°. " + M2 },
              { t:"Use 5 + 8 = 13.", why:M1 },
              { t:"Step 2 is correct.", why:"7 is `|vec{u} - vec{v}|`, not the sum. " + M2 }],
            hints:["Draw `vec{u}` and slide `vec{v}` to its tip. What’s the angle at the joint?", "The straight line through `vec{u}` makes 180°.", "180° − 60° = 120°."] },
          { id:"e2", goal:2, task:"On a grid, `vec{u}` = run 4, rise 1 and `vec{v}` = run 1, rise 3, tails at the origin. Find `vec{u} - vec{v}`.",
            steps:["Draw both from the origin: tips at (4, 1) and (1, 3).", "`vec{u} - vec{v}` goes from the tip of `vec{u}`, (4, 1), to the tip of `vec{v}`, (1, 3).", "So `vec{u} - vec{v}` has run −3 and rise 2.", "`|vec{u} - vec{v}| = √13`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 reads step 2’s arrow correctly.", "The magnitude is the same either way."],
            fixes:[
              { t:"`vec{u} - vec{v}` goes from the tip of `vec{v}` to the tip of `vec{u}`: run 3, rise −2.", ok:true, why:"Check: `vec{v}` + (run 3, rise −2) = (4, 1), which is `vec{u}`." },
              { t:"It’s the diagonal from the origin to (5, 4).", why:M3 },
              { t:"It goes from the origin to (4, 1).", why:"That’s just `vec{u}`." },
              { t:"Step 2 is correct.", why:"Check: `vec{v}` + (run −3, rise 2) = (−2, 5), not `vec{u}`. " + M4 }],
            hints:["`vec{v} + (vec{u} - vec{v})` must equal `vec{u}`.", "Start at `vec{v}`’s tip, end at `vec{u}`’s tip.", "Run 3, rise −2."] },
          { id:"e3", goal:6, task:"Walk 6 km north, then 6 km east. Give the displacement as a magnitude and a true bearing.",
            steps:["Tip to tail, the legs meet at a right angle.", "`|vec{d}| = √{36 + 36} = 6√2` km.", "The legs are equal, so the resultant is 45° from north.", "So the direction is S 45° E.", "As a bearing: 135°."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct (not 12 km).", "Step 3 is correct.", "", "Step 5 converts step 4 correctly."],
            fixes:[
              { t:"North then east ends up north-east: N 45° E, bearing 045°.", ok:true, why:"The finish is north and east of the start." },
              { t:"S 45° W, bearing 225°.", why:"That’s the way back." },
              { t:"N 45° W, bearing 315°.", why:"The second leg went east." },
              { t:"Step 4 is correct.", why:"S 45° E points away from both legs. " + M7 }],
            hints:["Which quadrant is the finish in?", "North and east of the start.", "N 45° E = 045°."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the tip-to-tail table: how much shorter the resultant can be, or the direction of `vec{u} - vec{v}`?" },
      { id:"j2", q:"In your own words, why is the angle in the cosine law 180° − `θ` when you add?" },
      { id:"j3", q:"Explain to a friend how to find `vec{u} - vec{v}` on a diagram with both tails together." },
      { id:"j4", q:"What’s still shaky: the angle, the direction or the subtraction? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`vec{v}` is drawn with its tail at the tip of `vec{u}`. Which arrow is `vec{u} + vec{v}`?", options:[
          { t:"From the tail of `vec{u}` to the tip of `vec{v}`", ok:true, why:"Tip to tail, the sum runs from the first tail to the last tip." },
          { t:"From the tip of `vec{u}` to the tip of `vec{v}`", why:"That’s just `vec{v}`." },
          { t:"From the tail of `vec{v}` to the tail of `vec{u}`", why:"That’s `-vec{u}`." },
          { t:"From the tip of `vec{v}` to the tail of `vec{u}`", why:"That points backward: `-(vec{u} + vec{v})`." }] },
        b:{ prompt:"`vec{u}` and `vec{v}` are drawn with their tails together at O. Which arrow is `vec{u} + vec{v}`?", options:[
          { t:"The diagonal of their parallelogram from O to the opposite corner", ok:true, why:"Sliding `vec{v}` to `vec{u}`’s tip lands on the far corner." },
          { t:"The segment joining the two tips", why:M3 },
          { t:"The side opposite `vec{u}`", why:"That’s a copy of `vec{u}`." },
          { t:"The arrow from the tip of `vec{u}` to O", why:"That’s `-vec{u}`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`vec{u}` and `vec{v}` have their tails together. Which arrow is `vec{u} - vec{v}`?", options:[
          { t:"From the tip of `vec{v}` to the tip of `vec{u}`", ok:true, why:M4 },
          { t:"From the tip of `vec{u}` to the tip of `vec{v}`", why:"That’s `vec{v} - vec{u}`. " + M4 },
          { t:"The long diagonal from the shared tail", why:"That’s the sum. " + M3 },
          { t:"From the shared tail to the tip of `vec{u}`", why:"That’s `vec{u}`." }] },
        b:{ prompt:"Which expression is equal to `vec{u} - vec{v}`?", options:[
          { t:"`vec{u} + (-vec{v})`", ok:true, why:"To subtract, add the opposite." },
          { t:"`vec{v} - vec{u}`", why:M5 },
          { t:"`-vec{u} + vec{v}`", why:"That’s `vec{v} - vec{u}`. " + M5 },
          { t:"`-(vec{u} + vec{v})`", why:"That’s `-vec{u} - vec{v}`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`|vec{u}| = 3`, `|vec{v}| = 8`, and the angle between them is 120°. What is `|vec{u} + vec{v}|`?", options:[
          { t:"5", why:"That’s only if they point opposite ways." },
          { t:"7", ok:true, why:"Inside the triangle: 60°. 9 + 64 − 48(1/2) = 49." },
          { t:"`√97`", why:M2 },
          { t:"11", why:M1 }] },
        b:{ prompt:"`|vec{u}| = 7`, `|vec{v}| = 8`, and the angle between them is 60°. What is `|vec{u} + vec{v}|`?", options:[
          { t:"1", why:"That’s only if they point opposite ways." },
          { t:"`√57`", why:M2 },
          { t:"13", ok:true, why:"Inside: 120°. 49 + 64 + 56 = 169." },
          { t:"15", why:M1 }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"`|vec{u}| = 5`, `|vec{v}| = 3`, and the angle between them is 60°. What is `|vec{u} - vec{v}|`?", options:[
          { t:"2", why:"Not 5 − 3: that’s only when they point the same way." },
          { t:"`√19`", ok:true, why:"With tails together, `vec{u} - vec{v}` closes a triangle whose angle is `θ`: 25 + 9 − 30(1/2) = 19." },
          { t:"7", why:"That’s `|vec{u} + vec{v}|`. " + M2 },
          { t:"8", why:M1 }] },
        b:{ prompt:"`|vec{u}| = 8`, `|vec{v}| = 5`, and the angle between them is 120°. What is `|vec{u} - vec{v}|`?", options:[
          { t:"3", why:"Not 8 − 5: that’s only when they point the same way." },
          { t:"7", why:"That’s `|vec{u} + vec{v}|`. " + M2 },
          { t:"`√129`", ok:true, why:"64 + 25 − 80(−1/2) = 129." },
          { t:"13", why:M1 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`vec{u}` has magnitude 6 at bearing 000°; `vec{v}` has magnitude 6 at bearing 060°. What is `vec{u} + vec{v}`?", options:[
          { t:"`6√3` at bearing 030°", ok:true, why:"Inside angle 120°: 36 + 36 + 36 = 108. Equal sides, so the resultant splits the 60° turn." },
          { t:"12 at bearing 030°", why:M1 },
          { t:"`6√3` at bearing 060°", why:"The resultant lies between the two directions." },
          { t:"6 at bearing 030°", why:"That uses 60° inside the triangle. " + M2 }] },
        b:{ prompt:"`vec{u}` has magnitude 10 at bearing 090°; `vec{v}` has magnitude 10 at bearing 180°. What is `vec{u} + vec{v}`?", options:[
          { t:"`10√2` at bearing 135°", ok:true, why:"Perpendicular legs of 10; the resultant is halfway between east and south." },
          { t:"20 at bearing 135°", why:M1 },
          { t:"`10√2` at bearing 045°", why:M7 },
          { t:"10 at bearing 135°", why:"Perpendicular legs of 10 give `√{100 + 100} = 10√2`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Three vectors, each of magnitude 5, add to `vec{0}`. What is the angle between any two of them, tails together?", options:[
          { t:"60°", why:"60° is the angle inside the triangle they form tip to tail. " + M2 },
          { t:"90°", why:"Three right angles can’t close a loop." },
          { t:"120°", ok:true, why:"Tip to tail they form an equilateral triangle; each turn is 180° − 60°." },
          { t:"180°", why:"Two opposite vectors cancel, leaving the third. " + M6 }] },
        b:{ prompt:"Four vectors, each of magnitude 3, add to `vec{0}`: tip to tail they close into a four-sided figure, and each turns the same angle from the one before. What is the angle between consecutive vectors, tails together?", options:[
          { t:"45°", why:"Four turns of 45° add to only 180°: the path doesn’t close." },
          { t:"90°", ok:true, why:"Tip to tail they form a square; each turn is 90°." },
          { t:"120°", why:"That closes three equal vectors, not four." },
          { t:"180°", why:"Turning 180° each time just goes back and forth along one line: no four-sided figure. Four equal turns that close up make a square." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `|vec{u} + vec{v}| < |vec{u}| + |vec{v}|` unless `vec{u}` and `vec{v}` point the same way?", options:[
          { t:"“Tip to tail, `vec{u}`, `vec{v}` and `vec{u} + vec{v}` form a triangle, and any side of a triangle is shorter than the other two together. Only when the vectors point the same way does the triangle flatten into a line.”", ok:true, why:"The resultant is the third side of the tip-to-tail triangle." },
          { t:"“Because adding vectors always makes them shorter.”", why:"`|vec{u} + vec{v}|` can be longer than either one." },
          { t:"“It isn’t true: `|vec{u} + vec{v}|` always equals `|vec{u}| + |vec{v}|`.”", why:M1 },
          { t:"“Because the cosine law subtracts.”", why:"The cosine law can add, when the angle is obtuse." }] },
        b:{ prompt:"Which is the best explanation of why `vec{u} - vec{v}` and `vec{v} - vec{u}` have the same magnitude?", options:[
          { t:"“`vec{v} - vec{u} = -(vec{u} - vec{v})`: the same arrow reversed, so the same length but the opposite direction.”", ok:true, why:M5 },
          { t:"“Because they’re equal.”", why:M5 },
          { t:"“Because subtraction is commutative.”", why:M5 },
          { t:"“Because both equal `|vec{u}| - |vec{v}|`.”", why:"That’s only for parallel vectors." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which description correctly finds the displacement for a walk of 4 km east followed by 3 km north?", options:[
          { t:"“Draw 4 km east; from its tip draw 3 km north; the displacement runs from the start to the end: 5 km.”", ok:true, why:"Tip to tail, then from the start to the finish." },
          { t:"“Draw both arrows from the start and join their tips: 5 km.”", why:"The length matches by coincidence, but that arrow is a difference, pointing the wrong way. " + M3 },
          { t:"“Add the distances: 7 km.”", why:M1 },
          { t:"“Subtract: 4 − 3 = 1 km.”", why:"The legs aren’t opposite." }] },
        b:{ prompt:"Which description correctly finds the displacement for a walk of 6 km west followed by 8 km south?", options:[
          { t:"“Draw 6 km west; from its tip draw 8 km south; the displacement runs from the start to the end: 10 km.”", ok:true, why:"Tip to tail, then from the start to the finish." },
          { t:"“Draw both arrows from the start and join their tips: 10 km.”", why:M3 },
          { t:"“Add the distances: 14 km.”", why:M1 },
          { t:"“Subtract: 8 − 6 = 2 km.”", why:"The legs aren’t opposite." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A canoeist paddles 3 km east, then 5 km at N 30° E. How far is she from the start?", options:[
          { t:"2 km", why:"The legs aren’t opposite." },
          { t:"`√19` km", why:"The turn is 60°, so the angle inside the triangle is 120°. " + M2 },
          { t:"7 km", ok:true, why:"9 + 25 − 30 cos 120° = 49." },
          { t:"8 km", why:M1 }] },
        b:{ prompt:"A cyclist rides 5 km south, then 3 km at S 60° W. How far is she from the start?", options:[
          { t:"2 km", why:"The legs aren’t opposite." },
          { t:"`√19` km", why:"The turn is 60°, so the angle inside the triangle is 120°. " + M2 },
          { t:"7 km", ok:true, why:"The turn is 60°; inside angle 120°: 25 + 9 + 15 = 49." },
          { t:"8 km", why:M1 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A plane flies 4 km at bearing 000°, then 4 km at bearing 060°. What bearing takes it straight back to the start?", options:[
          { t:"030°", why:"That’s the direction from the start to the plane. " + M7 },
          { t:"120°", why:"The resultant is at 030°; reversing adds 180°." },
          { t:"210°", ok:true, why:"The resultant is at 030°; reversing adds 180°." },
          { t:"240°", why:"The return is opposite the resultant, not opposite the last leg." }] },
        b:{ prompt:"A hiker walks 10 km at bearing 090°, then 10 km at bearing 180°. What bearing takes her straight back to the start?", options:[
          { t:"045°", why:"The resultant is at 135°; add 180°." },
          { t:"135°", why:"That’s the direction from the start to the hiker. " + M7 },
          { t:"225°", why:"The resultant is at 135°; add 180°." },
          { t:"315°", ok:true, why:"The resultant is at 135°; add 180°." }] } }
    ]
  },
  task:{
    title:"Exactly 7", summary:"Exactly 7",
    statement:"<p>Choose two magnitudes and the angle between two vectors so that every condition holds. Use the cosine law to reason, then check on the table. Can you find all the answers?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`|vec{u} + vec{v}| = 7`.</li><li>`|vec{u}| != |vec{v}|`.</li><li>`vec{u}` and `vec{v}` are not parallel.</li><li>`|vec{u} - vec{v}| > |vec{u} + vec{v}|`.</li></ol></div><p class=\"tiny muted\">Choose whole numbers from 1 to 8 for the magnitudes, and an angle between them. The drawing shows both diagonals and their lengths.</p>",
    checks:["`|vec{u} + vec{v}| = 7`", "Different magnitudes", "Not parallel", "Difference longer than sum"],
    tips:["`|vec{u} + vec{v}|^2 = a^2 + b^2 + 2ab cos θ`. Which `θ` give whole-number possibilities?",
      "Make the two magnitudes different.",
      "0° and 180° make the vectors parallel.",
      "The difference is the longer diagonal when the angle between is obtuse."],
    explainPrompt:"Explain how the cosine law told you which angles could work before you tried any numbers.",
    vocab:"Use the words resultant, cosine law, obtuse and diagonal.",
    success:"Your vectors work!",
    more:"There’s more than one answer. Can you find them all?",
    after3:"At 120° the condition is `a^2 + b^2 - ab = 49`. (7, 7, 120°) also works but breaks line 2. At 150° the `√3` can never cancel, so no whole numbers work.",
    afterAt:4
  },
  cards:[
    ["Triangle law", "Tip to tail: `vec{u} + vec{v}` runs from the tail of `vec{u}` to the tip of `vec{v}`."],
    ["Parallelogram law", "Tails together: `vec{u} + vec{v}` is the diagonal from the shared tail."],
    ["Resultant", "The single vector equal to the sum."],
    ["`vec{u} - vec{v}`", "`vec{u} + (-vec{v})`; with tails together, from the tip of `vec{v}` to the tip of `vec{u}`."],
    ["`vec{v} - vec{u}`", "`-(vec{u} - vec{v})`: same length, opposite direction."],
    ["Angle in the triangle", "180° − `θ`, where `θ` is the angle between the vectors (tails together)."],
    ["`|vec{u} + vec{v}|^2`", "`|vec{u}|^2 + |vec{v}|^2 + 2|vec{u}||vec{v}| cos θ`."],
    ["`|vec{u} - vec{v}|^2`", "`|vec{u}|^2 + |vec{v}|^2 - 2|vec{u}||vec{v}| cos θ`."],
    ["Triangle inequality", "`|vec{u} + vec{v}| <= |vec{u}| + |vec{v}|`, equal only when they point the same way."],
    ["Closed loop", "Vectors that chain back to the start add to `vec{0}`."],
    ["Equal magnitudes", "The resultant splits the angle between them in half."],
    ["Return trip", "Reverse the resultant: add 180° to its bearing."]
  ]
};
