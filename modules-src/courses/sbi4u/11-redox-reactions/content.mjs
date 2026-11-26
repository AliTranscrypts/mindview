// SBI4U 11 Redox Reactions. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/11-redox-reactions.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Oxidation is losing electrons. In biology that is often losing H atoms: lactate → pyruvate is an oxidation, with no oxygen involved.";
const M2 = "The reducing agent <em>gives</em> electrons, so it is oxidized. The oxidizing agent <em>takes</em> electrons, so it is reduced.";
const M3 = "O₂ gains electrons (and H) to become H₂O: it is reduced.";
const M4 = "Electrons don’t vanish. Every electron lost by one substance is gained by another.";
const M5 = "Fats have more C–H bonds and less oxygen, so their electrons have further to fall toward O₂.";
const M6 = "Condensation joins two molecules into one bigger one. Neutralization is acid + base: H⁺ meets OH⁻ (or a base).";
const M7 = "Same overall ΔG, but the cell passes electrons through carriers step by step, so it can capture energy as ATP.";
const ABC = "C<sub><i>a</i></sub>H<sub><i>b</i></sub>O<sub><i>c</i></sub>";
const RULE = "4<i>a</i> + <i>b</i> − 2<i>c</i>";
const QC_WATER_OUT = "Water comes out as two molecules join.";
const QC_WATER_IN = "Water goes in; one molecule becomes two.";
const QC_ACID = "Acid + base gives a salt and water.";
const QC_E = "Electrons move from one molecule to another.";

// Activity 1 sorter: [change, box, why (shown when placed), {wrong box: feedback}, hints?]
const SORT = [
  ["NAD⁺ → NADH", "red", "NAD⁺ gains 2 electrons (and an H⁺): reduced."],
  ["FADH₂ → FAD", "ox", "FADH₂ loses 2 H atoms, and their electrons: oxidized."],
  ["Fe²⁺ → Fe³⁺ (in a cytochrome)", "ox", "Fe²⁺ → Fe³⁺: one more positive charge, so one electron lost.", { red:"Fe²⁺ → Fe³⁺: one more positive charge, so one electron lost." }],
  ["O₂ → H₂O", "red", "O₂ gains electrons and H to become water.", { ox:"O₂ gains electrons and H to become water." }],
  ["CO₂ → glucose (photosynthesis)", "red", "Carbon gains H atoms, and their electrons, as CO₂ becomes glucose: reduced."],
  ["glucose → CO₂ (respiration)", "ox", "Glucose loses its H atoms, and their electrons, as it ends as CO₂: oxidized."],
  ["Na → Na⁺", "ox", "Losing a negative electron leaves a positive ion: oxidized."],
  ["Cl → Cl⁻", "red", "Gaining an electron makes a negative ion: reduced."],
  ["lactate → pyruvate (loses 2 H)", "ox", "Losing H atoms means losing electrons: oxidized.", { red:"Losing H atoms means losing electrons." }],
  ["H₂O → O₂ (water split in photosynthesis)", "ox", "Water’s oxygen ends up as O₂, losing its H and electrons: oxidized.", { red:"Water’s oxygen ends up as O₂, losing its H and electrons." },
    ["Where do water’s H atoms go?", "They leave as H⁺ + e⁻.", "Losing electrons: oxidized."]]
];
function sortItems(){
  return SORT.map(function(s, i){
    const it = { id:"i" + (i + 1), t:s[0], answer:s[1], why:s[2] };
    if (s[3]) it.wrong = s[3];
    if (s[4]) it.hints = s[4];
    return it;
  });
}

