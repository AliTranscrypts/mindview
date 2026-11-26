// MCV4U 33 Introduction to Vectors. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/33-introduction-to-vectors.md
// misconception core sentences (plan §3)
const M1 = "A vector is only a magnitude and a direction. Slide one arrow onto the other: if it matches, they’re equal.";
const M2 = "`vec{BA}` starts at B and ends at A: same length, opposite direction. `vec{BA} = -vec{AB}`.";
const M3 = "Bearings start at north and turn clockwise; angles start at east and turn counterclockwise.";
const M4 = "N 40° W means: face north, then turn 40° toward west.";
const M5 = "A minus sign isn’t a direction in space. Temperature has no direction.";
const M7 = "The opposite direction is 180° away, not 90°.";

// Activity 1 tiles: two arrows on a small grid (inline SVG; colours from app.css classes)
function pairTile(a, b){
  const xs = [a[0], a[2], b[0], b[2]], ys = [a[1], a[3], b[1], b[3]];
  const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, y0 = Math.min(...ys) - 1, y1 = Math.max(...ys) + 1;
  const u = 12, W = (x1 - x0) * u, H = (y1 - y0) * u, X = x => (x - x0) * u, Y = y => (y1 - y) * u;
  let g = "";
  for (let x = x0; x <= x1; x++) g += "M" + X(x) + " 0V" + H;
  for (let y = y0; y <= y1; y++) g += "M0 " + Y(y) + "H" + W;
  let ax = "";
  if (x0 < 0 && x1 > 0) ax += "M" + X(0) + " 0V" + H;
  if (y0 < 0 && y1 > 0) ax += "M0 " + Y(0) + "H" + W;
  function arr(v, cls){
    const px = X(v[0]), py = Y(v[1]), qx = X(v[2]), qy = Y(v[3]), L = Math.hypot(qx - px, qy - py), ux = (qx - px) / L, uy = (qy - py) / L;
    const bx = qx - ux * 8, by = qy - uy * 8, r = n => Math.round(n * 10) / 10;
    return '<path class="' + cls + '" d="M' + r(px) + " " + r(py) + "L" + r(bx) + " " + r(by) + '"/><path class="' + cls + 'h" d="M' + r(qx) + " " + r(qy) + "L" + r(bx - uy * 4) + " " + r(by + ux * 4) + "L" + r(bx + uy * 4) + " " + r(by - ux * 4) + 'Z"/>' +
      '<circle class="' + cls + 'h" cx="' + r(px) + '" cy="' + r(py) + '" r="2.2"/>';
  }
  const c = v => "(" + v[0] + ", " + v[1] + ") → (" + v[2] + ", " + v[3] + ")";
  const t = s => s.replace(/-/g, "−");
  return '<span class="vc-pair"><svg viewBox="-1 -1 ' + (W + 2) + " " + (H + 2) + '" width="' + (W + 2) + '" height="' + (H + 2) + '" role="img" aria-label="' + t("First vector " + c(a) + ", second vector " + c(b)) + '"><path class="vc-pg" d="' + g + '"/>' + (ax ? '<path class="vc-pax" d="' + ax + '"/>' : "") + arr(a, "vc-pa") + arr(b, "vc-pb") + "</svg>" +
    '<span class="vc-pcap"><span class="vc-k1">1st</span> ' + t(c(a)) + '<br><span class="vc-k2">2nd</span> ' + t(c(b)) + "</span></span>";
}

