// SBI4U 17 Chemiosmosis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/17-chemiosmosis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Electrons stay in the chain. Protons (H⁺) flow through ATP synthase.";
const M2 = "H⁺ flows <strong>down</strong> its gradient: from the intermembrane space back into the matrix.";
const M3 = "ATP synthase’s head faces the matrix (or stroma). ATP appears where the H⁺ comes out.";
const M4 = "An uncoupler speeds the chain up: O₂ use rises, but the energy becomes heat instead of ATP.";
const M5 = "Only H⁺ that passes through ATP synthase makes ATP. Subtract the leak first.";
const M6 = "Both count: more H⁺ outside means a concentration difference and a charge difference.";
const M7 = "In both, H⁺ is pumped away from where ATP is made: into the intermembrane space or lumen, with ATP made in the matrix or stroma.";

// Activity 1 sorter: [text, box, why]
const SORT = [
  ["ATP synthase", "both", "Both organelles make ATP by chemiosmosis, so both have ATP synthase."],
  ["H⁺ builds up in the thylakoid lumen", "chl", "Only chloroplasts have thylakoids."],
  ["O₂ is the final electron acceptor", "mit", "O₂ accepts electrons at complex IV and becomes water."],
  ["Electrons come from water", "chl", "Photosystem II takes electrons from water (photolysis)."],
  ["An electron transport chain pumps H⁺", "both", "Both chains pump H⁺ across a membrane to build a gradient."],
  ["ATP is made in the matrix", "mit", "The matrix is the inside of a mitochondrion."],
  ["NADP⁺ is the final electron acceptor", "chl", "NADP⁺ reductase hands the electrons to NADP⁺, making NADPH."],
  ["Chemiosmosis", "both", "Both make ATP with the energy of an H⁺ gradient."],
  ["Electrons come from NADH and FADH₂", "mit", "These carriers bring electrons from food to the mitochondrial chain."],
  ["Light provides the energy to move electrons", "chl", "Light energizes electrons at the photosystems."]
];
const WRONG_SORT = {
  i3:{ both:"Chloroplast electrons end on NADP⁺, not O₂." },
  i6:{ both:"Chloroplasts make ATP in the stroma." },
  i1:{ mit:"Both organelles have ATP synthase.", chl:"Both organelles have ATP synthase." }
};
const SORT_HINTS = { i7:["What do the light reactions make besides ATP?", "NADPH.", "So NADP⁺ accepts the electrons: chloroplasts only."] };
function sortItems(){
  return SORT.map(function(s, i){
    const id = "i" + (i + 1), it = { id:id, t:s[0], answer:s[1], why:s[2] };
    if (WRONG_SORT[id]) it.wrong = WRONG_SORT[id];
    if (SORT_HINTS[id]) it.hints = SORT_HINTS[id];
    return it;
  });
}

