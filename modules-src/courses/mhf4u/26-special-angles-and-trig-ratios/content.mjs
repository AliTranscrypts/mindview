// MHF4U 26 Special Angles and Trig Ratios. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/26-special-angles-and-trig-ratios.md
// Angles are stored in twelfths of π (k = 10 means 10π/12 = 5π/6). Inside `math`, value fractions such as 1/2 and √3/2
// are stacked and θ is coloured cerulean by fx() at the bottom of this file, so the text below stays readable.

const LAB = { 0:"0", 2:"π/6", 3:"π/4", 4:"π/3", 6:"π/2", 8:"2π/3", 9:"3π/4", 10:"5π/6", 12:"π", 14:"7π/6", 15:"5π/4", 16:"4π/3", 18:"3π/2", 20:"5π/3", 21:"7π/4", 22:"11π/6" };
const quadOf = k => k < 6 ? 1 : k < 12 ? 2 : k < 18 ? 3 : 4;
const refOf = k => { const m = k % 12; return m <= 6 ? m : 12 - m; };
const refExpr = k => { const q = quadOf(k), a = LAB[k], r = LAB[refOf(k)]; return q === 1 ? r : q === 2 ? "π - " + a + " = " + r : q === 3 ? a + " - π = " + r : "2π - " + a + " = " + r; };

// ---------- Practice 1: sorter items, mistake feedback and hints built from the item (plan: "built from the item") ----------
const SIZE = { 2:{ sin:"1/2", cos:"√3/2" }, 4:{ sin:"√3/2", cos:"1/2" } };
const NAME = { sin:"sine", cos:"cosine" };
const BOXES = { b1:["1/2", 1], b2:["1/2", -1], b3:["√3/2", 1], b4:["√3/2", -1] };
const sgn = (r, k) => ((r === "sin" ? Math.sin(k * Math.PI / 12) : Math.cos(k * Math.PI / 12)) > 0 ? 1 : -1);
function sortItem(id, r, k, why){
  const ref = refOf(k), size = SIZE[ref][r], s = sgn(r, k), q = quadOf(k), a = LAB[k], word = s > 0 ? "positive" : "negative";
  const box = Object.keys(BOXES).find(b => BOXES[b][0] === size && BOXES[b][1] === s);
  const SIGN = "Right size, wrong sign. `" + a + "` is in quadrant " + q + ", where " + NAME[r] + " is " + word + ".";
  const SZ = "Check the size. `" + a + "` has reference angle `" + LAB[ref] + "`. For `π/6`, sine is the small value `1/2` and cosine is the large value `√3/2`. For `π/3` it’s the other way round.";
  const wrong = {};
  for (const b of Object.keys(BOXES)) {
    if (b === box) continue;
    const sizeOk = BOXES[b][0] === size, signOk = BOXES[b][1] === s;
    wrong[b] = sizeOk ? SIGN : signOk ? SZ : SZ + " " + SIGN;
  }
  return { id, t:"`" + r + "(" + a + ")`", answer:box, why, wrong, hints:[
    "Find the quadrant and the reference angle of `" + a + "`.",
    "`" + a + "` is in quadrant " + q + " with reference angle `" + refExpr(k) + "`. In quadrant " + q + ", " + NAME[r] + " is " + word + ".",
    "`" + r + "(" + LAB[ref] + ") = " + size + "`, and the sign is " + word + ", so `" + r + "(" + a + ") = " + (s < 0 ? "-" : "") + size + "`."] };
}

