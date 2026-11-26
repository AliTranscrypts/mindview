// MHF4U 25 Radian Measure. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/25-radian-measure.md
// Every θ inside `math` is coloured cerulean (@t) by deep() at the bottom (05-colour-key: θ is the only parameter colour here).

// ---------- Practice 1 "Where does it land?" (tap-to-sort): feedback and hints built from each item ----------
const BENCH = { 1:["π/2", "1.57"], 2:["π", "3.14"], 3:["3π/2", "4.71"], 4:["2π", "6.28"] };   // benchmark at the END of quadrant n
const LOW = { 1:"0", 2:"π/2 ≈ 1.57", 3:"π ≈ 3.14", 4:"3π/2 ≈ 4.71" }, HIGH = { 1:"π/2 ≈ 1.57", 2:"π ≈ 3.14", 3:"3π/2 ≈ 4.71", 4:"2π ≈ 6.28" };
const adj = (a, b) => Math.abs(a - b) === 1 || Math.abs(a - b) === 3;
const between = (a, b) => (Math.abs(a - b) === 3 ? BENCH[4] : BENCH[Math.min(a, b)]);
function decItem(id, v, q, why, deg, spec, hints){
  const wrong = {};
  for (const b of [1, 2, 3, 4]) {
    if (b === q) continue;
    if (spec && spec[b]) wrong["q" + b] = spec[b];
    else if (b === 1 && v > Math.PI / 2) wrong.q1 = `Did you read ${v} as degrees? With no degree sign, ${v} means ${v} radians, and one radian is about 57°. Compare ${v} with π/2 ≈ 1.57.`;
    else if (adj(b, q)) { const [bn, bv] = between(b, q); wrong["q" + b] = `Check the benchmark between those two quadrants: ${bn} ≈ ${bv}. Is ${v} more or less than that?`; }
    else wrong["q" + b] = `Compare ${v} with the benchmarks in the box.`;
  }
  return { id, t:String(v), answer:"q" + q, why, wrong, goal:[3, 2],
    hints:hints || [`Compare ${v} with the benchmarks in the box.`, `${v} is between ${LOW[q]} and ${HIGH[q]}.`, `So ${v} ends in quadrant ${q}, about ${deg}°.`] };
}
function piItem(id, tex, coef, q, why, deg, hints){
  const wrong = {}, w = `Write ${tex} as a number times π: ${tex} ${coef}π. Quadrant 1 runs to 0.5π, quadrant 2 to π, quadrant 3 to 1.5π and quadrant 4 to 2π.`;
  for (const b of [1, 2, 3, 4]) if (b !== q) wrong["q" + b] = w;
  return { id, t:tex, answer:"q" + q, why, wrong, goal:[3, 2],
    hints:hints || [`Compare ${tex} with the benchmarks in the box.`, `Write it as ${coef[0] === "≈" ? "about " + coef.slice(2) : coef.slice(2)}π first.`, `So ${tex} ends in quadrant ${q}. It’s ${deg}°.`] };
}

// ---------- Part 3 unit chains: tile feedback ----------
const TILE_PI = "One turn is 2π radians. π radians is only half a turn.";
const upside = u => `This tile puts ‘${u}’ on top again, so ‘${u}’ can’t cancel. Use the tile with ‘${u}’ underneath.`;
const HOURS = "This brings in hours, which aren’t in the question.";
const U3TIME = "The answer stays per hour, so the time units don’t change. Only ‘turn’ needs to become ‘rad’.";