export default {
  id:"17-chemiosmosis",
  kind:"topic",
  title:"Chemiosmosis",
  topic:"Chemiosmosis",
  readyTopic:"chemiosmosis",
  hero:{
    eq:'<span class="cm-heq"><span class="cm-c-h">H⁺</span> (intermembrane space) → through ATP synthase → <span class="cm-c-h">H⁺</span> (matrix),<br>which drives ADP + Pᵢ → <span class="cm-c-atp">ATP</span></span>',
    eqLabel:"H⁺ in the intermembrane space flows through ATP synthase into the matrix, which drives ADP plus Pᵢ to ATP",
    eqSize:"sm",
    headline:"A dam, a turbine, and a stream of protons",
    text:"The electron transport chain fills a reservoir: it pumps <strong>H⁺</strong> into the intermembrane space until it’s crowded and positive there. The only way back is through <strong>ATP synthase</strong>, a protein turbine. As H⁺ rushes through, the rotor spins and the head joins <strong>ADP</strong> and <strong>Pᵢ</strong> into <strong>ATP</strong>. Using a gradient this way is called <strong>chemiosmosis</strong>.",
    fig:{ html:'<div class="cm-hero" id="cm-hero" role="img" aria-label="The inner mitochondrial membrane in cross-section, with the intermembrane space above and the matrix below. Grey pumps push magenta H⁺ up into the intermembrane space until it is crowded: pH 7 above, pH 8 below. Then H⁺ streams back down through ATP synthase, its rotor turns, and orange ATP tokens pop from the head into the matrix. A small dam-and-turbine sketch appears beside it as an analogy, then fades."></div>' }
  },
  goals:[
    "I can describe the H⁺ gradient across the inner mitochondrial membrane and why it stores energy.",
    "I can explain how ATP synthase uses H⁺ flow to make ATP, and where the ATP is made.",
    "I can predict the effects of blocking ATP synthase or adding an uncoupler on ATP, heat and O₂ use.",
    "I can compare chemiosmosis in mitochondria, chloroplasts and bacteria.",
    "I can calculate ATP made from H⁺ counts, including leaks.",
    "I can use evidence from experiments to support the chemiosmotic model."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"ETC and H⁺ pumping", goal:1,
          prompt:"Where does the electron transport chain pump H⁺?",
          options:[
            { t:"From the matrix into the intermembrane space", ok:true, why:"That builds the gradient." },
            { t:"From the intermembrane space into the matrix", why:"That’s the direction H⁺ flows back through ATP synthase." },
            { t:"From the cytosol into the matrix", why:"The pumps are in the inner membrane." },
            { t:"Out of the cell", why:"That’s bacteria, not mitochondria." }],
          hints:["Pumping builds up H⁺ somewhere.", "Between the membranes.", "Matrix → intermembrane space."] },
        { id:"w2", skill:"ETC and H⁺ pumping", goal:5,
          prompt:"Using the model values (NADH 10 H⁺, FADH₂ 6 H⁺), how many H⁺ are pumped for one NADH and one FADH₂?",
          options:[
            { t:"16", ok:true, why:"10 + 6." },
            { t:"20", why:"FADH₂ is worth 6, not 10." },
            { t:"12", why:"NADH is worth 10." },
            { t:"4", why:"Add them." }],
          hints:["Add the two.", "10 + 6.", "16."] },
        { id:"w3", skill:"Diffusion and gradients", goal:1,
          prompt:"Particles diffuse…",
          options:[
            { t:"from where they are more concentrated to where they are less concentrated", ok:true, why:"Down the gradient." },
            { t:"from low to high concentration", why:"That needs energy (active transport)." },
            { t:"only through ATP synthase", why:"Diffusion happens everywhere it’s allowed." },
            { t:"only when ATP is used", why:"Diffusion is passive." }],
          hints:["Think of food colouring in water.", "It spreads out.", "High → low."] },
        { id:"w4", skill:"Diffusion and gradients", goal:1,
          prompt:"A solution at pH 6 compared with one at pH 8 has…",
          options:[
            { t:"a higher H⁺ concentration (100 times higher)", ok:true, why:"Each pH unit is a factor of 10." },
            { t:"a lower H⁺ concentration", why:"Lower pH means more H⁺." },
            { t:"the same H⁺ concentration", why:"The pH differs, so [H⁺] differs." },
            { t:"2 times more H⁺", why:"The scale is logarithmic: 10 × 10." }],
          hints:["Low pH means acidic: more H⁺.", "Each unit is ×10.", "2 units: ×100."] },
        { id:"w5", skill:"ATP", goal:2,
          prompt:"Making ATP from ADP and Pᵢ…",
          options:[
            { t:"needs an input of energy", ok:true, why:"It’s the reverse of ATP hydrolysis (≈ −30.5 kJ/mol)." },
            { t:"releases energy", why:"Hydrolysis releases energy; synthesis needs it." },
            { t:"needs O₂ directly", why:"O₂ isn’t a reactant." },
            { t:"happens only in chloroplasts", why:"Mitochondria and the cytosol make ATP too." }],
          hints:["Breaking ATP releases energy.", "So making it…", "Needs energy."] },
        { id:"w6", skill:"ATP", goal:2,
          prompt:"Which process makes ATP by moving a phosphate group directly from a substrate molecule?",
          options:[
            { t:"Substrate-level phosphorylation", ok:true, why:"As in glycolysis and the Krebs cycle." },
            { t:"Oxidative phosphorylation", why:"That uses the H⁺ gradient." },
            { t:"Photolysis", why:"That splits water." },
            { t:"Chemiosmosis", why:"Chemiosmosis uses a gradient, not a substrate." }],
          hints:["Which kind uses no membrane?", "The phosphate comes from a molecule.", "Substrate-level."] }
      ],
      refreshers:{
        "ETC and H⁺ pumping":"Complexes I, III and IV pump H⁺ from the matrix to the intermembrane space. Model values: NADH → 10 H⁺, FADH₂ → 6 H⁺.",
        "Diffusion and gradients":"Particles move down a concentration gradient on their own. pH 7 vs pH 8 is a 10-fold difference in H⁺.",
        "ATP":"ADP + Pᵢ → ATP needs ≈ 30.5 kJ/mol. Substrate-level phosphorylation moves a phosphate from a molecule; oxidative phosphorylation uses the H⁺ gradient."
      }
    }
  },
  explore:{
    heading:"Gradient and turbine",
    intro:"Run the pumps, then let H⁺ flow back. Find out what makes ATP, what makes heat, and what happens when you block the turbine or poke holes in the membrane.",
    modes:[["set", "Set the pumps"], ["resp", "Respiratory control"], ["brown", "Brown fat"]],
    modeHelp:{
      set:"Set the pumps: you control the electron transport chain directly.",
      resp:"Respiratory control: the cell’s ATP demand sets the pace of the chain.",
      brown:"Brown fat: thermogenin channels let H⁺ back into the matrix on purpose."
    },
    capIdle:"Change a control, then watch the H⁺, the rotor and the counts.",
    leaks:[[0, "none (0)"], [4, "low (4)"], [8, "high (8)"]],
    toggles:[["dots", "Show H⁺ dots"], ["dam", "Show dam analogy"]],
    damTitle:"The dam analogy",
    damKey:[
      ["Reservoir behind the dam", "H⁺ crowded in the intermembrane space"],
      ["Pump refilling the reservoir", "the electron transport chain"],
      ["Turbine in the dam", "ATP synthase (the generator makes ATP)"],
      ["Spillway", "an uncoupler leak: the energy becomes heat"]
    ],
    modelNote:"<strong>How the model counts.</strong> ATP made per tick = (H⁺ through the synthase) ÷ 4. H⁺ through the synthase = pumping − leak, when the synthase is on. Heat (in “H⁺ units”) = the leak. O₂ used per 10 ticks = pumping ÷ 2 (NADH model: 10 H⁺ per electron pair, ½ O₂ per pair). Respiratory control: pumping = 4 × demand + leak, so the chain runs just fast enough to hold the gradient. Synthase blocked: the gradient rises to its maximum and pumping falls to the leak rate (the pumps can’t push against a steeper gradient). About 4 H⁺ per ATP delivered to the cytosol is a model value: about 3 turn the synthase and about 1 moves ATP, ADP and Pᵢ across the membrane; the exact number depends on the organism’s synthase. The pH values are model values too: the real pH difference is small, and the charge difference stores most of the energy in mitochondria.",
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"set", P:12, L:0, syn:true }, to:{ syn:false },
        prompt:"<span class=\"muted\">Set the pumps: pumping 12, no leak.</span> Now ATP synthase is switched to “blocked”. What happens?",
        options:[
          { t:"ATP stops; the gradient climbs to its maximum and the pumps stall", ok:true },
          { t:"ATP is made in the intermembrane space instead" },
          { t:"The gradient disappears" },
          { t:"H⁺ flows back through the pumps and makes ATP there" }],
        explain:"With no way back, H⁺ piles up until the pumps can’t push more. ATP is made only where H⁺ exits through the synthase, on the matrix side." },
      { id:"p2", start:{ mode:"set", P:12, L:8, syn:true }, hide:true,
        prompt:"<span class=\"muted\">Pumping 12, high leak (8), synthase on.</span> How many ATP per tick?",
        options:[{ t:"1", ok:true }, { t:"3" }, { t:"2" }, { t:"0" }],
        explain:"12 − 8 = 4 through the turbine, and 4 ÷ 4 = 1 ATP. The other 8 H⁺ leak back as heat." },
      { id:"p3", start:{ mode:"resp", D:3, L:0, syn:true }, to:{ L:8 },
        prompt:"<span class=\"muted\">Respiratory control: demand 3, no leak (pumping 12, O₂ 6 per 10 ticks).</span> Now the leak is set to high. What happens to O₂ use?",
        options:[{ t:"It rises (to 10 per 10 ticks)", ok:true }, { t:"It falls" }, { t:"No change" }, { t:"It stops" }],
        explain:"The leak drains the gradient, so the chain speeds up to keep ATP at 3, and burns more fuel and O₂." },
      { id:"p4", start:{ mode:"brown", D:2, T:0, syn:true }, to:{ T:16 },
        prompt:"<span class=\"muted\">Brown fat: demand 2, thermogenin 0.</span> Now thermogenin is raised to 16. Which is true?",
        options:[{ t:"ATP stays at 2, while O₂ use and heat rise", ok:true }, { t:"ATP falls to 0" }, { t:"Heat falls" }, { t:"O₂ use stops" }],
        explain:"Thermogenin is a built-in uncoupler: brown fat burns fuel mainly to make heat." }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:5, prompt:"Set the pumps, with no leak: make exactly <strong>3 ATP per tick</strong>.",
        why:"12 H⁺ pass through the turbine, and 12 ÷ 4 = 3 ATP.",
        wrong:{ mode:"Switch the mode to <strong>Set the pumps</strong> first.", leak:"Set the leak to none first.", p16:"4 ATP: one step too many.", p8:"2 ATP.", blocked:"Nothing passes the turbine." },
        hints:["How many H⁺ per ATP?", "4.", "3 × 4 = 12."] },
      { id:"tc2", goal:5, prompt:"Set the pumps, with a low leak: make exactly <strong>4 ATP per tick</strong>.",
        why:"20 − 4 = 16 H⁺ pass through the turbine, and 16 ÷ 4 = 4 ATP.",
        wrong:{ mode:"Switch the mode to <strong>Set the pumps</strong> first.", leak:"Use a low leak (4 H⁺ per tick).", p16:"16 − 4 = 12 through the turbine: only 3 ATP.", blocked:"Nothing passes the turbine." },
        hints:["The leak takes 4 first.", "You need 16 through the synthase.", "16 + 4 = 20."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Brown fat: release <strong>at least 8</strong> H⁺ per tick as heat while making exactly <strong>2 ATP per tick</strong>, using the <strong>least O₂</strong> possible.",
        why:"Demand 2 sends 8 H⁺ through the synthase, and thermogenin 8 releases 8 as heat. Pumping is 16, the least that does both, so O₂ use is 8 per 10 ticks.",
        wrong:{ mode:"Switch to <strong>Brown fat</strong> mode first.", more:"That works, but uses more O₂ (10 or 12 per 10 ticks) than needed.", t4:"Heat is only 4.", t0:"No H⁺ leaks, so there’s no heat.", d3:"That’s 3 ATP.", blocked:"Nothing passes the turbine: no ATP." },
        hints:["Pumping = 4 × demand + leak, and O₂ rises with pumping.", "Demand 2 means 8 H⁺ for ATP. The smallest leak that gives at least 8 heat is 8.", "Demand 2, thermogenin 8: pumping 16, O₂ 8 per 10 ticks."] }
    ]
  },
  part3:{
    slug:"compare", name:"Compare",
    heading:"Two chemiosmosis machines",
    intro:"Mitochondria and chloroplasts run the same mechanism. Set them side by side to see which way each pumps H⁺ and where each makes ATP, then test the model against the experiments that persuaded scientists.",
    builder:{
      title:"Station 1: side-by-side builder",
      how:"Tap a label, then tap the place on the diagram where it belongs. The comparison table fills in as you go.",
      rule:"In every case, H⁺ is pumped away from where ATP is made.",
      labelHints:{ esrc:"Electrons enter the chain at its start.", eacc:"The final acceptor takes the electrons at the end of the chain.", energy:"Look for what powers the whole process." },
      labels:[["hin", "H⁺ pumped into"], ["atp", "ATP made in"], ["esrc", "Electrons come from"], ["eacc", "Final electron acceptor"], ["energy", "Energy source"]],
      orgs:[
        { id:"mit", name:"Mitochondrion", sub:"inner mitochondrial membrane", labels:["hin", "atp", "esrc", "eacc", "energy"],
          zones:{ ims:"Intermembrane space", mem:"Inner mitochondrial membrane", mat:"Matrix", nadh:"NADH and FADH₂", o2:"O₂ (→ H₂O)", food:"Fuel from food" },
          answer:{ hin:"ims", atp:"mat", esrc:"nadh", eacc:"o2", energy:"food" } },
        { id:"chl", name:"Chloroplast", sub:"thylakoid membrane", labels:["hin", "atp", "esrc", "eacc", "energy"],
          zones:{ str:"Stroma", mem:"Thylakoid membrane", lum:"Thylakoid lumen", h2o:"Water (H₂O)", nadp:"NADP⁺ (→ NADPH)", light:"Light" },
          answer:{ hin:"lum", atp:"str", esrc:"h2o", eacc:"nadp", energy:"light" } },
        { id:"bac", name:"Bacterium", sub:"plasma membrane", labels:["hin", "atp"],
          zones:{ out:"Outside the cell", mem:"Plasma membrane", cyt:"Cytoplasm" },
          answer:{ hin:"out", atp:"cyt" } }
      ],
      bacDone:"Bacterium: H⁺ is pumped out across the plasma membrane, and ATP is made in the cytoplasm as H⁺ flows back in.",
      table:{
        head:["Feature", "Mitochondrion", "Chloroplast"],
        rows:[
          ["Membrane", "Inner mitochondrial membrane", "Thylakoid membrane", null],
          ["H⁺ builds up in", "Intermembrane space", "Thylakoid lumen (pumped in, and released there by water splitting)", "hin"],
          ["ATP made in", "Matrix", "Stroma", "atp"],
          ["Electrons come from", "NADH and FADH₂ (food)", "Water (energized by light)", "esrc"],
          ["Final electron acceptor", "O₂ (→ H₂O)", "NADP⁺ (→ NADPH)", "eacc"],
          ["Name", "Oxidative phosphorylation", "Photophosphorylation", "all"]
        ]
      }
    },
    evidence:{
      title:"Station 2: evidence for Mitchell’s idea",
      panel:"Check it with data",
      intro:"In 1961, Peter Mitchell proposed that a proton gradient, not a high-energy chemical intermediate, links electron transport to ATP synthesis. Many scientists doubted him at first. He received the 1978 Nobel Prize in Chemistry.",
      how:"For each experiment card, choose every claim it shows, then press <strong>Check</strong>.",
      claims:[["g", "A gradient alone can drive ATP synthesis"], ["i", "The gradient must be intact"], ["s", "ATP synthase doesn’t need the ETC itself"]],
      cards:[
        { id:"x1", title:"The acid bath", from:"(from module 06)",
          text:"Thylakoids soaked at pH 4, then moved to pH 8 with ADP and Pᵢ, make ATP in the dark.",
          answer:["g"],
          right:"With no light, no electrons were moving: the pH difference alone made the ATP.",
          wrong:{ i:"Nothing in this experiment made the membrane leaky.", s:"These thylakoids still had their electron transport chain, even though it wasn’t running. Another card tests this directly." },
          missing:"Choose the claim this experiment shows." },
        { id:"x2", title:"Artificial vesicles", from:"",
          text:"A light-driven H⁺ pump from a microbe was placed in membrane vesicles with ATP synthase from mitochondria. In light, the vesicles made ATP; in the dark, none.",
          answer:["g", "s"],
          right:"There was no electron transport chain: only a light-driven pump and ATP synthase. The gradient alone drove ATP synthase, so the synthase doesn’t need the ETC itself.",
          wrong:{ i:"Nothing in this experiment made the membrane leaky." },
          missing:"Another claim fits this card too: look at what was <strong>missing</strong> from the vesicles." },
        { id:"x3", title:"Uncouplers", from:"",
          text:"Chemicals that let H⁺ cross membranes stop ATP synthesis, while O₂ use continues or rises.",
          answer:["i"],
          right:"The chain still runs (O₂ use continues), but with H⁺ leaking across the membrane no ATP is made: the gradient must be intact.",
          wrong:{ g:"Here a gradient was being built, but the uncoupler let it leak away.", s:"The chain was present and running here (O₂ use continued)." },
          missing:"Choose the claim this experiment shows." }
      ],
      vesicle:{ on:"Light on: the pump moves H⁺ into the vesicle, and H⁺ flows out through ATP synthase. ATP made: yes.", off:"Light off: no pumping, no gradient. ATP made: none." },
      graph:{ yLabel:"rates in relative units", added:"uncoupler added", o2:"O₂ use", atp:"ATP synthesis",
        describe:"Model data. Rates of O₂ use and ATP synthesis in mitochondria over 10 minutes. Both are steady at 8 units until an uncoupler is added at 5 minutes. Then O₂ use rises to 16 units and ATP synthesis falls to 0." }
    },
    quickCheck:{
      title:"Quick check", summary:"Two chemiosmosis machines quick check",
      items:[
        { id:"q1", goal:4, prompt:"In chloroplasts, where is ATP made?",
          choices:[
            { t:"Stroma", ok:true, fb:"H⁺ builds up in the lumen and flows out to the stroma through ATP synthase." },
            { t:"Lumen", fb:"H⁺ builds up in the lumen and flows out to the stroma through ATP synthase." },
            { t:"Matrix", fb:"H⁺ builds up in the lumen and flows out to the stroma through ATP synthase." },
            { t:"Intermembrane space", fb:"H⁺ builds up in the lumen and flows out to the stroma through ATP synthase." }] },
        { id:"q2", goal:6, prompt:"What did the artificial-vesicle experiment show?",
          choices:[
            { t:"A gradient alone can drive ATP synthase", ok:true, fb:"There was no electron transport chain: only a light-driven pump and ATP synthase." },
            { t:"ATP needs O₂", fb:"There was no electron transport chain: only a light-driven pump and ATP synthase." },
            { t:"Light makes ATP directly", fb:"There was no electron transport chain: only a light-driven pump and ATP synthase." },
            { t:"Electrons pass through ATP synthase", fb:"There was no electron transport chain: only a light-driven pump and ATP synthase." }] },
        { id:"q3", goal:4, prompt:"Where does H⁺ build up in a bacterium?",
          choices:[
            { t:"Outside the plasma membrane", ok:true, fb:"Bacteria have no mitochondria; their chain is in the plasma membrane." },
            { t:"In the cytoplasm", fb:"Bacteria have no mitochondria; their chain is in the plasma membrane." },
            { t:"In a matrix", fb:"Bacteria have no mitochondria; their chain is in the plasma membrane." },
            { t:"In a lumen", fb:"Bacteria have no mitochondria; their chain is in the plasma membrane." }] },
        { id:"q4", goal:4, prompt:"What do mitochondria and chloroplasts share?",
          choices:[
            { t:"An H⁺ gradient driving ATP synthase", ok:true, fb:"Their acceptors (O₂ vs NADP⁺) and electron sources differ." },
            { t:"The same final electron acceptor", fb:"Their acceptors (O₂ vs NADP⁺) and electron sources differ." },
            { t:"The same electron source", fb:"Their acceptors (O₂ vs NADP⁺) and electron sources differ." },
            { t:"The same location for ATP synthase in the cell", fb:"Their acceptors (O₂ vs NADP⁺) and electron sources differ." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"machine", type:"sorter", title:"Which machine?", noun:"card", goal:4, txt:true,
        instruction:"Ten features of chemiosmosis. Sort each one: does it belong to mitochondria only, chloroplasts only, or both?",
        boxes:[{ id:"mit", label:"Mitochondria only" }, { id:"chl", label:"Chloroplasts only" }, { id:"both", label:"Both" }],
        wrongDefault:"Check the comparison table from Part 3.",
        items:sortItems() },
      { id:"arith", type:"custom", title:"Gradient arithmetic and evidence", summary:"Gradient arithmetic and evidence", star:true, goal:[3, 5, 6],
        instruction:"Six problems on H⁺ counts and experiments. Problems 3 to 6 are non-routine; the last two go beyond the Final Check.", how:"",
        items:[
          { id:"c1", kind:"num", goal:5, prompt:"40 H⁺ pumped, no leak, 4 H⁺ per ATP. ATP made?",
            answer:10, display:"10 ATP", unit:"ATP",
            wrong:[{ match:160, fb:"Divide, don’t multiply." }] },
          { id:"c2", kind:"num", goal:5, prompt:"40 H⁺ pumped, 8 leak. ATP made?", use:"Model value: 4 H⁺ per ATP.",
            answer:8, display:"8 ATP", unit:"ATP",
            wrong:[{ match:10, fb:M5 }] },
          { id:"c3", kind:"chips", goal:[3, 6], star:true,
            prompt:"<span class=\"tag\">Investigation</span> Mitochondria with fuel use O₂ slowly. ADP is added: O₂ use jumps. Oligomycin is added: O₂ use falls back. DNP is added: O₂ use jumps again. Which statement explains the last step?",
            options:[
              { t:"DNP lets H⁺ leak, so the chain runs fast even though ATP synthase is blocked", ok:true, why:"DNP gives H⁺ another way back, so the gradient drains and the chain speeds up, but no ATP is made." },
              { t:"DNP reverses oligomycin", why:"DNP doesn’t touch ATP synthase; it bypasses it." },
              { t:"DNP blocks the electron transport chain", why:"If the chain were blocked, O₂ use would fall, not jump." },
              { t:"DNP makes ATP synthase run faster", why:"Oligomycin still blocks the synthase. DNP doesn’t touch ATP synthase; it bypasses it." }],
            hints:["Oligomycin blocked the synthase, so H⁺ couldn’t return.", "DNP gives H⁺ another way back.", "The gradient drains, so the chain speeds up, but makes no ATP."] },
          { id:"c4", kind:"pair", goal:5, star:true,
            prompt:"Using 10 H⁺ per NADH, 6 per FADH₂ and 4 per ATP: ATP per NADH, and per FADH₂?",
            answer:[2.5, 1.5], labels:["ATP per NADH", "ATP per FADH₂"], display:"2.5 ATP per NADH and 1.5 ATP per FADH₂",
            wrongPair:[{ match:[3, 2], fb:"Those are the older whole-number values. Use the H⁺ counts given." }],
            wrongFb:"Divide each H⁺ count by 4." },
          { id:"c5", kind:"num", goal:3, star:true, pct:true,
            prompt:"<span class=\"tag\">STSE</span> In the 1930s, DNP was sold as a weight-loss drug, and some people died of overheating. If a dose makes 75% of pumped H⁺ leak, what fraction of the gradient’s energy still makes ATP?",
            answer:25, display:"25% (one quarter)", unit:"%", label:"Your answer (as a percentage):",
            wrong:[{ match:75, fb:"75% leaks as heat; only the rest passes the synthase." }] },
          { id:"c6", kind:"num", goal:5, star:true,
            prompt:"A bacterium makes ATP in its cytoplasm, so it needs no transport step: 3 H⁺ per ATP. It pumps 30 H⁺, and 6 leak. ATP made?",
            answer:8, display:"8 ATP", unit:"ATP",
            wrong:[{ match:6, fb:"Use 3 H⁺ per ATP here, not 4: (30 − 6) ÷ 3 = 8." }],
            hints:["Subtract the leak.", "24 H⁺ through the synthase.", "24 ÷ 3 = 8."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Isaac", goal:[2, 3, 4], how:"",
        instruction:"Isaac made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how ATP synthase makes ATP in a mitochondrion.",
            steps:["The ETC pumps H⁺ into the intermembrane space.", "H⁺ is now more concentrated outside the matrix.", "ATP synthase pumps H⁺ from the matrix into the intermembrane space, and this pumping makes ATP.", "So ATP is made in the intermembrane space."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"H⁺ flows back <strong>down</strong> its gradient through ATP synthase into the matrix; the flow turns the rotor, and ATP is made on the matrix side.", ok:true, why:M2 },
              { t:"Electrons flow through ATP synthase.", why:M1 },
              { t:"ATP synthase uses ATP to pump H⁺.", why:"That’s its reverse direction, not ATP synthesis." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which way is downhill for H⁺?", "From high to low concentration.", "Intermembrane space → matrix."] },
          { id:"e2", goal:3, task:"Predict the effect of an uncoupler on a cell.",
            steps:["An uncoupler lets H⁺ cross the inner membrane without passing ATP synthase.", "So less H⁺ passes through ATP synthase, and less ATP is made.", "Because the gradient is gone, the ETC has no reason to run, so O₂ use stops.", "So the cell stays cool."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"The chain keeps pumping, and even speeds up as the gradient drains: O₂ use rises, and the energy is released as heat.", ok:true, why:M4 },
              { t:"The uncoupler blocks complex IV.", why:"That’s cyanide." },
              { t:"ATP production rises.", why:"Less H⁺ passes the synthase." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Does the chain need a gradient to run?", "It runs faster when the gradient is lower.", "More O₂ use, more heat."] },
          { id:"e3", goal:4, task:"Compare chemiosmosis in a chloroplast with a mitochondrion.",
            steps:["Both organelles use an electron transport chain to pump H⁺.", "In a chloroplast, H⁺ builds up in the thylakoid lumen.", "So ATP synthase releases ATP into the lumen.", "The Calvin cycle then uses this ATP in the lumen."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"H⁺ flows out of the lumen through ATP synthase, so ATP is released into the stroma, where the Calvin cycle uses it.", ok:true, why:M3 + " " + M7 },
              { t:"ATP is made in the cytosol.", why:"The Calvin cycle is in the stroma." },
              { t:"Chloroplasts don’t use ATP synthase.", why:"They do." },
              { t:"Step 3 is correct.", why:M3 + " " + M7 }],
            hints:["Where does H⁺ come out of ATP synthase?", "Into the stroma.", "ATP is made in the stroma."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: that blocking ATP synthase stops O₂ use, or that a leak speeds it up?" },
      { id:"j2", q:"In your own words, why does an H⁺ gradient store energy?" },
      { id:"j3", q:"Explain to a friend how to tell where ATP is made in any chemiosmosis machine." },
      { id:"j4", q:"Which idea in this module is still shaky for you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"In a mitochondrion, H⁺ flows through ATP synthase…", options:[
          { t:"from the intermembrane space into the matrix", ok:true, why:M2 },
          { t:"from the matrix into the intermembrane space", why:"That’s the pumping direction." },
          { t:"from the cytosol into the intermembrane space", why:"Both sides are inside the inner membrane system." },
          { t:"from the outer membrane into the cytosol", why:"ATP synthase is in the inner membrane." }] },
        b:{ prompt:"In a chloroplast, ATP synthase releases ATP into the…", options:[
          { t:"stroma", ok:true, why:M3 },
          { t:"thylakoid lumen", why:"H⁺ builds up there." },
          { t:"cytosol", why:"The Calvin cycle uses it in the stroma." },
          { t:"intermembrane space", why:"That’s a mitochondrial term." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What passes through ATP synthase to drive it?", options:[
          { t:"Hydrogen ions (H⁺), moving down their gradient", ok:true, why:M1 },
          { t:"Electrons", why:"Electrons stay in the chain." },
          { t:"ATP molecules", why:"ATP is the product." },
          { t:"O₂ molecules", why:"O₂ is used at complex IV." }] },
        b:{ prompt:"What turns when ATP synthase works?", options:[
          { t:"A rotor in the membrane, spun by H⁺ flowing through it", ok:true, why:"The flow turns the rotor, and the head (facing the matrix) attaches Pᵢ to ADP." },
          { t:"Cytochrome <i>c</i>", why:"That’s a mobile electron carrier." },
          { t:"The whole mitochondrion", why:"Only the synthase’s rotor turns." },
          { t:"The electron transport chain", why:"The chain doesn’t rotate." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What is chemiosmosis?", options:[
          { t:"Making ATP using the energy of an H⁺ gradient across a membrane", ok:true, why:"The gradient stores energy, like water behind a dam, and ATP synthase uses it." },
          { t:"Water moving across a membrane", why:"That’s osmosis." },
          { t:"Making ATP by moving a phosphate from a substrate", why:"That’s substrate-level phosphorylation." },
          { t:"Splitting water with light", why:"That’s photolysis." }] },
        b:{ prompt:"What is oxidative phosphorylation?", options:[
          { t:"ATP synthesis powered by the electron transport chain, through chemiosmosis", ok:true, why:"ETC + chemiosmosis together are oxidative phosphorylation." },
          { t:"ATP made in glycolysis", why:"That’s substrate-level." },
          { t:"Using O₂ to attach phosphate to ADP directly", why:"O₂ only accepts electrons." },
          { t:"The Krebs cycle’s ATP step", why:"That’s substrate-level." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Oligomycin blocks ATP synthase. In respiring mitochondria, what happens to ATP synthesis and O₂ use?", options:[
          { t:"ATP synthesis stops, and O₂ use falls to a low level", ok:true, why:"The gradient builds up and the chain stalls." },
          { t:"ATP synthesis stops, but O₂ use rises", why:"That’s an uncoupler." },
          { t:"Both continue normally", why:"The synthase is the only way H⁺ makes ATP." },
          { t:"ATP synthesis rises", why:"The turbine is blocked." }] },
        b:{ prompt:"DNP is an uncoupler. In respiring mitochondria, what happens to ATP synthesis, O₂ use and heat?", options:[
          { t:"ATP synthesis falls; O₂ use and heat rise", ok:true, why:M4 },
          { t:"All three fall", why:"The chain speeds up." },
          { t:"ATP rises; O₂ use falls", why:"That reverses the effect." },
          { t:"Nothing changes", why:"The leak drains the gradient." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Mitochondria pump 40 H⁺, and 8 leak back through an uncoupler. At 4 H⁺ per ATP, how many ATP are made?", options:[
          { t:"8", ok:true, why:"(40 − 8) ÷ 4." },
          { t:"10", why:"That ignores the leak." },
          { t:"12", why:"That adds the leak." },
          { t:"32", why:"Divide by 4." }] },
        b:{ prompt:"Mitochondria pump 30 H⁺, and 6 leak back. At 4 H⁺ per ATP, how many ATP are made?", options:[
          { t:"6", ok:true, why:"(30 − 6) ÷ 4." },
          { t:"7.5", why:"That ignores the leak." },
          { t:"9", why:"That adds the leak." },
          { t:"24", why:"Divide by 4." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Isolated mitochondria with no fuel are given ADP and Pᵢ. The solution outside is made acidic (low pH), so H⁺ is high in the intermembrane space and low in the matrix. What is the best prediction?", options:[
          { t:"ATP is made briefly, until the gradient runs down", ok:true, why:"A gradient alone can drive ATP synthase." },
          { t:"No ATP, because no electrons are flowing", why:"The gradient is what the synthase uses." },
          { t:"ATP is made continuously", why:"Without pumping, the gradient runs out." },
          { t:"The ETC runs backward to make O₂", why:"Nothing like that happens." }] },
        b:{ prompt:"Scientists make inside-out membrane vesicles from mitochondria, so the ATP synthase heads face outward. When the ETC runs, H⁺ is pumped <strong>into</strong> the vesicles. Where is ATP made?", options:[
          { t:"In the solution outside the vesicles", ok:true, why:"H⁺ flows out through the synthase, and the heads face out." },
          { t:"Inside the vesicles", why:"The heads face outward." },
          { t:"Nowhere: inside-out vesicles can’t work", why:"The direction is reversed but consistent." },
          { t:"In the membrane itself", why:"ATP is released from the head." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why the inner mitochondrial membrane must be almost impermeable to H⁺?", options:[
          { t:"“If H⁺ could leak back freely, the gradient would collapse, and its energy would be lost as heat instead of driving ATP synthase.”", ok:true, why:"The membrane must stay sealed: only H⁺ that flows back through ATP synthase makes ATP." },
          { t:"“So electrons can’t escape.”", why:"H⁺ is the issue, not electrons." },
          { t:"“So O₂ can’t enter the matrix.”", why:"O₂ crosses easily." },
          { t:"“So ATP can’t leave.”", why:"ATP leaves through a transporter." }] },
        b:{ prompt:"Which is the best description of why the H⁺ gradient stores energy?", options:[
          { t:"“H⁺ is crowded on one side and that side is more positive, so H⁺ tends to flow back. Both the concentration difference and the charge difference can do work.”", ok:true, why:M6 },
          { t:"“H⁺ ions contain ATP.”", why:"They don’t." },
          { t:"“Only the concentration difference matters.”", why:M6 },
          { t:"“The gradient stores electrons.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which row correctly compares the two organelles?", options:[
          { t:"Mitochondrion: H⁺ builds up in the intermembrane space, ATP made in the matrix. Chloroplast: H⁺ builds up in the lumen, ATP made in the stroma.", ok:true, why:M7 },
          { t:"Mitochondrion: H⁺ in the matrix, ATP in the intermembrane space. Chloroplast: H⁺ in the stroma, ATP in the lumen.", why:M2 + " " + M3 },
          { t:"Both: H⁺ in the matrix, ATP in the stroma.", why:M7 },
          { t:"Mitochondrion: H⁺ in the intermembrane space, ATP in the matrix. Chloroplast: H⁺ in the stroma, ATP in the lumen.", why:M7 }] },
        b:{ prompt:"Which description of a bacterium’s chemiosmosis is correct?", options:[
          { t:"H⁺ is pumped out across the plasma membrane, and ATP is made in the cytoplasm as H⁺ flows back in", ok:true, why:"Bacteria have no mitochondria; their chain is in the plasma membrane, and H⁺ is pumped away from where ATP is made." },
          { t:"H⁺ is pumped into the cytoplasm, and ATP is made outside the cell", why:"That’s backwards: H⁺ flows <strong>down</strong> its gradient, back into the cytoplasm, where ATP synthase’s head releases ATP." },
          { t:"Bacteria make all their ATP by substrate-level phosphorylation", why:"Many bacteria have ETCs." },
          { t:"Bacteria use mitochondria", why:"Bacteria have no mitochondria." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Newborns and hibernating mammals have brown fat, whose mitochondria contain thermogenin, a protein channel that lets H⁺ back into the matrix. Why is this useful?", options:[
          { t:"The gradient’s energy is released as heat, which warms the body", ok:true, why:"Thermogenin is a built-in uncoupler: brown fat burns fuel mainly to make heat." },
          { t:"It makes extra ATP for shivering", why:"H⁺ bypasses ATP synthase." },
          { t:"It stops respiration to save fuel", why:"Respiration speeds up." },
          { t:"It stores H⁺ for spring", why:"The gradient can’t be stored that way." }] },
        b:{ prompt:"Why was DNP, once sold as a diet drug, dangerous?", options:[
          { t:"It uncouples respiration: fuel is burned rapidly, the energy becomes heat, and body temperature can rise to fatal levels", ok:true, why:M4 },
          { t:"It blocks complex IV like cyanide", why:"It’s an uncoupler, not a blocker." },
          { t:"It stops all ATP use", why:"It cuts ATP production." },
          { t:"It makes fat into ATP directly", why:"It wastes the gradient as heat." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"In a hibernating ground squirrel’s brown fat, mitochondria pump 80 H⁺ per second, and half of them leak through thermogenin. At 4 H⁺ per ATP, how many ATP are made per second?", options:[
          { t:"10", ok:true, why:"40 through the synthase ÷ 4." },
          { t:"20", why:"Subtract the leak." },
          { t:"40", why:"That’s H⁺, not ATP." },
          { t:"5", why:"That takes off the leak twice: 40 H⁺ already pass the synthase, and 40 ÷ 4 = 10." }] },
        b:{ prompt:"A brown-fat cell’s mitochondria pump 90 H⁺ per second, and one third leak through thermogenin. At 4 H⁺ per ATP, how many ATP per second?", options:[
          { t:"15", ok:true, why:"60 ÷ 4." },
          { t:"22.5", why:"Subtract the leak." },
          { t:"7.5", why:"That uses the leaked 30." },
          { t:"60", why:"That’s H⁺, not ATP." }] } }
    ]
  },
  task:{
    title:"Warm and working", summary:"Warm and working",
    statement:"<p>Tune a brown-fat mitochondrion in the simulator so it keeps an animal warm and still makes ATP. Can you find all the answers?</p><ol class=\"cm-tlist\"><li>At least 3 ATP per tick.</li><li>At least 8 H⁺ per tick released as heat.</li><li>O₂ use of at most 12 per 10 ticks.</li></ol><p class=\"tiny muted\"><span class=\"bio-model\">Model</span> As in the simulator: ATP = (pumping − leak) ÷ 4 with the synthase on; heat = the leak (H⁺ through thermogenin); O₂ per 10 ticks = pumping ÷ 2.</p>",
    checks:["At least 3 ATP per tick", "At least 8 heat", "O₂ at most 12 per 10 ticks"],
    tips:[
      "ATP needs at least 12 H⁺ through the synthase, after the leak.",
      "Heat is the leak: at least 8.",
      "O₂ caps pumping at 24. So pumping − leak ≥ 12 with pumping ≤ 24."
    ],
    explainPrompt:"Explain how the leak, the ATP target and the O₂ limit together decided your settings.",
    vocab:"Use the words gradient, ATP synthase, uncoupler and heat.",
    more:"There’s more than one answer. Can you find another?",
    after3:"The O₂ limit and the ATP need squeeze the leak: it can’t be more than 24 − 12 = 12."
  },
  cards:[
    ["Chemiosmosis", "Making ATP with the energy of an H⁺ gradient across a membrane."],
    ["Proton-motive force", "The H⁺ gradient’s stored energy: a concentration difference plus a charge difference."],
    ["ATP synthase", "A protein turbine: H⁺ flowing down its gradient turns the rotor, and the head makes ATP."],
    ["Mitochondrial H⁺ direction", "Pumped matrix → intermembrane space; flows back through ATP synthase into the matrix."],
    ["Where ATP is made", "Mitochondria: matrix. Chloroplasts: stroma. Bacteria: cytoplasm."],
    ["H⁺ per ATP (model)", "About 4 per ATP delivered (≈ 3 to turn the synthase, ≈ 1 for transport)."],
    ["Uncoupler", "Lets H⁺ leak back without ATP synthase: less ATP, more O₂ use, more heat (DNP, thermogenin)."],
    ["Oligomycin", "Blocks ATP synthase: no ATP; the gradient builds; O₂ use falls."],
    ["Brown fat", "Thermogenin leaks H⁺ on purpose, making heat (newborns, hibernators)."],
    ["Oxidative phosphorylation", "ETC + chemiosmosis in mitochondria."],
    ["Photophosphorylation", "Light-driven ETC + chemiosmosis in chloroplasts."],
    ["Peter Mitchell", "Proposed the chemiosmotic model (1961); Nobel Prize in Chemistry, 1978."]
  ]
};
