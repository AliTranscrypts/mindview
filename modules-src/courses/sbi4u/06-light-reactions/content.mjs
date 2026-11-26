// SBI4U 06 Light Reactions. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/06-light-reactions.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "H⁺ is moved <strong>into</strong> the thylakoid. The lumen becomes acidic (about pH 5); the stroma becomes less acidic (about pH 8).";
const M2 = "ATP synthase is turned by <strong>H⁺</strong> flowing down its gradient. Electrons never pass through it.";
const M3 = "An uncoupler only lets H⁺ leak back. Electrons still flow, so O₂ and NADPH are still made; only ATP stops.";
const M4 = "Each pH unit is a factor of 10. A 3-unit difference is 10 × 10 × 10 = 1000 times.";
const M5 = "CO₂ is used in the Calvin cycle, in the stroma. The light reactions make ATP, NADPH and O₂.";
const M7 = "H⁺ must flow from the lumen side out through ATP synthase. A gradient pointing the other way makes no ATP.";
const MODEL = "Model values (simulator): 4 electrons per O₂; 2 electrons per NADPH; 8 H⁺ into the lumen per O₂; 4 H⁺ per ATP; each cyclic electron pair moves 2 H⁺.";

// Activity 1 sorter: [text, box, feedback if misplaced, hints?]
const BOXES = ["lu", "mem", "st"];
const SORT = [
  ["Photosystem II absorbs light", "mem", "Photosystems are protein complexes set in the membrane."],
  ["H⁺ builds up to about pH 5", "lu", "H⁺ is moved <strong>into</strong> the thylakoid."],
  ["Water is split, releasing O₂ and H⁺", "lu", "PSII’s water-splitting site faces the lumen, so the H⁺ is released inside.", ["Where do the H⁺ from water end up?", "They add to the gradient.", "Lumen."]],
  ["ATP is formed from ADP and Pᵢ", "st", "ATP synthase’s head sits in the stroma.", ["Where is the Calvin cycle?", "ATP is made where it’s used.", "Stroma."]],
  ["NADPH is formed", "st", "NADP⁺ reductase works on the stroma side."],
  ["Plastoquinone carries electrons and H⁺", "mem", "Plastoquinone moves within the membrane."],
  ["Plastocyanin carries electrons to PSI", "lu", "Plastocyanin is a small protein moving in the lumen."],
  ["Ferredoxin carries electrons to NADP⁺ reductase", "st", "Ferredoxin works on the stroma side."],
  ["The Calvin cycle uses ATP and NADPH", "st", "The Calvin cycle’s enzymes are in the stroma."],
  ["H⁺ flows through ATP synthase’s channel", "mem", "The channel crosses the membrane."],
  ["Cytochrome b₆f moves H⁺ inward", "mem", "It’s a membrane complex acting as a pump."],
  ["The pH is about 8 in bright light", "st", "H⁺ is removed from the stroma, so its pH rises."]
];
function sortItems(){
  return SORT.map(function(s, i){
    const wrong = {}; BOXES.forEach(function(b){ if (b !== s[1]) wrong[b] = s[2]; });
    const it = { id:"i" + (i + 1), t:s[0], answer:s[1], why:s[2], wrong:wrong };
    if (s[3]) it.hints = s[3];
    return it;
  });
}

