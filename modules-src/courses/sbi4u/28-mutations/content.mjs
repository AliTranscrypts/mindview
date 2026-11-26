// SBI4U 28 Mutations. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/28-mutations.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Most amino acids have several codons. A change in the third base often keeps the same amino acid: a silent mutation.";
const M2 = "Three bases is one whole codon. The frame after it is restored; one amino acid is added or lost (sometimes two neighbours merge).";
const M3 = "Removing one base shifts every codon after it, so all the downstream amino acids change, often with an early stop.";
const M4 = "Many are neutral, some are harmful, and a few help, depending on the environment.";
const M5 = "Only mutations in egg or sperm cells (germ-line) pass to children. A sunburned skin cell’s mutation stays in that person.";
const M6 = "The coding strand GAG → GTG means the mRNA codon GAG → GUG. RNA has U.";
const M7 = "UV’s main damage is thymine dimers. Strand breaks are the signature of ionizing radiation like X-rays.";
// sequences in the monospace font (course plan §2)
const sq = s => '<span class="mu-sq">' + s + "</span>";
const GENE = sq("5′-ATG CCA GAG TGG AAA TGC TAA-3′");

export default {
  id:"28-mutations",
  kind:"topic",
  title:"Mutations",
  topic:"Mutations",
  readyTopic:"mutations",
  hero:{
    eq:'<span class="mu-sq">5′-ATG CCA G<b class="mu-heqb">A</b>G TGG AAA TGC TAA-3′</span><span class="mu-heqp">Met–Pro–Glu–Trp–Lys–Cys</span>',
    eqLabel:"Coding strand 5′ ATG CCA GAG TGG AAA TGC TAA 3′, coding Met, Pro, Glu, Trp, Lys, Cys. The A in GAG is highlighted: change me.",
    eqSize:"sm",
    headline:"One letter, three outcomes",
    text:"Change one base in a gene and the protein might not change at all (<strong>silent</strong>), might get one different amino acid (<strong>missense</strong>), or might stop short (<strong>nonsense</strong>). Add or remove a base and the whole reading <strong>frame</strong> can shift. <strong>Mutagens</strong> such as UV light, X-rays and some chemicals make these changes more likely.",
    fig:{ html:'<div class="mu-hero" id="mu-hero" role="img" aria-label="The gene ATG CCA GAG TGG AAA TGC TAA sits above its protein, Met–Pro–Glu–Trp–Lys–Cys. First the A of GAG flips to T: the codon becomes GTG and Glu becomes Val, a missense change. Then an extra A drops in after ATG: the codon dividers slide one place and every amino acid after Met changes. Last, UV light joins two neighbouring thymines into a dimer, and a repair enzyme cuts it out and the gap is refilled."></div>' }
  },
  goals:[
    "I can classify point mutations as silent, missense or nonsense, and insertions or deletions as frameshift or in-frame.",
    "I can predict the protein made from a mutated DNA sequence using the codon table.",
    "I can explain how UV light, ionizing radiation and chemical mutagens change DNA, and how repair can undo some damage.",
    "I can work backwards from a changed protein to the DNA change that caused it.",
    "I can describe chromosomal mutations and the difference between germ-line and somatic mutations.",
    "I can apply mutations to real cases (sickle-cell anemia, cystic fibrosis) and evaluate mutagen-testing data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Decoding", goal:2,
          prompt:"The coding strand reads " + sq("5′-ATG TGG-3′") + ". What are the first two amino acids?",
          options:[
            { t:"Met–Trp", ok:true, why:"mRNA " + sq("AUG UGG") + "." },
            { t:"Tyr–Thr", why:"That treats the template as the message." },
            { t:"Met–Cys", why:"UGG is Trp; Cys is UGU or UGC." },
            { t:"Met–stop", why:"UGA is the stop; UGG is Trp." }],
          hints:["The mRNA matches the coding strand with U for T.", sq("AUG UGG") + ".", "Met–Trp."] },
        { id:"w2", skill:"Decoding", goal:2,
          prompt:"How many codons code for glutamic acid (Glu)?",
          options:[
            { t:"2 (GAA and GAG)", ok:true, why:"GAA and GAG both code Glu." },
            { t:"1", why:"There are two." },
            { t:"4", why:"GAU and GAC are Asp." },
            { t:"6", why:"Six is for Leu, Ser or Arg." }],
          hints:["Find the GA_ box.", "It’s split between Asp and Glu.", "GAA, GAG."] },
        { id:"w3", skill:"Reading frames", goal:1,
          prompt:"Why does the ribosome read mRNA in groups of three?",
          options:[
            { t:"Each codon is three bases, and reading starts at AUG, which sets the frame", ok:true, why:"Three-base codons, read in order from AUG." },
            { t:"Each base codes one amino acid", why:"Then there’d be only 4 amino acids." },
            { t:"The ribosome reads any three bases it likes", why:"The frame is fixed by the start codon." },
            { t:"Because mRNA has three strands", why:"mRNA is single-stranded." }],
          hints:["How many bases are in a codon?", "Where does reading begin?", "Three-base codons from AUG."] },
        { id:"w4", skill:"Reading frames", goal:1,
          prompt:"THE CAT ATE THE RAT. Remove the first E. Reading in threes from the start, what do you get?",
          options:[
            { t:"THC ATA TET HER AT", ok:true, why:"Every word after the change is scrambled: a frameshift." },
            { t:"TH CAT ATE THE RAT", why:"Reading in threes doesn’t skip the gap." },
            { t:"THE CAT ATE THE RAT", why:"Something was removed." },
            { t:"HEC ATA TET HER AT", why:"The first letter is still T." }],
          hints:["Write the letters without the E.", "THCATATETHERAT.", "Group in threes: THC ATA TET HER AT."] },
        { id:"w5", skill:"DNA repair", goal:3,
          prompt:"What does DNA polymerase’s proofreading do?",
          options:[
            { t:"Removes a wrongly paired nucleotide right after adding it, then adds the correct one", ok:true, why:"It steps back, removes the mismatch and replaces it." },
            { t:"Reads the mRNA for errors", why:"Proofreading happens during DNA replication." },
            { t:"Cuts out whole genes with errors", why:"It fixes single nucleotides." },
            { t:"Prevents all mutations", why:"Some errors slip through." }],
          hints:["Recall module 22.", "Polymerase can step back one nucleotide.", "It removes and replaces a mismatch."] },
        { id:"w6", skill:"DNA repair", goal:3,
          prompt:"After proofreading and repair, about how often does an uncorrected error remain when DNA is copied?",
          options:[
            { t:"Roughly 1 in a billion bases", ok:true, why:"Rare, but a human genome has about 6 billion bases, so a few new changes per cell division." },
            { t:"1 in 10 bases", why:"That would be far too many errors." },
            { t:"Never", why:"Some errors always escape." },
            { t:"1 in 1000 bases", why:"Repair brings it much lower than that." }],
          hints:["Is copying perfect?", "Very close to perfect.", "About 1 in 10⁹."] }
      ],
      refreshers:{
        "Decoding":"mRNA = coding strand with U for T. Read from AUG in threes using the codon table. Most amino acids have more than one codon.",
        "Reading frames":"The start codon sets the frame. Adding or removing bases that aren’t a multiple of three shifts every later codon.",
        "DNA repair":"DNA polymerase proofreads as it copies; other enzymes fix mismatches and cut out damaged stretches (like UV dimers). Very few errors remain, about 1 in a billion bases."
      }
    }
  },
  explore:{
    heading:"Mutation lab",
    intro:"Edit the gene and watch the mRNA and protein update. Name each mutation by what it does.",
    gene:"ATGCCAGAGTGGAAATGCTAA",
    maxEdits:3,
    editHow:"Tap a base (or move with the arrow keys and press Enter), then choose what to do with it. You can make up to 3 edits at a time.",
    // Mode 2: chromosome bands (plan)
    chromo:{ c1:"ABCDEFGH", c2:"MNOP",
      how:"Tap one band, or tap two bands to select a segment, then choose a mutation. For a translocation, also tap a band on the second chromosome: the two end pieces swap from there." },
    // Mode 3: mutagen cards (plan)
    mutagens:[
      { id:"uv", t:"UV light", fix:"Excision repair cuts out the damaged stretch, and DNA polymerase and ligase fill the gap.",
        caps:["UV light hits two neighbouring thymines (T T) on one strand.", "The thymines bond to each other: a thymine dimer. The helix kinks.", "Excision repair cuts out the stretch with the dimer.", "The gap is refilled with the right bases. If the dimer is missed, replication can put in a wrong base."] },
      { id:"ion", t:"Ionizing radiation (X-rays, gamma rays, radon’s radiation)", fix:"Break repair joins the broken ends, but sometimes loses or adds bases.",
        caps:["High-energy radiation passes through the DNA.", "It breaks one or both strands of the backbone.", "Break repair joins the ends back together…", "…but a base pair was lost at the join: a deletion."] },
      { id:"chem", t:"Chemical mutagens", fix:"Mismatch repair and excision repair fix many altered bases; the ones missed become mutations at the next replication.",
        caps:["A base-altering chemical changes a G, so it now pairs with T instead of C.", "At the next replication the altered G gets T as its partner: a substitution.", "An intercalating chemical slips between two base pairs.", "Copying past it adds an extra base: an insertion (or a deletion). Benzo[a]pyrene from tobacco smoke is a real example."] }
    ],
    predIntro:"Make a prediction first. Then the lab will make the change and show you what happens.",
    predictions:[
      { id:"p1", prompt:"The normal gene. Change base 6, A → G (CCA → CCG). What happens to the protein?",
        options:[{ t:"No change", ok:true }, { t:"Pro becomes another amino acid" }, { t:"The protein stops after Met" }, { t:"Every amino acid after Met changes" }],
        explain:"CCA and CCG both code Pro: a silent mutation." },
      { id:"p2", prompt:"The normal gene. Change base 13, A → T (AAA → TAA). How long is the protein now?",
        options:[{ t:"4 amino acids", ok:true }, { t:"6" }, { t:"5" }, { t:"0" }],
        explain:"TAA is a stop codon: a nonsense mutation cuts the protein short." },
      { id:"p3", prompt:"The normal gene. Insert an A after base 3 (just after ATG). What happens to the protein?",
        options:[{ t:"Every amino acid after Met changes, and the original stop is no longer in frame", ok:true }, { t:"One extra amino acid is added" }, { t:"Nothing: one base is too small to matter" }, { t:"The protein stops after Met" }],
        explain:"Adding one base shifts every later codon: a frameshift. " + M3 },
      { id:"p4", prompt:"The normal gene. Delete bases 7–9 (GAG). What happens?",
        options:[{ t:"Glu is missing; the rest is unchanged", ok:true }, { t:"Every amino acid after Pro changes" }, { t:"The protein stops early" }, { t:"Nothing changes" }],
        explain:"Three bases is one codon: the frame is kept, and one amino acid is lost." }
    ],
    chalIntro:"Edit the gene to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"With one substitution, turn Glu into Val.",
        why:"Base 8, A → T: GAG becomes GTG, and GUG codes Val. That’s the sickle-cell change.",
        general:"Make exactly one substitution in codon 3 (GAG) so that it codes Val.",
        msgs:{ stop:"That’s a stop codon: nonsense.", third:"GAA keeps Glu, and GAC or GAT give Asp.", one:"Use exactly one substitution (Undo or Reset the other edits)." },
        hints:["Which codons are Val?", "GTN. Which single change turns GAG into GT_?", "Change the middle A to T."] },
      { id:"tc2", goal:[1, 2], prompt:"With one substitution, end the protein after exactly three amino acids (Met–Pro–Glu).",
        why:"TGG → TAG (base 11 G → A) or TGG → TGA (base 12 G → A): codon 4 becomes a stop.",
        general:"Make exactly one substitution that turns codon 4 into a stop codon.",
        msgs:{ c5:"That keeps Trp; the stop must replace codon 4.", taa:"TAA would need two changes.", one:"Use exactly one substitution (Undo or Reset the other edits)." },
        hints:["Codon 4 (TGG) must become a stop.", "Stops are TAA, TAG, TGA. Which differ from TGG by one base?", "TAG or TGA."] },
      { id:"tc3", goal:[1, 4], stretch:true, prompt:"A frameshift can be cancelled by a second frameshift. Make <strong>one insertion and one deletion</strong> so that only amino acids 2 and/or 3 differ, and Trp–Lys–Cys at the end are back to normal.",
        why:"The frame was wrong only between your two edits. In 1961, Crick and Brenner used exactly this kind of double mutation in a virus to show that the code is read in triplets.",
        general:"Make exactly one insertion and one deletion, both inside codons 2 and 3.",
        msgs:{ far:"The frame is shifted for too long; Trp or Lys changes too.", twoIns:"Two extra bases leave the frame shifted by two.", twoDel:"Two missing bases leave the frame shifted by two.", stop:"The shifted frame hit a stop before you restored it.", same:"Amino acids 2 and 3 are still Pro–Glu: make the shifted stretch change at least one of them.", need:"Make exactly one insertion and one deletion (no substitutions)." },
        hints:["The frame is wrong only between the two edits.", "Keep both edits inside codons 2 and 3 (bases 4–9).", "Try inserting just after ATG and deleting a base in GAG."] }
    ]
  },
  part3:{
    slug:"cases", name:"Real cases", heading:"Mutations with consequences",
    intro:"Explore works on a toy gene. These four stations connect each type of mutation to real people and real data, and show how scientists test whether a chemical is a mutagen.",
    stations:[
      { id:"s1", n:1, t:"Sickle-cell anemia",
        text:"The β-globin gene, codon 6: one base changes.",
        rows:[["Coding DNA", "GAG", "GTG"], ["mRNA", "GAG", "GUG"], ["Amino acid", "Glu", "Val"]],
        how:"Choose the hemoglobin and the oxygen level, and watch the red blood cell.",
        caps:{ nn:"Normal hemoglobin, normal oxygen: molecules stay separate; the cell is a flexible disc.", nl:"Normal hemoglobin, low oxygen: molecules still stay separate; the cell keeps its shape.", sn:"Sickle hemoglobin (Val), normal oxygen: molecules mostly stay separate.", sl:"Sickle hemoglobin, low oxygen: the Val patches stick molecules together into long fibres that bend the cell into a sickle. Sickled cells can block small blood vessels." },
        side:"People with one copy of the sickle-cell allele are largely protected against severe malaria, which is why the allele is common where malaria is." },
      { id:"s2", n:2, t:"Cystic fibrosis",
        text:"The CFTR gene makes a chloride channel in the cell membrane. The most common mutation deletes three bases, removing one phenylalanine (Phe): an in-frame deletion.",
        how:"Switch between the normal and the mutant protein.",
        caps:{ n:"Normal CFTR folds correctly, reaches the cell membrane and lets Cl⁻ out of the cell.", m:"Missing one Phe, the protein misfolds; most of it is broken down and never reaches the membrane. Without the channel, the mucus in the lungs thickens." },
        note:"The CFTR gene was identified in 1989 by a team led by Lap-Chee Tsui at the Hospital for Sick Children in Toronto, with collaborators." },
      { id:"s3", n:3, t:"A helpful mutation: CCR5-Δ32",
        text:"CCR5-Δ32 deletes 32 bases from the CCR5 gene. 32 isn’t a multiple of 3, so it’s a frameshift. People with two copies make no working CCR5 receptor, which many HIV strains use to enter cells.",
        ask:"Is this mutation helpful, harmful or neutral?",
        choices:[
          { t:"It depends", ok:true, fb:"It depends: helpful against those HIV strains, and mostly neutral otherwise. " + M4 },
          { t:"Helpful", fb:"Only against the HIV strains that use CCR5; otherwise it’s mostly neutral. " + M4 },
          { t:"Harmful", fb:"It’s a frameshift, but losing CCR5 does little harm, and it blocks those HIV strains. " + M4 },
          { t:"Neutral", fb:"Not against HIV strains that use CCR5: there it helps. " + M4 }] },
      { id:"s4", n:4, t:"Check it with data: the Ames test",
        text:"Bacteria that can’t make histidine are spread on plates with no histidine. Only cells that mutate back to histidine-making can grow into colonies. More colonies than the control means the chemical causes mutations. Some chemicals become mutagenic only after liver enzymes process them, so plates are also run with a liver extract.",
        plates:[["ctl", "Control (solvent only)", 24], ["p", "Chemical P", 26], ["q", "Chemical Q", 310], ["r", "Chemical R", 22], ["rl", "Chemical R + liver extract", 240]],
        how:"For each chemical, choose a claim and the evidence that supports it, then press Check.",
        claims:[{ id:"no", t:"Not mutagenic" }, { id:"yes", t:"Mutagenic" }, { id:"liver", t:"Mutagenic after processing by the body" }],
        evidence:[{ id:"e26", t:"26 colonies vs the control’s 24" }, { id:"e310", t:"310 colonies vs the control’s 24" }, { id:"e240", t:"22 colonies alone (control 24), but 240 with liver extract" }],
        chems:[
          { id:"p", t:"Chemical P", answer:"no|e26", fb:{ yes:"26 vs 24 is within normal variation: no more mutations than the control.", liver:"P wasn’t tested with liver extract, and alone it matches the control." } },
          { id:"q", t:"Chemical Q", answer:"yes|e310", fb:{ no:"310 is far more than the control’s 24.", liver:"Q is mutagenic on its own, without liver extract." } },
          { id:"r", t:"Chemical R", answer:"liver|e240", fb:{ no:"Alone, yes, but with liver extract it gave 240 colonies.", yes:"Alone, R gave 22 colonies, no more than the control. It needed the liver extract." } }],
        evWrong:"Choose the plate counts for this chemical, compared with the control.",
        reason:"Reasoning: the control shows how many back-mutations happen anyway (24). Only a count well above it means the chemical caused extra mutations." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Real cases quick check",
      items:[
        { id:"q1", goal:6, prompt:"Sickle-cell: what type of mutation?",
          choices:[{ t:"Missense", ok:true, fb:"One base, one amino acid changed (Glu → Val)." }, { t:"Silent", fb:"One base, one amino acid changed (Glu → Val)." },
            { t:"Nonsense", fb:"One base, one amino acid changed (Glu → Val)." }, { t:"Frameshift", fb:"One base, one amino acid changed (Glu → Val)." }] },
        { id:"q2", goal:1, prompt:"The common cystic fibrosis mutation removes 3 bases. Why isn’t it a frameshift?",
          choices:[{ t:"3 bases is one codon", ok:true, fb:"The frame is kept; one amino acid is lost." }, { t:"It’s a substitution", fb:"The frame is kept; one amino acid is lost. " + M2 },
            { t:"It’s in an intron", fb:"The frame is kept; one amino acid is lost. " + M2 }, { t:"Frameshifts need 32 bases", fb:"The frame is kept; one amino acid is lost. " + M2 }] },
        { id:"q3", goal:6, prompt:"In the Ames data, why is the control plate needed?",
          choices:[{ t:"It shows how many mutations happen anyway", ok:true, fb:"About 24 colonies grow even without a chemical." }, { t:"It kills the bacteria", fb:"About 24 colonies grow even without a chemical." },
            { t:"It adds histidine", fb:"About 24 colonies grow even without a chemical." }, { t:"It isn’t needed", fb:"About 24 colonies grow even without a chemical." }] },
        { id:"q4", goal:6, prompt:"Which chemical needed the liver extract to show its effect?",
          choices:[{ t:"R", ok:true, fb:"R gave 22 colonies alone but 240 with the extract." }, { t:"P", fb:"R gave 22 colonies alone but 240 with the extract." },
            { t:"Q", fb:"R gave 22 colonies alone but 240 with the extract." }, { t:"None", fb:"R gave 22 colonies alone but 240 with the extract." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"name", type:"sorter", title:"Name that mutation", summary:"Name that mutation", goal:1, noun:"change", txt:true,
        instruction:"Changes are given as mRNA codons. Sort each change into the box that names it.",
        boxes:[{ id:"sil", label:"Silent" }, { id:"mis", label:"Missense" }, { id:"non", label:"Nonsense" }, { id:"fs", label:"Frameshift" }, { id:"inf", label:"In-frame insertion or deletion" }],
        items:[
          { id:"n1", t:sq("GAA → GAG"), answer:"sil", why:"Silent (Glu → Glu).", wrong:{ mis:M1 } },
          { id:"n2", t:sq("UGG → UGA"), answer:"non", why:"Nonsense (Trp → stop)." },
          { id:"n3", t:sq("GCU → ACU"), answer:"mis", why:"Missense (Ala → Thr)." },
          { id:"n4", t:"One base inserted in codon 2 of a 10-codon gene", answer:"fs", why:"One base shifts every later codon: a frameshift." },
          { id:"n5", t:"Three bases (one whole codon) deleted", answer:"inf", why:"Three bases is one codon: the frame is kept.", wrong:{ fs:M2 } },
          { id:"n6", t:sq("CAU → CAC"), answer:"sil", why:"Silent (His → His).", wrong:{ mis:M1 } },
          { id:"n7", t:sq("UAC → UAA"), answer:"non", why:"Nonsense (Tyr → stop).", hints:["Look up UAA.", "It’s a stop codon.", "Nonsense."] },
          { id:"n8", t:sq("GUU → GAU"), answer:"mis", why:"Missense (Val → Asp)." },
          { id:"n9", t:"Two bases deleted from codon 4", answer:"fs", why:"Two isn’t a multiple of three, so the frame shifts.", wrong:{ inf:"Two isn’t a multiple of three." } },
          { id:"n10", t:sq("AAA → AGA"), answer:"mis", why:"Missense (Lys → Arg)." }
        ],
        wrongDefault:"Look the codons up: same amino acid, different amino acid, or stop?" },
      { id:"detective", type:"custom", title:"Mutation detective", summary:"Mutation detective", star:true, goal:[2, 4, 5], how:"",
        instruction:"The normal gene is the Explore gene: " + GENE + " (Met–Pro–Glu–Trp–Lys–Cys). Puzzles 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        items:[
          { id:"d1", kind:"codon", goal:4, prompt:"A mutant makes only Met–Pro. Which single change?",
            target:"MP", answer:"3:TAG", display:"Base 7 G → T (GAG → TAG)",
            why:"Codon 3 must become a stop: GAG → TAG.",
            named:[{ codon:2, fb:"Codon 3 must become the stop." }] },
          { id:"d2", kind:"codon", goal:4, prompt:"A mutant makes Met–Pro–Lys–Trp–Lys–Cys. Which single change?",
            target:"MPKWKC", answer:"3:AAG", display:"Base 7 G → A (GAG → AAG)",
            why:"Lys is AAA or AAG; only AAG is one change from GAG.",
            named:[{ codon:3, val:"AAA", fb:"That’s two changes." }] },
          { id:"d3", kind:"codon", goal:4, star:true, prompt:"A mutant makes Met–Pro–Glu–Trp–Lys–Trp. Which single change?",
            target:"MPEWKW", answer:"6:TGG", display:"Base 18 C → G (TGC → TGG)",
            why:"Trp has only one codon, UGG (TGG on the coding strand): TGC → TGG.",
            named:[{ codon:6, val:"TGA", fb:"That’s a stop, not Trp." }],
            hints:["Which codons are Trp?", "Only TGG (UGG).", "TGC → TGG: base 18."] },
          { id:"d4", kind:"mc", goal:[4, 5], star:true, prompt:"A mutant protein has Met, then every amino acid is different, and it runs past where it should stop. What kind of mutation, and where?",
            options:[
              { t:"A frameshift (insertion or deletion of 1 or 2 bases) just after the start codon", ok:true, why:"Every codon after the change is read in a new frame, and the old stop is no longer in frame." },
              { t:"A substitution", why:M3 + " One substitution changes at most one amino acid." },
              { t:"A nonsense mutation", why:"A nonsense mutation makes the protein shorter, not longer." },
              { t:"An in-frame deletion of three bases", why:"Three bases keeps the frame, so most amino acids stay the same." }],
            follow:{ prompt:"Follow-up: a chromosome " + sq("A B C D E F G H") + " becomes " + sq("A B E D C F G H") + ". Name the mutation.",
              options:[
                { t:"Inversion", ok:true, why:"The segment C D E flipped." },
                { t:"Translocation", why:"Nothing moved to another chromosome; a segment flipped." },
                { t:"Deletion", why:"All eight bands are still there." },
                { t:"Duplication", why:"No band appears twice." }] } },
          { id:"d5", kind:"pair", goal:2, star:true, prompt:"Compare deleting bases 7–9 with deleting bases 8–10. What protein does each give?",
            parts:[{ id:"a", t:"Delete bases 7–9", answer:"MPWKC" }, { id:"b", t:"Delete bases 8–10", answer:"MPGKC" }],
            options:[{ id:"MPWKC", t:"Met–Pro–Trp–Lys–Cys" }, { id:"MPGKC", t:"Met–Pro–Gly–Lys–Cys" }, { id:"MPEKC", t:"Met–Pro–Glu–Lys–Cys" }, { id:"FS", t:"Every amino acid after Pro changes" }],
            display:"7–9: Met–Pro–Trp–Lys–Cys; 8–10: Met–Pro–Gly–Lys–Cys",
            why:"Deleting 7–9 removes codon 3 exactly. Deleting 8–10 cuts across two codons: the leftover G joins GG… to make Gly.",
            bothW:"Deleting 8–10 cuts across two codons: the leftover G joins GG… to make Gly, so Glu and Trp become one Gly. " + M2,
            fsW:M2,
            hints:["Write out both shortened sequences.", "Deleting 8–10 leaves " + sq("ATG CCA G") + " + " + sq("GGAAATGCTAA") + ".", sq("ATG CCA GGG AAA TGC TAA") + ": Met–Pro–Gly–Lys–Cys."] },
          { id:"d6", kind:"mc", goal:2, star:true, prompt:"A mutation in the gene’s <strong>promoter</strong> stops RNA polymerase binding. The coding sequence is unchanged. What happens to the protein?",
            options:[
              { t:"None is made", ok:true, why:"No transcription means no mRNA and no protein." },
              { t:"It’s normal", why:"No transcription means no mRNA and no protein, even with a perfect coding sequence." },
              { t:"It’s shorter than normal", why:"The coding sequence is fine; it’s never transcribed, so no mRNA and no protein." },
              { t:"One amino acid changes", why:"The coding sequence is unchanged; the problem is that no mRNA is made." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Pablo", how:"",
        instruction:"Pablo made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Classify the sickle-cell mutation: coding strand GAG → GTG.",
            steps:["The coding-strand codon GAG becomes GTG.", "So the mRNA codon changes from GAG to GUG.", "GAG codes Glu and GUG codes Val.", "Only one base changed, so it’s a silent mutation."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The amino acid changed, so it’s a missense mutation.", ok:true, why:"Glu → Val: one amino acid changed." },
              { t:"It’s a nonsense mutation.", why:"GUG isn’t a stop." },
              { t:"It’s a frameshift.", why:"One substitution can’t shift the frame." },
              { t:"Step 4 is correct.", why:"Silent means the amino acid stays the same. " + M1 }],
            hints:["Did the amino acid change?", "Glu → Val.", "Missense."] },
          { id:"e2", goal:1, task:"Predict the effect of inserting 3 bases between codons 3 and 4 of a gene.",
            steps:["Three bases are inserted between two codons.", "Any insertion shifts the reading frame.", "So every amino acid after codon 3 changes."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2."],
            fixes:[
              { t:"Three bases form one new codon, so the frame stays the same: one extra amino acid is added (or a stop, if the new codon is one).", ok:true, why:M2 },
              { t:"The insertion is silent.", why:"It adds a codon." },
              { t:"The protein loses three amino acids.", why:"An insertion adds bases; it can’t remove amino acids." },
              { t:"Step 2 is correct.", why:"Only insertions that aren’t multiples of 3 shift the frame. " + M2 }],
            hints:["How many bases is a codon?", "Three.", "The frame is kept."] },
          { id:"e3", goal:3, task:"Explain how UV light can cause a mutation.",
            steps:["UV light is absorbed by DNA bases.", "Neighbouring thymines on the same strand can bond together, forming a thymine dimer.", "The dimer kinks the double helix.", "The kink breaks the DNA into two pieces, so the cell always dies.", "So UV can’t cause mutations that are passed on to daughter cells."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "This follows from step 4."],
            fixes:[
              { t:"Repair enzymes usually cut the dimer out; if one is missed, replication can put in the wrong base, leaving a mutation that daughter cells inherit.", ok:true, why:"Excision repair fixes most dimers; a missed one can be copied wrongly." },
              { t:"UV changes T into U.", why:"UV doesn’t swap bases; it joins neighbouring thymines into dimers." },
              { t:"UV adds extra thymines.", why:"UV joins thymines that are already there; it doesn’t add any." },
              { t:"Step 4 is correct.", why:"Strand breaks are typical of ionizing radiation; UV mainly makes dimers. " + M7 }],
            hints:["Do cells have tools for dimers?", "Excision repair.", "If it fails, a wrong base can be copied in."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the lab: how many substitutions were silent, or how a single extra base wrecked the whole protein?" },
      { id:"j2", q:"In your own words, why are frameshifts usually more serious than substitutions?" },
      { id:"j3", q:"Explain to a friend how to work out whether a mutation is silent, missense or nonsense." },
      { id:"j4", q:"Which part (classifying, decoding or mutagens) still feels uncertain? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is a silent mutation?", options:[
          { t:"A base change that gives a codon for the same amino acid", ok:true, why:"Same amino acid, same protein." },
          { t:"A base change that has no effect because it’s in the start codon", why:"Changing AUG usually stops translation." },
          { t:"A change that removes a whole codon", why:"That’s an in-frame deletion. " + M2 },
          { t:"Any change in a gene that nobody notices", why:"Silent has a precise meaning: same amino acid. " + M1 }] },
        b:{ prompt:"What is a nonsense mutation?", options:[
          { t:"A base change that turns a codon into a stop codon", ok:true, why:"An early stop cuts the protein short." },
          { t:"A change that makes a codon for a different amino acid", why:"That’s missense." },
          { t:"A change that shifts the reading frame", why:"That’s a frameshift. " + M3 },
          { t:"A change in DNA that doesn’t code for anything", why:"Nonsense means an early stop." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"How does UV light most often damage DNA?", options:[
          { t:"It joins neighbouring thymines on one strand into thymine dimers", ok:true, why:"Thymine dimers kink the helix." },
          { t:"It breaks both DNA strands", why:"That’s typical of X-rays and other ionizing radiation. " + M7 },
          { t:"It slips between bases and causes insertions", why:"That’s how intercalating chemicals act." },
          { t:"It turns thymine into uracil", why:"UV doesn’t swap bases like that." }] },
        b:{ prompt:"How does ionizing radiation, such as X-rays, most often damage DNA?", options:[
          { t:"It breaks one or both DNA strands", ok:true, why:"Strand breaks are the signature of ionizing radiation." },
          { t:"It forms thymine dimers", why:"That’s UV’s typical damage. " + M7 },
          { t:"It adds methyl groups to cytosine", why:"That’s normal gene regulation." },
          { t:"It makes DNA single-stranded permanently", why:"Breaks, not unzipping." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What is a frameshift mutation?", options:[
          { t:"An insertion or deletion of bases (not a multiple of 3) that changes how all later codons are read", ok:true, why:"Every codon after it is read in a new frame." },
          { t:"A substitution of one base for another", why:"Substitutions keep the frame." },
          { t:"A deletion of exactly three bases", why:M2 },
          { t:"A mutation that moves a gene to another chromosome", why:"That’s a translocation." }] },
        b:{ prompt:"Which change causes a frameshift?", options:[
          { t:"Deleting one base from the middle of a gene", ok:true, why:"One base isn’t a multiple of 3, so every later codon shifts." },
          { t:"Deleting three bases that form one codon", why:M2 },
          { t:"Changing one base to another", why:"That’s a substitution." },
          { t:"Inserting six bases between two codons", why:"Six is a multiple of three. " + M2 }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"A coding-strand codon changes from CAT to CAG. What type of mutation is it?", options:[
          { t:"Missense: His (CAU) becomes Gln (CAG)", ok:true, why:"One amino acid changes." },
          { t:"Silent: only the third base changed", why:"Here the third base matters: CAU/CAC are His, CAA/CAG are Gln." },
          { t:"Nonsense", why:"CAG isn’t a stop." },
          { t:"Frameshift", why:"A substitution keeps the frame." }] },
        b:{ prompt:"A coding-strand codon changes from TAC to TAG. What type of mutation is it?", options:[
          { t:"Nonsense: Tyr (UAC) becomes a stop (UAG)", ok:true, why:"UAG is a stop codon." },
          { t:"Silent: only the third base changed", why:"Here the third base matters: UAU/UAC are Tyr, but UAG is a stop." },
          { t:"Missense: Tyr becomes Asp", why:"UAG is a stop codon." },
          { t:"Frameshift", why:"A substitution keeps the frame." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"The coding strand " + sq("5′-ATG GCT TAC GAA TGG TAA-3′") + " codes Met–Ala–Tyr–Glu–Trp. The C at base 9 is deleted. What polypeptide is made?", options:[
          { t:"Met–Ala, then stop", ok:true, why:"The new frame reads " + sq("ATG GCT TAG…") + ": TAG is a stop." },
          { t:"Met–Ala–Glu–Trp", why:"Deleting one base doesn’t just remove one amino acid. " + M3 },
          { t:"Met–Ala–Tyr–Glu–Trp", why:"The change matters: the frame shifts." },
          { t:"Met–Ala–Ser–Asn–Gly", why:"That’s what deleting base 8 would give." }] },
        b:{ prompt:"The coding strand " + sq("5′-ATG TTC AAG TGG CCT TAA-3′") + " codes Met–Phe–Lys–Trp–Pro. The first T of TTC (base 4) is deleted. What happens to the polypeptide?", options:[
          { t:"Met–Ser–Ser–Gly–Leu…: every amino acid after Met changes", ok:true, why:"New frame: " + sq("ATG TCA AGT GGC CTT AA") + "." },
          { t:"Met–Lys–Trp–Pro", why:M3 },
          { t:"Met–Phe–Lys–Trp–Pro", why:"The frame shifts." },
          { t:"Met, then stop", why:"The new frame has no early stop here." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"In the gene " + GENE + ", bases 8–10 (AGT) are deleted. What polypeptide is made?", options:[
          { t:"Met–Pro–Gly–Lys–Cys", ok:true, why:sq("ATG CCA GGG AAA TGC TAA") + ": Glu and Trp are replaced by one Gly; the frame is restored." },
          { t:"Met–Pro–Trp–Lys–Cys", why:"That’s deleting bases 7–9 (a whole codon)." },
          { t:"Every amino acid after Pro changes", why:"Three bases removed keeps the frame. " + M2 },
          { t:"Met–Pro–Glu–Lys–Cys", why:"The deleted bases cut across codons 3 and 4." }] },
        b:{ prompt:"In the gene " + sq("5′-ATG TTC AAG TGG CCT TAA-3′") + ", bases 6–8 (CAA) are deleted. What polypeptide is made?", options:[
          { t:"Met–Leu–Trp–Pro", ok:true, why:sq("ATG TTG TGG CCT TAA") + ": Phe and Lys are replaced by one Leu." },
          { t:"Met–Phe–Trp–Pro", why:"That would be deleting AAG (bases 7–9)." },
          { t:"Every amino acid after Met changes", why:M2 },
          { t:"Met–Phe–Lys–Pro", why:"The deletion falls across codons 2 and 3." }] } },
      { id:"c1", cat:"C", goal:[1, 6],
        a:{ prompt:"Which is the best explanation of why a frameshift near the start of a gene is usually more harmful than a single substitution?", options:[
          { t:"“A frameshift changes every codon after it, usually scrambling the protein and often creating an early stop; a substitution changes at most one amino acid, and may be silent.”", ok:true, why:"Frame versus one codon." },
          { t:"“A frameshift removes the whole gene.”", why:"The gene is still there; it’s misread." },
          { t:"“Substitutions are never harmful.”", why:"Sickle-cell anemia is caused by one substitution. " + M4 },
          { t:"“Frameshifts always make the protein longer.”", why:"They often make it shorter." }] },
        b:{ prompt:"Which is the best explanation of why many substitutions have no effect on the protein?", options:[
          { t:"“Most amino acids have more than one codon, so a change, often in the third base, can still code the same amino acid.”", ok:true, why:"That’s the code’s redundancy." },
          { t:"“Substitutions only happen in introns.”", why:"They can happen anywhere." },
          { t:"“The ribosome corrects them.”", why:"Ribosomes read what’s there." },
          { t:"“One base is too small to matter.”", why:"One base can change or stop a protein. " + M1 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which is the correct description of the sickle-cell mutation?", options:[
          { t:"Coding DNA GAG → GTG; mRNA GAG → GUG; glutamic acid → valine (missense)", ok:true, why:M6 },
          { t:"Coding DNA GAG → GTG; mRNA GAG → GTG; Glu → Val", why:"RNA uses U. " + M6 },
          { t:"Coding DNA GAG → GUG; mRNA GAG → GUG; Glu → Val", why:"DNA uses T. " + M6 },
          { t:"Coding DNA GAG → GTG; mRNA GAG → GUG; Glu → stop (nonsense)", why:"GUG is Val, not a stop." }] },
        b:{ prompt:"Which is the correct description of the most common cystic fibrosis mutation?", options:[
          { t:"Three bases are deleted from the CFTR gene, removing one phenylalanine; the rest of the protein is read in frame, but it misfolds", ok:true, why:"An in-frame deletion: one amino acid lost, the frame kept." },
          { t:"One base is deleted, causing a frameshift", why:M2 },
          { t:"One base is substituted, making a stop codon", why:"It’s a deletion." },
          { t:"Three bases are deleted, so every later amino acid changes", why:M2 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Ames-test model data: control 20 colonies; chemical X 22; chemical Y 280; chemical Z 19. Which conclusion is best supported?", options:[
          { t:"Y is a mutagen; X and Z show no evidence of being mutagens", ok:true, why:"Only Y gives many more colonies than the control." },
          { t:"All three are mutagens, because colonies grew on every plate", why:"The control shows some colonies always grow." },
          { t:"X is a mutagen because it has more colonies than the control", why:"22 vs 20 is within normal variation." },
          { t:"Z prevents mutations", why:"19 vs 20 is no real difference." }] },
        b:{ prompt:"Ames-test model data: control 18; chemical W alone 20; chemical W + liver extract 260. Which conclusion is best supported?", options:[
          { t:"W becomes a mutagen after liver enzymes process it", ok:true, why:"Alone it matches the control; with liver extract it gives far more colonies." },
          { t:"W is not a mutagen", why:"With liver extract it clearly is." },
          { t:"The liver extract is the mutagen", why:"You’d need an extract-only plate to claim that; the W-alone result points to processing W." },
          { t:"W prevents mutations", why:"20 vs 18 is no difference." }] } },
      // VERIFY: Health Canada's radon-testing recommendation (plan: "verify before release").
      { id:"a2", cat:"A", goal:[3, 5],
        a:{ prompt:"Health Canada recommends testing homes for radon, a radioactive gas from the ground. How can radon lead to lung cancer?", options:[
          { t:"Its radiation can break DNA in lung cells; mistakes in repairing the breaks can cause mutations in genes that control cell division", ok:true, why:"Ionizing radiation breaks strands; faulty repair leaves mutations." },
          { t:"Radon forms thymine dimers", why:"That’s UV’s damage. " + M7 },
          { t:"Radon is a nutrient that cancer cells eat", why:"It damages DNA." },
          { t:"Radon mutations are passed on to children through the lungs", why:"Lung-cell mutations are somatic. " + M5 }] },
        b:{ prompt:"A person gets a mutation in a skin cell from years of sun exposure. Can it be passed on to their children?", options:[
          { t:"No: it’s a somatic mutation; only mutations in cells that make eggs or sperm can be inherited", ok:true, why:M5 },
          { t:"Yes: all mutations are inherited", why:M5 },
          { t:"Yes, if the mutation is in a gene", why:"Location in the body matters, not just in the genome. " + M5 },
          { t:"No, because UV mutations are always repaired", why:"Some escape repair." }] } }
    ]
  },
  task:{
    title:"Swap one amino acid", summary:"Swap one amino acid",
    statement:"<p>Using the Explore gene " + GENE + " (Met–Pro–Glu–Trp–Lys–Cys), make <strong>exactly two</strong> single-base substitutions that meet every condition. Can you find all the answers?</p><ol class=\"mu-conds\"><li>The protein becomes Met–Pro–Glu–Trp–Lys–<strong>Ser</strong> (then stop).</li><li>The two substitutions are in different codons.</li><li>One substitution is silent and sits in codon 2 or codon 3.</li></ol>",
    checks:["Protein Met–Pro–Glu–Trp–Lys–Ser", "Different codons", "Silent change in codon 2 or 3"],
    tips:["Which Ser codons differ from TGC (Cys) by one base?",
      "Changing Cys and something else in the same codon won’t work: they must be separate codons.",
      "Which changes to CCA (Pro) or GAG (Glu) keep the same amino acid?"],
    explainPrompt:"Explain how the genetic code’s redundancy let you make a silent change, and why only two single-base changes turn Cys into Ser.",
    vocab:"Use the words codon, substitution, silent, missense and redundancy.",
    success:"Your two substitutions meet every condition!",
    more:"Can you find all the answers?",
    afterAt:8,
    after3:"Ser has six codons, but only TCC and AGC are one step from TGC. Pro tolerates any third base; Glu tolerates only A ↔ G."
  },
  cards:[
    ["Mutation", "A permanent change in the DNA sequence."],
    ["Silent", "Substitution that keeps the same amino acid."],
    ["Missense", "Substitution that changes one amino acid (sickle-cell: Glu → Val)."],
    ["Nonsense", "Substitution that creates an early stop codon."],
    ["Frameshift", "Insertion or deletion not a multiple of 3; every later codon changes."],
    ["In-frame deletion", "Three bases removed; frame kept (cystic fibrosis’s common mutation)."],
    ["UV damage", "Thymine dimers; fixed by excision repair."],
    ["Ionizing radiation", "X-rays, gamma rays, radon: break DNA strands."],
    ["Chemical mutagens", "Alter bases or slip between them (benzo[a]pyrene in smoke)."],
    ["Chromosomal mutations", "Deletion, duplication, inversion, translocation of whole segments."],
    ["Germ-line vs somatic", "Only germ-line (egg or sperm) mutations are inherited."],
    ["Ames test", "More colonies than the control means the chemical causes mutations."]
  ]
};
