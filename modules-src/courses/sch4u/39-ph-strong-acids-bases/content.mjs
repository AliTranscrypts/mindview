// SCH4U 39 pH of Strong Acids and Bases. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/39-ph-strong-acids-bases.md
// Pictures (hero ladder, the pH ladder with its log-axis bars and Mix beaker, the Part 3 stations, the task preview) are
// drawn by app.js. Kw comes from MV.chem.data.const.Kw; every pH is computed in app.js.

const KW = "<i>K</i><sub>w</sub>";
const LOGS = "log 2 = 0.30, log 3 = 0.48, log 5 = 0.70; " + KW + " = 1.0 × 10⁻¹⁴ at 25 °C.";

// Misconception core sentences (plan §3)
const M1 = "Each pH unit is ×10: pH 2 has 100 times the [H₃O⁺] of pH 4.";
const M2 = "Ba(OH)₂ → Ba²⁺ + <strong>2</strong>OH⁻: [OH⁻] is twice the base concentration.";
const M3 = "−log[OH⁻] is the <strong>pOH</strong>. pH = 14.00 − pOH.";
const M4 = "Water itself supplies 1.0 × 10⁻⁷ mol/L of H₃O⁺. A very dilute acid approaches pH 7 from below.";
const M5 = "Digits after the decimal in pH = significant digits in the concentration: pH 2.70.";
const M6 = "Mix moles, not pH values: excess moles ÷ total volume.";

