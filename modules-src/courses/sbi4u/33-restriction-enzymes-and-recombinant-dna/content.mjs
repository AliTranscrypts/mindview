// SBI4U 33 Restriction Enzymes and Recombinant DNA. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/33-restriction-enzymes-and-recombinant-dna.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "An enzyme recognizes one exact short sequence. GAATTG isn’t GAATTC, so EcoRI ignores it.";
const M2 = "In DNA, a palindrome reads the same 5′ → 3′ on <strong>both strands</strong>. GATTAG’s partner strand reads CTAATC.";
const M3 = "Overhangs join only if their bases are complementary. EcoRI’s AATT can’t pair with BamHI’s GATC.";
const M4 = "The overhangs pair on their own by hydrogen bonds; ligase makes the covalent backbone bonds that lock the pieces together.";
const M5 = "A circle cut <i>n</i> times gives <i>n</i> pieces. Only a line gives <i>n</i> + 1.";
const M6 = "On the selection plate every colony has a plasmid. White means the insert broke <i>lacZ</i>; blue means the plasmid closed with no insert.";
const M7 = "Human genes contain introns, and bacteria can’t remove them. The gene is copied from mRNA (cDNA), which has no introns.";
// sequences in the monospace font
const sq = s => '<span class="rz-sq">' + s + "</span>";
const lz = "<i>lacZ</i>";

