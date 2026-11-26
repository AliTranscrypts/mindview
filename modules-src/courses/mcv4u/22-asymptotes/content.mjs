// MCV4U 22 Vertical, Horizontal and Oblique Asymptotes. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/22-asymptotes.md
// LIM("x → 2") typesets lim with the approach underneath (same markup as MV.mcv.lim; styled by .lm-lim in mcv4u.css).
const LIM = (s) => '<span class="lm-lim"><span class="lm-lt">lim</span><span class="vh"> (</span><span class="lm-lu">`' + s + '`</span><span class="vh">)</span></span>';
// Misconception core sentences (plan §3)
const M1 = (a) => "Factor first. If `(x " + (a < 0 ? "+ " + -a : "- " + a) + ")` cancels, `x = " + a + "` is a hole, not an asymptote.";
const M2 = "Divide by the highest power in the denominator. If the numerator’s degree is smaller, every term → 0.";
const M3 = "A horizontal asymptote describes what happens as `x → ±∞`. At finite `x`, the graph can cross it.";
const M4 = (a) => "Check the sign of each factor just left and just right of " + a + ". A squared factor is positive on both sides.";
const M5 = "Divide fully. The quotient `mx + b` is the asymptote; the constant `b` matters.";
const M6 = (L) => "∞ isn’t a number you can substitute. Write " + LIM("x → ∞") + " `f(x) = " + L + "`.";
const M7 = "`√{x^2} = |x|`. For `x < 0` that’s `-x`, so the signs can differ at the two ends.";
const M8 = "The remainder term → 0. Leave it out of the asymptote’s equation.";

