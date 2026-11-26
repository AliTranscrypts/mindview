// SCH4U 40 Ka and Kb Calculations. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/40-ka-and-kb.md
// Pictures (hero flask + ICE animation, the C7 ICE table workbench, the Part 3 ranking stations, the task preview) are
// drawn by app.js. Every Ka/Kb comes from MV.chem.data (course table); the model acids HX, HY, HZ are labelled "model".

const Ka = "<i>K</i><sub>a</sub>", Kb = "<i>K</i><sub>b</sub>", Kw = "<i>K</i><sub>w</sub>", X = "<i>x</i>", c = "<i>c</i>";
const E = (m, e) => m + " × 10<sup>" + (e < 0 ? "−" + (-e) : e) + "</sup>";
const X2 = X + "²";

// Misconception core sentences (plan §3)
const M1 = "A weak acid ionizes only a little: find " + X + " from " + Ka + ", don’t use the concentration as [H₃O⁺].";
const M2 = X2 + " = " + Ka + " × " + c + ", so " + X + " = √(" + Ka + " × " + c + ").";
const M3 = "Check " + X + " ÷ " + c + " × 100%. Over 5%: solve the quadratic.";
const M4 = "−log[OH⁻] is pOH. pH = 14.00 − pOH.";
const M5 = Ka + " × " + Kb + " = " + Kw + " = " + E("1.0", -14) + ", so " + Kb + " = " + Kw + " ÷ " + Ka + ".";
const M6 = "Larger " + Ka + " = stronger acid = weaker conjugate base.";
const M7 = "Dilution shifts the equilibrium toward more ions: percent ionization rises.";
const M8 = "Water is the solvent; it’s left out.";

const USE_P = "log 1.8 = 0.26, log 6 = 0.78, log 2 = 0.30.";
const USE_F = "log 1.8 = 0.26, log 2 = 0.30, log 3.6 = 0.56, log 6 = 0.78, 1 ÷ 6.6 ≈ 0.15; " + Kw + " = " + E("1.0", -14) + ". Use the course " + Ka + "/" + Kb + " table.";

