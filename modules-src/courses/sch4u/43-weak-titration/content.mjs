// SCH4U 43 Weak Acid/Base Titration. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/43-weak-titration.md
// The titration lab (C9 weak mode), the hero curves, the Part 3 stations, the tap-the-curve activity and the task preview
// are drawn by app.js. Every constant comes from MV.chem.data in app.js (pinned 2-decimal pKa values, plan §6 risk 1–2).

const Ka = "<i>K</i><sub>a</sub>", Kb = "<i>K</i><sub>b</sub>", Kw = "<i>K</i><sub>w</sub>";
const pKa = "p" + Ka, pKb = "p" + Kb, n = "<i>n</i>", x = "<i>x</i>", c = "<i>c</i>", V = "<i>V</i>";

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "At equivalence the flask holds A⁻, the conjugate base of a weak acid, so it’s basic.";
const M2 = "OH⁻ removes H⁺, and HA keeps ionizing to replace it. Every HA is used: same moles, same volume.";
const M3 = `At half-equivalence [B] = [BH⁺], so pH = ${pKa}(BH⁺) = 14.00 − ${pKb}.`;
const M4 = `pH = ${pKa} + log(base form ÷ acid form). More A⁻ means a higher pH.`;
const M5 = "The equivalence pH here is 8.85. Phenolphthalein (8.2–10.0) brackets it.";
const M6 = `${pKa} belongs to half-equivalence. At equivalence, solve the hydrolysis of A⁻, then convert pOH to pH.`;
const M7 = "The titration gives the diluted concentration. Multiply by the dilution factor to get the original.";

const USE_W = "log 2 = 0.30, log 3 = 0.48, log 1.8 = 0.26";
const USE_X = `log 2 = 0.30, log 3 = 0.48, log 7.1 = 0.85; √(5.0 × 10⁻¹¹) = 7.1 × 10⁻⁶; ${pKa}: ethanoic acid 4.74, NH₄⁺ 9.26`;

