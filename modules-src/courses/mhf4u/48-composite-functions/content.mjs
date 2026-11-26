// MHF4U 48 Composite Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/48-composite-functions.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';
const O = " ∘ ";                    // thin space either side of ∘
const FOG = (a, b, x) => "(" + a + O + b + ")(" + x + ")";

// small table for Final K1: x row, f row, g row
const tbl = (fr, gr) => '<div class="tbl-wrap" style="margin-top:10px;max-width:420px"><table class="vt"><thead><tr><th scope="col">`x`</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th><th scope="col">5</th></tr></thead><tbody>' +
  "<tr><td>`f(x)`</td>" + fr.map(v => "<td>" + v + "</td>").join("") + "</tr><tr><td>`g(x)`</td>" + gr.map(v => "<td>" + v + "</td>").join("") + "</tr></tbody></table></div>";

// ---------- Practice 1 (domain sorter) feedback builders ----------
const SIMPLIFIED = "Decide the domain <strong>before</strong> you simplify. `(√{x - 2})^2` simplifies to `x - 2`, but `x = 0` never gets through `√{x - 2}`.";
const edgeOut = w => "Test the edge, `x = 2`: " + w + ". So 2 is out.";
const edgeIn = w => "Test the edge, `x = 2`: " + w + ". So 2 is in.";
const below = w => "Try `x = 0`: " + w + ". Numbers below 2 are fine; only `x = 2` fails.";
const restricted = (x, w) => "Try `x = " + x + "`: " + w + ". Something is excluded.";
const free = (x, w) => "Try `x = " + x + "`: " + w + ". Neither machine rejects anything here.";
const belowToo = w => "Try `x = 0`: " + w + ". Numbers below 2 are excluded too.";
const pair = (f, g) => "`f(x) = " + f + "`, `g(x) = " + g + "`";
const sItem = (id, f, g, box, why, hints, wrong) => ({ id, t:pair(f, g), answer:box, why, hints, wrong });

