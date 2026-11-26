// MHF4U 18 Reciprocal of Linear Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/18-reciprocal-of-linear-functions.md
// k and c in y = 1/(kx − c) are plain coefficients (colour key rule 1, decision 12): written in ink, never @k/@c.

const CHIPS = (right, rightFb, wrongFb) => ["`+∞`", "`-∞`", "`0^{+}`", "`0^{-}`"].map(t => t === right ? { t, ok:true, fb:rightFb } : { t, fb:wrongFb });
const WB_H1 = "Where does the line cross the `x`-axis? That’s where the reciprocal’s asymptote goes.";
const WB_FALL3 = "`x = 2`. The line rises, so its reciprocal falls on each piece. Three graphs fit that; check the invariant points.";
const L_RISE = "Find the zero, then decide: does the line rise or fall?";

export default {
  id:"18-reciprocal-of-linear-functions",
  kind:"topic",
  title:"Reciprocal of linear functions",
  topic:"Reciprocal of Linear Functions",
  readyTopic:"the reciprocal of a linear function",
  hero:{
    eq:"`y = {1}/{kx - c}`", eqLabel:"y equals 1 over k x minus c",
    headline:"Every line has a reciprocal twin",
    text:"Take any line `y = kx - c` and divide 1 by each of its `y`-values. The result, `y = 1/(kx - c)`, is the line’s <strong>reciprocal function</strong>. Where the line is 0, the reciprocal has a <strong>vertical asymptote</strong>. Far out, where the line is huge, the reciprocal flattens toward its <strong>horizontal asymptote</strong> `y = 0`. Where the line equals 1 or −1, the two graphs meet at <strong>invariant points</strong>. Read the line, and you can sketch its twin.</p><p class=\"muted\">Here `k` and `c` are just the numbers in the line `kx - c`: its slope, and the number subtracted. They aren’t the stretch and shift parameters from module 07, so they’re written in plain ink.",
    fig:{
      aria:"The line y = x − 2 in teal and its reciprocal y = 1/(x − 2) in blue, with the vertical asymptote x = 2, the guides y = 1 and y = −1, and the invariant points (1, −1) and (3, 1).",
      steps:["The zero becomes an asymptote.", "1 and −1 are their own reciprocals.", "Big becomes small. Small becomes big.", "`y = 1/(x - 2)`: the reciprocal twin of `y = x - 2`"],
      labels:{ line:"y = x − 2", asym:"x = 2", stay:"stays put" }
    }
  },
  goals:[
    "I can find the vertical asymptote, horizontal asymptote, domain and range of `y = 1/(kx - c)`.",
    "I can find the `y`-intercept and the invariant points of `y = 1/(kx - c)`, and explain why it has no `x`-intercept.",
    "I can describe the behaviour near the vertical asymptote and at the ends, using notation like “as `x → 3^{+}`, `y → +∞`”.",
    "I can state where the reciprocal is positive or negative, and where it is increasing or decreasing, using the line’s graph.",
    "I can sketch `y = 1/(kx - c)` from the graph of the line `y = kx - c`.",
    "I can work backwards from features or points to find `k` and `c`, and use a reciprocal in a simple context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Lines", goal:1,
          prompt:"What is the zero (the `x`-intercept) of `y = 3x - 12`?",
          options:[
            { t:"`x = 4`", ok:true, why:"Set `y = 0`: `3x - 12 = 0`, so `3x = 12` and `x = 4`. Check: `3(4) - 12 = 0`." },
            { t:"`x = 12`", why:"12 is the number being subtracted. The zero is where `3x - 12 = 0`, so you still divide by 3: `x = 4`." },
            { t:"`x = -4`", why:"`3x - 12 = 0` gives `3x = +12`. Check `x = -4`: `3(-4) - 12 = -24`, not 0." },
            { t:"`x = -12`", why:"−12 is where the line crosses the `y`-axis (at `x = 0`). The zero is where it crosses the `x`-axis." }],
          hints:["The zero is the `x`-value that makes `y = 0`.", "Solve `3x - 12 = 0`. Add 12 to both sides first.", "`3x = 12`, so `x = 4`."] },
        { id:"w2", skill:"Lines", goal:4,
          prompt:"For which `x`-values is `-2x + 8` positive?",
          options:[
            { t:"`x < 4`", ok:true, why:"`-2x + 8 > 0` gives `-2x > -8`. Dividing by −2 reverses the inequality: `x < 4`. Check `x = 0`: 8 > 0." },
            { t:"`x > 4`", why:"Try `x = 5`: `-10 + 8 = -2`, which is negative. Dividing by −2 flips the inequality sign." },
            { t:"`x < -4`", why:"Subtracting 8 from both sides gives `-2x > -8`, not `-2x > 8`." },
            { t:"`x > -4`", why:"Try `x = 10`: `-20 + 8 = -12`, negative. The line is positive only to the left of its zero, `x = 4`." }],
          hints:["Write it as an inequality: `-2x + 8 > 0`.", "Subtract 8: `-2x > -8`. What happens when you divide by a negative number?", "Dividing by −2 reverses the sign: `x < 4`. A line with negative slope is positive to the left of its zero."] },
        { id:"w3", skill:"Reciprocals of numbers", goal:5,
          prompt:"The number `m` is between 0 and 1. What must be true about `1/m`?",
          options:[
            { t:"`1/m > 1`", ok:true, why:"Dividing 1 by a number smaller than 1 gives more than 1. For example, `1/0.5 = 2` and `1/0.1 = 10`." },
            { t:"`0 < 1/m < 1`", why:"Try `m = 0.5`: `1/0.5 = 2`. Small positive numbers have big reciprocals." },
            { t:"`1/m < -1`", why:"The reciprocal keeps the sign: `1/0.5 = +2`. The negative reciprocal (−2) is a different thing." },
            { t:"`-1 < 1/m < 0`", why:"The opposite of `m` is `-m`. The reciprocal is 1 ÷ `m`, which is positive and bigger than 1 here." }],
          hints:["Try a number: what is `1/0.5`?", "`1/0.5 = 2` and `1/0.25 = 4`. What happens as `m` gets smaller?", "For `0 < m < 1`, `1/m > 1`: small becomes big, and the sign stays positive."] },
        { id:"w4", skill:"Reciprocals of numbers", goal:2,
          prompt:"Which numbers are equal to their own reciprocal?",
          options:[
            { t:"1 and −1", ok:true, why:"`1/1 = 1` and `1/(-1) = -1`. No other number works: if `1/m = m`, then `m^2 = 1`." },
            { t:"Only 1", why:"Check −1: `1/(-1) = -1`. It works too." },
            { t:"0 and 1", why:"`1/0` isn’t 0. It has no value at all, because you can’t divide by 0." },
            { t:"2 and 1/2", why:"2 and 1/2 are reciprocals of <strong>each other</strong>, but 1/2 ≠ 2. You need numbers that are their <strong>own</strong> reciprocals." }],
          hints:["You want `1/m = m`. Try a few numbers.", "Multiply both sides of `1/m = m` by `m`: `m^2 = 1`.", "`m^2 = 1` gives `m = 1` or `m = -1`. Both work: `1/1 = 1` and `1/(-1) = -1`."] },
        { id:"w5", skill:"<i>y</i> = 1/<i>x</i>", goal:3,
          prompt:"For `y = 1/x`, what happens to `y` as `x → 0^{+}` (as `x` gets close to 0 from the right)?",
          options:[
            { t:"`y → +∞`", ok:true, why:"`1/0.1 = 10`, `1/0.01 = 100`, `1/0.001 = 1000`. The values grow without bound, and they’re positive." },
            { t:"`y → -∞`", why:"From the right, `x` is a tiny <strong>positive</strong> number, so `1/x` is a huge positive number. `y → -∞` happens from the left." },
            { t:"`y → 0`", why:"Try `x = 0.01`: `1/0.01 = 100`. Dividing by a tiny number gives a huge number." },
            { t:"`y` becomes 0 at `x = 0`", why:"`1/0` has no value, so `y = 1/x` is undefined at `x = 0`. That’s why `x = 0` is an asymptote." }],
          hints:["Try `x = 0.1`, 0.01 and 0.001.", "`1/0.1 = 10` and `1/0.01 = 100`. Are the values growing or shrinking? Positive or negative?", "They grow without bound and stay positive: as `x → 0^{+}`, `y → +∞`."] },
        { id:"w6", skill:"Reciprocal of a function", goal:1,
          prompt:"`f(x) = x + 5`. Which describes the reciprocal function, `1/f(x)`?",
          options:[
            { t:"`1/(x + 5)`, defined for `x ≠ -5`", ok:true, why:"Divide 1 by the whole expression. It’s undefined where `x + 5 = 0`, at `x = -5`." },
            { t:"`x - 5`, the function that undoes `f`", why:"`x - 5` is the inverse, `f^{-1}(x)`. The reciprocal is 1 ÷ `f(x)` = `1/(x + 5)`." },
            { t:"`1/x + 1/5`, defined for `x ≠ 0`", why:"`1/(x + 5)` can’t be split into `1/x + 1/5`. Try `x = 5`: `1/10 = 0.1`, but `1/5 + 1/5 = 0.4`." },
            { t:"`1/(x + 5)`, defined for `x ≠ 5`", why:"The bottom is 0 when `x + 5 = 0`, which is `x = -5`. At `x = 5` it’s `1/10`." }],
          hints:["“Reciprocal” means 1 divided by the whole thing.", "`1/f(x) = 1/(x + 5)`. When is the bottom 0?", "`x + 5 = 0` at `x = -5`, so `1/(x + 5)` is defined for `x ≠ -5`."] }
      ],
      refreshers:{
        "Lines":"A line `y = kx - c` crosses the `x`-axis at its <strong>zero</strong>, where `kx - c = 0`, so `x = c/k`. If `k > 0` the line rises: it’s negative to the left of its zero and positive to the right. If `k < 0` it falls, so the signs swap. Example: `-2x + 8 = 0` at `x = 4`, and since the slope is negative, `-2x + 8` is positive for `x < 4`.",
        "Reciprocals of numbers":"The reciprocal of `m` is `1/m`. It keeps the sign, but swaps big and small: numbers between −1 and 1 (other than 0) have reciprocals bigger than 1 in size, and numbers bigger than 1 in size have reciprocals between −1 and 1. Only 1 and −1 are their own reciprocals, and 0 has none. Example: `1/0.25 = 4` and `1/(-4) = -0.25`.",
        "<i>y</i> = 1/<i>x</i>":"`y = 1/x` is undefined at `x = 0`. As `x → 0^{+}`, `y → +∞`; as `x → 0^{-}`, `y → -∞`. As `x → ±∞`, `y → 0`. So `x = 0` is a vertical asymptote and `y = 0` is a horizontal asymptote. Example: `1/0.001 = 1000` and `1/1000 = 0.001`.",
        "Reciprocal of a function":"The reciprocal of `f(x)` is `1/f(x)`: 1 divided by the <strong>whole</strong> expression. It’s undefined wherever `f(x) = 0`. It isn’t the inverse `f^{-1}(x)`, which undoes `f`. Example: for `f(x) = 2x - 6`, `1/f(x) = 1/(2x - 6)`, defined for `x ≠ 3`, while `f^{-1}(x) = (x + 6)/2`."
      }
    }
  },
  explore:{
    heading:"Reciprocal twin",
    intro:"Drag the line and watch its reciprocal redraw. The panel lists every key feature. Turn on the probe to compare the two graphs at one `x`-value.",
    note:"Lines like `6 - 2x` fit the form too: here `k = -2` and `c = -6`. Reciprocal means 1 ÷ (the line), not the inverse `f^{-1}`. In this module, to <strong>flip</strong> a number means to take its reciprocal: flipping −4 gives −1/4, and flipping 1/2 gives 2.",
    predIntro:"Make a prediction first. Then the twin graph will show you what really happens.",
    predictions:[
      { id:"p1", start:{ k:1, z:3, hide:true },
        prompt:"The reciprocal of `y = x - 3` is about to appear. Where will it be above the `x`-axis?",
        options:[{ t:"Only where `x > 3`", ok:true }, { t:"Only where `x < 3`" }, { t:"Everywhere except `x = 3`" }, { t:"Only where `2 < x < 4`" }],
        explain:"1 divided by a positive number is positive, and 1 divided by a negative number is negative. So the reciprocal is above the `x`-axis exactly where the line is: `x > 3`. (The interval `2 < x < 4` is where the line is between −1 and 1. That’s where the reciprocal is <strong>big</strong>, not where it’s positive.)" },
      { id:"p2", start:{ k:1, z:2, guides:true },
        prompt:"The line will rotate about its zero (2, 0) until it’s 4 times as steep: `y = 4x - 8`. What happens to the two invariant points?",
        options:[{ t:"They slide toward `x = 2`", ok:true }, { t:"They stay at `x = 1` and `x = 3`" }, { t:"They slide away from `x = 2`" }, { t:"They disappear" }],
        explain:"A steeper line reaches 1 and −1 sooner: `4x - 8 = 1` at `x = 2.25`. The invariant points are always `1/|k|` from the asymptote, so with `k = 4` they’re only 0.25 away. The whole reciprocal hugs its asymptotes more tightly." },
      { id:"p3", start:{ k:-1, z:1, probe:true, p:2 },
        prompt:"The probe will slide far to the right. As `x → ∞`, what does the reciprocal of `y = -x + 1` do?",
        options:[{ t:"It gets closer and closer to 0 from below (`y → 0^{-}`)", ok:true }, { t:"It gets closer and closer to 0 from above (`y → 0^{+}`)" }, { t:"It goes down without bound (`y → -∞`)" }, { t:"It levels off at `y = -1`" }],
        explain:"The line heads down to −∞, so its reciprocal stays negative and shrinks toward 0: `y → 0^{-}`. The line’s end behaviour becomes the reciprocal’s horizontal asymptote, approached from the line’s side of the axis." },
      { id:"p4", start:{ k:1, z:2, probe:true, p:1 },
        prompt:"`y = 1/(x - 2)` is decreasing on each piece. The probe will move from `x = 1` to `x = 3`. Compare the reciprocal’s heights there.",
        options:[{ t:"The height at `x = 3` is greater", ok:true }, { t:"The height at `x = 1` is greater" }, { t:"They are equal" }, { t:"They can’t be compared, because the asymptote is between them" }],
        explain:"Each piece falls from left to right, but the graph jumps from −∞ up to +∞ across the asymptote. So `y(1) = -1` is less than `y(3) = 1`. “Decreasing” only describes each piece on its own: decreasing on `(-∞, 2)` and on `(2, ∞)`, written as two intervals." }
    ],
    chalIntro:"Set the line, then press <strong>Check challenge</strong>. The target points for the challenge you’re working on are drawn as hollow rings. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], targets:[[3, 1, "(3, 1)"]],
        prompt:"Set the line so that its reciprocal has the vertical asymptote `x = 2` and passes through (3, 1).",
        why:"`k = 1`, `c = 2`: `y = 1/(x - 2)`. It’s the only state on the grid that passes.",
        named:{
          kneg:"Right asymptote, but your curve passes (3, −1). The line must rise to 1 at `x = 3`, not fall to −1.",
          kother:"Right asymptote. At `x = 3` your curve is at `1/k` = {v}. The line must equal 1 there, one unit right of its zero.",
          z3:"You put the zero at `x = 3`. But (3, 1) is <strong>on</strong> the reciprocal, so the line must be 1 at `x = 3`, not 0.",
          zneg2:"Your asymptote is `x = -2`. The asymptote sits at the line’s zero: move the zero to `x = 2`."
        },
        general:"First put the line’s zero where the asymptote must be. Then make the line equal 1 at `x = 3`.",
        hints:["Where must the line’s zero be?", "At `x = 2`. The reciprocal passes (3, 1), and 1 is its own reciprocal, so the line passes (3, 1) too.", "A line through (2, 0) and (3, 1) rises 1 per unit, so `k = 1` and `c = 1 × 2 = 2`: `y = 1/(x - 2)`."] },
      { id:"tc2", goal:[2, 6], targets:[[0, -0.25, "(0, −1/4)"], [3, 0.5, "(3, 1/2)"]],
        prompt:"Make the reciprocal pass through both marked points, (0, −1/4) and (3, 1/2).",
        why:"`k = 2`, `c = 4` (`z = 2`): `y = 1/(2x - 4)`. It’s the only state on the grid that passes.",
        named:{
          flip:"Your curve passes (0, 1/4), not (0, −1/4). The reciprocal of −1/4 is −4, so the line must cross the `y`-axis at −4.",
          first:"The first point fits. At `x = 3` your curve is at {v}. The line must pass through (3, 2), because 2 is the reciprocal of 1/2.",
          second:"The second point fits. At `x = 0` your curve is at {v}. The line must pass through (0, −4)."
        },
        general:"The reciprocal passes through (`a`, `b`) exactly when the line passes through (`a`, `1/b`). Find the two points the line must go through.",
        hints:["Flip each target’s `y`-value. Which two points must the <strong>line</strong> pass through?", "(0, −4) and (3, 2). What’s the slope of the line through them?", "Slope = `(2 - (-4))/3 = 2`, and the line crosses the `y`-axis at −4: `y = 2x - 4`. So `k = 2`, `c = 4`, and the zero is at `x = 2`."] },
      { id:"tc3", goal:[2, 6], stretch:true, targets:[[0, 0.5, "(0, 1/2)"]],
        prompt:"Make a reciprocal that has <strong>all three</strong> of these properties: it is increasing on each piece; its two invariant points are 4 units apart; and it passes through (0, 1/2).",
        why:"`k = -0.5`, `c = -2` (`z = 4`): `y = 1/(-0.5x + 2)`. It’s the only state on the grid that passes.",
        named:{
          kpos:"Two out of three: your invariant points are 4 apart and the curve passes (0, 1/2). But your line rises, so its reciprocal <strong>falls</strong> on each piece. Make `k` negative.",
          spacing:"Increasing, and through (0, 1/2). But your invariant points are `2/|k|` = {v} apart. Between them the line changes from 1 to −1, a change of 2. Over 4 units, the slope must have size 2/4.",
          yint:"Increasing, with invariant points 4 apart. But your curve crosses the `y`-axis at {v}. The line must cross it at 2, because 2 is the reciprocal of 1/2.",
          zero0:"Increasing, with invariant points 4 apart. But your asymptote is the `y`-axis, so the curve never reaches `x = 0`. The line must cross the `y`-axis at 2, because 2 is the reciprocal of 1/2: slide the zero to the right."
        },
        general:"Take the conditions one at a time: the direction decides the sign of `k`, the spacing decides the size of `k`, and the point decides `c`.",
        hints:["An increasing reciprocal comes from a falling line. What sign must `k` have?", "Between the two invariant points, the line goes from 1 to −1: a change of 2 over 4 units. So `k = -2/4 = -1/2`.", "The curve passes (0, 1/2), so the line passes (0, 2): `-c = 2`, so `c = -2`. The line is `y = -0.5x + 2` and the reciprocal is `y = 1/(-0.5x + 2)`, with its asymptote at `x = 4`."] }
    ]
  },
  part3:{
    slug:"asymptote", name:"Near the asymptote",
    heading:"Closing in: the four arrows",
    intro:"Every reciprocal of a line has four arrows: two beside its vertical asymptote and two at its ends. Decide the line’s sign on each side, predict the four arrows, then close in and check.",
    cards:[
      { id:"c1", eq:"`y = 1/(2x - 6)`", eqs:"`y = {1}/{2x - 6}`", line:"`2x - 6`", k:2, c:6, a:3,
        tl:{ x:"2.9", calc:"`2(2.9) - 6 = -0.2`", v:"−0.2" }, tr:{ x:"3.1", calc:"`2(3.1) - 6 = 0.2`", v:"0.2" } },
      { id:"c2", eq:"`y = 1/(-3x - 3)`", eqs:"`y = {1}/{-3x - 3}`", line:"`-3x - 3`", k:-3, c:3, a:-1,
        tl:{ x:"−1.1", calc:"`-3(-1.1) - 3 = 0.3`", v:"0.3" }, tr:{ x:"−0.9", calc:"`-3(-0.9) - 3 = -0.3`", v:"−0.3" } },
      { id:"c3", eq:"`y = 1/(x + 4)`", eqs:"`y = {1}/{x + 4}`", line:"`x + 4`", k:1, c:-4, a:-4,
        tl:{ x:"−4.1", calc:"`-4.1 + 4 = -0.1`", v:"−0.1" }, tr:{ x:"−3.9", calc:"`-3.9 + 4 = 0.1`", v:"0.1" } },
      { id:"c4", eq:"`y = 1/(4 - 2x)`", eqs:"`y = {1}/{4 - 2x}`", line:"`4 - 2x`", k:-2, c:-4, a:2,
        tl:{ x:"1.9", calc:"`4 - 2(1.9) = 0.2`", v:"0.2" }, tr:{ x:"2.1", calc:"`4 - 2(2.1) = -0.2`", v:"−0.2" } }
    ],
    fb:{
      sign:"Test a value: at {xeq}, {calc}, which is {sgn}.",
      near:"Just {side} of {a}, the line is a tiny {sgn} number (at {xeq} it’s {v}). 1 ÷ (tiny {sgn}) is a huge {sgn} number, so {arrow}.",
      end:"Far to the {side}, the line is huge and {sgn} (at {xeq} it’s {v}). 1 ÷ (huge {sgn}) is a tiny {sgn} number, so {arrow}.",
      fix:"Fix it and check again.",
      done:"All four arrows match the sign of the line. Next card, or open the algebra panel to see why it always works.",
      rm:"Each row is 10 times closer than the one before, and each `y`-value is 10 times bigger.",
      live:"Card {n}: {k}, {a}. At {h}, {calc}, matching the table."
    },
    alg:"<p>Let `a = c/k` be the asymptote, and write any `x` as `x = a + h`. Here `h` is the distance from the asymptote: positive on the right, negative on the left.</p>" +
      "<p>`kx - c = k(a + h) - c = (ka - c) + kh = kh`, because `ka = c`.</p>" +
      "<p>So the reciprocal is exactly <strong>`y = 1/(kh)`</strong>.</p>" +
      "<ul><li><strong>Sign:</strong> on the right (`h > 0`), `y` has the sign of `k`; on the left (`h < 0`), the opposite sign.</li>" +
      "<li><strong>Size near the asymptote:</strong> `h` is tiny, so `1/(kh)` is huge: `y → ±∞`.</li>" +
      "<li><strong>Size at the ends:</strong> `h` is huge, so `1/(kh)` is tiny: `y → 0`, from the same side as before.</li></ul>" +
      "<div class=\"tbl-wrap\"><table class=\"vt\"><thead><tr><th scope=\"col\"><span class=\"vh\">Sign of k</span></th><th scope=\"col\">`x → a^{-}`</th><th scope=\"col\">`x → a^{+}`</th><th scope=\"col\">`x → -∞`</th><th scope=\"col\">`x → ∞`</th></tr></thead><tbody>" +
      "<tr><th scope=\"row\">`k > 0`</th><td>`y → -∞`</td><td>`y → +∞`</td><td>`y → 0^{-}`</td><td>`y → 0^{+}`</td></tr>" +
      "<tr><th scope=\"row\">`k < 0`</th><td>`y → +∞`</td><td>`y → -∞`</td><td>`y → 0^{+}`</td><td>`y → 0^{-}`</td></tr></tbody></table></div>" +
      "<p><strong>A bonus fact:</strong> for every point on the graph, `|h| × |y| = |h| × 1/|kh| = 1/|k|`. The distance to the vertical asymptote times the distance to the horizontal asymptote is the same everywhere on the curve. A bigger `|k|` makes that product smaller, which is why a steeper line gives a reciprocal that hugs its asymptotes (prediction 2 in Explore).</p>",
    blocks:[{ title:"What the arrows mean", html:"<p><strong>Sketching `y = 1/(kx - c)` in four moves</strong></p><ol><li>Draw the asymptotes: `x = c/k` and `y = 0`.</li><li>Mark the invariant points, where the line is 1 and −1, and the `y`-intercept (0, `-1/c`), if `c ≠ 0`.</li><li>Decide the four arrows from the line’s sign on each side.</li><li>Join each piece smoothly: it runs along the vertical asymptote at one end and flattens toward `y = 0` at the other, never crossing either.</li></ol>" }],
    quickCheck:{
      title:"Which way does it go?", summary:"Which way does it go?",
      items:[
        { id:"q1", goal:3, prompt:"`y = 1/(3x - 6)`. As `x → 2^{+}`, `y →` ?",
          choices:CHIPS("`+∞`", "Right. Just right of 2, the line `3x - 6` is a tiny positive number (at 2.1 it’s 0.3), so its reciprocal is huge and positive.",
            "Test `x = 2.1`: `3(2.1) - 6 = 0.3`, a small positive number. 1 ÷ 0.3 ≈ 3.3, and closer to 2 it grows without bound. Beside the asymptote the answer is ±∞, not 0.") },
        { id:"q2", goal:3, prompt:"`y = 1/(8 - 2x)`. As `x → 4^{+}`, `y →` ?",
          choices:CHIPS("`-∞`", "Right. Just right of 4, `8 - 2x` is a tiny negative number (at 4.1 it’s −0.2), so `y → -∞`.",
            "The line `8 - 2x` falls, so it’s negative to the right of its zero. Test `x = 4.1`: `8 - 8.2 = -0.2`, and 1 ÷ (−0.2) = −5. Closer in, `y → -∞`.") },
        { id:"q3", goal:3, prompt:"`y = 1/(5 - x)`. As `x → -∞`, `y →` ?",
          choices:CHIPS("`0^{+}`", "Right. Far to the left, `5 - x` is huge and positive (at `x = -100` it’s 105), so `y` is a tiny positive number.",
            "At the ends a reciprocal flattens toward 0, so the answer is `0^{+}` or `0^{-}`. Test `x = -100`: `5 - (-100) = 105`, positive, so `y = 1/105` is just above 0.") },
        { id:"q4", goal:3, prompt:"`y = 1/(-2x - 5)`. As `x → -2.5^{-}`, `y →` ?",
          choices:CHIPS("`+∞`", "Right. Just left of −2.5, `-2x - 5` is a tiny positive number (at −2.6 it’s 0.2), so `y → +∞`. The `x`-values are negative, but only the line’s sign matters.",
            "Test `x = -2.6`: `-2(-2.6) - 5 = 5.2 - 5 = 0.2`, a small positive number, and 1 ÷ 0.2 = 5. Closer to −2.5 the values head to +∞. The sign of `x` doesn’t decide it; the sign of the line does. Beside the asymptote the answer is ±∞, not 0.") }
      ]
    }
  },
  practice:{
    activities:[
      { id:"twin", type:"custom", title:"Line meets its twin", summary:"Line meets its twin", goal:[5, 1, 2, 4],
        instruction:"Match each line to the graph of its reciprocal.",
        how:"Tap a line, then tap the reciprocal graph that belongs to it.",
        left:[
          { id:"l1", name:"L1", eq:"`y = x - 2`", k:1, c:2,
            hints:[WB_H1, WB_FALL3, "The line is 1 at `x = 3` and −1 at `x = 1`, so its reciprocal passes (3, 1) and (1, −1). That’s R5."] },
          { id:"l2", name:"L2", eq:"`y = -x + 2`", k:-1, c:-2,
            hints:[L_RISE, "Zero at `x = 2`; the line falls, so the reciprocal rises on each piece. R3 and R6 both do that.", "`-x + 2 = 1` at `x = 1`, so the reciprocal passes (1, 1), a whole unit from the asymptote. That’s R3. (R6 passes (1.5, 1): that’s the reciprocal of `-2x + 4`.)"] },
          { id:"l3", name:"L3", eq:"`y = 2x - 4`", k:2, c:4,
            hints:[WB_H1, WB_FALL3, "The line is 1 at `x = 2.5` and −1 at `x = 1.5`, so its reciprocal passes (2.5, 1) and (1.5, −1). That’s R7."] },
          { id:"l4", name:"L4", eq:"`y = x + 2`", k:1, c:-2,
            hints:[WB_H1, "`x = -2`. The line rises, so its reciprocal falls on each piece. Two graphs have the asymptote `x = -2`; which one falls?", "The line is 1 at `x = -1` and −1 at `x = -3`, so its reciprocal passes (−1, 1) and (−3, −1). That’s R1."] },
          { id:"l5", name:"L5", eq:"`y = -x - 2`", k:-1, c:2,
            hints:[L_RISE, "Zero at `x = -2`; the line falls, so the reciprocal rises on each piece. Only one graph with the asymptote `x = -2` does that.", "`-x - 2 = 1` at `x = -3` and `-x - 2 = -1` at `x = -1`, so the reciprocal passes (−3, 1) and (−1, −1). That’s R8."] },
          { id:"l6", name:"L6", eq:"`y = 0.5x - 1`", k:0.5, c:1,
            hints:[WB_H1, WB_FALL3, "The line is 1 at `x = 4` and −1 at `x = 0`, so its reciprocal passes (4, 1) and (0, −1), two units from the asymptote. That’s R2."] },
          { id:"l7", name:"L7", eq:"`y = -2x + 4`", k:-2, c:-4,
            hints:[L_RISE, "Zero at `x = 2`; the line falls, so the reciprocal rises on each piece. R3 and R6 both do that.", "`-2x + 4 = 1` at `x = 1.5`, so the reciprocal passes (1.5, 1), only half a unit from the asymptote. That’s R6. (R3 passes (1, 1): that’s the reciprocal of `-x + 2`.)"] },
          { id:"l8", name:"L8", eq:"`y = x`", k:1, c:0,
            hints:[WB_H1, "`x = 0`, so the asymptote is the `y`-axis. The line rises, so its reciprocal falls on each piece.", "The line is 1 at `x = 1` and −1 at `x = -1`, so its reciprocal passes (1, 1) and (−1, −1), with no `y`-intercept. That’s R4."] }
        ],
        right:[
          { id:"r1", name:"R1", eq:"`y = 1/(x + 2)`", k:1, c:-2, desc:"Asymptote `x = -2`; falls on each piece; passes (−3, −1), (−1, 1) and (0, 1/2)" },
          { id:"r2", name:"R2", eq:"`y = 1/(0.5x - 1)`", k:0.5, c:1, desc:"Asymptote `x = 2`; falls on each piece; passes (0, −1) and (4, 1)" },
          { id:"r3", name:"R3", eq:"`y = 1/(-x + 2)`", k:-1, c:-2, desc:"Asymptote `x = 2`; rises on each piece; passes (1, 1), (3, −1) and (0, 1/2)" },
          { id:"r4", name:"R4", eq:"`y = 1/x`", k:1, c:0, desc:"Asymptotes `x = 0` and `y = 0`; falls on each piece; passes (−1, −1) and (1, 1); no `y`-intercept" },
          { id:"r5", name:"R5", eq:"`y = 1/(x - 2)`", k:1, c:2, desc:"Asymptote `x = 2`; falls on each piece; passes (1, −1), (3, 1) and (0, −1/2)" },
          { id:"r6", name:"R6", eq:"`y = 1/(-2x + 4)`", k:-2, c:-4, desc:"Asymptote `x = 2`; rises on each piece; passes (1.5, 1), (2.5, −1) and (0, 1/4)" },
          { id:"r7", name:"R7", eq:"`y = 1/(2x - 4)`", k:2, c:4, desc:"Asymptote `x = 2`; falls on each piece; passes (1.5, −1), (2.5, 1) and (0, −1/4)" },
          { id:"r8", name:"R8", eq:"`y = 1/(-x - 2)`", k:-1, c:2, desc:"Asymptote `x = -2`; rises on each piece; passes (−3, 1), (−1, −1) and (0, −1/2)" }
        ],
        answer:{ l1:"r5", l2:"r3", l3:"r7", l4:"r1", l5:"r8", l6:"r2", l7:"r6", l8:"r4" },
        fb:{
          asym:"This graph’s asymptote is {a2}, but your line crosses the `x`-axis at {z1}. The line’s zero becomes the asymptote.",
          dir:"Same asymptote, but this graph {d2} on each piece. Your line {d1}, so its reciprocal does the opposite.",
          steep:"Same asymptote and direction. Check where your line equals 1: at {x1}. Its reciprocal must pass through ({x1v}, 1) too, and this graph passes ({x2v}, 1).",
          tail:"Try another graph."
        } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Kwame", how:"", goal:[2, 3, 4],
        instruction:"Kwame made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the asymptotes, intercepts and invariant points of `y = 1/(2x - 8)`.",
            steps:["`2x - 8 = 0` when `x = 4`, so the vertical asymptote is `x = 4`.", "The horizontal asymptote is `y = 0`.", "The `y`-intercept is 1/8, because the line’s `y`-intercept is 8.", "Invariant points: `2x - 8 = 1` gives (4.5, 1), and `2x - 8 = -1` gives (3.5, −1).", "There’s no `x`-intercept, because 1 divided by a number is never 0."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: far out, the line is huge, so its reciprocal is close to 0.", "", "Step 4 is correct. The mistake is earlier.", "Step 5 is correct. The mistake is earlier."],
            fixes:[
              { t:"At `x = 0` the line is `2(0) - 8 = -8`, so the `y`-intercept is `1/(-8) = -1/8`.", ok:true, why:"The line crosses the `y`-axis at −8, and its reciprocal keeps the sign: −1/8." },
              { t:"At `x = 0` the line is −8, so the `y`-intercept is −8.", why:"−8 is the <strong>line’s</strong> `y`-intercept. The reciprocal’s is 1 ÷ (−8)." },
              { t:"There is no `y`-intercept, because a reciprocal graph never crosses an axis.", why:"It never crosses the `x`-axis, but it does cross the `y`-axis whenever `x = 0` is in the domain: here at (0, −1/8)." },
              { t:"Step 3 is correct as written.", why:"Substitute `x = 0`: `2(0) - 8 = -8`, not 8. The sign carries through to the reciprocal." }],
            hints:["Check each step by substituting a number.", "In step 3, what is `2x - 8` when `x = 0`?", "Step 3 is wrong: the line is −8 at `x = 0`, so the `y`-intercept is `1/(-8) = -1/8`."] },
          { id:"e2", goal:3, task:"Describe the behaviour of `y = 1/(10 - 2x)` near its vertical asymptote.",
            steps:["`10 - 2x = 0` when `x = 5`, so the vertical asymptote is `x = 5`.", "To the right of 5, `x` is positive, so `y` is positive: as `x → 5^{+}`, `y → +∞`.", "On the left the sign switches, so as `x → 5^{-}`, `y → -∞`.", "Far away on either side, `y` gets close to 0."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 builds on step 2’s sign. The mistake is earlier.", "Step 4 is true. The mistake is earlier."],
            fixes:[
              { t:"Test a value: at `x = 5.1`, `10 - 2x = -0.2`, so `y = -5`. As `x → 5^{+}`, `y → -∞` (and as `x → 5^{-}`, `y → +∞`).", ok:true, why:"The sign comes from the line, not from `x`. This line falls, so it’s negative to the right of its zero." },
              { t:"At `x = 5.1`, `10 - 2x = -0.2`, so `y = -0.2`, and `y → 0` as `x → 5^{+}`.", why:"−0.2 is the line’s value. The reciprocal is 1 ÷ (−0.2) = −5, and it grows in size as `x` gets closer to 5." },
              { t:"The line `10 - 2x` falls, so `y → -∞` on both sides of `x = 5`.", why:"The line changes sign at its zero, so its reciprocal heads in opposite directions on the two sides." },
              { t:"Step 2 is correct as written: `x = 5.1` is positive, so `y` is positive.", why:"The sign of `x` doesn’t matter. The sign of `10 - 2x` does, and at `x = 5.1` that’s −0.2." }],
            hints:["In step 2, what decides the sign of `y`: the sign of `x`, or the sign of `10 - 2x`?", "Substitute `x = 5.1` into `10 - 2x`.", "`10 - 2(5.1) = -0.2`, so `y = 1/(-0.2) = -5`. Step 2 is wrong: as `x → 5^{+}`, `y → -∞`."] },
          { id:"e3", goal:4, task:"State where `y = 1/(x + 1)` is increasing or decreasing, and find its invariant points.",
            steps:["The line `y = x + 1` has slope 1, so it is increasing.", "The reciprocal of an increasing line is also increasing.", "So `y = 1/(x + 1)` is increasing on `(-∞, -1)` and on `(-1, ∞)`.", "Invariant points: `x + 1 = 1` gives (0, 1), and `x + 1 = -1` gives (−2, −1)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 is correct. The mistake is earlier."],
            fixes:[
              { t:"As the line’s values grow, their reciprocals shrink, so `y = 1/(x + 1)` is decreasing on `(-∞, -1)` and on `(-1, ∞)`.", ok:true, why:"For example, on the right piece the line goes 1, 2, 3 and the reciprocal goes 1, 1/2, 1/3: falling." },
              { t:"The reciprocal is decreasing on `(-∞, ∞)`.", why:"`x = -1` isn’t in the domain, and across the asymptote the graph jumps up. State each piece separately." },
              { t:"The reciprocal is increasing on `(-∞, -1)` and decreasing on `(-1, ∞)`.", why:"Both pieces fall. Check the left piece: at `x = -3` the line is −2 (reciprocal −1/2), and at `x = -2` it’s −1 (reciprocal −1): falling." },
              { t:"Step 2 is correct: reciprocals keep the direction of the line.", why:"Try 2 and 4: 2 < 4, but 1/2 > 1/4. Taking reciprocals reverses the order of numbers with the same sign." }],
            hints:["Test step 2 with numbers: as the line goes 1, 2, 3, what do the reciprocals do?", "1, 1/2, 1/3: they shrink. So does the reciprocal rise or fall?", "Step 2 is wrong. A rising line gives a falling reciprocal: decreasing on `(-∞, -1)` and on `(-1, ∞)`."] }
        ] },
      { id:"backwards", type:"custom", title:"Work backwards", summary:"Work backwards", star:true, goal:[6, 1, 2, 3, 4],
        instruction:"Find `k` and `c` so that `y = 1/(kx - c)` matches every clue.",
        how:"Type `k` and `c` (whole numbers, decimals or fractions such as −1/2), then press Check. After each check, the preview draws your function with the clues marked as hollow rings.",
        kzero:"A line with `k = 0` is horizontal, so it has no zero.",
        empty:"Enter a number in each box, such as −2, 3 or 1/2.",
        fallback:"Your function has asymptote {xa} and `y`-intercept {v}. Check the clues one at a time against the preview.",
        fallback0:"Your function has asymptote `x = 0`, so it has no `y`-intercept. Check the clues one at a time against the preview.",
        items:[
          { id:"wb1", goal:[6, 1, 2], clue:"Vertical asymptote `x = 3`; `y`-intercept (0, −1/6)", answer:{ k:2, c:6 },
            rings:[[0, -1 / 6, "(0, −1/6)"]], va:3,
            wrong:[{ k:-2, c:-6, fb:"Your `y`-intercept is `1/(-(-6)) = +1/6`. The `y`-intercept is `1/(-c)`, so `-c = -6` and `c = 6`." },
              { k:18, c:6, fb:"Your asymptote is at `c/k = 1/3`. The asymptote is `c` ÷ `k`, so `k = 6 ÷ 3 = 2`." }],
            hints:["The `y`-intercept is `1/(-c)`. What must `c` be?", "`1/(-c) = -1/6` means `-c = -6`, so `c = 6`. The asymptote is `x = c/k`.", "`6/k = 3`, so `k = 2`: `y = 1/(2x - 6)`."] },
          { id:"wb2", goal:[6, 1], clue:"Vertical asymptote `x = -2`; passes through (−1, 1/3)", answer:{ k:3, c:-6 },
            rings:[[-1, 1 / 3, "(−1, 1/3)"]], va:-2,
            wrong:[{ k:1 / 3, c:-2 / 3, fb:"Your line equals 1/3 at `x = -1`, so the reciprocal there is 3. The <strong>reciprocal</strong> must be 1/3, so the line must be 3." },
              { k:3, c:6, fb:"Your asymptote is `x = 6/3 = 2`. You need `c/k = -2`." }],
            hints:["If the reciprocal is 1/3 at `x = -1`, what is the line there?", "The line is 3 at `x = -1` and 0 at `x = -2`. What’s its slope?", "It rises 3 over 1 unit: `k = 3`. Then `c = k × (-2) = -6`: `y = 1/(3x + 6)`."] },
          { id:"wb3", goal:[6, 2], clue:"Passes through (1, 1/2) and (4, −1)", answer:{ k:-1, c:-3 },
            rings:[[1, 0.5, "(1, 1/2)"], [4, -1, "(4, −1)"]],
            wrong:[{ k:-0.5, c:-1, fb:"Your line passes (1, 1/2). The reciprocal passes (1, 1/2), so the line passes (1, 2)." },
              { k:-1, c:3, fb:"Your line is `-x - 3`, which crosses the `y`-axis at −3. Check the sign of `c`." }],
            hints:["Flip both `y`-values. Which two points does the <strong>line</strong> pass through?", "(1, 2) and (4, −1). Slope = `(-1 - 2)/(4 - 1)`.", "Slope −1, and the line is `y = -x + 3` (check: −1 + 3 = 2). So `k = -1` and `c = -3`."] },
          { id:"wb4", goal:[6, 2], clue:"Invariant points (2, −1) and (6, 1)", answer:{ k:0.5, c:2 },
            rings:[[2, -1, "(2, −1)"], [6, 1, "(6, 1)"]],
            wrong:[{ k:2, c:8, fb:"Your invariant points are at `x = 3.5` and 4.5. Slope is rise over run: the line rises 2 over 4 units, so `k = 2/4`." },
              { k:0.5, c:-2, fb:"Your line `0.5x + 2` has its zero at −4. The asymptote is halfway between the invariant points, at `x = 4`." }],
            hints:["Invariant points are on the line too. Which line passes through (2, −1) and (6, 1)?", "Its slope is 2/4 = 1/2, and its zero is halfway between them, at `x = 4`.", "`k = 1/2` and `c = k × 4 = 2`: `y = 1/(0.5x - 2)`."] },
          { id:"wb5", goal:[6, 2], clue:"`y`-intercept (0, 1/4); passes through (2, −1/2)", answer:{ k:-3, c:-4 },
            rings:[[0, 0.25, "(0, 1/4)"], [2, -0.5, "(2, −1/2)"]],
            wrong:[{ k:1, c:4, fb:"Your `y`-intercept is −1/4. For +1/4 the line must cross at +4, so `-c = 4` and `c = -4`." },
              { k:-3 / 8, c:-1 / 4, fb:"Your line passes (0, 1/4) and (2, −1/2), the target points themselves. Flip them: the line passes (0, 4) and (2, −2)." }],
            hints:["The `y`-intercept 1/4 tells you the line’s `y`-intercept. What is it?", "The line passes (0, 4) and, flipping −1/2, (2, −2).", "Slope = `(-2 - 4)/2 = -3`, and `-c = 4`: `k = -3`, `c = -4`. `y = 1/(-3x + 4)`."] },
          { id:"wb6", goal:[6, 4, 5], clue:"The graph is below `y = -1` for `1.5 < x < 2` and nowhere else; the graph is increasing on each piece", answer:{ k:-2, c:-3 },
            rings:[], shade:[1.5, 2], guide:-1,
            wrong:[{ k:2, c:4, fb:"Your graph is below −1 on exactly (1.5, 2) too, but your line rises, so its reciprocal is decreasing. An increasing reciprocal needs a falling line, and a falling line is negative to the <strong>right</strong> of its zero, so the zero must be at 1.5." },
              { k:-1, c:-1.5, fb:"Your graph is below −1 on (1.5, 2.5): your line takes a whole unit to fall from 0 to −1. It must get there in half a unit, so `|k| = 1 ÷ 0.5 = 2`." },
              { k:-2, c:-4, fb:"Your graph is below −1 on (2, 2.5). A falling line is negative to the right of its zero, so the zero sits at the <strong>left</strong> end of the interval, `x = 1.5`." }],
            hints:["Where is a reciprocal less than −1? Think about what the line must be doing there.", "1 ÷ (line) < −1 exactly where −1 < line < 0. So on (1.5, 2) the line is between −1 and 0: its zero is at one end of the interval and the point where it equals −1 is at the other. An increasing reciprocal comes from a falling line. Which end is the zero?", "A falling line is negative to the right of its zero, so the zero is at `x = 1.5` and the line is −1 at `x = 2`. It falls 1 over half a unit: `k = -2`, and `c = k × 1.5 = -3`. So `y = 1/(-2x + 3)`. Check `x = 1.75`: the line is −0.5, so `y = -2`, which is below −1."] },
          { id:"wb7", goal:[6, 3], stretch:true, clue:"For every point on the graph, (distance to the vertical asymptote) × (distance to the horizontal asymptote) = 1/4. The vertical asymptote is `x = 2`, and the graph is increasing on each piece.", answer:{ k:-4, c:-8 },
            rings:[], va:2, product:true,
            wrong:[{ k:-0.25, c:-0.5, fb:"Your product is `1/|k| = 4`, not 1/4. The product is `1/|k|`, so `|k| = 4`." },
              { k:4, c:8, fb:"The product and asymptote are right, but your reciprocal falls on each piece. Make `k` negative." }],
            hints:["Look back at Part 3’s algebra panel: the product of the two distances is the same for every point. What is it, in terms of `k`?", "It’s `1/|k|`. So `1/|k| = 1/4`. Increasing means `k < 0`.", "`k = -4`, and `c = k × 2 = -8`: `y = 1/(-4x + 8)`. Check with `h = 1`: `y = 1/(-4)`, and 1 × 1/4 = 1/4."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you dragged the line in the Reciprocal twin? Describe one change to the line and what it did to the reciprocal." },
      { id:"j2", q:"In your own words, explain why the line’s zero becomes a vertical asymptote, and why the reciprocal never touches the `x`-axis. How is `1/f(x)` different from `f^{-1}(x)`?" },
      { id:"j3", q:"Explain to a friend, without a graph, how to decide what `y = 1/(5 - x)` does just to the left and just to the right of its vertical asymptote." },
      { id:"j4", q:"Which feature are you least sure of: asymptotes, intercepts, invariant points, the four arrows, or increasing/decreasing? What will you do to make it solid before module 19?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the vertical asymptote of `y = 1/(4x - 12)`?", options:[
          { t:"`x = 3`", ok:true, why:"The line `4x - 12` is 0 when `x = 12/4 = 3`, so the reciprocal is undefined there." },
          { t:"`x = 12`", why:"12 is `c`. The asymptote is where the line is 0: `c` ÷ `k` = 12 ÷ 4 = 3." },
          { t:"`x = -3`", why:"A sign slip: `4x - 12 = 0` gives `4x = +12`." },
          { t:"`x = 1/3`", why:"That’s `k` ÷ `c` = 4/12. Divide the other way: 12/4 = 3." }] },
        b:{ prompt:"What is the vertical asymptote of `y = 1/(5x + 10)`?", options:[
          { t:"`x = -2`", ok:true, why:"`5x + 10 = 0` when `x = -10/5 = -2`." },
          { t:"`x = -10`", why:"−10 is the solution of `x + 10 = 0`. Divide by 5 as well." },
          { t:"`x = 2`", why:"A sign slip: `5x + 10 = 0` gives `5x = -10`." },
          { t:"`x = -1/2`", why:"That’s 5 ÷ (−10). Divide the other way: −10 ÷ 5 = −2." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the `y`-intercept of `y = 1/(3x - 6)`?", options:[
          { t:"(0, −1/6)", ok:true, why:"At `x = 0` the line is `3(0) - 6 = -6`, so `y = 1/(-6) = -1/6`." },
          { t:"(0, 1/6)", why:"The line is −6 at `x = 0`, not 6. The reciprocal keeps the negative sign." },
          { t:"(0, −6)", why:"−6 is the line’s `y`-intercept. Take its reciprocal." },
          { t:"There is no `y`-intercept.", why:"The graph never crosses the `x`-axis, but `x = 0` is in the domain here, so it does cross the `y`-axis." }] },
        b:{ prompt:"What is the `y`-intercept of `y = 1/(2x + 8)`?", options:[
          { t:"(0, 1/8)", ok:true, why:"At `x = 0` the line is 8, so `y = 1/8`." },
          { t:"(0, −1/8)", why:"The line is +8 at `x = 0`." },
          { t:"(0, 8)", why:"8 is the line’s `y`-intercept. Take its reciprocal." },
          { t:"There is no `y`-intercept.", why:"`x = 0` is in the domain, so the graph crosses the `y`-axis." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which gives the domain and range of `y = 1/(2x - 5)`?", options:[
          { t:"Domain `{x ∈ ℝ | x ≠ 5/2}`; range `{y ∈ ℝ | y ≠ 0}`", ok:true, why:"The line is 0 at `x = 5/2`, and a reciprocal can never equal 0." },
          { t:"Domain `{x ∈ ℝ | x ≠ 5/2}`; range `{y ∈ ℝ | y ≠ 5/2}`", why:"The range is missing the horizontal asymptote’s value, 0, not the vertical asymptote’s." },
          { t:"Domain `{x ∈ ℝ | x ≠ 5}`; range `{y ∈ ℝ | y ≠ 0}`", why:"`2x - 5 = 0` at `x = 5/2`, not 5." },
          { t:"Domain `{x ∈ ℝ | x ≠ 0}`; range `{y ∈ ℝ | y ≠ 0}`", why:"That’s the domain of `1/x`. This line is 0 at `x = 5/2`, so that’s the value to exclude." }] },
        b:{ prompt:"Which gives the domain and range of `y = 1/(3x + 4)`?", options:[
          { t:"Domain `{x ∈ ℝ | x ≠ -4/3}`; range `{y ∈ ℝ | y ≠ 0}`", ok:true, why:"`3x + 4 = 0` at `x = -4/3`, and the reciprocal is never 0." },
          { t:"Domain `{x ∈ ℝ | x ≠ -4/3}`; range `{y ∈ ℝ | y ≠ -4/3}`", why:"The range excludes 0, the horizontal asymptote." },
          { t:"Domain `{x ∈ ℝ | x ≠ -4}`; range `{y ∈ ℝ | y ≠ 0}`", why:"Divide by 3 as well: `x = -4/3`." },
          { t:"Domain `{x ∈ ℝ | x ≠ 0}`; range `{y ∈ ℝ | y ≠ 0}`", why:"That’s `1/x`. Exclude the zero of `3x + 4`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Which describes the behaviour of `y = 1/(6 - 2x)` near its vertical asymptote?", options:[
          { t:"As `x → 3^{-}`, `y → +∞`; as `x → 3^{+}`, `y → -∞`", ok:true, why:"The asymptote is `x = 3`. At 2.9 the line is 0.2 (positive), and at 3.1 it’s −0.2 (negative), so the reciprocal goes up on the left and down on the right." },
          { t:"As `x → 3^{-}`, `y → -∞`; as `x → 3^{+}`, `y → +∞`", why:"That’s the pattern for a rising line, like `1/(x - 3)`. This line falls, so the signs swap." },
          { t:"As `x → 3^{-}`, `y → +∞`; as `x → 3^{+}`, `y → +∞`", why:"The line changes sign at its zero, so the two sides go opposite ways." },
          { t:"As `x → 6^{-}`, `y → +∞`; as `x → 6^{+}`, `y → -∞`", why:"`6 - 2x = 0` at `x = 3`, not 6." }] },
        b:{ prompt:"Which describes the behaviour of `y = 1/(-2x - 4)` near its vertical asymptote?", options:[
          { t:"As `x → -2^{-}`, `y → +∞`; as `x → -2^{+}`, `y → -∞`", ok:true, why:"At −2.1 the line is 0.2, and at −1.9 it’s −0.2." },
          { t:"As `x → -2^{-}`, `y → -∞`; as `x → -2^{+}`, `y → +∞`", why:"That’s the pattern for a rising line. This one falls." },
          { t:"As `x → -2^{-}`, `y → -∞`; as `x → -2^{+}`, `y → -∞`", why:"The line changes sign at its zero, so the two sides go opposite ways." },
          { t:"As `x → -4^{-}`, `y → +∞`; as `x → -4^{+}`, `y → -∞`", why:"−4 is the line’s constant term. `-2x - 4 = 0` at `x = -2`: divide by −2 as well." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`f(x) = 1/(2x - 6)` is decreasing on `(-∞, 3)` and on `(3, ∞)`. Which of these values is greatest: `f(0)`, `f(2.5)`, `f(3.5)` or `f(10)`?", options:[
          { t:"`f(3.5)`", ok:true, why:"Only the right piece is above the `x`-axis, so the greatest value is there. On that piece `f` decreases, so the point nearer the asymptote is higher: `f(3.5) = 1/1 = 1`, while `f(10) = 1/14`." },
          { t:"`f(0)`", why:"“Decreasing” applies to each piece separately, not across the asymptote. `f(0) = 1/(-6) = -1/6` is on the left piece, which lies entirely below the `x`-axis." },
          { t:"`f(10)`", why:"The line `2x - 6` is biggest at `x = 10`, so its reciprocal there is small: 1/14. A big line value gives a small reciprocal." },
          { t:"`f(2.5)`", why:"It’s just as close to the asymptote as 3.5, but on the left side, where the reciprocal is negative: `f(2.5) = 1/(-1) = -1`." }] },
        b:{ prompt:"`g(x) = 1/(4 - x)` is increasing on `(-∞, 4)` and on `(4, ∞)`. Which of these values is greatest: `g(0)`, `g(3.5)`, `g(4.5)` or `g(10)`?", options:[
          { t:"`g(3.5)`", ok:true, why:"Only the left piece is above the `x`-axis, because the line `4 - x` is positive there. On that piece `g` increases toward the asymptote: `g(3.5) = 1/0.5 = 2`, while `g(0) = 1/4`." },
          { t:"`g(10)`", why:"“Increasing” applies to each piece separately, not across the asymptote. `g(10) = 1/(-6) = -1/6` is on the right piece, which lies entirely below the `x`-axis." },
          { t:"`g(0)`", why:"The line `4 - x` falls, but its reciprocal rises on each piece. `g(0) = 1/4` is less than `g(3.5) = 2`." },
          { t:"`g(4.5)`", why:"It’s just as close to the asymptote as 3.5, but on the right side, where the reciprocal is negative: `g(4.5) = 1/(-0.5) = -2`." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"The graph of `y = 1/(kx - c)` has vertical asymptote `x = 4` and passes through (6, 1/6). What are `k` and `c`?", options:[
          { t:"`k = 3`, `c = 12`", ok:true, why:"The line is 6 at `x = 6` (the reciprocal of 1/6) and 0 at `x = 4`, so it rises 6 over 2 units: `k = 3`, and `c = 3 × 4 = 12`. Check: `3(6) - 12 = 6`." },
          { t:"`k = 1/12`, `c = 1/3`", why:"That line equals 1/6 at `x = 6`, so its reciprocal there is 6. The <strong>reciprocal</strong> must be 1/6, so the line must be 6." },
          { t:"`k = 3`, `c = -12`", why:"`1/(3x + 12)` has its asymptote at `x = -4`." },
          { t:"`k = 6`, `c = 24`", why:"`1/(6x - 24)` has the right asymptote, but at `x = 6` it’s 1/12, not 1/6. The line rises 6 over <strong>2</strong> units, so `k = 6 ÷ 2 = 3`." }] },
        b:{ prompt:"The graph of `y = 1/(kx - c)` has vertical asymptote `x = -1` and passes through (1, −1/4). What are `k` and `c`?", options:[
          { t:"`k = -2`, `c = 2`", ok:true, why:"The line is −4 at `x = 1` and 0 at `x = -1`, so it falls 4 over 2 units: `k = -2`, and `c = -2 × (-1) = 2`. Check: `-2(1) - 2 = -4`." },
          { t:"`k = -1/8`, `c = 1/8`", why:"That line equals −1/4 at `x = 1`, so its reciprocal there is −4. The <strong>reciprocal</strong> must be −1/4, so the line must be −4." },
          { t:"`k = -2`, `c = -2`", why:"`1/(-2x + 2)` has its asymptote at `x = 1`." },
          { t:"`k = -4`, `c = 4`", why:"`1/(-4x - 4)` has the right asymptote, but at `x = 1` it’s −1/8, not −1/4. The line falls 4 over <strong>2</strong> units, so `k = -4 ÷ 2 = -2`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which statement correctly describes the behaviour of `y = 1/(x + 5)` near its vertical asymptote?", options:[
          { t:"As `x → -5^{-}`, `y → -∞`, and as `x → -5^{+}`, `y → +∞`.", ok:true, why:"Each side is described separately, with arrows, and the signs match the line: negative just left of −5, positive just right." },
          { t:"At `x = -5`, `y = -∞` on the left and `y = +∞` on the right.", why:"The signs are right, but the notation isn’t: `y` has no value at `x = -5`, and ∞ isn’t a number. Describe what `y` does as `x` approaches −5 from each side, with arrows." },
          { t:"As `x → -5` from either side, `y → +∞`.", why:"This ignores the two sides. Just left of −5 the line `x + 5` is negative, so `y` heads to −∞ there." },
          { t:"As `x → -5^{-}`, `y → 0^{-}`, and as `x → -5^{+}`, `y → 0^{+}`.", why:"`0^{-}` and `0^{+}` describe the ends (`x → ±∞`). Beside the vertical asymptote, `y → ±∞`." }] },
        b:{ prompt:"Which statement correctly describes the behaviour of `y = 1/(x - 4)` near its vertical asymptote?", options:[
          { t:"As `x → 4^{-}`, `y → -∞`, and as `x → 4^{+}`, `y → +∞`.", ok:true, why:"Each side is described separately, with arrows, and the signs match the line: negative just left of 4, positive just right." },
          { t:"At `x = 4`, `y = -∞` on the left and `y = +∞` on the right.", why:"The signs are right, but the notation isn’t: `y` has no value at `x = 4`, and ∞ isn’t a number. Describe what `y` does as `x` approaches 4 from each side, with arrows." },
          { t:"As `x → 4` from either side, `y → +∞`.", why:"This ignores the two sides. Just left of 4 the line `x - 4` is negative, so `y` heads to −∞ there." },
          { t:"As `x → 4^{-}`, `y → 0^{-}`, and as `x → 4^{+}`, `y → 0^{+}`.", why:"`0^{-}` and `0^{+}` describe the ends (`x → ±∞`). Beside the vertical asymptote, `y → ±∞`." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `y = 1/(2x - 6)` has a vertical asymptote at `x = 3`?", options:[
          { t:"“At `x = 3` the line `2x - 6` is 0, so `y` is undefined there, and just beside `x = 3` the line is tiny, so `y` is huge in size.”", ok:true, why:"This names both parts of an asymptote: undefined at 3, and values that grow without bound beside it." },
          { t:"“At `x = 3` the line `2x - 6` is 0, so `y` is undefined there, and that one missing point is all an asymptote needs.”", why:"Being undefined is only half of it. An asymptote also needs the values beside `x = 3` to grow without bound, which they do here because the line is close to 0. (In module 21 you’ll meet graphs that are undefined at a point with no asymptote there.)" },
          { t:"“At `x = 3` the line `2x - 6` is 0, so `y = 1/(2x - 6)` is 0 there too, and the graph meets the `x`-axis.”", why:"At `x = 3` it’s 1/0, which is undefined, not 0. A reciprocal is never 0, so its graph never meets the `x`-axis." },
          { t:"“As `x` gets very large, the line `2x - 6` gets very large too, so `y` gets closer and closer to 3.”", why:"Far out, `y` gets close to 0, not 3, and that describes the <strong>horizontal</strong> asymptote `y = 0`. A vertical asymptote is about what happens beside `x = 3`." }] },
        b:{ prompt:"Which is the best explanation of why `y = 1/(5 - x)` has a vertical asymptote at `x = 5`?", options:[
          { t:"“At `x = 5` the line `5 - x` is 0, so `y` is undefined there, and just beside `x = 5` the line is tiny, so `y` is huge in size.”", ok:true, why:"This names both parts of an asymptote: undefined at 5, and values that grow without bound beside it." },
          { t:"“At `x = 5` the line `5 - x` is 0, so `y` is undefined there, and that one missing point is all an asymptote needs.”", why:"Being undefined is only half of it. An asymptote also needs the values beside `x = 5` to grow without bound, which they do here because the line is close to 0. (In module 21 you’ll meet graphs that are undefined at a point with no asymptote there.)" },
          { t:"“At `x = 5` the line `5 - x` is 0, so `y = 1/(5 - x)` is 0 there too, and the graph meets the `x`-axis.”", why:"At `x = 5` it’s 1/0, which is undefined, not 0. A reciprocal is never 0, so its graph never meets the `x`-axis." },
          { t:"“As `x` gets very large, the line `5 - x` gets very large in size too, so `y` gets closer and closer to 5.”", why:"Far out, `y` gets close to 0, not 5, and that describes the <strong>horizontal</strong> asymptote `y = 0`. A vertical asymptote is about what happens beside `x = 5`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A conveyor at setting `x` (where `x > 2`) moves `2x - 4` boxes per minute, so each box takes `t = 1/(2x - 4)` minutes. For which settings does each box take less than 1/6 of a minute?", options:[
          { t:"`x > 5`", ok:true, why:"A time below 1/6 minute means a rate above 6 boxes per minute, because taking reciprocals of positive numbers reverses their order. So `2x - 4 > 6`, which gives `x > 5`. Check `x = 7`: the rate is 10, so `t = 1/10`, less than 1/6." },
          { t:"`2 < x < 5`", why:"That’s where the rate is <strong>less</strong> than 6 boxes per minute, so each box takes <strong>longer</strong> than 1/6 minute. A faster rate means a shorter time: you need `2x - 4 > 6`. Check `x = 4`: `t = 1/4`, which is more than 1/6." },
          { t:"`x > 25/12`", why:"That solves `2x - 4 > 1/6`, treating the time as the rate. At `x = 3` the rate is 2 boxes per minute, so each box takes 1/2 minute, more than 1/6." },
          { t:"`x > 3`", why:"That solves `2x > 6` and drops the −4. At `x = 4` the rate is only 4 boxes per minute, so each box takes 1/4 minute, more than 1/6." }] },
        b:{ prompt:"A pump at setting `x` (where `x > 2`) removes `3x - 6` litres per second, so each litre takes `t = 1/(3x - 6)` seconds. For which settings does each litre take less than 1/9 of a second?", options:[
          { t:"`x > 5`", ok:true, why:"A time below 1/9 second means a rate above 9 litres per second, because taking reciprocals of positive numbers reverses their order. So `3x - 6 > 9`, which gives `x > 5`. Check `x = 7`: the rate is 15, so `t = 1/15`, less than 1/9." },
          { t:"`2 < x < 5`", why:"That’s where the rate is <strong>less</strong> than 9 litres per second, so each litre takes <strong>longer</strong> than 1/9 second. A faster rate means a shorter time: you need `3x - 6 > 9`. Check `x = 4`: `t = 1/6`, which is more than 1/9." },
          { t:"`x > 55/27`", why:"That solves `3x - 6 > 1/9`, treating the time as the rate. At `x = 3` the rate is 3 litres per second, so each litre takes 1/3 second, more than 1/9." },
          { t:"`x > 3`", why:"That solves `3x > 9` and drops the −6. At `x = 4` the rate is only 6 litres per second, so each litre takes 1/6 second, more than 1/9." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"For which `x`-values is `1/(2x - 6)` greater than 1?", options:[
          { t:"`(3, 3.5)`", ok:true, why:"The reciprocal is bigger than 1 exactly where the line is between 0 and 1: `0 < 2x - 6 < 1`, so `3 < x < 3.5`." },
          { t:"`(3.5, ∞)`", why:"There the line is bigger than 1, so its reciprocal is <strong>smaller</strong> than 1. Big becomes small." },
          { t:"`(3, ∞)`", why:"That’s where the reciprocal is positive. It’s bigger than 1 only close to the asymptote." },
          { t:"`(-∞, 3.5)`", why:"That’s where the line is less than 1, which includes every negative value. Negative lines give negative reciprocals." }] },
        b:{ prompt:"For which `x`-values is `1/(4x - 8)` greater than 1?", options:[
          { t:"`(2, 2.25)`", ok:true, why:"The reciprocal is bigger than 1 exactly where the line is between 0 and 1: `0 < 4x - 8 < 1`, so `2 < x < 2.25`." },
          { t:"`(2.25, ∞)`", why:"There the line is bigger than 1, so its reciprocal is <strong>smaller</strong> than 1. Big becomes small." },
          { t:"`(2, ∞)`", why:"That’s where the reciprocal is positive. It’s bigger than 1 only close to the asymptote." },
          { t:"`(-∞, 2.25)`", why:"That’s where the line is less than 1, which includes every negative value. Negative lines give negative reciprocals." }] } }
    ]
  },
  task:{
    title:"Design a reciprocal", summary:"Design a reciprocal",
    statement:"<p>Choose `k` and `c` so that the graph of `y = 1/(kx - c)`:</p><ul><li>passes through the point (4, 1/2);</li><li>is increasing on each piece;</li><li>has its vertical asymptote at a whole number strictly between `x = 0` and `x = 8`.</li></ul><p>There’s more than one answer. Can you find them all?</p><p class=\"tiny muted\">Each box accepts an integer, a terminating decimal or a fraction (e.g. −2/3).</p>",
    checks:["Valid entries", "Passes through (4, 1/2)", "Increasing on each piece", "Vertical asymptote at a whole number between 0 and 8"],
    tips:["Enter a number in each box, like −2 or −2/3. `k` can’t be 0.",
      "Right now `y` = {v} at `x = 4`. The reciprocal passes (4, 1/2) exactly when the line passes (4, 2), so you need `4k - c = 2`.",
      "Your line rises (`k > 0`), so its reciprocal falls on each piece. You need a falling line: make `k` negative.",
      "Your asymptote is `x = c/k` = {v}. Pick a whole number from 1 to 7 (other than 4) for the line’s zero, then find the slope that takes the line from 0 there to 2 at `x = 4`."],
    tip2zero:"Right now `x = 4` is your asymptote, so your graph has no point there. The line must equal 2 at `x = 4`, so you need `4k - c = 2`.",
    explainPrompt:"Explain how you found `k` and `c`, and why the asymptote can’t be at 1, 2 or 3.",
    vocab:"Use the words reciprocal, zero, vertical asymptote and increasing.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found all three. The asymptote had to be to the right of 4: a falling line that equals 2 at `x = 4` can only reach 0 further right. Zeros at 1, 2 or 3 would need a rising line."
  },
  cards:[
    ["Reciprocal of a linear function", "`y = 1/(kx - c)`, with `k ≠ 0`: 1 divided by every `y`-value of the line `y = kx - c`."],
    ["Vertical asymptote of `y = 1/(kx - c)`", "`x = c/k`, the line’s zero. Example: `1/(2x - 6)` has `x = 3`."],
    ["Horizontal asymptote of `y = 1/(kx - c)`", "`y = 0`. Far out the line is huge, so its reciprocal is close to 0."],
    ["Domain and range", "Domain `{x ∈ ℝ | x ≠ c/k}`; range `{y ∈ ℝ | y ≠ 0}`."],
    ["Intercepts", "`y`-intercept (0, `-1/c`) when `c ≠ 0`. No `x`-intercept: 1 ÷ (anything) is never 0."],
    ["Invariant points", "Where the line is 1 or −1: `x = (c + 1)/k` and `x = (c - 1)/k`. Each is `1/|k|` from the asymptote."],
    ["Sign of the reciprocal", "Always the same as the line’s: positive where the line is positive, negative where it’s negative."],
    ["Increasing or decreasing?", "Opposite to the line, on each piece separately. `k > 0`: decreasing on `(-∞, c/k)` and on `(c/k, ∞)`. `k < 0`: increasing on both."],
    ["Near the asymptote, `k > 0`", "As `x → (c/k)^{-}`, `y → -∞`; as `x → (c/k)^{+}`, `y → +∞`. For `k < 0` the arrows swap."],
    ["At the ends, `k > 0`", "As `x → -∞`, `y → 0^{-}`; as `x → ∞`, `y → 0^{+}`. For `k < 0` they swap."],
    ["Big ↔ small", "Where |line| > 1, |reciprocal| < 1, and the other way round. Near the asymptote the reciprocal is big."],
    ["`1/f(x)` vs `f^{-1}(x)`", "`1/f(x)` is the reciprocal: 1 divided by `f(x)`. `f^{-1}(x)` is the inverse, which undoes `f`. For `f(x) = 2x - 6`: `1/(2x - 6)` vs `(x + 6)/2`."]
  ]
};
