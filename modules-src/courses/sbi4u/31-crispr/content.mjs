// SBI4U 31 CRISPR Gene Editing. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/31-crispr.md
// Scope (plan): concepts only. No DNA sequences anywhere: matching is a count ("20 of 20"), targets are abstract colour patterns.
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Cas9 only cuts. The cell’s own repair decides what ends up in the gap.";
const M2 = "The guide RNA finds the target by base pairing. Cas9 is the enzyme that cuts once the guide has matched.";
const M3 = "No PAM, no cut. Cas9 checks for the PAM before it opens the DNA.";
const M4 = "NHEJ joins the ends quickly and often adds or loses a few bases. That’s why it’s used to knock genes out.";
const M5 = "Only changes in eggs, sperm or embryos can pass to children. A patient’s blood cells are somatic.";
const M6 = "A near-match elsewhere can still be cut. Scientists choose guides with no close matches anywhere else.";
const M7 = "Bacteria evolved it to fight viruses. Scientists adapted a natural system.";
const RULES = "Run the three rules: PAM? Match ≥ 18? Template and dividing?";

export default {
  id:"31-crispr",
  kind:"topic",
  title:"CRISPR gene editing",
  topic:"CRISPR Gene Editing",
  readyTopic:"CRISPR gene editing",
  hero:{
    eq:'<span class="cr-heq">guide RNA + Cas9 → cut → repair</span>',
    eqLabel:"Guide RNA plus Cas9 gives a cut, then the cell repairs it",
    eqSize:"sm",
    headline:"A bacterial defence became a pair of molecular scissors.",
    text:"<strong>CRISPR–Cas9</strong> lets scientists cut DNA at one chosen place. A <strong>guide RNA</strong> finds the spot by base pairing; <strong>Cas9</strong> makes the cut, but only next to a short <strong>PAM</strong> sequence. Then the cell repairs the break, and the <strong>repair</strong> decides what changes.",
    fig:{ html:'<div class="cr-hero" id="cr-hero" role="img" aria-label="A virus (phage) injects its DNA into a bacterium. A Cas protein holding a teal guide RNA finds the matching viral DNA and cuts it, and the viral DNA fades: bacteria do this to remember and destroy viruses. The scene cross-fades to a human cell nucleus, where the same complex, Cas9 holding its teal guide, clamps onto a DNA double helix beside a magenta-outlined PAM tag and cuts it: scientists borrowed it."></div>' }
  },
  goals:[
    "I can describe the parts of the CRISPR–Cas9 system (guide RNA, Cas9, PAM, template) and what each does.",
    "I can explain why Cas9 cuts only where the guide matches <strong>and</strong> a PAM sits next to the target.",
    "I can compare NHEJ and HDR and predict the outcome of an edit.",
    "I can explain off-target effects and how scientists reduce them.",
    "I can distinguish somatic from germline editing and explain why the difference matters.",
    "I can evaluate uses of gene editing in medicine, agriculture and research, using evidence."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Base pairing", goal:2,
          prompt:"An RNA strand pairs with a DNA strand. Which pairing rule applies to the RNA’s U?",
          options:[
            { t:"U pairs with A", ok:true, why:"In RNA–DNA pairing, U takes T’s place, so it pairs with A." },
            { t:"U pairs with T", why:"T is DNA’s partner for A; U and T are both partners of A, not of each other." },
            { t:"U pairs with G", why:"G pairs with C." },
            { t:"U pairs with C", why:"C pairs with G." }],
          hints:["Which base does U replace?", "U replaces T.", "T pairs with A, so U pairs with A."] },
        { id:"w2", skill:"Base pairing", goal:2,
          prompt:"A probe that is 20 nucleotides long matches a stretch of DNA at 20 of 20 positions. Another stretch matches at 14 of 20. Which will the probe bind most strongly?",
          options:[
            { t:"The 20-of-20 stretch", ok:true, why:"More matching pairs means more hydrogen bonds holding it on." },
            { t:"The 14-of-20 stretch", why:"Six mismatches weaken binding." },
            { t:"Both equally", why:"Binding depends on how many positions pair." },
            { t:"Neither, because probes don’t bind DNA", why:"Probes and primers bind by base pairing (module 30)." }],
          hints:["What holds paired strands together?", "Hydrogen bonds between each matching pair.", "20 matches give the most bonds."] },
        { id:"w3", skill:"DNA vs RNA", goal:1,
          prompt:"Which feature is true of RNA but not DNA?",
          options:[
            { t:"It contains uracil", ok:true, why:"RNA uses U; DNA uses T." },
            { t:"It contains phosphate", why:"Both nucleic acids share this." },
            { t:"It has a sugar–phosphate backbone", why:"Both nucleic acids share this." },
            { t:"It is made of nucleotides", why:"Both nucleic acids share this." }],
          hints:["Compare the bases.", "One base differs.", "U in RNA, T in DNA."] },
        { id:"w4", skill:"Frameshift mutations", goal:3,
          prompt:"Two bases are deleted near the start of a gene. What is the most likely effect on the protein?",
          options:[
            { t:"Every codon after the deletion is read differently, usually giving a non-working protein", ok:true, why:"Deleting a number of bases that isn’t a multiple of 3 shifts the reading frame." },
            { t:"One amino acid changes", why:"That’s a substitution, not a frameshift." },
            { t:"No effect, because two bases are too few to matter", why:"Even one base shifts the frame." },
            { t:"The protein becomes two amino acids shorter and still works", why:"That would need 6 bases (two whole codons) removed in frame." }],
          hints:["How are codons read?", "In threes, from the start codon.", "Removing 2 shifts every later codon."] },
        { id:"w5", skill:"Genes to proteins", goal:1,
          prompt:"Which molecule carries a gene’s message from the nucleus to the ribosome?",
          options:[
            { t:"mRNA", ok:true, why:"mRNA is the message (module 23)." },
            { t:"tRNA", why:"tRNA brings amino acids." },
            { t:"Cas9", why:"Cas9 is a DNA-cutting enzyme, not a messenger." },
            { t:"DNA polymerase", why:"It copies DNA." }],
          hints:["Which RNA is the “message”?", "It’s made by transcription.", "mRNA."] },
        { id:"w6", skill:"Frameshift mutations", goal:3,
          prompt:"Which change keeps the reading frame?",
          options:[
            { t:"Deleting 3 bases", ok:true, why:"3 bases is one whole codon, so later codons stay in frame." },
            { t:"Deleting 1 base", why:"Not a multiple of 3, so the frame shifts." },
            { t:"Inserting 2 bases", why:"Not a multiple of 3, so the frame shifts." },
            { t:"Inserting 4 bases", why:"Not a multiple of 3, so the frame shifts." }],
          hints:["Codons are groups of 3.", "Which number is a multiple of 3?", "3."] }
      ],
      refreshers:{
        "Base pairing":"A–T (A–U in RNA) and G–C. More matching positions means a stronger hold.",
        "DNA vs RNA":"RNA is single-stranded, has ribose and uses U instead of T.",
        "Frameshift mutations":"Adding or removing bases in numbers that aren’t multiples of 3 changes every codon downstream, usually ruining the protein.",
        "Genes to proteins":"DNA → mRNA (transcription) → protein (translation)."
      }
    }
  },
  explore:{
    heading:"Cas9 targeting simulator",
    intro:"Load a guide, let Cas9 search, and see what the cell does with the cut.",
    // model data (plan §4 Explore): match counts out of 20 for each guide at sites T1–T6; PAM defaults; gene membership
    sites:[
      { id:"T1", gene:"goi", where:"in the gene of interest" },
      { id:"T2", gene:"goi", where:"in the gene of interest" },
      { id:"T3", gene:"", where:"outside genes" },
      { id:"T4", gene:"x", where:"in gene X" },
      { id:"T5", gene:"", where:"outside genes" },
      { id:"T6", gene:"", where:"outside genes" }],
    match:{ A:[20, 9, 6, 11, 8, 7], B:[8, 20, 10, 7, 20, 6], C:[7, 10, 20, 18, 9, 5] },
    pam:[1, 1, 0, 1, 1, 1],
    // bacterial defence mode: how well each stored spacer's guide matches the phage's DNA (the phage target has a PAM)
    spacers:[7, 20, 9],
    about:"<ol><li><strong>Cut rule:</strong> Cas9 cuts a site only if the site has a PAM <strong>and</strong> the match is ≥ 18 of 20.</li><li><strong>Repair rule:</strong> if a template is supplied <strong>and</strong> the cell is dividing, HDR repairs the cut and the outcome is <strong>precise change</strong>. Otherwise NHEJ repairs it and the outcome is <strong>gene disrupted</strong> (if the site is inside a gene) or <strong>change outside the gene</strong> (otherwise).</li><li><strong>Gene membership:</strong> T1 and T2 are in the gene of interest; T4 is in a different gene, “gene X”; T3, T5 and T6 are outside genes.</li></ol><p>Real cutting depends on more than a count. This model keeps the idea.</p>",
    aha:"The guide decides <strong>where</strong>, the PAM decides <strong>whether</strong>, and the cell decides <strong>what</strong>.",
    predIntro:"Make a prediction first. Then Cas9 runs the search and the cell panel shows what happens.",
    predictions:[
      { id:"p1", start:{ guide:"A", tpl:false, cell:"div" },
        prompt:"Genome editing, Guide A, no template, dividing cells. Which site(s) will Cas9 cut?",
        options:[{ t:"T1 only", ok:true }, { t:"T1 and T4" }, { t:"Every site" }, { t:"None" }],
        explain:"Guide A matches T1 at 20 of 20 and T1 has a PAM. No other site matches 18 or more." },
      { id:"p2", start:{ guide:"C", tpl:false, cell:"div" },
        prompt:"Guide C matches T3 perfectly. What happens at T3?",
        options:[{ t:"No cut, because T3 has no PAM", ok:true }, { t:"A cut, because the match is perfect" }, { t:"A cut, plus a cut at every other site" }, { t:"No cut, because guide C is the wrong length" }],
        explain:"Cas9 checks for a PAM first. With no PAM, it never opens the DNA to test the match." },
      { id:"p3", start:{ guide:"A", tpl:true, cell:"div" },
        prompt:"Guide A, template on, dividing cells. What ends up at T1?",
        options:[{ t:"The change written in the template", ok:true }, { t:"New DNA designed by Cas9" }, { t:"The original DNA, unchanged" }, { t:"A random new gene" }],
        explain:"HDR copies the supplied template. Cas9 only cut." },
      { id:"p4", start:{ guide:"A", tpl:true, cell:"non" },
        prompt:"Guide A, template on, <strong>non-dividing</strong> cells. Now what happens at T1?",
        options:[{ t:"The ends are joined by NHEJ, often with a small insertion or deletion", ok:true }, { t:"HDR copies the template as before" }, { t:"The cut stays open forever" }, { t:"The cell divides to use the template" }],
        explain:"HDR works mainly in dividing cells. NHEJ is the default and is error-prone." }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Knock out the gene of interest without touching any other gene.",
        why:"Guide A cuts only T1, and with no template NHEJ joins the ends, disrupting the gene of interest. No other gene is changed.",
        general:"Choose a guide that cuts only inside the gene of interest, and let NHEJ do the repair.",
        msgs:{ mode:"Choose Genome editing (or Experiment) mode: this goal is about editing a genome.", guideB:"Guide B also cuts T5. Look at its match list.",
          guideC:"Guide C never cuts the gene of interest: its only cut is T4, in gene X.", tplDiv:"With a template in dividing cells you get a precise change, not a knockout.",
          tplNon:"Here NHEJ still knocks the gene out, but the template sits unused. A knockout plan needs no template: turn it off.", sites:"With these site switches, Guide A doesn’t cut T1 alone. Put the PAM switches back to the start (T3 off, the rest on)." },
        hints:["Which guide cuts only inside the gene?", "Check each guide’s sites with ≥ 18 matches and a PAM.", "Guide A, no template."] },
      { id:"tc2", goal:3, prompt:"Make a precise change in the gene of interest.",
        why:"Guide A cuts only T1; with a template in dividing cells, HDR copies the template: a precise change, and nothing else is cut.",
        general:"A precise change needs HDR, and only T1 should be cut.",
        msgs:{ mode:"Choose Genome editing (or Experiment) mode: this goal is about editing a genome.", guideB:"Guide B also cuts T5, outside the gene. That’s an unwanted extra cut.",
          guideC:"Guide C never cuts the gene of interest: its only cut is T4, in gene X.", non:"HDR needs dividing cells.",
          noTpl:"No template, so NHEJ repairs the cut: that’s a knockout, not a precise change.", sites:"With these site switches, Guide A doesn’t cut T1 alone. Put the PAM switches back to the start (T3 off, the rest on)." },
        hints:["Precise change needs which repair?", "HDR needs a template and dividing cells.", "Guide A, template on, dividing cells."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Guide C was designed for T4, in gene X. Will it cut <strong>only</strong> T4? Predict, then run it in Experiment mode. Then make one change to the site switches so that Guide C cuts nothing.",
        why:"T4 matched only 18 of 20 positions, yet it was still cut. That’s how off-target effects happen.",
        general:"Predict, run Guide C with the original switches, then make one switch change.",
        // the prediction chips shown in Experiment mode (chosen before the run)
        chips:[
          { id:"t4", t:"T4 only, because T3 (20 of 20) has no PAM", ok:true },
          { id:"t34", t:"T3 and T4, because both match 18 or more", fb:"T3 matches 20 of 20, but check its PAM." },
          { id:"t3", t:"T3 only, because it matches 20 of 20", fb:M3 },
          { id:"none", t:"No sites, because 18 of 20 isn’t a perfect match", fb:"In this model, 18 of 20 beside a PAM is enough for a cut." }],
        msgs:{ tpl:"Templates change the repair, not where Cas9 cuts.", t3:"That makes things worse: T3 matches 20 of 20, so it would be cut too.",
          mode:"Switch to Experiment mode: the site switches work only there.", guide:"Load Guide C: this challenge is about the guide designed for T4.",
          pred:"Choose your prediction (in the Experiment panel) before you run Guide C.",
          predWrong:"The prediction you chose before the run didn’t hold up. Choose the prediction the run supports, then run Guide C again with the original switches.",
          run:"Run Guide C with the original switches (T3 off, the rest on), so the run can test your prediction.",
          zero:"Guide C still cuts T4. Now make one change to the site switches so that Guide C cuts nothing.",
          many:"Make just one change to the site switches.", other:"Guide C still cuts T4: that switch doesn’t affect it." },
        hints:["Which sites reach 18 matches for guide C?", "T3 (20) and T4 (18). Which of them has a PAM?", "Only T4, so only T4 is cut. Turning off T4’s PAM stops all cutting."] }
    ]
  },
  part3:{
    slug:"ethics", name:"Should we?", heading:"Should we?",
    intro:"Four stations, each a real-world use of gene editing. Classify it, weigh it, and connect it back to the mechanism. Your views are yours: only the evidence and the use of terms are checked.",
    stations:[
      { id:"s1", n:1, t:"Somatic or germline?", text:"Tap a card, then tap the bin it belongs in.",
        bins:[{ id:"som", t:"Somatic", sub:"only the patient" }, { id:"germ", t:"Germline", sub:"descendants too" }, { id:"nh", t:"Not human" }],
        cards:[
          { id:"c1", t:"Editing a patient’s own blood stem cells, outside the body, to treat an inherited blood disorder", answer:"som", why:"Blood stem cells are body (somatic) cells: only the patient is affected, not their descendants." },
          { id:"c2", t:"Editing an embryo before implantation", answer:"germ", why:"Every cell of the future child, including its eggs or sperm, carries the change, so descendants can inherit it." },
          { id:"c3", t:"Editing a research mouse line", answer:"nh", why:"Not human: the mice pass the change to their offspring, but no person or person’s descendant is affected." },
          { id:"c4", t:"Editing a crop plant", answer:"nh", why:"Not human: the change passes to the plant’s seeds, but no person is edited." },
          { id:"c5", t:"Editing a patient’s liver cells inside the body", answer:"som", why:"Liver cells are somatic: only the patient is affected, not their descendants." }],
        wrong:"Ask: could this change reach a person’s child? " + M5,
        wrongNh:"Is a person being edited at all? Research animals and crops go in “Not human”.",
        wrongHuman:"A person is being edited here, so the bin is Somatic or Germline." },
      // VERIFY: approval status of CRISPR-based therapies for inherited blood disorders in Canada (plan §6).
      // VERIFY: details of the 2018 embryo case (announcement, condemnation, the researcher's prison sentence).
      { id:"s2", n:2, t:"The cases", text:"Three short, factual cases. Open each one.",
        cases:[
          { id:"med", t:"A medical case", tag:"Somatic", text:"An approved therapy for an inherited blood disorder edits a patient’s own blood stem cells outside the body. The edited cells are checked, then returned to the patient, where they make blood cells for life.",
            zoom:"The guide targets one site in the patient’s blood stem cells; the edited cells are tested before they go back in." },
          { id:"crop", t:"An agricultural case", tag:"Not human", text:"A crop is edited by knocking out one gene, with no foreign DNA added. The plant carries only a small change in one of its own genes.",
            zoom:"Cut inside the gene, no template: NHEJ adds or loses a few bases and the gene is knocked out." },
          { id:"twins", t:"The 2018 case", tag:"Germline", text:"A researcher announced the birth of twins from edited embryos. The work was widely condemned by scientists around the world, and the researcher was later jailed.",
            zoom:"Embryo edits reach every cell of the child, including eggs or sperm, and off-target cuts or uneven edits can’t be checked in every cell first." }] },
      // VERIFY: current wording of the Assisted Human Reproduction Act (2004) on heritable genome changes (plan §6).
      { id:"s3", n:3, t:"Canadian law",
        text:"Canada’s <strong>Assisted Human Reproduction Act</strong> (2004) prohibits altering the genome of a human cell or embryo in a way that could be passed to descendants.",
        ask:"Tap every Station 1 card this law covers, then press Check.",
        answer:["c2"],
        fb:{ som:"That edit is somatic: it can’t pass to descendants, so this prohibition doesn’t cover it.", nh:"The Act is about human cells and embryos, not mice or crops.", missing:"One card describes a change that could pass to descendants. Find it.",
          good:"The Act covers the embryo edit, because that change could pass to descendants. Somatic edits and non-human edits fall outside this prohibition." } },
      // @component S12 claimBuilder data (Station 4)
      { id:"s4", n:4, t:"Weigh it", text:"For the medical case, build a claim: choose one benefit, one risk and one condition.",
        groups:[
          { id:"ben", t:"Benefit", chips:[
            { id:"cause", t:"it treats the disorder at its cause, in the patient’s own cells" },
            { id:"once", t:"it can work as a one-time treatment instead of lifelong care" },
            { id:"donor", t:"it uses the patient’s own cells, so no donor match is needed" }] },
          { id:"risk", t:"Risk", chips:[
            { id:"off", t:"off-target cuts could change other genes", zoom:"A guide can pair with a near-match elsewhere; if a PAM sits beside it, Cas9 cuts there too. You saw this in Explore, challenge 3 (T4, 18 of 20)." },
            { id:"cost", t:"cost and access could limit who gets it", zoom:"Each patient’s own stem cells are edited outside the body, checked and returned: the cut-and-repair process is made to order for every patient." },
            { id:"long", t:"long-term effects are unknown", zoom:"The edited stem cells keep dividing for life, so any unwanted change from the cut or its repair is copied into new blood cells for years." }] },
          { id:"cond", t:"Condition", chips:[
            { id:"consent", t:"patients give informed consent" },
            { id:"over", t:"independent oversight approves each use" },
            { id:"follow", t:"patients are followed up for years" }] }],
        need:"Choose one chip from each group: a benefit, a risk and a condition." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Should we? quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which edit could be inherited?",
          choices:[{ t:"an embryo edit", ok:true, fb:"Right. An embryo’s cells give rise to every cell of the child, including eggs or sperm." },
            { t:"a blood stem cell edit", fb:M5 }, { t:"a liver edit", fb:"Liver cells are somatic. " + M5 }, { t:"a skin cell edit", fb:"Skin cells are somatic. " + M5 }] },
        { id:"q2", goal:6, prompt:"Why do therapies edit blood stem cells outside the body first?",
          choices:[{ t:"The edited cells can be checked before they are returned", ok:true, fb:"Right. Edited cells can be tested, for example for off-target cuts, before they go back to the patient." },
            { t:"Cas9 only works outside bodies", fb:"Cas9 can work inside the body too: think of the liver card in Station 1." },
            { t:"Blood cells have no DNA", fb:"Blood stem cells have a full set of DNA." },
            { t:"It makes the edit inherited", fb:M5 }] },
        { id:"q3", goal:4, prompt:"Which is a risk that comes straight from the mechanism?",
          choices:[{ t:"Cuts at near-matching sites", ok:true, fb:"Right. " + M6 },
            { t:"The guide turns into protein", fb:"The guide is RNA that pairs with DNA; it isn’t translated." },
            { t:"The PAM spreads to other cells", fb:"The PAM is a short sequence in the target DNA; it doesn’t move." },
            { t:"Cas9 copies itself", fb:"Cas9 is an enzyme that cuts; it doesn’t copy anything." }] },
        // VERIFY: the Assisted Human Reproduction Act's current status and wording (plan Q4).
        { id:"q4", goal:6, prompt:"Which Canadian law addresses heritable human genome changes?",
          choices:[{ t:"The Assisted Human Reproduction Act", ok:true, fb:"Right. It prohibits changes to the human genome that could be passed to descendants." },
            { t:"The Fisheries Act", fb:"That law covers other things; check Station 3." },
            { t:"The Canada Health Act", fb:"That law covers other things; check Station 3." },
            { t:"The Food and Drugs Act", fb:"That law covers other things; check Station 3." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"who", type:"sorter", title:"Who is affected?", summary:"Who is affected?", goal:[5, 6], noun:"edit", txt:true,
        instruction:"Sort each edit by who it can affect.",
        boxes:[{ id:"som", label:"Somatic", sub:"only the patient" }, { id:"germ", label:"Germline", sub:"descendants too" }, { id:"nh", label:"Not human" }],
        items:[
          { id:"i1", t:"Edited bone marrow cells returned to a patient.", answer:"som", goal:5,
            why:"Bone marrow cells are body cells: only the patient is affected.",
            wrong:{ germ:"Bone marrow cells aren’t eggs, sperm or embryos. " + M5, nh:"These are a patient’s own human cells." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline.", "Somatic: bone marrow cells are body cells, so only the patient is affected."] },
          { id:"i2", t:"An edited fertilized egg implanted for pregnancy.", answer:"germ", goal:5,
            why:"A fertilized egg becomes every cell of the child, including its eggs or sperm.",
            wrong:{ som:"A fertilized egg becomes every cell of the child, including its eggs or sperm, so the change can reach descendants.", nh:"This is a human fertilized egg." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline.", "Germline: the fertilized egg becomes every cell of the child, including eggs or sperm."] },
          { id:"i3", t:"Edited sperm-producing stem cells.", answer:"germ", goal:5,
            why:"Sperm-producing cells make gametes, so changes can reach children.",
            wrong:{ som:"Sperm-producing cells make gametes, so changes can reach children.", nh:"These are human cells that make sperm." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline.", "Germline: sperm-producing cells make gametes, so changes can reach children."] },
          { id:"i4", t:"An edited cell line grown in a dish, never placed in a person.", answer:"nh", goal:6,
            why:"Not human: research cells in a dish, with no descendants.",
            wrong:{ som:"These cells never go into a person, so no patient is affected.", germ:"Cells in a dish have no descendants." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline. Is any person involved here?", "Not human: research cells in a dish, never placed in a person, have no descendants."] },
          { id:"i5", t:"A knockout zebrafish line for studying heart development.", answer:"nh", goal:6,
            why:"Not human: a research fish line.",
            wrong:{ som:"No person is edited: it’s a fish.", germ:"The fish pass it on, but no person’s descendants are affected." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline. Is a person involved here?", "Not human: zebrafish are research animals."] },
          { id:"i6", t:"A wheat line with a gene knocked out.", answer:"nh", goal:6,
            why:"Not human: a crop line.",
            wrong:{ som:"No person is edited: it’s a crop.", germ:"The wheat passes it on in its seeds, but no person’s descendants are affected." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline. Is a person involved here?", "Not human: wheat is a crop."] },
          { id:"i7", t:"Edited eye cells injected into one eye.", answer:"som", goal:5,
            why:"Eye cells are body cells: only the patient is affected.",
            wrong:{ germ:"Eye cells aren’t eggs, sperm or embryos. " + M5, nh:"These are a patient’s own human cells." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline.", "Somatic: eye cells are body cells, so only the patient is affected."] },
          // VERIFY: how Canadian law treats editing research embryos that are never implanted (plan item 8).
          { id:"i8", t:"An edited early embryo used only for research and never implanted.", answer:"germ", goal:5,
            why:"Germline: the embryo’s cells <em>could</em> pass changes on, and the law treats this seriously.",
            wrong:{ som:"Embryo cells could become every cell of a person, including eggs or sperm.", nh:"It is a human embryo, even though it is used only for research." },
            hints:["Could this change reach a child?", "Gametes and embryos are germline.", "Germline: the embryo’s cells could pass changes on, and the law treats this seriously."] }
        ],
        wrongDefault:M5 },
      { id:"outcome", type:"mc", title:"Predict the outcome", summary:"Predict the outcome", star:true, goal:[2, 3, 4],
        instruction:"Use the simulator’s rules without the simulator. Items 3 to 6 are non-routine (★); item 5 is an investigation.",
        items:[
          { id:"r1", goal:3, prompt:"A guide matches its target 20 of 20, a PAM is present, no template is supplied, and the cells are dividing. What is the most likely outcome?",
            options:[
              { t:"Cut; NHEJ; the gene is likely disrupted", ok:true, why:"PAM and 20 of 20, so Cas9 cuts; with no template, NHEJ joins the ends and often shifts the frame." },
              { t:"Cut; HDR; a precise change", why:"No template, so no HDR. " + M4 },
              { t:"No cut", why:"A PAM and a 20-of-20 match: Cas9 cuts." },
              { t:"Cas9 writes a new gene into the cut", why:M1 }],
            hints:[RULES, "Every rule up to repair passes: PAM yes, 20 of 20. Then: no template.", "Cut; NHEJ; gene likely disrupted."] },
          { id:"r2", goal:2, prompt:"A guide matches its target 20 of 20, but there is <strong>no PAM</strong> next to the target. What happens?",
            options:[
              { t:"No cut", ok:true, why:"Cas9 checks for the PAM first." },
              { t:"Cut", why:M3 },
              { t:"A cut at the nearest PAM instead", why:"It cuts only where the guide matches." },
              { t:"A cut, then HDR", why:"No PAM, no cut, so there is nothing to repair." }],
            hints:[RULES, "The first rule fails: there’s no PAM.", "No cut."] },
          { id:"r3", goal:4, prompt:"★ A guide matches the target 20 of 20 <strong>and</strong> a second gene 19 of 20, both with PAMs. Which may be cut?",
            options:[
              { t:"Both may be cut", ok:true, why:"19 of 20 is ≥ 18 beside a PAM: an off-target cut." },
              { t:"Only the target", why:"19 of 20 is close enough to be cut in this model. " + M6 },
              { t:"Only the second gene", why:"The target matches perfectly beside a PAM, so it is cut." },
              { t:"Neither", why:"Both sites pass the PAM rule and the ≥ 18 rule." }],
            hints:[RULES, "Apply the rules to each site: both have a PAM, and 20 and 19 are both ≥ 18.", "Both may be cut."] },
          { id:"r4", goal:3, prompt:"★ A scientist wants a precise correction in mature nerve cells. What is most likely?",
            options:[
              { t:"NHEJ is likely instead, so this plan may give a knockout", ok:true, why:"HDR works mainly in dividing cells; mature nerve cells don’t divide, so NHEJ joins the ends." },
              { t:"HDR works, giving the precise correction", why:"HDR works mainly in dividing cells." },
              { t:"No cut, because nerve cells have no PAM", why:"A PAM is part of the DNA next to the target, in any cell type." },
              { t:"The cells divide so that they can use the template", why:"Mature nerve cells don’t divide." }],
            hints:[RULES, "The repair rule fails: mature nerve cells don’t divide.", "NHEJ is likely instead, so this plan may give a knockout."] },
          { id:"r5", goal:2, prompt:"★ Investigation. An editing experiment is done on cells in a dish. Which control best shows that the guide caused the change?",
            options:[
              { t:"The same cells given Cas9 with no guide, or with a guide that matches nothing", ok:true, why:"Only the guide differs, so any difference is caused by the guide." },
              { t:"Untreated cells only", why:"That tests everything at once; remove just the guide to isolate it." },
              { t:"The same cells given twice as much guide", why:"That changes the amount of guide, not whether it is there." },
              { t:"A different type of cell given the same guide and Cas9", why:"Changing the cells adds a second variable." }],
            hints:["A good control changes only one thing.", "Which single part do you want to test? Remove just that part.", "The same cells given Cas9 with no guide (or a guide that matches nothing)."] },
          { id:"r6", goal:2, prompt:"★ A virus that infects bacteria mutates the stretch that matches the bacterium’s spacer. What happens on the next infection?",
            options:[
              { t:"The virus escapes the defence", ok:true, why:"The guide no longer matches, so Cas9 doesn’t cut." },
              { t:"The virus is still destroyed", why:"The guide no longer matches." },
              { t:"The bacterium changes the PAM to match", why:"The PAM is in the virus’s DNA beside the target; the bacterium can’t change it." },
              { t:"Cas9 cuts the bacterium’s own DNA instead", why:"Cutting needs a guide match beside a PAM." }],
            hints:["The spacer is copied into the guide. Does the guide still match?", "The match rule fails: the matching stretch has changed.", "The virus escapes the defence."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ruby", how:"",
        instruction:"Ruby made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain how CRISPR–Cas9 knocks out a gene.",
            steps:["A guide RNA is made to match the target in the gene.", "The guide pairs with the matching DNA next to a PAM.", "Cas9 cuts both DNA strands there.", "Cas9 then writes a short stop signal into the gap.", "The gene now makes a non-working protein."],
            answer:3,
            stepFb:["Step 1 is correct: the guide is designed to match the target.", "Step 2 is correct: base pairing next to a PAM.", "Step 3 is correct: Cas9 cuts both strands.", "", "Step 5 is the goal of a knockout; the mistake is earlier."],
            fixes:[
              { t:"The cell joins the ends by NHEJ, often adding or losing bases, which shifts the reading frame.", ok:true, why:M1 },
              { t:"Cas9 writes a random sequence.", why:"Cas9 doesn’t write anything." },
              { t:"The guide RNA becomes part of the gene.", why:"The guide is not inserted." },
              { t:"DNA polymerase deletes the gene.", why:"Repair joins the ends; it doesn’t delete the whole gene." }],
            hints:["What does Cas9 do, and only do?", "Cas9 only cuts. Who fills the gap?", "The cell joins the ends by NHEJ, often adding or losing bases."] },
          { id:"e2", goal:5, task:"Explain whether a blood stem cell therapy changes a patient’s children.",
            steps:["The patient’s own blood stem cells are edited outside the body.", "The edited cells are checked and returned.", "They make healthy blood cells for life.", "Because the change is in the patient’s DNA, the patient’s children will inherit it.", "So the therapy affects future generations."],
            answer:3,
            stepFb:["Step 1 is correct: the cells are edited outside the body.", "Step 2 is correct: the cells are checked, then returned.", "Step 3 is correct: blood stem cells keep making blood cells.", "", "Step 5 follows from the mistake; the mistake is earlier."],
            fixes:[
              { t:"Blood stem cells are somatic; eggs and sperm are unchanged, so children don’t inherit the edit.", ok:true, why:M5 },
              { t:"Children inherit it only if the patient is young.", why:"Age doesn’t matter; cell type does." },
              { t:"Children inherit half of the edit.", why:"Somatic edits aren’t inherited at all." },
              { t:"Children inherit it if the edit is precise.", why:"Precision doesn’t change which cells were edited." }],
            hints:["Which cells were edited?", "Blood stem cells are somatic. Which cells pass DNA to children?", "Only eggs and sperm pass DNA on, and they are unchanged."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In Explore, which result surprised you most: the PAM rule, the non-dividing cell, or the 18-of-20 cut? Why?" },
      { id:"j2", q:"In your own words, explain “the guide decides where, the PAM decides whether, the cell decides what”." },
      { id:"j3", q:"Explain to a friend the difference between a somatic edit and a germline edit, using one example of each." },
      { id:"j4", q:"Where do you stand on editing embryos? Name one piece of evidence and one value that shape your view, and one question you’d still want answered." }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In CRISPR–Cas9, what finds the target DNA?", options:[
          { t:"The guide RNA, by base pairing", ok:true, why:"The guide pairs with the matching stretch." },
          { t:"Cas9, by reading the protein", why:"Cas9 cuts once the guide has matched; it doesn’t read proteins." },
          { t:"The PAM, by moving to the gene", why:"The PAM is a fixed short sequence in the DNA." },
          { t:"The template, by attaching first", why:"The template is used only in HDR repair." }] },
        b:{ prompt:"In CRISPR–Cas9, what cuts the DNA?", options:[
          { t:"Cas9", ok:true, why:"Cas9 is the enzyme that makes the double-strand cut." },
          { t:"The guide RNA", why:"The guide matches; it doesn’t cut." },
          { t:"The PAM", why:"The PAM is part of the DNA." },
          { t:"DNA ligase", why:"Ligase joins DNA; it doesn’t cut." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Besides a matching target, what must Cas9 find before it cuts?", options:[
          { t:"A PAM sequence right next to the target", ok:true, why:"No PAM, no cut." },
          { t:"A template", why:"Templates matter only for repair." },
          { t:"A start codon", why:"Start codons matter in translation, not cutting." },
          { t:"A second guide", why:"One guide is enough." }] },
        b:{ prompt:"A target matches the guide perfectly but has no PAM beside it. What happens?", options:[
          { t:"Cas9 doesn’t cut there", ok:true, why:"Cas9 checks for the PAM first." },
          { t:"Cas9 cuts, because the match is perfect", why:M3 },
          { t:"Cas9 cuts at the nearest PAM instead", why:"It cuts only where the guide matches." },
          { t:"The guide changes to fit another site", why:"Guides don’t change." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which repair pathway needs a template?", options:[
          { t:"Homology-directed repair (HDR)", ok:true, why:"HDR copies the template." },
          { t:"Non-homologous end joining (NHEJ)", why:"NHEJ joins the ends without one." },
          { t:"Both", why:"Only HDR." },
          { t:"Neither", why:"HDR does." }] },
        b:{ prompt:"Which repair pathway often adds or removes a few bases?", options:[
          { t:"NHEJ", ok:true, why:"It joins the ends quickly and imprecisely." },
          { t:"HDR", why:"HDR is the precise one." },
          { t:"Both equally", why:"HDR is precise when a template is present." },
          { t:"Neither", why:"NHEJ does." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A guide matches its target perfectly with a PAM. No template is given, and the cells divide. What is the most likely outcome?", options:[
          { t:"A cut, then NHEJ, likely disrupting the gene", ok:true, why:"No template means no HDR." },
          { t:"A precise correction", why:"No template means no HDR. " + M4 },
          { t:"No cut", why:"A perfect match beside a PAM is cut." },
          { t:"The gene is removed completely", why:"NHEJ usually changes only a few bases." }] },
        b:{ prompt:"Same guide and PAM, a template is given, and the cells divide. What is the most likely outcome?", options:[
          { t:"A cut, then HDR copying the template: a precise change", ok:true, why:"With a template in dividing cells, HDR copies the template." },
          { t:"NHEJ only", why:"With a template in dividing cells, HDR can copy it for a precise change." },
          { t:"No cut", why:"A perfect match beside a PAM is cut." },
          { t:"Cas9 inserts the template", why:"The cell copies the template during HDR." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Guide P matches the target 20/20 and another gene 19/20 (both with PAMs). Guide Q matches the target 20/20 and nothing else above 10/20. Which is the better choice, and why?", options:[
          { t:"Q, because P risks an off-target cut in the other gene", ok:true, why:"19 of 20 beside a PAM can be cut, so P risks changing the other gene." },
          { t:"P, because it matches more sites", why:M6 },
          { t:"Either; matches below 20/20 are never cut", why:M6 },
          { t:"Neither; Cas9 ignores guides", why:M2 }] },
        b:{ prompt:"A guide cuts its target and, unexpectedly, a second gene. What best explains this?", options:[
          { t:"The second gene has a near-match beside a PAM", ok:true, why:M6 },
          { t:"Cas9 cuts randomly", why:"Cuts follow the guide." },
          { t:"The template inserted itself there", why:M1 },
          { t:"The PAM moved", why:"The PAM is a fixed short sequence in the DNA." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"A bacterium carries a spacer from virus V. Virus V and virus W both infect it. Which is destroyed?", options:[
          { t:"Only virus V", ok:true, why:"Only V’s DNA matches the guide." },
          { t:"Only virus W", why:"W doesn’t match." },
          { t:"Both", why:"Cutting needs a match." },
          { t:"Neither", why:"This is exactly what the system evolved to do. " + M7 }] },
        b:{ prompt:"Virus V’s DNA changes so it no longer matches the bacterium’s spacer. What happens on the next infection?", options:[
          { t:"V escapes, because the guide no longer matches", ok:true, why:"No match, no cut." },
          { t:"V is still destroyed", why:"Cutting needs a guide match beside a PAM." },
          { t:"The bacterium makes a new PAM", why:"PAMs belong to the target DNA." },
          { t:"The spacer changes itself to match", why:"Spacers are added only after a new infection is survived." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the clearest explanation of why germline editing is debated more than somatic editing?", options:[
          { t:"“Germline changes pass to future generations, who can’t consent; somatic changes affect only the treated person.”", ok:true, why:"Inheritance and consent are the key differences." },
          { t:"“Germline editing uses a different enzyme.”", why:"Both use the same tools; what differs is which cells are edited." },
          { t:"“Somatic editing is always safe.”", why:"No editing is risk-free." },
          { t:"“Germline cells have no DNA.”", why:"They do." }] },
        b:{ prompt:"Which sentence correctly describes a blood stem cell therapy?", options:[
          { t:"“It’s somatic: the edited cells make blood, and eggs and sperm are unchanged.”", ok:true, why:"Blood stem cells are somatic." },
          { t:"“It’s germline because blood reaches every organ.”", why:M5 },
          { t:"“It’s germline because the edit is permanent.”", why:"Permanent ≠ inherited. " + M5 },
          { t:"“It isn’t editing because the cells are outside the body.”", why:"It is." }] } },
      { id:"c2", cat:"C", goal:[1, 3],
        a:{ prompt:"Which best explains why NHEJ “knocks out” a gene?", options:[
          { t:"“Joining the ends often adds or loses a few bases, shifting the reading frame, so the protein doesn’t work.”", ok:true, why:M4 },
          { t:"“NHEJ removes the whole chromosome.”", why:"Only a few bases change." },
          { t:"“Cas9 writes a stop signal.”", why:M1 },
          { t:"“The guide stays stuck in the gene.”", why:"The guide leaves." }] },
        b:{ prompt:"Which best explains why HDR can make a precise change?", options:[
          { t:"“The cell copies the supplied template, which carries the exact change wanted.”", ok:true, why:"HDR copies the template." },
          { t:"“Cas9 checks its own work.”", why:M1 },
          { t:"“HDR deletes the gene.”", why:"It copies; it doesn’t delete." },
          { t:"“The PAM guides the new bases.”", why:"The PAM only lets Cas9 cut; the template supplies the change." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A breeder wants a crop plant that no longer makes an enzyme that causes browning. Which plan fits?", options:[
          { t:"Cut inside the enzyme’s gene and let NHEJ disrupt it (no template)", ok:true, why:"A knockout needs only a cut and NHEJ." },
          { t:"Supply a template with a new gene", why:"That adds DNA; a knockout doesn’t need it." },
          { t:"Edit only the PAM", why:"Changing the PAM would stop Cas9 cutting there, not knock out the gene." },
          { t:"Edit the plant’s pollen only", why:"The goal is the plant itself." }] },
        b:{ prompt:"Researchers want to replace a faulty version of a gene with a working version in dividing cells grown in a dish. Which plan fits?", options:[
          { t:"Cut near the fault and supply a template carrying the working version (HDR)", ok:true, why:"HDR copies the template in dividing cells." },
          { t:"Cut with no template", why:"That gives a knockout." },
          { t:"Use a guide with no PAM nearby", why:M3 },
          { t:"Use non-dividing cells", why:"HDR needs dividing cells." }] } },
      // VERIFY: Assisted Human Reproduction Act wording and status (plan A2).
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"Which proposal would Canada’s Assisted Human Reproduction Act prohibit?", options:[
          { t:"Editing an embryo so the change could be passed to descendants", ok:true, why:"That would be a heritable change to the human genome." },
          { t:"Editing a patient’s blood stem cells", why:"That’s somatic." },
          { t:"Editing a crop", why:"That falls under food and plant regulators, not this Act." },
          { t:"Editing research mice", why:"Not covered by this Act." }] },
        b:{ prompt:"Which proposal is somatic and so not a heritable change?", options:[
          { t:"Editing a patient’s own liver cells", ok:true, why:"Liver cells are somatic: the edit isn’t passed to children." },
          { t:"Editing sperm-producing stem cells", why:M5 },
          { t:"Editing an embryo for implantation", why:M5 },
          { t:"Editing an egg cell", why:M5 }] } }
    ]
  },
  // VERIFY: tip 5 and checklist line 5 rest on Canada's prohibition of heritable human genome changes (plan §6).
  task:{
    title:"Plan an edit", summary:"Plan an edit",
    statement:"<p>Plan a gene edit that does exactly what you intend. There’s more than one good plan.</p>" +
      '<div class="tbl-wrap"><table class="cr-tbl cr-cards"><caption class="tiny">Target site cards</caption><thead><tr><th scope="col">Site</th><th scope="col">PAM next to it?</th><th scope="col">Other perfect or near matches in genome?</th><th scope="col">Location</th></tr></thead><tbody>' +
      '<tr><th scope="row">S1</th><td data-h="PAM">yes</td><td data-h="Other matches">none</td><td data-h="Location">inside the gene of interest</td></tr>' +
      '<tr><th scope="row">S2</th><td data-h="PAM">no</td><td data-h="Other matches">none</td><td data-h="Location">inside the gene</td></tr>' +
      '<tr><th scope="row">S3</th><td data-h="PAM">yes</td><td data-h="Other matches">one near-match (19/20) in another gene</td><td data-h="Location">inside the gene</td></tr>' +
      '<tr><th scope="row">S4</th><td data-h="PAM">yes</td><td data-h="Other matches">none</td><td data-h="Location">inside the gene</td></tr>' +
      '<tr><th scope="row">S5</th><td data-h="PAM">yes</td><td data-h="Other matches">none</td><td data-h="Location">outside any gene</td></tr></tbody></table></div>',
    sites:[
      { id:"S1", pam:true, other:false, inGene:true },
      { id:"S2", pam:false, other:false, inGene:true },
      { id:"S3", pam:true, other:true, inGene:true },
      { id:"S4", pam:true, other:false, inGene:true },
      { id:"S5", pam:true, other:false, inGene:false }],
    checks:["Cas9 can cut here", "No off-target risk", "The cut lands in the gene", "The repair fits the goal", "Somatic only"],
    tips:["Check the PAM column.", "S3 has a near-match elsewhere: off-target risk.", "S5 is outside the gene.",
      "Knockouts use NHEJ, with no template. Corrections need a template and dividing cells.",
      "Embryo edits would be heritable (prohibited in Canada)."],
    explainPrompt:"Explain why your plan cuts only where you intend, and why the repair gives the result you want.",
    vocab:"Use guide RNA, PAM, off-target, NHEJ or HDR, and somatic.",
    success:"Your plan does exactly what you intend!",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["CRISPR (origin)", "A bacterial immune system: stored spacers from past viruses guide Cas proteins to cut matching viral DNA"],
    ["Spacer", "A stored piece of a virus’s DNA in a bacterium’s CRISPR region; it becomes a guide"],
    ["Guide RNA", "About 20 nucleotides that base-pair with the target DNA, telling Cas9 where to cut"],
    ["Cas9", "The enzyme that cuts both DNA strands where the guide matches, next to a PAM"],
    ["PAM", "A short sequence right beside the target; without it, Cas9 doesn’t cut"],
    ["NHEJ", "Non-homologous end joining: fast, error-prone joining that often knocks a gene out"],
    ["HDR", "Homology-directed repair: copies a supplied template for a precise change; mainly in dividing cells"],
    ["Knockout", "A gene disrupted so it no longer makes a working protein"],
    ["Off-target effect", "An unintended cut at a near-matching site elsewhere in the genome"],
    ["Somatic editing", "Editing body cells; changes are not inherited"],
    ["Germline editing", "Editing eggs, sperm or embryos; changes can pass to descendants"],
    ["“Where, whether, what”", "The guide decides where, the PAM decides whether, the cell’s repair decides what"]
  ]
};
