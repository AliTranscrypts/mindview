// MCV4U 16 Maximum and Minimum on an Interval. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/16-maximum-and-minimum-on-an-interval.md
// misconception core sentences (plan §3)
const M1 = "On a closed interval the endpoints are always candidates.";
const M4 = (x, f) => "`x = " + x + "` is where it happens. The maximum value is `" + f + "`.";

export default {
  id:"16-maximum-and-minimum-on-an-interval",
  kind:"topic",
  title:"Maximum and minimum on an interval",
  topic:"Maximum and Minimum on an Interval",
  readyTopic:"maximum and minimum on an interval",
  hero:{
    eq:"candidates = {`a`, `b`} ∪ {critical numbers in `(a, b)`} ⟶ compare `f`-values",
    eqLabel:"candidates equal the endpoints a and b, together with the critical numbers in the open interval from a to b; then compare the f-values",
    eqSize:"sm",
    headline:"The highest point might be at the edge",
    text:"On a <strong>closed interval</strong>, a continuous function always reaches an <strong>absolute maximum</strong> and an <strong>absolute minimum</strong>. They can only occur at the <strong>endpoints</strong> or at <strong>critical numbers</strong> inside the interval. Find every candidate, evaluate the function there, and compare.",
    fig:{ html:'<canvas class="plot mm-hplot" id="hero-plot" role="img" aria-label="The graph of f(x) = x³ − 3x² − 9x + 5 between walls at x = −2 and x = 5, with its candidates and their values."></canvas>' +
      '<div class="mm-htab" id="mm-htab" aria-hidden="true"></div>', caption:"" }
  },
  goals:[
    "I can list the candidates for absolute extrema on `[a, b]`: the endpoints and the critical numbers inside the interval.",
    "I can evaluate `f` at every candidate and report the absolute maximum and minimum values and where they occur.",
    "I can explain when absolute extrema must exist (continuous on a closed interval) and when they might not (open intervals).",
    "I can include critical numbers where `f′` does not exist, and explain why an endpoint can beat a local maximum or minimum.",
    "I can work backwards from a known absolute maximum or minimum to find a missing constant.",
    "I can find and interpret absolute extrema in a context over a fixed window, with units."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Derivatives", goal:1, prompt:"If `f(x) = x^3 - 6x^2 + 5`, what is `f′(x)`?",
          options:[
            { t:"`3x^2 - 12x`", ok:true, why:"Power rule term by term; the constant’s derivative is 0." },
            { t:"`3x^2 - 12x + 5`", why:"The derivative of 5 is 0." },
            { t:"`x^2 - 6x`", why:"`x^3 -> 3x^2`." },
            { t:"`3x^3 - 12x^2`", why:"`x^n -> nx^{n-1}`." }],
          hints:["Differentiate each term.", "`x^3 -> 3x^2`, `-6x^2 -> -12x`.", "`3x^2 - 12x`."] },
        { id:"w2", skill:"Derivatives", goal:4, prompt:"If `f(x) = (x - 1)^{2/3}`, what is `f′(x)`?",
          options:[
            { t:"`{2}/{3}(x - 1)^{-1/3}`", ok:true, why:"Power rule with the chain rule; the inner derivative is 1." },
            { t:"`{2}/{3}(x - 1)^{1/3}`", why:"`{2}/{3} - 1 = -{1}/{3}`." },
            { t:"`{3}/{2}(x - 1)^{-1/3}`", why:"Bring down `{2}/{3}`." },
            { t:"`{2}/{3}x^{-1/3}`", why:"Keep `(x - 1)`." }],
          hints:["Power rule: bring down `{2}/{3}`, subtract 1.", "`{2}/{3} - 1 = -{1}/{3}`.", "`{2}/{3}(x - 1)^{-1/3}`."] },
        { id:"w3", skill:"Solving f′ = 0", goal:1, prompt:"Solve `3x^2 - 6x - 9 = 0`.",
          options:[
            { t:"`x = -1` or `x = 3`", ok:true, why:"`3(x - 3)(x + 1) = 0`." },
            { t:"`x = 1` or `x = -3`", why:"`x - 3 = 0` gives 3." },
            { t:"`x = 3` only", why:"`x + 1 = 0` too." },
            { t:"`x = 0` or `x = 2`", why:"−9 is still there." }],
          hints:["Take out the 3.", "`x^2 - 2x - 3 = (x - 3)(x + 1)`.", "−1 or 3."] },
        { id:"w4", skill:"Solving f′ = 0", goal:1, prompt:"Which `x`-values make `f′(x) = 4x^3 - 16x` equal to 0?",
          options:[
            { t:"`x = -2`, 0, 2", ok:true, why:"`4x(x - 2)(x + 2) = 0`." },
            { t:"`x = ±2`", why:"`x = 0` is a solution too." },
            { t:"`x = ±4`", why:"`x^2 = 4`, not 16." },
            { t:"`x = 0`, 4", why:"`4x^3 - 16x = 4x(x^2 - 4)`." }],
          hints:["Common factor `4x`.", "`4x(x^2 - 4)`.", "0, ±2."] },
        { id:"w5", skill:"Evaluate and compare", goal:2, prompt:"`f(x) = x^3 - 12x`. Which is largest: `f(-2)`, `f(2)` or `f(5)`?",
          options:[
            { t:"`f(5) = 65`", ok:true, why:"`f(-2) = 16`, `f(2) = -16`, `f(5) = 125 - 60 = 65`." },
            { t:"`f(-2) = 16`", why:"Compute all three." },
            { t:"`f(2) = -16`", why:"−16 is the smallest." },
            { t:"They’re equal.", why:"16, −16 and 65 differ." }],
          hints:["Substitute each value.", "`(-2)^3 - 12(-2) = -8 + 24`.", "65 is largest."] },
        { id:"w6", skill:"Evaluate and compare", goal:3, prompt:"Which interval includes both of its endpoints?",
          options:[
            { t:"`[-1, 4]`", ok:true, why:"Square brackets include the endpoints." },
            { t:"`(-1, 4)`", why:"Round brackets exclude." },
            { t:"`[-1, 4)`", why:"4 is excluded." },
            { t:"`(-∞, 4]`", why:"−∞ isn’t a number; it has no endpoint to include." }],
          hints:["Which bracket means “included”?", "Square.", "`[-1, 4]`."] }
      ],
      refreshers:{
        "Derivatives":"Power rule term by term; constants vanish; for `(x - 1)^n` bring down `n`, lower the exponent and multiply by the inner derivative.",
        "Solving f′ = 0":"Common factor first, then factor the rest. Never divide by `x`: you lose `x = 0`.",
        "Evaluate and compare":"Substitute carefully with brackets, `(-2)^3 = -8`. Square brackets [ ] include an endpoint, round ones ( ) don’t."
      }
    }
  },
  explore:{
    heading:"Closed-interval hunter",
    intro:"Drag the walls to choose an interval. Every candidate lights up; the table tells you which one wins.",
    fns:[
      { id:"F1", chip:"F1 `f(x) = x^3 - 3x^2 - 9x + 5`" },
      { id:"F2", chip:"F2 `f(x) = x^4 - 8x^2 + 3`" },
      { id:"F3", chip:"F3 `f(x) = x^3 - 12x`" },
      { id:"F4", chip:"F4 `f(x) = (x - 1)^{2/3}`" },
      { id:"G", chip:"`g(x) = x^2 - 4x` (prediction 4)" }
    ],
    modes:[{ id:"show", t:"Show" }, { id:"hunt", t:"Hunt" }, { id:"open", t:"Open interval" }],
    modeHow:{
      show:"Every candidate is highlighted for you: the endpoints sit on the walls, the critical numbers inside sit between them, and a hollow dot marks a critical number outside the interval.",
      hunt:"Find the candidates yourself. Tap them on the graph, or choose them from the buttons below, then press <strong>Check</strong>. The table fills in with your choices.",
      open:"The walls become hollow: the endpoints are no longer in the interval, so their values are drawn as open circles and left out."
    },
    wallHow:"Drag a wall’s handle above the graph, or Tab to it and use the arrow keys (Shift + arrow moves it by 2).",
    rows:{ fn:"Function", interval:"Interval", crit:"Critical numbers of {f}", cand:"Candidates", table:"Table", max:"Absolute maximum", min:"Absolute minimum" },
    txt:{
      zero:"(`f′ = 0`)", dne:"(`f′` does not exist)", outside:"outside", notIn:"Outside the interval: {list}", wall:"On a wall, so it counts as an endpoint: {list}",
      none:"none: the values approach {v} but never reach it", noCrit:"none inside",
      excl:"the endpoints are excluded", hunt:"Find them, then press Check.",
      endTag:"endpoint", critTag:"critical number", openTag:"not included",
      huntPick:"Candidates you chose", huntNone:"Tap the graph or a button to choose a candidate.",
      huntGood:"<strong>✓ All the candidates.</strong> Compare their values: the table now names the winners.",
      missEnd:"You’re missing {xe}. " + M1,
      missCrit:"You’re missing {xe}: it’s a critical number inside the interval {why}.",
      extraOut:"{xe} isn’t in {iv}, so {fx} can’t be a value of {f} on this interval.",
      extraIn:"{xe} isn’t a candidate: {dfx} there and it isn’t an endpoint.",
      legend:"On a wall: endpoint · between the walls: critical number · hollow: outside or not included",
      tc3:"Challenge 3: your exact `b`", tc3how:"Type `b = □√□`. Leave the root box empty for a whole number.", yourB:"your b"
    },
    predIntro:"Make a prediction first. Then the hunter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"F1 on `[-2, 5]`. Where is the absolute maximum?",
        options:[{ t:"at both `x = -1` and `x = 5`", ok:true }, { t:"at `x = -1` only" }, { t:"at `x = 5` only" }, { t:"at `x = 3`" }],
        explain:"Two candidates tie at 10, so the maximum value 10 occurs at both." },
      { id:"p2", prompt:"F1 on `[0, 4]`. Where is the absolute maximum now?",
        options:[{ t:"at `x = 0`", ok:true }, { t:"at `x = -1`" }, { t:"at `x = 3`" }, { t:"at `x = 4`" }],
        explain:"`x = -1` is outside `[0, 4]`. Of the real candidates, `f(0) = 5` is largest." },
      { id:"p3", prompt:"F3 on `[-1, 3]`, then the right wall slides to 5. When `b` reaches 5, where is the absolute maximum?",
        options:[{ t:"at the right endpoint `x = 5`", ok:true }, { t:"still at `x = -1`" }, { t:"at `x = -2`" }, { t:"at `x = 2`" }],
        explain:"`x = -2` is outside the interval, and once `f(b)` passes `f(-1) = 11`, the endpoint wins." },
      { id:"p4", prompt:"Open mode, a new function `g(x) = x^2 - 4x` on `(0, 3)`. What is the absolute maximum on `(0, 3)`?",
        options:[{ t:"there is none", ok:true }, { t:"0, at `x = 0`" }, { t:"−3, at `x = 3`" }, { t:"−4, at `x = 2`" }],
        explain:"The values get as close to 0 as you like but never reach it, because `x = 0` isn’t in the interval. The minimum −4 at `x = 2` does exist." }
    ],
    chalIntro:"Use the hunter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 4], prompt:"F1: choose an interval that contains <strong>both</strong> critical numbers and whose absolute minimum occurs <strong>only at an endpoint</strong>.",
        why:"Left of `x = -3`, `f` drops below −22, so the endpoint `a` beats the local minimum `f(3) = -22`.",
        hints:["The local minimum value is −22. An endpoint must go lower.", "`f` falls as you go left of `x = -1`. Where is `f = -22` on the left?", "`f(-3) = -22`, so take `a = -3.5` or −4 and `b ≥ 3`."],
        msgs:{ fn:"Choose F1 first.", open:"Switch to Show or Hunt: on an open interval the endpoints aren’t included.",
          tie:"`f(-3) = -22` ties with `f(3)`: the minimum is also at the critical number.", b:"`x = 3` isn’t inside yet.",
          a:"`x = -1` isn’t inside yet.", high:"`f(a)` = {v} is above −22, so the minimum is still at the critical number `x = 3`." } },
      { id:"tc2", goal:[4, 5], prompt:"F4 `f(x) = (x - 1)^{2/3}`: choose `[a, b]` so that the absolute minimum is at a point where `f′` does not exist and the absolute maximum value is exactly 4.",
        why:"The cusp gives the lowest value, `f(1) = 0`, and the farther endpoint is 8 units from 1, where `f = 8^{2/3} = 4`.",
        hints:["Where is `f′` undefined?", "At `x = 1`, `f = 0`, the lowest possible value. The max is at an endpoint.", "`4 = (x - 1)^{2/3}` gives `x - 1 = ±8`: use `a = -7` or `b = 9`."],
        msgs:{ fn:"Choose F4 first.", open:"Switch to Show or Hunt: on an open interval the endpoints aren’t included.",
          cusp:"The cusp at `x = 1` must be inside the interval.", max:"`f = 4` when `(x - 1)^{2/3} = 4`, so `|x - 1| = 8`." } },
      { id:"tc3", goal:5, stretch:true, prompt:"F2 `f(x) = x^4 - 8x^2 + 3` on `[0, b]`. Find the <strong>largest</strong> `b` for which the absolute maximum value is still 3. Type it in the exact answer box under the readout.",
        why:"`b^4 - 8b^2 + 3 = 3` gives `b^2(b^2 - 8) = 0`, so `b = 2√2`. Past it, `f(b) > 3`.",
        hints:["The max stays 3 until `f(b)` climbs back above `f(0) = 3`.", "Solve `b^4 - 8b^2 + 3 = 3`.", "`b^2(b^2 - 8) = 0`, so `b = 2√2`."],
        msgs:{ empty:"Type your exact `b` in the box first.", bad:"Type whole numbers (or fractions) in the boxes.",
          two:"At `b = 2` the max is 3, but you can go further: `f` rises again after its minimum at 2.", three:"`f(3) = 12 > 3`.",
          small:"At `b` = {b} the max is still 3, but you can go further: `f(b)` = {v} is below 3.",
          big:"`f(b)` = {v} is above 3, so the max is no longer 3.", dec:"Close! Give the exact value, in the form □√□." } }
    ]
  },
  part3:{
    slug:"context", name:"Context",
    heading:"Extreme values in context",
    intro:"A real window (a day, a dose) makes the closed interval meaningful. Scrub the timeline, flip the candidate cards, and pick the extremes. Then try the quick check.",
    stageHow:"Drag the timeline slider (arrows move it 15 minutes). The shaded strip on the graph is the window.",
    cardHow:"Tap a card to flip it and see the value there.",
    stations:[
      { id:"s1", title:"Station 1: Greenhouse", kind:"green", lo:1, hi:7,
        text:"`T(t) = -t^3 + 12t^2 - 36t + 40` is the temperature (°C) in a greenhouse `t` hours after 6:00, for `1 ≤ t ≤ 7`.",
        cards:[{ t:1 }, { t:2 }, { t:6 }, { t:7 }],
        picks:[
          { id:"cool", q:"The coolest moment", opts:[{ t:"7:00" }, { t:"8:00", ok:true }, { t:"12:00" }, { t:"13:00" }],
            good:"Right. `T(2) = 8`: 8 °C at 8:00.", bad:"Compare all four cards: the coolest moment has the smallest `T`." },
          { id:"warm", q:"The warmest moment", opts:[{ t:"7:00" }, { t:"8:00" }, { t:"12:00", ok:true }, { t:"13:00" }],
            good:"Right. `T(6) = 40`: 40 °C at 12:00.", bad:"Compare all four cards: the warmest moment has the largest `T`." }
        ],
        alg:["`T′(t) = -3t^2 + 24t - 36 = -3(t - 2)(t - 6)`", "`T′ = 0` at `t = 2` and `t = 6`, both inside `1 ≤ t ≤ 7`.", "Candidates 1, 2, 6, 7: `T(1) = 15`, `T(2) = 8`, `T(6) = 40`, `T(7) = 33`."] },
      { id:"s2", title:"Station 2: A dose", kind:"dose", lo:0, hi:6,
        text:"`C(t) = {10t}/{t^2 + 4}` mg/L, `0 ≤ t ≤ 6` h.",
        cards:[{ t:-2, out:true }, { t:0 }, { t:2 }, { t:6 }],
        picks:[
          { id:"high", q:"The highest concentration", opts:[{ t:"at 0 h" }, { t:"at 2 h", ok:true }, { t:"at 6 h" }],
            good:"Right. Highest: 2.5 mg/L at 2 h.", bad:"Compare the cards: `C(2) = {5}/{2}` is the largest." },
          { id:"low", q:"The lowest concentration", opts:[{ t:"at 0 h", ok:true }, { t:"at 2 h" }, { t:"at 6 h" }],
            good:"Right. Lowest: 0 at the moment of the dose.", bad:"Compare the cards: `C(0) = 0` is the smallest." }
        ],
        alg:["Quotient rule: `C′(t) = {10(t^2 + 4) - 10t(2t)}/{(t^2 + 4)^2} = {10(4 - t^2)}/{(t^2 + 4)^2}`", "`C′ = 0` when `t^2 = 4`: `t = 2` (−2 is outside the window).", "Candidates 0, 2, 6: `C(0) = 0`, `C(2) = {5}/{2}`, `C(6) = {3}/{2}`."] },
      { id:"s3", title:"Station 3: A shorter window", kind:"green", lo:3, hi:5,
        text:"Station 1’s greenhouse, but only for `3 ≤ t ≤ 5`.",
        cards:[{ t:2, out:true }, { t:3 }, { t:5 }, { t:6, out:true }],
        banner:"No critical numbers inside? Then the endpoints decide.",
        picks:[
          { id:"high", q:"The warmest moment", opts:[{ t:"9:00" }, { t:"11:00", ok:true }, { t:"12:00", fb:"`t = 6` is outside this window." }],
            good:"Right. `T(5) = 35`: 35 °C at 11:00.", bad:"`T` is increasing all window long, so the end of the window is warmest." },
          { id:"low", q:"The coolest moment", opts:[{ t:"8:00", fb:"`t = 2` is outside `3 ≤ t ≤ 5`." }, { t:"9:00", ok:true }, { t:"11:00" }],
            good:"Right. `T(3) = 13`: 13 °C at 9:00.", bad:"`T` is increasing all window long, so the start of the window is coolest." }
        ],
        alg:["`T′(t) = -3(t - 2)(t - 6)`", "For `3 ≤ t ≤ 5`, `t - 2 > 0` and `t - 6 < 0`, so `T′(t) > 0`: `T` is increasing all window long.", "The critical numbers 2 and 6 are outside, so the endpoints decide: `T(3) = 13`, `T(5) = 35`."] }
    ],
    labels:{ outside:"outside the window", flip:"Flip", time:"Time", temp:"Temperature", conc:"Concentration", after:"after the dose" },
    quickCheck:{
      title:"Quick check", summary:"Extreme values in context quick check",
      items:[
        { id:"q1", goal:[2, 6], prompt:"Greenhouse, `1 ≤ t ≤ 7`: the warmest moment is …",
          choices:[
            { t:"12:00", ok:true, fb:"Right. `T(6) = 40` beats `T(7) = 33`; `t = 6` is 12:00." },
            { t:"13:00", fb:"`T(6) = 40` beats `T(7) = 33`; `t = 6` is 12:00." },
            { t:"8:00", fb:"`T(6) = 40` beats `T(7) = 33`; `t = 6` is 12:00." },
            { t:"6:00", fb:"`T(6) = 40` beats `T(7) = 33`; `t = 6` is 12:00." }] },
        { id:"q2", goal:[1, 6], prompt:"For the dose, why is `t = -2` ignored?",
          choices:[
            { t:"It’s outside `0 ≤ t ≤ 6`", ok:true, fb:"Right. `C′(-2) = 0`, but −2 hours isn’t in the window." },
            { t:"`C′(-2) ≠ 0`", fb:"`C′(-2) = 0`, but −2 hours isn’t in the window." },
            { t:"It gives the minimum", fb:"`C′(-2) = 0`, but −2 hours isn’t in the window." },
            { t:"Negative numbers can’t be critical", fb:"`C′(-2) = 0`, but −2 hours isn’t in the window." }] },
        { id:"q3", goal:[1, 6], prompt:"On `3 ≤ t ≤ 5` the highest temperature is …",
          choices:[
            { t:"35 °C", ok:true, fb:"Right. `t = 6` is outside this window; `T(5) = 35`." },
            { t:"40 °C", fb:"`t = 6` is outside this window; `T(5) = 35`." },
            { t:"33 °C", fb:"`t = 6` is outside this window; `T(5) = 35`." },
            { t:"13 °C", fb:"`t = 6` is outside this window; `T(5) = 35`." }] },
        { id:"q4", goal:[2, 6], prompt:"The greatest concentration is …",
          choices:[
            { t:"2.5 mg/L", ok:true, fb:"Right. The value is `C(2) = {5}/{2}`, at the time `t = 2` h." },
            { t:"2 mg/L", fb:"2 is the time. The value is `C(2) = {5}/{2}`." },
            { t:"1.5 mg/L", fb:"2 is the time. The value is `C(2) = {5}/{2}`." },
            { t:"6 mg/L", fb:"2 is the time. The value is `C(2) = {5}/{2}`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"cand", type:"custom", title:"Candidate table", summary:"Candidate table", star:true, goal:[1, 2, 4, 5],
        instruction:"Find the absolute maximum and minimum values and every place they occur. Items 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type each value, and every `x` where it occurs (separate two locations with a comma, such as 1, 4). Then press Check.",
        msgs:{ err:"Type numbers only, such as −15 or 1, 4.", fill:"Fill in every box first.", maxOk:"Your maximum is right; check the minimum.", minOk:"Your minimum is right; check the maximum.",
          valOk:"The values are right; check where each one occurs. A value can occur at more than one `x`.", general:"Compare `f` at every candidate: the endpoints and the critical numbers inside the interval." },
        items:[
          { id:"s1", goal:[1, 2], prompt:"`f(x) = x^3 - 3x` on `[0, 2]`", kind:"mm",
            answer:{ maxV:2, maxX:[2], minV:-2, minX:[1] }, display:"max 2 at `x = 2`; min −2 at `x = 1`",
            wrong:[{ k:"maxX", has:-1, fb:"`x = -1` is outside `[0, 2]`." }],
            why:"`f′ = 3x^2 - 3 = 0` at `x = ±1`; only 1 is inside. `f(0) = 0`, `f(1) = -2`, `f(2) = 2`." },
          { id:"s2", goal:2, prompt:"`f(x) = x^3 - 6x^2 + 9x + 1` on `[-1, 4]`", kind:"mm",
            answer:{ maxV:5, maxX:[1, 4], minV:-15, minX:[-1] }, display:"max 5 at `x = 1` and `x = 4`; min −15 at `x = -1`",
            wrong:[{ k:"minV", eq:1, fb:"`f(-1) = -15` is lower." }, { k:"minX", has:3, fb:"`f(-1) = -15` is lower." }],
            why:"`f′ = 3(x - 1)(x - 3)`. `f(-1) = -15`, `f(1) = 5`, `f(3) = 1`, `f(4) = 5`: the maximum 5 occurs twice." },
          { id:"s3", goal:[1, 2], prompt:"`f(x) = x^4 - 2x^2` on `[-2, 1]`", kind:"mm",
            answer:{ maxV:8, maxX:[-2], minV:-1, minX:[-1, 1] }, display:"max 8 at `x = -2`; min −1 at `x = -1` and `x = 1`",
            wrong:[{ k:"maxV", eq:0, fb:"`f(-2) = 16 - 8 = 8`." }],
            why:"`f′ = 4x(x - 1)(x + 1)`. `f(-2) = 8`, `f(-1) = -1`, `f(0) = 0`, `f(1) = -1`." },
          { id:"s4", goal:[1, 2], star:true, prompt:"`f(x) = x + {4}/{x}` on `[1, 4]`", kind:"mm",
            answer:{ maxV:5, maxX:[1, 4], minV:4, minX:[2] }, display:"max 5 at `x = 1` and `x = 4`; min 4 at `x = 2`",
            wrong:[{ any:-2, fb:"`x = -2` isn’t in `[1, 4]`, so `f(-2)` can’t be a value of `f` on this interval." }],
            why:"`f′ = 1 - {4}/{x^2} = 0` at `x = ±2`; only 2 is inside. `f(1) = 5`, `f(2) = 4`, `f(4) = 5`." },
          { id:"s5", goal:4, star:true, prompt:"`f(x) = 3x^{2/3} - 2x` on `[-1, 8]`", kind:"mm",
            answer:{ maxV:5, maxX:[-1], minV:-4, minX:[8] }, display:"max 5 at `x = -1`; min −4 at `x = 8`",
            wrong:[{ k:"minV", eq:0, fb:"The cusp gives a local min of 0, but `f(8) = 12 - 16 = -4`." }, { k:"minX", has:0, fb:"The cusp gives a local min of 0, but `f(8) = 12 - 16 = -4`." }],
            general:"Did you include `x = 0`? `f′` is undefined there, and 0 is in the domain, so it’s a candidate. Compare `f` at −1, 0, 1 and 8.",
            why:"Candidates −1, 0 (where `f′` is undefined), 1 and 8: `f(-1) = 5`, `f(0) = 0`, `f(1) = 1`, `f(8) = -4`.",
            hints:["`f′(x) = 2x^{-1/3} - 2`. Where is it 0, and where is it undefined?", "`f′ = 0` at `x = 1`; undefined at `x = 0`. Candidates: −1, 0, 1, 8.", "`f(-1) = 5`, `f(0) = 0`, `f(1) = 1`, `f(8) = -4`."] },
          { id:"s6", goal:5, star:true, prompt:"`f(x) = x^3 - 3x^2 + k` on `[-1, 3]` has absolute maximum 10. Find `k` and the absolute minimum.", kind:"k",
            answer:{ k:10, minV:6, minX:[-1, 2] }, display:"`k = 10`; min 6 at `x = -1` and `x = 2`",
            wrong:[{ k:"k", eq:14, fb:"That sets `f(2) = 10`, but `f(0) = f(3) = k` is the largest value." }],
            why:"Candidates −1, 0, 2, 3 give `k - 4`, `k`, `k - 4`, `k`. The max is `k = 10`, so the min is 6, at `x = -1` and `x = 2`.",
            hints:["Critical numbers of `x^3 - 3x^2`: 0 and 2.", "`f(-1) = k - 4`, `f(0) = k`, `f(2) = k - 4`, `f(3) = k`.", "The max is `k = 10`, so the min is 6."] }
        ] },
      { id:"sort", type:"sorter", title:"Candidate or not?", summary:"Candidate or not?", noun:"x-value", goal:[1, 4],
        instruction:"Set A: `f(x) = x^3 - 12x` on `[-1, 5]`. Set B: `g(x) = (x - 2)^{2/3}` on `[0, 10]`. Is each `x`-value a candidate for an absolute extreme?",
        how:"Tap an `x`-value, then tap its box.",
        boxes:[{ id:"yes", label:"Candidate" }, { id:"no", label:"Not a candidate" }],
        items:[
          { id:"i1", goal:1, t:"A: `x = -1`", answer:"yes", why:"It’s the left endpoint.", wrong:{ no:"It’s the left endpoint. " + M1 } },
          { id:"i2", goal:1, t:"A: `x = 2`", answer:"yes", why:"`f′(2) = 0` and 2 is inside.", wrong:{ no:"`f′(2) = 0` and 2 is inside." } },
          { id:"i3", goal:1, t:"A: `x = 5`", answer:"yes", why:"Right endpoint.", wrong:{ no:"Right endpoint. " + M1 } },
          { id:"i4", goal:1, t:"A: `x = -2`", answer:"no", why:"`f′(-2) = 0`, but −2 is outside `[-1, 5]`.", wrong:{ yes:"`f′(-2) = 0`, but −2 is outside `[-1, 5]`." } },
          { id:"i5", goal:1, t:"A: `x = 0`", answer:"no", why:"`f(0) = 0` is a zero of `f`, not of `f′`.", wrong:{ yes:"`f(0) = 0` is a zero of `f`, not of `f′`." } },
          { id:"i6", goal:1, t:"A: `x = 4`", answer:"no", why:"`f(4) = 16` is just a value; `f′(4) = 36 ≠ 0`.", wrong:{ yes:"`f(4) = 16` is just a value; `f′(4) = 36 ≠ 0`." } },
          { id:"i7", goal:1, t:"B: `x = 0`", answer:"yes", why:"Left endpoint.", wrong:{ no:"Left endpoint." } },
          { id:"i8", goal:4, t:"B: `x = 2`", answer:"yes", why:"`g′` is undefined at 2, and 2 is in the domain.", wrong:{ no:"`g′` is undefined at 2, and 2 is in the domain." },
            hints:["Find `g′(x)`.", "`g′(x) = {2}/{3∛{x - 2}}`.", "Undefined at `x = 2`, so it’s critical."] },
          { id:"i9", goal:1, t:"B: `x = 10`", answer:"yes", why:"Right endpoint.", wrong:{ no:"Right endpoint." } },
          { id:"i10", goal:1, t:"B: `x = 3`", answer:"no", why:"`g′(3) = {2}/{3} ≠ 0`, and 3 isn’t an endpoint.", wrong:{ yes:"`g′(3) = {2}/{3} ≠ 0`, and 3 isn’t an endpoint." } }
        ],
        wrongDefault:"Candidates are the endpoints and the critical numbers inside the interval." },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Parisa", how:"", goal:[1, 2, 4],
        instruction:"Parisa made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the absolute extrema of `f(x) = x^3 - 12x` on `[0, 3]`.",
            steps:["`f′(x) = 3x^2 - 12`.", "`3x^2 - 12 = 0` gives `x = ±2`.", "Evaluate at the critical numbers: `f(2) = -16`, `f(-2) = 16`.", "Absolute max 16, absolute min −16."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 solves `f′ = 0` correctly.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Only `x = 2` is in `[0, 3]`; add the endpoints: `f(0) = 0`, `f(2) = -16`, `f(3) = -9`. Max 0 at `x = 0`, min −16 at `x = 2`.", ok:true, why:"The candidates are 0, 2 and 3." },
              { t:"Keep `x = -2` and add the endpoints.", why:"−2 is outside the interval." },
              { t:"Use only the endpoints: max 0, min −9.", why:"`x = 2` is a candidate too." },
              { t:"Step 3 is correct.", why:"`f(-2)` isn’t a value of `f` on `[0, 3]`, and the endpoints are missing." }],
            hints:["Is −2 in `[0, 3]`?", "No. What else must you test?", "Candidates 0, 2, 3."] },
          { id:"e2", goal:2, task:"Find the absolute extrema of `f(x) = 2x^3 - 3x^2 - 12x + 1` on `[-2, 4]`.",
            steps:["`f′(x) = 6x^2 - 6x - 12 = 6(x - 2)(x + 1)`.", "Critical numbers `x = -1` and `x = 2`, both inside.", "`f(-1) = 8` and `f(2) = -19`.", "So the absolute maximum is 8 and the absolute minimum is −19."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Both values are right.", ""],
            fixes:[
              { t:"Also test the endpoints: `f(-2) = -3`, `f(4) = 33`. Max 33 at `x = 4`; min −19 at `x = 2`.", ok:true, why:"The endpoints are candidates too, and `f(4) = 33` wins." },
              { t:"Max 8 at `x = -1` because `f″(-1) < 0`.", why:"That shows a local max only." },
              { t:"Max 33, min −3.", why:"`f(2) = -19` is lower than −3." },
              { t:"Step 4 is correct.", why:"`f(4) = 128 - 48 - 48 + 1 = 33 > 8`." }],
            hints:["Which candidates are missing?", "The endpoints −2 and 4.", "`f(4) = 33` wins."] },
          { id:"e3", goal:4, task:"Find the absolute extrema of `f(x) = 3x^{2/3} - x` on `[-8, 8]`.",
            steps:["`f′(x) = 2x^{-1/3} - 1 = {2}/{∛x} - 1`.", "`f′(x) = 0` when `∛x = 2`, so `x = 8`. That’s the only critical number.", "Candidates −8 and 8: `f(-8) = 20`, `f(8) = 4`.", "Max 20, min 4."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`f′` is undefined at `x = 0`, which is in the domain, so 0 is also critical: `f(0) = 0`. Max 20 at `x = -8`, min 0 at `x = 0`.", ok:true, why:"A cusp is a candidate too." },
              { t:"`∛x = 2` gives `x = 6`.", why:"`2^3 = 8`." },
              { t:"Also `x = -8` is critical.", why:"It’s an endpoint, already a candidate." },
              { t:"Step 2 is correct.", why:"`{2}/{∛x}` has no value at `x = 0`." }],
            hints:["Can `{2}/{∛x}` be evaluated at every `x`?", "Not at 0.", "`f(0) = 0` is the minimum."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the hunter: a tie, an endpoint beating a turning point, or the open interval with no maximum?" },
      { id:"j2", q:"In your own words, why are the endpoints always candidates on a closed interval?" },
      { id:"j3", q:"Explain to a friend the steps for finding the absolute extrema of a function on `[a, b]`." },
      { id:"j4", q:"Which part still trips you up (outside critical numbers, cusps, or reporting value vs location)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which `x`-values must be tested to find the absolute extrema of `f(x) = x^3 - 3x^2` on `[1, 4]`?", options:[
          { t:"1, 2 and 4", ok:true, why:"Endpoints 1 and 4; `f′ = 3x(x - 2) = 0` at 2 (inside) and 0 (outside)." },
          { t:"0 and 2", why:"The endpoints are missing and 0 is outside." },
          { t:"0, 1, 2 and 4", why:"0 isn’t in `[1, 4]`." },
          { t:"1 and 4", why:"`x = 2` is a critical number inside." }] },
        b:{ prompt:"Which `x`-values must be tested for `f(x) = x^3 - 12x` on `[-1, 3]`?", options:[
          { t:"−1, 2 and 3", ok:true, why:"`f′ = 0` at ±2; only 2 is inside." },
          { t:"−2 and 2", why:"The endpoints are missing and −2 is outside." },
          { t:"−2, −1, 2 and 3", why:"−2 isn’t in `[-1, 3]`." },
          { t:"−1 and 3", why:"`x = 2` is inside." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the absolute maximum value of `f(x) = x^3 - 3x^2` on `[1, 4]`?", options:[
          { t:"16", ok:true, why:"`f(1) = -2`, `f(2) = -4`, `f(4) = 64 - 48 = 16`." },
          { t:"0", why:"`f(0) = 0`, but 0 is outside `[1, 4]`." },
          { t:"4", why:"4 is where; the value is `f(4) = 16`." },
          { t:"−2", why:"That’s `f(1)`; `f(4)` is larger." }] },
        b:{ prompt:"What is the absolute maximum value of `f(x) = x^3 - 12x` on `[-1, 3]`?", options:[
          { t:"11", ok:true, why:"`f(-1) = 11`, `f(2) = -16`, `f(3) = -9`." },
          { t:"16", why:"`f(-2) = 16`, but −2 is outside." },
          { t:"−1", why:M4("-1", "f(-1) = 11") },
          { t:"−9", why:"That’s `f(3)`; `f(-1) = 11` is larger." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`g(x) = x^2 - 2x` on the <strong>open</strong> interval `(0, 3)`. Which is true?", options:[
          { t:"Absolute minimum −1 at `x = 1`; no absolute maximum.", ok:true, why:"Values approach `g(3) = 3` but never reach it." },
          { t:"Absolute minimum −1; absolute maximum 3 at `x = 3`.", why:"3 isn’t in `(0, 3)`." },
          { t:"Absolute minimum −1; absolute maximum 0 at `x = 0`.", why:"0 isn’t included either, and 3 would be bigger anyway." },
          { t:"No absolute minimum or maximum.", why:"`g(1) = -1` is reached, and no value is lower." }] },
        b:{ prompt:"`h(x) = 4x - x^2` on the <strong>open</strong> interval `(1, 5)`. Which is true?", options:[
          { t:"Absolute maximum 4 at `x = 2`; no absolute minimum.", ok:true, why:"Values approach `h(5) = -5` but never reach it." },
          { t:"Absolute maximum 4; absolute minimum −5 at `x = 5`.", why:"5 isn’t in `(1, 5)`: the values only approach `h(5) = -5`." },
          { t:"Absolute maximum 4; absolute minimum 3 at `x = 1`.", why:"1 isn’t included either, and the values near 5 are lower anyway." },
          { t:"No absolute maximum or minimum.", why:"`h(2) = 4` is reached." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`f(x) = x^3 - 3x^2 - 9x + 5` has a local maximum at `x = -1`. On which interval is the absolute maximum at an endpoint <strong>and not</strong> at `x = -1`?", options:[
          { t:"`[0, 6]`", ok:true, why:"`x = -1` is outside; `f(0) = 5`, `f(3) = -22`, `f(6) = 59`." },
          { t:"`[-2, 4]`", why:"`f(-1) = 10` beats `f(-2) = 3` and `f(4) = -15`." },
          { t:"`[-3, 0]`", why:"`f(-1) = 10` beats `f(0) = 5`." },
          { t:"`[-4, 5]`", why:"`f(5) = 10` ties with `f(-1) = 10`, so the max is at both." }] },
        b:{ prompt:"`f(x) = x^3 - 12x` has a local maximum at `x = -2`. On which interval is the absolute maximum at an endpoint <strong>and not</strong> at `x = -2`?", options:[
          { t:"`[-3, 5]`", ok:true, why:"`f(5) = 65` beats `f(-2) = 16`." },
          { t:"`[-3, 3]`", why:"`f(-2) = 16` is largest." },
          { t:"`[-4, 0]`", why:"`f(-2) = 16` is largest." },
          { t:"`[-4, 4]`", why:"`f(4) = 16` ties with `f(-2)`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`f(x) = x^3 - 6x^2 + k` on `[-1, 5]` has absolute minimum −20. Find `k`.", options:[
          { t:"`k = 12`", ok:true, why:"Candidates −1, 0, 4, 5 give `k - 7`, `k`, `k - 32`, `k - 25`. The min is `k - 32 = -20`." },
          { t:"`k = -13`", why:"That sets `f(-1) = -20`, but `f(4) = k - 32` is lower." },
          { t:"`k = -20`", why:"That sets `f(0) = -20`; `f(0)` is the largest candidate, not the smallest." },
          { t:"`k = 5`", why:"That sets `f(5) = -20`, but `f(4)` is lower." }] },
        b:{ prompt:"`f(x) = x^3 - 3x^2 + k` on `[-2, 3]` has absolute minimum −15. Find `k`.", options:[
          { t:"`k = 5`", ok:true, why:"Candidates −2, 0, 2, 3 give `k - 20`, `k`, `k - 4`, `k`. The min is `k - 20 = -15`." },
          { t:"`k = -11`", why:"That uses the local min `f(2) = k - 4`; the endpoint `f(-2)` is lower." },
          { t:"`k = -15`", why:"That sets `f(0) = -15`." },
          { t:"`k = 35`", why:"Sign slip: `k - 20 = -15` gives `k = 5`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"What is the absolute maximum value of `f(x) = 2 - (x - 3)^{2/3}` on `[2, 11]`?", options:[
          { t:"2", ok:true, why:"`f′(x) = -{2}/{3}(x - 3)^{-1/3}` is undefined at `x = 3`: `f(3) = 2`. Endpoints: `f(2) = 1`, `f(11) = 2 - 4 = -2`." },
          { t:"1", why:"Testing only the endpoints misses `x = 3`." },
          { t:"There is none, because `f′` is never 0.", why:"A continuous function on a closed interval always has a maximum; here it’s at the cusp." },
          { t:"−2", why:"That’s the minimum, `f(11)`." }] },
        b:{ prompt:"What is the absolute maximum value of `f(x) = 5 - (x + 1)^{2/3}` on `[-2, 7]`?", options:[
          { t:"5", ok:true, why:"`f′` is undefined at `x = -1`: `f(-1) = 5`. `f(-2) = 4`, `f(7) = 1`." },
          { t:"4", why:"Testing only the endpoints misses `x = -1`, where `f′` is undefined." },
          { t:"There is none, because `f′` is never 0.", why:"A continuous function on a closed interval always has a maximum; here it’s at the cusp." },
          { t:"1", why:"That’s the minimum." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"`f(x) = x^3 - 12x` on `[-3, 5]`. Which is the best explanation of why the absolute maximum isn’t at `x = -2`, even though `f′(-2) = 0`?", options:[
          { t:"“`f′(-2) = 0` only makes −2 a candidate. Comparing all candidates, `f(5) = 65` is larger than `f(-2) = 16`, so the maximum is at the endpoint `x = 5`.”", ok:true, why:"Candidates are compared by their values." },
          { t:"“`x = -2` is a local minimum, not a maximum.”", why:"`f` rises to −2 and falls after it: it’s a local maximum." },
          { t:"“Critical numbers are never absolute extrema.”", why:"They often are; they just have to be compared." },
          { t:"“`x = -2` is outside the interval.”", why:"−3 < −2 < 5: it’s inside." }] },
        b:{ prompt:"`f(x) = x^3 - 3x^2 - 9x + 5` on `[-4, 4]`. Which is the best explanation of why the absolute minimum is at `x = -4`, not at `x = 3`, where `f′(3) = 0`?", options:[
          { t:"“`x = 3` is only a candidate. Comparing `f(-4) = -71`, `f(-1) = 10`, `f(3) = -22` and `f(4) = -15`, the smallest is −71 at the endpoint.”", ok:true, why:"Candidates are compared by their values." },
          { t:"“`x = 3` is a local maximum.”", why:"`f` falls into 3 and rises after: a local minimum." },
          { t:"“Endpoints always give the minimum.”", why:"Not always; here it does after comparing." },
          { t:"“`f′(-4) = 0`.”", why:"`f′(-4) = 48 - (-24) - 9 ≠ 0`; endpoints don’t need `f′ = 0`." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"On `[0, 4]`, a student finds the candidate values `f(0) = 2`, `f(1) = 6`, `f(3) = -1`, `f(4) = 5`. Which report is correct?", options:[
          { t:"“The absolute maximum value is 6, at `x = 1`; the absolute minimum value is −1, at `x = 3`.”", ok:true, why:"The value is the `y`; the location is the `x`." },
          { t:"“The absolute maximum is 1 and the absolute minimum is 3.”", why:"1 and 3 are where they happen. The values are `f(1) = 6` and `f(3) = -1`." },
          { t:"“The absolute maximum is at (6, 1) and the minimum at (−1, 3).”", why:"Coordinates are `(x, y)`: (1, 6) and (3, −1)." },
          { t:"“The absolute maximum is 5, at the endpoint `x = 4`.”", why:"Endpoints only win when they’re largest; 6 > 5." }] },
        b:{ prompt:"On `[-1, 5]`, the candidate values are `f(-1) = 4`, `f(2) = 9`, `f(3) = -2`, `f(5) = 7`. Which report is correct?", options:[
          { t:"“The absolute maximum value is 9, at `x = 2`; the absolute minimum value is −2, at `x = 3`.”", ok:true, why:"The value is the `y`; the location is the `x`." },
          { t:"“The absolute maximum is 2 and the absolute minimum is 3.”", why:"2 and 3 are where they happen. The values are `f(2) = 9` and `f(3) = -2`." },
          { t:"“Maximum at (9, 2), minimum at (−2, 3).”", why:"Coordinates are (2, 9) and (3, −2)." },
          { t:"“The absolute maximum is 7, at `x = 5`.”", why:"9 > 7." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"The concentration of a medicine in the blood is `C(t) = {12t}/{t^2 + 9}` mg/L, `t` hours after a dose, for `0 ≤ t ≤ 6`. What is the greatest concentration?", options:[
          { t:"2 mg/L", ok:true, why:"`C′(t) = {12(9 - t^2)}/{(t^2 + 9)^2} = 0` at `t = 3`; `C(3) = 36/18 = 2`. `C(0) = 0`, `C(6) = 72/45 = 1.6`." },
          { t:"3 mg/L", why:"3 is the time, in hours." },
          { t:"1.6 mg/L", why:"That’s the endpoint value; `C(3)` is larger." },
          { t:"4 mg/L", why:"36/9 leaves out the `t^2` in the denominator: `t^2 + 9 = 18` at `t = 3`." }] },
        b:{ prompt:"`C(t) = {20t}/{t^2 + 16}` mg/L for `0 ≤ t ≤ 8`. What is the greatest concentration?", options:[
          { t:"2.5 mg/L", ok:true, why:"`C′ = 0` at `t = 4`; `C(4) = 80/32 = 2.5`. `C(8) = 160/80 = 2`." },
          { t:"4 mg/L", why:"4 is the time, in hours. The value is `C(4) = 2.5`." },
          { t:"2 mg/L", why:"That’s `C(8)`." },
          { t:"5 mg/L", why:"80/16 leaves out the `t^2` in the denominator." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"The volume of water in a tank is `V(t) = t^3 - 9t^2 + 24t + 100` litres for `0 ≤ t ≤ 5` minutes. What is the least volume, and when does it occur?", options:[
          { t:"100 L at `t = 0` min", ok:true, why:"`V′ = 3(t - 2)(t - 4)`. `V(0) = 100`, `V(2) = 120`, `V(4) = 116`, `V(5) = 120`." },
          { t:"116 L at `t = 4` min", why:"That’s only a local minimum." },
          { t:"120 L at `t = 2` and 5 min", why:"That’s the maximum." },
          { t:"There is no least volume, because `V′(0) ≠ 0`.", why:"Endpoints don’t need `V′ = 0`." }] },
        b:{ prompt:"`V(t) = t^3 - 12t^2 + 45t + 60` litres for `0 ≤ t ≤ 6` minutes. What is the least volume, and when does it occur?", options:[
          { t:"60 L at `t = 0` min", ok:true, why:"`V′ = 3(t - 3)(t - 5)`. `V(0) = 60`, `V(3) = 114`, `V(5) = 110`, `V(6) = 114`." },
          { t:"110 L at `t = 5` min", why:"That’s only a local minimum: `V(0) = 60` is lower." },
          { t:"114 L at `t = 3` and 6 min", why:"That’s the maximum." },
          { t:"There is no least volume, because `V′(0) ≠ 0`.", why:"Endpoints don’t need `V′ = 0`." }] } }
    ]
  },
  task:{
    title:"Design the window", summary:"Design the window",
    statement:"<p>Choose whole numbers `a` and `b` so that, on `[a, b]`, the function `f(x) = x^3 - 12x` meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Exactly one critical number of `f` lies strictly inside the interval.</li><li>The absolute maximum occurs <strong>only</strong> at an endpoint.</li><li>The absolute minimum occurs <strong>only</strong> at a critical number.</li><li>The interval is exactly 5 units long.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −5 to 6, with `a < b`. The graph shows the walls, the candidates and the candidate table.</p>",
    checks:["One critical number inside", "Max only at an endpoint", "Min only at a critical number", "Length 5"],
    tips:["The critical numbers are −2 and 2. Put exactly one strictly inside; a critical number at a wall counts as an endpoint.",
      "Some endpoint must beat the local max, or the local max mustn’t be inside.",
      "Make `x = 2` (where `f = -16`) the inside critical number, and keep the endpoints above −16.",
      "`b = a + 5`."],
    explainPrompt:"Explain how you made sure the maximum landed on an endpoint and the minimum on a critical number.",
    vocab:"Use the words candidate, endpoint, critical number and absolute.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"In each one, `x = 2` is the only critical number inside, and it gives the minimum −16. In `[-2, 3]` the critical number −2 sits on the wall, so it counts as an endpoint, which is why it’s allowed.",
    labels:{ a:"Left wall", b:"Right wall", range:"(−5 to 6)", invalid:"Choose whole numbers from −5 to 6 for `a` and `b`, with `a < b`." }
  },
  cards:[
    ["Absolute maximum on `[a, b]`", "The largest value of `f` on the interval, e.g. 10 at `x = -1`."],
    ["Extreme Value Theorem (plain words)", "Continuous on a closed interval ⇒ an absolute max and min exist."],
    ["Candidates", "Endpoints `a`, `b`, and critical numbers inside `(a, b)`."],
    ["Critical number", "`c` in the domain with `f′(c) = 0` or `f′(c)` undefined."],
    ["Outside critical numbers", "Ignore them: they aren’t in the interval."],
    ["The method", "List candidates → evaluate `f` → compare."],
    ["Local vs absolute", "A local max is highest nearby; the absolute max is highest on the whole interval."],
    ["Endpoint wins", "`x^3 - 12x` on `[-3, 5]`: `f(5) = 65` beats `f(-2) = 16`."],
    ["Cusp candidate", "`(x - 1)^{2/3}`: `f′` undefined at 1, so test `x = 1`."],
    ["Open interval", "On `(0, 3)`, `x^2 - 2x` has no absolute max: it never reaches 3."],
    ["Value vs location", "“Max value 2.5 mg/L, at `t = 2` h.”"],
    ["Ties", "Two candidates with the same largest value: the max occurs at both."]
  ]
};
