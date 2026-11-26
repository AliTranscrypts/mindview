// MHF4U 46 Sums and Differences of Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/46-sums-and-differences-of-functions.md

// Practice 2 sorter: tiny box sketches, generated hints and mistake feedback (plan: "Hints, generated per item").
const svg = d => '<svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true" style="vertical-align:middle;flex:none">' + d + "</svg>";
const ICON = {
  even:svg('<path d="M22 2V28" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M4 5Q22 45 40 5" fill="none" stroke="var(--pen)" stroke-width="2.4"/>'),
  odd:svg('<path d="M2 15H42" stroke="currentColor" stroke-width="1"/><path d="M22 2V28" stroke="currentColor" stroke-width="1"/><path d="M4 27C13 27 15 15 22 15C29 15 31 3 40 3" fill="none" stroke="var(--pen)" stroke-width="2.4"/><circle cx="22" cy="15" r="2.6" fill="currentColor"/>'),
  neither:svg('<path d="M22 2V28" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M3 25C11 25 15 4 24 7C31 9 34 21 41 18" fill="none" stroke="var(--pen)" stroke-width="2.4"/>')
};
const BOXN = { even:"Even", odd:"Odd", neither:"Neither" };
const WF = {
  evenForOdd:"Check the sign: at `-x` the value is the <strong>opposite</strong> of the value at `x`. Try `x = 1` and `x = -1`.",
  oddForEven:"At `-x` the value is the <strong>same</strong> as at `x`, not the opposite. Try `x = 1` and `x = -1`.",
  neitherForSym:"This one does have a symmetry, even if its pieces don’t look alike. Compare its values at `x = 1` and `x = -1`.",
  symForNeither:"Compare the values at `x = 1` and `x = -1` (or at π/4 and −π/4 for trig items): they’re neither equal nor opposite."
};
function wrongFor(box){
  if (box === "even") return { odd:WF.oddForEven, neither:WF.neitherForSym };
  if (box === "odd") return { even:WF.evenForOdd, neither:WF.neitherForSym };
  return { even:WF.symForNeither, odd:WF.symForNeither };
}
const SH1 = "Replace `x` with `-x` in each piece.", SH2 = "Which pieces stay the same, and which change sign?";
const sym = (id, t, box, why, o) => {
  o = o || {};
  const w = wrongFor(box); Object.assign(w, o.wrong || {});
  return { id, t, answer:box, why, wrong:w, hints:o.hints || [SH1, SH2, why.replace(/\.\s*$/, "") + ", so it’s " + BOXN[box] + "."] };
};

