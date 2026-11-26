// MCV4U 27 Derivatives of Logarithmic Functions. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/27-derivatives-of-logarithmic-functions.md
// misconception core sentences (plan §3)
const M1 = "ln of an inside function: divide the inside’s <strong>derivative</strong> by the inside.";
const M2 = "It’s `g′` over `g`. Check: `ln(5x)` has slope `5/(5x) = 1/x`, not `5x/5`.";
const M3 = "`ln(ab) = ln a + ln b`. There is no law for `ln(a + b)`.";
const M4 = "`log_{b} x = ln x/ln b`, so the slope is `1/(x ln b)`.";
const M5 = "ln only accepts positive inputs. `x = -2` isn’t in the domain of `ln x`.";
const M6 = "`(ln x)^2` is a square of `ln x`: chain rule gives `2 ln x · (1/x)`. `ln(x^2) = 2 ln x` gives `2/x`.";
const M7 = "`ln(kx) = ln k + ln x`: the same graph shifted up, so the same slope `1/x`.";
const E = Math.E, L2 = Math.LN2;

export default {
  id:"27-derivatives-of-logarithmic-functions",
  kind:"topic",
  title:"Derivatives of logarithmic functions",
  topic:"Derivatives of Logarithmic Functions",
  readyTopic:"derivatives of logarithmic functions",
  hero:{
    eq:"`{d}/{dx} ln x = {1}/{x}` <span class=\"lg-heq\">(`x > 0`)</span>",
    eqLabel:"d by d x of ln x equals 1 over x, for x greater than 0",
    eqSize:"md",
    headline:"Reflect the slope, flip the number",
    text:"The <strong>natural logarithm</strong> `ln x` is the <strong>inverse</strong> of `e^x`: its graph is the reflection of `y = e^x` in the line `y = x`. Reflecting a tangent line swaps its rise and run, so the slopes are <strong>reciprocals</strong>. That one picture gives the derivative of every logarithm.",
    fig:{ aria:"y = e to the x draws in teal, then the dotted mirror line y = x. A tangent at (1, e) appears with a slope triangle: run 1, rise e. A copy of the curve and its tangent flips across the mirror and lands as y = ln x in blue with the tangent at (e, 1). Its triangle now reads run e, rise 1: slope 1 over e.", shape:"square" }
  },
  goals:[
    "I can explain, using the reflection of `y = e^x` in `y = x`, why `d/dx ln x = 1/x`.",
    "I can differentiate `ln x` and `log_{b} x`.",
    "I can differentiate `ln(g(x))` as `g′(x)/g(x)`.",
    "I can use log laws to simplify before differentiating.",
    "I can find slopes, tangent lines and horizontal tangents of functions with logarithms, inside their domain.",
    "I can interpret the derivative of a logarithmic model as a rate in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Log laws", goal:4, prompt:"Which expression equals `ln(x^4/y)` for `x`, `y > 0`?",
          options:[
            { t:"`4 ln x - ln y`", ok:true, why:"Quotient law, then power law." },
            { t:"`ln(4x) - ln y`", why:"The 4 is an exponent, not a factor." },
            { t:"`(ln x)^4 - ln y`", why:"The power law brings the 4 to the front." },
            { t:"`4 ln x / ln y`", why:"Quotient inside a log becomes a difference outside." }],
          hints:["Split the quotient first.", "`ln(x^4) - ln y`.", "`4 ln x - ln y`."] },
        { id:"w2", skill:"Log laws", goal:4, prompt:"Which statement is <strong>not</strong> true for every `x > 0`?",
          options:[
            { t:"`ln(x + 1) = ln x + ln 1`", ok:true, why:"There’s no law for the log of a sum. (Try `x = 1`: `ln 2 ≠ 0`.)" },
            { t:"`ln(2x) = ln 2 + ln x`", why:"This is the product law: true." },
            { t:"`ln(1/x) = -ln x`", why:"True: `ln 1 - ln x`." },
            { t:"`ln(x^2) = 2 ln x`", why:"True for `x > 0`: the power law." }],
          hints:["Test each with `x = 1`.", "`ln 2 ≈ 0.69`, `ln 1 = 0`.", "`ln(x + 1) = ln x + ln 1` fails."] },
        { id:"w3", skill:"e and ln", goal:1, prompt:"Solve `e^y = x` for `y`.",
          options:[
            { t:"`y = ln x`", ok:true, why:"ln undoes `e`." },
            { t:"`y = log x`", why:"`log x` is base 10." },
            { t:"`y = x/e`", why:"Dividing doesn’t undo a power." },
            { t:"`y = e/x`", why:"Not an inverse operation." }],
          hints:["Take ln of both sides.", "`ln(e^y) = y`.", "`y = ln x`."] },
        { id:"w4", skill:"e and ln", goal:1, prompt:"The graph of `y = ln x` is the graph of `y = e^x` reflected in…",
          options:[
            { t:"the line `y = x`", ok:true, why:"Inverse functions reflect in `y = x`." },
            { t:"the `x`-axis", why:"That gives `y = -e^x`." },
            { t:"the `y`-axis", why:"That gives `y = e^{-x}`." },
            { t:"the origin", why:"That gives `y = -e^{-x}`." }],
          hints:["Inverses swap `x` and `y`.", "(0, 1) on `e^x` becomes (1, 0) on `ln x`.", "`y = x`."] },
        { id:"w5", skill:"Chain rule", goal:3, prompt:"Differentiate `(x^2 + 1)^5`.",
          options:[
            { t:"`10x(x^2 + 1)^4`", ok:true, why:"`5(x^2 + 1)^4` times `2x`." },
            { t:"`5(x^2 + 1)^4`", why:"Multiply by the inside’s derivative." },
            { t:"`10x(x^2 + 1)^5`", why:"The power drops by 1." },
            { t:"`5(2x)^4`", why:"Differentiate the outside first, keeping the inside." }],
          hints:["Outside: `u^5`; inside: `x^2 + 1`.", "`5u^4 · 2x`.", "`10x(x^2 + 1)^4`."] },
        { id:"w6", skill:"Power rule", goal:2, prompt:"Differentiate `x^{-1}`.",
          options:[
            { t:"`-1/x^2`", ok:true, why:"`-1 · x^{-2}`." },
            { t:"`1/x^2`", why:"The exponent −1 comes down as −1." },
            { t:"`-1/x`", why:"Lower the exponent to −2." },
            { t:"0", why:"`x^{-1}` isn’t a constant." }],
          hints:["Power rule: `nx^{n - 1}`.", "`n = -1`.", "`-x^{-2}`."] }
      ],
      refreshers:{
        "Log laws":"`ln(ab) = ln a + ln b`; `ln(a/b) = ln a - ln b`; `ln(a^n) = n ln a` (for positive `a`, `b`). There is no law for `ln(a + b)`.",
        "e and ln":"`ln x` is the power of `e` that gives `x`. `e^{ln x} = x` and `ln(e^x) = x`. Their graphs are reflections in `y = x`.",
        "Chain rule":"`d/dx f(g(x)) = f′(g(x)) · g′(x)`: outside’s derivative, inside kept, times inside’s derivative.",
        "Power rule":"`d/dx x^n = nx^{n - 1}` for any real `n`, including negatives."
      }
    }
  },
  explore:{
    heading:"Mirror slopes",
    intro:"Move a point on `y = ln x`. Its mirror twin on `y = e^x` moves with it. Compare the slopes of the two tangent lines.",
    modes:[{ id:"mirror", t:"Mirror" }, { id:"trail", t:"Slope trail" }, { id:"bases", t:"Other bases" }],
    modeHow:{
      mirror:"`y = ln x` in blue, `y = e^x` in teal, the dotted mirror `y = x`. Each tangent has a slope triangle; the dashed segment joins the twin points.",
      trail:"`y = ln x` on top. As the point moves, its slope is plotted on the lower panel and leaves a teal trail. (`e^x` is hidden here, so teal means `f′` only.)",
      bases:"`y = log_{@b{b}} x` in blue with `y = ln x` as a dashed ghost. Choose a base and compare the tangents."
    },
    txt:{
      point:"Point `x` on `y = ln x`", pointB:"Point `x` on `y = log_{@b{b}} x`", pointNote:"Arrow keys move the point by 0.25. The chips jump to special points; you can also tap the graph.",
      base:"Base `@b{b}`", recip:"Show `y = 1/x`", clear:"Clear trail",
      rows:{ pt:"Point on `ln x`", sl:"Slope there", twin:"Twin on `e^x`", tsl:"Slope there", prod:"Product of slopes",
        trail:"Trail point (`x`, slope)", recip:"`1/x` at this `x`", fn:"Function", ptb:"Point on `log_{@b{b}} x`", xs:"`x` × slope" },
      keyM:"`ln x` in blue, `e^x` in teal, tangents in black, mirror `y = x` dotted.",
      keyT:"Top: `f(x) = ln x`. Bottom: its slope, `f′`, as a teal trail.",
      keyB:"`log_{@b{b}} x` in blue, `ln x` dashed, the tangent in black.",
      exact:"Exact answer (challenge 3)", exactHow:"Type an exact value, such as 1/2, e or e^2 (for `e^2`).", exactLab:"`x =`",
      topCap:"`f(x) = ln x`", lowCap:"slope of `ln x` (`f′`)", recipCap:"`y = 1/x` (dashed)"
    },
    predIntro:"Make a prediction first. Then the mirror shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"The tangent to `y = e^x` at (0, 1) has slope 1. What is the slope of the tangent to `y = ln x` at (1, 0)?",
        options:[{ t:"1", ok:true }, { t:"−1" }, { t:"0" }, { t:"`e`" }],
        explain:"A line of slope 1 reflects in `y = x` to another line of slope 1." },
      { id:"p2", prompt:"At `(2, e^2)`, `e^x` has slope `e^2 ≈ 7.39`. What is the slope of `ln x` at `(e^2, 2)`?",
        options:[{ t:"`1/e^2 ≈ 0.135`", ok:true }, { t:"`e^2`" }, { t:"`-e^2`" }, { t:"2" }],
        explain:"Reflection swaps rise and run: 7.39 becomes 1/7.39." },
      { id:"p3", prompt:"As `x` grows large, what happens to the slope of `y = ln x`?",
        options:[{ t:"It approaches 0 but stays positive", ok:true }, { t:"It becomes negative" }, { t:"It approaches 1" }, { t:"It grows without bound" }],
        explain:"`1/x > 0` for every `x > 0`, and `1/x → 0`. `ln x` always rises, but more and more slowly." },
      { id:"p4", prompt:"Compared with `ln x` (slope 1 at `x = 1`), the slope of `log_{2} x` at `x = 1` is…",
        options:[{ t:"larger: `1/ln 2 ≈ 1.44`", ok:true }, { t:"smaller: `ln 2 ≈ 0.69`" }, { t:"the same" }, { t:"1/2" }],
        explain:"`log_{2} x = ln x/ln 2`, a vertical stretch by `1/ln 2`." }
    ],
    chalIntro:"Use the mirror to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"Mirror mode: put the point where the tangent to `y = ln x` has slope 1/2.",
        why:"The slope of `ln x` at `x` is `1/x`, and `1/x = 1/2` at `x = 2`. Its twin on `e^x` has slope 2.",
        hints:["The slope of `ln x` at `x` is `1/x`.", "`1/x = 1/2`.", "`x = 2`."],
        msgs:{ mode:"Switch to <strong>Mirror</strong> mode first.", half:"The slope there is 2, the reciprocal of what you want.", four:"Slope 1/4.",
          general:"The slope there is about #1. You want 1/2." } },
      { id:"tc2", goal:[2, 5], prompt:"Other bases mode: choose `@b{b}` so the tangent to `y = log_{@b{b}} x` at `x = 2` has slope `1/(4 ln 2) ≈ 0.361`.",
        why:"`d/dx log_{b} x = 1/(x ln b)`. At `x = 2` you need `2 ln b = 4 ln 2`, so `ln b = 2 ln 2 = ln 4` and `b = 4`.",
        hints:["`d/dx log_{b} x = 1/(x ln b)`.", "At `x = 2`: `1/(2 ln b) = 1/(4 ln 2)`, so `ln b = 2 ln 2`.", "`2 ln 2 = ln 4`: `b = 4`."],
        msgs:{ mode:"Switch to <strong>Other bases</strong> mode first.", b2:"Slope `1/(2 ln 2) ≈ 0.721`, twice too steep.", b10:"Slope `1/(2 ln 10) ≈ 0.217`.",
          general:"At `x = 2` that base gives slope about #1. You want about 0.361." } },
      { id:"tc3", goal:[2, 5], stretch:true, prompt:"Find the point on `y = ln x` whose tangent line passes through (0, 1). Enter its `x`-coordinate exactly.",
        why:"The tangent at `(c, ln c)` is `y = ln c + (1/c)(x - c)`, which meets the `y`-axis at `ln c - 1`. `ln c - 1 = 1` gives `c = e^2`.",
        hints:["The tangent at `(c, ln c)` is `y = ln c + (1/c)(x - c)`.", "At `x = 0` it gives `y = ln c - 1`.", "`ln c - 1 = 1`, so `c = e^2`."],
        msgs:{ e:"That tangent passes through the origin.", one:"The tangent at (1, 0) is `y = x - 1`, through `(0, -1)`.",
          blank:"Enter the `x`-coordinate exactly in the box under the readout.", pos:"`ln x` only accepts `x > 0`, so the point must have `x > 0`.", chip:"Now enter its `x`-coordinate exactly in the box under the readout.",
          err:"Type an exact value, such as 1/2, e or e^2 (for `e^2`).", approx:"Close, but enter it exactly with `e`: type e^2 for `e^2`.",
          general:"Not yet: the tangent at that point meets the `y`-axis at `ln c - 1` ≈ #1, not at 1." } }
    ]
  },
  part3:{
    slug:"chains", name:"Chains",
    heading:"Logs in chains",
    intro:"The chain rule with ln has a meaning (the relative rate of change) and a shortcut (log laws first). Each station compares two routes or two graphs. Then try the quick check.",
    st1:{ title:"Station 1: Slope of `ln g` = slope of `g` ÷ height of `g`",
      text:"`g(x) = x^2 + 1` (blue) and `y = ln(x^2 + 1)` (teal) share one probe. Move it and compare the slope of `ln g` with `g′` ÷ `g`.",
      chipsLab:"Probe `x`", note:"Arrow keys move the probe by 0.25 (Shift for 2.5). You can also tap either graph.",
      capG:"`g(x) = x^2 + 1`", capL:"`y = ln(x^2 + 1)`",
      rows:{ g:"`g(x)`", dg:"`g′(x)`", ratio:"`g′` ÷ `g`", sl:"Slope of `ln g` (measured)" },
      same:"✓ the same number",
      rel:"`g′/g` is the <strong>relative rate of change</strong> of `g`: its rate as a fraction of its size.",
      alg:["`d/dx ln(g) = (1/g) · g′ = g′/g`.", "At `x = 1`: `g = 2`, `g′ = 2`, so the slope of `ln g` is `2/2 = 1`."] },
    st2:{ title:"Station 2: Simplify first?",
      text:"`y = ln[(x + 1)^3/(x - 2)]` for `x > 2`. Step through both routes and count the lines.",
      domain:"Domain check: for `x > 2`, both `(x + 1)^3` and `x - 2` are positive, so the log laws apply.",
      routes:[
        { id:"b", title:"Route B: log laws first", lines:[
            { r:"Log laws: quotient, then power", e:"`y = 3 ln(x + 1) - ln(x - 2)`" },
            { r:"Differentiate each term", e:"`y′ = {3}/{x + 1} - {1}/{x - 2}`" }],
          val:"At `x = 3`: `3/4 - 1 = -1/4`." },
        { id:"a", title:"Route A: no simplifying", lines:[
            { r:"Name the inside", e:"`y = ln u`, with `u = {(x + 1)^3}/{x - 2}`" },
            { r:"Chain rule: outside first", e:"`y′ = {1}/{u} · u′ = {x - 2}/{(x + 1)^3} · u′`" },
            { r:"Quotient rule for the inside", e:"`u′ = {3(x + 1)^2(x - 2) - (x + 1)^3}/{(x - 2)^2}`" },
            { r:"Factor out `(x + 1)^2`", e:"`u′ = {(x + 1)^2(2x - 7)}/{(x - 2)^2}`" },
            { r:"Multiply", e:"`y′ = {x - 2}/{(x + 1)^3} · {(x + 1)^2(2x - 7)}/{(x - 2)^2}`" },
            { r:"Cancel", e:"`y′ = {2x - 7}/{(x + 1)(x - 2)}`" }],
          val:"At `x = 3`: `{6 - 7}/{4 · 1} = -1/4`." }
      ],
      used:"Lines used: #1", start:"Press Step to write the first line.",
      done:"Same derivative, same value: `-1/4` at `x = 3`. Route B used 2 lines; Route A used 6.",
      alg:["`{3}/{x + 1} - {1}/{x - 2} = {3(x - 2) - (x + 1)}/{(x + 1)(x - 2)} = {2x - 7}/{(x + 1)(x - 2)}`", "Route B’s answer is Route A’s answer, written as two simple fractions."] },
    st3:{ title:"Station 3: `ln(kx)` vs `ln x`",
      text:"Slide `k`. The ghost of `y = ln x` stays put. Compare the tangents at the same `x`.",
      k:"`k`", x:"Tangents at `x`",
      rows:{ shift:"Shift", sk:"Slope of `ln(kx)`", s1:"Slope of `ln x`" },
      note:"`ln(kx) = ln k + ln x`. A vertical shift doesn’t change any slope." },
    quickCheck:{
      title:"Quick check", summary:"Logs in chains quick check",
      items:[
        { id:"q1", goal:[3, 4], prompt:"`d/dx ln(5x)` = ?",
          choices:[{ t:"`1/x`", ok:true, fb:"Right. `5/(5x) = 1/x`, or: `ln 5 + ln x`." }, { t:"`1/(5x)`", fb:"`5/(5x) = 1/x`, or: `ln 5 + ln x`." }, { t:"`5/x`", fb:"`5/(5x) = 1/x`, or: `ln 5 + ln x`." }, { t:"5", fb:"`5/(5x) = 1/x`, or: `ln 5 + ln x`." }] },
        { id:"q2", goal:3, prompt:"`d/dx ln(x^2 + 4)` = ?",
          choices:[{ t:"`2x/(x^2 + 4)`", ok:true, fb:"Right. Inside’s derivative over the inside." }, { t:"`1/(x^2 + 4)`", fb:"Inside’s derivative over the inside." }, { t:"`1/(2x)`", fb:"Inside’s derivative over the inside." }, { t:"`(x^2 + 4)/(2x)`", fb:"Inside’s derivative over the inside." }] },
        { id:"q3", goal:4, prompt:"Best first step for `y = ln(x^5(x + 1))`?",
          choices:[{ t:"Rewrite as `5 ln x + ln(x + 1)`", ok:true, fb:"Right. Product inside → sum outside; the power 5 belongs to `x` only." }, { t:"Rewrite as `ln(x^5) · ln(x + 1)`", fb:"Product inside → sum outside; the power 5 belongs to `x` only." }, { t:"Use the quotient rule", fb:"Product inside → sum outside; the power 5 belongs to `x` only." }, { t:"Rewrite as `5 ln(x(x + 1))`", fb:"Product inside → sum outside; the power 5 belongs to `x` only." }] },
        { id:"q4", goal:2, prompt:"`d/dx log_{3} x` = ?",
          choices:[{ t:"`1/(x ln 3)`", ok:true, fb:"Right. `log_{3} x = ln x/ln 3`." }, { t:"`ln 3/x`", fb:"`log_{3} x = ln x/ln 3`." }, { t:"`1/(3x)`", fb:"`log_{3} x = ln x/ln 3`." }, { t:"`1/(x log 3)`", fb:"`log_{3} x = ln x/ln 3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[2, 3, 4],
        instruction:"Match each function with its derivative. One card on the right has no partner.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`ln(4x)`", goal:4, why:"`ln(4x) = ln 4 + ln x`: slope `1/x`." },
          { id:"l2", t:"`ln(x^4)`", goal:4, why:"`ln(x^4) = 4 ln x`: slope `4/x`." },
          { id:"l3", t:"`(ln x)^4`", goal:3, why:"Chain rule: `4(ln x)^3 · (1/x)`." },
          { id:"l4", t:"`ln(x^2 + 9)`", goal:3, why:"Inside’s derivative over the inside: `2x/(x^2 + 9)`." },
          { id:"l5", t:"`log x` (base 10)", goal:2, why:"`log x = ln x/ln 10`: slope `1/(x ln 10)`." },
          { id:"l6", t:"`x ln x`", goal:3, why:"Product rule: `1 · ln x + x · (1/x) = ln x + 1`.",
            hints:["Product rule.", "`1 · ln x + x · (1/x)`.", "`ln x + 1`."] },
          { id:"l7", t:"`ln √x`", goal:4, why:"`ln √x = (1/2) ln x`: slope `1/(2x)`." },
          { id:"l8", t:"`(ln x)/x`", goal:3, why:"Quotient rule: `[(1/x) · x - ln x · 1]/x^2 = (1 - ln x)/x^2`.",
            hints:["Quotient rule, or write it as `ln x · x^{-1}`.", "`[(1/x) · x - ln x · 1]/x^2`.", "`(1 - ln x)/x^2`."] }
        ],
        right:[
          { id:"r1", t:"`1/x`" }, { id:"r2", t:"`4/x`" }, { id:"r3", t:"`4(ln x)^3/x`" }, { id:"r4", t:"`2x/(x^2 + 9)`" },
          { id:"r5", t:"`1/(x ln 10)`" }, { id:"r6", t:"`ln x + 1`" }, { id:"r7", t:"`1/(2x)`" }, { id:"r8", t:"`(1 - ln x)/x^2`" },
          { id:"r9", t:"`1/√x`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r2":"`ln(4x) = ln 4 + ln x`: the 4 becomes a constant term.", "l2|r3":"`ln(x^4) = 4 ln x`, but `(ln x)^4` is a power of `ln x`.",
          "l3|r2":"`ln(x^4) = 4 ln x`, but `(ln x)^4` is a power of `ln x`.", "l5|r1":"Base 10 needs ÷ `ln 10`.", "l7|r9":"`ln √x = (1/2) ln x`." },
        wrongDefault:"Simplify with log laws first, then differentiate." },
      { id:"rates", type:"custom", title:"Tangents and rates", summary:"Tangents and rates", star:true, goal:[3, 4, 5],
        instruction:"Find slopes, tangent lines and horizontal tangents with exact values. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions, and e or ln where you need them, such as 1/e, e^2 (for `e^2`) or 2 − 2 ln 2. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as 3, −1/4, 1/e, e^2 or 2 − 2 ln 2.",
          lnneg:"ln only accepts positive inputs: check what’s inside each ln.",
          exact:"Close, but give the exact value (with e or ln, such as 1/e or 2 − 2 ln 2), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"l1", goal:3, prompt:"Slope of `y = ln(3x - 2)` at `x = 1`.",
            boxes:[{ k:"s", pre:"Slope" }], answer:{ s:3 }, display:"3",
            wrong:[{ k:"s", eq:1, fb:"Multiply by the inside’s derivative, 3." }],
            why:"`y′ = 3/(3x - 2)`, which is `3/1 = 3` at `x = 1`." },
          { id:"l2", goal:5, prompt:"Tangent to `y = ln x` at `x = e`: enter the slope and `y`-intercept.",
            boxes:[{ k:"t", line:true }], answer:{ t:[1 / E, 0] }, display:"`y = (1/e)x + 0`, that is `y = x/e`",
            wrong:[{ k:"t", i:1, v:1, fb:"The point is `(e, 1)`; `y = 1 + (x - e)/e = x/e`." }],
            why:"The slope is `1/e` and the point is `(e, 1)`: `y = 1 + (x - e)/e = x/e`." },
          { id:"l3", goal:5, star:true, prompt:"Where does `y = x - 2 ln x` have a horizontal tangent? Enter the point.",
            boxes:[{ k:"p", pre:"Point", pt:true }], answer:{ p:[2, 2 - 2 * L2] }, display:"`(2, 2 - 2 ln 2)`",
            wrong:[{ k:"p", i:0, v:0.5, fb:"`1 - 2/x = 0` gives `x = 2`." }],
            why:"`y′ = 1 - 2/x = 0` gives `x = 2`, and `y(2) = 2 - 2 ln 2`." },
          { id:"l4", goal:[3, 5], star:true, prompt:"`f(x) = ln(x^2 - 4x + 5)`. Where is `f′(x) = 0`, and what is `f` there?",
            boxes:[{ k:"x", pre:"`x =`" }, { k:"f", pre:"`f` there" }], answer:{ x:2, f:0 }, display:"`x = 2`, `f(2) = 0`",
            general:"`f′ = (2x - 4)/(x^2 - 4x + 5)`; the inside is always positive, so the domain is every real `x`.",
            why:"`f′ = (2x - 4)/(x^2 - 4x + 5)` is 0 at `x = 2`, and `f(2) = ln 1 = 0`. The inside is always positive, so the domain is every real `x`." },
          { id:"l5", goal:5, star:true, prompt:"At what `x` do `y = ln x` and `y = √x` have equal slopes?",
            boxes:[{ k:"x", pre:"`x =`" }], answer:{ x:4 }, display:"`x = 4`",
            wrong:[{ k:"x", eq:2, fb:"`1/x = 1/(2√x)` gives `x = 2√x`, so `√x = 2`." }],
            why:"`1/x = 1/(2√x)` gives `x = 2√x`, so `√x = 2` and `x = 4`.",
            hints:["Set the two derivatives equal.", "`1/x = 1/(2√x)`.", "`x = 2√x`, so `√x = 2` and `x = 4`."] },
          { id:"l6", goal:[3, 5], star:true, prompt:"For `y = ln(x^2 + 1)`, at what `x > 0` is the slope greatest, and what is that slope?",
            boxes:[{ k:"x", pre:"`x =`" }, { k:"s", pre:"Greatest slope" }], answer:{ x:1, s:1 }, display:"`x = 1`, slope 1",
            general:"Slope `s(x) = 2x/(x^2 + 1)`. Maximize it: `s′(x) = (2 - 2x^2)/(x^2 + 1)^2 = 0` at `x = 1`.",
            why:"Slope `s(x) = 2x/(x^2 + 1)`. Maximize it: `s′(x) = (2 - 2x^2)/(x^2 + 1)^2 = 0` at `x = 1`, where the slope is `2/2 = 1`.",
            hints:["The slope is a function of `x`; you want its maximum.", "Differentiate `2x/(x^2 + 1)` with the quotient rule.", "Zero at `x = 1`; slope `2/2 = 1`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Adebayo", how:"", goal:[3, 4],
        instruction:"Adebayo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Differentiate `y = ln(x^2 + 3x)`.",
            steps:["`y = ln u`, with `u = x^2 + 3x`.", "`dy/du = 1/u`.", "`du/dx = 2x + 3`.", "`dy/dx = 1/u + (2x + 3)`.", "`= 1/(x^2 + 3x) + 2x + 3`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 substitutes into step 4 correctly."],
            fixes:[
              { t:"`dy/dx = (1/u)(2x + 3) = (2x + 3)/(x^2 + 3x)`.", ok:true, why:"The chain rule multiplies `dy/du` by `du/dx`." },
              { t:"`dy/dx = 1/(2x + 3)`.", why:M2 },
              { t:"`dy/dx = (x^2 + 3x)/(2x + 3)`.", why:M2 },
              { t:"Step 4 is correct.", why:"The chain rule multiplies the rates; it doesn’t add them." }],
            hints:["How does the chain rule combine `dy/du` and `du/dx`?", "It multiplies them.", "`(2x + 3)/(x^2 + 3x)`."] },
          { id:"e2", goal:4, task:"Differentiate `y = ln(x(x + 5))` for `x > 0`.",
            steps:["For `x > 0` both factors are positive, so log laws apply.", "`ln(x(x + 5)) = ln x · ln(x + 5)`.", "Product rule: `y′ = {1}/{x} ln(x + 5) + ln x · {1}/{x + 5}`.", "That’s the final answer."],
            answer:1,
            stepFb:["Step 1 is correct: it checks the domain.", "", "Step 3 differentiates step 2 correctly.", "This follows; but is step 2’s rewrite true?"],
            fixes:[
              { t:"`ln(x(x + 5)) = ln x + ln(x + 5)`, so `y′ = 1/x + 1/(x + 5)`.", ok:true, why:"The log of a product is a sum of logs." },
              { t:"`ln(x(x + 5)) = ln x + 5`.", why:"The 5 is inside a sum, not a factor." },
              { t:"`ln(x(x + 5)) = 2 ln x + ln 5`.", why:M3 },
              { t:"Step 2 is correct.", why:"Test `x = 1`: `ln 6 ≈ 1.79`, but `ln 1 · ln 6 = 0`." }],
            hints:["What does the product law say?", "The log of a product is a <strong>sum</strong> of logs.", "`1/x + 1/(x + 5)`."] },
          { id:"e3", goal:3, task:"Find the slope of `y = (ln x)^2` at `x = e^2`.",
            steps:["`(ln x)^2 = 2 ln x`.", "`y′ = 2/x`.", "At `x = e^2`: `2/e^2`."],
            answer:0,
            stepFb:["", "Step 2 differentiates step 1 correctly.", "Step 3 evaluates step 2 correctly."],
            fixes:[
              { t:"`(ln x)^2` is the square of `ln x`: `y′ = 2 ln x · (1/x)`, so at `e^2`: `2 · 2/e^2 = 4/e^2`.", ok:true, why:"Chain rule with `u = ln x`." },
              { t:"`y′ = 2 ln x`, so the slope is 4.", why:"The chain factor `1/x` is missing." },
              { t:"`y′ = 2/(x ln x)`, so `1/e^2`.", why:"That divides by `ln x` instead of multiplying." },
              { t:"Step 1 is correct.", why:"The power law is for `ln(x^2)`, not `(ln x)^2`." }],
            hints:["Is the square on `x` or on `ln x`?", "On `ln x`: use the chain rule with `u = ln x`.", "`2u · u′ = 2 ln x/x`; at `e^2`, `4/e^2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the mirror: that the twin slopes always multiply to 1, or that `ln x` keeps rising forever?" },
      { id:"j2", q:"In your own words, why is the slope of `ln x` equal to `1/x`?" },
      { id:"j3", q:"Explain to a friend when simplifying with log laws first saves work, and when it isn’t allowed." },
      { id:"j4", q:"Which kind of log derivative still trips you up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"`d/dx log_{5} x` = ?", options:[
          { t:"`1/(x ln 5)`", ok:true, why:"`log_{5} x = ln x/ln 5`." },
          { t:"`ln 5/x`", why:"`ln 5` belongs in the denominator. " + M4 },
          { t:"`1/(5x)`", why:"The base isn’t a factor of `x`." },
          { t:"`1/(x log 5)`", why:"Natural log, not base 10. " + M4 }] },
        b:{ prompt:"`d/dx log_{7} x` = ?", options:[
          { t:"`1/(x ln 7)`", ok:true, why:"`log_{7} x = ln x/ln 7`." },
          { t:"`ln 7/x`", why:"`ln 7` belongs in the denominator. " + M4 },
          { t:"`1/(7x)`", why:"The base isn’t a factor of `x`." },
          { t:"`1/(x log 7)`", why:"Natural log, not base 10. " + M4 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`d/dx ln(x^3 + 2x)` = ?", options:[
          { t:"`(3x^2 + 2)/(x^3 + 2x)`", ok:true, why:"Inside’s derivative over the inside." },
          { t:"`1/(x^3 + 2x)`", why:M1 },
          { t:"`(x^3 + 2x)/(3x^2 + 2)`", why:M2 },
          { t:"`1/(3x^2 + 2)`", why:M2 }] },
        b:{ prompt:"`d/dx ln(x^4 - x)` = ?", options:[
          { t:"`(4x^3 - 1)/(x^4 - x)`", ok:true, why:"Inside’s derivative over the inside." },
          { t:"`1/(x^4 - x)`", why:M1 },
          { t:"`(x^4 - x)/(4x^3 - 1)`", why:M2 },
          { t:"`1/(4x^3 - 1)`", why:M2 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`d/dx ln(7x)` = ?", options:[
          { t:"`1/x`", ok:true, why:"`ln 7 + ln x`; `ln 7` is a constant." },
          { t:"`7/x`", why:"`ln(7x)` isn’t `7 ln x`." },
          { t:"`1/(7x)`", why:"Multiply `1/(7x)` by the inside’s derivative, 7." },
          { t:"7", why:"The inside goes in the denominator." }] },
        b:{ prompt:"`d/dx ln(x/3)` = ?", options:[
          { t:"`1/x`", ok:true, why:"`ln x - ln 3`." },
          { t:"`3/x`", why:"`1/(x/3)` still needs the factor `1/3`." },
          { t:"`1/(3x)`", why:"`ln(x/3)` differs from `ln x` only by a constant." },
          { t:"`-1/3`", why:"`ln 3` is constant; its derivative is 0, and `ln x` gives `1/x`." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"At what point does `y = x^2 - 8 ln x` have a horizontal tangent?", options:[
          { t:"`(2, 4 - 8 ln 2)`", ok:true, why:"`2x - 8/x = 0` gives `x^2 = 4`, and `x > 0`." },
          { t:"`(-2, 4 - 8 ln 2)`", why:"`ln x` needs `x > 0`." },
          { t:"`(4, 16 - 16 ln 2)`", why:"That solves `2x = 8`, not `2x = 8/x`." },
          { t:"`(2√2, 8 - 12 ln 2)`", why:"That uses `x - 8/x`: `d/dx x^2 = 2x`." }] },
        b:{ prompt:"At what point does `y = 2x^2 - 16 ln x` have a horizontal tangent?", options:[
          { t:"`(2, 8 - 16 ln 2)`", ok:true, why:"`4x - 16/x = 0` gives `x^2 = 4`." },
          { t:"`(-2, 8 - 16 ln 2)`", why:M5 },
          { t:"`(4, 32 - 32 ln 2)`", why:"That solves `4x = 16`." },
          { t:"`(2√2, 16 - 24 ln 2)`", why:"That uses `2x` for the derivative of `2x^2`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`f(x) = ln[(x - 1)^2(x + 2)]`. Find `f′(2)`.", options:[
          { t:"9/4", ok:true, why:"`f = 2 ln(x - 1) + ln(x + 2)` near `x = 2`, so `f′(2) = 2/1 + 1/4`." },
          { t:"5/4", why:"The power 2 comes to the front: `2 ln(x - 1)`." },
          { t:"1/2", why:"Logs of factors add; their derivatives add too." },
          { t:"1/4", why:"`1/[(x - 1)^2(x + 2)]` needs the inside’s derivative on top." }] },
        b:{ prompt:"`f(x) = ln[(x + 1)^3/(x - 1)]`. Find `f′(3)`.", options:[
          { t:"1/4", ok:true, why:"`f = 3 ln(x + 1) - ln(x - 1)`, so `f′(3) = 3/4 - 1/2`." },
          { t:"5/4", why:"A quotient gives a difference, not a sum." },
          { t:"−1/4", why:"The power 3 comes to the front." },
          { t:"1/32", why:M1 }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Which function has the same derivative as `y = ln x`?", options:[
          { t:"`y = ln(5x)`", ok:true, why:"`ln 5 + ln x`: shifted up, same slopes." },
          { t:"`y = ln(x + 5)`", why:"Shifted left: slope `1/(x + 5)`." },
          { t:"`y = log_{5} x`", why:"Slope `1/(x ln 5)`." },
          { t:"`y = 5 ln x`", why:"Stretched: slope `5/x`." }] },
        b:{ prompt:"Which function has derivative `3/x`?", options:[
          { t:"`y = ln(x^3)`", ok:true, why:"`3 ln x`." },
          { t:"`y = ln(3x)`", why:"`ln 3 + ln x`: slope `1/x`." },
          { t:"`y = (ln x)^3`", why:"Slope `3(ln x)^2/x`." },
          { t:"`y = log_{3} x`", why:"Slope `1/(x ln 3)`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the slope of `y = ln x` at `(4, ln 4)` is 1/4?", options:[
          { t:"“`(4, ln 4)` on `ln x` mirrors `(ln 4, 4)` on `e^x`, where the slope equals the height, 4. Reflecting in `y = x` swaps rise and run, so the slope becomes 1/4.”", ok:true, why:"Mirror points have reciprocal slopes." },
          { t:"“`ln x` and `e^x` are inverses, so their slopes are opposites: −4 becomes 1/4.”", why:"Reflection gives reciprocals, not opposites." },
          { t:"“The slope of `ln x` is ln of the slope of `e^x`.”", why:"`ln 4 ≈ 1.39`, not 1/4." },
          { t:"“At `x = 4`, `ln x` is about 1.39, which is close to 1/4 after rounding.”", why:"1.39 isn’t close to 0.25; the slope is a different number from the height." }] },
        b:{ prompt:"Which is the best explanation of why the slope of `y = ln x` at `(1/2, -ln 2)` is 2?", options:[
          { t:"“`(1/2, -ln 2)` mirrors `(-ln 2, 1/2)` on `e^x`, where the slope equals the height, 1/2. Reflection swaps rise and run, so the slope on `ln x` is 2.”", ok:true, why:"Mirror points have reciprocal slopes." },
          { t:"“The slopes are opposites: −1/2 becomes 2.”", why:"Reciprocals, not opposites." },
          { t:"“The slope of `ln x` is the height of `ln x` doubled.”", why:"The height is `-ln 2 ≈ -0.69`." },
          { t:"“`ln x` is negative there, so its slope must be negative.”", why:"`ln x` always rises: its slope is always positive." }] } },
      { id:"c2", cat:"C", goal:[3, 4],
        a:{ prompt:"Which is the clearest correct first step to differentiate `y = ln(x^3√{x + 1})` for `x > 0`?", options:[
          { t:"“Rewrite as `3 ln x + (1/2) ln(x + 1)`, then differentiate term by term.”", ok:true, why:"Product → sum, powers to the front." },
          { t:"“Rewrite as `ln(x^3) · ln(√{x + 1})`.”", why:M3 },
          { t:"“Rewrite as `3 ln x · (1/2) ln(x + 1)`.”", why:"Logs of factors add." },
          { t:"“Rewrite as `(ln x)^3 + √{ln(x + 1)}`.”", why:"The power law brings the exponent to the front of the log." }] },
        b:{ prompt:"Which is the clearest correct first step to differentiate `y = ln(x^2/(x - 4)^5)` for `x > 4`?", options:[
          { t:"“Rewrite as `2 ln x - 5 ln(x - 4)`, then differentiate term by term.”", ok:true, why:"Quotient → difference, powers to the front." },
          { t:"“Rewrite as `ln(x^2)/ln((x - 4)^5)`.”", why:M3 },
          { t:"“Rewrite as `2 ln x + 5 ln(x - 4)`.”", why:"A quotient gives a difference." },
          { t:"“Rewrite as `(ln x)^2 - (ln(x - 4))^5`.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"After `t` weeks of practice, a student types `S(t) = 30 + 20 ln(t + 1)` words per minute. How fast is the speed increasing at `t = 4` weeks?", options:[
          { t:"4 words per minute per week", ok:true, why:"`S′(t) = 20/(t + 1) = 20/5`." },
          { t:"5 words per minute per week", why:"`d/dt ln(t + 1)` is `1/(t + 1)`, not `1/t`." },
          { t:"`20 ln 5` words per minute", why:"That’s the gain since `t = 0`, not a rate." },
          { t:"`20/(5 ln 10)` words per minute per week", why:"ln is base `e`: no `ln 10`." }] },
        b:{ prompt:"A toddler knows `V(t) = 50 + 300 ln(t + 1)` words after `t` months of a program. How fast is the vocabulary growing at `t = 5` months?", options:[
          { t:"50 words per month", ok:true, why:"`V′(t) = 300/(t + 1) = 300/6`." },
          { t:"60 words per month", why:"`d/dt ln(t + 1)` is `1/(t + 1)`, not `1/t`." },
          { t:"`300 ln 6` words", why:"That’s the gain, not a rate." },
          { t:"`300/(6 ln 10)` words per month", why:"ln is base `e`: no `ln 10`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A seedling’s height is `h(t) = 12 ln(t + 1) - t` cm, `t` in weeks (`0 ≤ t ≤ 20`). When does it stop growing?", options:[
          { t:"At `t = 11` weeks", ok:true, why:"`h′(t) = 12/(t + 1) - 1 = 0` gives `t + 1 = 12`." },
          { t:"At `t = 12` weeks", why:"That uses `12/t`." },
          { t:"At `t = 13` weeks", why:"`t + 1 = 12`, not `t - 1 = 12`." },
          { t:"It never stops: ln keeps increasing.", why:"The `-t` term eventually wins: `h′ < 0` after `t = 11`." }] },
        b:{ prompt:"A seedling’s height is `h(t) = 18 ln(t + 2) - 2t` cm, `t` in weeks (`0 ≤ t ≤ 20`). When does it stop growing?", options:[
          { t:"At `t = 7` weeks", ok:true, why:"`18/(t + 2) - 2 = 0` gives `t + 2 = 9`." },
          { t:"At `t = 9` weeks", why:"That uses `18/t`." },
          { t:"At `t = 11` weeks", why:"`t + 2 = 9`, not `t - 2 = 9`." },
          { t:"It never stops.", why:"`h′ < 0` after `t = 7`." }] } }
    ]
  },
  task:{
    title:"Low point", summary:"Low point",
    statement:"<p>Design `f(x) = a ln x + bx` (for `x > 0`) that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has a horizontal tangent at `x = 2`.</li><li>The graph is concave up at `x = 2` (so the horizontal tangent is a low point).</li><li>`f(1) ≥ 3`.</li><li>`f(e) < 4`. (Use `e ≈ 2.718`.)</li></ol></div>" +
      "<p class=\"tiny muted\">`a` is a whole number from −12 to 12 and `b` a whole number from −6 to 6, neither 0. The graph shows `f` on (0, 8] with the tangent at `x = 2` and dots at `x = 1` and `x = e`.</p>",
    checks:["Horizontal tangent at `x = 2`", "Concave up at `x = 2`", "`f(1) ≥ 3`", "`f(e) < 4`"],
    tips:["`f′(x) = a/x + b`. Set it to 0 at `x = 2`: `a = -2b`.",
      "`f″(x) = -a/x^2`. For concave up you need `a < 0`.",
      "`ln 1 = 0`, so `f(1)` is just `b`.",
      "`ln e = 1`, so `f(e) = a + be`. With `a = -2b`, that’s `b(e - 2) ≈ 0.718b`."],
    explainPrompt:"Explain how each condition narrowed down `a` and `b`, and why `ln 1` and `ln e` made lines 3 and 4 easy to work with.",
    vocab:"Use the words derivative, horizontal tangent, concave up and ln e = 1.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"(−12, 6) gives `f(e) ≈ 4.31`, just over. Lines 1, 3 and 4 pin `b` between 3 and 5.57, and line 1 sets `a = -2b`.",
    labels:{ a:"`a`", b:"`b`", rangeA:"(−12 to 12, not 0)", rangeB:"(−6 to 6, not 0)",
      invalid:"Choose whole numbers: `a` from −12 to 12 and `b` from −6 to 6, neither 0.",
      fRow:"`f(x)`", dRow:"`f′(x)`", d2:"`f′(2)`", dd2:"`f″(2)`", f1:"`f(1)`", fe:"`f(e)`",
      flat:"horizontal", up:"concave up", down:"concave down", graph:"Graph of `f` on (0, 8] with the tangent at `x = 2`" }
  },
  cards:[
    ["`d/dx ln x`", "`1/x`, for `x > 0`."],
    ["Why `1/x`?", "`ln x` mirrors `e^x` in `y = x`; reflected tangents have reciprocal slopes."],
    ["`d/dx log_{b} x`", "`1/(x ln b)`. Example: `d/dx log_{2} x = 1/(x ln 2)`."],
    ["Chain rule with ln", "`d/dx ln(g(x)) = g′(x)/g(x)`."],
    ["Relative rate", "`g′/g` is the slope of `ln g`: the rate as a fraction of the size."],
    ["`ln(kx)`", "`ln k + ln x`: same derivative as `ln x`, `1/x`."],
    ["`ln(x^n)` vs `(ln x)^n`", "`n/x` vs `n(ln x)^{n - 1}/x`."],
    ["Simplify first", "`ln(AB/C) = ln A + ln B - ln C`, then differentiate each term."],
    ["No law for sums", "`ln(a + b)` does not split."],
    ["Domain", "`ln u` needs `u > 0`. Check before simplifying or solving."],
    ["Slope of `ln x` as `x → ∞`", "`1/x → 0`: always rising, ever more slowly."]
  ]
};
