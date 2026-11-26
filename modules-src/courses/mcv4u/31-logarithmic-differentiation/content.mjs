// MCV4U 31 Logarithmic Differentiation. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/31-logarithmic-differentiation.md
// misconception core sentences (plan §3)
const M1 = "The power rule needs a constant exponent. Here the exponent moves with `x`.";
const M2 = "The exponential rule needs a constant base. Here the base moves too.";
const M3 = "You’ve found `y′/y`. Multiply both sides by `y`, then write `y` in terms of `x`.";
const M4 = "`y` depends on `x`, so by the chain rule `d/dx ln y = (1/y)(dy/dx)`.";
const M5 = "ln turns products into sums, quotients into differences, and exponents into factors in front.";
const M6 = "`(uv)′ = u′v + uv′`, not `u′v′`.";
const M7 = "`x^x` is defined here for `x > 0`. For a product that can be negative, take `ln |y|`; the derivative formula comes out the same wherever `y ≠ 0`.";
const E = Math.E;
const MATCH12 = "For `x^{2x}`, `ln y = 2x ln x`: every term doubles.";
const MATCH34 = "`ln y = (ln x)/x` needs the quotient rule: `(1 - ln x)/x^2`.";
const MATCH6 = "`2^x · x^2` has no moving exponent on a moving base; log differentiation still works: `ln y = x ln 2 + 2 ln x`.";
const SORT = {
  b0:"Neither moves: derivative 0", b1:"Base moves, exponent constant: power rule",
  b2:"Base constant, exponent moves: exponential rule", b3:"Both move: log differentiation"
};
// a sorter card: the plan's "feedback if misplaced" line is also its reason when placed right
function card(id, t, box, fb){
  const wrong = {}; Object.keys(SORT).forEach(k => { if (k !== box) wrong[k] = fb; });
  return { id, t, answer:box, why:fb, wrong, goal:1 };
}

