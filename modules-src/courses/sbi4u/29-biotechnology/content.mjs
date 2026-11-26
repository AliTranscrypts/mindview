// SBI4U 29 Biotechnology. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/29-biotechnology.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M8 but gives no feedback of its own.
const M1 = "Bacteria can’t remove introns. Give them cDNA, made from mature mRNA, which holds only the exons.";
const M2 = "Sticky ends join only if their unpaired bases are complementary. Cut both pieces with the same enzyme.";
const M3 = "A restriction enzyme cuts, ligase seals, PCR copies, a gel sorts by size, sequencing reads, CRISPR edits.";
const M4 = "The genetic code is nearly universal: bacteria read human codons correctly. The problem is introns, not the code.";
const M5 = "Gene cloning copies a gene; reproductive cloning copies a whole organism; selective breeding chooses parents; genetic modification inserts or changes DNA.";
const M6 = "Only a small fraction of cells take up the plasmid. A marker gene lets only those cells grow on the selection plate.";
const M7 = "Ask what this product does, what the data show, and what the risks are. One case doesn’t decide another.";
const M8 = "In Canada, Health Canada assesses food and drug safety, the CFIA assesses crops released into the environment, and the Assisted Human Reproduction Act sets limits on human embryos.";
const T = (s, tok) => '<span class="bio-tok" style="--tok:var(' + tok + ')">' + s + "</span>";
const A = (lab) => '<span class="bt-arr"><span aria-hidden="true">→</span><small>' + lab + "</small></span>";