const content = {
  id:"26-special-angles-and-trig-ratios",
  kind:"topic",
  title:"Special angles and trig ratios",
  topic:"Special Angles and Trig Ratios",
  readyTopic:"special angles and trig ratios",
  hero:{
    eq:"`P(θ) = (cos θ, sin θ)`", eqLabel:"P of theta equals cos theta, sin theta", eqSize:"md",
    headline:"Every angle is a point on a circle",
    text:"Put the centre of a circle of radius 1 at the origin. This is the <strong>unit circle</strong>. Any angle `θ` in standard position ends at a point on it, and that point’s coordinates are `(cos θ, sin θ)`. For the <strong>special angles</strong> (multiples of `π/6`, `π/4` and `π/3`), those coordinates are exact values you can find without a calculator, using just two triangles.",
    fig:{ aria:"Unit circle. The terminal arm sweeps through the 16 special angles and leaves a dot at each one.", shape:"square" }
  },
  goals:[
    "I can use the two special triangles to find the exact sine, cosine and tangent of `π/6`, `π/4` and `π/3`.",
    "I can place any multiple of `π/6`, `π/4` or `π/3` (from 0 to `2π`) on the unit circle and name its quadrant and reference angle.",
    "I can use the CAST rule to decide whether sin, cos and tan are positive or negative in each quadrant.",
    "I can find the exact sine, cosine and tangent of any special angle from 0 to `2π`, including 0, `π/2`, `π`, `3π/2` and `2π`.",
    "I can find the exact values of csc, sec and cot, and say when each one is undefined.",
    "I can use exact values to solve problems, such as finding `θ` from a ratio and a quadrant, or finding coordinates on a circle."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Special triangles", goal:1,
          prompt:"In a 30°–60°–90° triangle with hypotenuse 2, how long is the side opposite the 30° angle?",
          options:[
            { t:"1", ok:true, why:"The shortest side is opposite the smallest angle. In a 30°–60°–90° triangle it’s exactly half the hypotenuse: 2 ÷ 2 = 1." },
            { t:"`√3`", why:"`√3` is opposite the 60° angle. The side opposite the smaller angle (30°) is the shorter one." },
            { t:"`√2`", why:"`√2` belongs to the 45°–45°–90° triangle with legs 1 and 1. This triangle’s sides are 1, `√3` and 2." },
            { t:"`1/2`", why:"`1/2` is the <strong>ratio</strong> sin 30° = opposite/hypotenuse. The question asks for the side itself: `1/2 × 2 = 1`." }],
          hints:["The side opposite the smallest angle is the shortest side.", "In a 30°–60°–90° triangle, the shortest side is exactly half the hypotenuse.", "Half of 2 is 1, so the side opposite 30° is 1. (The other leg is `√3`, because `1^2 + (√3)^2 = 2^2`.)"] },
        { id:"w2", skill:"Special triangles", goal:1,
          prompt:"What is the exact value of cos 45°?",
          options:[
            { t:"`√2/2`", ok:true, why:"In the 45°–45°–90° triangle with legs 1 and 1, the hypotenuse is `√2`, so cos 45° = `1/√2 = √2/2`." },
            { t:"1", why:"1 is tan 45° (opposite ÷ adjacent = 1 ÷ 1). Cosine is adjacent ÷ hypotenuse = `1/√2`." },
            { t:"`√3/2`", why:"`√3/2` is cos 30°, from the 30°–60°–90° triangle." },
            { t:"`1/2`", why:"`1/2` is cos 60°. For 45°, use the triangle with legs 1, 1 and hypotenuse `√2`." }],
          hints:["Use the 45°–45°–90° triangle with legs 1 and 1.", "Its hypotenuse is `√{1^2 + 1^2} = √2`. Cosine is adjacent over hypotenuse.", "cos 45° = `1/√2`. Multiply the top and bottom by `√2` to get `√2/2`."] },
        { id:"w3", skill:"Radian measure", goal:2,
          prompt:"Which angle in radians equals 120°?",
          options:[
            { t:"`2π/3`", ok:true, why:"Multiply by `π/180`: `120 × π/180 = 2π/3`." },
            { t:"`π/3`", why:"120° is one-third of a full turn, but a full turn is `2π`, not `π`. One-third of `2π` is `2π/3`." },
            { t:"`120π`", why:"The conversion factor is `π/180`, not `π`: `120 × π/180 = 2π/3`." },
            { t:"`3π/2`", why:"That’s `180/120 × π`. The factor is upside down: `3π/2` is 270°." }],
          hints:["To change degrees to radians, multiply by `π/180`.", "`120 × π/180 = 120π/180`. Simplify the fraction `120/180`.", "`120/180 = 2/3`, so 120° = `2π/3`."] },
        { id:"w4", skill:"Radian measure", goal:2,
          prompt:"In which quadrant is the terminal arm of `5π/4`?",
          options:[
            { t:"Quadrant 3", ok:true, why:"With quarters of `π` as the unit: `π = 4π/4` and `3π/2 = 6π/4`. `5π/4` is between them, so it’s in quadrant 3." },
            { t:"Quadrant 2", why:"`π` is `4π/4`, so `5π/4` is already past the negative `x`-axis." },
            { t:"Quadrant 1", why:"`π/4` is in quadrant 1, but `5π/4 = π/4 + π` is a further half turn, which lands in quadrant 3." },
            { t:"Quadrant 4", why:"Quadrant 4 starts at `3π/2 = 6π/4`. `5π/4` hasn’t reached it." }],
          hints:["Write the quadrant boundaries in quarters of `π`: `π/2 = 2π/4`, `π = 4π/4`, `3π/2 = 6π/4`.", "Which two boundaries does `5π/4` fall between?", "`4π/4 < 5π/4 < 6π/4`, so it’s between `π` and `3π/2`: quadrant 3."] },
        { id:"w5", skill:"Radicals", goal:1,
          prompt:"Simplify `2/√2`.",
          options:[
            { t:"`√2`", ok:true, why:"Multiply the top and bottom by `√2`: `2√2/2 = √2`. Check: `√2 ≈ 1.41`, and 2 ÷ 1.41 ≈ 1.41." },
            { t:"1", why:"`√2` isn’t 2, it’s about 1.41. So `2/√2 ≈ 1.41`, not 1." },
            { t:"`2√2`", why:"You multiplied the top by `√2` but not the bottom. `√2 × √2 = 2`, so `2√2/2 = √2`." },
            { t:"`√2/2`", why:"`√2/2 ≈ 0.71`, which is `1/√2`, the reciprocal of `√2`. But `2/√2` is bigger than 1." }],
          hints:["Clear the square root from the bottom by multiplying the top and bottom by `√2`.", "`(2 × √2)/(√2 × √2) = 2√2/2`.", "`2√2/2 = √2`."] },
        { id:"w6", skill:"Terminal arm ratios", goal:4,
          prompt:"The terminal arm of angle `θ` passes through (−3, 4). What is `sin θ`?",
          options:[
            { t:"`4/5`", ok:true, why:"`r = √{(-3)^2 + 4^2} = 5`, and `sin θ = y/r = 4/5`." },
            { t:"`-4/5`", why:"`y = 4` is positive and `r` is always positive, so `sin θ = 4/5` is positive. The point is in quadrant 2, where sine is positive." },
            { t:"`-3/5`", why:"`-3/5` is `x/r`, which is `cos θ`. Sine uses `y`." },
            { t:"`-4/3`", why:"`-4/3` is `y/x`, which is `tan θ`. Sine is `y/r`." }],
          hints:["First find `r`, the distance from the origin: `r = √{x^2 + y^2}`.", "`r = √{9 + 16} = 5`. Sine is `y` over `r`.", "`sin θ = y/r = 4/5`."] }
      ],
      refreshers:{
        "Special triangles":"Two triangles give every exact value in this module.<ul style=\"margin:6px 0\"><li>The 45°–45°–90° triangle has legs 1 and 1 and hypotenuse `√2`.</li><li>The 30°–60°–90° triangle has sides 1, `√3` and 2: the short side 1 is opposite 30°, `√3` is opposite 60°, and 2 is the hypotenuse.</li></ul>Example: sin 60° = `√3/2`, and cos 60° = `1/2`.",
        "Radian measure":"A full turn is `2π` radians, which is 360°, so `π` = 180°. To change degrees to radians, multiply by `π/180`: 120° = `120π/180 = 2π/3`. To place an angle, write the boundaries `π/2`, `π` and `3π/2` with the same denominator. For example, `5π/4` is between `4π/4 = π` and `6π/4 = 3π/2`, so it’s in quadrant 3.",
        "Radicals":"To clear a square root from the bottom of a fraction, multiply the top and bottom by that root: `2/√2 = 2√2/2 = √2`, and `1/√3 = √3/3`. Both forms are correct. This module writes the second form and accepts either.",
        "Terminal arm ratios":"For a point `(x, y)` on the terminal arm, `r = √{x^2 + y^2}` is its distance from the origin, and `r` is always positive. Then `sin θ = y/r`, `cos θ = x/r` and `tan θ = y/x`. For (−3, 4): `r = 5`, so `sin θ = 4/5`, `cos θ = -3/5` and `tan θ = -4/3`."
      }
    }
  },
  explore:{
    heading:"Unit circle explorer",
    intro:"Step the angle around the circle and watch the point. The panel lists every exact value. Turn on the reference triangle to see where the numbers come from.",
    predIntro:"Make a prediction first. Then the explorer will show you what really happens.",
    predictions:[
      { id:"p1", start:{ k:2 },
        prompt:"The arm is at `π/6`. If it rotates to `5π/6`, what will the point be?",
        options:[{ t:"`(-√3/2, 1/2)`", ok:true }, { t:"`(√3/2, -1/2)`" }, { t:"`(-1/2, √3/2)`" }, { t:"`(-√3/2, -1/2)`" }],
        explain:"`5π/6 = π - π/6`, so its reference angle is `π/6`. It’s the same triangle, mirrored across the `y`-axis. The `x`-coordinate changes sign; the `y`-coordinate stays `1/2`. (The other options are `11π/6`, `2π/3` and `7π/6`.)" },
      { id:"p2", start:{ k:4 },
        prompt:"As `θ` increases from `π/3` to `π/2`, what happens to `cos θ`?",
        options:[{ t:"It decreases to 0", ok:true }, { t:"It increases to 1" }, { t:"It stays the same" }, { t:"It decreases to −1" }],
        explain:"`cos θ` is the `x`-coordinate. As the arm swings up toward the `y`-axis, the point moves left toward `x = 0`, so `cos θ` shrinks from `1/2` to 0. A bigger angle doesn’t mean a bigger ratio." },
      { id:"p3", start:{ k:3 },
        prompt:"The arm will visit `3π/4`, `5π/4` and `7π/4` in turn. At how many of those three angles is `tan θ` positive?",
        options:[{ t:"One", ok:true }, { t:"None" }, { t:"Two" }, { t:"All three" }],
        explain:"`tan θ = y/x`, which is positive when `x` and `y` have the same sign, in quadrants 1 and 3. Of the three angles, only `5π/4` is in quadrant 3, so `tan(5π/4) = 1`. The other two give −1." },
      { id:"p4", start:{ k:0 },
        prompt:"The arm will step from 0 up to `π/2`. What will `tan θ` be at `π/2`?",
        options:[{ t:"Undefined", ok:true }, { t:"0" }, { t:"1" }, { t:"∞ (infinity)" }],
        explain:"At `π/2` the point is (0, 1), so `tan θ = y/x = 1/0`. Dividing by 0 has no answer, so `tan(π/2)` is <strong>undefined</strong>. As `θ` gets close to `π/2`, `tan θ` gets as large as you like, but at `π/2` itself there’s no value, not even ∞." }
    ],
    chalIntro:"Set the explorer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Move the arm so that the point is `(-√2/2, -√2/2)`.",
        why:"`π + π/4 = 5π/4`.",
        hints:["Which quadrant has both coordinates negative?", "Quadrant 3. Both coordinates have size `√2/2`, so the reference angle is `π/4`.", "`π + π/4 = 5π/4`."] },
      { id:"tc2", goal:[4, 6], prompt:"Find the angle in quadrant 4 whose tangent is `-√3/3`.",
        why:"`2π - π/6 = 11π/6`.",
        hints:["Which reference angle has tangent `√3/3`?", "`tan(π/6) = √3/3`. Now go to quadrant 4.", "`2π - π/6 = 11π/6`."] },
      { id:"tc3", goal:[2, 6], stretch:true,
        prompt:"Find <strong>two different</strong> special angles, neither on an axis, with the <strong>same cosine</strong> but <strong>opposite sines</strong>. Set the first angle and press <strong>Pin</strong>, then set the second and press <strong>Check challenge</strong>.",
        why:"A reflection in the `x`-axis sends `θ` to `2π - θ`: same `x`, opposite `y`. There are six pairs: (`π/6`, `11π/6`), (`π/4`, `7π/4`), (`π/3`, `5π/3`), (`2π/3`, `4π/3`), (`3π/4`, `5π/4`) and (`5π/6`, `7π/6`).",
        hints:["Same `x`, opposite `y`: what kind of reflection does that?", "A reflection in the `x`-axis sends `θ` to `2π - θ`.", "For example, `π/6` and `2π - π/6 = 11π/6`: both have cosine `√3/2`, with sines `1/2` and `-1/2`."] }
    ]
  },
  part3:{
    slug:"cast", name:"CAST",
    heading:"Angle families: one triangle, four quadrants",
    intro:"Pick a reference angle, then move its triangle into each quadrant. Predict the signs before you check.",
    blocks:[{ title:"What the rule means", html:"<p><strong>Exact value of a special angle, in four steps</strong></p><ol><li>Find the quadrant.</li><li>Find the reference angle (the angle to the `x`-axis): quadrant 2: `π - θ`; quadrant 3: `θ - π`; quadrant 4: `2π - θ`.</li><li>Use the special triangle for the size.</li><li>Use CAST for the sign.</li></ol><p>Angles on an axis (0, `π/2`, `π`, `3π/2`, `2π`) have no reference triangle. Read sin and cos straight from the point: (1, 0), (0, 1), (−1, 0), (0, −1).</p>" }],
    quickCheck:{
      title:"Positive or negative?", summary:"Positive or negative?",
      items:[
        { id:"q1", goal:3, prompt:"`cos(4π/3)`",
          choices:[{ t:"Positive", fb:"`4π/3` is between `π` and `3π/2`, in quadrant 3. The point is left of the `y`-axis, so cosine is negative." }, { t:"Negative", ok:true, fb:"Right. `4π/3` is in quadrant 3, where only tangent is positive. `cos(4π/3) = -1/2`." }] },
        { id:"q2", goal:3, prompt:"`tan(11π/6)`",
          choices:[{ t:"Positive", fb:"`11π/6` is in quadrant 4: `x` positive, `y` negative. `tan = y/x` is negative." }, { t:"Negative", ok:true, fb:"Right. `11π/6` is in quadrant 4, where only cosine is positive. `tan(11π/6) = -√3/3`." }] },
        { id:"q3", goal:3, prompt:"`sin(3π/4)`",
          choices:[{ t:"Positive", ok:true, fb:"Right. `3π/4` is in quadrant 2, where sine is positive. `sin(3π/4) = √2/2`." }, { t:"Negative", fb:"`3π/4` is in quadrant 2, above the `x`-axis, so its `y`-coordinate (sine) is positive." }] },
        { id:"q4", goal:3, prompt:"`sec(5π/3)`",
          choices:[{ t:"Positive", ok:true, fb:"Right. `sec = 1/cos`, and cosine is positive in quadrant 4, so `sec(5π/3) = 1/(1/2) = 2`." }, { t:"Negative", fb:"sec has the same sign as cos, because `sec = 1/cos`. `5π/3` is in quadrant 4, where cosine is positive." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort by exact value", summary:"Sort by exact value", goal:[4, 1, 3],
        instruction:"Sort each expression into the box with its exact value.", how:"Tap an expression, then tap the box it belongs in.", noun:"expression",
        boxes:[{ id:"b1", label:"`1/2`" }, { id:"b2", label:"`-1/2`" }, { id:"b3", label:"`√3/2`" }, { id:"b4", label:"`-√3/2`" }],
        items:[
          sortItem("i1", "sin", 2, "`π/6` is the small angle, so its sine is the short side: `1/2`."),
          sortItem("i2", "cos", 4, "Next to the `π/3` angle is the short side: `cos(π/3) = 1/2`."),
          sortItem("i3", "sin", 10, "Reference angle `π/6`, quadrant 2, where sine is positive: `1/2`."),
          sortItem("i4", "cos", 8, "Reference angle `π/3`, quadrant 2, where cosine is negative: `-1/2`."),
          sortItem("i5", "sin", 14, "Reference angle `π/6`, quadrant 3, where sine is negative: `-1/2`."),
          sortItem("i6", "sin", 22, "Reference angle `π/6`, quadrant 4, where sine is negative: `-1/2`."),
          sortItem("i7", "cos", 2, "Next to the `π/6` angle is the long leg: `cos(π/6) = √3/2`."),
          sortItem("i8", "sin", 8, "Reference angle `π/3`, quadrant 2, where sine is positive: `√3/2`."),
          sortItem("i9", "cos", 22, "Reference angle `π/6`, quadrant 4, where cosine is positive: `√3/2`."),
          sortItem("i10", "cos", 10, "Reference angle `π/6`, quadrant 2, where cosine is negative: `-√3/2`."),
          sortItem("i11", "sin", 16, "Reference angle `π/3`, quadrant 3, where sine is negative: `-√3/2`."),
          sortItem("i12", "cos", 14, "Reference angle `π/6`, quadrant 3, where cosine is negative: `-√3/2`.")
        ] },
      { id:"angles", type:"custom", title:"Find the angles", summary:"Find the angles", star:true, goal:[6, 4, 5],
        instruction:"Tap <strong>every</strong> special angle from 0 to `2π` that fits. Then press Check.",
        how:"Tap the dots on the circle (or use the arrow keys and Enter). Tapped dots turn yellow.",
        fallback:"Some of your angles don’t fit. Check each one: does {r} equal {v}?",
        items:[
          { id:"f1", goal:[6, 4], prompt:"`sin θ = √2/2`", ratio:"sin", value:"`√2/2`", answer:[3, 9],
            rules:[{ only:[3], fb:"There’s a second angle. Sine is positive in quadrants 1 <strong>and</strong> 2." },
                   { any:[21, 15], fb:"At § sine is `-√2/2`: right size, wrong sign." }],
            hints:["First ignore the sign: which reference angle has sine `√2/2`?", "`sin(π/4) = √2/2`, so the reference angle is `π/4`. Sine is positive in quadrants 1 and 2.", "In quadrant 1: `π/4`. In quadrant 2: `π - π/4 = 3π/4`. The answers are `π/4` and `3π/4`."] },
          { id:"f2", goal:[6, 4], prompt:"`cos θ = -1/2`", ratio:"cos", value:"`-1/2`", answer:[8, 16],
            rules:[{ any:[4, 20], fb:"At § cosine is `+1/2`. Cosine is negative in quadrants 2 and 3." },
                   { any:[10, 14], fb:"That’s the wrong size. `cos = -1/2` needs reference angle `π/3`, not `π/6`." }],
            hints:["First ignore the sign: which reference angle has cosine `1/2`?", "`cos(π/3) = 1/2`, so the reference angle is `π/3`. Cosine is negative in quadrants 2 and 3.", "In quadrant 2: `π - π/3 = 2π/3`. In quadrant 3: `π + π/3 = 4π/3`. The answers are `2π/3` and `4π/3`."] },
          { id:"f3", goal:[6, 4], prompt:"`tan θ = -√3`", ratio:"tan", value:"`-√3`", answer:[8, 20],
            rules:[{ any:[4, 16], fb:"`tan(§) = +√3`. Tangent is negative in quadrants 2 and 4." },
                   { any:[10, 22], fb:"tan of a `π/6`-family angle is `±√3/3`. `√3` needs reference angle `π/3`." }],
            hints:["First ignore the sign: which reference angle has tangent `√3`?", "`tan(π/3) = √3`, so the reference angle is `π/3`. Tangent is negative in quadrants 2 and 4.", "In quadrant 2: `π - π/3 = 2π/3`. In quadrant 4: `2π - π/3 = 5π/3`. The answers are `2π/3` and `5π/3`."] },
          { id:"f4", goal:[6, 4], prompt:"`sin θ = -1`", ratio:"sin", value:"−1", answer:[18],
            rules:[{ any:[6], fb:"`sin(π/2) = +1`. The point (0, −1) is at `3π/2`." },
                   { any:[12], fb:"At `π` the point is (−1, 0), so `sin π = 0`. It’s `cos π` that equals −1." }],
            hints:["Sine is the `y`-coordinate. Where on the unit circle is `y = -1`?", "`y = -1` only at the bottom of the circle, the point (0, −1).", "The point (0, −1) is on the negative `y`-axis, at `θ = 3π/2`. That’s the only answer."] },
          { id:"f5", goal:[6, 5], prompt:"`sec θ = 2`", ratio:"sec", value:"2", answer:[4, 20],
            rules:[{ only:[2, 10], fb:"sec pairs with cos, not sin. `sec θ = 2` means `cos θ = 1/2`." },
                   { any:[8, 16], fb:"There, `cos = -1/2`, so `sec = -2`." }],
            hints:["Turn it into a cosine question: `sec θ = 1/cos θ`.", "`sec θ = 2` means `cos θ = 1/2`. Which reference angle has cosine `1/2`, and where is cosine positive?", "Reference angle `π/3`. Cosine is positive in quadrants 1 and 4: `θ = π/3` and `θ = 2π - π/3 = 5π/3`."] },
          { id:"f6", goal:[6, 5], prompt:"`cot θ = 1`", ratio:"cot", value:"1", answer:[3, 15],
            rules:[{ only:[3], fb:"`cot = 1/tan`, and `tan = 1` in quadrants 1 <strong>and</strong> 3." },
                   { any:[9, 21], fb:"There `tan = -1`, so `cot = -1`." }],
            hints:["Turn it into a tangent question: `cot θ = 1/tan θ`.", "`cot θ = 1` means `tan θ = 1`. Which reference angle has tangent 1, and where is tangent positive?", "Reference angle `π/4`. Tangent is positive in quadrants 1 and 3: `θ = π/4` and `θ = π + π/4 = 5π/4`."] },
          { id:"f7", goal:[6, 5], prompt:"`csc θ = -√2`", ratio:"csc", value:"`-√2`", answer:[15, 21],
            rules:[{ only:[9, 15], fb:"`csc θ = -√2` means `sin θ = -1/√2 = -√2/2`. Check the sign of sine at `3π/4`." },
                   { any:[3, 9], fb:"csc has the same sign as sin. sin is negative in quadrants 3 and 4." }],
            hints:["Turn it into a sine question: `csc θ = 1/sin θ`.", "`csc θ = -√2` means `sin θ = -1/√2 = -√2/2`. Which reference angle has sine `√2/2`, and where is sine negative?", "Reference angle `π/4`. Sine is negative in quadrants 3 and 4: `θ = π + π/4 = 5π/4` and `θ = 2π - π/4 = 7π/4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Priya", how:"",
        instruction:"Priya made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the exact value of `cos(7π/6)`.",
            steps:["`7π/6` is between `π` (`6π/6`) and `3π/2` (`9π/6`), so it’s in quadrant 3.", "The reference angle is `7π/6 - π = π/6`.", "In quadrant 3, cosine is positive.", "`cos(π/6) = √3/2`, so `cos(7π/6) = √3/2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: in quadrant 3, the reference angle is `θ - π`.", "", "Step 4 uses step 3’s sign correctly. The mistake is earlier."],
            fixes:[
              { t:"In quadrant 3, only tangent is positive, so cosine is negative: `cos(7π/6) = -√3/2`.", ok:true, why:"Both coordinates are negative in quadrant 3, so `cos(7π/6) = -√3/2`." },
              { t:"In quadrant 3, cosine is negative, so `cos(7π/6) = -1/2`.", why:"The sign is right now, but the size isn’t. Reference angle `π/6` gives cosine `√3/2`, not `1/2`." },
              { t:"In quadrant 3, sine and cosine are positive, so `cos(7π/6) = √3/2`.", why:"In quadrant 3 the point is below and to the left of the origin. Both coordinates are negative." },
              { t:"Step 3 is correct as written.", why:"Picture the point for `7π/6`: it’s left of the `y`-axis, so its `x`-coordinate (cosine) is negative." }],
            hints:["Check each step against CAST.", "Which ratio is positive in quadrant 3? Is the point’s `x`-coordinate positive or negative there?", "Step 3 is wrong. In quadrant 3 only tangent is positive, so `cos(7π/6) = -√3/2`."] },
          { id:"e2", goal:5, task:"Find the exact value of `csc(5π/3)`.",
            steps:["`5π/3` is in quadrant 4, with reference angle `2π - 5π/3 = π/3`.", "`csc θ = 1/cos θ`.", "`cos(5π/3) = 1/2`, since cosine is positive in quadrant 4.", "So `csc(5π/3) = 1/(1/2) = 2`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "This statement is true. The mistake is in deciding which ratio to use.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"`csc θ = 1/sin θ`. `sin(5π/3) = -√3/2`, so `csc(5π/3) = -2/√3 = -2√3/3`.", ok:true, why:"Cosecant is the reciprocal of sine, and sine is negative in quadrant 4." },
              { t:"`csc θ = sin^{-1} θ`, the inverse of sine.", why:"`sin^{-1}` is the inverse function: the angle with a given sine. csc is the <strong>reciprocal</strong>, 1/sin." },
              { t:"`csc θ = 1/tan θ`.", why:"1/tan is cot. Remember: each reciprocal pair has exactly one ‘co’. <strong>Co</strong>secant pairs with sine." },
              { t:"Step 2 is correct as written.", why:"`1/cos θ` is `sec θ`. `csc θ` is `1/sin θ`." }],
            hints:["Check step 2: which ratio is csc the reciprocal of?", "Each reciprocal pair has exactly one ‘co’: <strong>co</strong>secant–sine, secant–<strong>co</strong>sine, <strong>co</strong>tangent–tangent.", "Step 2 is wrong: `csc θ = 1/sin θ`. `sin(5π/3) = -√3/2`, so `csc(5π/3) = -2/√3 = -2√3/3`."] },
          { id:"e3", goal:2, task:"Find the exact value of `sin(2π/3)`.",
            steps:["`2π/3` is between `π/2` and `π`, so it’s in quadrant 2.", "The reference angle is `2π/3 - π/2 = π/6`.", "In quadrant 2, sine is positive.", "`sin(π/6) = 1/2`, so `sin(2π/3) = 1/2`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is true. The mistake is earlier.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"The reference angle is `π - 2π/3 = π/3`, measured to the `x`-axis, so `sin(2π/3) = √3/2`.", ok:true, why:"Reference angles are measured to the `x`-axis, never the `y`-axis." },
              { t:"The reference angle is `2π/3` itself, so `sin(2π/3) = sin(2π/3)`.", why:"A reference angle is always between 0 and `π/2`. That’s what lets you use the special triangles." },
              { t:"The reference angle is `π/6`, but sine is negative in quadrant 2, so `sin(2π/3) = -1/2`.", why:"This keeps the wrong reference angle and adds a sign error. Sine is positive in quadrant 2." },
              { t:"Step 2 is correct as written.", why:"`2π/3 - π/2` measures the angle to the `y`-axis. The reference angle is measured to the `x`-axis: `π - 2π/3 = π/3`." }],
            hints:["Check how step 2 measures the reference angle.", "Reference angles are measured to the nearest part of the `x`-axis. In quadrant 2, that’s `π - θ`.", "Step 2 is wrong: the reference angle is `π - 2π/3 = π/3`, so `sin(2π/3) = √3/2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about the coordinates of the points on the unit circle?" },
      { id:"j2", q:"In your own words, why are the coordinates of the point exactly `(cos θ, sin θ)`?" },
      { id:"j3", q:"Explain to a friend, step by step, how to find `cos(5π/4)` exactly without a calculator." },
      { id:"j4", q:"Which special-angle values do you still have to work out rather than just know? What will you do to make them stick?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the exact value of `sin(π/3)`?", options:[
          { t:"`√3/2`", ok:true, why:"`π/3` is the larger angle in the 30°–60°–90° triangle, so its opposite side is the long leg: `√3/2`." },
          { t:"`1/2`", why:"`1/2` is `sin(π/6)`. The larger angle `π/3` has the larger sine." },
          { t:"`√2/2`", why:"`√2/2` is the value for `π/4`." },
          { t:"`√3`", why:"`√3` is `tan(π/3) = (√3/2) ÷ (1/2)`." }] },
        b:{ prompt:"What is the exact value of `cos(π/6)`?", options:[
          { t:"`√3/2`", ok:true, why:"Next to the `π/6` angle is the long leg: `√3/2`." },
          { t:"`1/2`", why:"`1/2` is `cos(π/3)`." },
          { t:"`√3/3`", why:"`√3/3` is `tan(π/6)`." },
          { t:"`√2/2`", why:"`√2/2` is the value for `π/4`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"In which quadrant are sine and tangent both negative?", options:[
          { t:"Quadrant 4", ok:true, why:"In quadrant 4 only cosine is positive (the C in CAST)." },
          { t:"Quadrant 3", why:"In quadrant 3, tangent is positive (the T in CAST)." },
          { t:"Quadrant 2", why:"In quadrant 2, sine is positive (the S in CAST)." },
          { t:"Quadrant 1", why:"In quadrant 1 all three ratios are positive." }] },
        b:{ prompt:"In which quadrant is cosine negative but tangent positive?", options:[
          { t:"Quadrant 3", ok:true, why:"Only tangent is positive in quadrant 3." },
          { t:"Quadrant 2", why:"In quadrant 2, tangent is negative." },
          { t:"Quadrant 4", why:"In quadrant 4, cosine is positive." },
          { t:"Quadrant 1", why:"In quadrant 1, cosine is positive." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the exact value of `csc(π/6)`?", options:[
          { t:"2", ok:true, why:"`csc(π/6) = 1/sin(π/6) = 1/(1/2) = 2`." },
          { t:"`1/2`", why:"That’s `sin(π/6)`. csc is its reciprocal." },
          { t:"`2√3/3`", why:"That’s `1/cos(π/6)`, which is `sec(π/6)`. csc pairs with sine." },
          { t:"`√3`", why:"That’s `cot(π/6) = 1/tan(π/6)`." }] },
        b:{ prompt:"What is the exact value of `sec(π/3)`?", options:[
          { t:"2", ok:true, why:"`sec(π/3) = 1/cos(π/3) = 1/(1/2) = 2`." },
          { t:"`1/2`", why:"That’s `cos(π/3)`. sec is its reciprocal." },
          { t:"`2√3/3`", why:"That’s `1/sin(π/3)`, which is `csc(π/3)`. sec pairs with cosine." },
          { t:"`√3/3`", why:"That’s `cot(π/3) = 1/√3`." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Which angle from 0 to `2π` has the same sine as `π/5`?", options:[
          { t:"`4π/5`", ok:true, why:"`π - π/5 = 4π/5` is the quadrant 2 angle with reference angle `π/5`. Sine is positive in both quadrants 1 and 2." },
          { t:"`6π/5`", why:"`π + π/5` has the same reference angle, but it’s in quadrant 3, where sine is negative." },
          { t:"`9π/5`", why:"`2π - π/5` has the same reference angle, but it’s in quadrant 4, where sine is negative." },
          { t:"`3π/10`", why:"`π/2 - π/5` is the complementary angle. Its <strong>cosine</strong> equals `sin(π/5)`, not its sine." }] },
        b:{ prompt:"Which angle from 0 to `2π` has the same cosine as `π/7`?", options:[
          { t:"`13π/7`", ok:true, why:"`2π - π/7 = 13π/7` is in quadrant 4, where cosine is positive, with reference angle `π/7`." },
          { t:"`6π/7`", why:"`π - π/7` is in quadrant 2, where cosine is negative." },
          { t:"`8π/7`", why:"`π + π/7` is in quadrant 3, where cosine is negative." },
          { t:"`5π/14`", why:"`π/2 - π/7` is complementary. Its <strong>sine</strong> equals `cos(π/7)`." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"`cos θ = -√2/2` and `sin θ > 0`, with `0 ≤ θ ≤ 2π`. What is `θ`?", options:[
          { t:"`3π/4`", ok:true, why:"Cosine negative and sine positive means quadrant 2. The reference angle is `π/4`, so `θ = π - π/4 = 3π/4`." },
          { t:"`5π/4`", why:"`cos(5π/4) = -√2/2`, but `sin(5π/4)` is negative too." },
          { t:"`π/4`", why:"`cos(π/4) = +√2/2`. The negative sign puts `θ` left of the `y`-axis." },
          { t:"`7π/4`", why:"At `7π/4`, cosine is positive and sine is negative: the signs are the wrong way round." }] },
        b:{ prompt:"`sin θ = -1/2` and `tan θ > 0`, with `0 ≤ θ ≤ 2π`. What is `θ`?", options:[
          { t:"`7π/6`", ok:true, why:"Sine negative and tangent positive means quadrant 3. The reference angle is `π/6`, so `θ = π + π/6 = 7π/6`." },
          { t:"`11π/6`", why:"`sin(11π/6) = -1/2`, but `tan(11π/6)` is negative." },
          { t:"`π/6`", why:"`sin(π/6) = +1/2`." },
          { t:"`4π/3`", why:"`sin(4π/3) = -√3/2`. The size `1/2` needs reference angle `π/6`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"`P` is the point on the unit circle at `θ = 2π/3`. `Q` is the point at `θ = 2π/3 + π`. What are `Q`’s coordinates?", options:[
          { t:"`(1/2, -√3/2)`", ok:true, why:"Adding `π` is a half turn: both coordinates change sign. `P = (-1/2, √3/2)`, so `Q = (1/2, -√3/2)`." },
          { t:"`(-1/2, -√3/2)`", why:"That flips only `y`: a reflection in the `x`-axis, not a half turn." },
          { t:"`(1/2, √3/2)`", why:"That flips only `x`: a reflection in the `y`-axis." },
          { t:"`(-√3/2, 1/2)`", why:"A half turn doesn’t swap the coordinates. It changes both of their signs." }] },
        b:{ prompt:"`P` is the point on the unit circle at `θ = π/6`. `Q` is the point at `θ = π/6 + π`. What are `Q`’s coordinates?", options:[
          { t:"`(-√3/2, -1/2)`", ok:true, why:"`P = (√3/2, 1/2)`. A half turn changes both signs." },
          { t:"`(√3/2, -1/2)`", why:"That flips only `y`." },
          { t:"`(-√3/2, 1/2)`", why:"That flips only `x`." },
          { t:"`(-1/2, -√3/2)`", why:"The coordinates don’t swap places." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which statement is written correctly?", options:[
          { t:"`csc(π/6) = 1/sin(π/6) = 2`", ok:true, why:"Correct reciprocal, correct notation, correct value." },
          { t:"`csc(π/6) = sin^{-1}(π/6) = 2`", why:"`sin^{-1}` means the inverse function, not the reciprocal." },
          { t:"`csc(π/6) = 1/sin = 2`", why:"‘sin’ needs its angle: `sin(π/6)`. On its own, ‘sin’ isn’t a number." },
          { t:"`csc(π/6) = 1/cos(π/6) = 2`", why:"csc pairs with sine. Also, `1/cos(π/6) = 2√3/3`, not 2." }] },
        b:{ prompt:"Which statement is written correctly?", options:[
          { t:"`cot(π/4) = 1/tan(π/4) = 1`", ok:true, why:"Correct reciprocal, correct notation, correct value." },
          { t:"`cot(π/4) = tan^{-1}(π/4) = 1`", why:"`tan^{-1}` is the inverse function, not the reciprocal." },
          { t:"`cot(π/4) = 1/tan = 1`", why:"‘tan’ needs its angle: `tan(π/4)`." },
          { t:"`cot(π/4) = 1/cos(π/4) = 1`", why:"1/cos is sec, and `1/cos(π/4) = √2`, not 1." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `sin(7π/6)` is negative?", options:[
          { t:"“`7π/6` is in quadrant 3, so its point on the unit circle is below the `x`-axis. The point’s `y`-coordinate, which is `sin(7π/6)`, is negative.”", ok:true, why:"This connects the quadrant, the point and the meaning of sine." },
          { t:"“Every trig ratio of an angle greater than `π` is negative.”", why:"Not true: `tan(7π/6)` is positive, and `cos(5π/3)` is positive." },
          { t:"“Because 7 is odd.”", why:"The numerator has nothing to do with it. `5π/6` also has an odd numerator, and its sine is positive." },
          { t:"“Because the reference angle `π/6` is negative.”", why:"Reference angles are always positive. The sign comes from the quadrant." }] },
        b:{ prompt:"Which is the best explanation of why `cos(5π/3)` is positive?", options:[
          { t:"“`5π/3` is in quadrant 4, so its point is to the right of the `y`-axis. The point’s `x`-coordinate, which is `cos(5π/3)`, is positive.”", ok:true, why:"This connects the quadrant, the point and the meaning of cosine." },
          { t:"“Every trig ratio of an angle between `3π/2` and `2π` is positive.”", why:"Not true: sine and tangent are negative in quadrant 4." },
          { t:"“Because 5 and 3 are both odd.”", why:"The digits don’t decide the sign. The quadrant does." },
          { t:"“Because cosine is never negative.”", why:"Cosine is negative in quadrants 2 and 3." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A robot arm 4 m long starts along the positive `x`-axis and rotates counterclockwise through `5π/6`. What are the coordinates of its tip, in metres?", options:[
          { t:"`(-2√3, 2)`", ok:true, why:"`(4 cos(5π/6), 4 sin(5π/6)) = (4 × (-√3/2), 4 × 1/2) = (-2√3, 2)`." },
          { t:"`(2√3, 2)`", why:"`5π/6` is in quadrant 2, so the `x`-coordinate is negative." },
          { t:"`(-2, 2√3)`", why:"The sizes are swapped. For reference angle `π/6`, cosine is the large value `√3/2`." },
          { t:"`(-√3/2, 1/2)`", why:"That’s the point on the <strong>unit</strong> circle. Multiply by the radius, 4." }] },
        b:{ prompt:"A sprinkler throws water 6 m. Its nozzle points at an angle of `4π/3` from the positive `x`-axis. Where does the water land, in metres?", options:[
          { t:"`(-3, -3√3)`", ok:true, why:"`(6 cos(4π/3), 6 sin(4π/3)) = (6 × (-1/2), 6 × (-√3/2)) = (-3, -3√3)`." },
          { t:"`(-3√3, -3)`", why:"The sizes are swapped. For reference angle `π/3`, cosine is `1/2`." },
          { t:"`(3, -3√3)`", why:"`4π/3` is in quadrant 3, where cosine is negative." },
          { t:"`(-1/2, -√3/2)`", why:"That’s the unit circle point. Multiply by 6." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A regular hexagon is drawn inside the unit circle with one vertex at (1, 0). What are the coordinates of the vertex at the top left?", options:[
          { t:"`(-1/2, √3/2)`", ok:true, why:"Six equal turns of `2π/6 = π/3` put the vertices at 0, `π/3`, `2π/3`, `π`, `4π/3` and `5π/3`. The top-left one is at `2π/3`." },
          { t:"`(-√3/2, 1/2)`", why:"That’s `5π/6`, which assumes vertices every `π/6` (12 of them). A hexagon has 6." },
          { t:"`(1/2, √3/2)`", why:"That’s the top-<strong>right</strong> vertex, at `π/3`." },
          { t:"`(-√2/2, √2/2)`", why:"That’s `3π/4`. Steps of `π/4` would make an octagon." }] },
        b:{ prompt:"A regular octagon is drawn inside the unit circle with one vertex at (1, 0). Going counterclockwise, what are the coordinates of the vertex just after (−1, 0)?", options:[
          { t:"`(-√2/2, -√2/2)`", ok:true, why:"The vertices are every `2π/8 = π/4`. After `π` comes `5π/4`." },
          { t:"`(-√3/2, -1/2)`", why:"That’s `7π/6`, which assumes steps of `π/6`." },
          { t:"`(-1/2, -√3/2)`", why:"That’s `4π/3`, which assumes steps of `π/3`." },
          { t:"`(√2/2, -√2/2)`", why:"That’s `7π/4`. Counterclockwise from `π`, the next vertex is in quadrant 3." }] } }
    ]
  },
  task:{
    title:"Make sine meet cosine", summary:"Make sine meet cosine",
    statement:"<p>Choose two special angles, `A` in quadrant 2 and `B` in quadrant 4, so that <strong>`sin A = cos B`</strong>. There’s more than one pair. Can you find them all?</p><p class=\"tiny muted\">Enter each angle as a multiple of `π`: a whole number from 0 to 24 on top, and the denominator from the menu.</p>",
    checks:["Both are special angles from 0 to `2π`", "`A` is in quadrant 2", "`B` is in quadrant 4", "`sin A = cos B`"],
    tips:["Enter each angle as a multiple of `π`, like 3/4 for `3π/4`, with denominator 1, 2, 3, 4 or 6.",
      "`A` must be between `π/2` and `π`. In sixths that’s `4π/6` or `5π/6`; in quarters it’s `3π/4`.",
      "`B` must be between `3π/2` and `2π`. In sixths that’s `10π/6` or `11π/6`; in quarters it’s `7π/4`.",
      "Right now `sin A` = {sa} and `cos B` = {cb}. Try matching the <strong>sizes</strong>: which quadrant 4 angle has a cosine as big as `sin A`?"],
    explainPrompt:"Explain how you know `sin A = cos B` for your pair.",
    vocab:"Use the words reference angle, quadrant and CAST.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found all three. Notice that the reference angles of `A` and `B` always add to `π/2`. That’s a preview of the cofunction identities in module 27."
  },
  cards:[
    ["The point on the unit circle at angle `θ`", "`(cos θ, sin θ)`. The circle has radius 1 and its centre at the origin."],
    ["The 45°–45°–90° triangle (`π/4`)", "Sides 1, 1, `√2`. Scaled to hypotenuse 1, its legs are `√2/2`."],
    ["The 30°–60°–90° triangle (`π/6` and `π/3`)", "Sides 1, `√3`, 2. Scaled to hypotenuse 1, its legs are `1/2` and `√3/2`."],
    ["sin, cos, tan of `π/6`", "`1/2`, `√3/2`, `√3/3` (= `1/√3`)"],
    ["sin, cos, tan of `π/4`", "`√2/2`, `√2/2`, 1"],
    ["sin, cos, tan of `π/3`", "`√3/2`, `1/2`, `√3`"],
    ["Reference angle", "The acute angle between the terminal arm and the `x`-axis. Quadrant 2: `π - θ`. Quadrant 3: `θ - π`. Quadrant 4: `2π - θ`."],
    ["The CAST rule", "Which ratios are positive. Quadrant 1: <strong>A</strong>ll. Quadrant 2: <strong>S</strong>ine. Quadrant 3: <strong>T</strong>angent. Quadrant 4: <strong>C</strong>osine."],
    ["The reciprocal ratios", "`csc θ = 1/sin θ`, `sec θ = 1/cos θ`, `cot θ = 1/tan θ = cos θ/sin θ`"],
    ["0, `π/2`, `π`, `3π/2` on the unit circle", "(1, 0), (0, 1), (−1, 0), (0, −1). Read cos and sin straight from the point."],
    ["When are tan and sec undefined? When are cot and csc undefined?", "tan and sec: when `cos θ = 0` (`π/2`, `3π/2`). cot and csc: when `sin θ = 0` (0, `π`, `2π`)."],
    ["`csc θ` vs `sin^{-1}`", "`csc θ = 1/sin θ`, the reciprocal. `sin^{-1}` means the inverse function: the angle with a given sine. They’re different things."]
  ]
};

// Inside `math`: stack value fractions (1/2, √3/2, 2/√2, 2√3/3; π-multiples like 5π/6 stay inline) and colour θ cerulean.
function fx(s){
  return s.replace(/`([^`]+)`/g, (m, x) => "`" + x.replace(/(\d*√\d+|\d+)\/(\d*√\d+|\d+)/g, "{$1}/{$2}").replace(/θ/g, "@t{θ}") + "`");
}
function walk(o){
  if (typeof o === "string") return fx(o);
  if (Array.isArray(o)) return o.map(walk);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = walk(o[k]); return r; }
  return o;
}
export default walk(content);
