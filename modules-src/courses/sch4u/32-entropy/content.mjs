// SCH4U 32 Entropy. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/32-entropy.md
// The hero, the Microstate shuffler, the Part 3 stations and the task are drawn by app.js. Every S° value comes from
// MV.chem.data.S0 (course table additions, plan §6); app.js computes each ΔS° from it.

const DS = "Δ<i>S</i>";
const DSo = "Δ<i>S</i>°";
const So = "<i>S</i>°";

// Misconception core sentences (plan §3)
const M1 = "Count the ways energy and particles can be arranged. Freezing lowers the water’s entropy, but the heat released raises the surroundings’ entropy more.";
const M2 = "Look at the moles of <strong>gas</strong> first. Gas particles have by far the most arrangements.";
const M3 = So + " is per mole: 3 mol of H₂ contribute 3 × 130.7.";
const M4 = "Only Δ<i>H</i>°f is zero for elements. Every substance has a positive " + So + " at 298 K.";
const M5 = "The second law is about the <strong>total</strong>. Heat released to the surroundings raises their entropy.";
const M6 = "All the particles on one side is possible, just extremely unlikely: 1 in 2<sup><i>N</i></sup>.";
const M7 = "Products minus reactants.";

const OTHER = "If they’re equal, use the other clues.";

