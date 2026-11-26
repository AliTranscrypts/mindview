// MHF4U 45 Chapters 6–7 Summary & Review: the plan's content as data (plan modules/45-chapters-6-7-review.md).
// Review module: Start (goals + diagnostic), Connect (exponential ↔ logarithm concept map), Mixed practice, Reflect, Final Check.

// M-table core sentences (plan section 3), used where the plan tags an option with the misconception.
const M1 = "In `log_b y = x`, the base stays the base and the log’s value is the exponent: `b^x = y`.";
const M2 = "The laws work on products and quotients inside <strong>one</strong> log: `log m + log n = log(mn)`.";
const M3 = "`log_b(x^n) = n log_b x`: the exponent on the argument comes out in front.";
const M4 = "Each unit on a log scale is a factor of 10: a difference of 3 means `10^3` = 1000 times.";
const M5 = "Check each candidate in <strong>every</strong> original log: all arguments must be positive. A positive candidate can still fail.";
const M6 = "`b` to any power is positive, so `log_b` of 0 or a negative number is undefined.";
const M7a = "Count halvings: 400 → 200 → 100 → 50 → 25 is 4 half-lives.";
const M7b = "Count halvings: 32 000 → 16 000 → 8000 → 4000 is 3 half-lives of 4 years.";
const M8 = "`(x - 4)` moves the vertical asymptote to `x = 4`; stretches and reflections come before translations.";
const DB = "That’s the ratio, not the change in level: every 10 dB is a factor of 10.";

