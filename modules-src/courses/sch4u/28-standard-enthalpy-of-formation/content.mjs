// SCH4U 28 Standard Enthalpy of Formation. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/28-standard-enthalpy-of-formation.md
// Pictures (hero ladder, the C4 formation ladder in its three modes, the Part 3 stations, the task tank) are drawn by
// app.js. Every ΔH°f value the app computes with comes from MV.chem.data.dHf; values typed below are the plan's wording.

const Hf = "Δ<i>H</i>°<sub>f</sub>";
const Hr = "Δ<i>H</i>°<sub>rxn</sub>";
const Hc = "Δ<i>H</i>°<sub>c</sub>";
const DH = "Δ<i>H</i>";
const X = "<i>x</i>";
const SP = "Σ<i>n</i>" + Hf + "(products)";
const SR = "Σ<i>n</i>" + Hf + "(reactants)";

// Misconception core sentences (plan §3)
const M1 = "O₂(g) is an element in its standard state: " + Hf + " = 0. It adds nothing to either sum.";
const M2 = "Products minus reactants: " + Hr + " = " + SP + " − " + SR + ".";
const M3 = "Two moles of water means 2 × (−285.8).";
const M4 = "Check the state. H₂O(l) −285.8; H₂O(g) −241.8.";
const M5 = "A formation equation makes exactly 1 mol of product, from elements only; fractions are fine.";
const M6 = "Divide by what the question asks about: grams of fuel, or moles of CO₂.";
const M7 = "Write the full equation with " + X + ", then solve. Check that substituting back gives the given " + Hr + ".";

// "Use these values" boxes for Final Check calculations (values as printed in the course table, MV.chem.data.dHf)
const U = (s) => "Course table, " + Hf + " (kJ/mol): " + s + ". Elements in their standard states: 0.";

// Practice 1 hints (plan: the same first two for every item)
const S1 = "Is exactly 1 mol of one compound made?";
const S2 = "Are all the reactants elements in their standard states?";