export default {
  id:"31-logarithmic-differentiation",
  kind:"topic",
  title:"Logarithmic differentiation",
  topic:"Logarithmic Differentiation",
  readyTopic:"logarithmic differentiation",
  hero:{
    eq:"`y = x^x` ⟶ `ln y = x ln x` ⟶ `y′ = x^x(ln x + 1)`",
    eqLabel:"y equals x to the x; so ln y equals x ln x; so y prime equals x to the x times ln x plus 1",
    eqSize:"sm",
    headline:"When the exponent moves too, take the log first",
    text:"The power rule needs a constant exponent and the exponential rule needs a constant base. When both move, take <strong>ln of both sides</strong>: a <strong>log law</strong> brings the exponent down as a factor. Then differentiate <strong>implicitly</strong>, and multiply by `y` at the end. The same move turns long products and quotients into easy sums.",
    fig:{ aria:"The graph of y = x to the x draws in blue for x from 0 to 2.2. The label y = x to the x splits: the exponent x slides down in front of ln x to make ln y = x ln x. A black tangent line slides along the curve and flattens at x = 1 over e, about 0.37, labelled slope 0. The line y prime = x to the x times (ln x + 1) fades in.", shape:"square" }
  },
  goals:[
    "I can tell when a function needs log differentiation and when the power or exponential rule is enough.",
    "I can take ln of both sides and use log laws to bring down exponents and split products and quotients.",
    "I can differentiate `ln y` as `(1/y)(dy/dx)` and solve for `dy/dx`.",
    "I can differentiate functions such as `x^x`, `x^{sin x}` and `x^{ln x}`.",
    "I can use log differentiation for long products and quotients, and for relative rates of change.",
    "I can use these derivatives to find slopes, tangent lines and horizontal tangents."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Log laws", goal:2, prompt:"For `x > 0`, which expression equals `ln[x^3(x + 1)^2]`?",
          options:[
            { t:"`3 ln x + 2 ln(x + 1)`", ok:true, why:"Product → sum; each exponent comes down in front." },
            { t:"`3 ln x · 2 ln(x + 1)`", why:"ln turns a product into a <strong>sum</strong>." },
            { t:"`ln 3x + ln 2(x + 1)`", why:"`ln(x^3) = 3 ln x`, not `ln(3x)`." },
            { t:"`6 ln[x(x + 1)]`", why:"Each factor keeps its own exponent." }],
          hints:["Split the product first.", "`ln(x^3) + ln((x + 1)^2)`.", "`3 ln x + 2 ln(x + 1)`."] },
        { id:"w2", skill:"Log laws", goal:2, prompt:"For `x > 0`, simplify `ln(x^x)`.",
          options:[
            { t:"`x ln x`", ok:true, why:"The exponent `x` comes down as a factor." },
            { t:"`(ln x)^x`", why:"The power law brings the exponent <strong>in front</strong>, not outside the log." },
            { t:"`(ln x)^2`", why:"`x^x` isn’t `x^2`." },
            { t:"`x + ln x`", why:"`ln(a^b) = b ln a`: a product." }],
          hints:["Power law: `ln(a^b) = ?`", "`b ln a`.", "`x ln x`."] },
        { id:"w3", skill:"Derivatives of ln", goal:3, prompt:"Differentiate `y = ln(x^2 + 5)`.",
          options:[
            { t:"`2x/(x^2 + 5)`", ok:true, why:"Chain rule: (1/inside) × (inside)′." },
            { t:"`1/(x^2 + 5)`", why:"Multiply by `d/dx(x^2 + 5) = 2x`." },
            { t:"`2x ln(x^2 + 5)`", why:"`d/dx ln u = u′/u`." },
            { t:"`1/(2x)`", why:"It’s (inside)′ over (inside)." }],
          hints:["`d/dx ln u = u′/u`.", "`u = x^2 + 5`, `u′ = 2x`.", "`2x/(x^2 + 5)`."] },
        { id:"w4", skill:"Derivatives of ln", goal:4, prompt:"Differentiate `y = x ln x`.",
          options:[
            { t:"`ln x + 1`", ok:true, why:"Product rule: `1 · ln x + x · (1/x)`." },
            { t:"`1/x`", why:"`1 · (1/x)` is only `u′v′`." },
            { t:"`ln x`", why:"The second term is `x · (1/x) = 1`." },
            { t:"1", why:"Don’t drop `1 · ln x`." }],
          hints:["It’s a product.", "`(x)′ ln x + x(ln x)′`.", "`ln x + 1`."] },
        { id:"w5", skill:"Implicit differentiation", goal:3, prompt:"`y` is a function of `x`. What is `d/dx (ln y)`?",
          options:[
            { t:"`(1/y)(dy/dx)`", ok:true, why:"Chain rule: the outer derivative `1/y` times the inner derivative `dy/dx`." },
            { t:"`1/y`", why:"That treats `y` as the variable. We’re differentiating with respect to `x`." },
            { t:"`1/x`", why:"The inside is `y`, not `x`." },
            { t:"`ln(dy/dx)`", why:"Differentiate the log, then multiply by the inside’s derivative." }],
          hints:["What did implicit differentiation do to `y^2` in module 13?", "`d/dx (y^2) = 2y · dy/dx`: outer derivative times `dy/dx`.", "`(1/y)(dy/dx)`."] },
        { id:"w6", skill:"Implicit differentiation", goal:3, prompt:"If `y = x^3` and `(1/y)(dy/dx) = 3/x`, what is `dy/dx`?",
          options:[
            { t:"`3x^2`", ok:true, why:"Multiply both sides by `y = x^3`: `(3/x) · x^3 = 3x^2`." },
            { t:"`3/x`", why:"That’s `dy/dx` divided by `y`." },
            { t:"`3/x^4`", why:"To undo ÷ `y`, multiply by `y`." },
            { t:"`x^3 + 3/x`", why:"Multiply, don’t add." }],
          hints:["Isolate `dy/dx`.", "Multiply both sides by `y`.", "`3x^2`."] }
      ],
      refreshers:{
        "Log laws":"`ln(AB) = ln A + ln B`; `ln(A/B) = ln A - ln B`; `ln(A^n) = n ln A`. Example: `ln[x^2/(x - 1)] = 2 ln x - ln(x - 1)`.",
        "Derivatives of ln":"`d/dx ln u = u′/u`. Example: `d/dx ln(3x + 1) = 3/(3x + 1)`. For products like `x ln x`, use the product rule.",
        "Implicit differentiation":"When `y` depends on `x`, every `y`-term picks up a factor `dy/dx`: `d/dx ln y = y′/y`. Solve for `y′` at the end."
      }
    }
  },
  explore:{
    heading:"Log-then-differentiate machine",
    intro:"Pick a function. Choose the next move until you reach `dy/dx`, then use the graph to check that your slope matches the tangent.",
    fns:[
      { id:"F1", chip:"`y = x^x`", eq:"y = x^x", dom:"`x > 0`" },
      { id:"F2", chip:"`y = x^{sin x}`", eq:"y = x^{sin x}", dom:"`x > 0`" },
      { id:"F3", chip:"`y = x^{ln x}`", eq:"y = x^{ln x}", dom:"`x > 0`" },
      { id:"F4", chip:"`y = {(x + 1)^2(x - 2)^3}/{x^2 + 1}`", eq:"y = {(x + 1)^2(x - 2)^3}/{x^2 + 1}", dom:"every real `x` (`x^2 + 1` is never 0)" }
    ],
    modes:[{ id:"machine", t:"Machine" }, { id:"graph", t:"Graph" }, { id:"split", t:"Split the slope" }],
    modeHow:{
      machine:"Choose the next move from the menu. A wrong move gets feedback and isn’t added to the working.",
      graph:"Move the point with the slider, the snap chips or a tap on the graph. Your formula draws the black tangent; the tool’s thin grey secant to `x_0 + 0.001` checks it.",
      split:"For `y = x^x` only: the slope at `x_0` splits into the exponential-rule piece (teal) and the power-rule piece (orange). Their total is the tangent slope (black)."
    },
    // the working, move by move: [given, take ln, log law, differentiate, multiply by y, substitute]
    work:{
      F1:{ lines:["y = x^x", "ln y = ln(x^x)", "ln y = x ln x", "{1}/{y} · {dy}/{dx} = ln x + 1", "{dy}/{dx} = y(ln x + 1)", "{dy}/{dx} = x^x(ln x + 1)"],
        lny:"x ln x", ypy:"ln x + 1", yp:"y(ln x + 1)", ypx:"x^x(ln x + 1)" },
      F2:{ lines:["y = x^{sin x}", "ln y = ln(x^{sin x})", "ln y = sin x · ln x", "{1}/{y} · {dy}/{dx} = cos x ln x + {sin x}/{x}", "{dy}/{dx} = y(cos x ln x + {sin x}/{x})", "{dy}/{dx} = x^{sin x}(cos x ln x + {sin x}/{x})"],
        lny:"sin x · ln x", ypy:"cos x ln x + {sin x}/{x}", yp:"y(cos x ln x + {sin x}/{x})", ypx:"x^{sin x}(cos x ln x + {sin x}/{x})" },
      F3:{ lines:["y = x^{ln x}", "ln y = ln(x^{ln x})", "ln y = ln x · ln x = (ln x)^2", "{1}/{y} · {dy}/{dx} = {2 ln x}/{x}", "{dy}/{dx} = y · {2 ln x}/{x}", "{dy}/{dx} = x^{ln x} · {2 ln x}/{x}"],
        lny:"(ln x)^2", ypy:"{2 ln x}/{x}", yp:"y · {2 ln x}/{x}", ypx:"x^{ln x} · {2 ln x}/{x}" },
      F4:{ lines:["y = {(x + 1)^2(x - 2)^3}/{x^2 + 1}", "ln |y| = ln |{(x + 1)^2(x - 2)^3}/{x^2 + 1}|", "ln |y| = 2 ln |x + 1| + 3 ln |x - 2| - ln(x^2 + 1)",
          "{1}/{y} · {dy}/{dx} = {2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}", "{dy}/{dx} = y[{2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}]",
          "{dy}/{dx} = {(x + 1)^2(x - 2)^3}/{x^2 + 1}[{2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}]"],
        lny:"2 ln |x + 1| + 3 ln |x - 2| - ln(x^2 + 1)", ypy:"{2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}",
        yp:"y[{2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}]", ypx:"{(x + 1)^2(x - 2)^3}/{x^2 + 1}[{2}/{x + 1} + {3}/{x - 2} - {2x}/{x^2 + 1}]" }
    },
    // the move menu (traps mixed in; the menu never marks them)
    moves:[
      { id:"power", t:"Power rule" },
      { id:"ln", t:"Take ln of both sides" },
      { id:"expo", t:"Exponential rule" },
      { id:"law", t:"Use a log law" },
      { id:"diff", t:"Differentiate both sides" },
      { id:"each", t:"Differentiate each factor and multiply" },
      { id:"mult", t:"Multiply both sides by `y`" },
      { id:"sub", t:"Substitute `y` back" }
    ],
    // notes printed beside each accepted line
    notes:["Given", "Take ln of both sides", "Log law", "Differentiate both sides (chain rule on the left)", "Multiply both sides by `y`", "Substitute `y` back"],
    notesF4:["Given", "Take ln of both sides (`ln |y|`: `y` can be negative)", "Log laws: product → sum, quotient → difference", "Differentiate both sides (chain rule on the left)", "Multiply both sides by `y`", "Substitute `y` back"],
    fb:{
      power:M1, expo:M2, each:M6,
      powerF4:"One power rule won’t do it: three powers are multiplied and divided here. Take ln first to turn them into a sum.",
      expoF4:"There’s no variable exponent here, so the exponential rule doesn’t apply.",
      first:"Start by taking ln of both sides.",
      lawEarly:"Take ln of both sides first: there’s no log yet for a law to work on.",
      diffEarly:"Differentiating directly needs a rule for a moving base and a moving exponent at once, and neither rule is one. Take ln first.",
      diffEarlyF4:"Differentiating directly means the product and quotient rules on three factors. Take ln first to turn them into a sum.",
      diffNoLaw:"Use a log law first: the exponent is still hidden inside the log.",
      diffNoLawF4:"Use the log laws first: the product and quotient are still inside the log.",
      multEarly:"Differentiate first; multiplying by `y` now just undoes the log.",
      subEarly:"There’s no `dy/dx` yet: differentiate both sides first.",
      subEarlyY:"You still have `y′/y` on the left.",
      lnDone:"Both sides are already logs. What does the last line need next?",
      lawDone:"The log law is done: the exponent is already in front.",
      lawDoneF4:"The log laws are done: every power is already in front.",
      diffDone:"Both sides are already differentiated.",
      multDone:"Already done: the left side is `dy/dx` now.",
      ok:"✓ Move accepted.",
      done:"✓ You reached `dy/dx` in #1 moves.",
      trapNote:"(This move counts, but nothing is added.)"
    },
    txt:{
      fnLab:"Function", modeLab:"Mode", movesLab:"Moves", reset:"Start over", showAll:"Show all lines", showLess:"Show the last three",
      moveCount:"Moves so far: #1", traps:"Traps chosen: #1",
      point:"Point `x_0`", pointNote:"Arrow keys move 0.01; Shift + arrow moves 0.1; Home and End jump to the first and last snap points.",
      snaps:"Snap points", splitOnly:"Split the slope works with `y = x^x` only, so it switched to `y = x^x`.",
      needFormula:"Derive `dy/dx` for this function in Machine mode to draw the tangent from your formula.",
      rows:{ fn:"Function", lny:"`ln y`", lnyF4:"`ln |y|`", ypy:"`y′/y`", yp:"`y′`", pt:"Point", sf:"Slope from your formula", ss:"Slope from the tool’s secant",
        pa:"Exponential-rule piece `x^x ln x`", pb:"Power-rule piece `x · x^{x - 1} = x^x`", tot:"Total (the tangent slope)" },
      notYet:"appears after the move", notDerived:"derive it in Machine mode", match:"✓ match", zero:"needs `y ≠ 0` (here `y = 0`)",
      barA:"exponential-rule piece", barB:"power-rule piece", barT:"total = slope",
      keyG:"Curve in blue, your tangent in black, the tool’s secant in thin dashed grey.",
      keyM:"Curve in blue, the tangent from your formula in black.",
      needMachine:"Reach `y′` with your moves to draw the tangent from your formula.",
      exact:"Lowest point of `y = x^x` (challenge 3)",
      exactHow:"Type exact values with e, such as e^(−2), 1/e or 3e^(1/2). Put a fractional exponent in brackets.",
      exX:"`x =`", exY:"`y =`"
    },
    predIntro:"Make a prediction first. Then the graph shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Where does `y = x^x` have a horizontal tangent?",
        options:[{ t:"`x = 1/e`", ok:true }, { t:"`x = 1`" }, { t:"`x = 0`" }, { t:"nowhere" }],
        explain:"`y′ = x^x(ln x + 1) = 0` when `ln x = -1`, so `x = 1/e ≈ 0.37`. `x^x` is never 0, so only the bracket can be." },
      { id:"p2", prompt:"At (2, 4), which graph is steepest?",
        options:[{ t:"`y = x^x`", ok:true }, { t:"`y = x^2`" }, { t:"`y = 2^x`" }, { t:"all three have the same slope" }],
        explain:"Slopes: `x^2` gives 4; `2^x` gives `4 ln 2 ≈ 2.77`; `x^x` gives `4(ln 2 + 1) ≈ 6.77`. That’s `4 ln 2 + 4`: the exponential-rule piece plus the power-rule piece." },
      { id:"p3", prompt:"What is the slope of `y = x^{sin x}` at `x = π/2`?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"`π/2`" }, { t:"`2/π`" }],
        explain:"`y′/y = cos x ln x + (sin x)/x = 0 + 2/π`; `y′ = (π/2)(2/π) = 1`." },
      { id:"p4", prompt:"Is the graph rising or falling at `x = 0`, and how steeply?",
        options:[{ t:"falling, slope −4", ok:true }, { t:"rising, slope 4" }, { t:"rising, slope 1/2" }, { t:"flat, slope 0" }],
        explain:"`y′/y = 2/(x + 1) + 3/(x - 2) - 2x/(x^2 + 1) = 2 - 3/2 - 0 = 1/2`. Then `y′ = (-8)(1/2) = -4`. ‘Rising, slope 1/2’ forgot to multiply by `y`." }
    ],
    chalIntro:"Use the machine and the graph to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Machine mode, `y = x^x`: reach `dy/dx` for `y = x^x` in at most 5 moves without using a trap.",
        why:"ln brings the moving exponent down (`ln y = x ln x`), the left side becomes `y′/y`, and multiplying by `y` gives `dy/dx = x^x(ln x + 1)`.",
        hints:["First move: make the exponent come down.", "`ln y = x ln x`, then differentiate both sides with the product rule on the right.", "`y′/y = ln x + 1`, so `y′ = x^x(ln x + 1)`."],
        msgs:{ start:"Choose `y = x^x` in Machine mode, then make your moves.", power:"You chose <strong>Power rule</strong>. " + M1 + " Press Start over and try again.",
          expo:"You chose <strong>Exponential rule</strong>. " + M2 + " Press Start over and try again.", each:"You chose <strong>Differentiate each factor and multiply</strong>. " + M6 + " Press Start over and try again.",
          ypy:"That’s `y′/y`. One more move: multiply both sides by `y`.", sub:"Now write `y` in terms of `x`: substitute `y = x^x`.",
          early:"Keep going: the last line isn’t `dy/dx` yet.", many:"You reached `dy/dx` in #1 moves. Press Start over and do it in at most 5." } },
      { id:"tc2", goal:[4, 6], prompt:"Graph mode, `y = x^{ln x}`: drag the point to where the tangent slope of `y = x^{ln x}` is exactly 2.",
        why:"At `x = e`: `y = e^1 = e`, and `y′ = e · 2 · 1/e = 2`. The slope is negative for `x < 1` and increasing for `x > 1`, so `x = e` is the only place.",
        hints:["`ln y = (ln x)^2`, so `y′ = y · 2 ln x/x`.", "Try a value where `ln x` is simple.", "At `x = e`: `y = e^1 = e`, and `y′ = e · 2 · 1/e = 2`."],
        msgs:{ mode:"Switch to <strong>Graph</strong> mode and choose `y = x^{ln x}` first.", x2:"Slope ≈ 1.12. Go right.", x3:"Slope ≈ 2.45. A little left.", x1:"Slope 0 there: `ln 1 = 0`.",
          general:"Slope ≈ #1 there. You want exactly 2." } },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"Find the lowest point on `y = x^x` exactly. Enter its `x`-coordinate and its `y`-value in the exact boxes under the readout (form `□e^{□}`).",
        why:"`y′ = x^x(ln x + 1) = 0` when `ln x = -1`, so `x = e^{-1}`. Then `y = (e^{-1})^{e^{-1}} = e^{-1/e} ≈ 0.69`.",
        hints:["Set `y′ = 0`. `x^x` is never 0.", "`ln x + 1 = 0` gives `x = e^{-1}`.", "`y = (e^{-1})^{e^{-1}} = e^{-1/e} ≈ 0.69` (Use these values: `1/e ≈ 0.368`)."],
        msgs:{ blank:"Enter both coordinates in the exact boxes under the readout.", err:"Type exact values with e, such as e^(−1) or 1/e.",
          pos:"`x^x` is defined here for `x > 0`.", x1:"`ln x = 0` there, but the bracket is `ln x + 1`.",
          yx:"That’s the `x`-value. Substitute it into `x^x`.", y1:"That’s `y(1)`; the curve dips lower before `x = 1`.",
          approx:"Close, but give exact values with `e`, not decimals.", xgen:"At that `x`, `y′ = x^x(ln x + 1) ≈ #1`, not 0.",
          ygen:"The `x`-value is right. The `y`-value is `x^x` at that `x`." } }
    ]
  },
  part3:{
    slug:"which", name:"Which method?",
    heading:"Which method?",
    intro:"Before you differentiate, ask what moves with `x`: the base, the exponent, both or neither. That decides the rule. Sort the cards, then check the shortcut with algebra.",
    sort:{ id:"which", type:"sorter", title:"The base/exponent grid", noun:"function", goal:1,
      boxes:[{ id:"b0", label:SORT.b0 }, { id:"b1", label:SORT.b1 }, { id:"b2", label:SORT.b2 }, { id:"b3", label:SORT.b3 }],
      items:[
        card("i1", "`x^π`", "b1", "π is a constant exponent: `y′ = πx^{π - 1}`."),
        card("i2", "`π^x`", "b2", "Constant base π: `y′ = π^x ln π`."),
        card("i3", "`x^x`", "b3", "Base and exponent both move."),
        card("i4", "`e^π`", "b0", "No `x` at all: it’s a number, about 23.1."),
        card("i5", "`(x^2 + 1)^5`", "b1", "Constant exponent 5 (with the chain rule)."),
        card("i6", "`3^{2x}`", "b2", "Constant base 3 (with the chain rule): `y′ = 2 · 3^{2x} ln 3`."),
        card("i7", "`x^{ln x}`", "b3", "`ln x` moves, and so does the base."),
        card("i8", "`(1 + x)^{1/x}`", "b3", "Base `1 + x` and exponent `1/x` both move.")
      ] },
    domain:M7,
    alg:{ title:"Check it with algebra",
      text:"Two routes to the derivative of `x^x`. Step through them side by side.",
      left:"Log differentiation", right:"The `e`-rewrite (module 26)",
      rows:[
        ["`ln y = ln(x^x) = x ln x`", "`x^x = e^{ln(x^x)} = e^{x ln x}`"],
        ["`(1/y)y′ = ln x + 1`", "Chain rule: `d/dx e^{x ln x} = e^{x ln x} · (ln x + 1)`"],
        ["`y′ = x^x(ln x + 1)`", "`= x^x(ln x + 1)`"]
      ],
      end:"Same answer. Log differentiation and the `e`-rewrite are the same idea in different clothes.",
      step:"Line #1 of 3", startLine:"Press Step to write the first line of each route." },
    quickCheck:{
      title:"Quick check", summary:"Which method? quick check",
      items:[
        { id:"q1", goal:1, prompt:"`d/dx (x^7)`?",
          choices:[{ t:"`7x^6`", ok:true, fb:"Right. Constant exponent: power rule." }, { t:"`x^7 ln x`", fb:"Constant exponent: power rule." }, { t:"`7x^6 ln x`", fb:"Constant exponent: power rule." }, { t:"`x^7(ln x + 1)`", fb:"Constant exponent: power rule." }] },
        { id:"q2", goal:1, prompt:"`d/dx (7^x)`?",
          choices:[{ t:"`7^x ln 7`", ok:true, fb:"Right. Constant base: exponential rule." }, { t:"`x · 7^{x - 1}`", fb:"Constant base: exponential rule." }, { t:"`7^x`", fb:"Constant base: exponential rule." }, { t:"`7^x(ln x + 1)`", fb:"Constant base: exponential rule." }] },
        { id:"q3", goal:4, prompt:"After `ln y = 2x ln x`, the right side’s derivative is…",
          choices:[{ t:"`2 ln x + 2`", ok:true, fb:"Right. Product rule: `2 ln x + 2x · (1/x)`." }, { t:"`2/x`", fb:"Product rule: `2 ln x + 2x · (1/x)`." }, { t:"`2 ln x`", fb:"Product rule: `2 ln x + 2x · (1/x)`." }, { t:"`2x/x`", fb:"Product rule: `2 ln x + 2x · (1/x)`." }] },
        { id:"q4", goal:1, prompt:"For which function is log differentiation <strong>not</strong> needed?",
          choices:[{ t:"`x^{√2}`", ok:true, fb:"Right. `√2` is a constant: power rule." }, { t:"`x^{√x}`", fb:"`√2` is a constant: power rule." }, { t:"`(sin x)^x`", fb:"`√2` is a constant: power rule." }, { t:"`x^{2x}`", fb:"`√2` is a constant: power rule." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[2, 3, 4],
        instruction:"Match each function with its derivative.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`x^x`", goal:4, why:"`ln y = x ln x`, so `y′/y = ln x + 1`." },
          { id:"l2", t:"`x^{2x}`", goal:4, why:"`ln y = 2x ln x`, so `y′/y = 2 ln x + 2`." },
          { id:"l3", t:"`x^{1/x}`", goal:3, why:"`ln y = (ln x)/x`; the quotient rule gives `y′/y = (1 - ln x)/x^2`.",
            hints:["`ln y = (ln x)/x`.", "Quotient rule: `[(1/x) · x - ln x]/x^2`.", "`(1 - ln x)/x^2`, times `y`."] },
          { id:"l4", t:"`x^{ln x}`", goal:4, why:"`ln y = (ln x)^2`, so `y′/y = 2 ln x/x`." },
          { id:"l5", t:"`(ln x)^x`, `x > 1`", goal:3, why:"`ln y = x ln(ln x)`; the product rule gives `y′/y = ln(ln x) + 1/ln x`.",
            hints:["`ln y = x ln(ln x)`.", "Product rule, and `d/dx ln(ln x) = (1/ln x)(1/x)`.", "`y′/y = ln(ln x) + x · 1/(x ln x) = ln(ln x) + 1/ln x`."] },
          { id:"l6", t:"`2^x · x^2`", goal:2, why:"`ln y = x ln 2 + 2 ln x`, so `y′/y = ln 2 + 2/x`." }
        ],
        right:[
          { id:"r1", t:"`x^x(ln x + 1)`" }, { id:"r2", t:"`x^{2x}(2 ln x + 2)`" }, { id:"r3", t:"`x^{1/x} · {1 - ln x}/{x^2}`" },
          { id:"r4", t:"`x^{ln x} · {2 ln x}/{x}`" }, { id:"r5", t:"`(ln x)^x [ln(ln x) + {1}/{ln x}]`" }, { id:"r6", t:"`2^x · x^2 (ln 2 + {2}/{x})`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l1|r2":MATCH12, "l2|r1":MATCH12, "l3|r4":MATCH34, "l4|r3":MATCH34,
          "l6|r1":MATCH6, "l6|r2":MATCH6, "l6|r3":MATCH6, "l6|r4":MATCH6, "l6|r5":MATCH6 },
        wrongDefault:"Take ln, differentiate, then multiply by `y`." },
      { id:"rates", type:"custom", title:"Slopes and rates", summary:"Slopes and rates", star:true, goal:[4, 5, 6],
        instruction:"Find slopes, rates and tangent points with exact values. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions, and e or ln where you need them, such as −3/2, 2e^2 or e^(−1/3). Put a fractional exponent in brackets. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as 3, −1/4, 2e^2 or e^(−1/3).",
          lnneg:"ln only accepts positive inputs: check what’s inside each ln.",
          exact:"Close, but give the exact value (with e where you need it, such as e^(−1/3) or 2e^2), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:4, prompt:"Slope of `y = x^x` at `x = 1`.",
            boxes:[{ k:"s", pre:"Slope" }], answer:{ s:1 }, display:"1",
            wrong:[{ k:"s", eq:0, fb:"`x^x ln x` is only part of it." }],
            why:"`y′ = x^x(ln x + 1) = 1 · (0 + 1) = 1`." },
          { id:"s2", goal:4, prompt:"Slope of `y = x^{ln x}` at `x = e^2`.",
            boxes:[{ k:"s", pre:"Slope" }], answer:{ s:4 * E * E }, display:"`4e^2`",
            wrong:[{ k:"s", eq:4 / (E * E), fb:"That’s `y′/y`; multiply by `y = e^4`." }],
            why:"At `x = e^2`: `y = (e^2)^2 = e^4` and `y′/y = 2 · 2/e^2 = 4/e^2`, so `y′ = e^4 · 4/e^2 = 4e^2`." },
          { id:"s3", goal:5, star:true, prompt:"`dy/dx` at `x = 0` for `y = {(x + 3)^2(x - 1)^4}/{(x + 1)^3}`.",
            boxes:[{ k:"s", pre:"`dy/dx =`" }], answer:{ s:-57 }, display:"−57",
            wrong:[{ k:"s", eq:-19 / 3, fb:"Multiply by `y(0) = 9`." }, { k:"s", eq:-3, fb:"The quotient’s log is subtracted: `-3/(x + 1)`, not `+3/(x + 1)`." }],
            why:"At 0: `y′/y = 2/3 - 4 - 3 = -19/3` and `y(0) = 9`, so `y′ = -57`.",
            hints:["`ln y = 2 ln(x + 3) + 4 ln(x - 1) - 3 ln(x + 1)`, using `ln |y|`.", "At 0: `y′/y = 2/3 - 4 - 3 = -19/3`.", "`y(0) = 9 · 1/1 = 9`, so `y′ = -57`."] },
          { id:"s4", goal:6, star:true, prompt:"The `x`-coordinate where `y = x^{x^2}` has a horizontal tangent.",
            boxes:[{ k:"x", pre:"`x =`" }], answer:{ x:Math.exp(-0.5) }, display:"`e^{-1/2}`",
            wrong:[{ k:"x", eq:Math.exp(0.5), fb:"`2 ln x + 1 = 0` gives `ln x = -1/2`." }, { k:"x", eq:1, fb:"`ln 1 = 0` doesn’t make `2 ln x + 1` zero." }],
            why:"`ln y = x^2 ln x`, so `y′/y = 2x ln x + x = x(2 ln x + 1)`. For `x > 0` it is 0 when `ln x = -1/2`: `x = e^{-1/2}`." },
          { id:"s5", goal:5, star:true, prompt:"Pressure `P = kT/V`. `T` rises 1%/min and `V` shrinks 2%/min. At what percent rate per minute does `P` change?",
            boxes:[{ k:"r", pre:"Rate", unit:"% per minute" }], answer:{ r:3 }, display:"3% per minute",
            wrong:[{ k:"r", eq:-1, fb:"`ln P = ln k + ln T - ln V`, so `P′/P = 1% - (-2%)`." }],
            why:"`P′/P = T′/T - V′/V = 1% - (-2%) = 3%` per minute.",
            hints:["Take ln of both sides.", "`P′/P = T′/T - V′/V`.", "`1% - (-2%) = 3%`."] },
          { id:"s6", goal:6, star:true, prompt:"The tangent to `y = x^x` at `x = e` crosses the `x`-axis where? (form `□e + □`)",
            boxes:[{ k:"x", pre:"`x =`" }], answer:{ x:E - 0.5 }, display:"`e - 1/2`",
            wrong:[{ k:"x", eq:E - 1, fb:"Slope is `2e^e`, not `e^e`." }, { k:"x", eq:E - 2, fb:"Solve `0 = e^e + 2e^e(x - e)`: `x - e = -1/2`." }],
            why:"Point `(e, e^e)`, slope `2e^e`. `0 = e^e + 2e^e(x - e)` gives `x = e - 1/2`.",
            hints:["Point `(e, e^e)`; slope `e^e(ln e + 1)`.", "Slope `2e^e`. Tangent: `y - e^e = 2e^e(x - e)`.", "Set `y = 0`: `-e^e = 2e^e(x - e)`, so `x = e - 1/2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Esme", how:"", goal:[2, 3, 4],
        instruction:"Esme made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the slope of `y = x^{3x}` at `x = e`.",
            steps:["`ln y = ln(x^{3x})`.", "`ln y = 3x ln x`.", "`(1/y)(dy/dx) = 3 ln x + 3`.", "So `dy/dx = 3 ln x + 3`.", "At `x = e`, the slope is 6."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct: product rule.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"`dy/dx = x^{3x}(3 ln x + 3)`, so the slope at `e` is `6e^{3e}`.", ok:true, why:"Multiply both sides of step 3 by `y = x^{3x}`." },
              { t:"`dy/dx = 3x · x^{3x - 1}`.", why:M1 },
              { t:"`dy/dx = (3 ln x + 3)/x^{3x}`.", why:"To clear `1/y`, multiply by `y`." },
              { t:"Step 4 is correct.", why:"Step 3’s left side is `y′/y`, not `y′`." }],
            hints:["What’s on the left of step 3?", "`y′` divided by `y`.", "Multiply by `y = x^{3x}`."] },
          { id:"e2", goal:4, task:"Differentiate `y = x^{sin x}`, `x > 0`.",
            steps:["`ln y = sin x · ln x`.", "`(1/y)(dy/dx) = cos x · (1/x)`.", "`dy/dx = x^{sin x} · cos x/x`.", "At `x = π/2`, the slope is 0."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier.", "Step 4 follows step 3."],
            fixes:[
              { t:"`(1/y)(dy/dx) = cos x ln x + (sin x)/x`, so the slope at `π/2` is 1.", ok:true, why:"The product rule on `sin x · ln x` gives two terms." },
              { t:"`(1/y)(dy/dx) = cos x · ln x`.", why:"Half the product rule." },
              { t:"`dy/dx = sin x · x^{sin x - 1}`.", why:M1 },
              { t:"Step 2 is correct.", why:"`sin x · ln x` is a product: `u′v + uv′`." }],
            hints:["What rule does the right side of step 1 need?", "Product rule.", "`cos x ln x + sin x · (1/x)`."] },
          { id:"e3", goal:2, task:"Differentiate `y = x^2(x + 1)^3/(x - 2)^4` for `x > 2`.",
            steps:["`ln y = 2 ln x + 3 ln(x + 1) + 4 ln(x - 2)`.", "`y′/y = 2/x + 3/(x + 1) + 4/(x - 2)`.", "`y′ = y[2/x + 3/(x + 1) + 4/(x - 2)]`.", "Substitute `y = x^2(x + 1)^3/(x - 2)^4`."],
            answer:0,
            stepFb:["", "Step 2 differentiates step 1 correctly. Look earlier.", "Step 3 multiplies by `y` correctly.", "Step 4 is fine."],
            fixes:[
              { t:"`ln y = 2 ln x + 3 ln(x + 1) - 4 ln(x - 2)`: the denominator’s log is subtracted.", ok:true, why:"Quotient → difference." },
              { t:"`ln y = ln 2x + ln 3(x + 1) - ln 4(x - 2)`.", why:"Exponents come down in front of the log, not inside it." },
              { t:"`ln y = 2 ln x · 3 ln(x + 1) / 4 ln(x - 2)`.", why:M5 },
              { t:"Step 1 is correct.", why:"`ln(A/B) = ln A - ln B`." }],
            hints:["Which log law handles division?", "Quotient → difference.", "`-4 ln(x - 2)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that the derivative of `x^x` is the power-rule piece plus the exponential-rule piece, or something else?" },
      { id:"j2", q:"In your own words, why does the left side become `(1/y)(dy/dx)`?" },
      { id:"j3", q:"Explain to a friend how to decide between the power rule, the exponential rule and log differentiation." },
      { id:"j4", q:"Which step do you still forget or fumble? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which function needs log differentiation (or rewriting with `e`) to differentiate?", options:[
          { t:"`y = x^{cos x}`", ok:true, why:"Base and exponent both move." },
          { t:"`y = x^5`", why:"Constant exponent: power rule." },
          { t:"`y = 5^x`", why:"Constant base: exponential rule." },
          { t:"`y = e^{x^2}`", why:"Constant base `e` with the chain rule." }] },
        b:{ prompt:"Which function needs log differentiation (or rewriting with `e`) to differentiate?", options:[
          { t:"`y = (ln x)^x`", ok:true, why:"Base `ln x` and exponent `x` both move." },
          { t:"`y = x^e`", why:"`e` is a constant exponent: power rule." },
          { t:"`y = e^x`", why:"Its own derivative." },
          { t:"`y = 2^{3x}`", why:"Constant base 2 with the chain rule." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Differentiate both sides of `ln y = x ln x` with respect to `x`.", options:[
          { t:"`(1/y)(dy/dx) = ln x + 1`", ok:true, why:"Chain rule on the left; product rule on the right." },
          { t:"`1/y = ln x + 1`", why:"The left side needs `dy/dx`." },
          { t:"`(1/y)(dy/dx) = 1/x`", why:"Product rule on `x ln x`." },
          { t:"`dy/dx = ln x + 1`", why:"The derivative of `ln y` is `y′/y`, not `y′`." }] },
        b:{ prompt:"Differentiate both sides of `ln y = sin x · ln x` with respect to `x`.", options:[
          { t:"`(1/y)(dy/dx) = cos x ln x + (sin x)/x`", ok:true, why:"Chain rule on the left; product rule on the right." },
          { t:"`1/y = cos x ln x + (sin x)/x`", why:M4 },
          { t:"`(1/y)(dy/dx) = (cos x)/x`", why:M6 },
          { t:"`dy/dx = cos x ln x + (sin x)/x`", why:M4 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"For `x > 3`, which equals `ln y` if `y = {x^4(x - 3)^5}/{(x + 2)^3}`?", options:[
          { t:"`4 ln x + 5 ln(x - 3) - 3 ln(x + 2)`", ok:true, why:M5 },
          { t:"`4 ln x + 5 ln(x - 3) + 3 ln(x + 2)`", why:"Division gives subtraction." },
          { t:"`4 ln x · 5 ln(x - 3) ÷ 3 ln(x + 2)`", why:"Products become sums." },
          { t:"`ln 4x + ln 5(x - 3) - ln 3(x + 2)`", why:"Exponents come down in front of the log." }] },
        b:{ prompt:"For `x > 4`, which equals `ln y` if `y = {x^3(x + 1)^2}/{(x - 4)^5}`?", options:[
          { t:"`3 ln x + 2 ln(x + 1) - 5 ln(x - 4)`", ok:true, why:M5 },
          { t:"`3 ln x + 2 ln(x + 1) + 5 ln(x - 4)`", why:"Division gives subtraction." },
          { t:"`3 ln x · 2 ln(x + 1) ÷ 5 ln(x - 4)`", why:"Products become sums." },
          { t:"`ln 3x + ln 2(x + 1) - ln 5(x - 4)`", why:"Exponents come down in front of the log." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Find `dy/dx` for `y = x^{x^2}`, `x > 0`.", options:[
          { t:"`x^{x^2}(2x ln x + x)`", ok:true, why:"`ln y = x^2 ln x`; `y′/y = 2x ln x + x`." },
          { t:"`x^2 · x^{x^2 - 1}`", why:M1 },
          { t:"`2x · x^{x^2} ln x`", why:"That’s only the exponential-rule piece." },
          { t:"`2x ln x + x`", why:M3 }] },
        b:{ prompt:"Find `dy/dx` for `y = x^{√x}`, `x > 0`.", options:[
          { t:"`x^{√x} · {ln x + 2}/{2√x}`", ok:true, why:"`ln y = √x ln x`; `y′/y = ln x/(2√x) + √x/x = (ln x + 2)/(2√x)`." },
          { t:"`√x · x^{√x - 1}`", why:M1 },
          { t:"`x^{√x} · {ln x}/{2√x}`", why:M2 },
          { t:"`{ln x + 2}/{2√x}`", why:M3 }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Which is the tangent line to `y = x^x` at `x = 2`?", options:[
          { t:"`y - 4 = 4(1 + ln 2)(x - 2)`", ok:true, why:"`y′ = x^x(ln x + 1)`, which is `4(ln 2 + 1)` at `x = 2`." },
          { t:"`y - 4 = 4(x - 2)`", why:"Slope from the power rule alone." },
          { t:"`y - 4 = (4 ln 2)(x - 2)`", why:M2 },
          { t:"`y - 4 = (1 + ln 2)(x - 2)`", why:"Multiply `y′/y` by `y = 4`." }] },
        b:{ prompt:"Which is the tangent line to `y = x^x` at `x = 3`?", options:[
          { t:"`y - 27 = 27(1 + ln 3)(x - 3)`", ok:true, why:"`y′ = x^x(ln x + 1)`, which is `27(ln 3 + 1)` at `x = 3`." },
          { t:"`y - 27 = 27(x - 3)`", why:M1 },
          { t:"`y - 27 = (27 ln 3)(x - 3)`", why:M2 },
          { t:"`y - 27 = (1 + ln 3)(x - 3)`", why:M3 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Find `dy/dx` at `x = 0` for `y = {(x - 1)^3(x + 2)^2}/{(x + 1)^4}`.", options:[
          { t:"24", ok:true, why:"`y′/y = -3 + 1 - 4 = -6` and `y(0) = -4`, so `y′ = 24`." },
          { t:"−8", why:"`+4/(x + 1)` should be subtracted." },
          { t:"−6", why:"That’s `y′/y`; `y(0) = -4`." },
          { t:"6", why:"Each log keeps its exponent: `3/(x - 1)`, not `1/(x - 1)`." }] },
        b:{ prompt:"Find `dy/dx` at `x = 0` for `y = {(x + 2)^3(x - 1)^2}/{(x + 1)^4}`.", options:[
          { t:"−36", ok:true, why:"`y′/y = 3/2 - 2 - 4 = -9/2` and `y(0) = 8`." },
          { t:"−12", why:"Exponents dropped: `1/2 - 1 - 1 = -3/2`." },
          { t:"−9/2", why:M3 },
          { t:"28", why:"`3/2 - 2 + 4` treats the quotient as a product." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `d/dx (x^x) ≠ x · x^{x - 1}`?", options:[
          { t:"“The power rule needs a constant exponent, but here the exponent changes with `x`. Taking ln first gives `ln y = x ln x`, so `y′ = x^x(ln x + 1)`.”", ok:true, why:M1 },
          { t:"“The power rule only works for whole-number exponents.”", why:"It works for any constant exponent, such as `x^π`." },
          { t:"“`x^x` isn’t defined, so it has no derivative.”", why:"It’s defined for `x > 0`." },
          { t:"“It’s correct, because `x^x = x · x^{x - 1}`.”", why:"That identity is true, but the rule still needs a constant exponent." }] },
        b:{ prompt:"Which is the best explanation of why `d/dx (x^x) ≠ x^x ln x`?", options:[
          { t:"“The exponential rule needs a constant base, but here the base changes with `x`. Taking ln first gives `y′/y = ln x + 1`, so `y′ = x^x(ln x + 1)`.”", ok:true, why:M2 },
          { t:"“The exponential rule only works for base `e`.”", why:"`b^x ln b` works for any constant `b > 0`." },
          { t:"“`ln x` is negative for `x < 1`, so the rule fails there.”", why:"The sign isn’t the issue." },
          { t:"“It’s correct for all `x > 0`.”", why:"At `x = 1` it gives 0, but the true slope is 1." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which list gives the steps of log differentiation for `y = x^{2x}` in the correct order?", options:[
          { t:"`ln y = 2x ln x` → `(1/y)y′ = 2 ln x + 2` → `y′ = y(2 ln x + 2)` → `y′ = x^{2x}(2 ln x + 2)`", ok:true, why:"Take ln, differentiate both sides, multiply by `y`, then write `y` in terms of `x`." },
          { t:"`y′ = 2x · x^{2x - 1}` → `ln y′ = …` → …", why:"Differentiating first defeats the purpose." },
          { t:"`ln y = 2x ln x` → `y′ = 2 ln x + 2` → done.", why:"The left side is `y′/y`, not `y′`. " + M3 },
          { t:"`ln y = (ln x)^{2x}` → …", why:M5 }] },
        b:{ prompt:"Which list gives the steps of log differentiation for `y = (x + 1)^5(x - 3)^4`, `x > 3`, in the correct order?", options:[
          { t:"`ln y = 5 ln(x + 1) + 4 ln(x - 3)` → `(1/y)y′ = 5/(x + 1) + 4/(x - 3)` → `y′ = y[5/(x + 1) + 4/(x - 3)]` → substitute `y`", ok:true, why:"Take ln, differentiate both sides, multiply by `y`, then write `y` in terms of `x`." },
          { t:"`y′ = 5(x + 1)^4 · 4(x - 3)^3` → …", why:M6 },
          { t:"`ln y = 5 ln(x + 1) + 4 ln(x - 3)` → `y′ = 5/(x + 1) + 4/(x - 3)` → done.", why:M3 },
          { t:"`ln y = 5 ln(x + 1) · 4 ln(x - 3)` → …", why:M5 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A cylinder’s radius grows at 3%/min while its height shrinks at 4%/min (`V = πr^2h`). At what percent rate per minute is its volume changing?", options:[
          { t:"2%/min", ok:true, why:"`V′/V = 2(3%) + (-4%) = 2%`." },
          { t:"−1%/min", why:"`ln V = ln π + 2 ln r + ln h`: the radius counts twice." },
          { t:"7%/min", why:"The height is shrinking: −4%, not +4%." },
          { t:"10%/min", why:"2(3%) − (−4%) flips the height’s sign." }] },
        b:{ prompt:"A square-based box’s base edge grows at 2%/s while its height shrinks at 5%/s (`V = x^2h`). At what percent rate per second is its volume changing?", options:[
          { t:"−1%/s", ok:true, why:"`V′/V = 2(2%) + (-5%) = -1%`." },
          { t:"−3%/s", why:"The base edge counts twice: `2 ln x`." },
          { t:"7%/s", why:"Height shrinks: −5%." },
          { t:"9%/s", why:"2(2%) − (−5%) flips the sign." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Where does `y = x^{1/x}`, `x > 0`, reach its maximum?", options:[
          { t:"`x = e`", ok:true, why:"`ln y = (ln x)/x`; `y′/y = (1 - ln x)/x^2 = 0` when `ln x = 1`. The sign changes from + to −." },
          { t:"`x = 1/e`", why:"That’s where `x^x` has its minimum." },
          { t:"`x = 1`", why:"`y′/y = (1 - ln x)/x^2`, which is 1 at `x = 1`, not 0." },
          { t:"There is no maximum.", why:"`y′` changes sign at `x = e`, from positive to negative." }] },
        b:{ prompt:"Where does `y = x^{1/x^2}`, `x > 0`, reach its maximum?", options:[
          { t:"`x = √e`", ok:true, why:"`ln y = (ln x)/x^2`; `y′/y = (1 - 2 ln x)/x^3 = 0` when `ln x = 1/2`." },
          { t:"`x = 1/√e`", why:"`1 - 2 ln x = 0` gives `ln x = +1/2`." },
          { t:"`x = e`", why:"That’s the answer for `x^{1/x}`; the extra square changes the derivative." },
          { t:"There is no maximum.", why:"`y′` changes sign at `√e`." }] } }
    ]
  },
  task:{
    title:"Flat at `x = 1`", summary:"Flat at x = 1",
    statement:"<p>Choose whole-number exponents `a`, `b`, `c` from 1 to 6 for `y = {(x + 1)^a(x - 2)^b}/{(x - 4)^c}` so that every condition holds. Use log differentiation to reason, not trial and error. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The graph has a horizontal tangent at `x = 1`.</li><li>The point on the graph at `x = 1` is below the `x`-axis.</li><li>The numerator has degree at most 10.</li></ol></div>" +
      "<p class=\"tiny muted\">The graph shows `y` for `-3 ≤ x ≤ 6` with the asymptote `x = 4` and the tangent at `x = 1`. The readout gives `y′/y` at `x = 1` as an exact fraction.</p>",
    checks:["Horizontal tangent at `x = 1`", "Below the `x`-axis at `x = 1`", "Numerator degree ≤ 10"],
    tips:["`y′/y = a/(x + 1) + b/(x - 2) - c/(x - 4)`. At `x = 1` this is `a/2 - b + c/3`, and `y′ = 0` exactly when it’s 0.",
      "The signs at `x = 1`: `(x + 1) = 2 > 0`, `(x - 2) = -1`, `(x - 4) = -3`. Count the negative factors.",
      "Add `a` and `b`."],
    explainPrompt:"Explain how log differentiation turned ‘horizontal tangent at `x = 1`’ into one equation in `a`, `b` and `c`, and how you used it.",
    vocab:"Use the words ln, y′/y, horizontal tangent and sign.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 1 alone allows six designs: `3a + 2c = 6b` forces `a` even and `c = 3` or 6. Line 2 removes (4, 3, 3) and (4, 4, 6); line 3 removes (6, 5, 6).",
    labels:{ a:"`a`", b:"`b`", c:"`c`", range:"(1 to 6)", invalid:"Choose whole numbers from 1 to 6 for `a`, `b` and `c`.",
      fRow:"`y`", ypy:"`y′/y` at `x = 1`", y1:"`y(1)`", deg:"Numerator degree", flat:"horizontal tangent", notFlat:"not 0, so not flat",
      below:"below the axis", above:"above the axis", graph:"Graph of `y` for `-3 ≤ x ≤ 6`, the asymptote `x = 4` dashed, the tangent at `x = 1`",
      meter:"`y′/y` at `x = 1` (0 means a horizontal tangent)" }
  },
  cards:[
    ["When to use log differentiation", "When base and exponent both contain `x` (`x^x`), or for long products and quotients."],
    ["Step 1", "Take ln of both sides (`ln |y|` if `y` can be negative)."],
    ["Step 2", "Use log laws: products → sums, quotients → differences, exponents → factors."],
    ["`d/dx (ln y)`", "`(1/y)(dy/dx)`, by the chain rule."],
    ["Last step", "Multiply by `y`, then write `y` in terms of `x`."],
    ["`d/dx (x^x)`", "`x^x(ln x + 1)`, for `x > 0`."],
    ["Two pieces", "`d/dx (x^x) = x^x ln x` (exponential-rule piece) + `x · x^{x - 1}` (power-rule piece)."],
    ["Power rule vs exponential rule", "`x^n`: constant exponent → `nx^{n - 1}`. `b^x`: constant base → `b^x ln b`."],
    ["The `e`-rewrite", "`x^x = e^{x ln x}`: the chain rule gives the same answer."],
    ["Minimum of `x^x`", "At `x = 1/e`; the value is `e^{-1/e}`."],
    ["Relative rates", "`V = lwh` ⟹ `V′/V = l′/l + w′/w + h′/h`."],
    ["Squares count twice", "`V = πr^2h` ⟹ `V′/V = 2r′/r + h′/h`."]
  ]
};
