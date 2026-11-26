// MCV4U 39 Operations with Vectors in R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/39-operations-in-r3.md
// The scalar is written m (violet, rule 8) so it can't be confused with k⃗ (plan §6.1).
const M1 = "Subtract every component: `6 - (-2) = 8`.";
const M2 = "Square each component, add, then take the root.";
const M3 = "Lengths add only when the vectors point the same way. Add components, then find the length.";
const M4 = "`c^2 = 9` gives `c = 3` <strong>or</strong> `c = -3`: both vectors have the right length.";
const M5 = "Every component must scale by the same `m`, including the sign.";
const M6 = "In ABCD, `vec{AD} = vec{BC}`, so `D = A + C - B`. Draw the vertices in order before you add.";
const M7 = "`m(a, b, c) = (ma, mb, mc)`: every component.";

export default {
  id:"39-operations-in-r3",
  kind:"topic",
  title:"Operations with vectors in R³",
  topic:"Operations with Vectors in R³",
  readyTopic:"operations with vectors in R³",
  hero:{
    eq:'<span class="ops-heq">`(a, b, c) + (d, e, f) = (a + d, b + e, c + f)`<span class="ops-hsep"> · </span>`@a{m}(a, b, c) = (@a{m}a, @a{m}b, @a{m}c)`</span>',
    eqLabel:"a, b, c plus d, e, f equals a plus d, b plus e, c plus f. m times a, b, c equals m a, m b, m c",
    eqSize:"sm",
    headline:"Three components, same rules",
    text:"Everything you did with `(a, b)` works with `(a, b, c)`. <strong>Add</strong> and <strong>subtract</strong> component by component, and <strong>scale</strong> every component. Write vectors with <strong>`vec{i}`, `vec{j}`, `vec{k}`</strong>. Because each component is just a number, the algebra properties hold automatically. Use them to find unknown components and to build 3D shapes.",
    fig:{ html:'<div id="hero-plot" class="ops-hero"></div>' }
  },
  goals:[
    "I can write a 3D vector as `(a, b, c)` and as `a vec{i} + b vec{j} + c vec{k}`.",
    "I can add, subtract and multiply vectors by scalars in R³, and find the magnitudes of the results.",
    "I can find a unit vector, or a vector of a given length, in a given direction.",
    "I can use components to show that the properties of vector addition and scalar multiplication hold in R³.",
    "I can find unknown components from conditions: a magnitude, parallel vectors, or equal vectors.",
    "I can solve 3D geometry problems with vectors: collinear points, midpoints and parallelograms."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Magnitude in R³", goal:2, prompt:"`|(1, -2, 2)| = ?`",
          options:[
            { t:"3", ok:true, why:"`√(1 + 4 + 4)`." },
            { t:"5", why:"That adds the sizes of the components. " + M2 },
            { t:"1", why:"That adds the components: `1 - 2 + 2`. " + M2 },
            { t:"9", why:"That forgets the root: `√9 = 3`." }],
          hints:["Square, add, root.", "`1 + 4 + 4 = 9`.", "3."] },
        { id:"w2", skill:"Magnitude in R³", goal:3, prompt:"`|(6, -6, 7)| = ?`",
          options:[
            { t:"11", ok:true, why:"`√(36 + 36 + 49) = √121`." },
            { t:"19", why:M2 },
            { t:"7", why:"That adds the components: `6 - 6 + 7`. " + M2 },
            { t:"`√49 = 7`", why:"`(-6)^2 = 36`." }],
          hints:["Square each component.", "`36 + 36 + 49`.", "11."] },
        { id:"w3", skill:"Vectors between points", goal:6, prompt:"`A(2, 0, -1)` and `B(5, -4, -1)`. What is `vec{AB}`?",
          options:[
            { t:"`(3, -4, 0)`", ok:true, why:"End minus start: `(5 - 2, -4 - 0, -1 - (-1))`." },
            { t:"`(-3, 4, 0)`", why:"That’s `A - B`. Use end minus start." },
            { t:"`(7, -4, -2)`", why:"That adds the points. Subtract: end minus start." },
            { t:"`(3, -4, -2)`", why:"`-1 - (-1) = 0`." }],
          hints:["End minus start.", "`(5 - 2, -4 - 0, -1 - (-1))`.", "`(3, -4, 0)`."] },
        { id:"w4", skill:"Components in R²", goal:2, prompt:"`3(2, -1) - (4, 5) = ?`",
          options:[
            { t:"`(2, -8)`", ok:true, why:"`(6, -3) - (4, 5)`." },
            { t:"`(2, 2)`", why:"`-3 - 5 = -8`." },
            { t:"`(10, 2)`", why:"That adds instead of subtracting." },
            { t:"`(-2, -6)`", why:"That forgets the 3. Scale first." }],
          hints:["Scale first.", "`(6, -3) - (4, 5)`.", "`(2, -8)`."] },
        { id:"w5", skill:"Components in R²", goal:3, prompt:"What is the unit vector in the direction of `(3, -4)`?",
          options:[
            { t:"`(3/5, -4/5)`", ok:true, why:"`|(3, -4)| = 5`; divide each component by 5." },
            { t:"`(3/7, -4/7)`", why:"That divides by `3 + 4`. Divide by the magnitude, 5." },
            { t:"`(-3/5, 4/5)`", why:"That reverses the direction." },
            { t:"`(3/25, -4/25)`", why:"That divides by `|vec{v}|^2`. Divide by `|vec{v}| = 5`." }],
          hints:["Divide by the magnitude.", "`|(3, -4)| = 5`.", "`(3/5, -4/5)`."] },
        { id:"w6", skill:"Solving for an unknown", goal:5, prompt:"Solve `c^2 + 20 = 36`.",
          options:[
            { t:"`c = 4` or `c = -4`", ok:true, why:"`c^2 = 16`, and both 4 and −4 square to 16." },
            { t:"`c = 4`", why:"`(-4)^2 = 16` too: keep both roots." },
            { t:"`c = 16`", why:"That forgets the root: `c^2 = 16`." },
            { t:"`c = √56`", why:"That adds 20. Subtract it: `c^2 = 36 - 20`." }],
          hints:["Isolate `c^2`.", "`c^2 = 16`.", "±4."] }
      ],
      refreshers:{
        "Magnitude in R³":"`√(a^2 + b^2 + c^2)`; squares of negatives are positive. Example: `|(2, -3, 6)| = √(4 + 9 + 36) = 7`.",
        "Vectors between points":"`vec{AB} = B - A`. Example: from `A(1, 2, 3)` to `B(4, 0, 3)`, `vec{AB} = (3, -2, 0)`.",
        "Components in R²":"Scale every component; add or subtract matching components; unit vector = vector ÷ magnitude. Example: `(6, 8)` has length 10, so its unit vector is `(3/5, 4/5)`.",
        "Solving for an unknown":"`x^2 = k > 0` gives `x = ±√k`. Example: `x^2 = 25` gives `x = 5` or `x = -5`."
      }
    }
  },
  explore:{
    heading:"3D tip-to-tail",
    intro:"Set two vectors and an operation. Rotate the view to see the result from every side, and watch the component staircases add.",
    ui:{
      modes:[{ id:"op", t:"Operate" }, { id:"st", t:"Staircase" }, { id:"pt", t:"Points" }],
      modeHow:{
        op:"Vectors are drawn tip-to-tail from the origin; the result is the thick dark arrow.",
        st:"Each vector is drawn as three steps: `x`, then `y`, then `z`. The result’s staircase (dashed) is the step-by-step sum.",
        pt:"Choose a point, then set its coordinates. D is yours to place: press <strong>Record D</strong> to test it as a fourth vertex."
      },
      ops:[{ id:"add", t:"`vec{u} + vec{v}`" }, { id:"sub", t:"`vec{u} - vec{v}`" }, { id:"mu", t:"`@a{m}vec{u}`" }, { id:"muv", t:"`@a{m}vec{u} + vec{v}`" }, { id:"unit", t:"unit vector of `vec{u}`" }],
      mNote:"`@a{m}` stretches the vector",
      views:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Top" }],
      rotateHow:"Drag the view, or focus it and use the arrow keys, to rotate."
    },
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`vec{u} = (2, -1, 3)`, `vec{v} = (1, 4, -3)`, `vec{u} + vec{v}`. Where will `vec{u} + vec{v}` point?",
        options:[{ t:"Parallel to the `xy`-plane (no `z`-component)", ok:true }, { t:"Straight up the `z`-axis" }, { t:"Into the first octant" }, { t:"Nowhere: it’s `vec{0}`" }],
        explain:"The result is `(3, 3, 0)`, lying flat. `3 + (-3) = 0`, so the sum has no height." },
      { id:"p2", prompt:"`vec{u} = (1, 2, 2)`, operation `@a{m}vec{u}` with `@a{m} = -2`. What is `|-2vec{u}|`?",
        options:[{ t:"6", ok:true }, { t:"−6" }, { t:"3" }, { t:"12" }],
        explain:"The arrow flips and doubles. `|-2| × 3 = 6`. A length is never negative." },
      { id:"p3", prompt:"`vec{u} = (1, 2, 2)`, `vec{v} = (2, -2, 1)`, each of length 3. What is `|vec{u} + vec{v}|`?",
        options:[{ t:"`3√2`", ok:true }, { t:"6" }, { t:"3" }, { t:"18" }],
        explain:"The sum is `(3, 0, 3)`. `√(9 + 0 + 9) = 3√2 ≈ 4.2`, less than `3 + 3`." },
      { id:"p4", prompt:"Points mode: `A(1, 0, 2)`, `B(3, 1, 5)`, `C(7, 3, 11)`. Are A, B and C collinear?",
        options:[{ t:"Yes: `vec{AC} = 3vec{AB}`", ok:true }, { t:"No, the coordinates don’t follow a pattern" }, { t:"Yes, because every coordinate increases" }, { t:"You can’t tell without a graph" }],
        explain:"`vec{AB} = (2, 1, 3)` and `vec{AC} = (6, 3, 9)`: every component is tripled, and they share A." }
    ],
    chalIntro:"Use the 3D view to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Operate mode, `vec{u} = (2, -4, 1)` fixed. Set `vec{v}` so that `vec{u} + vec{v} = 3vec{k}`.",
        why:"`vec{v} = (0, 0, 3) - (2, -4, 1) = (-2, 4, 2)`.",
        hints:["`3vec{k} = (0, 0, 3)`.", "`vec{v} = (0, 0, 3) - (2, -4, 1)`.", "`(-2, 4, 2)`."],
        msgs:{ mode:"Use Operate mode with the operation `vec{u} + vec{v}`.", u:"Set `vec{u} = (2, -4, 1)` first.",
          target:"That’s the target itself. You need target − `vec{u}`.", zonly:"Only the `z`-part changed; `x` and `y` must cancel too.",
          other:"`vec{u} + vec{v}` = {r}. You need `(0, 0, 3)`." } },
      { id:"tc2", goal:3, prompt:"Operate mode, `vec{u} = (1, -2, 2)`, operation `@a{m}vec{u}`. Set `@a{m}` to make a vector of length 6 in the same direction as `vec{u}`.",
        why:"`|vec{u}| = 3`, so `2vec{u} = (2, -4, 4)` has length 6.",
        hints:["Find `|vec{u}|`.", "`|vec{u}| = 3`, so you need twice as long.", "`m = 2`."],
        msgs:{ mode:"Use Operate mode with the operation `@a{m}vec{u}`.", u:"Set `vec{u} = (1, -2, 2)` first.",
          m6:"Length 18: `|vec{u}|` is already 3.", mneg:"Length 6, but the opposite direction.", unit:"That’s the unit vector.",
          other:"Length {L}: `|vec{u}|` is already 3." } },
      { id:"tc3", goal:6, stretch:true, prompt:"Points mode: `A(1, 2, -1)`, `B(4, 0, 1)` and `C(2, 5, 3)` are three vertices of a parallelogram. Place the fourth vertex D. There are three possible positions; find them all.",
        why:"`A + C - B = (-1, 7, 1)`, `A + B - C = (3, -3, -3)` and `B + C - A = (5, 3, 5)`.",
        hints:["Each position comes from choosing which two of A, B, C are opposite corners.", "If B and D are opposite, then `vec{AD} = vec{BC}` and `D = A + C - B`.", "`A + C - B = (-1, 7, 1)`, `A + B - C = (3, -3, -3)`, `B + C - A = (5, 3, 5)`."],
        msgs:{ abc:"Set `A(1, 2, -1)`, `B(4, 0, 1)` and `C(2, 5, 3)` first.", none:"Place D and press <strong>Record D</strong> for each position you find.",
          some:"You’ve found {n} of the 3 positions. Find the others, recording each one.", cb:"That’s the vector `vec{BC}`, placed at the origin. Add it to a vertex.",
          mid:"That’s where the diagonals cross, not a vertex.", found:"✓ D{p} is a fourth vertex. Found {n} of 3.", again:"You already found D{p}. Look for another position.",
          wrong:"D{p} doesn’t make a parallelogram with A, B and C. Opposite sides must be equal vectors." } }
    ]
  },
  part3:{
    slug:"prove", name:"Prove",
    heading:"Prove it with components",
    intro:"Three stations: build two component proofs, then use components to find unknowns. Finish with the quick check.",
    stations:[
      { id:"s1", chip:"Station 1: component proofs", title:"Station 1: component proofs",
        text:"Tap a line, then tap the chip that justifies it. Press <strong>Check proof</strong> when every line has a reason.",
        chips:[
          { id:"defadd", t:"definition of addition" },
          { id:"defmul", t:"definition of scalar multiplication" },
          { id:"comm", t:"real-number addition is commutative" },
          { id:"dist", t:"real-number distributive law" },
          { id:"ex", t:"checked with an example" }],
        trap:"One example shows it can be true, not that it’s always true.",
        proofs:[
          { id:"pa", claim:"`vec{u} + vec{v} = vec{v} + vec{u}`",
            lines:[
              { s:"`vec{u} + vec{v} = (u_1 + v_1, u_2 + v_2, u_3 + v_3)`", k:"defadd", fb:"This line writes the sum in components." },
              { s:"`= (v_1 + u_1, v_2 + u_2, v_3 + u_3)`", k:"comm", fb:"Each component is a sum of two real numbers, and their order was swapped." },
              { s:"`= vec{v} + vec{u}`", k:"defadd", fb:"This line reads the components back as a vector sum." }] },
          { id:"pb", claim:"`m(vec{u} + vec{v}) = mvec{u} + mvec{v}`",
            lines:[
              { s:"`m(vec{u} + vec{v}) = m(u_1 + v_1, u_2 + v_2, u_3 + v_3)`", k:"defadd", fb:"This line writes the sum in components." },
              { s:"`= (m(u_1 + v_1), m(u_2 + v_2), m(u_3 + v_3))`", k:"defmul", fb:"`m` multiplies every component." },
              { s:"`= (mu_1 + mv_1, mu_2 + mv_2, mu_3 + mv_3)`", k:"dist", fb:"Inside each component, a real number multiplies a sum." },
              { s:"`= (mu_1, mu_2, mu_3) + (mv_1, mv_2, mv_3)`", k:"defadd", fb:"This line splits a sum of components into two vectors." },
              { s:"`= mvec{u} + mvec{v}`", k:"defmul", fb:"Each vector here is `m` times every component of `vec{u}` or `vec{v}`." }] }
        ],
        done:"Every line is justified by a definition or a real-number property, so the proof works for every `vec{u}` and `vec{v}`, and in any dimension." },
      { id:"s2", chip:"Station 2: unknown components", title:"Station 2: unknown components",
        text:"Find `c` so that `|(2, c, 6)| = 7`. The sphere holds every point 7 units from O. Slide along the line of points `(2, t, 6)` to <strong>both</strong> places where it meets the sphere.",
        alg:["`2^2 + c^2 + 6^2 = 7^2`", "`4 + c^2 + 36 = 49`", "`c^2 = 9`, so `c = 3` or `c = -3`."] },
      { id:"s3", chip:"Station 3: parallels and midpoints", title:"Station 3: parallels and midpoints",
        text:"First find `p` and `q` so that `(p, 6, q) ∥ (2, -3, 4)`. The arrow turns as you move the sliders and locks when all three ratios match. Then find the midpoint of AB as `A + ½vec{AB}`.",
        alg:["`6 = m(-3)` gives `m = -2`.", "`p = -2 × 2 = -4` and `q = -2 × 4 = -8`.", "Midpoint: `A + ½vec{AB} = (-1, 2, 4) + ½(4, -4, 2) = (1, 0, 5)`."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Prove it with components quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which line proves the first component of `m(vec{u} + vec{v}) = mvec{u} + mvec{v}`?",
          choices:[
            { t:"`m(u_1 + v_1) = mu_1 + mv_1`", ok:true, fb:"Right. The real-number distributive law: `m` multiplies both terms." },
            { t:"`m(u_1 + v_1) = mu_1 + v_1`", fb:"Real-number distributive law: `m` multiplies both terms." },
            { t:"`m(u_1 + v_1) = m + u_1 + v_1`", fb:"Real-number distributive law: `m` multiplies both terms." },
            { t:"`mu_1 + mv_1 = m^2u_1v_1`", fb:"Real-number distributive law: `m` multiplies both terms." }] },
        { id:"q2", goal:5, prompt:"`|(c, 4, 4)| = 9`. `c = ?`",
          choices:[
            { t:"±7", ok:true, fb:"Right. `c^2 = 81 - 32 = 49`, so `c = 7` or `c = -7`." },
            { t:"7", fb:"`c^2 = 81 - 32 = 49`, and −7 works too." },
            { t:"±1", fb:"`c^2 = 81 - 32 = 49`." },
            { t:"`±√113`", fb:"`c^2 = 81 - 32 = 49`." }] },
        { id:"q3", goal:6, prompt:"`A(2, 1, 0)`, `B(4, 5, -2)`. Midpoint of AB?",
          choices:[
            { t:"`(3, 3, -1)`", ok:true, fb:"Right. `A + ½vec{AB} = (2, 1, 0) + (1, 2, -1)`." },
            { t:"`(1, 2, -1)`", fb:"That’s `½vec{AB}`; add it to A." },
            { t:"`(6, 6, -2)`", fb:"That’s `A + B`. Halve it: the midpoint is `A + ½vec{AB}`." },
            { t:"`(2, 4, -2)`", fb:"That’s `vec{AB}`. The midpoint is `A + ½vec{AB}`." }] },
        { id:"q4", goal:5, prompt:"Are `(2, -4, 6)` and `(-3, 6, -9)` parallel?",
          choices:[
            { t:"Yes: `(-3, 6, -9) = -3/2 (2, -4, 6)`", ok:true, fb:"Right. Parallel allows a negative scalar: opposite directions still count." },
            { t:"No, the signs differ", fb:"Parallel allows a negative scalar: opposite directions still count." },
            { t:"No, the magnitudes differ", fb:"Parallel allows a negative scalar: opposite directions still count. Parallel vectors can have any lengths." },
            { t:"Yes, both contain a 6", fb:"Parallel allows a negative scalar, but every component must scale by the same `m`: here `m = -3/2`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"compute", type:"custom", title:"Compute it", summary:"Compute it", goal:[1, 2, 3],
        instruction:"Fill in the components. Fractions such as 2/7 are fine.",
        how:"Type a number in each box, then press Check.",
        items:[
          { id:"c1", goal:2, prompt:"`(2, -1, 3) + (4, 5, -2)`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"6", v2:"4", v3:"1" }, display:"`(6, 4, 1)`", why:"Add matching components: `(2 + 4, -1 + 5, 3 - 2)`." },
          { id:"c2", goal:2, prompt:"`3(1, -2, 0) - 2(2, 1, -4)`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"-1", v2:"-8", v3:"8" }, display:"`(-1, -8, 8)`", why:"`(3, -6, 0) - (4, 2, -8) = (-1, -8, 8)`.",
            wrong:[{ v:{ v1:"-1", v2:"-8", v3:"-8" }, fb:"`-2 × (-4) = +8`." }] },
          { id:"c3", goal:2, prompt:"`|(4, -4, 2)|`", rows:[{ t:"num", k:"n", pre:"=" }],
            answer:{ n:"6" }, display:"6", why:"`√(16 + 16 + 4) = √36 = 6`.",
            wrong:[{ v:{ n:"10" }, fb:M2 }, { v:{ n:"2" }, fb:M2 }, { v:{ n:"36" }, fb:"That’s `|vec{v}|^2`. Take the root." }] },
          { id:"c4", goal:1, prompt:"`(2vec{i} - 3vec{j} + vec{k}) - (vec{i} + vec{j} - 2vec{k})`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"1", v2:"-4", v3:"3" }, display:"`(1, -4, 3)`", why:"`(2, -3, 1) - (1, 1, -2) = (1, -4, 3)`.",
            wrong:[{ v:{ v1:"1", v2:"-4", v3:"-1" }, fb:"`vec{k}` parts: `1 - (-2) = 3`." }] },
          { id:"c5", goal:3, prompt:"Unit vector in the direction of `(2, -3, 6)`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"2/7", v2:"-3/7", v3:"6/7" }, display:"`(2/7, -3/7, 6/7)`", why:"`|(2, -3, 6)| = √49 = 7`; divide each component by 7.",
            wrong:[{ v:{ v1:"2/11", v2:"-3/11", v3:"6/11" }, fb:"Divide by the magnitude, 7, not by `2 + 3 + 6`." }, { v:{ v1:"2/49", v2:"-3/49", v3:"6/49" }, fb:"That divides by `|vec{v}|^2`. Divide by 7." }] },
          { id:"c6", goal:3, prompt:"The vector of length 5 opposite in direction to `(6, 0, -8)`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"-3", v2:"0", v3:"4" }, display:"`(-3, 0, 4)`", why:"`|(6, 0, -8)| = 10`, so take `-½(6, 0, -8)`.",
            wrong:[{ v:{ v1:"3", v2:"0", v3:"-4" }, fb:"Same direction; you need the opposite." }, { v:{ v1:"-6", v2:"0", v3:"8" }, fb:"Opposite, but length 10. You need length 5." }],
            hints:["Find `|(6, 0, -8)|`.", "It’s 10, so you need half the length, reversed.", "`-½(6, 0, -8) = (-3, 0, 4)`."] },
          { id:"c7", goal:2, prompt:"`vec{AB}` and `|vec{AB}|` for `A(-1, 2, 4)`, `B(3, -2, 6)`", rows:[{ t:"vec", k:"v", pre:"`vec{AB} =`" }, { t:"num", k:"n", pre:"`|vec{AB}| =`" }],
            answer:{ v1:"4", v2:"-4", v3:"2", n:"6" }, display:"`vec{AB} = (4, -4, 2)`; `|vec{AB}| = 6`", why:"End minus start, then `√(16 + 16 + 4) = 6`.",
            wrong:[{ v:{ v1:"-4", v2:"4", v3:"-2" }, fb:"That’s `A - B`. Use end minus start." }, { v:{ n:"10" }, fb:M2 }] },
          { id:"c8", goal:2, prompt:"`½(vec{u} + vec{v})` for `vec{u} = (3, 5, -1)`, `vec{v} = (1, -1, 7)`", rows:[{ t:"vec", k:"v", pre:"=" }],
            answer:{ v1:"2", v2:"2", v3:"3" }, display:"`(2, 2, 3)`", why:"`vec{u} + vec{v} = (4, 4, 6)`; halve every component.",
            wrong:[{ v:{ v1:"4", v2:"4", v3:"6" }, fb:"Halve the sum. " + M7 }] }
        ] },
      { id:"unknowns", type:"custom", title:"Unknowns and geometry", summary:"Unknowns and geometry", star:true, goal:[5, 6],
        instruction:"Find each exact answer. Items 3 to 6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        how:"Type numbers (fractions are fine). Where there may be more than one answer, list them all, separated by commas.",
        items:[
          { id:"s1", goal:5, prompt:"Find `a` and `b`: `(a, 3, -2) + (4, b, 5) = (1, -1, 3)`", rows:[{ t:"num", k:"a", pre:"`a =`" }, { t:"num", k:"b", pre:"`b =`" }],
            answer:{ a:"-3", b:"-4" }, display:"`a = -3`, `b = -4`", why:"Equal vectors have equal components: `a + 4 = 1` and `3 + b = -1`.",
            wrong:[{ v:{ a:"5", b:"2" }, fb:"Equal components: `a + 4 = 1`, so subtract 4." }] },
          { id:"s2", goal:5, prompt:"Find every `k`: `|(k, k, 2)| = 6`", rows:[{ t:"list", k:"k", pre:"`k =`" }],
            answer:{ k:"4, -4" }, display:"`k = 4` or `k = -4`", why:"`2k^2 + 4 = 36`, so `k^2 = 16`.",
            wrong:[{ v:{ k:"√32, -√32" }, fb:"`2k^2 = 32`, so `k^2 = 16`." }, { v:{ k:"4" }, fb:"`k^2 = 16` gives `k = 4` <strong>or</strong> `k = -4`." }, { v:{ k:"-4" }, fb:"`k^2 = 16` gives `k = 4` <strong>or</strong> `k = -4`." }] },
          { id:"s3", goal:5, star:true, prompt:"Find `p` and `q` so that `(p, 6, q)` is parallel to `(2, -3, 4)`.", rows:[{ t:"num", k:"p", pre:"`p =`" }, { t:"num", k:"q", pre:"`q =`" }],
            answer:{ p:"-4", q:"-8" }, display:"`p = -4`, `q = -8`", why:"`(p, 6, q) = -2(2, -3, 4)`.",
            wrong:[{ v:{ p:"4", q:"8" }, fb:"`6 = m(-3)` gives `m = -2`. " + M5 }] },
          { id:"s4", goal:6, star:true, prompt:"`A(2, -1, 3)`, `B(5, 1, 2)` and `C(11, 5, 0)` are collinear. Find `t` so that `P(t, 3, 1)` is on the same line.", rows:[{ t:"num", k:"t", pre:"`t =`" }],
            answer:{ t:"8" }, display:"`t = 8`", why:"`vec{AP} = (6, 4, -2) = 2vec{AB}`.",
            wrongDefault:"`vec{AP} = (t - 2, 4, -2)` must equal `2vec{AB} = (6, 4, -2)`.",
            hints:["`vec{AB} = (3, 2, -1)`.", "The `y`-step from A to P is 4, which is `2 × 2`, so `vec{AP} = 2vec{AB}`.", "`t - 2 = 6`: `t = 8`. Check `z`: `-2 = 2(-1)`."] },
          { id:"s5", goal:6, star:true, prompt:"Parallelogram ABCD (in order): `A(1, 0, 2)`, `B(4, 1, -1)`, `D(0, 3, 5)`. Find C.", rows:[{ t:"vec", k:"v", pre:"C =" }],
            answer:{ v1:"3", v2:"4", v3:"2" }, display:"`C(3, 4, 2)`", why:"`vec{BC} = vec{AD}`, so `C = B + D - A`.",
            wrong:[{ v:{ v1:"-3", v2:"2", v3:"8" }, fb:"That’s `A + D - B`; you need `B + D - A`." }, { v:{ v1:"5", v2:"-2", v3:"-4" }, fb:"That’s `A + B - D`. " + M6 }] },
          { id:"s6", goal:5, star:true, prompt:"Find every point on the `x`-axis that is 7 units from `Q(3, 2, -6)`.", rows:[{ t:"list", k:"x", pre:"Points `(x, 0, 0)` with `x =`" }],
            answer:{ x:"0, 6" }, display:"`(0, 0, 0)` and `(6, 0, 0)`", why:"`(x - 3)^2 + 4 + 36 = 49`, so `(x - 3)^2 = 9`.",
            wrong:[{ v:{ x:"6" }, fb:"`(x - 3)^2 = 9` gives `x - 3 = ±3`." }, { v:{ x:"0" }, fb:"`(x - 3)^2 = 9` gives `x - 3 = ±3`." }],
            hints:["A point on the `x`-axis is `(x, 0, 0)`.", "`(x - 3)^2 + 4 + 36 = 49`.", "`(x - 3)^2 = 9`: `x = 0` or 6."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Mason", how:"", goal:[2, 5, 6],
        instruction:"Mason made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"`vec{u} = (3, -1, 2)` and `vec{v} = (-2, 4, 1)`. Find `|2vec{u} - vec{v}|`.",
            steps:["`2vec{u} = (6, -2, 4)`", "`2vec{u} - vec{v} = (6 - 2, -2 - 4, 4 - 1)`", "`= (4, -6, 3)`", "`|2vec{u} - vec{v}| = √(16 + 36 + 9) = √61`"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows."],
            fixes:[
              { t:"`6 - (-2) = 8`: `2vec{u} - vec{v} = (8, -6, 3)`, so its length is `√109`.", ok:true, why:M1 },
              { t:"`(6 + 2, -2 + 4, 4 + 1) = (8, 2, 5)`.", why:"Subtract every component of `vec{v}`, not just fix the first." },
              { t:"`|2vec{u}| - |vec{v}| = 2√14 - √21`.", why:"Magnitudes don’t subtract." },
              { t:"Step 2 is correct.", why:"Subtracting −2 adds 2." }],
            hints:["What is the first component of `vec{v}`?", "−2, so `6 - (-2)`.", "`(8, -6, 3)`, `√109`."] },
          { id:"e2", goal:5, task:"Find every `c` so that `|(2, c, 6)| = 7`.",
            steps:["`2^2 + c^2 + 6^2 = 7`", "`4 + c^2 + 36 = 7`, so `c^2 = -33`", "No real number squares to −33.", "So no such `c` exists."],
            answer:0,
            stepFb:["", "Step 2 follows step 1’s equation.", "True, but it comes from the earlier mistake.", "Step 4 follows."],
            fixes:[
              { t:"Square the magnitude too: `4 + c^2 + 36 = 49`, so `c^2 = 9` and `c = 3` or `c = -3`.", ok:true, why:"`|vec{v}| = 7` means `|vec{v}|^2 = 49`. " + M4 },
              { t:"`2 + c + 6 = 7`, so `c = -1`.", why:"Components don’t add to the magnitude." },
              { t:"`c^2 = 49 - 40 = 9`, so `c = 3`.", why:"`c = -3` works too." },
              { t:"Step 1 is correct.", why:"`|vec{v}|^2 = 49`, not 7." }],
            hints:["`|vec{v}| = 7` means `|vec{v}|^2 = ?`", "49.", "`c = ±3`."] },
          { id:"e3", goal:6, task:"`A(1, 2, 3)`, `B(2, 0, 5)` and `C(4, 1, 1)` are three vertices of parallelogram ABCD (in order). Find D.",
            steps:["In parallelogram ABCD, `vec{AB} = vec{DC}`.", "`vec{AB} = (1, -2, 2)`", "`D = C + vec{AB} = (5, -1, 3)`", "So `D(5, -1, 3)`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"`vec{DC} = C - D`, so `D = C - vec{AB} = (3, 3, -1)`.", ok:true, why:"Check: `vec{AD} = (2, 1, -4) = vec{BC}`." },
              { t:"`D = A + B - C = (-1, 1, 7)`.", why:"That makes C and D opposite corners: parallelogram ACBD, not ABCD." },
              { t:"`D = (A + C)/2 = (2.5, 1.5, 2)`.", why:"That’s the centre, not a vertex." },
              { t:"Step 3 is correct.", why:"Adding `vec{AB}` to C moves away from D." }],
            hints:["`vec{DC} = C - D`.", "`C - D = vec{AB}`, so `D = C - vec{AB}`.", "`(3, 3, -1)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: three possible fourth vertices, or how the staircases add?" },
      { id:"j2", q:"In your own words, why does a component proof of `vec{u} + vec{v} = vec{v} + vec{u}` work in any dimension?" },
      { id:"j3", q:"Explain to a friend how to find `c` when `|(2, c, 6)| = 7`, and why there are two answers." },
      { id:"j4", q:"Which 3D vector skill still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"`(3, -2, 5) - (1, 4, -2) = ?`", options:[
          { t:"`(2, -6, 7)`", ok:true, why:"Subtract matching components: `5 - (-2) = 7`." },
          { t:"`(2, -6, 3)`", why:"`5 - (-2) = 7`." },
          { t:"`(4, 2, 3)`", why:"Subtract, don’t add." },
          { t:"`(-2, 6, -7)`", why:"That’s the second minus the first." }] },
        b:{ prompt:"`(-1, 4, 2) - (3, -2, 6) = ?`", options:[
          { t:"`(-4, 6, -4)`", ok:true, why:"Subtract matching components: `4 - (-2) = 6`." },
          { t:"`(-4, 2, -4)`", why:"`4 - (-2) = 6`." },
          { t:"`(2, 2, 8)`", why:"Subtract, don’t add." },
          { t:"`(4, -6, 4)`", why:"Reversed order." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What is the unit vector in the direction of `(-2, 1, 2)`?", options:[
          { t:"`(-2/3, 1/3, 2/3)`", ok:true, why:"Divide by `|vec{v}| = 3`." },
          { t:"`(-2/5, 1/5, 2/5)`", why:"Divide by the magnitude, not `2 + 1 + 2`." },
          { t:"`(2/3, -1/3, -2/3)`", why:"Same length, opposite direction." },
          { t:"`(-2/9, 1/9, 2/9)`", why:"That divides by `|vec{v}|^2`." }] },
        b:{ prompt:"What is the unit vector in the direction of `(6, -2, 3)`?", options:[
          { t:"`(6/7, -2/7, 3/7)`", ok:true, why:"Divide by `|vec{v}| = √49 = 7`." },
          { t:"`(6/11, -2/11, 3/11)`", why:"Divide by the magnitude, not `6 + 2 + 3`." },
          { t:"`(-6/7, 2/7, -3/7)`", why:"Opposite direction." },
          { t:"`(6/49, -2/49, 3/49)`", why:"Divide by 7, not 49." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Write `4vec{i} - vec{k}` in component form.", options:[
          { t:"`(4, 0, -1)`", ok:true, why:"There’s no `vec{j}` term, so the `y`-component is 0." },
          { t:"`(4, -1, 0)`", why:"`vec{k}` is the `z`-direction." },
          { t:"`(4, -1)`", why:"R³ vectors have three components." },
          { t:"`(4, 0, 1)`", why:"The `vec{k}` term is negative." }] },
        b:{ prompt:"Write `-vec{j} + 3vec{k}` in component form.", options:[
          { t:"`(0, -1, 3)`", ok:true, why:"There’s no `vec{i}` term, so the `x`-component is 0." },
          { t:"`(-1, 3, 0)`", why:"The first component is the `vec{i}` part, which is 0." },
          { t:"`(-1, 3)`", why:"Three components." },
          { t:"`(0, 1, 3)`", why:"The `vec{j}` term is negative." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Find `a` and `b` so that `(a, -6, 4)` is parallel to `(3, b, -2)`.", options:[
          { t:"`a = -6`, `b = 3`", ok:true, why:"`4 = m(-2)` gives `m = -2`; `a = -6` and `-6 = -2b`." },
          { t:"`a = 6`, `b = -3`", why:"The scalar is −2, not 2." },
          { t:"`a = -6`, `b = -3`", why:"`-6 = -2b` gives `b = 3`." },
          { t:"`a = 3`, `b = -6`", why:"Parallel doesn’t mean swapping components." }] },
        b:{ prompt:"Find `a` and `b` so that `(4, a, -6)` is parallel to `(b, -3, 3)`.", options:[
          { t:"`a = 6`, `b = -2`", ok:true, why:"`-6 = 3m` gives `m = -2`." },
          { t:"`a = -6`, `b = 2`", why:M5 + " Here `m = -2`." },
          { t:"`a = 6`, `b = 2`", why:"`4 = -2b` gives `b = -2`." },
          { t:"`a = -3`, `b = 4`", why:"Parallel isn’t swapping." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"`A(2, -1, 0)`, `B(4, 3, -2)` and `C(8, 11, -6)`. Which is true?", options:[
          { t:"They’re collinear, and `vec{AC} = 3vec{AB}`", ok:true, why:"`vec{AB} = (2, 4, -2)`, `vec{AC} = (6, 12, -6)`." },
          { t:"They’re collinear, and `vec{AC} = 2vec{AB}`", why:"`vec{BC} = 2vec{AB}`; `vec{AC}` is the whole trip, `3vec{AB}`." },
          { t:"They’re not collinear: `z` decreases while `x` and `y` increase", why:"Components can change in different directions along a line." },
          { t:"They’re collinear only if they lie on an axis", why:"Any three points with `vec{AC} = mvec{AB}` are collinear." }] },
        b:{ prompt:"`P(1, 2, 3)`, `Q(0, 4, 2)` and `R(-2, 8, 0)`. Which is true?", options:[
          { t:"They’re collinear, and `vec{PR} = 3vec{PQ}`", ok:true, why:"`vec{PQ} = (-1, 2, -1)`, `vec{PR} = (-3, 6, -3)`." },
          { t:"They’re collinear, and `vec{PR} = 2vec{PQ}`", why:"`vec{QR} = 2vec{PQ}`; `vec{PR}` is the whole trip, `3vec{PQ}`." },
          { t:"They’re not collinear: `x` and `z` decrease while `y` increases", why:"Components can change in different directions along a line." },
          { t:"They’re collinear only if they lie on an axis", why:"Any three points with `vec{PR} = mvec{PQ}` are collinear." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Find every point on the `y`-axis that is 3 units from `Q(2, 1, -1)`.", options:[
          { t:"`(0, 3, 0)` and `(0, -1, 0)`", ok:true, why:"`4 + (y - 1)^2 + 1 = 9`, so `(y - 1)^2 = 4`." },
          { t:"`(0, 3, 0)` only", why:"`(y - 1)^2 = 4` gives `y - 1 = 2` <strong>or</strong> `y - 1 = -2`." },
          { t:"`(0, 1 + √5, 0)` and `(0, 1 - √5, 0)`", why:"The `z`-difference `(-1)^2 = 1` must be included too." },
          { t:"None: Q is too far from the `y`-axis", why:"Q is `√5 ≈ 2.2` from the axis, less than 3." }] },
        b:{ prompt:"Find every point on the `z`-axis that is 7 units from `Q(3, -2, 4)`.", options:[
          { t:"`(0, 0, 10)` and `(0, 0, -2)`", ok:true, why:"`9 + 4 + (z - 4)^2 = 49`." },
          { t:"`(0, 0, 10)` only", why:"`(z - 4)^2 = 36` gives `z - 4 = 6` <strong>or</strong> `z - 4 = -6`." },
          { t:"`(0, 0, 4 ± 2√10)`", why:"Include the `y`-difference: `(-2)^2 = 4`." },
          { t:"None", why:"Q is `√13 ≈ 3.6` from the axis, less than 7." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best proof that `vec{u} + vec{v} = vec{v} + vec{u}` for vectors in R³?", options:[
          { t:"“`vec{u} + vec{v} = (u_1 + v_1, u_2 + v_2, u_3 + v_3) = (v_1 + u_1, v_2 + u_2, v_3 + u_3) = vec{v} + vec{u}`, because real-number addition is commutative in each component.”", ok:true, why:"Each step is a definition or a real-number property, so it holds for every pair of vectors." },
          { t:"“For `vec{u} = (1, 2, 3)` and `vec{v} = (4, 5, 6)`, both sides give `(5, 7, 9)`.”", why:"One example isn’t a proof." },
          { t:"“`|vec{u} + vec{v}| = |vec{v} + vec{u}|`, so the vectors are equal.”", why:"Equal lengths don’t make equal vectors." },
          { t:"“All vector operations can be done in any order.”", why:"Subtraction can’t." }] },
        b:{ prompt:"Which is the best proof that `m(vec{u} + vec{v}) = mvec{u} + mvec{v}` in R³?", options:[
          { t:"“`m(vec{u} + vec{v}) = (m(u_1 + v_1), …) = (mu_1 + mv_1, …) = mvec{u} + mvec{v}`, using the real-number distributive law in each component.”", ok:true, why:"Each step is a definition or a real-number property." },
          { t:"“For `m = 2`, `vec{u} = (1, 0, 0)` and `vec{v} = (0, 1, 0)`, both sides give `(2, 2, 0)`.”", why:"One example." },
          { t:"“Both sides have the same magnitude.”", why:"Not enough." },
          { t:"“Multiplication always distributes over everything.”", why:"Over-general." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which correctly describes how to find D in parallelogram ABCD (vertices in order) from A, B and C?", options:[
          { t:"“Opposite sides are equal vectors, so `vec{AD} = vec{BC}`; then `D = A + vec{BC} = A + C - B`.”", ok:true, why:"Opposite sides of a parallelogram are equal vectors." },
          { t:"“D is the midpoint of AC.”", why:"That’s where the diagonals cross." },
          { t:"“`D = A + B - C`, because the sides add up.”", why:M6 },
          { t:"“`D = C + vec{AB}`, because `vec{AB}` and `vec{CD}` are parallel.”", why:"`vec{CD} = -vec{AB}`: it points the other way." }] },
        b:{ prompt:"Which correctly describes how to show that A, B and C are collinear?", options:[
          { t:"“Find `vec{AB}` and `vec{AC}`. If `vec{AC} = mvec{AB}` for some scalar `m`, the vectors are parallel and share the point A, so A, B and C lie on one line.”", ok:true, why:"Parallel and sharing a point means one line." },
          { t:"“Show that `vec{AB}` and `vec{AC}` have the same magnitude.”", why:"Equal lengths don’t make points line up." },
          { t:"“Show that two of the coordinates change in the same pattern.”", why:"All three components must scale together." },
          { t:"“Show that `vec{AB}` is parallel to any vector.”", why:"Parallel to `vec{AC}`, and sharing a point." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A drone starts at `O(0, 0, 0)` (metres; `x` east, `y` north, `z` up). It flies `(8, -2, 1)`, then flies `(-2, 2, 1)` three times. How far is it from O?", options:[
          { t:"6 m", ok:true, why:"`(8, -2, 1) + (-6, 6, 3) = (2, 4, 4)`; `√(4 + 16 + 16) = 6`." },
          { t:"10 m", why:"`2 + 4 + 4` isn’t a length." },
          { t:"`2√10` m", why:"Fly the second leg three times." },
          { t:"`√69 + 9` m", why:"That adds the lengths of the legs. " + M3 }] },
        b:{ prompt:"A drone starts at `O(0, 0, 0)` (metres; `x` east, `y` north, `z` up). It flies `(4, -1, 2)`, then flies `(-1, 2, 2)` twice. How far is it from O?", options:[
          { t:"7 m", ok:true, why:"`(4, -1, 2) + (-2, 4, 4) = (2, 3, 6)`; `√(4 + 9 + 36) = 7`." },
          { t:"11 m", why:"`2 + 3 + 6` isn’t a length." },
          { t:"`√26` m", why:"Fly the second leg twice." },
          { t:"`√21 + 6` m", why:"That adds the lengths of the legs. " + M3 }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A solar-panel frame is parallelogram ABCD (vertices in order) with `A(1, 1, 0)`, `B(3, 1, 0)` and `C(3, 4, 6)`, in metres. Find D and the length of the diagonal AC.", options:[
          { t:"`D(1, 4, 6)`; AC = 7 m", ok:true, why:"`D = A + C - B`; `vec{AC} = (2, 3, 6)`." },
          { t:"`D(1, -2, -6)`; AC = 7 m", why:"That’s `A + B - C`. " + M6 },
          { t:"`D(1, 4, 6)`; AC = 11 m", why:"`2 + 3 + 6` isn’t a length. " + M2 },
          { t:"`D(5, 4, 6)`; AC = 7 m", why:"`B + C - A` is a vertex of parallelogram ABDC, not ABCD." }] },
        b:{ prompt:"A solar-panel frame is parallelogram ABCD (vertices in order) with `A(2, 0, 1)`, `B(2, 3, 1)` and `C(4, 3, 7)`, in metres. Find D and the length of the diagonal AC.", options:[
          { t:"`D(4, 0, 7)`; AC = 7 m", ok:true, why:"`D = A + C - B`; `vec{AC} = (2, 3, 6)`." },
          { t:"`D(0, 0, -5)`; AC = 7 m", why:"That’s `A + B - C`. " + M6 },
          { t:"`D(4, 0, 7)`; AC = 11 m", why:"`2 + 3 + 6` isn’t a length. " + M2 },
          { t:"`D(4, 6, 7)`; AC = 7 m", why:"Wrong vertex order: that’s `B + C - A`." }] } }
    ]
  },
  task:{
    title:"Square in space", summary:"Square in space",
    statement:"<p>`vec{u} = (2, -1, 2)` is one side of a quadrilateral with a corner at the origin. Choose the other side `vec{v}` so that every condition is met. Find all the answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`|vec{v}| = 3`.</li><li>The parallelogram on `vec{u}` and `vec{v}` has equal diagonals: `|vec{u} + vec{v}| = |vec{u} - vec{v}|`.</li><li>The far corner, `vec{u} + vec{v}`, is above the `xy`-plane.</li></ol></div>",
    checks:["`|vec{v}| = 3`", "Equal diagonals", "Far corner above the `xy`-plane"],
    tips:["Whole-number vectors of length 3 look like `(1, 2, 2)` or `(3, 0, 0)`, with any order and signs.",
      "Expand both squared diagonals in components. Their difference is `4(2a - b + 2c)`, so that must be 0.",
      "The far corner’s height is `2 + c`."],
    explainPrompt:"Explain why equal diagonals turned into the condition `2a - b + 2c = 0`, and what shape you built.",
    vocab:"Use the words component, magnitude and diagonal.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"`(1, -2, -2)` also gives equal diagonals, but its far corner is `(3, -3, 0)`, on the floor, not above it."
  },
  cards:[
    ["`vec{i}`, `vec{j}`, `vec{k}`", "`(1, 0, 0)`, `(0, 1, 0)`, `(0, 0, 1)`."],
    ["Component form", "`a vec{i} + b vec{j} + c vec{k} = (a, b, c)`."],
    ["Adding in R³", "Add matching components."],
    ["Scalar multiple", "`m(a, b, c) = (ma, mb, mc)`; `|mvec{u}| = |m||vec{u}|`."],
    ["Unit vector", "`vec{u}/|vec{u}|`, e.g. `(2, -3, 6)/7`."],
    ["Vector of length `L` along `vec{u}`", "`(L/|vec{u}|)vec{u}`."],
    ["Component proof", "Each component is a real number, so real-number properties carry over."],
    ["Unknown from a magnitude", "Square both sides; expect ± answers."],
    ["Parallel in R³", "`vec{v} = mvec{u}`: all three components scale by the same `m`."],
    ["Collinear points", "`vec{AC} = mvec{AB}`."],
    ["Midpoint", "`A + ½vec{AB} = ((x_1 + x_2)/2, (y_1 + y_2)/2, (z_1 + z_2)/2)`."],
    ["Parallelogram ABCD", "`D = A + C - B` (since `vec{AD} = vec{BC}`)."]
  ]
};
