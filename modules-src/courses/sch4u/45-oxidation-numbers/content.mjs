// SCH4U 45 Assigning Oxidation Numbers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/45-oxidation-numbers.md
// Pictures (hero beaker and tagged equation, the C14 oxidation number calculator, the Part 3 particle zoom, the task
// preview) are drawn by app.js. The species, reactions and their oxidation numbers live in app.js; no course-table
// values are needed (plan §6 risk 3).

// Misconception core sentences (plan §3)
const M1 = "The ion’s charge is the <strong>sum</strong> of all its atoms’ numbers. Solve for the one unknown atom.";
const M2 = "There are two Cr atoms: 2<i>x</i> + 7(−2) = −2, so <i>x</i> = +6.";
const M3 = "In peroxides O is −1; in metal hydrides H is −1. Check the rule list in order.";
const M4 = "The species that is oxidized gives away electrons, so it is the <strong>reducing</strong> agent.";
const M5 = "Reduction means <strong>gaining</strong> electrons, so the number <strong>decreases</strong>: think “reduce the number”.";
const M6 = "Check every atom. If no oxidation number changes, it isn’t redox.";
const M7 = "Write the sign first (+2) and give one number per atom.";

const B = el => "<strong>" + el + "</strong>";

export default {
  id:"45-oxidation-numbers",
  kind:"topic",
  title:"Assigning oxidation numbers",
  topic:"Assigning Oxidation Numbers",
  readyTopic:"assigning oxidation numbers",
  hero:{
    headline:"Follow the numbers, find the electrons",
    text:"An <strong>oxidation number</strong> tracks where electrons go. When an atom’s number goes <strong>up</strong>, it has lost electrons: it is <strong>oxidized</strong>. When it goes <strong>down</strong>, it has gained electrons: it is <strong>reduced</strong>. The two always happen together.",
    fig:{ html:'<div class="ox-hx"><div class="ox-hx-eq" id="ox-hx-eq"></div><svg class="ox-hx-svg" id="ox-hx-svg" viewBox="0 0 480 270" role="img" aria-label="A zinc strip stands in a blue copper(II) solution. Two violet electrons hop from a zinc atom on the strip to a Cu²⁺ ion. The zinc atom’s tag ticks from 0 to +2 and it drifts into the solution as Zn²⁺; the Cu²⁺ ion’s tag ticks from +2 to 0 and copper settles on the strip as a brown deposit. Labels read: Zn oxidized, number up; Cu²⁺ reduced, number down."></svg><div class="ox-hx-row"><p class="ox-hx-ctr" id="ox-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ox-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can apply the oxidation-number rules in order, including the exceptions for peroxides and metal hydrides.",
    "I can find the oxidation number of an atom in a compound or polyatomic ion from the sum rule.",
    "I can identify what is oxidized and what is reduced from changes in oxidation numbers.",
    "I can name the oxidizing agent and the reducing agent, and count the electrons transferred.",
    "I can decide whether a reaction is redox and explain my decision with oxidation numbers."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Ion charges", goal:1,
          prompt:"What is the charge on a magnesium ion?",
          options:[
            { t:"2+", ok:true, why:"Group 2 metals lose two electrons: Mg²⁺." },
            { t:"2−", why:"Metals lose electrons and become positive." },
            { t:"1+", why:"That’s Group 1." },
            { t:"0", why:"The neutral atom is 0; the ion is 2+." }],
          hints:["Which group is Mg in?", "Group 2 atoms lose 2 electrons.", "Mg²⁺."] },
        { id:"w2", skill:"Ion charges", goal:2,
          prompt:"Which formula is correct for aluminium oxide?",
          options:[
            { t:"Al₂O₃", ok:true, why:"2(+3) + 3(−2) = 0." },
            { t:"AlO", why:"Al³⁺ and O²⁻ don’t cancel 1 : 1." },
            { t:"Al₃O₂", why:"3(+3) + 2(−2) = +5." },
            { t:"AlO₃", why:"+3 + 3(−2) = −3." }],
          hints:["Charges: Al³⁺, O²⁻.", "Find the lowest total that cancels: 6.", "Al₂O₃."] },
        { id:"w3", skill:"Polyatomic ions", goal:2,
          prompt:"What is the charge on the sulfate ion, SO₄?",
          options:[
            { t:"2−", ok:true, why:"Sulfate is SO₄²⁻." },
            { t:"1−", why:"That’s hydrogen sulfate, HSO₄⁻." },
            { t:"3−", why:"That’s phosphate, PO₄³⁻." },
            { t:"2+", why:"Polyatomic oxyanions are negative." }],
          hints:["Think of sulfuric acid, H₂SO₄.", "Two H⁺ balance one sulfate.", "SO₄²⁻."] },
        { id:"w4", skill:"Polyatomic ions", goal:2,
          prompt:"Which is the nitrate ion?",
          options:[
            { t:"NO₃⁻", ok:true, why:"One N, three O and one negative charge." },
            { t:"NO₂⁻", why:"That’s nitrite." },
            { t:"NO₃²⁻", why:"Nitrate carries one negative charge." },
            { t:"NH₄⁺", why:"That’s ammonium." }],
          hints:["Nitric acid is HNO₃.", "One H⁺, so the ion is 1−.", "NO₃⁻."] },
        { id:"w5", skill:"Electron transfer", goal:3,
          prompt:"When a sodium atom becomes Na⁺, it…",
          options:[
            { t:"loses one electron", ok:true, why:"11 protons, 10 electrons: +1." },
            { t:"gains one electron", why:"Gaining a negative electron would make it negative." },
            { t:"gains a proton", why:"The nucleus doesn’t change in chemical reactions." },
            { t:"loses a proton", why:"That would change the element." }],
          hints:["Charge = protons − electrons.", "+1 means one more proton than electrons.", "It lost one electron."] },
        { id:"w6", skill:"Electron transfer", goal:3,
          prompt:"A chlorine atom becomes Cl⁻. What happened?",
          options:[
            { t:"It gained one electron", ok:true, why:"17 protons, 18 electrons: 1−." },
            { t:"It lost one electron", why:"That would give Cl⁺." },
            { t:"It gained a proton", why:"Protons don’t move in chemistry." },
            { t:"It lost a neutron", why:"Neutrons don’t affect charge." }],
          hints:["Negative ions have extra electrons.", "One extra.", "Gained one."] }
      ],
      refreshers:{
        "Ion charges":"Group 1 → 1+, Group 2 → 2+, Al → 3+; nonmetals gain electrons (O²⁻, Cl⁻). Formula charges must add to zero.",
        "Polyatomic ions":"Learn the common ones with their charges: NO₃⁻, SO₄²⁻, PO₄³⁻, CO₃²⁻, OH⁻, NH₄⁺, MnO₄⁻, Cr₂O₇²⁻.",
        "Electron transfer":"Losing electrons makes a species more positive; gaining them makes it more negative."
      }
    }
  },
  explore:{
    heading:"Oxidation number calculator",
    intro:"Pick a species and apply the rules one at a time. Then switch to a reaction and watch which numbers change.",
    how:"<strong>Assign:</strong> pick a species, type your own numbers in the boxes if you like, then press <strong>Apply next rule</strong> or <strong>Solve for the unknown</strong>. <strong>Reaction:</strong> pick a reaction, press <strong>Show the changes</strong>, and tag species: tap a species, then a tag.",
    modes:[{ id:"as", t:"Assign" }, { id:"rx", t:"Reaction" }],
    rules:[
      "An uncombined element: 0.",
      "A monatomic ion: its charge.",
      "F in a compound: −1.",
      "Group 1: +1; Group 2: +2; Al: +3 (in compounds).",
      "H: +1 with nonmetals, −1 with metals (hydrides).",
      "O: −2, except in peroxides (−1) and with F (+2).",
      "Cl, Br, I: −1, unless combined with O or a lighter halogen.",
      "The sum is 0 for a compound and equals the charge for an ion."
    ],
    tagNames:{ ox:"Mark as oxidized", red:"Mark as reduced", oa:"Oxidizing agent", ra:"Reducing agent" },
    tc3Why:{ label:"Why is Fe₃O₄’s number a fraction?",
      options:[
        { t:"The ore contains one Fe²⁺ and two Fe³⁺ per formula unit: (2 + 3 + 3) ÷ 3 = 8/3.", ok:true },
        { t:"Oxidation numbers can be any fraction because electrons split", why:"Electrons don’t split. The fraction is an average over atoms in different states." },
        { t:"The rule list doesn’t work for iron ores", why:"The rules work: they give the average over the three Fe atoms." },
        { t:"One Fe atom is +8 and the other two are 0", why:"No Fe in magnetite is +8. Two Fe³⁺ and one Fe²⁺ give 3 + 3 + 2 = 8 over 3 atoms." }] },
    notation:"Oxidation numbers are written sign first (+2, −1), one per atom. Ion charges are written sign last (2+).",
    predictions:[
      { id:"p1", prompt:"What is the oxidation number of S in SO₄²⁻?",
        options:[{ t:"+6", ok:true }, { t:"−2" }, { t:"+8" }, { t:"+2" }],
        explain:"The −2 belongs to the whole ion, not to S. The S must be +6 for the numbers to add to −2." },
      { id:"p2", prompt:"What is the oxidation number of O in hydrogen peroxide?",
        options:[{ t:"−1", ok:true }, { t:"−2" }, { t:"0" }, { t:"+1" }],
        explain:"In a peroxide the two O atoms share a bond, and each is −1: 2(+1) + 2(−1) = 0." },
      { id:"p3", prompt:"Reaction mode, HCl + NaOH. Which atoms change oxidation number?",
        options:[{ t:"None: it isn’t redox", ok:true }, { t:"H and O" }, { t:"Na and Cl" }, { t:"All of them" }],
        explain:"H stays +1, O −2, Na +1, Cl −1. Neutralization swaps partners without moving electrons." },
      { id:"p4", prompt:"Zn is oxidized. Which species is the oxidizing agent?",
        options:[{ t:"Cu²⁺", ok:true }, { t:"Zn" }, { t:"Zn²⁺" }, { t:"Cu" }],
        explain:"Cu²⁺ takes Zn’s electrons, so it causes the oxidation. It is reduced in the process." }
    ],
    chalIntro:"Use the calculator to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Assign every oxidation number in K₂Cr₂O₇.",
        why:"K is +1 and O is −2 from the rules; 2(+1) + 2<i>x</i> + 7(−2) = 0 gives Cr = +6.",
        general:"In Assign mode, pick K₂Cr₂O₇ and type a number in each box: K, Cr and O.",
        hints:["Assign K and O first, from the rule list.", "2(+1) + 2<i>x</i> + 7(−2) = 0.", "2<i>x</i> = 12, so Cr = +6."] },
      { id:"tc2", goal:4, prompt:"In R7, tag the oxidizing agent and the reducing agent, and enter the number of electrons transferred as the equation is written.",
        why:"Fe goes +3 → 0 (reduced), so Fe₂O₃ is the oxidizing agent; C goes +2 → +4 (oxidized), so CO is the reducing agent. 2 × 3 = 3 × 2 = 6 electrons.",
        general:"In Reaction mode, pick R7, tag both agents and enter the number of electrons.",
        hints:["Find the number for Fe and for C on both sides.", "Fe: +3 → 0. C: +2 → +4.", "Fe₂O₃ is reduced, so it is the oxidizing agent; CO is the reducing agent. 2 × 3 = 3 × 2 = 6 electrons."] },
      { id:"tc3", goal:2, stretch:true, prompt:"Magnetite, Fe₃O₄, is a magnetic iron ore. Find the oxidation number of Fe, then choose the explanation for your answer.",
        why:"3<i>x</i> + 4(−2) = 0 gives <i>x</i> = +8/3. Magnetite holds one Fe²⁺ and two Fe³⁺ per formula unit, so +8/3 is their average.",
        general:"In Assign mode, pick Fe₃O₄, type the Fe number in its box and choose an explanation.",
        hints:["3<i>x</i> + 4(−2) = 0.", "<i>x</i> = 8/3: not a whole number. What could that mean?", "Two Fe³⁺ and one Fe²⁺ give 3 + 3 + 2 = 8 over 3 atoms."] }
    ]
  },
  part3:{
    slug:"redox-or-not", name:"Redox or not?", heading:"Redox or not?",
    intro:"Some reactions move electrons and some only swap partners. Sort ten reactions, look for the patterns by reaction type, and see how an antioxidant protects food.",
    s1:{ title:"Station 1: The sorter",
      intro:"Tap a reaction card, then a bin. Open <strong>Zoom to the particles</strong> on any card to see the oxidation number above each atom." },
    bins:[{ id:"redox", t:"Redox" }, { id:"not", t:"Not redox" }],
    cards:[
      { id:"c1", eq:"2Na(s) + Cl₂(g) → 2NaCl(s)", type:"synthesis from elements", answer:"redox" },
      { id:"c2", eq:"AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)", type:"precipitation", answer:"not" },
      { id:"c3", eq:"Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)", type:"single displacement", answer:"redox" },
      { id:"c4", eq:"CaCO₃(s) → CaO(s) + CO₂(g)", type:"decomposition with no change", answer:"not" },
      { id:"c5", eq:"2H₂O(l) → 2H₂(g) + O₂(g)", type:"decomposition with change", answer:"redox" },
      { id:"c6", eq:"H₂SO₄(aq) + 2KOH(aq) → K₂SO₄(aq) + 2H₂O(l)", type:"neutralization", answer:"not" },
      { id:"c7", eq:"C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l)", type:"combustion", answer:"redox" },
      { id:"c8", eq:"Cu(s) + 2AgNO₃(aq) → Cu(NO₃)₂(aq) + 2Ag(s)", type:"single displacement", answer:"redox" },
      { id:"c9", eq:"Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)", type:"precipitation", answer:"not" },
      { id:"c10", eq:"2H₂O₂(aq) → 2H₂O(l) + O₂(g)", type:"disproportionation", answer:"redox" }
    ],
    s2:{ title:"Station 2: Patterns",
      locked:"Sort all ten cards correctly to open the patterns table.",
      table:{ head:["Reaction type", "Redox?"], rows:[["Single displacement", "Always"], ["Combustion", "Always"], ["Element + element", "Always"], ["Neutralization", "Never"], ["Precipitation", "Never"], ["Decomposition", "Sometimes: check"]] },
      why:"Why sometimes?",
      whyCap:"Check it with data: both are decompositions. In CaCO₃ every atom keeps its number; in water, H falls +1 → 0 and O rises −2 → 0." },
    blocks:[
      { title:"Station 3: Antioxidants",
        html:"<p>Vitamin C in juice reacts with dissolved oxygen before other compounds can. It is oxidized, so it acts as a <strong>reducing agent</strong>, and that protects the flavour and colour.</p><p class=\"tiny muted\">Question 4 below asks you to choose the correct statement about vitamin C.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Redox or not? quick check",
      items:[
        { id:"q1", goal:5, prompt:"Is BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaCl(aq) redox?",
          choices:[
            { t:"Not redox", ok:true, fb:"Right. Ba stays +2, Cl −1, Na +1, S +6 and O −2: every atom keeps its number." },
            { t:"Redox: Ba changes", fb:"Every atom keeps its number; forming a precipitate isn’t electron transfer." },
            { t:"Redox: S changes", fb:"Every atom keeps its number; forming a precipitate isn’t electron transfer." },
            { t:"Redox: a solid forms", fb:"Every atom keeps its number; forming a precipitate isn’t electron transfer." }] },
        { id:"q2", goal:3, prompt:"In Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g), what is reduced?",
          choices:[
            { t:"H⁺", ok:true, fb:"Right. H goes +1 → 0: its number falls." },
            { t:"Zn", fb:"H goes +1 → 0: its number falls." },
            { t:"Zn²⁺", fb:"H goes +1 → 0: its number falls." },
            { t:"H₂", fb:"H goes +1 → 0: its number falls." }] },
        { id:"q3", goal:5, prompt:"Which reaction type is always redox?",
          choices:[
            { t:"Single displacement", ok:true, fb:"Right. An element replaces an ion, so one species gains electrons and another loses them." },
            { t:"Neutralization", fb:"An element replaces an ion, so one species gains electrons and another loses them." },
            { t:"Precipitation", fb:"An element replaces an ion, so one species gains electrons and another loses them." },
            { t:"Decomposition", fb:"An element replaces an ion, so one species gains electrons and another loses them." }] },
        { id:"q4", goal:4, prompt:"Vitamin C protects food from oxygen. Vitamin C is…",
          choices:[
            { t:"oxidized; a reducing agent", ok:true, fb:"Right. It gives electrons to oxygen, so it is oxidized and acts as the reducing agent." },
            { t:"reduced; an oxidizing agent", fb:"It gives electrons to oxygen, so it is oxidized and acts as the reducing agent." },
            { t:"oxidized; an oxidizing agent", fb:"It gives electrons to oxygen, so it is oxidized and acts as the reducing agent." },
            { t:"unchanged", fb:"It gives electrons to oxygen, so it is oxidized and acts as the reducing agent." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"number", type:"numeric", title:"Number the atom", summary:"Number the atom", goal:[1, 2],
        instruction:"Enter the oxidation number of the <strong>bold</strong> atom.",
        how:"Type the number with its sign first, such as +4 or −1, then press Check. Fractions like 8/3 are fine.",
        items:[
          { id:"n1", goal:2, prompt:"" + B("N") + "O₂", answer:4, display:"+4", keypad:"text", label:"Oxidation number of N:",
            why:"<i>x</i> + 2(−2) = 0, so N is +4.",
            wrong:[{ match:-2, fb:"That’s O’s number." }],
            hints:["Assign O first: −2 each.", "<i>x</i> + 2(−2) = 0.", "<i>x</i> = +4."] },
          { id:"n2", goal:2, prompt:"" + B("N") + "₂O", answer:1, display:"+1", keypad:"text", label:"Oxidation number of N:",
            why:"2<i>x</i> + (−2) = 0, so each N is +1.",
            wrong:[{ match:2, fb:"Two N atoms share +2: each is +1." }],
            hints:["Two N atoms, one O.", "2<i>x</i> + (−2) = 0.", "<i>x</i> = +1."] },
          { id:"n3", goal:2, prompt:"" + B("Mn") + "O₂", answer:4, display:"+4", keypad:"text", label:"Oxidation number of Mn:",
            why:"<i>x</i> + 2(−2) = 0, so Mn is +4.",
            wrong:[{ match:2, fb:"Two O atoms: 2(−2) = −4." }],
            hints:["Assign O first.", "<i>x</i> + 2(−2) = 0.", "<i>x</i> = +4."] },
          { id:"n4", goal:2, prompt:"" + B("Cl") + "O₃⁻", answer:5, display:"+5", keypad:"text", label:"Oxidation number of Cl:",
            why:"<i>x</i> + 3(−2) = −1, so Cl is +5.",
            wrong:[{ match:-1, fb:"Cl is −1 only when it isn’t combined with O. " + M1 }, { match:6, fb:"The ion’s charge is −1, not 0." }],
            hints:["Cl is combined with O, so rule 7 doesn’t give −1. Assign O first.", "<i>x</i> + 3(−2) = −1.", "<i>x</i> = +5."] },
          { id:"n5", goal:1, prompt:"H" + B("Cl") + "O", answer:1, display:"+1", keypad:"text", label:"Oxidation number of Cl:",
            why:"(+1) + <i>x</i> + (−2) = 0, so Cl is +1.",
            wrong:[{ match:-1, fb:"Here Cl is bonded to O, so rule 7 doesn’t give −1." }],
            hints:["Assign H (+1) and O (−2) first.", "(+1) + <i>x</i> + (−2) = 0.", "<i>x</i> = +1."] },
          { id:"n6", goal:2, prompt:"" + B("C") + "₂O₄²⁻", answer:3, display:"+3", keypad:"text", label:"Oxidation number of C:",
            why:"2<i>x</i> + 4(−2) = −2, so each C is +3.",
            wrong:[{ match:6, fb:"That’s both C atoms together." }],
            hints:["Two C atoms.", "2<i>x</i> + 4(−2) = −2.", "<i>x</i> = +3."] },
          { id:"n7", goal:2, prompt:"H₂" + B("P") + "O₄⁻", answer:5, display:"+5", keypad:"text", label:"Oxidation number of P:",
            why:"2(+1) + <i>x</i> + 4(−2) = −1, so P is +5.",
            wrong:[{ match:6, fb:"The ion’s charge is −1: 2(+1) + <i>x</i> − 8 = −1." }],
            hints:["Assign H and O first.", "2(+1) + <i>x</i> + 4(−2) = −1.", "<i>x</i> = +5."] },
          { id:"n8", goal:1, prompt:"Li" + B("H"), answer:-1, display:"−1", keypad:"text", label:"Oxidation number of H:",
            why:"Li is +1 (rule 4); with a metal, H is −1.",
            wrong:[{ match:1, fb:"With a metal, H is −1 (a hydride)." }],
            hints:["Li is a Group 1 metal.", "Rule 5: H with a metal.", "H is −1."] }
        ] },
      { id:"agents", type:"custom", title:"Agents and electrons", summary:"Agents and electrons", star:true, goal:[3, 5],
        instruction:"Six items: choose an answer or enter a number. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap your choice or type your answer, then press Check.",
        items:[
          { id:"r1", kind:"chips", goal:4, prompt:"Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂. Reducing agent?",
            options:[
              { t:"Br⁻", ok:true, why:"Br goes −1 → 0: Br⁻ is oxidized, so it is the reducing agent." },
              { t:"Cl₂", why:"Cl₂ is reduced (0 → −1), so it’s the oxidizing agent." },
              { t:"Br₂", why:"Agents are reactants. Br₂ is what Br⁻ becomes." },
              { t:"Cl⁻", why:"Agents are reactants. Cl⁻ is what Cl₂ becomes." }],
            hints:["Find the number for Cl and Br on both sides.", "Cl: 0 → −1. Br: −1 → 0.", "Br⁻ is oxidized, so it is the reducing agent."] },
          { id:"r2", kind:"chips", goal:3, prompt:"CH₄ + 2O₂ → CO₂ + 2H₂O. Change in C’s number?",
            options:[
              { t:"−4 → +4 (+8)", ok:true, why:"In CH₄, <i>x</i> + 4(+1) = 0 gives −4; in CO₂, <i>x</i> + 2(−2) = 0 gives +4." },
              { t:"+4 only", why:"C starts at −4 in CH₄." },
              { t:"+4 → −4 (−8)", why:"C is −4 in CH₄ and +4 in CO₂: the number rises." },
              { t:"0 → +4 (+4)", why:"C in CH₄ is combined, not elemental: <i>x</i> + 4(+1) = 0 gives −4." }],
            hints:["Find C in CH₄ first.", "CH₄: <i>x</i> + 4(+1) = 0. CO₂: <i>x</i> + 2(−2) = 0.", "−4 → +4: a change of +8."] },
          { id:"r3", kind:"num", star:true, goal:4, prompt:"2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu. Electrons transferred as written?", answer:6, tol:0, unit:"electrons", display:"6 electrons", keypad:"numeric", label:"Electrons:",
            wrong:[{ match:3, fb:"Each Al loses 3, and there are 2 Al." }, { match:2, fb:"Each Cu²⁺ gains 2, and there are 3." }],
            fb:"Total rise = total fall: count every atom that changes.",
            why:"2 Al × 3 = 3 Cu × 2 = 6 electrons.",
            hints:["Al: 0 → +3. Cu: +2 → 0.", "Multiply by the coefficients: 2 Al, 3 Cu.", "2 × 3 = 3 × 2 = 6."] },
          { id:"r4", kind:"chips", star:true, goal:5, prompt:"In 2H₂O₂ → 2H₂O + O₂, which element is both oxidized and reduced?",
            options:[
              { t:"O (−1 → −2 and −1 → 0)", ok:true, why:"Some O atoms fall to −2 in H₂O and others rise to 0 in O₂." },
              { t:"H", why:"H stays +1." },
              { t:"Not redox", why:"O’s numbers change, in two directions." },
              { t:"H and O", why:"H stays +1." }],
            hints:["O in H₂O₂ is −1 (a peroxide).", "Find O in H₂O and in O₂.", "O: −1 → −2 and −1 → 0."] },
          { id:"r5", kind:"chips", star:true, goal:3, prompt:"<strong>Investigation:</strong> A copper wire is placed in colourless silver nitrate solution. After an hour, grey crystals coat the wire and the solution is pale blue. Which observation is the best evidence that copper was <strong>oxidized</strong>?",
            options:[
              { t:"The blue colour (Cu²⁺(aq) has formed)", ok:true, why:"Cu²⁺(aq) is blue, so the colour shows Cu atoms became Cu²⁺: 0 → +2." },
              { t:"Grey crystals", why:"Those show that Ag⁺ was reduced to Ag." },
              { t:"The wire got thinner", why:"That’s possible, but harder to measure; the colour is direct evidence of Cu²⁺." },
              { t:"The solution was colourless at the start", why:"That’s the starting state; look for a change that shows Cu²⁺ formed." }],
            hints:["Oxidized copper becomes Cu²⁺.", "What colour is Cu²⁺(aq)?", "The blue colour."] },
          { id:"r6", kind:"chips", star:true, goal:3, prompt:"Nitrogen compounds in soil: NH₄⁺ → NO₃⁻. By how much does N’s number change, and is N oxidized or reduced?",
            options:[
              { t:"−3 → +5: +8, oxidized", ok:true, why:"The number rises by 8, so N is oxidized." },
              { t:"+5, oxidized", why:"Start from N = −3 in NH₄⁺." },
              { t:"−8, reduced", why:"The number rises, so N is oxidized." },
              { t:"+3 → +5: +2, oxidized", why:"In NH₄⁺, H is +1: <i>x</i> + 4 = +1, so N is −3." }],
            hints:["Find N in each ion.", "NH₄⁺: <i>x</i> + 4 = +1, so −3. NO₃⁻: <i>x</i> − 6 = −1, so +5.", "The number rises by 8: oxidized."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Mairead", how:"", goal:[2, 4],
        instruction:"Mairead made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"In 2Mg + O₂ → 2MgO, what is reduced?",
            steps:["Mg: 0 → +2. O: 0 → −2.", "Mg’s number goes up, so Mg is reduced.", "So O is oxidized."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Mg’s number goes up, so Mg is <strong>oxidized</strong>; O’s goes down, so O is <strong>reduced</strong>.", ok:true, why:"Up means electrons lost: oxidation. Down means electrons gained: reduction." },
              { t:"Mg gains oxygen, so Mg is reduced.", why:"Gaining oxygen goes with oxidation." },
              { t:"Both are oxidized because O₂ is involved.", why:"One rises and one falls." },
              { t:"Step 2 is correct.", why:"Up means electrons lost: oxidation." }],
            hints:["Up or down: which means losing electrons?", "Losing electrons raises the number.", "Mg is oxidized; O is reduced."] },
          { id:"e2", goal:4, task:"Name the agents in Fe₂O₃ + 3CO → 2Fe + 3CO₂.",
            steps:["Fe: +3 → 0. C: +2 → +4.", "Fe is reduced and C is oxidized.", "So Fe₂O₃ is the reducing agent and CO is the oxidizing agent."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Fe₂O₃ is reduced, so it’s the <strong>oxidizing</strong> agent; CO is oxidized, so it’s the <strong>reducing</strong> agent.", ok:true, why:M4 },
              { t:"CO₂ is the oxidizing agent.", why:"Agents are reactants." },
              { t:"Fe is the reducing agent.", why:"Fe is a product." },
              { t:"Step 3 is correct.", why:"The species that is reduced is the oxidizing agent." }],
            hints:["What does an oxidizing agent do to the other species?", "It takes electrons, so it is itself reduced.", "Fe₂O₃ is the oxidizing agent."] },
          { id:"e3", goal:2, task:"Find the oxidation number of Mn in KMnO₄.",
            steps:["K is +1 and O is −2.", "+1 + <i>x</i> + (−2) = 0.", "So Mn is +1."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"There are four O atoms: +1 + <i>x</i> + 4(−2) = 0, so Mn is +7.", ok:true, why:"Multiply by the subscript: 4 O atoms." },
              { t:"+1 + <i>x</i> + (−2) = −1.", why:"KMnO₄ is neutral; the sum is 0." },
              { t:"Mn is −1, the charge of MnO₄⁻.", why:"That’s the ion’s charge." },
              { t:"Step 2 is correct.", why:"Multiply by the subscript: 4 O atoms." }],
            hints:["How many O atoms?", "Four: 4(−2) = −8.", "Mn = +7."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result in Explore surprised you most: the peroxide, the neutralization with no changes, or magnetite’s fraction? Why?" },
      { id:"j2", q:"In your own words, explain why the species that is oxidized is called the reducing agent." },
      { id:"j3", q:"Explain to a friend how to find the oxidation number of one atom in a polyatomic ion." },
      { id:"j4", q:"Which rule or term do you still mix up? Write a memory trick you’ll use." }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What is the oxidation number of Cr in CrO₄²⁻?", options:[
          { t:"+6", ok:true, why:"<i>x</i> + 4(−2) = −2." },
          { t:"−2", why:"That’s the ion’s charge. " + M1 },
          { t:"+8", why:"The sum must be −2, not 0." },
          { t:"+4", why:"Each O is −2, not −1." }] },
        b:{ prompt:"What is the oxidation number of N in NO₂⁻?", options:[
          { t:"+3", ok:true, why:"<i>x</i> + 2(−2) = −1." },
          { t:"−1", why:"That’s the ion’s charge. " + M1 },
          { t:"+4", why:"The sum must be −1, not 0." },
          { t:"+5", why:"That’s N in NO₃⁻." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"In a redox reaction, the species that is oxidized…", options:[
          { t:"loses electrons, and its oxidation number increases", ok:true, why:"Losing negative charge raises the number." },
          { t:"gains electrons, and its oxidation number decreases", why:"That describes reduction." },
          { t:"loses electrons, and its oxidation number decreases", why:"Losing negative charge raises the number." },
          { t:"must gain oxygen atoms", why:"Oxygen isn’t required." }] },
        b:{ prompt:"In a redox reaction, the species that is reduced…", options:[
          { t:"gains electrons, and its oxidation number decreases", ok:true, why:"Gaining negative charge lowers the number." },
          { t:"loses electrons, and its oxidation number increases", why:"That describes oxidation. " + M5 },
          { t:"gains electrons, and its oxidation number increases", why:"Gaining negative charge lowers the number." },
          { t:"must lose oxygen atoms", why:"Oxygen isn’t required." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What is the oxidation number of O in sodium peroxide, Na₂O₂?", options:[
          { t:"−1", ok:true, why:"2(+1) + 2<i>x</i> = 0." },
          { t:"−2", why:"Peroxides are the exception." },
          { t:"0", why:"O is combined, not elemental." },
          { t:"+1", why:"The sum would be +4." }] },
        b:{ prompt:"What is the oxidation number of H in calcium hydride, CaH₂?", options:[
          { t:"−1", ok:true, why:"+2 + 2<i>x</i> = 0." },
          { t:"+1", why:"With a metal, H is −1." },
          { t:"0", why:"H is combined." },
          { t:"−2", why:"Two H atoms share −2: each is −1." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"What is the average oxidation number of S in the thiosulfate ion, S₂O₃²⁻?", options:[
          { t:"+2", ok:true, why:"2<i>x</i> + 3(−2) = −2, so 2<i>x</i> = 4." },
          { t:"+3", why:"That uses 0 for the sum; the ion is 2−." },
          { t:"+4", why:"That treats the two S atoms as one." },
          { t:"−2", why:"That’s the ion’s charge. " + M1 }] },
        b:{ prompt:"What is the average oxidation number of C in propane, C₃H₈?", options:[
          { t:"−8/3", ok:true, why:"3<i>x</i> + 8(+1) = 0." },
          { t:"−8", why:"That’s the total for three C atoms." },
          { t:"−4", why:"That’s C in CH₄, not propane." },
          { t:"+8/3", why:"H is +1, so C must be negative." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu. Which is the oxidizing agent?", options:[
          { t:"Cu²⁺", ok:true, why:"Cu: +2 → 0, reduced, so it’s the oxidizing agent." },
          { t:"Al", why:"Al is oxidized: it’s the reducing agent." },
          { t:"Al³⁺", why:"Agents are reactants." },
          { t:"Cu", why:"Cu is a product." }] },
        b:{ prompt:"Cl₂ + 2I⁻ → 2Cl⁻ + I₂. Which is the reducing agent?", options:[
          { t:"I⁻", ok:true, why:"I: −1 → 0, oxidized, so it’s the reducing agent." },
          { t:"Cl₂", why:"Cl₂ is reduced (0 → −1): it’s the oxidizing agent. " + M4 },
          { t:"I₂", why:"A product." },
          { t:"Cl⁻", why:"A product." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"How many electrons are transferred in Fe₂O₃ + 3CO → 2Fe + 3CO₂ as written?", options:[
          { t:"6", ok:true, why:"2 Fe × 3 = 3 C × 2 = 6." },
          { t:"3", why:"That’s one Fe atom’s gain." },
          { t:"2", why:"That’s one C atom’s loss." },
          { t:"12", why:"Count the transfer once, not on both sides." }] },
        b:{ prompt:"How many electrons are transferred in 3Mg + 2Fe³⁺ → 3Mg²⁺ + 2Fe as written?", options:[
          { t:"6", ok:true, why:"3 Mg × 2 = 2 Fe × 3 = 6." },
          { t:"2", why:"One Mg." },
          { t:"3", why:"One Fe." },
          { t:"12", why:"Counted twice." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why HCl + NaOH → NaCl + H₂O is <strong>not</strong> a redox reaction?", options:[
          { t:"“No atom’s oxidation number changes: H stays +1, O −2, Na +1 and Cl −1, so no electrons are transferred.”", ok:true, why:"Redox needs some oxidation number to change." },
          { t:"“No oxygen gas takes part.”", why:"Redox doesn’t need O₂." },
          { t:"“It forms water, and reactions that form water can’t be redox.”", why:"2H₂ + O₂ → 2H₂O forms water and is redox." },
          { t:"“Ions are present, so it must be redox.”", why:M6 }] },
        b:{ prompt:"Which is the best explanation of why 2Mg + O₂ → 2MgO <strong>is</strong> a redox reaction?", options:[
          { t:"“Mg goes 0 → +2 (loses electrons) and O goes 0 → −2 (gains them): electrons move from Mg to O.”", ok:true, why:"Numbers change in both directions: electrons move." },
          { t:"“Oxygen is present, so it’s always redox.”", why:"Some reactions with O-containing species aren’t redox." },
          { t:"“A solid forms.”", why:"Precipitates form in non-redox reactions too." },
          { t:"“Mg gains oxygen, so Mg is reduced.”", why:"Mg’s number rises, 0 → +2, so Mg is oxidized. " + M5 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"For Zn + Cu²⁺ → Zn²⁺ + Cu, which sentence uses the terms correctly?", options:[
          { t:"“Zn is oxidized, so Zn is the reducing agent; Cu²⁺ is reduced, so Cu²⁺ is the oxidizing agent.”", ok:true, why:"Zn: 0 → +2; Cu: +2 → 0." },
          { t:"“Zn is oxidized, so Zn is the oxidizing agent.”", why:M4 },
          { t:"“Zn is reduced because it loses electrons.”", why:"Losing electrons is oxidation. " + M5 },
          { t:"“Cu²⁺ is oxidized because its number changes.”", why:"Cu’s number falls, +2 → 0: that’s reduction. " + M5 }] },
        b:{ prompt:"For Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂, which sentence uses the terms correctly?", options:[
          { t:"“Br⁻ is oxidized, so Br⁻ is the reducing agent; Cl₂ is reduced, so Cl₂ is the oxidizing agent.”", ok:true, why:"Br: −1 → 0; Cl: 0 → −1." },
          { t:"“Cl₂ is reduced, so Cl₂ is the reducing agent.”", why:M4 },
          { t:"“Br⁻ is reduced because it loses electrons.”", why:"Losing electrons is oxidation. " + M5 },
          { t:"“Cl₂ is oxidized because it becomes an ion.”", why:"Cl’s number falls, 0 → −1: that’s reduction. " + M5 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Vitamin C is added to juice as an antioxidant: it reacts with dissolved O₂ before the flavour compounds can. In that reaction, vitamin C is…", options:[
          { t:"oxidized, so it acts as the reducing agent", ok:true, why:"It gives electrons to O₂." },
          { t:"reduced, so it acts as the oxidizing agent", why:"O₂ is what gets reduced." },
          { t:"oxidized, so it acts as the oxidizing agent", why:M4 },
          { t:"not involved in redox", why:"It reacts with O₂ by electron transfer." }] },
        b:{ prompt:"A hand warmer works when iron powder reacts with O₂ to make Fe₂O₃. What happens to iron?", options:[
          { t:"0 → +3; iron is the reducing agent", ok:true, why:"Fe gives electrons to O₂: its number rises 0 → +3." },
          { t:"0 → +3; iron is the oxidizing agent", why:M4 },
          { t:"0 → +2; iron is the reducing agent", why:"In Fe₂O₃, Fe is +3." },
          { t:"0 → −3; iron is reduced", why:"Metals lose electrons here." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Zinc is extracted from its ore by heating with carbon: ZnO + C → Zn + CO. Which statement is correct?", options:[
          { t:"Zn goes +2 → 0 (reduced); C goes 0 → +2 (oxidized)", ok:true, why:"In ZnO, Zn is +2; C starts as the element at 0 and is +2 in CO." },
          { t:"Zn is oxidized and C is reduced", why:"Zn’s number falls, +2 → 0: that’s reduction. " + M5 },
          { t:"Only Zn changes", why:"C changes too." },
          { t:"O is reduced from −2 to 0", why:"O stays −2." }] },
        b:{ prompt:"Aluminium is produced as 2Al₂O₃ + 3C → 4Al + 3CO₂ (module 52). Which statement is correct?", options:[
          { t:"Al goes +3 → 0 (reduced); C goes 0 → +4 (oxidized)", ok:true, why:"Al: +3 → 0; C: 0 → +4. 4 × 3 = 3 × 4 = 12 electrons." },
          { t:"Al goes 0 → +3", why:"Al starts in Al₂O₃ at +3." },
          { t:"O goes −2 → 0", why:"O stays −2." },
          { t:"C goes +4 → 0", why:"C starts as the element at 0." }] } }
    ]
  },
  task:{
    title:"One-to-one swap", summary:"One-to-one swap",
    statement:"<p>Design a reaction <strong>metal(s) + ion(aq) → ion(aq) + metal(s)</strong> that meets every condition. Can you find all the answers?</p><ol class=\"ox-conds\"><li>The metal’s oxidation number rises by exactly 2.</li><li>The metal and the ion are different elements.</li><li>Electrons balance with one metal atom for every ion (a 1 : 1 ratio).</li><li>It actually happens: the metal is above the ion’s element in the activity series Mg > Al > Zn > Fe > H > Cu > Ag.</li></ol>",
    checks:["Metal’s number rises by 2", "Different elements", "1 : 1 electron balance", "It really happens"],
    tips:["Al becomes Al³⁺ (+3) and Ag becomes Ag⁺ (+1).", "Cu with Cu²⁺ is the same element: nothing changes overall.", "Ag⁺ and H⁺ each take one electron, so you’d need 2 per metal atom.", "A metal only gives electrons to ions of a less active metal."],
    explainPrompt:"Explain, using oxidation numbers, which species is oxidized, which is the reducing agent, and why your pair balances 1 : 1.",
    vocab:"Use oxidation number, oxidized, reduced, reducing agent and oxidizing agent.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:6,
    after3:"Each pair moves 2 electrons. The farther apart the two metals are in the series, the more strongly the reaction goes, which module 47 measures in volts."
  },
  cards:[
    ["Oxidation number", "A bookkeeping charge per atom, assigned as if all bonds were ionic."],
    ["Sum rule", "Numbers add to 0 in a compound, or to the charge in an ion."],
    ["O exceptions", "−1 in peroxides (H₂O₂, Na₂O₂); +2 in OF₂."],
    ["H exception", "−1 in metal hydrides (NaH, CaH₂)."],
    ["Oxidation", "Loss of electrons; the oxidation number <strong>rises</strong>."],
    ["Reduction", "Gain of electrons; the oxidation number <strong>falls</strong>."],
    ["Reducing agent", "The reactant that is <strong>oxidized</strong>: it gives electrons away."],
    ["Oxidizing agent", "The reactant that is <strong>reduced</strong>: it takes electrons."],
    ["Electrons transferred", "Total rise = total fall. Fe₂O₃ + 3CO: 6 electrons."],
    ["Not redox", "Neutralization and precipitation: no number changes."],
    ["Average numbers", "Fe₃O₄: +8/3, because the ore holds Fe²⁺ and Fe³⁺ together."]
  ]
};
