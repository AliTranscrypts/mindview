// SCH4U 52 The Hall–Héroult Process. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/52-hall-heroult.md
// The pot pictures (hero, Aluminium smelter, task dashboard) and the cost calculator are drawn by app.js.
// Model values (plan §1 and §6): melting temperatures 960 °C / 2050 °C, cell voltages 4.0 V / 5.0 V, CO₂ factors
// hydro 0.02, gas 0.5, coal 1.0 kg/kWh, 12 kWh/kg, remelting at 5%. They are labelled "model" wherever students see them.
// VERIFY: the 5% remelting figure, the Quebec smelter count and power source, and the status of inert-anode research.

// Misconception core sentences (plan §3)
const M1 = "Cryolite is the solvent. It dissolves alumina so the bath is liquid at about 960 °C. The aluminium comes from Al₂O₃.";
const M2 = "Water (−0.83 V) is reduced before Al³⁺ (−1.66 V): you get H₂, not Al.";
const M3 = "Moles of Al = moles of e⁻ ÷ 3.";
const M4 = "The anodes react: C + 2O²⁻ → CO₂ + 4e⁻. They burn away and are replaced.";
const M5 = "2Al₂O₃ + 3C → 4Al + 3CO₂: 3 C (and 3 CO₂) for every 4 Al.";
const M6 = "Electricity can produce far more CO₂ than the anodes if it comes from fossil fuels.";
const M7 = "Scrap is already metal: it only needs remelting, not reducing.";
const EQ = '<span class="chem">2Al<sub>2</sub>O<sub>3</sub> + 3C → 4Al + 3CO<sub>2</sub></span>';
const USE = "<em>F</em> = 96 500 C/mol; Al 27.0, C 12.0, CO₂ 44.0 g/mol";

const SORT_HINTS = (ans) => ["Oxidation or reduction?", "An Ox, Red Cat.", ans];

