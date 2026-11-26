// SCH4U 50 Faraday's First Law of Electrolysis. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/50-faraday-first-law.md
// Pictures (hero cell, the C10 electrolysis cell with its mass–charge graph, the Part 3 stations, the task preview) are
// drawn by app.js. F, the rounded molar masses and the reduction table come from MV.chem.data (const.F, Mr, E0).

const Q = "<i>Q</i>", I = "<i>I</i>", T = "<i>t</i>", Fv = "<i>F</i>", Z = "<i>z</i>", Mv = "<i>M</i>", m = "<i>m</i>", n = "<i>n</i>";
const USE = Fv + " = 96 500 C/mol; Cu 63.5, Ag 108, Zn 65.4 g/mol.";

// Misconception core sentences (plan §3)
const M1 = "In electrolysis the supply’s positive terminal pulls electrons off the anode, so the anode is positive. Oxidation is still at the anode.";
const M2 = "Each Cu²⁺ needs <strong>2</strong> electrons. Moles of Cu = moles of e⁻ ÷ 2.";
const M3 = "The mass depends only on the charge, " + Q + " = " + I + T + ". Voltage and concentration aren’t in the law.";
const M4 = T + " = " + Q + " ÷ " + I + ". A bigger current means a shorter time.";
const M5 = "Water (−0.83 V) is reduced before Al³⁺ (−1.66 V) or Na⁺ (−2.71 V), so H₂ forms instead.";
const M6 = "The copper anode is oxidized (Cu → Cu²⁺ + 2e⁻) and dissolves; ideally it loses exactly what the cathode gains.";
const M7 = "Efficiency = actual ÷ theoretical × 100%. Side reactions waste charge, so it’s at most 100%.";

const SORT_DEF = "Ask: does it run by itself, or is it forced?";
const sortItem = (id, t, answer, why, wrong) => ({ id, t, answer, why, hints:["Spontaneous or forced?", "Which way does energy flow?", why], ...(wrong ? { wrong } : {}) });

