// MHF4U 24 Chapter 3 Summary & Review: the plan's content as data (plan modules/24-chapter-3-review.md).
// Review module: Start (goals + diagnostic), Connect (rational function anatomy), Mixed practice, Reflect, Final Check.

// Hero equation as raw HTML so app.js can make each part glow in turn (data-h names the part).
const HX = (h, html) => '<span class="hx" data-h="' + h + '">' + html + "</span>";
const X = "<i>x</i>";
const HERO_EQ = '<span class="m"><i>f</i>(' + X + ') = <span class="frac"><span class="fn">' + HX("lead", "2" + X + "<sup>2</sup>") + " + 2" + X + " " + HX("const", "− 4") +
  '</span><span class="fd">' + HX("lead", X + "<sup>2</sup>") + " − " + X + " " + HX("const", "− 6") + "</span></span> = " +
  '<span class="frac"><span class="fn">2' + HX("n1", "(" + X + " − 1)") + HX("c2", "(" + X + " + 2)") + '</span><span class="fd">' + HX("d3", "(" + X + " − 3)") + HX("c2", "(" + X + " + 2)") + "</span></span></span>";

// M-table core sentences (plan section 3), used where the plan tags an option with the misconception only.
const M1 = "If the factor cancels, the graph has a hole there (an open circle), not an asymptote.";
const M4 = "State the restrictions first; a value that makes a denominator 0 can’t be a solution.";
const M5 = "A restriction always gets a round bracket.";
const M6 = "At the quadratic’s vertex, the reciprocal’s value is 1 ÷ (the vertex’s `y`-value).";
const M7 = "Divide: the quotient (without the remainder) is the oblique asymptote.";

