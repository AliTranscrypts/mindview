// SBI4U 21 Structure and Replication. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/21-dna-structure-and-replication.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The strands are antiparallel. If the top reads 5′ → 3′ left to right, its partner reads 3′ → 5′ left to right.";
const M2 = "A–T has 2 hydrogen bonds; G–C has 3. A purine always pairs with a pyrimidine.";
const M3 = "%A = %T and %G = %C. Then %A + %G = 50%.";
const M4 = "Polymerase can only add to an existing 3′ end. Primase lays down an RNA primer first.";
const M5 = "Each daughter molecule has one whole old strand and one whole new strand.";
const M6 = "Helicase unwinds and separates; gyrase relieves twisting ahead; ligase seals gaps in the backbone.";
const M7 = "Sulfur is in proteins (not DNA); phosphorus is in DNA’s backbone. Only the ³²P label went into the cells.";
// sequences in the monospace font (course plan §2)
const sq = s => '<span class="dn-sq">' + s + "</span>";

export default {
  id:"21-dna-structure-and-replication",
  kind:"topic",
  title:"DNA structure and replication",
  topic:"Structure and Replication",
  readyTopic:"DNA structure and replication",
  hero:{
    eq:'<span class="dn-heq"><span class="dn-sq">5′-A T G C-3′</span><span class="dn-heqb" aria-hidden="true"><i>⋮</i><i>⋮</i><i>⋮</i><i>⋮</i></span><span class="dn-sq dn-heq2">3′-T A C G-5′</span></span>',
    eqLabel:"Top strand 5′ A T G C 3′, paired with the bottom strand 3′ T A C G 5′",
    eqSize:"sm",
    headline:"Two strands, opposite directions, perfect partners",
    text:"DNA is two strands wound into a <strong>double helix</strong>. The strands run in opposite directions (<strong>antiparallel</strong>), and their bases pair only A with T and G with C. Because each strand fixes its partner’s sequence, a cell can copy DNA by separating the strands and building a new partner for each: <strong>semiconservative replication</strong>.",
    fig:{ html:'<div class="dn-hero" id="dn-hero" role="img" aria-label="A short DNA ladder draws in rung by rung. The top strand reads 5′ A T G C 3′ and the bottom strand 3′ T A C G 5′; dashed hydrogen bonds join each pair, 2 for A–T and 3 for G–C. The ladder twists into a helix. Then it unzips from one end, and a new blue strand grows along each old strand, leaving two helices that are each one old strand and one new strand."></div>' }
  },
  goals:[
    "I can describe the structure of DNA: nucleotides, the sugar–phosphate backbone, antiparallel strands and complementary base pairs.",
    "I can use base-pairing rules and Chargaff’s rules to find complementary sequences and base percentages.",
    "I can explain what “semiconservative” means and how the Meselson–Stahl experiment showed it.",
    "I can name the enzymes at a replication fork and the job each does, in order.",
    "I can predict what happens to replication when one enzyme is missing.",
    "I can explain how key experiments showed that DNA is the genetic material and revealed its structure."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Nucleotides and bonds", goal:1,
          prompt:"A DNA nucleotide is made of…",
          options:[
            { t:"a phosphate, a deoxyribose sugar and a nitrogenous base", ok:true, why:"Three parts." },
            { t:"a phosphate, a ribose sugar and a base", why:"DNA’s sugar is deoxyribose (one fewer O)." },
            { t:"an amino acid, a sugar and a base", why:"Amino acids build proteins." },
            { t:"two bases joined by hydrogen bonds", why:"A nucleotide has one base." }],
          hints:["Think of the “letters” plus the backbone.", "Backbone = sugar + phosphate.", "Phosphate, deoxyribose, base."] },
        { id:"w2", skill:"Nucleotides and bonds", goal:1,
          prompt:"Which bonds hold the two strands of DNA together?",
          options:[
            { t:"Hydrogen bonds between the bases", ok:true, why:"Weak bonds, so the strands can be separated." },
            { t:"Covalent bonds between the sugars", why:"Covalent phosphodiester bonds run <strong>along</strong> each strand." },
            { t:"Ionic bonds between phosphates", why:"Phosphates are on the outside and repel each other." },
            { t:"Peptide bonds", why:"Peptide bonds join amino acids." }],
          hints:["The strands must come apart for copying. Strong or weak bonds?", "Weak bonds between the bases.", "Hydrogen bonds."] },
        { id:"w3", skill:"Base pairing", goal:2,
          prompt:"Which base pairs with guanine in DNA?",
          options:[
            { t:"Cytosine", ok:true, why:"G–C, with 3 hydrogen bonds." },
            { t:"Adenine", why:"Two purines are too wide for the helix." },
            { t:"Thymine", why:"T pairs with A." },
            { t:"Uracil", why:"Uracil is in RNA, and it pairs with A." }],
          hints:["A purine pairs with a pyrimidine.", "G’s partner has one ring.", "C."] },
        { id:"w4", skill:"Base pairing", goal:2,
          prompt:"A strand reads " + sq("5′-AACG-3′") + ". Which strand pairs with it?",
          options:[
            { t:sq("3′-TTGC-5′"), ok:true, why:"Complementary bases, opposite direction." },
            { t:sq("5′-TTGC-3′"), why:"The partner strand runs the other way." },
            { t:sq("3′-AACG-5′"), why:"Pairs are A–T and G–C." },
            { t:sq("3′-UUGC-5′"), why:"DNA uses T." }],
          hints:["Pair each base.", "A–T, A–T, C–G, G–C.", sq("3′-TTGC-5′") + "."] },
        { id:"w5", skill:"Cell division", goal:3,
          prompt:"When must a cell copy its DNA?",
          options:[
            { t:"Before it divides, so each daughter cell gets a full set", ok:true, why:"S phase of interphase." },
            { t:"During mitosis, as chromosomes separate", why:"Copying is finished before mitosis begins." },
            { t:"Only in sex cells", why:"All dividing cells copy their DNA." },
            { t:"After division, in each daughter cell", why:"Each daughter would get only half." }],
          hints:["Each new cell needs a complete set.", "So copying comes first.", "Before division (S phase)."] },
        { id:"w6", skill:"Cell division", goal:6,
          prompt:"Which molecule did most scientists in the 1930s think carried genes, before the experiments in Part 3?",
          options:[
            { t:"Protein", ok:true, why:"Proteins seemed more complex: 20 building blocks instead of 4." },
            { t:"DNA", why:"DNA was thought too simple at the time." },
            { t:"Lipids", why:"Lipids weren’t serious candidates." },
            { t:"Carbohydrates", why:"Sugars store energy." }],
          hints:["Which molecule has more kinds of building blocks?", "20 amino acids vs 4 nucleotides.", "Protein."] }
      ],
      refreshers:{
        "Nucleotides and bonds":"A nucleotide = phosphate + deoxyribose + base. Covalent bonds link nucleotides along a strand; weak hydrogen bonds hold the two strands together.",
        "Base pairing":"A–T and G–C. Write the partner strand in the opposite direction: " + sq("5′-AACG-3′") + " pairs with " + sq("3′-TTGC-5′") + ".",
        "Cell division":"DNA is copied in S phase, before mitosis, so each daughter cell gets a full, identical set."
      }
    }
  },
  explore:{
    heading:"Build it, then copy it",
    intro:"First build a DNA molecule base by base. Then switch to the replication fork, add the enzymes in order, and see what goes wrong if one is missing.",
    given:"ATGCCGTA", freeLen:10,
    buildHow:"Tap a slot, then a base (or press A, T, G or C). Tap an end of the bottom strand to label it 5′ or 3′.",
    // S1 zoom levels (plan: chromosome → helix → base pair → nucleotide). Each hotspot: name, job, connects to.
    zoom:{
      chromo:{ name:"Chromosome", note:"Zoomed out: a copied chromosome before mitosis.", spots:[
        { id:"chromatid", name:"Chromatid", job:"One complete DNA molecule. Replication made two identical copies, the sister chromatids.", to:"Zoom in to see the double helix." },
        { id:"centromere", name:"Centromere", job:"Holds the two copies together until they separate in mitosis.", to:"Each copy goes to one daughter cell." },
        { id:"coil", name:"Coiled DNA", job:"The long DNA molecule is wound around proteins and coiled tightly so it fits in the nucleus.", to:"Unwind it to reach the helix." }] },
      pair:{ name:"Base pair", note:"Zoomed in on the base pair you selected (or the first one).", spots:[
        { id:"purine", name:"Purine (A or G)", job:"A base with two rings.", to:"It always pairs with a pyrimidine, so every rung is the same width." },
        { id:"pyrimidine", name:"Pyrimidine (T or C)", job:"A base with one ring.", to:"It always pairs with a purine." },
        { id:"hbonds", name:"Hydrogen bonds", job:"Weak bonds between the bases: 2 in A–T, 3 in G–C.", to:"Helicase breaks them to separate the strands." },
        { id:"backbone", name:"Sugar–phosphate backbone", job:"Deoxyribose and phosphate joined by covalent phosphodiester bonds, running along each strand.", to:"The two backbones run in opposite directions." }] },
      nt:{ name:"Nucleotide", note:"One nucleotide, with its parts labelled.", spots:[
        { id:"phosphate", name:"Phosphate", job:"Attached to the sugar’s 5′ carbon. It links to the 3′ carbon of the next sugar.", to:"Together with the sugars, it forms the backbone." },
        { id:"sugar", name:"Deoxyribose", job:"A five-carbon sugar, numbered 1′ to 5′. It has one fewer oxygen than ribose.", to:"The base hangs off carbon 1′." },
        { id:"base", name:"Nitrogenous base", job:"A, T, G or C: the “letter” of the code.", to:"It pairs with a base on the other strand." },
        { id:"c5", name:"5′ carbon", job:"Carries the phosphate.", to:"The strand end with a free phosphate is the 5′ end." },
        { id:"c3", name:"3′ carbon", job:"Carries an –OH group.", to:"New nucleotides are added here: polymerase needs a free 3′ –OH." }] }
    },
    model:"Model: a 40-bp segment, copied by the enzyme team of the bacterium <i>Escherichia coli</i>. Other cells use similar teams.",
    // enzymes in the plan's order (palette order); ko = knockout result (plan table)
    enzymes:[
      { id:"hel", t:"Helicase", s:"helicase", job:"Unwinds the helix and separates the strands, breaking the hydrogen bonds between bases.", ko:"Nothing unwinds; no copying." },
      { id:"ssb", t:"Single-strand binding proteins (SSBs)", s:"SSBs", job:"Hold the separated strands apart.", ko:"Strands snap back together behind helicase; no copying." },
      { id:"gyr", t:"Gyrase", s:"gyrase", job:"Relieves the twisting (supercoiling) that builds up ahead of the fork.", ko:"The fork advances 20 bp, then stalls as twisting builds ahead (“supercoiling: high”)." },
      { id:"pri", t:"Primase", s:"primase", job:"Lays down short RNA primers.", ko:"Strands separate, but no new DNA (no 3′ end to start from)." },
      { id:"p3", t:"DNA polymerase III", s:"pol III", job:"Builds new DNA from each primer.", ko:"Primers are laid down, but no DNA is added to them." },
      { id:"p1", t:"DNA polymerase I", s:"pol I", job:"Replaces the RNA primers with DNA.", ko:"New strands are made, but the RNA primers stay in them." },
      { id:"lig", t:"DNA ligase", s:"ligase", job:"Seals the gaps (nicks) in the backbone.", ko:"New strands are made, but one new strand stays in unjoined pieces with nicks." }
    ],
    // what happens when an enzyme is added too early (the order builder); the polymerase III line is the plan's example
    early:{
      ssb:"There are no single strands to hold yet: helicase hasn’t opened the helix.",
      gyr:"No twisting has built up yet: helicase hasn’t started unwinding.",
      pri:"Primase can’t reach the bases until the strands are open and held apart, with the twisting ahead relieved.",
      p3:"Polymerase III has no 3′ end to add to.",
      p1:"There are no RNA primers inside new DNA to replace yet.",
      lig:"There are no gaps between new pieces to seal yet."
    },
    orderDone:"Assembly line complete: helicase, SSBs, gyrase, primase, polymerase III, polymerase I, ligase.",
    predIntro:"Make a prediction first. Then the builder or the fork will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Free build. A double-stranded DNA sample is 30% A. What percent is G?",
        options:[{ t:"20%", ok:true }, { t:"30%" }, { t:"40%" }, { t:"70%" }],
        explain:"A = T = 30% makes 60%. The other 40% splits evenly between G and C." },
      { id:"p2", prompt:"Replication fork, with primase knocked out. What will polymerase III do?",
        options:[{ t:"Nothing: there’s no 3′ end to add to", ok:true }, { t:"Start new strands anywhere" }, { t:"Copy only the top strand" }, { t:"Make RNA instead" }],
        explain:"DNA polymerase can only extend an existing strand. Primase’s RNA primer provides the first 3′ end." },
      { id:"p3", prompt:"Replication fork, with ligase knocked out. What will the new DNA look like?",
        options:[{ t:"Complete in length, but one new strand is in separate pieces", ok:true }, { t:"No new DNA at all" }, { t:"New DNA with RNA left in it" }, { t:"The fork stalls after 20 bp" }],
        explain:"Ligase seals the backbone between pieces. Without it, the pieces stay unjoined. (Module 22 explains why one strand is made in pieces.)" },
      { id:"p4", prompt:"Replication fork, with all enzymes; the fork completes. After one round of replication, each daughter molecule contains…",
        options:[{ t:"one old strand and one new strand", ok:true }, { t:"two new strands (and the other daughter has two old)" }, { t:"strands that are each half old, half new" }, { t:"only new DNA" }],
        explain:"That’s semiconservative replication." }
    ],
    chalIntro:"Use the builder or the fork to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build the partner strand for " + sq("5′-ATGCCGTA-3′") + ", with both ends labelled.",
        why:"The partner reads " + sq("3′-TACGGCAT-5′") + ": every base paired, and the strand runs the opposite way.",
        general:"Choose the 8-base strand, fill every bottom slot, and label both ends of the bottom strand.",
        msgs:{ ends:"The partner runs the opposite way. " + M1, u:"DNA uses T; U is RNA’s base.", copy:"Each base pairs: A–T, G–C.", empty:"Fill every slot of the bottom strand first.", unlabelled:"Label both ends of the bottom strand (tap each end).", mode:"Choose the 8-base strand " + sq("5′-ATGCCGTA-3′") + " in Build mode.", mismatch:"Check the pairs marked ✗. Each base pairs: A–T, G–C." },
        hints:["Pair each base.", "A↔T and G↔C; then think about direction.", sq("3′-TACGGCAT-5′") + "."] },
      { id:"tc2", goal:2, prompt:"In free build, make a <strong>10-bp</strong> double strand with <strong>exactly 25 hydrogen bonds</strong>.",
        why:"5 G–C pairs × 3 + 5 A–T pairs × 2 = 15 + 10 = 25 hydrogen bonds.",
        general:"Choose Free build, then fill all 10 top slots and all 10 bottom slots with complementary pairs.",
        msgs:{ four:"One more G–C pair adds 1 bond.", six:"One too many G–C pairs.", mismatch:"Every pair must be complementary.", mode:"Choose Free build: it has 10 slots.", empty:"Fill all 10 pairs (top and bottom slots) first.", u:"DNA uses T; U is RNA’s base." },
        hints:["A–T = 2, G–C = 3.", "If <i>g</i> pairs are G–C: 3<i>g</i> + 2(10 − <i>g</i>) = 25.", "<i>g</i> = 5."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Fork mode: knock out <strong>exactly two</strong> enzymes so that the fork copies normally for 20 bp, then stops, <strong>and</strong> the copied DNA still contains RNA.",
        why:"Without gyrase, twisting stalls the fork at 20 bp; without polymerase I, the RNA primers stay in the copied DNA.",
        general:"Tick two enzymes in the knockout panel, then run the fork to test your idea.",
        msgs:{ gyrLig:"It stalls at 20 bp, but the defect is nicks, not RNA.", priP1:"Without primase, no DNA is made at all.", ssbP1:"Without SSBs, the strands snap back; nothing is copied.", one:"Each symptom needs its own missing enzyme.", none:"Knock out exactly two enzymes.", many:"Knock out exactly two enzymes, no more." },
        hints:["Which missing enzyme makes the fork stall partway?", "Gyrase: twisting builds up ahead. Which enzyme removes RNA primers?", "Gyrase and DNA polymerase I."] }
    ]
  },
  part3:{
    slug:"history", name:"History", heading:"The experiments that found it",
    intro:"Six experiments, each answering one question. At each station, read the data, then choose what it shows.",
    panel:"Check it with data",
    stations:[
      { id:"s1", n:1, t:"Griffith (1928)", q:"Can something from dead bacteria change living ones?",
        text:"Griffith injected mice with <i>Streptococcus pneumoniae</i>: the S strain (smooth, disease-causing) or the R strain (rough, harmless). Tap each experiment to see what happened.",
        rows:[
          { id:"r1", t:"Live S", res:"Mouse dies", bad:true },
          { id:"r2", t:"Live R", res:"Mouse lives" },
          { id:"r3", t:"Heat-killed S", res:"Mouse lives" },
          { id:"r4", t:"Heat-killed S + live R", res:"Mouse dies, and live S bacteria are recovered", bad:true }],
        ask:"What does experiment 4 show?",
        choices:[
          { t:"Something from the dead S cells <strong>transformed</strong> R cells into S cells.", ok:true, fb:"Live S bacteria were recovered, so the harmless R cells had become S cells: they were transformed." },
          { t:"The heat-killed S cells came back to life.", fb:"Heat-killed S alone didn’t harm the mouse, so the S cells stayed dead." },
          { t:"Live R cells cause disease on their own.", fb:"Live R alone was harmless: that mouse lived." },
          { t:"Heating made the S cells more dangerous.", fb:"Heat-killed S alone didn’t harm the mouse." }] },
      { id:"s2", n:2, t:"Avery, MacLeod and McCarty (1944)", q:"Which molecule is the transforming factor?",
        text:"An extract of heat-killed S cells was treated with an enzyme before it was mixed with live R cells. Tap each enzyme to run it.",
        rows:[
          { id:"r1", t:"Protease (destroys protein)", res:"Transformation still happens" },
          { id:"r2", t:"RNase (destroys RNA)", res:"Transformation still happens" },
          { id:"r3", t:"DNase (destroys DNA)", res:"<strong>No transformation</strong>", bad:true }],
        ask:"What do the results show?",
        choices:[
          { t:"The transforming factor is DNA.", ok:true, fb:"Destroying DNA destroyed the transforming factor." },
          { t:"The transforming factor is protein.", fb:"Transformation still happened after protease." },
          { t:"The transforming factor is RNA.", fb:"Transformation still happened after RNase." },
          { t:"The enzymes themselves cause transformation.", fb:"Only DNase changed the result, and it stopped transformation." }],
        note:"A Canadian connection: Oswald Avery was born in Halifax." },
      { id:"s3", n:3, t:"Hershey and Chase (1952)", q:"Is a virus’s genetic material its DNA or its protein?",
        text:"Two batches of viruses (phages) infected bacteria. One batch had ³⁵S-labelled protein coats; the other had ³²P-labelled DNA. After infection, a blender shook the virus coats off the cells. Choose a batch, then press Infect and blend.",
        ask:"What do the results show?",
        choices:[
          { t:"The virus injects its DNA, so genes are DNA.", ok:true, fb:"The ³²P (DNA) went into the cells; the ³⁵S (protein) stayed outside." },
          { t:"The virus injects its protein, so genes are protein.", fb:M7 },
          { t:"Protein and DNA both enter equally.", fb:"Mostly ³²P went in." },
          { t:"The blender destroyed the DNA.", fb:"The ³²P stayed with the cells; blending only knocked the empty coats off." }],
        zoom:"<strong>Sulfur</strong> is in some amino acids, so it is in protein but not DNA. <strong>Phosphorus</strong> is in DNA’s sugar–phosphate backbone. So ³⁵S labels the virus’s protein coat, and ³²P labels its DNA." },
      { id:"s4", n:4, t:"Chargaff (about 1950)", q:"Is there a pattern in the bases?",
        text:"Base percentages in DNA from four sources. Tap <strong>every</strong> pattern that holds, then press Check.",
        head:["Source", "A", "T", "G", "C"],
        data:[["Human", 30, 30, 20, 20], ["Wheat", 27, 27, 23, 23], ["A bacterium", 25, 25, 25, 25], ["Sea urchin", 32, 32, 18, 18]],
        patterns:[
          { id:"at", t:"A = T in every species", ok:true },
          { id:"gc", t:"G = C in every species", ok:true },
          { id:"ratio", t:"The A : G ratio differs between species", ok:true },
          { id:"ag", t:"A = G in every species", fb:M3 },
          { id:"all25", t:"Every species has 25% of each base", fb:"Only the bacterium does; the human sample is 30% A." }],
        missing:"Look again: more than one pattern holds.",
        good:"A = T and G = C in every species, but the A : G ratio differs between species." },
      { id:"s5", n:5, t:"Franklin, Wilkins, Watson and Crick (1952–53)", q:"What shape is DNA?",
        text:"Rosalind Franklin and Maurice Wilkins shone X-rays through DNA fibres. Tap a piece of evidence, then tap what it tells you.",
        ev:[{ id:"x", t:"An X-shaped diffraction pattern" }, { id:"sp", t:"Regular spacing in the pattern" }, { id:"ch", t:"Chargaff’s ratios" }],
        inf:[{ id:"repeat", t:"a repeating structure" }, { id:"pairs", t:"A pairs with T, G with C" }, { id:"helix", t:"a helix" }],
        answer:{ x:"helix", sp:"repeat", ch:"pairs" },
        wrong:"That isn’t what this evidence tells you. Try another.",
        good:"Watson and Crick’s model combines the evidence: a double helix of two antiparallel strands, with A–T and G–C pairs inside.",
        note:"Franklin’s data was shared without her knowledge. She died in 1958, before the 1962 Nobel Prize was awarded to Watson, Crick and Wilkins.",
        fig:"A drawn schematic of the X-shaped diffraction pattern, not the original photograph." },
      { id:"s6", n:6, t:"Meselson and Stahl (1958)", q:"How is DNA copied?",
        text:"Bacteria grown on heavy nitrogen (¹⁵N) were moved to light nitrogen (¹⁴N). DNA was spun in a density tube after 0, 1 and 2 generations: heavy DNA sinks lower. Choose a generation, then compare each model’s prediction with the data.",
        models:[
          { id:"cons", t:"Conservative", d:"One daughter keeps both old strands; the other is all new." },
          { id:"disp", t:"Dispersive", d:"Every strand is a patchwork of old and new pieces." },
          { id:"semi", t:"Semiconservative", d:"Each daughter has one old strand and one new strand." }],
        ask:"Which model matches the data at every generation?",
        choices:[
          { t:"Semiconservative", ok:true, fb:M5 + " One intermediate band at generation 1, then intermediate + light in equal amounts at generation 2." },
          { t:"Conservative", fb:"Conservative copying would give heavy and light bands, never intermediate." },
          { t:"Dispersive", fb:"Dispersive copying predicts one band between intermediate and light at generation 2." }] }
    ],
    quickCheck:{
      title:"Quick check", summary:"The experiments that found it quick check",
      items:[
        { id:"q1", goal:6, prompt:"In Avery’s experiment, which enzyme stopped transformation?",
          choices:[{ t:"DNase", ok:true, fb:"Destroying DNA destroyed the transforming factor." }, { t:"Protease", fb:"Destroying DNA destroyed the transforming factor." },
            { t:"RNase", fb:"Destroying DNA destroyed the transforming factor." }, { t:"None of them", fb:"Destroying DNA destroyed the transforming factor." }] },
        { id:"q2", goal:6, prompt:"Which label did Hershey and Chase find inside infected bacteria?",
          choices:[{ t:"³²P", ok:true, fb:"Phosphorus is in DNA; the DNA went in." }, { t:"³⁵S", fb:"Phosphorus is in DNA; the DNA went in." },
            { t:"Both equally", fb:"Phosphorus is in DNA; the DNA went in." }, { t:"Neither", fb:"Phosphorus is in DNA; the DNA went in." }] },
        { id:"q3", goal:3, prompt:"Which Meselson–Stahl result ruled out conservative replication?",
          choices:[{ t:"One intermediate band at generation 1", ok:true, fb:"Conservative copying would give heavy and light bands, never intermediate." },
            { t:"A heavy band at generation 0", fb:"Conservative copying would give heavy and light bands, never intermediate." },
            { t:"A light band at generation 2", fb:"Conservative copying would give heavy and light bands, never intermediate." },
            { t:"No bands", fb:"Conservative copying would give heavy and light bands, never intermediate." }] },
        { id:"q4", goal:2, prompt:"Chargaff found 18% C in a sample. What % is A?",
          choices:[{ t:"32%", ok:true, fb:"C = G = 18% makes 36%; A = T = 32%." }, { t:"18%", fb:"C = G = 18% makes 36%; A = T = 32%." },
            { t:"36%", fb:"C = G = 18% makes 36%; A = T = 32%." }, { t:"64%", fb:"C = G = 18% makes 36%; A = T = 32%." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"label", type:"custom", title:"Label the molecule", summary:"Label the molecule", goal:[1, 4], how:"",
        instruction:"Tap a label, then tap the part of a diagram it names. The first diagram is a 3-base-pair ladder; the second is a replication fork.",
        labels:[
          { id:"phos", t:"Phosphate", where:"a circle on the backbone", job:"Links one sugar to the next." },
          { id:"sugar", t:"Deoxyribose", where:"a pentagon on the backbone", job:"The sugar of each nucleotide." },
          { id:"base", t:"Nitrogenous base", where:"one half of a rung", job:"A, T, G or C: the “letter”." },
          { id:"hb", t:"Hydrogen bonds", where:"the dashes between bases", job:"Weak bonds that hold the strands together." },
          { id:"pde", t:"Phosphodiester bond", where:"the link between a sugar and the next phosphate", job:"The strong covalent bond along each strand.",
            hints:["Which bond is strong and covalent?", "It runs along the strand.", "Between a sugar and the next phosphate."] },
          { id:"e5", t:"5′ end", where:"the strand end with a free phosphate", job:"Where the strand starts." },
          { id:"e3", t:"3′ end", where:"the strand end with a free sugar (–OH)", job:"Where new nucleotides are added.",
            hints:["Which end does polymerase add to?", "The end with a free –OH.", "The free sugar end."] },
          { id:"hel", t:"Helicase", where:"at the fork’s point, between the strands", job:"Unwinds and separates the strands." },
          { id:"pri", t:"Primase / RNA primer", where:"a short magenta piece on a template", job:"The first 3′ end for polymerase." },
          { id:"lig", t:"DNA ligase", where:"at a nick between two new pieces", job:"Seals the nick." }
        ],
        pairs:{
          "hb|pde":"Hydrogen bonds join the <strong>bases</strong>; phosphodiester bonds join the <strong>backbone</strong>.",
          "e3|e5":"The 3′ end finishes with the sugar’s –OH, where new nucleotides are added.",
          "hel|lig":"Helicase opens; ligase seals."
        },
        wrongDefault:"Check the name against the job. Try another spot." },
      { id:"puzzles", type:"custom", title:"Base-pairing puzzles", summary:"Base-pairing puzzles", star:true, goal:[2, 3],
        instruction:"Six puzzles. Puzzles 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        items:[
          { id:"b1", kind:"seq", goal:2, prompt:"Write the partner of " + sq("5′-GATTACA-3′") + ", <strong>written 5′ → 3′</strong>.",
            answer:"TGTAATC", display:sq("5′-TGTAATC-3′"),
            why:"Pair each base (" + sq("3′-CTAATGT-5′") + "), then read it from its 5′ end.",
            wrong:[{ match:"CTAATGT", fb:"Those bases are right, but that’s the partner read 3′ → 5′. Reverse it." },
              { match:"GATTACA", fb:"Pairs are A–T and G–C." }],
            general:"Pair each base (A–T, G–C), then write the partner starting from its 5′ end." },
          { id:"b2", kind:"num", goal:2, prompt:"A 200-bp DNA molecule has 60 adenines. How many guanines?",
            answer:140, unit:"guanines", display:"140",
            why:"There are 400 bases in 200 pairs: A = T = 60, so G + C = 400 − 120 = 280, and G = 140.",
            wrong:[{ match:40, fb:"There are 400 bases in 200 pairs: G + C = 400 − 120 = 280." }],
            general:"There are 400 bases in 200 pairs. Use A = T and G = C." },
          { id:"b3", kind:"num", goal:2, star:true, prompt:"How many hydrogen bonds hold that 200-bp molecule together?",
            answer:540, unit:"hydrogen bonds", display:"540",
            why:"60 A–T pairs × 2 = 120; 140 G–C pairs × 3 = 420; 120 + 420 = 540.",
            wrong:[{ match:500, fb:"60 A–T pairs × 2 = 120; 140 G–C pairs × 3 = 420." }],
            general:"Count the A–T pairs and the G–C pairs first." },
          { id:"b4", kind:"num", goal:2, star:true, prompt:"<strong>One</strong> strand of a DNA molecule is 20% A, 30% T, 25% G, 25% C. What % of the <strong>double-stranded</strong> molecule is A?",
            answer:25, unit:"%", display:"25%",
            why:"The other strand’s A pairs with this strand’s T (30%): (20 + 30) ÷ 2 = 25%.",
            wrong:[{ match:20, fb:"The other strand’s A pairs with this strand’s T (30%): (20 + 30) ÷ 2." }],
            general:"Find the other strand’s A first, then average over both strands.",
            hints:["Each strand’s A pairs with the other strand’s T.", "The other strand is 30% A.", "Average over both strands: 25%."] },
          { id:"b5", kind:"num", goal:3, star:true, prompt:"Meselson–Stahl, generation 3: what fraction of the DNA molecules are hybrid (intermediate)?",
            answer:0.25, unit:"", display:"1/4",
            why:"After 3 generations there are 8 molecules; only the 2 holding an original strand are hybrid: 2/8 = 1/4.",
            wrong:[{ match:0.5, fb:"After 3 generations there are 8 molecules; only the 2 holding an original strand are hybrid." }],
            general:"Count the molecules after each generation, then find the ones that still hold an original strand.",
            hints:["Count molecules each generation: 1, 2, 4, 8.", "The two original heavy strands are always in 2 molecules.", "2/8 = 1/4."] },
          { id:"b6", kind:"num", goal:2, star:true, prompt:"A 20-bp segment has 14 G–C pairs. Another 20-bp segment has 54 hydrogen bonds. How many G–C pairs does the second have?",
            answer:14, unit:"G–C pairs", display:"14",
            why:"3<i>g</i> + 2(20 − <i>g</i>) = 54 gives <i>g</i> = 14: the same segment type.",
            wrong:[],
            general:"Let <i>g</i> be the number of G–C pairs: 3<i>g</i> + 2(20 − <i>g</i>) = 54." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Lior", how:"",
        instruction:"Lior made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write the partner strand of " + sq("5′-AGCTTC-3′") + ".",
            steps:["The given strand is " + sq("5′-AGCTTC-3′") + ".", "Pair each base: A–T, G–C, C–G, T–A.", "The partner bases, left to right: " + sq("TCGAAG") + ".", "So the partner is " + sq("5′-TCGAAG-3′") + "."],
            answer:3,
            stepFb:["Step 1 just restates it.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The partner is " + sq("3′-TCGAAG-5′") + ", which is " + sq("5′-GAAGCT-3′") + " written the usual way.", ok:true, why:M1 },
              { t:"The partner is " + sq("5′-AGCTTC-3′") + ".", why:"That copies the strand instead of pairing it." },
              { t:"The partner is " + sq("3′-UCGAAG-5′") + ".", why:"DNA uses T." },
              { t:"Step 4 is correct.", why:"The strands are antiparallel." }],
            hints:["Which way does the partner run?", "Opposite: its left end is 3′.", sq("3′-TCGAAG-5′") + " = " + sq("5′-GAAGCT-3′") + "."] },
          { id:"e2", goal:2, task:"A DNA sample is 35% G. Find the % of A.",
            steps:["G pairs with C, so C = 35%.", "G + C = 70%.", "So A + T = 30%.", "So A = 30%."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"A = T, so A = 30% ÷ 2 = 15%.", ok:true, why:M3 },
              { t:"A = 35%, the same as G.", why:M3 },
              { t:"A = 65%.", why:"That’s 100 − 35." },
              { t:"Step 4 is correct.", why:"A and T share the 30%." }],
            hints:["A and T are equal.", "Together they’re 30%.", "15% each."] },
          { id:"e3", goal:4, task:"Describe the start of DNA replication at a fork.",
            steps:["Helicase unwinds the helix, breaking the hydrogen bonds between bases.", "Single-strand binding proteins keep the strands apart.", "DNA polymerase III starts each new strand directly on the template.", "DNA ligase joins the new pieces together."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is true; the mistake is earlier."],
            fixes:[
              { t:"Primase first lays down a short RNA primer; DNA polymerase III adds nucleotides to the primer’s 3′ end.", ok:true, why:M4 },
              { t:"Ligase starts each new strand.", why:M6 },
              { t:"Helicase builds each new strand.", why:M6 },
              { t:"Step 3 is correct.", why:"Polymerase can’t start from nothing." }],
            hints:["What does DNA polymerase need before it can add a nucleotide?", "An existing 3′ end.", "An RNA primer from primase."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how the knockouts each left a different “fingerprint”, or how the Meselson–Stahl bands ruled out two models?" },
      { id:"j2", q:"In your own words, why does base pairing make semiconservative copying possible?" },
      { id:"j3", q:"Explain to a friend how to write the partner of a DNA strand without getting the direction wrong." },
      { id:"j4", q:"Which enzyme’s job do you still mix up? What will you do to fix it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement about base pairing in DNA is correct?", options:[
          { t:"A pairs with T by 2 hydrogen bonds; G pairs with C by 3", ok:true, why:M2 },
          { t:"A pairs with T by 3 hydrogen bonds; G pairs with C by 2", why:M2 },
          { t:"A pairs with G, and C pairs with T", why:"Each pair is a purine with a pyrimidine: A–T, G–C." },
          { t:"A pairs with U by 2 hydrogen bonds", why:"U is RNA’s base." }] },
        b:{ prompt:"Which describes DNA’s backbone?", options:[
          { t:"Alternating deoxyribose and phosphate joined by covalent phosphodiester bonds", ok:true, why:"Each strand is a sugar–phosphate backbone: deoxyribose joined to phosphate by phosphodiester bonds." },
          { t:"Alternating bases and sugars joined by hydrogen bonds", why:"Hydrogen bonds join bases across the strands." },
          { t:"A chain of amino acids joined by peptide bonds", why:"That’s a protein." },
          { t:"Alternating ribose and phosphate", why:"Ribose is RNA’s sugar." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which enzyme relieves the twisting that builds up ahead of the replication fork?", options:[
          { t:"Gyrase", ok:true, why:M6 },
          { t:"Helicase", why:"Helicase unwinds and separates; the twisting builds up ahead of it." },
          { t:"Ligase", why:M6 },
          { t:"Primase", why:"Primase lays down RNA primers." }] },
        b:{ prompt:"Which enzyme removes RNA primers and fills the gaps with DNA?", options:[
          { t:"DNA polymerase I", ok:true, why:"Polymerase I replaces primers with DNA." },
          { t:"DNA polymerase III", why:"Polymerase III builds most of the new DNA, starting from the primers." },
          { t:"DNA ligase", why:"Ligase seals the last nick but doesn’t remove RNA." },
          { t:"Primase", why:"Primase makes the primers." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"In the Hershey–Chase experiment, which radioactive label was found inside the bacteria, and what did that show?", options:[
          { t:"³²P, which labels DNA, so DNA is the genetic material", ok:true, why:M7 },
          { t:"³⁵S, which labels DNA, so DNA is the genetic material", why:"Sulfur labels protein." },
          { t:"³⁵S, which labels protein, so protein is the genetic material", why:M7 },
          { t:"Both labels equally, so both carry genes", why:"Mostly ³²P went in." }] },
        b:{ prompt:"In Avery, MacLeod and McCarty’s experiment, which treatment of the heat-killed extract <strong>stopped</strong> transformation, and what did that show?", options:[
          { t:"DNase, so DNA is the transforming factor", ok:true, why:"Destroying DNA destroyed the transforming factor." },
          { t:"Protease, so protein is the transforming factor", why:"Transformation still happened after protease." },
          { t:"RNase, so RNA is the transforming factor", why:"Transformation still happened after RNase." },
          { t:"Heat, so the factor must be alive", why:"Griffith’s bacteria were already heat-killed, and transformation still happened." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A double-stranded DNA sample is 22% T. What percent is G?", options:[
          { t:"28%", ok:true, why:"A = T = 22% → 44%; G = C = 56% ÷ 2." },
          { t:"22%", why:"That sets G = T." },
          { t:"56%", why:"That’s G + C together." },
          { t:"78%", why:"That’s 100 − 22." }] },
        b:{ prompt:"A double-stranded DNA sample is 18% C. What percent is A?", options:[
          { t:"32%", ok:true, why:"G = C = 18% → 36%; A = T = 64% ÷ 2." },
          { t:"18%", why:M3 },
          { t:"64%", why:"That’s A + T together." },
          { t:"82%", why:M3 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A bacterial strain has a temperature-sensitive ligase that stops working at 42 °C. Its DNA is copied at 42 °C. What will the new DNA look like?", options:[
          { t:"Full-length new strands, but one of them in many unjoined pieces", ok:true, why:"Ligase seals the nicks between pieces." },
          { t:"No new DNA at all", why:"Ligase isn’t needed to make DNA, only to join pieces." },
          { t:"New strands containing RNA pieces", why:"That’s a missing polymerase I." },
          { t:"Copying stops after a short distance", why:"That’s a missing gyrase." }] },
        b:{ prompt:"A strain makes working primase and polymerase III but no working DNA polymerase I. What will its new DNA contain?", options:[
          { t:"Short stretches of RNA where the primers were", ok:true, why:"Polymerase I replaces primers with DNA." },
          { t:"Nothing; no new strands are made", why:"Primase and polymerase III still make new strands." },
          { t:"Unjoined pieces but no RNA", why:"Ligase can’t join DNA to a primer that hasn’t been replaced, and the RNA stays." },
          { t:"Only one new strand per molecule", why:"Both strands are still copied." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Meselson and Stahl moved bacteria from ¹⁵N to ¹⁴N. If replication were <strong>conservative</strong>, what would the DNA show after <strong>one</strong> generation?", options:[
          { t:"Two bands: one heavy, one light", ok:true, why:"One molecule all old (heavy), one all new (light)." },
          { t:"One intermediate band", why:"That’s what semiconservative (or dispersive) copying predicts." },
          { t:"One light band only", why:"The original heavy strands are still there." },
          { t:"Heavy and intermediate bands", why:"No intermediate molecules form in conservative copying." }] },
        b:{ prompt:"If replication were <strong>dispersive</strong> (every strand a patchwork of old and new), what would the DNA show after <strong>two</strong> generations?", options:[
          { t:"One band, between intermediate and light", ok:true, why:"Every molecule is about one-quarter heavy." },
          { t:"Intermediate and light bands", why:"That’s the semiconservative result." },
          { t:"Heavy and light bands", why:"That’s conservative." },
          { t:"One intermediate band", why:"After two generations, the heavy fraction is diluted to about 1/4." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of what “antiparallel” means for DNA?", options:[
          { t:"“The two strands run in opposite directions: where one has its 5′ end, the other has its 3′ end.”", ok:true, why:"That’s antiparallel: " + sq("5′-ATG-3′") + " pairs with " + sq("3′-TAC-5′") + "." },
          { t:"“The two strands are not parallel; they cross each other.”", why:"They are parallel, just pointing opposite ways." },
          { t:"“Each strand has the same sequence as the other.”", why:"Each is complementary, not identical." },
          { t:"“Both strands run 5′ → 3′ from left to right.”", why:M1 }] },
        b:{ prompt:"Which correctly shows a DNA strand with its partner?", options:[
          { t:sq("5′-CAGT-3′") + " over " + sq("3′-GTCA-5′"), ok:true, why:"Complementary bases, opposite direction." },
          { t:sq("5′-CAGT-3′") + " over " + sq("5′-GTCA-3′"), why:M1 },
          { t:sq("5′-CAGT-3′") + " over " + sq("3′-CAGT-5′"), why:"That copies the bases instead of pairing them." },
          { t:sq("5′-CAGT-3′") + " over " + sq("3′-GUCA-5′"), why:"DNA uses T." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of “semiconservative replication”?", options:[
          { t:"“Each new DNA molecule is made of one original strand and one newly built strand.”", ok:true, why:M5 },
          { t:"“Half of the DNA molecules are copied, and half are kept as they were.”", why:"Every molecule is copied." },
          { t:"“Each strand is half old pieces and half new pieces.”", why:"That’s the dispersive model." },
          { t:"“One daughter molecule is entirely old, and the other entirely new.”", why:"That’s the conservative model." }] },
        b:{ prompt:"Which observation is the strongest evidence for semiconservative replication?", options:[
          { t:"“After one generation in ¹⁴N, all the DNA formed a single intermediate band, and after two generations, intermediate and light bands appeared in equal amounts.”", ok:true, why:"The intermediate band rules out conservative copying, and the light band at generation 2 rules out dispersive copying." },
          { t:"“DNA has 2 hydrogen bonds in A–T pairs.”", why:"That’s about structure, not copying." },
          { t:"“After one generation, the DNA formed a single intermediate band.”", why:"That alone doesn’t rule out the dispersive model." },
          { t:"“Heavy DNA was found at generation 0.”", why:"That’s the starting point." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"Two 100-bp DNA samples are heated slowly in a lab. Sample X is 30% G–C pairs; sample Y is 60% G–C pairs. Which separates into single strands first, and why?", options:[
          { t:"X, because it has fewer G–C pairs and so fewer hydrogen bonds to break", ok:true, why:"X has 230 hydrogen bonds; Y has 260." },
          { t:"Y, because it has more G–C pairs, which are weaker", why:"G–C has 3 bonds: stronger." },
          { t:"Both at the same time, because they’re the same length", why:"Length isn’t the only factor; pair type matters." },
          { t:"X, because A–T pairs are joined by covalent bonds", why:"Base pairs are held by hydrogen bonds." }] },
        b:{ prompt:"Two 50-bp segments: P has 20 A–T pairs; Q has 35 A–T pairs. Which needs more heat to separate?", options:[
          { t:"P, because it has 30 G–C pairs (3 bonds each) vs Q’s 15", ok:true, why:"P: 40 + 90 = 130 bonds; Q: 70 + 45 = 115." },
          { t:"Q, because it has more A–T pairs", why:M2 },
          { t:"Neither; both have 50 pairs", why:"Pair type matters." },
          { t:"Q, because A–T pairs have 3 bonds", why:M2 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Some antiviral drugs are nucleotides whose sugar has no 3′ –OH group. Once polymerase adds one to a growing viral DNA strand, what happens?", options:[
          { t:"The strand can’t grow any further, because the next nucleotide has no 3′ –OH to bond to", ok:true, why:"Polymerase can only add to an existing 3′ end." },
          { t:"The strand grows faster", why:"There’s nowhere to attach the next nucleotide." },
          { t:"Ligase repairs it and copying continues normally", why:"Ligase seals nicks; it can’t add a missing –OH." },
          { t:"The drug pairs with nothing, so it’s skipped", why:"It pairs normally; the problem is the missing 3′ end." }] },
        b:{ prompt:"A DNA-sequencing method adds a few nucleotides that lack a 3′ –OH to a copying reaction. Why does this give a mixture of strands of different lengths?", options:[
          { t:"Each time one of these nucleotides is added, that strand stops growing, at a different position each time", ok:true, why:"Without a 3′ –OH, nothing more can be added, so each strand ends where one was added." },
          { t:"These nucleotides cut the template at random", why:"They don’t cut; they end the new strand." },
          { t:"They make the polymerase skip bases", why:"Without a 3′ –OH, nothing more can be added." },
          { t:"They pair with the wrong bases", why:"They pair normally." }] } }
    ]
  },
  task:{
    title:"Cut here", summary:"Cut here",
    statement:"<p>Design a 6-base-pair DNA segment that meets every condition. (Each answer turns out to be a real “cut here” site used in module 33.) Can you find all the answers?</p><ol class=\"dn-conds\"><li>It is held together by exactly 16 hydrogen bonds.</li><li>It’s a palindrome: the top strand read 5′ → 3′ is the same as the bottom strand read 5′ → 3′.</li><li>The top strand starts 5′-G.</li><li>The middle two base pairs (positions 3 and 4) are A–T or T–A pairs.</li></ol>",
    checks:["Exactly 16 hydrogen bonds", "Palindrome", "Starts with G", "Middle pairs are A–T"],
    tips:["6 pairs with 16 bonds: how many must be G–C?",
      "In a palindrome, position 6 pairs with position 1, 5 with 2, and 4 with 3.",
      "The first base is fixed as G, so the last is C.",
      "Positions 3 and 4 must pair with each other: AT or TA."],
    explainPrompt:"Explain how you used base pairing and the 16-bond rule to narrow the choices.",
    vocab:"Use the words complementary, antiparallel, hydrogen bond and palindrome.",
    success:"Your segment meets every condition!",
    more:"Can you find all the answers?",
    afterAt:4,
    after3:"Line 1 forces exactly 4 G–C pairs, and in a palindrome pairs come in mirror pairs. With G at position 1 and A/T in the middle, only positions 2 and 5 are left to choose, giving 4 answers."
  },
  cards:[
    ["Nucleotide", "Phosphate + deoxyribose + a base (A, T, G or C)."],
    ["Base pairs", "A–T (2 hydrogen bonds); G–C (3). Purine with pyrimidine."],
    ["Antiparallel", "The strands run opposite ways: " + sq("5′-ATG-3′") + " pairs with " + sq("3′-TAC-5′") + "."],
    ["Chargaff’s rules", "%A = %T and %G = %C, so %A + %G = 50%."],
    ["Semiconservative", "Each new molecule = 1 old strand + 1 new strand."],
    ["Helicase / SSBs", "Unwinds and separates the strands / keeps them apart."],
    ["Gyrase", "Relieves twisting (supercoiling) ahead of the fork."],
    ["Primase", "Lays down a short RNA primer, the first 3′ end."],
    ["DNA polymerase III / I", "III builds new DNA from primers; I replaces RNA primers with DNA."],
    ["DNA ligase", "Seals nicks in the backbone between new pieces."],
    ["Hershey–Chase", "³²P (DNA) entered cells; ³⁵S (protein) didn’t: genes are DNA."],
    ["Meselson–Stahl", "¹⁵N → ¹⁴N: one intermediate band, then intermediate + light: semiconservative."]
  ]
};