export default {
  id:"52-hall-heroult",
  kind:"topic",
  title:"The Hall–Héroult process",
  topic:"The Hall–Héroult Process",
  readyTopic:"the Hall–Héroult process",
  hero:{
    eq:'<span class="hh-eq">' + EQ + ' <span class="hh-eqn">(in molten cryolite, about 960 °C)</span></span>', eqSize:"sm",
    eqLabel:"2 A l 2 O 3 plus 3 C gives 4 A l plus 3 C O 2, in molten cryolite at about 960 degrees Celsius",
    headline:"Aluminium is made with lightning in a pot",
    text:"Aluminium (often spelled <em>aluminum</em> in North America) is the most common metal in Earth’s crust, but it holds onto oxygen tightly. The <strong>Hall–Héroult process</strong> dissolves <strong>alumina</strong> in molten <strong>cryolite</strong> and drives a huge current through it. Aluminium forms at the <strong>cathode</strong> and the carbon <strong>anodes</strong> burn away as CO₂.",
    fig:{ html:'<div class="hh-hx"><svg class="hh-svg" id="hh-hx-svg" viewBox="0 0 480 300" role="img" aria-label="A cutaway smelting pot. A carbon-lined steel shell, the cathode (−), holds a pale molten bath. Three carbon blocks, the anodes (+), dip in from above. Orange Al³⁺ ions drift down and join a silver pool of liquid aluminium on the floor. Magenta O²⁻ ions drift up to the blocks, which shrink as CO₂ bubbles rise."></svg><div class="hh-hx-row"><p class="hh-hx-cap" id="hh-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="hh-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can describe the Hall–Héroult cell (electrolyte, cryolite’s role, electrodes, half-reactions, overall reaction).",
    "I can explain why aluminium is made from a molten electrolyte, not from an aqueous solution.",
    "I can calculate the mass of aluminium produced from current and time, and work backwards.",
    "I can use the overall equation to find the carbon consumed and the CO₂ released.",
    "I can predict how changes (current, efficiency, anode type) affect output and emissions.",
    "I can evaluate the energy and environmental costs of aluminium, including the electricity source and recycling."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Reduction potentials", goal:2,
          prompt:"Which is easier to reduce: Al³⁺ (−1.66 V) or water (2H₂O + 2e⁻ → H₂ + 2OH⁻, −0.83 V)?",
          options:[
            { t:"Water", ok:true, why:"−0.83 V is higher than −1.66 V." },
            { t:"Al³⁺", why:"The more negative value is harder to reduce." },
            { t:"They’re equally easy", why:"−0.83 and −1.66 differ." },
            { t:"Neither can be reduced", why:"Both can be, under the right conditions." }],
          hints:["Higher <em>E</em>° means easier to reduce.", "Compare −0.83 and −1.66.", "Water."] },
        { id:"w2", skill:"Reduction potentials", goal:2,
          prompt:"So what forms at the cathode when aqueous Al₂(SO₄)₃ is electrolyzed?",
          options:[
            { t:"H₂ gas", ok:true, why:"Water is reduced first." },
            { t:"Aluminium metal", why:M2 },
            { t:"O₂ gas", why:"Oxygen forms at an anode." },
            { t:"Sulfur", why:"Sulfate isn’t reduced here." }],
          hints:["Use the first question’s answer.", "Water wins.", "H₂."] },
        { id:"w3", skill:"Faraday chain", goal:3,
          prompt:"How many moles of electrons make 1.00 mol of Al from Al³⁺?",
          options:[
            { t:"3.00 mol", ok:true, why:"Al³⁺ + 3e⁻ → Al." },
            { t:"1.00 mol", why:"Each Al³⁺ needs 3 electrons. " + M3 },
            { t:"0.333 mol", why:"Divided instead of multiplied." },
            { t:"2.00 mol", why:"Aluminium is 3+." }],
          hints:["Match the ion charge.", "3+.", "3.00 mol."] },
        { id:"w4", skill:"Faraday chain", goal:3,
          prompt:"How many moles of electrons are in 2.895 × 10⁸ C?",
          options:[
            { t:"3.00 × 10³ mol", ok:true, why:"2.895 × 10⁸ ÷ 96 500 = 3000." },
            { t:"3.00 × 10⁵ mol", why:"Check the powers of 10." },
            { t:"2.79 × 10¹³ mol", why:"Multiplied by <em>F</em>." },
            { t:"1.00 × 10³ mol", why:"That’s the moles of Al, not of electrons." }],
          hints:["<em>n</em>(e⁻) = <em>Q</em> ÷ <em>F</em>.", "2.895 × 10⁸ ÷ 9.65 × 10⁴.", "3000 mol."] },
        { id:"w5", skill:"Stoichiometry", goal:4,
          prompt:"In 2Al₂O₃ + 3C → 4Al + 3CO₂, how many moles of C react per 4 mol of Al?",
          options:[
            { t:"3", ok:true, why:"Read the coefficients." },
            { t:"4", why:"1 : 1 isn’t the ratio." },
            { t:"2", why:"That’s the coefficient of Al₂O₃." },
            { t:"6", why:"Doubled." }],
          hints:["Coefficients give mole ratios.", "C : Al = 3 : 4.", "3."] },
        { id:"w6", skill:"Stoichiometry", goal:4,
          prompt:"What is the mass of 750 mol of carbon (C 12.0)?",
          options:[
            { t:"9.00 kg", ok:true, why:"750 × 12.0 = 9000 g." },
            { t:"62.5 g", why:"Divided." },
            { t:"900 kg", why:"Check the units: g → kg." },
            { t:"9.00 g", why:"9000 g, not 9 g." }],
          hints:["<em>m</em> = <em>nM</em>.", "750 × 12.0 = 9000 g.", "9.00 kg."] }
      ],
      refreshers:{
        "Reduction potentials":"The species with the higher <em>E</em>° is reduced first. In water, any metal ion below −0.83 V loses to water.",
        "Faraday chain":"<em>Q</em> = <em>It</em> → <em>n</em>(e⁻) = <em>Q</em> ÷ <em>F</em> → <em>n</em>(Al) = <em>n</em>(e⁻) ÷ 3 → <em>m</em> = <em>n</em> × 27.0.",
        "Stoichiometry":"Use the balanced equation’s coefficients as mole ratios, then convert moles to mass."
      }
    }
  },
  explore:{
    heading:"Aluminium smelter",
    intro:"Melt the bath, then run the cell. Watch the aluminium pile up, the anodes burn away, and the energy m&#101;ter spin.",
    how:"Choose a mode. <strong>Inside the pot:</strong> switch cryolite on or off and set the bath temperature. <strong>Run the cell:</strong> set the current, time, current efficiency and anode type, then press <strong>Run the day</strong> or drag the timeline. <strong>Why not water?</strong> sends the same current through a beaker of aqueous Al₂(SO₄)₃.",
    uses:USE + "; O 16.0 g/mol. Model cell voltage: 4.0 V (carbon anodes), 5.0 V (inert anodes).",
    model:"Model values for learning; real smelters vary.",
    modes:[{ id:"pot", t:"Inside the pot" }, { id:"run", t:"Run the cell" }, { id:"water", t:"Why not water?" }],
    predictions:[
      { id:"p1", prompt:"The cell is running. Where does the liquid aluminium collect?",
        options:[{ t:"At the bottom, on the carbon cathode lining", ok:true }, { t:"On the carbon anode blocks" }, { t:"Floating on top of the bath" }, { t:"Dissolved in the cryolite" }],
        explain:"Al³⁺ is reduced at the cathode (the lining), and liquid aluminium is denser than the bath, so it sinks." },
      { id:"p2", prompt:"What happens to the carbon anode blocks over a day?",
        options:[{ t:"They shrink: the carbon reacts to form CO₂", ok:true }, { t:"Nothing; electrodes are inert" }, { t:"They grow as aluminium coats them" }, { t:"They turn into cryolite" }],
        explain:"C + 2O²⁻ → CO₂ + 4e⁻. " + M4 },
      { id:"p3", prompt:"Raise the current from 300 kA to 400 kA for the same 24 h. Aluminium output…",
        options:[{ t:"rises by one-third", ok:true }, { t:"stays the same" }, { t:"doubles" }, { t:"rises by one-quarter" }],
        explain:"Mass ∝ charge: 400 ÷ 300 = 4/3." },
      { id:"p4", prompt:"Inside the pot: cryolite off, 960 °C. Can the cell run?",
        options:[{ t:"No: alumina alone stays solid until about 2050 °C", ok:true }, { t:"Yes, at full output" }, { t:"Yes, at half output" }, { t:"Only with inert anodes" }],
        explain:"Cryolite dissolves alumina so the bath melts at about 960 °C, saving a huge amount of heating." }
    ],
    chalIntro:"Use the smelter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"Make at least 2.00 t of aluminium in one day at 100% efficiency, using the <strong>smallest</strong> current that works.",
        why:"300 kA for 24 h makes 2.42 t. 200 kA would make only 1.61 t.",
        hints:["Each 100 kA makes about 0.806 t per day.", "2.00 ÷ 0.806 ≈ 2.5, so you need more than 200 kA.", "300 kA."] },
      { id:"tc2", goal:1, prompt:"Inside the pot: find the lowest temperature at which the pot can run.",
        why:"With cryolite, the bath is liquid from about 960 °C (model value). Without it, alumina stays solid until about 2050 °C.",
        hints:["Which setting lowers the melting point?", "Turn cryolite on.", "Step down until it freezes: 960 °C."] },
      // VERIFY: inert-anode technology status (the plan's banner says it is still being developed).
      { id:"tc3", goal:5, stretch:true, prompt:"Run a day that makes at least 2.00 t of aluminium, releases <strong>no anode CO₂</strong>, and uses <strong>less than 40 000 kWh</strong>.",
        why:"Inert anodes remove anode CO₂ but use more electricity, so the power source matters even more. (Model values; this technology is still being developed.)",
        hints:["No anode CO₂ rules out carbon.", "Inert anodes need a higher voltage: 120 kWh per kA per day.", "300 kA gives 36 000 kWh and 2.42 t."] }
    ]
  },
  part3:{
    slug:"cost", name:"Cost", heading:"The cost of aluminium",
    intro:"Four stations weigh what a tonne of aluminium really costs: the electricity behind it, the savings from recycling, the Canadian picture and the ore it starts from. Every number here is a model value; open <strong>Check it with data</strong> to see them all.",
    s1:{ title:"Station 1: Where the electricity comes from",
      intro:"Model: about 12 kWh of electricity per kg of aluminium, plus 1.2 kg of anode CO₂ per kg. Choose a power source to see the CO₂ for each kilogram of aluminium.",
      coal:"On coal power, the electricity, not the anodes, is the main source of CO₂." },
    s2:{ title:"Station 2: Recycling",
      intro:"Remelting scrap uses about 5% of the energy needed to make new aluminium (model value). Work out the energy for 100 kg each way.",
      why:"Why it’s so much lower: the scrap is already metal, so there’s no Al³⁺ to reduce. " + M7 },
    // VERIFY: the number of Quebec smelters and their power source; the status of inert-anode research partnerships.
    s3:{ title:"Station 3: The Canadian picture",
      facts:["Quebec has several large aluminium smelters powered by hydroelectricity.", "Research partnerships are developing inert anodes that release O₂ instead of CO₂."],
      intro:"List one benefit and one challenge of building smelters near hydro dams. Your notes are saved in this browser only." },
    s4:{ title:"Station 4: From rock to metal",
      text:"Bauxite is refined into alumina first, leaving a large amount of alkaline “red mud” residue to store safely." },
    quickCheck:{
      title:"Quick check", summary:"The cost of aluminium quick check",
      items:[
        { id:"q1", goal:6, prompt:"Model: 12 kWh/kg and 1.2 kg anode CO₂/kg. On hydro (0.02 kg CO₂/kWh), CO₂ per kg Al?",
          choices:[
            { t:"1.44 kg", ok:true, fb:"Right. 12 × 0.02 = 0.24 kg from electricity, plus 1.2 kg from the anodes." },
            { t:"0.24 kg", fb:"Add the electricity CO₂ (0.24) and the anode CO₂ (1.2)." },
            { t:"1.20 kg", fb:"Add the electricity CO₂ (0.24) and the anode CO₂ (1.2)." },
            { t:"13.2 kg", fb:"Add the electricity CO₂ (0.24) and the anode CO₂ (1.2)." }] },
        { id:"q2", goal:6, prompt:"Why does recycling aluminium save so much energy?",
          choices:[
            { t:"No electrolysis is needed; scrap only needs remelting", ok:true, fb:"Right. " + M7 },
            { t:"Scrap melts at a lower temperature than aluminium", fb:M7 },
            { t:"Recycling uses cryolite", fb:M7 },
            { t:"Scrap contains extra electrons", fb:M7 }] },
        { id:"q3", goal:6, prompt:"Which change cuts a coal-powered smelter’s CO₂ the most?",
          choices:[
            { t:"Switching to hydro power", ok:true, fb:"Right. Electricity: 12 kg vs anodes: 1.2 kg." },
            { t:"Switching to inert anodes", fb:"Electricity: 12 kg vs anodes: 1.2 kg. " + M6 },
            { t:"Raising the current", fb:"Electricity: 12 kg vs anodes: 1.2 kg. " + M6 },
            { t:"Adding more cryolite", fb:"Electricity: 12 kg vs anodes: 1.2 kg. " + M6 }] },
        { id:"q4", goal:6, prompt:"Why are smelters often built near hydro dams?",
          choices:[
            { t:"Large amounts of low-cost, low-CO₂ electricity", ok:true, fb:"Right. The cell runs on a huge, steady current." },
            { t:"Water is needed in the cell", fb:"The cell is dry and molten; it needs electricity, not water." },
            { t:"Dams provide cryolite", fb:"The cell is dry and molten; it needs electricity, not water." },
            { t:"Aluminium is found in rivers", fb:"The cell is dry and molten; it needs electricity, not water." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Cathode, anode or neither?", summary:"Cathode, anode or neither?", goal:[1, 2], noun:"item", txt:true,
        instruction:"Tap an item, then tap the box it belongs in: the cathode, the anode, or neither.",
        boxes:[{ id:"cat", label:"Cathode (−)", sub:"reduction" }, { id:"an", label:"Anode (+)", sub:"oxidation" }, { id:"nei", label:"Neither", sub:"not an electrode process" }],
        items:[
          { id:"i1", t:"Al³⁺ + 3e⁻ → Al(l)", answer:"cat", why:"A gain of electrons is reduction: cathode.", hints:SORT_HINTS("Cathode: Al³⁺ gains electrons, which is reduction.") },
          { id:"i2", t:"C + 2O²⁻ → CO₂ + 4e⁻", answer:"an", why:"Electrons are released: oxidation at the carbon anode.", wrong:{ cat:M4 }, hints:SORT_HINTS("Anode: carbon is oxidized and electrons are released.") },
          { id:"i3", t:"Blocks that must be replaced every few weeks", answer:"an", why:"The carbon anodes burn away as CO₂.", wrong:{ cat:"The carbon blocks are the anodes, and they react.", nei:M4 }, hints:SORT_HINTS("Anode: the carbon blocks react and burn away.") },
          { id:"i4", t:"Pool of liquid aluminium", answer:"cat", why:"Al³⁺ is reduced at the lining, and the metal pools there.", hints:SORT_HINTS("Cathode: the aluminium forms and collects on the lining.") },
          { id:"i5", t:"2O²⁻ → O₂ + 4e⁻ (inert anode)", answer:"an", why:"Oxide ions lose electrons: oxidation at the anode.", hints:SORT_HINTS("Anode: O²⁻ is oxidized to O₂.") },
          { id:"i6", t:"Molten cryolite", answer:"nei", why:"Cryolite is the solvent; it isn’t used up.", wrong:{ cat:"Cryolite is the solvent, not a product.", an:M1 }, hints:SORT_HINTS("Neither: cryolite is the solvent.") },
          { id:"i7", t:"Electrons enter the bath from here", answer:"cat", why:"Electrons arrive through the external circuit at the cathode.", hints:SORT_HINTS("Cathode: electrons enter at the lining and reduce Al³⁺.") },
          { id:"i8", t:"Alumina (Al₂O₃)", answer:"nei", why:"Alumina is the raw material, dissolved in the bath.", wrong:{ cat:M1, an:M1 }, hints:SORT_HINTS("Neither: alumina is the raw material, dissolved in the bath.") }
        ] },
      { id:"calc", type:"custom", title:"Smelter calculations", summary:"Smelter calculations", star:true, goal:[3, 4, 5],
        instruction:"Six calculations. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number in the unit shown (you can write 1.16 × 10^3 or 1.16e3), then press Check. Answers within 1% are accepted.",
        uses:USE,
        items:[
          { id:"h1", goal:3, prompt:"A cell runs at 300 kA for 965 s. Mass of Al (100% efficiency)?",
            parts:[{ id:"m", answer:27.0, unit:"kg", display:"27.0 kg" }],
            wrong:[{ match:81.0, fb:"÷ 3, not × 1: 3000 mol e⁻ → 1000 mol Al. " + M3 }],
            fb:"<em>Q</em> = <em>It</em> → <em>n</em>(e⁻) = <em>Q</em> ÷ <em>F</em> → <em>n</em>(Al) = <em>n</em>(e⁻) ÷ 3 → <em>m</em> = <em>n</em> × 27.0." },
          { id:"h2", goal:4, prompt:"Carbon anode used to make that 27.0 kg?",
            parts:[{ id:"m", answer:9.00, unit:"kg", display:"9.00 kg" }],
            wrong:[{ match:12.0, fb:"3 C per 4 Al: 750 mol C. " + M5 }],
            fb:"1000 mol Al; use the ratio 3 C : 4 Al, then <em>m</em> = <em>n</em> × 12.0." },
          { id:"h3", goal:4, prompt:"Anode CO₂ released making that 27.0 kg?",
            parts:[{ id:"m", answer:33.0, unit:"kg", display:"33.0 kg" }],
            wrong:[{ match:44.0, fb:"750 mol CO₂ × 44.0 g/mol. " + M5 }],
            fb:"1000 mol Al; use the ratio 3 CO₂ : 4 Al, then <em>m</em> = <em>n</em> × 44.0." },
          { id:"h4", goal:3, star:true, prompt:"How long must a 300 kA cell run to make 54.0 kg?",
            parts:[{ id:"t", answer:1930, unit:"s", display:"1930 s" }],
            wrong:[{ match:965, fb:"Twice the mass needs twice the charge." }],
            fb:"Work backwards: mass → mol Al → mol e⁻ → charge → <em>t</em> = <em>Q</em> ÷ <em>I</em>." },
          { id:"h5", goal:3, star:true, prompt:"What current makes 9.00 kg in 965 s?",
            parts:[{ id:"i", answer:100, unit:"kA", display:"100 kA" }],
            wrong:[{ match:300, fb:"333 mol Al → 1000 mol e⁻ → 9.65 × 10⁷ C ÷ 965 s." }],
            fb:"Work backwards: mass → mol Al → mol e⁻ → charge → <em>I</em> = <em>Q</em> ÷ <em>t</em>.",
            hints:["Moles of Al first: 9000 ÷ 27.0.", "× 3 = 1000 mol e⁻.", "<em>I</em> = 9.65 × 10⁷ ÷ 965 = 1.00 × 10⁵ A."] },
          { id:"h6", goal:[3, 5], star:true, prompt:"A 300 kA cell runs for 965 s at 90% efficiency, at 4.00 V. Mass of Al, and electrical energy used (MJ)?",
            parts:[{ id:"m", label:"Mass of Al", answer:24.3, unit:"kg", display:"24.3 kg" }, { id:"e", label:"Energy used", answer:1158, unit:"MJ", display:"1.16 × 10³ MJ" }],
            wrong:[{ part:"m", match:27.0, fb:"Only 90% of the electrons make Al." }, { part:"e", match:1042, fb:"<em>E</em> = <em>VQ</em> = 4.00 × 2.895 × 10⁸ J; efficiency doesn’t reduce the charge passed." }],
            fb:"Charge passed: <em>Q</em> = <em>It</em>. Mass: 90% of the 100% mass. Energy: <em>E</em> = <em>VQ</em>, then J → MJ.",
            hints:["Charge is 2.895 × 10⁸ C either way.", "Al = 0.90 × 27.0 kg.", "<em>E</em> = 4.00 × 2.895 × 10⁸ = 1.158 × 10⁹ J = 1.16 × 10³ MJ."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Vikram", how:"", goal:[2, 3],
        instruction:"Vikram made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain why aluminium isn’t made by electrolysing aqueous aluminium sulfate.",
            steps:["The cathode could reduce either Al³⁺ or water.", "From the table, Al³⁺/Al is −1.66 V and water is −0.83 V.", "Al³⁺ has the larger number, so it’s reduced first.", "So the problem must be that aluminium dissolves back into the water."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 reads the table correctly.", "", "Step 4 tries to explain away a wrong step 3."],
            fixes:[
              { t:"−0.83 V is higher than −1.66 V, so water is reduced first and H₂ forms instead of aluminium.", ok:true, why:M2 },
              { t:"Both are reduced equally.", why:"The higher <em>E</em>° wins." },
              { t:"Neither is reduced in water.", why:"Water is." },
              { t:"Step 3 is correct.", why:"−1.66 is more negative: harder to reduce. " + M2 }],
            hints:["Which is higher, −0.83 or −1.66?", "−0.83.", "So water is reduced: H₂."] },
          { id:"e2", goal:3, task:"Find the mass of aluminium made by 300 kA in 965 s.",
            steps:["<em>Q</em> = 3.00 × 10⁵ A × 965 s = 2.895 × 10⁸ C.", "<em>n</em>(e⁻) = 2.895 × 10⁸ ÷ 96 500 = 3000 mol.", "<em>n</em>(Al) = 3000 × 3 = 9000 mol.", "<em>m</em> = 9000 × 27.0 g = 243 kg."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"<em>n</em>(Al) = 3000 ÷ 3 = 1000 mol, so <em>m</em> = 27.0 kg.", ok:true, why:M3 },
              { t:"<em>n</em>(Al) = 3000 mol, so 81.0 kg.", why:"Each Al needs 3 e⁻." },
              { t:"<em>n</em>(Al) = 3000 ÷ 2.", why:"Aluminium is 3+." },
              { t:"Step 3 is correct.", why:"More electrons per atom means <strong>fewer</strong> atoms. " + M3 }],
            hints:["Al³⁺ + 3e⁻ → Al.", "Divide by 3.", "1000 mol, 27.0 kg."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: how much electricity aluminium takes, that the anodes burn away, or how much recycling saves?" },
      { id:"j2", q:"In your own words, explain why aluminium is made from a molten bath and what cryolite does." },
      { id:"j3", q:"Explain to a friend how to calculate the aluminium a cell makes in a day." },
      { id:"j4", q:"Would you recommend building a new smelter in Canada? Name one fact from this module that supports your view, and one you’d want to check." }
    ]
  },
  final:{
    intro:"Use these values: " + USE + ".",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is cryolite’s role in the Hall–Héroult process?", options:[
          { t:"It dissolves alumina so the electrolyte is liquid at about 960 °C instead of about 2050 °C", ok:true, why:"Cryolite is the solvent that lowers the melting temperature." },
          { t:"It’s the source of the aluminium", why:M1 },
          { t:"It’s the material of the anodes", why:"The anodes are carbon." },
          { t:"It reduces Al³⁺ to aluminium", why:"Electrons at the cathode do that." }] },
        b:{ prompt:"Why must the electrolyte be molten (or dissolved) for the cell to work?", options:[
          { t:"Ions must be free to move to carry the current", ok:true, why:"In a solid, the ions are locked in place." },
          { t:"Solid alumina has no aluminium in it", why:"It does; the ions just can’t move." },
          { t:"Heat alone splits alumina", why:"Electricity does the splitting." },
          { t:"The cryolite must boil", why:"It only needs to be liquid." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which half-reaction happens at the cathode?", options:[
          { t:"Al³⁺ + 3e⁻ → Al(l)", ok:true, why:"Reduction happens at the cathode." },
          { t:"Al(l) → Al³⁺ + 3e⁻", why:"That’s oxidation." },
          { t:"C + 2O²⁻ → CO₂ + 4e⁻", why:"That’s the anode." },
          { t:"2H₂O + 2e⁻ → H₂ + 2OH⁻", why:"There’s no water in the bath." }] },
        b:{ prompt:"Which half-reaction happens at a carbon anode?", options:[
          { t:"C + 2O²⁻ → CO₂ + 4e⁻", ok:true, why:"Carbon is oxidized: the anode burns away." },
          { t:"Al³⁺ + 3e⁻ → Al", why:"That’s the cathode." },
          { t:"CO₂ + 4e⁻ → C + 2O²⁻", why:"That’s a reduction, the reverse." },
          { t:"No reaction; the anode is inert", why:M4 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Why isn’t aluminium made by electrolysing an aqueous solution?", options:[
          { t:"Water (−0.83 V) is reduced more easily than Al³⁺ (−1.66 V), so H₂ forms instead", ok:true, why:"The higher <em>E</em>° wins at the cathode." },
          { t:"Aluminium ions don’t dissolve in water", why:"They do." },
          { t:"Aluminium reacts with cryolite in water", why:"Cryolite isn’t the issue." },
          { t:"Al³⁺ (−1.66 V) is reduced too easily", why:M2 }] },
        b:{ prompt:"Aqueous Al³⁺ is electrolyzed. What forms at the cathode?", options:[
          { t:"Hydrogen gas", ok:true, why:"Water is reduced before Al³⁺." },
          { t:"Aluminium metal", why:M2 },
          { t:"Oxygen gas", why:"That’s at the anode." },
          { t:"Cryolite", why:"It isn’t present." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A cell runs at 200 kA for 965 s. Mass of aluminium (100% efficiency)?", use:USE, options:[
          { t:"18.0 kg", ok:true, why:"1.93 × 10⁸ C → 2000 mol e⁻ → 667 mol Al → 18.0 kg." },
          { t:"54.0 kg", why:"Divide the electrons by 3. " + M3 },
          { t:"6.00 kg", why:"Divided by 3 twice." },
          { t:"27.0 kg", why:"That’s at 300 kA." }] },
        b:{ prompt:"A cell runs at 400 kA for 965 s. Mass of aluminium (100% efficiency)?", use:USE, options:[
          { t:"36.0 kg", ok:true, why:"4000 mol e⁻ → 1333 mol Al → 36.0 kg." },
          { t:"108 kg", why:M3 },
          { t:"12.0 kg", why:"Divided by 3 twice." },
          { t:"27.0 kg", why:"That’s at 300 kA." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How much carbon anode is used up to make 108 kg of aluminium?", use:USE, options:[
          { t:"36.0 kg", ok:true, why:"4000 mol Al → 3000 mol C → 36.0 kg." },
          { t:"48.0 kg", why:"1 : 1 isn’t the ratio. " + M5 },
          { t:"27.0 kg", why:"Ratio of 1 : 4 by mass is not the equation." },
          { t:"72.0 kg", why:"Doubled." }] },
        b:{ prompt:"How much anode CO₂ is released making 54.0 kg of aluminium?", use:USE, options:[
          { t:"66.0 kg", ok:true, why:"2000 mol Al → 1500 mol CO₂ → 66.0 kg." },
          { t:"88.0 kg", why:M5 },
          { t:"44.0 kg", why:"That’s 1000 mol CO₂." },
          { t:"132 kg", why:"Doubled." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A smelter switches from carbon anodes to inert anodes that release O₂. Which statement is true?", options:[
          { t:"The anodes are no longer used up and no anode CO₂ is made, but the cell still needs electricity (more of it, in this model)", ok:true, why:"2O²⁻ → O₂ + 4e⁻ leaves the anode intact, but the electrolysis still runs on electricity." },
          { t:"No electricity is needed any more", why:"Electrolysis always needs a supply." },
          { t:"Each mole of electrons now makes more aluminium", why:"Still 3 e⁻ per Al." },
          { t:"Cryolite is no longer needed", why:"The bath must still be molten." }] },
        b:{ prompt:"Current efficiency drops from 100% to 90% at the same current and time. What happens?", options:[
          { t:"10% less aluminium is made from the same charge", ok:true, why:"Only 90% of the electrons reduce Al³⁺." },
          { t:"The same aluminium, made 10% faster", why:"Faraday’s law: fewer electrons go to Al." },
          { t:"10% more aluminium", why:"Wrong direction." },
          { t:"No aluminium is made", why:"90% still makes Al." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why aluminium smelters are often built near large hydroelectric dams?", options:[
          { t:"“The process needs enormous amounts of electricity, and hydro supplies it cheaply with little CO₂.”", ok:true, why:"It names the need (electricity) and why hydro meets it." },
          { t:"“The cells need river water to cool the aluminium.”", why:"The cell is molten and dry." },
          { t:"“Aluminium ore is found in rivers.”", why:"Ore is mined as bauxite." },
          { t:"“Dams make cryolite.”", why:"Not the reason." }] },
        b:{ prompt:"Which is the best explanation of why recycling aluminium uses far less energy than making new aluminium?", options:[
          { t:"“Scrap is already aluminium metal, so it only needs melting; there’s no Al³⁺ to reduce by electrolysis.”", ok:true, why:M7 },
          { t:"“Recycled aluminium is lighter.”", why:"Mass isn’t the point." },
          { t:"“Recycling uses inert anodes.”", why:"No electrolysis is needed at all." },
          { t:"“Scrap aluminium melts at about 960 °C because of cryolite.”", why:"Cryolite isn’t used in remelting." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which description of the Hall–Héroult cell is correct?", options:[
          { t:"“The carbon lining is the cathode (−), where liquid aluminium collects. Carbon blocks are the anodes (+), and they are consumed as CO₂.”", ok:true, why:"Both electrodes, their signs and what happens at each are right." },
          { t:"“The carbon blocks are the cathode, where aluminium forms.”", why:"Aluminium forms on the lining." },
          { t:"“Both electrodes are inert and last forever.”", why:M4 },
          { t:"“The cathode is positive.”", why:"In electrolysis the cathode is negative." }] },
        b:{ prompt:"Which describes the electron path correctly?", options:[
          { t:"“Electrons leave the anodes, travel through the external circuit and supply, and enter the bath at the cathode lining.”", ok:true, why:"Electrons travel in the wires; ions carry the current in the bath." },
          { t:"“Electrons travel through the bath from cathode to anode.”", why:"Ions carry current in the bath; electrons travel in the wires." },
          { t:"“Electrons enter at the anodes.”", why:"They leave at the anodes." },
          { t:"“Electrons are made by the cryolite.”", why:M1 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Model: making 1 kg of aluminium uses 12 kWh of electricity and releases 1.2 kg of anode CO₂. With coal power (1.0 kg CO₂ per kWh), what is the total CO₂ per kg of aluminium?", options:[
          { t:"13.2 kg", ok:true, why:"12 × 1.0 + 1.2." },
          { t:"12.0 kg", why:"Forgot the anodes." },
          { t:"1.2 kg", why:"Forgot the electricity. " + M6 },
          { t:"14.4 kg", why:"Multiplied 12 × 1.2." }] },
        b:{ prompt:"Same model, but with hydro power (0.02 kg CO₂ per kWh). Total CO₂ per kg of aluminium?", options:[
          { t:"1.44 kg", ok:true, why:"12 × 0.02 + 1.2." },
          { t:"0.24 kg", why:"Forgot the anodes." },
          { t:"1.2 kg", why:"Forgot the electricity." },
          { t:"14.4 kg", why:"Multiplied 12 × 1.2." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Making new aluminium takes 12 kWh/kg (model). Remelting scrap takes 5% of that. Energy to produce 100 kg from scrap?", options:[
          { t:"60 kWh", ok:true, why:"0.05 × 12 × 100." },
          { t:"1200 kWh", why:"That’s new aluminium. " + M7 },
          { t:"600 kWh", why:"That’s 50%." },
          { t:"6 kWh", why:"Check: 5% of 1200." }] },
        b:{ prompt:"Same model. How much energy is saved by recycling 50 kg instead of making it new?", options:[
          { t:"570 kWh", ok:true, why:"600 − 30." },
          { t:"30 kWh", why:"That’s the recycling energy, not the saving." },
          { t:"600 kWh", why:"The recycling still uses 30 kWh." },
          { t:"540 kWh", why:"Took 10%." }] } }
    ]
  },
  task:{
    title:"Smelter plan", summary:"Smelter plan",
    statement:"<p>Plan one day at a smelter. You may add remelted scrap to the output. Can you find all the plans that meet every condition?</p><ol class=\"hh-conds\"><li>Total aluminium (smelted plus scrap) is at least 2.00 t.</li><li>Total CO₂ (anodes plus electricity) is at most 3.00 t.</li><li>Total electricity (cell plus remelting) is at most 40 000 kWh.</li></ol><p class=\"tiny muted\">Model (24 h, 100% efficiency): 0.806 t of aluminium per 100 kA per day; cell energy 96 × <em>I</em> (kA) kWh with carbon anodes or 120 × <em>I</em> (kA) kWh with inert anodes; remelting 0.6 kWh per kg of scrap; anode CO₂ 1.22 × smelted Al (carbon only); electricity CO₂ = factor × total energy (hydro 0.02, natural gas 0.5, coal 1.0 kg/kWh).</p>",
    checks:["At least 2.00 t", "CO₂ ≤ 3.00 t", "Electricity ≤ 40 000 kWh"],
    tips:["200 kA makes only 1.61 t: scrap can make up the rest.", "Gas and coal power add 0.5 or 1.0 kg of CO₂ for every kWh: that’s more than 9.6 t on gas even at 200 kA.", "Carbon anodes add 1.22 t of CO₂ per tonne smelted: at 300 kA that’s 2.95 t before any electricity.", "Inert anodes use 120 kWh per kA: 400 kA is over the limit."],
    explainPrompt:"Explain the trade-offs in your plan between output, electricity and CO₂.",
    vocab:"Use the words anode, current, electricity source and recycling.",
    more:"There’s more than one plan. Can you find them all?",
    after3:"Every valid plan runs on hydro. Carbon anodes only work at the lower current, with scrap topping up the output."
  },
  cards:[
    ["Hall–Héroult process", "Electrolysis of alumina dissolved in molten cryolite to make aluminium."],
    ["Cryolite", "The solvent; it lets the bath melt at about 960 °C instead of about 2050 °C."],
    ["Cathode reaction", "Al³⁺ + 3e⁻ → Al(l), at the carbon lining (−)."],
    ["Anode reaction", "C + 2O²⁻ → CO₂ + 4e⁻; the carbon anodes (+) are used up."],
    ["Overall reaction", "2Al₂O₃ + 3C → 4Al + 3CO₂."],
    ["Why not water?", "Water (−0.83 V) is reduced before Al³⁺ (−1.66 V): H₂ forms."],
    ["Aluminium per mole of electrons", "9.00 g (27.0 ÷ 3)."],
    ["300 kA for 965 s", "3000 mol e⁻ → 1000 mol Al → 27.0 kg."],
    ["Carbon and CO₂ per Al", "3 mol C and 3 mol CO₂ for every 4 mol Al."],
    // VERIFY: the 5% remelting figure.
    ["Recycling", "Remelting needs no electrolysis: about 5% of the energy (model value)."],
    ["Biggest CO₂ lever", "The electricity source; hydro vs coal changes CO₂ per kg about ninefold in the model."]
  ]
};
