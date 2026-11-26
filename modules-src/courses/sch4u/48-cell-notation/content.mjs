// SCH4U 48 Cell Notation (Voltaic Cells). Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/48-cell-notation.md
// Pictures (hero cell → notation, the C10 notation translator with its cell diagram, the Part 3 device cards, the task
// preview) are drawn by app.js. Every E° comes from MV.chem.data.E0 in app.js; the numbers below are the plan's answers.

const E = "<i>E</i>°";
const Ec = "<i>E</i>°<sub>cell</sub>";
const ER = "<i>E</i>°<sub>right</sub>", EL = "<i>E</i>°<sub>left</sub>";
// Notation typesetting: spaces around separators; each half stays on one line, so a long notation wraps only at ||.
const N = s => {
  const p = s.split(" || ");
  if (p.length !== 2) return '<span class="cn-n">' + s + "</span>";
  return '<span class="cn-n"><span class="cn-h">' + p[0] + '</span> <span class="cn-dl">||</span> <span class="cn-h">' + p[1] + "</span></span>";
};

// Misconception core sentences (plan §3)
const M1 = "Anode on the <strong>left</strong>, cathode on the right: read it like the electron path, left to right.";
const M2 = "|| is only the salt bridge. Every other boundary is a single |.";
const M3 = "No metal in the half-reaction? Add Pt at the outer end.";
const M4 = ER + " − " + EL + " can be negative. Then the cell as written would not run.";
const M5 = "Electrons lost must equal electrons gained: Al gives 3, Cu²⁺ takes 2, so use 2Al and 3Cu²⁺.";
const M6 = "Same phase → comma. Different phases → |.";

// Notations used more than once
const ZC = N("Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)");
const ZAG = N("Zn(s) | Zn²⁺(aq) || Ag⁺(aq) | Ag(s)");
const ZH = N("Zn(s) | Zn²⁺(aq) || H⁺(aq) | H₂(g) | Pt(s)");
const CFE = N("Cu(s) | Cu²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s)");
const ALCU = N("Al(s) | Al³⁺(aq) || Cu²⁺(aq) | Cu(s)");
const NIAG = N("Ni(s) | Ni²⁺(aq) || Ag⁺(aq) | Ag(s)");
const HCU = N("Pt(s) | H₂(g) | H⁺(aq) || Cu²⁺(aq) | Cu(s)");