export default {
  id:"28-standard-enthalpy-of-formation",
  kind:"topic",
  title:"Standard enthalpy of formation",
  topic:"Standard Enthalpy of Formation",
  readyTopic:"standard enthalpies of formation",
  hero:{
    eq:'<span class="nw">' + Hr + " =</span> <span class=\"nw\">" + SP + "</span> <span class=\"nw\">− " + SR + "</span>", eqSize:"sm",
    eqLabel:"Delta H naught reaction equals the sum of n times delta H naught f of the products, minus the sum of n times delta H naught f of the reactants",
    headline:"One table, every reaction.",
    text:"Every compound has a <strong>standard enthalpy of formation</strong>: the " + DH + " to make 1 mol of it from its <strong>elements</strong>. Elements sit at <strong>zero</strong>. To find any reaction’s " + DH + ", take the reactants back to elements, then build the products. The <strong>coefficients</strong> count how many times.",
    fig:{ html:'<div class="sf-hx"><svg class="sf-hx-svg" id="sf-hx-svg" viewBox="0 0 480 340" role="img" aria-label="An enthalpy ladder. A dashed floor at 0 kJ/mol is labelled elements: C(s), H2(g), O2(g). Below it, methane’s rung sits at −74.6. On the product side, CO2 sits at −393.5 and two water rungs drop a further −571.6, to −965.1. An orange arrow lifts methane up to the floor (+74.6); orange arrows drop CO2 (−393.5) and 2H2O (−571.6). The net arrow from CH4 + 2O2 down to CO2 + 2H2O is labelled −890.5 kJ."></svg><div class="sf-hx-row"><p class="sf-hx-ctr" id="sf-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="sf-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain what a standard enthalpy of formation is and why elements in their standard states have a value of 0.",
    "I can write the formation equation for a compound.",
    "I can calculate " + Hr + " = " + SP + " − " + SR + ".",
    "I can use the correct states and coefficients from a balanced equation.",
    "I can work backwards from a known " + Hr + " to an unknown " + Hf + ".",
    "I can compare fuels and energy technologies using energy and CO₂ data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Standard states", goal:1,
          prompt:"What is the standard state of oxygen at SATP?",
          options:[
            { t:"O₂(g)", ok:true, why:"Oxygen exists as diatomic gas at 25 °C and 100 kPa." },
            { t:"O(g)", why:"Single atoms: oxygen atoms pair up as O₂." },
            { t:"O₂(l)", why:"Oxygen is a liquid only far below 0 °C." },
            { t:"O₃(g)", why:"Ozone is a different, less stable form." }],
          hints:["What form is oxygen in the air?", "Diatomic gas.", "O₂(g)."] },
        { id:"w2", skill:"Standard states", goal:1,
          prompt:"Which form of carbon is the standard state used in " + Hf + " tables?",
          options:[
            { t:"C(s, graphite)", ok:true, why:"Graphite is carbon’s most stable form at SATP." },
            { t:"C(g)", why:"Carbon is a solid at SATP." },
            { t:"C(s, diamond)", why:"Diamond is a less stable form (its " + Hf + " isn’t zero)." },
            { t:"CO₂(g)", why:"That’s a compound." }],
          hints:["Elements, in their most stable form at SATP.", "Carbon is a solid.", "Graphite."] },
        { id:"w3", skill:"Balancing combustion", goal:4,
          prompt:"Balance CH₄(g) + __O₂(g) → CO₂(g) + __H₂O(l).",
          options:[
            { t:"2 and 2", ok:true, why:"C: 1 = 1; H: 4 = 4; O: 4 = 2 + 2." },
            { t:"1 and 2", why:"Count O: the right side has 4." },
            { t:"2 and 1", why:"H: 4 needs 2 H₂O." },
            { t:"3 and 2", why:"O: left 6, right 4." }],
          hints:["Balance C, then H, then O.", "H: 2H₂O.", "O: 2O₂."] },
        { id:"w4", skill:"Balancing combustion", goal:4,
          prompt:"Balance C₃H₈(g) + __O₂(g) → __CO₂(g) + __H₂O(l).",
          options:[
            { t:"5, 3, 4", ok:true, why:"C 3; H 8 → 4 H₂O; O 6 + 4 = 10 → 5 O₂." },
            { t:"3, 3, 4", why:"O: right side has 10 atoms." },
            { t:"5, 3, 8", why:"H: 8 atoms → 4 water." },
            { t:"7, 3, 4", why:"O: 7 × 2 = 14, not 10." }],
          hints:["C first: 3CO₂.", "H: 4H₂O.", "O: 6 + 4 = 10, so 5O₂."] },
        { id:"w5", skill:"Hess moves", goal:3,
          prompt:"H₂(g) + ½O₂(g) → H₂O(l) has " + DH + " = −285.8 kJ. What is " + DH + " for H₂O(l) → H₂(g) + ½O₂(g)?",
          options:[
            { t:"+285.8 kJ", ok:true, why:"Reversed: flip the sign." },
            { t:"−285.8 kJ", why:"Reversing flips the sign." },
            { t:"+571.6 kJ", why:"No doubling." },
            { t:"0 kJ", why:"Decomposing water absorbs energy." }],
          hints:["Reverse the equation.", "Flip the sign.", "+285.8 kJ."] },
        { id:"w6", skill:"Molar mass", goal:6,
          prompt:"Using C 12.01 and H 1.01 g/mol, what is the molar mass of CH₄?",
          options:[
            { t:"16.05 g/mol", ok:true, why:"12.01 + 4(1.01)." },
            { t:"13.02 g/mol", why:"Four hydrogens, not one." },
            { t:"52.08 g/mol", why:"That multiplies carbon by 4." },
            { t:"17.06 g/mol", why:"Four hydrogens: 4 × 1.01 = 4.04, not 5.05." }],
          hints:["Add the atoms’ molar masses.", "12.01 + 4.04.", "16.05 g/mol."] }
      ],
      refreshers:{
        "Standard states":"At SATP: O₂(g), H₂(g), N₂(g), Cl₂(g), C(s, graphite), metals as solids. Their " + Hf + " = 0.",
        "Balancing combustion":"Balance C, then H, then O last; a fraction like 3½O₂ is fine for 1 mol of fuel.",
        "Hess moves":"Reverse means flip the sign; scale by <i>k</i> means multiply " + DH + " by <i>k</i>.",
        "Molar mass":"Add the atomic molar masses from the course table."
      }
    }
  },
  explore:{
    heading:"Formation ladder",
    intro:"Elements are the ground floor. Take the reactants up to it, then build the products down.",
    how:"Choose a mode. In <strong>Ladder</strong>, pick a reaction and step through it. In <strong>Build your own</strong>, tap species to add them, set the coefficients and balance the equation. In the <strong>Formation equation writer</strong>, make exactly 1 mol of a compound from element chips.",
    modes:[{ id:"lad", t:"Ladder" }, { id:"build", t:"Build your own" }, { id:"form", t:"Formation equation writer" }],
    reactions:[
      { id:"R1", r:[[1, "CH4(g)"], [2, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(l)"]] },
      { id:"R2", r:[[1, "C3H8(g)"], [5, "O2(g)"]], p:[[3, "CO2(g)"], [4, "H2O(l)"]] },
      { id:"R3", r:[[2, "CO(g)"], [1, "O2(g)"]], p:[[2, "CO2(g)"]] },
      { id:"R4", r:[[1, "CaCO3(s)"]], p:[[1, "CaO(s)"], [1, "CO2(g)"]] },
      { id:"R5", r:[[2, "NO(g)"], [1, "O2(g)"]], p:[[2, "NO2(g)"]] },
      { id:"R6", r:[[1, "C6H12O6(s)"], [6, "O2(g)"]], p:[[6, "CO2(g)"], [6, "H2O(l)"]] }
    ],
    steps:["Take reactants to elements", "Build products", "Show net"],
    // Build palette: the course ΔH°f table (MV.chem.data.dHf, without the OH⁻(aq) ion) plus these elements (ΔH°f = 0).
    elements:["O2(g)", "H2(g)", "N2(g)", "C(s)", "Cl2(g)", "Ca(s)", "Fe(s)", "Na(s)", "Al(s)", "Mg(s)"],
    hideSp:"CH3OH(l)", hideGiven:-725.9,
    // Formation writer chips (plan list), plus single atoms H, O and N so that the named wrong state "2C + 6H + O" can be built.
    chips:[{ id:"C(s)" }, { id:"H2(g)" }, { id:"O2(g)" }, { id:"N2(g)" }, { id:"Ca(s)" }, { id:"Fe(s)" }, { id:"Na(s)" }, { id:"Cl2(g)" },
      { id:"H(g)", atom:true }, { id:"O(g)", atom:true }, { id:"N(g)", atom:true }],
    tableNote:"Values from the course table. Elements in their standard states sit on the 0 kJ/mol floor.",
    predictions:[
      { id:"p1", prompt:"Ladder mode, R1, before stepping. What is " + Hf + " for O₂(g)?",
        options:[{ t:"0 kJ/mol", ok:true }, { t:"−498 kJ/mol" }, { t:"+249 kJ/mol" }, { t:"It depends on the reaction" }],
        explain:"Elements in their standard states are the reference: zero." },
      { id:"p2", prompt:"Formation equation writer, H₂O(l). Which is the formation equation of liquid water?",
        options:[{ t:"H₂(g) + ½O₂(g) → H₂O(l)", ok:true }, { t:"2H₂(g) + O₂(g) → 2H₂O(l)" }, { t:"H₂O(g) → H₂O(l)" }, { t:"2H(g) + O(g) → H₂O(l)" }],
        explain:"Exactly 1 mol of product, from elements in their standard states." },
      { id:"p3", prompt:"R4, CaCO₃(s) → CaO(s) + CO₂(g). Is the decomposition of limestone exothermic or endothermic?",
        options:[{ t:"Endothermic", ok:true }, { t:"Exothermic" }, { t:"Neither" }, { t:"Can’t tell without bond energies" }],
        explain:"The products are higher on the ladder, so energy must be added. Kilns burn fuel to supply it." },
      { id:"p4", prompt:"R1, then switch the water to H₂O(g). With water vapour as the product, " + Hc + " becomes…",
        options:[{ t:"Less negative (−802.5 kJ)", ok:true }, { t:"More negative" }, { t:"The same" }, { t:"Positive" }],
        explain:"Vapour holds 44.0 kJ/mol more than liquid, so less energy is released." }
    ],
    chalIntro:"Use the ladder to meet each goal, then press <strong>Check challenge</strong>. Challenges 1 and 3 use <strong>Build your own</strong>; challenge 2 uses the <strong>Formation equation writer</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Build your own: find " + Hc + " for propane burning to CO₂(g) and H₂O(l).",
        why:"C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l): 3(−393.5) + 4(−285.8) − (−103.8) = −2219.9 kJ per mole of C₃H₈.",
        general:"In <strong>Build your own</strong>, add C₃H₈(g) and O₂(g) as reactants and CO₂(g) and H₂O(l) as products, then balance.",
        hints:["Balance first: 1, 5, 3, 4.", "Products: 3(−393.5) + 4(−285.8) = −2323.7.", "−2323.7 − (−103.8) = −2219.9 kJ."] },
      { id:"tc2", goal:2, prompt:"Formation equation writer: write the formation equation for ethanol, C₂H₅OH(l).",
        why:"2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l): exactly 1 mol of ethanol, from elements in their standard states.",
        general:"Pick C₂H₅OH(l), then add element chips until the atoms balance for exactly 1 mol of ethanol.",
        hints:["Count the atoms in one ethanol: 2 C, 6 H, 1 O.", "6 H atoms = 3H₂; 1 O atom = ½O₂.", "2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l)."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Methanol burns: CH₃OH(l) + 1½O₂(g) → CO₂(g) + 2H₂O(l), " + Hc + " = −725.9 kJ. Hide methanol’s value in the palette, then use the ladder to find " + Hf + "(CH₃OH).",
        why:"−725.9 = −965.1 − " + X + ", so " + X + " = −239.2 kJ/mol, matching the course table.",
        general:"In <strong>Build your own</strong>, turn on <strong>Hide CH₃OH(l)’s value</strong>, build the combustion, step through the ladder and enter your value for " + X + ".",
        hints:["Products: −393.5 + 2(−285.8) = −965.1.", "−725.9 = −965.1 − " + X + ".", X + " = −965.1 + 725.9 = −239.2 kJ/mol, matching the course table."] }
    ]
  },
  part3:{
    slug:"technologies", name:"Technologies", heading:"Energy technologies",
    intro:"One table of " + Hf + " values gives the energy of every fuel. Compare fuels three ways, weigh up power options, and check the hidden CO₂ cost of making lime.",
    s1:{ title:"Station 1: Fuel comparison",
      intro:"The table is computed from the course " + Hf + " values, with liquid water. Rank the fuels three ways: tap them from <strong>most</strong> energy to <strong>least</strong>, then press Check.",
      // Molar masses: the plan's "use these values" column (rounded), a course table addition for this station.
      fuels:[
        { id:"H2", f:"H2(g)", M:2.0, r:[[1, "H2(g)"], [0.5, "O2(g)"]], p:[[1, "H2O(l)"]] },
        { id:"CH4", f:"CH4(g)", M:16.0, r:[[1, "CH4(g)"], [2, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(l)"]] },
        { id:"C3H8", f:"C3H8(g)", M:44.1, r:[[1, "C3H8(g)"], [5, "O2(g)"]], p:[[3, "CO2(g)"], [4, "H2O(l)"]] },
        { id:"CH3OH", f:"CH3OH(l)", M:32.0, r:[[1, "CH3OH(l)"], [1.5, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(l)"]] },
        { id:"C2H5OH", f:"C2H5OH(l)", M:46.1, r:[[1, "C2H5OH(l)"], [3, "O2(g)"]], p:[[2, "CO2(g)"], [3, "H2O(l)"]] }
      ],
      ranks:[{ id:"mol", t:"Per mole of fuel" }, { id:"g", t:"Per gram of fuel" }, { id:"co2", t:"Per mole of CO₂ released (carbon fuels)" }],
      note:"These use liquid water, so they’re a little higher than module 26’s gas-phase estimates.",
      good:"Right. The three rankings differ: the best fuel depends on what you divide by.",
      bad:M6 },
    s2:{ title:"Station 2: Power options",
      intro:"Each power option has benefits and drawbacks. For each card, tap one benefit and one drawback.",
      benefits:[{ id:"low", t:"low CO₂ in operation" }, { id:"dem", t:"runs on demand, day or night" }],
      // VERIFY: "hydrogen production may use natural gas" (plan Station 2, verify before release).
      drawbacks:[{ id:"burn", t:"burns fuel continuously" }, { id:"wx", t:"depends on weather" }, { id:"flood", t:"floods land" },
        { id:"h2", t:"hydrogen production may use natural gas" }, { id:"heat", t:"efficiency is limited by heat loss" }],
      cards:[
        { id:"gas", t:"Natural-gas power plant", answer:{ b:["dem"], d:["burn", "heat"] } },
        { id:"hydro", t:"Hydro dam", answer:{ b:["low", "dem"], d:["flood"] } },
        { id:"wind", t:"Wind farm", answer:{ b:["low"], d:["wx"] } },
        { id:"solar", t:"Solar panels", answer:{ b:["low"], d:["wx"] } },
        { id:"fc", t:"Hydrogen fuel cell", answer:{ b:["low", "dem"], d:["h2"] } }
      ],
      // VERIFY: Ontario electricity mix (plan Station 2 note, verify before release).
      note:"Ontario’s electricity comes mostly from nuclear and hydro power, with natural gas, wind and solar making up the rest. The mix changes from year to year." },
    s3:{ title:"Station 3: Check it with data, the lime kiln",
      intro:"The kiln reaction, CaCO₃(s) → CaO(s) + CO₂(g), needs +179.2 kJ per mol, supplied by burning methane (890.5 kJ/mol).",
      q1:{ prompt:"About how much methane per mole of CaCO₃?",
        options:[{ t:"about 0.2 mol", ok:true, why:"179.2 ÷ 890.5 ≈ 0.20 mol of methane." },
          { t:"1 mol", why:"1 mol of methane gives 890.5 kJ, about five times what one mole of CaCO₃ needs. Divide: 179.2 ÷ 890.5." },
          { t:"5 mol", why:"Divide the energy needed by the energy per mole: 179.2 ÷ 890.5, not 890.5 ÷ 179.2." },
          { t:"0.02 mol", why:"Check the decimal: 179.2 ÷ 890.5 ≈ 0.20." }] },
      q2:{ prompt:"So about how much CO₂ in total per mole of CaCO₃?",
        options:[{ t:"about 1.2 mol", ok:true, why:"1 mol from the limestone plus about 0.2 mol from the fuel." },
          { t:"1 mol", why:"That counts only the limestone’s CO₂. Burning the methane makes CO₂ too." },
          { t:"0.2 mol", why:"That counts only the fuel’s CO₂. The limestone itself gives off 1 mol." },
          { t:"2 mol", why:"Each mole of methane makes 1 mol CO₂, and you burn only about 0.2 mol: 1 + 0.2." }] },
      done:"1 mol from the limestone itself plus about 0.2 mol from the fuel. That’s why making lime and cement is a major CO₂ source." },
    quickCheck:{
      title:"Quick check", summary:"Energy technologies quick check",
      items:[
        { id:"q1", goal:6, prompt:"Per gram, the best fuel in the table is…",
          choices:[
            { t:"H₂", ok:true, fb:"Right. 143 kJ/g." },
            { t:"CH₄", fb:"143 kJ/g." },
            { t:"C₃H₈", fb:"143 kJ/g." },
            { t:"C₂H₅OH", fb:"143 kJ/g." }] },
        { id:"q2", goal:6, prompt:"Per mole of CO₂ released, the best carbon fuel is…",
          choices:[
            { t:"CH₄", ok:true, fb:"Right. 890.5 kJ per mol CO₂." },
            { t:"C₃H₈", fb:"890.5 kJ per mol CO₂. " + M6 },
            { t:"CH₃OH", fb:"890.5 kJ per mol CO₂. " + M6 },
            { t:"C₂H₅OH", fb:"890.5 kJ per mol CO₂. " + M6 }] },
        { id:"q3", goal:6, prompt:"Why isn’t ‘zero CO₂’ the whole story for hydrogen?",
          choices:[
            { t:"It must be produced, often using fossil fuels", ok:true, fb:"Right. Look at the whole life cycle." },
            { t:"It releases CO₂ when burned", fb:"Look at the whole life cycle." },
            { t:"It has no energy", fb:"Look at the whole life cycle." },
            { t:"It’s a solid", fb:"Look at the whole life cycle." }] },
        { id:"q4", goal:6, prompt:"<strong>Investigation:</strong> A lab measures −850 kJ/mol for methane’s combustion; the table gives −890.5. The most likely reason?",
          choices:[
            { t:"Heat lost to the surroundings", ok:true, fb:"Right. Lost heat makes measured values less negative." },
            { t:"The table is wrong", fb:"Lost heat makes measured values less negative." },
            { t:"Methane is endothermic", fb:"Lost heat makes measured values less negative." },
            { t:"Too much oxygen", fb:"Lost heat makes measured values less negative." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Is it a formation equation?", summary:"Formation equation sort", goal:[1, 2], noun:"equation",
        instruction:"Eight equations. Sort each one: is it a formation equation or not?",
        boxes:[{ id:"f", label:"Formation equation" }, { id:"n", label:"Not a formation equation" }],
        wrongDefault:"1 mol, from elements in their standard states.",
        items:[
          { id:"i1", goal:2, t:"H₂(g) + ½O₂(g) → H₂O(l)", answer:"f", why:"Exactly 1 mol of H₂O(l), from H₂(g) and O₂(g).",
            wrong:{ n:"1 mol, from elements in their standard states." }, hints:[S1, S2, "Formation: 1 mol of H₂O(l), from H₂(g) and O₂(g)."] },
          { id:"i2", goal:2, t:"2H₂(g) + O₂(g) → 2H₂O(l)", answer:"n", why:"It makes 2 mol, not 1.",
            wrong:{ f:"It makes 2 mol. " + M5 }, hints:[S1, S2, "Not a formation equation: it makes 2 mol of water."] },
          { id:"i3", goal:2, t:"C(s) + O₂(g) → CO₂(g)", answer:"f", why:"1 mol of CO₂(g), from C(s) and O₂(g).",
            wrong:{ n:"1 mol of CO₂(g), from C(s, graphite) and O₂(g): both elements in their standard states." }, hints:[S1, S2, "Formation: 1 mol of CO₂(g), from C(s) and O₂(g)."] },
          { id:"i4", goal:2, t:"CO(g) + ½O₂(g) → CO₂(g)", answer:"n", why:"CO is a compound, not an element.",
            wrong:{ f:"CO isn’t an element. " + M5 }, hints:[S1, S2, "Not a formation equation: CO(g) is a compound."] },
          { id:"i5", goal:2, t:"½N₂(g) + 1½H₂(g) → NH₃(g)", answer:"f", why:"1 mol of NH₃(g), from N₂(g) and H₂(g). Fractions are fine.",
            wrong:{ n:"Fractions are fine." }, hints:[S1, S2, "Formation: 1 mol of NH₃(g); the fractions are fine."] },
          { id:"i6", goal:2, t:"Na(s) + ½Cl₂(g) → NaCl(s)", answer:"f", why:"1 mol of NaCl(s), from Na(s) and Cl₂(g).",
            wrong:{ n:"1 mol of NaCl(s), from Na(s) and Cl₂(g): both elements in their standard states." }, hints:[S1, S2, "Formation: 1 mol of NaCl(s), from Na(s) and Cl₂(g)."] },
          { id:"i7", goal:1, t:"H₂O(l) → H₂(g) + ½O₂(g)", answer:"n", why:"That’s decomposition, the reverse of formation.",
            wrong:{ f:"That’s decomposition, the reverse." }, hints:[S1, S2, "Not a formation equation: it’s the reverse, decomposition."] },
          { id:"i8", goal:2, t:"2Fe(s) + 1½O₂(g) → Fe₂O₃(s)", answer:"f", why:"1 mol of Fe₂O₃(s), from Fe(s) and O₂(g).",
            wrong:{ n:"1 mol of Fe₂O₃." }, hints:[S1, S2, "Formation: 1 mol of Fe₂O₃(s), from Fe(s) and O₂(g)."] }
        ] },
      { id:"calc", type:"custom", title:Hf + " calculations", summary:"ΔH°f calculations", star:true, goal:[3, 4, 5, 6],
        instruction:"Six calculations. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer, then press Check. Answers within 0.1 kJ are accepted. The course table is open above the items.",
        items:[
          { id:"f1", goal:3, prompt:"Find " + Hr + " for 2CO(g) + O₂(g) → 2CO₂(g).", answer:-566.0, unit:"kJ", display:"−566.0 kJ",
            wrong:[{ match:-283.0, fb:"Multiply by the coefficients: two moles of CO₂ means 2 × (−393.5), and two of CO means 2 × (−110.5)." },
              { match:566.0, fb:M2 }],
            fb:M2 + " Multiply each value by its coefficient.",
            why:"[2(−393.5)] − [2(−110.5) + 0] = −787.0 − (−221.0) = −566.0 kJ.",
            hints:["Products: 2(−393.5) = −787.0.", "Reactants: 2(−110.5) + 0 = −221.0.", "−787.0 − (−221.0) = −566.0 kJ."] },
          { id:"f2", goal:4, prompt:"Find " + Hr + " for C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(g).", answer:-2043.9, unit:"kJ", display:"−2043.9 kJ",
            wrong:[{ match:-2219.9, fb:"Water vapour here. " + M4 }],
            fb:M2 + " Check the states and coefficients.",
            why:"[3(−393.5) + 4(−241.8)] − [−103.8] = −2147.7 + 103.8 = −2043.9 kJ.",
            hints:["The water is H₂O(g): −241.8.", "Products: 3(−393.5) + 4(−241.8) = −2147.7.", "−2147.7 − (−103.8) = −2043.9 kJ."] },
          { id:"f3", goal:3, star:true, prompt:"Find " + Hr + " for C₆H₁₂O₆(s) + 6O₂(g) → 6CO₂(g) + 6H₂O(l), the overall equation of cellular respiration.", answer:-2802.5, unit:"kJ", display:"−2802.5 kJ",
            wrong:[{ match:2802.5, fb:M2 }, { match:594.0, fb:"Six CO₂ and six H₂O: multiply each value by its coefficient." }],
            fb:M2 + " Multiply each value by its coefficient.",
            why:"[6(−393.5) + 6(−285.8)] − [−1273.3] = −4075.8 + 1273.3 = −2802.5 kJ.",
            hints:["Products: 6(−393.5) + 6(−285.8) = −4075.8.", "Reactants: −1273.3 + 6(0) = −1273.3.", "−4075.8 − (−1273.3) = −2802.5 kJ."] },
          // VERIFY: the Sabatier reaction is used to recycle CO₂ on spacecraft (plan F4, verify before release).
          { id:"f4", goal:3, star:true, prompt:"Find " + Hr + " for CO₂(g) + 4H₂(g) → CH₄(g) + 2H₂O(g), the Sabatier reaction, used to recycle CO₂ on spacecraft.", answer:-164.7, unit:"kJ", display:"−164.7 kJ",
            wrong:[{ match:77.1, fb:"Two moles of water vapour means 2 × (−241.8)." }, { match:-951.7, fb:"Subtract CO₂’s value; don’t add it." }],
            fb:M2 + " Check the states and coefficients.",
            why:"[−74.6 + 2(−241.8)] − [−393.5 + 4(0)] = −558.2 + 393.5 = −164.7 kJ.",
            hints:["Products: −74.6 + 2(−241.8) = −558.2.", "Reactants: −393.5 + 4(0) = −393.5.", "−558.2 − (−393.5) = −164.7 kJ."] },
          { id:"f5", goal:5, star:true, prompt:"Ethane’s " + Hc + " to liquid water is −1560.4 kJ/mol. Find " + Hf + "(C₂H₆).", answer:-84.0, unit:"kJ/mol", display:"−84.0 kJ/mol",
            wrong:[{ match:84.0, fb:M7 }, { match:487.6, fb:"Three moles of water means 3 × (−285.8)." }],
            fb:M7,
            why:"−1560.4 = [2(−393.5) + 3(−285.8)] − " + X + " = −1644.4 − " + X + ", so " + X + " = −84.0 kJ/mol.",
            hints:["Write C₂H₆ + 3½O₂ → 2CO₂ + 3H₂O(l).", "−1560.4 = [2(−393.5) + 3(−285.8)] − " + X + " = −1644.4 − " + X + ".", X + " = −1644.4 + 1560.4 = −84.0 kJ/mol."] },
          { id:"f6", goal:6, star:true, kind:"pair", prompt:"Which releases more energy per mole of CO₂ produced, methane (R1) or propane (R2)? Enter both values.",
            labels:["Methane:", "Propane:"], answer:[890.5, 740.0], unit:"kJ per mol CO₂", display:"methane 890.5, propane 740.0 kJ per mol CO₂",
            wrong:[{ k:1, match:2219.9, fb:"Divide by its 3 mol of CO₂. " + M6 }],
            fb:"Energy per mole of CO₂ = " + Hc + " ÷ moles of CO₂ made.",
            why:"Methane: 890.5 ÷ 1 = 890.5 kJ per mol CO₂; propane: 2219.9 ÷ 3 = 740.0. Methane releases more.",
            hints:["Methane makes 1 mol CO₂; propane makes 3.", "Methane: 890.5 ÷ 1. Propane: 2219.9 ÷ 3.", "Methane 890.5; propane 740.0 kJ per mol CO₂."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Paloma", goal:[3, 4],
        instruction:"Paloma made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find " + Hc + " for C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l).",
            steps:["The products are 3CO₂(g) and 4H₂O(l).", "Σ products = −393.5 + (−285.8) = −679.3 kJ.", "Σ reactants = −103.8 + 5(0) = −103.8 kJ.", DH + " = −679.3 − (−103.8) = −575.5 kJ."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct.", "Step 4 follows from step 2."],
            fixes:[
              { t:"Multiply by the coefficients: 3(−393.5) + 4(−285.8) = −2323.7, so " + DH + " = −2219.9 kJ.", ok:true, why:"Each " + Hf + " counts once per mole in the balanced equation." },
              { t:"Include O₂ as −498.", why:M1 },
              { t:"Use H₂O(g).", why:"The equation says liquid. " + M4 },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["How many CO₂ and H₂O are made?", "3 and 4.", "−2219.9 kJ."] },
          { id:"e2", goal:3, task:"Find " + Hc + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).",
            steps:["Σ products = −393.5 + 2(−285.8) = −965.1 kJ.", "Σ reactants = −74.6 + 2(0) = −74.6 kJ.", DH + " = Σ reactants − Σ products = −74.6 − (−965.1) = +890.5 kJ.", "So burning methane absorbs energy."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:DH + " = Σ products − Σ reactants = −965.1 − (−74.6) = −890.5 kJ.", ok:true, why:"Products minus reactants: burning methane releases energy." },
              { t:"Add the sums: −1039.7 kJ.", why:"It’s a difference." },
              { t:"Include O₂’s bond energy.", why:M1 },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which order is the formula?", "Products minus reactants.", "−890.5 kJ."] },
          { id:"e3", goal:4, task:"Find " + Hc + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g).",
            steps:["The equation is balanced.", "Use " + Hf + "(H₂O) = −285.8 kJ/mol.", "Σ products = −393.5 + 2(−285.8) = −965.1 kJ.", DH + " = −965.1 + 74.6 = −890.5 kJ."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2.", "Step 4 follows."],
            fixes:[
              { t:"The water is a gas: use −241.8. Σ products = −877.1, so " + DH + " = −802.5 kJ.", ok:true, why:"H₂O(g) has its own value: −241.8 kJ/mol." },
              { t:"Use −285.8 and subtract 44.0 once.", why:"Two moles change state, and the sign goes the other way." },
              { t:"Use −241.8 for CO₂.", why:"That’s water vapour’s value." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Check the state of water in the equation.", "(g): −241.8.", "−802.5 kJ."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the ladder: that elements are zero, or that limestone sits so far down?" },
      { id:"j2", q:"In your own words, explain why the formula is ‘products minus reactants’." },
      { id:"j3", q:"Explain to a friend how to write the formation equation for any compound." },
      { id:"j4", q:"Which step still trips you up: coefficients, states or signs? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is " + Hf + " for an element in its standard state?", options:[
          { t:"0 kJ/mol", ok:true, why:"Elements in their standard states are the reference." },
          { t:"Its bond energy", why:"Bond energies are a different quantity." },
          { t:"−1 kJ/mol", why:"It’s exactly zero by definition." },
          { t:"It depends on the reaction", why:"It’s a fixed table value: 0." }] },
        b:{ prompt:"Which species has " + Hf + " = 0?", options:[
          { t:"N₂(g)", ok:true, why:"Nitrogen’s standard state." },
          { t:"NH₃(g)", why:"A compound: −45.9." },
          { t:"NO(g)", why:"A compound: +91.3." },
          { t:"N(g)", why:"Single N atoms aren’t nitrogen’s standard state." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is the formation equation for methanol, CH₃OH(l)?", options:[
          { t:"C(s) + 2H₂(g) + ½O₂(g) → CH₃OH(l)", ok:true, why:"Exactly 1 mol of CH₃OH(l), from elements in their standard states." },
          { t:"2C(s) + 4H₂(g) + O₂(g) → 2CH₃OH(l)", why:"Exactly 1 mol of product." },
          { t:"CO(g) + 2H₂(g) → CH₃OH(l)", why:"CO isn’t an element." },
          { t:"C(g) + 4H(g) + O(g) → CH₃OH(l)", why:"Use the elements’ standard states." }] },
        b:{ prompt:"Which is the formation equation for ammonia, NH₃(g)?", options:[
          { t:"½N₂(g) + 1½H₂(g) → NH₃(g)", ok:true, why:"Exactly 1 mol of NH₃(g), from N₂(g) and H₂(g); fractions are fine." },
          { t:"N₂(g) + 3H₂(g) → 2NH₃(g)", why:M5 },
          { t:"N(g) + 3H(g) → NH₃(g)", why:"Standard states are N₂(g) and H₂(g)." },
          { t:"NH₃(g) → ½N₂(g) + 1½H₂(g)", why:"That’s the reverse." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which expression gives " + Hr + " from formation values?", options:[
          { t:SP + " − " + SR, ok:true, why:"Products minus reactants, each value times its coefficient." },
          { t:SR + " − " + SP, why:M2 },
          { t:"ΣΔ<i>H</i>°<sub>f</sub>(products) − ΣΔ<i>H</i>°<sub>f</sub>(reactants), ignoring coefficients", why:"Multiply each value by its coefficient." },
          { t:SP + " + " + SR, why:"It’s a difference." }] },
        b:{ prompt:"In the formula, what multiplies each " + Hf + "?", options:[
          { t:"The species’ coefficient in the balanced equation", ok:true, why:"Values are per mole; the coefficient counts the moles." },
          { t:"Its molar mass", why:"Values are per mole; multiply by moles." },
          { t:"Nothing", why:"Multiply each value by its coefficient: two moles of water means 2 × (−285.8)." },
          { t:"The number of bonds", why:"That’s the bond-energy method." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find " + Hc + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).", use:U("CH₄(g) −74.6, CO₂(g) −393.5, H₂O(l) −285.8"), options:[
          { t:"−890.5 kJ", ok:true, why:"−965.1 − (−74.6)." },
          { t:"−604.7 kJ", why:"Two moles of water." },
          { t:"−1039.7 kJ", why:"Subtract methane’s value; don’t add it." },
          { t:"+890.5 kJ", why:M2 }] },
        b:{ prompt:"Find " + Hc + " for CH₃OH(l) + 1½O₂(g) → CO₂(g) + 2H₂O(l).", use:U("CH₃OH(l) −239.2, CO₂(g) −393.5, H₂O(l) −285.8"), options:[
          { t:"−725.9 kJ", ok:true, why:"−965.1 − (−239.2)." },
          { t:"−440.1 kJ", why:"Two moles of water: 2 × (−285.8)." },
          { t:"−1204.3 kJ", why:"Subtract methanol’s value." },
          { t:"+725.9 kJ", why:M2 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Ethane’s " + Hc + " (to liquid water) is −1560.4 kJ/mol. Find " + Hf + "(C₂H₆).", use:U("CO₂(g) −393.5, H₂O(l) −285.8"), options:[
          { t:"−84.0 kJ/mol", ok:true, why:"−1560.4 = −1644.4 − " + X + "." },
          { t:"+84.0 kJ/mol", why:M7 },
          { t:"+487.6 kJ/mol", why:"Three moles of water." },
          { t:"−3204.8 kJ/mol", why:"Solve for " + X + ", don’t add." }] },
        b:{ prompt:"Methanol’s " + Hc + " (to liquid water) is −725.9 kJ/mol. Find " + Hf + "(CH₃OH).", use:U("CO₂(g) −393.5, H₂O(l) −285.8"), options:[
          { t:"−239.2 kJ/mol", ok:true, why:"−725.9 = −965.1 − " + X + "." },
          { t:"+239.2 kJ/mol", why:M7 },
          { t:"+46.6 kJ/mol", why:"Two moles of water: 2 × (−285.8)." },
          { t:"−1691.0 kJ/mol", why:M2 + " Solve for " + X + "." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Propane’s " + Hc + " is −2219.9 kJ with liquid water. What is it with water vapour? (Use the table.)", use:U("H₂O(l) −285.8, H₂O(g) −241.8"), options:[
          { t:"−2043.9 kJ", ok:true, why:"4 waters × 44.0 = 176.0 less released." },
          { t:"−2395.9 kJ", why:"Vapour releases <strong>less</strong>, not more." },
          { t:"−2175.9 kJ", why:"Four moles of water." },
          { t:"−2219.9 kJ", why:M4 }] },
        b:{ prompt:"Glucose’s " + Hc + " is −2802.5 kJ with liquid water. What is it with water vapour?", use:U("H₂O(l) −285.8, H₂O(g) −241.8"), options:[
          { t:"−2538.5 kJ", ok:true, why:"6 × 44.0 = 264.0." },
          { t:"−3066.5 kJ", why:"Vapour releases less." },
          { t:"−2758.5 kJ", why:"Six moles of water." },
          { t:"−2802.5 kJ", why:M4 }] } },
      { id:"c1", cat:"C", goal:[1, 2],
        a:{ prompt:"Which is the best explanation of why elements in their standard states have " + Hf + " = 0?", options:[
          { t:"“They’re the reference point: making an element from itself in its standard state involves no change.”", ok:true, why:"Zero is the chosen reference: forming O₂(g) from O₂(g) changes nothing." },
          { t:"“Elements have no energy.”", why:"They have energy; zero is a chosen reference." },
          { t:"“Elements can’t react.”", why:"They react all the time." },
          { t:"“Their bonds are too weak to count.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why a formation equation must make exactly 1 mol of product?", options:[
          { t:"“" + Hf + " is defined per mole of compound, so table values can be multiplied by coefficients in any reaction.”", ok:true, why:"Per-mole values scale with the coefficients." },
          { t:"“Because fractions aren’t allowed.”", why:"Fractions of reactants are fine." },
          { t:"“Because only 1 mol fits in a calorimeter.”", why:"That isn’t the reason." },
          { t:"“Because elements always come in pairs.”", why:"Not relevant." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the correctly set-up work for 2CO(g) + O₂(g) → 2CO₂(g)?", use:U("CO(g) −110.5, CO₂(g) −393.5"), options:[
          { t:DH + " = [2(−393.5)] − [2(−110.5) + 0] = −566.0 kJ", ok:true, why:"Products minus reactants, with every coefficient, and O₂ at 0." },
          { t:DH + " = [−393.5] − [−110.5] = −283.0 kJ", why:"Coefficients missing." },
          { t:DH + " = [2(−110.5) + 0] − [2(−393.5)] = +566.0 kJ", why:M2 },
          { t:DH + " = [2(−393.5)] − [2(−110.5) + 498] = −1064.0 kJ", why:"O₂ is 0." }] },
        b:{ prompt:"Which is the correctly set-up work for CaCO₃(s) → CaO(s) + CO₂(g)?", use:U("CaCO₃(s) −1207.6, CaO(s) −634.9, CO₂(g) −393.5"), options:[
          { t:DH + " = [−634.9 + (−393.5)] − [−1207.6] = +179.2 kJ", ok:true, why:"Both products, minus the reactant." },
          { t:DH + " = [−1207.6] − [−634.9 + (−393.5)] = −179.2 kJ", why:M2 },
          { t:DH + " = −634.9 + (−393.5) + (−1207.6) = −2236.0 kJ", why:"It’s a difference." },
          { t:DH + " = [−634.9] − [−1207.6] = +572.7 kJ", why:"CO₂ is a product too." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Which fuel releases the most energy per mole of CO₂ it produces?", use:Hc + " (kJ/mol, liquid water): CH₄ −890.5, C₃H₈ −2219.9, CH₃OH −725.9, C₂H₅OH −1366.8.", options:[
          { t:"Methane (890.5 kJ per mol CO₂)", ok:true, why:"Methane makes 1 mol CO₂ per mole: 890.5 kJ for each." },
          { t:"Propane (2219.9 kJ per mol CO₂)", why:"Propane makes 3 mol CO₂: 740.0 each." },
          { t:"Ethanol (1366.8 kJ per mol CO₂)", why:"Ethanol makes 2 mol CO₂: 683.4 each." },
          { t:"Methanol (725.9 kJ per mol CO₂)", why:"That’s less than methane’s 890.5." }] },
        b:{ prompt:"A home heats with propane. It switches to natural gas (methane) for the same amount of heat. What happens to its CO₂ emissions, and why?", options:[
          { t:"They fall, because methane releases more energy per mole of CO₂ (890.5 vs 740.0 kJ)", ok:true, why:"Each mole of CO₂ comes with more heat, so less CO₂ for the same heat." },
          { t:"They rise, because methane’s " + Hc + " is smaller per mole", why:M6 },
          { t:"They stay the same; all fuels make the same CO₂ per kJ", why:"The table shows they don’t." },
          { t:"They fall to zero", why:"Methane still makes CO₂." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"On spacecraft, CO₂ can be recycled by CO₂(g) + 4H₂(g) → CH₄(g) + 2H₂O(g). Find " + Hr + ".", use:U("CO₂(g) −393.5, CH₄(g) −74.6, H₂O(g) −241.8"), options:[
          { t:"−164.7 kJ", ok:true, why:"[−74.6 + 2(−241.8)] − [−393.5]." },
          { t:"+164.7 kJ", why:M2 },
          { t:"+77.1 kJ", why:"Two moles of water." },
          { t:"−951.7 kJ", why:"Subtract CO₂’s value; don’t add it." }] },
        b:{ prompt:"Cement making starts with CaCO₃(s) → CaO(s) + CO₂(g). Find " + Hr + ".", use:U("CaCO₃(s) −1207.6, CaO(s) −634.9, CO₂(g) −393.5"), options:[
          { t:"+179.2 kJ", ok:true, why:"[−634.9 + (−393.5)] − [−1207.6]." },
          { t:"−179.2 kJ", why:M2 },
          { t:"−2236.0 kJ", why:"It’s a difference." },
          { t:"+1207.6 kJ", why:"Products count too." }] } }
    ]
  },
  task:{
    title:"Fill the tank", summary:"Fill the tank",
    statement:"<p>Choose a fuel and an amount for a portable heater. Calculate the fuel’s " + Hc + " from the course table (liquid water), then meet every condition. There’s more than one answer.</p>",
    checks:["Your " + Hc + " is right", "At least 2000 kJ of heat", "At most 3 mol of CO₂", "The tank holds at most 5 mol"],
    tips:["Use products minus reactants with liquid water.", "Energy = moles × |" + Hc + "|.", "CO₂ moles = moles of fuel × carbons per molecule.", "Hydrogen makes no CO₂ but needs 7 mol for 2000 kJ."],
    explainPrompt:"Explain how you used " + Hf + " values to compare the fuels, and why your choice meets the CO₂ limit.",
    vocab:"Use the words standard enthalpy of formation, coefficient, products and per mole of CO₂.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every answer sits right at the 3 mol CO₂ limit. Methane gives the most heat for that CO₂."
  },
  cards:[
    [Hf, "Enthalpy change to form 1 mol of a compound from its elements in their standard states at SATP"],
    ["Elements in their standard states", Hf + " = 0 (O₂(g), H₂(g), N₂(g), C(s, graphite), metals (s))"],
    ["Formation equation", "Exactly 1 mol of product, from elements only; fractions allowed"],
    ["The formula", Hr + " = " + SP + " − " + SR],
    ["Why it works", "Hess’s law: take the reactants to elements, then build the products"],
    ["H₂O(l) vs H₂O(g)", "−285.8 vs −241.8 kJ/mol; always check the state"],
    ["Coefficients", "Multiply each " + Hf + " by its coefficient"],
    ["Working backwards", "Put the unknown " + Hf + " as " + X + " and solve; substitute back to check"],
    ["CH₄ combustion", "−890.5 kJ/mol (liquid water); −802.5 (vapour)"],
    ["Energy per mole of CO₂", Hc + " ÷ mol CO₂ produced; methane 890.5 is the best of the carbon fuels in the table"],
    ["Limestone → lime", "+179.2 kJ/mol: endothermic, and it releases CO₂ itself"],
    ["SATP", "25 °C (298 K) and 100 kPa"]
  ]
};