// Practice 1: species ↔ expression (plan Activity 1)
const PAIRS = [
  ["HF", Ka + " = [H₃O⁺][F⁻] ÷ [HF]", "HF gives H₃O⁺ and F⁻."],
  ["HOCl", Ka + " = [H₃O⁺][OCl⁻] ÷ [HOCl]", "HOCl gives H₃O⁺ and OCl⁻."],
  ["HCOOH", Ka + " = [H₃O⁺][HCOO⁻] ÷ [HCOOH]", "Methanoic acid gives H₃O⁺ and methanoate, HCOO⁻."],
  ["NH₄⁺", Ka + " = [H₃O⁺][NH₃] ÷ [NH₄⁺]", "NH₄⁺ is an acid: it gives H₃O⁺ and its conjugate base, NH₃."],
  ["NH₃", Kb + " = [NH₄⁺][OH⁻] ÷ [NH₃]", "NH₃ is a base: it takes H⁺ from water and makes OH⁻."],
  ["CH₃COO⁻", Kb + " = [CH₃COOH][OH⁻] ÷ [CH₃COO⁻]", "Ethanoate is a base: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻."],
  ["CH₃NH₂", Kb + " = [CH₃NH₃⁺][OH⁻] ÷ [CH₃NH₂]", "Methylamine is a base: it makes CH₃NH₃⁺ and OH⁻."],
  ["C₆H₅COOH", Ka + " = [H₃O⁺][C₆H₅COO⁻] ÷ [C₆H₅COOH]", "Benzoic acid gives H₃O⁺ and benzoate, C₆H₅COO⁻."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const MATCH_WRONG = {
  "l4|r5":"NH₄⁺ is an acid (gives H₃O⁺); NH₃ is a base (gives OH⁻).",
  "l5|r4":"NH₄⁺ is an acid (gives H₃O⁺); NH₃ is a base (gives OH⁻)."
};
["r1", "r2", "r3", "r4", "r8"].forEach(r => { MATCH_WRONG["l6|" + r] = "Ethanoate is a base: it takes H⁺ from water and makes OH⁻."; });

export default {
  id:"40-ka-and-kb",
  kind:"topic",
  title:"Ka and Kb calculations",
  topic:"Ka and Kb Calculations",
  readyTopic:"Ka and Kb calculations",
  hero:{
    eq:'<span class="nw">HA + H₂O ⇌ H₃O⁺ + A⁻</span> ⟶ <span class="nw">' + Ka + " = [H₃O⁺][A⁻] ÷ [HA]</span> ⟶ <span class=\"nw\">" + X + " ≈ √(" + Ka + " × " + c + ")</span>", eqSize:"sm",
    eqLabel:"H A plus water is in equilibrium with H 3 O plus and A minus; K a equals H 3 O plus times A minus, divided by H A; x is about the square root of K a times c",
    headline:"Weak acids keep most of their protons",
    text:"A weak acid sets up an equilibrium, and its <strong>acid ionization constant</strong> " + Ka + " measures how far it goes. With an <strong>ICE table</strong>, " + Ka + " and the concentration give [H₃O⁺], and so the pH. The shortcut " + X + " ≈ √(" + Ka + " × " + c + ") works only if the <strong>5% check</strong> passes. Bases work the same way with <strong>" + Kb + "</strong>, and every conjugate pair obeys " + Ka + " × " + Kb + " = " + Kw + ".",
    fig:{ html:'<div class="kab-hx"><svg class="kab-hx-svg" id="kab-hx-svg" viewBox="0 0 480 300" role="img" aria-label="A flask of 0.18 mol/L ethanoic acid drawn as 100 particles. One particle splits into a magenta H₃O⁺ and a teal CH₃COO⁻. An ICE table writes itself: 0.18, minus x, 0.18 minus x for the acid; 0, plus x, x for each ion. Then x squared over 0.18 equals 1.8 × 10⁻⁵, so x = 1.8 × 10⁻³. A check badge reads 1.0% is under 5%: shortcut valid. The pH display settles on 2.74."></svg><div class="kab-hx-row"><button type="button" class="btn ghost sm" id="kab-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can write " + Ka + " and " + Kb + " expressions and set up ICE tables for weak acids and bases.",
    "I can calculate the pH of a weak acid or base from " + "<i>K</i>" + " and its concentration, including the 5% check.",
    "I can calculate " + Ka + " from a concentration and a measured pH.",
    "I can calculate percent ionization and explain how it changes with dilution.",
    "I can use " + Ka + " × " + Kb + " = " + Kw + " and rank acids and conjugate bases by strength.",
    "I can apply these calculations to everyday products such as vinegar and ammonia cleaners."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"ICE tables", goal:1,
          prompt:"For HA ⇌ H⁺ + A⁻ starting at 0.10 mol/L HA, what is the E row if " + X + " mol/L ionizes?",
          options:[
            { t:"0.10 − " + X + ", " + X + ", " + X, ok:true, why:"Each HA that ionizes makes one H⁺ and one A⁻." },
            { t:"0.10, " + X + ", " + X, why:"Some HA was used up." },
            { t:"0.10 − " + X + ", 2" + X + ", 2" + X, why:"The coefficients are all 1." },
            { t:X + ", 0.10, 0.10", why:"The products start at 0." }],
          hints:["I row: 0.10, 0, 0.", "C row: −" + X + ", +" + X + ", +" + X + ".", "Add them."] },
        { id:"w2", skill:"ICE tables", goal:3,
          prompt:"In a weak acid solution, [H₃O⁺] at equilibrium is " + E("1.0", -3) + " mol/L. In the ICE table, " + X + " equals…",
          options:[
            { t:E("1.0", -3), ok:true, why:X + " is the amount ionized = [H₃O⁺]." },
            { t:"3.00", why:"That’s the pH, not " + X + "." },
            { t:E("1.0", -11), why:"That’s [OH⁻]." },
            { t:E("1.0", -6), why:"That’s " + X2 + "." }],
          hints:["What does " + X + " stand for?", "The [H₃O⁺] formed.", E("1.0", -3) + "."] },
        { id:"w3", skill:"pH and pOH", goal:2,
          prompt:"Use log 6 = 0.78. What is the pH if [H₃O⁺] = " + E("6.0", -3) + " mol/L?",
          options:[
            { t:"2.22", ok:true, why:"3 − 0.78." },
            { t:"3.78", why:"Subtract the log of the mantissa: −log(6 × 10<sup>−3</sup>) = 3 − 0.78." },
            { t:"0.78", why:"Don’t forget the power of 10." },
            { t:"11.78", why:"That’s 14 − 2.22; this is an acid." }],
          hints:["−log(" + E("6.0", -3) + ") = 3 − log 6.", "log 6 = 0.78.", "2.22."] },
        { id:"w4", skill:"pH and pOH", goal:2,
          prompt:"A base solution has [OH⁻] = " + E("1.8", -3) + " mol/L, so pOH = 2.74. What is its pH?",
          options:[
            { t:"11.26", ok:true, why:"14.00 − 2.74." },
            { t:"2.74", why:"That’s the pOH. " + M4 },
            { t:"16.74", why:"Subtract from 14.00, don’t add." },
            { t:"7.00", why:"Bases have pH above 7, but not exactly 7." }],
          hints:["pH + pOH = ?", "14.00.", "11.26."] },
        { id:"w5", skill:"Square roots by hand", goal:2,
          prompt:"What is √(" + E("3.24", -6) + ")?",
          options:[
            { t:E("1.8", -3), ok:true, why:"1.8² = 3.24 and √10<sup>−6</sup> = 10<sup>−3</sup>." },
            { t:E("1.8", -6), why:"Halve the exponent too." },
            { t:E("3.24", -3), why:"Take the root of the mantissa." },
            { t:E("5.7", -4), why:"That would be √(" + E("3.24", -7) + ")." }],
          hints:["Root the mantissa and the power separately.", "√3.24 = 1.8; √10<sup>−6</sup> = 10<sup>−3</sup>.", E("1.8", -3) + "."] },
        { id:"w6", skill:"Square roots by hand", goal:4,
          prompt:X + " = " + E("1.8", -3) + " for a 0.18 mol/L acid. What percent of the acid is ionized?",
          options:[
            { t:"1.0%", ok:true, why:"(" + E("1.8", -3) + " ÷ 0.18) × 100%." },
            { t:"0.010%", why:"Multiply the fraction by 100." },
            { t:"10%", why:"Check the powers of 10." },
            { t:"1.8%", why:"Divide by 0.18 first." }],
          hints:["Percent = " + X + " ÷ " + c + " × 100%.", E("1.8", -3) + " ÷ 0.18 = 0.010.", "1.0%."] }
      ],
      refreshers:{
        "ICE tables":"I: start values; C: changes following the coefficients; E: I + C. For a weak acid, " + X + " = [H₃O⁺] at equilibrium.",
        "pH and pOH":"pH = −log[H₃O⁺]; pOH = −log[OH⁻]; pH + pOH = 14.00. Use these values: log 2 = 0.30, log 3 = 0.48, log 5 = 0.70, log 7 = 0.85 (log 6 = 0.78, log 1.8 = 0.26, log 3.6 = 0.56).",
        "Square roots by hand":"Make the power of 10 even first (" + E("3.6", -5) + " = 36 × 10<sup>−6</sup>), then root each part."
      }
    }
  },
  explore:{
    heading:"Weak acid ionizer",
    intro:"Choose a weak acid or base and a concentration. Watch the ICE table solve itself, and test the shortcut with the 5% check.",
    how:"Choose a mode, a species and a concentration. The equation, the ICE table, the particles and the readout update as you go.",
    modes:[{ id:"ph", t:"pH from <i>K</i>" }, { id:"k", t:"<i>K</i> from pH" }, { id:"pct", t:"Percent ionization" }, { id:"conj", t:"Conjugate pairs" }],
    concs:["0.0010", "0.012", "0.050", "0.10", "0.12", "0.18", "0.20", "0.72", "1.0"],
    tc3chips:[{ id:"eth", t:"ethanoic acid" }, { id:"nh4", t:"NH₄⁺" }, { id:"benz", t:"benzoic acid" }, { id:"hocl", t:"hypochlorous acid" }],
    predictions:[
      { id:"p1", prompt:"pH from <i>K</i>: ethanoic acid, 0.18 mol/L. [H₃O⁺] will be closest to…",
        options:[{ t:E("1.8", -3) + " mol/L", ok:true }, { t:"0.18 mol/L" }, { t:E("3.2", -6) + " mol/L" }, { t:E("1.8", -5) + " mol/L" }],
        explain:X2 + " = " + E("1.8", -5) + " × 0.18 = " + E("3.24", -6) + ", so " + X + " = " + E("1.8", -3) + ". 0.18 treats it as strong (M1); " + E("3.2", -6) + " forgets the root (M2); " + E("1.8", -5) + " is " + Ka + " itself." },
      { id:"p2", prompt:"Percent ionization mode: ethanoic acid is diluted from 0.18 to 0.0018 mol/L (the ÷100 button). Percent ionization will…",
        options:[{ t:"Rise to about 10%", ok:true }, { t:"Fall to 0.01%" }, { t:"Stay at 1.0%" }, { t:"Reach 100%" }],
        explain:"Dilution favours the side with more dissolved particles, so a larger fraction ionizes, even though [H₃O⁺] falls. (M7)" },
      { id:"p3", prompt:"pH from <i>K</i>: hydrofluoric acid, 0.10 mol/L, shortcut on. Does the 5% check pass?",
        options:[{ t:"No", ok:true }, { t:"Yes" }, { t:"Only for bases" }, { t:"The check doesn’t apply to HF" }],
        explain:"HF’s " + Ka + " is large compared with 0.10 × 0.05, so " + X + " isn’t tiny. Solve the quadratic. (M3)" },
      { id:"p4", prompt:"Conjugate pairs: ethanoic acid. What is " + Kb + " for the ethanoate ion, CH₃COO⁻?",
        options:[{ t:E("5.6", -10), ok:true }, { t:E("1.8", -5) }, { t:E("5.6", 4) }, { t:E("1.8", -19) }],
        explain:Kb + " = " + Kw + " ÷ " + Ka + " = " + E("1.0", -14) + " ÷ " + E("1.8", -5) + ". " + E("5.6", 4) + " is 1 ÷ " + Ka + " (M5)." }
    ],
    chalIntro:"Use the ionizer to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"pH from <i>K</i>, methanoic acid, shortcut on: choose the concentration that gives pH 2.22.",
        why:"At 0.20 mol/L, " + X + " = √(" + E("1.8", -4) + " × 0.20) = " + E("6.0", -3) + ", pH 2.22, and the 5% check passes at 3.0%.",
        general:"Not pH 2.22 yet. Use <strong>pH from <i>K</i></strong> mode with methanoic acid and the shortcut on, then try another concentration.",
        hints:["pH 2.22 means [H₃O⁺] = " + E("6.0", -3) + " (log 6 = 0.78).", c + " ≈ " + X2 + " ÷ " + Ka + " = " + E("3.6", -5) + " ÷ " + E("1.8", -4) + ".", c + " = 0.20 mol/L."] },
      { id:"tc2", goal:3, prompt:"<i>K</i> from pH mode: a 0.10 mol/L solution of model acid HX has pH 3.00. Enter " + Ka + ".",
        why:X + " = " + E("1.0", -3) + ", so " + Ka + " = (" + E("1.0", -3) + ")² ÷ 0.099 ≈ " + E("1.0", -5) + ".",
        general:"In <strong><i>K</i> from pH</strong> mode, choose model acid HX at 0.10 mol/L, enter the measured pH 3.00, then enter your " + Ka + ".",
        hints:["pH 3.00 gives " + X + " = " + E("1.0", -3) + ".", Ka + " = " + X2 + " ÷ (0.10 − " + X + ").", E("1.0", -6) + " ÷ 0.099 ≈ " + E("1.0", -5) + "."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Conjugate pairs mode: find the acid whose conjugate base has " + Kb + " closest to " + E("5.6", -10) + ", without opening each acid first. Choose your prediction, then check.",
        why:"Ethanoic acid: " + Kb + "(CH₃COO⁻) = " + E("1.0", -14) + " ÷ " + E("1.8", -5) + " = " + E("5.6", -10) + ". The readout confirms it when you show ethanoic acid’s conjugate.",
        general:"In <strong>Conjugate pairs</strong> mode, choose your prediction before you show any conjugate’s <i>K</i>.",
        hints:[Kb + " = " + Kw + " ÷ " + Ka + ", so you need " + Ka + " = " + Kw + " ÷ " + Kb + ".", E("1.0", -14) + " ÷ " + E("5.6", -10) + " = " + E("1.8", -5) + ".", "Ethanoic acid has " + Ka + " = " + E("1.8", -5) + "."] }
    ]
  },
  part3:{
    slug:"ranking", name:"Ranking", heading:"Ranking acids",
    intro:"Use the course " + Ka + " table as data: rank six acids, find how strong their conjugate bases are, and predict the pH order of their solutions.",
    s1:{ title:"Station 1: Sort the acids",
      intro:"Put the six acids in order of strength, strongest first, using their " + Ka + " values. Tap an acid, then use Move up and Move down.",
      ok:"Strongest to weakest: HF > methanoic > benzoic > ethanoic > hypochlorous > NH₄⁺. Compare the powers of 10 first, then the numbers in front.",
      bad:"Larger " + Ka + " = stronger acid. Compare the powers of 10 first, then the numbers in front." },
    s2:{ title:"Station 2: The conjugate ladder",
      intro:"For each acid, the panel computes " + Kb + " = " + Kw + " ÷ " + Ka + " for its conjugate base. Tap an acid to see the calculation.",
      cap:"The ladder flips: strongest acid, weakest base." },
    s3:{ title:"Station 3: Predict the pH order",
      intro:"Rank 0.10 mol/L solutions of the six acids by pH, lowest pH first.",
      ok:"Lowest to highest pH: HF, methanoic, benzoic, ethanoic, hypochlorous, NH₄⁺. The larger the " + Ka + ", the more H₃O⁺ and the lower the pH.",
      bad:"Larger " + Ka + " means more H₃O⁺, so a lower pH. Open <strong>Check it with data</strong> to compare." },
    blocks:[
      { title:"Station 4: Weak doesn’t mean safe",
        html:"<p>Hydrofluoric acid is weak, yet it’s one of the most hazardous acids in a lab, because the un-ionized HF passes through skin. Strength (" + Ka + ") and hazard are different questions; always read the safety data.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Ranking quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which 0.10 mol/L acid has the highest pH?",
          choices:[
            { t:"HOCl", ok:true, fb:"Right. Smallest " + Ka + ": the least H₃O⁺." },
            { t:"HF", fb:"Smallest " + Ka + ": the least H₃O⁺. (M6)" },
            { t:"methanoic", fb:"Smallest " + Ka + ": the least H₃O⁺. (M6)" },
            { t:"ethanoic", fb:"Smallest " + Ka + ": the least H₃O⁺. (M6)" }] },
        { id:"q2", goal:5, prompt:"Which conjugate base is strongest?",
          choices:[
            { t:"OCl⁻", ok:true, fb:"Right. The weakest acid has the strongest conjugate base." },
            { t:"F⁻", fb:"The weakest acid has the strongest conjugate base." },
            { t:"HCOO⁻", fb:"The weakest acid has the strongest conjugate base." },
            { t:"CH₃COO⁻", fb:"The weakest acid has the strongest conjugate base." }] },
        { id:"q3", goal:5, prompt:Kb + " of F⁻?",
          choices:[
            { t:E("1.5", -11), ok:true, fb:"Right. " + Kw + " ÷ " + Ka + " = " + E("1.0", -14) + " ÷ " + E("6.6", -4) + "." },
            { t:E("6.6", -4), fb:Kw + " ÷ " + Ka + ". (M5)" },
            { t:E("1.5", 3), fb:Kw + " ÷ " + Ka + ". (M5)" },
            { t:E("6.6", -18), fb:Kw + " ÷ " + Ka + ". (M5)" }] },
        { id:"q4", goal:5, prompt:"HF is a weak acid. Is it therefore safe to handle?",
          choices:[
            { t:"No: strength and hazard are different", ok:true, fb:"Right. Weak ≠ harmless." },
            { t:"Yes: weak acids are safe", fb:"Weak ≠ harmless." },
            { t:"Yes, if it’s dilute", fb:"Weak ≠ harmless." },
            { t:"No: it’s a strong acid", fb:"Weak ≠ harmless. HF is a weak acid, and it’s still hazardous." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"expr", type:"match", title:"Write the expression", summary:"Write the expression", goal:1,
        instruction:"Match each species in water to its " + Ka + " or " + Kb + " expression. (Water is the solvent: it’s left out.)",
        leftTitle:"Species in water", rightTitle:"Expression",
        left:PAIRS.map((p, i) => Object.assign({ id:"l" + (i + 1), t:p[0], why:p[2] },
          i === 5 ? { hints:["Is CH₃COO⁻ an acid or a base?", "A base: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻.", Kb + " = [CH₃COOH][OH⁻] ÷ [CH₃COO⁻]."] } : {})),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        wrong:MATCH_WRONG,
        wrongDefault:"Acids make H₃O⁺ and their conjugate base; bases make OH⁻ and their conjugate acid." },
      { id:"calc", type:"custom", title:"Calculate it", summary:"Calculate it", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Six calculations. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer, then press Check. For a <i>K</i> value, type the number in front and the power of 10 separately.",
        use:USE_P + " Use the course " + Ka + "/" + Kb + " table.",
        items:[
          { id:"a1", kind:"num", goal:2, prompt:"pH of 0.18 mol/L ethanoic acid", answer:2.74, tol:[0, 0.01], unit:"", label:"pH:", display:"pH 2.74",
            exactNote:"2.75 is the exact (quadratic) value; the shortcut gives 2.74. Both are accepted.",
            wrong:[{ match:0.74, fb:"That treats it as strong. " + M1 }, { match:5.49, fb:"Take the square root. " + M2 }],
            fb:"Find " + X + " from " + Ka + " with an ICE table, then pH = −log " + X + ".",
            why:X + " = √(" + E("1.8", -5) + " × 0.18) = " + E("1.8", -3) + " (1.0%, check passes); pH = 3 − 0.26 = 2.74.",
            hints:[X + " = √(" + Ka + " × " + c + ").", X + " = √(" + E("3.24", -6) + ") = " + E("1.8", -3) + ".", "pH = 3 − log 1.8 = 2.74."] },
          { id:"a2", kind:"num", goal:2, prompt:"pH of 0.12 mol/L hypochlorous acid", answer:4.22, tol:[0.01, 0.01], unit:"", label:"pH:", display:"pH 4.22",
            wrong:[{ match:0.92, fb:M1 }, { match:8.44, fb:M2 }],
            fb:"Find " + X + " from " + Ka + " with an ICE table, then pH = −log " + X + ".",
            why:X + " = √(" + E("3.0", -8) + " × 0.12) = " + E("6.0", -5) + "; pH = 5 − 0.78 = 4.22.",
            hints:[X + " = √(" + E("3.0", -8) + " × 0.12).", X + " = √(" + E("3.6", -9) + ") = √(36 × 10<sup>−10</sup>) = " + E("6.0", -5) + ".", "pH = 5 − log 6 = 4.22."] },
          { id:"a3", kind:"num", star:true, goal:2, prompt:"pH of 0.18 mol/L ammonia", answer:11.26, tol:[0.01, 0], unit:"", label:"pH:", display:"pH 11.26",
            exactNote:"11.25 is the exact (quadratic) value; the shortcut gives 11.26. Both are accepted.",
            wrong:[{ match:2.74, fb:"That’s the pOH. " + M4 }],
            fb:"For a base, " + X + " = [OH⁻]. Find pOH first.",
            why:"[OH⁻] = √(" + E("1.8", -5) + " × 0.18) = " + E("1.8", -3) + "; pOH = 2.74; pH = 14.00 − 2.74 = 11.26.",
            hints:["For a base, " + X + " = [OH⁻].", "[OH⁻] = " + E("1.8", -3) + ", so pOH = 2.74.", "pH = 14.00 − 2.74 = 11.26."] },
          { id:"a4", kind:"sci", star:true, goal:3, prompt:"A 0.050 mol/L solution of model acid HY has pH 3.00. Find " + Ka + ".", answer:2.0e-5, rtol:[0, 0.025], label:Ka + " =", display:E("2.0", -5),
            wrong:[{ match:1.0e-3, fb:"That’s " + X + "." }, { match:2.0e-2, fb:"That’s " + X + " ÷ " + c + "." }, { match:1.0e-6, fb:"That’s " + X2 + "; divide by [HY] = 0.050 − " + X + "." }],
            fb:Ka + " = " + X2 + " ÷ (" + c + " − " + X + ").",
            why:X + " = " + E("1.0", -3) + "; " + Ka + " = (" + E("1.0", -3) + ")² ÷ (0.050 − 0.001) ≈ " + E("2.0", -5) + ".",
            hints:[X + " = " + E("1.0", -3) + ".", Ka + " = (" + E("1.0", -3) + ")² ÷ (0.050 − 0.001).", "≈ " + E("2.0", -5) + "."],
            inv:{ prompt:"<strong>Investigation:</strong> In a real version, which measurement limits the accuracy of " + Ka + " most?",
              options:[
                { t:"The pH reading", ok:true, why:"An error of 0.05 in pH changes " + X + " by about 12%, and " + Ka + " by about 25%, because " + X + " is squared." },
                { t:"The beaker’s size", why:"An error of 0.05 in pH changes " + X + " by about 12%, and " + Ka + " by about 25%, because " + X + " is squared." },
                { t:"The colour of the solution", why:"An error of 0.05 in pH changes " + X + " by about 12%, and " + Ka + " by about 25%, because " + X + " is squared." },
                { t:"The time of day", why:"An error of 0.05 in pH changes " + X + " by about 12%, and " + Ka + " by about 25%, because " + X + " is squared." }] } },
          { id:"a5", kind:"num", star:true, goal:4, prompt:"Percent ionization of 0.20 mol/L methanoic acid (use the shortcut and check it)", answer:3.0, tol:[0.05, 0], unit:"%", label:"Percent ionization:", display:"3.0% (check passes)",
            exactNote:"2.96% is the exact (quadratic) value; the shortcut gives 3.0%. Both are accepted.",
            wrong:[{ match:0.030, fb:"Multiply by 100." }],
            fb:"Percent ionization = " + X + " ÷ " + c + " × 100%.",
            why:X + " = √(" + E("1.8", -4) + " × 0.20) = " + E("6.0", -3) + "; " + E("6.0", -3) + " ÷ 0.20 × 100% = 3.0%, under 5%, so the shortcut is fine.",
            hints:[X + " = √(" + E("1.8", -4) + " × 0.20).", X + " = √(" + E("3.6", -5) + ") = " + E("6.0", -3) + ".", E("6.0", -3) + " ÷ 0.20 × 100% = 3.0%."] },
          { id:"a6", kind:"num", star:true, goal:3, prompt:"What concentration of ethanoic acid has pH 3.00? (Use 1 ÷ 18 ≈ 0.056)", answer:0.057, tol:[0.0005, 0.0005], unit:"mol/L", label:"Concentration:", display:"0.057 mol/L",
            wrong:[{ match:1.0e-3, fb:"That’s [H₃O⁺], not the acid concentration. (M1)" }, { match:0.056, fb:"That’s " + c + " − " + X + ". Add " + X + " back to get " + c + "." }],
            fb:"Work backwards: pH gives " + X + ", then " + c + " − " + X + " = " + X2 + " ÷ " + Ka + ".",
            why:c + " − " + X + " = " + E("1.0", -6) + " ÷ " + E("1.8", -5) + " = 0.056, so " + c + " = 0.057 mol/L; the 5% check: " + E("1.0", -3) + " ÷ 0.057 ≈ 1.8%.",
            hints:["pH 3.00 gives " + X + " = " + E("1.0", -3) + ".", Ka + " = " + X2 + " ÷ (" + c + " − " + X + "), so " + c + " − " + X + " = " + E("1.0", -6) + " ÷ " + E("1.8", -5) + " = 0.056.", c + " = 0.056 + 0.001 = 0.057 mol/L; the 5% check: " + E("1.0", -3) + " ÷ 0.057 ≈ 1.8%."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", student:"Yohannes", how:"", goal:2,
        instruction:"Yohannes made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the pH of 0.10 mol/L ethanoic acid.",
            steps:["Ethanoic acid ionizes: CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻.", "So [H₃O⁺] = 0.10 mol/L.", "pH = −log 0.10 = 1.00."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"It’s weak: " + X2 + " ÷ 0.10 = " + E("1.8", -5) + ", so " + X + " ≈ " + E("1.3", -3) + " (1.3%, check passes) and pH ≈ 2.87.", ok:true, why:"A weak acid ionizes only a little, so " + X + " comes from " + Ka + "." },
              { t:"[H₃O⁺] = 0.050 mol/L, half of it.", why:"Weak acids ionize far less than half." },
              { t:"[H₃O⁺] = " + Ka + " = " + E("1.8", -5) + ".", why:Ka + " isn’t a concentration." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Is ethanoic acid strong?", "No; use " + Ka + ".", X + " = √(" + E("1.8", -6) + ") ≈ " + E("1.3", -3) + "."] },
          { id:"e2", goal:2, task:"Find [H₃O⁺] in 0.20 mol/L methanoic acid.",
            steps:[Ka + " = " + X2 + " ÷ (0.20 − " + X + ") = " + E("1.8", -4) + ".", "Assume 0.20 − " + X + " ≈ 0.20.", "So " + X + " = " + E("1.8", -4) + " × 0.20 = " + E("3.6", -5) + " mol/L."],
            answer:2,
            stepFb:["Step 1 is correct.", "Trying the shortcut is fine.", ""],
            fixes:[
              { t:"That’s " + X2 + "; " + X + " = √(" + E("3.6", -5) + ") = " + E("6.0", -3) + " mol/L, which is 3.0% (check passes).", ok:true, why:M2 },
              { t:X + " = " + E("1.8", -4) + " ÷ 0.20.", why:"Multiply, then take the root." },
              { t:X + " = 0.20.", why:M1 },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["What does the left side of step 1 have on top?", X2 + ".", "Root it: " + E("6.0", -3) + "."] },
          { id:"e3", goal:2, task:"Find the pH of 0.18 mol/L NH₃.",
            steps:["NH₃ + H₂O ⇌ NH₄⁺ + OH⁻; " + Kb + " = " + E("1.8", -5) + ".", X + " = [OH⁻] = √(" + E("1.8", -5) + " × 0.18) = " + E("1.8", -3) + ".", "pH = −log(" + E("1.8", -3) + ") = 2.74."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct (1.0%, check passes).", ""],
            fixes:[
              { t:"That’s the pOH; pH = 14.00 − 2.74 = 11.26.", ok:true, why:M4 },
              { t:"pH = 2.74 + 7 = 9.74.", why:"pH = 14.00 − pOH." },
              { t:"pH = −log(" + E("1.8", -5) + ") = 4.74.", why:"That’s −log " + Kb + "." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:[X + " here is [OH⁻] or [H₃O⁺]?", "[OH⁻], so −log gives pOH.", "pH = 11.26."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that diluting a weak acid raises its percent ionization (P2), or that HF fails the 5% check (P3)?" },
      { id:"j2", q:"In your own words, explain why the pH of a weak acid is higher than that of a strong acid at the same concentration." },
      { id:"j3", q:"Explain to a friend the steps from " + Ka + " and concentration to pH, including the check." },
      { id:"j4", q:"Which step do you most often skip (the root, the check, pOH → pH)? How will you remember it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is the " + Ka + " expression for HOCl(aq) + H₂O(l) ⇌ H₃O⁺(aq) + OCl⁻(aq)?", options:[
          { t:"[H₃O⁺][OCl⁻] ÷ [HOCl]", ok:true, why:"Water is left out." },
          { t:"[H₃O⁺][OCl⁻] ÷ ([HOCl][H₂O])", why:M8 },
          { t:"[HOCl] ÷ ([H₃O⁺][OCl⁻])", why:"Upside down: products go on top." },
          { t:"[H₃O⁺] ÷ [HOCl]", why:"Both products belong on top." }] },
        b:{ prompt:"Which is the " + Kb + " expression for NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)?", options:[
          { t:"[NH₄⁺][OH⁻] ÷ [NH₃]", ok:true, why:"Products on top, the base below; water is left out." },
          { t:"[NH₄⁺][OH⁻] ÷ ([NH₃][H₂O])", why:M8 },
          { t:"[NH₃] ÷ ([NH₄⁺][OH⁻])", why:"Upside down." },
          { t:"[H₃O⁺][NH₃] ÷ [NH₄⁺]", why:"That’s " + Ka + " for NH₄⁺." }] } },
      { id:"k2", cat:"K", goal:5,
        a:{ prompt:"HF has " + Ka + " = " + E("6.6", -4) + ". What is " + Kb + " for F⁻?", use:USE_F, options:[
          { t:E("1.5", -11), ok:true, why:Kw + " ÷ " + Ka + " = " + E("1.0", -14) + " ÷ " + E("6.6", -4) + "." },
          { t:E("6.6", -4), why:"Conjugates don’t share the same <i>K</i>." },
          { t:E("1.5", 3), why:"That’s 1 ÷ " + Ka + "; divide " + Kw + ", not 1. " + M5 },
          { t:E("6.6", -18), why:"That multiplies " + Ka + " by " + Kw + "." }] },
        b:{ prompt:"Ammonia has " + Kb + " = " + E("1.8", -5) + ". What is " + Ka + " for NH₄⁺?", use:USE_F, options:[
          { t:E("5.6", -10), ok:true, why:Kw + " ÷ " + Kb + "." },
          { t:E("1.8", -5), why:"Conjugates don’t share the same <i>K</i>." },
          { t:E("5.6", 4), why:"That’s 1 ÷ " + Kb + ". " + M5 },
          { t:E("1.8", -19), why:"That multiplies by " + Kw + "." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which 0.10 mol/L acid solution has the highest pH?", options:[
          { t:"Hypochlorous acid (" + Ka + " " + E("3.0", -8) + ")", ok:true, why:"Smallest " + Ka + ": least H₃O⁺." },
          { t:"Hydrofluoric acid (" + Ka + " " + E("6.6", -4) + ")", why:"Largest " + Ka + ": lowest pH. " + M6 },
          { t:"Methanoic acid (" + Ka + " " + E("1.8", -4) + ")", why:"A large " + Ka + " means more H₃O⁺ and a lower pH. " + M6 },
          { t:"Ethanoic acid (" + Ka + " " + E("1.8", -5) + ")", why:"Weaker than these two, but HOCl is weaker still." }] },
        b:{ prompt:"Which conjugate base is the strongest?", options:[
          { t:"OCl⁻", ok:true, why:"Its acid, HOCl, is the weakest." },
          { t:"F⁻", why:"HF is the strongest acid here, so F⁻ is the weakest base. " + M6 },
          { t:"HCOO⁻", why:"Methanoic acid is a fairly strong weak acid, so HCOO⁻ is a very weak base. " + M6 },
          { t:"CH₃COO⁻", why:"Stronger than F⁻ and HCOO⁻, but weaker than OCl⁻." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"What is the pH of 0.20 mol/L methanoic acid?", use:USE_F, options:[
          { t:"2.22", ok:true, why:X + " = √(" + E("1.8", -4) + " × 0.20) = " + E("6.0", -3) + " (3.0%, check passes); 3 − 0.78." },
          { t:"0.70", why:"That treats the acid as strong. " + M1 },
          { t:"4.44", why:X + " = " + E("3.6", -5) + " forgets the root. " + M2 },
          { t:"3.74", why:"That’s −log " + Ka + "." }] },
        b:{ prompt:"What is the pH of 0.12 mol/L hypochlorous acid?", use:USE_F, options:[
          { t:"4.22", ok:true, why:X + " = √(" + E("3.0", -8) + " × 0.12) = " + E("6.0", -5) + "; 5 − 0.78." },
          { t:"0.92", why:"That treats the acid as strong. " + M1 },
          { t:"8.44", why:"That forgets the root. " + M2 },
          { t:"7.52", why:"That’s −log " + Ka + "." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A 0.10 mol/L solution of model acid HX has pH 3.00. What is " + Ka + "?", options:[
          { t:E("1.0", -5), ok:true, why:X + " = " + E("1.0", -3) + "; " + Ka + " = (" + E("1.0", -3) + ")² ÷ 0.099." },
          { t:E("1.0", -3), why:"That’s " + X + "." },
          { t:E("1.0", -2), why:"That’s the fraction ionized." },
          { t:E("1.0", -6), why:"That’s " + X2 + " before dividing by [HX]." }] },
        b:{ prompt:"A 0.050 mol/L solution of model acid HY has pH 3.00. What is " + Ka + "?", options:[
          { t:E("2.0", -5), ok:true, why:"(" + E("1.0", -3) + ")² ÷ 0.049." },
          { t:E("1.0", -3), why:"That’s " + X + "." },
          { t:E("2.0", -2), why:"That’s the fraction ionized." },
          { t:E("1.0", -6), why:"That’s " + X2 + "." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"0.18 mol/L ethanoic acid is 1.0% ionized. It’s diluted 100 times. Its percent ionization becomes about…", options:[
          { t:"10%", ok:true, why:X + " = √(" + Ka + c + "), so " + X + " ÷ " + c + " = √(" + Ka + " ÷ " + c + "): 100 times smaller " + c + ", 10 times larger percentage (exactly 9.5%)." },
          { t:"0.010%", why:"Dilution raises percent ionization. " + M7 },
          { t:"1.0%", why:Ka + " is fixed; the percentage isn’t." },
          { t:"100%", why:"Weak acids never ionize completely." }] },
        b:{ prompt:"A model acid HZ (" + Ka + " " + E("2.0", -6) + ") is 1.0% ionized at 0.020 mol/L. At 0.00020 mol/L, its percent ionization becomes about…", options:[
          { t:"10%", ok:true, why:"√(" + E("2.0", -6) + " ÷ 0.00020) = √0.010 = 0.10." },
          { t:"0.10%", why:"Dilution raises percent ionization. " + M7 },
          { t:"1.0%", why:Ka + " is fixed; the percentage isn’t." },
          { t:"100%", why:"Weak acids never ionize completely." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which statement correctly justifies the shortcut for 0.18 mol/L ethanoic acid?", options:[
          { t:"“" + X + " = " + E("1.8", -3) + " is 1.0% of 0.18, under 5%, so 0.18 − " + X + " ≈ 0.18 is fine.”", ok:true, why:"The 5% check compares " + X + " with the concentration." },
          { t:"“" + Ka + " is below 10<sup>−3</sup>, so the shortcut always works.”", why:"The check, not a rule of thumb, decides. " + M3 },
          { t:"“" + X + " is smaller than " + Ka + ".”", why:"Compare " + X + " with the concentration." },
          { t:"“Shortcuts are always fine for acids.”", why:"HF at 0.10 mol/L fails. " + M3 }] },
        b:{ prompt:"For 0.10 mol/L HF (" + Ka + " " + E("6.6", -4) + "), the shortcut gives " + X + " ≈ " + E("8.1", -3) + ". Which statement is best?", options:[
          { t:"“" + E("8.1", -3) + " is 8.1% of 0.10, over 5%, so the full quadratic is needed.”", ok:true, why:"Over 5%: the shortcut isn’t allowed." },
          { t:"“The shortcut is fine because HF is weak.”", why:M3 },
          { t:"“The shortcut is fine because " + X + " < 0.10.”", why:"It must be under 5% of 0.10." },
          { t:"“HF is strong, so no ICE table is needed.”", why:"HF is a weak acid." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why Cl⁻, the conjugate base of HCl, is an extremely weak base?", options:[
          { t:"“" + Ka + " × " + Kb + " = " + Kw + ": HCl’s " + Ka + " is enormous, so Cl⁻’s " + Kb + " is negligible; Cl⁻ has essentially no tendency to take H⁺ from water.”", ok:true, why:"The stronger the acid, the weaker its conjugate base." },
          { t:"“A conjugate base always has the same strength as its acid.”", why:M6 },
          { t:"“Cl⁻ isn’t a base because it has no OH⁻.”", why:"Brønsted–Lowry bases needn’t contain OH⁻." },
          { t:"“Strong acids have no conjugate base.”", why:"Every acid has one: here, Cl⁻." }] },
        b:{ prompt:"Which is the best explanation of why OCl⁻ is a stronger base than F⁻?", options:[
          { t:"“HOCl is a much weaker acid than HF (" + Ka + " " + E("3.0", -8) + " vs " + E("6.6", -4) + "), so " + Kb + "(OCl⁻) = " + Kw + " ÷ " + Ka + " is much larger.”", ok:true, why:"The weaker the acid, the stronger its conjugate base." },
          { t:"“OCl⁻ has more atoms.”", why:"Size of the formula doesn’t decide." },
          { t:"“F⁻ is a strong base.”", why:"F⁻ is a very weak base. " + M6 },
          { t:"“Weak acids have weak conjugate bases.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:[6, 2],
        a:{ prompt:"A model household vinegar is 0.72 mol/L ethanoic acid. What is its pH?", use:USE_F, options:[
          { t:"2.44", ok:true, why:X + " = √(" + E("1.8", -5) + " × 0.72) = √(" + E("1.296", -5) + ") = " + E("3.6", -3) + " (0.5%, check passes); 3 − 0.56." },
          { t:"0.14", why:"That treats it as strong. " + M1 },
          { t:"4.89", why:"Take the square root. " + M2 },
          { t:"11.56", why:"That’s 14.00 − 2.44; vinegar is an acid." }] },
        b:{ prompt:"A model ammonia cleaner is 0.72 mol/L NH₃. What is its pH?", use:USE_F, options:[
          { t:"11.56", ok:true, why:"[OH⁻] = " + E("3.6", -3) + "; pOH 2.44; pH = 14.00 − 2.44." },
          { t:"2.44", why:"That’s the pOH. " + M4 },
          { t:"13.86", why:"That treats NH₃ as a strong base. " + M1 },
          { t:"9.11", why:"Take the square root first. " + M2 }] } },
      { id:"a2", cat:"A", goal:[3, 4],
        a:{ prompt:"A 0.10 mol/L solution of a newly made acid (model) is 4.0% ionized. What is " + Ka + " (using the shortcut, which the 5% check allows)?", options:[
          { t:E("1.6", -4), ok:true, why:X + " = 0.040 × 0.10 = " + E("4.0", -3) + "; " + Ka + " ≈ (" + E("4.0", -3) + ")² ÷ 0.10." },
          { t:E("4.0", -3), why:"That’s " + X + "." },
          { t:E("4.0", -2), why:"That’s the fraction ionized." },
          { t:E("1.6", -5), why:"That’s " + X2 + "; divide by 0.10." }] },
        b:{ prompt:"A 0.20 mol/L solution of a new acid (model) is 2.0% ionized. What is " + Ka + "?", options:[
          { t:E("8.0", -5), ok:true, why:X + " = " + E("4.0", -3) + "; (" + E("4.0", -3) + ")² ÷ 0.20." },
          { t:E("4.0", -3), why:"That’s " + X + "." },
          { t:E("2.0", -2), why:"That’s the fraction ionized." },
          { t:E("1.6", -5), why:"That’s " + X2 + "." }] } }
    ]
  },
  task:{
    title:"Hit the pH window", summary:"Hit the pH window",
    statement:"<p>A lab needs a weak acid solution that you could also check by hand. Choose an acid and a concentration that meet every condition. Can you find all the answers?</p><ol class=\"kab-conds\"><li>The pH is between 2.70 and 3.30.</li><li>The 5% check passes, so the shortcut can be used by hand.</li><li>The concentration is no more than 0.10 mol/L.</li></ol>",
    acids:[{ id:"meth", t:"methanoic" }, { id:"eth", t:"ethanoic" }, { id:"benz", t:"benzoic" }, { id:"hf", t:"hydrofluoric" }, { id:"hocl", t:"hypochlorous" }],
    concs:["0.0050", "0.020", "0.050", "0.080", "0.10", "0.18", "0.50"],
    checks:["pH 2.70–3.30", "Shortcut allowed", "No more than 0.10 mol/L"],
    tips:["pH too low: use a weaker acid or less of it. Too high: a stronger acid or more of it.",
      "The check fails when the solution is too dilute for the acid’s " + Ka + ". Use a weaker acid or a higher concentration.",
      "Stay at 0.10 mol/L or below."],
    explainPrompt:"Explain how you chose the acid and concentration, and why the 5% check matters here.",
    vocab:"Use the words " + Ka + ", concentration, percent ionization and approximation.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:5,
    after3:"Stronger acids reach this pH window only when dilute, and then they ionize too much for the shortcut. That’s why ethanoic acid fills most of the answers."
  },
  cards:[
    [Ka, "[H₃O⁺][A⁻] ÷ [HA]; larger " + Ka + " = stronger acid."],
    [Kb, "[BH⁺][OH⁻] ÷ [B]; larger " + Kb + " = stronger base."],
    ["Shortcut", X + " ≈ √(<i>K</i> × " + c + "), when " + c + " − " + X + " ≈ " + c + "."],
    ["5% check", X + " ÷ " + c + " × 100% < 5%; otherwise solve the quadratic."],
    ["pH from " + Ka, "ICE → " + X + " = [H₃O⁺] → pH = −log " + X + "."],
    ["pH from " + Kb, "ICE → " + X + " = [OH⁻] → pOH → pH = 14.00 − pOH."],
    [Ka + " from pH", X + " = 10<sup>−pH</sup>; " + Ka + " = " + X2 + " ÷ (" + c + " − " + X + ")."],
    ["Percent ionization", X + " ÷ " + c + " × 100%; rises on dilution."],
    [Ka + " × " + Kb, "= " + Kw + " = " + E("1.0", -14) + " for a conjugate pair."],
    ["Conjugate strength", "Stronger acid ↔ weaker conjugate base."],
    ["Weak vs strong at the same " + c, "The weak acid has the higher pH."],
    ["Weak ≠ safe", "HF is weak but very hazardous: strength and hazard are separate."]
  ]
};
