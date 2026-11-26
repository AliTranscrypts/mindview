// SBI4U 26 The lac Operon. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/26-the-lac-operon.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "With glucose around, cAMP is low and CAP doesn’t help, so transcription is only <strong>low</strong>.";
const M2 = "<i>lacI</i> is always transcribed. The repressor is always present; lactose changes its <strong>shape</strong>, not its amount.";
const M3 = "The inducer binds the <strong>repressor protein</strong>, which then lets go of the operator.";
const M4 = "CAP helps RNA polymerase, but a bound repressor still blocks it: no lactose means off.";
const M5 = "The operator is a stretch of DNA, a binding site, not a gene for a protein.";
const M6 = "The repressor is a protein that diffuses anywhere in the cell. An operator only controls the genes right next to it.";
const M7 = "Tryptophan is a <strong>corepressor</strong>: it <strong>activates</strong> the trp repressor so it binds the operator.";
const G = (s) => "<i>" + s + "</i>";
const STAR = '<span class="tag lo-star">★ non-routine</span> ';
const HSEG = (s, c) => '<span class="lo-hseg' + (c ? " " + c : "") + '">' + s + "</span>";

export default {
  id:"26-the-lac-operon",
  kind:"topic",
  title:"The lac operon",
  topic:"The lac Operon",
  readyTopic:"the lac operon",
  hero:{
    eq:'<span class="lo-heq">' + HSEG(G("lacI"), "g") + '<span class="lo-hdots" aria-hidden="true">· · ·</span>' + HSEG("CAP site") + HSEG("promoter") +
      HSEG("operator", "op") + HSEG(G("lacZ"), "g") + HSEG(G("lacY"), "g") + HSEG(G("lacA"), "g") + "</span>",
    eqLabel:"The lac region of the DNA, left to right: the lacI gene, a gap, then the CAP site, the promoter, the operator, and the genes lacZ, lacY and lacA. The repressor sits on the operator.",
    eqSize:"sm",
    headline:"A switch with two inputs",
    text:"<i>E. coli</i> makes the enzymes for using lactose only when lactose is there and glucose isn’t. A <strong>repressor</strong> blocks the <strong>operator</strong> until an <strong>inducer</strong> pulls it off, and <strong>CAP</strong> boosts transcription when glucose runs low. Genes that are switched on and off together like this form an <strong>operon</strong>.",
    fig:{ html:'<div class="lo-hero" id="lo-hero" role="img" aria-label="The lac region of the DNA with the repressor on the operator and RNA polymerase stuck behind it. Lactose drifts in; one molecule becomes allolactose and clips onto the repressor, which changes shape and falls off. cAMP joins CAP, which docks at its site. RNA polymerase runs along lacZ, lacY and lacA, trailing one teal mRNA, and three enzymes appear: β-galactosidase, permease and transacetylase."></div>' }
  },
  goals:[
    "I can name the parts of the lac operon (promoter, operator, <i>lacZ</i>, <i>lacY</i>, <i>lacA</i>) and the regulatory gene <i>lacI</i>, and say what each does.",
    "I can explain how the repressor and the inducer (allolactose) switch the operon off and on.",
    "I can explain how CAP–cAMP and glucose set how strongly the operon is transcribed.",
    "I can predict the operon’s output for any combination of lactose and glucose, and for mutant strains.",
    "I can compare inducible (lac) and repressible (trp) operons.",
    "I can apply operon control to biotechnology and interpret data from mutants."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Transcription basics", goal:1,
          prompt:"Where does RNA polymerase bind to begin transcribing a gene?",
          options:[
            { t:"The promoter", ok:true, why:"The promoter is the DNA sequence that says “start transcribing here”." },
            { t:"The start codon", why:"AUG is in the mRNA, read during translation." },
            { t:"The terminator", why:"That’s where transcription ends." },
            { t:"The ribosome", why:"Ribosomes translate; they don’t bind DNA." }],
          hints:["Which DNA sequence says ‘start transcribing here’?", "In eukaryotes it often includes a TATA box.", "The promoter."] },
        { id:"w2", skill:"Transcription basics", goal:1,
          prompt:"In bacteria, one mRNA can carry the code for several proteins. What does that allow?",
          options:[
            { t:"Several related genes can be switched on or off together", ok:true, why:"One promoter controls them all, so they’re transcribed together." },
            { t:"The proteins are joined into one big protein", why:"Each has its own start and stop codon." },
            { t:"The mRNA can be spliced", why:"Bacteria don’t splice." },
            { t:"Translation is no longer needed", why:"Each gene is still translated." }],
          hints:["Think about genes that are always needed together.", "One promoter controls them all.", "They’re switched together."] },
        { id:"w3", skill:"Proteins binding DNA", goal:2,
          prompt:"A protein binds tightly to a stretch of DNA between a promoter and a gene. What will it most likely do?",
          options:[
            { t:"Block RNA polymerase from transcribing the gene", ok:true, why:"It sits in RNA polymerase’s path." },
            { t:"Change the gene’s sequence", why:"Binding doesn’t change bases." },
            { t:"Translate the gene", why:"Proteins bound to DNA don’t translate." },
            { t:"Speed up DNA replication", why:"It’s in the way of transcription." }],
          hints:["RNA polymerase has to travel along the DNA.", "What happens if something sits in its path?", "It blocks transcription."] },
        { id:"w4", skill:"Proteins binding DNA", goal:2,
          prompt:"A small molecule binds a protein at a site away from its active site and changes the protein’s shape. What is this called?",
          options:[
            { t:"Allosteric regulation", ok:true, why:"Like the allosteric inhibition in module 10." },
            { t:"Competitive inhibition", why:"Competitive inhibitors use the active site." },
            { t:"Denaturation", why:"That’s unfolding by heat or pH." },
            { t:"Hydrolysis", why:"That breaks bonds with water." }],
          hints:["Recall enzyme control from module 10.", "Binding elsewhere changes the shape.", "Allosteric."] },
        { id:"w5", skill:"Enzymes and energy", goal:6,
          prompt:"Why would a bacterium <strong>not</strong> make lactose-digesting enzymes when no lactose is around?",
          options:[
            { t:"Making unneeded proteins wastes energy and materials", ok:true, why:"Each protein costs ATP and amino acids, and there’s no lactose to use them on." },
            { t:"The enzymes would digest the bacterium", why:"They act only on lactose-type sugars." },
            { t:"The genes are missing until lactose arrives", why:"The genes are always there; they’re switched off." },
            { t:"The enzymes can’t fold without lactose", why:"Folding doesn’t need the substrate." }],
          hints:["Each protein costs ATP and amino acids.", "No lactose, no use for the enzyme.", "It saves energy."] },
        { id:"w6", skill:"Enzymes and energy", goal:3,
          prompt:"Glucose and lactose are both available. Which sugar can <i>E. coli</i> use straight away, without making new enzymes?",
          options:[
            { t:"Glucose", ok:true, why:"Glycolysis enzymes are always present." },
            { t:"Lactose", why:"It must first be split by β-galactosidase." },
            { t:"Both equally", why:"Lactose needs extra enzymes." },
            { t:"Neither", why:"Glucose goes straight into glycolysis." }],
          hints:["Recall glycolysis from module 14.", "Which sugar enters glycolysis directly?", "Glucose."] }
      ],
      refreshers:{
        "Transcription basics":"RNA polymerase binds the <strong>promoter</strong> and copies genes into mRNA. In bacteria, one promoter can control several genes in a row.",
        "Proteins binding DNA":"Regulatory proteins bind specific DNA sites. A protein sitting between the promoter and a gene blocks RNA polymerase. Small molecules can change a protein’s shape (allosteric change) and make it bind or let go.",
        "Enzymes and energy":"Making proteins costs energy. Cells make enzymes only when there’s a job for them; glucose is used first because its enzymes are already there."
      }
    }
  },
  explore:{
    heading:"Operon switchboard",
    intro:"Flip the inputs, change the strain, and watch the repressor, CAP and RNA polymerase decide what the cell makes.",
    chalIntro:"Set the switches to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses <strong>Partial diploid</strong> mode. Each challenge has three levels of help.",
    modelNote:"Real output is a continuum; this model keeps three levels: Off (a trace), Low and High. The repressor sits on every O⁺ operator unless an inducer (allolactose or IPTG) is bound to it. Allolactose forms only when lactose is present and some working β-galactosidase exists. CAP–cAMP binds when glucose is absent.",
    iptgNote:"IPTG binds the repressor like allolactose but isn’t broken down.",
    predictions:[
      { id:"p1", prompt:"Wild type, lactose absent, glucose present. What does the operon do?",
        options:[{ t:"Off (a trace)", ok:true }, { t:"Low" }, { t:"High" }, { t:"It depends on how much glucose" }],
        explain:"No lactose means no inducer, so the repressor blocks transcription.",
        reveal:"The repressor stays on the operator; RNA polymerase can’t pass.",
        start:{ strain:"wt", lac:"absent", glu:"present", iptg:"off" } },
      { id:"p2", prompt:"Wild type, lactose absent, glucose <strong>absent</strong>. CAP–cAMP is bound now. What does the operon do?",
        options:[{ t:"Off (a trace)", ok:true }, { t:"High" }, { t:"Low" }, { t:"CAP pushes the repressor off" }],
        explain:"CAP only helps RNA polymerase bind. A bound repressor still stops it.",
        reveal:"CAP docks, but the repressor still blocks the way.",
        start:{ strain:"wt", lac:"absent", glu:"absent", iptg:"off" } },
      { id:"p3", prompt:"Wild type, lactose present, glucose present. What does the operon do?",
        options:[{ t:"Low", ok:true }, { t:"High" }, { t:"Off" }, { t:"High, then off once lactose is used" }],
        explain:"The repressor is gone, but with glucose around, cAMP is low and CAP can’t help.",
        reveal:"The repressor comes off, but CAP isn’t docked; the polymerase runs slowly.",
        start:{ strain:"wt", lac:"present", glu:"present", iptg:"off" } },
      { id:"p4", prompt:"<i>lacI</i>⁻ strain, lactose absent, glucose absent. What does the operon do?",
        options:[{ t:"High", ok:true }, { t:"Off" }, { t:"Low" }, { t:"Nothing: the cell dies" }],
        explain:"With no repressor, nothing blocks transcription. The operon is <strong>constitutive</strong>: always on.",
        reveal:"No repressor appears, and CAP is docked.",
        start:{ strain:"i", lac:"absent", glu:"absent", iptg:"off" } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Wild type: set the inputs so the operon is transcribed at its highest level.",
        why:"An inducer (allolactose or IPTG) pulls the repressor off, and with glucose absent CAP–cAMP docks and helps RNA polymerase: High.",
        general:"Look at the readout: you need the repressor released <strong>and</strong> CAP–cAMP bound.",
        named:{ mode:"Switch to <strong>Single operon</strong> mode first.", strain:"This challenge uses the <strong>wild type</strong> strain.",
          both:"That’s only low: glucose keeps CAP away.", none:"CAP is ready, but the repressor still blocks." },
        hints:["Two conditions must both be met.", "Remove the repressor, and get CAP to help.", "Lactose present, glucose absent."] },
      { id:"tc2", goal:[2, 4], prompt:"Find a strain that makes β-galactosidase at a high level with <strong>no lactose and no IPTG</strong>.",
        why:"With no working repressor (<i>lacI</i>⁻) or an operator it can’t bind (Oᶜ), nothing blocks transcription, so no inducer is needed; with glucose absent, CAP makes it high.",
        general:"Which mutation stops the repressor blocking the operator?",
        named:{ mode:"Switch to <strong>Single operon</strong> mode first.", lacZ:"Its β-galactosidase is faulty, and it can’t make allolactose either.",
          glucose:"Transcription is only low while glucose is around.", inducer:"The challenge says <strong>no lactose and no IPTG</strong>. Switch them off.",
          wt:"In the wild type, the repressor blocks the operator whenever there’s no inducer. Try a mutant strain." },
        hints:["Which mutation stops the repressor blocking the operator?", "Either remove the repressor or change the operator.", "<i>lacI</i>⁻ or Oᶜ, with glucose absent."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Partial-diploid mode. One copy of the operon has an Oᶜ operator (it must stay). Build a cell that makes <strong>working</strong> β-galactosidase <strong>only</strong> when lactose is present (glucose absent).",
        why:"The faulty <i>Z</i>⁻ beside Oᶜ is on all the time but makes nothing useful. A repressor from any <i>I</i>⁺ copy drifts to the O⁺ operator and holds the working <i>Z</i>⁺ off until lactose provides the inducer.",
        general:"Check which genes sit beside which operator.",
        named:{ mode:"Switch to <strong>Partial diploid</strong> mode first.", noOc:"One copy must keep its Oᶜ operator.", twoOc:"Only one copy has the Oᶜ operator; the other copy needs O⁺.",
          ocZ:"Working β-galactosidase is made all the time from the copy beside the Oᶜ operator.",
          noI:"There’s no repressor anywhere, so the O⁺ copy is on all the time too.", opZ:"No working β-galactosidase at all." },
        hints:["An operator only controls the genes right next to it.", "The repressor is a protein that can drift to any O⁺ operator in the cell.", "Put <i>Z</i>⁻ beside Oᶜ, <i>Z</i>⁺ beside O⁺, and keep at least one <i>I</i>⁺."] }
    ]
  },
  part3:{
    slug:"trp", name:"trp operon", heading:"The trp operon, the opposite switch",
    intro:"The lac operon breaks down a food. The trp operon builds an amino acid, so it is wired the other way round. Try its switchboard, then use real-style mutant data to see how the lac model was worked out.",
    st1:{ title:"Station 1: The trp switchboard",
      text:"<i>trpR</i> (a separate gene) makes the trp repressor. The operon has a promoter, an operator and five genes for the enzymes that make tryptophan (Trp). Move the tryptophan level.",
      levels:["Low", "Medium", "High"],
      compare:{ head:["", "lac", "trp"], rows:[
        ["Kind of pathway", "Breaks down a sugar", "Builds an amino acid"],
        ["Default state", "Off", "On"],
        ["Small molecule", "Inducer (allolactose) <strong>removes</strong> the repressor", "Corepressor (tryptophan) <strong>activates</strong> the repressor"],
        ["Type", "Inducible", "Repressible"]] },
      note:"Going further: the trp operon also has a second control, attenuation, that this module leaves out." },
    st2:{ title:"Station 2: Mutant strains",
      text:"β-galactosidase activity (units) in four strains, with no lactose and with lactose (no glucose).",
      head:["Strain", "No lactose", "Lactose (no glucose)"],
      rows:[["Wild type", "1", "1000"], ["Strain X", "1000", "1000"], ["Strain Y", "1", "1"], ["Partial diploid: X on the chromosome + wild-type plasmid", "1", "2000"]],
      control:"The wild type is the <strong>control</strong> strain: it shows what normal control looks like, so each mutant can be compared with it.",
      x:{ claimQ:"Claim: strain X is…",
        claims:[{ t:"an operator (Oᶜ) mutant", fb:"An Oᶜ operator only controls the genes beside it, so a plasmid couldn’t fix it. Look at the last row." },
          { t:"a repressor (<i>lacI</i>⁻) mutant", ok:true }, { t:"a <i>lacZ</i>⁻ mutant", fb:"Strain X makes plenty of β-galactosidase, so <i>lacZ</i> works." }],
        evQ:"Evidence: which row settles it?",
        evs:[{ t:"Row 1 (wild type)", fb:"The wild type is the control; it doesn’t test strain X." }, { t:"Row 2 (strain X)", fb:"Row 2 shows X is always on, but both <i>lacI</i>⁻ and Oᶜ would do that." },
          { t:"Row 3 (strain Y)", fb:"Row 3 is about a different strain." }, { t:"Row 4 (the partial diploid)", ok:true }],
        reQ:"Reasoning:",
        res:[{ t:"β-galactosidase doubled, so strain X makes extra enzyme.", fb:"The doubling just shows two working <i>lacZ</i> copies. Look at the no-lactose column." },
          { t:"The plasmid’s working repressor fixed it, and a repressor can act on both copies; an Oᶜ mutation couldn’t be fixed that way.", ok:true },
          { t:"Strain X makes β-galactosidase without lactose, so its operator must be broken.", fb:"A missing repressor gives the same result in row 2; row 4 tells them apart." }],
        done:"✓ Strain X is a repressor (<i>lacI</i>⁻) mutant. Row 4: with the plasmid’s working repressor, the cell is off again without lactose (1 unit). " + M6 },
      y:{ claimQ:"Strain Y makes almost no β-galactosidase, even with lactose. It is consistent with…",
        claims:[{ t:"<i>lacI</i>⁻", fb:"No repressor would make it always on, not always off." }, { t:"Oᶜ", fb:"Oᶜ would make it always on." },
          { t:"<i>lacZ</i>⁻", ok:true }],
        done:"✓ Strain Y is consistent with <i>lacZ</i>⁻: the gene is switched on, but the β-galactosidase it codes for doesn’t work." } },
    quickCheck:{
      title:"trp operon quick check", summary:"trp operon quick check",
      items:[
        { id:"q1", goal:5, prompt:"High tryptophan: the trp operon is…",
          choices:[{ t:"Off", ok:true, fb:"Right. Tryptophan activates the repressor, which binds the operator." },
            { t:"On", fb:"Trp activates the repressor." }, { t:"Low", fb:"Trp activates the repressor." }, { t:"Induced", fb:"Trp activates the repressor." }] },
        { id:"q2", goal:5, prompt:"Tryptophan is called a…",
          choices:[{ t:"Corepressor", ok:true, fb:"Right. It helps the repressor repress." },
            { t:"Inducer", fb:"It helps the repressor repress." }, { t:"Activator", fb:"It helps the repressor repress." }, { t:"Promoter", fb:"It helps the repressor repress." }] },
        { id:"q3", goal:5, prompt:"Which operon is ‘on’ by default?",
          choices:[{ t:"trp", ok:true, fb:"Right. The cell usually needs to make Trp; lac waits for lactose." },
            { t:"lac", fb:"The cell usually needs to make Trp; lac waits for lactose." }, { t:"Both", fb:"The cell usually needs to make Trp; lac waits for lactose." },
            { t:"Neither", fb:"The cell usually needs to make Trp; lac waits for lactose." }] },
        { id:"q4", goal:6, prompt:"In the data, why does the partial diploid prove strain X is <i>lacI</i>⁻?",
          choices:[{ t:"The plasmid repressor restored control", ok:true, fb:"Right. A repressor works on any operator; an Oᶜ operator couldn’t be rescued." },
            { t:"β-galactosidase doubled", fb:"A repressor works on any operator; an Oᶜ operator couldn’t be rescued." },
            { t:"Lactose was absent", fb:"A repressor works on any operator; an Oᶜ operator couldn’t be rescued." },
            { t:"The plasmid had Oᶜ", fb:"A repressor works on any operator; an Oᶜ operator couldn’t be rescued." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"olh", type:"sorter", title:"Off, low or high?", summary:"Off, low or high?", goal:[3, 4], noun:"situation", txt:true,
        instruction:"Ten situations. Sort each one by how strongly the lac operon is transcribed.",
        boxes:[{ id:"b1", label:"Off" }, { id:"b2", label:"Low" }, { id:"b3", label:"High" }],
        wrongDefault:"Ask two questions: is the repressor off? Is CAP on?",
        items:[
          { id:"i1", t:"Wild type; no lactose; glucose present", answer:"b1", why:"No lactose, no inducer: the repressor blocks." },
          { id:"i2", t:"Wild type; lactose; glucose present", answer:"b2", why:"The repressor is off, but glucose keeps CAP away.", wrong:{ b3:M1 } },
          { id:"i3", t:"Wild type; lactose; no glucose", answer:"b3", why:"The repressor is off and CAP–cAMP helps." },
          { id:"i4", t:"Wild type; no lactose; no glucose", answer:"b1", why:"CAP is bound, but the repressor still blocks.", wrong:{ b3:M4 } },
          { id:"i5", t:"<i>lacI</i>⁻; no lactose; no glucose", answer:"b3", why:"No repressor, and CAP helps." },
          { id:"i6", t:"<i>lacI</i>⁻; no lactose; glucose present", answer:"b2", why:"No repressor, but glucose keeps CAP away.",
            wrong:{ b3:"No repressor, but glucose still keeps CAP away: low." } },
          { id:"i7", t:"Oᶜ; lactose; no glucose", answer:"b3", why:"The repressor can’t bind Oᶜ, and CAP helps." },
          { id:"i8", t:"Wild type; IPTG; glucose present", answer:"b2", why:"IPTG pulls the repressor off, but glucose keeps CAP away." },
          { id:"i9", t:"<i>lacZ</i>⁻; lactose; no glucose (no IPTG)", answer:"b1", why:"No working β-galactosidase means no allolactose, so the repressor stays on.",
            wrong:{ b3:"<i>lacZ</i>⁻ can’t turn lactose into allolactose, so nothing removes the repressor." },
            hints:["What makes allolactose?", "β-galactosidase, which this strain can’t make in working form.", "No inducer: Off."] },
          { id:"i10", t:"Wild type; IPTG; no glucose", answer:"b3", why:"IPTG removes the repressor, and CAP helps." }
        ] },
      { id:"pe", type:"custom", title:"Predict and explain", summary:"Predict and explain", goal:[4, 6],
        instruction:"Six problems. Problems 3–6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        how:"Choose an answer, then press Check.",
        items:[
          { id:"pe1", goal:4, prompt:"A mutation stops cAMP binding to CAP. Lactose present, no glucose. Output?",
            options:[{ t:"Off" , why:"Lactose still pulls the repressor off. The problem is CAP." }, { t:"Low", ok:true, why:"The repressor is off, but without cAMP, CAP can’t bind and help: low." },
              { t:"High", why:"Without CAP’s help, transcription stays low." }] },
          { id:"pe2", goal:4, prompt:"A mutation stops the repressor binding allolactose (but it still binds the operator). Lactose present, no glucose. Output?",
            options:[{ t:"Off", ok:true, why:"The inducer can’t pull the repressor off, so it stays on the operator: off, whatever CAP does." }, { t:"Low", why:"With the repressor stuck on the operator, there’s only a trace." },
              { t:"High", why:"The inducer can’t pull it off, so it stays on the operator." }] },
          { id:"pe3", goal:[4, 6], prompt:STAR + "Partial diploid: chromosome <i>I</i>⁻ O⁺ <i>Z</i>⁺; plasmid <i>I</i>⁺ O⁺ <i>Z</i>⁻. No lactose. Working β-galactosidase?",
            options:[{ t:"None (off)", ok:true, why:"The plasmid’s repressor drifts to the chromosome’s operator and blocks the working <i>Z</i>⁺. " + M6 },
              { t:"Made at a low level", why:M6 + " The plasmid’s repressor drifts to the chromosome’s operator." },
              { t:"Made at a high level", why:M6 + " The plasmid’s repressor drifts to the chromosome’s operator." }] },
          { id:"pe4", goal:[4, 6], prompt:STAR + "Partial diploid: chromosome <i>I</i>⁺ Oᶜ <i>Z</i>⁺; plasmid <i>I</i>⁺ O⁺ <i>Z</i>⁻. No lactose, no glucose. Working β-galactosidase?",
            options:[{ t:"None (off)", why:M6 + " No repressor can bind an Oᶜ operator, and <i>Z</i>⁺ sits beside it." }, { t:"Low", why:"There’s no glucose, so CAP is bound: high." },
              { t:"High", ok:true, why:"No repressor can bind an Oᶜ operator, and <i>Z</i>⁺ sits beside it; with no glucose, CAP helps." }] },
          { id:"pe5", goal:6, prompt:STAR + "A strain makes lac enzymes at high levels whatever the sugars. Adding a plasmid with a working <i>lacI</i> gene changes nothing. Which mutation is it most likely to have?",
            options:[{ t:"Oᶜ (operator)", ok:true, why:"A working repressor can’t bind an Oᶜ operator, so the plasmid can’t fix it. This is how Jacob and Monod tested their model: they moved working genes into mutant cells and saw which defects were fixed." },
              { t:"<i>lacI</i>⁻ (repressor)", why:"A working repressor would have fixed a <i>lacI</i>⁻ strain." },
              { t:"<i>lacZ</i>⁻", why:"A <i>lacZ</i>⁻ strain makes no working β-galactosidase at all." },
              { t:"A CAP mutation", why:"Without CAP’s help, output would be low, not high." }],
            hints:["Which part can be fixed by a protein made elsewhere?", "The repressor can; the operator can’t.", "Oᶜ."] }
        ],
        sequences:[
          { id:"pe6", goal:[4, 6], prompt:STAR + "<i>E. coli</i> is moved from a glucose-only medium to a lactose-only medium. Put these events in order.",
            steps:["Glucose runs out", "cAMP rises", "Lactose enters and some becomes allolactose", "Repressor releases the operator", "Permease and β-galactosidase rise"],
            start:[4, 3, 1, 2, 0],
            accept:[[0, 2, 1, 3, 4]],
            general:"Enzymes rise only after the operon is switched on, and that needs both signals first.",
            wrong:[{ order:[4, 0, 1, 2, 3], fb:"Enzymes rise only after the operon is switched on." }, { order:[4, 0, 2, 1, 3], fb:"Enzymes rise only after the operon is switched on." }],
            why:"Glucose loss raises cAMP (so CAP can help), and lactose provides the inducer (so the repressor lets go). Only then is the operon transcribed, and the enzymes rise.",
            hints:["What does the cell sense first?", "Glucose loss raises cAMP; lactose provides the inducer.", "Both signals, then transcription, then enzymes."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Nikhil", how:"",
        instruction:"Nikhil made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Predict the lac operon’s output when both glucose and lactose are present.",
            steps:["Lactose is present, so some becomes allolactose.", "Allolactose binds the repressor, which lets go of the operator.", "Nothing is blocking RNA polymerase, so transcription is high.", "The cell uses lactose before glucose."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "This follows from step 3, which is wrong."],
            fixes:[
              { t:"Glucose keeps cAMP low, so CAP doesn’t help RNA polymerase: transcription is only low, and glucose is used first.", ok:true, why:M1 },
              { t:"The repressor rebinds because glucose is present.", why:"Glucose acts through cAMP and CAP, not the repressor." },
              { t:"Transcription is off.", why:"Allolactose has pulled the repressor off, so it isn’t off." },
              { t:"Step 3 is correct.", why:"CAP needs cAMP, which is low when glucose is present." }],
            hints:["What does glucose do to cAMP?", "Lowers it, so CAP isn’t bound.", "Low output."] },
          { id:"e2", goal:2, task:"Explain why the lac operon is off when there’s no lactose.",
            steps:["When lactose is absent, the <i>lacI</i> gene is switched on and the repressor is made.", "The repressor binds the operator.", "RNA polymerase can’t get past, so <i>lacZ</i>, <i>lacY</i> and <i>lacA</i> aren’t transcribed."],
            answer:0,
            stepFb:["", "Step 2 is correct, but there’s an earlier mistake.", "Step 3 is correct."],
            fixes:[
              { t:"<i>lacI</i> is transcribed all the time, so the repressor is always present; without an inducer, it binds the operator.", ok:true, why:M2 },
              { t:"<i>lacZ</i> makes the repressor.", why:"<i>lacZ</i> codes for β-galactosidase." },
              { t:"The operator makes the repressor.", why:M5 },
              { t:"Step 1 is correct.", why:"The repressor is there whether or not lactose is; lactose changes its shape." }],
            hints:["Is <i>lacI</i> part of the operon’s switch?", "No: it has its own promoter and is always on.", "The repressor is always present."] },
          { id:"e3", goal:5, task:"Explain what happens to the trp operon when tryptophan is plentiful.",
            steps:["The trp operon codes for enzymes that make tryptophan.", "When tryptophan is plentiful, the cell doesn’t need to make more.", "Tryptophan binds the trp repressor and pulls it off the operator.", "So the trp genes are switched off."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 states the right result, but step 3’s mechanism would switch them on."],
            fixes:[
              { t:"Tryptophan binds the trp repressor and <strong>activates</strong> it, so it binds the operator and blocks transcription.", ok:true, why:M7 },
              { t:"Tryptophan binds the operator.", why:"Small molecules like tryptophan bind the <strong>repressor protein</strong>, not the operator DNA." },
              { t:"Tryptophan destroys the trp mRNA.", why:"It works through the repressor." },
              { t:"Step 3 is correct.", why:"Pulling a repressor off would turn genes <strong>on</strong>." }],
            hints:["What does a corepressor do?", "Helps the repressor repress.", "It activates the repressor."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the switchboard: that lactose plus glucose gives only low output, or that CAP can’t overrule the repressor?" },
      { id:"j2", q:"In your own words, why does it make sense for <i>E. coli</i> to control the lac genes this way?" },
      { id:"j3", q:"Explain to a friend the difference between an inducible and a repressible operon, using lac and trp." },
      { id:"j4", q:"Which part of operon logic still trips you up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What does the lac repressor do when no lactose is present?", options:[
          { t:"It binds the operator and blocks RNA polymerase from transcribing the genes", ok:true, why:"With no inducer, the repressor sits on the operator, between the promoter and the genes." },
          { t:"It binds lactose and destroys it", why:"No lactose is there." },
          { t:"It is not made until lactose arrives", why:M2 },
          { t:"It binds the promoter and helps RNA polymerase", why:"That describes CAP, which helps only when glucose is low." }] },
        b:{ prompt:"Which statement about the operator is correct?", options:[
          { t:"It is a DNA sequence where the repressor binds", ok:true, why:"The operator is a binding site between the promoter and the genes." },
          { t:"It is the protein that blocks transcription", why:M5 },
          { t:"It codes for β-galactosidase", why:"That’s <i>lacZ</i>." },
          { t:"It is where the ribosome binds", why:"Ribosomes bind mRNA, not the operator." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What does allolactose do in the lac operon?", options:[
          { t:"It binds the repressor, changing its shape so it releases the operator", ok:true, why:"Allolactose is the inducer: an allosteric change makes the repressor let go." },
          { t:"It binds the operator and blocks the repressor", why:M3 },
          { t:"It activates CAP", why:"cAMP activates CAP." },
          { t:"It is transcribed into mRNA", why:"It’s a sugar, not a gene." }] },
        b:{ prompt:"In the lab, IPTG is added to cells with the lac operon. What does it do?", options:[
          { t:"It binds the repressor like allolactose does, so the operator is freed, but it isn’t broken down", ok:true, why:"IPTG is a lab inducer that the cell can’t use up." },
          { t:"It binds the operator directly", why:M3 },
          { t:"It destroys the repressor gene", why:"It’s a small molecule; it doesn’t change DNA." },
          { t:"It replaces glucose as food", why:"Cells can’t use IPTG as food." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"When glucose is scarce, what helps RNA polymerase bind the lac promoter strongly?", options:[
          { t:"CAP with cAMP bound to it", ok:true, why:"Low glucose raises cAMP; CAP–cAMP binds near the promoter and helps RNA polymerase." },
          { t:"The repressor", why:"The repressor blocks; it never helps." },
          { t:"Allolactose bound to the promoter", why:M3 },
          { t:"β-galactosidase", why:"That’s a product of the operon, not a regulator." }] },
        b:{ prompt:"Why does glucose keep lac transcription low, even when lactose is present?", options:[
          { t:"Glucose keeps cAMP low, so CAP isn’t bound to help RNA polymerase", ok:true, why:M1 },
          { t:"Glucose binds the operator", why:M3 },
          { t:"Glucose turns the repressor back on", why:"The repressor responds to the inducer, not glucose." },
          { t:"Glucose destroys lac mRNA", why:"It acts through cAMP and CAP." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A wild-type <i>E. coli</i> cell is in a medium with both glucose and lactose. What is the lac operon’s output?", options:[
          { t:"Low", ok:true, why:"The repressor is off, but CAP isn’t helping." },
          { t:"High", why:M1 },
          { t:"Off", why:"Lactose provides the inducer, so the repressor comes off." },
          { t:"High at first, then off", why:"Output stays low while glucose is present." }] },
        b:{ prompt:"A wild-type <i>E. coli</i> cell is in a medium with neither glucose nor lactose. What is the lac operon’s output?", options:[
          { t:"Off (a trace)", ok:true, why:"CAP is bound, but the repressor still blocks." },
          { t:"High", why:M4 },
          { t:"Low", why:"Without an inducer the repressor stays on the operator." },
          { t:"It depends on the amount of cAMP", why:M4 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"An Oᶜ mutant (operator the repressor can’t bind) is grown with no lactose and no glucose. What happens?", options:[
          { t:"The operon is transcribed at a high level", ok:true, why:"Nothing blocks it, and CAP helps." },
          { t:"It is off, because there’s no lactose", why:"The repressor can’t bind the changed operator." },
          { t:"It is low, because there’s no inducer", why:"No inducer is needed if the repressor can’t bind." },
          { t:"The repressor isn’t made", why:"The repressor is made; it just can’t bind." }] },
        b:{ prompt:"A <i>lacI</i>⁻ mutant (no working repressor) is grown with no lactose and no glucose. What happens?", options:[
          { t:"The operon is transcribed at a high level", ok:true, why:"There’s no repressor to block it, and with no glucose CAP helps." },
          { t:"It is off, because there’s no lactose", why:"There’s no repressor to block it." },
          { t:"It is low", why:"With no glucose, CAP is bound: high." },
          { t:"It is off, because the operator is missing", why:"The operator is fine; the repressor is missing." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A cell has two copies of the lac region: the chromosome is <i>I</i>⁻ O⁺ <i>Z</i>⁺ and a plasmid is <i>I</i>⁺ O⁺ <i>Z</i>⁻. With no lactose (and no glucose), is working β-galactosidase made?", options:[
          { t:"No: the plasmid’s repressor binds both operators, including the chromosome’s", ok:true, why:M6 },
          { t:"Yes, at a high level: the chromosome has no repressor gene", why:"Repressor proteins move freely in the cell." },
          { t:"Yes, but only from the plasmid", why:"The plasmid’s <i>Z</i> is faulty." },
          { t:"Yes, at a low level: there’s no glucose", why:"Without an inducer, the repressor blocks both." }] },
        b:{ prompt:"A cell’s chromosome is <i>I</i>⁺ Oᶜ <i>Z</i>⁺ and a plasmid is <i>I</i>⁺ O⁺ <i>Z</i>⁻. With no lactose (and no glucose), is working β-galactosidase made?", options:[
          { t:"Yes, at a high level: the repressor can’t bind the Oᶜ operator next to <i>Z</i>⁺", ok:true, why:M6 },
          { t:"No: the plasmid’s working repressor shuts it off", why:"A repressor can’t bind an Oᶜ operator." },
          { t:"No: there’s no lactose", why:"Oᶜ doesn’t need an inducer." },
          { t:"Yes, but faulty", why:"The <i>Z</i>⁺ copy is next to Oᶜ, so it’s the working one." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why <i>E. coli</i>’s lac control helps it survive?", options:[
          { t:"“It makes lactose enzymes only when lactose is available and glucose, the easier sugar, has run out, so it doesn’t waste energy on unneeded proteins.”", ok:true, why:"It names both conditions and the energy saving." },
          { t:"“It makes lactose enzymes all the time so it’s always ready.”", why:"That would waste energy." },
          { t:"“It destroys glucose so it can use lactose.”", why:"It uses glucose first." },
          { t:"“It changes its DNA when lactose arrives.”", why:"Regulation switches genes; it doesn’t change them." }] },
        b:{ prompt:"Which is the best explanation of why lac output is low when both sugars are present?", options:[
          { t:"“Lactose removes the repressor, but glucose keeps cAMP low, so CAP can’t boost transcription; the cell keeps using glucose first.”", ok:true, why:"It explains both regulators and the result." },
          { t:"“Glucose binds the repressor and puts it back on.”", why:"Glucose acts through cAMP and CAP." },
          { t:"“The two sugars cancel out.”", why:"There’s a mechanism: the repressor and CAP." },
          { t:"“Lactose is broken down before it can act.”", why:"Some lactose still becomes allolactose." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which map of the lac region is in the correct order (left to right, in the direction of transcription)?", options:[
          { t:"<i>lacI</i> (with its own promoter) · · · CAP site · promoter · operator · <i>lacZ</i> · <i>lacY</i> · <i>lacA</i>", ok:true, why:"Control sites come before the genes, with the operator between the promoter and <i>lacZ</i>; <i>lacI</i> is separate." },
          { t:"Promoter · <i>lacZ</i> · operator · <i>lacY</i> · <i>lacA</i>", why:"The operator must sit between the promoter and the genes." },
          { t:"Operator · promoter · <i>lacI</i> · <i>lacZ</i> · <i>lacY</i>", why:"<i>lacI</i> is separate, with its own promoter." },
          { t:"<i>lacZ</i> · <i>lacY</i> · <i>lacA</i> · operator · promoter", why:"Control sites come before the genes they control." }] },
        b:{ prompt:"Which map of the trp region is in the correct order?", options:[
          { t:"<i>trpR</i> (separate, with its own promoter) · · · promoter · operator · the five trp enzyme genes", ok:true, why:"The operator sits between the promoter and the genes; <i>trpR</i> is separate." },
          { t:"Promoter · trp genes · operator", why:"The operator sits between the promoter and the genes." },
          { t:"Operator · trp genes · promoter", why:"Polymerase starts at the promoter, before the operator." },
          { t:"<i>trpR</i> inside the operator", why:"The operator is a binding site, not a gene." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Biotechnologists put a gene for a human protein after a lac promoter and operator on a plasmid. They grow the bacteria in a glucose-free medium, then add IPTG when the culture is dense. Why?", options:[
          { t:"IPTG releases the repressor, so the protein is made only when they choose, and IPTG isn’t used up, so production stays on", ok:true, why:"The repressor keeps the gene off while the cells grow; IPTG switches it on for good." },
          { t:"IPTG feeds the bacteria", why:"Cells can’t use IPTG as food." },
          { t:"IPTG inserts the gene into the chromosome", why:"It doesn’t change DNA." },
          { t:"Without IPTG, the plasmid is lost", why:"IPTG controls transcription only." }] },
        b:{ prompt:"Why do biotechnologists usually switch on a lac-controlled gene with IPTG rather than lactose?", options:[
          { t:"Lactose is broken down by β-galactosidase, so its effect fades; IPTG binds the repressor but isn’t broken down", ok:true, why:"A steady inducer keeps the gene on." },
          { t:"Lactose can’t enter bacteria", why:"Permease brings it in." },
          { t:"IPTG also adds glucose", why:"It doesn’t." },
          { t:"Lactose binds the operator and blocks the gene", why:M3 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"<i>E. coli</i> is moved into a broth rich in tryptophan. What happens to its trp operon, and why?", options:[
          { t:"It switches off: tryptophan activates the trp repressor, which binds the operator", ok:true, why:M7 },
          { t:"It switches on: tryptophan is the inducer", why:M7 },
          { t:"It stays on: the cell always needs tryptophan", why:"It can take Trp from the broth instead." },
          { t:"It switches off because tryptophan breaks down the trp mRNA", why:"It works through the repressor." }] },
        b:{ prompt:"A culture runs out of tryptophan. What happens to its trp operon, and why?", options:[
          { t:"It switches on: with no corepressor, the repressor is inactive and leaves the operator", ok:true, why:"The cell now needs to make its own Trp." },
          { t:"It switches off, to save energy", why:"The cell now needs to make its own Trp." },
          { t:"It stays off until lactose arrives", why:"Lactose controls lac, not trp." },
          { t:"It switches on because tryptophan binds RNA polymerase", why:"Trp acts on the repressor." }] } }
    ]
  },
  task:{
    title:"Build a lactose-ready strain", summary:"Build a lactose-ready strain",
    statement:"<p>A lab wants <i>E. coli</i> that is already making working lac enzymes at full strength <strong>before</strong> any lactose arrives, so it can start using lactose instantly. Choose a genotype and growth conditions that meet every condition. Can you find all the answers?</p>" +
      '<ol class="lo-conds"><li>Working β-galactosidase is made at a <strong>high</strong> level.</li><li>There is <strong>no lactose</strong> (and no IPTG) in the medium.</li><li>Working permease is made, so lactose can get in when it arrives.</li></ol>',
    inputs:{ I:"<i>I</i>", O:"O", Z:"<i>Z</i>", Y:"<i>Y</i>", glu:"Glucose", lac:"Lactose", iptg:"IPTG" },
    checks:["Working β-galactosidase, high", "No lactose, no IPTG", "Working permease"],
    tips:["High output needs the repressor off the operator and CAP’s help.", "With no inducer, which mutations stop the repressor blocking?", "Lactose can’t get in without the permease from <i>lacY</i>."],
    success:"Your strain is lactose-ready!",
    explainPrompt:"Explain why each of your strains makes lac enzymes without lactose, and why glucose must be absent.",
    vocab:"Use the words repressor, operator, constitutive, CAP and cAMP.",
    after3:"All three are constitutive: the repressor is missing or can’t bind. In nature, such strains waste energy when there’s no lactose, which is why wild-type control is the norm."
  },
  cards:[
    ["Operon", "Genes transcribed together from one promoter and controlled by one operator (bacteria)."],
    ["<i>lacZ</i>, <i>lacY</i>, <i>lacA</i>", "β-galactosidase (splits lactose), permease (lets lactose in), transacetylase."],
    ["<i>lacI</i>", "Separate gene, always on; makes the lac repressor."],
    ["Operator", "DNA site between the promoter and the genes, where the repressor binds."],
    ["Inducer", "Allolactose (or IPTG in the lab): binds the repressor so it lets go."],
    ["CAP–cAMP", "Helps RNA polymerase when glucose is low (cAMP high)."],
    ["lac logic", "High only with lactose present <strong>and</strong> glucose absent; low with both; off without lactose."],
    ["Constitutive", "Always on: <i>lacI</i>⁻ or Oᶜ mutants."],
    ["Cis vs trans", "Operators act only on genes beside them; repressors act anywhere in the cell."],
    ["Inducible operon", "Off by default; switched on by an inducer (lac: breaking down a food)."],
    ["Repressible operon", "On by default; switched off by a corepressor (trp: building a product)."],
    ["Corepressor", "Tryptophan: activates the trp repressor so it binds the operator."]
  ]
};
