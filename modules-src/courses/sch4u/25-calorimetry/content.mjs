// SCH4U 25 Calorimetry. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/25-calorimetry.md
// Pictures (hero cup and calculation, the C5 calorimeter with its temperature–time trace, the Part 3 can calorimeter
// and extrapolation graph, the task preview) are drawn by app.js. Accepted values come from MV.chem.data in app.js.

const q = "<i>q</i>", QR = "<i>q</i><sub>rxn</sub>", QW = "<i>q</i><sub>water</sub>", DH = "Δ<i>H</i>", DT = "Δ<i>T</i>";
const MCDT = "<i>mc</i>Δ<i>T</i>", CCAL = "<i>C</i><sub>cal</sub>", nI = "<i>n</i>", cI = "<i>c</i>", mI = "<i>m</i>";
const DHN = "Δ<i>H</i><sub>neut</sub>", DHC = "Δ<i>H</i><sub>c</sub>";

// Misconception core sentences (plan §3)
const M1 = "The water gained what the reaction lost: " + QR + " = −" + QW + ", so a temperature rise means " + DH + " &lt; 0.";
const M2 = mI + " is the mass of the whole solution that changed temperature: 50.0 mL + 50.0 mL ≈ 100.0 g.";
const M3 = q + " = " + MCDT + " gives joules; divide by 1000 for kJ before dividing by moles.";
const M4 = "Use the moles of the limiting reactant, the amount that actually reacted.";
const M5 = "Doubling both volumes doubles both the heat <em>and</em> the mass to heat: " + DT + " is unchanged.";
const M6 = "Lost heat never reaches the thermometer, so " + DT + ", and the measured |" + DH + "|, come out too small.";
const M7 = "A high " + cI + " means <em>more</em> heat per degree: aluminium (0.897) stores more heat than copper (0.385) at the same mass and temperature.";

