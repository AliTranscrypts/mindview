// MHF4U 06 Even and Odd Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/06-even-and-odd-functions.md

// Explore challenges: a button that loads the challenge's starting function into the sign-flipper.
const LOAD = id => ' <button type="button" class="btn ghost sm sf-load" data-load="' + id + '">Load this function</button>';

// Practice 1 (sorter): misconception feedback built from the item and the box.
const M2 = "Look at every term, not just the highest power.";
const M3 = "The constant is an even-power term. It doesn’t flip.";
const M8 = "Expand the brackets first, then look at the powers.";
const WD = "List the powers, counting a constant as power 0. All even: Even. All odd: Odd. A mixture: Neither.";
const H1 = "Write the function as a sum of terms (expand if needed).";
const sortItem = (id, t, answer, why, hints, wrong) => ({ id, t, answer, why, hints, wrong });

export default {
  id:"06-even-and-odd-functions",
  kind:"topic",
  title:"Even and odd functions",
  topic:"Even and Odd Functions",
  readyTopic:"even and odd functions",
  hero:{
    eq:'<i>f</i>(<span class="hero-hl">−<i>x</i></span>) = ?', eqLabel:"f of negative x equals what?",
    headline:"Swap `x` for `-x` and see who flips",
    text:"In module 01 you folded and spun power functions. Here you’ll test any polynomial with algebra. Replace `x` with `-x`: the <strong>odd-power</strong> terms change sign and the <strong>even-power</strong> terms don’t. If nothing changes, the function is <strong>even</strong>. If everything changes sign, it’s <strong>odd</strong>. If only some terms change, it’s <strong>neither</strong>.",
    fig:{ html:'<div class="hero-eo" id="hero-eo" role="img" aria-label="Three rows of term tiles. In f of x equals x to the 4 minus 2 x squared plus 3, nothing flips when x is replaced with negative x: even, symmetric in the y-axis. In g of x equals x cubed minus 4 x, everything flips: odd, unchanged by a half-turn about the origin. In h of x equals x cubed plus x squared, some terms flip: neither."></div>' }
  },
  goals:[
    "I can find `f(-x)` for a polynomial by replacing `x` with `-x`, term by term.",
    "I can decide algebraically whether a polynomial is even, odd or neither by comparing `f(-x)` with `f(x)` and with `-f(x)`.",
    "I can connect even functions to symmetry in the `y`-axis and odd functions to half-turn symmetry about the origin.",
    "I can predict the answer from the powers of the terms, remembering that a constant is an even-power term.",
    "I can use symmetry to find unknown values and complete a graph."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Powers of negatives", goal:1, prompt:"Which expression equals `(-x)^3`?",
          options:[
            { t:"`-x^3`", ok:true, why:"`(-x)(-x)(-x)`: three negatives multiply to a negative." },
            { t:"`x^3`", why:"Two negatives make a positive, but the third makes it negative again." },
            { t:"`-3x`", why:"The exponent means multiply `-x` by itself 3 times." },
            { t:"`x^{-3}`", why:"`x^{-3}` means `1/x^3`. A minus sign inside the bracket isn’t an exponent." }],
          hints:["Write `(-x)^3` as three factors.", "`(-x)(-x) = x^2`. Multiply by one more `-x`.", "`x^2 · (-x) = -x^3`."] },
        { id:"w2", skill:"Powers of negatives", goal:1, prompt:"What is `(-2)^4`?",
          options:[
            { t:"`-16`", why:"`(-2)(-2)(-2)(-2)`: four negatives make a positive." },
            { t:"`-8`", why:"The exponent 4 means four factors of −2, not × 4." },
            { t:"`8`", why:"`2^4 = 2 × 2 × 2 × 2 = 16`." },
            { t:"`16`", ok:true, why:"An even power of a negative number is positive: `(-2)^4 = 16`." }],
          hints:["How many negative factors are there?", "Four: an even number.", "`(-2)^4 = 16`."] },
        { id:"w3", skill:"Function notation", goal:1, prompt:"`f(x) = x^2 - 3x`. What is `f(-2)`?",
          options:[
            { t:"`-10`", why:"`(-2)^2 = +4` and `-3(-2) = +6`." },
            { t:"`-2`", why:"`-3 × (-2) = +6`, so `f(-2) = 4 + 6`." },
            { t:"`2`", why:"`(-2)^2 = (-2)(-2) = 4`." },
            { t:"`10`", ok:true, why:"`(-2)^2 - 3(-2) = 4 + 6 = 10`." }],
          hints:["Put −2 in brackets everywhere you see `x`.", "`(-2)^2 - 3(-2)`. Work out each part.", "4 + 6 = 10."] },
        { id:"w4", skill:"Symmetry of power functions", goal:3, prompt:"From module 01: which symmetry does the graph of `y = x^4` have?",
          options:[
            { t:"It’s symmetric in the `y`-axis: folding along the `y`-axis matches the two halves", ok:true, why:"Even power: `(-x)^4 = x^4`, so the heights at `x` and `-x` are the same." },
            { t:"A half-turn about the origin maps it onto itself", why:"That’s the symmetry of odd powers like `x^3`." },
            { t:"It’s symmetric in the `x`-axis", why:"`y = x^4` is never negative, so its reflection in the `x`-axis is a different graph." },
            { t:"It has no symmetry", why:"Fold the graph along the `y`-axis: the arms land on each other." }],
          hints:["Compare the heights at `x = 2` and `x = -2`.", "Both are 16.", "Equal heights at `x` and `-x` mean symmetry in the `y`-axis."] },
        { id:"w5", skill:"Function notation", goal:2, prompt:"`f(x) = x^3 + 2`. What is `-f(x)`?",
          options:[
            { t:"`-x^3 - 2`", ok:true, why:"`-f(x) = -1 × (x^3 + 2)`: every term changes sign." },
            { t:"`-x^3 + 2`", why:"The minus applies to the whole function, including the +2." },
            { t:"`(-x)^3 + 2`", why:"That’s `f(-x)`, replacing `x`. `-f(x)` multiplies the outputs by −1." },
            { t:"`x^3 - 2`", why:"Both terms change sign." }],
          hints:["`-f(x)` means `-1 × f(x)`.", "`-1 × (x^3 + 2)`. Distribute.", "`-x^3 - 2`."] },
        { id:"w6", skill:"Reflections", goal:3, prompt:"The graph of `y = f(-x)` is the graph of `y = f(x)` reflected in which line?",
          options:[
            { t:"The `y`-axis", ok:true, why:"The point `(a, b)` on `y = f(x)` becomes `(-a, b)`: left and right swap." },
            { t:"The `x`-axis", why:"Reflecting in the `x`-axis is `y = -f(x)`." },
            { t:"The line `y = x`", why:"Reflecting in `y = x` gives the inverse, `f^{-1}`." },
            { t:"The origin", why:"A half-turn is both reflections at once: `y = -f(-x)`." }],
          hints:["In `f(-x)`, what happens to the inputs?", "The input `a` now gives what `f` gave at `-a`.", "So each point moves to the opposite side of the `y`-axis: a reflection in the `y`-axis."] }
      ],
      refreshers:{
        "Powers of negatives":"A negative number to an even power is positive: `(-2)^4 = 16` and `(-x)^2 = x^2`. To an odd power it stays negative: `(-2)^3 = -8` and `(-x)^3 = -x^3`.",
        "Function notation":"`f(-2)` means put −2 in for every `x`, in brackets: `f(x) = x^2 - 3x` gives `f(-2) = 4 + 6 = 10`. `-f(x)` means −1 times the whole function: every term changes sign.",
        "Symmetry of power functions":"From module 01: even powers (`x^2`, `x^4`) are symmetric in the `y`-axis. Odd powers (`x`, `x^3`) look the same after a half-turn about the origin.",
        "Reflections":"`y = f(-x)` reflects the graph in the `y`-axis. `y = -f(x)` reflects it in the `x`-axis."
      }
    }
  },
  explore:{
    heading:"Term sign-flipper",
    intro:"Build a polynomial from term tiles. Press ‘Replace `x` with `-x`’ and watch which tiles flip. Then compare `f(-x)` with `f(x)` and with `-f(x)`.",
    predIntro:"Make a prediction first. Then the sign-flipper will show you what really happens.",
    predictions:[
      { id:"p1", start:{ c:[3, 0, -2, 0, 1, 0], view:"tiles" },
        prompt:"`f(x) = x^4 - 2x^2 + 3`. When `x` is replaced with `-x`, which terms will change sign?",
        options:[{ t:"None of them", ok:true }, { t:"All of them" }, { t:"`x^4` and `-2x^2` only" }, { t:"Only the constant 3" }],
        explain:"`(-x)^4 = x^4` and `(-x)^2 = x^2`, and the constant has no `x` at all. Every term is an even power, so `f(-x) = f(x)`: `f` is even." },
      { id:"p2", start:{ c:[0, -4, 0, 1, 0, 0], view:"tiles" },
        prompt:"`f(x) = x^3 - 4x` is odd. A constant term +1 will be added. What will `f(x) = x^3 - 4x + 1` be?",
        options:[{ t:"Neither even nor odd", ok:true }, { t:"Still odd, because the degree is odd" }, { t:"Even" }, { t:"Both even and odd" }],
        explain:"The constant is `1 · x^0`, an even power: it doesn’t change sign. So `f(-x) = -x^3 + 4x + 1`, while `-f(x) = -x^3 + 4x - 1`. They differ only in the constant, but that’s enough: neither." },
      { id:"p3", start:{ c:[0, 4, 0, -5, 0, 1], view:"graph" },
        prompt:"The graph of `f(x) = x^5 - 5x^3 + 4x` is shown. Turn on ‘Half-turn about the origin’. What will the ghost do?",
        options:[{ t:"Land exactly on the graph", ok:true }, { t:"Land on the graph’s mirror image in the `y`-axis, but not on the graph" }, { t:"Land on the graph’s reflection in the `x`-axis" }, { t:"Not match anything" }],
        explain:"All three terms are odd powers, so `f(-x) = -f(x)`. A half-turn sends `(a, b)` to `(-a, -b)`, and that point is on the graph because `f(-a) = -b`." },
      { id:"p4", start:{ c:[1, -2, 1, 0, 0, 0], view:"graph", unexp:true },
        prompt:"Is `f(x) = (x - 1)^2` even, odd or neither?",
        options:[{ t:"Neither", ok:true }, { t:"Even, because it’s squared" }, { t:"Odd" }, { t:"Both" }],
        explain:"Squaring a whole bracket doesn’t make every term an even power: `x^2 - 2x + 1` has a `-2x` term, which flips. The graph is symmetric about `x = 1`, not about the `y`-axis." }
    ],
    chalIntro:"Set the tiles, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Change <strong>one</strong> coefficient of `f(x) = 2x^4 + 3x^3 - x^2 + 5` so that `f` is even." + LOAD("tc1"),
        start:[5, 0, -1, 3, 2, 0],
        why:"Only `3x^3` is an odd power. With its coefficient set to 0, `f(x) = 2x^4 - x^2 + 5` has only even powers.",
        hints:["Which term changes sign when `x → -x`?", "Only `3x^3` is an odd power.", "Set the `x^3` coefficient to 0: `f(x) = 2x^4 - x^2 + 5`."] },
      { id:"tc2", goal:[2, 4], prompt:"Remove as few terms as possible (set them to 0) from `g(x) = x^5 - 2x^4 + 3x^2 - x + 4` so that `g` is <strong>odd</strong>." + LOAD("tc2"),
        start:[4, -1, 3, 0, -2, 1],
        why:"The three even-power terms `-2x^4`, `3x^2` and 4 had to go, and nothing else: `g(x) = x^5 - x`.",
        hints:["Which terms would stay the same when `x → -x`?", "The even-power terms: `-2x^4`, `3x^2` and the constant 4.", "Remove those three: `g(x) = x^5 - x`."] },
      { id:"tc3", goal:[2, 5], stretch:true,
        prompt:"Build a polynomial (any tiles) that is <strong>neither</strong> even nor odd, passes through the origin, and still has `f(1) = f(-1)`. Use the one-value test to show it.",
        why:"The odd-power coefficients add to 0, so `f(1) = f(-1)`, and the even-power term keeps it from being odd. For example, `f(x) = x^3 - x + x^2` has `f(1) = f(-1) = 1` but is neither: one matching pair isn’t a proof.",
        hints:["`f(1)` and `f(-1)` differ only in the odd-power terms. What must those add up to?", "The odd-power coefficients must add to 0, like `x^3 - x`. Then add an even-power term so it isn’t odd.", "`x^3 - x + x^2`: `f(1) = 1 - 1 + 1 = 1` and `f(-1) = -1 + 1 + 1 = 1`. But `f(2) = 10` and `f(-2) = -2`: neither."] }
    ]
  },
  part3:{
    slug:"mirror", name:"Mirror",
    heading:"Mirror lab: make it even, make it odd",
    intro:"Each polynomial is drawn with its even part and its odd part. Remove or change terms, then run the mirror test and the half-turn test.",
    alg:"`f(x) = E(x) + O(x)`. Replacing `x` with `-x` leaves `E` alone and flips `O`: `f(-x) = E(x) - O(x)`. So `f(-x) = f(x)` exactly when `O = 0` (even), and `f(-x) = -f(x)` exactly when `E = 0` (odd).",
    rounds:[
      { id:"r1", start:[2, -3, 0, 1, 0, 0], target:"odd", parts:"`E = 2`, `O = x^3 - 3x`",
        goal:"Remove one term to make `f` odd.",
        wrong:[{ removed:[1], fb:"Still not odd: the constant 2 doesn’t flip." }],
        why:"Without the +2, `f(x) = x^3 - 3x`: `E = 0`, so `f(-x) = -f(x)` and the half-turn test matches." },
      { id:"r2", start:[0, 1, -4, 0, 1, 0], target:"even", parts:"`E = x^4 - 4x^2`, `O = x`",
        goal:"Remove one term to make `f` even.",
        wrong:[{ removed:[4], fb:"`x` still flips, so the mirror test still fails." }],
        why:"Without the `+x`, `f(x) = x^4 - 4x^2`: `O = 0`, so `f(-x) = f(x)` and the mirror test matches." },
      { id:"r3", start:[-2, -1, 2, 1, 0, 0], target:"pick", parts:"`E = 2x^2 - 2`, `O = x^3 - x`",
        eq:"`f(x) = (x + 2)(x^2 - 1)`<br>`= x^3 + 2x^2 - x - 2`",
        goal:"Which curve is `y = f(-x)`? Tap it.",
        cands:[
          { e:1, o:1, name:"`E + O`", fb:"That’s `f` itself." },
          { e:-1, o:-1, name:"`-E - O`", fb:"That’s `-f(x)`, the reflection in the `x`-axis." },
          { e:1, o:-1, name:"`E - O`", ok:true, fb:"Right. `f(-x) = E(x) - O(x) = -x^3 + 2x^2 + x - 2`: `E` stays and `O` flips." },
          { e:-1, o:1, name:"`-E + O`", fb:"That’s `-f(-x)`, the half-turn." }] }
    ],
    blocks:[{ title:"What the tests mean", html:"<p><strong>Even, odd or neither: the rule</strong></p><ul><li><strong>Even:</strong> every term has an even power (a constant counts). `f(-x) = f(x)`. The graph is symmetric in the `y`-axis.</li><li><strong>Odd:</strong> every term has an odd power (no constant). `f(-x) = -f(x)`. A half-turn about the origin maps the graph onto itself, and the graph passes through (0, 0).</li><li><strong>Neither:</strong> a mixture. Most polynomials are neither.</li></ul>" }],
    quickCheck:{
      title:"Even, odd or neither?", summary:"Even, odd or neither?",
      items:[
        { id:"q1", goal:[2, 4], prompt:"`f(x) = 3x^6 - x^2 + 7`",
          choices:[{ t:"Even", ok:true, fb:"Right. Powers 6, 2 and 0 are all even." }, { t:"Odd", fb:"All three powers are even, including the constant’s power 0. Nothing flips." }, { t:"Neither", fb:"All three powers are even, including the constant’s power 0. Nothing flips." }] },
        { id:"q2", goal:[2, 4], prompt:"`g(x) = -2x^5 + x^3 - 6x`",
          choices:[{ t:"Even", fb:"Every term is an odd power, so every term flips: `g(-x) = -g(x)`." }, { t:"Odd", ok:true, fb:"Right. Powers 5, 3 and 1 are all odd, and there’s no constant." }, { t:"Neither", fb:"Every term is an odd power, so every term flips: `g(-x) = -g(x)`." }] },
        { id:"q3", goal:[2, 4], prompt:"`h(x) = x(x^2 - 4)`",
          choices:[{ t:"Even", fb:"Expand first: `x^3 - 4x`. Both powers are odd." }, { t:"Odd", ok:true, fb:"Right. Expanded, it’s `x^3 - 4x`: only odd powers." }, { t:"Neither", fb:"Expand first: `x^3 - 4x`. Both powers are odd." }] },
        { id:"q4", goal:[2, 4], prompt:"`k(x) = (x + 1)(x - 1) + x`",
          choices:[{ t:"Even", fb:"Expand: `x^2 - 1 + x`. The `x` term flips; the others don’t." }, { t:"Odd", fb:"Expand: `x^2 - 1 + x`. The `x` term flips; the others don’t." }, { t:"Neither", ok:true, fb:"Right. It’s `x^2 + x - 1`: a mix of powers." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Even, odd or neither?", summary:"Sort", noun:"function", goal:[2, 4],
        instruction:"Sort each function.", how:"Tap a function, then tap the box it belongs in.",
        wrongDefault:WD,
        boxes:[{ id:"ev", label:"Even" }, { id:"od", label:"Odd" }, { id:"ne", label:"Neither" }],
        items:[
          sortItem("i1", "`y = x^4 - 2x^2`", "ev", "Only even powers.",
            [H1, "List the powers, counting a constant as power 0: here they are 4 and 2.", "All even powers: Even."], { od:WD, ne:WD }),
          sortItem("i2", "`y = 5x^3 - x`", "od", "Only odd powers, no constant.",
            [H1, "List the powers, counting a constant as power 0: here they are 3 and 1, with no constant.", "All odd powers: Odd."], { ev:WD, ne:WD }),
          sortItem("i3", "`y = x^3 + 1`", "ne", "`x^3` flips; the constant doesn’t.",
            [H1, "List the powers, counting a constant as power 0: here they are 3 and 0.", "A mixture of even and odd powers: Neither."], { od:M2 + " " + M3, ev:WD }),
          sortItem("i4", "`y = -7`", "ev", "A constant is an even power (`x^0`): `f(-x) = -7 = f(x)`.",
            [H1, "List the powers, counting a constant as power 0: the only power here is 0.", "0 is even: Even."], { od:M3, ne:M3 }),
          sortItem("i5", "`y = x^5 - 3x^3 + 2x`", "od", "Powers 5, 3, 1: all odd.",
            [H1, "List the powers, counting a constant as power 0: here they are 5, 3 and 1, with no constant.", "All odd powers: Odd."], { ev:WD, ne:WD }),
          sortItem("i6", "`y = (x - 2)^2`", "ne", "`x^2 - 4x + 4`: the `-4x` term flips.",
            ["Expand the bracket first.", "`(x - 2)^2 = x^2 - 4x + 4`. The powers are 2, 1 and 0.", "A mixture of even and odd powers: Neither."], { ev:M8, od:M8 }),
          sortItem("i7", "`y = x^2 · x^3`", "od", "`x^2 · x^3 = x^5`: one odd power.",
            ["Simplify the product.", "Exponents add: `x^2 · x^3 = x^5`.", "One odd-power term: Odd."], { ev:"Multiply out the product first, then look at the powers.", ne:"Multiply out the product first, then look at the powers." }),
          sortItem("i8", "`y = (x^2 + 1)(x^2 - 3)`", "ev", "`x^4 - 2x^2 - 3`: all even powers.",
            ["Expand the brackets first.", "`(x^2 + 1)(x^2 - 3) = x^4 - 2x^2 - 3`. The powers are 4, 2 and 0.", "All even powers: Even."], { od:M8, ne:M8 }),
          sortItem("i9", "`y = x(x^2 + 1)`", "od", "`x^3 + x`: all odd powers.",
            ["Expand the bracket first.", "`x(x^2 + 1) = x^3 + x`. The powers are 3 and 1, with no constant.", "All odd powers: Odd."], { ev:M8, ne:M8 }),
          sortItem("i10", "`y = 2x^6 + x^5`", "ne", "`x^6` is even, `x^5` is odd: a mixture.",
            [H1, "List the powers, counting a constant as power 0: here they are 6 and 5.", "A mixture of even and odd powers: Neither."], { ev:M2, od:M2 })
        ] },
      { id:"symm", type:"custom", title:"Use the symmetry", summary:"Use the symmetry", star:true, goal:[2, 5],
        instruction:"Use what you know about even and odd functions. No calculator needed.",
        how:"Type your answer, then press Check. Items 3 to 6 (★) ask you to reason backwards from the definitions.",
        items:[
          { id:"u1", kind:"num", goal:5, prompt:"`f` is even and `f(3) = 7`. Find `f(-3)`.", label:"`f(-3) =`", answer:7, display:"`f(-3) = 7`",
            why:"Even means `f(-x) = f(x)`, so `f(-3) = f(3) = 7`.",
            wrong:[{ match:-7, fb:"That’s the odd rule. Even means `f(-x) = f(x)`." }],
            general:"Even means `f(-x) = f(x)`. Which value of `f` do you already know?",
            hints:["Even means `f(-x) = f(x)`.", "So `f(-3) = f(3)`.", "`f(-3) = f(3) = 7`."] },
          { id:"u2", kind:"num", goal:5, prompt:"`g` is odd and `g(2) = -5`. Find `g(-2)`.", label:"`g(-2) =`", answer:5, display:"`g(-2) = 5`",
            why:"Odd means `g(-x) = -g(x)`, so `g(-2) = -(-5) = 5`.",
            wrong:[{ match:-5, fb:"That’s the even rule. Odd means `g(-x) = -g(x) = 5`." }],
            general:"Odd means `g(-x) = -g(x)`. Which value of `g` do you already know?",
            hints:["Odd means `g(-x) = -g(x)`.", "So `g(-2) = -g(2)`.", "`g(-2) = -(-5) = 5`."] },
          { id:"u3", kind:"num", goal:[2, 5], star:true, prompt:"`h` is an odd polynomial. What is `h(0)`?", label:"`h(0) =`", answer:0, display:"`h(0) = 0`",
            why:"`h(0) = -h(0)`, so `h(0) = 0`. Every odd polynomial passes through the origin.",
            general:"Put `x = 0` into `h(-x) = -h(x)`: `h(0) = -h(0)`, so `h(0) = 0`. Every odd polynomial passes through the origin.",
            hints:["Put `x = 0` into `h(-x) = -h(x)`.", "`-0 = 0`, so the equation says `h(0) = -h(0)`.", "The only number equal to its own opposite is 0: `h(0) = 0`."] },
          { id:"u4", kind:"num", goal:[2, 5], star:true, prompt:"`f(x) = ax^3 + bx^2 + 2x + c` is odd, and `f(1) = 5`. Find `a`.", label:"`a =`", answer:3, display:"`a = 3`",
            why:"Odd forces `b = 0` and `c = 0`. Then `f(1) = a + 2 = 5`, so `a = 3`.",
            wrong:[{ match:5, fb:"Odd forces `b = 0` and `c = 0`. Then `f(1) = a + 2 = 5`." }, { match:7, fb:"`a + 2 = 5` gives `a = 3`, not 7." }],
            general:"An odd polynomial has no even-power terms, so `b` and `c` must be 0. What’s left of `f(1)`?",
            hints:["An odd polynomial has only odd-power terms.", "So `b = 0` and `c = 0`, which leaves `f(x) = ax^3 + 2x`.", "`f(1) = a + 2 = 5`, so `a = 3`."] },
          { id:"u5", kind:"mc", goal:2, star:true, prompt:"`p(x) = x^4 + kx^3 - 5x^2 + (k - 2)x + 1`. For which value of `k` is `p` even?",
            options:[
              { t:"`k = 0`", why:"Then the `x`-term is `-2x`, which flips." },
              { t:"`k = 2`", why:"Then the `x^3` term is `2x^3`, which flips." },
              { t:"`k = -2`", why:"Then both odd terms are there: `-2x^3` and `-4x`." },
              { t:"No value of `k` works", ok:true, why:"Both odd-power coefficients, `k` and `k - 2`, would have to be 0, and that can’t happen for one value of `k`." }],
            hints:["For `p` to be even, every odd-power term must vanish.", "The odd-power terms are `kx^3` and `(k - 2)x`. Both coefficients must be 0.", "`k = 0` and `k - 2 = 0` can’t both be true, so no value of `k` works."] },
          { id:"u6", kind:"num", goal:5, star:true, prompt:"`f = E + O`, where `E` is even and `O` is odd. `f(2) = 10` and `f(-2) = 4`. Find `E(2)`.", label:"`E(2) =`", answer:7, display:"`E(2) = 7`",
            why:"`f(2) + f(-2) = 2E(2) = 14`, so `E(2) = 7` (and `O(2) = 3`).",
            wrong:[{ match:10, fb:"`f(2) = E(2) + O(2) = 10` and `f(-2) = E(2) - O(2) = 4`. Add them." }, { match:4, fb:"`f(2) = E(2) + O(2) = 10` and `f(-2) = E(2) - O(2) = 4`. Add them." }, { match:3, fb:"That’s `O(2)`. `E(2) = (10 + 4) ÷ 2`." }],
            general:"Write `f(2)` and `f(-2)` using `E` and `O`, then add them.",
            hints:["Write `f(2)` and `f(-2)` using `E` and `O`.", "`f(2) = E(2) + O(2) = 10`. `f(-2) = E(-2) + O(-2) = E(2) - O(2) = 4`.", "Adding: `2E(2) = 14`, so `E(2) = 7` (and `O(2) = 3`)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Noah", how:"",
        instruction:"Noah made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Is `f(x) = x^4 - 3x^2 + x` even, odd or neither?",
            steps:["`f(-x) = (-x)^4 - 3(-x)^2 + (-x)`", "`= -x^4 + 3x^2 - x`", "That’s `-f(x)`.", "So `f` is odd."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 follows. The mistake is earlier."],
            fixes:[
              { t:"`(-x)^4 = x^4` and `(-x)^2 = x^2`, so `f(-x) = x^4 - 3x^2 - x`. That’s neither `f(x)` nor `-f(x)`: neither.", ok:true, why:"Only the `x` term flips." },
              { t:"`f(-x) = x^4 - 3x^2 + x = f(x)`, so `f` is even.", why:"`(-x) = -x`: the last term does flip." },
              { t:"`f(-x) = -x^4 - 3x^2 - x`.", why:"`(-x)^4` is positive: an even power of a negative is positive." },
              { t:"Step 2 is correct as written.", why:"`(-x)^4 = x^4`, not `-x^4`. Even powers lose the minus sign." }],
            hints:["Check each power of `-x` in step 2.", "Is `(-x)^4` positive or negative? What about `(-x)^2`?", "Step 2 is wrong: `f(-x) = x^4 - 3x^2 - x`, so `f` is neither."] },
          { id:"e2", goal:2, task:"Is `g(x) = 2x^3 - 5x + 4` even, odd or neither?",
            steps:["`g(-x) = 2(-x)^3 - 5(-x) + 4`", "`= -2x^3 + 5x + 4`", "`g(-x) ≠ g(x)`, so `g` is not even.", "Since it isn’t even, it must be odd."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Compare with `-g(x) = -2x^3 + 5x - 4`. The constants differ (+4 vs −4), so `g` is neither.", ok:true, why:"There are three possibilities, so check both." },
              { t:"Since it isn’t even, it’s neither, without checking further.", why:"That happens to be true here, but you still need the comparison with `-g(x)` to know it isn’t odd." },
              { t:"Since its degree is odd, it’s odd.", why:"The degree doesn’t decide: the constant 4 doesn’t flip." },
              { t:"Step 4 is correct as written.", why:"‘Not even’ doesn’t mean ‘odd’. Most polynomials are neither." }],
            hints:["How many possible answers are there?", "Three: even, odd, neither. Step 4 skips a comparison.", "Step 4 is wrong: `-g(x) = -2x^3 + 5x - 4 ≠ g(-x)`, so `g` is neither."] },
          { id:"e3", goal:2, task:"Is `h(x) = x^4 - x^3 - x^2 + x` even? Noah tests a value.",
            steps:["`h(1) = 1 - 1 - 1 + 1 = 0`.", "`h(-1) = 1 + 1 - 1 - 1 = 0`.", "`h(1) = h(-1)`, so `h` is even.", "So its graph is symmetric in the `y`-axis."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"One pair isn’t enough. `h(2) = 6` but `h(-2) = 18`. Checking the terms: `h(-x) = x^4 + x^3 - x^2 - x`, which is neither `h(x)` nor `-h(x)`.", ok:true, why:"The test must hold for every `x`." },
              { t:"`h(1) = h(-1) = 0`, so `h` is odd.", why:"Matching zeros don’t make it odd either: `h(2) = 6` but `-h(-2) = -18`." },
              { t:"Test `x = 0` as well: `h(0) = 0`, so it’s even.", why:"More single values can still mislead. Check the terms." },
              { t:"Step 3 is correct as written.", why:"`h(2) = 16 - 8 - 4 + 2 = 6` and `h(-2) = 16 + 8 - 4 - 2 = 18`. Not equal." }],
            hints:["Does one matching pair prove it for every `x`?", "Try `x = 2` and `x = -2`.", "Step 3 is wrong: `h(2) ≠ h(-2)`. Testing the terms shows `h` is neither."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the sign-flipper: the constant, the one-value test, or `(x - 1)^2`?" },
      { id:"j2", q:"In your own words, why do only the odd-power terms change sign when you replace `x` with `-x`?" },
      { id:"j3", q:"Explain to a friend how to show algebraically that a function is odd. What two things do you compare?" },
      { id:"j4", q:"Which part are you still unsure about: the algebra, the symmetry, or using symmetry to find values? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`f(x) = 2x^4 - x^3 + 5x`. What is `f(-x)`?", options:[
          { t:"`2x^4 + x^3 - 5x`", ok:true, why:"The odd-power terms `-x^3` and `5x` flip; `2x^4` doesn’t." },
          { t:"`-2x^4 + x^3 - 5x`", why:"`(-x)^4 = x^4`, so `2x^4` stays positive. (This is `-f(x)`.)" },
          { t:"`2x^4 - x^3 - 5x`", why:"`-x^3` flips too: `-(-x)^3 = +x^3`." },
          { t:"`-2x^4 - x^3 - 5x`", why:"That flips `2x^4` and leaves `-x^3` alone: the wrong way round." }] },
        b:{ prompt:"`g(x) = -3x^5 + x^2 - 4`. What is `g(-x)`?", options:[
          { t:"`3x^5 + x^2 - 4`", ok:true, why:"Only the odd-power term `-3x^5` flips." },
          { t:"`3x^5 - x^2 + 4`", why:"`x^2` and −4 don’t flip. (This is `-g(x)`.)" },
          { t:"`-3x^5 + x^2 - 4`", why:"`-3(-x)^5 = +3x^5`: the odd power flips." },
          { t:"`3x^5 - x^2 - 4`", why:"`(-x)^2 = x^2`, so `x^2` stays positive." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which function is odd?", options:[
          { t:"`y = x^3 + x`", ok:true, why:"Powers 3 and 1: both odd, no constant." },
          { t:"`y = x^3 + 1`", why:"The constant 1 doesn’t flip, so it’s neither." },
          { t:"`y = x^4 - x`", why:"`x^4` is an even power: neither." },
          { t:"`y = x^2 + x^4`", why:"Both powers are even: that’s even." }] },
        b:{ prompt:"Which function is even?", options:[
          { t:"`y = x^4 - 3x^2 + 8`", ok:true, why:"Powers 4, 2 and 0: all even." },
          { t:"`y = x^4 + x`", why:"The `x` term flips: neither." },
          { t:"`y = x^3`", why:"That’s odd." },
          { t:"`y = (x + 1)^2`", why:"`x^2 + 2x + 1`: the `2x` term flips, so it’s neither." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which symmetry does the graph of every odd function have?", options:[
          { t:"A half-turn about the origin maps it onto itself", ok:true, why:"`(a, b)` on the graph means `(-a, -b)` is too." },
          { t:"Symmetry in the `y`-axis", why:"That’s even functions." },
          { t:"Symmetry in the `x`-axis", why:"A function’s graph can’t be symmetric in the `x`-axis unless it lies on it." },
          { t:"Symmetry in the line `y = x`", why:"That’s a function and its inverse." }] },
        b:{ prompt:"Which symmetry does the graph of every even function have?", options:[
          { t:"Symmetry in the `y`-axis", ok:true, why:"`(a, b)` on the graph means `(-a, b)` is too." },
          { t:"A half-turn about the origin maps it onto itself", why:"That’s odd functions." },
          { t:"Symmetry in the `x`-axis", why:"A function’s graph can’t be symmetric in the `x`-axis unless it lies on it." },
          { t:"Symmetry in the line `y = x`", why:"That’s a function and its inverse." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"`f(x) = x^5 - 2x^3 + kx^2`, where `k` is a constant. For which value of `k` is `f` odd?", options:[
          { t:"0", ok:true, why:"`kx^2` is an even-power term; it must vanish." },
          { t:"2", why:"Then the `2x^2` term doesn’t flip, so `f` isn’t odd." },
          { t:"−2", why:"Then the `-2x^2` term doesn’t flip, so `f` isn’t odd." },
          { t:"Any value of `k`, because the degree is odd", why:"Every term must be an odd power. The degree alone doesn’t decide." }] },
        b:{ prompt:"`g(x) = x^4 + kx^3 - 6`, where `k` is a constant. For which value of `k` is `g` even?", options:[
          { t:"0", ok:true, why:"`kx^3` is an odd-power term; it must vanish." },
          { t:"6", why:"Then the `6x^3` term flips, so `g` isn’t even." },
          { t:"−6", why:"Then the `-6x^3` term flips, so `g` isn’t even." },
          { t:"Any value of `k`, because the degree is even", why:"Every term must be an even power. The degree alone doesn’t decide." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`f` is odd, `f(2) = 5` and `f(4) = -1`. What is `f(-4) + f(-2)`?", options:[
          { t:"−6", why:"`f(-4) = -f(4) = +1`, not −1." },
          { t:"−4", ok:true, why:"`f(-4) = -(-1) = 1` and `f(-2) = -5`. Sum: −4." },
          { t:"4", why:"That uses the even rule: `f(-4) = -1` and `f(-2) = 5`." },
          { t:"6", why:"`f(-2) = -f(2) = -5`, not 5." }] },
        b:{ prompt:"`g` is even, `g(1) = -3` and `g(5) = 2`. What is `g(-1) - g(-5)`?", options:[
          { t:"−5", ok:true, why:"`g(-1) = -3` and `g(-5) = 2`. −3 − 2 = −5." },
          { t:"−1", why:"`g(-5) = g(5) = 2`, so subtract 2: −3 − 2." },
          { t:"1", why:"`g(-1) = g(1) = -3`, not 3." },
          { t:"5", why:"That uses the odd rule: `g(-1) = 3` and `g(-5) = -2`." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"`f(x) = x^2` is even and `g(x) = x^3 - x` is odd. Is `h(x) = f(x) · g(x)` even, odd or neither?", options:[
          { t:"Odd", ok:true, why:"`h(-x) = f(-x) · g(-x) = f(x) · (-g(x)) = -h(x)`. Check: `h(x) = x^5 - x^3`, all odd powers." },
          { t:"Even", why:"`f` is even, but `g` contributes a sign change to every product." },
          { t:"Neither", why:"Expand: `x^5 - x^3` has only odd powers." },
          { t:"Both even and odd", why:"Only the zero function is both." }] },
        b:{ prompt:"`f(x) = x^3 - x` and `g(x) = 2x` are both odd. Is `h(x) = f(x) · g(x)` even, odd or neither?", options:[
          { t:"Even", ok:true, why:"`h(-x) = (-f(x)) · (-g(x)) = h(x)`. Check: `h(x) = 2x^4 - 2x^2`, all even powers." },
          { t:"Odd, because both factors are odd", why:"Two sign changes cancel: odd × odd is even." },
          { t:"Neither", why:"Expand: `2x^4 - 2x^2` has only even powers." },
          { t:"Both even and odd", why:"Only the zero function is both." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which line correctly shows that `f(x) = x^3 - 4x` is odd?", options:[
          { t:"`f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x = -(x^3 - 4x) = -f(x)`", ok:true, why:"Every step is shown, and it ends in `-f(x)`." },
          { t:"`f(-x) = -x^3 - 4x = -f(x)`", why:"`-4(-x) = +4x`. And `-x^3 - 4x` isn’t `-f(x)`." },
          { t:"`f(1) = -3` and `f(-1) = 3`, so `f` is odd.", why:"One pair of values isn’t a proof." },
          { t:"`f(-x) = x^3 + 4x = -f(x)`", why:"`(-x)^3 = -x^3`, and `x^3 + 4x` isn’t `-f(x)`." }] },
        b:{ prompt:"Which line correctly shows that `g(x) = x^4 + 2x^2` is even?", options:[
          { t:"`g(-x) = (-x)^4 + 2(-x)^2 = x^4 + 2x^2 = g(x)`", ok:true, why:"Every step is shown, and it ends in `g(x)`." },
          { t:"`g(-x) = -x^4 - 2x^2 = g(x)`", why:"`(-x)^4 = x^4`. And `-x^4 - 2x^2` isn’t `g(x)`." },
          { t:"`g(2) = 24` and `g(-2) = 24`, so `g` is even.", why:"One pair of values isn’t a proof." },
          { t:"`g(-x) = -g(x)`, because the degree is even.", why:"That’s the odd test, and the degree doesn’t decide." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why `f(x) = x^3 + 1` is neither even nor odd, even though its degree is odd?", options:[
          { t:"The constant 1 is an even-power term (`1 = x^0`). It doesn’t change sign when `x → -x`, so `f(-x) = -x^3 + 1` matches neither `f(x)` nor `-f(x)`.", ok:true, why:"It names the term that breaks the pattern and compares `f(-x)` with both `f(x)` and `-f(x)`." },
          { t:"Because odd-degree functions are always neither.", why:"`x^3 + x` has odd degree and is odd." },
          { t:"Because 1 is positive.", why:"−1 would cause the same problem. Any non-zero constant does." },
          { t:"Because a cubic graph can’t be symmetric.", why:"`y = x^3` is symmetric under a half-turn about the origin." }] },
        b:{ prompt:"Which is the best explanation of why `g(x) = (x - 3)^2` is not even, even though it’s a square?", options:[
          { t:"Expanding gives `x^2 - 6x + 9`. The `-6x` term changes sign when `x → -x`, so `g(-x) ≠ g(x)`. The graph is symmetric about `x = 3`, not the `y`-axis.", ok:true, why:"It expands first, names the odd-power term that flips, and links it to the graph’s symmetry about `x = 3`." },
          { t:"Because squares are always odd.", why:"`x^2` is a square and it’s even." },
          { t:"Because 3 is an odd number.", why:"`(x - 2)^2` isn’t even either. The shift is the problem, not the 3." },
          { t:"Because `g(0) ≠ 0`.", why:"Even functions don’t need `g(0) = 0`: `x^2 + 1` is even." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"An engineer records a signal that is an odd function of time `t` (measured from the centre of the recording). At `t` = 1, 2 and 3 s the readings are 0.5, 1.2 and 0.9. What is the sum of the readings at `t` = −3, −2, −1, 0, 1, 2 and 3?", options:[
          { t:"0", ok:true, why:"Odd: each negative-time reading is the opposite of its positive partner, and the reading at `t` = 0 is 0. Everything cancels." },
          { t:"2.6", why:"That adds only the positive times. The negative times cancel them." },
          { t:"5.2", why:"That uses the even rule: the negative times would repeat 0.5, 1.2, 0.9." },
          { t:"−2.6", why:"That adds only the negative times." }] },
        b:{ prompt:"A different signal is an even function of `t`. At `t` = 0 the reading is 2, and at `t` = 1, 2 and 3 s the readings are 0.5, 1.2 and 0.9. What is the sum of the readings at `t` = −3, −2, −1, 0, 1, 2 and 3?", options:[
          { t:"7.2", ok:true, why:"Even: the negative times repeat 0.5, 1.2, 0.9. Sum: 2 + 2 × 2.6 = 7.2." },
          { t:"2", why:"That uses the odd rule, where the pairs cancel." },
          { t:"4.6", why:"That counts 0.5, 1.2, 0.9 only once." },
          { t:"5.2", why:"Don’t forget the reading at `t` = 0." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"An odd polynomial function has a local maximum at (−2, 16). Which statement must be true?", options:[
          { t:"It has a local minimum at (2, −16), and `f(0) = 0`.", ok:true, why:"A half-turn sends (−2, 16) to (2, −16) and turns the peak into a valley. Odd polynomials pass through the origin." },
          { t:"It has a local maximum at (2, 16), and `f(0) = 0`.", why:"That’s the even rule (a mirror in the `y`-axis)." },
          { t:"It has a local minimum at (−2, −16), and `f(0) = 0`.", why:"That reflects in the `x`-axis, which isn’t a symmetry of the graph." },
          { t:"It has a local minimum at (2, −16), and `f(0) = 16`.", why:"Odd polynomials have `f(0) = 0`." }] },
        b:{ prompt:"An even polynomial function has a local minimum at (3, −5) and `y`-intercept 4. Which statement must be true?", options:[
          { t:"(−3, −5) is also a local minimum.", ok:true, why:"A mirror in the `y`-axis sends (3, −5) to (−3, −5), and a valley stays a valley." },
          { t:"(−3, 5) is a local maximum.", why:"That’s the half-turn, the odd rule." },
          { t:"(3, 5) is a local maximum.", why:"That reflects in the `x`-axis." },
          { t:"(−3, −5) is a local maximum.", why:"A mirror image of a valley is still a valley." }] } }
    ]
  },
  task:{
    title:"Build an odd function to spec", summary:"Build an odd function to spec",
    statement:"<p>Use the term tiles to build a polynomial that meets every line of the spec. There are many answers. Can you find more than one?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The spec</h4><ol class=\"spec\"><li>The function is odd.</li><li>Degree 5, with end behaviour Q2 to Q4.</li><li>Its graph passes through (−1, −2).</li><li>Exactly 3 `x`-intercepts.</li></ol></div>",
    checks:["Odd", "Degree 5, Q2 to Q4", "Passes through (−1, −2)", "Exactly 3 `x`-intercepts"],
    tips:["An odd function has only odd-power terms: remove the `x^4`, `x^2` and constant tiles.",
      "Q2 to Q4 with degree 5 needs a negative `x^5` coefficient.",
      "`f(-1) =` {value}. For an odd function, `f(-1) = -2` is the same as `f(1) = 2`: make the coefficients add to 2.",
      "Your graph has {k} `x`-intercepts. An odd function always crosses at 0; you need exactly one more pair, ±`r`."],
    explainPrompt:"Explain why passing through (−1, −2) was the same as making the coefficients add to 2, and how you got exactly 3 `x`-intercepts.",
    vocab:"Use the words odd function, `f(-x) = -f(x)`, coefficient and `x`-intercept.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every answer has coefficients adding to 2: for an odd function, passing through (−1, −2) is the same as passing through (1, 2)."
  },
  cards:[
    ["`(-x)^n`", "`x^n` when `n` is even; `-x^n` when `n` is odd."],
    ["Even function", "`f(-x) = f(x)` for every `x`. Only even powers (a constant counts). Symmetric in the `y`-axis."],
    ["Odd function", "`f(-x) = -f(x)` for every `x`. Only odd powers, no constant. A half-turn about the origin maps the graph onto itself."],
    ["Neither", "A mixture of even and odd powers. Most polynomials are neither."],
    ["Is a constant an even or odd power?", "Even: `c = c · x^0`. A non-zero constant stops a function from being odd."],
    ["Does the degree decide?", "No. `x^3 + 1` has odd degree and is neither; every term must pass."],
    ["`f(-x)` vs `-f(x)`", "`f(-x)`: replace `x` (reflects in the `y`-axis). `-f(x)`: negate every output (reflects in the `x`-axis)."],
    ["Why one value isn’t proof", "`x^3 - 4x + 1` has `f(2) = f(-2) = 1` but is neither. The test must hold for every `x`."],
    ["Odd polynomials and the origin", "`f(0) = -f(0)`, so `f(0) = 0`: every odd polynomial passes through (0, 0)."],
    ["Is `(x - 1)^2` even?", "No: `x^2 - 2x + 1` has an odd-power term. Its graph is symmetric about `x = 1`."]
  ]
};