export default {
  id:"50-faraday-first-law",
  kind:"topic",
  title:"Faraday’s first law",
  topic:"Faraday’s First Law of Electrolysis",
  readyTopic:"Faraday’s first law",
  hero:{
    eq:m + " = (" + Mv + " × " + I + " × " + T + ") ÷ (" + Z + " × " + Fv + ")", eqSize:"md",
    eqLabel:"m equals M times I times t, divided by z times F",
    headline:"Count the electrons, weigh the metal",
    text:"In <strong>electrolysis</strong>, a power supply forces electrons onto the <strong>cathode</strong>, where metal ions are reduced and plate out. Every mole of electrons carries 96 500 C, the <strong>Faraday constant</strong>. So the <strong>charge</strong> you pass decides exactly how much metal you get: twice the charge, twice the metal.",
    fig:{ html:'<div class="fl-hx"><svg class="fl-svg" id="fl-hx-svg" viewBox="0 0 440 318" role="img" aria-label="A beaker of blue copper(II) sulfate solution. A copper strip on the left is the anode, marked +, and a key on the right is the cathode, marked −; both are wired to a power supply. Violet electrons stream from the anode through the supply into the key. Orange Cu²⁺ ions drift to the key and become a copper coat while the copper strip thins. A counter reads: charge 1930 C, 0.0200 mol of electrons, 0.0100 mol of copper, 0.635 g."></svg><div class="fl-hx-row"><p class="fl-hx-ctr" id="fl-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="fl-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can compare electrolytic and galvanic cells (energy, spontaneity, electrode signs) and label an electrolytic cell.",
    "I can state Faraday’s first law and predict how changing current or time changes the mass produced.",
    "I can convert between current, time, charge and moles of electrons.",
    "I can calculate the mass, time or current for an electrolysis, including working backwards.",
    "I can predict what forms at the cathode in aqueous electrolysis using the reduction table.",
    "I can apply Faraday’s first law to electroplating, and calculate and explain current efficiency."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Moles and mass", goal:4,
          prompt:"How many moles are in 6.35 g of copper (Cu 63.5 g/mol)?",
          options:[
            { t:"0.100 mol", ok:true, why:"6.35 ÷ 63.5." },
            { t:"10.0 mol", why:"63.5 ÷ 6.35 = 10, but " + n + " = " + m + " ÷ " + Mv + "." },
            { t:"403 mol", why:"That’s 6.35 × 63.5. Divide: " + n + " = " + m + " ÷ " + Mv + "." },
            { t:"0.0500 mol", why:"Charge doesn’t affect moles of atoms." }],
          hints:[n + " = " + m + " ÷ " + Mv + ".", "6.35 ÷ 63.5.", "0.100 mol."] },
        { id:"w2", skill:"Moles and mass", goal:4,
          prompt:"What is the mass of 0.0200 mol of silver (Ag 108 g/mol)?",
          options:[
            { t:"2.16 g", ok:true, why:"0.0200 × 108." },
            { t:"5400 g", why:"That’s 108 ÷ 0.0200. " + m + " = " + n + " × " + Mv + "." },
            { t:"0.000185 g", why:"That’s 0.0200 ÷ 108. " + m + " = " + n + " × " + Mv + "." },
            { t:"1.08 g", why:"Read the moles again." }],
          hints:[m + " = " + n + " × " + Mv + ".", "0.0200 × 108.", "2.16 g."] },
        { id:"w3", skill:"Half-reactions and electrons", goal:3,
          prompt:"How many electrons does one Cu²⁺ ion gain to become Cu?",
          options:[
            { t:"2", ok:true, why:"Cu²⁺ + 2e⁻ → Cu." },
            { t:"1", why:"One ion, but its charge is 2+." },
            { t:"4", why:"The charge is 2+." },
            { t:"0", why:"It must be reduced: ions don’t just “stick”." }],
          hints:["Match the charge.", "2+ needs 2 electrons.", "2."] },
        { id:"w4", skill:"Half-reactions and electrons", goal:3,
          prompt:"How many moles of electrons are needed to make 0.100 mol of Al from Al³⁺?",
          options:[
            { t:"0.300 mol", ok:true, why:"3 e⁻ per Al." },
            { t:"0.100 mol", why:"Each Al³⁺ takes 3." },
            { t:"0.0333 mol", why:"Multiply: electrons are needed per atom." },
            { t:"0.200 mol", why:"Al³⁺ has charge 3+, not 2+." }],
          hints:["Al³⁺ + 3e⁻ → Al.", "3 × 0.100.", "0.300 mol."] },
        { id:"w5", skill:"Cells and signs", goal:1,
          prompt:"In a galvanic cell, what happens at the anode?",
          options:[
            { t:"Oxidation; it’s the negative electrode", ok:true, why:"An Ox; electrons leave from it." },
            { t:"Reduction; it’s negative", why:"Reduction happens at the cathode." },
            { t:"Oxidation; it’s positive", why:"In a galvanic cell the anode is negative." },
            { t:"Nothing; it only carries current", why:"The anode reaction is the oxidation." }],
          hints:["An Ox, Red Cat.", "Electrons leave the anode.", "Oxidation, negative."] },
        { id:"w6", skill:"Cells and signs", goal:1,
          prompt:"A cell’s <i>E</i>°<sub>cell</sub> is −1.10 V. What does that tell you?",
          options:[
            { t:"It won’t run on its own; a supply of at least 1.10 V is needed to drive it", ok:true, why:"Negative means non-spontaneous: the reaction has to be forced." },
            { t:"It runs on its own and gives 1.10 V", why:"Negative means non-spontaneous." },
            { t:"It’s an error: cell potentials can’t be negative", why:"They can, for the reverse direction." },
            { t:"It runs faster than a positive cell", why:"<i>E</i>° says nothing about speed." }],
          hints:["Positive means spontaneous.", "Negative means it must be forced.", "It needs a supply."] }
      ],
      refreshers:{
        "Moles and mass":n + " = " + m + " ÷ " + Mv + " and " + m + " = " + n + " × " + Mv + ". Check that the units cancel to mol or g.",
        "Half-reactions and electrons":"A metal ion with charge " + Z + "+ needs " + Z + " electrons: Ag⁺ 1, Cu²⁺ 2, Al³⁺ 3.",
        "Cells and signs":"Galvanic: spontaneous, anode −. Electrolytic: forced by a supply, anode +. Oxidation is always at the anode."
      }
    }
  },
  explore:{
    heading:"Electrolysis cell",
    intro:"Set the current and the time. Watch the charge add up, and see how much metal plates onto the cathode.",
    how:"Choose a mode and a solution, then set the current and the time. <strong>Run</strong> plays the electrolysis, <strong>Step</strong> adds 965 s, and <strong>Reset</strong> sets the time back to 0 s. Explore assumes 100% current efficiency.",
    modes:[{ id:"plate", t:"Plate it" }, { id:"graph", t:"Graph lab" }, { id:"forms", t:"What forms?" }],
    sols:[
      { id:"cu", t:"CuSO₄(aq), copper anode" },
      { id:"ag", t:"AgNO₃(aq), silver anode" },
      { id:"zn", t:"ZnSO₄(aq), zinc anode" },
      { id:"al", t:"Al₂(SO₄)₃(aq), carbon anode" },
      { id:"na", t:"NaCl(aq), carbon anode" }
    ],
    graphNote:"Graph lab: each <strong>Run</strong> adds a line for the current you set (up to three, same solution). Compare the slopes with the currents.",
    formsNote:"What forms? Choose a solution, predict the cathode product, then press <strong>Run</strong>.",
    predictions:[
      { id:"p1", prompt:"CuSO₄(aq), 1.00 A for 1930 s. Then the current is doubled. What happens to the mass of copper?",
        options:[{ t:"It doubles", ok:true }, { t:"It halves" }, { t:"It stays the same" }, { t:"It quadruples" }],
        explain:Q + " = " + I + T + " doubles, so the moles of electrons and of copper double." },
      { id:"p2", prompt:"Same charge, two ways. Run A: 2.00 A for 965 s. Run B: 1.00 A for 1930 s at a higher voltage. Which deposits more copper?",
        options:[{ t:"The same", ok:true }, { t:"Run A, because the current is bigger" }, { t:"Run B, because the voltage is higher" }, { t:"Run B, because it runs longer" }],
        explain:"Both pass 1930 C. Voltage isn’t in Faraday’s law." },
      { id:"p3", prompt:"CuSO₄(aq) with a copper anode, 2.00 A for 965 s. What happens to the copper anode?",
        options:[{ t:"It loses 0.635 g", ok:true }, { t:"It gains 0.635 g" }, { t:"It doesn’t change" }, { t:"It loses 1.27 g" }],
        explain:"Cu(s) → Cu²⁺(aq) + 2e⁻ at the anode replaces the ions plated at the cathode." },
      { id:"p4", prompt:"What forms? mode: Al₂(SO₄)₃(aq). What forms at the cathode?",
        options:[{ t:"Hydrogen gas", ok:true }, { t:"Aluminium metal" }, { t:"Oxygen gas" }, { t:"Nothing at all" }],
        explain:"Water (−0.83 V) is easier to reduce than Al³⁺ (−1.66 V). That’s why aluminium is made from a molten bath (module 52)." }
    ],
    chalIntro:"Use the cell to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Deposit exactly <strong>0.635 g of copper</strong>.",
        why:"Any " + I + " and " + T + " with " + I + T + " = 1930 C: 0.0200 mol e⁻ → 0.0100 mol Cu → 0.635 g.",
        general:"Use CuSO₄(aq) and set a current and a time.",
        hints:["0.635 g Cu = 0.0100 mol Cu.", "That needs 0.0200 mol e⁻ = 1930 C.", "Any " + I + " and " + T + " with " + I + T + " = 1930 C, e.g. 2.00 A for 965 s."] },
      { id:"tc2", goal:[3, 4], prompt:"Switch to silver. Deposit exactly <strong>1.08 g of silver</strong>.",
        why:I + T + " = 965 C: 0.0100 mol e⁻ → 0.0100 mol Ag → 1.08 g. Each Ag⁺ takes one electron.",
        general:"Use AgNO₃(aq) and set a current and a time.",
        hints:["1.08 g ÷ 108 = 0.0100 mol Ag.", "Ag⁺ + e⁻ → Ag: 0.0100 mol e⁻.", "965 C: 1.00 A for 965 s."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Choose a solution and a current so that exactly <strong>0.100 mol of metal</strong> forms at the cathode in 9650 s.",
        why:"In 9650 s, each 1.00 A passes 0.100 mol e⁻. Ag⁺ needs 1 e⁻ per atom, so 1.00 A; Cu²⁺ and Zn²⁺ need 2, so 2.00 A. Al³⁺ and Na⁺ don’t plate from water.",
        general:"Set the time to 9650 s, then choose a solution and a current.",
        hints:["In 9650 s, each 1.00 A passes 0.100 mol e⁻.", "Moles of metal = moles of e⁻ ÷ " + Z + ".", "Ag⁺ at 1.00 A, or Cu²⁺ or Zn²⁺ at 2.00 A. Al³⁺ and Na⁺ don’t plate from water."] }
    ]
  },
  part3:{
    slug:"plating", name:"Plating", heading:"Electroplating",
    intro:"Plating shops put thin, even coats of silver, copper or zinc on objects, and Faraday’s first law runs every job. Work through a plater’s job sheet: wire the cell, time the job, check the efficiency and deal with the waste.",
    s1:{ title:"Station 1: Wire it right",
      intro:"Silver-plate a ring. Tap the ring or the silver bar, then tap the terminal to connect it to (tap a terminal again to take it off). Choose the solution, then press Check.",
      fb:{ ok:"Right. The ring is the cathode (−): Ag⁺ + e⁻ → Ag coats it. The silver bar is the anode (+): Ag → Ag⁺ + e⁻ dissolves it and replaces the silver ions.",
        rev:"The ring would be the anode and would dissolve. " + M1,
        sol:"Copper ions would plate copper onto the ring, not silver. Use a solution of the plating metal’s ions.",
        empty:"Connect both objects and choose a solution first." } },
    s2:{ title:"Station 2: How long?",
      intro:"The ring needs 2.16 g of silver at 0.500 A. Fill in the chain, then press Check. Answers within 1% are accepted.",
      done:"1930 C ÷ 0.500 A = 3860 s: 1 h 4 min 20 s." },
    s3:{ title:"Station 3: Efficiency",
      intro:"A plating run used 2.00 A for 965 s through CuSO₄(aq). Open <strong>Check it with data</strong> for the measured masses, then work out the efficiency.",
      causesQ:"The actual mass is less than the theory. Which could explain it? Choose every likely cause.",
      causes:[
        { id:"h2", t:"Some current reduced water to H₂", why:"Charge spent making H₂ deposits no copper, so less metal forms than the charge predicts." },
        { id:"rinse", t:"The coat was rinsed off", why:"Loosely held copper that washes away is never weighed." },
        { id:"early", t:"The mass was recorded early", why:"If the cathode was weighed before the run finished, not all of the charge had passed." }],
      causesFb:"All three are likely causes. Each one makes the measured mass smaller than the theoretical mass." },
    s4:{ title:"Station 4: The plating shop and the environment",
      html:"<p>Plating baths can contain toxic metal compounds, so waste rinse water must be treated before it is released. Newer processes replace the most hazardous baths.</p>",
      q:"Choose one practice that reduces harm.",
      opts:[
        { id:"recover", t:"Recover metal from the rinse water", why:"The metal is collected and reused instead of going down the drain." },
        { id:"loop", t:"Use closed-loop rinsing", why:"The same rinse water is cleaned and reused, so far less waste water leaves the shop." },
        { id:"switch", t:"Switch to a less hazardous process", why:"Replacing the most hazardous baths means less harm if anything escapes." }],
      fb:"Any of these reduces harm; shops often combine them." },
    quickCheck:{
      title:"Quick check", summary:"Electroplating quick check",
      items:[
        { id:"q1", goal:6, prompt:"To plate a spoon with silver, the spoon connects to…",
          choices:[
            { t:"the negative terminal", ok:true, fb:"Right. The spoon must be the cathode, where Ag⁺ is reduced." },
            { t:"the positive terminal", fb:"The spoon must be the cathode, where Ag⁺ is reduced." },
            { t:"either terminal", fb:"The spoon must be the cathode, where Ag⁺ is reduced." },
            { t:"neither terminal", fb:"The spoon must be the cathode, where Ag⁺ is reduced." }] },
        { id:"q2", goal:2, prompt:"Doubling the plating time at the same current…",
          choices:[
            { t:"doubles the mass", ok:true, fb:"Right. " + Q + " = " + I + T + " doubles." },
            { t:"halves the mass", fb:Q + " = " + I + T + " doubles." },
            { t:"doesn’t change the mass", fb:Q + " = " + I + T + " doubles." },
            { t:"quadruples the mass", fb:Q + " = " + I + T + " doubles." }] },
        { id:"q3", goal:6, prompt:"A run deposits 0.762 g when theory says 0.953 g. Efficiency?",
          choices:[
            { t:"80%", ok:true, fb:"Right. Actual ÷ theoretical: 0.762 ÷ 0.953 ≈ 0.80." },
            { t:"125%", fb:"Actual ÷ theoretical: 0.762 ÷ 0.953 ≈ 0.80." },
            { t:"20%", fb:"Actual ÷ theoretical: 0.762 ÷ 0.953 ≈ 0.80." },
            { t:"100%", fb:"Actual ÷ theoretical: 0.762 ÷ 0.953 ≈ 0.80." }] },
        { id:"q4", goal:6, prompt:"Why must plating rinse water be treated?",
          choices:[
            { t:"It can contain toxic metal compounds", ok:true, fb:"Right. Metal ions in waste water harm living things." },
            { t:"It’s too hot", fb:"Metal ions in waste water harm living things." },
            { t:"It contains extra electrons", fb:"Metal ions in waste water harm living things." },
            { t:"It’s acidic only", fb:"Metal ions in waste water harm living things." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Galvanic or electrolytic?", summary:"Galvanic or electrolytic?", goal:1, noun:"statement", txt:true,
        instruction:"Eight statements. Sort each one: galvanic cell or electrolytic cell.",
        boxes:[{ id:"g", label:"Galvanic", sub:"spontaneous; makes electricity" }, { id:"e", label:"Electrolytic", sub:"forced by a power supply" }],
        wrongDefault:SORT_DEF,
        items:[
          sortItem("i1", "Anode is negative", "g", "Galvanic: electrons leave the anode on their own, so it’s negative.", { e:"In electrolysis the anode is +." }),
          sortItem("i2", "Anode is positive", "e", "Electrolytic: the supply’s + terminal pulls electrons off the anode."),
          sortItem("i3", "<i>E</i>°<sub>cell</sub> is positive", "g", "Galvanic: a positive <i>E</i>°<sub>cell</sub> means the reaction runs by itself."),
          sortItem("i4", "Needs a power supply", "e", "Electrolytic: the supply forces a non-spontaneous reaction."),
          sortItem("i5", "Converts chemical energy to electrical energy", "g", "Galvanic: the reaction makes electricity."),
          sortItem("i6", "Converts electrical energy to chemical energy", "e", "Electrolytic: electricity drives the reaction."),
          sortItem("i7", "A flashlight battery while it’s lighting the bulb", "g", "Galvanic: the battery runs by itself and makes electricity."),
          sortItem("i8", "Copper plating of a key", "e", "Electrolytic: a supply forces Cu²⁺ onto the key.")
        ] },
      { id:"calc", type:"numeric", title:"Faraday calculations", summary:"Faraday calculations", star:true, goal:[3, 4, 6],
        instruction:"Six calculations. Items 4 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number (no units) and press Check. Answers within 1% are accepted.",
        items:[
          { id:"f1", goal:3, prompt:"2.50 A flows for 3860 s. Moles of electrons?", answer:0.1, tol:0.001, unit:"mol", display:"0.100 mol",
            why:"9650 C ÷ 96 500 C/mol = 0.100 mol e⁻.",
            wrong:[{ match:[9650], fb:"That’s the charge in C; divide by " + Fv + "." }],
            hints:[Q + " = " + I + T + ", then " + n + "(e⁻) = " + Q + " ÷ " + Fv + ".", "2.50 × 3860 = 9650 C.", "9650 ÷ 96 500 = 0.100 mol."] },
          { id:"f2", goal:4, prompt:"0.500 A for 7720 s through CuSO₄(aq). Mass of Cu?", answer:1.27, tol:0.0127, unit:"g", display:"1.27 g",
            why:"3860 C → 0.0400 mol e⁻ → 0.0200 mol Cu → 1.27 g.",
            wrong:[{ match:[2.54], fb:"÷ 2 for Cu²⁺. " + M2 }],
            hints:["3860 C → moles of electrons.", "0.0400 mol e⁻ ÷ 2 = 0.0200 mol Cu.", "0.0200 × 63.5 = 1.27 g."] },
          { id:"f3", goal:4, prompt:"Time to deposit 2.16 g of Ag at 2.00 A?", answer:965, tol:9.65, unit:"s", display:"965 s",
            why:"0.0200 mol Ag → 0.0200 mol e⁻ → 1930 C; 1930 ÷ 2.00 = 965 s.",
            wrong:[{ match:[3860], fb:T + " = " + Q + " ÷ " + I + ", not " + Q + " × " + I + "." }],
            hints:["2.16 ÷ 108 = 0.0200 mol Ag = 0.0200 mol e⁻.", "0.0200 × 96 500 = 1930 C.", T + " = 1930 ÷ 2.00 = 965 s."] },
          { id:"f4", goal:4, prompt:"Current needed to deposit 6.54 g of Zn in 4825 s?", answer:4, tol:0.04, unit:"A", display:"4.00 A",
            why:"0.100 mol Zn → 0.200 mol e⁻ → 19 300 C; 19 300 ÷ 4825 = 4.00 A.",
            wrong:[{ match:[2], fb:"0.100 mol Zn needs <strong>0.200</strong> mol e⁻ = 19 300 C." }],
            hints:["Moles of Zn.", "× 2 for electrons.", "19 300 C ÷ 4825 s = 4.00 A."] },
          { id:"f5", goal:4, prompt:"A key gained 0.635 g of copper in 1930 s. What was the average current (100% efficiency)?", answer:1, tol:0.01, unit:"A", display:"1.00 A",
            why:"0.0100 mol Cu → 0.0200 mol e⁻ → 1930 C; 1930 ÷ 1930 = 1.00 A.",
            wrong:[{ match:[0.5], fb:"0.0100 mol Cu → 0.0200 mol e⁻ → 1930 C." }],
            hints:["0.635 ÷ 63.5 = 0.0100 mol Cu.", "× 2: 0.0200 mol e⁻ = 1930 C.", I + " = 1930 C ÷ 1930 s = 1.00 A."] },
          { id:"f6", goal:6, prompt:"2.00 A for 9650 s through CuSO₄(aq) deposited 5.08 g of Cu. Current efficiency?", answer:80, tol:0.8, unit:"%", display:"80.0%",
            why:"Theory: 6.35 g; 5.08 ÷ 6.35 × 100% = 80.0%.",
            wrong:[{ match:[125], fb:"Actual ÷ theoretical: 5.08 ÷ 6.35." }, { match:[40], fb:"Theory is 6.35 g: divide the moles of e⁻ by 2 only once." }],
            hints:["Theoretical mass first.", "19 300 C → 0.200 mol e⁻ → 0.100 mol Cu → 6.35 g.", "5.08 ÷ 6.35 = 0.800."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Lindiwe", goal:4,
        instruction:"Lindiwe made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"What mass of copper is deposited by 2.00 A for 4825 s?",
            steps:[Q + " = " + I + T + " = 2.00 × 4825 = 9650 C.", n + "(e⁻) = 9650 ÷ 96 500 = 0.100 mol.", n + "(Cu) = " + n + "(e⁻) = 0.100 mol.", m + " = 0.100 × 63.5 = 6.35 g."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Cu²⁺ + 2e⁻ → Cu, so " + n + "(Cu) = 0.100 ÷ 2 = 0.0500 mol and " + m + " = 3.18 g.", ok:true, why:M2 },
              { t:n + "(Cu) = 0.100 × 2 = 0.200 mol.", why:"Each Cu needs 2 e⁻, so there are fewer Cu atoms than electrons." },
              { t:n + "(Cu) = 0.100 ÷ 63.5.", why:"That mixes moles and molar mass." },
              { t:"Step 3 is correct.", why:"Count the electrons per ion. " + M2 }],
            hints:["Write the half-reaction.", "2 e⁻ per Cu.", "0.0500 mol, 3.18 g."] },
          { id:"e2", goal:4, task:"How long does it take to deposit 1.08 g of silver at 0.500 A?",
            steps:[n + "(Ag) = 1.08 ÷ 108 = 0.0100 mol.", "Ag⁺ + e⁻ → Ag, so " + n + "(e⁻) = 0.0100 mol.", Q + " = 0.0100 × 96 500 = 965 C.", T + " = " + Q + " × " + I + " = 965 × 0.500 = 483 s."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:T + " = " + Q + " ÷ " + I + " = 965 ÷ 0.500 = 1930 s.", ok:true, why:M4 + " Here the current is small, so the time is long." },
              { t:T + " = " + I + " ÷ " + Q + ".", why:"Units: A ÷ C isn’t seconds." },
              { t:T + " = 965 s.", why:"That’s only right at 1.00 A." },
              { t:"Step 4 is correct.", why:"A smaller current should take <strong>longer</strong>. " + M4 }],
            hints:[Q + " = " + I + T + ": rearrange for " + T + ".", T + " = " + Q + " ÷ " + I + ".", "1930 s."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that voltage doesn’t change the mass, or that aluminium won’t plate out of water? Why?" },
      { id:"j2", q:"In your own words, state Faraday’s first law and explain why it works (think about what each electron does)." },
      { id:"j3", q:"Explain to a friend the four-step chain from current and time to mass." },
      { id:"j4", q:"Which step of the chain do you still slip on? How will you check it next time?" }
    ]
  },
  final:{
    intro:"Use these values: " + USE,
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In an electrolytic cell, the anode is…", options:[
          { t:"positive, and oxidation happens there", ok:true, why:M1 },
          { t:"negative, and oxidation happens there", why:"That’s a galvanic cell’s anode. " + M1 },
          { t:"positive, and reduction happens there", why:"Reduction is at the cathode." },
          { t:"negative, and reduction happens there", why:"Both parts are wrong." }] },
        b:{ prompt:"To copper-plate a key, the key must be connected to…", options:[
          { t:"the negative terminal, so it’s the cathode", ok:true, why:"Cu²⁺ is reduced onto the cathode, which is negative in electrolysis." },
          { t:"the positive terminal, so it’s the anode", why:"It would dissolve. " + M1 },
          { t:"the positive terminal, so it’s the cathode", why:"The cathode is negative in electrolysis." },
          { t:"either terminal; plating works both ways", why:"Only the cathode gains metal." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Faraday’s first law says the mass of product at an electrode is proportional to…", options:[
          { t:"the charge passed through the cell", ok:true, why:"Each ion needs a fixed number of electrons, so the mass follows the charge." },
          { t:"the voltage of the supply", why:M3 },
          { t:"the concentration of the solution", why:M3 },
          { t:"the size of the electrode", why:"Electrode size isn’t in the law." }] },
        b:{ prompt:"Which change doubles the mass of metal deposited?", options:[
          { t:"Doubling the time at the same current", ok:true, why:Q + " = " + I + T + " doubles." },
          { t:"Doubling the voltage at the same current", why:M3 },
          { t:"Halving the current and doubling the time", why:"The charge stays the same." },
          { t:"Doubling the solution’s concentration", why:M3 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"How many moles of electrons are in 19 300 C?", use:USE, options:[
          { t:"0.200 mol", ok:true, why:"19 300 ÷ 96 500." },
          { t:"0.100 mol", why:"That’s 9650 C." },
          { t:"2.00 mol", why:"Check the powers of 10." },
          { t:"5.00 mol", why:"96 500 ÷ 19 300; divide the other way." }] },
        b:{ prompt:"How many moles of electrons are in 4825 C?", use:USE, options:[
          { t:"0.0500 mol", ok:true, why:"4825 ÷ 96 500." },
          { t:"0.500 mol", why:"Check the powers of 10." },
          { t:"20.0 mol", why:"Divided the wrong way." },
          { t:"0.100 mol", why:"That’s 9650 C." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"What mass of copper is deposited by 1.00 A for 9650 s?", use:USE, options:[
          { t:"3.18 g", ok:true, why:"9650 C → 0.100 mol e⁻ → 0.0500 mol Cu → 3.18 g." },
          { t:"6.35 g", why:"Divide the moles of e⁻ by 2. " + M2 },
          { t:"1.59 g", why:"Divided by 4." },
          { t:"0.635 g", why:"That’s 1930 C." }] },
        b:{ prompt:"What mass of zinc is deposited by 2.00 A for 4825 s?", use:USE, options:[
          { t:"3.27 g", ok:true, why:"9650 C → 0.100 mol e⁻ → 0.0500 mol Zn → 3.27 g." },
          { t:"6.54 g", why:"Each Zn²⁺ needs 2 electrons: divide the moles of e⁻ by 2." },
          { t:"1.64 g", why:"Divided by 4." },
          { t:"0.327 g", why:"Check the powers of 10." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How long does it take to plate 2.16 g of silver at 1.00 A?", use:USE, options:[
          { t:"1930 s", ok:true, why:"0.0200 mol Ag → 0.0200 mol e⁻ → 1930 C → 1930 s." },
          { t:"965 s", why:"Silver needs one electron per ion; don’t halve." },
          { t:"3860 s", why:"That’s 4.32 g." },
          { t:"0.0200 s", why:"That’s the number of moles, not a time." }] },
        b:{ prompt:"How long does it take to deposit 1.27 g of copper at 2.00 A?", use:USE, options:[
          { t:"1930 s", ok:true, why:"0.0200 mol Cu → 0.0400 mol e⁻ → 3860 C → 1930 s." },
          { t:"965 s", why:"Each Cu needs 2 e⁻." },
          { t:"3860 s", why:"That’s the charge in C; divide by 2.00 A." },
          { t:"7720 s", why:"Multiplied by the current. " + M4 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A solution contains Zn²⁺(aq) and Na⁺(aq). Using the table (Zn²⁺/Zn −0.76 V; water −0.83 V; Na⁺/Na −2.71 V), what forms first at the cathode?", options:[
          { t:"Zinc", ok:true, why:"−0.76 V is the highest, so Zn²⁺ is reduced first." },
          { t:"Sodium", why:"−2.71 V is the hardest to reduce." },
          { t:"Hydrogen", why:"Water is just below zinc." },
          { t:"Oxygen", why:"Oxygen forms at an anode, not a cathode." }] },
        b:{ prompt:"Aqueous Al₂(SO₄)₃ is electrolyzed with carbon electrodes. What forms at the cathode?", options:[
          { t:"Hydrogen gas", ok:true, why:"Water (−0.83 V) is reduced before Al³⁺ (−1.66 V)." },
          { t:"Aluminium metal", why:M5 },
          { t:"Oxygen gas", why:"That’s at the anode." },
          { t:"Sulfur", why:"Sulfate isn’t reduced here." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the copper anode loses mass during copper plating?", options:[
          { t:"“The anode is oxidized: Cu(s) → Cu²⁺(aq) + 2e⁻. The ions it releases replace those plated at the cathode.”", ok:true, why:M6 },
          { t:"“Copper falls off the anode because of the current.”", why:"It dissolves as ions; it doesn’t fall off." },
          { t:"“The anode is reduced and shrinks.”", why:"Reduction would add metal." },
          { t:"“The anode doesn’t lose mass.”", why:M6 }] },
        b:{ prompt:"Which is the best explanation of why the mass deposited depends on charge, not voltage?", options:[
          { t:"“Each ion needs a fixed number of electrons, so the moles of metal equal (" + Q + " ÷ " + Fv + ") ÷ " + Z + ". Voltage only has to be enough to drive the reaction.”", ok:true, why:"The electrons do the work; voltage only has to be large enough." },
          { t:"“Higher voltage makes faster ions, which stick better.”", why:M3 },
          { t:"“Voltage and charge are the same thing.”", why:"Charge is in coulombs; voltage is energy per coulomb." },
          { t:"“Charge depends on the solution’s concentration.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which order of steps correctly finds the mass of metal deposited?", options:[
          { t:Q + " = " + I + T + " → " + n + "(e⁻) = " + Q + " ÷ " + Fv + " → " + n + "(metal) = " + n + "(e⁻) ÷ " + Z + " → " + m + " = " + n + " × " + Mv, ok:true, why:"Charge, then electrons, then atoms, then mass." },
          { t:Q + " = " + I + T + " → " + n + "(metal) = " + Q + " ÷ " + Fv + " → " + m + " = " + n + " × " + Mv, why:"Skips dividing by " + Z + "." },
          { t:Q + " = " + I + " ÷ " + T + " → " + n + "(e⁻) = " + Q + " ÷ " + Fv + " → " + n + "(metal) = " + n + "(e⁻) ÷ " + Z + " → " + m + " = " + n + " × " + Mv, why:Q + " = " + I + T + "." },
          { t:Q + " = " + I + T + " → " + n + "(e⁻) = " + Fv + " ÷ " + Q + " → " + n + "(metal) = " + n + "(e⁻) ÷ " + Z + " → " + m + " = " + n + " × " + Mv, why:n + "(e⁻) = " + Q + " ÷ " + Fv + "." }] },
        b:{ prompt:"Which single formula gives the mass deposited?", options:[
          { t:m + " = (" + Mv + " × " + I + " × " + T + ") ÷ (" + Z + " × " + Fv + ")", ok:true, why:"It folds the four steps into one." },
          { t:m + " = (" + Z + " × " + Fv + " × " + I + " × " + T + ") ÷ " + Mv, why:"Upside down." },
          { t:m + " = (" + Mv + " × " + I + " × " + T + ") ÷ " + Fv, why:"Missing " + Z + "." },
          { t:m + " = (" + Mv + " × " + I + ") ÷ (" + Z + " × " + Fv + " × " + T + ")", why:"Time belongs in the numerator." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A jeweller plates a trophy with 4.32 g of silver at 2.00 A. How long does it take (100% efficiency)?", use:USE, options:[
          { t:"1930 s", ok:true, why:"0.0400 mol Ag → 0.0400 mol e⁻ → 3860 C → 1930 s." },
          { t:"965 s", why:"Silver needs one electron per ion; don’t halve." },
          { t:"3860 s", why:"3860 is the charge in C." },
          { t:"7720 s", why:M4 }] },
        b:{ prompt:"A bolt is plated with 3.27 g of zinc at 1.00 A. How long does it take (100% efficiency)?", use:USE, options:[
          { t:"9650 s", ok:true, why:"0.0500 mol Zn → 0.100 mol e⁻ → 9650 C → 9650 s." },
          { t:"4825 s", why:"Each Zn²⁺ needs 2 electrons: multiply the moles of Zn by 2." },
          { t:"19 300 s", why:"That would deposit 6.54 g." },
          { t:"3270 s", why:"Treated grams as seconds." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A plating shop measured 2.54 g of copper after passing 9650 C. What was the current efficiency?", use:USE, options:[
          { t:"80%", ok:true, why:"Theory: 0.100 mol e⁻ → 0.0500 mol Cu → 3.175 g; 2.54 ÷ 3.175 = 0.80." },
          { t:"40%", why:"Theory is 3.175 g, not 6.35 g." },
          { t:"125%", why:"Divided the wrong way. " + M7 },
          { t:"100%", why:"The actual mass is less than theory." }] },
        b:{ prompt:"2.00 A for 965 s deposited 0.572 g of copper. What was the current efficiency?", use:USE, options:[
          { t:"About 90%", ok:true, why:"Theory: 1930 C → 0.0200 mol e⁻ → 0.0100 mol Cu → 0.635 g; 0.572 ÷ 0.635 ≈ 0.90." },
          { t:"About 45%", why:"Theory is 0.635 g, not 1.27 g." },
          { t:"About 111%", why:M7 },
          { t:"About 180%", why:"That divides by 0.318 g, halving the moles of copper a second time." }] } }
    ]
  },
  task:{
    title:"Plating plan", summary:"Plating plan",
    statement:"<p>Plan a plating job that meets every condition. Can you find all the plans?</p><ol class=\"fl-conds\"><li>The metal actually plates out of the solution.</li><li>The coating has a mass of at least 2.00 g.</li><li>The coating has a mass of at most 4.00 g.</li><li>The job finishes in at most 1 hour (3600 s).</li></ol>",
    checks:["Metal plates out", "At least 2.00 g", "At most 4.00 g", "Within 1 hour"],
    tips:["Al³⁺ isn’t reduced in water: H₂ forms instead.", "Find the charge you need: mass ÷ " + Mv + " × " + Z + " × 96 500.", "Too heavy? Lower the current or the time.", "Only 965 s and 1930 s fit in an hour, so the current has to do the work."],
    explainPrompt:"Explain how you chose the current and time, and why your metal can be plated from water.",
    vocab:"Use the words charge, moles of electrons, ion charge and reduction potential.",
    more:"There’s more than one plan. Can you find them all?",
    afterAt:4,
    after3:"Silver needs half the charge of copper or zinc for a similar mass: one electron per ion, and heavy atoms."
  },
  cards:[
    ["Electrolytic cell", "A power supply drives a non-spontaneous redox reaction; anode +, cathode −."],
    ["Galvanic vs electrolytic", "Galvanic: spontaneous, makes electricity, anode −. Electrolytic: forced, uses electricity, anode +."],
    ["Faraday constant " + Fv, "96 500 C: the charge on 1 mol of electrons."],
    [Q + " = " + I + T, "Charge (C) = current (A) × time (s)."],
    ["Faraday’s first law", "The mass produced is proportional to the charge passed."],
    ["The chain", Q + " = " + I + T + " → " + n + "(e⁻) = " + Q + " ÷ " + Fv + " → " + n + "(metal) = " + n + "(e⁻) ÷ " + Z + " → " + m + " = " + n + Mv + "."],
    ["One formula", m + " = " + Mv + I + T + " ÷ (" + Z + Fv + ")."],
    ["9650 C", "0.100 mol of electrons."],
    ["Electroplating", "The object is the cathode; a bar of the plating metal is the anode."],
    ["Aqueous electrolysis at the cathode", "The species with the higher <i>E</i>° is reduced; Al³⁺ and Na⁺ lose to water (H₂ forms)."],
    ["Current efficiency", "Actual mass ÷ theoretical mass × 100%; at most 100%."],
    ["Voltage in Faraday’s law", "Not there. It must only be large enough to drive the reaction."]
  ]
};
