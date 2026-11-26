// SCH4U 44 Buffer Solutions. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/44-buffer-solutions.md
// The beakers, pH graph, particle view, moles table, blood / breathing / tablet / ocean stations and the task builder are
// drawn by app.js, which takes pKa values from MV.chem.data (the model acid HX, pKa 5.00, is defined there as a model value).

const PKA = "p<i>K</i><sub>a</sub>", n = "<i>n</i>";
// Misconception core sentences (plan §3)
const M1 = "Cl⁻ is too weak a base to take H⁺ back. A buffer needs a <strong>weak</strong> acid and its conjugate base.";
const M2 = "A buffer changes pH a little, not zero. The ratio shifts slightly.";
const M3 = "Added H₃O⁺ turns A⁻ into HA: A⁻ goes <strong>down</strong>, HA goes <strong>up</strong>, and the pH falls.";
const M4 = `pH = ${PKA} + log(<strong>base</strong> ÷ <strong>acid</strong>). More A⁻ means a higher pH.`;
const M5 = "Diluting keeps the ratio, so the pH stays the same, but there’s less of each component to use up.";
const M6 = "Once A⁻ is used up, the extra H₃O⁺ stays in solution and the pH drops sharply.";
const M7 = `Pick the pair whose ${PKA} is closest to the target pH (within about 1).`;
// Activity 1 hints 1 and 2 (plan)
const SH1 = "Is there a <strong>weak</strong> acid–base pair?";
const SH2 = "For mixtures with a strong acid or base, react first, then look at what’s left.";
// Pinned values box for the calculation set (values from the course tables; logs as in the plan)
const LOGS = "log 2 = 0.30, log 3 = 0.48, log 5 = 0.70";
const B1H = `pH = ${PKA} + log(base ÷ acid).`, B2H = "Find the ratio, then its log.";

