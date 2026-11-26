// MCV4U 47 Applications of the Cross Product and Triple Scalar Product.
// Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/47-applications-of-cross-and-triple-product.md
// misconception core sentences (plan §3)
const M1 = "`|vec{AB} × vec{AC}|` is the parallelogram. The triangle is half of it.";
const M2 = "The dot product measures how much two vectors line up; area and torque need sin θ, which is the cross product.";
const M3 = "Torque uses sin θ, and sin θ ≥ 0 for 0° ≤ θ ≤ 180°: `sin 120° = √3/2`.";
const M4 = "`vec{A}` and `vec{B}` start at the origin, not at a vertex. Use the sides `vec{AB} = B - A` and `vec{AC} = C - A`.";
const M5 = "The height is measured perpendicular to the base: the scalar projection of `vec{a}` onto `vec{b} × vec{c}`, not `|vec{a}|`.";
const M6 = "0 means the box is flat: coplanar. Volume is the absolute value; the sign only tells handedness.";
const M7 = "Torque is `vec{r} × vec{F}` (position first). `vec{F} × vec{r}` points the opposite way.";
const M8 = "Only a perpendicular push gives the full `|vec{r}||vec{F}|`. At 30° you get half.";
const TSP = "`vec{a} · (vec{b} × vec{c})`";

// sorter items (Activity 1): [text, box, feedback if misplaced]
const SORT = [
  ["Work done by a force along a displacement", "dot", "Work counts the part of the force along the motion: cos θ."],
  ["Torque on a wrench", "cross", "Torque uses the perpendicular part: sin θ. " + M2],
  ["Area of a triangle in R³", "cross", "Area is `|vec{AB} × vec{AC}|/2`. " + M2],
  ["Angle between two vectors", "dot", "`cos θ = vec{a} · vec{b}/(|vec{a}||vec{b}|)`."],
  ["A vector perpendicular to two given vectors", "cross", "`vec{a} × vec{b}` is perpendicular to both."],
  ["Volume of a parallelepiped", "both", "`|vec{a} · (vec{b} × vec{c})|`: a cross, then a dot."],
  ["Testing whether two vectors are perpendicular", "dot", "Perpendicular ⇔ `vec{a} · vec{b} = 0`."],
  ["Testing whether three vectors are coplanar", "both", "Coplanar ⇔ `vec{a} · (vec{b} × vec{c}) = 0`.",
    ["Coplanar means the box they make is flat.", "Flat box: volume 0.", "Volume uses `vec{a} · (vec{b} × vec{c})`: both."]],
  ["The part of a force acting along a ramp", "dot", "That’s a scalar projection: dot product."],
  ["Testing whether two vectors in R³ are parallel", "cross", "Parallel ⇔ `vec{a} × vec{b} = vec{0}`.",
    ["What is the angle between parallel vectors?", "`sin 0° = 0`.", "The cross product is `vec{0}`: cross."]],
  ["A normal to the plane through three points", "cross", "`vec{AB} × vec{AC}` is perpendicular to the plane (module 52 uses this)."]
];
const BOXES = ["dot", "cross", "both"];