export default {
  id:"33-restriction-enzymes-and-recombinant-dna",
  kind:"topic",
  title:"Restriction enzymes and recombinant DNA",
  topic:"Restriction Enzymes and Recombinant DNA",
  readyTopic:"restriction enzymes and recombinant DNA",
  hero:{
    eq:'<span class="rz-heq"><span class="rz-sq">5′-G↓AATTC-3′</span><span class="rz-sq">3′-CTTAA↑G-5′</span><span class="rz-heqn">→ two sticky ends, each with a 5′-AATT overhang</span></span>',
    eqLabel:"The EcoRI site: top strand 5′ G, cut, A A T T C 3′; bottom strand 3′ C T T A A, cut, G 5′. The cut leaves two sticky ends, each with a 5′ AATT overhang.",
    eqSize:"sm",
    headline:"Cut here, paste there",
    text:"Bacteria make <strong>restriction enzymes</strong> that cut DNA at one exact, short sequence. Cut a <strong>plasmid</strong> and a <strong>gene</strong> with the same enzyme and their <strong>sticky ends</strong> match. <strong>DNA ligase</strong> seals them into <strong>recombinant DNA</strong>, and bacteria then copy it, and make its protein, every time they divide.",
    fig:{ html:'<div class="rz-hero" id="rz-hero" role="img" aria-label="A 12-base-pair double strand slides in and the six bases GAATTC light up on both strands. A zigzag cut runs between G and A on each strand, and the halves pull apart to show AATT overhangs. A plasmid ring opened at the same site appears, and a blue gene fragment with matching ends drifts into the gap. The overhangs pair with dotted hydrogen bonds, a ligase tag passes over and the backbone gaps turn solid. The ring closes, labelled recombinant plasmid."></div>' }
  },
  goals:[
    "I can explain what a restriction enzyme does, what makes its recognition site palindromic, and how it leaves sticky or blunt ends.",
    "I can find recognition sites in a sequence and predict the number of fragments and the type of ends a cut makes.",
    "I can explain why the plasmid and the gene are cut with the same enzyme(s), and how ligase joins them into recombinant DNA.",
    "I can describe how recombinant plasmids get into bacteria, and how selection and blue–white screening identify the cells I want.",
    "I can predict fragment sizes for single and double digests of circular and linear DNA, and read a restriction map from gel bands.",
    "I can describe uses of recombinant DNA, such as insulin and GFP, and evaluate one of its benefits or limits."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Complementary strands", goal:2,
          prompt:"A top strand reads " + sq("5′-ATGCCT-3′") + ". Write the bottom strand 5′ → 3′.",
          options:[
            { t:sq("5′-AGGCAT-3′"), ok:true, why:"Complement each base, then read the partner strand from its own 5′ end." },
            { t:sq("5′-TACGGA-3′"), why:"TACGGA is the bottom strand read 3′ → 5′." },
            { t:sq("5′-TCCGTA-3′"), why:"Each base must pair: A with T, G with C." },
            { t:sq("5′-UACGGA-3′"), why:"DNA uses T, not U." }],
          hints:["The strands are antiparallel.", "The complement, read 3′ → 5′, is TACGGA.", "Read it backwards from its 5′ end: AGGCAT."] },
        { id:"w2", skill:"Complementary strands", goal:1,
          prompt:"Which base pair is held by three hydrogen bonds?",
          options:[
            { t:"G–C", ok:true, why:"G–C has three; A–T has two." },
            { t:"A–T", why:"A–T has two hydrogen bonds." },
            { t:"A–U", why:"U is found in RNA, not in a DNA double strand." },
            { t:"G–A", why:"G pairs with C, not with A." }],
          hints:["Which pair is harder to separate?", "G–C regions need more heat to separate.", "G–C: three."] },
        { id:"w3", skill:"Biotech tools", goal:3,
          prompt:"What does DNA ligase do?",
          options:[
            { t:"Joins DNA pieces by sealing the sugar–phosphate backbone", ok:true, why:"It makes covalent bonds between neighbouring nucleotides." },
            { t:"Cuts DNA at a specific sequence", why:"Cutting is the restriction enzyme’s job." },
            { t:"Makes copies of a DNA sequence", why:"Copying is done by DNA polymerase." },
            { t:"Separates fragments by size", why:"That’s what a gel does." }],
          hints:["“Liga-” as in ligament: it ties things.", "It works after cutting.", "It seals the backbone."] },
        { id:"w4", skill:"Biotech tools", goal:4,
          prompt:"What is a plasmid?",
          options:[
            { t:"A small, circular piece of DNA in a bacterium, separate from its main chromosome, that is copied on its own", ok:true, why:"Small, circular, and copied on its own." },
            { t:"The bacterium’s main, circular chromosome", why:"Plasmids are extra, smaller rings." },
            { t:"A linear chromosome found in human cells", why:"Plasmids are rings found mainly in bacteria." },
            { t:"A ring of RNA that carries amino acids", why:"Plasmids are DNA." }],
          hints:["Think “extra DNA ring”.", "It is separate from the chromosome.", "Small, circular, copied on its own."] },
        { id:"w5", skill:"Gel electrophoresis", goal:5,
          prompt:"Fragments of 300, 1200, 2500 and 4000 bp are run on a gel. Which travels farthest from the wells?",
          options:[
            { t:"300 bp", ok:true, why:"Small pieces slip through the gel fastest." },
            { t:"4000 bp", why:"Big pieces move slowest." },
            { t:"They all travel the same distance", why:"All DNA has the same charge per base pair, so size decides the distance." },
            { t:"It depends on how many A and G bases each has", why:"Size, not base sequence, sets the distance." }],
          hints:["The gel is a mesh.", "Which piece gets through a mesh fastest?", "The smallest: 300 bp."] },
        { id:"w6", skill:"The <i>lac</i> operon", goal:4,
          prompt:"In <i>E. coli</i>, what does " + lz + " code for?",
          options:[
            { t:"β-galactosidase, the enzyme that breaks down lactose", ok:true, why:lz + " is the first of the three structural genes." },
            { t:"The <i>lac</i> repressor", why:"That’s <i>lacI</i>." },
            { t:"The permease that brings lactose into the cell", why:"That’s <i>lacY</i>." },
            { t:"The operator", why:"The operator is a stretch of DNA, not a protein." }],
          hints:["Z, Y, A are the three structural genes.", lz + " comes first.", "β-galactosidase."] }
      ],
      refreshers:{
        "Complementary strands":"A pairs with T, G with C, and the strands run in opposite directions. To write the partner strand 5′ → 3′, complement every base, then reverse the order.",
        "Biotech tools":"A restriction enzyme cuts, ligase joins, polymerase copies, a gel sorts by size, and a plasmid is a small DNA ring that bacteria copy on their own.",
        "Gel electrophoresis":"DNA is negative, so it moves toward the positive end; smaller fragments move farther.",
        "The <i>lac</i> operon":lz + " codes for β-galactosidase. If something is inserted into the middle of " + lz + ", the enzyme isn’t made."
      }
    }
  },
  explore:{
    heading:"Cut-and-paste lab",
    intro:"Scan DNA for recognition sites and cut it. Then build a recombinant plasmid and see what grows.",
    seq:"ATGAATTCGCGGATCCTTCCCGGGATGAATTGCAAGAATTCTGA",
    near:"GAATTG",
    model:"This is a model. Real plates show a few unexpected colonies.",
    safety:"All sequences, plasmids and maps here are made up for teaching.",
    markerJob:"lets only cells carrying the plasmid grow on the selection plate",
    // plate outcomes (plan table): readout "why" lines
    why:{
      bw:"White: insulin sequence inside " + lz + ". Blue: plasmid closed on itself.",
      ligOff:"Nothing sealed the backbone, so the plasmid stayed open.",
      noMatch:"The donor’s ends don’t match the plasmid’s {p} ends; the plasmid closed on itself.",
      bam:"White colonies carry pieces of DNA, but BamHI cut the insulin sequence in two: the gene isn’t complete.",
      hind:"White colonies carry pieces of DNA, but HindIII cuts the donor only at 1600, on one side of the gene: no piece holds the whole gene between two HindIII ends.",
      pst:"PstI also cuts inside the marker gene, so cells can’t grow on the selection plate.",
      blunt:"Blunt plasmid ends can’t pair with sticky donor ends; the plasmid rejoined itself.",
      noDonor:"SmaI has no site in the donor DNA, so no donor piece is freed; the plasmid closed on itself.",
      uncut:"An uncut plasmid has nowhere for the gene to go."
    },
    aha:"A match between ends decides everything. Both the plasmid and the gene must be cut by the same enzyme(s), in the right places, and the selection plate and the " + lz + " colour reveal which cells got what.",
    predIntro:"Make a prediction first. Then the lab will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Mode A, EcoRI selected. EcoRI cuts G↓AATTC on both strands. What will the cut ends look like?",
        options:[{ t:"Single-stranded overhangs of AATT", ok:true }, { t:"Blunt ends" }, { t:"Overhangs of GAATTC" }, { t:"Overhangs of a single base" }],
        explain:"The cut is between G and A on each strand, which is staggered by 4 bases, so each end keeps a 4-base single strand. The site reads GAATTC 5′ → 3′ on both strands." },
      { id:"p2", prompt:"A ring plasmid with 3 EcoRI sites. How many pieces does EcoRI make?",
        options:[{ t:"3", ok:true }, { t:"4" }, { t:"2" }, { t:"6" }],
        explain:"A circle cut 3 times gives 3 pieces. A line cut 3 times would give 4." },
      { id:"p3", prompt:"Mode B: plasmid with EcoRI, donor with HindIII, ligase on. What grows on the plate?",
        options:[{ t:"Only blue colonies", ok:true }, { t:"Only white colonies" }, { t:"Blue and white colonies" }, { t:"No colonies" }],
        explain:"AATT ends can’t pair with AGCT ends, so the insulin piece can’t join, and the plasmid closes on itself with " + lz + " intact." },
      { id:"p4", prompt:"Mode B: the working recipe (EcoRI on both, ligase on). What colour will colonies carrying the insulin insert be?",
        options:[{ t:"White", ok:true }, { t:"Blue" }, { t:"Green" }, { t:"They won’t grow" }],
        explain:"The insert interrupts " + lz + ", so no β-galactosidase is made and X-gal stays colourless." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"Mode A: cut sequence S into exactly 3 pieces using one enzyme.",
        why:"EcoRI has 2 sites in S, and a line cut twice gives 3 pieces.",
        general:"A line cut <i>n</i> times gives <i>n</i> + 1 pieces.",
        msgs:{ cut:"In Mode A, choose one enzyme and press Cut.", one:"One site cuts a line into 2 pieces.", none:"No site in S, so nothing is cut.", near:"GAATTG isn’t GAATTC. " + M1 },
        hints:["A line cut <i>n</i> times gives <i>n</i> + 1 pieces.", "You need an enzyme with exactly 2 sites.", "EcoRI has 2 sites in S."] },
      { id:"tc2", goal:3, prompt:"Mode B: get white colonies that carry the <strong>complete</strong> insulin coding sequence.",
        why:"EcoRI cuts the plasmid once inside " + lz + " and the donor at 700 and 1250, on both sides of the gene. The AATT ends match, and ligase seals them.",
        general:"Which enzyme frees the whole gene with ends that match the plasmid’s?",
        msgs:{ bam:"White colonies, but BamHI cut the gene in two.", ends:"The ends don’t match. " + M3, lig:"Nothing sealed the backbone.", pst:"It also cuts the marker gene." },
        hints:["Which enzyme cuts on <strong>both</strong> sides of the insulin sequence without cutting inside it?", "EcoRI cuts the donor at 700 and 1250; the gene runs from 800 to 1130.", "EcoRI on both, ligase on."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Mode C: in the model, an EcoRI insert can go in either way round. A white colony’s plasmid, cut with BamHI, gives bands at <strong>320 bp</strong> and <strong>5230 bp</strong>. Set the orientation toggle so the model’s gel matches.",
        why:"The recombinant plasmid is 5000 + 550 = 5550 bp. The plasmid’s own BamHI site sits 20 bp past the right-hand EcoRI junction. The insert’s BamHI site is 300 bp from its left end and 250 bp from its right end. <strong>Forward:</strong> the insert’s site is 250 + 20 = 270 bp from the plasmid’s site, giving 270 + 5280. <strong>Reversed:</strong> it is 300 + 20 = 320 bp away, giving 320 + 5230.",
        general:"Compare the model’s BamHI bands with 320 and 5230.",
        msgs:{ fwd:"Forward gives 270 and 5280.", eco:"EcoRI cuts out the whole 550 bp insert either way round, so it can’t show orientation.", mode:"Open Mode C (plate a run that gives white colonies first), then set the orientation toggle.", other:"The bands come from a BamHI digest: choose BamHI for the gel." },
        hints:["The two BamHI sites, one in the insert and one in the plasmid, give two fragments. The short one is the distance between them.", "Measure from the insert’s BamHI site to the right-hand junction, then add 20.", "320 = 300 + 20, so the 300 bp side faces the plasmid’s BamHI site: reversed."] }
    ]
  },
  part3:{
    slug:"maps", name:"Maps", heading:"Restriction maps",
    intro:"Restriction maps are how scientists check what they built. At each station, go from a map to a gel and back. The <strong>Check it with data</strong> panel runs each digest on a mini-gel.",
    panel:"Check it with data",
    s1:{ t:"Rings vs lines", text:"The same sites drawn on a 6000 bp ring and on a 6000 bp line. Move the slider to change the number of sites; both molecules are cut at every site.",
      sites:[800, 2000, 3500, 5000] },
    s2:{ t:"Single and double digests", text:"Plasmid pMAP (made up, ring, 6000 bp) has EcoRI sites at 1000 and 3500 and a BamHI site at 2000. Choose a digest. Tap a fragment’s arc on the ring, then tap the band it makes.",
      rule:"Every digest’s fragments add up to 6000." },
    s3:{ t:"Work backwards", text:"A 5000 bp plasmid gives one 5000 bp band with EcoRI alone, one 5000 bp band with HindIII alone, and bands at 1200 and 3800 with both. The EcoRI site is at 0 (the top). Place the HindIII site on the ring, then press Check.",
      good:"Gels give distances, not directions. A third enzyme would settle it.", more:"Both placements work. Can you find the other one?" },
    blocks:[{ title:"A Canadian connection", html:"<p>Michael Smith, at the University of British Columbia, found a way to change a DNA sequence at one chosen spot (site-directed mutagenesis). His work on changing DNA sequences earned a share of the 1993 Nobel Prize in Chemistry.</p>" }],
    quickCheck:{
      title:"Quick check", summary:"Restriction maps quick check",
      items:[
        { id:"q1", goal:5, prompt:"A 4000 bp <strong>ring</strong> is cut at 500 and 1500. Fragments?",
          choices:[{ t:"1000 and 3000", ok:true, fb:"Right. A ring cut twice gives two pieces: 1500 − 500 = 1000, and 4000 − 1000 = 3000." },
            { t:"500, 1000 and 2500", fb:"A ring cut twice gives two pieces: 1500 − 500 = 1000, and 4000 − 1000 = 3000. " + M5 },
            { t:"500 and 1500", fb:"A ring cut twice gives two pieces: 1500 − 500 = 1000, and 4000 − 1000 = 3000." },
            { t:"4000", fb:"A ring cut twice gives two pieces: 1500 − 500 = 1000, and 4000 − 1000 = 3000." }] },
        { id:"q2", goal:5, prompt:"A 4000 bp <strong>line</strong> is cut at 500 and 1500. Fragments?",
          choices:[{ t:"500, 1000 and 2500", ok:true, fb:"Right. A line cut twice gives three pieces, from each end to each cut." },
            { t:"1000 and 3000", fb:"A line cut twice gives three pieces, from each end to each cut." },
            { t:"500 and 1500", fb:"A line cut twice gives three pieces, from each end to each cut." },
            { t:"1000 and 2500", fb:"A line cut twice gives three pieces, from each end to each cut." }] },
        { id:"q3", goal:5, prompt:"Fragments of 1000 and 3000 bp are run on a gel. Which band is closer to the wells?",
          choices:[{ t:"3000 bp", ok:true, fb:"Right. Large fragments move slowest, so they stay near the wells." },
            { t:"1000 bp", fb:"Large fragments move slowest, so they stay near the wells." },
            { t:"They run together", fb:"Large fragments move slowest, so they stay near the wells." },
            { t:"Neither moves", fb:"Large fragments move slowest, so they stay near the wells." }] },
        { id:"q4", goal:5, prompt:"A plasmid cut with BamHI gives a single band at its full length, 5000 bp. How many BamHI sites does it have?",
          choices:[{ t:"1", ok:true, fb:"Right. One cut opens the ring into one 5000 bp line." },
            { t:"0", fb:"One cut opens the ring into one 5000 bp line. Two sites would give two bands, unless the pieces were the same size." },
            { t:"2", fb:"One cut opens the ring into one 5000 bp line. Two sites would give two bands, unless the pieces were the same size." },
            { t:"5", fb:"One cut opens the ring into one 5000 bp line. Two sites would give two bands, unless the pieces were the same size." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"cuts", type:"custom", title:"Cut, ends and joins", summary:"Cut, ends and joins", goal:[1, 2, 3, 4, 6], how:"",
        instruction:"Eight quick-fire items. Tap a chip, or type your answer and press Check. Item 6 is an investigation item; item 7 is about insulin in society.",
        items:[
          { id:"c1", kind:"num", goal:2, prompt:"How many EcoRI sites are in " + sq("5′-TTGAATTCAGGATCCTTGAATTGCAGAATTCTA-3′") + "?",
            answer:2, display:"2", unit:"sites", wrong:[{ match:3, fb:"GAATTG isn’t a site. " + M1 }] },
          { id:"c2", kind:"seq", goal:1, prompt:"Which overhang does BamHI (G↓GATCC) leave? Type the bases.",
            answer:"GATC", display:sq("GATC"), wrong:[{ match:"GGATCC", fb:"The overhang is the part between the two staggered cuts." }] },
          { id:"c3", kind:"chips", goal:3, prompt:"Can an EcoRI end be joined directly to a BamHI end?",
            choices:[{ t:"Yes", fb:"AATT and GATC aren’t complementary. " + M3 }, { t:"No", ok:true, fb:"AATT and GATC aren’t complementary." }] },
          { id:"c4", kind:"chips", goal:3, prompt:"Can two blunt SmaI ends be joined by ligase?",
            choices:[{ t:"Yes", ok:true, fb:"Ligase can seal any two blunt ends; there is no overhang to match, so it is just less efficient." }, { t:"No", fb:"Ligase can seal any two blunt ends; there is no overhang to match, so it is just less efficient." }] },
          { id:"c5", kind:"num", goal:2, prompt:"On average, how often does a particular 6-base sequence occur in random DNA? Once every ___ bp.",
            answer:4096, display:"4096", unit:"bp",
            wrong:[{ match:1296, fb:"There are 4 bases, so 4⁶ = 4096, not 6⁴." }, { match:24, fb:"4 × 6 counts choices, not combinations." }],
            hints:["Each position has 4 possible bases.", "For 6 positions: 4 × 4 × 4 × 4 × 4 × 4.", "4⁶ = 4096."] },
          { id:"c6", kind:"chips", goal:4, prompt:"One plate is spread with bacteria that were given <strong>no</strong> plasmid. What is it for?",
            choices:[{ t:"To grow extra insulin-making bacteria", fb:"It isn’t for making insulin. It shows that growth on the other plates is due to the plasmid." },
              { t:"A control: no colonies should grow, which shows the selection plate stops cells without the plasmid", ok:true, fb:"It shows that growth on the other plates is due to the plasmid." },
              { t:"To find out which colonies are white", fb:"It isn’t for screening colonies. It shows that growth on the other plates is due to the plasmid." }] },
          { id:"c7", kind:"chips", goal:6, prompt:"Recombinant human insulin replaced insulin purified from animal pancreases. Which is the fairest evaluation?",
            choices:[{ t:"It cures diabetes, so the switch solved the problem completely", fb:"It doesn’t cure diabetes." },
              { t:"Animal insulin had no drawbacks, so nothing was gained", fb:"Animal insulin worked for many people, but supply and slight differences from human insulin were limits." },
              { t:"It matches human insulin exactly and can be made in large amounts; cost and access to medicine are still issues", ok:true, fb:"A fair evaluation weighs a benefit against a limit that remains." }] },
          { id:"c8", kind:"chips", goal:[3, 6], prompt:"Why is the insulin gene copied from mRNA (cDNA) before it goes into bacteria?",
            choices:[{ t:"Bacteria can’t remove introns; mRNA has none", ok:true, fb:M7 },
              { t:"Bacteria can’t read human DNA", fb:"Bacteria can read human DNA (the genetic code is shared); introns are the problem." },
              { t:"mRNA is easier to cut with restriction enzymes", fb:"Restriction enzymes cut double-stranded DNA; introns are the problem." }],
            hints:["What does the spliceosome do in our cells?", "Bacteria have no spliceosome.", "Use a copy of the mature mRNA: cDNA."] }
        ] },
      { id:"maps", type:"custom", title:"Map detective", summary:"Map detective", star:true, goal:[2, 5], how:"",
        instruction:"Six map puzzles. Items 3 to 6 are non-routine (★); the last two go beyond the Final Check. For a list, type the sizes in any order, separated by commas.",
        items:[
          { id:"r1", kind:"num", goal:5, prompt:"A 3000 bp ring has EcoRI sites at 400 and 1900. How many <strong>bands</strong> appear on the gel?",
            answer:1, display:"1", unit:"band(s)", wrong:[{ match:2, fb:"Both fragments are 1500 bp, so they run together as one band." }] },
          { id:"r2", kind:"num", goal:5, prompt:"The same sites on a 3000 bp <strong>line</strong>: list the fragments.",
            answer:[400, 1100, 1500], display:"400, 1100 and 1500 bp", unit:"bp", wrong:[{ match:[1500, 1500], fb:"That’s the ring answer. " + M5 }] },
          { id:"r3", kind:"num", goal:5, star:true, prompt:"A 5000 bp plasmid gives one 5000 bp band with EcoRI, one with BamHI, and 800 + 4200 with both. How far apart are the two sites (the shorter way round)?",
            answer:800, display:"800 bp", unit:"bp", wrong:[{ match:4200, fb:"That’s the longer way round." }] },
          { id:"r4", kind:"chips", goal:5, star:true, prompt:"A 4000 bp plasmid: HindIII gives 1500 + 2500; EcoRI gives one 4000 band; both give 500 + 1000 + 2500. Where is the EcoRI site?",
            choices:[{ t:"Inside the 2500 bp HindIII fragment", fb:"Inside the 2500 piece would split 2500, not 1500." },
              { t:"Inside the 1500 bp HindIII fragment, 500 bp from one HindIII site", ok:true, fb:"1500 is replaced by 500 + 1000." },
              { t:"Exactly on a HindIII site", fb:"Then the double digest would look like HindIII alone: 1500 + 2500." }],
            hints:["Which HindIII fragment disappears in the double digest?", "1500 is replaced by 500 + 1000.", "EcoRI lies inside the 1500 bp piece, 500 bp from one end."] },
          { id:"r5", kind:"num", goal:[3, 5], star:true, prompt:"A 750 bp EcoRI fragment is inserted into a 4000 bp plasmid cut once with EcoRI. Sizes of the recombinant, and of the bands after cutting it with EcoRI?",
            parts:[
              { id:"a", label:"Recombinant", unit:"bp", answer:4750, wrong:[{ match:4000, fb:"The insert adds its length." }] },
              { id:"b", label:"EcoRI bands", unit:"bp", answer:[4000, 750], wrong:[{ match:[4000], fb:"The insert adds its length; cutting with EcoRI frees it again." }, { match:[4750], fb:"EcoRI cuts at both junctions." }] }],
            display:"4750 bp; bands at 4000 and 750 bp" },
          { id:"r6", kind:"num", goal:5, star:true, prompt:"A 4000 bp plasmid has its EcoRI cloning site at 1000 and a BamHI site at 1100. A 600 bp insert has a BamHI site 150 bp from its left end. If the insert is <strong>forward</strong>, what are the two BamHI fragments?",
            answer:[550, 4050], display:"550 and 4050 bp", unit:"bp", wrong:[{ match:[250, 4350], fb:"That’s the reversed orientation." }],
            hints:["The recombinant is 4600 bp; the plasmid’s BamHI site moves to 1700.", "Forward: the insert’s BamHI site is at 1000 + 150 = 1150.", "1700 − 1150 = 550; 4600 − 550 = 4050."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Selin", how:"",
        instruction:"Selin made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"A 6000 bp plasmid has EcoRI sites at 1000, 2500 and 4500. Predict the fragments.",
            steps:["The plasmid is a circle.", "There are three sites, so EcoRI cuts it three times.", "Three cuts make four pieces: 0–1000, 1000–2500, 2500–4500 and 4500–6000.", "So the fragments are 1000, 1500, 2000 and 1500 bp."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Three cuts in a circle make three pieces: 1500, 2000 and 2500 bp (from 4500 round to 1000).", ok:true, why:M5 },
              { t:"Four pieces, but all 1500 bp.", why:"That doesn’t add to 6000 in the right places." },
              { t:"Two pieces, because the ring must be opened first.", why:"Every cut counts." },
              { t:"Step 3 is correct.", why:"0 and 6000 are the same point on a ring." }],
            hints:["Is there an end at 0 on a ring?", "No: 4500 to 1000 is one piece.", "1500, 2000, 2500."] },
          { id:"e2", goal:3, task:"Plan how to insert the insulin coding sequence into pLAB.",
            steps:["Cut pLAB with EcoRI; it cuts once, inside " + lz + ".", "Cut the donor DNA with HindIII to free the gene.", "Mix the pieces and add DNA ligase.", "Transform bacteria and grow them on the selection plate with X-gal.", "Pick white colonies."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is fine on its own; the problem comes earlier.", "This step is fine.", "This step is fine."],
            fixes:[
              { t:"Cut the donor with EcoRI too: it cuts at 700 and 1250, on both sides of the gene, and its ends match the plasmid’s.", ok:true, why:M3 },
              { t:"Cut the plasmid with HindIII as well.", why:"pLAB’s HindIII site would match, but HindIII cuts the donor only at 1600, on one side of the gene." },
              { t:"Add more ligase.", why:"No amount of ligase joins AATT to AGCT." },
              { t:"Step 2 is correct.", why:"HindIII ends can’t pair with EcoRI ends." }],
            hints:["Do the plasmid’s ends and the gene fragment’s ends match?", "Which enzyme cuts on both sides of the gene?", "EcoRI on both."] },
          { id:"e3", goal:4, task:"Explain the plate: 70 blue and 30 white colonies grew on the selection plate with X-gal.",
            steps:["Only bacteria carrying the plasmid grow here, because the plasmid has the marker gene.", "The cloning site is inside " + lz + ".", "Blue colonies make β-galactosidase, so their " + lz + " is intact: no insert.", "White colonies don’t have a plasmid.", "So we keep the blue colonies."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"White colonies have a plasmid whose " + lz + " was broken by the insert: these 30 are the recombinant ones to keep.", ok:true, why:M6 },
              { t:"White colonies have two plasmids.", why:"One insert is enough to break " + lz + "." },
              { t:"White colonies are dead.", why:"Dead cells don’t form colonies." },
              { t:"Step 4 is correct.", why:"Step 1 says every colony here has a plasmid." }],
            hints:["Look back at step 1.", "Every colony on this plate has a plasmid.", "White = insert inside " + lz + "."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the cut-and-paste lab: the plate that grew only blue colonies, or the plate with no colonies at all?" },
      { id:"j2", q:"In your own words, why must the plasmid and the gene be cut with the same enzyme(s)?" },
      { id:"j3", q:"Explain to a friend how blue–white screening tells you which colonies carry the gene." },
      { id:"j4", q:"Which part of restriction mapping still trips you up (rings vs lines, or working backwards)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which top-strand sequence (5′ → 3′) is a palindromic recognition site?", options:[
          { t:sq("GGATCC"), ok:true, why:"Its partner strand, read 5′ → 3′, is also GGATCC." },
          { t:sq("GATTAG"), why:"It reads the same backwards on one strand, but its partner strand reads CTAATC." },
          { t:sq("GGATCG"), why:"Close, but the partner strand reads CGATCC." },
          { t:sq("TTTTTT"), why:"Repetition isn’t the rule; the partner strand reads AAAAAA." }] },
        b:{ prompt:"Which top-strand sequence (5′ → 3′) is a palindromic recognition site?", options:[
          { t:sq("AAGCTT"), ok:true, why:"Its partner strand, read 5′ → 3′, is also AAGCTT." },
          { t:sq("AAGGAA"), why:"Its partner strand reads TTCCTT." },
          { t:sq("AAGCTA"), why:"Close, but the partner strand reads TAGCTT." },
          { t:sq("GGGGGG"), why:"Its partner strand reads CCCCCC." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What does DNA ligase do when a gene is joined to a plasmid?", options:[
          { t:"It forms covalent bonds that seal the sugar–phosphate backbone between the gene and the plasmid", ok:true, why:M4 },
          { t:"It pairs the overhanging bases with hydrogen bonds", why:"The overhangs pair on their own." },
          { t:"It cuts the plasmid at its recognition site", why:"That’s the restriction enzyme." },
          { t:"It makes many copies of the gene", why:"That’s PCR, or the bacteria dividing." }] },
        b:{ prompt:"Two complementary sticky ends line up. What holds them together at first, and what does ligase add?", options:[
          { t:"Hydrogen bonds between the overhang bases; ligase adds covalent backbone bonds", ok:true, why:M4 },
          { t:"Covalent bonds between the bases; ligase adds hydrogen bonds", why:"That’s backwards." },
          { t:"Nothing holds them; ligase pairs the bases", why:M4 },
          { t:"Ligase holds them, and polymerase seals the backbone", why:"Polymerase builds new strands; ligase seals gaps." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"On a selection plate with X-gal, a colony is <strong>white</strong>. What does that tell you?", options:[
          { t:"It has a plasmid with an insert that broke " + lz, ok:true, why:M6 },
          { t:"It has no plasmid", why:"Without the plasmid it couldn’t grow on this plate." },
          { t:"It has the insert, in the correct orientation", why:"White shows an insert, not which way round it is." },
          { t:"Its " + lz + " is working", why:"A working " + lz + " turns X-gal blue." }] },
        b:{ prompt:"On a selection plate with X-gal, a colony is <strong>blue</strong>. What does that tell you?", options:[
          { t:"It has the plasmid, but no insert: " + lz + " is intact", ok:true, why:M6 },
          { t:"It has the recombinant plasmid", why:"The insert would break " + lz + "." },
          { t:"It has no plasmid", why:"Without the plasmid it couldn’t grow here." },
          { t:"It has the insert in reverse", why:"Either orientation breaks " + lz + "." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:sq("5′-TTGAATTCAGGATCCTTGAATTGCAGAATTCTA-3′") + " is a linear piece of DNA. It is cut with EcoRI (GAATTC) and BamHI (GGATCC) together. How many fragments are made?", options:[
          { t:"4", ok:true, why:"2 EcoRI sites + 1 BamHI site = 3 cuts; a line cut 3 times gives 4 pieces." },
          { t:"5", why:"GAATTG isn’t an EcoRI site." },
          { t:"3", why:"3 cuts in a ring would give 3; this is a line." },
          { t:"2", why:"That counts only the BamHI cut." }] },
        b:{ prompt:sq("5′-GCAAGCTTGACCCGGGTAAGCTACTAAGCTTAG-3′") + " is a linear piece of DNA. It is cut with HindIII (AAGCTT) and SmaI (CCCGGG) together. How many fragments are made?", options:[
          { t:"4", ok:true, why:"2 HindIII sites + 1 SmaI site = 3 cuts; a line cut 3 times gives 4 pieces." },
          { t:"5", why:"AAGCTA isn’t a HindIII site." },
          { t:"3", why:M5 },
          { t:"2", why:"That counts only the SmaI cut." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A 5000 bp plasmid has EcoRI sites at 1000 and 3000 and a BamHI site at 4000. What fragments come from cutting with both?", options:[
          { t:"1000, 2000 and 2000 bp", ok:true, why:"Cuts at 1000, 3000 and 4000 on a ring: 2000, 1000, and 4000 round to 1000 = 2000." },
          { t:"1000, 1000, 1000 and 2000 bp", why:"That treats the ring as a line." },
          { t:"2000 and 3000 bp", why:"That’s EcoRI alone." },
          { t:"1000, 3000 and 4000 bp", why:"Those are the site positions, not the fragment sizes." }] },
        b:{ prompt:"A 6000 bp plasmid has HindIII sites at 500 and 2500 and a BamHI site at 4000. What fragments come from cutting with both?", options:[
          { t:"1500, 2000 and 2500 bp", ok:true, why:"Cuts at 500, 2500 and 4000: 2000, 1500, and 4000 round to 500 = 2500." },
          { t:"500, 1500, 2000 and 2000 bp", why:"That treats the ring as a line. " + M5 },
          { t:"2000 and 4000 bp", why:"That’s HindIII alone." },
          { t:"500, 2500 and 4000 bp", why:"Those are positions." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"In a donor DNA, the GFP gene has an EcoRI site just to its left and a HindIII site just to its right, and no sites inside. The plasmid’s cloning region has one EcoRI and one HindIII site. Which plan inserts GFP in one fixed orientation?", options:[
          { t:"Cut both the donor and the plasmid with EcoRI and HindIII, then add ligase", ok:true, why:"Different ends on each side can only pair one way." },
          { t:"Cut both with EcoRI only, then add ligase", why:"EcoRI cuts the donor on one side only, so the gene isn’t freed." },
          { t:"Cut the plasmid with EcoRI and the donor with HindIII, then add ligase", why:"The ends don’t match." },
          { t:"Cut both with EcoRI and HindIII, and skip ligase because the ends match", why:"Matching ends still need ligase to seal them." }] },
        b:{ prompt:"The GFP gene has a BamHI site just to its left and a HindIII site just to its right, and no sites inside. The plasmid’s cloning region has one BamHI and one HindIII site. Which plan inserts GFP in one fixed orientation?", options:[
          { t:"Cut both the donor and the plasmid with BamHI and HindIII, then add ligase", ok:true, why:"Different ends on each side can only pair one way." },
          { t:"Cut both with BamHI only, then add ligase", why:"BamHI cuts on one side only." },
          { t:"Cut the plasmid with BamHI and the donor with HindIII", why:"The ends don’t match. " + M3 },
          { t:"Cut both with both enzymes and skip ligase", why:"Matching ends still need ligase to seal them. " + M4 }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why a bacterium’s restriction enzymes don’t destroy its own DNA?", options:[
          { t:"“The bacterium adds methyl groups to the recognition sites in its own DNA, so its enzymes don’t cut there; DNA entering from bacteriophages lacks these marks and is cut.”", ok:true, why:"Methyl marks protect the cell’s own sites." },
          { t:"“Bacterial DNA has no recognition sites.”", why:"Sites occur about every 4096 bp by chance; bacterial DNA has many." },
          { t:"“Restriction enzymes only cut RNA.”", why:"They cut double-stranded DNA." },
          { t:"“The enzymes are kept outside the cell.”", why:"They work inside the cell, where incoming DNA arrives." }] },
        b:{ prompt:"Which is the best explanation of the term “sticky ends”?", options:[
          { t:"“Short single-stranded overhangs whose bases can pair with a complementary overhang, holding two fragments together until ligase seals them.”", ok:true, why:"The “stickiness” is base pairing." },
          { t:"“Ends coated with proteins that act like glue.”", why:"The “stickiness” is base pairing." },
          { t:"“Ends that can pair with any other cut end.”", why:M3 },
          { t:"“The flat ends left by SmaI.”", why:"Those are blunt ends." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which flow chart shows the steps for making bacteria that carry the insulin gene?", options:[
          { t:"Cut the plasmid and the gene with the same enzyme → mix and add ligase → transform bacteria → grow them on the selection plate with X-gal → pick white colonies", ok:true, why:"Cut, then seal, then transform, then select and screen: white colonies carry the insert." },
          { t:"Add ligase → cut the plasmid and the gene → transform → plate → pick white", why:"Ligase joins pieces that already exist; cut first." },
          { t:"Cut → transform → add ligase → plate → pick white", why:"The plasmid must be sealed before it goes into the cells." },
          { t:"Cut → ligase → transform → plate → pick blue", why:M6 }] },
        b:{ prompt:"Which flow chart shows the steps for making bacteria that carry the GFP gene?", options:[
          { t:"Cut the plasmid and the GFP gene with the same enzymes → mix and add ligase → transform bacteria → grow them on the selection plate with X-gal → pick white colonies", ok:true, why:"Cut, then seal, then transform, then select and screen: white colonies carry the insert." },
          { t:"Transform → cut → ligase → plate → pick white", why:"The bacteria need the finished recombinant plasmid." },
          { t:"Cut → ligase → plate → transform → pick white", why:"Plating comes after the cells take in the plasmid." },
          { t:"Cut → ligase → transform → plate → pick blue", why:M6 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A team inserts the human insulin gene, copied straight from chromosomal DNA, into <i>E. coli</i>, and expects working insulin. What is the most likely result, and the fix?", options:[
          { t:"The protein will be wrong, because bacteria can’t remove introns; use a copy made from mRNA (cDNA)", ok:true, why:M7 },
          { t:"It works, because bacteria remove introns the way human cells do", why:M7 },
          { t:"Nothing is made, because bacteria can’t read human DNA", why:"The genetic code is shared; introns are the problem." },
          { t:"It works, provided a blunt-cutting enzyme is used", why:"The cutting enzyme doesn’t affect introns." }] },
        b:{ prompt:"Why do scientists copy the insulin gene from mRNA (as cDNA) before putting it into <i>E. coli</i>?", options:[
          { t:"Mature mRNA has no introns, and bacteria can’t remove introns themselves", ok:true, why:M7 },
          { t:"mRNA is double-stranded and easier to cut", why:"mRNA is single-stranded; cDNA is made from it." },
          { t:"Bacteria can only read RNA, not DNA", why:"Bacteria transcribe DNA, as our cells do." },
          { t:"Chromosomal DNA has no promoter", why:"The issue is introns, not promoters." }] } },
      { id:"a2", cat:"A", goal:[4, 6],
        a:{ prompt:"A new plasmid has its cloning site inside a GFP gene instead of " + lz + ". After inserting the insulin gene, colonies on the selection plate are viewed under blue light. Which colonies most likely carry the insulin insert?", options:[
          { t:"The colonies that do not glow, because the insert interrupts GFP", ok:true, why:"An insert in the middle of GFP stops the glowing protein being made." },
          { t:"The colonies that glow green", why:"A glowing colony has an intact GFP gene, so no insert." },
          { t:"All of them, because the selection plate guarantees the insert", why:"Selection shows a plasmid is present, not that it has an insert." },
          { t:"None, because GFP stops the marker gene working", why:"The two genes are separate." }] },
        b:{ prompt:"A plasmid’s cloning site is inside " + lz + ". On the selection plate with X-gal there are 80 blue and 20 white colonies. How many colonies most likely carry a recombinant plasmid?", options:[
          { t:"20", ok:true, why:"White colonies have " + lz + " broken by an insert." },
          { t:"80", why:"Blue colonies have an intact " + lz + ": no insert." },
          { t:"100", why:"Every colony has a plasmid, but not every plasmid has an insert." },
          { t:"0", why:"White colonies still have a plasmid." }] } }
    ]
  },
  task:{
    title:"One way round", summary:"One way round",
    statement:"<p>Choose two enzymes to insert the GFP gene into pLAB so it can only go in one way round. Can you find every pair that works?</p><ol class=\"rz-conds\"><li>Each enzyme cuts pLAB exactly once, inside " + lz + ".</li><li>Neither enzyme cuts inside the GFP gene.</li><li>Between them, the enzymes cut the donor on both sides of the gene.</li><li>The two enzymes are different.</li></ol>",
    checks:["Each cuts pLAB once, in " + lz, "No cut inside GFP", "Cuts on both sides", "Two different enzymes"],
    tips:["PstI also cuts pLAB at 1500, inside the marker gene; cells couldn’t grow on the selection plate.",
      "SmaI cuts the donor at 1400, inside GFP.",
      "You need one cut left of 1000 and one right of 1720.",
      "One enzyme alone lets the gene go in either way round, and lets the plasmid close on itself."],
    explainPrompt:"Explain why your enzyme pair gives the gene only one way to fit, and why each rejected enzyme fails.",
    vocab:"Use the words recognition site, sticky end, orientation, marker gene and " + lz + ".",
    success:"Your pair inserts GFP one way round!",
    more:"Can you find every pair that works?",
    after3:"HindIII cuts the donor twice (900 and 1800), but both cuts are outside GFP, so the gene stays whole. What matters is where the cuts are, not how many there are."
  },
  cards:[
    ["Restriction enzyme", "Cuts double-stranded DNA at one specific short sequence (usually 4–8 bp). Made by bacteria as a defence against bacteriophages."],
    ["Recognition site", "The exact sequence an enzyme cuts, e.g. EcoRI: " + sq("5′-GAATTC-3′") + "."],
    ["Palindromic site", "Reads the same 5′ → 3′ on both strands: GAATTC pairs with GAATTC."],
    ["Sticky ends", "Staggered cuts leave single-stranded overhangs (EcoRI: AATT) that pair with complementary overhangs."],
    ["Blunt ends", "A straight cut with no overhang (SmaI: CCC↓GGG)."],
    ["DNA ligase", "Seals the sugar–phosphate backbone with covalent bonds after the overhangs pair."],
    ["Vector", "DNA that carries a gene into a cell; often a plasmid."],
    ["Recombinant DNA", "DNA joined from two sources, e.g. pLAB + the insulin coding sequence."],
    ["Selection", "A marker gene on the plasmid lets only cells carrying the plasmid grow on the selection plate."],
    ["Blue–white screening", "Insert inside " + lz + " → no β-galactosidase → white colony (recombinant). Blue = no insert."],
    ["Rings vs lines", "A ring cut <i>n</i> times gives <i>n</i> fragments; a line gives <i>n</i> + 1. The fragments add up to the total length."],
    ["cDNA", "A DNA copy of mature mRNA: no introns, so bacteria can make the right protein."]
  ]
};