export default {
  id:"32-entropy",
  kind:"topic",
  title:"Entropy",
  topic:"Entropy",
  readyTopic:"entropy",
  hero:{
    eq:'<span class="en-eq"><span class="nw">' + DSo + " = Σ<i>n</i> " + So + '(products)</span> <span class="nw">− Σ<i>n</i> ' + So + "(reactants)</span></span>", eqSize:"sm",
    eqLabel:"Delta S naught equals the sum of n times S naught of the products, minus the sum of n times S naught of the reactants",
    headline:"Nature bets on the odds",
    text:"<strong>Entropy</strong> counts the ways energy and particles can be arranged: the number of <strong>microstates</strong>. Spread-out arrangements far outnumber bunched-up ones, so changes tend toward them. The <strong>second law</strong> says the entropy of the universe always increases in a spontaneous change.",
    fig:{ html:'<div class="en-hx"><div class="en-hx-states" id="en-hx-states"></div><svg class="en-hx-svg" id="en-hx-svg" viewBox="0 0 560 230" role="img" aria-label="Four gas particles start in the left half of a box. The partition lifts and they spread through the whole box, two on each side. Then a drop of food colouring spreads through a beaker of water."></svg><div class="en-hx-row"><p class="en-hx-cap" id="en-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="en-hx-replay" hidden>Replay</button></div><p class="en-hx-ctr" id="en-hx-ctr" aria-live="polite"></p></div>' }
  },
  goals:[
    "I can describe entropy as the spreading out of energy and matter, using the idea of microstates.",
    "I can predict the sign of " + DS + " for physical changes and reactions.",
    "I can calculate " + DSo + " from standard entropies.",
    "I can state the second law and explain how a system’s entropy can fall in a spontaneous change.",
    "I can connect probability to the direction of change."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"States of matter", goal:2,
          prompt:"In which state do particles have the most freedom to move and spread out?",
          options:[
            { t:"Gas", ok:true, why:"Gas particles move freely through the whole container." },
            { t:"Liquid", why:"Liquid particles slide past each other but stay close." },
            { t:"Solid", why:"Solid particles only vibrate in place." },
            { t:"All the same", why:"Freedom differs a lot between states." }],
          hints:["Think about spacing.", "Which state fills its container?", "Gas."] },
        { id:"w2", skill:"States of matter", goal:2,
          prompt:"Which change turns a solid directly into a gas?",
          options:[
            { t:"Sublimation", ok:true, why:"Dry ice sublimes." },
            { t:"Melting", why:"Melting gives a liquid." },
            { t:"Condensation", why:"Gas to liquid." },
            { t:"Deposition", why:"Gas to solid." }],
          hints:["Solid → gas skips a state.", "Dry ice is an example.", "Sublimation."] },
        { id:"w3", skill:"System and surroundings", goal:4,
          prompt:"A hand warmer releases heat. What happens to the surroundings?",
          options:[
            { t:"They gain energy and warm up", ok:true, why:"The heat leaves the warmer (the system) and goes into the surroundings." },
            { t:"They lose energy", why:"Energy flows from the warmer (system) out to the surroundings." },
            { t:"Nothing", why:"Energy is conserved; it goes somewhere." },
            { t:"They lose mass", why:"Heat isn’t matter." }],
          hints:["Exothermic: where does the heat go?", "Out of the system.", "The surroundings gain it."] },
        { id:"w4", skill:"System and surroundings", goal:4,
          prompt:"For an exothermic reaction, the sign of Δ<i>H</i> is…",
          options:[
            { t:"negative", ok:true, why:"The system loses enthalpy." },
            { t:"positive", why:"Positive means endothermic." },
            { t:"zero", why:"Heat is transferred." },
            { t:"It depends on the temperature only.", why:"Exothermic fixes the sign." }],
          hints:["From whose point of view is Δ<i>H</i>?", "The system’s.", "It loses heat: negative."] },
        { id:"w5", skill:"Reading data tables", goal:3,
          prompt:"Δ<i>H</i>° for a reaction is Σ<i>n</i>Δ<i>H</i>°f(products) − Σ<i>n</i>Δ<i>H</i>°f(reactants). What does <i>n</i> stand for?",
          options:[
            { t:"The coefficient of each substance in the balanced equation", ok:true, why:"Each tabulated value is multiplied by its coefficient." },
            { t:"The number of atoms in each formula", why:"Use coefficients." },
            { t:"The number of products", why:"Each substance has its own <i>n</i>." },
            { t:"The temperature in kelvin", why:"<i>n</i> is moles." }],
          hints:["Look at the balanced equation.", "The big numbers in front.", "The coefficients."] },
        { id:"w6", skill:"Reading data tables", goal:3,
          prompt:"Which quantity is zero for an element in its standard state?",
          options:[
            { t:"Δ<i>H</i>°f", ok:true, why:"Forming an element from itself takes no enthalpy change." },
            { t:So, why:"Every substance has positive entropy at 298 K." },
            { t:"Molar mass", why:"Elements have mass." },
            { t:"Both Δ<i>H</i>°f and " + So, why:M4 }],
          hints:["Which table lists elements as 0?", "The formation table.", "Δ<i>H</i>°f only."] }
      ],
      refreshers:{
        "States of matter":"Solids vibrate in place, liquids slide, gases fly freely. Freedom, and so entropy, rises from solid to liquid to gas.",
        "System and surroundings":"The system is what you study; everything else is the surroundings. Exothermic changes send heat to the surroundings (Δ<i>H</i> &lt; 0).",
        "Reading data tables":"Multiply each tabulated value by its coefficient, then take products minus reactants. Only Δ<i>H</i>°f is zero for elements."
      }
    }
  },
  explore:{
    heading:"Microstate shuffler",
    intro:"Count the ways particles can arrange themselves, then watch real changes spread out.",
    how:"<strong>Spreading out:</strong> set the number of particles, open the partition, then press <strong>Shuffle</strong> for one random arrangement or <strong>Count all</strong> to fill the table and chart. <strong>Changes and reactions:</strong> choose a process card and press <strong>Run the change</strong>.",
    modes:[{ id:"spread", t:"Spreading out" }, { id:"rx", t:"Changes and reactions" }],
    whys:[
      { id:"heat", t:"The heat it releases raises the entropy of the surroundings by more than the system’s entropy falls." },
      { id:"cant", t:"It can’t happen, since entropy decreases." },
      { id:"tidy", t:"Its entropy really rises, because fewer molecules can move faster." }
    ],
    predictions:[
      { id:"p1", prompt:"<i>N</i> = 4, all on the left. Open the partition. Which split will you find most often?",
        options:[{ t:"2 and 2", ok:true }, { t:"4 and 0" }, { t:"3 and 1" }, { t:"every split equally" }],
        explain:"2 | 2 has the most arrangements (6 of 16)." },
      { id:"p2", prompt:"<i>N</i> = 10. What is the chance of finding all 10 particles on the left at one instant?",
        options:[{ t:"1/10" }, { t:"1/2" }, { t:"1/20" }, { t:"1/1024", ok:true }],
        explain:"Each particle has 2 choices: 2<sup>10</sup> = 1024. Possible, but you’d almost never see it." },
      { id:"p3", prompt:"Dry ice subliming. Sign of " + DS + "?",
        options:[{ t:"positive", ok:true }, { t:"negative" }, { t:"zero" }, { t:"can’t tell" }],
        explain:"Solid → gas: a big increase in arrangements." },
      { id:"p4", prompt:"2H₂(g) + O₂(g) → 2H₂O(l). Sign of " + DS + "?",
        options:[{ t:"negative", ok:true }, { t:"positive" }, { t:"zero" }, { t:"can’t tell without data" }],
        explain:"Three moles of gas become liquid: far fewer arrangements. (Yet this reaction is spontaneous, because it releases heat to the surroundings.)" }
    ],
    chalIntro:"Use the shuffler to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 5], prompt:"Set <i>N</i> so that the most likely split has exactly <strong>20</strong> arrangements.",
        why:"Six particles: the 3 | 3 split has 20 of the 2<sup>6</sup> = 64 arrangements.",
        hints:["Try even <i>N</i> and read the middle bar.", "<i>N</i> = 4 gives 6; <i>N</i> = 8 gives 70.", "<i>N</i> = 6: 20 ways."] },
      { id:"tc2", goal:3, prompt:"Use the " + So + " panel to find " + DSo + " for CaCO₃(s) → CaO(s) + CO₂(g).",
        why:DSo + " = (38.1 + 213.8) − 92.9 = +159.0 J/K. A gas forms from a solid, so the entropy rises.",
        hints:["Products: CaO and CO₂.", "38.1 + 213.8 = 251.9.", "251.9 − 92.9 = +159.0 J/K."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"For N₂(g) + 3H₂(g) → 2NH₃(g): enter " + DSo + ", then choose why the reaction can still happen at room temperature.",
        why:DSo + " = 2(192.8) − [191.6 + 3(130.7)] = −198.1 J/K. The system’s entropy falls, but the heat released raises the surroundings’ entropy by more, so the total still rises.",
        hints:["2(192.8) − [191.6 + 3(130.7)].", "385.6 − 583.7 = −198.1 J/K.", "Δ<i>H</i> is negative: the heat released spreads into the surroundings."] }
    ]
  },
  part3:{
    slug:"predict", name:"Predict", heading:"Predict " + DS,
    intro:"Three stations: sort reactions with the gas rule and check them with data, see the other clues at work, then watch the second law balance a system against its surroundings.",
    s1:{ title:"Station 1: The gas rule",
      intro:"Sort each reaction by counting moles of gas on each side. More gas → " + DS + " &gt; 0; less gas → " + DS + " &lt; 0; the same → about zero.",
      bins:[{ id:"pos", label:DS + " &gt; 0", sub:"more moles of gas" }, { id:"neg", label:DS + " &lt; 0", sub:"fewer moles of gas" }, { id:"zero", label:"about zero", sub:"the same moles of gas" }],
      items:[
        { id:"a1", eq:"CaCO3(s) -> CaO(s) + CO2(g)", r:[[1, "CaCO3(s)"]], p:[[1, "CaO(s)"], [1, "CO2(g)"]], g:[0, 1], answer:"pos" },
        { id:"a2", eq:"N2(g) + 3H2(g) -> 2NH3(g)", r:[[1, "N2(g)"], [3, "H2(g)"]], p:[[2, "NH3(g)"]], g:[4, 2], answer:"neg" },
        { id:"a3", eq:"C(s) + O2(g) -> CO2(g)", r:[[1, "C(graphite)"], [1, "O2(g)"]], p:[[1, "CO2(g)"]], g:[1, 1], answer:"zero" },
        { id:"a4", eq:"H2O(l) -> H2O(g)", r:[[1, "H2O(l)"]], p:[[1, "H2O(g)"]], g:[0, 1], answer:"pos" },
        { id:"a5", eq:"2H2(g) + O2(g) -> 2H2O(g)", r:[[2, "H2(g)"], [1, "O2(g)"]], p:[[2, "H2O(g)"]], g:[3, 2], answer:"neg" },
        { id:"a6", eq:"CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)", r:[[1, "CH4(g)"], [2, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(g)"]], g:[3, 3], answer:"zero" }
      ],
      data:"Each " + DSo + " below is Σ<i>n</i> " + So + "(products) − Σ<i>n</i> " + So + "(reactants), using the " + So + " panel. “About zero” reactions land within a few J/K of zero." },
    s2:{ title:"Station 2: Other clues",
      intro:"When the gas count doesn’t change, use the other clues. Choose a clue and watch the particles.",
      clues:[
        { id:"diss", t:"Dissolving", eq:"NaCl(s) -> Na+(aq) + Cl-(aq)", sign:DS + " &gt; 0 (usually)", text:"Dissolving a solid usually increases <i>S</i>: the ions break out of the crystal and spread through the water." },
        { id:"mix", t:"Mixing", eq:"", sign:DS + " &gt; 0", text:"Mixing increases <i>S</i>: there are far more ways to arrange two kinds of particle mixed together than kept apart." },
        { id:"heat", t:"Heating", eq:"", sign:DS + " &gt; 0", text:"Heating increases <i>S</i>: faster particles can share out their energy in many more ways." },
        { id:"ppt", t:"Forming a precipitate", eq:"Ag+(aq) + Cl-(aq) -> AgCl(s)", sign:DS + " &lt; 0 (usually)", text:"Forming a solid precipitate from ions in solution usually decreases <i>S</i>: free ions lock into a solid." }
      ] },
    s3:{ title:"Station 3: The second law in one picture",
      intro:"The second law is about the total entropy of the system <em>and</em> its surroundings. Choose a case and show the entropy changes.",
      cases:[
        { id:"freeze", t:"Water freezing at −10 °C", text:"The water’s entropy falls as it locks into ice, but the heat it releases spreads into the colder surroundings and raises their entropy by more. The total rises, so freezing happens on its own." },
        { id:"protein", t:"A cell making a protein", text:"Linking amino acids into one ordered protein lowers the system’s entropy, but the cell releases heat and small molecules to its surroundings, so the total entropy still rises." }
      ],
      note:M5 },
    quickCheck:{
      title:"Quick check", summary:"Predict ΔS quick check",
      items:[
        { id:"q1", goal:2, prompt:"2SO₂(g) + O₂(g) → 2SO₃(g): sign of " + DS + "?",
          choices:[
            { t:"−", ok:true, fb:"Right. 3 mol of gas → 2 mol of gas: fewer arrangements." },
            { t:"+", fb:"3 mol gas → 2 mol gas. " + M2 },
            { t:"about 0", fb:"3 mol gas → 2 mol gas. " + M2 },
            { t:"can’t tell", fb:"3 mol gas → 2 mol gas. " + M2 }] },
        { id:"q2", goal:2, prompt:"NH₄Cl(s) → NH₄⁺(aq) + Cl⁻(aq): sign?",
          choices:[
            { t:"+", ok:true, fb:"Right. Dissolving frees the ions." },
            { t:"−", fb:"Dissolving frees the ions." },
            { t:"about 0", fb:"Dissolving frees the ions." },
            { t:"can’t tell", fb:"Dissolving frees the ions." }] },
        { id:"q3", goal:2, prompt:"H₂(g) + Cl₂(g) → 2HCl(g): best prediction?",
          choices:[
            { t:"about 0", ok:true, fb:"Right. 2 mol of gas → 2 mol of gas, with no other big clue." },
            { t:"strongly +", fb:"2 mol gas → 2 mol gas: look for other clues." },
            { t:"strongly −", fb:"2 mol gas → 2 mol gas: look for other clues." },
            { t:"can’t tell", fb:"2 mol gas → 2 mol gas: look for other clues." }] },
        { id:"q4", goal:2, prompt:"Ag⁺(aq) + Cl⁻(aq) → AgCl(s): sign?",
          choices:[
            { t:"−", ok:true, fb:"Right. Free ions lock into a solid." },
            { t:"+", fb:"Free ions lock into a solid." },
            { t:"about 0", fb:"Free ions lock into a solid." },
            { t:"can’t tell", fb:"Free ions lock into a solid." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sign", type:"sorter", title:"Sign sort", summary:"Sign sort", goal:2, noun:"change", txt:true,
        instruction:"Sort each change by the sign of " + DS + ".",
        boxes:[{ id:"pos", label:DS + " &gt; 0" }, { id:"neg", label:DS + " &lt; 0" }, { id:"zero", label:"about zero" }],
        items:[
          { id:"i1", t:"Iodine subliming", answer:"pos", why:"Solid → gas: many more arrangements.",
            hints:["Count gas moles.", OTHER, DS + " &gt; 0: a solid becomes a gas."] },
          { id:"i2", t:"Water freezing", answer:"neg", why:"Liquid → solid: the molecules lock in place.",
            hints:["Count gas moles.", OTHER, DS + " &lt; 0: liquid → solid."] },
          { id:"i3", t:"Sugar dissolving in tea", answer:"pos", why:"Dissolving spreads the sugar through the tea.",
            hints:["Count gas moles.", OTHER, DS + " &gt; 0: dissolving."] },
          { id:"i4", t:"N₂(g) + O₂(g) → 2NO(g)", answer:"zero", why:"2 mol of gas → 2 mol of gas.",
            wrong:{ pos:"2 mol of gas → 2 mol of gas." },
            hints:["Count gas moles.", OTHER, "About zero: 2 mol of gas → 2 mol of gas."] },
          { id:"i5", t:"2NO₂(g) → N₂O₄(g)", answer:"neg", why:"2 mol of gas → 1 mol of gas.",
            wrong:{ pos:"Two gas molecules become one. " + M2 },
            hints:["Count gas moles.", OTHER, DS + " &lt; 0: 2 mol of gas → 1 mol."] },
          { id:"i6", t:"CaCO₃(s) → CaO(s) + CO₂(g)", answer:"pos", why:"0 mol of gas → 1 mol of gas.",
            hints:["Count gas moles.", OTHER, DS + " &gt; 0: a gas forms."] },
          { id:"i7", t:"Perfume spreading through a room", answer:"pos", why:"Mixing and spreading out: far more arrangements.",
            hints:["Count gas moles.", OTHER, DS + " &gt; 0: spreading out."] },
          { id:"i8", t:"4Fe(s) + 3O₂(g) → 2Fe₂O₃(s)", answer:"neg", why:"3 mol of gas → 0 mol of gas.",
            wrong:{ pos:"A gas is locked into a solid." },
            hints:["Count gas moles.", OTHER, DS + " &lt; 0: the gas is used up."] }
        ],
        wrongDefault:"Count the moles of gas on each side first. " + OTHER },
      { id:"calc", type:"numeric", title:"Calculate " + DSo, summary:"Calculate ΔS°", goal:[3, 4],
        instruction:"Use the " + So + " panel. Multiply each " + So + " by its coefficient, then take products minus reactants.",
        how:"Type your answer with its sign (for example −12.3), then press Check.",
        items:[
          { id:"c1", goal:3, prompt:"H₂O(l) → H₂O(g)", answer:118.9, tol:0.002, unit:"J/K", display:"+118.9 J/K",
            why:"188.8 − 69.9 = +118.9 J/K.",
            wrong:[{ match:-118.9, fb:M7 }],
            hints:["Products minus reactants.", "188.8 − 69.9.", "+118.9 J/K."] },
          { id:"c2", goal:3, prompt:"2H₂(g) + O₂(g) → 2H₂O(g)", answer:-89.0, tol:0.002, unit:"J/K", display:"−89.0 J/K",
            why:"2(188.8) − [2(130.7) + 205.2] = 377.6 − 466.6 = −89.0 J/K.",
            wrong:[{ match:-147.1, fb:"Multiply by the coefficients. " + M3 }, { match:89.0, fb:M7 }],
            hints:["Multiply each " + So + " by its coefficient.", "Products 2(188.8) = 377.6; reactants 2(130.7) + 205.2 = 466.6.", "377.6 − 466.6 = −89.0 J/K."] },
          { id:"c3", goal:3, star:true, prompt:"CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)", answer:-243.1, tol:0.002, unit:"J/K", display:"−243.1 J/K",
            why:"[213.8 + 2(69.9)] − [186.3 + 2(205.2)] = 353.6 − 596.7 = −243.1 J/K.",
            wrong:[{ match:-5.3, fb:"That’s with water vapour; here the water is liquid." }, { match:-107.8, fb:M3 }],
            hints:["The water is liquid: use " + So + "(H₂O(l)).", "Products 213.8 + 2(69.9) = 353.6; reactants 186.3 + 2(205.2) = 596.7.", "353.6 − 596.7 = −243.1 J/K."] },
          { id:"c4", goal:3, star:true, prompt:"2NH₃(g) → N₂(g) + 3H₂(g)", answer:198.1, tol:0.002, unit:"J/K", display:"+198.1 J/K",
            why:"[191.6 + 3(130.7)] − 2(192.8) = 583.7 − 385.6 = +198.1 J/K.",
            wrong:[{ match:129.5, fb:M3 }, { match:-198.1, fb:M7 }],
            hints:["Multiply each " + So + " by its coefficient.", "Products 191.6 + 3(130.7) = 583.7; reactants 2(192.8) = 385.6.", "583.7 − 385.6 = +198.1 J/K."] },
          { id:"c5", goal:3, star:true, prompt:"C(graphite) + 2H₂(g) → CH₄(g) has " + DSo + " = −80.8 J/K. Find " + So + "(CH₄) from the other values.", answer:186.3, tol:0.002, unit:"J/(mol·K)", display:"186.3 J/(mol·K)",
            why:So + "(CH₄) = −80.8 + 5.7 + 2(130.7) = 186.3 J/(mol·K).",
            wrong:[{ match:55.6, fb:"Use 2 × 130.7 for the two moles of H₂: " + So + "(CH₄) = −80.8 + 5.7 + 2(130.7). " + M3 }],
            hints:["Write the formula with " + So + "(CH₄) as the unknown.", "−80.8 = " + So + "(CH₄) − [5.7 + 261.4].", So + "(CH₄) = −80.8 + 267.1 = 186.3."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Rafael", goal:[2, 3],
        instruction:"Rafael made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find " + DSo + " for N₂(g) + 3H₂(g) → 2NH₃(g).",
            steps:[DSo + " = Σ" + So + "(products) − Σ" + So + "(reactants).", "Products: 192.8.", "Reactants: 191.6 + 130.7 = 322.3.", DSo + " = 192.8 − 322.3 = −129.5 J/K."],
            answer:1,
            stepFb:["Step 1 is the right formula, if you include coefficients.", "", "Step 3 repeats the same slip.", "Step 4 follows."],
            fixes:[
              { t:"Products: 2 × 192.8 = 385.6; reactants: 191.6 + 3 × 130.7 = 583.7; " + DSo + " = −198.1 J/K.", ok:true, why:M3 },
              { t:"Use Δ<i>H</i>°f instead.", why:DSo + " needs standard entropies, not enthalpies of formation." },
              { t:"Products: 192.8 ÷ 2.", why:"Multiply by the coefficient; don’t divide." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["How many NH₃ are made?", "2 mol.", "2 × 192.8."] },
          { id:"e2", goal:2, task:"Predict and check the sign of " + DS + " for CaCO₃(s) → CaO(s) + CO₂(g).",
            steps:["Moles of gas go from 0 to 1, so predict " + DS + " &gt; 0.", DSo + " = " + So + "(CaCO₃) − [" + So + "(CaO) + " + So + "(CO₂)].", "= 92.9 − 251.9 = −159.0 J/K.", "So the prediction was wrong."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows."],
            fixes:[
              { t:"Products minus reactants: 251.9 − 92.9 = +159.0 J/K, which matches the prediction.", ok:true, why:M7 },
              { t:"Add all three.", why:DSo + " is a difference: products minus reactants." },
              { t:"Ignore the solids.", why:"Solids have positive " + So + " too: include every substance." },
              { t:"Step 2 is correct.", why:M7 }],
            hints:["Which side comes first in the formula?", "Products.", "+159.0 J/K."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about how fast the odds grow (16 arrangements for 4 particles, 1024 for 10)?" },
      { id:"j2", q:"In your own words, explain why gases spread out." },
      { id:"j3", q:"Explain to a friend how to predict the sign of " + DS + " for a reaction in five seconds." },
      { id:"j4", q:"What still confuses you about the second law? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which change has " + DS + " &gt; 0?", options:[
          { t:"Ice melting", ok:true, why:"Solid → liquid raises <i>S</i>." },
          { t:"Water freezing", why:"Liquid → solid lowers <i>S</i>." },
          { t:"Steam condensing", why:"Gas → liquid lowers <i>S</i>." },
          { t:"Ions forming a precipitate", why:"Ions lock into a solid." }] },
        b:{ prompt:"Which change has " + DS + " &lt; 0?", options:[
          { t:"Water vapour condensing", ok:true, why:"Gas → liquid lowers <i>S</i>." },
          { t:"Sugar dissolving", why:"Dissolving usually raises <i>S</i>." },
          { t:"Dry ice subliming", why:"Solid → gas raises <i>S</i>." },
          { t:"Ice melting", why:"Solid → liquid raises <i>S</i>." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"The second law of thermodynamics says that in every spontaneous change, the entropy of the universe…", options:[
          { t:"increases", ok:true, why:"The total entropy of the system and surroundings always rises in a spontaneous change." },
          { t:"stays the same", why:"That’s only for an ideal reversible change." },
          { t:"decreases", why:"It never decreases overall." },
          { t:"becomes zero", why:"Entropy doesn’t drop to zero." }] },
        b:{ prompt:"Which must increase in every spontaneous change?", options:[
          { t:"The total entropy of the system and its surroundings", ok:true, why:"That’s the second law." },
          { t:"The system’s entropy", why:M5 },
          { t:"The system’s enthalpy", why:"Enthalpy can go either way." },
          { t:"The temperature of the surroundings", why:"Not necessarily." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which statement about standard entropies at 298 K is true?", options:[
          { t:"Every substance, including elements, has " + So + " &gt; 0", ok:true, why:"Every substance has some spread of energy at 298 K." },
          { t:"Elements have " + So + " = 0", why:M4 },
          { t:"Gases have " + So + " = 0", why:"Gases have the largest values." },
          { t:"Solids have negative " + So, why:"No substance has negative " + So + " here." }] },
        b:{ prompt:"Which has the largest " + So + " per mole at 298 K?", options:[
          { t:"H₂O(g)", ok:true, why:"188.8 J/(mol·K)." },
          { t:"H₂O(l)", why:"69.9." },
          { t:"NaCl(s)", why:"72.1." },
          { t:"C(graphite)", why:"5.7." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find " + DSo + " for 2H₂(g) + O₂(g) → 2H₂O(g).", options:[
          { t:"−89.0 J/K", ok:true, why:"377.6 − 466.6." },
          { t:"−147.1 J/K", why:M3 },
          { t:"+89.0 J/K", why:M7 },
          { t:"−326.8 J/K", why:"That uses liquid water." }] },
        b:{ prompt:"Find " + DSo + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).", options:[
          { t:"−243.1 J/K", ok:true, why:"353.6 − 596.7." },
          { t:"−107.8 J/K", why:M3 },
          { t:"+243.1 J/K", why:M7 },
          { t:"−5.3 J/K", why:"That uses water vapour." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Which reaction has the most positive " + DS + "?", options:[
          { t:"2NH₃(g) → N₂(g) + 3H₂(g)", ok:true, why:"2 → 4 mol of gas." },
          { t:"CaCO₃(s) → CaO(s) + CO₂(g)", why:"0 → 1 mol of gas: positive, but smaller." },
          { t:"C(s) + O₂(g) → CO₂(g)", why:"1 → 1 mol of gas: about zero." },
          { t:"H₂O(g) → H₂O(l)", why:"Negative." }] },
        b:{ prompt:"Which reaction has the most negative " + DS + "?", options:[
          { t:"2H₂(g) + O₂(g) → 2H₂O(l)", ok:true, why:"3 → 0 mol of gas." },
          { t:"N₂(g) + 3H₂(g) → 2NH₃(g)", why:"4 → 2: negative, but less." },
          { t:"H₂O(g) → H₂O(l)", why:"1 → 0." },
          { t:"C(s) + O₂(g) → CO₂(g)", why:"About zero." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Six gas particles move between two equal halves of a box. What is the chance of finding all six in one particular half?", options:[
          { t:"1/64", ok:true, why:"2<sup>6</sup> = 64 arrangements, 1 of them all in that half." },
          { t:"1/6", why:"Each particle has 2 choices, so multiply 2s." },
          { t:"1/20", why:"20 is the number of ways for a 3 | 3 split." },
          { t:"0", why:"Possible, just unlikely. " + M6 }] },
        b:{ prompt:"Eight particles, two equal halves. Chance of finding all eight in one particular half?", options:[
          { t:"1/256", ok:true, why:"2<sup>8</sup> = 256 arrangements, 1 of them all in that half." },
          { t:"1/8", why:"Each particle has 2 choices, so multiply 2s." },
          { t:"1/70", why:"70 is the number of ways for a 4 | 4 split." },
          { t:"0", why:"Possible, just unlikely. " + M6 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Water freezes on a cold day even though " + DS + "(system) &lt; 0. Which is the best explanation?", options:[
          { t:"“Freezing releases heat, which raises the entropy of the colder surroundings by more than the water’s entropy falls, so the total increases.”", ok:true, why:"It names the system, the surroundings and the total." },
          { t:"“The second law doesn’t apply to water.”", why:"It applies to everything." },
          { t:"“Freezing has " + DS + " &gt; 0 because ice is a crystal.”", why:M1 },
          { t:"“Entropy always decreases in cold weather.”", why:"The total still increases." }] },
        b:{ prompt:"A cell builds an ordered protein (" + DS + " &lt; 0 for that step). Which best explains why this doesn’t break the second law?", options:[
          { t:"“The cell releases heat and small molecules to its surroundings, so the total entropy still rises.”", ok:true, why:"The second law is about the total." },
          { t:"“Living things are exempt from the second law.”", why:"Nothing is exempt." },
          { t:"“Proteins have more entropy than amino acids.”", why:M1 },
          { t:"“The protein’s enthalpy is zero.”", why:"Enthalpy isn’t the point here." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of entropy?", options:[
          { t:"“A measure of how many ways energy and particles can be arranged, or how spread out they are”", ok:true, why:"Entropy counts arrangements (microstates)." },
          { t:"“The heat content of a substance.”", why:"That’s enthalpy." },
          { t:"“How fast a reaction goes.”", why:"That’s rate." },
          { t:"“How messy something looks.”", why:M1 }] },
        b:{ prompt:"Why does a gas spread to fill its container?", options:[
          { t:"“Spread-out arrangements vastly outnumber bunched-up ones, so the gas is almost certain to be found spread out.”", ok:true, why:"It’s about the odds, not a force." },
          { t:"“The particles repel each other strongly.”", why:"Gas particles barely interact." },
          { t:"“A force pushes them outward.”", why:"No force is needed." },
          { t:"“Bunching up is impossible.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Lime (CaO) is made by heating limestone: CaCO₃(s) → CaO(s) + CO₂(g). Find " + DSo + ".", options:[
          { t:"+159.0 J/K", ok:true, why:"(38.1 + 213.8) − 92.9." },
          { t:"−159.0 J/K", why:M7 },
          { t:"+344.8 J/K", why:"Subtract the reactant; don’t add it." },
          { t:"+120.9 J/K", why:"Include CaO." }] },
        b:{ prompt:"Ammonia can be split: 2NH₃(g) → N₂(g) + 3H₂(g). Find " + DSo + ".", options:[
          { t:"+198.1 J/K", ok:true, why:"[191.6 + 3(130.7)] − 2(192.8)." },
          { t:"−198.1 J/K", why:M7 },
          { t:"+129.5 J/K", why:M3 },
          { t:"+390.9 J/K", why:"Multiply NH₃ by 2 as well. " + M3 }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A cold pack works when solid ammonium chloride dissolves in water. It absorbs heat, yet it happens on its own. What drives it?", options:[
          { t:"“A large increase in entropy as the solid breaks into freely moving ions”", ok:true, why:"Dissolving frees the ions." },
          { t:"“Absorbing heat always makes a change spontaneous.”", why:"Endothermic changes are usually not spontaneous." },
          { t:"“The enthalpy decreases.”", why:"It’s endothermic: Δ<i>H</i> &gt; 0." },
          { t:"“Entropy decreases, which favours dissolving.”", why:"It increases." }] },
        b:{ prompt:"Burning a log turns a solid into ash and gases. Which statement about " + DS + " is right?", options:[
          { t:"“" + DS + " &gt; 0, because gases (CO₂ and water vapour) form from a solid”", ok:true, why:"Gas forms from a solid." },
          { t:"“" + DS + " &lt; 0, because ash is ordered.”", why:M1 },
          { t:"“" + DS + " = 0, because mass is conserved.”", why:"Mass conservation doesn’t fix <i>S</i>." },
          { t:"“" + DS + " can’t be predicted.”", why:"The gas count predicts it." }] } }
    ]
  },
  task:{
    title:"Gas used, entropy up", summary:"Gas used, entropy up",
    statement:"<p>Choose a reaction card, a direction and, where it matters, whether the water is liquid or gas. Find every process that <strong>uses up a gas</strong> but still has a <strong>small positive</strong> " + DSo + ".</p>",
    checks:["Entropy increases", "A gas is used up", "Only a small increase"],
    tips:["Reverse a reaction to flip the sign of " + DSo + ".", "Check what’s on the left after you choose the direction.", "Large increases come from creating lots of gas. Look for reactions where the gas count barely changes."],
    explainPrompt:"Explain how the change in moles of gas predicts the size and sign of " + DSo + " for your answers.",
    vocab:"Use the words entropy, moles of gas, microstates and spontaneous.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"In each one the gas count rises by at most one mole, or doesn’t change at all, so the increase is small."
  },
  cards:[
    ["Entropy (<i>S</i>)", "How spread out energy and matter are: the number of possible arrangements."],
    ["Microstate", "One specific arrangement of particles and energy."],
    ["Why gases spread", "Spread-out arrangements vastly outnumber bunched ones."],
    ["Gas rule", "More moles of gas → " + DS + " &gt; 0; fewer → " + DS + " &lt; 0."],
    ["Other " + DS + " &gt; 0 clues", "Melting, boiling, dissolving, mixing, heating."],
    [So, "Standard molar entropy, J/(mol·K), positive for every substance at 298 K."],
    [DSo, "Σ<i>n</i> " + So + "(products) − Σ<i>n</i> " + So + "(reactants)."],
    ["Elements", "Δ<i>H</i>°f = 0 but " + So + " &gt; 0."],
    ["Second law", "The total entropy of the universe increases in every spontaneous change."],
    ["System entropy can fall", "If heat released raises the surroundings’ entropy more."],
    ["Chance all <i>N</i> particles in one half", "1/2<sup><i>N</i></sup>: possible but unlikely."]
  ]
};
