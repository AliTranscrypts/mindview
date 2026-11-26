// SBI4U 15 Krebs Cycle. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/15-krebs-cycle.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Each turn makes only 1 ATP. Its main products are 3 NADH and 1 FADH₂, whose electrons power most ATP production later.";
const M2 = "One glucose gives 2 pyruvate, so 2 acetyl-CoA: the cycle turns <strong>twice</strong>.";
const M3 = "Only the 2-carbon acetyl group enters, carried by CoA. Glucose was split in glycolysis; pyruvate was trimmed in pyruvate oxidation.";
const M4 = "Pyruvate oxidation is a separate step: 1 NADH and 1 CO₂ per pyruvate, before the cycle starts.";
const M5 = "No step of the cycle uses O₂. It’s aerobic because NAD⁺ and FAD are regenerated only when the chain passes electrons to O₂.";
const M6 = "Oxaloacetate is remade at the end of every turn, ready to accept the next acetyl group.";
const M7 = "The carbon (and oxygen) in CO₂ comes from the fuel molecules. The O₂ you breathe in ends up in water.";
const DOT2 = '<i class="kc-hd" aria-hidden="true"><b></b><b></b></i>';
const DOT4 = '<i class="kc-hd" aria-hidden="true"><b></b><b></b><b></b><b></b></i>';
const DOT6 = '<i class="kc-hd" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b><b></b></i>';
const DOT1 = '<i class="kc-hd" aria-hidden="true"><b></b></i>';
// Tag the cycle: one item per step (plan Activity 1 table)
const tag = (id, step, cin, c, p, extra) => Object.assign({ id, step, cin, answer:{ c, p } }, extra || {});

