// SBI4U 05 Noncyclic Electron Flow. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/05-noncyclic-electron-flow.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The numbers record the order of discovery. Electrons go through PSII first, then PSI.";
const M2 = "O₂ is a by-product of splitting water. NADPH’s electrons come from water, via both photosystems.";
const M3 = "Each electron is boosted twice, at PSII and at PSI: 2 photons per electron.";
const M4 = "P700 has to get back an electron for every one it sends. Those come from PSII, through plastocyanin.";
const M5 = "Find where the block is: everything downstream loses electrons, and everything upstream backs up.";
const M6 = "Plastoquinone: PSII → b₆f (in the membrane). Plastocyanin: b₆f → PSI (in the lumen). Ferredoxin: after PSI.";
const M7 = "Cyclic flow only moves H⁺ (to make ATP). No water is split and no NADP⁺ is reduced.";
const E1W = "PSII hands electrons to plastoquinone; PSI hands them to ferredoxin.";
const E2W = "NADPH contains no oxygen from O₂.";
const E3W = "Look at the Z: two uphill strokes.";
const DCMU = "With PSII cut off, water isn’t split (no O₂), and no electrons reach PSI (no NADPH).";

export default {
  id:"05-noncyclic-electron-flow",
  kind:"topic",
  title:"Noncyclic electron flow",
  topic:"Noncyclic Electron Flow",
  readyTopic:"noncyclic electron flow",
  hero:{
    headline:"One electron, two boosts of light",
    text:"Light lifts an electron at <strong>photosystem II</strong>. It slides downhill through a chain of carriers, giving up energy to pump H⁺, until <strong>photosystem I</strong> lifts it again, high enough to reach <strong>NADP⁺</strong> and make <strong>NADPH</strong>. The electron PSII lost is replaced by splitting <strong>water</strong>, which releases the O₂ you breathe.",
    fig:{ html:'<div class="nz-hero" id="nz-hero" role="img" aria-label="The Z-scheme, an energy diagram. Electron energy rises upward. Water gives an electron to P680 in photosystem II; light lifts it up the first stroke of the Z; it slides down through plastoquinone, cytochrome b6f (which pumps H+ into the lumen) and plastocyanin to P700 in photosystem I; a second flash of light lifts it to the top; it slides through ferredoxin and NADP+ reductase to NADP+, making NADPH. After four electrons, two water molecules have been split and one O2 is released."></div>' }
  },
  goals:[
    "I can trace an electron’s path in noncyclic flow, naming each carrier in order, and explain the Z-scheme.",
    "I can explain photolysis: why water is split, and what becomes of its electrons, H⁺ and oxygen.",
    "I can count photons, electrons, NADPH, O₂ and H⁺ for any amount of noncyclic flow.",
    "I can predict the effect of blocking a carrier, or removing NADP⁺, on O₂ and NADPH production.",
    "I can compare cyclic and noncyclic flow and explain why plants need both."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Photosystems", goal:1,
          prompt:"In a photosystem, what does the reaction centre do when it receives energy from the antenna?",
          options:[
            { t:"Sends an excited electron to the primary electron acceptor", ok:true, why:"Module 03." },
            { t:"Sends energy back to the antenna", why:"Energy flows inward, toward the reaction centre." },
            { t:"Releases O₂ directly", why:"O₂ comes from splitting water, a separate step." },
            { t:"Makes ATP", why:"ATP synthase makes ATP (module 06)." }],
          hints:["What’s special about the reaction centre?", "It’s where an electron actually leaves.", "It goes to the primary acceptor."] },
        { id:"w2", skill:"Photosystems", goal:1,
          prompt:"Which type of molecule forms the reaction centre of a photosystem?",
          options:[
            { t:"Chlorophyll <i>a</i>", ok:true, why:"A special pair of chlorophyll <i>a</i> molecules." },
            { t:"Chlorophyll <i>b</i>", why:"Chlorophyll <i>b</i> is in the antenna." },
            { t:"Carotene", why:"An accessory pigment in the antenna." },
            { t:"NADP⁺", why:"NADP⁺ is the final electron acceptor, far down the chain." }],
          hints:["Which pigment is the main photosynthetic pigment?", "Module 02 called it the main one.", "Chlorophyll <i>a</i>."] },
        { id:"w3", skill:"Light reactions’ inputs and outputs", goal:2,
          prompt:"Which molecule is the source of the O₂ released in photosynthesis?",
          options:[
            { t:"Water", ok:true, why:"Shown with ¹⁸O tracers (module 04)." },
            { t:"CO₂", why:"Labelled CO₂ never labels the O₂." },
            { t:"Glucose", why:"Glucose is a product." },
            { t:"NADPH", why:"NADPH contains no O₂ to release." }],
          hints:["Recall the tracer experiments.", "Labelled water gave labelled O₂.", "Water."] },
        { id:"w4", skill:"Light reactions’ inputs and outputs", goal:1,
          prompt:"Which two energy carriers do the light reactions make for the Calvin cycle?",
          options:[
            { t:"ATP and NADPH", ok:true, why:"The light reactions load ATP and NADPH; the Calvin cycle spends them (module 04)." },
            { t:"ADP and NADP⁺", why:"Those are the empty forms that come back." },
            { t:"Glucose and O₂", why:"Glucose is made in the Calvin cycle; O₂ is a by-product." },
            { t:"NADH and FADH₂", why:"Those are respiration’s carriers (Unit 2)." }],
          hints:["Module 04’s conveyor.", "One stores energy in phosphate bonds; one carries electrons.", "ATP and NADPH."] },
        { id:"w5", skill:"Energy and electrons", goal:1,
          prompt:"When an electron moves ‘downhill’ from one carrier to the next, it…",
          options:[
            { t:"releases some energy, which can be used for work", ok:true, why:"Like water falling through a turbine." },
            { t:"gains energy", why:"Gaining energy is ‘uphill’; that needs light here." },
            { t:"turns into a proton", why:"Electrons and protons are different particles." },
            { t:"disappears", why:"Electrons are passed on, not destroyed." }],
          hints:["Think of a ball rolling down stairs.", "Each step releases energy.", "It releases energy."] },
        { id:"w6", skill:"Energy and electrons", goal:2,
          prompt:"A molecule that <strong>gains</strong> electrons is said to be…",
          options:[
            { t:"reduced", ok:true, why:"Gaining electrons is reduction (module 11 covers redox in depth)." },
            { t:"oxidized", why:"Oxidized means losing electrons." },
            { t:"split", why:"Splitting is a different event." },
            { t:"excited", why:"Excited means an electron is raised in energy, not gained." }],
          hints:["Remember OIL RIG.", "Reduction Is Gain.", "Reduced."] }
      ],
      refreshers:{
        "Photosystems":"The antenna funnels energy to a reaction-centre chlorophyll <i>a</i> pair, which sends an excited electron to the primary acceptor.",
        "Light reactions’ inputs and outputs":"Inputs: light, water, ADP + Pᵢ, NADP⁺. Outputs: O₂, ATP, NADPH.",
        "Energy and electrons":"Downhill electron moves release energy; light provides the uphill moves. Gaining electrons is reduction: NADP⁺ is reduced to NADPH."
      }
    }
  },
  explore:{
    heading:"The Z-scheme climb",
    intro:"Flash light at each photosystem and follow electrons from water to NADPH. Add an inhibitor or run out of NADP⁺, and see where the chain jams.",
    // TC1 chips (shown shuffled under the diagram); the order test lives in app.js
    pathIntro:"Challenge 1: tap the carriers in the order an electron visits them.",
    pathParts:[["h2o", "H₂O"], ["psii", "PSII (P680)"], ["pq", "plastoquinone"], ["b6f", "cytochrome b₆f"], ["pc", "plastocyanin"], ["psi", "PSI (P700)"], ["fd", "ferredoxin"], ["fnr", "NADP⁺ reductase"], ["nadp", "NADP⁺"]],
    legendAbbr:"<strong>PQ</strong> plastoquinone · <strong>b₆f</strong> cytochrome b₆f complex · <strong>PC</strong> plastocyanin · <strong>Fd</strong> ferredoxin · <strong>FNR</strong> NADP⁺ reductase",
    modelTitle:"How the model counts",
    modelRules:[
      "<strong>Lamp A flash</strong> (680 nm, mostly PSII): P680 sends one electron to plastoquinone, which passes it to b₆f (1 H⁺ pumped into the lumen), then to plastocyanin, where it waits. P680⁺ refills from water: +1 H⁺ released into the lumen, and the water-splitting cluster gains one ‘step’. Every 4th step splits 2 H₂O and releases 1 O₂.",
      "<strong>Lamp B flash</strong> (700 nm, mostly PSI): if P700 holds an electron, it sends it to ferredoxin, then to NADP⁺ reductase. P700⁺ then takes the waiting electron from plastocyanin if there is one. If not, it stays empty: ‘P700 is waiting for an electron from PSII.’",
      "<strong>NADPH:</strong> each 2 electrons at NADP⁺ reductase + 1 H⁺ from the stroma + NADP⁺ make 1 NADPH. If NADP⁺ is used up, electrons back up at ferredoxin, and further PSI flashes give ‘energy lost as heat and fluorescence’.",
      "<strong>DCMU:</strong> PSII flashes excite P680, but the electron can’t reach plastoquinone. No water is split and no O₂ is released; the energy is lost as fluorescence.",
      "<strong>Plastocyanin missing:</strong> electrons stop at b₆f; PSI fires once, then waits.",
      "Each carrier is empty or holds one electron (NADP⁺ reductase collects two). A flash that can’t be used is counted as energy lost, not as a photon absorbed. Continuous lamps flash 4 times per second, alternating A then B when both are on.",
      "<strong>Starting state</strong> after Reset: P700 holds one electron and every other carrier is empty."
    ],
    modelNote:"Simplified model values: 1 H⁺ per electron at b₆f and 4 H⁺ per ATP, so the arithmetic works by hand. Real values are about 2 H⁺ at b₆f (with the Q cycle) and about 4.7 H⁺ per ATP; module 06 covers the gradient itself. Real light excites both photosystems to some degree: Lamp A and Lamp B are teaching simplifications. Part 3 shows Emerson’s data.",
    tc3Title:"Counter boxes (challenge 3)",
    tc3Boxes:[["nadph", "NADPH made"], ["photons", "Photons absorbed"], ["h2o", "H₂O split"], ["hplus", "H⁺ added to the lumen"]],
    predIntro:"Make a prediction first. Then the Z-scheme will show you what really happens.",
    predictions:[
      { id:"p1", start:{ run:"p1" },
        prompt:"<span class=\"muted\">After Reset, press Lamp B <strong>Flash</strong> three times (Lamp A off).</span> What will happen?",
        options:[{ t:"One electron moves to ferredoxin, then PSI waits for an electron from PSII", ok:true }, { t:"Three electrons reach NADP⁺, making NADPH" }, { t:"O₂ is released" }, { t:"Electrons flow backwards to water" }],
        explain:"PSI can only send an electron if it gets one back, and those come from PSII." },
      { id:"p2", start:{ run:"p2" },
        prompt:"<span class=\"muted\">Both lamps Continuous; then DCMU.</span> What happens to O₂ release and NADPH production?",
        options:[{ t:"Both stop", ok:true }, { t:"O₂ stops, NADPH continues" }, { t:"NADPH stops, O₂ continues" }, { t:"Neither changes" }],
        explain:DCMU },
      { id:"p3", start:{ run:"p3" },
        prompt:"<span class=\"muted\">Both lamps Continuous; NADP⁺ supply → Used up.</span> What happens to electron flow?",
        options:[{ t:"It backs up and stops, and energy is lost as heat and fluorescence", ok:true }, { t:"It speeds up" }, { t:"Electrons go to O₂ instead" }, { t:"Nothing changes" }],
        explain:"With no final acceptor, there’s nowhere for electrons to go." },
      { id:"p4", start:{ run:"p4" },
        prompt:"How many photons does it take to make one NADPH?",
        options:[{ t:"4", ok:true }, { t:"2" }, { t:"1" }, { t:"8" }],
        explain:"2 electrons per NADPH × 2 photons per electron. (Reset, then 2 A-flashes and 2 B-flashes give NADPH 1; P700’s starting electron carries the first.)" }
    ],
    chalIntro:"Use the Z-scheme (challenge 1: the carrier chips under the diagram; challenge 3: the counter boxes under the controls), then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Tap the carriers in the order an electron visits them, from water to NADP⁺.",
        why:"H₂O → PSII (P680) → plastoquinone → cytochrome b₆f → plastocyanin → PSI (P700) → ferredoxin → NADP⁺ reductase → NADP⁺.",
        general:"Tap all nine carrier chips under the diagram, in order. Press Clear to start again.",
        hints:["Start where the electrons come from.", "PSII → PQ → b₆f → PC → PSI.", "Then ferredoxin → NADP⁺ reductase → NADP⁺."] },
      { id:"tc2", goal:[1, 3], prompt:"From Reset, make exactly 3 NADPH using the fewest flashes. <span class=\"muted\">(After Reset, P700 already holds one electron.)</span>",
        why:"5 A-flashes and 6 B-flashes (11 flashes). Each successful B-flash delivers one electron, so 6 electrons reach NADP⁺ reductase. The first was already waiting at P700, so only 5 had to come from PSII.",
        hints:["3 NADPH need 6 electrons.", "Each electron needs a PSI flash to reach NADP⁺, and every one after the first needs a PSII flash to refill P700.", "6 B-flashes and 5 A-flashes."] },
      { id:"tc3", goal:3, stretch:true, prompt:"A long run with no inhibitors released exactly 3 O₂. Set the counter boxes to what the run must have shown: NADPH made, photons absorbed, H₂O split and H⁺ added to the lumen. Ignore the starting electron.",
        why:"3 O₂ means 12 electrons: 12 e⁻ → 6 NADPH, 24 photons, 6 H₂O, 24 H⁺.",
        hints:["3 O₂ means how many electrons?", "4 per O₂: 12 electrons.", "12 e⁻ → 6 NADPH, 24 photons, 6 H₂O, 24 H⁺."] }
    ]
  },
  part3:{
    slug:"cyclic", name:"Cyclic",
    heading:"Cyclic vs noncyclic",
    intro:"The Explore chain runs one way, from water to NADPH. Here you’ll add a loop around PSI, check the evidence for two photosystems, and work out why the loop matters for the Calvin cycle.",
    s1:{ title:"Station 1: the cyclic route",
      how:"Choose a route, then run Lamp B (PSI only). Watch the counters: which ones rise?",
      banner:"Cyclic flow pumps H⁺ for ATP, but it makes no NADPH and splits no water.",
      stall:"Without the loop, PSI stalls: P700 is waiting for an electron from PSII." },
    s2:{ title:"Station 2: Check it with data — two photosystems",
      how:"Robert Emerson’s two-light experiments measured O₂ release from algae lit with red light, far-red light, or both at once.",
      head:["Light", "O₂ rate (model units)"],
      rows:[["650 nm (red) alone", "10"], ["710 nm (far red) alone", "4"], ["Both together", "20"]],
      boxes:[
        { id:"sum", label:"Sum of the separate rates", answer:14, wrong:[{ match:20, fb:"20 is the rate with both lights together. Add the two separate rates." }] },
        { id:"extra", label:"Extra from using both together", answer:6, wrong:[{ match:10, fb:"Compare with 10 + 4 = 14." }, { match:14, fb:"14 is the sum. How much more is 20 than 14?" }] }],
      concl:{ prompt:"Which conclusion do the data support?",
        options:[
          { t:"Two photosystems, absorbing different wavelengths, work in series", ok:true, why:"Each light excites mostly one photosystem; together the chain runs fully, so the rate beats the sum." },
          { t:"Red light is simply brighter, so it adds more O₂", why:"Brightness can’t explain why the pair beats the sum of the two alone." },
          { t:"Far-red light damages the leaf, so it lowers the rate", why:"Far red alone still gave some O₂, and adding red raised the rate far above the sum." },
          { t:"Two lamps warm the algae, speeding up every enzyme", why:"Warmth would raise both separate rates too; the boost appears only when the two wavelengths work together." }] },
      zoomTitle:"Zoom to the molecules",
      zoom:{
        red:"650 nm (red) excites both photosystems, but PSII more than PSI. PSI can’t keep up, so the chain runs at half speed.",
        far:"710 nm (far red) excites mostly PSI and hardly PSII. P700 soon waits for electrons, so little water is split.",
        both:"Together, each photosystem gets the light it absorbs best. The chain runs fully, and O₂ release jumps to 20." },
      zoomNote:"Model: the O₂ rate follows the slower photosystem (PSII and PSI work in series)." },
    s3:{ title:"Station 3: the ATP budget",
      how:"The Calvin cycle needs <strong>3 ATP and 2 NADPH</strong> per CO₂ (module 08). Model counts: 2 H⁺ per noncyclic electron, 1 H⁺ per cyclic trip, 4 H⁺ per ATP. Four noncyclic electrons are already running. Add cyclic trips until the ATP bar reaches 3.",
      done:"3 ATP and 2 NADPH: exactly what one CO₂ needs. The 4 cyclic trips added 4 H⁺, one more ATP, and no NADPH.",
      note:"Real numbers differ (about 3 H⁺ per electron, about 4.7 H⁺ per ATP), but linear flow alone still falls short of 3 ATP per 2 NADPH." },
    quickCheck:{
      title:"Quick check", summary:"Cyclic quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which does cyclic flow produce?",
          choices:[{ t:"H⁺ gradient (for ATP) only", ok:true, fb:M7 },
            { t:"NADPH only", fb:M7 }, { t:"O₂ and NADPH", fb:M7 }, { t:"O₂ only", fb:M7 }] },
        { id:"q2", goal:5, prompt:"Which photosystem takes part in cyclic flow?",
          choices:[{ t:"PSI only", ok:true, fb:"Electrons loop from PSI back to PSI." },
            { t:"PSII only", fb:"Electrons loop from PSI back to PSI." }, { t:"Both", fb:"Electrons loop from PSI back to PSI." }, { t:"Neither", fb:"Electrons loop from PSI back to PSI." }] },
        { id:"q3", goal:1, prompt:"Emerson’s two lights together gave more than the sum of each alone. Why?",
          choices:[{ t:"Two photosystems work in series", ok:true, fb:"Each light excites mostly one photosystem; together the chain runs fully." },
            { t:"Red light is brighter", fb:"Each light excites mostly one photosystem; together the chain runs fully." },
            { t:"Far red damages PSII", fb:"Each light excites mostly one photosystem; together the chain runs fully." },
            { t:"The plant was warmer", fb:"Each light excites mostly one photosystem; together the chain runs fully." }] },
        { id:"q4", goal:5, prompt:"Why do plants need cyclic flow?",
          choices:[{ t:"To top up ATP for the Calvin cycle", ok:true, fb:"Linear flow alone makes slightly too little ATP." },
            { t:"To make extra NADPH", fb:"Linear flow alone makes slightly too little ATP." },
            { t:"To make more O₂", fb:"Linear flow alone makes slightly too little ATP." },
            { t:"To split CO₂", fb:"Linear flow alone makes slightly too little ATP." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"steps", type:"custom", title:"Put the steps in order", summary:"Put the steps in order", goal:[1, 2],
        instruction:"Put each sequence of events in the order it happens.",
        how:"Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.",
        sequences:[
          { id:"sa", goal:1, prompt:"An electron’s trip from PSII to NADPH.",
            steps:["Light excites P680 in PSII.", "The excited electron passes to the primary acceptor, then to plastoquinone.", "Plastoquinone carries it to cytochrome b₆f, which pumps H⁺ into the lumen.", "Plastocyanin carries it to PSI.", "Light excites P700, and its electron passes to ferredoxin.", "NADP⁺ reductase transfers 2 electrons and an H⁺ to NADP⁺.", "NADPH is formed in the stroma."],
            start:[4, 1, 6, 0, 3, 5, 2],
            rules:[{ first:[0, 1], then:[4, 5, 6], fb:"The electron reaches PSI only after travelling from PSII." }],
            why:"PSII → plastoquinone → b₆f → plastocyanin → PSI → ferredoxin → NADP⁺ reductase → NADPH.",
            hints:["What starts everything?", "Light at PSII.", "PSII → PQ → b₆f → PC → PSI → ferredoxin → NADP⁺ reductase."] },
          { id:"sb", goal:2, prompt:"Replacing PSII’s electrons: photolysis.",
            steps:["P680 loses an electron and becomes P680⁺.", "P680⁺ pulls an electron from water.", "After four electrons, two water molecules have been split.", "Four H⁺ are released into the lumen.", "One O₂ molecule is released."],
            start:[4, 2, 0, 3, 1],
            rules:[{ first:[1, 2], then:[4], fb:"O₂ forms when water is split." }],
            why:"Every electron P680 loses is replaced from water; four replacements split 2 H₂O, releasing 4 H⁺ and 1 O₂.",
            hints:["What does P680 need after it sends an electron away?", "A replacement electron, pulled from water.", "P680⁺ → electron from water → 2 H₂O split after four electrons → 4 H⁺ → O₂."] }
        ] },
      { id:"accounting", type:"custom", title:"Electron accounting and inhibitors", summary:"Electron accounting", star:true, goal:[3, 4],
        instruction:"Six problems on counting and on blocked chains. The ★ problems are non-routine.",
        how:"",
        items:[
          { id:"z1", kind:"num", goal:3, prompt:"How many electrons must flow for one O₂ to be released?",
            answer:4, display:"4 electrons", unit:"electrons",
            wrong:[{ match:2, fb:"2 H₂O → 4H⁺ + 4e⁻ + O₂." }],
            hints:["Write out photolysis.", "2H₂O → 4H⁺ + 4e⁻ + O₂.", "4 electrons for each O₂."] },
          { id:"z2", kind:"num", goal:3, prompt:"How many photons are needed to make 5 NADPH?",
            answer:20, display:"20 photons", unit:"photons",
            wrong:[{ match:10, fb:"Each electron needs 2 photons, and each NADPH needs 2 electrons." }],
            hints:["How many electrons does 5 NADPH need?", "5 × 2 = 10 electrons.", "10 electrons × 2 photons = 20 photons."] },
          { id:"z3", kind:"sel", goal:4, star:true,
            prompt:"Atrazine, a herbicide used on Ontario corn fields, blocks electrons from PSII reaching plastoquinone. In a sprayed weed, select <strong>all</strong> that happen.",
            options:[
              { t:"O₂ release stops", ok:true, why:"Water isn’t split if PSII can’t pass its electrons on." },
              { t:"NADPH production stops", ok:true, why:"Without PSII’s electrons, PSI has nothing to send." },
              { t:"PSII’s fluorescence increases", ok:true, why:"Energy PSII absorbs but can’t use comes back out as fluorescence." },
              { t:"PSI keeps making NADPH from water", why:"Without PSII’s electrons, PSI has nothing to send." }],
            fb:"Without PSII’s electrons, PSI has nothing to send.",
            hints:["Where is the block?", "Right after PSII: everything downstream starves.", "O₂ stops, NADPH stops, and PSII’s unused energy comes out as fluorescence."] },
          { id:"z4", kind:"mc", goal:4, star:true,
            prompt:"A copper shortage leaves a plant with little plastocyanin. Where do electrons pile up, and what state is P700 left in?",
            options:[
              { t:"At cytochrome b₆f (and plastoquinone); P700 left oxidized (P700⁺, waiting)", ok:true, why:"Plastocyanin is the link to PSI." },
              { t:"At ferredoxin; P700 left holding an electron", why:"Plastocyanin is the link to PSI." },
              { t:"At NADP⁺ reductase; P700 left excited (P700*)", why:"Plastocyanin is the link to PSI." },
              { t:"Nowhere; P700 keeps working normally", why:"Plastocyanin is the link to PSI." }],
            hints:["Which carrier does plastocyanin pass electrons to?", "PSI: without it, electrons stop just before, at b₆f.", "Electrons pile up at b₆f and plastoquinone; P700 sends its electron and waits as P700⁺."] },
          { id:"z5", kind:"num", goal:4, star:true,
            prompt:"Emerson data: red light alone gives 10, far red alone gives 4, both together give 20. By how much does the combined rate beat the sum of the separate rates?",
            answer:6, display:"6 model units", unit:"units",
            wrong:[{ match:10, fb:"Compare with 10 + 4 = 14." }, { match:14, fb:"14 is the sum. How much more is 20?" }],
            hints:["First add the separate rates.", "10 + 4 = 14.", "20 − 14 = 6."] },
          { id:"z6", kind:"mc", goal:4, star:true,
            prompt:"A herbicide grabs electrons from PSI’s acceptor side, before ferredoxin, and passes them to O₂ instead (mechanism only). Which result follows?",
            options:[
              { t:"NADPH stops, but O₂ release from water continues", ok:true, why:"The chain from water through PSI still runs; only the last step is stolen." },
              { t:"Both stop", why:"The chain from water through PSI still runs; only the last step is stolen." },
              { t:"O₂ stops, but NADPH continues", why:"The chain from water through PSI still runs; only the last step is stolen." },
              { t:"Neither changes", why:"The chain from water through PSI still runs; only the last step is stolen." }],
            hints:["Where in the chain is the block?", "After PSI: everything before it still runs.", "Water is still split (O₂ continues); NADP⁺ gets no electrons."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Bashir", how:"",
        instruction:"Bashir made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Describe noncyclic electron flow.",
            steps:["Light first excites photosystem I, because it’s number one.", "Its electron passes to plastoquinone, then cytochrome b₆f.", "Then on to the other photosystem and finally to NADP⁺."],
            answer:0,
            stepFb:["", "Step 2 follows step 1’s mistake.", "Step 3 follows."],
            fixes:[
              { t:"Light first excites photosystem II (P680); the numbers record the order of discovery.", ok:true, why:E1W },
              { t:"Light excites both at once, and they don’t connect.", why:E1W },
              { t:"Light first excites cytochrome b₆f.", why:E1W },
              { t:"Step 1 is correct.", why:E1W }],
            hints:["Which photosystem splits water?", "PSII.", "So PSII must come first."] },
          { id:"e2", goal:2, task:"Explain photolysis and its products.",
            steps:["When light excites P680, it loses an electron.", "P680⁺ is a strong oxidizer that pulls electrons from water.", "Water is split: 2H₂O → 4H⁺ + 4e⁻ + O₂.", "The O₂ is then used to make NADPH."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The O₂ is released as a by-product; NADPH is made from NADP⁺, electrons and H⁺.", ok:true, why:E2W },
              { t:"The O₂ is used to make glucose.", why:E2W },
              { t:"The O₂ goes into ATP.", why:E2W },
              { t:"Step 4 is correct.", why:E2W }],
            hints:["What does the leaf do with photosynthesis’s O₂?", "Releases it.", "NADPH comes from NADP⁺."] },
          { id:"e3", goal:3, task:"How many photons are needed to make one NADPH?",
            steps:["Each NADPH needs 2 electrons.", "Each electron is excited once, at PSII.", "So one NADPH needs 2 photons."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Each electron is excited twice, at PSII and at PSI, so one NADPH needs 4 photons.", ok:true, why:E3W },
              { t:"Each electron is excited once, at PSI.", why:E3W },
              { t:"Each NADPH needs 1 electron.", why:E3W },
              { t:"Step 2 is correct.", why:E3W }],
            hints:["How many uphill strokes does the Z have?", "Two.", "2 photons × 2 electrons = 4."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: PSI stalling on its own, or one herbicide stopping NADPH while O₂ kept coming?" },
      { id:"j2", q:"In your own words, why does the plant split water at all?" },
      { id:"j3", q:"Explain to a friend how to work out the photons needed for a given amount of NADPH." },
      { id:"j4", q:"Which carrier or step are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In noncyclic flow, which photosystem passes its electron on first?", options:[
          { t:"Photosystem II (P680)", ok:true, why:"Electrons go through PSII first, then PSI." },
          { t:"Photosystem I (P700)", why:"Its number reflects the order of discovery, not the order of flow." },
          { t:"Both at the same moment, independently", why:"They work in series." },
          { t:"Neither: plastoquinone absorbs the light first", why:"Plastoquinone is a carrier, not a pigment." }] },
        b:{ prompt:"Which molecule is the final electron acceptor in noncyclic flow?", options:[
          { t:"NADP⁺", ok:true, why:"NADP⁺ reductase hands the electrons to NADP⁺, making NADPH." },
          { t:"O₂", why:"O₂ is the final acceptor in cellular respiration, not here." },
          { t:"Water", why:"Water gives electrons; it doesn’t accept them." },
          { t:"Plastocyanin", why:"Plastocyanin is a middle carrier." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Where do the electrons that replace those lost by P680 come from?", options:[
          { t:"Water", ok:true, why:"Photolysis: 2H₂O → 4H⁺ + 4e⁻ + O₂." },
          { t:"NADPH", why:"NADPH is at the far end of the chain." },
          { t:"Photosystem I", why:"PSI receives electrons; it doesn’t supply PSII." },
          { t:"CO₂", why:"CO₂ is used in the Calvin cycle." }] },
        b:{ prompt:"What is released when water is split at PSII?", options:[
          { t:"O₂ and H⁺ (its electrons go to P680)", ok:true, why:"2H₂O → 4H⁺ + 4e⁻ + O₂: the electrons refill P680." },
          { t:"CO₂ and H⁺", why:"There’s no carbon in water." },
          { t:"NADPH", why:"NADPH is made at the other end of the chain." },
          { t:"Glucose", why:"Glucose is made in the Calvin cycle." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which carrier delivers electrons from cytochrome b₆f to photosystem I?", options:[
          { t:"Plastocyanin", ok:true, why:"Plastocyanin, a copper protein in the lumen, carries electrons from b₆f to PSI." },
          { t:"Plastoquinone", why:"Plastoquinone carries from PSII to b₆f." },
          { t:"Ferredoxin", why:"Ferredoxin takes electrons from PSI." },
          { t:"NADP⁺ reductase", why:"That’s the last enzyme." }] },
        b:{ prompt:"Which carrier moves electrons from photosystem II to cytochrome b₆f?", options:[
          { t:"Plastoquinone", ok:true, why:"Plastoquinone moves through the membrane from PSII to b₆f." },
          { t:"Plastocyanin", why:M6 },
          { t:"Ferredoxin", why:M6 },
          { t:"NADP⁺ reductase", why:"That’s the last enzyme." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"How many photons are absorbed, and how many NADPH are made, for each O₂ released in noncyclic flow?", options:[
          { t:"8 photons; 2 NADPH", ok:true, why:"4 electrons × 2 photons; 4 electrons ÷ 2." },
          { t:"4 photons; 2 NADPH", why:"Each electron needs 2 photons." },
          { t:"8 photons; 4 NADPH", why:"Each NADPH takes 2 electrons." },
          { t:"4 photons; 1 NADPH", why:M3 }] },
        b:{ prompt:"To make 4 NADPH, how many photons are absorbed and how many O₂ are released?", options:[
          { t:"16 photons; 2 O₂", ok:true, why:"8 electrons × 2 photons; 8 ÷ 4." },
          { t:"8 photons; 2 O₂", why:M3 },
          { t:"16 photons; 4 O₂", why:"O₂ needs 4 electrons each." },
          { t:"8 photons; 1 O₂", why:M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"DCMU blocks electrons from passing from PSII to plastoquinone. In lit thylakoids with DCMU, which result follows?", options:[
          { t:"O₂ release and NADPH production both stop.", ok:true, why:DCMU },
          { t:"O₂ stops, but NADPH continues because PSI is still lit.", why:M4 },
          { t:"NADPH stops, but O₂ continues.", why:"Water isn’t split if PSII can’t pass its electrons on." },
          { t:"Neither changes, because DCMU acts after PSI.", why:"It acts right after PSII." }] },
        b:{ prompt:"A herbicide takes electrons from PSI’s acceptor side before they reach ferredoxin. Which result follows?", options:[
          { t:"NADPH production stops, but O₂ release continues.", ok:true, why:"The chain from water through PSI still runs; only the last step is stolen." },
          { t:"Both stop.", why:"Everything before PSI still runs." },
          { t:"O₂ stops, but NADPH continues.", why:"That’s backwards." },
          { t:"Neither changes.", why:"NADP⁺ gets no electrons." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Thylakoids are lit only with far-red light (710 nm), which excites PSI but hardly PSII. After a brief burst, NADPH production stops. Why?", options:[
          { t:"P700 can’t be refilled, because almost no electrons arrive from PSII.", ok:true, why:"PSI sends the electrons it holds, then waits: its replacements must come from PSII." },
          { t:"Far-red light damages PSI.", why:"PSI works; it’s starved." },
          { t:"The NADP⁺ runs out immediately.", why:"Only a brief burst was made." },
          { t:"PSI splits water too slowly.", why:"PSI doesn’t split water at all." }] },
        b:{ prompt:"A mutant plant lacks working PSI but has normal PSII. In light, what happens?", options:[
          { t:"A little O₂ is released until the carriers between the photosystems fill up; then flow stops and no NADPH is made.", ok:true, why:"PSII can fill the empty carriers, but with no PSI nothing drains them." },
          { t:"It makes NADPH normally using PSII alone.", why:"PSII alone can’t lift electrons high enough to reach NADP⁺: PSI’s boost is needed." },
          { t:"It makes NADPH but no O₂.", why:"NADPH needs PSI." },
          { t:"Nothing at all happens, even briefly.", why:"PSII can push a few electrons into the empty carriers first." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why water must be split in noncyclic flow?", options:[
          { t:"“Every electron that leaves P680 must be replaced. Water supplies the replacements, releasing H⁺ and O₂ as it does.”", ok:true, why:"Photolysis replaces P680’s electrons; O₂ and H⁺ are released along the way." },
          { t:"“Water is split to make the O₂ that NADPH needs.”", why:M2 },
          { t:"“Water is split to cool the chloroplast.”", why:"Splitting water doesn’t cool anything." },
          { t:"“Water is split to provide carbon for sugar.”", why:"Water has no carbon." }] },
        b:{ prompt:"Which is the best explanation of why this pathway is called ‘noncyclic’?", options:[
          { t:"“Electrons travel one way, from water to NADPH, and never return to where they started.”", ok:true, why:"Water → PSII → PSI → NADPH: the electrons end up in NADPH." },
          { t:"“Because it doesn’t involve light.”", why:"It needs light at both photosystems." },
          { t:"“Because it happens only once in a leaf’s life.”", why:"It runs continuously in light." },
          { t:"“Because it makes ATP only.”", why:"That describes cyclic flow." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which description of the Z-scheme is correct?", options:[
          { t:"“Light lifts an electron at PSII; it releases energy as it falls through carriers to PSI; light lifts it again at PSI, then it passes to NADP⁺.”", ok:true, why:"Two uphill boosts by light, with a downhill run between them." },
          { t:"“Light lifts an electron once at PSI, and it falls to PSII and then to NADP⁺.”", why:M1 },
          { t:"“Electrons gain energy at cytochrome b₆f.”", why:"Energy is released there, used to pump H⁺." },
          { t:"“Light lifts electrons from NADPH up to water.”", why:"The direction is water → NADPH." }] },
        b:{ prompt:"Which best explains why the diagram has the shape of a Z?", options:[
          { t:"“It shows two uphill boosts by light (at PSII and PSI) with a downhill run between them.”", ok:true, why:"Each boost is one stroke of the Z; the fall between them releases energy." },
          { t:"“It shows one long uphill climb from water to NADP⁺.”", why:M3 },
          { t:"“It shows electrons looping back to PSI.”", why:"That’s cyclic flow." },
          { t:"“It shows the layout of the thylakoid membrane.”", why:"It’s an energy diagram, not a map." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Runoff carrying a PSII-blocking herbicide reaches a stream. Predict the effect on the stream’s algae.", options:[
          { t:"Their O₂ release and NADPH production fall, so their growth slows.", ok:true, why:"With PSII blocked, water isn’t split and no electrons reach NADP⁺, so the algae make less sugar." },
          { t:"They make extra NADPH to compensate.", why:M5 },
          { t:"Only their respiration stops.", why:"The herbicide targets photosynthesis." },
          { t:"Nothing, because algae don’t have PSII.", why:"Algae photosynthesize like plants." }] },
        b:{ prompt:"A PSII-blocking herbicide makes sensitive weeds’ leaves fluoresce more brightly. A resistant weed’s fluorescence stays normal after spraying. Which explanation fits?", options:[
          { t:"In the resistant weed, electrons still flow from PSII to plastoquinone, so absorbed energy isn’t wasted as fluorescence.", ok:true, why:"Fluorescence rises only when PSII’s electrons can’t move on; in the resistant weed they still can." },
          { t:"The resistant weed has no chlorophyll.", why:"Then it couldn’t photosynthesize." },
          { t:"The resistant weed makes NADPH without PSI.", why:M4 },
          { t:"Fluorescence only depends on the weather.", why:"The difference is between weeds in the same weather." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"The Calvin cycle needs 3 ATP and 2 NADPH per CO₂. Using the module’s model (2 H⁺ per noncyclic electron, 1 H⁺ per cyclic trip, 4 H⁺ per ATP), how many cyclic trips are needed to top up the ATP for one CO₂?", options:[
          { t:"4", ok:true, why:"4 noncyclic electrons give 2 NADPH and 8 H⁺ (2 ATP); 1 more ATP needs 4 H⁺ = 4 cyclic trips." },
          { t:"1", why:"One trip moves 1 H⁺, which isn’t a whole ATP." },
          { t:"2", why:"That’s 2 H⁺: half an ATP." },
          { t:"8", why:"That would give 2 extra ATP." }] },
        b:{ prompt:"For 2 CO₂ (6 ATP and 4 NADPH), how many cyclic trips are needed with the same model?", options:[
          { t:"8", ok:true, why:"8 noncyclic electrons give 4 NADPH and 16 H⁺ (4 ATP); 2 more ATP need 8 H⁺." },
          { t:"2", why:"Count H⁺, not ATP." },
          { t:"4", why:"That tops up only 1 ATP." },
          { t:"16", why:"That would give 4 extra ATP." }] } }
    ]
  },
  task:{
    title:"Feed the Calvin cycle", summary:"Feed the Calvin cycle",
    statement:"<p>The Calvin cycle wants to fix 2 CO₂, which needs <strong>4 NADPH and 6 ATP</strong>. Choose how much noncyclic and cyclic flow to run. Can you find every answer?</p><ol class=\"nz-reqs\"><li>Exactly the NADPH needed: 4 NADPH.</li><li>Enough ATP: at least 6.</li><li>Photon budget: at most 26 photons.</li></ol><p class=\"tiny muted\"><span class=\"bio-model\">Model</span> Counts from Explore: NADPH = <i>P</i>. H⁺ = 4<i>P</i> + <i>C</i>; ATP = whole number of (H⁺ ÷ 4). Photons = 4<i>P</i> + <i>C</i>. O₂ = <i>P</i> ÷ 2. (<i>P</i>: noncyclic electron pairs, 0–8. <i>C</i>: cyclic trips, 0–16.)</p>",
    checks:["Exactly 4 NADPH", "At least 6 ATP", "Within the photon budget"],
    tips:["Each noncyclic pair makes one NADPH; the cycle wants exactly 4.", "Four noncyclic pairs give 16 H⁺, only 4 ATP. Cyclic trips add H⁺ without NADPH.", "Every trip costs a photon. Don’t overspend."],
    after3:"In (4, 9) and (4, 10), the extra 1 or 2 H⁺ isn’t wasted: it carries over toward the next ATP.",
    explainPrompt:"Explain why the cycle can’t be fed by noncyclic flow alone, and what cyclic flow adds.",
    vocab:"Use the words noncyclic, cyclic, NADPH, ATP and H⁺ gradient.",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Noncyclic electron flow", "Electrons flow one way: H₂O → PSII → PQ → b₆f → PC → PSI → ferredoxin → NADP⁺ reductase → NADPH."],
    ["P680", "Reaction centre of photosystem II; light excites it first."],
    ["P700", "Reaction centre of photosystem I; light excites it second."],
    ["Photolysis", "2H₂O → 4H⁺ + 4e⁻ + O₂, at PSII. Source of photosynthesis’s O₂."],
    ["Plastoquinone (PQ)", "Mobile carrier in the membrane: PSII → cytochrome b₆f."],
    ["Cytochrome b₆f", "Passes electrons to plastocyanin and pumps H⁺ into the lumen."],
    ["Plastocyanin (PC)", "Copper protein in the lumen: b₆f → PSI."],
    ["Ferredoxin and NADP⁺ reductase", "Take electrons from PSI and reduce NADP⁺ to NADPH in the stroma."],
    ["Z-scheme", "Energy diagram: two light boosts (PSII, PSI) with a downhill run between."],
    ["The counts", "2 photons per electron; 2 electrons per NADPH; 4 electrons per O₂."],
    ["Cyclic flow", "PSI → ferredoxin → b₆f → PC → PSI: pumps H⁺ (ATP) but makes no NADPH or O₂."],
    ["Why cyclic flow?", "Linear flow makes slightly too little ATP for the Calvin cycle’s 3 ATP : 2 NADPH."]
  ]
};
