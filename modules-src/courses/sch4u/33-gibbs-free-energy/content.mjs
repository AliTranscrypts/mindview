// SCH4U 33 Gibbs Free Energy. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/33-gibbs-free-energy.md
// The hero (ΔG–T line for melting ice), the Spontaneity map (Explore), the three equilibrium stations (Part 3), the
// "Calculate with ΔG" items and the task's live graph are drawn by app.js, which takes ΔH°f, S°, R and the course table
// additions (ΔHfus and ΔSfus of water, NH4Cl dissolving, diamond → graphite) from MV.chem.data.

const F = (s) => s.replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>");
const G = "Δ<i>G</i>", H = "Δ<i>H</i>", S = "Δ<i>S</i>", T = "<i>T</i>", G0 = "Δ<i>G</i>°", K = "<i>K</i>", EA = "<i>E</i><sub>a</sub>";
const TS = T + S;

// Misconception core sentences (plan §3)
const M1 = "Convert " + S + " to kJ/K first: 150 J/K = 0.150 kJ/K.";
const M2 = T + " must be in kelvin: 227 °C = 500 K.";
const M3 = G + " tells whether a change can happen, not how fast. Activation energy sets the speed.";
const M4 = "Both terms matter. A big entropy gain can drive an endothermic change; an entropy loss can stop an exothermic one at high " + T + ".";
const M5 = G + " = " + H + " <strong>minus</strong> " + TS + ".";
const M6 = G0 + " < 0 means " + K + " > 1: mostly products, not all. At equilibrium " + G + " = 0, but both directions keep going.";
const M7 = "If " + S + " > 0, raising " + T + " makes −" + TS + " more negative: spontaneous <strong>above</strong> the crossover.";

// Practice 1 (Which quadrant?)
const QH = ["Find the sign of " + H + ".", "Find the sign of " + S + ".", "Match the pair to a box."];
const quad = (id, t, answer, why, wrong) => ({ id, t, answer, why, wrong:wrong || {}, hints:QH });