export default {
  id:"06-light-reactions",
  kind:"topic",
  title:"Light reactions",
  topic:"Light Reactions",
  readyTopic:"the light reactions",
  hero:{
    eq:'<span class="lr-heq">light + <span class="lr-c-o2">H₂O</span> + ADP + Pᵢ + NADP⁺ <span class="lr-harr">→</span> <span class="lr-c-o2">O₂</span> + <span class="lr-c-atp">ATP</span> + <span class="lr-c-nadh">NADPH</span></span>',
    eqLabel:"light plus H₂O plus ADP plus Pᵢ plus NADP⁺ gives O₂ plus ATP plus NADPH",
    eqSize:"sm",
    headline:"Light pumps the battery; H⁺ spins the turbine",
    text:"In the thylakoid membrane, excited electrons do work as they move. Their energy piles <strong>H⁺ ions</strong> up inside the thylakoid, making a steep <strong>gradient</strong>. The only easy way back out is through <strong>ATP synthase</strong>, which uses the flow to make <strong>ATP</strong>. This is <strong>chemiosmosis</strong>, and it’s the same trick your mitochondria use.",
    fig:{ html:'<div class="lr-hero" id="lr-hero" role="img" aria-label="A thylakoid membrane in cross-section, stroma above and lumen below. A photon hits photosystem II and an electron hops along the chain: plastoquinone, cytochrome b₆f, plastocyanin, photosystem I, ferredoxin and NADP⁺ reductase, where NADPH appears in the stroma. As it passes cytochrome b₆f, H⁺ slips into the lumen; water splits at photosystem II, releasing O₂ and more H⁺ into the lumen. The lumen fills with H⁺ and its pH drops from 8 to 5. Then H⁺ streams out through ATP synthase, its rotor turns, and ATP appears in the stroma."></div>' }
  },
  goals:[
    "I can say where H⁺ builds up and where ATP and NADPH are made in a chloroplast.",
    "I can list the inputs and products of the light reactions.",
    "I can explain how an H⁺ gradient drives ATP synthase (chemiosmosis).",
    "I can predict what happens to O₂, NADPH and ATP when a part of the system is blocked or made leaky.",
    "I can interpret data from experiments on chemiosmosis, including the acid-bath experiment.",
    "I can apply the light reactions to herbicides, crops and other organisms."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"pH and H⁺ concentration", goal:1,
          prompt:"Which solution has the higher concentration of H⁺ ions: one at pH 5 or one at pH 8?",
          options:[
            { t:"pH 5", ok:true, why:"Lower pH means more H⁺." },
            { t:"pH 8", why:"pH goes <strong>down</strong> as H⁺ goes up." },
            { t:"They’re equal, because both are below 14", why:"The pH value itself tells you the H⁺ level." },
            { t:"You can’t tell without the volume", why:"pH is a concentration, so volume doesn’t matter." }],
          hints:["Is a pH of 1 strongly acidic or basic?", "Acidic means lots of H⁺.", "pH 5 has more H⁺."] },
        { id:"w2", skill:"pH and H⁺ concentration", goal:3,
          prompt:"Solution X is pH 6 and solution Y is pH 7. How many times as many H⁺ ions per litre does X have?",
          options:[
            { t:"10 times", ok:true, why:"One pH unit is a factor of 10." },
            { t:"1 time (they’re about the same)", why:"A 1-unit change is a tenfold change." },
            { t:"1.17 times (7 ÷ 6)", why:"pH is a logarithmic scale." },
            { t:"100 times", why:"That would be 2 pH units." }],
          hints:["pH is a logarithmic scale.", "Each unit lower means 10 times more H⁺.", "10 times."] },
        { id:"w3", skill:"Membrane transport", goal:3,
          prompt:"Ions move through an open channel protein without any energy input. Which way do they move?",
          options:[
            { t:"From higher to lower concentration", ok:true, why:"That’s diffusion down the gradient: no energy needed." },
            { t:"From lower to higher concentration", why:"Moving against a gradient needs a pump and energy." },
            { t:"Either way, equally", why:"There’s a net flow down the gradient." },
            { t:"They don’t move without ATP", why:"Diffusion through channels is passive." }],
          hints:["Which way does food colouring spread in water?", "Toward where there’s less.", "High to low."] },
        { id:"w4", skill:"Membrane transport", goal:3,
          prompt:"A membrane protein moves H⁺ from a region of low H⁺ concentration to one of high H⁺ concentration. What must be true?",
          options:[
            { t:"It uses an energy source, so this is active transport", ok:true, why:"Moving against a gradient takes energy." },
            { t:"It is a channel, so no energy is needed", why:"Channels only let ions run downhill." },
            { t:"The H⁺ is diffusing", why:"Diffusion goes from high to low." },
            { t:"Nothing; ions can always cross membranes freely", why:"Charged ions can’t cross the lipid bilayer on their own." }],
          hints:["Is this uphill or downhill for H⁺?", "Uphill needs energy.", "Active transport."] },
        { id:"w5", skill:"Electron flow (from 05)", goal:2,
          prompt:"In noncyclic electron flow, which molecule finally accepts the electrons?",
          options:[
            { t:"NADP⁺, which becomes NADPH", ok:true, why:"NADP⁺ reductase hands two electrons and an H⁺ to NADP⁺." },
            { t:"O₂, which becomes water", why:"O₂ is a <strong>product</strong> here, not the acceptor." },
            { t:"CO₂, which becomes sugar", why:"CO₂ is handled later, in the Calvin cycle." },
            { t:"ADP, which becomes ATP", why:"ATP is made by ATP synthase, not by accepting electrons." }],
          hints:["What does the chain end with in the stroma?", "Ferredoxin → NADP⁺ reductase → …", "NADP⁺."] },
        { id:"w6", skill:"Electron flow (from 05)", goal:2,
          prompt:"Photosystem II keeps losing excited electrons. What replaces them?",
          options:[
            { t:"Electrons from splitting water", ok:true, why:"2H₂O → 4H⁺ + 4e⁻ + O₂ (photolysis)." },
            { t:"Electrons from photosystem I", why:"Electrons flow PSII → PSI, not back." },
            { t:"Electrons from glucose", why:"No glucose is broken down here." },
            { t:"Nothing; PSII is used up", why:"PSII is refilled every time from water." }],
          hints:["Where does the O₂ of photosynthesis come from?", "Splitting water.", "Water’s electrons."] }
      ],
      refreshers:{
        "pH and H⁺ concentration":"Lower pH = more H⁺. Each pH unit is a factor of 10, so pH 5 has 1000 times the H⁺ of pH 8.",
        "Membrane transport":"Downhill (high → low) through a channel needs no energy. Uphill (low → high) needs a pump and an energy source.",
        "Electron flow (from 05)":"Water → PSII → plastoquinone → cytochrome b₆f → plastocyanin → PSI → ferredoxin → NADP⁺ reductase → NADPH."
      }
    }
  },
  explore:{
    heading:"Thylakoid membrane simulator",
    intro:"Set the light and switch parts of the membrane on or off. Watch the H⁺ in the lumen, the pH, and what the membrane makes each second.",
    modelNote:"Model values. Real chloroplasts move a few more H⁺ per ATP. The model also holds the stroma at pH 8; real stroma rises from about pH 7 in the dark to about pH 8 in the light.",
    toggles:[["herb", "PSII-blocking herbicide"], ["unc", "Uncoupler (H⁺ leak)"], ["blk", "ATP synthase blocker"]],
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"mem", L:0 }, to:{ L:3 },
        prompt:"<span class=\"muted\">Membrane mode, light Off.</span> The light goes from Off to High. What happens to the pH inside the thylakoid (the lumen)?",
        options:[{ t:"It falls to about 5", ok:true }, { t:"It rises to about 11" }, { t:"It stays at 8" }, { t:"The stroma falls to 5 instead" }],
        explain:"H⁺ is released into the lumen when water splits and is moved in by cytochrome b₆f. More H⁺ means a lower pH." },
      { id:"p2", start:{ mode:"mem", L:3 }, to:{ unc:true },
        prompt:"<span class=\"muted\">High light, normal membrane.</span> The uncoupler is switched on. Which product stops?",
        options:[{ t:"ATP only", ok:true }, { t:"O₂ only" }, { t:"NADPH and ATP" }, { t:"All three" }],
        explain:"Electrons still flow from water to NADP⁺. Only the gradient that drives ATP synthase is lost." },
      { id:"p3", start:{ mode:"mem", L:3 }, to:{ herb:true },
        prompt:"<span class=\"muted\">High light, normal membrane.</span> The PSII-blocking herbicide is switched on. What happens to O₂ release?",
        options:[{ t:"It stops", ok:true }, { t:"It continues, because water still splits" }, { t:"It increases" }, { t:"It continues, but ATP stops" }],
        explain:"PSII can’t pass its electrons on, so it can’t take new ones from water: no water splitting, no O₂, and nothing downstream." },
      { id:"p4", start:{ mode:"budget", L:2, c:0, t:2 }, reveal:true,
        prompt:"<span class=\"muted\">Energy budget mode: Medium light, cyclic flow 0, Calvin demand 2 CO₂ per second.</span> What does the Calvin cycle run short of?",
        options:[{ t:"ATP, by 2 per second", ok:true }, { t:"NADPH, by 2 per second" }, { t:"Nothing: supply matches" }, { t:"Both ATP and NADPH" }],
        explain:"Supply: 4 ATP and 4 NADPH. Demand: 6 ATP and 4 NADPH. Noncyclic flow gives 1 ATP per NADPH, but the Calvin cycle uses 3 ATP for every 2 NADPH. Cyclic flow makes up the extra ATP." }
    ],
    chalIntro:"Use the simulator (Membrane mode) to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Set the light so the lumen holds exactly 100 times as many H⁺ as the stroma.",
        why:"Medium light: lumen pH 6, stroma pH 8. Two pH units: 10 × 10 = 100 times.",
        hints:["How many pH units make a factor of 100?", "2 units: the lumen must be pH 6.", "Medium light gives lumen pH 6."] },
      { id:"tc2", goal:4, prompt:"At High light, keep O₂ and NADPH flowing at the full rate but make ATP production 0.",
        why:"The uncoupler lets H⁺ leak back without passing through ATP synthase. The electron chain runs at full speed (3 O₂ and 6 NADPH per second), but there’s no gradient, so no ATP.",
        hints:["Which toggle removes the gradient without touching the electron chain?", "A leak lets H⁺ back without passing through ATP synthase.", "Uncoupler on, herbicide off."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Make the lumen hold 10 000 times as many H⁺ as the stroma.",
        why:"High light with ATP synthase blocked: H⁺ keeps being moved in but can’t get out, so the lumen drops to pH 8 − 3 − 1 = 4. Four pH units: 10 000 times.",
        hints:["10 000 times needs a 4-unit difference: lumen pH 4.", "What happens if H⁺ keeps being pumped in but can’t leave through ATP synthase?", "High light and block ATP synthase."] }
    ]
  },
  part3:{
    slug:"acid-bath", name:"Acid bath",
    heading:"The acid-bath experiment",
    intro:"The simulator is a model. Here is real evidence: thylakoids that make ATP in the dark, powered only by a difference in pH. Watch the set-up, read the data, then zoom in on ATP synthase.",
    bench:{
      title:"Station 1: the set-up",
      how:"Press <strong>Step</strong> (or <strong>Play</strong>) to run the experiment one stage at a time.",
      steps:[
        "Isolated thylakoids soak in a pH 4 buffer, in the dark.",
        "H⁺ seeps in until the lumen is also pH 4.",
        "The thylakoids are moved quickly to a pH 8 buffer containing ADP and Pᵢ, still in the dark.",
        "H⁺ rushes out through ATP synthase, down the gradient: a burst of ATP is measured."
      ],
      short:["soak at pH 4", "lumen reaches pH 4", "move to pH 8 + ADP + Pᵢ", "burst of ATP"],
      caption:"Based on a 1966 experiment by André Jagendorf and Ernest Uribe. The numbers below are model data."
    },
    data:{
      title:"Station 2: Check it with data",
      how:"Each tube held thylakoids, kept in the dark the whole time. Answer each prompt: for the first two, tap the tube rows in the table, then press <strong>Check</strong>.",
      head:["Tube", "Soaked in (dark)", "Moved to (dark)", "Also added", "ATP made (relative units)"],
      rows:[
        ["pH 4", "pH 8", "ADP + Pᵢ", "100"],
        ["pH 4", "pH 4", "ADP + Pᵢ", "0"],
        ["pH 8", "pH 8", "ADP + Pᵢ", "0"],
        ["pH 4", "pH 8", "ADP + Pᵢ + uncoupler", "0"],
        ["pH 4", "pH 8", "Pᵢ only (no ADP)", "0"],
        ["pH 5", "pH 8", "ADP + Pᵢ", "40"]
      ],
      prompts:[
        { id:"d1", kind:"rows", prompt:"Which tubes show that a <strong>difference</strong> in pH is needed?", answer:[2, 3],
          right:"Tubes 2 and 3 had the same pH inside and out (4 and 4, or 8 and 8), and neither made ATP. Acid alone isn’t enough: there has to be a difference.",
          rowFb:{ "1":"Tube 1 had a difference (pH 4 inside, pH 8 outside), and it made ATP.", "4":"Tube 4 had a difference; it made no ATP because of the uncoupler, not because the pH matched.", "5":"Tube 5 had a difference; it made no ATP because there was no ADP.", "6":"Tube 6 had a difference (pH 5 inside, pH 8 outside), and it made ATP." },
          missing:"One more tube shows it too: look for every tube with the same pH inside and out." },
        { id:"d2", kind:"rows", prompt:"Which tube shows the H⁺ must pass through the membrane’s proteins, not leak?", answer:[4],
          right:"Tube 4 matches tube 1 except for the uncoupler, which lets H⁺ leak across the membrane instead of passing through ATP synthase. Same gradient, no ATP.",
          rowFb:{ "1":"Tube 1 made ATP: it’s the comparison, not the evidence.", "2":"Tube 2 had no pH difference to begin with.", "3":"Tube 3 had no pH difference to begin with.", "5":"Tube 5 lacked ADP: it shows ADP is a raw material, not anything about leaks.", "6":"Tube 6 had a smaller gradient, not a leak." },
          missing:"Pick the one tube where something lets H⁺ leak across the membrane." },
        { id:"d3", kind:"chips", prompt:"What is the independent variable across tubes 1, 2 and 6?",
          options:[
            { t:"The pH difference", ok:true, why:"Tubes 1, 2 and 6 differ only in their pH difference (4, 0 and 3 units); everything else is kept the same." },
            { t:"The ATP made", why:"That’s the dependent variable: what was measured." },
            { t:"The ADP and Pᵢ added", why:"All three tubes had ADP + Pᵢ: that was a controlled variable." },
            { t:"The light", why:"Every tube was kept in the dark: light was a controlled variable." }] },
        { id:"d4", kind:"chips", prompt:"Why was the whole experiment done in the dark?",
          options:[
            { t:"To show that light isn’t needed once a gradient exists", ok:true, why:"With no light, the only energy source was the pH gradient, so the ATP must have come from it." },
            { t:"Because light breaks down ATP", why:"Light doesn’t break down ATP. Keeping it dark rules out light as the energy source." },
            { t:"Because thylakoids only make ATP in the dark", why:"Lit thylakoids make ATP too (Explore). Keeping it dark rules out light as the energy source." },
            { t:"To keep the buffers from warming up", why:"Temperature isn’t the point. Keeping it dark rules out light as the energy source." }] }
      ]
    },
    zoom:{
      title:"Station 3: Zoom to the molecules",
      how:"Press <strong>Play the close-up</strong> to watch ATP synthase work. Then press <strong>Reverse the gradient</strong>.",
      normal:"H⁺ enters the membrane part from the lumen side and turns the rotor ring. The turning stalk changes the shape of the head in the stroma, which presses ADP and Pᵢ together into ATP.",
      reversed:"Reversed: the outside (stroma side) is now more acidic than the inside. H⁺ would have to flow in, not out through ATP synthase, so the rotor stops: no ATP."
    },
    quickCheck:{
      title:"Quick check", summary:"Acid bath quick check",
      items:[
        { id:"q1", goal:5, prompt:"What does tube 1 show?",
          choices:[
            { t:"An H⁺ gradient alone can drive ATP synthesis", ok:true, fb:"It was dark, so the energy came from the gradient." },
            { t:"Light is needed to make ATP", fb:"It was dark, so the energy came from the gradient." },
            { t:"Thylakoids store ATP", fb:"It was dark, so the energy came from the gradient." },
            { t:"ADP is made from ATP", fb:"It was dark, so the energy came from the gradient." }] },
        { id:"q2", goal:[3, 5], prompt:"Tube 6 made less ATP than tube 1 because…",
          choices:[
            { t:"its gradient was smaller (3 units, not 4)", ok:true, fb:"pH 5 → 8 is a 1000-fold difference; pH 4 → 8 is 10 000-fold." },
            { t:"it had less ADP", fb:"pH 5 → 8 is a 1000-fold difference; pH 4 → 8 is 10 000-fold." },
            { t:"it was lit", fb:"pH 5 → 8 is a 1000-fold difference; pH 4 → 8 is 10 000-fold." },
            { t:"pH 5 is basic", fb:"pH 5 → 8 is a 1000-fold difference; pH 4 → 8 is 10 000-fold." }] },
        { id:"q3", goal:5, prompt:"Which tube is the control for the uncoupler’s effect?",
          choices:[
            { t:"1", ok:true, fb:"Tube 1 is identical except for the uncoupler." },
            { t:"2", fb:"Tube 1 is identical except for the uncoupler." },
            { t:"3", fb:"Tube 1 is identical except for the uncoupler." },
            { t:"5", fb:"Tube 1 is identical except for the uncoupler." }] },
        { id:"q4", goal:[3, 5], prompt:"Thylakoids soaked at pH 8 and moved to pH 4 make…",
          choices:[
            { t:"no ATP", ok:true, fb:"The gradient points the wrong way: H⁺ would flow in, not out through ATP synthase." },
            { t:"twice the ATP", fb:"The gradient points the wrong way: H⁺ would flow in, not out through ATP synthase." },
            { t:"the same ATP", fb:"The gradient points the wrong way: H⁺ would flow in, not out through ATP synthase." },
            { t:"ATP only in light", fb:"The gradient points the wrong way: H⁺ would flow in, not out through ATP synthase." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"where", type:"sorter", title:"Where does it happen?", noun:"card", goal:[1, 2], txt:true,
        instruction:"Twelve events in the light reactions. Sort each one into the part of the chloroplast where it happens.",
        boxes:[{ id:"lu", label:"Inside the thylakoid (lumen)" }, { id:"mem", label:"In the thylakoid membrane" }, { id:"st", label:"In the stroma" }],
        items:sortItems() },
      { id:"calc", type:"custom", title:"Predict and calculate", summary:"Predict and calculate", star:true, goal:[3, 4, 5, 6],
        instruction:"Seven problems on pH ratios, the model’s numbers and blocked or changed parts. Problems 3 to 7 are non-routine; the last two go beyond the Final Check.", how:"",
        items:[
          { id:"r1", kind:"num", goal:3, prompt:"Lumen pH 5, stroma pH 8. How many times as many H⁺ are in the lumen?",
            answer:1000, display:"1000 times as many", unit:"times",
            wrong:[{ match:3, fb:"Each unit is ×10." }, { match:30, fb:"Each unit is ×10." }] },
          { id:"r2", kind:"num", goal:3, prompt:"Lumen pH 6.5, stroma pH 8.5. How many times as many H⁺?",
            answer:100, display:"100 times as many", unit:"times",
            wrong:[{ match:2, fb:"That’s the pH difference, not the ratio. Each unit is ×10." }] },
          { id:"r3", kind:"pair", goal:[2, 3], star:true, use:MODEL,
            prompt:"In the model, a membrane releases 2 O₂ per second (noncyclic only). How many NADPH and ATP per second?",
            answer:[4, 4], labels:["NADPH per second", "ATP per second"], display:"4 NADPH and 4 ATP per second",
            wrongFb:"4 electrons per O₂; 2 electrons per NADPH; 8 H⁺ per O₂ and 4 H⁺ per ATP." },
          { id:"r4", kind:"num", goal:[3, 6], star:true, use:MODEL,
            prompt:"The Calvin cycle fixes 2 CO₂ per second (needs 6 ATP and 4 NADPH). Noncyclic flow supplies 4 NADPH and 4 ATP. How many cyclic electron pairs per second make up the ATP?",
            answer:4, display:"4 cyclic pairs per second", unit:"pairs per second",
            wrong:[{ match:2, fb:"Each cyclic pair moves 2 H⁺, and 4 H⁺ make 1 ATP: 2 ATP need 8 H⁺ = 4 pairs." }],
            hints:["How many extra ATP are needed?", "6 − 4 = 2 ATP, which needs 8 H⁺.", "8 H⁺ ÷ 2 H⁺ per pair = 4 pairs."] },
          { id:"r5", kind:"chips", goal:6, star:true,
            prompt:"A weed’s PSII has a changed binding site, so a PSII-blocking herbicide can’t attach. Sprayed in sunlight, its O₂ release will be…",
            options:[
              { t:"normal", ok:true, why:"If the herbicide can’t bind, the chain runs as usual: this is herbicide resistance." },
              { t:"zero", why:"If the herbicide can’t bind, the chain runs as usual: this is herbicide resistance." },
              { t:"doubled", why:"If the herbicide can’t bind, the chain runs as usual: this is herbicide resistance." },
              { t:"normal but no ATP", why:"If the herbicide can’t bind, the chain runs as usual: this is herbicide resistance." }] },
          { id:"r6", kind:"chips", goal:[4, 5], star:true,
            prompt:"Lit thylakoids are given ADP, Pᵢ, an uncoupler and a blue dye that turns colourless when it accepts electrons. Predict both observations.",
            options:[
              { t:"dye turns colourless, no ATP", ok:true, why:"Electrons still flow (the dye accepts them), but the leak removes the gradient." },
              { t:"dye stays blue, no ATP", why:"Electrons still flow (the dye accepts them), but the leak removes the gradient." },
              { t:"dye turns colourless, ATP made", why:"Electrons still flow (the dye accepts them), but the leak removes the gradient." },
              { t:"dye stays blue, ATP made", why:"Electrons still flow (the dye accepts them), but the leak removes the gradient." }],
            hints:["Does the uncoupler touch the electron chain?", "No: electrons still reach an acceptor.", "Colourless dye, no ATP."] },
          { id:"r7", kind:"chips", goal:3, star:true,
            prompt:"If the stroma were pH 7 instead of 8 while the lumen stayed at pH 5, how would the H⁺ ratio change?",
            options:[
              { t:"10 times smaller", ok:true, why:"1000-fold becomes 100-fold: one pH unit less of difference." },
              { t:"10 times larger", why:"1000-fold becomes 100-fold: one pH unit less of difference." },
              { t:"1 unit smaller", why:"1000-fold becomes 100-fold: one pH unit less of difference." },
              { t:"unchanged", why:"1000-fold becomes 100-fold: one pH unit less of difference." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Bella", how:"",
        instruction:"Bella made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain how light leads to ATP in a chloroplast.",
            steps:["Light excites electrons in photosystem II.", "The electrons pass along the chain, and cytochrome b₆f uses their energy to move H⁺ out of the thylakoid into the stroma.", "This makes the stroma acidic.", "H⁺ flows back through ATP synthase, which makes ATP."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 is fine on its own. Look earlier."],
            fixes:[
              { t:"Cytochrome b₆f moves H⁺ <strong>into</strong> the thylakoid lumen, making the lumen acidic (about pH 5).", ok:true, why:M1 },
              { t:"Cytochrome b₆f moves electrons into the stroma.", why:"Electrons stay on the carriers." },
              { t:"Cytochrome b₆f makes ATP directly.", why:M2 },
              { t:"Step 2 is correct.", why:"The lumen, not the stroma, becomes acidic." }],
            hints:["Which compartment ends up at pH 5?", "The lumen.", "H⁺ is moved into the lumen."] },
          { id:"e2", goal:4, task:"Predict the effect of an uncoupler on lit chloroplasts.",
            steps:["An uncoupler lets H⁺ leak across the thylakoid membrane.", "So the H⁺ gradient disappears.", "So electrons stop flowing and no O₂ is released.", "So no NADPH or ATP is made."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Electrons still flow from water to NADP⁺, so O₂ and NADPH are still made; only ATP stops.", ok:true, why:M3 },
              { t:"Electrons flow faster and ATP doubles.", why:"No gradient means no ATP." },
              { t:"Only O₂ stops.", why:M3 },
              { t:"Step 3 is correct.", why:"The leak doesn’t block any electron carrier." }],
            hints:["Which part does the uncoupler affect?", "Only the membrane’s tightness to H⁺.", "Only ATP stops."] },
          { id:"e3", goal:3, task:"The lumen is pH 4.5 and the stroma pH 7.5. Compare their H⁺ concentrations.",
            steps:["The difference is 7.5 − 4.5 = 3 pH units.", "Each pH unit is a factor of 10.", "So the lumen has 3 × 10 = 30 times as many H⁺.", "So the gradient is quite small."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"Multiply three factors of 10: 10 × 10 × 10 = 1000 times as many H⁺.", ok:true, why:M4 },
              { t:"3 + 10 = 13 times.", why:"Factors of 10 multiply." },
              { t:"7.5 ÷ 4.5 ≈ 1.7 times.", why:"Dividing pH values doesn’t work: the scale is logarithmic." },
              { t:"Step 3 is correct.", why:"Factors of 10 multiply." }],
            hints:["One unit is ×10; two units?", "×100.", "Three units: ×1000."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: that an uncoupler stops only ATP, or that blocking ATP synthase makes the gradient steeper?" },
      { id:"j2", q:"In your own words, explain why the H⁺ gradient is called the ‘middleman’ between electrons and ATP." },
      { id:"j3", q:"Explain to a friend how the acid-bath experiment shows light isn’t needed once a gradient exists." },
      { id:"j4", q:"Which part of the light reactions is still fuzzy for you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"During the light reactions, where do H⁺ ions build up?", options:[
          { t:"Inside the thylakoid (the lumen)", ok:true, why:"H⁺ is pumped in and released there when water splits." },
          { t:"In the stroma", why:"The stroma loses H⁺ and rises to about pH 8." },
          { t:"In the intermembrane space", why:"That’s a mitochondrial space." },
          { t:"In the cytoplasm outside the chloroplast", why:"The gradient is across the thylakoid membrane." }] },
        b:{ prompt:"Where does a chloroplast’s ATP synthase release the ATP it makes?", options:[
          { t:"Into the stroma", ok:true, why:"Its head faces the stroma, beside the Calvin cycle." },
          { t:"Into the lumen", why:"The lumen is where H⁺ builds up, not where ATP appears." },
          { t:"Into the intermembrane space", why:"That’s in mitochondria." },
          { t:"Into the thylakoid membrane", why:"ATP is a soluble molecule released from the head." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which list gives all three products the light reactions send on or release?", options:[
          { t:"ATP, NADPH and O₂", ok:true, why:"ATP and NADPH go on to the Calvin cycle; O₂ is released." },
          { t:"ATP, NADPH and CO₂", why:"CO₂ is used by the Calvin cycle; it isn’t made here." },
          { t:"Glucose and O₂", why:"Glucose comes from the Calvin cycle." },
          { t:"ATP and O₂ only", why:"NADPH, the electron carrier, is a product too." }] },
        b:{ prompt:"Which list gives the inputs of the light reactions?", options:[
          { t:"Light, H₂O, ADP + Pᵢ and NADP⁺", ok:true, why:"Light and water go in, with ADP + Pᵢ and NADP⁺ returning from the Calvin cycle." },
          { t:"Light, CO₂ and ATP", why:"CO₂ goes to the Calvin cycle." },
          { t:"Light, H₂O and CO₂", why:M5 },
          { t:"Glucose and O₂", why:"Those are the inputs of cellular respiration." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What directly turns the rotor of ATP synthase?", options:[
          { t:"H⁺ ions flowing down their gradient, from the lumen to the stroma", ok:true, why:"The flow of H⁺ through the membrane part turns the rotor, and the turning drives ATP synthesis." },
          { t:"Electrons passing through it from PSI", why:"Electrons travel on the carriers, never through ATP synthase." },
          { t:"Light absorbed by ATP synthase", why:"ATP synthase has no pigment." },
          { t:"H⁺ being pumped into the lumen by ATP synthase", why:"That’s cytochrome b₆f’s job; ATP synthase lets H⁺ out." }] },
        b:{ prompt:"Which describes the H⁺ flow through a chloroplast’s ATP synthase?", options:[
          { t:"From the lumen into the stroma, down the gradient", ok:true, why:"H⁺ flows from high concentration (the lumen, about pH 5) to low (the stroma, about pH 8)." },
          { t:"From the stroma into the lumen, against the gradient", why:M1 },
          { t:"From PSII to PSI", why:"That’s the electron path." },
          { t:"In both directions equally", why:"Net flow is downhill, from high H⁺ to low." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"An uncoupler that lets H⁺ leak through the thylakoid membrane is added to lit chloroplasts. Which outcome is expected?", options:[
          { t:"ATP production stops, but O₂ and NADPH are still made", ok:true, why:"The chain still runs; only the gradient is lost." },
          { t:"O₂, NADPH and ATP all stop", why:M3 },
          { t:"O₂ stops, but ATP continues", why:"The leak doesn’t affect water splitting." },
          { t:"NADPH stops, but ATP continues", why:"Without a gradient there’s no ATP." }] },
        b:{ prompt:"A herbicide that blocks electrons leaving PSII is added to lit chloroplasts. Which outcome is expected?", options:[
          { t:"O₂, NADPH and ATP from noncyclic flow all stop", ok:true, why:"No electrons leave PSII, so water isn’t split and nothing downstream runs." },
          { t:"Only ATP stops", why:"That’s an uncoupler’s effect." },
          { t:"O₂ continues because water still splits", why:"PSII can’t take new electrons from water if it can’t pass on its own." },
          { t:"NADPH continues because PSI still absorbs light", why:"PSI has no electrons arriving from PSII to pass on." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"In bright light the lumen is pH 5 and the stroma pH 8. How many times as many H⁺ are in the lumen?", options:[
          { t:"1000", ok:true, why:"10³: three pH units, each a factor of 10." },
          { t:"3", why:"That’s the pH difference, not the ratio." },
          { t:"30", why:"Factors of 10 multiply." },
          { t:"300", why:M4 }] },
        b:{ prompt:"In a lab test the lumen is pH 4.5 and the outside buffer pH 7.5. How many times as many H⁺ are inside?", options:[
          { t:"1000", ok:true, why:"3 units: 10³." },
          { t:"3", why:"That’s the pH difference, not the ratio." },
          { t:"30", why:"Factors of 10 multiply." },
          { t:"1.7", why:"Dividing pH values doesn’t work: the scale is logarithmic." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Thylakoids soaked at pH 4 are moved in the dark to pH 8 with ADP and Pᵢ, and ATP is made. A second batch soaked at pH 4 is moved to pH 4. What happens in the second batch, and what does the pair show?", options:[
          { t:"No ATP; a pH difference, not light or acid alone, drives ATP synthesis", ok:true, why:"Both batches were acidic inside, but only the one moved to pH 8 had a difference for H⁺ to flow down." },
          { t:"The same ATP; any acid makes ATP", why:"Acid alone isn’t enough: with pH 4 inside and out there’s no difference, so no H⁺ flows through ATP synthase." },
          { t:"More ATP, because there are more H⁺ outside", why:"H⁺ has to flow <strong>out</strong> through ATP synthase; with no difference there’s no flow." },
          { t:"No ATP in either batch, because it’s dark", why:"The first batch did make ATP in the dark." }] },
        b:{ prompt:"Thylakoids soaked at pH 8 are moved in the dark to pH 4 with ADP and Pᵢ. What happens, and why?", options:[
          { t:"No ATP is made, because the gradient points the wrong way for ATP synthase", ok:true, why:M7 },
          { t:"ATP is made, because there is a 4-unit difference", why:M7 },
          { t:"ATP is made, but only if light is added", why:"Light isn’t the issue; the direction of the gradient is." },
          { t:"ATP is made, because pH 4 is acidic", why:"H⁺ would flow <strong>into</strong> the thylakoid, not out through ATP synthase." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the clearest explanation of chemiosmosis in a chloroplast?", options:[
          { t:"“Energy from excited electrons moves H⁺ into the thylakoid. The H⁺ can only flow back out through ATP synthase, and that flow powers the joining of ADP and Pᵢ into ATP in the stroma.”", ok:true, why:"It names the energy source, which way H⁺ moves, the only way back out, and where the ATP is made." },
          { t:"“Light hits ATP synthase and turns ADP into ATP.”", why:"ATP synthase has no pigment: H⁺ flow, not light, turns it." },
          { t:"“Electrons flow through ATP synthase into the stroma, making ATP.”", why:M2 },
          { t:"“H⁺ is pumped into the stroma and then used to make NADPH.”", why:M1 }] },
        b:{ prompt:"Which flow chart best shows the energy conversions in the light reactions?", options:[
          { t:"Light energy → excited electrons → H⁺ gradient → chemical energy in ATP (with NADPH also made)", ok:true, why:"Each step stores the energy in a new form, with some lost as heat along the way." },
          { t:"Light energy → ATP → H⁺ gradient → excited electrons", why:"The order is reversed." },
          { t:"Light energy → glucose → ATP", why:M5 },
          { t:"Heat → light → ATP", why:"The input is light; some energy is <strong>lost</strong> as heat at each step (second law)." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which best explains why the lumen’s pH falls in the light?", options:[
          { t:"“H⁺ is released into the lumen when water is split and is moved in by cytochrome b₆f, while making NADPH removes H⁺ from the stroma.”", ok:true, why:"Two sources add H⁺ to the lumen, and making NADPH takes it from the stroma: more H⁺ inside means a lower pH." },
          { t:"“ATP synthase pumps H⁺ into the lumen.”", why:"ATP synthase lets H⁺ out." },
          { t:"“O₂ is acidic, and it builds up in the lumen.”", why:"O₂ isn’t an acid; H⁺ sets the pH." },
          { t:"“H⁺ moves from the lumen to the stroma.”", why:M1 }] },
        b:{ prompt:"Which best explains why blocking ATP synthase makes the lumen even more acidic?", options:[
          { t:"“H⁺ is still being moved in, but its main exit is closed, so it piles up until back-pressure slows electron flow.”", ok:true, why:"H⁺ keeps arriving but can’t leave through ATP synthase. In the model, the lumen drops one more pH unit and electron flow halves." },
          { t:"“ATP synthase normally adds H⁺ to the lumen.”", why:M2 },
          { t:"“Blocking ATP synthase stops water splitting.”", why:"Water splitting continues, although more slowly." },
          { t:"“The stroma becomes more acidic instead.”", why:M1 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Some weedkillers bind to photosystem II. Why does a sprayed weed starve even in full sunlight?", options:[
          { t:"No electrons leave PSII, so no ATP or NADPH is made; the Calvin cycle stops and no sugar is produced", ok:true, why:"Without ATP and NADPH the Calvin cycle can’t fix CO₂, so the weed runs out of sugar." },
          { t:"The weed’s chlorophyll stops absorbing light", why:"Light is absorbed; the electrons just can’t move on." },
          { t:"The weed makes too much ATP", why:"No electrons flow, so no extra ATP." },
          { t:"The weed can’t take in water", why:"Water uptake isn’t the target." }] },
        b:{ prompt:"A chemical that makes thylakoid membranes leaky to H⁺ is sprayed on leaves. Why does sugar production stop?", options:[
          { t:"The gradient collapses, so no ATP is made; without ATP the Calvin cycle can’t run, even though NADPH is still made", ok:true, why:"The Calvin cycle needs both ATP and NADPH; the leak removes the gradient that makes ATP." },
          { t:"No NADPH can be made", why:"Electrons still reach NADP⁺." },
          { t:"Water can’t be split", why:M3 },
          { t:"The leaves can’t absorb CO₂", why:"Stomata aren’t affected; the Calvin cycle lacks ATP." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Some salt-loving microbes use a light-driven pump to push H⁺ <strong>out</strong> of the cell across the cell membrane. Their ATP synthase is in that same membrane. Where is its ATP-making head, and which way do H⁺ ions flow through it?", options:[
          { t:"Inside the cell, with H⁺ flowing back into the cell", ok:true, why:"Same rule: H⁺ is pumped to one side and flows back through ATP synthase, whose head faces the side where ATP is used." },
          { t:"Outside the cell, with H⁺ flowing out", why:"H⁺ is already outside; it must flow back in." },
          { t:"Inside the cell, with H⁺ flowing out", why:"That’s against the gradient." },
          { t:"There is no head; light makes ATP directly", why:"Light only powers the pump. ATP synthase still needs H⁺ flowing back through it to make ATP." }] },
        b:{ prompt:"In a mitochondrion, H⁺ is pumped from the matrix into the intermembrane space. Where is ATP synthase’s head, and which way does H⁺ flow through it?", options:[
          { t:"In the matrix, with H⁺ flowing from the intermembrane space into the matrix", ok:true, why:"H⁺ is pumped out into the intermembrane space and flows back into the matrix, where the head makes ATP: the same rule as in the chloroplast." },
          { t:"In the intermembrane space, with H⁺ flowing out of the matrix", why:"That’s the pumping direction, not the return." },
          { t:"In the matrix, with H⁺ flowing into the intermembrane space", why:"That’s uphill." },
          { t:"In the stroma", why:"That’s a chloroplast space." }] } }
    ]
  },
  task:{
    title:"Balance the budget", summary:"Balance the budget",
    statement:"<p>The Calvin cycle in a leaf cell will fix <i>t</i> CO₂ per second, using 3 ATP and 2 NADPH for each CO₂. Design light-reaction settings that supply exactly what it needs, with no waste. Can you find all the answers?</p><ol class=\"lr-tlist\"><li>ATP supply equals ATP demand.</li><li>NADPH supply equals NADPH demand.</li><li>The thylakoid membrane is sealed (no uncoupler).</li></ol><p class=\"tiny muted\"><span class=\"bio-model\">Model</span> As in the simulator’s Energy budget mode: supply ATP = 2<i>L</i> + <i>c</i>/2 and NADPH = 2<i>L</i> (light level <i>L</i> = 0 to 3, <i>c</i> cyclic electron pairs per second); demand ATP = 3<i>t</i> and NADPH = 2<i>t</i>. The live bars show supply and demand.</p>",
    checks:["ATP supply = demand", "NADPH supply = demand", "Membrane sealed"],
    tips:[
      "Each CO₂ needs 3 ATP. Noncyclic flow gives only 2 ATP for every 2 NADPH. Where can extra ATP come from without extra NADPH?",
      "NADPH comes only from noncyclic flow: 2 per light level. Match the light level to the demand.",
      "A leak wastes the gradient, so no ATP is made."
    ],
    explainPrompt:"Explain why the light reactions need cyclic electron flow to keep the Calvin cycle running, and how you chose <i>L</i> and <i>c</i>.",
    vocab:"Use the words noncyclic, cyclic, NADPH, ATP and gradient.",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every answer has <i>L</i> = <i>t</i> and <i>c</i> = 2<i>t</i>. Cyclic flow must supply one extra ATP per 2 NADPH, which takes 4 H⁺, or 2 cyclic pairs, for each CO₂."
  },
  cards:[
    ["Light reactions: inputs", "Light, H₂O, ADP + Pᵢ, NADP⁺"],
    ["Light reactions: products", "O₂ (released), ATP and NADPH (to the Calvin cycle)"],
    ["Where H⁺ builds up", "Inside the thylakoid (lumen), about pH 5 in bright light"],
    ["Where ATP and NADPH appear", "The stroma, beside the Calvin cycle"],
    ["Two sources of lumen H⁺", "Splitting water (photolysis) and pumping by cytochrome b₆f"],
    ["Chemiosmosis", "Using the flow of H⁺ down its gradient through ATP synthase to make ATP"],
    ["Photophosphorylation", "Making ATP using energy that came from light"],
    ["pH 5 vs pH 8", "1000 times as many H⁺ (each pH unit is ×10)"],
    ["Uncoupler", "Lets H⁺ leak: electrons, O₂ and NADPH continue; ATP stops"],
    ["PSII-blocking herbicide", "Stops electron flow from PSII: no O₂, NADPH or ATP from noncyclic flow"],
    ["Why cyclic flow?", "Noncyclic flow gives about 1 ATP per NADPH; the Calvin cycle needs 3 ATP per 2 NADPH"],
    ["Acid-bath experiment", "A pH gradient made in the dark is enough to make ATP: evidence for chemiosmosis"]
  ]
};
