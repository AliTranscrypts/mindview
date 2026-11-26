// SCH4U 24 Energy Changes and Enthalpy. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/24-energy-changes-and-enthalpy.md
// Pictures (hero pouches and diagrams, the C4 enthalpy diagram builder, the energy-scales ruler, the Bonds staircase, the
// Part 3 tile converter, the task gauges) are drawn by app.js. Every ΔH the app computes comes from MV.chem.data
// (ΔH°f table, misc table); U-235 fission (≈ 2 × 10¹⁰ kJ/mol) is a local course table addition in app.js.

const DH = "Δ<i>H</i>";

// Misconception core sentences (plan §3)
const M1 = "The system absorbs energy <em>from</em> the surroundings, so the surroundings (your hand) feel colder.";
const M2 = "Energy <em>leaving</em> the system makes " + DH + " negative.";
const M2in = "Energy <em>entering</em> the system makes " + DH + " positive.";
const M3 = "Exothermic: heat is a <em>product</em> (right side). Endothermic: heat is a <em>reactant</em> (left side).";
const M4 = DH + " belongs to the equation as written: reverse it and change the sign; double it and double " + DH + ".";
const M5 = DH + " is per mole of reaction as written. Convert grams to moles first.";
const M6 = "Breaking bonds always <em>absorbs</em> energy; forming bonds releases it.";
const M7 = "Burning methane releases about 150 times as much as melting the same number of moles of ice. Fission releases about 10 million times more again.";

// Practice 1: tap-to-sort (plan Activity 1)
const SORT_H = ["Do the surroundings warm or cool?", "Phase changes toward a more ordered state release energy."];
const SORT = [
  ["Water freezing", "exo", "Freezing releases energy as the particles settle into the solid.",
    "Freezing <em>releases</em> energy as the particles settle into the solid; that’s why orchards are sprayed with water before a frost."],
  ["Steam condensing", "exo", "Condensing releases energy as the particles come together: that’s why a steam burn is so bad.",
    "Condensing <em>releases</em> energy as the particles come together. Steam burns because it condenses on your skin."],
  ["Propane burning", "exo", "Combustion releases energy: " + DH + " = −2219.9 kJ.",
    "A barbecue warms its surroundings: energy leaves the system."],
  ["Photosynthesis", "endo", "Plants absorb light energy and store it in glucose.",
    "Photosynthesis stores energy from sunlight in glucose: energy enters the system."],
  ["A cold pack activating", "endo", "Dissolving absorbs energy from your hand, so the pack feels cold.", M1],
  ["A hand warmer activating", "exo", "Iron oxidizing releases energy into your hand.",
    "The pack warms your hand: energy leaves the system."],
  ["Ice melting", "endo", "Melting absorbs 6.01 kJ/mol from the surroundings.",
    "Melting takes energy from the surroundings: that’s why ice cools a drink."],
  ["Sweat evaporating from skin", "endo", "Evaporating sweat takes heat from your skin.",
    "Evaporating sweat takes heat from your skin. " + M1],
  ["Limestone decomposing in a kiln", "endo", "The kiln must keep heating it: " + DH + " = +179.2 kJ.",
    "A kiln supplies heat the whole time: the reaction absorbs energy."],
  ["An acid neutralizing a base", "exo", "Neutralization warms the solution.",
    "The solution warms up: energy leaves the system."]
];
const BOXN = { exo:"Exothermic", endo:"Endothermic" };

