// SBI4U 04 Overview of Photosynthesis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/04-overview-of-photosynthesis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "¹⁸O in the water labels the O₂; ¹⁸O in the CO₂ doesn’t. The O₂ comes from splitting water.";
const M2 = "The Calvin cycle needs ATP and NADPH from the light reactions, so it stops soon after the light goes out.";
const M3 = "Most of a plant’s dry mass is carbon, and that carbon came from CO₂ in the air.";
const M4 = "The light reactions make ATP and NADPH, and they need NADP⁺ and ADP back from the Calvin cycle.";
const M5 = "Only the factor in shortest supply limits the rate. Adding more of something else does nothing.";
const M6 = "Energy is converted, not created: light energy becomes chemical energy, plus some heat.";
const M7 = "Enzymes speed up as it warms, up to an optimum; past it they lose their shape and the rate falls.";
const E1W = "¹⁸O-labelled CO₂ never labels the O₂.";
const E2W = "Without new ATP and NADPH it can’t continue.";
const E3W = "Flat means no change.";
const EQ = '<span class="bio-chem">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>';

export default {
  id:"04-overview-of-photosynthesis",
  kind:"topic",
  title:"Overview of photosynthesis",
  topic:"Overview of Photosynthesis",
  readyTopic:"the overview of photosynthesis",
  hero:{
    eq:'<span class="fz-heq"><span class="bio-chem">6CO₂ + 6H₂O</span> <span class="fz-harr"><small>light energy</small><span>→</span></span> <span class="bio-chem">C₆H₁₂O₆ + 6O₂</span></span>',
    eqLabel:"6 CO₂ plus 6 H₂O, powered by light energy, gives C₆H₁₂O₆ plus 6 O₂",
    eqSize:"sm",
    headline:"Two factories, one shared battery",
    text:"The <strong>light reactions</strong> turn light into chemical energy, charging up <strong>ATP</strong> and <strong>NADPH</strong> and releasing O₂ from water. The <strong>Calvin cycle</strong> spends that energy to build sugar from CO₂, then sends the empty carriers back. Neither stage can keep going without the other.",
    fig:{ html:'<div class="fz-hero" id="fz-hero" role="img" aria-label="Two stations joined by two conveyors. Left: Light reactions in the thylakoids. Light hits a stack of thylakoids, water molecules are split and O₂ bubbles drift away. Orange ATP and teal NADPH tokens roll along the top conveyor into the right station, the Calvin cycle in the stroma, where CO₂ joins a turning wheel and a small sugar block pops out. Grey ADP + Pᵢ and NADP⁺ tokens roll back along the lower conveyor to the light reactions."></div>' }
  },
  goals:[
    "I can write the overall equation for photosynthesis and name its two stages and where they happen.",
    "I can describe the inputs and outputs of the light reactions and the Calvin cycle, and explain how each stage depends on the other.",
    "I can use tracer evidence to show that the O₂ comes from water and the carbon in sugar comes from CO₂.",
    "I can describe photosynthesis as an energy conversion, using the laws of thermodynamics.",
    "I can identify the limiting factor from a graph and predict the effect of changing light, CO₂ or temperature."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Chloroplast parts", goal:1,
          prompt:"Where in the chloroplast is light absorbed?",
          options:[
            { t:"In the thylakoid membranes", ok:true, why:"Photosystems sit there (module 03)." },
            { t:"In the stroma", why:"The stroma holds enzymes, not chlorophyll." },
            { t:"In the outer membrane", why:"The envelope has no photosystems." },
            { t:"In the stoma", why:"A stoma is a leaf pore." }],
          hints:["Where are the photosystems?", "In the stacked sacs.", "Thylakoid membranes."] },
        { id:"w2", skill:"Chloroplast parts", goal:1,
          prompt:"Where in the chloroplast is CO₂ turned into sugar?",
          options:[
            { t:"In the stroma", ok:true, why:"The enzymes, including rubisco, are there." },
            { t:"In the thylakoid lumen", why:"The lumen is inside the thylakoids, where H⁺ collects." },
            { t:"In the thylakoid membranes", why:"The membranes capture light." },
            { t:"In the outer membrane", why:"The envelope just encloses everything." }],
          hints:["Sugar-making enzymes are dissolved in a fluid.", "Which fluid surrounds the thylakoids?", "The stroma."] },
        { id:"w3", skill:"Equations and isotopes", goal:1,
          prompt:"In " + EQ + ", how many oxygen atoms are on each side?",
          options:[
            { t:"18", ok:true, why:"Left: 12 + 6. Right: 6 + 12." },
            { t:"12", why:"Count the O in both CO₂ and H₂O." },
            { t:"24", why:"That double-counts the water." },
            { t:"9", why:"Multiply by the coefficients." }],
          hints:["Each CO₂ has 2 O; each H₂O has 1.", "Left: 6 × 2 + 6 × 1.", "18 on each side."] },
        { id:"w4", skill:"Equations and isotopes", goal:3,
          prompt:"¹⁸O and ¹⁶O are isotopes of oxygen. This means they…",
          options:[
            { t:"are the same element with different numbers of neutrons", ok:true, why:"So ¹⁸O behaves the same chemically but can be detected by its mass." },
            { t:"have different numbers of protons", why:"Then they’d be different elements." },
            { t:"are different elements", why:"Both are oxygen." },
            { t:"have different numbers of electrons", why:"That would make them ions." }],
          hints:["What defines an element?", "Its number of protons.", "Isotopes differ only in neutrons."] },
        { id:"w5", skill:"Energy and graphs", goal:5,
          prompt:"A graph of rate vs light intensity rises, then levels off. In the flat part, more light will…",
          options:[
            { t:"have no effect on the rate", ok:true, why:"Something else is now limiting." },
            { t:"raise the rate a little", why:"Flat means no change." },
            { t:"lower the rate", why:"Flat, not falling." },
            { t:"double the rate", why:"That’s only true on the rising part, if at all." }],
          hints:["What does a flat line mean?", "No change in rate.", "No effect."] },
        { id:"w6", skill:"Energy and graphs", goal:4,
          prompt:"Energy can’t be created or destroyed, only converted. Which describes photosynthesis?",
          options:[
            { t:"Light energy is converted to chemical energy in sugar, with some lost as heat", ok:true, why:"Light goes in; it ends up as chemical energy in sugar, plus heat." },
            { t:"Energy is created from water and CO₂", why:"Energy is never created." },
            { t:"Chemical energy is converted to light", why:"That’s the reverse." },
            { t:"Sugar is converted to light energy", why:"Sugar is made, not used up." }],
          hints:["What energy goes in?", "Light.", "It ends up as chemical energy in sugar, plus heat."] }
      ],
      refreshers:{
        "Chloroplast parts":"Light is captured in the thylakoid membranes; sugar is built in the stroma around them.",
        "Equations and isotopes":"Count atoms on each side using the coefficients. Isotopes such as ¹⁸O are the same element with extra neutrons, so they can trace atoms through a reaction.",
        "Energy and graphs":"Energy is converted, never created. On a rate graph, a flat part means the factor on the horizontal axis is no longer limiting."
      }
    }
  },
  explore:{
    heading:"Two-stage factory",
    intro:"Run the chloroplast’s two stages as linked stations. Change the light, the CO₂ and the water, and watch what piles up and what runs out. Then label atoms to see where they go.",
    modelNote:"Numbers are model values (Blackman’s limiting-factor model). Play runs 1 model minute in 4 seconds.",
    // Atom tracker label chips and results (plan: Atom tracker outcomes)
    labels:[
      { id:"w18", t:"¹⁸O in water", log:"¹⁸O in water: every O₂ labelled; the glucose and the new water unlabelled", last:"¹⁸O water → O₂ labelled" },
      { id:"c18", t:"¹⁸O in CO₂", log:"¹⁸O in CO₂: the glucose and the new water labelled; the O₂ never labelled", last:"¹⁸O CO₂ → glucose and new water labelled, O₂ not" },
      { id:"c14", t:"¹⁴C in CO₂", log:"¹⁴C in CO₂: the sugar labelled", last:"¹⁴C CO₂ → sugar labelled" }
    ],
    conclusions:[
      { id:"water", t:"The O₂ comes from water" },
      { id:"co2", t:"The O₂ comes from CO₂" },
      { id:"both", t:"The O₂ comes from both" }
    ],
    predIntro:"Make a prediction first. Then the factory will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"The factory runs at light 100% and CO₂ 100%. Then the light goes to 0. What will the Calvin cycle do over the next minute?",
        options:[
          { t:"Keep going briefly, then stop when the ATP and NADPH run out", ok:true },
          { t:"Speed up, because it’s the ‘dark reactions’" },
          { t:"Keep going all night" },
          { t:"Start making O₂" }],
        explain:"The Calvin cycle doesn’t need light directly, but it needs the light reactions’ products.",
        start:{ mode:"factory", light:100, co2:100, water:true }, to:{ light:0 } },
      { id:"p2", prompt:"Atom tracker: the water is labelled with ¹⁸O. Where will the ¹⁸O end up?",
        options:[
          { t:"In the O₂", ok:true },
          { t:"In the glucose" },
          { t:"In the CO₂" },
          { t:"In the ATP" }],
        explain:"Splitting water releases its oxygen as O₂.",
        start:{ mode:"tracker", label:"w18" } },
      { id:"p3", prompt:"The factory runs at full. Then the CO₂ supply goes to 0. What happens to O₂ release over the next minute?",
        options:[
          { t:"It falls to zero", ok:true },
          { t:"It rises" },
          { t:"It stays the same, because the light reactions don’t use CO₂" },
          { t:"It stops immediately" }],
        explain:"With nothing spending ATP and NADPH, there’s no NADP⁺ left to take electrons, so the light reactions stall.",
        start:{ mode:"factory", light:100, co2:100, water:true }, to:{ co2:0 } },
      { id:"p4", prompt:"Light 100%, CO₂ 30%. What sets the rate now?",
        options:[
          { t:"CO₂", ok:true },
          { t:"Light" },
          { t:"Both equally" },
          { t:"Neither: it’s at maximum" }],
        explain:"The factor in shortest supply sets the pace.",
        start:{ mode:"factory", light:100, co2:100, water:true }, to:{ co2:30 } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"With the light at 100%, make the factory produce exactly 0.5 glucose per minute.",
        why:"With the light at 100%, CO₂ at 50% is in shortest supply, so the rate is half the maximum: 0.5 glucose per minute.",
        hints:["0.5 glucose per minute is half the maximum rate.", "With light at 100%, something else must be at half.", "CO₂ at 50%."] },
      { id:"tc2", goal:[2, 5], prompt:"Release 3 O₂ per minute using the <strong>least</strong> light possible.",
        why:"Light at 50% sets the rate at half the maximum, 3 O₂ per minute, as long as CO₂ doesn’t drop below it.",
        hints:["3 O₂ per minute is half of the maximum 6.", "Light must be at least 50%, and CO₂ must not drop below it.", "Light 50%, CO₂ 50% or more."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Use the atom tracker to <strong>prove</strong> that the O₂ comes from water and not from CO₂. Run the experiments you need, then choose the conclusion.",
        why:"Only the water run labels the O₂, and the CO₂ run never does.",
        general:"Run the experiments you need in Atom tracker mode, then choose the conclusion under the results log.",
        hints:["You need to label each possible source in turn.", "Label water’s oxygen in one run and CO₂’s oxygen in another.", "Only the water run labels the O₂."] }
    ]
  },
  part3:{
    slug:"limiting", name:"Limiting factors", heading:"Limiting factors",
    intro:"The factory showed Blackman’s idea with sliders. Here it is as data graphs, with temperature added. For each graph, read the curves, then tap the part the task asks about.",
    // Model graphs (plan: "Check it with data"). Region boxes are in data units; "answer" lists the region(s) that meet each task.
    graphs:[
      { id:"g1", title:"Graph 1: rate vs light intensity at two CO₂ levels",
        legend:"Solid: high CO₂ (0.12%). Dashed: low CO₂ (0.04%). Rate = the smaller of 0.06 × light % and the CO₂ ceiling (3 at low CO₂, 6 at high CO₂), in model O₂ units per minute.",
        regions:[
          { id:"rise", name:"the shared rising part (both curves, light 0–50%)" },
          { id:"loFlat", name:"the flat part of the low-CO₂ curve (light above 50%)" },
          { id:"hiRise", name:"the high-CO₂ curve above 50% light" }],
        tasks:[
          { id:"g1a", prompt:"Tap where <strong>light</strong> is limiting.", answer:["rise", "hiRise"],
            fb:{ rise:"Both curves rise together here: more light raises the rate, so light is limiting.", hiRise:"The high-CO₂ curve is still rising here, so light is limiting. Light also limits both curves on the shared rising part, 0–50%.",
              loFlat:"The low-CO₂ curve is flat there: more light does nothing, so light isn’t the limit." } },
          { id:"g1b", prompt:"Tap where <strong>CO₂</strong> is limiting.", answer:["loFlat"],
            fb:{ loFlat:"The low-CO₂ curve is flat above 50%: more light does nothing, but more CO₂ lifts the curve.",
              rise:"Both curves are the same there: light is limiting, so the extra CO₂ makes no difference.", hiRise:"That curve is still rising with light, so light is limiting there." } }],
        explain:{ id:"g1x", prompt:"Explain why the high-CO₂ curve keeps rising to 100%.", model:"More CO₂ lifts the ceiling, so light stays limiting longer." },
        table:{ head:["Light (%)", "Rate, low CO₂", "Rate, high CO₂"], rows:[["0", "0", "0"], ["25", "1.5", "1.5"], ["50", "3", "3"], ["75", "3", "4.5"], ["100", "3", "6"]] } },
      { id:"g2", title:"Graph 2: rate vs CO₂ concentration in dim and bright light",
        legend:"Solid: bright light (100%). Dashed: dim light (25%). Rate = the smaller of 75 × CO₂ % and the light ceiling (1.5 in dim light, 6 in bright light).",
        regions:[
          { id:"rise", name:"the shared rising part (both curves, CO₂ 0–0.02%)" },
          { id:"dimFlat", name:"the flat part of the dim-light curve" },
          { id:"brightRise", name:"the rising part of the bright-light curve (CO₂ 0.02–0.08%)" },
          { id:"brightFlat", name:"the flat part of the bright-light curve" }],
        tasks:[
          { id:"g2a", prompt:"Tap the part of the <strong>dim-light</strong> curve where extra CO₂ can’t help.", answer:["dimFlat"],
            fb:{ dimFlat:"The dim-light curve flattens early: in dim light, extra CO₂ can’t help; light is the limit.",
              rise:"There, more CO₂ still raises the rate: CO₂ is limiting.", brightRise:"That’s the bright-light curve, and it’s still rising with CO₂.", brightFlat:"That’s the bright-light curve. Find the dim-light one (dashed)." } }],
        table:{ head:["CO₂ (%)", "Rate, dim light", "Rate, bright light"], rows:[["0", "0", "0"], ["0.02", "1.5", "1.5"], ["0.04", "1.5", "3"], ["0.08", "1.5", "6"], ["0.12", "1.5", "6"]] } },
      { id:"g3", title:"Graph 3: rate vs temperature (bright light, high CO₂)",
        legend:"Model points for a temperate (C3) plant, in model O₂ units per minute.",
        points:[[5, 1.0], [15, 3.0], [25, 5.0], [30, 5.5], [35, 4.5], [45, 1.0]],
        tasks:[
          { id:"g3a", prompt:"Tap the <strong>optimum</strong>.", answer:["t30"],
            fb:{ t30:"The rate peaks at 30 °C: that’s the optimum temperature.",
              t25:"The rate is still rising at 25 °C: the peak comes later.", t35:"The rate has already started to fall at 35 °C.", t5:"That’s the lowest rate. Find the highest point.", t15:"The rate is still rising there. Find the highest point.", t45:"That’s where the rate has fallen. Find the highest point." } }],
        table:{ head:["Temperature (°C)", "Rate"], rows:[["5", "1.0"], ["15", "3.0"], ["25", "5.0"], ["30", "5.5"], ["35", "4.5"], ["45", "1.0"]] },
        zoom:{ title:"Zoom to the molecules",
          intro:"A Calvin-cycle enzyme (rubisco) at work. Choose a temperature.",
          cool:"Warmer molecules move faster and reach the enzyme’s active site more often, so the rate rises, up to the optimum.",
          hot:"Past the optimum, the enzyme starts to lose its shape: the active site no longer fits CO₂ well, so the rate falls.",
          preview:"Coming in module 09: rubisco grabs O₂ more often as it warms." } }
    ],
    quickCheck:{
      title:"Quick check", summary:"Limiting factors quick check",
      items:[
        { id:"q1", goal:5, prompt:"Graph 1, low CO₂, light 80%. What limits the rate?",
          choices:[{ t:"CO₂", ok:true, fb:"The low-CO₂ curve is flat there." },
            { t:"Light", fb:"The low-CO₂ curve is flat there." },
            { t:"Temperature", fb:"The low-CO₂ curve is flat there." },
            { t:"Nothing", fb:"The low-CO₂ curve is flat there." }] },
        { id:"q2", goal:5, prompt:"Graph 1, light 30%. Will raising CO₂ help?",
          choices:[{ t:"No", ok:true, fb:"Both curves are the same at 30%: light is limiting." },
            { t:"Yes, a lot", fb:"Both curves are the same at 30%: light is limiting." },
            { t:"Yes, a little", fb:"Both curves are the same at 30%: light is limiting." },
            { t:"Only at night", fb:"Both curves are the same at 30%: light is limiting." }] },
        { id:"q3", goal:5, prompt:"Graph 3: why does the rate fall above 30 °C?",
          choices:[{ t:"Enzymes start to lose their shape", ok:true, fb:M7 },
            { t:"Light gets weaker", fb:M7 },
            { t:"CO₂ disappears", fb:M7 },
            { t:"Water freezes", fb:M7 }] },
        { id:"q4", goal:5, prompt:"Blackman’s rule in one line:",
          choices:[{ t:"The rate is set by the factor in shortest supply", ok:true, fb:"Raise the limiting factor, not the others." },
            { t:"All factors add together", fb:"Raise the limiting factor, not the others." },
            { t:"Light always limits", fb:"Raise the limiting factor, not the others." },
            { t:"Temperature always limits", fb:"Raise the limiting factor, not the others." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"stage", type:"sorter", title:"Which stage?", summary:"Which stage?", goal:[1, 2], noun:"card", txt:true,
        instruction:"Sort each process or molecule by the stage it belongs to.",
        boxes:[
          { id:"b1", label:"Light reactions only" },
          { id:"b2", label:"Calvin cycle only" },
          { id:"b3", label:"Both", sub:"made in one stage, used in the other" }],
        items:[
          { id:"i1", t:"H₂O is split", answer:"b1", why:"Water is split in the light reactions, on the thylakoid membranes." },
          { id:"i2", t:"O₂ is released", answer:"b1", why:"O₂ comes from splitting water in the light reactions.", wrong:{ b2:"O₂ comes from splitting water in the light reactions." } },
          { id:"i3", t:"Light is absorbed", answer:"b1", why:"Photosystems in the thylakoid membranes absorb the light." },
          { id:"i4", t:"Chlorophyll", answer:"b1", why:"Chlorophyll sits in the photosystems of the thylakoid membranes." },
          { id:"i5", t:"CO₂ is fixed", answer:"b2", why:"Rubisco fixes CO₂ in the stroma, in the Calvin cycle." },
          { id:"i6", t:"Rubisco", answer:"b2", why:"Rubisco is the Calvin cycle’s CO₂-fixing enzyme, in the stroma." },
          { id:"i7", t:"G3P (sugar) is built", answer:"b2", why:"The Calvin cycle spends ATP and NADPH to build G3P." },
          { id:"i8", t:"ATP", answer:"b3", why:"ATP is made in the light reactions and spent in the Calvin cycle.", wrong:{ b1:"ATP is made in the light reactions <strong>and</strong> spent in the Calvin cycle." } },
          { id:"i9", t:"NADPH", answer:"b3", why:"NADPH is made in the light reactions and spent in the Calvin cycle." },
          { id:"i10", t:"NADP⁺", answer:"b3", why:"Made empty in the Calvin cycle, refilled in the light reactions.", wrong:{ b2:"It’s released by the Calvin cycle and picked up by the light reactions." },
            hints:["What happens to NADPH after the Calvin cycle uses it?", "It becomes NADP⁺ again.", "Made empty in the Calvin cycle, refilled in the light reactions: Both."] },
          { id:"i11", t:"ADP + Pᵢ", answer:"b3", why:"Released by the Calvin cycle and recharged to ATP in the light reactions." }],
        wrongDefault:"Ask: where is it made, and where is it used?" },
      { id:"puzzles", type:"custom", title:"Factory and tracer puzzles", summary:"Factory and tracer puzzles", star:true, goal:[2, 3, 4, 5],
        instruction:"Six puzzles from the factory and the tracer experiments. The last four are non-routine (★).",
        items:[
          { id:"f1", kind:"num", goal:2, prompt:"How many O₂ molecules are released for each glucose made?",
            answer:6, display:"6 O₂ per glucose", unit:"O₂",
            why:"12 split water molecules give 12 O atoms: 6 O₂.",
            wrong:[{ match:12, fb:"12 water molecules are split, but each O₂ needs 2 O atoms." }],
            general:"Use the factory’s numbers at full rate: O₂ released and glucose made per minute.",
            hints:["Look at the factory’s numbers per minute at full rate.", "At full rate: 6 O₂ released and 1 glucose made.", "6 O₂ for each glucose."] },
          { id:"f2", kind:"num", goal:5, prompt:"Light 70%, CO₂ 40%. Rate, as a percentage of the maximum?",
            answer:40, display:"40% of the maximum", unit:"%",
            why:"CO₂ is in shorter supply, so it sets the rate.",
            wrong:[{ match:70, fb:"The lower factor sets the rate." }],
            general:M5,
            hints:["Which factor is in shorter supply?", "CO₂ at 40% is lower than light at 70%.", "The rate is 40% of the maximum."] },
          { id:"f3", kind:"pair", goal:2, star:true, prompt:"A plant releases 18 O₂ molecules. How many glucose molecules can it make, and how many water molecules were split?",
            labels:["Glucose molecules", "Water molecules split"], answer:[3, 36], display:"3 glucose; 36 water",
            why:"18 ÷ 6 = 3 glucose, and 3 × 12 = 36 water molecules split.",
            wrongB:[{ match:18, fb:"12 water molecules are split per glucose (6 O₂), so 3 × 12 = 36." }],
            general:"Use the full equation: 6 O₂ are released and 12 water molecules are split for each glucose.",
            hints:["6 O₂ per glucose.", "18 ÷ 6 = 3 glucose.", "Each glucose needs 12 water split: 36."] },
          { id:"f4", kind:"sel", goal:3, star:true, prompt:"CO₂ labelled with ¹⁸O is supplied. Select <strong>all</strong> the molecules that will carry the label.",
            options:[
              { t:"glucose", ok:true, why:"" },
              { t:"water made by the Calvin cycle", ok:true, why:"" },
              { t:"O₂", why:"O₂’s oxygen comes only from the split water." },
              { t:"ATP", why:"ATP isn’t built from CO₂’s atoms." }],
            why:"CO₂’s oxygen ends up in the glucose and in the new water. O₂’s oxygen comes only from the split water.",
            hints:["Where does each atom in CO₂ go in the Calvin cycle?", "CO₂’s oxygen ends up in the sugar and in the new water the Calvin cycle makes.", "Glucose and the water made by the Calvin cycle; never the O₂."] },
          { id:"f5", kind:"mc", goal:5, star:true, prompt:"Ontario greenhouse growers often raise CO₂ to two or three times the outdoor level. On a dull winter day this barely helps. Why?",
            options:[
              { t:"Light is the limiting factor on dull days", ok:true, why:"Raise the factor that’s actually limiting." },
              { t:"CO₂ is harmful in winter", why:"Raise the factor that’s actually limiting." },
              { t:"The Calvin cycle stops in winter", why:"Raise the factor that’s actually limiting." },
              { t:"Plants can’t absorb CO₂ in cold air", why:"Raise the factor that’s actually limiting." }],
            hints:["What limits the rate on a dull day?", "Light is in short supply, so more CO₂ can’t help.", "Light is the limiting factor on dull days."] },
          { id:"f6", kind:"numch", goal:4, star:true, prompt:"Making 1 mol of glucose stores about 2870 kJ. A leaf absorbed about 9570 kJ of light to make it. What percentage of the absorbed energy was stored, and where did the rest go?",
            label:"Percentage stored:", unit:"%", answer:30, tol:1, display:"about 30% stored; the rest was lost as heat",
            chipLabel:"The rest of the energy was…",
            options:[
              { t:"converted to heat", ok:true, why:"" },
              { t:"destroyed", why:"Not destroyed: converted to heat." }],
            why:"2870 ÷ 9570 ≈ 0.30, so about 30% was stored. The rest became heat (second law).",
            wrong:[{ match:70, fb:"That’s the share lost." }],
            general:"Stored ÷ absorbed × 100.",
            hints:["Stored ÷ absorbed × 100.", "2870 ÷ 9570 ≈ 0.30.", "About 30% stored; the rest became heat (second law)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Aurora", how:"",
        instruction:"Aurora made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Explain where the O₂ from photosynthesis comes from.",
            steps:["The overall equation is " + EQ + ".", "CO₂ is split, so its oxygen is released as O₂ and its carbon goes into glucose.", "Water provides hydrogen for the glucose.", "So all the O₂ comes from CO₂."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct, but the mistake is earlier.", "Step 4 follows step 2."],
            fixes:[
              { t:"Water is split in the light reactions; its oxygen is released as O₂, and CO₂’s carbon goes into glucose.", ok:true, why:E1W },
              { t:"Glucose is split to release O₂.", why:E1W },
              { t:"O₂ comes half from water, half from CO₂.", why:E1W },
              { t:"Step 2 is correct.", why:E1W }],
            hints:["What did the ¹⁸O experiments show?", "Labelled water gave labelled O₂.", "Water is split."] },
          { id:"e2", goal:2, task:"Explain what happens to the Calvin cycle at night.",
            steps:["The Calvin cycle doesn’t absorb light itself.", "It uses ATP and NADPH made by the light reactions.", "At night the light reactions stop.", "So the Calvin cycle keeps running all night: that’s why it’s called the dark reactions."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"So the Calvin cycle stops once its stocks of ATP and NADPH run out.", ok:true, why:E2W },
              { t:"So the Calvin cycle switches to using O₂.", why:E2W },
              { t:"So the Calvin cycle speeds up at night.", why:E2W },
              { t:"Step 4 is correct.", why:E2W }],
            hints:["Steps 2 and 3 together: what runs out?", "ATP and NADPH.", "It stops."] },
          { id:"e3", goal:5, task:"Interpret a graph of rate vs light that levels off at high light.",
            steps:["At low light, the rate rises steadily as light increases.", "So at low light, light is the limiting factor.", "At high light the curve is flat, so light is no longer limiting.", "So adding even more light will still raise the rate slightly."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"So adding more light won’t change the rate; raise the limiting factor (such as CO₂) instead.", ok:true, why:E3W },
              { t:"So the plant is dying at high light.", why:E3W },
              { t:"So light is still the main limit.", why:E3W },
              { t:"Step 4 is correct.", why:E3W }],
            hints:["What does a flat line mean?", "More light, same rate.", "Find and raise the real limit."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the factory: how fast the Calvin cycle stopped in the dark, or how cutting CO₂ stopped the O₂?" },
      { id:"j2", q:"In your own words, why do the two stages need each other?" },
      { id:"j3", q:"Explain to a friend how the ¹⁸O experiments show where the O₂ comes from." },
      { id:"j4", q:"Which idea about limiting factors are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which equation summarizes photosynthesis?", options:[
          { t:'<span class="bio-chem">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>', ok:true, why:"CO₂ and water go in; glucose and O₂ come out, powered by light." },
          { t:'<span class="bio-chem">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O</span>', why:"That’s cellular respiration." },
          { t:'<span class="bio-chem">6CO₂ + 6O₂ → C₆H₁₂O₆ + 6H₂O</span>', why:"O₂ is a product, not a reactant." },
          { t:'<span class="bio-chem">C₆H₁₂O₆ + 6H₂O → 6CO₂ + 6O₂</span>', why:"Glucose is made, not used." }] },
        b:{ prompt:"Which pair correctly matches each stage to its location?", options:[
          { t:"Light reactions: thylakoid membranes; Calvin cycle: stroma", ok:true, why:"Light is captured in the thylakoid membranes; sugar is built in the stroma around them." },
          { t:"Light reactions: stroma; Calvin cycle: thylakoid membranes", why:"Reversed." },
          { t:"Both stages: stroma", why:"The light reactions need the membrane-bound photosystems." },
          { t:"Light reactions: stomata; Calvin cycle: stroma", why:"Stomata are leaf pores." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which two products of the light reactions does the Calvin cycle use?", options:[
          { t:"ATP and NADPH", ok:true, why:"The Calvin cycle spends ATP and NADPH to turn CO₂ into sugar." },
          { t:"O₂ and glucose", why:"O₂ is released; glucose is the Calvin cycle’s product." },
          { t:"CO₂ and water", why:"CO₂ comes from the air; water is used by the light reactions." },
          { t:"ADP and NADP⁺", why:"Those go the other way, back to be recharged." }] },
        b:{ prompt:"Which molecules does the Calvin cycle send back to the light reactions?", options:[
          { t:"ADP (with Pᵢ) and NADP⁺", ok:true, why:"The empty carriers go back to the light reactions to be recharged." },
          { t:"ATP and NADPH", why:"Those come <strong>from</strong> the light reactions." },
          { t:"O₂ and water", why:"O₂ leaves the leaf." },
          { t:"Glucose and CO₂", why:"Glucose is exported; CO₂ is used up." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"On a graph of rate vs light intensity, the curve rises, then levels off. What limits the rate in the flat part?", options:[
          { t:"Some other factor, such as CO₂ concentration or temperature", ok:true, why:"Light no longer limits the rate there, so something else does." },
          { t:"Light intensity", why:"More light no longer helps there." },
          { t:"Nothing: the plant has reached its absolute maximum", why:"Raising CO₂ usually lifts the plateau." },
          { t:"Water, always", why:"Water could be one possibility, not always." }] },
        b:{ prompt:"On a graph of rate vs CO₂ concentration, what limits the rate in the steep, rising part?", options:[
          { t:"CO₂ concentration", ok:true, why:"In the rising part, more CO₂ raises the rate, so CO₂ is limiting." },
          { t:"Light intensity", why:"In the rising part, more CO₂ raises the rate, so CO₂ is limiting." },
          { t:"Temperature", why:"Temperature isn’t changing along this graph; more CO₂ raises the rate, so CO₂ is limiting." },
          { t:"Chlorophyll", why:"Chlorophyll isn’t on this graph." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"In one experiment the water contained ¹⁸O; in another, the CO₂ did. Labelled O₂ appeared only in the first. What does this show?", options:[
          { t:"The O₂ released comes from water.", ok:true, why:"¹⁸O in the water labels the O₂; ¹⁸O in the CO₂ doesn’t." },
          { t:"The O₂ comes from CO₂.", why:M1 },
          { t:"The O₂ comes equally from water and CO₂.", why:"The CO₂ run gave no labelled O₂." },
          { t:"The O₂ comes from glucose.", why:"Glucose is a product." }] },
        b:{ prompt:"CO₂ labelled with ¹⁴C is supplied to a plant in light. Where will the ¹⁴C end up?", options:[
          { t:"In sugars made in the stroma", ok:true, why:"The carbon in sugar comes from CO₂, fixed in the stroma by the Calvin cycle." },
          { t:"In the O₂ released", why:"O₂ contains no carbon." },
          { t:"In the water released", why:"Water contains no carbon." },
          { t:"In the ATP", why:"ATP isn’t built from CO₂’s carbon." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"A plant in bright light suddenly has its CO₂ supply cut off. What happens to its O₂ release over the next few minutes, and why?", options:[
          { t:"It falls, because unused ATP and NADPH pile up and the light reactions run out of NADP⁺ and ADP.", ok:true, why:"With nothing spending ATP and NADPH, there’s no NADP⁺ left to take electrons, so the light reactions stall." },
          { t:"It rises, because the light reactions no longer have to share energy.", why:"The stages depend on each other." },
          { t:"It stays the same, because the light reactions don’t use CO₂.", why:M4 },
          { t:"It stops instantly, because CO₂ is split to make O₂.", why:M1 }] },
        b:{ prompt:"A plant’s light is switched off. What happens to its CO₂ uptake over the next few minutes, and why?", options:[
          { t:"It falls to zero once the Calvin cycle uses up its stored ATP and NADPH.", ok:true, why:"The Calvin cycle runs on its stock of ATP and NADPH briefly, then stops." },
          { t:"It rises, because the Calvin cycle is the dark reaction.", why:M2 },
          { t:"It stays the same, because the Calvin cycle doesn’t need light.", why:M2 },
          { t:"It stops instantly, because CO₂ can’t enter in the dark.", why:"Stomata aren’t the issue; the cycle runs out of fuel." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"At 20 °C, raising CO₂ from 0.04% to 0.1% doubles a crop’s rate in bright light but has no effect in dim light. Which explanation fits?", options:[
          { t:"In dim light, light is the limiting factor, so extra CO₂ can’t help.", ok:true, why:"Only the factor in shortest supply limits the rate." },
          { t:"CO₂ is harmful in dim light.", why:"There’s no evidence of harm, just no gain." },
          { t:"Temperature is limiting in dim light.", why:"Temperature is the same in both." },
          { t:"CO₂ only works at night.", why:M2 }] },
        b:{ prompt:"At 30 °C in bright light, adding more light has no effect, but adding CO₂ raises the rate. What was limiting?", options:[
          { t:"CO₂ concentration", ok:true, why:"Adding CO₂ raised the rate, so CO₂ was in shortest supply." },
          { t:"Light intensity", why:"More light did nothing." },
          { t:"Temperature", why:"Changing CO₂ alone helped." },
          { t:"Chlorophyll", why:"Raising CO₂ wouldn’t help if chlorophyll were the limit." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which statement best describes photosynthesis in terms of energy?", options:[
          { t:"“Light energy is converted into chemical energy stored in sugar; some is lost as heat, and no energy is created.”", ok:true, why:"That’s the first law (energy is converted) and the second law (some becomes heat) together." },
          { t:"“Photosynthesis creates energy from water and CO₂.”", why:M6 },
          { t:"“Photosynthesis converts chemical energy into light.”", why:"That’s backwards." },
          { t:"“Photosynthesis turns matter into energy.”", why:"Matter and energy are both conserved here." }] },
        b:{ prompt:"A leaf stores less energy in sugar than the light energy it absorbs. Which statement best explains why?", options:[
          { t:"“No energy conversion is 100% efficient: some energy always becomes heat (the second law of thermodynamics).”", ok:true, why:"The missing energy wasn’t lost from the universe; it became heat." },
          { t:"“The missing energy is destroyed.”", why:M6 },
          { t:"“The missing energy is stored as O₂.”", why:"O₂ isn’t an energy store here." },
          { t:"“The leaf creates new energy later.”", why:M6 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which flow chart best shows how the two stages depend on each other?", options:[
          { t:"Light + water → light reactions → ATP and NADPH → Calvin cycle (+ CO₂) → sugar; ADP, Pᵢ and NADP⁺ return to the light reactions", ok:true, why:"Each stage feeds the other: charged carriers go one way, empty ones come back." },
          { t:"Light → Calvin cycle → ATP → light reactions → sugar", why:"The order is reversed." },
          { t:"Light reactions → sugar; Calvin cycle → O₂", why:"The light reactions make ATP and NADPH, not sugar, and the O₂ comes from splitting water in the light reactions." },
          { t:"CO₂ → light reactions → O₂; water → Calvin cycle → sugar", why:M1 }] },
        b:{ prompt:"Which statement best explains why ‘dark reactions’ is a misleading name for the Calvin cycle?", options:[
          { t:"“It doesn’t absorb light, but it needs ATP and NADPH from the light reactions, so it runs in daylight.”", ok:true, why:"Not absorbing light isn’t the same as working in the dark." },
          { t:"“It only runs at night.”", why:M2 },
          { t:"“It actually absorbs light with rubisco.”", why:"Rubisco is an enzyme, not a pigment." },
          { t:"“It makes the light reactions run.”", why:"It recharges nothing; it spends." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"On a sunny February day, a Leamington greenhouse is at 25 °C with outdoor-level CO₂. Which change would raise tomato growth the most?", options:[
          { t:"Add CO₂", ok:true, why:"Light and temperature are good, so CO₂ is the likely limit." },
          { t:"Add more lamps", why:"It’s already sunny." },
          { t:"Heat the greenhouse to 40 °C", why:"Above the optimum, enzymes lose their shape." },
          { t:"Mist water vapour into the air", why:"Water isn’t likely limiting." }] },
        b:{ prompt:"On a dull, cloudy February day, the same greenhouse is at 25 °C with extra CO₂. Which change would help most?", options:[
          { t:"Add lamps", ok:true, why:"Light is the limiting factor." },
          { t:"Add even more CO₂", why:M5 },
          { t:"Heat the greenhouse to 40 °C", why:M7 },
          { t:"Cool the greenhouse to 10 °C", why:"Colder slows the enzymes." }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"A willow tree gains 70 kg over five years, but its soil loses only a few grams. Where did most of the new mass come from?", options:[
          { t:"CO₂ from the air, built into sugars and cellulose, along with water", ok:true, why:M3 },
          { t:"The soil", why:"The soil hardly changed." },
          { t:"Sunlight", why:"Light carries energy but no mass." },
          { t:"Fertilizer", why:"The soil lost only grams." }] },
        b:{ prompt:"A 2 g seed grows into a 2 kg squash plant in a pot of soil. Most of the plant’s dry mass (everything except water) came from…", options:[
          { t:"CO₂ from the air", ok:true, why:"Carbon makes up most of the dry mass, and it’s fixed from CO₂ in the air." },
          { t:"The soil", why:M3 },
          { t:"Sunlight", why:"Light carries energy but no mass." },
          { t:"Water only", why:"Water adds hydrogen and oxygen, but the carbon skeleton comes from CO₂." }] } }
    ]
  },
  task:{
    title:"Tune the greenhouse", summary:"Tune the greenhouse",
    statement:"<p>Choose the light, CO₂ and temperature for a greenhouse so the plants grow well without wasting money. Can you find all the answers?</p><ol class=\"gh-conds\"><li>Growth of at least 0.5 glucose units per minute.</li><li>No resource wasted: light and CO₂ set to the same level.</li><li>Running cost of 7 or less.</li></ol>",
    lights:[25, 50, 75, 100], co2s:[25, 50, 75, 100], temps:[15, 20, 25, 30, 35],
    tfac:{ "15":0.5, "20":0.75, "25":1, "30":1, "35":0.5 },
    heat:{ "15":0, "20":1, "25":2, "30":3, "35":4 },
    modelTitle:"How the model works",
    model:"<p><strong>Growth</strong> = (the smaller of light and CO₂) ÷ 100 × temperature factor. Temperature factors: 15 °C 0.5, 20 °C 0.75, 25 °C 1.0, 30 °C 1.0, 35 °C 0.5.</p><p><strong>Cost</strong> = light ÷ 25 + CO₂ ÷ 25 + heating. Heating: 15 °C 0, 20 °C 1, 25 °C 2, 30 °C 3, 35 °C 4.</p>",
    checks:["Enough growth", "No wasted resource", "Within budget"],
    tips:["Growth is capped by the lower of light and CO₂, then scaled by temperature.", "If one is higher than the other, the extra does nothing. Blackman’s rule.", "Heating costs money. Is the warmest setting worth it?"],
    explainPrompt:"Explain why setting light and CO₂ to the same level avoids waste, and how temperature changed your choice.",
    vocab:"Use the words limiting factor, optimum, enzyme and rate.",
    more:"Can you find all the answers?",
    allFound:"You’ve found all three answers.",
    after3:"Two strategies work: modest light and CO₂ at the optimum temperature, or more light and CO₂ in a cooler (cheaper) greenhouse."
  },
  cards:[
    ["Overall equation", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (light energy, chlorophyll)."],
    ["Light reactions", "Thylakoid membranes: light splits water, releases O₂, makes ATP and NADPH."],
    ["Calvin cycle", "Stroma: uses ATP and NADPH to turn CO₂ into sugar (G3P)."],
    ["What links the stages", "ATP and NADPH go to the Calvin cycle; ADP, Pᵢ and NADP⁺ come back."],
    ["Source of the O₂", "Water (¹⁸O tracer experiments)."],
    ["Source of the carbon in sugar", "CO₂ from the air (¹⁴C tracer)."],
    ["Full equation", "6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O."],
    ["“Dark reactions”", "A misleading name: the Calvin cycle needs light-reaction products, so it runs in daylight."],
    ["Limiting factor", "The factor in shortest supply; only raising it raises the rate."],
    ["Temperature and rate", "Rate rises to an optimum, then falls as enzymes lose their shape."],
    ["Energy", "Light → chemical energy in sugar; some becomes heat (first and second laws)."]
  ]
};