export default {
  id:"15-krebs-cycle",
  kind:"topic",
  title:"The Krebs cycle",
  topic:"Krebs Cycle",
  readyTopic:"the Krebs cycle",
  hero:{
    eq:'<span class="kc-heq bio-chem"><span class="kc-hc">acetyl-CoA' + DOT2 + '</span> (2C) + <span class="kc-hc">oxaloacetate' + DOT4 + '</span> (4C) → <span class="kc-hc">citrate' + DOT6 + '</span> (6C) → … → <span class="kc-hc">oxaloacetate' + DOT4 + '</span> (4C) + 2 <span class="kc-hc">CO₂' + DOT1 + '</span>, along with 3 <span class="kc-hn">NADH</span>, 1 <span class="kc-hf">FADH₂</span> and 1 <span class="kc-ha">ATP</span></span>',
    eqLabel:"acetyl-CoA (2C) plus oxaloacetate (4C) gives citrate (6C), then, after several steps, oxaloacetate (4C) plus 2 CO₂, along with 3 NADH, 1 FADH₂ and 1 ATP",
    eqSize:"sm",
    headline:"A wheel that strips a fuel down to CO₂",
    text:"Glycolysis left most of glucose’s energy locked inside two <strong>pyruvate</strong> molecules. In the mitochondrial <strong>matrix</strong>, each pyruvate is trimmed to a 2-carbon <strong>acetyl</strong> group, which is fed into the <strong>Krebs cycle</strong>. Turn by turn, the cycle pulls off carbon as <strong>CO₂</strong> and hands high-energy electrons to <strong>NAD⁺</strong> and <strong>FAD</strong>. At the end of each turn, <strong>oxaloacetate</strong> is back where it started.",
    fig:{ html:'<div class="kc-hero" id="kc-hero" role="img" aria-label="A pyruvate with three brown carbon dots drifts into the matrix of a mitochondrion. One carbon breaks off as CO₂ and an empty NAD⁺ fills to NADH; the other two carbons ride in on CoA. They join a 4-carbon oxaloacetate to make 6-carbon citrate. The wheel turns: two carbons peel off as CO₂, three NADH and one FADH₂ fill, and one ATP pops out. The wheel is back to 4-carbon oxaloacetate. A counter reads Turn 1 of 2 for one glucose."></div>' }
  },
  goals:[
    "I can describe pyruvate oxidation: where it happens, and what goes in and comes out.",
    "I can describe the Krebs cycle: acetyl-CoA joining oxaloacetate, the carbon changes 6C → 5C → 4C, and oxaloacetate regenerated.",
    "I can count the products per turn and per glucose (NADH, FADH₂, ATP, CO₂).",
    "I can track all six carbons of glucose to CO₂.",
    "I can predict what happens when a step is blocked or NAD⁺ runs out, and explain why the cycle depends on O₂.",
    "I can apply the cycle to real situations: vitamins, other fuels, and experimental data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Glycolysis products", goal:1,
          prompt:"What does glycolysis produce from one glucose (net)?",
          options:[
            { t:"2 pyruvate, 2 ATP, 2 NADH", ok:true, why:"4 ATP are made, but 2 were invested, so the net is 2." },
            { t:"2 pyruvate, 4 ATP, 2 NADH", why:"2 ATP were spent in the investment phase." },
            { t:"1 pyruvate, 2 ATP, 1 NADH", why:"6C → 2 × 3C." },
            { t:"6 CO₂, 2 ATP, 2 NADH", why:"No CO₂ is released in glycolysis." }],
          hints:["How many carbons in glucose, and in pyruvate?", "6C splits into two 3C molecules.", "2 pyruvate, net 2 ATP, 2 NADH."] },
        { id:"w2", skill:"Glycolysis products", goal:4,
          prompt:"How many carbon atoms are in one pyruvate molecule?",
          options:[
            { t:"3", ok:true, why:"Glucose’s 6 carbons split evenly into two pyruvates." },
            { t:"6", why:"That’s glucose." },
            { t:"2", why:"Acetyl has 2; pyruvate has 3." },
            { t:"4", why:"Oxaloacetate has 4." }],
          hints:["Glucose is C₆H₁₂O₆.", "It splits into 2 equal pieces.", "6 ÷ 2 = 3."] },
        { id:"w3", skill:"Carriers and oxidation", goal:3,
          prompt:"When NAD⁺ becomes NADH, what has happened?",
          options:[
            { t:"NAD⁺ was reduced: it gained 2 electrons and a hydrogen ion from a substrate", ok:true, why:"The substrate that lost them was oxidized." },
            { t:"NAD⁺ was oxidized", why:"Gaining electrons is reduction (RIG)." },
            { t:"NAD⁺ released energy as ATP", why:"NADH carries electrons; it isn’t ATP." },
            { t:"NAD⁺ combined with O₂", why:"O₂ isn’t involved here." }],
          hints:["OIL RIG.", "NADH carries more electrons than NAD⁺.", "Gained electrons, so reduced."] },
        { id:"w4", skill:"Carriers and oxidation", goal:5,
          prompt:"A cell’s supply of NAD⁺ runs out. What happens to steps that need NAD⁺?",
          options:[
            { t:"They stop, because there is nothing to accept the electrons", ok:true, why:"A dehydrogenase needs an empty carrier." },
            { t:"They speed up", why:"Without the acceptor, the reaction can’t happen." },
            { t:"They use O₂ instead", why:"Those enzymes can’t hand electrons to O₂." },
            { t:"They continue but make FADH₂ only", why:"Each enzyme uses its own carrier." }],
          hints:["What does NAD⁺ do in these reactions?", "It accepts electrons.", "No acceptor, no reaction."] },
        { id:"w5", skill:"Cell locations", goal:1,
          prompt:"Where does glycolysis happen?",
          options:[
            { t:"Cytosol", ok:true, why:"Glycolysis needs no organelle; even bacteria do it." },
            { t:"Mitochondrial matrix", why:"Glycolysis is outside the mitochondrion." },
            { t:"Inner mitochondrial membrane", why:"That’s the electron transport chain." },
            { t:"Nucleus", why:"The nucleus holds DNA, not glycolysis." }],
          hints:["Do bacteria (no mitochondria) do glycolysis?", "Yes.", "Cytosol."] },
        { id:"w6", skill:"Cell locations", goal:2,
          prompt:"Which part of the mitochondrion is the fluid inside the inner membrane?",
          options:[
            { t:"The matrix", ok:true, why:"The Krebs cycle runs there." },
            { t:"The intermembrane space", why:"That’s between the two membranes." },
            { t:"The cristae", why:"Cristae are the folds of the inner membrane itself." },
            { t:"The stroma", why:"Stroma is the fluid in a chloroplast." }],
          hints:["Inner membrane → inside it.", "Not between membranes.", "Matrix."] }
      ],
      refreshers:{
        "Glycolysis products":"One glucose (6C) → 2 pyruvate (3C each), net 2 ATP and 2 NADH, in the cytosol. No CO₂ yet.",
        "Carriers and oxidation":"Oxidation is loss of electrons (often as H atoms); reduction is gain. NAD⁺ + 2H → NADH + H⁺ means NAD⁺ is reduced and the fuel is oxidized.",
        "Cell locations":"Cytosol: glycolysis. Matrix: pyruvate oxidation and the Krebs cycle. Inner membrane: electron transport chain and ATP synthase."
      }
    }
  },
  explore:{
    heading:"Carbon wheel",
    intro:"Feed fuel into the matrix and turn the wheel step by step. Watch the carbons leave as CO₂ and the carriers fill up.",
    // The wheel (plan: "The eight cycle steps as shown" + pyruvate oxidation as step 0). Molecules: name, carbons.
    mols:[
      { id:"cit", t:"citrate", c:6 }, { id:"iso", t:"isocitrate", c:6 }, { id:"akg", t:"α-ketoglutarate", c:5 }, { id:"suc", t:"succinyl-CoA", c:4 },
      { id:"sca", t:"succinate", c:4 }, { id:"fum", t:"fumarate", c:4 }, { id:"mal", t:"malate", c:4 }, { id:"oaa", t:"oxaloacetate", c:4 }
    ],
    steps:[
      { n:0, eq:"pyruvate (3C) + CoA → acetyl-CoA (2C) + CO₂, with NAD⁺ → NADH", from:"pyruvate", to:"acetyl-CoA", enz:"pyruvate dehydrogenase complex", co2:1, nadh:1 },
      { n:1, eq:"acetyl-CoA (2C) + oxaloacetate (4C) → citrate (6C); CoA is released", from:"oxaloacetate", to:"citrate", enz:"citrate synthase" },
      { n:2, eq:"citrate (6C) → isocitrate (6C): a rearrangement", from:"citrate", to:"isocitrate", enz:"aconitase" },
      { n:3, eq:"isocitrate (6C) → α-ketoglutarate (5C) + CO₂, with NAD⁺ → NADH", from:"isocitrate", to:"α-ketoglutarate", enz:"isocitrate dehydrogenase", co2:1, nadh:1 },
      { n:4, eq:"α-ketoglutarate (5C) → succinyl-CoA (4C) + CO₂, with NAD⁺ → NADH", from:"α-ketoglutarate", to:"succinyl-CoA", enz:"α-ketoglutarate dehydrogenase", co2:1, nadh:1 },
      { n:5, eq:"succinyl-CoA (4C) → succinate (4C), with GDP + Pᵢ → GTP → ATP (substrate-level phosphorylation)", from:"succinyl-CoA", to:"succinate", enz:"succinyl-CoA synthetase", atp:1 },
      { n:6, eq:"succinate (4C) → fumarate (4C), with FAD → FADH₂", from:"succinate", to:"fumarate", enz:"succinate dehydrogenase (sits in the inner membrane)", fadh:1 },
      { n:7, eq:"fumarate (4C) + H₂O → malate (4C)", from:"fumarate", to:"malate", enz:"fumarase" },
      { n:8, eq:"malate (4C) → oxaloacetate (4C), with NAD⁺ → NADH", from:"malate", to:"oxaloacetate", enz:"malate dehydrogenase", nadh:1 }
    ],
    // Block menu (plan): step number each enzyme catalyzes
    blocks:[
      { id:"none", t:"none" }, { id:"3", t:"isocitrate dehydrogenase" }, { id:"4", t:"α-ketoglutarate dehydrogenase" },
      { id:"6", t:"succinate dehydrogenase" }, { id:"7", t:"fumarase" }, { id:"8", t:"malate dehydrogenase" }
    ],
    oaaNote:"The model matrix holds 3 oxaloacetate, so up to 3 acetyl groups can be in the wheel at once. FAD is always available.",
    acetylNote:"from fats: see module 20",
    predIntro:"Make a prediction first. Then the carbon wheel will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: “+ 1 glucose” (2 pyruvate waiting). After pyruvate oxidation of both pyruvates (before the cycle), how many CO₂ have been released?",
        options:[{ t:"2", ok:true }, { t:"0" }, { t:"6" }, { t:"4" }],
        explain:"Each 3C pyruvate loses 1 carbon as CO₂ to become 2C acetyl. 2 pyruvate → 2 CO₂." },
      { id:"p2", prompt:"Start: one turn from 1 acetyl-CoA. Which does one turn make most of?",
        options:[{ t:"NADH", ok:true }, { t:"ATP" }, { t:"FADH₂" }, { t:"CO₂" }],
        explain:"The cycle is mainly a carrier-loading machine: 3 NADH and 1 FADH₂ per turn, but only 1 ATP." },
      { id:"p3", prompt:"Start: NAD⁺ supply mode with a supply of 0, then “+ 1 acetyl-CoA”. Where does the wheel stop?",
        options:[{ t:"At step 3 (isocitrate → α-ketoglutarate), the first step that needs NAD⁺", ok:true }, { t:"It keeps turning and makes FADH₂ only" }, { t:"It switches to using O₂" }, { t:"It never starts, because step 1 needs NAD⁺" }],
        explain:"Steps 1 and 2 need no carrier. Step 3 needs an empty NAD⁺. With none, the wheel jams, even though no step uses O₂ directly." },
      { id:"p4", prompt:"Start: Block a step mode, with succinate dehydrogenase blocked; run 3 acetyl-CoA. Which intermediate’s bar grows?",
        options:[{ t:"Succinate", ok:true }, { t:"Fumarate" }, { t:"Oxaloacetate" }, { t:"Citrate" }],
        explain:"The blocked enzyme can’t use its substrate, so the substrate piles up and everything after it runs out, including the oxaloacetate the next turn needs." }
    ],
    challenges:[
      { id:"tc1", goal:3, prompt:"Start with “+ 1 glucose”. Run exactly enough to fully oxidize it, then press Check.",
        why:"2 pyruvate oxidations and 2 turns: 6 CO₂, 8 NADH, 2 FADH₂ and 2 ATP. All six carbons of the glucose have left as CO₂.",
        general:"Press Reset, then “+ 1 glucose”, and step until both turns are done.",
        hints:["How many acetyl-CoA come from one glucose?", "2 pyruvate → 2 acetyl-CoA → 2 turns.", "Step until the status reads “Waiting for acetyl-CoA” with 2 turns done."] },
      { id:"tc2", goal:3, prompt:"Using only “+ 1 pyruvate” and “+ 1 acetyl-CoA”, make the ledger read exactly <strong>11 NADH and 3 FADH₂</strong> after everything has run.",
        why:"2 pyruvate give 2 × 4 = 8 NADH and 1 acetyl-CoA gives 3: 11 NADH. Three fuels, three turns: 3 FADH₂.",
        general:"Press Reset, add your fuel with “+ 1 pyruvate” and “+ 1 acetyl-CoA”, then run everything.",
        hints:["Each fuel gives 1 turn, so 1 FADH₂. How many fuels in total?", "3 fuels. Pyruvate gives 4 NADH (1 + 3); acetyl-CoA gives 3.", "4<i>p</i> + 3(3 − <i>p</i>) = 11, so <i>p</i> = 2: 2 pyruvate and 1 acetyl-CoA."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Feed in 1 acetyl-CoA. Choose a block, <strong>or</strong> an NAD⁺ supply, so that the ledger ends at exactly <strong>1 NADH and 1 CO₂</strong>, and the wheel stalls.",
        why:"Step 3 made the first NADH and released the first CO₂. With step 4 stopped (no enzyme, or no empty NAD⁺), the wheel jams there.",
        general:"Feed in 1 acetyl-CoA, choose a block or an NAD⁺ supply, and step until the wheel stalls.",
        hints:["Which steps release CO₂, and which make NADH? List them in order.", "Step 3 makes the first NADH and the first CO₂. Step 4 makes the second of each.", "Stop the wheel at step 4: block α-ketoglutarate dehydrogenase, or allow only 1 NAD⁺, so step 4 has no carrier."] }
    ]
  },
  part3:{
    slug:"carbons", name:"Carbons", heading:"Where did the glucose go?",
    intro:"The wheel shows one turn at a time. Here you zoom out to the whole glucose molecule: track every carbon, add up every product across three stages, then check the model against real experimental data.",
    s1:{
      title:"Station 1: The ¹⁴C tracker",
      text:"A glucose molecule’s six carbons are each tagged with a ¹⁴C marker (a ring around each brown dot). Press the buttons in order to move the markers forward.",
      stages:[
        { id:"start", t:"Glucose", org:6, co2:0, cap:"One glucose: all six labelled carbons are in one organic molecule." },
        { id:"gly", t:"Glycolysis", org:6, co2:0, cap:"Glycolysis splits glucose into 2 pyruvate (3C each). No carbon leaves yet." },
        { id:"po", t:"Pyruvate oxidation", org:4, co2:2, cap:"Each pyruvate loses one labelled carbon as CO₂. Two acetyl groups (2C each) carry the other four into the cycle." },
        { id:"t1", t:"Turn 1", org:4, co2:2, cap:"Turn 1 releases 2 CO₂, but they come from carbons that were already in the cycle. The labelled carbons are now part of the cycle’s intermediates." },
        { id:"t2", t:"Turn 2", org:2, co2:4, avg:true, cap:"Turn 2 releases 2 more CO₂. On average, two more labelled carbons have now left." },
        { id:"more", t:"More turns", org:0, co2:6, cap:"After more turns, every labelled carbon has left as CO₂." }
      ],
      barOrg:"Labelled carbons still in organic molecules", barCo2:"Labelled carbons released as CO₂",
      zoomTitle:"Zoom to the molecules",
      zoom:"The two CO₂ released in one turn come from carbons that were already in the cycle (from oxaloacetate’s earlier load), not the exact acetyl carbons that just joined. Over several turns every carbon leaves, so the totals match.",
      ask:"How many CO₂ per glucose?", answer:6,
      askGood:"6 CO₂ per glucose: 2 from pyruvate oxidation and 4 from the cycle’s two turns.",
      askWrong:[{ match:4, fb:"That’s the Krebs cycle alone. Add pyruvate oxidation’s 2." }, { match:2, fb:"That’s pyruvate oxidation alone. Add the cycle’s 4." }, { match:3, fb:"That’s one pyruvate. One glucose gives two." }],
      askGeneral:"Count every labelled carbon: each one leaves as one CO₂."
    },
    s2:{
      title:"Station 2: Build the totals table",
      text:"Drag a number chip onto a cell, or tap a chip and then tap the cell. Each cell checks itself when the number lands.",
      chips:[0, 1, 2, 3, 4, 6, 8, 10],
      cols:["ATP", "NADH", "FADH₂", "CO₂"],
      rows:[
        { id:"gly", stage:"Glycolysis", where:"Cytosol", answer:[2, 2, 0, 0], net:true },
        { id:"po", stage:"Pyruvate oxidation (×2)", where:"Matrix", answer:[0, 2, 0, 2] },
        { id:"kr", stage:"Krebs cycle (×2 turns)", where:"Matrix", answer:[2, 6, 2, 4], perTurn:[1, 3, 1, 2] },
        { id:"tot", stage:"<strong>Total per glucose</strong>", where:"", answer:[4, 10, 2, 6], total:true }
      ],
      fbTurn:"That’s one turn. One glucose turns the cycle twice.",
      fbPoNadh:"Each pyruvate makes 1 NADH as it’s trimmed.",
      fbTotal:"Add the three rows above.",
      fbGeneral:"Count this stage for one whole glucose.",
      done:"Table complete: 4 ATP, 10 NADH, 2 FADH₂ and 6 CO₂ per glucose, before the electron transport chain."
    },
    s3:{
      title:"Station 3: Isolated mitochondria (investigation)",
      text:"Mitochondria were separated from the rest of the cell and given different fuels. The flasks were then checked for CO₂.",
      dataTitle:"Check it with data",
      head:["Flask", "Mitochondria given", "O₂ present?", "CO₂ released (relative units)"],
      rows:[["1", "Glucose", "Yes", "0"], ["2", "Pyruvate", "Yes", "30"], ["3", "Pyruvate", "No", "2 (then stops)"], ["4", "Nothing (control)", "Yes", "0"]],
      caption:"Results of a model experiment.",
      prompts:[
        { id:"f1", q:"Why does flask 1 release no CO₂?", choices:[
          { t:"Mitochondria can’t use glucose. Glycolysis happens in the cytosol, which was removed.", ok:true, fb:"The cycle takes acetyl-CoA, which comes from pyruvate, which comes from glycolysis in the cytosol." },
          { t:"Glucose enters the cycle too slowly to measure.", fb:M3 },
          { t:"The O₂ was used up making CO₂.", fb:M7 },
          { t:"The mitochondria were damaged.", fb:"Flask 2 shows the same mitochondria work when given pyruvate." }] },
        { id:"f2", q:"Why does flask 3 release a little CO₂ and then stop?", choices:[
          { t:"The cycle runs until the NAD⁺ is used up; without O₂ the chain can’t regenerate it.", ok:true, fb:M5 },
          { t:"The CO₂ is made from O₂, so it stops when O₂ is missing.", fb:M7 },
          { t:"The pyruvate runs out after a few seconds.", fb:"Flask 2 had the same pyruvate and released 30 units." },
          { t:"The cycle needs O₂ at step 1.", fb:M5 }] },
        { id:"f3", q:"What is flask 4 for?", choices:[
          { t:"A control: it shows the CO₂ comes from the fuel, not the mitochondria alone.", ok:true, fb:"With no fuel, no CO₂: so the CO₂ in flask 2 came from the pyruvate." },
          { t:"It tests whether O₂ is needed.", fb:"Flasks 2 and 3 compare O₂; flask 4 has no fuel." },
          { t:"It shows mitochondria make CO₂ on their own.", fb:"Flask 4 released 0: without fuel, no CO₂." },
          { t:"It’s a spare flask with no purpose.", fb:"Every flask tests something. Compare flask 4 with flask 2." }] }
      ]
    },
    quickCheck:{
      title:"Quick check", summary:"Where did the glucose go? quick check",
      items:[
        { id:"q1", goal:4, prompt:"How many CO₂ does one glucose release in pyruvate oxidation and the Krebs cycle together?",
          choices:[{ t:"6", ok:true, fb:"2 from pyruvate oxidation + 4 from two turns." }, { t:"4", fb:"2 from pyruvate oxidation + 4 from two turns." },
            { t:"2", fb:"2 from pyruvate oxidation + 4 from two turns." }, { t:"3", fb:"2 from pyruvate oxidation + 4 from two turns." }] },
        { id:"q2", goal:4, prompt:"Where are all of glucose’s carbons at the end of the Krebs cycle?",
          choices:[{ t:"In CO₂", ok:true, fb:"Every carbon has left as CO₂. Carriers hold electrons, not carbon, and oxaloacetate is the cycle’s own molecule." },
            { t:"In NADH", fb:"Carriers hold electrons, not carbon. Oxaloacetate is regenerated: it’s the cycle’s own molecule." },
            { t:"In ATP", fb:"Carriers hold electrons, not carbon. Oxaloacetate is regenerated: it’s the cycle’s own molecule." },
            { t:"In oxaloacetate", fb:"Carriers hold electrons, not carbon. Oxaloacetate is regenerated: it’s the cycle’s own molecule." }] },
        { id:"q3", goal:[1, 6], prompt:"Isolated mitochondria are given glucose and O₂. What happens?",
          choices:[{ t:"No CO₂: glycolysis is missing", ok:true, fb:"The cycle takes acetyl-CoA, which comes from pyruvate, which comes from glycolysis in the cytosol." },
            { t:"CO₂ is released fast", fb:"The cycle takes acetyl-CoA, which comes from pyruvate, which comes from glycolysis in the cytosol." },
            { t:"Glucose enters the cycle", fb:"The cycle takes acetyl-CoA, which comes from pyruvate, which comes from glycolysis in the cytosol." },
            { t:"Lactate forms", fb:"The cycle takes acetyl-CoA, which comes from pyruvate, which comes from glycolysis in the cytosol." }] },
        { id:"q4", goal:3, prompt:"Total NADH per glucose from all three stages?",
          choices:[{ t:"10", ok:true, fb:"2 (glycolysis) + 2 (pyruvate oxidation) + 6 (two turns)." }, { t:"8", fb:"2 (glycolysis) + 2 (pyruvate oxidation) + 6 (two turns)." },
            { t:"6", fb:"2 (glycolysis) + 2 (pyruvate oxidation) + 6 (two turns)." }, { t:"3", fb:"2 (glycolysis) + 2 (pyruvate oxidation) + 6 (two turns)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tag", type:"custom", title:"Tag the cycle", summary:"Tag the cycle", goal:[2, 3],
        instruction:"For each step, tap every product it releases.",
        products:[{ id:"co2", t:"CO₂" }, { id:"nadh", t:"NADH" }, { id:"fadh", t:"FADH₂" }, { id:"atp", t:"ATP" }, { id:"none", t:"nothing extra" }],
        offByOne:"Count CO₂ released: each CO₂ removes one carbon.",
        items:[
          tag("a1", "Pyruvate → acetyl-CoA", "3", 2, ["co2", "nadh"], { goal:[1, 3], why:"3 → 2: one carbon leaves as CO₂, and NAD⁺ is loaded to NADH.",
            hints:["Compare carbon counts before and after.", "3 → 2: one carbon left.", "CO₂ and NADH."] }),
          tag("a2", "Acetyl-CoA + oxaloacetate → citrate", "2 + 4", 6, ["none"], { goal:2, why:"2 + 4 = 6: carbons are joined, and no carrier is loaded.",
            wrong:{ co2:"Carbons are added here, not removed: 2 + 4 = 6." },
            hints:["Compare carbon counts before and after.", "2 + 4 → 6: carbons are joined, none leave.", "Nothing extra."] }),
          tag("a3", "Citrate → isocitrate", "6", 6, ["none"], { goal:2, why:"6 → 6: a rearrangement, with nothing released.",
            hints:["Compare carbon counts before and after.", "6 → 6: no carbon leaves.", "Nothing extra: it’s a rearrangement."] }),
          tag("a4", "Isocitrate → α-ketoglutarate", "6", 5, ["co2", "nadh"], { goal:[2, 3], why:"6 → 5: one carbon leaves as CO₂, and NAD⁺ is loaded to NADH.",
            hints:["Compare carbon counts before and after.", "6 → 5: one carbon left.", "CO₂ and NADH."] }),
          tag("a5", "α-ketoglutarate → succinyl-CoA", "5", 4, ["co2", "nadh"], { goal:[2, 3], why:"5 → 4: one carbon leaves as CO₂, and NAD⁺ is loaded to NADH.",
            hints:["Compare carbon counts before and after.", "5 → 4: one carbon left.", "CO₂ and NADH."] }),
          tag("a6", "Succinyl-CoA → succinate", "4", 4, ["atp"], { goal:3, why:"4 → 4: GDP + Pᵢ → GTP, which becomes ATP (substrate-level phosphorylation).",
            hints:["Compare carbon counts before and after.", "4 → 4: no carbon leaves; energy is captured directly.", "ATP (via GTP)."] }),
          tag("a7", "Succinate → fumarate", "4", 4, ["fadh"], { goal:3, why:"4 → 4: succinate dehydrogenase loads FAD to FADH₂.",
            wrong:{ nadh:"This dehydrogenase uses FAD: the carbon–carbon bond being oxidized gives too little energy to load NAD⁺." },
            hints:["Compare carbon counts before and after.", "4 → 4: no carbon leaves; this dehydrogenase uses a different carrier.", "FADH₂."] }),
          tag("a8", "Malate → oxaloacetate", "4", 4, ["nadh"], { goal:[2, 3], why:"4 → 4: malate is oxidized and NAD⁺ is loaded to NADH. Oxaloacetate is back.",
            wrong:{ co2:"4C → 4C: no carbon is lost." },
            hints:["Compare carbon counts before and after.", "4 → 4: no carbon leaves.", "NADH."] })
        ] },
      { id:"ledger", type:"custom", title:"Ledger puzzles", summary:"Ledger puzzles", star:true, goal:[3, 4, 6],
        instruction:"Six counting puzzles. Puzzles 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        items:[
          { id:"l1", goal:[3, 4], prompt:"Two glucose are fully oxidized. How many CO₂ come from pyruvate oxidation and the Krebs cycle together?",
            boxes:[{ label:"CO₂", unit:"CO₂" }], answer:[12], display:"12 CO₂",
            why:"6 CO₂ per glucose × 2 = 12.",
            wrong:[{ match:[8], fb:"Add 4 from pyruvate oxidation." }, { match:[6], fb:"That’s one glucose." }],
            general:"Count pyruvate oxidation and both turns for each glucose.",
            hints:["How many CO₂ does one glucose give?", "2 from pyruvate oxidation + 4 from two turns = 6.", "6 × 2 = 12."] },
          { id:"l2", goal:3, prompt:"Three glucose: how many NADH from the Krebs cycle alone?",
            boxes:[{ label:"NADH", unit:"NADH" }], answer:[18], display:"18 NADH",
            why:"Two turns per glucose: 6 NADH each. 3 × 6 = 18.",
            wrong:[{ match:[9], fb:"Two turns per glucose: 6 NADH each." }, { match:[24], fb:"Krebs only: leave out pyruvate oxidation." }],
            general:"Krebs cycle only: count the turns first.",
            hints:["How many turns does one glucose give?", "2 turns × 3 NADH = 6 NADH per glucose.", "3 × 6 = 18."] },
          { id:"l3", goal:3, star:true, prompt:"A cell has 6 pyruvate. How many turns of the cycle, and how many FADH₂?",
            boxes:[{ label:"Turns", unit:"turns" }, { label:"FADH₂", unit:"FADH₂" }], answer:[6, 6], display:"6 turns; 6 FADH₂",
            why:"1 pyruvate → 1 acetyl-CoA → 1 turn, and each turn makes 1 FADH₂.",
            wrong:[{ match:[3], box:0, fb:"1 pyruvate → 1 acetyl-CoA → 1 turn." }],
            general:"1 pyruvate → 1 acetyl-CoA → 1 turn.",
            hints:["How many acetyl-CoA come from one pyruvate?", "1 pyruvate → 1 acetyl-CoA → 1 turn; 1 FADH₂ per turn.", "6 turns and 6 FADH₂."] },
          { id:"l4", goal:[4, 6], star:true, prompt:"(Investigation) Isolated mitochondria are given 4 pyruvate and plenty of O₂. How many CO₂ will they release?",
            boxes:[{ label:"CO₂", unit:"CO₂" }], answer:[12], display:"12 CO₂",
            why:"Every carbon of every pyruvate leaves as CO₂: 4 × 3 = 12.",
            wrong:[{ match:[8], fb:"Each pyruvate also loses 1 carbon in pyruvate oxidation: 4 × 3 = 12." }],
            general:"Each pyruvate has 3 carbons, and all of them leave as CO₂.",
            hints:["Each pyruvate has 3 carbons.", "All of them leave as CO₂: 1 in pyruvate oxidation, 2 in the cycle.", "4 × 3 = 12."] },
          { id:"l5", goal:[3, 6], star:true, prompt:"Per glucose, how many electron carriers (NADH + FADH₂) are loaded in all three stages? Compare this with the ATP made directly.",
            boxes:[{ label:"Carriers", unit:"carriers" }, { label:"ATP made directly", unit:"ATP" }], answer:[12, 4], display:"12 carriers; 4 ATP",
            why:"10 NADH + 2 FADH₂ = 12 loaded carriers, against only 4 ATP made directly. Most of the energy is in the carriers.",
            wrong:[{ match:[4], box:0, fb:"Count NADH and FADH₂, not ATP: 10 + 2." }],
            general:"Add the NADH and FADH₂ from glycolysis, pyruvate oxidation and the cycle.",
            hints:["List the NADH and FADH₂ from each stage.", "NADH: 2 + 2 + 6 = 10. FADH₂: 2. ATP: 2 + 2.", "12 carriers; 4 ATP."] },
          { id:"l6", goal:6, star:true, prompt:"A cell oxidizes 2 glucose plus some acetyl-CoA from fat. Pyruvate oxidation and the cycle release 20 CO₂ in total. How many acetyl-CoA came from fat?",
            boxes:[{ label:"Acetyl-CoA from fat", unit:"acetyl-CoA" }], answer:[4], display:"4 acetyl-CoA",
            why:"2 glucose give 12 CO₂; the other 8 CO₂ come from fat at 2 per turn: 4 acetyl-CoA.",
            wrong:[{ match:[8], fb:"2 glucose already give 12 CO₂; 8 more ÷ 2 per turn = 4." }],
            general:"Find the glucose’s share of the CO₂ first.",
            hints:["Find the glucose’s share first.", "2 glucose → 12 CO₂. 20 − 12 = 8 CO₂ from fat.", "Each acetyl-CoA turn releases 2 CO₂: 4 acetyl-CoA."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Hugo", how:"",
        instruction:"Hugo made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Count the products of pyruvate oxidation and the Krebs cycle for one glucose.",
            steps:["Glycolysis makes 2 pyruvate from one glucose.", "Each pyruvate is oxidized to acetyl-CoA, releasing 1 CO₂ and making 1 NADH.", "So the Krebs cycle turns once for this glucose.", "One turn makes 3 NADH, 1 FADH₂, 1 ATP and 2 CO₂.", "Total CO₂: 2 + 2 = 4."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is true per turn, but the mistake is earlier.", "Step 5 follows from step 3. Look earlier."],
            fixes:[
              { t:"There are 2 acetyl-CoA, so the cycle turns twice: 6 NADH, 2 FADH₂, 2 ATP and 4 CO₂, which makes 6 CO₂ with pyruvate oxidation.", ok:true, why:M2 },
              { t:"The cycle turns 6 times, once for each carbon of glucose.", why:"Each turn takes one 2C acetyl group." },
              { t:"Glycolysis makes only 1 pyruvate.", why:"6C splits into two 3C pyruvates." },
              { t:"Step 3 is correct.", why:"Two pyruvates mean two acetyl-CoA." }],
            hints:["How many acetyl-CoA are there?", "Two.", "Two turns."] },
          { id:"e2", goal:5, task:"Explain where the CO₂ from the Krebs cycle comes from.",
            steps:["Citrate (6C) forms from acetyl (2C) and oxaloacetate (4C).", "Two carbons are removed as CO₂ before oxaloacetate is remade.", "These CO₂ molecules form when O₂ combines with the carbon in the matrix.", "So the Krebs cycle uses O₂ directly."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"The CO₂ is cut off the carbon skeleton itself; its oxygen atoms come from the organic molecules (and water), not from O₂. O₂ is used only at the end of the electron transport chain.", ok:true, why:M7 },
              { t:"The CO₂ comes from NADH.", why:"NADH carries electrons, not carbon." },
              { t:"The CO₂ was breathed in and is passing through.", why:"Breathed-in O₂ ends up in water." },
              { t:"Step 3 is correct.", why:"No step of the cycle uses O₂." }],
            hints:["Which steps release CO₂?", "Steps 3 and 4: the carbon is removed by an enzyme.", "No O₂ is involved."] },
          { id:"e3", goal:2, task:"Describe what happens at the end of one turn.",
            steps:["Acetyl-CoA joins oxaloacetate to make citrate.", "Citrate goes through rearrangements and oxidations, losing 2 carbons.", "Malate is oxidized, making NADH.", "Oxaloacetate is released as a waste product along with CO₂.", "So each turn needs a new oxaloacetate from glycolysis."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows from step 4."],
            fixes:[
              { t:"Oxaloacetate is regenerated and stays in the matrix to accept the next acetyl group, so the pathway is a cycle.", ok:true, why:M6 },
              { t:"Citrate is released as waste.", why:"Citrate is the first intermediate." },
              { t:"Oxaloacetate turns into pyruvate.", why:"It accepts acetyl again." },
              { t:"Step 4 is correct.", why:"If oxaloacetate were waste, it wouldn’t be a cycle." }],
            hints:["Why is it called a cycle?", "Something is remade.", "Oxaloacetate."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the carbon wheel: how little ATP the cycle makes, or that it jams without NAD⁺?" },
      { id:"j2", q:"In your own words, why does the Krebs cycle count as aerobic even though no step uses O₂?" },
      { id:"j3", q:"Explain to a friend how to count the CO₂ and NADH from one glucose without forgetting pyruvate oxidation." },
      { id:"j4", q:"Which part of the cycle is still fuzzy for you: the names, the counts or the carbons? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In a eukaryotic cell, where does pyruvate oxidation happen?", options:[
          { t:"The mitochondrial matrix", ok:true, why:"Pyruvate is carried in from the cytosol." },
          { t:"The cytosol", why:"Pyruvate is carried into the mitochondrion first." },
          { t:"The intermembrane space", why:"That’s where H⁺ builds up, between the two membranes." },
          { t:"The stroma", why:"Stroma is in chloroplasts." }] },
        b:{ prompt:"In a eukaryotic cell, where does the Krebs cycle happen?", options:[
          { t:"The mitochondrial matrix", ok:true, why:"The cycle runs in the fluid inside the inner membrane." },
          { t:"The cytosol", why:"That’s where glycolysis happens." },
          { t:"The intermembrane space", why:"That’s the H⁺ reservoir, not the cycle." },
          { t:"The stroma", why:"Stroma is in chloroplasts." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What does <strong>one turn</strong> of the Krebs cycle make?", options:[
          { t:"3 NADH, 1 FADH₂, 1 ATP, 2 CO₂", ok:true, why:"One turn: 3 NADH, 1 FADH₂, 1 ATP (via GTP) and 2 CO₂." },
          { t:"6 NADH, 2 FADH₂, 2 ATP, 4 CO₂", why:"That’s two turns: one glucose." },
          { t:"4 NADH, 1 FADH₂, 1 ATP, 3 CO₂", why:"That adds pyruvate oxidation’s NADH and CO₂." },
          { t:"1 NADH, 1 FADH₂, 3 ATP, 2 CO₂", why:"The cycle makes mostly NADH, not ATP." }] },
        b:{ prompt:"How many CO₂ does the Krebs cycle itself (not pyruvate oxidation) release for <strong>one glucose</strong>?", options:[
          { t:"4", ok:true, why:"2 CO₂ per turn × 2 turns." },
          { t:"2", why:"That’s one turn." },
          { t:"6", why:"That includes pyruvate oxidation’s 2." },
          { t:"3", why:"That’s per pyruvate, counting pyruvate oxidation." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"What enters the Krebs cycle, and what does it combine with?", options:[
          { t:"A 2-carbon acetyl group (from acetyl-CoA) combines with oxaloacetate (4C) to make citrate (6C)", ok:true, why:M3 },
          { t:"Glucose (6C) combines with oxaloacetate", why:"Glucose was split in glycolysis." },
          { t:"Pyruvate (3C) combines with oxaloacetate", why:"Pyruvate is first trimmed to acetyl." },
          { t:"CO₂ combines with RuBP", why:"That’s carbon fixation in photosynthesis." }] },
        b:{ prompt:"Which molecule is regenerated at the end of every turn?", options:[
          { t:"Oxaloacetate", ok:true, why:M6 },
          { t:"Citrate", why:"Citrate is the first product of each turn, not the molecule that is regenerated." },
          { t:"Acetyl-CoA", why:"Acetyl-CoA is consumed each turn." },
          { t:"Pyruvate", why:"Pyruvate is never remade by the cycle." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"A drug blocks succinate dehydrogenase. Acetyl-CoA keeps arriving. Which molecule builds up <strong>first</strong>?", options:[
          { t:"Succinate", ok:true, why:"The blocked enzyme’s substrate piles up." },
          { t:"Fumarate", why:"Fumarate is made <strong>by</strong> the blocked enzyme, so it runs out." },
          { t:"Oxaloacetate", why:"Oxaloacetate is downstream of the block, so it runs out and the cycle stops." },
          { t:"CO₂", why:"CO₂ release slows; it doesn’t build up." }] },
        b:{ prompt:"A drug blocks isocitrate dehydrogenase. Acetyl-CoA keeps arriving at first. Which molecules build up?", options:[
          { t:"Isocitrate (and citrate)", ok:true, why:"The block stops the cycle just after them." },
          { t:"α-ketoglutarate", why:"That’s made by the blocked enzyme." },
          { t:"Oxaloacetate", why:"It runs out, because it’s downstream of the block." },
          { t:"NADH", why:"NADH production falls." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Three glucose molecules are completely oxidized. How many CO₂ come from pyruvate oxidation and the Krebs cycle together?", options:[
          { t:"18", ok:true, why:"6 per glucose × 3." },
          { t:"12", why:"That leaves out pyruvate oxidation’s 2 per glucose." },
          { t:"9", why:"That counts one turn per glucose." },
          { t:"6", why:"That’s one glucose." }] },
        b:{ prompt:"Isolated mitochondria are given 4 pyruvate. How many NADH come from pyruvate oxidation and the Krebs cycle together?", options:[
          { t:"16", ok:true, why:"Each pyruvate: 1 (pyruvate oxidation) + 3 (one turn) = 4." },
          { t:"12", why:"That leaves out pyruvate oxidation." },
          { t:"24", why:"One pyruvate gives one turn, not two." },
          { t:"20", why:"That adds glycolysis, which these mitochondria don’t do." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Cells are given glucose with radioactive carbon (¹⁴C) in all six positions, with plenty of O₂. After complete oxidation, where is the radioactive carbon?", options:[
          { t:"In CO₂ breathed out", ok:true, why:"Every carbon leaves as CO₂ in pyruvate oxidation and the cycle." },
          { t:"In water", why:"Water forms from O₂ and H; it holds no carbon." },
          { t:"In NADH and FADH₂", why:"Carriers hold electrons and hydrogen, not glucose’s carbon." },
          { t:"In oxaloacetate, permanently", why:"Oxaloacetate’s carbons also leave over later turns." }] },
        b:{ prompt:"Cells are given O₂ labelled with heavy oxygen (¹⁸O). After respiration, which product contains the label?", options:[
          { t:"Water", ok:true, why:"O₂ accepts electrons at the end of the chain and becomes H₂O." },
          { t:"CO₂", why:"The oxygen in CO₂ comes from the fuel molecules and water, not O₂." },
          { t:"Glucose", why:"Glucose is being broken down, not made." },
          { t:"Oxaloacetate", why:"No cycle step uses O₂." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why the Krebs cycle stops when O₂ runs out, even though no step uses O₂?", options:[
          { t:"“The cycle needs empty NAD⁺ and FAD. Only the electron transport chain empties them, and the chain can’t run without O₂ to accept electrons.”", ok:true, why:M5 },
          { t:"“O₂ is needed to make the CO₂ released by the cycle.”", why:M5 + " " + M7 },
          { t:"“Mitochondria die instantly without O₂.”", why:"The cycle stalls because of the carriers, not cell death." },
          { t:"“Without O₂, glucose can’t enter the cycle.”", why:"Glucose never enters the cycle." }] },
        b:{ prompt:"Which is the best explanation of why the Krebs pathway is called a cycle?", options:[
          { t:"“Oxaloacetate, which accepts each acetyl group, is regenerated at the end of every turn, so the same molecules are used again and again.”", ok:true, why:M6 },
          { t:"“Because CO₂ is recycled into glucose.”", why:"That’s photosynthesis." },
          { t:"“Because it turns twice per glucose.”", why:"Turning twice is about the input, not the name." },
          { t:"“Because NAD⁺ goes around it.”", why:"NAD⁺ is used and regenerated elsewhere." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which sentence best describes the main purpose of the Krebs cycle in energy terms?", options:[
          { t:"“It strips electrons from acetyl groups and loads them onto NAD⁺ and FAD, so most of the energy can be harvested later by the electron transport chain.”", ok:true, why:"Its real job is loading carriers: 3 NADH and 1 FADH₂ per turn." },
          { t:"“It makes most of the cell’s ATP directly.”", why:M1 },
          { t:"“It turns CO₂ into acetyl-CoA.”", why:"That’s backwards." },
          { t:"“It stores glucose for later.”", why:"It breaks fuel down." }] },
        b:{ prompt:"Which flow chart for one turn is correct?", options:[
          { t:"“Acetyl-CoA + oxaloacetate → citrate (6C) → … → oxaloacetate (4C); outputs 2 CO₂, 3 NADH, 1 FADH₂, 1 ATP”", ok:true, why:"Acetyl (2C) joins oxaloacetate (4C); two carbons leave as CO₂ and oxaloacetate is remade." },
          { t:"“Pyruvate + oxaloacetate → citrate; outputs 3 CO₂, 4 NADH.”", why:M4 },
          { t:"“Glucose → citrate → oxaloacetate; outputs 6 CO₂.”", why:M3 },
          { t:"“Acetyl-CoA + O₂ → citrate; outputs 2 CO₂ and water.”", why:M5 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Pyruvate dehydrogenase needs thiamine (vitamin B₁). In severe thiamine deficiency, which change in the blood is most likely?", options:[
          { t:"Pyruvate (and the lactate made from it) builds up, because pyruvate can’t be turned into acetyl-CoA", ok:true, why:"Pyruvate is made by glycolysis but can’t move on to the cycle." },
          { t:"Acetyl-CoA builds up", why:"It can’t be made, so it falls." },
          { t:"CO₂ output rises sharply", why:"Less pyruvate is oxidized, so less CO₂." },
          { t:"Glucose can’t be broken down at all", why:"Glycolysis doesn’t need this enzyme." }] },
        b:{ prompt:"FAD is made from riboflavin (vitamin B₂). If FAD is scarce, which cycle step slows most directly?", options:[
          { t:"Succinate → fumarate", ok:true, why:"Succinate dehydrogenase loads FAD." },
          { t:"Isocitrate → α-ketoglutarate", why:"That step uses NAD⁺." },
          { t:"Malate → oxaloacetate", why:"That step uses NAD⁺." },
          { t:"Acetyl-CoA + oxaloacetate → citrate", why:"No carrier is used there." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"During a long run, muscle breaks down a fatty acid that supplies 8 acetyl-CoA. How many turns of the cycle, and how many NADH from the cycle alone?", options:[
          { t:"8 turns, 24 NADH", ok:true, why:"One acetyl-CoA → one turn → 3 NADH: 8 × 3 = 24." },
          { t:"4 turns, 12 NADH", why:"One acetyl-CoA → one turn." },
          { t:"8 turns, 32 NADH", why:"There’s no pyruvate oxidation for fat-derived acetyl-CoA." },
          { t:"16 turns, 48 NADH", why:"Each acetyl-CoA drives one turn, not two." }] },
        b:{ prompt:"A cell oxidizes 5 acetyl-CoA. How many FADH₂ and how many ATP (via GTP) does the cycle make?", options:[
          { t:"5 FADH₂, 5 ATP", ok:true, why:"One turn per acetyl-CoA, with 1 FADH₂ and 1 ATP each." },
          { t:"10 FADH₂, 10 ATP", why:"That doubles the turns." },
          { t:"5 FADH₂, 15 ATP", why:"15 is the NADH count, not ATP." },
          { t:"2 FADH₂, 2 ATP", why:"That’s one glucose’s worth." }] } }
    ]
  },
  task:{
    title:"Fuel the cycle", summary:"Fuel the cycle",
    statement:"<p>A muscle cell’s mitochondria can receive glucose (via glycolysis), extra pyruvate (from the blood) and acetyl-CoA (from fats). Choose a fuel mix that meets every condition. Can you find all the answers?</p><ol class=\"kc-conds\"><li>The Krebs cycle turns exactly 6 times.</li><li>Pyruvate oxidation and the cycle release exactly 16 CO₂ in total.</li><li>At least two different kinds of fuel are used.</li></ol>",
    checks:["Exactly 6 turns", "Exactly 16 CO₂", "At least two kinds of fuel"],
    tips:["Each glucose gives 2 turns; each pyruvate or acetyl-CoA gives 1.",
      "Each turn releases 2 CO₂. Pyruvate oxidation adds 1 CO₂ per pyruvate, so glucose adds 2 extra and extra pyruvate adds 1 extra. You need 16 − 2 × 6 = 4 extra.",
      "Mix your fuels: one kind alone doesn’t count."],
    explainPrompt:"Explain how you used the turns and the CO₂ count together to pin down the fuel mix.",
    vocab:"Use the words acetyl-CoA, pyruvate oxidation, turn and CO₂.",
    success:"Your fuel mix works!",
    more:"Can you find all the answers?",
    after3:"Every answer needs 2 acetyl-CoA. The “extra” CO₂ (2<i>g</i> + <i>p</i> = 4) fixes the glucose and pyruvate together, and the turns then leave exactly 2 for fat."
  },
  cards:[
    ["Pyruvate oxidation", "Pyruvate (3C) → acetyl-CoA (2C) + CO₂ + NADH, in the matrix. Twice per glucose."],
    ["Krebs cycle: entry", "Acetyl (2C) + oxaloacetate (4C) → citrate (6C)."],
    ["Per turn", "3 NADH, 1 FADH₂, 1 ATP (via GTP), 2 CO₂."],
    ["Per glucose", "Two turns: 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂."],
    ["Oxaloacetate", "The 4C molecule regenerated each turn, ready for the next acetyl group."],
    ["Decarboxylation", "Removing a carbon as CO₂: isocitrate → α-ketoglutarate, and α-ketoglutarate → succinyl-CoA."],
    ["FAD step", "Succinate → fumarate (succinate dehydrogenase, in the inner membrane)."],
    ["Substrate-level ATP in the cycle", "Succinyl-CoA → succinate makes GTP, which becomes ATP."],
    ["Where", "Matrix of the mitochondrion (cytoplasm in prokaryotes)."],
    ["O₂ and the cycle", "Not used directly; needed to regenerate NAD⁺ and FAD through the chain."],
    ["Glucose’s six carbons", "2 leave in pyruvate oxidation and 4 in the cycle: all 6 end up as CO₂."],
    ["Main purpose", "Load electron carriers (NADH, FADH₂) for the electron transport chain."]
  ]
};
