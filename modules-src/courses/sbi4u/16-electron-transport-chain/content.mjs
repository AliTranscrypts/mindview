// SBI4U 16 The electron transport chain. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/16-electron-transport-chain.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "O₂ waits at the very end. It accepts the electrons after complex IV and becomes water.";
const M2 = "The chain only pumps H⁺. ATP synthase uses the gradient to make ATP (module 17).";
const M3 = "FADH₂’s electrons enter at complex II, after complex I, so they pass one fewer pump: 6 H⁺, not 10.";
const M4 = "H⁺ is pumped <strong>out of</strong> the matrix <strong>into</strong> the intermembrane space.";
const M5 = "Electrons are passed along, not used up. Energy is released as they move to carriers that hold them more tightly.";
const M6 = "Complex II passes electrons on but releases too little energy to pump.";
const M7 = "A block backs the chain up: carriers before it stay loaded, carriers after it stay empty, and O₂ use stops.";
const CYTC = "cytochrome <i>c</i>";

// Quick check: the plan gives one "feedback if wrong" line per item; the right chip gets "Right." + the same reason.
function qc(id, goal, prompt, list, fb){
  return { id:id, goal:goal, prompt:prompt, choices:list.map(function(t, i){ return i === 0 ? { t:t, ok:true, fb:"Right. " + fb } : { t:t, fb:fb }; }) };
}
// Poison detective: the same five chips for the "where is the block?" cases (an answer scale, kept in this order)
function sites(answer, fb){
  return ["Complex I", "Complex II", "Complex III", "Complex IV", "Cytochrome <i>c</i> is missing"].map(function(t, i){
    var o = { t:t, why:fb[i] };
    if (i === answer) o.ok = true;
    return o;
  });
}

