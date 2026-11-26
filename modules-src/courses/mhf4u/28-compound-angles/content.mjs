// MHF4U 28 Compound Angles. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/28-compound-angles.md
// Inside `math`, fx() at the bottom stacks value fractions (1/2, √3/2, (√6 − √2)/4, (a)/(b)); π-multiples such as 5π/12
// stay inline. ² and ³ become real superscripts. Placeholders such as {v} sit outside `math`; app.js fills them.

// ---------- Practice 1: sorter items, mistake feedback and hints built from the item (plan: "built from the item") ----------
const BOX = { b1:["sin", "+"], b2:["sin", "−"], b3:["cos", "+"], b4:["cos", "−"] };
const BOXM = { b1:"`sin(a + b)`", b2:"`sin(a - b)`", b3:"`cos(a + b)`", b4:"`cos(a - b)`" };
const PAIRS = "Look at the pairs. Mixed pairs (sin·cos and cos·sin) make a sine. Matched pairs (cos·cos and sin·sin) make a cosine.";
const SINSIGN = "The sine formula keeps the sign: + between the pieces means `sin(a + b)`, − means `sin(a - b)`.";
const COSSIGN = "The cosine formula switches the sign: − between the pieces means `cos(a + b)`, + means `cos(a - b)`.";
const NEG = "First rewrite the negatives: `cos(-x) = cos x` and `sin(-x) = -sin x`.";
const COF = "First rewrite with the cofunction identities: `sin(π/2 - a) = cos a` and `cos(π/2 - a) = sin a`.";
function sortItem(id, t, box, why, rewritten, extra, hints){
  const [fn] = BOX[box], wrong = {};
  for (const b of Object.keys(BOX)) {
    if (b === box) continue;
    let w = BOX[b][0] !== fn ? PAIRS : fn === "sin" ? SINSIGN : COSSIGN;
    if (extra) w += " " + extra;
    wrong[b] = w;
  }
  return { id, t, answer:box, why, wrong, hints:hints || [
    "Rewrite it as a standard expansion first, if it isn’t one. Then look at the pairs.",
    (fn === "sin" ? "Mixed pairs, so it’s a sine." : "Matched pairs, so it’s a cosine.") + " Now look at the sign between the pieces.",
    rewritten + ", so it equals " + BOXM[box] + "."] };
}

