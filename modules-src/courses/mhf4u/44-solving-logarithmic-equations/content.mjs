// MHF4U 44 Solving Logarithmic Equations. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/44-solving-logarithmic-equations.md
const LB = "log_{@b{b}}";             // log with a brown b subscript (colour key: b is --p-b; hero only)

// ---------- Explore: restriction chips (4 per equation; the correct one first, the build reorders them) ----------
const ONE = "That’s where one of the logs exists. Every log in the equation needs a positive argument, so the gate is where <strong>all</strong> the lanes are solid.";
const COMB = "That’s where the equation exists <strong>after</strong> combining. Restrictions come from the original equation, where each log needs its own positive argument.";
const GE = "An argument of 0 isn’t allowed either: `log_b 0` doesn’t exist.";
const XPOS = "The arguments must be positive, not `x` itself. At `x = -2` in S4, both arguments (4 and 2) are positive.";
const chips = (ok, one, comb, other, oneWhy, combWhy, otherWhy) => [{ t:ok, ok:true }, { t:one, why:oneWhy || ONE }, { t:comb, why:combWhy || COMB }, { t:other, why:otherWhy || GE }];
const card = (t, why) => why ? { t, why } : { t, ok:true };
// ---------- Practice: hint 1 for the generated hints ----------
const H1 = "Write the restrictions. Then get one log on each side, or one log equal to a number.";
const FALLBACK = "Not quite. Your values: {list}. For each one, check that every argument in the original equation is positive and that the two sides are equal.";
const SAME = "Same solutions before and after. ";