export default {
  id:"44-buffer-solutions",
  kind:"topic",
  title:"Buffer solutions",
  topic:"Buffer Solutions",
  readyTopic:"buffer solutions",
  hero:{
    eq:`<span class="bf-eq"><span class="nw">pH = ${PKA} + log([A⁻] ÷ [HA])</span><span class="bf-eqsub"><span class="bf-a">A⁻</span> mops up <span class="bf-h">H₃O⁺</span> · <span class="bf-ha">HA</span> mops up <span class="bf-oh">OH⁻</span></span></span>`, eqSize:"sm",
    eqLabel:"p H equals p K a plus log of the concentration of A minus divided by the concentration of H A. A minus mops up H 3 O plus; H A mops up O H minus.",
    headline:"A buffer takes the hit so the pH doesn’t.",
    text:"A <strong>buffer</strong> holds a <strong>weak acid</strong> and its <strong>conjugate base</strong> side by side. Add strong acid and the base uses it up; add strong base and the acid uses it up. The pH barely moves, until the buffer runs out. That limit is its <strong>capacity</strong>.",
    fig:{ html:'<div class="bf-hx"><div id="bf-hx-svg"></div><div class="bf-hx-row"><p class="bf-hx-cap" id="bf-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="bf-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can identify a buffer as a weak acid with its conjugate base, or a weak base with its conjugate acid.",
    "I can explain, with equations, how a buffer uses up added acid or base.",
    "I can calculate a buffer’s pH from the amounts of its two components.",
    "I can calculate the pH after a strong acid or base is added, and choose an acid–base pair for a target pH.",
    "I can explain buffer capacity, and what happens when a buffer is diluted or overwhelmed.",
    "I can explain how buffers work in blood, medicines and the ocean."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Conjugate pairs", goal:1,
          prompt:"Which is a weak acid with its conjugate base?",
          options:[
            { t:"CH₃COOH and CH₃COO⁻", ok:true, why:"Ethanoic acid is weak; ethanoate is its conjugate base." },
            { t:"HCl and Cl⁻", why:"HCl is strong; Cl⁻ is too weak a base to matter." },
            { t:"NH₄⁺ and NH₂⁻", why:"These differ by two H⁺; NH₄⁺’s conjugate base is NH₃." },
            { t:"H₂O and H₃O⁺", why:"H₃O⁺ is water’s conjugate <strong>acid</strong>." }],
          hints:["Conjugates differ by one H⁺.", "The acid must be weak.", "CH₃COOH / CH₃COO⁻."] },
        { id:"w2", skill:"Logs", goal:3,
          prompt:"Using log 2 = 0.30, find log(1/2).",
          options:[
            { t:"−0.30", ok:true, why:"log(1/<i>a</i>) = −log <i>a</i>." },
            { t:"0.50", why:"That’s the fraction itself, not its log. log(1/<i>a</i>) = −log <i>a</i>." },
            { t:"0.15", why:"That halves the log. log(1/<i>a</i>) = −log <i>a</i>." },
            { t:"−0.70", why:"log 5 = 0.70; here it’s 1/2." }],
          hints:["log(1/<i>a</i>) = −log <i>a</i>.", "−log 2.", "−0.30."] },
        { id:"w3", skill:"Logs", goal:6,
          prompt:"Using log 2 = 0.30, find log 20.",
          options:[
            { t:"1.30", ok:true, why:"log 20 = log 2 + log 10." },
            { t:"2.00", why:"log 100 = 2." },
            { t:"0.60", why:"That’s log 4." },
            { t:"0.20", why:"That reads the digits. log 20 = log 2 + log 10." }],
          hints:["20 = 2 × 10.", "log 2 + log 10.", "0.30 + 1 = 1.30."] },
        { id:"w4", skill:"Reacting a strong acid or base with a weak species", goal:2,
          prompt:"0.020 mol of HCl is added to a solution containing 0.10 mol of CH₃COO⁻. What remains after the reaction?",
          options:[
            { t:"0.080 mol CH₃COO⁻ and 0.020 mol of newly formed CH₃COOH", ok:true, why:"H₃O⁺ + CH₃COO⁻ → CH₃COOH + H₂O goes to completion." },
            { t:"0.12 mol CH₃COO⁻", why:"Acid removes the base." },
            { t:"0.10 mol CH₃COO⁻ and 0.020 mol H₃O⁺", why:"Strong acid reacts completely with a base." },
            { t:"0.020 mol CH₃COO⁻", why:"That subtracts the wrong way: 0.10 − 0.020 = 0.080 mol of base is left." }],
          hints:["Strong acid + conjugate base → weak acid.", "Subtract 0.020 from the base; add 0.020 to the acid.", "0.080 mol A⁻, 0.020 mol HA."] },
        { id:"w5", skill:"Reacting a strong acid or base with a weak species", goal:2,
          prompt:"0.050 mol of NaOH is added to 0.10 mol of CH₃COOH. What is present after the reaction?",
          options:[
            { t:"0.050 mol CH₃COOH and 0.050 mol CH₃COO⁻", ok:true, why:"OH⁻ + CH₃COOH → CH₃COO⁻ + H₂O." },
            { t:"0.15 mol CH₃COOH", why:"That adds the amounts. OH⁻ uses up the acid." },
            { t:"0.10 mol CH₃COOH and 0.050 mol OH⁻", why:"OH⁻ reacts completely with a weak acid." },
            { t:"0.050 mol CH₃COO⁻ only", why:"Half the acid is left." }],
          hints:["OH⁻ converts HA into A⁻.", "0.10 − 0.050 HA; 0 + 0.050 A⁻.", "Equal amounts: half-neutralized."] },
        { id:"w6", skill:"Half-equivalence", goal:3,
          prompt:"In module 43, what was the pH at the half-equivalence point of the ethanoic acid titration?",
          options:[
            { t:`4.74, equal to ${PKA}`, ok:true, why:`At half-equivalence, ${n}(HA) = ${n}(A⁻), so pH = ${PKA}.` },
            { t:"7.00", why:"Half-equivalence isn’t neutral." },
            { t:"8.85", why:"That’s equivalence." },
            { t:"2.74", why:"That’s the starting pH." }],
          hints:[`At half-equivalence, ${n}(HA) = ${n}(A⁻).`, "log 1 = 0.", `pH = ${PKA} = 4.74.`] }
      ],
      refreshers:{
        "Conjugate pairs":"A weak acid and its conjugate base differ by one H⁺. A strong acid’s conjugate base (Cl⁻, NO₃⁻) can’t act as a buffer base.",
        "Logs":"log 2 = 0.30, log 3 = 0.48, log 5 = 0.70, log 10 = 1; log(1/<i>a</i>) = −log <i>a</i>; log(<i>ab</i>) = log <i>a</i> + log <i>b</i>.",
        "Reacting a strong acid or base with a weak species":"Strong acids and bases react completely. Do the moles first: subtract from what’s used, add to what’s made.",
        "Half-equivalence":`Equal amounts of HA and A⁻ give pH = ${PKA}. That’s a buffer at its best.`
      }
    }
  },
  explore:{
    heading:"Buffer challenge",
    intro:"Build a buffer, then attack it with strong acid or base. Compare it with pure water, and find out when it gives up.",
    how:"Choose a <strong>buffer pair</strong> and the amounts of its two forms (each in 1.00 L). Then add HCl or NaOH and watch both beakers. Changing the pair or the amounts starts again with nothing added. Switch views to see the <strong>particles</strong> or the <strong>calculation</strong>. Undo also works with Ctrl+Z.",
    predictions:[
      { id:"p1", prompt:"Add 0.020 mol HCl to 1.00 L of pure water (pH 7.00). The new pH is:",
        options:[{ t:"1.70", ok:true }, { t:"6.98" }, { t:"5.00" }, { t:"7.00" }],
        explain:"[H₃O⁺] = 0.020 mol/L, so pH = 2 − 0.30." },
      { id:"p2", prompt:"Add the same 0.020 mol HCl to the buffer. The new pH is:",
        options:[{ t:"4.82", ok:true }, { t:"1.70" }, { t:"5.00" }, { t:"3.00" }],
        explain:"X⁻ drops to 0.080 and HX rises to 0.12: log(2/3) = −0.18. " + M2 },
      { id:"p3", prompt:"Dilute the buffer ten times. The pH becomes:",
        options:[{ t:"5.00 (unchanged)", ok:true }, { t:"6.00" }, { t:"4.00" }, { t:"7.00" }],
        explain:"Both amounts fall tenfold, so the ratio is unchanged. " + M5 },
      { id:"p4", prompt:"Add 0.12 mol HCl in one go. The pH becomes about:",
        options:[{ t:"1.70 (capacity exceeded)", ok:true }, { t:"4.82" }, { t:"4.00" }, { t:"5.00" }],
        explain:"The first 0.10 mol is absorbed; the last 0.020 mol isn’t. " + M6 }
    ],
    predIntro:"Each prediction uses the model acid HX (0.10 mol HX + 0.10 mol X⁻ in 1.00 L, " + PKA + " 5.00) or pure water. Make a prediction first. Then the centrepiece will show you what really happens.",
    chalIntro:"Use the buffer builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Build a buffer at pH 4.74 using ethanoic acid and ethanoate.",
        why:`Equal amounts make log(ratio) = log 1 = 0, so pH = ${PKA} = 4.74. Any equal pair of amounts works.`,
        general:"Check the pair and the ratio of the two amounts.",
        hints:[`When does pH equal ${PKA}?`, "When log(ratio) = 0.", "Equal amounts of acid and base."] },
      { id:"tc2", goal:4, prompt:"Start with the HX buffer (0.10 mol each). Add HCl until the pH reads exactly 4.52.",
        why:"0.050 mol HCl turns 0.050 mol X⁻ into HX: X⁻ 0.050, HX 0.15, so pH = 5.00 + log(1/3) = 4.52.",
        hints:["4.52 − 5.00 = −0.48 = log(1/3).", "So X⁻ : HX = 1 : 3, with 0.20 mol in total.", "X⁻ = 0.050, HX = 0.15, so add 0.050 mol HCl."] },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Design a buffer at pH 9.56 that can take a test dose of 0.15 mol HCl and still stay at pH 9.00 or above.",
        why:"0.20 mol NH₄⁺ + 0.40 mol NH₃ gives 9.26 + log 2 = 9.56. After the dose, (0.40 − 0.15) ÷ (0.20 + 0.15) = 0.71 and pH = 9.11: the right ratio <strong>and</strong> enough capacity.",
        hints:["9.56 − 9.26 = 0.30, so NH₃ : NH₄⁺ = 2 : 1.", "After 0.15 mol HCl: NH₃ falls by 0.15 and NH₄⁺ rises by 0.15. For pH ≥ 9.00 you need log(ratio) ≥ −0.26, so a ratio ≥ 0.55.", "Only 0.40 / 0.20 works: (0.40 − 0.15) ÷ (0.20 + 0.15) = 0.71, and pH = 9.26 − 0.15 = 9.11."] }
    ],
    blocks:[{ title:"What the builder shows", html:"<p>The buffer’s pH follows the <strong>ratio</strong> of base form to acid form, so it shifts slowly. Water has nothing to use up added acid or base. And once one component of the buffer runs out, its pH falls off a cliff too.</p>" }]
  },
  part3:{
    slug:"blood", name:"In your body", heading:"Buffers in your body",
    intro:"The buffer equation and Le Chatelier’s principle (module 35) at work in blood, medicine and the ocean. Health contexts here are explanations with model values, not medical advice.",
    s1:{ title:"Station 1: Blood",
      intro:"Blood is buffered by carbonic acid and hydrogen carbonate:",
      eq:"CO2(aq) + H2O(l) <=> H2CO3(aq) <=> H+(aq) + HCO3-(aq)",
      text:`At body temperature the effective ${PKA} is about 6.1 (course table addition, model value). Normal blood pH is 7.35–7.45. Move the slider to change the ratio [HCO₃⁻] : [H₂CO₃].`,
      dataTitle:"Check it with data",
      data:"At pH 7.40, log([HCO₃⁻] ÷ [H₂CO₃]) = 7.40 − 6.1 = 1.30, so the ratio is 20 : 1 (log 20 = 1.30). Blood carries about twenty times as much hydrogen carbonate as carbonic acid." },
    s2:{ title:"Station 2: Breathing and Le Chatelier",
      intro:"Choose how the person is breathing and watch the equilibrium respond.",
      states:{
        normal:"Normal breathing: CO₂ is breathed out as fast as cells make it, so the equilibrium holds and the blood pH stays near 7.40.",
        fast:"Fast, deep breathing removes CO₂, which shifts the equilibrium <strong>left</strong>: H⁺ is used up, so H⁺ falls and the pH <strong>rises</strong>.",
        hold:"Holding your breath does the opposite: CO₂ builds up, the equilibrium shifts <strong>right</strong>, H⁺ rises and the pH <strong>falls</strong>." },
      kidney:"The kidneys adjust HCO₃⁻ over hours to days (SBI4U 36: the kidneys and acid–base balance)." },
    s3:{ title:"Station 3: Buffered medicine",
      intro:"Some pain-relief tablets add a weak base to buffer the acid near the tablet in the stomach, which can reduce irritation for some people. This station explains the chemistry only; it gives no dosing advice.",
      q:"Stomach acid (H₃O⁺) reaches the tablet. Which component of the buffer handles it?",
      choices:[
        { t:"the weak base", ok:true, fb:"Right. Bases use up H₃O⁺: A⁻ + H₃O⁺ → HA + H₂O." },
        { t:"the weak acid", fb:"An acid doesn’t use up an acid. Bases use up H₃O⁺." }] },
    s4:{ title:"Station 4: The ocean as a buffer",
      // VERIFY: surface ocean pH about 8.2 (pre-industrial) to about 8.1 (today); the plan marks these figures "verify before release".
      intro:"Seawater’s carbonate system buffers against pH change. As more CO₂ dissolves, the equilibria shift and the pH falls slowly: surface ocean pH has dropped from about 8.2 to about 8.1 since pre-industrial times. Carbonate ions are used up, which makes shell-building harder.",
      eq:"CO2 + H2O + CO3^2- -> 2HCO3-",
      prompt:"Explain why a buffer slows, but can’t stop, the change.",
      model:"The carbonate ions use up the acid that dissolved CO₂ makes, so the pH falls only slowly. But each dose of CO₂ uses some carbonate up. A buffer’s capacity is finite: as its base component runs low, it absorbs less and less, and the pH keeps falling." },
    quickCheck:{
      title:"Quick check", summary:"In your body quick check",
      items:[
        { id:"q1", goal:6, prompt:"Blood at pH 7.40 has [HCO₃⁻] : [H₂CO₃] about…",
          choices:[
            { t:"20 : 1", ok:true, fb:"Right. 7.40 − 6.1 = 1.30 = log 20." },
            { t:"1 : 20", fb:"7.40 − 6.1 = 1.30 = log 20." },
            { t:"1 : 1", fb:"7.40 − 6.1 = 1.30 = log 20." },
            { t:"7.4 : 1", fb:"7.40 − 6.1 = 1.30 = log 20." }] },
        { id:"q2", goal:6, prompt:"Hyperventilating makes blood pH…",
          choices:[
            { t:"rise", ok:true, fb:"Right. Removing CO₂ shifts the equilibrium left, using up H⁺." },
            { t:"fall", fb:"Removing CO₂ shifts the equilibrium left, using up H⁺." },
            { t:"stay exactly 7.40", fb:"Removing CO₂ shifts the equilibrium left, using up H⁺." },
            { t:"reach 6.1", fb:"Removing CO₂ shifts the equilibrium left, using up H⁺." }] },
        { id:"q3", goal:[2, 6], prompt:"In a buffered tablet, which part handles stomach acid?",
          choices:[
            { t:"the weak base", ok:true, fb:"Right. Bases use up H₃O⁺." },
            { t:"the active drug", fb:"Bases use up H₃O⁺." },
            { t:"the coating", fb:"Bases use up H₃O⁺." },
            { t:"water", fb:"Bases use up H₃O⁺." }] },
        { id:"q4", goal:[5, 6], prompt:"Why can’t the ocean’s buffer stop acidification forever?",
          choices:[
            { t:"Its base component is gradually used up", ok:true, fb:"Right. Capacity is finite." },
            { t:"Buffers only work in labs", fb:M6 + " Capacity is finite." },
            { t:"Seawater has no buffer", fb:M6 + " Capacity is finite." },
            { t:"CO₂ isn’t an acid", fb:M6 + " Capacity is finite." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Buffer or not?", summary:"Buffer or not?", goal:[1, 2], noun:"mixture", txt:true,
        instruction:"Ten mixtures, each in 1.00 L. Sort each one: is it a buffer? Items marked ★ need a reaction first.",
        boxes:[{ id:"buf", label:"Buffer" }, { id:"not", label:"Not a buffer" }],
        wrongDefault:SH1 + " " + SH2,
        items:[
          { id:"i1", t:"CH₃COOH + CH₃COONa", answer:"buf", why:"Weak acid + conjugate base.",
            hints:[SH1, SH2, "Buffer: weak acid + conjugate base."] },
          { id:"i2", t:"HCl + NaCl", answer:"not", why:"Strong acid; Cl⁻ can’t take H⁺ back.", wrong:{ buf:M1 },
            hints:[SH1, SH2, "Not a buffer: strong acid; Cl⁻ can’t take H⁺ back."] },
          { id:"i3", t:"NH₃ + NH₄Cl", answer:"buf", why:"Weak base + conjugate acid.",
            hints:[SH1, SH2, "Buffer: weak base + conjugate acid."] },
          { id:"i4", t:"HF + NaF", answer:"buf", why:"Weak acid + conjugate base.",
            hints:[SH1, SH2, "Buffer: weak acid + conjugate base."] },
          { id:"i5", t:"NaOH + NaCl", answer:"not", why:"Strong base; Na⁺ and Cl⁻ are spectators.",
            hints:[SH1, SH2, "Not a buffer: strong base; Na⁺ and Cl⁻ are spectators."] },
          { id:"i6", t:"HNO₃ + KNO₃", answer:"not", why:"Strong acid.", wrong:{ buf:"HNO₃ is a strong acid. " + M1.replace("Cl⁻", "NO₃⁻") },
            hints:[SH1, SH2, "Not a buffer: strong acid."] },
          { id:"i7", t:"H₂CO₃ + NaHCO₃", answer:"buf", why:"The blood buffer pair.",
            hints:[SH1, SH2, "Buffer: the blood buffer pair."] },
          { id:"i8", t:"0.10 mol CH₃COOH + 0.10 mol NaOH ★", answer:"not", why:"All the HA becomes A⁻: just a salt solution.",
            wrong:{ buf:"Count the moles after the reaction: is any HA left?" },
            hints:[SH1, SH2, "Not a buffer: all the HA becomes A⁻, just a salt solution."] },
          { id:"i9", t:"0.20 mol CH₃COOH + 0.10 mol NaOH ★", answer:"buf", why:"Half is converted: 0.10 mol HA + 0.10 mol A⁻.",
            wrong:{ not:"React first: 0.10 mol of the acid is left and 0.10 mol of A⁻ is made." },
            hints:[SH1, SH2, "Buffer: half is converted, 0.10 mol HA + 0.10 mol A⁻."] },
          { id:"i10", t:"0.20 mol NH₃ + 0.10 mol HCl ★", answer:"buf", why:"0.10 mol NH₃ + 0.10 mol NH₄⁺.",
            wrong:{ not:"React first: HCl turns 0.10 mol of NH₃ into NH₄⁺, and 0.10 mol of NH₃ is left." },
            hints:[SH1, SH2, "Buffer: 0.10 mol NH₃ + 0.10 mol NH₄⁺."] }
        ] },
      { id:"calc", type:"numeric", title:"Buffer calculations", summary:"Buffer calculations", goal:[3, 4, 5],
        instruction:"Six calculations, each in 1.00 L. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number (pH to 2 decimal places, amounts in mol), then press Check.",
        items:[
          { id:"b1", goal:3, prompt:"pH of 0.20 mol ethanoic acid + 0.10 mol ethanoate in 1.00 L", answer:4.44, tol:0.0009, display:"pH 4.44",
            use:`Use these values: ${PKA}(ethanoic acid) = 4.74; ${LOGS}.`,
            why:"pH = 4.74 + log(0.10 ÷ 0.20) = 4.74 − 0.30 = 4.44.",
            wrong:[{ match:5.04, fb:M4 }], general:"Use pH = " + PKA + " + log(base ÷ acid).",
            hints:[B1H, B2H, "pH = 4.74 + log(0.10 ÷ 0.20) = 4.74 − 0.30 = 4.44."] },
          { id:"b2", goal:3, prompt:"pH of 0.10 mol NH₄Cl + 0.20 mol NH₃ in 1.00 L", answer:9.56, tol:0.0004, display:"pH 9.56",
            use:`Use these values: ${PKA}(NH₄⁺) = 9.26, p<i>K</i><sub>b</sub>(NH₃) = 4.74; ${LOGS}.`,
            why:"pH = 9.26 + log(0.20 ÷ 0.10) = 9.26 + 0.30 = 9.56.",
            wrong:[{ match:8.96, fb:M4 }, { match:5.04, fb:`Use ${PKA}(NH₄⁺) = 9.26, not p<i>K</i><sub>b</sub>.` }], general:"Use pH = " + PKA + " + log(base ÷ acid).",
            hints:[B1H, B2H, "pH = 9.26 + log(0.20 ÷ 0.10) = 9.26 + 0.30 = 9.56."] },
          { id:"b3", goal:4, prompt:"HX buffer (0.10 mol each) + 0.020 mol NaOH", answer:5.18, tol:0.0009, display:"pH 5.18",
            use:`Use these values: ${PKA}(HX) = 5.00 (model acid); log 2 = 0.30, log 3 = 0.48.`,
            why:"OH⁻ turns HX into X⁻: X⁻ 0.12, HX 0.080. pH = 5.00 + log(0.12 ÷ 0.080) = 5.00 + 0.18 = 5.18.",
            wrong:[{ match:4.82, fb:"Base turns HX into X⁻: X⁻ goes <strong>up</strong>, HX goes <strong>down</strong>, and the pH rises." }], general:"React first, then use the buffer equation.",
            hints:[B1H, B2H, "X⁻ 0.12, HX 0.080: pH = 5.00 + log(3/2) = 5.00 + 0.48 − 0.30 = 5.18."] },
          { id:"b4", goal:4, star:true, prompt:"Which ratio [A⁻] : [HA] gives pH 5.74 with ethanoic acid? (Enter the number before : 1.)", answer:10, display:"10 : 1",
            use:`Use these values: ${PKA}(ethanoic acid) = 4.74.`, label:"[A⁻] : [HA] =", unit:": 1",
            why:"5.74 − 4.74 = 1 = log 10, so [A⁻] : [HA] = 10 : 1.",
            wrong:[{ match:0.1, fb:M4 }, { match:1, fb:"That gives 4.74." }], general:"Find log(ratio) first.",
            hints:[B1H, B2H, "log(ratio) = 5.74 − 4.74 = 1, so the ratio is 10 : 1."] },
          { id:"b5", goal:4, star:true, prompt:"How many moles of NaOH must be added to 0.30 mol of ethanoic acid (1.00 L) to make a buffer at pH 4.74?", answer:0.15, tol:0.001, display:"0.15 mol", unit:"mol",
            use:`Use these values: ${PKA}(ethanoic acid) = 4.74.`,
            why:"pH = " + PKA + " needs equal amounts: convert half of the 0.30 mol, so 0.15 mol NaOH gives 0.15 mol HA + 0.15 mol A⁻.",
            wrong:[{ match:0.3, fb:"That converts all the acid: no buffer left." }], general:"What ratio does pH = " + PKA + " need?",
            hints:[`pH = ${PKA} means equal amounts.`, "Convert half the acid into A⁻.", "0.15 mol NaOH."] },
          { id:"b6", goal:5, star:true, prompt:"The HX buffer (0.10 mol each): what is the most HCl it can absorb while keeping pH ≥ 4.52?", answer:0.05, tol:0.001, display:"0.050 mol", unit:"mol",
            use:`Use these values: ${PKA}(HX) = 5.00 (model acid); log 3 = 0.48.`,
            why:"(0.10 − <i>a</i>) ÷ (0.10 + <i>a</i>) ≥ 1/3 gives <i>a</i> ≤ 0.050 mol.",
            wrong:[{ match:0.1, fb:"At 0.10 mol the base is gone and the pH is 2.85. " + M6 }], general:"Set up the ratio after adding <i>a</i> mol of HCl.",
            hints:["4.52 − 5.00 = −0.48 = log(1/3).", "(0.10 − <i>a</i>) ÷ (0.10 + <i>a</i>) ≥ 1/3.", "0.30 − 3<i>a</i> ≥ 0.10 + <i>a</i>, so <i>a</i> ≤ 0.050 mol."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Esther", how:"",
        instruction:"Esther made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:`Find the pH after 0.020 mol HCl is added to 1.00 L of buffer containing 0.10 mol HX and 0.10 mol X⁻ (${PKA} 5.00).`,
            steps:["H₃O⁺ reacts with X⁻: X⁻ + H₃O⁺ → HX + H₂O.", `${n}(X⁻) = 0.10 + 0.020 = 0.12; ${n}(HX) = 0.10 − 0.020 = 0.080.`, "pH = 5.00 + log(0.12 ÷ 0.080) = 5.18."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. An acid can’t raise the pH."],
            fixes:[
              { t:`X⁻ is used up and HX is made: ${n}(X⁻) = 0.080, ${n}(HX) = 0.12, so pH = 5.00 + log(2/3) = 4.82.`, ok:true, why:M3 },
              { t:"Both stay at 0.10, so pH = 5.00.", why:M2 },
              { t:`${n}(X⁻) = 0.080, ${n}(HX) = 0.10.`, why:"HX gains what X⁻ loses." },
              { t:"Step 2 is correct.", why:"Adding acid can’t raise the pH. " + M3 }],
            hints:["Which species does step 1 use up?", "X⁻ goes down; HX goes up.", "0.080 and 0.12: pH 4.82."] },
          { id:"e2", goal:5, task:"Prepare a long-lasting pH 7.5 buffer.",
            steps:["Target pH 7.5.", `Choose HOCl/OCl⁻ (${PKA} 7.52).`, "Mix 0.10 mol HOCl and 0.10 mol NaOCl in 1.00 L: pH 7.52.", "Dilute it to 10.0 L to make the buffer last longer.", "The pH stays at 7.52 and the capacity increases."],
            answer:3,
            stepFb:["Step 1 is correct.", `Step 2 is correct: ${PKA} is close to the target.`, "Step 3 is correct.", "", "Step 5 follows from step 4."],
            fixes:[
              { t:"Diluting keeps the pH but lowers the capacity per litre. For more capacity, use more of both components (for example, 0.40 mol each in 1.00 L).", ok:true, why:M5 },
              { t:"Diluting changes the pH to 7.00.", why:M5 },
              { t:"Add more HOCl only.", why:"That changes the ratio and the pH." },
              { t:"Step 4 is correct.", why:"Less of each component per litre means less acid or base can be absorbed. " + M5 }],
            hints:["What sets capacity?", "The amount of each component present.", "More of both, not more water."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most when you attacked water and the buffer with the same acid?" },
      { id:"j2", q:"In your own words, explain why a buffer’s pH changes only a little, but does change." },
      { id:"j3", q:"Explain to a friend how to choose a buffer pair for a target pH, and how to make it stronger." },
      { id:"j4", q:"Which part of buffer calculations is still shaky for you: the reaction step, the ratio, or the log? What will you practise?" }
    ]
  },
  final:{
    intro:`This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. You may use these values: ${PKA} of methanoic acid 3.74, benzoic acid 4.20, ethanoic acid 4.74, hypochlorous acid 7.52, ammonium 9.26; ${LOGS}.`,
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which mixture is a buffer?", options:[
          { t:"CH₃COOH and CH₃COONa", ok:true, why:"A weak acid and its conjugate base." },
          { t:"HCl and NaCl", why:M1 },
          { t:"NaOH and NaCl", why:"Strong base with spectators." },
          { t:"HNO₃ and KNO₃", why:M1.replace("Cl⁻", "NO₃⁻") }] },
        b:{ prompt:"Which mixture is a buffer?", options:[
          { t:"NH₃ and NH₄Cl", ok:true, why:"A weak base and its conjugate acid." },
          { t:"HCl and KCl", why:M1 },
          { t:"KOH and KCl", why:"Strong base with spectators." },
          { t:"HNO₃ and NaNO₃", why:M1.replace("Cl⁻", "NO₃⁻") }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A little strong acid is added to an ethanoic acid / ethanoate buffer. What happens?", options:[
          { t:"CH₃COO⁻ reacts with H₃O⁺ to form CH₃COOH and water.", ok:true, why:"The base form uses up the added acid." },
          { t:"CH₃COOH reacts with the H₃O⁺.", why:"An acid doesn’t use up an acid." },
          { t:"Na⁺ removes the acid.", why:"Na⁺ is a spectator." },
          { t:"Nothing reacts, so the pH stays exactly the same.", why:M2 }] },
        b:{ prompt:"A little strong base is added to the same buffer. What happens?", options:[
          { t:"CH₃COOH reacts with OH⁻ to form CH₃COO⁻ and water.", ok:true, why:"The acid form uses up the added base." },
          { t:"CH₃COO⁻ reacts with the OH⁻.", why:"A base doesn’t use up a base: added OH⁻ turns HA into A⁻." },
          { t:"Water removes the base.", why:"Water alone isn’t a buffer." },
          { t:"Nothing reacts.", why:M2 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A buffer contains equal moles of HX and X⁻. Its pH is…", options:[
          { t:`equal to ${PKA}`, ok:true, why:`log 1 = 0, so pH = ${PKA}.` },
          { t:"7.00", why:`Only if ${PKA} happens to be 7.` },
          { t:`${PKA} ÷ 2`, why:"log 1 = 0; no halving." },
          { t:`14.00 − ${PKA}`, why:"That’s p<i>K</i><sub>b</sub>." }] },
        b:{ prompt:"In a buffer, [A⁻] ÷ [HA] = 10. Its pH is…", options:[
          { t:`${PKA} + 1`, ok:true, why:"log 10 = 1." },
          { t:`${PKA} − 1`, why:M4 },
          { t:`10 × ${PKA}`, why:"Add log 10, don’t multiply." },
          { t:`${PKA} + 10`, why:"log 10 = 1." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:`Find the pH of 1.00 L containing 0.10 mol ethanoic acid and 0.20 mol sodium ethanoate (${PKA} 4.74).`, options:[
          { t:"5.04", ok:true, why:"4.74 + log 2." },
          { t:"4.44", why:M4 },
          { t:"4.74", why:"The amounts aren’t equal." },
          { t:"9.26", why:`That’s ${PKA} of ammonium.` }] },
        b:{ prompt:`Find the pH of 1.00 L containing 0.20 mol NH₄Cl and 0.10 mol NH₃ (${PKA} of NH₄⁺ 9.26).`, options:[
          { t:"8.96", ok:true, why:"9.26 + log(1/2)." },
          { t:"9.56", why:M4 },
          { t:"4.44", why:"That uses p<i>K</i><sub>b</sub> (4.74) with the ratio." },
          { t:"9.26", why:"The amounts aren’t equal." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:`1.00 L of buffer holds 0.10 mol HX and 0.10 mol X⁻ (${PKA} 5.00). 0.050 mol HCl is added. Find the pH.`, options:[
          { t:"4.52", ok:true, why:"X⁻ 0.050, HX 0.15: log(1/3) = −0.48." },
          { t:"5.48", why:"Acid lowers pH. " + M3 },
          { t:"1.30", why:"That would be water. The buffer absorbs this amount." },
          { t:"5.00", why:M2 }] },
        b:{ prompt:"The same buffer gets 0.050 mol NaOH. Find the pH.", options:[
          { t:"5.48", ok:true, why:"X⁻ 0.15, HX 0.050: log 3 = 0.48." },
          { t:"4.52", why:"Base raises the pH: added OH⁻ turns HX into X⁻." },
          { t:"12.70", why:"That would be water." },
          { t:"5.00", why:M2 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Buffer P has 0.10 mol each of ethanoic acid and ethanoate in 1.00 L; buffer Q has 0.010 mol each in 1.00 L. Both are at pH 4.74. 0.020 mol HCl is added to each. Which is true?", options:[
          { t:"P falls to about 4.56; Q’s capacity is exceeded and its pH drops below 3.", ok:true, why:"Q has only 0.010 mol of ethanoate to use up 0.020 mol of acid." },
          { t:"Both stay at 4.74.", why:M2 },
          { t:"Both fall to about 4.56, because only the ratio matters.", why:"The ratio rule needs both components left. " + M6 },
          { t:"Q changes less, because it’s more dilute.", why:M5 }] },
        b:{ prompt:"The same buffers each get 0.015 mol NaOH. Which is true?", options:[
          { t:"P rises to about 4.87; Q’s capacity is exceeded and its pH rises above 11.", ok:true, why:"Q has only 0.010 mol of ethanoic acid." },
          { t:"Both stay at 4.74.", why:M2 },
          { t:"Both rise to about 4.87.", why:"The ratio rule needs both components left. Once HA is used up, the extra OH⁻ stays in solution and the pH rises sharply." },
          { t:"Q changes less.", why:M5 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why a buffer resists pH change?", options:[
          { t:"“It has a weak acid to use up added OH⁻ and a conjugate base to use up added H₃O⁺, so the added ions are removed and the ratio changes only a little.”", ok:true, why:"Both jobs and the small ratio change are named." },
          { t:"“It neutralizes any amount of acid or base completely.”", why:M6 },
          { t:"“Buffers are at pH 7, so they’re neutral.”", why:`Buffers can have any pH near their ${PKA}.` },
          { t:"“The water in the buffer absorbs the H⁺.”", why:"Water alone shows a large pH change." }] },
        b:{ prompt:"Which is the best explanation of why diluting a buffer barely changes its pH?", options:[
          { t:`“[HA] and [A⁻] fall by the same factor, so their ratio, and pH = ${PKA} + log(ratio), stays the same.”`, ok:true, why:"The ratio sets the pH." },
          { t:"“Water is neutral, so it pulls the pH toward 7 only slightly.”", why:"The ratio, not the water, sets the pH." },
          { t:"“Diluting raises the capacity.”", why:M5 },
          { t:"“Dilution has no effect on any solution’s pH.”", why:"It does for strong acids." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which acid–base pair is the best choice for a buffer at pH 3.8?", options:[
          { t:`Methanoic acid / methanoate (${PKA} 3.74)`, ok:true, why:`Its ${PKA} is closest to 3.8.` },
          { t:"Ethanoic acid / ethanoate (4.74)", why:"One unit away; usable, but not the best." },
          { t:"Hypochlorous acid / hypochlorite (7.52)", why:M7 },
          { t:"Ammonium / ammonia (9.26)", why:M7 }] },
        b:{ prompt:"Which is the best choice for a buffer at pH 7.5?", options:[
          { t:"Hypochlorous acid / hypochlorite (7.52)", ok:true, why:`Its ${PKA} is closest to 7.5.` },
          { t:"Ethanoic acid / ethanoate (4.74)", why:M7 },
          { t:"Ammonium / ammonia (9.26)", why:M7 },
          { t:"Benzoic acid / benzoate (4.20)", why:M7 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"For blood, use pH = 6.1 + log([HCO₃⁻] ÷ [H₂CO₃]). In a patient the ratio falls from 20 : 1 to 10 : 1. What is the blood pH now?", options:[
          { t:"7.10", ok:true, why:"6.1 + log 10 = 7.10: acidosis (model)." },
          { t:"7.40", why:M2 },
          { t:"7.70", why:"The ratio fell, so the pH falls." },
          { t:"6.10", why:"log 10 = 1, not 0." }] },
        b:{ prompt:"The ratio rises to 40 : 1. What is the blood pH now?", options:[
          { t:"7.70", ok:true, why:"6.1 + log 40 = 6.1 + 1.60." },
          { t:"7.10", why:"The ratio rose." },
          { t:"7.40", why:M2 },
          { t:"8.10", why:"log 40 = 1.60, not 2.00." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A lab needs 1.00 L of buffer at pH 5.04, made from 0.30 mol ethanoic acid and solid NaOH. How much NaOH should it add?", options:[
          { t:"0.20 mol", ok:true, why:`pH − ${PKA} = 0.30, so A⁻ : HA = 2 : 1. Of 0.30 mol, A⁻ = 0.20 and HA = 0.10.` },
          { t:"0.10 mol", why:"That gives a ratio of 1 : 2 (pH 4.44). " + M4 },
          { t:"0.15 mol", why:"That gives pH 4.74." },
          { t:"0.30 mol", why:"That converts everything: no buffer." }] },
        b:{ prompt:"A buffer at pH 4.44 from 0.30 mol ethanoic acid. How much NaOH?", options:[
          { t:"0.10 mol", ok:true, why:"Ratio 1 : 2: A⁻ = 0.10, HA = 0.20." },
          { t:"0.20 mol", why:M4 },
          { t:"0.15 mol", why:"That gives pH 4.74." },
          { t:"0.050 mol", why:"That gives a ratio of 1 : 5." }] } }
    ]
  },
  task:{
    title:"Design a buffer", summary:"Design a buffer",
    statement:"<p>An enzyme experiment needs a buffer near pH 5.0. Choose the acid–base pair and the amounts so that every condition is met. There’s more than one good design.</p><ol class=\"bf-conds\"><li>pH between 4.85 and 5.15.</li><li>After a test dose of 0.030 mol HCl, the pH falls by no more than 0.30.</li><li>Total solute (acid form + base form) is at most 0.50 mol, to keep cost down.</li></ol>",
    checks:["pH 4.85–5.15", "Holds within 0.30", "Total ≤ 0.50 mol"],
    tips:[`Pick a pair with ${PKA} within about 0.5 of 5.0, then set the ratio.`, "More of both components means a smaller drop. Check the drop after 0.030 mol.", "Too much of both breaks the budget. Find the smallest amounts that still hold."],
    explainPrompt:"Explain how you chose the pair and the amounts, and why your buffer holds against the test dose.",
    vocab:`Use the words ${PKA}, ratio, conjugate base and capacity.`,
    more:"There are four answers. Can you find them all?",
    afterAt:4,
    after3:`Every answer combines a ${PKA} near 5 (or a ratio that moves it there) with enough of the base form to absorb the dose.`
  },
  cards:[
    ["Buffer", "A weak acid + its conjugate base (or weak base + conjugate acid) that resists pH change."],
    ["Added H₃O⁺", "Used up by the base form: A⁻ + H₃O⁺ → HA + H₂O."],
    ["Added OH⁻", "Used up by the acid form: HA + OH⁻ → A⁻ + H₂O."],
    ["Buffer equation", `pH = ${PKA} + log([A⁻] ÷ [HA]); moles can be used in the ratio.`],
    ["Equal amounts", `pH = ${PKA}.`],
    ["Ratio 10 : 1", `pH = ${PKA} + 1 (and 1 : 10 gives ${PKA} − 1).`],
    ["Choosing a pair", `${PKA} within about 1 of the target pH (closer is better).`],
    ["Capacity", "How much acid or base it can absorb; set by the amounts of both components."],
    ["Capacity exceeded", "One component is used up; the pH changes sharply."],
    ["Diluting a buffer", "Same ratio, same pH; lower capacity."],
    ["Making a buffer from a weak acid", `Add strong base to convert part of HA into A⁻ (half gives pH = ${PKA}).`],
    ["Blood buffer", `H₂CO₃ / HCO₃⁻, ratio about 20 : 1, pH about 7.40 (effective ${PKA} 6.1 at 37 °C).`]
  ]
};
