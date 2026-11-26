// SBI4U 32 Gel Electrophoresis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/32-gel-electrophoresis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The phosphate backbone is negative, so DNA moves toward <strong>+</strong>. Wells go at the negative end.";
const M2 = "The gel is a mesh. Small fragments slip through faster, so they end up <strong>farther</strong> from the wells.";
const M3 = "Every base pair carries the same charge, so the push per base pair is the same. Size, not charge, decides how fast a fragment moves.";
const M4 = "Farther from the wells means smaller. A band past the 300 bp marker is less than 300 bp.";
const M5 = "A higher percentage means smaller pores: everything moves more slowly, but small fragments spread farther apart.";
const M6 = "A full match means the person can’t be excluded; its strength depends on how rare the pattern is. One clear mismatch excludes them.";
const M7 = "The no-template control has no DNA to copy. A band there means something was contaminated, so the sample’s band can’t be trusted.";

// Activity 1 (Size the band): every item shows the 1.5%, 100 V, 60 min ladder beside its band (fig.band, in mm).
const SIZE = (id, band, prompt, opts, extra) => Object.assign({ id, kind:"mc", fig:band == null ? null : { band }, prompt,
  options:opts.map(o => Object.assign({ t:o[0] }, o[1] ? { ok:true } : {}, o[2] ? { why:o[2] } : {})) }, extra || {});