export default {
  id:"44-solving-logarithmic-equations",
  kind:"topic",
  title:"Solving logarithmic equations",
  topic:"Solving Logarithmic Equations",
  readyTopic:"solving logarithmic equations",
  hero:{
    eq:"`" + LB + " A = m ⟺ A = @b{b}^m`", eqLabel:"log base b of A equals m, exactly when A equals b to the power m", eqSize:"md",
    headline:"The algebra finds candidates. The original equation decides.",
    text:"A <strong>logarithmic equation</strong> has the unknown inside a logarithm, as in `log_2 x + log_2(x - 2) = 3`. To solve one, combine the logs with the laws you know, then switch to <strong>exponential form</strong>: `log_b A = m` means `A = b^m`. But a logarithm only exists when its <strong>argument</strong> is positive, so the equation comes with <strong>restrictions</strong>. Combining logs can quietly widen them, and a root that sneaks in that way is an <strong>extraneous root</strong>. That’s why every candidate is checked in the original equation.",
    fig:{ html:'<div class="lg-pic lg-hero"><div class="plot-wrap"><canvas class="plot" id="hero-plot" role="img" aria-label="Graph of y = log base 2 of x plus log base 2 of (x − 2) for x greater than 2 and the line y = 3, crossing at (4, 3). A ghost branch for x less than 0 crosses y = 3 at x = −2. Argument lanes under the graph: the candidate 4 passes the gate x > 2; the candidate −2 stops at the first lane."></canvas></div><canvas class="lg-lanes" id="hero-lanes" role="img" aria-label="Argument lanes for x and x − 2, and the gate x > 2."></canvas></div>', caption:"`log_2 x + log_2(x - 2) = 3`" },
    caps:["`log_2(x(x - 2)) = 3`", "Two candidates, one solution: `x = 4`"]
  },
  goals:[
    "I can state the restrictions on a logarithmic equation before solving: every argument must be positive, and a base that contains `x` must be positive and not 1.",
    "I can solve equations of the form `log_b A = m` by converting to `A = b^m`, and of the form `log_b A = log_b B` by setting `A = B`.",
    "I can use the product, quotient and power laws to rewrite an equation with several logs as one with a single log on each side, then solve it.",
    "I can check every candidate in the original equation, reject extraneous roots, and explain which step let them in (or which step can lose a root).",
    "I can set up and solve logarithmic equations from problems, such as sound levels in decibels, and work backwards from a known solution."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Log laws", goal:3, prompt:"Write `log_2 x + log_2(x - 2)` as a single logarithm (for `x > 2`).",
          options:[
            { t:"`log_2(x^2 - 2x)`", ok:true, why:"Product law: `log_2 x + log_2(x - 2) = log_2(x(x - 2)) = log_2(x^2 - 2x)`." },
            { t:"`log_2(2x - 2)`", why:"A sum of logs is the log of a <strong>product</strong>. Test `x = 4`: `log_2 4 + log_2 2 = 2 + 1 = 3`, but `log_2(2 × 4 - 2) = log_2 6`, which isn’t 3." },
            { t:"`log_2 x · log_2(x - 2)`", why:"Multiplying logs isn’t a law. At `x = 4`: `log_2 4 × log_2 2 = 2 × 1 = 2`, but the sum is 3." },
            { t:"`log_4(x^2 - 2x)`", why:"The base stays 2. At `x = 4`, `log_4 8 = 3/2`, but the sum is 3." }],
          hints:["Which law turns a sum of logs with the same base into one log?", "The product law: `log_b A + log_b B = log_b(AB)`.", "`log_2 x + log_2(x - 2) = log_2(x(x - 2)) = log_2(x^2 - 2x)`."] },
        { id:"w2", skill:"Log laws", goal:3, prompt:"Write `2 log_3 x - log_3 5` as a single logarithm (for `x > 0`).",
          options:[
            { t:"`log_3({x^2}/{5})`", ok:true, why:"Power law first: `2 log_3 x = log_3(x^2)`. Then the quotient law: `log_3(x^2) - log_3 5 = log_3({x^2}/{5})`." },
            { t:"`log_3({2x}/{5})`", why:"The 2 becomes an exponent, not a multiplier. Test `x = 3`: `2 log_3 3 = 2 = log_3 9`, but `log_3 6` isn’t 2." },
            { t:"`log_3(x^2 - 5)`", why:"A difference of logs is the log of a <strong>quotient</strong>, not of a difference." },
            { t:"`2 log_3({x}/{5})`", why:"`2 log_3({x}/{5}) = 2 log_3 x - 2 log_3 5`. The 2 belongs only to the first log." }],
          hints:["Deal with the coefficient 2 first.", "Power law: `2 log_3 x = log_3(x^2)`. Now you have `log_3(x^2) - log_3 5`.", "Quotient law: `log_3(x^2) - log_3 5 = log_3({x^2}/{5})`."] },
        { id:"w3", skill:"Exponential and logarithmic form", goal:2, prompt:"If `log_4 N = 3`, what is `N`?",
          options:[
            { t:"64", ok:true, why:"`log_4 N = 3` means `4^3 = N`, so `N = 64`." },
            { t:"81", why:"81 is `3^4`. The base of the log, 4, is the base of the power: `4^3`." },
            { t:"12", why:"12 is 4 × 3. A logarithm is an exponent: 4 is raised to the power 3." },
            { t:"`∛4`", why:"`∛4` is `4^{1/3}`. `log_4 N = 3` means 4 cubed, not the cube root of 4." }],
          hints:["A logarithm is an exponent. What does `log_4 N = 3` say about 4?", "It says 4 to the power 3 is `N`.", "`N = 4^3 = 64`."] },
        { id:"w4", skill:"Domain of logarithms", goal:1, prompt:"For which values of `x` is `log_5(x + 3)` defined?",
          options:[
            { t:"`x > -3`", ok:true, why:"The argument must be positive: `x + 3 > 0`, so `x > -3`." },
            { t:"`x ≥ -3`", why:"At `x = -3` the argument is 0, and `log_5 0` doesn’t exist: no power of 5 is 0." },
            { t:"`x > 3`", why:"`x + 3 > 0` gives `x > -3`: subtract 3 from both sides." },
            { t:"`x > 0`", why:"The argument `x + 3` must be positive, not `x`. For example, `x = -1` gives `log_5 2`, which exists." }],
          hints:["What must be true about the number inside a logarithm?", "It must be positive: `x + 3 > 0`.", "`x + 3 > 0` means `x > -3`."] },
        { id:"w5", skill:"Solving equations", goal:4, prompt:"Solve `x(x - 3) = 10`.",
          options:[
            { t:"`x = 5` or `x = -2`", ok:true, why:"Expand and bring everything to one side: `x^2 - 3x - 10 = 0`, which factors as `(x - 5)(x + 2) = 0`." },
            { t:"`x = 10` or `x = 13`", why:"Setting each factor equal to a number only works when the product is 0. Check `x = 10`: 10 × 7 = 70." },
            { t:"`x = -5` or `x = 2`", why:"`(x + 5)(x - 2) = x^2 + 3x - 10`. Check `x = 2`: 2 × (−1) = −2, not 10." },
            { t:"`x = 0` or `x = 3`", why:"Those solve `x(x - 3) = 0`. Here the right side is 10." }],
          hints:["The zero product rule needs 0 on one side. Expand first.", "`x^2 - 3x = 10` becomes `x^2 - 3x - 10 = 0`. Find two numbers that multiply to −10 and add to −3.", "`(x - 5)(x + 2) = 0`, so `x = 5` or `x = -2`."] },
        { id:"w6", skill:"Solving equations", goal:2, prompt:"Solve `{x + 6}/{x} = 9`.",
          options:[
            { t:"`x = 3/4`", ok:true, why:"Multiply both sides by `x`: `x + 6 = 9x`, so `6 = 8x` and `x = 6/8 = 3/4`." },
            { t:"`x = 3`", why:"That solves `x + 6 = 9`. Check: (3 + 6)/3 = 3, not 9." },
            { t:"`x = 4/3`", why:"`8x = 6` gives `x = 6/8`, not 8/6." },
            { t:"`x = 3/5`", why:"From `x + 6 = 9x`, subtracting `x` gives `6 = 8x`, not `10x = 6`." }],
          hints:["Clear the fraction: multiply both sides by `x`.", "`x + 6 = 9x`. Collect the `x` terms on one side.", "`6 = 8x`, so `x = 3/4`. Check: (3/4 + 6) ÷ (3/4) = (27/4) ÷ (3/4) = 9."] }
      ],
      refreshers:{
        "Log laws":"For positive `A` and `B`: `log_b A + log_b B = log_b(AB)` (product law), `log_b A - log_b B = log_b(A/B)` (quotient law), and `n log_b A = log_b(A^n)` (power law). Use the power law first: `2 log_3 x - log_3 5 = log_3(x^2) - log_3 5 = log_3({x^2}/{5})`. The laws never add or subtract the arguments (modules 40–41).",
        "Exponential and logarithmic form":"`log_b N = m` and `b^m = N` say the same thing: the log is the exponent. `log_4 N = 3` means `N = 4^3 = 64`. The base of the log is the base of the power (module 37).",
        "Domain of logarithms":"`log_b A` exists only when `A > 0`, because `b` to any power is positive. So `log_5(x + 3)` needs `x + 3 > 0`, which is `x > -3`. It’s the argument that must be positive; `x` itself can be negative (module 38).",
        "Solving equations":"Get 0 on one side before you factor: `x(x - 3) = 10` becomes `x^2 - 3x - 10 = 0`, then `(x - 5)(x + 2) = 0`, so `x = 5` or `x = -2`. For a fraction equal to a number, multiply both sides by the denominator: `{x + 6}/{x} = 9` gives `x + 6 = 9x`, so `x = 3/4`."
      }
    }
  },
  explore:{
    heading:"Domain gate",
    intro:"Solve log equations one move at a time and watch what each move does to the graph. Every log has a gate: its argument must be positive. A candidate that can’t get through the gate is extraneous. Then build your own equations and make the gate do what you want.",
    chalIntro:"These use Build mode. Choose the challenge under <strong>Lock values for</strong> to fix its locked values, set the other sliders, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    modes:[{ id:"solve", t:"Solve" }, { id:"build", t:"Build" }],
    bankNote:"Solve at least S1 and S4. The others show something new.",
    moves:[
      { id:"restr", t:"State the restrictions" },
      { id:"combine", t:"Combine (product or quotient law)" },
      { id:"power", t:"Power law: move the coefficient inside" },
      { id:"convert", t:"Convert to exponential form" },
      { id:"drop", t:"Drop the logs (set the arguments equal)" },
      { id:"solve", t:"Solve the polynomial equation" },
      { id:"check", t:"Check each candidate in the original equation" }],
    moveFb:{
      first:"Write the restrictions first, while every log is still in its original form. Combining can change where the equation exists.",
      c_convert:"Exponential form needs one log equal to a number, `log_b A = m`. Combine the logs first.",
      c_drop:"Drop the logs only when each side is a single log with the same base. Here one side is a number.",
      c_power:"There’s no coefficient in front of a log here.",
      inLogs:"The unknown is still inside logs. There’s nothing to solve or check yet.",
      p_combine:"Each side already has one log; the 2 in front has to move inside first.",
      p_drop:"`2 log_5 x` isn’t a single log yet. Dropping now would give `2x = 3x + 4`, which treats `2 log_5 x` as `log_5(2x)`.",
      p_convert:"Neither side is a number. Both sides are logs.",
      v_drop:"The right side is a number, not a log. Convert instead: `log_b A = m` means `A = b^m`.",
      v_one:"There’s only one log left, with no coefficient.",
      d_convert:"Both sides are logs. Set the arguments equal instead.",
      d_other:"Each side is already a single log with the same base.",
      s_logs:"There are no logs left. Solve the equation.",
      s_check:"Find the candidates first.",
      k_other:"You have the candidates. Now check each one in the original equation.",
      restrDone:"The restrictions are already stated. Choose the next move.",
      done:"This equation is solved. Choose another equation, or press Start again."
    },
    restrictQ:"Which values of `x` can this equation have?",
    cardQ:"Which line comes next? Pick it.",
    gateQ:"Tap every candidate you expect the gate to reject, or tap None.",
    gateRun:"Run the check",
    gateNone:"None",
    gateRight:"Your prediction was right.",
    gateWrong:"The gate disagreed with your prediction. Read why below.",
    gateSummary:"Gate predictions right: {r}/{n}",
    back:"Back", again:"Start again",
    bank:[
      { id:"S1", eq:"`log_2 x + log_2(x - 2) = 3`", shows:"The ghost branch (`x < 0`) carries the extraneous root −2.",
        restr:"`x > 0` and `x - 2 > 0`, so `x > 2`",
        lines:{ comb:"`log_2(x(x - 2)) = 3`", conv:"`x(x - 2) = 8`", exp:"`x^2 - 2x - 8 = 0`", fac:"`(x - 4)(x + 2) = 0`" },
        cands:"`x = 4` or `x = -2`", solution:"`x = 4` (`x = -2` is extraneous)",
        dom:{ orig:"`{x ∈ ℝ | x > 2}`", comb:"`{x ∈ ℝ | x < 0 or x > 2}`", conv:"`{x ∈ ℝ}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ comb:"`x < 0`", conv:"`x ≤ 2`", solve:"`x ≤ 2`" },
        restrict:{ options:chips("`x > 2`", "`x > 0`", "`x < 0` or `x > 2`", "`x ≥ 2`") },
        cards:{
          combine:[card("`log_2(x(x - 2)) = 3`"), card("`log_2(2x - 2) = 3`", "That adds the arguments. Adding logs multiplies them."), card("`log_2 x · log_2(x - 2) = 3`", "Logs don’t multiply. The product law makes one log of a product.")],
          convert:[card("`x(x - 2) = 8`"), card("`x(x - 2) = 9`", "That’s `3^2`. The base, 2, is the one raised to the power: `2^3 = 8`."), card("`x(x - 2) = 6`", "That’s 2 × 3. The log is an exponent: `2^3 = 8`.")] } },
      { id:"S2", eq:"`log_3(x + 6) - log_3 x = 2`", shows:"A ghost branch (`x < -6`) that stays below 0 and never meets `y = 2`: widening doesn’t always add a root.",
        restr:"`x + 6 > 0` and `x > 0`, so `x > 0`",
        lines:{ comb:"`log_3({x + 6}/{x}) = 2`", conv:"`{x + 6}/{x} = 9`", exp:"`x + 6 = 9x`", fac:"`8x = 6`" },
        cands:"`x = 3/4`", solution:"`x = 3/4`",
        dom:{ orig:"`{x ∈ ℝ | x > 0}`", comb:"`{x ∈ ℝ | x < -6 or x > 0}`", conv:"`{x ∈ ℝ | x ≠ 0}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ comb:"`x < -6`", conv:"`x < 0`", solve:"`x ≤ 0`" },
        restrict:{ options:chips("`x > 0`", "`x > -6`", "`x < -6` or `x > 0`", "`x ≥ 0`") },
        cards:{
          combine:[card("`log_3({x + 6}/{x}) = 2`"), card("`log_3 6 = 2`", "That subtracts the arguments, `(x + 6) - x = 6`. Subtracting logs divides them."), card("`log_3({x}/{x + 6}) = 2`", "Upside down. The first log’s argument goes on top.")],
          convert:[card("`{x + 6}/{x} = 9`"), card("`{x + 6}/{x} = 8`", "That’s `2^3`. The base is 3: `3^2 = 9`."), card("`{x + 6}/{x} = 6`", "That’s 3 × 2. `3^2 = 9`.")] } },
      { id:"S3", eq:"`log(x + 3) + log x = 1`", shows:"Base 10; the check `log 5 + log 2 = log 10 = 1`.",
        restr:"`x + 3 > 0` and `x > 0`, so `x > 0`",
        lines:{ comb:"`log(x(x + 3)) = 1`", conv:"`x(x + 3) = 10`", exp:"`x^2 + 3x - 10 = 0`", fac:"`(x + 5)(x - 2) = 0`" },
        cands:"`x = 2` or `x = -5`", solution:"`x = 2` (`x = -5` is extraneous)",
        dom:{ orig:"`{x ∈ ℝ | x > 0}`", comb:"`{x ∈ ℝ | x < -3 or x > 0}`", conv:"`{x ∈ ℝ}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ comb:"`x < -3`", conv:"`x ≤ 0`", solve:"`x ≤ 0`" },
        restrict:{ options:chips("`x > 0`", "`x > -3`", "`x < -3` or `x > 0`", "`x ≥ 0`") },
        cards:{
          combine:[card("`log(x(x + 3)) = 1`"), card("`log(2x + 3) = 1`", "That adds the arguments."), card("`log x · log(x + 3) = 1`", "Logs don’t multiply.")],
          convert:[card("`x(x + 3) = 10`"), card("`x(x + 3) = 1`", "That’s `1^{10}`: base and exponent swapped. With no base written, the base is 10, so `10^1 = 10`."), card("`x + (x + 3) = 10`", "The conversion is right, but the arguments were added. The combined argument is `x(x + 3)`.")] } },
      { id:"S4", eq:"`log_2(x + 6) + log_2(x + 4) = 3`", shows:"A negative solution passes the gate.",
        restr:"`x + 6 > 0` and `x + 4 > 0`, so `x > -4`",
        lines:{ comb:"`log_2((x + 6)(x + 4)) = 3`", conv:"`(x + 6)(x + 4) = 8`", exp:"`x^2 + 10x + 16 = 0`", fac:"`(x + 2)(x + 8) = 0`" },
        cands:"`x = -2` or `x = -8`", solution:"`x = -2` (`x = -8` is extraneous)",
        dom:{ orig:"`{x ∈ ℝ | x > -4}`", comb:"`{x ∈ ℝ | x < -6 or x > -4}`", conv:"`{x ∈ ℝ}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ comb:"`x < -6`", conv:"`x ≤ -4`", solve:"`x ≤ -4`" },
        restrict:{ options:chips("`x > -4`", "`x > -6`", "`x < -6` or `x > -4`", "`x > 0`", null, null, XPOS) },
        cards:{
          combine:[card("`log_2((x + 6)(x + 4)) = 3`"), card("`log_2(2x + 10) = 3`", "That adds the arguments."), card("`log_2(x + 6) · log_2(x + 4) = 3`", "Logs don’t multiply.")],
          convert:[card("`(x + 6)(x + 4) = 8`"), card("`(x + 6)(x + 4) = 9`", "That’s `3^2`. `2^3 = 8`."), card("`(x + 6)(x + 4) = 6`", "That’s 2 × 3. `2^3 = 8`.")] } },
      { id:"S5", eq:"`2 log_5 x = log_5(3x + 4)`", shows:"The power law grows a ghost branch (`x < 0`); −1 even satisfies `log_5(x^2) = log_5(3x + 4)`.",
        restr:"`x > 0` and `3x + 4 > 0`, so `x > 0`",
        lines:{ comb:"`log_5(x^2) = log_5(3x + 4)`", conv:"`x^2 = 3x + 4`", exp:"`x^2 - 3x - 4 = 0`", fac:"`(x - 4)(x + 1) = 0`" },
        cands:"`x = 4` or `x = -1`", solution:"`x = 4` (`x = -1` is extraneous)",
        dom:{ orig:"`{x ∈ ℝ | x > 0}`", comb:"`{x ∈ ℝ | -4/3 < x < 0 or x > 0}`", conv:"`{x ∈ ℝ}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ comb:"`-4/3 < x < 0`", conv:"`x ≤ 0`", solve:"`x ≤ 0`" },
        restrict:{ options:chips("`x > 0`", "`x > -4/3`", "`x ≠ 0`", "`x ≥ 0`", null, "That’s the domain of `log_5(x^2)`. The original has `2 log_5 x`, which needs `x > 0`.") },
        cards:{
          power:[card("`log_5(x^2) = log_5(3x + 4)`"), card("`log_5(2x) = log_5(3x + 4)`", "The coefficient becomes an exponent, not a factor: `2 log_5 x = log_5(x^2)`."), card("`(log_5 x)^2 = log_5(3x + 4)`", "That squares the log. The power law puts the 2 on `x`, inside.")] } },
      { id:"S6", eq:"`log_2(x^2 - 4x) = 5`", shows:"One log: no ghost branch, and both candidates pass.",
        restr:"`x^2 - 4x > 0`, so `x < 0` or `x > 4`",
        lines:{ conv:"`x^2 - 4x = 32`", exp:"`x^2 - 4x - 32 = 0`", fac:"`(x - 8)(x + 4) = 0`" },
        cands:"`x = 8` or `x = -4`", solution:"`x = 8` and `x = -4`",
        dom:{ orig:"`{x ∈ ℝ | x < 0 or x > 4}`", conv:"`{x ∈ ℝ}`", solve:"`{x ∈ ℝ}`" },
        ghost:{ conv:"`0 ≤ x ≤ 4`", solve:"`0 ≤ x ≤ 4`" },
        restrict:{ options:chips("`x < 0` or `x > 4`", "`x > 4`", "`0 < x < 4`", "`x > 0`", "`x^2 - 4x = x(x - 4)` is also positive when both factors are negative, so `x < 0` works too.", "There `x^2 - 4x` is negative. The argument is positive outside 0 and 4.", XPOS) },
        cards:{
          convert:[card("`x^2 - 4x = 32`"), card("`x^2 - 4x = 25`", "That’s `5^2`. `2^5 = 32`."), card("`x^2 - 4x = 10`", "That’s 2 × 5. `2^5 = 32`.")] } }
    ],
    read:{ orig:"Original", line:"Current line", restr:"Restrictions (the gate)", exists:"This line exists for", ghost:"Ghost region", cands:"Candidates", gate:"Gate check", sol:"Solution",
      probe:"At `x` = {x}", args:"Arguments", left:"Original left side", comb:"Combined left side", right:"Right side", equal:"Equal?",
      bEq:"Equation", bRestr:"Restrictions", bOne:"One log", bExp:"Exponential form", bCands:"Candidates", bGate:"Gate", bResult:"Result" },
    txt:{
      ghostNone:"None: this line exists exactly where the original does",
      ghostSome:"{r}: this line exists there, the original doesn’t",
      undef:"undefined: {log} doesn’t exist", ghostTag:"(ghost branch)",
      eqYes:"Yes: this is a crossing", eqNo:"No: {a} ≠ {b}", eqNone:"The original doesn’t exist here",
      pass:"{x}: {args}, and {check} ✓.", fail:"{x}: {arg} is not positive, so {log} doesn’t exist ✗.",
      noSol:"No solution",
      bGatePass:"{x}: arguments {a} and {b}, both positive ✓", bGateFail:"{x}: arguments {a} and {b} ✗",
      bOne:"One solution, {s}. One extraneous root, {r}.", bNone:"No solution: the only candidate is extraneous.", bOnly:"One solution, {s}.",
      bNoCand:"No candidate: {E} has no solution", bSame:"The left side is {L} for every `x` in the domain. If `m = 0`, every {G} is a solution; otherwise there is none.",
      counter:"Solutions: {s} · Extraneous: {e}"
    },
    build:{ tplLabel:"Template", tpls:[{ id:"sum", t:"Sum: `log_{@b{b}}(x + p) + log_{@b{b}}(x + q) = m`" }, { id:"diff", t:"Difference: `log_{@b{b}}(x + p) - log_{@b{b}}(x + q) = m`" }],
      baseLabel:"Base `@b{b}`", lockLabel:"Lock values for", locks:[{ id:"free", t:"Nothing (free)" }, { id:"tc1", t:"Challenge 1" }, { id:"tc2", t:"Challenge 2" }, { id:"tc3", t:"Challenge 3" }],
      lockNote:"🔒 Locked by the challenge: {list}." },
    predictions:[
      { id:"p1", prompt:"The next move combines the left side into `log_2(x(x - 2))`. What will happen to the blue curve?",
        options:[{ t:"The part for `x > 2` stays exactly where it is, and a new branch appears for `x < 0`", ok:true }, { t:"Nothing changes, because it’s the same function" }, { t:"The whole curve shifts 2 units left" }, { t:"The curve for `x > 2` rises, because multiplying makes the numbers bigger" }],
        explain:"`log_2 x + log_2(x - 2)` and `log_2(x(x - 2))` give the same value wherever both exist (`x > 2`): that’s the product law. But `x(x - 2)` is also positive when both factors are negative, for `x < 0`, so the combined log exists there too. Between 0 and 2 the product is 0 or negative, so neither version exists. The new branch meets `y = 3` at `x = -2`, and that’s where the extraneous root will come from." },
      { id:"p2", prompt:"Converting `log_2(x(x - 2)) = 3` to `x(x - 2) = 8` turns every height `y` into `2^y`. What will happen to the two crossing points?",
        options:[{ t:"They move up to `y = 8`, but their `x`-values stay at −2 and 4", ok:true }, { t:"Their `x`-values double, to −4 and 8" }, { t:"The ghost crossing disappears, because a parabola has no ghost branch" }, { t:"A third crossing appears between 0 and 2" }],
        explain:"Converting applies the same always-increasing change, `y ↦ 2^y`, to both sides, so a crossing stays a crossing at the same `x`, and no new one can appear. The part of the parabola that wasn’t there before lies at or below 0, and `2^3 = 8` is positive, so the line can’t meet it. That’s why converting `log_b A = m` to `A = b^m` never adds or loses a root. The crossing at `x = -2` was already there on the ghost branch: extraneous roots are born when the domain grows, not when you convert." },
      { id:"p3", prompt:"The `m` slider will sweep from −3 up to 5. How many solutions will the equation have along the way?",
        options:[{ t:"Exactly one, for every `m`", ok:true }, { t:"Two when `m` is large, one when `m` is small" }, { t:"None while `m` is negative" }, { t:"Two for every `m`" }],
        stops:{ "-3":"`m = -3`: `x = 1 + {3√2}/{4} ≈ 2.06` and `x = 1 - {3√2}/{4} ≈ -0.06`", "3":"`m = 3`: `x = 4` and `x = -2`", "5":"`m = 5`: `x = 1 + √33 ≈ 6.74` and `x = 1 - √33 ≈ -4.74`" },
        explain:"On the gate side (`x > 2`) the left side rises from very large negative values, near `x = 2`, to very large positive ones, so it meets every horizontal line exactly once. The ghost branch does the same on the other side. So there is always exactly one solution and one extraneous root. A negative `m` is fine: a log can be negative. Only the arguments must be positive." },
      { id:"p4", prompt:"`m` will slide from 2 down to −2. What will happen to the solution?",
        options:[{ t:"It moves right, runs off the screen as `m` nears 0, and from `m = 0` down there is no solution", ok:true }, { t:"It moves left and becomes negative" }, { t:"It stays a solution for every `m`" }, { t:"It splits into two solutions once `m` is negative" }],
        stops:{ "2":"`m = 2`: `x = 13/3`", "1":"`m = 1`: `x = 7`", "0.5":"`m = 1/2`: `x = 7 + 4√2 ≈ 12.66`", "0":"`m = 0`: no candidate", "-1":"`m = -1`: `x = -5` (arguments −4 and −8)", "-2":"`m = -2`: `x = -7/3` (arguments −4/3 and −16/3)" },
        explain:"On the gate side (`x > 3`), `x + 1` is always bigger than `x - 3`, so their ratio is more than 1 and the left side is always positive. It gets closer and closer to 0 as `x` grows, but never reaches it. So only positive values of `m` have a solution. For `m ≤ 0` the algebra may still give a candidate, but it sits on the ghost branch (`x < -1`), and the gate rejects it." }
    ],
    challenges:[
      { id:"tc1", goal:[4, 5], prompt:"Sum template, base 3, `p = 0` and `q = 6` (locked): `log_3 x + log_3(x + 6) = m`. Choose `m` so that the solution is `x = 3`.",
        why:"`3(3 + 6) = 27 = 3^m`, so `m = 3`. The extraneous candidate is then `x = -9`.",
        msgs:{ setup:"Lock the values for Challenge 1 first: Sum template, base 3, `p = 0` and `q = 6`.",
          m2:"Your solution is `x = -3 + 3√2 ≈ 1.24`, not 3. At `x = 3` the left side is `log_3 3 + log_3 9 = 1 + 2`. What does that add to?",
          m4:"Your solution is `x = -3 + 3√10 ≈ 6.49`: too far right. Work out the left side at `x = 3`.",
          m1:"Your solution is `x = -3 + 2√3 ≈ 0.46`. At `x = 3` the arguments are 3 and 9, and their product is 27.",
          other:"Your solution is {s}. You need the left side to equal `m` at `x = 3`." },
        hints:["Put `x = 3` into the left side.", "`log_3 3 + log_3 9 = log_3 27`.", "`log_3 27 = 3`, so `m = 3`. The other candidate, `x = -9`, is extraneous: its arguments are −9 and −3."] },
      { id:"tc2", goal:[4, 5], prompt:"Sum template, base 2, `m = 1` (locked): `log_2(x + p) + log_2(x + q) = 1`. Choose `p` and `q` so that `x = -4` is a solution.",
        why:"The arguments at `x = -4` are 1 and 2: both positive, with product `2^1 = 2`. A negative solution is fine.",
        msgs:{ setup:"Lock the values for Challenge 2 first: Sum template, base 2, `m = 1`.",
          named:"The algebra does give `x = -4` as a candidate, because (−1)(−2) = 2. But the arguments at `x = -4` are −1 and −2, so the gate rejects it. You need two <strong>positive</strong> arguments with product 2.",
          other:"At `x = -4` your arguments are {a} and {b}, with product {p}. You need two positive numbers with product `2^1 = 2`." },
        hints:["At `x = -4`, the arguments are `-4 + p` and `-4 + q`. What must their product be?", "Their product must be `2^1 = 2`, and both must be positive, so they’re 1 and 2.", "`-4 + p = 1` and `-4 + q = 2` give `p = 5` and `q = 6` (or the other way round): `log_2(x + 5) + log_2(x + 6) = 1`. A negative solution is fine: the arguments are positive."] },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Difference template, base 2: `log_2(x + p) - log_2(x + q) = m`. Choose `p`, `q` and `m` (`m ≠ 0`) so that the algebra gives the candidate `x = 1`, but the equation has <strong>no solution</strong>.",
        why:"At `x = 1` both arguments are negative and their ratio is `2^m`, so the algebra gives `x = 1` and the gate rejects it. There are six such settings, such as `p = -3`, `q = -2`, `m = 1`.",
        msgs:{ setup:"Lock the values for Challenge 3 first: Difference template, base 2.",
          passes:"`x = 1` passes the gate here (arguments {a} and {b}), so it <strong>is</strong> a solution. For it to be rejected, both arguments at `x = 1` must be negative.",
          m0:"With `m = 0` the algebra gives `x + p = x + q`: no candidate at all. Choose `m ≠ 0`.",
          pq:"The left side is `log_2 1 = 0` everywhere, so the algebra never produces a single candidate.",
          other:"Your candidate is {c}. At `x = 1` you need `{1 + p}/{1 + q} = 2^m`." },
        hints:["For `x = 1` to be rejected, what must be true of the arguments `1 + p` and `1 + q`?", "Both must be negative, so `p ≤ -2` and `q ≤ -2`. And their ratio must be a power of 2, other than `2^0 = 1`.", "For example `p = -3`, `q = -2`: (1 − 3)/(1 − 2) = 2 = `2^1`, so `m = 1`. The algebra gives `x - 3 = 2(x - 2)`, so `x = 1`, but `log_2(1 - 3)` doesn’t exist. In fact `log_2(x - 3) - log_2(x - 2)` is negative everywhere on its domain, so it can never equal 1."] }
    ]
  },
  part3:{
    slug:"audit", name:"Root audit",
    heading:"Root audit: kept, gained or lost?",
    intro:"Each solution below uses the log laws one step at a time, the way most people would. But some steps change where the equation exists. For each step, decide whether it keeps the same solutions, gains one or loses one. Then reveal the strips to see.",
    calls:[{ id:"keeps", t:"Keeps" }, { id:"gains", t:"Gains a solution" }, { id:"loses", t:"Loses a solution" }],
    tally:"Steps called right before the reveal: {r}/{n}",
    summaryLine:"Root audit: steps called right before the reveal: {r}/{n}",
    graphBtn:"Graph this line",
    revealBtn:"Reveal",
    wrongFb:{
      gains:"This step widened the domain: {old} became {new}. The new region contains a solution of the new line, {v}, which the old line didn’t have.",
      loses:"This step narrowed the domain: {old} became {new}. The old solution {v} is outside the new domain, so it vanished.",
      keepsConv:SAME + "Converting `log_b A = m` to `A = b^m` never changes them, because `b^m` is positive.",
      keepsSame:SAME + "The domain didn’t change.",
      keepsDrop:SAME
    },
    chains:[
      { id:"A", name:"Chain A", sub:"product law", strip:[-4, 12],
        lines:[
          { eq:"`log_3 x + log_3(x - 8) = 2`", dom:"`{x ∈ ℝ | x > 8}`", ineq:"`x > 8`", sol:"{9}" },
          { eq:"`log_3(x(x - 8)) = 2`", dom:"`{x ∈ ℝ | x < 0 or x > 8}`", ineq:"`x < 0` or `x > 8`", sol:"{−1, 9}" },
          { eq:"`x(x - 8) = 9`", dom:"`{x ∈ ℝ}`", ineq:"every real number", sol:"{−1, 9}" },
          { eq:"`(x - 9)(x + 1) = 0`", dom:"`{x ∈ ℝ}`", ineq:"every real number", sol:"{−1, 9}" }],
        steps:[
          { name:"Product law", answer:"gains", v:"−1", keep:"", reason:"The product law widened the domain from `x > 8` to `x < 0` or `x > 8`." },
          { name:"Convert", answer:"keeps", keep:"conv", reason:"Converting keeps the solutions: `3^2 = 9` is positive, so `x(x - 8) = 9` forces `x(x - 8) > 0`." },
          { name:"Expand and factor", answer:"keeps", keep:"same", reason:"Expanding and factoring is ordinary algebra on a polynomial: it keeps the solutions." }],
        note:"Check against L1: `x = 9` gives `log_3 9 + log_3 1 = 2 + 0 = 2`. `x = -1` needs `log_3(-1)`: extraneous. It entered at the product law." },
      { id:"B", name:"Chain B", sub:"power law forwards", strip:[-12, 12],
        lines:[
          { eq:"`log_3(x^2) = 4`", dom:"`{x ∈ ℝ | x ≠ 0}`", ineq:"`x ≠ 0`", sol:"{−9, 9}" },
          { eq:"`2 log_3 x = 4`", dom:"`{x ∈ ℝ | x > 0}`", ineq:"`x > 0`", sol:"{9}" },
          { eq:"`log_3 x = 2`", dom:"`{x ∈ ℝ | x > 0}`", ineq:"`x > 0`", sol:"{9}" },
          { eq:"`x = 9`", dom:"`{x ∈ ℝ}`", ineq:"every real number", sol:"{9}" }],
        steps:[
          { name:"Power law", answer:"loses", v:"−9", keep:"", reason:"The power law narrowed the domain from `x ≠ 0` to `x > 0`." },
          { name:"Divide by 2", answer:"keeps", keep:"same", reason:"Dividing both sides by 2 keeps the solutions: both lines need `x > 0`." },
          { name:"Convert", answer:"keeps", keep:"conv", reason:"Converting keeps the solutions: `3^2 = 9` is positive." }],
        note:"Checking 9 in L1 works, so nothing warns you that −9 went missing. A lost root never shows up to be checked. The safe route converts directly: `x^2 = 3^4 = 81`, so `x = 9` or `x = -9`, and both make `x^2 = 81` positive." },
      { id:"C", name:"Chain C", sub:"quotient law", strip:[-4, 8],
        lines:[
          { eq:"`log_2(x^2 - 5) = 2 + log_2 x`", dom:"`{x ∈ ℝ | x > √5}`", ineq:"`x > √5`", sol:"{5}" },
          { eq:"`log_2(x^2 - 5) - log_2 x = 2`", dom:"`{x ∈ ℝ | x > √5}`", ineq:"`x > √5`", sol:"{5}" },
          { eq:"`log_2({x^2 - 5}/{x}) = 2`", dom:"`{x ∈ ℝ | -√5 < x < 0 or x > √5}`", ineq:"`-√5 < x < 0` or `x > √5`", sol:"{−1, 5}" },
          { eq:"`{x^2 - 5}/{x} = 4`", dom:"`{x ∈ ℝ | x ≠ 0}`", ineq:"`x ≠ 0`", sol:"{−1, 5}" }],
        steps:[
          { name:"Subtract `log_2 x`", answer:"keeps", keep:"same", reason:"Subtracting `log_2 x` from both sides keeps the solutions: both lines need `x > √5`." },
          { name:"Quotient law", answer:"gains", v:"−1", keep:"", reason:"The quotient law widened the domain from `x > √5` to `-√5 < x < 0` or `x > √5`." },
          { name:"Convert", answer:"keeps", keep:"conv", reason:"Converting keeps the solutions: `2^2 = 4` is positive." }],
        note:"From L4: `x^2 - 5 = 4x`, so `(x - 5)(x + 1) = 0`. At `x = -1` the quotient (1 − 5)/(−1) = 4 is positive, so L3 holds, but L1 needs `log_2(-1)`. Notice the safe first step: the logs were collected <strong>before</strong> anything was dropped." },
      { id:"D", name:"Chain D", sub:"power law backwards", strip:[-6, 8],
        lines:[
          { eq:"`log_4 x + log_4 x = log_4(2x + 15)`", dom:"`{x ∈ ℝ | x > 0}`", ineq:"`x > 0`", sol:"{5}" },
          { eq:"`2 log_4 x = log_4(2x + 15)`", dom:"`{x ∈ ℝ | x > 0}`", ineq:"`x > 0`", sol:"{5}" },
          { eq:"`log_4(x^2) = log_4(2x + 15)`", dom:"`{x ∈ ℝ | -15/2 < x < 0 or x > 0}`", ineq:"`-15/2 < x < 0` or `x > 0`", sol:"{−3, 5}" },
          { eq:"`x^2 = 2x + 15`", dom:"`{x ∈ ℝ}`", ineq:"every real number", sol:"{−3, 5}" }],
        steps:[
          { name:"Collect like terms", answer:"keeps", keep:"same", reason:"Collecting like terms keeps the solutions: both lines need `x > 0`." },
          { name:"Power law", answer:"gains", v:"−3", keep:"", reason:"The power law widened the domain from `x > 0` to `-15/2 < x < 0` or `x > 0`." },
          { name:"Drop the logs", answer:"keeps", keep:"drop", reason:"Dropping the logs widened the domain to every real number, but no new solution appeared: at `x = -3` and `x = 5` both arguments are already positive." }],
        note:"At `x = -3`, L3 reads `log_4 9 = log_4 9`, which is true. So checking in L3 would wrongly accept −3. Dropping the logs was safe here; the extra root came in one step earlier, at the power law." }
    ],
    blocks:[
      { title:"", html:'<details class="alg"><summary>Check it with algebra</summary><ul class="lg-alg">' +
        "<li><strong>Product law:</strong> `log_b A + log_b B` needs `A > 0` <strong>and</strong> `B > 0`; `log_b(AB)` only needs `AB > 0`, which also happens when `A < 0` and `B < 0`. Left to right it can <strong>gain</strong>; right to left it can <strong>lose</strong>.</li>" +
        "<li><strong>Quotient law:</strong> the same, with `A/B` in place of `AB`.</li>" +
        "<li><strong>Power law with an even power:</strong> `2 log_b x` needs `x > 0`; `log_b(x^2)` only needs `x ≠ 0`. Writing `2 log x` as `log(x^2)` can <strong>gain</strong>; writing `log(x^2)` as `2 log x` can <strong>lose</strong>.</li>" +
        "<li><strong>Dropping the logs:</strong> `log_b A = log_b B` needs `A > 0` and `B > 0`; `A = B` needs neither. It can <strong>gain</strong> (for example `log_2(x^2 - 5) = log_2(4x)` gives `x^2 - 5 = 4x`, whose root −1 makes both arguments −4).</li>" +
        "<li><strong>Converting:</strong> `log_b A = m` and `A = b^m` have exactly the same solutions, because `b^m > 0` forces `A > 0`. It <strong>keeps</strong>.</li></ul></details>" },
      { title:"What the audit shows", html:"<p><strong>Keep, gain or lose</strong></p><ul>" +
        "<li>Steps that <strong>widen</strong> the domain can <strong>gain</strong> roots: combining with the product or quotient law, dropping the logs, and writing `2 log x` as `log(x^2)`.</li>" +
        "<li>Steps that <strong>narrow</strong> the domain can <strong>lose</strong> roots: writing `log(x^2)` as `2 log x`, or splitting `log(AB)` into `log A + log B`.</li>" +
        "<li>Converting `log_b A = m` to `A = b^m`, and ordinary algebra on a polynomial, keep the solutions exactly.</li>" +
        "<li>So: never narrow the domain while solving. If you widen it, check every candidate in the <strong>original</strong> equation.</li>" +
        "<li>If the base contains `x`, add its own restriction: the base must be positive and not 1.</li></ul>" }
    ],
    quickCheck:{
      title:"Keeps, gains or loses?", summary:"Keeps, gains or loses?",
      items:[
        { id:"q1", goal:4, prompt:"`log_3(x - 1) + log_3(x + 1) = 1` → `log_3(x^2 - 1) = 1`",
          choices:[{ t:"Keeps", fb:"Solve both. `x^2 - 1 = 3` gives `x = ±2`. The first equation needs `x > 1`, so only 2 works there; the combined one also accepts −2. The product law widened the domain." },
            { t:"Gains a solution", ok:true, fb:"Right. The first equation needs `x > 1` and has the solution `x = 2`. The second exists for `x < -1` too, and `x = -2` also solves it: (−2)² − 1 = 3." },
            { t:"Loses a solution", fb:"Solve both. `x^2 - 1 = 3` gives `x = ±2`. The first equation needs `x > 1`, so only 2 works there; the combined one also accepts −2. The product law widened the domain." }] },
        { id:"q2", goal:4, prompt:"`log_2(x + 1) = 3` → `x + 1 = 8`",
          choices:[{ t:"Keeps", ok:true, fb:"Right. Converting never changes the solutions: `x = 7` either way, and 8 is positive, so `x + 1 > 0` automatically." },
            { t:"Gains a solution", fb:"Both have only the solution `x = 7`. `x + 1 = 8` forces `x + 1` to be positive, so converting can’t add or lose a root." },
            { t:"Loses a solution", fb:"Both have only the solution `x = 7`. `x + 1 = 8` forces `x + 1` to be positive, so converting can’t add or lose a root." }] },
        { id:"q3", goal:4, prompt:"`log((x - 2)^2) = 2` → `2 log(x - 2) = 2`",
          choices:[{ t:"Keeps", fb:"`log((x - 2)^2)` exists for every `x ≠ 2`, so it has two solutions, 12 and −8. `2 log(x - 2)` needs `x > 2`, so −8 vanished. That step narrowed the domain." },
            { t:"Gains a solution", fb:"`log((x - 2)^2)` exists for every `x ≠ 2`, so it has two solutions, 12 and −8. `2 log(x - 2)` needs `x > 2`, so −8 vanished. That step narrowed the domain." },
            { t:"Loses a solution", ok:true, fb:"Right. `(x - 2)^2 = 100` gives `x = 12` or `x = -8`. The second line needs `x > 2`, so it only has `x = 12`: −8 is lost." }] },
        { id:"q4", goal:4, prompt:"`log_5 x - log_5 2 = 1` → `log_5({x}/{2}) = 1`",
          choices:[{ t:"Keeps", ok:true, fb:"Right. Both need `x > 0`, so the domain didn’t change, and both give `x = 10`." },
            { t:"Gains a solution", fb:"Here the quotient law doesn’t widen anything: `log_5 2` is a fixed number, and both lines need `x > 0`. Both have only `x = 10`. Combining only gains a root when the domain grows." },
            { t:"Loses a solution", fb:"Here the quotient law doesn’t widen anything: `log_5 2` is a fixed number, and both lines need `x > 0`. Both have only `x = 10`. Combining only gains a root when the domain grows." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"solve", type:"custom", title:"Solve and check", summary:"Solve and check", goal:[2, 3, 4],
        instruction:"Solve each equation. Enter every solution, or press No solution.",
        how:"Type a solution in the box. Press + for another box. Fractions like 3/4 are fine.",
        fallback:FALLBACK, noSol:"No solution", add:"+", less:"−",
        items:[
          { id:"n1", goal:2, kind:"set", prompt:"`log_2(x + 5) = 3`", answer:[3], display:"`x = 3`",
            wrong:[{ match:[4], fb:"That uses `3^2 = 9`. `log_2(x + 5) = 3` means `x + 5 = 2^3 = 8`." }, { match:[1], fb:"That uses 2 × 3 = 6. The log is an exponent: `x + 5 = 2^3`." }, { match:[13], fb:"`x + 5 = 8` means `x = 8 - 5`." }],
            hints:[H1, "`x > -5`. There’s only one log, so `x + 5 = 2^3 = 8`.", "`x = 8 - 5 = 3`. It meets `x > -5`: `log_2 8 = 3`. The solution is `x = 3`."] },
          { id:"n2", goal:[2, 4], kind:"set", prompt:"`log_7(3x + 2) = log_7(x - 6)`", answer:"none", display:"no solution",
            wrong:[{ match:[-4], fb:"−4 solves `3x + 2 = x - 6`, but it makes both arguments −10. Logs of negative numbers don’t exist, so −4 is extraneous and there’s no solution." }],
            hints:[H1, "`x > 6`. Each side is one log with base 7, so `3x + 2 = x - 6`.", "`2x = -8`, so `x = -4`. But −4 doesn’t meet `x > 6`: it makes both arguments −10. There is no solution."] },
          { id:"n3", goal:[3, 4], kind:"set", prompt:"`log x + log(x - 15) = 2`", answer:[20], display:"`x = 20`",
            wrong:[{ match:[20, -5], fb:"−5 needs `log(-5)`, which doesn’t exist. Check every candidate in the original equation." }, { match:[57.5], fb:"That adds the arguments: `2x - 15 = 100`. Adding logs multiplies them: `x(x - 15) = 100`." }],
            hints:["Restrictions first: both arguments must be positive. Then combine the two logs.", "`x > 15`. The product law gives `log(x(x - 15)) = 2`, so `x(x - 15) = 10^2 = 100`.", "`x^2 - 15x - 100 = 0`, so `(x - 20)(x + 5) = 0` and `x = 20` or `x = -5`. Only 20 meets `x > 15`. Check: `log 20 + log 5 = log 100 = 2`. The solution is `x = 20`."] },
          { id:"n4", goal:3, kind:"set", prompt:"`log_2(x + 7) - log_2(x - 1) = 3`", answer:[15 / 7], display:"`x = 15/7`",
            wrong:[{ match:[2], fb:"That uses `3^2 = 9`. `{x + 7}/{x - 1} = 2^3 = 8`." }, { match:[2.6], fb:"That uses 2 × 3 = 6. `{x + 7}/{x - 1} = 2^3 = 8`." }, { none:true, fb:"There is one. Combine: `{x + 7}/{x - 1} = 8`, then multiply by `x - 1`." }],
            hints:[H1, "`x > 1`. The quotient law gives `log_2({x + 7}/{x - 1}) = 3`, so `{x + 7}/{x - 1} = 2^3 = 8`.", "`x + 7 = 8x - 8`, so `7x = 15` and `x = 15/7`. It meets `x > 1`: (15/7 + 7) ÷ (15/7 − 1) = (64/7) ÷ (8/7) = 8 = `2^3`. The solution is `x = 15/7`."] },
          { id:"n5", goal:[3, 4], kind:"set", prompt:"`log_2(x + 10) + log_2(x + 6) = 5`", answer:[-2], display:"`x = -2`",
            wrong:[{ match:[-2, -14], fb:"−14 makes both arguments negative (−4 and −8), so it’s extraneous." }, { none:true, fb:"−2 is negative, but its arguments are 8 and 4, both positive: `log_2 8 + log_2 4 = 3 + 2 = 5`. It’s a solution." }],
            hints:["Restrictions first: `x + 10 > 0` and `x + 6 > 0`.", "`x > -6`. Combine and convert: `(x + 10)(x + 6) = 2^5 = 32`.", "`x^2 + 16x + 28 = 0`, so `(x + 2)(x + 14) = 0`. `x = -2` meets `x > -6`: `log_2 8 + log_2 4 = 3 + 2 = 5`. `x = -14` doesn’t. The solution is `x = -2`."] },
          { id:"n6", goal:3, kind:"set", prompt:"`2 log_3 x - log_3(x - 2) = 2`", answer:[3, 6], display:"`x = 3` and `x = 6`",
            wrong:[{ match:[3], fb:"Both candidates pass. `x = 3`: `2 log_3 3 - log_3 1 = 2 - 0 = 2`. `x = 6`: `log_3 36 - log_3 4 = log_3 9 = 2`." }, { match:[6], fb:"Both candidates pass. `x = 3`: `2 log_3 3 - log_3 1 = 2 - 0 = 2`. `x = 6`: `log_3 36 - log_3 4 = log_3 9 = 2`." }, { match:[18 / 7], fb:"That treats `2 log_3 x` as `log_3(2x)`. The power law gives `log_3(x^2)`." }],
            hints:[H1, "`x > 2`. The power and quotient laws give `log_3({x^2}/{x - 2}) = 2`, so `{x^2}/{x - 2} = 3^2 = 9`.", "`x^2 = 9x - 18`, so `x^2 - 9x + 18 = 0` and `(x - 3)(x - 6) = 0`. `x = 3`: `2 log_3 3 - log_3 1 = 2 - 0 = 2`. `x = 6`: `log_3 36 - log_3 4 = log_3 9 = 2`. Both are solutions: `x = 3` and `x = 6`."] },
          { id:"n7", goal:[1, 4], kind:"set", prompt:"`log_2(x - 1) + log_2(x + 1) = log_2(x + 5)`", answer:[3], display:"`x = 3`",
            wrong:[{ match:[3, -2], fb:"`x = -2` makes `x + 5 = 3` positive, but `x - 1 = -3` and `x + 1 = -1`. Check <strong>every</strong> log in the original." }],
            hints:["There are three logs. Write a restriction for each.", "`x > 1`. Combine the left side: `log_2((x - 1)(x + 1)) = log_2(x + 5)`, so `x^2 - 1 = x + 5`.", "`x^2 - x - 6 = 0`, so `(x - 3)(x + 2) = 0`. `x = 3` passes: `log_2 2 + log_2 4 = 3 = log_2 8`. `x = -2` makes `x - 1 = -3`, so it’s extraneous. The solution is `x = 3`."] },
          { id:"n8", goal:3, kind:"set", prompt:"`log(x + 1) - log x = 1`", answer:[1 / 9], display:"`x = 1/9`",
            wrong:[{ match:[9], fb:"From `x + 1 = 10x`, `9x = 1`, so `x = 1/9`, not 9." }, { none:true, fb:"That comes from subtracting the arguments, `log((x + 1) - x) = log 1 = 0`. Subtracting logs divides: `{x + 1}/{x} = 10`." }],
            hints:[H1, "`x > 0`. The quotient law gives `log({x + 1}/{x}) = 1`, so `{x + 1}/{x} = 10^1 = 10`.", "`x + 1 = 10x`, so `9x = 1` and `x = 1/9`. It meets `x > 0`: (1/9 + 1) ÷ (1/9) = 10, and `log 10 = 1`. The solution is `x = 1/9`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Hamza", how:"", goal:[3, 4],
        instruction:"Hamza made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Solve `log_2 x + log_2(x + 2) = 3`.",
            steps:["Restrictions: `x > 0` and `x + 2 > 0`, so `x > 0`.", "Product law: `log_2(x(x + 2)) = 3`.", "Exponential form: `x(x + 2) = 2^3 = 8`, so `x^2 + 2x - 8 = 0`.", "`(x + 4)(x - 2) = 0`, so `x = -4` or `x = 2`.", "Check in `log_2(x(x + 2)) = 3`: `x = -4` gives `log_2 8 = 3` and `x = 2` gives `log_2 8 = 3`. So both are solutions."],
            answer:4,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: the arguments are multiplied.", "Step 3 is correct: `2^3 = 8`.", "Step 4 is correct: `(x + 4)(x - 2) = x^2 + 2x - 8`.", ""],
            fixes:[
              { t:"Check in the original equation. `x = -4` would need `log_2(-4)`, which doesn’t exist, so it’s extraneous. The only solution is `x = 2`.", ok:true, why:"The original equation is the only reliable check. Step 1 already said `x > 0`." },
              { t:"Check in `x(x + 2) = 8` instead: (−4)(−2) = 8 and 2 × 4 = 8, so both are solutions.", why:"That checks an even wider equation. Both candidates satisfy it, which is exactly why it can’t tell them apart." },
              { t:"Reject `x = -4` because negative numbers are never solutions of log equations; keep `x = 2`.", why:"Right answer, wrong reason. Negative solutions can be valid: in `log_2(x + 6) + log_2(x + 4) = 3`, `x = -2` works. Reject −4 because `log_2(-4)` doesn’t exist." },
              { t:"Step 5 is correct as written.", why:"The combined equation exists where `x < -2` as well, so it accepts −4. The original needs `log_2(-4)`, which doesn’t exist." }],
            hints:["Which equation should a candidate be checked in?", "Step 5 checks the combined equation, which also exists for `x < -2`. Check the original instead.", "Step 5 is wrong. `x = -4` makes `log_2 x = log_2(-4)`, which doesn’t exist. Only `x = 2` works: `log_2 2 + log_2 4 = 1 + 2 = 3`."] },
          { id:"e2", goal:3, task:"Solve `log_3(x + 1) + log_3(x - 1) = 1`.",
            steps:["Restrictions: `x + 1 > 0` and `x - 1 > 0`, so `x > 1`.", "Product law: `log_3((x + 1) + (x - 1)) = 1`, so `log_3(2x) = 1`.", "Exponential form: `2x = 3^1 = 3`.", "`x = 3/2`, which is greater than 1, so `x = 3/2`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 converts step 2 correctly. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`log_3((x + 1)(x - 1)) = 1`, so `x^2 - 1 = 3` and `x = ±2`. Only `x = 2` meets `x > 1`.", ok:true, why:"The product law multiplies the arguments. Check: `log_3 3 + log_3 1 = 1 + 0 = 1`." },
              { t:"`log_3(x + 1) × log_3(x - 1) = 1`.", why:"The product law turns a sum of logs into the log of a product, not into a product of logs." },
              { t:"`log_3(x^2 - 1) = 1`, so `x^2 - 1 = 1` and `x = √2`.", why:"The combining is right now, but `log_3(x^2 - 1) = 1` means `x^2 - 1 = 3^1 = 3`, not 1." },
              { t:"Step 2 is correct as written.", why:"Test it: at `x = 3/2`, `log_3(5/2) + log_3(1/2) = log_3(5/4)`, which isn’t 1. The product law multiplies the arguments." }],
            hints:["Look at how step 2 combines the two logs.", "Adding logs with the same base multiplies their arguments: `log_b A + log_b B = log_b(AB)`.", "Step 2 is wrong. `log_3((x + 1)(x - 1)) = 1` gives `x^2 - 1 = 3`, so `x = ±2`. `x = -2` fails `x > 1`, so the solution is `x = 2`."] },
          { id:"e3", goal:3, task:"Solve `log_3(x + 8) = 2 + log_3 x`.",
            steps:["Restrictions: `x + 8 > 0` and `x > 0`, so `x > 0`.", "Drop the logs: `x + 8 = 2 + x`.", "Subtract `x` from both sides: 8 = 2.", "That’s impossible, so there is no solution."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is correct algebra on step 2. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Collect the logs first: `log_3(x + 8) - log_3 x = 2`, so `log_3({x + 8}/{x}) = 2`, `{x + 8}/{x} = 9`, and `x = 1`.", ok:true, why:"Check: `log_3 9 = 2`, and `2 + log_3 1 = 2 + 0 = 2`." },
              { t:"Write 2 as `log_3 2`, so `x + 8 = 2x` and `x = 8`.", why:"`2 = log_3 9`, not `log_3 2`, because `3^2 = 9`. Check `x = 8`: `log_3 16` isn’t `2 + log_3 8 = log_3 72`." },
              { t:"Write 2 as `log_3 9`, so `x + 8 = 9 + x`, and there’s no solution.", why:"Writing 2 as `log_3 9` is right, but `log_3 9 + log_3 x = log_3(9x)`, not `log_3(9 + x)`." },
              { t:"Step 2 is correct as written.", why:"You can drop the logs only when each side is a single log with the same base. The right side is `2 + log_3 x`: a number plus a log." }],
            hints:["Before step 2, is each side a single log?", "The right side is `2 + log_3 x`. Collect the logs on one side first, or write 2 as `log_3 9` and use the product law.", "Step 2 is wrong. `log_3(x + 8) - log_3 x = 2` gives `{x + 8}/{x} = 9`, so `x + 8 = 9x` and `x = 1`. It meets `x > 0`, and `log_3 9 = 2 + log_3 1`."] }
        ] },
      { id:"beyond", type:"custom", title:"Beyond the basics", summary:"Beyond the basics", star:true, goal:[2, 3, 4, 5],
        instruction:"These take an extra idea: a substitution, a system, a different base, a model, or working backwards. The hardest ones (R3, R4, R7) go beyond the Final Check.",
        how:"Type your answer in the box, then press Check. Fractions like 3/4 are fine.",
        fallback:FALLBACK, fallbackOne:"Not quite. Your answer: {list}. Put it back into the original equation and check that both sides are equal.",
        noSol:"No solution", add:"+", less:"−",
        items:[
          { id:"r1", goal:3, kind:"set", tag:"R1", prompt:"Solve `(log_2 x)^2 - 5 log_2 x + 6 = 0`.", answer:[4, 8], display:"`x = 4` and `x = 8`",
            wrong:[{ match:[2, 3], fb:"Those are the values of `log_2 x`. Convert each one: `x = 2^2` and `x = 2^3`." }, { match:[4], fb:"`(log_2 x)^2` is not `2 log_2 x`. Let `u = log_2 x`: `u^2 - 5u + 6 = 0` has two roots." }],
            hints:["Treat `log_2 x` as a single unknown, `u`.", "`u^2 - 5u + 6 = 0` factors as `(u - 2)(u - 3) = 0`.", "`log_2 x = 2` gives `x = 4`; `log_2 x = 3` gives `x = 8`. Both are positive, so both are solutions."] },
          { id:"r2", goal:5, kind:"pair", tag:"R2", prompt:"The equation `log_2 x + log_2(x + p) = 3` has the solution `x = 8`. Find `p`, then find the extraneous candidate.",
            labels:["`p`", "Extraneous candidate"], answer:[-7, -1], display:"`p = -7`; extraneous candidate `x = -1`",
            wrongA:[{ match:-55 / 8, fb:"That solves `8(8 + p) = 9`, using `3^2`. Convert with base 2: `2^3 = 8`." }, { match:-8, fb:"That adds the arguments: `8 + 8 + p = 8`. Then `x + p = 0` at `x = 8`, and `log_2 0` doesn’t exist." }, { match:-61 / 8, fb:"That solves `8(8 + p) = 3`, forgetting to convert. `8(8 + p) = 2^3`." }],
            wrongB:[{ match:8, fb:"8 is the solution. The extraneous candidate is the other root of `x(x - 7) = 8`." }, { match:1, fb:"Sign slip: `x^2 - 7x - 8 = (x - 8)(x + 1)`." }],
            hints:["Put `x = 8` into the equation: `log_2 8 + log_2(8 + p) = 3`.", "`log_2 8 = 3`, so `log_2(8 + p) = 0`, which means `8 + p = 1`.", "`p = -7`. Then `x(x - 7) = 8`, so `x^2 - 7x - 8 = 0` and `(x - 8)(x + 1) = 0`. The extraneous candidate is `x = -1`: its arguments are −1 and −8."] },
          { id:"r3", goal:3, kind:"pair", tag:"R3", prompt:"Solve the system: `log x + log y = 3` and `log x - log y = 1`.",
            labels:["`x`", "`y`"], answer:[100, 10], display:"`x = 100`, `y = 10`",
            wrongPair:[{ match:[2, 1], fb:"Those are `log x` and `log y`. Convert: `x = 10^2`, `y = 10^1`." }, { match:[10, 100], fb:"Swapped. `log x - log y = 1` is positive, so `x` is the bigger number." }],
            hints:["Add the two equations.", "`2 log x = 4`, so `log x = 2`. Then `log y = 3 - 2 = 1`.", "`x = 10^2 = 100` and `y = 10^1 = 10`. Check: `log 100 + log 10 = 3` and `log 100 - log 10 = 1`."] },
          { id:"r4", goal:3, kind:"one", tag:"R4", prompt:"Solve `log_3 x + log_9 x = 3`.", answer:9, display:"`x = 9`",
            wrong:[{ match:5.196, tol:0.002, fb:"That treats `log_9 x` as `log_3 x`. The bases are different." }, { match:3, fb:"`log_9 x` is <strong>half</strong> of `log_3 x`, not twice it: a bigger base takes fewer steps." }, { match:1728, fb:"Bases don’t add: `log_3 x + log_9 x` isn’t `log_{12} x`." }],
            hints:["The bases differ. Rewrite `log_9 x` in base 3.", "Change of base: `log_9 x = log_3 x / log_3 9 = (1/2) log_3 x`.", "`(3/2) log_3 x = 3`, so `log_3 x = 2` and `x = 9`. Check: `log_3 9 + log_9 9 = 2 + 1 = 3`."] },
          { id:"r5", goal:2, kind:"one", tag:"R5", prompt:"Solve `log_2(log_3 x) = 2`.", answer:81, display:"`x = 81`",
            wrong:[{ match:9, fb:"`log_2(log_3 x) = 2` means `log_3 x = 2^2 = 4`, not 2." }, { match:64, fb:"`log_3 x = 4` means `x = 3^4`, not `4^3`." }, { match:4, fb:"4 is `log_3 x`. One more step: `x = 3^4`." }],
            hints:["Work from the outside in. Let `y = log_3 x`.", "`log_2 y = 2` means `y = 2^2 = 4`, so `log_3 x = 4`.", "`x = 3^4 = 81`. Check: `log_3 81 = 4` and `log_2 4 = 2`. (Restriction: `log_3 x > 0`, so `x > 1`; 81 passes.)"] },
          { id:"r6", goal:5, kind:"one", tag:"R6", prompt:"The time, in hours, for a bacteria culture to grow from 300 cells to `N` cells is `t = 2 log_2(N/300)`. How many cells are there after 10 hours?", answer:9600, display:"9600 cells", unit:"cells",
            wrong:[{ match:7500, fb:"That uses `5^2 = 25`. `log_2(N/300) = 5` means `N/300 = 2^5 = 32`." }, { match:3000, fb:"That uses 2 × 5 = 10. A log is an exponent: `N/300 = 2^5`." }, { match:307200, fb:"That skips dividing by 2: `10 = 2 log_2(N/300)` gives `log_2(N/300) = 5`, not 10." }],
            hints:["Substitute `t = 10`, then get the log by itself.", "`10 = 2 log_2(N/300)`, so `log_2(N/300) = 5`.", "`N/300 = 2^5 = 32`, so `N = 9600`. Check: `2 log_2(9600/300) = 2 log_2 32 = 2 × 5 = 10`."] },
          { id:"r7", goal:4, kind:"set", tag:"R7", prompt:"Solve `log_2(x^2) - log_2(x + 3) = 2`.", answer:[6, -2], display:"`x = 6` and `x = -2`",
            wrong:[{ match:[6], fb:"`x = -2` also works: `log_2 4 - log_2 1 = 2 - 0 = 2`. If you wrote `log_2(x^2)` as `2 log_2 x`, that step only allows `x > 0` and lost −2." }],
            hints:["Restrictions: `x^2 > 0` and `x + 3 > 0`. Don’t turn `log_2(x^2)` into `2 log_2 x`: that would add `x > 0`.", "Quotient law: `log_2({x^2}/{x + 3}) = 2`, so `x^2 = 4(x + 3)`.", "`x^2 - 4x - 12 = 0`, so `(x - 6)(x + 2) = 0`. `x = 6`: `log_2 36 - log_2 9 = log_2 4 = 2`. `x = -2`: `log_2 4 - log_2 1 = 2`. Both are solutions."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about the ghost branch, or about which steps can gain or lose a root?" },
      { id:"j2", q:"In your own words, why can a correct solution produce an extraneous root, and why does the check have to use the original equation?" },
      { id:"j3", q:"Explain to a friend, step by step, how to solve `log_3 x + log_3(x - 8) = 2`, including the check." },
      { id:"j4", q:"Which step do you still find tricky: the restrictions, combining, converting or checking? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Solve `log_3(x - 4) = 2`.", options:[
          { t:"`x = 13`", ok:true, why:"`x - 4 = 3^2 = 9`, so `x = 13`. Check: `log_3 9 = 2`." },
          { t:"`x = 12`", why:"That uses `2^3 = 8`. The base of the log is the base of the power: `3^2`." },
          { t:"`x = 10`", why:"That uses 3 × 2 = 6. A log is an exponent: `x - 4 = 3^2`." },
          { t:"`x = 5`", why:"`x - 4 = 9` means `x = 9 + 4`. Check `x = 5`: `log_3 1 = 0`, not 2." }] },
        b:{ prompt:"Solve `log_2(x + 3) = 5`.", options:[
          { t:"`x = 29`", ok:true, why:"`x + 3 = 2^5 = 32`, so `x = 29`. Check: `log_2 32 = 5`." },
          { t:"`x = 22`", why:"That uses `5^2 = 25`. The base is 2: `2^5 = 32`." },
          { t:"`x = 7`", why:"That uses 2 × 5 = 10. A log is an exponent: `x + 3 = 2^5`." },
          { t:"`x = 35`", why:"`x + 3 = 32` means `x = 32 - 3`." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"What are the restrictions on `x` for `log_2(x + 3) + log_2(x - 1) = 5`?", options:[
          { t:"`x > 1`", ok:true, why:"Both arguments must be positive: `x > -3` and `x > 1`. Both hold exactly when `x > 1`." },
          { t:"`x > -3`", why:"That’s only the first log’s condition. `x - 1` must be positive too." },
          { t:"`x > 0`", why:"The arguments must be positive, not `x`. And `x = 1/2` would make `x - 1` negative." },
          { t:"`x < -3` or `x > 1`", why:"That’s where `log_2((x + 3)(x - 1))` exists, after combining. The original needs each argument positive." }] },
        b:{ prompt:"What are the restrictions on `x` for `log_5(x - 4) + log_5(x + 2) = 1`?", options:[
          { t:"`x > 4`", ok:true, why:"`x > 4` and `x > -2` both hold exactly when `x > 4`." },
          { t:"`x > -2`", why:"That’s only the second log’s condition. `x - 4` must be positive too." },
          { t:"`x > 0`", why:"The arguments must be positive, not `x`. `x = 1` would make `x - 4` negative." },
          { t:"`x < -2` or `x > 4`", why:"That’s where the combined log exists. The original needs each argument positive." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Combine the logs and convert to exponential form. Which equation does `log_2 x + log_2(x + 2) = 3` become?", options:[
          { t:"`x(x + 2) = 8`", ok:true, why:"Product law: `log_2(x(x + 2)) = 3`. Exponential form: `x(x + 2) = 2^3 = 8`." },
          { t:"`2x + 2 = 8`", why:"That adds the arguments. Adding logs multiplies them." },
          { t:"`x(x + 2) = 9`", why:"That uses `3^2`. The base is 2: `2^3 = 8`." },
          { t:"`x(x + 2) = 6`", why:"That uses 2 × 3. A log is an exponent: `2^3 = 8`." }] },
        b:{ prompt:"Combine the logs and convert to exponential form. Which equation does `log_3 x - log_3(x - 2) = 2` become?", options:[
          { t:"`{x}/{x - 2} = 9`", ok:true, why:"Quotient law: `log_3({x}/{x - 2}) = 2`. Exponential form: `{x}/{x - 2} = 3^2 = 9`." },
          { t:"`x - (x - 2) = 9`", why:"That subtracts the arguments. Subtracting logs divides them." },
          { t:"`{x}/{x - 2} = 8`", why:"That uses `2^3`. The base is 3: `3^2 = 9`." },
          { t:"`{x}/{x - 2} = 6`", why:"That uses 3 × 2. A log is an exponent: `3^2 = 9`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Solve `2 log_3 x = log_3(x + 6)`.", options:[
          { t:"`x = 3` only", ok:true, why:"Power law: `log_3(x^2) = log_3(x + 6)`, so `x^2 = x + 6` and `(x - 3)(x + 2) = 0`. `x = -2` fails the original, which needs `x > 0` for `log_3 x`." },
          { t:"`x = 3` or `x = -2`", why:"Both satisfy `log_3(x^2) = log_3(x + 6)`: at −2 that reads `log_3 4 = log_3 4`. But the original has `2 log_3 x`, and `log_3(-2)` doesn’t exist." },
          { t:"`x = 6`", why:"That treats `2 log_3 x` as `log_3(2x)`, so `2x = x + 6`. The power law gives `log_3(x^2)`. Check: `2 log_3 6 = log_3 36`, but `log_3 12` isn’t that." },
          { t:"`x = 2` only", why:"Sign slip: `x^2 - x - 6 = (x - 3)(x + 2)`, not `(x + 3)(x - 2)`. Check `x = 2`: `log_3 4` isn’t `log_3 8`." }] },
        b:{ prompt:"Solve `2 log_2 x = log_2(x + 12)`.", options:[
          { t:"`x = 4` only", ok:true, why:"`log_2(x^2) = log_2(x + 12)`, so `x^2 - x - 12 = 0` and `(x - 4)(x + 3) = 0`. `x = -3` fails the original: `log_2(-3)` doesn’t exist." },
          { t:"`x = 4` or `x = -3`", why:"Both satisfy `log_2(x^2) = log_2(x + 12)`: at −3 that reads `log_2 9 = log_2 9`. But the original needs `x > 0`." },
          { t:"`x = 12`", why:"That treats `2 log_2 x` as `log_2(2x)`. Check: `2 log_2 12 = log_2 144`, but `log_2 24` isn’t that." },
          { t:"`x = 3` only", why:"Sign slip: `(x + 4)(x - 3) = x^2 + x - 12`. Check `x = 3`: `log_2 9` isn’t `log_2 15`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Solve `log(x^2) = 4`.", options:[
          { t:"`x = 100` or `x = -100`", ok:true, why:"Convert directly: `x^2 = 10^4 = 10 000`, so `x = ±100`. Both make `x^2 = 10 000` positive, so both are solutions." },
          { t:"`x = 100` only", why:"That comes from writing `2 log x = 4`, which only allows `x > 0`. `log(x^2)` also exists for negative `x`: `log((-100)^2) = log 10 000 = 4`." },
          { t:"`x = 2√10` or `x = -2√10`", why:"That uses `x^2 = 4 × 10 = 40`. Convert: `x^2 = 10^4`." },
          { t:"`x = 10 000` or `x = -10 000`", why:"`x^2 = 10 000`, so `x` is the square root: ±100." }] },
        b:{ prompt:"Solve `log_2(x^2) = 6`.", options:[
          { t:"`x = 8` or `x = -8`", ok:true, why:"`x^2 = 2^6 = 64`, so `x = ±8`. Both make `x^2 = 64` positive." },
          { t:"`x = 8` only", why:"That comes from `2 log_2 x = 6`, which only allows `x > 0`. `log_2((-8)^2) = log_2 64 = 6`." },
          { t:"`x = 2√3` or `x = -2√3`", why:"That uses `x^2 = 2 × 6 = 12`. Convert: `x^2 = 2^6`." },
          { t:"`x = 64` or `x = -64`", why:"`x^2 = 64`, so `x` is the square root: ±8." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"Solve `log_x(x + 12) = 2`.", options:[
          { t:"`x = 4` only", ok:true, why:"`x^2 = x + 12`, so `(x - 4)(x + 3) = 0`. A base must be positive and not 1, so `x = -3` is rejected. Check: `log_4 16 = 2`." },
          { t:"`x = 4` or `x = -3`", why:"At `x = -3` the argument, 9, is positive, but the base would be −3. A base must be positive and not 1." },
          { t:"`x = 12`", why:"That uses `x + 12 = 2x`. `log_x(x + 12) = 2` means `x^2 = x + 12`." },
          { t:"No solution, because a base can’t contain `x`", why:"A base can be unknown, as long as it ends up positive and not 1. Convert: `x^2 = x + 12`." }] },
        b:{ prompt:"Solve `log_x(x + 20) = 2`.", options:[
          { t:"`x = 5` only", ok:true, why:"`x^2 = x + 20`, so `(x - 5)(x + 4) = 0`. A base must be positive, so `x = -4` is rejected. Check: `log_5 25 = 2`." },
          { t:"`x = 5` or `x = -4`", why:"At `x = -4` the argument, 16, is positive, but the base would be −4. A base must be positive and not 1." },
          { t:"`x = 20`", why:"That uses `x + 20 = 2x`. `log_x(x + 20) = 2` means `x^2 = x + 20`." },
          { t:"No solution, because a base can’t contain `x`", why:"A base can be unknown, as long as it ends up positive and not 1. Convert: `x^2 = x + 20`." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"`x = -5` satisfies `(x + 4)(x - 4) = 9`. Which is the best explanation of why it is <strong>not</strong> a solution of `log_3(x + 4) + log_3(x - 4) = 2`?", options:[
          { t:"“In the original equation, `x = -5` gives `log_3(-1)` and `log_3(-9)`. Logarithms of negative numbers don’t exist, so −5 is outside the restriction `x > 4`.”", ok:true, why:"This uses the original equation and names the arguments that fail." },
          { t:"“Negative numbers are never solutions of logarithmic equations.”", why:"Not true: −2 solves `log_2(x + 6) + log_2(x + 4) = 3`. It’s the arguments that must be positive." },
          { t:"“At `x = -5`, `(x + 4)(x - 4) = (-1)(-9) = -9`, not 9.”", why:"The arithmetic is wrong: (−1)(−9) = 9. That’s exactly why the combined equation accepts −5." },
          { t:"“`x = -5` doesn’t satisfy `log_3((x + 4)(x - 4)) = 2`.”", why:"It does: `log_3 9 = 2`. The combined equation exists where both factors are negative; the original doesn’t." }] },
        b:{ prompt:"`x = -3` satisfies `(x + 1)(x - 1) = 8`. Which is the best explanation of why it is <strong>not</strong> a solution of `log_2(x + 1) + log_2(x - 1) = 3`?", options:[
          { t:"“In the original equation, `x = -3` gives `log_2(-2)` and `log_2(-4)`. Logarithms of negative numbers don’t exist, so −3 is outside the restriction `x > 1`.”", ok:true, why:"This uses the original equation and names the arguments that fail." },
          { t:"“Negative numbers are never solutions of logarithmic equations.”", why:"Not true: −2 solves `log_2(x + 6) + log_2(x + 4) = 3`." },
          { t:"“At `x = -3`, `(x + 1)(x - 1) = (-2)(-4) = -8`, not 8.”", why:"The arithmetic is wrong: (−2)(−4) = 8." },
          { t:"“`x = -3` doesn’t satisfy `log_2((x + 1)(x - 1)) = 3`.”", why:"It does: `log_2 8 = 3`. Only the original equation rules −3 out." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which line is a complete check that `x = 5` solves `log_2(x - 1) + log_2(x + 3) = 5`?", options:[
          { t:"“`x - 1 = 4 > 0` and `x + 3 = 8 > 0`, and `log_2 4 + log_2 8 = 2 + 3 = 5`.”", ok:true, why:"It checks every argument of the original and then both sides." },
          { t:"“`x = 5 > 0`, so `x = 5` is a solution.”", why:"It’s the arguments that must be positive, and the two sides must still be compared." },
          { t:"“`(5 - 1)(5 + 3) = 32 = 2^5`, so `x = 5` is a solution.”", why:"That checks the combined equation. `x = -7` passes this test too, since (−8)(−4) = 32, and it isn’t a solution." },
          { t:"“`x - 1 = 4 > 0`, so `x = 5` is a solution.”", why:"That checks one argument only, and never compares the two sides." }] },
        b:{ prompt:"Which line is a complete check that `x = 7` solves `log_3(x + 2) + log_3(x - 4) = 3`?", options:[
          { t:"“`x + 2 = 9 > 0` and `x - 4 = 3 > 0`, and `log_3 9 + log_3 3 = 2 + 1 = 3`.”", ok:true, why:"It checks every argument of the original and then both sides." },
          { t:"“`x = 7 > 0`, so `x = 7` is a solution.”", why:"It’s the arguments that must be positive, and the sides must still be compared." },
          { t:"“`(7 + 2)(7 - 4) = 27 = 3^3`, so `x = 7` is a solution.”", why:"That checks the combined equation. `x = -5` passes this test too, since (−3)(−9) = 27, and it isn’t a solution." },
          { t:"“`x - 4 = 3 > 0`, so `x = 7` is a solution.”", why:"That checks one argument only, and never compares the two sides." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A sound’s level in decibels is `L = 10 log(I/I_0)`, where `I` is its intensity in W/m² and `I_0` = `10^{-12}` W/m². A leaf blower measures 100 dB. What is its intensity?", options:[
          { t:"`10^{-2}` W/m²", ok:true, why:"`log(I/I_0) = 10`, so `I/I_0 = 10^{10}` and `I = 10^{10} × 10^{-12} = 10^{-2}` W/m²." },
          { t:"`10^{-22}` W/m²", why:"That divides `I_0` by `10^{10}`. `I = I_0 × 10^{10}`." },
          { t:"`10^{10}` W/m²", why:"That’s `I/I_0`, the ratio. Multiply by `I_0 = 10^{-12}`." },
          { t:"`10^{88}` W/m²", why:"That uses `10^{100}`, skipping the division by 10. `log(I/I_0) = 100/10 = 10`." }] },
        b:{ prompt:"A sound’s level in decibels is `L = 10 log(I/I_0)`, where `I` is its intensity in W/m² and `I_0` = `10^{-12}` W/m². A vacuum cleaner measures 70 dB. What is its intensity?", options:[
          { t:"`10^{-5}` W/m²", ok:true, why:"`log(I/I_0) = 7`, so `I = 10^7 × 10^{-12} = 10^{-5}` W/m²." },
          { t:"`10^{-19}` W/m²", why:"That divides `I_0` by `10^7`. `I = I_0 × 10^7`." },
          { t:"`10^7` W/m²", why:"That’s `I/I_0`, the ratio. Multiply by `I_0 = 10^{-12}`." },
          { t:"`10^{58}` W/m²", why:"That uses `10^{70}`, skipping the division by 10. `log(I/I_0) = 70/10 = 7`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Two identical machines running together make a sound level of 83 dB. With `L = 10 log(I/I_0)`, and the two intensities adding, what is the level of one machine alone?", use:"`log 2 ≈ 0.301`", options:[
          { t:"About 80 dB", ok:true, why:"`10 log(2I/I_0) = 10 log 2 + 10 log(I/I_0) = 83`, so one machine is 83 − `10 log 2` ≈ 83 − 3.01 ≈ 80 dB." },
          { t:"About 41.5 dB", why:"That halves the level. Doubling the intensity adds `10 log 2` ≈ 3 dB; it doesn’t double the decibels." },
          { t:"About 82.7 dB", why:"That subtracts `log 2` ≈ 0.301. In decibels the product law gives `10 log 2` ≈ 3.01." },
          { t:"About 86 dB", why:"One machine is quieter than two, so subtract `10 log 2`: 83 − 3.01." }] },
        b:{ prompt:"Four identical machines running together make a sound level of 90 dB. With `L = 10 log(I/I_0)`, and the four intensities adding, what is the level of one machine alone?", use:"`log 2 ≈ 0.301`", options:[
          { t:"About 84 dB", ok:true, why:"`10 log(4I/I_0) = 10 log 4 + 10 log(I/I_0) = 90`, and `10 log 4 = 20 log 2` ≈ 6.02, so one machine is about 90 − 6.02 ≈ 84 dB." },
          { t:"About 22.5 dB", why:"That divides the level by 4. Four times the intensity adds `10 log 4` ≈ 6 dB." },
          { t:"About 89.4 dB", why:"That subtracts `log 4` ≈ 0.602. In decibels the product law gives `10 log 4` ≈ 6.02." },
          { t:"About 96 dB", why:"One machine is quieter than four, so subtract `10 log 4`: 90 − 6.02." }] } }
    ]
  },
  task:{
    title:"Six apart", summary:"Six apart",
    statement:"<p>Design an equation `log_2(x + p) + log_2(x + q) = m` whose solution is a <strong>negative integer</strong>, and whose algebra also produces an extraneous candidate exactly <strong>6 less</strong> than the solution. There’s more than one design. Can you find them all?</p><p class=\"tiny muted\">Choose whole numbers: `p` and `q` from −8 to 8, and `m` from 1 to 7. The base is fixed at 2. Every equation of this form has exactly one solution and exactly one extraneous candidate, as P3 showed.</p>",
    checks:["The solution is an integer", "The solution is negative", "The extraneous candidate is exactly 6 less than the solution"],
    tips:["Right now the solution is {s}. For an integer solution, the arguments `x + p` and `x + q` at the solution must be whole numbers that multiply to `2^m`. Try a factor pair of `2^m`, such as 2 × 4 = 8.",
      "Your solution is {s}, which isn’t negative. Add the same number to `p` and `q`: that slides the whole graph left by that amount, and the solution moves with it.",
      "The gap is {g}. At the extraneous candidate the two arguments are the negatives of the ones at the solution, swapped. So the gap equals the <strong>sum</strong> of the two arguments at the solution. Which two arguments multiply to `2^m` and add to 6?"],
    explainPrompt:"Explain why your equation has exactly one solution, and why the extraneous candidate is 6 below it.",
    vocab:"Use the words restriction, argument, extraneous and product law.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    allFound:"You found all four. In each one, the arguments at the solution are 2 and 4: product `8 = 2^3`, sum 6. At the extraneous candidate they are −4 and −2."
  },
  cards:[
    ["`log_b A = m`", "`A = b^m`: the log is the exponent. Example: `log_2(x + 5) = 3` means `x + 5 = 2^3 = 8`, so `x = 3`."],
    ["Restrictions of a log equation", "Every argument must be positive, and a base that contains `x` must be positive and not 1. Write them first. `log_2 x + log_2(x - 2) = 3` needs `x > 0` and `x > 2`, so `x > 2`."],
    ["Extraneous root", "A candidate the algebra produces that doesn’t satisfy the original equation. In log equations, it makes some argument zero or negative. Example: `x = -2` for `log_2 x + log_2(x - 2) = 3`."],
    ["Why can combining logs add a root?", "`log_b A + log_b B` needs `A > 0` and `B > 0`, but `log_b(AB)` only needs `AB > 0`, which is also true when both are negative. The combined equation has a bigger domain: the ghost branch."],
    ["Does converting `log_b A = m` to `A = b^m` add or lose roots?", "Neither. `b^m` is always positive, so `A = b^m` forces `A > 0`. The two equations have exactly the same solutions."],
    ["`log_b A = log_b B`", "Then `A = B`, but `A = B` can also hold where both are negative. `log_2(x^2 - 5) = log_2(4x)` gives `x = 5` or `x = -1`, and −1 makes both arguments −4."],
    ["How to check a candidate", "Substitute into the <strong>original</strong> equation: every argument positive, then both sides equal. Checking the combined equation isn’t enough."],
    ["Can a negative `x` be a solution?", "Yes, if every argument is positive. In `log_2(x + 6) + log_2(x + 4) = 3`, `x = -2` gives `log_2 4 + log_2 2 = 2 + 1 = 3`."],
    ["`log(x^2)` and `2 log x`", "Equal only for `x > 0`. Writing `log(x^2) = 2` as `2 log x = 2` loses `x = -10`. Solve `x^2 = 100` directly: `x = ±10`."],
    ["Four steps for a log equation", "1. State the restrictions. 2. Get a single log on each side (product, quotient and power laws). 3. Convert, or drop the logs. 4. Solve, then check every candidate in the original."],
    ["A base that contains `x`: `log_x 25 = 2`", "`x^2 = 25` gives `x = ±5`, but a base must be positive and not 1, so `x = 5` only."],
    ["Sound level `L = 10 log(I/I_0)`", "Solve for `I`: `I = I_0 × 10^{L/10}`. For `L` = 90 dB and `I_0` = `10^{-12}` W/m², `I = 10^9 × 10^{-12} = 10^{-3}` W/m²."]
  ]
};