export default {
  id:"22-asymptotes",
  kind:"topic",
  title:"Vertical, horizontal and oblique asymptotes",
  topic:"Vertical, Horizontal and Oblique Asymptotes",
  readyTopic:"asymptotes",
  hero:{
    eq:'<span class="az-he">' + LIM("x → 2^{+}") + " `f(x) = +∞`</span> <span class=\"az-hdot\" aria-hidden=\"true\">·</span> <span class=\"az-he\">" + LIM("x → ∞") + " `f(x) = 3`</span> <span class=\"az-hdot\" aria-hidden=\"true\">·</span> <span class=\"az-he\">`f(x) - (x + 1) → 0`</span>",
    eqLabel:"The limit of f of x as x approaches 2 from the right is plus infinity. The limit of f of x as x approaches infinity is 3. f of x minus (x + 1) approaches 0.",
    eqSize:"sm",
    headline:"Asymptotes are limits you can see",
    text:"A <strong>vertical asymptote</strong> is where `f` grows without bound as `x` nears a value. A <strong>horizontal asymptote</strong> is the value `f` settles toward as `x → ±∞`. An <strong>oblique asymptote</strong> is a slanted line the graph hugs far out. Limits make all three precise, and tell you which side the graph is on.",
    fig:{ aria:"The graph of y = (x² + 3)/(x − 1) draws from the left. Near x = 1 it plunges toward −∞ beside a dashed vertical asymptote x = 1, and on the other side it comes down from +∞. Then the view zooms out 20 times: both branches straighten along the dashed oblique asymptote y = x + 1, and the gap between the curve and the line shrinks toward 0." }
  },
  goals:[
    "I can find vertical asymptotes and holes of a rational function by factoring and cancelling.",
    "I can describe the behaviour near a vertical asymptote with one-sided limits (+∞ or −∞).",
    "I can evaluate limits at infinity by dividing by the highest power and state horizontal asymptotes, including different ones at +∞ and −∞.",
    "I can find an oblique asymptote by division.",
    "I can decide which side of a horizontal or oblique asymptote the graph is on, and where it crosses a horizontal asymptote.",
    "I can interpret asymptotes as long-run values in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factoring and holes", goal:1, prompt:"Simplify `{x^2 - 9}/{x^2 + 3x}` and state the restrictions.",
          options:[
            { t:"`{x - 3}/{x}`, `x ≠ 0, -3`", ok:true, why:"`{(x - 3)(x + 3)}/{x(x + 3)}`; both original restrictions stay." },
            { t:"`{x - 3}/{x}`, `x ≠ 0`", why:"`x = -3` still makes the original undefined." },
            { t:"`{-3}/{x}`", why:"Only factors cancel." },
            { t:"`{x + 3}/{x}`, `x ≠ 0`", why:"`x + 3` is the common factor." }],
          hints:["Factor top and bottom.", "`(x - 3)(x + 3)` and `x(x + 3)`.", "`{x - 3}/{x}`, `x ≠ 0, -3`."] },
        { id:"w2", skill:"Factoring and holes", goal:1, prompt:"`f(x) = {x - 2}/{x^2 - 4}` has a hole at `x = 2`. What is its `y`-coordinate?",
          options:[
            { t:"1/4", ok:true, why:"`f = {1}/{x + 2}` for `x ≠ 2`; `{1}/{2 + 2}`." },
            { t:"0", why:"Cancel first, then substitute." },
            { t:"Undefined", why:"The hole’s `y`-value comes from the simplified form." },
            { t:"1/2", why:"1/(2 + 2) = 1/4." }],
          hints:["Factor `x^2 - 4`.", "Cancel `x - 2`: `{1}/{x + 2}`.", "At `x = 2`: 1/4."] },
        { id:"w3", skill:"One-sided limits", goal:2, prompt:LIM("x → 0^{+}") + " `{1}/{x}` = ?",
          options:[
            { t:"+∞", ok:true, why:"Small positive denominators make huge positive values." },
            { t:"−∞", why:"`x → 0^{+}` means `x` is a small <strong>positive</strong> number." },
            { t:"0", why:"1/0.001 = 1000." },
            { t:"1", why:"Try `x = 0.01`: 100." }],
          hints:["Try `x = 0.1`, 0.01.", "10, 100, …", "+∞ (the limit does not exist as a number)."] },
        { id:"w4", skill:"One-sided limits", goal:2, prompt:"What is the sign of `{x + 4}/{x - 3}` when `x` is just less than 3, like 2.99?",
          options:[
            { t:"Negative", ok:true, why:"(+6.99)/(−0.01) < 0." },
            { t:"Positive", why:"2.99 − 3 = −0.01." },
            { t:"Zero", why:"The numerator is about 7, not 0." },
            { t:"Undefined", why:"Only `x = 3` itself is undefined." }],
          hints:["Substitute 2.99.", "Numerator ≈ 7, denominator −0.01.", "Negative."] },
        { id:"w5", skill:"Polynomial division", goal:4, prompt:"Divide `x^2 + 5x + 2` by `x + 1`.",
          options:[
            { t:"Quotient `x + 4`, remainder −2", ok:true, why:"`(x + 1)(x + 4) = x^2 + 5x + 4`; 2 − 4 = −2." },
            { t:"Quotient `x + 5`, remainder 2", why:"Multiply back: `(x + 1)(x + 5) = x^2 + 6x + 5`." },
            { t:"Quotient `x + 4`, remainder 2", why:"2 − 4 = −2." },
            { t:"Quotient `x + 6`, remainder 8", why:"Subtract `x^2 + x`: `4x + 2` remains." }],
          hints:["`x^2 ÷ x = x`.", "Subtract `x(x + 1)`: `4x + 2` remains.", "`4x ÷ x = 4`; subtract `4x + 4`: −2."] },
        { id:"w6", skill:"Polynomial division", goal:4, prompt:"Which equals `{x^2 + 1}/{x}`?",
          options:[
            { t:"`x + {1}/{x}`", ok:true, why:"Split the fraction: `{x^2}/{x} + {1}/{x}`." },
            { t:"`x + 1`", why:"`{1}/{x}` isn’t 1." },
            { t:"`x`", why:"The `{1}/{x}` is still there; it just gets small for large `x`." },
            { t:"`2x`", why:"`{x^2}/{x} = x`." }],
          hints:["Split into two fractions.", "`{x^2}/{x}` and `{1}/{x}`.", "`x + {1}/{x}`."] }
      ],
      refreshers:{
        "Factoring and holes":"Cancel common factors. The cancelled value is a hole; its `y`-value comes from the simplified form.",
        "One-sided limits":"Near `x = a`, decide the sign of every factor for `x` slightly less than `a` and slightly more than `a`.",
        "Polynomial division":"Divide, multiply back, subtract, repeat. `{P(x)}/{D(x)} = Q(x) + {R(x)}/{D(x)}`."
      }
    }
  },
  explore:{
    heading:"Asymptote zoom",
    intro:"Choose a function. Zoom in near the trouble spots and zoom out to the far ends. The approach table and the gap readout show the limits behind every asymptote.",
    predictions:[
      { id:"p1", prompt:"<strong>R2</strong> `{x^2 - 4}/{x^2 - 5x + 6}`: `x^2 - 5x + 6 = 0` at `x = 2` and `x = 3`. How many vertical asymptotes does R2 have?",
        options:[{ t:"1", ok:true }, { t:"2" }, { t:"0" }, { t:"3" }],
        explain:"`(x - 2)` cancels, leaving `{x + 2}/{x - 3}`: a hole at (2, −4) and one asymptote, `x = 3`." },
      { id:"p2", prompt:"<strong>R3</strong> `{4x}/{x^2 + 4}`: as you zoom out, what does the graph approach?",
        options:[{ t:"`y = 0`", ok:true }, { t:"`y = 4`" }, { t:"`y = 4x`" }, { t:"It keeps growing" }],
        explain:"Divide by `x^2`: `{4/x}/{1 + 4/x^2}` → 0/1 = 0." },
      { id:"p3", prompt:"<strong>R5</strong>: does the graph of `{2x^2 + 3x}/{x^2 + 1}` ever cross its horizontal asymptote `y = 2`?",
        options:[{ t:"Yes, once, at `x = 2/3`", ok:true }, { t:"No, never" }, { t:"Yes, twice" }, { t:"It touches it without crossing" }],
        explain:"`2x^2 + 3x = 2x^2 + 2` gives `x = 2/3`. An asymptote limits the far ends, not the middle." },
      { id:"p4", prompt:"<strong>R4</strong>: zoom out on `{x^2 + x - 2}/{x - 2}`. The graph will look like…",
        options:[{ t:"the line `y = x + 3`", ok:true }, { t:"the line `y = x`" }, { t:"the line `y = 1`" }, { t:"the parabola `y = x^2`" }],
        explain:"`f(x) = x + 3 + {4}/{x - 2}`. The last part → 0, so the graph hugs `y = x + 3`." }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Near mode on R1: enter both one-sided limits at `x = -1`.",
        why:"Left of −1 the numerator is near −9 and `x + 1 < 0`: negative ÷ negative, so `f → +∞`. Right of −1 the denominator is a small positive number: `f → -∞`.",
        hints:["What is the numerator near `x = -1`?", "About −9. Now the sign of `x + 1` on each side.", "Left: −9/(small −) → +∞. Right: −9/(small +) → −∞."] },
      { id:"tc2", goal:[1, 3], prompt:"Build mode: choose `a` and `b` (sliders −6 to 6, step 1) so that `f(x) = {ax + 3}/{x - b}` has the vertical asymptote `x = 2` and the horizontal asymptote `y = -3`.",
        why:"`b = 2` makes the denominator 0 at 2, and far out `f` behaves like `{-3x}/{x} = -3`. The numerator at 2 is −6 + 3 ≠ 0, so `x = 2` is a true asymptote.",
        hints:["Where is the denominator 0?", "Far out, `{ax + 3}/{x - b}` behaves like `{ax}/{x}`.", "`b = 2` and `a = -3`; check the numerator at 2: −6 + 3 ≠ 0."] },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Build mode: choose `p` and `q` (sliders −10 to 10, step 1) so that `f(x) = {x^2 + px + q}/{x - 1}` has the oblique asymptote `y = x + 4`, lies <strong>below</strong> that asymptote for `x > 1`, and has `y`-intercept 6.",
        why:"`{x^2 + 3x - 6}/{x - 1} = x + 4 - {2}/{x - 1}`: the remainder is negative for `x > 1`, so the graph is below `y = x + 4`, and `f(0) = 6`.",
        hints:["Divide `x^2 + px + q` by `x - 1`: quotient `x + (p + 1)`, remainder `q + p + 1`.", "`p = 3`. For `x > 1`, `x - 1 > 0`, so ‘below’ needs a negative remainder: `q + 4 < 0`.", "The `y`-intercept is `-q = 6`, so `q = -6`; the remainder is −2 < 0. ✓"] }
    ]
  },
  part3:{
    slug:"side", name:"Which side?",
    heading:"Which side of the asymptote?",
    intro:"Explore found the asymptotes. A sketch also needs to know where the graph sits beside them. Each station turns that into a sign question: the sign of `f(x) - L`, of the remainder, or of each factor. Work through the three stations, then try the quick check.",
    quickCheck:{
      title:"Quick check", summary:"Which side? quick check",
      items:[
        { id:"q1", goal:5, prompt:"`f(x) = 3 + {5}/{x + 1}`. As `x → -∞`, the graph is…",
          choices:[
            { t:"below `y = 3`", ok:true, fb:"Right. For large negative `x`, `{5}/{x + 1} < 0`." },
            { t:"above `y = 3`", fb:"For large negative `x`, `{5}/{x + 1} < 0`." },
            { t:"on `y = 3`", fb:"For large negative `x`, `{5}/{x + 1} < 0`." },
            { t:"crossing `y = 3`", fb:"For large negative `x`, `{5}/{x + 1} < 0`." }] },
        { id:"q2", goal:2, prompt:LIM("x → 4") + " of `{x + 1}/{(x - 4)^2}` is…",
          choices:[
            { t:"+∞ from both sides", ok:true, fb:"Right. A square is positive on both sides; the numerator is near 5." },
            { t:"−∞ from both sides", fb:"A square is positive on both sides; the numerator is near 5." },
            { t:"+∞ on the right, −∞ on the left", fb:"A square is positive on both sides; the numerator is near 5." },
            { t:"0", fb:"A square is positive on both sides; the numerator is near 5." }] },
        { id:"q3", goal:5, prompt:"Can `y = {x - 1}/{x^2 + 1}` cross `y = 0`?",
          choices:[
            { t:"Yes, at `x = 1`", ok:true, fb:"Right. `f(1) = 0`. Crossing an HA at finite `x` is allowed." },
            { t:"No, never", fb:"`f(1) = 0`. Crossing an HA at finite `x` is allowed." },
            { t:"Only as `x → ∞`", fb:"`f(1) = 0`. Crossing an HA at finite `x` is allowed." },
            { t:"Yes, at `x = 0`", fb:"`f(1) = 0`. Crossing an HA at finite `x` is allowed." }] },
        { id:"q4", goal:5, prompt:"`f(x) = 2x - 1 + {3}/{x + 2}`. For `x > -2` the graph is…",
          choices:[
            { t:"above `y = 2x - 1`", ok:true, fb:"Right. `{3}/{x + 2} > 0` when `x > -2`." },
            { t:"below it", fb:"`{3}/{x + 2} > 0` when `x > -2`." },
            { t:"on it", fb:"`{3}/{x + 2} > 0` when `x > -2`." },
            { t:"crossing it", fb:"`{3}/{x + 2} > 0` when `x > -2`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ asymptotes", summary:"Function ↔ asymptotes", goal:[1, 3, 4],
        instruction:"Match each function to its asymptotes and holes.",
        how:"Tap a function, then tap its asymptotes and holes.",
        leftTitle:"Function", rightTitle:"Asymptotes and holes",
        left:[
          { id:"l1", t:"`{x + 3}/{x - 1}`", why:"Nothing cancels, and equal degrees give `y = {1}/{1}`." },
          { id:"l2", t:"`{x - 1}/{x^2 - 1}`", why:"`{x - 1}/{(x - 1)(x + 1)} = {1}/{x + 1}`: a hole at `x = 1`, the asymptote `x = -1`, and a smaller numerator degree gives `y = 0`." },
          { id:"l3", t:"`{6x^2}/{2x^2 + 5}`", why:"`2x^2 + 5` is never 0, and equal degrees give `y = {6}/{2}`." },
          { id:"l4", t:"`{x^2 - 9}/{x + 2}`", why:"`x^2 - 9 = (x + 2)(x - 2) - 5`: the quotient is `x - 2`." },
          { id:"l5", t:"`{2x^2 - x}/{x - 1}`", why:"Quotient `2x + 1`, remainder 1.",
            hints:["Divide `2x^2 - x` by `x - 1`.", "`2x(x - 1) = 2x^2 - 2x`; `x` remains.", "Quotient `2x + 1`, remainder 1: OA `y = 2x + 1`."] },
          { id:"l6", t:"`{5}/{x^2 + 1}`", why:"`x^2 + 1` is never 0, and the numerator’s degree is smaller, so `y = 0`." },
          { id:"l7", t:"`{x^2 + 1}/{x}`", why:"`x + {1}/{x}`: the quotient is `x`." },
          { id:"l8", t:"`{3x - 1}/{x^2 - 4}`", why:"`x^2 - 4 = 0` at `x = ±2`, and the numerator’s degree is smaller, so `y = 0`." }
        ],
        right:[
          { id:"r1", t:"VA `x = 1`; HA `y = 1`" },
          { id:"r2", t:"Hole at `x = 1`; VA `x = -1`; HA `y = 0`" },
          { id:"r3", t:"HA `y = 3`; no VA" },
          { id:"r4", t:"VA `x = -2`; OA `y = x - 2`" },
          { id:"r5", t:"VA `x = 1`; OA `y = 2x + 1`" },
          { id:"r6", t:"HA `y = 0`; no VA" },
          { id:"r7", t:"VA `x = 0`; OA `y = x`" },
          { id:"r8", t:"VA `x = ±2`; HA `y = 0`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r8":"`(x - 1)` cancels: `x = 1` is a hole.",
          "l2|r1":"`(x - 1)` cancels: `x = 1` is a hole.",
          "l2|r5":"`(x - 1)` cancels: `x = 1` is a hole.",
          "l4|r7":"`x^2 - 9 = (x + 2)(x - 2) - 5`: the quotient is `x - 2`.",
          "l8|r3":"The numerator’s degree is smaller, so `y = 0`."
        },
        wrongDefault:"Factor and cancel first, then compare degrees." },
      { id:"limits", type:"custom", title:"Limits at infinity and design", summary:"Limits at infinity and design", star:true, goal:[3, 4, 5],
        instruction:"Find each limit or design value, then press Check.",
        how:"Type a whole number or a fraction such as −3/5. Each item has its own Check button.",
        items:[
          { id:"S1", goal:3, kind:"num", prompt:LIM("x → ∞") + " `{4x^3 - x}/{2x^3 + 7}`", answer:2,
            why:"Divide by `x^3`: `{4 - 1/x^2}/{2 + 7/x^3}` → 4/2 = 2.",
            wrong:[{ match:[0.5714285714285714, -0.14285714285714285], fb:"Divide by `x^3`; the constants vanish." }],
            general:"Divide every term by `x^3`, then let `x → ∞`." },
          { id:"S2", goal:3, star:true, kind:"num", prompt:LIM("x → -∞") + " `{5x + 1}/{√{x^2 + 3}}`", answer:-5,
            why:"For `x < 0`, `√{x^2 + 3} = -x√{1 + 3/x^2}`, so the expression is `{5 + 1/x}/{-√{1 + 3/x^2}}` → −5.",
            wrong:[{ match:[5], fb:"For `x < 0`, `√{x^2} = -x`." }],
            general:"Divide by `√{x^2} = |x|`; for `x < 0` that’s `-x`." },
          { id:"S3", goal:3, star:true, kind:"num", prompt:LIM("x → ∞") + " `(√{x^2 + 6x} - x)`", answer:3,
            why:"`{6x}/{√{x^2 + 6x} + x} = {6}/{√{1 + 6/x} + 1}` → 6/2 = 3.",
            wrong:[{ match:[0], fb:"∞ − ∞ isn’t 0. Multiply by the conjugate: `{6x}/{√{x^2 + 6x} + x}` → 6/2." }],
            general:"Multiply and divide by the conjugate first.",
            hints:["Multiply and divide by `√{x^2 + 6x} + x`.", "The numerator becomes `(x^2 + 6x) - x^2 = 6x`.", "Divide top and bottom by `x`: `{6}/{√{1 + 6/x} + 1}` → 3."] },
          { id:"S4", goal:[3, 1], star:true, kind:"boxes", prompt:"`f(x) = {ax^2 + bx + 2}/{x^2 - 4}` has the HA `y = 3` and no vertical asymptote at `x = 2`. Find `a` and `b`.",
            boxes:[{ id:"a", label:"`a =`" }, { id:"b", label:"`b =`" }], answer:{ a:3, b:-7 },
            why:"Equal degrees: `y = {a}/{1} = 3`. No asymptote at 2 means the numerator is 0 there: `4(3) + 2b + 2 = 0`, so `b = -7`.",
            general:"The numerator must be 0 at `x = 2`: `4a + 2b + 2 = 0`.",
            generalA:"Equal degrees: the HA is `y = {a}/{1}`." },
          { id:"S5", goal:5, star:true, kind:"num", label:"`x =`", prompt:"Where does `f(x) = {2x^2 - 5x + 1}/{x^2 + 2}` cross its horizontal asymptote?", answer:-0.6,
            why:"HA `y = 2`; `2x^2 - 5x + 1 = 2x^2 + 4` gives `-5x = 3`, so `x = -{3}/{5}`.",
            wrong:[{ match:[0.6], fb:"`-5x + 1 = 4` gives `-5x = 3`." }],
            general:"Set `f(x) = 2` and solve: the `x^2` terms cancel." },
          { id:"S6", goal:[4, 5], star:true, kind:"oa", prompt:"`f(x) = {x^3 + 2x^2}/{x^2 - 1}`. State the oblique asymptote and whether the graph is above or below it as `x → ∞`.",
            answer:{ m:1, b:2, side:"above" },
            why:"`x^3 + 2x^2 = (x^2 - 1)(x + 2) + (x + 2)`, so the asymptote is `y = x + 2`, and `{x + 2}/{x^2 - 1} > 0` for large `x`: above.",
            wrong:[{ m:1, b:0, fb:"Divide fully: the quotient is `x + 2`, the remainder `x + 2`." }],
            general:"Long division by `x^2 - 1`: the quotient is the asymptote.",
            sideFb:"For large `x`, `{x + 2}/{x^2 - 1} > 0`.",
            hints:["Long division by `x^2 - 1`.", "`x(x^2 - 1) = x^3 - x`; then `2(x^2 - 1)`; remainder `x + 2`.", "`{x + 2}/{x^2 - 1} > 0` for large `x`: above `y = x + 2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Victor", how:"", goal:[1, 3, 4],
        instruction:"Victor made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the vertical asymptotes of `f(x) = {x^2 + 2x - 3}/{x^2 - 1}`.",
            steps:["`x^2 - 1 = 0` when `x = 1` or `x = -1`.", "So the vertical asymptotes are `x = 1` and `x = -1`.", "The graph goes to ±∞ on both sides of each one."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 builds on step 2. The mistake is earlier."],
            fixes:[
              { t:"Factor: `{(x + 3)(x - 1)}/{(x - 1)(x + 1)}`. `x - 1` cancels, so `x = 1` is a hole at (1, 2), and the only vertical asymptote is `x = -1`.", ok:true, why:"Cancelled factors make holes, not asymptotes." },
              { t:"The asymptotes are `x = -3` and `x = 1`.", why:"Those are zeros of the numerator." },
              { t:"There are no vertical asymptotes.", why:"`x = -1` still makes the denominator 0 after cancelling." },
              { t:"Step 2 is correct.", why:M1(1) }],
            hints:["Factor the numerator too.", "`(x + 3)(x - 1)`.", "`x = 1` cancels: a hole."] },
          { id:"e2", goal:3, task:"Find " + LIM("x → ∞") + " `{6x^2 + x}/{3x^3 - 2}`.",
            steps:["The numerator and denominator both → ∞.", "So use the leading coefficients: 6/3 = 2.", "The horizontal asymptote is `y = 2`."],
            answer:1,
            stepFb:["Step 1 is correct: it’s an ∞/∞ form.", "", "Step 3 follows from step 2."],
            fixes:[
              { t:"Divide every term by `x^3`: `{6/x + 1/x^2}/{3 - 2/x^3}` → 0/3 = 0. The HA is `y = 0`.", ok:true, why:"The numerator’s degree is smaller, so every term on top → 0." },
              { t:"Divide by `x^2`: `{6}/{3x}` → 2.", why:"`{6 + 1/x}/{3x - 2/x^2}` → 6/∞ = 0." },
              { t:"The limit is ∞, because the numerator grows.", why:"The denominator grows faster." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Are the degrees equal?", "2 and 3: divide by `x^3`.", "0."] },
          { id:"e3", goal:4, task:"Find the oblique asymptote of `f(x) = {2x^2 + 3x - 1}/{x + 1}`.",
            steps:["The numerator’s degree is one more, so there’s an oblique asymptote.",
              "`2x^2 ÷ x = 2x`; `2x(x + 1) = 2x^2 + 2x`; subtract: `x - 1`.",
              "`x ÷ x = 1`; `1(x + 1) = x + 1`; subtract: −2.",
              "So `f(x) = 2x + 1 - {2}/{x + 1}`, and the asymptote is `y = 2x + 1 - 2 = 2x - 1`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The remainder term `-{2}/{x + 1}` → 0, so the asymptote is `y = 2x + 1`.", ok:true, why:"Only the quotient is the asymptote." },
              { t:"The asymptote is `y = 2x`.", why:M5 },
              { t:"The asymptote is `y = 2x + 3`.", why:"That’s from the numerator’s coefficients." },
              { t:"Step 4 is correct.", why:M8 }],
            hints:["What happens to `-{2}/{x + 1}` as `x → ∞`?", "It → 0.", "`y = 2x + 1`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Asymptote zoom: the hole that looked like an asymptote, the crossing, or the two different horizontal asymptotes of R6?" },
      { id:"j2", q:"In your own words, why does dividing by the highest power of `x` reveal the horizontal asymptote?" },
      { id:"j3", q:"Explain to a friend how to decide which side of an oblique asymptote a graph is on." },
      { id:"j4", q:"Which kind of asymptote question still trips you up? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What are the vertical asymptotes of `f(x) = {x^2 - x - 6}/{x^2 - 9}`?", options:[
          { t:"`x = -3` only", ok:true, why:"`{(x - 3)(x + 2)}/{(x - 3)(x + 3)}`: `x = 3` is a hole." },
          { t:"`x = 3` and `x = -3`", why:M1(3) },
          { t:"`x = 3` only", why:"`x - 3` cancels; `x + 3` doesn’t." },
          { t:"`x = -2` and `x = 3`", why:"Those are zeros of the numerator." }] },
        b:{ prompt:"What are the vertical asymptotes of `f(x) = {x^2 + 3x - 10}/{x^2 - 4}`?", options:[
          { t:"`x = -2` only", ok:true, why:"`{(x + 5)(x - 2)}/{(x - 2)(x + 2)}`: `x = 2` is a hole." },
          { t:"`x = 2` and `x = -2`", why:M1(2) },
          { t:"`x = 2` only", why:"`x - 2` cancels; `x + 2` doesn’t." },
          { t:"`x = -5` and `x = 2`", why:"Those are zeros of the numerator." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:LIM("x → ∞") + " `{5 - 4x^2}/{2x^2 + x}` = ?", options:[
          { t:"−2", ok:true, why:"Divide by `x^2`: `{5/x^2 - 4}/{2 + 1/x}` → −4/2." },
          { t:"2", why:"The leading coefficient of the numerator is −4." },
          { t:"5", why:"Constant terms vanish after dividing by `x^2`." },
          { t:"0", why:"The degrees are equal." }] },
        b:{ prompt:LIM("x → ∞") + " `{3x^2 - 7}/{1 - 6x^2}` = ?", options:[
          { t:"−1/2", ok:true, why:"3/(−6)." },
          { t:"1/2", why:"The leading coefficient below is −6." },
          { t:"−7", why:"Constants vanish." },
          { t:"0", why:M2 + " Here the degrees are equal." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What is the oblique asymptote of `f(x) = {x^2 + 4x + 1}/{x + 2}`?", options:[
          { t:"`y = x + 2`", ok:true, why:"`x^2 + 4x + 1 = (x + 2)(x + 2) - 3`." },
          { t:"`y = x`", why:M5 },
          { t:"`y = x - 1`", why:"The remainder −3 isn’t part of the asymptote." },
          { t:"`y = x + 4`", why:"That’s from the numerator, not the quotient." }] },
        b:{ prompt:"What is the oblique asymptote of `f(x) = {x^2 - 2x + 5}/{x - 3}`?", options:[
          { t:"`y = x + 1`", ok:true, why:"`x^2 - 2x + 5 = (x - 3)(x + 1) + 8`." },
          { t:"`y = x`", why:M5 },
          { t:"`y = x + 9`", why:M8 },
          { t:"`y = x - 2`", why:"Divide fully." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Describe the behaviour of `f(x) = {x + 1}/{(x - 2)^2}` near `x = 2`.", options:[
          { t:"`f(x) → +∞` as `x → 2^{-}` and as `x → 2^{+}`", ok:true, why:"The numerator is near 3 and `(x - 2)^2 > 0` on both sides." },
          { t:"`f(x) → -∞` as `x → 2^{-}` and `+∞` as `x → 2^{+}`", why:"A squared factor doesn’t change sign." },
          { t:"`f(x) → +∞` as `x → 2^{-}` and `-∞` as `x → 2^{+}`", why:M4(2) },
          { t:"There’s a hole at `x = 2`.", why:"`x - 2` doesn’t cancel." }] },
        b:{ prompt:"Describe the behaviour of `f(x) = {x - 4}/{(x + 1)^2}` near `x = -1`.", options:[
          { t:"`f(x) → -∞` as `x → -1^{-}` and as `x → -1^{+}`", ok:true, why:"The numerator is near −5; the square is positive." },
          { t:"`f(x) → +∞` as `x → -1^{-}` and `-∞` as `x → -1^{+}`", why:M4("−1") },
          { t:"`f(x) → -∞` as `x → -1^{-}` and `+∞` as `x → -1^{+}`", why:"A squared factor doesn’t change sign." },
          { t:"There’s a hole at `x = -1`.", why:"`x + 1` doesn’t cancel." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Where does `f(x) = {3x^2 + 2x - 5}/{x^2 + 1}` cross its horizontal asymptote?", options:[
          { t:"At `x = 4`", ok:true, why:"HA `y = 3`; `3x^2 + 2x - 5 = 3x^2 + 3` gives `2x = 8`." },
          { t:"It never crosses it.", why:M3 },
          { t:"At `x = 1` and `x = -{5}/{3}`", why:"Those are the `x`-intercepts, where `f = 0`." },
          { t:"At `x = -4`", why:"`2x = 8` gives `x = 4`." }] },
        b:{ prompt:"Where does `f(x) = {2x^2 + x - 3}/{x^2 + 1}` cross its horizontal asymptote?", options:[
          { t:"At `x = 5`", ok:true, why:"HA `y = 2`; `x - 3 = 2`." },
          { t:"It never crosses it.", why:M3 },
          { t:"At `x = 1` and `x = -{3}/{2}`", why:"Those are the `x`-intercepts." },
          { t:"At `x = -5`", why:"`x - 3 = 2` gives `x = 5`." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"What are the horizontal asymptotes of `f(x) = {6x}/{√{4x^2 + 1}}`?", options:[
          { t:"`y = 3` as `x → ∞`, and `y = -3` as `x → -∞`", ok:true, why:"`√{4x^2} = 2|x|`, which is `2x` on the right and `-2x` on the left." },
          { t:"`y = 3` only", why:M7 },
          { t:"`y = 3/2` only", why:"Take the square root of 4 as well: `√{4x^2} = 2|x|`." },
          { t:"`y = 0`, because the denominator has degree 2", why:"`√{4x^2 + 1}` grows like `2|x|`: degree 1." }] },
        b:{ prompt:"What are the horizontal asymptotes of `f(x) = {4x}/{√{x^2 + 5}}`?", options:[
          { t:"`y = 4` as `x → ∞`, and `y = -4` as `x → -∞`", ok:true, why:"`√{x^2} = |x|`, which is `x` on the right and `-x` on the left." },
          { t:"`y = 4` only", why:M7 },
          { t:"`y = 4/5` only", why:"The 5 vanishes far out." },
          { t:"`y = 0`, because the denominator has degree 2", why:"`√{x^2 + 5}` grows like `|x|`: degree 1." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why a graph can cross a horizontal asymptote but never a vertical one?", options:[
          { t:"“A horizontal asymptote describes the behaviour as `x → ±∞`, so the graph may cross it at a finite `x`. A vertical asymptote `x = a` means `f(a)` is undefined and `f` grows without bound near `a`, so the graph can never reach it.”", ok:true, why:"A horizontal asymptote is about the far ends; a vertical one is a value of `x` where `f` has no value." },
          { t:"“Neither can be crossed: an asymptote is a line the graph approaches but never touches.”", why:M3 },
          { t:"“Both can be crossed if the function is continuous.”", why:"A function with a vertical asymptote isn’t continuous there." },
          { t:"“A graph crosses a vertical asymptote whenever the numerator is also 0 there.”", why:"Then it’s a hole, not an asymptote." }] },
        b:{ prompt:"`y = {2x}/{x^2 + 1}` has the horizontal asymptote `y = 0`, yet `y = 0` at `x = 0`. Which is the best explanation?", options:[
          { t:"“`y = 0` describes what happens as `x → ±∞`. At a finite `x` like 0 the function can take the value 0; an asymptote limits the long-run behaviour, not every point.”", ok:true, why:"A horizontal asymptote is a limit at `±∞`, so a crossing at a finite `x` is allowed." },
          { t:"“That’s impossible, so the asymptote must be something else.”", why:M3 },
          { t:"“The graph touches the asymptote only where the denominator is 0.”", why:"The denominator `x^2 + 1` is never 0." },
          { t:"“The asymptote moves to `y = 1` after crossing.”", why:"The limit at `±∞` is still 0." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which correctly describes the behaviour of `f(x) = {2x - 1}/{x + 3}`?", options:[
          { t:"“" + LIM("x → ∞") + " `f(x) = 2` and " + LIM("x → -3^{+}") + " `f(x) = -∞`.”", ok:true, why:"Near `-3^{+}`: numerator −7, denominator small +." },
          { t:"“" + LIM("x → ∞") + " `f(x) = 2` and " + LIM("x → -3^{+}") + " `f(x) = +∞`.”", why:M4("−3") },
          { t:"“`f(∞) = 2` and `f(-3) = ∞`.”", why:"∞ can’t be substituted, and `f(-3)` is undefined." },
          { t:"“" + LIM("x → 2") + " `f(x) = ∞`.”", why:"`f(2) = 3/5`; 2 is the horizontal asymptote’s height, not a vertical asymptote." }] },
        b:{ prompt:"Which correctly describes the behaviour of `f(x) = {3x + 2}/{x - 1}`?", options:[
          { t:"“" + LIM("x → ∞") + " `f(x) = 3` and " + LIM("x → 1^{+}") + " `f(x) = +∞`.”", ok:true, why:"Near `1^{+}`: numerator 5, denominator small +." },
          { t:"“" + LIM("x → ∞") + " `f(x) = 3` and " + LIM("x → 1^{+}") + " `f(x) = -∞`.”", why:M4(1) },
          { t:"“`f(∞) = 3` and `f(1) = ∞`.”", why:M6(3) + " Also, `f(1)` is undefined." },
          { t:"“" + LIM("x → 3") + " `f(x) = ∞`.”", why:"`f(3) = 11/2`; 3 is the horizontal asymptote’s height, not a vertical asymptote." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Salt water with 20 g of salt per litre flows at 5 L/min into a tank holding 100 L of pure water. The concentration after `t` minutes is `c(t) = {20t}/{20 + t}` g/L. When does it first reach 15 g/L, and what does it approach in the long run?", options:[
          { t:"At `t = 60` min; it approaches 20 g/L", ok:true, why:"`20t = 15(20 + t)` gives `t = 60`; " + LIM("t → ∞") + " `c(t) = 20`." },
          { t:"At `t = 60` min; it approaches 100 g/L", why:"Divide by `t`: `{20}/{20/t + 1}` → 20." },
          { t:"At `t = 15` min; it approaches 20 g/L", why:"`c(15) = 300/35 ≈ 8.6`." },
          { t:"It never reaches 15 g/L, because the asymptote is 20", why:"15 < 20, so it gets there." }] },
        b:{ prompt:"Salt water with 30 g/L flows at 10 L/min into a tank holding 50 L of pure water: `c(t) = {30t}/{5 + t}` g/L. When does it first reach 20 g/L, and what does it approach?", options:[
          { t:"At `t = 10` min; it approaches 30 g/L", ok:true, why:"`30t = 20(5 + t)` gives `t = 10`." },
          { t:"At `t = 10` min; it approaches 6 g/L", why:"Divide by `t`: `{30}/{5/t + 1}` → 30." },
          { t:"At `t = 20` min; it approaches 30 g/L", why:"`c(20) = 600/25 = 24`." },
          { t:"It never reaches 20 g/L", why:"20 < 30, so it gets there." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"A stocked lake’s fish population (hundreds) is `P(t) = {600t + 800}/{t + 4}` after `t` years. Which describes the population?", options:[
          { t:"It starts at 200 hundred and increases toward 600 hundred, always staying below it", ok:true, why:"`P = 600 - {1600}/{t + 4}`: the remainder is negative and shrinking." },
          { t:"It decreases toward 600 hundred from above", why:"The remainder `-{1600}/{t + 4}` is negative: below." },
          { t:"It approaches 200 hundred, its starting value", why:"That’s `P(0)`; the long-run value is 600." },
          { t:"It rises past 600 hundred, then falls back to it", why:"`P - 600` is negative for every `t ≥ 0`." }] },
        b:{ prompt:"`P(t) = {400t + 3000}/{t + 5}` (hundreds). Which describes the population?", options:[
          { t:"It starts at 600 hundred and decreases toward 400 hundred, always staying above it", ok:true, why:"`P = 400 + {1000}/{t + 5}`." },
          { t:"It increases toward 400 hundred from below", why:"The remainder `{1000}/{t + 5}` is positive: above." },
          { t:"It approaches 600 hundred, its starting value", why:"That’s `P(0)`; the long-run value is 400." },
          { t:"It falls below 400 hundred, then rises back to it", why:"`P - 400` is positive for every `t ≥ 0`." }] } }
    ]
  },
  task:{
    title:"Asymptote architect", summary:"Asymptote architect",
    statement:"<p>Design a rational function `f(x) = {a(x - r_1)(x - r_2)}/{(x - s_1)(x - s_2)}` that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Its only vertical asymptote is `x = 3`.</li><li>It has a hole at `x = -1`.</li><li>Its horizontal asymptote is `y = 2`.</li><li>For `x > 3`, its graph is below the horizontal asymptote.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose a whole number from −4 to 4 (not 0) for `a`, and whole numbers from −6 to 6 for `r_1`, `r_2`, `s_1` and `s_2`. The graph shows the asymptotes, any holes, and the gap between the graph and `y = 2`, shaded.</p>",
    checks:["Only vertical asymptote `x = 3`", "Hole at `x = -1`", "HA `y = 2`", "Below `y = 2` for `x > 3`"],
    tips:["The denominator needs a factor `(x - 3)` that doesn’t cancel.",
      "A hole needs the same factor, `(x + 1)`, on the top and the bottom.",
      "With equal degrees, the HA is `a` divided by the denominator’s leading coefficient (1).",
      "After cancelling, `f(x) = {2(x - r)}/{x - 3} = 2 + {2(3 - r)}/{x - 3}`. For `x > 3`, that extra part must be negative."],
    explainPrompt:"Explain how you made the hole, why the asymptote is `y = 2`, and how you decided which side of it the graph is on.",
    vocab:"Use the words cancel, hole, vertical asymptote, horizontal asymptote and remainder.",
    success:"Your design meets every condition!",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 4 forces `r > 3`, and the input range stops at 6. Notice that none of these graphs ever crosses `y = 2`: `2 + {2(3 - r)}/{x - 3} = 2` has no solution."
  },
  cards:[
    ["Vertical asymptote `x = a`", "`f(x) → ±∞` as `x → a^{-}` or `a^{+}`; the denominator is 0 at `a` after cancelling."],
    ["Hole", "A cancelled factor; plot an open circle using the simplified form."],
    ["Sign near a VA", "Test each factor just left and right of `a`; an even power keeps its sign."],
    ["Horizontal asymptote", LIM("x → ±∞") + " `f(x) = L` gives `y = L`."],
    ["Limits at infinity", "Divide every term by the highest power of `x` in the denominator; `c/x^n → 0`."],
    ["Degree rules", "Top smaller: `y = 0`. Equal: ratio of leading coefficients. Top one higher: oblique."],
    ["Oblique asymptote", "Divide: `f = mx + b + R/D`; the asymptote is `y = mx + b`."],
    ["Which side?", "The sign of `f(x) - L`, or of the remainder term, for large `|x|`."],
    ["Crossing an HA", "Allowed at finite `x`: solve `f(x) = L`."],
    ["`√{x^2}`", "`= |x|`, so a root can give different asymptotes at +∞ and −∞."],
    ["∞ isn’t a number", "Write " + LIM("x → ∞") + " `f(x) = 2`, never `f(∞) = 2`."],
    ["In context", "A horizontal asymptote is the long-run value (concentration, population, average cost)."]
  ]
};

