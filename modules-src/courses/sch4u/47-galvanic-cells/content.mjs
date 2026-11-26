// SCH4U 47 Galvanic Cells and Standard Reduction Potentials. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/47-galvanic-cells.md
// Pictures (hero, the C10 cell builder, the Part 3 strips and table, the label diagrams, the task cell) are drawn by app.js.
// Every E° comes from MV.chem.data.E0 (course table). Mystery metals M1–M3, X and Y are model values (plan §5).

const E = "<i>E</i>°";
const EC = "<i>E</i>°<sub>cell</sub>";
const ECA = "<i>E</i>°<sub>cathode</sub>";
const EAN = "<i>E</i>°<sub>anode</sub>";

// Misconception core sentences (plan §3)
const M1 = "Electrons stay in the wire. <strong>Ions</strong> move through the salt bridge.";
const M2 = "Higher " + E + " = stronger pull on electrons = <strong>reduction</strong> = cathode.";
const M3 = E + " is per unit of charge. Doubling the half-reaction doesn’t change it.";
const M4 = "Use reduction potentials for both and subtract: " + ECA + " − " + EAN + ".";
const M5 = "The most negative " + E + " belongs to the <strong>weakest</strong> oxidizing agent. Its metal is the <strong>strongest</strong> reducing agent.";
const M6 = "Only the difference matters: −0.13 − (−0.26) = +0.13 V.";
const M7 = "In a galvanic cell the anode releases electrons, so it is the <strong>negative</strong> terminal.";

