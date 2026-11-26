// SBI4U 10 Introduction to Metabolism. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/10-introduction-to-metabolism.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The enzyme lowers the hill, not the drop. The start and end energies, and so ΔG, are the same with or without it.";
const M2 = "ΔG &lt; 0 says the reaction <em>can</em> go on its own. Speed depends on the activation energy, so glucose sits in air for years without reacting.";
const M3 = "Coupled reactions add their ΔG values: +14 + (−30.5) = −16.5 kJ/mol.";
const M4 = "More substrate wins only against a competitive inhibitor, which competes for the active site. An allosteric inhibitor changes the enzyme’s shape, so more substrate can’t undo it.";
const M5 = "The end product switches off the <strong>first</strong> enzyme of the pathway, so no intermediates pile up.";
const M6 = "Energy is never destroyed (first law), but every conversion releases some as heat that cells can’t use (second law).";
const M7 = "Catabolic means breaking down into smaller molecules. Anabolic means building up bigger ones.";
const EA = "E<sub>a</sub>";
const S = "<i>S</i>";
const tbl = (rows, head) => '<div class="tbl-wrap"><table class="em-qt"><thead><tr>' + head.map(h => '<th scope="col">' + h + "</th>").join("") + "</tr></thead><tbody>" +
  rows.map(r => "<tr>" + r.map((c, i) => i ? "<td>" + c + "</td>" : '<th scope="row">' + c + "</th>").join("") + "</tr>").join("") + "</tbody></table></div>";
const BUILD = "Building large molecules stores energy in new bonds, so it’s uphill.";

