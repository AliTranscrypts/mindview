// MHF4U 50 Chapter 8 Summary & Review: the plan's content as data (plan modules/50-chapter-8-review.md).
// Review module: Start (goals + diagnostic), Connect (Combination detective), Mixed practice, Reflect, Final Check.

// M-table core sentences (plan section 3), used where the plan tags an option with the misconception.
const M1 = "`f(g(x))` puts `g`’s output into `f`: do `g` first. Order matters.";
const M2 = "Dividing by `g(x)` is impossible where `g(x) = 0`.";
const M3 = "`x` must be in `g`’s domain, and `g(x)` must be in `f`’s domain.";
const M4 = "Test `h(-x)`: odd × odd = even, odd + even is usually neither.";
const M5 = "`f(g(2))` = `f`(evaluate `g(2)` first), not `f(2) + g(2)`.";
const M6 = "The envelope multiplies every swing, so the swings shrink with it.";
const M7 = "`2^x = x^2` mixes an exponential and a polynomial: use graphs and count intersections.";
const M8 = "Constant ratios: exponential. Constant differences: linear. Repeating: sinusoidal.";

export default {
  id:"50-chapter-8-review",
  kind:"review",
  title:"Chapter 8 summary and review",
  topic:"Chapter 8 Summary & Review",
  hero:{
    eq:"`f = x^2`, `g = x + 1` → `f + g`, `f · g`, `f/g`, `f(g(x))`, `g(f(x))`",
    eqLabel:"f equals x squared and g equals x plus 1, combined five ways: f plus g, f times g, f over g, f of g of x, and g of f of x", eqSize:"sm",
    headline:"Five ways to combine two functions",
    text:"Add them, subtract them, multiply them, divide them, or feed one into the other. Each combination leaves a fingerprint on the graph and the domain. This review is about recognizing those fingerprints and using them to model.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ shape:"square",
      aria:"Graph of f(x) = x² in blue and g(x) = x + 1 in teal. Value bars stack the two heights into f + g = x² + x + 1. The product x²(x + 1) has zeros at −1 and 0, and the quotient x²/(x + 1) has a vertical asymptote x = −1. A pipeline sends 2 through g to get 3, then through f to get 9, so f(g(2)) = 9; in the other order, 2 goes through f to 4, then g to 5. The last frame shows a set of data points with a fitted model y = x² + x + 1 drawn through them.",
      steps:[
        { cap:"`f(x) = x^2` and `g(x) = x + 1`" },
        { cap:"Stack the heights: `f + g = x^2 + x + 1` · module 46" },
        { cap:"Multiply: `f · g = x^2(x + 1)`, zeros −1 and 0 · module 47" },
        { cap:"Divide: `f/g = x^2/(x + 1)`, asymptote `x = -1` · module 47" },
        { cap:"Compose: `f(g(2)) = f(3) = 9`, but `g(f(2)) = g(4) = 5` · module 48" },
        { cap:"Model: fit a combined function to data · module 49" }],
      ui:{ f:"y = x^2", g:"y = x + 1", sum:"f + g", prod:"f · g", quot:"f/g", va:"x = −1", zeros:"zeros", model:"model", data:"data",
        fg:"f(g(2))", gf:"g(f(2))" } }
  },
  goals:[
    "I can find, graph and describe sums and differences of functions, including their domains.",
    "I can find and describe products and quotients of functions, including domains, signs and damped motion.",
    "I can evaluate compositions from equations, tables and graphs, in both orders.",
    "I can find `f(g(x))` algebraically with its domain, decompose a function, and use `f(f^{-1}(x)) = x`.",
    "I can choose and combine function types to model a situation and solve problems graphically.",
    "I can tell which operation built a combined function from its equation, table or graph."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "46":{ idea:"Add heights point by point; the domain is the overlap; waves add (superposition).",
      look:"Stacking bars (Explore); Superposition: adding sound waves (Superposition)" },
    "47":{ idea:"Products: zeros of either factor; envelopes damp waves. Quotients: zeros of `g` become asymptotes or holes.",
      look:"Envelope explorer (Explore); Sign and shape (Signs)" },
    "48":{ idea:"`f(g(x))`: `g` first; order matters; domain from both; decompose into inside and outside.",
      look:"The two-machine pipeline (Explore); Inside and outside: decompose it (Decompose)" },
    "49":{ idea:"Match behaviour to a type, combine, fit, and solve with graphs when algebra can’t.",
      look:"Model lab (Explore); Solve it with graphs (Solve with graphs)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Eight questions from the four modules in Chapter 8. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"46", goal:1,
          prompt:"`f(x) = x^2` and `g(x) = 2x - 1`. Find `(f + g)(3)`.",
          options:[
            { t:"14", ok:true, why:"9 + 5." },
            { t:"45", why:"That’s `(f · g)(3) = 9 × 5`." },
            { t:"25", why:"That’s `f(g(3)) = 5^2`. " + M5 },
            { t:"4", why:"That’s `(f - g)(3)`." }],
          hints:["Find `f(3)` and `g(3)`.", "9 and 5.", "Add: 14."] },
        { id:"d2", topic:"46", goal:1,
          prompt:"`f(x) = √x` and `g(x) = 1/(x - 2)`. What is the domain of `f + g`?",
          options:[
            { t:"`{x ∈ ℝ | x >= 0, x != 2}`", ok:true, why:"Both must exist: `x >= 0` for `f`, `x != 2` for `g`." },
            { t:"`{x ∈ ℝ | x >= 0}`", why:"`g(2)` is undefined." },
            { t:"`{x ∈ ℝ | x != 2}`", why:"`√x` needs `x >= 0`." },
            { t:"`{x ∈ ℝ | x > 2}`", why:"Values from 0 to 2 work too." }],
          hints:["Find each domain.", "`x >= 0` and `x != 2`.", "The overlap."] },
        { id:"d3", topic:"47", goal:2,
          prompt:"`f(x) = x - 3` and `g(x) = x^2 - 9`. What is the domain of `f/g`?",
          options:[
            { t:"`{x ∈ ℝ | x != -3, 3}`", ok:true, why:"`g(x) = 0` at ±3." },
            { t:"`{x ∈ ℝ | x != 3}`", why:"`g(-3) = 0` too. " + M2 },
            { t:"`{x ∈ ℝ}`", why:M2 },
            { t:"`{x ∈ ℝ | x != -3}`", why:"`x = 3` is still excluded: it makes `g = 0`, even though the simplified form `1/(x + 3)` hides it." }],
          hints:["Where is `g(x) = 0`?", "`x^2 - 9 = 0`.", "`x != ±3`."] },
        { id:"d4", topic:"47", goal:2,
          prompt:"What happens to `y = 2^{-x} sin x` as `x` grows large?",
          options:[
            { t:"It keeps oscillating, but its swings shrink toward 0", ok:true, why:"The envelope `2^{-x} → 0` multiplies every swing." },
            { t:"It oscillates between −1 and 1 forever", why:M6 },
            { t:"It grows without bound", why:M6 },
            { t:"It levels off at 1", why:"`sin x` keeps changing sign." }],
          hints:["What does `2^{-x}` do?", "`2^{-x} → 0`.", "Damped: swings shrink."] },
        { id:"d5", topic:"48", goal:3,
          prompt:"`f(x) = 2x + 1` and `g(x) = x^2`. Find `f(g(3))`.",
          options:[
            { t:"19", ok:true, why:"`g(3) = 9`; `f(9) = 19`." },
            { t:"49", why:"That’s `g(f(3)) = 7^2`. " + M1 },
            { t:"63", why:"That’s `f(3) × g(3)`. " + M5 },
            { t:"16", why:"That’s `f(3) + g(3)`. " + M5 }],
          hints:["Inside first.", "`g(3) = 9`.", "`f(9) = 19`."] },
        { id:"d6", topic:"48", goal:4,
          prompt:"`f(x) = √x` and `g(x) = x - 4`. What is the domain of `f(g(x))`?",
          options:[
            { t:"`{x ∈ ℝ | x >= 4}`", ok:true, why:"`√{x - 4}` needs `x - 4 >= 0`." },
            { t:"`{x ∈ ℝ | x >= 0}`", why:"That’s `f`’s domain, not the composition’s. " + M3 },
            { t:"`{x ∈ ℝ}`", why:"That’s `g`’s domain." },
            { t:"`{x ∈ ℝ | x >= -4}`", why:"Sign slip." }],
          hints:["`g(x)` must be in `f`’s domain.", "`x - 4 >= 0`.", "`x >= 4`."] },
        { id:"d7", topic:"48", goal:4,
          prompt:"`f(x) = 3x - 6`. What is `f(f^{-1}(10))`?",
          options:[
            { t:"10", ok:true, why:"A function undoes its inverse." },
            { t:"24", why:"That’s `f(10)`." },
            { t:"16/3", why:"That’s `f^{-1}(10)`." },
            { t:"30", why:"`f(f^{-1}(x)) = x`." }],
          hints:["What does `f^{-1}` do?", "`f` undoes it.", "10."] },
        { id:"d8", topic:"49", goal:5,
          prompt:"A town’s population grows by 3% each year. Which kind of function models it best?",
          options:[
            { t:"Exponential", ok:true, why:"Growth by a constant percentage is a constant ratio." },
            { t:"Linear", why:"Linear growth adds the same amount each year. " + M8 },
            { t:"Quadratic", why:M8 },
            { t:"Sinusoidal", why:"Nothing repeats. " + M8 }],
          hints:["Constant percentage growth means…", "Multiply by 1.03 each year.", "Exponential."] }
      ]
    }
  },

  // ---------- Connect: Combination detective (case cards + operation chips, rendered by app.connect) ----------
  connect:{
    heading:"Combination detective",
    intro:"Every module in Chapter 8 built a combination forward. The detective works backward: given a combined function, which operation made it? Look for each operation’s fingerprint in an equation, a table or a graph.",
    summary:"Combination detective",
    suspects:"<strong>The suspects:</strong> `f(x) = x^2` and `g(x) = x + 1`. For each case, choose the operation that built `h`.",
    how:"Tap the operation that built `h`.",
    ui:{ suspects:"The suspects", ask:"Which operation built `h`?", askPair:"Which pair and which order? Tap one.", prev:"Previous case", next:"Next case", caseOf:"Case §1 of §2",
      faces:{ eq:"Equation", graph:"Graph", table:"Table" }, stretch:"Stretch",
      eqFb:"That’s §1, not `h`.", tblFb:"§1 gives §2 at `x` = 0, 1, 2, not 1, 2, 5.",
      tblHead:["`x`", "0", "1", "2"], tblRow:["`h(x)`", "1", "2", "5"],
      graphAria:"Graph of h: a vertical asymptote at x = −1. To the right of it, the graph comes down from very high values, touches the x-axis at the origin and rises again. To the left of it, the graph stays below the x-axis, with a highest point at (−2, −4), and falls toward the asymptote.",
      waitOne:"§1 of §2 cases solved. “The chapter on one page” appears when all §2 are solved." },
    ops:[
      { id:"sum", t:"`f + g`", is:"`f + g = x^2 + x + 1`", tbl:"1, 3, 7", gr:"`f + g = x^2 + x + 1` is a parabola: it has no asymptote." },
      { id:"dif", t:"`f - g`", is:"`f - g = x^2 - x - 1`", tbl:"−1, −1, 1", gr:"`f - g = x^2 - x - 1` is a parabola: it has no asymptote." },
      { id:"prod", t:"`f · g`", is:"`f · g = x^2(x + 1) = x^3 + x^2`", tbl:"0, 2, 12", gr:"`f · g = x^3 + x^2` is a cubic: it has no asymptote." },
      { id:"quot", t:"`f/g`", is:"`f/g = {x^2}/{x + 1}`", tbl:"0, 1/2, 4/3", gr:"`f/g` has an asymptote where `g = 0`." },
      { id:"fg", t:"`f(g(x))`", is:"`f(g(x)) = (x + 1)^2`", tbl:"1, 4, 9", gr:"`f(g(x)) = (x + 1)^2` is a parabola that touches the `x`-axis at −1: no asymptote." },
      { id:"gf", t:"`g(f(x))`", is:"`g(f(x)) = x^2 + 1`", tbl:"1, 2, 5", gr:"`g(f(x)) = x^2 + 1` is a parabola with no zeros and no asymptote." }
    ],
    cases:[
      { id:"CD1", topic:"46", goal:[6, 1], face:"eq", h:"`h(x) = x^2 + x + 1`", answer:"sum",
        why:"`f + g = x^2 + (x + 1) = x^2 + x + 1`: the heights add.",
        fb:{ gf:"That’s `x^2 + 1`, with no `x` term." } },
      { id:"CD2", topic:"48", goal:[6, 3], face:"eq", h:"`h(x) = (x + 1)^2`", answer:"fg",
        why:"`f(g(x)) = f(x + 1) = (x + 1)^2`: add 1 first, then square.",
        fb:{ gf:"That adds 1 <strong>after</strong> squaring. " + M1 } },
      { id:"CD3", topic:"48", goal:[6, 3], face:"eq", h:"`h(x) = x^2 + 1`", answer:"gf",
        why:"`g(f(x)) = g(x^2) = x^2 + 1`: square first, then add 1.",
        fb:{ fg:"That squares `x + 1`. " + M1 } },
      { id:"CD4", topic:"47", goal:[6, 2], face:"eq", h:"`h(x) = x^3 + x^2`", answer:"prod",
        why:"`f · g = x^2(x + 1) = x^3 + x^2`: its zeros, 0 and −1, come from the two factors.",
        tip:"Expand `x^2(x + 1)`.", fb:{} },
      { id:"CD5", topic:"46", goal:[6, 1], face:"eq", h:"`h(x) = x^2 - x - 1`", answer:"dif",
        why:"`f - g = x^2 - (x + 1) = x^2 - x - 1`: subtract every term of `g`.",
        tip:"`x^2 - (x + 1)`.", fb:{} },
      { id:"CD6", topic:"47", goal:[6, 2], face:"graph", h:"A graph with a vertical asymptote at `x = -1` and a zero that touches at 0", answer:"quot",
        why:"`f/g = {x^2}/{x + 1}`: the zero of `g` at −1 becomes the asymptote, and the double zero of `f` at 0 makes the graph touch.",
        fb:{ prod:"A product has no asymptotes; the asymptote is where `g = 0`." } },
      { id:"CD7", topic:"48", goal:[6, 3], face:"table", stretch:true, h:"A table: `x` = 0, 1, 2 → `h` = 1, 2, 5", answer:"gf",
        why:"`g(f(x)) = x^2 + 1` gives 1, 2, 5 at `x` = 0, 1, 2.",
        fb:{ sum:"At `x = 1` that gives 3, not 2." } },
      { id:"CD8", topic:"48", goal:[6, 4], face:"eq", stretch:true, h:"`h(x) = 2^{sin x}`",
        ask:"Which pair of functions and which order build it?",
        options:[
          { t:"Outside `u = 2^x`, inside `v = sin x`: `u(v(x))`", ok:true, why:"`sin x` is computed first and becomes the exponent: `u(v(x)) = 2^{sin x}`." },
          { t:"Outside `u = sin x`, inside `v = 2^x`: `u(v(x))`", why:"`sin(2^x)` puts `2^x` inside." },
          { t:"`u = 2^x` and `v = sin x`, multiplied: `u · v`", why:"That’s `2^x sin x`: the sine multiplies instead of sitting in the exponent." },
          { t:"`u = 2^x` and `v = sin x`, added: `u + v`", why:"That’s `2^x + sin x`: the heights add instead of the sine sitting in the exponent." }] }
    ],
    onePage:{
      title:"The chapter on one page",
      intro:"Each operation leaves its own fingerprint and has its own domain rule. The last column shows what each one builds from the suspects `f(x) = x^2` and `g(x) = x + 1`.",
      head:["Operation", "Fingerprint", "Domain", "From `f = x^2`, `g = x + 1`"],
      rows:[
        { op:"`(f + g)(x) = f(x) + g(x)`", fp:"Heights add point by point.", dom:"The overlap of the two domains.", ex:"`x^2 + x + 1`", mods:"46" },
        { op:"`(f - g)(x) = f(x) - g(x)`", fp:"Heights subtract point by point.", dom:"The overlap of the two domains.", ex:"`x^2 - x - 1`", mods:"46" },
        { op:"`(f · g)(x) = f(x) · g(x)`", fp:"Zeros multiply: a zero of either factor is a zero of the product. An envelope damps a wave.", dom:"The overlap of the two domains.", ex:"`x^3 + x^2`", mods:"47" },
        { op:"`(f/g)(x) = f(x) ÷ g(x)`", fp:"Asymptotes from `g`’s zeros (or holes, if a factor cancels).", dom:"The overlap, minus the zeros of `g`.", ex:"`{x^2}/{x + 1}`", mods:"47" },
        { op:"`f(g(x))`", fp:"`g`’s output goes into `f`: order matters.", dom:"Inputs of `g` whose outputs `f` accepts.", ex:"`(x + 1)^2`, but `g(f(x)) = x^2 + 1`", mods:"48" }] }
  },

  // ---------- Mixed practice: 12 items in a fixed, interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Twelve questions from every module in Chapter 8, mixed up on purpose, so you practise choosing the right idea. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Twelve questions from all four modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"48", goal:4, kind:"mc", star:true,
            prompt:"`f(x) = x^2 - 1` and `g(x) = 1/x`. What are the domain and range of `f(g(x))`?",
            options:[
              { t:"Domain `{x ∈ ℝ | x != 0}`; range `{y ∈ ℝ | y > -1}`", ok:true, why:"`f(g(x)) = 1/x^2 - 1`. `g` needs `x != 0`, and `1/x^2` takes every positive value but never 0, so `y > -1`." },
              { t:"Domain `{x ∈ ℝ}`; range `{y ∈ ℝ | y > -1}`", why:"`g(0) = 1/0` is undefined. " + M3 },
              { t:"Domain `{x ∈ ℝ | x != 0}`; range `{y ∈ ℝ | y >= -1}`", why:"`1/x^2` is never 0, so −1 is never reached." },
              { t:"Domain `{x ∈ ℝ | x != 0}`; range `{y ∈ ℝ | y > 0}`", why:"Values between −1 and 0 are reached too: at `x = 2`, `1/4 - 1 = -3/4`." }],
            hints:["Write `f(g(x))` first. Which `x` can go into `g`?", "`f(g(x)) = (1/x)^2 - 1 = 1/x^2 - 1`, and `g` needs `x != 0`.", "Domain `x != 0`. `1/x^2` takes every positive value but never 0, so `1/x^2 - 1 > -1`: the range is `{y ∈ ℝ | y > -1}`."] },
          { id:"mp2", topic:"46", goal:1, kind:"mc", fixedOrder:true,   // an answer scale: even, odd, neither
            prompt:"`f(x) = x` and `g(x) = x^3`. Is `f + g` even, odd or neither?",
            options:[
              { t:"Even", why:"`h(-x) = -x - x^3 = -h(x)`." },
              { t:"Odd", ok:true, why:"`h(-x) = -x - x^3 = -h(x)`: odd + odd is odd." },
              { t:"Neither", why:"Check: `h(-x) = -x - x^3`, which is exactly `-h(x)`." }],
            hints:["Find `h(-x)` for `h(x) = x + x^3`.", "`h(-x) = -x + (-x)^3 = -x - x^3`.", "`-x - x^3 = -(x + x^3) = -h(x)`, so `f + g` is odd."] },
          { id:"mp3", topic:"49", goal:5, kind:"mc",
            prompt:"Data: `x` = 0, 1, 2, 3 → `y` = 2, 6, 18, 54. Which model fits best?",
            options:[
              { t:"`y = 2 · 3^x`", ok:true, why:"Each `y` is 3 times the one before: a constant ratio, so exponential. `2 · 3^3 = 54`." },
              { t:"`y = 4x + 2`", why:"The differences aren’t constant: 4, 12, 36. " + M8 },
              { t:"`y = 2x^2 + 2`", why:"`y(3) = 20`." },
              { t:"`y = 2 sin x + 2`", why:"Nothing repeats: the values keep tripling." }],
            hints:["Look at the differences, then the ratios.", "Differences: 4, 12, 36. Ratios: 6 ÷ 2 = 3, 18 ÷ 6 = 3, 54 ÷ 18 = 3.", "A constant ratio of 3, starting at 2: `y = 2 · 3^x`."] },
          { id:"mp4", topic:"47", goal:2, kind:"mc", fixedOrder:true,   // an answer scale: even, odd, neither
            prompt:"Is `y = x sin x` even, odd or neither?",
            options:[
              { t:"Even", ok:true, why:"`(-x) sin(-x) = (-x)(-sin x) = x sin x`: odd × odd = even." },
              { t:"Odd", why:"`x` and `sin x` are both odd: odd × odd = even." },
              { t:"Neither", why:"Test it: `h(-x) = (-x) sin(-x) = x sin x = h(x)`." }],
            hints:["Is each factor even or odd?", "`x` is odd and `sin x` is odd.", "odd × odd = even: `h(-x) = (-x)(-sin x) = x sin x = h(x)`."] },
          { id:"mp5", topic:"48", goal:4, kind:"mc",
            prompt:"Write `h(x) = (3x - 1)^5` as `f(g(x))`.",
            options:[
              { t:"`f(x) = x^5`, `g(x) = 3x - 1`", ok:true, why:"The inside, `3x - 1`, goes into the outside, `x^5`." },
              { t:"`f(x) = 3x - 1`, `g(x) = x^5`", why:"That gives `3x^5 - 1`." },
              { t:"`f(x) = x^5`, `g(x) = 3x`", why:"That gives `(3x)^5`: the −1 is missing." },
              { t:"`f(x) = x^5 - 1`, `g(x) = 3x`", why:"That gives `(3x)^5 - 1`." }],
            hints:["What’s done to `x` first? That’s the inside, `g`.", "Inside: `3x - 1`. Then the result is raised to the 5th power.", "`g(x) = 3x - 1` and `f(x) = x^5`."] },
          { id:"mp6", topic:"46", goal:1, kind:"mc",
            prompt:"What is `y = sin x + sin(x + π)`?",
            options:[
              { t:"0 for every `x`", ok:true, why:"`sin(x + π) = -sin x`, so the two waves cancel at every `x`." },
              { t:"`2 sin x`", why:"That needs the waves in step, but `sin(x + π) = -sin x`." },
              { t:"`sin(2x + π)`", why:"Adding waves adds heights, not arguments." },
              { t:"`2 sin(x + π/2)`", why:"The waves are half a period apart, so they cancel: no wave is left." }],
            hints:["How does `sin(x + π)` compare with `sin x`?", "`sin(x + π) = -sin x`: the same wave, flipped.", "`sin x + (-sin x) = 0` for every `x`."] },
          { id:"mp7", topic:"49", goal:5, kind:"num", star:true,
            prompt:"Revenue is `R(p) = p(400 - 20p)` dollars at price `p`. Which price maximizes revenue?",
            label:"Price `p` =", unit:"dollars", answer:10, display:"$10", keypad:"decimal",
            why:"The zeros are 0 and 20, and the parabola opens down, so the maximum is halfway between them: `p = 10`, where `R(10) = 10 × 200 = 2000` dollars.",
            wrong:[{ match:20, fb:"That’s where revenue is 0; the maximum is halfway between the zeros 0 and 20." }],
            hints:["Find the zeros of `R(p)`.", "`p = 0`, and `400 - 20p = 0` gives `p = 20`.", "The maximum is halfway between 0 and 20: `p = 10`."] },
          { id:"mp8", topic:"47", goal:2, kind:"mc", star:true,
            prompt:"`f(x) = x^2 - 4` and `g(x) = x - 2`. Describe `f/g`.",
            options:[
              { t:"`y = x + 2`, with a hole at (2, 4)", ok:true, why:"`{x^2 - 4}/{x - 2} = {(x - 2)(x + 2)}/{x - 2} = x + 2` for `x != 2`, so there’s a hole at (2, 4)." },
              { t:"`y = x + 2` for all `x`", why:"`x = 2` is still excluded. " + M2 },
              { t:"A vertical asymptote `x = 2`", why:"The factor cancels, so it’s a hole, not an asymptote." },
              { t:"`y = x - 2`", why:"Factor: `x^2 - 4 = (x - 2)(x + 2)`, so the quotient is `x + 2`." }],
            hints:["Factor `x^2 - 4`.", "`{(x - 2)(x + 2)}/{x - 2}`: the factor `x - 2` cancels, but `x = 2` is still excluded.", "`y = x + 2` for `x != 2`: a hole at (2, 4)."] },
          { id:"mp9", topic:"48", goal:4, kind:"mc", star:true,
            prompt:"`f(x) = 2x + 3` and `f(g(x)) = 6x - 1`. What is `g(x)`?",
            options:[
              { t:"`3x - 2`", ok:true, why:"`2g(x) + 3 = 6x - 1`, so `g(x) = 3x - 2`." },
              { t:"`3x - 1/2`", why:"Check: `2(3x - 1/2) + 3 = 6x + 2`. Subtract 3 before you divide by 2." },
              { t:"`6x - 4`", why:"Check: `2(6x - 4) + 3 = 12x - 5`. Divide by 2 as well." },
              { t:"`3x + 2`", why:"Check: `2(3x + 2) + 3 = 6x + 7`. Sign slip: `-1 - 3 = -4`." }],
            hints:["`f(g(x)) = 2g(x) + 3`.", "`2g(x) + 3 = 6x - 1`, so `2g(x) = 6x - 4`.", "`g(x) = 3x - 2`."] },
          { id:"mp10", topic:"46", goal:1, kind:"num",
            prompt:"From the graphs, `f(2) = 3` and `g(2) = -5`. Find `(f - g)(2)`.",
            fig:"<canvas class=\"plot mx-fig\" data-fig=\"mp10\" role=\"img\" aria-label=\"Graphs of f in blue and g in teal. At x = 2, the graph of f is at (2, 3) and the graph of g is at (2, −5).\"></canvas>",
            label:"`(f - g)(2) =`", answer:8, display:"`(f - g)(2) = 8`", keypad:"text",
            why:"`(f - g)(2) = f(2) - g(2) = 3 - (-5) = 8`.",
            wrong:[{ match:-2, fb:"That adds −5 instead of subtracting it: `3 - (-5) = 3 + 5`." }],
            hints:["`(f - g)(2) = f(2) - g(2)`.", "`3 - (-5)`.", "`3 + 5 = 8`."] },
          { id:"mp11", topic:"49", goal:5, kind:"num", star:true,
            prompt:"How many real solutions does `2^x = x^2` have?",
            label:"Number of solutions:", answer:3, display:"3 (`x = 2`, `x = 4` and one between −1 and 0)", keypad:"decimal",
            why:"`x = 2` and `x = 4` both work, and there’s one more between −1 and 0, where `2^x` falls toward 0 while `x^2` grows.",
            wrong:[{ match:2, fb:"Look left of 0: `2^x` is small and `x^2` grows, so they cross once more. " + M7 }],
            hints:["Graph `y = 2^x` and `y = x^2` and count the crossings. Look at negative `x` too.", "Check `x = 2` and `x = 4`. Then compare the two sides at `x = -1` and `x = 0`.", "At `x = -1`: `2^{-1} = 1/2 < 1 = (-1)^2`. At `x = 0`: `2^0 = 1 > 0`. So they also cross between −1 and 0: 3 solutions."] },
          { id:"mp12", topic:"47", goal:2, kind:"iv",
            prompt:"`f(x) = x + 1`, `g(x) = x - 1`. Where is `f · g` negative?",
            answer:"(−1, 1)", display:"`(-1, 1)`",
            why:"`(x + 1)(x - 1)` has zeros −1 and 1. Between them the factors have opposite signs, so the product is negative on `(-1, 1)`.",
            wrong:{ "[−1, 1]":"At −1 and 1 the product is 0, not negative: leave the zeros out.", "(−∞, −1) ∪ (1, ∞)":"That’s where `f · g` is positive." },
            hints:["Find the zero of each factor.", "Zeros −1 and 1. Test a value between them, such as `x = 0`: `(1)(-1) = -1`.", "Negative between the zeros: `(-1, 1)`."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which detective case was hardest, and which fingerprint finally gave it away?" },
      { id:"j2", q:"In your own words, why does the order matter in `f(g(x))` but not in `f + g`?" },
      { id:"j3", q:"Explain to a friend how to find the domain of a composition." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across the chapter, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"46", goal:1,
        a:{ prompt:"`f(x) = 3x - 2` and `g(x) = x^2 + 1`. What is `(f + g)(x)`?",
          options:[
            { t:"`x^2 + 3x - 1`", ok:true, why:"`3x - 2 + x^2 + 1`: collect like terms." },
            { t:"`x^2 + 3x - 3`", why:"−2 + 1 = −1." },
            { t:"`3x^3 - 2x^2 + 3x - 2`", why:"That’s the product." },
            { t:"`3x^2 + 1`", why:"That’s `f(g(x))`. " + M1 }] },
        b:{ prompt:"`f(x) = 2x + 5` and `g(x) = x^2 - 3`. What is `(f - g)(x)`?",
          options:[
            { t:"`-x^2 + 2x + 8`", ok:true, why:"`2x + 5 - (x^2 - 3) = -x^2 + 2x + 8`." },
            { t:"`x^2 - 2x - 8`", why:"That’s `g - f`." },
            { t:"`-x^2 + 2x + 2`", why:"5 − (−3) = 8." },
            { t:"`2x^2 - 1`", why:"That’s `f(g(x))`. " + M1 }] } },
      { id:"f2", cat:"K", topic:"47", goal:2,
        a:{ prompt:"`f(x) = x + 2` and `g(x) = x - 5`. What is the domain of `(f/g)(x)`?",
          options:[
            { t:"`{x ∈ ℝ | x != 5}`", ok:true, why:"`g(5) = 0`, so 5 is excluded." },
            { t:"`{x ∈ ℝ | x != -2}`", why:"That’s `f`’s zero." },
            { t:"`{x ∈ ℝ | x != -2, 5}`", why:"`f(-2) = 0` is allowed: `0 ÷ (-7) = 0`. Only the zero of `g` is excluded." },
            { t:"`{x ∈ ℝ}`", why:M2 }] },
        b:{ prompt:"`f(x) = x^2 - 1` and `g(x) = x + 4`. What is the domain of `(f/g)(x)`?",
          options:[
            { t:"`{x ∈ ℝ | x != -4}`", ok:true, why:"`g(-4) = 0`, so −4 is excluded." },
            { t:"`{x ∈ ℝ | x != ±1}`", why:"Those are the zeros of `f`, and they’re allowed. Only the zero of `g` is excluded." },
            { t:"`{x ∈ ℝ | x != -4, ±1}`", why:"The zeros of `f` are allowed: `0 ÷ 5 = 0`. Only the zero of `g` is excluded." },
            { t:"`{x ∈ ℝ}`", why:M2 }] } },
      { id:"f3", cat:"K", topic:"48", goal:3,
        a:{ prompt:"`f(x) = x^2 + 1` and `g(x) = 2x - 3`. Find `g(f(2))`.",
          options:[
            { t:"7", ok:true, why:"`f(2) = 5`; `g(5) = 7`." },
            { t:"2", why:"That’s `f(g(2)) = f(1)`. " + M1 },
            { t:"5", why:"That’s `f(2) × g(2)`. " + M5 },
            { t:"6", why:"That’s `f(2) + g(2)`. " + M5 }] },
        b:{ prompt:"`f(x) = x^2 - 2` and `g(x) = 3x + 1`. Find `f(g(1))`.",
          options:[
            { t:"14", ok:true, why:"`g(1) = 4`; `f(4) = 14`." },
            { t:"−2", why:"That’s `g(f(1)) = g(-1)`. " + M1 },
            { t:"−4", why:"That’s `f(1) × g(1)`. " + M5 },
            { t:"3", why:"That’s `f(1) + g(1)`. " + M5 }] } },
      { id:"f4", cat:"K", topic:"49", goal:5,
        a:{ prompt:"Which kind of function best models a quantity that repeats every 24 hours?",
          options:[
            { t:"Sinusoidal", ok:true, why:"Repeating behaviour is periodic, so it’s sinusoidal." },
            { t:"Exponential", why:M8 },
            { t:"Polynomial", why:"Polynomials can’t repeat forever. " + M8 },
            { t:"Rational", why:M8 }] },
        b:{ prompt:"Which kind of function best models a quantity that halves every 5 years?",
          options:[
            { t:"Exponential", ok:true, why:"Halving every 5 years is a constant ratio." },
            { t:"Linear", why:M8 },
            { t:"Sinusoidal", why:M8 },
            { t:"Rational", why:M8 }] } },
      { id:"f5", cat:"T", topic:"46", goal:1,
        a:{ prompt:"`f(x) = x^3` (odd) and `g(x) = x^2` (even). Which describes `f + g`?",
          options:[
            { t:"Neither even nor odd", ok:true, why:"`h(-x) = -x^3 + x^2`, which is neither `h(x)` nor `-h(x)`." },
            { t:"Odd", why:M4 },
            { t:"Even", why:M4 },
            { t:"Both even and odd", why:"Only the zero function is both." }] },
        b:{ prompt:"`f(x) = cos x` (even) and `g(x) = x^2` (even). Which describes `f + g`?",
          options:[
            { t:"Even", ok:true, why:"`h(-x) = cos x + x^2 = h(x)`." },
            { t:"Odd", why:M4 },
            { t:"Neither", why:M4 },
            { t:"Both even and odd", why:"Only the zero function is both." }] } },
      { id:"f6", cat:"T", topic:"47", goal:2,
        a:{ prompt:"Where is `{x - 1}/{x^2 - 4}` positive?",
          options:[
            { t:"`(-2, 1) ∪ (2, ∞)`", ok:true, why:"Critical values −2, 1, 2; test each interval." },
            { t:"`(1, ∞)`", why:"Between 1 and 2 the denominator is negative." },
            { t:"`(-∞, -2) ∪ (1, 2)`", why:"That’s where it’s negative." },
            { t:"`[-2, 1] ∪ [2, ∞)`", why:"±2 are excluded; at 1 it’s 0. " + M2 }] },
        b:{ prompt:"Where is `{x + 3}/{x^2 - 1}` positive?",
          options:[
            { t:"`(-3, -1) ∪ (1, ∞)`", ok:true, why:"Critical values −3, −1, 1; test each interval." },
            { t:"`(-3, ∞)`", why:"Between −1 and 1 the denominator is negative." },
            { t:"`(-∞, -3) ∪ (-1, 1)`", why:"That’s where it’s negative." },
            { t:"`[-3, -1] ∪ [1, ∞)`", why:"±1 are excluded; at −3 it’s 0. " + M2 }] } },
      { id:"f7", cat:"T", topic:"48", goal:4,
        a:{ prompt:"`f(x) = √{x - 1}` and `g(x) = x^2`. What is the domain of `f(g(x))`?",
          options:[
            { t:"`{x ∈ ℝ | x <= -1 or x >= 1}`", ok:true, why:"`x^2 - 1 >= 0`." },
            { t:"`{x ∈ ℝ | x >= 1}`", why:"Negative `x` work too: `(-2)^2 - 1 = 3`. " + M3 },
            { t:"`{x ∈ ℝ}`", why:"At `x = 0`, `0^2 - 1 < 0`. " + M3 },
            { t:"`{x ∈ ℝ | x >= 0}`", why:"At `x = 1/2`, `(1/2)^2 - 1 < 0`, and negative `x` such as −2 work." }] },
        b:{ prompt:"`f(x) = √{4 - x}` and `g(x) = x^2`. What is the domain of `f(g(x))`?",
          options:[
            { t:"`{x ∈ ℝ | -2 <= x <= 2}`", ok:true, why:"`4 - x^2 >= 0`." },
            { t:"`{x ∈ ℝ | x <= 4}`", why:"That’s `f`’s domain. " + M3 },
            { t:"`{x ∈ ℝ | x <= 2}`", why:"−3 fails: 4 − 9 < 0." },
            { t:"`{x ∈ ℝ}`", why:"3 fails: 4 − 9 < 0." }] } },
      { id:"f8", cat:"T", topic:"48", goal:4,
        a:{ prompt:"`h(x) = 1/(x^2 + 4)` is written as `f(g(x))` with `g(x) = x^2 + 4`. What is `f(x)`?",
          options:[
            { t:"`1/x`", ok:true, why:"`f(g(x)) = 1/(x^2 + 4)`." },
            { t:"`x^2 + 4`", why:"That’s `g` again: it gives `(x^2 + 4)^2 + 4`." },
            { t:"`1/x^2`", why:"That gives `1/(x^2 + 4)^2`." },
            { t:"`x/4`", why:"That gives `(x^2 + 4)/4`." }] },
        b:{ prompt:"`h(x) = √{2x - 5}` is written as `f(g(x))` with `g(x) = 2x - 5`. What is `f(x)`?",
          options:[
            { t:"`√x`", ok:true, why:"`f(g(x)) = √{2x - 5}`." },
            { t:"`2x - 5`", why:"That’s `g` again: it gives `2(2x - 5) - 5 = 4x - 15`." },
            { t:"`√{2x}`", why:"That gives `√{4x - 10}`." },
            { t:"`x^2`", why:"That gives `(2x - 5)^2`." }] } },
      { id:"f9", cat:"C", topic:"46", goal:1,
        a:{ prompt:"Which is the best explanation of why the domain of `f + g` is the overlap of the two domains?",
          options:[
            { t:"“`(f + g)(x) = f(x) + g(x)` needs both values to exist, so `x` must be in both domains.”", ok:true, why:"A sum needs both of its parts." },
            { t:"“Because adding functions adds their domains.”", why:"Domains don’t add." },
            { t:"“Because the sum is always defined everywhere.”", why:"`√x + 1/x` isn’t defined at 0 or for `x < 0`." },
            { t:"“Because `f + g` takes the larger domain.”", why:"It takes the overlap." }] },
        b:{ prompt:"Which is the best explanation of why the domain of `f/g` excludes the zeros of `g`?",
          options:[
            { t:"“`(f/g)(x) = f(x) ÷ g(x)`, and division by 0 is undefined.”", ok:true, why:M2 },
            { t:"“Because zeros of `g` are always asymptotes.”", why:"Sometimes they’re holes." },
            { t:"“Because zeros of `f` are excluded too.”", why:"Zeros of `f` are fine: 0 ÷ 5 = 0." },
            { t:"“Because `f/g` has the same domain as `g`.”", why:"It also needs `f`’s domain, minus `g`’s zeros." }] } },
      { id:"f10", cat:"C", topic:"47", goal:2,
        a:{ prompt:"Which best describes `y = 2^{-x} sin(4x)` for large `x`?",
          options:[
            { t:"“It oscillates between the curves `y = 2^{-x}` and `y = -2^{-x}`, so its swings shrink toward 0.”", ok:true, why:"The envelope `2^{-x} → 0` multiplies every swing." },
            { t:"“It grows without bound.”", why:M6 },
            { t:"“It oscillates between −1 and 1 forever.”", why:M6 },
            { t:"“It has horizontal asymptote `y = 1`.”", why:"It approaches 0." }] },
        b:{ prompt:"Which best describes `y = (0.5)^x cos(3x)` for large `x`?",
          options:[
            { t:"“It oscillates between `y = (0.5)^x` and `y = -(0.5)^x`, so its swings shrink toward 0.”", ok:true, why:"The envelope `(0.5)^x → 0` multiplies every swing." },
            { t:"“It grows without bound.”", why:M6 },
            { t:"“It oscillates between −1 and 1 forever.”", why:M6 },
            { t:"“It has horizontal asymptote `y = 0.5`.”", why:"It approaches 0." }] } },
      { id:"f11", cat:"C", topic:"48", goal:[3, 6],
        a:{ prompt:"`f(x) = x + 3` and `g(x) = x^2`. Which statement is correct?",
          options:[
            { t:"“`f(g(x)) = x^2 + 3` squares first; `g(f(x)) = (x + 3)^2` adds first. They differ: at `x = 1`, 4 vs 16.”", ok:true, why:"The inside function acts first, so the order changes the result." },
            { t:"“They’re equal, because composition is like multiplication.”", why:M1 },
            { t:"“`f(g(x)) = (x + 3)^2`, because `f` is written first.”", why:"`(x + 3)^2` is `g(f(x))`. " + M1 },
            { t:"“`f(g(x)) = x^2(x + 3)`.”", why:"That’s the product `f · g`. " + M5 }] },
        b:{ prompt:"`f(x) = 2x` and `g(x) = x - 5`. Which statement is correct?",
          options:[
            { t:"“`f(g(x)) = 2x - 10` subtracts first; `g(f(x)) = 2x - 5` doubles first. They differ by 5.”", ok:true, why:"The inside function acts first, so the order changes the result." },
            { t:"“They’re equal.”", why:M1 },
            { t:"“`f(g(x)) = 2x - 5`.”", why:"`2x - 5` is `g(f(x))`. " + M1 },
            { t:"“`f(g(x)) = 2x(x - 5)`.”", why:"That’s the product `f · g`. " + M5 }] } },
      { id:"f12", cat:"A", topic:"49", goal:5,
        a:{ fixedOrder:true, prompt:"A store’s monthly revenue is `R(x) = x(120 - 4x)` dollars at a price of `x` dollars. Which price maximizes revenue?",   // prices in increasing order
          options:[
            { t:"$15", ok:true, why:"Zeros 0 and 30; maximum halfway." },
            { t:"$30", why:"Revenue is 0 there." },
            { t:"$60", why:"That’s 120 ÷ 2, ignoring the 4." },
            { t:"$120", why:"That’s a coefficient." }] },
        b:{ fixedOrder:true, prompt:"`R(x) = x(80 - 4x)`. Which price maximizes revenue?",
          options:[
            { t:"$10", ok:true, why:"Zeros 0 and 20; maximum halfway." },
            { t:"$20", why:"Revenue is 0 there." },
            { t:"$40", why:"That’s 80 ÷ 2, ignoring the 4." },
            { t:"$80", why:"That’s a coefficient." }] } },
      { id:"f13", cat:"A", topic:"47", goal:2,
        a:{ fixedOrder:true, prompt:"A pendulum’s displacement is `d(t) = 10(0.8)^t cos(πt)` cm after `t` seconds. Find `d(2)`.",   // displacements in increasing order
          options:[
            { t:"−6.4 cm", why:"`cos 2π = 1`." },
            { t:"0.64 cm", why:"Multiply by 10." },
            { t:"6.4 cm", ok:true, why:"10 × 0.64 × `cos 2π` = 6.4." },
            { t:"10 cm", why:"The envelope shrinks the swing. " + M6 }] },
        b:{ fixedOrder:true, prompt:"`d(t) = 8(0.5)^t cos(πt)` cm. Find `d(3)`.",
          options:[
            { t:"−1 cm", ok:true, why:"8 × 0.125 × `cos 3π` = −1." },
            { t:"0.125 cm", why:"Multiply by 8, and `cos 3π = -1`." },
            { t:"1 cm", why:"`cos 3π = -1`." },
            { t:"8 cm", why:M6 }] } },
      { id:"f14", cat:"A", topic:"48", goal:3,
        a:{ prompt:"A traveller converts dollars to euros with `E(d) = 0.68d`, then pays a 5 € fee: `F(E) = E - 5`. What is `F(E(100))`, and what does it mean?",
          options:[
            { t:"63 €: the euros received for $100 after the fee", ok:true, why:"`E(100) = 68`; 68 − 5." },
            { t:"64.6 €: the fee is taken off before converting", why:"That subtracts the fee before converting: 0.68(100 − 5). " + M1 },
            { t:"73 €: the euros received plus the fee", why:"That adds the fee." },
            { t:"$63: the dollars left after the fee", why:"The result is in euros." }] },
        b:{ fixedOrder:true, prompt:"`C(F) = (5/9)(F - 32)` converts °F to °C and `K(C) = C + 273` converts °C to kelvins. What is `K(C(212))`?",   // temperatures in increasing order
          options:[
            { t:"−173 K", why:"That subtracts 273 instead of adding it." },
            { t:"100 K", why:"That stops after `C`." },
            { t:"373 K", ok:true, why:"`C(212) = 100`; 100 + 273." },
            { t:"485 K", why:"That adds 273 to 212 °F." }] } },
      { id:"f15", cat:"A", topic:"46", goal:1,
        a:{ prompt:"Two sound waves `y = 2 sin x` and `y = 2 sin(x + π)` play together. What is the combined wave?",
          options:[
            { t:"`y = 0`: silence", ok:true, why:"`sin(x + π) = -sin x`: they cancel." },
            { t:"`y = 4 sin x`", why:"They’re opposite, not in step." },
            { t:"`y = 2 sin(2x + π)`", why:"Adding waves doesn’t add their arguments." },
            { t:"`y = 4 sin(x + π/2)`", why:"`sin(x + π) = -sin x`, so the heights cancel at every `x`: no wave is left." }] },
        b:{ prompt:"`y = 3 cos x` and `y = 3 cos(x + 2π)` play together. What is the combined wave?",
          options:[
            { t:"`y = 6 cos x`", ok:true, why:"A full period shift: they’re in step." },
            { t:"`y = 0`", why:"They’re in step, not opposite." },
            { t:"`y = 3 cos(2x + 2π)`", why:"Adding waves doesn’t add their arguments." },
            { t:"`y = 9 cos x`", why:"Heights add, not multiply." }] } }
    ]
  },

  task:{
    title:"Build a function to spec", summary:"Build a function to spec",
    statement:"<p>Choose two functions from the menu and one way of combining them to build a function `h` with all three properties. There’s more than one answer.</p><ol class=\"c8-props\"><li>`h` is odd.</li><li>`h` is undefined at `x = 0`.</li><li>`h(x) → 0` as `x → ∞`.</li></ol><p class=\"tiny muted\">Choose `u` and `v` from `x^2`, `x^3`, `sin x`, `1/x` and `2^x` (two different ones), and an operation: `u + v`, `u - v`, `u · v`, `u/v` or `u(v(x))`.</p>",
    checks:[
      "`h(-x) = -h(x)` at several points and symbolically: `h` is odd",
      "`h(0)` is undefined",
      "`h(x) → 0` as `x → ∞`"],
    tips:[
      "Odd results come from odd ± odd, odd × even, odd ÷ even, or an odd function of an odd function.",
      "Divide by a function that is 0 at `x = 0`, or use `1/x`.",
      "Something has to shrink: divide by a function that grows faster, or feed in `1/x`, which → 0."],
    tipNow:[
      "Right now `h` is §1: §2.",
      "Right now §1.",
      "Right now, as `x → ∞`, `h(x)` §1."],
    ui:{ u:"`u(x) =`", v:"`v(x) =`", op:"Operation", uAria:"Choose u", vAria:"Choose v", opAria:"Choose the operation", same:"`u` and `v` must be different.",
      cap:"Your function", graph:"Graph of `h`", odd:"Odd test", h0:"At `x = 0`", far:"Far right",
      x:"`x`", hx:"`h(x)`", hmx:"`h(-x)`", undef:"undefined", yes:"✓", no:"✗",
      par:{ odd:"odd", even:"even", neither:"neither even nor odd" },
      rule:{ pair:"§1 §2 §3 is §4", none:"§1 has no symmetry, so `h` has none",
        compEven:"any function of an even function is even", compOdd:"§1 function of an odd function is §2", compNone:"a function of a function with no symmetry has none" },
      why0:{ rx:"`1/x` is undefined at `x = 0`", div:"`v(0) = 0`, so it divides by 0", comp:"`v(0) = 0`, and `1/0` is undefined", def:"`h(0)` = §1" },
      lim:{ "0":"→ 0", inf:"grows without bound", c:"levels off at 1, not 0", osc:"keeps oscillating, so it doesn’t approach 0", wild:"keeps swinging to ±∞, so it doesn’t approach 0" },
      describe:"Graph of h(x) = §1 for x from −6 to 6. §2" },
    explainPrompt:"Explain why your function is odd and why it approaches 0, using the fingerprints of the operation you chose.",
    success:"Your function has all three properties.",
    more:"There’s more than one answer. Can you find another?",
    all6:"That’s all six designs. They build only four different functions: `1/x`, `1/x^3` (three ways), `{sin x}/{x^2}` and `sin(1/x)`."
  },

  cards:[
    ["`(f ± g)(x)`", "`f(x) ± g(x)`; domain: the overlap."],
    ["`(f · g)(x)`", "`f(x) · g(x)`; zeros of either factor are zeros of the product."],
    ["`(f/g)(x)`", "`f(x) ÷ g(x)`; exclude zeros of `g` (asymptotes or holes)."],
    ["`f(g(x))`", "Do `g` first, then `f`. Usually `!= g(f(x))`."],
    ["Domain of `f(g(x))`", "`x` in `g`’s domain with `g(x)` in `f`’s domain."],
    ["Decomposing", "`h(x) = (3x - 1)^5`: inside `g = 3x - 1`, outside `f = x^5`."],
    ["`f(f^{-1}(x))`", "`x`. A function undoes its inverse."],
    ["Symmetry of combinations", "odd ± odd = odd; even ± even = even; odd × odd = even; odd × even = odd."],
    ["Damped motion", "envelope × wave: swings shrink between ±envelope."],
    ["Superposition", "Waves add point by point: in step they reinforce, half a period apart they cancel."],
    ["Choosing a model", "Constant differences: linear; constant ratios: exponential; repeating: sinusoidal; levelling off near a value: rational or exponential decay."],
    ["Solving when algebra can’t", "Graph both sides and count or estimate the intersections."]
  ]
};