export default {
  id:"16-electron-transport-chain",
  kind:"topic",
  title:"The electron transport chain",
  topic:"The Electron Transport Chain",
  readyTopic:"the electron transport chain",
  hero:{
    eq:'<span class="et-heq"><span class="et-heq1"><span class="et-hk"><span class="et-cn">NADH</span> →</span> <span class="et-hk">I →</span> <span class="et-hk">Q →</span> <span class="et-hk">III →</span> <span class="et-hk">cyt <i>c</i> →</span> <span class="et-hk">IV →</span> <span class="et-hk et-co">O₂</span></span>' +
       '<span class="et-heq2"><span class="et-hk">½<span class="et-co">O₂</span> +</span> <span class="et-hk">2<span class="et-ce">e⁻</span> +</span> <span class="et-hk">2<span class="et-ch">H⁺</span> →</span> <span class="et-hk et-co">H₂O</span></span></span>',
    eqLabel:"NADH passes its electrons to complex I, then ubiquinone Q, complex III, cytochrome c, complex IV and finally O₂. Underneath: one half O₂ plus 2 electrons plus 2 H⁺ gives H₂O.",
    eqSize:"sm",
    headline:"Electrons fall downhill, and every step pays",
    text:"NADH and FADH₂ arrive full of high-energy electrons. In the <strong>inner mitochondrial membrane</strong>, a chain of carriers passes those electrons along, each one holding them a little more tightly than the last. The energy released along the way <strong>pumps H⁺</strong> across the membrane. At the bottom of the staircase, <strong>oxygen</strong> takes the electrons and becomes <strong>water</strong>.",
    fig:{ html:'<div class="et-hero" id="et-hero" role="img" aria-label="A staircase sits below a membrane strip. A teal NADH waits on the top step. Two violet electrons hop down the steps: NADH, complex I, Q, complex III, cytochrome c, complex IV. At complex I, complex III and complex IV a magenta pair of H⁺ pops up through the membrane into the space above. At the bottom step a blue O₂ catches the electrons, takes H⁺ from below and becomes H₂O. A counter reads 10 H⁺ pumped, and the empty NAD⁺ floats back toward the Krebs cycle."></div>' }
  },
  goals:[
    "I can name the parts of the electron transport chain and where it is.",
    "I can trace the path of electrons from NADH and from FADH₂ to O₂.",
    "I can explain why electrons release energy in steps, and how that energy pumps H⁺ into the intermembrane space.",
    "I can explain the role of O₂ as the final electron acceptor and predict what happens without it.",
    "I can predict the effects of blocking a complex or carrier, using evidence such as O₂ use.",
    "I can count H⁺ pumped and O₂ used for a given mix of NADH and FADH₂."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Carriers and redox", goal:2,
          prompt:"When NADH gives up its electrons, what does it become?",
          options:[
            { t:"NAD⁺, an empty carrier ready to be reused", ok:true, why:"Unloading regenerates NAD⁺." },
            { t:"NADPH", why:"NADPH belongs to photosynthesis." },
            { t:"ATP", why:"NADH and ATP are different molecules." },
            { t:"FADH₂", why:"NAD and FAD are separate carriers." }],
          hints:["NADH is the loaded form.", "Unloading removes electrons and H.", "NAD⁺."] },
        { id:"w2", skill:"Carriers and redox", goal:3,
          prompt:"An atom that strongly attracts electrons is described as…",
          options:[
            { t:"highly electronegative", ok:true, why:"O is one of the most electronegative atoms." },
            { t:"reduced", why:"Reduced describes a molecule after gaining electrons." },
            { t:"positively charged", why:"Electronegativity isn’t a charge." },
            { t:"an electron donor", why:"Donors give electrons away." }],
          hints:["Think of the tug-of-war in module 11.", "Which atom pulls hardest?", "Electronegative."] },
        { id:"w3", skill:"Mitochondrion structure", goal:1,
          prompt:"Where are the electron transport chain proteins found?",
          options:[
            { t:"In the inner mitochondrial membrane (including the cristae)", ok:true, why:"The folds give more room for chains." },
            { t:"In the matrix", why:"That’s where the Krebs cycle runs." },
            { t:"In the outer membrane", why:"The outer membrane is leaky to small molecules." },
            { t:"In the cytosol", why:"That’s glycolysis." }],
          hints:["A membrane is needed to separate H⁺.", "Which membrane is folded?", "The inner membrane."] },
        { id:"w4", skill:"Mitochondrion structure", goal:3,
          prompt:"Which space lies between the inner and outer mitochondrial membranes?",
          options:[
            { t:"The intermembrane space", ok:true, why:"H⁺ builds up here." },
            { t:"The matrix", why:"The matrix is inside the inner membrane." },
            { t:"The lumen", why:"Lumen is the inside of a thylakoid." },
            { t:"The stroma", why:"Chloroplast term." }],
          hints:["Between the two membranes.", "It’s named for its position.", "Intermembrane space."] },
        { id:"w5", skill:"Per-glucose counts", goal:6,
          prompt:"How many NADH does one glucose produce across glycolysis, pyruvate oxidation and the Krebs cycle?",
          options:[
            { t:"10", ok:true, why:"2 + 2 + 6." },
            { t:"6", why:"Add glycolysis and pyruvate oxidation." },
            { t:"8", why:"Glycolysis makes 2 too." },
            { t:"3", why:"That’s one Krebs turn." }],
          hints:["Add stage by stage.", "2 (glycolysis) + 2 (pyruvate oxidation) + 6 (Krebs).", "10."] },
        { id:"w6", skill:"Per-glucose counts", goal:6,
          prompt:"How many FADH₂ does one glucose produce?",
          options:[
            { t:"2", ok:true, why:"One per Krebs turn, two turns." },
            { t:"1", why:"One glucose turns the cycle twice." },
            { t:"4", why:"Only the succinate step makes FADH₂." },
            { t:"0", why:"The Krebs cycle makes FADH₂." }],
          hints:["Which stage makes FADH₂?", "The Krebs cycle, once per turn.", "2."] }
      ],
      refreshers:{
        "Carriers and redox":"NADH and FADH₂ are loaded carriers. Unloading them gives NAD⁺ and FAD back. Electrons move toward atoms that attract them more strongly (more electronegative), releasing energy.",
        "Mitochondrion structure":"Outer membrane; intermembrane space; inner membrane, folded into cristae, which holds the ETC and ATP synthase; matrix inside.",
        "Per-glucose counts":"10 NADH (2 + 2 + 6) and 2 FADH₂ per glucose: 12 electron pairs to feed the chain."
      }
    }
  },
  explore:{
    heading:"Electron staircase",
    intro:"Feed electrons into the chain and follow them down the staircase. Count the H⁺ pumped and the O₂ used. Then try blocking the chain.",
    modes:{ follow:"Follow one pair", steady:"Steady flow", poison:"Poisons lab" },
    blockers:[
      { id:"rot", t:"Rotenone", what:"blocks complex I" },
      { id:"cn", t:"Cyanide", what:"blocks complex IV" },
      { id:"noc", t:"No " + CYTC, what:"a mutant" }
    ],
    modelNote:"Model values. H⁺ pumped per electron pair: complex I 4, complex III 4, complex IV 2, so NADH → 10 H⁺ and FADH₂ → 6 H⁺ (NADH passes three pumps, FADH₂ two). Energy released from NADH to O₂ ≈ 220 kJ/mol per pair: I ≈ 70, III ≈ 40, IV ≈ 110; the hand-overs between them are small. Every pair that reaches O₂ uses ½ O₂ and forms 1 H₂O. Steady flow: pairs per tick = feed × O₂ supply, rounded down (NADH pairs go first).",
    aha:"Electrons move downhill in steps, and each pumping step moves H⁺ outward. FADH₂ pays less. O₂ at the bottom keeps everything moving. A single block jams the whole chain.",
    predIntro:"Make a prediction first. Then the chain will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"follow", feed:["n"], o2:true },
        prompt:"<span class=\"muted\">Follow mode, “+ NADH”, O₂ present.</span> As this pair passes through the chain, how many complexes pump H⁺?",
        options:[{ t:"3", ok:true }, { t:"4" }, { t:"2" }, { t:"1" }],
        explain:"Complexes I, III and IV pump. Q and " + CYTC + " are carriers, not pumps, and complex II doesn’t pump." },
      { id:"p2", start:{ mode:"follow", feed:["f"], o2:true },
        prompt:"<span class=\"muted\">“+ FADH₂” instead.</span> Compared with one NADH, how many H⁺ will one FADH₂ pump?",
        options:[{ t:"Fewer (6 instead of 10)", ok:true }, { t:"The same" }, { t:"More" }, { t:"None" }],
        explain:"FADH₂’s electrons skip complex I’s pump." },
      { id:"p3", start:{ mode:"follow", feed:["n", "n"], o2:false },
        prompt:"<span class=\"muted\">O₂ absent, “+ NADH”.</span> What happens?",
        options:[{ t:"The electrons stop at complex IV; carriers back up and pumping stops", ok:true }, { t:"Electrons are passed to CO₂ instead" }, { t:"Pumping continues, but no water forms" }, { t:"The electrons escape as light" }],
        explain:"With no final acceptor, nothing leaves complex IV, so nothing upstream can move either." },
      { id:"p4", start:{ mode:"poison", rot:true, o2:100 },
        prompt:"<span class=\"muted\">Poisons lab: rotenone on. “+ FADH₂”.</span> Does any pumping happen?",
        options:[{ t:"Yes, at complexes III and IV", ok:true }, { t:"No, the whole chain stops" }, { t:"Only at complex I" }, { t:"Yes, but no water forms" }],
        explain:"FADH₂ enters after complex I, so a complex I block doesn’t stop it." }
    ],
    chalIntro:"Use the chain to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[5, 6], prompt:"Follow mode: feed the chain so that exactly <strong>26 H⁺</strong> are pumped.",
        why:"2 NADH and 1 FADH₂: 10 × 2 + 6 = 26.",
        general:"Each NADH pumps 10; each FADH₂ pumps 6.",
        hints:["NADH = 10, FADH₂ = 6.", "Try 2 NADH: 20. How many more?", "20 + 6 = 26: 2 NADH and 1 FADH₂."] },
      { id:"tc2", goal:[5, 6], prompt:"Poisons lab: rotenone is on and O₂ is at 100%. Get the O₂-use m&#101;ter above zero.",
        why:"FADH₂’s electrons enter at complex II, after the rotenone block, so they still reach O₂.",
        general:"Which donor doesn’t need complex I?",
        hints:["Which donor doesn’t need complex I?", "FADH₂ enters at complex II.", "Feed FADH₂."] },
      { id:"tc3", goal:[5, 6], stretch:true, prompt:"Follow mode: use exactly <strong>3 O₂</strong> and pump exactly <strong>52 H⁺</strong>.",
        why:"6 pairs use 3 O₂; 4 NADH and 2 FADH₂ pump 40 + 12 = 52 H⁺.",
        general:"Each pair uses ½ O₂. How many pairs for 3 O₂?",
        hints:["Each pair uses ½ O₂. How many pairs for 3 O₂?", "6 pairs. With <i>n</i> NADH and 6 − <i>n</i> FADH₂: 10<i>n</i> + 6(6 − <i>n</i>) = 52.", "4<i>n</i> = 16, so 4 NADH and 2 FADH₂."] }
    ],
    fb:{
      tc1a:"Each NADH pumps 10; each FADH₂ pumps 6.",
      tc1b:"FADH₂ alone can’t reach 26 in steps of 6.",
      tc2a:"NADH unloads only at complex I, which rotenone blocks.",
      tc2b:"Keep the poison on; find another way in.",
      tc3a:"Right O₂, too many H⁺: swap some NADH for FADH₂.",
      tc3b:"Right O₂, too few H⁺.",
      tc3c:"Only 2.5 O₂ used: you need 6 pairs."
    }
  },
  part3:{
    slug:"oxygen", name:"Oxygen",
    heading:"Why oxygen?",
    intro:"Explore showed the chain as a machine. Here you ask why O₂ is the only acceptor that works at the bottom, then test the model against a real kind of experiment: an oxygen-electrode trace.",
    s1:{
      title:"Station 1: the electronegativity ladder",
      panel:"Zoom to the molecules",
      intro:"The carriers are lined up by how strongly they hold electrons, from NADH (weakest) to O₂ (strongest). Move the slider to take the pair down one rung at a time.",
      rungs:[
        { id:"nadh", t:"NADH", hold:"weakest hold" },
        { id:"I", t:"complex I" },
        { id:"q", t:"ubiquinone (Q)" },
        { id:"III", t:"complex III" },
        { id:"c", t:CYTC },
        { id:"IV", t:"complex IV" },
        { id:"o2", t:"O₂", hold:"strongest hold" }
      ],
      // energy released on the move INTO each rung (model values; 0 = a small hand-over)
      drops:[0, 0, 70, 0, 40, 0, 110],
      text:"Oxygen is one of the most electronegative elements, so it pulls electrons off complex IV and releases the biggest single step of energy. If the energy were released all at once, it would be lost as heat. In steps, it can be captured by pumps."
    },
    s2:{
      title:"Station 2: the oxygen electrode (investigation)",
      panel:"Check it with data",
      intro:"A sealed chamber holds isolated mitochondria, and an electrode reads the O₂ left in it over 10 minutes. Four additions are marked by arrows. Tap each segment of the trace, then choose the chip that explains it.",
      adds:[
        { t:2, n:"pyruvate + malate", note:"an NADH source" },
        { t:4, n:"rotenone", note:"" },
        { t:6, n:"succinate", note:"an FADH₂ source" },
        { t:8, n:"cyanide", note:"" }
      ],
      segs:[
        { id:"g1", a:2, b:4, shape:"falls", answer:"e1" },
        { id:"g2", a:4, b:6, shape:"goes flat", answer:"e2" },
        { id:"g3", a:6, b:8, shape:"falls again, less steeply", answer:"e3" },
        { id:"g4", a:8, b:10, shape:"goes flat", answer:"e4" }
      ],
      chips:[
        { id:"e1", t:"NADH from pyruvate + malate unloads at complex I, so electrons flow to O₂." },
        { id:"e2", t:"Rotenone blocks complex I, so NADH’s electrons can’t reach O₂." },
        { id:"e3", t:"Electrons from FADH₂ enter at complex II, bypassing the rotenone block." },
        { id:"e4", t:"Cyanide blocks complex IV, so no electrons reach O₂ by any route." },
        { id:"e5", t:"The chamber has run out of O₂.", fb:"There’s still plenty of O₂ in the chamber: the trace is flat well above zero." }
      ],
      ask:{ id:"s2q", prompt:"Why does cyanide flatten the trace even though succinate is still present?",
        options:[
          { t:"Complex IV is on every route to O₂, so blocking it stops all electron flow.", ok:true, why:"Both NADH’s and FADH₂’s electrons must pass complex IV to reach O₂." },
          { t:"Cyanide breaks down succinate.", why:"Succinate is still there; the block is in the chain." },
          { t:"Cyanide blocks complex II.", why:"Cyanide blocks complex IV, which both routes share." },
          { t:"The O₂ in the chamber has run out.", why:"The trace is flat well above zero: O₂ is left, but nothing passes electrons to it." }] }
    },
    s3:{
      title:"Station 3: carbon monoxide (STSE)",
      // VERIFY: Ontario CO-alarm requirement (Fire Code / Building Code: homes with fuel-burning appliances or attached garages) — plan marks it "verify before release".
      text:"CO binds hemoglobin and complex IV, so cells starve of both O₂ delivery and electron flow. That’s why fuel-burning furnaces and stoves must be vented, and why Ontario requires CO alarms in homes with fuel-burning appliances or attached garages.",
      ask:{ id:"s3q", prompt:"Why does CO poisoning make a person feel weak even though they’re breathing?",
        options:[
          { t:"Less O₂ reaches cells, and complex IV is blocked, so the chain can’t pump and little ATP is made.", ok:true, why:"CO cuts O₂ delivery and blocks the last step of the chain, so the H⁺ gradient that drives ATP synthase isn’t built." },
          { t:"CO uses up the glucose in their cells.", why:"Glucose and NADH build up, unused: the block is in the chain." },
          { t:"CO stops the lungs from taking in air.", why:"They are breathing; the problem is what happens to O₂ and electrons inside the body." },
          { t:"CO speeds up the chain, so cells overheat.", why:"CO blocks complex IV: the chain stops." }] }
    },
    quickCheck:{
      title:"Quick check", summary:"Why oxygen? quick check",
      items:[
        qc("q1", 4, "What does O₂ become at the end of the chain?", ["Water", "CO₂", "Glucose", "NADH"], "O₂ + 4e⁻ + 4H⁺ → 2H₂O."),
        qc("q2", 5, "Rotenone is added, then succinate. O₂ use…", ["resumes", "stays at zero", "doubles", "reverses"], "Succinate’s FADH₂ enters at complex II, after the block."),
        qc("q3", 5, "Cyanide is added. Which carriers end up loaded?", ["Every carrier before complex IV", "Only complex IV", "None", "Only O₂"], "The chain backs up all the way."),
        qc("q4", 3, "Why are the energy steps small?", ["So pumps can capture the energy", "To save O₂", "To make CO₂", "To make light"], "One big drop would be lost as heat.")
      ]
    }
  },
  practice:{
    activities:[
      { id:"route", type:"custom", title:"The electron route", summary:"The electron route", goal:[1, 2],
        instruction:"Two electron routes. Build each one from the donor to the final acceptor.",
        how:"",
        sequences:[
          { id:"s1", goal:[1, 2], prompt:"Electrons from <strong>NADH</strong> (7 steps).",
            tiles:["NADH", "complex I", "ubiquinone (Q)", "complex III", CYTC, "complex IV", "O₂"],
            answer:[0, 1, 2, 3, 4, 5, 6],
            why:"NADH unloads at complex I, and its electrons pass three pumps (I, III and IV) on the way to O₂.",
            // VERIFY: the plan gives hints for sequence 2 only; these mirror them for NADH.
            hints:["Where does NADH unload?", "At complex I, which hands electrons to Q.", "NADH → I → Q → III → cyt <i>c</i> → IV → O₂."] },
          { id:"s2", goal:[1, 2], prompt:"Electrons from <strong>FADH₂</strong> (7 steps). One tile doesn’t belong: leave it out.",
            tiles:["FADH₂", "complex II", "ubiquinone (Q)", "complex III", CYTC, "complex IV", "O₂", "complex I"],
            answer:[0, 1, 2, 3, 4, 5, 6],
            why:"FADH₂ unloads at complex II, which passes the electrons to Q. They skip complex I, so they pass only two pumps.",
            hints:["Where does FADH₂ unload?", "At complex II, which hands electrons to Q.", "FADH₂ → II → Q → III → cyt <i>c</i> → IV → O₂."] }
        ],
        fb:{
          cBeforeIII:"Cytochrome <i>c</i> carries electrons from III to IV.",
          qAfterIII:"Q carries electrons from I (or II) to III.",
          usedI:"FADH₂ skips complex I.",
          short:"The route isn’t finished yet: it runs from the donor all the way to O₂.",
          general:"Ask which carrier hands electrons to which."
        } },
      { id:"detective", type:"custom", title:"Poison detective", summary:"Poison detective", star:true, goal:[4, 5],
        instruction:"Each case gives observations from isolated mitochondria. Choose where the chain is blocked, or what is missing. Cases 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        how:"",
        items:[
          { id:"d1", goal:5,
            prompt:"With NADH: no O₂ use. With succinate (FADH₂): O₂ use normal.",
            options:sites(0, ["NADH’s route is blocked but FADH₂’s isn’t: the block sits where only NADH passes.",
              "Complex II is on succinate’s route, and succinate works.",
              "Then succinate would fail too: its route passes complex III.",
              "Then succinate would fail too.",
              "Then succinate would fail too: both routes need cytochrome <i>c</i>."]),
            // VERIFY: hints authored for d1, d2, d4 and d5 (the plan gives hints for P3 and P6 only).
            hints:["Which route still works?", "Succinate’s route skips complex I; NADH’s doesn’t.", "Complex I."] },
          { id:"d2", goal:5,
            prompt:"With NADH or succinate: no O₂ use; cytochrome <i>c</i> is fully loaded.",
            options:sites(3, ["Succinate would still work.",
              "NADH would still work.",
              "Then cyt <i>c</i> would be empty.",
              "Cytochrome <i>c</i> is loaded, so the block is after it: complex IV.",
              "Cytochrome <i>c</i> is there, and it’s loaded."]),
            hints:["Loaded carriers sit before the block; empty ones after it.", "Cytochrome <i>c</i> is loaded, so the block is after it.", "Complex IV."] },
          { id:"d3", goal:5, star:true,
            prompt:"With NADH or succinate: no O₂ use; Q is loaded, but cytochrome <i>c</i> is empty.",
            options:sites(2, ["Succinate would still work.",
              "NADH would still work.",
              "Q is loaded and cyt <i>c</i> is empty: complex III sits between them.",
              "Then cytochrome <i>c</i> would be loaded.",
              "Cytochrome <i>c</i> is there; it’s just empty because nothing reaches it."]),
            hints:["Loaded carriers sit before the block; empty ones after it.", "Q is loaded and cyt <i>c</i> is empty.", "Complex III sits between them."] },
          { id:"d4", goal:5, star:true,
            prompt:"Both donors work only when cytochrome <i>c</i> is added to the flask.",
            options:sites(4, ["Adding cyt <i>c</i> wouldn’t fix complex I.",
              "Adding cyt <i>c</i> wouldn’t fix complex II, and NADH doesn’t use complex II.",
              "Adding cyt <i>c</i> wouldn’t fix complex III.",
              "Adding cyt <i>c</i> wouldn’t fix complex IV.",
              "Adding the missing carrier restores both routes."]),
            hints:["What does adding something to the flask fix?", "Only something that is missing.", "Cytochrome <i>c</i> is missing."] },
          { id:"d5", goal:[4, 5], star:true,
            prompt:"(Investigation) A student adds a new chemical and sees O₂ use stop with NADH. Which <strong>one</strong> extra test would best tell whether the block is at complex I or later?",
            options:[
              { t:"Add succinate and see whether O₂ use returns", ok:true, why:"Succinate’s electrons skip complex I. If O₂ use returns, the block is at complex I; if not, it’s later in the chain." },
              { t:"Add more NADH", why:"That repeats the same route." },
              { t:"Add more O₂", why:"O₂ isn’t missing: NADH’s electrons aren’t reaching it." },
              { t:"Add cyanide", why:"Cyanide stops every route, so it can’t tell the two sites apart." }],
            hints:["Find a donor that enters the chain after complex I.", "Succinate gives FADH₂, which enters at complex II.", "Add succinate: if O₂ use returns, the block is at complex I."] },
          { id:"d6", goal:[5, 6], star:true, fixedOrder:true,
            prompt:"With NADH: H⁺ pumped is 6 per pair instead of 10, and O₂ use is normal. With succinate, H⁺ pumped is 2 per pair instead of 6. Which complex has stopped pumping (but still passes electrons)?",
            options:[
              { t:"Complex I", why:"Then succinate would still give 6." },
              { t:"Complex II", why:"Complex II never pumps, so losing it would change nothing." },
              { t:"Complex III", ok:true, why:"It lost 4 H⁺ on both routes, and both routes pass complex III. Electrons still flow, so it’s a pump failure, not a block." },
              { t:"Complex IV", why:"IV pumps only 2: losing it would give 8 with NADH." }],
            hints:["10 − 6 = 4 H⁺ missing with NADH, so it’s a complex that pumps 4: I or III.", "Succinate’s route skips I but passes III. It lost 4 too (6 → 2).", "Complex III. Electrons still flow, so it’s a pump failure, not a block."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Imani",
        instruction:"Imani made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        how:"",
        problems:[
          { id:"e1", goal:6, task:"Count the H⁺ pumped for 2 NADH and 2 FADH₂ (model values).",
            steps:["NADH electrons pass complexes I, III and IV.", "So each NADH pumps 4 + 4 + 2 = 10 H⁺.", "FADH₂ electrons also start at complex I, so each pumps 10 H⁺.", "Total: 4 × 10 = 40 H⁺."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"FADH₂ enters at complex II and skips complex I: 6 H⁺ each. Total 20 + 12 = 32.", ok:true, why:M3 },
              { t:"FADH₂ pumps 0 H⁺, because complex II doesn’t pump.", why:"It still passes III and IV." },
              { t:"NADH pumps 6 H⁺.", why:"NADH passes three pumps." },
              { t:"Step 3 is correct.", why:"Step 3 is the first mistake. " + M3 }],
            hints:["Where does FADH₂ unload?", "Complex II.", "6 each: 32 in total."] },
          { id:"e2", goal:4, task:"Explain O₂’s role.",
            steps:["Electrons move from carrier to carrier, releasing energy.", "O₂ enters at complex I to start the flow of electrons.", "Without O₂, the chain can’t start.", "So O₂ is needed for respiration."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows from step 2. The mistake is earlier.", "The conclusion is true, but the reason is wrong."],
            fixes:[
              { t:"O₂ is the <strong>final</strong> acceptor at complex IV. It takes the electrons and H⁺ to form water. Without it, electrons back up and the chain stops.", ok:true, why:M1 },
              { t:"O₂ combines with carbon to make CO₂.", why:M1 },
              { t:"O₂ pumps H⁺.", why:"Complexes pump; O₂ accepts electrons." },
              { t:"Step 2 is correct.", why:"Step 2 is the first mistake. " + M1 }],
            hints:["Which end of the chain is O₂ at?", "The bottom.", "Final acceptor → water."] },
          { id:"e3", goal:3, task:"Explain how the chain helps make ATP.",
            steps:["NADH and FADH₂ give electrons to the chain.", "As electrons pass complexes I, III and IV, energy is released.", "Each of these complexes uses that energy to attach a phosphate to ADP, making ATP.", "So the chain makes ATP at three sites."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"The complexes use the energy to pump H⁺ into the intermembrane space. ATP synthase later uses the H⁺ gradient to make ATP.", ok:true, why:M2 },
              { t:"The energy is stored in O₂.", why:"O₂ accepts electrons; it doesn’t store the energy." },
              { t:"The energy is released as light.", why:"It’s captured by pumping." },
              { t:"Step 3 is correct.", why:"Step 3 is the first mistake. " + M2 }],
            hints:["What do complexes I, III and IV move across the membrane?", "H⁺.", "ATP synthase makes the ATP."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the staircase: that FADH₂ pays less, or how one blocked complex jams everything?" },
      { id:"j2", q:"In your own words, why is O₂ needed at the end of the chain?" },
      { id:"j3", q:"Explain to a friend how to use observations (O₂ use, loaded and empty carriers) to find where a chain is blocked." },
      { id:"j4", q:"Which part of the electron transport chain is still unclear to you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the final electron acceptor of the electron transport chain?", options:[
          { t:"O₂", ok:true, why:"It forms water at complex IV." },
          { t:"NAD⁺", why:"NAD⁺ is regenerated at the <strong>start</strong>, when NADH unloads." },
          { t:"H₂O", why:"Water is the product, not the acceptor." },
          { t:"Cytochrome <i>c</i>", why:"Cyt <i>c</i> passes electrons on to complex IV." }] },
        b:{ prompt:"Where are the electron transport chain complexes in a eukaryotic cell?", options:[
          { t:"The inner mitochondrial membrane", ok:true, why:"The inner membrane, folded into cristae, holds the chain and keeps the H⁺ gradient sealed." },
          { t:"The matrix", why:"The matrix holds the Krebs cycle." },
          { t:"The outer mitochondrial membrane", why:"The ETC needs the sealed inner membrane." },
          { t:"The intermembrane space", why:"That’s where H⁺ builds up." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which complexes pump H⁺ across the membrane?", options:[
          { t:"I, III and IV", ok:true, why:"Complex II passes electrons on without pumping." },
          { t:"I, II, III and IV", why:"Complex II doesn’t pump." },
          { t:"Only IV", why:"I and III pump too." },
          { t:"II and IV", why:"II doesn’t pump; I and III do." }] },
        b:{ prompt:"Which two molecules shuttle electrons <strong>between</strong> the complexes?", options:[
          { t:"Ubiquinone (Q) and cytochrome <i>c</i>", ok:true, why:"Q moves within the membrane from I or II to III; cyt <i>c</i> moves on the intermembrane side from III to IV." },
          { t:"NADH and FADH₂", why:"They deliver electrons <strong>to</strong> the chain." },
          { t:"Complexes I and III", why:"They’re fixed in the membrane, not shuttles." },
          { t:"ATP synthase and O₂", why:"Neither shuttles electrons." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Into which compartment do the complexes pump H⁺?", options:[
          { t:"The intermembrane space", ok:true, why:"H⁺ is pumped out of the matrix and builds up between the membranes." },
          { t:"The matrix", why:"H⁺ is pumped out of the matrix." },
          { t:"The cytosol", why:"The outer membrane encloses the intermembrane space." },
          { t:"The thylakoid lumen", why:"That’s in chloroplasts." }] },
        b:{ prompt:"On which side of complex IV is water formed?", options:[
          { t:"The matrix side", ok:true, why:"O₂ takes H⁺ from the matrix." },
          { t:"The intermembrane-space side", why:M4 },
          { t:"Inside the outer membrane", why:"The outer membrane has no ETC." },
          { t:"In the cytosol", why:"Complex IV is in the inner membrane." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Rotenone blocks complex I. Mitochondria are given only NADH, then only succinate (an FADH₂ source). What happens to O₂ use?", options:[
          { t:"Zero with NADH; normal with succinate", ok:true, why:"FADH₂’s electrons enter at complex II, after the block." },
          { t:"Zero with both", why:"Succinate bypasses complex I." },
          { t:"Normal with both", why:"NADH must unload at complex I." },
          { t:"Normal with NADH; zero with succinate", why:"That reverses the routes." }] },
        b:{ prompt:"Antimycin A blocks complex III. Mitochondria are given only NADH, then only succinate. What happens to O₂ use?", options:[
          { t:"Zero with both", ok:true, why:"Both routes pass through complex III." },
          { t:"Zero with NADH; normal with succinate", why:"Succinate’s route also needs complex III." },
          { t:"Normal with both", why:"III is on both routes." },
          { t:"Normal with NADH; zero with succinate", why:"Both routes need III." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Using the model values (NADH 10 H⁺, FADH₂ 6 H⁺), how many H⁺ are pumped for 2 NADH and 2 FADH₂?", options:[
          { t:"32", ok:true, why:"20 + 12." },
          { t:"40", why:"FADH₂ isn’t worth 10." },
          { t:"20", why:"Add FADH₂’s 12." },
          { t:"24", why:"That counts each NADH as 6." }] },
        b:{ prompt:"Using the model values, how many H⁺ are pumped for 3 NADH and 1 FADH₂?", options:[
          { t:"36", ok:true, why:"30 + 6." },
          { t:"40", why:M3 },
          { t:"30", why:"Add FADH₂’s 6." },
          { t:"24", why:"That counts each NADH as 6." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A mutant cell has no cytochrome <i>c</i>. Which prediction is correct?", options:[
          { t:"Electrons from both NADH and FADH₂ stop at complex III; Q and complex III stay loaded; no O₂ is used", ok:true, why:"Cyt <i>c</i> is the only link from III to IV, and both routes need it." },
          { t:"Only NADH’s electrons are affected", why:"Both routes need cyt <i>c</i>." },
          { t:"Electrons skip to O₂ directly", why:"There’s no bypass." },
          { t:"Complex IV stays loaded", why:"IV gets no electrons, so it stays empty." }] },
        b:{ prompt:"A mutant cell has no ubiquinone (Q). Which prediction is correct?", options:[
          { t:"Electrons from both NADH and FADH₂ stop at complexes I and II; no O₂ is used", ok:true, why:"Q carries electrons from both I and II to III, so both routes stop before it." },
          { t:"FADH₂’s electrons still reach O₂", why:"FADH₂’s route also passes Q." },
          { t:"Only complex IV is affected", why:"IV gets no electrons." },
          { t:"Pumping continues at complex I", why:"Electrons can’t leave I, so pumping stops." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why electrons release energy in several small steps?", options:[
          { t:"“Each carrier holds electrons more tightly than the one before, so each move releases some energy. Small steps let the pumps capture energy instead of losing it all as heat.”", ok:true, why:"Electronegativity sets the steps, and small steps can be captured by pumps." },
          { t:"“Electrons are used up a little at each step.”", why:M5 },
          { t:"“Each complex makes ATP from the energy.”", why:M2 },
          { t:"“O₂ is added at each step.”", why:M1 }] },
        b:{ prompt:"Which is the best description of O₂’s role?", options:[
          { t:"“O₂ is the final electron acceptor. It combines with electrons and H⁺ to form water, which keeps the chain moving.”", ok:true, why:"Without an acceptor at the end, the whole chain backs up." },
          { t:"“O₂ is broken down into CO₂.”", why:M1 },
          { t:"“O₂ pumps H⁺ across the membrane.”", why:"Complexes I, III and IV pump." },
          { t:"“O₂ supplies electrons to complex I.”", why:"That reverses the flow." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which flow chart shows the path of electrons from NADH correctly?", options:[
          { t:"NADH → complex I → Q → complex III → cytochrome <i>c</i> → complex IV → O₂", ok:true, why:"NADH unloads at complex I; Q links I to III, and cyt <i>c</i> links III to IV." },
          { t:"NADH → complex II → Q → complex III → cytochrome <i>c</i> → complex IV → O₂", why:"That’s FADH₂’s entry point." },
          { t:"NADH → complex I → cytochrome <i>c</i> → complex III → Q → complex IV → O₂", why:"Q comes before III; cyt <i>c</i> after." },
          { t:"O₂ → complex IV → complex III → complex I → NADH", why:"That’s backwards." }] },
        b:{ prompt:"Which flow chart shows the path of electrons from FADH₂ correctly?", options:[
          { t:"FADH₂ → complex II → Q → complex III → cytochrome <i>c</i> → complex IV → O₂", ok:true, why:"FADH₂ unloads at complex II and skips complex I." },
          { t:"FADH₂ → complex I → Q → complex III → cytochrome <i>c</i> → complex IV → O₂", why:M3 },
          { t:"FADH₂ → complex II → cytochrome <i>c</i> → complex III → Q → complex IV → O₂", why:"Q then III, then cyt <i>c</i>." },
          { t:"FADH₂ → O₂ → complex IV → complex II", why:M1 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Carbon monoxide binds complex IV (as well as hemoglobin). Why do a CO-poisoned person’s cells make little ATP even when NADH is plentiful?", options:[
          { t:"Electrons can’t pass to O₂, so the chain backs up, pumping stops and no H⁺ gradient is built", ok:true, why:"With complex IV blocked, every carrier stays loaded and ATP synthase has no gradient to use." },
          { t:"CO uses up all the NADH", why:"NADH builds up, unused." },
          { t:"CO turns ATP into ADP", why:"CO doesn’t attack ATP." },
          { t:"CO blocks glycolysis", why:"The block is in the chain." }] },
        b:{ prompt:"Rotenone is used in fisheries management to remove invasive fish from a lake. Why does it kill fish?", options:[
          { t:"It blocks complex I, so NADH can’t unload; little H⁺ is pumped and ATP supply collapses", ok:true, why:"Most electron pairs come from NADH, so blocking complex I starves the gradient." },
          { t:"It removes O₂ from the water", why:"It blocks a complex; O₂ remains." },
          { t:"It blocks complex IV like cyanide", why:"Rotenone blocks complex I." },
          { t:"It stops the Krebs cycle from releasing CO₂", why:"Its first effect is in the chain." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"When soil is waterlogged and O₂ runs out, some soil bacteria pass electrons from their chain to nitrate (NO₃⁻) instead of O₂. Which prediction is best?", options:[
          { t:"They can keep the chain flowing and pumping H⁺ without O₂", ok:true, why:"Any final acceptor that takes the electrons keeps the chain from backing up." },
          { t:"They can’t make any ATP", why:"Another acceptor keeps the chain running." },
          { t:"They release O₂ from the nitrate", why:"Nitrate accepts electrons; it doesn’t release O₂." },
          { t:"They must stop glycolysis", why:"Glycolysis continues." }] },
        b:{ prompt:"In lake-bottom mud with no O₂, some bacteria pass electrons from their chain to sulfate (SO₄²⁻), making hydrogen sulfide. Which prediction is best?", options:[
          { t:"They keep an electron transport chain and H⁺ gradient running with no O₂", ok:true, why:"Sulfate takes O₂’s place as the final acceptor." },
          { t:"They make water from the sulfate", why:"The product is hydrogen sulfide, not water." },
          { t:"They can make ATP only by fermentation", why:"Their chain still runs." },
          { t:"They need cyanide to start the chain", why:"Cyanide is a poison." }] } }
    ]
  },
  task:{
    title:"Six pairs, one gradient",
    summary:"Six pairs, one gradient",
    statement:"<p>Design a feeding plan for isolated mitochondria that meets every condition. Can you find all the answers?</p>" +
      "<ol class=\"et-tlist\"><li>Exactly 3 O₂ are used.</li><li>Between 40 and 50 H⁺ are pumped (inclusive).</li><li>At least one FADH₂ is fed.</li></ol>" +
      "<p class=\"et-trule\"><strong>Model values:</strong> each NADH pair that flows pumps 10 H⁺, each FADH₂ pair 6 H⁺, and every pair that reaches O₂ uses ½ O₂. Rotenone stops NADH’s pairs; cyanide stops every pair.</p>",
    inputs:{
      n:{ label:"NADH fed", sym:"n", min:0, max:6 },
      f:{ label:"FADH₂ fed", sym:"f", min:0, max:6 }
    },
    blockers:[{ id:"none", t:"none" }, { id:"rot", t:"rotenone" }, { id:"cn", t:"cyanide" }],
    checks:["Exactly 3 O₂ used", "40 to 50 H⁺ pumped", "At least one FADH₂"],
    tips:[
      "Each pair uses ½ O₂. How many pairs must reach O₂?",
      "With no blocker, 6 pairs give 36 + 4<i>n</i> H⁺. Which <i>n</i> lands between 40 and 50?",
      "Rotenone stops NADH; cyanide stops everything."
    ],
    explainPrompt:"Explain how you used the O₂ count to fix the number of pairs, and why swapping NADH for FADH₂ changes the H⁺ count.",
    vocab:"Use the words final electron acceptor, complex I, FADH₂ and proton pump.",
    success:"Your feeding plan meets every condition!",
    more:"There’s more than one answer. Can you find another?",
    after3:"With 6 pairs, each NADH swapped for an FADH₂ costs 4 H⁺, the pump at complex I."
  },
  cards:[
    ["Electron transport chain", "Complexes I–IV plus Q and cytochrome <i>c</i> in the inner mitochondrial membrane."],
    ["NADH’s entry", "Complex I: electrons pass I → Q → III → cyt <i>c</i> → IV → O₂."],
    ["FADH₂’s entry", "Complex II → Q: it skips complex I’s pump."],
    ["Proton pumps", "Complexes I, III and IV pump H⁺ into the intermembrane space. II doesn’t."],
    ["Model H⁺ counts", "NADH → 10 H⁺; FADH₂ → 6 H⁺ (I: 4, III: 4, IV: 2)."],
    ["Final electron acceptor", "O₂: O₂ + 4e⁻ + 4H⁺ → 2H₂O, at complex IV."],
    ["Why steps?", "Each carrier is more electronegative; small energy drops can be captured by pumps."],
    ["No O₂", "Chain backs up; NAD⁺ and FAD aren’t regenerated; Krebs cycle and pumping stop."],
    ["Rotenone", "Blocks complex I; FADH₂ (succinate) can still feed the chain."],
    ["Cyanide, carbon monoxide", "Block complex IV: the whole chain stops."],
    ["ATP and the ETC", "The ETC makes no ATP itself; it builds the H⁺ gradient for ATP synthase."],
    ["Oxidative phosphorylation", "Making ATP using energy from the ETC, through chemiosmosis."]
  ]
};