export default {
  id:"47-applications-of-cross-and-triple-product",
  kind:"topic",
  title:"Applications of the cross product and triple scalar product",
  topic:"Applications of the Cross Product and Triple Scalar Product",
  readyTopic:"torque, areas and volumes with the cross product",
  hero:{
    eq:"`|vec{τ}| = ` <span class=\"ap-c1\">`|vec{r}|`</span><span class=\"ap-c2\">`|vec{F}|`</span>` sin θ`<span class=\"ap-heq2\">`V = |`<span class=\"ap-c1\">`vec{a}`</span>` · (`<span class=\"ap-c2\">`vec{b}`</span>` × `<span class=\"ap-c3\">`vec{c}`</span>`)|`</span>",
    eqLabel:"The magnitude of tau equals the magnitude of r times the magnitude of F times sine theta. V equals the absolute value of a dot, b cross c.",
    eqSize:"sm",
    headline:"Turning, area and volume from one product",
    text:"The cross product measures how much two vectors <strong>don’t</strong> line up. That’s exactly what a wrench needs: the <strong>torque</strong> `vec{r} × vec{F}` is biggest when you push at right angles. Add a dot product and you get the <strong>triple scalar product</strong> " + TSP + ", whose size is the <strong>volume</strong> of a slanted box.",
    fig:{ html:'<svg class="ap-hero" id="ap-hero" viewBox="0 0 360 300" role="img" aria-label="A wrench on a bolt with a force pushing at right angles gives 30 newton-metres; tilting the force to 30 degrees halves it to 15. Then three edge vectors a, b and c build a slanted box whose volume is the absolute value of a dot b cross c." focusable="false"></svg>' }
  },
  goals:[
    "I can find the area of a parallelogram or triangle in R³ with the cross product.",
    "I can find the magnitude of a torque with `|vec{r}||vec{F}| sin θ` and explain how length and angle change it.",
    "I can find a torque vector `vec{r} × vec{F}` from components and describe its direction.",
    "I can compute " + TSP + " and use it to find the volume of a parallelepiped.",
    "I can use the triple scalar product to decide whether three vectors (or four points) are coplanar.",
    "I can choose the dot product, the cross product, or both, for a given application."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Cross product", goal:1, prompt:"`(1, 0, 2) × (0, 3, 0)` = ?",
          options:[
            { t:"`(-6, 0, 3)`", ok:true, why:"`(0·0 - 2·3, 2·0 - 1·0, 1·3 - 0·0)`." },
            { t:"`(6, 0, 3)`", why:"Sign slip in the first component: `a_2 b_3 - a_3 b_2 = 0 - 6 = -6`." },
            { t:"`(0, 0, 0)`", why:"That’s `(1·0, 0·3, 2·0)`; the cross product uses the other components." },
            { t:"0", why:"`(1)(0) + (0)(3) + (2)(0) = 0` is the dot product." }],
          hints:["Use the component formula.", "First: `0·0 - 2·3`.", "`(-6, 0, 3)`."] },
        { id:"w2", skill:"Cross product", goal:1, prompt:"`|vec{a} × vec{b}| = 12`. What is the area of the triangle with sides `vec{a}` and `vec{b}`?",
          options:[
            { t:"6", ok:true, why:"The triangle is half the parallelogram." },
            { t:"12", why:"12 is the parallelogram." },
            { t:"24", why:"The triangle is smaller than the parallelogram." },
            { t:"144", why:"The length of `vec{a} × vec{b}` is already an area." }],
          hints:["What shape does `|vec{a} × vec{b}|` measure?", "A parallelogram is two copies of the triangle.", "6."] },
        { id:"w3", skill:"Special-angle sines", goal:2, prompt:"`sin 120°` = ?",
          options:[
            { t:"`√3/2`", ok:true, why:"Reference angle 60°; sine is positive in quadrant 2." },
            { t:"`-√3/2`", why:"Sine is positive in quadrant 2." },
            { t:"1/2", why:"`sin 60° = √3/2`." },
            { t:"`-1/2`", why:"That’s `cos 120°`." }],
          hints:["Reference angle?", "60°, quadrant 2.", "`√3/2`."] },
        { id:"w4", skill:"Special-angle sines", goal:2, prompt:"For which angle θ between 0° and 180° is `sin θ` largest?",
          options:[
            { t:"90°", ok:true, why:"`sin 90° = 1`, the largest value sine takes." },
            { t:"180°", why:"`sin 180° = 0`." },
            { t:"45°", why:"`sin 45° = √2/2 < 1`." },
            { t:"0°", why:"`sin 0° = 0`." }],
          hints:["Picture the unit circle’s height.", "Highest point: straight up.", "90°."] },
        { id:"w5", skill:"Dot or cross", goal:6, prompt:"A 20 N force pulls a box 3 m, and the force makes 60° with the direction of motion. Which calculation gives the work done?",
          options:[
            { t:"`20 × 3 × cos 60°` = 30 J", ok:true, why:"Work = `vec{F} · vec{d}` (module 45)." },
            { t:"`20 × 3 × sin 60°` = `30√3` J", why:"Work counts the part of the force <strong>along</strong> the motion: cosine." },
            { t:"`20 × 3` = 60 J", why:"Only a force along the motion does full work." },
            { t:"`20 × 3 × cos 30°` = `30√3` J", why:"The angle is 60°." }],
          hints:["Work uses the part of the force along the motion.", "That’s `|vec{F}| cos θ`.", "30 J."] },
        { id:"w6", skill:"Dot or cross", goal:6, prompt:"Which tells you a vector perpendicular to both `(1, 0, 0)` and `(0, 1, 1)`?",
          options:[
            { t:"Their cross product", ok:true, why:"`vec{a} × vec{b}` is perpendicular to both: here `(0, -1, 1)`." },
            { t:"Their dot product", why:"The dot product is a number, not a vector." },
            { t:"Their sum", why:"The sum lies in the same plane as both." },
            { t:"The vector projection of one onto the other", why:"A projection lies along one of the vectors." }],
          hints:["Which product gives a vector?", "And it’s perpendicular to both.", "The cross product."] }
      ],
      refreshers:{
        "Cross product":"`vec{a} × vec{b} = (a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1)`; its length is the parallelogram’s area, so half of it is the triangle’s (module 46).",
        "Special-angle sines":"`sin 30° = sin 150° = 1/2`; `sin 45° = sin 135° = √2/2`; `sin 60° = sin 120° = √3/2`; `sin 90° = 1`; `sin 0° = sin 180° = 0`.",
        "Dot or cross":"Dot product: a number using cos θ (work, angles, projections). Cross product: a vector whose length uses sin θ (area, torque, perpendicular vectors)."
      }
    }
  },
  explore:{
    heading:"Wrench and torque",
    intro:"Turn a bolt with different wrenches, forces and angles. Then see torque as a vector in 3D, and use the same product to find areas.",
    modes:[{ id:"wrench", t:"Wrench" }, { id:"t3d", t:"3D torque" }, { id:"area", t:"Area" }],
    angles:[0, 30, 45, 60, 90, 120, 135, 150, 180],
    txt:{
      mode:"Mode", r:"Wrench length `r`", F:"Force `F`", th:"Angle θ between the wrench and the force",
      push:"Push direction", down:"Push down", up:"Pull up",
      wrenchKey:"Side view. The wrench in blue, the force in teal, its perpendicular part <em>F</em> sin θ dashed, the torque as a curved black arrow.",
      key3d:"`vec{r}` in blue, `vec{F}` in teal, `vec{τ} = vec{r} × vec{F}` in black along the bolt’s axis. Drawn to scale: 1 grid unit = 0.1 m for `vec{r}`, 25 N for `vec{F}` and 2.5 N·m for `vec{τ}`.",
      keyArea:"Triangle `ABC` shaded in blue, the completing parallelogram dashed, `vec{AB}` in blue and `vec{AC}` in teal from A, and `vec{AB} × vec{AC}` in black (drawn at half length).",
      rows:{ tq:"Torque `|vec{τ}|`", share:"Share of maximum", turn:"Turning", tv:"`vec{τ} = vec{r} × vec{F}`", tm:"`|vec{τ}|`",
        ab:"`vec{AB}`", ac:"`vec{AC}`", cr:"`vec{AB} × vec{AC}`", par:"Parallelogram `|vec{AB} × vec{AC}|`", tri:"Triangle `ABC`" },
      cw:"Clockwise: tightens", ccw:"Counterclockwise: loosens", none:"No turning",
      formula:"Component formula", record:"Record this C", clear:"Clear records", recH:"Recorded positions of C",
      noRec:"None yet. Move C, then press Record this C.", setup:"Set A(2, 0, 0) and B(0, 1, 0)", recFull:"You can record up to four positions. Clear them first."
    },
    predIntro:"Make a prediction first. Then the wrench shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Wrench, `r` = 0.3 m, `F` = 100 N. Which angle gives the most torque?",
        options:[{ t:"90°", ok:true }, { t:"45°" }, { t:"0°" }, { t:"180°" }],
        explain:"`sin θ` is largest at 90°. Pushing along the handle (0° or 180°) does nothing." },
      { id:"p2", prompt:"θ moves from 30° to 150°. Compared with 30°, the torque at 150° is…",
        options:[{ t:"the same", ok:true }, { t:"larger" }, { t:"smaller" }, { t:"zero" }],
        explain:"`sin 150° = sin 30° = 1/2`. What matters is the perpendicular part of the force." },
      { id:"p3", prompt:"Double the wrench length and halve the force. The torque…",
        options:[{ t:"stays the same", ok:true }, { t:"doubles" }, { t:"halves" }, { t:"quadruples" }],
        explain:"`2 × 1/2 = 1`." },
      { id:"p4", prompt:"3D torque, `vec{r} = (0.2, 0, 0)`, `vec{F} = (0, 50, 0)`. Which way does `vec{τ} = vec{r} × vec{F}` point?",
        options:[{ t:"along +`z`", ok:true }, { t:"along −`z`" }, { t:"along +`x`" }, { t:"along +`y`" }],
        explain:"`vec{r} × vec{F} = (0, 0, 10)`: curl from `vec{r}` to `vec{F}` and your thumb points up." }
    ],
    chalIntro:"Set the controls, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Wrench mode: with `r` = 0.3 m and θ = 30°, make the torque exactly 15 N·m.",
        why:"`0.3 × 100 × sin 30° = 30 × 1/2 = 15` N·m.",
        hints:["`|vec{τ}| = rF sin θ`.", "`0.3 × F × 1/2 = 15`.", "`F` = 100 N."],
        msgs:{ setup:"Set `r` = 0.3 m and θ = 30° first; then choose the force.",
          f50:"`0.3 × 50 = 15`, but the angle halves it: you get 7.5 N·m. " + M8,
          f200:"That gives 30 N·m: `sin 30°` is 1/2, not 1/4." } },
      { id:"tc2", goal:2, prompt:"With `F` = 120 N and `r` = 0.25 m, choose θ so the torque is `15√2` N·m.",
        why:"`0.25 × 120 = 30`, and `30 sin θ = 15√2` needs `sin θ = √2/2`: θ = 45° or 135°.",
        hints:["`0.25 × 120 = 30`, so `30 sin θ = 15√2`.", "`sin θ = √2/2`.", "45° (or 135°)."],
        msgs:{ setup:"Set `F` = 120 N and `r` = 0.25 m first; then choose θ.",
          s60:"That gives `15√3` N·m.", s30:"That gives 15 N·m.", s90:"That’s the maximum, 30 N·m.",
          s0:"Pushing along the handle gives 0 N·m." } },
      { id:"tc3", goal:1, stretch:true, prompt:"Area mode: A(2, 0, 0) and B(0, 1, 0) are fixed. Place C on the `z`-axis so that triangle `ABC` has area 3/2. Find <strong>both</strong> positions (press <strong>Record this C</strong> for each).",
        why:"With C = (0, 0, `c`): `vec{AB} × vec{AC} = (c, 2c, 2)`, length `√{5c^2 + 4}`. `½√{5c^2 + 4} = 3/2` gives `c = ±1`.",
        hints:["With C = (0, 0, `c`): `vec{AB} = (-2, 1, 0)` and `vec{AC} = (-2, 0, c)`.", "`vec{AB} × vec{AC} = (c, 2c, 2)`, length `√{5c^2 + 4}`.", "`½√{5c^2 + 4} = 3/2` gives `5c^2 + 4 = 9`, so `c = ±1`."],
        msgs:{ setup:"Set A = (2, 0, 0) and B = (0, 1, 0) first (there’s a button for it).",
          flat:"The triangle lies flat in the `xy`-plane: area 1.", two:"Area `½√24 = √6 ≈ 2.45`.",
          off:"C must be (0, 0, `c`).", none:"Move C onto the `z`-axis, then press <strong>Record this C</strong>.",
          one:"That position works. There’s a second one: find both.", rec:"That position works. Press <strong>Record this C</strong>, then find the other one.",
          general:"Not yet: the area must be exactly 3/2. Watch the triangle readout.", extra:"Keep only the positions that give area 3/2: clear the records and record just those." } }
    ]
  },
  part3:{
    slug:"volume", name:"Volume",
    heading:"Volume of a parallelepiped",
    intro:"Build a slanted box from three edge vectors, then lean it, flatten it and reorder it. Each station is a tab. Finish with the quick check.",
    tabs:["Build", "Lean", "Flatten", "Reorder", "Four points"],
    st1:{ title:"Station 1: Build the box",
      text:"Set the three edges. The box is drawn with its three faces at the corner shaded; the base spanned by `vec{b}` and `vec{c}` is darkest, and the dashed black segment is the height.",
      rows:{ bc:"`vec{b} × vec{c}`", base:"Base area `|vec{b} × vec{c}|`", h:"Height (scalar projection of `vec{a}` on `vec{b} × vec{c}`)", tsp:TSP, vol:"Volume" },
      working:"Check it with algebra" },
    st2:{ title:"Station 2: Lean it",
      text:"The sliders slide the top face sideways: they add multiples of `vec{a}` and `vec{b}` to `vec{c}`. Watch the volume.",
      la:"Lean along `vec{a}`", lb:"Lean along `vec{b}`",
      banner:"Same base, same height, same volume. The slanted edge `|vec{c}|` is not the height.",
      rows:{ c:"New `vec{c}`", cl:"Slanted edge `|vec{c}|`", base:"Base area `|vec{a} × vec{b}|`", h:"Height", vol:"Volume `|vec{a} · (vec{b} × vec{c})|`" } },
    st3:{ title:"Station 3: Flatten it",
      text:"The slider lowers `vec{c}` toward the plane of `vec{a}` and `vec{b}`. Watch the volume as the box gets flatter.",
      sl:"Height of `vec{c}` above the base",
      banner:"`vec{a} · (vec{b} × vec{c}) = 0` ⇔ the three vectors are coplanar.",
      flat:"Flat: the box is a parallelogram, and the three vectors are coplanar.",
      rows:{ c:"`vec{c}`", h:"Height", tsp:TSP, vol:"Volume" } },
    st4:{ title:"Station 4: Reorder it",
      text:"Compute the triple product in four different orders with the edges from Station 1.",
      orders:[{ id:"abc", t:"`vec{a} · (vec{b} × vec{c})`" }, { id:"bca", t:"`vec{b} · (vec{c} × vec{a})`" }, { id:"acb", t:"`vec{a} · (vec{c} × vec{b})`" }, { id:"cab", t:"`vec{c} · (vec{a} × vec{b})`" }],
      rule:"Cycling the order keeps the value; swapping two vectors flips the sign. Volume is the absolute value.",
      none:"Press a button to compute that order." },
    st5:{ title:"Station 5: Four points",
      text:"Move the four points. The station computes `vec{AB} · (vec{AC} × vec{AD})`. Start: A(1, 0, 0), B(0, 1, 0), C(0, 0, 1), D(1, 1, −1).",
      rows:{ ab:"`vec{AB}`", ac:"`vec{AC}`", ad:"`vec{AD}`", cr:"`vec{AC} × vec{AD}`", tsp:"`vec{AB} · (vec{AC} × vec{AD})`", verdict:"The four points" },
      yes:"lie in one plane (coplanar)", no:"are not coplanar: they make a box of volume " },
    quickCheck:{
      title:"Quick check", summary:"Volume of a parallelepiped quick check",
      items:[
        { id:"q1", goal:4, prompt:TSP + " `= -8`. The volume of the parallelepiped is…",
          choices:[{ t:"8", ok:true, fb:"Right. Volume is the absolute value; the sign is handedness." }, { t:"−8", fb:"Volume is the absolute value; the sign is handedness." },
            { t:"4/3", fb:"Volume is the absolute value; the sign is handedness." }, { t:"64", fb:"Volume is the absolute value; the sign is handedness." }] },
        { id:"q2", goal:5, prompt:TSP + " `= 0` means…",
          choices:[{ t:"the vectors are coplanar", ok:true, fb:"Right. A zero-volume box is flat." }, { t:"the vectors are perpendicular", fb:"A zero-volume box is flat." },
            { t:"all three are parallel", fb:"A zero-volume box is flat." }, { t:"`vec{a} = vec{0}`", fb:"A zero-volume box is flat." }] },
        { id:"q3", goal:4, prompt:"`(1, 0, 0) · [(0, 2, 0) × (0, 0, 3)]` = ?",
          choices:[{ t:"6", ok:true, fb:"Right. `(0, 2, 0) × (0, 0, 3) = (6, 0, 0)`; dot with `(1, 0, 0)` gives 6: a 1 × 2 × 3 box." },
            { t:"0", fb:"`(0, 2, 0) × (0, 0, 3) = (6, 0, 0)`; dot with `(1, 0, 0)` gives 6: a 1 × 2 × 3 box." },
            { t:"`(6, 0, 0)`", fb:"`(0, 2, 0) × (0, 0, 3) = (6, 0, 0)`; dot with `(1, 0, 0)` gives 6: a 1 × 2 × 3 box." },
            { t:"5", fb:"`(0, 2, 0) × (0, 0, 3) = (6, 0, 0)`; dot with `(1, 0, 0)` gives 6: a 1 × 2 × 3 box." }] },
        { id:"q4", goal:4, prompt:"If " + TSP + " `= 5`, what is `vec{a} · (vec{c} × vec{b})`?",
          choices:[{ t:"−5", ok:true, fb:"Right. `vec{c} × vec{b} = -(vec{b} × vec{c})`." }, { t:"5", fb:"`vec{c} × vec{b} = -(vec{b} × vec{c})`." },
            { t:"0", fb:"`vec{c} × vec{b} = -(vec{b} × vec{c})`." }, { t:"25", fb:"`vec{c} × vec{b} = -(vec{b} × vec{c})`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Dot, cross or both?", summary:"Dot, cross or both?", goal:6, noun:"task", txt:true,
        instruction:"Tap a task, then tap the product it needs.",
        boxes:[{ id:"dot", label:"Dot product" }, { id:"cross", label:"Cross product" }, { id:"both", label:"Both (triple scalar product)" }],
        items:SORT.map(function(s, i){
          var wrong = {}; BOXES.forEach(function(b){ if (b !== s[1]) wrong[b] = s[2]; });
          var it = { id:"i" + (i + 1), t:s[0], answer:s[1], why:s[2], wrong:wrong };
          if (s[3]) it.hints = s[3];
          return it;
        }) },
      { id:"apps", type:"numeric", title:"Applications set", summary:"Applications set", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Type each answer as a whole number or a fraction. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        items:[
          { id:"v1", goal:1, prompt:"Area of triangle P(1, 0, 1), Q(3, 2, 2), R(1, 2, 3).", answer:3, display:"3",
            wrong:[{ match:6, fb:"That’s the parallelogram. " + M1 }, { match:36, fb:"Length of `(2, -4, 4)` is 6, not 36." }],
            why:"`vec{PQ} × vec{PR} = (2, 2, 1) × (0, 2, 2) = (2, -4, 4)`, length 6; half is 3." },
          { id:"v2", goal:4, prompt:"Volume of the parallelepiped with edges `(1, 1, 0)`, `(0, 1, 1)`, `(1, 0, 1)`.", answer:2, display:"2",
            wrong:[{ match:-2, fb:"The triple product could be −2 in another order; volume is positive." }],
            why:"`(0, 1, 1) × (1, 0, 1) = (1, 1, -1)`; `(1, 1, 0) · (1, 1, -1) = 2`." },
          { id:"v3", goal:5, star:true, prompt:"For which `k` are `(1, 2, k)`, `(2, 1, 0)` and `(0, 3, 2)` coplanar? `k` =", answer:1, display:"`k = 1`",
            general:"Set the triple product `2 - 8 + 6k` to 0.",
            why:"`1(2) - 2(4) + k(6) = 0`, so `k = 1`.",
            hints:["Coplanar ⇔ triple product 0.", "Expand the determinant with rows `(1, 2, k)`, `(2, 1, 0)`, `(0, 3, 2)`.", "`1(2) - 2(4) + k(6) = 0`, so `k = 1`."] },
          { id:"v4", goal:5, star:true, prompt:"Are A(1, 0, 0), B(0, 1, 0), C(0, 0, 1) and D(1, 1, −1) coplanar? Enter `vec{AB} · (vec{AC} × vec{AD})`.", answer:0, display:"0 (coplanar)",
            general:"`vec{AB} = (-1, 1, 0)`, `vec{AC} = (-1, 0, 1)`, `vec{AD} = (0, 1, -1)`.",
            why:"`vec{AC} × vec{AD} = (-1, -1, -1)` and `vec{AB} · (-1, -1, -1) = 0`: the four points are coplanar." },
          { id:"v5", goal:3, star:true, prompt:"A force `vec{F} = (0, 40, 30)` N acts at `vec{r} = (0.3, 0, 0)` m from a pivot. Find `|vec{τ}|`.", answer:15, unit:"N·m", display:"15 N·m",
            wrong:[{ match:12, fb:"That’s the `z`-component only. `vec{τ} = (0, -9, 12)`." }, { match:9, fb:"That’s the `y`-component’s size. `vec{τ} = (0, -9, 12)`." }],
            general:"`vec{τ} = (0, -9, 12)`.",
            why:"`vec{τ} = (0, -9, 12)` and `√{81 + 144} = 15` N·m.",
            hints:["Compute `vec{r} × vec{F}`.", "`(0·30 - 0·40, 0·0 - 0.3·30, 0.3·40 - 0·0) = (0, -9, 12)`.", "`√{81 + 144} = 15`."] },
          { id:"v6", goal:4, star:true, prompt:"Edges `vec{a} = (1, 1, 1)`, `vec{b} = (1, 2, 2)`, `vec{c} = (2, 1, -2)`. Find the height of the parallelepiped measured from the base spanned by `vec{b}` and `vec{c}`.", answer:0.3333333333333333, tol:1e-6, display:"1/3",
            wrong:[{ match:1.7320508075688772, fb:"That’s `|vec{a}|`, a slanted edge. " + M5 }, { match:3, fb:"That’s the volume; divide by the base area 9." }],
            why:"Volume 3 ÷ base area 9 = 1/3.",
            hints:["Height = volume ÷ base area.", "`vec{b} × vec{c} = (-6, 6, -3)`, so base area = 9.", "`vec{a} · (-6, 6, -3) = -3`: volume 3, height `3/9 = 1/3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Wei", goal:[1, 2, 5],
        instruction:"Wei made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the area of the triangle with vertices A(1, 1, 0), B(4, 1, 4) and C(1, 3, 0).",
            steps:["`vec{AB} = (3, 0, 4)` and `vec{AC} = (0, 2, 0)`.", "`vec{AB} × vec{AC} = (0·0 - 4·2, 4·0 - 3·0, 3·2 - 0·0) = (-8, 0, 6)`.", "`|vec{AB} × vec{AC}| = √{64 + 36} = 10`.", "So the triangle’s area is 10."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The triangle is half the parallelogram: 5.", ok:true, why:M1 },
              { t:"The area is `10^2 = 100`.", why:"The length is already an area." },
              { t:"The area is `|vec{AB} · vec{AC}| = 0`.", why:M2 },
              { t:"Step 4 is correct.", why:"10 is the parallelogram on `vec{AB}` and `vec{AC}`." }],
            hints:["What does `|vec{AB} × vec{AC}|` measure?", "The parallelogram, made of two copies of the triangle.", "5."] },
          { id:"e2", goal:2, task:"A 0.25 m wrench is pushed with 60 N at 120° to the handle. Find the torque’s magnitude.",
            steps:["`|vec{τ}| = |vec{r}||vec{F}| sin θ`.", "`|vec{τ}| = 0.25 × 60 × sin 120° = 15 sin 120°`.", "`sin 120° = -√3/2`.", "So `|vec{τ}| = -7.5√3` N·m."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`sin 120° = √3/2`, so `|vec{τ}| = 7.5√3` N·m.", ok:true, why:M3 },
              { t:"`sin 120° = 1/2`, so 7.5 N·m.", why:"That’s `sin 30°`." },
              { t:"Use `cos 120° = -1/2` instead: 7.5 N·m.", why:M3 },
              { t:"Step 3 is correct.", why:"A magnitude can’t be negative; sine is positive in quadrant 2." }],
            hints:["Which quadrant is 120° in?", "Quadrant 2: sine is positive.", "`7.5√3` N·m."] },
          { id:"e3", goal:5, task:"Are `vec{u} = (1, 2, 0)`, `vec{v} = (0, 1, 3)` and `vec{w} = (2, 5, 3)` coplanar?",
            steps:["`vec{v} × vec{w} = (1·3 - 3·5, 3·2 - 0·3, 0·5 - 1·2) = (-12, 6, -2)`.", "`vec{u} · (vec{v} × vec{w}) = -12 + 12 + 0 = 0`.", "A triple product of 0 means the vectors are perpendicular.", "So they are not coplanar."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"0 means the box is flat, so the vectors <strong>are</strong> coplanar. In fact `vec{w} = 2vec{u} + vec{v}`.", ok:true, why:M6 },
              { t:"Recompute: `vec{u} · (vec{v} × vec{w}) = 24`.", why:"Step 2’s arithmetic is right." },
              { t:"0 means one of the vectors is `vec{0}`.", why:"None of the three is `vec{0}`; a triple product of 0 means the box is flat." },
              { t:"Step 3 is correct.", why:"`vec{u} · vec{v} = 2 ≠ 0`, so they aren’t even perpendicular. " + M6 }],
            hints:["What does the triple product measure?", "Volume. A volume of 0 means…", "…a flat box: coplanar."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about torque: that the angle matters so much, or that torque is a vector along the bolt?" },
      { id:"j2", q:"In your own words, why does " + TSP + " give a volume? Mention base and height." },
      { id:"j3", q:"Explain to a friend how to find the area of a triangle in space from its three vertices." },
      { id:"j4", q:"Which application (area, torque, volume or coplanarity) are you least sure about? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Find the area of the triangle with vertices O(0, 0, 0), P(0, 1, 1) and Q(2, 1, 0).", options:[
          { t:"3/2", ok:true, why:"`vec{OP} × vec{OQ} = (-1, 2, -2)`, length 3; half is 3/2." },
          { t:"1", why:"`vec{OP} · vec{OQ} = 1` is the dot product. " + M2 },
          { t:"3", why:"3 is the parallelogram. " + M1 },
          { t:"9/2", why:"½ × 9 uses the squared length." }] },
        b:{ prompt:"Find the area of the triangle with vertices O(0, 0, 0), P(0, 1, 1) and Q(2, 0, 1).", options:[
          { t:"3/2", ok:true, why:"`vec{OP} × vec{OQ} = (1, 2, -2)`, length 3." },
          { t:"1", why:"`vec{OP} · vec{OQ} = 1` is the dot product. " + M2 },
          { t:"3", why:"3 is the parallelogram. " + M1 },
          { t:"9/2", why:"Squared length: ½ × 9 uses `|vec{OP} × vec{OQ}|^2`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A 0.4 m wrench is pushed with 50 N at 30° to the handle. Torque magnitude?", options:[
          { t:"10 N·m", ok:true, why:"`0.4 × 50 × 1/2`." },
          { t:"`10√3` N·m", why:"That uses `cos 30°`. " + M3 },
          { t:"20 N·m", why:"That ignores the angle. " + M8 },
          { t:"125 N·m", why:"`50 ÷ 0.4` divides; torque multiplies." }] },
        b:{ prompt:"A 0.3 m wrench is pushed with 60 N at 150° to the handle. Torque magnitude?", options:[
          { t:"9 N·m", ok:true, why:"`18 × sin 150° = 18 × 1/2`." },
          { t:"`9√3` N·m", why:"That uses the cosine’s size, `√3/2`. " + M3 },
          { t:"18 N·m", why:"That ignores the angle. " + M8 },
          { t:"200 N·m", why:"`60 ÷ 0.3` divides; torque multiplies." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Volume of the parallelepiped with edges `(2, 0, 0)`, `(0, 3, 0)` and `(1, 1, 4)`?", options:[
          { t:"24", ok:true, why:"`(2, 0, 0) · [(0, 3, 0) × (1, 1, 4)] = 2 × 12 = 24`." },
          { t:"4", why:"That’s 1/6 of it: a tetrahedron." },
          { t:"6", why:"That’s only the base area." },
          { t:"`18√2`", why:"Base 6 times the slanted edge `3√2`; the height is 4. " + M5 }] },
        b:{ prompt:"Volume of the parallelepiped with edges `(3, 0, 0)`, `(0, 2, 0)` and `(1, 2, 2)`?", options:[
          { t:"12", ok:true, why:"`3 × (2 × 2 - 0) = 12`." },
          { t:"2", why:"That’s 1/6 of it: a tetrahedron." },
          { t:"6", why:"That’s only the base area." },
          { t:"18", why:"Base 6 times the slanted edge 3; the height is 2. " + M5 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`vec{r} = (0.2, 0, 0)` m and `vec{F} = (0, 30, 40)` N. Find `vec{τ} = vec{r} × vec{F}`.", options:[
          { t:"`(0, -8, 6)` N·m", ok:true, why:"`(0·40 - 0·30, 0·0 - 0.2·40, 0.2·30 - 0·0)`." },
          { t:"`(0, 8, 6)` N·m", why:"Sign slip in the middle: `a_3 b_1 - a_1 b_3 = 0 - 8`." },
          { t:"`(0, 8, -6)` N·m", why:"That’s `vec{F} × vec{r}`. " + M7 },
          { t:"10 N·m", why:"That’s `|vec{τ}|`; the question asks for the vector." }] },
        b:{ prompt:"`vec{r} = (0, 0.5, 0)` m and `vec{F} = (30, 0, 40)` N. Find `vec{τ}`.", options:[
          { t:"`(20, 0, -15)` N·m", ok:true, why:"`(0.5·40 - 0, 0·30 - 0·40, 0 - 0.5·30)`." },
          { t:"`(20, 0, 15)` N·m", why:"Sign slip in the last component: `0·0 - 0.5·30 = -15`." },
          { t:"`(-20, 0, 15)` N·m", why:"That’s `vec{F} × vec{r}`. " + M7 },
          { t:"25 N·m", why:"Magnitude, not the vector." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"For which `k` are `(1, k, 0)`, `(0, 1, 2)` and `(2, 1, 1)` coplanar?", options:[
          { t:"`k = 1/4`", ok:true, why:"Triple product `= 1(1 - 2) - k(0 - 4) = -1 + 4k = 0`." },
          { t:"`k = -1/4`", why:"Sign slip in the middle cofactor: `-k(0 - 4) = +4k`." },
          { t:"`k = 4`", why:"`-1 + 4k = 0` gives `k = 1/4`, not 4." },
          { t:"`k = 0`", why:"With `k = 0` the triple product is −1, not 0." }] },
        b:{ prompt:"For which `k` are `(1, 0, k)`, `(2, 1, 1)` and `(0, 1, 3)` coplanar?", options:[
          { t:"`k = -1`", ok:true, why:"`1(3 - 1) - 0 + k(2 - 0) = 2 + 2k = 0`." },
          { t:"`k = 1`", why:"Sign: `2 + 2k = 0`." },
          { t:"`k = -2`", why:"`2 + 2k = 0` gives −1." },
          { t:"`k = 0`", why:"Triple product `2 ≠ 0`." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"A triangular sail has corners A(1, 0, 0), B(0, 2, 0) and C(0, 0, 2). Its area?", options:[
          { t:"`√6`", ok:true, why:"`vec{AB} × vec{AC} = (-1, 2, 0) × (-1, 0, 2) = (4, 2, 2)`, length `2√6`; half is `√6`." },
          { t:"1", why:"`vec{A} × vec{B}` uses position vectors from the origin, not the sides. " + M4 },
          { t:"5/2", why:"`½|vec{AB}||vec{AC}|` ignores the angle between the sides." },
          { t:"`2√6`", why:"That’s the parallelogram. " + M1 }] },
        b:{ prompt:"A sail has corners A(1, 0, 0), B(0, 2, 0) and C(0, 0, 3). Its area?", options:[
          { t:"7/2", ok:true, why:"`(-1, 2, 0) × (-1, 0, 3) = (6, 3, 2)`, length 7; half is 7/2." },
          { t:"1", why:"`vec{A} × vec{B}` uses position vectors from the origin, not the sides. " + M4 },
          { t:"`5√2/2`", why:"`½ × √5 × √10` ignores the angle." },
          { t:"7", why:"That’s the parallelogram. " + M1 }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which best explains why the torque is 0 when you push straight along a wrench handle?", options:[
          { t:"“Torque is `|vec{r}||vec{F}| sin θ`. Along the handle θ = 0°, and `sin 0° = 0`, so `vec{r} × vec{F} = vec{0}`.”", ok:true, why:"The cross product uses sin θ, which is 0 along the handle." },
          { t:"“Because `vec{r} · vec{F} = 0` when the force is along the handle.”", why:"The dot product is largest then. " + M2 },
          { t:"“Because torque is `|vec{r}||vec{F}| cos θ` and `cos 0° = 0`.”", why:"`cos 0° = 1`, and torque uses sine." },
          { t:"“Because the force is too small to turn the bolt.”", why:"Any size of push along the handle gives 0." }] },
        b:{ prompt:"Which best explains why a longer wrench makes a stuck bolt easier to turn?", options:[
          { t:"“With the same force and angle, `|vec{r}||vec{F}| sin θ` grows in proportion to `|vec{r}|`, so doubling the length doubles the torque.”", ok:true, why:"Torque is proportional to the length of the wrench." },
          { t:"“A longer wrench increases the angle θ.”", why:"The angle depends on how you push, not on the length." },
          { t:"“Torque depends on `vec{r} · vec{F}`, which grows with length.”", why:M2 },
          { t:"“A longer wrench lets you push along the handle.”", why:"That gives 0 torque." }] } },
      { id:"c2", cat:"C", goal:[4, 5],
        a:{ prompt:"Which statement about " + TSP + " is correct?", options:[
          { t:"“Its absolute value is the volume of the parallelepiped with edges `vec{a}`, `vec{b}`, `vec{c}`, and it is 0 exactly when the three vectors are coplanar.”", ok:true, why:"Base area times height, and a flat box has no volume." },
          { t:"“It is a vector perpendicular to all three.”", why:"A dot product gives a number." },
          { t:"“It is always positive, because it is a volume.”", why:"Swapping two vectors flips its sign. " + M6 },
          { t:"“`(vec{a} · vec{b}) × vec{c}` means the same thing.”", why:"`vec{a} · vec{b}` is a number, and you can’t cross a number with a vector." }] },
        b:{ prompt:"In `V = |vec{a} · (vec{b} × vec{c})|`, which describes the roles of `|vec{b} × vec{c}|` and the scalar projection of `vec{a}` onto `vec{b} × vec{c}`?", options:[
          { t:"“`|vec{b} × vec{c}|` is the base area and the scalar projection is the height, so `V` = base × height.”", ok:true, why:"The cross product’s length is the base area; the projection onto the normal is the height." },
          { t:"“`|vec{b} × vec{c}|` is the height and `|vec{a}|` is the base.”", why:"The cross product’s length is an area." },
          { t:"“The height is always `|vec{a}|`.”", why:M5 },
          { t:"“The base area is `vec{b} · vec{c}`.”", why:M2 }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"Loosening a bolt takes 24 N·m. Your wrench is 0.3 m long and you can push with at most 160 N. What is the smallest angle between the wrench and your push that works?", options:[
          { t:"30°", ok:true, why:"`48 sin θ = 24` gives `sin θ = 1/2`: 30° (any angle from 30° to 150° works)." },
          { t:"60°", why:"That solves `cos θ = 1/2`. " + M3 },
          { t:"90°", why:"90° works, but smaller angles do too." },
          { t:"150°", why:"That also gives 24 N·m, but it’s the largest such angle." }] },
        b:{ prompt:"A bolt needs `15√2` N·m. Your wrench is 0.3 m and your push is at most 100 N. Smallest angle that works?", options:[
          { t:"45°", ok:true, why:"`30 sin θ = 15√2` gives `sin θ = √2/2`." },
          { t:"30°", why:"`sin 30° = 1/2`, which gives only 15 N·m." },
          { t:"90°", why:"90° works, but smaller angles do too." },
          { t:"135°", why:"Also works, but it’s the largest angle." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A crystal’s unit cell has edges `vec{a} = (2, 0, 0)`, `vec{b} = (1, 2, 0)` and `vec{c} = (0, 1, 3)`, in nanometres. Its volume?", options:[
          { t:"12 nm³", ok:true, why:"`vec{b} × vec{c} = (6, -3, 1)`; `vec{a} · (6, -3, 1) = 12`." },
          { t:"2 nm³", why:"That’s 1/6: a tetrahedron." },
          { t:"4 nm³", why:"`vec{a} · vec{b} + vec{b} · vec{c} + vec{c} · vec{a} = 4` adds dot products." },
          { t:"`4√10` nm³", why:"Base area 4 times the slanted edge `√10`; the height is 3. " + M5 }] },
        b:{ prompt:"A unit cell has edges `vec{a} = (3, 0, 0)`, `vec{b} = (1, 1, 0)`, `vec{c} = (0, 2, 2)`, in nanometres. Its volume?", options:[
          { t:"6 nm³", ok:true, why:"`vec{b} × vec{c} = (2, -2, 2)`; `vec{a} · (2, -2, 2) = 6`." },
          { t:"1 nm³", why:"That’s 1/6: a tetrahedron." },
          { t:"5 nm³", why:"That adds the dot products `vec{a} · vec{b} + vec{b} · vec{c} + vec{c} · vec{a}`." },
          { t:"`6√2` nm³", why:"Base 3 times the slanted edge `2√2`. " + M5 }] } }
    ]
  },
  task:{
    title:"Lean the box", summary:"Lean the box",
    statement:"<p>Two edges of a box are fixed: `vec{a} = (2, 0, 0)` and `vec{b} = (1, 3, 0)`. Design the third edge `vec{c}` so the box meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The volume is 12 cubic units.</li><li>`vec{a}`, `vec{b}`, `vec{c}` form a right-handed set (`vec{a} · (vec{b} × vec{c}) > 0`).</li><li>The edge `vec{c}` has length 3.</li><li>`vec{c}` makes an acute angle with `vec{a}`.</li></ol></div>" +
      "<p class=\"tiny muted\">`c_1`, `c_2`, `c_3` are whole numbers from −4 to 4. The box and the readouts update as you go.</p>",
    checks:["Volume 12", "Right-handed", "`|vec{c}| = 3`", "Acute angle with `vec{a}`"],
    tips:["`vec{b} × vec{c} = (3c_3, -c_3, c_2 - 3c_1)`, so the volume is `|6c_3|`: only the height `c_3` matters.",
      "Right-handed needs a positive triple product: `c_3 > 0`.",
      "With `c_3 = 2`, you need `c_1^2 + c_2^2 = 5`.",
      "Acute with `vec{a} = (2, 0, 0)` means `c_1 > 0`."],
    explainPrompt:"Explain why every answer has `c_3 = 2`, and what the other two components change about the box.",
    vocab:"Use the words base, height, volume and triple scalar product.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"Every answer has the same height, 2. Sliding the top of the box sideways (changing `c_1` and `c_2`) leans it without changing its volume.",
    labels:{ c1:"`c_1`", c2:"`c_2`", c3:"`c_3`", range:"(−4 to 4)", invalid:"Choose whole numbers from −4 to 4 for `c_1`, `c_2` and `c_3`.",
      tsp:TSP, cl:"`|vec{c}|`", ac:"`vec{a} · vec{c}`", view:"The box on `vec{a}`, `vec{b}` and `vec{c}`" }
  },
  cards:[
    ["Area of a parallelogram in R³", "`|vec{a} × vec{b}|` for sides `vec{a}`, `vec{b}`."],
    ["Area of triangle `ABC`", "`½|vec{AB} × vec{AC}|`; use sides, not position vectors."],
    ["Torque", "`vec{τ} = vec{r} × vec{F}`, magnitude `|vec{r}||vec{F}| sin θ` (N·m)."],
    ["Maximum torque", "Push perpendicular to the wrench (θ = 90°): `|vec{r}||vec{F}|`."],
    ["Zero torque", "Push along the handle (θ = 0° or 180°)."],
    ["Direction of torque", "Along the bolt’s axis, by the right-hand rule (curl from `vec{r}` to `vec{F}`)."],
    ["Triple scalar product", TSP + ": a number."],
    ["Volume of a parallelepiped", "`|vec{a} · (vec{b} × vec{c})|` = base area `|vec{b} × vec{c}|` × height."],
    ["Coplanar test", TSP + " `= 0` ⇔ the three vectors lie in one plane."],
    ["Order in the triple product", "Cycling keeps the value; swapping two vectors flips the sign."],
    ["Four points coplanar?", "Test `vec{AB} · (vec{AC} × vec{AD}) = 0`."],
    ["Work vs torque", "Work = `vec{F} · vec{d}` (cos θ, a number); torque = `vec{r} × vec{F}` (sin θ, a vector)."]
  ]
};
