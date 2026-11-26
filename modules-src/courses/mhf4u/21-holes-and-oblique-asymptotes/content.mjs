// MHF4U 21 Holes and Oblique Asymptotes. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/21-holes-and-oblique-asymptotes.md
// Templates use §1, §2 … placeholders (they survive math typesetting); app.js fills them.

// hero equation: f(x) = (x² − 1)/(x − 1) with the numerator's sign on a highlighter box (app.js swaps it to +)
const HERO_EQ = '<span class="m"><i>f</i>(<i>x</i>) = <span class="frac"><span class="fn"><i>x</i><sup>2</sup> <span class="h21-sign" id="h21-sign">−</span> 1</span><span class="fd"><i>x</i> − 1</span></span></span>';

const MATCH_H1 = "Factor the top and the bottom. Does anything cancel?";
const MATCH_TAIL = "Try another graph.";

export default {
  id:"21-holes-and-oblique-asymptotes",
  kind:"topic",
  title:"Holes and oblique asymptotes",
  topic:"Holes and Oblique Asymptotes",
  readyTopic:"holes and oblique asymptotes",
  hero:{
    eq:HERO_EQ, eqSize:"md", eqLabel:"f of x equals x squared minus 1, all over x minus 1",
    headline:"Change one sign, change the whole graph",
    text:"In `{x^2 - 1}/{x - 1}`, the factor `x - 1` cancels, so the graph is a straight line with one point missing: a <strong>hole</strong>. Change the minus to a plus and nothing cancels. Now the graph has a <strong>vertical asymptote</strong>, and its arms hug a slanted line called an <strong>oblique asymptote</strong>. In this module you’ll find holes by factoring and oblique asymptotes by dividing.",
    fig:{ aria:"Animation: the line y = x + 1 with a hole at (1, 2) morphs into the graph of (x² + 1)/(x − 1), with vertical asymptote x = 1 and oblique asymptote y = x + 1" },
    ui:{ cap1:"`{x^2 - 1}/{x - 1} = x + 1`, `x ≠ 1`", cap2:"`{x^2 + 1}/{x - 1} = x + 1 + {2}/{x - 1}`: vertical asymptote `x = 1`, oblique asymptote `y = x + 1`",
      end1:"−1: a hole", end2:"+1: two asymptotes", hole:"hole (1, 2)", line:"y = x + 1", va:"x = 1",
      desc1:"The line y = x + 1 with an open circle (a hole) at (1, 2).", desc2:"The graph of y = (x² + 1)/(x − 1): two branches, a dashed vertical asymptote x = 1 and a dashed oblique asymptote y = x + 1. Turning points near (−0.41, −0.83) and (2.41, 4.83)." }
  },
  goals:[
    "I can factor a rational function, cancel common factors, and keep the restrictions of the original function.",
    "I can decide whether a restriction `x = a` gives a hole or a vertical asymptote, and find the coordinates of a hole.",
    "I can use the degrees of the numerator and denominator to decide whether a rational function has a horizontal asymptote, an oblique asymptote or neither.",
    "I can find an oblique asymptote by division, and use the remainder to say whether the graph is above or below it.",
    "I can identify or sketch the graph of a rational function from its holes, asymptotes and intercepts.",
    "I can work backwards from features such as a hole or an asymptote to find unknown coefficients in the equation."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factoring", goal:1,
          prompt:"Factor `x^2 - x - 12`.",
          options:[
            { t:"`(x - 4)(x + 3)`", ok:true, why:"You need two numbers that multiply to −12 and add to −1: −4 and 3. Check: `(x - 4)(x + 3) = x^2 - x - 12`." },
            { t:"`(x + 4)(x - 3)`", why:"`(x + 4)(x - 3) = x^2 + x - 12`. The product is right, but the middle term has the wrong sign: the numbers must add to −1." },
            { t:"`(x - 6)(x + 2)`", why:"−6 × 2 = −12, but −6 + 2 = −4, so this gives `x^2 - 4x - 12`. The product and the sum must both match." },
            { t:"`x(x - 1) - 12`", why:"This equals `x^2 - x - 12`, but it’s a difference, not a product. A factored form multiplies factors." }],
          hints:["Look for two numbers that multiply to −12 and add to −1.", "Pairs that multiply to −12 include −4 and 3, 4 and −3, and −6 and 2. Which pair adds to −1?", "−4 + 3 = −1, so `x^2 - x - 12 = (x - 4)(x + 3)`."] },
        { id:"w2", skill:"Factoring", goal:1,
          prompt:"Factor `2x^2 - 8` completely.",
          options:[
            { t:"`2(x - 2)(x + 2)`", ok:true, why:"Take out the common factor 2, then factor the difference of squares: `2(x^2 - 4) = 2(x - 2)(x + 2)`." },
            { t:"`2(x - 2)^2`", why:"`2(x - 2)^2 = 2x^2 - 8x + 8`. A difference of squares factors with opposite signs: `(x - 2)(x + 2)`." },
            { t:"`2(x - 4)(x + 4)`", why:"`2(x - 4)(x + 4) = 2x^2 - 32`. In `x^2 - 4`, the number being squared is 2, because 2² = 4." },
            { t:"`2(x^2 - 4)`", why:"This equals `2x^2 - 8`, but `x^2 - 4` is a difference of squares, so it factors further." }],
          hints:["Is there a common factor? Take it out first.", "`2x^2 - 8 = 2(x^2 - 4)`. Is `x^2 - 4` a special product?", "`x^2 - 4 = (x - 2)(x + 2)`, so `2x^2 - 8 = 2(x - 2)(x + 2)`."] },
        { id:"w3", skill:"Rational expressions", goal:1,
          prompt:"Simplify `{x^2 + 3x}/{x^2 - 9}` and state the restrictions.",
          options:[
            { t:"`{x}/{x - 3}`, `x ≠ 3`, `x ≠ -3`", ok:true, why:"Factor: `{x(x + 3)}/{(x - 3)(x + 3)}`. Cancel `x + 3`. The restrictions come from the original denominator, so 3 and −3 are both excluded." },
            { t:"`{x}/{x - 3}`, `x ≠ 3`", why:"`x = -3` makes the original denominator 0, so it’s still excluded after cancelling." },
            { t:"`{-x}/{3}`, no restrictions", why:"`x^2` can’t be cancelled from `x^2 + 3x` and `x^2 - 9`, because they’re sums, not products. Factor first, then cancel common factors." },
            { t:"`{x}/{x - 3}`, `x ≠ 0`, `x ≠ 3`, `x ≠ -3`", why:"`x = 0` makes the numerator 0, which is allowed. Only zeros of the denominator are restricted." }],
          hints:["Factor the numerator and the denominator before cancelling anything.", "`x^2 + 3x = x(x + 3)` and `x^2 - 9 = (x - 3)(x + 3)`. The restrictions come from the original denominator.", "Cancel `x + 3`: `{x}/{x - 3}`, with `x ≠ 3` and `x ≠ -3`."] },
        { id:"w4", skill:"Polynomial division", goal:4,
          prompt:"What is the remainder when `x^2 + 5x + 7` is divided by `x + 2`?",
          options:[
            { t:"1", ok:true, why:"By the remainder theorem, the remainder is `P(-2) = 4 - 10 + 7 = 1`. Synthetic division with −2 agrees: the bottom row is 1, 3, 1." },
            { t:"21", why:"21 is `P(2)`. The divisor `x + 2` is 0 at `x = -2`, so find `P(-2)`." },
            { t:"7", why:"7 is `P(0)`, the remainder when you divide by `x`. For `x + 2`, find `P(-2)`." },
            { t:"3", why:"3 is the constant term of the quotient, `x + 3`. The remainder is the last number in the bottom row." }],
          hints:["Use synthetic division or the remainder theorem. Which number goes in the corner for `x + 2`?", "`x + 2 = 0` at `x = -2`. Find `P(-2)`, or divide with −2 in the corner.", "`P(-2) = (-2)^2 + 5(-2) + 7 = 4 - 10 + 7 = 1`."] },
        { id:"w5", skill:"Polynomial division", goal:4,
          prompt:"Use synthetic division to divide `2x^2 - x - 4` by `x - 1`. What is the quotient?",
          options:[
            { t:"`2x + 1`", ok:true, why:"Corner 1. Bring down 2; 2 × 1 = 2 and −1 + 2 = 1; 1 × 1 = 1 and −4 + 1 = −3. The bottom row 2, 1, −3 means quotient `2x + 1`, remainder −3." },
            { t:"`2x - 3`", why:"With −1 in the corner the bottom row is 2, −3, −1, which divides by `x + 1`. For `x - 1` the corner number is 1." },
            { t:"`2x^2 + x`", why:"Dividing a degree 2 polynomial by a degree 1 polynomial gives a degree 1 quotient. The bottom row 2, 1 means `2x + 1`." },
            { t:"`2x - 2`", why:"−3 is the remainder, not part of the quotient: `2x^2 - x - 4 = (x - 1)(2x + 1) - 3`." }],
          hints:["The corner number is the zero of `x - 1`.", "Corner 1. Bring down the 2, multiply by 1, add to −1, and repeat.", "The bottom row is 2, 1, −3. The quotient is `2x + 1` and the remainder is −3."] },
        { id:"w6", skill:"Linear over linear", goal:3,
          prompt:"What are the asymptotes of `y = {3x - 1}/{x + 2}`?",
          options:[
            { t:"`x = -2` and `y = 3`", ok:true, why:"The denominator is 0 at `x = -2`. The top and bottom have the same degree, so the horizontal asymptote is the ratio of the leading coefficients: 3/1 = 3." },
            { t:"`x = 2` and `y = 3`", why:"`x + 2 = 0` at `x = -2`, not 2." },
            { t:"`x = -2` and `y = -1/2`", why:"−1/2 is the `y`-intercept, (−1)/2. The horizontal asymptote comes from the leading coefficients: 3 ÷ 1." },
            { t:"`x = -2` and `y = 0`", why:"`y = 0` happens when the bottom’s degree is higher. Here the degrees are equal." }],
          hints:["Where is the denominator 0? Then compare the degrees of the top and bottom.", "`x + 2 = 0` gives `x = -2`. The top and bottom are both degree 1.", "Equal degrees, so `y = 3/1 = 3`. The asymptotes are `x = -2` and `y = 3`."] }
      ],
      refreshers:{
        "Factoring":"For `x^2 + bx + c`, find two numbers that multiply to `c` and add to `b`: `x^2 - x - 12 = (x - 4)(x + 3)`. Always look for a common factor first, and watch for a difference of squares: `2x^2 - 8 = 2(x^2 - 4) = 2(x - 2)(x + 2)`. Check by expanding.",
        "Rational expressions":"Factor the top and the bottom, then cancel common <strong>factors</strong>, never terms. The restrictions come from the <strong>original</strong> denominator, so they stay even after a factor cancels. Example: `{x^2 + 3x}/{x^2 - 9} = {x(x + 3)}/{(x - 3)(x + 3)} = {x}/{x - 3}`, with `x ≠ 3` and `x ≠ -3`.",
        "Polynomial division":"To divide by `x - a`, put `a` in the corner (for `x + 2`, that’s −2). Bring down the first coefficient, multiply by the corner number, add to the next coefficient, and repeat. The last number is the remainder; the others are the quotient, one degree lower. Example: `(x^2 + 5x + 7) ÷ (x + 2)` gives the bottom row 1, 3, 1, so `x^2 + 5x + 7 = (x + 2)(x + 3) + 1`.",
        "Linear over linear":"For `y = {ax + b}/{cx + d}`, the vertical asymptote is where `cx + d = 0`, and the horizontal asymptote is `y = a/c`, the ratio of the leading coefficients. Example: `y = {3x - 1}/{x + 2}` has asymptotes `x = -2` and `y = 3`."
      }
    }
  },
  explore:{
    heading:"Cancel-and-divide lab",
    intro:"Two tools, two features. In <strong>Cancel</strong>, build a function from factor tiles and see what a common factor does to the graph. In <strong>Divide</strong>, set a quadratic over a linear and watch division reveal the slanted line the graph follows.",
    predictions:[
      { id:"p1", mode:"cancel", start:{ c:1, top:[3, -1], bot:[3] },
        prompt:"The graph of `f(x) = {x^2 - 2x - 3}/{x - 3}` looks like a complete straight line. What is really happening at `x = 3`?",
        options:[{ t:"The line has a single missing point, at (3, 4)", ok:true }, { t:"There’s a vertical asymptote at `x = 3`" }, { t:"Nothing: the line is complete" }, { t:"The line has a single missing point, at (3, 0)" }],
        explain:"`x^2 - 2x - 3 = (x - 3)(x + 1)`, so `f(x) = x + 1` for every `x` except 3. At `x = 3` the original gives 0/0, so there’s no point there, but the rest of the line is untouched. The missing point is where the line `y = x + 1` would be: (3, 4). A plotted curve usually can’t show one missing point, which is why holes need algebra." },
      { id:"p2", mode:"cancel", start:{ c:1, top:[1, -2], bot:[1], cancelled:true },
        prompt:"A second `(x - 1)` is added to the bottom. What will happen at `x = 1`?",
        options:[{ t:"It becomes a vertical asymptote", ok:true }, { t:"It stays a hole at (1, 3)" }, { t:"It becomes a hole at (1, 0)" }, { t:"It becomes an `x`-intercept" }],
        explain:"Cancelling removes one copy of `(x - 1)` from the top and one from the bottom. One copy is still on the bottom: `f(x) = {x + 2}/{x - 1}`, `x ≠ 1`. Near `x = 1` the top is close to 3 but the bottom is close to 0, so the values blow up: as `x -> 1^{-}`, `y -> -∞`, and as `x -> 1^{+}`, `y -> +∞`. There’s still a common factor, but there isn’t a hole. Count copies, not just matches." },
      { id:"p3", mode:"divide", start:{ p2:1, p1:1, p0:1, r:1 },
        prompt:"As `x` gets very large, which line does the graph of `f(x) = {x^2 + x + 1}/{x - 1}` get close to?",
        options:[{ t:"`y = x + 2`", ok:true }, { t:"`y = x + 1`" }, { t:"`y = x`" }, { t:"`y = 1`" }],
        explain:"Division gives `f(x) = x + 2 + {3}/{x - 1}`. As `x` grows, `{3}/{x - 1}` shrinks toward 0, so the graph gets as close as you like to `y = x + 2`. `y = x + 1` copies the middle coefficient without the “add” step. `y = x` uses only the leading terms, `x^2/x`. `y = 1` uses the horizontal-asymptote rule, which only works when the degrees are equal." },
      { id:"p4", mode:"divide", start:{ p2:1, p1:-3, p0:1, r:2, divided:true },
        prompt:"For large positive `x`, where is the graph compared with its oblique asymptote `y = x - 1`?",
        options:[{ t:"Just below it", ok:true }, { t:"Just above it" }, { t:"Exactly on it, from some point on" }, { t:"Switching from above to below, again and again" }],
        explain:"The gap between the graph and the line is `{-1}/{x - 2}`. For `x > 2` the denominator is positive, so the gap is negative: the graph is below the line. The gap shrinks toward 0 but never reaches it. For `x < 2` the gap is positive, so far to the left the graph is above the line. The remainder’s sign tells you the side." }
    ],
    chalIntro:"Set the lab, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6], mode:"cancel",
        prompt:"(Cancel mode) Build a function whose graph is the line `y = x - 2` with exactly one hole, at (1, −1).",
        why:"Exactly two builds work: constant 1 with top `(x - 2)(x - 1)` and bottom `(x - 1)`; or top `(x - 2)(x - 1)^2` and bottom `(x - 1)^2`.",
        hints:["A hole comes from the same tile on the top and the bottom. Where does the hole need to be?", "Put `(x - 1)` on the top and on the bottom. Whatever is left on top is the line.", "Top `(x - 2)(x - 1)`, bottom `(x - 1)`. It simplifies to `x - 2`, `x ≠ 1`, and the line’s height at `x = 1` is 1 − 2 = −1, so the hole is (1, −1)."],
        fb:{ plus2:"Your line is `y = x + 2`. A tile `(x - r)` gives the line a zero at `x = r`. For `y = x - 2` you need `(x - 2)`.",
          holeNeg:"Your hole is at (−1, −3). The tile `(x + 1)` is zero at `x = -1`. For a hole at `x = 1`, put `(x - 1)` on the top and the bottom.",
          noCancel:"Nothing cancels, so `x = 1` is a vertical asymptote, not a hole. Add a matching `(x - 1)` on top.",
          constant:"The constant §1 multiplies every height, so your line is §2. Set the constant back to 1.",
          twoHoles:"Your graph has two holes. The challenge asks for exactly one.",
          other:"Compare your readout with the target: the simplified function must be `x - 2`, and the only restriction must be `x = 1`." } },
      { id:"tc2", goal:[4, 6], mode:"divide",
        prompt:"(Divide mode) Set the lab so that the vertical asymptote is `x = 3` and the oblique asymptote is `y = x - 2`.",
        why:"Leading box 1, `p_1 = -5` and `x - 3` work with any constant from −9 to 9 except 6: that’s 18 settings.",
        hints:["The vertical asymptote fixes the denominator, and the leading box fixes the slope.", "Use `x - 3` and leading box 1. Synthetic division with 3 in the corner makes the middle number `p_1 + 3`.", "`p_1 + 3 = -2`, so `p_1 = -5`. Any constant except 6 works, since 6 gives remainder 0. For example, `{x^2 - 5x + 1}/{x - 3} = x - 2 - {5}/{x - 3}`."],
        fb:{ zeroLikely:"Remainder 0: `x^2 - 5x + 6 = (x - 3)(x - 2)`. The graph is the line `y = x - 2` with a hole at (3, 1), so there’s no vertical asymptote. Change the constant.",
          zero:"Remainder 0: §1 is a factor of the top, so the graph is the line §2 with a hole at §3. It has no asymptotes at all. Change the boxes so the remainder isn’t 0.",
          p1:"Your asymptote is `y = x + 1`. The quotient’s constant isn’t `p_1` itself: synthetic division adds 3 × 1 to it. You need `p_1 + 3 = -2`.",
          r:"Your denominator is `x + 3`, so the vertical asymptote is `x = -3`. For `x = 3`, use `x - 3`.",
          p2:"The slope of the oblique asymptote equals the leading box. For slope 1, set it to 1.",
          other:"Run the division: the bottom row must read 1, −2, and then a remainder that isn’t 0." } },
      { id:"tc3", goal:[4, 6], mode:"divide", stretch:true,
        prompt:"(Divide mode) Make the oblique asymptote `y = 2x + 1` and the vertical asymptote `x = -1`, with the graph <strong>below</strong> the oblique asymptote as `x -> ∞`.",
        why:"Leading box 2, `p_1 = 3` and `x + 1` give the remainder `p_0 - 1`, which is negative for any constant from −9 to 0: 10 settings.",
        hints:["Work backwards through synthetic division. What goes in the corner, and what must the bottom row’s first two numbers be?", "Corner −1, leading box 2. The bottom row is 2, then `p_1 - 2`, then the remainder `p_0 - (p_1 - 2)`. The middle number must be 1.", "`p_1 = 3`, and then the remainder is `p_0 - 1`. Below the line on the right means `R/(x + 1) < 0` for large `x`, so `R < 0`: any `p_0` from −9 to 0. For example, `{2x^2 + 3x}/{x + 1} = 2x + 1 - {1}/{x + 1}`."],
        fb:{ zeroLikely:"Remainder 0: `2x^2 + 3x + 1 = (x + 1)(2x + 1)`. The graph is the line `y = 2x + 1` with a hole at (−1, −1), and there’s no vertical asymptote.",
          p1m1:"Your asymptote is `y = 2x - 3`. With −1 in the corner, the middle number is `p_1 + 2 × (-1) = p_1 - 2`. It looks as if you used +1.",
          p1p1:"Your asymptote is `y = 2x - 1`. The middle number of the bottom row is `p_1 - 2`, not `p_1`.",
          above:"Both asymptotes are right, but your remainder `p_0 - 1` is positive, so `R/(x + 1) > 0` for large `x`: the graph is <strong>above</strong> the line. You need a negative remainder.",
          r:"Your vertical asymptote is `x = 1`. The denominator’s zero, and the corner number, must be −1: use `x + 1`.",
          p2:"The slope of the oblique asymptote equals the leading box. Set it to 2.",
          other:"Run the division: the bottom row must read 2, 1, and then a remainder below 0." } }
    ],
    ui:{
      modes:["Cancel", "Divide"],
      top:"Top", bottom:"Bottom", constant:"Constant factor", addTile:"Add tile", cancelBtn:"Cancel common factors", remove:"Remove", dec:"Decrease", inc:"Increase",
      tileNote:"Each tile is `(x - r)` with `r` a whole number from −5 to 5. Up to 3 tiles on top and 2 on the bottom.",
      matched:"matched", leftover:"left over",
      cancelled:"Cancelled §1 from top and bottom.", holeAt:"Hole at §1.", noHoleLeft:"A copy of §1 is still on the bottom, so `x = §2` is a vertical asymptote.",
      rows:{ fn:"Function", restr:"Restrictions", common:"Common factors", simp:"Simplified", dom:"Domain", holes:"Holes", va:"Vertical asymptotes", far:"Far left and right", xint:"`x`-intercepts", yint:"`y`-intercept",
        div:"Division", rew:"Rewritten", va1:"Vertical asymptote", oa:"Oblique asymptote", side:"Which side?", cross:"Does it cross?", gap:"Gap at the probe", ints:"Intercepts", gaps26:"Gaps at `x = 26`" },
      none:"None", once:"once", twice:"twice", nothing:"Nothing cancels.", pressCancel:"? Press <strong>Cancel common factors</strong> to simplify.",
      holeQ:"`x = §1`: height ? (press <strong>Cancel common factors</strong>)", onAxis:"(on the `x`-axis, but not an `x`-intercept)",
      vaRow:"`x = §1`: as `x -> §1^{-}`, `y -> §2`; as `x -> §1^{+}`, `y -> §3`",
      far0:"Horizontal asymptote `y = 0` (lower degree on top)",
      farEq:"Horizontal asymptote `y = §1` (same degree on top and bottom: §1 ÷ 1)",
      farOb:"Oblique asymptote §1 (one degree higher on top; division gives the line)",
      farNone:"No horizontal or oblique asymptote (the top is §1 degrees higher)",
      farPoly:"No asymptotes: after cancelling, the graph is §1 (§2) with §3 §4",
      kinds:["a horizontal line", "a line", "a parabola"], hole1:"hole", holeN:"holes",
      xNoteHole:"(`x = §1` makes the top 0, but it’s a hole, not an intercept.)",
      xNoteVA:"(`x = §1` makes the top 0, but it’s a vertical asymptote, not an intercept.)",
      yNone:"None: `x = 0` is a restriction",
      runDiv:"Run the division to fill this in.", q:"?",
      vaHole:"None: `x = §1` is a hole at §2", oaNone:"None: the graph is the line §1 with a hole",
      sideAbove:"As `x -> ∞`, the graph is above §1, because §2 > 0 when `x > §3`. As `x -> -∞`, it’s below.",
      sideBelow:"As `x -> ∞`, the graph is below §1, because §2 < 0 when `x > §3`. As `x -> -∞`, it’s above.",
      sideLine:"Not needed: the graph is the line itself, apart from the hole.",
      cross:"Never: §1 is never 0.",
      gapRow:"At `x = §1`: gap = §2 = §3 ≈ §4; the graph is §5 the line here.", above:"above", below:"below",
      gapNoLine:"The probe sits on the line: there’s no gap.",
      intsRow:"`x`-intercepts §1; `y`-intercept §2", intsNoneX:"none", and:"and",
      remainder0:"Remainder 0: §1 is a factor of the top. The graph is the line §2 with a hole at §3, and there’s no vertical asymptote. Try it in Cancel mode.",
      board:"Division board", corner:"corner", bring:"Bring down §1.", mult:"Multiply: §1 × §2 = §3.", add:"Add: §1 + §2 = §3.", startStep:"Press Step or Play to divide.",
      doneStep:"Done: quotient §1, remainder §2.", stepOf:"Step §1 of §2",
      zoomOut:"Zoom out", zoomIn:"Zoom in", reset:"Reset view", zoomLab:"Zoom ×§1",
      gapTable:"Show the gap table", gapTableHide:"Hide the gap table", gapHead:["`x`", "`f(x)`", "the line", "gap (exact)", "gap (decimal)"],
      gapNeedsDiv:"Run the division first: the gap is measured from the oblique asymptote.",
      probe:"Gap probe at x = §1. Arrow keys move it; Shift with an arrow moves ten steps; Home and End jump to the edges.",
      p2:"Leading box (`p_2`)", p1:"Middle box (`p_1`)", p0:"Constant (`p_0`)", r:"Denominator `x - r` (`r`)",
      boxNote:"The letters only name the boxes; the graph uses the numbers you set.",
      cmp:"Comparison lines (dotted): `y = x + 1`, `y = x` and `y = 1`.",
      gaps26:"3/25 = 0.12 to `y = x + 2`, but 1.12 to `y = x + 1`, 2.12 to `y = x`, and about 27.1 to `y = 1`."
    }
  },
  part3:{
    slug:"microscope", name:"Microscope",
    heading:"Hole or asymptote? Under the microscope",
    intro:"Each function below has restrictions. For each one, make your call first. Then zoom in and read the table to test it, and open the algebra to see why.",
    cases:[
      { id:"c1", fn:"`f(x) = {x^2 - x - 2}/{x^2 - 4}`", fact:"`f(x) = {(x - 2)(x + 1)}/{(x - 2)(x + 2)}`", top:[2, -1], bot:[2, -2], order:[2, -2], simp:"`{x + 1}/{x + 2}`", note:"" },
      { id:"c2", fn:"`f(x) = {x^2 + 3x}/{x^2 + 6x + 9}`", fact:"`f(x) = {x(x + 3)}/{(x + 3)^2}`", top:[0, -3], bot:[-3, -3], order:[-3], simp:"`{x}/{x + 3}`", note:"One copy of `(x + 3)` is left on the bottom." },
      { id:"c3", fn:"`f(x) = {x^3 - x}/{x^2 - x}`", fact:"`f(x) = {x(x - 1)(x + 1)}/{x(x - 1)}`", top:[0, 1, -1], bot:[0, 1], order:[0, 1], simp:"`x + 1`", note:"The graph is the line `y = x + 1` with two holes." },
      { id:"c4", fn:"`f(x) = {x^3 - 3x^2 + 4}/{x^2 - 3x + 2}`", fact:"`f(x) = {(x - 2)^2(x + 1)}/{(x - 1)(x - 2)}`", top:[2, 2, -1], bot:[1, 2], order:[1, 2], simp:"`{(x - 2)(x + 1)}/{x - 1}`",
        note:"The hole sits on the `x`-axis, so the rough plot seems to cross the axis there. Factoring the cubic uses the factor theorem: `x = 2` and `x = -1` are zeros. This function also has the oblique asymptote `y = x`." }
    ],
    ui:{
      caseOf:"Case §1 of §2", restrOf:"Restriction §1 of §2 in this case", restr:"`x = §1`",
      call:"Make your call at `x = §1`:", hole:"Hole", va:"Vertical asymptote", callNote:"Your call is recorded and can’t be changed.",
      zoom:"Zoom in", zoomDone:"Fully zoomed", zoomFirst:"Make your call first, then zoom in.", zoomLevel:"Zoom §1 of 3",
      tblHead:["`x` (left)", "`f(x)`", "`x` (right)", "`f(x)`"], tblEmpty:"Each zoom adds a row to this table.",
      alg:"Check it with algebra", algWait:"This opens by itself after the third zoom. Open it now if you like.",
      count:"Top: §1 appears <strong>§2</strong> §3. Bottom: §1 appears <strong>§4</strong> §5.", time:"time", times:"times",
      vaLine:"After cancelling, <strong>§1</strong> §2 left on the bottom, so `x = §3` is a <strong>vertical asymptote</strong>.", copy1:"copy is", copyN:"copies are",
      holeLine:"After cancelling, no copy is left on the bottom, so `x = §1` is a <strong>hole</strong>.",
      holeSub:"§1 at `x = §2` gives §3, so the hole is §4.",
      right:"✓ Your call matches the evidence.",
      wrongHole:"✗ The table shows the values growing without bound, and a copy of §1 is still on the bottom after cancelling. That makes a vertical asymptote.",
      wrongVA:"✗ The values close in on one number from both sides, and every copy of §1 on the bottom cancelled. A restriction that cancels completely leaves a single missing point: a hole.",
      next:"Next restriction", nextCase:"Next case", prevCase:"Previous case",
      board:"Diagnostic board", holes:"Holes", vas:"Vertical asymptotes", chipCase:"case §1", changed:"changed", confirmed:"confirmed",
      score:"Your calls matched the evidence §1 of 7 times.", scoreSoFar:"Calls so far: §1 of 7.",
      summary:"Microscope calls: §1/7", offTop:"y → +∞", offBot:"y → −∞",
      descRough:"Rough plot of §1, with a highlighter line at x = §2.", descZoom:"Zoomed in around x = §1: x from §2 to §3.",
      descHole:"Open circle at §1: a hole.", descVA:"Dashed vertical asymptote x = §1."
    },
    blocks:[{ title:"What the tests mean", html:"<p><strong>Hole or vertical asymptote at `x = a`?</strong></p><ol><li>Factor the numerator and the denominator completely.</li><li>Count the copies of `(x - a)`: `m` on top and `n` on the bottom. (`n` is at least 1, since `x = a` is a restriction.)</li><li>If `n > m`, a copy is left on the bottom after cancelling: <strong>vertical asymptote</strong>.</li><li>If `n ≤ m`, every copy on the bottom cancels: <strong>hole</strong>. Its `y`-value is the simplified function at `x = a`. If `m > n`, a copy is left on top, so the hole is on the `x`-axis: (`a`, 0).</li></ol><p>Either way, `x = a` stays out of the domain.</p>" }],
    quickCheck:{
      title:"Hole, asymptote or intercept?", summary:"Hole, asymptote or intercept?",
      items:[
        { id:"q1", goal:2, prompt:"`f(x) = {x + 4}/{x^2 + 4x}`, at `x = -4`",
          choices:[
            { t:"Hole", ok:true, fb:"Right. `{x + 4}/{x(x + 4)} = {1}/{x}` with `x ≠ -4`, so the hole is (−4, −1/4)." },
            { t:"Vertical asymptote", fb:"`x^2 + 4x = x(x + 4)`. The `(x + 4)` cancels completely and no copy is left on the bottom, so `x = -4` is a hole, at (−4, −1/4). It can’t be an intercept: `x = -4` isn’t in the domain." },
            { t:"`x`-intercept", fb:"`x^2 + 4x = x(x + 4)`. The `(x + 4)` cancels completely and no copy is left on the bottom, so `x = -4` is a hole, at (−4, −1/4). It can’t be an intercept: `x = -4` isn’t in the domain." }] },
        { id:"q2", goal:2, prompt:"`f(x) = {x - 5}/{x^2 - 10x + 25}`, at `x = 5`",
          choices:[
            { t:"Hole", fb:"`x^2 - 10x + 25 = (x - 5)^2`. One copy cancels, but one is still on the bottom, so `x = 5` is a vertical asymptote. It can’t be an intercept, because `x = 5` isn’t in the domain." },
            { t:"Vertical asymptote", ok:true, fb:"Right. The bottom is `(x - 5)^2`, so one copy of `(x - 5)` is left after cancelling: `f(x) = {1}/{x - 5}`." },
            { t:"`x`-intercept", fb:"`x^2 - 10x + 25 = (x - 5)^2`. One copy cancels, but one is still on the bottom, so `x = 5` is a vertical asymptote. It can’t be an intercept, because `x = 5` isn’t in the domain." }] },
        { id:"q3", goal:2, prompt:"`f(x) = {x^2 - 6x + 9}/{x - 3}`, at `x = 3`",
          choices:[
            { t:"Hole", ok:true, fb:"Right. `{(x - 3)^2}/{x - 3} = x - 3` with `x ≠ 3`, so the hole is (3, 0): on the `x`-axis, but not an intercept." },
            { t:"Vertical asymptote", fb:"`x = 3` makes the original denominator 0, so it isn’t in the domain. There’s no point on the graph there, so it can’t be an intercept. The factor cancels completely from the bottom, so it’s a hole, at (3, 0)." },
            { t:"`x`-intercept", fb:"`x = 3` makes the original denominator 0, so it isn’t in the domain. There’s no point on the graph there, so it can’t be an intercept. The factor cancels completely from the bottom, so it’s a hole, at (3, 0)." }] },
        { id:"q4", goal:2, prompt:"`f(x) = {x^2 - 9}/{x + 1}`, at `x = 3`",
          choices:[
            { t:"Hole", fb:"`x = 3` doesn’t make the denominator 0 (3 + 1 = 4), so it isn’t a restriction at all. `f(3) = 0`, so (3, 0) is an `x`-intercept." },
            { t:"Vertical asymptote", fb:"`x = 3` doesn’t make the denominator 0 (3 + 1 = 4), so it isn’t a restriction at all. `f(3) = 0`, so (3, 0) is an `x`-intercept." },
            { t:"`x`-intercept", ok:true, fb:"Right. `x = 3` makes the top 0 but not the bottom: `f(3) = 0/4 = 0`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"custom", title:"Match the equation to its graph", summary:"Match the equation to its graph", goal:[5, 2, 4],
        instruction:"Match each equation to its graph.", how:"Tap an equation, then tap its graph.",
        view:{ xmin:-6, xmax:6, ymin:-10, ymax:10 },
        left:[
          { id:"l1", t:"`y = {x^2 - 4}/{x + 2}`", kind:"line",
            why:"`{(x - 2)(x + 2)}/{x + 2} = x - 2` with `x ≠ -2`. At `x = -2` the line’s height is −4.",
            hints:[MATCH_H1, "`x^2 - 4 = (x - 2)(x + 2)`, so `(x + 2)` cancels, leaving `x - 2` with `x ≠ -2`.", "The line `y = x - 2` with a hole at `x = -2`, at height −4. That’s the graph with the line `y = x - 2` and a hole at (−2, −4)."] },
          { id:"l2", t:"`y = {x^2 - 4}/{x - 2}`", kind:"line",
            why:"`{(x - 2)(x + 2)}/{x - 2} = x + 2` with `x ≠ 2`, so the hole is (2, 4).",
            hints:[MATCH_H1, "`x^2 - 4 = (x - 2)(x + 2)`, so `(x - 2)` cancels, leaving `x + 2` with `x ≠ 2`.", "The line `y = x + 2` with a hole at `x = 2`, at height 4. That’s the graph with the line `y = x + 2` and a hole at (2, 4)."] },
          { id:"l3", t:"`y = {x^2 + 2}/{x - 2}`", kind:"oblique",
            why:"Division gives `x + 2 + {6}/{x - 2}`. The remainder 6 is positive, so the graph is above the line for `x > 2`.",
            hints:["Does `x - 2` cancel? Check whether `x = 2` makes the top 0.", "2² + 2 = 6, so nothing cancels, and `x = 2` is a vertical asymptote. Divide to find the slanted line and the remainder.", "Synthetic division with 2 in the corner: 1, 2, 6. `f(x) = x + 2 + {6}/{x - 2}`. The remainder is positive, so the graph is above `y = x + 2` on the right."] },
          { id:"l4", t:"`y = {x^2 - 6}/{x - 2}`", kind:"oblique",
            why:"Division gives `x + 2 - {2}/{x - 2}`. The remainder −2 is negative, so the graph is below the line for `x > 2`.",
            hints:[MATCH_H1, "2² − 6 = −2, so nothing cancels. Synthetic division with 2 in the corner gives 1, 2, −2: `f(x) = x + 2 - {2}/{x - 2}`.", "Vertical asymptote `x = 2`, oblique asymptote `y = x + 2`, and a negative remainder. That’s the graph with both asymptotes and the curve below the slanted line on the right."] },
          { id:"l5", t:"`y = {x - 2}/{x^2 - 4}`", kind:"flat",
            why:"`{x - 2}/{(x - 2)(x + 2)} = {1}/{x + 2}` with `x ≠ 2`: a hole at (2, 1/4) and an asymptote at `x = -2`.",
            hints:["Factor the bottom.", "`x^2 - 4 = (x - 2)(x + 2)`. Which factor cancels, and which is left?", "`(x - 2)` cancels, leaving `{1}/{x + 2}`: a hole at `x = 2` with height 1/4, and a vertical asymptote at `x = -2`."] },
          { id:"l6", t:"`y = {x + 2}/{x^2 - 4}`", kind:"flat",
            why:"`{x + 2}/{(x - 2)(x + 2)} = {1}/{x - 2}` with `x ≠ -2`: a hole at (−2, −1/4) and an asymptote at `x = 2`.",
            hints:[MATCH_H1, "`x^2 - 4 = (x - 2)(x + 2)`, so `(x + 2)` cancels, leaving `{1}/{x - 2}` with `x ≠ -2`.", "A hole at `x = -2` with height −1/4, a vertical asymptote `x = 2` and the horizontal asymptote `y = 0`. That’s the graph with the hole at (−2, −1/4) and the asymptote `x = 2`."] }
        ],
        right:[
          { id:"r1", kind:"line", fn:{ c:1, top:[2, -2], bot:[-2] }, desc:"The line y = x − 2 with a hole at (−2, −4)." },
          { id:"r2", kind:"line", fn:{ c:1, top:[2, -2], bot:[2] }, desc:"The line y = x + 2 with a hole at (2, 4)." },
          { id:"r3", kind:"oblique", fn:{ p:[1, 0, 2], r:2 }, desc:"Vertical asymptote x = 2; oblique asymptote y = x + 2; the curve is above it on the right." },
          { id:"r4", kind:"oblique", fn:{ p:[1, 0, -6], r:2 }, desc:"Vertical asymptote x = 2; oblique asymptote y = x + 2; the curve is below it on the right." },
          { id:"r5", kind:"flat", fn:{ c:1, top:[2], bot:[2, -2] }, desc:"Hole at (2, 1/4); vertical asymptote x = −2; horizontal asymptote y = 0." },
          { id:"r6", kind:"flat", fn:{ c:1, top:[-2], bot:[2, -2] }, desc:"Hole at (−2, −1/4); vertical asymptote x = 2; horizontal asymptote y = 0." }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{
          "l1|r2":"Cancel `(x + 2)`, not `(x - 2)`. You’re left with `x - 2`, so the line is `y = x - 2` and the hole is at `x = -2`.",
          "l2|r1":"Cancel `(x - 2)`: you’re left with `x + 2`, and the hole is at `x = 2`.",
          "l3|r4":"Both have the asymptotes `x = 2` and `y = x + 2`, so the side decides. Dividing `x^2 + 2` by `x - 2` leaves remainder +6, so the graph is above the line on the right.",
          "l4|r3":"Dividing `x^2 - 6` by `x - 2` leaves remainder −2: `f(x) = x + 2 - {2}/{x - 2}`, below the line on the right.",
          "l5|r6":"`(x - 2)` cancels, so the hole is at `x = 2` and the asymptote at `x = -2`. That graph has them the other way round.",
          "l6|r5":"`(x + 2)` cancels: the hole is at `x = -2` and the asymptote at `x = 2`."
        },
        wrongGroups:{
          obliqueLine:"Nothing cancels here. `x = 2` doesn’t make the top 0 (2² + 2 = 6 and 2² − 6 = −2), so `x - 2` isn’t a factor of the top, and `x = 2` is a vertical asymptote.",
          lineCurve:"`x^2 - 4` has a factor that cancels with the bottom. The graph is a line with a hole, not a curve with asymptotes.",
          flatOther:"The top has a lower degree than the bottom, so far out the graph flattens toward `y = 0`.",
          otherFlat:"The top has a higher degree than the bottom, so the graph can’t flatten toward `y = 0`."
        },
        tail:MATCH_TAIL, eqTitle:"Equations", gTitle:"Graphs", pickFirst:"Tap an equation first, then tap its graph.", graphN:"Graph §1" },
      { id:"missing", type:"custom", title:"Find the missing numbers", summary:"Find the missing numbers", star:true, goal:[6, 2, 4],
        instruction:"Find the missing numbers. Items 1–3 warm you up. Items 4–7 work backwards from a graph’s features to its equation. Item 8 divides by a quadratic. Items 7 and 8 go beyond the Final Check.",
        how:"Type each number in its box, then press Check. Fractions like 1/2 and decimals like 0.5 are both accepted.",
        other:"Not yet. Open a hint if you’re stuck, then try again.", tryAgain:"Try again.", empty:"Fill in every box with a number first.",
        items:[
          { id:"m1", goal:2, prompt:"`f(x) = {x^2 + 2x - 15}/{x - 3}`. Where is the hole?", frame:"( [] , [] )", labels:["x-coordinate", "y-coordinate"],
            answer:[3, 8], display:"(3, 8)",
            wrong:[{ v:[3, 0], fb:"That reads the original’s 0/0 as 0. Use the simplified `x + 5` at `x = 3`." }, { v:[-5, 0], fb:"That’s the `x`-intercept, from the other factor `(x + 5)`." }, { v:[-3, 2], fb:"`x - 3` is 0 at `x = 3`, not −3." }],
            hints:["Factor the top. Which factor matches the bottom?", "`x^2 + 2x - 15 = (x - 3)(x + 5)`. Cancel `(x - 3)`.", "`f(x) = x + 5`, `x ≠ 3`. At `x = 3` the height is 8, so the hole is (3, 8)."] },
          { id:"m2", goal:4, prompt:"`f(x) = {x^2 - 4x + 5}/{x - 2}`. Find the oblique asymptote.", frame:"`y =` [] `x +` []", labels:["slope", "constant"],
            answer:[1, -2], display:"`y = x - 2`",
            wrong:[{ v:[1, -6], fb:"You divided with −2 in the corner. For `x - 2` the corner is 2." }, { v:[1, -4], fb:"−4 is the top’s middle coefficient. Synthetic division adds the corner number × 1 to it before it becomes the quotient’s constant." }, { v:[1, -1], fb:"That adds the remainder 1 into the line. The remainder belongs to `{1}/{x - 2}`, which shrinks to 0." }],
            hints:["Use synthetic division. What’s the corner number for `x - 2`?", "Corner 2: bring down 1; 1 × 2 = 2 and −4 + 2 = −2; −2 × 2 = −4 and 5 − 4 = 1.", "`f(x) = x - 2 + {1}/{x - 2}`, so the oblique asymptote is `y = x - 2`."] },
          { id:"m3", goal:4, prompt:"`f(x) = {2x^2 + 3x + 4}/{2x + 1}`. Find the oblique asymptote.", frame:"`y =` [] `x +` []", labels:["slope", "constant"],
            answer:[1, 1], display:"`y = x + 1`",
            wrong:[{ v:[2, 2], fb:"Synthetic division with −1/2 gives 2, 2, 3, but that divides by `x + 1/2`. Since `2x + 1 = 2(x + 1/2)`, the quotient for `2x + 1` is half of that one." }, { v:[1, 0], fb:"`x` is only `2x^2 ÷ 2x`. Keep dividing until what’s left over has no `x` in it." }],
            hints:["Use long division, or write `2x + 1 = 2(x + 1/2)`.", "`(2x + 1) × x = 2x^2 + x`. Subtract: `2x + 4` is left. `(2x + 1) × 1 = 2x + 1`. Subtract: 3 is left.", "`2x^2 + 3x + 4 = (2x + 1)(x + 1) + 3`, so `f(x) = x + 1 + {3}/{2x + 1}`, and the asymptote is `y = x + 1`."] },
          { id:"m4", goal:6, prompt:"For one value of `k`, `f(x) = {x^2 + kx - 6}/{x - 2}` has a hole at `x = 2`. Find `k` and the hole.", frame:"`k =` [] ; hole ( [] , [] )", labels:["k", "hole x-coordinate", "hole y-coordinate"],
            answer:[1, 2, 5], display:"`k = 1`; hole (2, 5)",
            wrong:[{ v:{ 0:3 }, fb:"That solves `2k - 6 = 0`. Don’t drop 2² = 4: `4 + 2k - 6 = 0`." }, { v:{ 0:-1 }, fb:"That makes `x = -2` a zero of the top. You need `x = 2` to be a zero." }, { v:{ 2:0 }, fb:"That reads 0/0 as 0. With your `k`, factor the top, cancel `(x - 2)`, and use what’s left at `x = 2`." }],
            hints:["A hole at `x = 2` means `x - 2` must be a factor of the top. What does the factor theorem say?", "`x - 2` is a factor exactly when the top is 0 at `x = 2`: `4 + 2k - 6 = 0`.", "`2k = 2`, so `k = 1`. Then `x^2 + x - 6 = (x - 2)(x + 3)`, and the simplified `x + 3` gives the hole (2, 5)."] },
          { id:"m5", goal:6, prompt:"The oblique asymptote of `f(x) = {x^2 + bx + 5}/{x - 3}` is `y = x + 4`. Find `b`.", frame:"`b =` []", labels:["b"],
            answer:[1], display:"`b = 1`",
            wrong:[{ v:[4], fb:"The quotient’s constant is `b + 3`, not `b`: synthetic division adds 3 × 1." }, { v:[7], fb:"That uses −3 in the corner. For `x - 3` the corner is 3, so `b + 3 = 4`." }],
            hints:["Do the synthetic division with the unknown `b`.", "Corner 3: bring down 1; 1 × 3 = 3, so the middle number is `b + 3`.", "`b + 3 = 4`, so `b = 1`. The remainder is 5 + 3 × 4 = 17, not 0, so `x = 3` really is an asymptote."] },
          { id:"m6", goal:6, prompt:"`f(x) = {x^2 + bx + c}/{x + 1}` has the oblique asymptote `y = x + 3`, and its graph passes through the origin. Find `b` and `c`.", frame:"`b =` [] , `c =` []", labels:["b", "c"],
            answer:[4, 0], display:"`b = 4`, `c = 0`",
            wrong:[{ v:{ 0:2 }, fb:"With −1 in the corner, the middle number is `b - 1`. You used +1." }, { v:{ 0:3 }, fb:"The middle number is `b - 1`, not `b`." }, { v:{ 1:3 }, fb:"The 3 belongs to the asymptote, not to `c`. The graph passes through the origin, so `f(0)` must be 0. What is `f(0)` in terms of `c`?" }],
            hints:["Use each condition separately: one gives `c`, the other gives `b`.", "Through the origin: `f(0) = c/(0 + 1) = c`, so `c = 0`. With −1 in the corner, the middle number is `b - 1`.", "`b - 1 = 3`, so `b = 4`: `f(x) = {x^2 + 4x}/{x + 1} = x + 3 - {3}/{x + 1}`."] },
          { id:"m7", goal:6, star:true, prompt:"`f(x) = {2x^2 + px + q}/{x - 3}` has a hole at (3, 7). Find `p` and `q`.", frame:"`p =` [] , `q =` []", labels:["p", "q"],
            answer:[-5, -3], display:"`p = -5`, `q = -3`",
            wrong:[{ v:[1, -21], fb:"That makes the top `(x - 3)(2x + 7)`, whose simplified form `2x + 7` is 13 at `x = 3`, not 7. The hole’s height is the whole simplified function at `x = 3`, not its constant term." }, { v:[7, 3], fb:"That makes the top `(x + 3)(2x + 1)`. A hole at `x = 3` needs the factor `(x - 3)`." }],
            hints:["A hole at `x = 3` means the top factors as `(x - 3)(2x + s)` for some number `s`.", "Cancelling leaves `2x + s`, and the hole’s height is its value at `x = 3`: 6 + `s` = 7.", "`s` = 1, so the top is `(x - 3)(2x + 1) = 2x^2 - 5x - 3`: `p = -5` and `q = -3`."] },
          { id:"m8", goal:4, star:true, prompt:"`f(x) = {x^3 + 2x^2 + 3x + 1}/{x^2 + 1}`. Find its oblique asymptote, and the `x`-value where the graph crosses it.", frame:"`y =` [] `x +` [] ; crosses at `x =` []", labels:["slope", "constant", "crossing x-value"],
            answer:[1, 2, 0.5], display:"`y = x + 2`; crosses at `x = 1/2`",
            wrong:[{ v:{ 0:1, 1:0 }, fb:"That’s only `x^3 ÷ x^2`. Write the top as `(x^2 + 1)(x + 2)` plus what’s left over." }, { v:{ 2:-0.5 }, fb:"The graph meets the line where the leftover `2x - 1` is 0. Check the sign when you solve for `x`." }],
            hints:["Divide by `x^2 + 1` by splitting the top: how many copies of `x^2 + 1` fit into `x^3 + 2x^2`?", "`x^3 + 2x^2 + 3x + 1 = x(x^2 + 1) + 2(x^2 + 1) + (2x - 1)`. So `f(x) = x + 2 + {2x - 1}/{x^2 + 1}`.", "The oblique asymptote is `y = x + 2`. The graph is on the line only where `{2x - 1}/{x^2 + 1} = 0`, at `x = 1/2`. Left of 1/2 it’s below the line, and right of 1/2 it’s above."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Ananya", how:"",
        instruction:"Ananya made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Describe what happens at each restriction of `f(x) = {x^2 + x - 6}/{x^2 - 4}`.",
            steps:["Factor: `f(x) = {(x + 3)(x - 2)}/{(x - 2)(x + 2)}`.", "Restrictions: `x ≠ 2` and `x ≠ -2`.", "Cancel `(x - 2)`: `f(x) = {x + 3}/{x + 2}`, `x ≠ 2`.", "There’s a hole at `x = 2`. The original gives `f(2) = 0/0 = 0`, so the hole is (2, 0).", "`x = -2` is still a zero of the simplified denominator, so `x = -2` is a vertical asymptote."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: both make the original denominator 0.", "Step 3 is correct, and it keeps the restriction.", "", "Step 5 is true. The mistake is earlier."],
            fixes:[
              { t:"Find the height from the simplified function: `{2 + 3}/{2 + 2} = 5/4`, so the hole is (2, 5/4).", ok:true, why:"0/0 has no value. The simplified function gives the height the graph would have at `x = 2`." },
              { t:"Use the numerator only: 2 + 3 = 5, so the hole is (2, 5).", why:"The simplified function still has a denominator: `{x + 3}/{x + 2}`. At `x = 2` that’s 5/4." },
              { t:"0/0 is undefined, so `x = 2` is a vertical asymptote, not a hole.", why:"`(x - 2)` cancels completely from the bottom, so `x = 2` is a hole. Asymptotes come only from factors left on the bottom." },
              { t:"Step 4 is correct as written.", why:"0/0 isn’t 0. It has no value at all, which is why the graph has a gap there." }],
            hints:["Check how step 4 finds the hole’s `y`-value.", "The original function can’t be evaluated at `x = 2`. Which version of `f` can?", "Step 4 is wrong. Use `{x + 3}/{x + 2}` at `x = 2`: 5/4. The hole is (2, 5/4)."] },
          { id:"e2", goal:4, task:"Find the oblique asymptote of `f(x) = {x^2 + 3x - 1}/{x + 2}`.",
            steps:["The top has degree 2 and the bottom degree 1, and `x = -2` doesn’t make the top 0, so there’s an oblique asymptote.", "Divide by `x + 2` with synthetic division, using 2 in the corner.", "Bring down 1. 1 × 2 = 2, and 3 + 2 = 5. 5 × 2 = 10, and −1 + 10 = 9.", "So `f(x) = x + 5 + {9}/{x + 2}`, and the oblique asymptote is `y = x + 5`."],
            answer:1,
            stepFb:["Step 1 is correct: (−2)² + 3(−2) − 1 = −3, not 0, so nothing cancels.", "", "Step 3’s arithmetic is right for the corner number it used. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Use −2, the zero of `x + 2`. The bottom row is 1, 1, −3, so `f(x) = x + 1 - {3}/{x + 2}` and the asymptote is `y = x + 1`.", ok:true, why:"Synthetic division always uses the zero of the divisor." },
              { t:"Use −2. The bottom row is 1, 1, −3, so the asymptote is `y = x + 1 - 3 = x - 2`.", why:"The remainder −3 belongs to `{-3}/{x + 2}`, which shrinks to 0. It isn’t part of the line." },
              { t:"Use −2. The bottom row is 1, 1, −3, so the asymptote is `y = x`.", why:"That drops the quotient’s constant. The whole quotient, `x + 1`, is the asymptote." },
              { t:"Step 2 is correct as written.", why:"`x + 2 = 0` at `x = -2`. Using 2 divides by `x - 2` instead." }],
            hints:["Check the corner number in step 2.", "The corner number is the value of `x` that makes the divisor 0.", "Step 2 is wrong: use −2. The bottom row is 1, 1, −3, so `f(x) = x + 1 - {3}/{x + 2}`, and the asymptote is `y = x + 1`."] },
          { id:"e3", goal:5, task:"Find the intercepts of `f(x) = {x^2 - 4}/{x^2 - x - 2}`.",
            steps:["Factor: `f(x) = {(x - 2)(x + 2)}/{(x - 2)(x + 1)}`.", "Restrictions: `x ≠ 2` and `x ≠ -1`.", "The top is 0 at `x = 2` and at `x = -2`, so the `x`-intercepts are (2, 0) and (−2, 0).", "`y`-intercept: `f(0) = (-4)/(-2) = 2`, so it’s (0, 2)."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: both make the original denominator 0.", "", "Step 4 is true. The mistake is earlier."],
            fixes:[
              { t:"`x = 2` isn’t in the domain. `(x - 2)` cancels, so `x = 2` is a hole at (2, 4/3). The only `x`-intercept is (−2, 0).", ok:true, why:"An `x`-intercept must be a point on the graph, and `x = 2` is excluded." },
              { t:"`x = 2` is a vertical asymptote, so the only `x`-intercept is (−2, 0).", why:"The intercept is right now, but the reason isn’t: `(x - 2)` cancels completely, so `x = 2` is a hole at (2, 4/3)." },
              { t:"Add (−1, 0): the bottom is 0 at `x = -1`, so that’s an `x`-intercept too.", why:"Zeros of the denominator are restrictions, not intercepts. `x = -1` is a vertical asymptote." },
              { t:"Step 3 is correct as written.", why:"At `x = 2` the original is 0/0, so there’s no point on the graph there. A zero that cancels gives a hole, not an intercept." }],
            hints:["Before you call a zero of the top an intercept, check that it’s in the domain.", "Is `x = 2` one of the restrictions in step 2?", "Step 3 is wrong: `x = 2` is excluded. Simplified, `f(x) = {x + 2}/{x + 1}`, `x ≠ 2`. There’s a hole at (2, 4/3), and the only `x`-intercept is (−2, 0)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the lab: a hole being one missing point, a second copy of a factor turning a hole into an asymptote, or a curve hugging a slanted line?" },
      { id:"j2", q:"In your own words, explain why cancelling `(x - a)` usually leaves a hole, and when it leaves a vertical asymptote instead." },
      { id:"j3", q:"Explain to a friend, step by step, how to find the oblique asymptote of `f(x) = {x^2 + 2x + 5}/{x - 1}`, and how to tell which side of it the graph is on for large `x`." },
      { id:"j4", q:"Which step still feels shaky: factoring, deciding hole or asymptote, dividing, or deciding above or below? What will you do about it before module 22?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Where is the hole in the graph of `f(x) = {x^2 - 2x - 8}/{x - 4}`?", options:[
          { t:"(4, 6)", ok:true, why:"`x^2 - 2x - 8 = (x - 4)(x + 2)`, so `f(x) = x + 2` with `x ≠ 4`. At `x = 4` the line’s height is 6." },
          { t:"(4, 0)", why:"At `x = 4` the original gives 0/0, not 0. Use the simplified `x + 2`: 4 + 2 = 6." },
          { t:"(−2, 0)", why:"That’s the `x`-intercept, from the factor `(x + 2)`. The hole comes from the factor that cancels, `(x - 4)`." },
          { t:"(−4, −2)", why:"`(x - 4)` is 0 at `x = 4`, not −4." }] },
        b:{ prompt:"Where is the hole in the graph of `f(x) = {x^2 + 4x - 5}/{x + 5}`?", options:[
          { t:"(−5, −6)", ok:true, why:"`x^2 + 4x - 5 = (x + 5)(x - 1)`, so `f(x) = x - 1` with `x ≠ -5`. At `x = -5` the height is −6." },
          { t:"(−5, 0)", why:"0/0 isn’t 0. Use the simplified `x - 1`: −5 − 1 = −6." },
          { t:"(1, 0)", why:"That’s the `x`-intercept, from `(x - 1)`. The hole comes from the factor that cancels, `(x + 5)`." },
          { t:"(5, 4)", why:"`(x + 5)` is 0 at `x = -5`, not 5." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"What is the oblique asymptote of `f(x) = {x^2 + 5x + 2}/{x + 2}`?", options:[
          { t:"`y = x + 3`", ok:true, why:"Synthetic division with −2 gives 1, 3, −4, so `f(x) = x + 3 - {4}/{x + 2}`, and the remainder term shrinks to 0." },
          { t:"`y = x + 7`", why:"That divides with 2 in the corner. For `x + 2` the corner is −2." },
          { t:"`y = x - 1`", why:"That adds the remainder −4 into the line. The remainder belongs to `{-4}/{x + 2}`." },
          { t:"`y = 1`", why:"The ratio of the leading coefficients gives a horizontal asymptote only when the degrees are equal. Here the top is one degree higher." }] },
        b:{ prompt:"What is the oblique asymptote of `f(x) = {x^2 - 3x + 5}/{x - 1}`?", options:[
          { t:"`y = x - 2`", ok:true, why:"Synthetic division with 1 gives 1, −2, 3, so `f(x) = x - 2 + {3}/{x - 1}`." },
          { t:"`y = x - 4`", why:"That divides with −1 in the corner. For `x - 1` the corner is 1." },
          { t:"`y = x + 1`", why:"That adds the remainder 3 into the line. The remainder belongs to `{3}/{x - 1}`." },
          { t:"`y = 1`", why:"The ratio rule needs equal degrees. Here the top is one degree higher." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which function has an oblique asymptote?", options:[
          { t:"`f(x) = {x^2 + 1}/{x - 3}`", ok:true, why:"The top’s degree is exactly one more than the bottom’s, and `x - 3` isn’t a factor of the top. Division gives `y = x + 3`." },
          { t:"`f(x) = {x + 1}/{x^2 - 3}`", why:"The degrees do differ by one, but the higher degree is on the bottom. Lower degree on top gives the horizontal asymptote `y = 0`." },
          { t:"`f(x) = {2x^2 + 1}/{x^2 - 3}`", why:"Equal degrees give a horizontal asymptote: `y = 2`." },
          { t:"`f(x) = {x^3 + 1}/{x - 3}`", why:"The top must be exactly one degree higher. Here it’s two degrees higher, so dividing gives a quadratic: the ends follow a parabola-like curve, not a line." }] },
        b:{ prompt:"Which function has an oblique asymptote?", options:[
          { t:"`f(x) = {3x^2 - x}/{x + 2}`", ok:true, why:"One degree higher on top, and `x = -2` doesn’t make the top 0 (3(−2)² − (−2) = 14). Division gives `y = 3x - 7`." },
          { t:"`f(x) = {3x - 1}/{x^2 + 2}`", why:"The degrees differ by one, but the higher degree is on the bottom. Lower degree on top gives the horizontal asymptote `y = 0`." },
          { t:"`f(x) = {3x^2 - x}/{x^2 + 2}`", why:"Equal degrees: the horizontal asymptote is `y = 3`." },
          { t:"`f(x) = {3x^3 - x}/{x + 2}`", why:"The top must be exactly one degree higher. Here it’s two degrees higher, so the quotient is a quadratic, not a line." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"For one value of `k`, the graph of `f(x) = {x^2 + kx - 10}/{x - 2}` has a hole instead of a vertical asymptote. Where is the hole?", options:[
          { t:"(2, 7)", ok:true, why:"A hole needs `x - 2` to be a factor of the top: `4 + 2k - 10 = 0`, so `k = 3`. Then `x^2 + 3x - 10 = (x - 2)(x + 5)`, and `x + 5` at `x = 2` is 7." },
          { t:"(2, 0)", why:"That reads 0/0 as 0. With `k = 3` the simplified function is `x + 5`, which is 7 at `x = 2`." },
          { t:"(−5, 0)", why:"That’s the `x`-intercept, from the factor `(x + 5)`. The hole is at the factor that cancels, `x = 2`." },
          { t:"(−2, −7)", why:"That makes `x = -2` a zero of the top (`k = -3`) and cancels `(x + 2)`. The bottom is `x - 2`, so the top must be 0 at `x = 2`." }] },
        b:{ prompt:"For one value of `k`, the graph of `f(x) = {x^2 + kx + 6}/{x + 3}` has a hole instead of a vertical asymptote. Where is the hole?", options:[
          { t:"(−3, −1)", ok:true, why:"The top must be 0 at `x = -3`: `9 - 3k + 6 = 0`, so `k = 5`. Then `x^2 + 5x + 6 = (x + 3)(x + 2)`, and `x + 2` at `x = -3` is −1." },
          { t:"(−3, 0)", why:"0/0 isn’t 0. The simplified function `x + 2` gives −1." },
          { t:"(−2, 0)", why:"That’s the `x`-intercept, from `(x + 2)`. The hole is at the factor that cancels, `x = -3`." },
          { t:"(3, 1)", why:"That makes `x = 3` a zero of the top (`k = -5`) and cancels `(x - 3)`. The bottom is `x + 3`, so the top must be 0 at `x = -3`." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Describe the graph of `f(x) = {(x - 1)(x + 2)^2}/{(x - 1)^2(x + 2)}` at its two restrictions.", options:[
          { t:"`x = 1` is a vertical asymptote, and there’s a hole at (−2, 0)", ok:true, why:"Cancel one `(x - 1)` and one `(x + 2)`: `f(x) = {x + 2}/{x - 1}`. A copy of `(x - 1)` is left on the bottom, so `x = 1` is an asymptote. No `(x + 2)` is left on the bottom, so `x = -2` is a hole, and the simplified function is 0 there." },
          { t:"There are holes at `x = 1` and `x = -2`", why:"Both factors cancel, but only `(x + 2)` cancels completely from the bottom. One copy of `(x - 1)` is still there." },
          { t:"`x = 1` and `x = -2` are both vertical asymptotes", why:"After cancelling, no copy of `(x + 2)` is left on the bottom, so `x = -2` is a hole." },
          { t:"`x = 1` is a vertical asymptote, and (−2, 0) is an `x`-intercept", why:"`x = -2` makes the original denominator 0, so it isn’t in the domain. (−2, 0) is a hole on the `x`-axis, not an intercept." }] },
        b:{ prompt:"Describe the graph of `f(x) = {(x + 3)^2(x - 2)}/{(x + 3)(x - 2)^2}` at its two restrictions.", options:[
          { t:"`x = 2` is a vertical asymptote, and there’s a hole at (−3, 0)", ok:true, why:"Cancel one `(x + 3)` and one `(x - 2)`: `f(x) = {x + 3}/{x - 2}`. A copy of `(x - 2)` is left on the bottom, so `x = 2` is an asymptote. No `(x + 3)` is left on the bottom, so `x = -3` is a hole, at height 0." },
          { t:"There are holes at `x = 2` and `x = -3`", why:"Only `(x + 3)` cancels completely from the bottom. One copy of `(x - 2)` is still there." },
          { t:"`x = 2` and `x = -3` are both vertical asymptotes", why:"After cancelling, no copy of `(x + 3)` is left on the bottom, so `x = -3` is a hole." },
          { t:"`x = 2` is a vertical asymptote, and (−3, 0) is an `x`-intercept", why:"`x = -3` isn’t in the domain. (−3, 0) is a hole on the `x`-axis, not an intercept." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"As `x -> ∞`, which line does the graph of `f(x) = {x^2 + x - 4}/{x - 2}` approach, and from which side?", options:[
          { t:"`y = x + 3`, from above", ok:true, why:"Division with 2 in the corner gives 1, 3, 2, so `f(x) = x + 3 + {2}/{x - 2}`. For `x > 2` the remainder term is positive, so the graph is above the line, and the gap shrinks to 0." },
          { t:"`y = x + 3`, from below", why:"The remainder 2 is positive, and so is `x - 2` for large `x`, so `{2}/{x - 2} > 0`: the graph is above the line." },
          { t:"`y = x - 1`, from below", why:"That comes from dividing with −2 in the corner. For `x - 2` the corner is 2." },
          { t:"`y = x + 5`, from above", why:"That adds the remainder 2 into the line. The remainder belongs to `{2}/{x - 2}`." }] },
        b:{ prompt:"As `x -> ∞`, which line does the graph of `f(x) = {x^2 - x - 9}/{x + 2}` approach, and from which side?", options:[
          { t:"`y = x - 3`, from below", ok:true, why:"Division with −2 in the corner gives 1, −3, −3, so `f(x) = x - 3 - {3}/{x + 2}`. For large `x` the remainder term is negative: the graph is below the line." },
          { t:"`y = x - 3`, from above", why:"`{-3}/{x + 2} < 0` when `x > -2`, so the graph is below the line." },
          { t:"`y = x + 1`, from below", why:"That divides with 2 in the corner. For `x + 2` the corner is −2." },
          { t:"`y = x - 6`, from below", why:"That adds the remainder −3 into the line. The remainder belongs to `{-3}/{x + 2}`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which statement correctly describes `f(x) = {x^2 - 9}/{x - 3}`?", options:[
          { t:"“`f(x) = x + 3`, `x ≠ 3`. The graph is the line `y = x + 3` with a hole at (3, 6).”", ok:true, why:"Correct formula, correct restriction, correct hole." },
          { t:"“`f(x) = x + 3`. The graph is the line `y = x + 3`.”", why:"Without `x ≠ 3` this claims `f(3) = 6`, but the original isn’t defined at `x = 3`." },
          { t:"“`f(x) = x + 3`, `x ≠ 3`. The graph has a vertical asymptote `x = 3`.”", why:"`(x - 3)` cancels completely, so there’s no asymptote, just one missing point." },
          { t:"“`f(x) = x + 3`, `x ≠ 3`. The graph is the line `y = x + 3` with a hole at (3, 0).”", why:"The hole sits on the line: at `x = 3`, `y = 3 + 3 = 6`." }] },
        b:{ prompt:"Which statement correctly describes `f(x) = {x^2 - 16}/{x + 4}`?", options:[
          { t:"“`f(x) = x - 4`, `x ≠ -4`. The graph is the line `y = x - 4` with a hole at (−4, −8).”", ok:true, why:"Correct formula, correct restriction, correct hole." },
          { t:"“`f(x) = x - 4`. The graph is the line `y = x - 4`.”", why:"Without `x ≠ -4` this claims `f(-4) = -8`, but the original isn’t defined at `x = -4`." },
          { t:"“`f(x) = x - 4`, `x ≠ -4`. The graph has a vertical asymptote `x = -4`.”", why:"`(x + 4)` cancels completely, so there’s no asymptote." },
          { t:"“`f(x) = x - 4`, `x ≠ -4`. The graph is the line `y = x - 4` with a hole at (−4, 0).”", why:"The hole sits on the line: at `x = -4`, `y = -4 - 4 = -8`." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why the graph of `f(x) = {x^2 + 1}/{x - 2}` gets closer and closer to the line `y = x + 2` as `x` grows?", options:[
          { t:"“Division gives `f(x) = x + 2 + {5}/{x - 2}`. As `x` grows, `{5}/{x - 2}` shrinks toward 0, so `f(x)` gets closer and closer to `x + 2`.”", ok:true, why:"It names the division, the remainder term and the reason the term vanishes." },
          { t:"“For large `x` only the leading terms matter, so `f(x)` behaves like `x^2 ÷ x = x`, and the line `y = x + 2` has that same slope, 1.”", why:"Leading terms give only the slope. `y = x + 1` and `y = x` also have slope 1. Only the whole quotient, `x + 2`, picks out the right line." },
          { t:"“`x - 2` is 0 at `x = 2`, so the graph has a vertical asymptote there, and every graph with a vertical asymptote also has a slanted one.”", why:"`x = 2` explains the vertical asymptote only. `{x + 1}/{x - 2}` has the same vertical asymptote and no slanted one." },
          { t:"“Division leaves the remainder 5, and that remainder gets smaller and smaller as `x` grows, so `f(x)` gets closer and closer to `x + 2`.”", why:"The remainder is always 5. What shrinks is the remainder term `{5}/{x - 2}`, because its denominator grows." }] },
        b:{ prompt:"Which is the best explanation of why the graph of `f(x) = {x^2 - 3}/{x + 1}` gets closer and closer to the line `y = x - 1` as `x` grows?", options:[
          { t:"“Division gives `f(x) = x - 1 - {2}/{x + 1}`. As `x` grows, `{2}/{x + 1}` shrinks toward 0, so `f(x)` gets closer and closer to `x - 1`.”", ok:true, why:"It names the division, the remainder term and the reason the term vanishes." },
          { t:"“For large `x` only the leading terms matter, so `f(x)` behaves like `x^2 ÷ x = x`, and the line `y = x - 1` has that same slope, 1.”", why:"Leading terms give only the slope. `y = x` and `y = x + 1` also have slope 1. Only the whole quotient, `x - 1`, picks out the right line." },
          { t:"“`x + 1` is 0 at `x = -1`, so the graph has a vertical asymptote there, and every graph with a vertical asymptote also has a slanted one.”", why:"`x = -1` explains the vertical asymptote only. `{x - 3}/{x + 1}` has the same vertical asymptote and no slanted one." },
          { t:"“Division leaves the remainder −2, and that remainder gets smaller and smaller as `x` grows, so `f(x)` gets closer and closer to `x - 1`.”", why:"The remainder is always −2. What shrinks is the remainder term `{2}/{x + 1}`, because its denominator grows." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A bakery’s total cost to bake `n` cakes in a day is `C(n) = 0.5n^2 + 10n + 72` dollars (overtime makes extra cakes cost more). The average cost per cake is `A(n) = {C(n)}/{n}`. Use the oblique asymptote of `A` to estimate the average cost per cake for an order of 200 cakes.", options:[
          { t:"About $110", ok:true, why:"`A(n) = 0.5n + 10 + {72}/{n}`. For large `n`, `{72}/{n}` is tiny, so `A` is close to the line `0.5n + 10`. At `n = 200`: 0.5(200) + 10 = 110. (The exact value is $110.36.)" },
          { t:"About $0.50", why:"0.5 is the ratio of the leading coefficients, which gives an asymptote only when the degrees are equal. Here the top is one degree higher, so the asymptote is a slanted line." },
          { t:"About $10", why:"This keeps only the constant 10. The `0.5n` part doesn’t shrink: it grows with `n`. Only `{72}/{n}` shrinks." },
          { t:"About $182", why:"This adds the fixed cost 72 into the line: 0.5(200) + 10 + 72. The 72 is divided by `n`, so it adds only 72/200 = 0.36." }] },
        b:{ prompt:"A print shop’s total cost to print `n` posters is `C(n) = 0.2n^2 + 6n + 45` dollars (extra posters need overtime). The average cost per poster is `A(n) = {C(n)}/{n}`. Use the oblique asymptote of `A` to estimate the average cost per poster for an order of 300 posters.", options:[
          { t:"About $66", ok:true, why:"`A(n) = 0.2n + 6 + {45}/{n}`, which is close to `0.2n + 6` for large `n`. At `n = 300`: 60 + 6 = 66. (The exact value is $66.15.)" },
          { t:"About $0.20", why:"0.2 is the ratio of the leading coefficients. With one more degree on top, the asymptote is a slanted line." },
          { t:"About $6", why:"This keeps only the constant 6. The `0.2n` part grows with `n`; only `{45}/{n}` shrinks." },
          { t:"About $111", why:"0.2(300) + 6 + 45 = 111 adds the fixed cost into the line. The 45 is divided by `n`, so it adds only 45/300 = 0.15." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Which describes the graph of `f(x) = {x^3 + 2x^2 + x + 3}/{x^2 + 1}`?", options:[
          { t:"No vertical asymptote; oblique asymptote `y = x + 2`; the graph is above the asymptote everywhere", ok:true, why:"`x^2 + 1` is never 0, so there’s no vertical asymptote. `x^3 + 2x^2 + x + 3 = (x^2 + 1)(x + 2) + 1`, so `f(x) = x + 2 + {1}/{x^2 + 1}`, and that last term is always positive." },
          { t:"Vertical asymptotes `x = 1` and `x = -1`; oblique asymptote `y = x + 2`", why:"`x^2 + 1` isn’t `x^2 - 1`. `x^2 + 1` is at least 1 for every `x`, so the denominator is never 0." },
          { t:"No vertical asymptote; horizontal asymptote `y = 1`", why:"The top is one degree higher than the bottom, so the asymptote is slanted, not horizontal." },
          { t:"No vertical asymptote; oblique asymptote `y = x + 2`; the graph is above it on the right and below it on the left", why:"That pattern comes from a linear denominator. Here the remainder term is `{1}/{x^2 + 1}`, which is positive on both sides." }] },
        b:{ prompt:"Which describes the graph of `f(x) = {x^3 - x^2 + x - 3}/{x^2 + 1}`?", options:[
          { t:"No vertical asymptote; oblique asymptote `y = x - 1`; the graph is below the asymptote everywhere", ok:true, why:"`x^2 + 1` is never 0. `x^3 - x^2 + x - 3 = (x^2 + 1)(x - 1) - 2`, so `f(x) = x - 1 - {2}/{x^2 + 1}`, and `{-2}/{x^2 + 1} < 0` for every `x`." },
          { t:"Vertical asymptotes `x = 1` and `x = -1`; oblique asymptote `y = x - 1`", why:"`x^2 + 1` is at least 1 for every `x`, so the denominator is never 0." },
          { t:"No vertical asymptote; horizontal asymptote `y = 1`", why:"The top is one degree higher, so the asymptote is slanted." },
          { t:"No vertical asymptote; oblique asymptote `y = x - 1`; the graph is below it on the right and above it on the left", why:"The remainder term `{-2}/{x^2 + 1}` is negative on both sides, so the graph is below the line everywhere." }] } }
    ]
  },
  task:{
    title:"Three features, one function", summary:"Three features, one function",
    statement:"<p>Use the factor tiles to build a function whose graph has <strong>exactly one hole, at `x = -1`</strong>, <strong>exactly one vertical asymptote, `x = 3`</strong>, and the <strong>oblique asymptote `y = x + 2`</strong>. There’s more than one way. Can you find them all?</p>",
    checks:["Exactly one hole, at `x = -1`", "The only vertical asymptote is `x = 3`", "The oblique asymptote is `y = x + 2`"],
    tips:[
      "A hole at `x = -1` needs `(x + 1)` on the top and on the bottom, with no other matching pair. Right now the holes are: §1.",
      "After cancelling, the bottom must be exactly `(x - 3)`. Right now the vertical asymptotes are: §1.",
      "Right now: §1. Keep the constant factor at 1, since it multiplies the slope. Once the `(x + 1)`s cancel you have `{(x - a)(x - b)}/{x - 3}`. Dividing gives the quotient `x + (3 - a - b)`. What must `a + b` be?"
    ],
    ui:{ none:"none", preview:"Preview", rowsNote:"Cancelling is automatic in the preview." },
    explainPrompt:"Explain how you chose your tiles so that all three features happen.",
    vocab:"Use the words hole, vertical asymptote, divide and remainder.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    all4:"You found all four. In each one, the two zeros left on top add to 1. Dividing `(x - a)(x - b)` by `x - 3` gives the quotient `x + (3 - a - b)`, so `a + b = 1` makes it `x + 2`. (The pair −2 and 3 also adds to 1, but its `(x - 3)` would cancel the asymptote.)"
  },
  cards:[
    ["Hole", "A single missing point on the graph. It happens at `x = a` when `(x - a)` cancels completely from the denominator. `{x^2 - 4}/{x - 2}` is the line `y = x + 2` with a hole at (2, 4)."],
    ["Finding a hole’s coordinates", "Factor, cancel, then put `x = a` into the simplified function (never the original, which gives 0/0). `{x^2 - x - 2}/{x^2 - 4} = {x + 1}/{x + 2}`, `x ≠ 2`, so the hole is (2, 3/4)."],
    ["Hole or vertical asymptote?", "Count the copies of `(x - a)`. If a copy is still on the bottom after cancelling, it’s a vertical asymptote; if not, a hole. `{x - 1}/{(x - 1)^2}` has an asymptote at `x = 1`."],
    ["Restrictions after cancelling", "They come from the original denominator and they stay: `{x^2 - 9}/{x - 3} = x + 3`, `x ≠ 3`."],
    ["Oblique asymptote", "A slanted line `y = mx + b` that the graph approaches as `x -> ±∞`. It happens when the top’s degree is exactly one more than the bottom’s, and the division leaves a remainder that isn’t 0."],
    ["Finding an oblique asymptote", "Divide: `f(x) =` quotient + remainder/divisor. The quotient is the asymptote. `{x^2 + x + 1}/{x - 1} = x + 2 + {3}/{x - 1}`, so `y = x + 2`."],
    ["Above or below the oblique asymptote?", "Check the sign of the remainder term. `{3}/{x - 1} > 0` for `x > 1`, so the graph is above `y = x + 2` on the right, and below it on the left."],
    ["Degrees decide the far-out behaviour", "Cancel any common factors first, then compare the degrees. Lower on top: `y = 0`. Equal: `y` = ratio of the leading coefficients. One more on top: an oblique asymptote. Two or more on top: no horizontal or oblique asymptote. (If the whole denominator cancels, the graph is a polynomial with holes, and has no asymptotes.)"],
    ["Synthetic division by `x + 3`", "Put −3 in the corner: the zero of the divisor. `(x^2 + 4x + 5) ÷ (x + 3)` gives 1, 1, 2, so the quotient is `x + 1` and the remainder is 2."],
    ["`x`-intercepts of a rational function", "Zeros of the simplified numerator that are in the domain. A zero that cancels gives a hole, not an intercept."],
    ["Can a graph cross its oblique asymptote?", "For a quadratic over a linear, never: the remainder `R` isn’t 0, so `R/(x - a)` is never 0. With a quadratic denominator it can: `{x^3 + 2x^2 + 3x + 1}/{x^2 + 1} = x + 2 + {2x - 1}/{x^2 + 1}` crosses `y = x + 2` at `x = 1/2`."],
    ["A hole on the `x`-axis", "`{(x - 3)^2}/{x - 3} = x - 3`, `x ≠ 3`, so the hole is (3, 0). It looks like an intercept, but `x = 3` isn’t in the domain."]
  ]
};
