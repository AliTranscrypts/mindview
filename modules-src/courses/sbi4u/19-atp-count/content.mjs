// SBI4U 19 Cellular Respiration ATP Count. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/19-atp-count.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "10 NADH: 2 from glycolysis + 2 from pyruvate oxidation + 6 from the Krebs cycle.";
const M2 = "Substrate-level: 2 (net, glycolysis) + 2 (Krebs) = 4.";
const M3 = "The total depends on assumptions. State the values per NADH and FADH₂, and the shuttle.";
const M4 = "FADH₂ enters after complex I: 2 (theoretical) or 1.5 (current), not 3 or 2.5.";
const M5 = "Cytosolic NADH’s electrons enter as FADH₂ through the glycerol-phosphate shuttle: worth 2, not 3.";
const M6 = "ATP per carrier = H⁺ pumped ÷ H⁺ per ATP (≈ 4, including transport).";
const M7 = "Fermentation gives 2 ATP; aerobic respiration about 30–38: roughly 15–19 times more.";

const MATCH_L = [
  "Glycolysis (per glucose)", "Pyruvate oxidation (per glucose)", "Krebs cycle (per glucose)", "All substrate-level ATP",
  "Prokaryote, theoretical total", "Eukaryote, glycerol-phosphate, theoretical total", "Eukaryote, glycerol-phosphate, current total", "Fermentation total"
];
const MATCH_R = ["2 ATP (net), 2 NADH", "2 NADH, 2 CO₂", "2 ATP, 6 NADH, 2 FADH₂, 4 CO₂", "4", "38", "36", "30", "2"];

