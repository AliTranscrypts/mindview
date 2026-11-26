// SCH4U 04 Aldehydes and Ketones. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/04-aldehydes-and-ketones.md
// Molecules, the carbonyl explorer, the particle box, the gallery drawings, the test bench and the builder are drawn by
// app.js. Boiling points in the readouts come from app.js data (the plan's module table, course table additions).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "The CHO carbon is C1 of the chain. Count it, and don’t add a locant.";
const M2 = "No O–H, so no H-bonds between molecules. Dipole–dipole forces only.";
const M3 = "Check the carbonyl carbon: an H on it means aldehyde; two carbons on it means ketone.";
const M4 = "A ketone’s carbonyl carbon has no H to replace, so mild oxidizers leave it alone.";
const M5 = "Give the C=O the lowest locant.";
const M6 = "A ketone’s C=O must sit between two carbons: at least 3 carbons.";
const FIND = "Find the carbonyl, decide the family, then number.";
const RING = '<svg class="ak-ring" viewBox="0 0 90 84" role="img" aria-label="six-carbon ring with C=O"><g fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"><polygon points="45,32 62.3,42 62.3,62 45,72 27.7,62 27.7,42"/><line x1="42" y1="31" x2="42" y2="16"/><line x1="48" y1="31" x2="48" y2="16"/></g><text x="45" y="11" text-anchor="middle" font-size="14" font-weight="700" fill="var(--at-o)">O</text></svg><span class="ak-tf">6-carbon ring with C=O</span>';

