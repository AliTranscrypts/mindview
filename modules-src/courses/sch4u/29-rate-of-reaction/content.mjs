// SCH4U 29 Rate of Reaction. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/29-rate-of-reaction.md
// The hero, the Reaction rate lab (Data / Experiment / Catalyst and nature), the Part 3 stations and the task preview are
// drawn by app.js. Model rules (plan §4 "Model rules") live in app.js; they are model data, not course-table values.

// Misconception core sentences (plan §3)
const M1 = "Rates are positive. For a reactant, rate = −Δ[A] ÷ Δ<i>t</i>.";
const M2 = "Instantaneous rate is the slope of the <strong>tangent</strong> at that moment, not an average from the start.";
const M3 = "In N₂ + 3H₂ → 2NH₃, H₂ is used 3 times as fast as N₂, and NH₃ forms twice as fast as N₂ is used.";
const M4 = "As reactants are used up, collisions get rarer and the rate falls.";
const M5 = "Change only the factor you’re testing; otherwise you can’t tell which change caused the effect.";
const M6 = "The same mass cut into smaller pieces exposes far more surface.";
const M7 = "A catalyst speeds the reaction and is still there at the end; the products are the same.";

const T = "<i>t</i>";
const MODEL_TABLE = '<strong>Model data</strong> for A → products: <span class="nw"><i>t</i> (s): 0, 10, 20, 30, 40, 50, 60;</span> <span class="nw">[A] (mol/L): 0.900, 0.625, 0.400, 0.225, 0.100, 0.025, 0.000</span>';

// Activity 1 (plan): [situation, box, feedback if misplaced]
const BOXES = [
  { id:"temp", label:"Temperature" }, { id:"conc", label:"Concentration" }, { id:"surf", label:"Surface area" },
  { id:"cat", label:"Catalyst" }, { id:"nat", label:"Nature of reactants" }
];
const SITS = [
  ["Milk keeps longer in the fridge", "temp", "Cold slows spoiling reactions."],
  ["Sawdust catches fire more easily than a log", "surf", "Same wood, more exposed surface. " + M6],
  ["A catalytic converter cleans exhaust gases", "cat", "Speeds reactions without being used up. " + M7],
  ["Steel wool glows brighter in pure oxygen than in air", "conc", "More O₂ particles per volume."],
  ["Sodium reacts with water far faster than magnesium does", "nat", "Different substances react at different rates."],
  ["Chewing food well speeds digestion", "surf", "Smaller pieces of food expose more surface to digestive juices."],
  ["Laundry enzymes clean stains in cold water", "cat", "Enzymes are biological catalysts."],
  ["A pressure cooker cooks food faster", "temp", "Water boils at a higher temperature under pressure."],
  ["Stronger vinegar dissolves eggshell faster", "conc", "Stronger vinegar has more acid particles per volume."],
  ["Zinc reacts with dilute acid; copper doesn’t", "nat", "Copper is less reactive."]
];
const LBL = {}; BOXES.forEach(b => { LBL[b.id] = b.label; });
const SORT_ITEMS = SITS.map((s, i) => {
  const wrong = {}; BOXES.forEach(b => { if (b.id !== s[1]) wrong[b.id] = s[2]; });
  return { id:"f" + (i + 1), t:s[0], answer:s[1], why:s[2], wrong,
    hints:["What is different between the two cases?", "Is it heat, crowding, exposed surface, a helper substance or the substance itself?", "It’s " + LBL[s[1]].toLowerCase() + "."] };
});