export default {
  id:"33-gibbs-free-energy",
  kind:"topic",
  title:"Gibbs free energy",
  topic:"Gibbs Free Energy",
  readyTopic:"Gibbs free energy",
  hero:{
    eq:'<span class="gf-heq">' + G + ' = <span class="gf-dh">' + H + '</span> − <span class="gf-t">' + T + '</span><span class="gf-ds">' + S + "</span></span>",
    eqSize:"md",
    eqLabel:"Delta G equals delta H minus T times delta S",
    headline:"Energy and spreading, in one number",
    text:"A change happens on its own when it lowers the <strong>Gibbs free energy</strong>: " + G + " < 0. " + G + " weighs the heat released (" + H + ") against the spreading out (" + S + "), with temperature deciding how much the spreading counts. But <strong>spontaneous</strong> isn’t the same as <strong>fast</strong>.",
    fig:{ html:'<div class="gf-hx"><svg class="gf-hx-svg" id="gf-hx-svg" viewBox="0 0 440 300" role="img" aria-label="A graph of ΔG against temperature for melting ice. A straight line starts at ΔH = +6.01 kJ on the vertical axis and slopes down. The region below zero is shaded and labelled spontaneous. A marker slides along the line as T rises and crosses zero at 273 K, the crossover temperature. Beside the graph, an ice cube melts into a puddle as the marker passes 273 K."></svg><div class="gf-hx-row"><p class="gf-hx-cap" id="gf-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="gf-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can calculate " + G + " from " + H + ", " + T + " and " + S + ", with consistent units.",
    "I can predict spontaneity from the signs of " + H + " and " + S + " and the temperature.",
    "I can find the crossover temperature " + T + " = " + H + " ÷ " + S + " and say which side is spontaneous.",
    "I can explain that spontaneous doesn’t mean fast.",
    "I can relate the sign of " + G0 + " to the size of " + K + ", qualitatively.",
    "I can use " + G + " to explain real processes (cold packs, lime kilns, ammonia production)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Units and kelvin", goal:1,
          prompt:"Convert 25 °C to kelvin.",
          options:[
            { t:"298 K", ok:true, why:"25 + 273 = 298." },
            { t:"248 K", why:"Add 273." },
            { t:"25 K", why:"Kelvin and Celsius differ by 273." },
            { t:"77 K", why:"Add 273 to °C." }],
          hints:["K = °C + 273.", "25 + 273.", "298 K."] },
        { id:"w2", skill:"Units and kelvin", goal:1,
          prompt:"Convert " + S + " = +120 J/K to kJ/K.",
          options:[
            { t:"0.120 kJ/K", ok:true, why:"Divide by 1000." },
            { t:"120 000 kJ/K", why:"kJ is bigger than J." },
            { t:"1.20 kJ/K", why:"1 kJ = 1000 J." },
            { t:"12.0 kJ/K", why:"1 kJ = 1000 J: divide by 1000, not 10." }],
          hints:["1 kJ = 1000 J.", "120 ÷ 1000.", "0.120 kJ/K."] },
        { id:"w3", skill:"Enthalpy signs", goal:2,
          prompt:"A cold pack gets cold when it’s activated. For the reaction inside, " + H + " is…",
          options:[
            { t:"positive (endothermic)", ok:true, why:"It absorbs heat from your hand." },
            { t:"negative", why:"Cold doesn’t mean energy released." },
            { t:"zero", why:"Heat is moving." },
            { t:"impossible to tell", why:"Feeling cold tells you heat is being absorbed." }],
          hints:["Is heat leaving or entering the pack?", "Entering it, from your hand.", "Endothermic: " + H + " > 0."] },
        { id:"w4", skill:"Enthalpy signs", goal:6,
          prompt:"Using " + H + "°<sub>f</sub> values, " + H + "° for " + F("CaCO3(s) → CaO(s) + CO2(g)") + " is closest to…",
          use:H + "°<sub>f</sub> (kJ/mol): " + F("CaCO3(s)") + " −1207.6 · " + F("CaO(s)") + " −634.9 · " + F("CO2(g)") + " −393.5",
          options:[
            { t:"+179 kJ", ok:true, why:"(−634.9) + (−393.5) − (−1207.6) = +179.2." },
            { t:"−179 kJ", why:"Products minus reactants." },
            { t:"−2236 kJ", why:"Subtract the reactant." },
            { t:"+1208 kJ", why:"Include the products." }],
          hints:["Products minus reactants.", "−1028.4 − (−1207.6).", "+179.2 kJ."] },
        { id:"w5", skill:"Entropy signs", goal:2,
          prompt:"Sign of " + S + " for " + F("N2(g) + 3H2(g) → 2NH3(g)") + "?",
          options:[
            { t:"Negative", ok:true, why:"4 mol of gas → 2 mol." },
            { t:"Positive", why:"Count moles of gas." },
            { t:"Zero", why:"Gas moles change." },
            { t:"Can’t tell", why:"The gas count tells you." }],
          hints:["Count moles of gas on each side.", "4 and 2.", "Negative."] },
        { id:"w6", skill:"Entropy signs", goal:2,
          prompt:"Which change has the largest positive " + S + "?",
          options:[
            { t:"Liquid water → water vapour", ok:true, why:"Liquid → gas." },
            { t:"Ice → liquid water", why:"Positive, but smaller." },
            { t:"Water vapour → liquid water", why:"Negative." },
            { t:"Liquid water → ice", why:"Negative." }],
          hints:["Which change makes a gas?", "Boiling.", "Liquid → gas."] }
      ],
      refreshers:{
        "Units and kelvin":"Always " + T + " in K (°C + 273) and " + S + " in kJ/K (J/K ÷ 1000) when " + H + " is in kJ.",
        "Enthalpy signs":H + " < 0: exothermic, heat released. " + H + " > 0: endothermic, heat absorbed.",
        "Entropy signs":"More moles of gas → " + S + " > 0. Melting, boiling and dissolving usually → " + S + " > 0."
      }
    }
  },
  explore:{
    heading:"Spontaneity map",
    intro:"Set " + H + ", " + S + " and " + T + ", and watch whether " + G + " drops below zero. Then try real processes.",
    how:"Choose a mode. <strong>Map:</strong> drag the three sliders (arrow keys step; hold Shift for 5 steps). <strong>Real processes:</strong> pick a process; " + H + " and " + S + " lock, and " + T + " stays free. <strong>Rate vs spontaneity:</strong> add a spark to a jar of methane and air.",
    modes:[{ id:"map", t:"Map" }, { id:"real", t:"Real processes" }, { id:"rate", t:"Rate vs spontaneity" }],
    presets:[
      { id:"ice", t:"Ice melting", eq:"H2O(s) -> H2O(l)" },
      { id:"cold", t:"Cold pack", eq:"NH4Cl(s) -> NH4+(aq) + Cl-(aq)", note:"ammonium chloride dissolving (values rounded)" },
      { id:"lime", t:"Limestone → lime", eq:"CaCO3(s) -> CaO(s) + CO2(g)" },
      { id:"nh3", t:"Ammonia synthesis", eq:"N2(g) + 3H2(g) -> 2NH3(g)" },
      { id:"ch4", t:"Methane burning", eq:"CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", note:"liquid water" }],
    rows:[H, S, T, TS, G, "Spontaneous?", "Crossover " + T, "Quadrant"],
    graphNote:"The map treats " + H + " and " + S + " as constant over the temperature range.",
    rareNote:H + " = 0 with " + S + " > 0 is always spontaneous: true, but rare in practice.",
    jar:{ title:"Methane and air", spark:"Add spark", reset:"Reset the jar",
      before:"The jar holds methane and air. " + G + " is very negative, yet nothing happens.",
      after:"Reaction started after the spark: the spark supplied " + EA + ", and the energy released keeps it going." },
    predIntro:"Each prediction sets up the spontaneity map. Choose an answer, then watch what happens.",
    predSetup:{ p1:"Map: " + H + " = −80 kJ, " + S + " = −0.200 kJ/K.", p2:"Ice melting preset.", p3:"Rate vs spontaneity: a jar of methane and air at room temperature.", p4:"Cold pack preset." },
    predictions:[
      { id:"p1", prompt:"Map: " + H + " = −80 kJ, " + S + " = −0.200 kJ/K. At 600 K, is the reaction spontaneous?",
        options:[{ t:"Yes, it’s exothermic" }, { t:"No", ok:true }, { t:"It’s at equilibrium" }, { t:"Can’t tell" }],
        explain:"The dot sits above zero: " + G + " = −80 + 120 = +40 kJ. At high " + T + ", the −" + TS + " term (+120 kJ) outweighs " + H + ". " + M4 },
      { id:"p2", prompt:"Ice preset. At −10 °C (263 K), does ice melt on its own?",
        options:[{ t:"No", ok:true }, { t:"Yes" }, { t:"It’s at equilibrium" }, { t:"Only if stirred" }],
        explain:G + " = 6.01 − 263 × 0.0220 = +0.22 kJ. Below 273 K, " + G + " > 0 for melting. At 273 K it is 0, the melting point." },
      { id:"p3", prompt:G + " for methane burning is about −800 kJ at room temperature. When you open the gas valve, does the methane burn immediately?",
        options:[{ t:"Yes" }, { t:"No, it needs a spark", ok:true }, { t:"No, " + G + " is really positive" }, { t:"Only in sunlight" }],
        explain:"Nothing happens until the spark. Spontaneous means it <em>can</em> happen; the activation energy is too high at room temperature. " + M3 },
      { id:"p4", prompt:"Cold pack preset at 300 K. The process is endothermic. Is it spontaneous?",
        options:[{ t:"Yes", ok:true }, { t:"No" }, { t:"Only above 1000 K" }, { t:"Only below 100 K" }],
        explain:G + " = 15 − 300 × 0.075 = −7.5 kJ. The entropy gain wins: " + TS + " = 22.5 kJ > " + H + " = 15 kJ. " + M4 }
    ],
    chalIntro:"Use the spontaneity map to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Map mode: set " + H + " and " + S + " so the reaction is spontaneous at <strong>every</strong> temperature on the slider.",
        why:H + " < 0 and " + S + " > 0: both terms make " + G + " negative, so the line never crosses zero.",
        hints:["Which quadrant never crosses zero?", "You want " + H + " negative and −" + TS + " negative.", H + " < 0 and " + S + " > 0."] },
      { id:"tc2", goal:3, prompt:"Limestone preset: set " + T + " to the lowest slider value at which the decomposition is spontaneous.",
        why:"At 1150 K, " + G + " = −3.7 kJ; at 1125 K it is still +0.3 kJ. The crossover is 179.2 ÷ 0.159 ≈ 1127 K.",
        hints:["Crossover = " + H + " ÷ " + S + ".", "179.2 ÷ 0.159 ≈ 1127 K.", "The next slider value above it: 1150 K."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Map mode: design a reaction with " + H + " = +90 kJ that is spontaneous <strong>above 600 K and not below</strong>.",
        why:S + " = " + H + " ÷ " + T + " = 90 ÷ 600 = +0.150 kJ/K (150 J/K): the crossover sits at exactly 600 K.",
        hints:["At the crossover, " + G + " = 0, so " + H + " = " + TS + ".", S + " = " + H + " ÷ " + T + " = 90 ÷ 600.", "+0.150 kJ/K (150 J/K)."] }
    ],
    msgs:{
      needMap:"Switch to Map mode first.",
      needLime:"Choose the Limestone → lime preset in Real processes mode first.",
      tc1:{ bothNeg:"Spontaneous only below the crossover; slide " + T + " up to see it fail.",
        zeroS:"Then " + G + " = " + H + ", which works, but this challenge asks for help from entropy too: make " + S + " > 0.",
        bothPos:"Spontaneous only above the crossover; slide " + T + " down to see it fail.",
        never:"This quadrant is never spontaneous: both terms make " + G + " positive.",
        other:"Not yet. Which quadrant keeps " + G + " below zero at every temperature?" },
      tc2:{ t1125:G + " = +0.3 kJ, just short.", low:"Lower " + T + " makes " + G + " more positive here.", t1100:G + " = +4.3 kJ at 1100 K: not spontaneous yet.",
        high:"Spontaneous, but not the lowest slider value. Slide " + T + " down." },
      tc3:{ needH:"Set " + H + " to +90 kJ first.", neg:"Then " + G + " is always positive.", s200:"The crossover is 450 K.",
        s015:"That’s 15 J/K: the crossover would be 6000 K. Check the units.", zero:"With " + S + " = 0, " + G + " = +90 kJ at every temperature.",
        other:"The crossover must be exactly 600 K: " + S + " = " + H + " ÷ " + T + "." }
    },
    blocks:[
      { title:"The big idea", html:"<p>" + G + " is a straight line in " + T + ". The signs of " + H + " and " + S + " decide whether it ever crosses zero, and spontaneity is about direction, not speed.</p>" }
    ]
  },
  part3:{
    slug:"equilibrium", name:"Equilibrium", heading:"Free energy and equilibrium",
    intro:"Three stations link " + G0 + " to equilibrium. Check it with data: slide " + G0 + " and read " + K + ", follow a reaction to equilibrium, then meet changes that are spontaneous but slow.",
    s1:{ title:"Station 1: " + G0 + " and " + K,
      intro:"Slide " + G0 + ". The equilibrium constant " + K + " at 298 K and the beaker’s share of products update.",
      label:G0, kLabel:K + " at 298 K", share:"Products at equilibrium",
      rule:G0 + " < 0 → " + K + " > 1 (products favoured); " + G0 + " > 0 → " + K + " < 1 (reactants favoured, but some product still forms).",
      tableTitle:"Check it with data",
      note:K + " is calculated from " + G0 + " at 298 K. Only the link between the sign of " + G0 + " and the size of " + K + " is assessed here.",
      scaleNote:"When products or reactants are below 2%, the beaker still shows one particle, so you can see that some always forms." },
    s2:{ title:"Station 2: " + G0 + " vs " + G,
      intro:"As a reaction proceeds, " + G + " moves toward 0. When " + G + " = 0, the mixture is at <strong>equilibrium</strong> and both directions continue at equal rates (more in module 34). Drag the reaction-progress marker and watch " + G + " fall to 0 at the equilibrium mixture.",
      model:"Model reaction A ⇌ B with " + G0 + " = −5 kJ at 298 K (model data).",
      progress:"Reaction progress (share of B)",
      eq:"Equilibrium: " + G + " = 0. Forward and reverse rates are equal, so the mixture stops changing, but both reactions keep going.",
      fwd:G + " < 0: the forward reaction is spontaneous, so more B forms.",
      rev:G + " > 0: past equilibrium, the reverse reaction is spontaneous, so B turns back into A.",
      std:"At 50% (A and B equal, so Q = 1), " + G + " = " + G0 + "." },
    s3:{ title:"Station 3: Spontaneous but slow",
      html:"<p><strong>Diamond → graphite</strong> has " + G0 + " = −2.9 kJ/mol <span class=\"tiny muted\">(course table addition)</span>, so the change is spontaneous. Yet diamonds last for billions of years, because the activation energy is enormous: almost no atoms ever have enough energy to rearrange.</p><p>The same holds for <strong>sugar in air</strong> and <strong>paper in air</strong>. Both have hugely negative " + G + " for burning, but they sit unchanged until a flame supplies " + EA + ".</p><p>" + M3 + "</p>",
      aria:"Energy diagram for diamond turning into graphite: graphite sits slightly lower than diamond, but a very tall activation-energy hump separates them." },
    quickCheck:{
      title:"Quick check", summary:"Free energy and equilibrium quick check",
      items:[
        { id:"q1", goal:5, prompt:G0 + " = −20 kJ at 298 K. " + K + " is…",
          choices:[{ t:"greater than 1", ok:true, fb:"Right. Negative " + G0 + " favours products." }, { t:"less than 1", fb:"Negative " + G0 + " favours products." }, { t:"exactly 1", fb:"Negative " + G0 + " favours products." }, { t:"negative", fb:"Negative " + G0 + " favours products." }] },
        { id:"q2", goal:5, prompt:"At equilibrium, " + G + " equals…",
          choices:[{ t:"0", ok:true, fb:"Right. No net drive in either direction." }, { t:G0, fb:"No net drive in either direction. " + M6 }, { t:H, fb:"No net drive in either direction. " + M6 }, { t:"−1", fb:"No net drive in either direction. " + M6 }] },
        { id:"q3", goal:4, prompt:"Why do diamonds last although diamond → graphite has " + G0 + " < 0?",
          choices:[{ t:"Very high activation energy", ok:true, fb:"Right. Spontaneous isn’t fast." }, { t:G0 + " is really positive", fb:"Spontaneous isn’t fast. " + M3 }, { t:"Diamond is a gas", fb:"Spontaneous isn’t fast. " + M3 }, { t:"Graphite is unstable", fb:"Spontaneous isn’t fast. " + M3 }] },
        { id:"q4", goal:5, prompt:G0 + " = +40 kJ. " + K + " is about…",
          choices:[{ t:"1 × 10<sup>−7</sup>", ok:true, fb:"Right. Positive " + G0 + ": small, but not zero." }, { t:"1 × 10<sup>7</sup>", fb:"Positive " + G0 + ": small, but not zero. " + M6 }, { t:"−40", fb:"Positive " + G0 + ": small, but not zero. " + M6 }, { t:"0", fb:"Positive " + G0 + ": small, but not zero. " + M6 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"quad", type:"sorter", title:"Which quadrant?", summary:"Which quadrant?", noun:"process", goal:2, txt:true,
        instruction:"Decide the signs of " + H + " and " + S + " for each process, then sort it into its box.",
        how:"Tap a process, then tap the box it belongs in.",
        boxes:[{ id:"always", label:"Always spontaneous", sub:H + " < 0, " + S + " > 0" }, { id:"never", label:"Never spontaneous", sub:H + " > 0, " + S + " < 0" },
          { id:"high", label:"Spontaneous at high " + T, sub:"both +" }, { id:"low", label:"Spontaneous at low " + T, sub:"both −" }],
        wrongDefault:"Find the signs of " + H + " and " + S + ", then match the pair to a box.",
        items:[
          quad("x1", "Water boiling.", "high", H + " > 0 (heat absorbed) and " + S + " > 0 (liquid → gas): spontaneous above 100 °C.",
            { never:"Endothermic, but liquid → gas: spontaneous above 100 °C." }),
          quad("x2", "Water freezing.", "low", H + " < 0 (heat released) and " + S + " < 0 (liquid → solid): spontaneous below 0 °C."),
          quad("x3", "Ammonia forming from " + F("N2") + " and " + F("H2") + ".", "low", H + " < 0 and " + S + " < 0 (4 mol of gas → 2 mol): spontaneous below the crossover.",
            { always:"Exothermic, but 4 mol of gas → 2 mol: spontaneous only below the crossover. " + M4 }),
          quad("x4", "Limestone decomposing.", "high", H + " > 0 and " + S + " > 0 (a gas forms): spontaneous above about 1127 K."),
          quad("x5", "A reaction with " + H + " = −50 kJ, " + S + " = +80 J/K.", "always", H + " < 0 and " + S + " > 0: both terms make " + G + " negative."),
          quad("x6", "A reaction with " + H + " = +40 kJ, " + S + " = −50 J/K.", "never", H + " > 0 and " + S + " < 0: both terms make " + G + " positive."),
          quad("x7", "Hydrogen peroxide decomposing (exothermic, and gas forms).", "always", H + " < 0 and " + S + " > 0 (gas forms): spontaneous at every temperature."),
          quad("x8", "Making ozone from oxygen, " + F("3O2(g) → 2O3(g)") + " (endothermic, fewer gas moles).", "never", H + " > 0 and " + S + " < 0 (3 mol of gas → 2 mol): never spontaneous.")
        ] },
      { id:"calc", type:"custom", title:"Calculate with " + G, summary:"Calculate with ΔG", star:true, goal:[1, 3, 6],
        instruction:"Six calculations. Items 3 to 6 are non-routine (★); items 5 and 6 go beyond the Final Check.",
        how:"Type a number (or tap a choice), then press <strong>Check</strong>.",
        items:[
          { id:"x1", goal:1, prompt:H + " = +40 kJ, " + S + " = +100 J/K, " + T + " = 300 K. " + G + "?", unit:"kJ", answer:[10], display:"+10 kJ",
            why:"40 − 300 × 0.100 = 40 − 30 = +10 kJ.",
            wrong:[{ match:70, fb:M5 }, { match:-29960, fb:M1 }],
            hints:["Convert " + S + " to kJ/K: 100 J/K = 0.100 kJ/K.", G + " = 40 − 300 × 0.100.", "+10 kJ."] },
          { id:"x2", goal:3, prompt:"Same reaction: crossover temperature?", unit:"K", answer:[400], display:"400 K",
            why:"40 ÷ 0.100 = 400 K.",
            wrong:[{ match:0.4, fb:M1 + " Use 0.100 kJ/K." }],
            hints:["Crossover = " + H + " ÷ " + S + ".", "Use " + S + " = 0.100 kJ/K.", "40 ÷ 0.100 = 400 K."] },
          { id:"x3", goal:3, star:true, prompt:"A liquid has " + H + "<sub>vap</sub> = +30.0 kJ/mol and " + S + "<sub>vap</sub> = +100 J/(mol·K). Find its boiling point.", unit:"K", answer:[300], display:"300 K (27 °C)",
            why:"At the boiling point " + G + " = 0, so " + T + " = 30.0 ÷ 0.100 = 300 K (27 °C).",
            wrong:[{ match:3000, fb:S + " = 0.100 kJ/(mol·K)." }, { match:0.3, fb:M1 }, { match:27, fb:"Give the answer in kelvin: 300 K is 27 °C." }],
            hints:["At the boiling point, " + G + " = 0.", T + " = " + H + " ÷ " + S + ", with " + S + " = 0.100 kJ/(mol·K).", "30.0 ÷ 0.100 = 300 K."] },
          { id:"x4", goal:3, star:true, prompt:"A reaction becomes spontaneous above 500 K, and " + H + " = +75 kJ. Find " + S + " in J/K.", unit:"J/K", answer:[150, 0.15], display:"+150 J/K (0.150 kJ/K)",
            why:S + " = " + H + " ÷ " + T + " = 75 ÷ 500 = +0.150 kJ/K = +150 J/K.",
            wrong:[{ match:-150, fb:"Spontaneous above the crossover means " + S + " > 0." }, { match:-0.15, fb:"Spontaneous above the crossover means " + S + " > 0." }],
            hints:["At the crossover, " + H + " = " + TS + ".", S + " = 75 ÷ 500 kJ/K.", "+0.150 kJ/K = +150 J/K."] },
          { id:"x5", goal:6, star:true, prompt:"<strong>Investigation:</strong> A salt dissolves on its own at 25 °C and the solution gets colder. Which must be true?",
            options:[
              { t:S + " > 0 and " + TS + " > " + H, ok:true, why:"Getting colder means endothermic: only a large entropy gain can make " + G + " < 0." },
              { t:S + " < 0", why:"Getting colder means endothermic: only a large entropy gain can make " + G + " < 0." },
              { t:H + " < 0", why:"Getting colder means endothermic: only a large entropy gain can make " + G + " < 0." },
              { t:G + " > 0", why:"It dissolves on its own, so " + G + " < 0. Getting colder means endothermic: only a large entropy gain can make " + G + " < 0." }],
            hints:["The solution gets colder: is " + H + " positive or negative?", "Positive. So what must make " + G + " negative?", "A large entropy gain: " + S + " > 0 and " + TS + " > " + H + "."] },
          { id:"x6", goal:3, star:true, prompt:"Using rounded values " + H + " = −92 kJ and " + S + " = −0.200 kJ/K for ammonia synthesis, find the highest temperature at which it is spontaneous at standard conditions.", unit:"K", answer:[460], display:"460 K",
            side:{ label:"Below or above that temperature, the reaction is spontaneous…", options:[{ t:"below it", ok:true }, { t:"above it" }] },
            sideWrong:"Not above. " + M7 + " Here " + S + " < 0, so raising " + T + " makes " + G + " more positive: spontaneous below the crossover.",
            why:"−92 ÷ −0.200 = 460 K. Both signs are negative, so it is spontaneous below 460 K.",
            wrong:[{ match:-460, fb:"Temperatures in kelvin are positive: −92 ÷ −0.200 = +460." }, { match:0.46, fb:M1 }],
            hints:["Both signs are negative: spontaneous at low " + T + ".", "Crossover = −92 ÷ −0.200.", "460 K; below it, " + G + " < 0."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Tobias", how:"", goal:[1, 4],
        instruction:"Tobias made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:H + " = +60 kJ, " + S + " = +0.150 kJ/K. Is the reaction spontaneous at 227 °C?",
            steps:[G + " = " + H + " − " + TS + ".", T + " = 227.", G + " = 60 − 227 × 0.150 = +26 kJ.", "Not spontaneous."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows."],
            fixes:[
              { t:T + " = 227 + 273 = 500 K, so " + G + " = 60 − 75 = −15 kJ: spontaneous.", ok:true, why:M2 },
              { t:T + " = 227 − 273.", why:"Add 273 to °C. " + M2 },
              { t:"Use " + T + " = 0.227.", why:M2 },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["What unit must " + T + " have?", "Kelvin.", "500 K gives −15 kJ."] },
          { id:"e2", goal:1, task:H + " = −80 kJ, " + S + " = −200 J/K, " + T + " = 300 K. Find " + G + ".",
            steps:[G + " = " + H + " − " + TS + ".", TS + " = 300 K × (−200 J/K) = −60 000 J.", G + " = −80 − (−60 000) = +59 920 kJ.", "Not spontaneous."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct: in joules.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Convert first: −60 000 J = −60 kJ, so " + G + " = −80 + 60 = −20 kJ (spontaneous).", ok:true, why:M1 },
              { t:G + " = −80 − 60 000 = −60 080 kJ.", why:"The units still don’t match. " + M1 },
              { t:"Ignore " + TS + ".", why:"Both terms matter. " + M1 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Are both terms in the same unit?", "No: one is kJ, one is J.", "−60 kJ, so " + G + " = −20 kJ."] },
          { id:"e3", goal:4, task:"Explain what " + G0 + " = −890 kJ means for methane burning.",
            steps:[G0 + " is negative.", "So the reaction is spontaneous at 298 K.", "So methane burns as soon as it touches air.", "That’s why gas stoves don’t need igniters."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Spontaneous means it can happen on its own, but the activation energy is high; a spark is needed to start it.", ok:true, why:M3 },
              { t:G0 + " negative means it never happens.", why:M3 },
              { t:"Methane burns only if " + H + " > 0.", why:"Burning is exothermic. " + M3 },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Does " + G + " tell you anything about speed?", "No: that’s kinetics.", "It needs " + EA + ": a spark."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: an endothermic change that happens on its own, or an exothermic one that doesn’t?" },
      { id:"j2", q:"In your own words, explain why temperature matters in " + G + " = " + H + " − " + TS + "." },
      { id:"j3", q:"Explain to a friend the difference between ‘spontaneous’ and ‘fast’, with an example." },
      { id:"j4", q:"Which step trips you up most (units, kelvin, or crossover direction)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which equation gives the Gibbs free energy change?", options:[
          { t:G + " = " + H + " − " + TS, ok:true, why:"Enthalpy minus temperature times entropy." },
          { t:G + " = " + H + " + " + TS, why:M5 },
          { t:G + " = " + TS + " − " + H, why:"That’s the negative of " + G + "." },
          { t:G + " = " + H + " ÷ " + S, why:"That’s the crossover temperature." }] },
        b:{ prompt:H + " is in kJ. What should " + S + " = +150 J/K be written as?", options:[
          { t:"0.150 kJ/K", ok:true, why:"150 ÷ 1000." },
          { t:"150 000 kJ/K", why:"Divide by 1000. " + M1 },
          { t:"1.50 kJ/K", why:M1 },
          { t:"15.0 kJ/K", why:M1 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:H + " < 0 and " + S + " > 0. When is the change spontaneous?", options:[
          { t:"At all temperatures", ok:true, why:"Both terms make " + G + " negative." },
          { t:"Only at high temperatures", why:"Both terms make " + G + " negative, so there is no crossover." },
          { t:"Only at low temperatures", why:"Both terms make " + G + " negative, so there is no crossover." },
          { t:"Never", why:M4 }] },
        b:{ prompt:H + " > 0 and " + S + " < 0. When is the change spontaneous?", options:[
          { t:"Never", ok:true, why:"Both terms make " + G + " positive." },
          { t:"Only at high temperatures", why:"Both terms make " + G + " positive, so there is no crossover." },
          { t:"Only at low temperatures", why:"Both terms make " + G + " positive, so there is no crossover." },
          { t:"At all temperatures", why:M4 }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:G + " = 0 means the system is…", options:[
          { t:"at equilibrium", ok:true, why:"No net drive in either direction." },
          { t:"not reacting at all", why:"Both directions continue. " + M6 },
          { t:"spontaneous", why:G + " must be negative." },
          { t:"finished, with all reactants used", why:M6 }] },
        b:{ prompt:"A reaction has " + G0 + " < 0 at 298 K. Its equilibrium constant " + K + " is…", options:[
          { t:"greater than 1", ok:true, why:"Products are favoured." },
          { t:"less than 1", why:"That’s for " + G0 + " > 0." },
          { t:"exactly 1", why:"That’s for " + G0 + " = 0." },
          { t:"zero", why:M6 }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:H + " = +60 kJ, " + S + " = +150 J/K, " + T + " = 500 K. " + G + "?", options:[
          { t:"−15 kJ", ok:true, why:"60 − 500 × 0.150." },
          { t:"+135 kJ", why:M5 },
          { t:"−74 940 kJ", why:M1 },
          { t:"+15 kJ", why:"That’s " + TS + " − " + H + "." }] },
        b:{ prompt:H + " = −80 kJ, " + S + " = −200 J/K, " + T + " = 300 K. " + G + "?", options:[
          { t:"−20 kJ", ok:true, why:"−80 − 300 × (−0.200)." },
          { t:"−140 kJ", why:M5 },
          { t:"+59 920 kJ", why:M1 },
          { t:"+20 kJ", why:"Sign slip." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:H + " = +90 kJ, " + S + " = +0.200 kJ/K. Above what temperature is the change spontaneous?", options:[
          { t:"450 K", ok:true, why:"90 ÷ 0.200." },
          { t:"18 K", why:"That multiplies." },
          { t:"0.0022 K", why:"That divides the wrong way." },
          { t:"It’s spontaneous <strong>below</strong> 450 K", why:M7 }] },
        b:{ prompt:H + " = −120 kJ, " + S + " = −0.300 kJ/K. When is the change spontaneous?", options:[
          { t:"Below 400 K", ok:true, why:"−120 ÷ −0.300 = 400 K; both signs are negative, so it is spontaneous below it." },
          { t:"Above 400 K", why:"Both signs are negative: spontaneous below the crossover, not above." },
          { t:"Below 36 K", why:"That multiplies." },
          { t:"At all temperatures", why:M4 }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"A reaction is spontaneous at 200 K but not at 600 K. Which signs must " + H + " and " + S + " have?", options:[
          { t:H + " < 0, " + S + " < 0", ok:true, why:"Spontaneous at low " + T + " only: both negative." },
          { t:H + " > 0, " + S + " > 0", why:"That pair is spontaneous above the crossover, at high " + T + ". " + M7 },
          { t:H + " < 0, " + S + " > 0", why:"That’s spontaneous at every " + T + "." },
          { t:H + " > 0, " + S + " < 0", why:"That’s never spontaneous." }] },
        b:{ prompt:"A reaction is spontaneous at 900 K but not at 300 K. Which signs?", options:[
          { t:H + " > 0, " + S + " > 0", ok:true, why:"Spontaneous at high " + T + " only: both positive." },
          { t:H + " < 0, " + S + " < 0", why:"That pair is spontaneous below the crossover, at low " + T + ". " + M7 },
          { t:H + " < 0, " + S + " > 0", why:"That’s spontaneous at every " + T + "." },
          { t:H + " > 0, " + S + " < 0", why:"That’s never spontaneous." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:G0 + " for burning sugar in air is hugely negative, yet sugar sits in a bowl for years. Which is the best explanation?", options:[
          { t:"“" + G + " tells whether a change can happen, not how fast; at room temperature the activation energy is too high.”", ok:true, why:"Spontaneous isn’t fast." },
          { t:"“" + G + " is actually positive at room temperature.”", why:"It’s very negative." },
          { t:"“Sugar has no enthalpy.”", why:"Every substance has enthalpy." },
          { t:"“Entropy stops the reaction.”", why:"Entropy favours the gases formed." }] },
        b:{ prompt:"Diamond → graphite has " + G0 + " = −2.9 kJ/mol. Which best explains why diamonds don’t turn into graphite?", options:[
          { t:"“The change is spontaneous but extremely slow, because the activation energy is enormous.”", ok:true, why:"Spontaneous isn’t fast." },
          { t:"“Diamond is more stable than graphite.”", why:G0 + " says graphite is more stable." },
          { t:"“" + G0 + " > 0 for this change.”", why:"It’s negative." },
          { t:"“Spontaneous changes always happen within a year.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which best explains why a cold pack (endothermic) works on its own?", options:[
          { t:"“Its entropy increase is large enough that " + TS + " is bigger than " + H + ", so " + G + " < 0.”", ok:true, why:"The entropy gain wins." },
          { t:"“Endothermic changes are always spontaneous.”", why:M4 },
          { t:"“The pack’s temperature drop makes " + H + " negative.”", why:H + " stays positive." },
          { t:"“Cold packs break the second law.”", why:"They don’t." }] },
        b:{ prompt:"Which best explains why ammonia synthesis is spontaneous at 300 K but not at 700 K?", options:[
          { t:"“" + S + " is negative, so −" + TS + " is positive and grows with " + T + "; above about 460 K it outweighs the negative " + H + ".”", ok:true, why:"The entropy loss wins at high " + T + "." },
          { t:"“" + H + " becomes positive at high temperature.”", why:H + " barely changes." },
          { t:"“Exothermic reactions are never spontaneous at high " + T + ".”", why:M4 },
          { t:"“The reaction runs faster at 700 K, so it’s less spontaneous.”", why:M3 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Lime kilns turn limestone into lime: " + F("CaCO3(s) → CaO(s) + CO2(g)") + ", with " + H + "° = +179.2 kJ and " + S + "° = +159.0 J/K (crossover ≈ 1127 K). Why do kilns run hotter than about 1130 K?", options:[
          { t:"“Below about 1127 K, " + G + " > 0, so the decomposition isn’t spontaneous.”", ok:true, why:"Both signs are positive: spontaneous only above the crossover." },
          { t:"“At lower temperatures it goes too fast.”", why:M3 },
          { t:"“" + S + " turns negative below 1127 K.”", why:S + " stays positive." },
          { t:"“" + H + " becomes negative above 1127 K.”", why:H + " stays positive." }] },
        b:{ prompt:"Ammonia synthesis has " + H + "° = −91.8 kJ and " + S + "° = −198.1 J/K (crossover ≈ 463 K). Industrial plants still run near 700 K. Why?", options:[
          { t:"“At low temperature the reaction is far too slow; a higher temperature with a catalyst gives a usable rate, and high pressure helps the yield.”", ok:true, why:"Rate, not spontaneity, sets the operating temperature." },
          { t:"“" + G0 + " is more negative at 700 K.”", why:"It’s positive above 463 K." },
          { t:"“The reaction is endothermic.”", why:"It’s exothermic." },
          { t:"“" + K + " increases with temperature for this reaction.”", why:"For an exothermic reaction, " + K + " falls as " + T + " rises." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"From the table: " + G0 + " = +20 kJ corresponds to " + K + " ≈ 3 × 10<sup>−4</sup> at 298 K. Which is true for a reaction with " + G0 + " = +20 kJ?", options:[
          { t:"“At equilibrium the mixture is mostly reactants, but some product forms.”", ok:true, why:K + " < 1 but not zero." },
          { t:"“No product ever forms.”", why:M6 },
          { t:"“It goes to completion.”", why:"That would need " + G0 + " very negative." },
          { t:"“" + K + " = −20.”", why:K + " is never negative." }] },
        b:{ prompt:G0 + " = −40 kJ corresponds to " + K + " ≈ 1 × 10<sup>7</sup>. Which is true?", options:[
          { t:"“At equilibrium the mixture is almost all products, but a tiny amount of reactant remains.”", ok:true, why:"A huge " + K + ", but not infinite." },
          { t:"“Exactly 100% of the reactants become products.”", why:M6 },
          { t:"“The reaction must be fast.”", why:M3 },
          { t:"“" + K + " = −40.”", why:K + " is positive." }] } }
    ]
  },
  task:{
    title:"Tune the crossover", summary:"Tune the crossover",
    statement:"<p>Pick " + H + " and " + S + " for a reaction that meets every condition. Can you find them all?</p><ol class=\"gf-conds\"><li>It is spontaneous at 300 K.</li><li>It is <strong>not</strong> spontaneous at 700 K.</li><li>It releases no more than 100 kJ (" + H + " ≥ −100 kJ).</li></ol>",
    inputs:{ dH:{ label:H + " (kJ)", vals:[-120, -90, -60, 60, 90, 120] }, dS:{ label:S + " (kJ/K)", vals:[-0.300, -0.200, -0.150, 0.150, 0.200, 0.300] } },
    checks:["Spontaneous at 300 K", "Not spontaneous at 700 K", "Releases no more than 100 kJ"],
    tips:["Spontaneous at low " + T + " but not at high " + T + ": both signs must be negative.", "The crossover must lie between 300 K and 700 K.", "Crossover = " + H + " ÷ " + S + "; check that 300 K is strictly below it."],
    tipHeat:"Line 3: this design releases more than 100 kJ. " + H + " must be −100 kJ or higher.",
    explainPrompt:"Explain why both signs must be negative and how you placed the crossover between 300 K and 700 K.",
    vocab:"Use the words enthalpy, entropy, crossover temperature and spontaneous.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each crossover lies between 300 K and 700 K, and none releases more than 100 kJ."
  },
  cards:[
    ["Gibbs equation", G + " = " + H + " − " + TS + " (" + T + " in K; " + S + " in kJ/K)."],
    [G + " < 0", "Spontaneous at that temperature."],
    [G + " = 0", "At equilibrium."],
    [H + " < 0, " + S + " > 0", "Spontaneous at all temperatures."],
    [H + " > 0, " + S + " < 0", "Never spontaneous."],
    [H + " > 0, " + S + " > 0", "Spontaneous above " + T + " = " + H + " ÷ " + S + "."],
    [H + " < 0, " + S + " < 0", "Spontaneous below " + T + " = " + H + " ÷ " + S + "."],
    ["Crossover temperature", T + " = " + H + " ÷ " + S + ", where " + G + " = 0."],
    ["Spontaneous vs fast", G + ": can it happen? " + EA + ": how fast?"],
    [G0 + " and " + K, G0 + " < 0 → " + K + " > 1; " + G0 + " > 0 → " + K + " < 1."],
    ["Unit trap", "150 J/K = 0.150 kJ/K."],
    ["Kelvin trap", T + "(K) = " + T + "(°C) + 273."]
  ]
};