export default {
  id:"19-atp-count",
  kind:"topic",
  title:"Cellular respiration ATP count",
  topic:"Cellular Respiration ATP Count",
  readyTopic:"counting ATP",
  hero:{
    eq:'<span class="ac-heq">total <span class="ac-c-atp">ATP</span> = 4 (substrate-level) + 10 × (<span class="ac-c-atp">ATP</span> per <span class="ac-c-nadh">NADH</span>) + 2 × (<span class="ac-c-atp">ATP</span> per <span class="ac-c-fadh">FADH₂</span>)</span>',
    eqLabel:"total ATP equals 4 substrate-level, plus 10 times the ATP per NADH, plus 2 times the ATP per FADH₂",
    eqSize:"sm",
    headline:"36? 38? 30? It depends what you assume",
    text:"Every glucose gives the same raw materials: <strong>4 ATP</strong> made directly, <strong>10 NADH</strong> and <strong>2 FADH₂</strong>. The total depends on how many ATP each carrier is worth. Older <strong>theoretical</strong> values (3 and 2) give 36–38. Newer <strong>H⁺-based</strong> estimates (2.5 and 1.5) give about 30–32. Good answers always state their <strong>assumptions</strong>.",
    fig:{ html:'<div class="ac-hero" id="ac-hero" role="img" aria-label="Three columns fill from the three stages of respiration: 4 orange ATP tokens, 10 teal NADH tokens and 2 cerulean FADH₂ tokens. A converter tile reads times 3 per NADH and times 2 per FADH₂, and the total reads 38. Two NADH made in the cytosol slide through a shuttle gate and turn cerulean, now counted as FADH₂: the total drops to 36. The tile flips to times 2.5 and times 1.5: the total becomes 32, then 30 with the shuttle. Caption: Same glucose. Different assumptions."></div>' }
  },
  goals:[
    "I can list the substrate-level ATP, NADH and FADH₂ made per glucose at each stage.",
    "I can calculate the total ATP per glucose using stated values for NADH and FADH₂.",
    "I can explain why eukaryotes may get 36 rather than 38 (the cost of moving cytosolic NADH’s electrons into the mitochondrion).",
    "I can explain, using H⁺ accounting, why current estimates are about 30–32 rather than 36–38.",
    "I can apply the counting method to new situations: different fuels, organisms or H⁺ requirements.",
    "I can compare the ATP yields of aerobic respiration and fermentation."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Stage products", goal:1,
          prompt:"How many NADH does the Krebs cycle make per glucose?",
          options:[
            { t:"6", ok:true, why:"3 per turn × 2 turns." },
            { t:"3", why:"Two turns per glucose." },
            { t:"8", why:"Pyruvate oxidation is separate." },
            { t:"10", why:"That’s all stages together." }],
          hints:["Per turn?", "3.", "× 2 = 6."] },
        { id:"w2", skill:"Stage products", goal:1,
          prompt:"How many ATP are made by substrate-level phosphorylation per glucose (glycolysis net + Krebs cycle)?",
          options:[
            { t:"4", ok:true, why:"2 + 2." },
            { t:"2", why:"Add the Krebs cycle’s 2." },
            { t:"6", why:"Glycolysis nets 2, not 4." },
            { t:"36", why:"That’s the overall total." }],
          hints:["Glycolysis net?", "2; the Krebs cycle 2.", "4."] },
        { id:"w3", skill:"Stage products", goal:1,
          prompt:"How many FADH₂ per glucose?",
          options:[
            { t:"2", ok:true, why:"One per Krebs turn." },
            { t:"1", why:"That’s one turn. Two turns per glucose." },
            { t:"4", why:"Only the succinate step makes FADH₂." },
            { t:"6", why:"6 is the Krebs cycle’s NADH count, not FADH₂." }],
          hints:["Which step makes FADH₂?", "Succinate → fumarate, once per turn.", "2."] },
        { id:"w4", skill:"Carrier values", goal:2,
          prompt:"Using theoretical values, how many ATP is one NADH worth?",
          options:[
            { t:"3", ok:true, why:"Its electrons pass three pumping complexes." },
            { t:"2", why:"That’s FADH₂." },
            { t:"2.5", why:"That’s the current estimate." },
            { t:"10", why:"10 is H⁺ pumped, not ATP." }],
          hints:["Theoretical values.", "NADH 3, FADH₂ 2.", "3."] },
        { id:"w5", skill:"Carrier values", goal:4,
          prompt:"NADH pumps about 10 H⁺, and one ATP needs about 4 H⁺. How many ATP per NADH?",
          options:[
            { t:"2.5", ok:true, why:"10 ÷ 4." },
            { t:"40", why:"That multiplies. " + M6 },
            { t:"0.4", why:"That divides the wrong way. " + M6 },
            { t:"3", why:"That’s the older theoretical value." }],
          hints:["H⁺ available ÷ H⁺ needed per ATP.", "10 ÷ 4.", "2.5."] },
        { id:"w6", skill:"Multiplying and adding", goal:2,
          prompt:"4 + 10 × 2.5 + 2 × 1.5 = ?",
          options:[
            { t:"32", ok:true, why:"4 + 25 + 3." },
            { t:"36.5", why:"Multiply first, then add." },
            { t:"30", why:"Arithmetic slip: 10 × 2.5 = 25." },
            { t:"21.5", why:"2 × 1.5 is 3, not 0.5." }],
          hints:["Multiply first.", "25 and 3.", "4 + 25 + 3 = 32."] }
      ],
      refreshers:{
        "Stage products":"Glycolysis: 2 ATP (net), 2 NADH. Pyruvate oxidation: 2 NADH. Krebs cycle: 2 ATP, 6 NADH, 2 FADH₂. Totals: 4 ATP, 10 NADH, 2 FADH₂.",
        "Carrier values":"Theoretical: NADH 3, FADH₂ 2. Current: NADH ≈ 2.5, FADH₂ ≈ 1.5 (10 H⁺ ÷ 4 and 6 H⁺ ÷ 4).",
        "Multiplying and adding":"Multiply each carrier count by its value, then add the substrate-level 4."
      }
    }
  },
  explore:{
    heading:"ATP ledger",
    intro:"Build the ATP count for one glucose, stage by stage. Then flip the assumptions and watch the total change.",
    modes:[["build", "Build"], ["explain", "Explain"], ["compare", "Compare"]],
    modeHelp:{
      build:"Build: type each stage’s products into the ledger, then press Check row.",
      explain:"Explain: step through each stage and watch the ledger fill.",
      compare:"Compare: two ledgers side by side. Choose which one the settings change."
    },
    orgs:[["pro", "Prokaryote"], ["euk", "Eukaryote"]],
    vals:[["theo", "Theoretical (3 / 2)"], ["cur", "Current (2.5 / 1.5)"], ["custom", "Custom (H⁺ calculator)"]],
    shuts:[["gp", "Glycerol-phosphate"], ["ma", "Malate–aspartate"]],
    shutNote:{ gp:"cytosolic NADH → FADH₂ inside", ma:"cytosolic NADH → NADH inside" },
    stages:[
      { id:"g", name:"Glycolysis", where:"Cytosol", vals:[2, 2, 0] },
      { id:"p", name:"Pyruvate oxidation", where:"Matrix", vals:[0, 2, 0] },
      { id:"k", name:"Krebs cycle", where:"Matrix", vals:[2, 6, 2] }
    ],
    cols:["Substrate-level ATP", "NADH", "FADH₂"],
    conv:["Cytosolic NADH after the shuttle", "ATP from NADH", "ATP from FADH₂", "Total"],
    readout:["Substrate-level ATP", "NADH counted at full value", "FADH₂ (including shuttled)", "ATP from NADH", "ATP from FADH₂", "Total ATP per glucose", "Energy captured", "Assumptions"],
    build:{
      named:{ g0:"4 is gross; 2 were invested, so net 2.", p1:"Each pyruvate makes 1 NADH.", k:"That’s one turn: double it." },
      right:{ g:"Glycolysis: net 2 ATP (4 made, 2 invested) and 2 NADH, made in the cytosol.", p:"Pyruvate oxidation: 1 NADH from each of the 2 pyruvate.", k:"Krebs cycle: two turns, each making 1 ATP, 3 NADH and 1 FADH₂." },
      blank:"Fill all three boxes in this row first (type 0 for none).",
      done:"All three rows are right: 4 ATP, 10 NADH and 2 FADH₂. The conversion rows below now use your ledger."
    },
    steps:[
      { t:"Start", cap:"One glucose. Step through the stages to fill the ledger." },
      { t:"Glycolysis", cap:"Glycolysis, in the cytosol: 4 ATP are made but 2 were invested, so net 2 ATP. It also makes 2 NADH, in the cytosol." },
      { t:"Pyruvate oxidation", cap:"Pyruvate oxidation, in the matrix: each of the 2 pyruvate makes 1 NADH, so 2 NADH." },
      { t:"Krebs cycle", cap:"Krebs cycle, in the matrix: two turns per glucose make 2 ATP, 6 NADH and 2 FADH₂." },
      { t:"The shuttle", capGp:"The 2 cytosolic NADH can’t cross the inner membrane. The glycerol-phosphate shuttle passes their electrons to FAD inside, so they now count as FADH₂.", capMa:"The 2 cytosolic NADH can’t cross the inner membrane. The malate–aspartate shuttle passes their electrons to NAD⁺ inside, so they still count as NADH.", capPro:"A prokaryote has no mitochondrion: its chain is in the plasma membrane, so every NADH is already where it’s needed. No shuttle." },
      { t:"Convert to ATP", cap:"Multiply each carrier by its value, then add the 4 substrate-level ATP." }
    ],
    calc:{ title:"H⁺ calculator (custom values)", n:"H⁺ pumped per NADH", f:"H⁺ pumped per FADH₂", a:"H⁺ used per ATP", typed:"Type the total ATP per glucose for the custom ledger:" },
    modelNote:"<strong>Model values.</strong> Theoretical values count pumping sites: NADH’s electrons pass three pumping complexes (3 ATP), FADH₂’s two (2 ATP). Current values count H⁺: NADH ≈ 10 H⁺ ÷ 4 = 2.5 and FADH₂ ≈ 6 H⁺ ÷ 4 = 1.5. Energy captured uses ≈ 30.5 kJ/mol per ATP and ≈ 2870 kJ/mol for glucose. Prokaryote totals assume the same carrier values as mitochondria; real bacteria vary widely: some pump fewer H⁺, and some use other final acceptors.",
    aha:"Same raw materials, different totals. The shuttle costs 2 (theoretical). H⁺ accounting gives 2.5 and 1.5. Assumptions must be stated.",
    predIntro:"Make a prediction first. Then the ledger will show you what really happens.",
    predictions:[
      { id:"p1", start:{ org:"pro", vals:"theo", shut:"gp" }, hide:true,
        prompt:"<span class=\"muted\">Prokaryote, theoretical values.</span> What’s the total?",
        reveal:"4 + 30 + 4 = 38.",
        options:[{ t:"38", ok:true }, { t:"36" }, { t:"32" }, { t:"4" }],
        explain:"4 + 30 + 4 = 38. No mitochondrion means no shuttle: every NADH is worth 3." },
      { id:"p2", start:{ org:"pro", vals:"theo", shut:"gp" }, to:{ org:"euk", shut:"gp" },
        prompt:"<span class=\"muted\">Prokaryote, theoretical: 38.</span> Switch to eukaryote with the glycerol-phosphate shuttle. What happens to the total?",
        reveal:"The 2 cytosolic NADH slide through the shuttle gate and become FADH₂ inside, each worth 2.",
        options:[{ t:"It drops by 2, to 36", ok:true }, { t:"It drops by 4" }, { t:"It stays at 38" }, { t:"It rises" }],
        explain:"2 NADH × (3 − 2) = 2 ATP lost." },
      { id:"p3", start:{ org:"euk", vals:"theo", shut:"gp" }, to:{ vals:"cur" },
        prompt:"<span class=\"muted\">Eukaryote, glycerol-phosphate, theoretical: 36.</span> Switch to current values. What’s the total now?",
        reveal:"4 + 8 × 2.5 + 4 × 1.5 = 4 + 20 + 6.",
        options:[{ t:"30", ok:true }, { t:"32" }, { t:"36" }, { t:"34" }],
        explain:"4 + 8 × 2.5 + 4 × 1.5 = 4 + 20 + 6 = 30. Same molecules, different assumptions: 2.5 and 1.5 come from counting H⁺." },
      { id:"p4", start:{ org:"euk", vals:"cur", shut:"gp" }, cycle:true,
        prompt:"Which part of the total never changes, whatever the settings?",
        reveal:"The substrate column glows in every setting: 38, 36, 32 and 30 all start with the same 4.",
        options:[{ t:"The 4 substrate-level ATP", ok:true }, { t:"The NADH contribution" }, { t:"The FADH₂ contribution" }, { t:"None of it" }],
        explain:"Substrate-level ATP doesn’t depend on the chain or the gradient." }
    ],
    chalIntro:"Use the ledger to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Set the toggles so the total is exactly <strong>32</strong>.",
        why:"32 is a current-value total with every NADH counted at 2.5: a prokaryote, or a eukaryote with the malate–aspartate shuttle.",
        wrong:{ gp:"The shuttle costs 2 × (2.5 − 1.5) = 2.", theo:"32 needs the current values." },
        hints:["32 is a current-value total.", "It needs every NADH counted at 2.5.", "Prokaryote, or eukaryote with malate–aspartate."] },
      { id:"tc2", goal:1, prompt:"Build mode: fill all three stage rows for one glucose correctly on the first check.",
        why:"2/2/0, 0/2/0 and 2/6/2: 4 substrate-level ATP, 10 NADH and 2 FADH₂.",
        wrong:{ mode:"Switch the mode to <strong>Build</strong> first.", blank:"Fill every box in all three rows first (type 0 for none).", other:"Some boxes aren’t right yet. Go stage by stage." },
        hints:["Go stage by stage: glycolysis, pyruvate oxidation, the Krebs cycle.", "Krebs: two turns per glucose.", "2/2/0, 0/2/0, 2/6/2."] },
      { id:"tc3", goal:[2, 4], stretch:true,
        prompt:"Compare mode, custom values, prokaryote: a hypothetical bacterium’s ATP synthase needs <strong>5 H⁺ per ATP</strong> (including transport); NADH pumps 10 H⁺ and FADH₂ 6 H⁺. Set the calculator and type the total.",
        why:"NADH: 10 ÷ 5 = 2. FADH₂: 6 ÷ 5 = 1.2. 4 + 10 × 2 + 2 × 1.2 = 26.4.",
        wrong:{ t224:"Add the 4 substrate-level ATP.", t32:"That uses 4 H⁺ per ATP.", t26:"Don’t round: 2 × 1.2 = 2.4.",
          mode:"Switch the mode to <strong>Compare</strong> first.", custom:"Set one ledger’s values to <strong>Custom</strong> to open the H⁺ calculator.",
          org:"The ledger with custom values must be a <strong>prokaryote</strong>.", set:"Set the calculator to the bacterium’s numbers: 10 H⁺ per NADH, 6 per FADH₂ and 5 per ATP.",
          typed:"Type your total in the box under the calculator.", fmt:"Type your total as a number with a decimal point, such as 26.4.", other:"Check your total against the ledger: 4 + (10 × ATP per NADH) + (2 × ATP per FADH₂)." },
        hints:["ATP per carrier = H⁺ pumped ÷ H⁺ per ATP.", "NADH: 10 ÷ 5 = 2. FADH₂: 6 ÷ 5 = 1.2.", "4 + 10 × 2 + 2 × 1.2 = 26.4."] }
    ]
  },
  part3:{
    slug:"real-count", name:"Real count",
    heading:"Why the real count is lower",
    intro:"Explore treats the carrier values as settings. Here you open them up: where 2.5 and 1.5 come from, why real cells get less than even that, and what experiments actually measure.",
    budget:{
      title:"Station 1: the H⁺ budget", panel:"Zoom to the molecules",
      how:"Each magenta dot is one H⁺ pumped by the chain. Press <strong>Spend the H⁺</strong> to group them in fours, the cost of one ATP.",
      rows:[["NADH", 10, "--bio-nadh"], ["FADH₂", 6, "--bio-fadh"]],
      group:"≈ 3 H⁺ turn ATP synthase once + ≈ 1 H⁺ brings in Pᵢ and swaps ADP in for ATP out",
      spend:"Spend the H⁺", reset:"Put them back",
      result:"10 dots make 2 full groups plus half a group: 2.5 ATP per NADH. 6 dots make 1 full group plus half a group: 1.5 ATP per FADH₂.",
      text:"The older 3 and 2 came from counting pumping sites (NADH passes three, FADH₂ two), before the H⁺ cost per ATP had been measured."
    },
    leak:{
      title:"Station 2: the leak dial",
      how:"Set how much of the pumped H⁺ leaks back across the membrane without passing through ATP synthase. Eukaryote, current values, malate–aspartate shuttle.",
      levels:[[0, "0%"], [10, "10%"], [20, "20%"]],
      text:"Some leak is normal and helps keep us warm (module 17). Shuttles and transport also cost energy. So real cells usually make fewer ATP than any textbook maximum."
    },
    data:{
      title:"Station 3: what experiments measure", panel:"Check it with data",
      intro:"Scientists give a fuel to isolated mitochondria and measure how much ATP is made for each oxygen atom used: the <strong>P/O ratio</strong>.",
      head:["Fuel given to isolated mitochondria", "Electrons enter as", "Measured ATP per O atom"],
      rows:[["Malate", "NADH", "≈ 2.5"], ["Succinate", "FADH₂ (complex II)", "≈ 1.5"]],
      note:"Model values, consistent with current estimates; real measurements vary slightly.",
      prompts:[
        { id:"d1", q:"Each O atom accepts one electron pair. So what is one NADH worth?",
          chips:[{ t:"≈ 2.5 ATP", ok:true, fb:"One NADH delivers one electron pair, which reduces one O atom: so one NADH ≈ 2.5 ATP." },
            { t:"3 ATP", fb:"That’s the theoretical value. The data say ≈ 2.5 per O atom." },
            { t:"≈ 1.5 ATP", fb:"That’s succinate’s route (FADH₂). Malate’s electrons enter as NADH." },
            { t:"10 ATP", fb:"10 is the H⁺ pumped per NADH, not ATP." }] },
        { id:"d2", q:"Which model do these data support: theoretical (3/2) or current (2.5/1.5)?",
          chips:[{ t:"Current (2.5 / 1.5)", ok:true, fb:"The measured ratios match 2.5 and 1.5, not 3 and 2." },
            { t:"Theoretical (3 / 2)", fb:"The measured ratios are ≈ 2.5 and ≈ 1.5, not 3 and 2." }] },
        { id:"d3", q:"Why use succinate?",
          chips:[{ t:"It feeds electrons in at complex II, so it measures FADH₂’s route.", ok:true, fb:"Succinate → fumarate makes FADH₂ inside complex II, so its electrons skip complex I." },
            { t:"It makes more ATP than malate.", fb:"It makes less: ≈ 1.5 per O atom." },
            { t:"It skips the electron transport chain.", fb:"Its electrons still pass complexes III and IV." },
            { t:"It’s the only fuel mitochondria accept.", fb:"Malate works too: it’s in the same table." }] }
      ]
    },
    quickCheck:{
      title:"Quick check", summary:"Why the real count is lower quick check",
      items:[
        { id:"q1", goal:4, prompt:"FADH₂ pumps 6 H⁺; ATP needs 4. ATP per FADH₂?",
          choices:[
            { t:"1.5", ok:true, fb:"Right: 6 ÷ 4 = 1.5." },
            { t:"2", fb:"6 ÷ 4. " + M6 },
            { t:"24", fb:"6 ÷ 4. " + M6 },
            { t:"0.67", fb:"6 ÷ 4. " + M6 }] },
        { id:"q2", goal:4, prompt:"Why is the current count lower than 36–38?",
          choices:[
            { t:"More H⁺ per ATP than once assumed, plus leaks and transport", ok:true, fb:"Right. The same 10 NADH and 2 FADH₂ are made; each is worth less ATP." },
            { t:"Less glucose is used", fb:"The same 10 NADH and 2 FADH₂ are made." },
            { t:"Fewer NADH are made", fb:"The same 10 NADH and 2 FADH₂ are made." },
            { t:"O₂ is wasted", fb:"The same 10 NADH and 2 FADH₂ are made." }] },
        { id:"q3", goal:4, prompt:"With a 10% leak, the 28 ATP from carriers (current, malate–aspartate) becomes…",
          choices:[
            { t:"25.2", ok:true, fb:"Right: 28 × 0.9 = 25.2, plus 4 substrate-level = 29.2 in total." },
            { t:"28", fb:"28 × 0.9 = 25.2, plus 4 substrate-level = 29.2 in total." },
            { t:"18", fb:"28 × 0.9 = 25.2, plus 4 substrate-level = 29.2 in total." },
            { t:"2.8", fb:"28 × 0.9 = 25.2, plus 4 substrate-level = 29.2 in total." }] },
        { id:"q4", goal:4, prompt:"A P/O ratio measures…",
          choices:[
            { t:"ATP made per O atom used", ok:true, fb:"Right. Each O atom takes one electron pair." },
            { t:"O₂ made per ATP", fb:"Each O atom takes one electron pair." },
            { t:"H⁺ per electron", fb:"Each O atom takes one electron pair." },
            { t:"Glucose per ATP", fb:"Each O atom takes one electron pair." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Stage ↔ products", summary:"Stage ↔ products", goal:[1, 6],
        instruction:"Match each stage or setting with its products or ATP total.",
        leftTitle:"Stage or setting", rightTitle:"Products or total",
        left:MATCH_L.map(function(t, i){
          const it = { id:"l" + (i + 1), t:t };
          if (i === 6) it.hints = ["Current values, with 2 NADH shuttled as FADH₂.", "8 × 2.5 + 4 × 1.5.", "20 + 6 + 4 = 30."];
          return it;
        }),
        right:MATCH_R.map(function(t, i){ return { id:"r" + (i + 1), t:t }; }),
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r4":"Glycolysis nets 2 ATP.", "l6|r5":"The glycerol-phosphate shuttle costs 2.",
          "l8|r5":"Fermentation stops after glycolysis: 2 ATP.", "l8|r6":"Fermentation stops after glycolysis: 2 ATP.", "l8|r7":"Fermentation stops after glycolysis: 2 ATP." },
        wrongDefault:"Check the ledger table from Explore." },
      { id:"puzzles", type:"numeric", title:"Counting puzzles", summary:"Counting puzzles", star:true, goal:[2, 4, 5],
        instruction:"Six counting puzzles. Puzzles 3 to 6 are non-routine; the last two go beyond the Final Check.",
        how:"Type your answer, then press Check. Use a decimal point for decimals, such as 26.4.",
        items:[
          { id:"n1", goal:2, prompt:"Prokaryote, theoretical: total ATP for 2 glucose?", answer:76, display:"76 ATP", unit:"ATP",
            why:"38 per glucose × 2.", wrong:[{ match:38, fb:"That’s one glucose." }] },
          { id:"n2", goal:2, prompt:"Eukaryote, current, malate–aspartate: ATP from NADH alone for 1 glucose?", answer:25, display:"25 ATP", unit:"ATP",
            why:"10 × 2.5 = 25.", wrong:[{ match:20, fb:"Malate–aspartate keeps all 10 NADH at 2.5." }] },
          { id:"n3", goal:5, star:true, prompt:"<span class=\"tag\">Investigation</span> Isolated mitochondria are given 4 pyruvate (no glycolysis). Current values. Total ATP?", answer:50, display:"50 ATP", unit:"ATP",
            why:"Working: 4 × (4 NADH × 2.5 + 1 FADH₂ × 1.5 + 1 ATP) = 4 × 12.5 = 50.",
            wrong:[{ match:46, fb:"Add the 4 substrate-level ATP from the Krebs cycle." }, { match:40, fb:"Count FADH₂ and ATP too, not just NADH." }],
            hints:["Each pyruvate: 1 NADH (pyruvate oxidation) + 1 Krebs turn.", "Per pyruvate: 4 NADH × 2.5 = 10, 1 FADH₂ × 1.5 = 1.5, 1 ATP.", "12.5 × 4 = 50."] },
          { id:"n4", goal:5, star:true, prompt:"A muscle cell (glycerol-phosphate, current values) uses 3 glucose. How many ATP?", answer:90, display:"90 ATP", unit:"ATP",
            why:"30 per glucose × 3.", wrong:[{ match:96, fb:"Glycerol-phosphate: 30 per glucose, not 32." }] },
          { id:"n5", goal:[4, 5], star:true, prompt:"A bacterium’s chain pumps 8 H⁺ per NADH and 4 per FADH₂; its synthase needs 4 H⁺ per ATP. Total ATP per glucose (4 substrate-level)?", answer:26, display:"26 ATP", unit:"ATP",
            why:"4 + 10 × 2 + 2 × 1 = 26.", wrong:[{ match:22, fb:"Add the 4 substrate-level ATP: 4 + 10 × 2 + 2 × 1." }] },
          { id:"n6", goal:[4, 5], star:true, prompt:"Current values, eukaryote with malate–aspartate, and a 20% leak of pumped H⁺. Total ATP per glucose?", answer:26.4, display:"26.4 ATP", unit:"ATP",
            why:"28 × 0.8 = 22.4; + 4 = 26.4.", wrong:[{ match:25.6, fb:"The leak affects only the 28 from carriers: 28 × 0.8 = 22.4, + 4." }],
            hints:["Substrate-level ATP isn’t affected by a leak.", "Carriers: 25 + 3 = 28 at full value.", "28 × 0.8 = 22.4; + 4 = 26.4."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Joon", goal:[1, 2, 3], how:"",
        instruction:"Joon made one mistake in each count. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Count the theoretical ATP for a prokaryote.",
            steps:["Substrate-level ATP: 2 (glycolysis) + 2 (Krebs) = 4.", "NADH: 2 (glycolysis) + 6 (Krebs) = 8.", "FADH₂: 2.", "Total: 4 + 8 × 3 + 2 × 2 = 32."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct, but look earlier.", "Step 4 follows from step 2."],
            fixes:[
              { t:"NADH: 2 + 2 (pyruvate oxidation) + 6 = 10, so the total is 4 + 30 + 4 = 38.", ok:true, why:M1 },
              { t:"NADH: 6 only.", why:"Glycolysis makes NADH too." },
              { t:"NADH: 20.", why:"That double-counts." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Which stage is missing?", "Pyruvate oxidation.", "10 NADH."] },
          { id:"e2", goal:2, task:"Count the current-value ATP for a prokaryote.",
            steps:["4 substrate-level ATP, 10 NADH, 2 FADH₂.", "NADH: 10 × 2.5 = 25.", "FADH₂: 2 × 2.5 = 5.", "Total: 4 + 25 + 5 = 34."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"FADH₂ is worth ≈ 1.5 (6 H⁺ ÷ 4): 2 × 1.5 = 3, so the total is 32.", ok:true, why:M4 },
              { t:"FADH₂ is worth 2.", why:"That’s the theoretical value; this count uses current values." },
              { t:"FADH₂ is worth 0.", why:"It still pumps 6 H⁺." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Does FADH₂ pass complex I?", "No: 6 H⁺, not 10.", "1.5 each."] },
          { id:"e3", goal:3, task:"Explain why a skeletal muscle cell gets 36 (theoretical), not 38.",
            steps:["Glycolysis happens in the cytosol.", "The 2 NADH from glycolysis can’t cross the inner mitochondrial membrane.", "So those 2 NADH are wasted and give 0 ATP.", "That’s 6 ATP lost, so the total is 32."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"Their electrons are passed into the mitochondrion by the glycerol-phosphate shuttle, arriving as FADH₂, worth 2 each instead of 3. That’s 2 ATP lost: 36.", ok:true, why:M5 },
              { t:"They’re turned into lactate.", why:"That’s fermentation." },
              { t:"They cross as NADH and are worth 3.", why:"That’s the malate–aspartate shuttle (38)." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Are the electrons lost, or moved?", "Moved, by a shuttle.", "They arrive as FADH₂: 2 each."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the ledger: how many ‘right’ answers there are, or where 2.5 and 1.5 come from?" },
      { id:"j2", q:"In your own words, why does the ATP count depend on assumptions?" },
      { id:"j3", q:"Explain to a friend how to count ATP for any setting, step by step." },
      { id:"j4", q:"Which part of the count do you still get wrong most often? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Using theoretical values (NADH 3, FADH₂ 2), what is the total ATP per glucose in a prokaryote?", options:[
          { t:"38", ok:true, why:"4 + 10 × 3 + 2 × 2 = 38." },
          { t:"36", why:"Prokaryotes have no shuttle cost." },
          { t:"34", why:"That leaves out the 4 substrate-level ATP." },
          { t:"32", why:"That counts only 8 NADH." }] },
        b:{ prompt:"Using theoretical values, what is the total ATP per glucose in a eukaryotic cell using the glycerol-phosphate shuttle?", options:[
          { t:"36", ok:true, why:"4 + 8 × 3 + 4 × 2 = 36." },
          { t:"38", why:"The shuttle costs 2." },
          { t:"32", why:"Add the 4 substrate-level ATP." },
          { t:"30", why:"That’s the current-value total." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"How many ATP per glucose are made by substrate-level phosphorylation?", options:[
          { t:"4", ok:true, why:"2 (glycolysis, net) + 2 (Krebs)." },
          { t:"2", why:"Add the Krebs cycle’s 2." },
          { t:"6", why:"That uses glycolysis’s gross 4." },
          { t:"0", why:"Glycolysis and the Krebs cycle both make some directly." }] },
        b:{ prompt:"How many NADH per glucose are made in total (all stages)?", options:[
          { t:"10", ok:true, why:M1 },
          { t:"8", why:"Include pyruvate oxidation’s 2." },
          { t:"6", why:"That’s the Krebs cycle alone." },
          { t:"12", why:"That adds the 2 FADH₂." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What range do current estimates give for ATP per glucose?", options:[
          { t:"About 30–32", ok:true, why:"NADH ≈ 2.5 and FADH₂ ≈ 1.5 give 30 or 32, depending on the shuttle." },
          { t:"Exactly 38", why:M3 },
          { t:"About 2–4", why:"That’s fermentation and substrate-level ATP." },
          { t:"About 60–70", why:"Far too high." }] },
        b:{ prompt:"What are the current estimated ATP values for one NADH and one FADH₂?", options:[
          { t:"≈ 2.5 and ≈ 1.5", ok:true, why:"10 H⁺ ÷ 4 and 6 H⁺ ÷ 4." },
          { t:"3 and 2", why:"Those are the theoretical values." },
          { t:"10 and 6", why:"Those are H⁺ pumped, not ATP." },
          { t:"2.5 and 2.5", why:M4 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Using theoretical values, how many ATP per glucose come from oxidative phosphorylation (not substrate-level) in a eukaryote using the glycerol-phosphate shuttle?", options:[
          { t:"32", ok:true, why:"36 − 4." },
          { t:"34", why:"That’s the prokaryote’s 38 − 4." },
          { t:"36", why:"Subtract the substrate-level 4." },
          { t:"30", why:"That’s the current-value total." }] },
        b:{ prompt:"Using current values, how many ATP per glucose come from oxidative phosphorylation in a eukaryote using the glycerol-phosphate shuttle?", options:[
          { t:"26", ok:true, why:"30 − 4." },
          { t:"28", why:"That’s the malate–aspartate figure." },
          { t:"30", why:"Subtract the substrate-level 4." },
          { t:"32", why:"That’s a total, not just the oxidative part." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Using current values, how many ATP does a prokaryote make from 3 glucose?", options:[
          { t:"96", ok:true, why:"32 × 3." },
          { t:"114", why:"That’s the theoretical 38 × 3." },
          { t:"102", why:"That counts FADH₂ at 2.5: 34 per glucose." },
          { t:"84", why:"That leaves out the substrate-level 4 each time." }] },
        b:{ prompt:"Using theoretical values, how many ATP does a eukaryote using the glycerol-phosphate shuttle make from 2 glucose?", options:[
          { t:"72", ok:true, why:"36 × 2." },
          { t:"76", why:"No shuttle cost would give 38." },
          { t:"80", why:"That counts FADH₂ at 3." },
          { t:"64", why:"Add 4 substrate-level per glucose." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A bacterium makes ATP inside its own cytoplasm, so it needs no transport step: its ATP synthase uses 3 H⁺ per ATP. Its chain pumps 10 H⁺ per NADH. About how many ATP per NADH?", options:[
          { t:"About 3.3", ok:true, why:"10 ÷ 3." },
          { t:"2.5", why:"That assumes 4 H⁺ per ATP." },
          { t:"30", why:"Divide, don’t multiply." },
          { t:"0.3", why:"That divides the wrong way." }] },
        b:{ prompt:"A plant mitochondrion’s ATP synthase uses 5 H⁺ per ATP, including transport. FADH₂ pumps 6 H⁺. About how many ATP per FADH₂?", options:[
          { t:"1.2", ok:true, why:"6 ÷ 5." },
          { t:"1.5", why:"That assumes 4 H⁺ per ATP." },
          { t:"30", why:"Divide, don’t multiply. " + M6 },
          { t:"0.83", why:"That divides the wrong way. " + M6 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why one textbook says 36 ATP per glucose and another says about 30–32?", options:[
          { t:"“Both count the same 4 ATP, 10 NADH and 2 FADH₂, but they assume different ATP values per carrier. Newer measurements show about 4 H⁺ per ATP, so NADH ≈ 2.5 and FADH₂ ≈ 1.5.”", ok:true, why:M3 },
          { t:"“One of the textbooks is wrong about the number of NADH.”", why:M1 },
          { t:"“Cells make different amounts of glucose.”", why:"The glucose is the same." },
          { t:"“There’s only one true answer, 36.”", why:M3 }] },
        b:{ prompt:"Which is the best explanation of why NADH is worth about 2.5 ATP rather than 3?", options:[
          { t:"“NADH’s electrons pump about 10 H⁺, and each ATP made and exported uses about 4 H⁺, so 10 ÷ 4 ≈ 2.5.”", ok:true, why:M6 },
          { t:"“Some NADH is destroyed.”", why:"NADH is recycled to NAD⁺." },
          { t:"“NADH passes only two pumps.”", why:"It passes three: I, III and IV." },
          { t:"“ATP synthase needs 10 H⁺ per ATP.”", why:M6 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which statement best compares the ATP yields of aerobic respiration and fermentation?", options:[
          { t:"“Aerobic respiration gives about 30–38 ATP per glucose, depending on assumptions; fermentation gives 2. So aerobic is about 15–19 times more productive.”", ok:true, why:M7 },
          { t:"“Aerobic gives 36; fermentation gives 18.”", why:M7 },
          { t:"“They’re about the same, because both start with glycolysis.”", why:"Only aerobic continues past glycolysis." },
          { t:"“Fermentation gives 0.”", why:"Glycolysis still nets 2." }] },
        b:{ prompt:"Which ledger correctly summarizes one glucose (current values, prokaryote)?", options:[
          { t:"Substrate-level 4 · NADH 10 × 2.5 = 25 · FADH₂ 2 × 1.5 = 3 · total 32", ok:true, why:"4 + 25 + 3 = 32." },
          { t:"Substrate-level 4 · NADH 10 × 3 = 30 · FADH₂ 2 × 2 = 4 · total 32", why:"That adds to 38." },
          { t:"Substrate-level 2 · NADH 10 × 2.5 = 25 · FADH₂ 2 × 1.5 = 3 · total 30", why:M2 },
          { t:"Substrate-level 4 · NADH 8 × 2.5 = 20 · FADH₂ 2 × 1.5 = 3 · total 27", why:M1 }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"During hard exercise, a muscle (glycerol-phosphate shuttle, current values: 30 ATP per glucose) needs 600 ATP-units per second from aerobic respiration. How many glucose per second is that?", options:[
          { t:"20", ok:true, why:"600 ÷ 30." },
          { t:"18 750", why:"Divide, don’t multiply." },
          { t:"16.7", why:"That uses 36." },
          { t:"300", why:"That uses fermentation’s 2." }] },
        b:{ prompt:"A liver cell (malate–aspartate shuttle, current values: 32 ATP per glucose) needs 960 ATP-units per second. How many glucose per second?", options:[
          { t:"30", ok:true, why:"960 ÷ 32." },
          { t:"25.3", why:"That uses 38." },
          { t:"32", why:"That uses 30." },
          { t:"480", why:"That uses fermentation’s 2." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A soil bacterium using nitrate as its final electron acceptor pumps only 6 H⁺ per NADH and 4 per FADH₂, and needs 4 H⁺ per ATP. With 4 substrate-level ATP, 10 NADH and 2 FADH₂, what is its ATP per glucose?", options:[
          { t:"21", ok:true, why:"4 + 10 × 1.5 + 2 × 1." },
          { t:"17", why:"Add the 4 substrate-level ATP." },
          { t:"32", why:"That uses the O₂-based values." },
          { t:"22", why:"That counts FADH₂ like NADH (1.5 each)." }] },
        b:{ prompt:"Another bacterium pumps 8 H⁺ per NADH and 4 per FADH₂, with 4 H⁺ per ATP. What is its ATP per glucose (4 substrate-level, 10 NADH, 2 FADH₂)?", options:[
          { t:"26", ok:true, why:"4 + 10 × 2 + 2 × 1." },
          { t:"22", why:M2 },
          { t:"32", why:M3 },
          { t:"28", why:"FADH₂ is worth 1, not 2." }] } }
    ]
  },
  task:{
    title:"Design an ATP budget", summary:"Design an ATP budget",
    statement:"<p>Invent a bacterium (no mitochondria, no shuttle) whose respiration meets every condition. Each glucose still gives 4 substrate-level ATP, 10 NADH and 2 FADH₂. Can you find all the answers?</p><ol class=\"ac-tlist\"><li>The total is between 30 and 34 ATP per glucose (inclusive).</li><li>FADH₂ pumps exactly 4 fewer H⁺ than NADH (its electrons skip complex I, which pumps 4).</li><li>ATP synthase plus transport needs at least 4 H⁺ per ATP.</li></ol>",
    checks:["Total 30–34", "FADH₂ pumps 4 fewer", "At least 4 H⁺ per ATP"],
    tips:[
      "Total = 4 + (10<i>n</i> + 2<i>f</i>) ÷ <i>h</i>, where <i>n</i> and <i>f</i> are the H⁺ per NADH and per FADH₂, and <i>h</i> is the H⁺ per ATP.",
      "With <i>f</i> = <i>n</i> − 4, the carriers give (12<i>n</i> − 8) ÷ <i>h</i>. You need 26 to 30 from them.",
      "A bigger <i>h</i> needs a bigger <i>n</i> to keep the total up."
    ],
    explainPrompt:"Explain how the three settings work together to set the total, and why condition 2 matches real electron transport chains.",
    vocab:"Use the words proton pump, complex I, ATP synthase and assumption.",
    after3:"Your first answer matches the model values for real mitochondria. The others trade a costlier ATP synthase for harder-working pumps."
  },
  cards:[
    ["Raw materials per glucose", "4 ATP (substrate-level), 10 NADH, 2 FADH₂."],
    ["Where the NADH comes from", "Glycolysis 2 + pyruvate oxidation 2 + Krebs cycle 6."],
    ["Theoretical values", "NADH 3 ATP, FADH₂ 2 ATP."],
    ["Current values", "NADH ≈ 2.5 (10 H⁺ ÷ 4), FADH₂ ≈ 1.5 (6 H⁺ ÷ 4)."],
    ["Prokaryote, theoretical", "4 + 30 + 4 = 38."],
    ["Eukaryote, glycerol-phosphate, theoretical", "2 cytosolic NADH arrive as FADH₂: 4 + 24 + 8 = 36."],
    ["Malate–aspartate shuttle", "Cytosolic NADH arrives as NADH: no loss (38 theoretical, 32 current)."],
    ["Current totals", "About 30–32 per glucose."],
    ["H⁺ per ATP", "≈ 3 to turn the synthase + ≈ 1 for transport ≈ 4."],
    ["Why real yields are lower", "Proton leak, transport costs, shuttles."],
    ["P/O ratio", "ATP made per O atom used: ≈ 2.5 (NADH route), ≈ 1.5 (succinate route)."],
    ["Aerobic vs fermentation", "About 30–38 vs 2 ATP per glucose."]
  ]
};