export default {
  id:"43-weak-titration",
  kind:"topic",
  title:"Weak acid/base titration",
  topic:"Weak Acid/Base Titration",
  readyTopic:"weak acid and weak base titrations",
  hero:{
    eq:'<span class="nw">CH₃COOH(aq) + OH⁻(aq)</span> <span class="nw">→ CH₃COO⁻(aq) + H₂O(l)</span><span class="wt-hsub">at half-equivalence: pH = ' + pKa + "</span>", eqSize:"sm",
    eqLabel:"C H 3 C O O H aqueous plus O H minus aqueous gives C H 3 C O O minus aqueous plus water. At half-equivalence, p H equals p K a.",
    headline:`A weak acid’s titration curve gives away its ${Ka}.`,
    text:`Titrate a <strong>weak acid</strong> with a strong base and the curve tells a story: a gentle <strong>buffer region</strong>, a <strong>half-equivalence point</strong> where pH equals ${pKa}, and an <strong>equivalence point above 7</strong>. Read the curve, and you can identify the acid.`,
    fig:{ shape:"wide", aria:"Two titration curves, pH against volume of 0.18 mol/L NaOH added. The 0.18 mol/L HCl curve (dashed) starts at pH 0.74. The 0.18 mol/L ethanoic acid curve (blue) starts higher, at pH 2.74, rises quickly, flattens into a buffer region, then jumps. At 12.5 mL its pH is 4.74, equal to pKa. At 25.0 mL, equivalence, its pH is 8.85, above 7. Beyond equivalence both curves meet." }
  },
  goals:[
    "I can describe how a weak acid–strong base curve differs from a strong–strong curve, and explain why.",
    "I can explain why the equivalence volume depends only on moles, not on acid strength.",
    "I can calculate the pH at the start, in the buffer region, at equivalence and after equivalence.",
    "I can choose an indicator from the equivalence pH.",
    `I can find ${Ka} (or ${Kb}) from the half-equivalence point and identify an unknown acid or base.`,
    "I can use a weak acid titration to analyse a real product such as vinegar."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Weak acid pH", goal:3, use:USE_W,
          prompt:`Find the pH of 0.18 mol/L ethanoic acid (${Ka} = 1.8 × 10⁻⁵).`,
          options:[
            { t:"2.74", ok:true, why:`${x}² = 3.24 × 10⁻⁶, ${x} = 1.8 × 10⁻³, pH = 3 − 0.26.` },
            { t:"0.74", why:"That’s −log 0.18: it treats ethanoic acid as strong." },
            { t:"4.74", why:`${pKa} is the pH at half-equivalence, not at the start.` },
            { t:"5.49", why:"−log(3.24 × 10⁻⁶) ≈ 5.49; take √ first." }],
          hints:[`${x}² = ${Ka} × ${c}.`, `${x} = √(3.24 × 10⁻⁶) = 1.8 × 10⁻³.`, "pH = 3 − log 1.8 = 2.74."] },
        { id:"w2", skill:"Weak acid pH", goal:5, use:USE_W,
          prompt:`${Ka} = 1.8 × 10⁻⁵. What is ${pKa}?`,
          options:[
            { t:"4.74", ok:true, why:"−log(1.8 × 10⁻⁵) = 5 − 0.26." },
            { t:"5.26", why:"5 − log 1.8, not 5 + log 1.8." },
            { t:"−4.74", why:"p means −log." },
            { t:"1.80", why:"Take the log." }],
          hints:[`${pKa} = −log ${Ka}.`, "−log(1.8 × 10⁻⁵) = 5 − log 1.8.", "4.74."] },
        { id:"w3", skill:"Conjugate base hydrolysis", goal:3,
          prompt:"Is a 0.090 mol/L sodium ethanoate solution acidic, basic or neutral?",
          options:[
            { t:"Basic", ok:true, why:"Ethanoate takes H⁺ from water and leaves OH⁻." },
            { t:"Neutral", why:"Ethanoate comes from a weak acid." },
            { t:"Acidic", why:"The salt holds its conjugate base." },
            { t:"It depends on the indicator", why:"Indicators only show pH." }],
          hints:["Which ion reacts with water?", "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻.", "Basic."] },
        { id:"w4", skill:"Logs", goal:3, use:USE_W,
          prompt:"log 4 = ?",
          options:[
            { t:"0.60", ok:true, why:"log 4 = 2 log 2." },
            { t:"0.40", why:"log 4 ≠ 0.4." },
            { t:"0.90", why:"That’s log 8." },
            { t:"1.20", why:"That doubles twice: log 4 = 2 × 0.30." }],
          hints:["4 = 2².", "log 2² = 2 log 2.", "0.60."] },
        { id:"w5", skill:"Logs", goal:3, use:USE_W,
          prompt:"log(1/4) = ?",
          options:[
            { t:"−0.60", ok:true, why:"log(1/4) = −log 4." },
            { t:"0.25", why:"Logs of numbers below 1 are negative." },
            { t:"0.60", why:"Keep the minus sign: log(1/4) = −log 4." },
            { t:"−0.25", why:"That’s the fraction with a minus sign. Take the log: −log 4." }],
          hints:["log(1/<i>a</i>) = −log <i>a</i>.", "−log 4.", "−0.60."] },
        { id:"w6", skill:"Titration stoichiometry", goal:2,
          prompt:"How many mL of 0.18 mol/L NaOH neutralize 25.0 mL of 0.18 mol/L HCl?",
          options:[
            { t:"25.0 mL", ok:true, why:"4.50 mmol ÷ 0.18 mol/L." },
            { t:"12.5 mL", why:"Same concentration, so same volume." },
            { t:"50.0 mL", why:"Same concentration and a 1 : 1 reaction, so the same volume, not double." },
            { t:"4.50 mL", why:"4.50 is the amount in mmol, not a volume." }],
          hints:[`${n}(HCl) = 0.18 × 25.0 = 4.50 mmol.`, `${V} = ${n} ÷ ${c}.`, "25.0 mL."] }
      ],
      refreshers:{
        "Weak acid pH":`${x}² = ${Ka} × ${c}, 5% check, pH = −log ${x}. ${pKa} = −log ${Ka}.`,
        "Conjugate base hydrolysis":`A⁻ + H₂O ⇌ HA + OH⁻; ${Kb} = ${Kw} ÷ ${Ka} (module 41).`,
        "Logs":"log 2 = 0.30, log 4 = 0.60, log 8 = 0.90, log(1/2) = −0.30. log(<i>ab</i>) = log <i>a</i> + log <i>b</i>.",
        "Titration stoichiometry":`Equivalence: ${n}(OH⁻) = ${n}(acid) for a monoprotic acid. ${V} = ${n} ÷ ${c}.`
      }
    }
  },
  explore:{
    heading:"Titration lab: weak mode",
    intro:"Titrate a weak acid or base. Compare it with a strong one, find the half-equivalence point, and see why the equivalence point isn’t at 7.",
    how:"Choose what’s in the flask and the titrant concentration, then add titrant with the burette buttons. <strong>Lab</strong> shows the flask and lets you record readings; <strong>Curve</strong> plots the curve with a movable probe (arrow keys: 0.5 mL, Shift: 0.05 mL); <strong>Calculate</strong> shows the method and working for the volume in the burette.",
    flaskNote:"Flask: 25.0 mL at 0.18 mol/L (fixed for the reference curves).",
    use:`${pKa} values: methanoic acid 3.74 · benzoic acid 4.20 · ethanoic acid 4.74 · hypochlorous acid 7.52 · NH₄⁺ 9.26 (= 14.00 − 4.74).<br>Logs: log 2 = 0.30, log 3 = 0.48, log 7.1 = 0.85.<br>Square root: √(5.0 × 10⁻¹¹) = 7.1 × 10⁻⁶.`,
    predictions:[
      { id:"p1", prompt:"Which needs more 0.18 mol/L NaOH to reach equivalence: 25.0 mL of 0.18 mol/L ethanoic acid or 25.0 mL of 0.18 mol/L HCl?",
        options:[{ t:"The same (25.0 mL each)", ok:true }, { t:"ethanoic acid needs less" }, { t:"ethanoic acid needs more" }, { t:"ethanoic acid never reaches equivalence" }],
        explain:"OH⁻ keeps pulling HA ⇌ H⁺ + A⁻ forward until every HA is used. " + M2 },
      { id:"p2", prompt:"At 12.5 mL (half-equivalence), the pH will be:",
        options:[{ t:`4.74, equal to ${pKa}`, ok:true }, { t:"7.00" }, { t:"2.74" }, { t:"8.85" }],
        explain:`Equal amounts make log(1) = 0, so pH = ${pKa}.` },
      { id:"p3", prompt:"At equivalence (25.0 mL), the pH will be:",
        options:[{ t:"above 7", ok:true }, { t:"exactly 7" }, { t:"below 7" }, { t:`equal to ${pKa}` }],
        explain:"Only CH₃COO⁻ and Na⁺ remain, and ethanoate is a base. " + M1 },
      { id:"p4", prompt:"Where is the equivalence pH for ammonia titrated with HCl?",
        options:[{ t:"below 7", ok:true }, { t:"exactly 7" }, { t:"above 7" }, { t:"9.26" }],
        explain:"At equivalence the flask holds NH₄⁺, an acid." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. Type pH values in the <strong>Your pH</strong> box. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"Find the half-equivalence point of the ethanoic acid titration and read the pH there.",
        why:`Half of 25.0 mL is 12.5 mL. There ${n}(HA) = ${n}(A⁻) = 2.25 mmol, so pH = ${pKa} = 4.74.`,
        hints:["Equivalence is at 25.0 mL.", "Half of 25.0 is 12.5 mL.", `pH there = ${pKa} = 4.74.`] },
      { id:"tc2", goal:[4, 5], prompt:"Mystery acid: the m&#101;ter shows pH 4.20 at half-equivalence. Identify the acid, then choose the indicator for its titration.",
        why:`pH at half-equivalence = ${pKa} = 4.20: benzoic acid. Its equivalence pH is 8.58, inside phenolphthalein’s range (8.2–10.0).`,
        hints:[`pH at half-equivalence = ${pKa}.`, `Match 4.20 in the ${pKa} list.`, "Benzoic acid; equivalence 8.58, so phenolphthalein."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Ethanoic acid, m&#101;ter off. (a) Add exactly the volume of NaOH that makes the pH 5.34. (b) Then predict the pH at 5.0 mL and type it in.",
        why:`(a) 5.34 − 4.74 = 0.60 = log 4, so ${n}(A⁻) ÷ ${n}(HA) = 4: 3.60 mmol of OH⁻, which is 20.0 mL. (b) At 5.0 mL the ratio is 1/4, so pH = 4.74 − 0.60 = 4.14.`,
        hints:[`5.34 − 4.74 = 0.60 = log 4, so ${n}(A⁻) ÷ ${n}(HA) = 4.`, "4.50 mmol in total: A⁻ = 3.60, HA = 0.90. A⁻ comes from OH⁻ added: 3.60 mmol ÷ 0.18 mol/L.", "(a) 20.0 mL. (b) At 5.0 mL, A⁻ = 0.90 and HA = 3.60, so the ratio is 1/4 and pH = 4.74 − 0.60 = 4.14."] }
    ]
  },
  part3:{
    slug:"half-equivalence", name:`Find <i>K</i><sub>a</sub>`, heading:`Find ${Ka} from a curve`,
    intro:"The half-equivalence point is the most useful reading on a weak acid curve. Three stations: identify acids from finished curves, analyse a vinegar titration, and mirror the method for a weak base.",
    s1:{ title:"Station 1: Name that acid",
      intro:`Four unlabelled curves, all 25.0 mL of 0.18 mol/L acid with 0.18 mol/L NaOH. Choose a curve, drag the probe to its half-equivalence point (12.5 mL), read the pH, and match it to the ${pKa} list: 3.74 methanoic, 4.20 benzoic, 4.74 ethanoic, 7.52 hypochlorous.`,
      data:`${Ka} = 10<sup>−${pKa}</sup>, so 10<sup>−4.20</sup> = 6.3 × 10⁻⁵ matches the course table for benzoic acid.` },
    s2:{ title:"Station 2: How strong is this vinegar?",
      intro:"10.0 mL of vinegar is diluted to 100.0 mL. A 25.0 mL portion needs 20.0 mL of 0.100 mol/L NaOH to reach the phenolphthalein endpoint.",
      use:"0.800 × 60 ≈ 48",
      compare:"A label claiming “5% acidity” is within the expected uncertainty of this result (about 4.8%, mass per volume)." },
    s3:{ title:"Station 3: The weak-base mirror",
      intro:"The ammonia curve: 25.0 mL of 0.18 mol/L NH₃ titrated with 0.18 mol/L HCl. Move the probe to 12.5 mL, then zoom to the particles." },
    quickCheck:{
      title:"Quick check", summary:`Find <i>K</i><sub>a</sub> quick check`,
      items:[
        { id:"q1", goal:5, prompt:"Half-equivalence pH 3.74. Which acid?",
          choices:[
            { t:"methanoic", ok:true, fb:`Right. pH at half-equivalence = ${pKa} = 3.74: methanoic acid.` },
            { t:"ethanoic", fb:`Match pH to ${pKa}.` },
            { t:"benzoic", fb:`Match pH to ${pKa}.` },
            { t:"hypochlorous", fb:`Match pH to ${pKa}.` }] },
        { id:"q2", goal:6, prompt:"Vinegar diluted tenfold gives 0.0800 mol/L. Original?",
          choices:[
            { t:"0.800 mol/L", ok:true, fb:"Right. 0.0800 × 10 = 0.800 mol/L." },
            { t:"0.0800 mol/L", fb:"Multiply by the dilution factor. " + M7 },
            { t:"8.00 mol/L", fb:"Multiply by the dilution factor: ×10, not ×100." },
            { t:"0.00800 mol/L", fb:"Multiply by the dilution factor; don’t divide." }] },
        { id:"q3", goal:5, prompt:`Weak base: half-equivalence pH 9.26. ${pKb}?`,
          choices:[
            { t:"4.74", ok:true, fb:`Right. 9.26 is ${pKa}(BH⁺), so ${pKb} = 14.00 − 9.26 = 4.74.` },
            { t:"9.26", fb:"14.00 − 9.26. " + M3 },
            { t:"7.00", fb:"14.00 − 9.26. " + M3 },
            { t:"2.74", fb:"14.00 − 9.26. " + M3 }] },
        { id:"q4", goal:4, prompt:"Which indicator suits the vinegar titration?",
          choices:[
            { t:"phenolphthalein", ok:true, fb:"Right. A weak acid with a strong base has its equivalence point above 8, inside 8.2–10.0." },
            { t:"methyl orange", fb:"Weak acid with strong base: the equivalence point is above 8." },
            { t:"methyl red", fb:"Weak acid with strong base: the equivalence point is above 8." },
            { t:"bromothymol blue", fb:"Weak acid with strong base: the equivalence point is above 8." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tap", type:"custom", title:"Tap the curve", summary:"Tap the curve", goal:[1, 3],
        instruction:"The ethanoic acid curve with 0.18 mol/L NaOH. Tap the curve where each statement is true.",
        how:"Tap the curve (or move the cursor with the slider and press <strong>Tap here</strong>). Points need to be within 0.5 mL; regions accept anywhere inside.",
        hints:["Find equivalence first (25.0 mL).", `Halve it for ${pKa}.`],
        items:[
          { id:"t1", goal:[1, 3], prompt:`Tap where pH = ${pKa}.`, region:"Half-equivalence, 12.5 mL: equal amounts of HA and A⁻." },
          { id:"t2", goal:1, prompt:"Tap the equivalence point.", region:"Equivalence, 25.0 mL: the middle of the jump." },
          { id:"t3", goal:[1, 3], prompt:"Tap anywhere the solution is a buffer.", region:"The buffer region, about 3–22 mL: HA and A⁻ are both present." },
          { id:"t4", goal:3, prompt:"Tap where only HA (and water) is present.", region:"The very start, 0 mL: no NaOH added yet." },
          { id:"t5", goal:3, prompt:"Tap where excess OH⁻ sets the pH.", region:"After equivalence, beyond 25.5 mL: OH⁻ is left over." },
          { id:"t6", goal:[1, 3], prompt:"Tap where the flask holds only Na⁺, CH₃COO⁻ and water.", region:"Equivalence, 25.0 mL: every HA has become A⁻, and no OH⁻ is left over." }
        ] },
      { id:"calc", type:"numeric", title:"Calculate the curve", summary:"Calculate the curve", star:true, goal:[3, 5],
        instruction:"25.0 mL of 0.18 mol/L ethanoic acid with 0.18 mol/L NaOH unless stated. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type the pH to 2 decimal places, then press Check.",
        items:[
          { id:"c1", goal:3, prompt:"pH before any NaOH is added.", answer:2.74, tol:0.0073, display:"pH = 2.74", label:"pH:", use:"log 1.8 = 0.26",
            why:`${x}² = ${Ka} × ${c} = 3.24 × 10⁻⁶, ${x} = 1.8 × 10⁻³, pH = 3 − 0.26 = 2.74.`,
            wrong:[{ match:[0.74], fb:"Ethanoic acid is weak." }],
            hints:[`Start: ICE with ${Ka}. ${x}² = ${Ka} × ${c}.`, `${x}² = 1.8 × 10⁻⁵ × 0.18 = 3.24 × 10⁻⁶, so ${x} = 1.8 × 10⁻³.`, "pH = 3 − log 1.8 = 2.74."] },
          { id:"c2", goal:3, prompt:"pH after 5.0 mL of NaOH.", answer:4.14, tol:0.0048, display:"pH = 4.14", label:"pH:", use:"log 4 = 0.60",
            why:`${n}(A⁻) = 0.90 mmol, ${n}(HA) = 3.60 mmol; pH = 4.74 + log(1/4) = 4.74 − 0.60 = 4.14.`,
            wrong:[{ match:[5.34], fb:"Ratio inverted. " + M4 }],
            hints:[`${n}(OH⁻) added = 0.18 × 5.0 = 0.90 mmol, so ${n}(A⁻) = 0.90 and ${n}(HA) = 4.50 − 0.90 = 3.60 mmol.`, `pH = ${pKa} + log(${n}(A⁻) ÷ ${n}(HA)) = 4.74 + log(1/4).`, "4.74 − 0.60 = 4.14."] },
          { id:"c3", goal:5, prompt:"pH after 12.5 mL of NaOH.", answer:4.74, tol:0.0042, display:"pH = 4.74", label:"pH:",
            why:`Half-equivalence: ${n}(HA) = ${n}(A⁻) = 2.25 mmol, so pH = ${pKa} = 4.74.`,
            wrong:[{ match:[7], fb:`Half-equivalence gives ${pKa}.` }],
            hints:["12.5 mL is half of the equivalence volume.", `${n}(HA) = ${n}(A⁻), so log(1) = 0.`, `pH = ${pKa} = 4.74.`] },
          { id:"c4", goal:3, star:true, prompt:"pH after 25.0 mL of NaOH (equivalence).", answer:8.85, tol:0.0023, display:"pH = 8.85", label:"pH:", use:USE_X,
            why:"0.090 mol/L ethanoate hydrolyzes: [OH⁻] = 7.1 × 10⁻⁶, pOH = 5.15, pH = 8.85.",
            wrong:[{ match:[7], fb:M1 }, { match:[5.15], fb:"That’s the pOH. " + M6 }, { match:[4.74], fb:M6 }],
            hints:["4.50 mmol of A⁻ in 50.0 mL: 0.090 mol/L.", `${Kb} = ${Kw} ÷ ${Ka} = 5.6 × 10⁻¹⁰; ${x}² = 5.0 × 10⁻¹¹.`, `${x} = 7.1 × 10⁻⁶, so pOH = 6 − 0.85 = 5.15 and pH = 8.85.`] },
          { id:"c5", goal:3, star:true, prompt:"pH after 35.0 mL of NaOH.", answer:12.48, tol:0.0016, display:"pH = 12.48", label:"pH:", use:USE_X,
            why:"Excess OH⁻ = 1.80 mmol in 60.0 mL = 0.030 mol/L; pOH = 1.52, pH = 12.48.",
            wrong:[{ match:[1.52], fb:"That’s the pOH. " + M6 }, { match:[12.71], fb:"Divide 1.80 mmol by the total 60.0 mL, not 35.0 mL." }],
            hints:["Excess OH⁻ = 6.30 − 4.50 = 1.80 mmol.", "÷ 60.0 mL = 0.030 mol/L.", "pOH = 2 − 0.48 = 1.52; pH = 12.48."] },
          { id:"c6", goal:[3, 5], star:true, prompt:"Ammonia (25.0 mL, 0.18 mol/L) with 0.18 mol/L HCl: pH at equivalence.", answer:5.15, tol:0.0039, display:"pH = 5.15", label:"pH:", use:USE_X,
            why:"0.090 mol/L NH₄⁺ is an acid: [H₃O⁺] = 7.1 × 10⁻⁶, pH = 5.15.",
            wrong:[{ match:[8.85], fb:"At equivalence the flask holds NH₄⁺, an acid." }],
            hints:[`${c}(NH₄⁺) = 0.090 mol/L.`, `${Ka}(NH₄⁺) = ${Kw} ÷ ${Kb} = 5.6 × 10⁻¹⁰; ${x}² = 5.0 × 10⁻¹¹.`, `${x} = [H₃O⁺] = 7.1 × 10⁻⁶; pH = 5.15.`] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Bao", how:"",
        instruction:"Bao made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the pH at equivalence when 25.0 mL of 0.18 mol/L ethanoic acid is titrated with 0.18 mol/L NaOH.",
            steps:["At equivalence, all 4.50 mmol of CH₃COOH has become CH₃COO⁻.", "Total volume 50.0 mL, so [CH₃COO⁻] = 0.090 mol/L.", "A salt was formed by neutralization, so the solution is neutral: pH = 7.00."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:`Ethanoate hydrolyzes: ${Kb} = 5.6 × 10⁻¹⁰, ${x}² = 5.0 × 10⁻¹¹, [OH⁻] = 7.1 × 10⁻⁶, pOH 5.15, pH 8.85.`, ok:true, why:M1 },
              { t:`pH = ${pKa} = 4.74.`, why:"That’s half-equivalence. " + M6 },
              { t:"pH = 14.00 − 4.74 = 9.26.", why:"That’s not how hydrolysis works here." },
              { t:"Step 3 is correct.", why:"Ethanoate is a base. " + M1 }],
            hints:["What’s in the flask at equivalence?", "CH₃COO⁻, a base.", "Hydrolysis gives pH 8.85."] },
          { id:"e2", goal:5, task:`Find the pH at half-equivalence for ethanoic acid (${Ka} = 1.8 × 10⁻⁵).`,
            steps:["Half-equivalence is at 12.5 mL.", `Here ${n}(HA) = ${n}(A⁻) = 2.25 mmol.`, `So [H₃O⁺] = ${Ka} = 1.8 × 10⁻⁵.`, "pH = −log(1.8 × 10⁻⁵) = 5 + log 1.8 = 5.26"],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"−log(1.8 × 10⁻⁵) = 5 − log 1.8 = 5 − 0.26 = 4.74.", ok:true, why:`A ${Ka} slightly above 10⁻⁵ gives ${pKa} slightly below 5.` },
              { t:"pH = log(1.8 × 10⁻⁵) = −4.74.", why:"pH needs −log." },
              { t:"pH = 1.8 + 5 = 6.80.", why:"That isn’t a log." },
              { t:"Step 4 is correct.", why:`A ${Ka} slightly above 10⁻⁵ gives ${pKa} slightly below 5.` }],
            hints:["Is 1.8 × 10⁻⁵ bigger or smaller than 10⁻⁵?", `Bigger, so ${pKa} is below 5.`, "4.74."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most when you overlaid the weak and strong curves?" },
      { id:"j2", q:`In your own words, explain why pH = ${pKa} at the half-equivalence point.` },
      { id:"j3", q:"Explain to a friend why an ethanoic acid titration needs phenolphthalein, not bromothymol blue." },
      { id:"j4", q:"Which region of the curve is still hardest for you to calculate? What will you do about it?" }
    ]
  },
  final:{
    intro:`No hints. The “Use these values” box and the indicator table are available: ${pKa} values methanoic acid 3.74, benzoic acid 4.20, ethanoic acid 4.74, hypochlorous acid 7.52, NH₄⁺ 9.26; logs: log 2 = 0.30, log 3 = 0.48, log 7.1 = 0.85; indicators: methyl orange 3.1–4.4, methyl red 4.4–6.2, bromothymol blue 6.0–7.6, phenolphthalein 8.2–10.0.`,
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"At the half-equivalence point of a weak acid titrated with NaOH…", options:[
          { t:`pH = ${pKa}`, ok:true, why:`${n}(HA) = ${n}(A⁻), so log(1) = 0 and pH = ${pKa}.` },
          { t:"pH = 7.00", why:`Half-equivalence is in the buffer region, not neutral: pH = ${pKa}.` },
          { t:"all of the HA has reacted", why:"Only half has." },
          { t:`pH = ½ ${pKa}`, why:"No halving: log(1) = 0." }] },
        b:{ prompt:"At the half-equivalence point of a weak base titrated with HCl…", options:[
          { t:`pH = ${pKa} of the conjugate acid (14.00 − ${pKb})`, ok:true, why:M3 },
          { t:`pH = ${pKb}`, why:M3 },
          { t:"pH = 7.00", why:"The flask holds equal amounts of B and BH⁺, a buffer, not a neutral solution. " + M3 },
          { t:"pOH = 7.00", why:`pOH = ${pKb} here.` }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which indicator suits ethanoic acid titrated with NaOH (equivalence pH 8.85)?", options:[
          { t:"Phenolphthalein (8.2–10.0)", ok:true, why:M5 },
          { t:"Bromothymol blue (6.0–7.6)", why:"Its range ends before 8.85. " + M5 },
          { t:"Methyl orange (3.1–4.4)", why:"Far too low. " + M5 },
          { t:"Methyl red (4.4–6.2)", why:"Too low. " + M5 }] },
        b:{ prompt:"Which indicator suits ammonia titrated with HCl (equivalence pH 5.15)?", options:[
          { t:"Methyl red (4.4–6.2)", ok:true, why:"Its range brackets the equivalence pH, 5.15." },
          { t:"Phenolphthalein (8.2–10.0)", why:"Its range is far above 5.15." },
          { t:"Bromothymol blue (6.0–7.6)", why:"Its range is above 5.15: it changes too early." },
          { t:"Methyl orange (3.1–4.4)", why:"Its range starts below the equivalence pH." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"25.0 mL of 0.18 mol/L ethanoic acid and 25.0 mL of 0.18 mol/L HCl are each titrated with 0.18 mol/L NaOH. The equivalence volumes are…", options:[
          { t:"the same, 25.0 mL each", ok:true, why:"Same moles of acid, same moles of OH⁻." },
          { t:"less for ethanoic acid", why:M2 },
          { t:"more for ethanoic acid", why:"Same moles of acid." },
          { t:"impossible to compare", why:"Moles decide it." }] },
        b:{ prompt:"25.0 mL of 0.18 mol/L NH₃ and 25.0 mL of 0.18 mol/L NaOH are each titrated with 0.18 mol/L HCl. The equivalence volumes are…", options:[
          { t:"the same, 25.0 mL each", ok:true, why:"Same moles of base, same moles of H₃O⁺." },
          { t:"less for NH₃", why:"H₃O⁺ removes OH⁻, and NH₃ keeps reacting to replace it. Every NH₃ is used: same moles, same volume." },
          { t:"more for NH₃", why:"Same moles of base." },
          { t:"impossible to compare", why:"Moles decide it." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:`Find the pH after 5.0 mL of 0.18 mol/L NaOH is added to 25.0 mL of 0.18 mol/L ethanoic acid (${pKa} 4.74).`, options:[
          { t:"4.14", ok:true, why:"A⁻ 0.90 mmol, HA 3.60 mmol; log(1/4) = −0.60." },
          { t:"5.34", why:M4 },
          { t:"4.74", why:"That’s half-equivalence (12.5 mL)." },
          { t:"2.74", why:"That ignores the NaOH added." }] },
        b:{ prompt:"Find the pH after 20.0 mL is added.", options:[
          { t:"5.34", ok:true, why:"A⁻ 3.60, HA 0.90; +0.60." },
          { t:"4.14", why:M4 },
          { t:"4.74", why:"That’s half-equivalence (12.5 mL)." },
          { t:"8.85", why:"Equivalence is at 25.0 mL." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:`Find the equivalence pH for 25.0 mL of 0.18 mol/L benzoic acid titrated with 0.18 mol/L NaOH. (Use ${Kb}(benzoate) = 1.59 × 10⁻¹⁰, √(1.43 × 10⁻¹¹) ≈ 3.78 × 10⁻⁶ and log 3.78 ≈ 0.58.)`, options:[
          { t:"8.58", ok:true, why:`${c}(A⁻) = 0.090; ${Kb} × ${c} = 1.43 × 10⁻¹¹; ${x} = 3.78 × 10⁻⁶; pOH 5.42.` },
          { t:"7.00", why:M1 },
          { t:"5.42", why:"That’s the pOH. " + M6 },
          { t:"4.20", why:`That’s ${pKa}. ` + M6 }] },
        b:{ prompt:`Find the equivalence pH for 25.0 mL of 0.18 mol/L methanoic acid titrated with 0.18 mol/L NaOH. (Use ${Kb}(methanoate) = 5.50 × 10⁻¹¹, √(4.95 × 10⁻¹²) ≈ 2.22 × 10⁻⁶ and log 2.22 ≈ 0.35.)`, options:[
          { t:"8.35", ok:true, why:"pOH = 6 − 0.35 = 5.65." },
          { t:"7.00", why:M1 },
          { t:"5.65", why:"That’s the pOH. " + M6 },
          { t:"3.74", why:`That’s ${pKa}. ` + M6 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A 25.0 mL sample of an unknown weak acid needs 30.0 mL of 0.10 mol/L NaOH to reach equivalence. After 15.0 mL, pH = 4.20. Find the acid’s concentration and identity.", options:[
          { t:"0.120 mol/L, benzoic acid", ok:true, why:`3.0 mmol ÷ 25.0 mL; 15.0 mL is half-equivalence, so ${pKa} = 4.20.` },
          { t:"0.0833 mol/L, benzoic acid", why:"Volumes inverted." },
          { t:"0.120 mol/L, ethanoic acid", why:`Ethanoic acid’s ${pKa} is 4.74.` },
          { t:"0.120 mol/L, identity unknown without the equivalence pH", why:"Half-equivalence pH identifies it." }] },
        b:{ prompt:"A 20.0 mL sample needs 16.0 mL of 0.15 mol/L NaOH. After 8.0 mL, pH = 7.52. Find the concentration and identity.", options:[
          { t:"0.120 mol/L, hypochlorous acid", ok:true, why:`2.4 mmol ÷ 20.0 mL; ${pKa} 7.52.` },
          { t:"0.188 mol/L, hypochlorous acid", why:"Volumes inverted." },
          { t:"0.120 mol/L, ethanoic acid", why:`8.0 mL is half-equivalence, so ${pKa} = 7.52: hypochlorous acid, not ethanoic acid (4.74).` },
          { t:"0.120 mol/L, identity unknown", why:`${pKa} identifies it.` }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which best explains why the equivalence pH is above 7 for ethanoic acid titrated with NaOH?", options:[
          { t:"“At equivalence the flask holds ethanoate, the conjugate base of a weak acid, which reacts with water to make OH⁻.”", ok:true, why:"It names what’s in the flask and why that makes the solution basic." },
          { t:"“Some NaOH is left over at equivalence.”", why:"By definition, none is in excess." },
          { t:"“Ethanoic acid is weak, so it doesn’t fully react.”", why:M2 },
          { t:"“Phenolphthalein is basic.”", why:"Indicators don’t set the pH." }] },
        b:{ prompt:"Which best explains the flat buffer region between about 5 and 20 mL?", options:[
          { t:"“Both HA and A⁻ are present, so added OH⁻ turns some HA into A⁻ and the ratio, and the pH, change slowly.”", ok:true, why:"It names both species and explains why the pH changes slowly." },
          { t:"“No reaction happens in that region.”", why:"OH⁻ reacts with HA throughout." },
          { t:"“The indicator absorbs the added base.”", why:"Indicators are present in tiny amounts." },
          { t:"“The solution is neutral there.”", why:"It’s acidic (pH 4–5.5)." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A student uses bromothymol blue (6.0–7.6) for an ethanoic acid titration. What is the effect?", options:[
          { t:"The colour changes slightly before equivalence (8.85), so the recorded volume and the calculated concentration are a little too low.", ok:true, why:"6.0–7.6 sits just below 8.85, so the colour changes a little early." },
          { t:"It changes after equivalence, so the volume is too high.", why:"6.0–7.6 is below 8.85, so it changes earlier." },
          { t:"No effect: any indicator works.", why:M5 },
          { t:"It never changes colour.", why:"The pH passes through 6.0–7.6 just before the jump." }] },
        b:{ prompt:"A student uses methyl orange (3.1–4.4) for an ammonia titration with HCl (equivalence 5.15). What is the effect?", options:[
          { t:"The colour changes slightly after equivalence, so the recorded volume and the calculated NH₃ concentration are a little too high.", ok:true, why:"The pH is falling, and 3.1–4.4 sits just below 5.15, so the colour changes a little late." },
          { t:"It changes before equivalence.", why:"4.4 is below 5.15, and the pH is falling." },
          { t:"No effect.", why:"Choose an indicator whose range contains the equivalence pH: methyl red (4.4–6.2) here." },
          { t:"It never changes.", why:"The pH falls through 4.4 just after equivalence." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"10.0 mL of vinegar is diluted to 100.0 mL. A 25.0 mL portion needs 20.0 mL of 0.100 mol/L NaOH. What is the ethanoic acid concentration in the original vinegar?", options:[
          { t:"0.800 mol/L", ok:true, why:"2.00 mmol ÷ 25.0 mL = 0.0800 mol/L; 0.0800 × 10." },
          { t:"0.0800 mol/L", why:M7 },
          { t:"8.00 mol/L", why:"×10, not ×100." },
          { t:"0.125 mol/L", why:"Volumes inverted." }] },
        b:{ prompt:"5.00 mL of a cleaning vinegar is diluted to 50.0 mL. A 20.0 mL portion needs 30.0 mL of 0.100 mol/L NaOH. What is the original concentration?", options:[
          { t:"1.50 mol/L", ok:true, why:"3.00 mmol ÷ 20.0 = 0.150; × 10." },
          { t:"0.150 mol/L", why:M7 },
          { t:"15.0 mol/L", why:"×10, not ×100." },
          { t:"0.667 mol/L", why:"Volumes inverted." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A 20.0 mL sample of a diluted household ammonia cleaner needs 25.0 mL of 0.120 mol/L HCl. What is the NH₃ concentration, and the pH at half-equivalence?", options:[
          { t:"0.150 mol/L; pH 9.26", ok:true, why:`3.00 mmol ÷ 20.0 mL; pH = ${pKa}(NH₄⁺).` },
          { t:"0.150 mol/L; pH 4.74", why:`That’s ${pKb}. ` + M3 },
          { t:"0.0960 mol/L; pH 9.26", why:"Volumes inverted." },
          { t:"0.150 mol/L; pH 7.00", why:"Half-equivalence is a buffer of NH₃ and NH₄⁺, not neutral. " + M3 }] },
        b:{ prompt:`An unknown weak base B is titrated with HCl. At half-equivalence pH = 10.64. What is ${Kb} of B? (Use log 4.4 ≈ 0.64.)`, options:[
          { t:"4.4 × 10⁻⁴", ok:true, why:`${pKa}(BH⁺) = 10.64, so ${pKb} = 3.36 and ${Kb} = 10<sup>−3.36</sup> = 4.4 × 10⁻⁴ (methylamine).` },
          { t:"2.3 × 10⁻¹¹", why:`That’s ${Ka} of BH⁺. ` + M3 },
          { t:"1.8 × 10⁻⁵", why:"That assumes ammonia." },
          { t:"10<sup>−10.64</sup>", why:M3 }] } }
    ]
  },
  task:{
    title:"Pick the acid and indicator", summary:"Pick the acid and indicator",
    statement:"<p>You’ll titrate 25.0 mL of a 0.18 mol/L weak acid with NaOH. Choose the acid, the NaOH concentration and the indicator so the titration works well. There’s more than one good choice.</p><ol class=\"wt-conds\"><li>The equivalence volume is between 15.0 and 30.0 mL.</li><li>The indicator’s range contains the equivalence pH.</li><li>The jump is clear: the pH rises by at least 3.0 units between 0.50 mL before and 0.50 mL after equivalence.</li></ol>",
    checks:["Equivalence 15.0–30.0 mL", "Indicator fits", "Clear jump"],
    tips:["Equivalence volume = 4.50 mmol ÷ NaOH concentration.", "A weak acid with a strong base has its equivalence point above 7. Which range is high enough?", `A very weak acid (large ${pKa}) gives a high equivalence pH and a small jump.`],
    explainPrompt:"Explain why phenolphthalein suits your acid and why hypochlorous acid is a poor choice.",
    vocab:`Use the words equivalence point, conjugate base, ${pKa} and indicator range.`,
    more:"There’s more than one good choice. Can you find every one?",
    after3:"Hypochlorous acid fails twice: its equivalence pH (10.24) is above phenolphthalein’s range, and its jump is only about 2 units."
  },
  cards:[
    ["Weak acid curve: start", `Higher pH than a strong acid of the same concentration (ICE with ${Ka}).`],
    ["Buffer region", `HA and A⁻ both present; pH = ${pKa} + log(${n}(A⁻) ÷ ${n}(HA)); changes slowly.`],
    ["Half-equivalence", `${n}(HA) = ${n}(A⁻), so pH = ${pKa}.`],
    ["Equivalence (weak acid + strong base)", "Above 7: A⁻ hydrolyzes. 0.090 mol/L ethanoate: pH 8.85."],
    ["Equivalence (weak base + strong acid)", "Below 7: BH⁺ hydrolyzes. 0.090 mol/L NH₄⁺: pH 5.15."],
    ["Equivalence volume", "Same as for a strong acid of equal moles: stoichiometry, not strength."],
    ["Indicator for weak acid + NaOH", "Phenolphthalein (8.2–10.0)."],
    ["Indicator for weak base + HCl", "Methyl red (4.4–6.2)."],
    [`${Ka} from a curve`, `${Ka} = 10<sup>−(pH at half-equivalence)</sup>.`],
    ["Weak base: half-equivalence", `pH = ${pKa}(BH⁺) = 14.00 − ${pKb}.`],
    ["After equivalence", "Excess OH⁻ ÷ total volume: the weak and strong curves merge."],
    ["Dilution factor", "If a sample was diluted ×10 before titrating, multiply the result by 10."]
  ]
};
