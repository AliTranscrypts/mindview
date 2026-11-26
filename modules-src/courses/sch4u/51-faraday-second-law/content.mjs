// SCH4U 51 Faraday's Second Law of Electrolysis. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/51-faraday-second-law.md
// Pictures (hero circuit and bars, the C10 series circuit with its mass bar chart, the Part 3 stations, the task preview)
// are drawn by app.js. Molar masses and F come from MV.chem.data in app.js; numbers below are the plan's problem data.

const Mz = "<i>M</i> ÷ <i>z</i>";
const NE = "<i>n</i>(e⁻)";
const USE = "<i>F</i> = 96 500 C/mol; Ag 108, Cu 63.5, Zn 65.4, Al 27.0 g/mol, plus any molar mass given in the question.";

// Misconception core sentences (plan §3)
const M1 = "Same charge, but each metal’s mass per mole of electrons is different: " + Mz + ".";
const M2 = "The moles of <strong>electrons</strong> are equal. Ag⁺ takes 1 e⁻ each and Cu²⁺ takes 2, so there are twice as many moles of Ag.";
const M3 = "Moles of metal = moles of e⁻ ÷ <i>z</i>: more electrons per ion means fewer atoms.";
const M4 = "Equivalent mass = " + Mz + ": the mass deposited by one mole of electrons.";
const M5 = "In water, H₂ forms instead (water −0.83 V beats −1.66 V and −2.71 V). Aluminium cells must be molten.";
const M6 = "The current changes every mass by the same factor, so the ratio stays put.";