export default {
  id:"11-redox-reactions",
  kind:"topic",
  title:"Redox reactions",
  topic:"Redox Reactions",
  readyTopic:"redox reactions",
  hero:{
    eq:'<span class="rx-heq" id="rx-heq"><span class="rx-heq-row bio-chem"><span data-sp="glu">C₆H₁₂O₆</span> + <span data-sp="o2">6O₂</span> → <span data-sp="co2">6CO₂</span> + <span data-sp="h2o">6H₂O</span></span><svg class="rx-heq-arcs" aria-hidden="true" focusable="false"></svg></span>',
    eqLabel:"C₆H₁₂O₆ plus 6 O₂ gives 6 CO₂ plus 6 H₂O. Glucose, which becomes CO₂, is oxidized. O₂, which becomes H₂O, is reduced.",
    eqSize:"sm",
    headline:"Follow the electrons.",
    text:"When one molecule loses electrons, another gains them. Losing electrons is <strong>oxidation</strong>; gaining them is <strong>reduction</strong>. In cells the electrons usually travel with hydrogen, and oxygen pulls them hardest of all. That pull is where the energy in your food comes from.",
    fig:{ html:'<div class="rx-hero" id="rx-hero" role="img" aria-label="A glucose molecule: six brown carbon atoms in a ring, each holding an oxygen and two hydrogen atoms. The 12 hydrogen atoms glow and come off in pairs, each pair as 2 magenta H⁺ and 2 violet electrons. A stream of 24 violet electrons, with the H⁺, travels right to six blue O₂ molecules, which become six H₂O. The glucose carbons, now bonded only to oxygen, become six CO₂. A label rises: Glucose: oxidized (lost H). O₂: reduced (gained H)."></div>' }
  },
  goals:[
    "I can define oxidation and reduction in terms of electrons, and in terms of hydrogen and oxygen in biology.",
    "I can identify what is oxidized and what is reduced, and name the oxidizing and reducing agents.",
    "I can explain why electrons moving toward oxygen release energy, and compare the energy stored in fats and sugars.",
    "I can classify a reaction as redox, hydrolysis, condensation or neutralization.",
    "I can explain why cells release energy from glucose in small steps rather than all at once."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Electrons and ions", goal:1,
          prompt:"A sodium atom becomes Na⁺. It has…",
          options:[
            { t:"lost one electron", ok:true, why:"Losing a negative electron leaves a positive ion." },
            { t:"gained one electron", why:"Gaining an electron would make Na⁻." },
            { t:"gained one proton", why:"Ions form by electron transfer; the nucleus doesn’t change." },
            { t:"lost one proton", why:"That would change it into a different element." }],
          hints:["Electrons are negative.", "Losing a negative leaves a positive.", "Lost one electron."] },
        { id:"w2", skill:"Electrons and ions", goal:1,
          prompt:"A chlorine atom becomes Cl⁻. It has…",
          options:[
            { t:"gained one electron", ok:true, why:"One extra negative charge." },
            { t:"lost one electron", why:"That would make Cl⁺." },
            { t:"lost one proton", why:"Protons don’t move in chemical reactions." },
            { t:"gained a neutron", why:"Neutrons have no charge." }],
          hints:["What carries negative charge?", "One more electron.", "Gained one electron."] },
        { id:"w3", skill:"Electronegativity", goal:3,
          prompt:"In an O–H bond, the shared electrons are…",
          options:[
            { t:"pulled closer to the oxygen", ok:true, why:"Oxygen is more electronegative than hydrogen." },
            { t:"pulled closer to the hydrogen", why:"Hydrogen pulls weakly." },
            { t:"shared exactly equally", why:"Only identical atoms share exactly equally." },
            { t:"transferred completely to hydrogen", why:"O–H is a polar covalent bond, not an ionic one." }],
          hints:["Which atom is more electronegative?", "Oxygen (3.4) vs hydrogen (2.2).", "Closer to oxygen."] },
        { id:"w4", skill:"Electronegativity", goal:3,
          prompt:"Which atom is the most electronegative?",
          options:[
            { t:"Oxygen", ok:true, why:"3.4 on the Pauling scale: the strongest pull of these." },
            { t:"Carbon", why:"Carbon is 2.6." },
            { t:"Hydrogen", why:"Hydrogen is 2.2." },
            { t:"Nitrogen", why:"Nitrogen is 3.0: close, but less than oxygen." }],
          hints:["Electronegativity increases toward the top right of the periodic table (not counting noble gases).", "O is right of N and C.", "Oxygen."] },
        { id:"w5", skill:"Reading formulas", goal:2,
          prompt:"How many hydrogen atoms are in one glucose molecule, C₆H₁₂O₆?",
          options:[
            { t:"12", ok:true, why:"The subscript after H." },
            { t:"6", why:"6 is for carbon (and oxygen)." },
            { t:"24", why:"Read the subscript as written." },
            { t:"2", why:"H₂ is the hydrogen gas formula, not glucose." }],
          hints:["Find the number after H.", "H₁₂.", "12."] },
        { id:"w6", skill:"Reading formulas", goal:4,
          prompt:"In 6CO₂, how many oxygen atoms are there in total?",
          options:[
            { t:"12", ok:true, why:"6 molecules × 2 oxygen atoms." },
            { t:"6", why:"Each CO₂ has 2 O." },
            { t:"2", why:"There are 6 molecules." },
            { t:"8", why:"Multiply 6 × 2." }],
          hints:["The coefficient counts molecules.", "Each has 2 O.", "12."] }
      ],
      refreshers:{
        "Electrons and ions":"An atom that loses electrons becomes positive (Na → Na⁺ + e⁻); one that gains becomes negative (Cl + e⁻ → Cl⁻).",
        "Electronegativity":"Electronegativity is how hard an atom pulls shared electrons. O 3.4 &gt; N 3.0 &gt; C 2.6 &gt; H 2.2. In O–H and C–O bonds, the electrons sit nearer the oxygen.",
        "Reading formulas":"Subscripts count atoms in one molecule; coefficients count molecules. 6CO₂ has 6 C and 12 O."
      }
    }
  },
  explore:{
    heading:"Electron tug-of-war",
    intro:"Watch which atom wins the pull on shared electrons, then tag who loses and who gains electrons in real reactions.",
    modes:[["A", "Tug-of-war"], ["B", "Who loses, who gains?"]],
    bonds:[["hh", "H–H"], ["ch", "C–H"], ["cc", "C–C"], ["co", "C–O"], ["oh", "O–H"], ["oo", "O=O"]],
    mols:[["ch4", "CH₄", "methane"], ["ch3oh", "CH₃OH", "methanol"], ["hcho", "HCHO", "formaldehyde"], ["hcooh", "HCOOH", "formic acid"], ["co2", "CO₂", "carbon dioxide"], ["glu", "glucose", "C₆H₁₂O₆"], ["palm", "palmitic acid", "a fatty acid, C₁₆H₃₂O₂"]],
    scoreRule:"<strong>Carbon score</strong> (a model): each C–H bond counts −1, each C–O bond +1 (a C=O counts +2), each C–C 0. For big molecules the counter shows the average per carbon.",
    // TC2 list (shown jumbled); TC3 panel
    orderTitle:"Challenge 2: one-carbon molecules, most reduced (top) to most oxidized (bottom)",
    orderStart:["hcooh", "ch4", "co2", "hcho", "ch3oh"],
    fuelTitle:"Fuel calculator (challenge 3)",
    fuelRule:"Electrons given to O₂ by " + ABC + " = " + RULE + "; each O₂ takes 4 electrons.",
    fuelRows:[["glu", "Glucose, C₆H₁₂O₆"], ["palm", "Palmitic acid, C₁₆H₃₂O₂"]],
    fuelPick:"More electrons <strong>per carbon</strong>:",
    fuelChoices:[["sugar", "the sugar (glucose)"], ["fat", "the fat (palmitic acid)"]],
    // Mode B reactions. answer: the tag key (ch: ox | red | none; ag: ra | oa) and the readout rows shown after a correct check or
    // "Show electron flow". The art (tokens, electron and H⁺ counts) lives in app.js.
    reactions:[
      { id:"B1", eq:"Na + Cl → Na⁺ + Cl⁻", parts:[["na", "Na", "sodium atom"], ["cl", "Cl", "chlorine atom"]],
        answer:{ key:{ na:["ox", "ra"], cl:["red", "oa"] }, ox:"Na (loses 1 e⁻, becoming Na⁺)", red:"Cl (gains 1 e⁻, becoming Cl⁻)", ra:"Na", oa:"Cl", e:"1" } },
      { id:"B2", eq:"2H₂ + O₂ → 2H₂O", parts:[["h2", "2H₂", "hydrogen"], ["o2", "O₂", "oxygen"]],
        answer:{ key:{ h2:["ox", "ra"], o2:["red", "oa"] }, ox:"H₂ (its 4 H atoms give up their electrons to oxygen)", red:"O₂ (gains 4 e⁻ and 4 H⁺, becoming H₂O)", ra:"H₂", oa:"O₂", e:"4" } },
      { id:"B3", eq:"CH₄ + 2O₂ → CO₂ + 2H₂O", parts:[["ch4", "CH₄", "methane"], ["o2", "2O₂", "oxygen"]],
        answer:{ key:{ ch4:["ox", "ra"], o2:["red", "oa"] }, ox:"CH₄ (loses its 4 H; carbon score −4 → +4)", red:"O₂ (gains electrons and H, becoming H₂O)", ra:"CH₄", oa:"O₂", e:"8" } },
      { id:"B4", eq:"C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", parts:[["glu", "C₆H₁₂O₆", "glucose"], ["o2", "6O₂", "oxygen"]],
        answer:{ key:{ glu:["ox", "ra"], o2:["red", "oa"] }, ox:"glucose (loses its H; its carbons end as CO₂)", red:"O₂ (gains electrons and H, becoming H₂O)", ra:"glucose", oa:"O₂", e:"24" } },
      { id:"B5", eq:"6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (photosynthesis)", parts:[["co2", "6CO₂", "carbon dioxide"], ["h2o", "6H₂O", "water"]],
        answer:{ key:{ co2:["red", "oa"], h2o:["ox", "ra"] }, ox:"H₂O (loses H and electrons; its oxygen ends as O₂)", red:"CO₂ (gains H and electrons, becoming glucose)", ra:"H₂O", oa:"CO₂", e:"24 (in reverse: uphill, powered by light)" } },
      { id:"B6", eq:"malate + NAD⁺ → oxaloacetate + NADH + H⁺", parts:[["mal", "malate", "a Krebs cycle acid"], ["nad", "NAD⁺", "electron carrier"]],
        answer:{ key:{ mal:["ox", "ra"], nad:["red", "oa"] }, ox:"malate (loses 2 H: 2 e⁻ + 2 H⁺)", red:"NAD⁺ (gains 2 e⁻ and 1 H⁺)", ra:"malate", oa:"NAD⁺", e:"2" } },
      { id:"B7", eq:"cytochrome Fe³⁺ + e⁻ → cytochrome Fe²⁺", parts:[["cyt", "cytochrome Fe³⁺", "iron in a carrier protein"], ["e", "e⁻", "from the carrier before it (not tagged)"]],
        answer:{ key:{ cyt:["red", "oa"] }, ox:"the carrier before it in the chain (not shown: this is half of a reaction)", red:"cytochrome Fe³⁺ (gains 1 e⁻, becoming Fe²⁺)", ra:"the electron’s donor (not shown)", oa:"cytochrome Fe³⁺", e:"1" } }
    ],
    tagHow:"Tag each reactant: oxidized, reduced or neither, then its agent role. Press <strong>Check tags</strong>, or <strong>Show electron flow</strong> to watch the answer.",
    release:{ label:"Release", fire:"All at once (fire)", steps:"In steps (cell)",
      fireNote:"One big drop: all the energy leaves as heat and light.", stepNote:"Six small drops: some energy captured as ATP.",
      dg:"ΔG ≈ −2870 kJ/mol either way" },
    modelTitle:"How the model works",
    modelRules:[
      "<strong>Electronegativity</strong> (Pauling scale): O 3.4, N 3.0, C 2.6, H 2.2. The shared pair is drawn closer to the atom that pulls harder.",
      "<strong>Pair positions</strong> (model): exactly in the middle for identical atoms (H–H, C–C, O=O); 70% of the way toward O for O–H and C–O; a little toward C for C–H.",
      "<strong>Carbon score</strong> (model): each C–H bond −1, each C–O bond +1, a C=O +2, each C–C 0. The lower the score, the more reduced the carbon, and the more electrons it can still give to O₂ on the way to CO₂ (+4).",
      "<strong>Electron count rule</strong>: " + ABC + " gives " + RULE + " electrons to O₂ when fully oxidized; each O₂ takes 4."
    ],
    modelNote:"The carbon score is a simplified bookkeeping model for this course, not the full method chemists use. The tug-of-war positions are model positions, not measured ones.",
    predIntro:"Make a prediction first. Then the tug-of-war will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"B", rx:"B4" },
        prompt:"<span class=\"muted\">Reaction B4.</span> In cellular respiration, what happens to O₂?",
        options:[{ t:"It is reduced to H₂O", ok:true }, { t:"It is oxidized to CO₂" }, { t:"It is unchanged" }, { t:"It is oxidized to H₂O" }],
        explain:"O₂ gains electrons and hydrogen: reduction. The oxygen in CO₂ comes from glucose and water, not from O₂." },
      { id:"p2", start:{ mode:"B", rx:"B6" },
        prompt:"<span class=\"muted\">Reaction B6.</span> Malate loses 2 hydrogen atoms to NAD⁺. Malate is…",
        options:[{ t:"oxidized", ok:true }, { t:"reduced" }, { t:"neither, because no oxygen is involved" }, { t:"both" }],
        explain:"Losing H means losing electrons, so it’s oxidation even without O₂." },
      { id:"p3", start:{ mode:"B", rx:"B1", tagNa:true },
        prompt:"<span class=\"muted\">Reaction B1, with Na tagged “oxidized”.</span> Which must be true of Cl?",
        options:[{ t:"It is reduced", ok:true }, { t:"It is also oxidized" }, { t:"It is unchanged" }, { t:"It loses a proton" }],
        explain:"Electrons lost by one atom must be gained by another." },
      { id:"p4", start:{ mode:"A", mol:"ch4" },
        prompt:"<span class=\"muted\">Mode A: compare CH₄ and CH₃OH.</span> Which carbon can lose more electrons on the way to CO₂?",
        options:[{ t:"CH₄ (score −4)", ok:true }, { t:"CH₃OH (score −2)" }, { t:"Both the same" }, { t:"Neither" }],
        explain:"CH₄ is 8 steps from CO₂; CH₃OH is only 6. More electrons to give means more energy released." }
    ],
    chalIntro:"Use the tug-of-war (challenge 1: Mode B; challenges 2 and 3: the panels under Mode A), then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Tag reaction B3 completely: oxidized, reduced, oxidizing agent and reducing agent.",
        why:"CH₄ is oxidized and is the reducing agent; O₂ is reduced and is the oxidizing agent. CO₂ and H₂O are products, so they aren’t tagged.",
        general:"Choose reaction B3 in Mode B (Who loses, who gains?), then tag both reactants.",
        hints:["Where do CH₄’s hydrogens end up?", "In H₂O, attached to oxygen from O₂: O₂ gained electrons.", "CH₄: oxidized, reducing agent. O₂: reduced, oxidizing agent."] },
      { id:"tc2", goal:[2, 3], prompt:"Mode A: put the five one-carbon molecules in order from most reduced to most oxidized.",
        why:"CH₄ (−4) → CH₃OH (−2) → HCHO (0) → HCOOH (+2) → CO₂ (+4).",
        hints:["Count C–H bonds (−1 each) and C–O bonds (+1 each).", "CH₄ −4, CH₃OH −2, HCHO 0.", "Then HCOOH +2, CO₂ +4."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Use the electron count rule to find how many O₂ molecules are needed to fully oxidize one glucose (C₆H₁₂O₆) and one palmitic acid (C₁₆H₃₂O₂). Then decide which gives more electrons <strong>per carbon</strong>.",
        why:"Glucose: 24 electrons, 6 O₂. Palmitic acid: 92 electrons, 23 O₂. Per carbon: glucose 4, palmitic acid 5.75, so the fat gives more.",
        hints:["Glucose: 4(6) + 12 − 2(6) = 24 electrons.", "Palmitic acid: 4(16) + 32 − 2(2) = 92; 92 ÷ 4 = 23 O₂.", "Per carbon: 24 ÷ 6 = 4 and 92 ÷ 16 = 5.75. The fat’s carbons are more reduced, so they release more energy."] }
    ]
  },
  part3:{
    slug:"reaction-types", name:"Reaction types",
    heading:"Four reaction types",
    intro:"Redox is one of four main types of biochemical reaction. Step through each station and watch what moves: electrons, water in, water out, or H⁺. Then tell them apart.",
    how:"Choose a station, then use Step (or Play) to run its animation. Open <strong>Zoom to the molecules</strong> for a closer look.",
    stations:[
      { id:"redox", name:"Redox", eq:"NAD⁺ + 2H → NADH + H⁺",
        steps:["A substrate (here, malate) holds two H atoms. NAD⁺ is an empty electron carrier.",
          "An enzyme pulls off the 2 H atoms. Each one travels as H⁺ + e⁻.",
          "NAD⁺ takes both electrons and one H⁺: it is reduced to NADH. The other H⁺ is released.",
          "Electrons (with H) moved from one molecule to another: that’s redox. The substrate is oxidized; NAD⁺ is reduced."],
        zoom:"NAD⁺ picks up both electrons and one H⁺ together, as a hydride ion (H⁻), on one ring of the molecule; the second H⁺ goes into the surrounding water. This is a preview: module 12 looks at NAD⁺ and FAD up close." },
      { id:"hydro", name:"Hydrolysis", eq:"sucrose + H₂O → glucose + fructose",
        steps:["Sucrose is two sugar rings, glucose and fructose, joined through an oxygen. A water molecule arrives.",
          "The water molecule splits into H and OH.",
          "The link between the rings breaks. H joins one sugar and OH joins the other.",
          "Water went in, and one molecule became two: hydrolysis."],
        zoom:"The enzyme sucrase, in your small intestine, adds water across the C–O–C link between the rings. Digestion works this way: hydrolysis takes starch, proteins and fats apart into their building blocks." },
      { id:"cond", name:"Condensation", eq:"glucose + glucose → maltose + H₂O",
        steps:["Two glucose molecules line up: one has an OH and the other an H facing each other.",
          "The OH from one sugar and the H from the other leave together as water.",
          "The rings join through an oxygen bridge: one bigger molecule, maltose.",
          "Two molecules joined and water came out: condensation (dehydration synthesis). It’s hydrolysis in reverse."],
        zoom:"The same kind of reaction links amino acids into proteins, glucose into starch and glycogen, and fatty acids onto glycerol to make a fat. Each new link releases one H₂O." },
      { id:"neut", name:"Neutralization", eq:"H⁺ + HCO₃⁻ → H₂CO₃; HCl + NaOH → NaCl + H₂O",
        steps:["In blood: extra H⁺ (from an acid) meets bicarbonate, HCO₃⁻, a base.",
          "The base takes up the H⁺: H⁺ + HCO₃⁻ → H₂CO₃. The blood doesn’t become too acidic.",
          "In a flask: HCl + NaOH. The acid gives H⁺; the base gives OH⁻.",
          "H⁺ meets OH⁻ and forms water; Na⁺ and Cl⁻ are left as a salt. An acid’s H⁺ met a base: neutralization."],
        zoom:"Neutralization moves H⁺, not electrons, so nothing is oxidized or reduced. In blood, the bicarbonate buffer soaks up extra H⁺ and keeps the pH close to 7.4." }
    ],
    keyTitle:"How to tell",
    keyLocked:"Finish all four stations (step each one to the end) to unlock the key.",
    keyHead:["What you see", "Type"],
    keyRows:[["Electrons or H atoms move from one molecule to another", "Redox"],
      ["Water goes <strong>in</strong> and one molecule splits into two", "Hydrolysis"],
      ["Two molecules join and water comes <strong>out</strong>", "Condensation"],
      ["An acid’s H⁺ meets a base (OH⁻ or HCO₃⁻)", "Neutralization"]],
    quickCheck:{
      title:"Quick check", summary:"Four reaction types quick check",
      items:[
        { id:"q1", goal:4, prompt:"Two amino acids join into a dipeptide, releasing H₂O.",
          choices:[{ t:"redox", fb:QC_WATER_OUT }, { t:"hydrolysis", fb:QC_WATER_OUT }, { t:"condensation", ok:true, fb:"Right. " + QC_WATER_OUT }, { t:"neutralization", fb:QC_WATER_OUT }] },
        { id:"q2", goal:4, prompt:"Lactase splits lactose into glucose and galactose, using water.",
          choices:[{ t:"hydrolysis", ok:true, fb:"Right. " + QC_WATER_IN }, { t:"condensation", fb:QC_WATER_IN }, { t:"redox", fb:QC_WATER_IN }, { t:"neutralization", fb:QC_WATER_IN }] },
        { id:"q3", goal:4, prompt:"Stomach acid (HCl) reacts with an antacid (Mg(OH)₂).",
          choices:[{ t:"neutralization", ok:true, fb:"Right. " + QC_ACID }, { t:"condensation", fb:QC_ACID }, { t:"hydrolysis", fb:QC_ACID }, { t:"redox", fb:QC_ACID }] },
        { id:"q4", goal:4, prompt:"FADH₂ gives two electrons to ubiquinone and becomes FAD.",
          choices:[{ t:"redox", ok:true, fb:"Right. " + QC_E }, { t:"hydrolysis", fb:QC_E }, { t:"neutralization", fb:QC_E }, { t:"condensation", fb:QC_E }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"oxred", type:"sorter", title:"Oxidized or reduced?", summary:"Oxidized or reduced?", noun:"change", goal:[1, 2], txt:true,
        instruction:"Ten changes from cells and chemistry. Sort each one by what happens to the substance on the left of the arrow.",
        boxes:[{ id:"ox", label:"Oxidized", sub:"loses electrons (or H)" }, { id:"red", label:"Reduced", sub:"gains electrons (or H)" }],
        wrongDefault:"Ask what the substance on the left does: lose electrons (or H atoms), or gain them?",
        items:sortItems() },
      { id:"fuel", type:"custom", title:"Carbon scores and fuel value", summary:"Carbon scores and fuel value", star:true, goal:[2, 3],
        instruction:"Seven problems on carbon scores and fuel value. Problems 4 to 7 are non-routine; the last two go beyond the Final Check.",
        how:"",
        rule:"<strong>Electron count rule:</strong> " + ABC + " gives " + RULE + " electrons to O₂ when fully oxidized; each O₂ takes 4. <strong>Carbon score:</strong> C–H −1, C–O +1, C=O +2, C–C 0.",
        items:[
          { id:"r1", kind:"num", goal:2, prompt:"Carbon score of the carbon in CH₃OH (methanol)?",
            answer:-2, display:"−2", unit:"", keypad:"text", general:"Count the bonds to this carbon: C–H −1, C–O +1, C=O +2.",
            wrong:[{ match:-3, fb:"Three C–H (−3) plus one C–O (+1)." }] },
          { id:"r2", kind:"num", goal:2, prompt:"Carbon score of the carbon in HCOOH (formic acid)?",
            answer:2, display:"+2", unit:"", keypad:"text", general:"Count the bonds to this carbon: C–H −1, C–O +1, C=O +2.",
            wrong:[{ match:1, fb:"C=O counts +2, C–O +1, C–H −1." }] },
          { id:"r3", kind:"mc", goal:2, prompt:"Which is more oxidized: formaldehyde (HCHO) or formic acid (HCOOH)?",
            options:[
              { t:"formaldehyde (HCHO)", why:"+2 is further toward CO₂ than 0." },
              { t:"formic acid (HCOOH)", ok:true, why:"Formic acid scores +2 and formaldehyde 0: +2 is further toward CO₂ than 0." }] },
          { id:"r4", kind:"num", goal:3, star:true, prompt:"How many electrons does one ethanol (C₂H₆O) give to O₂ when fully oxidized?",
            answer:12, display:"12 electrons", unit:"electrons", general:"Use the electron count rule in the box above.",
            wrong:[{ match:8, fb:"4(2) + 6 − 2(1) = 12." }],
            hints:["<i>a</i> = 2, <i>b</i> = 6, <i>c</i> = 1.", "8 + 6 − 2.", "12 electrons."] },
          { id:"r5", kind:"num", goal:3, star:true, prompt:"How many O₂ molecules does that take?",
            answer:3, display:"3 O₂", unit:"O₂", general:"Each O₂ takes 4 electrons.",
            wrong:[{ match:12, fb:"Each O₂ takes 4 electrons." }] },
          { id:"r6", kind:"mc", goal:3, star:true, prompt:"Per carbon, which releases more electrons: ethanol (C₂H₆O) or glucose (C₆H₁₂O₆)?",
            options:[
              { t:"ethanol", ok:true, why:"Ethanol: 12 ÷ 2 = 6 per carbon. Glucose: 24 ÷ 6 = 4." },
              { t:"glucose", why:M5 + " 12 ÷ 2 = 6 per carbon; 24 ÷ 6 = 4." }] },
          { id:"r7", kind:"r7", goal:3, star:true, prompt:"A molecule C₃H₈O₃ (glycerol) is fully oxidized. How many O₂ does it use, and how many CO₂ and H₂O form?",
            basis:[["1", "per 1 glycerol"], ["2", "per 2 glycerol"]],
            boxes:[["o2", "O₂ used"], ["co2", "CO₂ formed"], ["h2o", "H₂O formed"]],
            answer:{ "1":{ o2:3.5, co2:3, h2o:4 }, "2":{ o2:7, co2:6, h2o:8 } },
            display:"3.5 O₂ (7 per 2 glycerol); 3 CO₂; 4 H₂O",
            fb:"4(3) + 8 − 2(3) = 14 electrons → 14 ÷ 4 = 3.5 O₂. Carbon gives 3 CO₂; 8 H give 4 H₂O.",
            hints:["Electrons: " + RULE + ".", "12 + 8 − 6 = 14, so 3.5 O₂ (write the equation for 2 glycerol to avoid halves: 7 O₂).", "2C₃H₈O₃ + 7O₂ → 6CO₂ + 8H₂O."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Eitan", how:"",
        instruction:"Eitan made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"In C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, what is oxidized and what is reduced?",
            steps:["Glucose loses its hydrogen atoms.", "So glucose loses electrons: it is oxidized.", "O₂ reacts with glucose, so O₂ is oxidized too.", "So both reactants are oxidized."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"O₂ gains the hydrogen atoms (and their electrons) to form H₂O, so O₂ is reduced.", ok:true, why:M3 + " " + M4 },
              { t:"O₂ is neither oxidized nor reduced.", why:"O₂ → H₂O gains electrons." },
              { t:"Glucose is reduced instead.", why:"Glucose loses H." },
              { t:"Step 3 is correct.", why:"Something must gain the electrons glucose loses." }],
            hints:["Where do glucose’s hydrogens end up?", "In H₂O, with oxygen from O₂.", "The fix: O₂ gains the hydrogen atoms (and their electrons) to form H₂O, so O₂ is reduced."] },
          { id:"e2", goal:4, task:"Classify: maltose + H₂O → glucose + glucose.",
            steps:["One molecule becomes two.", "Water appears in the equation.", "Water is involved, so this is condensation.", "Condensation joins molecules together."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "True in general, but it doesn’t match step 1. The mistake is earlier."],
            fixes:[
              { t:"Water is used up (it’s on the left), and one molecule splits into two, so this is hydrolysis.", ok:true, why:QC_WATER_IN },
              { t:"It’s neutralization because water is involved.", why:M6 },
              { t:"It’s redox because glucose is a fuel.", why:"No electrons move between molecules here." },
              { t:"Step 3 is correct.", why:"Condensation releases water; here water is consumed." }],
            hints:["Is water a reactant or a product?", "A reactant: water goes in.", "Hydrolysis: water is used up and one molecule splits into two."] },
          { id:"e3", goal:2, task:"In malate + NAD⁺ → oxaloacetate + NADH + H⁺, name the oxidizing agent.",
            steps:["Malate loses 2 H atoms.", "So malate is oxidized.", "The oxidizing agent is the substance that is oxidized, so it’s malate.", "NAD⁺ is the reducing agent."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"The oxidizing agent causes oxidation by taking electrons, so it is itself reduced: NAD⁺ is the oxidizing agent, and malate is the reducing agent.", ok:true, why:M2 },
              { t:"Both are oxidizing agents.", why:M2 },
              { t:"H⁺ is the oxidizing agent.", why:"H⁺ is released, not the electron acceptor." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["What does an oxidizing agent <em>do</em> to the other substance?", "It oxidizes it, by taking its electrons.", "NAD⁺ takes the electrons, so NAD⁺ is the oxidizing agent and malate is the reducing agent."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the tug-of-war: that losing hydrogen counts as oxidation, or that O₂ is the one being reduced?" },
      { id:"j2", q:"In your own words, why does oxidizing a fat release more energy than oxidizing a sugar?" },
      { id:"j3", q:"Explain to a friend how to tell hydrolysis, condensation, redox and neutralization apart." },
      { id:"j4", q:"Which part is still unclear: the agents, the carbon scores or the reaction types? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Oxidation is…", options:[
          { t:"the loss of electrons", ok:true, why:"OIL: oxidation is loss." },
          { t:"the gain of electrons", why:"That’s reduction." },
          { t:"the gain of oxygen only", why:"Gaining O is one kind of oxidation, but losing electrons (or H) is the general rule." },
          { t:"the gain of hydrogen", why:"Gaining H is reduction." }] },
        b:{ prompt:"In biology, a molecule that gains hydrogen atoms is usually…", options:[
          { t:"reduced", ok:true, why:"Each H brings an electron." },
          { t:"oxidized", why:M1 },
          { t:"neutralized", why:"Neutralization is acid + base." },
          { t:"hydrolyzed", why:"Hydrolysis uses water to split a molecule." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, which is reduced?", options:[
          { t:"O₂", ok:true, why:"It gains electrons and H, becoming water." },
          { t:"Glucose", why:"Glucose loses H: oxidized." },
          { t:"CO₂", why:"CO₂ is a product." },
          { t:"Nothing; this is combustion, not redox", why:M4 }] },
        b:{ prompt:"In photosynthesis, 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, which is reduced?", options:[
          { t:"CO₂", ok:true, why:"It gains H (electrons) and becomes glucose." },
          { t:"H₂O", why:"Water loses H and becomes O₂: oxidized." },
          { t:"O₂", why:"O₂ is a product here." },
          { t:"Glucose", why:"Glucose is a product." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Glycerol + 3 fatty acids → a fat + 3 H₂O. This is…", options:[
          { t:"condensation", ok:true, why:"Molecules join and water comes out." },
          { t:"hydrolysis", why:"Hydrolysis uses water to split." },
          { t:"neutralization", why:"No acid meets a base here; three molecules join." },
          { t:"redox", why:"No electrons move between molecules." }] },
        b:{ prompt:"A fat + 3 H₂O → glycerol + 3 fatty acids. This is…", options:[
          { t:"hydrolysis", ok:true, why:"Water goes in, and one molecule splits into smaller ones." },
          { t:"condensation", why:"Water is used, not released." },
          { t:"neutralization", why:M6 },
          { t:"redox", why:"No electron transfer." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Which molecule releases the most energy per carbon when fully oxidized to CO₂?", options:[
          { t:"CH₄ (methane)", ok:true, why:"Carbon score −4: the most electrons to give." },
          { t:"CH₃OH (methanol)", why:"Score −2." },
          { t:"HCOOH (formic acid)", why:"Score +2: already mostly oxidized." },
          { t:"CO₂", why:"CO₂ is already fully oxidized." }] },
        b:{ prompt:"Which releases the least energy per carbon when fully oxidized?", options:[
          { t:"HCOOH (formic acid)", ok:true, why:"Score +2: only 2 electrons left to give per carbon." },
          { t:"CH₄", why:"Score −4." },
          { t:"CH₃OH", why:"Score −2." },
          { t:"HCHO", why:"Score 0." }] } },
      { id:"t2", cat:"T", goal:[1, 2],
        a:{ prompt:"In muscle, lactate + NAD⁺ → pyruvate + NADH + H⁺. Which is correct?", options:[
          { t:"Lactate is oxidized and is the reducing agent", ok:true, why:"It loses 2 H to NAD⁺." },
          { t:"Lactate is reduced, because it reacts with NAD⁺", why:M1 },
          { t:"NAD⁺ is the reducing agent", why:"NAD⁺ takes electrons: it’s the oxidizing agent." },
          { t:"Nothing is oxidized, because no oxygen is involved", why:M1 }] },
        b:{ prompt:"In yeast, acetaldehyde + NADH + H⁺ → ethanol + NAD⁺. Which is correct?", options:[
          { t:"Acetaldehyde is reduced, and NADH is the reducing agent", ok:true, why:"Acetaldehyde gains 2 H from NADH." },
          { t:"Acetaldehyde is oxidized", why:M1 },
          { t:"NAD⁺ is the reducing agent", why:M2 },
          { t:"NADH is reduced", why:"NADH gives up H; it is oxidized to NAD⁺." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Some bacteria near deep-sea vents get energy by changing H₂S into sulfur (S). In this change, H₂S is…", options:[
          { t:"oxidized, because it loses hydrogen (electrons)", ok:true, why:"H₂S gives up its H atoms, and their electrons, as it becomes S." },
          { t:"reduced, because it becomes an element", why:"It loses H atoms: oxidation." },
          { t:"neither, because no oxygen is involved", why:M1 },
          { t:"hydrolyzed", why:"No water splits it." }] },
        b:{ prompt:"Some microbes in wetlands make methane: CO₂ + 4H₂ → CH₄ + 2H₂O. The carbon is…", options:[
          { t:"reduced: its score goes from +4 to −4", ok:true, why:"The carbon gains H (and electrons): reduction." },
          { t:"oxidized, because the product contains hydrogen", why:"Gaining H is reduction." },
          { t:"unchanged", why:"Its bonds change from all-oxygen to all-hydrogen." },
          { t:"neutralized", why:M6 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why cells don’t oxidize glucose in one step, the way a fire does?", options:[
          { t:"“The total ΔG is the same, but passing electrons through carriers in small steps lets the cell capture part of the energy as ATP instead of losing it all as heat and light.”", ok:true, why:M7 },
          { t:"“A single step would release more energy than glucose contains.”", why:"ΔG is the same either way." },
          { t:"“Cells can’t oxidize glucose at all; they reduce it.”", why:"Respiration oxidizes glucose." },
          { t:"“One step would leave the electrons nowhere to go.”", why:"The electrons go to O₂ either way." }] },
        b:{ prompt:"Which is the best explanation of why every oxidation in a cell comes with a reduction?", options:[
          { t:"“Electrons can’t vanish: each one lost by one molecule is gained by another.”", ok:true, why:M4 },
          { t:"“Cells need equal amounts of oxygen and hydrogen.”", why:"It’s about electrons, not equal atoms." },
          { t:"“Reduction always happens first and causes oxidation.”", why:"They happen together." },
          { t:"“Enzymes require two reactions at once.”", why:"It’s electron bookkeeping, not an enzyme rule." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which flow chart best shows electrons in aerobic respiration?", options:[
          { t:"glucose → NAD⁺/FAD (carriers) → electron transport chain → O₂ (forms H₂O)", ok:true, why:"Glucose’s electrons ride the carriers to the chain, which hands them to O₂, the final acceptor." },
          { t:"O₂ → glucose → CO₂", why:"Electrons flow <em>to</em> O₂." },
          { t:"glucose → CO₂ → O₂", why:"The electrons don’t stay with the carbon; CO₂ is what’s left of the carbon." },
          { t:"glucose → O₂ directly in one step", why:M7 }] },
        b:{ prompt:"Which statement uses the terms correctly?", options:[
          { t:"“NADH is the reduced form; it carries electrons to the chain.”", ok:true, why:"NADH is the loaded (reduced) form; NAD⁺ is the empty (oxidized) form." },
          { t:"“NAD⁺ is the reduced form.”", why:"NAD⁺ is empty: oxidized." },
          { t:"“NADH is oxidized when it picks up electrons.”", why:M2 },
          { t:"“NADH carries oxygen to the chain.”", why:"It carries electrons and hydrogen." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"An antacid tablet contains Mg(OH)₂. In the stomach: Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O. Which reaction type is it, and why does it ease heartburn?", options:[
          { t:"Neutralization: the base removes stomach acid’s H⁺", ok:true, why:"The base’s OH⁻ meets the acid’s H⁺, making water and a salt." },
          { t:"Condensation: water is released", why:"No two molecules join into a larger one." },
          { t:"Hydrolysis: water splits the acid", why:"Water is a product." },
          { t:"Redox: magnesium gains electrons", why:"No electrons move." }] },
        b:{ prompt:"In blood, H⁺ + HCO₃⁻ → H₂CO₃ stops the blood from becoming too acidic. Which reaction type is it?", options:[
          { t:"Neutralization (buffering): a base takes up H⁺", ok:true, why:"HCO₃⁻ is a base: it takes up the extra H⁺." },
          { t:"Redox: H⁺ is reduced", why:"H⁺ isn’t gaining electrons; it’s combining with a base." },
          { t:"Condensation", why:M6 },
          { t:"Hydrolysis", why:"No water splits anything." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A hibernating bear stores fat rather than sugar. Which is the best chemical reason?", use:"fat ≈ 37 kJ/g, carbohydrate ≈ 17 kJ/g", options:[
          { t:"Fat’s carbons carry more C–H bonds and less oxygen, so oxidizing it releases more energy per gram", ok:true, why:"About 37 kJ/g for fat vs 17 kJ/g for carbohydrate (approximate)." },
          { t:"Sugar contains more energy, but fat is lighter to carry", why:M5 },
          { t:"Fat doesn’t need oxygen to release energy", why:"Fat oxidation needs plenty of O₂." },
          { t:"Fat is already oxidized, so it’s safer to store", why:"Fat is more <em>reduced</em> than sugar." }] },
        b:{ prompt:"Which fuel releases more energy per carbon when fully oxidized: ethanol (C₂H₆O) or acetic acid (vinegar, C₂H₄O₂)?", options:[
          { t:"Ethanol: 12 electrons for 2 carbons, versus 8 for acetic acid", ok:true, why:"4(2) + 6 − 2 = 12; 4(2) + 4 − 4 = 8." },
          { t:"Acetic acid, because it has more oxygen", why:"More oxygen means <em>less</em> left to oxidize." },
          { t:"They’re the same; both have 2 carbons", why:"Their carbons have different scores." },
          { t:"Neither releases energy", why:"Both can be oxidized to CO₂." }] } }
    ]
  },
  task:{
    title:"Electron drop", summary:"Electron drop",
    statement:"<p>In this model, each electron carrier has an <strong>electron pull score</strong>. Higher scores pull electrons harder. Electrons only release energy when they move to a carrier with a <strong>higher</strong> score. Design one electron transfer that meets every condition. Can you find all the answers?</p>" +
      '<div class="tbl-wrap"><table class="rx-qt"><caption class="vh">Pull scores</caption><thead><tr><th scope="col">Carrier (reduced / oxidized form)</th><th scope="col">Pull score</th></tr></thead><tbody>' +
      "<tr><td>NADH / NAD⁺</td><td>1</td></tr><tr><td>FADH₂ / FAD</td><td>2</td></tr><tr><td>ubiquinol / ubiquinone (QH₂ / Q)</td><td>4</td></tr><tr><td>cytochrome <i>c</i> (reduced / oxidized)</td><td>6</td></tr><tr><td>H₂O / O₂</td><td>10</td></tr></tbody></table></div>" +
      '<ol class="rx-reqs"><li>The electrons move “downhill”: the acceptor’s score is higher than the donor’s.</li><li>The transfer releases at least 3 units (enough, in this model, to pump protons).</li><li>The acceptor is <strong>not</strong> O₂: this is a step inside the chain, not the last one.</li><li>The donor is a reduced carrier (NADH, FADH₂, QH₂ or reduced cytochrome <i>c</i>).</li></ol>' +
      '<p class="tiny muted"><span class="bio-model">Model</span> Pull scores are model units in the right order, not measured values. The diagram draws glucose at 0, below NADH, because glucose hands its electrons to NAD⁺ and FAD first.</p>',
    donors:[["nadh", "NADH", 1], ["fadh2", "FADH₂", 2], ["qh2", "QH₂", 4], ["cytr", "reduced cytochrome <i>c</i>", 6], ["glu", "glucose", 0]],
    acceptors:[["nad", "NAD⁺", 1], ["fad", "FAD", 2], ["q", "Q", 4], ["cyto", "oxidized cytochrome <i>c</i>", 6], ["o2", "O₂", 10]],
    levels:[[0, "glucose (fuel)"], [1, "NADH / NAD⁺"], [2, "FADH₂ / FAD"], [4, "QH₂ / Q"], [6, "cytochrome <i>c</i>"], [10, "H₂O / O₂"]],
    checks:["Downhill", "Releases at least 3 units", "Not the final step", "Donor is a reduced carrier"],
    tips:["Electrons only release energy moving to a stronger pull.", "Pick a bigger gap between the two scores.", "O₂ is the last acceptor. Find a step earlier in the chain.", "Glucose gives its electrons to NAD⁺ and FAD first; choose a carrier."],
    after3:"In real mitochondria, electrons visit every carrier in order (module 16): NADH → Q → cytochrome <i>c</i> → O₂. This model only asks which transfers <em>could</em> release energy.",
    explainPrompt:"Explain why electrons release energy when they move to a carrier with a higher pull, and why O₂ is at the bottom of the staircase.",
    vocab:"Use the words oxidized, reduced, electronegative and electron carrier.",
    more:"There’s more than one answer. Can you find all of them?"
  },
  cards:[
    ["OIL RIG", "Oxidation Is Loss, Reduction Is Gain (of electrons)."],
    ["Oxidation in biology", "Often loss of H atoms (H⁺ + e⁻), or gain of O. Example: lactate → pyruvate."],
    ["Reduction in biology", "Often gain of H atoms. Example: NAD⁺ → NADH; O₂ → H₂O."],
    ["Reducing agent", "Gives electrons, so it is oxidized."],
    ["Oxidizing agent", "Takes electrons, so it is reduced. O₂ is the strongest in cells."],
    ["Respiration’s redox", "Glucose is oxidized to CO₂; O₂ is reduced to H₂O."],
    ["Electronegativity", "Pull on shared electrons: O 3.4 &gt; N 3.0 &gt; C 2.6 &gt; H 2.2."],
    ["Why fats store more energy", "More C–H bonds, less O: more electrons to fall toward O₂."],
    ["Electron count rule", ABC + " gives " + RULE + " electrons to O₂; each O₂ takes 4."],
    ["Hydrolysis vs condensation", "Hydrolysis: water in, split. Condensation: join, water out."],
    ["Neutralization", "Acid + base: H⁺ meets OH⁻ or another base (HCO₃⁻ in blood)."]
  ]
};
