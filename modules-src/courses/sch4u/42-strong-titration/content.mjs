// SCH4U 42 Strong Acid/Base Titration. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/42-strong-titration.md
// The hero, the Titration lab (C9), the Part 3 stations and the task preview are drawn by app.js. Indicator ranges, Kw and
// the "Use these values" logs come from MV.chem.data (course tables) in app.js.

const n = "<i>n</i>", c = "<i>c</i>", V = "<i>V</i>";
// Misconception core sentences (plan §3)
const M1 = "The flask now holds acid <strong>and</strong> the base you added. Divide by the total volume.";
const M2 = "Each H₂SO₄ gives 2 H⁺, so it needs 2 OH⁻. Use the balanced equation.";
const M3 = "Equivalence means equal <strong>moles</strong> of H₃O⁺ and OH⁻. Volumes are equal only if the concentrations are.";
const M4 = "pH is logarithmic. Halfway there, half the acid remains, so [H₃O⁺] has only halved (after dilution): pH 1.48.";
const M5 = "The endpoint is when the indicator changes. Choose one whose range contains the equivalence pH.";
const M6 = "Past equivalence, OH⁻ is in excess: find pOH first, then pH = 14.00 − pOH.";
const M7 = "Overshooting means more titrant was recorded than needed, so the calculated concentration of the unknown comes out too high.";
const LOGS = "log 2 = 0.30, log 3 = 0.48, log 5 = 0.70, log 7 = 0.85";

// Activity 1 (Point ↔ pH): [NaOH added, pH, why]
const PTS = [
  ["0.0 mL", "1.00", "Only acid: [H₃O⁺] = 0.100 mol/L."],
  ["10.0 mL", "1.48", "1.00 mmol H₃O⁺ left in 30.0 mL: 0.0333 mol/L."],
  ["15.0 mL", "1.85", "0.50 mmol H₃O⁺ left in 35.0 mL: 1/70 mol/L."],
  ["20.0 mL", "7.00", "Equivalence: only water and spectator ions."],
  ["30.0 mL", "12.30", "1.00 mmol OH⁻ in 50.0 mL: pOH 1.70."],
  ["40.0 mL", "12.52", "2.00 mmol OH⁻ in 60.0 mL: pOH 1.48."]
];
const MATCH_ANS = {}; PTS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const MATCH_HINT3 = ["pH 1.00.", "pH 1.48.", "pH 1.85.", "pH 7.00.", "pH 12.30.", "pH 12.52."];
const CALC_HINTS = [n + " of titrant first.", "Use the mole ratio.", "Divide by the sample volume."];