export default {
  id:"29-rate-of-reaction",
  kind:"topic",
  title:"Rate of reaction",
  topic:"Rate of Reaction",
  readyTopic:"rates of reaction",
  hero:{
    eq:'<span class="rr-eq"><span class="nw">rate = −Δ[reactant] ÷ Δ<i>t</i></span> <span class="nw">= Δ[product] ÷ Δ<i>t</i></span></span>', eqSize:"sm",
    eqLabel:"rate equals minus the change in reactant concentration divided by the change in time, which equals the change in product concentration divided by the change in time",
    headline:"How fast, and what changes it?",
    text:"Some reactions finish in a flash; others take years. The <strong>rate of reaction</strong> measures how quickly reactants turn into products. It’s the slope of a graph over time. <strong>Temperature</strong>, <strong>concentration</strong>, <strong>surface area</strong>, a <strong>catalyst</strong> and the <strong>nature of the reactants</strong> all change it.",
    fig:{ html:'<div class="rr-hx"><div class="rr-hx-row"><svg class="rr-hx-fl" id="rr-hx-fl" viewBox="0 0 260 230" role="img" aria-label="Two flasks of the same acid. A marble chip drops into the left flask and the same mass of marble powder into the right one. Bubbles of carbon dioxide rise; the powder flask fizzes far faster."></svg><svg class="rr-hx-gr" id="rr-hx-gr" viewBox="0 0 380 250" role="img" aria-label="Volume of carbon dioxide against time for both flasks (model data). The powder curve is steeper and levels off sooner, at the same final volume of 60 mL. Tangents at 10 s have slopes of about 2.2 mL/s for the powder and 1.0 mL/s for the chip."></svg></div><div class="rr-hx-foot"><p class="rr-hx-cap" id="rr-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="rr-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can calculate average rates of reaction from tables and graphs, with correct units.",
    "I can describe how temperature, concentration, surface area, catalysts and the nature of the reactants affect rate.",
    "I can tell average from instantaneous rate and find an instantaneous rate from a tangent.",
    "I can relate the rates of different species using the balanced equation.",
    "I can design a fair test of one factor and interpret its results.",
    "I can apply rate ideas to real situations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Slope", goal:1,
          prompt:"What is the slope of the line through (0, 10) and (5, 0)?",
          options:[
            { t:"−2", ok:true, why:"(0 − 10) ÷ (5 − 0)." },
            { t:"2", why:"The line falls." },
            { t:"−0.5", why:"Rise ÷ run." },
            { t:"10", why:"That’s the intercept." }],
          hints:["Slope = Δ<i>y</i> ÷ Δ<i>x</i>.", "−10 ÷ 5.", "−2."] },
        { id:"w2", skill:"Slope", goal:3,
          prompt:"On a distance–time graph, the slope of the tangent at one moment gives…",
          options:[
            { t:"the instantaneous speed", ok:true, why:"A tangent touches at one point, so its slope is the rate right then." },
            { t:"the average speed since the start", why:"That’s a secant from the origin." },
            { t:"the total distance", why:"That’s a height on the graph, not a slope." },
            { t:"the time taken", why:"Slope is change per time." }],
          hints:["A tangent touches at one point.", "It shows the rate right then.", "Instantaneous speed."] },
        { id:"w3", skill:"Concentration", goal:1,
          prompt:"0.50 mol of solute is dissolved to make 2.0 L of solution. What is the concentration?",
          options:[
            { t:"0.25 mol/L", ok:true, why:"0.50 ÷ 2.0." },
            { t:"1.0 mol/L", why:"That multiplies." },
            { t:"4.0 mol/L", why:"That’s 2.0 ÷ 0.50." },
            { t:"0.50 mol/L", why:"Divide by the volume." }],
          hints:["<i>c</i> = <i>n</i> ÷ <i>V</i>.", "0.50 ÷ 2.0.", "0.25 mol/L."] },
        { id:"w4", skill:"Concentration", goal:2,
          prompt:"Water is added to a solution until its volume doubles. The concentration…",
          options:[
            { t:"halves", ok:true, why:"Same moles, twice the volume." },
            { t:"doubles", why:"More volume dilutes it." },
            { t:"stays the same", why:"The particles spread out." },
            { t:"becomes zero", why:"The solute is still there." }],
          hints:["Moles don’t change.", "<i>c</i> = <i>n</i> ÷ <i>V</i>, with <i>V</i> doubled.", "Half."] },
        { id:"w5", skill:"Variables", goal:5,
          prompt:"A student tests how temperature affects the rate of a reaction. The independent variable is…",
          options:[
            { t:"temperature", ok:true, why:"It’s the one the student changes." },
            { t:"reaction rate", why:"That’s the dependent variable." },
            { t:"the mass of reactant", why:"That’s kept the same." },
            { t:"the time of day", why:"Not part of the test." }],
          hints:["Which variable does the student choose to change?", "The one in the question.", "Temperature."] },
        { id:"w6", skill:"Variables", goal:5,
          prompt:"Testing how acid concentration affects the rate with marble chips, which must be <strong>controlled</strong>?",
          options:[
            { t:"The mass and size of the chips, and the temperature", ok:true, why:"Each of these could also change the rate, so keep them the same." },
            { t:"The acid concentration", why:"That’s the independent variable." },
            { t:"The rate", why:"That’s what’s measured." },
            { t:"Nothing; any chips will do", why:M5 }],
          hints:["What else could change the rate?", "Chip size and temperature.", "Keep them the same."] }
      ],
      refreshers:{
        "Slope":"Slope = rise ÷ run = Δ<i>y</i> ÷ Δ<i>x</i>; a falling line has a negative slope.",
        "Concentration":"<i>c</i> = <i>n</i> ÷ <i>V</i> in mol/L. Diluting increases <i>V</i>, so <i>c</i> falls.",
        "Variables":"The independent variable is the one you change; the dependent variable is the one you measure; controlled variables are kept the same."
      }
    }
  },
  explore:{
    heading:"Reaction rate lab",
    intro:"Read rates from graphs, then run your own experiments.",
    how:"Choose a mode. <strong>Data:</strong> pick a graph and a tool, then drag the points (or tap one and use the arrow keys; Shift + arrows turn the tangent). <strong>Experiment</strong> and <strong>Catalyst and nature:</strong> choose the settings, then press <strong>Run</strong>.",
    modes:[{ id:"data", t:"Data" }, { id:"exp", t:"Experiment" }, { id:"cat", t:"Catalyst and nature" }],
    predictions:[
      { id:"p1", prompt:"Data mode, concentration graph. [A] goes down over time. How is the rate of reaction reported?",
        options:[{ t:"as a positive number, −Δ[A] ÷ Δ<i>t</i>", ok:true }, { t:"as a negative number" }, { t:"as zero, since [A] ends at 0" }, { t:"as Δ<i>t</i> ÷ Δ[A]" }],
        explain:"The minus sign turns a falling concentration into a positive rate. " + M1 },
      { id:"p2", prompt:"Data mode. Compare the average rates over 0–20 s, 20–40 s and 40–60 s.",
        options:[{ t:"they decrease", ok:true }, { t:"they’re equal" }, { t:"they increase" }, { t:"they decrease, then increase" }],
        explain:"As A is used up, the reaction slows. " + M4 },
      { id:"p3", prompt:"Experiment mode, standard run done. Same mass of CaCO₃, but as powder. The rate will be…",
        options:[{ t:"much faster", ok:true }, { t:"the same" }, { t:"slower" }, { t:"faster, but less gas overall" }],
        explain:"Powder exposes far more surface for acid particles to hit. " + M6 },
      { id:"p4", prompt:"Experiment mode. Raise the temperature from 20 °C to 30 °C, changing nothing else. The time to collect 60 mL becomes about…",
        options:[{ t:"15 s", ok:true }, { t:"30 s" }, { t:"60 s" }, { t:"20 s" }],
        explain:"In this model (and as a rough rule for many reactions), +10 °C about doubles the rate. Module 30 explains why." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Data mode: set a tangent at " + T + " = 20 s and enter the instantaneous rate.",
        why:"The tangent at 20 s passes through (10 s, 0.600) and (30 s, 0.200): slope −0.400 ÷ 20 = −0.020 mol/(L·s), so the rate is 0.020 mol/(L·s).",
        hints:["The tangent touches the curve only at 20 s.", "The true tangent passes through (10 s, 0.600) and (30 s, 0.200).", "0.400 ÷ 20 = 0.020 mol/(L·s)."] },
      { id:"tc2", goal:5, prompt:"Experiment mode: design a fair test of temperature with at least three runs.",
        why:"Only the temperature changed between runs, so any change in time comes from temperature. Acid concentration and chip size were controlled.",
        hints:["Pick a concentration and chip size and keep them.", "Change only the temperature: 10, 20, 30 °C, for example.", "Name the controls: acid concentration and chip size."] },
      { id:"tc3", goal:2, stretch:true, prompt:"From the standard run (1.00 mol/L, large chips, 20 °C), make the reaction exactly <strong>8 times</strong> as fast by changing <strong>exactly two</strong> settings.",
        why:"×2 from the concentration (or the chip size) and ×4 from 40 °C: 2.0 mL/s × 8 = 16.0 mL/s.",
        hints:["List each setting’s factor: concentration ×2; small chips ×2; each +10 °C ×2.", "You need ×8 = ×2 × ×4. Which single change gives ×4?", "40 °C gives ×4; pair it with ×2 from concentration or chip size."] }
    ],
    blocks:[
      { title:"About this model", html:'<p>The lab runs on fixed rules (model data), so every run with the same settings gives the same result.</p><div class="tbl-wrap"><table class="rr-tbl"><thead><tr><th scope="col">Setting</th><th scope="col">Model</th></tr></thead><tbody>' +
        "<tr><td>Model concentration</td><td>[A] = 0.900 − 0.030" + T + " + 0.00025" + T + "² mol/L for 0 ≤ " + T + " ≤ 60 s. Instantaneous rate 0.030 − 0.0005" + T + " mol/(L·s).</td></tr>" +
        "<tr><td>Model gas volume</td><td><i>V</i> = 4" + T + " − " + T + "² ÷ 30 mL (0–60 s), reaching 120 mL. Instantaneous rate 4 − " + T + " ÷ 15 mL/s.</td></tr>" +
        "<tr><td>Experiment mode</td><td>CO₂ rate = 2.0 mL/s × (<i>c</i> ÷ 1.00) × size factor (large 1, small 2, powder 8) × 2<sup>(<i>T</i> − 20) ÷ 10</sup>. Time to collect 60 mL = 60 ÷ rate. Standard run: 1.00 mol/L, large chips, 20 °C gives 2.0 mL/s and 30 s.</td></tr>" +
        "<tr><td>Catalyst mode</td><td>O₂ from 3% H₂O₂: no catalyst 0.1 mL/s; potato slice (catalase) 2.0 mL/s; MnO₂ 4.0 mL/s.</td></tr>" +
        "<tr><td>Nature mode</td><td>H₂ from 1.00 mol/L HCl at 20 °C: Mg 3.0 mL/s; Zn 0.5 mL/s; Cu 0 (no reaction).</td></tr></tbody></table></div>" +
        "<p><strong>Two simplifications.</strong> “+10 °C doubles the rate” is a rule of this model; module 30 shows the real reason, and that the factor varies from reaction to reaction. The model also treats the starting rate as steady for the first 60 mL, which keeps the numbers clean; in a real flask the rate falls as the acid is used up.</p>" }
    ]
  },
  part3:{
    slug:"graphs", name:"Read the rate", heading:"Read the rate",
    intro:"Explore measured rates; here you interpret them. Three stations: one reaction with many rates, the units each measurement gives, and a mass-loss graph. Each has a “Check it with data” panel.",
    s1:{ title:"Station 1: One reaction, many rates",
      intro:"Choose an equation card, then set how fast the last product forms. The gauges show every species’ rate.",
      data:"At 0.10 mol/(L·s) of NH₃, N₂ is used at 0.050 and H₂ at 0.15 mol/(L·s). Divide each rate by its coefficient and you get the same number for every species: 0.050." },
    s2:{ title:"Station 2: Units",
      intro:"Choose the unit each measurement gives.",
      rows:[
        { id:"u1", t:"Gas syringe (volume of gas)", answer:"mlps", why:"Volume per time." },
        { id:"u2", t:"Balance (mass loss)", answer:"gps", why:"Mass per time." },
        { id:"u3", t:"Spectrometer (concentration)", answer:"mols", why:"Concentration per time." },
        { id:"u4", t:"Stopwatch to a colour change", answer:"inv", why:"1 ÷ time gives a relative rate: a shorter time means a faster reaction." }],
      units:[{ id:"mlps", t:"mL/s" }, { id:"gps", t:"g/s" }, { id:"mols", t:"mol/(L·s)" }, { id:"inv", t:"1 ÷ time (s⁻¹)" }],
      data:"Every rate is “how much changed” ÷ “how long it took”. The unit is the measurement’s unit divided by seconds." },
    s3:{ title:"Station 3: Mass-loss graph",
      intro:"An open flask of acid and marble chips sits on a balance. The mass falls as CO₂ escapes: 150.00 g at 0 s, 149.56 g at 20 s, 149.12 g at 40 s.",
      uses:"CO₂ = 44.0 g/mol",
      items:[
        { id:"m1", prompt:"Average rate of mass loss over 0–40 s:", unit:"g/s", answer:0.022, display:"0.022 g/s",
          wrong:[{ match:-0.022, fb:M1 + " The flask lost 0.88 g." }, { match:0.88, fb:"Divide by Δ<i>t</i> = 40 s." }, { match:0.044, fb:"Over 0–40 s, Δ<i>t</i> is 40 s." }],
          fb:"Mass lost ÷ time: (150.00 − 149.12) ÷ 40." },
        { id:"m2", prompt:"The same rate in moles of CO₂ per second:", unit:"mol/s", answer:0.0005, display:"5.0 × 10⁻⁴ mol/s",
          wrong:[{ match:0.022, fb:"That’s g/s; divide by 44.0." }, { match:0.02, fb:"0.88 ÷ 44.0 = 0.020 mol in <strong>40 s</strong>." }, { match:0.968, fb:"Divide by the molar mass; don’t multiply." }],
          fb:"Change g/s to mol/s: divide by 44.0 g/mol." }],
      data:"0.88 g ÷ 40 s = 0.022 g/s, and 0.022 g/s ÷ 44.0 g/mol = 5.0 × 10⁻⁴ mol/s. The mass that leaves is the CO₂ that forms." },
    quickCheck:{
      title:"Quick check", summary:"Read the rate quick check",
      items:[
        { id:"q1", goal:4, prompt:"2H₂O₂ → 2H₂O + O₂. H₂O₂ is used at 0.040 mol/(L·s). O₂ forms at…",
          choices:[
            { t:"0.020", ok:true, fb:"Right. One O₂ per two H₂O₂: 0.040 ÷ 2 = 0.020 mol/(L·s)." },
            { t:"0.040", fb:"One O₂ per two H₂O₂." },
            { t:"0.080", fb:"One O₂ per two H₂O₂." },
            { t:"0.010", fb:"One O₂ per two H₂O₂." }] },
        { id:"q2", goal:1, prompt:"Which unit fits a gas syringe experiment?",
          choices:[
            { t:"mL/s", ok:true, fb:"Right. Volume per time." },
            { t:"g/s", fb:"Volume per time." },
            { t:"mol/L", fb:"Volume per time." },
            { t:"s/mL", fb:"Volume per time." }] },
        { id:"q3", goal:1, prompt:"On a mass-loss graph, a steeper slope means…",
          choices:[
            { t:"a faster reaction", ok:true, fb:"Right. Rate is the slope." },
            { t:"a slower reaction", fb:"Rate is the slope." },
            { t:"more total gas", fb:"Rate is the slope." },
            { t:"a colder flask", fb:"Rate is the slope." }] },
        { id:"q4", goal:5, prompt:"<strong>Investigation:</strong> The flask’s mass stops falling at 148.68 g. Best inference?",
          choices:[
            { t:"the reaction has finished (a reactant is used up)", ok:true, fb:"Right. No more CO₂ escaping means no more reaction." },
            { t:"the balance broke", fb:"No more CO₂ escaping means no more reaction." },
            { t:"CO₂ stopped being a gas", fb:"No more CO₂ escaping means no more reaction." },
            { t:"the acid evaporated", fb:"No more CO₂ escaping means no more reaction." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"factor", type:"sorter", title:"Which factor?", summary:"Which factor?", goal:[2, 6], noun:"situation", txt:true,
        instruction:"Tap a situation, then tap the factor that explains it.",
        boxes:BOXES, items:SORT_ITEMS },
      { id:"calc", type:"numeric", title:"Rate calculations", summary:"Rate calculations", goal:[1, 3, 4, 6],
        instruction:"Six calculations. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number, then press Check. The unit is shown after the box; for powers of ten, type 5.0e-4 or 5.0×10^-4.",
        items:[
          { id:"r1", goal:1, prompt:"Average rate of A’s use from 0 to 20 s.", use:MODEL_TABLE, answer:0.025, unit:"mol/(L·s)", display:"0.025 mol/(L·s)",
            why:"−(0.400 − 0.900) ÷ 20 = 0.025 mol/(L·s).",
            wrong:[{ match:-0.025, fb:M1 }, { match:0.5, fb:"Divide by Δ<i>t</i>." }],
            hints:["Average rate = −Δ[A] ÷ Δ<i>t</i>.", "Δ[A] = 0.400 − 0.900 = −0.500 mol/L over 20 s.", "0.500 ÷ 20 = 0.025 mol/(L·s)."] },
          { id:"r2", goal:1, prompt:"A syringe collects 90 mL of gas in the first 30 s. Average rate?", answer:3, unit:"mL/s", display:"3.0 mL/s",
            why:"90 mL ÷ 30 s.",
            wrong:[{ match:0.33, fb:"mL ÷ s, not s ÷ mL." }, { match:0.333, fb:"mL ÷ s, not s ÷ mL." }, { match:0.3333, fb:"mL ÷ s, not s ÷ mL." }],
            hints:["Rate = volume ÷ time.", "90 mL ÷ 30 s.", "3.0 mL/s."] },
          { id:"r3", goal:4, star:true, prompt:"2NO(g) + O₂(g) → 2NO₂(g). NO₂ forms at 0.050 mol/(L·s). Rate of O₂ use?", answer:0.025, unit:"mol/(L·s)", display:"0.025 mol/(L·s)",
            why:"One O₂ is used for every two NO₂ formed: 0.050 ÷ 2.",
            wrong:[{ match:0.05, fb:M3 }, { match:0.1, fb:M3 }],
            hints:["Compare coefficients: O₂ 1, NO₂ 2.", "O₂ is used at half the rate NO₂ forms.", "0.050 ÷ 2 = 0.025 mol/(L·s)."] },
          { id:"r4", goal:3, star:true, prompt:"A tangent drawn at " + T + " = 20 s passes through (10 s, 0.600 mol/L) and (30 s, 0.200 mol/L). Instantaneous rate at 20 s?", use:MODEL_TABLE, answer:0.02, unit:"mol/(L·s)", display:"0.020 mol/(L·s)",
            why:"Tangent slope (0.200 − 0.600) ÷ (30 − 10) = −0.020, so the rate is 0.020 mol/(L·s).",
            wrong:[{ match:0.025, fb:"That’s an average from 0. " + M2 }, { match:-0.02, fb:M1 }],
            hints:["Instantaneous rate is the tangent’s slope, reported as a positive number.", "Slope = (0.200 − 0.600) ÷ (30 − 10) = −0.400 ÷ 20.", "0.020 mol/(L·s)."] },
          { id:"r5", goal:6, star:true, prompt:"Experiment model: the standard run takes 30 s to collect 60 mL. How long at 2.00 mol/L and 40 °C with the same large chips?", answer:3.75, tol:0.001, unit:"s", display:"3.75 s",
            why:"×2 × ×4 = ×8: 16 mL/s, and 60 ÷ 16 = 3.75 s.",
            wrong:[{ match:15, fb:"Two changes: ×2 and ×4." }, { match:7.5, fb:"Concentration doubles it too." }],
            hints:["Find each factor: 2.00 mol/L gives ×2; 40 °C gives ×4.", "Rate = 2.0 × 2 × 4 = 16 mL/s.", "60 ÷ 16 = 3.75 s."] },
          { id:"r6", goal:1, star:true, prompt:"A flask loses 0.88 g of CO₂ in 40 s. Average rate in mol/s? (CO₂ = 44.0 g/mol)", answer:0.0005, tol:0.00001, unit:"mol/s", display:"5.0 × 10⁻⁴ mol/s",
            why:"0.88 ÷ 40 = 0.022 g/s, and 0.022 ÷ 44.0 = 0.00050 mol/s.",
            wrong:[{ match:0.022, fb:"That’s g/s; divide by 44.0." }, { match:0.02, fb:"0.88 ÷ 44.0 = 0.020 mol in <strong>40 s</strong>." }],
            hints:["Rate in g/s first: 0.88 ÷ 40.", "0.022 g/s.", "0.022 ÷ 44.0 = 0.00050 mol/s."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Petra", goal:[1, 4, 5],
        instruction:"Petra made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the average rate of A’s use over the first 20 s.",
            steps:["[A] falls from 0.900 to 0.400 mol/L in 20 s.", "Δ[A] = 0.400 − 0.900 = −0.500 mol/L.", "Rate = Δ[A] ÷ Δ<i>t</i> = −0.500 ÷ 20 = −0.025 mol/(L·s).", "So the reaction has a negative rate."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"For a reactant, rate = −Δ[A] ÷ Δ<i>t</i> = +0.025 mol/(L·s).", ok:true, why:M1 },
              { t:"Rate = Δ<i>t</i> ÷ Δ[A] = −40.", why:"Rate is change per time." },
              { t:"Use Δ<i>t</i> = 40 s.", why:"The interval is 20 s." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Can a rate be negative?", "Reactant rates use a minus sign.", "+0.025."] },
          { id:"e2", goal:4, task:"N₂ + 3H₂ → 2NH₃. NH₃ forms at 0.10 mol/(L·s). How fast is H₂ used?",
            steps:["The coefficients are 1, 3 and 2.", "H₂ has the biggest coefficient, so divide by 3: 0.10 ÷ 3 = 0.033 mol/(L·s).", "So H₂ is used more slowly than NH₃ forms."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2."],
            fixes:[
              { t:"3 mol H₂ per 2 mol NH₃: 0.10 × 3/2 = 0.15 mol/(L·s).", ok:true, why:"H₂ is used 3/2 times as fast as NH₃ forms." },
              { t:"0.10 × 3 = 0.30.", why:"Divide by NH₃’s coefficient, 2, too." },
              { t:"Rates are equal for all species: 0.10.", why:M3 },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Ratio of H₂ to NH₃?", "3 : 2.", "0.15."] },
          { id:"e3", goal:5, task:"Test how temperature affects the rate of marble chips + acid.",
            steps:["Run 1: 1.00 mol/L acid, large chips, 20 °C. 60 mL took 30 s.", "Run 2: 2.00 mol/L acid, large chips, 30 °C.", "60 mL took 7.5 s: four times as fast.", "So a 10 °C rise makes this reaction four times as fast."],
            answer:1,
            stepFb:["Step 1 is a sound baseline.", "", "The timing is fine; the design isn’t.", "This conclusion depends on step 2."],
            fixes:[
              { t:"Keep the acid at 1.00 mol/L and change only the temperature.", ok:true, why:M5 },
              { t:"Use powder in run 2 as well.", why:"That adds another change. " + M5 },
              { t:"Run it at 40 °C instead.", why:"Still two changes." },
              { t:"Step 2 is correct.", why:M5 }],
            hints:["How many settings changed between runs?", "Two: concentration and temperature.", "Change only one."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the lab: how much powder sped things up, or how the rate fell during the reaction?" },
      { id:"j2", q:"In your own words, explain the difference between an average and an instantaneous rate." },
      { id:"j3", q:"Explain to a friend how to design a fair test of one factor." },
      { id:"j4", q:"Which part is still shaky: units, coefficients or tangents? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which unit fits a rate measured as a change in concentration?", options:[
          { t:"mol/(L·s)", ok:true, why:"Concentration (mol/L) per second." },
          { t:"mol/L", why:"That’s a concentration, not a rate." },
          { t:"L/(mol·s)", why:"Inverted." },
          { t:"s/mol", why:"Time per amount is inverted." }] },
        b:{ prompt:"Which unit fits a rate measured with a gas syringe?", options:[
          { t:"mL/s", ok:true, why:"Volume per second." },
          { t:"mL", why:"That’s a volume." },
          { t:"s/mL", why:"Inverted." },
          { t:"mol/L", why:"That’s a concentration." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"For marble chips in acid, which change does <strong>not</strong> increase the rate?", options:[
          { t:"Using larger chips of the same total mass", ok:true, why:"Less surface exposed. " + M6 },
          { t:"Grinding the chips to powder", why:"That increases surface area." },
          { t:"Warming the acid", why:"That increases the rate." },
          { t:"Using more concentrated acid", why:"That increases the rate." }] },
        b:{ prompt:"Which change increases the rate of hydrogen peroxide decomposition, and is still present unchanged afterwards?", options:[
          { t:"Adding a pinch of manganese(IV) oxide", ok:true, why:"A catalyst. " + M7 },
          { t:"Adding water", why:"Dilution slows it." },
          { t:"Cooling the solution", why:"Cooling slows it." },
          { t:"Removing the oxygen produced", why:"That doesn’t change the forward rate." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The instantaneous rate at a given time is the slope of…", options:[
          { t:"the tangent to the curve at that time", ok:true, why:"A tangent touches the curve at that one moment." },
          { t:"the secant from the start to that time", why:M2 },
          { t:"the line from the origin to the final point", why:M2 },
          { t:"the curve’s highest point", why:"Rate is a slope, not a height." }] },
        b:{ prompt:"The average rate over an interval is the slope of…", options:[
          { t:"the secant joining the two ends of the interval", ok:true, why:"An average uses the change over the whole interval." },
          { t:"the tangent at the start", why:"A tangent gives an instantaneous rate, not an average." },
          { t:"the tangent at the end", why:"A tangent gives an instantaneous rate, not an average." },
          { t:"the <i>y</i>-axis", why:"Not a slope." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"Model data: [A] = 0.400 mol/L at 20 s and 0.100 mol/L at 40 s. Average rate of A’s use over 20–40 s?", options:[
          { t:"0.015 mol/(L·s)", ok:true, why:"0.300 ÷ 20." },
          { t:"0.300 mol/(L·s)", why:"Divide by Δ<i>t</i>." },
          { t:"−0.015 mol/(L·s)", why:M1 },
          { t:"0.0075 mol/(L·s)", why:"The interval is 20 s, not 40 s." }] },
        b:{ prompt:"Model data: [A] = 0.900 mol/L at 0 s and 0.100 mol/L at 40 s. Average rate over 0–40 s?", options:[
          { t:"0.020 mol/(L·s)", ok:true, why:"0.800 ÷ 40." },
          { t:"0.800 mol/(L·s)", why:"Divide by Δ<i>t</i>." },
          { t:"−0.020 mol/(L·s)", why:M1 },
          { t:"0.040 mol/(L·s)", why:"The interval is 40 s." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"2H₂O₂(aq) → 2H₂O(l) + O₂(g). H₂O₂ is used at 0.060 mol/(L·s). At what rate does O₂ form?", options:[
          { t:"0.030 mol/(L·s)", ok:true, why:"1 O₂ per 2 H₂O₂." },
          { t:"0.060 mol/(L·s)", why:"The coefficients differ. 1 O₂ forms per 2 H₂O₂ used." },
          { t:"0.120 mol/(L·s)", why:"Multiplied instead of divided." },
          { t:"0.020 mol/(L·s)", why:"The ratio is 1 : 2, not 1 : 3." }] },
        b:{ prompt:"N₂(g) + 3H₂(g) → 2NH₃(g). N₂ is used at 0.020 mol/(L·s). At what rate does NH₃ form?", options:[
          { t:"0.040 mol/(L·s)", ok:true, why:"2 NH₃ per N₂." },
          { t:"0.020 mol/(L·s)", why:M3 },
          { t:"0.010 mol/(L·s)", why:"Divided instead of multiplied. " + M3 },
          { t:"0.060 mol/(L·s)", why:"That’s H₂’s rate." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"On the model concentration graph, the tangent at 40 s passes through (30 s, 0.200 mol/L) and (50 s, 0.000 mol/L). Instantaneous rate at 40 s?", options:[
          { t:"0.010 mol/(L·s)", ok:true, why:"0.200 ÷ 20." },
          { t:"0.005 mol/(L·s)", why:"That’s the secant from 40 to 60 s. " + M2 },
          { t:"0.0025 mol/(L·s)", why:"[A] ÷ <i>t</i> isn’t a slope. " + M2 },
          { t:"0.020 mol/(L·s)", why:"That’s the rate at 20 s." }] },
        b:{ prompt:"On the gas graph, the tangent at 15 s passes through (5 s, 22.5 mL) and (25 s, 82.5 mL). Instantaneous rate at 15 s?", options:[
          { t:"3.0 mL/s", ok:true, why:"60.0 ÷ 20." },
          { t:"3.5 mL/s", why:"52.5 ÷ 15 is the average since the start. " + M2 },
          { t:"4.0 mL/s", why:"That’s the starting rate." },
          { t:"60 mL/s", why:"Divide by the 20 s run." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why a reaction slows down as it proceeds?", options:[
          { t:"“Reactants are used up, so their concentration falls and reacting particles meet less often.”", ok:true, why:M4 },
          { t:"“The products block the reaction.”", why:"Not generally." },
          { t:"“The reaction gets tired.”", why:"Particles don’t tire." },
          { t:"“Rates are always constant; it only looks slower.”", why:M4 }] },
        b:{ prompt:"Which is the best explanation of why powdered marble reacts faster than chips of the same mass?", options:[
          { t:"“Powder exposes much more surface, so many more acid particles can reach the solid at once.”", ok:true, why:M6 },
          { t:"“Powder contains more CaCO₃.”", why:"Same mass, same amount. " + M6 },
          { t:"“Powder is hotter.”", why:"Same temperature." },
          { t:"“Powder is a catalyst.”", why:"Powder is a reactant, and it gets used up. " + M7 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which plan is a fair test of how acid concentration affects the rate?", options:[
          { t:"“Same chip mass and size, same temperature, same acid volume; change only the acid concentration and time how long 60 mL of gas takes.”", ok:true, why:"Only one variable changes, and the rest are controlled." },
          { t:"“Change concentration and temperature together to see a bigger effect.”", why:M5 },
          { t:"“Use chips for one run and powder for another.”", why:M5 },
          { t:"“Use whatever chips are available each time.”", why:M5 }] },
        b:{ prompt:"In two runs, a student changed both the temperature and the concentration, and the rate quadrupled. Which conclusion is best supported?", options:[
          { t:"“No conclusion about either factor alone can be drawn, because two variables changed.”", ok:true, why:M5 },
          { t:"“Temperature caused the whole increase.”", why:M5 },
          { t:"“Concentration caused the whole increase.”", why:M5 },
          { t:"“Each factor doubled the rate.”", why:"Plausible, but these data can’t show it." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Experiment model: the standard run (1.00 mol/L, large chips, 20 °C) takes 30 s to collect 60 mL. How long at 40 °C with everything else the same?", options:[
          { t:"7.5 s", ok:true, why:"+20 °C gives ×4." },
          { t:"15 s", why:"That’s +10 °C." },
          { t:"120 s", why:"Warmer is faster." },
          { t:"60 s", why:"Warmer is faster." }] },
        b:{ prompt:"Same model: how long with 0.50 mol/L acid at 30 °C and large chips?", options:[
          { t:"30 s", ok:true, why:"×½ × ×2 = ×1." },
          { t:"15 s", why:"Halving the concentration cancels the warming." },
          { t:"60 s", why:"The warming helps too." },
          { t:"7.5 s", why:"That’s ×4." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Why do some medicines carry the label “store in the refrigerator”?", options:[
          { t:"Lower temperature slows the reactions that break the medicine down", ok:true, why:"Cold slows decomposition, so the medicine lasts longer." },
          { t:"Cold makes the medicine stronger", why:"It slows decomposition; the medicine doesn’t get stronger." },
          { t:"Cold stops all chemical reactions", why:"It slows them." },
          { t:"Refrigerators remove oxygen", why:"They don’t." }] },
        b:{ prompt:"Why can laundry detergents with enzymes clean well in cold water?", options:[
          { t:"The enzymes are catalysts that speed up stain-breaking reactions even at low temperature", ok:true, why:"Enzymes are biological catalysts." },
          { t:"The enzymes heat the water", why:"They don’t release significant heat." },
          { t:"Enzymes are used up as fuel", why:M7 },
          { t:"Cold water has more surface area", why:"Surface area belongs to solids." }] } }
    ]
  },
  task:{
    title:"Hit 15 seconds", summary:"Hit 15 seconds",
    statement:"<p>Using the experiment model, choose conditions so that 60 mL of CO₂ is collected in exactly 15 s, while meeting the safety rules. Can you find all the answers?</p><p class=\"tiny muted\">There are 36 combinations of acid concentration, chip size and temperature. Rate = 2.0 mL/s × (<i>c</i> ÷ 1.00) × size factor × 2<sup>(<i>T</i> − 20) ÷ 10</sup> (model data).</p>",
    checks:["60 mL in exactly 15 s", "Temperature at most 30 °C", "No powder (it foams over)", "Acid at most 1.00 mol/L"],
    tips:["15 s for 60 mL means 4.0 mL/s, twice the standard rate.", "You need an overall factor of ×2.", "Each factor: concentration ×½, ×1 or ×2; chips ×1 or ×2; temperature ×½, ×1 or ×2 (up to 30 °C).", "Try one ×2 change, or a ×½ balanced by ×4… but ×4 needs 40 °C."],
    explainPrompt:"Explain how each setting changes the rate, and why your choice gives exactly 15 s.",
    vocab:"Use the words rate, concentration, surface area and temperature.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Three different routes to the same rate. Only one variable at a time changes it in a fair test, but in design you can trade factors against each other."
  },
  cards:[
    ["Rate of reaction", "Change in amount, concentration, mass or volume per unit time; reported as positive"],
    ["Rate from a reactant", "Rate = −Δ[A] ÷ Δ<i>t</i>"],
    ["Units", "mol/(L·s), mL/s, g/s"],
    ["Average rate", "Slope of the secant over an interval"],
    ["Instantaneous rate", "Slope of the tangent at one moment"],
    ["Why rates fall", "Reactants are used up, so particles meet less often"],
    ["Rates and coefficients", "N₂ + 3H₂ → 2NH₃: H₂ used at 3×, NH₃ formed at 2× the rate N₂ is used"],
    ["Temperature", "Higher temperature, faster rate (roughly ×2 per 10 °C for many reactions)"],
    ["Concentration", "More particles per volume, faster rate"],
    ["Surface area", "Smaller pieces of the same mass react faster"],
    ["Catalyst", "Speeds a reaction and is unchanged at the end"],
    ["Fair test", "Change one variable; control the rest; measure the effect"]
  ]
};
