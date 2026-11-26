// MCV4U 37 Vectors in R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/37-vectors-in-r3.md
// misconception core sentences (plan §3)
const M1 = "Curl your right hand from +`x` to +`y`: your thumb is +`z`. Swapping `x` and `y` flips the system.";
const M2 = "Square, add, then take the root: `√{4 + 9 + 36} = 7`. Length isn’t the sum of the steps.";
const M3 = "`vec{AB}` goes <strong>from</strong> A <strong>to</strong> B: end minus start, B − A.";
const M4 = "One equation fixes one coordinate; the other two are free. Two free coordinates make a plane.";
const M5 = "A zero coordinate puts the point <strong>on</strong> a coordinate plane, between octants.";
const M6 = "`(-6)^2 = (-6)(-6) = 36`. Squares are never negative.";
const M7 = "A hook above the ground has `h > 0`; reject the negative root.";
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

// Practice 1 items: point, box, feedback if misplaced (sent to every other box)
const BOXES = ["b1", "b2", "b3", "b4"];
function sortItem(id, pt, box, fb, extra){
  const wrong = {}; BOXES.filter(b => b !== box).forEach(b => { wrong[b] = fb; });
  return Object.assign({ id, t:pt, answer:box, why:fb, wrong }, extra || {});
}

export default {
  id:"37-vectors-in-r3",
  kind:"topic",
  title:"Vectors in R³",
  topic:"Vectors in R³",
  readyTopic:"vectors in R³",
  hero:{
    eq:"P(`x`, `y`, `z`) · `|vec{OP}| = √{x^2 + y^2 + z^2}`",
    eqLabel:"The point P with coordinates x, y, z. The magnitude of vector O P equals the square root of x squared plus y squared plus z squared.",
    eqSize:"md",
    headline:"One more axis, one more square",
    text:"Add a third axis and every point gets three <strong>coordinates</strong>. Arrows from the origin are <strong>position vectors</strong>. Their lengths still come from <strong>Pythagoras</strong>, used twice: once across the floor and once up. Points split space into eight <strong>octants</strong>. A single equation like `z = 0` is now a whole <strong>plane</strong>.",
    fig:{ html:'<div class="v3-hero"><svg class="v3-svg" id="v3-hero" viewBox="0 0 360 360" role="img" aria-label="A dot moves from the origin 2 along x, 3 parallel to y and 6 up parallel to z, outlining a box. The floor diagonal is the square root of 13 and the space diagonal from O to P(2, 3, 6) is 7." focusable="false"></svg></div>' }
  },
  goals:[
    "I can plot and read points in a right-handed 3D coordinate system, including points on the axes and coordinate planes.",
    "I can name the octant, coordinate plane or axis a point lies on from its coordinates.",
    "I can find the magnitude of a vector `(a, b, c)` using `√{a^2 + b^2 + c^2}`.",
    "I can find `vec{AB}` = B − A and the distance between two points in R³.",
    "I can describe the points that satisfy an equation such as `z = 2` or `x = -1` in R³, and compare with R².",
    "I can solve problems with 3D positions, including finding an unknown coordinate."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Distance in R²", goal:4, prompt:"How far apart are A(1, 2) and B(4, 6)?",
          options:[
            { t:"5", ok:true, why:"`√{3^2 + 4^2} = 5`." },
            { t:"7", why:"3 + 4 is the walking distance along the grid." },
            { t:"25", why:"Take `√25`." },
            { t:"`√89`", why:"Subtract: 4 − 1 and 6 − 2." }],
          hints:["Find the run and the rise.", "Run 3, rise 4.", "`√{9 + 16} = 5`."] },
        { id:"w2", skill:"Distance in R²", goal:4, prompt:"How far is P(−5, 12) from the origin?",
          options:[
            { t:"13", ok:true, why:"`√{25 + 144} = 13`." },
            { t:"7", why:"Square each coordinate first." },
            { t:"`√119`", why:"`(-5)^2 = 25`." },
            { t:"17", why:"Lengths don’t add." }],
          hints:["Square both coordinates.", "25 + 144 = 169.", "13."] },
        { id:"w3", skill:"Pythagoras", goal:3, prompt:"A rectangle is 6 m by 8 m. How long is its diagonal?",
          options:[
            { t:"10 m", ok:true, why:"`√{36 + 64} = √100 = 10`." },
            { t:"14 m", why:"That’s half the perimeter." },
            { t:"48 m", why:"Area isn’t a length." },
            { t:"`√28` m", why:"Square each side: 36 + 64." }],
          hints:["The diagonal is a hypotenuse.", "36 + 64 = 100.", "10 m."] },
        { id:"w4", skill:"Pythagoras", goal:3, prompt:"A right triangle has legs 5 and `√11`. How long is the hypotenuse?",
          options:[
            { t:"6", ok:true, why:"25 + 11 = 36." },
            { t:"5 + `√11`", why:"Square, add, root." },
            { t:"`√14`", why:"The hypotenuse is the longest side: add the squares." },
            { t:"36", why:"Take the square root: `√36 = 6`." }],
          hints:["`c^2 = a^2 + b^2`.", "`(√11)^2 = 11`.", "`√36 = 6`."] },
        { id:"w5", skill:"Lines in R²", goal:5, prompt:"In the `xy`-plane, what are all the points with `x = 3`?",
          options:[
            { t:"A vertical line through (3, 0)", ok:true, why:"`y` can be anything." },
            { t:"A horizontal line through (0, 3)", why:"That’s `y = 3`." },
            { t:"The single point (3, 3)", why:"Only `x` is fixed." },
            { t:"Only the point (3, 0)", why:"`y` isn’t forced to be 0." }],
          hints:["Which coordinate is fixed? Which is free?", "`x = 3`, `y` free.", "A vertical line."] },
        { id:"w6", skill:"Vectors between points", goal:4, prompt:"A(1, 2) and B(4, −2). In grid steps (right, up), what is `vec{AB}`?",
          options:[
            { t:"(3, −4)", ok:true, why:"End minus start: (4 − 1, −2 − 2)." },
            { t:"(−3, 4)", why:"That’s `vec{BA}`." },
            { t:"(5, 0)", why:"That adds the coordinates. Subtract: end minus start." },
            { t:"(3, 4)", why:"−2 − 2 = −4." }],
          hints:["From A to B: end minus start.", "4 − 1 and −2 − 2.", "(3, −4)."] }
      ],
      refreshers:{
        "Distance in R²":"`√{(x_2 - x_1)^2 + (y_2 - y_1)^2}`: subtract, square, add, root.",
        "Pythagoras":"`c^2 = a^2 + b^2` for the hypotenuse `c`. Squares of negatives are positive.",
        "Lines in R²":"`x = 3` fixes `x` and leaves `y` free: a vertical line.",
        "Vectors between points":"`vec{AB}` = B − A: subtract the start from the end."
      }
    }
  },
  explore:{
    heading:"3D point plotter",
    intro:"Move the point with the three sliders. Rotate the view to check where it really is: one flat picture can fool you.",
    modes:[{ id:"pt", t:"Point" }, { id:"two", t:"Two points" }, { id:"pl", t:"Planes (first look)" }],
    presets:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front (`xz`)" }, { id:"side", t:"Side (`yz`)" }, { id:"top", t:"Top (`xy`)" }],
    eqs:[{ id:"x", t:"`x = c`" }, { id:"y", t:"`y = c`" }, { id:"z", t:"`z = c`" }],
    txt:{
      mode:"Mode", view:"View", reset:"Reset view", lock:"Lock view",
      viewNote:"Drag the picture (or focus it and use the arrow keys; Shift for bigger steps) to rotate. Lock the view to scroll the page on a phone.",
      toggles:{ box:"Show box", vec:"Show position vector", sh:"Show shadows", oct:"Shade octant" },
      eqH:"Equation", cLab:"`c`",
      key:"Axes in grey, negative halves dashed; far parts are fainter. The box is dashed; vectors are blue.",
      rows:{ point:"Point", loc:"Location", pv:"Position vector", floor:"Floor diagonal", mag:"`|vec{OP}|`",
        a:"A", b:"B", ab:"`vec{AB}`", dist:"AB", sat:"Equation" },
      first:"First octant", octant:"Octant", origin:"At the origin", onAxis:"On the {a}-axis", onPlane:"On the {p}-plane ({e})",
      sat:"P satisfies {e} ✓", notSat:"P doesn’t satisfy {e}: its {v} is {n}",
      hidden:"Readout hidden until the reveal.",
      r2r3:"In R³, {e3} is a plane; in R², {e2} would be a line.",
      r2H:"R² vs R³: the same equation on a flat grid", r2Fig:"Flat grid with the line {e2}.",
      found:"Challenge 3 tracker: found {n} of 12", foundNone:"none yet", complete:"<strong>Complete set!</strong> All 12 orders of (1, 4, 8), (4, 4, 7) and (3, 6, 6).",
      aH:"Point A", bH:"Point B", pH:"Point P"
    },
    predIntro:"Make a prediction first. Then the 3D plotter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Before moving the sliders: where is the point (0, 4, 0)?",
        options:[{ t:"On the `y`-axis", ok:true }, { t:"In the first octant" }, { t:"On the `z`-axis" }, { t:"On the `xz`-plane" }],
        explain:"Two zero coordinates put it on an axis: the `y`-axis. It isn’t in any octant." },
      { id:"p2", prompt:"How far is P(2, 3, 6) from the origin?",
        options:[{ t:"7", ok:true }, { t:"11" }, { t:"`√13`" }, { t:"49" }],
        explain:"`√{13 + 36} = 7`. 11 adds the steps; `√13` forgets the height; 49 forgets the root." },
      { id:"p3", prompt:"What will the set of points with `z = 2` look like in R³?",
        options:[{ t:"A flat horizontal plane, 2 units above the `xy`-plane", ok:true }, { t:"A horizontal line" }, { t:"A single point" }, { t:"A vertical plane" }],
        explain:"`x` and `y` are free, so the points fill a plane." },
      { id:"p4", prompt:"Two points mode: A(1, −2, 3) and B(4, 2, 3). What’s the distance AB?",
        options:[{ t:"5", ok:true }, { t:"`√61`" }, { t:"7" }, { t:"`√34`" }],
        explain:"B − A = (3, 4, 0), so AB = `√{9 + 16 + 0} = 5`. `√61` adds the coordinates; 7 adds the steps; `√34` used `z = 3` instead of 3 − 3 = 0." }
    ],
    chalIntro:"Set up the 3D plotter, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2, 3], prompt:"Move P so it is on the `xz`-plane, in front of the `yz`-plane (positive `x`), below the `xy`-plane, and exactly 5 units from the origin.",
        why:"`y = 0`, `x > 0`, `z < 0` and `x^2 + z^2 = 25`: P(3, 0, −4) or P(4, 0, −3).",
        hints:["On the `xz`-plane means `y = 0`.", "You need `x > 0`, `z < 0` and `x^2 + z^2 = 25`.", "(3, 0, −4) or (4, 0, −3)."],
        msgs:{ mode:"Switch to <strong>Point</strong> mode first.",
          above:"Above the `xy`-plane: you need `z < 0`.", yz:"That’s on the `yz`-plane (`x = 0`).", xy:"That’s on the `xy`-plane.",
          xaxis:"On the `x`-axis, not below the `xy`-plane.", noty:"On the `xz`-plane means `y = 0`.",
          sign:"You need `x > 0` (in front of the `yz`-plane) and `z < 0` (below the `xy`-plane).",
          dist:"P is on the right side of every plane, but not 5 from the origin: you need `x^2 + z^2 = 25`. Watch the `|vec{OP}|` readout." } },
      { id:"tc2", goal:4, prompt:"Two points mode: A(1, 2, −1) is fixed. Place B so that `vec{AB} = (2, -3, 6)`.",
        why:"B = A + `vec{AB}` = (1 + 2, 2 − 3, −1 + 6) = (3, −1, 5), and the readout shows AB = 7.",
        hints:["`vec{AB}` = B − A, so B = A + `vec{AB}`.", "(1 + 2, 2 − 3, −1 + 6).", "B(3, −1, 5)."],
        msgs:{ mode:"Switch to <strong>Two points</strong> mode first.", setA:"A is fixed at (1, 2, −1) for this challenge: set A’s sliders to it first.",
          atVec:"That puts B at the vector’s numbers. Start from A: B = A + `vec{AB}`.",
          rev:"That’s A − `vec{AB}`: the arrow would point from B to A.",
          general:"Not yet: `vec{AB}` should be (2, −3, 6). Watch the `vec{AB}` row of the readout." } },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Point mode: place P in the first octant, with no coordinate 0, so that `|vec{OP}| = 9`. Then find another. How many are there?",
        why:"`x^2 + y^2 + z^2 = 81` with whole numbers from 1 up has 12 solutions: the orders of (1, 4, 8), (4, 4, 7) and (3, 6, 6). Keep going: the tracker counts every new one.",
        hints:["You need `x^2 + y^2 + z^2 = 81`.", "Try `z = 8`: then `x^2 + y^2 = 17 = 1 + 16`.", "(1, 4, 8) works; so do (4, 4, 7) and (3, 6, 6), in any order."],
        msgs:{ mode:"Switch to <strong>Point</strong> mode first.",
          m333:"`|vec{OP}| = √27 = 3√3`. Magnitude isn’t 3 + 3 + 3.", x9:"A coordinate is 0: that’s on the `x`-axis.",
          zero:"A coordinate is 0, so P is on a coordinate plane or an axis, not in the first octant.",
          seven:"That’s 7 from the origin.", neg:"Stay in the first octant: all three coordinates positive.",
          general:"Not yet: you need `x^2 + y^2 + z^2 = 81`. Watch the `|vec{OP}|` readout." } }
    ]
  },
  part3:{
    slug:"sketch", name:"Sketches",
    heading:"Reading 3D sketches",
    intro:"3D work lives on flat paper, and a flat sketch can be read more than one way. Check three things: the handedness of the axes, the box that pins a point down, and what one equation really describes.",
    presets:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front (`xz`)" }, { id:"side", t:"Side (`yz`)" }, { id:"top", t:"Top (`xy`)" }],
    txt:{ view:"View", check:"Check", curl:"Show the right hand", sketch:"Sketch", rotate:"Rotate to check", rotNote:"Drag or use the arrow keys to rotate. The presets jump to standard views.",
      r2:"R²", r3:"R³", both:"Both: `x = 3` and `y = -2`", eqH:"Equation", dimH:"Space",
      thumbOk:"thumb along +`z`: right-handed", thumbBad:"thumb along −`z`: left-handed", tapNote:"Tap every right-handed sketch, then press Check." },
    st1:{ title:"Station 1: Right-handed or not?",
      text:"Each sketch shows three labelled axes. Tap the right-handed ones (two of them are). Then watch the right hand curl from +`x` to +`y` over each sketch: does the thumb point along +`z`?",
      sketches:[
        { id:"h1", phi:30, eps:20, dirs:I3, ok:true },
        { id:"h2", phi:30, eps:20, dirs:[[0, 1, 0], [1, 0, 0], [0, 0, 1]] },
        { id:"h3", phi:-120, eps:28, dirs:I3, ok:true },
        { id:"h4", phi:60, eps:18, dirs:[[1, 0, 0], [0, 1, 0], [0, 0, -1]] }
      ],
      left:"Sketch {n}: curl from +`x` to +`y`. Your thumb points along −`z` here, so this system is left-handed.",
      miss:"Sketch {n} is right-handed too. " + M1,
      none:"Tap at least one sketch first.",
      good:"<strong>✓ Right:</strong> sketches 1 and 3 are right-handed. The right hand curls from +`x` to +`y` and the thumb lands on +`z`. In sketch 2, `x` and `y` are swapped; in sketch 4, `z` is flipped. Either change makes a left-handed system." },
    st2:{ title:"Station 2: Read the point",
      text:"Each point is drawn with its box in a fixed sketch. Choose its coordinates. Then <strong>Rotate to check</strong>: the true box confirms or corrects your reading. (Without a box, a flat sketch can’t be read: many points sit behind the same dot.)",
      prompt:"Which point is drawn?",
      items:[
        { id:"r1", p:[2, 4, 3], options:[
          { t:"(2, 4, 3)", ok:true, why:"2 along `x`, 4 parallel to `y`, 3 up: the box edges match." },
          { t:"(4, 2, 3)", why:"That swaps `x` and `y`. The `x`-axis comes toward you; `y` goes to the right. " + M1 },
          { t:"(−2, 4, 3)", why:"Sign slip: the box is on the positive side of the `x`-axis." },
          { t:"(2, 3, 4)", why:"The height is the edge parallel to `z`: 3, not 4." }] },
        { id:"r2", p:[-3, 2, 1], options:[
          { t:"(−3, 2, 1)", ok:true, why:"3 back along the negative `x`-axis, 2 parallel to `y`, 1 up." },
          { t:"(2, −3, 1)", why:"That swaps `x` and `y`. " + M1 },
          { t:"(3, 2, 1)", why:"Sign slip: the box goes back along the dashed, negative `x`-axis." },
          { t:"(−3, 2, −1)", why:"The point is above the floor, so `z > 0`." }] },
        { id:"r3", p:[4, 0, -2], options:[
          { t:"(4, 0, −2)", ok:true, why:"No `y` depth: the box is a flat rectangle on the `xz`-plane, 4 along `x` and 2 down." },
          { t:"(0, 4, −2)", why:"That swaps `x` and `y`. The flat box lies along the `x`-axis. " + M1 },
          { t:"(4, 0, 2)", why:"Sign slip: the rectangle hangs below the floor, so `z < 0`." },
          { t:"(4, −2, 0)", why:"The 2 is a drop parallel to `z`, not a step along `y`." }] }
      ],
      good:"<strong>✓ Right.</strong>", bad:"<strong>✗ Not quite.</strong>", again:"Try another reading, or rotate to check.",
      trueLab:"true point" },
    st3:{ title:"Station 3: Planes, not lines",
      text:"Choose an equation. Switch between R² and R³: on a flat grid one equation is a line, but in space it’s a plane.",
      eqs:[
        { id:"x3", t:"`x = 3`", r2:"In R², `x = 3` is a vertical line: `y` is free.", r3:"In R³, `x = 3` is a plane parallel to the `yz`-plane: `y` and `z` are free.",
          alg:"(3, 5, −7) satisfies `x = 3`. So does (3, −1, 2). `y` and `z` can be any numbers, so there are two free coordinates. That’s a plane." },
        { id:"ym2", t:"`y = -2`", r2:"In R², `y = -2` is a horizontal line: `x` is free.", r3:"In R³, `y = -2` is a plane parallel to the `xz`-plane: `x` and `z` are free.",
          alg:"(4, −2, 1) satisfies `y = -2`. So does (−6, −2, 3). `x` and `z` can be any numbers, so there are two free coordinates. That’s a plane." },
        { id:"z0", t:"`z = 0`", r2:"R² has no `z`-coordinate, so `z = 0` doesn’t describe a line there.", r3:"In R³, `z = 0` is the whole `xy`-plane: `x` and `y` are free.",
          alg:"(2, 7, 0) satisfies `z = 0`. So does (−5, 1, 0). `x` and `y` can be any numbers, so there are two free coordinates. That’s a plane." },
        { id:"both", t:"Both: `x = 3` and `y = -2`", r2:"In R², the lines `x = 3` and `y = -2` meet in one point, (3, −2).",
          r3:"In R³, the planes `x = 3` and `y = -2` meet in a vertical line through (3, −2, 0): only `z` is free. You’ll meet lines like this again later in the course.",
          alg:"(3, −2, 0), (3, −2, 5) and (3, −2, −4) satisfy both equations. Only `z` is free: one free coordinate makes a line." }
      ],
      algH:"Check it with algebra", fig3:"3D view of the plane {e}.", figBoth:"3D view of the planes x = 3 and y = −2 meeting in a vertical line.",
      fig2:"Flat grid with {e}.", fig2none:"Flat grid: no line, because R² has no z-coordinate." },
    quickCheck:{
      title:"Quick check", summary:"Reading 3D sketches quick check",
      items:[
        { id:"q1", goal:2, prompt:"Which coordinate plane contains (0, −3, 5)?",
          choices:[{ t:"`yz`-plane", ok:true, fb:"Right. `x = 0` is the `yz`-plane." }, { t:"`xz`-plane", fb:"`x = 0` is the `yz`-plane." },
            { t:"`xy`-plane", fb:"`x = 0` is the `yz`-plane." }, { t:"None: it’s in an octant", fb:"`x = 0` is the `yz`-plane. " + M5 }] },
        { id:"q2", goal:5, prompt:"In R³, the points with `y = 4` form…",
          choices:[{ t:"a plane parallel to the `xz`-plane", ok:true, fb:"Right. `x` and `z` are free: a plane." }, { t:"a line parallel to the `x`-axis", fb:"`x` and `z` are free: a plane." },
            { t:"a plane parallel to the `xy`-plane", fb:"`x` and `z` are free: a plane, and it stands upright, parallel to the `xz`-plane." }, { t:"a single point", fb:"`x` and `z` are free: a plane." }] },
        { id:"q3", goal:4, prompt:"A(2, −1, 4) and B(−1, 3, 4). `vec{AB}` = ?",
          choices:[{ t:"(−3, 4, 0)", ok:true, fb:"Right. B − A, component by component; 4 − 4 = 0." }, { t:"(3, −4, 0)", fb:"B − A, component by component; 4 − 4 = 0. " + M3 },
            { t:"(1, 2, 8)", fb:"B − A, component by component; 4 − 4 = 0." }, { t:"(−3, 4, 4)", fb:"B − A, component by component; 4 − 4 = 0." }] },
        { id:"q4", goal:1, prompt:"Right-handed, with +`x` toward you and +`y` to the right. +`z` points…",
          choices:[{ t:"up", ok:true, fb:"Right. Curl from `x` to `y`: thumb up." }, { t:"down", fb:"Curl from `x` to `y`: thumb up." },
            { t:"left", fb:"Curl from `x` to `y`: thumb up." }, { t:"away from you", fb:"Curl from `x` to `y`: thumb up." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"where", type:"sorter", title:"Where is the point?", summary:"Where is the point?", noun:"point", goal:[1, 2],
        instruction:"Tap a point, then tap the box that says where it is.",
        boxes:[{ id:"b1", label:"First octant" }, { id:"b2", label:"Another octant" }, { id:"b3", label:"On a coordinate plane", sub:"(not an axis)" }, { id:"b4", label:"On an axis" }],
        wrongDefault:"Count the zero coordinates, then look at the signs.",
        items:[
          sortItem("i1", "(2, 5, 1)", "b1", "All three coordinates are positive."),
          sortItem("i2", "(−1, 3, 2)", "b2", "`x < 0`, so not the first octant."),
          sortItem("i3", "(0, 4, −2)", "b3", "`x = 0`: on the `yz`-plane."),
          sortItem("i4", "(3, 0, 0)", "b4", "Two zeros: on the `x`-axis."),
          sortItem("i5", "(−2, −2, −2)", "b2", "All negative: the octant opposite the first."),
          sortItem("i6", "(5, 0, 7)", "b3", "`y = 0`: the `xz`-plane."),
          sortItem("i7", "(0, 0, −6)", "b4", "On the negative `z`-axis."),
          sortItem("i8", "(1, −1, 1)", "b2", "`y < 0`."),
          sortItem("i9", "(0, 0, 0)", "b4", "The origin is on every axis.", { hints:["How many coordinates are 0?", "All three: it’s on all three axes.", "On an axis."] }),
          sortItem("i10", "(4, 6, 0)", "b3", "`z = 0`: the `xy`-plane.")
        ] },
      { id:"mags", type:"numeric", title:"Magnitudes and distances", summary:"Magnitudes and distances", star:true, goal:[3, 4, 6],
        instruction:"Give exact answers. Items 4 to 6 are non-routine; item 6 goes beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions such as −5/2, or roots such as √3 or 2√2. For more than one answer, separate them with commas (or type ±4). Then press Check.",
        items:[
          { id:"s1", goal:3, prompt:"`|(2, -6, 9)|`", answer:11, tol:1e-9, display:"11", label:"Magnitude:",
            wrong:[{ match:5, fb:"Square before adding: 4 + 36 + 81 = 121." }, { match:121, fb:"Take the square root of 121." }],
            why:"`√{4 + 36 + 81} = √121 = 11`." },
          { id:"s2", goal:4, prompt:"Distance from A(3, −1, 2) to B(−1, 1, 6)", answer:6, tol:1e-9, display:"6", label:"Distance:",
            wrong:[{ match:Math.sqrt(68), fb:"Subtract, don’t add: B − A = (−4, 2, 4)." }, { match:10, fb:"Square, add, then take the root: `√{16 + 4 + 16}`." }],
            why:"B − A = (−4, 2, 4), so AB = `√{16 + 4 + 16} = √36 = 6`." },
          { id:"s3", goal:3, prompt:"`|(1, 1, 1)|`", answer:Math.sqrt(3), tol:1e-9, display:"`√3`", label:"Magnitude:", keypad:"text",
            wrong:[{ match:3, fb:"`√{1 + 1 + 1} = √3`." }, { match:1, fb:"`√{1 + 1 + 1} = √3`, not 1." }],
            why:"`√{1 + 1 + 1} = √3`: the diagonal of a unit cube." },
          { id:"s4", goal:[3, 6], star:true, prompt:"All `k` with `|(k, 2, 4)| = 6`", answer:[-4, 4], tol:1e-9, display:"`k = 4` or `k = -4`", label:"Every value of `k`, separated by commas:",
            wrong:[{ missing:-4, fb:"`(-4)^2 = 16` too." }, { match:[4], fb:"`(-4)^2 = 16` too." }, { match:[-16, 16], fb:"Those are `k^2`-sized: take the root of 16." }],
            why:"`k^2 + 4 + 16 = 36`, so `k^2 = 16` and `k = ±4`." },
          { id:"s5", goal:[3, 6], star:true, prompt:"P(`a`, `a`, 7) is 9 from the origin. Find every `a`.", answer:[-4, 4], tol:1e-9, display:"`a = 4` or `a = -4`", label:"Every value of `a`, separated by commas:",
            wrong:[{ match:[-2 * Math.SQRT2, 2 * Math.SQRT2], fb:"`2a^2 = 81 - 49 = 32`, so `a^2 = 16`." }, { missing:-4, fb:"`(-4)^2 = 16` too." }, { match:[4], fb:"`(-4)^2 = 16` too." }],
            why:"`a^2 + a^2 + 49 = 81`, so `2a^2 = 32`, `a^2 = 16` and `a = ±4`.",
            hints:["`a^2 + a^2 + 49 = 81`.", "`2a^2 = 32`.", "`a = ±4`."] },
          { id:"s6", goal:[4, 6], star:true, prompt:"A(1, 2, 3) and B(5, 2, 0). Find the point C on the `z`-axis that is equally far from A and B. C = (0, 0, `c`): give `c`.",
            answer:-2.5, tol:1e-9, display:"C(0, 0, −5/2)", label:"`c` =", keypad:"text",
            wrong:[{ match:2.5, fb:"Check the sign: `-6c = 15`, so `c` is negative." }, { match:0, fb:"C = (0, 0, `c`). Set CA² = CB²: 1 + 4 + `(3 - c)^2` = 25 + 4 + `c^2`." }],
            general:"C = (0, 0, `c`). Set CA² = CB²: 1 + 4 + `(3 - c)^2` = 25 + 4 + `c^2`.",
            why:"`c^2 - 6c + 14 = c^2 + 29`, so `-6c = 15` and `c = -5/2`: C(0, 0, −5/2).",
            hints:["A point on the `z`-axis is (0, 0, `c`).", "CA² = 1 + 4 + `(3 - c)^2` and CB² = 25 + 4 + `c^2`.", "`c^2 - 6c + 14 = c^2 + 29`, so `c = -5/2`: C(0, 0, −5/2)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Kiran", goal:[4, 5],
        instruction:"Kiran made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find the distance from A(2, −3, 1) to B(−4, 0, 3).",
            steps:["`vec{AB}` = B − A = (−4 − 2, 0 − (−3), 3 − 1)", "= (−6, 3, 2)", "`|vec{AB}| = √{(-6)^2 + 3^2 + 2^2}`", "`= √{-36 + 9 + 4} = √{-23}`, so there’s no distance."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`(-6)^2 = 36`, so `|vec{AB}| = √49 = 7`.", ok:true, why:M6 },
              { t:"`|vec{AB}| = -6 + 3 + 2 = -1`.", why:"Square first, and a length can’t be negative." },
              { t:"`|vec{AB}| = 36 + 9 + 4 = 49`.", why:"Take the square root." },
              { t:"Step 4 is correct: the points are too far apart.", why:"Any two points have a distance." }],
            hints:["What is `(-6)(-6)`?", "36.", "`√49 = 7`."] },
          { id:"e2", goal:5, task:"Describe the set of points in R³ with `z = -2`.",
            steps:["Every point with `z = -2` is 2 units below the `xy`-plane.", "`x` and `y` are not restricted.", "One equation gives a line, so `z = -2` is a horizontal line.", "The line is parallel to the `x`-axis."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Two free coordinates give a plane: `z = -2` is the horizontal plane 2 units below the `xy`-plane.", ok:true, why:M4 },
              { t:"It’s a vertical plane.", why:"A fixed height gives a horizontal plane." },
              { t:"It’s the single point (0, 0, −2).", why:"`x` and `y` can be anything." },
              { t:"Step 3 is correct.", why:"That’s true in R², not R³." }],
            hints:["How many coordinates are free?", "Two: `x` and `y`.", "A plane."] },
          { id:"e3", goal:4, task:"A(1, 4, −2) and B(3, 1, 4). Find `vec{AB}`, `|vec{AB}|` and the point C with `vec{AC} = 2vec{AB}`.",
            steps:["`vec{AB}` = A − B = (−2, 3, −6)", "`|vec{AB}| = √{4 + 9 + 36} = 7`", "`vec{AC} = 2vec{AB}` = (−4, 6, −12)", "C = A + `vec{AC}` = (−3, 10, −14)"],
            answer:0,
            stepFb:["", "The length is right, but only because reversing a vector doesn’t change its length. Look earlier.", "Step 3 doubles step 1 correctly.", "Step 4 adds correctly, using the wrong vector."],
            fixes:[
              { t:"`vec{AB}` = B − A = (2, −3, 6), so `vec{AC}` = (4, −6, 12) and C = (5, −2, 10).", ok:true, why:M3 },
              { t:"`vec{AB}` = A + B = (4, 5, 2).", why:"Subtract, end minus start." },
              { t:"Keep (−2, 3, −6) but use C = A − `vec{AC}`.", why:"Two reversals happen to cancel here, but the vector is still named wrongly." },
              { t:"Step 1 is correct, because `|vec{AB}|` came out right.", why:"A magnitude check can’t catch a reversed direction." }],
            hints:["Which way does `vec{AB}` point?", "From A to B: B − A.", "(2, −3, 6); C(5, −2, 10)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the 3D plotter: how a flat picture can mislead, or that `z = 2` is a plane?" },
      { id:"j2", q:"In your own words, why is the length of `(a, b, c)` equal to `√{a^2 + b^2 + c^2}`? Mention the box." },
      { id:"j3", q:"Explain to a friend how to tell which octant or plane a point is in." },
      { id:"j4", q:"What part of 3D still feels hard to see? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"What is `|(2, -3, 6)|`?", options:[
          { t:"7", ok:true, why:"`√{4 + 9 + 36} = 7`." },
          { t:"11", why:"That adds the sizes of the components. " + M2 },
          { t:"5", why:"2 − 3 + 6 isn’t a length." },
          { t:"49", why:"Take the square root." }] },
        b:{ prompt:"What is `|(-4, 4, 7)|`?", options:[
          { t:"9", ok:true, why:"`√{16 + 16 + 49} = 9`." },
          { t:"15", why:"That adds the sizes of the components. Square, add, then take the root: `√{16 + 16 + 49} = 9`." },
          { t:"7", why:"−4 + 4 + 7 isn’t a length." },
          { t:"81", why:"Take the square root." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Where is the point (−2, 0, 5)?", options:[
          { t:"On the `xz`-plane", ok:true, why:"`y = 0`." },
          { t:"In the octant with `x < 0` and `z > 0`", why:"A zero coordinate means it’s on a plane, not in an octant." },
          { t:"On the `z`-axis", why:"Only one coordinate is 0." },
          { t:"On the `yz`-plane", why:"The `yz`-plane has `x = 0`." }] },
        b:{ prompt:"Where is the point (0, 3, −1)?", options:[
          { t:"On the `yz`-plane", ok:true, why:"`x = 0`." },
          { t:"In an octant", why:M5 },
          { t:"On the `y`-axis", why:"`z ≠ 0`." },
          { t:"On the `xz`-plane", why:"That needs `y = 0`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A(3, −1, 2) and B(1, 4, −2). What is `vec{AB}`?", options:[
          { t:"(−2, 5, −4)", ok:true, why:"B − A = (1 − 3, 4 − (−1), −2 − 2)." },
          { t:"(2, −5, 4)", why:"That’s `vec{BA}`. " + M3 },
          { t:"(4, 3, 0)", why:"Subtract, don’t add." },
          { t:"(−2, 3, −4)", why:"4 − (−1) = 5." }] },
        b:{ prompt:"P(−2, 5, 0) and Q(1, −1, 3). What is `vec{PQ}`?", options:[
          { t:"(3, −6, 3)", ok:true, why:"Q − P = (1 − (−2), −1 − 5, 3 − 0)." },
          { t:"(−3, 6, −3)", why:"That’s `vec{QP}`: end minus start is Q − P." },
          { t:"(−1, 4, 3)", why:"Subtract, don’t add." },
          { t:"(3, −4, 3)", why:"−1 − 5 = −6." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"The point P(`k`, 2, −1) is 3 units from Q(1, 0, 1). Find `k`.", options:[
          { t:"`k = 0` or `k = 2`", ok:true, why:"`(k - 1)^2 + 4 + 4 = 9`, so `(k - 1)^2 = 1`." },
          { t:"`k = 2` only", why:"`k - 1 = -1` also works." },
          { t:"`k = 0` or `k = -2`", why:"The difference is `k - 1`, not `k + 1`." },
          { t:"No value of `k`", why:"Square the distance: the sum must be 9, not 3." }] },
        b:{ prompt:"The point P(3, `k`, 2) is 7 units from Q(1, 1, −1). Find `k`.", options:[
          { t:"`k = 7` or `k = -5`", ok:true, why:"`4 + (k - 1)^2 + 9 = 49`." },
          { t:"`k = 7` only", why:"`(k - 1)^2 = 36` gives `k - 1 = 6` or `k - 1 = -6`." },
          { t:"`k = 5` or `k = -7`", why:"The difference is `k - 1`." },
          { t:"No value of `k`", why:"Use 49, not 7." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"In R³, which describes the points that satisfy <strong>both</strong> `x = 2` and `y = -3`?", options:[
          { t:"A line parallel to the `z`-axis, through (2, −3, 0)", ok:true, why:"Only `z` is free." },
          { t:"The point (2, −3)", why:"That’s the R² answer; in R³, `z` is still free." },
          { t:"A plane", why:"Each equation alone is a plane; together they leave one free coordinate." },
          { t:"Nothing: two planes can’t meet", why:"These two planes cross." }] },
        b:{ prompt:"In R³, which describes the points that satisfy <strong>both</strong> `y = 1` and `z = 4`?", options:[
          { t:"A line parallel to the `x`-axis, through (0, 1, 4)", ok:true, why:"Only `x` is free." },
          { t:"The point (1, 4)", why:"That’s the R² answer; in R³, `x` is still free." },
          { t:"A plane parallel to the `yz`-plane", why:"Only `x` is free: a line." },
          { t:"A line parallel to the `y`-axis", why:"`y` is fixed; `x` is free." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A box has one corner at the origin and the opposite corner at (4, 4, 7). How long is the longest rod that fits inside, and how long is the diagonal of the bottom face?", options:[
          { t:"9 and `4√2`", ok:true, why:"`√{16 + 16 + 49} = 9`; `√{16 + 16} = 4√2`." },
          { t:"15 and 8", why:M2 },
          { t:"9 and 32", why:"Take the root for the floor diagonal." },
          { t:"`√65` and `4√2`", why:"The space diagonal uses all three edges." }] },
        b:{ prompt:"A box has one corner at the origin and the opposite corner at (2, 6, 9). How long is the longest rod that fits inside, and how long is the diagonal of the bottom face?", options:[
          { t:"11 and `2√10`", ok:true, why:"`√{4 + 36 + 81} = 11`; `√40 = 2√10`." },
          { t:"17 and 8", why:"Lengths don’t add: square, add, then take the root." },
          { t:"11 and 40", why:"Take the root." },
          { t:"`√85` and `2√10`", why:"Use all three edges." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of how to plot P(3, −2, 4)?", options:[
          { t:"“From the origin, move 3 along the positive `x`-axis, then 2 parallel to the negative `y`-axis, then 4 up parallel to the `z`-axis. The box with corners O and P shows all three moves.”", ok:true, why:"Three moves, each parallel to one axis, and the box makes them visible." },
          { t:"“Mark 3 on the `x`-axis, −2 on the `y`-axis and 4 on the `z`-axis; P is where the marks meet.”", why:"Marks on three axes never meet; you move parallel to each axis in turn." },
          { t:"“Move 3 right, 2 down, then 4 out of the page.”", why:"Down is −`z`, not −`y`. " + M1 },
          { t:"“Plot (3, −2) on the floor, then go 4 units in any direction.”", why:"The third move must be parallel to `z`." }] },
        b:{ prompt:"Which is the best description of how to plot Q(−1, 5, −3)?", options:[
          { t:"“From the origin, move 1 along the negative `x`-axis, then 5 parallel to the positive `y`-axis, then 3 down parallel to the `z`-axis. The box with corners O and Q shows the moves.”", ok:true, why:"Three moves, each parallel to one axis, with the signs read correctly." },
          { t:"“Mark −1, 5 and −3 on the three axes; Q is where they meet.”", why:"Marks on three axes never meet; you move parallel to each axis in turn." },
          { t:"“Move 1 left, 5 up, then 3 into the page.”", why:"Up is +`z`, not +`y`. " + M1 },
          { t:"“Plot (−1, 5) on the floor, then go 3 units in any direction.”", why:"The third move must be parallel to `z`." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement correctly compares `x = 3` in R² and in R³?", options:[
          { t:"“In R², `x = 3` is a line, because `y` is free. In R³, it’s a plane, because `y` and `z` are both free.”", ok:true, why:"One equation fixes one coordinate; the free ones decide the shape." },
          { t:"“It’s a line in both, because the equation is the same.”", why:M4 },
          { t:"“In R³ it’s the point (3, 0, 0).”", why:"`y` and `z` aren’t forced to be 0." },
          { t:"“In R² it’s a plane and in R³ a line.”", why:"It’s the other way round." }] },
        b:{ prompt:"Which statement correctly describes `z = 0` in R³?", options:[
          { t:"“It’s the `xy`-plane: `x` and `y` are free and every point has height 0.”", ok:true, why:"Two free coordinates make a plane." },
          { t:"“It’s the `z`-axis.”", why:"On the `z`-axis, `x = y = 0`." },
          { t:"“It’s the origin.”", why:"Only one coordinate is fixed." },
          { t:"“It’s the `x`-axis and the `y`-axis.”", why:"Those are only parts of the plane." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A drone pad is at P(1, 2, 0) and the drone hovers at D(13, −2, 3) (metres; `x` east, `y` north, `z` up). How far is the drone from the pad?", options:[
          { t:"13 m", ok:true, why:"`vec{PD}` = (12, −4, 3); `√{144 + 16 + 9} = 13`." },
          { t:"19 m", why:"That adds the steps. Square, add, then take the root: `√{144 + 16 + 9} = 13`." },
          { t:"`4√10` m", why:"Include the height: that’s the floor distance." },
          { t:"`√205` m", why:"Subtract the coordinates, don’t add them." }] },
        b:{ prompt:"A drone pad is at P(−2, 1, 0) and the drone hovers at D(1, −3, 12) (metres; `x` east, `y` north, `z` up). How far is the drone from the pad?", options:[
          { t:"13 m", ok:true, why:"`vec{PD}` = (3, −4, 12); `√{9 + 16 + 144} = 13`." },
          { t:"19 m", why:"That adds the steps. Square, add, then take the root: `√{9 + 16 + 144} = 13`." },
          { t:"5 m", why:"Include the height." },
          { t:"`√149` m", why:"Subtract the coordinates." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A crane’s hook is at H(2, 5, `h`), directly above the ground (`h > 0`). The load sits at L(0, 1, 0), and the taut cable HL is 6 m long. How high is the hook?", options:[
          { t:"4 m", ok:true, why:"`4 + 16 + h^2 = 36`, so `h = 4` (reject −4)." },
          { t:"±4 m", why:"A height above the ground is positive. " + M7 },
          { t:"`2√14` m", why:"`h^2 = 36 - 20`, not 36 + 20." },
          { t:"0 m", why:"6 − 2 − 4 adds lengths, not squares." }] },
        b:{ prompt:"A crane’s hook is at H(−1, 2, `h`), directly above the ground (`h > 0`). The load sits at L(1, −1, 0), and the taut cable HL is 7 m long. How high is the hook?", options:[
          { t:"6 m", ok:true, why:"`4 + 9 + h^2 = 49`, so `h = 6` (reject −6)." },
          { t:"±6 m", why:"A height above the ground is positive. " + M7 },
          { t:"`√62` m", why:"`h^2 = 49 - 13`." },
          { t:"2 m", why:"Lengths don’t subtract like that. Square, add, then take the root." }] } }
    ]
  },
  task:{
    title:"Hidden beacon", summary:"Hidden beacon",
    statement:"<p>Hide a beacon at a point B with whole-number coordinates that meets every clue. Find every possible hiding spot.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The clues</h4><ol style=\"margin:0;padding-left:1.3em\"><li>B is in the octant where `x > 0`, `y < 0` and `z > 0`.</li><li>B is exactly 7 units from the origin.</li><li>B is higher above the `xy`-plane than it is in front of the `yz`-plane (`z > x`).</li></ol></div>" +
      "<p class=\"tiny muted\">Each coordinate is a whole number from −9 to 9. The 3D view shows the box and the position vector `vec{OB}` as you go.</p>",
    checks:["In the (+, −, +) octant", "7 units from the origin", "Higher than it is far in front"],
    tips:["No coordinate can be 0, and the signs must be +, −, +.",
      "You need three non-zero squares that add to 49. Only 4 + 9 + 36 works.",
      "The height must be bigger than the `x`-coordinate."],
    explainPrompt:"Explain how you knew the coordinates had to be 2, 3 and 6 (with some signs), and how clue 3 narrowed it down.",
    vocab:"Use the words octant, magnitude and coordinate.",
    more:"There’s more than one hiding spot. Can you find them all?",
    after3:"49 = 4 + 9 + 36 is the only way to write 49 as three non-zero squares. That fixes the sizes 2, 3 and 6, and clue 3 rules out the orders with `z < x`.",
    labels:{ x:"`x`", y:"`y`", z:"`z`", point:"Beacon", mag:"`|vec{OB}|`", cmp:"Height vs front", oct:"Signs",
      graph:"3D view of the beacon B with its box and position vector" }
  },
  cards:[
    ["Right-handed system", "Curl right fingers from +`x` to +`y`; thumb = +`z`."],
    ["Plotting P(`a`, `b`, `c`)", "Move `a` along `x`, `b` parallel to `y`, `c` parallel to `z`: the box from O to P."],
    ["Position vector", "`vec{OP} = (a, b, c)`: same numbers as the point."],
    ["Magnitude in R³", "`|(a, b, c)| = √{a^2 + b^2 + c^2}`; e.g. `|(2, 3, 6)| = 7`."],
    ["Pythagoras twice", "Floor diagonal `√{a^2 + b^2}`, then up `c`."],
    ["`vec{AB}`", "B − A, end minus start."],
    ["Distance AB", "`|vec{AB}| = √{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}`."],
    ["Octants", "8 regions; the first octant has all coordinates positive."],
    ["Coordinate planes", "`xy`-plane: `z = 0` · `xz`-plane: `y = 0` · `yz`-plane: `x = 0`."],
    ["On an axis", "Two coordinates are 0, e.g. (0, 4, 0) is on the `y`-axis."],
    ["One equation in R³", "A plane (two free coordinates), e.g. `z = 2`."],
    ["Handy 3D triples", "(1, 2, 2) → 3 · (2, 3, 6) → 7 · (4, 4, 7) → 9 · (2, 6, 9) → 11."]
  ]
};
