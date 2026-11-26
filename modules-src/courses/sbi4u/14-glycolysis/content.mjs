// SBI4U 14 Glycolysis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/14-glycolysis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "4 ATP are made, but 2 were spent in steps 1 and 3: net 2.";
const M2 = "Glycolysis is in the cytosol and uses no O₂. It needs NAD⁺, which O₂ helps regenerate later.";
const M3 = "In glycolysis an enzyme transfers a phosphate from a substrate to ADP: substrate-level phosphorylation. No gradient, no ATP synthase.";
const M4 = "Step 6 adds an inorganic phosphate (Pᵢ) from solution, powered by the oxidation of G3P. No ATP is spent there.";
const M5 = "Everything after the split happens twice per glucose.";
const M6 = "High ATP means the cell has plenty, so ATP inhibits PFK and glycolysis slows. That’s feedback inhibition.";
const M7 = "If the payoff steps are blocked, the 2 ATP invested aren’t paid back: the net can be 0 or even −2.";
const NET_EQ = "glucose + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 pyruvate + 2 NADH + 2 H⁺ + 2 ATP + 2 H₂O";

export default {
  id:"14-glycolysis",
  kind:"topic",
  title:"Glycolysis",
  topic:"Glycolysis",
  readyTopic:"glycolysis",
  hero:{
    eq:'<span class="gl-heq"><span class="bio-chem">glucose (6C)</span> <span class="gl-arr"><small class="gl-harm">−2 ATP</small><span aria-hidden="true">→</span></span> <span class="bio-chem">2 G3P (3C)</span> <span class="gl-arr"><small class="gl-harp">+4 ATP, +2 NADH</small><span aria-hidden="true">→</span></span> <span class="bio-chem">2 pyruvate (3C)</span> <span class="gl-hnet">net 2 ATP</span></span>',
    eqLabel:"Glucose, with 6 carbons, becomes 2 G3P, spending 2 ATP. The 2 G3P become 2 pyruvate, with 3 carbons each, making 4 ATP and 2 NADH. Net 2 ATP.",
    eqSize:"sm",
    headline:"Spend 2, earn 4.",
    text:"<strong>Glycolysis</strong> splits one glucose into two <strong>pyruvate</strong> in the cytosol, without oxygen. The cell first <em>invests</em> 2 ATP to prime the sugar, then splits it and collects a <em>payoff</em> of 4 ATP and 2 <strong>NADH</strong>. It’s the oldest energy pathway in life, used by nearly every cell on Earth.",
    fig:{ html:'<div class="gl-hero" id="gl-hero" role="img" aria-label="A brown hexagon, glucose, enters the cytosol. Two orange ATP each leave one orange phosphate on the sugar: minus 2 ATP. The sugar, now with a phosphate at each end, splits into two 3-carbon pieces, each carrying one phosphate. Each piece picks up a grey inorganic phosphate from solution and loads a teal NADH: plus 2 NADH. Each piece hands both its phosphates to ADP, one at a time, and four orange ATP pop out: plus 4 ATP. Two brown triangles, pyruvate, remain. A tally reads net 2 ATP, 2 NADH, 2 pyruvate."></div>' }
  },
  goals:[
    "I can describe glycolysis as an investment phase and a payoff phase, and say where it happens.",
    "I can state the inputs and outputs of glycolysis per glucose, and the net ATP.",
    "I can follow the carbon atoms and phosphate groups through the main steps.",
    "I can explain substrate-level phosphorylation and how it differs from oxidative phosphorylation.",
    "I can explain how glycolysis is controlled at phosphofructokinase.",
    "I can predict what happens when a step is blocked or NAD⁺ runs out."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Stages of respiration", goal:1,
          prompt:"Where in the cell does glycolysis happen?",
          options:[
            { t:"The cytosol", ok:true, why:"Outside the mitochondria." },
            { t:"The mitochondrial matrix", why:"That’s the Krebs cycle." },
            { t:"The inner mitochondrial membrane", why:"That’s the electron transport chain." },
            { t:"The nucleus", why:"The nucleus stores DNA." }],
          hints:["Is it inside or outside the mitochondrion?", "Outside.", "The cytosol."] },
        { id:"w2", skill:"Stages of respiration", goal:2,
          prompt:"What is the end product of glycolysis?",
          options:[
            { t:"Pyruvate", ok:true, why:"Two per glucose." },
            { t:"Acetyl-CoA", why:"That’s made in pyruvate oxidation, the next stage." },
            { t:"CO₂", why:"Glycolysis releases no CO₂." },
            { t:"Lactate", why:"Lactate is made only in fermentation." }],
          hints:["It’s a 3-carbon molecule.", "Its name starts with “pyr”.", "Pyruvate."] },
        { id:"w3", skill:"ATP and phosphates", goal:4,
          prompt:"When ATP gives away a phosphate group, it becomes…",
          options:[
            { t:"ADP", ok:true, why:"Adenosine diphosphate: two phosphates left." },
            { t:"AMP", why:"AMP has one phosphate; that takes two removals." },
            { t:"ATP again", why:"It has lost a phosphate." },
            { t:"NADH", why:"NADH is an electron carrier." }],
          hints:["Tri- → ?", "Two phosphates left: di-.", "ADP."] },
        { id:"w4", skill:"ATP and phosphates", goal:4,
          prompt:"Adding a phosphate group to a molecule is called…",
          options:[
            { t:"phosphorylation", ok:true, why:"Kinase enzymes do it." },
            { t:"oxidation", why:"Oxidation is losing electrons." },
            { t:"hydrolysis", why:"Hydrolysis splits with water." },
            { t:"reduction", why:"Reduction is gaining electrons." }],
          hints:["The word contains “phosphate”.", "Phosphor- + -ylation.", "Phosphorylation."] },
        { id:"w5", skill:"Enzymes and inhibition", goal:5,
          prompt:"In feedback inhibition, a pathway’s product…",
          options:[
            { t:"inhibits an early enzyme of the same pathway", ok:true, why:"It switches off its own production." },
            { t:"activates the first enzyme", why:"That would make even more product." },
            { t:"is destroyed by the last enzyme", why:"Products aren’t destroyed by feedback." },
            { t:"becomes a new substrate", why:"That’s a different idea." }],
          hints:["“Feedback” loops back to the start.", "Too much product → slow down.", "Inhibits an early enzyme."] },
        { id:"w6", skill:"Enzymes and inhibition", goal:5,
          prompt:"An allosteric inhibitor binds…",
          options:[
            { t:"away from the active site, changing the enzyme’s shape", ok:true, why:"Allo- means “other”: it binds another site, and the change of shape slows the enzyme." },
            { t:"in the active site", why:"That’s a competitive inhibitor." },
            { t:"to the substrate", why:"Inhibitors bind the enzyme." },
            { t:"permanently, destroying the enzyme", why:"Allosteric inhibition is reversible." }],
          hints:["Allo- means “other”.", "Another site.", "Away from the active site, changing the enzyme’s shape."] }
      ],
      refreshers:{
        "Stages of respiration":"Glycolysis (cytosol) → pyruvate oxidation and Krebs (matrix) → chain (inner membrane). Glycolysis ends with 2 pyruvate.",
        "ATP and phosphates":"ATP → ADP + Pᵢ releases energy. Adding a phosphate is phosphorylation; enzymes that do it are kinases.",
        "Enzymes and inhibition":"Allosteric inhibitors bind away from the active site. In feedback inhibition, an end product slows an early enzyme."
      }
    }
  },
  explore:{
    heading:"Glycolysis stepper",
    intro:"Step through glycolysis one reaction at a time. Watch the carbons, the phosphates, the ATP and the NADH, then break it on purpose and see what happens.",
    chalIntro:"Use the stepper to meet each goal, then press <strong>Check challenge</strong>. For challenges 2 and 3, type your numbers in the answer boxes under the controls. Each challenge has three levels of help.",
    modelNote:"PFK activity percentages are model values.",
    // The ten steps (plan table). Per glucose, steps 6–10 happen twice.
    steps:[
      { n:1, r:"glucose → glucose-6-phosphate", e:"hexokinase", tok:"−1 ATP; P on C6" },
      { n:2, r:"glucose-6-phosphate → fructose-6-phosphate", e:"isomerase", tok:"rearranged" },
      { n:3, r:"fructose-6-phosphate → fructose-1,6-bisphosphate", e:"phosphofructokinase (PFK)", tok:"−1 ATP; 2 P on the sugar" },
      { n:4, r:"fructose-1,6-bisphosphate → DHAP + G3P", e:"aldolase", tok:"6C → 3C + 3C" },
      { n:5, r:"DHAP → G3P", e:"isomerase", tok:"now 2 G3P" },
      { n:6, r:"G3P + NAD⁺ + Pᵢ → 1,3-bisphosphoglycerate + NADH + H⁺", e:"G3P dehydrogenase", tok:"+1 NADH each; Pᵢ added" },
      { n:7, r:"1,3-bisphosphoglycerate + ADP → 3-phosphoglycerate + ATP", e:"phosphoglycerate kinase", tok:"+1 ATP each" },
      { n:8, r:"3-phosphoglycerate → 2-phosphoglycerate", e:"mutase", tok:"phosphate moves" },
      { n:9, r:"2-phosphoglycerate → phosphoenolpyruvate (PEP) + H₂O", e:"enolase", tok:"water removed" },
      { n:10, r:"PEP + ADP → pyruvate + ATP", e:"pyruvate kinase", tok:"+1 ATP each" }
    ],
    stages:[
      { n:1, name:"Prime", t:"steps 1–3: −2 ATP" },
      { n:2, name:"Split", t:"steps 4–5: 2 G3P" },
      { n:3, name:"Oxidize", t:"step 6: 2 NADH" },
      { n:4, name:"Pay off", t:"steps 7–10: +4 ATP, 2 pyruvate" }
    ],
    predictions:[
      { id:"p1", prompt:"All-10 view, 1 glucose: step to the end of step 3. What is the net ATP so far?",
        options:[{ t:"−2", ok:true }, { t:"0" }, { t:"+2" }, { t:"−1" }],
        explain:"Steps 1 and 3 each spend one ATP to prime the sugar.",
        reveal:"The ATP strip shows 2 spent, 0 made: net −2.",
        start:{ view:"all", pos:0, spot:"none", block:"none" }, to:3 },
      { id:"p2", prompt:"Step 4. What happens to the 6-carbon sugar?",
        options:[{ t:"It splits into two 3-carbon sugars", ok:true }, { t:"It loses a CO₂" }, { t:"It becomes pyruvate" }, { t:"It splits into six 1-carbon pieces" }],
        explain:"From here, every step happens twice per glucose.",
        reveal:"Aldolase split the sugar into DHAP + G3P; then step 5 turned the DHAP into a second G3P.",
        start:{ view:"all", pos:3, spot:"none", block:"none" }, to:5 },
      { id:"p3", prompt:"Spotlight Phosphate; step 6. Where does the new phosphate at step 6 come from?",
        options:[{ t:"Inorganic phosphate (Pᵢ) in the cytosol", ok:true }, { t:"An ATP molecule" }, { t:"NADH" }, { t:"Pyruvate" }],
        explain:"The energy from oxidizing G3P powers adding a free phosphate. No ATP is spent at step 6.",
        reveal:"A grey Pᵢ joined each G3P as NADH was loaded. The ATP spent is still 2.",
        start:{ view:"all", pos:5, spot:"phosphate", block:"none" }, to:6 },
      { id:"p4", prompt:"Block step 10; run 1 glucose. What is the net ATP per glucose now?",
        options:[{ t:"0", ok:true }, { t:"2" }, { t:"−2" }, { t:"4" }],
        explain:"Step 7 pays back the investment, but step 10’s 2 ATP never come.",
        reveal:"Steps 1–9 ran; the counter reads spent 2, made 2: net 0.",
        start:{ view:"all", pos:0, spot:"none", block:"10" }, to:10 }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Step forward to the exact moment the net ATP first returns to 0.",
        why:"Steps 1 and 3 spent 2 ATP. Step 7 makes 2 ATP, one per 3C piece, so the net is back to 0.",
        general:"Use the All 10 steps view with 1 glucose, and watch the net ATP counter as you step.",
        named:{ view:"Switch the view to “All 10 steps” first.", g:"Use 1 glucose.", block:"Set “Block a step” to none first.",
          s6:"Step 6 makes NADH, not ATP.", s10:"By then the net is +2.", late:"The net is 0 here, but it got back to 0 at an earlier step. Step back.",
          start:"Nothing has happened yet. Step forward.", neg:"The net is still negative. Keep stepping." },
        hints:["Net starts at −2 after step 3.", "Which is the first step that makes ATP?", "Step 7 makes 2 ATP (one per 3C piece): net 0."] },
      { id:"tc2", goal:2, prompt:"Run 3 glucose with plenty of NAD⁺. Enter the totals: NADH, net ATP, pyruvate.",
        why:"Per glucose: 2 NADH, net 2 ATP, 2 pyruvate. × 3: 6, 6, 6.",
        general:"Find the per-glucose values first, then multiply by 3.",
        named:{ blank:"Type all three totals (NADH, net ATP, pyruvate) in the answer boxes for challenge 2.",
          nadh:"2 NADH per glucose, one per G3P.", atp:"That’s the ATP made. Subtract the 6 spent.", pyr:"2 pyruvate per glucose." },
        hints:["Find the per-glucose values first.", "Per glucose: 2 NADH, net 2 ATP, 2 pyruvate.", "× 3: 6, 6, 6."] },
      { id:"tc3", goal:6, stretch:true,
        prompt:"Limited pool of <strong>8 NAD⁺</strong>, nothing regenerates it. Glucose keeps arriving, but you choose how many to let in. Find the number of glucose that gives the <strong>largest net ATP</strong>, and enter that net ATP.",
        why:"8 NAD⁺ ÷ 2 = 4 glucose can finish, and 4 × net 2 = 8 ATP. A fifth glucose would spend 2 ATP and then stall at step 6.",
        general:"Each glucose needs 2 NAD⁺. Set the number of glucose that uses the pool exactly, then enter the net ATP.",
        named:{ pool:"Choose “Limited pool” and set the pool to 8 NAD⁺.",
          g5:"The fifth glucose is primed with 2 ATP, then stalls at step 6 with no NAD⁺. Letting it in costs you.",
          g8:"Each glucose needs 2 NAD⁺, so the pool runs out after 4.",
          blank:"Type the net ATP in the answer box for challenge 3.",
          e16:"16 is the ATP made; 8 were spent." },
        hints:["How many NAD⁺ does each glucose need?", "2 each: 8 ÷ 2 = 4 glucose can finish.", "4 × net 2 = 8 ATP. A fifth glucose would spend 2 ATP and get stuck: net 6."] }
    ]
  },
  part3:{
    slug:"phosphorylation", name:"Two ways", heading:"Two ways to make ATP",
    intro:"Glycolysis makes its ATP one way; later stages make most of the cell’s ATP another way. Zoom in on each, fill in the comparison table, then check with data how the cell turns glycolysis up and down at phosphofructokinase (PFK).",
    st1:{ title:"Station 1: Zoom to the molecules (substrate-level phosphorylation)",
      how:"Step 7, slowed down. Step through it.",
      steps:["1,3-bisphosphoglycerate (brown, two P tokens) and ADP sit in the active site of phosphoglycerate kinase.", "One phosphate group (the high-energy one) transfers directly to ADP.", "ATP leaves."],
      short:["substrate and ADP in the active site", "a phosphate moves to ADP", "ATP leaves"],
      cap:"Enzyme + substrate + ADP: no membrane, no gradient." },
    st2:{ title:"Station 2: Oxidative phosphorylation (a preview of module 17)",
      how:"Step through it: H⁺ flows back across the membrane through ATP synthase.",
      steps:["H⁺ (magenta) is packed on one side of the membrane: a proton gradient.", "H⁺ flows down its gradient through ATP synthase, and the rotor spins.", "The turning synthase joins ADP + Pᵢ → ATP."],
      short:["the proton gradient", "H⁺ flows, the rotor spins", "ADP + Pᵢ → ATP"],
      cap:"Needs a membrane, a proton gradient, and (in the end) O₂." },
    table:{ title:"Compare the two",
      how:"Tap a chip, then tap the cell where it belongs. Tap a filled cell to empty it. Press Check the table when every cell is full.",
      cols:["Substrate-level", "Oxidative"],
      rows:[
        { id:"r1", t:"Where the phosphate comes from", answer:["a phosphorylated substrate", "free Pᵢ"], fb:"Substrate-level: the phosphate is already on the substrate. Oxidative: ATP synthase joins a free Pᵢ to ADP." },
        { id:"r2", t:"What powers it", answer:["the substrate’s high-energy bond", "an H⁺ gradient"], fb:"Substrate-level: the substrate’s own high-energy bond. Oxidative: H⁺ flowing down its gradient." },
        { id:"r3", t:"Needs a membrane?", answer:["no", "yes (inner membrane)"], fb:"Only oxidative phosphorylation needs a membrane, to hold the H⁺ gradient." },
        { id:"r4", t:"Needs O₂ (directly or indirectly)?", answer:["no", "yes"], fb:"Only oxidative phosphorylation depends on O₂, which keeps the chain running." },
        { id:"r5", t:"Where in respiration", answer:["glycolysis (steps 7, 10); the Krebs cycle (1 per turn)", "electron transport and chemiosmosis"], fb:"Substrate-level: glycolysis and the Krebs cycle. Oxidative: the electron transport chain and chemiosmosis." },
        { id:"r6", t:"ATP per glucose (textbook)", answer:["4", "≈ 32"], fb:"Substrate-level: 4 (net 2 in glycolysis + 2 in the Krebs cycle). Oxidative: about 32." }
      ],
      done:"✓ Table complete. Glycolysis makes its ATP only by substrate-level phosphorylation." },
    st3:{ title:"Station 3: Check it with data (control at PFK)",
      how:"Move the probe along the fructose-6-phosphate axis and read PFK’s activity under three conditions. Tap a condition to see what is bound to PFK.",
      text:"PFK is the “gatekeeper”: step 3 commits the sugar to glycolysis. ATP binds an allosteric site and slows PFK; AMP (a sign of low energy) reverses that.",
      link:'This is feedback inhibition, as in <a href="10-introduction-to-metabolism.html#enzymes">module 10’s enzyme stations</a>: a product of the pathway (ATP) slows an early enzyme.',
      conds:[
        { id:"low", t:"Low ATP", d:"PFK is free: its active site is open." },
        { id:"high", t:"High ATP", d:"ATP sits in PFK’s allosteric site, so the active site is partly shut." },
        { id:"amp", t:"High ATP + high AMP", d:"AMP binds too and reverses ATP’s effect, so the active site reopens." }],
      model:"Model curves (activity as % of the maximum): low ATP levels off at 100%, high ATP at 30%, high ATP + high AMP at 85%." },
    quickCheck:{
      title:"Two ways quick check", summary:"Two ways quick check",
      items:[
        { id:"q1", goal:4, prompt:"How is ATP made at step 10 of glycolysis?",
          choices:[{ t:"substrate-level phosphorylation", ok:true, fb:"PEP hands its phosphate straight to ADP." },
            { t:"oxidative phosphorylation", fb:"PEP hands its phosphate straight to ADP." },
            { t:"photophosphorylation", fb:"PEP hands its phosphate straight to ADP." },
            { t:"by NADH directly", fb:"PEP hands its phosphate straight to ADP." }] },
        { id:"q2", goal:4, prompt:"Which needs an H⁺ gradient across a membrane?",
          choices:[{ t:"oxidative phosphorylation", ok:true, fb:"Substrate-level phosphorylation needs only the enzyme and a phosphorylated substrate." },
            { t:"substrate-level phosphorylation", fb:"Substrate-level phosphorylation needs only the enzyme and a phosphorylated substrate." },
            { t:"both", fb:"Substrate-level phosphorylation needs only the enzyme and a phosphorylated substrate." },
            { t:"neither", fb:"Substrate-level phosphorylation needs only the enzyme and a phosphorylated substrate." }] },
        { id:"q3", goal:5, prompt:"On the graph, PFK activity at 6 mM fructose-6-phosphate is 100% at low ATP and about 30% at high ATP. What does high ATP do?",
          choices:[{ t:"inhibits PFK", ok:true, fb:"Plenty of ATP → slow glycolysis down." },
            { t:"activates PFK", fb:"Plenty of ATP → slow glycolysis down." },
            { t:"has no effect", fb:"Plenty of ATP → slow glycolysis down." },
            { t:"destroys PFK", fb:"Plenty of ATP → slow glycolysis down." }] },
        { id:"q4", goal:5, prompt:"Why is step 3 a good place to control glycolysis?",
          choices:[{ t:"it’s the first step that commits sugar to glycolysis", ok:true, fb:"Controlling an early, committed step avoids piling up intermediates." },
            { t:"it makes the most ATP", fb:"Controlling an early, committed step avoids piling up intermediates." },
            { t:"it uses O₂", fb:"Controlling an early, committed step avoids piling up intermediates." },
            { t:"it’s the last step", fb:"Controlling an early, committed step avoids piling up intermediates." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"custom", title:"Put glycolysis in order", summary:"Put glycolysis in order", goal:[1, 3],
        instruction:"Two sequences. Put each set of steps in the order they happen.",
        sequences:[
          { id:"sA", goal:[1, 3], prompt:"The investment phase.",
            steps:["Glucose enters the cell and is phosphorylated, using 1 ATP.", "The sugar is rearranged from glucose-6-phosphate to fructose-6-phosphate.", "PFK adds a second phosphate, using another ATP.", "The 6-carbon sugar splits into two 3-carbon sugars.", "DHAP is converted, so both pieces are G3P."],
            start:[3, 0, 4, 2, 1],
            wrongIf:[{ before:[3, 2], fb:"The sugar is only split after <em>both</em> phosphates are on: fructose-1,6-<em>bis</em>phosphate." }],
            why:"Phosphorylate, rearrange, phosphorylate again, split, then convert DHAP: two G3P, and 2 ATP spent.",
            hints:["What has to happen to the sugar before it can split?", "Both phosphates go on (steps 1 and 3) before the split.", "Phosphorylate → rearrange → phosphorylate again → split → convert DHAP."] },
          { id:"sB", goal:[1, 3], prompt:"The payoff phase, for one G3P.",
            steps:["G3P is oxidized: NAD⁺ → NADH, and a free Pᵢ is added.", "A phosphate moves to ADP, making the first ATP.", "The remaining phosphate moves to a different carbon.", "Water is removed, forming PEP.", "PEP gives its phosphate to ADP, making pyruvate and a second ATP."],
            start:[2, 4, 0, 3, 1],
            wrongIf:[{ before:[1, 0], fb:"Oxidation comes first; it adds the phosphate that step 7 then gives to ADP." },
              { before:[4, 3], fb:"PEP must form first; then pyruvate kinase acts." }],
            why:"Oxidize, make ATP, shift the phosphate, remove water, make the second ATP: 1 NADH and 2 ATP per G3P.",
            hints:["What does G3P dehydrogenase do?", "It oxidizes G3P first.", "Oxidize → ATP → shift → water out → ATP."] }
        ] },
      { id:"acct", type:"custom", title:"Accounting and control", summary:"Accounting and control", star:true, goal:[2, 5, 6],
        instruction:"Seven items. Type a number (use − for a negative) or tap a chip. Items 4–7 are non-routine (★); 6 and 7 go beyond the Final Check.",
        items:[
          { id:"a1", kind:"num", goal:2, prompt:"Net ATP from glycolysis for 5 glucose?", answer:10, display:"10 ATP", unit:"ATP",
            why:"2 net ATP per glucose × 5 = 10.", wrong:[{ match:20, fb:"That’s the ATP made; 10 were spent." }] },
          { id:"a2", kind:"num", goal:2, prompt:"ATP invested for 5 glucose?", answer:10, display:"10 ATP", unit:"ATP",
            why:"2 ATP invested per glucose × 5 = 10.", wrong:[{ match:5, fb:"2 per glucose." }] },
          { id:"a3", kind:"num", goal:2, prompt:"NAD⁺ needed for 5 glucose?", answer:10, display:"10 NAD⁺", unit:"NAD⁺",
            why:"One NAD⁺ per G3P, two G3P per glucose: 2 × 5 = 10.", wrong:[{ match:5, fb:"One per G3P, two G3P per glucose." }] },
          { id:"a4", kind:"num", goal:6, star:true, prompt:"If step 7 were blocked, what is the net ATP per glucose?", answer:-2, display:"−2 ATP", unit:"ATP",
            why:"2 ATP were spent in steps 1 and 3, and nothing is paid back: net −2.",
            wrong:[{ match:0, fb:"Step 7 never runs, so step 10 is never reached: nothing is paid back." }, { match:2, fb:"Nothing is paid back, so the 2 ATP spent count against you: use a minus sign." }] },
          { id:"a5", kind:"num", goal:2, star:true, prompt:"Glucose units from glycogen enter as glucose-6-phosphate, with no ATP spent on that phosphate. Net ATP per glucose unit?", answer:3, display:"3 ATP", unit:"ATP",
            why:"Only step 3 spends ATP now: 4 − 1 = 3.", wrong:[{ match:2, fb:"Only step 3 spends ATP now: 4 − 1 = 3." }],
            hints:["Which step’s ATP is skipped?", "Step 1.", "Spent 1, made 4: net 3."] },
          { id:"a6", kind:"pair", goal:2, star:true, prompt:"Glycerol (from fat) is converted to DHAP, using 1 ATP and loading 1 NADH (model). From one glycerol to pyruvate, what is the net ATP and the total NADH?",
            labels:["Net ATP", "Total NADH"], units:["ATP", "NADH"], answer:[1, 2], display:"net 1 ATP; 2 NADH",
            why:"−1 ATP, then one G3P’s payoff: +2 ATP and +1 NADH. Net ATP 2 − 1 = 1; NADH 1 + 1 = 2.",
            general:"−1 ATP, then one G3P’s payoff: +2 ATP and +1 NADH. Plus the NADH from making DHAP.",
            hints:["Count the investment: 1 ATP for glycerol → DHAP.", "DHAP → G3P → one pass of steps 6–10: +1 NADH, +2 ATP.", "Net ATP 2 − 1 = 1; NADH 1 + 1 = 2."] },
          { id:"a7", kind:"chips", goal:5, star:true, prompt:"A muscle at rest has high ATP and high citrate. Predict PFK activity and the rate of glycolysis.",
            options:[
              { t:"PFK inhibited; glycolysis slows", ok:true, why:"Both are signals of plenty; both inhibit PFK." },
              { t:"PFK activated; glycolysis speeds up", why:"Both are signals of plenty; both inhibit PFK." },
              { t:"PFK unchanged; glycolysis unchanged", why:"Both are signals of plenty; both inhibit PFK." },
              { t:"PFK inhibited; glycolysis speeds up", why:"PFK controls step 3, so when it slows, the whole pathway slows." }],
            display:"PFK inhibited; glycolysis slows", why:"Both are signals of plenty; both inhibit PFK." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Freya", how:"",
        instruction:"Freya made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the net ATP from glycolysis per glucose.",
            steps:["Glucose is split into two 3-carbon molecules.", "Each 3-carbon molecule makes 2 ATP in the payoff phase.", "So glycolysis makes 4 ATP.", "So the net yield is 4 ATP per glucose."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "4 are made: correct so far.", ""],
            fixes:[
              { t:"Two ATP were spent in the investment phase (steps 1 and 3), so the net is 4 − 2 = 2 ATP.", ok:true, why:M1 },
              { t:"The net is 8 ATP, because there are two molecules.", why:"The 4 already counts both." },
              { t:"The net is 36 ATP.", why:"That’s for all of respiration." },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["Were any ATP spent?", "Steps 1 and 3.", "The fix that says two ATP were spent in the investment phase."] },
          { id:"e2", goal:1, task:"Explain why glycolysis stops in a cell with no O₂ and no fermentation.",
            steps:["Without O₂, the electron transport chain stops.", "Glycolysis uses O₂ at step 6.", "Without O₂, step 6 can’t happen.", "So glycolysis stops at G3P."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2. The mistake is earlier.", "The conclusion is right, but the reason in step 2 is wrong."],
            fixes:[
              { t:"Step 6 needs NAD⁺, not O₂. Without O₂ the chain can’t regenerate NAD⁺ from NADH, so NAD⁺ runs out and glycolysis stalls at step 6.", ok:true, why:M2 },
              { t:"Glycolysis uses O₂ at step 3.", why:M2 },
              { t:"Glycolysis never stops; it doesn’t need anything.", why:"It needs NAD⁺." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["What does step 6 actually need?", "NAD⁺.", "The fix that says step 6 needs NAD⁺, not O₂."] },
          { id:"e3", goal:4, task:"Describe how glycolysis makes ATP.",
            steps:["In the payoff phase, ATP is formed from ADP.", "The phosphate comes from a phosphorylated intermediate, such as PEP.", "ATP synthase in the cytosol joins the phosphate to ADP, powered by an H⁺ gradient.", "This is oxidative phosphorylation."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"An enzyme (a kinase) transfers the phosphate directly from the substrate to ADP: substrate-level phosphorylation. No gradient or ATP synthase is involved.", ok:true, why:M3 },
              { t:"NADH donates the phosphate.", why:"NADH carries electrons, not phosphate." },
              { t:"The phosphate comes from O₂.", why:"O₂ has no phosphate." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Is there a membrane gradient in the cytosol?", "No.", "The fix that says a kinase transfers the phosphate directly from the substrate to ADP."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the stepper: that the cell spends ATP first, or that letting in an extra glucose can lose ATP?" },
      { id:"j2", q:"In your own words, why does step 6 decide whether glycolysis keeps going?" },
      { id:"j3", q:"Explain to a friend the difference between substrate-level and oxidative phosphorylation." },
      { id:"j4", q:"Which part of glycolysis is still fuzzy: the steps, the accounting or the control? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What is the net ATP yield of glycolysis per glucose?", options:[
          { t:"2", ok:true, why:"4 made − 2 spent." },
          { t:"4", why:"That’s the ATP made, before subtracting the investment." },
          { t:"36", why:"That’s for all of respiration (textbook)." },
          { t:"0", why:"The payoff exceeds the investment." }] },
        b:{ prompt:"How many NADH does glycolysis load per glucose?", options:[
          { t:"2", ok:true, why:"One per G3P." },
          { t:"1", why:"There are two G3P per glucose." },
          { t:"4", why:"That’s the ATP made." },
          { t:"10", why:"That’s for all of respiration." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"How many ATP are spent in the investment phase of glycolysis?", options:[
          { t:"2", ok:true, why:"Steps 1 and 3." },
          { t:"4", why:"4 are made in the payoff phase." },
          { t:"1", why:"Two separate steps each spend one." },
          { t:"0", why:"Priming the sugar costs ATP." }] },
        b:{ prompt:"How many ATP are made in the payoff phase per glucose?", options:[
          { t:"4", ok:true, why:"2 per G3P × 2." },
          { t:"2", why:"2 is the <em>net</em>; or the count for one G3P." },
          { t:"36", why:"All of respiration." },
          { t:"8", why:"2 per G3P, not 4." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Glycolysis makes ATP by…", options:[
          { t:"substrate-level phosphorylation", ok:true, why:"An enzyme moves a phosphate from a substrate straight to ADP (steps 7 and 10)." },
          { t:"oxidative phosphorylation", why:M3 },
          { t:"photophosphorylation", why:"That’s in chloroplasts, using light." },
          { t:"the hydrolysis of NADH", why:"NADH isn’t hydrolyzed to make ATP." }] },
        b:{ prompt:"In substrate-level phosphorylation, the phosphate added to ADP comes from…", options:[
          { t:"a phosphorylated substrate, transferred by an enzyme", ok:true, why:"The enzyme moves it straight from the substrate to ADP: no gradient needed." },
          { t:"an H⁺ gradient through ATP synthase", why:M3 },
          { t:"O₂", why:"O₂ has no phosphate." },
          { t:"NADH", why:"NADH carries electrons." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"A toxin blocks G3P dehydrogenase (step 6). Per glucose that enters, what is the net ATP, and what builds up?", options:[
          { t:"Net −2 ATP; G3P (and the steps before it) build up", ok:true, why:"The 2 ATP invested are never paid back." },
          { t:"Net 2 ATP; pyruvate builds up", why:M7 },
          { t:"Net 0 ATP; NADH builds up", why:"Step 6 is where NADH is made, so no NADH forms." },
          { t:"Net 4 ATP; G3P builds up", why:M1 }] },
        b:{ prompt:"A toxin blocks pyruvate kinase (step 10). Per glucose, what is the net ATP, and what builds up?", options:[
          { t:"Net 0 ATP; PEP builds up", ok:true, why:"Step 7 repays the 2 ATP; step 10’s 2 ATP are lost." },
          { t:"Net 2 ATP; pyruvate builds up", why:M7 },
          { t:"Net −2 ATP; G3P builds up", why:"Steps 6 and 7 still run." },
          { t:"Net 4 ATP; PEP builds up", why:M1 }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"A cell has a pool of 10 NAD⁺, no O₂ and no fermentation. How many glucose can fully pass through glycolysis, and what is the total net ATP?", options:[
          { t:"5 glucose; 10 ATP", ok:true, why:"2 NAD⁺ per glucose; 2 net ATP each." },
          { t:"10 glucose; 20 ATP", why:"Each glucose uses 2 NAD⁺, not 1." },
          { t:"5 glucose; 20 ATP", why:"20 is the ATP made; the net is 10." },
          { t:"Unlimited, because glycolysis doesn’t need O₂", why:"It needs NAD⁺." }] },
        b:{ prompt:"A cell has a pool of 14 NAD⁺, no O₂ and no fermentation. How many glucose can fully pass through glycolysis, and what is the total net ATP?", options:[
          { t:"7 glucose; 14 ATP", ok:true, why:"2 NAD⁺ per glucose; 2 net ATP each." },
          { t:"14 glucose; 28 ATP", why:M5 + " Each glucose uses 2 NAD⁺, not 1." },
          { t:"7 glucose; 28 ATP", why:"28 is the ATP made; the net is 14." },
          { t:"Unlimited", why:"It needs NAD⁺." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A molecule enters glycolysis already as G3P, with no ATP spent. From one G3P to pyruvate, how many ATP and NADH form?", options:[
          { t:"2 ATP and 1 NADH", ok:true, why:"One pass of steps 6–10." },
          { t:"4 ATP and 2 NADH", why:"That’s for a whole glucose (two G3P)." },
          { t:"2 ATP and 0 NADH", why:"Step 6 loads an NADH." },
          { t:"0 ATP and 1 NADH", why:"Steps 7 and 10 each make an ATP." }] },
        b:{ prompt:"Glucose units from glycogen enter as glucose-6-phosphate, with no ATP spent on that phosphate. What is the net ATP per glucose unit from glycolysis?", options:[
          { t:"3", ok:true, why:"Only step 3 spends ATP: 4 − 1." },
          { t:"2", why:"Step 1’s ATP is skipped." },
          { t:"4", why:"Step 3 still spends one." },
          { t:"1", why:"4 made, 1 spent." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why the cell spends 2 ATP at the start of glycolysis?", options:[
          { t:"“Adding phosphates traps glucose in the cell and makes it unstable enough to split into two 3-carbon pieces, which then repay the investment.”", ok:true, why:"It says what the phosphates do (trap and prime the sugar) and why the cost is worth it." },
          { t:"“The ATP is needed to supply oxygen.”", why:M2 },
          { t:"“The ATP provides the phosphates that are later given back as 4 ATP.”", why:"Two of the four phosphates come from free Pᵢ at step 6." },
          { t:"“ATP is spent because glycolysis is endergonic overall.”", why:"Overall, glycolysis releases free energy." }] },
        b:{ prompt:"Which is the best description of substrate-level phosphorylation?", options:[
          { t:"“An enzyme transfers a phosphate group directly from a high-energy substrate molecule to ADP.”", ok:true, why:"That’s what happens at steps 7 and 10." },
          { t:"“H⁺ flows through ATP synthase, joining Pᵢ to ADP.”", why:M3 },
          { t:"“Light energy joins Pᵢ to ADP.”", why:"That’s photophosphorylation." },
          { t:"“NADH gives its phosphate to ADP.”", why:"NADH has no phosphate to give." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is the correct net equation for glycolysis?", options:[
          { t:NET_EQ, ok:true, why:"Every input and output per glucose, with the net 2 ATP." },
          { t:"glucose + 6O₂ → 2 pyruvate + 2 ATP", why:"Glycolysis uses no O₂." },
          { t:"glucose → 2 pyruvate + 4 ATP + 2 NADH", why:"Net ATP is 2." },
          { t:"glucose + 2 NADH → 2 pyruvate + 2 NAD⁺ + 2 ATP", why:"NAD⁺ is the input; NADH the output." }] },
        b:{ prompt:"Which statement about glycolysis and O₂ is correct?", options:[
          { t:"“Glycolysis uses no O₂, but it can only continue for long if NAD⁺ is regenerated, by the chain (with O₂) or by fermentation.”", ok:true, why:"Step 6 needs NAD⁺, not O₂." },
          { t:"“Glycolysis needs O₂ at step 6.”", why:M2 },
          { t:"“Glycolysis runs forever without O₂.”", why:"It needs NAD⁺ back." },
          { t:"“Glycolysis happens only when O₂ is absent.”", why:"It runs with or without O₂." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"In a PET scan, patients receive FDG, a radioactive glucose look-alike. Hexokinase phosphorylates it (step 1), but the next enzyme can’t use it, so it’s trapped. Why do many tumours show up brightly?", options:[
          { t:"Tumour cells take up and phosphorylate glucose very fast, so FDG builds up in them", ok:true, why:"Many cancer cells rely heavily on glycolysis." },
          { t:"Tumours have no hexokinase", why:"Without hexokinase, FDG wouldn’t be trapped." },
          { t:"FDG is oxidized by the tumour’s chain", why:"FDG stops at step 1." },
          { t:"Tumours make FDG themselves", why:"FDG is given to the patient." }] },
        b:{ prompt:"During a sprint, AMP rises sharply in muscle cells. What happens to glycolysis?", options:[
          { t:"AMP activates PFK, so glycolysis speeds up", ok:true, why:"AMP signals low energy and reverses ATP’s inhibition." },
          { t:"AMP inhibits PFK, so glycolysis slows", why:M6 + " AMP is the opposite signal: low energy." },
          { t:"Nothing; PFK isn’t regulated", why:"PFK is the main control point." },
          { t:"Glycolysis moves into the mitochondria", why:M2 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A well-fed liver cell at rest has high ATP. What happens at PFK, and why is this useful?", options:[
          { t:"ATP inhibits PFK, slowing glycolysis, so glucose can be stored instead of burned", ok:true, why:"Plenty of ATP is the signal to slow down." },
          { t:"ATP activates PFK, so glycolysis speeds up", why:M6 },
          { t:"ATP denatures PFK permanently", why:"The inhibition is reversible." },
          { t:"Nothing changes until O₂ runs out", why:"ATP itself is the signal." }] },
        b:{ prompt:"Citrate (from the Krebs cycle) builds up when the Krebs cycle is running at full speed. What does citrate do to glycolysis?", options:[
          { t:"It inhibits PFK, slowing glycolysis so pyruvate doesn’t pile up", ok:true, why:"Citrate, like ATP, is a sign of plenty." },
          { t:"It activates PFK", why:M6 },
          { t:"It replaces NAD⁺ at step 6", why:"Citrate isn’t an electron carrier." },
          { t:"It has no effect", why:"Citrate is an allosteric inhibitor of PFK." }] } }
    ]
  },
  task:{
    title:"Sprint budget", summary:"Sprint budget",
    statement:"<p>A sprinting muscle cell processes <i>g</i> glucose per second through glycolysis. Every glucose uses 2 NAD⁺, which must be regenerated, either by the electron transport chain (limited by O₂) or by turning pyruvate into lactate. Design a budget that meets every condition. Can you find all the answers?</p>" +
      '<ol class="gl-conds"><li>NAD⁺ is balanced: the NAD⁺ regenerated each second equals the NAD⁺ used (<i>e</i> + <i>f</i> = 2<i>g</i>).</li><li>Glycolysis makes at least 8 net ATP per second.</li><li>O₂ is limited: the chain can regenerate at most 4 NAD⁺ per second.</li><li>Lactate is limited: at most 6 lactate per second (each regenerates one NAD⁺).</li></ol>',
    inputs:{ g:"<i>g</i>: glucose per second", e:"<i>e</i>: NAD⁺ per second regenerated by the chain", f:"<i>f</i>: NAD⁺ per second regenerated by lactate formation" },
    modelNote:"The O₂ and lactate limits are model values.",
    checks:["NAD⁺ balanced", "At least 8 ATP per second", "O₂ limit", "Lactate limit"],
    tips:["Each glucose uses 2 NAD⁺; regenerate exactly that many.", "Net ATP from glycolysis is 2 per glucose.", "The chain can’t regenerate more than 4 per second here. Let fermentation do the rest.", "Too much lactate: use the chain’s full 4, or process less glucose."],
    explainPrompt:"Explain why the cell must regenerate exactly as much NAD⁺ as glycolysis uses, and what limits a sprint.",
    vocab:"Use the words NAD⁺, NADH, glycolysis, fermentation and electron transport chain.",
    allFound:"You’ve found all four answers. To make 12 ATP per second (6 glucose) you’d need 12 NAD⁺ back each second, but O₂ and lactate limits cap you at 10. That’s one reason a sprint can’t last."
  },
  cards:[
    ["Glycolysis", "Cytosol; no O₂; glucose (6C) → 2 pyruvate (3C)."],
    ["Net yield", "2 ATP, 2 NADH, 2 pyruvate per glucose (4 ATP made − 2 spent)."],
    ["Investment phase", "Steps 1–5: 2 ATP spent (hexokinase, PFK); sugar splits into 2 G3P."],
    ["Payoff phase", "Steps 6–10, twice per glucose: 1 NADH and 2 ATP per G3P."],
    ["Step 6", "G3P + NAD⁺ + Pᵢ → 1,3-bisphosphoglycerate + NADH + H⁺. Needs NAD⁺."],
    ["Substrate-level phosphorylation", "An enzyme moves a phosphate from a substrate straight to ADP (steps 7 and 10)."],
    ["Oxidative phosphorylation", "ATP synthase makes ATP using an H⁺ gradient (the chain)."],
    ["PFK", "Step 3 enzyme; the main control point. Inhibited by ATP and citrate; activated by ADP and AMP."],
    ["Net equation", NET_EQ],
    ["Why it needs NAD⁺ back", "Without NAD⁺, step 6 stops. The chain (with O₂) or fermentation regenerates it."],
    ["Glycogen’s glucose", "Enters as glucose-6-phosphate: net 3 ATP per glucose unit."],
    ["Oldest pathway", "Glycolysis happens in nearly all living things, with or without O₂."]
  ]
};