export default {
  id:"33-introduction-to-vectors",
  kind:"topic",
  title:"Introduction to vectors",
  topic:"Introduction to Vectors",
  readyTopic:"vectors",
  hero:{
    eq:'<span class="vc-heq"><svg class="vc-harr" viewBox="0 0 36 40" aria-hidden="true"><path class="vc-harl" d="M8 36L21.6 17.9"/><path class="vc-harh" d="M26 12L18.2 16.3L24.6 21.1Z"/><circle class="vc-harh" cx="8" cy="36" r="2.4"/></svg><span>`vec{AB}`</span><span class="vc-hmeta">`|vec{AB}| = 5`<br>true bearing 037°</span></span>',
    eqLabel:"vector A B, with magnitude 5 and true bearing 0 3 7 degrees",
    eqSize:"md",
    headline:"How far, and which way",
    text:"Some quantities need only a size: a <strong>scalar</strong>, like 5 km or 20 °C. Others need a size <strong>and</strong> a direction: a <strong>vector</strong>, like 5 km north-east or 20 N straight down. You draw a vector as an arrow. Its length is the <strong>magnitude</strong>, and its direction can be given as an <strong>angle</strong>, a <strong>true bearing</strong> or a <strong>quadrant bearing</strong>.",
    fig:{ aria:"A map grid with a start point. A dashed circle of radius 5 shows every place 5 km from the start; an arrow at bearing 037° picks out one place on it.", shape:"square" }
  },
  goals:[
    "I can tell vector quantities from scalar quantities and give real-world examples.",
    "I can draw and name a vector as a directed line segment and write its magnitude.",
    "I can recognize equal vectors and opposite vectors wherever they are drawn.",
    "I can describe a direction as an angle from the positive `x`-axis, a true bearing or a quadrant bearing, and convert between them.",
    "I can find the magnitude of a vector drawn on a grid.",
    "I can describe displacements and velocities in context with both magnitude and direction."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Distance and Pythagoras", goal:5, prompt:"How long is the segment from (1, 2) to (4, 6)?",
          options:[
            { t:"5", ok:true, why:"Across 3, up 4: `√(9 + 16) = 5`." },
            { t:"7", why:"3 + 4 is a path along the grid, not the straight line." },
            { t:"25", why:"25 is the square of the length." },
            { t:"`√7`", why:"Square each leg first." }],
          hints:["Find the run and the rise.", "Run 3, rise 4.", "`√(3^2 + 4^2) = 5`."] },
        { id:"w2", skill:"Distance and Pythagoras", goal:5, prompt:"A right triangle has legs 5 and 12. How long is the hypotenuse?",
          options:[
            { t:"13", ok:true, why:"`√(25 + 144) = √169`." },
            { t:"17", why:"Adding legs overestimates the hypotenuse." },
            { t:"169", why:"That’s 13²." },
            { t:"`√119`", why:"Subtract only when finding a leg." }],
          hints:["`c^2 = a^2 + b^2`.", "25 + 144 = 169.", "13."] },
        { id:"w3", skill:"Compass directions", goal:4, prompt:"You face north and turn 90° clockwise. Which way do you face?",
          options:[
            { t:"East", ok:true, why:"Clockwise from north: N → E → S → W." },
            { t:"West", why:"Clockwise goes toward east first." },
            { t:"South", why:"90° is a quarter turn." },
            { t:"North-east", why:"North-east is 45° from north." }],
          hints:["Picture a clock face with north at 12.", "Clockwise from 12 goes to 3.", "East."] },
        { id:"w4", skill:"Compass directions", goal:4, prompt:"Measured clockwise from north, what angle points south-west?",
          options:[
            { t:"225°", ok:true, why:"South is 180°; south-west is another 45°." },
            { t:"135°", why:"That’s south-east. South-east is between east (90°) and south (180°)." },
            { t:"45°", why:"Start at north." },
            { t:"315°", why:"That’s north-west. North-west is between west (270°) and north (360°)." }],
          hints:["North 0°, east 90°, south 180°, west 270°.", "South-west is halfway between 180° and 270°.", "225°."] },
        { id:"w5", skill:"Right-triangle trigonometry", goal:4, prompt:"In a right triangle, the side opposite a 30° angle is 4. How long is the hypotenuse?",
          options:[
            { t:"8", ok:true, why:"`sin 30° = 1/2`, so the hypotenuse is twice the opposite side." },
            { t:"2", why:"The hypotenuse is the longest side." },
            { t:"`4√3`", why:"`4√3` is the side adjacent to 30°." },
            { t:"`4√2`", why:"That’s for 45°." }],
          hints:["`sin 30°` = opposite/hypotenuse.", "`1/2 = 4/h`.", "`h = 8`."] },
        { id:"w6", skill:"Right-triangle trigonometry", goal:4, prompt:"A path goes 5 m east and 5 m north. What angle does it make with east?",
          options:[
            { t:"45°", ok:true, why:"Equal legs: an isosceles right triangle." },
            { t:"30°", why:"`tan θ = 5/5 = 1`, so 45°." },
            { t:"60°", why:"`tan 60° = √3`, not 1." },
            { t:"90°", why:"90° is the angle between the legs." }],
          hints:["`tan θ` = opposite/adjacent.", "5/5 = 1.", "45°."] }
      ],
      refreshers:{
        "Distance and Pythagoras":"The straight-line length from `(x_1, y_1)` to `(x_2, y_2)` is `√[(x_2 - x_1)^2 + (y_2 - y_1)^2]`. Example: (0, 0) to (6, 8) is `√100 = 10`.",
        "Compass directions":"Clockwise from north: N 0°, E 90°, S 180°, W 270°. Halfway directions (NE, SE, SW, NW) add 45°.",
        "Right-triangle trigonometry":"`sin` = opp/hyp, `cos` = adj/hyp, `tan` = opp/adj. Special angles: `sin 30° = 1/2`, `sin 45° = √2/2`, `sin 60° = √3/2`."
      }
    }
  },
  explore:{
    heading:"Arrow builder",
    intro:"Drag the tail and the tip of an arrow on the grid. Watch its magnitude and its direction, given three ways. Then compare it with another arrow.",
    modes:[{ id:"draw", t:"Draw" }, { id:"compare", t:"Compare" }, { id:"compass", t:"Compass" }],
    shows:[{ id:"bearing", t:"bearing" }, { id:"angle", t:"angle" }, { id:"both", t:"both" }],
    how:{
      draw:"Tap A or B (or Tab to it), then tap the grid point where it should go, or drag it. Arrow keys move the selected point one unit; Shift + arrow moves 5.",
      compare:"`vec{u}` (teal) is fixed. Move the tail and tip of `vec{v}` the same way as in Draw mode, or use the buttons.",
      compass:"The tail is fixed at the origin. Set the magnitude with the slider and the true bearing with the dial (arrow keys turn 5°, Page Up/Down 15°), or drag the tip."
    },
    refs:[
      { id:"r1", t:"(0, 0) → (3, 4)", v:[0, 0, 3, 4] },
      { id:"r2", t:"(0, 0) → (4, −3)", v:[0, 0, 4, -3] },
      { id:"r3", t:"(−8, −2) → (−2, 6)", v:[-8, -2, -2, 6] }
    ],
    rows:{ name:"Name", rr:"Run, rise", mag:"Magnitude", ang:"Angle from positive `x`-axis", brg:"True bearing", quad:"Quadrant bearing", cmp:"Compare" },
    cmp:{ eq:"`vec{v} = vec{u}`", neg:"`vec{v} = -vec{u}`", same:"same direction, different magnitude", opp:"opposite direction, different magnitude", none:"neither" },
    slideBtn:"Slide `vec{v}` onto `vec{u}`’s tail", revBtn:"Reverse `vec{v}`",
    hideBtn:"Hide the readout (challenge 3)",
    hidden:"Readout hidden for challenge 3. Choose the quadrant bearing of your arrow:",
    tc3chips:[
      { id:"c1", t:"S ≈ 36.9° W" }, { id:"c2", t:"S 45° W" }, { id:"c3", t:"S ≈ 53.1° W" }, { id:"c4", t:"S ≈ 63.4° W" }
    ],
    predIntro:"Make a prediction first. Then the arrow builder shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Compare mode: `vec{u}` goes from (0, 0) to (3, 4); `vec{v}` goes from (2, −3) to (5, 1). Are `vec{u}` and `vec{v}` equal?",
        options:[{ t:"yes: same magnitude and direction", ok:true }, { t:"no: they start at different points" }, { t:"no: different magnitudes" }, { t:"only if they lie on the same line" }],
        explain:"Both have run 3 and rise 4. Position doesn’t matter." },
      { id:"p2", prompt:"Draw mode: A(1, 1), B(4, 5). How does `vec{BA}` compare with `vec{AB}`?",
        options:[{ t:"same magnitude, opposite direction", ok:true }, { t:"they’re equal" }, { t:"same direction, half the magnitude" }, { t:"perpendicular" }],
        explain:"`vec{BA}` runs −3 and rises −4: `vec{BA} = -vec{AB}`." },
      { id:"p3", prompt:"Compass mode, true bearing 300°. What is the quadrant bearing?",
        options:[{ t:"N 60° W", ok:true }, { t:"N 30° W" }, { t:"S 60° W" }, { t:"W 60° N" }],
        explain:"300° is 60° short of 360° (north), on the west side: N 60° W." },
      { id:"p4", prompt:"Compass mode, true bearing 135°. What angle does this vector make, measured counterclockwise from the positive `x`-axis?",
        options:[{ t:"315°", ok:true }, { t:"135°" }, { t:"45°" }, { t:"225°" }],
        explain:"Bearing 135° points south-east. From east, counterclockwise, that’s 360° − 45° = 315° (or −45°). Angle = 90° − bearing, plus 360° if needed." }
    ],
    chalIntro:"Use the arrow builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Compare mode: `vec{u}` goes from (0, 0) to (4, −3). Draw `vec{v}` equal to `vec{u}` with its tail at (−3, 2).",
        why:"`vec{v}` from (−3, 2) to (1, −1) has run 4 and rise −3, like `vec{u}`.",
        hints:["Equal means the same run and rise.", "Run 4, rise −3 from (−3, 2).", "Tip at (1, −1)."],
        msgs:{ mode:"Switch to Compare mode first.", ref:"Choose `vec{u}` from (0, 0) to (4, −3) first.", tail:"Put the tail of `vec{v}` at (−3, 2).",
          neg:"That’s `-vec{u}`: same length, opposite way.", copy:"You copied `vec{u}`’s tip; move the whole arrow, keeping run 4 and rise −3.", rise:"Rise should be −3, not +3.",
          other:"`vec{v}` has run {r} and rise {s}; `vec{u}` has run 4 and rise −3." } },
      { id:"tc2", goal:5, prompt:"Draw mode: draw any vector with magnitude 13 that points between north and east.",
        why:"Run and rise 5 and 12 (or 12 and 5), both positive: `√(25 + 144) = 13`.",
        hints:["Which whole-number right triangle has hypotenuse 13?", "5-12-13.", "Run 5, rise 12 (or run 12, rise 5), both positive."],
        msgs:{ mode:"Switch to Draw mode first.", se:"That points south of east.", nw:"That’s north-west.", sw:"That points south-west.",
          due:"That’s due {d}, not between north and east.", mag:"Magnitude {m}; you need 13 exactly." } },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Draw a vector with <strong>whole-number</strong> run and rise, magnitude exactly 10, pointing into the south-west quadrant and <strong>closer to south than to west</strong>. Then enter its quadrant bearing in the form S __° W (the readout is hidden for this challenge; choose from 4 chips).",
        why:"Run −6, rise −8: magnitude 10, more down than across. From south, turning toward west, the angle is about 36.9°: S ≈ 36.9° W.",
        hints:["Magnitude 10 with whole numbers: think 6-8-10.", "South-west: both negative. Closer to south: more down than across.", "Run −6, rise −8. From south, turning toward west, the angle is less than 45°."],
        msgs:{ mode:"Switch to Draw mode first.", west:"That’s closer to west: more across than down.", se:"That’s south-east.",
          diag:"Magnitude `7√2 ≈ 9.9`, and it’s exactly south-west, not closer to south.", mag:"Magnitude {m}; you need exactly 10.",
          quad:"Point it into the south-west quadrant: run and rise both negative.", near:"Closer to south means more down than across.",
          chip:"The arrow is right. Now hide the readout and choose the quadrant bearing chip.",
          c3:"That angle is measured from west.", c2:"S 45° W is exactly south-west; your arrow is closer to south.", c4:"More than 45° from south would be closer to west." } }
    ]
  },
  part3:{
    slug:"scalar-vector", name:"Scalar or vector?",
    heading:"Scalar or vector?",
    intro:"Sort real quantities into scalars and vectors. Then see why a distance alone can’t tell you where someone is. Then try the quick check.",
    st1:{ title:"Station 1: Sort the quantities", noun:"card",
      boxes:[{ id:"s", label:"Scalar", sub:"magnitude only" }, { id:"v", label:"Vector", sub:"magnitude and direction" }],
      items:[
        { id:"k1", t:"A hike of 6 km north-west", answer:"v", why:"A distance with a direction: a displacement.", wrong:{ s:"A distance with a direction: a displacement." } },
        { id:"k2", t:"A hike of 6 km", answer:"s", why:"No direction: a distance.", wrong:{ v:"No direction: a distance." } },
        { id:"k3", t:"90 km/h due east", answer:"v", why:"Speed plus direction: a velocity.", wrong:{ s:"Speed plus direction: a velocity." } },
        { id:"k4", t:"90 km/h", answer:"s", why:"Speed alone.", wrong:{ v:"Speed alone." } },
        { id:"k5", t:"A backpack’s weight, 60 N", answer:"v", why:"Weight is a force, and it always points down.", wrong:{ s:"Weight is a force, and it always points down." } },
        { id:"k6", t:"A backpack’s mass, 6 kg", answer:"s", why:"Mass has no direction.", wrong:{ v:"Mass has no direction." } },
        { id:"k7", t:"−12 °C", answer:"s", why:"The minus sign means below zero, not a direction in space.", wrong:{ v:"The minus sign means below zero, not a direction in space." } },
        { id:"k8", t:"A wind of 30 km/h from the west", answer:"v", why:"‘From the west’ is a direction.", wrong:{ s:"‘From the west’ is a direction." } },
        { id:"k9", t:"3 hours", answer:"s", why:"Time has no direction.", wrong:{ v:"Time has no direction." } },
        { id:"k10", t:"A pull of 200 N up a ramp", answer:"v", why:"A force with a direction.", wrong:{ s:"A force with a direction." } }
      ] },
    st2:{ title:"Station 2: Where am I?",
      text:"A friend texts: “I’m 6 km from the trailhead.”",
      circle:"She could be anywhere on this circle.",
      addBtn:"Add a direction",
      dialLabel:"Bearing from the trailhead",
      one:"6 km at bearing {b}: one exact place.",
      algTitle:"Check it with algebra",
      alg:["With the trailhead at (0, 0), every point 6 km away satisfies `x^2 + y^2 = 36`: infinitely many points.",
        "Adding “bearing 060°” gives one point, `(6 sin 60°, 6 cos 60°) = (3√3, 3)`."],
      real:["<strong>GPS</strong> reports displacement: how far, and which way.", "<strong>Animators</strong> move sprites by vectors.", "<strong>Engineers</strong> add forces on bridges."] },
    quickCheck:{
      title:"Quick check", summary:"Scalar or vector? quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which is a vector?",
          choices:[
            { t:"15 N downward", ok:true, fb:"Right. Only the force has a direction." },
            { t:"15 kg", fb:"Only the force has a direction." },
            { t:"15 s", fb:"Only the force has a direction." },
            { t:"15 °C", fb:"Only the force has a direction." }] },
        { id:"q2", goal:6, prompt:"Why isn’t “8 km from the school” enough to find someone?",
          choices:[
            { t:"Many points are 8 km away", ok:true, fb:"Right. They’re on a circle of radius 8 km." },
            { t:"8 km is too far", fb:"They’re on a circle of radius 8 km." },
            { t:"Distances can’t be measured", fb:"They’re on a circle of radius 8 km." },
            { t:"Schools move", fb:"They’re on a circle of radius 8 km." }] },
        { id:"q3", goal:1, prompt:"Is −40 °C a vector?",
          choices:[
            { t:"No: it has no direction in space", ok:true, fb:"Right. " + M5 },
            { t:"Yes: it’s negative", fb:M5 },
            { t:"Yes: it has a size", fb:M5 },
            { t:"Only in winter", fb:M5 }] },
        { id:"q4", goal:1, prompt:"Speed is to velocity as distance is to…",
          choices:[
            { t:"Displacement", ok:true, fb:"Right. Each pair is scalar → vector." },
            { t:"Time", fb:"Each pair is scalar → vector." },
            { t:"Acceleration", fb:"Each pair is scalar → vector." },
            { t:"Mass", fb:"Each pair is scalar → vector." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"sorter", title:"Equal, opposite, or neither?", summary:"Equal, opposite, or neither?", noun:"pair", goal:[2, 3, 5],
        instruction:"Find the run and rise of each arrow, then sort each pair.",
        boxes:[{ id:"eq", label:"Equal" }, { id:"op", label:"Opposite (same magnitude)" }, { id:"par", label:"Parallel, different magnitude" }, { id:"np", label:"Not parallel" }],
        items:[
          { id:"i1", t:pairTile([0, 0, 2, 3], [4, 1, 6, 4]), answer:"eq", why:"Both have run 2 and rise 3.",
            wrong:{ np:"A vector is only a magnitude and a direction. Slide one onto the other." } },
          { id:"i2", t:pairTile([1, 1, 4, 5], [4, 5, 1, 1]), answer:"op", why:"(3, 4) and (−3, −4): every sign flipped.", wrong:{ eq:M2 } },
          { id:"i3", t:pairTile([0, 0, 3, 1], [-2, 2, 4, 4]), answer:"par", why:"(6, 2) = 2 × (3, 1): same direction, twice as long." },
          { id:"i4", t:pairTile([0, 0, 3, 4], [0, 0, 4, 3]), answer:"np", why:"Both have magnitude 5, but (3, 4) and (4, 3) point different ways.",
            wrong:{ eq:"Same magnitude, but run 3 / rise 4 isn’t run 4 / rise 3." } },
          { id:"i5", t:pairTile([-3, 0, 0, -2], [5, 1, 2, 3]), answer:"op", why:"(3, −2) and (−3, 2): every sign flipped.",
            hints:["Run/rise: (3, −2) and (−3, 2).", "Every sign flipped.", "Opposite."] },
          { id:"i6", t:pairTile([2, -1, 2, 4], [-4, -3, -4, 2]), answer:"eq", why:"Both have run 0 and rise 5." },
          { id:"i7", t:pairTile([0, 0, -2, 4], [3, 3, 4, 1]), answer:"par", why:"(−2, 4) = −2 × (1, −2): parallel, opposite way, twice as long.",
            wrong:{ op:"Opposite needs the same magnitude: `√20` vs `√5`." },
            hints:["Find run and rise for each.", "(−2, 4) and (1, −2).", "(−2, 4) = −2 × (1, −2): parallel, opposite way, twice as long."] },
          { id:"i8", t:pairTile([1, 2, 3, 2], [1, 2, 1, 4]), answer:"np", why:"(2, 0) and (0, 2): same magnitude 2, but one points east and one points north." }
        ],
        wrongDefault:"Compare run and rise: equal (same), opposite (both signs flipped), parallel (a multiple)." },
      { id:"dirs", type:"custom", title:"Directions three ways", summary:"Directions three ways", star:true, goal:[4, 6],
        instruction:"Convert between angles, true bearings and quadrant bearings. Items 5 to 8 are non-routine; 7 and 8 go beyond the Final Check.",
        how:"Type a number of degrees (the ° is optional), then press Check. Items 2 and 7: tap a chip.",
        items:[
          { id:"d1", goal:4, prompt:"True bearing of S 30° E.", label:"True bearing", answer:150,
            wrong:[{ v:120, fb:"From south, turn 30° toward east: 180° − 30°." }] },
          { id:"d2", goal:4, prompt:"Quadrant bearing of the true bearing 250°.", chips:true,
            choices:[
              { t:"S 70° W", ok:true, fb:"250° is 70° past south, toward west." },
              { t:"S 20° W", fb:"250° is 70° past south." },
              { t:"N 70° W", fb:"250° is between 180° and 270°: the south side." },
              { t:"S 70° E", fb:"Past 180° is toward west." }] },
          { id:"d3", goal:4, prompt:"True bearing of the angle 120° (counterclockwise from the positive `x`-axis).", label:"True bearing", answer:330,
            wrong:[{ v:120, fb:"Bearing = 90° − angle, plus 360° if negative." }] },
          { id:"d4", goal:4, prompt:"Angle from the positive `x`-axis for the true bearing 045°.", label:"Angle", answer:45,
            wrong:[{ v:135, fb:"Bearing 045° is north-east, which is also 45° from east." }] },
          { id:"d5", goal:6, star:true, prompt:"A ship sails S 25° E. On the way back, what true bearing does it sail?", label:"True bearing", answer:335,
            wrong:[{ v:155, fb:"That’s the way out. Reverse: add 180°." }, { v:245, fb:"Reversing is 180°, not 90°." }] },
          { id:"d6", goal:6, star:true, prompt:"Bearing from A to B is 070°. Bearing from B to A?", label:"True bearing", answer:250,
            wrong:[{ v:160, fb:M7 }, { v:290, fb:"Subtracting from 360° reflects; it doesn’t reverse." }] },
          { id:"d7", goal:4, star:true, prompt:"A vector at true bearing 210° is turned 90° counterclockwise. New quadrant bearing?", chips:true,
            choices:[
              { t:"S 60° E", ok:true, fb:"210° − 90° = 120°, which is 60° short of south, toward east." },
              { t:"N 60° W", fb:"Counterclockwise lowers the bearing: 210° − 90° = 120°." },
              { t:"S 30° W", fb:M3 },
              { t:"S 60° W", fb:"A quarter turn from 210° lands on 120° or 300°, never 240°." }],
            hints:["Counterclockwise turns subtract from a bearing.", "210° − 90° = 120°.", "120° is 60° short of south, toward east: S 60° E."] },
          { id:"d8", goal:4, star:true, prompt:"Two vectors: one at bearing 340°, one at N 20° E. What’s the angle between them?", label:"Angle between", answer:40,
            wrong:[{ v:320, fb:"Take the smaller angle between the directions." }, { v:0, fb:"N 20° E is 020°, on the other side of north from 340°." }],
            hints:["Write both as true bearings.", "340° and 020°.", "From 340° to 360° is 20°, then 20° more: 40°."] }
        ],
        wrongDefault:"Sketch a compass: N 0°, E 90°, S 180°, W 270°. Then find the direction on it." },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Gia", how:"", goal:[3, 4],
        instruction:"Gia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Write the true bearing 290° as a quadrant bearing and as an angle from the positive `x`-axis.",
            steps:["290° is between 270° (west) and 360° (north).", "290° − 270° = 20°, so the quadrant bearing is N 20° W.", "As an angle: 90° − 290° = −200°, so 160°.", "So the vector is at N 20° W, or 160°."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct on its own: −200° + 360° = 160°.", "Step 4 copies step 2’s answer."],
            fixes:[
              { t:"Measure from north: 360° − 290° = 70°, so N 70° W.", ok:true, why:"Quadrant bearings start at north or south." },
              { t:"W 20° N is the standard form.", why:"Quadrant bearings start from N or S." },
              { t:"S 20° W.", why:"290° is on the north side." },
              { t:"Step 2 is correct.", why:"20° is measured from west, but quadrant bearings start at north." }],
            hints:["Where does a quadrant bearing start?", "North (or south).", "360° − 290° = 70°: N 70° W."] },
          { id:"e2", goal:3, task:"`vec{u}` goes from P(−2, 1) to Q(3, 4). Draw `-vec{u}` with its tail at the origin, and give its magnitude.",
            steps:["`vec{u}` has run 5 and rise 3.", "`-vec{u}` has run −3 and rise 5.", "So `-vec{u}` goes from (0, 0) to (−3, 5).", "Its magnitude is `√34`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "The magnitude is right for any of these."],
            fixes:[
              { t:"`-vec{u}` has run −5 and rise −3: from (0, 0) to (−5, −3), magnitude `√34`.", ok:true, why:"The opposite vector flips both signs." },
              { t:"`-vec{u}` has run 5 and rise −3.", why:"Flip <strong>both</strong> signs." },
              { t:"`-vec{u}` has run −5 and rise 3.", why:"Flip both." },
              { t:"Step 2 is correct.", why:"Swapping and flipping one sign turns the arrow 90°; the opposite turns it 180°." }],
            hints:["What does ‘opposite’ do to the run and rise?", "Both change sign.", "(−5, −3)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that arrows in different places can be equal, or something else?" },
      { id:"j2", q:"In your own words, what’s the difference between a scalar and a vector? Give one example of each from your day." },
      { id:"j3", q:"Explain to a friend how to turn a true bearing into a quadrant bearing." },
      { id:"j4", q:"Which way of naming directions still confuses you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a vector quantity?", options:[
          { t:"A train’s velocity, 120 km/h west", ok:true, why:"It has a size and a direction." },
          { t:"A train’s speed, 120 km/h", why:"No direction." },
          { t:"A train’s mass, 50 t", why:"Mass has no direction." },
          { t:"A train’s travel time, 2 h", why:"Time has no direction." }] },
        b:{ prompt:"Which is a vector quantity?", options:[
          { t:"A rope’s pull, 200 N up a ramp", ok:true, why:"A force with a direction." },
          { t:"A temperature of −8 °C", why:M5 },
          { t:"A distance of 3 km", why:"No direction." },
          { t:"An energy of 500 J", why:"Energy has no direction." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"What is the quadrant bearing of the true bearing 230°?", options:[
          { t:"S 50° W", ok:true, why:"230° − 180° = 50° past south, toward west." },
          { t:"S 40° W", why:"40° is measured from west. " + M4 },
          { t:"N 50° W", why:"230° is on the south side." },
          { t:"S 50° E", why:"Past 180° is toward west." }] },
        b:{ prompt:"What is the quadrant bearing of the true bearing 110°?", options:[
          { t:"S 70° E", ok:true, why:"180° − 110° = 70° from south, toward east." },
          { t:"S 20° E", why:"20° is measured from east. " + M4 },
          { t:"N 70° E", why:"110° is past east, on the south side." },
          { t:"S 70° W", why:"Before 180° is toward east." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is `|vec{AB}|` for A(−2, 3) and B(4, −5)?", options:[
          { t:"2", why:"6 + (−8): signed components can’t be added for a length." },
          { t:"10", ok:true, why:"Run 6, rise −8: `√(36 + 64)`." },
          { t:"14", why:"Magnitude is the hypotenuse: `√(6^2 + 8^2) = 10`." },
          { t:"100", why:"That’s the square of the magnitude." }] },
        b:{ prompt:"What is `|vec{AB}|` for A(1, −4) and B(−4, 8)?", options:[
          { t:"7", why:"−5 + 12: signed components can’t be added for a length." },
          { t:"13", ok:true, why:"Run −5, rise 12: `√(25 + 144)`." },
          { t:"17", why:"Magnitude is the hypotenuse: `√(5^2 + 12^2) = 13`." },
          { t:"169", why:"That’s the square of the magnitude." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`vec{u}` goes from P(1, 2) to Q(4, 6). Which arrow is equal to `vec{u}`?", options:[
          { t:"From (−3, 0) to (0, 4)", ok:true, why:"Run 3, rise 4, like `vec{u}`." },
          { t:"From (4, 6) to (1, 2)", why:"That’s `-vec{u}`. " + M2 },
          { t:"From (0, 0) to (4, 6)", why:"Run 4, rise 6: you used Q’s coordinates." },
          { t:"From (1, 2) to (4, 7)", why:"Rise 5, not 4." }] },
        b:{ prompt:"`vec{u}` goes from P(−1, 3) to Q(2, −1). Which arrow is equal to `vec{u}`?", options:[
          { t:"From (2, 2) to (5, −2)", ok:true, why:"Run 3, rise −4." },
          { t:"From (2, −1) to (−1, 3)", why:"That’s `-vec{u}`: same length, opposite direction." },
          { t:"From (0, 0) to (2, −1)", why:"That uses Q’s coordinates." },
          { t:"From (2, 2) to (5, 2)", why:"Rise 0, not −4." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A drone flies at a true bearing of 300°. What is its direction as an angle counterclockwise from the positive `x`-axis?", options:[
          { t:"60°", why:"360° − 300° reflects the bearing; it doesn’t convert it." },
          { t:"150°", ok:true, why:"90° − 300° = −210°; add 360°." },
          { t:"210°", why:"300° − 90° turns the wrong way." },
          { t:"300°", why:M3 }] },
        b:{ prompt:"A drone flies at a true bearing of 200°. What is its direction as an angle counterclockwise from the positive `x`-axis?", options:[
          { t:"110°", why:"200° − 90° turns the wrong way." },
          { t:"160°", why:"360° − 200° reflects it." },
          { t:"200°", why:M3 },
          { t:"250°", ok:true, why:"90° − 200° = −110°; add 360°." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A hiker walks 5 km east, then 5 km north. Which describes her displacement from the start?", options:[
          { t:"`5√2` km at N 45° E", ok:true, why:"A right triangle with legs 5 and 5." },
          { t:"10 km at N 45° E", why:"10 km is the distance walked, not the displacement." },
          { t:"`5√2` km at S 45° W", why:"That’s the way back to the start." },
          { t:"`5√2` km at N 45° W", why:"She went east, not west." }] },
        b:{ prompt:"A hiker walks `2√3` km south, then 2 km west. Which describes her displacement from the start?", options:[
          { t:"4 km at S 30° W", ok:true, why:"`√(12 + 4) = 4`; `tan φ = 2/(2√3) = 1/√3`, so 30° from south." },
          { t:"`(2 + 2√3)` km at S 30° W", why:"That’s the distance walked. Magnitude is the hypotenuse: `√(12 + 4) = 4`." },
          { t:"4 km at S 60° W", why:"60° is measured from west." },
          { t:"4 km at N 30° E", why:"That’s the way back." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"`vec{AB}` and `vec{CD}` are drawn in different places on a map. Which is the best explanation of how they can be equal?", options:[
          { t:"“A vector is defined only by its magnitude and direction. If `vec{AB}` and `vec{CD}` have the same length and point the same way, sliding one onto the other matches them exactly.”", ok:true, why:"Position doesn’t matter." },
          { t:"“They’re equal because they have the same length.”", why:"Direction matters too." },
          { t:"“They can’t be equal, because they start at different points.”", why:M1 },
          { t:"“They’re equal because they’re parallel.”", why:"Parallel arrows can point opposite ways or have different lengths." }] },
        b:{ prompt:"Which is the best explanation of why `vec{AB} ≠ vec{BA}`?", options:[
          { t:"“They have the same magnitude but opposite directions, so `vec{BA} = -vec{AB}`.”", ok:true, why:"Same segment, opposite way." },
          { t:"“They have different magnitudes.”", why:"The segment is the same length either way." },
          { t:"“They’re equal, because they join the same two points.”", why:M2 },
          { t:"“`vec{BA}` is perpendicular to `vec{AB}`.”", why:M7 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"An arrow from the origin has length 8 and points 30° west of north. Which description is correct?", options:[
          { t:"`|vec{v}| = 8`, true bearing 330°", ok:true, why:"30° west of north is 360° − 30° = 330°." },
          { t:"`|vec{v}| = 8`, true bearing 030°", why:"That’s 30° <strong>east</strong> of north." },
          { t:"`|vec{v}| = 8`, N 60° W", why:"30° west of north is N 30° W. " + M4 },
          { t:"`|vec{v}| = 8`, angle 330° from the positive `x`-axis", why:"330° from east points south-east. " + M3 }] },
        b:{ prompt:"An arrow from the origin has length 6 and points 45° east of south. Which description is correct?", options:[
          { t:"`|vec{v}| = 6`, true bearing 135°", ok:true, why:"45° east of south is 180° − 45° = 135°." },
          { t:"`|vec{v}| = 6`, true bearing 225°", why:"That’s south-west." },
          { t:"`|vec{v}| = 6`, S 45° W", why:"That’s 45° west of south." },
          { t:"`|vec{v}| = 6`, angle 135° from the positive `x`-axis", why:"135° from east points north-west. " + M3 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Two hikers are each 5 km from a trailhead. Hiker 1 is at a bearing of 040° and hiker 2 at 220°. How far apart are they?", options:[
          { t:"0 km", why:"Same distance doesn’t mean same place." },
          { t:"5 km", why:"The bearings differ by 180°: they’re on opposite sides." },
          { t:"`5√2` km", why:"Bearings 180° apart point in opposite directions, not perpendicular ones." },
          { t:"10 km", ok:true, why:"220° − 40° = 180°: they’re on opposite sides of the trailhead." }] },
        b:{ prompt:"Two hikers are each 5 km from a trailhead, at bearings 070° and 160°. How far apart are they?", options:[
          { t:"0 km", why:"Same distance doesn’t mean same place." },
          { t:"5 km", why:"The bearings differ by 90°: use legs of 5 and 5." },
          { t:"`5√2` km", ok:true, why:"160° − 70° = 90°: legs of 5 and 5." },
          { t:"10 km", why:"They’d be 10 km apart only if the bearings differed by 180°." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A boat’s velocity is 15 km/h at N 30° E. Where is it after 2 h, relative to its start?", options:[
          { t:"30 km at N 30° E", ok:true, why:"Displacement = velocity × time, same direction." },
          { t:"30 km", why:"Without a direction it’s only a distance." },
          { t:"15 km at N 30° E", why:"Multiply by the 2 h." },
          { t:"30 km at N 60° E", why:"The direction doesn’t change. " + M4 }] },
        b:{ prompt:"A car’s velocity is 80 km/h at a bearing of 200°. Where is it after 1.5 h, relative to its start?", options:[
          { t:"120 km at a bearing of 200°", ok:true, why:"80 × 1.5 = 120 km, same direction." },
          { t:"120 km", why:"Without a direction it’s only a distance." },
          { t:"80 km at a bearing of 200°", why:"Multiply by the 1.5 h." },
          { t:"120 km at a bearing of 020°", why:"That’s the opposite direction." }] } }
    ]
  },
  task:{
    title:"Turn left 90°", summary:"Turn left 90°",
    statement:"<p>Draw three vectors from the origin with whole-number run and rise that meet every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`|vec{u}|` is a whole number from 5 to 10.</li><li>`vec{u}` points between east and south (true bearing strictly between 090° and 180°).</li><li>`vec{v}` is the opposite of `vec{u}`.</li><li>`vec{w}` has the same magnitude as `vec{u}`, and its true bearing is exactly 90° less than `vec{u}`’s.</li></ol></div>" +
      "<p class=\"tiny muted\">Set each run and rise (whole numbers from −10 to 10) with the steppers, or drag the tips on the grid.</p>",
    checks:["`|vec{u}|` is a whole number from 5 to 10", "`vec{u}` points south-east", "`vec{v} = -vec{u}`", "`vec{w}`: same magnitude, bearing 90° less"],
    tips:["Whole-number magnitudes need a Pythagorean triple: 3-4-5 or 6-8-10.",
      "South-east: run positive, rise negative.",
      "Flip both signs.",
      "A smaller bearing means turning counterclockwise. A quarter turn counterclockwise sends `(a, b)` to `(-b, a)`."],
    explainPrompt:"Explain why you could find `vec{v}` and `vec{w}` from `vec{u}` without measuring any angles.",
    vocab:"Use the words magnitude, opposite, true bearing and counterclockwise.",
    more:"There’s more than one answer. Find them all.",
    afterAt:4,
    after3:"Only 5 and 10 are possible magnitudes, because 6, 7, 8 and 9 aren’t hypotenuses of whole-number right triangles (other than along the axes, which line 2 rules out)."
  },
  cards:[
    ["Vector", "A quantity with magnitude and direction: displacement, velocity, force."],
    ["Scalar", "A quantity with magnitude only: distance, speed, mass, time, temperature."],
    ["`vec{AB}`", "The vector from A to B, drawn as an arrow from A to B."],
    ["`|vec{u}|`", "The magnitude (length) of `vec{u}`."],
    ["Equal vectors", "Same magnitude and direction, anywhere on the plane."],
    ["Opposite vectors", "Same magnitude, opposite direction: `vec{BA} = -vec{AB}`."],
    ["True bearing", "Three digits, clockwise from north: 320°."],
    ["Quadrant bearing", "Start at N or S, turn toward E or W: N 40° W = 320°."],
    ["Angle from the positive `x`-axis", "Counterclockwise from east. Angle = 90° − bearing (add 360° if negative)."],
    ["Reversing a direction", "Add or subtract 180°."],
    ["Magnitude on a grid", "√(run² + rise²)."]
  ]
};