export default {
  id:"32-gel-electrophoresis",
  kind:"topic",
  title:"Gel electrophoresis",
  topic:"Gel Electrophoresis",
  readyTopic:"gel electrophoresis",
  hero:{
    eq:'<span class="ge-heq">DNA (−) → toward <strong>+</strong><br>smaller → <strong>farther</strong></span>',
    eqLabel:"DNA is negative, so it moves toward the positive electrode. Smaller fragments travel farther.",
    eqSize:"md",
    headline:"A gel sorts DNA by size",
    text:"Every DNA fragment carries a <strong>negative charge</strong>, so an electric field pulls it toward the <strong>positive electrode</strong>. The <strong>agarose gel</strong> is a mesh: short fragments slip through quickly, and long ones get held back. Run a <strong>ladder</strong> of known sizes beside your samples, and the band positions tell you how long each fragment is.",
    fig:{ html:'<div class="ge-hero" id="ge-hero" role="img" aria-label="A gel slab with six wells at the left, negative end; the right end is the positive electrode. DNA dots sit in two wells. An arrow points toward plus, and the dots stream right: short fragments pull ahead and long ones lag. The dots settle into sharp bands beside a ladder lane, with 1000 bp near the wells and 100 bp far away."></div>' }
  },
  goals:[
    "I can explain why DNA moves toward the positive electrode, and set up a gel so that it does.",
    "I can explain why smaller DNA fragments travel farther through a gel than larger ones.",
    "I can estimate a fragment’s size by comparing its band with a ladder.",
    "I can predict how gel percentage, voltage and run time change a gel, and choose settings for a task.",
    "I can use controls to decide whether a gel result can be trusted.",
    "I can interpret banding patterns in forensic and parentage comparisons, including what a match does and doesn’t show."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"DNA structure", goal:1,
          prompt:"Which part of a DNA nucleotide carries a negative charge?",
          options:[
            { t:"The phosphate group", ok:true, why:"Each phosphate in the backbone carries a negative charge." },
            { t:"The nitrogenous base", why:"The bases pair by hydrogen bonds; the charge is on the phosphates." },
            { t:"The deoxyribose sugar", why:"The sugar is neutral; it links the phosphates." },
            { t:"The hydrogen bonds", why:"Hydrogen bonds are attractions between bases, not charged groups." }],
          hints:["Which part of the backbone is acidic?", "The backbone alternates sugar and phosphate.", "The phosphate group."] },
        { id:"w2", skill:"DNA structure", goal:2,
          prompt:"A DNA fragment is described as 300 bp. What does that tell you?",
          options:[
            { t:"It is 300 base pairs long", ok:true, why:"bp counts base pairs: the fragment’s length." },
            { t:"It contains 300 nucleotides in total", why:"Double-stranded: 300 pairs means 600 nucleotides." },
            { t:"It has a mass of 300 g", why:"bp is a length unit, not a mass." },
            { t:"It contains 300 genes", why:"A gene is usually thousands of base pairs long." }],
          hints:["What does ‘bp’ stand for?", "Base pairs.", "Its length: 300 pairs."] },
        { id:"w3", skill:"Electric charge", goal:1,
          prompt:"A negatively charged particle sits between a positive plate and a negative plate. Which way does it move?",
          options:[
            { t:"Toward the positive plate", ok:true, why:"Opposite charges attract." },
            { t:"Toward the negative plate", why:"Like charges repel." },
            { t:"It stays still", why:"A charged particle in a field feels a force." },
            { t:"It moves at random", why:"The field gives a steady direction." }],
          hints:["Do opposite charges attract or repel?", "Attract.", "Toward +."] },
        { id:"w4", skill:"PCR and controls", goal:5,
          prompt:"A PCR uses two primers that sit at the ends of a 450 bp region. What size is the main product?",
          options:[
            { t:"450 bp", ok:true, why:"The product runs from one primer to the other." },
            { t:"900 bp", why:"Two strands, but 450 base pairs." },
            { t:"The whole chromosome", why:"Only the region between the primers is copied over and over." },
            { t:"The length of the two primers added together", why:"Primers mark the ends; the product includes everything between." }],
          hints:["Where do the primers bind?", "At the two ends of the target.", "450 bp."] },
        { id:"w5", skill:"Reading a scale", goal:3,
          prompt:"A scale is marked 200 at 30 mm and 300 at 25 mm. A mark sits at 27.5 mm. What value is it closest to?",
          options:[
            { t:"250", ok:true, why:"27.5 mm is halfway between, so halfway between 200 and 300." },
            { t:"350", why:"Values get <strong>bigger</strong> as the distance gets <strong>smaller</strong> here." },
            { t:"27.5", why:"That’s the distance, not the scale value." },
            { t:"275", why:"Halfway between 200 and 300 is 250." }],
          hints:["Which way does the scale run?", "200 at 30 mm, 300 at 25 mm: bigger values are closer to 0 mm.", "Halfway: 250."] },
        { id:"w6", skill:"PCR and controls", goal:5,
          prompt:"Why does an experiment include a control?",
          options:[
            { t:"To show what happens without the factor being tested, so you can tell whether the result is real", ok:true, why:"A control shows what ‘no effect’ looks like, so you have something to compare with." },
            { t:"To make the experiment take less time", why:"Controls add work; they add trust." },
            { t:"To guarantee the hypothesis is right", why:"A control can show the hypothesis is wrong." },
            { t:"To use up extra materials", why:"Every control answers a question." }],
          hints:["What would you compare your result to?", "A run where the factor is missing.", "It shows what ‘no effect’ looks like."] }
      ],
      refreshers:{
        "DNA structure":"DNA’s backbone is sugar–phosphate–sugar–phosphate. Each phosphate is negative, so the whole molecule is negative, and the charge grows with length. Length is counted in base pairs (bp).",
        "Electric charge":"Opposite charges attract. A negative particle moves toward the positive electrode.",
        "PCR and controls":"PCR copies only the region between two primers, so its product has a set size. Controls show what a result looks like when something is missing, so you know whether your result is trustworthy.",
        "Reading a scale":"Check which way a scale runs before reading between marks. On a gel, size gets smaller as distance from the wells gets bigger."
      }
    }
  },
  explore:{
    heading:"Virtual gel",
    intro:"Set up the gel, load your samples, choose the gel and the voltage, then run it. Reveal the DNA to see where each fragment stopped.",
    modes:[["run", "Run a gel"], ["compare", "Compare gels"]],
    modeHelp:{
      run:"Tap a tube in the tray, then a lane. Play runs the gel to the time on the slider; moving a slider shows the gel after that run.",
      compare:"Two gels side by side, each with its own agarose percentage; the same lanes, voltage and time. Tap two bands in each gel to measure the gap."
    },
    orients:[["neg", "Wells at the negative (−) end"], ["pos", "Wells at the positive (+) end"]],
    // distance (mm) = (V ÷ 100) × (t ÷ 60) × m, m = a − b × log₁₀(size ÷ 100), never below 1.0 (plan §4, Explore model)
    gels:[{ id:"0.8", a:50, b:18 }, { id:"1.0", a:44, b:22 }, { id:"1.5", a:39, b:29 }, { id:"2.0", a:33, b:32 }],
    tubes:[
      { id:"l100", name:"100 bp ladder", code:"100 bp", ladder:true, sizes:[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] },
      { id:"l1k", name:"1 kb ladder", code:"1 kb", ladder:true, sizes:[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000] },
      { id:"A", name:"Sample A (PCR product)", code:"A", sizes:[250] },
      { id:"B", name:"Sample B", code:"B", sizes:[600, 250] },
      { id:"C", name:"Sample C (unknown)", code:"C ?", unknown:true, sizes:[350] },
      { id:"D", name:"Sample D", code:"D", sizes:[3000] },
      { id:"ntc", name:"No-template control", code:"NTC", sizes:[] }
    ],
    lanes0:["l100", "B", "A", "", "", ""],
    readout:["DNA moves toward", "Gel", "Voltage · time", "Dye front", "Selected band", "Gap between two selected bands", "Status"],
    voltNote:"In a real gel, very high voltage heats the gel and blurs bands. This model only speeds things up.",
    elecNote:"Real equipment marks the + electrode red and the − electrode black. Here red is kept for ‘wrong’, so both electrodes are drawn in ink.",
    modelNote:"<strong>Model.</strong> distance (mm) = (<i>V</i> ÷ 100) × (<i>t</i> ÷ 60) × <i>m</i>, where <i>m</i> = <i>a</i> − <i>b</i> × log₁₀(size ÷ 100), never below 1.0 (very large fragments barely leave the well). <i>a</i> and <i>b</i> depend on the gel: 0.8% 50, 18 · 1.0% 44, 22 · 1.5% 39, 29 · 2.0% 33, 32. The gel is 60 mm long; the dye front is a model 50 bp fragment. Distances are rounded to 0.1 mm, and every check uses the rounded value. Real gels only roughly follow this.",
    aha:"Negative DNA runs to +; small fragments go farther; a higher percentage spreads small fragments apart but slows everything; and the run has to stop before the small bands run off.",
    predIntro:"Make a prediction first. Then the virtual gel will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"run", orient:"pos", lanes:["l100", "A", "", "", "", ""], gel:"1.5", V:100, t:60 },
        prompt:"<span class=\"muted\">Wells at the + end; lane 1 the 100 bp ladder, lane 2 Sample A; 1.5%; 100 V; 60 min.</span> Where will the DNA be after the run?",
        options:[{ t:"Out of the gel: it left the wells away from the gel", ok:true }, { t:"Normal bands down the gel" }, { t:"Still in the wells" }, { t:"Halfway down the gel" }],
        reveal:"DNA streams out of the backs of the wells; the gel lanes are empty.",
        explain:"DNA moves toward +. With the wells next to the + electrode, ‘+’ is behind the wells, outside the gel." },
      { id:"p2", start:{ mode:"run", orient:"neg", lanes:["", "B", "", "", "", ""], gel:"1.5", V:100, t:60 },
        prompt:"<span class=\"muted\">Wells at the − end; Sample B (600 bp and 250 bp); 1.5%; 100 V; 60 min.</span> Which band ends up farther from the wells?",
        options:[{ t:"250 bp", ok:true }, { t:"600 bp" }, { t:"They stay together" }, { t:"It depends on which was loaded first" }],
        reveal:"Bands at 27.5 mm (250 bp) and 16.4 mm (600 bp).",
        explain:"Same charge per base pair, but the shorter fragment slips through the mesh faster." },
      { id:"p3", start:{ mode:"compare", orient:"neg", lanes:["l100", "", "", "", "", ""], gel:"0.8", gel2:"2.0", V:100, t:60 },
        prompt:"<span class=\"muted\">Compare mode: 0.8% and 2.0%, the 100 bp ladder in both, 100 V, 60 min.</span> On which gel does the 100 bp band travel farther?",
        options:[{ t:"0.8%", ok:true }, { t:"2.0%" }, { t:"Same distance" }, { t:"Neither: it runs off both" }],
        reveal:"The 100 bp band: 50.0 mm on 0.8%, 33.0 mm on 2.0%.",
        explain:"A lower percentage means bigger pores, so DNA moves more easily." },
      { id:"p4", start:{ mode:"run", orient:"neg", lanes:["l100", "", "", "", "", ""], gel:"1.5", V:100, t:30, sel:[300, 400] }, to:60,
        prompt:"<span class=\"muted\">The 100 bp ladder on 1.5% at 100 V, stopped at 30 min, then run on to 60 min.</span> What happens to the gap between the 300 bp and 400 bp bands from 30 to 60 minutes?",
        options:[{ t:"It doubles (about 1.8 mm to 3.6 mm)", ok:true }, { t:"It stays the same" }, { t:"It halves" }, { t:"The bands merge" }],
        reveal:"The gap m&#101;ter reads 1.8 mm, then 3.6 mm.",
        explain:"Each band moves at its own steady speed, so the gap grows with time. That’s why longer runs separate close sizes, until the smallest bands run off." }
    ],
    chalIntro:"Use the virtual gel to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help. In Compare mode, the checks use the left gel.",
    challenges:[
      { id:"tc1", goal:[1, 4], prompt:"Load the 100 bp ladder. Make its 500 bp band stop between 25.0 and 30.0 mm from the wells.",
        why:"Any setting that puts the 500 bp band from 25.0 to 30.0 mm works: for example 1.0% at 100 V for 60 min (28.6 mm), 0.8% at 70 V for 60 min (26.2 mm) or 1.5% at 90 V for 90 min (25.3 mm).",
        wrong:{ pos:"Your DNA left the gel: the wells must be at the negative end.", far:"Too far: lower the voltage or stop sooner.", near:"Not far enough: raise the voltage, run longer, or choose a lower percentage.", load:"Load the 100 bp ladder into a lane first." },
        hints:["Distance grows with voltage and with time.", "On 1.0% at 100 V, the 500 bp band moves 28.6 mm per hour.", "1.0%, 100 V, 60 min gives 28.6 mm."] },
      { id:"tc2", goal:4, prompt:"Separate the 400 bp and 500 bp ladder bands by at least 3.0 mm, while the 100 bp band is still on the gel.",
        why:"Only 1.5% or 2.0% gels can do it: for example 2.0% at 100 V for 60 min (gap 3.1 mm, 100 bp at 33.0 mm) or 1.5% at 100 V for 70 min (gap 3.3 mm, 100 bp at 45.5 mm).",
        wrong:{ pos:"Your DNA left the gel: the wells must be at the negative end.", low:"On this gel, by the time those bands are 3 mm apart, the 100 bp band has run off. Try a higher percentage.", close:"Close: run a little longer.", off:"Too long: the small fragments ran off.", load:"Load the 100 bp ladder into a lane first." },
        hints:["Which gels spread small fragments apart most?", "Per hour at 100 V, the 400–500 gap is 1.7 mm (0.8%), 2.1 mm (1.0%), 2.8 mm (1.5%) or 3.1 mm (2.0%).", "2.0% at 100 V for 60 min: gap 3.1 mm, 100 bp band at 33.0 mm."] },
      { id:"tc3", goal:4, stretch:true, prompt:"At 100 V, find the <strong>shortest</strong> run (in 10-minute steps), on any gel, that separates 250 bp from 300 bp by at least 2.0 mm with the 100 bp band still on the gel. (Sample A and the ladder’s 300 bp marker are loaded.)",
        why:"2.0% for 50 min: gap 2.1 mm, with the 100 bp band at 27.5 mm. The 2.0% gel spreads these sizes fastest.",
        wrong:{ pos:"Your DNA left the gel: the wells must be at the negative end.", volt:"Set the voltage to 100 V.", g15:"That works, but the 2.0% gel gets there sooner.", g20t40:"Gap 1.7 mm: not yet.", g10:"Works, but slower.",
          works:"That works, but a shorter run also works.", notYet:"Not yet: the gap is under 2.0 mm.", off:"The 100 bp band ran off the gel." },
        hints:["The gap grows at a steady rate on each gel. Which gel’s rate is fastest?", "Gap per hour for 250 vs 300 bp: 0.8% 1.4 mm, 1.0% 1.7 mm, 1.5% 2.3 mm, 2.0% 2.5 mm.", "On 2.0% you need 2.0 ÷ 2.5 of an hour, about 48 min, so 50 min."] }
    ]
  },
  part3:{
    slug:"read-gel", name:"Read the gel",
    heading:"Read the gel",
    intro:"Explore was about <em>making</em> a gel. Here you read gels as evidence: size an unknown with a standard curve, compare banding patterns, and judge a PCR by its controls.",
    curve:{
      panel:"Check it with data: the standard curve",
      how:"The 1.5%, 60 min ladder positions, plotted as size (log scale) against distance from the wells.",
      note:"The points fall on a straight line in this model; on real gels the line is close to straight in the middle sizes.",
      text:"The ladder turns distance into size. It only works because the ladder ran on the same gel, at the same voltage, for the same time.",
      drop:"Sample C’s band (23.2 mm) dropped onto the line reads across to about 350 bp."
    },
    s1:{ title:"Station 1: size an unknown",
      how:"Sample C runs beside the 100 bp ladder on the default gel (1.5%, 100 V, 60 min). Tap the two ladder bands on either side of the unknown band.",
      unknown:"That’s the unknown band. Tap the ladder bands just above and just below it.",
      far:"That ladder band isn’t next to the unknown’s 23.2 mm. Tap the ladder bands on either side of it.",
      one:"Good: that one is next to the unknown. Now tap the ladder band on its other side.",
      done:"The unknown at 23.2 mm sits between 300 bp (25.2 mm) and 400 bp (21.5 mm). Read across on the curve: about 350 bp." },
    s2:{ title:"Station 2: forensic comparison",
      how:"Made-up profiles, four markers, run on one gel. Tap the person who can’t be excluded as the source of the scene sample.",
      lanes:[["Scene sample", [180, 260, 340, 470]], ["Person 1", [180, 260, 340, 470]], ["Person 2", [180, 290, 340, 470]], ["Person 3", [200, 260, 380, 520]]],
      choices:[
        { t:"Person 1", ok:true, fb:"Person 2 differs in one band, so they are excluded (if the gel ran properly). Person 1 matches at every marker, so they can’t be excluded. How strong that is depends on how rare this pattern is in the population." },
        { t:"Person 2", fb:"Person 2 differs in one band (290 bp where the scene has 260 bp), so they are excluded, if the gel ran properly. One clear mismatch excludes." },
        { t:"Person 3", fb:"Person 3 differs at three markers (200, 380 and 520 bp), so they are excluded." }] },
    s3:{ title:"Station 3: parentage",
      how:"Made-up profiles. Which possible parent fits the child?",
      rule:"Every band in the child must come from one parent or the other.",
      lanes:[["Child", [210, 330, 450, 580]], ["Mother", [210, 450, 620]], ["Possible parent A", [330, 500, 580]], ["Possible parent B", [330, 490, 640]]],
      choices:[
        { t:"Possible parent A", ok:true, fb:"The child’s bands not from the mother are 330 and 580; only A has both." },
        { t:"Possible parent B", fb:"B has the 330 band but no 580 band, so the child’s 580 band would have no source. The child’s bands not from the mother are 330 and 580; only A has both." }] },
    s4:{ title:"Station 4: checking a PCR",
      how:"Expected product: 450 bp. Lane 1 is the 100 bp ladder (normal); lane 2 the sample; lane 3 the positive control (known template); lane 4 the no-template control.",
      lanes:[["100 bp ladder", "ladder"], ["Sample", [450]], ["Positive control", [450]], ["No-template control", [450]]],
      q:"Can the lab report the sample as positive?",
      choices:[
        { t:"No: the no-template control has a band", ok:true, fb:"No. The no-template control should be empty; a band means contamination, so the sample’s band can’t be trusted. Repeat with fresh materials." },
        { t:"Yes: the sample band is the right size", fb:"The size is right, but the no-template control has a band too. " + M7 },
        { t:"Yes: the positive control worked", fb:"The positive control only shows the PCR can work. The no-template control should be empty. " + M7 }] },
    quickCheck:{
      title:"Quick check", summary:"Read the gel quick check",
      items:[
        { id:"q1", goal:3, prompt:"On the standard curve (log size vs distance), what do the ladder points make in this model?",
          choices:[
            { t:"A straight line", ok:true, fb:"Right. Size falls steadily (on a log scale) as distance grows, which is why you can read across." },
            { t:"A U-shape", fb:"Size falls steadily (on a log scale) as distance grows, which is why you can read across." },
            { t:"Random scatter", fb:"Size falls steadily (on a log scale) as distance grows, which is why you can read across." },
            { t:"A horizontal line", fb:"Size falls steadily (on a log scale) as distance grows, which is why you can read across." }] },
        { id:"q2", goal:6, prompt:"Child: 210, 330. Mother: 210, 400. Which band must the other parent have?",
          choices:[
            { t:"330", ok:true, fb:"Right. The child’s 330 band didn’t come from the mother." },
            { t:"210", fb:"The child’s 330 band didn’t come from the mother." },
            { t:"400", fb:"The child’s 330 band didn’t come from the mother." },
            { t:"Any of them", fb:"The child’s 330 band didn’t come from the mother." }] },
        { id:"q3", goal:5, prompt:"The no-template control shows a band. What does that mean?",
          choices:[
            { t:"Contamination: results can’t be trusted", ok:true, fb:"Right. With no template, nothing should be copied." },
            { t:"The PCR worked well", fb:"With no template, nothing should be copied. " + M7 },
            { t:"The ladder is wrong", fb:"With no template, nothing should be copied. " + M7 },
            { t:"The gel ran too long", fb:"With no template, nothing should be copied. " + M7 }] },
        { id:"q4", goal:2, prompt:"Why do all fragments carry about the same charge per base pair?",
          choices:[
            { t:"Each nucleotide has one phosphate", ok:true, fb:"Right. One phosphate per nucleotide, so the charge grows evenly with length." },
            { t:"Bases are charged", fb:"One phosphate per nucleotide, so the charge grows evenly with length. " + M3 },
            { t:"Gels add charge", fb:"One phosphate per nucleotide, so the charge grows evenly with length. " + M3 },
            { t:"Larger fragments lose charge", fb:"One phosphate per nucleotide, so the charge grows evenly with length. " + M3 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"size", type:"custom", title:"Size the band", summary:"Size the band", goal:[3, 4],
        instruction:"Gel: 1.5%, 100 V, 60 min. The ladder is shown beside every item. Choose the best answer, then press Check answer.",
        items:[
          SIZE("b1", 27.5, "Band at 27.5 mm. Size?", [["150 bp", 0, "150 bp would sit past the 200 bp band (30.3 mm)."], ["250 bp", 1, "Between 200 bp (30.3 mm) and 300 bp (25.2 mm)."], ["350 bp", 0, "27.5 mm is farther than the 300 bp band (25.2 mm), so it’s smaller."], ["2750 bp", 0, "Distance in mm isn’t size in bp."]], { goal:3 }),
          SIZE("b2", 23.2, "Band at 23.2 mm. Size?", [["250 bp", 0, M4], ["350 bp", 1, "Between 300 bp (25.2 mm) and 400 bp (21.5 mm)."], ["450 bp", 0, "450 bp would be nearer the wells than the 400 bp band (21.5 mm)."], ["550 bp", 0, "550 bp would be nearer the wells than the 500 bp band (18.7 mm)."]], { goal:3 }),
          SIZE("b3", 20.1, "Band at 20.1 mm. Size?", [["350 bp", 0, "Between 400 (21.5) and 500 (18.7)."], ["450 bp", 1, "Between 400 (21.5) and 500 (18.7), about halfway."], ["550 bp", 0, "Between 400 (21.5) and 500 (18.7)."], ["650 bp", 0, "Between 400 (21.5) and 500 (18.7)."]],
            { goal:3, hints:["Find the two ladder bands on either side.", "21.5 mm is 400 bp; 18.7 mm is 500 bp.", "20.1 mm is about halfway: 450 bp."] }),
          SIZE("b4", 33.9, "Band at 33.9 mm. Size?", [["150 bp", 1, "Between the 100 bp (39.0 mm) and 200 bp (30.3 mm) markers."], ["250 bp", 0, "250 bp would be nearer the wells than the 200 bp band. " + M4], ["50 bp", 0, "50 bp would be past the 100 bp band (39.0 mm)."], ["1500 bp", 0, "That’s a 10× slip; the band is between the 100 and 200 markers."]], { goal:3 }),
          SIZE("b5", 17.5, "Band at 17.5 mm. Size?", [["450 bp", 0, "Between 500 (18.7) and 600 (16.4)."], ["550 bp", 1, "Between 500 bp (18.7 mm) and 600 bp (16.4 mm)."], ["650 bp", 0, "Between 500 (18.7) and 600 (16.4)."], ["750 bp", 0, "Between 500 (18.7) and 600 (16.4)."]], { goal:3 }),
          SIZE("b6", 13.6, "Band at 13.6 mm. Size?", [["650 bp", 0, "Between 700 (14.5) and 800 (12.8)."], ["750 bp", 1, "Between 700 bp (14.5 mm) and 800 bp (12.8 mm)."], ["850 bp", 0, "Between 700 (14.5) and 800 (12.8)."], ["950 bp", 0, "Between 700 (14.5) and 800 (12.8)."]], { goal:3 }),
          SIZE("b7", null, "Which band is closest to the wells: 150, 450 or 750 bp?", [["150 bp", 0, M2], ["450 bp", 0, M2], ["750 bp", 1, "The largest fragment moves most slowly, so it stays nearest the wells."]], { goal:3 }),
          SIZE("b8", null, "A 250 bp band sits at 27.5 mm after 60 min. Where is it after 30 min at the same voltage?", [["13.7 mm", 1, "Half the time, half the distance: 27.5 ÷ 2 ≈ 13.7 mm."], ["27.5 mm", 0, "The band keeps moving while the current is on."], ["55.0 mm", 0, "Half the time, half the distance."], ["6.9 mm", 0, "That’s a quarter of the distance. Half the time, half the distance."]],
            { goal:4, hints:["Does each band move at a steady speed?", "Yes, in this model.", "Half of 27.5 is 13.75, so about 13.7 mm."] })
        ] },
      { id:"detective", type:"custom", title:"Gel detective", summary:"Gel detective", star:true, goal:[1, 4, 5, 6],
        instruction:"Six gel puzzles. Puzzles 2 to 6 are non-routine (★); puzzles 3 and 6 go beyond the Final Check.",
        items:[
          { id:"d1", kind:"mc", goal:4, prompt:"The same ladder runs for 60 min at 100 V on 1.0% and on 2.0%. On which gel are the 400 and 500 bp bands farther apart?",
            options:[{ t:"1.0%", why:"Lower percentage moves DNA farther overall but spreads small fragments less." }, { t:"2.0%", ok:true, why:"3.1 mm on 2.0% vs 2.1 mm on 1.0%." }, { t:"The same on both", why:"Gel percentage changes the spacing. " + M5 }] },
          { id:"d2", kind:"mc", star:true, goal:4, prompt:"A 200 bp band is at 30.3 mm after 60 min at 100 V. Where would it be after 60 min at 50 V?",
            options:[{ t:"30.3 mm", why:"Voltage sets the speed. Half the voltage, half the speed." }, { t:"About 15 mm", ok:true, why:"Half the voltage, half the speed: 30.3 ÷ 2 ≈ 15 mm." }, { t:"60 mm", why:"Half the voltage, half the speed." }] },
          { id:"d3", kind:"mc", star:true, goal:3, prompt:"An unknown band sits between the 300 and 400 bp markers, much closer to the 400 bp band. Which size fits best?",
            options:[{ t:"280 bp", why:"280 bp would be past the 300 bp marker, not between the markers." }, { t:"320 bp", why:M4 + " Closer to 400 means nearer 400 in size." }, { t:"380 bp", ok:true, why:"Close to the 400 bp band means a size close to 400." }, { t:"420 bp", why:"It’s between the markers, so under 400." }],
            hints:["Distance to each marker?", "Close to the 400 bp band means a size close to 400.", "380 bp."] },
          { id:"d4", kind:"sel", star:true, goal:4, prompt:"<span class=\"tag\">Investigation</span> You test whether voltage changes how far a 500 bp fragment travels. Which must stay the same? (Select all that apply.)",
            options:[{ t:"Gel percentage", ok:true }, { t:"Run time", ok:true }, { t:"The sample", ok:true }, { t:"Voltage", why:"That’s what you’re changing: the independent variable." }],
            why:"Gel percentage, run time and the sample are controlled variables; voltage is the independent variable.",
            hints:["What are you changing on purpose?", "Voltage is the independent variable.", "Keep the gel percentage, the run time and the sample the same."] },
          { id:"d5", kind:"mc", star:true, goal:5, prompt:"One lane shows a long smear from the wells to 40 mm instead of a sharp band. What is the most likely explanation?",
            options:[{ t:"The DNA was broken into many different lengths", ok:true, why:"Many different lengths stop at many different distances, so they blur into a smear." }, { t:"The wells faced the + end", why:"Then nothing would be in the gel at all." }, { t:"The gel percentage was too high", why:"A higher percentage slows bands and spreads small ones, but each size still makes a sharp band." }, { t:"The ladder was missing", why:"The ladder is in its own lane; it can’t smear this one." }] },
          // VERIFY: Canada's National DNA Data Bank (RCMP): check current details (indices, retention rules) before release (plan §6, risk 3).
          { id:"d6", kind:"mc", star:true, goal:6, prompt:"<span class=\"tag\">STSE</span> Canada keeps a national DNA data bank of profiles linked to crimes. Which concern is about <strong>privacy</strong> rather than <strong>accuracy</strong>?",
            options:[{ t:"Keeping profiles of people who were never convicted", ok:true, why:"It’s about who gets to hold information about you." }, { t:"A contaminated sample gives a false match", why:"Those affect whether a result is correct, not who gets to hold the information." }, { t:"Bands too close together to tell apart", why:"Those affect whether a result is correct, not who gets to hold the information." }, { t:"A mislabelled tube", why:"Those affect whether a result is correct, not who gets to hold the information." }],
            hints:["Accuracy asks: is the result right? Privacy asks: who knows what about you?", "Which option is about holding information?", "Keeping profiles of people never convicted."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Santiago", goal:[1, 3, 6], how:"",
        instruction:"Santiago made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Set up a gel to check a PCR product.",
            steps:["DNA has a negatively charged phosphate backbone.", "So DNA will move toward the negative electrode.", "I put the wells beside the positive electrode.", "I ran the gel for 60 minutes and saw no bands."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows from step 2. The mistake is earlier.", "That’s the result of the earlier mistake."],
            fixes:[
              { t:"Negative DNA moves toward the <strong>positive</strong> electrode, so the wells go at the negative end.", ok:true, why:M1 },
              { t:"The phosphate backbone is actually positive.", why:"Phosphates are negative." },
              { t:"Run the gel longer to see the bands.", why:"The DNA left the gel; more time won’t help." },
              { t:"Step 2 is correct.", why:"Opposite charges attract. " + M1 }],
            hints:["Do opposite charges attract or repel?", "Attract: negative DNA goes to +.", "Fix step 2."] },
          { id:"e2", goal:3, task:"Estimate the size of a band at 27.5 mm (ladder: 200 bp at 30.3 mm, 300 bp at 25.2 mm).",
            steps:["The ladder shows 200 bp at 30.3 mm and 300 bp at 25.2 mm.", "My band at 27.5 mm lies between those two markers.", "It’s past the 300 bp band, so it’s bigger than 300 bp.", "So it’s about 350 bp.", "Its PCR product is the right size."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier.", "Step 5 follows from the earlier steps. The mistake is earlier."],
            fixes:[
              { t:"Farther from the wells means smaller: it’s between 200 and 300 bp, about 250 bp.", ok:true, why:M4 },
              { t:"It’s exactly 275 bp.", why:"Halfway between 200 and 300 is 250." },
              { t:"It’s about 2750 bp.", why:"Distance in mm isn’t size in bp." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Is the 300 bp band nearer or farther from the wells than the 200 bp band?", "Nearer (25.2 mm vs 30.3 mm).", "A band at 27.5 mm is between 200 and 300: about 250 bp."] },
          { id:"e3", goal:6, task:"Compare a scene sample (bands 180, 240, 310, 420 bp) with two people.",
            steps:["Person 1 has bands 180, 240, 310, 420.", "Person 2 has bands 180, 260, 310, 420.", "Person 2 matches 3 of 4 bands, so Person 2 could also be the source.", "So both people are equally likely sources."],
            answer:2,
            stepFb:["Step 1 reads the gel correctly.", "Step 2 reads the gel correctly.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"One clear mismatch (260 vs 240) excludes Person 2, if the gel ran properly. Only Person 1 can’t be excluded.", ok:true, why:M6 },
              { t:"Three matches out of four proves Person 2 is the source.", why:M6 },
              { t:"Neither can be compared without more markers.", why:"The mismatch already excludes Person 2." },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["Must a source match at every marker?", "Yes: a person’s DNA profile doesn’t change.", "Person 2 is excluded."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the virtual gel: the backward-wells result, or how gel percentage changed the spacing?" },
      { id:"j2", q:"In your own words, why does a small fragment travel farther than a large one, even though it carries less charge?" },
      { id:"j3", q:"Explain to a friend how to read the size of an unknown band from a ladder." },
      { id:"j4", q:"Which part of reading a gel are you least sure about (controls, sizing or matching)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Why does DNA move toward the positive electrode in gel electrophoresis?", options:[
          { t:"Its phosphate backbone is negatively charged", ok:true, why:"Opposite charges attract: the negative phosphates pull DNA toward +." },
          { t:"Its bases are positively charged", why:"Bases aren’t the charged part; phosphates are, and they’re negative." },
          { t:"The gel pushes it in that direction", why:"The gel only slows DNA; the electric field moves it." },
          { t:"Larger fragments are heavier and sink that way", why:"Gravity isn’t involved; charge is." }] },
        b:{ prompt:"A student sets up a gel with the wells beside the positive electrode. What happens to the DNA?", options:[
          { t:"It moves out of the wells away from the gel, so no bands appear", ok:true, why:M1 },
          { t:"It runs through the gel normally", why:"DNA moves toward +, which is behind these wells." },
          { t:"It stays in the wells", why:"The field still moves it." },
          { t:"It runs through the gel faster", why:"Direction, not speed, is the problem." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"One lane holds fragments of 300, 800 and 1500 bp. Which band ends up closest to the wells?", options:[
          { t:"1500 bp", ok:true, why:"The largest fragment is held back most by the mesh." },
          { t:"300 bp", why:"The smallest travels farthest from the wells." },
          { t:"800 bp", why:"The middle size ends up in the middle." },
          { t:"All three end up together", why:"Same charge per base pair, but different sizes move at different speeds." }] },
        b:{ prompt:"One lane holds fragments of 200, 600 and 2000 bp. Which band ends up farthest from the wells?", options:[
          { t:"200 bp", ok:true, why:M2 },
          { t:"2000 bp", why:M2 },
          { t:"600 bp", why:"The middle size ends up in the middle." },
          { t:"All three end up together", why:M3 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A run is repeated with the gel changed from 1.0% to 2.0% agarose, with the same voltage and time. What changes?", options:[
          { t:"All bands travel less far, but small fragments spread farther apart", ok:true, why:M5 },
          { t:"All bands travel farther", why:"Smaller pores slow DNA down." },
          { t:"Nothing changes", why:"Percentage sets pore size." },
          { t:"Large fragments spread farther apart", why:"Large fragments barely move in a 2.0% gel." }] },
        b:{ prompt:"To separate fragments of 4000 and 5000 bp, which gel is the better choice?", options:[
          { t:"0.8% agarose", ok:true, why:"Lower-percentage gels are for large fragments." },
          { t:"2.0% agarose", why:"In a 2.0% gel, fragments this large barely leave the wells." },
          { t:"Either: percentage doesn’t matter", why:M5 },
          { t:"1.5% agarose", why:"Still too dense for fragments this large." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"The 300 bp ladder band is at 25.2 mm and the 400 bp band at 21.5 mm. An unknown band is at 23.2 mm. Best estimate?", options:[
          { t:"About 350 bp", ok:true, why:"23.2 mm is between the 300 and 400 bp bands." },
          { t:"About 250 bp", why:"250 bp would be farther than the 300 bp band." },
          { t:"About 450 bp", why:"450 bp would be nearer the wells than the 400 bp band." },
          { t:"23 bp", why:"That reads the distance in mm as a size." }] },
        b:{ prompt:"The 200 bp ladder band is at 30.3 mm and the 300 bp band at 25.2 mm. An unknown band is at 27.5 mm. Best estimate?", options:[
          { t:"About 250 bp", ok:true, why:"27.5 mm is between the 200 and 300 bp bands." },
          { t:"About 350 bp", why:M4 },
          { t:"About 150 bp", why:"150 bp would be farther than the 200 bp band." },
          { t:"27 bp", why:"That reads the distance as a size." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Products of 250 and 300 bp are only 1.5 mm apart after 40 min on a 1.5% gel at 100 V. The 100 bp band is at 26 mm. Using the same gel, what is the best fix?", options:[
          { t:"Run it longer, about 80 min: the gap doubles to about 3 mm, and the 100 bp band (about 52 mm) stays on the gel", ok:true, why:"Each band moves at a steady speed, so doubling the time doubles the gap." },
          { t:"Reverse the electrodes", why:"The DNA would leave the gel." },
          { t:"Switch to a 1 kb ladder", why:"The ladder doesn’t change the samples’ spacing." },
          { t:"Lower the voltage for the same 40 min", why:"Slower movement makes the gap smaller." }] },
        b:{ prompt:"After 60 min at 100 V on a 0.8% gel, bands of 400 and 500 bp are only 1.7 mm apart. Which change separates them most in the same 60 min?", options:[
          { t:"A 2.0% gel (gap about 3.1 mm)", ok:true, why:"A higher percentage spreads small fragments farther apart." },
          { t:"A 0.5% gel", why:"Lower percentage spreads small fragments <strong>less</strong>." },
          { t:"Run for 30 min", why:"Less time, smaller gap." },
          { t:"Load twice as much DNA", why:"More DNA makes thicker bands, not more space." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A child’s bands are 220, 340, 410 and 560 bp; the mother’s are 220, 410 and 600. Every band in the child must come from one parent. Which possible father fits?", options:[
          { t:"Bands 340, 560, 700", ok:true, why:"The child’s 340 and 560 bands didn’t come from the mother; this father has both." },
          { t:"Bands 340, 480, 700", why:"No 560 band: the child’s 560 band has no source." },
          { t:"Bands 300, 560, 650", why:"No 340 band." },
          { t:"Bands 220, 410, 600", why:"That matches the mother; the child’s 340 and 560 bands still need a source." }] },
        b:{ prompt:"A child’s bands are 250, 310, 470 and 520 bp; the mother’s are 250, 380 and 520. Which possible father fits?", options:[
          { t:"Bands 310, 400, 470", ok:true, why:"The child’s 310 and 470 bands didn’t come from the mother; this father has both." },
          { t:"Bands 310, 450, 600", why:"No 470 band." },
          { t:"Bands 290, 470, 610", why:"No 310 band." },
          { t:"Bands 250, 380, 520", why:"That matches the mother; 310 and 470 still need a source." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why smaller DNA fragments travel farther through a gel?", options:[
          { t:"“Every base pair carries the same negative charge, so all fragments feel the same pull per base pair. The gel’s mesh slows long fragments more, so short ones get farther in the same time.”", ok:true, why:M3 },
          { t:"“Smaller fragments carry more negative charge.”", why:"Charge grows with length, not the other way." },
          { t:"“Smaller fragments are lighter, so gravity pulls them less.”", why:"Gravity plays no part." },
          { t:"“Large fragments are stuck in the wells for good.”", why:"Large fragments move, just slowly." }] },
        b:{ prompt:"Which is the best explanation of why a 2000 bp fragment travels less far than a 200 bp fragment in the same lane?", options:[
          { t:"“Both carry the same charge per base pair, so the pull per base pair is equal. The longer fragment is held back more by the gel’s mesh, so it moves more slowly.”", ok:true, why:M3 },
          { t:"“The 2000 bp fragment has less charge.”", why:M3 },
          { t:"“The 2000 bp fragment is pulled toward the negative electrode.”", why:M1 },
          { t:"“The 200 bp fragment was loaded first.”", why:"Both start at the same moment." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"A scene sample matches Person 2’s banding pattern at all five markers tested. Which statement is best?", options:[
          { t:"“Person 2 can’t be excluded as the source. How strong this evidence is depends on how rare the pattern is in the population; it doesn’t prove guilt by itself.”", ok:true, why:M6 },
          { t:"“This proves Person 2 committed the crime.”", why:M6 },
          { t:"“This shows Person 2 is related to the victim.”", why:"The comparison is with the scene sample, not the victim." },
          { t:"“This means nothing, since other people share some bands.”", why:"A match at every marker is strong evidence." }] },
        b:{ prompt:"A scene sample differs from Person 4’s pattern at 2 of 5 markers, on a gel whose ladder and controls ran properly. Which statement is best?", options:[
          { t:"“Person 4 is excluded as the source of the scene sample.”", ok:true, why:"One clear mismatch excludes; here there are two." },
          { t:"“Person 4 matches 3 of 5, so is probably the source.”", why:M6 },
          { t:"“No conclusion is possible without a full match.”", why:"A clear mismatch is a conclusion: exclusion." },
          { t:"“Person 4 is the source, and the gel is wrong.”", why:"The controls show the gel ran properly." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A lab expects a 450 bp PCR product. The ladder is normal, the sample shows a band near 450 bp, and the no-template control also shows a band near 450 bp. What should the lab conclude?", options:[
          { t:"Something was contaminated, so the sample’s result can’t be trusted and the test must be repeated", ok:true, why:M7 },
          { t:"The product is confirmed, because the sample band is the right size", why:M7 },
          { t:"The control proves the PCR worked", why:"That’s the positive control’s job; this control should be empty." },
          { t:"The ladder must be wrong", why:"The ladder is normal." }] },
        b:{ prompt:"A lab expects a 300 bp product. The ladder is normal and the positive control shows a 300 bp band, but the sample lane is empty. What is the best conclusion?", options:[
          { t:"The gel and the PCR worked, so the problem is the sample: its target wasn’t present or wasn’t copied", ok:true, why:"The ladder and the positive control rule out the gel and the PCR." },
          { t:"The gel ran backward", why:"The ladder and control bands show it ran correctly." },
          { t:"The PCR failed for every tube", why:"The positive control worked." },
          { t:"The sample’s product ran off the gel", why:"A 300 bp band would sit beside the control’s band." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A researcher needs to tell apart fragments of 150 and 200 bp. Which set-up is best?", options:[
          { t:"A 2.0% gel with a 100 bp ladder", ok:true, why:"A high percentage spreads small fragments, and the ladder has bands at 100 and 200 bp." },
          { t:"A 0.8% gel with a 1 kb ladder", why:"Low percentage and a ladder with no bands this small." },
          { t:"A 2.0% gel with a 1 kb ladder", why:"The gel is right, but the ladder has no bands near 150–200 bp." },
          { t:"A 0.8% gel with a 100 bp ladder", why:"A low-percentage gel spreads small fragments too little." }] },
        b:{ prompt:"A researcher needs to tell apart fragments of 6000 and 8000 bp. Which set-up is best?", options:[
          { t:"A 0.8% gel with a 1 kb ladder", ok:true, why:"A low percentage lets large fragments move, and the ladder has bands at 6000 and 8000 bp." },
          { t:"A 2.0% gel with a 100 bp ladder", why:"Fragments this large barely move in 2.0%, and the ladder stops at 1000." },
          { t:"A 0.8% gel with a 100 bp ladder", why:"The gel is right, but the ladder has no bands near 6000–8000 bp." },
          { t:"A 2.0% gel with a 1 kb ladder", why:M5 }] } }
    ]
  },
  task:{
    title:"Plan the run", summary:"Plan the run",
    statement:"<p>Your PCR should give a 250 bp product, and a common side product is 300 bp. Plan a gel that will show which one you made. Can you find all the plans that work?</p><ol class=\"ge-tlist\"><li>The DNA enters the gel.</li><li>The ladder can size these bands.</li><li>The 250 and 300 bp bands end up at least 2.0 mm apart.</li><li>Small DNA stays on the gel: a 100 bp fragment is still on the 60 mm gel.</li></ol><p class=\"muted\">Voltage is fixed at 100 V.</p>",
    checks:["DNA enters the gel", "Ladder can size these bands", "250 and 300 bp at least 2.0 mm apart", "100 bp fragment still on the gel"],
    tips:[
      "DNA is negative. Put the wells where it will move <strong>into</strong> the gel.",
      "The 1 kb ladder’s smallest band is 1000 bp, far from 250 and 300.",
      "Close sizes need a higher percentage or a longer run.",
      "Long runs on low-percentage gels push small DNA off the end."
    ],
    wells:[["neg", "Negative end"], ["pos", "Positive end"]],
    ladders:[["l100", "100 bp ladder"], ["l1k", "1 kb ladder"]],
    gels:["0.8", "1.0", "1.5", "2.0"],
    times:[20, 40, 60, 80, 100],
    explainPrompt:"Explain how you chose the gel percentage and run time, and why the ladder and the wells’ position matter.",
    vocab:"Use the words negative charge, positive electrode, ladder, agarose percentage and fragment size.",
    after3:"A higher percentage spreads small fragments faster and slows everything down. That’s why 2.0% still works at 100 min, while 1.0% only works at exactly 80 min, the one time when the bands are far enough apart and the 100 bp band hasn’t run off.",
    afterAt:6
  },
  cards:[
    ["Gel electrophoresis", "Separating DNA fragments by size by pulling them through a gel with an electric field."],
    ["Which way does DNA move?", "Toward the <strong>positive</strong> electrode. Its phosphate backbone is negative."],
    ["Where do the wells go?", "At the negative end, so DNA moves into the gel."],
    ["Size and distance", "Smaller fragments travel farther; larger ones stay nearer the wells."],
    ["Why size, not charge?", "Every base pair carries the same charge, so the gel’s mesh decides the speed."],
    ["Ladder", "Fragments of known sizes run on the same gel; used to read the sizes of unknown bands."],
    ["Agarose percentage", "Higher % = smaller pores: slower, and better for small fragments. Lower % for large fragments."],
    ["Voltage and time", "More voltage or more time: every band travels farther, and gaps grow. Stop before small bands run off."],
    ["Standard curve", "Ladder sizes (log scale) vs distance: read an unknown’s size from its distance."],
    ["No-template control", "All PCR ingredients but no DNA template. It should show no band; a band means contamination."],
    ["DNA profile match", "Can’t exclude the person; strength depends on how rare the pattern is. One clear mismatch excludes."],
    ["Parentage rule", "Every band in a child must come from one parent or the other."]
  ]
};