export default {
  id:"25-calorimetry",
  kind:"topic",
  title:"Calorimetry",
  topic:"Calorimetry",
  readyTopic:"calorimetry",
  hero:{
    headline:"Measure the water, and you’ve measured the reaction",
    text:"A <strong>calorimeter</strong> traps the heat of a reaction in water. Measure the water’s <strong>temperature change</strong>, use its <strong>mass</strong> and <strong>specific heat capacity</strong>, and you know the heat: " + q + " = " + MCDT + ". The reaction lost (or gained) exactly that much, so dividing by the moles that reacted gives the <strong>molar enthalpy</strong>.",
    fig:{ html:'<div class="cal-hx"><svg class="cal-hx-svg" id="cal-hx-svg" viewBox="0 0 480 270" role="img" aria-label="Two clear solutions pour into two nested polystyrene cups. A lid closes over them, with a thermometer and a stirrer through it. The thermometer climbs from 20.0 °C to 26.0 °C while orange heat arrows flow from the reacting particles into the water molecules. Beside the cup, the equation q = mcΔT has each letter labelled: heat, mass, specific heat capacity and temperature change."></svg><p class="cal-hx-calc" id="cal-hx-calc" aria-live="polite"></p><div class="cal-hx-row"><p class="cal-hx-ctr" id="cal-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="cal-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can calculate heat with " + q + " = " + MCDT + " and rearrange it to find " + mI + ", " + cI + " or " + DT + ".",
    "I can relate the water’s heat to the reaction’s heat (" + QR + " = −" + QW + ") and give " + DH + " the correct sign.",
    "I can calculate a molar enthalpy from coffee-cup data, using the limiting reactant.",
    "I can calculate molar enthalpies of combustion from bomb calorimeter data (" + q + " = <i>C</i>" + DT + ").",
    "I can identify sources of error, explain their direction and suggest improvements.",
    "I can use calorimetry to identify substances or compare fuels and foods."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Thermochemistry signs", goal:2,
          prompt:"A reaction releases 2.5 kJ to the water around it. What is " + q + " for the reaction?",
          options:[
            { t:"−2.5 kJ", ok:true, why:"Energy leaves the system." },
            { t:"+2.5 kJ", why:"That’s the water’s " + q + "." },
            { t:"0 kJ", why:"Energy moved." },
            { t:"−2500 kJ", why:"2.5 kJ = 2500 J, not 2500 kJ." }],
          hints:["Whose point of view is " + QR + "?", "The system lost energy.", "−2.5 kJ."] },
        { id:"w2", skill:"Thermochemistry signs", goal:2,
          prompt:"During a dissolving, the water’s temperature falls. The process is…",
          options:[
            { t:"endothermic, with " + DH + " &gt; 0", ok:true, why:"The process took heat from the water." },
            { t:"exothermic, with " + DH + " &lt; 0", why:"Then the water would warm." },
            { t:"endothermic, with " + DH + " &lt; 0", why:"Endothermic means " + DH + " &gt; 0." },
            { t:"neither", why:"Heat moved." }],
          hints:["The water lost heat: to what?", "To the dissolving.", "Endothermic, positive."] },
        { id:"w3", skill:"Moles in solution", goal:3,
          prompt:"How many moles of HCl are in 50.0 mL of 1.00 mol/L HCl?",
          options:[
            { t:"0.0500 mol", ok:true, why:nI + " = " + cI + "<i>V</i> = 1.00 × 0.0500 L." },
            { t:"50.0 mol", why:"Convert mL to L." },
            { t:"0.500 mol", why:"50.0 mL = 0.0500 L." },
            { t:"20.0 mol", why:"Multiply, don’t divide." }],
          hints:[nI + " = " + cI + "<i>V</i>.", "<i>V</i> in litres.", "0.0500 mol."] },
        { id:"w4", skill:"Moles in solution", goal:3,
          prompt:"25.0 mL of 2.00 mol/L acid and 25.0 mL of 1.00 mol/L base react 1 : 1. Which is limiting?",
          options:[
            { t:"The base (0.0250 mol vs 0.0500 mol of acid)", ok:true, why:"The base has fewer moles, so it runs out first." },
            { t:"The acid", why:"The acid has more moles." },
            { t:"Neither", why:"Equal volumes, but different concentrations." },
            { t:"Both", why:"Only one can run out first." }],
          hints:["Find each " + nI + ".", "Acid 0.0500, base 0.0250.", "The base."] },
        { id:"w5", skill:"Unit conversions", goal:1,
          prompt:"2508 J is how many kJ?",
          options:[
            { t:"2.508 kJ", ok:true, why:"2508 ÷ 1000 = 2.508." },
            { t:"2 508 000 kJ", why:"Divide by 1000." },
            { t:"25.08 kJ", why:"Off by a factor of 10." },
            { t:"0.2508 kJ", why:"Off by a factor of 10." }],
          hints:["1 kJ = 1000 J.", "÷ 1000.", "2.508 kJ."] },
        { id:"w6", skill:"Unit conversions", goal:1,
          prompt:"What is the mass of 75.0 mL of a dilute water solution?",
          options:[
            { t:"75.0 g", ok:true, why:"Assume 1.00 g/mL." },
            { t:"0.0750 g", why:"Don’t convert to litres here." },
            { t:"75.0 kg", why:"1 mL ≈ 1 g." },
            { t:"7.50 g", why:"1.00 g per mL." }],
          hints:["Density of water?", "1.00 g/mL.", "75.0 g."] }
      ],
      refreshers:{
        "Thermochemistry signs":"If the water warms, the reaction released heat: " + QR + " &lt; 0 and " + DH + " &lt; 0.",
        "Moles in solution":nI + " = " + cI + " × <i>V</i> (in L). The limiting reactant runs out first.",
        "Unit conversions":"J ÷ 1000 = kJ; dilute solutions: 1.00 g per mL."
      }
    }
  },
  explore:{
    heading:"Calorimeter",
    intro:"Run virtual experiments in a coffee-cup or bomb calorimeter. Watch the temperature, then work out the enthalpy.",
    how:"Choose a calorimeter and set up the run, then press <strong>Mix</strong> (or <strong>Ignite</strong>). The thermometer, the temperature–time trace and the readout update as the run goes; the worked strip shows the calculation.",
    modes:[{ id:"cup", t:"Coffee cup" }, { id:"bomb", t:"Bomb" }, { id:"tt", t:"Temperature–time" }],
    procs:[{ id:"neut", t:"Neutralization" }, { id:"salt", t:"Dissolving NH₄NO₃" }, { id:"metal", t:"Hot metal into water" }],
    fuels:[{ id:"CH4", t:"methane" }, { id:"C2H5OH", t:"ethanol" }, { id:"C6H12O6", t:"glucose" }],
    losses:[{ id:"ideal", t:"Ideal" }, { id:"real", t:"Real" }],
    modelNote:"<p><strong>About this model.</strong> Dilute solutions are treated as water: 1.00 g/mL and 4.18 J/(g·°C). The mass heated is the total solution volume in grams (or the 100.0 g of water); the mass of a dissolved solid is ignored. Ideal " + DT + " = " + nI + "(limiting) × |" + DH + "<sub>accepted</sub>| ÷ (" + mI + " × 4.18). Metal mode: " + mI + "<sub>metal</sub>" + cI + "<sub>metal</sub>(100.0 − <i>T</i><sub>f</sub>) = 418 × (<i>T</i><sub>f</sub> − 20.0). Bomb: " + DT + " = " + nI + " × |" + DHC + "| ÷ " + CCAL + ".</p><p>“Real” is a teaching model: the calorimeter loses 10% of the heat to the surroundings, so " + DT + " is 90% of ideal, and the temperature then drifts slowly back.</p>",
    predictions:[
      { id:"p1", prompt:"Neutralization, 50.0 + 50.0 mL at 1.00 mol/L: " + DT + " = 6.67 °C. Change to 100.0 + 100.0 mL at the same concentration. What happens to " + DT + "?",
        options:[{ t:"It stays about 6.67 °C", ok:true }, { t:"It doubles" }, { t:"It halves" }, { t:"It quadruples" }],
        explain:"Twice the moles release twice the heat into twice the mass." },
      { id:"p2", prompt:"Back to 50.0 + 50.0 mL, now with the concentration changed to 2.00 mol/L. Now what happens to " + DT + "?",
        options:[{ t:"It doubles, to about 13.35 °C", ok:true }, { t:"It stays the same" }, { t:"It halves" }, { t:"It rises a little" }],
        explain:"Twice the moles in the same mass of solution." },
      { id:"p3", prompt:"Switch the toggle to Real. With heat escaping, will the measured " + DH + " be larger or smaller in size than −55.8 kJ/mol?",
        options:[{ t:"Smaller in size (about −50.2)", ok:true }, { t:"Larger in size" }, { t:"The same" }, { t:"Positive" }],
        explain:"Heat that escapes is never measured." },
      { id:"p4", prompt:"Dissolving NH₄NO₃: the water cools from 20.0 °C to 13.9 °C. What sign does " + DH + " have?",
        options:[{ t:"Positive: the dissolving absorbed heat from the water", ok:true }, { t:"Negative, because " + DT + " is negative" }, { t:"Zero" }, { t:"Negative, because the water lost heat" }],
        explain:QW + " &lt; 0, so " + QR + " &gt; 0." }
    ],
    chalIntro:"Use the calorimeter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], prompt:"Dissolve enough NH₄NO₃ in 100.0 g of water to cool it by 6.15 °C (± 0.05 °C), ideal mode.",
        why:"8.00 g is 0.100 mol, and 0.100 × 25 700 ÷ 418 = 6.15 °C.",
        general:"Choose <strong>Dissolving NH₄NO₃</strong> in Coffee cup mode, set the salt mass and press <strong>Mix</strong>.",
        hints:["Heat needed: 100.0 × 4.18 × 6.15 J.", "≈ 2571 J = 2.571 kJ; ÷ 25.7 kJ/mol = 0.100 mol.", "0.100 mol × 80.0 g/mol = 8.00 g."] },
      { id:"tc2", goal:[4, 6], prompt:"Bomb mode: choose " + CCAL + " so that burning 0.0500 mol of methane raises the temperature by 8.9 °C (± 0.05 °C).",
        why:"0.0500 × 890.5 ÷ 5.0 = 8.905 °C.",
        general:"In Bomb mode, choose methane, set 0.0500 mol and a heat capacity, then press <strong>Ignite</strong>.",
        hints:[q + " = 0.0500 × 890.5 kJ.", "44.5 kJ.", "<i>C</i> = 44.5 ÷ 8.9 = 5.0 kJ/°C."] },
      { id:"tc3", goal:[1, 6], stretch:true, prompt:"Metal mode: three mystery 100.0 g samples (A, B, C), each at 100.0 °C, go into 100.0 g of water at 20.0 °C. The final temperatures are A 26.75 °C, B 27.76 °C and C 34.13 °C. Which sample is aluminium? Choose the reason too.",
        why:"C warms the water most because aluminium has the highest " + cI + " (0.897): it gives out the most heat per degree as it cools.",
        general:"Choose <strong>Hot metal into water</strong>, then pick a sample and a reason under <strong>Mystery samples</strong>.",
        answer:"C",
        samples:[
          { id:"A", tf:"26.75", fb:"The smallest temperature rise means the <em>least</em> heat stored per degree: the lowest " + cI + " (copper)." },
          { id:"B", tf:"27.76", fb:"That’s iron (0.449)." },
          { id:"C", tf:"34.13" }],
        reasons:[
          { id:"r1", t:"Aluminium has the highest " + cI + ", so it releases the most heat as it cools and warms the water most.", ok:true },
          { id:"r2", t:"A high " + cI + " means it cools fastest.", fb:cI + " is heat per gram per degree, not a speed." },
          { id:"r3", t:"Aluminium has the lowest " + cI + ", so it heats the water most easily.", fb:M7 }],
        hints:["All three cool from 100 °C. Which one gives the water the most heat?", "More heat per degree means a higher " + cI + ".", "C, the highest final temperature: aluminium (0.897)."] }
    ]
  },
  part3:{
    slug:"error", name:"Error", heading:"Why the measured value is off",
    intro:"Curriculum expectation D2.4 asks you to compare a measured heat of reaction with the accepted value. In this error lab you work out a real result, sort the sources of error by their <em>direction</em>, check one with data and fix the design.",
    s1:{ title:"Station 1: The can calorimeter",
      intro:"A spirit lamp burns ethanol under a metal can of water (shown as a diagram). Ethanol burned: 0.46 g. Water: 200.0 g, warmed by 10.0 °C. Accepted " + DHC + "(ethanol) = −1366.8 kJ/mol (course table).",
      use:"<i>M</i>(ethanol) = 46.0 g/mol, so 0.46 g = 0.0100 mol. (1366.8 − 836) ÷ 1366.8 ≈ 0.388.",
      items:[
        { id:"q", label:"Heat absorbed by the water, " + QW + ":", unit:"J", answer:8360, tol:0.01, why:"200.0 × 4.18 × 10.0 = 8360 J.",
          wrong:[{ match:836, fb:"Use all of the 200.0 g: 200.0 × 4.18 × 10.0." }, { match:8.36, fb:"That’s in kJ. Enter joules here." }], fb:"Use " + QW + " = " + MCDT + " with the water’s mass." },
        { id:"dh", label:"Measured " + DHC + ":", unit:"kJ/mol", answer:-836, tol:0.01, why:"−8.36 kJ ÷ 0.0100 mol = −836 kJ/mol.",
          wrong:[{ match:836, fb:M1 }, { match:-8.36, fb:"Divide by the 0.0100 mol burned." }, { match:-836000, fb:M3 }], fb:DH + " = " + QR + " ÷ " + nI + ", with " + QR + " in kJ." },
        { id:"pe", label:"Percent error:", unit:"%", answer:39, tol:0.025, why:"(1366.8 − 836) ÷ 1366.8 ≈ 0.388, about 39%.",
          wrong:[{ match:61, fb:"That’s measured ÷ accepted." }, { match:63, fb:"Divide by the <em>accepted</em> value, not the measured one." }, { match:3.9, fb:"0.388 is 38.8%." }], fb:"Percent error = |measured − accepted| ÷ accepted × 100%." }
      ],
      done:"The can calorimeter’s result is about 39% too small in size. Where did the missing heat go? Sort the sources in Station 2." },
    s2:{ title:"Station 2: Sort the sources by direction",
      intro:"Sort each source of error: does it make the measured |" + DH + "| too small or too large?",
      bins:[{ id:"small", t:"makes |" + DH + "| too small" }, { id:"large", t:"makes |" + DH + "| too large" }],
      cards:[
        { id:"s1", t:"Heat warms the air and the can", answer:"small", why:"That heat never reaches the water, so " + DT + " and " + q + " come out too small. " + M6 },
        { id:"s2", t:"Soot (incomplete combustion)", answer:"small", why:"Incomplete burning releases less heat from the same mass of fuel, so the heat per mole is too small." },
        { id:"s3", t:"Ethanol evaporates from the wick and is counted as burned", answer:"small", why:"The mass lost counts ethanol that never burned, so " + nI + " is too large and " + q + " ÷ " + nI + " too small." },
        { id:"s4", t:"The thermometer is read <em>before</em> the maximum", answer:"small", why:"The recorded " + DT + " is too small, so " + q + " is too small." },
        { id:"s5", t:"The water’s mass is recorded as too small", answer:"small", why:"Less mass in " + q + " = " + MCDT + " gives a smaller " + q + "." },
        { id:"s6", t:"“The lid was left off” (coffee cup)", answer:"small", why:"Heat escapes from the open top before it is measured, so " + DT + " is too small." }],
      all:"Every source here makes |" + DH + "| too small: lost heat never reaches the thermometer. That’s why measured exothermic values are usually smaller in size than accepted ones." },
    s3:{ title:"Station 3: Check it with data",
      intro:"This temperature–time graph comes from a Real-mode neutralization (50.0 + 50.0 mL, 1.00 mol/L; mixing at 0 min). The maximum reading is 26.0 °C at 2 min. Drag the two ruler handles (or use the arrow keys) so the ruler lies along the cooling line. It extends back to the moment of mixing.",
      fbOk:"The extrapolated temperature at mixing is 26.6 °C: " + DT + " = 6.6 °C, not 6.0 °C.",
      fbSlope:"Lay the ruler along the cooling points (after 2 min): both handles on the line of dots.",
      fbPeak:"The ruler is through the maximum but not along the cooling line. Put both handles on the cooling points." },
    s4:{ title:"Station 4: Improve the design",
      intro:"Tap three improvements for the coffee cup.",
      fixes:[
        { id:"lid", t:"a lid", note:"A lid stops heat (and steam) escaping from the surface." },
        { id:"nest", t:"nested cups", note:"Two cups trap a layer of air, a good insulator, so less heat leaks through the walls." },
        { id:"extra", t:"extrapolate the graph", note:"Extrapolating corrects for the heat lost while the mixture was reaching its maximum." },
        { id:"conc", t:"use a more concentrated solution for a bigger " + DT, note:"A bigger " + DT + " makes the thermometer’s ±0.1 °C a smaller fraction of the reading (smaller relative error)." },
        { id:"stir", t:"stir", note:"Stirring mixes the solution evenly, so the thermometer reads the temperature of the whole solution." }],
      done:"Each of these keeps more of the reaction’s heat in the water or makes the reading more precise." },
    quickCheck:{
      title:"Quick check", summary:"Error quick check",
      items:[
        { id:"q1", goal:5, prompt:"Heat escaping to the air makes the measured |" + DH + "|…",
          choices:[
            { t:"too small", ok:true, fb:"Right. The thermometer never measures the lost heat." },
            { t:"too large", fb:"The thermometer never measures the lost heat." },
            { t:"unchanged", fb:"The thermometer never measures the lost heat." },
            { t:"zero", fb:"The thermometer never measures the lost heat." }] },
        { id:"q2", goal:5, prompt:"Percent error if the measured value is −50.2 and the accepted value is −55.8 kJ/mol?",
          choices:[
            { t:"10%", ok:true, fb:"Right. 5.6 ÷ 55.8 ≈ 0.10." },
            { t:"11%", fb:"5.6 ÷ 55.8; divide by the <em>accepted</em> value." },
            { t:"90%", fb:"5.6 ÷ 55.8; divide by the <em>accepted</em> value." },
            { t:"5.6%", fb:"5.6 ÷ 55.8; divide by the <em>accepted</em> value." }] },
        { id:"q3", goal:5, prompt:"Why extrapolate the temperature–time graph?",
          choices:[
            { t:"to estimate the temperature at mixing, before losses", ok:true, fb:"Right. It corrects for heat lost while the mixture was reaching its maximum." },
            { t:"to make the graph neater", fb:"It corrects for heat lost while the mixture was reaching its maximum." },
            { t:"to find the mass", fb:"It corrects for heat lost while the mixture was reaching its maximum." },
            { t:"to change " + cI, fb:"It corrects for heat lost while the mixture was reaching its maximum." }] },
        { id:"q4", goal:5, prompt:"Best single fix for the can calorimeter’s 39% error?",
          choices:[
            { t:"shield it from drafts and insulate the can", ok:true, fb:"Right. Most of the heat went into the air." },
            { t:"use more ethanol", fb:"Most of the heat went into the air." },
            { t:"use a larger thermometer", fb:"Most of the heat went into the air." },
            { t:"use colder water", fb:"Most of the heat went into the air." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"qmct", type:"numeric", title:q + " = " + MCDT, summary:"q = mcΔT", goal:1,
        instruction:"Six heat calculations. Type a number; the unit is shown.",
        how:"Type your answer, then press Check. Answers within 1% are accepted.",
        items:[
          { id:"a1", goal:1, prompt:"Heat to warm 50.0 g of water by 10.0 °C?", answer:2090, tol:0.01, unit:"J", display:"2090 J",
            wrong:[{ match:500, fb:"Include " + cI + " = 4.18." }, { match:2.09, fb:M3 }],
            why:"50.0 × 4.18 × 10.0 = 2090 J.", hints:[q + " = " + MCDT + ".", "50.0 × 4.18 × 10.0.", "2090 J."] },
          { id:"a2", goal:1, prompt:"250.0 g of water cools by 4.0 °C. Heat lost?", answer:4180, tol:0.01, unit:"J", display:"4180 J",
            wrong:[{ match:4.18, fb:"Multiply by " + mI + " and " + DT + "." }, { match:-4180, fb:"The water’s " + q + " is −4180 J; the heat <em>lost</em> is the amount, 4180 J." }],
            why:"250.0 × 4.18 × 4.0 = 4180 J lost (the water’s " + q + " is −4180 J).", hints:["Heat lost = " + MCDT + " with the size of " + DT + ".", "250.0 × 4.18 × 4.0.", "4180 J."] },
          { id:"a3", goal:1, prompt:"Heat to warm 100.0 g of aluminium by 10.0 °C?", answer:897, tol:0.01, unit:"J", display:"897 J",
            wrong:[{ match:4180, fb:"Use aluminium’s " + cI + ", 0.897." }],
            why:"100.0 × 0.897 × 10.0 = 897 J.", hints:["Which " + cI + "? Aluminium’s, not water’s.", "100.0 × 0.897 × 10.0.", "897 J."] },
          { id:"a4", goal:1, prompt:"200.0 g of water absorbs 8360 J. " + DT + "?", answer:10.0, tol:0.01, unit:"°C", display:"10.0 °C",
            wrong:[{ match:0.1, fb:DT + " = " + q + " ÷ (" + mI + cI + ")." }],
            why:"8360 ÷ (200.0 × 4.18) = 10.0 °C.", hints:[DT + " = " + q + " ÷ (" + mI + cI + ").", "8360 ÷ 836.", "10.0 °C."] },
          { id:"a5", goal:1, prompt:"500.0 g of water absorbs 41.8 kJ. " + DT + "?", answer:20.0, tol:0.01, unit:"°C", display:"20.0 °C",
            wrong:[{ match:0.02, fb:"41.8 kJ = 41 800 J." }],
            why:"41 800 ÷ (500.0 × 4.18) = 20.0 °C.", hints:["Convert kJ to J.", "41 800 ÷ (500.0 × 4.18).", "20.0 °C."] },
          { id:"a6", goal:1, prompt:"25.0 g of copper absorbs 385 J. " + DT + "?", answer:40.0, tol:0.01, unit:"°C", display:"40.0 °C",
            wrong:[{ match:3.68, fb:"Use copper’s " + cI + ", 0.385." }],
            why:"385 ÷ (25.0 × 0.385) = 40.0 °C.", hints:["Which " + cI + "? Copper’s.", "385 ÷ (25.0 × 0.385).", "40.0 °C."] }
        ] },
      { id:"prob", type:"custom", title:"Calorimetry problems", summary:"Calorimetry problems", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Six problems. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer (with its sign) or tap your choice, then press Check. Answers within 1% are accepted.",
        use:"Dilute solutions: 1.00 g/mL and 4.18 J/(g·°C). " + nI + " = " + cI + "<i>V</i>.",
        items:[
          { id:"r1", kind:"num", goal:2, prompt:"0.0500 mol of a salt dissolves in 100.0 g of water; the temperature rises 4.0 °C. " + DH + " of solution?", answer:-33.4, tol:0.01, unit:"kJ/mol", display:"−33.4 kJ/mol",
            wrong:[{ match:33.4, fb:M1 }, { match:-33440, fb:M3 }, { match:-1.67, fb:"Divide by the 0.0500 mol." }],
            fb:"Find " + QW + ", change the sign, convert to kJ, then divide by the moles.",
            why:"100.0 × 4.18 × 4.0 = 1672 J; −1.672 kJ ÷ 0.0500 mol = −33.4 kJ/mol.",
            hints:["The water warmed: what sign is " + QR + "?", "1672 J = 1.672 kJ.", "−1.672 ÷ 0.0500 = −33.4 kJ/mol."] },
          { id:"r2", kind:"num", goal:3, prompt:"25.0 mL of 2.00 mol/L HCl + 50.0 mL of 1.00 mol/L NaOH; " + DT + " = 8.0 °C. " + DHN + "?", answer:-50.2, tol:0.01, unit:"kJ/mol", display:"−50.2 kJ/mol",
            wrong:[{ match:-33.4, fb:"The mass is 75.0 g, not 50.0 g." }, { match:50.2, fb:M1 }, { match:-25.1, fb:M4 }],
            fb:"Use the total mass and the moles that reacted.",
            why:"Both are 0.0500 mol. 75.0 × 4.18 × 8.0 = 2508 J; −2.508 kJ ÷ 0.0500 mol = −50.2 kJ/mol.",
            hints:["Mass = 25.0 + 50.0 mL ≈ 75.0 g.", "HCl: 0.0500 mol; NaOH: 0.0500 mol.", "75.0 × 4.18 × 8.0 = 2508 J; −2.508 ÷ 0.0500 = −50.2."] },
          { id:"r3", kind:"num", star:true, goal:3, prompt:"50.0 mL of 1.00 mol/L HCl + 100.0 mL of 1.00 mol/L NaOH; " + DT + " = 4.0 °C. " + DHN + "?", answer:-50.2, tol:0.01, unit:"kJ/mol", display:"−50.2 kJ/mol",
            wrong:[{ match:-25.1, fb:"Only 0.0500 mol of HCl reacted; NaOH is in excess." }, { match:50.2, fb:M1 }, { match:-16.7, fb:"Divide by the moles that reacted (0.0500 mol of HCl), and use the whole 150.0 g." }],
            fb:M4,
            why:"HCl is limiting (0.0500 mol). 150.0 × 4.18 × 4.0 = 2508 J; −2.508 ÷ 0.0500 = −50.2 kJ/mol.",
            hints:["Which reactant is limiting?", "HCl: 0.0500 mol. Mass = 150.0 g.", q + " = 150.0 × 4.18 × 4.0 = 2508 J; −2.508 ÷ 0.0500 = −50.2."] },
          { id:"r4", kind:"chips", star:true, goal:6, prompt:"Bomb calorimeter: <i>C</i> = 8.00 kJ/°C; 0.0200 mol of a fuel raises the temperature 5.55 °C. Which course-table fuel is it?",
            options:[
              { t:"propane (" + DHC + " = −2220 kJ/mol)", ok:true, why:"8.00 × 5.55 = 44.4 kJ; ÷ 0.0200 = 2220 kJ/mol: propane." },
              { t:"methane (" + DHC + " = −890.5 kJ/mol)", why:"8.00 × 5.55 = 44.4 kJ; ÷ 0.0200 = 2220 kJ/mol." },
              { t:"ethanol (" + DHC + " = −1366.8 kJ/mol)", why:"8.00 × 5.55 = 44.4 kJ; ÷ 0.0200 = 2220 kJ/mol." },
              { t:"glucose (" + DHC + " = −2802.5 kJ/mol)", why:"8.00 × 5.55 = 44.4 kJ; ÷ 0.0200 = 2220 kJ/mol." }],
            hints:[q + " = <i>C</i>" + DT + ".", "8.00 × 5.55 = 44.4 kJ; ÷ 0.0200 mol.", "2220 kJ/mol: propane."] },
          { id:"r5", kind:"num", star:true, goal:5, prompt:"<strong>Investigation:</strong> Temperature–time data: <i>T</i><sub>initial</sub> 20.0 °C; maximum reading 26.0 °C; the cooling line extrapolated back to mixing gives 27.0 °C. Which " + DT + " should be used?", answer:7.0, tol:0.01, unit:"°C", display:"7.0 °C",
            wrong:[{ match:6.0, fb:"The extrapolation corrects for heat lost before the maximum." }, { match:1.0, fb:DT + " is measured from the initial temperature, 20.0 °C." }],
            fb:"Use the extrapolated temperature at the moment of mixing.",
            why:"27.0 − 20.0 = 7.0 °C: the extrapolation corrects for heat lost before the maximum.",
            hints:["Which temperature would the mixture have reached with no losses?", "The extrapolated 27.0 °C.", "27.0 − 20.0 = 7.0 °C."] },
          { id:"r6", kind:"num", star:true, goal:6, prompt:"A 100.0 g iron block at 100.0 °C warms some water from 20.0 °C to 30.0 °C. What mass of water?", use:"3143 ÷ 41.8 = 75.2", answer:75.2, tol:0.01, unit:"g", display:"75.2 g",
            wrong:[{ match:100, fb:"Iron lost 100.0 × 0.449 × 70.0 = 3143 J; the water gained it: " + mI + " × 4.18 × 10.0." }],
            fb:"Heat lost by the iron = heat gained by the water.",
            why:"Iron lost 100.0 × 0.449 × 70.0 = 3143 J; " + mI + " × 4.18 × 10.0 = 3143, so " + mI + " = 75.2 g.",
            hints:["The iron cools from 100.0 °C to 30.0 °C.", "100.0 × 0.449 × 70.0 = 3143 J.", "3143 ÷ 41.8 = 75.2 g."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Nasrin", how:"", goal:[2, 3],
        instruction:"Nasrin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"50.0 mL of 1.00 mol/L HCl and 50.0 mL of 1.00 mol/L NaOH warm from 20.0 °C to 26.0 °C. Find " + DHN + ".",
            steps:[mI + " = 100.0 g; " + DT + " = 6.0 °C.", QW + " = 100.0 × 4.18 × 6.0 = 2508 J = 2.508 kJ.", nI + " = 0.0500 mol of HCl (limiting, equal to NaOH).", DH + " = +2.508 kJ ÷ 0.0500 mol = +50.2 kJ/mol.", "So neutralization is endothermic."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:QR + " = −2.508 kJ, so " + DH + " = −50.2 kJ/mol (exothermic).", ok:true, why:M1 },
              { t:DH + " = −25.1 kJ/mol.", why:"Don’t add the base’s moles." },
              { t:DH + " = −2508 kJ/mol.", why:"Units: J vs kJ." },
              { t:"Step 4 is correct.", why:"The water warmed, so the reaction released heat. " + M1 }],
            hints:["Whose " + q + " is +2.508 kJ?", "The water’s.", QR + " = −2.508 kJ, so " + DH + " = −50.2 kJ/mol (exothermic)."] },
          { id:"e2", goal:3, task:"8.00 g of NH₄NO₃ (0.100 mol) dissolves in 100.0 g of water; the temperature falls 6.0 °C. Find " + DH + ".",
            steps:["The water cooled, so the process is endothermic.", QW + " = 8.00 g × 4.18 × (−6.0) = −201 J.", QR + " = +201 J; " + DH + " = +0.201 kJ ÷ 0.100 mol = +2.01 kJ/mol."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Use the water’s mass: " + QW + " = 100.0 × 4.18 × (−6.0) = −2508 J, so " + DH + " = +25.1 kJ/mol.", ok:true, why:"The water is what changed temperature." },
              { t:"Use 108.0 g, then round to +27.1 kJ/mol.", why:"This module’s convention uses the water’s mass; including the salt’s 8 g is a refinement, not the error here." },
              { t:"Use " + cI + " = 0.897.", why:"That’s aluminium’s." },
              { t:"Step 2 is correct.", why:"The salt’s mass isn’t the mass that changed temperature. " + M2 }],
            hints:["What absorbed or lost the heat?", "100.0 g of water.", "Use the water’s mass: " + QW + " = 100.0 × 4.18 × (−6.0) = −2508 J, so " + DH + " = +25.1 kJ/mol."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that doubling both volumes didn’t change " + DT + ", or how far off the can calorimeter was?" },
      { id:"j2", q:"In your own words, explain why " + QR + " = −" + QW + "." },
      { id:"j3", q:"Explain to a friend how you’d find a molar enthalpy from a coffee-cup experiment, step by step." },
      { id:"j4", q:"Which step do you still slip on (signs, masses, limiting reactant, units)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How much heat does 100.0 g of water absorb when it warms by 5.0 °C?", options:[
          { t:"2090 J", ok:true, why:"100.0 × 4.18 × 5.0." },
          { t:"500 J", why:"Include " + cI + "." },
          { t:"2.09 J", why:"That would be 2.09 kJ. " + M3 },
          { t:"20 900 J", why:"Check the multiplication: 418 × 5.0 = 2090." }] },
        b:{ prompt:"How much heat does 200.0 g of water absorb when it warms by 3.0 °C?", options:[
          { t:"2508 J", ok:true, why:"200.0 × 4.18 × 3.0." },
          { t:"600 J", why:"Include " + cI + "." },
          { t:"2.508 J", why:"That would be 2.508 kJ. " + M3 },
          { t:"25 080 J", why:"836 × 3.0 = 2508." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In a coffee-cup calorimeter the water’s temperature rises. The reaction’s " + q + " is…", options:[
          { t:"negative: the reaction is exothermic", ok:true, why:"The water gained what the reaction lost." },
          { t:"positive: the reaction is exothermic", why:M1 },
          { t:"positive: the reaction is endothermic", why:M1 },
          { t:"zero", why:"Heat moved." }] },
        b:{ prompt:"In a coffee-cup calorimeter the water’s temperature falls. The reaction’s " + q + " is…", options:[
          { t:"positive: the reaction is endothermic", ok:true, why:"The reaction took the heat the water lost." },
          { t:"negative: the reaction is endothermic", why:"The water lost heat to the reaction: " + QR + " = −" + QW + " &gt; 0." },
          { t:"negative: the reaction is exothermic", why:"The water lost heat to the reaction: " + QR + " = −" + QW + " &gt; 0." },
          { t:"zero", why:"Heat moved." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"For a bomb calorimeter, the heat released is calculated as…", options:[
          { t:q + " = " + CCAL + DT, ok:true, why:"The calorimeter’s heat capacity, in kJ/°C." },
          { t:q + " = " + MCDT + " with water’s " + cI + " only", why:"The bomb’s whole assembly absorbs heat." },
          { t:q + " = " + CCAL + " ÷ " + DT, why:"Multiply." },
          { t:q + " = " + DT + " ÷ " + nI, why:"That isn’t a heat." }] },
        b:{ prompt:"Which assumption is made for a dilute coffee-cup solution?", options:[
          { t:"It has the density (1.00 g/mL) and specific heat capacity (4.18 J/(g·°C)) of water", ok:true, why:"Dilute solutions behave like water." },
          { t:"It has no mass", why:"Its mass is its volume in grams." },
          { t:"It absorbs no heat", why:"It absorbs the heat." },
          { t:"Its " + cI + " equals the metal cup’s", why:"It’s a polystyrene cup; the water absorbs the heat." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"50.0 mL of 1.00 mol/L HCl + 50.0 mL of 1.00 mol/L NaOH; " + DT + " = 6.0 °C. What is " + DHN + "?", options:[
          { t:"−50.2 kJ/mol", ok:true, why:"2508 J ÷ 1000 ÷ 0.0500 mol, negative." },
          { t:"+50.2 kJ/mol", why:M1 },
          { t:"−25.1 kJ/mol", why:"Divide by the 0.0500 mol that reacted, not 0.100." },
          { t:"−2.51 kJ/mol", why:"You haven’t divided by the moles." }] },
        b:{ prompt:"8.00 g of NH₄NO₃ (0.100 mol) dissolves in 100.0 g of water; " + DT + " = −6.0 °C. What is " + DH + "?", options:[
          { t:"+25.1 kJ/mol", ok:true, why:"100.0 × 4.18 × 6.0 = 2508 J; +2.508 kJ ÷ 0.100 mol." },
          { t:"−25.1 kJ/mol", why:"The water cooled, so " + QR + " &gt; 0. " + M1.replace(" a temperature rise means " + DH + " &lt; 0", " a temperature fall means " + DH + " &gt; 0") },
          { t:"+2.51 kJ/mol", why:"Divide by 0.100 mol." },
          { t:"+251 kJ/mol", why:"0.100 mol, not 0.0100." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A bomb calorimeter (<i>C</i> = 10.0 kJ/°C) warms by 6.83 °C when 0.0500 mol of ethanol burns. What is " + DHC + "?", options:[
          { t:"−1366 kJ/mol", ok:true, why:"68.3 kJ ÷ 0.0500 mol." },
          { t:"−68.3 kJ/mol", why:"That’s " + q + "; divide by the moles." },
          { t:"+1366 kJ/mol", why:M1 },
          { t:"−137 kJ/mol", why:"0.0500 mol, not 0.500 mol." }] },
        b:{ prompt:"A bomb calorimeter (<i>C</i> = 10.0 kJ/°C) warms by 2.80 °C when 0.0100 mol of glucose burns. What is " + DHC + "?", options:[
          { t:"−2800 kJ/mol", ok:true, why:"28.0 kJ ÷ 0.0100 mol." },
          { t:"−28.0 kJ/mol", why:"Divide by the moles." },
          { t:"+2800 kJ/mol", why:M1 },
          { t:"−280 kJ/mol", why:"0.0100 mol, not 0.100 mol." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A 50.0 g metal sample loses 1794 J as it cools by 40.0 °C. Using the course table, what is the metal?", use:"Course table: " + cI + " (J/(g·°C)): Al 0.897, Fe 0.449, Cu 0.385, water 4.18.", options:[
          { t:"Aluminium (" + cI + " = 0.897)", ok:true, why:"1794 ÷ (50.0 × 40.0) = 0.897." },
          { t:"Copper", why:cI + " would be 0.385." },
          { t:"Iron", why:cI + " would be 0.449." },
          { t:"It must be water, so " + cI + " = 4.18", why:"It’s a metal sample. " + M7 }] },
        b:{ prompt:"A 100.0 g metal sample loses 1925 J as it cools by 50.0 °C. What is the metal?", use:"Course table: " + cI + " (J/(g·°C)): Al 0.897, Fe 0.449, Cu 0.385, water 4.18.", options:[
          { t:"Copper (0.385)", ok:true, why:"1925 ÷ 5000." },
          { t:"Aluminium", why:"0.897." },
          { t:"Iron", why:"0.449." },
          { t:"Water", why:"It’s a metal sample. " + M7 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why a coffee-cup measurement of " + DHN + " (−50.2 kJ/mol) is smaller in size than the accepted value (−55.8 kJ/mol)?", options:[
          { t:"“Some heat escaped to the air and the cup, so the measured temperature rise, and therefore |" + DH + "|, came out too small.”", ok:true, why:"Lost heat is never measured." },
          { t:"“Heat loss makes the measured value too large.”", why:M6 },
          { t:"“The accepted value is wrong.”", why:"It comes from many careful measurements." },
          { t:"“The solutions had too much mass.”", why:"The mass was measured." }] },
        b:{ prompt:"Which is the best explanation of why a lid and nested cups improve a calorimeter?", options:[
          { t:"“They reduce heat exchange with the surroundings, so more of the reaction’s heat stays in the water and is measured.”", ok:true, why:"Less heat escapes, so " + DT + " is closer to the ideal." },
          { t:"“They increase the solution’s specific heat capacity.”", why:cI + " doesn’t change." },
          { t:"“They make the reaction faster.”", why:"They don’t change the reaction." },
          { t:"“They let heat escape faster.”", why:"The opposite." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which line correctly reports a result?", options:[
          { t:"“" + DHN + " = −50.2 kJ/mol HCl”", ok:true, why:"A sign, a size and per mole of the stated substance." },
          { t:"“" + DHN + " = 2508 J”", why:"That’s " + QW + ", without a sign or per mole." },
          { t:"“" + DHN + " = +50.2 kJ/mol”", why:M1 },
          { t:"“" + DHN + " = −50.2 kJ”", why:"Per mole is missing." }] },
        b:{ prompt:"Which order of steps is correct for a coffee-cup calculation?", options:[
          { t:"“" + QW + " = " + MCDT + " → " + QR + " = −" + QW + " → convert to kJ → ÷ moles of the limiting reactant”", ok:true, why:"Heat first, then sign, units and moles." },
          { t:"“÷ moles first, then " + MCDT + "”", why:"Find the heat first." },
          { t:"“" + QR + " = +" + QW + " → ÷ moles”", why:M1 },
          { t:"“" + MCDT + " → ÷ moles of <em>both</em> reactants”", why:M4 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A 10.0 g sample of a snack bar is burned in a bomb calorimeter (<i>C</i> = 10.0 kJ/°C) and the temperature rises 25.0 °C. What is its energy content per gram?", options:[
          { t:"25.0 kJ/g", ok:true, why:"250 kJ ÷ 10.0 g." },
          { t:"250 kJ/g", why:"Divide by the 10.0 g." },
          { t:"2.50 kJ/g", why:"10.0 × 25.0 = 250 kJ; then ÷ 10.0." },
          { t:"0.40 kJ/g", why:"That’s an inverted ratio." }] },
        b:{ prompt:"A 5.00 g sample of cereal raises a bomb calorimeter (<i>C</i> = 10.0 kJ/°C) by 8.00 °C. What is its energy content per gram?", options:[
          { t:"16.0 kJ/g", ok:true, why:"80.0 kJ ÷ 5.00 g." },
          { t:"80.0 kJ/g", why:"Divide by the mass." },
          { t:"400 kJ/g", why:"You multiplied by the mass." },
          { t:"1.60 kJ/g", why:"Check the decimal point." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A can calorimeter gives " + DHC + "(ethanol) = −836 kJ/mol; the accepted value is −1366.8 kJ/mol. Percent error?", use:"530.8 ÷ 1366.8 = 0.388", options:[
          { t:"About 39%", ok:true, why:"530.8 ÷ 1366.8 = 0.388, about 39%." },
          { t:"About 61%", why:"That’s measured ÷ accepted." },
          { t:"About 63%", why:"Divide by the <em>accepted</em> value, not the measured one." },
          { t:"About 3.9%", why:"0.388 is 38.8%." }] },
        b:{ prompt:"A coffee cup gives " + DHN + " = −50.2 kJ/mol; the accepted value is −55.8 kJ/mol. Percent error?", options:[
          { t:"About 10%", ok:true, why:"5.6 ÷ 55.8." },
          { t:"About 11%", why:"Divide by the accepted value." },
          { t:"About 90%", why:"That’s measured ÷ accepted." },
          { t:"About 1.0%", why:"5.6 ÷ 55.8 ≈ 0.10, which is 10%." }] } }
    ]
  },
  task:{
    title:"Design the run", summary:"Design the run",
    statement:"<p>Plan a neutralization run in a coffee cup that gives a precise " + DH + " without wasting chemicals. Can you find all the plans that work?</p><ol class=\"cal-conds\"><li>Neither reactant is left over.</li><li>The total volume fits the cup: at most 150 mL.</li><li>The ideal temperature rise is at least 5.0 °C, so a ±0.1 °C thermometer gives at most 2% uncertainty.</li><li>It uses at most 0.0750 mol of HCl (the chemical budget).</li></ol>",
    checks:["Nothing left over", "Fits the cup", DT + " ≥ 5.0 °C", "Within budget"],
    tips:["With equal concentrations, use equal volumes.", "Add the two volumes.", DT + " depends on concentration, not on how much you mix.", nI + " = " + cI + "<i>V</i>: 2.00 mol/L uses up the budget quickly."],
    explainPrompt:"Explain why concentration, not volume, controls the temperature rise, and why a larger " + DT + " gives a more precise result.",
    vocab:"Use the words limiting reactant, mass, " + q + " = " + MCDT + " and uncertainty.",
    more:"There’s more than one plan that works. Can you find them all?",
    afterAt:4,
    after3:"Every 1.00 mol/L plan gives the same " + DT + ". Volume doesn’t change the temperature rise, only the amount used."
  },
  cards:[
    [q + " = " + MCDT, "Heat (J) = mass (g) × specific heat capacity (J/(g·°C)) × temperature change (°C)."],
    [cI + " of water", "4.18 J/(g·°C). Metals are much lower (Al 0.897, Fe 0.449, Cu 0.385)."],
    ["Calorimeter", "An insulated container where the reaction’s heat is absorbed by water and measured."],
    [QR + " = −" + QW, "The reaction loses what the water gains (and the reverse)."],
    ["Molar enthalpy", DH + " = " + QR + " ÷ " + nI + " of the limiting (or stated) reactant, in kJ/mol."],
    ["Dilute solution assumption", "1.00 g/mL and 4.18 J/(g·°C), like water."],
    ["Bomb calorimeter", q + " = " + CCAL + DT + "; used for combustion."],
    ["Same concentration, more volume", DT + " stays the same: more heat, but more mass."],
    ["Heat loss", "Makes the measured |" + DH + "| too small."],
    ["Percent error", "|measured − accepted| ÷ accepted × 100%."],
    ["Temperature–time extrapolation", "Extend the cooling line back to the time of mixing to correct for losses."],
    ["J vs kJ", MCDT + " gives J; divide by 1000 before calculating kJ/mol."]
  ]
};