export default {
  id:"42-strong-titration",
  kind:"topic",
  title:"Strong acid/base titration",
  topic:"Strong Acid/Base Titration",
  readyTopic:"strong acid–strong base titrations",
  hero:{
    eq:'<span class="st-eq"><span class="nw">H₃O⁺(aq) + OH⁻(aq)</span> <span class="nw">→ 2H₂O(l)</span></span><span class="st-eq2">' + n + "(H₃O⁺) = " + n + "(OH⁻) at equivalence</span>", eqSize:"sm",
    eqLabel:"H 3 O plus, aqueous, plus O H minus, aqueous, gives 2 H 2 O, liquid. Beneath it: n of H 3 O plus equals n of O H minus at equivalence.",
    headline:"Count the acid by adding base, one drop at a time.",
    text:"In a <strong>titration</strong>, a base of known concentration drips from a <strong>burette</strong> into the acid until every H₃O⁺ has been used. That’s the <strong>equivalence point</strong>. An <strong>indicator</strong> shows when you’ve reached it, and the volume used tells you how much acid there was.",
    fig:{ html:'<div class="st-hx"><div class="st-hx-row"><svg class="st-hx-lab" id="st-hx-lab" role="img" aria-label="A burette drips sodium hydroxide into a flask of hydrochloric acid with bromothymol blue, which is yellow."></svg><svg class="st-hx-cv" id="st-hx-cv" role="img" aria-label="A pH curve draws itself: flat, flat, then a sudden climb from about pH 3 to pH 11 near 20 mL. At the climb one drop turns the flask green, then blue. A marker reads equivalence: pH 7.00, 20.00 mL."></svg></div><div class="st-hx-foot"><p class="st-hx-cap" id="st-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="st-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain the equivalence point, the endpoint, and the shape of a strong acid–strong base titration curve.",
    "I can calculate the pH at any point by finding the excess H₃O⁺ or OH⁻ and the total volume.",
    "I can use titration data and the balanced equation to find an unknown concentration, including 2 : 1 ratios.",
    "I can choose an indicator whose colour-change range fits the equivalence pH.",
    "I can identify sources of error in a titration and predict their effect on the result.",
    "I can apply titration to real analysis problems in industry and the environment."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"n = cV", goal:3,
          prompt:"How many moles of NaOH are in 20.0 mL of 0.100 mol/L NaOH?",
          options:[
            { t:"2.00 × 10⁻³ mol", ok:true, why:"0.100 mol/L × 0.0200 L." },
            { t:"2.00 mol", why:"Convert 20.0 mL to 0.0200 L." },
            { t:"5.00 × 10⁻³ mol", why:n + " = " + c + " × " + V + "." },
            { t:"2.00 × 10⁻² mol", why:"0.100 × 0.0200 = 0.00200." }],
          hints:[n + " = " + c + V + ", with " + V + " in litres.", "20.0 mL = 0.0200 L.", "0.100 × 0.0200 = 0.00200 mol."] },
        { id:"w2", skill:"n = cV", goal:3,
          prompt:"2.50 × 10⁻³ mol of HCl is in 25.0 mL of solution. What is its concentration?",
          options:[
            { t:"0.100 mol/L", ok:true, why:c + " = " + n + " ÷ " + V + " = 0.00250 ÷ 0.0250." },
            { t:"10.0 mol/L", why:c + " = " + n + " ÷ " + V + ", not " + V + " ÷ " + n + "." },
            { t:"6.25 × 10⁻⁵ mol/L", why:"Divide." },
            { t:"1.00 × 10⁻⁴ mol/L", why:"Use 0.0250 L." }],
          hints:["Rearrange " + n + " = " + c + V + ".", c + " = " + n + " ÷ " + V + ".", "0.00250 ÷ 0.0250 = 0.100."] },
        { id:"w3", skill:"pH of strong acids and bases", goal:2,
          prompt:"What is the pH of 0.0100 mol/L HCl?",
          options:[
            { t:"2.00", ok:true, why:"[H₃O⁺] = 1.00 × 10⁻², so pH = 2.00." },
            { t:"12.00", why:"HCl is an acid, so −log [H₃O⁺] directly." },
            { t:"0.0100", why:"Take −log." },
            { t:"−2.00", why:"pH = −log(10⁻²) = +2." }],
          hints:["Strong acid: [H₃O⁺] = " + c + ".", "pH = −log [H₃O⁺].", "−log(10⁻²) = 2.00."] },
        { id:"w4", skill:"pH of strong acids and bases", goal:2,
          prompt:"What is the pH of 0.020 mol/L NaOH? (Use log 2 = 0.30.)",
          options:[
            { t:"12.30", ok:true, why:"pOH = −log(0.020) = 1.70; pH = 14.00 − 1.70." },
            { t:"1.70", why:"That’s the pOH." },
            { t:"12.00", why:"0.020 = 2 × 10⁻², so pOH = 2 − 0.30." },
            { t:"11.70", why:"pOH = 2.00 − 0.30 = 1.70." }],
          hints:["For a base, find pOH first.", "pOH = 2 − log 2 = 1.70.", "pH = 12.30."] },
        { id:"w5", skill:"Neutralization equations", goal:3,
          prompt:"In H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O, how many moles of NaOH react with 1.00 × 10⁻³ mol of H₂SO₄?",
          options:[
            { t:"2.00 × 10⁻³ mol", ok:true, why:"The ratio is 1 : 2." },
            { t:"1.00 × 10⁻³ mol", why:"Read the coefficients." },
            { t:"5.00 × 10⁻⁴ mol", why:"Twice as much NaOH, not half." },
            { t:"4.00 × 10⁻³ mol", why:"Just ×2." }],
          hints:["Use the coefficients.", "1 H₂SO₄ : 2 NaOH.", "2 × 1.00 × 10⁻³."] },
        { id:"w6", skill:"Neutralization equations", goal:1,
          prompt:"Which ions are left in the flask when HCl has exactly neutralized NaOH?",
          options:[
            { t:"Na⁺ and Cl⁻ (plus water)", ok:true, why:"H₃O⁺ and OH⁻ become water; the spectators remain." },
            { t:"H₃O⁺ and OH⁻ in large amounts", why:"They’ve reacted; only the tiny amounts from water’s self-ionization remain." },
            { t:"None at all", why:"Na⁺ and Cl⁻ don’t react." },
            { t:"NaOH and HCl molecules", why:"Both are fully ionized; they were never molecules in solution." }],
          hints:["Which ions actually react?", "H₃O⁺ + OH⁻ → water.", "Na⁺ and Cl⁻ stay."] }
      ],
      refreshers:{
        "n = cV":"Moles = concentration (mol/L) × volume (L). Working in mL gives mmol, which is often easier: 20.0 mL × 0.100 mol/L = 2.00 mmol.",
        "pH of strong acids and bases":"Strong acid: pH = −log " + c + ". Strong base: pOH = −log [OH⁻], then pH = 14.00 − pOH.",
        "Neutralization equations":"Balance first; the coefficients give the mole ratio. Spectator ions stay in solution."
      }
    }
  },
  explore:{
    heading:"Titration lab",
    intro:"Fill the burette, choose an indicator, and titrate. Watch the pH curve build, and find the equivalence point.",
    how:"Set up the flask and the burette, then add titrant with the burette buttons or type a total in <strong>Add to</strong>. <strong>Lab</strong> mode records trials, <strong>Curve</strong> mode plots the pH as you go, and <strong>Calculate</strong> mode fills the moles table. On the curve, use the arrow keys to move a probe in 0.10 mL steps.",
    modes:[{ id:"lab", t:"Lab" }, { id:"curve", t:"Curve" }, { id:"calc", t:"Calculate" }],
    predictions:[
      { id:"p1", prompt:"At the equivalence point, what will the pH be?",
        options:[{ t:"7.00", ok:true }, { t:"above 7" }, { t:"below 7" }, { t:"it depends on the volumes" }],
        explain:"Na⁺ and Cl⁻ are spectators (module 41), so the solution is neutral." },
      { id:"p2", prompt:"After 10.0 mL, half the base needed, the pH will be about:",
        options:[{ t:"1.48", ok:true }, { t:"4.00" }, { t:"1.30" }, { t:"7.00" }],
        explain:"1.00 mmol of H₃O⁺ remains in <strong>30.0 mL</strong>: 0.0333 mol/L, pH 1.48. 1.30 would ignore the added volume (M1); 4.00 assumes the pH climbs evenly (M4)." },
      { id:"p3", prompt:"From 19.80 to 20.20 mL (about 8 drops), the pH changes by about:",
        options:[{ t:"7 units", ok:true }, { t:"0.4 units" }, { t:"1 unit" }, { t:"3 units" }],
        explain:"Excess acid of 0.020 mmol turns into excess base of 0.020 mmol. On a log scale, that’s a jump from 10<sup>−3.3</sup> to 10<sup>−10.7</sup> mol/L of H₃O⁺." },
      { id:"p4", prompt:"The titrant is switched to 0.200 mol/L. Where is the equivalence point now?",
        options:[{ t:"10.0 mL", ok:true }, { t:"40.0 mL" }, { t:"20.0 mL" }, { t:"5.0 mL" }],
        explain:"Twice the concentration means half the volume for the same 2.00 mmol. Equivalence is about moles, not volumes." }
    ],
    chalIntro:"Use the titration lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"The flask holds 20.0 mL of HCl of unknown concentration. With the pH m&#101;ter off, titrate with 0.100 mol/L NaOH and an indicator, stop within 0.10 mL of equivalence, and enter the acid’s concentration.",
        why:"Equivalence is at 16.00 mL: " + n + "(OH⁻) = 0.100 × 16.00 = 1.60 mmol = " + n + "(H₃O⁺), so " + c + " = 1.60 mmol ÷ 20.0 mL = 0.0800 mol/L.",
        hints:["Add 1 mL at a time until the colour starts to flicker, then single drops.", n + "(OH⁻) = 0.100 × 16.00 = 1.60 mmol = " + n + "(H₃O⁺).", c + " = 1.60 mmol ÷ 20.0 mL = 0.0800 mol/L."] },
      { id:"tc2", goal:3, prompt:"Set up a titration of 25.0 mL of 0.100 mol/L HCl so that equivalence comes at exactly 12.5 mL.",
        why:"The flask holds 2.50 mmol of H₃O⁺, so the titrant must be 2.50 mmol ÷ 12.5 mL = 0.200 mol/L NaOH.",
        hints:["How many mmol of H₃O⁺? 2.50.", c + " = " + n + " ÷ " + V + " = 2.50 ÷ 12.5.", "0.200 mol/L."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"The flask now holds 20.0 mL of H₂SO₄ that needed 24.0 mL of 0.100 mol/L NaOH to reach equivalence. (a) Enter the sulfuric acid concentration. (b) Without the m&#101;ter, add exactly the total volume of NaOH that makes the pH 12.30.",
        why:"(a) " + n + "(H₂SO₄) = ½ × 2.40 mmol = 1.20 mmol, so " + c + " = 0.0600 mol/L. (b) 0.100" + V + " − 2.40 = 0.020 × (20.0 + " + V + "), so " + V + " = 35.0 mL. The m&#101;ter now reads pH 12.30.",
        hints:["(a) " + n + "(OH⁻) = 2.40 mmol, so " + n + "(H₂SO₄) = 1.20 mmol and " + c + " = 1.20 ÷ 20.0.", "(b) Excess OH⁻ = 0.100" + V + " − 2.40 mmol must equal 0.020 × (20.0 + " + V + ").", "0.100" + V + " − 2.40 = 0.40 + 0.020" + V + ", so 0.080" + V + " = 2.80 and " + V + " = 35.0 mL."] }
    ]
  },
  part3:{
    slug:"curve", name:"Read the curve", heading:"Read the curve",
    intro:"Here you read and calculate from finished curves and data tables instead of running the burette, and connect each region of the curve to the particles in the flask.",
    s1:{ title:"Station 1: Four regions",
      intro:"The reference curve: 20.0 mL of 0.100 mol/L HCl titrated with 0.100 mol/L NaOH. Tap a region of the curve (or choose it below) to see the particles in the flask.",
      regions:[
        { id:"start", t:"Start", v:0, cap:"only acid" },
        { id:"before", t:"Before", v:10, cap:"acid in excess, decreasing" },
        { id:"eq", t:"Equivalence", v:20, cap:"only water and spectators" },
        { id:"after", t:"After", v:30, cap:"OH⁻ in excess, increasing" }] },
    s2:{ title:"Station 2: The calculation table",
      intro:"Complete the moles table for the reference titration at 0, 10.0, 30.0 and 40.0 mL. Each correct row lights up its point on the curve.",
      rows:[
        { v:"0.0", ion:"h", answer:[2.00, 20.0, 1.00] },
        { v:"10.0", ion:"h", answer:[1.00, 30.0, 1.48] },
        { v:"30.0", ion:"oh", answer:[1.00, 50.0, 12.30] },
        { v:"40.0", ion:"oh", answer:[2.00, 60.0, 12.52] }] },
    s3:{ title:"Station 3: Check it with data",
      intro:"A student’s titration data (model data): 12.5 mL of 0.100 mol/L NaOH was titrated with 0.100 mol/L HCl. This curve falls, because base is in the flask. Judging data is part of the job: one row was recorded wrongly on purpose.",
      rows:[["0.0", "13.00"], ["10.0", "12.05"], ["12.0", "11.31"], ["12.4", "10.60"], ["12.6", "3.40"], ["13.0", "2.71"], ["15.0", "1.85"]],
      answer:"15.0",
      odd:"Excess H₃O⁺ is 0.25 mmol in 27.5 mL, which is 0.00909 mol/L, so the pH should be 2.04, not 1.85. Every other row matches the excess ÷ total-volume method." },
    s4:{ title:"Station 4: Same moles, different curves",
      intro:"Overlay the curves for 0.100 and 0.0100 mol/L HCl, each titrated with base of the same concentration. Choose an indicator to see where each endpoint lands.",
      note:"The dilute curve starts higher (pH 2.00) and its jump is shorter (about pH 4.3 to 9.7), so an indicator choice matters more." },
    quickCheck:{
      title:"Quick check", summary:"Read the curve quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which ion is in excess after equivalence?",
          choices:[
            { t:"OH⁻", ok:true, fb:"Right. Extra base keeps arriving from the burette." },
            { t:"H₃O⁺", fb:"Extra base keeps arriving from the burette." },
            { t:"Na⁺", fb:"Extra base keeps arriving from the burette." },
            { t:"Cl⁻", fb:"Extra base keeps arriving from the burette." }] },
        { id:"q2", goal:2, prompt:"In the ‘before’ region, pH is set by…",
          choices:[
            { t:"excess H₃O⁺ ÷ total volume", ok:true, fb:"Right. Find the excess H₃O⁺, divide by the total volume, then take −log." },
            { t:"moles of base added", fb:M1 },
            { t:"the indicator", fb:M1 },
            { t:"<i>K</i><sub>a</sub>", fb:M1 }] },
        { id:"q3", goal:2, prompt:"Which row doesn’t fit in Station 3?",
          choices:[
            { t:"15.0 mL", ok:true, fb:"Right. 0.25 mmol ÷ 27.5 mL gives pH 2.04." },
            { t:"10.0 mL", fb:"0.25 mmol ÷ 27.5 mL gives pH 2.04." },
            { t:"12.0 mL", fb:"0.25 mmol ÷ 27.5 mL gives pH 2.04." },
            { t:"0.0 mL", fb:"0.25 mmol ÷ 27.5 mL gives pH 2.04." }] },
        { id:"q4", goal:1, prompt:"Why does the 0.0100 mol/L curve have a shorter jump?",
          choices:[
            { t:"Smaller excesses on each side mean concentrations closer to 10⁻⁷", ok:true, fb:"Right. Both sides of the jump sit closer to pH 7." },
            { t:"The acid is weaker", fb:"Diluting doesn’t make HCl weak." },
            { t:"The indicator is different", fb:"Diluting doesn’t make HCl weak." },
            { t:"Less water is formed", fb:"Diluting doesn’t make HCl weak." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Point ↔ pH", summary:"Point ↔ pH", goal:[1, 2],
        instruction:"20.0 mL of 0.100 mol/L HCl is titrated with 0.100 mol/L NaOH. Match each volume of NaOH added to the pH. Two pH values have no partner.",
        leftTitle:"NaOH added", rightTitle:"pH",
        left:PTS.map((p, i) => ({ id:"l" + (i + 1), t:p[0], why:p[2], hints:["Which is in excess at this volume?", "Divide the excess mmol by the total mL.", MATCH_HINT3[i]] })),
        right:PTS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r7", t:"4.00" }, { id:"r8", t:"1.70" }]),
        answer:MATCH_ANS,
        wrong:{ "l2|r4":"Halfway is still very acidic.", "l2|r7":"Halfway is still very acidic.", "l5|r8":"Past equivalence, OH⁻ is in excess; 1.70 is the pOH." },
        wrongDefault:"Find the excess and the total volume." },
      { id:"calc", type:"numeric", title:"Titration calculations", summary:"Titration calculations", star:true, goal:[2, 3, 5],
        instruction:"Six calculations. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number (leave off the unit), then press Check.",
        items:[
          { id:"c1", goal:3, prompt:"25.0 mL of HCl needs 20.0 mL of 0.100 mol/L NaOH. " + c + "(HCl)?", answer:0.08, tol:0.0005, unit:"mol/L", display:"0.0800 mol/L",
            why:n + "(OH⁻) = 2.00 mmol = " + n + "(HCl); 2.00 ÷ 25.0 = 0.0800 mol/L.", wrong:[{ match:0.125, fb:c + " = " + n + " ÷ " + V + " of the acid." }], hints:CALC_HINTS },
          { id:"c2", goal:3, prompt:"10.0 mL of NaOH needs 12.5 mL of 0.0800 mol/L HCl. " + c + "(NaOH)?", answer:0.1, tol:0.0005, unit:"mol/L", display:"0.100 mol/L",
            why:n + "(HCl) = 1.00 mmol = " + n + "(NaOH); 1.00 ÷ 10.0 = 0.100 mol/L.", wrong:[{ match:0.064, fb:"Volumes swapped." }], hints:CALC_HINTS },
          { id:"c3", goal:3, prompt:"20.0 mL of H₂SO₄ needs 30.0 mL of 0.100 mol/L NaOH. " + c + "(H₂SO₄)?", answer:0.075, tol:0.0005, unit:"mol/L", display:"0.0750 mol/L",
            why:n + "(OH⁻) = 3.00 mmol, so " + n + "(H₂SO₄) = 1.50 mmol; 1.50 ÷ 20.0 = 0.0750 mol/L.", wrong:[{ match:0.15, fb:M2 }], hints:CALC_HINTS },
          { id:"c4", star:true, goal:2, prompt:"pH after 35.0 mL of 0.100 mol/L NaOH is added to 25.0 mL of 0.100 mol/L HCl? (Use log 6 = 0.78.)", answer:12.22, tol:0.0004, display:"pH 12.22",
            why:"Excess OH⁻ 1.00 mmol in 60.0 mL: pOH = log 60 = 1.78, so pH = 14.00 − 1.78 = 12.22.",
            wrong:[{ match:1.78, fb:"That’s the pOH." }, { match:12.4, fb:"Divide 1.00 mmol by 60.0 mL, not 25.0 mL." }],
            hints:["Excess OH⁻ = 3.50 − 2.50 = 1.00 mmol.", "Total volume 60.0 mL: [OH⁻] = 1/60 mol/L.", "pOH = log 60 = 1.78; pH = 12.22."] },
          { id:"c5", star:true, goal:[3, 6], prompt:"An antacid solution: 10.0 mL of NaOH needs 15.0 mL of 0.0400 mol/L HCl. How many mmol of NaOH are in 250.0 mL of the solution?", answer:15, tol:0.001, unit:"mmol", display:"15.0 mmol",
            why:"0.600 mmol in each 10.0 mL sample; 250.0 mL is 25 times as much.", wrong:[{ match:0.6, fb:"That’s the 10.0 mL sample; scale up by 25." }],
            hints:[n + "(HCl) = 0.600 mmol = " + n + "(NaOH) in 10.0 mL.", "250.0 mL is 25 times as much.", "15.0 mmol."] },
          { id:"c6", star:true, goal:5, prompt:"<strong>Investigation:</strong> Three trials: 16.05, 15.95 and 16.40 mL. Discard any trial that differs from the others by more than 0.10 mL, then give the mean.", answer:16, tol:0.0003, unit:"mL", display:"16.00 mL",
            why:"16.40 mL is an outlier; the mean of 16.05 and 15.95 is 16.00 mL.", wrong:[{ match:16.13, fb:"16.40 is an outlier; it shouldn’t be averaged in." }, { match:16.133, fb:"16.40 is an outlier; it shouldn’t be averaged in." }],
            hints:["Which trial disagrees?", "16.40 is 0.40 mL away from the others.", "Mean of 16.05 and 15.95 = 16.00 mL."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ilse", how:"", goal:[2, 3],
        instruction:"Ilse made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"20.0 mL of H₂SO₄ needs 24.0 mL of 0.100 mol/L NaOH. Find " + c + "(H₂SO₄).",
            steps:["H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O", n + "(NaOH) = 0.100 × 0.0240 = 2.40 × 10⁻³ mol", n + "(H₂SO₄) = 2.40 × 10⁻³ mol", c + " = 2.40 × 10⁻³ ÷ 0.0200 = 0.120 mol/L"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:n + "(H₂SO₄) = ½ × 2.40 × 10⁻³ = 1.20 × 10⁻³ mol, so " + c + " = 0.0600 mol/L.", ok:true, why:M2 },
              { t:n + "(H₂SO₄) = 2 × 2.40 × 10⁻³.", why:"That inverts the ratio." },
              { t:"Use 24.0 mL as the acid volume.", why:"The acid volume is 20.0 mL." },
              { t:"Step 3 is correct.", why:"The equation in step 1 says 1 : 2." }],
            hints:["Read the coefficients again.", "1 H₂SO₄ for 2 NaOH.", "Halve the moles of NaOH."] },
          { id:"e2", goal:2, task:"Find the pH after 10.0 mL of 0.100 mol/L NaOH is added to 20.0 mL of 0.100 mol/L HCl.",
            steps:[n + "(H₃O⁺) = 2.00 mmol", n + "(OH⁻) = 1.00 mmol", "Excess H₃O⁺ = 1.00 mmol", "[H₃O⁺] = 1.00 mmol ÷ 20.0 mL = 0.0500 mol/L", "pH = 1.30"],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"Divide by the total volume, 30.0 mL: [H₃O⁺] = 0.0333 mol/L, so pH = 1.48.", ok:true, why:M1 },
              { t:"Divide by 10.0 mL.", why:"That’s only the base’s volume." },
              { t:"pH = 7.00 because base was added.", why:"Acid is still in excess." },
              { t:"Step 4 is correct.", why:"The flask now holds 30.0 mL." }],
            hints:["What’s in the flask now?", "20.0 + 10.0 mL.", "1.00 ÷ 30.0 = 0.0333; pH 1.48."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most about the shape of the titration curve?" },
      { id:"j2", q:"In your own words, explain the difference between the equivalence point and the endpoint." },
      { id:"j3", q:"Explain to a friend how to find the pH 10.0 mL before and 10.0 mL after equivalence." },
      { id:"j4", q:"Which technique mistake would you be most likely to make in a real lab, and how will you avoid it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"At the equivalence point of a titration…", options:[
          { t:"the moles of OH⁻ added equal the moles of H₃O⁺ originally present", ok:true, why:"Equivalence is about moles, in the ratio set by the balanced equation." },
          { t:"the volumes of acid and base are equal", why:M3 },
          { t:"the pH is always 7.00", why:"True for strong–strong titrations only (see module 43)." },
          { t:"the indicator has just changed colour", why:"That’s the endpoint." }] },
        b:{ prompt:"The endpoint of a titration is…", options:[
          { t:"the point where the indicator changes colour", ok:true, why:"A good indicator puts the endpoint at the equivalence point." },
          { t:"the point where moles of acid and base are equal", why:"That’s the equivalence point." },
          { t:"the point where the pH is 7.00", why:"Only a well-chosen indicator puts the endpoint near pH 7 here." },
          { t:"the point where equal volumes have been mixed", why:M3 }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"HCl is titrated with NaOH (equivalence pH 7.00). Which indicator’s range contains the equivalence pH?", options:[
          { t:"Bromothymol blue (6.0–7.6)", ok:true, why:"6.0–7.6 contains 7.00." },
          { t:"Methyl orange (3.1–4.4)", why:"It changes well before equivalence." },
          { t:"Methyl red (4.4–6.2)", why:"Its range stops below 7." },
          { t:"None is needed; the solution changes colour by itself", why:"HCl, NaOH and NaCl solutions are all colourless." }] },
        b:{ prompt:"KOH is titrated with HNO₃ (equivalence pH 7.00). Which indicator’s range contains the equivalence pH?", options:[
          { t:"Bromothymol blue (6.0–7.6)", ok:true, why:"6.0–7.6 contains 7.00." },
          { t:"Phenolphthalein (8.2–10.0)", why:"Its range starts above 7." },
          { t:"Methyl orange (3.1–4.4)", why:M5 },
          { t:"Methyl red (4.4–6.2)", why:M5 }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What is the pH at the equivalence point when KOH is titrated with HNO₃?", options:[
          { t:"7.00", ok:true, why:"K⁺ and NO₃⁻ are spectators." },
          { t:"Above 7, because base was in the flask", why:"At equivalence, no excess base remains." },
          { t:"Below 7, because acid was added last", why:"No excess acid either." },
          { t:"It can’t be known without the volumes", why:"Equivalence pH depends on the salt, not the volumes." }] },
        b:{ prompt:"At the equivalence point of NaOH + HCl, the flask contains mainly…", options:[
          { t:"Na⁺, Cl⁻ and water", ok:true, why:"H₃O⁺ and OH⁻ have become water; the spectators remain." },
          { t:"NaOH and HCl molecules", why:"Both are fully ionized." },
          { t:"Large amounts of H₃O⁺ and OH⁻", why:"They’ve reacted to make water." },
          { t:"Solid NaCl crystals", why:"NaCl is soluble; its ions stay dissolved." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"25.0 mL of H₂SO₄ needs 20.0 mL of 0.150 mol/L NaOH. What is " + c + "(H₂SO₄)?", options:[
          { t:"0.0600 mol/L", ok:true, why:n + "(OH⁻) = 3.00 mmol; " + n + "(H₂SO₄) = 1.50 mmol; ÷ 25.0 mL." },
          { t:"0.120 mol/L", why:"1 : 1 was assumed. " + M2 },
          { t:"0.188 mol/L", why:"Volumes swapped: 0.150 × 25.0 ÷ 20.0." },
          { t:"0.0300 mol/L", why:"Halved twice." }] },
        b:{ prompt:"20.0 mL of H₂SO₄ needs 25.0 mL of 0.0800 mol/L NaOH. What is " + c + "(H₂SO₄)?", options:[
          { t:"0.0500 mol/L", ok:true, why:n + "(OH⁻) = 2.00 mmol; " + n + "(H₂SO₄) = 1.00 mmol; ÷ 20.0 mL." },
          { t:"0.100 mol/L", why:M2 },
          { t:"0.0640 mol/L", why:"Volumes swapped." },
          { t:"0.0250 mol/L", why:"Halved twice." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"15.0 mL of 0.100 mol/L NaOH is added to 20.0 mL of 0.100 mol/L HCl. What is the pH?", use:LOGS, options:[
          { t:"1.85", ok:true, why:"Excess H₃O⁺ 0.50 mmol in 35.0 mL = 1/70 mol/L; pH = log 70 = 1.85." },
          { t:"1.60", why:"That divides by 20.0 mL. " + M1 },
          { t:"7.00", why:"Acid is still in excess." },
          { t:"12.15", why:"Acid is in excess, not base." }] },
        b:{ prompt:"30.0 mL of 0.100 mol/L NaOH is added to 20.0 mL of 0.100 mol/L HCl. What is the pH?", use:LOGS, options:[
          { t:"12.30", ok:true, why:"Excess OH⁻ 1.00 mmol in 50.0 mL = 0.020 mol/L; pOH 1.70." },
          { t:"1.70", why:"That’s the pOH." },
          { t:"12.52", why:"That divides by 30.0 mL. " + M1 },
          { t:"7.00", why:"Past equivalence." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A 25.0 mL sample of HNO₃ reaches pH 12.00 after 37.5 mL of 0.100 mol/L KOH. What was " + c + "(HNO₃)?", use:LOGS, options:[
          { t:"0.125 mol/L", ok:true, why:"[OH⁻] = 0.0100 in 62.5 mL, so the excess is 0.625 mmol. Acid = 3.75 − 0.625 = 3.125 mmol, ÷ 25.0 mL." },
          { t:"0.150 mol/L", why:"That treats 37.5 mL as the equivalence point." },
          { t:"0.175 mol/L", why:"The excess was added instead of subtracted." },
          { t:"0.0250 mol/L", why:"That’s only the excess ÷ 25.0." }] },
        b:{ prompt:"A 20.0 mL sample of HCl reaches pH 12.30 after 35.0 mL of 0.100 mol/L KOH. What was " + c + "(HCl)?", use:LOGS, options:[
          { t:"0.120 mol/L", ok:true, why:"[OH⁻] = 0.020 in 55.0 mL = 1.10 mmol excess; acid = 3.50 − 1.10 = 2.40 mmol." },
          { t:"0.175 mol/L", why:"That treats 35.0 mL as equivalence." },
          { t:"0.230 mol/L", why:"The excess was added." },
          { t:"0.0550 mol/L", why:"Only the excess." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of the steep jump near the equivalence point?", options:[
          { t:"“Near equivalence almost no excess acid or base is left, so a few drops change [H₃O⁺] by factors of 10 or more, and pH is a log scale.”", ok:true, why:"It names the tiny excess and the log scale." },
          { t:"“The indicator makes the pH jump.”", why:"Indicators show pH; they don’t change it." },
          { t:"“The reaction speeds up near the end.”", why:"Neutralization is fast throughout; this is about amounts." },
          { t:"“Equal volumes have been mixed.”", why:M3 }] },
        b:{ prompt:"Which is the best explanation of why the equivalence pH here is 7.00?", options:[
          { t:"“The products are water and a salt whose ions, from a strong acid and a strong base, don’t react with water.”", ok:true, why:"It names the spectator ions." },
          { t:"“Equal volumes of acid and base were mixed.”", why:M3 },
          { t:"“All the H₃O⁺ and OH⁻ ions are gone.”", why:"Water still has 1.0 × 10⁻⁷ mol/L of each." },
          { t:"“The indicator turned green.”", why:M5 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"During a titration of HCl with NaOH, an air bubble in the burette tip disappears. How does this affect the calculated " + c + "(HCl)?", options:[
          { t:"Too high: the recorded volume includes the bubble, so more NaOH seems to have been used.", ok:true, why:"The recorded volume is larger than what was delivered." },
          { t:"Too low: less NaOH was delivered.", why:"The recorded volume is larger than what was delivered, so the moles calculated are too large." },
          { t:"No effect: the bubble is only air.", why:"The volume reading changes." },
          { t:"It makes the endpoint impossible to see.", why:"The indicator still works." }] },
        b:{ prompt:"A student overshoots the endpoint by several drops. How does this affect the calculated " + c + "(HCl)?", options:[
          { t:"Too high: the volume recorded is larger than needed.", ok:true, why:M7 },
          { t:"Too low.", why:M7 },
          { t:"No effect, because the indicator changed.", why:M5 },
          { t:"It doubles.", why:"A few drops change it slightly, not by a factor of 2." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Before release, factory wastewater must be neutralized. A 50.0 mL sample needs 12.5 mL of 0.200 mol/L NaOH. What is the HCl concentration?", options:[
          { t:"0.0500 mol/L", ok:true, why:"2.50 mmol ÷ 50.0 mL." },
          { t:"0.800 mol/L", why:"0.200 × 50.0 ÷ 12.5 inverts the volumes." },
          { t:"0.0250 mol/L", why:"That used 0.100 mol/L." },
          { t:"0.200 mol/L", why:"The sample isn’t the same concentration as the titrant." }] },
        b:{ prompt:"A diluted drain-cleaner sample (NaOH): 10.0 mL needs 25.0 mL of 0.100 mol/L HCl. What is " + c + "(NaOH)?", options:[
          { t:"0.250 mol/L", ok:true, why:"2.50 mmol ÷ 10.0 mL." },
          { t:"0.0400 mol/L", why:"Volumes inverted." },
          { t:"0.100 mol/L", why:"Not the titrant’s concentration." },
          { t:"2.50 mol/L", why:"mmol ÷ mL gives mol/L directly: 2.50 ÷ 10.0 = 0.250." }] } },
      { id:"a2", cat:"A", goal:[3, 6],
        a:{ prompt:"A lab must titrate 25.0 mL of about 0.080 mol/L HCl and wants the endpoint between 15 and 25 mL. Which NaOH concentration should it use?", options:[
          { t:"0.100 mol/L (about 20.0 mL)", ok:true, why:"2.0 mmol ÷ 0.100 = 20 mL." },
          { t:"0.050 mol/L", why:"About 40 mL: too much." },
          { t:"0.200 mol/L", why:"About 10 mL: too little for good precision." },
          { t:"0.040 mol/L", why:"About 50 mL: a whole burette." }] },
        b:{ prompt:"A lab must titrate 25.0 mL of about 0.160 mol/L HCl, with the endpoint between 15 and 25 mL. Which NaOH concentration?", options:[
          { t:"0.200 mol/L (about 20.0 mL)", ok:true, why:"4.0 mmol ÷ 0.200." },
          { t:"0.100 mol/L", why:"About 40 mL." },
          { t:"0.400 mol/L", why:"About 10 mL." },
          { t:"0.050 mol/L", why:"About 80 mL." }] } }
    ]
  },
  task:{
    title:"Plan the titration", summary:"Plan the titration",
    statement:"<p>A quality-control lab has HCl of about 0.0800 mol/L. Plan a titration that meets every condition. There’s more than one good plan.</p><ol class=\"st-conds\"><li>The endpoint volume is between 15.0 and 35.0 mL.</li><li>The indicator’s range contains the equivalence pH.</li><li>The sample is at least 20.0 mL (a larger sample reduces the pipette’s relative error).</li></ol>",
    checks:["Endpoint 15.0–35.0 mL", "Indicator fits", "Sample ≥ 20.0 mL"],
    tips:["Endpoint volume = (0.0800 × sample volume) ÷ NaOH concentration.", "A strong acid–strong base equivalence point is at pH 7.00. Which range includes 7?", "A 10.0 mL sample has a larger relative uncertainty."],
    explainPrompt:"Explain how you chose the NaOH concentration and the indicator.",
    vocab:"Use the words equivalence point, endpoint, indicator range and mole ratio.",
    after3:"All three keep the endpoint mid-burette and use the one indicator whose range brackets pH 7."
  },
  cards:[
    ["Titrant", "The solution of known concentration in the burette."],
    ["Equivalence point", "Moles of OH⁻ added = moles of H₃O⁺ present (by the balanced equation)."],
    ["Endpoint", "Where the indicator changes colour. A good indicator puts it at equivalence."],
    ["Strong–strong equivalence pH", "7.00 at 25 °C: the salt’s ions are spectators."],
    ["pH before equivalence", "Excess H₃O⁺ ÷ <strong>total</strong> volume, then −log."],
    ["pH after equivalence", "Excess OH⁻ ÷ total volume → pOH → pH = 14.00 − pOH."],
    ["The jump", "About 7 pH units within a few drops of equivalence (for 0.100 mol/L solutions)."],
    ["Choosing an indicator", "Its colour-change range should contain the equivalence pH: bromothymol blue (6.0–7.6) here."],
    ["H₂SO₄ + 2NaOH", "1 : 2 ratio. Halve the moles of NaOH to get the moles of H₂SO₄."],
    [n + " = " + c + V + " in mmol", "mL × mol/L = mmol: 20.0 mL × 0.100 mol/L = 2.00 mmol."],
    ["Overshooting the endpoint", "The recorded volume is too large, so the calculated concentration of the unknown is too high."],
    ["Good technique", "Rinse the burette with titrant, remove bubbles, read the meniscus at eye level, add single drops near the end, and repeat until trials agree within 0.10 mL."]
  ]
};