export default {
  id:"10-introduction-to-metabolism",
  kind:"topic",
  title:"Introduction to metabolism",
  topic:"Introduction to Metabolism",
  readyTopic:"the introduction to metabolism",
  hero:{
    eq:'<span class="em-heq"><span class="bio-chem"><span class="em-c-atp">ATP</span> + H₂O → ADP + Pᵢ</span> <span class="em-hdg">ΔG ≈ −30.5 kJ/mol</span></span>',
    eqLabel:"ATP plus water gives ADP plus inorganic phosphate. Delta G is about minus 30.5 kilojoules per mole.",
    eqSize:"sm",
    headline:"Every reaction in you runs downhill, or gets pushed.",
    text:"Your cells run thousands of reactions a second. Together they are your <strong>metabolism</strong>. <strong>Catabolic</strong> reactions break molecules down and release free energy; <strong>anabolic</strong> reactions build molecules and need it. The free-energy change, <strong>ΔG</strong>, tells you which is which. <strong>Enzymes</strong> decide how fast it all happens.",
    fig:{ aria:"An energy diagram. Glucose sits high on the left, CO₂ and water sit lower on the right, and a tall hill stands between them. An enzyme arrives and lowers the hill to a third of its height; the glucose rolls over and down. The ΔG bracket on the right stays the same size.", shape:"wide" }
  },
  goals:[
    "I can tell catabolic from anabolic reactions and give examples of each.",
    "I can use the sign of ΔG to decide whether a reaction is exergonic or endergonic.",
    "I can explain how coupling to ATP hydrolysis drives an endergonic reaction, and calculate the net ΔG.",
    "I can explain how an enzyme speeds a reaction by lowering activation energy, without changing ΔG.",
    "I can tell competitive from allosteric inhibition from a description or from rate data, and explain feedback inhibition.",
    "I can use the first and second laws of thermodynamics to explain why cells lose energy as heat."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Energy in reactions", goal:1,
          prompt:"Which reaction releases energy to the surroundings?",
          options:[
            { t:"Burning wood", ok:true, why:"Combustion is exothermic: energy flows out as heat and light." },
            { t:"Melting ice", why:"Melting absorbs heat from the surroundings." },
            { t:"Charging a phone battery", why:"Charging stores energy; it takes energy in." },
            { t:"Building a protein from amino acids", why:"Building large molecules takes energy in." }],
          hints:["Does the surroundings’ temperature go up or down?", "Exothermic: heat flows out.", "Burning wood."] },
        { id:"w2", skill:"Energy in reactions", goal:2,
          prompt:"On an energy diagram, the products sit <strong>higher</strong> than the reactants. The reaction is…",
          options:[
            { t:"endothermic: energy is absorbed", ok:true, why:"Products hold more energy than reactants, so energy had to go in." },
            { t:"exothermic: energy is released", why:"Higher products means energy was added." },
            { t:"impossible", why:"It can happen if energy is supplied." },
            { t:"fast", why:"Height difference says nothing about speed." }],
          hints:["Compare the heights of the reactants and products.", "The products are higher.", "Energy was absorbed: endothermic."] },
        { id:"w3", skill:"Bonds and molecules", goal:1,
          prompt:"Hydrolysis of a dipeptide gives…",
          options:[
            { t:"two amino acids, using one water molecule", ok:true, why:"Hydro- (water) + -lysis (splitting): water breaks the peptide bond." },
            { t:"a tripeptide and water", why:"That builds a bigger molecule and releases water." },
            { t:"two amino acids and a water molecule released", why:"Water is used, not released." },
            { t:"glucose", why:"Peptides are made of amino acids, not sugars." }],
          hints:["What does hydro- mean?", "Water is added to break a bond.", "Two amino acids."] },
        { id:"w4", skill:"Bonds and molecules", goal:3,
          prompt:"ATP stands for…",
          options:[
            { t:"adenosine triphosphate", ok:true, why:"Adenine + ribose + three phosphate groups." },
            { t:"adenosine triprotein", why:"There’s no protein in ATP." },
            { t:"amino triphosphate", why:"Adenosine is adenine (a base) plus ribose (a sugar)." },
            { t:"adenosine diphosphate", why:"Di- means two: that’s ADP." }],
          hints:["Tri- means three.", "Three phosphate groups.", "Adenosine triphosphate."] },
        { id:"w5", skill:"Proteins and shape", goal:4,
          prompt:"Why does a protein’s shape matter?",
          options:[
            { t:"Its function depends on its 3D shape", ok:true, why:"An enzyme’s active site only fits substrates of the right shape." },
            { t:"Shape only affects its colour", why:"Shape determines what a protein binds." },
            { t:"All proteins have the same shape", why:"Different amino-acid sequences fold into different shapes." },
            { t:"Shape changes the amino-acid sequence", why:"The sequence decides the shape, not the other way round." }],
          hints:["Think about a lock and key.", "Binding needs a matching shape.", "Function depends on shape."] },
        { id:"w6", skill:"Proteins and shape", goal:5,
          prompt:"A protein is heated to 70 °C and stops working. Most likely…",
          options:[
            { t:"it denatured: its shape changed", ok:true, why:"Heat breaks the weak bonds that hold the folded shape." },
            { t:"its amino acids were destroyed", why:"The sequence (covalent peptide bonds) usually stays intact; the folding is lost." },
            { t:"it became a carbohydrate", why:"Heat doesn’t change what kind of molecule it is." },
            { t:"it worked faster and ran out", why:"Above its optimum, an enzyme slows and stops." }],
          hints:["What holds a protein’s 3D shape?", "Weak bonds break with heat.", "Denatured."] }
      ],
      refreshers:{
        "Energy in reactions":"Exothermic: energy out (products lower). Endothermic: energy in (products higher). Example: burning releases energy; photosynthesis absorbs it.",
        "Bonds and molecules":"Condensation joins molecules and releases water; hydrolysis uses water to split them. ATP is adenine + ribose + three phosphates.",
        "Proteins and shape":"A protein’s amino-acid sequence decides how it folds, and its folded shape decides its job. Heat or the wrong pH can unfold (denature) it."
      }
    }
  },
  explore:{
    heading:"Energy landscape",
    intro:"Pick a reaction and watch the ball try to cross the hill. Add an enzyme, or couple the reaction to ATP, and see what changes and what doesn’t.",
    modelNote:"Every activation energy, and ΔG for R3–R6, is a model value. Only −30.5 kJ/mol (ATP) and −2870 kJ/mol (glucose) are standard course values.",
    // Mode A reactions (plan table; kJ/mol). ea = activation energy without the enzyme, eaE = with it; model flags which values are model values.
    reactions:[
      { id:"R1", t:"Glucose + 6O₂ → 6CO₂ + 6H₂O", rl:"glucose + 6O₂", pl:"6CO₂ + 6H₂O", dg:-2870, ea:200, eaE:40, steps:8, cat:true, dgModel:false },
      { id:"R2", t:"ATP + H₂O → ADP + Pᵢ", rl:"ATP + H₂O", pl:"ADP + Pᵢ", dg:-30.5, ea:120, eaE:50, cat:true, dgModel:false },
      { id:"R3", t:"Sucrose + H₂O → glucose + fructose", rl:"sucrose + H₂O", pl:"glucose + fructose", dg:-29, ea:110, eaE:45, cat:true, dgModel:true },
      { id:"R4", t:"Glucose + fructose → sucrose + H₂O", rl:"glucose + fructose", pl:"sucrose + H₂O", dg:29, ea:110, eaE:45, cat:false, dgModel:true, couple:true },
      { id:"R5", t:"Glutamate + NH₃ → glutamine + H₂O", rl:"glutamate + NH₃", pl:"glutamine + H₂O", dg:14, ea:90, eaE:35, cat:false, dgModel:true, couple:true },
      { id:"R6", t:"“Reaction X” (an anabolic step)", rl:"reactants", pl:"products", dg:40, ea:100, eaE:40, cat:false, dgModel:true, couple:true }
    ],
    // Mode B conversions. Typical cell values are approximate.
    conversions:[
      { id:"B1", t:"Glucose → ATP in a muscle cell", lo:34, hi:38, typ:"≈ 34–38%" },
      // VERIFY: B2 typical value (plan: "≈ 1–2% of sunlight striking the leaf", marked verify before release).
      { id:"B2", t:"Light → sugar in a leaf", lo:1, hi:2, typ:"≈ 1–2% of sunlight striking the leaf" },
      { id:"B3", t:"ATP → muscle movement", lo:25, hi:25, typ:"≈ 25%" }
    ],
    blocked:"No real conversion reaches 100%: the second law.",
    blockedRow:"Blocked: some energy is always released as heat",
    runMsg:{
      back:"Uphill: the ball climbs part way and rolls back. With net ΔG above zero, the reaction can’t proceed on its own.",
      stuck:"Downhill overall… but the hill is in the way. Almost no reaction.",
      slow:"Downhill, and the hill is medium-sized: it crosses, but slowly.",
      fast:"Downhill with a low hill: it crosses quickly."
    },
    predIntro:"Make a prediction first. Then the energy landscape will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Glucose has a ΔG of −2870 kJ/mol when it’s oxidized. What happens when you press Run without enzymes?",
        options:[
          { t:"The ball can’t get over the hill: almost no reaction", ok:true },
          { t:"It crosses quickly because ΔG is so negative" },
          { t:"It crosses, then rolls back" },
          { t:"It explodes" }],
        explain:"A big negative ΔG means lots of energy <em>can</em> be released, but the activation energy is high. Sugar in a bowl doesn’t burst into flame.",
        start:{ r:"R1", enz:false, n:0 }, act:"run" },
      { id:"p2", prompt:"R3, toggle the enzyme on. What will the enzyme change?",
        options:[
          { t:"Only the height of the hill", ok:true },
          { t:"Only ΔG" },
          { t:"Both the hill and ΔG" },
          { t:"Neither" }],
        explain:"Enzymes lower activation energy. The reactants and products are the same, so ΔG is the same.",
        start:{ r:"R3", enz:false, n:0 }, act:"enzyme" },
      { id:"p3", prompt:"R5, enzyme on, 0 ATP, Run. Will the reaction proceed?",
        options:[
          { t:"No: it’s uphill (ΔG = +14)", ok:true },
          { t:"Yes: the enzyme makes it go" },
          { t:"Yes, but slowly" },
          { t:"Only backwards" }],
        explain:"An enzyme can’t push a reaction uphill. Something has to supply energy.",
        start:{ r:"R5", enz:true, n:0 }, act:"run" },
      { id:"p4", prompt:"Now set 1 ATP. Net ΔG becomes…",
        options:[
          { t:"−16.5 kJ/mol", ok:true },
          { t:"+44.5 kJ/mol" },
          { t:"−30.5 kJ/mol" },
          { t:"+14 kJ/mol" }],
        explain:"Coupled reactions add: +14 + (−30.5) = −16.5.",
        start:{ r:"R5", enz:true, n:0 }, act:"atp" }
    ],
    challenges:[
      { id:"tc1", goal:3, prompt:"Make R5 proceed on its own, using the fewest ATP.",
        why:"+14 + (−30.5) = −16.5 kJ/mol, which is below zero, so one ATP is enough.",
        general:"Choose R5, then set the number of ATP so the net ΔG is just below zero.",
        named:{ mode:"Switch to Mode A (Landscape) first.", rx:"Choose R5 (glutamate + NH₃ → glutamine + H₂O) first.",
          spare:"It proceeds, but one ATP was already enough. Cells don’t waste ATP.", enz0:"The enzyme only lowers the hill; ΔG is still +14.",
          zero:"ΔG is still +14 kJ/mol: uphill. Something has to supply energy." },
        hints:["What must the sign of the net ΔG be?", "Each ATP adds −30.5 kJ/mol.", "+14 − 30.5 = −16.5 &lt; 0. One ATP is enough."] },
      { id:"tc2", goal:[3, 4], prompt:"Make R6 (Reaction X) both possible <strong>and</strong> fast.",
        why:"2 ATP: +40 − 61 = −21 kJ/mol, so it can proceed; the enzyme lowers the hill to 40 kJ/mol, so it’s fast.",
        general:"Choose R6. Then fix two separate problems: the sign of the net ΔG and the height of the hill.",
        named:{ mode:"Switch to Mode A (Landscape) first.", rx:"Choose R6 (Reaction X) first.", n1:"+40 − 30.5 = +9.5: still uphill.",
          noEnz:"It’s downhill now, but the hill is 100 kJ/mol: very slow.", n3:"Possible and fast, but one ATP is wasted. Try 2.",
          zero:"+40 kJ/mol is uphill, and an enzyme lowers only the hill. Something has to supply energy." },
        hints:["Two separate problems: the sign of ΔG and the height of the hill.", "One ATP gives +9.5. How many make it negative?", "2 ATP: +40 − 61 = −21 kJ/mol; then switch the enzyme on."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Mode B, conversion B1. Set the useful output to the textbook value for respiration (36 ATP × 30.5 kJ/mol out of 2870 kJ/mol), rounded to the nearest 5." +
          '<p class="uses"><strong>Use these values</strong>36 × 30.5 = 1098; 1098 ÷ 2870 ≈ 0.38.</p>',
        why:"36 × 30.5 = 1098 kJ/mol, and 1098 ÷ 2870 ≈ 0.38: 38%, which rounds to 40. The rest, about 62%, is released as heat.",
        general:"Useful energy = 36 × 30.5 = 1098 kJ/mol out of 2870 kJ/mol. What percentage is that, to the nearest 5?",
        named:{ mode:"Switch to Mode B (Energy accounting) first.", conv:"Choose conversion B1 (glucose → ATP in a muscle cell).",
          blocked:"Blocked: no real conversion reaches 100%. Some energy is always released as heat (the second law).",
          u35:"38% is closer to 40 than to 35.", u30:"That’s closer to the current estimate with about 30 ATP: 30 × 30.5 = 915, ≈ 32%. The question asks for the textbook 36." },
        hints:["Useful energy = number of ATP × 30.5 kJ/mol.", "36 × 30.5 = 1098 kJ/mol.", "1098 ÷ 2870 ≈ 0.38, so 38%, which rounds to 40 on the slider. The rest, about 62%, is heat."] }
    ]
  },
  part3:{
    slug:"enzymes", name:"Enzymes", heading:"Enzymes and their control",
    intro:"Explore showed <em>what</em> an enzyme does to energy. Here you zoom in to <em>how</em>: the active site, inhibitors, and the control of whole pathways. Station 2 swaps the energy diagram for a rate graph, so you read and generate rate data.",
    st1:{ title:"Station 1: Zoom to the molecules (the active site)",
      how:"Step through one turn of an enzyme. Switch between the induced-fit model and the older lock-and-key model, then move the temperature and pH away from the optimum and step through again.",
      steps:["The substrate approaches.", "The active site changes shape slightly to grip it (induced fit).", "The enzyme–substrate complex forms.", "The bonds strain, and the products leave.", "The enzyme is unchanged and ready again."],
      short:["substrate approaches", "induced fit", "complex forms", "products leave", "enzyme ready again"],
      lock:"Lock and key (the older model): the active site already has exactly the substrate’s shape, like a lock for a key. Nothing changes shape as it binds.",
      denat:"The active site has lost its shape (the enzyme is denatured), so the substrate can’t bind and no enzyme–substrate complex forms.",
      poor:"The active site is distorted, so the substrate fits poorly and the rate drops.",
      note:"Model enzyme from the human body: optimum 37 °C and pH 7; it denatures above about 45 °C." },
    st2:{ title:"Station 2: Check it with data (inhibitors)",
      how:"Move the substrate concentration (the independent variable) and read the rate (the dependent variable) for the enzyme alone, with a competitive inhibitor, and with an allosteric inhibitor.",
      curves:"Model curves: no inhibitor, rate = 100<i>S</i> ÷ (2 + <i>S</i>); competitive, rate = 100<i>S</i> ÷ (6 + <i>S</i>); allosteric, rate = 50<i>S</i> ÷ (2 + <i>S</i>). Rates in model units; <i>S</i> in mM.",
      key:"At low substrate both inhibitors look the same. Add lots of substrate and the competitive inhibitor is out-competed, but the allosteric one isn’t.",
      comp:"Competitive inhibitor: it looks like the substrate and sits in the active site.",
      allo:"Allosteric inhibitor: it binds a second site and bends the active site shut." },
    st3:{ title:"Station 3: Feedback inhibition",
      how:"Raise the amount of the end product D. D binds the allosteric site of enzyme 1, the first enzyme of the pathway.",
      example:"Real example: high ATP inhibits phosphofructokinase, an early enzyme of glycolysis (module 14)." },
    quickCheck:{
      title:"Quick check", summary:"Enzymes and their control quick check",
      items:[
        { id:"q1", goal:5, prompt:"Adding much more substrate restores the full rate. The inhibitor is…",
          choices:[{ t:"competitive", ok:true, fb:"Only a competitor for the active site can be out-numbered by substrate." },
            { t:"allosteric", fb:"Only a competitor for the active site can be out-numbered by substrate." },
            { t:"a denatured enzyme", fb:"Only a competitor for the active site can be out-numbered by substrate." },
            { t:"an activator", fb:"Only a competitor for the active site can be out-numbered by substrate." }] },
        { id:"q2", goal:5, prompt:"In feedback inhibition, the end product usually inhibits…",
          choices:[{ t:"the first enzyme", ok:true, fb:"Stopping the first step stops the whole pathway without wasting intermediates." },
            { t:"the last enzyme", fb:"Stopping the first step stops the whole pathway without wasting intermediates." },
            { t:"every enzyme", fb:"Stopping the first step stops the whole pathway without wasting intermediates." },
            { t:"the substrate", fb:"Stopping the first step stops the whole pathway without wasting intermediates." }] },
        { id:"q3", goal:4, prompt:"An enzyme’s activity drops sharply above 45 °C because…",
          choices:[{ t:"its active site loses its shape", ok:true, fb:"Heat denatures the protein; ΔG isn’t changed by the enzyme at all." },
            { t:"it runs out of ATP", fb:"Heat denatures the protein; ΔG isn’t changed by the enzyme at all." },
            { t:"ΔG becomes positive", fb:"Heat denatures the protein; ΔG isn’t changed by the enzyme at all." },
            { t:"the substrate melts", fb:"Heat denatures the protein; ΔG isn’t changed by the enzyme at all." }] },
        { id:"q4", goal:5, prompt:"At " + S + " = 18 mM, the rates are 90 (no inhibitor), 75 and 45. Which is the allosteric inhibitor?",
          choices:[{ t:"45", ok:true, fb:"The allosteric inhibitor lowers the maximum rate, so it stays low even with lots of substrate." },
            { t:"75", fb:"The allosteric inhibitor lowers the maximum rate, so it stays low even with lots of substrate." },
            { t:"90", fb:"The allosteric inhibitor lowers the maximum rate, so it stays low even with lots of substrate." },
            { t:"can’t tell", fb:"The allosteric inhibitor lowers the maximum rate, so it stays low even with lots of substrate." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Catabolic or anabolic? Exergonic or endergonic?", summary:"Catabolic or anabolic?", goal:[1, 2], noun:"reaction", txt:true,
        instruction:"Sort each reaction into the box that describes it. Not every box must be used.",
        doneNote:"Breaking down usually releases free energy; building up usually needs it.",
        boxes:[
          { id:"b1", label:"Catabolic, exergonic" },
          { id:"b2", label:"Anabolic, endergonic" },
          { id:"b3", label:"Catabolic, endergonic" },
          { id:"b4", label:"Anabolic, exergonic" }],
        items:[
          { id:"i1", t:"Digesting starch into glucose", answer:"b1", why:"Starch is broken into smaller glucose molecules, and free energy is released.", wrong:{ b2:M7, b4:M7 } },
          { id:"i2", t:"Photosynthesis making glucose", answer:"b2", why:"Glucose is built from CO₂ and water using light energy: uphill.", wrong:{ b1:BUILD, b4:BUILD } },
          { id:"i3", t:"Joining amino acids into a protein", answer:"b2", why:"A large molecule is built up, and that needs free energy.", wrong:{ b1:BUILD, b4:BUILD } },
          { id:"i4", t:"Cellular respiration of glucose", answer:"b1", why:"Glucose is broken down to CO₂ and water, releasing free energy (ΔG ≈ −2870 kJ/mol)." },
          { id:"i5", t:"ATP → ADP + Pᵢ", answer:"b1", why:"Breaking off a phosphate releases free energy (ΔG ≈ −30.5 kJ/mol)." },
          { id:"i6", t:"Building glycogen from glucose in the liver", answer:"b2", why:"Glycogen is built from many glucose molecules, and that needs free energy.", wrong:{ b1:BUILD, b4:BUILD } },
          { id:"i7", t:"Breaking a fat into glycerol and fatty acids", answer:"b1", why:"The fat is broken into smaller molecules, and free energy is released.", wrong:{ b2:"Glycerol and fatty acids are smaller than the fat.", b4:"Glycerol and fatty acids are smaller than the fat." } },
          { id:"i8", t:"Copying DNA (joining nucleotides)", answer:"b2", why:"Nucleotides are joined into a long strand: building up, which needs free energy.", wrong:{ b1:BUILD, b4:BUILD } },
          { id:"i9", t:"ADP + Pᵢ → ATP", answer:"b2", why:"It’s the reverse of ATP → ADP + Pᵢ, so the sign of ΔG flips: +30.5 kJ/mol.",
            wrong:{ b1:"Making ATP joins a phosphate on: building up, and it needs energy (ΔG ≈ +30.5).", b3:"Making ATP joins a phosphate on: building up, and it needs energy (ΔG ≈ +30.5)." },
            hints:["Is ADP + Pᵢ → ATP the reverse of item 5 (ATP → ADP + Pᵢ)?", "Reversing a reaction flips the sign of ΔG.", "+30.5 kJ/mol: anabolic, endergonic."] },
          { id:"i10", t:"Breaking down a protein into amino acids", answer:"b1", why:"The protein is broken into smaller amino acids, and free energy is released.", wrong:{ b2:M7, b4:M7 } }],
        wrongDefault:"Ask two questions: is a molecule being broken down or built up, and does that release free energy or need it?" },
      { id:"calc", type:"custom", title:"ΔG calculator", summary:"ΔG calculator", star:true, goal:[2, 3, 6],
        instruction:"Seven calculations. Type each ΔG with its sign: + for endergonic (uphill), − for exergonic (downhill). Decimals are fine. The last four are non-routine (★).",
        items:[
          { id:"d1", kind:"dg", goal:3, prompt:"ΔG of a reaction is +18 kJ/mol. Coupled with 1 ATP, the net ΔG is…",
            answer:-12.5, display:"−12.5 kJ/mol", unit:"kJ/mol", why:"+18 + (−30.5) = −12.5 kJ/mol.",
            wrong:[{ match:48.5, fb:"ATP hydrolysis is −30.5, so add a negative." }] },
          { id:"d2", kind:"dg", goal:2, prompt:"ΔG of A → B is −12 kJ/mol. What is ΔG of B → A?",
            answer:12, display:"+12 kJ/mol", unit:"kJ/mol", why:"Reversing a reaction flips the sign of ΔG.",
            wrong:[{ match:-12, fb:"Reversing a reaction flips the sign." }] },
          { id:"d3", kind:"num", goal:3, prompt:"How many ATP must be coupled to make a +50 kJ/mol step exergonic?",
            answer:2, display:"2 ATP", unit:"ATP", why:"+50 − 61 = −11 kJ/mol, which is below zero.",
            wrong:[{ match:1, fb:"+50 − 30.5 = +19.5: still uphill." }] },
          { id:"d4", kind:"dg", goal:2, star:true, prompt:"A two-step pathway: A → B (+20 kJ/mol), then B → C (−35 kJ/mol). What is ΔG for A → C?",
            answer:-15, display:"−15 kJ/mol", unit:"kJ/mol", why:"+20 + (−35) = −15 kJ/mol.",
            wrong:[{ match:55, fb:"Add the steps with their signs: +20 + (−35)." }, { match:-55, fb:"Add the steps with their signs: +20 + (−35)." }] },
          { id:"d5", kind:"dg", goal:2, star:true, prompt:"An enzyme lowers " + EA + " from 80 to 30 kJ/mol for a reaction with ΔG = −20 kJ/mol. What is ΔG with the enzyme?",
            answer:-20, display:"−20 kJ/mol", unit:"kJ/mol", why:"The enzyme changes " + EA + " only; ΔG stays −20 kJ/mol.",
            wrong:[{ match:-70, fb:"The enzyme changes " + EA + " only; ΔG stays −20." }, { match:30, fb:"The enzyme changes " + EA + " only; ΔG stays −20." }] },
          { id:"d6", kind:"num", goal:6, star:true, prompt:"A cell makes 3 ATP from a step that releases 120 kJ/mol. What percentage of the energy is captured in ATP? (Use 30.5 × 3 = 91.5.)",
            use:"91.5 ÷ 120 ≈ 0.76", answer:76, tol:1, display:"≈ 76%", unit:"%", why:"91.5 ÷ 120 ≈ 0.76, so about 76% is captured; the rest is released as heat.",
            wrong:[{ match:24, fb:"That’s the heat lost, not the energy captured." }],
            hints:["Captured = 91.5 kJ/mol.", "91.5 ÷ 120.", "≈ 0.76, so about 76%."] },
          { id:"d7", kind:"pair", goal:3, star:true, prompt:"Step 1: +30 kJ/mol. Step 2: −10 kJ/mol. Step 3: +8 kJ/mol. What is the fewest ATP that makes the whole pathway exergonic, and what is the net ΔG then?",
            labels:["Fewest ATP", "Net ΔG (kJ/mol)"], answer:[1, -2.5], display:"1 ATP; −2.5 kJ/mol", why:"+30 − 10 + 8 = +28; +28 − 30.5 = −2.5 kJ/mol, which is exergonic.",
            general:"+30 − 10 + 8 = +28; +28 − 30.5 = −2.5.",
            hints:["Add the three steps first.", "+30 − 10 + 8 = +28 kJ/mol.", "One ATP: +28 − 30.5 = −2.5 kJ/mol, which is exergonic."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Divya", how:"",
        instruction:"Divya made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Explain why sucrose doesn’t break down in a sugar bowl, even though its hydrolysis is exergonic.",
            steps:["Sucrose hydrolysis has ΔG ≈ −29 kJ/mol, so it’s exergonic.", "Exergonic reactions happen quickly.", "So sucrose must need a catalyst to become exergonic.", "Sucrase supplies the missing energy."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 builds on step 2. The mistake is earlier.", "This follows from the earlier mistake."],
            fixes:[
              { t:"Exergonic means it <em>can</em> proceed, but its activation energy is high, so it’s very slow without an enzyme. Sucrase lowers " + EA + ".", ok:true, why:M2 },
              { t:"Exergonic reactions never happen without ATP.", why:"ATP isn’t needed for a downhill reaction." },
              { t:"Sucrose hydrolysis is actually endergonic.", why:"ΔG ≈ −29: it’s exergonic." },
              { t:"Step 2 is correct.", why:"Speed depends on activation energy, not on ΔG." }],
            hints:["Does ΔG tell you the speed?", "No: the hill height (" + EA + ") does.", "The fix that says the activation energy is high, so it’s very slow without an enzyme."] },
          { id:"e2", goal:6, task:"A runner’s muscles convert ATP into movement. Where does the energy go?",
            steps:["ATP hydrolysis releases free energy.", "Some of it moves the muscle proteins.", "The rest of the energy is destroyed.", "That’s why the runner’s temperature stays the same."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"The rest is released as heat. Energy isn’t destroyed (first law), and no conversion is 100% efficient (second law), so the runner warms up.", ok:true, why:M6 },
              { t:"The rest is stored as new ATP.", why:"Hydrolyzed ATP doesn’t re-form by itself." },
              { t:"All of it moves the muscles.", why:M6 },
              { t:"Step 3 is correct.", why:"The first law says energy is never destroyed." }],
            hints:["Can energy be destroyed?", "What do you feel during a run?", "Heat: the fix that says the rest is released as heat."] },
          { id:"e3", goal:5, task:"A drug slows an enzyme. Doubling the substrate concentration does not restore the rate. Classify the drug.",
            steps:["The drug lowers the reaction rate, so it’s an inhibitor.", "Extra substrate didn’t help.", "So the drug must be binding the active site and blocking it.", "It’s a competitive inhibitor."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct: that’s the key observation.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Extra substrate would out-compete an active-site blocker. Since it didn’t, the drug binds elsewhere: an allosteric (non-competitive) inhibitor.", ok:true, why:M4 },
              { t:"The drug must be denaturing the substrate.", why:"Substrates aren’t proteins that denature." },
              { t:"It’s an activator.", why:"The rate went down." },
              { t:"Step 3 is correct.", why:"If it competed for the active site, more substrate would win." }],
            hints:["Which inhibitor can be out-competed?", "A competitive one.", "Not out-competed, so allosteric: the fix that says the drug binds elsewhere."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the energy landscape: that the enzyme left ΔG alone, or that sugar needs a push to react?" },
      { id:"j2", q:"In your own words, what’s the difference between whether a reaction <em>can</em> happen and how <em>fast</em> it happens?" },
      { id:"j3", q:"Explain to a friend how one ATP lets a cell build glutamine, using numbers." },
      { id:"j4", q:"Which idea is still fuzzy: ΔG signs, inhibitors, or the second law? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a catabolic reaction?", options:[
          { t:"Hydrolysis of glycogen into glucose", ok:true, why:"A large molecule is broken into smaller ones." },
          { t:"Joining glucose molecules into starch", why:"That builds a larger molecule: anabolic." },
          { t:"Making DNA from nucleotides", why:"Building up: anabolic." },
          { t:"ADP + Pᵢ → ATP", why:"Adding a phosphate builds ATP: anabolic." }] },
        b:{ prompt:"Which is an anabolic reaction?", options:[
          { t:"Joining amino acids into a protein", ok:true, why:"Building a larger molecule." },
          { t:"Breaking a fat into fatty acids", why:"Breaking down: catabolic." },
          { t:"ATP → ADP + Pᵢ", why:"Breaking off a phosphate: catabolic." },
          { t:"Respiration of glucose", why:"Glucose is broken down to CO₂ and water." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"What does an enzyme change about a reaction?", options:[
          { t:"It lowers the activation energy", ok:true, why:"So more molecules cross the hill each second." },
          { t:"It makes ΔG more negative", why:"Reactants and products are unchanged, so ΔG is too." },
          { t:"It supplies energy to uphill reactions", why:"Enzymes don’t supply energy; ATP coupling does." },
          { t:"It is used up in the reaction", why:"An enzyme is unchanged and reused." }] },
        b:{ prompt:"Which is true of a reaction with and without its enzyme?", options:[
          { t:"ΔG is the same; the activation energy is lower with the enzyme", ok:true, why:"The enzyme lowers the hill, not the drop." },
          { t:"ΔG is more negative with the enzyme", why:M1 },
          { t:"Both ΔG and activation energy are lower with the enzyme", why:M1 },
          { t:"The products are different with the enzyme", why:"Same reactants, same products." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"A competitive inhibitor binds to…", options:[
          { t:"the active site", ok:true, why:"It competes with the substrate for the same place." },
          { t:"an allosteric site", why:"That’s where non-competitive (allosteric) inhibitors bind." },
          { t:"the substrate", why:"Inhibitors bind the enzyme, not the substrate." },
          { t:"the product", why:"Inhibitors act on the enzyme." }] },
        b:{ prompt:"An allosteric inhibitor binds to…", options:[
          { t:"a site other than the active site, changing the enzyme’s shape", ok:true, why:"The shape change bends the active site, so the substrate fits poorly." },
          { t:"the active site", why:"That’s a competitive inhibitor." },
          { t:"the substrate", why:"Inhibitors bind the enzyme." },
          { t:"ATP", why:"Allosteric inhibitors bind the enzyme itself." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Rates (units) for an enzyme with and without a drug:" + tbl([["2", "50", "25"], ["18", "90", "75"]], [S + " (mM)", "No drug", "With drug"]) + "What kind of inhibitor is the drug?", options:[
          { t:"Competitive: its effect shrinks as substrate increases", ok:true, why:"At high " + S + " the rate approaches the uninhibited rate." },
          { t:"Allosteric: it lowers the rate at both concentrations", why:"An allosteric inhibitor would keep the rate far below at high " + S + ": about half." },
          { t:"Not an inhibitor: the rate still rises with " + S, why:"Every enzyme’s rate rises with " + S + "; the drug lowers it." },
          { t:"It denatures the enzyme", why:"A denatured enzyme wouldn’t speed up with more substrate." }] },
        b:{ prompt:"Rates (units) with and without a second drug:" + tbl([["2", "50", "25"], ["18", "90", "45"]], [S + " (mM)", "No drug", "With drug"]) + "What kind of inhibitor is it?", options:[
          { t:"Allosteric: the rate stays about half even at high substrate", ok:true, why:"Extra substrate can’t undo a shape change, so the maximum rate stays halved." },
          { t:"Competitive: it lowers the rate at low " + S, why:"A competitor would be out-competed at high " + S + "." },
          { t:"It’s an activator", why:"The rate went down." },
          { t:"It is the substrate", why:"The substrate raises the rate." }] } },
      { id:"t2", cat:"T", goal:[2, 3],
        a:{ prompt:"A cell needs to run a reaction with ΔG = +45 kJ/mol. It couples it to 2 ATP. Which is correct?", options:[
          { t:"Net ΔG = −16 kJ/mol, so the coupled reaction can proceed", ok:true, why:"+45 − 61 = −16." },
          { t:"Net ΔG = +106 kJ/mol, so it can’t proceed", why:"ATP hydrolysis is negative: subtract." },
          { t:"Net ΔG = +14.5 kJ/mol; it needs a third ATP", why:"That’s with only one ATP: +45 − 30.5." },
          { t:"It proceeds quickly because the net ΔG is negative", why:"Negative ΔG says it <em>can</em> proceed; speed needs an enzyme." }] },
        b:{ prompt:"A reaction has ΔG = +20 kJ/mol and is coupled to 1 ATP. Which is correct?", options:[
          { t:"Net ΔG = −10.5 kJ/mol, so it can proceed", ok:true, why:"+20 + (−30.5) = −10.5." },
          { t:"Net ΔG = +50.5 kJ/mol", why:"Coupled reactions add their ΔG values: +20 + (−30.5) = −10.5 kJ/mol." },
          { t:"Net ΔG = +20 kJ/mol, because ATP doesn’t change ΔG", why:"Coupled reactions add their ΔG values." },
          { t:"It proceeds fast because it’s now exergonic", why:M2 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"In a bacterium, the pathway threonine → (enzyme 1) → … → (enzyme 5) → isoleucine is controlled by feedback inhibition. Isoleucine builds up. What happens?", options:[
          { t:"Isoleucine inhibits enzyme 1, so the whole pathway slows", ok:true, why:"Switching off the first step saves threonine and avoids wasted intermediates." },
          { t:"Isoleucine inhibits enzyme 5, so intermediates pile up", why:"Blocking the last step would waste the earlier steps’ products." },
          { t:"Threonine is destroyed", why:"Feedback inhibition slows an enzyme; it doesn’t destroy the substrate." },
          { t:"The pathway speeds up to use the isoleucine", why:"Excess product slows its own making." }] },
        b:{ prompt:"In the same pathway, the cell suddenly uses up all its isoleucine to build proteins. What happens to enzyme 1?", options:[
          { t:"Its inhibition is released, so the pathway speeds up", ok:true, why:"With no isoleucine bound to its allosteric site, enzyme 1 works again." },
          { t:"It stays inhibited until more threonine arrives", why:"The inhibitor is isoleucine, not threonine." },
          { t:"Enzyme 5 is inhibited instead", why:M5 },
          { t:"It is denatured", why:"Feedback inhibition is reversible binding, not denaturing." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why your body stays warm while you rest?", options:[
          { t:"“Every metabolic conversion releases some energy as heat. Energy isn’t destroyed (first law), and no conversion is 100% efficient (second law), so that heat warms the body.”", ok:true, why:"It uses both laws: energy is conserved, and every conversion releases some heat." },
          { t:"“Cells destroy energy they don’t need, which makes heat.”", why:"Energy is never destroyed." },
          { t:"“Enzymes produce heat when they speed up reactions.”", why:"The heat comes from the reactions’ energy, not from the enzyme." },
          { t:"“Resting cells don’t use energy, so the heat comes from outside.”", why:"Cells metabolize constantly, even at rest." }] },
        b:{ prompt:"Which is the best explanation of why a cell can’t turn all of glucose’s energy into ATP?", options:[
          { t:"“Each energy conversion releases some energy as heat (second law), so only part of glucose’s free energy ends up in ATP.”", ok:true, why:"No conversion is 100% efficient; the rest becomes heat." },
          { t:"“Some energy is destroyed in each step.”", why:M6 },
          { t:"“Enzymes absorb part of the energy.”", why:"Enzymes are unchanged; they don’t absorb energy." },
          { t:"“ATP can’t store more than 30.5 kJ/mol, so the rest is used up.”", why:M6 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which energy diagram description correctly compares a reaction with and without its enzyme?", options:[
          { t:"“The same starting and ending heights; a lower hill with the enzyme.”", ok:true, why:"The enzyme lowers the hill, not the drop." },
          { t:"“A lower ending height with the enzyme.”", why:"Products are the same, so the ending height is the same." },
          { t:"“A taller hill with the enzyme, because the enzyme must be broken.”", why:"The hill is lower." },
          { t:"“No hill at all with the enzyme.”", why:"Enzymes lower activation energy but don’t remove it." }] },
        b:{ prompt:"A student draws the uncatalyzed reaction as a hill from 50 up to 150 and down to 20 kJ/mol. With an enzyme the peak falls to 90. What is ΔG with the enzyme?", options:[
          { t:"−30 kJ/mol, the same as without it", ok:true, why:"20 − 50 = −30 in both cases." },
          { t:"−70 kJ/mol", why:"That’s 20 − 90, using the peak instead of the start." },
          { t:"+40 kJ/mol", why:"That’s 90 − 50: the new activation energy." },
          { t:"−60 kJ/mol", why:"The enzyme doesn’t change ΔG." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Methanol is poisonous because the liver enzyme alcohol dehydrogenase converts it into a toxic product. Doctors may give ethanol, which the same enzyme also acts on. How does this help?", options:[
          { t:"Ethanol competes for the enzyme’s active site, so less methanol is converted", ok:true, why:"A competitive inhibitor in action; the methanol is then excreted more slowly but safely." },
          { t:"Ethanol denatures the enzyme", why:"Ethanol is a substrate here, not a denaturant." },
          { t:"Ethanol binds an allosteric site and switches off the liver", why:"It competes at the active site." },
          { t:"Ethanol reacts with methanol to neutralize it", why:"The two compete for the enzyme; they don’t react together." }] },
        b:{ prompt:"A pesticide binds to an insect enzyme away from its active site and bends the active site shut. Spraying more of the enzyme’s normal substrate into the insect…", options:[
          { t:"won’t restore the enzyme’s activity, because the inhibition is allosteric", ok:true, why:"Extra substrate can’t reopen an active site that has been bent shut." },
          { t:"restores activity, because the substrate out-competes it", why:M4 },
          { t:"denatures the enzyme", why:"Substrate doesn’t denature enzymes." },
          { t:"makes the reaction endergonic", why:"Inhibitors don’t change ΔG." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Muscle cells link creatine and phosphate to make creatine phosphate (ΔG ≈ +43 kJ/mol, model value). How many ATP must be hydrolyzed, at a minimum, to drive this?", options:[
          { t:"2", ok:true, why:"+43 − 30.5 = +12.5 (still uphill); +43 − 61 = −18." },
          { t:"1", why:"One ATP leaves +12.5 kJ/mol: still endergonic." },
          { t:"0, if an enzyme is present", why:M1 },
          { t:"3", why:"It works, but 2 is the minimum." }] },
        b:{ prompt:"A plant cell runs a step with ΔG ≈ +58 kJ/mol (model value). What is the fewest ATP that makes the coupled reaction exergonic, and what is the net ΔG?", options:[
          { t:"2 ATP; net ΔG = −3 kJ/mol", ok:true, why:"+58 − 61 = −3." },
          { t:"1 ATP; net ΔG = +27.5 kJ/mol", why:"Still uphill." },
          { t:"2 ATP; net ΔG = +119 kJ/mol", why:"ATP hydrolysis is −30.5 kJ/mol each: subtract, don’t add." },
          { t:"0 ATP, with enough enzyme", why:M1 }] } }
    ]
  },
  task:{
    title:"Couple it, don’t waste it", summary:"Couple it, don’t waste it",
    statement:"<p>You’re designing one step of a cell’s metabolism. Choose a reaction, the number of ATP to couple, and whether an enzyme is present, so that every condition is met. Can you find all the answers?</p>" +
      '<ol class="em-conds"><li>The coupled reaction is exergonic (net ΔG &lt; 0).</li><li>No ATP is wasted: with one fewer ATP, the net ΔG would not be negative.</li><li>It is fast: an enzyme is present.</li><li>It doesn’t waste energy as heat: the net ΔG is −20 kJ/mol or higher (closer to zero).</li></ol>',
    reactions:[14, 25, 40, 55],
    modelNote:"Each ATP adds −30.5 kJ/mol. The hill in the diagram is a model value: 100 kJ/mol without an enzyme, 40 kJ/mol with one.",
    checks:["Exergonic overall", "No spare ATP", "Fast", "Not too much heat"],
    tips:["Each ATP adds −30.5 kJ/mol. The total must be below zero.", "Remove one ATP: if it’s still exergonic, that ATP was spare.", "Without an enzyme the hill is too high to cross quickly.", "A very negative net ΔG means lots of energy is lost as heat. Try a reaction whose ΔG is closer to a multiple of 30.5."],
    explainPrompt:"Explain how you chose the number of ATP, and why switching the enzyme on didn’t change the net ΔG.",
    vocab:"Use the words exergonic, endergonic, coupling, activation energy and ΔG.",
    more:"Can you find all the answers?",
    allFound:"You’ve found all three answers.",
    after3:"The +40 reaction needs 2 ATP, which gives −21: just past the heat limit. Cells match their ATP use to the job."
  },
  cards:[
    ["Metabolism", "All the chemical reactions in a cell."],
    ["Catabolic", "Breaks large molecules into smaller ones; usually releases free energy (respiration)."],
    ["Anabolic", "Builds large molecules from smaller ones; needs free energy (photosynthesis, protein synthesis)."],
    ["ΔG &lt; 0", "Exergonic: free energy is released; the reaction can proceed on its own."],
    ["ΔG &gt; 0", "Endergonic: needs an energy input, often from coupling to ATP."],
    ["ATP hydrolysis", "ATP + H₂O → ADP + Pᵢ, ΔG ≈ −30.5 kJ/mol."],
    ["Coupling", "Add the ΔG values: +14 + (−30.5) = −16.5 kJ/mol, so the pair proceeds."],
    ["Activation energy", "The energy hill to start a reaction. Enzymes lower it; ΔG stays the same."],
    ["Induced fit", "The active site changes shape slightly to grip the substrate, forming the enzyme–substrate complex."],
    ["Competitive vs allosteric inhibitor", "Competitive: active site, overcome by more substrate. Allosteric: another site, changes shape, not overcome."],
    ["Feedback inhibition", "A pathway’s end product inhibits its first enzyme."],
    ["Laws of thermodynamics", "1st: energy is converted, not created or destroyed. 2nd: every conversion loses some as heat."]
  ]
};