export default {
  id:"47-galvanic-cells",
  kind:"topic",
  title:"Galvanic cells and standard reduction potentials",
  topic:"Galvanic Cells and Standard Reduction Potentials",
  readyTopic:"galvanic cells",
  hero:{
    eq:"Zn(s) + Cu<sup>2+</sup>(aq) → Zn<sup>2+</sup>(aq) + Cu(s) · " + EC + " = 0.34 − (−0.76) = +1.10 V", eqSize:"sm",
    eqLabel:"Zinc plus copper two plus ions gives zinc two plus ions plus copper. E zero cell equals 0.34 minus negative 0.76, which is plus 1.10 volts.",
    headline:"Make the electrons take the long way round",
    text:"Zinc gives electrons to copper ions whether or not you’re watching. In a <strong>galvanic cell</strong> the two halves sit in separate beakers, so the electrons have to travel through a wire, and a voltmeter reads the push. The <strong>anode</strong> gives electrons, the <strong>cathode</strong> takes them, and a <strong>salt bridge</strong> lets ions move to complete the circuit.",
    fig:{ html:'<div class="gc-hx"><svg class="gc-hx-svg" id="gc-hx-svg" viewBox="0 0 520 344" role="img" aria-label="A zinc strip in pale blue copper(II) solution grows a copper coating while a thermometer rises: the energy is lost as heat. The scene splits into two beakers, zinc in Zn²⁺ and copper in Cu²⁺, joined by a wire and a KNO₃ salt bridge. Violet electrons stream through the wire from zinc to copper; teal NO₃⁻ ions drift into the zinc beaker and orange K⁺ ions into the copper beaker. The voltmeter reads +1.10 V and a small bulb glows."></svg><div class="gc-hx-row"><p class="gc-hx-ctr" id="gc-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="gc-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can name the parts of a galvanic cell and explain what each one does.",
    "I can use the reduction-potential table to rank oxidizing and reducing agents.",
    "I can identify the anode and cathode and calculate " + EC + " = " + ECA + " − " + EAN + ".",
    "I can predict whether a redox reaction is spontaneous from " + E + " values.",
    "I can describe and label electron flow, ion flow and electrode polarity in a cell.",
    "I can explain how the standard hydrogen electrode is used to find an unknown half-cell’s " + E + "."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Half-reactions", goal:3,
          prompt:"Which half-reaction shows zinc being oxidized?",
          options:[
            { t:"Zn(s) → Zn<sup>2+</sup>(aq) + 2e<sup>−</sup>", ok:true, why:"Oxidation loses electrons, so the electrons are products." },
            { t:"Zn<sup>2+</sup>(aq) + 2e<sup>−</sup> → Zn(s)", why:"That’s the reduction." },
            { t:"Zn(s) + 2e<sup>−</sup> → Zn<sup>2+</sup>(aq)", why:"The charge doesn’t balance: −2 vs +2." },
            { t:"Zn(s) → Zn<sup>2+</sup>(aq) − 2e<sup>−</sup>", why:"Electrons are written as products, not subtracted." }],
          hints:["Oxidation loses electrons.", "Electrons appear as products.", "Zn → Zn<sup>2+</sup> + 2e<sup>−</sup>."] },
        { id:"w2", skill:"Half-reactions", goal:3,
          prompt:"Balance Cu + Ag<sup>+</sup> → Cu<sup>2+</sup> + Ag.",
          options:[
            { t:"Cu + 2Ag<sup>+</sup> → Cu<sup>2+</sup> + 2Ag", ok:true, why:"2 e<sup>−</sup> lost, 2 gained." },
            { t:"Cu + Ag<sup>+</sup> → Cu<sup>2+</sup> + Ag", why:"Charge +1 vs +2." },
            { t:"2Cu + Ag<sup>+</sup> → 2Cu<sup>2+</sup> + Ag", why:"4 e<sup>−</sup> lost, 1 gained." },
            { t:"Cu + 2Ag<sup>+</sup> → Cu<sup>2+</sup> + Ag", why:"Ag atoms: 2 vs 1." }],
          hints:["Electrons lost per Cu?", "2; each Ag<sup>+</sup> takes 1.", "2Ag<sup>+</sup>."] },
        { id:"w3", skill:"Oxidizing and reducing agents", goal:2,
          prompt:"In Zn + Cu<sup>2+</sup> → Zn<sup>2+</sup> + Cu, which is the oxidizing agent?",
          options:[
            { t:"Cu<sup>2+</sup>", ok:true, why:"It takes electrons (is reduced)." },
            { t:"Zn", why:"Zn is oxidized, so it is the reducing agent, not the oxidizing agent." },
            { t:"Zn<sup>2+</sup>", why:"A product." },
            { t:"Cu", why:"A product." }],
          hints:["What gets reduced?", "Cu<sup>2+</sup> → Cu.", "Cu<sup>2+</sup>."] },
        { id:"w4", skill:"Oxidizing and reducing agents", goal:2,
          prompt:"A strong oxidizing agent is a species that…",
          options:[
            { t:"readily gains electrons", ok:true, why:"It takes electrons from something else, so it is reduced." },
            { t:"readily loses electrons", why:"That’s a reducing agent." },
            { t:"contains oxygen", why:"Oxygen isn’t required." },
            { t:"is always a metal atom", why:"Metal atoms are reducing agents." }],
          hints:["An oxidizing agent causes oxidation.", "It takes electrons from something else.", "It gains electrons."] },
        { id:"w5", skill:"Activity series", goal:4,
          prompt:"Using Mg > Zn > Fe > Cu > Ag, which pair reacts?",
          options:[
            { t:"Zn metal in Cu<sup>2+</sup> solution", ok:true, why:"Zn is more active than Cu." },
            { t:"Cu metal in Zn<sup>2+</sup> solution", why:"Cu is less active." },
            { t:"Ag metal in Cu<sup>2+</sup> solution", why:"Ag is the least active." },
            { t:"Fe metal in Mg<sup>2+</sup> solution", why:"Mg is more active than Fe." }],
          hints:["A metal displaces ions of a <strong>less</strong> active metal.", "Which metal is higher?", "Zn into Cu<sup>2+</sup>."] },
        { id:"w6", skill:"Activity series", goal:4,
          prompt:"Which metal is the strongest reducing agent: Mg, Zn, Cu or Ag?",
          options:[
            { t:"Mg", ok:true, why:"The most active metal loses electrons most easily." },
            { t:"Ag", why:"Ag is the least active." },
            { t:"Cu", why:"Cu is below Zn and Mg in the series." },
            { t:"Zn", why:"Zn is below Mg." }],
          hints:["Reducing agents lose electrons.", "Who loses them most easily?", "Mg."] }
      ],
      refreshers:{
        "Half-reactions":"Oxidation: electrons as products. Reduction: electrons as reactants. Each must balance atoms and charge.",
        "Oxidizing and reducing agents":"Oxidizing agent = takes electrons (reduced). Reducing agent = gives electrons (oxidized).",
        "Activity series":"A metal gives electrons to the ions of any metal below it. The table in this module turns that series into numbers."
      }
    }
  },
  explore:{
    heading:"Cell builder",
    intro:"Pick two half-cells, add a salt bridge and a wire, and read the voltmeter. Then find out where every electron and ion goes.",
    how:"Choose a mode. In Build, pick a half-cell for each beaker, switch the salt bridge and wire on or off, choose the device and where the + lead goes, and slide the run time. Every half-cell is 1.0 mol/L at 25 °C.",
    modes:[{ id:"build", t:"Build" }, { id:"she", t:"Hydrogen reference" }, { id:"react", t:"Will it react?" }],
    sheNote:"The left beaker is the standard hydrogen electrode: Pt, H<sub>2</sub> at 100 kPa, 1.0 mol/L H<sup>+</sup>. Mystery metals M1–M3 are model values, not course-table data.",
    reactNote:"No cell here: drop a metal strip straight into a solution and watch whether a coating forms.",
    predictions:[
      { id:"p1", prompt:"Zn–Cu cell built, run time 0. After 30 minutes, which electrode has <strong>lost</strong> mass?",
        options:[{ t:"The zinc", ok:true }, { t:"The copper" }, { t:"Both" }, { t:"Neither" }],
        explain:"Zinc atoms leave as Zn<sup>2+</sup> at the anode; Cu<sup>2+</sup> ions plate out as Cu at the cathode. " + M7 },
      { id:"p2", prompt:"The Zn–Cu cell is running. Now remove the salt bridge. What does the voltmeter read?",
        options:[{ t:"0.00 V", ok:true }, { t:"1.10 V" }, { t:"2.20 V" }, { t:"−1.10 V" }],
        explain:"Without ions moving, each beaker would build up charge, and that stops the electrons almost at once. Electrons never go through the bridge." },
      { id:"p3", prompt:"Cu–Ag cell. The silver half-reaction is written 2Ag<sup>+</sup> + 2e<sup>−</sup> → 2Ag to match copper’s electrons. What is " + EC + "?",
        options:[{ t:"0.46 V", ok:true }, { t:"1.26 V" }, { t:"0.92 V" }, { t:"0.23 V" }],
        explain:E + " is energy per unit of charge. Writing more electrons doesn’t change it: 0.80 − 0.34 = 0.46 V." },
      { id:"p4", prompt:"Hydrogen reference mode with Cu in the right beaker. Which way do electrons flow?",
        options:[{ t:"From the hydrogen electrode to the copper", ok:true }, { t:"From the copper to the hydrogen electrode" }, { t:"Neither way" }, { t:"Both ways" }],
        explain:"Cu<sup>2+</sup>/Cu (+0.34 V) is above the hydrogen electrode (0.00 V), so copper is the cathode: H<sub>2</sub> → 2H<sup>+</sup> + 2e<sup>−</sup> at the Pt, Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu, and the voltmeter reads 0.34 V." }
    ],
    chalIntro:"Use the cell builder to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses <strong>Hydrogen reference</strong> mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Build the Zn–Cu cell so the voltmeter reads <strong>+1.10 V</strong>.",
        why:"Zn (−0.76 V) is the anode and Cu (+0.34 V) the cathode. With the bridge and wire in place and the + lead on the positive terminal (the copper cathode), the m&#101;ter reads +1.10 V.",
        general:"Not yet +1.10 V. Choose the half-cells, complete the circuit and use the voltmeter.",
        hints:["A complete circuit needs a wire <strong>and</strong> a salt bridge.", "Which electrode is positive in a galvanic cell?", "The cathode (Cu): put the + lead there."] },
      { id:"tc2", goal:3, prompt:"Build a cell <strong>other than Zn–Cu</strong> whose " + EC + " is between 1.00 V and 1.20 V.",
        why:"Two " + E + " values about 1.1 V apart: Ni–Ag gives 0.80 − (−0.26) = 1.06 V, and Ni–Fe<sup>3+</sup>/Fe<sup>2+</sup> gives 0.77 − (−0.26) = 1.03 V.",
        general:"Choose two different half-cells in Build mode.",
        hints:["You need two " + E + " values about 1.1 V apart.", "Look near −0.26 V and +0.80 V.", "Ni (−0.26) with Ag (+0.80): 1.06 V."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Hydrogen reference mode: measure mystery metal M1. Then predict the " + EC + " of an M1–Cu cell and choose its anode.",
        why:"Electrons flowed from M1 to the hydrogen electrode, so M1 is the anode and sits 0.40 V below it: " + E + "(M1) = −0.40 V. Against Cu: 0.34 − (−0.40) = 0.74 V, with M1 as the anode.",
        general:"Choose M1 in Hydrogen reference mode, read the m&#101;ter and the electron direction, then fill in all three answers.",
        hints:["Read the m&#101;ter and the electron direction.", "M1 is the anode against the hydrogen electrode, so " + E + "(M1) = −0.40 V.", "0.34 − (−0.40) = 0.74 V, with M1 as the anode."] }
    ]
  },
  part3:{
    slug:"spontaneity", name:"Will it react?", heading:"Will it react?",
    intro:"No cell this time. A metal goes straight into a solution: predict whether it reacts, then watch the strip. <strong>Check it with data</strong> shows the " + E + " subtraction behind every result.",
    trials:[
      { id:"t1", m:"zn", s:"cu" }, { id:"t2", m:"cu", s:"zn" }, { id:"t3", m:"cu", s:"ag" }, { id:"t4", m:"ag", s:"cu" },
      { id:"t5", m:"fe", s:"h" }, { id:"t6", m:"cu", s:"h" }, { id:"t7", m:"ni", s:"pb", note:"even though both " + E + " values are negative" }, { id:"t8", m:"pb", s:"ni" }
    ],
    s1:{ title:"Station 1: Strip in solution", intro:"For each trial, predict <strong>Reacts</strong> or <strong>No reaction</strong>, then press <strong>Watch</strong>." },
    s2:{ title:"Station 2: The table rule",
      intro:"Move the highlight bar to an oxidizing agent in the left column. The reducing agents it reacts with light up in the right column. What pattern do you see?",
      rule:"An oxidizing agent (left column) reacts spontaneously with a reducing agent (right column) that is <strong>lower</strong> in the table.",
      cards:[
        { id:"r1", t:"Mg metal in Sn<sup>2+</sup>(aq)", ox:"sn", red:"mg" },
        { id:"r2", t:"I<sup>−</sup>(aq) with Cu<sup>2+</sup>(aq)", ox:"cu", red:"i" }
      ] },
    s3:{ title:"Station 3: Etching circuit boards",
      html:"<p>Circuit-board makers once removed unwanted copper with iron(III) chloride solution:</p><p class=\"gc-eqn\">Cu(s) + 2Fe<sup>3+</sup>(aq) → Cu<sup>2+</sup>(aq) + 2Fe<sup>2+</sup>(aq)</p>",
      ecell:{ prompt:"Calculate " + EC + " for the etching reaction.", answer:0.43, tol:0.01,
        wrong:[{ match:1.11, fb:"That adds the values. " + M4 }, { match:-0.43, fb:"Fe<sup>3+</sup>/Fe<sup>2+</sup> (+0.77 V) is higher, so it is the cathode: 0.77 − 0.34." }],
        fb:"Fe<sup>3+</sup> is reduced (cathode, +0.77 V) and Cu is oxidized (anode, +0.34 V).",
        why:EC + " = 0.77 − 0.34 = +0.43 V: positive, so the etching is spontaneous." },
      concern:{ prompt:"After etching, what is the main concern when the used solution is disposed of?",
        // Distractors authored for the module (plan gives only the correct concern).
        options:[
          { t:"The used solution contains dissolved copper ions, which harm aquatic life if released.", ok:true, why:"Copper ions are toxic to fish and other aquatic life, so the solution must be treated, not poured away." },
          { t:"The used solution is radioactive.", why:"Nothing in the reaction is radioactive. Look at what ended up dissolved in the solution." },
          { t:"The copper turns back into solid metal in the drain.", why:"The copper stays dissolved as Cu<sup>2+</sup> ions; that is the problem." },
          { t:"There is no concern: it is only salt water.", why:"It now holds dissolved Cu<sup>2+</sup> ions." }] } },
    s4:{ title:"Station 4: Why hydrogen is zero",
      html:"<p>A voltmeter only measures a <strong>difference</strong> between two half-cells. So one half-cell is chosen as the reference and given 0.00 V by agreement: the <strong>standard hydrogen electrode</strong>, Pt in 1.0 mol/L H<sup>+</sup>, with H<sub>2</sub> bubbling at 100 kPa. Every other " + E + " in the table is that half-cell’s voltage measured against it.</p>" },
    quickCheck:{
      title:"Quick check", summary:"Will it react? quick check",
      items:[
        { id:"q1", goal:4, prompt:"Will Sn react with Ag<sup>+</sup>(aq)?",
          choices:[
            { t:"Yes, +0.94 V", ok:true, fb:"Right. 0.80 − (−0.14) = +0.94 V." },
            { t:"No, −0.94 V", fb:"0.80 − (−0.14) = +0.94 V." },
            { t:"Yes, +0.66 V", fb:"0.80 − (−0.14) = +0.94 V." },
            { t:"No: both are metals", fb:"0.80 − (−0.14) = +0.94 V." }] },
        { id:"q2", goal:4, prompt:"Will Pb react with Zn<sup>2+</sup>(aq)?",
          choices:[
            { t:"No, −0.63 V", ok:true, fb:"Right. Zn<sup>2+</sup> would be the cathode: −0.76 − (−0.13) = −0.63 V." },
            { t:"Yes, +0.63 V", fb:"Zn<sup>2+</sup> would be the cathode: −0.76 − (−0.13) = −0.63 V." },
            { t:"Yes, +0.89 V", fb:"Zn<sup>2+</sup> would be the cathode: −0.76 − (−0.13) = −0.63 V." },
            { t:"Yes: Pb is a metal", fb:"Zn<sup>2+</sup> would be the cathode: −0.76 − (−0.13) = −0.63 V." }] },
        { id:"q3", goal:4, prompt:"Ni and Pb<sup>2+</sup> both have negative " + E + " values. Can they react?",
          choices:[
            { t:"Yes: only the difference matters (+0.13 V)", ok:true, fb:"Right. The sign of the difference decides." },
            { t:"No: negative means never", fb:"The sign of the difference decides. " + M6 },
            { t:"Only if heated", fb:"The sign of the difference decides. " + M6 },
            { t:"No: they need a salt bridge", fb:"The sign of the difference decides. " + M6 }] },
        { id:"q4", goal:6, prompt:"The hydrogen electrode is 0.00 V because…",
          choices:[
            { t:"it was chosen as the reference", ok:true, fb:"Right. Only differences can be measured, so one half-cell is set to zero by agreement." },
            { t:"hydrogen has no electrons", fb:"Only differences can be measured, so one half-cell is set to zero by agreement." },
            { t:"it doesn’t react", fb:"Only differences can be measured, so one half-cell is set to zero by agreement." },
            { t:"it was measured as exactly zero", fb:"Only differences can be measured, so one half-cell is set to zero by agreement." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"label", type:"custom", title:"Label the cell", summary:"Label the cell", goal:[1, 5],
        instruction:"Label two cells: tap a label, then tap the place it belongs on the diagram. Some labels ask you to choose or enter an answer instead.",
        how:"Tap <strong>Choose this label</strong>, then tap a spot on the diagram (the round buttons). Each label has three levels of help.",
        cells:[
          { id:"A", title:"Cell A", L:"mg", R:"ni", desc:"Mg | Mg<sup>2+</sup> beaker on the left, Ni | Ni<sup>2+</sup> beaker on the right, KNO<sub>3</sub> bridge, voltmeter." },
          { id:"B", title:"Cell B", L:"zn", R:"fe3", desc:"Zn | Zn<sup>2+</sup> beaker on the left, Pt | Fe<sup>3+</sup>, Fe<sup>2+</sup> beaker on the right, KNO<sub>3</sub> bridge, voltmeter." }
        ],
        items:[
          { id:"l1", cell:"A", kind:"place", goal:1, label:"Anode", answer:"elL", tag:"anode",
            wrong:{ elR:"Mg has the lower " + E + " (−2.37 V), so it’s oxidized." }, wrongDefault:"The anode is an electrode: the one where oxidation happens.",
            why:"Mg has the lower " + E + " (−2.37 V), so it’s oxidized: the anode.",
            hints:["The anode is where oxidation happens.", "Which half-cell has the lower " + E + ": Mg (−2.37 V) or Ni (−0.26 V)?", "The Mg electrode."] },
          { id:"l2", cell:"A", kind:"place", goal:5, label:"Positive electrode", answer:"elR", tag:"positive (+)",
            wrong:{ elL:"In a galvanic cell the cathode is +. " + M7 }, wrongDefault:"The positive terminal is one of the two electrodes.",
            why:"In a galvanic cell the cathode is +: Ni (−0.26 V) is reduced.",
            hints:["The positive electrode is the cathode in a galvanic cell.", "Which half-cell is reduced: the one with the higher " + E + "?", "The Ni electrode."] },
          { id:"l3", cell:"A", kind:"pick", goal:5, label:"Electron direction", prompt:"Choose the arrow that shows the electrons.",
            options:[
              { t:"Mg → Ni, through the wire", ok:true, why:"Electrons leave the Mg anode and travel through the wire to the Ni cathode." },
              { t:"Ni → Mg, through the wire", why:"Electrons leave the anode, where oxidation releases them. " + M2 },
              { t:"Mg → Ni, through the salt bridge", why:"Electrons stay in the wire. " + M1 },
              { t:"Ni → Mg, through the salt bridge", why:M1 }],
            hints:["Electrons are released at the anode.", "They need a path made of metal.", "Mg → Ni, through the wire."] },
          { id:"l4", cell:"A", kind:"place", goal:5, label:"Where NO<sub>3</sub><sup>−</sup> moves", answer:"solL", tag:"NO₃⁻ in",
            wrong:{ solR:"Anions move toward the anode, where positive ions are forming." }, wrongDefault:"NO<sub>3</sub><sup>−</sup> moves out of the bridge into one of the beakers.",
            why:"Anions move toward the anode, where positive Mg<sup>2+</sup> ions are forming.",
            hints:["Positive Mg<sup>2+</sup> ions are piling up in the left beaker.", "Which ions in the bridge can balance that?", "NO<sub>3</sub><sup>−</sup> moves into the Mg beaker."] },
          { id:"l5", cell:"B", kind:"place", goal:1, label:"Inert electrode", answer:"elR", tag:"inert",
            wrong:{ elL:"Pt carries electrons but doesn’t react. Zinc is oxidized." }, wrongDefault:"An inert electrode is an electrode that doesn’t react.",
            why:"Pt carries electrons but doesn’t react.",
            hints:["Inert means it doesn’t react.", "Which electrode isn’t part of either half-reaction?", "The Pt."] },
          { id:"l6", cell:"B", kind:"pick", goal:5, label:"Cathode reaction", prompt:"Choose the reaction at the cathode.",
            options:[
              { t:"Fe<sup>3+</sup> + e<sup>−</sup> → Fe<sup>2+</sup>", ok:true, why:"Fe<sup>3+</sup>/Fe<sup>2+</sup> (+0.77 V) is higher, so Fe<sup>3+</sup> is reduced at the Pt." },
              { t:"Fe<sup>2+</sup> + 2e<sup>−</sup> → Fe", why:"Fe(s) isn’t present; the iron ions change charge." },
              { t:"Zn<sup>2+</sup> + 2e<sup>−</sup> → Zn", why:"Zinc is the anode: it is oxidized, not reduced." },
              { t:"Fe<sup>2+</sup> → Fe<sup>3+</sup> + e<sup>−</sup>", why:"That’s an oxidation. The cathode is where reduction happens." }],
            hints:["The cathode is where reduction happens.", "Which iron ion can gain an electron?", "Fe<sup>3+</sup> + e<sup>−</sup> → Fe<sup>2+</sup>."] },
          { id:"l7", cell:"B", kind:"num", goal:3, label:EC, prompt:"Enter " + EC + " for Cell B.", answer:1.53, tol:0.01, unit:"V",
            wrong:[{ match:0.01, fb:"Subtract: 0.77 − (−0.76). " + M4 }, { match:-1.53, fb:"Cathode minus anode: 0.77 − (−0.76)." }],
            fb:EC + " = " + ECA + " − " + EAN + ".", why:"0.77 − (−0.76) = 1.53 V.",
            hints:["Which is the cathode, and which the anode?", ECA + " = +0.77 V; " + EAN + " = −0.76 V.", "0.77 − (−0.76) = 1.53 V."] },
          { id:"l8", cell:"B", kind:"place", goal:5, label:"Electrode that loses mass", answer:"elL", tag:"loses mass",
            wrong:{ elR:"The Pt doesn’t change." }, wrongDefault:"Mass is lost by an electrode.",
            why:"Zinc atoms leave as Zn<sup>2+</sup> ions, so the Zn electrode loses mass. The Pt doesn’t change.",
            hints:["Atoms leave an electrode when it is oxidized.", "Which electrode is the anode?", "The Zn."] }
        ] },
      { id:"calc", type:"custom", title:"Cell calculations", summary:"Cell calculations", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Six items: number entry and choices. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer or tap your choice, then press Check. Voltages within 0.01 V are accepted. The " + E + " table is below.",
        items:[
          { id:"c1", goal:3, prompt:EC + " for an Al–Ag cell?",
            parts:[{ k:"num", label:EC + " =", answer:2.46, tol:0.01, unit:"V",
              wrong:[{ match:0.86, fb:"Use −(−1.66): 0.80 + 1.66. " + M4 }, { match:7.06, fb:"Don’t multiply by 3. " + M3 }] }],
            fb:"Ag (+0.80 V) is the cathode and Al (−1.66 V) the anode.", why:"0.80 − (−1.66) = 2.46 V.", display:"2.46 V",
            hints:["Which half-cell has the higher " + E + "?", "Ag (+0.80) is the cathode; Al (−1.66) is the anode.", "0.80 − (−1.66) = 2.46 V."] },
          { id:"c2", goal:3, prompt:"An Sn–Pb cell: which is the anode, and what is " + EC + "?",
            parts:[
              { k:"pick", label:"Anode:", options:[{ t:"Sn", ok:true }, { t:"Pb", why:"Sn (−0.14) is lower than Pb (−0.13)." }] },
              { k:"num", label:EC + " =", answer:0.01, tol:0.004, unit:"V", wrong:[{ match:-0.27, fb:"That adds the values. " + M4 }, { match:-0.01, fb:"Cathode minus anode: −0.13 − (−0.14)." }] }],
            fb:"−0.13 − (−0.14).", why:"Sn is the anode; −0.13 − (−0.14) = 0.01 V.", display:"Sn; 0.01 V",
            hints:["The anode has the lower " + E + ".", "Sn −0.14 V, Pb −0.13 V.", "Sn is the anode; −0.13 − (−0.14) = 0.01 V."] },
          { id:"c3", goal:4, star:true, prompt:"<strong>Investigation:</strong> A student builds a Zn–Cu cell and measures 1.04 V, not 1.10 V. Best explanation?",
            parts:[{ k:"pick", label:"", options:[
              { t:"The conditions weren’t standard (concentrations not exactly 1.0 mol/L, or not 25 °C)", ok:true, why:"The table’s values hold only at standard conditions." },
              { t:"The table is wrong", why:"The table assumes standard conditions; check your setup first." },
              { t:"The salt bridge carries electrons", why:M1 },
              { t:"Zinc is lighter than copper", why:"Mass doesn’t set the voltage; the half-cells and their conditions do." }] }],
            why:"Real cells read different voltages at other concentrations or temperatures.", display:"non-standard conditions",
            hints:["What conditions does the table assume?", "1.0 mol/L and 25 °C.", "The conditions weren’t standard."] },
          { id:"c4", goal:2, star:true, prompt:"Mystery metals A, B and C: in an A–B cell A is the anode at 0.50 V; in a B–C cell B is the anode at 0.30 V. Predict the A–C cell.",
            parts:[
              { k:"pick", label:"Anode:", options:[{ t:"A", ok:true }, { t:"B", why:"B isn’t in the A–C cell." }, { t:"C", why:"A is lowest in the table." }] },
              { k:"num", label:EC + " =", answer:0.80, tol:0.01, unit:"V", wrong:[{ match:0.20, fb:"Both steps go the same way: 0.50 + 0.30." }] }],
            fb:"Stack the steps: A is 0.50 V below B, and B is 0.30 V below C.", why:"A is 0.50 V below B, and B is 0.30 V below C, so A is 0.80 V below C: " + EC + " = 0.80 V, with A as the anode.", display:"0.80 V, A anode",
            hints:["Draw a ladder: A below B, B below C.", "A is 0.50 V below B; B is 0.30 V below C.", "0.50 + 0.30 = 0.80 V, with A as the anode."] },
          { id:"c5", goal:6, star:true, prompt:"An Ag–X cell reads 1.20 V with Ag as the cathode. Pair X with Zn. Which is the anode, and what is " + EC + "?",
            parts:[
              { k:"num", label:E + "(X) =", answer:-0.40, tol:0.01, unit:"V", neg:true, wrong:[{ match:0.40, fb:"X is the anode against Ag, so it lies 1.20 V <strong>below</strong> +0.80 V." }, { match:2.00, fb:"1.20 = 0.80 − " + E + "(X)." }] },
              { k:"pick", label:"Anode:", options:[{ t:"Zn", ok:true }, { t:"X", why:"−0.40 is above −0.76, so X is the cathode against Zn. " + M2 }] },
              { k:"num", label:EC + " =", answer:0.36, tol:0.01, unit:"V", wrong:[{ match:-1.16, fb:"That adds the values. " + M4 }] }],
            fb:"Find " + E + "(X) first, then compare it with Zn.", why:E + "(X) = −0.40 V; Zn is the anode; −0.40 − (−0.76) = 0.36 V.", display:E + "(X) = −0.40 V; Zn anode; 0.36 V",
            hints:["1.20 = 0.80 − " + E + "(X).", E + "(X) = −0.40 V.", "Zn (−0.76) is lower, so Zn is the anode: −0.40 − (−0.76) = 0.36 V."] },
          { id:"c6", goal:4, star:true, prompt:"A lemon battery has Zn and Cu strips in acidic juice with no Cu<sup>2+</sup> ions. Which reaction most likely happens at the copper?",
            parts:[{ k:"pick", label:"", options:[
              { t:"2H<sup>+</sup> + 2e<sup>−</sup> → H<sub>2</sub> (the copper just carries electrons)", ok:true, why:"The H<sup>+</sup> from the acid is reduced; " + EC + " = 0.00 − (−0.76) = 0.76 V." },
              { t:"Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu", why:"There’s no Cu<sup>2+</sup> to reduce; the H<sup>+</sup> from the acid is reduced instead." },
              { t:"Zn → Zn<sup>2+</sup> + 2e<sup>−</sup>", why:"That happens at the zinc, the anode." },
              { t:"Cu → Cu<sup>2+</sup> + 2e<sup>−</sup>", why:"Copper is the cathode here: it takes electrons, it doesn’t give them." }] }],
            why:"Only H<sup>+</sup> can accept electrons at the copper surface.", display:"2H<sup>+</sup> + 2e<sup>−</sup> → H<sub>2</sub>",
            hints:["What can accept electrons at the copper surface?", "Only H<sup>+</sup> from the acid.", "2H<sup>+</sup> + 2e<sup>−</sup> → H<sub>2</sub>; " + EC + " = 0.00 − (−0.76) = 0.76 V."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Hector", how:"", goal:[3, 5],
        instruction:"Hector made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find " + EC + " for an Al–Cu cell.",
            steps:["Cu<sup>2+</sup>/Cu (+0.34 V) is higher, so Cu is the cathode.", EC + " = " + ECA + " − " + EAN + ".", "Multiply each by its coefficient: 3(0.34) − 2(−1.66) = 4.34 V.", EC + " = 4.34 V."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:E + " values aren’t multiplied: 0.34 − (−1.66) = 2.00 V.", ok:true, why:M3 },
              { t:"Divide by the coefficients instead.", why:"Coefficients don’t affect " + E + " at all. " + M3 },
              { t:"Add the values: 0.34 + (−1.66) = −1.32 V.", why:M4 },
              { t:"Step 3 is correct.", why:E + " is per unit of charge. " + M3 }],
            hints:["Does writing 2Al change aluminium’s " + E + "?", "No.", "2.00 V."] },
          { id:"e2", goal:3, task:"Which electrode is the anode in a Cu–Ag cell?",
            steps:["Ag<sup>+</sup>/Ag is +0.80 V; Cu<sup>2+</sup>/Cu is +0.34 V.", "The more positive half-cell is the anode, so Ag is the anode.", EC + " = 0.34 − 0.80 = −0.46 V."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2."],
            fixes:[
              { t:"The higher " + E + " is the <strong>cathode</strong> (reduction). Cu is the anode: 0.80 − 0.34 = +0.46 V.", ok:true, why:M2 },
              { t:"Both are positive, so there is no anode.", why:"One half-cell must be oxidized." },
              { t:"The anode is whichever metal is heavier.", why:"Mass doesn’t decide; " + E + " does." },
              { t:"Step 2 is correct.", why:"A galvanic cell has a positive " + EC + ". " + M2 }],
            hints:["Which half-cell pulls electrons harder?", "Ag<sup>+</sup> (+0.80).", "So Ag is reduced: the cathode."] },
          { id:"e3", goal:5, task:"Describe the flow in a Zn–Cu cell.",
            steps:["Zn is the anode, where Zn → Zn<sup>2+</sup> + 2e<sup>−</sup>.", "Electrons leave the zinc electrode.", "They travel through the salt bridge to the copper beaker.", "Cu<sup>2+</sup> ions pick them up at the cathode."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:"Electrons travel through the <strong>wire</strong> to the copper electrode; ions move through the salt bridge.", ok:true, why:M1 },
              { t:"They travel through the voltmeter and then the bridge.", why:"Only through the wire and the m&#101;ter, never the bridge. " + M1 },
              { t:"They stay in the zinc beaker.", why:"Then no current would flow." },
              { t:"Step 3 is correct.", why:"The bridge carries ions, not electrons. " + M1 }],
            hints:["What is the bridge made of?", "A salt solution: ions.", "Electrons use the wire."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which Explore result surprised you most: the zero reading without a salt bridge, or the unchanged " + E + " when you doubled a half-reaction? Why?" },
      { id:"j2", q:"In your own words, explain why the half-cell with the higher " + E + " is the cathode." },
      { id:"j3", q:"Explain to a friend how to predict whether a metal will react with a solution, using the table." },
      { id:"j4", q:"What part of a cell diagram do you still find confusing? How will you check it next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In a galvanic cell, oxidation occurs at the…", options:[
          { t:"anode", ok:true, why:"The anode gives up electrons: oxidation." },
          { t:"cathode", why:"Reduction occurs there." },
          { t:"salt bridge", why:"The bridge carries ions; no reaction happens there." },
          { t:"voltmeter", why:"The m&#101;ter only measures." }] },
        b:{ prompt:"What is the job of the salt bridge?", options:[
          { t:"To let ions move so each half-cell stays neutral and the circuit is complete", ok:true, why:"Ions drift through the bridge: anions to the anode, cations to the cathode." },
          { t:"To carry electrons between the beakers", why:M1 },
          { t:"To supply the cell’s voltage", why:"The voltage comes from the two half-reactions." },
          { t:"To stop the reaction when it’s not needed", why:"Removing it stops the reaction; that isn’t its job." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is the strongest oxidizing agent: Ag<sup>+</sup>, Cu<sup>2+</sup>, Zn<sup>2+</sup> or Mg<sup>2+</sup>?", options:[
          { t:"Ag<sup>+</sup>", ok:true, why:"Highest " + E + " (+0.80 V)." },
          { t:"Mg<sup>2+</sup>", why:"The most negative " + E + " belongs to the weakest oxidizing agent." },
          { t:"Zn<sup>2+</sup>", why:M5 },
          { t:"Cu<sup>2+</sup>", why:"+0.34 V is below +0.80 V." }] },
        b:{ prompt:"Which is the strongest reducing agent: Ag, Cu, Zn or Mg?", options:[
          { t:"Mg", ok:true, why:"Mg<sup>2+</sup>/Mg has the most negative " + E + ", so Mg gives up electrons most easily." },
          { t:"Ag", why:M5 },
          { t:"Cu", why:M5 },
          { t:"Zn", why:"−0.76 V is above −2.37 V." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"The standard hydrogen electrode has " + E + " = 0.00 V because…", options:[
          { t:"it was chosen as the reference that other half-cells are measured against", ok:true, why:"Only differences can be measured, so one half-cell is set to zero by agreement." },
          { t:"hydrogen doesn’t react", why:"It does: 2H<sup>+</sup> + 2e<sup>−</sup> ⇌ H<sub>2</sub>." },
          { t:"it was measured as exactly zero", why:"Single half-cells can’t be measured alone." },
          { t:"platinum has no electrons", why:"Pt only carries electrons." }] },
        b:{ prompt:"A half-cell paired with the hydrogen electrode reads 0.34 V, and the half-cell is the cathode. What is its " + E + "?", options:[
          { t:"+0.34 V", ok:true, why:"As the cathode it lies 0.34 V above 0.00 V." },
          { t:"−0.34 V", why:"As the cathode, it is above 0." },
          { t:"0.00 V", why:"That’s the reference." },
          { t:"+0.68 V", why:"Don’t double it." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is " + EC + " for an Al–Cu cell?", options:[
          { t:"2.00 V", ok:true, why:"0.34 − (−1.66)." },
          { t:"−1.32 V", why:"That adds the values. " + M4 },
          { t:"4.34 V", why:"That multiplies by 3 and 2. " + M3 },
          { t:"−2.00 V", why:"Cathode minus anode, with Cu as the cathode." }] },
        b:{ prompt:"What is " + EC + " for a Ni–Ag cell?", options:[
          { t:"1.06 V", ok:true, why:"0.80 − (−0.26)." },
          { t:"0.54 V", why:"That adds the values. " + M4 },
          { t:"1.86 V", why:"That doubles silver’s value. " + M3 },
          { t:"−1.06 V", why:"Cathode minus anode, with Ag as the cathode. " + M2 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Will Ni(s) react with Pb<sup>2+</sup>(aq)?", options:[
          { t:"Yes: " + EC + " = −0.13 − (−0.26) = +0.13 V", ok:true, why:"Positive, so spontaneous, even though both values are negative." },
          { t:"No: both " + E + " values are negative", why:M6 },
          { t:"Yes: " + EC + " = −0.13 + (−0.26) = −0.39 V", why:"A negative value would mean no reaction. " + M4 },
          { t:"No: " + EC + " = −0.13 V", why:"That’s Pb’s value alone." }] },
        b:{ prompt:"Will Cu(s) react with Fe<sup>2+</sup>(aq)?", options:[
          { t:"No: " + EC + " = −0.45 − 0.34 = −0.79 V", ok:true, why:"Fe<sup>2+</sup> would have to be the cathode, but it is lower than Cu<sup>2+</sup>/Cu." },
          { t:"Yes: " + EC + " = +0.79 V", why:"Fe<sup>2+</sup> would have to be the cathode. " + M2 },
          { t:"Yes: Cu is a metal, and metals always react with ions", why:"Only with ions higher in the table." },
          { t:"No: Fe<sup>2+</sup> is not a metal", why:"Ions react when the " + E + " difference is positive." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Metal X paired with the hydrogen electrode reads 0.25 V, and electrons flow from X. What are " + EC + " and the anode for an X–Cu cell? <span class=\"muted\">(X is a mystery metal: model value.)</span>", options:[
          { t:"0.59 V; X is the anode", ok:true, why:E + "(X) = −0.25; 0.34 − (−0.25)." },
          { t:"0.09 V; X is the anode", why:"0.34 − 0.25 treats X as +0.25. " + M4 },
          { t:"0.59 V; Cu is the anode", why:M2 },
          { t:"−0.59 V; X is the cathode", why:M2 }] },
        b:{ prompt:"Metal Y paired with the hydrogen electrode reads 1.18 V, and electrons flow from Y. What are " + EC + " and the anode for a Y–Zn cell? <span class=\"muted\">(Y is a mystery metal: model value.)</span>", options:[
          { t:"0.42 V; Y is the anode", ok:true, why:E + "(Y) = −1.18; −0.76 − (−1.18)." },
          { t:"1.94 V; Y is the anode", why:M4 },
          { t:"0.42 V; Zn is the anode", why:"−0.76 is higher than −1.18." },
          { t:"−0.42 V; Y is the cathode", why:M2 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which description of a Zn–Cu cell is correct?", options:[
          { t:"“Electrons flow through the wire from Zn to Cu; in the salt bridge, anions move toward the zinc beaker and cations toward the copper beaker.”", ok:true, why:"Electrons in the wire; ions in the bridge, anions to the anode." },
          { t:"“Electrons flow through the salt bridge from Zn to Cu.”", why:M1 },
          { t:"“Electrons flow through the wire from Cu to Zn.”", why:"Electrons leave the anode, zinc. " + M2 },
          { t:"“Anions move toward the copper beaker because Cu is positive.”", why:"Anions balance the new Zn<sup>2+</sup> ions at the anode." }] },
        b:{ prompt:"Which description of a Mg–Ni cell is correct?", options:[
          { t:"“Mg is the negative anode; electrons travel through the wire to the Ni cathode; cations in the bridge move toward the nickel beaker.”", ok:true, why:"Mg (−2.37 V) is oxidized at the negative anode; cations move to the cathode." },
          { t:"“Mg is the positive anode.”", why:M7 },
          { t:"“Electrons travel through the bridge to Ni.”", why:M1 },
          { t:"“Ni is the anode because Ni<sup>2+</sup> has the higher " + E + ".”", why:M2 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why writing 2Ag<sup>+</sup> + 2e<sup>−</sup> → 2Ag doesn’t double silver’s " + E + "?", options:[
          { t:"“" + E + " measures the energy per unit of charge, which doesn’t depend on how many electrons are written.”", ok:true, why:M3 },
          { t:"“Because silver is a precious metal.”", why:"Irrelevant." },
          { t:"“It does double, but you divide again at the end.”", why:M3 },
          { t:"“Because the coefficients cancel in the overall equation.”", why:"That’s not why. " + M3 }] },
        b:{ prompt:"Which is the best explanation of why " + EC + " = " + ECA + " − " + EAN + ", rather than a sum?", options:[
          { t:"“Both table values are reduction potentials. The anode’s reaction runs in reverse, so its value is subtracted.”", ok:true, why:"The table lists reductions; the anode runs backwards." },
          { t:"“Subtracting always gives a positive number.”", why:"Not always: negative means non-spontaneous." },
          { t:"“The anode is negative, so its value is ignored.”", why:"It isn’t ignored." },
          { t:"“The rule is arbitrary.”", why:"It follows from the anode running in reverse." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Copper on a circuit board is etched away with Fe<sup>3+</sup> solution. Is the etching spontaneous, and what is " + EC + "?", options:[
          { t:"Yes, +0.43 V", ok:true, why:"0.77 − 0.34." },
          { t:"No, −0.43 V", why:"Fe<sup>3+</sup>/Fe<sup>2+</sup> is the cathode. " + M2 },
          { t:"Yes, +1.11 V", why:"That adds the values. " + M4 },
          { t:"No: copper doesn’t react with ions", why:"It reacts with ions higher in the table." }] },
        b:{ prompt:"Should copper(II) sulfate solution be stored in an iron container?", options:[
          { t:"No: Fe + Cu<sup>2+</sup> is spontaneous (+0.79 V), so the iron would dissolve", ok:true, why:"0.34 − (−0.45) = +0.79 V." },
          { t:"Yes: " + EC + " is negative", why:"Cu<sup>2+</sup>/Cu is higher, so it is the cathode. " + M2 },
          { t:"Yes: iron is stronger than copper, so it’s protected", why:"Iron is the stronger <strong>reducing agent</strong>, so it reacts." },
          { t:"No, because " + EC + " = −0.79 V", why:"The value is +0.79 V. " + M4 }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"From Zn, Cu, Ag and Ni, which pair gives the largest cell voltage?", options:[
          { t:"Zn–Ag (1.56 V)", ok:true, why:"Zn (−0.76) and Ag (+0.80) are the farthest apart." },
          { t:"Zn–Cu (1.10 V)", why:"Ag is higher than Cu." },
          { t:"Ni–Ag (1.06 V)", why:"Zn is lower than Ni." },
          { t:"Cu–Ag (0.46 V)", why:"Pick the two farthest apart." }] },
        b:{ prompt:"From Mg, Pb, Cu and Ag, which pair gives the smallest positive voltage?", options:[
          { t:"Cu–Ag (0.46 V)", ok:true, why:"0.80 − 0.34 = 0.46 V: the two closest together." },
          { t:"Pb–Cu (0.47 V)", why:"0.47 is just above 0.46." },
          { t:"Pb–Ag (0.93 V)", why:"Farther apart." },
          { t:"Mg–Pb (2.24 V)", why:"Much farther apart." }] } }
    ]
  },
  task:{
    title:"A practical cell", summary:"A practical cell",
    statement:"<p>Design a cell for a classroom kit. Choose the anode half-cell and the cathode half-cell. Can you find every design that works?</p><ol class=\"gc-conds\"><li>It runs on its own: " + EC + " is positive as connected.</li><li>1.50 V ≤ " + EC + " ≤ 2.00 V, close to a standard 1.5 V battery.</li><li>It uses no silver (too costly) and no lead (toxic).</li><li>No inert electrodes: both electrodes are metals in solutions of their own ions.</li></ol>",
    checks:["Runs on its own", "Near 1.5 V", "No Ag, no Pb", "Metal electrodes only"],
    tips:["The cathode must be higher in the table than the anode.", "Look for two " + E + " values 1.5–2.0 V apart.", "Zn–Ag (1.56 V) and Al–Pb (1.53 V) are in range, but the kit rules them out.", "Half-cells with Pt (H<sup>+</sup>, I<sub>2</sub>, Fe<sup>3+</sup>) don’t count."],
    explainPrompt:"Explain how you chose the anode and cathode, and show the " + EC + " calculation for one design.",
    vocab:"Use anode, cathode, reduction potential, " + EC + " and spontaneous.",
    more:"There’s more than one design. Can you find them all?",
    afterAt:4,
    after3:"Every answer uses a very reactive metal (Mg or Al) as the anode. To reach 1.5 V without silver, one half-cell must sit far down the table."
  },
  cards:[
    ["Galvanic cell", "Two half-cells that turn a spontaneous redox reaction into an electric current."],
    ["Anode", "Where oxidation happens; the negative electrode in a galvanic cell."],
    ["Cathode", "Where reduction happens; the positive electrode in a galvanic cell."],
    ["Salt bridge", "Lets ions move (anions → anode, cations → cathode) so the beakers stay neutral."],
    ["Electron path", "Through the wire, anode → cathode; never through the bridge."],
    [E, "Standard reduction potential: how strongly a half-reaction pulls electrons, vs the hydrogen electrode."],
    [EC, ECA + " − " + EAN + " (both reduction potentials, unchanged)."],
    ["Which is the cathode?", "The half-cell with the higher " + E + "."],
    ["Spontaneous?", EC + " > 0. Example: Ni + Pb<sup>2+</sup>: +0.13 V, even though both values are negative."],
    ["Coefficients and " + E, "Doubling a half-reaction never changes its " + E + "."],
    ["Hydrogen electrode", "Pt, H<sub>2</sub> at 100 kPa, 1.0 mol/L H<sup>+</sup>; defined as 0.00 V."],
    ["Strongest agents", "Strongest oxidizing agent: top left of the table (F<sub>2</sub>). Strongest reducing agent: bottom right (Li)."]
  ]
};
