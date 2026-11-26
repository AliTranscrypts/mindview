// SCH4U 27 Hess's Law. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/27-hess-law.md
// Equations are written as plain strings ("1/2 O2(g)": coefficient, a space, then the species) and typeset by app.js.
// Every card's ΔH is computed in app.js from MV.chem.data.dHf (course table); only the made-up magnesium data are local.

const DH = "Δ<i>H</i>";
const KJ = " kJ";

// Misconception core sentences (plan §3)
const M1 = "Going backwards undoes the energy change: reverse the equation, flip the sign.";
const M2 = "Twice the reaction means twice the energy. Scale both together.";
const M3 = "First rearrange the equations until they add up to the target; only then add their " + DH + " values.";
const M4 = "Only identical species in the same state cancel. Liquid → gas has its own " + DH + " (+44.0 kJ/mol).";
const M5 = DH + " depends only on start and end, like the height between two floors, whichever stairs you take.";
const M6 = "Check the sum: if anything is left over that isn’t in the target, the combination isn’t finished.";
const M7 = DH + " = −<i>q</i> ÷ <i>n</i>, in kJ/mol. Heat released by the reaction warms the water, so " + DH + " is negative.";

// Practice 1: card moves (plan Activity 1). Three extra wrong-sign values are on the right so the plan's mismatch
// feedback (1 ↔ −393.5, 4 ↔ −566.0, 5 ↔ −58.1) can happen.
const MOVES = [
  ["Reverse C(s) + O₂(g) → CO₂(g) (−393.5)", "+393.5 kJ", "Reversed, so the sign flips: +393.5 kJ."],
  ["×2: H₂(g) + ½O₂(g) → H₂O(l) (−285.8)", "−571.6 kJ", "Twice the reaction, twice the energy: −571.6 kJ."],
  ["×½: N₂(g) + O₂(g) → 2NO(g) (+182.6)", "+91.3 kJ", "Half the reaction, half the energy: +91.3 kJ."],
  ["Reverse and ×2: CO(g) + ½O₂(g) → CO₂(g) (−283.0)", "+566.0 kJ", "Flip the sign (+283.0), then double: +566.0 kJ."],
  ["Reverse and ×½: 2NO(g) + O₂(g) → 2NO₂(g) (−116.2)", "+58.1 kJ", "Flip the sign (+116.2), then halve: +58.1 kJ."],
  ["×3: C(s) + ½O₂(g) → CO(g) (−110.5)", "−331.5 kJ", "Three times the reaction: 3 × (−110.5) = −331.5 kJ."],
  ["Reverse: CaCO₃(s) → CaO(s) + CO₂(g) (+179.2)", "−179.2 kJ", "Reversed, so the sign flips: −179.2 kJ."],
  ["×2: ½N₂(g) + 1½H₂(g) → NH₃(g) (−45.9)", "−91.8 kJ", "Twice the reaction: 2 × (−45.9) = −91.8 kJ."]
];
const MOVE_ANS = {}; MOVES.forEach((m, i) => { MOVE_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"27-hess-law",
  kind:"topic",
  title:"Hess’s law",
  topic:"Hess’s Law",
  readyTopic:"Hess’s law",
  hero:{
    eq:'<span class="nw">Δ<i>H</i>(direct) =</span> <span class="nw">Δ<i>H</i><sub>1</sub> + Δ<i>H</i><sub>2</sub> + …</span>', eqSize:"md",
    eqLabel:"Delta H direct equals delta H 1 plus delta H 2 plus and so on",
    headline:"The route doesn’t change the climb.",
    text:"Carbon can burn straight to CO₂, or first to CO and then to CO₂. <strong>Hess’s law</strong> says the total <strong>enthalpy change</strong> is the same either way. So you can <strong>reverse</strong>, <strong>scale</strong> and <strong>add</strong> known equations to find a " + DH + " that is hard to measure.",
    fig:{ html:'<div class="hs-hx"><svg class="hs-hx-svg" id="hs-hx-svg" viewBox="0 0 480 330" role="img" aria-label="Enthalpy-level diagram with three levels: C(s) + O₂(g) at the top, CO(g) + ½O₂(g) in the middle and CO₂(g) at the bottom. A long orange arrow drops straight from the top level to the bottom: −393.5 kJ. Two shorter arrows step down through the middle level: −110.5 kJ, then −283.0 kJ. A bracket shows −110.5 + (−283.0) = −393.5 kJ."></svg><div class="hs-hx-row"><p class="hs-hx-ctr" id="hs-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="hs-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can state Hess’s law and explain why " + DH + " depends only on the start and end.",
    "I can reverse and scale thermochemical equations and their " + DH + " values correctly.",
    "I can show Hess’s law on an enthalpy-level diagram.",
    "I can combine two to four equations to find an unknown " + DH + ".",
    "I can account for states of matter when combining equations.",
    "I can analyse calorimetry data with Hess’s law and evaluate the result."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Thermochemical equations", goal:2,
          prompt:"C(s) + O₂(g) → CO₂(g) + 393.5 kJ. Write the energy change as " + DH + ".",
          options:[
            { t:DH + " = −393.5 kJ", ok:true, why:"Heat is a product, so the reaction releases energy." },
            { t:DH + " = +393.5 kJ", why:"A heat <strong>product</strong> means exothermic: negative " + DH + "." },
            { t:DH + " = −787.0 kJ", why:"There’s no factor of 2 here." },
            { t:DH + " = 0", why:"Energy is released." }],
          hints:["Is heat a reactant or a product?", "A product: released.", "−393.5 kJ."] },
        { id:"w2", skill:"Thermochemical equations", goal:2,
          prompt:"N₂(g) + O₂(g) + 182.6 kJ → 2NO(g). What is " + DH + "?",
          options:[
            { t:"+182.6 kJ", ok:true, why:"Heat is a reactant, so energy is absorbed." },
            { t:"−182.6 kJ", why:"A heat reactant means endothermic." },
            { t:"+91.3 kJ", why:"That’s per mole of NO; the equation makes 2 mol." },
            { t:"+365.2 kJ", why:"No doubling needed." }],
          hints:["Which side is the heat on?", "The reactant side.", "+182.6 kJ."] },
        { id:"w3", skill:"Calorimetry", goal:6,
          prompt:"100.0 g of water warms by 5.0 °C. How much heat did it absorb? (<i>c</i> = 4.18 J/(g·°C))",
          options:[
            { t:"2090 J", ok:true, why:"100.0 × 4.18 × 5.0." },
            { t:"418 J", why:"Multiply by 5.0 too." },
            { t:"20.9 J", why:"Use all 100.0 g." },
            { t:"2.09 J", why:"That’s 2.09 <strong>kJ</strong>." }],
          hints:["<i>q</i> = <i>mc</i>Δ<i>T</i>.", "100.0 × 4.18 = 418.", "418 × 5.0 = 2090 J."] },
        { id:"w4", skill:"Calorimetry", goal:6,
          prompt:"A reaction of 0.0100 mol releases 2.09 kJ into the water. What is its molar enthalpy?",
          options:[
            { t:"−209 kJ/mol", ok:true, why:"2.09 ÷ 0.0100 = 209; released → negative." },
            { t:"+209 kJ/mol", why:"Released heat means negative " + DH + ". " + M7 },
            { t:"−2.09 kJ/mol", why:"Divide by the moles." },
            { t:"−20.9 kJ/mol", why:"2.09 ÷ 0.0100 = 209." }],
          hints:[DH + " = −<i>q</i> ÷ <i>n</i>.", "2.09 ÷ 0.0100.", "−209 kJ/mol."] },
        { id:"w5", skill:"Adding equations", goal:4,
          prompt:"Add A → B and B → C. What is the net equation?",
          options:[
            { t:"A → C", ok:true, why:"B appears on both sides and cancels." },
            { t:"A + B → B + C", why:"Cancel what appears on both sides." },
            { t:"A → B + C", why:"B cancels." },
            { t:"2B → A + C", why:"Reactants stay on the left." }],
          hints:["Write both, then add.", "A + B → B + C.", "Cancel B: A → C."] },
        { id:"w6", skill:"Scaling equations", goal:2,
          prompt:"If 1 mol of CH₄ releases 890.5 kJ when it burns, how much do 2 mol release?",
          options:[
            { t:"1781.0 kJ", ok:true, why:"Twice the amount, twice the energy." },
            { t:"890.5 kJ", why:M2 },
            { t:"445.3 kJ", why:"That’s for half a mole." },
            { t:"3562.0 kJ", why:"That’s for 4 mol." }],
          hints:["Energy is proportional to amount.", "× 2.", "1781.0 kJ."] }
      ],
      refreshers:{
        "Thermochemical equations":"Heat on the product side means " + DH + " &lt; 0; heat on the reactant side means " + DH + " &gt; 0.",
        "Calorimetry":"<i>q</i> = <i>mc</i>Δ<i>T</i> (in J). Molar enthalpy " + DH + " = −<i>q</i> ÷ <i>n</i>, in kJ/mol.",
        "Adding equations":"Line up both equations, add the two sides, cancel species that appear on both sides in the same state, and add the " + DH + " values.",
        "Scaling equations":"Multiplying the coefficients by <i>k</i> multiplies " + DH + " by <i>k</i>."
      }
    }
  },
  explore:{
    heading:"Equation puzzle",
    intro:"Flip and scale the cards until they add up to the target. The " + DH + " follows every move.",
    how:"Choose a mode and a puzzle. On each card, set <strong>Reverse</strong>, the multiplier and <strong>Include</strong>. The sum and the readout update as you go. For a challenge, type the " + DH + " of your sum in the box.",
    modes:[{ id:"puzzle", t:"Puzzle" }, { id:"diagram", t:"Diagram" }, { id:"free", t:"Free build" }],
    puzzles:[
      { id:"A", target:"C(s) + 1/2 O2(g) -> CO(g)", cards:["C(s) + O2(g) -> CO2(g)", "CO(g) + 1/2 O2(g) -> CO2(g)"] },
      { id:"B", target:"C(s) + 2 H2(g) -> CH4(g)", cards:["C(s) + O2(g) -> CO2(g)", "H2(g) + 1/2 O2(g) -> H2O(l)", "CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l)"] },
      { id:"C", target:"1/2 N2(g) + O2(g) -> NO2(g)", cards:["N2(g) + O2(g) -> 2 NO(g)", "2 NO(g) + O2(g) -> 2 NO2(g)"] },
      { id:"D", target:"CaCO3(s) -> CaO(s) + CO2(g)", cards:["Ca(s) + 1/2 O2(g) -> CaO(s)", "C(s) + O2(g) -> CO2(g)", "Ca(s) + C(s) + 3/2 O2(g) -> CaCO3(s)"] },
      { id:"E", target:"Fe2O3(s) + 3 CO(g) -> 2 Fe(s) + 3 CO2(g)", cards:["2 Fe(s) + 3/2 O2(g) -> Fe2O3(s)", "C(s) + 1/2 O2(g) -> CO(g)", "C(s) + O2(g) -> CO2(g)"] }
    ],
    // Free build: any target; its cards are the course-table formation equations of the compounds in it (both water
    // phases whenever water appears, so the state rule can show).
    free:[
      { id:"f1", eq:"CO(g) + 1/2 O2(g) -> CO2(g)" },
      { id:"f2", eq:"CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l)" },
      { id:"f3", eq:"CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(g)" },
      { id:"f4", eq:"H2O(l) -> H2O(g)" },
      { id:"f5", eq:"CaCO3(s) -> CaO(s) + CO2(g)" },
      { id:"f6", eq:"2 NO(g) + O2(g) -> 2 NO2(g)" },
      { id:"f7", eq:"CH4(g) + H2O(g) -> CO(g) + 3 H2(g)" },
      { id:"f8", eq:"Fe2O3(s) + 3 CO(g) -> 2 Fe(s) + 3 CO2(g)" },
      { id:"f9", eq:"CO(g) + 2 H2(g) -> CH3OH(l)" },
      { id:"f10", eq:"C2H5OH(l) + 3 O2(g) -> 2 CO2(g) + 3 H2O(l)" },
      { id:"f11", eq:"2 NH3(g) -> N2(g) + 3 H2(g)" }
    ],
    stateRule:"H₂O(l) and H₂O(g) are different. Add the phase change if you need it.",
    freeNote:"Free build: the cards are formation equations from the course table (elements in their standard states have " + DH + "°f = 0).",
    predictions:[
      { id:"p1", prompt:"If you reverse C(s) + O₂(g) → CO₂(g) (" + DH + " = −393.5 kJ), the new " + DH + " is…",
        options:[{ t:"+393.5 kJ", ok:true }, { t:"−393.5 kJ" }, { t:"0 kJ" }, { t:"−787.0 kJ" }],
        explain:"Un-burning CO₂ would need back exactly the energy burning released. " + M1 },
      { id:"p2", prompt:"Multiply H₂(g) + ½O₂(g) → H₂O(l) (−285.8 kJ) by 2. " + DH + " becomes…",
        options:[{ t:"−571.6 kJ", ok:true }, { t:"−285.8 kJ" }, { t:"−142.9 kJ" }, { t:"+571.6 kJ" }],
        explain:"Twice the reaction, twice the energy. " + M2 },
      { id:"p3", prompt:"Carbon to CO₂ directly is −393.5 kJ. Via CO, the two steps add to…",
        options:[{ t:"−393.5 kJ", ok:true }, { t:"more negative than −393.5 kJ" }, { t:"less negative" }, { t:"it depends on the speed" }],
        explain:"Same start, same end, same " + DH + ". " + M5 },
      { id:"p4", prompt:"Card: CO(g) + ½O₂(g) → CO₂(g), −283.0 kJ. Reverse it <strong>and</strong> multiply by 2. " + DH + " becomes…",
        options:[{ t:"+566.0 kJ", ok:true }, { t:"−566.0 kJ" }, { t:"+283.0 kJ" }, { t:"−141.5 kJ" }],
        explain:"Flip the sign, then double: 2CO₂(g) → 2CO(g) + O₂(g), +566.0 kJ." }
    ],
    chalIntro:"Set the cards, type the " + DH + " of your sum, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Solve Puzzle A.",
        why:"Card 1 as written plus card 2 reversed adds up to C(s) + ½O₂(g) → CO(g): −393.5 + 283.0 = −110.5 kJ.",
        general:"The sum doesn’t match the target yet.",
        hints:["The target has CO as a <strong>product</strong>. Which card has CO, and on which side?", "Reverse card 2 so CO is a product; keep card 1.", "−393.5 + 283.0 = −110.5 kJ."] },
      { id:"tc2", goal:[2, 4], prompt:"Solve Puzzle B.",
        why:"Card 1, card 2 doubled and card 3 reversed add up to C(s) + 2H₂(g) → CH₄(g): −393.5 + 2(−285.8) + 890.5 = −74.6 kJ, which matches the course table.",
        general:"The sum doesn’t match the target yet.",
        hints:["Which card has CH₄? It must end on the right.", "Reverse card 3; you then need 2H₂ on the left, so double card 2.", "−393.5 + 2(−285.8) + 890.5 = −74.6 kJ, which matches the course table."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Solve Puzzle C. The target makes <strong>1</strong> mol of NO₂.",
        why:"Both cards halved add up to ½N₂(g) + O₂(g) → NO₂(g): +91.3 − 58.1 = +33.2 kJ.",
        general:"The sum doesn’t match the target yet.",
        hints:["Add the cards as they are first. What do you get?", "N₂ + 2O₂ → 2NO₂, " + DH + " = +66.4 kJ: twice the target.", "Halve both: +91.3 − 58.1 = +33.2 kJ."] }
    ]
  },
  part3:{
    slug:"magnesium", name:"Test it", heading:"Test Hess’s law",
    intro:"Burning magnesium is too bright and too fast to measure in a coffee-cup calorimeter. Instead, measure two gentle reactions with acid and combine them with Hess’s law. This part works with lab <strong>data</strong>, not cards: two calorimetry runs, a table value, a calculation and an error analysis. It’s virtual, and the data are made up for the module.",
    // Made-up magnesium data (plan §6 risk 3): masses, ΔT values and the 100.0 g of solution.
    runs:[
      { id:"r1", eq:"Mg(s) + 2 HCl(aq) -> MgCl2(aq) + H2(g)", sample:"0.243 g Mg (0.0100 mol)", soln:"100.0 g dilute HCl(aq)", m:100.0, dT:11.0, n:0.0100 },
      { id:"r2", eq:"MgO(s) + 2 HCl(aq) -> MgCl2(aq) + H2O(l)", sample:"0.403 g MgO (0.0100 mol)", soln:"100.0 g dilute HCl(aq)", m:100.0, dT:3.6, n:0.0100 }
    ],
    s1:{ title:"Station 1: Two calorimetry runs",
      intro:"Each run reacts 0.0100 mol of solid with 100.0 g of dilute acid in a coffee-cup calorimeter. Find <i>q</i> = <i>mc</i>Δ<i>T</i>, then the molar enthalpy of each reaction.",
      uses:"<i>c</i> = 4.18 J/(g·°C); the solution behaves like water.",
      q:[
        { id:"r1", label:"Δ<i>H</i><sub>1</sub> (Run 1)", answer:-459.8, tol:0.1, display:"−459.8 kJ/mol",
          why:"<i>q</i><sub>1</sub> = 100.0 × 4.18 × 11.0 = 4598 J = 4.598 kJ, so Δ<i>H</i><sub>1</sub> = −4.598 ÷ 0.0100 = −459.8 kJ/mol.",
          hints:["<i>q</i> = <i>mc</i>Δ<i>T</i>, with <i>m</i> = 100.0 g and Δ<i>T</i> = 11.0 °C.", "<i>q</i><sub>1</sub> = 100.0 × 4.18 × 11.0 = 4598 J = 4.598 kJ.", "Δ<i>H</i><sub>1</sub> = −4.598 ÷ 0.0100 = −459.8 kJ/mol."] },
        { id:"r2", label:"Δ<i>H</i><sub>2</sub> (Run 2)", answer:-150.5, tol:0.1, display:"−150.5 kJ/mol",
          why:"<i>q</i><sub>2</sub> = 100.0 × 4.18 × 3.6 = 1504.8 J = 1.5048 kJ, so Δ<i>H</i><sub>2</sub> = −1.5048 ÷ 0.0100 = −150.5 kJ/mol.",
          hints:["<i>q</i> = <i>mc</i>Δ<i>T</i>, with <i>m</i> = 100.0 g and Δ<i>T</i> = 3.6 °C.", "<i>q</i><sub>2</sub> = 100.0 × 4.18 × 3.6 = 1504.8 J = 1.5048 kJ.", "Δ<i>H</i><sub>2</sub> = −1.5048 ÷ 0.0100 = −150.5 kJ/mol."] }
      ],
      fbJ:"That’s <i>q</i> in J. Convert to kJ and divide by moles.",
      fbKJ:"That’s <i>q</i> in kJ. Now divide by the moles (0.0100 mol).",
      fbSign:M7,
      fbOther:"Find <i>q</i> = <i>mc</i>Δ<i>T</i> in J, convert it to kJ, divide by 0.0100 mol, and make it negative: the water warmed." },
    s2:{ title:"Station 2: Combine",
      intro:"The target is <strong>Mg(s) + ½O₂(g) → MgO(s)</strong>. The third equation comes from the course table. Choose how to use each equation, then find " + DH + " for the target.",
      target:"Mg(s) + 1/2 O2(g) -> MgO(s)",
      eqs:[
        { id:"e1", name:"(1) Run 1", eq:"Mg(s) + 2 HCl(aq) -> MgCl2(aq) + H2(g)", dH:-459.8, lab:"Δ<i>H</i><sub>1</sub>" },
        { id:"e2", name:"(2) Run 2", eq:"MgO(s) + 2 HCl(aq) -> MgCl2(aq) + H2O(l)", dH:-150.5, lab:"Δ<i>H</i><sub>2</sub>" },
        { id:"e3", name:"(3) Water, from the course table", eq:"H2(g) + 1/2 O2(g) -> H2O(l)", table:"H2O(l)", lab:"Δ<i>H</i><sub>3</sub>" }
      ],
      answer:-595.1, tol:0.1,
      why:"(1) as written, (2) reversed, (3) as written: " + DH + " = −459.8 + 150.5 − 285.8 = <strong>−595.1 kJ/mol</strong>.",
      fbE1:"Mg must stay a reactant: keep Run 1 as written.",
      fbE2:"MgO must end up as a product.",
      fbE3:"O₂ must stay a reactant and H₂O(l) has to cancel: keep the water equation as written.",
      fbAll:M3,
      fbVal:"Your equations add up to the target. Now add their adjusted " + DH + " values: −459.8 + 150.5 − 285.8.",
      hints:["MgO must end up as a <strong>product</strong>, and Mg and O₂ must stay reactants.", "Keep (1), reverse (2), keep (3).", "−459.8 + 150.5 − 285.8 = −595.1 kJ/mol."] },
    s3:{ title:"Station 3: Evaluate",
      intro:"Compare your result with the accepted value from the course table, then explain the difference.",
      pct:[{ id:"0.1", t:"0.1%" }, { id:"1", t:"1%" }, { id:"10", t:"10%" }, { id:"50", t:"50%" }],
      pctAns:"1",
      pctFb:"Percent error = |accepted − measured| ÷ |accepted| × 100% = (601.6 − 595.1) ÷ 601.6 × 100% ≈ 1%.",
      sources:[
        { id:"loss", t:"heat lost to the cup and air", good:true, why:"Some heat never reached the water, so the measured values are a little small." },
        { id:"oxide", t:"some Mg already coated with oxide", good:true, why:"An oxide coat means less than 0.0100 mol of Mg reacted in Run 1." },
        { id:"acid", t:"the HCl was too strong to react", why:"Strong acid reacts readily with Mg; that isn’t an error source." },
        { id:"hess", t:"Hess’s law only works sometimes", why:"Hess’s law always holds; the error comes from the measurements." }
      ],
      why:"Measured −595.1 kJ/mol against the accepted −601.6 kJ/mol: about 1% off. Heat lost to the cup and air, and Mg already coated with oxide, both make the measured values less negative.",
      hints:["Percent error = |accepted − measured| ÷ |accepted| × 100%.", "(601.6 − 595.1) ÷ 601.6 × 100% ≈ 1.1%.", "About 1%; the likely sources are heat lost to the cup and air, and Mg already coated with oxide."] },
    quickCheck:{
      title:"Quick check", summary:"Test Hess’s law quick check",
      items:[
        { id:"q1", goal:1, prompt:"Why not just burn Mg in a calorimeter?",
          choices:[
            { t:"the flame and the bright light make the heat hard to capture safely and accurately", ok:true, fb:"Right. Hess’s law lets two gentle reactions replace one hard measurement." },
            { t:"Mg doesn’t react with O₂", fb:"Hess’s law lets two gentle reactions replace one hard measurement." },
            { t:"Hess’s law forbids it", fb:"Hess’s law lets two gentle reactions replace one hard measurement." },
            { t:"MgO has no " + DH, fb:"Hess’s law lets two gentle reactions replace one hard measurement." }] },
        { id:"q2", goal:4, prompt:"In Station 2, which equation was reversed?",
          choices:[
            { t:"Run 2 (MgO + HCl)", ok:true, fb:"Right. MgO must end up as a product." },
            { t:"Run 1", fb:"MgO must end up as a product." },
            { t:"the water equation", fb:"MgO must end up as a product." },
            { t:"none", fb:"MgO must end up as a product." }] },
        { id:"q3", goal:6, prompt:DH + "<sub>1</sub> was negative because…",
          choices:[
            { t:"the water warmed, so the reaction released heat", ok:true, fb:"Right. The reaction released heat into the water, so " + DH + "<sub>1</sub> is negative." },
            { t:"the water cooled", fb:M7 },
            { t:"Mg absorbed heat", fb:M7 },
            { t:"the mass was small", fb:M7 }] },
        { id:"q4", goal:6, prompt:"Heat lost to the surroundings makes the measured " + DH + "<sub>1</sub>…",
          choices:[
            { t:"less negative than the true value", ok:true, fb:"Right. Less heat reached the water, so it looks like less was released." },
            { t:"more negative", fb:"Less heat reached the water, so it looks like less was released." },
            { t:"exactly right", fb:"Less heat reached the water, so it looks like less was released." },
            { t:"positive", fb:"Less heat reached the water, so it looks like less was released." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"moves", type:"match", title:"Card moves", summary:"Card moves", goal:2,
        instruction:"Match each move to the new " + DH + " of the card.",
        leftTitle:"Move", rightTitle:"New " + DH,
        left:MOVES.map((m, i) => Object.assign({ id:"l" + (i + 1), t:m[0], why:m[2] },
          i === 4 ? { hints:["Reverse first: +116.2.", "Then halve.", "+58.1 kJ."] } : {})),
        right:MOVES.map((m, i) => ({ id:"r" + (i + 1), t:m[1] })).concat([{ id:"x1", t:"−393.5 kJ" }, { id:"x2", t:"−566.0 kJ" }, { id:"x3", t:"−58.1 kJ" }]),
        answer:MOVE_ANS,
        wrong:{ "l1|x1":"Reversing flips the sign. " + M1, "l4|x2":"Reverse <strong>and</strong> double: the sign flips too.", "l5|x3":"Reversed, so the sign changes to +." },
        wrongDefault:"Apply the sign change, then the multiplier." },
      { id:"calc", type:"numeric", title:"Hess calculations", summary:"Hess calculations", star:true, goal:[4, 5],
        instruction:"Combine the given equations to find " + DH + " for each target. Items 3 to 6 are non-routine (★); items 5 and 6 go beyond the Final Check.",
        how:"Type " + DH + " in kJ, with its sign, then press Check. Answers within 0.1 kJ are accepted.",
        items:[
          { id:"h1", goal:4, prompt:"Find " + DH + " for CO(g) + ½O₂(g) → CO₂(g), given C(s) + O₂(g) → CO₂(g) (−393.5 kJ) and C(s) + ½O₂(g) → CO(g) (−110.5 kJ).",
            answer:-283.0, tol:0.1, unit:"kJ", display:"−283.0 kJ",
            wrong:[{ match:-504.0, fb:M3 }, { match:283.0, fb:M1 }],
            why:"Keep the CO₂ equation and reverse the CO equation: −393.5 + 110.5 = −283.0 kJ.",
            hints:["CO is a reactant here: reverse its equation.", "+110.5, plus the CO₂ equation as written (−393.5).", "−393.5 + 110.5 = −283.0 kJ."] },
          { id:"h2", goal:4, prompt:"Find " + DH + " for CaCO₃(s) → CaO(s) + CO₂(g), given the formation equations of CaO (−634.9 kJ), CO₂ (−393.5 kJ) and CaCO₃ (−1207.6 kJ).",
            answer:179.2, tol:0.1, unit:"kJ", display:"+179.2 kJ",
            wrong:[{ match:-2236.0, fb:M3 + " Rearrange before adding." }, { match:-179.2, fb:M1 }],
            why:"Reverse the CaCO₃ formation and keep the other two: 1207.6 − 634.9 − 393.5 = +179.2 kJ.",
            hints:["CaCO₃ is a reactant: reverse its formation.", "+1207.6, plus the CaO (−634.9) and CO₂ (−393.5) formations.", "1207.6 − 634.9 − 393.5 = +179.2 kJ."] },
          { id:"h3", goal:4, star:true, prompt:"Find " + DH + " for 2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l), given C(s) + O₂(g) → CO₂(g) (−393.5 kJ), H₂(g) + ½O₂(g) → H₂O(l) (−285.8 kJ), and C₂H₅OH(l) + 3O₂(g) → 2CO₂(g) + 3H₂O(l) (−1366.8 kJ).",
            answer:-277.6, tol:0.1, unit:"kJ", display:"−277.6 kJ",
            wrong:[{ match:277.6, fb:"The ethanol card must be reversed, not the others." }, { match:115.9, fb:M2 }, { match:294.0, fb:M2 }, { match:687.5, fb:M2 }],
            why:"Double the CO₂ equation, triple the water equation and reverse the ethanol combustion: 2(−393.5) + 3(−285.8) + 1366.8 = −277.6 kJ.",
            hints:["Ethanol is the product here: reverse its combustion.", "+1366.8, plus 2 × (−393.5) and 3 × (−285.8).", "1366.8 − 787.0 − 857.4 = −277.6 kJ."] },
          // VERIFY: STSE note (plan §6 risk 5) mentions current industry projects only generally; check before release.
          { id:"h4", goal:5, star:true, prompt:"Find " + DH + " for CH₄(g) + H₂O(g) → CO(g) + 3H₂(g) (steam reforming, the main source of industrial hydrogen), given C(s) + ½O₂(g) → CO(g) (−110.5 kJ), H₂(g) + ½O₂(g) → H₂O(g) (−241.8 kJ), and C(s) + 2H₂(g) → CH₄(g) (−74.6 kJ).",
            answer:205.9, tol:0.1, unit:"kJ", display:"+205.9 kJ",
            wrong:[{ match:-426.9, fb:M3 }, { match:-277.7, fb:"The water card must be reversed: H₂O(g) is a reactant." }],
            why:"74.6 + 241.8 − 110.5 = +205.9 kJ. <em>STSE:</em> Steam reforming and blast furnaces both release CO₂ from carbon. That’s one reason industries are researching hydrogen made with electricity, and steel made with less coal.",
            hints:["CH₄ and H₂O(g) are reactants: reverse their formation cards.", "+74.6 and +241.8, plus the CO card as written (−110.5).", "74.6 + 241.8 − 110.5 = +205.9 kJ."] },
          { id:"h5", goal:4, star:true, prompt:"Find " + DH + " for 2NO(g) + O₂(g) → 2NO₂(g), given N₂(g) + O₂(g) → 2NO(g) (+182.6 kJ) and N₂(g) + 2O₂(g) → 2NO₂(g) (+66.4 kJ).",
            answer:-116.2, tol:0.1, unit:"kJ", display:"−116.2 kJ",
            wrong:[{ match:249.0, fb:M3 + " Reverse the NO card." }, { match:116.2, fb:M1 }],
            why:"Reverse the NO equation and keep the NO₂ equation: −182.6 + 66.4 = −116.2 kJ.",
            hints:["NO is a reactant: reverse the NO card.", "−182.6, plus the NO₂ card as written (+66.4).", "−182.6 + 66.4 = −116.2 kJ."] },
          { id:"h6", goal:4, star:true, prompt:"Find " + DH + " for Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g) (the blast-furnace reaction, as at Hamilton’s steel mills), given the formation equations of Fe₂O₃ (−824.2 kJ), CO (−110.5 kJ) and CO₂ (−393.5 kJ).",
            answer:-24.8, tol:0.1, unit:"kJ", display:"−24.8 kJ",
            wrong:[{ match:-245.8, fb:"CO needs ×3 as well as reversing. " + M2 }, { match:-1673.2, fb:"Fe₂O₃ is a reactant: reverse its formation." }],
            why:"824.2 + 331.5 − 1180.5 = −24.8 kJ. <em>STSE:</em> Steam reforming and blast furnaces both release CO₂ from carbon. That’s one reason industries are researching hydrogen made with electricity, and steel made with less coal.",
            hints:["Fe₂O₃ and CO are reactants; Fe and CO₂ are products.", "Reverse Fe₂O₃ (+824.2); reverse CO ×3 (+331.5); CO₂ ×3 (−1180.5).", "824.2 + 331.5 − 1180.5 = −24.8 kJ."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Oren", goal:2,
        instruction:"Oren made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find " + DH + " for C(s) + ½O₂(g) → CO(g).",
            steps:["Keep C(s) + O₂(g) → CO₂(g), " + DH + " = −393.5 kJ.", "Reverse CO(g) + ½O₂(g) → CO₂(g): CO₂(g) → CO(g) + ½O₂(g), " + DH + " = −283.0 kJ.", "Add: C(s) + ½O₂(g) → CO(g).", DH + " = −393.5 + (−283.0) = −676.5 kJ."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "The equations do add up correctly; check the " + DH + ".", "Step 4 follows from step 2."],
            fixes:[
              { t:"Reversing flips the sign: +283.0 kJ, so " + DH + " = −110.5 kJ.", ok:true, why:M1 },
              { t:"Halve card 2 as well.", why:"The coefficients already match." },
              { t:DH + " = −393.5 − 283.0 = −110.5.", why:"That arithmetic is wrong too." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["What happens to " + DH + " when you reverse?", "The sign flips.", "−110.5 kJ."] },
          { id:"e2", goal:2, task:"Find " + DH + " for C(s) + 2H₂(g) → CH₄(g).",
            steps:["Keep C(s) + O₂(g) → CO₂(g), −393.5 kJ.", "Double the water equation: 2H₂(g) + O₂(g) → 2H₂O(l), " + DH + " = −285.8 kJ.", "Reverse the methane combustion: +890.5 kJ.", DH + " = −393.5 − 285.8 + 890.5 = +211.2 kJ."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct.", "Step 4 follows."],
            fixes:[
              { t:"Doubling the equation doubles " + DH + ": −571.6 kJ, so the total is −74.6 kJ.", ok:true, why:M2 },
              { t:"Halve the methane equation instead.", why:"Then CO₂ and H₂O won’t cancel." },
              { t:"Don’t double the water equation.", why:"Then 2H₂ isn’t on the left." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Did " + DH + " change when the equation doubled?", "It must.", "−74.6 kJ."] },
          { id:"e3", goal:5, task:"Find " + DH + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g). The combustion with liquid water is −890.5 kJ, and H₂O(l) → H₂O(g) is +44.0 kJ.",
            steps:["With liquid water, " + DH + " = −890.5 kJ.", "The target has H₂O(g), but water is water, so " + DH + " = −890.5 kJ.", "So making vapour releases as much energy as making liquid."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2."],
            fixes:[
              { t:"Add 2 × (H₂O(l) → H₂O(g), +44.0): −890.5 + 88.0 = −802.5 kJ.", ok:true, why:M4 },
              { t:"Subtract 88.0: −978.5 kJ.", why:"Turning liquid into gas absorbs energy, so " + DH + " gets <strong>less</strong> negative." },
              { t:"Add 44.0 once: −846.5 kJ.", why:"Two moles of water change state." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Do H₂O(l) and H₂O(g) have the same enthalpy?", "No; vaporizing absorbs 44.0 kJ/mol.", "−802.5 kJ."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the puzzles: that the route doesn’t matter, or that halving was needed?" },
      { id:"j2", q:"In your own words, why does reversing an equation flip the sign of " + DH + "?" },
      { id:"j3", q:"Explain to a friend how you decide which cards to reverse and which to scale." },
      { id:"j4", q:"Which step still slows you down: signs, multipliers or cancelling? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement is Hess’s law?", options:[
          { t:"The enthalpy change of a reaction depends only on the initial and final states, not on the route", ok:true, why:"That’s Hess’s law: " + DH + " depends only on the start and end." },
          { t:"The enthalpy change is larger when there are more steps.", why:M5 },
          { t:"Every reaction releases the same energy per mole.", why:DH + " values differ widely." },
          { t:"Energy is created when equations are added.", why:"Energy is conserved; " + DH + " values simply add." }] },
        b:{ prompt:"Why can the " + DH + " values of equations be added?", options:[
          { t:"Enthalpy depends only on the start and end, so the steps’ changes add up to the overall change", ok:true, why:"The steps start and end where the overall reaction does, so their changes add up to the same total." },
          { t:"Because every step is exothermic.", why:"Steps can be endothermic too." },
          { t:"Because the equations are measured at the same speed.", why:"Rate doesn’t matter." },
          { t:"Because " + DH + " is always negative.", why:"It can be positive." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"An equation has " + DH + " = −110.5 kJ. It is reversed and doubled. The new " + DH + " is…", options:[
          { t:"+221.0 kJ", ok:true, why:"Reverse: +110.5 kJ; double: +221.0 kJ." },
          { t:"−221.0 kJ", why:M1 },
          { t:"+110.5 kJ", why:M2 },
          { t:"−55.3 kJ", why:"Doubling multiplies by 2." }] },
        b:{ prompt:"An equation has " + DH + " = +182.6 kJ. It is reversed and halved. The new " + DH + " is…", options:[
          { t:"−91.3 kJ", ok:true, why:"Reverse: −182.6 kJ; halve: −91.3 kJ." },
          { t:"+91.3 kJ", why:M1 },
          { t:"−182.6 kJ", why:M2 },
          { t:"−365.2 kJ", why:"Halving divides by 2." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Directly, C(s) + O₂(g) → CO₂(g) has " + DH + " = −393.5 kJ. Going via CO (C + ½O₂ → CO, then CO + ½O₂ → CO₂), the two steps must total…", options:[
          { t:"−393.5 kJ", ok:true, why:"Same start, same end, same " + DH + ": −110.5 + (−283.0) = −393.5 kJ." },
          { t:"−504.0 kJ", why:"That adds −110.5 to −393.5." },
          { t:"−283.0 kJ", why:"That’s only the second step." },
          { t:"−110.5 kJ", why:"That’s only the first step." }] },
        b:{ prompt:"Directly, ½N₂(g) + O₂(g) → NO₂(g) has " + DH + " = +33.2 kJ. Via NO, the first step is ½N₂(g) + ½O₂(g) → NO(g), +91.3 kJ. The second step, NO(g) + ½O₂(g) → NO₂(g), must be…", options:[
          { t:"−58.1 kJ", ok:true, why:"33.2 − 91.3." },
          { t:"+58.1 kJ", why:M1 },
          { t:"+124.5 kJ", why:"The steps must add to +33.2." },
          { t:"−116.2 kJ", why:"That’s for 2 mol of NO." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Given C(s) + O₂(g) → CO₂(g), " + DH + " = −393.5 kJ, and C(s) + ½O₂(g) → CO(g), " + DH + " = −110.5 kJ, find " + DH + " for CO(g) + ½O₂(g) → CO₂(g).", options:[
          { t:"−283.0 kJ", ok:true, why:"−393.5 + 110.5." },
          { t:"−504.0 kJ", why:M3 },
          { t:"+283.0 kJ", why:M1 },
          { t:"−110.5 kJ", why:"That’s the CO equation itself." }] },
        b:{ prompt:"Given C(s) + O₂(g) → CO₂(g), −393.5 kJ, and CO(g) + ½O₂(g) → CO₂(g), −283.0 kJ, find " + DH + " for C(s) + ½O₂(g) → CO(g).", options:[
          { t:"−110.5 kJ", ok:true, why:"−393.5 + 283.0." },
          { t:"−676.5 kJ", why:M3 },
          { t:"+110.5 kJ", why:M1 },
          { t:"−283.0 kJ", why:"That’s the given CO equation." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Using Ca(s) + ½O₂(g) → CaO(s) (−634.9), C(s) + O₂(g) → CO₂(g) (−393.5) and Ca(s) + C(s) + 1½O₂(g) → CaCO₃(s) (−1207.6), find " + DH + " for CaCO₃(s) → CaO(s) + CO₂(g).", options:[
          { t:"+179.2 kJ", ok:true, why:"Reverse the CaCO₃ equation and add the other two: 1207.6 − 634.9 − 393.5." },
          { t:"−179.2 kJ", why:M1 },
          { t:"−2236.0 kJ", why:M3 },
          { t:"+1207.6 kJ", why:"The CaO and CO₂ equations are needed too." }] },
        b:{ prompt:"Using C(s) + ½O₂(g) → CO(g) (−110.5), H₂(g) + ½O₂(g) → H₂O(g) (−241.8) and C(s) + 2H₂(g) → CH₄(g) (−74.6), find " + DH + " for CH₄(g) + H₂O(g) → CO(g) + 3H₂(g).", options:[
          { t:"+205.9 kJ", ok:true, why:"74.6 + 241.8 − 110.5." },
          { t:"−205.9 kJ", why:M1 },
          { t:"−277.7 kJ", why:"Reverse the water equation too." },
          { t:"−426.9 kJ", why:M3 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"CH₄ burning to CO₂ and liquid water has " + DH + " = −890.5 kJ. With H₂O(l) → H₂O(g), " + DH + " = +44.0 kJ, find " + DH + " when the product is water vapour.", options:[
          { t:"−802.5 kJ", ok:true, why:"−890.5 + 2(44.0)." },
          { t:"−978.5 kJ", why:"Vaporizing absorbs energy." },
          { t:"−846.5 kJ", why:"Two moles of water." },
          { t:"−890.5 kJ", why:M4 }] },
        b:{ prompt:"C₂H₅OH(l) burning to CO₂ and liquid water has " + DH + " = −1366.8 kJ. Find " + DH + " when the product is water vapour (H₂O(l) → H₂O(g), +44.0 kJ).", options:[
          { t:"−1234.8 kJ", ok:true, why:"−1366.8 + 3(44.0)." },
          { t:"−1498.8 kJ", why:"Vaporizing absorbs energy." },
          { t:"−1322.8 kJ", why:"Three moles of water." },
          { t:"−1366.8 kJ", why:M4 }] } },
      { id:"c1", cat:"C", goal:[1, 3],
        a:{ prompt:"Which is the best explanation of why the direct and two-step routes from C to CO₂ have the same " + DH + "?", options:[
          { t:"“Enthalpy depends only on the starting and ending substances. Like the height between two floors, it’s the same whichever stairs you take.”", ok:true, why:"Both routes start at C(s) + O₂(g) and end at CO₂(g), so they have the same " + DH + "." },
          { t:"“The two-step route is faster, so it balances out.”", why:"Speed doesn’t affect " + DH + "." },
          { t:"“Each step releases the same amount.”", why:"−110.5 and −283.0 differ." },
          { t:"“Carbon always releases −393.5 kJ whatever it makes.”", why:"Making only CO releases −110.5." }] },
        b:{ prompt:"Which is the best explanation of why reversing an equation changes the sign of " + DH + "?", options:[
          { t:"“The reverse reaction goes from the products’ enthalpy back to the reactants’, so the change has the same size but the opposite direction.”", ok:true, why:"Same two levels, opposite direction: same size, opposite sign." },
          { t:"“Reversed reactions always absorb energy.”", why:"Only if the forward one released it." },
          { t:"“The sign changes because the coefficients change.”", why:"Coefficients don’t change when you reverse." },
          { t:"“Reversing makes the reaction twice as large.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which correctly shows CO(g) + ½O₂(g) → CO₂(g), " + DH + " = −283.0 kJ, reversed and doubled?", options:[
          { t:"2CO₂(g) → 2CO(g) + O₂(g), " + DH + " = +566.0 kJ", ok:true, why:"Reversed (sign flips) and doubled (coefficients and " + DH + " both ×2)." },
          { t:"2CO₂(g) → 2CO(g) + O₂(g), " + DH + " = −566.0 kJ", why:M1 },
          { t:"CO₂(g) → CO(g) + ½O₂(g), " + DH + " = +566.0 kJ", why:"The equation wasn’t doubled. " + M2 },
          { t:"2CO₂(g) → 2CO(g) + O₂(g), " + DH + " = +283.0 kJ", why:DH + " wasn’t doubled. " + M2 }] },
        b:{ prompt:"Which correctly shows N₂(g) + O₂(g) → 2NO(g), " + DH + " = +182.6 kJ, halved?", options:[
          { t:"½N₂(g) + ½O₂(g) → NO(g), " + DH + " = +91.3 kJ", ok:true, why:"Halved: coefficients and " + DH + " both ÷ 2." },
          { t:"½N₂(g) + ½O₂(g) → NO(g), " + DH + " = +182.6 kJ", why:M2 },
          { t:"½N₂(g) + ½O₂(g) → NO(g), " + DH + " = −91.3 kJ", why:"Halving doesn’t change the sign." },
          { t:"N₂(g) + O₂(g) → NO(g), " + DH + " = +91.3 kJ", why:"That equation isn’t balanced." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Blast furnaces reduce iron ore: Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g). Using the formation equations of Fe₂O₃ (−824.2), CO (−110.5) and CO₂ (−393.5), find " + DH + ".", options:[
          { t:"−24.8 kJ", ok:true, why:"824.2 + 3(110.5) + 3(−393.5)." },
          { t:"−245.8 kJ", why:"CO needs ×3. " + M2 },
          { t:"+541.2 kJ", why:"Both CO and CO₂ need ×3. " + M2 },
          { t:"−1673.2 kJ", why:"Fe₂O₃ is a reactant: reverse its formation. " + M1 }] },
        b:{ prompt:"Methanol is made from CO(g) + 2H₂(g) → CH₃OH(l). Using C(s) + ½O₂(g) → CO(g) (−110.5) and C(s) + 2H₂(g) + ½O₂(g) → CH₃OH(l) (−239.2), find " + DH + ".", options:[
          { t:"−128.7 kJ", ok:true, why:"+110.5 − 239.2." },
          { t:"−349.7 kJ", why:M3 },
          { t:"+128.7 kJ", why:"Reverse the CO equation, not the methanol one." },
          { t:"−239.2 kJ", why:"That’s the formation of methanol from elements." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A student measured " + DH + "<sub>1</sub> = −460 kJ/mol for Mg + 2HCl and " + DH + "<sub>2</sub> = −150 kJ/mol for MgO + 2HCl. With H₂ + ½O₂ → H₂O(l) at −285.8 kJ/mol, what is " + DH + " for Mg(s) + ½O₂(g) → MgO(s)?", options:[
          { t:"−595.8 kJ/mol", ok:true, why:"−460 + 150 − 285.8." },
          { t:"−895.8 kJ/mol", why:M3 + " Reverse the MgO equation." },
          { t:"−324.2 kJ/mol", why:"Reverse the MgO equation, not the water equation." },
          { t:"−24.2 kJ/mol", why:"Keep the water equation forward." }] },
        b:{ prompt:"Another student measured " + DH + "<sub>1</sub> = −470 kJ/mol and " + DH + "<sub>2</sub> = −155 kJ/mol. With the water equation at −285.8 kJ/mol, what is " + DH + " for Mg(s) + ½O₂(g) → MgO(s)?", options:[
          { t:"−600.8 kJ/mol", ok:true, why:"−470 + 155 − 285.8." },
          { t:"−910.8 kJ/mol", why:M3 },
          { t:"−339.2 kJ/mol", why:"Reverse the MgO equation, not the water equation." },
          { t:"−29.2 kJ/mol", why:"Keep the water equation forward." }] } }
    ]
  },
  task:{
    title:"Three roads to lime", summary:"Three roads to lime",
    statement:"<p>Lime kilns turn limestone into lime: <strong>CaCO₃(s) → CaO(s) + CO₂(g)</strong>. Combine cards to reach this target and type its " + DH + ". There’s more than one route. Can you find them all?</p><p class=\"tiny muted\">Set each card to <strong>off</strong>, <strong>forward</strong> or <strong>reversed</strong>. Card H’s " + DH + " is computed from the course table.</p>",
    tray:[
      { id:"A", eq:"Ca(s) + 1/2 O2(g) -> CaO(s)" },
      { id:"B", eq:"C(s) + O2(g) -> CO2(g)" },
      { id:"C", eq:"Ca(s) + C(s) + 3/2 O2(g) -> CaCO3(s)" },
      { id:"D", eq:"C(s) + 1/2 O2(g) -> CO(g)" },
      { id:"E", eq:"CO(g) + 1/2 O2(g) -> CO2(g)" },
      { id:"H", eq:"CaCO3(s) -> CaO(s) + CO(g) + 1/2 O2(g)", note:"computed from the course table" }
    ],
    target:"CaCO3(s) -> CaO(s) + CO2(g)",
    checks:["Reactant side is CaCO₃(s) only", "Product side is CaO(s) + CO₂(g) only", "You typed the right " + DH + " for your cards"],
    tips:["CaCO₃ must end on the left. Which cards contain it, and which way round?", "CaO and CO₂ must end on the right. Is anything else left over?", "Add each card’s " + DH + ", with signs flipped for reversed cards."],
    explainPrompt:"Explain why two different routes give exactly the same " + DH + ".",
    vocab:"Use the words Hess’s law, reverse, cancel and enthalpy change.",
    more:"There’s more than one route. Can you find them all?",
    after3:"Four routes, one " + DH + ". That’s Hess’s law.",
    afterAt:4
  },
  cards:[
    ["Hess’s law", DH + " depends only on the starting and ending substances, not the route"],
    ["Reverse an equation", "Flip the sign of " + DH],
    ["Multiply an equation by <i>k</i>", "Multiply " + DH + " by <i>k</i>"],
    ["Cancelling", "Only identical species in the same state cancel"],
    ["H₂O(l) → H₂O(g)", DH + " = +44.0 kJ/mol (from the course table: −241.8 − (−285.8))"],
    ["Strategy", "Place each target substance on the correct side first, then scale to match its coefficient"],
    ["Check the sum", "Nothing may be left over that isn’t in the target"],
    ["Enthalpy-level diagram", "Arrows between levels; any path between the same two levels has the same total"],
    ["Why use Hess’s law?", "To find " + DH + " for reactions that are hard to measure directly (e.g. C → CO, Mg → MgO)"],
    [DH + " from a calorimeter", DH + " = −<i>q</i> ÷ <i>n</i>, with <i>q</i> = <i>mc</i>Δ<i>T</i> converted to kJ"],
    ["Percent error", "|accepted − measured| ÷ |accepted| × 100%"],
    ["Heat loss", "Makes a measured exothermic " + DH + " less negative than the true value"]
  ]
};

