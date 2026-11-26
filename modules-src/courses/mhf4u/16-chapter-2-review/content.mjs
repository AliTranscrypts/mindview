// MHF4U 16 Chapter 2 Summary & Review: the plan's content as data (plan modules/16-chapter-2-review.md).
// Review module: Start (goals + diagnostic), Connect (which tool solves this?), Mixed practice, Reflect, Final Check.

// Connect sorter: the plan gives one feedback line per problem, shown for every wrong box (and as the reason when right).
const BOXES = ["rem", "fac", "pat", "fam", "sign"];
const sortItem = (id, topic, t, box, fb) => {
  const wrong = {};
  BOXES.filter(b => b !== box).forEach(b => { wrong[b] = fb; });
  return { id, topic, goal:6, t, answer:box, why:fb, wrong };
};

export default {
  id:"16-chapter-2-review",
  kind:"review",
  title:"Chapter 2 summary and review",
  topic:"Chapter 2 Summary & Review",
  hero:{
    eq:"`P(x) = x^3 - 3x^2 - 10x + 24`", eqLabel:"P of x equals x cubed minus 3 x squared minus 10 x plus 24", eqSize:"md",
    headline:"One polynomial, the whole chapter",
    text:"Divide it, factor it, solve it, find its family, and decide where it’s negative. Each Chapter 2 tool answers one question about the same polynomial.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ aria:"Graph of P of x equals (x − 2)(x − 4)(x + 3), crossing the x-axis at −3, 2 and 4. The point (1, 12) is marked, a fan of other members of the family k(x − 2)(x − 4)(x + 3) spreads around it, and the intervals (−∞, −3) and (2, 4), where P is negative, are shaded.",
      captions:[
        "`P(1) = 12`: the remainder for `x - 1` · module 11",
        "`P(2) = 0`: so `x - 2` is a factor · module 12",
        "`(x - 2)(x - 4)(x + 3) = 0`: roots −3, 2, 4 · module 13",
        "the family `k(x - 2)(x - 4)(x + 3)` · module 14",
        "`P(x) < 0` on `(-∞, -3)` and `(2, 4)` · module 15"] }
  },
  goals:[
    "I can divide polynomials and use the remainder theorem, including for divisors `ax - b`.",
    "I can use the factor theorem, the rational zero theorem and patterns to factor fully.",
    "I can solve polynomial equations of degree ≤ 4 and connect roots to `x`-intercepts.",
    "I can write the family of polynomials with given zeros and find the member through a point.",
    "I can solve polynomial inequalities with a sign chart and write the answer in interval notation.",
    "I can choose the right tool, or chain of tools, for a polynomial problem."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "11":{ idea:"Dividing `P(x)` by `x - b` leaves `P(b)`; by `ax - b`, `P(b/a)`. `P(x)` = (divisor)(quotient) + remainder.",
      look:"Division stepper (Explore); The remainder shortcut (Shortcut)" },
    "12":{ idea:"`P(b) = 0` ⟺ `x - b` is a factor. Test candidates `±p/q`, divide out each factor, and use grouping and cube patterns.",
      look:"Root hunter (Explore); Cube patterns and grouping (Cubes)" },
    "13":{ idea:"Get 0 on one side, factor, set each factor to 0. Real roots are `x`-intercepts; never divide by `x`.",
      look:"Strategy path (Explore); Roots ↔ intercepts (Roots)" },
    "14":{ idea:"Same zeros, many functions: `y = k(x - r_1)(x - r_2)…`; one more point fixes `k`.",
      look:"Family fan (Explore); Build the equation from conditions (Conditions)" },
    "15":{ idea:"Factor, mark the zeros, test each interval’s sign, and choose brackets for <, ≤, >, ≥.",
      look:"Sign chart builder, with its Build and Scan modes (Explore); Above or below? Two graphs, one inequality (Compare)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Eight questions, at least one from each Chapter 2 module. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"11", goal:1,
          prompt:"What is the remainder when `2x^3 - 5x^2 + x + 3` is divided by `x - 2`?",
          options:[
            { t:"1", ok:true, why:"`P(2) = 16 - 20 + 2 + 3 = 1`." },
            { t:"−35", why:"That’s `P(-2)`. The divisor `x - 2` uses `P(2)`." },
            { t:"0", why:"Only a factor leaves remainder 0." },
            { t:"3", why:"3 is the constant term, `P(0)`." }],
          hints:["Remainder theorem.", "Evaluate `P(2)`.", "`16 - 20 + 2 + 3 = 1`."] },
        { id:"d2", topic:"11", goal:1,
          prompt:"What is the remainder when `4x^3 - 2x + 5` is divided by `2x - 1`?",
          options:[
            { t:"`9/2`", ok:true, why:"`P(1/2) = 4(1/8) - 1 + 5 = 9/2`." },
            { t:"7", why:"That’s `P(1)`. The zero of `2x - 1` is `1/2`." },
            { t:"`11/2`", why:"That’s `P(-1/2)`." },
            { t:"33", why:"That’s `P(2)`." }],
          hints:["Where is `2x - 1` zero?", "At `x = 1/2`.", "`1/2 - 1 + 5 = 9/2`."] },
        { id:"d3", topic:"12", goal:2,
          prompt:"Which is a factor of `x^3 - 7x - 6`?",
          options:[
            { t:"`x + 1`", ok:true, why:"`P(-1) = -1 + 7 - 6 = 0`." },
            { t:"`x - 1`", why:"`P(1) = -12`." },
            { t:"`x - 2`", why:"`P(2) = -12`. (`x + 2` is a factor.)" },
            { t:"`x + 3`", why:"`P(-3) = -12`. (`x - 3` is a factor.)" }],
          hints:["Test the zero of each option.", "`x + 1` is zero at −1.", "`P(-1) = 0`."] },
        { id:"d4", topic:"12", goal:2,
          prompt:"Factor `27x^3 - 8`.",
          options:[
            { t:"`(3x - 2)(9x^2 + 6x + 4)`", ok:true, why:"`a = 3x`, `b = 2`: `(a - b)(a^2 + ab + b^2)`." },
            { t:"`(3x - 2)(9x^2 - 6x + 4)`", why:"The middle sign is the opposite of the first factor’s: +." },
            { t:"`(3x - 2)^3`", why:"That expands to more than two terms." },
            { t:"`(3x + 2)(9x^2 - 6x + 4)`", why:"That’s `27x^3 + 8`." }],
          hints:["Difference of cubes.", "`(3x)^3 - 2^3`.", "Same, Opposite, Always plus."] },
        { id:"d5", topic:"13", goal:3,
          prompt:"Solve `x^4 - 10x^2 + 9 = 0`.",
          options:[
            { t:"`x = ±1 or ±3`", ok:true, why:"`(x^2 - 1)(x^2 - 9) = 0`." },
            { t:"`x = 1 or 9`", why:"Those are the values of `x^2`." },
            { t:"`x = ±1 or ±9`", why:"`x^2 = 9` gives ±3." },
            { t:"`x = 1 or 3`", why:"Each square has two roots." }],
          hints:["Let `u = x^2`.", "`(u - 1)(u - 9) = 0`.", "`x = ±1, ±3`."] },
        { id:"d6", topic:"14", goal:4,
          prompt:"Which member of the family with zeros −1, 2 and 4 (each of order 1) passes through `(0, 16)`?",
          options:[
            { t:"`y = 2(x + 1)(x - 2)(x - 4)`", ok:true, why:"At 0: `k(1)(-2)(-4) = 8k = 16`, so `k = 2`." },
            { t:"`y = 16(x + 1)(x - 2)(x - 4)`", why:"16 is the `y`-value, not `k`." },
            { t:"`y = {1}/{2}(x + 1)(x - 2)(x - 4)`", why:"`8k = 16` gives `k = 2`." },
            { t:"`y = 2(x - 1)(x + 2)(x + 4)`", why:"Zeros −1, 2, 4 come from `(x + 1)(x - 2)(x - 4)`." }],
          hints:["Write `y = k(x + 1)(x - 2)(x - 4)`.", "Substitute `(0, 16)`.", "`8k = 16`."] },
        { id:"d7", topic:"15", goal:5,
          prompt:"Solve `(x + 1)(x - 3) ≤ 0`.",
          options:[
            { t:"`[-1, 3]`", ok:true, why:"Negative between the zeros; ≤ includes them." },
            { t:"`(-1, 3)`", why:"≤ includes the zeros: square brackets." },
            { t:"`(-∞, -1] ∪ [3, ∞)`", why:"That’s where it’s ≥ 0." },
            { t:"`[-3, 1]`", why:"The zeros are −1 and 3." }],
          hints:["Zeros?", "−1 and 3; test 0: `(1)(-3) < 0`.", "`[-1, 3]`."] },
        { id:"d8", topic:"15", goal:5,
          prompt:"Solve `(x - 2)^2(x + 1) > 0`.",
          options:[
            { t:"`(-1, 2) ∪ (2, ∞)`", ok:true, why:"Positive for `x > -1`, except at `x = 2`, where it’s 0." },
            { t:"`(-1, ∞)`", why:"At `x = 2` the expression is 0, which isn’t > 0." },
            { t:"`(-∞, -1)`", why:"That’s where it’s negative." },
            { t:"`(-1, 2)`", why:"The squared factor doesn’t change the sign at 2: it’s positive again after 2." }],
          hints:["Only `(x + 1)` can change sign.", "`(x - 2)^2 ≥ 0`, and `= 0` at 2.", "`(-1, 2) ∪ (2, ∞)`."] }
      ]
    }
  },

  // ---------- Connect: which tool solves this? (toolkit sorter, then app.activities.chains and app.activities.onepage) ----------
  connect:{
    heading:"Which tool solves this?",
    intro:"Every Chapter 2 module taught one tool, but real problems don’t say which tool to use. First sort eleven problems by the <strong>first</strong> tool you’d use. Then put the tools in order for two problems that need several of them.",
    activities:[
      { id:"sort", type:"sorter", title:"Part A: Which tool first?", summary:"Connect sorter", goal:6, noun:"problem", txt:true,
        instruction:"Sort each problem by the first tool you’d use.",
        boxes:[
          { id:"rem", label:"Remainder theorem: evaluate `P(b)`", sub:"Module 11" },
          { id:"fac", label:"Factor theorem: test, then divide", sub:"Module 12" },
          { id:"pat", label:"Grouping or a special pattern", sub:"Module 12" },
          { id:"fam", label:"Family: zeros + one point", sub:"Module 14" },
          { id:"sign", label:"Sign chart", sub:"Module 15" }],
        items:[
          sortItem("c1", "11", "Find the remainder when `x^5 - 3x + 2` is divided by `x - 1`.", "rem", "No division needed: `P(1) = 0` is the remainder."),
          sortItem("c2", "12", "Is `x - 4` a factor of `x^3 - 3x^2 - 6x + 8`?", "fac", "Evaluate `P(4)`: `64 - 48 - 24 + 8 = 0`, so yes."),
          sortItem("c3", "12", "Factor `x^3 + 2x^2 - 16x - 32`.", "pat", "`x^2(x + 2) - 16(x + 2)`: grouping is quickest."),
          sortItem("c4", "14", "Find the cubic with zeros 1, 2 and 3 that passes through `(0, 12)`.", "fam", "Write `k(x - 1)(x - 2)(x - 3)` and use the point."),
          sortItem("c5", "15", "Solve `x^3 - 2x^2 - 5x + 6 > 0`.", "sign", "It’s an inequality: factor, then test intervals."),
          sortItem("c6", "12", "Find `k` so that `x + 2` is a factor of `x^3 + kx + 6`.", "fac", "Set `P(-2) = 0`."),
          sortItem("c7", "12", "Factor `125x^3 - 1`.", "pat", "Difference of cubes."),
          sortItem("c8", "13", "Solve `2x^3 - 3x^2 - 3x + 2 = 0`.", "fac", "No pattern or grouping: test ±1, ±2, `±1/2`."),
          sortItem("c9", "15", "For which `x` is `(x - 1)^2(x + 3) ≥ 0`?", "sign", "An inequality, already factored."),
          sortItem("c10", "14", "Which quartic touches the axis at 2 and at −2 and passes through `(0, 32)`?", "fam", "`k(x - 2)^2(x + 2)^2`, then the point."),
          sortItem("c11", "11", "Without dividing, find the remainder of `(2x^3 + x - 7) ÷ (2x - 1)`.", "rem", "`P(1/2) = 1/4 + 1/2 - 7`.")
        ] },
      { id:"chains", type:"custom", title:"Part B: Tool chains", summary:"Tool chains", goal:6,
        instruction:"Put the tools in order for each problem.",
        how:"Tap a card, then use Move up and Move down to put it in place. Press Check the order when you’re done.",
        sequences:[
          { id:"L1", topics:["12", "13", "15"], goal:6,
            prompt:"Solve `x^3 - 3x^2 - 10x + 24 ≤ 0`.",
            steps:["Test candidates: `P(2) = 0`", "Divide by `x - 2`: `x^2 - x - 12`", "Factor: `(x - 2)(x - 4)(x + 3)`",
              "Sign chart on `(-∞, -3)`, `(-3, 2)`, `(2, 4)`, `(4, ∞)`", "Answer: `(-∞, -3] ∪ [2, 4]`"],
            start:[3, 1, 4, 0, 2],
            // feedback when this card is the first one out of place (it has been put too early)
            fb:["", "You can’t divide by `x - 2` until you know it’s a factor.", "You need the quotient before you can write the full factored form.",
              "You can’t make a sign chart before you know the zeros.", "The answer comes from the sign chart, so it’s the last step."] },
          { id:"L2", topics:["11", "14"], goal:6, stretch:true,
            prompt:"Find the member of the family `k(x + 1)(x - 2)(x - 3)` whose remainder is 6 when divided by `x - 1`.",
            steps:["Write the family", "Remainder theorem: the remainder is `P(1)`", "`P(1) = k(2)(-1)(-2) = 4k`", "Solve `4k = 6`: `k = 3/2`",
              "Answer: `y = (3/2)(x + 1)(x - 2)(x - 3)`"],
            decoy:"Divide by `x - 1` using synthetic division",
            decoyNote:"That works too, but the remainder theorem is faster.",
            spareLabel:"Not needed in the chain",
            start:[2, 5, 0, 4, 1, 3],
            fb:["", "Write the family first: the remainder theorem needs a polynomial to evaluate.", "First decide what to find: the remainder theorem says the remainder is `P(1)`.",
              "You need `P(1) = 4k` before you can set it equal to 6.", "The answer needs the value of `k`, so it comes last."],
            fbDecoy:"Write the family first: synthetic division needs a polynomial to divide.",
            fbTwice:"You only need one way to find the remainder. Move the other card to “Not needed in the chain”." }
        ] },
      { id:"onepage", type:"custom", title:"The chapter on one page", goal:6, how:"",
        intro:"Five tools, one polynomial: `P(x) = x^3 - 3x^2 - 10x + 24`. Each step answers one question with one module’s tool.",
        locked:"“The chapter on one page” appears when the sorter and both tool chains are done.",
        steps:[
          { name:"Remainder", mod:"11", html:"`P(1) = 1 - 3 - 10 + 24 = 12`: the remainder when `P(x)` is divided by `x - 1`." },
          { name:"Factor", mod:"12", html:"`P(2) = 0`, so `x - 2` is a factor. Dividing gives `x^2 - x - 12`, so `P(x) = (x - 2)(x - 4)(x + 3)`." },
          { name:"Solve", mod:"13", html:"`(x - 2)(x - 4)(x + 3) = 0`: the roots are −3, 2 and 4, the graph’s `x`-intercepts." },
          { name:"Family", mod:"14", html:"Every `y = k(x - 2)(x - 4)(x + 3)` has the same zeros. `P` is the member with `k = 1`, through `(0, 24)`." },
          { name:"Inequality", mod:"15", html:"Sign chart: −, +, −, +. So `P(x) < 0` on `(-∞, -3) ∪ (2, 4)`, and `P(x) ≤ 0` on `(-∞, -3] ∪ [2, 4]`." }
        ] }
    ]
  },

  // ---------- Mixed practice: 12 items in a fixed, interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Twelve questions from every Chapter 2 module, mixed up on purpose, so you practise choosing the right tool. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Twelve questions from all five modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"12", goal:2, kind:"pair", star:true,
            prompt:"`x^3 + ax^2 + bx - 6` has factors `x - 1` and `x + 2`. Find `a` and `b`.",
            labels:["`a =`", "`b =`"], answer:[4, 1], display:"`a = 4`, `b = 1`",
            why:"Two equations: `P(1) = a + b - 5 = 0` and `P(-2) = 4a - 2b - 14 = 0`.",
            general:"Two equations: `P(1) = a + b - 5 = 0` and `P(-2) = 4a - 2b - 14 = 0`.",
            wrong:[{ match:[1, 4], fb:"Those are the right numbers in the wrong boxes. Which one multiplies `x^2`?" }],
            hints:["Use the factor theorem twice.", "`a + b = 5` and `2a - b = 7`.", "`a = 4`, `b = 1`."] },
          { id:"mp2", topic:"15", goal:5, kind:"iv",
            prompt:"Solve `(x - 4)(x + 1)(x - 6) > 0`.",
            answer:"(−1, 4) ∪ (6, ∞)", display:"`(-1, 4) ∪ (6, ∞)`",
            why:"The zeros are −1, 4 and 6, and the product is + on `(-1, 4)` and `(6, ∞)`.",
            wrong:{ "(−∞, −1) ∪ (4, 6)":"That’s where it’s negative. Test `x = 0`: `(-4)(1)(-6) = 24 > 0`." },
            hints:["Zeros −1, 4, 6.", "Test one value per interval.", "+ on `(-1, 4)` and `(6, ∞)`."] },
          { id:"mp3", topic:"11", goal:1, kind:"num",
            prompt:"Remainder of `3x^4 - 2x^2 + x - 1` divided by `x + 1`?",
            answer:-1, display:"−1",
            why:"`P(-1) = 3 - 2 - 1 - 1 = -1`.",
            wrong:[{ match:1, fb:"That’s `P(1)`. Use `P(-1) = 3 - 2 - 1 - 1`." }],
            hints:["Zero of `x + 1`?", "`P(-1)`.", "−1."] },
          { id:"mp4", topic:"14", goal:4, kind:"num", star:true,
            prompt:"A cubic has zeros −2, 1 and 5 and passes through `(2, 24)`. What is its `y`-intercept?",
            answer:-20, display:"−20",
            why:"`k(4)(1)(-3) = 24` gives `k = -2`; then `y(0) = -2(2)(-1)(-5) = -20`.",
            wrong:[{ match:-2, fb:"−2 is `k`. Now use it to find the `y`-intercept, `y(0)`." }],
            hints:["Find `k` first.", "`-12k = 24`.", "`k = -2`, `y(0) = -20`."] },
          { id:"mp5", topic:"13", goal:3, kind:"set",
            prompt:"Solve `x^3 + x^2 - 4x - 4 = 0`.",
            label:"Every root, separated by commas:",
            answer:[-2, -1, 2], display:"`x = -2, -1 or 2`",
            why:"Group: `x^2(x + 1) - 4(x + 1)`.",
            general:"Group: `x^2(x + 1) - 4(x + 1)`.",
            hints:["Group in pairs.", "`(x + 1)(x^2 - 4)`.", "−1, ±2."] },
          { id:"mp6", topic:"12", goal:2, kind:"mc",
            prompt:"Factor `x^3 + 64`.",
            options:[
              { t:"`(x + 4)(x^2 - 4x + 16)`", ok:true, why:"Sum of cubes with `a = x` and `b = 4`: `(a + b)(a^2 - ab + b^2)`." },
              { t:"`(x + 4)(x^2 + 4x + 16)`", why:"Middle sign opposite: −." },
              { t:"`(x + 4)^3`", why:"That expands to more than two terms." },
              { t:"`(x + 8)(x^2 - 8)`", why:"`64 = 4^3`, so `b = 4`, not 8." }],
            hints:["Sum of cubes.", "`a = x`, `b = 4`.", "`(x + 4)(x^2 - 4x + 16)`."] },
          { id:"mp7", topic:"15", goal:5, kind:"iv", v:"k", star:true,
            prompt:"For which `k` is `x^2 + kx + 9 > 0` for <strong>every</strong> real `x`?",
            answer:"(−6, 6)", display:"`(-6, 6)`, that is, `-6 < k < 6`",
            why:"Always positive means no real zeros: the discriminant `k^2 - 36 < 0`.",
            wrong:{ "[−6, 6]":"At `k = ±6` the quadratic is `(x ± 3)^2`, which is 0 at one point." },
            hints:["Always positive means no real zeros.", "Discriminant `k^2 - 36 < 0`.", "`-6 < k < 6`."] },
          { id:"mp8", topic:"11", goal:1, kind:"pair", star:true,
            prompt:"`P(x) = x^3 + ax + b` leaves remainder 4 when divided by `x - 1` and −2 when divided by `x + 1`. Find `a` and `b`.",
            labels:["`a =`", "`b =`"], answer:[2, 1], display:"`a = 2`, `b = 1`",
            why:"`1 + a + b = 4` and `-1 - a + b = -2`; add them: `2b = 2`.",
            general:"Write one equation for each remainder, then solve them together.",
            wrong:[{ match:[1, 2], fb:"Those are the right numbers in the wrong boxes. Which one multiplies `x`?" }],
            hints:["Two remainders, two equations.", "`a + b = 3`, `b - a = -1`.", "`b = 1`, `a = 2`."] },
          { id:"mp9", topic:"13", goal:3, kind:"set",
            prompt:"Real roots of `x^4 - 81 = 0`?",
            label:"Every real root, separated by commas:",
            answer:[-3, 3], display:"`x = ±3`",
            why:"`(x^2 - 9)(x^2 + 9)`: only ±3 are real.",
            complexFb:"`(x^2 - 9)(x^2 + 9)`: only ±3 are real.",
            wrong:[{ match:[-9, 9], fb:"`(x^2 - 9)(x^2 + 9)`: only ±3 are real." }],
            hints:["Difference of squares.", "`(x^2 - 9)(x^2 + 9)`.", "±3."] },
          { id:"mp10", topic:"14", goal:4, kind:"mc", fixedOrder:true,   // numeric k values, listed in increasing order
            prompt:"Which member of `y = k(x - 3)^2(x + 1)` passes through `(1, -8)`?",
            options:[
              { t:"`k = -8`", why:"−8 is the point’s `y`-value, not `k`. Substitute the point: `k` = (its `y`-value) ÷ (the bracket product there)." },
              { t:"`k = -1`", ok:true, why:"`k(4)(2) = -8`, so `k = -1`." },
              { t:"`k = -1/8`", why:"That divides the wrong way: `k` = (its `y`-value) ÷ (the bracket product there) = `-8 ÷ 8`." },
              { t:"`k = 1`", why:"Check the sign: `8k = -8`, so `k` is negative." }],
            hints:["Substitute `(1, -8)`.", "`k(4)(2) = -8`.", "`k = -1`."] },
          { id:"mp11", topic:"12", goal:2, kind:"mc",
            prompt:"Is `2x + 1` a factor of `2x^3 + 5x^2 + x - 2`?",
            options:[
              { t:"No: `P(-1/2) = -3/2`", ok:true, why:"`P(-1/2) = -1/4 + 5/4 - 1/2 - 2 = -3/2`: not a factor." },
              { t:"Yes, `P(1/2) = 0`", why:"`P(1/2) = 1/4 + 5/4 + 1/2 - 2 = 0`, but the zero of `2x + 1` is `-1/2`." },
              { t:"Yes, because 2 divides the leading coefficient", why:"The leading coefficient only limits the candidates. Test the zero of `2x + 1`." },
              { t:"No, because `P(1) ≠ 0`", why:"`P(1)` tests `x - 1`." }],
            hints:["Zero of `2x + 1`?", "`x = -1/2`.", "`P(-1/2) = -1/4 + 5/4 - 1/2 - 2 = -3/2`: not a factor."] },
          { id:"mp12", topic:"15", goal:5, kind:"iv", star:true,
            prompt:"Solve `x^3 ≥ 4x^2`.",
            answer:"{0} ∪ [4, ∞)", display:"`{x ∈ ℝ | x = 0 or x ≥ 4}`",
            why:"`x^2 ≥ 0` always, so you need `x - 4 ≥ 0`, or `x^2 = 0`: `x = 0` or `x ≥ 4`.",
            wrong:{ "[4, ∞)":"`x^3 - 4x^2 = x^2(x - 4)`. At `x = 0` it equals 0, which satisfies ≥." },
            hints:["Move everything to one side and factor.", "`x^2(x - 4) ≥ 0`.", "`x^2 ≥ 0` always, so you need `x - 4 ≥ 0`, or `x^2 = 0`: `x = 0` or `x ≥ 4`."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which Connect problem was hardest to sort, and what finally told you which tool it needed?" },
      { id:"j2", q:"In your own words, how are the remainder theorem and the factor theorem connected?" },
      { id:"j3", q:"Explain to a friend the full chain for solving a cubic inequality like `x^3 - 3x^2 - 10x + 24 ≤ 0`." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across the whole chapter, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"11", goal:1,
        a:{ prompt:"What is the remainder when `x^3 + 4x^2 - x - 7` is divided by `x + 3`?",
          options:[
            { t:"5", ok:true, why:"`P(-3) = -27 + 36 + 3 - 7 = 5`." },
            { t:"53", why:"That’s `P(3)`." },
            { t:"−7", why:"That’s `P(0)`." },
            { t:"0", why:"Only a factor leaves remainder 0." }] },
        b:{ prompt:"What is the remainder when `x^3 - 3x^2 + 2x + 4` is divided by `x - 4`?",
          options:[
            { t:"28", ok:true, why:"`P(4) = 64 - 48 + 8 + 4 = 28`." },
            { t:"−116", why:"That’s `P(-4)`." },
            { t:"4", why:"That’s `P(0)`." },
            { t:"0", why:"Only a factor leaves remainder 0." }] } },
      { id:"f2", cat:"K", topic:"12", goal:2,
        a:{ prompt:"By the rational zero theorem, which could be a zero of `4x^3 - x + 3`?",
          options:[
            { t:"`3/4`", ok:true, why:"`p = 3` divides 3; `q = 4` divides 4." },
            { t:"`4/3`", why:"Upside down: the denominator divides the leading coefficient." },
            { t:"4", why:"4 doesn’t divide the constant 3." },
            { t:"2", why:"2 doesn’t divide 3." }] },
        b:{ prompt:"By the rational zero theorem, which could be a zero of `6x^3 + x - 5`?",
          options:[
            { t:"`5/6`", ok:true, why:"`p = 5` divides 5; `q = 6` divides 6." },
            { t:"`6/5`", why:"Upside down." },
            { t:"6", why:"6 doesn’t divide 5." },
            { t:"3", why:"3 doesn’t divide 5." }] } },
      { id:"f3", cat:"K", topic:"14", goal:4,
        a:{ prompt:"Which function is <strong>not</strong> a member of the family `y = k(x - 1)(x + 4)`?",
          options:[
            { t:"`y = (x + 1)(x - 4)`", ok:true, why:"Its zeros are −1 and 4, not 1 and −4." },
            { t:"`y = 3x^2 + 9x - 12`", why:"That’s `3(x - 1)(x + 4)`: a member, just expanded." },
            { t:"`y = -(x - 1)(x + 4)`", why:"`k = -1`: a member." },
            { t:"`y = {1}/{2}x^2 + 1.5x - 2`", why:"That’s `{1}/{2}(x - 1)(x + 4)`: a member." }] },
        b:{ prompt:"Which function is <strong>not</strong> a member of the family `y = k(x + 2)(x - 3)`?",
          options:[
            { t:"`y = (x - 2)(x + 3)`", ok:true, why:"Its zeros are 2 and −3." },
            { t:"`y = 2x^2 - 2x - 12`", why:"That’s `2(x + 2)(x - 3)`." },
            { t:"`y = -(x + 2)(x - 3)`", why:"`k = -1`." },
            { t:"`y = {1}/{4}x^2 - {1}/{4}x - 1.5`", why:"That’s `{1}/{4}(x + 2)(x - 3)`." }] } },
      { id:"f4", cat:"K", topic:"15", goal:5,
        a:{ prompt:"Solve `x^2 - x - 12 < 0`.",
          options:[
            { t:"`(-3, 4)`", ok:true, why:"`(x - 4)(x + 3) < 0` between the zeros." },
            { t:"`[-3, 4]`", why:"< leaves the zeros out." },
            { t:"`(-∞, -3) ∪ (4, ∞)`", why:"That’s > 0." },
            { t:"`(-4, 3)`", why:"The zeros are 4 and −3." }] },
        b:{ prompt:"Solve `x^2 + 2x - 15 ≥ 0`.",
          options:[
            { t:"`(-∞, -5] ∪ [3, ∞)`", ok:true, why:"`(x + 5)(x - 3) ≥ 0` outside the zeros, including them." },
            { t:"`(-∞, -5) ∪ (3, ∞)`", why:"≥ includes the zeros." },
            { t:"`[-5, 3]`", why:"That’s ≤ 0." },
            { t:"`(-∞, -3] ∪ [5, ∞)`", why:"The zeros are −5 and 3." }] } },
      { id:"f5", cat:"T", topic:"11", goal:1,
        a:{ prompt:"When `x^3 + kx^2 - 3x + 1` is divided by `x - 2`, the remainder is 7. Find `k`.",
          options:[
            { t:"−3/4", why:"That sets the remainder to 0: `3 + 4k = 0`." },
            { t:"1", ok:true, why:"`P(2) = 8 + 4k - 6 + 1 = 3 + 4k = 7`." },
            { t:"7/4", why:"That drops `8 - 6 + 1`: `4k = 7`." },
            { t:"2", why:"That uses `P(-2) = 4k - 1 = 7`." }] },
        b:{ prompt:"When `2x^3 - x^2 + kx - 4` is divided by `x + 1`, the remainder is −3. Find `k`.",
          options:[
            { t:"−7", why:"That sets the remainder to 0." },
            { t:"−4", ok:true, why:"`P(-1) = -2 - 1 - k - 4 = -7 - k = -3`." },
            { t:"0", why:"That uses `P(1) = k - 3 = -3`." },
            { t:"3", why:"That drops the constants: `-k = -3`." }] } },
      { id:"f6", cat:"T", topic:"12", goal:2,
        a:{ prompt:"Fully factor `2x^3 - 5x^2 - x + 6`.",
          options:[
            { t:"`(x - 2)(2x - 3)(x + 1)`", ok:true, why:"`P(2) = 0`; the quotient `2x^2 - x - 3 = (2x - 3)(x + 1)`." },
            { t:"`(x - 2)(2x^2 - x - 3)`", why:"The quadratic factors." },
            { t:"`(x + 2)(2x + 3)(x - 1)`", why:"Signs flipped: `P(-2) ≠ 0`." },
            { t:"`(x - 2)(2x + 3)(x - 1)`", why:"`(2x + 3)(x - 1) = 2x^2 + x - 3`, not `2x^2 - x - 3`." }] },
        b:{ prompt:"Fully factor `3x^3 - 4x^2 - 5x + 2`.",
          options:[
            { t:"`(x - 2)(3x - 1)(x + 1)`", ok:true, why:"`P(2) = 0`; quotient `3x^2 + 2x - 1 = (3x - 1)(x + 1)`." },
            { t:"`(x - 2)(3x^2 + 2x - 1)`", why:"The quadratic factors." },
            { t:"`(x + 2)(3x + 1)(x - 1)`", why:"Signs flipped: `P(-2) ≠ 0`." },
            { t:"`(x - 2)(3x + 1)(x - 1)`", why:"`(3x + 1)(x - 1) = 3x^2 - 2x - 1`." }] } },
      { id:"f7", cat:"T", topic:"13", goal:3,
        a:{ prompt:"Solve `x^3 - 6x^2 = 16x`.",
          options:[
            { t:"`x = 0, 8 or -2`", ok:true, why:"`x(x - 8)(x + 2) = 0`." },
            { t:"`x = 8 or -2`", why:"Dividing by `x` loses 0." },
            { t:"`x = 0, -8 or 2`", why:"Signs flipped: `x - 8 = 0` gives 8, and `x + 2 = 0` gives −2." },
            { t:"`x = 8 or 2`", why:"`x + 2 = 0` gives −2." }] },
        b:{ prompt:"Solve `x^3 + 3x^2 = 10x`.",
          options:[
            { t:"`x = 0, -5 or 2`", ok:true, why:"`x(x + 5)(x - 2) = 0`." },
            { t:"`x = -5 or 2`", why:"Dividing by `x` loses 0." },
            { t:"`x = 0, 5 or -2`", why:"Signs flipped: `x + 5 = 0` gives −5, and `x - 2 = 0` gives 2." },
            { t:"`x = 5 or 2`", why:"`x + 5 = 0` gives −5." }] } },
      { id:"f8", cat:"T", topic:"15", goal:5,
        a:{ prompt:"Solve `x^3 - 4x ≥ 0`.",
          options:[
            { t:"`[-2, 0] ∪ [2, ∞)`", ok:true, why:"`x(x - 2)(x + 2)`: + on `(-2, 0)` and `(2, ∞)`; ≥ includes the zeros." },
            { t:"`(-2, 0) ∪ (2, ∞)`", why:"≥ includes the zeros." },
            { t:"`(-∞, -2] ∪ [0, 2]`", why:"That’s ≤ 0." },
            { t:"`[2, ∞)`", why:"Dividing by `x` lost the interval `[-2, 0]`." }] },
        b:{ prompt:"Solve `x^3 - 9x < 0`.",
          options:[
            { t:"`(-∞, -3) ∪ (0, 3)`", ok:true, why:"`x(x - 3)(x + 3)`: − on `(-∞, -3)` and `(0, 3)`." },
            { t:"`(-3, 0) ∪ (3, ∞)`", why:"That’s > 0." },
            { t:"`(-∞, -3] ∪ [0, 3]`", why:"< leaves the zeros out." },
            { t:"`(-3, 3)`", why:"Dividing by `x` (which can be negative) changes the inequality." }] } },
      { id:"f9", cat:"C", topic:"12", goal:2,
        a:{ prompt:"Which is the best reason why `x - 3` is a factor of `x^3 - 2x^2 - 2x - 3`?",
          options:[
            { t:"“`P(3) = 27 - 18 - 6 - 3 = 0`, so by the factor theorem `x - 3` is a factor.”", ok:true, why:"The factor theorem: `x - b` is a factor exactly when `P(b) = 0`." },
            { t:"“Because −3 is the constant term.”", why:"The constant term only limits the candidates." },
            { t:"“Because `P(-3) = 0`.”", why:"`P(-3) = -42`, and it would test `x + 3`." },
            { t:"“Because 3 divides every coefficient.”", why:"It doesn’t divide −2." }] },
        b:{ prompt:"Which is the best reason why `x + 2` is a factor of `x^3 + x^2 - x + 2`?",
          options:[
            { t:"“`P(-2) = -8 + 4 + 2 + 2 = 0`, so by the factor theorem `x + 2` is a factor.”", ok:true, why:"The factor theorem: `x - b` is a factor exactly when `P(b) = 0`, and `x + 2 = x - (-2)`." },
            { t:"“Because 2 is the constant term.”", why:"The constant term only limits the candidates." },
            { t:"“Because `P(2) = 0`.”", why:"`P(2) = 12`." },
            { t:"“Because the coefficients add to 0.”", why:"They add to 3; that test is for `x - 1`." }] } },
      { id:"f10", cat:"C", topic:"13", goal:3,
        a:{ prompt:"Which correctly describes the real roots of `x^4 - x^2 - 12 = 0`?",
          options:[
            { t:"“`(x^2 - 4)(x^2 + 3) = 0`; `x^2 = 4` gives ±2, and `x^2 = -3` gives no real roots.”", ok:true, why:"Treat it as a quadratic in `x^2`, then solve each factor. A square can’t be negative." },
            { t:"“The roots are ±2 and `±√3`.”", why:"`x^2 = -3` has no real solutions." },
            { t:"“The roots are 4 and −3.”", why:"Those are the values of `x^2`." },
            { t:"“The roots are ±2 and ±3.”", why:"Check: `3^4 - 9 - 12 = 60`." }] },
        b:{ prompt:"Which correctly describes the real roots of `x^4 + x^2 - 20 = 0`?",
          options:[
            { t:"“`(x^2 + 5)(x^2 - 4) = 0`; `x^2 = 4` gives ±2, and `x^2 = -5` gives no real roots.”", ok:true, why:"Treat it as a quadratic in `x^2`, then solve each factor. A square can’t be negative." },
            { t:"“The roots are ±2 and `±√5`.”", why:"`x^2 = -5` has no real solutions." },
            { t:"“The roots are 4 and −5.”", why:"Those are the values of `x^2`." },
            { t:"“The roots are ±2 and ±5.”", why:"Check: `5^4 + 25 - 20 = 630`." }] } },
      { id:"f11", cat:"C", topic:"15", goal:5,
        a:{ prompt:"Which is the solution of `(x - 1)^2(x + 2) ≤ 0`?",
          options:[
            { t:"`{x ∈ ℝ | x ≤ -2 or x = 1}`", ok:true, why:"Negative for `x < -2`; zero at −2 and at 1." },
            { t:"`(-∞, -2]`", why:"At `x = 1` the expression is 0, which satisfies ≤." },
            { t:"`(-∞, -2] ∪ [1, ∞)`", why:"For `x > 1` it’s positive." },
            { t:"`[-2, 1]`", why:"Between −2 and 1 it’s positive." }] },
        b:{ prompt:"Which is the solution of `(x + 3)^2(x - 1) ≥ 0`?",
          options:[
            { t:"`{x ∈ ℝ | x = -3 or x ≥ 1}`", ok:true, why:"Positive for `x > 1`; zero at −3 and at 1." },
            { t:"`[1, ∞)`", why:"At −3 it’s 0, which satisfies ≥." },
            { t:"`(-∞, -3] ∪ [1, ∞)`", why:"For `x < -3` it’s negative." },
            { t:"`[-3, 1]`", why:"Between −3 and 1 it’s negative." }] } },
      { id:"f12", cat:"A", topic:"13", goal:3,
        a:{ prompt:"A tank’s dimensions are `x`, `x + 2` and `x - 1` metres, and its volume is 30 m³. Find `x`.",
          options:[
            { t:"3 m", ok:true, why:"`x^3 + x^2 - 2x - 30 = (x - 3)(x^2 + 4x + 10) = 0`; the quadratic has no real roots." },
            { t:"5 m", why:"That’s `x + 2`." },
            { t:"2 m", why:"That’s `x - 1`." },
            { t:"3 m or −5 m", why:"The quadratic factor has no real roots, and a length can’t be negative." }] },
        b:{ prompt:"A tank’s dimensions are `x`, `x - 1` and `x + 3` metres, and its volume is 36 m³. Find `x`.",
          options:[
            { t:"3 m", ok:true, why:"`(x - 3)(x^2 + 5x + 12) = 0`." },
            { t:"2 m", why:"That’s `x - 1`." },
            { t:"6 m", why:"That’s `x + 3`." },
            { t:"3 m or −4 m", why:"No other real roots." }] } },
      { id:"f13", cat:"A", topic:"14", goal:4,
        a:{ prompt:"An arch is modelled by a member of `y = k(x + 10)(x - 10)`, in metres, with its top 25 m high at `x = 0`. How high is it at `x = 6`?",
          options:[
            { t:"16 m", ok:true, why:"`-100k = 25` gives `k = -{1}/{4}`; `-{1}/{4}(16)(-4) = 16`." },
            { t:"−16 m", why:"`k` is negative, and so is `(6 - 10)`, so the height is positive." },
            { t:"19 m", why:"That assumes the arch drops 1 m per metre." },
            { t:"9 m", why:"That subtracts `16 = 6 + 10` from 25." }] },
        b:{ prompt:"An arch is modelled by a member of `y = k(x + 8)(x - 8)`, in metres, with its top 32 m high at `x = 0`. How high is it at `x = 4`?",
          options:[
            { t:"24 m", ok:true, why:"`-64k = 32` gives `k = -{1}/{2}`; `-{1}/{2}(12)(-4) = 24`." },
            { t:"−24 m", why:"`k` is negative, and so is `(4 - 8)`, so the height is positive." },
            { t:"28 m", why:"That assumes it drops 1 m per metre." },
            { t:"20 m", why:"That subtracts `12 = 4 + 8`." }] } },
      { id:"f14", cat:"A", topic:"11", goal:1,
        a:{ prompt:"A company’s cost is `C(x) = x^3 - 6x^2 + 15x + 20` thousand dollars for `x` hundred units. Without dividing, what is the remainder when `C(x)` is divided by `x - 4`, and what does it mean?",
          options:[
            { t:"48: it’s `C(4)`, the cost of 400 units, $48 000", ok:true, why:"64 − 96 + 60 + 20 = 48." },
            { t:"−200: it’s `C(-4)`", why:"The divisor `x - 4` is zero at `x = 4`: use `C(4)`, not `C(-4)`." },
            { t:"0: `x - 4` is a factor", why:"`C(4) ≠ 0`." },
            { t:"20: the fixed cost", why:"That’s `C(0)`." }] },
        b:{ prompt:"`C(x) = 2x^3 - 3x^2 + x + 10` thousand dollars for `x` hundred units. What is the remainder when `C(x)` is divided by `x - 3`, and what does it mean?",
          options:[
            { t:"40: it’s `C(3)`, the cost of 300 units, $40 000", ok:true, why:"54 − 27 + 3 + 10 = 40." },
            { t:"−74: it’s `C(-3)`", why:"The divisor `x - 3` is zero at `x = 3`: use `C(3)`, not `C(-3)`." },
            { t:"0: `x - 3` is a factor", why:"`C(3) ≠ 0`." },
            { t:"10: the fixed cost", why:"That’s `C(0)`." }] } },
      { id:"f15", cat:"A", topic:"15", goal:5,
        a:{ prompt:"A ball’s height is `h(t) = -5t^2 + 40t - 35` metres. When is it more than 40 m high?",
          options:[
            { t:"`(3, 5)`", ok:true, why:"`-5t^2 + 40t - 75 > 0` gives `t^2 - 8t + 15 < 0`, so `(t - 3)(t - 5) < 0`." },
            { t:"`(1, 7)`", why:"That’s when it’s above 0 m." },
            { t:"`[3, 5]`", why:"At exactly 3 s and 5 s it’s 40 m, not more." },
            { t:"`(-∞, 3) ∪ (5, ∞)`", why:"Dividing by −5 flips the inequality." }] },
        b:{ prompt:"A ball’s height is `h(t) = -5t^2 + 50t - 80` metres. When is it more than 40 m high?",
          options:[
            { t:"`(4, 6)`", ok:true, why:"`t^2 - 10t + 24 < 0`: `(t - 4)(t - 6) < 0`." },
            { t:"`(2, 8)`", why:"That’s when it’s above 0 m." },
            { t:"`[4, 6]`", why:"At exactly 4 s and 6 s it’s 40 m, not more." },
            { t:"`(-∞, 4) ∪ (6, ∞)`", why:"Dividing by −5 flips the inequality." }] } }
    ]
  },

  task:{
    title:"One polynomial, five conditions", summary:"One polynomial, five conditions",
    statement:"<p>Use the zero builder (module 05) to design a polynomial that passes every check. Each check comes from a different Chapter 2 module. There’s more than one answer.</p>" +
      "<ol class=\"pt-conds\"><li>`x + 1` and `x - 2` are factors. (module 12)</li><li>Degree 4, with exactly three different real roots. (module 13)</li>" +
      "<li>It’s a member of the family `k(x + 1)(x - 2)(x - r)^2` for some `r`. (module 14)</li><li>`P(x) < 0` exactly when `-1 < x < 2`. (module 15)</li>" +
      "<li>The remainder when `P(x)` is divided by `x` is −8. (module 11)</li></ol>",
    how:"Set up to four zeros (whole numbers from −6 to 6) and the order of each, then set `@a{k}` with the slider.",
    checks:["`x + 1` and `x - 2` are factors", "Degree 4, three different roots", "Family `k(x + 1)(x - 2)(x - r)^2`", "Negative exactly on `(-1, 2)`", "Remainder −8 when divided by `x`"],
    tips:["Make −1 and 2 two of your zeros: `x + 1` is a factor exactly when −1 is a zero, and `x - 2` exactly when 2 is.",
      "Add the orders: they must total 4, with exactly three different zeros. Right now the degree is {deg} with {n} different zeros.",
      "Give −1 and 2 order 1, and give one more zero, `r`, order 2.",
      "A double root inside `(-1, 2)` makes `P = 0` there, so `P` isn’t negative on all of `(-1, 2)`. Put `r` outside.",
      "`P(0) = k(1)(-2)(r^2) = -2kr^2`. You need `kr^2 = 4`."],
    tipNow4:"Right now `P(x) < 0` on {neg}.",
    tipNow5:"Right now `P(0) = ` {p0}.",
    explainPrompt:"Explain which module each check came from, and why `r` had to be outside `[-1, 2]`.",
    success:"Your design passes all five checks.",
    more:"There’s more than one answer. Can you find another?",
    after3:"That’s all three. With whole-number zeros from −6 to 6 and `k` in steps of 0.25, only `r = -2`, `r = 4` and `r = -4` work."
  },

  cards:[
    ["Division statement", "`P(x)` = (divisor)(quotient) + remainder."],
    ["Remainder theorem", "`P(x) ÷ (x - b)` leaves `P(b)`; `÷ (ax - b)` leaves `P(b/a)`."],
    ["Factor theorem", "`x - b` is a factor ⟺ `P(b) = 0`."],
    ["Rational zero theorem", "A rational zero `p/q`: `p` divides the constant term, `q` divides the leading coefficient."],
    ["Cube patterns", "`a^3 ± b^3 = (a ± b)(a^2 ∓ ab + b^2)`."],
    ["Grouping", "`x^2(x + 2) - 16(x + 2) = (x + 2)(x - 4)(x + 4)`."],
    ["Solving", "0 on one side, factor, set each factor to 0. Never divide by `x`."],
    ["Quadratic form", "`x^4 - 10x^2 + 9 = 0`: `u = x^2`; `x = ±1, ±3`."],
    ["Family of polynomials", "`y = k(x - r_1)(x - r_2)…`: same zeros, any `k ≠ 0`; one more point fixes `k`."],
    ["Sign chart", "Mark the zeros, test one value per interval, read the sign."],
    ["Squared factors in inequalities", "Never change the sign; make the expression 0 (include for ≤, ≥)."],
    ["Which tool?", "Remainder → evaluate. Factor? → test and divide. Pattern? → group or cubes. Zeros + point → family. Inequality → sign chart."]
  ]
};