export default {
  id:"46-sums-and-differences-of-functions",
  kind:"topic",
  title:"Sums and differences of functions",
  topic:"Sums and Differences of Functions",
  readyTopic:"sums and differences of functions",
  hero:{
    eq:'<span class="m">(<i class="sd-f">f</i> + <i class="sd-g">g</i>)(<i>x</i>) = <i class="sd-f">f</i>(<i>x</i>) + <i class="sd-g">g</i>(<i>x</i>)</span>',
    eqLabel:"f plus g of x equals f of x plus g of x", eqSize:"md",
    headline:"Add the heights, point by point",
    text:"To add two functions, add their outputs at the same input. On a graph that means stacking heights: at each `x`, put `g`’s bar on top of `f`’s bar, and the top of the stack is a point on the graph of the <strong>sum</strong>. A <strong>difference</strong> works the same way with `g`’s bar flipped. The new function exists only where both pieces do, so its <strong>domain</strong> is where `f` and `g` are both defined. Adding waves like this, called <strong>superposition</strong>, is how sounds combine, from phone keypad tones to noise-cancelling headphones.",
    fig:{ aria:"The line y = x and the wave y = sin x, with bars stacked at nine x-values from negative 2 pi to 2 pi, and the sum y = x + sin x drawn through the tops of the stacks", shape:"square" }
  },
  goals:[
    "I can find `(f + g)(x)` and `(f - g)(x)` at a point from equations, tables or graphs, by adding or subtracting the signed outputs at the same `x`, and work backwards to a missing value.",
    "I can sketch or describe the graph of `f + g` or `f - g` from the graphs of `f` and `g`, using key points (where `f` or `g` is zero, where the two values cancel, where the graphs cross) and which piece takes over far left and far right.",
    "I can state the domain of `f + g` and `f - g`: the `x`-values where both `f` and `g` are defined.",
    "I can decide whether a sum or difference is even, odd or neither, and reason about whether it increases, by testing the result rather than assuming it copies the pieces.",
    "I can explain superposition: when two waves reinforce or cancel, how long their sum takes to repeat, and how real sounds such as keypad tones are built from sums of waves."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Function values", goal:1, prompt:"`f(x) = x^2 - 3x`. What is `f(-2)`?",
          options:[
            { t:"10", ok:true, why:"Replace every `x` with (−2): `(-2)^2 - 3(-2) = 4 + 6 = 10`." },
            { t:"−2", why:"−3 × (−2) = +6, not −6. So `f(-2) = 4 + 6 = 10`." },
            { t:"2", why:"The brackets mean the whole −2 is squared: `(-2)^2 = 4`. −4 + 6 = 2 comes from squaring only the 2." },
            { t:"−10", why:"−10 = −4 − 6: both the square and the product got the wrong sign. `(-2)^2 = 4` and `-3(-2) = 6`." }],
          hints:["Put (−2), with its brackets, in place of each `x`.", "`(-2)^2 = 4` and −3 × (−2) = 6.", "`f(-2) = 4 + 6 = 10`."] },
        { id:"w2", skill:"Function values", goal:1, prompt:"The graph of `y = g(x)` is the straight line through (0, 4) and (2, 0). What is `g(3)`?",
          options:[
            { t:"−2", ok:true, why:"The line falls 2 for each step of 1 to the right, so `g(x) = 4 - 2x` and `g(3) = 4 - 6 = -2`. The graph is below the `x`-axis there." },
            { t:"2", why:"At `x = 3` the line is 2 units <strong>below</strong> the `x`-axis, so `g(3) = -2`." },
            { t:"1/2", why:"1/2 is the `x` where `g(x) = 3`. `g(3)` means the output when the input is 3." },
            { t:"10", why:"The line goes <strong>down</strong> from (0, 4) to (2, 0), so its slope is −2: `g(3) = 4 - 2(3) = -2`." }],
          hints:["Find the slope from the two points.", "Slope = (0 − 4)/(2 − 0) = −2, so `g(x) = 4 - 2x`.", "`g(3) = 4 - 6 = -2`."] },
        { id:"w3", skill:"Domain", goal:3, prompt:"What is the domain of `y = log_{2} x`?",
          options:[
            { t:"`{x ∈ ℝ | x > 0}`", ok:true, why:"`log_{2} x` is the exponent you put on 2 to get `x`. Powers of 2 are always positive, so only positive `x` have a logarithm." },
            { t:"`{x ∈ ℝ | x ≥ 0}`", why:"No power of 2 equals 0, so `log_{2} 0` is undefined. The graph approaches the `y`-axis but never reaches it." },
            { t:"`{x ∈ ℝ}`", why:"`{x ∈ ℝ}` is the domain of `y = 2^x`. Its inverse, `log_{2} x`, takes the range of `2^x` as its domain: `x > 0`." },
            { t:"`{x ∈ ℝ | x ≠ 0}`", why:"Negative `x` are excluded too: no power of 2 is negative." }],
          hints:["`log_{2} x` is the exponent you put on 2 to get `x`.", "Can a power of 2 be 0 or negative?", "No, so `x` must be positive: `{x ∈ ℝ | x > 0}`."] },
        { id:"w4", skill:"Domain", goal:3, prompt:"What is the domain of `y = 1/(x + 3)`?",
          options:[
            { t:"`{x ∈ ℝ | x ≠ -3}`", ok:true, why:"The denominator `x + 3` is 0 only at `x = -3`, and you can’t divide by 0." },
            { t:"`{x ∈ ℝ | x ≠ 3}`", why:"`x + 3 = 0` when `x = -3`. At `x = 3` the denominator is 6, which is fine." },
            { t:"`{x ∈ ℝ | x > -3}`", why:"A fraction only fails where its denominator is 0. At `x = -5` the value is `1/(-2) = -1/2`, which is fine." },
            { t:"`{x ∈ ℝ | x ≠ 0}`", why:"At `x = 0` the value is 1/3. The excluded value is where `x + 3 = 0`." }],
          hints:["Which `x` makes the denominator 0?", "Solve `x + 3 = 0`.", "`x = -3` is excluded: `{x ∈ ℝ | x ≠ -3}`."] },
        { id:"w5", skill:"Even and odd", goal:4, prompt:"Which function is odd?",
          options:[
            { t:"`f(x) = x^3 + x`", ok:true, why:"`f(-x) = -x^3 - x = -(x^3 + x) = -f(x)`." },
            { t:"`f(x) = x^3 + 1`", why:"`f(-x) = -x^3 + 1`, which is neither `f(x)` nor `-f(x) = -x^3 - 1`. The constant 1 behaves like an even term, so this one is neither." },
            { t:"`f(x) = x^2 + x`", why:"`f(1) = 2` but `f(-1) = 0`, which is neither 2 nor −2. This one is neither." },
            { t:"`f(x) = x^4 - x^2`", why:"Every power here is even, so `f(-x) = f(x)`: this one is even." }],
          hints:["Odd means `f(-x) = -f(x)` for every `x`.", "Replace `x` with `-x`: odd powers change sign; even powers and constants don’t.", "Only `x^3 + x` has every term odd: `f(-x) = -x^3 - x = -f(x)`."] },
        { id:"w6", skill:"Sinusoids", goal:5, prompt:"What is the period of `y = sin 3x`?",
          options:[
            { t:"2π/3", ok:true, why:"`sin 3x` fits 3 full waves into 2π, so one wave takes 2π/3." },
            { t:"6π", why:"Multiplying `x` by 3 squeezes the graph: it repeats 3 times as often, so the period is shorter: 2π ÷ 3." },
            { t:"π/3", why:"Sine’s basic period is 2π, not π: 2π/3." },
            { t:"3", why:"3 is how many waves fit into 2π. The period is 2π/3." }],
          hints:["The period of `sin kx` is 2π/`k`.", "Here `k = 3`.", "2π/3."] }
      ],
      refreshers:{
        "Function values":"To evaluate `f(-2)`, put (−2), brackets and all, in place of every `x`: `f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10`. On a graph, `g(3)` is the <strong>height</strong> of the graph at `x = 3`. It’s negative when the graph is below the `x`-axis: the line through (0, 4) and (2, 0) has height −2 at `x = 3`.",
        "Domain":"The domain is every `x` the function accepts. A logarithm needs a positive input, so `log_{2} x` has domain `{x ∈ ℝ | x > 0}`. A fraction can’t have a zero denominator, so `1/(x + 3)` has domain `{x ∈ ℝ | x ≠ -3}`. Polynomials, `2^x`, `sin x` and `cos x` accept every real `x`.",
        "Even and odd":"`f` is <strong>even</strong> if `f(-x) = f(x)` for every `x` (mirror symmetry in the `y`-axis), and <strong>odd</strong> if `f(-x) = -f(x)` (half-turn symmetry about the origin). For polynomials: only even powers (constants count as even) gives even; only odd powers gives odd; a mix gives neither. `x^3 + x` is odd; `x^3 + 1` is neither. `cos x` is even and `sin x` is odd.",
        "Sinusoids":"`y = sin kx` and `y = cos kx` have amplitude 1 and period 2π/`k`. `sin 3x` completes 3 waves between 0 and 2π, so one wave takes 2π/3. Shifting a sine wave by half a cycle flips it: `sin(x + π) = -sin x`."
      }
    }
  },
  explore:{
    heading:"Stacking bars",
    intro:"Pick two functions. At the probe, `f`’s bar and `g`’s bar stack into the value of `f + g` (or `f - g`). Sweep the probe across to build the new graph one point at a time.",
    predictions:[
      { id:"p1", prompt:"`f(1) = 2` and `g(1) = -1`. Where will the point of `f + g` at `x = 1` be?",
        options:[{ t:"(1, 1)", ok:true }, { t:"(1, 3)" }, { t:"(1, −2)" }, { t:"(2, 1)" }],
        explain:"`g(1) = -1`, so `g`’s bar points down. Stacked on `f`’s bar of 2, it brings the total down to 1, and the `x` stays at 1: the point is (1, 1). The other options are other operations: (1, 3) adds the sizes and ignores the sign, (1, −2) multiplies, and (2, 1) adds the two points as pairs, which moves the `x` as well." },
      { id:"p2", prompt:"The sweep will draw `f + g = 2^x + sin x`. Where will its graph meet the graph of `f`?",
        options:[{ t:"Wherever `sin x = 0`: at `x = -π`, 0 and π", ok:true }, { t:"Nowhere: adding the wave moves every point off `f`’s graph" }, { t:"Only where the graphs of `f` and `g` cross each other" }, { t:"Wherever `sin x = 1`: at `x = π/2`" }],
        explain:"`2^x + sin x` equals `2^x` exactly when `sin x = 0`: at −π, 0 and π in this window. Between those, the wave pushes the sum above `f`’s graph (where `sin x > 0`) or below it (where `sin x < 0`). Far left, `2^x` fades to 0 and the sum looks like `sin x`; far right, `2^x` takes over. (The graphs of `f` and `g` do cross once in this window, near `x = -3.25`, but there the sum is `2f(x)`, not `f(x)`.)" },
      { id:"p3", prompt:"The sweep will try to draw `f + g = log_{2} x + 1/x` at every probe position from `x = -4` to `x = 4`. For which `x`-values will it draw a point?",
        options:[{ t:"Only for `x > 0`", ok:true }, { t:"For every `x` except 0" }, { t:"For every real `x`" }, { t:"For `x > 0`, except `x = 1`" }],
        explain:"`(f + g)(x)` needs both values. `log_{2} x` is undefined for `x ≤ 0`, so the sum is too, even though `1/x` is defined at, say, `x = -1`. The domain is `{x ∈ ℝ | x > 0}`. At `x = 1`, `log_{2} 1 = 0` is a perfectly good value, so `x = 1` is included. Near 0, `1/x` grows faster than `log_{2} x` falls, so as `x → 0^{+}` the sum → ∞." },
      { id:"p4", prompt:"Neither `2^x` nor `2^{-x}` is even or odd. What symmetry will their sum have?",
        options:[{ t:"Even: symmetric in the `y`-axis", ok:true }, { t:"Neither, because neither piece has any symmetry" }, { t:"Odd: symmetric about the origin" }, { t:"Neither: it rises to the right, like `2^x`" }],
        explain:"`2^{-x}` is the reflection of `2^x` in the `y`-axis. At `x` and `-x` the two bars swap places, so the total is the same: `(f + g)(-x) = 2^{-x} + 2^x = (f + g)(x)`. The sum is even, with lowest point (0, 2), and it rises on <strong>both</strong> sides. Symmetry of a sum has to be tested, not assumed." }
    ],
    chalIntro:"Set the explorer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Choose `f`, `g` and the mode so that the result is defined for exactly the `x`-values with `x > 0` and `x ≠ 2`. Sweep to see the domain, then press Check challenge.",
        why:"Where both are defined: `log_{2} x` needs `x > 0` and `1/(x - 2)` needs `x ≠ 2`, so the result is defined for `{x ∈ ℝ | x > 0, x ≠ 2}`.",
        fb:{ recips:"Your result is defined for `x ≠ 0` and `x ≠ 2`, which still includes negative numbers such as `x = -1`. Which function refuses every `x ≤ 0`?",
          logRecip:"`1/x` only removes `x = 0`, which `log_{2} x` had already removed. Your domain is `x > 0`, still including `x = 2`.",
          logOther:"Your result is defined for every `x > 0`, including `x = 2`. You also need a piece that’s undefined at `x = 2`.",
          shiftAll:"Your result is defined everywhere except `x = 2`, including the negative numbers." },
        general:"Look at the Domain row: the result is defined only where both pieces are.",
        hints:["The result is defined only where both pieces are. Which library function cuts off every `x ≤ 0`? Which one removes only `x = 2`?", "`log_{2} x` has domain `x > 0`, and `1/(x - 2)` has domain `x ≠ 2`.", "Choose `log_{2} x` and `1/(x - 2)`, in either order and either mode. Where both are defined: `x > 0` and `x ≠ 2`."] },
      { id:"tc2", goal:1, prompt:"`f` is locked to `f(x) = x`. Choose `g` and the mode so that the result passes through both ringed points, (0, 1) and (2, 6).",
        why:"`x + 2^x` gives 0 + 1 = 1 at `x = 0` and 2 + 4 = 6 at `x = 2`.",
        fb:{ sq:"Your result passes through (2, 6), since 2 + 4 = 6. But at `x = 0` it’s 0 + 0 = 0, not 1.",
          neg:"Your result passes through (0, 1). But at `x = 2` it’s 2 + 1/4 = 9/4, not 6.",
          cos:"Your result passes through (0, 1), since `cos 0 = 1`. But at `x = 2` it’s `2 + cos 2 ≈ 1.58`.",
          diff:"At `x = 0` your result is 0 − 1 = −1: right size, wrong sign. Subtracting flips `g`’s bar.",
          lock:"This challenge needs `f(x) = x`. Press <strong>Open this challenge</strong> to lock `f` to `x`." },
        general:"Work backwards from the rings: at each one, `g(x)` must be the ring’s height minus `f(x)`.",
        hints:["Work backwards at each ring: `g(x)` must be the ring’s height minus `f(x)`.", "At `x = 0`: `g(0) = 1 - 0 = 1`. At `x = 2`: `g(2) = 6 - 2 = 4`. Which library function gives 1 at `x = 0` and 4 at `x = 2`?", "`g(x) = 2^x`, because `2^0 = 1` and `2^2 = 4`. In Sum mode, `x + 2^x` passes through (0, 1) and (2, 6)."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Commit first. Using two functions that are <strong>not</strong> odd, build an <strong>odd</strong> function whose graph passes through the ringed point (1, 3/2). While this challenge is open, the result is hidden; set `f`, `g` and the mode, press <strong>Check challenge</strong>, and only then is it drawn.",
        why:"`h(x) = 2^x - 2^{-x}` has `h(-x) = 2^{-x} - 2^x = -h(x)`, so it’s odd, and `h(1) = 2 - 1/2 = 3/2`.",
        fb:{ p4:"That’s P4’s function: it’s even, not odd. At `x = 1` it’s 5/2.",
          swap:"It’s odd, but at `x = 1` it’s 1/2 − 2 = −3/2: right size, wrong sign. Swap `f` and `g`.",
          oddPiece:"One of your pieces is already odd. The challenge asks for two pieces that aren’t.",
          lop:"Your result’s domain isn’t symmetric about 0, so it can’t be odd." },
        general:"For an odd result, the value at `-x` must be the opposite of the value at `x`. In P4, which two functions swapped places when `x` became `-x`?",
        hints:["In P4, `2^x` and `2^{-x}` swapped places when `x` became `-x`, and their sum came out even. What happens to their difference?", "Let `h(x) = 2^x - 2^{-x}`. Then `h(-x) = 2^{-x} - 2^x = -h(x)`. Now check the ring: which order gives +3/2 at `x = 1`?", "`f = 2^x`, `g = 2^{-x}`, Difference: `h(1) = 2 - 1/2 = 3/2`. It’s odd, and it passes through (1, 3/2)."] }
    ],
    blocks:[{ title:"What the bars show", html:"<p><strong>Adding and subtracting functions</strong></p><ul>" +
      "<li>`(f + g)(x) = f(x) + g(x)`: at each `x`, stack `g`’s bar on `f`’s bar. `(f - g)(x) = f(x) - g(x)`: flip `g`’s bar first, or measure the signed gap from `g`’s graph up to `f`’s.</li>" +
      "<li><strong>Domain:</strong> where both `f` and `g` are defined.</li>" +
      "<li><strong>Sketching:</strong> where `g(x) = 0` the sum meets `f`’s graph; where `f(x) = 0` it meets `g`’s graph; where `f(x) = -g(x)` it’s on the `x`-axis. Far left and far right, the piece that grows faster takes over.</li>" +
      "<li><strong>Symmetry:</strong> even ± even is even; odd ± odd is odd; even + odd (neither one always 0) is neither. Pieces with no symmetry can still combine into an even or odd function, so test the result.</li></ul>" }]
  },
  part3:{
    slug:"superposition", name:"Superposition",
    heading:"Superposition: adding sound waves",
    intro:"A sound is a wave of air pressure. When two sounds reach your ear together, the pressures add, point by point in time. Mix two waves and watch what the sum does. Then use subtraction to decode a phone key.",
    shifts:["In step (+0)", "Quarter cycle (+π/2)", "Flipped (+π)"],
    silence:"Silence: the waves cancel completely.",
    experiments:[
      { id:"x1", title:"X1. In step.", setup:"`y = sin 2x` and `y = sin 2x`", q:"What’s the amplitude of the sum?",
        chips:[{ t:"1" }, { t:"2", ok:true }, { t:"4" }],
        conclusion:"In step, the peaks line up, so the amplitudes add: `sin 2x + sin 2x = 2 sin 2x`, and `2 sin 2x + sin 2x = 3 sin 2x`." },
      { id:"x2", title:"X2. Flipped.", setup:"`y = 2 sin 2x` and `y = sin(2x + π) = -sin 2x`", q:"What’s the amplitude of the sum?",
        chips:[{ t:"0" }, { t:"1", ok:true }, { t:"3" }],
        conclusion:"A flipped wave subtracts: `2 sin 2x - sin 2x = sin 2x`. With equal amplitudes the sum is 0 everywhere. Noise-cancelling headphones do this: they add a flipped copy of the noise." },
      { id:"x3", title:"X3. A quarter cycle apart.", setup:"`y = sin x` and `y = cos x`", q:"What’s the highest value of the sum?",
        chips:[{ t:"1" }, { t:"`√2`", ok:true }, { t:"2" }],
        conclusion:"The peaks don’t line up, so the sum never reaches 1 + 1 = 2. It’s a single wave with amplitude √2, highest at `x = π/4`, where each wave is at √2/2." },
      { id:"x4", title:"X4. Different pitches.", setup:"`y = sin 2x` and `y = sin 3x`", q:"How long until the sum first repeats?",
        chips:[{ t:"2π/3" }, { t:"π" }, { t:"2π", ok:true }],
        conclusion:"`sin 2x` repeats every π and `sin 3x` every 2π/3. The sum repeats only when both do: first at 2π. It isn’t a single sine wave, and its highest point is about 1.91, not 2." }
    ],
    method:"Pick a row tone and leave the column at ‘none’. If the leftover is one clean wave, your row is right, and counting the leftover’s waves from 0 to 2π tells you the column. When the guess is complete, the leftover is flat: 0 everywhere.",
    keypadNote:"Real keypads use rows of 697, 770, 852 and 941 waves per second and columns of 1209, 1336 and 1477. The idea is the same: two waves, added.",
    mysteries:[{ id:"d1", name:"Mystery 1", answer:{ row:4, col:7 } }, { id:"d2", name:"Mystery 2", answer:{ row:2, col:8 } }],
    decodeFb:{
      rowOnly:"The leftover is one clean wave. Count its waves between 0 and 2π: that’s the column tone.",
      colOnly:"The leftover is one clean wave, so your column is right. Count its waves to find the row.",
      wrong:"The leftover is still a mix of waves: its peaks have different heights. Only right tones leave one clean wave (or nothing at all). Try another tone.",
      done:"✓ Decoded: key {key} (row {row}, column {col}). The leftover is 0 for every `x`: mystery − guess = 0."
    },
    blocks:[{ html:'<details class="alg"><summary>Check it with algebra</summary><p style="margin:10px 0 6px"><strong>Why the mixer behaves the way it does</strong></p><ul>' +
      "<li><strong>In step:</strong> `A sin nx + B sin nx = (A + B) sin nx`.</li>" +
      "<li><strong>Flipped:</strong> `sin(nx + π) = -sin nx` (module 27), so `A sin nx + B sin(nx + π) = (A - B) sin nx`. If `A = B`, the sum is 0 for every `x`: silence.</li>" +
      "<li><strong>A quarter cycle apart:</strong> `sin(x + π/2) = cos x`. With the compound angle formula (module 28): `√2 sin(x + π/4) = √2(sin x cos(π/4) + cos x sin(π/4)) = √2(√2/2 · sin x + √2/2 · cos x) = sin x + cos x`. So `sin x + cos x` is a single wave with amplitude √2, highest where `x + π/4 = π/2`, at `x = π/4`. (In general, `A sin nx + B cos nx` has amplitude `√{A^2 + B^2}`.)</li>" +
      "<li><strong>Different pitches:</strong> `sin 2x` has period π and `sin 3x` has period 2π/3. The sum repeats only when both pieces do, at the first common multiple of π and 2π/3, which is 2π. In general, `sin mx + sin nx` repeats every 2π ÷ (greatest common factor of `m` and `n`).</li>" +
      "<li><strong>Why a peak can be lower than `A + B`:</strong> the sum reaches `A + B` only at an `x` where both waves are at their peaks together.</li></ul></details>" }],
    quickCheck:{
      title:"Superposition quick check", summary:"Superposition quick check",
      items:[
        { id:"q1", goal:5, prompt:"How long does `y = sin 4x + sin 6x` take to repeat?",
          choices:[
            { t:"π", ok:true, fb:"Right. `sin 4x` repeats every π/2 and `sin 6x` every π/3. The first time both repeat together is π: the greatest common factor of 4 and 6 is 2, and 2π ÷ 2 = π." },
            { t:"π/5", fb:"That’s the period of `sin 10x`, as if the frequencies added. Adding waves adds heights, not frequencies." },
            { t:"π/3", fb:"That’s only `sin 6x`’s period. At `x = π/3`, `sin 4x` is partway through a wave." },
            { t:"π/2", fb:"That’s only `sin 4x`’s period. By `x = π/2`, `sin 6x` has done one and a half waves, so it’s flipped: `sin 6(x + π/2) = -sin 6x`." }] },
        { id:"q2", goal:4, prompt:"What is the highest value of `y = sin x + cos x`?",
          choices:[
            { t:"`√2`", ok:true, fb:"Right. `sin x + cos x = √2 sin(x + π/4)`, highest at `x = π/4`." },
            { t:"2", fb:"That adds the two maximums, but `sin x` peaks at π/2 and `cos x` at 0, never together." },
            { t:"1", fb:"At `x = π/2` the sum is 1 + 0 = 1, but at `x = π/4` it’s √2/2 + √2/2 = √2, which is higher." },
            { t:"`√2/2`", fb:"√2/2 is each wave’s value at `x = π/4`. The sum adds them: √2." }] },
        { id:"q3", goal:5, prompt:"A machine’s hum is modelled by `y = 3 sin 2x`. Which wave, added to it, cancels it completely?",
          choices:[
            { t:"`y = -3 sin 2x`", ok:true, fb:"Right. Same pitch, same amplitude, flipped: the sum is 0 for every `x`." },
            { t:"`y = 3 sin 2x`", fb:"That’s another copy in step. The sum is `6 sin 2x`, twice as loud." },
            { t:"`y = 3 cos 2x`", fb:"That’s a quarter cycle apart. The sum has amplitude `√{3^2 + 3^2} = 3√2`, louder, not silent." },
            { t:"`y = -3 sin x`", fb:"Right size, flipped, but the wrong pitch. `sin x` and `sin 2x` can’t cancel everywhere." }] },
        { id:"q4", goal:5, prompt:"What is the amplitude of `y = 2 sin 3x + sin(3x + π)`?",
          choices:[
            { t:"1", ok:true, fb:"Right. `sin(3x + π) = -sin 3x`, so the sum is `2 sin 3x - sin 3x = sin 3x`." },
            { t:"0", fb:"A flipped wave cancels completely only when the amplitudes match. Here 2 − 1 = 1 is left." },
            { t:"`√5`", fb:"That’s the rule for waves a quarter cycle apart: `√{2^2 + 1^2}`. These are half a cycle apart." },
            { t:"3", fb:"That adds the amplitudes, but the second wave is flipped, so it subtracts." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"combine", type:"custom", title:"Combine and work backwards", summary:"Combine and work backwards", star:true, goal:[1, 2, 3],
        instruction:"Find each value. Type a whole number, such as −3, then press Check.",
        how:"After each check, the mini-graph shows the bars your answer makes.",
        fallback:"Not this one. Write the sum or difference at that `x` as an equation, put in what you know, and solve for what you don’t.",
        tableCap:"Table for questions 1 and 2",
        items:[
          { id:"n1", goal:1, prompt:"Use the table. Find `(f + g)(-2)`.", answer:1,
            wrong:[{ match:9, fb:"That adds the sizes 5 and 4. `g(-2) = -4` is below the axis, so it pulls the total down: 5 + (−4) = 1." }, { match:-20, fb:"That’s `f(-2) × g(-2)`. A sum adds." }],
            hints:["`(f + g)(-2) = f(-2) + g(-2)`. Read both values from the table, signs included.", "`f(-2) = 5` and `g(-2) = -4`.", "`(f + g)(-2) = 5 + (-4) = 1`."] },
          { id:"n2", goal:1, prompt:"Use the table. Find `(f - g)(1)`.", answer:3,
            wrong:[{ match:1, fb:"2 + (−1) adds `g(1)`. For `f - g`, subtract it: 2 − (−1) = 3." }, { match:-3, fb:"That’s `(g - f)(1)`. Order matters." }],
            hints:["`(f - g)(1) = f(1) - g(1)`. Read both values from the table.", "`f(1) = 2` and `g(1) = -1`. Subtracting a negative adds.", "`(f - g)(1) = 2 - (-1) = 3`."] },
          { id:"n3", goal:2, prompt:"Use the graphs. Find the <strong>positive</strong> `x` where `(f + g)(x) = 0`.", answer:1, fig:true,
            wrong:[{ match:2, fb:"At `x = 2`, `g(2) = 0`, so `(f + g)(2) = f(2) = 5`. That’s where the sum’s graph meets `f`’s graph, not the axis." }, { match:-3, fb:"`(f + g)(-3) = -5 + 5 = 0` too, but −3 isn’t positive." }],
            hints:["`(f + g)(x) = 0` where the two bars are equal and opposite: `f(x) = -g(x)`.", "Look for an `x` where `f` is some height above the axis and `g` is the same height below it.", "At `x = 1`, `f(1) = 3` and `g(1) = -3`, so `(f + g)(1) = 0`. The answer is 1."] },
          { id:"n4", goal:1, prompt:"`(f + g)(3) = 4` and `f(3) = 7`. Find `g(3)`.", answer:-3,
            wrong:[{ match:11, fb:"That adds 4 and 7. Work backwards: `g(3) = (f + g)(3) - f(3) = 4 - 7`." }, { match:3, fb:"Sign slip: 4 − 7 = −3, not 7 − 4." }],
            hints:["`(f + g)(3) = f(3) + g(3)`. Put in the two values you know.", "4 = 7 + `g(3)`.", "`g(3) = 4 - 7 = -3`."] },
          { id:"n5", goal:1, prompt:"`h = f - g`. `h(5) = -2` and `g(5) = -6`. Find `f(5)`.", answer:-8,
            wrong:[{ match:4, fb:"That’s `h(5) - g(5)`. From `f - g = h`, `f = h + g`: −2 + (−6)." }, { match:8, fb:"Right size, wrong sign: −2 + (−6) = −8." }],
            hints:["`h(5) = f(5) - g(5)`. Put in the two values you know.", "−2 = `f(5)` − (−6), so `f(5)` + 6 = −2.", "`f(5) = h(5) + g(5) = -2 + (-6) = -8`."] },
          { id:"n6", goal:3, prompt:"`f(x) = log_{2}(x + 1)` and `g(x) = 1/(x^2 - 4)`. How many integers from −5 to 5 are in the domain of `f + g`?", answer:5,
            wrong:[{ match:6, fb:"`g` is also undefined at `x = 2`, where `x^2 - 4 = 0`." }, { match:9, fb:"That counts `g`’s domain only. `f` also needs `x > -1`." }, { match:10, fb:"That counts every integer where at least one piece is defined. `f + g` needs both." }],
            hints:["`f + g` is defined only where both `f` and `g` are.", "`log_{2}(x + 1)` needs `x + 1 > 0`, so `x > -1`. `1/(x^2 - 4)` needs `x ≠ -2` and `x ≠ 2`.", "The integers from −5 to 5 with `x > -1` and `x ≠ 2` are 0, 1, 3, 4 and 5: 5 integers."] },
          { id:"n7", goal:4, prompt:"`f` is even and `g` is odd. `(f + g)(2) = 7` and `(f + g)(-2) = 3`. Find `g(2)`.", answer:2,
            wrong:[{ match:5, fb:"That’s `f(2)`. The question asks for `g(2)`." }, { match:4, fb:"7 − 3 = 4 is `2g(2)`. Halve it." }, { match:10, fb:"Adding the two equations gives `2f(2) = 10`, which finds `f`. To find `g`, subtract them." }],
            why:"`f` is even, so `f(-2) = f(2)`; `g` is odd, so `g(-2) = -g(2)`. The two facts say `f(2) + g(2) = 7` and `f(2) - g(2) = 3`. Subtracting gives `2g(2) = 4`, so `g(2) = 2` (and `f(2) = 5`).",
            hints:["Use the symmetry: `f(-2) = f(2)` and `g(-2) = -g(2)`.", "So `f(2) + g(2) = 7` and `f(2) - g(2) = 3`.", "Subtract: `2g(2) = 4`, so `g(2) = 2`."] },
          { id:"n8", goal:[1, 2], prompt:"`f(x) = 2^x`, and `g` is a linear function. The graph of `f + g` crosses the `x`-axis at `x = 1` and `x = 2`. Find `(f + g)(3)`.", answer:2,
            wrong:[{ match:-6, fb:"That’s `g(3)`. Add `f(3) = 8`." }, { match:8, fb:"That’s `f(3)`. Add `g(3) = -6`." }, { match:14, fb:"`g(3) = -6` is negative: 8 + (−6) = 2." }],
            why:"At the zeros, `g` cancels `f`: `g(1) = -2^1 = -2` and `g(2) = -2^2 = -4`. A line through (1, −2) and (2, −4) has slope −2 and passes through the origin: `g(x) = -2x`. So `(f + g)(3) = 8 - 6 = 2`.",
            hints:["At a zero of `f + g`, `g(x) = -f(x)`. Find `g(1)` and `g(2)`.", "`g(1) = -2` and `g(2) = -4`. Find the line through those two points.", "`g(x) = -2x`, so `(f + g)(3) = 2^3 + (-6) = 2`."] }
        ] },
      { id:"symm", type:"sorter", title:"Even, odd or neither?", summary:"Even, odd or neither?", goal:4, noun:"function",
        instruction:"Sort each sum or difference by its symmetry.",
        how:"Tap a function, then tap the box it belongs in. Test it: compare its value at `x` and at `-x`.",
        boxes:[{ id:"even", label:"Even", icon:ICON.even }, { id:"odd", label:"Odd", icon:ICON.odd }, { id:"neither", label:"Neither", icon:ICON.neither }],
        items:[
          sym("s1", "`x^2 + cos x`", "even", "Both pieces are even, so `(-x)^2 + cos(-x) = x^2 + cos x`."),
          sym("s2", "`x^3 - sin x`", "odd", "Both pieces are odd: `(-x)^3 - sin(-x) = -x^3 + sin x = -(x^3 - sin x)`."),
          sym("s3", "`x^2 + x`", "neither", "Even plus odd: the value is 2 at `x = 1` but 0 at `x = -1`.",
            { wrong:{ odd:"`x^2 + x` has an odd piece, but at `x = 1` the value is 2 and at `x = -1` it’s 0, which isn’t −2. Try another box." } }),
          sym("s4", "`2^x + 2^{-x}`", "even", "The two pieces swap places at `-x`, so the total doesn’t change (P4).",
            { hints:[SH1, "`2^x` becomes `2^{-x}`, and `2^{-x}` becomes `2^x`.", "The value at `-x` is `2^{-x} + 2^x`, the same as at `x`, so it’s Even."] }),
          sym("s5", "`2^x - 2^{-x}`", "odd", "At `-x` the pieces swap places, which flips the sign of the difference (TC3)."),
          sym("s6", "`sin x + cos x`", "neither", "Odd plus even: the value is √2 at `x = π/4` but 0 at `x = -π/4`."),
          sym("s7", "`x^2 - 1/x^2`", "even", "Both pieces are even, and the domain `x ≠ 0` is symmetric."),
          sym("s8", "`sin x + 1`", "neither", "The constant 1 is even and `sin x` is odd: the value is 2 at π/2 but 0 at −π/2."),
          sym("s9", "`f + g`, where `f` and `g` are both even", "even", "`f(-x) + g(-x) = f(x) + g(x)`."),
          sym("s10", "`f - g`, where `f` and `g` are both odd", "odd", "`f(-x) - g(-x) = -f(x) + g(x) = -(f - g)(x)`."),
          sym("s11", "`f + g`, where `f` is even, `g` is odd, and neither is 0 everywhere", "neither", "If `f + g` were even, `g` would have to be 0 everywhere; if it were odd, `f` would. So it’s neither.",
            { wrong:{ odd:"Even + odd is odd only if the even piece is 0 everywhere, and here it isn’t. Try another box." } }),
          sym("s12", "`1/(x - 2) + 1/(x + 2)`", "odd", "Neither piece is odd, but at `-x` they swap places and change sign: `1/(-x - 2) + 1/(-x + 2) = -1/(x + 2) - 1/(x - 2)`.",
            { hints:[SH1, "`1/(-x - 2) = -1/(x + 2)`, and `1/(-x + 2) = -1/(x - 2)`.", "The value at `-x` is `-1/(x + 2) - 1/(x - 2)`, the opposite of the value at `x`, so it’s Odd."] })
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Olivia", how:"",
        instruction:"Olivia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"State the domain of `h(x) = log_{2}(x - 1) + 1/(x - 3)`.",
            steps:["The domain of `log_{2}(x - 1)` is `{x ∈ ℝ | x > 1}`.", "The domain of `1/(x - 3)` is `{x ∈ ℝ | x ≠ 3}`.", "`h` is defined wherever at least one of its two pieces is defined.", "Every real number is in at least one of the two domains, so the domain of `h` is `{x ∈ ℝ}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: the denominator is 0 only at `x = 3`.", "", "Step 4 follows from step 3’s rule. The mistake is earlier."],
            fixes:[
              { t:"`h` needs both pieces, so take the `x`-values in both domains: `{x ∈ ℝ | x > 1, x ≠ 3}`.", ok:true, why:"At `x = 0` the log is undefined, and at `x = 3` the fraction is, so `h` is undefined at both." },
              { t:"`h` needs both pieces: `{x ∈ ℝ | x > 1}`.", why:"That’s the right rule, but `x = 3` is still in this set, and `1/(3 - 3)` is undefined." },
              { t:"`h` needs both pieces: `{x ∈ ℝ | x > 3}`.", why:"`x ≠ 3` removes only the single value 3. Numbers between 1 and 3, such as 2, are fine: `h(2) = 0 + (-1) = -1`." },
              { t:"Step 3 is correct as written.", why:"At `x = 0`, `log_{2}(-1)` is undefined, so there’s nothing to add to `1/(0 - 3)`. `h(0)` doesn’t exist." }],
            hints:["To find `h(x)`, you need both `log_{2}(x - 1)` and `1/(x - 3)`.", "Is `h(0)` defined? Is `h(3)`?", "Step 3 is wrong. The domain is where both pieces are defined: `{x ∈ ℝ | x > 1, x ≠ 3}`."] },
          { id:"e2", goal:2, task:"`f(x) = x^2 - 4` and `g(x) = x - 2`. Find the `x`-intercepts of `h = f + g`.",
            steps:["The zeros of `f` are `x = -2` and `x = 2`.", "The zero of `g` is `x = 2`.", "So the zeros of `f + g` are the zeros of `f` and `g` together: `x = -2` and `x = 2`.", "Check: `h(2) = f(2) + g(2) = 0 + 0 = 0`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "", "This arithmetic is right, and `x = 2` really is a zero. But it doesn’t check `x = -2`. The mistake is earlier."],
            fixes:[
              { t:"Add first: `h(x) = x^2 + x - 6 = (x + 3)(x - 2)`, so the zeros are `x = -3` and `x = 2`.", ok:true, why:"At `x = -2`, `h(-2) = 0 + (-4) = -4`, not 0. A zero of the sum is where `f(x) = -g(x)`." },
              { t:"The zeros of `f + g` are where `f(x) = g(x)`: `x^2 - 4 = x - 2`, so `x = -1` and `x = 2`.", why:"`f(x) = g(x)` finds where the graphs cross: the zeros of `f - g`. At `x = -1`, `h(-1) = -3 + (-3) = -6`." },
              { t:"Only a zero shared by `f` and `g` counts, so the only zero is `x = 2`.", why:"`x = 2` is a zero, but not the only one: `h(-3) = 5 + (-5) = 0`." },
              { t:"Step 3 is correct as written.", why:"`h(-2) = f(-2) + g(-2) = 0 + (-4) = -4`, so `x = -2` isn’t a zero of `h`." }],
            hints:["Test step 3’s claim: is `h(-2)` really 0?", "`h(-2) = 0 + (-4) = -4`. Where `f` is 0, the sum equals `g`, not 0.", "Step 3 is wrong. `h(x) = x^2 + x - 6 = (x + 3)(x - 2)`, so the zeros are −3 and 2."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: a sum that was even when neither piece was, a sum that met `f`’s graph exactly where `g` was zero, or something else?" },
      { id:"j2", q:"In your own words, explain why the domain of `f + g` is the set of `x`-values where <strong>both</strong> `f` and `g` are defined." },
      { id:"j3", q:"Explain to a friend how to sketch `y = 2^x + sin x` from the graphs of `y = 2^x` and `y = sin x`. Which points would you plot first, and why?" },
      { id:"j4", q:"Which still trips you up: zeros of a sum, the symmetry of a sum, or adding waves? What will you do about it before module 47?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`f(x) = x^2 + 1` and `g(x) = 2^x`. What is `(f - g)(3)`?", options:[
          { t:"2", ok:true, why:"`f(3) = 10` and `g(3) = 2^3 = 8`, so `(f - g)(3) = 10 - 8 = 2`." },
          { t:"−2", why:"That’s `(g - f)(3) = 8 - 10`. Order matters: `f - g` starts with `f`." },
          { t:"4", why:"That treats `2^x` as `2x`: 10 − 6. But `2^3 = 8`." },
          { t:"18", why:"That’s `(f + g)(3) = 10 + 8`. The question asks for the difference." }] },
        b:{ prompt:"`f(x) = x^2 - 3` and `g(x) = 3^x`. What is `(f - g)(2)`?", options:[
          { t:"−8", ok:true, why:"`f(2) = 1` and `g(2) = 3^2 = 9`, so `(f - g)(2) = 1 - 9 = -8`." },
          { t:"−5", why:"That treats `3^x` as `3x`: 1 − 6. But `3^2 = 9`." },
          { t:"8", why:"That’s `(g - f)(2) = 9 - 1`. Order matters." },
          { t:"10", why:"That’s `(f + g)(2) = 1 + 9`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`f(x) = log_{2} x` and `g(x) = 1/(x - 5)`. What is the domain of `f + g`?", options:[
          { t:"`{x ∈ ℝ | x > 0, x ≠ 5}`", ok:true, why:"`f + g` needs both values: `log_{2} x` needs `x > 0`, and `1/(x - 5)` needs `x ≠ 5`." },
          { t:"`{x ∈ ℝ | x > 0}`", why:"At `x = 5`, `g(5) = 1/0` is undefined, so `(f + g)(5)` is too." },
          { t:"`{x ∈ ℝ | x ≠ 5}`", why:"At `x = -1`, `log_{2}(-1)` is undefined, so there’s nothing to add." },
          { t:"`{x ∈ ℝ}`", why:"That’s every `x` where at least one piece is defined. `f + g` needs both." }] },
        b:{ prompt:"`f(x) = 1/(x + 1)` and `g(x) = log_{3}(x + 3)`. What is the domain of `f + g`?", options:[
          { t:"`{x ∈ ℝ | x > -3, x ≠ -1}`", ok:true, why:"`f` needs `x ≠ -1`, and `g` needs `x + 3 > 0`, so `x > -3`." },
          { t:"`{x ∈ ℝ | x > -3}`", why:"At `x = -1`, `f(-1) = 1/0` is undefined." },
          { t:"`{x ∈ ℝ | x ≠ -1}`", why:"At `x = -4`, `log_{3}(-1)` is undefined." },
          { t:"`{x ∈ ℝ}`", why:"That’s every `x` where at least one piece is defined. `f + g` needs both." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`f` and `g` are both even functions. Which must be true of `f - g`?", options:[
          { t:"It must be even.", ok:true, why:"`(f - g)(-x) = f(-x) - g(-x) = f(x) - g(x) = (f - g)(x)`." },
          { t:"It must be odd, because subtracting changes the signs.", why:"Subtracting changes the sign of `g`’s values, not the symmetry: `f(-x) - g(-x)` is still `f(x) - g(x)`." },
          { t:"It must be neither, because a difference of two functions has no symmetry.", why:"`x^2 - cos x` is a difference of two even functions, and it’s even." },
          { t:"It is even only when `f` and `g` have the same graph.", why:"It’s even for every pair of even functions: `x^2 - cos x` is even, and `x^2` and `cos x` have different graphs." }] },
        b:{ prompt:"`f` and `g` are both odd functions. Which must be true of `f + g`?", options:[
          { t:"It must be odd.", ok:true, why:"`(f + g)(-x) = -f(x) - g(x) = -(f + g)(x)`." },
          { t:"It must be even, because odd + odd = even, as with numbers.", why:"That’s a rule for odd <strong>numbers</strong>. For functions, `x + x^3` is a sum of two odd functions, and it’s odd." },
          { t:"It must be neither, because adding mixes the two functions.", why:"`x + sin x` is a sum of two odd functions, and it’s odd." },
          { t:"It is odd only when `f` and `g` have the same graph.", why:"It’s odd for every pair of odd functions: `x + sin x` is odd, and `x` and `sin x` have different graphs." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"`f(x) = x^2` and `g(x) = x + 6`. At which `x`-values does the graph of `f - g` cross the `x`-axis?", options:[
          { t:"`x = -2` and `x = 3`", ok:true, why:"`(f - g)(x) = x^2 - x - 6 = (x - 3)(x + 2)`. These are also the `x`-values where the graphs of `f` and `g` cross." },
          { t:"`x = -6` and `x = 0`", why:"Those are the zeros of `g` and of `f`. At `x = 0`, `(f - g)(0) = 0 - 6 = -6`, not 0." },
          { t:"`x = -3` and `x = 2`", why:"Sign slip in factoring: `(x + 3)(x - 2) = x^2 + x - 6`. Expand to check." },
          { t:"There are none, because `x^2 + x + 6` is never 0.", why:"That’s `f + g`. For `f - g`, subtract all of `g`: `x^2 - (x + 6) = x^2 - x - 6`." }] },
        b:{ prompt:"`f(x) = x^2` and `g(x) = 2x + 8`. At which `x`-values does the graph of `f - g` cross the `x`-axis?", options:[
          { t:"`x = -2` and `x = 4`", ok:true, why:"`(f - g)(x) = x^2 - 2x - 8 = (x - 4)(x + 2)`." },
          { t:"`x = -4` and `x = 0`", why:"Those are the zeros of `g` and of `f`. At `x = 0`, `(f - g)(0) = -8`." },
          { t:"`x = -4` and `x = 2`", why:"Sign slip in factoring: `(x + 4)(x - 2) = x^2 + 2x - 8`." },
          { t:"There are none, because `x^2 + 2x + 8` is never 0.", why:"That’s `f + g`. Subtract all of `g`: `x^2 - 2x - 8`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which describes the graph of `h(x) = 3^x + 3^{-x}`?", options:[
          { t:"Even, with lowest point (0, 2)", ok:true, why:"`h(-x) = 3^{-x} + 3^x = h(x)`, so it’s even. `h(0) = 1 + 1 = 2`, and moving away from 0 either way, one piece grows faster than the other shrinks (`h(1) = h(-1) = 3 + 1/3 = 10/3`), so (0, 2) is the lowest point." },
          { t:"Even, with lowest point (0, 1)", why:"`3^0 = 1` for each piece, so `h(0) = 1 + 1 = 2`." },
          { t:"Neither even nor odd, with lowest point (0, 2)", why:"Neither piece is even, but the sum is: `h(-x) = h(x)`." },
          { t:"Odd, passing through (0, 0)", why:"That describes `3^x - 3^{-x}`. Here `h(0) = 2`." }] },
        b:{ prompt:"Which describes the graph of `h(x) = 3^x - 3^{-x}`?", options:[
          { t:"Odd and increasing, passing through (0, 0)", ok:true, why:"`h(-x) = 3^{-x} - 3^x = -h(x)`, so it’s odd, and `h(0) = 1 - 1 = 0`. `3^x` rises, and `-3^{-x}` rises too (`3^{-x}` falls, and the minus flips it), so the sum rises." },
          { t:"Odd and decreasing, passing through (0, 0)", why:"`3^{-x}` falls, but it’s subtracted, so `-3^{-x}` rises. Rising plus rising is rising." },
          { t:"Neither even nor odd, increasing, passing through (0, 0)", why:"`h(-x) = -h(x)`: it’s odd, even though neither piece is." },
          { t:"Even, with lowest point (0, 2)", why:"That describes `3^x + 3^{-x}`. Here `h(0) = 0`." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Which describes the end behaviour of `h(x) = x^4 - 3^x`?", options:[
          { t:"As `x → -∞`, `h(x) → ∞`; as `x → ∞`, `h(x) → -∞`", ok:true, why:"Far left, `3^x → 0`, so `x^4` takes over and `h → ∞`. Far right, `3^x` eventually outgrows any power (`3^{10} = 59 049`, while `10^4 = 10 000`), and it’s subtracted, so `h → -∞`." },
          { t:"As `x → -∞`, `h(x) → ∞`; as `x → ∞`, `h(x) → ∞`", why:"That lets `x^4` win at both ends. An exponential eventually beats every power of `x`." },
          { t:"As `x → -∞`, `h(x) → -∞`; as `x → ∞`, `h(x) → -∞`", why:"That lets `3^x` win at both ends. Far left, `3^x → 0`, so `x^4` takes over." },
          { t:"As `x → -∞`, `h(x) → 0`; as `x → ∞`, `h(x) → -∞`", why:"`3^x → 0` far left, but `x^4` doesn’t: `h(x)` is about `x^4` there." }] },
        b:{ prompt:"Which describes the end behaviour of `h(x) = 3^{-x} - x^4`?", options:[
          { t:"As `x → -∞`, `h(x) → ∞`; as `x → ∞`, `h(x) → -∞`", ok:true, why:"Far left, `3^{-x}` outgrows any power (at `x = -10` it’s `3^{10} = 59 049`, while `x^4 = 10 000`), so `h → ∞`. Far right, `3^{-x} → 0`, so `-x^4` takes over and `h → -∞`." },
          { t:"As `x → -∞`, `h(x) → -∞`; as `x → ∞`, `h(x) → -∞`", why:"That lets `-x^4` win at both ends. Far left, the exponential wins." },
          { t:"As `x → -∞`, `h(x) → ∞`; as `x → ∞`, `h(x) → 0`", why:"`3^{-x} → 0` far right, but `-x^4` doesn’t: `h(x)` is about `-x^4` there." },
          { t:"As `x → -∞`, `h(x) → ∞`; as `x → ∞`, `h(x) → ∞`", why:"Far right, `-x^4 → -∞`: the minus sign stays." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of how to find the point on the graph of `f + g` at `x = 3`, using the graphs of `f` and `g`?", options:[
          { t:"“Read `f(3)` and `g(3)` at the same `x`, keep their signs, and add them. The point is (3, `f(3) + g(3)`).”", ok:true, why:"Same input, signed outputs added: that’s the definition of `f + g`." },
          { t:"“Measure the two heights as lengths and add them, since lengths are never negative.”", why:"If `g(3)` is below the axis, it pulls the sum down. Lengths lose that sign." },
          { t:"“Add the two points: (3, `f(3)`) + (3, `g(3)`) = (6, `f(3) + g(3)`).”", why:"The input stays 3. Only the outputs add." },
          { t:"“Find where the graphs of `f` and `g` cross; that point is on the graph of `f + g`.”", why:"Where the graphs cross, `f(x) = g(x)`, so the sum there is `2f(x)`, not `f(x)`." }] },
        b:{ prompt:"Which is the best explanation of how to find the point on the graph of `f - g` at `x = 3`, using the graphs of `f` and `g`?", options:[
          { t:"“Read `f(3)` and `g(3)` at the same `x`, keep their signs, and subtract. The point is (3, `f(3) - g(3)`): its height is the signed gap from `g`’s graph up to `f`’s.”", ok:true, why:"Same input, signed outputs subtracted in order." },
          { t:"“Measure the gap between the two graphs as a length, so the height is never negative.”", why:"If `f`’s graph is below `g`’s, the difference is negative." },
          { t:"“Subtract the two points: (3, `f(3)`) − (3, `g(3)`) = (0, `f(3) - g(3)`).”", why:"The input stays 3." },
          { t:"“Either order works: `f(3) - g(3)` and `g(3) - f(3)` give the same point.”", why:"They’re opposites. `f - g` starts with `f`." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"`f(x) = x^2 + 1` and `g(x) = log_{2} x`. Which statement is written correctly?", options:[
          { t:"`(f + g)(2) = f(2) + g(2) = 5 + 1 = 6`", ok:true, why:"The brackets around `f + g` name the new function, and its value at 2 is the sum of the two values at 2." },
          { t:"`(f + g)(2) = f(2 + 2) = f(4) = 17`", why:"That adds the inputs. `f + g` adds the outputs at the same input." },
          { t:"`f + g(2) = 5 + 1 = 6`", why:"Without brackets, ‘`f + g(2)`’ means the function `f` plus the number `g(2)`. Write `(f + g)(2)`." },
          { t:"`(f + g)(2) = f(2) · g(2) = 5`", why:"That’s the product `f · g` at 2 (module 47). The sum adds: 5 + 1 = 6." }] },
        b:{ prompt:"`f(x) = 2^x` and `g(x) = x^2`. Which statement is written correctly?", options:[
          { t:"`(f - g)(3) = f(3) - g(3) = 8 - 9 = -1`", ok:true, why:"The brackets name the new function, and its value at 3 is `f(3) - g(3)`." },
          { t:"`(f - g)(3) = f(3 - 3) = f(0) = 1`", why:"That subtracts the inputs. `f - g` subtracts the outputs at the same input." },
          { t:"`f - g(3) = 8 - 9 = -1`", why:"Without brackets, ‘`f - g(3)`’ means the function `f` minus the number `g(3)`. Write `(f - g)(3)`." },
          { t:"`(f - g)(3) = g(3) - f(3) = 9 - 8 = 1`", why:"That’s `(g - f)(3)`. Order matters." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Two speakers play the same note. At one seat, their waves are `y = 2 sin 4x` and `y = sin(4x + π)`. What does a listener at that seat hear?", options:[
          { t:"The wave `y = sin 4x`: the same pitch, with amplitude 1", ok:true, why:"`sin(4x + π) = -sin 4x`, so the sum is `2 sin 4x - sin 4x = sin 4x`. The flipped wave takes away part of the first one." },
          { t:"Silence, because a flipped wave cancels.", why:"It cancels completely only if the amplitudes match. Here 2 − 1 = 1 is left." },
          { t:"The wave `y = 3 sin 4x`, because the amplitudes add.", why:"The second wave is flipped, so it subtracts." },
          { t:"The wave `y = sin 8x`, because the pitches add.", why:"Adding waves adds heights at each `x`; it doesn’t add frequencies. Both waves have frequency 4, and so does the sum." }] },
        b:{ prompt:"At another seat, the waves are `y = 3 sin 2x` and `y = 2 sin(2x + π)`. What does a listener at that seat hear?", options:[
          { t:"The wave `y = sin 2x`: the same pitch, with amplitude 1", ok:true, why:"`sin(2x + π) = -sin 2x`, so the sum is `3 sin 2x - 2 sin 2x = sin 2x`." },
          { t:"Silence, because a flipped wave cancels.", why:"It cancels completely only if the amplitudes match. Here 3 − 2 = 1 is left." },
          { t:"The wave `y = 5 sin 2x`, because the amplitudes add.", why:"The second wave is flipped, so it subtracts." },
          { t:"The wave `y = sin 4x`, because the pitches add.", why:"Adding waves doesn’t add frequencies. Both waves have frequency 2, and so does the sum." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A school club sells `x` hoodies. Its revenue is `R(x) = 50x - x^2` dollars (the price drops as it sells more), and its cost is `C(x) = 10x + 300` dollars. Profit is `P = R - C`. For which numbers of hoodies is the profit positive?", options:[
          { t:"`10 < x < 30`", ok:true, why:"`P(x) = 50x - x^2 - (10x + 300) = -x^2 + 40x - 300 = -(x - 10)(x - 30)`. It’s positive between its zeros, where the revenue graph is above the cost graph." },
          { t:"`x > 10`", why:"Profit turns positive at 10, but revenue falls again as the price drops, so the profit is negative again past 30. Check `x = 40`: `P(40) = -300`." },
          { t:"`0 < x < 50`", why:"That’s where revenue is positive. Profit is revenue <strong>minus</strong> cost." },
          { t:"`x < 10` or `x > 30`", why:"Sign slip: `-(x - 10)(x - 30)` is positive <strong>between</strong> 10 and 30, because its leading coefficient is negative." }] },
        b:{ prompt:"A club’s revenue is `R(x) = 60x - x^2` dollars and its cost is `C(x) = 20x + 375` dollars for `x` items. Profit is `P = R - C`. For which numbers of items is the profit positive?", options:[
          { t:"`15 < x < 25`", ok:true, why:"`P(x) = -x^2 + 40x - 375 = -(x - 15)(x - 25)`, positive between its zeros." },
          { t:"`x > 15`", why:"Profit is negative again past 25. Check `x = 30`: `P(30) = -75`." },
          { t:"`0 < x < 60`", why:"That’s where revenue is positive. Profit is revenue minus cost." },
          { t:"`x < 15` or `x > 25`", why:"Sign slip: with a negative leading coefficient, the profit is positive between the zeros." }] } }
    ]
  },
  task:{
    title:"Build to spec", summary:"Build to spec",
    statement:"<p>Build `h(x) = f(x) + c · g(x)` so that <strong>(1)</strong> its domain is `{x ∈ ℝ | x > 0}`, <strong>(2)</strong> its graph passes through (1, 1), and <strong>(3)</strong> it increases over its whole domain. There’s more than one design. Can you find three that are different functions?</p>",
    checks:["The domain of `h` is `{x ∈ ℝ | x > 0}`", "`h` passes through (1, 1)", "`h` increases over its whole domain"],
    tips:["Right now the domain of `h` is {set}. Only one library function stops at `x = 0` and refuses every `x ≤ 0`. Use it, and pair it with a function that’s defined for every `x > 0`.",
      "Right now `h(1)` = {value}. `log_{2} 1 = 0`, so if one piece is `log_{2} x`, the other piece, times its `c`, must equal 1 at `x = 1`.",
      "`h` goes down somewhere, for example between `x` = {a} and `x` = {b}. A falling piece (such as `1/x`, or a rising function with a negative `c`) can pull the total down. Rising pieces with `c > 0` are safe, but test anything else."],
    sameFn:"{new} is the same function as {old}. Designs that make the same function count once.",
    explainPrompt:"Explain why your design meets all three conditions.",
    vocab:"Use the words domain, both, log₂ 1 = 0 and increasing.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Notice: `log_{2} 1 = 0`, so the log adds nothing at `x = 1`, and the other piece has to supply the 1. And `log_{2} x + 2 · 2^{-x}` works even though `2^{-x}` falls: the log always rises faster than `2 · 2^{-x}` falls. Rising plus falling can still rise."
  },
  cards:[
    ["`(f + g)(x)`", "`f(x) + g(x)`: add the signed outputs at the same `x`. If `f(1) = 2` and `g(1) = -1`, then `(f + g)(1) = 1`, at the point (1, 1)."],
    ["`(f - g)(x)`", "`f(x) - g(x)`: the signed gap from `g`’s graph up to `f`’s. Order matters: `g - f` is its opposite."],
    ["The domain of `f + g` or `f - g`", "Where <strong>both</strong> are defined. `log_{2} x + 1/(x - 2)` has domain `{x ∈ ℝ | x > 0, x ≠ 2}`."],
    ["Zeros of `f + g`", "Where `f(x) = -g(x)`, not the zeros of `f` and `g`. `x^2 - 4` and `x - 2` add to `(x + 3)(x - 2)`: zeros −3 and 2."],
    ["Where the graph of `f + g` meets the graph of `f`", "Where `g(x) = 0`. `2^x + sin x` meets `2^x` at `x = -π`, 0, π, …"],
    ["Zeros of `f - g`", "Where `f(x) = g(x)`: where the graphs of `f` and `g` cross."],
    ["Symmetry rules", "Even ± even is even; odd ± odd is odd; even + odd (neither one 0 everywhere) is neither."],
    ["Two functions with no symmetry", "Can still combine into one: `2^x + 2^{-x}` is even, and `2^x - 2^{-x}` is odd. Test the result."],
    ["Far left and far right", "The faster-growing piece takes over. `x^2 - 2^x → -∞` as `x → ∞` (`2^x` wins) and → ∞ as `x → -∞` (`2^x → 0`, so `x^2` wins)."],
    ["Superposition", "Adding waves point by point. In step, the amplitudes add; flipped, they subtract; equal and flipped, they cancel (noise-cancelling headphones)."],
    ["How long a sum of waves takes to repeat", "Until both pieces repeat together. `sin 2x` (period π) + `sin 3x` (period 2π/3) repeats every 2π. A phone key’s tone is a sum of two waves."],
    ["The highest point of `f + g`", "At most max `f` + max `g`, and only that high if both peak at the same `x`. `sin x + cos x` tops out at √2, not 2."]
  ]
};