export default {
  id:"04-aldehydes-and-ketones",
  kind:"topic",
  title:"Aldehydes and ketones",
  topic:"Aldehydes and Ketones",
  readyTopic:"aldehydes and ketones",
  hero:{
    eq:'<span class="nw">R–CHO (aldehyde)</span> · <span class="nw">R–CO–R′ (ketone)</span>', eqSize:"sm",
    eqLabel:"R C H O, an aldehyde, and R C O R prime, a ketone",
    headline:"Where the C=O sits changes everything",
    text:"The <strong>carbonyl group</strong>, C=O, gives cinnamon, vanilla and almonds their smells. At the <strong>end</strong> of a chain it makes an <strong>aldehyde</strong>; in the <strong>middle</strong>, a <strong>ketone</strong>. That one difference decides how the molecule is named and whether it can be oxidized.",
    fig:{ html:'<div class="ak-hx"><svg class="ak-hx-svg" id="ak-hx-svg" viewBox="0 0 560 320" role="img" aria-label="Propanal, a three-carbon chain with its C=O at C1, shown with δ− on the oxygen and δ+ on the carbon. The C=O slides to C2 and the hydrogens on C2 hop to C1: the label changes to propanone. Then an [O] token approaches each molecule: propanal becomes propanoic acid, with an OH where its H was; propanone shrugs it off, with no H to replace."></svg><div class="ak-hx-row"><p class="ak-hx-cap" id="ak-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ak-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can identify the carbonyl group and tell an aldehyde from a ketone.",
    "I can name and draw aldehydes and ketones, including methanal and propanone.",
    "I can explain the boiling points and solubility of aldehydes and ketones compared with alkanes and alcohols.",
    "I can explain why aldehydes oxidize easily but ketones don’t, and use this to tell them apart.",
    "I can connect aldehydes and ketones to alcohol oxidation and to everyday substances."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Alcohol oxidation", goal:5,
          prompt:"Oxidizing a secondary alcohol gives…",
          options:[
            { t:"a ketone", ok:true, why:"Module 03." },
            { t:"an aldehyde", why:"That’s from a primary alcohol." },
            { t:"a carboxylic acid", why:"Only primary alcohols go that far." },
            { t:"nothing", why:"Tertiary alcohols don’t react; secondary ones do." }],
          hints:["Recall the oxidation ladder.", "Secondary stops after one step.", "A ketone."] },
        { id:"w2", skill:"Alcohol oxidation", goal:5,
          prompt:"Which alcohol oxidizes to propanal?",
          options:[
            { t:"propan-1-ol", ok:true, why:"Primary → aldehyde." },
            { t:"propan-2-ol", why:"That gives propanone." },
            { t:"2-methylpropan-2-ol", why:"Tertiary: no reaction." },
            { t:"propane", why:"Not an alcohol." }],
          hints:["An aldehyde comes from which class?", "Primary.", "propan-1-ol."] },
        { id:"w3", skill:"Intermolecular forces", goal:3,
          prompt:"Which force acts between molecules with permanent dipoles but no O–H, N–H or F–H?",
          options:[
            { t:"dipole–dipole", ok:true, why:"Permanent dipoles attract (plus London forces)." },
            { t:"hydrogen bonding", why:"Needs H on O, N or F." },
            { t:"ionic bonding", why:"No ions." },
            { t:"covalent bonding", why:"That’s within molecules." }],
          hints:["Polar, but no O–H.", "Permanent dipoles attract.", "Dipole–dipole."] },
        { id:"w4", skill:"Intermolecular forces", goal:3,
          prompt:"Which bond is most polar?",
          options:[
            { t:"C=O", ok:true, why:"O is much more electronegative than C (3.44 vs 2.55)." },
            { t:"C–H", why:"ΔEN 0.35: nearly nonpolar." },
            { t:"C–C", why:"ΔEN 0." },
            { t:"H–H", why:"ΔEN 0." }],
          hints:["Compare electronegativities.", "ΔEN for C=O is 0.89.", "C=O."] },
        { id:"w5", skill:"Naming", goal:2,
          prompt:"Which suffix shows an alcohol?",
          options:[
            { t:"-ol", ok:true, why:"ethan-ol: -ol shows an alcohol." },
            { t:"-al", why:"That shows an aldehyde." },
            { t:"-one", why:"That shows a ketone." },
            { t:"-oic acid", why:"That shows a carboxylic acid." }],
          hints:["ethan-ol.", "-ol.", "-ol."] },
        { id:"w6", skill:"Naming", goal:2,
          prompt:"In propan-2-ol, what does the 2 tell you?",
          options:[
            { t:"The OH is on carbon 2", ok:true, why:"Numbers before a suffix are locants: they give positions." },
            { t:"There are 2 OH groups", why:"That would be a diol." },
            { t:"There are 2 carbons", why:"prop- means 3." },
            { t:"It’s a secondary alcohol", why:"That’s true here, but the number is a locant." }],
          hints:["Numbers before a suffix are locants.", "They give positions.", "OH on C2."] }
      ],
      refreshers:{
        "Alcohol oxidation":"Primary → aldehyde → acid; secondary → ketone; tertiary → no reaction.",
        "Intermolecular forces":"London < dipole–dipole < hydrogen bonding, for molecules of similar size.",
        "Naming":"Root = chain length; suffix = family; locant = position."
      }
    }
  },
  explore:{
    heading:"Carbonyl explorer",
    intro:"Slide a C=O along a carbon chain. Watch the family, the name, the polarity and the boiling point change.",
    how:"Set the number of carbons and slide the C=O along the chain (arrow keys work on both sliders). Add one methyl branch if you like. Choose a mode to compare boiling points, see the polarity and water, or browse everyday molecules. Press <strong>Pin for comparison</strong> to keep a molecule beside the one you build next.",
    modes:[{ id:"prop", t:"Properties" }, { id:"pol", t:"Polarity view" }, { id:"gal", t:"Everyday molecules" }],
    gallery:[
      { id:"methanal", name:"methanal (formaldehyde)", use:"preservative", fam:"aldehyde", f:"CH2O", cond:"HCHO", bonded:"two H",
        ox:"yes → methanoic acid", note:"A solution of methanal in water preserves biological specimens." },
      { id:"ethanal", name:"ethanal (acetaldehyde)", use:"made when ethanol is oxidized", fam:"aldehyde", f:"C2H4O", cond:"CH3CHO", bonded:"one carbon and one H",
        ox:"yes → ethanoic acid", note:"Ethanal is the first product when ethanol is oxidized (module 03)." },
      { id:"propanone", name:"propanone (acetone)", use:"nail-polish remover", fam:"ketone", f:"C3H6O", cond:"CH3COCH3", bonded:"two carbons",
        ox:"no", note:"The smallest ketone. It mixes with water and dissolves nonpolar substances too, and it evaporates easily." },
      { id:"butanedione", name:"butanedione", use:"butter flavour", fam:"ketone (two ketone groups)", f:"C4H6O2", cond:"CH3COCOCH3", bonded:"two carbons (each C=O)",
        ox:"no: neither carbonyl carbon has an H", note:"Two C=O groups, and each carbonyl carbon is bonded to two carbons." },
      { id:"benzaldehyde", name:"benzaldehyde", use:"almond flavour", fam:"aldehyde", f:"C7H6O", cond:"C6H5CHO", bonded:"one carbon (in the ring) and one H",
        ox:"yes → benzoic acid", note:"Left in an open bottle, air slowly oxidizes it to white crystals of benzoic acid." },
      { id:"cinnamaldehyde", name:"cinnamaldehyde", use:"cinnamon flavour", fam:"aldehyde", f:"C9H8O", cond:"C6H5CH=CHCHO", bonded:"one carbon and one H",
        ox:"yes → a carboxylic acid", note:"A benzene ring, a C=C and a –CHO group. The –CHO group is the aldehyde." },
      { id:"vanillin", name:"vanillin", use:"vanilla flavour", fam:"aldehyde", f:"C8H8O3", cond:"C6H3(OH)(OCH3)CHO", bonded:"one carbon (in the ring) and one H",
        ox:"yes → a carboxylic acid", note:"Besides the –CHO group, vanillin has an –OH and an –OCH₃ group on its ring." }
    ],
    predictions:[
      { id:"p1", prompt:"Slide the C=O from C1 to C2. What do you have now?",
        options:[{ t:"a ketone, propanone", ok:true }, { t:"a different aldehyde, propan-2-al" }, { t:"an alcohol" }, { t:"an ether" }],
        explain:"The carbonyl carbon now has two carbon neighbours, and the label flips. A middle C=O is a ketone." },
      { id:"p2", prompt:"Butane (58 g/mol) boils at −1 °C and propan-1-ol (60 g/mol) at 97 °C. Propanal boils at…",
        options:[{ t:"about 48 °C, between them", ok:true }, { t:"below −1 °C" }, { t:"above 97 °C" }, { t:"the same as propan-1-ol" }],
        explain:"Dipole–dipole forces beat London forces, but there’s no O–H for hydrogen bonding." },
      { id:"p3", prompt:"Will propanone dissolve in water?",
        options:[{ t:"yes, completely", ok:true }, { t:"no, it floats" }, { t:"only when heated" }, { t:"it reacts with water" }],
        explain:"Water’s O–H can H-bond to the C=O oxygen." },
      { id:"p4", prompt:"Which one is oxidized?",
        options:[{ t:"butanal only", ok:true }, { t:"butanone only" }, { t:"both" }, { t:"neither" }],
        explain:"Only the aldehyde has an H on its carbonyl carbon." }
    ],
    chalIntro:"Use the explorer to meet each goal, then press <strong>Check challenge</strong>. For challenge 2, pin one molecule, then build the other. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build pentan-3-one.",
        why:"Pentan-3-one, CH₃CH₂COCH₂CH₃: 5 carbons, with the C=O on the middle carbon.",
        hints:["5 carbons.", "The C=O on the middle carbon.", "CH₃CH₂COCH₂CH₃."] },
      { id:"tc2", goal:[1, 2], prompt:"Build an aldehyde and a ketone that are <strong>isomers</strong> of each other, each with 4 carbons.",
        why:"Same formula, C₄H₈O, different families. Only one C₄ ketone exists, butanone; butanal and 2-methylpropanal are its aldehyde isomers.",
        hints:["Same formula, C₄H₈O.", "Only one C₄ ketone exists.", "Butanone, plus butanal or 2-methylpropanal."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Build the C₅H₁₀O carbonyl compound that has a <strong>branched chain</strong> and <strong>can’t be oxidized</strong> by [O].",
        why:"3-methylbutan-2-one, CH₃COCH(CH₃)₂: a ketone, so its carbonyl carbon has no H for [O] to replace, and its chain is branched.",
        hints:["Can’t be oxidized → ketone.", "Which C₅ ketone has a branch?", "CH₃COCH(CH₃)₂."] }
    ],
    blocks:[{ title:"What the explorer shows", html:"<p>The carbonyl position decides the family. The C=O dipole lifts boiling points above alkanes, but the missing O–H keeps them below alcohols. The H on an aldehyde’s carbonyl carbon is what makes it oxidizable.</p>" }]
  },
  part3:{
    slug:"tests", name:"Tests", heading:"Tell them apart",
    intro:"Use the oxidation difference as evidence: a virtual test bench, a question about controls, then naming practice. The tests are described by what you observe only: no reagent preparation, amounts or procedures.",
    s1:{ title:"Station 1: Virtual oxidation tests",
      intro:"Pick a test and a sample, then add the sample. Record what you see in the results table.",
      tests:[
        { id:"tol", t:"Tollens’ test", before:"colourless solution", pos:"silver mirror", neg:"no change",
          desc:"<strong>Tollens’ test:</strong> an aldehyde gives a silver mirror on the glass; a ketone gives no change." },
        { id:"ben", t:"Benedict’s test", before:"blue solution", pos:"brick-red precipitate", neg:"stays blue",
          desc:"<strong>Benedict’s test:</strong> blue solution → brick-red precipitate with simple (non-aromatic) aldehydes; it stays blue with ketones." }],
      samples:[{ id:"butanal", t:"butanal" }, { id:"butanone", t:"butanone" }, { id:"propanone", t:"propanone" }, { id:"ethanal", t:"ethanal" }, { id:"x", t:"unknown X" }, { id:"water", t:"water" }],
      data:"An aldehyde’s carbonyl carbon carries an H. Oxidation replaces that H with OH, so the aldehyde becomes a carboxylic acid; the test reagent is reduced, which is what you see. A ketone’s carbonyl carbon carries two carbons and no H, so there’s nothing to replace." },
    s2:{ title:"Station 2: Controls",
      q:"Which samples show what positive and negative look like?",
      roles:[{ id:"pos", t:"positive control" }, { id:"neg", t:"negative control" }, { id:"blank", t:"blank" }],
      rows:[
        { id:"ethanal", t:"ethanal", answer:"pos", tip:"Ethanal is an aldehyde, known to react: it shows what a positive result looks like." },
        { id:"propanone", t:"propanone", answer:"neg", tip:"Propanone is a carbonyl compound known not to react: it shows what a negative result looks like." },
        { id:"water", t:"water", answer:"blank", tip:"Water has no carbonyl compound at all: it shows that the reagent alone doesn’t change." }],
      right:"Ethanal is the positive control, propanone the negative control and water the blank. With all three, you can trust a result for an unknown." },
    s3:{ title:"Station 3: Naming practice",
      intro:"Name each structure with the chips. Aldehydes need no locant; ketones do.",
      items:[
        { id:"n1", sp:{ n:5, co:0, me:null }, answer:"pentanal", hints:["Is there an H on the carbonyl carbon?", "Yes: an aldehyde. The CHO carbon is C1, so there’s no locant.", "pentanal."] },
        { id:"n2", sp:{ n:6, co:1, me:null }, answer:"hexan-2-one", hints:["Two carbons on the carbonyl carbon: a ketone.", "Six carbons; number from the end nearer the C=O.", "hexan-2-one."] },
        { id:"n3", sp:{ n:6, co:2, me:null }, answer:"hexan-3-one", hints:["Ketone: it needs a locant.", "Count from the end nearer the C=O: it’s on C3.", "hexan-3-one."] },
        { id:"n4", sp:{ n:4, co:0, me:1 }, answer:"2-methylbutanal", hints:["Start numbering at the CHO carbon.", "The longest chain through the CHO carbon has 4 carbons; the branch is on C2.", "2-methylbutanal."] },
        { id:"n5", sp:{ n:5, co:1, me:3 }, answer:"4-methylpentan-2-one", hints:["The C=O gets the lowest locant first.", "Number from the end nearer the C=O: C=O on C2, methyl on C4.", "4-methylpentan-2-one."] }] },
    quickCheck:{
      title:"Quick check", summary:"Tests quick check",
      items:[
        { id:"q1", goal:4, prompt:"Unknown X gives a silver mirror. X is…",
          choices:[
            { t:"an aldehyde", ok:true, fb:"Right. Only the aldehyde is oxidized." },
            { t:"a ketone", fb:"Only the aldehyde is oxidized." },
            { t:"an alkane", fb:"Only the aldehyde is oxidized." },
            { t:"an ether", fb:"Only the aldehyde is oxidized." }] },
        { id:"q2", goal:2, prompt:"Name CH₃CH₂CHO",
          choices:[
            { t:"propanal", ok:true, fb:"Right. CHO carbon is C1; no locant." },
            { t:"propanone", fb:"CHO carbon is C1; no locant." },
            { t:"propan-1-al", fb:"CHO carbon is C1; no locant." },
            { t:"propanol", fb:"CHO carbon is C1; no locant." }] },
        { id:"q3", goal:1, prompt:"The smallest possible ketone has…",
          choices:[
            { t:"3 carbons", ok:true, fb:"Right. The C=O needs a carbon on each side." },
            { t:"1 carbon", fb:"The C=O needs a carbon on each side." },
            { t:"2 carbons", fb:"The C=O needs a carbon on each side." },
            { t:"4 carbons", fb:"The C=O needs a carbon on each side." }] },
        { id:"q4", goal:4, prompt:"Best negative control for the Tollens’ test?",
          choices:[
            { t:"propanone", ok:true, fb:"Right. A ketone shows what ‘no reaction’ looks like." },
            { t:"ethanal", fb:"A ketone shows what ‘no reaction’ looks like." },
            { t:"butanal", fb:"A ketone shows what ‘no reaction’ looks like." },
            { t:"methanal", fb:"A ketone shows what ‘no reaction’ looks like." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Name ↔ structure", summary:"Name ↔ structure", goal:[1, 2],
        instruction:"Eight structures. Match each one to its name. Some names belong to no structure here.",
        leftTitle:"Structure", rightTitle:"Name",
        left:[
          { id:"l1", t:"HCHO", why:"Methanal: one carbon, with the C=O carbon carrying two H." },
          { id:"l2", t:"CH₃CHO", why:"Ethanal: 2 carbons, counting the CHO carbon." },
          { id:"l3", t:"CH₃CH₂CHO", why:"Propanal: 3 carbons; the CHO carbon is C1, so no locant." },
          { id:"l4", t:"CH₃COCH₂CH₃", why:"Butanone: the C=O is inside the chain, and with 4 carbons it can only be on C2.",
            hints:["Is there an H on the carbonyl carbon?", "No: ketone.", "butanone (no locant needed: only one possible position)."] },
          { id:"l5", t:"CH₃COCH₂CH₂CH₃", why:"Pentan-2-one: numbered from the end nearer the C=O." },
          { id:"l6", t:"CH₃CH₂COCH₂CH₃", why:"Pentan-3-one: the C=O sits on the middle carbon." },
          { id:"l7", t:"(CH₃)₂CHCH₂CHO", why:"3-methylbutanal: numbered from the CHO carbon, the branch is on C3.",
            hints:["The CHO carbon is C1.", "Count to the branch.", "3-methylbutanal."] },
          { id:"l8", t:RING, why:"Cyclohexanone: a 6-carbon ring with a C=O, which is a ketone (the carbonyl carbon has two carbon neighbours)." }],
        right:[{ id:"r1", t:"methanal" }, { id:"r2", t:"ethanal" }, { id:"r3", t:"propanal" }, { id:"r4", t:"butanone" }, { id:"r5", t:"pentan-2-one" },
          { id:"r6", t:"pentan-3-one" }, { id:"r7", t:"3-methylbutanal" }, { id:"r8", t:"cyclohexanone" },
          { id:"x1", t:"butanal" }, { id:"x2", t:"pentan-4-one" }, { id:"x3", t:"2-methylbutanal" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l4|x1":"The C=O is inside the chain. " + M3, "l5|x2":M5, "l7|x3":"Number from the CHO carbon: the branch is on C3." },
        wrongDefault:FIND },
      { id:"unknowns", type:"custom", title:"Identify the unknown", summary:"Identify the unknown", star:true, goal:[2, 3, 4, 5],
        instruction:"Six unknowns. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Read the clues, tap your answer, then press Check.",
        items:[
          { id:"u1", goal:[2, 4], prompt:"C₃H₆O; negative Tollens’ test",
            options:[
              { t:"propanone", ok:true, why:"A C₃H₆O ketone: its carbonyl carbon has no H, so there’s no silver mirror." },
              { t:"propanal", why:"Propanal would give a silver mirror." }] },
          { id:"u2", goal:[2, 4], prompt:"C₄H₈O; positive Tollens’ test; branched chain",
            options:[
              { t:"2-methylpropanal", ok:true, why:"An aldehyde (positive Tollens’ test) with a branched chain." },
              { t:"butanal", why:"Not branched." },
              { t:"butanone", why:M4 }] },
          { id:"u3", goal:3, star:true, prompt:"Order by boiling point, lowest first: butanone, pentane, butan-1-ol (all ≈ 72–74 g/mol)",
            options:[
              { t:"pentane < butanone < butan-1-ol", ok:true, why:"London only; plus dipole–dipole; plus H-bonds: 36 °C, 80 °C, 118 °C." },
              { t:"pentane < butan-1-ol < butanone", why:"Butanone can’t H-bond to itself." },
              { t:"butanone < pentane < butan-1-ol", why:"Butanone’s dipole raises its boiling point." },
              { t:"all about the same", why:"Similar masses, different forces." }] },
          { id:"u4", goal:[4, 5], star:true, prompt:"Alcohol A (C₄H₁₀O) is oxidized to B, which gives a positive Benedict’s test. B is unbranched. Name A.",
            options:[
              { t:"butan-1-ol", ok:true, why:"Primary → butanal, an unbranched aldehyde: positive Benedict’s test." },
              { t:"butan-2-ol", why:"That gives butanone (negative)." },
              { t:"2-methylpropan-1-ol", why:"Branched." },
              { t:"2-methylpropan-2-ol", why:"Tertiary: it isn’t oxidized at all, so there’s no B." }] },
          { id:"u5", goal:4, star:true, prompt:"<strong>Investigation:</strong> A student finds a ‘positive’ Tollens’ result for propanone. Which is the most likely explanation?",
            options:[
              { t:"contaminated glassware or sample", ok:true, why:"Ketones don’t oxidize under these conditions; rerun with clean glassware and a negative control." },
              { t:"ketones sometimes oxidize", why:"Ketones don’t oxidize under these conditions; rerun with clean glassware and a negative control." },
              { t:"the mirror is from propanone", why:"Ketones don’t oxidize under these conditions; rerun with clean glassware and a negative control." },
              { t:"the test is reversed", why:"Ketones don’t oxidize under these conditions; rerun with clean glassware and a negative control." }] },
          { id:"u6", goal:[2, 4], star:true, prompt:"How many C₅H₁₀O carbonyl compounds give a <strong>negative</strong> Tollens’ test?",
            options:[
              { t:"3", ok:true, why:"Only ketones are negative: pentan-2-one, pentan-3-one and 3-methylbutan-2-one." },
              { t:"7", why:"That counts the 4 aldehydes too." },
              { t:"2", why:"Don’t forget 3-methylbutan-2-one." },
              { t:"4", why:"Pentan-4-one is pentan-2-one: count each structure once." }],
            hints:["Negative means ketone.", "List C₅ ketones: C=O on C2 or C3, straight or branched.", "pentan-2-one, pentan-3-one, 3-methylbutan-2-one."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Beatriz", how:"",
        instruction:"Beatriz made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Name (CH₃)₂CHCHO.",
            steps:["The C=O carbon has an H, so it’s an aldehyde.", "The longest chain through the CHO carbon has 3 carbons.", "Number from the far end: the CHO is on C3 and the methyl on C2.", "Name: 2-methylpropan-3-al."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"The CHO carbon is always C1: 2-methylpropanal.", ok:true, why:M1 },
              { t:"Name it 2-methylpropanone.", why:M3 },
              { t:"Name it butanal.", why:"The chain is 3 carbons with a branch." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Where does aldehyde numbering start?", "At the CHO carbon.", "2-methylpropanal."] },
          { id:"e2", goal:3, task:"Explain why butanal (75 °C) boils below butan-1-ol (118 °C).",
            steps:["Both have 4 carbons and similar molar masses.", "Both molecules are polar.", "Both form hydrogen bonds between molecules, but butanal’s are weaker.", "So butanal boils lower."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "The conclusion is right, but for the wrong reason."],
            fixes:[
              { t:"Butanal has no O–H, so it can’t H-bond to itself; only butan-1-ol can. Dipole–dipole forces are weaker.", ok:true, why:M2 },
              { t:"Butanal is heavier.", why:"It’s slightly lighter, and mass isn’t the main reason." },
              { t:"Butanal is nonpolar.", why:"Its C=O is polar." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which molecule has an O–H?", "Only the alcohol.", "No H-bonds between butanal molecules."] },
          { id:"e3", goal:4, task:"Predict the result of Tollens’ test on butanone.",
            steps:["Butanone has a C=O.", "Tollens’ reagent oxidizes compounds that can be oxidized easily.", "All carbonyl compounds oxidize easily.", "So butanone gives a silver mirror."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"Only aldehydes oxidize easily; a ketone’s carbonyl carbon has no H. Butanone gives no mirror.", ok:true, why:M4 },
              { t:"Butanone gives a brick-red precipitate instead.", why:M4 },
              { t:"Butanone turns into butanoic acid.", why:M4 },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Does butanone’s carbonyl carbon carry an H?", "No: two carbons.", "Negative result."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that a small shift of the C=O changes the family, or that propanone mixes with water?" },
      { id:"j2", q:"In your own words, explain why aldehydes and ketones boil between alkanes and alcohols." },
      { id:"j3", q:"Explain to a friend how one test can tell an aldehyde from a ketone." },
      { id:"j4", q:"What still confuses you about naming carbonyl compounds? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Name CH₃CH₂CH₂CHO.", options:[
          { t:"butanal", ok:true, why:"4 carbons including the CHO carbon." },
          { t:"propanal", why:"Count the CHO carbon too. " + M1 },
          { t:"butanone", why:"C=O at the end: aldehyde. " + M3 },
          { t:"butan-1-ol", why:"That’s the alcohol." }] },
        b:{ prompt:"Name CH₃COCH₂CH₂CH₃.", options:[
          { t:"pentan-2-one", ok:true, why:"5 carbons, numbered so the C=O gets the lowest locant: C2." },
          { t:"pentan-4-one", why:M5 },
          { t:"pentanal", why:"C=O inside the chain: ketone. " + M3 },
          { t:"butanone", why:"Count again: 5 carbons." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which compound is a ketone?", options:[
          { t:"CH₃CH₂COCH₃", ok:true, why:"C=O between two carbons." },
          { t:"CH₃CH₂CH₂CHO", why:"Aldehyde. " + M3 },
          { t:"CH₃CH₂CH₂OH", why:"Alcohol." },
          { t:"CH₃CH₂COOH", why:"Carboxylic acid." }] },
        b:{ prompt:"Which compound is an aldehyde?", options:[
          { t:"HCHO", ok:true, why:"Methanal: the carbonyl carbon carries H." },
          { t:"CH₃COCH₃", why:"Ketone. " + M3 },
          { t:"CH₃OCH₃", why:"Ether." },
          { t:"CH₃OH", why:"Alcohol." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which compound gives a silver mirror in Tollens’ test?", options:[
          { t:"ethanal", ok:true, why:"An aldehyde is oxidized." },
          { t:"propanone", why:"Ketones don’t react. " + M4 },
          { t:"ethanol", why:"Tollens’ reagent doesn’t oxidize alcohols." },
          { t:"ethane", why:"No functional group to oxidize." }] },
        b:{ prompt:"Which compound does <strong>not</strong> react with a mild oxidizing agent?", options:[
          { t:"butanone", ok:true, why:"Ketone. " + M4 },
          { t:"butanal", why:"Aldehydes oxidize to acids." },
          { t:"butan-1-ol", why:"Primary alcohols oxidize." },
          { t:"propanal", why:"Aldehyde." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Order by boiling point, lowest first: butane, propanal, propan-1-ol (all ≈ 58–60 g/mol).", options:[
          { t:"butane < propanal < propan-1-ol", ok:true, why:"London only; plus dipole–dipole; plus H-bonds." },
          { t:"propanal < butane < propan-1-ol", why:"The polar aldehyde boils above butane." },
          { t:"butane < propan-1-ol < propanal", why:M2 },
          { t:"All about the same", why:"Similar masses, different forces." }] },
        b:{ prompt:"Order by boiling point, lowest first: pentane, butanone, butan-1-ol (all ≈ 72–74 g/mol).", options:[
          { t:"pentane < butanone < butan-1-ol", ok:true, why:"36 °C, 80 °C, 118 °C." },
          { t:"butanone < pentane < butan-1-ol", why:"Butanone’s dipole raises its boiling point." },
          { t:"pentane < butan-1-ol < butanone", why:M2 },
          { t:"All about the same", why:"Similar masses, different forces." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Alcohol X, C₃H₈O, is oxidized to Y. Y gives a positive Benedict’s test. What is X?", options:[
          { t:"propan-1-ol", ok:true, why:"Primary → propanal, an aldehyde." },
          { t:"propan-2-ol", why:"That gives propanone: negative test." },
          { t:"methoxyethane", why:"An ether doesn’t oxidize." },
          { t:"propanone", why:"Not C₃H₈O, and not an alcohol." }] },
        b:{ prompt:"Alcohol X, C₄H₁₀O, is oxidized to Y. Y does <strong>not</strong> react with Tollens’ reagent. What is X?", options:[
          { t:"butan-2-ol", ok:true, why:"Secondary → butanone." },
          { t:"butan-1-ol", why:"That gives butanal: positive." },
          { t:"2-methylpropan-1-ol", why:"That gives an aldehyde: positive." },
          { t:"2-methylpropan-2-ol", why:"Tertiary: it isn’t oxidized at all, so there’s no Y." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"How many aldehydes and ketones have the formula C₄H₈O?", options:[
          { t:"3", ok:true, why:"butanal, 2-methylpropanal, butanone." },
          { t:"2", why:"Don’t forget the branched aldehyde." },
          { t:"4", why:"Butan-2-one and butanone are the same molecule." },
          { t:"5", why:"Only three distinct structures." }] },
        b:{ prompt:"How many ketones have the formula C₅H₁₀O?", options:[
          { t:"3", ok:true, why:"pentan-2-one, pentan-3-one, 3-methylbutan-2-one." },
          { t:"2", why:"Don’t forget the branched ketone." },
          { t:"4", why:"Pentan-4-one is pentan-2-one." },
          { t:"7", why:"That includes the four aldehydes." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why propanone dissolves in water?", options:[
          { t:"“Its C=O oxygen accepts hydrogen bonds from water molecules, and its small carbon groups don’t block it.”", ok:true, why:"Water’s O–H can H-bond to the C=O oxygen." },
          { t:"“Propanone has an O–H group.”", why:"It doesn’t." },
          { t:"“Propanone reacts with water to form an alcohol.”", why:"It dissolves without reacting." },
          { t:"“All organic compounds dissolve in water.”", why:"Alkanes don’t." }] },
        b:{ prompt:"Which is the best explanation of why butanal boils at 75 °C but butan-1-ol at 118 °C?", options:[
          { t:"“Butanal has no O–H, so its molecules attract by dipole–dipole forces, not hydrogen bonds.”", ok:true, why:M2 },
          { t:"“Butanal is nonpolar.”", why:"Its C=O is polar." },
          { t:"“Butanal’s hydrogen bonds are weaker.”", why:M2 },
          { t:"“Butanal is much heavier.”", why:"It’s slightly lighter." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement best explains why aldehydes are oxidized but ketones aren’t?", options:[
          { t:"“An aldehyde’s carbonyl carbon has an H that can be replaced by OH; a ketone’s carbonyl carbon is bonded to two carbons instead.”", ok:true, why:"Only the aldehyde has an H on its carbonyl carbon." },
          { t:"“Ketones have no C=O.”", why:"They do." },
          { t:"“Aldehydes have an O–H group.”", why:"They don’t." },
          { t:"“Ketones are always larger molecules.”", why:"Size isn’t the reason. " + M4 }] },
        b:{ prompt:"Which equation shows the oxidation of ethanal?", options:[
          { t:"CH₃CHO + [O] → CH₃COOH", ok:true, why:"The H on the carbonyl carbon becomes OH: ethanal → ethanoic acid." },
          { t:"CH₃CHO + [O] → CH₃COCH₃", why:"Oxidation doesn’t add a carbon." },
          { t:"CH₃CHO + H₂ → CH₃CH₂OH", why:"That’s reduction." },
          { t:"CH₃CHO → CH₄ + CO", why:"Not an oxidation." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Benzaldehyde (almond flavour) left in an open bottle slowly forms white crystals of benzoic acid. What happened?", options:[
          { t:"The aldehyde was oxidized by oxygen in the air to a carboxylic acid", ok:true, why:"The H on its carbonyl carbon became OH: benzaldehyde → benzoic acid." },
          { t:"It was reduced to an alcohol", why:"Air oxidizes; it doesn’t reduce." },
          { t:"It turned into a ketone", why:"Oxidation of an aldehyde gives an acid, not a ketone." },
          { t:"It evaporated, leaving crystals of the same compound", why:"Benzoic acid is a new substance." }] },
        b:{ prompt:"Propanone is used in nail-polish remover. Which properties make it suitable?", options:[
          { t:"It dissolves both polar and nonpolar substances, and it evaporates easily (56 °C)", ok:true, why:"Its polar C=O and its small nonpolar CH₃ groups let it dissolve both kinds, and 56 °C is a low boiling point." },
          { t:"It’s strongly acidic", why:"Ketones aren’t acids." },
          { t:"It forms hydrogen bonds with itself", why:M2 },
          { t:"It has a very high boiling point", why:"56 °C is low." }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"Cinnamaldehyde (cinnamon flavour) has a benzene ring, a C=C and a –CHO group. What result do you expect from Tollens’ test?", options:[
          { t:"A silver mirror (positive), because it has an aldehyde group", ok:true, why:"The –CHO group is oxidized, whatever else the molecule carries." },
          { t:"No change, because the benzene ring blocks the reaction", why:"The CHO group still reacts." },
          { t:"The C=C is oxidized instead", why:"Tollens’ test responds to the aldehyde." },
          { t:"No change, because it’s a ketone", why:"The C=O is at the end, with an H. " + M3 }] },
        b:{ prompt:"Butanedione (butter flavour), CH₃COCOCH₃, has two C=O groups. Each carbonyl carbon is bonded to two carbons. What result do you expect from Tollens’ test?", options:[
          { t:"No mirror (negative): both carbonyls are ketone groups", ok:true, why:"Each carbonyl carbon is bonded to two carbons: no H to replace." },
          { t:"A mirror, because it has two C=O groups", why:"Ketone groups don’t react. " + M4 },
          { t:"A mirror, because it’s an aldehyde", why:M3 },
          { t:"A brick-red precipitate", why:"That’s a Benedict’s result, and it would need an aldehyde." }] } }
    ]
  },
  task:{
    title:"Ketone factory", summary:"Ketone factory",
    statement:"<p>Choose an alcohol that a factory can oxidize into a ketone, then name the ketone. Can you find every answer?</p><ol class=\"ak-conds\"><li>The alcohol has 5 carbons (C₅H₁₂O).</li><li>It can be oxidized by [O].</li><li>The product gives a negative Tollens’ test.</li><li>You named the product correctly.</li></ol><p class=\"tiny muted\">Tap an atom in the builder, then use the buttons under it: add a C, put the –OH on a carbon, or remove an end atom. Hydrogen atoms fill in automatically, and the builder checks valence (C makes 4 bonds; the O is always an –OH). Then name the product with the chips.</p>",
    checks:["5-carbon alcohol", "Oxidizable", "Negative Tollens’ product", "Product named correctly"],
    tips:["Count all carbons, including branches.", "Tertiary alcohols don’t oxidize.", "A primary alcohol makes an aldehyde, which gives a mirror.", "The ketone keeps the same carbon skeleton; give the C=O the lowest locant."],
    explainPrompt:"Explain how the alcohol’s class decides whether the product passes the Tollens’ test.",
    vocab:"Use the words secondary, oxidation, ketone and aldehyde.",
    after3:"Every answer is a secondary alcohol. The ketone’s C=O sits exactly where the alcohol’s OH was."
  },
  cards:[
    ["Carbonyl group", "C=O; polar (δ− on O, δ+ on C)."],
    ["Aldehyde", "C=O at the end, with H on the carbonyl carbon; suffix -al (propanal)."],
    ["Ketone", "C=O inside the chain, bonded to two carbons; suffix -one (pentan-2-one)."],
    ["Aldehyde numbering", "The CHO carbon is C1; no locant for it."],
    ["Smallest ketone", "Propanone (3 carbons), also called acetone."],
    ["Boiling points", "Alkane < aldehyde or ketone < alcohol, for similar molar masses."],
    ["Solubility", "Small aldehydes and ketones dissolve: water H-bonds to the carbonyl O."],
    ["Oxidation", "Aldehyde → carboxylic acid; ketones resist oxidation."],
    ["Tollens’ test", "Silver mirror with aldehydes; no change with ketones."],
    ["Benedict’s test", "Blue → brick-red with simple aldehydes; stays blue with ketones."],
    ["From alcohols", "Primary alcohol → aldehyde; secondary alcohol → ketone."]
  ]
};