export default {
  id:"24-chapter-3-review",
  kind:"review",
  title:"Chapter 3 summary and review",
  topic:"Chapter 3 Summary & Review",
  hero:{
    eq:HERO_EQ, eqSize:"sm",
    eqLabel:"f of x equals (2 x squared plus 2 x minus 4) over (x squared minus x minus 6), which equals 2 (x minus 1)(x plus 2) over (x minus 3)(x plus 2)",
    headline:"Every feature has an address in the equation",
    text:"Factor the top and bottom of a rational function and its graph almost draws itself: the factor that cancels is a <strong>hole</strong>, the factor left in the denominator is a <strong>vertical asymptote</strong>, the leading terms give the <strong>horizontal asymptote</strong>, and the numerator’s factor is the <strong>`x`-intercept</strong>.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ aria:"Graph of f of x equals 2(x − 1)(x + 2) over (x − 3)(x + 2), with dashed asymptotes x = 3 and y = 2, an open circle (a hole) at (−2, 6/5), the x-intercept (1, 0) and the y-intercept (0, 2/3). Each feature is labelled with the part of the equation that makes it.",
      steps:[
        { h:"c2", tag:"`(x + 2)` cancels", cap:"`(x + 2)` cancels: a hole at `(-2, 6/5)` · module 21" },
        { h:"d3", tag:"`(x - 3)`", cap:"`(x - 3)` stays in the denominator: vertical asymptote `x = 3` · modules 17 and 20" },
        { h:"lead", tag:"`2x^2/x^2`", cap:"`{2x^2}/{x^2}`: horizontal asymptote `y = 2` · modules 17 and 20" },
        { h:"n1", tag:"`(x - 1)`", cap:"`(x - 1)` in the numerator: `x`-intercept `(1, 0)`" },
        { h:"const", tag:"`f(0) = 2/3`", cap:"`f(0) = 2/3`: `y`-intercept `(0, 2/3)`" }] }
  },
  goals:[
    "I can find the domain and the vertical and horizontal asymptotes of a rational function.",
    "I can sketch and describe `y = {1}/{kx - c}` from the line it comes from.",
    "I can sketch the reciprocal of a quadratic in its three cases and find its local maximum or minimum.",
    "I can find the asymptotes and intercepts of `y = {ax + b}/{cx + d}` and sketch it.",
    "I can tell a hole from a vertical asymptote and find an oblique asymptote by division.",
    "I can solve rational equations (rejecting extraneous roots) and rational inequalities with a sign chart.",
    "I can model situations with rational functions and explain what the asymptotes mean."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "17":{ idea:"Restrictions come from the denominator; a vertical asymptote where it’s 0 (and doesn’t cancel); compare degrees for the horizontal asymptote.",
      look:"Near and far: walk the curve (Explore); Read the equation: restrictions and asymptotes (Equation)" },
    "18":{ idea:"`{1}/{kx - c}`: the line’s zero becomes the vertical asymptote; `y = ±1` points stay; big becomes small.",
      look:"Reciprocal twin (Explore); Closing in: the four arrows (Near the asymptote)" },
    "19":{ idea:"Two, one or no zeros of the quadratic: two, one or no vertical asymptotes; the vertex becomes a local max or min with value 1 ÷ (vertex `y`).",
      look:"Reciprocal plotter (Explore); Three cases, one routine (Three cases)" },
    "20":{ idea:"`{ax + b}/{cx + d}`: vertical `x = -d/c`, horizontal `y = a/c`.",
      look:"Asymptote crosshair (Explore); Sketch from the equation (Sketch)" },
    "21":{ idea:"A cancelled factor is a hole; numerator degree one higher means divide for the oblique asymptote.",
      look:"Cancel-and-divide lab (Explore); Hole or asymptote? Under the microscope (Microscope)" },
    "22":{ idea:"Restrictions first; reject extraneous roots; sign charts with round brackets at restrictions.",
      look:"Two-sides grapher (Explore); Sign charts with restrictions (Sign charts)" },
    "23":{ idea:"In context, the horizontal asymptote is a long-run value that is approached, not reached.",
      look:"Cost and concentration simulator (Explore); What does the asymptote mean here? (Meaning)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Nine questions, at least one from each Chapter 3 module. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"17", goal:1,
          prompt:"What is the domain of `f(x) = {x + 1}/{x^2 - 9}`?",
          options:[
            { t:"`{x ∈ ℝ | x ≠ -3, 3}`", ok:true, why:"`x^2 - 9 = 0` at `x = ±3`." },
            { t:"`{x ∈ ℝ | x ≠ 3}`", why:"`(-3)^2 - 9 = 0` too." },
            { t:"`{x ∈ ℝ | x ≠ -1}`", why:"−1 makes the <strong>numerator</strong> 0; that’s allowed." },
            { t:"`{x ∈ ℝ | x ≠ 9}`", why:"Solve `x^2 = 9`, not `x = 9`." }],
          hints:["Where is the denominator 0?", "`x^2 - 9 = (x - 3)(x + 3)`.", "`x ≠ ±3`."] },
        { id:"d2", topic:"18", goal:2,
          prompt:"What are the asymptotes of `y = {1}/{2x - 6}`?",
          options:[
            { t:"Vertical `x = 3`; horizontal `y = 0`", ok:true, why:"`2x - 6 = 0` at `x = 3`; 1 ÷ (huge) → 0." },
            { t:"Vertical `x = 6`; horizontal `y = 0`", why:"Solve `2x - 6 = 0`: `x = 3`." },
            { t:"Vertical `x = 3`; horizontal `y = 2`", why:"The numerator is constant, so `y → 0`." },
            { t:"Vertical `x = -3`; horizontal `y = 0`", why:"The asymptote is where the denominator is 0: `2x - 6 = 0` at `x = 3`." }],
          hints:["Where is the denominator 0?", "`x = 3`.", "And `y → 0` for large `|x|`."] },
        { id:"d3", topic:"19", goal:3,
          prompt:"Which is true for `y = {1}/{x^2 - 4x + 5}`?",
          options:[
            { t:"No vertical asymptotes; a local maximum at `(2, 1)`", ok:true, why:"`x^2 - 4x + 5 = (x - 2)^2 + 1 ≥ 1`, never 0; its minimum 1 at `x = 2` gives the reciprocal’s maximum `1/1`." },
            { t:"A vertical asymptote at `x = 2`", why:"The quadratic is never 0." },
            { t:"A local minimum at `(2, 1)`", why:"The smallest denominator gives the largest value: a maximum." },
            { t:"Vertical asymptotes at `x = 1` and `x = 5`", why:"`x^2 - 4x + 5` doesn’t factor; its discriminant is −4." }],
          hints:["Complete the square.", "`(x - 2)^2 + 1`.", "Minimum 1 → reciprocal maximum 1."] },
        { id:"d4", topic:"20", goal:4,
          prompt:"What are the asymptotes of `y = {3x - 2}/{x + 4}`?",
          options:[
            { t:"Vertical `x = -4`; horizontal `y = 3`", ok:true, why:"`x + 4 = 0` at −4; for large `|x|`, `3x/x = 3`." },
            { t:"Vertical `x = 4`; horizontal `y = 3`", why:"The asymptote is where the denominator is 0: `x + 4 = 0` at `x = -4`." },
            { t:"Vertical `x = -4`; horizontal `y = -1/2`", why:"That’s `b/d`. For large `|x|`, only `3x` and `x` matter: `y → 3`." },
            { t:"Vertical `x = 2/3`; horizontal `y = 3`", why:"`2/3` is the `x`-intercept." }],
          hints:["Denominator zero?", "`x = -4`.", "Leading coefficients: `3/1`."] },
        { id:"d5", topic:"21", goal:5,
          prompt:"What happens at `x = 3` on the graph of `y = {x^2 - x - 6}/{x - 3}`?",
          options:[
            { t:"A hole at `(3, 5)`", ok:true, why:"`{(x - 3)(x + 2)}/{x - 3} = x + 2` for `x ≠ 3`; at 3 that would be 5." },
            { t:"A vertical asymptote `x = 3`", why:"The factor cancels. " + M1 },
            { t:"A hole at `(3, 0)`", why:"The hole’s height is the simplified function’s value: `3 + 2`." },
            { t:"A hole at `(-2, 0)`", why:"−2 is the `x`-intercept." }],
          hints:["Factor the numerator.", "`(x - 3)(x + 2)`.", "Cancel: `y = x + 2`, hole at `(3, 5)`."] },
        { id:"d6", topic:"21", goal:5,
          prompt:"What is the oblique asymptote of `y = {x^2 + 3x - 1}/{x - 1}`?",
          options:[
            { t:"`y = x + 4`", ok:true, why:"`x^2 + 3x - 1 = (x - 1)(x + 4) + 3`." },
            { t:"`y = x + 3`", why:"That copies the numerator’s coefficients. " + M7 },
            { t:"`y = x - 1`", why:"That’s the denominator." },
            { t:"`y = x + 2`", why:"Check the division: 1, `1 + 3 = 4`." }],
          hints:["Divide by `x - 1`.", "Synthetic division with 1: 1 | 4 | 3.", "Quotient `x + 4`."] },
        { id:"d7", topic:"22", goal:6,
          prompt:"Solve `{3}/{x - 1} = {6}/{x + 1}`.",
          options:[
            { t:"`x = 3`", ok:true, why:"`3(x + 1) = 6(x - 1)` gives `x = 3`; it isn’t a restricted value." },
            { t:"`x = -3`", why:"`3x + 3 = 6x - 6` gives `9 = 3x`." },
            { t:"`x = 1`", why:"`x = 1` is a restriction. " + M4 },
            { t:"`x = 1/3`", why:"Check: `3/(-2/3) ≠ 6/(4/3)`." }],
          hints:["Restrictions: `x ≠ ±1`.", "Cross-multiply.", "`x = 3`."] },
        { id:"d8", topic:"22", goal:6,
          prompt:"Solve `{x - 2}/{x + 3} ≥ 0`.",
          options:[
            { t:"`(-∞, -3) ∪ [2, ∞)`", ok:true, why:"Critical values −3 (excluded) and 2 (included)." },
            { t:"`(-∞, -3] ∪ [2, ∞)`", why:"`x = -3` makes the denominator 0. " + M5 },
            { t:"`(-3, 2]`", why:"That’s where it’s ≤ 0." },
            { t:"`(-∞, -3) ∪ (2, ∞)`", why:"≥ includes the zero at `x = 2`." }],
          hints:["Zeros of the top and bottom?", "2 and −3; test each interval.", "`(-∞, -3) ∪ [2, ∞)`."] },
        { id:"d9", topic:"23", goal:7,
          prompt:"The average cost per item is `C(n) = {500 + 4n}/{n}` dollars for `n` items. What does its horizontal asymptote tell you?",
          options:[
            { t:"As production grows, the average cost gets closer and closer to $4 per item", ok:true, why:"`{500 + 4n}/{n} = {500}/{n} + 4 → 4`." },
            { t:"The average cost is $4 when `n = 0`", why:"`C(0)` is undefined." },
            { t:"The minimum possible average cost is exactly $4", why:"It approaches $4 but never reaches it." },
            { t:"The total cost approaches $4", why:"The total cost `500 + 4n` grows without limit." }],
          hints:["Split the fraction.", "`{500}/{n} + 4`.", "`{500}/{n} → 0`."] }
      ]
    }
  },

  // ---------- Connect: rational function anatomy (N18 connection builder, rendered by app.connect) ----------
  connect:{
    heading:"Rational function anatomy",
    intro:"Chapter 3 taught each feature in its own module. Here every feature of two functions is on one screen. Link each part of an equation to the feature of the graph it creates.",
    summary:"Anatomy links",
    how:"Tap a part of an equation, then the feature on a graph that it creates. Then press Link.",
    ui:{ expanded:"Expanded", factored:"Factored", divide:"Divide", link:"Link", clear:"Clear", part:"Equation part", feat:"Graph feature", none:"none yet",
      needBoth:"Choose an equation part and a graph feature first.",
      otherGraph:"That feature is on the other function’s graph. Link a part of an equation to a feature of the same function.",
      fGraph:"Graph of `f`", gGraph:"Graph of `g`", holeQ:"hole", done:"All eight links made." },
    parts:{
      lead:"the leading terms `2x^2` and `x^2`", const:"the constants −4 and −6", n1:"`(x - 1)` in the numerator", c2:"the factor `(x + 2)`, top and bottom",
      d3:"`(x - 3)` in the denominator", gnum:"`g`’s numerator, `x^2 - 4 = (x - 2)(x + 2)`", gden:"`g`’s denominator, `x - 1`", gdiv:"dividing `x^2 - 4` by `x - 1`" },
    feats:{
      fva:"the dashed line `x = 3` on `f`", fha:"the dashed line `y = 2` on `f`", fhole:"the open circle (hole) on `f`", fx:"the point `(1, 0)` on `f`", fy:"the point `(0, 2/3)` on `f`",
      gva:"the dashed line `x = 1` on `g`", goa:"the slanted dashed line `y = x + 1` on `g`", gx:"the points `(-2, 0)` and `(2, 0)` on `g`", gy:"the point `(0, 4)` on `g`" },
    challenges:[
      { id:"AN1", topics:["17", "20"], goal:1, type:"link",
        prompt:"Which part of `f` makes the vertical asymptote?",
        answer:"d3|fva",
        why:"`(x - 3)` stays in the denominator after cancelling, so `x = 3` is a vertical asymptote.",
        fb:{ "part:c2":"That factor cancels: it makes the hole.",
          partDefault:"A vertical asymptote comes from a factor of the denominator that doesn’t cancel.",
          featDefault:"`x - 3 = 0` at `x = 3`. Link it to the feature at `x = 3`." } },
      { id:"AN2", topics:["21"], goal:5, type:"link",
        prompt:"Which part makes the hole, and where is it?",
        answer:"c2|fhole",
        why:"`(x + 2)` cancels, so `f(x) = {2(x - 1)}/{x - 3}` for `x ≠ -2`. The hole’s height is the simplified `f`: `{2(-3)}/{-5} = 6/5` = 1.2. The hole is at `(-2, 6/5)`.",
        fb:{ featDefault:"The hole’s height is the simplified `f`: `2(-3)/(-5) = 6/5`.",
          "part:d3":"`(x - 3)` doesn’t cancel, so it makes the vertical asymptote. " + M1,
          partDefault:"A hole comes from a factor that cancels: it’s in the numerator and the denominator." } },
      { id:"AN3", topics:["17", "20"], goal:1, type:"link",
        prompt:"What sets the horizontal asymptote?",
        answer:"lead|fha",
        why:"Equal degrees: for large `|x|`, `f(x) ≈ {2x^2}/{x^2} = 2`, so the horizontal asymptote is `y = 2`.",
        fb:{ "part:const":"The constants matter near 0, not far out.",
          partDefault:"For large `|x|`, only the leading terms matter.",
          featDefault:"Equal degrees: the ratio of the leading coefficients, `2/1`, gives a horizontal line." } },
      { id:"AN4", topics:["20"], goal:4, type:"link",
        prompt:"Which part makes the `x`-intercept?",
        answer:"n1|fx",
        why:"`(x - 1)` stays in the numerator, so `f(1) = 0`: the `x`-intercept is `(1, 0)`.",
        fb:{ "part:c2":"It cancels, so it can’t make an intercept.",
          partDefault:"`f(x) = 0` where the simplified numerator is 0.",
          featDefault:"`x - 1 = 0` at `x = 1`, where the graph meets the `x`-axis." } },
      { id:"AN5", topics:["20"], goal:4, type:"link",
        prompt:"Where does the `y`-intercept come from?",
        answer:"const|fy",
        why:"`f(0) = {-4}/{-6} = 2/3`: the `y`-intercept is `(0, 2/3)`.",
        fb:{ partDefault:"Substitute `x = 0` into the original or the simplified form.",
          featDefault:"Substitute `x = 0` into the original or the simplified form." } },
      { id:"AN6", topics:["21"], goal:5, type:"link",
        prompt:"What makes `g`’s slanted dashed line?",
        answer:"gdiv|goa",
        why:"`x^2 - 4 = (x - 1)(x + 1) - 3`, so `g(x) = x + 1 - {3}/{x - 1}`. For large `|x|` the remainder part → 0: the oblique asymptote is `y = x + 1`.",
        fb:{ partDefault:"`g`’s numerator has degree one more than its denominator: divide.",
          featDefault:"The quotient `x + 1` is a line. Which feature of `g` is a slanted line?" } },
      { id:"AN7", topics:["17", "20"], goal:4, type:"link",
        prompt:"Which part makes `g`’s `x`-intercepts?",
        answer:"gnum|gx",
        why:"`x^2 - 4 = (x - 2)(x + 2)` is 0 at `x = ±2`, and the denominator `x - 1` isn’t 0 there: the `x`-intercepts are `(-2, 0)` and `(2, 0)`.",
        fb:{ partDefault:"`g(x) = 0` when the numerator is 0 (and the denominator isn’t).",
          featDefault:"`g(x) = 0` when the numerator is 0 (and the denominator isn’t)." } },
      { id:"AN8", topics:["17", "21"], goal:5, type:"choose", stretch:true,
        prompt:"Which single change to `f`’s numerator would turn its hole into a second vertical asymptote, and what would happen to the horizontal asymptote?",
        options:[
          { t:"Remove the factor `(x + 2)`: then `x = -2` is a vertical asymptote and, with the numerator’s degree now lower, the horizontal asymptote becomes `y = 0`.", ok:true,
            why:"`f(x) = {2(x - 1)}/{(x - 3)(x + 2)}`: nothing cancels, so `x = -2` and `x = 3` are both vertical asymptotes. Degree 1 over degree 2 gives `y = 0`." },
          { t:"Multiply the numerator by `(x + 2)`: then `x = -2` is a vertical asymptote and the horizontal asymptote stays `y = 2`.", why:"That cancels with the denominator again." },
          { t:"Remove the factor `(x + 2)`: then `x = -2` is a vertical asymptote and the horizontal asymptote stays `y = 2`.", why:"Without `(x + 2)` the numerator has degree 1 and the denominator degree 2. Numerator degree lower: `y = 0`." },
          { t:"Remove the factor `(x - 1)`: then `x = -2` is a vertical asymptote and the horizontal asymptote becomes `y = 0`.", why:"`(x + 2)` still cancels, so the hole stays. Removing `(x - 1)` only removes the `x`-intercept." }] }
    ],
    onePage:{
      title:"The chapter on one page",
      intro:"Every feature of `f`, tagged with the module that taught it.",
      aria:"Anatomy diagram of f of x equals 2(x − 1)(x + 2) over (x − 3)(x + 2): restrictions x ≠ −2 and x ≠ 3; dashed vertical asymptote x = 3; dashed horizontal asymptote y = 2; a hole at (−2, 6/5); x-intercept (1, 0); y-intercept (0, 2/3); the graph is below the x-axis on (1, 3).",
      feats:[
        { id:"restr", t:"Restrictions `x ≠ -2` and `x ≠ 3`: the zeros of the denominator", mods:"17" },
        { id:"va", t:"Vertical asymptote `x = 3`: `(x - 3)` doesn’t cancel", mods:"17, 18 and 20" },
        { id:"ha", t:"Horizontal asymptote `y = 2`: equal degrees, `{2x^2}/{x^2}`", mods:"17 and 20" },
        { id:"hole", t:"Hole at `(-2, 6/5)`: `(x + 2)` cancels", mods:"21" },
        { id:"xi", t:"`x`-intercept `(1, 0)`: the simplified numerator `2(x - 1)`", mods:"20" },
        { id:"yi", t:"`y`-intercept `(0, 2/3)`: `f(0) = {-4}/{-6}`", mods:"20" },
        { id:"neg", t:"`f(x) < 0` on `(1, 3)`: the sign chart", mods:"22" }] }
  },

  // ---------- Mixed practice: 12 items in a fixed, interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Twelve questions from every Chapter 3 module, mixed up on purpose, so you practise choosing the right idea. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Twelve questions from all seven modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"20", goal:4, kind:"pair", star:true,
            prompt:"`y = {ax + 1}/{x + d}` has vertical asymptote `x = 2` and horizontal asymptote `y = -3`. Find `a` and `d`.",
            labels:["`a =`", "`d =`"], answer:[-3, -2], display:"`a = -3`, `d = -2`",
            why:"Vertical: `x = -d`, so `d = -2`. Horizontal: `a/1`, so `a = -3`.",
            wrong:[{ match:[null, 2], fb:"`x + d = 0` at `x = 2` means `d = -2`." }],
            hints:["Vertical: `x = -d`.", "Horizontal: `a/1`.", "`a = -3`, `d = -2`."] },
          { id:"mp2", topic:"17", goal:1, kind:"mc",
            prompt:"Which function has the horizontal asymptote `y = 0`?",
            options:[
              { t:"`y = {5}/{x^2 + 1}`", ok:true, why:"Numerator degree lower → `y = 0`." },
              { t:"`y = {2x + 1}/{x - 3}`", why:"Degrees equal: `y = 2`." },
              { t:"`y = {x^2 + 1}/{x}`", why:"Numerator degree higher: oblique." },
              { t:"`y = 3 + {1}/{x}`", why:"`y → 3`." }],
            hints:["Compare degrees.", "Numerator degree lower → `y = 0`.", "`{5}/{x^2 + 1}`."] },
          { id:"mp3", topic:"22", goal:6, kind:"set",
            prompt:"Solve `{x^2}/{x - 2} = {4}/{x - 2}`.",
            label:"Every solution, separated by commas:",
            answer:[-2], display:"`x = -2`",
            why:"Restriction `x ≠ 2`; then `x^2 = 4` gives ±2, and 2 is extraneous. Only −2.",
            wrong:[{ match:[2, -2], fb:"`x = 2` makes the denominator 0: extraneous." }, { match:[2], fb:"`x = 2` makes the denominator 0: extraneous." }],
            hints:["Restriction?", "`x ≠ 2`; then `x^2 = 4`.", "Only −2."] },
          { id:"mp4", topic:"19", goal:3, kind:"mc",
            prompt:"`y = {1}/{x^2 - 2x - 8}`. Which describes it between its vertical asymptotes?",
            options:[
              { t:"Below the axis, local maximum `(1, -1/9)`", ok:true, why:"`(x - 4)(x + 2)`: asymptotes −2 and 4. The quadratic’s vertex is `x = 1`, value −9, and `1/(-9) = -1/9`, a local max." },
              { t:"Below the axis, local maximum `(1, -9)`", why:M6 },
              { t:"Above the axis, local minimum `(1, 1/9)`", why:"The quadratic is negative between its zeros." },
              { t:"Below the axis, local minimum `(1, -1/9)`", why:"The largest denominator in size gives the value closest to 0: a maximum." }],
            hints:["`(x - 4)(x + 2)`: asymptotes −2 and 4.", "The quadratic’s vertex: `x = 1`, value −9.", "`1/(-9) = -1/9`, a local max."] },
          { id:"mp5", topic:"23", goal:7, kind:"num", keypad:"decimal",
            prompt:"A 20 L tank holds 1 kg of salt dissolved in water. Brine with 0.2 kg/L flows in at 5 L/min, so `C(t) = {1 + t}/{20 + 5t}` kg/L. What concentration does it approach in the long run?",
            unit:"kg/L", answer:0.2, display:"0.2 kg/L",
            why:"Horizontal asymptote: for large `t`, `{t}/{5t} = 1/5`. That’s 0.2 kg/L, the incoming brine’s concentration.",
            wrong:[{ match:0.05, fb:"That’s `C(0)`. For large `t`, `t/(5t) = 1/5`." }],
            hints:["Horizontal asymptote.", "Leading terms: `{t}/{5t}`.", "0.2 kg/L, the incoming brine’s concentration."] },
          { id:"mp6", topic:"18", goal:2, kind:"mc",
            prompt:"For `y = {1}/{x + 4}`, what happens as `x → -4^{+}`?",
            options:[
              { t:"`y → ∞`", ok:true, why:"Try `x = -3.9`: `x + 4 = 0.1`, and `1/0.1 = 10`. Closer to −4, `y` keeps growing: `y → ∞`." },
              { t:"`y → -∞`", why:"Just right of −4, `x + 4` is a tiny <strong>positive</strong> number." },
              { t:"`y → 0`", why:"Try `x = -3.9`: `x + 4 = 0.1`, and `1/0.1 = 10`. Closer to −4, `y` grows." },
              { t:"`y → 4`", why:"Try `x = -3.9`: `x + 4 = 0.1`, and `1/0.1 = 10`. Closer to −4, `y` grows." }],
            hints:["Try `x = -3.9`.", "`x + 4 = 0.1`.", "`1/0.1 = 10`, growing: `y → ∞`."] },
          { id:"mp7", topic:"21", goal:5, kind:"pair", star:true,
            prompt:"`y = {x^2 + ax - 6}/{x - 2}` has a hole at `x = 2`. Find `a` and the hole’s `y`-coordinate.",
            labels:["`a =`", "Hole’s `y`-coordinate:"], answer:[1, 5], display:"`a = 1`; the hole is at `(2, 5)`",
            why:"For a hole, `x - 2` must also be a factor of the numerator: `4 + 2a - 6 = 0`. Then `{(x + 3)(x - 2)}/{x - 2} = x + 3`, and `2 + 3 = 5`.",
            general:"For a hole, `x - 2` must also be a factor of the numerator: `4 + 2a - 6 = 0`. Then `{(x + 3)(x - 2)}/{x - 2} = x + 3`, and `2 + 3 = 5`.",
            hints:["The numerator must be 0 at `x = 2`.", "`a = 1`.", "Hole `(2, 5)`."] },
          { id:"mp8", topic:"17", goal:1, kind:"mc",
            prompt:"Domain of `y = {x - 5}/{x^2 + 4}`?",
            options:[
              { t:"`{x ∈ ℝ}`", ok:true, why:"`x^2 ≥ 0`, so `x^2 + 4 ≥ 4`: the denominator is never 0. All real numbers." },
              { t:"`{x ∈ ℝ | x ≠ 5}`", why:"That’s the numerator." },
              { t:"`{x ∈ ℝ | x ≠ ±2}`", why:"`x^2 + 4` is never 0." },
              { t:"`{x ∈ ℝ | x ≠ -4}`", why:"The denominator is `x^2 + 4`, not `x + 4`: `x^2 ≥ 0`, so `x^2 + 4 ≥ 4`." }],
            hints:["Can `x^2 + 4` be 0?", "`x^2 ≥ 0`, so `x^2 + 4 ≥ 4`.", "All real numbers."] },
          { id:"mp9", topic:"22", goal:6, kind:"iv", star:true,
            prompt:"Solve `{2}/{x + 1} < 1`.",
            answer:"(−∞, −1) ∪ (1, ∞)", display:"`(-∞, -1) ∪ (1, ∞)`",
            why:"Get 0 on one side: `{1 - x}/{x + 1} < 0`, which is negative on `(-∞, -1)` and `(1, ∞)`.",
            wrong:{ "(1, ∞)":"Multiplying by `x + 1` assumes it’s positive. Rewrite as `{1 - x}/{x + 1} < 0` and test all intervals." },
            hints:["Get 0 on one side.", "`{1 - x}/{x + 1} < 0`.", "Negative on `(-∞, -1)` and `(1, ∞)`."] },
          { id:"mp10", topic:"20", goal:4, kind:"pair",
            prompt:"`x`- and `y`-intercepts of `y = {2x - 6}/{x + 3}`?",
            labels:["`x`-intercept: `x =`", "`y`-intercept: `y =`"], answer:[3, -2], display:"`x = 3`; `y = -2`",
            why:"`x`-intercept: the numerator `2x - 6` is 0 at `x = 3`. `y`-intercept: `x = 0` gives `-6/3 = -2`.",
            hints:["`x`-intercept: numerator 0.", "`y`-intercept: `x = 0`.", "3 and `-6/3 = -2`."] },
          { id:"mp11", topic:"23", goal:7, kind:"num", star:true,
            prompt:"Average cost `C(n) = {1200 + 8n}/{n}` dollars. How many items make the average cost $10?",
            unit:"items", answer:600, display:"600 items",
            why:"Set `C(n) = 10`: `1200 + 8n = 10n`, so `2n = 1200` and `n = 600`.",
            wrong:[{ match:120, fb:"That’s 1200 ÷ 10, ignoring the `8n`. Solve `1200 + 8n = 10n`." }],
            hints:["Set `C(n) = 10`.", "`1200 + 8n = 10n`.", "`n = 600`."] },
          { id:"mp12", topic:"19", goal:3, kind:"mc",
            prompt:"Which describes `y = {1}/{x^2 + 6x + 9}`?",
            options:[
              { t:"One vertical asymptote `x = -3`; above the axis everywhere", ok:true, why:"`x^2 + 6x + 9 = (x + 3)^2`: one zero, so one asymptote, and always positive." },
              { t:"Two vertical asymptotes; above the axis everywhere", why:"`(x + 3)^2` has one zero." },
              { t:"One vertical asymptote `x = -3`; below the axis on one side", why:"`(x + 3)^2 > 0` on both sides." },
              { t:"No vertical asymptotes; above the axis everywhere", why:"Factor: `(x + 3)^2` is 0 at `x = -3`." }],
            hints:["Factor.", "`(x + 3)^2`.", "One asymptote; always positive."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which anatomy link surprised you most, and why?" },
      { id:"j2", q:"In your own words, how do you tell a hole from a vertical asymptote, from the equation alone?" },
      { id:"j3", q:"Explain to a friend how to solve a rational inequality without losing or gaining solutions." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across the whole chapter, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"17", goal:1,
        a:{ prompt:"Where are the vertical asymptotes of `y = {x + 2}/{x^2 - 25}`?",
          options:[
            { t:"`x = -5` and `x = 5`", ok:true, why:"`x^2 - 25 = 0` at `x = ±5`, and nothing cancels." },
            { t:"`x = 5` only", why:"`(-5)^2 - 25 = 0` too." },
            { t:"`x = -2`", why:"That’s the numerator’s zero." },
            { t:"`x = 25`", why:"Solve `x^2 = 25`." }] },
        b:{ prompt:"Where are the vertical asymptotes of `y = {x - 1}/{x^2 - 16}`?",
          options:[
            { t:"`x = -4` and `x = 4`", ok:true, why:"`x^2 - 16 = 0` at `x = ±4`, and nothing cancels." },
            { t:"`x = 4` only", why:"`(-4)^2 - 16 = 0` too." },
            { t:"`x = 1`", why:"That’s the numerator’s zero." },
            { t:"`x = 16`", why:"Solve `x^2 = 16`." }] } },
      { id:"f2", cat:"K", topic:"18", goal:2,
        a:{ prompt:"What is the vertical asymptote of `y = {1}/{3x + 6}`?",
          options:[
            { t:"`x = -2`", ok:true, why:"`3x + 6 = 0` at `x = -2`." },
            { t:"`x = 2`", why:"The asymptote is where the denominator is 0: `3x + 6 = 0` at `x = -2`." },
            { t:"`x = -6`", why:"Divide by 3: `3x = -6` gives `x = -2`." },
            { t:"`x = 3`", why:"That’s the coefficient." }] },
        b:{ prompt:"What is the vertical asymptote of `y = {1}/{4x - 8}`?",
          options:[
            { t:"`x = 2`", ok:true, why:"`4x - 8 = 0` at `x = 2`." },
            { t:"`x = -2`", why:"The asymptote is where the denominator is 0: `4x - 8 = 0` at `x = 2`." },
            { t:"`x = 8`", why:"Divide by 4: `4x = 8` gives `x = 2`." },
            { t:"`x = 4`", why:"That’s the coefficient." }] } },
      { id:"f3", cat:"K", topic:"20", goal:4,
        a:{ prompt:"What is the horizontal asymptote of `y = {5x + 1}/{2x - 3}`?",
          options:[
            { t:"`y = 5/2`", ok:true, why:"`a/c`: for large `|x|`, `{5x}/{2x} = 5/2`." },
            { t:"`y = -1/3`", why:"That’s `b/d`. For large `|x|`, only `5x` and `2x` matter: `y → 5/2`." },
            { t:"`y = 3/2`", why:"That’s the vertical asymptote’s `x`." },
            { t:"`y = 0`", why:"The degrees are equal, so the asymptote isn’t `y = 0`." }] },
        b:{ prompt:"What is the horizontal asymptote of `y = {-4x + 3}/{3x + 1}`?",
          options:[
            { t:"`y = -4/3`", ok:true, why:"`a/c`: for large `|x|`, `{-4x}/{3x} = -4/3`." },
            { t:"`y = 3`", why:"That’s `b/d`. For large `|x|`, only `-4x` and `3x` matter: `y → -4/3`." },
            { t:"`y = -1/3`", why:"That’s the vertical asymptote’s `x`." },
            { t:"`y = 0`", why:"The degrees are equal, so the asymptote isn’t `y = 0`." }] } },
      { id:"f4", cat:"K", topic:"21", goal:5,
        a:{ prompt:"Where is the hole in `y = {x^2 - 4}/{x + 2}`?",
          options:[
            { t:"`(-2, -4)`", ok:true, why:"`y = x - 2` for `x ≠ -2`, and `-2 - 2 = -4`." },
            { t:"`(-2, 0)`", why:"The hole’s height is `-2 - 2`." },
            { t:"`(2, 0)`", why:"That’s the `x`-intercept." },
            { t:"There’s a vertical asymptote at `x = -2` instead", why:M1 }] },
        b:{ prompt:"Where is the hole in `y = {x^2 - 9}/{x - 3}`?",
          options:[
            { t:"`(3, 6)`", ok:true, why:"`y = x + 3` for `x ≠ 3`, and `3 + 3 = 6`." },
            { t:"`(3, 0)`", why:"The hole’s height is `3 + 3`." },
            { t:"`(-3, 0)`", why:"That’s the `x`-intercept." },
            { t:"There’s a vertical asymptote at `x = 3` instead", why:M1 }] } },
      { id:"f5", cat:"T", topic:"19", goal:3,
        a:{ prompt:"`y = {1}/{x^2 - 6x + 5}`. Which describes the graph between its vertical asymptotes?",
          options:[
            { t:"Below the axis, with a local maximum at `(3, -1/4)`", ok:true, why:"`(x - 1)(x - 5)`; vertex `(3, -4)`; `1/(-4)`." },
            { t:"Below the axis, with a local maximum at `(3, -4)`", why:M6 },
            { t:"Above the axis, with a local minimum at `(3, 1/4)`", why:"The quadratic is negative between its zeros." },
            { t:"Below the axis, with a local minimum at `(3, -1/4)`", why:"The largest denominator in size gives the value closest to 0: a maximum." }] },
        b:{ prompt:"`y = {1}/{x^2 - 4x - 5}`. Which describes the graph between its vertical asymptotes?",
          options:[
            { t:"Below the axis, with a local maximum at `(2, -1/9)`", ok:true, why:"`(x - 5)(x + 1)`; vertex `(2, -9)`; `1/(-9)`." },
            { t:"Below the axis, with a local maximum at `(2, -9)`", why:M6 },
            { t:"Above the axis, with a local minimum at `(2, 1/9)`", why:"The quadratic is negative between its zeros." },
            { t:"Below the axis, with a local minimum at `(2, -1/9)`", why:"The largest denominator in size gives the value closest to 0: a maximum." }] } },
      { id:"f6", cat:"T", topic:"21", goal:5,
        a:{ prompt:"What is the oblique asymptote of `y = {2x^2 + 3x - 4}/{x + 2}`?",
          options:[
            { t:"`y = 2x - 1`", ok:true, why:"`2x^2 + 3x - 4 = (x + 2)(2x - 1) - 2`." },
            { t:"`y = 2x + 3`", why:"That copies coefficients without dividing." },
            { t:"`y = 2x + 7`", why:"Synthetic division uses −2, not 2." },
            { t:"`y = 2x`", why:"The quotient has a constant term too." }] },
        b:{ prompt:"What is the oblique asymptote of `y = {3x^2 - x + 2}/{x - 1}`?",
          options:[
            { t:"`y = 3x + 2`", ok:true, why:"`(x - 1)(3x + 2) + 4`." },
            { t:"`y = 3x - 1`", why:"That copies coefficients without dividing." },
            { t:"`y = 3x - 4`", why:"Synthetic division uses +1, not −1." },
            { t:"`y = 3x`", why:"The quotient has a constant term too." }] } },
      { id:"f7", cat:"T", topic:"22", goal:6,
        a:{ prompt:"Solve `{x}/{x - 3} = {3}/{x - 3} + 2`.",
          options:[
            { t:"No solution: the only candidate, `x = 3`, is a restriction", ok:true, why:"`x = 3 + 2(x - 3)` gives `x = 3`, which makes the denominators 0." },
            { t:"`x = 3`", why:M4 },
            { t:"`x = 0`", why:"Check: `0 ≠ -1 + 2`." },
            { t:"`x = -3`", why:"Check: `-3/(-6) ≠ 3/(-6) + 2`." }] },
        b:{ prompt:"Solve `{x}/{x + 2} = {-2}/{x + 2} + 4`.",
          options:[
            { t:"No solution: the only candidate, `x = -2`, is a restriction", ok:true, why:"`x = -2 + 4(x + 2)` gives `x = -2`." },
            { t:"`x = -2`", why:M4 },
            { t:"`x = 0`", why:"Check: `0 ≠ -1 + 4`." },
            { t:"`x = 2`", why:"Check: `2/4 ≠ -2/4 + 4`." }] } },
      { id:"f8", cat:"T", topic:"20", goal:4,
        a:{ prompt:"`y = {ax + 4}/{x - 2}` has horizontal asymptote `y = 3`. What is its `x`-intercept?",
          options:[
            { t:"`-4/3`", ok:true, why:"`a = 3`, so `3x + 4 = 0`." },
            { t:"`4/3`", why:"`3x + 4 = 0` gives a negative `x`." },
            { t:"−4", why:"Don’t forget `a = 3`: `ax + 4 = 0`." },
            { t:"2", why:"That’s the vertical asymptote." }] },
        b:{ prompt:"`y = {ax - 6}/{x + 1}` has horizontal asymptote `y = 2`. What is its `x`-intercept?",
          options:[
            { t:"3", ok:true, why:"`a = 2`, so `2x - 6 = 0`." },
            { t:"−3", why:"`2x - 6 = 0` gives a positive `x`." },
            { t:"6", why:"Don’t forget `a = 2`: `ax - 6 = 0`." },
            { t:"−1", why:"That’s the vertical asymptote." }] } },
      { id:"f9", cat:"C", topic:"17", goal:1,
        a:{ prompt:"Which best explains why `y = {1}/{x^2}` has a vertical asymptote at `x = 0` and not a hole?",
          options:[
            { t:"“As `x` gets close to 0, the denominator gets close to 0 while the numerator stays 1, so `|y|` grows without bound.”", ok:true, why:"Nothing cancels the zero of the denominator, so the values blow up: an asymptote, not a hole." },
            { t:"“Because 0 isn’t in the domain.”", why:"Holes are also outside the domain." },
            { t:"“Because the graph crosses `x = 0`.”", why:"It never touches `x = 0`." },
            { t:"“Because `x^2` has a factor `x` that cancels.”", why:"Nothing cancels with 1." }] },
        b:{ prompt:"Which best explains why `y = {x^2 + 1}/{x^2}` has horizontal asymptote `y = 1`?",
          options:[
            { t:"“For large `|x|`, `x^2 + 1` and `x^2` are almost equal, so their ratio approaches 1.”", ok:true, why:"Equal degrees: the ratio of the leading coefficients is `1/1 = 1`." },
            { t:"“Because the numerator’s constant is 1.”", why:"Constants don’t decide the far-out behaviour." },
            { t:"“Because `y = 1` when `x = 0`.”", why:"`y` is undefined at 0." },
            { t:"“Because the degrees are different.”", why:"They’re equal (2 and 2)." }] } },
      { id:"f10", cat:"C", topic:"22", goal:6,
        a:{ prompt:"Which is the correct start to solving `{x + 1}/{x - 2} > 0`?",
          options:[
            { t:"“Mark `x = -1` (numerator 0) and `x = 2` (excluded), then test the sign on each interval.”", ok:true, why:"The sign can change only at the zeros of the top and the bottom, so a sign chart finds every interval." },
            { t:"“Multiply both sides by `(x - 2)`.”", why:"Its sign changes at 2." },
            { t:"“Solve `x + 1 > 0`.”", why:"That ignores the denominator’s sign." },
            { t:"“Cross-multiply to get `x + 1 > x - 2`.”", why:"There’s no second fraction to cross-multiply with." }] },
        b:{ prompt:"Which is the correct start to solving `{x - 4}/{x + 1} ≤ 0`?",
          options:[
            { t:"“Mark `x = 4` (numerator 0, included) and `x = -1` (excluded), then test the sign on each interval.”", ok:true, why:"The sign can change only at 4 and −1; ≤ includes the zero, and the restriction gets a round bracket." },
            { t:"“Multiply both sides by `(x + 1)`.”", why:"Its sign changes at −1." },
            { t:"“Solve `x - 4 ≤ 0`.”", why:"That ignores the denominator’s sign." },
            { t:"“Include both critical values, because of ≤.”", why:"−1 is a restriction." }] } },
      { id:"f11", cat:"C", topic:"23", goal:7,
        a:{ prompt:"A drug’s concentration in the blood is `C(t) = {10t}/{t^2 + 4}` mg/L after `t` hours. Which best describes the meaning of its horizontal asymptote `y = 0`?",
          options:[
            { t:"“In the long run the drug clears from the blood: the concentration approaches 0 but stays positive.”", ok:true, why:"Degree 1 over degree 2, so `C(t) → 0`, but `10t > 0` for every `t > 0`." },
            { t:"“The concentration is 0 at `t = 0` and stays 0.”", why:"`C` rises first, then falls." },
            { t:"“After some time the concentration reaches exactly 0.”", why:"An asymptote is approached but never reached: the concentration gets closer and closer to 0 but never equals it." },
            { t:"“The drug never enters the blood.”", why:"`C(2) = 2.5 > 0`." }] },
        b:{ prompt:"The average cost per item is `C(n) = {900 + 6n}/{n}` dollars. Which best describes the meaning of its horizontal asymptote `y = 6`?",
          options:[
            { t:"“As production grows, the average cost approaches $6 per item but never reaches it.”", ok:true, why:"`C(n) = {900}/{n} + 6`, and `{900}/{n}` gets close to 0 but is never 0." },
            { t:"“Making 6 items costs $900.”", why:"That isn’t what the asymptote says." },
            { t:"“With enough items, the average cost is exactly $6.”", why:"An asymptote is approached but never reached: the average cost gets closer and closer to $6 but never equals it." },
            { t:"“The fixed cost is $6.”", why:"The fixed cost is $900." }] } },
      { id:"f12", cat:"A", topic:"23", goal:7,
        a:{ fixedOrder:true,   // numbers in increasing order (133⅓ is not plain numeric, so the build would shuffle)
          prompt:"Average cost `C(n) = {2000 + 15n}/{n}` dollars per item. How many items make the average cost $25?",
          options:[
            { t:"50", why:"Check: `(2000 + 750)/50 = 55`." },
            { t:"80", why:"That ignores `15n`: 2000 ÷ 25." },
            { t:"133⅓", why:"That’s 2000 ÷ 15." },
            { t:"200", ok:true, why:"`2000 + 15n = 25n`." }] },
        b:{ prompt:"Average cost `C(n) = {900 + 6n}/{n}` dollars. How many items make the average cost $9?",
          options:[
            { t:"300", ok:true, why:"`900 + 6n = 9n`." },
            { t:"100", why:"That ignores `6n`: 900 ÷ 9." },
            { t:"150", why:"That’s 900 ÷ 6." },
            { t:"60", why:"Check: `(900 + 360)/60 = 21`." }] } },
      { id:"f13", cat:"A", topic:"22", goal:6,
        a:{ prompt:"One pump fills a tank in `t` hours; a slower pump takes `t + 3` hours. Together they take 2 hours. Find `t`.",
          options:[
            { t:"3 hours", ok:true, why:"`1/t + 1/(t + 3) = 1/2` gives `t^2 - t - 6 = 0`, so `t = 3` (reject −2)." },
            { t:"3 hours or −2 hours", why:"A time can’t be negative." },
            { t:"1 hour", why:"Check: `1 + 1/4 ≠ 1/2`." },
            { t:"6 hours", why:"Check: `1/6 + 1/9 ≠ 1/2`." }] },
        b:{ prompt:"One pump fills a tank in `t` hours; a slower pump takes `t + 5` hours. Together they take 6 hours. Find `t`.",
          options:[
            { t:"10 hours", ok:true, why:"`t^2 - 7t - 30 = 0` gives `t = 10` (reject −3)." },
            { t:"10 hours or −3 hours", why:"A time can’t be negative." },
            { t:"15 hours", why:"Check: `1/15 + 1/20 ≠ 1/6`." },
            { t:"6 hours", why:"Together they’d be faster than either alone." }] } },
      { id:"f14", cat:"A", topic:"18", goal:2,
        a:{ prompt:"A tank drains in `T(r) = {60}/{r - 5}` minutes when the pump removes `r` L/min (`r > 5`; water also flows in at 5 L/min). Which describes the vertical asymptote and `T(17)`?",
          options:[
            { t:"At `r = 5` the pump only matches the inflow, so the tank never drains; `T(17) = 5` min", ok:true, why:"`r - 5 = 0` at `r = 5`, and near it `T` is huge. `T(17) = 60/12 = 5`." },
            { t:"At `r = 5` the tank drains instantly; `T(17) = 5` min", why:"Near `r = 5`, `T` is huge." },
            { t:"At `r = 60` the tank never drains; `T(17) = 12` min", why:"The asymptote is where `r - 5 = 0`." },
            { t:"At `r = 5` the tank never drains; `T(17) = 60/17` min", why:"Use `r - 5 = 12`." }] },
        b:{ prompt:"`T(r) = {48}/{r - 3}` minutes, with inflow 3 L/min. Which describes the vertical asymptote and `T(11)`?",
          options:[
            { t:"At `r = 3` the pump only matches the inflow, so the tank never drains; `T(11) = 6` min", ok:true, why:"`r - 3 = 0` at `r = 3`, and near it `T` is huge. `T(11) = 48/8 = 6`." },
            { t:"At `r = 3` the tank drains instantly; `T(11) = 6` min", why:"Near `r = 3`, `T` is huge." },
            { t:"At `r = 48` the tank never drains; `T(11) = 16` min", why:"The asymptote is where `r - 3 = 0`." },
            { t:"At `r = 3` the tank never drains; `T(11) = 48/11` min", why:"Use `r - 3 = 8`." }] } },
      { id:"f15", cat:"A", topic:"19", goal:3,
        a:{ prompt:"A signal’s strength along a road is `S(x) = {20}/{x^2 - 4x + 8}` units, `x` km from a town. Where is it strongest, and how strong?",
          options:[
            { t:"At `x = 2` km, strength 5", ok:true, why:"`x^2 - 4x + 8 = (x - 2)^2 + 4`, smallest (4) at `x = 2`; `20/4 = 5`." },
            { t:"At `x = 2` km, strength 4", why:"4 is the denominator’s minimum; take 20 ÷ 4." },
            { t:"At `x = 4` km, strength 2.5", why:"The vertex is at `x = 2`." },
            { t:"At `x = 0` km, strength 2.5", why:"`S(0) = 20/8`, but it’s stronger at `x = 2`." }] },
        b:{ prompt:"`S(x) = {30}/{x^2 + 6x + 15}`. Where is it strongest, and how strong?",
          options:[
            { t:"At `x = -3`, strength 5", ok:true, why:"`(x + 3)^2 + 6`, smallest (6) at `x = -3`." },
            { t:"At `x = -3`, strength 6", why:"6 is the denominator’s minimum; take 30 ÷ 6." },
            { t:"At `x = 3`, strength 5", why:"The vertex is at `x = -3`." },
            { t:"At `x = 0`, strength 2", why:"`S(0) = 30/15`." }] } }
    ]
  },

  task:{
    title:"Build a rational function to spec", summary:"Build a rational function to spec",
    statement:"<p>Use the factor tiles to build `f(x) = a ×` (numerator factors) / (denominator factors). Meet every check. Each comes from a different module. There’s more than one answer.</p>" +
      "<ol class=\"pt-conds\"><li>Exactly one vertical asymptote: `x = 2`. (modules 17, 18 and 20)</li><li>Horizontal asymptote `y = 3`. (module 20)</li>" +
      "<li>Exactly one hole, at a negative `x`-value. (module 21)</li><li>`f(x) ≤ 0` exactly on `(2, 4]`. (module 22)</li></ol>",
    checks:["The only uncancelled denominator zero is 2", "`y → 3` as `x → ±∞`", "Exactly one cancelled factor, at `r < 0`", "The solution set of `f(x) ≤ 0` (holes excluded) is `(2, 4]`"],
    tips:["A vertical asymptote comes from a denominator factor that doesn’t cancel: you need `(x - 2)` there, and no other uncancelled factor.",
      "Equal degrees: the asymptote is the ratio of leading coefficients, here `a`.",
      "A hole needs the same factor top and bottom.",
      "`{3(x - p)}/{x - 2} ≤ 0` between 2 and `p`: choose `p`."],
    tipNow:["Right now the uncancelled denominator zeros are {v}.", "Right now {far}.", "Right now the holes are {h}.", "Right now `f(x) ≤ 0` on {s}."],
    ui:{ how:"Set `a` with the − and + buttons. Each tile is a factor `(x - r)`: change `r` with its − and + buttons (whole numbers from −6 to 6). Use Add a factor and × to add or remove tiles.",
      top:"Numerator", bottom:"Denominator", constant:"a", dec:"one less", inc:"one more", remove:"Remove", addTile:"Add a factor",
      preview:"Your function", signTitle:"Sign chart of `f(x)`",
      rows:{ va:"Vertical asymptotes", far:"Far out", holes:"Holes", le0:"`f(x) ≤ 0` on" },
      none:"none", farZero:"`y → 0`: horizontal asymptote `y = 0`", farEq:"`y → §1`: horizontal asymptote `y = §1`", farOb:"no horizontal asymptote (oblique asymptote §1)", farConst:"`f` is the constant §1 (with holes), so `y → §1`",
      farPoly:"no horizontal asymptote (`f` simplifies to a polynomial)", empty:"the empty set",
      sx:"`x`", sf:"sign of `f(x)`", va:"VA", hole:"hole" },
    explainPrompt:"Explain how each check told you one part of your equation.",
    success:"Your function meets all four checks.",
    more:"There’s more than one answer. Can you find another?",
    all6:"That’s all six: `{3(x - 4)(x - h)}/{(x - 2)(x - h)}` with `h` = −1, −2, −3, −4, −5 or −6."
  },

  cards:[
    ["Domain of a rational function", "All reals except the zeros of the denominator."],
    ["Vertical asymptote", "A denominator zero whose factor doesn’t cancel."],
    ["Hole", "A factor that cancels: an open circle at (`a`, simplified value)."],
    ["Horizontal asymptote by degrees", "Numerator lower: `y = 0`. Equal: ratio of leading coefficients. Higher by one: oblique (divide)."],
    ["`{ax + b}/{cx + d}`", "Vertical `x = -d/c`; horizontal `y = a/c`."],
    ["`{1}/{kx - c}`", "The line’s zero `c/k` becomes the vertical asymptote; horizontal `y = 0`."],
    ["Reciprocal of a quadratic", "Two, one or no zeros → two, one or no vertical asymptotes; vertex `(h, q)` → `(h, 1/q)`."],
    ["Oblique asymptote", "Divide; the quotient (without the remainder) is the line."],
    ["One-sided behaviour", "Near `x = a`: test a value just left and just right; write `x → a^{-}`, `y → …`"],
    ["Rational equations", "Restrictions first; multiply by the common denominator; reject extraneous roots."],
    ["Rational inequalities", "Zeros of top and bottom on a sign chart; restrictions always get round brackets."],
    ["Don’t multiply by `x - 2`", "Its sign changes at 2; use a sign chart instead."],
    ["Asymptotes in context", "A long-run value that’s approached, not reached (average cost → $4)."]
  ]
};