const CONTENT = {
  id:"25-radian-measure",
  kind:"topic",
  title:"Radian measure",
  topic:"Radian Measure",
  readyTopic:"radian measure",
  hero:{
    eq:"`a = rθ`", eqLabel:"a equals r theta",
    headline:"Measure an angle with the circle’s own radius",
    text:"Lay a circle’s radius along its edge. The angle it makes at the centre is <strong>one radian</strong>. The circumference is `2πr`, so exactly <strong>2π</strong> radius lengths fit around any circle: a full turn is 2π radians. Measuring angles this way makes <strong>arc length</strong> simple, `a = rθ`, and lets you describe how fast something spins with <strong>angular velocity</strong>.",
    fig:{ shape:"square", aria:"A circle of radius 1. Copies of the radius wrap around its edge: 6 radius lengths and a small gap make a full turn." },
    caps:["1 radian ≈ 57.3°: the arc is exactly one radius long", "6 radius lengths and a bit: a full turn is 2π ≈ 6.28 radians"]
  },
  goals:[
    "I can explain what one radian is, and why a full turn is 2π radians.",
    "I can convert between degrees and radians, giving exact answers in terms of π and decimal approximations.",
    "I can picture an angle given in radians, including a decimal like 2.5 or an angle past a full turn, and name the quadrant its terminal arm ends in.",
    "I can use `a = rθ` to find an arc length, a radius or an angle, with `θ` in radians.",
    "I can find angular velocity in radians per second, including from rotations per minute, and use `v = rω` to find how fast a point on a wheel moves.",
    "I can find the trig ratios of an angle in radians from a tool or from given values, and spot an answer that came from degree mode."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Circles", goal:1, fixedOrder:true,
          prompt:"A circle has radius 5 cm. What is its circumference?",
          options:[
            { t:"10 cm", why:"10 cm is the diameter. The circumference is π times the diameter: 10π cm." },
            { t:"5π cm", why:"The circumference is `2πr` (or `πd`). With `r` = 5 cm, that’s 10π cm." },
            { t:"10π cm", ok:true, why:"`C = 2πr = 2π × 5 = 10π` cm, about 31.4 cm." },
            { t:"25π cm", why:"25π cm² is the area, `πr^2`. The circumference is `2πr` = 10π cm." }],
          hints:["The circumference is the distance around the circle.", "`C = 2πr`, or π times the diameter.", "`C = 2π × 5 = 10π` cm."] },
        { id:"w2", skill:"Circles", goal:4, fixedOrder:true,
          prompt:"A circle has circumference 36 cm. How long is the arc cut off by a 60° angle at the centre?",
          options:[
            { t:"0.6 cm", why:"36 ÷ 60 doesn’t give a fraction of the circle. 60° is 60/360 of a full turn." },
            { t:"6 cm", ok:true, why:"60° is 60/360 = 1/6 of a full turn, so the arc is 1/6 of 36 cm: 6 cm." },
            { t:"12 cm", why:"60/180 = 1/3 would be right only if a full turn were 180°. A full turn is 360°, so 60° is 1/6 of it." },
            { t:"60 cm", why:"That’s longer than the whole circle (36 cm). The arc is a fraction of the circumference: 1/6 × 36 = 6 cm." }],
          hints:["What fraction of a full turn is 60°?", "60° is 60/360 = 1/6 of a turn, so the arc is 1/6 of the circumference.", "36 × 1/6 = 6 cm."] },
        { id:"w3", skill:"Rates and units", goal:5, fixedOrder:true,
          prompt:"A car travels at 72 km/h. What is that in metres per second?",
          options:[
            { t:"1.2 m/s", why:"72 ÷ 60 = 1.2 is kilometres per minute. You still need metres and seconds." },
            { t:"20 m/s", ok:true, why:"72 km = 72 000 m and 1 h = 3600 s, so 72 000 ÷ 3600 = 20 m/s." },
            { t:"259.2 m/s", why:"72 × 3.6 goes the wrong way. 1 m/s is 3.6 km/h, so the same speed is a smaller number in m/s: 72 ÷ 3.6 = 20." },
            { t:"1200 m/s", why:"72 000 ÷ 60 = 1200 is metres per <strong>minute</strong>. Divide by 60 again for seconds." }],
          hints:["Change kilometres to metres and hours to seconds.", "72 km = 72 000 m, and 1 h = 60 × 60 = 3600 s.", "72 000 ÷ 3600 = 20 m/s."] },
        { id:"w4", skill:"Rates and units", goal:5,
          prompt:"A wheel turns 3 times every 2 seconds. How many times does it turn in one minute?",
          options:[
            { t:"1.5", why:"1.5 is turns per <strong>second</strong>. A minute has 60 seconds." },
            { t:"40", why:"60 × 2/3 = 40 uses seconds per turn. The wheel makes 3/2 = 1.5 turns each second." },
            { t:"90", ok:true, why:"3 turns in 2 s is 1.5 turns per second, and 1.5 × 60 = 90 turns per minute." },
            { t:"180", why:"3 × 60 = 180 assumes 3 turns every second. It’s 3 turns every 2 seconds." }],
          hints:["Find the number of turns in 1 second first.", "3 turns in 2 s is 1.5 turns per second.", "1.5 × 60 = 90 turns per minute."] },
        { id:"w5", skill:"Angles in standard position", goal:3, fixedOrder:true,
          prompt:"An angle in standard position measures 160°. In which quadrant is its terminal arm?",
          options:[
            { t:"Quadrant 1", why:"20° is the related angle. The angle itself, 160°, is past 90°." },
            { t:"Quadrant 2", ok:true, why:"Start on the positive `x`-axis and turn counterclockwise: 90° < 160° < 180°, so the arm is in quadrant 2." },
            { t:"Quadrant 3", why:"Standard position turns <strong>counterclockwise</strong>. Turning 160° clockwise would end in quadrant 3." },
            { t:"Quadrant 4", why:"Quadrants are numbered counterclockwise from the top right: 1, 2, 3, 4. The top-left quadrant is quadrant 2." }],
          hints:["Start on the positive `x`-axis and turn counterclockwise.", "Quadrant 1 ends at 90°, quadrant 2 at 180°, quadrant 3 at 270°.", "90° < 160° < 180°, so the arm is in quadrant 2."] },
        { id:"w6", skill:"Trig ratios", goal:6, fixedOrder:true,
          prompt:"What is the exact value of `sin 150°`?",
          options:[
            { t:"`-{√3}/{2}`", why:"√3/2 is `sin 60°`, and sine is positive in quadrant 2." },
            { t:"`-{1}/{2}`", why:"In quadrant 2 the arm is above the `x`-axis, so sine is positive." },
            { t:"`{1}/{2}`", ok:true, why:"150° is in quadrant 2 with related angle 180° − 150° = 30°. Sine is positive there, so `sin 150° = sin 30° = 1/2`." },
            { t:"`{√3}/{2}`", why:"√3/2 is `sin 60°`. The related angle of 150° is 30°." }],
          hints:["Find the related angle and the sign of sine in quadrant 2.", "The related angle is 180° − 150° = 30°, and sine is positive in quadrant 2.", "`sin 150° = sin 30° = 1/2`."] }
      ],
      refreshers:{
        "Circles":"The circumference of a circle is `C = 2πr` (or `πd`). An arc is a fraction of it: a 60° angle at the centre is 60/360 = 1/6 of a turn, so its arc is 1/6 of the circumference. Example: `r` = 5 cm gives `C` = 10π cm, so a 60° arc is 10π/6 = 5π/3 cm.",
        "Rates and units":"To change the units of a rate, multiply by fractions equal to 1 so the old units cancel. Example: 72 km/h × (1000 m / 1 km) × (1 h / 3600 s) = 20 m/s. For ‘3 turns in 2 s’: 3 ÷ 2 = 1.5 turns per second, and 1.5 × 60 = 90 turns per minute.",
        "Angles in standard position":"An angle in standard position starts on the positive `x`-axis and turns counterclockwise. Quadrant 1 is 0° to 90°, quadrant 2 is 90° to 180°, quadrant 3 is 180° to 270°, and quadrant 4 is 270° to 360°. Example: 160° is in quadrant 2.",
        "Trig ratios":"Find the related angle (the angle to the `x`-axis), then use CAST for the sign: All three ratios are positive in quadrant 1, only Sine in 2, Tangent in 3, Cosine in 4. Example: 150° is in quadrant 2 with related angle 30°, so `sin 150° = +sin 30° = 1/2`."
      }
    }
  },
  explore:{
    heading:"Radius wrapper",
    intro:"Wrap radius-length pieces around a circle to build an angle, then change the circle and watch the arc. The panel tracks the angle in radians and degrees.",
    text:{
      gap7:"Only about 0.28 of the 7th piece fits. A full turn is 2π ≈ 6.28 radius lengths.",
      gapP1:"≈ 0.28 of a piece", gapP3:"π − 3 ≈ 0.14",
      ghost180:"180 cm would wrap around this circle about 9.5 times.",
      cmpLast:"Arc ÷ radius is the same for all three circles: it’s the angle in radians.",
      past:"You’ve passed a full turn. A full turn is 2π ≈ 6.28 radius lengths, so {x} of the 7th piece overlaps the first.",
      rulerCap:"Ruler strip, drawn at a smaller scale: centimetres on top, radius lengths below."
    },
    predictions:[
      { id:"p1", start:{ mode:"wrap", L:10 },
        prompt:"If you keep wrapping radius pieces, what happens when you get back to the start?",
        options:[{ t:"Exactly 6 pieces fit, with nothing left over" }, { t:"6 pieces fit, and a gap shorter than one piece is left", ok:true }, { t:"3 pieces fit, and a small gap is left" }, { t:"It depends on how big the circle is" }],
        explain:"The circumference is `2πr`, so 2π ≈ 6.28 radius lengths fit around the circle: 6 whole pieces and about 0.28 of another. That’s why a full turn is 2π radians, not 6. (Three pieces and a bit, about 3.14, is a <strong>half</strong> turn: π.) The count is the same for every circle, because the circumference and the radius grow together." },
      { id:"p2", start:{ mode:"arc", step:"dec", r:2, th:1 }, fixedOrder:true,
        prompt:"The radius will grow from 2 cm to 5 cm, and the arc will stay exactly one radius long. What happens to the angle?",
        options:[{ t:"It shrinks to 0.4 radians" }, { t:"It stays at 1 radian", ok:true }, { t:"It grows to 2.5 radians" }, { t:"It grows to 5 radians" }],
        explain:"`θ = a ÷ r`. The arc grows from 2 cm to 5 cm, and so does the radius, so `θ` = 5 ÷ 5 = 1 the whole time. A radian is the same angle on every circle. (0.4 = 2 ÷ 5 would be right only if the arc stayed 2 cm; 2.5 = 5 ÷ 2 treats the angle as growing with the circle; 5 is the arc length, not the angle.)" },
      { id:"p3", start:{ mode:"arc", step:"dec", r:4, th:0, rad:true }, fixedOrder:true,
        prompt:"The arm will turn to `θ` = 3, with no π. Where will it stop?",
        options:[{ t:"Just past the positive `x`-axis, in quadrant 1" }, { t:"Just before the negative `x`-axis, in quadrant 2", ok:true }, { t:"Exactly on the negative `x`-axis" }, { t:"In quadrant 3" }],
        explain:"With no degree sign, `θ` = 3 means 3 radians, about 3 × 57.3° ≈ 171.9°. A half turn is π ≈ 3.14, so 3 radians stops 0.14 short of the negative `x`-axis, in quadrant 2. It isn’t 3° (quadrant 1), and π isn’t exactly 3." },
      { id:"p4", start:{ mode:"arc", step:"pi", r:3, idx:4, deg:true }, fixedOrder:true,
        prompt:"How long is the arc?",
        options:[{ t:"about 1.05 cm" }, { t:"about 3.14 cm", ok:true }, { t:"about 9.42 cm" }, { t:"180 cm" }],
        explain:"`a = rθ = 3 × π/3 = π ≈ 3.14` cm. The formula needs `θ` in radians, π/3, not 60. Using 60 gives 180 cm, but the whole circle is only 6π ≈ 18.85 cm around, so that arc would wrap about 9.5 times. (1.05 cm is `θ` alone, without multiplying by `r`; 9.42 cm is 3π, which uses `θ = π`.)" }
    ],
    found:{ title:"What you found",
      html:"<ul><li><strong>One radian</strong> is the angle at the centre of a circle that cuts off an arc as long as the radius. It’s about 57.3°, and it’s the same angle on every circle.</li>" +
        "<li><strong>A full turn</strong> is 2π radians, because 2π radius lengths fit around a circumference of `2πr`. So 360° = 2π radians and 180° = π radians.</li>" +
        "<li><strong>Converting:</strong><ul><li>degrees → radians: multiply by π/180. Example: 120° = 120π/180 = 2π/3;</li><li>radians → degrees: multiply by 180/π. Example: 2.5 × 180/π ≈ 143.2°.</li></ul></li>" +
        "<li><strong>Benchmarks:</strong> π/2 ≈ 1.57, π ≈ 3.14, 3π/2 ≈ 4.71, 2π ≈ 6.28.</li>" +
        "<li><strong>Arc length:</strong> `a = rθ`, with `θ` in radians. Rearranged: `θ = a ÷ r` and `r = a ÷ θ`.</li></ul>" },
    challenges:[
      { id:"tc1", goal:[1, 4], prompt:"In Arc mode, keep the radius at 4 cm. Make the arc exactly 10 cm long.",
        why:"`θ` = 10 ÷ 4 = 2.5.",
        msgs:{ mode:"Switch to Arc mode: this challenge uses the radius and angle sliders.",
          flip:"You set `θ = r ÷ a` = 4 ÷ 10. The angle is arc ÷ radius: how many 4 cm lengths make 10 cm?",
          close:"So close: your arc is {a} cm. Nudge `θ` by 0.01.",
          steps:"π-steps go up by π/12 ≈ 0.26, so none of them makes exactly 10 cm. Switch to decimal steps.",
          radius:"Keep the radius at 4 cm; the challenge fixes it.",
          other:"Your arc is {a} cm. You need 10 cm: how many radius lengths is that?" },
        hints:["The angle in radians counts how many radius lengths fit along the arc.", "How many 4 cm lengths make 10 cm? `θ = a ÷ r`.", "`θ` = 10 ÷ 4 = 2.5. In decimal steps, set `θ` = 2.50 with `r` = 4."] },
      { id:"tc2", goal:[2, 4], prompt:"Make an arc that is exactly 2π cm long <strong>and</strong> exactly one-sixth of its circle.",
        why:"`r = a ÷ θ = 2π ÷ (π/3) = 6`.",
        msgs:{ mode:"Switch to Arc mode: this challenge uses the radius and angle sliders.",
          frac:"Your arc is 2π cm, but it’s {f} of its circle. One-sixth of a full turn is `2π/6 = π/3`.",
          fracs:{ "1":"the whole", "1.5":"2/3", "2":"1/2", "3":"1/3", "4":"1/4" },
          sixth:"That’s one-sixth of the circle. Now the length: your arc is {a} cm, but it must be 2π cm. Which radius makes `r × π/3 = 2π`?",
          twelfth:"π/6 is one-<strong>twelfth</strong> of a full turn. A full turn is 2π, not π, so one-sixth is π/3.",
          dec:"Very close, but 1.05 is only near π/3, so the arc is 6.30 cm, not exactly 2π. Switch to π-steps.",
          other:"Find the angle first (one-sixth of 2π), then the radius (`r = a ÷ θ`)." },
        hints:["Find the angle first: what is one-sixth of a full turn, in radians?", "A full turn is 2π, so one-sixth is 2π/6 = π/3. Which radius makes `r × π/3 = 2π`?", "`r = a ÷ θ = 2π ÷ (π/3) = 6`. Set `r` = 6 and `θ = π/3`."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Make a sector (a pizza-slice shape) whose perimeter, its two straight edges plus its arc, is exactly <strong>half</strong> of its circle’s circumference.",
        why:"`2r + rθ = πr`, so `θ = π - 2 ≈ 1.14` radians. Notice the radius didn’t matter: it cancelled.",
        msgs:{ mode:"Switch to Arc mode: this challenge uses the radius and angle sliders.",
          pi:"Your arc alone is half the circumference. The perimeter also includes the two straight edges.",
          pim1:"You’ve counted one straight edge. A sector has two.",
          whole:"That makes the perimeter equal to the <strong>whole</strong> circumference. You need half.",
          quarter:"A quarter-circle’s perimeter is `2r + (π/2)r ≈ 3.57r`, more than `πr ≈ 3.14r`. Make `θ` smaller.",
          steps:"π − 2 isn’t a multiple of π/12. Switch to decimal steps.",
          other:"Write the perimeter as `2r + rθ` and set it equal to half the circumference, `πr`." },
        rulerLabels:["perimeter 2r + rθ", "half the circumference πr"],
        hints:["Write the sector’s perimeter in terms of `r` and `θ`. Write half the circumference in terms of `r`.", "Perimeter = `r + r + rθ = 2r + rθ`. Half the circumference is `πr`. Set them equal, then divide both sides by `r`.", "`2 + θ = π`, so `θ = π - 2 ≈ 3.14 - 2 = 1.14`. Any radius works. In decimal steps, set `θ` = 1.14."] }
    ]
  },
  part3:{
    slug:"spin", name:"Spin lab",
    heading:"Spin lab: how fast is it turning?",
    intro:"A wheel’s angular velocity is the angle it turns each second. Predict, run the wheel, and see how far each point travels.",
    views:["One wheel, two riders", "Two wheels, one belt"],
    runIntro:"Enter a prediction and press Check. Then the wheel runs so you can see it.",
    runs:[
      { id:"r1", goal:5, setup:{ view:0, rpm:15, t:2 }, prompt:"Through what angle will the merry-go-round turn?",
        box:{ pre:"`θ` =", post:"π" }, answer:{ v:1 }, display:"`θ = π`",
        wrong:[{ v:0.5, fb:"π/2 is the angle per second: that’s ω. In 2 s it turns twice that." },
          { v:2, fb:"2π is a full turn. 15 turns per minute is one turn every 4 s, so 2 s is half a turn." },
          { v:60, fb:"That treats 15 rpm as 15 turns per <strong>second</strong>: 15 × 2 × 2π = 60π." }],
        hints:["How many turns does the merry-go-round make in 2 s?", "15 turns per minute is 15 ÷ 60 = 1/4 turn per second, so 1/2 turn in 2 s.", "Half a turn is π radians. `θ = π`."] },
      { id:"r2", goal:5, setup:{ view:0, rpm:15, t:2 }, prompt:"How far along the circle did rider B travel?",
        box:{ pre:"", post:"π m" }, answer:{ v:1 }, display:"π m",
        wrong:[{ v:2, fb:"2π m is rider A’s distance, 2 × π. B sits 1 m from the centre: `a = 1 × π`." },
          { v:0.5, fb:"π/2 is B’s speed in m/s. In 2 s, B travels twice that." }],
        hints:["Rider B turns through the same angle as the wheel. Use `a = rθ`.", "`θ = π` (from R1), and B sits `r` = 1 m from the centre.", "`a = 1 × π = π` m. Type 1."] },
      { id:"r3", goal:5, setup:{ view:0, rpm:20, t:2 }, prompt:"Through what angle will it turn, and where will rider A stop?",
        box:{ pre:"`θ` =", post:"π" }, quad:true, answer:{ v:4 / 3, q:3 }, display:"`θ = 4π/3`, quadrant 3",
        wrong:[{ v:2 / 3, fb:"2π/3 is ω, the angle per second. In 2 s it turns 4π/3." },
          { v:80, fb:"That treats 20 rpm as turns per second." }],
        qwrong:{ "2":"4π/3 is past π (3π/3), so the rider is below the `x`-axis.", "4":"4π/3 hasn’t reached 3π/2." },
        hints:["How many turns does the merry-go-round make in 2 s at 20 rpm?", "20 rpm is 20 ÷ 60 = 1/3 turn per second, so 2/3 turn in 2 s. One turn is 2π.", "`θ = 2/3 × 2π = 4π/3`. That’s past π = 3π/3 but short of 3π/2 = 4.5π/3, so quadrant 3. Type 4/3 and choose Quadrant 3."] },
      { id:"r4", goal:5, setup:{ view:1, r1:5, n1:90, r2:15, t:2 }, prompt:"How many full turns will the big pulley make?",
        box:{ pre:"", post:"turns" }, answer:{ v:1 }, display:"1 turn",
        wrong:[{ v:3, fb:"3 turns is the small pulley. The belt moves the same distance around the big pulley, but each of its turns is 3 times as long." },
          { v:9, fb:"The big pulley turns <strong>slower</strong>, not faster: divide by 3." }],
        hints:["The belt moves the same distance around both pulleys.", "90 rpm is 1.5 turns per second, so the small pulley makes 3 turns in 2 s. Its rim moves 3 × 2π × 5 = 30π cm.", "One turn of the big pulley is 2π × 15 = 30π cm of belt. So it makes 30π ÷ 30π = 1 turn."] }
    ],
    chainIntro:"Tap a tile, then tap an empty slot. Units that cancel are struck through. Press Check when the units are right; then enter the value.",
    tiles:[
      { id:"t1", n:"2π rad", d:"1 turn", nu:"rad", du:"turn" },
      { id:"t2", n:"1 turn", d:"2π rad", nu:"turn", du:"rad" },
      { id:"t3", n:"π rad", d:"1 turn", nu:"rad", du:"turn" },
      { id:"t4", n:"60 s", d:"1 min", nu:"s", du:"min" },
      { id:"t5", n:"1 min", d:"60 s", nu:"min", du:"s" },
      { id:"t6", n:"60 min", d:"1 h", nu:"min", du:"h" }
    ],
    chains:[
      { id:"u1", goal:5, q:"45 rpm in rad/s", start:{ n:"45 turns", d:"1 min", nu:"turn", du:"min" }, slots:2, target:"rad/s",
        box:{ post:"π rad/s", pi:true }, answer:{ tiles:["t1", "t5"], v:1.5 }, display:"45 rpm = `3π/2` rad/s ≈ 4.71 rad/s",
        tileFb:{ t2:upside("turn"), t3:TILE_PI, t4:"With ‘60 s’ on top you’d be multiplying by 60. To change ‘per minute’ into ‘per second’, use ‘1 min / 60 s’.", t6:HOURS },
        wrong:[{ v:90, fb:"90π is per minute: divide by 60." }, { v:0.75, fb:"That used π rad per turn." }],
        hints:["Line up the units: you have turns per minute, and you want radians per second.", "One tile must change turns into radians, with ‘turn’ underneath. The other must change ‘per minute’ into ‘per second’, with ‘min’ on top.", "45 × 2π ÷ 60 = 90π/60 = 3π/2 rad/s. Type 3/2."] },
      { id:"u2", goal:5, q:"6π rad/s in rpm", start:{ n:"6π rad", d:"1 s", nu:"rad", du:"s" }, slots:2, target:"turn/min",
        box:{ post:"rpm", pi:false }, answer:{ tiles:["t2", "t4"], v:180 }, display:"6π rad/s = 180 rpm",
        tileFb:{ t1:upside("rad"), t3:TILE_PI, t5:"With ‘min’ on top you’d be dividing by 60. To change ‘per second’ into ‘per minute’, use ‘60 s / 1 min’: a rate per minute is 60 times a rate per second.", t6:HOURS },
        wrong:[{ v:3, fb:"3 turns per <strong>second</strong>: multiply by 60." }],
        hints:["You have radians per second, and you want turns per minute.", "One tile must change radians into turns, with ‘rad’ underneath. The other must change ‘per second’ into ‘per minute’, with ‘s’ on top.", "6π ÷ 2π = 3 turns per second, and 3 × 60 = 180 rpm."] },
      { id:"u3", goal:5, q:"Earth turns once every 24 h. Its angular velocity in rad/h?", start:{ n:"1 turn", d:"24 h", nu:"turn", du:"h" }, slots:1, target:"rad/h",
        box:{ post:"π rad/h", pi:true }, answer:{ tiles:["t1"], v:1 / 12 }, display:"`π/12` rad/h ≈ 0.26 rad/h",
        after:"π/12 radians is 15°. Earth turns 15° every hour, which is why time zones are about 15° wide.",
        tileFb:{ t2:upside("turn"), t3:TILE_PI, t4:U3TIME, t5:U3TIME, t6:U3TIME },
        wrong:[{ v:1 / 24, fb:"That used π rad per turn." }, { v:2, fb:"You left out the 24 h: 2π rad is per <strong>day</strong>." }],
        hints:["You have turns per hour, and you want radians per hour. Only the turns need changing.", "Use the tile with ‘turn’ underneath: 2π rad / 1 turn. The hours stay where they are.", "2π ÷ 24 = π/12 rad/h. Type 1/12."] }
    ],
    blocks:[
      { title:"", html:"<details class=\"alg\"><summary>Check it with algebra</summary><div class=\"alg-lines\"><div>`ω = θ ÷ t`. One turn is 2π radians, so `N` turns per minute is `2πN` radians every 60 s: `ω = 2πN/60 = πN/30` rad/s.</div><div>A point at distance `r` travels `a = rθ`, so its speed is `v = a ÷ t = r(θ ÷ t) = rω`.</div><div>A belt moves both rims the same distance, so `r_1θ_1 = r_2θ_2`, and dividing by `t` gives `r_1ω_1 = r_2ω_2`.</div><div>Check with view 1: 15 rpm → `ω = 15π/30 = π/2` rad/s, and rider A’s speed is 2 × π/2 = π m/s, the same as the readout.</div></div></details>" },
      { title:"Angular velocity, in four lines", html:"<ol><li>ω is the angle turned per unit of time: `ω = θ ÷ t`, in rad/s.</li><li>From rpm: multiply by 2π (radians per turn) and divide by 60 (seconds per minute). 15 rpm = π/2 rad/s.</li><li><strong>One wheel:</strong> every point has the same ω. Its speed along its path is `v = rω`, so points farther out move faster.</li><li><strong>Belt, chain or meshing gears:</strong> the rims share one speed, so `r_1ω_1 = r_2ω_2`, and the smaller wheel turns faster.</li></ol>" }
    ],
    quickCheck:{
      title:"Quick check: Spin lab", summary:"Spin lab quick check",
      items:[
        { id:"q1", goal:5, fixedOrder:true, prompt:"A wheel turns at 30 rpm. What is its angular velocity?",
          choices:[{ t:"π rad/s", ok:true, fb:"Right: 30 rpm is half a turn per second, and half a turn is π radians." },
            { t:"2π rad/s", fb:"2π rad/s is one full turn every second, which is 60 rpm." },
            { t:"30 rad/s", fb:"rpm counts turns per minute, not radians per second." },
            { t:"60π rad/s", fb:"30 × 2π = 60π is radians per <strong>minute</strong>. Divide by 60." }] },
        { id:"q2", goal:5, prompt:"On a spinning merry-go-round, rider A sits 2 m from the centre and rider B sits 1 m from the centre. Who has the greater angular velocity?",
          choices:[{ t:"A", fb:"A goes farther, but turns through the same angle as B. Angular velocity measures the angle." },
            { t:"B", fb:"B is closer to the centre but turns with the same wheel, through the same angle." },
            { t:"The same", ok:true, fb:"Right: they turn through the same angle in the same time, so ω is the same." }] },
        { id:"q3", goal:5, prompt:"Same riders: who moves faster along their path?",
          choices:[{ t:"A, twice as fast", ok:true, fb:"Right: `v = rω` with the same ω, so doubling `r` doubles `v`." },
            { t:"B, twice as fast", fb:"B’s circle is smaller, so B covers less distance in each turn." },
            { t:"The same", fb:"Same ω, but A’s circle is twice as big, so A covers twice the distance in each turn." }] },
        { id:"q4", goal:5, prompt:"A 4 cm pulley drives a 12 cm pulley with a belt. The small one turns at 60 rpm. How fast does the big one turn?",
          choices:[{ t:"20 rpm", ok:true, fb:"Right: `r_1ω_1 = r_2ω_2`: 4 × 60 = 12 × 20. The big pulley turns a third as fast." },
            { t:"60 rpm", fb:"The belt makes the rims move at the same speed, not the pulleys turn at the same rate." },
            { t:"180 rpm", fb:"The bigger pulley turns <strong>slower</strong>. Divide by 3, don’t multiply." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"where", type:"sorter", title:"Where does it land?", summary:"Where does it land?", noun:"angle", goal:[3, 2],
        instruction:"Sort each angle into the quadrant where its terminal arm ends.",
        how:"Tap an angle, then tap the box it belongs in.",
        use:"π/2 ≈ 1.57, π ≈ 3.14, 3π/2 ≈ 4.71, 2π ≈ 6.28",
        boxes:[{ id:"q1", label:"Quadrant 1" }, { id:"q2", label:"Quadrant 2" }, { id:"q3", label:"Quadrant 3" }, { id:"q4", label:"Quadrant 4" }],
        items:[
          decItem("i1", 1, 1, "1 is less than π/2 ≈ 1.57. One radian is about 57°.", 57),
          decItem("i2", 1.5, 1, "1.5 is just less than π/2 ≈ 1.57: about 86°, just short of the positive `y`-axis.", 86,
            { 2:"1.5 is just <strong>less</strong> than π/2 ≈ 1.57, so it hasn’t reached the positive `y`-axis." }),
          piItem("i3", "`2π/5`", "= 0.4", 1, "`2π/5 = 0.4π`, which is less than 0.5π. It’s 72°.", 72),
          decItem("i4", 2, 2, "1.57 < 2 < 3.14. Two radians is about 115°.", 115),
          decItem("i5", 3, 2, "3 is just less than π ≈ 3.14: about 172°.", 172,
            { 3:"3 is less than π ≈ 3.14: it stops just before the negative `x`-axis." }),
          piItem("i6", "`7π/12`", "≈ 0.58", 2, "`7π/12 ≈ 0.58π`, between 0.5π and π. It’s 105°.", 105),
          decItem("i7", 4, 3, "3.14 < 4 < 4.71. Four radians is about 229°.", 229),
          decItem("i8", 4.5, 3, "4.5 is just less than 3π/2 ≈ 4.71: about 258°.", 258,
            { 4:"4.5 is less than 3π/2 ≈ 4.71." },
            ["Compare 4.5 with the benchmarks in the box.", "π ≈ 3.14 and 3π/2 ≈ 4.71. Is 4.5 between them?", "3.14 < 4.5 < 4.71, so 4.5 radians ends in quadrant 3, about 258°, just before the negative `y`-axis."]),
          piItem("i9", "`9π/8`", "= 1.125", 3, "`9π/8 = 1.125π`, between π and 1.5π. It’s 202.5°.", 202.5,
            ["Write `9π/8` as a number times π.", "9/8 = 1.125, so `9π/8 = 1.125π`. Quadrant 3 runs from π to 1.5π.", "π < 9π/8 < 3π/2, so it ends in quadrant 3. It’s 9 × 22.5° = 202.5°."]),
          decItem("i10", 5, 4, "4.71 < 5 < 6.28. Five radians is about 286°.", 286),
          decItem("i11", 6, 4, "6 is less than 2π ≈ 6.28: about 344°, just short of a full turn.", 344,
            { 1:"6 is less than 2π ≈ 6.28, so it hasn’t finished a full turn." }),
          piItem("i12", "`19π/10`", "= 1.9", 4, "`19π/10 = 1.9π`, between 1.5π and 2π. It’s 342°.", 342)
        ] },
      { id:"nums", type:"custom", title:"Find the missing piece", summary:"Find the missing piece", star:true, goal:[2, 4, 5, 6],
        instruction:"Find each missing value. The last three are puzzles: they need more than one step.",
        how:"Type your answer in the box, then press Check. For a multiple of π, type only the number in front of π (a fraction like 2/9 is fine).",
        items:[
          { id:"n1", goal:2, prompt:"Convert 40° to radians. Give the exact value.", boxes:[{ pi:true, tol:1e-4, wrong:[
              { v:4.5, fb:"That flips the fraction: 180/40 instead of 40/180. 9π/2 is more than two full turns. Multiply 40 by π/180." },
              { v:40, fb:"Multiply by π/180, not just by π." },
              { v:1 / 9, fb:"40/360 = 1/9 is the fraction of a <strong>turn</strong>. A turn is 2π, so 40° = 2π/9." }] }],
            answer:[2 / 9], display:"40° = `2π/9`",
            hints:["Degrees to radians: multiply by π/180.", "40 × π/180 = 40π/180. Simplify 40/180.", "40/180 = 2/9, so 40° = 2π/9. Type 2/9."] },
          { id:"n2", goal:2, prompt:"Convert `7π/12` to degrees.", boxes:[{ post:"°", tol:0.01, wrong:[
              { v:210, fb:"That uses π = 360°. A <strong>half</strong> turn is π, so π = 180°." },
              { v:52.5, fb:"That uses π = 90°. π radians is 180°." },
              { v:7 * Math.PI / 12, fb:"1.83 is `7π/12` as a decimal, still in radians. Multiply by 180/π." }] }],
            answer:[105], display:"`7π/12` = 105°",
            hints:["Radians to degrees: multiply by 180/π, or replace π with 180°.", "`7π/12 × 180/π = 7 × 180 ÷ 12`.", "7 × 15 = 105°."] },
          { id:"n3", goal:4, prompt:"An arc 12 cm long is on a circle of radius 8 cm. Find the angle at the centre, in radians.", boxes:[{ tol:0.01, wrong:[
              { v:2 / 3, fb:"That’s `r ÷ a`. The angle is `a ÷ r` = 12 ÷ 8." },
              { v:96, fb:"That’s `a × r`. Rearrange `a = rθ`: `θ = a ÷ r`." },
              { v:270 / Math.PI, tol:0.1, fb:"That’s the angle in degrees. The question asks for radians." }] }],
            answer:[1.5], display:"`θ` = 1.5",
            hints:["`θ = a ÷ r`: how many radius lengths fit along the arc?", "`a` = 12 cm and `r` = 8 cm.", "`θ` = 12 ÷ 8 = 1.5 radians."] },
          { id:"n4", goal:4, prompt:"A pendulum 90 cm long swings through an arc of 15π cm. Through how many degrees does it swing?", boxes:[{ post:"°", tol:0.1, wrong:[
              { v:Math.PI / 6, tol:0.01, fb:"That’s `θ` in radians (π/6 ≈ 0.52): `a ÷ r` always gives radians. Convert it to degrees." },
              { v:6, fb:"That’s 90 ÷ 15, the radius over the arc, with the π left out. `θ = a ÷ r = 15π ÷ 90 = π/6`." },
              { v:30 * Math.PI, fb:"That’s π/6 × 180 = 30π. You multiplied by 180 but forgot to divide by π: π/6 × 180/π = 30." }] }],
            answer:[30], display:"30°",
            hints:["Find `θ` in radians first, with `θ = a ÷ r`.", "`θ = 15π ÷ 90 = π/6`.", "π/6 × 180/π = 30°."] },
          { id:"n5", goal:6, prompt:"Find `csc 1.2` and `cot 1.2`, to two decimal places.", use:"`sin 1.2 ≈ 0.932` and `cos 1.2 ≈ 0.362`",
            boxes:[{ pre:"`csc 1.2 ≈`", name:"`csc 1.2`", tol:0.01, wrong:[{ v:1 / 0.362, fb:"That’s 1/cos 1.2, which is sec 1.2. csc pairs with sine." }] },
              { pre:"`cot 1.2 ≈`", name:"`cot 1.2`", tol:0.01, wrong:[{ v:0.932 / 0.362, fb:"That’s sin ÷ cos, which is tan 1.2. cot is cos ÷ sin." }] }],
            answer:[1.07, 0.39], display:"`csc 1.2 ≈ 1.07` and `cot 1.2 ≈ 0.39`",
            hints:["csc = 1/sin and cot = cos/sin.", "`csc 1.2` = 1 ÷ 0.932 and `cot 1.2` = 0.362 ÷ 0.932.", "1 ÷ 0.932 ≈ 1.07 and 0.362 ÷ 0.932 ≈ 0.39. Check by multiplying: 0.932 × 1.07 ≈ 0.997, close to 1, and 0.932 × 0.39 ≈ 0.363, close to 0.362."] },
          { id:"n6", goal:5, star:true, prompt:"<em>Non-routine.</em> A gear of radius 3 cm meshes with a gear of radius 8 cm. The small gear turns through 4π radians (two full turns). Through what angle does the big gear turn?",
            boxes:[{ pi:true, tol:1e-4, wrong:[
              { v:4, fb:"Meshing gears don’t turn through the same angle. Their rims move the same <strong>distance</strong>." },
              { v:12, fb:"12π cm is the distance the teeth move. Divide by the big gear’s radius to get its angle." },
              { v:32 / 3, fb:"The ratio is upside down: the big gear turns <strong>less</strong> than the small one." }] }],
            answer:[1.5], display:"`3π/2`",
            hints:["Where the gears touch, both rims move the same distance.", "The small gear’s rim moves `a = 3 × 4π = 12π` cm, so the big gear’s rim also moves 12π cm.", "`θ = 12π ÷ 8 = 3π/2`. The big gear turns three-quarters of a turn. Type 3/2."] },
          { id:"n7", goal:5, star:true, prompt:"<em>Non-routine.</em> A bike wheel of radius 35 cm rolls 11 m along a path in 5 s without slipping. About how many rotations per minute is it turning?", use:"π ≈ 3.14",
            boxes:[{ post:"rpm", tol:0.5, wrong:[
              { v:[6.29, 6.28], tol:0.005, fb:"That’s ω in rad/s. Change it to turns per minute." },
              { v:377, fb:"That’s radians per minute. Divide by 2π for turns." },
              { v:1, fb:"That’s turns per <strong>second</strong>." },
              { v:30, fb:"That uses the diameter. Rolling distance = `rθ` with `r` = 35 cm." }] }],
            answer:[60], display:"about 60 rpm",
            hints:["When a wheel rolls without slipping, the distance it rolls equals the arc its rim turns through.", "`θ` = 1100 cm ÷ 35 cm ≈ 31.43 radians in 5 s, so ω ≈ 31.43 ÷ 5 ≈ 6.29 rad/s.", "One full turn is 2π ≈ 6.28 radians, so 6.29 rad/s is about 1 turn per second (6.29 ÷ 6.28 ≈ 1.00). That’s about 60 rotations per minute. (A shortcut: each turn rolls one circumference, 2π × 35 ≈ 219.8 cm, about 220 cm. 1100 ÷ 220 = 5 turns in 5 s, which is 1 turn per second.)"] },
          { id:"n8", goal:4, star:true, prompt:"<em>Non-routine, hardest.</em> On a circle of what radius is every arc’s length, in centimetres, equal to its angle in degrees? Give the radius to one decimal place.", use:"π ≈ 3.14",
            boxes:[{ post:"cm", tol:0.1, wrong:[
              { v:1, fb:"On a circle of radius 1, an arc’s length equals its angle in <strong>radians</strong>, not degrees." },
              { v:[0.017, 0], tol:0.01, fb:"That’s π/180, upside down. Solve `rθ = 180θ/π` for `r`." },
              { v:114.6, fb:"That’s 360/π, the diameter of the circle you want. The radius is 180/π." }] }],
            answer:[57.3], display:"57.3 cm",
            hints:["Write the arc length with `a = rθ` (`θ` in radians). Then write the angle in degrees in terms of `θ`.", "`θ` radians is 180`θ`/π degrees. You need `rθ = 180θ/π` for every `θ`.", "Divide both sides by `θ`: `r` = 180/π ≈ 180 ÷ 3.14 ≈ 57.3 cm. That’s why one radian is about 57.3°."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ravi", how:"",
        instruction:"Ravi made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Convert 135° to radians.",
            steps:["A half turn is 180°, which is π radians.", "So 1° is 180/π radians.", "135° = 135 × 180/π = 24 300/π radians.", "That’s about 7735 radians."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 is the right arithmetic for step 3. The mistake is earlier."],
            fixes:[
              { t:"1° is π/180 radians, so 135° = 135π/180 = 3π/4 radians.", ok:true, why:"Dividing π radians = 180° by 180 gives 1° = π/180 radians. 135° is three-quarters of a half turn: 3π/4." },
              { t:"1° is π radians, so 135° = 135π radians.", why:"π radians is a half turn, so 1° can’t be π radians. 135π would be more than 67 full turns." },
              { t:"1° is 2π/180 radians, so 135° = 3π/2 radians.", why:"2π goes with 360°, not 180°. 3π/2 is 270°." },
              { t:"Step 2 is correct as written.", why:"If 1° were 180/π ≈ 57 radians, then 135° would be about 7735 radians, more than 1200 full turns. A degree is much <strong>smaller</strong> than a radian." }],
            hints:["Check step 2: is a degree bigger or smaller than a radian?", "π radians = 180°. Divide both sides by 180 to find 1°.", "Step 2 is wrong: 1° = π/180 radians, so 135° = 135π/180 = 3π/4."] },
          { id:"e2", goal:4, task:"A lawn sprinkler sprays water 8 m and sweeps through 45°. How long is the wet arc at the edge of its spray?",
            steps:["The edge of the spray is an arc of a circle with radius 8 m.", "Arc length is `a = rθ`.", "So `a = 8 × 45`.", "The wet arc is 360 m long."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: it’s the right formula.", "", "Step 4 is the right arithmetic for step 3. The mistake is earlier."],
            fixes:[
              { t:"`θ` must be in radians: 45° = π/4, so `a = 8 × π/4 = 2π ≈ 6.28` m.", ok:true, why:"`a = rθ` counts radius lengths, so `θ` must be in radians." },
              { t:"`θ` is 45/360 = 1/8 of a turn, so `a = 8 × 1/8 = 1` m.", why:"1/8 is the fraction of a turn, not the angle in radians. One turn is 2π radians, so `θ = 2π/8 = π/4`." },
              { t:"`θ = π/4`, so `a = (π/4) ÷ 8 = π/32` m.", why:"The radian conversion is right now, but `a = rθ` multiplies: 8 × π/4." },
              { t:"Step 3 is correct as written.", why:"The whole circle’s edge is only 2π × 8 ≈ 50 m long, so a 360 m arc would go around about 7 times. `a = rθ` needs `θ` in radians." }],
            hints:["Check the units of `θ` in step 3.", "`a = rθ` works only with `θ` in radians. Convert 45° first.", "Step 3 is wrong: 45° = π/4, so `a = 8 × π/4 = 2π ≈ 6.28` m."] },
          { id:"e3", goal:6, task:"Find `sec 2`, to two decimal places. (The angle is 2 radians.)",
            steps:["`sec 2 = 1/cos 2`.", "2 is between π/2 ≈ 1.57 and π ≈ 3.14, so 2 radians is in quadrant 2.", "A calculator gives `cos 2 ≈ 0.9994`.", "So `sec 2 ≈ 1 ÷ 0.9994 ≈ 1.00`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct, and it’s useful: what sign should `cos 2` have?", "", "Step 4 is the right arithmetic for step 3. The mistake is earlier."],
            fixes:[
              { t:"In radian mode, `cos 2 ≈ -0.416`, so `sec 2 ≈ 1 ÷ (-0.416) ≈ -2.40`.", ok:true, why:"Cosine is negative in quadrant 2, which matches step 2." },
              { t:"`cos 2` means `cos(2π) = 1`, so `sec 2 = 1`.", why:"`cos 2` means the cosine of 2 radians. Angles in radians don’t need π in them." },
              { t:"`sec 2 = 1/sin 2`, and `sin 2 ≈ 0.909`, so `sec 2 ≈ 1.10`.", why:"sec pairs with cosine, not sine. `1/sin 2` is `csc 2`." },
              { t:"Step 3 is correct as written.", why:"Step 2 puts 2 radians in quadrant 2, where cosine is negative. A positive value means the calculator treated 2 as 2°: `cos 2° ≈ 0.9994`." }],
            hints:["Compare step 3 with step 2: what sign should cosine have in quadrant 2?", "Cosine is negative in quadrant 2. 0.9994 is `cos 2°`, from a calculator in degree mode.", "Step 3 is wrong: `cos 2 ≈ -0.416`, so `sec 2 ≈ -2.40`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you wrapped radius pieces around the circle?" },
      { id:"j2", q:"In your own words, what is one radian, and why does a full turn measure 2π radians?" },
      { id:"j3", q:"Explain to a friend how to change 75 rpm into radians per second, and why each step is there." },
      { id:"j4", q:"Which is harder for you right now: picturing an angle like 4 radians, or converting between degrees and radians? What will you do to practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which shows 225° in radians, exactly and as a decimal?", use:"π ≈ 3.1416", fixedOrder:true, options:[
          { t:"`5π/8 ≈ 1.96`", why:"That’s 225/360 × π, which treats a full turn as π. A full turn is 2π." },
          { t:"`4π/5 ≈ 2.51`", why:"That’s 180/225 × π: the conversion factor is upside down. Multiply by π/180." },
          { t:"`5π/4 ≈ 3.93`", ok:true, why:"225 × π/180 = 225π/180 = 5π/4 ≈ 3.93." },
          { t:"`225π ≈ 706.86`", why:"That multiplies by π but forgets to divide by 180." }] },
        b:{ prompt:"Which shows 300° in radians, exactly and as a decimal?", use:"π ≈ 3.1416", fixedOrder:true, options:[
          { t:"`3π/5 ≈ 1.88`", why:"That’s 180/300 × π: the factor is upside down." },
          { t:"`5π/6 ≈ 2.62`", why:"That’s 300/360 × π, which treats a full turn as π." },
          { t:"`5π/3 ≈ 5.24`", ok:true, why:"300 × π/180 = 300π/180 = 5π/3 ≈ 5.24." },
          { t:"`300π ≈ 942.48`", why:"That multiplies by π but forgets to divide by 180." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which statement describes one radian?", options:[
          { t:"The angle that is 1/360 of a full turn, on any circle.", why:"That’s one degree. A radian is about 57.3 times as big." },
          { t:"The angle at the centre of any circle that cuts off an arc as long as the radius.", ok:true, why:"That’s the definition. It’s about 57.3°, on any circle." },
          { t:"The angle at the centre that cuts off an arc 1 cm long, on any circle.", why:"That’s 1 radian only when the radius is 1 cm. On a circle of radius 4 cm, a 1 cm arc makes 0.25 radians." },
          { t:"The angle that is one-sixth of a full turn, on any circle.", why:"One-sixth of a turn is 60°, or π/3 ≈ 1.05 radians. A full turn is 2π ≈ 6.28 radians, not 6." }] },
        b:{ prompt:"Which statement describes an angle of exactly 2 radians?", options:[
          { t:"The angle that is 2/360 of a full turn, on any circle.", why:"That’s 2 degrees." },
          { t:"The angle at the centre of any circle that cuts off an arc as long as the diameter.", ok:true, why:"The diameter is 2 radius lengths, so the angle is 2 radians." },
          { t:"The angle at the centre that cuts off an arc 2 cm long, on any circle.", why:"That’s 2 radians only when the radius is 1 cm. On a circle of radius 4 cm, a 2 cm arc makes 0.5 radians." },
          { t:"The angle that is one-third of a full turn, on any circle.", why:"One-third of a turn is 2π/3 ≈ 2.09 radians. It would be 2 only if a full turn were exactly 6." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A circle has radius 6 cm. How long is the arc cut off by a central angle of `5π/6`?", fixedOrder:true, options:[
          { t:"`5π/36` cm", why:"That’s `θ ÷ r`. Arc length is `a = rθ`: multiply." },
          { t:"5π cm", ok:true, why:"`a = rθ = 6 × 5π/6 = 5π` cm, about 15.7 cm." },
          { t:"10π cm", why:"That uses the diameter, 12 cm. `a = rθ` uses the radius." },
          { t:"900 cm", why:"That’s 6 × 150, using degrees. `θ` must be in radians." }] },
        b:{ prompt:"A circle has radius 8 cm. How long is the arc cut off by a central angle of `3π/4`?", fixedOrder:true, options:[
          { t:"`3π/32` cm", why:"That’s `θ ÷ r`. Multiply instead." },
          { t:"6π cm", ok:true, why:"`a = 8 × 3π/4 = 6π` cm, about 18.8 cm." },
          { t:"12π cm", why:"That uses the diameter, 16 cm." },
          { t:"1080 cm", why:"That’s 8 × 135, using degrees." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A wheel’s painted spoke starts along the positive `x`-axis. The wheel turns counterclockwise through 9 radians. Where does the spoke stop?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"In quadrant 1", why:"That reads 9 radians as 9°. 9 radians is about 516°, more than a full turn." },
          { t:"In quadrant 2", ok:true, why:"One full turn is 2π ≈ 6.28, so 9 radians is one turn plus 9 − 6.28 = 2.72. Since π/2 ≈ 1.57 < 2.72 < 3.14 ≈ π, the spoke stops in quadrant 2." },
          { t:"On the negative `x`-axis", why:"That takes π to be exactly 3, so 9 = 3π. But 3π ≈ 9.42, so the spoke stops 0.42 short of the negative `x`-axis." },
          { t:"In quadrant 4", why:"9 is more than 3π/2 ≈ 4.71, but it’s also more than a full turn. Take off the full turn first: 9 − 6.28 = 2.72." }] },
        b:{ prompt:"A wheel’s painted spoke starts along the positive `x`-axis. The wheel turns counterclockwise through 10.5 radians. Where does the spoke stop?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"In quadrant 1", why:"That reads 10.5 radians as 10.5°. 10.5 radians is about 602°, more than a full turn." },
          { t:"In quadrant 3", ok:true, why:"One full turn is 2π ≈ 6.28, so 10.5 radians is one turn plus 10.5 − 6.28 = 4.22. Since π ≈ 3.14 < 4.22 < 4.71 ≈ 3π/2, the spoke stops in quadrant 3." },
          { t:"On the negative `y`-axis", why:"That takes π to be exactly 3, so 10.5 = 3.5π = 7π/2. But 7π/2 ≈ 3.5 × 3.14 = 10.99, so the spoke stops about 0.5 short of the negative `y`-axis." },
          { t:"In quadrant 4", why:"10.5 is more than 3π/2 ≈ 4.71, but it’s also more than a full turn. Take off the full turn first: 10.5 − 6.28 = 4.22." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"An arc 4π cm long cuts off a central angle of 80°. What is the radius of the circle?", fixedOrder:true, options:[
          { t:"1/9 cm", why:"That’s `θ ÷ a`. Rearrange `a = rθ`: `r = a ÷ θ`." },
          { t:"π/20 cm", why:"That divides by 80. `a = rθ` needs `θ` in radians: 80° = 4π/9." },
          { t:"4.5 cm", why:"4π ÷ (4π/9) = 9 is the radius itself, not the diameter." },
          { t:"9 cm", ok:true, why:"80° = 80π/180 = 4π/9. Then `r = a ÷ θ` = 4π ÷ (4π/9) = 9 cm." }] },
        b:{ prompt:"An arc 5π cm long cuts off a central angle of 150°. What is the radius of the circle?", fixedOrder:true, options:[
          { t:"π/30 cm", why:"That divides by 150. Convert 150° to radians first: 5π/6." },
          { t:"1/6 cm", why:"That’s `θ ÷ a`. Use `r = a ÷ θ`." },
          { t:"3 cm", why:"5π ÷ (5π/6) = 6 is the radius itself, not the diameter." },
          { t:"6 cm", ok:true, why:"150° = 5π/6. Then `r` = 5π ÷ (5π/6) = 6 cm." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Points P and Q are on the same spinning wheel. P is 12 cm from the centre and moves at 40 cm/s. Q is 30 cm from the centre. How fast does Q move?", fixedOrder:true, options:[
          { t:"16 cm/s", why:"That uses the ratio upside down. Q is farther out, so it moves faster." },
          { t:"40 cm/s", why:"Points on one wheel share the same ω, not the same speed. Farther out means faster." },
          { t:"58 cm/s", why:"Adding the extra 18 cm to the speed mixes up a distance and a speed." },
          { t:"100 cm/s", ok:true, why:"`ω = v ÷ r` = 40 ÷ 12 = 10/3 rad/s for the whole wheel. Q’s speed is 30 × 10/3 = 100 cm/s." }] },
        b:{ prompt:"Points P and Q are on the same spinning wheel. P is 8 cm from the centre and moves at 20 cm/s. Q is 28 cm from the centre. How fast does Q move?", fixedOrder:true, options:[
          { t:"about 5.7 cm/s", why:"That uses the ratio upside down (20 × 8/28)." },
          { t:"20 cm/s", why:"Same ω, not the same speed." },
          { t:"40 cm/s", why:"Adding the extra 20 cm to the speed mixes up a distance and a speed." },
          { t:"70 cm/s", ok:true, why:"ω = 20 ÷ 8 = 2.5 rad/s. Q’s speed is 28 × 2.5 = 70 cm/s." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"A calculator gives `sin 2 ≈ 0.0349`. Which is the best explanation of what went wrong?", options:[
          { t:"“Nothing went wrong. 2 is a small angle, close to 0, and the sine of a small angle is small, so `sin 2 ≈ 0.0349` is right.”", why:"2 radians is about 115°, not a small angle. Its sine is large: about 0.909." },
          { t:"“It should have found `sin(2π)` instead, because an angle in radians always has π in it. The answer should be `sin(2π) = 0`.”", why:"Angles in radians don’t need π. `sin 2` is the sine of 2 radians." },
          { t:"“The calculator was in degree mode, so it found `sin 2°`. Here 2 means 2 radians, about 115°, which is in quadrant 2, so `sin 2 ≈ 0.909`.”", ok:true, why:"This names the cause (degree mode), says what 2 really means, and checks the size: an angle of about 115° has a large sine." },
          { t:"“Only the sign is wrong. 2 radians is past π/2, where sine is negative, so the answer should be `sin 2 ≈ -0.0349`.”", why:"Sine is positive in quadrant 2, and the size is wrong too: 0.0349 is the sine of 2°." }] },
        b:{ prompt:"A calculator gives `cos 5 ≈ 0.9962`. Which is the best explanation of what went wrong?", options:[
          { t:"“Nothing went wrong. 5 is a small angle, close to 0, and the cosine of a small angle is close to 1, so `cos 5 ≈ 0.9962` is right.”", why:"5 radians is about 286°, most of the way around the circle. Its cosine is small: about 0.284." },
          { t:"“The calculator was in degree mode, so it found `cos 5°`. Here 5 means 5 radians, about 286°, which is in quadrant 4, so `cos 5 ≈ 0.284`.”", ok:true, why:"This names the cause (degree mode), says what 5 really means, and checks the size: 286° is 74° short of a full turn, so its cosine is small." },
          { t:"“It should have found `cos(5π)` instead, because an angle in radians always has π in it. The answer should be `cos(5π) = -1`.”", why:"Angles in radians don’t need π. `cos 5` is the cosine of 5 radians." },
          { t:"“Only the sign is wrong. 5 radians is past 3π/2, where cosine is negative, so the answer should be `cos 5 ≈ -0.9962`.”", why:"Cosine is positive in quadrant 4, and the size is wrong too: 0.9962 is the cosine of 5°." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why a full turn is 2π radians?", options:[
          { t:"“π is 180, and a full turn is 360°. Since 360 = 2 × 180, a full turn must be 2π radians.”", why:"π is a number, about 3.14. It’s π <strong>radians</strong> that equal 180°, and that fact needs its own reason, so this argument goes in a circle." },
          { t:"“About 6 radius lengths fit around a circle, and 6 is close to 2π ≈ 6.28, so a full turn is 2π radians.”", why:"That only shows a full turn is <strong>close</strong> to 2π. It doesn’t explain why it’s <strong>exactly</strong> 2π." },
          { t:"“The circumference is `2πr`, so exactly 2π radius lengths fit around the circle. Each radius length of arc makes 1 radian, so a full turn is 2π radians.”", ok:true, why:"It uses the definition of a radian and the circumference formula, and it works for every circle." },
          { t:"“Radians are measured in units of π, and a circle has two halves, so a full turn is one π for each half: 2π.”", why:"Radians are defined with the radius, not with π. The π comes from the circumference." }] },
        b:{ prompt:"Which is the best explanation of why half a turn is π radians?", options:[
          { t:"“π is 180, and half a turn is 180°. The two numbers match, so half a turn must be exactly π radians, on any circle.”", why:"π is a number, about 3.14. π <strong>radians</strong> equal 180°, and that fact is what needs explaining, so this argument goes in a circle." },
          { t:"“Half the circumference is `πr`, so exactly π radius lengths fit around half the circle. Each radius length of arc makes 1 radian, so half a turn is π radians.”", ok:true, why:"It uses the definition of a radian and half the circumference formula, and it works for every circle." },
          { t:"“About 3 radius lengths fit around half a circle, and 3 is close to π ≈ 3.14, so half a turn is π radians.”", why:"That only shows half a turn is <strong>close</strong> to π. It doesn’t explain why it’s <strong>exactly</strong> π." },
          { t:"“Radians are measured in units of π, and half a turn is exactly one of those units, so half a turn is one π: π radians.”", why:"Radians are defined with the radius, not with π. The π comes from the circumference." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A bike wheel has radius 35 cm and turns at 120 rpm. How fast is the bike moving?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"0.70 m/s", why:"That treats 2 turns per second as 2 rad/s. One turn is 2π radians." },
          { t:"4.40 m/s", ok:true, why:"ω = 120 × 2π ÷ 60 = 4π rad/s. `v = rω` = 35 × 4π = 140π ≈ 439.6 cm/s ≈ 4.40 m/s." },
          { t:"8.79 m/s", why:"That uses the diameter, 70 cm. `v = rω` uses the radius." },
          { t:"263.76 m/s", why:"That forgets to divide by 60, so it’s a per-minute rate treated as per second." }] },
        b:{ prompt:"A ceiling fan’s blade tip is 60 cm from the centre, and the fan turns at 90 rpm. How fast does the tip move?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"0.90 m/s", why:"That treats 1.5 turns per second as 1.5 rad/s." },
          { t:"5.65 m/s", ok:true, why:"ω = 90 × 2π ÷ 60 = 3π rad/s. `v` = 60 × 3π = 180π ≈ 565.2 cm/s ≈ 5.65 m/s." },
          { t:"11.30 m/s", why:"That uses the diameter, 120 cm." },
          { t:"339.12 m/s", why:"That forgets to divide by 60." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Two weather stations in northern Canada lie on the same north–south line. Their latitudes differ by 9°, which is the angle between them at Earth’s centre. Earth’s radius is about 6400 km. About how far apart are they along Earth’s surface?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"320 km", why:"That uses 9/180 as the angle in radians and drops the π. 9° = 9π/180 = π/20." },
          { t:"1005 km", ok:true, why:"9° = π/20, so `a = rθ` = 6400 × π/20 = 320π ≈ 1005 km." },
          { t:"2010 km", why:"That uses Earth’s diameter, 12 800 km. Use the radius." },
          { t:"57 600 km", why:"That’s 6400 × 9, using degrees. It’s longer than the whole way around Earth (about 40 000 km)." }] },
        b:{ prompt:"Two weather stations in northern Canada lie on the same north–south line. Their latitudes differ by 22.5°, which is the angle between them at Earth’s centre. Earth’s radius is about 6400 km. About how far apart are they along Earth’s surface?", use:"π ≈ 3.14", fixedOrder:true, options:[
          { t:"800 km", why:"That uses 22.5/180 = 1/8 as the angle in radians and drops the π. 22.5° = 22.5π/180 = π/8." },
          { t:"2512 km", ok:true, why:"22.5° = π/8, so `a = rθ` = 6400 × π/8 = 800π ≈ 2512 km." },
          { t:"5024 km", why:"That uses Earth’s diameter, 12 800 km. Use the radius." },
          { t:"144 000 km", why:"That’s 6400 × 22.5, using degrees. It’s more than three times the whole way around Earth (about 40 000 km)." }] } }
    ]
  },
  task:{
    title:"Roll to quadrant 2", summary:"Roll to quadrant 2",
    statement:"<p>A robotics club is testing a wheel with a painted spoke. In the picture the robot drives to the left, so the wheel turns counterclockwise, the same way as an angle in standard position. The spoke starts along the positive `x`-axis. Choose the wheel’s radius and the driving distance so that the robot drives 40 to 60 cm, the wheel makes more than one full turn but fewer than two, and the painted spoke stops in quadrant 2. There’s more than one design. Can you find the shortest and the longest drive for your wheel?</p>",
    checks:["The robot drives 40 to 60 cm", "The wheel makes more than one full turn but fewer than two", "The painted spoke stops in quadrant 2"],
    tips:["Choose a distance from 40 to 60 cm.",
      "The wheel turns `θ = d ÷ r` radians. One full turn is 2π ≈ 6.28 and two full turns are 4π ≈ 12.57. Right now `θ` ≈ {th}.",
      "Take off the full turns: the spoke’s angle is about {phi}. Quadrant 2 runs from π/2 ≈ 1.57 to π ≈ 3.14. Together with line 2, `θ` must be between 5π/2 ≈ 7.85 and 3π ≈ 9.42."],
    invalid:"Enter a whole number from 10 to 100.",
    explainPrompt:"Explain how you know the spoke stops in quadrant 2. Then explain why a 4 cm or an 8 cm wheel can’t meet all three conditions, whatever distance you choose.",
    vocab:"Use the words radian, arc length, full turn and quadrant.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find the shortest and longest drive for your wheel?",
    afterBoth:"Only 5 cm and 6 cm wheels work. `θ` must be between 5π/2 ≈ 7.85 and 3π ≈ 9.42, so `d` must be between 7.85`r` and 9.42`r`. That range overlaps 40 to 60 only when `r` is 5 or 6."
  },
  cards:[
    ["One radian", "The angle at the centre of a circle that cuts off an arc as long as the radius. It’s about 57.3°, on any circle."],
    ["A full turn and a half turn", "Full turn: 2π radians = 360°. Half turn: π radians = 180°."],
    ["Degrees → radians", "Multiply by π/180. Example: 150° = 150π/180 = 5π/6."],
    ["Radians → degrees", "Multiply by 180/π. Example: 7π/4 × 180/π = 315°."],
    ["The benchmarks", "π/2 ≈ 1.57, π ≈ 3.14, 3π/2 ≈ 4.71, 2π ≈ 6.28. Example: 4 radians is between π and 3π/2, in quadrant 3."],
    ["Arc length", "`a = rθ`, with `θ` in radians. Example: `r` = 5 cm and `θ = 2π/5` give `a` = 2π cm."],
    ["`θ = a ÷ r`", "An angle in radians counts how many radius lengths fit along its arc. An arc of 12 cm on a circle of radius 8 cm makes 1.5 radians."],
    ["Angular velocity", "`ω = θ ÷ t`, the angle turned per unit of time, usually in rad/s."],
    ["rpm → rad/s", "Multiply by 2π, then divide by 60. Example: 30 rpm = π rad/s. (“Revolutions per minute” means the same thing.)"],
    ["`v = rω`", "All points on one wheel share ω. A point at distance `r` moves at speed `rω`, so farther out is faster."],
    ["Belts, chains and meshing gears", "The rims move at the same speed: `r_1ω_1 = r_2ω_2`. The smaller wheel turns faster."],
    ["`sin 2` vs `sin 2°`", "`sin 2` means 2 radians: `sin 2 ≈ 0.909`. A calculator in degree mode gives `sin 2° ≈ 0.035` instead."]
  ]
};

// θ inside `math` gets the cerulean parameter colour (@t).
const TH = s => s.replace(/`([^`]*)`/g, (_, x) => "`" + x.replace(/@t\{θ\}/g, "θ").replace(/θ/g, "@t{θ}") + "`");
function deep(o){
  if (typeof o === "string") return TH(o);
  if (Array.isArray(o)) return o.map(deep);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = deep(o[k]); return r; }
  return o;
}
export default deep(CONTENT);