export default {
  id:"48-composite-functions",
  kind:"topic",
  title:"Composite functions",
  topic:"Composite Functions",
  readyTopic:"composite functions",
  hero:{
    eq:'<span class="m">(<i>f</i>' + O + '<i>g</i>)(<i>x</i>) = <span class="cf-uf"><i>f</i>(</span><span class="cf-ug"><i>g</i>(<i>x</i>)</span><span class="cf-uf">)</span></span>',
    eqLabel:"f composed with g of x equals f of g of x", eqSize:"md",
    headline:"One function’s output is the next one’s input",
    text:"A <strong>composite function</strong> runs two functions one after the other, like two machines on an assembly line. In `f(g(x))`, the <strong>inner</strong> function `g` acts first, and the <strong>outer</strong> function `f` acts on what comes out. Change the order and you usually get a different function. And a number only makes it through if <strong>both</strong> machines can accept it, which is what decides the <strong>domain</strong> of the composite.",
    caps:["`f(g(2)) = f(3) = 9`", "`g(f(2)) = g(4) = 5`", "Same two functions, different order: `f(g(x)) ≠ g(f(x))`"],
    fig:{ html:'<div class="cf-hero"><div class="cf-strip cf-hs" id="cf-hstrip" aria-hidden="true"></div><canvas class="plot" id="hero-plot" role="img" aria-label="Two machines, g adds 1 and f squares. The input 2 becomes 3, then 9, so f of g of 2 is 9, on the curve y = (x + 1) squared. Swapped, 2 becomes 4, then 5, on the dashed curve y = x squared + 1."></canvas></div>' }
  },
  goals:[
    "I can evaluate a composite such as `f(g(3))` from equations, tables and graphs, working from the inside out, and work backwards to find an input.",
    "I can find the equation of `f(g(x))` and `g(f(x))` by substitution and show that, in general, `f(g(x)) ≠ g(f(x))`.",
    "I can find the domain and range of a composite function, including restrictions that a simplified formula hides.",
    "I can decompose a function into an inner and an outer function, `h(x) = f(g(x))`, in more than one way.",
    "I can explain why a function composed with its inverse gives back the input, and on which domain.",
    "I can describe a transformation as a composition with a linear function: inside changes are horizontal, outside changes are vertical, and I can use composition to solve problems in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Function notation", goal:1,
          prompt:"`f(x) = x^2 - 3x`. What is `f(-2)`?",
          options:[
            { t:"10", ok:true, why:"Replace `x` with (−2): `(-2)^2 - 3(-2) = 4 + 6 = 10`." },
            { t:"−10", why:"`(-2)^2 = (-2)(-2) = +4`, and `-3 × (-2) = +6`. So `f(-2) = 4 + 6 = 10`." },
            { t:"−2", why:"A negative times a negative is positive: `-3 × (-2) = +6`, so `4 + 6 = 10`." },
            { t:"2", why:"`(-2)^2` means `(-2)(-2) = 4`. Writing `-2^2` without brackets is what gives −4." }],
          hints:["Put (−2) in brackets everywhere you see `x`.", "`f(-2) = (-2)^2 - 3(-2)`.", "`(-2)^2 = 4` and `-3(-2) = 6`, so `f(-2) = 10`."] },
        { id:"w2", skill:"Function notation", goal:2,
          prompt:"`f(x) = 2x^2 + 1`. Which expression equals `f(x + 3)`?",
          options:[
            { t:"`2x^2 + 12x + 19`", ok:true, why:"Replace `x` with `(x + 3)`: `2(x + 3)^2 + 1 = 2(x^2 + 6x + 9) + 1 = 2x^2 + 12x + 19`. Check with `x = 1`: `f(4) = 33`, and `2 + 12 + 19 = 33`." },
            { t:"`2x^2 + 19`", why:"`(x + 3)^2 = x^2 + 6x + 9`: the middle term `6x` comes from `2 × 3x`. Check with `x = 1`: `f(4) = 33`, but `2 + 19 = 21`." },
            { t:"`2x^2 + 6x + 10`", why:"The 2 multiplies the whole bracket: `2(x^2 + 6x + 9) = 2x^2 + 12x + 18`. Check with `x = 1`: 33, not 18." },
            { t:"`2x^2 + 4`", why:"`f(x + 3)` changes the <strong>input</strong>: every `x` becomes `x + 3`. `f(x) + 3` would add 3 to the output instead. Check with `x = 1`: 33, not 6." }],
          hints:["Replace every `x` in `f` with `(x + 3)`, brackets included.", "`f(x + 3) = 2(x + 3)^2 + 1`. Expand `(x + 3)^2` first.", "`(x + 3)^2 = x^2 + 6x + 9`, so `2(x^2 + 6x + 9) + 1 = 2x^2 + 12x + 19`."] },
        { id:"w3", skill:"Domain and range", goal:3,
          prompt:"What is the domain of `y = √{x - 4}`?",
          options:[
            { t:"`{x ∈ ℝ | x ≥ 4}`", ok:true, why:"The expression under the root must not be negative: `x - 4 ≥ 0`, so `x ≥ 4`. At `x = 4` the root is `√0 = 0`, which is fine." },
            { t:"`{x ∈ ℝ | x > 4}`", why:"`√0 = 0` is a real number, so `x = 4` is allowed." },
            { t:"`{x ∈ ℝ | x ≥ -4}`", why:"Try `x = 0`: `√{0 - 4} = √{-4}` isn’t real. `x - 4 ≥ 0` gives `x ≥ 4`." },
            { t:"`{x ∈ ℝ | x ≥ 0}`", why:"That’s the domain of `√x`. Here the input to the root is `x - 4`, and it must be at least 0." }],
          hints:["What must be true about the number under a square root?", "`x - 4 ≥ 0`.", "`x ≥ 4`, so the domain is `{x ∈ ℝ | x ≥ 4}`."] },
        { id:"w4", skill:"Domain and range", goal:3,
          prompt:"What is the range of `y = x^2 + 1`?",
          options:[
            { t:"`{y ∈ ℝ | y ≥ 1}`", ok:true, why:"`x^2` is never negative, so `x^2 + 1` is never less than 1, and `x = 0` gives exactly 1. Every larger value is reached too." },
            { t:"`{y ∈ ℝ | y ≥ 0}`", why:"The + 1 lifts every output by 1. `y = 0` would need `x^2 = -1`." },
            { t:"`{y ∈ ℝ}`", why:"Every `x` is allowed (that’s the domain), but the outputs never go below 1." },
            { t:"`{y ∈ ℝ | y > 1}`", why:"`x = 0` gives `y = 1`, so 1 is in the range." }],
          hints:["What’s the smallest value `x^2` can take?", "`x^2 ≥ 0`, with `x^2 = 0` at `x = 0`.", "So `x^2 + 1 ≥ 1`, and 1 is reached at `x = 0`: the range is `{y ∈ ℝ | y ≥ 1}`."] },
        { id:"w5", skill:"Inverse functions", goal:5,
          prompt:"`f(x) = {x + 4}/{2}`. What is `f^{-1}(x)`?",
          options:[
            { t:"`2x - 4`", ok:true, why:"`f` adds 4, then halves. The inverse undoes those steps in reverse order: double, then subtract 4. Check: `f(6) = 5`, and `2(5) - 4 = 6`." },
            { t:"`2x + 4`", why:"To undo “add 4” you subtract 4. Check: `f(6) = 5`, but `2(5) + 4 = 14`, not 6." },
            { t:"`2x - 8`", why:"`f` added 4 first, so the inverse must undo that <strong>last</strong>. Check: `f(6) = 5`, but `2(5) - 8 = 2`." },
            { t:"`{2}/{x + 4}`", why:"That’s `1/f(x)`. The −1 in `f^{-1}` means “undo”, not “one over”. Check: `f(6) = 5`, but `{2}/{5 + 4} = {2}/{9}`." }],
          hints:["Write `y = {x + 4}/{2}`, swap `x` and `y`, then solve for `y`.", "`x = {y + 4}/{2}`, so `2x = y + 4`.", "`y = 2x - 4`, so `f^{-1}(x) = 2x - 4`."] },
        { id:"w6", skill:"Transformations", goal:6,
          prompt:"How does the graph of `y = f(2x)` compare with the graph of `y = f(x)`?",
          options:[
            { t:"A horizontal compression by a factor of 1/2", ok:true, why:"`f(2x)` reaches each output at half the `x`-value: the point `(4, f(4))` on `y = f(x)` becomes `(2, f(4))`. Every `x`-coordinate is halved." },
            { t:"A horizontal stretch by a factor of 2", why:"Inside the brackets the effect is reversed: multiplying `x` by 2 gets to each output twice as fast, so the graph squeezes toward the `y`-axis." },
            { t:"A vertical stretch by a factor of 2", why:"That’s `2f(x)`, with the 2 outside. Inside, the 2 changes the `x`-values." },
            { t:"A vertical compression by a factor of 1/2", why:"Nothing outside `f` changed, so the `y`-values aren’t scaled. The `x`-values are halved." }],
          hints:["Is the 2 inside the brackets (acting on `x`) or outside (acting on `f(x)`)?", "Inside, so the change is horizontal. Which `x` gives the same output as `x = 4` did before?", "`f(2 · 2) = f(4)`, so the point at `x = 4` moves to `x = 2`: a horizontal compression by a factor of 1/2."] }
      ],
      refreshers:{
        "Function notation":"`f(a)` means “replace every `x` in `f`’s formula with `a`”, in brackets. With `f(x) = x^2 - 3x`: `f(-2) = (-2)^2 - 3(-2) = 10`. The same works for expressions: `f(x + 3)` replaces every `x` with `(x + 3)`, so for `f(x) = 2x^2 + 1` it’s `2(x + 3)^2 + 1 = 2x^2 + 12x + 19`. Check by trying a number.",
        "Domain and range":"The domain is every input the formula accepts. Watch for three things: a square root needs a non-negative number (`√{x - 4}` needs `x ≥ 4`), a fraction can’t have 0 on the bottom, and a logarithm needs a positive input. The range is every output: `x^2 + 1` is never below 1, so its range is `{y ∈ ℝ | y ≥ 1}`.",
        "Inverse functions":"`f^{-1}` undoes `f`. To find it, swap `x` and `y` and solve for `y`, or undo the steps in reverse order. `f(x) = {x + 4}/{2}` adds 4 then halves, so `f^{-1}(x) = 2x - 4` doubles then subtracts 4. Check: `f(6) = 5` and `f^{-1}(5) = 6`. `f^{-1}` is not `1/f`.",
        "Transformations":"In `y = af(k(x - d)) + c`, the numbers outside `f` (`a` and `c`) change the graph vertically, as you’d expect. The numbers inside (`k` and `d`) change it horizontally, and the opposite way to how they look: `f(2x)` compresses horizontally by a factor of 1/2, and `f(x - 4)` moves 4 units right."
      }
    }
  },
  explore:{
    heading:"The two-machine pipeline",
    intro:"Pick two functions and send a number through them, one after the other. Watch the output of the first machine become the input of the second, on the machines, on the graphs and in the tables. Then swap the order and see what changes.",
    predictions:[
      { id:"p1", start:{ mode:"formula", f:"sq", g:"p3", order:"fg", x:2, view:"two", ran:true },
        prompt:"`f(g(2)) = 25`. Now the two machines will swap places. What will `g(f(2))` be?",
        options:[{ t:"7", ok:true }, { t:"9" }, { t:"20" }, { t:"25" }],
        explain:"With `f` first, 2 becomes `2^2 = 4`, then `4 + 3 = 7`. The two orders give different functions: `f(g(x)) = (x + 3)^2` and `g(f(x)) = x^2 + 3`. Their graphs meet only where `(x + 3)^2 = x^2 + 3`, which is `6x + 9 = 3`, so `x = -1`. (9 is `f(2) + g(2) = 4 + 5`, a sum; 20 is `f(2) × g(2) = 4 × 5`, a product; 25 assumes the order doesn’t matter.)" },
      { id:"p2", start:{ mode:"formula", f:"rt", g:"m3", order:"fg", x:7, view:"one" },
        prompt:"The trace will draw `f(g(x)) = √{x - 3}` from left to right. Where will the curve begin?",
        options:[{ t:"At (3, 0)", ok:true }, { t:"At (−3, 0)" }, { t:"At (0, 0)" }, { t:"At (0, −3)" }],
        explain:"√ only accepts inputs that are 0 or more, so `g(x) = x - 3` must be at least 0: `x ≥ 3`. The inner function decided where the composite starts. It moved the graph of `√x` 3 units <strong>right</strong>, even though the formula says “− 3”. ((−3, 0) is the shift the wrong way; (0, 0) is where `√x` itself starts; (0, −3) is where `√x - 3` starts, which is `g(f(x))`.)" },
      { id:"p3", start:{ mode:"formula", f:"ex", g:"lg", order:"fg", x:4, view:"one" },
        prompt:"`2^x` and `log_{2} x` are inverses. The trace will draw `f(g(x)) = 2^{log_{2} x}`. What will it look like?",
        options:[{ t:"Part of the line `y = x`: only for `x > 0`", ok:true }, { t:"The whole line `y = x`" }, { t:"The curve `y = 2^x`" }, { t:"The horizontal line `y = 1`" }],
        explain:"Each function undoes the other, so every input comes back unchanged: `2^{log_{2} x} = x`. But `log_{2}` acts first here, and it only accepts `x > 0`, so the composite is the line `y = x` for `x > 0` only. In the other order, `2^x` acts first and accepts every number, so `log_{2}(2^x) = x` for every `x`. A function composed with its inverse gives back the input, on the domain of the function that acts first. (It’s never the line `y = 1`: `f^{-1}` isn’t `1/f`.)" },
      { id:"p4", start:{ mode:"formula", f:"rt", g:"sq", order:"fg", x:4, view:"one", traced:[0, 9] },
        prompt:"For `x ≥ 0`, `√{x^2}` matched the line `y = x`. The trace will now continue from `x = 0` down to `x = -5`. What will the curve do?",
        options:[{ t:"Rise to the left, along the line `y = -x`", ok:true }, { t:"Continue along `y = x`, below the `x`-axis" }, { t:"Stop: `√{x^2}` is undefined for `x < 0`" }, { t:"Follow the parabola `y = x^2`" }],
        explain:"Squaring makes −3 into 9, and `√9 = 3`, the <strong>non-negative</strong> root. So `√{(-3)^2} = 3`, not −3. `√{x^2}` equals `x` when `x ≥ 0` and `-x` when `x < 0`: squaring and square-rooting undo each other only for `x ≥ 0`. (It isn’t undefined: `x^2` is never negative, so √ always accepts it.)" }
    ],
    chalIntro:"Set the pipeline, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1,
        prompt:"Table machines, with `f` outside and `g` inside. Send the row whose final output is 4.",
        why:"`g(1) = -1` and `f(-1) = 4`, so `f(g(1)) = 4`. Working backwards: `f` turns −1 into 4, and `g` turns 1 into −1.",
        msgs:{
          mode:"Switch to Table machines first.",
          pair:"Set the outer machine to `f` and the inner machine to `g`.",
          swapped:"That’s `g(f(x))`. Put `f` outside and `g` inside.",
          none:"Send a row first: tap a row of the inner table.",
          rowM1:"That row gives `f(g(-1)) = f(1) = 0`. You may have found where `f` gives 4, which is `f(-1)`. But −1 has to come <strong>out of</strong> `g`: which `x` has `g(x) = -1`?",
          row3:"`g(3) = 5`, and 5 isn’t an input in `f`’s table, so `f(g(3))` doesn’t exist.",
          other:"That row gives `f(g(#1)) = #2`. Work backwards: which input does `f` turn into 4?" },
        hints:["Work backwards from the end: which input does `f` turn into 4?", "`f(-1) = 4`. So you need `g(x) = -1`.", "`g(1) = -1`, so send `x = 1`: `f(g(1)) = f(-1) = 4`."] },
      { id:"tc2", goal:3,
        prompt:"Formula machines. Choose `f`, `g` and the order so that the composite’s domain is exactly `{x ∈ ℝ | x ≥ 1}`. <span class=\"cf-pnote\">(The readout hides its Domain rows until you meet this challenge. The trace still works.)</span>",
        why:"`log_{2} x ≥ 0` exactly when `x ≥ 1`, because `log_{2} 1 = 0`. So `√{log_{2} x}` has domain `{x ∈ ℝ | x ≥ 1}`.",
        msgs:{
          mode:"Switch to Formula machines first.",
          lglg:"So close. Its domain is `x > 1`: at `x = 1`, `log_{2} 1 = 0`, and `log_{2} 0` is undefined. Which outer machine accepts 0?",
          rtm3:"Its domain is `x ≥ 3`. You need the edge at 1, not 3. None of the shifts puts it there.",
          lgout:"Its domain is `x > 0`: the outer machine accepts every output of `log_{2} x` (or of `√x`). You need an outer machine that rejects some of them.",
          other:"Your composite’s domain is #1. You need a first machine whose output is 0 or more exactly when `x ≥ 1`." },
        hints:["“≥” means the edge, `x = 1`, is included. Which machine accepts 0 but rejects negatives?", "`√x` needs an input of 0 or more. So you need an inner machine whose output is 0 or more exactly when `x ≥ 1`.", "`log_{2} x ≥ 0` exactly when `x ≥ 1`, because `log_{2} 1 = 0`. So `f = √x`, `g = log_{2} x`, order `f(g(x))`: `√{log_{2} x}`."] },
      { id:"tc3", goal:2, stretch:true,
        prompt:"Commit, then trace. Find two <strong>different</strong> machines `f` and `g` whose composites in both orders draw <strong>exactly the same graph</strong>: the same outputs, and undefined at the same inputs.<div class=\"cf-commit\" data-cf-commit></div>",
        why:"Both orders give the same output wherever either is defined. The three pairs that work are {`x + 3`, `x - 3`}, {`x^2`, `1/x`} and {`√x`, `1/x`}.",
        commit:{ label:"Before you check:", match:"I think the traces will match", differ:"I think they’ll differ", need:"Choose one before you check. (It’s recorded, not scored.)", said:"You said: #1." },
        msgs:{
          mode:"Switch to Formula machines first.",
          explog:"These are inverses, so both orders give back `x` wherever they’re defined. But `2^{log_{2} x}` exists only for `x > 0`, while `log_{2}(2^x)` exists for every `x`: one graph is half a line, the other the whole line.",
          sqrt:"`√{x^2}` is a V defined for every `x`; `(√x)^2` is the line `y = x` for `x ≥ 0` only. Different graphs.",
          shiftsq:"`(x + 3)^2` and `x^2 + 3` (or `(x - 3)^2` and `x^2 - 3`) meet at just one point. A shift and a square don’t commute.",
          same:"Choose two different machines.",
          other:"Compare the two traces where they separate: at that `x`, the outputs differ, or one exists and the other doesn’t." },
        hints:["Both orders must give the same output at every input, and be undefined at the same inputs. Inverse pairs are tempting, but check their domains.", "Look for two machines that don’t interfere with each other: a shift up and a shift down, or a reciprocal together with a power.", "`x + 3` with `x - 3`: both orders give `x` for every `x`. `1/x` with `x^2`: `(1/x)^2 = 1/x^2` for `x ≠ 0`. `1/x` with `√x`: `√{1/x} = 1/√x` for `x > 0`."] }
    ],
    ui:{
      modes:["Formula machines", "Table machines"], orders:["`f(g(x))`", "`g(f(x))`"], views:["Two graphs", "One graph"],
      both:"Both orders", run:"Run", trace:"Trace", stop:"Stop", reset:"Reset", fill:"Fill the table", input:"Input `x`",
      outer:"outer:", inner:"inner:", more:"More", less:"Less",
      rows:{ order:"Order", input:"Input", m1:"First machine", m2:"Second machine", result:"Result", other:"Other order", comp:"Composite", dom:"Domain", why:"Why this domain", range:"Range",
        l1:"First lookup", l2:"Second lookup", ctab:"Composite table", pattern:"Pattern" },
      hiddenDom:"Hidden while challenge 2 is open.",
      pattern:"Every input comes back unchanged: `#1 = x` for each `x` in #2’s table.",
      tableNone:"Tap a row of the inner table to send it.",
      notInput:"not an input",
      inLab:"input", outLab:"output", stripLab:"Machine strip", table:"table", innerG:"Inner:", outerG:"Outer:", innerT:"Inner:", outerT:"Outer:", compT:"Composite",
      why:{ rt:"is not a real number", rc:"is undefined", lg0:"is undefined (no power of 2 equals 0)", lgn:"is undefined (every power of 2 is positive)" },
      is:"is", big:"more than 1 000 000", bigNeg:"less than −1 000 000", undefTail:": undefined",
      actsFirst:"#1 acts first, then #2", notIn:"#1 is not in the domain of #2.", isUndef:"is undefined: #1 is not in the domain of #2.",
      lgsqNote:"(not `2 log_{2} x`, which needs `x > 0`)",
      why1:"#1 needs #2.", why1all:"#1 accepts every `x`.", why2all:"#1 accepts every real number, so nothing more is removed.", why2:"#1 needs #2, and #3.",
      tOrder:"look up #1 in #2’s table, then look up #3 in #4’s table", tMiss:"#1 isn’t an input in #2’s table, so #3 is undefined.", tHit:"#1, so #2",
      tDef:"#1 is defined for #2 (#3 of #4 rows).", tDefSoFar:"#1 is defined for #2 (#3 of #4 rows so far).", noRows:"none of the rows sent so far",
      sendLab:"Send x = #1 (#2)", cant:"✗ can’t accept #1",
      notes:{ inner:{ rt:"√x needs x ≥ 0", rc:"1/x needs x ≠ 0", lg:"log_{2} x needs x > 0" }, outer:{ rt:"#1(x) is negative: √ can’t accept it", rc:"#1(x) = 0: 1/x can’t accept it", lg:"#1(x) ≤ 0: log_{2} can’t accept it" } }
    },
    blocks:[{ title:"What the pipeline shows", html:"<p><strong>Composite functions</strong></p><ul>" +
      "<li><strong>`f(g(x)) = " + FOG("f", "g", "x") + "`:</strong> `g` acts first, then `f`. Work from the inside out.</li>" +
      "<li><strong>Order:</strong> `f(g(x))` and `g(f(x))` are usually different.</li>" +
      "<li><strong>Domain of `f(g(x))`:</strong> every `x` in the domain of `g` whose output `g(x)` is in the domain of `f`. Decide it <strong>before</strong> you simplify.</li>" +
      "<li><strong>Inverses:</strong> `f(f^{-1}(x)) = x` for every `x` in the domain of `f^{-1}`, and `f^{-1}(f(x)) = x` for every `x` in the domain of `f`.</li></ul>" }]
  },
  part3:{
    slug:"decompose", name:"Decompose",
    heading:"Inside and outside: decompose it",
    intro:"A linear function can sit inside another function or outside it, and that decides whether the graph moves sideways or up and down. Then take finished functions apart: find every inner and outer pair that builds them.",
    stationA:{
      title:"Station A: Linear inside or outside",
      ui:{ parent:"Parent `f`:", A:"`A` in `L(x) = A(x + B)`", B:"`B`", pos:["Inside: `y = f(L(x))`", "Outside: `y = L(f(x))`"], keys:"Key points",
        rows:{ comp:"Composite", std:"Standard form", what:"What happens", key:"Key point", dom:"Domain", range:"Range" },
        targets:"Targets", check:"Check target", met:"✓ Target met.", notYet:"✗ Not yet.", tally:"#1 of 3 targets on the first try", found:"Found: #1",
        intro:"Pick a target. Set the controls until your graph lies on the faint target curve through the three ringed points, then press <strong>Check target</strong>.",
        with:"with", tName:"Target", inW:"inside", outW:"outside", notFirst:"(not first try)", unfinished:"(unfinished)",
        sumLine:"Station A targets (first try): #1/3", parentFirst:"This target starts from #1. Choose that parent first.",
        what:{ reflY:"reflection in the `y`-axis", hStr:"horizontal stretch by a factor of #1", hComp:"horizontal compression by a factor of #1", left:"a translation #1 #2 left", right:"a translation #1 #2 right",
          reflX:"reflection in the `x`-axis", vStr:"vertical stretch by a factor of #1", vComp:"vertical compression by a factor of #1", up:"a translation #1 #2 up", down:"a translation #1 #2 down",
          unit:"unit", units:"units", then:", then ", none:"No change" } },
      targets:[
        { id:"S1", parent:"rt", prompt:"Turn `y = √x` into the target `y = √{2x + 6}`.", answer:[["in", 2, 3]],
          named:[
            { pos:"in", A:2, B:6, fb:"You shifted 6 units left. Factor the 2 out first: `2x + 6 = 2(x + 3)`, so the shift is 3." },
            { pos:"in", A:1, B:3, fb:"Right shift amount, but the target is also compressed: it reaches height 2 at `x = -1`, not `x = 1`." },
            { pos:"out", A:2, B:3, fb:"Outside, `L` changes the outputs: your graph starts at (0, 6). The target starts at (−3, 0), so the change is horizontal: put `L` inside." }],
          hints:["The target starts at (−3, 0) instead of (0, 0): is that a horizontal or a vertical change?", "Horizontal, so `L` goes inside. Factor: `2x + 6 = 2(x + 3)`.", "Inside, `A = 2`, `B = 3`: compress by a factor of 1/2, then move 3 left."] },
        { id:"S2", parent:"ex", prompt:"Turn `y = 2^x` into the target `y = 2^{x + 1}`. There are <strong>two</strong> different settings that work. Find both.", answer:[["in", 1, 1], ["out", 2, 0]],
          named:[
            { pos:"in", A:1, B:-1, fb:"That’s 1 unit right. `2^{x + 1}` reaches each height one step <strong>sooner</strong>: left." },
            { pos:"out", A:1, B:1, fb:"That moves the graph up 1. The target still approaches 0 on the left, so its asymptote hasn’t moved." }],
          again:"You’ve found that one. The other uses the other position.",
          oneMore:"One found. Now find the other setting and press <strong>Check target</strong> again.",
          both:"`2^{x + 1} = 2 · 2^x`. For an exponential, moving 1 unit left and stretching vertically by 2 give exactly the same graph. Two different compositions, one function.",
          hints:["Exponent law: `2^{x + 1} = 2^1 · 2^x`.", "So the target is `2^x` moved 1 left, <strong>and</strong> it is `2^x` stretched vertically by 2.", "Inside `A = 1`, `B = 1` gives `2^{x + 1}`; outside `A = 2`, `B = 0` gives `2 · 2^x`."] },
        { id:"S3", parent:"rt", prompt:"Turn `y = √x` into the target `y = √{3 - x}`.", answer:[["in", -1, -3]],
          named:[
            { pos:"in", A:-1, B:3, fb:"Your graph starts at (−3, 0) and opens left. The target starts at (3, 0). Factor: `3 - x = -(x - 3)`, so `B = -3`." },
            { pos:"in", A:1, B:-3, fb:"Right starting point, wrong direction: the target opens to the <strong>left</strong>, so it needs a reflection in the `y`-axis." },
            { pos:"out", A:-1, fb:"Outside, `A = -1` flips the graph upside down (a reflection in the `x`-axis). The target flips left-to-right." }],
          hints:["The target opens to the left and starts at (3, 0). Which reflection is that?", "A reflection in the `y`-axis is an inside change with `A = -1`. Factor: `3 - x = -1(x - 3)`.", "Inside, `A = -1`, `B = -3`: reflect in the `y`-axis, then move 3 right."] }
      ],
      general:"Your graph doesn’t lie on the target yet. Compare where the two curves start and which way they open, then adjust."
    },
    stationB:{
      title:"Station B: Decompose it",
      intro:"<strong>Test</strong> a card to run its inner and outer functions through the pipeline and lay its graph over `h`. <strong>Select</strong> every card that builds `h`, then press <strong>Check</strong>.",
      ui:{ test:"Test", select:"Select", selected:"Selected", check:"Check", input:"Test input", card:"Card", fn:"Function", hLabel:"`h` (ink)", cLabel:"card (blue)",
        inLab:"input", outLab:"output", undef:"undefined", pick:"Press <strong>Test</strong> on a card to run it through the machines.", hAt:"For comparison, #1 #2.",
        notFirst:"(not first try)", algLab:"Check it with algebra:", none:"Select at least one card first.", sumLine:"Decompose it (first try): #1/4", unfinished:"(unfinished)" },
      wrongCard:"Card #L builds #B, not `h`. At `x =` #X it gives #V, but `h` gives #H.",
      reversed:"Here #G acts first. In `h`, it’s #I that acts first.",
      missed:"Card #L works too: `g(x) = `#G, then `f(`#G`) = h(x)`. A function can often be split in more than one way.",
      end:"Change your selection and check again.",
      right:"Every card you selected builds `h`, and you found them all.",
      items:[
        { id:"d1", h:"`(2x - 5)^3`", hs:"(2x − 5)^3", test:3, hv:"1",
          cards:[
            { g:"`2x - 5`", f:"`x^3`", u:"(⟦2x − 5⟧)^3" },
            { g:"`x^3`", f:"`2x - 5`", builds:"`2x^3 - 5`", v:"49", rev:true },
            { g:"`2x`", f:"`(x - 5)^3`", u:"(⟦2x⟧ − 5)^3" },
            { g:"`2x - 5`", f:"`3x`", builds:"`6x - 15`", v:"3", u:"(⟦2x − 5⟧)^3" }],
          answer:[0, 2], inner:"`2x - 5`",
          alg:"`f(g(x)) = f(2x - 5) = (2x - 5)^3 = h(x)`.",
          hints:["What happens to `x` first in `(2x - 5)^3`, and what happens last?", "First `2x - 5` is worked out, last it’s cubed. So `g = 2x - 5`, `f = x^3` works. Is there another split?", "Card c works too: `g(x) = 2x`, then `f(2x) = (2x - 5)^3`. Cards b and d build `2x^3 - 5` and `6x - 15`. Select a and c."] },
        { id:"d2", h:"`√{x^2 + 9}`", hs:"√{x^2 + 9}", test:4, hv:"5",
          cards:[
            { g:"`x^2 + 9`", f:"`√x`", u:"√{⟦x^2 + 9⟧}" },
            { g:"`x^2`", f:"`√{x + 9}`", u:"√{⟦x^2⟧ + 9}" },
            { g:"`√x`", f:"`x^2 + 9`", builds:"`x + 9` for `x ≥ 0`", v:"13", rev:true },
            { g:"`x^2`", f:"`√x + 3`", builds:"`√{x^2} + 3`", v:"7", u:"√{⟦x^2⟧ + 9}",
              special:"At `x = 0` card d does match `h` (`√0 + 3 = 3 = √9`), but nowhere else: at `x = 4` it gives 7, not 5. One matching input isn’t proof; the graphs show the whole story. `√{x^2 + 9}` is not `x + 3`." }],
          answer:[0, 1], inner:"`x^2 + 9`",
          alg:"`f(g(x)) = f(x^2 + 9) = √{x^2 + 9} = h(x)`.",
          hints:["What happens to `x` first in `√{x^2 + 9}`, and what happens last?", "First `x^2 + 9` is worked out, last the square root is taken. So `g = x^2 + 9`, `f = √x` works. Is there another split?", "Card b works too: `g(x) = x^2`, then `f(x^2) = √{x^2 + 9}`. Cards c and d build `x + 9` (for `x ≥ 0`) and `√{x^2} + 3`. Select a and b."] },
        { id:"d3", h:"`{1}/{(x - 4)^2}`", hs:"{1}/{(x − 4)^2}", test:5, hv:"1",
          cards:[
            { g:"`x - 4`", f:"`1/x^2`", u:"{1}/{(⟦x − 4⟧)^2}" },
            { g:"`(x - 4)^2`", f:"`1/x`", u:"{1}/{⟦(x − 4)^2⟧}" },
            { g:"`1/x`", f:"`(x - 4)^2`", builds:"`(1/x - 4)^2`", v:"361/25", rev:true },
            { g:"`x^2`", f:"`{1}/{x - 4}`", builds:"`{1}/{x^2 - 4}`", v:"1/21" }],
          answer:[0, 1], inner:"`x - 4`",
          alg:"`f(g(x)) = f(x - 4) = {1}/{(x - 4)^2} = h(x)`.",
          hints:["What happens to `x` first in `{1}/{(x - 4)^2}`, and what happens last?", "First `x - 4` is worked out, then it’s squared, and last you take 1 over it. So `g = x - 4`, `f = 1/x^2` works. Is there another split?", "Card b works too: `g(x) = (x - 4)^2`, then `f((x - 4)^2) = {1}/{(x - 4)^2}`. Cards c and d build `(1/x - 4)^2` and `{1}/{x^2 - 4}`. Select a and b."] },
        { id:"d4", h:"`(3x + 1)^2 + 5`", hs:"(3x + 1)^2 + 5", test:1, hv:"21",
          cards:[
            { g:"`3x + 1`", f:"`x^2 + 5`", u:"(⟦3x + 1⟧)^2 + 5" },
            { g:"`(3x + 1)^2`", f:"`x + 5`", u:"⟦(3x + 1)^2⟧ + 5" },
            { g:"`3x`", f:"`(x + 1)^2 + 5`", u:"(⟦3x⟧ + 1)^2 + 5" },
            { g:"`x^2 + 5`", f:"`3x + 1`", builds:"`3x^2 + 16`", v:"19", rev:true }],
          answer:[0, 1, 2], inner:"`3x + 1`",
          alg:"`f(g(x)) = f(3x + 1) = (3x + 1)^2 + 5 = h(x)`.",
          hints:["List the steps `(3x + 1)^2 + 5` does to `x`, in order: times 3, plus 1, square, plus 5.", "Any cut between two steps gives a valid pair: the steps before the cut are `g`, the steps after are `f`.", "Cards a, b and c each cut the steps in a different place. Card d builds `3x^2 + 16`. Select a, b and c."] }
      ]
    },
    blocks:[{ html:"<details class=\"alg\"><summary>Check it with algebra</summary><p style=\"margin-top:10px\"><strong>Building and splitting composites</strong></p><ul>" +
      "<li><strong>To build `f(g(x))`:</strong> replace every `x` in `f`’s formula with `(g(x))`, brackets included. `f(x) = x^3` and `g(x) = 2x - 5` give `(2x - 5)^3`.</li>" +
      "<li><strong>To split `h`:</strong> list what `h` does to `x`, step by step. Cut the list anywhere: the steps before the cut form `g`, the steps after form `f`. Different cuts give different valid pairs.</li>" +
      "<li><strong>Linear inside:</strong> `f(A(x + B)) = f(@k{k}(x - @d{d}))` with `@k{k} = A` and `@d{d} = -B`: every point moves by `(x, y) → (x/A - B, y)`, a horizontal change.</li>" +
      "<li><strong>Linear outside:</strong> `A(f(x) + B) = @a{a}f(x) + @c{c}` with `@a{a} = A` and `@c{c} = AB`: every point moves by `(x, y) → (x, Ay + AB)`, a vertical change.</li>" +
      "<li><strong>So the standard form is three machines:</strong> `y = @a{a}f(@k{k}(x - @d{d})) + @c{c}` is “`@k{k}(x - @d{d})`”, then `f`, then “`@a{a}( ) + @c{c}`”.</li></ul></details>" }],
    quickCheck:{
      title:"Inside and outside quick check", summary:"Inside and outside quick check",
      items:[
        { id:"q1", goal:6, prompt:"`y = f(x - 4)` is `f` with the linear function `x - 4` inside. How does its graph compare with `y = f(x)`?",
          choices:[
            { t:"4 units right", ok:true, fb:"Right. Inside, the change is horizontal: the point at `x = 0` on `f` is now reached at `x = 4`." },
            { t:"4 units left", fb:"Inside changes look backwards: `f(x - 4)` reaches `f(0)` at `x = 4`, which is to the right." },
            { t:"4 units down", fb:"That’s `f(x) - 4`, with the linear function outside. Inside, the change is horizontal." },
            { t:"4 units up", fb:"Nothing outside `f` changed, so the graph doesn’t move vertically." }] },
        { id:"q2", goal:6, prompt:"Which composition is `y = 3f(x) - 6`?",
          choices:[
            { t:"`L(f(x))` with `L(x) = 3x - 6`", ok:true, fb:"Right. `f` acts first, then its output is tripled and 6 is subtracted: a linear function outside." },
            { t:"`f(L(x))` with `L(x) = 3x - 6`", fb:"That’s `f(3x - 6)`, with the linear function inside, which changes the graph horizontally." },
            { t:"`L(f(x))` with `L(x) = 3(x - 6)`", fb:"That gives `3(f(x) - 6) = 3f(x) - 18`." },
            { t:"`L(f(x))` with `L(x) = {x + 6}/{3}`", fb:"That’s the inverse of `3x - 6`: it gives `{f(x) + 6}/{3}`, which undoes the change instead of making it." }] },
        { id:"q3", goal:4, prompt:"Which pair builds `h(x) = 2^{x^2}`?",
          choices:[
            { t:"Inner `x^2`, outer `2^x`", ok:true, fb:"Right. `x` is squared first, then used as the exponent on 2." },
            { t:"Inner `2^x`, outer `x^2`", fb:"That builds `(2^x)^2 = 2^{2x}`, a different function: at `x = 3` it gives 64, but `2^{3^2} = 512`." },
            { t:"Inner `x^2`, outer `2x`", fb:"That builds `2x^2`. `2^x` means 2 to the power `x`, not 2 times `x`." },
            { t:"Inner `x^2`, outer `x^2`", fb:"That builds `x^4`." }] },
        { id:"q4", goal:3, prompt:"`f(x) = 2^x` and `g(x) = x^2`. What is the range of `f(g(x)) = 2^{x^2}`?",
          choices:[
            { t:"`{y ∈ ℝ | y ≥ 1}`", ok:true, fb:"Right. The inner `x^2` only gives outputs of 0 or more, and `2^x` turns those into numbers of at least `2^0 = 1`." },
            { t:"`{y ∈ ℝ | y > 0}`", fb:"That’s the range of `2^x` on its own. Here `2^x` only ever receives inputs of 0 or more." },
            { t:"`{y ∈ ℝ | y ≥ 0}`", fb:"That’s the range of `x^2` on its own. The outer function acts last." },
            { t:"`{y ∈ ℝ}`", fb:"That’s the domain. 2 to any power is positive, and here the power is never negative." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Where is it defined?", summary:"Where is it defined?", goal:[3, 2], noun:"pair",
        instruction:"Sort each pair into the box with the domain of `f(g(x))`.",
        how:"Tap a pair, then tap the box it belongs in. Ask two questions: which `x` can go into `g`, and which outputs of `g` can go into `f`?",
        boxes:[{ id:"b1", label:"`{x ∈ ℝ}`" }, { id:"b2", label:"`{x ∈ ℝ | x ≥ 2}`" }, { id:"b3", label:"`{x ∈ ℝ | x > 2}`" }, { id:"b4", label:"`{x ∈ ℝ | x ≠ 2}`" }],
        items:[
          sItem("i1", "x^2", "x - 2", "b1", "`(x - 2)^2`: both machines accept every real number.",
            ["Which `x` can go into `g(x) = x - 2`?", "Every `x`. Now which outputs of `g` can `f(x) = x^2` accept? Squaring accepts anything.", "`(x - 2)^2`: both machines accept every real number. The domain is `{x ∈ ℝ}`."],
            { b2:free(0, "`(0 - 2)^2 = 4`"), b3:free(0, "`(0 - 2)^2 = 4`"), b4:free(2, "`(2 - 2)^2 = 0`") }),
          sItem("i2", "√x", "(x - 2)^2", "b1", "`(x - 2)^2` is never negative, so √ accepts every output of `g`: `√{(x - 2)^2}` exists for every `x`.",
            ["Which `x` can go into `g(x) = (x - 2)^2`?", "Every `x`. Now √ needs `(x - 2)^2 ≥ 0`. Can a square be negative?", "`(x - 2)^2` is never negative, so √ accepts every output of `g`: `√{(x - 2)^2}` exists for every `x`. The domain is `{x ∈ ℝ}`."],
            { b2:free(0, "`√{(0 - 2)^2} = √4 = 2`"), b3:free(0, "`√{(0 - 2)^2} = √4 = 2`"), b4:free(2, "`√{(2 - 2)^2} = √0 = 0`") }),
          sItem("i3", "1/x", "2^{x - 2}", "b1", "A power of 2 is never 0, so `1/2^{x - 2}` never divides by 0.",
            ["Which `x` can go into `g(x) = 2^{x - 2}`?", "Every `x`. Now `1/x` needs `2^{x - 2} ≠ 0`. Can a power of 2 be 0?", "A power of 2 is never 0, so `1/2^{x - 2}` never divides by 0. The domain is `{x ∈ ℝ}`."],
            { b2:free(0, "`1/2^{-2} = 4`"), b3:free(0, "`1/2^{-2} = 4`"), b4:free(2, "`1/2^0 = 1`") }),
          sItem("i4", "√x", "x - 2", "b2", "`√{x - 2}` needs `x - 2 ≥ 0`.",
            ["Which `x` can go into `g(x) = x - 2`?", "Every `x`. Now √ needs `x - 2 ≥ 0`.", "`√{x - 2}` needs `x - 2 ≥ 0`. The domain is `{x ∈ ℝ | x ≥ 2}`."],
            { b1:restricted(0, "`√{0 - 2} = √{-2}` isn’t a real number"), b3:edgeIn("`√0 = 0` is fine"), b4:belowToo("`√{-2}` isn’t a real number") }),
          sItem("i5", "x^2", "√{x - 2}", "b2", "`(√{x - 2})^2` simplifies to `x - 2`, but `g` acts first and needs `x ≥ 2`.",
            ["Which `x` can go into `g(x) = √{x - 2}`?", "Only `x ≥ 2`. Now which outputs of `g` can `f(x) = x^2` accept? Squaring accepts anything.", "`(√{x - 2})^2` simplifies to `x - 2`, but `g` acts first and needs `x ≥ 2`. The domain is `{x ∈ ℝ | x ≥ 2}`."],
            { b1:SIMPLIFIED, b3:edgeIn("`(√0)^2 = 0` is fine"), b4:belowToo("`g(0) = √{-2}` isn’t a real number") }),
          sItem("i6", "√x", "log_{2}(x - 1)", "b2", "`g` needs `x > 1`, and √ needs `log_{2}(x - 1) ≥ 0`, so `x - 1 ≥ 1`: `x ≥ 2`.",
            ["Which `x` can go into `g(x) = log_{2}(x - 1)`?", "Only `x > 1`. Now √ needs `log_{2}(x - 1) ≥ 0`. When is a logarithm 0 or more?", "`g` needs `x > 1`, and √ needs `log_{2}(x - 1) ≥ 0`, so `x - 1 ≥ 1`: `x ≥ 2`. The domain is `{x ∈ ℝ | x ≥ 2}`."],
            { b1:restricted(1, "`log_{2}(1 - 1) = log_{2} 0` is undefined"), b3:edgeIn("`√{log_{2} 1} = √0 = 0` is fine"), b4:belowToo("`log_{2}(0 - 1)` is undefined") }),
          sItem("i7", "log_{2} x", "x - 2", "b3", "`log_{2}(x - 2)` needs `x - 2 > 0`.",
            ["Which `x` can go into `g(x) = x - 2`?", "Every `x`. Now `log_{2}` needs `x - 2 > 0`.", "`log_{2}(x - 2)` needs `x - 2 > 0`. The domain is `{x ∈ ℝ | x > 2}`."],
            { b1:restricted(0, "`log_{2}(0 - 2)` is undefined"), b2:edgeOut("`log_{2} 0` is undefined"), b4:belowToo("`log_{2}(-2)` is undefined") }),
          sItem("i8", "√x", "{1}/{x - 2}", "b3", "`g` needs `x ≠ 2`, and √ needs `{1}/{x - 2} ≥ 0`, which happens only when `x - 2 > 0`. (A fraction 1/something is never 0.)",
            ["Which `x` can go into `g(x) = {1}/{x - 2}`?", "Every `x` except 2. Now √ needs `{1}/{x - 2} ≥ 0`. When is `{1}/{x - 2}` positive?", "`{1}/{x - 2}` is never 0, and it’s positive exactly when `x - 2 > 0`. The domain is `{x ∈ ℝ | x > 2}`."],
            { b1:restricted(0, "`√{{1}/{0 - 2}} = √{-1/2}` isn’t a real number"), b2:edgeOut("`1/0` is undefined"), b4:belowToo("`√{-1/2}` isn’t a real number") }),
          sItem("i9", "log_{2} x", "√{x - 2}", "b3", "`g` needs `x ≥ 2`, but `log_{2}` needs `√{x - 2} > 0`, so `x = 2` (where `√0 = 0`) is out.",
            ["Which `x` can go into `g(x) = √{x - 2}`?", "Only `x ≥ 2`. Now `log_{2}` needs `√{x - 2} > 0`. When is `√{x - 2}` equal to 0?", "`g` needs `x ≥ 2`, but `log_{2}` needs `√{x - 2} > 0`, so `x = 2` (where `√0 = 0`) is out. The domain is `{x ∈ ℝ | x > 2}`."],
            { b1:restricted(0, "`√{0 - 2}` isn’t a real number"), b2:edgeOut("`log_{2} √0 = log_{2} 0` is undefined"), b4:belowToo("`√{-2}` isn’t a real number") }),
          sItem("i10", "1/x", "x - 2", "b4", "`{1}/{x - 2}` fails only when `x - 2 = 0`.",
            ["Which `x` can go into `g(x) = x - 2`?", "Every `x`. Now `1/x` needs `x - 2 ≠ 0`.", "`{1}/{x - 2}` fails only when `x - 2 = 0`. The domain is `{x ∈ ℝ | x ≠ 2}`."],
            { b1:restricted(2, "`{1}/{2 - 2} = 1/0` is undefined"), b2:below("`{1}/{0 - 2} = -1/2` works"), b3:below("`{1}/{0 - 2} = -1/2` works") }),
          sItem("i11", "log_{2} x", "(x - 2)^2", "b4", "`(x - 2)^2` is positive everywhere except `x = 2`, where it’s 0. Numbers less than 2 are fine: `(0 - 2)^2 = 4`.",
            ["Which `x` can go into `g(x) = (x - 2)^2`?", "Every `x`. Now `log_{2}` needs `(x - 2)^2 > 0`. When is a square <strong>not</strong> positive?", "`(x - 2)^2 = 0` only at `x = 2`; everywhere else it’s positive. The domain is `{x ∈ ℝ | x ≠ 2}`."],
            { b1:restricted(2, "`log_{2}((2 - 2)^2) = log_{2} 0` is undefined"), b2:below("`log_{2}((0 - 2)^2) = log_{2} 4 = 2` works"), b3:below("`log_{2}((0 - 2)^2) = log_{2} 4 = 2` works") }),
          sItem("i12", "2^x", "{1}/{x - 2}", "b4", "`2^x` accepts every number, so only `g`’s restriction counts: `x ≠ 2`.",
            ["Which `x` can go into `g(x) = {1}/{x - 2}`?", "Every `x` except 2. Now which outputs of `g` can `f(x) = 2^x` accept? `2^x` accepts anything.", "`2^x` accepts every number, so only `g`’s restriction counts: `x ≠ 2`. The domain is `{x ∈ ℝ | x ≠ 2}`."],
            { b1:restricted(2, "`g(2) = 1/0` is undefined"), b2:below("`2^{1/(0 - 2)} = 2^{-1/2}` works"), b3:below("`2^{1/(0 - 2)} = 2^{-1/2}` works") })
        ] },
      { id:"backwards", type:"custom", title:"Inside out, then backwards", summary:"Inside out, then backwards", star:true, goal:[1, 3, 2, 5],
        instruction:"Find each value. Type a whole number or a fraction such as −1/2, or fill in the boxes, then press Check.",
        how:"N1–N3 use the table of `f` and the graph of `g` below. For “fill in” items, type the two numbers of `g(x) = □x + □`.",
        fig:{ xs:[-2, -1, 0, 1, 2, 3, 4], fs:[4, 1, 3, -2, 0, -1, 2], aria:"Graph of y = g(x), an upward parabola through the dotted points (−2, 7), (−1, 2), (0, −1), (1, −2), (2, −1), (3, 2) and (4, 7)", label:"y = g(x)" },
        fallback:"Not this one. Work from the inside out, and check your answer by putting it back through both machines.",
        bad:"Enter a whole number or a fraction, such as 3 or −1/2.",
        badBox:"Fill in both boxes with a whole number or a fraction.",
        tryAgain:"Try again.", label:"Your answer:", notFirst:"(not first try)",
        items:[
          { id:"n1", goal:1, prompt:"Find `f(g(3))`.", answer:0, display:"`f(g(3)) = f(2) = 0`",
            wrong:[{ match:2, fb:"That’s `g(f(3)) = g(-1) = 2`. In `f(g(3))`, read `g(3)` from the graph first." }, { match:-2, fb:"That’s `f(3) × g(3) = -1 × 2`. Composition isn’t multiplication." }],
            hints:["Work from the inside out: find `g(3)` on the graph first.", "`g(3) = 2`. Now look up `f(2)` in the table.", "`f(2) = 0`, so `f(g(3)) = 0`."] },
          { id:"n2", goal:1, prompt:"Find `g(f(4))`.", answer:-1, display:"`g(f(4)) = g(2) = -1`",
            wrong:[{ match:14, fb:"That’s `f(4) × g(4) = 2 × 7`." }, { match:7, fb:"That’s `g(4)`. Here `f` acts first: `f(4) = 2`, then read `g(2)` from the graph." }],
            hints:["Here `f` acts first: find `f(4)` in the table.", "`f(4) = 2`. Now read `g(2)` from the graph.", "`g(2) = -1`, so `g(f(4)) = -1`."] },
          { id:"n3", goal:1, prompt:"Find the `x`-value for which `f(g(x)) = 4`.", answer:1, display:"`x = 1`",
            right:"Work backwards one machine at a time: `f` turns −2 into 4, and `g` turns 1 into −2 (the bottom of its graph). So `f(g(1)) = f(-2) = 4`, and no other `x` works, because `g` outputs −2 only at `x = 1`.",
            wrong:[{ match:-2, fb:"`f(-2) = 4`, so −2 is what `g` must <strong>output</strong>. Now find the `x` with `g(x) = -2`." }, { match:7, fb:"`g(-2) = 7` runs `g` forwards from −2. You need the `x` that `g` sends <strong>to</strong> −2." }],
            hints:["Work backwards. Which input does `f` turn into 4? Look in the table.", "`f(-2) = 4`. So you need `g(x) = -2`. Find height −2 on `g`’s graph.", "`g(1) = -2` (the lowest point). So `x = 1`."] },
          { id:"n4", goal:3, prompt:"`f(x) = x^2 + 4x` and `g(x) = √x`. What is the least value of `f(g(x))`?", answer:0, display:"0",
            right:"`f(g(x)) = x + 4√x`, which only grows as `x` grows from 0. The inner `√x` never outputs −2, so `f`’s lowest point (−2, −4) is never reached. The range of `f(g(x))` is `{y ∈ ℝ | y ≥ 0}`.",
            wrong:[{ match:-4, fb:"−4 is the least value of `f` on its own, at an input of −2. But `f`’s inputs here are outputs of `√x`, which are never negative." }],
            hints:["Which numbers can `f` receive here? They’re outputs of `√x`.", "`√x` is never negative, so `f` only receives inputs of 0 or more. Is `f` increasing for inputs of 0 or more?", "`f(g(x)) = x + 4√x`. At `x = 0` it’s 0, and it only grows as `x` grows. The least value is 0."] },
          { id:"n5", goal:2, boxes:true, prompt:"`f(x) = 3x - 2` and `g` is linear. `f(g(x)) = 6x + 7`. Fill in `g(x) = □x + □`.", answer:[[2, 3]], display:"`g(x) = 2x + 3`",
            wrong:[{ match:[2, 11], fb:"That `g` solves `g(f(x)) = 6x + 7`: the order is reversed. Here `f` is applied to `g(x)`: `3g(x) - 2`." }, { match:[2, 5/3], fb:"Check the constant: `3b - 2 = 7` means `3b = 9`." }, { match:[6, 7], fb:"That’s `f(g(x))` itself. Find the `g` that `f` turns into it." }],
            hints:["Write `g(x) = mx + b` and build `f(g(x)) = 3(mx + b) - 2`.", "`3mx + 3b - 2` must equal `6x + 7`, so `3m = 6` and `3b - 2 = 7`.", "`m = 2` and `b = 3`: `g(x) = 2x + 3`. Check: `3(2x + 3) - 2 = 6x + 7`."] },
          { id:"n6", goal:2, boxes:true, prompt:"`f(x) = x^2 + 4` and `g` is linear. `f(g(x)) = x^2 - 2x + 5`. Fill in `g(x) = □x + □`.", answer:[[1, -1], [-1, 1]], display:"`g(x) = x - 1` or `g(x) = -x + 1`",
            right:"`x^2 - 2x + 5 = (x - 1)^2 + 4`, so `g(x) = x - 1` works. So does `g(x) = -x + 1`, because `(1 - x)^2 = (x - 1)^2`. Two different inner functions, one composite.",
            wrong:[{ match:[1, 1], fb:"`(x + 1)^2 + 4 = x^2 + 2x + 5`: the middle term has the wrong sign." }, { match:[1, -2], fb:"`(x - 2)^2 + 4 = x^2 - 4x + 8`." }],
            hints:["Write `g(x) = mx + b` and build `f(g(x)) = (mx + b)^2 + 4`.", "`x^2 - 2x + 5 - 4 = x^2 - 2x + 1 = (x - 1)^2`. So `(mx + b)^2` must equal `(x - 1)^2`.", "`mx + b = x - 1` works: `m = 1`, `b = -1`. (So does `-x + 1`.)"] },
          { id:"n7", goal:5, prompt:"`g(g(x)) = x` for every `x`. `g(2) = 7` and `g(5) = -1`. Find `g(-1) + g(7)`.", answer:7, display:"7",
            right:"`g(g(5)) = 5` says `g(-1) = 5`, and `g(g(2)) = 2` says `g(7) = 2`. So the sum is 7. A function with `g(g(x)) = x` is its own inverse, like `1/x`.",
            wrong:[{ match:6, fb:"That’s `-1 + 7`, the two inputs. Use `g(g(x)) = x`: apply it at `x = 5` and at `x = 2`." }],
            hints:["`g(g(x)) = x` means `g` undoes itself. What does `g(g(5))` tell you?", "`g(5) = -1`, so `g(g(5)) = g(-1) = 5`. Do the same with `g(2) = 7`.", "`g(-1) = 5` and `g(7) = 2`, so `g(-1) + g(7) = 7`."] },
          { id:"n8", goal:2, boxes:true, prompt:"`f(x) = 3x + 2`. Find the linear function `g` with `g(0) = 1` and `f(g(x)) = g(f(x))` for every `x`. Fill in `g(x) = □x + □`.", answer:[[2, 1]], display:"`g(x) = 2x + 1`",
            right:"With `g(x) = mx + b`: `f(g(x)) = 3mx + 3b + 2` and `g(f(x)) = 3mx + 2m + b`. These match when `2b + 2 = 2m`, so `m = b + 1`. With `b = g(0) = 1`, `m = 2`.",
            wrong:[{ match:[3, 1], fb:"`g(x) = 3x + 1` gives `f(g(x)) = 9x + 5` but `g(f(x)) = 9x + 7`." }, { match:[1, 1], fb:"`g(x) = x + 1` gives `3x + 5` one way and `3x + 3` the other." }],
            hints:["Let `g(x) = mx + b`. Build both `f(g(x))` and `g(f(x))`.", "`f(g(x)) = 3mx + 3b + 2` and `g(f(x)) = 3mx + 2m + b`. The `x`-terms already match. Set the constants equal.", "`3b + 2 = 2m + b` gives `m = b + 1`. `g(0) = b = 1`, so `m = 2`: `g(x) = 2x + 1`. Check: both orders give `6x + 5`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Keisha", how:"",
        instruction:"Keisha made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"`f(x) = x^2 - 2x` and `g(x) = x + 3`. Find `f(g(x))` and simplify.",
            steps:["`f(g(x))` means: put `g(x) = x + 3` into `f`.", "`f(g(x)) = (x + 3)^2 - 2x`", "`= x^2 + 6x + 9 - 2x`", "`= x^2 + 4x + 9`"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 expands step 2 correctly. The mistake is earlier.", "Step 4 collects step 3’s terms correctly. The mistake is earlier."],
            fixes:[
              { t:"Replace <strong>both</strong> `x`’s: `(x + 3)^2 - 2(x + 3) = x^2 + 6x + 9 - 2x - 6 = x^2 + 4x + 3`.", ok:true, why:"Check with `x = 0`: `g(0) = 3` and `f(3) = 9 - 6 = 3`, which matches `x^2 + 4x + 3`. Keisha’s answer gives 9." },
              { t:"`(x + 3)^2 - 2x + 3 = x^2 + 4x + 12`.", why:"The brackets are missing: −2 must multiply all of `(x + 3)`, giving `-2x - 6`, not `-2x + 3`." },
              { t:"`f(g(x)) = (x^2 - 2x) + 3 = x^2 - 2x + 3`.", why:"That’s `g(f(x))`: it puts `f` into `g`. In `f(g(x))`, `g(x)` goes into `f`." },
              { t:"Step 2 is correct as written.", why:"Check with `x = 0`: `f(g(0)) = f(3) = 3`, but step 2 gives `9 - 0 = 9`. The second `x` in `f` wasn’t replaced." }],
            hints:["How many `x`’s are there in `f(x) = x^2 - 2x`? Did each one get replaced?", "Both must become `(x + 3)`: `(x + 3)^2 - 2(x + 3)`.", "Step 2 is wrong. `(x + 3)^2 - 2(x + 3) = x^2 + 4x + 3`."] },
          { id:"e2", goal:3, task:"`f(x) = x^2` and `g(x) = √{x - 1}`. Find the domain of `f(g(x))`.",
            steps:["`f(g(x)) = (√{x - 1})^2`.", "Squaring undoes the square root, so this simplifies to `x - 1`.", "`x - 1` is a linear function, so it accepts every real number.", "So the domain of `f(g(x))` is `{x ∈ ℝ}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct for every `x` where `√{x - 1}` exists. The mistake is in what Keisha does with it next.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`g` acts first, and `√{x - 1}` needs `x - 1 ≥ 0`. So the domain is `{x ∈ ℝ | x ≥ 1}`, even though the simplified formula is `x - 1`.", ok:true, why:"A number has to get through `g` before `f` ever sees it." },
              { t:"The domain is `{x ∈ ℝ | x > 1}`, because `√0` is undefined.", why:"`√0 = 0` is defined, so `x = 1` works: `(√0)^2 = 0`." },
              { t:"The domain is `{x ∈ ℝ | x ≥ 0}`, because `f(x) = x^2` never gives a negative number.", why:"That’s about `f`’s outputs, not which `x` can go in. And `x = 0.5` fails: `√{-0.5}` isn’t real." },
              { t:"Step 3 is correct as written.", why:"Try `x = 0`: `g(0) = √{-1}` isn’t a real number, so `f(g(0))` doesn’t exist, even though the simplified formula gives −1." }],
            hints:["Does every `x` get through `g(x) = √{x - 1}`?", "The domain must be decided from the machines, not from the simplified formula.", "Step 3 is wrong. `g` needs `x ≥ 1`, so the domain is `{x ∈ ℝ | x ≥ 1}`."] },
          { id:"e3", goal:5, task:"`f(x) = x^2` and `g(x) = √x`. Decide whether `g(f(x)) = x` for every real number `x`.",
            steps:["`g(f(x)) = √{x^2}`.", "Squaring and square-rooting undo each other, so `√{x^2} = x`.", "So `g(f(x)) = x` for every real number `x`.", "Check: `x = 4` gives `√16 = 4`. ✓"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "The arithmetic is right, but one positive example can’t show “every real number”. The mistake is earlier."],
            fixes:[
              { t:"`√{x^2} = x` only when `x ≥ 0`. For `x = -4`: `√{(-4)^2} = √16 = 4`, not −4. So `g(f(x)) = x` is <strong>not</strong> true for every real `x`.", ok:true, why:"√ gives the non-negative root, so it can’t give back a negative input." },
              { t:"`√{x^2} = -x` for every `x`, because a square root of a square changes the sign.", why:"Try `x = 4`: `√16 = 4`, not −4. The sign changes only for negative `x`." },
              { t:"`√{x^2}` is undefined for `x < 0`, so `g(f(x)) = x` on its domain `{x ∈ ℝ | x ≥ 0}`.", why:"`x^2` is never negative, so `√{x^2}` is defined for every `x`: `√{(-4)^2} = 4`." },
              { t:"Step 2 is correct as written.", why:"Try `x = -4`: `√{(-4)^2} = √16 = 4`, which isn’t −4." }],
            hints:["Test step 2 with a negative number.", "`x = -4`: `(-4)^2 = 16` and `√16 = 4`. Is that −4?", "Step 2 is wrong: `√{x^2} = x` only for `x ≥ 0`. So `g(f(x)) = x` fails for every negative `x`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you swapped the machines or traced a composite in Explore?" },
      { id:"j2", q:"In your own words, why does `g(x)` have to be in the domain of `f` for `f(g(x))` to exist? Give an example of a number that fails." },
      { id:"j3", q:"Explain to a friend how to find `f(g(2))` from a table of `f` and a graph of `g`, and what to do if the value you need isn’t in the table." },
      { id:"j4", q:"Which still trips you up: the order of the machines, the domain, or splitting a function into inner and outer? What will you do about it before module 49?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Use the table. What is `f(g(1))`?" + tbl([3, 5, 4, 1, 2], [2, 4, 1, 5, 3]), options:[
          { t:"5", ok:true, why:"Inside out: `g(1) = 2`, then `f(2) = 5`." },
          { t:"1", why:"That’s `g(f(1)) = g(3) = 1`. In `f(g(1))`, `g` acts first." },
          { t:"2", why:"That’s `g(1)`, the inner value. It still has to go into `f`: `f(2) = 5`." },
          { t:"6", why:"That’s `f(1) × g(1) = 3 × 2`. Composition isn’t multiplication." }] },
        b:{ prompt:"Use the table. What is `f(g(4))`?" + tbl([4, 1, 5, 2, 3], [3, 5, 2, 1, 4]), options:[
          { t:"4", ok:true, why:"`g(4) = 1`, then `f(1) = 4`." },
          { t:"1", why:"That’s `g(4)`, the inner value. It still has to go into `f`." },
          { t:"2", why:"That’s `f(4) × g(4) = 2 × 1`." },
          { t:"5", why:"That’s `g(f(4)) = g(2) = 5`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f(x) = x^2 - 3x` and `g(x) = x + 2`. What is `f(g(x))`?", options:[
          { t:"`x^2 + x - 2`", ok:true, why:"`(x + 2)^2 - 3(x + 2) = x^2 + 4x + 4 - 3x - 6 = x^2 + x - 2`. Check with `x = 0`: `f(2) = 4 - 6 = -2`." },
          { t:"`x^2 + x + 4`", why:"That replaces only the first `x`: `(x + 2)^2 - 3x`. Check with `x = 0`: `f(g(0)) = f(2) = -2`, not 4." },
          { t:"`x^2 - 3x + 2`", why:"That’s `g(f(x)) = (x^2 - 3x) + 2`. Check with `x = 0`: it gives 2, but `f(g(0)) = -2`." },
          { t:"`x^3 - x^2 - 6x`", why:"That’s `f(x) · g(x) = (x^2 - 3x)(x + 2)`. Composition isn’t multiplication." }] },
        b:{ prompt:"`f(x) = x^2 + 2x` and `g(x) = x - 1`. What is `f(g(x))`?", options:[
          { t:"`x^2 - 1`", ok:true, why:"`(x - 1)^2 + 2(x - 1) = x^2 - 2x + 1 + 2x - 2 = x^2 - 1`. Check with `x = 0`: `f(-1) = 1 - 2 = -1`." },
          { t:"`x^2 + 1`", why:"That replaces only the first `x`: `(x - 1)^2 + 2x`. Check with `x = 0`: it gives 1, but `f(-1) = -1`." },
          { t:"`x^2 + 2x - 1`", why:"That’s `g(f(x))`. Check with `x = 0`: it gives −1 too, but try `x = 1`: it gives 2, while `f(g(1)) = f(0) = 0`." },
          { t:"`x^3 + x^2 - 2x`", why:"That’s `f(x) · g(x)`." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`f(x) = 2^x + 1`, and `f^{-1}` is its inverse. What is `f(f^{-1}(13))`?", options:[
          { t:"13", ok:true, why:"`f^{-1}` turns 13 into the input that `f` sends to 13, and then `f` sends it back to 13. A function composed with its inverse gives back the input." },
          { t:"1", why:"That treats `f^{-1}` as `1/f`, as if `f · (1/f) = 1`. `f^{-1}` undoes `f`; it doesn’t divide." },
          { t:"`log_{2} 12`", why:"That’s `f^{-1}(13)`, the inner value. `f` then turns it back into 13." },
          { t:"8193", why:"That’s `f(13) = 2^{13} + 1`. It ignores `f^{-1}`, which acts first." }] },
        b:{ prompt:"`f(x) = log_{3}(x - 1)`, and `f^{-1}` is its inverse. What is `f^{-1}(f(10))`?", options:[
          { t:"10", ok:true, why:"`f` turns 10 into `log_{3} 9 = 2`, and `f^{-1}` turns 2 back into 10." },
          { t:"1", why:"`f^{-1}` isn’t `1/f`. It undoes `f`, so it gives back the input." },
          { t:"2", why:"That’s `f(10)`, the inner value. `f^{-1}` then turns 2 back into 10." },
          { t:"59 050", why:"That’s `f^{-1}(10) = 3^{10} + 1`. It ignores `f`, which acts first." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`f(x) = √x` and `g(x) = 4 - x^2`. What is the domain of `f(g(x))`?", options:[
          { t:"`{x ∈ ℝ | -2 ≤ x ≤ 2}`", ok:true, why:"`g` accepts every `x`, and √ needs `4 - x^2 ≥ 0`, so `x^2 ≤ 4`: `-2 ≤ x ≤ 2`. Check: `x = 3` gives `√{-5}`, which isn’t real." },
          { t:"`{x ∈ ℝ | x ≤ -2 or x ≥ 2}`", why:"That solves `4 - x^2 ≤ 0`, the wrong way round. At `x = 3`, `4 - 9 = -5` and `√{-5}` isn’t real." },
          { t:"`{x ∈ ℝ | x ≥ 0}`", why:"That’s the domain of `f` alone. What matters is whether `g(x) ≥ 0`: at `x = 3`, `g(3) = -5`." },
          { t:"`{x ∈ ℝ}`", why:"That’s the domain of `g` alone. Some outputs of `g` are negative, and √ can’t accept them." }] },
        b:{ prompt:"`f(x) = log_{2} x` and `g(x) = 9 - x^2`. What is the domain of `f(g(x))`?", options:[
          { t:"`{x ∈ ℝ | -3 < x < 3}`", ok:true, why:"`log_{2}` needs `9 - x^2 > 0`, so `x^2 < 9`: `-3 < x < 3`. At `x = 3`, `log_{2} 0` is undefined." },
          { t:"`{x ∈ ℝ | x < -3 or x > 3}`", why:"That solves `9 - x^2 < 0`, the wrong way round. At `x = 4`, `log_{2}(-7)` is undefined." },
          { t:"`{x ∈ ℝ | x > 0}`", why:"That’s the domain of `f` alone. What matters is whether `g(x) > 0`." },
          { t:"`{x ∈ ℝ}`", why:"That’s the domain of `g` alone. Some outputs of `g` are 0 or negative, and `log_{2}` can’t accept them." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"The graphs show `y = f(x)`, a parabola crossing the `x`-axis at −1 and 2, and `y = g(x)`, a parabola with vertex (0, −2) passing through (±1, −1) and (±2, 2). What are all the solutions of `f(g(x)) = 0`?" + fig("t2a", "Two parabolas on one grid: f, in blue, crosses the x-axis at negative 1 and 2; g, in teal, has vertex (0, negative 2) and passes through (plus or minus 1, negative 1) and (plus or minus 2, 2)"), options:[
          { t:"`x = -2, -1, 1, 2`", ok:true, why:"`f` is 0 only at inputs −1 and 2, so `g(x)` must be −1 or 2. `g(x) = -1` at `x = ±1`, and `g(x) = 2` at `x = ±2`: four solutions." },
          { t:"`x = -1, 2`", why:"Those are the zeros of `f`. They tell you what `g(x)` must <strong>equal</strong>, not what `x` is." },
          { t:"`x = -√2, √2`", why:"Those are the zeros of `g`. But `f(0) = -2`, not 0, so `g(x) = 0` doesn’t help." },
          { t:"`x = -1, 1`", why:"That solves `g(x) = -1` only. `g(x) = 2` gives two more solutions, `x = ±2`." }] },
        b:{ prompt:"The graphs show `y = f(x)`, a parabola crossing the `x`-axis at 1 and 6, and `y = g(x)`, a parabola with vertex (0, −3) passing through (±2, 1) and (±3, 6). What are all the solutions of `f(g(x)) = 0`?" + fig("t2b", "Two parabolas on one grid: f, in blue, crosses the x-axis at 1 and 6; g, in teal, has vertex (0, negative 3) and passes through (plus or minus 2, 1) and (plus or minus 3, 6)"), options:[
          { t:"`x = -3, -2, 2, 3`", ok:true, why:"`g(x)` must be 1 or 6. `g(x) = 1` at `x = ±2` and `g(x) = 6` at `x = ±3`." },
          { t:"`x = 1, 6`", why:"Those are the zeros of `f`: the values `g(x)` must equal." },
          { t:"`x = -√3, √3`", why:"Those are the zeros of `g`. But `f(0) = 6`, not 0." },
          { t:"`x = -2, 2`", why:"That solves `g(x) = 1` only. `g(x) = 6` gives `x = ±3` as well." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"`h(x) = sin^2 x`, where `sin^2 x` means `(sin x)^2`. Which pair gives `h(x) = f(g(x))`?", options:[
          { t:"`g(x) = sin x`, `f(x) = x^2`", ok:true, why:"`sin x` is worked out first, then squared. Check at `x = {π}/{2}`: `sin({π}/{2}) = 1`, and `1^2 = 1 = sin^2({π}/{2})`." },
          { t:"`g(x) = x^2`, `f(x) = sin x`", why:"That builds `sin(x^2)`, which squares `x` first. At `x = {π}/{2}`: `sin({π^2}/{4}) ≈ 0.62`, not 1." },
          { t:"`g(x) = sin x`, `f(x) = 2x`", why:"That builds `2 sin x`. The ² is a power, not a multiplier: at `x = {π}/{2}` it gives 2, not 1." },
          { t:"`g(x) = 2x`, `f(x) = sin x`", why:"That builds `sin 2x`. At `x = {π}/{2}`: `sin π = 0`, not 1." }] },
        b:{ prompt:"`h(x) = cos^3 x`, where `cos^3 x` means `(cos x)^3`. Which pair gives `h(x) = f(g(x))`?", options:[
          { t:"`g(x) = cos x`, `f(x) = x^3`", ok:true, why:"`cos x` first, then cubed. Check at `x = {π}/{3}`: `cos({π}/{3}) = 1/2`, and `(1/2)^3 = 1/8`." },
          { t:"`g(x) = x^3`, `f(x) = cos x`", why:"That builds `cos(x^3)`, which cubes `x` first. At `x = {π}/{3}`: `cos({π^3}/{27}) ≈ 0.41`, not 1/8." },
          { t:"`g(x) = cos x`, `f(x) = 3x`", why:"That builds `3 cos x`: at `x = {π}/{3}` it gives 3/2, not 1/8." },
          { t:"`g(x) = 3x`, `f(x) = cos x`", why:"That builds `cos 3x`: at `x = {π}/{3}`, `cos π = -1`, not 1/8." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"`f(x) = x + 1` and `g(x) = x^2`. Which statement is written correctly and is true?", options:[
          { t:"`" + FOG("f", "g", "2") + " = f(g(2)) = f(4) = 5`", ok:true, why:"`" + FOG("f", "g", "2") + "` means `f(g(2))`: `g` acts first, so 2 → 4 → 5." },
          { t:"`" + FOG("f", "g", "2") + " = f(2) · g(2) = 3 × 4 = 12`", why:"The ∘ means composition, not multiplication." },
          { t:"`" + FOG("f", "g", "2") + " = g(f(2)) = g(3) = 9`", why:"`f" + O + "g` is read “f of g”: the function written on the right, `g`, acts first." },
          { t:"`" + FOG("f", "g", "2") + " = f(2) + g(2) = 3 + 4 = 7`", why:"That’s `(f + g)(2)`, a sum. Composition feeds one output into the other function." }] },
        b:{ prompt:"`f(x) = 2x` and `g(x) = x - 3`. Which statement is written correctly and is true?", options:[
          { t:"`" + FOG("g", "f", "5") + " = g(f(5)) = g(10) = 7`", ok:true, why:"`" + FOG("g", "f", "5") + "` means `g(f(5))`: `f` acts first, so 5 → 10 → 7." },
          { t:"`" + FOG("g", "f", "5") + " = g(5) · f(5) = 2 × 10 = 20`", why:"The ∘ means composition, not multiplication." },
          { t:"`" + FOG("g", "f", "5") + " = f(g(5)) = f(2) = 4`", why:"In `g" + O + "f`, the function on the right, `f`, acts first." },
          { t:"`" + FOG("g", "f", "5") + " = g(5) + f(5) = 2 + 10 = 12`", why:"That’s a sum, `(g + f)(5)`." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"`f(x) = x^2` and `g(x) = √x`. `f(g(x))` simplifies to `x`. Which is the best explanation of the domain of `f(g(x))`?", options:[
          { t:"“`{x ∈ ℝ | x ≥ 0}`. `g` acts first, and `√x` is defined only for `x ≥ 0`, so negative numbers never reach `f`. The simplified formula `x` hides this restriction.”", ok:true, why:"This decides the domain from the machines, in order, and explains why the simplified formula misleads." },
          { t:"“`{x ∈ ℝ}`. The simplified formula `x` is defined for every real number.”", why:"The simplified formula forgets that `√x` acts first. `x = -4` never gets through `√x`." },
          { t:"“`{x ∈ ℝ | x ≥ 0}`. Squaring never gives a negative number.”", why:"The set is right, but the reason is about `f`’s outputs. `f = x^2` accepts every input; the restriction comes from `g`." },
          { t:"“`{x ∈ ℝ | x > 0}`. `√0` is undefined, so 0 is excluded.”", why:"`√0 = 0` is defined, and `(√0)^2 = 0`, so 0 is in the domain." }] },
        b:{ prompt:"`f(x) = 2^x` and `g(x) = log_{2} x`. `f(g(x))` simplifies to `x`. Which is the best explanation of the domain of `f(g(x))`?", options:[
          { t:"“`{x ∈ ℝ | x > 0}`. `g` acts first, and `log_{2} x` is defined only for `x > 0`, so 0 and negative numbers never reach `f`. The simplified formula `x` hides this restriction.”", ok:true, why:"This decides the domain from the machines, in order." },
          { t:"“`{x ∈ ℝ}`. The simplified formula `x` is defined for every real number.”", why:"`log_{2} x` acts first, and `log_{2}(-4)` doesn’t exist." },
          { t:"“`{x ∈ ℝ | x > 0}`. Powers of 2 are always positive.”", why:"The set is right, but positive powers of 2 describe `f`’s outputs. `2^x` accepts every input; the restriction comes from `g`." },
          { t:"“`{x ∈ ℝ | x ≥ 0}`. `log_{2} 0 = 0`, so 0 is allowed.”", why:"`log_{2} 0` is undefined: no power of 2 equals 0." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A stone dropped in a pond makes a circular ripple. Its radius after `t` seconds is `r(t) = 20t` centimetres, and a circle of radius `r` has area `A(r) = πr^2`. After how many seconds is the area inside the ripple 3600π cm²?", options:[
          { t:"3", ok:true, why:"The area as a function of time is `A(r(t)) = π(20t)^2 = 400πt^2`. Set `400πt^2 = 3600π`: `t^2 = 9`, so `t` = 3 s." },
          { t:"9", why:"That’s `t^2`. Take the square root: `t` = 3 s." },
          { t:"60", why:"60 cm is the radius when the area is 3600π cm². The question asks for the time: `r(t) = 60` at `t` = 3 s." },
          { t:"180", why:"That sets the radius `r(t) = 20t` equal to 3600, skipping the area machine `A`." }] },
        b:{ prompt:"An oil spill spreads in a circle. Its radius after `t` hours is `r(t) = 25t` metres, and a circle of radius `r` has area `A(r) = πr^2`. After how many hours is the area of the spill 10 000π m²?", options:[
          { t:"4", ok:true, why:"`A(r(t)) = π(25t)^2 = 625πt^2`. Set it equal to 10 000π: `t^2 = 16`, so `t` = 4 h." },
          { t:"16", why:"That’s `t^2`. Take the square root: `t` = 4 h." },
          { t:"100", why:"100 m is the radius at that moment. The question asks for the time." },
          { t:"400", why:"That sets the radius `25t` equal to 10 000, skipping the area machine." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"`f(x) = log_{2} x` and `g(x) = 2x - 6`. Which describes the graph of `y = f(g(x))`?", options:[
          { t:"Vertical asymptote `x = 3`; `x`-intercept 7/2", ok:true, why:"`y = log_{2}(2x - 6)` needs `2x - 6 > 0`, so the asymptote is `x = 3`. The `x`-intercept is where `2x - 6 = 1`, so `x = 7/2`." },
          { t:"Vertical asymptote `x = 3`; `x`-intercept 4", why:"The asymptote is right, but the intercept (1, 0) of `log_{2} x` was moved 3 right without the horizontal compression. Solve `2x - 6 = 1` instead." },
          { t:"Vertical asymptote `x = 6`; `x`-intercept 13/2", why:"That reads `2x - 6` as a shift of 6. Factor first: `2x - 6 = 2(x - 3)`, so the shift is 3." },
          { t:"Vertical asymptote `x = 0`; `x`-intercept 8", why:"That’s `g(f(x)) = 2 log_{2} x - 6`, with the linear function outside. Here it’s inside." }] },
        b:{ prompt:"`f(x) = log_{3} x` and `g(x) = 3x + 6`. Which describes the graph of `y = f(g(x))`?", options:[
          { t:"Vertical asymptote `x = -2`; `x`-intercept −5/3", ok:true, why:"`log_{3}(3x + 6)` needs `3x + 6 > 0`, so the asymptote is `x = -2`. The `x`-intercept is where `3x + 6 = 1`: `x = -5/3`." },
          { t:"Vertical asymptote `x = -2`; `x`-intercept −1", why:"The intercept of `log_{3} x` was moved 2 left without the compression. Solve `3x + 6 = 1`." },
          { t:"Vertical asymptote `x = -6`; `x`-intercept −17/3", why:"Factor first: `3x + 6 = 3(x + 2)`, so the shift is 2 left, not 6." },
          { t:"Vertical asymptote `x = 0`; `x`-intercept 1/9", why:"That’s `g(f(x)) = 3 log_{3} x + 6`, with the linear function outside." }] } }
    ]
  },
  task:{
    title:"Break it at 2", summary:"Break it at 2",
    statement:"<p>Build `h(x) = f(g(x))` from an outer function `f` and a linear inner function `g(x) = mx + b`, so that `h` is <strong>undefined at `x = 2`</strong>, <strong>defined at `x = 3`</strong>, and <strong>`h(4) = 1`</strong>. There’s more than one design. Can you find them all?</p>",
    checks:["`h` is undefined at `x = 2`", "`h` is defined at `x = 3`", "`h(4) = 1`"],
    tips:["Right now `h(2) = `#1. To break `h` at 2, `g(2)` must be an input `f` can’t take. #2.",
      "`h` is undefined at 3 as well: `g(3) = `#1, which `f` can’t take. You need `x = 2` on the failing side of `f`’s domain edge and `x = 3` on the working side.",
      "Right now `h(4) = `#1. Work backwards: which input does `f` turn into 1? Make `g(4)` equal that input."],
    forbid:{ rt:"√ can’t take negatives", rc:"`1/x` can’t take 0", lg:"`log_{2}` can’t take 0 or negatives", any:"#1 accepts every number, so it can never break: choose another outer function" },
    ui:{ outer:"Outer `f`:", m:"`m`", b:"`b`", undef:"undefined", inner:"inner `y = g(x)`", target:"(4, 1)" },
    explainPrompt:"Explain how you chose `g` for one of your designs: how did you make `h` fail at 2 but work at 3, and how did you get `h(4) = 1`?",
    vocab:"Use the words inner, outer, domain and input.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found all three. Each one sends 4 to the input that `f` turns into 1 (1 for `√x` and `1/x`, 2 for `log_{2} x`), and puts the edge of `f`’s domain where `h` can’t reach it at 2 but can at 3. `x^2` and `2^x` can never work: they accept every input, so they never break."
  },
  cards:[
    ["`f(g(x))`", "Put `x` into `g` first, then put `g(x)` into `f`. Work from the inside out: `f(x) = x^2`, `g(x) = x + 3` gives `f(g(2)) = f(5) = 25`."],
    ["`" + FOG("f", "g", "x") + "`", "Another way to write `f(g(x))`, read “f composed with g”. The function on the right, `g`, acts first."],
    ["Does order matter?", "Usually. `f(x) = x^2`, `g(x) = x + 3`: `f(g(x)) = (x + 3)^2` but `g(f(x)) = x^2 + 3`."],
    ["Domain of `f(g(x))`", "Every `x` in the domain of `g` whose output `g(x)` is in the domain of `f`. `√{x - 3}` needs `x ≥ 3`."],
    ["Simplify with care", "`(√x)^2` simplifies to `x`, but its domain is still `{x ∈ ℝ | x ≥ 0}`. Decide the domain before you simplify."],
    ["`√{x^2}`", "Equals `x` when `x ≥ 0` and `-x` when `x < 0`: never negative. `√{(-3)^2} = 3`."],
    ["A composite from tables", "Look up `x` in `g`’s table, then look up `g(x)` in `f`’s table. If `g(x)` isn’t an input in `f`’s table, `f(g(x))` is undefined there."],
    ["A composite from graphs", "Read `g(x)` on `g`’s graph, then use that number as the input on `f`’s graph. On one grid, the line `y = x` turns the output into an input."],
    ["A function and its inverse", "`f(f^{-1}(x)) = x` for every `x` in the domain of `f^{-1}`; `f^{-1}(f(x)) = x` for every `x` in the domain of `f`. Example: `2^{log_{2} x} = x` for `x > 0`, and `log_{2}(2^x) = x` for every `x`."],
    ["Decomposing `h(x) = (2x - 5)^3`", "Inner `g(x) = 2x - 5`, outer `f(x) = x^3`. Another split works too: `g(x) = 2x`, `f(x) = (x - 5)^3`."],
    ["A linear function inside", "`f(k(x - d))`: horizontal changes, the opposite way to how they look. `f(x - 4)` moves 4 units right; `f(2x)` compresses by a factor of 1/2."],
    ["A linear function outside", "`af(x) + c`: vertical changes, as they look. `3f(x) - 6` stretches vertically by a factor of 3, then moves down 6."]
  ]
};
