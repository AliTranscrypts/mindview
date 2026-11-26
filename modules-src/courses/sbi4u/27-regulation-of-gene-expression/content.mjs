// SBI4U 27 Regulation of Gene Expression. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/27-regulation-of-gene-expression.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "A skin cell’s nucleus can still make a whole frog or sheep. Cells keep their genes; they <strong>express</strong> different ones.";
const M2 = "Transcription factors can’t reach DNA that is packed shut. The chromatin has to be opened first.";
const M3 = "Eukaryotic genes each have their own promoter and are controlled one by one, at many levels.";
const M4 = "MicroRNAs act on the <strong>mRNA</strong>: they block its translation or have it destroyed. The gene and transcription are untouched.";
const M5 = "Alternative splicing keeps different exons, so one gene can make several proteins.";
const M6 = "DNA loops, so an activator on an enhancer thousands of base pairs away can still reach the promoter.";
const M7 = "An oncogene is a stuck accelerator: one copy is enough. A tumour suppressor is a brake: usually both copies must fail.";
const NB = " ";   // narrow no-break space for thousands (50 000)

export default {
  id:"27-regulation-of-gene-expression",
  kind:"topic",
  title:"Regulation of gene expression",
  topic:"Regulation of Gene Expression",
  readyTopic:"regulation of gene expression",
  hero:{
    headline:"Same DNA, different cells",
    text:"Your liver cells and nerve cells carry the same <strong>genome</strong>. They differ because each cell switches genes on and off at many points: how tightly the DNA is packed, which <strong>transcription factors</strong> are present, how the RNA is <strong>spliced</strong>, how long the mRNA lasts, and what happens to the protein afterwards.",
    fig:{ html:'<div class="gx-hero" id="gx-hero" role="img" aria-label="A control ladder beside one gene, with five rungs: chromatin, transcription, RNA processing, mRNA lifetime and translation, and protein changes. The gene, wound tightly on histone beads, loosens as acetyl tags appear. An activator lands on a distant enhancer and the DNA loops so it touches the promoter. RNA polymerase makes a teal pre-mRNA, which is spliced two ways into two teal mRNAs. A microRNA clips onto one mRNA, which fades. The other is translated into a brown protein that receives a phosphate tag and lights up as active."></div>' }
  },
  goals:[
    "I can name the levels at which a eukaryotic cell controls a gene, from chromatin to finished protein.",
    "I can explain how chromatin packing (acetylation, methylation) and transcription factors (activators, repressors, enhancers) control transcription.",
    "I can explain how alternative splicing, microRNAs and changes after translation control which protein is made and how much.",
    "I can predict how a change at one level affects the amount and kind of protein a cell makes.",
    "I can explain why cells with the same genome become different, using evidence (cloning, X inactivation).",
    "I can apply gene regulation to cancer, hormones and medicine."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Transcription and splicing", goal:3,
          prompt:"During RNA processing in eukaryotes, what is removed from pre-mRNA?",
          options:[
            { t:"Introns", ok:true, why:"Exons are kept and joined." },
            { t:"Exons", why:"Exons are the parts that are expressed." },
            { t:"The 5′ cap", why:"The cap is added, not removed." },
            { t:"The start codon", why:"AUG is kept." }],
          hints:["Recall module 23.", "Introns <em>in</em>terrupt; exons are <em>ex</em>pressed.", "Introns."] },
        { id:"w2", skill:"Transcription and splicing", goal:2,
          prompt:"Which statement about a typical eukaryotic gene is correct?",
          options:[
            { t:"It has its own promoter and is transcribed into its own mRNA", ok:true, why:"Eukaryotic genes are usually controlled one at a time, each from its own promoter." },
            { t:"It is part of an operon with several other genes", why:"Operons are mainly a bacterial arrangement." },
            { t:"It has no introns", why:"Most eukaryotic genes have introns." },
            { t:"It is translated in the nucleus", why:"Translation happens in the cytoplasm." }],
          hints:["Compare with the lac operon.", "Eukaryotic genes are usually controlled one at a time.", "Its own promoter, its own mRNA."] },
        { id:"w3", skill:"Operon logic", goal:2,
          prompt:"In the lac operon, what does the repressor do?",
          options:[
            { t:"It binds the operator and blocks RNA polymerase", ok:true, why:"With the repressor on the operator, the polymerase can’t transcribe the genes." },
            { t:"It binds lactose in the medium", why:"It binds allolactose inside the cell." },
            { t:"It helps RNA polymerase bind", why:"That’s CAP." },
            { t:"It splices the mRNA", why:"Bacteria don’t splice." }],
          hints:["Recall module 26.", "The repressor sits on a DNA site.", "It blocks the polymerase."] },
        { id:"w4", skill:"Operon logic", goal:4,
          prompt:"A protein that <strong>increases</strong> transcription when it binds DNA is called…",
          options:[
            { t:"An activator", ok:true, why:"CAP is a bacterial example." },
            { t:"A repressor", why:"Repressors decrease transcription." },
            { t:"An operator", why:"The operator is DNA, not a protein." },
            { t:"A ribosome", why:"Ribosomes translate." }],
          hints:["Think of CAP.", "It helps RNA polymerase.", "An activator."] },
        { id:"w5", skill:"DNA packing", goal:2,
          prompt:"In the nucleus, DNA is wrapped around proteins called…",
          options:[
            { t:"Histones", ok:true, why:"DNA plus histones = chromatin." },
            { t:"Ribosomes", why:"Ribosomes make proteins." },
            { t:"Enzymes", why:"Histones are packing proteins, not enzymes." },
            { t:"Centromeres", why:"A centromere is a region of a chromosome." }],
          hints:["The “beads on a string”.", "The beads are protein spools.", "Histones."] },
        { id:"w6", skill:"DNA packing", goal:2,
          prompt:"Why is tightly packed DNA hard to transcribe?",
          options:[
            { t:"RNA polymerase and transcription factors can’t reach the promoter", ok:true, why:"Packing hides the DNA, so the proteins that read it can’t touch it." },
            { t:"Tightly packed DNA has no genes", why:"The genes are there, just hidden." },
            { t:"It is single-stranded", why:"Packed DNA is still double-stranded." },
            { t:"It is being replicated", why:"Packing isn’t replication." }],
          hints:["Proteins need to touch the DNA to read it.", "Packing hides the DNA.", "They can’t reach it."] }
      ],
      refreshers:{
        "Transcription and splicing":"In eukaryotes, each gene has its own promoter. The pre-mRNA gets a 5′ cap and a poly-A tail, and introns are spliced out before the mRNA leaves the nucleus.",
        "Operon logic":"In bacteria, repressors block and activators help RNA polymerase. Eukaryotes use the same two kinds of protein, at more places.",
        "DNA packing":"DNA wraps around histones to form chromatin. Loosely packed chromatin can be read; tightly packed chromatin is silent."
      }
    }
  },
  explore:{
    heading:"Eukaryotic control panel",
    intro:"One gene, five levels of control. Set each switch and read how much protein the cell makes, and which one.",
    chalIntro:"Use the control panel to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    modelNote:"Transcription rate (pre-mRNA per hour) = 0 if the chromatin is closed; otherwise 10 × (4 if the activator is on) × (¼ if the repressor is on). Proteins per mRNA = 20, or 2 with the microRNA present (the mRNA is destroyed sooner). Proteins made per hour = transcription rate × proteins per mRNA. Real regulation isn’t a neat × 4 or × ¼: these are model numbers, and the point is which level each switch acts on.",
    cellBanner:"Same six genes in every nucleus. Different genes switched on.",
    predictions:[
      { id:"p1", prompt:"Start: open chromatin, activator on (800 per hour). Change: the chromatin is set to closed (methylated)." + " " + "The activator is still in the cell. What happens to protein production?",
        options:[{ t:"Drops to 0", ok:true }, { t:"Stays at 800" }, { t:"Halves to 400" }, { t:"Rises: the activator works harder" }],
        explain:"Transcription factors can’t reach DNA that’s packed shut.",
        reveal:"The beads tightened; the activator couldn’t land, and transcription stopped.",
        start:{ c:"open", act:1, rep:0, iso:"A", mir:0, phos:0, dist:0 }, change:{ c:"closed" } },
      { id:"p2", prompt:"Start: open chromatin, no activator or repressor (10 pre-mRNA per hour, 200 proteins per hour). Change: the microRNA is present." + " " + "What happens to transcription and to protein production?",
        options:[{ t:"Transcription stays at 10 per hour; protein drops to 20 per hour", ok:true }, { t:"Both drop to 0" }, { t:"Transcription drops; protein stays" }, { t:"Nothing changes" }],
        explain:"MicroRNAs act after transcription, on the mRNA.",
        reveal:"mRNAs are still made, but they’re blocked or destroyed sooner.",
        start:{ c:"open", act:0, rep:0, iso:"A", mir:0, phos:0, dist:0 }, change:{ mir:1 } },
      { id:"p3", prompt:"Start: 200 proteins per hour, isoform A. Change: the splicing is set to isoform B." + " " + "What changes?",
        options:[{ t:"The kind of protein, not the amount", ok:true }, { t:"The amount, not the kind" }, { t:"Both" }, { t:"Neither" }],
        explain:"Same gene, same rate, different exons: a different protein.",
        reveal:"The gauge stayed at 200 and the label switched to isoform B, with exon 3 replacing exon 2.",
        start:{ c:"open", act:0, rep:0, iso:"A", mir:0, phos:0, dist:0 }, change:{ iso:"B" } },
      { id:"p4", prompt:"Start: activator on, enhancer 100 base pairs away (800 per hour). Change: the enhancer slider moves to 50" + NB + "000 base pairs." + " " + "What happens to output?",
        options:[{ t:"Nothing: still 800 per hour", ok:true }, { t:"Drops to 200" }, { t:"Drops to 0" }, { t:"Doubles" }],
        explain:"DNA bends and loops, so enhancers work from far away.",
        reveal:"The DNA loop grew, and the activator still touches the promoter.",
        start:{ c:"open", act:1, rep:0, iso:"A", mir:0, phos:0, dist:0 }, change:{ dist:5 } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Make 800 proteins per hour of isoform A.",
        why:"Open chromatin and the activator give 10 × 4 = 40 pre-mRNA per hour; with no microRNA, 40 × 20 = 800 proteins per hour of isoform A.",
        general:"Check the readout: you need 800 proteins per hour, and the protein must be isoform A.",
        named:{ mode:"Switch to <strong>Control panel</strong> mode first.", isoB:"Right amount, wrong protein: change the splicing.",
          rep:"The repressor cuts transcription back to 10 per hour." },
        hints:["800 = 40 × 20.", "40 pre-mRNA per hour needs the activator and no repressor.", "Open, activator on, repressor off, no microRNA, isoform A."] },
      { id:"tc2", goal:[3, 4], prompt:"Make isoform B at 20 proteins per hour <strong>without changing the transcription rate from 10 per hour</strong>.",
        why:"Transcription stays at 10 per hour; the microRNA cuts each mRNA’s output to 2 proteins, so 10 × 2 = 20 of isoform B. There are 2 ways to keep the rate at 10: no activator and no repressor, or both together.",
        general:"Check the readout: transcription must stay at 10 per hour, and you need 20 proteins per hour of isoform B.",
        named:{ mode:"Switch to <strong>Control panel</strong> mode first.", closed:"That stops transcription completely.",
          rep:"That changes transcription to 2.5 per hour." },
        hints:["Which level cuts protein but not transcription?", "20 = 10 × 2.", "Add the microRNA; leave transcription at 10."] },
      { id:"tc3", goal:[2, 3, 4], stretch:true, prompt:"The cell needs exactly 50 <strong>active</strong> proteins of isoform B per hour. Set the panel.",
        why:"The repressor alone gives 10 × ¼ = 2.5 pre-mRNA per hour, and with no microRNA 2.5 × 20 = 50. Isoform B, phosphorylated: active.",
        general:"Check the readout: you need 50 proteins per hour of isoform B, and they must be active.",
        named:{ mode:"Switch to <strong>Control panel</strong> mode first.", am:"40 × 2 = 80: close, but not 50.",
          phos:"50 per hour, but inactive.", isoA:"Right amount, wrong protein." },
        hints:["List the possible transcription rates: 0, 2.5, 10, 40.", "Which rate × 20 or × 2 gives 50?", "2.5 × 20: repressor only, no microRNA, isoform B, phosphorylated."] }
    ]
  },
  part3:{
    slug:"cell-types", name:"Cell types", heading:"Same genome, different cells",
    intro:"Explore showed the levels of control on one gene. Now the big question: why do cells with the same DNA end up so different? Three stations: the cloning evidence, X inactivation, and what happens when regulation fails.",
    st1:{ title:"Station 1: Check it with data: do cells lose genes?",
      panel:"In the 1960s, researchers put the nucleus of a frog’s intestinal cell into an egg whose own nucleus had been removed. In 1996, the nucleus of a sheep’s udder cell was used the same way, producing the sheep Dolly.",
      head:["Nucleus came from", "Did a complete, normal animal develop?"],
      rows:[["Frog egg cell (control)", "Yes, usually"], ["Frog intestinal cell", "Yes, in a small fraction of attempts"], ["Adult sheep udder cell", "Yes, once in several hundred attempts"]],
      claims:[
        { id:"keep", t:"Specialized cells keep a complete genome", ok:true },
        { id:"lose", t:"Specialized cells lose the genes they don’t use", why:M1 },
        { id:"egg", t:"Only egg cells contain a complete genome", why:"Rows 2 and 3: nuclei from an intestinal cell and an udder cell made whole animals." },
        { id:"none", t:"The nucleus has no effect on development", why:"The animal that grew matched the donor of the nucleus: the nucleus carried its genes." }],
      evNone:"Tap the rows of the table that support your claim.",
      evCtrl:"Row 1 is the control: an egg cell’s nucleus is expected to work. It can’t show whether a <strong>specialized</strong> cell kept its genes.",
      reasons:[
        { id:"all", t:"A whole animal needs every gene, so none were lost", ok:true },
        { id:"egg", t:"The egg supplied the missing genes", why:"The egg’s own nucleus was removed: every gene came from the transplanted nucleus." },
        { id:"add", t:"Cloning adds genes back to the nucleus", why:"Nuclear transfer moves a nucleus; it adds no genes." },
        { id:"rare", t:"Success was rare, so most genes were lost", why:"Any success at all needs every gene. Rare success is about something else (see below)." }],
      done:"✓ Claim: specialized cells keep a complete genome. Evidence: an intestinal-cell nucleus and an adult udder-cell nucleus each produced a complete, normal animal. Reasoning: a whole animal needs every gene, so none were lost.",
      rare:{ prompt:"So why did it work so rarely?",
        options:[
          { id:"reset", t:"The old cell’s on/off patterns had to be reset", ok:true, why:"The specialized cell’s chromatin and transcription factors were set for an udder or intestinal cell. The egg had to switch them back to an early-embryo pattern, and that rarely works completely." },
          { id:"miss", t:"Most specialized nuclei are missing genes", why:M1 },
          { id:"mut", t:"The transplanted nucleus has mutations in every gene", why:"Mutation isn’t the cause: when it works, the animal is normal." },
          { id:"cant", t:"Eggs can’t use a nucleus from another cell", why:"Sometimes they can: rows 2 and 3 show it." }] },
      ips:"In 2006, researchers found that adding just four transcription factors could turn adult cells back into stem cells, called <strong>induced pluripotent stem cells</strong>. Resetting the on/off pattern is regulation, not new genes." },
    st2:{ title:"Station 2: X inactivation",
      text:"A female mammal has two X chromosomes. Early in development, one X in each cell is packed tightly into a <strong>Barr body</strong>, at random. The cells’ descendants keep the same choice.",
      cat:"Calico cats: a fur-colour gene on the X has an orange allele and a black allele. A cat with one of each shows patches, so a calico pattern needs two X chromosomes.",
      slider:"Cell divisions after inactivation" },
    st3:{ title:"Station 3: When regulation fails (cancer)",
      acc:{ t:"Accelerator (proto-oncogene → oncogene)", text:"One mutated copy keeps the “divide” signal stuck on." },
      brake:{ t:"Brake (tumour suppressor)", text:"One bad copy is usually covered by the good one; a second “hit” removes the brake." },
      steps:[
        "A normal cell: both proto-oncogene copies are normal, and both brake copies work. Division is controlled.",
        "Hit 1: one tumour suppressor copy is lost. The other copy still brakes, so division stays controlled.",
        "Hit 2: one proto-oncogene copy mutates into an oncogene. The accelerator is stuck on, but one working brake still holds.",
        "Hit 3: the second tumour suppressor copy is lost. Accelerator stuck on, no brakes left: the cell divides out of control."],
      banner:"Divides out of control" },
    quickCheck:{
      title:"Same genome, different cells quick check", summary:"Same genome, different cells quick check",
      items:[
        { id:"q1", goal:5, prompt:"Cloning from an udder cell shows that the cell…",
          choices:[{ t:"kept its whole genome", ok:true, fb:"A whole sheep needs every gene." },
            { t:"lost unused genes", fb:"A whole sheep needs every gene." },
            { t:"had no genes", fb:"A whole sheep needs every gene." },
            { t:"had only udder genes", fb:"A whole sheep needs every gene." }] },
        { id:"q2", goal:5, prompt:"Why are calico cats almost always female?",
          choices:[{ t:"Patches need two X chromosomes", ok:true, fb:"Two X chromosomes, one silenced at random in each cell, give two colours." },
            { t:"Females have more genes", fb:"Two X chromosomes, one silenced at random in each cell, give two colours." },
            { t:"Males can’t be orange", fb:"Two X chromosomes, one silenced at random in each cell, give two colours." },
            { t:"The Y chromosome blocks colour", fb:"Two X chromosomes, one silenced at random in each cell, give two colours." }] },
        { id:"q3", goal:6, prompt:"How many mutated copies of a proto-oncogene are usually enough to push a cell toward cancer?",
          choices:[{ t:"1", ok:true, fb:"Gain of function: one stuck accelerator is enough." },
            { t:"2", fb:"Gain of function: one stuck accelerator is enough." },
            { t:"0", fb:"Gain of function: one stuck accelerator is enough." },
            { t:"4", fb:"Gain of function: one stuck accelerator is enough." }] },
        { id:"q4", goal:5, prompt:"A Barr body is…",
          choices:[{ t:"a tightly packed, silenced X chromosome", ok:true, fb:"It’s one X shut down by packing." },
            { t:"an extra chromosome", fb:"It’s one X shut down by packing." },
            { t:"a mutated X", fb:"It’s one X shut down by packing." },
            { t:"a ribosome cluster", fb:"It’s one X shut down by packing." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"which", type:"sorter", title:"Which level?", summary:"Which level?", goal:[1, 2, 3], noun:"mechanism", txt:true,
        instruction:"Ten mechanisms. Sort each one into the level of control where it acts.",
        boxes:[{ id:"b1", label:"Chromatin" }, { id:"b2", label:"Transcription" }, { id:"b3", label:"RNA processing" }, { id:"b4", label:"mRNA and translation" }, { id:"b5", label:"After translation" }],
        wrongDefault:"Ask: is this happening to DNA packing, to transcription, to RNA, or to the protein?",
        items:[
          { id:"i1", t:"Acetyl groups added to histones", answer:"b1", why:"Acetylation loosens the chromatin." },
          { id:"i2", t:"Methyl groups added to cytosines near a promoter", answer:"b1", why:"Methylation helps pack the chromatin and silence the gene.",
            wrong:{ b2:"Methylation acts by packing the chromatin; it’s a chromatin-level control." } },
          { id:"i3", t:"An activator binds an enhancer", answer:"b2", why:"Activators on enhancers increase transcription." },
          { id:"i4", t:"A repressor binds a silencer", answer:"b2", why:"Repressors on silencers decrease transcription." },
          { id:"i5", t:"Exon 3 is kept in muscle cells but skipped in nerve cells", answer:"b3", why:"Alternative splicing happens during RNA processing." },
          { id:"i6", t:"A microRNA pairs with an mRNA and it is destroyed", answer:"b4", why:"The microRNA acts on the finished mRNA.",
            wrong:{ b2:M4 } },
          { id:"i7", t:"A short poly-A tail makes an mRNA break down sooner", answer:"b4", why:"The poly-A tail protects the mRNA; a short tail means a shorter mRNA lifetime.",
            hints:["What does a poly-A tail protect?", "The mRNA.", "mRNA and translation."] },
          { id:"i8", t:"Proinsulin is cut to make active insulin", answer:"b5", why:"Proinsulin is already a protein, so cutting it happens after translation.",
            wrong:{ b3:"Proinsulin is a protein; cutting it happens after translation." } },
          { id:"i9", t:"A phosphate group switches an enzyme on", answer:"b5", why:"Phosphorylation changes a finished protein." },
          { id:"i10", t:"A protein tagged with ubiquitin is broken down", answer:"b5", why:"Ubiquitin tags a finished protein for destruction." }
        ] },
      { id:"output", type:"custom", title:"Predict the output", summary:"Predict the output", goal:[4, 6],
        instruction:"Six items: type a number or choose an answer. Items 3–6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        how:"For a number, type it and press Check. For choices, pick one and press Check.",
        items:[
          { id:"o1", kind:"num", goal:4, prompt:"Panel: open, activator on, repressor on, no microRNA. Proteins per hour?", answer:200, display:"200 proteins per hour", unit:"proteins per hour",
            why:"10 × 4 × ¼ = 10 pre-mRNA per hour, and 10 × 20 = 200.",
            wrong:[{ match:800, fb:"The repressor divides transcription by 4: 10 × 4 × ¼ = 10." }] },
          { id:"o2", kind:"num", goal:4, prompt:"Panel: open, repressor on, microRNA present. Proteins per hour?", answer:5, display:"5 proteins per hour", unit:"proteins per hour",
            why:"10 × ¼ = 2.5 pre-mRNA per hour, and 2.5 × 2 = 5.",
            wrong:[{ match:50, fb:"The microRNA cuts proteins per mRNA to 2: 2.5 × 2 = 5." }] },
          { id:"o3", kind:"mc", goal:4, star:true, prompt:"Panel: start at 800 per hour. Which <strong>single</strong> switch change gives 80?",
            options:[
              { t:"Add the microRNA", ok:true, why:"Transcription stays at 40 per hour; proteins per mRNA fall to 2: 40 × 2 = 80." },
              { t:"Add the repressor", why:"That gives 200." },
              { t:"Close the chromatin", why:"That gives 0." },
              { t:"Turn the activator off", why:"That gives 10 × 20 = 200." }] },
          { id:"o4", kind:"num", goal:[3, 4], star:true, prompt:"A gene has exons 1–6. Exons 1 and 6 are always kept; 2, 3, 4 and 5 can each be kept or skipped. How many different mRNAs are possible?", answer:16, display:"16 mRNAs", unit:"mRNAs",
            why:"Each optional exon doubles the count: 2⁴ = 16.",
            wrong:[{ match:4, fb:"Each optional exon doubles the count: 2⁴. " + M5 }],
            hints:["For each optional exon, how many choices?", "Kept or skipped: 2.", "2 × 2 × 2 × 2 = 16."] },
          { id:"o5", kind:"mc", goal:6, star:true, prompt:"Estrogen enters a cell and binds a receptor protein, which then binds DNA near certain genes. Which level of control is this, and what kind of protein is the receptor acting as?",
            options:[
              { t:"Transcription; a transcription factor (activator)", ok:true, why:"The hormone–receptor pair binds DNA and switches on transcription of its target genes." },
              { t:"Translation; a ribosome protein", why:"The receptor binds DNA, so it acts on transcription." },
              { t:"Chromatin; a histone", why:"The receptor binds DNA near certain genes and switches them on; it isn’t a packing protein." },
              { t:"After translation; an enzyme that adds phosphate", why:"It changes which genes are transcribed, not finished proteins." }] },
          { id:"o6", kind:"mc", goal:6, star:true, prompt:"A cell has one mutant copy of a tumour suppressor gene and no other mutations. Over many divisions, which single event is most likely to start uncontrolled division?",
            options:[
              { t:"Loss or mutation of the second copy of that tumour suppressor", ok:true, why:"With both brake copies gone, nothing slows division." },
              { t:"Another mutation in the same copy", why:"The good copy still works; it has to be lost. " + M7 },
              { t:"A microRNA that blocks the mutant copy’s mRNA", why:"The mutant copy already doesn’t work; the brake comes from the good copy." },
              { t:"Nothing more: one mutant copy already causes uncontrolled division", why:"One working copy can still apply the brake." }],
            hints:["How many working copies of the brake gene are left?", "One.", "Losing it removes the brake."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Noor", how:"",
        instruction:"Noor made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"A gene’s promoter region is heavily methylated, but its activator is present. Predict expression.",
            steps:["Methyl groups on DNA near a promoter are linked to tightly packed chromatin.", "The activator is present in the nucleus.", "Activators can always find their enhancer, so it binds and the gene is transcribed.", "So the gene is expressed at a high level."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:"The packed chromatin hides the enhancer and promoter, so the activator can’t bind; the gene stays silent.", ok:true, why:M2 },
              { t:"The activator removes the methyl groups.", why:M2 },
              { t:"The gene is expressed at a medium level.", why:M2 },
              { t:"Step 3 is correct.", why:"Closed chromatin overrides the activator." }],
            hints:["Can a protein bind DNA it can’t reach?", "No.", "Silent."] },
          { id:"e2", goal:3, task:"Explain how a microRNA reduces the amount of a protein.",
            steps:["A microRNA is a short RNA, about 22 nucleotides long.", "It base-pairs with a matching stretch of DNA in the gene.", "This blocks RNA polymerase, so no mRNA is made."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2."],
            fixes:[
              { t:"It base-pairs with a matching stretch of the <strong>mRNA</strong>, which blocks translation or leads to the mRNA being destroyed.", ok:true, why:M4 },
              { t:"It binds the protein and destroys it.", why:M4 },
              { t:"It replaces the mRNA in the ribosome.", why:M4 },
              { t:"Step 2 is correct.", why:"Transcription is unaffected: the target is the mRNA." }],
            hints:["What does a microRNA pair with?", "An RNA.", "The mRNA."] },
          { id:"e3", goal:6, task:"Explain the difference between an oncogene and a tumour suppressor gene.",
            steps:["Proto-oncogenes normally encourage cells to divide when signalled.", "A mutation can make one of them always active: an oncogene.", "Tumour suppressor genes normally slow or stop division.", "One mutated copy of a tumour suppressor is enough to remove the brake.", "So tumour suppressors and oncogenes behave the same way."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "This follows from step 4."],
            fixes:[
              { t:"Usually <strong>both</strong> copies of a tumour suppressor must be lost, because one working copy can still apply the brake.", ok:true, why:M7 },
              { t:"Tumour suppressors cause division.", why:M7 },
              { t:"Oncogenes need both copies mutated.", why:M7 },
              { t:"Step 4 is correct.", why:"One good brake is usually enough." }],
            hints:["How many copies of each gene does a cell have?", "Two.", "One working brake still works."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the control panel: that closed chromatin beats an activator, or that an enhancer works from 50" + NB + "000 base pairs away?" },
      { id:"j2", q:"In your own words, why are your liver cells and nerve cells different if they have the same DNA?" },
      { id:"j3", q:"Explain to a friend the levels of gene control, from chromatin to the finished protein, using one example at each level." },
      { id:"j4", q:"Which level of control is hardest for you to remember or explain? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What does adding acetyl groups to histones usually do?", options:[
          { t:"Loosens the chromatin, so the genes there are easier to transcribe", ok:true, why:"Acetylated histones hold the DNA loosely, so transcription factors and RNA polymerase can reach it." },
          { t:"Packs the chromatin tighter, silencing the genes", why:"That describes DNA methylation and deacetylation." },
          { t:"Cuts the DNA into pieces", why:"Acetylation doesn’t cut DNA." },
          { t:"Blocks translation of the mRNA", why:"It acts on chromatin, before transcription." }] },
        b:{ prompt:"What does adding methyl groups to the DNA near a promoter usually do?", options:[
          { t:"Helps pack the chromatin and silence the gene", ok:true, why:"Methylated DNA near a promoter is linked to tightly packed, silent chromatin." },
          { t:"Opens the chromatin, so the gene is transcribed more", why:"That’s histone acetylation." },
          { t:"Changes the gene’s base sequence", why:"Methylation tags bases; it doesn’t change A, T, G, C." },
          { t:"Removes introns", why:"That’s splicing." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is an enhancer?", options:[
          { t:"A DNA sequence, sometimes far from the gene, where activator proteins bind to increase transcription", ok:true, why:"The DNA loops so the activator can reach the promoter." },
          { t:"A protein that speeds up translation", why:"An enhancer is DNA." },
          { t:"A sequence that must sit right beside the promoter", why:M6 },
          { t:"An intron that is spliced out", why:"Enhancers are control sites, not introns." }] },
        b:{ prompt:"What is a silencer?", options:[
          { t:"A DNA sequence where repressor proteins bind to decrease transcription", ok:true, why:"Silencers are the repressors’ landing sites." },
          { t:"A microRNA", why:"MicroRNAs act on mRNA." },
          { t:"A protein that packs histones", why:"A silencer is DNA." },
          { t:"The stop codon at the end of a gene", why:"Stop codons end translation." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"How does a microRNA reduce the amount of a protein?", options:[
          { t:"It pairs with the protein’s mRNA, blocking translation or having the mRNA destroyed", ok:true, why:"The microRNA’s target is the mRNA; the gene and transcription are untouched." },
          { t:"It binds the gene and blocks RNA polymerase", why:M4 },
          { t:"It cuts the protein into pieces", why:"It acts on mRNA, not protein." },
          { t:"It changes the gene’s sequence", why:"It doesn’t edit DNA." }] },
        b:{ prompt:"Which level of control does a microRNA work at?", options:[
          { t:"After transcription: on the mRNA", ok:true, why:"It pairs with the mRNA, blocking translation or having the mRNA destroyed." },
          { t:"Chromatin packing", why:M4 },
          { t:"The promoter", why:M4 },
          { t:"After the protein is made", why:"It stops the protein being made." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"In a skin cell, the insulin gene’s chromatin is tightly packed and methylated. A scientist adds the activator proteins that turn insulin on in pancreas cells. What is the most likely result?", options:[
          { t:"Little or no insulin is made, because the activators can’t reach the packed DNA", ok:true, why:"Closed chromatin overrides the activators." },
          { t:"Insulin is made at pancreas levels", why:M2 },
          { t:"Insulin is made, but spliced differently", why:"Without transcription there’s nothing to splice." },
          { t:"The skin cell’s insulin gene is missing, so nothing happens", why:"The gene is there; it’s packed away." }] },
        b:{ prompt:"A drug blocks the enzymes that remove acetyl groups from histones, so more histones stay acetylated. What is the most likely effect on many silenced genes?", options:[
          { t:"Some of them become more accessible and are transcribed more", ok:true, why:"Acetylated histones loosen the chromatin." },
          { t:"They are silenced even more strongly", why:"Acetylation opens chromatin." },
          { t:"Their mRNAs are destroyed", why:"The drug acts on chromatin." },
          { t:"Their DNA sequences change", why:"Acetylation changes packing, not sequence." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A gene has 5 exons. Exons 1 and 5 are always kept; exons 2, 3 and 4 can each be kept or skipped. How many different mRNAs can it make?", options:[
          { t:"8", ok:true, why:"2 × 2 × 2." },
          { t:"1", why:M5 },
          { t:"3", why:"Each optional exon gives 2 choices, and choices multiply." },
          { t:"5", why:"Count combinations, not exons." }] },
        b:{ prompt:"A gene has 6 exons. Exons 1 and 6 are always kept; exons 2 to 5 can each be kept or skipped. How many different mRNAs can it make?", options:[
          { t:"16", ok:true, why:"2⁴." },
          { t:"1", why:M5 },
          { t:"4", why:"Choices multiply." },
          { t:"8", why:"There are four optional exons, not three." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Why can a single mutated copy of a proto-oncogene push a cell toward cancer, while a tumour suppressor usually needs both copies mutated?", options:[
          { t:"The oncogene’s protein is always active, which one copy can do; a tumour suppressor’s one remaining good copy can still apply the brake", ok:true, why:M7 },
          { t:"Oncogenes have more copies in the genome", why:"Both kinds have two copies." },
          { t:"Tumour suppressors are on the X chromosome", why:"They’re on many chromosomes." },
          { t:"It’s the other way round", why:M7 }] },
        b:{ prompt:"A person inherits one non-working copy of a tumour suppressor gene. Why is their cancer risk higher than average?", options:[
          { t:"Only one more mutation, in the remaining good copy, is needed to remove the brake in a cell", ok:true, why:"Every cell already starts with one brake copy gone." },
          { t:"They already have cancer", why:"One working copy still controls division." },
          { t:"Their oncogenes are active", why:"This is about a tumour suppressor." },
          { t:"The bad copy makes extra growth signals", why:"A tumour suppressor’s loss removes a brake; it doesn’t add a signal." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why a liver cell and a nerve cell in one person are so different?", options:[
          { t:"“They contain the same genome but express different sets of genes, controlled by chromatin packing, transcription factors and other levels of regulation.”", ok:true, why:"It says what’s the same (the genome), what differs (which genes are expressed) and how (the levels of control)." },
          { t:"“The liver cell has liver genes and the nerve cell has nerve genes.”", why:M1 },
          { t:"“They come from different fertilized eggs.”", why:"All your cells come from one zygote." },
          { t:"“Mutations made them different.”", why:"Differences come from regulation, not mutation." }] },
        b:{ prompt:"Which is the best explanation of what Dolly the sheep showed?", options:[
          { t:"“A specialized adult cell still holds a complete genome; its gene-expression pattern could be reset to make a whole animal.”", ok:true, why:"It names the evidence (a whole animal) and what it shows (a complete genome, with its pattern reset)." },
          { t:"“Udder cells contain only udder genes.”", why:M1 },
          { t:"“Cloning changes a cell’s DNA.”", why:"The DNA came unchanged from the udder cell." },
          { t:"“Every cell can easily become any other cell.”", why:"Success was rare: resetting is hard." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which flow chart lists the levels of eukaryotic gene control in the order a gene passes through them?", options:[
          { t:"Chromatin packing → transcription → RNA processing → mRNA lifetime and translation → changes to the protein", ok:true, why:"The DNA must be open before it’s transcribed; the RNA is processed before it’s translated; the protein is changed last." },
          { t:"Transcription → chromatin packing → translation → RNA processing → protein changes", why:"Chromatin must open before transcription, and processing comes before translation." },
          { t:"Operator → promoter → structural genes", why:"That’s a bacterial operon." },
          { t:"Translation → transcription → RNA processing → chromatin", why:"Information flows DNA → RNA → protein." }] },
        b:{ prompt:"Which statement correctly compares gene control in bacteria and eukaryotes?", options:[
          { t:"“Bacteria mainly switch transcription on and off (often for whole operons); eukaryotes control genes one by one, at several levels from chromatin to finished protein.”", ok:true, why:M3 },
          { t:"“Both use operons for most genes.”", why:M3 },
          { t:"“Eukaryotes control genes only at transcription.”", why:"They use many more levels." },
          { t:"“Bacteria control genes with splicing.”", why:"Bacteria don’t splice." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Calico cats have patches of orange and black fur. Why are calico cats almost always female?", options:[
          { t:"The fur-colour gene is on the X chromosome; a female with one orange allele and one black allele silences one X at random in each cell, giving patches", ok:true, why:"Each patch is a group of cells descended from one cell that kept the same active X." },
          { t:"Females have more fur-colour genes on their autosomes", why:"The gene is on the X." },
          { t:"Males silence both X chromosomes", why:"Males have one X, and it stays active." },
          { t:"The Y chromosome blocks orange fur", why:"Y doesn’t carry this gene." }] },
        b:{ prompt:"A woman carries one normal and one non-working allele of an X-linked gene needed for sweat glands. She has patches of skin with sweat glands and patches without. Why?", options:[
          { t:"In each patch, a different X chromosome was silenced early in development, and its cells kept that choice", ok:true, why:"Where the X with the normal allele stayed active, sweat glands formed." },
          { t:"Her skin cells lost the gene in some patches", why:M1 },
          { t:"The non-working allele is dominant in some patches", why:"Patchiness comes from X inactivation, not dominance." },
          { t:"Her sweat glands have different DNA", why:M1 }] } },
      { id:"a2", cat:"A", goal:6,
        // VERIFY: plan marks this item "(verify before release)": drugs that block DNA methyltransferases are used for certain blood cancers.
        a:{ prompt:"Some drugs for certain blood cancers block the enzymes that add methyl groups to DNA. How could this help?", options:[
          { t:"Tumour suppressor genes silenced by methylation may be switched back on, restoring their brakes", ok:true, why:"Less methylation can reopen the chromatin around silenced brake genes." },
          { t:"It destroys the cancer cells’ DNA", why:"It changes tags, not sequence." },
          { t:"It stops all transcription", why:"It would increase transcription of silenced genes." },
          { t:"It mutates oncogenes back to normal", why:"It doesn’t change base sequences." }] },
        b:{ prompt:"A research drug blocks the enzymes that remove acetyl groups from histones in cancer cells. Why might it help?", options:[
          { t:"More open chromatin can let silenced tumour suppressor genes be transcribed again", ok:true, why:"Acetylated histones loosen the chromatin around silenced genes." },
          { t:"It removes the cancer cells’ oncogenes", why:"It changes packing, not genes." },
          { t:"It packs the DNA tighter so cancer cells can’t divide", why:"It does the opposite." },
          { t:"It blocks microRNAs", why:"It acts on chromatin." }] } }
    ]
  },
  task:{
    title:"Program a cell", summary:"Program a cell",
    statement:"<p>Use the control panel to program Gene X. The cell needs a moderate supply of the <strong>active isoform B</strong> protein. Meet every condition. Can you find all the answers?</p>" +
      '<ol class="gx-conds"><li>The cell makes between 50 and 300 proteins per hour (inclusive).</li><li>The protein made is isoform B.</li><li>The protein is active (phosphorylated).</li></ol>',
    checks:["Between 50 and 300 per hour", "Isoform B", "Active protein"],
    tips:["List the four possible transcription rates when the chromatin is open: 2.5, 10, 40, and 10 again (activator and repressor together).",
      "Multiply each by 20 (no microRNA) or by 2 (microRNA). Which results land between 50 and 300?",
      "Exons 1-3-4 make isoform B; a phosphate switches it on."],
    success:"Your cell is programmed!",
    more:"There are 4 answers. Can you find another?",
    explainPrompt:"Explain how two of your answers reach their output through different levels of control.",
    vocab:"Use the words chromatin, activator, repressor, microRNA, alternative splicing and phosphorylation.",
    after3:"Two very different settings both give 200. Cells often have more than one way to reach the same output.",
    afterAt:4
  },
  cards:[
    ["Chromatin", "DNA wrapped around histones; loose = readable, tight = silent."],
    ["Histone acetylation", "Opens chromatin; increases transcription."],
    ["DNA methylation", "Methyl tags on cytosines; helps silence genes."],
    ["Transcription factor", "A protein that binds DNA to control transcription (activator or repressor)."],
    ["Enhancer", "DNA site for activators; can be far from the gene (DNA loops)."],
    ["Alternative splicing", "Keeping different exons: one gene, several proteins."],
    ["MicroRNA", "Short RNA that pairs with mRNA to block translation or destroy it."],
    ["After translation", "Cutting (proinsulin → insulin), phosphorylation, ubiquitin tagging for breakdown."],
    ["Same genome, different cells", "Cells differ by which genes they express, not which genes they have."],
    ["X inactivation", "One X per female cell is packed into a Barr body at random; gives patches."],
    ["Oncogene", "Over-active version of a growth gene; one mutant copy is enough."],
    ["Tumour suppressor", "A “brake” gene; usually both copies must fail."]
  ]
};