export default {
  id:"45-chapters-6-7-review",
  kind:"review",
  title:"Chapters 6–7 summary and review",
  topic:"Chapters 6–7 Summary & Review",
  hero:{
    eq:"`@b{b}^x = y ⟺ log_{@b{b}} y = x`", eqLabel:"b to the power x equals y means log base b of y equals x", eqSize:"md",
    headline:"Every logarithm is an exponent",
    text:"A logarithm answers one question: what exponent turns `b` into `y`? That single idea makes the log graph the mirror image of the exponential graph, makes the log laws copies of the exponent laws, and turns pH, decibels and earthquakes into counts of powers of 10.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ shape:"square",
      aria:"Graph of y = 2ˣ through (0, 1), (1, 2) and (3, 8), and its mirror image y = log₂ x through (1, 0), (2, 1) and (8, 3), reflected in the dotted line y = x. The asymptote x = 0 is labelled domain x > 0, and the point (8, 3) is labelled log₂ 8 = 3. A stretch and shift give y = 2 log₂(x − 1). A Richter ruler at the top marks ×10 for each step. On the x-axis, 4 is ticked as a solution and −2 is crossed out.",
      steps:[
        { cap:"`y = 2^x` through `(0, 1)`, `(1, 2)` and `(3, 8)` · module 37" },
        { cap:"Swap each point’s coordinates across `y = x`: `y = log_2 x` · modules 37 and 38" },
        { cap:"Asymptote `x = 0`, so the domain is `x > 0`; `log_2 8 = 3` · module 38" },
        { cap:"A stretch and a shift: `y = 2 log_2(x - 1)` · module 39" },
        { cap:"`log_2 8^5 = 15` and `log_2 4 + log_2 8 = 5` · modules 40 and 41" },
        { cap:"A Richter ruler: each step is ×10 · module 42" },
        { cap:"`2^x = 20 → x = log 20/log 2` · module 43" },
        { cap:"`log_2 x + log_2(x - 2) = 3 → x = 4` ✓, −2 ✗ · module 44" }] }
  },
  goals:[
    "I can describe `y = log_b x` as the inverse of `y = b^x` and convert between exponential and logarithmic form.",
    "I can evaluate logarithms and describe the key features of `y = log_b x`.",
    "I can describe and sketch transformations of `y = log_b x`.",
    "I can use the power law and change of base to simplify and estimate logarithms.",
    "I can use the product and quotient laws to simplify and evaluate.",
    "I can compare quantities on logarithmic scales using ratios.",
    "I can solve exponential equations and growth, decay and interest problems.",
    "I can solve logarithmic equations and reject extraneous roots."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "37":{ idea:"`log_b y = x ⟺ b^x = y`; the log graph is the reflection of the exponential in `y = x`.",
      look:"The swap machine (Explore); The form translator: one fact, two ways to write it (Translator)" },
    "38":{ idea:"A log is an exponent; `log_b x` needs `x > 0`; vertical asymptote `x = 0`; passes through `(1, 0)` and `(b, 1)`.",
      look:"Power ladder (Explore); From ladder to graph: the features of `y = log_b x` (Features)" },
    "39":{ idea:"`y = a log_b[k(x - d)] + c`: the asymptote moves to `x = d`; map key points.",
      look:"Domain wall (Explore); Wall, domain and key points by hand (By hand)" },
    "40":{ idea:"`log_b(x^n) = n log_b x`; `log_b x = log x/log b`.",
      look:"Power stacker (Explore); Base bridge: change of base without a calculator (Change base)" },
    "41":{ idea:"`log_b(mn) = log_b m + log_b n`; `log_b(m/n) = log_b m - log_b n`; `log(m + n)` has no law.",
      look:"Multiply by adding lengths, the slide rule (Explore); Law or impostor? The log law clinic (Clinic)" },
    "42":{ idea:"Each unit is a factor of 10: compare by 10<sup>difference</sup>.",
      look:"The scale switcher (Explore); Same ratio, same rise (Ratios)" },
    "43":{ idea:"Common base, or take logs of both sides; count doubling or halving periods.",
      look:"Doubling timeline (Explore); Equation lab: two sides, one solution (Solve)" },
    "44":{ idea:"Combine, convert to exponential form, solve, then check every argument is positive.",
      look:"Domain gate (Explore); Root audit: kept, gained or lost? (Root audit)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Nine questions, one or two from each module in Chapters 6 and 7. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"37", goal:1,
          prompt:"Write `5^3 = 125` in logarithmic form.",
          options:[
            { t:"`log_5 125 = 3`", ok:true, why:"The base stays 5; the exponent 3 is the log’s value." },
            { t:"`log_3 125 = 5`", why:"3 is the exponent, not the base. " + M1 },
            { t:"`log_{125} 5 = 3`", why:"125 is the result, inside the log. " + M1 },
            { t:"`log_5 3 = 125`", why:"The log’s value is the exponent, 3. " + M1 }],
          hints:["`log_b y = x` means `b^x = y`.", "`b = 5`, `x = 3`, `y = 125`.", "`log_5 125 = 3`."] },
        { id:"d2", topic:"38", goal:2,
          prompt:"Evaluate `log_2(1/8)`.",
          options:[
            { t:"`-3`", ok:true, why:"`2^{-3} = 1/8`." },
            { t:"3", why:"`2^3 = 8`, not `1/8`." },
            { t:"`-1/3`", why:"The exponent is −3." },
            { t:"`1/3`", why:"`(1/8)` isn’t `2^{1/3}`." }],
          hints:["2 to what power is `1/8`?", "`1/8 = 2^{-3}`.", "−3."] },
        { id:"d3", topic:"38", goal:2,
          prompt:"What is the domain of `y = log_3 x`?",
          options:[
            { t:"`{x ∈ ℝ | x > 0}`", ok:true, why:"3 to any power is positive, so only positive `x` have a log." },
            { t:"`{x ∈ ℝ}`", why:M6 },
            { t:"`{x ∈ ℝ | x >= 0}`", why:"`log_3 0` is undefined. " + M6 },
            { t:"`{y ∈ ℝ | y > 0}`", why:"That’s the range of `3^x`, and it uses `y`." }],
          hints:["Which values can `3^y` take?", "Only positive values.", "`x > 0`."] },
        { id:"d4", topic:"39", goal:3,
          prompt:"What is the vertical asymptote of `y = 2 log(x - 4) + 1`?",
          options:[
            { t:"`x = 4`", ok:true, why:"The argument `x - 4` is 0 at `x = 4`." },
            { t:"`x = -4`", why:M8 },
            { t:"`y = 1`", why:"The log graph has no horizontal asymptote; `c = 1` shifts it up." },
            { t:"`x = 0`", why:"The shift moves the asymptote." }],
          hints:["Where is the argument 0?", "`x - 4 = 0`.", "`x = 4`."] },
        { id:"d5", topic:"40", goal:4,
          prompt:"Simplify `log_2 8^5`.",
          options:[
            { t:"15", ok:true, why:"`5 log_2 8 = 5 × 3`." },
            { t:"40", why:"That multiplies 8 × 5. " + M3 },
            { t:"243", why:"That’s `3^5`." },
            { t:"8", why:"`log_2 8 = 3`, times 5." }],
          hints:["Power law.", "`5 log_2 8`.", "15."] },
        { id:"d6", topic:"41", goal:5,
          prompt:"Evaluate `log_6 4 + log_6 9`.",
          options:[
            { t:"2", ok:true, why:"`log_6 36 = 2`." },
            { t:"`log_6 13`", why:"Adding logs multiplies the arguments. " + M2 },
            { t:"1", why:"`log_6 6 = 1`, but 4 × 9 = 36." },
            { t:"6", why:"`log_6 36 = 2`, not 6." }],
          hints:["Product law.", "`log_6(4 × 9)`.", "`log_6 36 = 2`."] },
        { id:"d7", topic:"42", goal:6,
          prompt:"Solution A has pH 3 and solution B has pH 6. How many times more acidic is A?",
          options:[
            { t:"1000", ok:true, why:"Each pH unit is a factor of 10: `10^3`." },
            { t:"3", why:"That’s the difference of the pH values. " + M4 },
            { t:"2", why:"That’s 6 ÷ 3. " + M4 },
            { t:"30", why:"That’s 3 × 10. " + M4 }],
          hints:["pH counts powers of 10.", "6 − 3 = 3 steps.", "`10^3` = 1000."] },
        { id:"d8", topic:"43", goal:7, fixedOrder:true,   // x-values in increasing order
          prompt:"Solve `2^{x + 1} = 32`.",
          options:[
            { t:"`x = 3`", why:"`x + 1 = 5` gives 4." },
            { t:"`x = 4`", ok:true, why:"`32 = 2^5`, so `x + 1 = 5`." },
            { t:"`x = 5`", why:"That’s `x + 1`." },
            { t:"`x = 16`", why:"That’s 32 ÷ 2." }],
          hints:["Write 32 as a power of 2.", "`2^5`.", "`x = 4`."] },
        { id:"d9", topic:"44", goal:8,
          prompt:"Solve `log_2 x + log_2(x - 2) = 3`.",
          options:[
            { t:"`x = 4`", ok:true, why:"`x(x - 2) = 8` gives `x = 4` or −2; −2 makes `log_2 x` undefined." },
            { t:"`x = 4` or `x = -2`", why:"`x = -2` makes `log_2 x` undefined. " + M5 },
            { t:"`x = -2`", why:"That’s the candidate to reject: it makes `log_2 x` undefined. " + M5 },
            { t:"`x = 5`", why:"Check: 5 × 3 = 15 ≠ 8." }],
          hints:["Combine the logs.", "`x^2 - 2x - 8 = 0`.", "4 (reject −2)."] }
      ]
    }
  },

  // ---------- Connect: exponential ↔ logarithm concept map (N18 connection builder, rendered by app.connect) ----------
  connect:{
    heading:"Exponential ↔ logarithm concept map",
    intro:"Chapters 6 and 7 taught eight tools. A concept map shows they’re one idea seen from different sides: every log fact is an exponent fact, and every log equation’s danger comes from the domain. Link the cards to build the map.",
    summary:"Concept map",
    how:"The highlighted card is already chosen. Tap the card it links to, then press Link.",
    ui:{ exp:"Exponent side", log:"Logarithm side", use:"Tools and uses", link:"Link", clear:"Clear", card2:"tap a card", arrow:"↔",
      needAll:"Tap a second card first.", notStem:"This link starts from §1. Keep it as one of your two cards.",
      linked:"✓ Linked:", done:"All eight links made." },
    cards:{
      exp:[
        { id:"e_form", t:"`b^x = y`" },
        { id:"e_prod", t:"`b^m · b^n = b^{m + n}`" },
        { id:"e_pow", t:"`(b^m)^n = b^{mn}`" },
        { id:"e_range", t:"range of `b^x`: `y > 0`" },
        { id:"e_ha", t:"horizontal asymptote `y = 0`" }],
      log:[
        { id:"l_form", t:"`log_b y = x`" },
        { id:"l_prod", name:"product law", t:"`log_b(mn) = log_b m + log_b n`" },
        { id:"l_pow", name:"power law", t:"`log_b(x^n) = n log_b x`" },
        { id:"l_cob", name:"change of base", t:"`log_b x = log x/log b`" },
        { id:"l_dom", t:"domain of `log_b x`: `x > 0`" },
        { id:"l_va", t:"vertical asymptote `x = 0`" },
        { id:"l_com", t:"common log: each step of 1 is ×10" }],
      use:[
        { id:"u_refl", t:"reflection in `y = x`" },
        { id:"u_solve", t:"solving `3^x = 20`" },
        { id:"u_ext", t:"extraneous roots" },
        { id:"u_scale", t:"log scales (×10 per unit)" }]
    },
    challenges:[
      { id:"CM1", topics:["37"], goal:1, stem:"e_form",
        prompt:"Link `b^x = y` to its partner on the logarithm side.",
        answer:"l_form",
        why:{ l_form:"Same base, same exponent, same result: `log_b y = x` names the exponent that turns `b` into `y`." },
        ask:{ q:"How are `b^x = y` and `log_b y = x` linked? Tap one.",
          opts:[
            { t:"They say the same thing.", ok:true, why:M1 },
            { t:"One is the reciprocal of the other.", why:"Logs and exponentials are inverses, not reciprocals." }] },
        fb:{ def:"Which card uses the same three letters, `b`, `x` and `y`, written with a logarithm?" } },
      { id:"CM2", topics:["41"], goal:5, stem:"l_prod",
        prompt:"Link the <strong>product law</strong> to the exponent law it comes from.",
        answer:"e_prod",
        why:{ e_prod:"Multiplying powers adds exponents: `b^m · b^n = b^{m + n}`. Logs are exponents, so the log of a product is the sum of the logs." },
        fb:{ e_pow:"Multiplying numbers adds exponents: that’s the product law.",
          def:"Logs are exponents. Which exponent law adds exponents when you multiply?" } },
      { id:"CM3", topics:["40"], goal:4, stem:"l_pow",
        prompt:"Link the <strong>power law</strong> to the exponent law it comes from.",
        answer:"e_pow",
        why:{ e_pow:"A power of a power multiplies exponents: `(b^m)^n = b^{mn}`. So `log_b(x^n) = n log_b x`: the exponent comes out in front as a multiplier." },
        fb:{ e_prod:"That law adds exponents when you multiply: it’s behind the product law. Which law multiplies exponents?",
          def:M3 + " Which exponent law multiplies an exponent by `n`?" } },
      { id:"CM4", topics:["37", "38"], goal:[1, 2], stem:"e_ha",
        prompt:"Link the <strong>horizontal asymptote `y = 0`</strong> of `b^x` to its partner for `log_b x`.",
        answer:"l_va",
        why:{ l_va:"By reflection in `y = x`, which swaps `x` and `y`, the horizontal asymptote `y = 0` of `b^x` becomes the vertical asymptote `x = 0` of `log_b x`." },
        fb:{ u_refl:"The reflection is <em>how</em> they’re linked. Which feature of `log_b x` does the line `y = 0` turn into?",
          def:"Reflect the line `y = 0` in `y = x`. Which card is the line you get?" } },
      { id:"CM5", topics:["37", "38"], goal:[1, 2], stem:"e_range",
        prompt:"Link the <strong>range of `b^x`: `y > 0`</strong> to its partner for `log_b x`.",
        answer:"l_dom",
        why:{ l_dom:"Reflection in `y = x` swaps inputs and outputs, so the range `y > 0` of `b^x` becomes the domain `x > 0` of `log_b x`. " + M6 },
        fb:{ u_refl:"The reflection is how they’re linked. Which feature of `log_b x` does the range `y > 0` turn into?",
          def:M6 + " Which card says which `x` a log can take?" } },
      { id:"CM6", topics:["42"], goal:6, stem:"u_scale",
        prompt:"Link <strong>log scales</strong> to the idea that makes them work.",
        answer:"l_com",
        why:{ l_com:"pH, decibels and the Richter scale are built on the common log, base 10, so each step of 1 on the scale is a factor of 10." },
        fb:{ def:"Log scales count powers of 10. Which card is about base 10?" } },
      { id:"CM7", topics:["43", "40"], goal:[7, 4], stem:"u_solve",
        prompt:"Link <strong>solving `3^x = 20`</strong> to a tool that solves it.",
        answer:"l_pow|l_cob",
        why:{ l_pow:"Take log of both sides, then the power law: `x log 3 = log 20`, so `x = log 20/log 3`.",
          l_cob:"That works too: `3^x = 20` means `x = log_3 20`, and change of base gives `x = log 20/log 3`." },
        fb:{ l_prod:"There’s no product here; the unknown is an exponent.",
          def:"The unknown is an exponent. Which tool brings an exponent down?" } },
      { id:"CM8", topics:["44"], goal:8, stem:"u_ext", stretch:true,
        prompt:"Link <strong>extraneous roots</strong> to the idea that explains them, then choose the explanation.",
        answer:"l_dom",
        why:{ l_dom:"An extraneous root comes out of the algebra but makes some argument 0 or negative, so the original log is undefined there." },
        ask:{ q:"Which explanation goes with this link? Tap one.",
          opts:[
            { t:"A candidate must make every argument positive, even if the candidate itself is positive.", ok:true, why:M5 },
            { t:"Extraneous roots are the negative answers.", why:"Not just negatives: `log_2(x - 6)` rejects `x = 4`." }] },
        fb:{ e_range:"Close: the range of `b^x` becomes the domain of the log. Link to the logarithm side.",
          def:"An extraneous root fails in the original equation. Which card says which `x` a log can take?" } }
    ],
    onePage:{
      title:"The chapter on one page",
      intro:"The finished map, centred on the two equivalent forms. The exponent side and the logarithm side match up, fact for fact; the tools below use both.",
      centre:"`b^x = y ⟺ log_b y = x`",
      aria:"Graph of y = 2ˣ and y = log₂ x, mirror images in the dotted line y = x. The horizontal asymptote y = 0 of 2ˣ reflects to the vertical asymptote x = 0 of log₂ x.",
      expHead:"Exponent side", logHead:"Logarithm side", toolsHead:"Tools that use both",
      pairs:[
        { e:"`b^m · b^n = b^{m + n}`", link:"say the same thing", l:"product law: `log_b(mn) = log_b m + log_b n`", mods:"41" },
        { e:"`(b^m)^n = b^{mn}`", link:"say the same thing", l:"power law: `log_b(x^n) = n log_b x`", mods:"40" },
        { e:"range of `b^x`: `y > 0`", link:"reflection in `y = x`", l:"domain of `log_b x`: `x > 0`", mods:"37 and 38" },
        { e:"horizontal asymptote `y = 0`", link:"reflection in `y = x`", l:"vertical asymptote `x = 0`", mods:"37 and 38" }],
      tools:[
        { t:"<strong>Log scales</strong> use the common log: each step of 1 is ×10.", mods:"42" },
        { t:"<strong>Solving `3^x = 20`:</strong> take log of both sides, then the power law: `x = log 20/log 3`. Change of base gives the same answer.", mods:"43 and 40" },
        { t:"<strong>Extraneous roots:</strong> a candidate must make every argument positive, even if the candidate itself is positive.", mods:"44" },
        { t:"<strong>Change of base:</strong> `log_b x = log x/log b` turns any log into common logs.", mods:"40" }] }
  },

  // ---------- Mixed practice: 14 items in a fixed, interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Fourteen questions from every module in Chapters 6 and 7, mixed up on purpose, so you practise choosing the right idea. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Fourteen questions from all eight modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"43", goal:7, kind:"num", star:true,
            prompt:"A culture of 500 bacteria doubles every 3 h. When will it reach 8000?",
            label:"Time:", unit:"h", answer:12, display:"12 h", keypad:"decimal",
            why:"8000/500 = 16 = `2^4`: four doublings of 3 h is 12 h.",
            wrong:[{ match:16, fb:"8000/500 = 16 = `2^4`: four doublings of 3 h." }, { match:4, fb:"That’s the number of doublings. Each one takes 3 h." }],
            hints:["How many times larger than 500 is 8000?", "8000/500 = 16 = `2^4`: that’s 4 doublings.", "4 doublings × 3 h = 12 h."] },
          { id:"mp2", topic:"38", goal:2, kind:"num",
            prompt:"`log_4 64`?",
            label:"`log_4 64 =`", answer:3, display:"`log_4 64 = 3`", keypad:"decimal",
            why:"`4^3 = 64`.",
            wrong:[{ match:16, fb:"That’s 64 ÷ 4. Ask: 4 to what power gives 64?" }],
            hints:["4 to what power gives 64?", "`4^2 = 16`, so try the next power.", "`4^3 = 64`, so `log_4 64 = 3`."] },
          { id:"mp3", topic:"41", goal:5, kind:"mc",
            prompt:"Which equals `log(x^2 y/z)`?",
            options:[
              { t:"`2 log x + log y - log z`", ok:true, why:"Product law for `x^2 y`, quotient law for dividing by `z`, then the power law brings the 2 out in front." },
              { t:"`log 2x + log y - log z`", why:M3 },
              { t:"`2 log x · log y/log z`", why:M2 },
              { t:"`(2 log x + log y)/log z`", why:M2 }],
            hints:["Split the product and the quotient first.", "`log(x^2 y/z) = log x^2 + log y - log z`.", "Power law: `log x^2 = 2 log x`, so it’s `2 log x + log y - log z`."] },
          { id:"mp4", topic:"37", goal:1, kind:"mc",
            prompt:"What is the inverse of `y = 3^x`?",
            options:[
              { t:"`y = log_3 x`", ok:true, why:"Swap `x` and `y`: `x = 3^y`, which in log form is `y = log_3 x`." },
              { t:"`y = 1/3^x`", why:"That’s the reciprocal." },
              { t:"`y = log_x 3`", why:M1 },
              { t:"`y = x^3`", why:"That swaps the base and the exponent. An inverse swaps `x` and `y`." }],
            hints:["Swap `x` and `y`.", "`x = 3^y`: now write it in log form.", "`y = log_3 x`."] },
          { id:"mp5", topic:"44", goal:8, kind:"num", star:true,
            prompt:"Solve `log_3(x + 6) - log_3(x - 2) = 2`.",
            label:"`x =`", answer:3, display:"`x = 3`", keypad:"decimal",
            why:"`(x + 6)/(x - 2) = 9`, so `x = 3`; check: `x - 2 = 1 > 0`.",
            wrong:[{ match:10, fb:"`log_3 A = 2` means `A = 3^2 = 9`, not 2." }, { match:3.6, fb:"`3^2 = 9`, not 6." },
              { match:-1.5, fb:"At `x = -1.5`, `x - 2` is negative. " + M5 }],
            hints:["Quotient law: make one log on the left.", "`log_3({x + 6}/{x - 2}) = 2`, so `{x + 6}/{x - 2} = 3^2 = 9`.", "`x + 6 = 9x - 18`, so `x = 3`. Check: `x + 6 = 9` and `x - 2 = 1` are both positive."] },
          { id:"mp6", topic:"39", goal:3, kind:"mc",
            prompt:"`y = log_2(-x)` is the reflection of `y = log_2 x` in…",
            options:[
              { t:"the `y`-axis", ok:true, why:"Replacing `x` with `-x` reflects the graph in the `y`-axis." },
              { t:"the `x`-axis", why:"That’s `-log_2 x`." },
              { t:"the line `y = x`", why:"That’s `2^x`." },
              { t:"the origin", why:"That’s `-log_2(-x)`: both signs change." }],
            hints:["Is the minus sign with `x`, inside the log, or in front of the log?", "A change to `x` inside the log is horizontal.", "`x → -x` reflects in the `y`-axis."] },
          { id:"mp7", topic:"42", goal:6, kind:"num", star:true,
            prompt:"A concert speaker measures 90 dB and a busy office 60 dB. The speaker’s sound is how many times as intense?",
            label:"Times as intense:", answer:1000, display:"1000 times", keypad:"decimal",
            why:"90 − 60 = 30 dB, and every 10 dB is a factor of 10: `10^3` = 1000.",
            wrong:[{ match:30, fb:"Every 10 dB is a factor of 10: 30 dB is `10^3`." }, { match:1.5, fb:"Every 10 dB is a factor of 10: 30 dB is `10^3`." }],
            hints:["Find the difference in decibels.", "30 dB is three steps of 10 dB.", "Each 10 dB is ×10: `10^3` = 1000."] },
          { id:"mp8", topic:"40", goal:4, kind:"mc", star:true, fixedOrder:true,   // estimates in increasing order
            prompt:"Which is the best estimate of `log_2 3`?", use:"`log 2 ≈ 0.301`, `log 3 ≈ 0.477`",
            options:[
              { t:"about 0.18", why:"That’s `log 3 - log 2`." },
              { t:"about 0.63", why:"That’s `log 2/log 3`." },
              { t:"exactly 1.5", why:"3 isn’t `2^{1.5} ≈ 2.83`." },
              { t:"about 1.58", ok:true, why:"Change of base: `log_2 3 = log 3/log 2 ≈ 0.477/0.301 ≈ 1.58`." }],
            hints:["Change of base: `log_2 3 = log 3/log 2`.", "`2 < 3 < 4`, so the answer is between 1 and 2.", "`0.477/0.301 ≈ 1.58`."] },
          { id:"mp9", topic:"43", goal:7, kind:"num",
            prompt:"Solve `9^x = 27`.",
            label:"`x =`", answer:1.5, display:"`x = 3/2`",
            why:"`9^x = 3^{2x}` and `27 = 3^3`, so `2x = 3`.",
            wrong:[{ match:3, fb:"`9^x = 3^{2x}`, so `2x = 3`." }],
            hints:["Write both sides as powers of 3.", "`3^{2x} = 3^3`.", "`2x = 3`, so `x = 3/2`."] },
          { id:"mp10", topic:"38", goal:2, kind:"mc",
            prompt:"Which point is on `y = log_5 x`?",
            options:[
              { t:"`(1/5, -1)`", ok:true, why:"`log_5(1/5) = -1`, because `5^{-1} = 1/5`." },
              { t:"`(-1, 1/5)`", why:"Swapped: that’s on `5^x`." },
              { t:"`(5, 0)`", why:"`log_5 5 = 1`." },
              { t:"`(0, 1)`", why:"`log_5 0` is undefined." }],
            hints:["For each point, ask: is `5^y = x`?", "`5^{-1} = 1/5`.", "`(1/5, -1)`."] },
          { id:"mp11", topic:"41", goal:5, kind:"num", star:true,
            prompt:"`log_2 40 - log_2 5`?",
            label:"`log_2 40 - log_2 5 =`", answer:3, display:"`log_2 40 - log_2 5 = 3`", keypad:"text",
            why:"Quotient law: `log_2(40/5) = log_2 8 = 3`.",
            wrong:[{ match:35, fb:"That subtracts the arguments. " + M2 }],
            logWrong:{ has:"35", fb:"`log_2 35` subtracts the arguments. " + M2 },
            hints:["Quotient law.", "`log_2(40/5) = log_2 8`.", "`log_2 8 = 3`."] },
          { id:"mp12", topic:"44", goal:8, kind:"num",
            prompt:"Solve `log x = 3`.",
            label:"`x =`", answer:1000, display:"`x = 1000`", keypad:"decimal",
            why:"`log x` is base 10, and `log x = 3` means `10^3 = x`.",
            wrong:[{ match:30, fb:"`log x = 3` means `10^3 = x`." }],
            hints:["`log x` means base 10.", "Convert: `10^3 = x`.", "`x = 1000`."] },
          { id:"mp13", topic:"39", goal:3, kind:"two", star:true,
            prompt:"For `y = log_3[3(x + 1)] - 2`, find the `x`-intercept and the vertical asymptote.",
            boxes:[{ label:"`x`-intercept: `x =`" }, { label:"Vertical asymptote: `x =`" }],
            answer:[2, -1], display:"`x`-intercept 2; asymptote `x = -1`",
            why:"`3(x + 1) = 3^2` gives `x = 2`; the argument is 0 at `x = -1`.",
            boxWrong:[
              { def:"At the `x`-intercept, `y = 0`: solve `log_3[3(x + 1)] = 2` by writing it in exponential form." },
              { match:[1], fb:M8, def:"The vertical asymptote is where the argument `3(x + 1)` is 0." }],
            hints:["For the intercept, set `y = 0`. For the asymptote, set the argument equal to 0.", "`log_3[3(x + 1)] = 2` means `3(x + 1) = 3^2 = 9`.", "`x + 1 = 3`, so the `x`-intercept is 2; `3(x + 1) = 0` at `x = -1`."] },
          { id:"mp14", topic:"37", goal:1, kind:"num", star:true,
            prompt:"If `f(x) = 2^x`, what is `f^{-1}(16)`?",
            label:"`f^{-1}(16) =`", answer:4, display:"`f^{-1}(16) = 4`", keypad:"text",
            why:"`f^{-1}(16) = log_2 16`: the exponent that gives 16, which is 4.",
            wrong:[{ match:1 / 16, fb:"`f^{-1}(16) = log_2 16`: the exponent that gives 16." }, { match:65536, fb:"`f^{-1}(16) = log_2 16`: the exponent that gives 16." }],
            hints:["`f^{-1}` undoes `f`: which input of `f` gives 16?", "Solve `2^x = 16`.", "`2^4 = 16`, so `f^{-1}(16) = 4`."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which concept-map link surprised you most?" },
      { id:"j2", q:"In your own words, why is every log law really an exponent law?" },
      { id:"j3", q:"Explain to a friend why a positive candidate can still be extraneous in a log equation." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across both chapters, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"37", goal:1,
        a:{ prompt:"Which is `log_4 64 = 3` in exponential form?",
          options:[
            { t:"`4^3 = 64`", ok:true, why:"The base stays 4, and the log’s value, 3, is the exponent." },
            { t:"`3^4 = 64`", why:M1 },
            { t:"`64^3 = 4`", why:M1 },
            { t:"`4^{64} = 3`", why:M1 }] },
        b:{ prompt:"Which is `log_9 3 = 1/2` in exponential form?",
          options:[
            { t:"`9^{1/2} = 3`", ok:true, why:"The base stays 9, and the log’s value, `1/2`, is the exponent: `√9 = 3`." },
            { t:"`(1/2)^9 = 3`", why:M1 },
            { t:"`3^{1/2} = 9`", why:M1 },
            { t:"`9^3 = 1/2`", why:M1 }] } },
      { id:"f2", cat:"K", topic:"38", goal:2,
        a:{ prompt:"Evaluate `log_3 81`.",
          options:[
            { t:"4", ok:true, why:"`3^4 = 81`." },
            { t:"27", why:"That’s 81 ÷ 3." },
            { t:"3", why:"`3^3 = 27`, not 81." },
            { t:"`1/4`", why:"Upside down: `3^4 = 81`, so the exponent is 4." }] },
        b:{ prompt:"Evaluate `log_2 32`.",
          options:[
            { t:"5", ok:true, why:"`2^5 = 32`." },
            { t:"16", why:"That’s 32 ÷ 2." },
            { t:"2", why:"2 is the base. Ask: 2 to what power gives 32?" },
            { t:"`1/5`", why:"Upside down: `2^5 = 32`, so the exponent is 5." }] } },
      { id:"f3", cat:"K", topic:"40", goal:4,
        a:{ prompt:"Which expression equals `log_5 12`?",
          options:[
            { t:"`{log 12}/{log 5}`", ok:true, why:"Change of base: `log_b x = log x/log b`." },
            { t:"`{log 5}/{log 12}`", why:"Upside down: the base goes on the bottom." },
            { t:"`log(12/5)`", why:"A quotient of two logs isn’t the log of a quotient. " + M2 },
            { t:"`log 12 - log 5`", why:"That’s `log(12/5)`, the log of a quotient. " + M2 }] },
        b:{ prompt:"Which expression equals `log_3 7`?",
          options:[
            { t:"`{log 7}/{log 3}`", ok:true, why:"Change of base: `log_b x = log x/log b`." },
            { t:"`{log 3}/{log 7}`", why:"Upside down: the base goes on the bottom." },
            { t:"`log(7/3)`", why:"A quotient of two logs isn’t the log of a quotient. " + M2 },
            { t:"`log 7 - log 3`", why:"That’s `log(7/3)`, the log of a quotient. " + M2 }] } },
      { id:"f4", cat:"K", topic:"41", goal:5,
        a:{ prompt:"Evaluate `log_2 12 - log_2 3`.",
          options:[
            { t:"2", ok:true, why:"`log_2 4`: the quotient law gives `log_2(12 ÷ 3) = log_2 4 = 2`." },
            { t:"`log_2 9`", why:"That subtracts the arguments. " + M2 },
            { t:"4", why:"That’s the argument, 12 ÷ 3." },
            { t:"`{log_2 12}/{log_2 3}`", why:"That divides the logs. " + M2 }] },
        b:{ prompt:"Evaluate `log_3 6 + log_3 4.5`.",
          options:[
            { t:"3", ok:true, why:"`log_3 27`: 6 × 4.5 = 27, and `3^3 = 27`." },
            { t:"`log_3 10.5`", why:"That adds the arguments. " + M2 },
            { t:"27", why:"That’s the argument." },
            { t:"`(log_3 6)(log_3 4.5)`", why:"That multiplies the logs. " + M2 }] } },
      { id:"f5", cat:"T", topic:"39", goal:3,
        a:{ prompt:"For `y = -log_2(x + 3) + 1`, what is the domain, and where does the point `(1, 0)` of `y = log_2 x` go?",
          options:[
            { t:"Domain `x > -3`; `(-2, 1)`", ok:true, why:"`x + 3 > 0`; `(1, 0) → (1 - 3, -0 + 1)`." },
            { t:"Domain `x > 3`; `(4, 1)`", why:M8 },
            { t:"Domain `x > -3`; `(-2, -1)`", why:"The reflection makes −0 = 0; then +1." },
            { t:"Domain `x < -3`; `(-4, 1)`", why:"The argument must be positive: `x > -3`." }] },
        b:{ prompt:"For `y = 2 log_3(x - 1) - 5`, what is the domain, and where does the point `(3, 1)` of `y = log_3 x` go?",
          options:[
            { t:"Domain `x > 1`; `(4, -3)`", ok:true, why:"`(3 + 1, 2 × 1 - 5)`." },
            { t:"Domain `x > -1`; `(2, -3)`", why:M8 },
            { t:"Domain `x > 1`; `(4, 2)`", why:"Multiply by 2, then subtract 5: 2 − 5." },
            { t:"Domain `x > 1`; `(4, -8)`", why:"That subtracts first: 2(1 − 5)." }] } },
      { id:"f6", cat:"T", topic:"43", goal:7,
        a:{ fixedOrder:true, prompt:"Solve `3^{2x - 1} = 1/27`.",   // x-values in increasing order
          options:[
            { t:"`x = -2`", why:"`2x = -2` gives −1." },
            { t:"`x = -1`", ok:true, why:"`1/27 = 3^{-3}`, so `2x - 1 = -3`." },
            { t:"`x = 1`", why:"Both slips: `1/27` is `3^{-3}`, not `3^3`, and moving the −1 across makes it +1." },
            { t:"`x = 2`", why:"`1/27` is `3^{-3}`, not `3^3`." }] },
        b:{ fixedOrder:true, prompt:"Solve `5^{x + 2} = 1/125`.",
          options:[
            { t:"`x = -5`", ok:true, why:"`1/125 = 5^{-3}`, so `x + 2 = -3`." },
            { t:"`x = -1`", why:"`x + 2 = -3` gives −5." },
            { t:"`x = 1`", why:"`1/125` is `5^{-3}`." },
            { t:"`x = 5`", why:"Both slips: `1/125` is `5^{-3}`, not `5^3`, and moving the +2 across makes it −2." }] } },
      { id:"f7", cat:"T", topic:"44", goal:8,
        a:{ prompt:"Solve `log_2(x + 2) + log_2(x - 4) = 4`.",
          options:[
            { t:"`x = 6`", ok:true, why:"`(x + 2)(x - 4) = 16` gives `x = 6` or −4; −4 makes both arguments negative." },
            { t:"`x = 6` or `x = -4`", why:"`x = -4` makes both arguments negative. " + M5 },
            { t:"`x = -4`", why:"That’s the candidate to reject: it makes both arguments negative. " + M5 },
            { t:"`x = 10`", why:"Check: 12 × 6 = 72 ≠ 16." }] },
        b:{ prompt:"Solve `log_3(x - 2) + log_3(x + 6) = 2`.",
          options:[
            { t:"`x = 3`", ok:true, why:"`(x - 2)(x + 6) = 9` gives `x = 3` or −7; −7 makes both arguments negative." },
            { t:"`x = 3` or `x = -7`", why:"`x = -7` makes both arguments negative. " + M5 },
            { t:"`x = -7`", why:"That’s the candidate to reject: it makes both arguments negative. " + M5 },
            { t:"`x = 5`", why:"Check: 3 × 11 ≠ 9." }] } },
      { id:"f8", cat:"T", topic:"41", goal:5,
        a:{ prompt:"Which single log equals `log 50 + log 2 - log 4`?",
          options:[
            { t:"`log 25`", ok:true, why:"50 × 2 ÷ 4 = 25." },
            { t:"`log 48`", why:"That adds and subtracts the arguments. " + M2 },
            { t:"`log 12.5`", why:"That forgets + `log 2`." },
            { t:"`(log 100)/(log 4)`", why:"Subtracting logs divides the arguments inside one log." }] },
        b:{ prompt:"Which single log equals `log 36 - log 3 + log 2`?",
          options:[
            { t:"`log 24`", ok:true, why:"36 ÷ 3 × 2 = 24." },
            { t:"`log 35`", why:"That subtracts and adds the arguments. " + M2 },
            { t:"`log 6`", why:"That subtracts `log 2` instead of adding it: 36 ÷ 3 ÷ 2." },
            { t:"`(log 72)/(log 3)`", why:"Subtracting logs divides the arguments inside one log." }] } },
      { id:"f9", cat:"C", topic:"38", goal:2,
        a:{ prompt:"Which is the best explanation of why `log_2(-4)` is undefined?",
          options:[
            { t:"“2 raised to any real power is positive, so no exponent gives −4.”", ok:true, why:"`log_2(-4)` asks for the exponent that turns 2 into −4, and every power of 2 is positive." },
            { t:"“Because −4 is not a power of 2.”", why:"−4 = −(2²), but no power of 2 is negative." },
            { t:"“Because logs of even numbers are undefined.”", why:"`log_2 4 = 2`." },
            { t:"“Because the answer would be −2.”", why:"`2^{-2} = 1/4`, not −4." }] },
        b:{ prompt:"Which is the best explanation of why `log_b 1 = 0` for every base `b`?",
          options:[
            { t:"“`b^0 = 1` for every base `b > 0`, `b != 1`, so the exponent that gives 1 is 0.”", ok:true, why:"`log_b 1` asks which exponent turns `b` into 1, and that’s always 0." },
            { t:"“Because log of anything small is 0.”", why:"`log_b(1/2)` isn’t 0." },
            { t:"“Because 1 is the base.”", why:"The base is `b`." },
            { t:"“Because `log_b 1 = 1/b`.”", why:"`b^{1/b}` isn’t 1." }] } },
      { id:"f10", cat:"C", topic:"44", goal:8,
        a:{ prompt:"Solving `log x + log(x - 3) = 1` leads to `x^2 - 3x - 10 = 0`, so `x = 5` or `x = -2`. Which statement is correct?",
          options:[
            { t:"“Only `x = 5` is a solution: `x = -2` makes `log x` undefined.”", ok:true, why:"`x = 5` makes both arguments positive (5 and 2); `x = -2` doesn’t." },
            { t:"“Both are solutions, because both solve the quadratic.”", why:M5 },
            { t:"“Neither is a solution, because one is negative.”", why:"Check each separately." },
            { t:"“Only `x = -2`, because `log(x - 3)` needs `x < 3`.”", why:"It needs `x > 3`." }] },
        b:{ prompt:"Solving `log_2 x + log_2(x + 2) = 3` leads to `x^2 + 2x - 8 = 0`, so `x = 2` or `x = -4`. Which statement is correct?",
          options:[
            { t:"“Only `x = 2` is a solution: `x = -4` makes both arguments negative.”", ok:true, why:"`x = 2` gives `log_2 2 + log_2 4 = 1 + 2 = 3`." },
            { t:"“Both are solutions.”", why:M5 },
            { t:"“Neither is a solution.”", why:"Check each separately: `x = 2` makes both arguments positive." },
            { t:"“Only `x = -4`.”", why:"`log_2 x` needs `x > 0`." }] } },
      { id:"f11", cat:"C", topic:"42", goal:6,
        a:{ prompt:"Earthquake A has magnitude 6.2 and earthquake B has magnitude 4.2. Which best describes how they compare?",
          options:[
            { t:"“A’s shaking amplitude is `10^2` = 100 times B’s, because each unit on the Richter scale is a factor of 10.”", ok:true, why:"6.2 − 4.2 = 2 units, and each unit is a factor of 10." },
            { t:"“A is 2 times as strong (6.2 − 4.2).”", why:"That’s the difference of the magnitudes. " + M4 },
            { t:"“A is about 1.5 times as strong (6.2 ÷ 4.2).”", why:"That divides the magnitudes. " + M4 },
            { t:"“A is 20 times as strong.”", why:"That’s 2 × 10. " + M4 }] },
        b:{ prompt:"Solution A has pH 2.5 and solution B has pH 5.5. Which best describes how they compare?",
          options:[
            { t:"“A is `10^3` = 1000 times as acidic, because each pH unit is a factor of 10.”", ok:true, why:"5.5 − 2.5 = 3 units, and each unit is a factor of 10." },
            { t:"“A is 3 times as acidic.”", why:"That’s the difference of the pH values. " + M4 },
            { t:"“A is 2.2 times as acidic (5.5 ÷ 2.5).”", why:"That divides the pH values. " + M4 },
            { t:"“A is 30 times as acidic.”", why:"That’s 3 × 10. " + M4 }] } },
      { id:"f12", cat:"A", topic:"43", goal:7,
        a:{ fixedOrder:true, prompt:"A radioactive sample’s mass halves every 8 days. How long until 400 g becomes 25 g?",   // times in increasing order
          options:[
            { t:"4 days", why:"That’s the number of half-lives. " + M7a },
            { t:"16 days", why:"16 is the ratio 400/25, not a time. " + M7a },
            { t:"32 days", ok:true, why:"400 → 200 → 100 → 50 → 25: 4 half-lives of 8 days." },
            { t:"48 days", why:"That’s 6 half-lives: 400/64." }] },
        b:{ fixedOrder:true, prompt:"A car loses half its value every 4 years. How long until $32 000 becomes $4000?",
          options:[
            { t:"3 years", why:"That’s the number of halvings. " + M7b },
            { t:"8 years", why:"8 is the ratio 32 000/4000, not a time. " + M7b },
            { t:"12 years", ok:true, why:"3 halvings: 32 000 → 16 000 → 8000 → 4000." },
            { t:"16 years", why:"That’s 4 halvings, down to $2000." }] } },
      { id:"f13", cat:"A", topic:"42", goal:6,
        a:{ fixedOrder:true, prompt:"Loudness is `L = 10 log(I/I_0)` dB. A sound is 1000 times as intense as another. How many decibels louder is it?",   // levels in increasing order
          options:[
            { t:"3 dB", why:"That’s `log 1000`. Multiply by 10." },
            { t:"30 dB", ok:true, why:"`10 log 1000 = 10 × 3`." },
            { t:"300 dB", why:"`log 1000 = 3`, not 30." },
            { t:"1000 dB", why:DB }] },
        b:{ fixedOrder:true, prompt:"A sound is 100 000 times as intense as another. How many decibels louder is it?",
          options:[
            { t:"5 dB", why:"That’s `log 100 000`. Multiply by 10." },
            { t:"50 dB", ok:true, why:"`10 log 100 000 = 10 × 5`." },
            { t:"500 dB", why:"`log 100 000 = 5`, not 50." },
            { t:"100 000 dB", why:DB }] } },
      { id:"f14", cat:"A", topic:"40", goal:4,
        a:{ prompt:"Between which two whole numbers is `log_2 10`, and which is it closer to?", use:"`log 2 ≈ 0.301`",
          options:[
            { t:"Between 3 and 4, closer to 3", ok:true, why:"`2^3 = 8 < 10 < 16 = 2^4`; `log_2 10 = 1/log 2 ≈ 3.32`." },
            { t:"Between 3 and 4, closer to 4", why:"`1/0.301 ≈ 3.3`." },
            { t:"Between 0 and 1", why:"That’s `log 2`." },
            { t:"Between 4 and 5", why:"`2^4 = 16 > 10`." }] },
        b:{ prompt:"Between which two whole numbers is `log_3 20`, and which is it closer to?", use:"`log 2 ≈ 0.301`, `log 3 ≈ 0.477`",
          options:[
            { t:"Between 2 and 3, closer to 3", ok:true, why:"9 < 20 < 27; `log 20/log 3 ≈ 1.301/0.477 ≈ 2.73`." },
            { t:"Between 2 and 3, closer to 2", why:"`1.301/0.477 ≈ 2.7`, which is nearer 3." },
            { t:"Between 6 and 7", why:"That’s 20 ÷ 3." },
            { t:"Between 1 and 2", why:"`3^2 = 9 < 20`." }] } },
      { id:"f15", cat:"A", topic:"43", goal:7,
        a:{ prompt:"$1000 is invested at 6% per year, compounded annually. Which equation gives the number of years `n` to reach $2000, and what’s the best estimate?", use:"`log 2 ≈ 0.301`, `log 1.06 ≈ 0.0253`",
          options:[
            { t:"`1.06^n = 2`; about 12 years", ok:true, why:"`n = log 2/log 1.06 ≈ 0.301/0.0253 ≈ 11.9`." },
            { t:"`1.06^n = 2`; about 33 years", why:"That’s 2 ÷ 0.06." },
            { t:"`1000 + 60n = 2000`; about 17 years", why:"That’s simple interest." },
            { t:"`2^n = 1.06`; about 0.08 years", why:"Upside down." }] },
        b:{ prompt:"$500 is invested at 8% per year, compounded annually. Which equation gives the number of years `n` to reach $1000, and what’s the best estimate?", use:"`log 2 ≈ 0.301`, `log 1.08 ≈ 0.0334`",
          options:[
            { t:"`1.08^n = 2`; about 9 years", ok:true, why:"0.301/0.0334 ≈ 9.0." },
            { t:"`1.08^n = 2`; about 25 years", why:"That’s 2 ÷ 0.08." },
            { t:"`500 + 40n = 1000`; about 12.5 years", why:"Simple interest." },
            { t:"`2^n = 1.08`; about 0.11 years", why:"Upside down." }] } }
    ]
  },

  task:{
    title:"A positive root that fails", summary:"A positive root that fails",
    statement:"<p>Build a log equation `log_2(x + p) + log_2(x + q) = r` that meets every check. The surprise: the root you reject must be <strong>positive</strong>.</p><p class=\"tiny muted\">Choose whole numbers `p` and `q` from −6 to 6, with `p < q`, and `r` from 1 to 5. The tool shows the quadratic `(x + p)(x + q) = 2^r`, its roots, and each root’s arguments.</p>",
    checks:[
      "The quadratic has two real roots, both integers",
      "Exactly one root is a solution",
      "The solution is positive",
      "`p < q`",
      "The rejected root is a positive number"],
    tips:[
      "",
      "Check each root in both arguments.",
      "",
      "",
      "Make the arguments’ shift big and negative, e.g. `log_2(x - 6)`: then `x = 4` is rejected though it’s positive."],
    tipNow:[
      "Right now the roots are {roots}.",
      "Right now {sol}.",
      "Right now the solution is {s}.",
      "Right now `p` = {p} and `q` = {q}.",
      "Right now the rejected root is {x}."],
    ui:{ how:"Type whole numbers, or step with − and +.", eq:"Your equation", quad:"Quadratic", roots:"Roots", gate:"Domain gate: where both arguments are positive",
      root:"Root", verdict:"Verdict", sol:"✓ solution", rej:"✗ rejected", notInt:"not integers", none:"no root is a solution", two:"both roots are solutions",
      one:"one root is a solution", invalid:"Enter whole numbers: `p` and `q` from −6 to 6, and `r` from 1 to 5." },
    explainPrompt:"Explain why your rejected root fails even though it’s positive.",
    success:"Your equation passes all five checks.",
    more:"There’s more than one answer. Can you find another?",
    all8:"That’s all eight designs. In every one, both arguments are negative at the rejected root, even though the root itself is positive."
  },

  cards:[
    ["`log_b y = x`", "means `b^x = y`."],
    ["Inverse of `y = b^x`", "`y = log_b x`: the reflection in `y = x`."],
    ["Features of `y = log_b x` (`b > 1`)", "Domain `x > 0`; range all reals; vertical asymptote `x = 0`; through `(1, 0)` and `(b, 1)`; increasing."],
    ["`log x`", "The common log, base 10."],
    ["`log_b 1` and `log_b b`", "0 and 1."],
    ["Transformations", "`y = a log_b[k(x - d)] + c`: asymptote `x = d`."],
    ["Product law", "`log_b(mn) = log_b m + log_b n`."],
    ["Quotient law", "`log_b(m/n) = log_b m - log_b n`."],
    ["Power law", "`log_b(m^n) = n log_b m`."],
    ["Change of base", "`log_b x = log x/log b`."],
    ["Impostor", "`log(m + n) != log m + log n`."],
    ["Log scales", "Each unit is a factor of 10: compare with 10<sup>difference</sup>."],
    ["Exponential equations", "Same base: equate exponents. Otherwise take logs and use the power law."],
    ["Log equations", "Combine, convert, solve, then check every argument is positive."]
  ]
};