export default {
  id:"24-energy-changes-and-enthalpy",
  kind:"topic",
  title:"Energy changes and enthalpy",
  topic:"Energy Changes and Enthalpy",
  readyTopic:"energy changes and enthalpy",
  hero:{
    headline:"Energy out, minus sign",
    text:"In every chemical change, energy moves between the <strong>system</strong> (the chemicals) and the <strong>surroundings</strong>. If energy flows out, the change is <strong>exothermic</strong> and " + DH + " is negative; if it flows in, it’s <strong>endothermic</strong> and " + DH + " is positive. A <strong>thermochemical equation</strong> records exactly how much, for exactly the amounts written.",
    fig:{ html:'<div class="eh-hx"><svg class="eh-hx-svg" id="eh-hx-svg" viewBox="0 0 480 340" role="img" aria-label="Left: a hand warmer pouch is squeezed; orange heat arrows flow out of it into a hand and the thermometer beside it rises. Below it, an enthalpy diagram steps down from 4Fe + 3O₂ to 2Fe₂O₃ with an orange downward arrow, ΔH = −1648.4 kJ. Right: a cold pack is squeezed; orange heat arrows flow from the hand into the pack and its thermometer drops. Below it, an enthalpy diagram steps up from NH₄NO₃(s) to NH₄⁺(aq) + NO₃⁻(aq) with an upward arrow, ΔH = +25.7 kJ."></svg><div class="eh-hx-row"><p class="eh-hx-ctr" id="eh-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="eh-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can use system and surroundings to decide whether a change is exothermic or endothermic and give the sign of " + DH + ".",
    "I can draw and read enthalpy diagrams.",
    "I can write a thermochemical equation both ways: with " + DH + ", and with a heat term.",
    "I can scale and reverse thermochemical equations and calculate the energy for a given amount (moles or mass).",
    "I can compare the energy scales of physical, chemical and nuclear changes.",
    "I can choose reactions for an energy purpose (heating, cooling) using " + DH + "."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Moles and molar mass", goal:4,
          prompt:"How many moles are in 32.0 g of methane, CH₄? (Use <i>M</i> = 16.0 g/mol.)",
          options:[
            { t:"2.00 mol", ok:true, why:"32.0 ÷ 16.0." },
            { t:"0.500 mol", why:"That’s 16.0 ÷ 32.0, upside down." },
            { t:"512 mol", why:"Multiplied instead of dividing." },
            { t:"32.0 mol", why:"Grams aren’t moles." }],
          hints:["<i>n</i> = <i>m</i> ÷ <i>M</i>.", "32.0 ÷ 16.0.", "2.00 mol."] },
        { id:"w2", skill:"Moles and molar mass", goal:4,
          prompt:"What is the molar mass of propane, C₃H₈? (Use C 12.0, H 1.0.)",
          options:[
            { t:"44.0 g/mol", ok:true, why:"3(12.0) + 8(1.0)." },
            { t:"20.0 g/mol", why:"Counted one C and eight H: 12 + 8." },
            { t:"13.0 g/mol", why:"Added one C and one H." },
            { t:"96.0 g/mol", why:"Multiplied 12 by 8." }],
          hints:["Count the atoms.", "3 C and 8 H.", "36 + 8 = 44."] },
        { id:"w3", skill:"Balancing equations", goal:3,
          prompt:"Balance: C₃H₈ + __O₂ → 3CO₂ + 4H₂O.",
          options:[
            { t:"5", ok:true, why:"Right side: 6 + 4 = 10 O atoms, so 5 O₂." },
            { t:"10", why:"10 is the number of O atoms; O₂ has two each." },
            { t:"7", why:"Count again: 3 × 2 + 4 × 1 = 10." },
            { t:"3", why:"That balances only the CO₂ oxygen." }],
          hints:["Count O on the right.", "6 + 4 = 10.", "5 O₂."] },
        { id:"w4", skill:"Balancing equations", goal:4,
          prompt:"In 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from 1 mol of O₂?",
          options:[
            { t:"2 mol", ok:true, why:"Mole ratio 1 : 2." },
            { t:"1 mol", why:"Read the coefficients." },
            { t:"4 mol", why:"Doubled twice." },
            { t:"0.5 mol", why:"Inverted the ratio." }],
          hints:["Use the coefficients.", "O₂ : H₂O = 1 : 2.", "2 mol."] },
        { id:"w5", skill:"Heat flow", goal:1,
          prompt:"You dissolve a salt in water and the beaker feels cold. Which way did heat flow?",
          options:[
            { t:"From the water and your hand into the dissolving salt", ok:true, why:"The system absorbed energy, so it’s endothermic." },
            { t:"From the salt into the water", why:"Then the beaker would feel warm. " + M1 },
            { t:"No heat flowed; cold was released", why:"‘Cold’ isn’t a substance; heat flows in." },
            { t:"From the beaker to the air", why:"The beaker is cold because heat left it <em>into the system</em>." }],
          hints:["Heat flows from warm to cool.", "Your hand lost heat.", "Into the system."] },
        { id:"w6", skill:"Heat flow", goal:1,
          prompt:"A burning candle warms the room. The burning is…",
          options:[
            { t:"exothermic", ok:true, why:"Energy leaves the system." },
            { t:"endothermic", why:"The room gains energy. " + M2 },
            { t:"neither, because it’s a physical change", why:"Combustion is chemical." },
            { t:"endothermic, because it needs a match", why:"The match supplies activation energy; overall, energy is released." }],
          hints:["Did the surroundings warm or cool?", "Warmed.", "Exothermic."] }
      ],
      refreshers:{
        "Moles and molar mass":"<i>n</i> = <i>m</i> ÷ <i>M</i>. Add up atomic masses for <i>M</i>.",
        "Balancing equations":"Balance C, then H, then O. Coefficients give mole ratios.",
        "Heat flow":"Heat flows from hot to cold. If the surroundings cool, the system took in energy (endothermic)."
      }
    }
  },
  explore:{
    heading:"Enthalpy diagram builder",
    intro:"Choose a reaction, build its enthalpy diagram, scale it, reverse it, and see the energy the surroundings gain or lose.",
    how:"Choose a mode. In <strong>Diagram</strong>, pick a reaction card, then set the amount and the direction. <strong>Build it</strong> hides " + DH + " until you place the products’ level (drag it, or use the arrow keys). <strong>Linked panels</strong> pairs burning methane with limestone.",
    bondsNote:"Qualitative: bar lengths follow the bond energies in the course table, but the numbers wait for the bond-energy module.",
    scalesNote:"Each step on the ruler is ten times the one before. Tap a marker, then tap the ruler (or use the slider) to place it; then reveal the real values.",
    predictions:[
      { id:"p1", prompt:"The Methane card in <strong>Build it</strong>. Should the products’ level be above or below the reactants’?",
        options:[{ t:"Below: energy leaves, so " + DH + " is negative", ok:true }, { t:"Above: energy is released, so " + DH + " is positive" }, { t:"At the same level" }, { t:"Above, because flames are hot" }],
        explain:"The products have less enthalpy; the difference went to the surroundings. " + M2 },
      { id:"p2", prompt:"The Limestone card, forward. Now flip the direction toggle. What is " + DH + " for CaO + CO₂ → CaCO₃?",
        options:[{ t:"−179.2 kJ", ok:true }, { t:"+179.2 kJ" }, { t:"0 kJ" }, { t:"+358.4 kJ" }],
        explain:"Reversing a reaction reverses the energy flow. " + M4 },
      { id:"p3", prompt:"The Methane card, multiplier 2. What is " + DH + " for burning 2 mol of CH₄?",
        options:[{ t:"−1781.0 kJ", ok:true }, { t:"−890.5 kJ" }, { t:"−445.3 kJ" }, { t:"+1781.0 kJ" }],
        explain:"Twice the reaction, twice the energy. " + M4 },
      { id:"p4", prompt:"<strong>Energy scales</strong> mode. About how many times more energy does burning 1 mol of methane release than melting 1 mol of ice absorbs?",
        options:[{ t:"About 150", ok:true }, { t:"About 1.5" }, { t:"About 15 000" }, { t:"About the same" }],
        explain:"The markers sit about two steps (powers of ten) apart: 890.5 ÷ 6.01 ≈ 148. Chemical changes involve far more energy than phase changes, and nuclear changes far more again." }
    ],
    chalIntro:"Use the builder to meet each goal, then press <strong>Check challenge</strong>. Challenges 1 and 2 use one reaction in Diagram mode; challenge 3 uses <strong>Linked panels</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[4, 6], prompt:"Set a card, direction and amount so the system <strong>releases</strong> exactly 824.2 kJ.",
        why:"Hand warmer, forward, × 0.5: ½ × (−1648.4 kJ) = −824.2 kJ.",
        general:"Not yet. The system must release exactly 824.2 kJ.",
        hints:["Which card’s " + DH + " is double 824.2?", "1648.4 kJ: the hand warmer.", "Hand warmer, forward, × 0.5."] },
      { id:"tc2", goal:[4, 6], prompt:"Make a process that <em>absorbs</em> exactly 358.4 kJ.",
        why:"Limestone, forward, × 2: 2 × (+179.2 kJ) = +358.4 kJ.",
        general:"Not yet. The process must absorb exactly 358.4 kJ.",
        hints:["Absorbing means " + DH + " &gt; 0.", "358.4 ÷ 2 = 179.2.", "Limestone × 2."] },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"Two linked panels: on the left, Methane × 1 (forward); on the right, Limestone with an adjustable multiplier. Set the limestone amount to absorb as much energy as possible without needing more than the heat that 1 mol of methane releases.",
        why:"4.5 × 179.2 = 806.4 kJ, which is ≤ 890.5 kJ; 5.0 would need 896.0 kJ.",
        general:"Not yet. Find the largest limestone amount whose heat need still fits in 890.5 kJ.",
        hints:["How many 179.2s fit into 890.5?", "5 × 179.2 = 896.0, too much.", "4.5."] }
    ]
  },
  part3:{
    slug:"thermochemical", name:"Two ways", heading:"Write it two ways",
    intro:"A thermochemical equation can carry its energy change two ways: as a " + DH + " value beside the equation, or as a heat term inside it. Place the heat tiles, transform an equation, then check the values against the course data table.",
    s1:{ title:"Station 1: Place the heat",
      intro:"Each equation’s species are tiles. Tap the heat tile, then tap the end of the equation where it belongs. Then fill in the " + DH + " box with a sign and a value.",
      items:[{ id:"ch4", answer:"R" }, { id:"caco3", answer:"L" }, { id:"cold", answer:"L" }] },
    s2:{ title:"Station 2: Transform it",
      intro:"Start from the equation below. Choose a transformation and write the new " + DH + ".",
      gasNote:"States matter: 2 × 44.0 kJ is needed to vaporize the water, so less energy is released." },
    s3:{ title:"Station 3: Check it with data",
      intro:"Every " + DH + " above can be confirmed from the course table of enthalpies of formation: add up the products’ values, subtract the reactants’. (You’ll do this properly in the formation-enthalpy module.)" },
    quickCheck:{
      title:"Quick check", summary:"Write it two ways quick check",
      items:[
        { id:"q1", goal:3, prompt:"Rewrite with a heat term: N₂ + O₂ → 2NO, " + DH + " = +182.6 kJ",
          choices:[
            { t:"182.6 kJ on the left", ok:true, fb:"Right. Endothermic: heat is a reactant." },
            { t:"182.6 kJ on the right", fb:"Endothermic: heat is a reactant. " + M3 },
            { t:"no heat term", fb:"Endothermic: heat is a reactant." },
            { t:"−182.6 kJ on the left", fb:"Endothermic: heat is a reactant. Heat terms are written as positive amounts." }] },
        { id:"q2", goal:4, prompt:DH + " for ½N₂ + ½O₂ → NO?",
          choices:[
            { t:"+91.3 kJ", ok:true, fb:"Right. Half the equation, half of " + DH + "." },
            { t:"+182.6 kJ", fb:"Half the equation, half of " + DH + ". " + M4 },
            { t:"−91.3 kJ", fb:"Half the equation, half of " + DH + ", and it isn’t reversed, so the sign stays." },
            { t:"+365.2 kJ", fb:"Half the equation, half of " + DH + "." }] },
        { id:"q3", goal:3, prompt:"Which shows an exothermic heat term?",
          choices:[
            { t:"A + B → C + 50 kJ", ok:true, fb:"Right. Heat is released as a product." },
            { t:"A + B + 50 kJ → C", fb:"Heat is released as a product." },
            { t:"A + B → C − 50 kJ", fb:"Heat is released as a product, written as a positive amount." },
            { t:"50 kJ → A + B + C", fb:"Heat is released as a product." }] },
        { id:"q4", goal:3, prompt:"Why does H₂O(l) vs H₂O(g) change " + DH + "?",
          choices:[
            { t:"Vaporizing absorbs 44.0 kJ/mol", ok:true, fb:"Right. Forming liquid water releases more energy than forming vapour." },
            { t:"Gas is heavier", fb:"Forming liquid water releases more energy than forming vapour." },
            { t:"Liquids have no enthalpy", fb:"Forming liquid water releases more energy than forming vapour." },
            { t:"It doesn’t", fb:"Forming liquid water releases more energy than forming vapour." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Exothermic or endothermic?", summary:"Exothermic or endothermic?", goal:[1, 5], noun:"change", txt:true,
        instruction:"Sort each change by the direction its energy flows.",
        boxes:[{ id:"exo", label:"Exothermic", sub:DH + " &lt; 0" }, { id:"endo", label:"Endothermic", sub:DH + " &gt; 0" }],
        items:SORT.map((s, i) => ({ id:"s" + (i + 1), t:s[0], answer:s[1], why:s[2], wrong:{ [s[1] === "exo" ? "endo" : "exo"]:s[3] },
          hints:[SORT_H[0], SORT_H[1], BOXN[s[1]] + ". " + s[2]] })),
        wrongDefault:"Ask whether the surroundings warm or cool." },
      { id:"calc", type:"custom", title:"Energy calculations", summary:"Energy calculations", goal:[3, 4, 5],
        instruction:"First, one investigation question from the sort. Then six calculations: items 3 to 6 are non-routine (★), and 5 and 6 go beyond the Final Check.",
        how:"Type your answer, then press Check. Give " + DH + " with its sign; an amount of energy released is a positive number.",
        use:"Methane: CH₄ + 2O₂ → CO₂ + 2H₂O, " + DH + " = −890.5 kJ. Propane: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O, " + DH + " = −2219.9 kJ. Limestone: CaCO₃ → CaO + CO₂, " + DH + " = +179.2 kJ.",
        inv:{ id:"inv", kind:"chips", goal:1, prompt:"<strong>Investigation:</strong> You touch the outside of a beaker while a cold pack’s salt dissolves (sort item 5), and it feels cold. Name the system and the surroundings.",
          options:[
            { t:"System: the dissolving salt. Surroundings: the water, the beaker and your hand", ok:true, why:"The salt dissolving is the change; everything that lost heat to it is the surroundings." },
            { t:"System: the water. Surroundings: the salt, the beaker and your hand", why:"The water is part of the surroundings: it lost heat. " + M1 },
            { t:"System: your hand. Surroundings: the beaker and the water", why:"Your hand is part of the surroundings: it lost heat to the dissolving salt." },
            { t:"System: the beaker. Surroundings: the air", why:"The beaker only holds the change; the system is the chemicals that change." }],
          hints:["The system is the chemicals that change.", "What is changing here? The salt dissolves.", "System: the dissolving salt. Surroundings: the water, the beaker and your hand."] },
        items:[
          { id:"c1", kind:"num", goal:4, prompt:DH + " for 3CH₄ + 6O₂ → 3CO₂ + 6H₂O?", answer:-2671.5, tol:0.05, unit:"kJ", display:"−2671.5 kJ", signed:true,
            wrong:[{ match:-890.5, fb:"Multiply by 3. " + M4 }, { match:2671.5, fb:"Check the sign: burning releases energy, so " + DH + " is negative." }],
            fb:"Every coefficient is 3 times the methane equation’s, so " + DH + " is 3 times as big.",
            why:"3 × (−890.5 kJ) = −2671.5 kJ.",
            hints:["Compare the coefficients with the methane equation.", "Everything is tripled.", "3 × (−890.5) = −2671.5 kJ."] },
          { id:"c2", kind:"num", goal:4, prompt:DH + " for 2CaO + 2CO₂ → 2CaCO₃?", answer:-358.4, tol:0.05, unit:"kJ", display:"−358.4 kJ", signed:true,
            wrong:[{ match:358.4, fb:"Reversed, so the sign changes. " + M4 }, { match:-179.2, fb:"The coefficients are doubled too: double " + DH + "." }, { match:179.2, fb:"Reversed <em>and</em> doubled." }],
            fb:"This is the limestone equation reversed and doubled.",
            why:"Reverse: −179.2 kJ; double: −358.4 kJ.",
            hints:["Is it the limestone equation forward or reversed?", "Reversed, and the coefficients are 2.", "2 × (−179.2) = −358.4 kJ."] },
          { id:"c3", kind:"num", goal:4, star:true, prompt:"Energy released when 8.0 g of CH₄ burns (<i>M</i> = 16.0 g/mol)?", answer:445.25, tol:0.8, unit:"kJ", display:"445 kJ",
            wrong:[{ match:7124, fb:"You multiplied by the mass. " + M5 }, { match:890.5, fb:"That’s for 1 mol: 8.0 g is only 0.50 mol." }],
            fb:M5,
            why:"8.0 ÷ 16.0 = 0.50 mol; 0.50 × 890.5 = 445 kJ released.",
            hints:["Moles first.", "8.0 ÷ 16.0 = 0.50 mol.", "0.50 × 890.5 = 445 kJ released."] },
          { id:"c4", kind:"num", goal:4, star:true, prompt:"Energy released when 11.0 g of C₃H₈ burns (<i>M</i> = 44.0 g/mol)?", answer:554.98, tol:0.8, unit:"kJ", display:"555 kJ",
            wrong:[{ match:2219.9, fb:"11.0 g is only 0.250 mol." }, { match:24418.9, fb:"You multiplied by the mass. " + M5 }],
            fb:M5,
            why:"11.0 ÷ 44.0 = 0.250 mol; 0.250 × 2219.9 = 555 kJ released.",
            hints:["Moles first.", "11.0 ÷ 44.0 = 0.250 mol.", "0.250 × 2219.9 = 555 kJ released."] },
          { id:"c5", kind:"num", goal:4, star:true, prompt:"A furnace must deliver 4452.5 kJ. How many moles of CH₄ must burn?", answer:5, tol:0.01, unit:"mol", display:"5.00 mol",
            wrong:[{ match:0.2, fb:"Divide the energy by 890.5 kJ/mol." }],
            fb:"Divide the energy needed by the energy per mole.",
            why:"4452.5 ÷ 890.5 = 5.00 mol.",
            hints:["Each mole of CH₄ gives 890.5 kJ.", "How many 890.5s make 4452.5?", "4452.5 ÷ 890.5 = 5.00 mol."] },
          { id:"c6", kind:"chips", goal:5, star:true, prompt:"<strong>STSE:</strong> Per kJ of heat delivered, which fuel releases less CO₂: methane (1 CO₂ per 890.5 kJ) or propane (3 CO₂ per 2219.9 kJ, i.e. 1 per 740.0 kJ)?",
            options:[
              { t:"Methane", ok:true, why:"Methane makes 1 CO₂ per 890.5 kJ, propane 1 per 740 kJ: methane gives more heat per CO₂." },
              { t:"Propane", why:"Propane makes 1 CO₂ per 740 kJ, methane 1 per 890.5 kJ: methane gives more heat per CO₂." }],
            hints:["Compare the heat delivered per CO₂.", "Methane: 890.5 kJ per CO₂. Propane: 740.0 kJ per CO₂.", "Methane: more heat for each CO₂."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Milan", goal:[1, 4],
        instruction:"Milan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"A reaction in a beaker makes the water warmer. Describe " + DH + ".",
            steps:["The reaction is the system; the water is the surroundings.", "The water warmed, so energy flowed from the system to the surroundings.", "Energy was released, so " + DH + " is positive.", "So the reaction is endothermic."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Energy left the system, so its enthalpy fell: " + DH + " is negative (exothermic).", ok:true, why:M2 },
              { t:DH + " is zero.", why:"Energy moved." },
              { t:"The water is the system.", why:"The reaction is the system." },
              { t:"Step 3 is correct.", why:"Release means " + DH + " &lt; 0. " + M2 }],
            hints:["Did the system gain or lose enthalpy?", "Lose.", "Energy left the system, so its enthalpy fell: " + DH + " is negative (exothermic)."] },
          { id:"e2", goal:4, task:"Given 4Fe + 3O₂ → 2Fe₂O₃, " + DH + " = −1648.4 kJ, find " + DH + " for Fe₂O₃ → 2Fe + 3/2 O₂.",
            steps:["The target is the reverse of the given reaction.", "It’s also half of the reversed reaction.", "Halving gives −824.2 kJ.", "Reversing doesn’t change the size, so " + DH + " = −824.2 kJ."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct so far.", ""],
            fixes:[
              { t:"Reversing flips the sign: " + DH + " = +824.2 kJ.", ok:true, why:M4 },
              { t:"+1648.4 kJ.", why:"Halve it too." },
              { t:"−1648.4 kJ.", why:"Both steps were skipped." },
              { t:"Step 4 is correct.", why:"The size is unchanged, but the sign flips. " + M4 }],
            hints:["What happens to the sign on reversal?", "It changes.", "Reversing flips the sign: " + DH + " = +824.2 kJ."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how small phase-change energies are compared with combustion, or how big nuclear energies are?" },
      { id:"j2", q:"In your own words, explain why an endothermic reaction makes a beaker feel cold." },
      { id:"j3", q:"Explain to a friend how to change " + DH + " when you reverse or scale an equation." },
      { id:"j4", q:"Which part of thermochemical equations do you still get wrong? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A reaction releases heat to its surroundings. Its " + DH + " is…", options:[
          { t:"negative (exothermic)", ok:true, why:"Energy leaves the system, so " + DH + " &lt; 0." },
          { t:"positive (exothermic)", why:"Release means a negative " + DH + ". " + M2 },
          { t:"positive (endothermic)", why:"Endothermic absorbs heat." },
          { t:"zero", why:"Energy moved." }] },
        b:{ prompt:"During a reaction, the surroundings get colder. The reaction is…", options:[
          { t:"endothermic, with " + DH + " &gt; 0", ok:true, why:"The system absorbed energy from the surroundings, so " + DH + " is positive." },
          { t:"exothermic, with " + DH + " &lt; 0", why:M1 },
          { t:"endothermic, with " + DH + " &lt; 0", why:M2in },
          { t:"exothermic, with " + DH + " &gt; 0", why:M1 + " " + M2in }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which correctly writes CH₄ + 2O₂ → CO₂ + 2H₂O, " + DH + " = −890.5 kJ, with a heat term?", options:[
          { t:"CH₄ + 2O₂ → CO₂ + 2H₂O + 890.5 kJ", ok:true, why:"Exothermic: heat is a product." },
          { t:"CH₄ + 2O₂ + 890.5 kJ → CO₂ + 2H₂O", why:M3 },
          { t:"CH₄ + 2O₂ → CO₂ + 2H₂O − 890.5 kJ", why:"Heat terms are written as positive amounts." },
          { t:"890.5 kJ + CO₂ + 2H₂O → CH₄ + 2O₂", why:"That’s the reverse reaction." }] },
        b:{ prompt:"Which correctly writes CaCO₃ → CaO + CO₂, " + DH + " = +179.2 kJ, with a heat term?", options:[
          { t:"CaCO₃ + 179.2 kJ → CaO + CO₂", ok:true, why:"Endothermic: heat is a reactant." },
          { t:"CaCO₃ → CaO + CO₂ + 179.2 kJ", why:M3 },
          { t:"CaCO₃ → CaO + CO₂ − 179.2 kJ", why:"Positive amounts, on the correct side." },
          { t:"CaO + CO₂ + 179.2 kJ → CaCO₃", why:"That’s the reverse." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which order is correct, from smallest to largest energy change per mole?", options:[
          { t:"melting ice &lt; burning methane &lt; nuclear fission", ok:true, why:"6.01 &lt; 890.5 &lt; about 2 × 10<sup>10</sup> kJ/mol." },
          { t:"burning methane &lt; melting ice &lt; nuclear fission", why:"6.01 &lt; 890.5. " + M7 },
          { t:"nuclear fission &lt; burning methane &lt; melting ice", why:M7 },
          { t:"All about the same", why:M7 }] },
        b:{ prompt:"Which typically involves the largest energy change per mole?", options:[
          { t:"fission of uranium-235", ok:true, why:"About 2 × 10<sup>10</sup> kJ/mol." },
          { t:"burning propane", why:"2219.9 kJ/mol." },
          { t:"boiling water", why:"44.0 kJ/mol." },
          { t:"dissolving a salt", why:"Tens of kJ/mol." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"N₂ + O₂ → 2NO, " + DH + " = +182.6 kJ. What is " + DH + " for 2NO → N₂ + O₂ when 3 mol of NO decompose?", options:[
          { t:"−273.9 kJ", ok:true, why:"Reversed: −182.6 kJ per 2 mol NO, so −91.3 kJ per mol × 3." },
          { t:"+273.9 kJ", why:"Reversing flips the sign. " + M4 },
          { t:"−547.8 kJ", why:"That’s for 6 mol NO (3 × −182.6)." },
          { t:"−182.6 kJ", why:"This is for 3 mol, not 2." }] },
        b:{ prompt:"4Fe + 3O₂ → 2Fe₂O₃, " + DH + " = −1648.4 kJ. What is " + DH + " when 1 mol of Fe₂O₃ decomposes into its elements?", options:[
          { t:"+824.2 kJ", ok:true, why:"Reverse (+1648.4 kJ for 2 mol of Fe₂O₃), then halve for 1 mol." },
          { t:"−824.2 kJ", why:M4 },
          { t:"+1648.4 kJ", why:"That’s for 2 mol." },
          { t:"+412.1 kJ", why:"That’s per mol of Fe." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How much energy is released when 4.0 g of CH₄ burns completely? (<i>M</i> = 16.0 g/mol; " + DH + " = −890.5 kJ/mol)", options:[
          { t:"223 kJ", ok:true, why:"0.25 mol × 890.5 = 222.6 kJ." },
          { t:"3562 kJ", why:"You multiplied by the mass. " + M5 },
          { t:"890.5 kJ", why:"That’s for 1 mol. " + M5 },
          { t:"55.7 kJ", why:"You divided by the molar mass twice." }] },
        b:{ prompt:"How much energy is released when 22.0 g of C₃H₈ burns completely? (<i>M</i> = 44.0 g/mol; " + DH + " = −2219.9 kJ/mol)", options:[
          { t:"1110 kJ", ok:true, why:"0.500 mol × 2219.9 = 1110 kJ." },
          { t:"48 838 kJ", why:"You multiplied by the mass. " + M5 },
          { t:"2219.9 kJ", why:"That’s for 1 mol. " + M5 },
          { t:"4440 kJ", why:"That’s for 2 mol; 22.0 g is 0.500 mol." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A cold pack absorbs 25.7 kJ per mole of NH₄NO₃ dissolved. How many moles must dissolve to absorb 12.85 kJ, and what happens to the pack’s temperature?", options:[
          { t:"0.500 mol; it gets colder", ok:true, why:"12.85 ÷ 25.7 = 0.500 mol; the dissolving absorbs heat, so the pack cools." },
          { t:"2.00 mol; it gets colder", why:"That’s 25.7 ÷ 12.85, upside down." },
          { t:"0.500 mol; it gets warmer", why:M1 },
          { t:"330 mol; it gets colder", why:"That’s 12.85 × 25.7: divide instead." }] },
        b:{ prompt:"A hand warmer reaction releases 1648.4 kJ per 4 mol of Fe. How much energy does 1.0 mol of Fe release, and what happens to the pack?", options:[
          { t:"412.1 kJ; it warms", ok:true, why:"1648.4 ÷ 4 = 412.1 kJ, released into the surroundings." },
          { t:"6593.6 kJ; it warms", why:"Divide by 4, don’t multiply." },
          { t:"412.1 kJ; it cools", why:"Energy is released, so the surroundings warm. " + M2 },
          { t:"824.2 kJ; it warms", why:"That’s for 2 mol of Fe." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why burning methane is exothermic?", options:[
          { t:"“More energy is released when the C=O and O–H bonds form than is absorbed to break the C–H and O=O bonds, so energy flows out to the surroundings.”", ok:true, why:"Forming bonds releases energy, breaking them absorbs it; here the release wins." },
          { t:"“Breaking methane’s bonds releases energy.”", why:M6 },
          { t:"“Flames are hot.”", why:"That describes it but doesn’t explain it." },
          { t:"“The products have more enthalpy.”", why:"They have less." }] },
        b:{ prompt:"Which is the best explanation of why a cold pack feels cold?", options:[
          { t:"“Dissolving absorbs energy from the surroundings, including your hand, so the surroundings lose heat.”", ok:true, why:M1 },
          { t:"“The pack releases cold.”", why:"Cold isn’t released; heat is absorbed. " + M1 },
          { t:"“The salt is stored in a freezer.”", why:"It’s at room temperature before use." },
          { t:"“Dissolving releases energy.”", why:"Then it would feel warm." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which enthalpy diagram description matches an endothermic reaction?", options:[
          { t:"“The products’ level is above the reactants’; the arrow points up, labelled with a positive " + DH + ".”", ok:true, why:"Energy enters the system, so the products have more enthalpy." },
          { t:"“Products below reactants, arrow down, " + DH + " positive.”", why:M2 },
          { t:"“Products above reactants, " + DH + " negative.”", why:M2in },
          { t:"“Both levels the same, " + DH + " positive.”", why:"Then there’s no change." }] },
        b:{ prompt:"Which enthalpy diagram description matches CH₄ + 2O₂ → CO₂ + 2H₂O, " + DH + " = −890.5 kJ?", options:[
          { t:"“CH₄ + 2O₂ on the higher level, CO₂ + 2H₂O lower, with a downward arrow of 890.5 kJ.”", ok:true, why:"Exothermic: the products sit 890.5 kJ lower." },
          { t:"“CO₂ + 2H₂O on the higher level.”", why:M2 },
          { t:"“Both on the same level.”", why:"Energy is released." },
          { t:"“An upward arrow of 890.5 kJ.”", why:M2 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A company wants a reaction for a <em>cold pack</em>. Which reaction fits?", options:[
          { t:"NH₄NO₃(s) → NH₄⁺(aq) + NO₃⁻(aq), " + DH + " = +25.7 kJ", ok:true, why:"Endothermic: it absorbs heat." },
          { t:"4Fe + 3O₂ → 2Fe₂O₃, " + DH + " = −1648.4 kJ", why:"That warms: a hand warmer." },
          { t:"CH₄ combustion", why:"Exothermic, and it needs a flame." },
          { t:"CaO + CO₂ → CaCO₃, " + DH + " = −179.2 kJ", why:"Exothermic." }] },
        b:{ prompt:"A company wants a reaction for a <em>hand warmer</em> that needs no flame. Which reaction fits?", options:[
          { t:"4Fe + 3O₂ → 2Fe₂O₃, " + DH + " = −1648.4 kJ", ok:true, why:"Exothermic, slow and flameless." },
          { t:"NH₄NO₃ dissolving", why:"Endothermic." },
          { t:"CaCO₃ → CaO + CO₂", why:"Endothermic." },
          { t:"Propane combustion", why:"Needs a flame." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Fission of 1 mol of uranium-235 releases about 2 × 10<sup>10</sup> kJ. About how many moles of methane would release the same energy? (890.5 kJ/mol ≈ 9 × 10<sup>2</sup> kJ/mol)", options:[
          { t:"About 2 × 10<sup>7</sup> mol", ok:true, why:"2 × 10<sup>10</sup> ÷ 9 × 10<sup>2</sup> ≈ 2 × 10<sup>7</sup>." },
          { t:"About 2 × 10<sup>13</sup> mol", why:"That multiplies instead of dividing." },
          { t:"About 2 × 10<sup>10</sup> mol", why:"The scales are different. " + M7 },
          { t:"About 900 mol", why:M7 }] },
        b:{ prompt:"About how many moles of ice could the heat from burning 1 mol of methane melt? (890.5 kJ; melting needs 6.01 kJ/mol)", options:[
          { t:"About 150 mol", ok:true, why:"890.5 ÷ 6.01 ≈ 148." },
          { t:"About 1.5 mol", why:M7 },
          { t:"About 5350 mol", why:"That multiplies." },
          { t:"About 6 mol", why:"Divide 890.5 by 6.01." }] } }
    ]
  },
  task:{
    title:"Self-heating meal pack", summary:"Self-heating meal pack",
    statement:"<p>Design the heater for a self-heating meal pack. Choose a reaction and an amount that meet every condition. Can you find all the answers?</p><ol class=\"eh-conds\"><li>The reaction is exothermic.</li><li>It needs no flame (the pack is sealed).</li><li>It releases between 400 and 500 kJ.</li><li>The main reactant’s mass is at most 400 g.</li></ol>",
    checks:["Exothermic", "No flame", "400–500 kJ released", "Mass ≤ 400 g"],
    tips:["Heating needs " + DH + " &lt; 0.", "A sealed pack can’t hold a flame: rule out combustion.", "Energy = <i>n</i> × (energy per mole).", "Mass = <i>n</i> × <i>M</i>. Quicklime is light per mole but gives little energy per mole, so check both lines."],
    explainPrompt:"Explain why your choice heats the food and how you checked the energy and mass.",
    vocab:"Use the words exothermic, " + DH + ", moles and molar mass.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Iron gives far more energy per mole. Quicklime needs about 6–7 times as many moles, which pushes against the mass limit."
  },
  cards:[
    ["System / surroundings", "The chemicals reacting / everything else (water, container, air, you)."],
    ["Enthalpy change, " + DH, "The heat exchanged at constant pressure, in kJ."],
    ["Exothermic", "Energy leaves the system; " + DH + " &lt; 0; the surroundings warm."],
    ["Endothermic", "Energy enters the system; " + DH + " &gt; 0; the surroundings cool."],
    [DH + " form", "CH₄ + 2O₂ → CO₂ + 2H₂O, " + DH + " = −890.5 kJ"],
    ["Heat-term form", "CH₄ + 2O₂ → CO₂ + 2H₂O + 890.5 kJ (exo: heat is a product)."],
    ["Reverse an equation", "Change the sign of " + DH + "."],
    ["Scale an equation", "Multiply " + DH + " by the same factor."],
    ["Energy from a mass", "<i>n</i> = <i>m</i> ÷ <i>M</i>, then energy = <i>n</i> × " + DH + " per mole."],
    ["Bonds and energy", "Breaking bonds absorbs energy; forming bonds releases it."],
    ["Energy scales", "Phase change ≈ 10 kJ/mol; chemical ≈ 10<sup>2</sup>–10<sup>3</sup> kJ/mol; nuclear ≈ 10<sup>10</sup> kJ/mol."],
    ["States matter", "H₂O(l) vs H₂O(g) differ by 44.0 kJ/mol, so always include the states."]
  ]
};