// Practice 1: concentration ↔ pH (plan Activity 1). r9–r11 are distractor cards for the plan's mismatch feedback.
const PAIRS = [
  ["[H₃O⁺] = 1.0 × 10⁻¹ mol/L", "1.00", "−log(1.0 × 10⁻¹) = 1.00."],
  ["[H₃O⁺] = 2.0 × 10⁻³ mol/L", "2.70", "3 − 0.30 = 2.70: two significant digits, two decimal places."],
  ["[H₃O⁺] = 5.0 × 10⁻⁴ mol/L", "3.30", "4 − 0.70 = 3.30."],
  ["[H₃O⁺] = 3.0 × 10⁻⁵ mol/L", "4.52", "5 − 0.48 = 4.52."],
  ["[H₃O⁺] = 1.0 × 10⁻⁹ mol/L", "9.00", "−log(1.0 × 10⁻⁹) = 9.00: basic."],
  ["[OH⁻] = 2.0 × 10⁻² mol/L", "12.30", "pOH = 2 − 0.30 = 1.70, so pH = 14.00 − 1.70 = 12.30."],
  ["[OH⁻] = 5.0 × 10⁻⁵ mol/L", "9.70", "pOH = 5 − 0.70 = 4.30, so pH = 14.00 − 4.30 = 9.70."],
  ["[OH⁻] = 1.0 × 10⁻⁷ mol/L", "7.00", "pOH 7.00, so pH 7.00: neutral."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"39-ph-strong-acids-bases",
  kind:"topic",
  title:"pH of strong acids and bases",
  topic:"pH of Strong Acids and Bases",
  readyTopic:"pH of strong acids and bases",
  hero:{
    eq:"pH = −log[H₃O⁺] · pOH = −log[OH⁻] · pH + pOH = 14.00", eqSize:"sm",
    eqLabel:"pH equals minus log of the hydronium concentration; pOH equals minus log of the hydroxide concentration; pH plus pOH equals 14.00.",
    headline:"Every step on the pH scale is ten times",
    text:"The <strong>pH</strong> scale squeezes [H₃O⁺] values from about 1 mol/L down to 10⁻¹⁴ mol/L into the numbers 0 to 14. Because water’s <strong>ion product</strong> " + KW + " = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴, knowing either ion gives you the other, and <strong>pH + pOH = 14.00</strong> at 25 °C.",
    fig:{ html:'<div class="ph-hx"><svg class="ph-svg ph-hx-svg" id="ph-hx-svg" viewBox="0 0 440 420" role="img" aria-label="A vertical pH ladder from 0 at the top to 14 at the bottom. Beside it, a magenta H₃O⁺ bar and a cerulean OH⁻ bar on a log axis from 1 mol/L down to 10⁻¹⁴ mol/L. A marker slides from pH 1 to pH 13: each step, the H₃O⁺ bar shrinks by one decade and the OH⁻ bar grows by one. At pH 7 the bars match: neutral, both 1.0 × 10⁻⁷ mol/L."></svg><div class="ph-hx-row"><p class="ph-hx-ctr" id="ph-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ph-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can calculate pH and pOH for strong acids and bases, including bases that release 2 OH⁻.",
    "I can convert between pH, pOH, [H₃O⁺] and [OH⁻] using " + KW + ".",
    "I can predict how dilution and mixing change pH, and calculate the pH after mixing a strong acid and a strong base.",
    "I can interpret pH values in everyday, health and environmental contexts."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Powers of 10", goal:2,
          prompt:"(1.0 × 10⁻¹⁴) ÷ (1.0 × 10⁻³) = ?",
          options:[
            { t:"1.0 × 10⁻¹¹", ok:true, why:"Subtract exponents: −14 − (−3) = −11." },
            { t:"1.0 × 10⁻¹⁷", why:"That adds the exponents (multiplying)." },
            { t:"1.0 × 10<sup>−14/3</sup>", why:"Exponents subtract; they don’t divide." },
            { t:"1.0 × 10¹¹", why:"Sign slip: the answer is still small." }],
          hints:["When dividing powers of 10, subtract exponents.", "−14 − (−3).", "10⁻¹¹."] },
        { id:"w2", skill:"Powers of 10", goal:3,
          prompt:"How many times larger is 1.0 × 10⁻² than 1.0 × 10⁻⁵?",
          options:[
            { t:"1000 times", ok:true, why:"10⁻² ÷ 10⁻⁵ = 10³." },
            { t:"3 times", why:"A gap of 3 in the exponent is a factor of 10³." },
            { t:"7 times", why:"That adds the exponents." },
            { t:"0.001 times", why:"10⁻² is the larger number." }],
          hints:["Divide the two.", "Subtract exponents: −2 − (−5) = 3.", "10³ = 1000."] },
        { id:"w3", skill:"Logs from given values", goal:1,
          prompt:"Use log 2 = 0.30. What is −log(2.0 × 10⁻³)?",
          options:[
            { t:"2.70", ok:true, why:"−(log 2 + log 10⁻³) = −(0.30 − 3) = 2.70." },
            { t:"3.30", why:"Add, don’t subtract: −log(2 × 10⁻³) = 3 − 0.30." },
            { t:"0.60", why:"That’s log 4." },
            { t:"−2.70", why:"The negative sign in pH makes it positive." }],
          hints:["log(<i>a</i> × 10⁻ⁿ) = log <i>a</i> − <i>n</i>.", "0.30 − 3 = −2.70.", "Negate: 2.70."] },
        { id:"w4", skill:"Logs from given values", goal:2,
          prompt:"Use log 5 = 0.70. If −log <i>x</i> = 3.30, what is <i>x</i>?",
          options:[
            { t:"5.0 × 10⁻⁴", ok:true, why:"log <i>x</i> = −3.30 = 0.70 − 4, so <i>x</i> = 5 × 10⁻⁴." },
            { t:"3.3 × 10⁻³", why:"3.30 is the log, not the mantissa." },
            { t:"5.0 × 10⁻³", why:"0.70 − 3 = −2.30, not −3.30." },
            { t:"2.0 × 10⁻⁴", why:"That would need log 2." }],
          hints:["Write −3.30 as 0.70 − 4.", "10<sup>0.70</sup> = 5.", "5.0 × 10⁻⁴."] },
        { id:"w5", skill:"Dilution", goal:3,
          prompt:"10.0 mL of 0.10 mol/L HCl is diluted to 100.0 mL. New concentration?",
          options:[
            { t:"0.010 mol/L", ok:true, why:"<i>c</i>₁<i>V</i>₁ = <i>c</i>₂<i>V</i>₂: 0.10 × 10.0 = <i>c</i>₂ × 100.0." },
            { t:"1.0 mol/L", why:"Dilution lowers concentration." },
            { t:"0.090 mol/L", why:"Dilution is a ratio, not a subtraction." },
            { t:"0.0010 mol/L", why:"The volume went up 10 times, not 100." }],
          hints:["Volume ×10.", "Concentration ÷10.", "0.010 mol/L."] },
        { id:"w6", skill:"Dilution", goal:3,
          prompt:"30.0 mL of solution is mixed with 20.0 mL of another. Total volume?",
          options:[
            { t:"50.0 mL", ok:true, why:"Volumes add (for dilute solutions)." },
            { t:"10.0 mL", why:"That’s the difference." },
            { t:"30.0 mL", why:"Both solutions are in the beaker." },
            { t:"600 mL", why:"Volumes add; they don’t multiply." }],
          hints:["Both go into one beaker.", "30.0 + 20.0.", "50.0 mL."] }
      ],
      refreshers:{
        "Powers of 10":"Dividing subtracts exponents. A difference of <i>n</i> in the exponent is a factor of 10ⁿ.",
        "Logs from given values":"log(<i>a</i> × 10ⁿ) = log <i>a</i> + <i>n</i>. Use these values: log 2 = 0.30, log 3 = 0.48, log 5 = 0.70, log 7 = 0.85 (and log 4 = 0.60, log 6 = 0.78 by adding).",
        "Dilution":"<i>c</i>₁<i>V</i>₁ = <i>c</i>₂<i>V</i>₂. When mixing, the total volume is the sum."
      }
    }
  },
  explore:{
    heading:"pH ladder",
    intro:"Make a strong acid or base solution, then dilute it or mix it, and watch all four values move together.",
    how:"Choose a mode. Pick a species and a concentration; in Dilute mode press ×10 dilution; in Mix mode choose the two volumes. The ladder, the bars and the readout update together.",
    modes:[{ id:"lad", t:"Ladder" }, { id:"dil", t:"Dilute" }, { id:"mix", t:"Mix" }],
    species:[
      { id:"HCl", f:"HCl", n:1, acid:true, eq:"HCl + H2O -> H3O+ + Cl-" },
      { id:"HNO3", f:"HNO3", n:1, acid:true, eq:"HNO3 + H2O -> H3O+ + NO3-" },
      { id:"NaOH", f:"NaOH", n:1, eq:"NaOH -> Na+ + OH-" },
      { id:"KOH", f:"KOH", n:1, eq:"KOH -> K+ + OH-" },
      { id:"CaOH2", f:"Ca(OH)2", n:2, eq:"Ca(OH)2 -> Ca^2+ + 2OH-" },
      { id:"BaOH2", f:"Ba(OH)2", n:2, eq:"Ba(OH)2 -> Ba^2+ + 2OH-" }
    ],
    mantissas:[1, 2, 3, 5],
    vols:[10, 20, 30, 40, 50],
    mixNote:"Both solutions are 0.10 mol/L. Each dot in the beaker panel is 1.0 × 10⁻³ mol.",
    predictions:[
      { id:"p1", prompt:"Dilute mode, HCl 1.0 × 10⁻² mol/L. After one ×10 dilution, the pH will be…",
        options:[{ t:"3.00", ok:true }, { t:"2.20" }, { t:"1.00" }, { t:"20.0" }],
        explain:"[H₃O⁺] drops tenfold, and the pH rises by exactly 1." },
      { id:"p2", prompt:"Ladder: compare pH 3 and pH 5. How many times more H₃O⁺ does the pH 3 solution have?",
        options:[{ t:"100", ok:true }, { t:"2" }, { t:"1.7" }, { t:"15" }],
        explain:"Two pH units = 10² = 100 times." },
      { id:"p3", prompt:"Ladder: Ba(OH)₂ at 5.0 × 10⁻³ mol/L. What is its pH?",
        options:[{ t:"12.00", ok:true }, { t:"11.70" }, { t:"2.30" }, { t:"2.00" }],
        explain:"Each Ba(OH)₂ gives 2 OH⁻. 11.70 forgets the 2; 2.30 and 2.00 are pOH values." },
      { id:"p4", prompt:"Very dilute view: HCl 1.0 × 10⁻⁸ mol/L. What is the pH?",
        options:[{ t:"Just under 7 (about 6.98)", ok:true }, { t:"8.00" }, { t:"6.00" }, { t:"14.00" }],
        explain:"Water already supplies 1.0 × 10⁻⁷ mol/L of H₃O⁺, ten times more than this acid adds. An acid can’t make a solution basic." }
    ],
    chalIntro:"Use the ladder to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses <strong>Mix</strong> mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Make an HNO₃ solution with pH 2.70.",
        why:"−log(2.0 × 10⁻³) = 3 − 0.30 = 2.70.",
        general:"Choose HNO₃, then pick the mantissa and the power of 10.",
        hints:["2.70 = 3 − 0.30.", "log 2 = 0.30, so [H₃O⁺] = 2 × 10⁻³.", "2.0 × 10⁻³ mol/L."] },
      { id:"tc2", goal:[1, 3], prompt:"Make a Ca(OH)₂ solution with pOH 2.00.",
        why:"Each Ca(OH)₂ gives 2 OH⁻: [OH⁻] = 2 × 5.0 × 10⁻³ = 1.0 × 10⁻² mol/L, so pOH 2.00.",
        general:"Choose Ca(OH)₂, then pick the mantissa and the power of 10.",
        hints:["pOH 2.00 means [OH⁻] = 1.0 × 10⁻² mol/L.", "Each Ca(OH)₂ gives 2 OH⁻.", "Half of 1.0 × 10⁻²: 5.0 × 10⁻³ mol/L."] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Mix mode: choose volumes of 0.10 mol/L HCl and 0.10 mol/L NaOH so that the final pH is exactly 1.70.",
        why:"Excess H₃O⁺: 3.0 × 10⁻³ − 2.0 × 10⁻³ = 1.0 × 10⁻³ mol in 50.0 mL = 0.020 mol/L, pH 1.70.",
        general:"Switch to Mix mode and choose both volumes.",
        hints:["pH 1.70 means [H₃O⁺] = 0.020 mol/L after mixing.", "Excess moles ÷ total volume = 0.020.", "0.10(<i>V</i><sub>a</sub> − <i>V</i><sub>b</sub>) ÷ (<i>V</i><sub>a</sub> + <i>V</i><sub>b</sub>) = 0.020 gives <i>V</i><sub>a</sub> = 1.5<i>V</i><sub>b</sub>: 30.0 mL and 20.0 mL."] }
    ]
  },
  part3:{
    slug:"everyday", name:"Everyday pH", heading:"pH in daily life",
    intro:"pH numbers show up in kitchens, hospitals and lakes. Place everyday liquids on the pH strip, see why blood’s pH is held so tightly, check a lake’s data, and model an antacid.",
    // VERIFY: typical pH values for these items (plan §6 risk 2).
    strip:{ title:"Station 1: The pH strip",
      intro:"Choose an item, then tap where it sits on the pH strip. These are typical values.",
      items:[
        { id:"stom", t:"Stomach acid", lo:1.5, hi:3.5, typ:"about 1.5–3.5" },
        { id:"lem", t:"Lemon juice", lo:2, hi:2, typ:"about 2" },
        { id:"rain", t:"Rain (unpolluted)", lo:5.6, hi:5.6, typ:"about 5.6" },
        { id:"milk", t:"Milk", lo:6.5, hi:6.5, typ:"about 6.5" },
        { id:"blood", t:"Blood", lo:7.35, hi:7.45, typ:"7.35–7.45" },
        { id:"sea", t:"Seawater", lo:8.1, hi:8.1, typ:"about 8.1" },
        { id:"amm", t:"Household ammonia", lo:11, hi:12, typ:"about 11–12" }
      ] },
    blood:{ title:"Station 2: Blood’s narrow range",
      prompt:"Blood at pH 7.40 vs 7.10: how many times more H₃O⁺ in the second?",
      use:"Use log 2 = 0.30.",
      note:"Small pH changes are big chemical changes. (Buffers come in module 44.)" },
    lake:{ title:"Station 3: Acid lakes on the Canadian Shield",
      // VERIFY: the fish threshold "about pH 5" (plan §6 risk 2).
      html:"<p>Thin soils over granite can’t neutralize acid rain. A lake whose pH falls from 6.0 to 5.0 has 10 times the [H₃O⁺]; many fish species struggle below about pH 5.</p>",
      data:[[1990, 6.0], [2000, 5.7], [2010, 5.3], [2020, 5.0]],
      q:"How many times greater is [H₃O⁺] in 2020 than in 1990?",
      choices:[
        { t:"10 times", ok:true, fb:"Right. pH fell by 1.0 unit: 10⁻⁵ ÷ 10⁻⁶ = 10." },
        { t:"1.2 times", fb:"6.0 ÷ 5.0 = 1.2 compares pH numbers. Compare [H₃O⁺]: each pH unit is ×10." },
        { t:"2 times", fb:"A drop of 1.0 pH unit is a factor of 10, not 2." },
        { t:"100 times", fb:"That would be a drop of 2 pH units." }] },
    antacid:{ title:"Station 4: Antacids",
      html:"<p>A model stomach holds 0.10 L of fluid at pH 1.30, so [H₃O⁺] = 0.050 mol/L and it contains 0.0050 mol of H₃O⁺. One antacid tablet neutralizes 0.0020 mol of H₃O⁺ (the volume stays the same).</p>",
      note:"Model numbers, not medical advice." },
    quickCheck:{
      title:"Quick check", summary:"Everyday pH quick check",
      items:[
        { id:"q1", goal:4, prompt:"Unpolluted rain (pH 5.6) vs a lake at pH 4.6: [H₃O⁺] ratio?",
          choices:[
            { t:"10 times", ok:true, fb:"Right. One pH unit = ×10." },
            { t:"1 time", fb:"One pH unit = ×10." },
            { t:"2 times", fb:"One pH unit = ×10." },
            { t:"100 times", fb:"One pH unit = ×10." }] },
        { id:"q2", goal:4, prompt:"Blood pH drops from 7.40 to 7.10. [H₃O⁺]…",
          choices:[
            { t:"doubles", ok:true, fb:"Right. 0.30 pH units = log 2: a factor of 2." },
            { t:"rises 30%", fb:"0.30 pH units = log 2: a factor of 2." },
            { t:"halves", fb:"0.30 pH units = log 2: a factor of 2." },
            { t:"rises 10 times", fb:"0.30 pH units = log 2: a factor of 2." }] },
        { id:"q3", goal:[3, 4], prompt:"After the antacid in Station 4, the pH is…",
          choices:[
            { t:"1.52", ok:true, fb:"Right. 0.0030 mol ÷ 0.10 L = 0.030 mol/L." },
            { t:"7.00", fb:"0.0030 mol ÷ 0.10 L = 0.030 mol/L." },
            { t:"1.30", fb:"0.0030 mol ÷ 0.10 L = 0.030 mol/L." },
            { t:"2.00", fb:"0.0030 mol ÷ 0.10 L = 0.030 mol/L." }] },
        { id:"q4", goal:[3, 4], prompt:"Why can’t adding pure water make the lake’s pH go above 7?",
          choices:[
            { t:"Water itself is neutral, pH 7", ok:true, fb:"Right. Diluting an acid only approaches pH 7." },
            { t:"Water is basic", fb:"Diluting an acid only approaches pH 7." },
            { t:"Water removes acid ions", fb:"Diluting an acid only approaches pH 7." },
            { t:"Water raises " + KW, fb:"Diluting an acid only approaches pH 7." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Concentration ↔ pH", summary:"Concentration ↔ pH", goal:[1, 2],
        instruction:"Match each solution (25 °C) to its pH.",
        leftTitle:"Solution (25 °C)", rightTitle:"pH",
        left:PAIRS.map((p, i) => {
          const L = { id:"l" + (i + 1), t:p[0], why:p[2] };
          if (i === 6) L.hints = ["pOH = −log(5.0 × 10⁻⁵).", "5 − 0.70 = 4.30.", "pH = 14.00 − 4.30 = 9.70."];
          return L;
        }),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r9", t:"1.70" }, { id:"r10", t:"3.70" }, { id:"r11", t:"2.7" }]),
        answer:MATCH_ANS,
        wrong:{ "l6|r9":"1.70 is the pOH; pH = 14.00 − 1.70.", "l3|r10":"log 5 = 0.70, so 4 − 0.70 = 3.30.", "l2|r11":"Two significant digits in 2.0 give two decimal places: 2.70." },
        wrongDefault:"pH = −log[H₃O⁺]; for [OH⁻], find pOH first." },
      { id:"calc", type:"custom", title:"Calculate it", summary:"Calculate it", star:true, goal:[1, 3],
        instruction:"Six calculations. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer, then press Check. pH values within 0.01 are accepted; write pH to two decimal places.",
        use:"Use these values: " + LOGS,
        items:[
          { id:"c1", kind:"ph", goal:1, prompt:"pH of 0.030 mol/L HCl", answer:1.52, display:"pH 1.52",
            wrong:[{ match:2.48, fb:"log 3 = 0.48 is subtracted from 2: 2 − 0.48." }],
            fb:"For a strong acid, [H₃O⁺] equals the acid’s concentration; then pH = −log[H₃O⁺].",
            why:"[H₃O⁺] = 3.0 × 10⁻² mol/L; pH = 2 − 0.48 = 1.52.",
            hints:["Write 0.030 as 3.0 × 10⁻².", "pH = −log(3.0 × 10⁻²) = 2 − log 3.", "2 − 0.48 = 1.52."] },
          { id:"c2", kind:"ph", goal:1, prompt:"pH of 0.0025 mol/L Ca(OH)₂", answer:11.70, display:"pH 11.70",
            wrong:[{ match:11.40, fb:"[OH⁻] = 2 × 0.0025 = 0.0050." }, { match:2.30, fb:M3 }],
            fb:"Find [OH⁻] first, then pOH, then pH.",
            why:"[OH⁻] = 2 × 0.0025 = 0.0050 mol/L; pOH = 3 − 0.70 = 2.30; pH = 14.00 − 2.30 = 11.70.",
            hints:["How many OH⁻ does each Ca(OH)₂ give?", "[OH⁻] = 0.0050 mol/L, so pOH = 3 − 0.70 = 2.30.", "pH = 14.00 − 2.30 = 11.70."] },
          { id:"c3", kind:"sci", star:true, goal:2, prompt:"[H₃O⁺] of a solution with pH 4.70", answer:2.0e-5, display:"2.0 × 10⁻⁵ mol/L",
            wrong:[{ match:5.0e-5, fb:"4.70 = 5 − 0.30, and log 2 = 0.30." }],
            fb:"Write −4.70 as a log value plus a whole number, then undo the log.",
            why:"−4.70 = 0.30 − 5, so [H₃O⁺] = 10<sup>0.30</sup> × 10⁻⁵ = 2.0 × 10⁻⁵ mol/L.",
            hints:["[H₃O⁺] = 10<sup>−4.70</sup>.", "−4.70 = 0.30 − 5, and 10<sup>0.30</sup> = 2.", "2.0 × 10⁻⁵ mol/L."] },
          { id:"c4", kind:"ph", star:true, goal:3, prompt:"25.0 mL of 0.20 mol/L HCl is diluted to 500.0 mL. pH?", answer:2.00, display:"pH 2.00",
            wrong:[{ match:0.70, fb:"That’s before dilution." }],
            fb:"Find the new concentration with <i>c</i>₁<i>V</i>₁ = <i>c</i>₂<i>V</i>₂ first.",
            why:"<i>c</i>₂ = 0.20 × 25.0 ÷ 500.0 = 0.010 mol/L, so pH 2.00.",
            hints:["The volume goes up 20 times.", "<i>c</i>₂ = 0.20 ÷ 20 = 0.010 mol/L.", "pH = −log(0.010) = 2.00."] },
          { id:"c5", kind:"ph", star:true, goal:3, prompt:"30.0 mL of 0.10 mol/L HCl + 10.0 mL of 0.10 mol/L NaOH. pH?", answer:1.30, display:"pH 1.30",
            wrong:[{ match:1.00, fb:"The excess (0.0020 mol) is in 40.0 mL." }],
            fb:M6,
            why:"H₃O⁺ 3.0 × 10⁻³ mol − OH⁻ 1.0 × 10⁻³ mol = 2.0 × 10⁻³ mol in 40.0 mL = 0.050 mol/L; pH = 2 − 0.70 = 1.30.",
            hints:["Find the moles of H₃O⁺ and OH⁻.", "Excess H₃O⁺ = 0.0020 mol in 0.0400 L.", "0.050 mol/L: pH = 2 − 0.70 = 1.30."] },
          { id:"c6", kind:"num", star:true, goal:3, prompt:"How much water must be added to 10.0 mL of HCl at pH 1.00 to make pH 3.00?", answer:990, tol:0.5, unit:"mL", display:"990 mL",
            wrong:[{ match:1000, fb:"The final volume is 1.00 L; you add 990 mL." }],
            fb:"pH up by 2 means [H₃O⁺] ÷ 100.",
            why:"The final volume must be 100 × 10.0 mL = 1000 mL, so add 1000 − 10.0 = 990 mL.",
            hints:["pH up by 2 means [H₃O⁺] ÷ 100.", "The final volume must be 100 × 10.0 mL = 1000 mL.", "Add 1000 − 10.0 = 990 mL."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Willa", how:"", goal:[1, 3],
        instruction:"Willa made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the pH of 0.0050 mol/L Ba(OH)₂.",
            steps:["Ba(OH)₂ is a strong base.", "[OH⁻] = 0.0050 mol/L.", "pOH = 2.30, so pH = 11.70."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Ba(OH)₂ gives 2 OH⁻: [OH⁻] = 0.010 mol/L, pOH 2.00, pH 12.00.", ok:true, why:M2 },
              { t:"[OH⁻] = 0.0025 mol/L.", why:"That halves instead of doubling." },
              { t:"pH = 2.30.", why:"That’s a pOH." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["How many OH⁻ per Ba(OH)₂?", "Two.", "0.010 mol/L, pH 12.00."] },
          { id:"e2", goal:2, task:"Find the pH of 0.010 mol/L KOH.",
            steps:["KOH is a strong base: [OH⁻] = 0.010 mol/L.", "pH = −log(0.010) = 2.00.", "So the solution is acidic."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2’s mistake."],
            fixes:[
              { t:"−log[OH⁻] = 2.00 is the pOH; pH = 14.00 − 2.00 = 12.00.", ok:true, why:M3 },
              { t:"pH = log(0.010) = −2.00.", why:"pH values here are positive." },
              { t:"pH = 0.010.", why:"pH is a log." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Which ion did you take the log of?", "OH⁻ gives pOH.", "pH = 12.00."] },
          { id:"e3", goal:3, task:"Find the pH after mixing 25.0 mL of 0.20 mol/L HCl with 25.0 mL of 0.10 mol/L NaOH.",
            steps:["The HCl alone has pH 0.70; the NaOH alone has pH 13.00.", "The mixture’s pH is the average: (0.70 + 13.00) ÷ 2 = 6.85."],
            answer:1,
            stepFb:["Step 1’s values are right. What should come next?", ""],
            fixes:[
              { t:"Use moles: H₃O⁺ 5.0 × 10⁻³ mol, OH⁻ 2.5 × 10⁻³ mol; the excess 2.5 × 10⁻³ mol in 50.0 mL = 0.050 mol/L, so pH 1.30.", ok:true, why:M6 },
              { t:"Average the concentrations instead.", why:"Still not moles; and acid and base cancel." },
              { t:"pH 7.00, because acid and base neutralize.", why:"Only if the moles are equal." },
              { t:"Step 2 is correct.", why:M6 }],
            hints:["Can pH values be averaged?", "No; neutralize moles.", "Excess 2.5 × 10⁻³ mol ÷ 0.0500 L = 0.050 mol/L; pH 1.30."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that a very dilute acid never goes above pH 7 (P4), or how big a change one pH unit is?" },
      { id:"j2", q:"In your own words, explain why pH + pOH always equals 14.00 at 25 °C." },
      { id:"j3", q:"Explain to a friend how to find the pH after mixing a strong acid with a strong base." },
      { id:"j4", q:"Which step do you still slip on (the factor of 2, pOH vs pH, decimal places, total volume)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"At 25 °C, [H₃O⁺] = 1.0 × 10⁻⁴ mol/L. What is [OH⁻]?", use:LOGS, options:[
          { t:"1.0 × 10⁻¹⁰ mol/L", ok:true, why:KW + " ÷ [H₃O⁺] = 10⁻¹⁴ ÷ 10⁻⁴." },
          { t:"1.0 × 10⁻⁴ mol/L", why:"[H₃O⁺] and [OH⁻] are equal only in neutral water, where both are 1.0 × 10⁻⁷." },
          { t:"10 mol/L", why:"That’s the pOH value mistaken for a concentration." },
          { t:"1.0 × 10⁴ mol/L", why:"That’s 1 ÷ [H₃O⁺]; you need " + KW + " ÷ [H₃O⁺]." }] },
        b:{ prompt:"A solution has pOH = 3.00 at 25 °C. What is its pH?", use:LOGS, options:[
          { t:"11.00", ok:true, why:"14.00 − 3.00." },
          { t:"3.00", why:M3 },
          { t:"17.00", why:"pH + pOH = 14.00, so subtract." },
          { t:"−3.00", why:"pH values here are positive." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"What is the pH of 0.0010 mol/L HNO₃?", use:LOGS, options:[
          { t:"3.00", ok:true, why:"Strong acid: [H₃O⁺] = 1.0 × 10⁻³." },
          { t:"11.00", why:"That’s 14.00 − 3.00, as if it were a base." },
          { t:"0.0010", why:"pH is −log of the concentration." },
          { t:"−3.00", why:"Don’t forget the minus sign in −log." }] },
        b:{ prompt:"What is the pH of 0.010 mol/L KOH?", use:LOGS, options:[
          { t:"12.00", ok:true, why:"pOH 2.00, so pH 12.00." },
          { t:"2.00", why:M3 },
          { t:"0.010", why:"pH is a log value." },
          { t:"14.01", why:"pH = 14.00 − pOH, not 14.00 + concentration." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"How do [H₃O⁺] values compare for solutions at pH 4 and pH 6?", options:[
          { t:"pH 4 has 100 times more", ok:true, why:"Two units = 10²." },
          { t:"pH 4 has 2 times more", why:M1 },
          { t:"pH 4 has 1.5 times more", why:"Ratios of pH values mean nothing; differences do. " + M1 },
          { t:"pH 4 has 20 times more", why:M1 }] },
        b:{ prompt:"Water is added to an acid solution at pH 2. Which pH values could it reach?", options:[
          { t:"Any value between 2 and 7, never above 7", ok:true, why:M4 },
          { t:"Above 7, if enough water is added", why:M4 },
          { t:"It stays at 2", why:"Dilution lowers [H₃O⁺]." },
          { t:"Below 2", why:"Dilution raises the pH." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"What is the pH of 0.0050 mol/L Ba(OH)₂?", use:LOGS, options:[
          { t:"12.00", ok:true, why:"[OH⁻] = 0.010; pOH 2.00." },
          { t:"11.70", why:"Each Ba(OH)₂ gives 2 OH⁻." },
          { t:"2.00", why:"That’s the pOH." },
          { t:"2.30", why:"Both slips at once: " + M2 + " " + M3 }] },
        b:{ prompt:"What is the pH of 0.025 mol/L Ca(OH)₂?", use:LOGS, options:[
          { t:"12.70", ok:true, why:"[OH⁻] = 0.050; pOH = 2 − 0.70 = 1.30." },
          { t:"12.40", why:"[OH⁻] is 0.050, not 0.025." },
          { t:"1.30", why:M3 },
          { t:"1.60", why:"Both slips at once: " + M2 + " " + M3 }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"25.0 mL of 0.20 mol/L HCl is mixed with 25.0 mL of 0.10 mol/L NaOH. What is the pH?", use:LOGS, options:[
          { t:"1.30", ok:true, why:"Excess H₃O⁺ 2.5 × 10⁻³ mol in 50.0 mL = 0.050 mol/L." },
          { t:"1.00", why:"The excess is in 50.0 mL, not 25.0 mL." },
          { t:"0.70", why:"That’s the HCl before mixing." },
          { t:"6.85", why:"pH values can’t be averaged. " + M6 }] },
        b:{ prompt:"30.0 mL of 0.20 mol/L NaOH is mixed with 20.0 mL of 0.25 mol/L HCl. What is the pH?", use:LOGS, options:[
          { t:"12.30", ok:true, why:"OH⁻ 6.0 × 10⁻³ mol, H₃O⁺ 5.0 × 10⁻³ mol; excess OH⁻ 1.0 × 10⁻³ mol in 50.0 mL = 0.020 mol/L; pOH 1.70." },
          { t:"1.70", why:"That’s the pOH." },
          { t:"12.52", why:"Divide by the total volume, 50.0 mL, not 30.0 mL." },
          { t:"7.00", why:"The moles of acid and base aren’t equal." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"What is the approximate pH of 1.0 × 10⁻⁹ mol/L HCl?", options:[
          { t:"About 7.00, because water’s own H₃O⁺ (1.0 × 10⁻⁷ mol/L) dominates", ok:true, why:M4 },
          { t:"9.00", why:"An acid can’t make a solution basic." },
          { t:"5.00", why:"That would need 1.0 × 10⁻⁵ mol/L of acid." },
          { t:"14.00", why:"That’s a strongly basic pH." }] },
        b:{ prompt:"What is the approximate pH of 1.0 × 10⁻⁸ mol/L NaOH?", options:[
          { t:"Just above 7 (about 7.02)", ok:true, why:"Water’s OH⁻ (1.0 × 10⁻⁷) is ten times the added OH⁻." },
          { t:"6.00", why:"A base can’t make a solution acidic." },
          { t:"8.00", why:"That’s −log[OH⁻] treated as pH, and it ignores water’s own OH⁻." },
          { t:"14.00", why:"Far too basic for so little NaOH." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why pH + pOH = 14.00 at 25 °C?", options:[
          { t:"“[H₃O⁺][OH⁻] = " + KW + " = 1.0 × 10⁻¹⁴; taking −log of both sides gives pH + pOH = 14.00.”", ok:true, why:"The sum comes straight from water’s ion product." },
          { t:"“Acids and bases always cancel to 14.”", why:"Nothing cancels; it comes from " + KW + "." },
          { t:"“The scale is defined to stop at 14.”", why:"pH can go below 0 or above 14 in very concentrated solutions." },
          { t:"“pH and pOH are always equal to 7.”", why:"Only in neutral water." }] },
        b:{ prompt:"A student reports [H₃O⁺] = 2.0 × 10⁻³ mol/L as “pH 2.7”. Which is the best correction?", options:[
          { t:"“Write pH 2.70: two significant digits in the concentration give two decimal places in the pH.”", ok:true, why:M5 },
          { t:"“Write pH 3: round to a whole number.”", why:"That throws away information." },
          { t:"“Write pH 2.698.”", why:"Too many digits for the data." },
          { t:"“Write pH −2.70.”", why:"−log makes it positive." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"A lake’s pH falls from 6.5 to 5.5. Which description is accurate?", options:[
          { t:"“[H₃O⁺] increased tenfold.”", ok:true, why:"One pH unit down = 10 times the [H₃O⁺]." },
          { t:"“The acidity rose by about 15%.”", why:M1 },
          { t:"“[H₃O⁺] doubled.”", why:M1 },
          { t:"“[H₃O⁺] fell tenfold.”", why:"A lower pH means more H₃O⁺." }] },
        b:{ prompt:"A cleaner’s pH rises from 8.0 to 9.0. Which description is accurate?", options:[
          { t:"“[OH⁻] increased tenfold and [H₃O⁺] fell tenfold.”", ok:true, why:"One pH unit up: [H₃O⁺] ÷ 10, so [OH⁻] × 10." },
          { t:"“[OH⁻] increased by 12.5%.”", why:M1 },
          { t:"“[OH⁻] doubled.”", why:M1 },
          { t:"“[H₃O⁺] increased tenfold.”", why:"A higher pH means less H₃O⁺." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A model acid lake has pH 4.70. What is its [H₃O⁺]?", use:LOGS, options:[
          { t:"2.0 × 10⁻⁵ mol/L", ok:true, why:"4.70 = 5 − 0.30; log 2 = 0.30." },
          { t:"5.0 × 10⁻⁵ mol/L", why:"That would be pH 4.30." },
          { t:"4.7 × 10⁻¹ mol/L", why:"The pH isn’t the mantissa." },
          { t:"2.0 × 10⁻⁴ mol/L", why:"That’s pH 3.70." }] },
        b:{ prompt:"A model stomach-fluid sample has pH 1.30. What is its [H₃O⁺]?", use:LOGS, options:[
          { t:"0.050 mol/L", ok:true, why:"1.30 = 2 − 0.70; log 5 = 0.70." },
          { t:"0.020 mol/L", why:"That’s pH 1.70." },
          { t:"1.3 mol/L", why:"The pH isn’t the concentration." },
          { t:"0.50 mol/L", why:"That’s pH 0.30." }] } },
      { id:"a2", cat:"A", goal:[4, 3],
        a:{ prompt:"A 0.10 L model of stomach fluid has pH 1.30. An antacid tablet neutralizes 0.0020 mol of H₃O⁺ (volume unchanged). What is the new pH?", use:LOGS + " Model numbers, not medical advice.", options:[
          { t:"1.52", ok:true, why:"0.0050 − 0.0020 = 0.0030 mol in 0.10 L = 0.030 mol/L; 2 − 0.48." },
          { t:"7.00", why:"The tablet doesn’t neutralize all 0.0050 mol." },
          { t:"1.30", why:"The tablet removed some H₃O⁺." },
          { t:"2.00", why:"That would need 0.010 mol/L left." }] },
        b:{ prompt:"A 0.20 L model sample has pH 1.00. A tablet neutralizes 0.010 mol of H₃O⁺. What is the new pH?", use:LOGS + " Model numbers, not medical advice.", options:[
          { t:"1.30", ok:true, why:"0.020 − 0.010 = 0.010 mol in 0.20 L = 0.050 mol/L." },
          { t:"7.00", why:"Not all the H₃O⁺ is neutralized." },
          { t:"1.00", why:"Some H₃O⁺ was removed." },
          { t:"2.00", why:"That would need 0.010 mol/L, but 0.010 mol is in 0.20 L." }] } }
    ]
  },
  task:{
    title:"Mix to a target", summary:"Mix to a target",
    statement:"<p>Mix 0.10 mol/L HCl with 0.10 mol/L NaOH to make a solution that meets every condition. Can you find all the answers?</p><ol class=\"ph-conds\"><li>The final solution is acidic.</li><li>Its pH is between 1.40 and 2.00.</li><li>The total volume is at least 60.0 mL.</li></ol>",
    checks:["Acidic", "pH 1.40–2.00", "At least 60.0 mL"],
    tips:["More acid than base keeps it acidic.", "pH too low: less excess acid or more total volume. pH too high: more excess acid.", "Use larger volumes; keep the same difference."],
    explainPrompt:"Explain how you found the pH of your mixture, and why averaging the two starting pH values wouldn’t work.",
    vocab:"Use the words moles, excess, total volume and pH.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"pH depends on the excess <strong>and</strong> the total volume: 40.0/20.0 and 20.0/10.0 have the same excess ratio and the same pH (1.48), but only one is big enough."
  },
  cards:[
    ["pH", "−log[H₃O⁺]."],
    ["pOH", "−log[OH⁻]."],
    [KW + " (25 °C)", "[H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴."],
    ["pH + pOH", "14.00 at 25 °C."],
    ["Neutral at 25 °C", "[H₃O⁺] = [OH⁻] = 1.0 × 10⁻⁷ mol/L; pH 7.00."],
    ["One pH unit", "A factor of 10 in [H₃O⁺]."],
    ["Ca(OH)₂, Ba(OH)₂", "Each gives 2 OH⁻: [OH⁻] = 2 × concentration."],
    ["Decimal places", "Digits after the decimal in pH = significant digits in [H₃O⁺]."],
    ["×10 dilution", "A strong acid’s pH rises by 1 (but never above 7)."],
    ["Mixing acid and base", "Moles of H₃O⁺ − moles of OH⁻, then ÷ total volume."],
    ["Log values to use", "log 2 = 0.30, log 3 = 0.48, log 5 = 0.70, log 7 = 0.85."]
  ]
};
