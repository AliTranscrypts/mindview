// MHF4U 22 Rational Equations and Inequalities. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/22-rational-equations-and-inequalities.md

// Practice 1 ("How many solutions?"): generic mistake feedback and generated hints (plan: "Hints, generated per item")
const BOXN = { none:"No solution", one:"Exactly one", two:"Exactly two", all:"Every allowed `x`" };
const H1 = "State the restrictions, then multiply every term by the LCD.";
function sortItem(id, t, box, why, likely, likelyFb, restr, cleared, cands, verdicts, hints){
  const wrong = {};
  for (const b of Object.keys(BOXN)) if (b !== box) wrong[b] = b === likely ? likelyFb : "Clear the denominators, list the candidates, then check each one against the restrictions " + restr + ". Count what’s left.";
  return { id, t, answer:box, why, wrong, hints:hints || [H1, "The cleared form is " + cleared + ". Its candidates are " + cands + ".", "Check each candidate against " + restr + ": " + verdicts + ". So it goes in <strong>" + BOXN[box] + "</strong>."] };
}

export default {
  id:"22-rational-equations-and-inequalities",
  kind:"topic",
  title:"Rational equations and inequalities",
  topic:"Rational Equations and Inequalities",
  readyTopic:"rational equations and inequalities",
  hero:{
    eq:"<span class=\"hside hl\">`{2x}/{x - 3}`</span> `=` <span class=\"hside hr\">`{6}/{x - 3} + x`</span>",
    eqLabel:"2x over x minus 3 equals 6 over x minus 3, plus x. The left side is underlined in blue and the right side in teal, matching the two curves.",
    eqSize:"md",
    headline:"Not every answer is a solution",
    text:"A <strong>rational equation</strong> has the variable in a denominator. Multiplying by the <strong>lowest common denominator</strong> turns it into a polynomial equation you already know how to solve, but that step can produce a <strong>candidate</strong> that doesn’t work: one that makes an original denominator 0. That’s an <strong>extraneous root</strong>. Graphs show why. For <strong>rational inequalities</strong>, you’ll use a <strong>sign chart</strong> in which <strong>restrictions</strong> are never included.",
    fig:{ aria:"Graphs of y = 2x/(x − 3) in blue and y = 6/(x − 3) + x in teal, with the vertical asymptote x = 3. The candidate x = 2 meets the curves at (2, −4); the candidate x = 3 lies on the asymptote and is extraneous." }
  },
  goals:[
    "I can state the restrictions on a rational equation or inequality before solving, and explain why they matter.",
    "I can solve a rational equation by multiplying every term by the lowest common denominator, then check each candidate and reject extraneous roots.",
    "I can connect the real solutions of a rational equation to where two graphs meet, and to the `x`-intercepts of `y = L(x) - R(x)`.",
    "I can explain how the solution of an inequality differs from the solution of an equation, and check whether given values satisfy an inequality.",
    "I can solve a rational inequality with a sign chart, never including a restriction, and write the answer in interval notation.",
    "I can use rational equations and inequalities to solve problems, including working backwards from a given solution."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rational expressions", goal:1, prompt:"For which values of `x` is `{x + 5}/{x^2 - 9}` undefined?",
          options:[
            { t:"`x = 3` and `x = -3`", ok:true, why:"A fraction is undefined where its denominator is 0. `x^2 - 9 = (x - 3)(x + 3)` is 0 at `x = 3` and at `x = -3`." },
            { t:"`x = 3` only", why:"`x^2 = 9` has two solutions: `(-3)^2` is also 9." },
            { t:"`x = -5`", why:"`x = -5` makes the <strong>top</strong> 0, so the fraction equals 0 there. That’s allowed. Only the bottom can’t be 0." },
            { t:"`x = 9`", why:"If `x = 9`, then `x^2 - 9 = 72`, not 0. Take the square root: `x = ±3`." }],
          hints:["A fraction is undefined where its denominator is 0.", "Solve `x^2 - 9 = 0`. It’s a difference of squares.", "`(x - 3)(x + 3) = 0`, so `x = 3` or `x = -3`. Those are the restrictions."] },
        { id:"w2", skill:"Rational expressions", goal:2, prompt:"Write `{2}/{x} + {3}/{x + 1}` as a single fraction.",
          options:[
            { t:"`{5x + 2}/{x(x + 1)}`", ok:true, why:"Over the common denominator `x(x + 1)`: `{2(x + 1)}/{x(x + 1)} + {3x}/{x(x + 1)} = {2x + 2 + 3x}/{x(x + 1)} = {5x + 2}/{x(x + 1)}`." },
            { t:"`{5}/{2x + 1}`", why:"Fractions don’t add that way: `1/2 + 1/2` isn’t `2/4`. Rewrite both over a common denominator first." },
            { t:"`{5x + 3}/{x(x + 1)}`", why:"Each numerator gets the factor it’s <strong>missing</strong>: 2 is multiplied by `(x + 1)`, and 3 by `x`. That gives `2x + 2 + 3x`." },
            { t:"`{5x + 2}/{2x + 1}`", why:"The top is right, but the common denominator is the product `x(x + 1)`, not the sum `x + (x + 1)`." }],
          hints:["Find the lowest common denominator: what do `x` and `x + 1` multiply to?", "The LCD is `x(x + 1)`. Multiply `{2}/{x}` by `{x + 1}/{x + 1}` and `{3}/{x + 1}` by `{x}/{x}`.", "`{2x + 2}/{x(x + 1)} + {3x}/{x(x + 1)} = {5x + 2}/{x(x + 1)}`."] },
        { id:"w3", skill:"Solving by factoring", goal:2, prompt:"Solve `x^2 - x - 12 = 0`.",
          options:[
            { t:"`x = 4` or `x = -3`", ok:true, why:"`x^2 - x - 12 = (x - 4)(x + 3)`, and a product is 0 only when a factor is 0." },
            { t:"`x = -4` or `x = 3`", why:"`(x - 4)` is 0 when `x = 4`, not −4. Check: `(-4)^2 - (-4) - 12 = 8`, not 0." },
            { t:"`x = 12` or `x = 13`", why:"Writing `x(x - 1) = 12` and setting `x = 12` doesn’t work: the rule ‘a factor must be 0’ only works when the product is 0." },
            { t:"No real solution", why:"`b^2 - 4ac = (-1)^2 - 4(1)(-12) = 1 + 48 = 49`, which is positive: two real roots." }],
          hints:["Look for two numbers that multiply to −12 and add to −1.", "−4 and 3 work: `(x - 4)(x + 3) = 0`.", "`x - 4 = 0` or `x + 3 = 0`, so `x = 4` or `x = -3`."] },
        { id:"w4", skill:"Polynomial inequalities", goal:5, prompt:"Solve `(x - 2)(x + 5) < 0`.",
          options:[
            { t:"`(-5, 2)`", ok:true, why:"The zeros −5 and 2 split the line into three intervals. Test `x = 0`: `(-2)(5) = -10 < 0`, so the middle interval works, and the outer ones are positive." },
            { t:"`(-∞, -5) ∪ (2, ∞)`", why:"There the product is positive (test `x = 3`: `(1)(8) = 8`). The question asks where it’s negative." },
            { t:"`(-2, 5)`", why:"`x - 2 = 0` at `x = 2`, and `x + 5 = 0` at `x = -5`." },
            { t:"`[-5, 2]`", why:"At −5 and 2 the product is 0, and `0 < 0` is false. Use round brackets." }],
          hints:["Find where the product is 0, then test one value in each interval.", "The zeros are `x = -5` and `x = 2`. Test `x = 0` in the middle interval.", "`(0 - 2)(0 + 5) = -10 < 0`, so the middle interval works: `(-5, 2)`."] },
        { id:"w5", skill:"Polynomial inequalities", goal:5, prompt:"Which is the interval notation for ‘`x < -1` or `x ≥ 3`’?",
          options:[
            { t:"`(-∞, -1) ∪ [3, ∞)`", ok:true, why:"Round bracket at −1 (strict <), square bracket at 3 (≥ includes it), round at ±∞, and ∪ for ‘or’." },
            { t:"`(-∞, -1] ∪ [3, ∞)`", why:"`x < -1` doesn’t include −1, so it takes a round bracket." },
            { t:"`[-1, 3)`", why:"`[-1, 3)` is the set of values <strong>between</strong> them, which is exactly what’s left out." },
            { t:"`(-∞, -1) ∩ [3, ∞)`", why:"∩ means ‘and’ (in both), and these two pieces don’t overlap. ‘Or’ is ∪." }],
          hints:["Write each piece separately, then join them.", "`x < -1` is `(-∞, -1)`. `x ≥ 3` is `[3, ∞)`.", "‘Or’ joins with ∪: `(-∞, -1) ∪ [3, ∞)`."] },
        { id:"w6", skill:"Asymptotes", goal:3, prompt:"What is the horizontal asymptote of `y = {3x - 1}/{x + 2}`?",
          options:[
            { t:"`y = 3`", ok:true, why:"For large `|x|` the constants hardly matter, so `y ≈ 3x/x = 3`. The graph never reaches `y = 3`." },
            { t:"`x = -2`", why:"`x = -2` is where the denominator is 0: that’s the <strong>vertical</strong> asymptote." },
            { t:"`y = -1/2`", why:"`-1/2` is the value at `x = 0`, the `y`-intercept. The horizontal asymptote compares the `x`-coefficients." },
            { t:"`y = 0`", why:"`y = 0` is the asymptote only when the top’s degree is lower than the bottom’s. Here both are degree 1." }],
          hints:["Compare the `x`-terms on the top and bottom.", "When `|x|` is huge, `{3x - 1}/{x + 2} ≈ {3x}/{x}`.", "`3x/x = 3`, so the horizontal asymptote is `y = 3`."] }
      ],
      refreshers:{
        "Rational expressions":"A rational expression is undefined where its denominator is 0, so state those restrictions first. `{x + 5}/{x^2 - 9}` has restrictions `x ≠ 3` and `x ≠ -3`, because `x^2 - 9 = (x - 3)(x + 3)`. To add fractions, rewrite each over the lowest common denominator, multiplying each numerator by the factor it’s missing: `{2}/{x} + {3}/{x + 1} = {2(x + 1) + 3x}/{x(x + 1)} = {5x + 2}/{x(x + 1)}`.",
        "Solving by factoring":"Move every term to one side so the other side is 0, factor, then set each factor to 0. `x^2 - x - 12 = 0` becomes `(x - 4)(x + 3) = 0`, so `x = 4` or `x = -3`. The rule only works with 0: `x(x - 1) = 12` does <strong>not</strong> mean `x = 12`.",
        "Polynomial inequalities":"Find the zeros, mark them on a number line, and find the sign in each interval with a test value. For `(x - 2)(x + 5) < 0`: at `x = 0` the product is −10, so `(-5, 2)` works. Round brackets for < and >, square for ≤ and ≥, always round at ±∞, and ∪ to join pieces for ‘or’.",
        "Asymptotes":"For `y = {ax + b}/{cx + d}`, the vertical asymptote is where `cx + d = 0`, and the horizontal asymptote is `y = a/c`. The graph never takes the value `a/c`. For `y = {3x - 1}/{x + 2}`: `x = -2` and `y = 3`. If a factor cancels from the top and bottom, there’s a hole instead of an asymptote: `{x^2 - 4}/{x - 2}` is the line `y = x + 2` with an open circle at (2, 4)."
      }
    }
  },
  explore:{
    heading:"Two-sides grapher",
    intro:"Graph each side of an equation on its own. Where the graphs meet, the two sides are equal. Test the candidates the algebra gives you, then switch to an inequality to shade where one side is bigger.",
    predictions:[
      { id:"p1", prompt:"Clearing the denominator gives one candidate, `x = 2`. Where will the graphs of `y = {x^2 - 4}/{x - 2}` and `y = 4` meet?",
        options:[{ t:"At one point, (2, 4)" }, { t:"Nowhere", ok:true }, { t:"At two points, because `(x - 2)^2 = 0` has a double root" }, { t:"Along a whole stretch, because both are straight lines" }],
        explain:"`{x^2 - 4}/{x - 2}` equals `x + 2` everywhere except at `x = 2`, where it’s undefined. The only place `x + 2` reaches 4 is `x = 2`, and that point is missing from the graph. So the graphs never meet, and `x = 2` is extraneous: the equation has no solution. A double root still gives only one candidate.",
        panel:"Cleared form: `x^2 - 4x + 4 = 0`. Candidate: `x = 2`." },
      { id:"p2", fixedOrder:true, prompt:"The number in the box will slide from −4 up to 6, so the line `y = □` sweeps up the screen. For which value will the equation have no solution?",
        options:[{ t:"`□ = -1`" }, { t:"`□ = 0`" }, { t:"`□ = 1`" }, { t:"`□ = 2`", ok:true }],
        explain:"`y = 2` is the horizontal asymptote of `{2x + 1}/{x - 1}`, so the curve never takes the value 2. The algebra agrees: `2x + 1 = 2(x - 1)` becomes `1 = -2`, which is never true. Every other value works: `□ = -1` gives `x = 0`, `□ = 0` gives `x = -1/2`, and `□ = 1` gives `x = -2`.",
        banner:"No meeting point: `y = 2` is the horizontal asymptote",
        still:"`□ = 1`: the graphs meet at (−2, 1). `□ = 2`: no meeting point, because `y = 2` is the horizontal asymptote. `□ = 3`: the graphs meet at (4, 3)." },
      { id:"p3", prompt:"When the shading turns on, which set will be shaded for `{2x + 1}/{x - 1} < 3`?",
        options:[{ t:"`x > 4` only" }, { t:"`x < 1` or `x > 4`", ok:true }, { t:"`1 < x < 4`" }, { t:"`x < 4`" }],
        explain:"For `x < 1`, `x - 1` is negative, and multiplying by a negative flips the sign, so the shortcut is wrong there. The left branch sits below the horizontal asymptote `y = 2`, so it’s below `y = 3` everywhere: the shortcut lost a whole branch. Part 3 shows the safe method.",
        panel:"Multiply both sides by `(x - 1)`: `2x + 1 < 3(x - 1)`, so `x > 4`." },
      { id:"p4", prompt:"Switch to the Difference view, `y = L(x) - R(x)`. What will you see at `x = 3`?",
        options:[{ t:"An `x`-intercept at (3, 0)" }, { t:"A vertical asymptote `x = 3`" }, { t:"An open circle (a hole) at (3, −1)", ok:true }, { t:"A filled point at (3, −1)" }],
        explain:"`L - R = {2x - 6}/{x - 3} - x = 2 - x` for every `x ≠ 3`. The factor `(x - 3)` cancels, so `x = 3` leaves a hole, not an asymptote. The extraneous candidate is a hole off the axis; the real solution, `x = 2`, is the only `x`-intercept." }
    ],
    chalIntro:"Set the grapher, then press <strong>Check challenge</strong>. Challenges 2 and 3 have their own set-up at the end of the “Choose an equation” menu. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Case 1: set the number in the box so that `x = -2` is a solution of `{2x + 1}/{x - 1} = □`.",
        why:"The left side is 1 at `x = -2`, so `□ = 1`. Check: `2x + 1 = 1(x - 1)` gives `x = -2`.",
        named:{ "-2":"You set the box to the `x`-value. The box is the `y`-value the left side must reach: work out the left side at `x = -2`.",
          "3":"That’s `(-3)/(-1)`. Check the denominator: `-2 - 1 = -3`, so the left side is `(-3)/(-3)`.",
          "2":"`y = 2` is the horizontal asymptote, so no `x` at all gives 2." },
        other:"Your line meets the curve at {x}, not at −2.",
        notCase:"Choose Case 1 in the “Choose an equation” menu first.",
        hints:["If `x = -2` is a solution, the two sides are equal there. What’s the left side at `x = -2`?", "`{2(-2) + 1}/{-2 - 1} = {-3}/{-3}`.", "The left side is 1 at `x = -2`, so set `□ = 1`. Check: `2x + 1 = 1(x - 1)` gives `x = -2`."] },
      { id:"tc2", goal:[4, 5], prompt:"Case 4 in Inequality mode with ≥: build the solution set of `{6}/{x} ≥ x - 1` on the number line, using the graph.",
        why:"Blue is on or above teal for `x ≤ -2` and for `0 < x ≤ 3`: `(-∞, -2] ∪ (0, 3]`. The shading and the full readout are back on, so you can compare.",
        named:{ "[−2, 0) ∪ [3, ∞)":"That’s where the blue curve is on or <strong>below</strong> the line. ≥ asks where it’s on or above.",
          "(−∞, −2] ∪ [0, 3]":"`x = 0` is a restriction (a vertical asymptote). It can never be included, even with ≥.",
          "(−∞, −2) ∪ (0, 3)":"At `x = -2` and `x = 3` the sides are equal, and ≥ includes ‘equal’. Close those endpoints.",
          "(−∞, 3]":"Between −2 and 0 the blue curve dives far below the line: try `x = -1`, where `6/x = -6` but `x - 1 = -2`." },
        other:"Check each interval: is the blue curve on or above the teal line there?",
        setup:"Choose “Challenge 2: build the set for 6/x ≥ x − 1” at the end of the menu first. It turns the number line into a builder.",
        hints:["Find where the curves meet, and where the blue curve has its vertical asymptote.", "They meet at `x = -2` and `x = 3`, and the asymptote is `x = 0`. These three values split the line into four intervals. In each one, is blue on or above teal?", "Blue is on or above teal for `x ≤ -2` and for `0 < x ≤ 3`: `(-∞, -2] ∪ (0, 3]`."] },
      { id:"tc3", goal:[1, 2], stretch:true, prompt:"Case 2: find the number in the box that makes `{x}/{x - 2} = {□}/{x - 2} + 3` have <strong>no solution</strong>.",
        why:"With `□ = 2`, the right side is always 2 more than the left side.",
        named:{ "0":"With 0 the equation has the solution `x = 3` (both sides equal 3). Clearing the denominators gives a candidate for every number. When can that candidate be rejected?",
          "6":"With 6 the candidate is `x = 0`, and `x = 0` really is a solution: `0/(-2) = 0` and `6/(-2) + 3 = 0`. The restriction here is `x = 2`, not `x = 0`.",
          "-2":"With −2 the candidate is `x = 4`, which is allowed: `4/2 = 2` and `-2/2 + 3 = 2`. Watch the sign: the restriction comes from `x - 2 = 0`." },
        other:"Your number gives the candidate `x = (6 - □)/2 =` {v}. It isn’t a restriction, so it’s a real solution. Which number makes the candidate equal 2?",
        empty:"Type a number in the box under the equation, then press Check challenge.",
        setup:"Choose “Challenge 3: Case 2 with a number box” at the end of the menu first. The graph stays hidden until you check.",
        hints:["Clear the denominators: multiply every term by `(x - 2)`. What candidate do you get, in terms of □?", "`x = □ + 3(x - 2)`, so `x = (6 - □)/2`. The equation has no solution only if this candidate is a restriction.", "The restriction is `x = 2`. `(6 - □)/2 = 2` gives `□ = 2`. Check: `x = 2 + 3(x - 2)` gives `x = 2`, which is extraneous."] }
    ]
  },
  part3:{
    slug:"signs", name:"Sign charts", heading:"Sign charts with restrictions",
    intro:"First, see why the multiplying shortcut fails. Then solve three inequalities with a sign chart, and watch the graph fill in as you go.",
    stageA:{
      title:"Stage A: Why not just multiply?",
      how:"Drag the probe along the `x`-axis, or focus it and use the arrow keys (Shift + arrow moves 2). Then press Check.",
      a1:{ ineq:"`{3}/{x + 2} > 1`", shortcut:"Multiply both sides by `(x + 2)`: `3 > x + 2`, so `x < 1`.",
        task:"Find an `x` that the shortcut includes but that isn’t a solution.",
        mid:"That `x` is a solution, and the shortcut includes it, so they agree here. Look where `x + 2` is negative.",
        right:"The shortcut doesn’t include this `x`. Look left of the asymptote.",
        restr:"`x = -2` is a restriction: the left side is undefined.",
        done:"The shortcut kept `(-∞, -2)`, where the left side is negative and can’t be greater than 1. For those `x`, multiplying by `x + 2` should have flipped the sign." },
      a2:{ ineq:"`{2x + 1}/{x - 1} < 3`", shortcut:"`2x + 1 < 3(x - 1)`, so `x > 4`.",
        task:"Find a solution that the shortcut misses.",
        mid:"Here the left side is 3 or more, so this `x` isn’t a solution.",
        right:"The shortcut already includes this one.",
        restr:"`x = 1` is a restriction: the left side is undefined.",
        done:"The shortcut lost `(-∞, 1)`. Shortcut errors go both ways: sometimes extra values, sometimes missing ones." },
      closing:"<strong>The safe method:</strong> move everything to one side, make one fraction, then use a sign chart. That never multiplies by an expression whose sign you don’t know."
    },
    stageB:{
      title:"Stage B: three sign-chart builds",
      stageNames:{ one:"One side, one fraction", crit:"Critical values", signs:"Signs", sol:"Intervals and endpoints" },
      stageHow:{
        one:"Choose the equivalent inequality with 0 on one side, then press Check.",
        crit:"Tap the number line to place each critical value (or move the marker with − and + and press Place). Then tag each one.",
        signs:"Tap each cell to set + or −, then fill the “whole fraction” row. Press Check.",
        sol:"Tap the intervals that solve the inequality, then set each endpoint open ○ or closed ●. Press Check."
      },
      msgs:{
        factor:"{f} is positive when `x` is {gl} than {c}. In this interval `x` is {where}, so the sign is {s}.",
        whole:"Count the − signs in this column: an even number gives +, an odd number gives −.",
        tagBottom:"{xc} makes the denominator {f} equal 0. That’s a restriction, not a zero of the top.",
        tagTop:"{xc} makes the numerator {f} equal 0. That’s a zero of the top, not a restriction.",
        missing:"The fraction can also change sign where its denominator is 0. Is every restriction on the line?",
        missingTop:"A critical value is missing. Where is the top of the fraction equal to 0?",
        extra:"{xc} makes neither the top nor the bottom 0. Remove it.",
        untagged:"Tag each critical value: does it make the top 0, or the bottom 0?",
        fill:"Fill in every cell first: tap a cell to set + or −.",
        empty:"Tap the intervals that solve the inequality first.",
        interval:"In this interval the fraction is {sign}, so it {does} satisfy {need}.",
        endOpenZero:"At {xc} the fraction is 0, and {z} is true. Close this endpoint.",
        endClosedZero:"At {xc} the fraction is 0, and {z} is false. Open this endpoint.",
        endRestr:"At {xc} the fraction is undefined, so it can’t satisfy the inequality. A restriction is always open."
      },
      builds:[
        { id:"b1", goal:5, ineq:"`{x - 3}/{x + 1} ≤ 0`", form:"{x - 3}/{x + 1}", sym:"≤", win:[-5, 6, -6, 6],
          fac:[{ t:"x - 3", a:1, b:-3, top:true }, { t:"x + 1", a:1, b:1 }],
          answer:"(−1, 3]", done:"Solution: `(-1, 3]`. 3 is included (`0 ≤ 0` is true); −1 never is.",
          hints:["Critical values come from the top <strong>and</strong> the bottom.", "`x - 3 = 0` at 3, and `x + 1 = 0` at −1. Test a value in each of the three intervals.", "Signs from left to right: +, −, +. ≤ 0 wants the negative interval and the zero: `(-1, 3]`."] },
        { id:"b2", goal:5, ineq:"`{x}/{x - 2} ≥ 3`", form:"{6 - 2x}/{x - 2}", sym:"≥", win:[-2, 7, -8, 6],
          one:{ prompt:"Which inequality is equivalent, with 0 on one side?",
            options:[
              { t:"`{6 - 2x}/{x - 2} ≥ 0`", ok:true, why:"`{x}/{x - 2} - {3(x - 2)}/{x - 2} = {x - 3x + 6}/{x - 2} = {6 - 2x}/{x - 2}`." },
              { t:"`x ≥ 3(x - 2)`", why:"That multiplies by `x - 2`, whose sign you don’t know." },
              { t:"`{x - 3}/{x - 2} ≥ 0`", why:"You subtracted 3 from the top only. Write 3 as `{3(x - 2)}/{x - 2}` first." },
              { t:"`{-2x - 6}/{x - 2} ≥ 0`", why:"Check the sign: `-3(x - 2) = -3x + 6`, so the top is `x - 3x + 6 = 6 - 2x`." }] },
          fac:[{ t:"6 - 2x", a:-2, b:6, top:true }, { t:"x - 2", a:1, b:-2 }],
          answer:"(2, 3]", done:"Solution: `(2, 3]`.",
          hints:["Subtract 3 from both sides, then write the left side as one fraction.", "`{6 - 2x}/{x - 2} ≥ 0`. Careful: `6 - 2x` is positive for `x < 3` and negative for `x > 3`.", "Signs from left to right: −, +, −. ≥ 0 gives `(2, 3]`."] },
        { id:"b3", goal:5, ineq:"`{2}/{x + 1} < {1}/{x - 1}`", form:"{x - 3}/{(x + 1)(x - 1)}", sym:"<", win:[-4, 6, -4, 4],
          one:{ prompt:"Which inequality is equivalent, with 0 on one side?",
            options:[
              { t:"`{x - 3}/{(x + 1)(x - 1)} < 0`", ok:true, why:"`{2}/{x + 1} - {1}/{x - 1} = {2(x - 1) - (x + 1)}/{(x + 1)(x - 1)} = {x - 3}/{(x + 1)(x - 1)}`." },
              { t:"`2(x - 1) < x + 1`, so `x < 3`", why:"That cross-multiplies by two denominators whose signs you don’t know." },
              { t:"`{x - 1}/{(x + 1)(x - 1)} < 0`", why:"Check the subtraction: `-(x + 1) = -x - 1`, so the top is `2x - 2 - x - 1 = x - 3`." },
              { t:"`{3 - x}/{(x + 1)(x - 1)} < 0`", why:"That’s `{1}/{x - 1} - {2}/{x + 1}`: the order is reversed. Keep left side minus right side." }] },
          fac:[{ t:"x - 3", a:1, b:-3, top:true }, { t:"x + 1", a:1, b:1 }, { t:"x - 1", a:1, b:-1 }],
          answer:"(−∞, −1) ∪ (1, 3)", done:"Solution: `(-∞, -1) ∪ (1, 3)`. All three endpoints are open: two are restrictions, and 3 makes the fraction 0, which isn’t < 0.",
          hints:["Subtract the right side from the left, and use the common denominator `(x + 1)(x - 1)`.", "The top is `2(x - 1) - (x + 1) = x - 3`. Critical values: −1, 1 and 3.", "Signs from left to right: −, +, −, +. < 0 gives `(-∞, -1) ∪ (1, 3)`."] }
      ]
    },
    blocks:[{ title:"What the sign chart means", html:"<p><strong>Solving a rational inequality, in five steps</strong></p><ol><li>State the restrictions.</li><li>Move everything to one side, so the other side is 0. Don’t multiply by anything containing `x`.</li><li>Combine into one fraction, and factor the top and the bottom.</li><li>Mark the critical values (zeros of the top and of the bottom), then find the sign in each interval by counting negative factors or using a test value.</li><li>Choose the intervals with the right sign. Zeros of the top are included for ≤ and ≥. Zeros of the bottom (restrictions) are never included.</li></ol><p>A factor that is squared, such as `(x + 1)^2`, is never negative, so the fraction doesn’t change sign at its critical value.</p><p>An inequality’s answer is a set of intervals; the equation with the same sides has only the critical values where the sides are equal.</p>" }],
    quickCheck:{ title:"Included or not?", summary:"Included or not?",
      items:[
        { id:"q1", goal:5, prompt:"In the solution of `{x + 4}/{x - 2} ≥ 0`, is `x = 2` included?",
          choices:[{ t:"Included", fb:"At `x = 2` the fraction is undefined, so it can’t be ≥ 0. Restrictions always get a round bracket." },
            { t:"Not included", ok:true, fb:"Right. `x = 2` makes the denominator 0, so it’s a restriction and is never included, even with ≥." }] },
        { id:"q2", goal:5, prompt:"In the solution of `{x + 4}/{x - 2} ≥ 0`, is `x = -4` included?",
          choices:[{ t:"Included", ok:true, fb:"Right. At `x = -4` the fraction is 0, and `0 ≥ 0` is true. The full solution is `(-∞, -4] ∪ (2, ∞)`." },
            { t:"Not included", fb:"At `x = -4` the top is 0, so the fraction is 0, and ≥ includes 0. Only zeros of the <strong>bottom</strong> are always left out; a zero of the top is included whenever the sign has ‘or equal to’." }] },
        { id:"q3", goal:5, prompt:"Does `{x - 1}/{(x + 3)^2}` change sign at `x = -3`?",
          choices:[{ t:"Yes, it changes", fb:"Test `x = -4` and `x = -2`: `(-5)/1 = -5` and `(-3)/1 = -3`. Both negative. A squared factor doesn’t flip the sign." },
            { t:"No, it keeps its sign", ok:true, fb:"Right. `(x + 3)^2` is positive on both sides of −3, so only `x - 1` decides the sign, and that’s negative near −3." }] },
        { id:"q4", goal:4, prompt:"Mia solved `{4}/{x + 1} ≥ x - 2` by solving the equation `{4}/{x + 1} = x - 2`. She wrote ‘`x = -2` or `x = 3`’. Is `x = 0` also a solution of the inequality?",
          choices:[{ t:"Yes", ok:true, fb:"Right. `4/(0 + 1) = 4` and `0 - 2 = -2`, and `4 ≥ -2`. Mia found only where the sides are <strong>equal</strong>. The inequality holds on whole intervals: `(-∞, -2] ∪ (-1, 3]`." },
            { t:"No", fb:"Substitute `x = 0`: the left side is `4/1 = 4` and the right side is `0 - 2 = -2`, and `4 ≥ -2` is true. Mia solved the equation, which finds only the values where the sides are equal. The inequality’s solution is a set of intervals: `(-∞, -2] ∪ (-1, 3]`." }] }
      ] }
  },
  practice:{
    activities:[
      { id:"howmany", type:"sorter", title:"How many solutions?", noun:"equation", goal:2,
        instruction:"Solve each equation on paper, then sort it by how many solutions it has. Watch for candidates that break a restriction.",
        how:"Tap an equation, then tap the box it belongs in.",
        boxes:[{ id:"none", label:"No solution" }, { id:"one", label:"Exactly one" }, { id:"two", label:"Exactly two" }, { id:"all", label:"Every allowed `x`" }],
        items:[
          sortItem("s1", "`{3}/{x - 1} = 6`", "one", "`x = 3/2` is allowed, and `3/(1/2) = 6`.", "none", "Clearing gives `x = 3/2`, which isn’t the restriction 1. Check it: `3 ÷ 1/2 = 6`.", "`x ≠ 1`", "`3 = 6x - 6`", "`x = 3/2`", "`x = 3/2` is allowed"),
          sortItem("s2", "`{x}/{x - 4} = {4}/{x - 4}`", "none", "The only candidate, 4, is the restriction: extraneous.", "one", "Clearing gives `x = 4`, but `x = 4` makes the denominator 0. It’s extraneous.", "`x ≠ 4`", "", "", "",
            [H1, "The restriction is `x ≠ 4`. Multiplying by `(x - 4)` gives `x = 4`.", "The only candidate, 4, is the restriction, so it’s extraneous. <strong>No solution.</strong>"]),
          sortItem("s3", "`{8}/{x} = x + 2`", "two", "Both are allowed: `8/(-4) = -2 = -4 + 2`, and `8/2 = 4 = 2 + 2`.", "one", "Check both candidates: neither −4 nor 2 is a restriction (only 0 is).", "`x ≠ 0`", "`x^2 + 2x - 8 = 0`", "`x = -4` and `x = 2`", "both are allowed"),
          sortItem("s4", "`{x^2 - 9}/{x + 3} = x - 3`", "all", "The left side simplifies to `x - 3` for every `x ≠ -3`.", "one", "Clearing gives `0 = 0`, which is always true. Every `x` except the restriction −3 works.", "`x ≠ -3`", "`x^2 - 9 = (x - 3)(x + 3)`, which is always true", "every `x`", "every `x` except −3 is allowed"),
          sortItem("s5", "`{x^2 - 9}/{x + 3} = -6`", "none", "The only candidate is the restriction: the line `y = -6` passes through the hole at (−3, −6).", "one", "`x = -3` makes `x + 3 = 0`. It’s extraneous: the graph has a hole there.", "`x ≠ -3`", "`x^2 + 6x + 9 = 0`", "`x = -3`", "`x = -3` is the restriction, so it’s extraneous"),
          sortItem("s6", "`{x^2}/{x - 2} = {4}/{x - 2}`", "one", "`x = 2` is extraneous; `x = -2` works: `4/(-4) = 4/(-4)`.", "two", "`x = 2` is the restriction, so it’s extraneous. Only `x = -2` is left.", "`x ≠ 2`", "", "", "",
            [H1, "The restriction is `x ≠ 2`. Multiplying by `(x - 2)` gives `x^2 = 4`, so the candidates are −2 and 2.", "2 is extraneous; −2 works (both sides are −1). <strong>Exactly one.</strong>"]),
          sortItem("s7", "`{1}/{x} = {x}/{4}`", "two", "Neither is the restriction 0: `1/2 = 2/4` and `-1/2 = -2/4`.", "one", "Here the restriction is `x = 0`, not 2. Both ±2 are allowed.", "`x ≠ 0`", "`x^2 = 4`", "`x = -2` and `x = 2`", "both are allowed"),
          sortItem("s8", "`{x + 1}/{x - 3} = 1`", "none", "No candidate at all: `y = 1` is the horizontal asymptote.", "one", "Clearing gives `1 = -3`, which is never true. `y = 1` is the horizontal asymptote, so the graph never reaches 1.", "`x ≠ 3`", "`x + 1 = x - 3`, so `1 = -3`", "none, because `1 = -3` is never true", "there is no candidate to check"),
          sortItem("s9", "`{2}/{x + 1} + 1 = {3}/{x + 1}`", "one", "`x = 0` is allowed: `2 + 1 = 3`.", "all", "If you got `2 + 1 = 3`, which is always true, the 1 wasn’t multiplied by `(x + 1)`. Multiply every term: `2 + (x + 1) = 3` gives `x = 0`, which is allowed.", "`x ≠ -1`", "`2 + (x + 1) = 3`", "`x = 0`", "`x = 0` is allowed"),
          sortItem("s10", "`{4}/{x} = -x`", "none", "A square can’t be negative, so there’s no real candidate.", "two", "Multiplying by `x` gives `4 = -x^2`, so `x^2 = -4`, not `x^2 = 4`. A square can’t be negative. Graphically, `y = 4/x` and `y = -x` are in different quadrants.", "`x ≠ 0`", "`x^2 = -4`", "none, because a square can’t be negative", "there is no candidate to check"),
          sortItem("s11", "`{1}/{x - 1} + {1}/{x + 1} = {2x}/{x^2 - 1}`", "all", "Both sides are the same fraction, `{2x}/{x^2 - 1}`, for every `x ≠ ±1`.", "one", "Clearing gives `2x = 2x`, which is always true. Every `x` except ±1 works.", "`x ≠ -1` and `x ≠ 1`", "`(x + 1) + (x - 1) = 2x`, which is always true", "every `x`", "every `x` except ±1 is allowed"),
          sortItem("s12", "`{x + 2}/{x} = {3}/{x - 2}`", "two", "Both are allowed: `1/(-1) = 3/(-3)` and `6/4 = 3/2`.", "one", "Neither −1 nor 4 is a restriction (those are 0 and 2), so both count.", "`x ≠ 0` and `x ≠ 2`", "`x^2 - 3x - 4 = 0`", "`x = -1` and `x = 4`", "both are allowed")
        ] },
      { id:"tyler", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Tyler", how:"",
        instruction:"Tyler made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Solve `{5}/{x - 2} + 2 = {3x}/{x - 2}`.",
            steps:["Restriction: `x ≠ 2`.", "Multiply every term by `(x - 2)`: `5 + 2 = 3x`.", "So `7 = 3x`.", "`x = 7/3`. Since `7/3 ≠ 2`, the solution is `x = 7/3`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 adds correctly, but it uses step 2’s line. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Multiply the 2 by `(x - 2)` as well: `5 + 2(x - 2) = 3x`, so `x = 1`.", ok:true, why:"Every term gets multiplied, including the 2. Check `x = 1`: `5/(-1) + 2 = -3` and `3/(-1) = -3`." },
              { t:"`5(x - 2) + 2(x - 2) = 3x(x - 2)`.", why:"Multiplying `{5}/{x - 2}` by `(x - 2)` leaves just 5. This multiplies the numerators by `(x - 2)` again." },
              { t:"`5 + 2(x - 2) = 3x(x - 2)`.", why:"The left side is right now, but `{3x}/{x - 2}` times `(x - 2)` is just `3x`: the denominator cancels." },
              { t:"Step 2 is correct as written.", why:"Test Tyler’s answer: `x = 7/3` gives `5/(1/3) + 2 = 17` on the left but `7/(1/3) = 21` on the right. The 2 was never multiplied by `(x - 2)`." }],
            hints:["Check that <strong>every</strong> term was multiplied by `(x - 2)`.", "The term 2 has no denominator, but it still has to be multiplied: it becomes `2(x - 2)`.", "Step 2 is wrong. `5 + 2(x - 2) = 3x` gives `2x + 1 = 3x`, so `x = 1`."] },
          { id:"e2", goal:2, task:"Solve `{x}/{x + 1} + {1}/{x - 1} = {2}/{x^2 - 1}`.",
            steps:["Restrictions: `x ≠ -1` and `x ≠ 1`.", "Multiply every term by `(x + 1)(x - 1)`: `x(x - 1) + (x + 1) = 2`.", "`x^2 - x + x + 1 = 2`, so `x^2 = 1` and `x = 1` or `x = -1`.", "The solutions are `x = 1` and `x = -1`."],
            answer:3,
            stepFb:["Step 1 is correct: `x^2 - 1 = (x + 1)(x - 1)`.", "Step 2 is correct: each fraction keeps the factor it was missing.", "Step 3 is correct algebra. These are the candidates. Keep checking.", ""],
            fixes:[
              { t:"Both candidates break a restriction from step 1, so both are extraneous. The equation has no solution.", ok:true, why:"`x = 1` makes `x - 1 = 0` and `x = -1` makes `x + 1 = 0`. Neither can be a solution." },
              { t:"`x = 1` is extraneous, but `x = -1` is a solution.", why:"`x = -1` makes `x + 1 = 0`, so `{x}/{x + 1}` is undefined there too. Check every denominator." },
              { t:"`x = -1` is extraneous, but `x = 1` is a solution.", why:"`x = 1` makes `x - 1 = 0`, so `{1}/{x - 1}` is undefined there too." },
              { t:"Step 4 is correct as written.", why:"Substitute `x = 1` into the original: `1/(1 - 1)` is undefined. A candidate that breaks a restriction can’t be a solution." }],
            hints:["Compare the candidates in step 3 with the restrictions in step 1.", "The restrictions are ±1, and the candidates are ±1.", "Step 4 is wrong. Both candidates are extraneous, so there is no solution."] },
          { id:"e3", goal:5, task:"Solve `{x + 1}/{x - 3} ≥ 2`.",
            steps:["Restriction: `x ≠ 3`.", "Multiply both sides by `(x - 3)`: `x + 1 ≥ 2(x - 3)`.", "`x + 1 ≥ 2x - 6`, so `x ≤ 7`.", "With `x ≠ 3`, the solution is `(-∞, 3) ∪ (3, 7]`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 solves step 2’s line correctly. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Subtract 2 instead: `{x + 1}/{x - 3} - 2 ≥ 0` becomes `{7 - x}/{x - 3} ≥ 0`, and a sign chart gives `(3, 7]`.", ok:true, why:"Moving everything to one side never multiplies by an expression whose sign is unknown." },
              { t:"Multiply by `(x - 3)` and flip the sign: `x + 1 ≤ 2(x - 3)`, so `x ≥ 7`.", why:"Flipping is right only where `x - 3` is negative, that is, for `x < 3`. Test `x = 5`: `(5 + 1)/(5 - 3) = 3 ≥ 2`, but 5 isn’t in `[7, ∞)`." },
              { t:"Subtract 2: `{7 - x}/{x - 3} ≥ 0`. Since the sign is ≥, both critical values are included: `[3, 7]`.", why:"The method is right, but `x = 3` makes the denominator 0, so the fraction is undefined there. A restriction is never included, even with ≥: the answer is `(3, 7]`." },
              { t:"Step 2 is correct as written.", why:"Test `x = 0`, which Tyler’s answer includes: `(0 + 1)/(0 - 3) = -1/3`, and `-1/3 ≥ 2` is false." }],
            hints:["Is `x - 3` positive for every `x`? What happens to an inequality when you multiply by a negative?", "For `x < 3`, `x - 3` is negative, so step 2 would need the sign flipped. One rule can’t cover both cases.", "Step 2 is wrong. Subtract 2: `{7 - x}/{x - 3} ≥ 0`. The sign chart gives `(3, 7]`."] }
        ] },
      { id:"reverse", type:"custom", title:"Reverse and extend", summary:"Reverse and extend", star:true, goal:6,
        instruction:"These go beyond routine solving: work backwards, design an equation, and handle new cases. Use paper, then enter your answers.",
        how:"Type a number in each box, or build the answer on the number line. Then press Check.",
        items:[
          { id:"r1", goal:6, tag:"Working backwards", prompt:"`x = 5` is one solution of `{p}/{x - 2} = x - 3`. Find `p`, then find the other solution.",
            boxes:[{ k:"p", label:"`p =`" }, { k:"x", label:"other solution `x =`" }], answer:{ p:6, x:0 },
            why:"`p/3 = 2` gives `p = 6`. Then `(x - 2)(x - 3) = 6` gives `x(x - 5) = 0`, and `x = 0` is allowed: `6/(-2) = -3 = 0 - 3`.",
            wrong:{ p:[{ v:2, fb:"2 is the right side at `x = 5`. The left side there is `p/3`, so `p/3 = 2`." }, { v:[2, 3], fb:"`p/3 = 2` means `p = 3 × 2`, not `2 ÷ 3`." }],
              x:[{ v:5, fb:"That’s the solution you were given. The cleared equation has a second root." }, { v:-5, fb:"`x(x - 5) = 0` gives `x = 0` or `x = 5`. Neither factor is 0 at −5." }] },
            general:"Substitute your values back into the equation to test them, then try again.",
            hints:["If `x = 5` is a solution, the two sides are equal when `x = 5`.", "`p/(5 - 2) = 5 - 3`, so `p/3 = 2` and `p = 6`. Now solve `{6}/{x - 2} = x - 3`.", "`(x - 2)(x - 3) = 6` gives `x^2 - 5x = 0`, so `x = 0` or `x = 5`. The other solution is `x = 0` (check: `6/(-2) = -3 = 0 - 3`)."] },
          { id:"r2", goal:2, tag:"Two ways to have no solution", prompt:"There are exactly two values of `p` for which `{px + 4}/{x - 2} = 3` has no solution. Find both.",
            boxes:[{ k:"p1", label:"`p =`" }, { k:"p2", label:"and `p =`" }], pair:true, answer:[-2, 3],
            why:"Clearing gives `px + 4 = 3(x - 2)`, so `(p - 3)x = -10`. With `p = 3` the `x`-terms vanish and `0 = -10` is never true: `y = 3` is then the horizontal asymptote. Otherwise the only candidate is `x = 10/(3 - p)`, and it’s rejected only when it equals the restriction 2, which happens at `p = -2`.",
            only:{ "3":"Right, `p = 3` makes the cleared form never true. There’s a second value: when is the candidate `x = 10/(3 - p)` rejected?",
              "-2":"Right, `p = -2` makes the only candidate the restriction `x = 2`. There’s a second value: what if the `x`-terms cancel completely?" },
            named:{ "2":"With `p = 2` the candidate is `x = 10/(3 - 2) = 10`, which is allowed: `(20 + 4)/8 = 3`. The restriction is `x = 2`, but `p` doesn’t have to equal it.",
              "-3":"With `p = -3` the candidate is `x = 10/6 = 5/3`, which is allowed: `(-5 + 4)/(5/3 - 2) = (-1)/(-1/3) = 3`." },
            other:"With {pp} the candidate is `x = 10/(3 - p) =` {v}, which isn’t the restriction 2, so it’s a solution.",
            general:"Enter two different values of `p`.",
            hints:["Clear the denominator and collect the `x`-terms. An equation like this can fail in two different ways.", "`px + 4 = 3(x - 2)` gives `(p - 3)x = -10`. Either the `x`-term disappears, or the candidate `x = 10/(3 - p)` is the restriction.", "`p = 3` gives `0 = -10`, never true. Otherwise `10/(3 - p) = 2` gives `3 - p = 5`, so `p = -2`: then the left side is `{-2x + 4}/{x - 2} = -2` for every allowed `x`, never 3. The two values are `p = -2` and `p = 3`."] },
          { id:"r3", goal:6, tag:"Exactly one solution", prompt:"For which positive value of `s` does `{4}/{x} = s - x` have exactly one solution? Enter `s` and that solution.",
            boxes:[{ k:"s", label:"`s =`" }, { k:"x", label:"`x =`" }], answer:{ s:4, x:2 },
            why:"`x^2 - sx + 4 = 0` has one root when `s^2 - 16 = 0`, so `s = 4` (`s > 0`). Then `(x - 2)^2 = 0`, and `x = 2` isn’t the restriction 0: the line `y = 4 - x` touches `y = 4/x` at (2, 2).",
            wrong:{ s:[{ v:2, fb:"Then `x^2 - 2x + 4 = 0`, whose discriminant is `4 - 16 < 0`: no real solution." }, { v:16, fb:"The discriminant `s^2 - 16` is 0 when `s^2 = 16`, so `s = 4`, not 16." }, { v:8, fb:"Then `x^2 - 8x + 4 = 0` has discriminant `64 - 16 = 48 > 0`: two solutions." }] },
            general:"Clear the denominator and look at the discriminant of the quadratic you get. Then try again.",
            hints:["Clearing the denominator gives a quadratic. When does a quadratic have exactly one root?", "`4 = sx - x^2` gives `x^2 - sx + 4 = 0`. One root means the discriminant `s^2 - 16` is 0. (The root can’t be the restriction 0, since the roots multiply to 4.)", "`s^2 = 16` and `s > 0`, so `s = 4`. Then `x^2 - 4x + 4 = (x - 2)^2 = 0`, and `x = 2`. Check: `4/2 = 2 = 4 - 2`. The line `y = 4 - x` just touches `y = 4/x` at (2, 2)."] },
          { id:"r4", goal:5, tag:"Transfer: a squared denominator", prompt:"Solve `{x - 3}/{(x + 1)^2} < 0`. Build the answer on the number line.",
            builder:{ min:-6, max:6 }, answer:"(−∞, −1) ∪ (−1, 3)",
            why:"`(x + 1)^2` is positive for every `x ≠ -1`, so the fraction has the sign of `x - 3`: negative for `x < 3`. `x = -1` is a restriction, so it’s punched out.",
            named:{ "(−1, 3)":"`(x + 1)^2` is positive on both sides of −1, so the sign doesn’t change there. Test `x = -2`: `(-5)/1 = -5 < 0`.",
              "(−∞, 3)":"That uses only the top’s zero, 3. The bottom is 0 at `x = -1`, so −1 is a restriction too: punch it out to get `(-∞, -1) ∪ (-1, 3)`.",
              "(−∞, −1) ∪ (−1, 3]":"At `x = 3` the fraction is 0, and `0 < 0` is false." },
            general:"Compare your set with a sign chart: check each critical value and each bracket.",
            hints:["Critical values: where the top is 0 and where the bottom is 0.", "`x = 3` (top) and `x = -1` (bottom). The bottom, `(x + 1)^2`, is never negative, so only `x - 3` decides the sign.", "The fraction is negative exactly when `x - 3 < 0` and `x ≠ -1`: `(-∞, -1) ∪ (-1, 3)`."] },
          { id:"r5", goal:5, tag:"Three critical values", prompt:"Solve `{2}/{x + 1} ≥ {1}/{x - 2}`. Build the answer on the number line.",
            builder:{ min:-4, max:8 }, answer:"(−1, 2) ∪ [5, ∞)",
            why:"The one-fraction form `{x - 5}/{(x + 1)(x - 2)} ≥ 0` has critical values −1, 2 and 5 and signs −, +, −, +. 5 is included (both sides are `1/3`); −1 and 2 are restrictions.",
            named:{ "[5, ∞)":"That’s what cross-multiplying gives: `2(x - 2) ≥ x + 1`. It loses `(-1, 2)`, where both denominators’ signs matter.",
              "(−1, 2) ∪ (5, ∞)":"At `x = 5` both sides equal `1/3`, and ≥ includes equal. Close that endpoint.",
              "[−1, 2] ∪ [5, ∞)":"−1 and 2 are restrictions: never included.",
              "(−∞, −1) ∪ (2, 5]":"Those are the intervals where the one-fraction form is ≤ 0. Check your signs, or test `x = 0`: `2 ≥ -1/2` is true." },
            general:"Compare your set with a sign chart: check each critical value and each bracket.",
            hints:["Subtract to get 0 on one side, then combine into one fraction.", "`{2}/{x + 1} - {1}/{x - 2} = {2(x - 2) - (x + 1)}/{(x + 1)(x - 2)} = {x - 5}/{(x + 1)(x - 2)}`.", "Critical values −1, 2 and 5. Signs from left to right: −, +, −, +. ≥ 0 gives `(-1, 2) ∪ [5, ∞)`."] },
          { id:"r6", goal:6, tag:"Working backwards from a solution set", prompt:"The solution of `{x - p}/{x - q} ≤ 0` is `(-2, 5]`. Find `p` and `q`.",
            boxes:[{ k:"p", label:"`p =`" }, { k:"q", label:"`q =`" }], answer:{ p:5, q:-2 },
            why:"The included endpoint, 5, must make the top 0, so `p = 5`. The excluded endpoint, −2, must be the restriction, so `q = -2`. Check: `{x - 5}/{x + 2}` is negative between −2 and 5 and 0 at 5.",
            pairs:[{ p:-2, q:5, fb:"`{x + 2}/{x - 5} ≤ 0` gives `[-2, 5)`. The included endpoint comes from the top; the excluded one comes from the bottom." },
              { p:-5, q:2, fb:"`x - p` is 0 at `x = p`. For the zero to be 5, `p = 5`, not −5." }],
            general:"Ask which endpoint is included and which isn’t, then try again.",
            hints:["Which endpoint is included, and which isn’t? Which part of the fraction can make an endpoint included?", "5 is included, so it makes the top 0: `x - p = 0` at `x = 5`. −2 is excluded, so it’s the restriction.", "`p = 5` and `q = -2`: `{x - 5}/{x + 2} ≤ 0` has solution `(-2, 5]`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you tested the candidates in Explore, or when you switched to the Difference view?" },
      { id:"j2", q:"In your own words, why can multiplying by the common denominator create an extraneous root, and why does the graph never show one as a meeting point?" },
      { id:"j3", q:"Explain to a friend, step by step, how to solve `{x + 1}/{x - 3} ≥ 2` without multiplying both sides by `(x - 3)`." },
      { id:"j4", q:"Which part are you least sure about: restrictions, clearing denominators, sign charts or brackets? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Before solving `{3}/{x - 2} + {1}/{x} = {5}/{x^2 - 4}`, which values of `x` must be excluded?",
          options:[
            { t:"`x ≠ -2`, `x ≠ 0` and `x ≠ 2`", ok:true, why:"Every denominator: `x - 2 = 0` at 2, `x = 0` at 0, and `x^2 - 4 = (x - 2)(x + 2) = 0` at ±2." },
            { t:"`x ≠ 0` and `x ≠ 2`", why:"`x^2 - 4` also equals 0 at `x = -2`." },
            { t:"`x ≠ -2` and `x ≠ 2`", why:"The term `{1}/{x}` is undefined at `x = 0` too." },
            { t:"`x ≠ 0`, `x ≠ 2` and `x ≠ 4`", why:"`x^2 - 4 = 0` means `x^2 = 4`, so `x = ±2`, not 4." }] },
        b:{ prompt:"Before solving `{x}/{x + 3} = {3}/{x^2 - 9} + {2}/{x}`, which values of `x` must be excluded?",
          options:[
            { t:"`x ≠ -3`, `x ≠ 0` and `x ≠ 3`", ok:true, why:"`x + 3 = 0` at −3, `x = 0` at 0, and `x^2 - 9 = (x - 3)(x + 3) = 0` at ±3." },
            { t:"`x ≠ -3` and `x ≠ 0`", why:"`x^2 - 9` also equals 0 at `x = 3`." },
            { t:"`x ≠ -3` and `x ≠ 3`", why:"The term `{2}/{x}` is undefined at `x = 0` too." },
            { t:"`x ≠ -3`, `x ≠ 0` and `x ≠ 9`", why:"`x^2 - 9 = 0` means `x^2 = 9`, so `x = ±3`, not 9." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"To solve `{2}/{x} + {1}/{x - 1} = 3`, you multiply every term by `x(x - 1)`. Which equation results?",
          options:[
            { t:"`2(x - 1) + x = 3x(x - 1)`", ok:true, why:"Each fraction keeps the factor it was missing, and the 3 is multiplied by the whole LCD." },
            { t:"`2(x - 1) + x = 3`", why:"The 3 must be multiplied by `x(x - 1)` too." },
            { t:"`2 + 1 = 3x(x - 1)`", why:"Each numerator must be multiplied by the factor its fraction was missing: `{2}/{x} × x(x - 1) = 2(x - 1)`." },
            { t:"`2x + (x - 1) = 3x(x - 1)`", why:"Each numerator was multiplied by its own denominator. `{2}/{x} × x(x - 1)` is `2(x - 1)`, not `2x`." }] },
        b:{ prompt:"To solve `{3}/{x + 2} - {1}/{x} = 2`, you multiply every term by `x(x + 2)`. Which equation results?",
          options:[
            { t:"`3x - (x + 2) = 2x(x + 2)`", ok:true, why:"Each fraction keeps the factor it was missing, and the 2 is multiplied by the whole LCD." },
            { t:"`3x - (x + 2) = 2`", why:"The 2 must be multiplied by `x(x + 2)` too." },
            { t:"`3 - 1 = 2x(x + 2)`", why:"Each numerator must be multiplied by the factor its fraction was missing: `{3}/{x + 2} × x(x + 2) = 3x`." },
            { t:"`3(x + 2) - x = 2x(x + 2)`", why:"Each numerator was multiplied by its own denominator. `{3}/{x + 2} × x(x + 2)` is `3x`." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Solve `{x - 4}/{x + 1} ≤ 0`.",
          options:[
            { t:"`(-1, 4]`", ok:true, why:"Critical values −1 (restriction) and 4 (zero). The fraction is negative between them, and 0 at 4." },
            { t:"`[-1, 4]`", why:"`x = -1` is a restriction, so it can never be included." },
            { t:"`(-∞, -1) ∪ [4, ∞)`", why:"That set is where the fraction is ≥ 0. Test `x = 0`: `-4/1 = -4 ≤ 0`, so 0 belongs in the answer." },
            { t:"`(-∞, 4]`", why:"That uses only the top’s zero. The bottom is 0 at `x = -1`, which also splits the line. Test `x = -2`: `(-6)/(-1) = 6`, which isn’t ≤ 0." }] },
        b:{ prompt:"Solve `{x + 2}/{x - 3} ≥ 0`.",
          options:[
            { t:"`(-∞, -2] ∪ (3, ∞)`", ok:true, why:"Critical values −2 (zero) and 3 (restriction). The fraction is positive outside them, and 0 at −2." },
            { t:"`(-∞, -2] ∪ [3, ∞)`", why:"`x = 3` is a restriction, so it can never be included." },
            { t:"`[-2, 3)`", why:"That’s where the fraction is ≤ 0. Test `x = 0`: `2/(-3)` is negative." },
            { t:"`(-∞, -2]`", why:"That uses only the top’s zero. The bottom is 0 at `x = 3`, which also splits the line. Test `x = 4`: `6/1 = 6 ≥ 0`, so `x = 4` is a solution too." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Solve `{x}/{x - 1} - {2}/{x + 1} = {4}/{x^2 - 1}`.",
          options:[
            { t:"`x = 2` only", ok:true, why:"Multiplying by `(x - 1)(x + 1)`: `x(x + 1) - 2(x - 1) = 4`, so `x^2 - x - 2 = 0` and `x = 2` or `x = -1`. `x = -1` is a restriction, so it’s extraneous." },
            { t:"`x = -1` and `x = 2`", why:"`x = -1` makes `x + 1 = 0`. It has to be rejected." },
            { t:"`x = -1` only", why:"`x = -1` is the one to reject. `x = 2` works: the left side is `2 - 2/3 = 4/3`, and the right side is `4/3`." },
            { t:"No solution", why:"Only `x = -1` breaks a restriction. `x = 2` is allowed and works." }] },
        b:{ prompt:"Solve `{x}/{x + 3} + {1}/{x - 3} = {6}/{x^2 - 9}`.",
          options:[
            { t:"`x = -1` only", ok:true, why:"Multiplying by `(x + 3)(x - 3)`: `x(x - 3) + (x + 3) = 6`, so `x^2 - 2x - 3 = 0` and `x = 3` or `x = -1`. `x = 3` is a restriction, so it’s extraneous." },
            { t:"`x = -1` and `x = 3`", why:"`x = 3` makes `x - 3 = 0`. It has to be rejected." },
            { t:"`x = 3` only", why:"`x = 3` is the one to reject. `x = -1` works: the left side is `-1/2 - 1/4 = -3/4`, and the right side is `6/(-8) = -3/4`." },
            { t:"No solution", why:"Only `x = 3` breaks a restriction. `x = -1` is allowed and works." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Where does the graph of `y = {2}/{x - 1} - x` cross the `x`-axis?",
          options:[
            { t:"At `x = -1` and `x = 2`", ok:true, why:"`y = 0` means `{2}/{x - 1} = x`. Multiplying by `(x - 1)`: `x^2 - x - 2 = 0`, so `x = -1` or `x = 2`. Neither is the restriction 1." },
            { t:"At `x = 1` only", why:"`x = 1` is the vertical asymptote, where the function is undefined. It can’t be an `x`-intercept." },
            { t:"At `x = -2` and `x = 1`", why:"`x^2 - x - 2 = (x - 2)(x + 1)`, so the roots are 2 and −1." },
            { t:"At `x = 2` only", why:"`x = -1` is not a restriction (only `x = 1` is), and `2/(-2) - (-1) = 0`." }] },
        b:{ prompt:"Where does the graph of `y = {6}/{x + 1} - x` cross the `x`-axis?",
          options:[
            { t:"At `x = -3` and `x = 2`", ok:true, why:"`y = 0` means `{6}/{x + 1} = x`. Multiplying by `(x + 1)`: `x^2 + x - 6 = 0`, so `x = -3` or `x = 2`. Neither is the restriction −1." },
            { t:"At `x = -1` only", why:"`x = -1` is the vertical asymptote, where the function is undefined. It can’t be an `x`-intercept." },
            { t:"At `x = -2` and `x = 3`", why:"`x^2 + x - 6 = (x + 3)(x - 2)`, so the roots are −3 and 2." },
            { t:"At `x = 2` only", why:"`x = -3` is not a restriction (only `x = -1` is), and `6/(-2) - (-3) = 0`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Solve `{x + 5}/{x - 1} > 3`.",
          options:[
            { t:"`(1, 4)`", ok:true, why:"`{x + 5}/{x - 1} - 3 = {8 - 2x}/{x - 1} > 0`. The critical values are 1 and 4, and the fraction is positive only between them." },
            { t:"`(-∞, 1) ∪ (1, 4)`", why:"That comes from multiplying by `x - 1`, which is negative for `x < 1`. Test `x = 0`: `5/(-1) = -5`, which isn’t > 3." },
            { t:"`(-∞, 1) ∪ (4, ∞)`", why:"`8 - 2x` is <strong>negative</strong> for `x > 4`. Recheck the sign of the top in each interval." },
            { t:"`(1, 4]`", why:"At `x = 4` the sides are equal, and > doesn’t include equal." }] },
        b:{ prompt:"Solve `{x + 7}/{x + 1} < 2`.",
          options:[
            { t:"`(-∞, -1) ∪ (5, ∞)`", ok:true, why:"`{x + 7}/{x + 1} - 2 = {5 - x}/{x + 1} < 0`. The critical values are −1 and 5, and the fraction is negative outside them." },
            { t:"`(5, ∞)`", why:"That comes from multiplying by `x + 1`, which is negative for `x < -1`. Test `x = -2`: `5/(-1) = -5 < 2`, so −2 is a solution." },
            { t:"`(-1, 5)`", why:"`5 - x` is <strong>negative</strong> for `x > 5`. Recheck the sign of the top in each interval." },
            { t:"`(-∞, -1) ∪ [5, ∞)`", why:"At `x = 5` the sides are equal, and < doesn’t include equal." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Ana clears the denominators in `{x}/{x - 5} = {5}/{x - 5} + 2` and gets `x = 5`. Which is the best explanation of what this means?",
          options:[
            { t:"“`x = 5` makes the denominators 0, so the original equation is undefined there. It’s an extraneous root, and the equation has no solution.”", ok:true, why:"This names the restriction, rejects the candidate, and states the conclusion." },
            { t:"“`x = 5` is the solution, because it satisfies the equation after clearing the denominators.”", why:"The cleared equation is defined at `x = 5`, but the original isn’t. Candidates must be checked in the original." },
            { t:"“`x = 5` is extraneous, so the solution is `x = -5`.”", why:"Rejecting a candidate doesn’t turn it into its opposite. Test `x = -5`: `-5/(-10) = 1/2`, but `5/(-10) + 2 = 3/2`." },
            { t:"“The equation has no solution because the cleared equation is linear.”", why:"Linear equations usually have a solution. The reason is that the only candidate is a restriction." }] },
        b:{ prompt:"Ben clears the denominators in `{x}/{x + 4} = {-4}/{x + 4} + 3` and gets `x = -4`. Which is the best explanation of what this means?",
          options:[
            { t:"“`x = -4` makes the denominators 0, so the original equation is undefined there. It’s an extraneous root, and the equation has no solution.”", ok:true, why:"This names the restriction, rejects the candidate, and states the conclusion." },
            { t:"“`x = -4` is the solution, because it satisfies the equation after clearing the denominators.”", why:"The cleared equation is defined at `x = -4`, but the original isn’t." },
            { t:"“`x = -4` is extraneous, so the solution is `x = 4`.”", why:"Rejecting a candidate doesn’t turn it into its opposite. Test `x = 4`: `4/8 = 1/2`, but `-4/8 + 3 = 5/2`." },
            { t:"“The equation has no solution because the cleared equation is linear.”", why:"Linear equations usually have a solution. The reason is that the only candidate is a restriction." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly compares the solutions of `{x - 2}/{x + 3} = 0` and `{x - 2}/{x + 3} ≥ 0`?",
          options:[
            { t:"“The equation has one solution, `x = 2`. The inequality’s solution set is `(-∞, -3) ∪ [2, ∞)`: it includes `x = 2` and infinitely many other values.”", ok:true, why:"An equation picks out the values where the sides are equal; an inequality picks out whole intervals." },
            { t:"“Both have the same solution, `x = 2`.”", why:"`x = 2` is only where the fraction equals 0. The inequality also holds wherever the fraction is positive, such as `x = 5`." },
            { t:"“The equation’s solutions are `x = 2` and `x = -3`, and the inequality’s set is `(-∞, -3] ∪ [2, ∞)`.”", why:"`x = -3` makes the denominator 0, so it solves neither: it’s a restriction." },
            { t:"“The equation has one solution, `x = 2`. The inequality’s solution set is `[-3, 2]`.”", why:"That interval is where the fraction is ≤ 0, and it wrongly includes the restriction −3." }] },
        b:{ prompt:"Which statement correctly compares the solutions of `{x + 1}/{x - 4} = 0` and `{x + 1}/{x - 4} ≤ 0`?",
          options:[
            { t:"“The equation has one solution, `x = -1`. The inequality’s solution set is `[-1, 4)`: it includes `x = -1` and infinitely many other values.”", ok:true, why:"An equation picks out the values where the sides are equal; an inequality picks out whole intervals." },
            { t:"“Both have the same solution, `x = -1`.”", why:"`x = -1` is only where the fraction equals 0. The inequality also holds wherever the fraction is negative, such as `x = 0`." },
            { t:"“The equation’s solutions are `x = -1` and `x = 4`, and the inequality’s set is `[-1, 4]`.”", why:"`x = 4` makes the denominator 0, so it solves neither: it’s a restriction." },
            { t:"“The equation has one solution, `x = -1`. The inequality’s solution set is `(-∞, -1] ∪ [4, ∞)`.”", why:"Those intervals are where the fraction is ≥ 0, and the set wrongly includes the restriction 4." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Amir can paint a fence alone in 6 h, so he paints `1/6` of it each hour. With Beatriz helping, they finish in 4 h. Working at a steady rate, how long would Beatriz take alone?",
          options:[
            { t:"12 h", ok:true, why:"With `t` hours for Beatriz alone: `{1}/{6} + {1}/{t} = {1}/{4}`. Multiplying by `12t`: `2t + 12 = 3t`, so `t = 12`." },
            { t:"`1/12` h", why:"`1/12` is Beatriz’s <strong>rate</strong>, the part of the fence she paints per hour. Her time is its reciprocal." },
            { t:"2 h", why:"Times don’t subtract: `6 - 4 = 2` would make Beatriz faster than the two of them together." },
            { t:"10 h", why:"Times don’t add: rates do. Use `{1}/{6} + {1}/{t} = {1}/{4}`." }] },
        b:{ prompt:"One hose fills a pool in 3 h, so it fills `1/3` of the pool each hour. With a second hose also running, the pool fills in 2 h. How long would the second hose take alone?",
          options:[
            { t:"6 h", ok:true, why:"With `t` hours for the second hose alone: `{1}/{3} + {1}/{t} = {1}/{2}`. Multiplying by `6t`: `2t + 6 = 3t`, so `t = 6`." },
            { t:"`1/6` h", why:"`1/6` is the second hose’s <strong>rate</strong>, the part of the pool it fills per hour. Its time is the reciprocal." },
            { t:"1 h", why:"Times don’t subtract: `3 - 2 = 1` would make the second hose faster than both together." },
            { t:"5 h", why:"Times don’t add: rates do. Use `{1}/{3} + {1}/{t} = {1}/{2}`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A rectangle has area 12 cm². Its width is `w` cm, so its length is `12/w` cm. For which widths is its perimeter at most 14 cm?",
          options:[
            { t:"`3 ≤ w ≤ 4`", ok:true, why:"`2w + 24/w ≤ 14`. Since `w > 0`, multiplying by `w` keeps the sign: `2w^2 - 14w + 24 ≤ 0`, so `(w - 3)(w - 4) ≤ 0`." },
            { t:"`w = 3` or `w = 4`", why:"Those widths give a perimeter of exactly 14 cm. ‘At most 14’ also includes every width between them, such as `w = 3.5`." },
            { t:"`3 < w < 4`", why:"‘At most’ includes 14 itself, so `w = 3` and `w = 4` count." },
            { t:"`0 < w ≤ 3` or `w ≥ 4`", why:"Those widths give a perimeter of <strong>at least</strong> 14 cm. Test `w = 1`: `2 + 24 = 26`." }] },
        b:{ prompt:"A rectangle has area 18 m². Its width is `w` m, so its length is `18/w` m. For which widths is its perimeter at most 18 m?",
          options:[
            { t:"`3 ≤ w ≤ 6`", ok:true, why:"`2w + 36/w ≤ 18`. Since `w > 0`, multiplying by `w` keeps the sign: `2w^2 - 18w + 36 ≤ 0`, so `(w - 3)(w - 6) ≤ 0`." },
            { t:"`w = 3` or `w = 6`", why:"Those widths give a perimeter of exactly 18 m. ‘At most 18’ also includes every width between them, such as `w = 4`." },
            { t:"`3 < w < 6`", why:"‘At most’ includes 18 itself, so `w = 3` and `w = 6` count." },
            { t:"`0 < w ≤ 3` or `w ≥ 6`", why:"Those widths give a perimeter of <strong>at least</strong> 18 m. Test `w = 1`: `2 + 36 = 38`." }] } }
    ]
  },
  task:{
    title:"Design the inequality", summary:"Design the inequality",
    statement:"<p>Design an inequality `{x + p}/{x - q}` <span class=\"sgn-slot\">sign</span> `r` whose solution set is <strong>exactly `[-1, 2)`</strong>. There’s more than one design. Can you find them all?</p>",
    checks:["`x = 2` is a restriction", "`x = -1` is a solution", "Every `x` between −1 and 2 is a solution", "Nothing below −1, and nothing from 2 up, is a solution"],
    tips:[
      "The restriction comes from the denominator `x - q`. Which `q` makes `x - q = 0` at `x = 2`? (If the top is also 0 there, the factor cancels and leaves a hole, not a restriction.)",
      "−1 should be a closed endpoint. At a closed endpoint the two sides must be equal: try making `{-1 + p}/{-1 - q}` equal `r`, and use ≤ or ≥.",
      "Your set leaves out {xm}, which is between −1 and 2. Test it: right now the inequality is false there.",
      "Your set also contains {xv}, which is outside `[-1, 2)`. Look at that part of the graph: there the blue curve must be on the wrong side of the line `y = r`."
    ],
    explainPrompt:"Explain how you know your inequality has solution set `[-1, 2)`.",
    vocab:"Use the words restriction, critical value and sign chart (or test value).",
    after3:"You found all three. Move everything to one side and each one becomes a positive multiple of `{x + 1}/{x - 2} ≤ 0`: `{x + 4}/{x - 2} + 1 = {2(x + 1)}/{x - 2}`, and `{x - 5}/{x - 2} - 2 = -{x + 1}/{x - 2}`, which flips ≥ to ≤. The one-fraction form decides the solution set."
  },
  cards:[
    ["Restriction", "A value of `x` that makes a denominator 0. State restrictions before solving: in `{3}/{x - 2} + {1}/{x} = 5`, `x ≠ 2` and `x ≠ 0`."],
    ["Extraneous root", "A candidate from the cleared equation that breaks a restriction. Reject it: `{x}/{x - 4} = {4}/{x - 4}` clears to `x = 4`, so it has no solution."],
    ["Solving a rational equation", "State the restrictions → multiply every term by the LCD → solve the polynomial equation → check every candidate."],
    ["Solutions as meeting points", "The real solutions of `L(x) = R(x)` are the `x`-coordinates where `y = L(x)` and `y = R(x)` meet. For `{6}/{x} = x - 1` they meet at (−2, −3) and (3, 2)."],
    ["Solutions as `x`-intercepts", "The real roots of `L(x) = R(x)` are the `x`-intercepts of `y = L(x) - R(x)`. For `{6}/{x} = x - 1`, the graph of `y = {6}/{x} - x + 1` crosses the `x`-axis at `x = -2` and `x = 3`."],
    ["Where does an extraneous candidate show up on the graph?", "On a vertical asymptote or at a hole, never at a meeting point. For `{x^2 - 4}/{x - 2} = 4`, the line `y = 4` passes through the hole at (2, 4)."],
    ["A horizontal line at the horizontal asymptote", "It never meets the graph of a linear-over-linear function. `{2x + 1}/{x - 1} = 2` clears to `1 = -2`, so it has no solution."],
    ["Why not multiply an inequality by `(x - 1)`?", "Its sign depends on `x`. Where `x - 1 < 0`, multiplying flips the inequality, so one rule can’t cover every `x`. Move everything to one side instead."],
    ["Critical values of a rational inequality", "The zeros of the top and of the bottom of the one-fraction form. The sign can only change at these."],
    ["Brackets at critical values", "Zeros of the top: square for ≤ and ≥, round for < and >. Restrictions: always round. `{x - 3}/{x + 1} ≤ 0` has solution `(-1, 3]`."],
    ["A squared factor in a sign chart", "It never changes sign. `{x - 3}/{(x + 1)^2} < 0` has solution `(-∞, -1) ∪ (-1, 3)`."],
    ["Equation vs inequality", "`{x - 2}/{x + 3} = 0` has one solution, `x = 2`. `{x - 2}/{x + 3} ≥ 0` has infinitely many: `(-∞, -3) ∪ [2, ∞)`."]
  ]
};