const content = {
  id:"28-compound-angles",
  kind:"topic",
  title:"Compound angles",
  topic:"Compound Angles",
  readyTopic:"compound angles",
  hero:{
    eq:"`sin(a + b) ≠` `sin a + sin b`", eqLabel:"sine of a plus b is not equal to sine a plus sine b", eqSize:"md",
    headline:"Angles add. Their sines don’t.",
    text:"When two angles combine into a <strong>compound angle</strong> `a + b`, its sine isn’t the sum of the two sines. The unit circle shows what it really is: the height of the new point splits into two pieces, `sin a cos b` and `cos a sin b`. These <strong>compound angle formulas</strong> give exact values for new angles like `π/12` and `7π/12`, and setting `b = a` gives the <strong>double-angle formulas</strong>.",
    fig:{ aria:"Unit circle with a = π/3 and b = π/6. Stacking sin a and sin b reaches about 1.37, above the top of the circle. Turning on from a by b reaches the top of the circle, height 1, which splits into 3/4 and 1/4.", shape:"square" },
    caps:["`sin a + sin b ≈ 1.37`, but no point on the unit circle is higher than 1.", "`sin(a + b) = sin a cos b + cos a sin b = 3/4 + 1/4 = 1`"],
    labels:{ top:"top of the circle", p1:"`sin a cos b`", p2:"`cos a sin b`" }
  },
  goals:[
    "I can use a counterexample or the unit circle to show that `sin(a + b) ≠ sin a + sin b`, and explain where each piece of the correct formula comes from in the picture.",
    "I can expand `sin(a ± b)` and `cos(a ± b)` with the right pairs and signs, and recognize an expansion such as `sin x cos y - cos x sin y` as a single compound angle.",
    "I can find exact values for angles such as `π/12`, `5π/12`, `7π/12` and `11π/12` by writing them as a sum or difference of special angles.",
    "I can use the formula for `tan(a ± b)` and explain when `tan(a + b)` is undefined.",
    "I can get the double-angle formulas from the compound angle formulas, choose the most useful form of `cos 2θ`, and use them to find exact values.",
    "I can find a ratio of `a + b`, `a - b` or `2θ` when I’m given one ratio of each angle and its quadrant."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Special angles", goal:3, fixedOrder:true,
          prompt:"What is the exact value of `cos(3π/4)`?",
          options:[
            { t:"`-1`", why:"−1 is `tan(3π/4)`: sine and cosine have the same size there, with opposite signs. Cosine alone is `-√2/2`." },
            { t:"`-√2/2`", ok:true, why:"`3π/4` is in quadrant 2 with reference angle `π/4`. `cos(π/4) = √2/2`, and cosine is negative in quadrant 2." },
            { t:"`-1/2`", why:"`-1/2` is `cos(2π/3)`, from the `π/3` family. `3π/4` has reference angle `π/4`, whose cosine is `√2/2`." },
            { t:"`√2/2`", why:"Right size, wrong sign. `3π/4` is left of the `y`-axis, so its `x`-coordinate (cosine) is negative." }],
          hints:["Find the quadrant and the reference angle of `3π/4`.", "`3π/4` is in quadrant 2, with reference angle `π - 3π/4 = π/4`. Cosine is negative in quadrant 2.", "`cos(π/4) = √2/2`, so `cos(3π/4) = -√2/2`."] },
        { id:"w2", skill:"Special angles", goal:4, fixedOrder:true,
          prompt:"What is the exact value of `tan(π/6)`?",
          options:[
            { t:"`1/2`", why:"`1/2` is `sin(π/6)`. Tangent is sine divided by cosine." },
            { t:"`√3/3`", ok:true, why:"`tan(π/6) = sin(π/6)/cos(π/6) = (1/2)/(√3/2) = 1/√3 = √3/3`." },
            { t:"`√3/2`", why:"`√3/2` is `cos(π/6)`. Divide the sine by it: `1/2 ÷ √3/2`." },
            { t:"`√3`", why:"`√3` is `tan(π/3)`. The smaller angle `π/6` has the smaller tangent, `√3/3`." }],
          hints:["`tan θ = sin θ / cos θ`.", "`sin(π/6) = 1/2` and `cos(π/6) = √3/2`.", "`1/2 ÷ √3/2 = 1/√3`. Multiply the top and bottom by `√3`: `√3/3`."] },
        { id:"w3", skill:"Fractions and radicals", goal:3, fixedOrder:true,
          prompt:"Multiply: `(√2/2) × (√3/2)`.",
          options:[
            { t:"`√5/4`", why:"`√2 × √3` multiplies under the root: `√6`, not `√5`. Check: 1.414 × 1.732 ≈ 2.449, and `√6` ≈ 2.449." },
            { t:"`√6/4`", ok:true, why:"Multiply the tops and the bottoms: `(√2 × √3)/(2 × 2) = √6/4`." },
            { t:"`√6/2`", why:"The bottoms multiply too: 2 × 2 = 4." },
            { t:"`3/2`", why:"`√2 × √3` is `√6`, not 6. `6/4` would be `3/2`, but the root stays." }],
          hints:["Multiply the numerators together and the denominators together.", "`√2 × √3 = √{2 × 3}`, and 2 × 2 = 4.", "`(√2/2)(√3/2) = √6/4`."] },
        { id:"w4", skill:"Fractions and radicals", goal:3, fixedOrder:true,
          prompt:"Which is equal to `π/4 + π/6`?",
          options:[
            { t:"`π/12`", why:"`π/12` is `π/4 - π/6`. The sum is bigger than either angle." },
            { t:"`π/10`", why:"Adding the bottoms (4 + 6) makes the answer <em>smaller</em> than `π/6`. Fractions need a common denominator." },
            { t:"`π/5`", why:"`(π + π)/(4 + 6) = 2π/10 = π/5`, which is less than `π/4`. Use a common denominator: 12." },
            { t:"`5π/12`", ok:true, why:"With denominator 12: `π/4 = 3π/12` and `π/6 = 2π/12`, so the sum is `5π/12`." }],
          hints:["Write both fractions with a common denominator.", "12 works: `π/4 = 3π/12` and `π/6 = 2π/12`.", "`3π/12 + 2π/12 = 5π/12`."] },
        { id:"w5", skill:"One ratio from another", goal:6, fixedOrder:true,
          prompt:"Angle `x` is in quadrant 2 and `sin x = 3/5`. What is `cos x`?",
          options:[
            { t:"`-4/5`", ok:true, why:"`cos²x = 1 - (3/5)² = 16/25`, so `cos x = ±4/5`. Cosine is negative in quadrant 2: `-4/5`." },
            { t:"`-3/4`", why:"`-3/4` is `y/x = tan x`. Cosine is `x/r = -4/5`." },
            { t:"`2/5`", why:"`1 - 3/5 = 2/5` treats the identity as `sin x + cos x = 1`. It’s the <strong>squares</strong> that add to 1: `cos²x = 1 - 9/25 = 16/25`." },
            { t:"`4/5`", why:"The size is right, but in quadrant 2 the point is left of the `y`-axis, so cosine is negative." }],
          hints:["Use `sin²x + cos²x = 1` for the size, and the quadrant for the sign.", "`cos²x = 1 - 9/25 = 16/25`, so the size is `4/5`. Is cosine positive or negative in quadrant 2?", "Negative, so `cos x = -4/5`. (A 3–4–5 triangle with the point at (−4, 3).)"] },
        { id:"w6", skill:"Equivalent expressions", goal:2,
          prompt:"Which expression is equal to `cos(π/2 - x)` for every `x`?",
          options:[
            { t:"`-cos x`", why:"That’s `cos(π/2) - cos x = 0 - cos x`. Cosine doesn’t split over a subtraction. This idea is the heart of this module." },
            { t:"`-sin x`", why:"For a small positive `x`, `π/2 - x` is in quadrant 1, where cosine is positive. So the answer is `+sin x`." },
            { t:"`cos x`", why:"Subtracting from `π/2` switches cosine to sine (module 27). Check `x = π/2`: `cos 0 = 1`, but `cos(π/2) = 0`." },
            { t:"`sin x`", ok:true, why:"This is a cofunction identity: in a right triangle, the side adjacent to the angle `π/2 - x` is opposite `x`." }],
          hints:["This is one of the cofunction identities from module 27.", "In a right triangle with acute angle `x`, the other acute angle is `π/2 - x`. The side next to one is opposite the other.", "So `cos(π/2 - x) = sin x`. Check with `x = π/6`: `cos(π/3) = 1/2 = sin(π/6)`."] }
      ],
      refreshers:{
        "Special angles":"For any special angle, the reference angle gives the size and CAST gives the sign. `cos(3π/4)`: reference angle `π/4`, quadrant 2, so `-√2/2`. Tangent is sine over cosine: `tan(π/6) = (1/2)/(√3/2) = √3/3`. You’ll need all three ratios of `π/6`, `π/4` and `π/3` in this module.",
        "Fractions and radicals":"To multiply radical fractions, multiply under the roots and multiply the denominators: `(√2/2)(√3/2) = √6/4`. You can’t add or subtract under a root: `√6 - √2` stays as it is. To add fractions of π, use a common denominator: `π/4 + π/6 = 3π/12 + 2π/12 = 5π/12`. Never add the denominators. One more tool you’ll need for tangents: to clear a root from a denominator like `3 - √3`, multiply the top and bottom by `3 + √3`, because `(3 - √3)(3 + √3) = 9 - 3 = 6`.",
        "One ratio from another":"`sin²x + cos²x = 1` gives the size of the missing ratio, and the quadrant gives its sign. If `sin x = 3/5` in quadrant 2: `cos²x = 1 - 9/25 = 16/25`, so `cos x = -4/5` (cosine is negative in quadrant 2), and `tan x = (3/5)/(-4/5) = -3/4`.",
        "Equivalent expressions":"A trig function never splits over + or −: `cos(π/2 - x)` is not `cos(π/2) - cos x`. Instead, `cos(π/2 - x) = sin x` and `sin(π/2 - x) = cos x` (the cofunction identities from module 27). Also, `cos(-x) = cos x` and `sin(-x) = -sin x`."
      }
    }
  },
  explore:{
    heading:"Compound angle visualiser",
    intro:"Put two angles on the unit circle and watch the height of the point. First test whether sines add. Then build the real formula, one triangle at a time.",
    ui:{
      modes:["Does it add?", "Build `a + b`", "Build `a - b`"], modeLabel:"Mode",
      sa:"Angle `a`", sb:"Angle `b`",
      stages:["Start with `a`", "Turn on by `b`", "Drop a perpendicular", "The lower triangle", "The upper triangle", "Add it up"],
      cap3:"In right triangle `OQP` the hypotenuse is 1, so its legs are `cos b` and `sin b`.",
      cap5:"`QP` is perpendicular to the `a` arm and `TP` is perpendicular to the `x`-axis, so the angle at `P` equals `a`.",
      signed:"(signed lengths: left and down count as negative)",
      showAll:"Show every step", nums:"Numbers on the picture", tan:"Tangent rows", pin:"Pin", unpin:"Clear pin",
      pinned:"Pinned:", clamp:"{v} set to {val}: Build modes use {range}", onAxis:"`a + b = π/2`: `P` is on the `y`-axis",
      top:"top of the circle", bottom:"bottom of the circle", over:"higher than any point on the circle", under:"lower than any point on the circle",
      col1:"`sin a + sin b`", col2:"`sin(a + b)`", measured:"measured height of `P`",
      rows:{ angles:"Angles", point:"Point `P`", height:"Height: `sin(a ± b)`", hp:"Pieces of the height", run:"Run: `cos(a ± b)`", rp:"Pieces of the run",
        tan:"`tan(a ± b)`", den:"Denominator", check:"Check", sum:"`sin a + sin b`", sinab:"`sin(a + b)`", verdict:"Verdict", cosrow:"`cos a + cos b` vs `cos(a + b)`", tally:"Tally" },
      samePoint:"the same point as {v}",
      checkRow:"From the picture, `P`’s height is {v}. The formula agrees.",
      notSpecial:"{v} isn’t a special angle yet. You’ll find its exact values in Part 3.",
      notSpecial2:"{v} aren’t special angles yet. You’ll find their exact values in Part 3.",
      subAdds:"(`cos a` is negative, so subtracting it adds)",
      tanUndef:"undefined: {den} = 0",
      tanNo:"The tan formula can’t be used here ({which} is undefined). From the point: `sin(a ± b)/cos(a ± b)` {v}",
      undef:"undefined",
      notEqual:"Not equal: `sin a + sin b` is {gap} too {dir}.", big:"big", small:"small",
      equal:"Equal for this pair. One pair isn’t enough to trust a formula: try another.",
      tally:"Pairs tried: {n} · Pairs where the sines add: {m}"
    },
    predictions:[
      { id:"p1", fixedOrder:true, start:{ mode:"add", a:4, b:2, hide:true },
        prompt:"`sin(π/3) + sin(π/6) ≈ 1.37`. The `b` arm will now swing round to start from the `a` arm, so the new point is at `a + b`. What will `sin(a + b)` be?",
        options:[{ t:"about 0.37 (the difference of the heights)" }, { t:"about 0.43 (the product of the heights)" }, { t:"1", ok:true }, { t:"about 1.37 (the sum of the heights)" }],
        explain:"`π/3 + π/6 = π/2`, so `P` is at the top of the circle and `sin(a + b) = 1`. Adding the heights gives about 1.37, higher than any point on the unit circle can be, so sines don’t add: `sin(a + b) ≠ sin a + sin b`. (0.37 is `sin a - sin b` and 0.43 is `sin a × sin b`; neither is the height of the new point either.)" },
      { id:"p2", start:{ mode:"plus", a:4, b:0, all:true },
        prompt:"The run of `P` is `cos a cos b - sin a sin b`. Keep `a = π/3` and turn `b` up to `π/3`. Where will `P` end up?",
        options:[{ t:"Right of the `y`-axis: the run stays positive" }, { t:"On the `y`-axis" }, { t:"Left of the `y`-axis: the backward piece wins", ok:true }, { t:"Below the `x`-axis" }],
        explain:"At `a = b = π/3`, `cos a cos b = 1/4` and `sin a sin b = 3/4`, so `cos(2π/3) = 1/4 - 3/4 = -1/2`. The minus sign in the cosine formula is the upper triangle stepping back to the left. Once that step is longer than the forward run, `P` crosses into quadrant 2." },
      { id:"p3", start:{ mode:"plus", a:4, b:2, all:true },
        prompt:"Now switch from `a + b` to `a - b`. The upper triangle will flip to the other side of the `a` arm. What happens to the two formulas?",
        options:[{ t:"Nothing: the formulas are the same for `a - b`" }, { t:"In both formulas, only the second piece changes sign", ok:true }, { t:"In both formulas, both pieces change sign" }, { t:"Only the sine formula changes" }],
        explain:"The lower triangle doesn’t move: it still has hypotenuse `cos b` and angle `a`, so piece ① is the same. Only the upper triangle flips, so only its piece changes sign: `sin(a - b) = sin a cos b - cos a sin b` and `cos(a - b) = cos a cos b + sin a sin b`. Check with these angles: `sin(π/6) = 3/4 - 1/4 = 1/2` ✓ and `cos(π/6) = √3/4 + √3/4 = √3/2` ✓." },
      { id:"p4", start:{ mode:"plus", a:3, b:0, tan:true },
        prompt:"`tan(a + b) = (tan a + tan b)/(1 - tan a tan b)`. Keep `a = π/4` and turn `b` from 0 up to `π/4`. What happens to `tan(a + b)`?",
        options:[{ t:"It drops to 0" }, { t:"It stays at 1" }, { t:"It grows to 2, because `tan a + tan b = 1 + 1`" }, { t:"It grows without limit, and at `b = π/4` it is undefined", ok:true }],
        explain:"At `b = π/4`, `tan a tan b = 1 × 1 = 1`, so the denominator is 0 and `tan(a + b)` is undefined. The picture agrees: `a + b = π/2`, where the arm is vertical and tangent is undefined (module 26). Adding the tangents would give 2, but the true value isn’t even defined." }
    ],
    found:{ title:"What you found", score:"Your predictions: {n} of 4 matched",
      html:"<ul><li>`sin(a + b) ≠ sin a + sin b`. One counterexample (`a = π/3`, `b = π/6`) shows it.</li>" +
        "<li><strong>Sine mixes and keeps the sign:</strong> `sin(a ± b) = sin a cos b ± cos a sin b`.</li>" +
        "<li><strong>Cosine matches and switches the sign:</strong> `cos(a ± b) = cos a cos b ∓ sin a sin b`.</li>" +
        "<li><strong>Tangent:</strong> `tan(a ± b) = (tan a ± tan b)/(1 ∓ tan a tan b)`, when `tan a` and `tan b` exist and the denominator isn’t 0.</li>" +
        "<li>The lower triangle gives the first piece of each formula; the upper triangle gives the second.</li></ul>" },
    derive:{ title:"Where the formulas come from",
      html:"<p><strong>From the picture:</strong> stages 1–6 give `sin(a + b)` and `cos(a + b)`.</p>" +
        "<p><strong>From `a + b` to `a - b`:</strong> replace `b` with `-b`. Since `cos(-b) = cos b` and `sin(-b) = -sin b` (module 27), `cos(a - b) = cos a cos b + sin a sin b` and `sin(a - b) = sin a cos b - cos a sin b`.</p>" +
        "<p><strong>Tangent:</strong> `tan(a + b) = (sin a cos b + cos a sin b)/(cos a cos b - sin a sin b)`. Divide every term by `cos a cos b`: `(tan a + tan b)/(1 - tan a tan b)`.</p>" +
        "<p><strong>One formula gives all the others:</strong> start from `cos(a - b)`. Then `sin(a + b) = cos(π/2 - (a + b)) = cos((π/2 - a) - b) = cos(π/2 - a) cos b + sin(π/2 - a) sin b = sin a cos b + cos a sin b`, using the cofunction identities from module 27.</p>" +
        "<p><strong>Check with numbers:</strong> `a = π/3`, `b = π/6` gives `sin(π/2) = (√3/2)(√3/2) + (1/2)(1/2) = 3/4 + 1/4 = 1` ✓.</p>" },
    challenges:[
      { id:"tc1", goal:[2, 3],
        prompt:"Land `P` on `7π/12` <strong>twice</strong>: once in Build `a + b` mode and once in Build `a - b` mode, using only special angles (multiples of `π/6` or `π/4`) for `a` and `b`, with neither of them 0. Set the first build and press <strong>Pin</strong> (the pinned build stays drawn faintly), switch modes, set the second build, then press <strong>Check challenge</strong>.",
        why:"`sin(7π/12) = (√6 + √2)/4` and `cos(7π/12) = (√2 - √6)/4`, both ways. ✓ Two different splits land on the same point, so the formulas must give the same exact values.",
        msgs:{ nonSpecial:"`π/12` and `5π/12` aren’t special angles, so their exact values aren’t known yet. Use multiples of `π/6` or `π/4`.",
          same:"Both your builds use {op}. Make the second one in the other Build mode.",
          sumAngles:"In `a - b` mode you get {calc}. Here `a` has to be bigger than `7π/12`.",
          five:"{calc}. You need `7π/12`.",
          other:"Your build lands on {v}. Write `7π/12` and the special angles with denominator 12, then look for two that make 7.",
          pin:"Press <strong>Pin</strong> to keep this build, then make the second one in the other Build mode.",
          mode:"Switch to a Build mode: this challenge uses Build `a + b` and Build `a - b`." },
        hints:["Write the special angles with denominator 12: `π/6 = 2π/12`, `π/4 = 3π/12`, `π/3 = 4π/12`, `π/2 = 6π/12`, `2π/3 = 8π/12`, `3π/4 = 9π/12`, `5π/6 = 10π/12`, `π = 12π/12`.",
          "For `a + b`, find two that add to 7: 4 + 3. For `a - b`, find two that differ by 7, with `b` no bigger than 6: 9 − 2 or 10 − 3.",
          "Pin `a = π/3`, `b = π/4` in `a + b` mode. Then set `a = 3π/4`, `b = π/6` in `a - b` mode."] },
      { id:"tc2", goal:[1, 5],
        prompt:"In Build `a + b` mode, make the two pieces of the height exactly <strong>equal</strong> (bars ① and ② the same length) <strong>and</strong> put `P` at height exactly `√3/2`. Two conditions at once: reason about each one before you move the sliders.",
        why:"When `a = b`, both pieces are `sin a cos a`, so `sin(a + a) = 2 sin a cos a`. That’s the <strong>double-angle formula</strong> for sine. Here `2a` is `π/3` or `2π/3`, the two angles from 0 to π whose sine is `√3/2`, so both builds work. Part 3 shows the double angle from another angle.",
        msgs:{ eqWrong:"Your pieces are equal, so the height is `sin a cos a + cos a sin a = 2 sin a cos a = sin 2a` = {v}. You need `√3/2`. Which angles `2a` have sine `√3/2`?",
          heightOnly:"`P` is at height `√3/2`, but the pieces are ① {p1} and ② {p2}. Equal pieces need `sin a cos b = cos a sin b`.",
          close:"Close: ① {p1} and ② {p2}. Look at the two angles you’ve chosen.",
          other:"① = `sin a cos b` {p1} and ② = `cos a sin b` {p2}, and `P`’s height is {h}. Start with the pieces: divide both by `cos a cos b`. What has to be true about `tan a` and `tan b`?",
          mode:"Switch to Build `a + b` mode: this challenge uses its two pieces." },
        hints:["Piece ① is `sin a cos b` and piece ② is `cos a sin b`. When are they equal? Then what does the height become?",
          "If `cos a` and `cos b` aren’t 0, divide both pieces by `cos a cos b`: you need `tan a = tan b`, so `a = b`. Then the height is `sin a cos a + cos a sin a = 2 sin a cos a`.",
          "The height is `sin(a + a) = sin 2a`. You need `sin 2a = √3/2`, so `2a = π/3` or `2π/3`. Set `a = b = π/6`: both pieces are `(1/2)(√3/2) = √3/4`, and `√3/4 + √3/4 = √3/2`. (`a = b = π/3` works too.)"] },
      { id:"tc3", goal:1, stretch:true,
        prompt:"In Does it add? mode, find `a` and `b`, neither of them 0 or `2π`, that make `sin(a + b) = sin a + sin b` <strong>exactly</strong>. The tally keeps counting the pairs you try; with 23 × 23 non-zero pairs, a random search is slow, so reason first.",
        why:"Both sides are 0. `sin(2π) = 0`, and `sin b = sin(2π - a) = -sin a`, so the two heights cancel. The equation holds for these pairs and fails for almost every other pair, so it isn’t an identity: one counterexample, such as `a = π/3` and `b = π/6`, is enough to show that.",
        msgs:{ half:"`sin(a + b)` = {s} = 0 now, but `sin a + sin b = 2 sin a`, which isn’t 0. Can you make the two heights cancel instead?",
          cancel:"The heights cancel, so `sin a + sin b = 0`. But `a + b` = {v}, and {sv}, not 0. You need the compound angle to land where sine is 0 too.",
          other:"Here {l} and {r}. Instead of trying pairs at random, look for a way to make both sides 0.",
          zero:"Those sides match, but the challenge rules out 0 and `2π`: with an angle of 0 the equation only says `sin b = sin b`. Choose two angles that aren’t 0 or `2π`.",
          mode:"Switch to Does it add? mode: this challenge compares `sin(a + b)` with `sin a + sin b`." },
        hints:["Two different numbers rarely match by luck. Try to make both sides equal 0.",
          "`sin a + sin b = 0` when the two heights cancel: `b = 2π - a` (a mirror image in the `x`-axis), or `b = a ± π` (half a turn apart). Which of those also makes `sin(a + b) = 0`?",
          "With `b = 2π - a`, `a + b = 2π` and `sin(2π) = 0`. For example, `a = π/3` and `b = 5π/3`: both sides are 0."] }
    ]
  },
  part3:{
    slug:"exact", name:"Exact values",
    heading:"Exact values: split an angle, double an angle",
    intro:"The special angles give 16 exact points on the unit circle. Split each new angle into two special angles to find 8 more. Then see what happens when an angle is doubled.",
    views:["The `π/12` clock", "Double-angle lab"], viewLabel:"View",
    clock:{
      start:"Tap the next “?” dot to start round {n}: find {f}.", order:"Rounds go in order: tap the {v} dot first.",
      roundHead:"Round {n} of 4: find {f}", labels:"Show all labels",
      steps:["Split it", "Choose the formula", "Fill in the values", "Multiply and combine"],
      tilesA:"Tiles for `a`", op:"Operation", tilesB:"Tiles for `b`", turn:"Turn",
      hit:"{calc}.", miss:"{calc}. You need {t}{tip}", trySub:": try subtracting.", tryAdd:": try adding.",
      special:"{calc}. That’s a special angle you already know; you need {t}.",
      fSin:{ ok:"Sine mixes the pairs and keeps the sign of {op}.", sign:"That’s {other}. The sine formula keeps the operation’s sign.", cross:"That’s {other}. You’re finding a sine, so the pairs are mixed: sin·cos and cos·sin.", split:"Sine doesn’t split over a {word}. {expr} ≈ {v}, but the point’s height is about {h}." },
      fCos:{ ok:"Cosine matches the pairs and switches the sign of {op}.", sign:"That keeps the operation’s sign; cosine switches it.", cross:"You’re finding a cosine: the pairs match, cos·cos and sin·sin.", split:"Cosine doesn’t split over a {word}. {expr} ≈ {v}, but the point’s `x`-coordinate is about {h}." },
      sum:"sum", diff:"difference",
      slotHow:"Tap a slot, then tap a value from the exact-value palette.", palette:"Exact-value palette",
      slotSign:"{f} has the right size, but {ang} is in quadrant {q}, where {r} is {pn}.",
      slotSwap:"That’s {f}. For `π/6`, sine is the short side `1/2` and cosine is `√3/2`; for `π/3` it’s the other way round.",
      slotFam:"That value belongs to the {fam} family. {ang} has reference angle {ref}.",
      fam:{ h:"`π/6` and `π/3`", r2:"`π/4`", ax:"axis angles (0, `π/2`, `π`)" },
      positive:"positive", negative:"negative",
      slotsDone:"✓ All four values are right.",
      other:"and {expr} = {v}, worked out for you",
      rounds:[
        { k:1, r:"sin",
          combine:[
            { t:"`(√6 - √2)/4`", ok:true, why:"`(√2/2)(√3/2) = √6/4` and `(√2/2)(1/2) = √2/4`, so the difference is `(√6 - √2)/4 ≈ 0.259`." },
            { t:"`√4/4 = 1/2`", why:"You can’t subtract under the root: `√6 - √2 ≈ 1.035`, not `√4 = 2`. And `sin(π/12)` can’t be `1/2`, which is `sin(π/6)`." },
            { t:"`(√5 - √2)/4`", why:"`√2 × √3` multiplies under the root: `√6`, not `√5`." },
            { t:"`(√6 - √2)/2`", why:"Both denominators are 2, so each product has denominator 4." }],
          hints:["Write `π/12` with denominator 12 and look for two special angles whose numerators differ by 1.",
            "`π/4 = 3π/12` and `π/6 = 2π/12`, so `π/12 = π/4 - π/6`. You need `sin(a - b) = sin a cos b - cos a sin b`.",
            "`sin(π/4)cos(π/6) - cos(π/4)sin(π/6) = (√2/2)(√3/2) - (√2/2)(1/2) = √6/4 - √2/4 = (√6 - √2)/4`."] },
        { k:5, r:"cos",
          combine:[
            { t:"`(√6 - √2)/4`", ok:true, why:"The two products are `√6/4` and `√2/4`, and the `√2/4` piece counts as negative (the formula subtracts it, or one of its factors is negative), so the result is `(√6 - √2)/4 ≈ 0.259`. It’s small and positive, as it should be just below `π/2`." },
            { t:"`(√6 + √2)/4`", why:"That’s `cos(π/12)`, which equals `sin(5π/12)`. The `√2/4` piece counts as negative: check its sign on screen before you combine." },
            { t:"`1/2`", why:"You can’t subtract under the root: `√6 - √2` isn’t `√4`. And `cos(5π/12)` can’t be `1/2`, which is `cos(π/3)`." },
            { t:"`(√6 - √2)/2`", why:"Each product has denominator 2 × 2 = 4, not 2." }],
          hints:["Write `5π/12` with denominator 12. Which special numerators add to 5?",
            "`π/6 + π/4 = 2π/12 + 3π/12`. You need `cos(a + b) = cos a cos b - sin a sin b`.",
            "`cos(π/6)cos(π/4) - sin(π/6)sin(π/4) = (√3/2)(√2/2) - (1/2)(√2/2) = √6/4 - √2/4 = (√6 - √2)/4`. It’s small and positive, as it should be just below `π/2`."] },
        { k:7, r:"cos",
          combine:[
            { t:"`(√2 - √6)/4`", ok:true, why:"The products are `√2/4` and `√6/4`, and the `√6/4` piece counts as negative, so the result is `(√2 - √6)/4 ≈ -0.259`. It’s negative, as a cosine past `π/2` must be." },
            { t:"`(√6 - √2)/4`", why:"That’s the right size but positive, and `7π/12` is past `π/2`, so its cosine must be negative. The `√6/4` piece is the one that counts as negative." },
            { t:"`-1/2`", why:"You can’t combine `√2 - √6` under one root: it isn’t `-√4`. The exact value stays as `(√2 - √6)/4`." },
            { t:"`(√2 + √6)/4`", why:"That adds both products, but the `√6/4` piece counts as negative (check its sign on screen). A cosine past `π/2` can’t be positive." }],
          hints:["Write `7π/12` with denominator 12. Which special numerators add to 7?",
            "`π/3 + π/4 = 4π/12 + 3π/12`. You need `cos(a + b) = cos a cos b - sin a sin b`.",
            "`cos(π/3)cos(π/4) - sin(π/3)sin(π/4) = (1/2)(√2/2) - (√3/2)(√2/2) = √2/4 - √6/4 = (√2 - √6)/4`. It’s negative, as it should be past `π/2`."] },
        { k:11, r:"sin",
          combine:[
            { t:"`(√6 - √2)/4`", ok:true, why:"The products are `√6/4` and `-√2/4`, so the result is `(√6 - √2)/4 ≈ 0.259`: positive, as a sine in quadrant 2 must be." },
            { t:"`(√6 + √2)/4`", why:"`cos(2π/3)` and `cos(3π/4)` are negative, so the second product is negative. Check its sign before you combine." },
            { t:"`-(√6 - √2)/4`", why:"`11π/12` is in quadrant 2, where sine is positive." },
            { t:"`1/2`", why:"You can’t subtract under the root: `√6 - √2` isn’t `√4`. And `sin(11π/12)` can’t be `1/2`, which is `sin(5π/6)`." }],
          hints:["Write `11π/12` with denominator 12. Which special numerators add to 11?",
            "`2π/3 + π/4 = 8π/12 + 3π/12`. You need `sin(a + b) = sin a cos b + cos a sin b`.",
            "`sin(2π/3)cos(π/4) + cos(2π/3)sin(π/4) = (√3/2)(√2/2) + (-1/2)(√2/2) = √6/4 - √2/4 = (√6 - √2)/4`. It’s positive, as a sine in quadrant 2 must be."] }
      ],
      reflect:{ title:"Reflect to finish", intro:"The lower four dots fill by symmetry instead of new splits. Choose each angle’s reference angle and the signs of its sine and cosine, then press Check.",
        cols:["Angle", "reference angle", "sign of sin", "sign of cos"], check:"Check",
        rows:[
          { k:13, ref:1, s:"−", c:"−", fb:"`13π/12` is `π + π/12`: a half turn, so both coordinates change sign." },
          { k:17, ref:5, s:"−", c:"−", fb:"`17π/12` is `π + 5π/12`: a half turn, so both coordinates change sign." },
          { k:19, ref:5, s:"−", c:"+", fb:"`19π/12` is `2π - 5π/12`: a reflection in the `x`-axis, so sine changes sign and cosine keeps it." },
          { k:23, ref:1, s:"−", c:"+", fb:"`23π/12` is `2π - π/12`: a reflection in the `x`-axis, so sine changes sign and cosine keeps it." }],
        good:"✓ All four rows are right. The last four dots are filled." },
      done:"24 angles, 24 exact points. Every new coordinate is `±(√6 + √2)/4 ≈ ±0.966` or `±(√6 - √2)/4 ≈ ±0.259`.",
      summary:"`π/12` clock (rounds right first try)",
      dbl:{ title:"Check it with a double angle", html:"`2 sin(π/12) cos(π/12) = 2 × (√6 - √2)/4 × (√6 + √2)/4 = 2 × (6 - 2)/16 = 1/2`, and that’s `sin(π/6)`. Doubling `π/12` gives `π/6`. The next view shows why this works." }
    },
    lab:{
      theta:"Angle `@t{θ}`", compare:"Compare with `2 sin θ`",
      stages:["Double the angle", "Join `A` to `P`", "Measure the chord", "Height and run"],
      caps:["The arm `OP` turns through `2θ`.",
        "`OA = OP = 1`, so triangle `AOP` is isosceles and its angles at `A` and `P` are equal. Together they make the outside angle `2θ` at `O`, so each one is `θ`.",
        "Triangle `AMO` has hypotenuse 1 and angle `θ` at `A`, so `AM = cos θ` and the chord is `AP = 2 cos θ`.",
        "In right triangle `AFP` (hypotenuse `2 cos θ`, angle `θ` at `A`): the height `FP = 2 cos θ sin θ`, and the run `AF = 2 cos θ cos θ = 2cos²θ`. Since `A` is at `x = -1` and `F` is at `x = cos 2θ`, `AF = 1 + cos 2θ`. `1 + cos 2θ = 2cos²θ`, so `cos 2θ = 2cos²θ - 1`."],
      flat:"(the triangle is flat at this end of the slider)",
      heightLab:"`sin 2θ = 2 sin θ cos θ`", chordLab:"`2 cos θ`", runLab:"`2cos²θ`", cmpLab:"`2 sin θ`: not the height of `P`",
      rows:{ angles:"Angles", chord:"Chord `AP = 2 cos θ`", height:"Height of `P` = `sin 2θ`", prod:"`2 sin θ cos θ`", cos3:"`cos 2θ`, three ways", tan:"`tan 2θ = {2 tan θ}/{1 - tan²θ}`", two:"`2 sin θ`" },
      allThree:"all three ways (exactly {v}, since `2θ` = {ang})",
      tanUndef:"undefined: the denominator `1 - tan²θ` is 0",
      tanNo:"The formula can’t be used here (`tan θ` is undefined). From the point: `tan 2θ = tan π = 0`.",
      tanExact:"(exact, since `2θ` = {ang} is special)",
      more:", which is more than `sin 2θ` {v}", same:", the same as `sin 2θ`",
      alg:{ title:"Check it with algebra",
        html:"<p>Set `b = a = θ` in the compound angle formulas.</p><p>`sin 2θ = sin(θ + θ) = sin θ cos θ + cos θ sin θ =` <strong>`2 sin θ cos θ`</strong>.</p><p>`cos 2θ = cos(θ + θ) = cos θ cos θ - sin θ sin θ =` <strong>`cos²θ - sin²θ`</strong>.</p><p>Replace `sin²θ` with `1 - cos²θ`: `cos 2θ =` <strong>`2cos²θ - 1`</strong>. Replace `cos²θ` with `1 - sin²θ`: `cos 2θ =` <strong>`1 - 2sin²θ`</strong>.</p><p>`tan 2θ = (tan θ + tan θ)/(1 - tan θ tan θ) =` <strong>`{2 tan θ}/{1 - tan²θ}`</strong>.</p><p>Check with `θ = π/6`: `sin(π/3) = 2 × 1/2 × √3/2 = √3/2` ✓.</p>" }
    },
    blocks:[{ title:"What the formulas mean", html:"<p><strong>Exact values in four steps</strong></p><ol><li>Write the angle with denominator 12 and split it into two special angles (a sum or a difference).</li><li>Choose the formula: sine mixes and keeps the sign; cosine matches and switches it.</li><li>Fill in the special values, with CAST signs.</li><li>Multiply under the roots, put everything over 4, and check the sign against the quadrant.</li></ol>" +
      "<p><strong>Tangent values:</strong> use `tan(a ± b) = (tan a ± tan b)/(1 ∓ tan a tan b)`, then clear the root from the denominator with a difference of squares. Example: `tan(5π/12) = tan(π/4 + π/6) = (1 + √3/3)/(1 - √3/3)`. Multiply the top and bottom by 3: `(3 + √3)/(3 - √3)`. Multiply the top and bottom by `3 + √3`: `(9 + 6√3 + 3)/(9 - 3) = (12 + 6√3)/6 = 2 + √3`. (Or divide: tan = sin/cos, with the values from the clock.)</p>" +
      "<p><strong>Double angles:</strong> `sin 2θ = 2 sin θ cos θ`; `cos 2θ = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ`; `tan 2θ = {2 tan θ}/{1 - tan²θ}`. Choose the form of `cos 2θ` that uses the ratio you’re given.</p>" }],
    quickCheck:{ title:"Exact values", summary:"Exact values quick check",
      items:[
        { id:"q1", goal:3, prompt:"Which split turns `7π/12` into two special angles?",
          choices:[{ t:"`π/4 + π/6`", fb:"`3π/12 + 2π/12 = 5π/12`, not `7π/12`." }, { t:"`π/2 + π/12`", fb:"That adds to `7π/12`, but `π/12` isn’t a special angle, so you don’t know its values to start with." },
            { t:"`π/3 + π/4`", ok:true, fb:"Right: `4π/12 + 3π/12 = 7π/12`, and both parts are special." }, { t:"`π/2 + π/6`", fb:"`6π/12 + 2π/12 = 8π/12 = 2π/3`." }] },
        { id:"q2", goal:5, prompt:"`sin θ = 3/5` and `θ` is acute. What is `sin 2θ`?",
          choices:[{ t:"`7/25`", fb:"That’s `cos 2θ = cos²θ - sin²θ = 16/25 - 9/25`." }, { t:"`12/25`", fb:"`sin θ cos θ` is only half of `sin 2θ`. Don’t forget the 2." },
            { t:"`24/25`", ok:true, fb:"Right: `cos θ = 4/5`, so `sin 2θ = 2 × 3/5 × 4/5 = 24/25`." }, { t:"`6/5`", fb:"`2 sin θ = 6/5` is bigger than 1, so it can’t be a sine. Doubling the angle doesn’t double the sine." }] },
        { id:"q3", goal:5, prompt:"`cos θ = 1/4`. What is `cos 2θ`?",
          choices:[{ t:"`-7/8`", ok:true, fb:"Right: use the form with cos: `2cos²θ - 1 = 2/16 - 1 = -7/8`." }, { t:"`-1/2`", fb:"`2 cos θ - 1` forgets to square: it’s `2cos²θ - 1`." },
            { t:"`1/2`", fb:"`2 cos θ` doubles the ratio, not the angle." }, { t:"`7/8`", fb:"`1 - 2cos²θ` is the negative of `cos 2θ`. The sin form is `1 - 2sin²θ`; the cos form is `2cos²θ - 1`." }] },
        { id:"q4", goal:5, fixedOrder:true, prompt:"`2 sin(π/12) cos(π/12) = ?`",
          choices:[{ t:"`1/4`", fb:"`sin(π/12) cos(π/12)` alone is `1/4`; the 2 doubles it." }, { t:"`1/2`", ok:true, fb:"Right: `2 sin θ cos θ = sin 2θ`, so this is `sin(π/6) = 1/2`." },
            { t:"`√3/2`", fb:"That’s `cos(π/6)`. `2 sin θ cos θ` is the sine of `2θ`." }, { t:"1", fb:"`sin²θ + cos²θ = 1`, but this is `2 sin θ cos θ`, a different expression." }] }
      ] }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Name that compound angle", summary:"Name that compound angle", goal:[2, 1],
        instruction:"Sort each expression into the box for the single compound angle it equals.", how:"Tap an expression, then tap the box it belongs in.", noun:"expression",
        boxes:[{ id:"b1", label:"`sin(a + b)`" }, { id:"b2", label:"`sin(a - b)`" }, { id:"b3", label:"`cos(a + b)`" }, { id:"b4", label:"`cos(a - b)`" }],
        items:[
          sortItem("s1", "`sin a cos b + cos a sin b`", "b1", "Mixed pairs mean sine, and the + matches `a + b`.", "`sin a cos b + cos a sin b`"),
          sortItem("s2", "`cos b sin a + sin b cos a`", "b1", "The factors are in a different order, but it’s still `sin a cos b + cos a sin b`.", "Reordered, it’s `sin a cos b + cos a sin b`"),
          sortItem("s3", "`sin a cos(-b) - cos a sin(-b)`", "b1", "`cos(-b) = cos b` and `sin(-b) = -sin b`, so this is `sin a cos b + cos a sin b`.", "", NEG,
            ["Rewrite `cos(-b)` and `sin(-b)` first.", "`cos(-b) = cos b` and `sin(-b) = -sin b`. So the expression is `sin a cos b - cos a (-sin b)`.", "That’s `sin a cos b + cos a sin b`: mixed pairs with a +, so it equals `sin(a + b)`."]),
          sortItem("s4", "`sin a cos b - cos a sin b`", "b2", "Mixed pairs mean sine, and the − matches `a - b`.", "`sin a cos b - cos a sin b`"),
          sortItem("s5", "`-sin(b - a)`", "b2", "Sine is odd: `sin(-x) = -sin x`. So `-sin(b - a) = sin(a - b)`.", "`-sin(b - a) = -(sin b cos a - cos b sin a) = sin a cos b - cos a sin b`", NEG),
          sortItem("s6", "`cos(π/2 - a) cos b - sin(π/2 - a) sin b`", "b2", "`cos(π/2 - a) = sin a` and `sin(π/2 - a) = cos a`, so this is `sin a cos b - cos a sin b`.", "`cos(π/2 - a) cos b - sin(π/2 - a) sin b = sin a cos b - cos a sin b`", COF),
          sortItem("s7", "`cos a cos b - sin a sin b`", "b3", "Matched pairs mean cosine, and the − means `a + b`: cosine switches the sign.", "`cos a cos b - sin a sin b`"),
          sortItem("s8", "`-sin a sin b + cos a cos b`", "b3", "Reorder it: `cos a cos b - sin a sin b`.", "Reordered, it’s `cos a cos b - sin a sin b`"),
          sortItem("s9", "`cos(-a - b)`", "b3", "Cosine is even: `cos(-(a + b)) = cos(a + b)`.", "`cos(-a - b) = cos(-a) cos b + sin(-a) sin b = cos a cos b - sin a sin b`", NEG),
          sortItem("s10", "`cos a cos b + sin a sin b`", "b4", "Matched pairs mean cosine, and the + means `a - b`.", "`cos a cos b + sin a sin b`"),
          sortItem("s11", "`sin a sin b + cos a cos b`", "b4", "It starts with sin, but the pairs match (sin·sin and cos·cos), so it’s a cosine: `cos a cos b + sin a sin b`.", "", "",
            ["Don’t go by the first letter. Look at how the factors pair up.", "`sin a sin b` and `cos a cos b` are matched pairs, so it’s a cosine.", "Reordered, it’s `cos a cos b + sin a sin b`. Cosine switches the sign, so + means `cos(a - b)`."]),
          sortItem("s12", "`sin(π/2 - a) cos b + cos(π/2 - a) sin b`", "b4", "`sin(π/2 - a) = cos a` and `cos(π/2 - a) = sin a`, so this is `cos a cos b + sin a sin b`.", "`sin(π/2 - a) cos b + cos(π/2 - a) sin b = cos a cos b + sin a sin b`", COF)
        ] },
      { id:"entries", type:"custom", title:"Exact values, forwards and backwards", summary:"Exact values, forwards and backwards", star:true, goal:[3, 4, 5, 6],
        instruction:"Find each exact value. The last three are puzzles: they need more than one step.",
        how:"Fill in the boxes, then press Check. Boxes take whole numbers or fractions like −1/3.",
        nonRoutine:"Non-routine", generic:"Check each sign and each size, then try again.", fill:"Fill in every box first.", palHow:"Tap a value from the palette.",
        items:[
          { id:"x1", goal:3, kind:"r62", prompt:"Find `sin(11π/12)` exactly.", answer:[1, -1],
            wrong:[{ m:[1, 1], fb:"`cos(2π/3)` is `-1/2` (quadrant 2), so the second product is negative." }, { m:[-1, 1], fb:"`11π/12` is in quadrant 2, where sine is positive." }],
            hints:["Split `11π/12` into two special angles.", "`11π/12 = 2π/3 + π/4`. Use `sin(a + b) = sin a cos b + cos a sin b`.", "`(√3/2)(√2/2) + (-1/2)(√2/2) = √6/4 - √2/4 = (√6 - √2)/4`. Enter 1 and −1."] },
          { id:"x2", goal:3, kind:"r62", prompt:"Find `cos(7π/12)` exactly.", answer:[-1, 1],
            wrong:[{ m:[1, 1], fb:"That uses + in `cos(a + b)`. Cosine switches the sign." }, { m:[1, -1], fb:"`7π/12` is past `π/2`, so its cosine is negative." }],
            hints:["Split `7π/12` into two special angles.", "`7π/12 = π/3 + π/4`. Use `cos(a + b) = cos a cos b - sin a sin b`.", "`(1/2)(√2/2) - (√3/2)(√2/2) = √2/4 - √6/4`. Enter −1 for `√6` and 1 for `√2`."] },
          { id:"x3", goal:4, kind:"r3", prompt:"Find `tan(π/12)` exactly.", answer:[2, -1],
            wrong:[{ m:[2, 1], fb:"`2 + √3` is `tan(5π/12)`: that’s the sum formula." }, { m:[1, -0.3333333333333333], fb:"That’s `tan(π/4) - tan(π/6)`. Tangent doesn’t subtract either." }, { m:[1, 0], fb:"That uses `1 - tan a tan b` underneath. `tan(a - b)` has `1 + tan a tan b`." }],
            hints:["`π/12 = π/4 - π/6`. Use the tangent formula for a difference.", "`tan(a - b) = (tan a - tan b)/(1 + tan a tan b) = (1 - √3/3)/(1 + √3/3)`. Multiply the top and bottom by 3.", "`(3 - √3)/(3 + √3)`. Multiply the top and bottom by `3 - √3`: `(12 - 6√3)/6 = 2 - √3`."] },
          { id:"x4", goal:2, kind:"pal", prompt:"Find the exact value of `sin(5π/12) cos(π/12) - cos(5π/12) sin(π/12)`.", answer:"r3",
            wrong:[{ m:"1", fb:"With + it would be `sin(π/2)`. The − makes it `sin(5π/12 - π/12)`." }, { m:"h", fb:"sin·cos − cos·sin is the <strong>sine</strong> formula, not cosine: `sin(π/3)`, not `cos(π/3)`." }],
            hints:["Which formula has the pattern sin·cos − cos·sin?", "It’s `sin(a - b)` with `a = 5π/12` and `b = π/12`.", "`sin(5π/12 - π/12) = sin(4π/12) = sin(π/3) = √3/2`."] },
          { id:"x5", goal:6, kind:"frac", prompt:"`cos a = 4/5` with `a` in quadrant 4, and `sin b = 12/13` with `b` in quadrant 2. Find `cos(a + b)`.", answer:"16/65",
            wrong:[{ m:"−56/65", fb:"`sin a` is `-3/5` in quadrant 4, and `cos(a + b)` has − between its pieces: `-(-3/5)(12/13) = +36/65`." }, { m:"56/65", fb:"`cos b` is `-5/13` in quadrant 2." }, { m:"−16/65", fb:"Both `sin a` and `cos b` are negative here." }],
            hints:["Find `sin a` and `cos b` first, with their signs.", "`sin a = -3/5` (quadrant 4) and `cos b = -5/13` (quadrant 2).", "`cos(a + b) = (4/5)(-5/13) - (-3/5)(12/13) = -20/65 + 36/65 = 16/65`."] },
          { id:"x6", goal:4, kind:"frac", star:true, tag:"working backwards", prompt:"`tan a = 2` and `tan(a + b) = -1`. Find `tan b`.", answer:"3",
            wrong:[{ m:"−3", fb:"That treats `tan(a + b)` as `tan a + tan b`." }, { m:"−1", fb:"That uses `1 + tan a tan b` underneath. For `a + b` it’s `1 - tan a tan b`." }],
            hints:["Write the tangent formula with `tan a = 2` and `tan b = t`, and set it equal to −1.", "`(2 + t)/(1 - 2t) = -1`, so `2 + t = -(1 - 2t)`.", "`2 + t = -1 + 2t`, so `t = 3`. Check: `(2 + 3)/(1 - 6) = 5/(-5) = -1` ✓."] },
          { id:"x7", goal:5, kind:"frac", star:true, tag:"multi-step", prompt:"`cos θ = 1/3`. Find `cos 4θ`.", answer:"17/81",
            wrong:[{ m:"4/3", fb:"`4 cos θ` multiplies the ratio, not the angle." }, { m:"−7/9", fb:"That’s `cos 2θ`. Use the formula again: `4θ = 2(2θ)`." }, { m:"−17/81", fb:"`1 - 2cos²(2θ)` is the negative of `cos 4θ`. Use `2cos²(2θ) - 1`." }, { m:"−23/9", fb:"`2 cos 2θ - 1` forgets to square `cos 2θ`." }],
            hints:["`4θ` is double `2θ`. Find `cos 2θ` first.", "`cos 2θ = 2cos²θ - 1 = 2/9 - 1 = -7/9`.", "`cos 4θ = 2cos²(2θ) - 1 = 2 × 49/81 - 1 = 98/81 - 81/81 = 17/81`."] },
          { id:"x8", goal:5, kind:"sin3", star:true, tag:"transfer, hardest", prompt:"Write `sin 3θ` using `sin θ` only: `sin 3θ = p sin θ + q sin³θ`.", answer:[3, -4],
            wrong:[{ m:[3, 0], fb:"`sin 3θ` isn’t `3 sin θ`. Try `θ = π/2`: `sin(3π/2) = -1`, not 3." }, { m:[1, 0], fb:"That uses `sin(2θ - θ)`. `3θ = 2θ + θ`, and the sine formula keeps the +." }, { m:[2, -2], fb:"That’s only the first piece, `sin 2θ cos θ`. Add `cos 2θ sin θ`." }],
            hints:["Write `3θ = 2θ + θ` and use the sine formula.", "`sin 3θ = sin 2θ cos θ + cos 2θ sin θ = 2 sin θ cos²θ + (1 - 2sin²θ) sin θ`. Now replace `cos²θ` with `1 - sin²θ`.", "`2 sin θ (1 - sin²θ) + sin θ - 2sin³θ = 3 sin θ - 4sin³θ`. Check with `θ = π/6`: `sin(π/2) = 1`, and `3(1/2) - 4(1/8) = 1` ✓."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Omar", goal:3, how:"",
        instruction:"Omar made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the exact value of `cos(5π/12)`.",
            steps:["`5π/12 = 3π/12 + 2π/12 = π/4 + π/6`.", "`cos(π/4 + π/6) = cos(π/4) cos(π/6) + sin(π/4) sin(π/6)`.", "`= (√2/2)(√3/2) + (√2/2)(1/2)`", "`= (√6 + √2)/4`"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 substitutes the right values into step 2’s formula. The mistake is earlier.", "Step 4 simplifies step 3 correctly. The mistake is earlier."],
            fixes:[
              { t:"`cos(π/4 + π/6) = cos(π/4) cos(π/6) - sin(π/4) sin(π/6)`, so `cos(5π/12) = (√6 - √2)/4`.", ok:true, why:"Cosine switches the sign. Check: `(√6 - √2)/4 ≈ 0.259`, and `5π/12` is close to `π/2`, so its cosine should be small." },
              { t:"`cos(π/4 + π/6) = cos(π/4) + cos(π/6) = (√2 + √3)/2`.", why:"Cosine doesn’t split over a sum, and `(√2 + √3)/2 ≈ 1.57` is bigger than 1, which no cosine can be." },
              { t:"Keep step 2, but simplify step 4 to `√8/4 = √2/2`.", why:"You can’t add under the root, and this keeps the sign error in step 2." },
              { t:"Step 2 is correct as written.", why:"Test it with `a = b = π/4`: `cos(π/2) = 0`, but `cos²(π/4) + sin²(π/4) = 1`. The sign must be −." }],
            hints:["Check step 2’s sign against the cosine formula.", "Cosine matches and switches: `cos(a + b) = cos a cos b - sin a sin b`.", "Step 2 is wrong. With −, `cos(5π/12) = √6/4 - √2/4 = (√6 - √2)/4`."] },
          { id:"e2", goal:6, task:"`sin a = 5/13` with `a` in quadrant 2, and `cos b = 3/5` with `b` in quadrant 1. Find `sin(a - b)`.",
            steps:["`cos²a = 1 - 25/169 = 144/169`, and cosine is negative in quadrant 2, so `cos a = -12/13`.", "`sin²b = 1 - 9/25 = 16/25`, and `b` is in quadrant 1, so `sin b = 4/5`.", "`sin(a - b) = sin a cos b - cos a sin b`.", "`= (5/13)(3/5) - (12/13)(4/5)`", "`= 15/65 - 48/65 = -33/65`"],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: in quadrant 1 every ratio is positive.", "Step 3 is the right formula: sine keeps the sign of `a - b`.", "", "Step 5 does step 4’s arithmetic correctly. The mistake is earlier."],
            fixes:[
              { t:"`= (5/13)(3/5) - (-12/13)(4/5) = 15/65 + 48/65 = 63/65`.", ok:true, why:"Step 1 found `cos a = -12/13`, and subtracting a negative product adds it." },
              { t:"`= (5/13)(3/5) + (-12/13)(4/5) = 15/65 - 48/65 = -33/65`.", why:"That changes the formula to `sin(a + b)`. Step 3’s minus sign was right; step 4 lost the negative sign of `cos a`." },
              { t:"`= (5/13)(4/5) - (-12/13)(3/5) = 20/65 + 36/65 = 56/65`.", why:"This swaps `sin b` and `cos b`. `cos b = 3/5` and `sin b = 4/5`." },
              { t:"Step 4 is correct as written.", why:"Step 1 found `cos a = -12/13`, but step 4 uses `+12/13`." }],
            hints:["Compare the values in step 4 with the values found in steps 1 and 2.", "Step 1 says `cos a = -12/13`. What does step 4 use?", "Step 4 is wrong: `(5/13)(3/5) - (-12/13)(4/5) = 15/65 + 48/65 = 63/65`."] },
          { id:"e3", goal:1, task:"Start from `cos(a - b) = cos a cos b + sin a sin b` and find a formula for `cos(a + b)`.",
            steps:["`a + b = a - (-b)`.", "So `cos(a + b) = cos(a - (-b)) = cos a cos(-b) + sin a sin(-b)`.", "`cos(-b) = -cos b` and `sin(-b) = -sin b`.", "So `cos(a + b) = -cos a cos b - sin a sin b`."],
            answer:2,
            stepFb:["Step 1 is correct: adding `b` is subtracting `-b`.", "Step 2 is correct: it uses the `cos(a - b)` formula with `-b` in place of `b`.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`cos(-b) = cos b` (cosine is even) and `sin(-b) = -sin b` (sine is odd), so `cos(a + b) = cos a cos b - sin a sin b`.", ok:true, why:"On the unit circle, `-b` is the mirror image of `b` in the `x`-axis: same `x`-coordinate, opposite `y`-coordinate." },
              { t:"`cos(-b) = cos b` and `sin(-b) = sin b`, so `cos(a + b) = cos a cos b + sin a sin b`.", why:"That gives back `cos(a - b)`. Reflecting in the `x`-axis changes the `y`-coordinate, so `sin(-b) = -sin b`." },
              { t:"`cos(-b) = -cos b` and `sin(-b) = sin b`, so `cos(a + b) = -cos a cos b + sin a sin b`.", why:"This swaps which function is even. Cosine (the `x`-coordinate) stays the same when `b` is reflected in the `x`-axis." },
              { t:"Step 3 is correct as written.", why:"Test step 4 with `a = b = 0`: it gives `cos 0 = -1`, but `cos 0 = 1`." }],
            hints:["Picture `b` and `-b` on the unit circle. Which coordinate changes sign?", "`-b` is the reflection of `b` in the `x`-axis: the `x`-coordinate (cosine) stays, the `y`-coordinate (sine) changes sign.", "Step 3 is wrong: `cos(-b) = cos b` and `sin(-b) = -sin b`. Then `cos(a + b) = cos a cos b - sin a sin b`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you added the heights of two points in Explore?" },
      { id:"j2", q:"In your own words, why does the formula for `sin(a + b)` have two pieces? Where does each piece come from in the picture?" },
      { id:"j3", q:"Explain to a friend, step by step, how to find `cos(7π/12)` exactly without a calculator." },
      { id:"j4", q:"Which do you mix up more: the sign in the cosine formula, or which ratios pair up in the sine formula? What will you do to keep them straight?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which is the expansion of `cos(a - b)`?", options:[
          { t:"`cos a - cos b`", why:"Cosine doesn’t split over a difference." },
          { t:"`cos a cos b + sin a sin b`", ok:true, why:"Cosine matches the pairs and switches the sign: `a - b` gives +." },
          { t:"`cos a cos b - sin a sin b`", why:"That’s `cos(a + b)`. Cosine switches the sign, so `a - b` gives +." },
          { t:"`sin a cos b - cos a sin b`", why:"That’s `sin(a - b)`: mixed pairs make a sine." }] },
        b:{ prompt:"Which is the expansion of `sin(a + b)`?", options:[
          { t:"`sin a + sin b`", why:"Sine doesn’t split over a sum." },
          { t:"`sin a sin b + cos a cos b`", why:"Matched pairs make a cosine: this is `cos(a - b)`." },
          { t:"`sin a cos b + cos a sin b`", ok:true, why:"Sine mixes the pairs and keeps the sign." },
          { t:"`sin a cos b - cos a sin b`", why:"That’s `sin(a - b)`. The sine formula keeps the operation’s sign." }] } },
      { id:"k2", cat:"K", goal:5,
        a:{ prompt:"Which expression is equal to `cos 2θ` for every `θ`?", options:[
          { t:"`2 cos θ`", why:"That doubles the ratio. At `θ = 0` it gives 2, but `cos 0 = 1`." },
          { t:"`cos²θ + sin²θ`", why:"That’s always 1. `cos 2θ` is `cos²θ` <strong>minus</strong> `sin²θ`." },
          { t:"`1 - 2sin²θ`", ok:true, why:"`cos²θ - sin²θ` with `cos²θ` replaced by `1 - sin²θ`." },
          { t:"`1 - 2cos²θ`", why:"That’s the negative of `cos 2θ`. The cos form is `2cos²θ - 1`." }] },
        b:{ prompt:"Which expression is equal to `sin 2θ` for every `θ`?", options:[
          { t:"`2 sin θ`", why:"That doubles the ratio. At `θ = π/2` it gives 2, but `sin π = 0`." },
          { t:"`sin θ cos θ`", why:"That’s half of `sin 2θ`. `sin(θ + θ)` has two equal pieces." },
          { t:"`sin²θ - cos²θ`", why:"That’s `-cos 2θ`, not a sine at all." },
          { t:"`2 sin θ cos θ`", ok:true, why:"`sin(θ + θ) = sin θ cos θ + cos θ sin θ = 2 sin θ cos θ`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ fixedOrder:true, prompt:"What is the exact value of `cos(π/12)`?", options:[
          { t:"`(√2 - √3)/2`", why:"That’s `cos(π/4) - cos(π/6)`. Cosine doesn’t split, and a cosine of an angle this small must be close to 1." },
          { t:"`(√6 - √2)/4`", why:"That’s `sin(π/12)`. It uses − in `cos(π/4 - π/6)`, but cosine switches the sign: `cos(π/4 - π/6) = cos(π/4) cos(π/6) + sin(π/4) sin(π/6)`." },
          { t:"`√2/2`", why:"`√6 + √2` can’t be combined into `√8`. And `√2/2` is `cos(π/4)`." },
          { t:"`(√6 + √2)/4`", ok:true, why:"`cos(π/4 - π/6) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4`." }] },
        b:{ fixedOrder:true, prompt:"What is the exact value of `sin(π/12)`?", options:[
          { t:"`(√2 - 1)/2`", why:"That’s `sin(π/4) - sin(π/6)`. Sine doesn’t split over a difference." },
          { t:"`(√6 - √2)/4`", ok:true, why:"`sin(π/4 - π/6) = (√2/2)(√3/2) - (√2/2)(1/2) = (√6 - √2)/4`." },
          { t:"`1/2`", why:"`√6 - √2` can’t be combined into `√4`. And `1/2` is `sin(π/6)`, not `sin(π/12)`." },
          { t:"`(√6 + √2)/4`", why:"That uses + in `sin(π/4 - π/6)`. The sine formula keeps the −. (It’s also far too big: a sine of an angle this small must be close to 0.)" }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"`sin a = 3/5` with `a` in quadrant 2, and `cos b = 5/13` with `b` in quadrant 4. What is `sin(a + b)`?", options:[
          { t:"`-33/65`", why:"A sign was lost: `cos a = -4/5` in quadrant 2 and `sin b = -12/13` in quadrant 4. With both negative, the second piece is `+48/65`." },
          { t:"`-21/65`", why:"That’s `sin a + sin b = 3/5 - 12/13`." },
          { t:"`16/65`", why:"That’s `cos(a + b) = cos a cos b - sin a sin b`." },
          { t:"`63/65`", ok:true, why:"`cos a = -4/5`, `sin b = -12/13`, so `sin(a + b) = (3/5)(5/13) + (-4/5)(-12/13) = 15/65 + 48/65 = 63/65`." }] },
        b:{ prompt:"`cos a = -3/5` with `a` in quadrant 3, and `sin b = 8/17` with `b` in quadrant 2. What is `cos(a - b)`?", options:[
          { t:"`-77/85`", why:"`cos b` is `-15/17` in quadrant 2, not `+15/17`." },
          { t:"`13/85`", ok:true, why:"`sin a = -4/5`, `cos b = -15/17`, so `cos(a - b) = (-3/5)(-15/17) + (-4/5)(8/17) = 45/85 - 32/85 = 13/85`." },
          { t:"`24/85`", why:"That’s `cos a - cos b = -3/5 + 15/17`." },
          { t:"`77/85`", why:"That uses − between the pieces, which is `cos(a + b)` (or it drops the sign of `sin a`). Cosine switches the sign: `a - b` gives +." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`tan a = 1/2` and `tan b = 1/3`, and both angles are acute. What is `tan(a + b)`, and what does it tell you about `a + b`?", options:[
          { t:"“`tan(a + b) = 5/7`, so `a + b` is less than `π/4`.”", why:"That uses `1 + tan a tan b` underneath. For a sum it’s `1 - tan a tan b = 5/6`." },
          { t:"“`tan(a + b) = 5/6`, so `a + b` is less than `π/4`.”", why:"That’s `tan a + tan b`. Tangent doesn’t add." },
          { t:"“`tan(a + b) = 1`, so `a + b = π/4`.”", ok:true, why:"`(1/2 + 1/3)/(1 - 1/6) = (5/6)/(5/6) = 1`. Both angles are less than `π/4` (their tangents are less than 1), so `a + b` is between 0 and `π/2`, where only `π/4` has tangent 1." },
          { t:"“`tan(a + b) = 1`, so `a + b = 5π/4`.”", why:"`tan(5π/4) = 1` too, but two acute angles add to less than π." }] },
        b:{ prompt:"`tan a = 2` and `tan b = 3`, and both angles are acute. What is `tan(a + b)`, and what does it tell you about `a + b`?", options:[
          { t:"“`tan(a + b) = 5/7`, so `a + b` is less than `π/4`.”", why:"That uses `1 + tan a tan b` underneath. For a sum it’s `1 - tan a tan b = -5`." },
          { t:"“`tan(a + b) = 5`, so `a + b` is close to `π/2`.”", why:"That’s `tan a + tan b`. Tangent doesn’t add." },
          { t:"“`tan(a + b) = -1`, so `a + b = 3π/4`.”", ok:true, why:"`(2 + 3)/(1 - 6) = -1`. Both angles are more than `π/4` (their tangents are more than 1), so `a + b` is between `π/2` and π, where tangent is −1 only at `3π/4`." },
          { t:"“`tan(a + b) = -1`, so `a + b = 7π/4`.”", why:"`tan(7π/4) = -1` too, but two acute angles add to less than π." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ fixedOrder:true, prompt:"`cos θ = 1/3` and `θ` is in quadrant 4. What is `sin 2θ`?", options:[
          { t:"`-4√2/3`", why:"That’s `2 sin θ`. It’s less than −1, which no sine can be." },
          { t:"`-7/9`", why:"That’s `cos 2θ = 2cos²θ - 1`." },
          { t:"`-4√2/9`", ok:true, why:"`sin θ = -√{1 - 1/9} = -2√2/3` in quadrant 4, so `sin 2θ = 2(-2√2/3)(1/3) = -4√2/9`." },
          { t:"`4√2/9`", why:"In quadrant 4 sine is negative: `sin θ = -2√2/3`." }] },
        b:{ fixedOrder:true, prompt:"`sin θ = -1/3` and `θ` is in quadrant 3. What is `sin 2θ`?", options:[
          { t:"`-2/3`", why:"That’s `2 sin θ`. Doubling the angle doesn’t double the sine." },
          { t:"`-4√2/9`", why:"In quadrant 3 cosine is negative too: `cos θ = -2√2/3`, so the product of two negatives is positive." },
          { t:"`4√2/9`", ok:true, why:"`cos θ = -√{1 - 1/9} = -2√2/3` in quadrant 3, so `sin 2θ = 2(-1/3)(-2√2/3) = 4√2/9`." },
          { t:"`7/9`", why:"That’s `cos 2θ = 1 - 2sin²θ`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"A classmate claims `sin(a + b) = sin a + sin b` for all angles. Which is the best response?", options:[
          { t:"“Try `a = π/2` and `b = 3π/2`: `sin(2π) = 0` and `sin(π/2) + sin(3π/2) = 1 - 1 = 0`. The sides match, so the claim is true.”", why:"One matching pair proves nothing. An identity has to hold for <strong>every</strong> pair." },
          { t:"“Use the distributive law: `sin(a + b) = sin·a + sin·b`, so the claim is true.”", why:"sin isn’t a number you multiply by; it’s a function. The distributive law doesn’t apply." },
          { t:"“Try `a = π/3` and `b = π/6`: `sin(π/2) = 1`, but `sin(π/3) + sin(π/6) = (√3 + 1)/2 ≈ 1.37`. One pair where the sides differ shows the claim is false.”", ok:true, why:"One counterexample is enough to show an equation isn’t an identity." },
          { t:"“Try `a = π/3` and `b = π/6`: the sides are 1 and about 1.37. But one example can’t prove anything, so we can’t tell.”", why:"One example can’t prove an identity, but one counterexample <strong>can</strong> disprove it." }] },
        b:{ prompt:"A classmate claims `cos(a - b) = cos a - cos b` for all angles. Which is the best response?", options:[
          { t:"“Try `a = π/2` and `b = 3π/4`: `cos(-π/4) = √2/2` and `cos(π/2) - cos(3π/4) = 0 + √2/2 = √2/2`. The sides match, so the claim is true.”", why:"One matching pair proves nothing. An identity has to hold for <strong>every</strong> pair." },
          { t:"“Try `a = b = π/3`: `cos 0 = 1`, but `cos(π/3) - cos(π/3) = 0`. One pair where the sides differ shows the claim is false.”", ok:true, why:"One counterexample is enough to show an equation isn’t an identity." },
          { t:"“Use the distributive law: `cos(a - b) = cos·a - cos·b`, so the claim is true.”", why:"cos is a function, not a number you multiply by." },
          { t:"“Try `a = b = π/3`: the sides are 1 and 0. But one example can’t prove anything, so we can’t tell.”", why:"One example can’t prove an identity, but one counterexample <strong>can</strong> disprove it." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which line of working finds `sin(7π/12)` correctly?", options:[
          { t:"`sin(7π/12) = sin(3π/4) - sin(π/6) = √2/2 - 1/2 = (√2 - 1)/2`", why:"Sine doesn’t split over a difference." },
          { t:"`sin(7π/12) = sin(3π/4 - π/6) = sin(3π/4) cos(π/6) - cos(3π/4) sin(π/6) = (√2/2)(√3/2) - (√2/2)(1/2) = (√6 - √2)/4`", why:"`cos(3π/4)` is `-√2/2`: `3π/4` is in quadrant 2." },
          { t:"`sin(7π/12) = sin(3π/4 - π/6) = sin(3π/4) cos(π/6) - cos(3π/4) sin(π/6) = (√2/2)(√3/2) - (-√2/2)(1/2) = (√6 + √2)/4`", ok:true, why:"Right split, right formula, right signs: subtracting the negative product adds it." },
          { t:"`sin(7π/12) = sin(π/3 + π/4) = sin(π/3) cos(π/4) + cos(π/3) sin(π/4) = √6/4 + √2/4 = √8/4 = √2/2`", why:"Everything is right until the last step: `√6 + √2` can’t be combined under one root." }] },
        b:{ prompt:"Which line of working finds `cos(11π/12)` correctly?", options:[
          { t:"`cos(11π/12) = cos(2π/3 + π/4) = cos(2π/3) cos(π/4) - sin(2π/3) sin(π/4) = (-1/2)(√2/2) - (√3/2)(√2/2) = -(√2 + √6)/4`", ok:true, why:"Right split, right formula, right signs." },
          { t:"`cos(11π/12) = cos(2π/3) + cos(π/4) = -1/2 + √2/2 = (√2 - 1)/2`", why:"Cosine doesn’t split over a sum." },
          { t:"`cos(11π/12) = cos(2π/3 + π/4) = cos(2π/3) cos(π/4) - sin(2π/3) sin(π/4) = (1/2)(√2/2) - (√3/2)(√2/2) = (√2 - √6)/4`", why:"`cos(2π/3)` is `-1/2`: `2π/3` is in quadrant 2." },
          { t:"`cos(11π/12) = cos(3π/4 + π/6) = cos(3π/4) cos(π/6) - sin(3π/4) sin(π/6) = -√6/4 - √2/4 = -√8/4 = -√2/2`", why:"Everything is right until the last step: `√6 + √2` can’t be combined under one root." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ fixedOrder:true, prompt:"A crane’s boom is 8 m long. It is raised to an angle of `7π/12` measured from the ground in the forward direction, so it leans slightly backward past vertical. How far behind the pivot is the tip, measured horizontally?", options:[
          { t:"`(√6 - √2)/4` m", why:"That’s `|cos(7π/12)|` on the unit circle. Multiply by the boom’s length, 8 m." },
          { t:"`2√6 - 2√2` m", ok:true, why:"`cos(7π/12) = cos(π/3 + π/4) = (1/2)(√2/2) - (√3/2)(√2/2) = (√2 - √6)/4`, which is negative: the tip is behind the pivot. `8 × (√6 - √2)/4 = 2√6 - 2√2 ≈ 2.07` m, a short distance, as you’d expect for a boom only `π/12` past vertical." },
          { t:"`2√6 + 2√2` m", why:"That uses + in `cos(a + b)`. Cosine switches the sign." },
          { t:"`4 + 4√2` m", why:"That’s `8(cos(π/3) + cos(π/4)) ≈ 9.66` m, longer than the 8 m boom itself." }] },
        b:{ fixedOrder:true, prompt:"A crane’s boom is 12 m long. It is lowered backward to an angle of `11π/12`, measured from the ground in the forward direction, so it points back and slightly up. How far behind the pivot is the tip, measured horizontally?", options:[
          { t:"`(√6 + √2)/4` m", why:"That’s `|cos(11π/12)|` on the unit circle. Multiply by the boom’s length, 12 m." },
          { t:"`6√2 - 6` m", why:"That’s `12(cos(2π/3) + cos(π/4))`. Cosine doesn’t split over a sum, and that value is positive, which would put the tip in front of the pivot." },
          { t:"`3√6 - 3√2` m", why:"That’s `12 × (√6 - √2)/4`. It comes from using + between the products in `cos(2π/3 + π/4)`, or from taking `cos(2π/3)` as `+1/2`. Cosine switches the sign, and `cos(2π/3) = -1/2`." },
          { t:"`3√6 + 3√2` m", ok:true, why:"`cos(11π/12) = cos(2π/3 + π/4) = (-1/2)(√2/2) - (√3/2)(√2/2) = -(√6 + √2)/4`, which is negative: the tip is behind the pivot. `12 × (√6 + √2)/4 = 3√6 + 3√2 ≈ 11.59` m, almost the whole 12 m, as you’d expect for a boom only `π/12` above the ground." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ fixedOrder:true, prompt:"For one kicking speed, a soccer ball’s horizontal range is `R = 40 sin 2θ` metres, where `θ` is the launch angle. A player kicks at an angle with `tan θ = 3/4`. How far does the ball travel?", options:[
          { t:"11.2 m", why:"That’s `40 cos 2θ = 40 × 7/25`." },
          { t:"24 m", why:"That’s `40 sin θ`. The formula uses the double angle." },
          { t:"38.4 m", ok:true, why:"`tan θ = 3/4` gives `sin θ = 3/5` and `cos θ = 4/5`, so `sin 2θ = 2 × 3/5 × 4/5 = 24/25` and `R = 40 × 24/25 = 38.4` m." },
          { t:"48 m", why:"That’s `40 × 2 sin θ`. The range can’t be more than 40 m, because `sin 2θ` is at most 1." }] },
        b:{ fixedOrder:true, prompt:"For one kicking speed, a soccer ball’s horizontal range is `R = 50 sin 2θ` metres, where `θ` is the launch angle. A player kicks at an angle with `tan θ = 4/3`. How far does the ball travel?", options:[
          { t:"−14 m", why:"That’s `50 cos 2θ = 50 × (-7/25)`. A range can’t be negative." },
          { t:"40 m", why:"That’s `50 sin θ`. The formula uses the double angle." },
          { t:"48 m", ok:true, why:"`tan θ = 4/3` gives `sin θ = 4/5` and `cos θ = 3/5`, so `sin 2θ = 24/25` and `R = 50 × 24/25 = 48` m." },
          { t:"80 m", why:"That’s `50 × 2 sin θ`. The range can’t be more than 50 m, because `sin 2θ` is at most 1." }] } }
    ]
  },
  task:{
    title:"Set the question", summary:"Set the question",
    statement:"<p>Write an exact-value question for a classmate. Choose an angle `x` that isn’t a special angle, a split of `x` into two special angles `a` and `b` that sit in <strong>different quadrants</strong>, and a ratio (sin, cos or tan) that is <strong>negative</strong> at `x`. Then give the answer key. There are many good questions. Can you write one for each ratio?</p>",
    ui:{ x:"Angle `x`", a:"Angle `a`", b:"Angle `b`", op:"Operation", ratio:"Ratio", key:"Answer key", keyPick:"Choose the exact value",
      keyNote:"Tangent keys have no root in the denominator. Clear it with a difference of squares, as in Part 3’s “Tangent values”.",
      pq:"For `a` and `b`: a whole number from 0 to 24 on top, and the denominator from the menu.",
      live:"Your question: Find the exact value of {rx}, using {eq}.", liveWait:"Your question appears here once every box is filled.",
      cot:"Same point, different angle: {eq}.", pending:"checked when you press Check my design",
      fill:"Fill in every box first: `x`, `a`, `b`, the operation, the ratio and the answer key.",
      quad:"in quadrant {n}", axis:"on an axis", outside:"outside 0 to 2π", firstYes:"yes", firstNo:"no", firstNot:"not checked yet",
      line:"Set the question: {s}; answer key right on the first check: {f}", solved:"solved ({q})", notSolved:"not solved yet" },
    checks:["`x` is not a special angle", "`a` and `b` are special angles, off the axes, in different quadrants", "`a ± b = x`", "Your ratio is negative at `x`", "Your answer key is the exact value"],
    tips:["`x` must be a multiple of `π/12` that isn’t a multiple of `π/6` or `π/4`, like `7π/12` or `13π/12`. `2π/12 = π/6` and `3π/12 = π/4` are special angles that don’t need a formula.",
      "Use multiples of `π/6` or `π/4` that aren’t on an axis, in different quadrants. Right now `a` is {qa} and `b` is {qb}.",
      "Right now {ab} = {v}. Write all three angles with denominator 12 and compare the numerators.",
      "{rx} is positive: `x` is in quadrant {n}, where {r} is positive. Use CAST to find where your ratio is negative.",
      "That isn’t the exact value. Expand {rab} with the formula and check each sign."],
    tipCot:"Your split lands on the same point as `x`, but {ab} = {v}, which is {xpm}, not {x}. Your question will say {xeq}, so the angles themselves must be equal. Keep `a` and change `b` (or the operation).",
    explainPrompt:"Explain how your classmate should find the exact value, and how they can tell it will be negative before they calculate.",
    vocab:"Use the words split, special angle, compound angle formula and CAST.",
    success:"Your question works.",
    more:"There’s more than one good question. Can you write one for each ratio, sin, cos and tan?",
    afterEach:"Three good questions. Notice that only six values of `x` ever work. The other two angles that aren’t special, `π/12` and `5π/12`, are in quadrant 1, where every ratio is positive."
  },
  cards:[
    ["`sin(a ± b)`", "`sin a cos b ± cos a sin b`. Sine mixes the pairs and keeps the sign."],
    ["`cos(a ± b)`", "`cos a cos b ∓ sin a sin b`. Cosine matches the pairs and switches the sign."],
    ["`tan(a ± b)`", "`(tan a ± tan b)/(1 ∓ tan a tan b)`. Undefined when the denominator is 0, for example `a = b = π/4`."],
    ["Does `sin(a + b) = sin a + sin b`?", "No. Counterexample: `a = π/3`, `b = π/6` gives `sin(π/2) = 1`, but `sin a + sin b = (√3 + 1)/2 ≈ 1.37`."],
    ["Where the two pieces of `sin(a + b)` come from", "Stack a right triangle with hypotenuse `cos b` (angle `a`) under one with hypotenuse `sin b`. Their heights are `sin a cos b` and `cos a sin b`."],
    ["`sin 2θ`", "`2 sin θ cos θ` (from `sin(θ + θ)`). Example: `sin(π/3) = 2 × 1/2 × √3/2 = √3/2`."],
    ["`cos 2θ`, three ways", "`cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ`. Use the form that matches the ratio you know."],
    ["`tan 2θ`", "`{2 tan θ}/{1 - tan²θ}`. Example: `tan(π/3) = (2√3/3)/(1 - 1/3) = √3`."],
    ["`sin(π/12)` and `cos(π/12)`", "`(√6 - √2)/4` and `(√6 + √2)/4`, from `π/12 = π/4 - π/6`."],
    ["`tan(π/12)` and `tan(5π/12)`", "`2 - √3` and `2 + √3`. Their product is 1, since `5π/12 = π/2 - π/12`."],
    ["Splitting an angle", "Write it with denominator 12 and find two special numerators (2, 3, 4, 6, 8, 9, 10, …) that add or subtract to it: `7π/12 = 4π/12 + 3π/12 = π/3 + π/4`."],
    ["One ratio and a quadrant → the other ratio", "`sin² + cos² = 1` gives the size; CAST gives the sign. `sin a = 3/5` in quadrant 2 → `cos a = -4/5`."]
  ]
};

// Inside `math`: ² ³ become superscripts; value fractions stack ((√6 − √2)/4, √3/2, 16/65, (a)/(b)); π-multiples stay inline.
function fx(s){
  return s.replace(/`([^`]+)`/g, (m, x) => {
    x = x.replace(/²/g, "^2").replace(/³/g, "^3");
    x = x.replace(/(\d*√\d+|\d+)\/(\d*√\d+|\d+)/g, "{$1}/{$2}");
    x = x.replace(/(?<![A-Za-z])\(([^()]+)\)\/\(([^()]+)\)/g, "{$1}/{$2}");
    x = x.replace(/(?<![A-Za-z])\(([^()]+)\)\/(\d+)/g, "{$1}/{$2}");
    x = x.replace(/(?<![\w}])(\d+)\/\(([^()]+)\)/g, "{$1}/{$2}");
    return "`" + x + "`";
  });
}
function walk(o, k){
  if (typeof o === "string") return k === "id" || k === "skill" ? o : fx(o);
  if (Array.isArray(o)) return o.map(x => walk(x, k));
  if (o && typeof o === "object") { const r = {}; for (const key of Object.keys(o)) r[key] = walk(o[key], key); return r; }
  return o;
}
export default walk(content);