// Practice 1: notation ↔ cell (plan Activity 1)
const PAIRS = [
  ["Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)", "Zinc anode, copper cathode", "zinc on the left is the anode; copper on the right is the cathode."],
  ["Cu(s) | Cu²⁺(aq) || Ag⁺(aq) | Ag(s)", "Copper anode, silver cathode", "copper on the left is the anode; silver on the right is the cathode."],
  ["Pt(s) | H₂(g) | H⁺(aq) || Cu²⁺(aq) | Cu(s)", "Hydrogen anode, copper cathode", "the hydrogen half-cell, with its Pt, is on the left: the anode."],
  ["Fe(s) | Fe²⁺(aq) || H⁺(aq) | H₂(g) | Pt(s)", "Iron anode, hydrogen cathode", "iron is on the left; the hydrogen half-cell, with Pt at the right end, is the cathode."],
  ["Zn(s) | Zn²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s)", "Zinc anode; iron(III) is reduced to iron(II) on platinum", "the comma joins two ions in one solution, and Pt carries the electrons."],
  ["Mg(s) | Mg²⁺(aq) || Ni²⁺(aq) | Ni(s)", "Magnesium anode, nickel cathode", "magnesium on the left is the anode; nickel on the right is the cathode."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"48-cell-notation",
  kind:"topic",
  title:"Cell notation (voltaic cells)",
  topic:"Cell Notation",
  readyTopic:"cell notation",
  hero:{
    headline:"A whole cell on one line",
    text:"<strong>Cell notation</strong> is chemists’ shorthand for a galvanic cell. The <strong>anode</strong> goes on the left and the <strong>cathode</strong> on the right. A single line marks a change of phase, and the double line is the <strong>salt bridge</strong>. When a half-cell has no metal of its own, an <strong>inert electrode</strong> such as platinum is written at the end.",
    fig:{ html:'<div class="cn-hx"><svg class="cn-hx-svg" id="cn-hx-svg" viewBox="0 0 520 330" role="img" aria-label="A zinc–copper galvanic cell: a zinc strip in zinc ion solution, a copper strip in copper(II) ion solution, a salt bridge and a voltmeter reading 1.10 volts. Its parts fly into one line: Zn(s), a single line, Zn²⁺(aq), a double line, Cu²⁺(aq), a single line, Cu(s). Labels mark the anode on the left, a phase boundary, the salt bridge and the cathode on the right. A violet electron arrow runs left to right above the notation. E°cell = +1.10 V."></svg><div class="cn-hx-row"><p class="cn-hx-ctr" id="cn-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="cn-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can read the symbols in cell notation: |, ||, commas and the order of the species.",
    "I can write the notation for a cell from a diagram or a description, with the anode on the left.",
    "I can decide when an inert electrode is needed and where it goes.",
    "I can find " + Ec + " and decide whether a cell is spontaneous as written.",
    "I can write the balanced overall reaction from a cell’s notation.",
    "I can explain how batteries and fuel cells work, and judge where a fuel cell is a good choice."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Anode and cathode", goal:2,
          prompt:"In a Zn–Cu galvanic cell, which electrode is the anode?",
          options:[
            { t:"Zn", ok:true, why:"Lower " + E + " (−0.76 V): it is oxidized." },
            { t:"Cu", why:"Cu²⁺ is reduced at the cathode." },
            { t:"The salt bridge", why:"The bridge carries ions only." },
            { t:"Both", why:"One is oxidized, the other reduced." }],
          hints:["Oxidation happens at the anode.", "Which half-cell has the lower " + E + "?", "Zn."] },
        { id:"w2", skill:"Anode and cathode", goal:2,
          prompt:"In a galvanic cell, electrons flow…",
          options:[
            { t:"through the wire, from the anode to the cathode", ok:true, why:"Oxidation releases electrons at the anode; they travel through the wire to the cathode." },
            { t:"through the wire, from the cathode to the anode", why:"Check the direction: electrons are released at the anode, so they leave from there." },
            { t:"through the salt bridge", why:"Electrons never enter the salt bridge; it carries ions." },
            { t:"both ways equally", why:"The flow has a direction." }],
          hints:["Where are electrons released?", "At the anode.", "Anode → cathode, through the wire."] },
        { id:"w3", skill:"E°cell", goal:4,
          prompt:"What is " + Ec + " for a Cu–Ag cell?",
          options:[
            { t:"0.46 V", ok:true, why:"0.80 − 0.34." },
            { t:"1.14 V", why:"That adds the values. " + Ec + " is a difference: 0.80 − 0.34." },
            { t:"−0.46 V", why:"Cathode and anode are swapped. Ag is the cathode: 0.80 − 0.34." },
            { t:"1.26 V", why:"Coefficients don’t change " + E + "." }],
          hints:[E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>.", "Ag is the cathode.", "0.80 − 0.34."] },
        { id:"w4", skill:"E°cell", goal:4,
          prompt:"A cell has " + Ec + " = −0.30 V as written. What does that mean?",
          options:[
            { t:"It won’t run spontaneously as written; the reverse would", ok:true, why:"A negative " + Ec + " means the reaction as written isn’t spontaneous; the reverse reaction is." },
            { t:"It runs, but slowly", why:"The sign decides spontaneity, not speed." },
            { t:"It runs at 0.30 V", why:"Don’t ignore the sign: negative means not spontaneous as written." },
            { t:"The salt bridge is missing", why:"That gives 0 V, not a negative value." }],
          hints:["What does a positive " + Ec + " mean?", "Spontaneous.", "Negative: not spontaneous as written."] },
        { id:"w5", skill:"States", goal:1,
          prompt:"Which state symbol is correct for copper(II) ions dissolved in water?",
          options:[
            { t:"Cu²⁺(aq)", ok:true, why:"(aq) means dissolved in water." },
            { t:"Cu²⁺(s)", why:"Dissolved ions are aqueous." },
            { t:"Cu²⁺(l)", why:"(l) is a pure liquid." },
            { t:"Cu²⁺(g)", why:"(g) is a gas; these ions are dissolved in water." }],
          hints:["Dissolved in water.", "Aqueous.", "(aq)."] },
        { id:"w6", skill:"States", goal:3,
          prompt:"In the hydrogen electrode, which species are in different phases?",
          options:[
            { t:"H₂ (gas) and H⁺ (aqueous)", ok:true, why:"H₂ is bubbled in as a gas; H⁺ is dissolved in the solution." },
            { t:"H⁺ and H⁺", why:"Same species, same phase." },
            { t:"Pt and Pt", why:"There is one Pt electrode, a single solid phase." },
            { t:"None: they’re all in solution", why:"H₂ is bubbled in as a gas." }],
          hints:["How is hydrogen supplied?", "As a gas.", "H₂(g) and H⁺(aq)."] }
      ],
      refreshers:{
        "Anode and cathode":"The anode is oxidized (lower " + E + ") and the cathode is reduced (higher " + E + "). Electrons go anode → cathode through the wire.",
        "E°cell":E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>. Positive means spontaneous; coefficients never change " + E + ".",
        "States":"(s) solid, (l) pure liquid, (g) gas, (aq) dissolved in water. A change of state symbol marks a phase boundary."
      }
    }
  },
  explore:{
    heading:"Notation translator",
    intro:"Turn diagrams into notation and notation into diagrams. The cell builds itself as you type it with tiles.",
    how:"Choose a mode. <strong>Read it:</strong> pick a notation and watch the cell assemble. <strong>Write it:</strong> tap tiles in order to build a notation; the diagram draws each half-cell as soon as it’s written correctly. <strong>Fix it:</strong> tap the one formatting error, then choose the correction. <strong>Swap sides</strong> reverses the cell.",
    modes:[{ id:"read", t:"Read it" }, { id:"write", t:"Write it" }, { id:"fix", t:"Fix it" }],
    // Read it list (plan): N6 is written backwards on purpose.
    list:[
      { id:"n1", toks:["Zn", "|", "Zn2+", "||", "Cu2+", "|", "Cu"] },
      { id:"n2", toks:["Pt", "|", "H2", "|", "H+", "||", "Ag+", "|", "Ag"] },
      { id:"n3", toks:["Zn", "|", "Zn2+", "||", "H+", "|", "H2", "|", "Pt"] },
      { id:"n4", toks:["Cu", "|", "Cu2+", "||", "Fe3+", ",", "Fe2+", "|", "Pt"] },
      { id:"n5", toks:["Mg", "|", "Mg2+", "||", "Ni2+", "|", "Ni"] },
      { id:"n6", toks:["Cu", "|", "Cu2+", "||", "Zn2+", "|", "Zn"] }
    ],
    tiles:["Zn", "Zn2+", "Cu", "Cu2+", "Ni", "Ni2+", "Ag", "Ag+", "Fe", "Fe3+", "Fe2+", "H2", "H+", "Pt", "Mg", "Mg2+"],
    // Fix it: one formatting error each (at token index bad); choices are tokens.
    fixes:[
      { id:"f1", toks:["Zn", "|", "Zn2+", "|", "Cu2+", "|", "Cu"], bad:3, fix:"||", choices:["||", ",", "Pt"], why:M2 },
      { id:"f2", toks:["Cu", "|", "Cu2+", "||", "Fe3+", "|", "Fe2+", "|", "Pt"], bad:5, fix:",", choices:[",", "||", "Pt"], why:"Both ions are in the same solution: use a comma. " + M6 },
      { id:"f3", toks:["Cu", "|", "Cu2+", "||", "Fe3+", ",", "Fe2+", "|", "Fe"], bad:8, fix:"Pt", choices:["Pt", "Cu", "Fe2+"], why:"There’s no iron metal in Fe³⁺ + e⁻ → Fe²⁺. " + M3 },
      { id:"f4", toks:["Pt", "|", "H2", ",", "H+", "||", "Ag+", "|", "Ag"], bad:3, fix:"|", choices:["|", "||", "Pt"], why:"A gas and a dissolved ion are different phases. " + M6 },
      { id:"f5", toks:["Mg", "||", "Mg2+", "||", "Ni2+", "|", "Ni"], bad:1, fix:"|", choices:["|", ",", "Pt"], why:M2 }
    ],
    wrongTap:"That part is written correctly. Look for the one symbol or species that breaks a rule.",
    wrongFix:"That doesn’t fix it. Check which rule this spot breaks.",
    predictions:[
      { id:"p1", prompt:"What does || stand for in " + ZC + "?",
        options:[{ t:"The salt bridge", ok:true }, { t:"A phase boundary" }, { t:"The wire" }, { t:"The voltmeter" }],
        explain:"Single lines mark phase boundaries; the double line is the bridge." },
      { id:"p2", prompt:"Which electrode is the anode in " + N("Mg(s) | Mg²⁺(aq) || Ni²⁺(aq) | Ni(s)") + "?",
        options:[{ t:"Mg, on the left", ok:true }, { t:"Ni, on the right" }, { t:"Whichever has the higher " + E }, { t:"The notation doesn’t say" }],
        explain:"By convention the anode is written on the left." },
      { id:"p3", prompt:"Why is Pt(s) at the left end of " + N("Pt(s) | H₂(g) | H⁺(aq) || Ag⁺(aq) | Ag(s)") + "?",
        options:[{ t:"The hydrogen half-cell has no solid metal, so Pt carries the electrons", ok:true }, { t:"Platinum is oxidized" }, { t:"Platinum is the salt bridge" }, { t:"Pt makes the hydrogen" }],
        explain:"Pt is inert: it provides a surface for H₂ → 2H⁺ + 2e⁻ without reacting." },
      { id:"p4", prompt:"What is " + Ec + " for " + N("Cu(s) | Cu²⁺(aq) || Zn²⁺(aq) | Zn(s)") + " <strong>as written</strong>?",
        options:[{ t:"−1.10 V: it wouldn’t run this way", ok:true }, { t:"+1.10 V" }, { t:"0.00 V" }, { t:"−0.42 V" }],
        explain:"Notation fixes which side is the anode. If the numbers say otherwise, the cell as written isn’t spontaneous." }
    ],
    chalIntro:"Use <strong>Write it</strong> mode for every challenge, then press <strong>Check challenge</strong>. Challenge 3 needs both notation slots. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Write it: build the notation for a nickel–silver cell.",
        why:"Ni (−0.26 V) is lower, so it’s the anode on the left; Ag⁺/Ag (+0.80 V) is the cathode on the right: " + NIAG + ".",
        general:"Build the notation with tiles in <strong>Write it</strong> mode: anode half-cell, ||, then the cathode half-cell.",
        hints:["Which is the anode: Ni (−0.26 V) or Ag (+0.80 V)?", "Ni on the left.", NIAG + "."] },
      { id:"tc2", goal:[3, 4], prompt:"Write it: a cell of copper with the Fe³⁺/Fe²⁺ couple. Then enter " + Ec + ".",
        why:"Copper (+0.34 V) is the anode; the iron ions share one solution and Pt is the electrode: " + CFE + ". " + Ec + " = 0.77 − 0.34 = 0.43 V.",
        general:"Build the copper–iron cell with tiles, then type " + Ec + " in the box under the tiles.",
        hints:["Cu has the lower " + E + ": anode.", "The iron ions share one solution; Pt is the electrode.", "… || Fe³⁺(aq), Fe²⁺(aq) | Pt(s); 0.43 V."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Write <strong>two</strong> different spontaneous cells that include the hydrogen electrode and have " + Ec + " between 0.70 V and 1.00 V: one with hydrogen as the <strong>anode</strong> and one with hydrogen as the <strong>cathode</strong>. Use slots 1 and 2.",
        why:"Hydrogen is 0.00 V, so " + Ec + " is the other half-cell’s " + E + " (or its negative). As the anode, hydrogen pairs with Ag⁺/Ag (0.80 V) or Fe³⁺/Fe²⁺ (0.77 V); as the cathode, with zinc (0.76 V).",
        general:"Write one cell in slot 1 and the other in slot 2, both with the hydrogen electrode.",
        hints:["Hydrogen is 0.00 V, so " + Ec + " is just the other half-cell’s " + E + " (or its negative).", "As the anode, pair it with " + E + " from +0.70 to +1.00 V; as the cathode, with " + E + " from −0.70 to −1.00 V.", "Ag⁺/Ag (+0.80) or Fe³⁺/Fe²⁺ (+0.77) on the right; Zn (−0.76) on the left."] }
    ]
  },
  part3:{
    slug:"batteries", name:"Batteries", heading:"Batteries and fuel cells",
    intro:"Batteries and fuel cells are galvanic cells built for use. Compare three devices, sort how each one keeps going, then judge whether a fuel cell suits a remote Arctic station.",
    s1:{ title:"Station 1: Three devices, one idea",
      intro:"Each device has an anode, where something is oxidized, and a cathode, where something is reduced. Open <strong>Zoom to the particles</strong> on any card." },
    cards:[
      { id:"alk", name:"Alkaline cell", an:"Zinc is oxidized.", ca:"Manganese dioxide is reduced.",
        sum:"It runs until its reactants are used up.",
        zoom:"Zinc atoms at the anode give up electrons and become zinc ions. The electrons travel through the device to the cathode, where manganese dioxide takes them. When the zinc is used up, the cell is flat." },
      { id:"li", name:"Lithium-ion cell (concept)", an:"Lithium is oxidized to Li⁺ in the anode material.", ca:"Li⁺ ions are taken up by the cathode material.",
        sum:"Lithium ions move between the two electrodes through the electrolyte while electrons go through the device. Charging pushes them back with outside energy.",
        zoom:"While it runs, Li⁺ ions drift through the electrolyte from the anode to the cathode, and electrons take the outside path through your phone. A charger pushes both back, so the cell can be used again." },
      { id:"fc", name:"Hydrogen fuel cell", an:"H₂ → 2H⁺ + 2e⁻", ca:"O₂ + 4H⁺ + 4e⁻ → 2H₂O",
        sum:"Simplified notation: " + N("Pt(s) | H₂(g) | H⁺(aq) || H⁺(aq) | O₂(g) | Pt(s)") + ". " + Ec + " = 1.23 − 0.00 = 1.23 V. The only product is water.",
        zoom:"Hydrogen molecules split on the platinum anode into H⁺ ions and electrons. The H⁺ ions cross the electrolyte; the electrons go through the circuit. At the cathode, oxygen, H⁺ and electrons make water. Fuel keeps flowing in, so the cell keeps working." }
    ],
    s2:{ title:"Station 2: Refuel or recharge?",
      intro:"Tap a statement, then tap the device it describes.",
      items:[
        { id:"s2a", t:"Keeps running while fuel is supplied", card:"fc" },
        { id:"s2b", t:"Recharged by an outside power source", card:"li" },
        { id:"s2c", t:"Used once, then recycled", card:"alk" }
      ],
      fb:{ fc:"A fuel cell is supplied with its reactants as it runs.", li:"Charging uses outside energy to drive the reaction in reverse.", alk:"An alkaline cell stops when its stored reactants are used up." },
      done:"All three sorted. A battery stores its reactants; a fuel cell is supplied with them." },
    s3:{ title:"Station 3: Is it viable?",
      scenario:"A remote research station in Nunavut needs reliable power through the winter.",
      intro:"Choose evidence for and against a hydrogen fuel cell, then build a one-sentence judgement.",
      pros:[
        { id:"p1", t:"steady output while fuel lasts" },
        { id:"p2", t:"no combustion at the site" },
        { id:"p3", t:"water as the only local product" }],
      cons:[
        { id:"c1", t:"hydrogen must be made and shipped" },
        { id:"c2", t:"storage at low temperatures" },
        { id:"c3", t:"cost of platinum catalysts" }],
      verdicts:[{ id:"good", t:"is a good choice" }, { id:"maybe", t:"could be a good choice" }, { id:"poor", t:"is a poor choice" }],
      good:"That’s a balanced judgement: one point for, one against, and a decision.",
      need:"Choose a verdict, one point for and one point against.",
      // VERIFY: Ballard Power Systems (British Columbia) designs fuel cells for buses and backup power (plan: verify before release).
      note:"Canadian companies, such as Ballard Power Systems in British Columbia, design fuel cells for buses and backup power.",
      data:"<p>For the hydrogen–oxygen fuel cell, " + Ec + " = " + ER + " − " + EL + " = 1.23 − 0.00 = 1.23 V. Writing 2H₂ + O₂ → 2H₂O doesn’t change it: coefficients never change " + E + ".</p><p>One cell gives only about 1.2 V, so real fuel cells are <strong>stacked in series</strong>: their voltages add. Ten cells give about 12 V.</p>" },
    quickCheck:{
      title:"Quick check", summary:"Batteries quick check",
      items:[
        { id:"q1", goal:6, prompt:Ec + " of the hydrogen–oxygen fuel cell?",
          choices:[
            { t:"1.23 V", ok:true, fb:"Right. 1.23 − 0.00 = 1.23 V." },
            { t:"2.46 V", fb:"1.23 − 0.00; writing 2H₂ doesn’t double it." },
            { t:"0.00 V", fb:"1.23 − 0.00; writing 2H₂ doesn’t double it." },
            { t:"−1.23 V", fb:"1.23 − 0.00; writing 2H₂ doesn’t double it." }] },
        { id:"q2", goal:6, prompt:"Which gas is oxidized in a hydrogen fuel cell?",
          choices:[
            { t:"H₂", ok:true, fb:"Right. H₂ → 2H⁺ + 2e⁻ at the anode." },
            { t:"O₂", fb:"H₂ → 2H⁺ + 2e⁻ at the anode." },
            { t:"H₂O vapour", fb:"H₂ → 2H⁺ + 2e⁻ at the anode." },
            { t:"Both", fb:"H₂ → 2H⁺ + 2e⁻ at the anode." }] },
        { id:"q3", goal:6, prompt:"Why can a fuel cell run for weeks while a battery can’t?",
          choices:[
            { t:"Its reactants are supplied continuously", ok:true, fb:"Right. A battery stops when its stored reactants are used up." },
            { t:"It has no anode", fb:"A battery stops when its stored reactants are used up." },
            { t:"Its " + E + " grows over time", fb:"A battery stops when its stored reactants are used up." },
            { t:"It needs no electrolyte", fb:"A battery stops when its stored reactants are used up." }] },
        { id:"q4", goal:6, prompt:"A fuel-cell stack gives 12 V. Why stack cells?",
          choices:[
            { t:"Each cell gives only about 1.2 V, so cells in series add up", ok:true, fb:"Right. Voltages of cells in series add." },
            { t:"Stacking raises " + E + " of each cell", fb:"Voltages of cells in series add." },
            { t:"Stacking makes hydrogen", fb:"Voltages of cells in series add." },
            { t:"Single cells are unsafe", fb:"Voltages of cells in series add." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Notation ↔ cell", summary:"Notation ↔ cell", goal:[1, 2, 3],
        instruction:"Match each notation to the cell it describes.",
        leftTitle:"Notation", rightTitle:"Cell",
        left:PAIRS.map((p, i) => Object.assign({ id:"l" + (i + 1), t:N(p[0]), why:"Read left to right: " + p[2] }, i === 3 ? { hints:["Which side has Pt?", "The right side: the hydrogen half-cell is the cathode.", "Iron anode, hydrogen cathode."] } : {})),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        // Plan: 5 ↔ "Iron metal is the cathode" (no such card); the nearest card naming iron metal is pair 4's.
        wrong:{ "l1|r2":"The left side is the anode: zinc.", "l5|r4":"Pt is the electrode; no iron metal is present." },
        wrongDefault:"Read left to right: anode first." },
      { id:"nums", type:"custom", title:"From notation to numbers", summary:"From notation to numbers", star:true, goal:[4, 5],
        instruction:"Six items: number entry and choices. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer or tap your choice, then press Check. Voltages within 0.01 V are accepted.",
        items:[
          { id:"s1", kind:"num", goal:4, prompt:ZAG + ": " + Ec + "?", answer:1.56, tol:0.01, unit:"V", display:"1.56 V",
            wrong:[{ match:0.04, fb:"Subtract a negative: 0.80 − (−0.76)." }, { match:-1.56, fb:M1 }],
            fb:Ec + " = " + ER + " − " + EL + ".",
            why:"0.80 − (−0.76) = 1.56 V.",
            hints:["Which half-cell is on the right?", "Silver: " + ER + " = 0.80 V; zinc: " + EL + " = −0.76 V.", "0.80 − (−0.76) = 1.56 V."] },
          { id:"s2", kind:"chips", goal:5, prompt:"Same cell: balanced overall reaction?",
            options:[
              { t:"Zn + 2Ag⁺ → Zn²⁺ + 2Ag", ok:true, why:"Zn gives 2 e⁻ and each Ag⁺ takes 1, so 2Ag⁺." },
              { t:"Zn + Ag⁺ → Zn²⁺ + Ag", why:"The charge doesn’t balance: +1 on the left, +2 on the right." },
              { t:"Zn²⁺ + 2Ag → Zn + 2Ag⁺", why:"That’s the reverse: the left side, zinc, is oxidized." },
              { t:"2Zn + Ag⁺ → 2Zn²⁺ + Ag", why:"That swaps the multipliers: 4 e⁻ lost, 1 gained." }],
            hints:["How many electrons does Zn give? How many does Ag⁺ take?", "2 and 1: double the silver half-reaction.", "Zn + 2Ag⁺ → Zn²⁺ + 2Ag."] },
          { id:"s3", kind:"two", star:true, goal:4, prompt:N("Ag(s) | Ag⁺(aq) || Ni²⁺(aq) | Ni(s)") + ": " + Ec + " as written, and is it spontaneous?",
            options:[
              { t:"Not spontaneous as written", ok:true },
              { t:"Spontaneous as written", why:M4 }],
            answer:-1.06, tol:0.01, unit:"V", display:"−1.06 V; not spontaneous", label:Ec + " as written:",
            wrong:[{ match:1.06, fb:ER + " − " + EL + " = −0.26 − 0.80." }],
            fb:ER + " − " + EL + ", with nickel on the right.",
            why:"−0.26 − 0.80 = −1.06 V. Negative: as written it would not run; the reverse cell would.",
            hints:["Nickel is on the right, silver on the left.", ER + " − " + EL + " = −0.26 − 0.80.", "−1.06 V; not spontaneous as written."] },
          { id:"s4", kind:"two", star:true, goal:[4, 5], prompt:N("Al(s) | Al³⁺(aq) || Sn²⁺(aq) | Sn(s)") + ": balanced overall reaction and " + Ec + "?",
            options:[
              { t:"2Al + 3Sn²⁺ → 2Al³⁺ + 3Sn", ok:true },
              { t:"Al + Sn²⁺ → Al³⁺ + Sn", why:"Al gives 3 e⁻, Sn²⁺ takes 2: LCM 6." },
              { t:"3Al + 2Sn²⁺ → 3Al³⁺ + 2Sn", why:"That swaps the multipliers: 9 e⁻ lost, 4 gained." },
              { t:"2Al³⁺ + 3Sn → 2Al + 3Sn²⁺", why:"That’s the reverse: aluminium, on the left, is oxidized." }],
            answer:1.52, tol:0.01, unit:"V", display:"2Al + 3Sn²⁺ → 2Al³⁺ + 3Sn; 1.52 V", label:Ec + ":",
            wrong:[{ match:1.80, fb:"Subtract: −0.14 − (−1.66)." }, { match:-1.52, fb:M1 }],
            fb:Ec + " = " + ER + " − " + EL + " = −0.14 − (−1.66). Coefficients never change " + E + ".",
            why:"Electrons: 2 × 3 = 3 × 2 = 6. " + Ec + " = −0.14 − (−1.66) = 1.52 V.",
            hints:["Electrons: Al gives 3, Sn²⁺ takes 2.", "LCM 6: 2Al and 3Sn²⁺.", "2Al + 3Sn²⁺ → 2Al³⁺ + 3Sn; −0.14 − (−1.66) = 1.52 V."] },
          { id:"s5", kind:"chips", star:true, goal:4, prompt:"<strong>Investigation:</strong> A student builds " + ZH + " and reads 0.68 V instead of 0.76 V. Which change to the setup would test the best explanation?",
            options:[
              { t:"Remake the solutions at exactly 1.0 mol/L, run at 25 °C and remeasure", ok:true, why:"" + E + " values are for standard conditions: 1.0 mol/L and 25 °C. If the reading moves to 0.76 V, nonstandard conditions were the cause." },
              { t:"Use a different salt bridge", why:"The bridge doesn’t set the voltage; concentrations and temperature do." },
              { t:"Use a bigger zinc strip", why:"Electrode size doesn’t set the voltage; concentrations and temperature do." },
              { t:"Use a longer wire to the voltmeter", why:"The wire doesn’t set the voltage; concentrations and temperature do." }],
            hints:["Under what conditions are " + E + " values measured?", "Standard conditions: 1.0 mol/L solutions at 25 °C.", "Remake the solutions at exactly 1.0 mol/L, run at 25 °C and remeasure."] },
          { id:"s6", kind:"two", star:true, goal:[2, 3, 4], prompt:"Write the notation for the <strong>spontaneous</strong> cell made from Pb²⁺/Pb and Fe³⁺/Fe²⁺, and give " + Ec + ".",
            options:[
              { t:N("Pb(s) | Pb²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s)"), ok:true },
              { t:N("Pt(s) | Fe²⁺(aq), Fe³⁺(aq) || Pb²⁺(aq) | Pb(s)"), why:"Lead (−0.13 V) is lower, so it’s the anode on the left; Pt goes with the iron couple on the right." },
              { t:N("Pb(s) | Pb²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Fe(s)"), why:"There’s no iron metal in Fe³⁺ + e⁻ → Fe²⁺. " + M3 },
              { t:N("Pb(s) | Pb²⁺(aq) | Fe³⁺(aq), Fe²⁺(aq) | Pt(s)"), why:M2 }],
            answer:0.90, tol:0.01, unit:"V", display:N("Pb(s) | Pb²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s)") + "; 0.90 V", label:Ec + ":",
            wrong:[{ match:-0.90, fb:"In the spontaneous cell " + Ec + " is positive: 0.77 − (−0.13)." }, { match:0.64, fb:"Subtract a negative: 0.77 − (−0.13)." }],
            fb:Ec + " = " + ER + " − " + EL + ".",
            why:"0.77 − (−0.13) = 0.90 V.",
            hints:["Compare −0.13 V and +0.77 V.", "Lead is the anode; the iron couple needs Pt.", "0.77 − (−0.13) = 0.90 V."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Javier", how:"", goal:[2, 5],
        instruction:"Javier made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write the notation for a cell with a zinc anode and a hydrogen cathode.",
            steps:["The anode goes on the left: Zn(s) | Zn²⁺(aq).", "Add the salt bridge: ||.", "Then the cathode: H⁺(aq) || H₂(g).", "No electrode is needed for hydrogen."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is also wrong, but the <strong>first</strong> mistake is earlier."],
            fixes:[
              { t:"H⁺(aq) | H₂(g) | Pt(s): a single line between phases, and Pt at the outer end.", ok:true, why:"One || only, and the hydrogen half-cell needs Pt at the outer end: " + ZH + "." },
              { t:"H₂(g), H⁺(aq).", why:"A gas and an aqueous ion are different phases: use |." },
              { t:"Pt(s) | H⁺(aq) | H₂(g).", why:"On the right side, the electrode is at the right end." },
              { t:"Step 3 is correct.", why:"There’s only one salt bridge, so only one ||." }],
            hints:["How many double lines can a cell have?", "One.", "H⁺(aq) | H₂(g) | Pt(s)."] },
          { id:"e2", goal:5, task:"Give the overall reaction for " + ALCU + ".",
            steps:["Anode: Al → Al³⁺ + 3e⁻.", "Cathode: Cu²⁺ + 2e⁻ → Cu.", "Add them: Al + Cu²⁺ → Al³⁺ + Cu.", Ec + " = 2.00 V."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4’s value is right; the mistake is in step 3."],
            fixes:[
              { t:"Equalize electrons first (×2 and ×3): 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu.", ok:true, why:M5 },
              { t:"Al + Cu²⁺ + e⁻ → Al³⁺ + Cu.", why:"Electrons don’t stay in an overall equation." },
              { t:"3Al + 2Cu²⁺ → 3Al³⁺ + 2Cu.", why:"That swaps the multipliers: 9 e⁻ lost, 4 gained." },
              { t:"Step 3 is correct.", why:"The charge is +2 vs +3." }],
            hints:["Electrons lost vs gained?", "3 vs 2.", "LCM 6: 2Al, 3Cu²⁺."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most in Explore: that notation can describe a cell that wouldn’t run, or how much one line tells you?" },
      { id:"j2", q:"In your own words, explain why the anode is always written on the left." },
      { id:"j3", q:"Explain to a friend when a cell needs a platinum electrode, and where it goes in the notation." },
      { id:"j4", q:"Where would you use a fuel cell instead of a battery, and what would make you unsure?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In cell notation, what does a single vertical line | represent?", options:[
          { t:"A boundary between two phases", ok:true, why:"A single | marks a change of phase, such as solid | solution." },
          { t:"The salt bridge", why:"That’s ||. " + M2 },
          { t:"The wire", why:"The wire isn’t written." },
          { t:"An electrode", why:"Electrodes are written as species, such as Cu(s)." }] },
        b:{ prompt:"In cell notation, what does || represent?", options:[
          { t:"The salt bridge", ok:true, why:"The double line is the bridge; exactly one per cell." },
          { t:"A phase boundary", why:M2 },
          { t:"Two electrodes", why:"Electrodes are at the ends." },
          { t:"The voltmeter", why:"Not written." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Where is the anode written in cell notation?", options:[
          { t:"On the left", ok:true, why:"By convention the anode is on the left, the cathode on the right." },
          { t:"On the right", why:M1 },
          { t:"In the middle, beside ||", why:"The bridge is in the middle." },
          { t:"Either side, as long as it’s labelled", why:"The position <em>is</em> the label." }] },
        b:{ prompt:"In " + NIAG + ", which electrode is the cathode?", options:[
          { t:"Ag", ok:true, why:"The cathode is on the right." },
          { t:"Ni", why:M1 },
          { t:"Ni²⁺", why:"Ni²⁺ is in the anode solution." },
          { t:"The salt bridge", why:"The bridge isn’t an electrode." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Why does Pt(s) appear in " + HCU + "?", options:[
          { t:"The hydrogen half-cell has no solid metal of its own; Pt is an inert surface for the electron transfer", ok:true, why:"Pt carries the electrons without reacting." },
          { t:"Pt is oxidized at the anode", why:"Pt doesn’t react." },
          { t:"Pt is part of the salt bridge", why:"The bridge is ||." },
          { t:"Pt makes the hydrogen gas", why:"H₂ is supplied." }] },
        b:{ prompt:"Which half-cell needs an inert electrode?", options:[
          { t:"Fe³⁺/Fe²⁺", ok:true, why:"No metal in Fe³⁺ + e⁻ → Fe²⁺." },
          { t:"Cu²⁺/Cu", why:"Copper metal is the electrode." },
          { t:"Zn²⁺/Zn", why:"Zinc metal is the electrode." },
          { t:"Ag⁺/Ag", why:"Silver metal is the electrode." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"What is " + Ec + " for " + ZAG + "?", options:[
          { t:"1.56 V", ok:true, why:"0.80 − (−0.76)." },
          { t:"0.04 V", why:"0.80 − 0.76 drops the negative sign." },
          { t:"−1.56 V", why:"The right side is the cathode. " + M1 },
          { t:"2.36 V", why:"Don’t double silver’s " + E + "." }] },
        b:{ prompt:"What is " + Ec + " for " + N("Fe(s) | Fe²⁺(aq) || Cu²⁺(aq) | Cu(s)") + "?", options:[
          { t:"0.79 V", ok:true, why:"0.34 − (−0.45)." },
          { t:"−0.11 V", why:"That adds 0.34 and −0.45." },
          { t:"−0.79 V", why:M1 },
          { t:"0.45 V", why:"That’s only iron’s value, without the sign." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:N("Cu(s) | Cu²⁺(aq) || Ni²⁺(aq) | Ni(s)") + ", as written: what are " + Ec + " and its meaning?", options:[
          { t:"−0.60 V; not spontaneous as written", ok:true, why:"−0.26 − 0.34." },
          { t:"+0.60 V; spontaneous", why:M4 },
          { t:"−0.60 V; spontaneous", why:"A negative " + Ec + " means not spontaneous." },
          { t:"+0.08 V; spontaneous", why:"That adds the values." }] },
        b:{ prompt:N("Ag(s) | Ag⁺(aq) || H⁺(aq) | H₂(g) | Pt(s)") + ", as written: what are " + Ec + " and its meaning?", options:[
          { t:"−0.80 V; not spontaneous as written", ok:true, why:"0.00 − 0.80." },
          { t:"+0.80 V; spontaneous", why:M4 },
          { t:"0.00 V; at equilibrium", why:"Only hydrogen is 0.00 V." },
          { t:"−0.80 V; spontaneous", why:"Negative means not spontaneous." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"What is the balanced overall reaction for " + ALCU + "?", options:[
          { t:"2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu", ok:true, why:"6 electrons lost and 6 gained." },
          { t:"Al + Cu²⁺ → Al³⁺ + Cu", why:M5 },
          { t:"3Al + 2Cu²⁺ → 3Al³⁺ + 2Cu", why:"The multipliers are swapped." },
          { t:"2Al³⁺ + 3Cu → 2Al + 3Cu²⁺", why:"That’s the reverse. " + M1 }] },
        b:{ prompt:"What is the balanced overall reaction for " + CFE + "?", options:[
          { t:"Cu + 2Fe³⁺ → Cu²⁺ + 2Fe²⁺", ok:true, why:"Cu gives 2 e⁻; each Fe³⁺ takes 1." },
          { t:"Cu + Fe³⁺ → Cu²⁺ + Fe²⁺", why:"Electrons lost must equal electrons gained: Cu gives 2, Fe³⁺ takes 1, so use 2Fe³⁺." },
          { t:"Cu + Fe²⁺ → Cu²⁺ + Fe", why:"No iron metal forms. " + M3 },
          { t:"Cu + 2Fe³⁺ → Cu²⁺ + 2Fe", why:"Fe³⁺ is reduced to Fe²⁺, not to iron metal. " + M3 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which notation describes a cell with a magnesium anode and a nickel cathode?", options:[
          { t:N("Mg(s) | Mg²⁺(aq) || Ni²⁺(aq) | Ni(s)"), ok:true, why:"Anode on the left, one || in the middle, electrodes at the ends." },
          { t:N("Ni(s) | Ni²⁺(aq) || Mg²⁺(aq) | Mg(s)"), why:M1 },
          { t:N("Mg(s) | Mg²⁺(aq) | Ni²⁺(aq) | Ni(s)"), why:"The bridge needs ||. " + M2 },
          { t:N("Mg²⁺(aq) | Mg(s) || Ni(s) | Ni²⁺(aq)"), why:"Electrodes go at the outer ends." }] },
        b:{ prompt:"Which notation describes a cell with a zinc anode and a hydrogen cathode?", options:[
          { t:ZH, ok:true, why:"Zinc on the left; the hydrogen half-cell on the right, with Pt at the outer end." },
          { t:N("Zn(s) | Zn²⁺(aq) || H⁺(aq) | H₂(g)"), why:"The cathode needs an electrode. " + M3 },
          { t:N("Pt(s) | H₂(g) | H⁺(aq) || Zn²⁺(aq) | Zn(s)"), why:M1 },
          { t:N("Zn(s) | Zn²⁺(aq) || H⁺(aq), H₂(g) | Pt(s)"), why:"A gas and a dissolved ion are different phases." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Why are H₂ and H⁺ separated by | in one cell, while Fe³⁺ and Fe²⁺ are separated by a comma in another?", options:[
          { t:"“H₂ is a gas and H⁺ is dissolved, so they’re in different phases; Fe³⁺ and Fe²⁺ are both in the same solution.”", ok:true, why:M6 },
          { t:"“Hydrogen is lighter than iron.”", why:"Mass isn’t the rule." },
          { t:"“Commas are only used for metals.”", why:"Commas join species in one phase." },
          { t:"“It’s a matter of style.”", why:"The symbols have fixed meanings." }] },
        b:{ prompt:"Why is Pt written at the far right of " + CFE + "?", options:[
          { t:"“Electrodes are written at the outer ends. Pt is the cathode’s electrode, so it goes at the right end.”", ok:true, why:"The iron couple is the cathode, and its electrode is Pt." },
          { t:"“Pt is the most reactive species.”", why:"Pt is inert." },
          { t:"“Pt must always be last in any notation.”", why:"Pt goes at whichever end needs it." },
          { t:"“Pt replaces the salt bridge.”", why:"The bridge is ||." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"What is " + Ec + " for a hydrogen–oxygen fuel cell (O₂ + 4H⁺ + 4e⁻ → 2H₂O, +1.23 V)?", options:[
          { t:"1.23 V", ok:true, why:"1.23 − 0.00." },
          { t:"2.46 V", why:"Coefficients don’t change " + E + "." },
          { t:"0.00 V", why:"That’s only the hydrogen electrode." },
          { t:"−1.23 V", why:"O₂ is reduced at the cathode." }] },
        b:{ prompt:"In a hydrogen fuel cell, which gas reacts at the anode?", options:[
          { t:"H₂", ok:true, why:"H₂ → 2H⁺ + 2e⁻." },
          { t:"O₂", why:"O₂ is reduced at the cathode." },
          { t:"Water vapour", why:"Water is the product." },
          { t:"Both gases", why:"Each gas reacts at its own electrode." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A remote weather station in Nunavut needs power for months without being visited. Which point best supports a fuel cell over a single non-rechargeable battery?", options:[
          { t:"“A fuel cell keeps working while fuel is supplied from a tank; a battery stops when its stored reactants are used up.”", ok:true, why:"A battery stores its reactants; a fuel cell is supplied with them." },
          { t:"“Fuel cells have no anode.”", why:"They do." },
          { t:"“Fuel cells release carbon dioxide at the site.”", why:"A hydrogen fuel cell’s product is water." },
          { t:"“A battery’s voltage increases with time.”", why:"It falls as the reactants are used up." }] },
        b:{ prompt:"Which statement about rechargeable lithium-ion cells is accurate?", options:[
          { t:"“Charging uses outside energy to drive the cell’s reaction in reverse.”", ok:true, why:"That’s what recharging means." },
          { t:"“They never wear out.”", why:"Capacity slowly falls over many cycles." },
          { t:"“Their voltage comes from burning lithium.”", why:"It comes from a redox reaction, not burning." },
          { t:"“They don’t need an anode or cathode.”", why:"Every cell has both." }] } }
    ]
  },
  task:{
    title:"One platinum, under a volt", summary:"One platinum, under a volt",
    statement:"<p>Design a cell by choosing the left (anode) and right (cathode) half-cells. The translator writes its notation. Can you find every design that works?</p><ol class=\"cn-conds\"><li>It is spontaneous as written: " + ER + " − " + EL + " &gt; 0.</li><li>It uses exactly <strong>one</strong> platinum electrode.</li><li>0.40 V ≤ " + Ec + " ≤ 0.80 V.</li><li>The notation is written correctly (format check passes). Confirm it with tiles.</li></ol>",
    checks:["Spontaneous as written", "Exactly one Pt", "Between 0.40 V and 0.80 V", "Notation correct"],
    tips:["The cathode must be higher in the table than the anode.", "Pair one metal half-cell with one Pt half-cell.", "The hydrogen electrode is 0.00 V, so " + Ec + " is the metal’s " + E + " or its negative.", "Pt goes at the outer end of the side it belongs to."],
    explainPrompt:"Explain how you placed each half-cell and why your cell needs exactly one platinum electrode.",
    vocab:"Use anode, cathode, inert electrode, phase boundary and E°cell.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"The hydrogen electrode can sit on either side. What matters is which half-cell is higher in the table.",
    afterAt:4
  },
  cards:[
    ["Cell notation order", "anode | anode solution || cathode solution | cathode"],
    ["|", "A boundary between phases (solid | solution, gas | solution)."],
    ["||", "The salt bridge; exactly one per cell."],
    ["Comma", "Separates species in the <strong>same</strong> solution: Fe³⁺(aq), Fe²⁺(aq)."],
    ["Inert electrode", "Pt (or graphite) at the outer end when a half-cell has no metal of its own."],
    [Ec + " from notation", ER + " − " + EL + "."],
    ["Negative " + Ec, "The cell as written isn’t spontaneous; swap the sides."],
    ["Hydrogen electrode", "Pt(s) | H₂(g) | H⁺(aq) as an anode; H⁺(aq) | H₂(g) | Pt(s) as a cathode."],
    ["Overall reaction", "Equalize electrons: Al | Al³⁺ || Cu²⁺ | Cu gives 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu."],
    ["Fuel cell", "Galvanic cell fed continuously with fuel; H₂/O₂ gives 1.23 V and water."],
    ["Battery vs fuel cell", "A battery stores its reactants; a fuel cell is supplied with them."]
  ]
};