// Practice 1: ion ↔ mass from 9650 C (plan Activity 1)
const PAIRS = [
  ["Ag⁺", "10.8 g", "0.100 mol e⁻ → 0.100 mol Ag; × 108 = 10.8 g."],
  ["Cu²⁺", "3.18 g", "0.100 mol e⁻ ÷ 2 = 0.0500 mol Cu; × 63.5 = 3.18 g."],
  ["Zn²⁺", "3.27 g", "0.100 mol e⁻ ÷ 2 = 0.0500 mol Zn; × 65.4 = 3.27 g."],
  ["Al³⁺ (molten)", "0.900 g", "0.100 mol e⁻ ÷ 3 = 0.0333 mol Al; × 27.0 = 0.900 g."],
  ["Mg²⁺ (molten)", "1.22 g", "0.100 mol e⁻ ÷ 2 = 0.0500 mol Mg; × 24.3 = 1.22 g."],
  ["Na⁺ (molten)", "2.30 g", "0.100 mol e⁻ → 0.100 mol Na; × 23.0 = 2.30 g."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"51-faraday-second-law",
  kind:"topic",
  title:"Faraday’s second law of electrolysis",
  topic:"Faraday’s Second Law of Electrolysis",
  readyTopic:"Faraday’s second law",
  hero:{
    eq:"`m_1 : m_2 = (M_1 ÷ z_1) : (M_2 ÷ z_2)`, for the same charge", eqSize:"md",
    eqLabel:"m 1 to m 2 equals M 1 divided by z 1, to M 2 divided by z 2, for the same charge",
    headline:"Same electrons, different metals",
    text:"Connect cells <strong>in series</strong> and the same electrons flow through every one. Each cell then gets the same <strong>moles of electrons</strong>, but each metal turns them into a different mass. The mass per mole of electrons, " + Mz + ", is the metal’s <strong>equivalent mass</strong>.",
    fig:{ html:'<div class="fz-hx"><svg class="fz-hx-svg" id="fz-hx-svg" viewBox="0 0 480 420" role="img" aria-label="Three cells in a row joined by wires in series: silver nitrate solution, copper sulfate solution and a crucible of molten aluminium salt. One stream of violet electrons runs through all three; an electrons-passed counter reads 0.100 mol in each. Coats grow on the three cathodes: silver 10.8 g, copper 3.18 g, aluminium 0.900 g, shown as bars in the ratio 12 : 3.5 : 1."></svg><div class="fz-hx-row"><p class="fz-hx-ctr" id="fz-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="fz-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can state Faraday’s second law and calculate equivalent masses (" + Mz + ").",
    "I can explain why cells in series carry the same charge and the same moles of electrons.",
    "I can use one cell’s mass to find the mass produced in another cell in series.",
    "I can find the charge on a metal ion from mass and charge data.",
    "I can apply the second law to coulom&#101;ters and industrial production."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"The Faraday chain", goal:3,
          prompt:"How many moles of electrons pass when 9650 C flows?",
          options:[
            { t:"0.100 mol", ok:true, why:"9650 ÷ 96 500." },
            { t:"1.00 mol", why:"1.00 mol would be 96 500 C." },
            { t:"10.0 mol", why:"Divided the wrong way: " + NE + " = <i>Q</i> ÷ <i>F</i>." },
            { t:"0.0500 mol", why:"There’s no ion yet: this is just electrons." }],
          hints:[NE + " = <i>Q</i> ÷ <i>F</i>.", "9650 ÷ 96 500.", "0.100 mol."] },
        { id:"w2", skill:"The Faraday chain", goal:3,
          prompt:"0.100 mol of electrons pass through CuSO₄(aq). Mass of copper (Cu 63.5)?",
          options:[
            { t:"3.18 g", ok:true, why:"0.0500 mol Cu × 63.5." },
            { t:"6.35 g", why:"Each Cu²⁺ takes 2 e⁻. " + M3 },
            { t:"12.7 g", why:"Multiplied by 2. " + M3 },
            { t:"0.635 g", why:"Check the power of ten: 0.0500 × 63.5 = 3.18." }],
          hints:["Moles of Cu = moles of e⁻ ÷ 2.", "0.0500 mol.", "0.0500 × 63.5 = 3.18 g."] },
        { id:"w3", skill:"Ion charges", goal:1,
          prompt:"How many electrons does one Al³⁺ ion gain to form Al?",
          options:[
            { t:"3", ok:true, why:"Al³⁺ + 3e⁻ → Al." },
            { t:"1", why:"One ion, but its charge is 3+." },
            { t:"6", why:"Doubled." },
            { t:"2", why:"Aluminium is 3+." }],
          hints:["Match the charge.", "3+.", "3 electrons."] },
        { id:"w4", skill:"Ion charges", goal:4,
          prompt:"Iron forms Fe²⁺ and Fe³⁺. Which needs more electrons per atom to plate out?",
          options:[
            { t:"Fe³⁺", ok:true, why:"3 e⁻ vs 2 e⁻." },
            { t:"Fe²⁺", why:"2 is fewer than 3." },
            { t:"Both need 2", why:"Fe³⁺ needs 3." },
            { t:"Both need 3", why:"Fe²⁺ needs 2." }],
          hints:["Electrons = ion charge.", "Compare 2 and 3.", "Fe³⁺."] },
        { id:"w5", skill:"Equivalent mass and ratios", goal:1,
          prompt:"What mass of copper does 1 mol of electrons deposit (Cu 63.5)?",
          options:[
            { t:"31.8 g", ok:true, why:"63.5 ÷ 2: half a mole of Cu." },
            { t:"63.5 g", why:"1 mol e⁻ makes only 0.5 mol Cu." },
            { t:"127 g", why:"That’s <i>M</i> × <i>z</i>. " + M4 },
            { t:"0.0315 g", why:"That’s <i>z</i> ÷ <i>M</i>. " + M4 }],
          hints:["Cu²⁺ + 2e⁻ → Cu.", "1 mol e⁻ → 0.5 mol Cu.", "0.5 × 63.5 = 31.8 g."] },
        { id:"w6", skill:"Equivalent mass and ratios", goal:3,
          prompt:"If <i>a</i> : <i>b</i> = 3 : 1 and <i>b</i> = 0.40 g, what is <i>a</i>?",
          options:[
            { t:"1.2 g", ok:true, why:"3 × 0.40." },
            { t:"0.13 g", why:"Divided by 3." },
            { t:"3.4 g", why:"Added." },
            { t:"0.40 g", why:"Ignored the ratio." }],
          hints:["<i>a</i> is 3 times <i>b</i>.", "3 × 0.40.", "1.2 g."] }
      ],
      refreshers:{
        "The Faraday chain":"<i>Q</i> = <i>It</i> → " + NE + " = <i>Q</i> ÷ <i>F</i> → <i>n</i>(metal) = " + NE + " ÷ <i>z</i> → <i>m</i> = <i>nM</i>.",
        "Ion charges":"Electrons needed per atom = the ion’s charge: Ag⁺ 1, Cu²⁺ 2, Al³⁺ 3.",
        "Equivalent mass and ratios":Mz + " is the mass made by 1 mol of electrons. Ratios scale: if one cell makes 3 × as much, multiply."
      }
    }
  },
  explore:{
    heading:"Cells in series",
    intro:"Choose up to three cells and wire them in series. Set the current and time, then compare what each cell makes.",
    how:"Tick two or three cells, then set the current and the time. Press <strong>Run</strong> to watch the electrons flow and the coats grow. The readout and the bars update as you go.",
    modes:[{ id:"lab", t:"Series lab" }, { id:"mys", t:"Mystery ion" }, { id:"ratio", t:"Ratio view" }],
    // Mystery mode: metal X (M from the course table, Ni 58.7 g/mol); the measured masses use this charge.
    mystery:{ answer:2 },
    modelNote:"Model: 100% efficiency; module molar masses. The molten aluminium cell is drawn as a high-temperature crucible (schematic only).",
    mysNote:"The silver cell is the charge m&#101;ter (a <strong>coulom&#101;ter</strong>): grams of silver ÷ 108 = moles of electrons. Set X’s charge so the predicted mass matches the measured mass.",
    ratioNote:"Masses are hidden. Set each cell’s bar to the ratio you predict (lightest = 1), then press <strong>Reveal</strong>.",
    predictions:[
      { id:"p1", prompt:"Ag⁺ and Cu²⁺ in series, 1.00 A, 9650 s. Which cathode gains more mass?",
        options:[{ t:"Silver", ok:true }, { t:"Copper" }, { t:"Equal masses" }, { t:"Neither gains mass" }],
        explain:"Same 0.100 mol e⁻. Silver makes 0.100 mol (10.8 g); copper only 0.0500 mol (3.18 g).",
        start:{ cells:["ag", "cu"], I:1.00, t:9650 } },
      { id:"p2", prompt:"Same run. Which cell makes more <strong>moles</strong> of metal?",
        options:[{ t:"Silver, twice as many", ok:true }, { t:"Copper, twice as many" }, { t:"Equal moles" }, { t:"Silver, four times as many" }],
        explain:"Ag⁺ takes 1 e⁻, Cu²⁺ takes 2.",
        start:{ cells:["ag", "cu"], I:1.00, t:9650 } },
      { id:"p3", prompt:"The copper cell has gained 0.635 g. What has the silver cell gained?",
        options:[{ t:"2.16 g", ok:true }, { t:"0.635 g" }, { t:"1.08 g" }, { t:"4.32 g" }],
        explain:"0.0100 mol Cu → 0.0200 mol e⁻ → 0.0200 mol Ag → 2.16 g.",
        start:{ cells:["ag", "cu"], I:1.00, t:1930 } },
      { id:"p4", prompt:"Double the current. What happens to the ratio of silver mass to copper mass?",
        options:[{ t:"It stays the same", ok:true }, { t:"It doubles" }, { t:"It halves" }, { t:"It reverses" }],
        explain:"Every mass scales with the charge.",
        start:{ cells:["ag", "cu"], I:1.00, t:9650 } }
    ],
    chalIntro:"Use the cells to meet each goal, then press <strong>Check challenge</strong>. Challenges 1 and 2 use <strong>Series lab</strong>; challenge 3 uses <strong>Mystery ion</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Make the silver cell gain exactly 2.16 g. Then read what the copper cell gained.",
        why:"1930 C is 0.0200 mol e⁻: 0.0200 mol Ag (2.16 g) and, in a copper cell, 0.0100 mol Cu (0.635 g).",
        general:"The silver cell needs 2.16 g. Set the current and the time.",
        hints:["2.16 ÷ 108 = 0.0200 mol Ag = 0.0200 mol e⁻.", "0.0200 × 96 500 = 1930 C.", "Any <i>I</i> and <i>t</i> with <i>It</i> = 1930."] },
      { id:"tc2", goal:[2, 3], prompt:"Deposit exactly 0.900 g of aluminium in the molten cell.",
        why:"0.900 g is 0.0333 mol Al; each Al takes 3 e⁻, so 0.100 mol e⁻ = 9650 C.",
        general:"The molten aluminium cell needs 0.900 g.",
        hints:["0.900 ÷ 27.0 = 0.0333 mol Al.", "× 3 = 0.100 mol e⁻ = 9650 C.", "For example, 1.00 A for 9650 s."] },
      { id:"tc3", goal:[4], stretch:true, prompt:"Mystery mode: metal X has <i>M</i> = 58.7 g/mol. In series with silver, the silver cell gained 2.16 g and cell X gained 0.587 g. Set X’s charge chip.",
        why:"0.0200 mol e⁻ ÷ 0.0100 mol X = 2 electrons per ion: X²⁺.",
        general:"Set X’s charge chip in Mystery ion mode.",
        hints:["Moles of e⁻ from the silver: 2.16 ÷ 108 = 0.0200 mol.", "Moles of X: 0.587 ÷ 58.7 = 0.0100 mol.", "0.0200 mol e⁻ ÷ 0.0100 mol X = 2 electrons per ion: X²⁺."] }
    ]
  },
  part3:{
    slug:"ion-charge", name:"Ion charge", heading:"Find the charge on the ion",
    intro:"Run the second law backwards. A silver cell in series measures the charge; the mass of another metal then tells you its ion’s charge: <i>z</i> = " + NE + " ÷ <i>n</i>(metal).",
    s1:{ title:"Station 1: The silver coulom&#101;ter",
      // VERIFY: the historical "international ampere" note (silver deposition rate used to define a unit of current, early 1900s; plan §6 risk 3).
      html:"<p>A silver cell in series measures charge: grams of silver ÷ 108 = moles of electrons. A cell used this way is a <strong>coulom&#101;ter</strong>.</p><p>Historically, the rate at which current deposits silver was used to define a unit of current, the “international ampere” (early 1900s).</p>",
      reading:3.24,
      answer:[0.0300, 2895],
      right:"3.24 ÷ 108 = 0.0300 mol e⁻; 0.0300 × 96 500 = 2895 C." },
    s2:{ title:"Station 2: Two oxidation states",
      html:"<p>Two copper compounds are each electrolyzed with 0.100 mol of electrons. One gives 6.35 g of Cu; the other gives 3.18 g. Which contains Cu⁺ and which Cu²⁺?</p>",
      items:[{ id:"c1", t:"Compound 1: 6.35 g of Cu", answer:"1" }, { id:"c2", t:"Compound 2: 3.18 g of Cu", answer:"2" }],
      right:"6.35 g means 1 e⁻ per atom, so Cu⁺; 3.18 g means Cu²⁺." },
    s3:{ title:"Station 3: A data table",
      intro:"Three mystery metals (molar masses given) were each run in series with a silver cell. Fill in " + NE + ", <i>n</i>(X) and <i>z</i> for each run.",
      runs:[
        { id:"r1", ag:1.08, M:65.4, x:0.327, answer:[0.0100, 0.00500, 2] },
        { id:"r2", ag:3.24, M:27.0, molten:true, x:0.270, answer:[0.0300, 0.0100, 3] },
        { id:"r3", ag:4.32, M:119, x:1.19, answer:[0.0400, 0.0100, 4] }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Find the charge quick check",
      items:[
        { id:"q1", goal:5, prompt:"A silver coulom&#101;ter gains 1.08 g. Moles of electrons?",
          choices:[
            { t:"0.0100", ok:true, fb:"Right. 1.08 ÷ 108 = 0.0100 mol." },
            { t:"0.100", fb:"1.08 ÷ 108." },
            { t:"1.08", fb:"1.08 ÷ 108." },
            { t:"0.00500", fb:"1.08 ÷ 108." }] },
        { id:"q2", goal:4, prompt:"0.0200 mol e⁻ deposits 0.0100 mol of metal Y. Charge on Y’s ion?",
          choices:[
            { t:"+2", ok:true, fb:"Right. Electrons ÷ atoms = 2." },
            { t:"+1", fb:"Electrons ÷ atoms = 2. " + M3 },
            { t:"+3", fb:"Electrons ÷ atoms = 2. " + M3 },
            { t:"+4", fb:"Electrons ÷ atoms = 2. " + M3 }] },
        { id:"q3", goal:4, prompt:"Same charge: which deposits more moles, Cu⁺ or Cu²⁺?",
          choices:[
            { t:"Cu⁺", ok:true, fb:"Right. 1 e⁻ per atom gives more atoms." },
            { t:"Cu²⁺", fb:"1 e⁻ per atom gives more atoms." },
            { t:"Equal", fb:"1 e⁻ per atom gives more atoms." },
            { t:"Neither", fb:"1 e⁻ per atom gives more atoms." }] },
        { id:"q4", goal:5, prompt:"Why is silver a good coulom&#101;ter metal?",
          choices:[
            { t:"One electron per ion and a large <i>M</i>, so the mass is easy to measure", ok:true, fb:"Right. Big, simple, measurable mass per electron." },
            { t:"It’s the cheapest metal", fb:"Big, simple, measurable mass per electron." },
            { t:"It never needs electrons", fb:"Big, simple, measurable mass per electron." },
            { t:"Its ions are 3+", fb:"Big, simple, measurable mass per electron." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Ion ↔ mass from 9650 C", summary:"Ion ↔ mass", goal:1,
        instruction:"Match each ion to the mass that 9650 C (0.100 mol e⁻) deposits.",
        leftTitle:"Ion", rightTitle:"Mass deposited by 9650 C (0.100 mol e⁻)",
        left:PAIRS.map((p, i) => {
          const o = { id:"l" + (i + 1), t:p[0], why:p[2] };
          if (i === 3) o.hints = ["Al takes 3 e⁻.", "0.100 ÷ 3 = 0.0333 mol.", "× 27.0 = 0.900 g."];
          return o;
        }),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        wrong:{ "l2|r3":"That’s zinc: 65.4 ÷ 2 × 0.100.", "l4|r6":"Divide 27.0 by 3. " + M4 },
        wrongDefault:"Mass = 0.100 × " + Mz + "." },
      { id:"calc", type:"numeric", title:"Series calculations", summary:"Series calculations", star:true, goal:[3, 4],
        instruction:"Six series problems. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number, then press Check. Answers within 1% are accepted. For the charge on an ion, type a number such as 2.",
        items:[
          { id:"s1", goal:3, prompt:"Ag and Cu cells in series. The Ag cathode gained 5.40 g. Mass gained by the Cu cathode?", answer:1.59, tol:0.01, unit:"g", display:"1.59 g",
            why:"5.40 ÷ 108 = 0.0500 mol e⁻ → 0.0250 mol Cu → 1.59 g.",
            wrong:[{ match:3.18, fb:"0.0500 mol e⁻ → 0.0250 mol Cu. " + M3 }],
            general:"Find the moles of electrons from the silver, then divide by 2 for copper.",
            hints:["Silver gives the electrons: 5.40 ÷ 108 = 0.0500 mol.", "0.0500 mol e⁻ ÷ 2 = 0.0250 mol Cu.", "0.0250 × 63.5 = 1.59 g."] },
          { id:"s2", goal:3, prompt:"Cu and molten-Al cells in series. The Cu cathode gained 1.27 g. Mass of Al?", answer:0.360, tol:0.0036, unit:"g", display:"0.360 g",
            why:"1.27 ÷ 63.5 = 0.0200 mol Cu → 0.0400 mol e⁻ → 0.0133 mol Al → 0.360 g.",
            wrong:[{ match:0.540, fb:"0.0400 mol e⁻ ÷ 3 = 0.0133 mol Al." }],
            general:"Use the copper to find the electrons, then divide by 3 for aluminium.",
            hints:["Copper gives the electrons.", "0.0400 mol e⁻.", "÷ 3 × 27.0 = 0.360 g."] },
          { id:"s3", goal:3, prompt:"A Zn cell gained 0.654 g. How much charge passed?", answer:1930, tol:0.01, unit:"C", display:"1930 C",
            why:"0.654 ÷ 65.4 = 0.0100 mol Zn → 0.0200 mol e⁻ → 1930 C.",
            wrong:[{ match:965, fb:"0.0100 mol Zn needs 0.0200 mol e⁻." }],
            general:"Moles of Zn × 2 = moles of e⁻; then × 96 500.",
            hints:["0.654 ÷ 65.4 = 0.0100 mol Zn.", "Each Zn²⁺ takes 2 e⁻: 0.0200 mol e⁻.", "0.0200 × 96 500 = 1930 C."] },
          { id:"s4", goal:3, star:true, prompt:"Ag and molten-Al cells in series: mass of Ag ÷ mass of Al?", answer:12, tol:0.01, display:"12",
            why:"Equivalent masses: 108 ÷ 9.00 = 12.",
            wrong:[{ match:4, fb:"Equivalent masses: 108 ÷ 9.00 = 12. " + M4 }],
            general:"For the same charge, compare the equivalent masses, " + Mz + ".",
            hints:["Same charge: compare equivalent masses.", "Ag: 108 ÷ 1 = 108. Al: 27.0 ÷ 3 = 9.00.", "108 ÷ 9.00 = 12."] },
          { id:"s5", goal:4, star:true, prompt:"Metal X (<i>M</i> = 55.8) gained 0.744 g while a silver cell in series gained 4.32 g. Charge on X’s ion?", answer:3, tol:0.01, display:"+3",
            why:"<i>n</i>(e⁻) = 0.0400; <i>n</i>(X) = 0.0133; 0.0400 ÷ 0.0133 = 3.",
            wrong:[{ match:2, fb:"<i>n</i>(e⁻) = 0.0400; <i>n</i>(X) = 0.0133; 0.0400 ÷ 0.0133 = 3." }],
            general:"<i>z</i> = moles of e⁻ ÷ moles of X.",
            hints:["Silver gives the electrons: 4.32 ÷ 108 = 0.0400 mol.", "Moles of X: 0.744 ÷ 55.8 = 0.0133 mol.", "0.0400 ÷ 0.0133 = 3: X³⁺."] },
          { id:"s6", goal:4, star:true, prompt:"A Cu cell gained 1.27 g. Metal X (<i>M</i> = 119) in series gained 1.19 g. Charge on X’s ion?", answer:4, tol:0.01, display:"+4",
            why:"0.0400 mol e⁻ from the copper; 0.0100 mol X; 4 e⁻ each.",
            wrong:[{ match:2, fb:"<i>n</i>(e⁻) = 0.0400 from the copper; <i>n</i>(X) = 0.0100." }],
            general:"<i>z</i> = moles of e⁻ ÷ moles of X.",
            hints:["Use the copper to find the electrons.", "1.27 ÷ 63.5 = 0.0200 mol Cu → 0.0400 mol e⁻.", "1.19 ÷ 119 = 0.0100 mol X → 4 e⁻ each."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Pilar", goal:[2, 3],
        instruction:"Pilar made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Ag and Cu cells in series. The Ag cathode gained 2.16 g. Find the mass gained by the Cu cathode.",
            steps:["<i>n</i>(Ag) = 2.16 ÷ 108 = 0.0200 mol.", "Ag⁺ + e⁻ → Ag, so <i>n</i>(e⁻) = 0.0200 mol in each cell.", "Cu²⁺ + 2e⁻ → Cu, so <i>n</i>(Cu) = 0.0200 × 2 = 0.0400 mol.", "<i>m</i>(Cu) = 0.0400 × 63.5 = 2.54 g."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"<i>n</i>(Cu) = 0.0200 ÷ 2 = 0.0100 mol, so <i>m</i> = 0.635 g.", ok:true, why:"Each Cu²⁺ takes 2 e⁻, so divide: fewer Cu atoms." },
              { t:"<i>n</i>(Cu) = 0.0200 mol, so <i>m</i> = 1.27 g.", why:"Equal moles of metal is wrong too. " + M2 },
              { t:"<i>m</i>(Cu) = 2.16 g, the same as silver.", why:M1 },
              { t:"Step 3 is correct.", why:"Each Cu needs 2 electrons, so there are <strong>fewer</strong> Cu atoms. " + M3 }],
            hints:["More electrons per ion means more or fewer atoms?", "Fewer: divide.", "0.0100 mol, 0.635 g."] },
          { id:"e2", goal:2, task:"Explain what is the same in three cells (Ag⁺, Cu²⁺, molten Al³⁺) wired in series.",
            steps:["In series, there’s only one path for the electrons.", "So the same charge passes through each cell.", "So each cell deposits the same number of moles of metal.", "So the heaviest metal, silver, gains the most mass."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "The conclusion is right for the wrong reason; the mistake is earlier."],
            fixes:[
              { t:"So each cell receives the same moles of <strong>electrons</strong>; the moles of metal are <i>n</i>(e⁻) ÷ <i>z</i>, which differ.", ok:true, why:"Equal electrons, not equal atoms." },
              { t:"So each cell deposits the same mass.", why:M1 },
              { t:"So each cell has the same voltage.", why:"Voltages can differ; charge can’t." },
              { t:"Step 3 is correct.", why:"Ag⁺ takes 1 e⁻, Cu²⁺ 2, Al³⁺ 3. " + M2 }],
            hints:["What exactly passes through every cell?", "Electrons.", "Equal electrons, not equal atoms."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that the moles of metal differ, or that the mass ratio didn’t change with current? Why?" },
      { id:"j2", q:"In your own words, state Faraday’s second law and explain where <i>M</i> ÷ <i>z</i> comes from." },
      { id:"j3", q:"Explain to a friend how a silver cell can be used to find the charge on another metal’s ion." },
      { id:"j4", q:"Which step in series problems still trips you up? What will you do differently?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Faraday’s second law says that, for the same charge, the masses of different substances produced are proportional to…", options:[
          { t:"their equivalent masses, " + Mz, ok:true, why:"For the same charge, mass ∝ " + Mz + "." },
          { t:"their molar masses only", why:"The ion charge matters too." },
          { t:"their ion charges only", why:"The molar mass matters too." },
          { t:"the voltage across each cell", why:"Voltage isn’t in the law." }] },
        b:{ prompt:"What is the equivalent mass of a metal?", options:[
          { t:"The mass deposited by 1 mol of electrons, " + Mz, ok:true, why:M4 },
          { t:"The mass of 1 mol of the metal, <i>M</i>", why:M2 },
          { t:"<i>M</i> × <i>z</i>", why:M4 },
          { t:"The mass deposited by 1 A", why:"It’s per mole of electrons, not per amp." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Cells connected in series all have the same…", options:[
          { t:"charge (moles of electrons) passing through them", ok:true, why:"One path: every electron passes through every cell." },
          { t:"mass of metal deposited", why:M1 },
          { t:"moles of metal deposited", why:M2 },
          { t:"voltage", why:"Voltages can differ." }] },
        b:{ prompt:"Ag⁺ and Cu²⁺ cells are in series. Which statement is true?", options:[
          { t:"The moles of electrons are equal; the silver cell makes twice the moles of metal", ok:true, why:"Ag⁺ takes 1 e⁻ and Cu²⁺ takes 2." },
          { t:"The masses are equal", why:M1 },
          { t:"The moles of metal are equal", why:M2 },
          { t:"The copper cell makes twice the moles of metal", why:"Reversed: Cu²⁺ takes 2 e⁻." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Equivalent mass of aluminium from Al³⁺ (Al 27.0)?", use:USE, options:[
          { t:"9.00 g/mol e⁻", ok:true, why:"27.0 ÷ 3." },
          { t:"81.0 g/mol e⁻", why:"Multiplied by 3. " + M4 },
          { t:"27.0 g/mol e⁻", why:"Forgot the 3 electrons." },
          { t:"13.5 g/mol e⁻", why:"Divided by 2." }] },
        b:{ prompt:"Equivalent mass of zinc from Zn²⁺ (Zn 65.4)?", use:USE, options:[
          { t:"32.7 g/mol e⁻", ok:true, why:"65.4 ÷ 2." },
          { t:"131 g/mol e⁻", why:M4 },
          { t:"65.4 g/mol e⁻", why:"Forgot the 2 electrons." },
          { t:"21.8 g/mol e⁻", why:"Divided by 3." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Ag and Cu cells are in series. The silver cathode gained 1.08 g. What did the copper cathode gain?", use:USE, options:[
          { t:"0.318 g", ok:true, why:"0.0100 mol e⁻ → 0.00500 mol Cu → 0.318 g." },
          { t:"0.635 g", why:"Equal moles of metal. " + M2 },
          { t:"1.08 g", why:"Equal masses. " + M1 },
          { t:"0.159 g", why:"Divided by 4." }] },
        b:{ prompt:"Cu and Ag cells are in series. The copper cathode gained 0.635 g. What did the silver cathode gain?", use:USE, options:[
          { t:"2.16 g", ok:true, why:"0.0100 mol Cu → 0.0200 mol e⁻ → 0.0200 mol Ag." },
          { t:"1.08 g", why:M2 },
          { t:"0.635 g", why:M1 },
          { t:"4.32 g", why:"Doubled twice. " + M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Metal X (<i>M</i> = 52.0) gained 0.520 g while a silver cell in series gained 3.24 g. What is the charge on X’s ion?", use:USE, options:[
          { t:"+3", ok:true, why:"<i>n</i>(e⁻) = 0.0300; <i>n</i>(X) = 0.0100; 3 electrons each." },
          { t:"+1", why:"That would need 0.0100 mol e⁻." },
          { t:"+2", why:"That would give 0.780 g." },
          { t:"+6", why:"Check: 0.0300 ÷ 0.0100 = 3." }] },
        b:{ prompt:"Metal X (<i>M</i> = 58.7) gained 1.17 g while a silver cell in series gained 4.32 g. What is the charge on X’s ion?", use:USE, options:[
          { t:"+2", ok:true, why:"<i>n</i>(e⁻) = 0.0400; <i>n</i>(X) ≈ 0.0200." },
          { t:"+1", why:"That would give 2.35 g." },
          { t:"+4", why:"That would give 0.587 g." },
          { t:"+3", why:"That would give 0.783 g." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"AgNO₃(aq), CuSO₄(aq) and Al₂(SO₄)₃(aq) cells are wired in series. The silver cell gained 1.08 g. What forms at the cathode of the third cell?", use:USE, options:[
          { t:"Hydrogen gas, with no aluminium", ok:true, why:"Water (−0.83 V) is reduced before Al³⁺ (−1.66 V)." },
          { t:"0.0900 g of aluminium", why:M5 },
          { t:"0.270 g of aluminium", why:"Also forgets ÷ 3. " + M5 },
          { t:"Nothing, because the circuit stops", why:"Current still flows; water is reduced." }] },
        b:{ prompt:"AgNO₃(aq), CuSO₄(aq) and NaCl(aq) cells are wired in series. What forms at the cathode of the NaCl(aq) cell?", options:[
          { t:"Hydrogen gas", ok:true, why:"Water is reduced before Na⁺ (−2.71 V)." },
          { t:"Sodium metal", why:M5 },
          { t:"Chlorine gas", why:"Chlorine forms at an anode." },
          { t:"Nothing", why:"Water is reduced." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why a silver cell gains more mass than a copper cell in series?", options:[
          { t:"“Both get the same moles of electrons. Each Ag⁺ needs 1 electron and each Cu²⁺ needs 2, so there are twice as many silver atoms, and each is heavier.”", ok:true, why:"Equal electrons; more silver atoms, each heavier." },
          { t:"“Silver ions move faster through the solution.”", why:"Speed isn’t the reason." },
          { t:"“More current flows through the silver cell.”", why:"In series, the current is the same." },
          { t:"“Silver has a higher reduction potential, so more of it plates.”", why:"<i>E</i>° decides what plates, not how much." }] },
        b:{ prompt:"Which is the best explanation of why doubling the current doesn’t change the ratio of masses in two cells in series?", options:[
          { t:"“Doubling the current doubles the moles of electrons in both cells, so both masses double and their ratio is unchanged.”", ok:true, why:M6 },
          { t:"“The current only affects the first cell.”", why:"Series: same current everywhere." },
          { t:"“The masses don’t change with current.”", why:"They both double." },
          { t:"“The ratio depends only on voltage.”", why:"Voltage isn’t in the law." }] } },
      { id:"c2", cat:"C", goal:[1, 4],
        a:{ prompt:"Which expression gives the charge <i>z</i> on a metal ion from the data?", options:[
          { t:"<i>z</i> = <i>M</i> × <i>n</i>(e⁻) ÷ <i>m</i>", ok:true, why:"Moles of e⁻ ÷ moles of metal, where moles of metal = <i>m</i> ÷ <i>M</i>." },
          { t:"<i>z</i> = <i>m</i> × <i>n</i>(e⁻) ÷ <i>M</i>", why:"Upside down." },
          { t:"<i>z</i> = <i>M</i> ÷ <i>m</i>", why:"Missing the electrons." },
          { t:"<i>z</i> = <i>n</i>(e⁻) × <i>F</i>", why:"That’s the charge in coulombs." }] },
        b:{ prompt:"For two cells in series, which relationship is correct?", options:[
          { t:"<i>m</i>₁ ÷ <i>m</i>₂ = (<i>M</i>₁ ÷ <i>z</i>₁) ÷ (<i>M</i>₂ ÷ <i>z</i>₂)", ok:true, why:"Same charge: masses in the ratio of the equivalent masses." },
          { t:"<i>m</i>₁ ÷ <i>m</i>₂ = <i>M</i>₁ ÷ <i>M</i>₂", why:"Ignores the charges." },
          { t:"<i>m</i>₁ ÷ <i>m</i>₂ = (<i>M</i>₁ × <i>z</i>₁) ÷ (<i>M</i>₂ × <i>z</i>₂)", why:M4 },
          { t:"<i>m</i>₁ = <i>m</i>₂", why:M1 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A silver coulom&#101;ter gained 0.540 g in 965 s. What was the average current?", use:USE, options:[
          { t:"0.500 A", ok:true, why:"0.00500 mol e⁻ → 482.5 C → ÷ 965 s." },
          { t:"1.00 A", why:"That would deposit 1.08 g." },
          { t:"0.250 A", why:"Halved again." },
          { t:"0.540 A", why:"Treated grams as amps." }] },
        b:{ prompt:"A silver coulom&#101;ter gained 2.16 g in 1930 s. What was the average current?", use:USE, options:[
          { t:"1.00 A", ok:true, why:"0.0200 mol e⁻ → 1930 C → ÷ 1930 s." },
          { t:"2.00 A", why:"That would deposit 4.32 g." },
          { t:"0.500 A", why:"That would deposit 1.08 g." },
          { t:"2.16 A", why:"Treated grams as amps." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A copper refinery and an aluminium smelter (molten Al³⁺) pass the same total charge. The refinery deposits 63.5 kg of copper. How much aluminium does the smelter make?", use:USE, options:[
          { t:"18.0 kg", ok:true, why:"1000 mol Cu → 2000 mol e⁻ → 667 mol Al → 18.0 kg." },
          { t:"27.0 kg", why:"Equal moles of metal. " + M2 },
          { t:"63.5 kg", why:"Equal masses. " + M1 },
          { t:"40.5 kg", why:"Multiplied by 3/2 instead of 2/3." }] },
        b:{ prompt:"A silver plant and a copper plant pass the same charge. The silver plant deposits 108 kg of silver. How much copper does the copper plant deposit?", use:USE, options:[
          { t:"31.8 kg", ok:true, why:"1000 mol Ag → 1000 mol e⁻ → 500 mol Cu." },
          { t:"63.5 kg", why:M2 },
          { t:"108 kg", why:M1 },
          { t:"15.9 kg", why:"Divided by 4." }] } }
    ]
  },
  task:{
    title:"Series designer", summary:"Series designer",
    statement:"<p>Choose three different cells to wire in series, and a charge, so that every condition is met. Can you find all the designs?</p><ol class=\"fz-conds\"><li>Every cell deposits a metal.</li><li>The heaviest deposit is exactly 12 times the lightest.</li><li>The total charge is at most 6000 C.</li><li>The aluminium cell, if used, gains at least 0.300 g.</li></ol>",
    checks:["Metal in every cell", "Heaviest = 12 × lightest", "Charge ≤ 6000 C", "Aluminium ≥ 0.300 g"],
    tips:["Al³⁺ and Na⁺ in water give H₂, not metal.", "Which two equivalent masses are in a 12 : 1 ratio? 108 ÷ 9.00.", "Charges above 6000 C are out.", "0.300 g of Al needs 0.0333 mol e⁻: at least 3217 C."],
    charges:[965, 1930, 3860, 5790, 9650],
    explainPrompt:"Explain why your design gives a 12 : 1 ratio and how you chose the charge.",
    vocab:"Use the words series, moles of electrons, equivalent mass and molten.",
    more:"There’s more than one design. Can you find them all?",
    afterAt:4,
    after3:"The 12 : 1 ratio comes only from silver and aluminium: 108 ÷ 9.00. The third cell just goes along for the ride, because copper and zinc sit between them."
  },
  cards:[
    ["Cells in series", "One path for electrons: every cell gets the same charge and the same moles of e⁻."],
    ["Faraday’s second law", "For the same charge, masses are proportional to " + Mz + "."],
    ["Equivalent mass", Mz + ": the mass deposited by 1 mol of electrons."],
    ["1 mol e⁻ deposits…", "Ag 108 g · Cu 31.8 g · Zn 32.7 g · Al 9.00 g."],
    ["Equal electrons ≠ equal atoms", "Moles of metal = moles of e⁻ ÷ <i>z</i>."],
    ["Ag : Al for the same charge", "12 : 1 by mass (108 ÷ 9.00)."],
    ["Finding an ion’s charge", "<i>z</i> = moles of e⁻ ÷ moles of metal = <i>M</i> × <i>n</i>(e⁻) ÷ <i>m</i>."],
    ["Silver coulom&#101;ter", "A silver cell in series measures charge: grams ÷ 108 = moles of e⁻."],
    ["Ratio and current", "A bigger current scales every mass equally; the ratio doesn’t change."],
    ["Aluminium cells", "Must be molten: in water, H₂ forms instead."]
  ]
};