export default {
  id:"29-biotechnology",
  kind:"topic",
  title:"Biotechnology",
  topic:"Biotechnology",
  readyTopic:"biotechnology",
  hero:{
    eq:'<span class="bt-heq">' + T("insulin mRNA", "--bio-nadh") + " " + A("reverse transcriptase") + " " + T("cDNA", "--pen") + " " + A("✂ restriction enzyme") + " " +
      '<span class="bt-hw">cut gene + plasmid</span> ' + A("DNA ligase") + " " + T("recombinant plasmid", "--ink") + " " + A("transformation") + " " +
      '<span class="bt-hw">bacteria</span> ' + A("protein synthesis") + " " + T("human insulin", "--bio-carbon") + "</span>",
    eqLabel:"Insulin mRNA is copied into cDNA by reverse transcriptase. A restriction enzyme cuts the gene and a plasmid. DNA ligase joins them into a recombinant plasmid. Transformation puts it into bacteria, which make human insulin.",
    eqSize:"sm",
    headline:"Every tool solves one problem",
    text:"<strong>Biotechnology</strong> uses living things and their molecules to make products and solve problems. In <strong>genetic engineering</strong>, scientists cut DNA with <strong>restriction enzymes</strong>, join it with <strong>DNA ligase</strong>, and carry it into cells on a <strong>vector</strong> such as a plasmid. The result is <strong>recombinant DNA</strong>: DNA from two sources in one molecule. When a cell takes it up (<strong>transformation</strong>), the cell can make a protein it never made before.",
    fig:{ html:'<div class="bt-hero" id="bt-hero" role="img" aria-label="A pancreas cell glows. An insulin mRNA strand in teal slides out and becomes a blue DNA copy labelled cDNA. A plasmid ring opens where scissors cut it, and the blue gene slips into the gap. A ligase tag seals both joins. The plasmid drifts into a rod-shaped bacterium, which divides into 2, 4, then 8 cells, and small brown insulin shapes appear beside them."></div>' }
  },
  goals:[
    "I can name the main biotechnology tools and explain what problem each one solves.",
    "I can describe how a recombinant plasmid is made and put into host cells, and how transformed cells are picked out.",
    "I can explain why a human gene must be given to bacteria as cDNA (without introns).",
    "I can tell gene cloning from reproductive cloning, and describe examples of genetic modification in medicine, industry and agriculture.",
    "I can identify which Canadian body or law applies to a biotechnology product.",
    "I can weigh the benefits and risks of a biotechnology application using evidence and reasoning."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Base pairing", goal:2,
          prompt:"Which strand pairs with 5′-ATGCCG-3′?",
          options:[
            { t:"3′-TACGGC-5′", ok:true, why:"A pairs with T and G with C, and the partner strand runs the opposite way." },
            { t:"3′-UACGGC-5′", why:"DNA has T, not U." },
            { t:"5′-TACGGC-3′", why:"The partner’s ends are flipped: its 3′ end sits across from the 5′ end." },
            { t:"3′-ATGCCG-5′", why:"Each base pairs with its partner: A with T, G with C." }],
          hints:["Pair each base, then label the ends.", "A–T, T–A, G–C, C–G, C–G, G–C gives TACGGC.", "Opposite direction: 3′-TACGGC-5′."] },
        { id:"w2", skill:"Base pairing", goal:2,
          prompt:"A double-stranded DNA sample is 30% adenine. What percentage is guanine?",
          options:[
            { t:"20%", ok:true, why:"A = T = 30%, so A + T = 60%. That leaves 40% for G + C, so G = 20%." },
            { t:"30%", why:"G pairs with C, not A." },
            { t:"70%", why:"T is also 30%." },
            { t:"40%", why:"40% is G and C together; G is half." }],
          hints:["A pairs with T, so they’re equal.", "A + T = 60%.", "(100 − 60) ÷ 2 = 20%."] },
        { id:"w3", skill:"Gene expression", goal:3,
          prompt:"Which molecule carries a gene’s instructions from the nucleus to a ribosome?",
          options:[
            { t:"mRNA", ok:true, why:"Messenger RNA is transcribed from the gene and translated at the ribosome." },
            { t:"tRNA", why:"tRNA brings amino acids to the ribosome; it doesn’t carry the gene’s message." },
            { t:"rRNA", why:"rRNA is part of the ribosome itself." },
            { t:"DNA polymerase", why:"That enzyme copies DNA during replication." }],
          hints:["Which RNA is a copy of the gene?", "The “messenger”.", "mRNA."] },
        { id:"w4", skill:"Gene expression", goal:3,
          prompt:"A eukaryotic pre-mRNA has 3 exons and 2 introns. What does the mature mRNA contain?",
          options:[
            { t:"The 3 exons, joined together", ok:true, why:"Splicing removes the introns and joins the exons." },
            { t:"The 2 introns only", why:"Introns are removed; exons are expressed." },
            { t:"All 5 pieces", why:"That’s the pre-mRNA." },
            { t:"The 3 exons and 1 intron", why:"Splicing removes every intron." }],
          hints:["Which pieces are expressed?", "Introns are cut out.", "Exons only, joined."] },
        { id:"w5", skill:"Mutations", goal:1,
          prompt:"A mutation changes one base, but the amino acid stays the same. What kind of mutation is it?",
          options:[
            { t:"Silent", ok:true, why:"Several codons code for the same amino acid." },
            { t:"Missense", why:"Missense changes the amino acid." },
            { t:"Nonsense", why:"Nonsense makes a stop codon." },
            { t:"Frameshift", why:"A frameshift comes from inserting or deleting bases, not a one-base swap." }],
          hints:["Did the protein change?", "No change in the amino acid.", "Silent."] },
        { id:"w6", skill:"Bacteria and plasmids", goal:2,
          prompt:"What is a plasmid?",
          options:[
            { t:"A small, circular DNA molecule in bacteria, separate from the main chromosome, that is copied on its own", ok:true, why:"Plasmids are small extra rings of DNA, copied on their own and passed on when the cell divides." },
            { t:"The protein coat around a bacterium", why:"That’s a cell wall or capsule, not DNA." },
            { t:"The bacterium’s main chromosome", why:"Plasmids are extra DNA rings, separate from it." },
            { t:"A ribosome subunit", why:"Ribosomes are made of rRNA and protein." }],
          hints:["It’s DNA.", "Small, circular and extra.", "A small, circular DNA molecule, separate from the main chromosome."] }
      ],
      refreshers:{
        "Base pairing":"A pairs with T (U in RNA), and G with C. The two strands are antiparallel: the 5′ end of one sits across from the 3′ end of the other. In double-stranded DNA, %A = %T and %G = %C.",
        "Gene expression":"DNA → mRNA (transcription) → protein (translation). In eukaryotes, the pre-mRNA is spliced: introns out, exons joined.",
        "Mutations":"Silent: same amino acid. Missense: a different amino acid. Nonsense: a stop codon. Frameshift: bases added or removed (not in threes) shift the reading frame.",
        "Bacteria and plasmids":"Bacteria have one main circular chromosome and often small extra rings called plasmids, which are copied on their own and passed on when the cell divides."
      }
    }
  },
  explore:{
    heading:"Biotech toolkit map",
    intro:"Explore the tools, then chain them into a route that makes a product. Run your route to see where it works and where it breaks.",
    chalIntro:"Use the <strong>Route builder</strong> to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 unlocks the rice goal once challenge 1 is met. Each challenge has three levels of help.",
    cards:[
      { id:"re", t:"Restriction enzyme", problem:"Cut DNA at one exact sequence", deeper:"33" },
      { id:"lig", t:"DNA ligase", problem:"Seal two DNA pieces into one molecule", deeper:"33" },
      { id:"vec", t:"Plasmid vector", problem:"Carry a gene into a cell, where it gets copied", deeper:"33" },
      { id:"rt", t:"Reverse transcriptase", problem:"Make a DNA copy (cDNA) of an mRNA, with no introns" },
      { id:"pcr", t:"PCR", problem:"Make millions of copies of one DNA region", deeper:"30" },
      { id:"gel", t:"Gel electrophoresis", problem:"Sort DNA fragments by size", deeper:"32" },
      { id:"seq", t:"DNA sequencing", problem:"Read the exact order of bases" },
      { id:"cr", t:"CRISPR-Cas9", problem:"Change the DNA at one chosen site in a living cell", deeper:"31",
        note:"Precise, targeted DNA changes started earlier: Canadian Michael Smith shared the 1993 Nobel Prize in Chemistry for a method to change one chosen base." },
      { id:"tf", t:"Transformation and selection", problem:"Get the plasmid into cells, then keep only cells that took it up", deeper:"33" },
      { id:"clone", t:"Reproductive cloning", problem:"Make a whole organism genetically identical to a donor" }
    ],
    deeper:{
      "30":{ file:"30-pcr.html", t:"30 PCR" },
      "31":{ file:"31-crispr.html", t:"31 CRISPR gene editing" },
      "32":{ file:"32-gel-electrophoresis.html", t:"32 Gel electrophoresis" },
      "33":{ file:"33-restriction-enzymes-and-recombinant-dna.html", t:"33 Restriction enzymes and recombinant DNA" }
    },
    goalsList:[
      { id:"insulin", t:"Insulin from bacteria" },
      { id:"gfp", t:"Glowing reporter bacteria (GFP)" },
      { id:"rice", t:"Beta-carotene rice" }],
    tiles:[
      { id:"T1", t:"Make cDNA from mRNA (reverse transcriptase)", card:"rt" },
      { id:"T2", t:"Copy the gene from chromosome DNA (PCR)", card:"pcr" },
      { id:"T3", t:"Cut gene and vector with the <strong>same</strong> restriction enzyme", card:"re" },
      { id:"T4", t:"Cut gene and vector with <strong>two different</strong> enzymes", card:"re" },
      { id:"T5", t:"Seal with DNA ligase", card:"lig" },
      { id:"T6", t:"Put the plasmid into bacteria (transformation)", card:"vec" },
      { id:"T7", t:"Deliver the DNA into plant cells (gene gun)", card:"gun" },
      { id:"T8", t:"Selection: a marker gene lets only transformed cells grow", card:"tf" },
      { id:"T9", t:"Grow whole plants from transformed cells", card:"plant" },
      { id:"T10", t:"Check the insert: gel electrophoresis", card:"gel" },
      { id:"T11", t:"Check the insert: DNA sequencing", card:"seq" },
      { id:"T12", t:"Grow in a fermentation tank", card:"tank" },
      { id:"T13", t:"Purify the protein", card:"pure" },
      { id:"T14", t:"Reproductive cloning", card:"clone" },
      { id:"T15", t:"CRISPR edit", card:"cr" }],
    // run messages: plan "Run rules (exact)" first, then the module's own messages for the other broken links
    rules:{
      introns:"Faulty protein: bacteria can’t remove introns.",
      t4:"No recombinant plasmids: the ends don’t pair.",
      t5:"Nothing to seal yet.",
      mixed:"Unreliable, since you can’t tell which cells have the gene.",
      t12:"Nothing to grow yet.",
      t14bact:"Reproductive cloning copies a whole animal; it doesn’t put a gene into bacteria.",
      t14rice:"Reproductive cloning copies a whole organism; it doesn’t put a new gene into a plant.",
      t15:"CRISPR changes DNA that’s already in a cell; this goal needs a whole new gene added.",
      noGene:"There’s no gene to cut yet. Start with a copy of the gene.",
      cutTwice:"The gene and vector are already cut.",
      geneLate:"The gene is already copied and cut; another copy isn’t needed here.",
      sealTwice:"The pieces are already sealed.",
      notJoined:"Plasmid and gene not joined yet: cut them with the same enzyme and seal them first.",
      t6rice:"That puts the plasmid into bacteria; the host here is rice.",
      t7bact:"A gene gun delivers DNA into plant cells; the host here is bacteria.",
      twice:"The DNA is already in the cells.",
      t8early:"Nothing to select yet: no cells have been given the plasmid.",
      t9bact:"Bacteria don’t grow into plants.",
      t9early:"There are no transformed plant cells yet.",
      checkEarly:"Nothing to check yet: no cells carry the recombinant plasmid.",
      checkSel:"Pick out the transformed cells first, then check the insert in them.",
      checkPlant:"Grow whole plants first, then check the insert in them.",
      checkLate:"Check the insert before you scale up in the tank.",
      t12rice:"Rice isn’t grown in a tank.",
      t13rice:"The beta-carotene is wanted in the grain itself; there’s nothing to purify.",
      t13early:"Nothing to purify yet: grow the cells in the tank first.",
      noCells:"The plasmid never got into any cells.",
      noTank:"Only a few colonies: grow the cells in a fermentation tank to make enough.",
      noPure:"The insulin is mixed with bacterial proteins: purify it.",
      noCheck:"The insert was never checked, so you can’t be sure the gene went in correctly.",
      noPlants:"Transformed cells aren’t plants yet. Grain comes from a whole plant grown from those cells.",
      empty:"Place tiles on the stations first."
    },
    tc2Route:["T2", "T4", "T5", "T6", "T8", "T10", "T12", "T13", null],
    predictions:[
      { id:"p1", prompt:"The gene was copied straight from human chromosome DNA. What will the bacteria make?",
        options:[{ t:"A faulty protein, because bacteria can’t remove the introns", ok:true }, { t:"Normal human insulin" }, { t:"Nothing, because bacteria can’t read human DNA" }, { t:"Insulin plus a separate protein for each intron" }],
        explain:"Bacteria have no spliceosomes. The intron sequences stay in the mRNA and get translated (or hit a stop codon). Bacteria <em>can</em> read human codons, though: the code is nearly universal.",
        reveal:"Every station passed, but the product is a misshapen protein: the intron-coded segments (marked) were translated too.",
        start:{ kind:"route", slots:["T2", "T3", "T5", "T6", "T8", "T10", "T12", "T13", null] } },
      { id:"p2", prompt:"The plasmid and gene were cut with two different enzymes whose sticky ends don’t match. Will ligase join them?",
        options:[{ t:"No: the ends can’t pair, so few or no recombinant plasmids form", ok:true }, { t:"Yes, ligase joins any ends" }, { t:"Yes, but the gene goes in backwards" }, { t:"Only if the mixture is heated" }],
        explain:"Ligase only seals a backbone gap once complementary bases have paired. Different overhangs don’t pair.",
        reveal:"The ends came close, failed to pair and drifted apart. The plasmid closed on itself with no gene inside.",
        start:{ kind:"route", slots:["T1", "T4", "T5", "T6", "T8", "T10", "T12", "T13", null] } },
      { id:"p3", prompt:"Now the cells are spread on a selection plate. What grows?",
        options:[{ t:"Only the cells that took up the plasmid", ok:true }, { t:"All the cells, but only some make insulin" }, { t:"No cells" }, { t:"Only the cells without a plasmid" }],
        explain:"The plasmid carries a marker gene that lets only transformed cells grow on the selection plate. That’s how you find the few that took it up.",
        reveal:"Two colonies grew, one from each transformed cell. The other 38 cells didn’t grow.",
        start:{ kind:"plate" } },
      { id:"p4", prompt:"Each PCR cycle doubles the copies. Starting from 1 copy, how many after 10 cycles?",
        options:[{ t:"1024", ok:true }, { t:"20" }, { t:"100" }, { t:"512" }],
        explain:"2¹⁰ = 1024. Doubling, not adding: 20 would be +2 per cycle; 512 is only 9 doublings.",
        reveal:"The counter doubled 10 times: 1, 2, 4, 8, … 512, 1024.",
        start:{ kind:"pcr" } }
    ],
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build a working route for insulin from bacteria.",
        why:"T1, T3, T5, T6, T8, a check, T12, T13: every link solves one problem, so the product reads “Working human insulin”.",
        general:"Run the route to see where it breaks, then fix that station.",
        named:{ goal:"Switch the goal to <strong>Insulin from bacteria</strong>.", mode:"Switch to the <strong>Route builder</strong> first.",
          noT8:"Most cells never took up the plasmid. Add a selection station so only transformed cells grow.",
          t12:"There’s nothing to grow until the cells have the plasmid.",
          t14:M5, t15:"Editing isn’t adding a gene.", t2:M1, t4:M2,
          noCheck:"Add a check of the insert (gel or sequencing) before the tank." },
        hints:["Start with the right copy of the gene: bacteria can’t remove introns.", "Cut, then seal, then get it into cells, then keep only the transformed ones.", "T1, T3, T5, T6, T8, a check, T12, T13."] },
      { id:"tc2", goal:[2, 3], prompt:"This route makes no insulin. Fix it by swapping <strong>exactly two</strong> tiles. (Press <strong>Load challenge 2’s route</strong> in the Route builder.)",
        why:"Station 1 needed cDNA (T1), and station 2 needed the same enzyme on both pieces (T3). The T4 problem stopped the run early; the intron problem was hiding behind it.",
        general:"Run it, find where it breaks, then swap tiles.",
        named:{ goal:"Switch the goal to <strong>Insulin from bacteria</strong>.", mode:"Switch to the <strong>Route builder</strong> first.",
          only2:"One problem was hiding behind the other. Which station still causes trouble later?",
          only1:"No recombinant plasmids: the ends still don’t pair.",
          extra:"Two swaps are enough. Undo the others.",
          load:"Press <strong>Load challenge 2’s route</strong> first, then swap exactly two tiles." },
        hints:["Run it. Where does it stop? That’s one problem; is there a second that would show up later?", "Different enzymes → unmatched ends. Chromosome DNA → introns.", "Station 1 → T1, station 2 → T3."] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Goal: a rice plant that makes beta-carotene (a vitamin A precursor) in its grain. Build the shortest working route. (Unlocks after challenge 1.)",
        why:"T1 or T2, T3, T5, T7, T8, T9, then a check: plant cells splice introns, the gene gun delivers the DNA, and the grain comes from whole plants, so there’s no tank and nothing to purify.",
        general:"Run the route to see where it breaks, then fix that station.",
        named:{ locked:"Meet challenge 1 first; that unlocks the rice goal.", goal:"Switch the goal to <strong>Beta-carotene rice</strong>.", mode:"Switch to the <strong>Route builder</strong> first.",
          t13:"The beta-carotene is wanted in the grain itself; there’s nothing to purify.",
          t12:"Rice isn’t grown in a tank.",
          noT9:"Transformed cells aren’t plants yet. Grain comes from a whole plant grown from those cells.",
          t6:"That puts the plasmid into bacteria; the host here is rice.",
          long:"It works, but one station isn’t needed. (Hint: plant cells <em>can</em> remove introns, so either gene copy works, and there’s no tank.)" },
        hints:["What’s different about a plant host compared with bacteria? Think about introns, and about where the product ends up.", "Plant cells splice introns, so T1 or T2 both work. You need to deliver DNA into plant cells, select, then grow whole plants.", "T1 (or T2), T3, T5, T7, T8, T9, then a check."] }
    ]
  },
  part3:{
    slug:"society", name:"Society", heading:"Biotech and society",
    intro:"From building routes to judging their use: sort who checks each product in Canada, read a field trial’s data, then build an argument from evidence. Finish with the quick check.",
    // VERIFY: every regulator rule in Station 1 (plan: verify before release).
    st1:{ title:"Station 1: Who checks it?", how:"Tap a card, then tap the box it belongs in.",
      boxes:[{ id:"hc", t:"Health Canada" }, { id:"cfia", t:"CFIA (Canadian Food Inspection Agency)" }, { id:"ahra", t:"Assisted Human Reproduction Act" }, { id:"court", t:"The courts and patent law" }],
      cards:[
        { id:"c1", t:"Is food from a new genetically engineered crop safe to eat?", box:"hc" },
        { id:"c2", t:"Is a recombinant insulin medicine safe and effective?", box:"hc" },
        { id:"c3", t:"Can a genetically engineered crop be grown in open fields?", box:"cfia" },
        { id:"c4", t:"Is a modified crop safe as livestock feed?", box:"cfia" },
        { id:"c5", t:"May a clinic create a human clone, or make DNA changes to an embryo that could be passed on?", box:"ahra", after:"Prohibited." },
        // VERIFY: Harvard mouse case (Harvard College v. Canada, SCC 2002).
        { id:"c6", t:"Can a company patent a modified mouse?", box:"court", after:"Harvard mouse case, Supreme Court of Canada, 2002: higher life forms aren’t patentable." }],
      wrong:"Health Canada judges whether it’s safe to eat or use as a medicine; the CFIA judges what happens when a plant is released into fields or fed to animals.",
      wrongOther:M8,
      done:"✓ All six cards are in the right boxes. Each body answers a different question about the same kind of product." },
    st2:{ title:"Station 2: Check it with data",
      text:"A fictional field trial of a drought-tolerant wheat variety. Each variety grew in 4 replicate plots in a dry year and in a normal year, in the same fields.",
      cols:["Year type", "Standard wheat (t/ha)", "Drought-tolerant wheat (t/ha)", "Plot-to-plot variation"],
      rows:[["Dry year", "2.4", "3.6", "±0.2"], ["Normal year", "4.1", "4.0", "±0.2"]],
      qs:[
        { id:"d1", prompt:"In which year type does the new variety help?",
          choices:[{ t:"Dry years only", ok:true, fb:"In the dry year it gave 3.6 t/ha against 2.4 t/ha, far more than the ±0.2 variation. In the normal year the 0.1 t/ha difference is within the ±0.2 variation." },
            { t:"Normal years only", fb:"In the normal year the 0.1 t/ha difference is within the ±0.2 variation. Look at the dry year." },
            { t:"Both year types", fb:"In the normal year the 0.1 t/ha difference is within the ±0.2 variation, so there’s no real advantage." },
            { t:"Neither year type", fb:"In the dry year the gap is 1.2 t/ha, much larger than the ±0.2 variation." }] },
        { id:"d2", prompt:"Why grow standard wheat in the same fields?",
          choices:[{ t:"It’s the control: same soil and weather, so the difference is due to the variety", ok:true, fb:"The control shares everything except the variety, so any difference comes from the variety." },
            { t:"To give the farmer a backup crop", fb:"It’s the <strong>control</strong>: same soil and weather, so the difference is due to the variety." },
            { t:"Standard wheat helps the new variety grow", fb:"It’s the <strong>control</strong>: same soil and weather, so the difference is due to the variety." },
            { t:"To make the total harvest bigger", fb:"It’s the <strong>control</strong>: same soil and weather, so the difference is due to the variety." }] },
        { id:"d3", prompt:"Why four plots of each?",
          choices:[{ t:"Replication: it shows how much results vary by chance", ok:true, fb:"The ±0.2 comes from comparing the replicate plots." },
            { t:"To use up all the seed", fb:"<strong>Replication</strong> shows how much results vary by chance." },
            { t:"So each plot can get a different treatment", fb:"All four plots of a variety get the same treatment. <strong>Replication</strong> shows how much results vary by chance." },
            { t:"Four plots make each yield four times larger", fb:"Yield is per hectare, so it doesn’t grow with the number of plots. <strong>Replication</strong> shows how much results vary by chance." }] }
      ] },
    st3:{ title:"Station 3: Weigh it up", caseQ:"Should this drought-tolerant wheat be approved for Prairie farms?",
      how:"Choose one claim, tap the evidence that supports it (one or more), then choose the reasoning that links them. Then press Check my argument.",
      claims:[{ id:"ap", t:"Approve" }, { id:"mon", t:"Approve after further field monitoring" }, { id:"no", t:"Do not approve yet" }],
      evidence:[{ id:"dry", t:"Dry-year yields: 3.6 vs 2.4 t/ha" }, { id:"norm", t:"Normal-year yields: 4.0 vs 4.1 t/ha" }, { id:"safe", t:"Assessed for food safety" },
        { id:"gap", t:"Environmental effects not yet studied over several seasons" }, { id:"cost", t:"Seed costs more" }, { id:"pref", t:"Some consumers prefer non-modified foods" }],
      reasons:[{ id:"r1", t:"Drought is a main risk to Prairie farms, so a variety that holds its yield in dry years protects harvests." },
        { id:"r2", t:"How a crop affects fields, soil and other species must be known before it’s grown widely." },
        { id:"r3", t:"The dry-year benefit is real, but the missing environmental data should be gathered as the crop is grown." },
        { id:"r4", t:"If some people dislike a crop, it must be risky." }],
      accept:[
        { claim:"mon", need:["dry", "gap"], reason:"r3", t:"Approve after further monitoring, backed by the dry-year yields and the gap in environmental data." },
        { claim:"ap", need:["dry", "safe"], reason:"r1", t:"Approve, backed by the dry-year yields and the food-safety assessment, with reasoning about drought risk." },
        { claim:"no", need:["gap"], reason:"r2", t:"Do not approve yet, backed by the environmental data gap, with reasoning that field effects must be known first." }],
      msg:{ claim:"Choose a claim first.", ev:"Tap at least one piece of evidence.", reason:"Choose the reasoning that links your evidence to your claim.",
        pref:"Preference is a value, not evidence about the crop.", norm:"The data show no advantage in normal years.",
        r4:"Disliking something isn’t evidence that it’s risky. " + M7,
        need:{ ap:"To approve, show the benefit (the dry-year yields) and that it passed a food-safety assessment.",
          mon:"Back this claim with both the benefit (the dry-year yields) and the gap (environmental effects not yet studied).",
          no:"Which evidence shows that something important is still unknown?" },
        link:"That reasoning doesn’t connect your evidence to this claim. Which reasoning explains why the evidence leads there?",
        good:"✓ A sound argument: the claim rests on evidence, and the reasoning links them.",
        more:"There’s more than one sound argument here. Try another claim." } },
    quickCheck:{
      title:"Biotech and society quick check", summary:"Biotech and society quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which body assesses a new modified crop before it’s grown in open fields?",
          choices:[{ t:"CFIA", ok:true, fb:"Field release is the CFIA’s job." },
            { t:"Health Canada", fb:"Health Canada covers food safety; field release is the CFIA’s job." },
            { t:"Assisted Human Reproduction Act", fb:"Health Canada covers food safety; field release is the CFIA’s job." },
            { t:"Supreme Court", fb:"Health Canada covers food safety; field release is the CFIA’s job." }] },
        { id:"q2", goal:5, prompt:"Which body assesses whether food from a modified crop is safe to eat?",
          choices:[{ t:"Health Canada", ok:true, fb:"Food and drug safety is Health Canada’s role." },
            { t:"CFIA", fb:"Food and drug safety is Health Canada’s role." },
            { t:"Environment Canada weather service", fb:"Food and drug safety is Health Canada’s role." },
            { t:"Patent office", fb:"Food and drug safety is Health Canada’s role." }] },
        // VERIFY: Harvard mouse ruling (plan: verify before release).
        { id:"q3", goal:5, prompt:"In the 2002 Harvard mouse case, the Supreme Court of Canada ruled that…",
          choices:[{ t:"a higher life form, such as a whole mouse, can’t be patented", ok:true, fb:"The ruling was about patents on whole animals." },
            { t:"modified mice can be patented", fb:"The ruling was about patents on whole animals." },
            { t:"genes can’t be studied", fb:"The ruling was about patents on whole animals." },
            { t:"modified foods must be labelled", fb:"The ruling was about patents on whole animals." }] },
        { id:"q4", goal:6, prompt:"In a claim–evidence–reasoning argument, which of these is evidence?",
          choices:[{ t:"“Dry-year yield: 3.6 t/ha vs 2.4 t/ha”", ok:true, fb:"A measurement is evidence." },
            { t:"“The crop should be approved”", fb:"The first is a measurement. The others are a claim, reasoning and an opinion." },
            { t:"“Because droughts are common, dry-year yield matters”", fb:"The first is a measurement. The others are a claim, reasoning and an opinion." },
            { t:"“Many people dislike modified crops”", fb:"The first is a measurement. The others are a claim, reasoning and an opinion." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Problem → tool", summary:"Problem → tool", goal:[1, 3],
        instruction:"Eight problems. Match each one to the tool that solves it.",
        leftTitle:"Problem", rightTitle:"Tool",
        left:[
          { id:"l1", t:"Cut DNA at one specific sequence", goal:1 },
          { id:"l2", t:"Seal two DNA pieces into one molecule", goal:1 },
          { id:"l3", t:"Carry a gene into a bacterium, where it gets copied", goal:1 },
          { id:"l4", t:"Make millions of copies of one short DNA region", goal:1 },
          { id:"l5", t:"Sort DNA fragments by size", goal:1 },
          { id:"l6", t:"Read the exact order of bases", goal:1 },
          { id:"l7", t:"Change the DNA at one chosen site in a living cell", goal:1,
            hints:["Which tool works on DNA already inside a living cell?", "It uses a guide RNA to find its site.", "CRISPR-Cas9."] },
          { id:"l8", t:"Make a DNA copy of an mRNA, with no introns", goal:3,
            hints:["Which tool starts from RNA?", "It writes DNA using an RNA template, the reverse of transcription.", "Reverse transcriptase."] }
        ],
        right:[
          { id:"r1", t:"Restriction enzyme" }, { id:"r2", t:"DNA ligase" }, { id:"r3", t:"Plasmid vector" }, { id:"r4", t:"PCR" },
          { id:"r5", t:"Gel electrophoresis" }, { id:"r6", t:"DNA sequencing" }, { id:"r7", t:"CRISPR-Cas9" }, { id:"r8", t:"Reverse transcriptase" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"A restriction enzyme cuts; ligase seals.", "l2|r1":"A restriction enzyme cuts; ligase seals.",
          "l3|r4":"Both lead to copies, but PCR copies a region in a tube; a plasmid is copied inside living cells.", "l4|r3":"Both lead to copies, but PCR copies a region in a tube; a plasmid is copied inside living cells.",
          "l5|r6":"A gel tells you sizes. A one-base change keeps the size the same, so only sequencing finds it.", "l6|r5":"A gel tells you sizes. A one-base change keeps the size the same, so only sequencing finds it.",
          "l7|r1":"Both cut, but CRISPR is guided by RNA to a chosen site inside a cell; a restriction enzyme cuts wherever its sequence appears.", "l1|r7":"Both cut, but CRISPR is guided by RNA to a chosen site inside a cell; a restriction enzyme cuts wherever its sequence appears."
        },
        wrongDefault:"Ask: does this tool cut, join, carry, copy, sort, read or edit?" },
      { id:"lab", type:"mc", title:"Troubleshoot the lab", summary:"Troubleshoot the lab", goal:[1, 2, 3, 4],
        instruction:"Six lab problems. Choose the most likely cause or the best next step. Problems 4–6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        items:[
          { id:"s1", goal:2, prompt:"After transformation, no colonies grow on the selection plate, though the plate worked in other tests. Most likely cause?",
            options:[
              { t:"The cells didn’t take up the plasmid", ok:true, why:"Only cells with the plasmid can grow on the selection plate. No colonies means no cell took it up." },
              { t:"Too many cells took up the plasmid", why:"Then you’d see lots of colonies." },
              { t:"The marker gene stopped the cells growing", why:"The marker is what lets transformed cells grow. " + M6 },
              { t:"The insulin gene was too short", why:"The gene’s length doesn’t decide which cells grow; the marker gene on the plasmid does." }] },
          { id:"s2", goal:2, prompt:"Colonies grow, but a gel shows every plasmid is its original size, with no insert. What happened?",
            options:[
              { t:"The cut plasmid closed on itself without the gene", ok:true, why:"A plasmid that closes on itself still carries the marker, so the cells grow, but there’s no insert." },
              { t:"The gene went in twice", why:"Then the plasmid would be larger." },
              { t:"The bacteria removed the gene’s introns", why:"Bacteria can’t remove introns, and that wouldn’t change the plasmid’s size." },
              { t:"The gel ran backwards", why:"Then you wouldn’t see the plasmids at their expected size at all." }] },
          { id:"s3", goal:2, prompt:"<strong>Investigation:</strong> To show that the selection plate lets <strong>only</strong> transformed cells grow, which control plate should be added?",
            options:[
              { t:"Untransformed cells on a selection plate (expect no growth)", ok:true, why:"If untransformed cells can’t grow on it, the plate really does select for the plasmid." },
              { t:"Transformed cells on a selection plate", why:"That’s the test itself, not a control." },
              { t:"An empty selection plate", why:"With no cells on it, it can’t show whether the plate stops untransformed cells." },
              { t:"Transformed cells on a plain plate", why:"Useful to show the cells are alive, but it doesn’t test the plate." }] },
          { id:"s4", goal:1, star:true, prompt:"An insulin cDNA clone gives a protein missing one amino acid. A gel shows the insert is the expected size. Which check finds the cause?",
            options:[
              { t:"Sequence the insert", ok:true, why:"Sequencing reads every base, so it finds a three-base deletion that a gel can’t show." },
              { t:"Run the gel longer", why:"A three-base deletion changes the size by only 3 base pairs: invisible on a gel. Sequencing reads every base." },
              { t:"Copy the insert by PCR", why:"A three-base deletion changes the size by only 3 base pairs: invisible on a gel. Sequencing reads every base." },
              { t:"Cut with a different enzyme", why:"A three-base deletion changes the size by only 3 base pairs: invisible on a gel. Sequencing reads every base." }] },
          { id:"s5", goal:2, star:true, prompt:"A circular plasmid is cut by an enzyme that has <strong>2</strong> sites in it. How many fragments form?",
            options:[
              { t:"2", ok:true, why:"In a ring, 2 cuts leave 2 arcs: 2 fragments." },
              { t:"3", why:"3 is the answer for a straight (linear) piece of DNA. In a ring, each cut adds one end-pair, so 2 cuts make 2 pieces." },
              { t:"1", why:"One cut opens the ring into 1 piece; the second cut splits it again." },
              { t:"4", why:"Count the arcs between the cuts: there are 2." }],
            hints:["Draw a circle and mark 2 cuts.", "Count the arcs between cuts.", "2 arcs: 2 fragments."] },
          { id:"s6", goal:3, star:true, prompt:"A human protein only works if sugar groups are attached after translation, which bacteria can’t do. Which host is best?",
            options:[
              { t:"Cultured eukaryotic cells (yeast or mammalian)", ok:true, why:"Eukaryotic cells can attach sugar groups to proteins after translation." },
              { t:"<em>E. coli</em>, since it grows fastest", why:"Fast growth doesn’t help if the protein can’t be finished." },
              { t:"Any bacterium, if it’s given cDNA", why:"cDNA solves the intron problem, not the sugar groups." },
              { t:"No living host can make it", why:"Eukaryotic cells can add sugar groups after translation." }],
            hints:["Which cells can add sugar groups to proteins?", "Eukaryotic cells modify proteins after translation.", "Yeast or mammalian cells in culture."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Raina", how:"",
        instruction:"Raina made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Plan how to get bacteria to make human insulin.",
            steps:["Collect insulin mRNA from pancreas cells that make insulin.", "Use DNA ligase to copy the mRNA into DNA.", "Cut the DNA copy and a plasmid with the same restriction enzyme.", "Seal them with DNA ligase.", "Put the plasmid into bacteria and grow them on a selection plate."],
            answer:1,
            stepFb:["Step 1 is correct: these cells have lots of insulin mRNA. Keep checking.", "", "Step 3 is a good step. The mistake is earlier.", "Step 4 is correct.", "Step 5 is correct."],
            fixes:[
              { t:"Use reverse transcriptase to make cDNA from the mRNA.", ok:true, why:"Reverse transcriptase writes DNA from an RNA template, giving cDNA with the exons only." },
              { t:"Use a restriction enzyme to copy the mRNA.", why:"Restriction enzymes cut DNA." },
              { t:"Use DNA polymerase to turn the mRNA straight into protein.", why:"Polymerase makes nucleic acids, not protein." },
              { t:"Step 2 is correct.", why:"Ligase seals gaps; it can’t copy a template." }],
            hints:["Which enzyme writes DNA using an RNA template?", "The “reverse” of transcription.", "Reverse transcriptase."] },
          { id:"e2", goal:2, task:"Explain how the recombinant plasmid forms.",
            steps:["The plasmid is cut with enzyme E, which leaves 5′-AATT overhangs.", "The insulin cDNA is cut with enzyme H, which leaves 5′-AGCT overhangs.", "The sticky ends pair by complementary base pairing.", "Ligase seals the sugar–phosphate backbone."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is true in general, but it can’t happen with these ends. The mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"Cut the cDNA with enzyme E too, so both pieces have 5′-AATT overhangs that pair.", ok:true, why:M2 },
              { t:"Any sticky ends pair, so step 2 is fine.", why:"AATT and AGCT aren’t complementary." },
              { t:"Use ligase in step 2 instead of enzyme H.", why:"Ligase doesn’t cut." },
              { t:"Cut the plasmid with H and the cDNA with E.", why:"Swapping still leaves unmatched ends." }],
            hints:["Do the two overhangs pair?", "Line up AATT against AGCT: most bases don’t match.", "Use the same enzyme on both."] },
          { id:"e3", goal:6, task:"Raina’s argument about a drought-tolerant wheat.",
            steps:["Claim: the variety should go to field trials in Saskatchewan.", "Evidence: in greenhouse tests it kept 80% of its yield with half the water; standard wheat kept 50%.", "Reasoning: so it will be safe for every ecosystem in Canada.", "Conclusion: approve it with no further review."],
            answer:2,
            stepFb:["Step 1 is a reasonable claim. Keep checking.", "Step 2 is relevant evidence.", "", "Step 4 follows from step 3, so fix step 3 first."],
            fixes:[
              { t:"Reasoning: better yield with less water matters in dry years, but yield data say nothing about environmental effects, so field trials should test those next.", ok:true, why:"The reasoning stays within what the evidence shows." },
              { t:"Remove the evidence; the claim is enough.", why:"An argument needs evidence." },
              { t:"Reasoning: all modified crops are risky, so reject it.", why:"That ignores this crop’s data." },
              { t:"Step 3 is correct.", why:"Yield data can’t show ecosystem safety." }],
            hints:["What do the greenhouse numbers actually measure?", "Yield, not effects on other species.", "Keep the reasoning within what the evidence shows."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the route builder: that the intron problem stayed hidden until the end, or something else?" },
      { id:"j2", q:"In your own words, why must the plasmid and the gene be cut with the same enzyme?" },
      { id:"j3", q:"Explain to a friend why bacteria need cDNA but a rice plant doesn’t." },
      { id:"j4", q:"Pick a biotechnology product you’ve heard of. What evidence would you want before deciding whether it should be used, and what are you still unsure about?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which tool seals two DNA fragments together by joining their sugar–phosphate backbones?", options:[
          { t:"DNA ligase", ok:true, why:"Ligase seals the backbone gaps between pieces." },
          { t:"A restriction enzyme", why:"Restriction enzymes cut DNA." },
          { t:"DNA polymerase", why:"Polymerase builds a new strand from a template." },
          { t:"Helicase", why:"Helicase unzips the double helix." }] },
        b:{ prompt:"Which tool cuts DNA wherever one specific base sequence appears?", options:[
          { t:"A restriction enzyme", ok:true, why:"Each restriction enzyme cuts at its own recognition sequence." },
          { t:"DNA ligase", why:"Ligase seals." },
          { t:"Reverse transcriptase", why:"It makes DNA from RNA." },
          { t:"Gel electrophoresis", why:"A gel sorts fragments; it doesn’t cut." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In genetic engineering, what is a vector?", options:[
          { t:"A DNA molecule, such as a plasmid, that carries a gene into a host cell, where it is copied", ok:true, why:"The vector is the carrier; the host is the cell that receives it." },
          { t:"The organism that receives the new gene", why:"That’s the host." },
          { t:"The enzyme that cuts the DNA", why:"That’s a restriction enzyme." },
          { t:"The protein the new gene codes for", why:"That’s the product." }] },
        b:{ prompt:"In genetic engineering, what is transformation?", options:[
          { t:"A cell taking up foreign DNA, such as a recombinant plasmid", ok:true, why:"Transformation adds DNA from outside the cell." },
          { t:"A mutation that changes a gene’s sequence", why:"Transformation adds DNA from outside." },
          { t:"A cell dividing into two identical cells", why:"That’s cell division, not taking up DNA." },
          { t:"Turning mRNA into protein", why:"That’s translation." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which is an example of <strong>gene</strong> cloning rather than reproductive cloning?", options:[
          { t:"Bacteria copying a recombinant plasmid that carries the human insulin gene as they divide", ok:true, why:"Many copies of one gene are made: that’s gene cloning." },
          { t:"Producing a sheep genetically identical to an adult donor by nuclear transfer", why:"That copies a whole organism." },
          { t:"Growing a new plant from a cutting", why:"That copies a whole plant." },
          { t:"Identical twins forming from one embryo", why:"Natural clones of a whole organism." }] },
        b:{ prompt:"Which is an example of reproductive cloning?", options:[
          { t:"Making a calf with the same nuclear DNA as an adult cow, by moving a body-cell nucleus into an egg cell whose nucleus was removed", ok:true, why:"A whole organism is copied from a donor." },
          { t:"Copying one gene many times by PCR", why:"That’s copying a gene." },
          { t:"Bacteria copying a plasmid as they divide", why:"That’s gene cloning." },
          { t:"Inserting a GFP gene into bacteria", why:"That’s genetic modification, not copying an organism." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A team inserts a human gene copied straight from chromosome DNA into a plasmid and transforms <em>E. coli</em>. The bacteria make a protein, but it doesn’t work. What is the most likely reason?", options:[
          { t:"The gene still has its introns; bacteria can’t remove them, so the protein has wrong amino acids or stops early", ok:true, why:M1 },
          { t:"Bacteria use a different genetic code and misread every codon", why:"The code is nearly universal." },
          { t:"The plasmid was never taken up", why:"Then there would be no human protein at all." },
          { t:"Ligase changed the gene’s sequence when it sealed it", why:"Ligase only seals the backbone." }] },
        b:{ prompt:"A team wants <em>E. coli</em> to make a working human enzyme. Which starting material should they use for the gene?", options:[
          { t:"cDNA made from the enzyme’s mature mRNA by reverse transcriptase", ok:true, why:M1 },
          { t:"The gene cut straight from human chromosome DNA", why:"It still contains introns." },
          { t:"The pre-mRNA from the nucleus, copied into DNA before splicing", why:"Pre-mRNA still has its introns." },
          { t:"A version of the gene with bases changed so bacteria can read it", why:"Bacteria already read human codons." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"A plasmid is cut with enzyme P, which leaves 5′-AATT overhangs. A gene is cut with enzyme Q, which leaves 5′-AGCT overhangs. A student mixes them with DNA ligase. What is the most likely result?", options:[
          { t:"Few or no recombinant plasmids: the overhangs aren’t complementary, so the pieces can’t pair before ligase seals them", ok:true, why:M2 },
          { t:"Recombinant plasmids form normally, because ligase joins any two ends", why:M2 },
          { t:"The gene goes in, but backwards, because the ends differ", why:"Unmatched ends don’t pair either way round." },
          { t:"Enzyme P trims Q’s overhangs until they match", why:"Each enzyme cuts only at its own sequence." }] },
        b:{ prompt:"A plasmid is cut with enzyme R, which leaves 5′-GATC overhangs. Which gene preparation will join it?", options:[
          { t:"A gene cut with an enzyme that also leaves 5′-GATC overhangs", ok:true, why:M2 },
          { t:"A gene cut with an enzyme that leaves 5′-AATT overhangs", why:"AATT doesn’t pair with GATC." },
          { t:"A gene with no overhangs, since blunt ends pair best", why:"Blunt ends have no bases to pair." },
          { t:"Any gene, since ligase makes the overhangs match", why:"Ligase doesn’t change bases." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"Investigators recover a tiny amount of DNA at a crime scene and want to compare it with a suspect’s DNA. Which order of tools makes sense?", options:[
          { t:"PCR to copy specific regions many times, then gel electrophoresis to compare fragment sizes", ok:true, why:"PCR makes enough DNA to see; the gel then compares the sizes." },
          { t:"Gel electrophoresis first, then PCR on the bands", why:"With so little DNA, there’s nothing to see on a gel yet." },
          { t:"Ligase to join the fragments into one strand, then sequencing", why:"Joining unrelated pieces destroys the information." },
          { t:"Transform bacteria with the crime-scene DNA, then compare their proteins", why:"That’s for making products, not for comparing people." }] },
        b:{ prompt:"A lab compares a child’s DNA with two possible parents at several regions that vary in length between people. Which pair of tools does it need?", options:[
          { t:"PCR to copy those regions, then gel electrophoresis to compare their lengths", ok:true, why:"PCR copies the regions; the gel compares their lengths." },
          { t:"Restriction enzymes, then ligase", why:"That’s for building recombinant DNA." },
          { t:"Reverse transcriptase, then PCR", why:"No mRNA is needed to compare DNA." },
          { t:"CRISPR-Cas9, then sequencing", why:"Editing isn’t comparing." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why insulin-making bacteria are given a cDNA copy of the human insulin gene?", options:[
          { t:"“Bacteria can’t remove introns. cDNA is made from mature mRNA, so it contains only the exons, and the bacteria can translate it into the correct amino acid sequence.”", ok:true, why:"It names the problem (introns), where cDNA comes from, and why that fixes it." },
          { t:"“Bacteria use different codons, and cDNA translates the code for them.”", why:M4 },
          { t:"“cDNA is smaller, so it fits into the plasmid more easily.”", why:"Size isn’t the reason; the introns are." },
          { t:"“cDNA can’t be switched off, so the bacteria always make insulin.”", why:"Control isn’t the point; the introns are." }] },
        b:{ prompt:"Which is the best explanation of why the same restriction enzyme is used to cut both the plasmid and the gene?", options:[
          { t:"“It leaves matching sticky ends on both, so their unpaired bases can pair; ligase then seals the backbone, making one recombinant molecule.”", ok:true, why:"It links the matching ends, the pairing, and ligase’s sealing." },
          { t:"“The same enzyme glues the pieces together after cutting them.”", why:M3 },
          { t:"“Different enzymes would destroy the gene.”", why:"Different enzymes cut fine; their ends just don’t match." },
          { t:"“It’s cheaper, and ligase can join any ends anyway.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"A town debates planting a drought-tolerant wheat variety (a fictional case). Which response best uses evidence and reasoning?", options:[
          { t:"“In three dry seasons of trials, the variety out-yielded standard wheat, and it passed a food-safety assessment. Because drought is a main risk to Prairie farms, the evidence supports planting it, while its environmental effects continue to be monitored.”", ok:true, why:"It gives data, links them to the claim, and names what still needs watching." },
          { t:"“All genetically modified crops are unsafe, so it should be banned.”", why:M7 },
          { t:"“Scientists made it, so it must be safe to plant everywhere.”", why:M7 },
          { t:"“It’s drought tolerant, so it’s better.”", why:"A claim with no data and no reasoning." }] },
        b:{ prompt:"A class debates a rice variety engineered to make beta-carotene (a vitamin A precursor) in its grain. Which response best uses evidence and reasoning?", options:[
          { t:"“Studies in the case file show the body converts the grain’s beta-carotene to vitamin A. Where many children lack vitamin A, adding it to a staple food could reduce the deficiency, so the rice is worth growing alongside other programs such as supplements.”", ok:true, why:"It gives evidence, reasons from it, and keeps the claim within what the evidence supports." },
          { t:"“Yellow rice looks unnatural, so people should refuse it.”", why:"Looks aren’t evidence." },
          { t:"“Every modified food is unsafe.”", why:M7 },
          { t:"“It adds a vitamin, so no other programs are needed.”", why:"The evidence supports helping, not replacing every other program." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A company wants to sell a new canola variety with a genetically engineered trait in Canada, both as a crop to grow and as cooking oil. Which bodies assess it?", options:[
          { t:"The CFIA (growing it in fields and using it as livestock feed) and Health Canada (food safety)", ok:true, why:M8 },
          { t:"Health Canada alone, because the oil is a food", why:"Growing it in open fields is assessed by the CFIA." },
          { t:"The CFIA alone, because canola is a plant", why:"Food safety is Health Canada’s job." },
          { t:"No review is needed, because canola was first bred in Canada", why:"Each new trait is assessed." }] },
        // VERIFY: Assisted Human Reproduction Act prohibition on heritable genome changes (plan: verify before release).
        b:{ prompt:"A clinic proposes to change the DNA of human embryos so that the change would pass to future generations. What does Canadian law say?", options:[
          { t:"The Assisted Human Reproduction Act prohibits changing a human cell or embryo’s genome in a way that can be passed on to descendants", ok:true, why:"The Act sets limits on human cloning and heritable changes." },
          { t:"It’s allowed if Health Canada approves it as a drug", why:M8 },
          { t:"The CFIA regulates it, because it’s a modified organism", why:"The CFIA covers crops and feed, not human embryos." },
          { t:"No Canadian law covers it", why:M8 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Researchers join the gene for green fluorescent protein (GFP) to a gene they’re studying, so cells glow wherever that gene is being expressed. What is GFP being used as?", options:[
          { t:"A reporter that makes the gene’s activity visible", ok:true, why:"The glow reports where and when the gene is on." },
          { t:"A restriction enzyme that marks where to cut", why:M3 },
          { t:"A vector that carries the gene into cells", why:M3 },
          { t:"A clone of the jellyfish the gene came from", why:M5 }] },
        b:{ prompt:"A plant breeder inserts a gene for a protein that helps cells survive ice crystals during frost. How is this best described?", options:[
          { t:"Genetic modification in agriculture: a new trait from inserted DNA", ok:true, why:"Inserting a gene to give a crop a new trait is genetic modification." },
          { t:"Reproductive cloning of the plant", why:M5 },
          { t:"Selective breeding", why:"Selective breeding chooses parents; it doesn’t insert a gene." },
          { t:"Gene therapy", why:"Gene therapy treats a person’s cells; this changes a crop." }] } }
    ]
  },
  task:{
    title:"Pick your production line", summary:"Pick your production line",
    statement:"<p>Plan a production line that makes working human insulin, and lets you confirm the inserted gene before you scale up. Can you find all the answers?</p>" +
      '<ol class="bt-conds"><li>The host can be grown in a fermentation tank.</li><li>The gene has no introns to remove.</li><li>The gene and vector ends will join.</li><li>Transformed cells can be picked out.</li><li>The insert is checked before scale-up.</li></ol>',
    inputs:{ host:"Host", gene:"Gene source", cut:"Cutting plan", vec:"Vector", chk:"Check" },
    checks:["Grows in a tank", "No introns", "Ends will join", "Transformed cells can be picked out", "Insert checked"],
    tips:["A rice plant grows in a field, not a tank.", "Bacteria can’t remove introns, and yeast cells don’t reliably remove human introns. Start from mRNA.", "Sticky ends pair only if they match: use the same enzyme on both.", "Only a few cells take up the plasmid. A marker gene lets only those grow on the selection plate.", "Check the insert first, by its size (gel) or its exact bases (sequencing)."],
    success:"Your production line works!",
    explainPrompt:"Explain why every answer must use cDNA and the same enzyme, and what your choice of check can and can’t tell you.",
    vocab:"Use the words cDNA, intron, sticky ends, marker gene and transformation.",
    // VERIFY: both bacteria and yeast are used to make insulin commercially (plan: verify before release).
    after3:"Both bacteria and yeast are used to make insulin commercially. Sequencing is the stronger check, because a one-base change keeps the insert the same size on a gel.",
    afterAt:4
  },
  cards:[
    ["Biotechnology", "Using living things or their molecules to make products or solve problems."],
    ["Recombinant DNA", "DNA that combines pieces from two sources, e.g. a human gene in a bacterial plasmid."],
    ["Restriction enzyme", "Cuts DNA at one specific sequence, often leaving sticky ends."],
    ["DNA ligase", "Seals DNA pieces by joining their sugar–phosphate backbones."],
    ["Vector", "DNA (often a plasmid) that carries a gene into a host cell, where it’s copied."],
    ["Transformation", "A cell taking up foreign DNA."],
    ["Marker gene", "A gene on the plasmid that lets only transformed cells grow on the selection plate."],
    ["cDNA", "DNA copied from mature mRNA by reverse transcriptase: exons only, so bacteria can use it."],
    ["Gene cloning vs reproductive cloning", "Copying a gene vs making a whole organism genetically identical to a donor."],
    ["Reporter gene", "A gene such as GFP that makes another gene’s activity visible."],
    ["Who checks it in Canada?", "Health Canada: food and drug safety. CFIA: crops in fields and livestock feed. AHRA: limits on human cloning and heritable changes."],
    ["Judging a biotech case", "Claim + evidence + reasoning, case by case: what does it do, what do the data show, what are the risks?"]
  ]
};
