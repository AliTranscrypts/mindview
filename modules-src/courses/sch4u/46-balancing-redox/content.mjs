// SCH4U 46 Balancing Redox Reactions. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/46-balancing-redox.md
// Formulas in text are Unicode (MnO₄⁻). The balancer, the Part 3 stations, "Balance it" and the task are drawn by app.js,
// which reads the species strings below ("MnO4-", "Cr2O7^2-", "e-") with its own parser and MV.chem.f.

// Misconception core sentences (plan §3)
const M1 = "Cu + Ag⁺ → Cu²⁺ + Ag has equal atoms but charge +1 vs +2. Electrons must balance too.";
const M2 = "In acidic solution O comes from water: add H₂O.";
const M3 = "Add electrons to the <strong>more positive</strong> side until the charges match.";
const M4 = "Electrons lost must equal electrons gained. Multiply first.";
const M5 = "Add the same number of OH⁻ to <strong>both</strong> sides, then combine H⁺ + OH⁻ into H₂O.";
const M6 = "If H₂O or H⁺ appears on both sides, subtract the smaller amount.";
const M7 = "Electrons are written as products (oxidation) or reactants (reduction), never subtracted.";

const MED = ["H+", "H2O", "OH-"];

export default {
  id:"46-balancing-redox",
  kind:"topic",
  title:"Balancing redox reactions",
  topic:"Balancing Redox Reactions (Half-Reaction Method)",
  readyTopic:"balancing redox reactions",
  hero:{
    eq:"MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O<br><span class=\"rdx-htally\">atoms: equal · charge: +17 = +17</span>", eqSize:"sm",
    eqLabel:"M n O 4 minus plus 5 F e 2 plus plus 8 H plus gives M n 2 plus plus 5 F e 3 plus plus 4 H 2 O. Atoms: equal. Charge: +17 = +17.",
    headline:"Split it, balance it, put it back together",
    text:"Big redox equations balance easily in halves. Write the <strong>oxidation</strong> and <strong>reduction half-reactions</strong>, balance each with H₂O, H⁺ and <strong>electrons</strong>, then multiply so the electrons cancel and add them back together.",
    fig:{ html:'<div class="rdx-hx"><div class="rdx-hstage" id="rdx-hstage" role="img" aria-label="The skeleton MnO4 minus plus Fe 2 plus gives Mn 2 plus plus Fe 3 plus splits into two half-reactions. In the top row 4 H2O, then 8 H plus, then 5 electrons pop in; in the bottom row 1 electron pops in. A times 5 badge stamps the bottom row. The rows slide together, the 5 electrons on each side cancel, and the final equation settles with the tally +17 = +17."></div><div class="rdx-hrow"><p class="rdx-hctr" id="rdx-hctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="rdx-hreplay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can carry out the half-reaction steps in order in acidic solution.",
    "I can balance the charge in a half-reaction by adding electrons to the correct side.",
    "I can combine half-reactions so the electrons cancel, and give the overall equation in lowest terms.",
    "I can convert an acidic balance into a basic one using OH⁻.",
    "I can check a redox equation for atoms and charge, and spot what is wrong when it doesn’t balance.",
    "I can apply balanced redox equations to contexts such as titrations and breath testing."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Oxidation numbers", goal:2,
          prompt:"What is the oxidation number of Mn in MnO₄⁻?",
          options:[
            { t:"+7", ok:true, why:"<em>x</em> + 4(−2) = −1." },
            { t:"−1", why:"That’s the whole ion’s charge." },
            { t:"+8", why:"The sum is −1." },
            { t:"+2", why:"That’s Mn in Mn²⁺." }],
          hints:["O is −2.", "<em>x</em> − 8 = −1.", "+7."] },
        { id:"w2", skill:"Oxidation numbers", goal:2,
          prompt:"In MnO₄⁻ → Mn²⁺, how does the oxidation number of Mn change?",
          options:[
            { t:"+7 → +2: it gains 5 electrons", ok:true, why:"It falls by 5, so Mn gains 5 e⁻." },
            { t:"+7 → +2: it loses 5 electrons", why:"A falling number means electrons were gained." },
            { t:"−1 → +2", why:"−1 is the charge of the whole ion, not the oxidation number of Mn." },
            { t:"It doesn’t change", why:"+7 to +2 is a change of 5." }],
          hints:["Find Mn on each side.", "+7 and +2.", "Falls by 5: gains 5 e⁻."] },
        { id:"w3", skill:"Balancing equations", goal:5,
          prompt:"Balance: __H₂ + __O₂ → __H₂O.",
          options:[
            { t:"2, 1, 2", ok:true, why:"2H₂ + O₂ → 2H₂O: H 4 = 4, O 2 = 2." },
            { t:"1, 1, 1", why:"O isn’t balanced: 2 vs 1." },
            { t:"2, 2, 2", why:"That’s 4 O on the left and 2 on the right." },
            { t:"1, 2, 1", why:"4 O on the left." }],
          hints:["Count O first.", "2H₂O balances 2 O.", "Then 2H₂."] },
        { id:"w4", skill:"Balancing equations", goal:3,
          prompt:"Which coefficients balance __Al + __O₂ → __Al₂O₃?",
          options:[
            { t:"4, 3, 2", ok:true, why:"4Al + 3O₂ → 2Al₂O₃: Al 4 = 4, O 6 = 6." },
            { t:"2, 3, 1", why:"That gives 6 O on the left, 3 on the right." },
            { t:"4, 6, 2", why:"12 O vs 6." },
            { t:"2, 1, 1", why:"2 O vs 3." }],
          hints:["The LCM of 2 and 3 for O is 6.", "2Al₂O₃ and 3O₂.", "4Al."] },
        { id:"w5", skill:"Charge sums", goal:2,
          prompt:"What is the total charge of 2Fe³⁺ + 3SO₄²⁻?",
          options:[
            { t:"0", ok:true, why:"+6 + (−6)." },
            { t:"+1", why:"3 − 2 per pair ignores the coefficients." },
            { t:"−6", why:"You left out the +6." },
            { t:"+12", why:"Multiply each charge by its count, then add with signs." }],
          hints:["Charge × coefficient.", "2(+3) = +6; 3(−2) = −6.", "0."] },
        { id:"w6", skill:"Charge sums", goal:2,
          prompt:"What is the total charge of MnO₄⁻ + 8H⁺?",
          options:[
            { t:"+7", ok:true, why:"−1 + 8." },
            { t:"+9", why:"MnO₄⁻ is −1, not +1." },
            { t:"−7", why:"8H⁺ is +8." },
            { t:"+8", why:"You left out MnO₄⁻’s −1." }],
          hints:["Add each species’ charge.", "−1 and +8.", "+7."] }
      ],
      refreshers:{
        "Oxidation numbers":"Assign them with module 45’s rules. A rise means oxidation (electrons lost); a fall means reduction (electrons gained).",
        "Balancing equations":"Change coefficients, never subscripts. Balance the element that appears in the fewest species first.",
        "Charge sums":"Total charge = Σ (coefficient × charge). Neutral molecules count as 0."
      }
    }
  },
  explore:{
    heading:"Half-reaction balancer",
    intro:"Choose a reaction, then choose each step from the menu and enter the numbers. The tallies tell you when atoms and charge balance.",
    how:"Pick a reaction and a method. In <strong>Half-reaction</strong>, tap a step, fill its number boxes (how many, and on which side), then press <strong>Apply</strong>. In <strong>Oxidation number</strong>, enter the multipliers, then finish O and H.",
    reactions:[
      { id:"e1", t:"E1: Cu(s) + Ag⁺(aq) → Cu²⁺(aq) + Ag(s)" },
      { id:"e2", t:"E2: MnO₄⁻(aq) + Fe²⁺(aq) → Mn²⁺(aq) + Fe³⁺(aq) (acidic)" },
      { id:"e3", t:"E3: Cr₂O₇²⁻(aq) + I⁻(aq) → Cr³⁺(aq) + I₂(aq) (acidic)" },
      { id:"e4", t:"E4: MnO₄⁻(aq) + I⁻(aq) → MnO₂(s) + I₂(aq) (basic)" },
      { id:"e5", t:"E5: Al(s) + Cu²⁺(aq) → Al³⁺(aq) + Cu(s)" }
    ],
    methods:[{ id:"half", t:"Half-reaction" }, { id:"on", t:"Oxidation number" }],
    steps:[
      { id:"split", t:"Split into half-reactions" },
      { id:"atoms", t:"Balance atoms other than O and H" },
      { id:"water", t:"Add H₂O to balance O" },
      { id:"hplus", t:"Add H⁺ to balance H" },
      { id:"elec", t:"Add e⁻ to balance charge" },
      { id:"mult", t:"Multiply to equalize electrons" },
      { id:"add", t:"Add the halves and cancel" },
      { id:"oh", t:"Convert to basic: add OH⁻", basicOnly:true },
      { id:"check", t:"Check" }
    ],
    stepFb:{
      needSplit:"Split the reaction into its oxidation and reduction half-reactions first.",
      needAtoms:"Balance the atoms other than O and H first.",
      hBeforeW:"Balance O first; the water you add brings H with it.",
      eBeforeH:"Charge can’t be balanced until every species is in place.",
      multEarly:"Each half must balance on its own first.",
      addEarly:"{g} e⁻ gained but {l} lost: multiply first.",
      eSide:"Electrons go on the side with the <strong>greater positive</strong> charge.",
      ohEarly:"First balance it as if it were acidic: add the halves.",
      checkEarly:"Add the halves first, then check.",
      demo:"This reaction holds the worked example from a prediction. Press <strong>Start again</strong> and balance it yourself."
    },
    predictions:[
      { id:"p1", prompt:"Is Cu + Ag⁺ → Cu²⁺ + Ag balanced?",
        options:[{ t:"No: the charge is +1 on the left and +2 on the right", ok:true }, { t:"Yes: the atoms match" }, { t:"No: the atoms don’t match" }, { t:"Yes: there are no electrons to balance" }],
        explain:"Cu + 2Ag⁺ → Cu²⁺ + 2Ag: +2 = +2. Two electrons move from one Cu to two Ag⁺." },
      { id:"p2", prompt:"E2’s reduction half after the atoms step: MnO₄⁻ → Mn²⁺. How many H₂O, and on which side, balance the O?",
        options:[{ t:"4 on the right", ok:true }, { t:"2 on the right" }, { t:"4 on the left" }, { t:"8 on the right" }],
        explain:"Four O atoms in MnO₄⁻ become four water molecules." },
      { id:"p3", prompt:"MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O has charges +7 (left) and +2 (right). How many electrons, and on which side?",
        options:[{ t:"5 on the left", ok:true }, { t:"5 on the right" }, { t:"7 on the left" }, { t:"2 on the left" }],
        explain:"Add electrons to the more positive side until the charges match: +7 − 5 = +2. That matches Mn’s change from +7 to +2." },
      { id:"p4", prompt:"E4 balanced in acid: 2MnO₄⁻ + 6I⁻ + 8H⁺ → 2MnO₂ + 3I₂ + 4H₂O. After converting to basic solution, what appears that wasn’t there before?",
        options:[{ t:"OH⁻ on the right", ok:true }, { t:"OH⁻ on the left" }, { t:"O₂" }, { t:"More H⁺" }],
        explain:"The OH⁻ added to the right has nothing to combine with, so it stays." }
    ],
    chalIntro:"Use the balancer to meet each goal, then press <strong>Check challenge</strong>. Either method counts. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], rx:"e2", answer:"MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O", prompt:"Balance E2 completely, in acidic solution.",
        why:"MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O: atoms equal, and +17 = +17.",
        msgs:{ fe1:"Fe gives 1 electron and MnO₄⁻ takes 5: multiply the iron half by 5.", h4:"4H₂O need 8 H atoms.", eLeft:"Equal electrons on both sides cancel completely." },
        hints:["Balance the manganese half first: O, then H, then charge.", "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.", "Multiply Fe²⁺ → Fe³⁺ + e⁻ by 5, then add."] },
      { id:"tc2", goal:[1, 3], rx:"e3", answer:"Cr2O7^2- + 6I- + 14H+ -> 2Cr^3+ + 3I2 + 7H2O", prompt:"Balance E3 in acidic solution.",
        why:"Cr₂O₇²⁻ + 6I⁻ + 14H⁺ → 2Cr³⁺ + 3I₂ + 7H₂O: atoms equal, and +6 = +6.",
        msgs:{ cr1:"Balance Cr first: two Cr on the left.", e3:"Each Cr gains 3, and there are 2 Cr: 6 e⁻.", i2:"Each I₂ needs 2 e⁻ lost; you need 6 lost: ×3." },
        hints:["Balance Cr, then O (7H₂O), then H (14H⁺).", "Charge: +12 on the left, +6 on the right, so add 6e⁻ on the left.", "2I⁻ → I₂ + 2e⁻, times 3."] },
      { id:"tc3", goal:4, rx:"e4", answer:"2MnO4- + 6I- + 4H2O -> 2MnO2 + 3I2 + 8OH-", stretch:true, prompt:"Balance E4 in <strong>basic</strong> solution, in lowest terms.",
        why:"2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻: atoms equal, and −8 = −8.",
        msgs:{ hplus:"Basic solution has no H⁺: add OH⁻ to both sides.", water:"Cancel the water that appears on both sides.", ohLeft:"The OH⁻ that combined with H⁺ became water. The OH⁻ you added to the right is what stays." },
        hints:["First balance it as if it were acidic.", "2MnO₄⁻ + 6I⁻ + 8H⁺ → 2MnO₂ + 3I₂ + 4H₂O.", "Add 8OH⁻ to both sides; 8H⁺ + 8OH⁻ → 8H₂O; cancel 4H₂O."] }
    ],
    chalMsgs:{
      pick:"Choose {rx} in the reaction chips first.",
      unfinishedHalf:"Finish the balance: add the halves so the overall equation shows.",
      unfinishedOn:"Enter both multipliers first.",
      lowest:"Balanced, but not in lowest terms: divide every coefficient by {k}.",
      general:"Not yet. Check each half’s atoms and charge, then add again."
    }
  },
  part3:{
    slug:"special", name:"Special cases", heading:"Special cases",
    intro:"The balancer handles typical reactions. These four stations show the cases that confuse students: one species with two jobs, ions that just watch, a colour you can count, and the breath test. A “Check it with data” panel totals atoms and charge for each result.",
    s1:{ title:"Station 1: One species, two jobs (disproportionation)",
      intro:"Flip each card to reveal a half-reaction.",
      sets:[
        { id:"pe", name:"Hydrogen peroxide decomposing", cards:[
          { front:"Reduction half", back:"H2O2 + 2H+ + 2e- -> 2H2O", note:"reduction: O −1 → −2" },
          { front:"Oxidation half", back:"H2O2 -> O2 + 2H+ + 2e-", note:"oxidation: O −1 → 0" },
          { front:"Sum", back:"2H2O2 -> 2H2O + O2", note:"the 2H⁺ and 2e⁻ cancel" }] },
        { id:"cu", name:"Copper(I) in water", cards:[
          { front:"Reduction half", back:"Cu+ + e- -> Cu", note:"reduction: Cu +1 → 0" },
          { front:"Oxidation half", back:"Cu+ -> Cu^2+ + e-", note:"oxidation: Cu +1 → +2" },
          { front:"Sum", back:"2Cu+ -> Cu + Cu^2+", note:"one electron moves from one Cu⁺ to another" }] }
      ],
      q:"Which species is the oxidizing agent in 2H₂O₂ → 2H₂O + O₂?",
      opts:[
        { t:"H₂O₂", ok:true, fb:"Right. H₂O₂ is also the reducing agent: the same species is both agents." },
        { t:"H₂O", fb:"H₂O is a product. Look at the reactant whose O changes." },
        { t:"O₂", fb:"O₂ is a product. Look at the reactant whose O changes." }],
      data:"<p>2H₂O₂ → 2H₂O + O₂: H 4 = 4 · O 4 = 2 + 2 · charge 0 = 0.</p><p>2Cu⁺ → Cu + Cu²⁺: Cu 2 = 2 · charge +2 = +2.</p>" },
    s2:{ title:"Station 2: Spectator ions",
      intro:"Potassium permanganate, KMnO₄, reacts with iron(II) sulfate, FeSO₄, in acid. Written as ions, the equation is below. Tap the ions that don’t change.",
      full:"Full formulas: KMnO₄(aq) and FeSO₄(aq), with acid for H⁺",
      tiles:[
        { id:"k1", sp:"K+", side:"L", spec:"k" }, { id:"mn1", sp:"MnO4-", side:"L", why:"Mn changes: +7 → +2." }, { id:"fe1", sp:"5Fe^2+", side:"L", why:"Fe changes: +2 → +3." },
        { id:"s1", sp:"5SO4^2-", side:"L", spec:"s" }, { id:"h1", sp:"8H+", side:"L", why:"H⁺ is used up: it ends in water, so it belongs in the net equation." },
        { id:"k2", sp:"K+", side:"R", spec:"k" }, { id:"mn2", sp:"Mn^2+", side:"R", why:"Mn changes: +7 → +2." }, { id:"fe2", sp:"5Fe^3+", side:"R", why:"Fe changes: +2 → +3." },
        { id:"s2", sp:"5SO4^2-", side:"R", spec:"s" }, { id:"w2", sp:"4H2O", side:"R", why:"Water forms in the reaction, so it belongs in the net equation." }],
      good:{ k:"K⁺ is the same on both sides.", s:"SO₄²⁻ is the same on both sides." },
      done:"Spectator ions don’t change oxidation number, so they’re left out of half-reactions.",
      net:"MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O" },
    s3:{ title:"Station 3: A colour you can count (investigation)",
      intro:"The flask holds Fe²⁺ (pale green). Add purple MnO₄⁻ from the burette. While Fe²⁺ remains, each drop loses its colour. At the end point the first drop stays pink.",
      endV:18.0,
      q:"18.0 mL of MnO₄⁻ solution reacted, containing 0.000 90 mol MnO₄⁻. How many mol of Fe²⁺ were in the flask?",
      answer:0.0045,
      good:"5 × 0.000 90 = 0.004 5 mol.",
      bad:"Use the 1 : 5 mole ratio from the balanced equation: mol Fe²⁺ = 5 × mol MnO₄⁻.",
      div:"Multiply by 5; don’t divide." },
    s4:{ title:"Station 4: The breath test (STSE)",
      intro:"Older roadside breath testers passed breath through acidified orange dichromate. Ethanol reduced it to green Cr³⁺.",
      colours:"Cr₂O₇²⁻ is orange; Cr³⁺ is green.",
      task:"Fill in the coefficients with the balancer’s method, then press Check.",
      item:{ id:"bt", L:["Cr2O7^2-", "C2H5OH", "H+"], R:["Cr^3+", "CH3COOH", "H2O"], med:[],
        answer:"2Cr2O7^2- + 3C2H5OH + 16H+ -> 4Cr^3+ + 3CH3COOH + 11H2O",
        display:"2Cr₂O₇²⁻ + 3C₂H₅OH + 16H⁺ → 4Cr³⁺ + 3CH₃COOH + 11H₂O",
        wrong:[{ sp:"H+", side:"L", n:28, fb:"The ethanol half releases 12H⁺: 28 − 12 = 16." }],
        hints:["Ethanol half: C₂H₅OH + H₂O → CH₃COOH + 4H⁺ + 4e⁻.", "Dichromate half: 6e⁻. The LCM of 4 and 6 is 12, so ×3 and ×2.", "Add, then cancel 12H⁺ and 3H₂O."] },
      note:"Today’s devices mostly use fuel cells, which module 48 covers." },
    quickCheck:{
      title:"Quick check", summary:"Special cases quick check",
      items:[
        { id:"q1", goal:5, prompt:"In 2H₂O₂ → 2H₂O + O₂, which element is both oxidized and reduced?",
          choices:[
            { t:"O", ok:true, fb:"Right. O goes −1 → −2 in water and −1 → 0 in O₂." },
            { t:"H", fb:"O goes −1 → −2 in water and −1 → 0 in O₂." },
            { t:"Neither", fb:"O goes −1 → −2 in water and −1 → 0 in O₂." },
            { t:"Both", fb:"O goes −1 → −2 in water and −1 → 0 in O₂." }] },
        { id:"q2", goal:5, prompt:"Which ions are spectators when KMnO₄ oxidizes FeSO₄?",
          choices:[
            { t:"K⁺ and SO₄²⁻", ok:true, fb:"Right. Their oxidation numbers don’t change." },
            { t:"Mn and Fe", fb:"Their oxidation numbers don’t change: look for the ions that are the same on both sides." },
            { t:"H⁺ and H₂O", fb:"Their oxidation numbers don’t change: look for the ions that are the same on both sides." },
            { t:"None", fb:"Their oxidation numbers don’t change: look for the ions that are the same on both sides." }] },
        { id:"q3", goal:6, prompt:"MnO₄⁻ + 5Fe²⁺ + 8H⁺ → …: how many mol of Fe²⁺ react with 0.0010 mol MnO₄⁻?",
          choices:[
            { t:"0.0050", ok:true, fb:"Right. Use the 1 : 5 mole ratio from the balanced equation." },
            { t:"0.0010", fb:"Use the 1 : 5 mole ratio from the balanced equation." },
            { t:"0.0002", fb:"Use the 1 : 5 mole ratio from the balanced equation." },
            { t:"0.0080", fb:"Use the 1 : 5 mole ratio from the balanced equation." }] },
        { id:"q4", goal:6, prompt:"<strong>Investigation:</strong> Why is the titration’s end point the first drop that stays pink?",
          choices:[
            { t:"All the Fe²⁺ is used up, so extra MnO₄⁻ isn’t reduced", ok:true, fb:"Right. MnO₄⁻ is purple and Mn²⁺ is nearly colourless, so purple stays only when nothing is left to reduce it." },
            { t:"Mn²⁺ is pink", fb:"MnO₄⁻ is purple and Mn²⁺ is nearly colourless, so purple stays only when nothing is left to reduce it." },
            { t:"The solution warms up", fb:"MnO₄⁻ is purple and Mn²⁺ is nearly colourless, so purple stays only when nothing is left to reduce it." },
            { t:"Fe³⁺ is pink", fb:"MnO₄⁻ is purple and Mn²⁺ is nearly colourless, so purple stays only when nothing is left to reduce it." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"steps", type:"order", title:"Steps in order", summary:"Steps in order", goal:[1, 4],
        instruction:"Put the steps of each method in order.",
        sequences:[
          { id:"s1", goal:1, prompt:"Acidic solution (7 steps).",
            steps:["Split into oxidation and reduction half-reactions.", "Balance atoms other than O and H.", "Balance O by adding H₂O.", "Balance H by adding H⁺.",
              "Balance charge by adding e⁻.", "Multiply so electrons lost = electrons gained.", "Add, cancel, and check atoms and charge."],
            start:[4, 1, 6, 3, 0, 5, 2],
            wrong:[
              { order:[0, 1, 2, 4, 3, 5, 6], fb:"Charge can’t be balanced until every species is in place." },
              { order:[0, 5, 1, 2, 3, 4, 6], fb:"Each half must balance on its own first." },
              { order:[5, 0, 1, 2, 3, 4, 6], fb:"Each half must balance on its own first." },
              { order:[0, 1, 3, 2, 4, 5, 6], fb:"Balance O first; the water you add brings H with it." }],
            why:"Atoms, then O with water, then H, then charge with electrons; only then equalize and add.",
            hints:["Atoms before charge.", "O before H, because the water brings H.", "Electrons last, then equalize."] },
          { id:"s2", goal:4, prompt:"Basic solution (5 steps).",
            steps:["Balance as if in acidic solution.", "Add one OH⁻ to <strong>both</strong> sides for every H⁺.", "Combine H⁺ and OH⁻ on the same side into H₂O.",
              "Cancel water that appears on both sides.", "Check atoms and charge."],
            start:[2, 4, 0, 3, 1],
            wrong:[{ order:[0, 2, 1, 3, 4], fb:"Add the OH⁻ before you combine anything, and to both sides, or the equation changes." }],
            why:"The acidic balance comes first; OH⁻ goes on both sides, turns the H⁺ into water, and the extra water cancels.",
            // VERIFY: the plan gives one hint set for Activity 1; these hints for the basic sequence were written for the module.
            hints:["Start from the acidic answer.", "What you add to one side you add to the other.", "Add OH⁻, combine into water, cancel, then check."] }
        ] },
      { id:"balance", type:"custom", title:"Balance it", summary:"Balance it", star:true, goal:[3, 4, 5, 6],
        instruction:"Fill in the coefficients. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a coefficient in each box (a blank main box counts as 1, a blank H⁺, H₂O or OH⁻ box as 0) and choose the side for H⁺, H₂O and OH⁻. The tally updates as you type. Press Check when it balances.",
        items:[
          { id:"b1", goal:3, prompt:"Al + Cu²⁺ → Al³⁺ + Cu", L:["Al", "Cu^2+"], R:["Al^3+", "Cu"], med:[],
            answer:"2Al + 3Cu^2+ -> 2Al^3+ + 3Cu", display:"2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu",
            wrong:[{ eq:"Al + Cu^2+ -> Al^3+ + Cu", fb:"Charge +2 vs +3: electrons lost (3 per Al) must equal gained (2 per Cu²⁺)." }],
            // VERIFY: hints for B1, B2, B4 and B5 were written for the module (the plan gives hints for B3 and B6 only).
            hints:["Al → Al³⁺ + 3e⁻; Cu²⁺ + 2e⁻ → Cu.", "The LCM of 3 and 2 is 6: ×2 and ×3.", "2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu."] },
          { id:"b2", goal:3, prompt:"Fe²⁺ + H₂O₂ → Fe³⁺ + H₂O (acidic)", L:["Fe^2+", "H2O2"], R:["Fe^3+"], med:MED, medium:"acid",
            answer:"2Fe^2+ + H2O2 + 2H+ -> 2Fe^3+ + 2H2O", display:"2Fe²⁺ + H₂O₂ + 2H⁺ → 2Fe³⁺ + 2H₂O",
            wrong:[{ sp:"H+", n:0, fb:"The peroxide half needs 2H⁺: H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O." }],
            hints:["H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O.", "Fe²⁺ → Fe³⁺ + e⁻, times 2.", "2Fe²⁺ + H₂O₂ + 2H⁺ → 2Fe³⁺ + 2H₂O."] },
          { id:"b3", goal:5, star:true, prompt:"Zn + NO₃⁻ → Zn²⁺ + NH₄⁺ (acidic)", L:["Zn", "NO3-"], R:["Zn^2+", "NH4+"], med:MED, medium:"acid",
            answer:"4Zn + NO3- + 10H+ -> 4Zn^2+ + NH4+ + 3H2O", display:"4Zn + NO₃⁻ + 10H⁺ → 4Zn²⁺ + NH₄⁺ + 3H₂O",
            wrong:[{ sp:"H+", side:"L", n:6, fb:"NH₄⁺ needs 4 H as well as the 6 for 3H₂O: 10H⁺." }, { sp:"Zn", side:"L", n:1, fb:"N gains 8 e⁻; each Zn gives 2: ×4." }],
            hints:["Nitrate half: NO₃⁻ + 10H⁺ + 8e⁻ → NH₄⁺ + 3H₂O.", "Zinc half: Zn → Zn²⁺ + 2e⁻.", "×4 for zinc."] },
          { id:"b4", goal:5, star:true, prompt:"MnO₄⁻ + SO₃²⁻ → Mn²⁺ + SO₄²⁻ (acidic)", L:["MnO4-", "SO3^2-"], R:["Mn^2+", "SO4^2-"], med:MED, medium:"acid",
            answer:"2MnO4- + 5SO3^2- + 6H+ -> 2Mn^2+ + 5SO4^2- + 3H2O", display:"2MnO₄⁻ + 5SO₃²⁻ + 6H⁺ → 2Mn²⁺ + 5SO₄²⁻ + 3H₂O",
            wrong:[{ sp:"H+", side:"L", n:16, fb:"Cancel: the sulfite half gives back 10H⁺ and uses 5H₂O." }, { sp:"H2O", side:"R", n:8, fb:"Cancel: the sulfite half gives back 10H⁺ and uses 5H₂O." }],
            hints:["MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O; SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺ + 2e⁻.", "×2 and ×5 give 10 e⁻ each.", "Cancel 10H⁺ and 5H₂O: 6H⁺ on the left, 3H₂O on the right."] },
          { id:"b5", goal:4, star:true, prompt:"MnO₄⁻ + SO₃²⁻ → MnO₂ + SO₄²⁻ (basic)", L:["MnO4-", "SO3^2-"], R:["MnO2", "SO4^2-"], med:MED, medium:"basic",
            answer:"2MnO4- + 3SO3^2- + H2O -> 2MnO2 + 3SO4^2- + 2OH-", display:"2MnO₄⁻ + 3SO₃²⁻ + H₂O → 2MnO₂ + 3SO₄²⁻ + 2OH⁻",
            wrong:[{ sp:"H+", min:1, fb:"That’s the acidic answer; convert with 2OH⁻." }],
            hints:["In acid: 2MnO₄⁻ + 3SO₃²⁻ + 2H⁺ → 2MnO₂ + 3SO₄²⁻ + H₂O.", "Add 2OH⁻ to both sides; 2H⁺ + 2OH⁻ → 2H₂O.", "Cancel one H₂O: H₂O on the left, 2OH⁻ on the right."] },
          { id:"b6", goal:6, star:true, prompt:"Cr₂O₇²⁻ + C₂H₅OH → Cr³⁺ + CH₃COOH (acidic)", L:["Cr2O7^2-", "C2H5OH"], R:["Cr^3+", "CH3COOH"], med:MED, medium:"acid",
            answer:"2Cr2O7^2- + 3C2H5OH + 16H+ -> 4Cr^3+ + 3CH3COOH + 11H2O", display:"2Cr₂O₇²⁻ + 3C₂H₅OH + 16H⁺ → 4Cr³⁺ + 3CH₃COOH + 11H₂O",
            wrong:[{ sp:"H+", side:"L", n:28, fb:"The ethanol half releases 12H⁺: 28 − 12 = 16." }],
            hints:["Ethanol half: C₂H₅OH + H₂O → CH₃COOH + 4H⁺ + 4e⁻.", "Dichromate half: 6e⁻. The LCM of 4 and 6 is 12, so ×3 and ×2.", "Add, then cancel 12H⁺ and 3H₂O."] }
        ],
        fb:{ acidOH:M2, side:"Choose a side for {sp}.", whole:"Enter whole numbers from 0 to 99.", lowest:"Balanced, but not in lowest terms: divide every coefficient by {k}.",
          other:"Atoms and charge balance, but this isn’t the lowest-terms answer: compare electrons lost and gained." } },
      { id:"spot", type:"spot", title:"Spot the error", student:"Signe", how:"", goal:[2, 3, 4],
        instruction:"Signe made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Balance MnO₄⁻ → Mn²⁺ in acidic solution.",
            steps:["Mn is already balanced.", "Add 4H₂O on the right for O.", "Add 4H⁺ on the left for H.", "Charge +3 vs +2: add 1e⁻ on the left."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"4H₂O contain 8 H: add <strong>8H⁺</strong>, then 5e⁻ on the left.", ok:true, why:"8H⁺ gives +7 on the left; 5e⁻ brings it to +2." },
              { t:"Add 4OH⁻ instead.", why:"This is acidic solution." },
              { t:"Add 2H₂ instead of H⁺.", why:"Use H⁺ in acidic half-reactions." },
              { t:"Step 3 is correct.", why:"Count H in 4H₂O: 8." }],
            hints:["How many H atoms in 4H₂O?", "8.", "8H⁺, then 5e⁻."] },
          { id:"e2", goal:3, task:"Balance Cr₂O₇²⁻ + I⁻ → Cr³⁺ + I₂ (acidic).",
            steps:["Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O", "2I⁻ → I₂ + 2e⁻", "Add them: Cr₂O₇²⁻ + 2I⁻ + 14H⁺ → 2Cr³⁺ + I₂ + 7H₂O + 4e⁻", "Done."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Multiply the iodide half by 3 first: Cr₂O₇²⁻ + 6I⁻ + 14H⁺ → 2Cr³⁺ + 3I₂ + 7H₂O.", ok:true, why:"6 e⁻ lost = 6 e⁻ gained, so they cancel completely." },
              { t:"Divide the dichromate half by 3.", why:"That gives fractions of Cr₂O₇²⁻." },
              { t:"Drop the 4e⁻.", why:"Electrons can’t vanish; equalize them." },
              { t:"Step 3 is correct.", why:"Charge: +10 on the left vs +6 on the right (plus free electrons)." }],
            hints:["Electrons gained vs lost?", "6 vs 2.", "×3 the iodide half."] },
          { id:"e3", goal:4, task:"Convert 2MnO₄⁻ + 3SO₃²⁻ + 2H⁺ → 2MnO₂ + 3SO₄²⁻ + H₂O to basic solution.",
            steps:["There are 2H⁺, so 2OH⁻ are needed.", "Replace 2H⁺ with 2OH⁻ on the left.", "2MnO₄⁻ + 3SO₃²⁻ + 2OH⁻ → 2MnO₂ + 3SO₄²⁻ + H₂O"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Add 2OH⁻ to <strong>both</strong> sides; 2H⁺ + 2OH⁻ → 2H₂O; cancel one H₂O: 2MnO₄⁻ + 3SO₃²⁻ + H₂O → 2MnO₂ + 3SO₄²⁻ + 2OH⁻.", ok:true, why:M5 },
              { t:"Add 2OH⁻ to the right only.", why:"Adding to one side changes the equation." },
              { t:"Remove the H⁺ and do nothing else.", why:"The atoms and charge would no longer balance." },
              { t:"Step 2 is correct.", why:"Check the charge: −10 vs −8." }],
            hints:["What you add to one side you add to the other.", "2OH⁻ both sides.", "Combine to water, cancel."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the balancer: how mechanical the steps are, or how the basic conversion works?" },
      { id:"j2", q:"In your own words, explain why electrons lost must equal electrons gained." },
      { id:"j3", q:"Explain to a friend how to decide how many electrons to add to a half-reaction, and on which side." },
      { id:"j4", q:"Which step do you still get wrong most often? What check will you add to catch it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In acidic solution, after balancing atoms other than O and H, what do you add to balance O?", options:[
          { t:"H₂O", ok:true, why:"In acidic solution O comes from water." },
          { t:"O₂", why:"O₂ isn’t a reactant here; water supplies O." },
          { t:"OH⁻", why:"OH⁻ is for basic solution." },
          { t:"H⁺", why:"H⁺ balances H, not O." }] },
        b:{ prompt:"In acidic solution, what do you add to balance H?", options:[
          { t:"H⁺", ok:true, why:"H⁺ supplies H in acidic solution." },
          { t:"H₂", why:"Use H⁺ in acidic half-reactions." },
          { t:"H₂O", why:"Water balances O; it would add O too." },
          { t:"OH⁻", why:"OH⁻ is for basic solution." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Cr₂O₇²⁻ + 14H⁺ → 2Cr³⁺ + 7H₂O. How many electrons, and on which side?", options:[
          { t:"6 on the left", ok:true, why:"+12 → +6." },
          { t:"6 on the right", why:"Electrons go on the more positive side." },
          { t:"3 on the left", why:"Each Cr gains 3, and there are 2." },
          { t:"12 on the left", why:"That’s the left-side charge, not the difference." }] },
        b:{ prompt:"MnO₄⁻ + 4H⁺ → MnO₂ + 2H₂O. How many electrons, and on which side?", options:[
          { t:"3 on the left", ok:true, why:"+3 → 0." },
          { t:"3 on the right", why:"Electrons go on the more positive side." },
          { t:"5 on the left", why:"That’s for Mn²⁺, not MnO₂." },
          { t:"7 on the left", why:"Mn goes +7 → +4: a change of 3." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"To convert an acidic-balanced redox equation to basic, you…", options:[
          { t:"add as many OH⁻ to both sides as there are H⁺, combine H⁺ + OH⁻ into H₂O, and cancel", ok:true, why:"OH⁻ on both sides keeps the equation balanced." },
          { t:"replace each H⁺ with OH⁻ on the same side", why:M5 },
          { t:"add OH⁻ only to the side with H⁺", why:M5 },
          { t:"add O₂ to both sides", why:"O₂ isn’t part of the method." }] },
        b:{ prompt:"2MnO₄⁻ + 6I⁻ + 8H⁺ → 2MnO₂ + 3I₂ + 4H₂O. How many OH⁻ are added to each side?", options:[
          { t:"8", ok:true, why:"One OH⁻ per H⁺." },
          { t:"4", why:"One OH⁻ per H⁺: 8." },
          { t:"2", why:"That matches MnO₄⁻, not H⁺." },
          { t:"16", why:"8 per side, not 16." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Balance in acidic solution, in lowest terms: Fe²⁺ + Cr₂O₇²⁻ → Fe³⁺ + Cr³⁺. What is the coefficient of Fe²⁺?", options:[
          { t:"6", ok:true, why:"6Fe²⁺ + Cr₂O₇²⁻ + 14H⁺ → 6Fe³⁺ + 2Cr³⁺ + 7H₂O." },
          { t:"1", why:"Electrons gained (6) must equal electrons lost." },
          { t:"3", why:"Two Cr atoms each gain 3." },
          { t:"14", why:"That’s H⁺." }] },
        b:{ prompt:"Balance in acidic solution, in lowest terms: I⁻ + MnO₄⁻ → I₂ + Mn²⁺. What is the coefficient of H⁺?", options:[
          { t:"16", ok:true, why:"10I⁻ + 2MnO₄⁻ + 16H⁺ → 5I₂ + 2Mn²⁺ + 8H₂O." },
          { t:"8", why:"The permanganate half must be doubled." },
          { t:"4", why:"4H₂O per Mn need 8H⁺, and there are 2 Mn." },
          { t:"10", why:"That’s I⁻." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A student writes MnO₄⁻ + Fe²⁺ + 8H⁺ → Mn²⁺ + Fe³⁺ + 4H₂O. What’s wrong?", options:[
          { t:"The charge doesn’t balance (+9 vs +5): the electrons weren’t equalized", ok:true, why:"5 e⁻ gained but only 1 lost: the iron half needs ×5." },
          { t:"O doesn’t balance", why:"4 = 4." },
          { t:"H doesn’t balance", why:"8 = 8." },
          { t:"Nothing", why:"Check the charge." }] },
        b:{ prompt:"A student writes Cr₂O₇²⁻ + 2I⁻ + 14H⁺ → 2Cr³⁺ + I₂ + 7H₂O. What’s wrong?", options:[
          { t:"The charge doesn’t balance (+10 vs +6): iodide wasn’t multiplied by 3", ok:true, why:"6 e⁻ gained but only 2 lost." },
          { t:"I doesn’t balance", why:"2 = 2." },
          { t:"O doesn’t balance", why:"7 = 7." },
          { t:"Nothing", why:"Check the charge." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"2Cu⁺ → Cu + Cu²⁺ is balanced. Which statement describes it?", options:[
          { t:"Cu⁺ is both oxidized and reduced", ok:true, why:"+1 → 0 for one Cu⁺ and +1 → +2 for the other." },
          { t:"Cu⁺ is only reduced", why:"One Cu⁺ goes to +2." },
          { t:"It isn’t redox, because only one element is involved", why:"Numbers change: +1 → 0 and +1 → +2." },
          { t:"Cu is the oxidizing agent", why:"Cu is a product." }] },
        b:{ prompt:"2H₂O₂ → 2H₂O + O₂. What happens to oxygen’s oxidation number?", options:[
          { t:"−1 → −2 (in water) and −1 → 0 (in O₂)", ok:true, why:"Peroxide oxygen is −1, and it changes in both directions." },
          { t:"−2 → 0", why:"O in a peroxide is −1." },
          { t:"−1 → −2 only", why:"O₂ forms too." },
          { t:"No change", why:"It changes in two directions." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best reason to balance charge with electrons as the <strong>last</strong> step of each half-reaction?", options:[
          { t:"“Adding electrons changes charge without changing atoms, so once the atoms are balanced, electrons can fix the charge without undoing anything.”", ok:true, why:"Electrons carry charge but no atoms." },
          { t:"“Electrons are the heaviest species, so they go last.”", why:"Electrons are the lightest." },
          { t:"“The rules say so, for no particular reason.”", why:"The order has a reason." },
          { t:"“Electrons only matter in basic solution.”", why:"Electrons balance the charge in acidic and basic solution alike." }] },
        b:{ prompt:"Which is the best reason why electrons lost must equal electrons gained?", options:[
          { t:"“Electrons aren’t created or destroyed. Every electron released by the oxidation must be taken up by the reduction.”", ok:true, why:"It’s a conservation law." },
          { t:"“So the equation looks symmetrical.”", why:"It’s a conservation law, not style." },
          { t:"“Because H⁺ and OH⁻ must cancel.”", why:"That’s a separate step." },
          { t:"“Only in acidic solution.”", why:"It’s true in every medium." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which half-reaction is written correctly as an <strong>oxidation</strong>?", options:[
          { t:"Fe²⁺ → Fe³⁺ + e⁻", ok:true, why:"The electron lost is a product: +2 = +3 − 1." },
          { t:"Fe²⁺ + e⁻ → Fe³⁺", why:"The charge doesn’t balance: +1 vs +3." },
          { t:"Fe²⁺ − e⁻ → Fe³⁺", why:"Write the electron as a product instead of subtracting it." },
          { t:"Fe³⁺ + e⁻ → Fe²⁺", why:"That’s the reduction." }] },
        b:{ prompt:"Which half-reaction is written correctly as a <strong>reduction</strong>?", options:[
          { t:"Ag⁺ + e⁻ → Ag", ok:true, why:"The electron gained is a reactant: +1 − 1 = 0." },
          { t:"Ag⁺ → Ag + e⁻", why:"The charge doesn’t balance." },
          { t:"Ag⁺ − e⁻ → Ag", why:M7 },
          { t:"Ag → Ag⁺ + e⁻", why:"That’s the oxidation." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"In an older breath tester, acidified dichromate oxidizes ethanol to ethanoic acid: 2Cr₂O₇²⁻ + 3C₂H₅OH + __H⁺ → 4Cr³⁺ + 3CH₃COOH + 11H₂O. What is the missing coefficient?", options:[
          { t:"16", ok:true, why:"28H⁺ are used and 12H⁺ released: 16." },
          { t:"28", why:"The ethanol half gives back 12H⁺." },
          { t:"14", why:"That’s for one dichromate." },
          { t:"12", why:"That’s the H⁺ released, not the net." }] },
        b:{ prompt:"An iron supplement is analysed by titration: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. How many mol of Fe²⁺ react with 0.0020 mol MnO₄⁻?", options:[
          { t:"0.010 mol", ok:true, why:"1 : 5." },
          { t:"0.0020 mol", why:"The ratio is 1 : 5, not 1 : 1." },
          { t:"0.000 40 mol", why:"Multiply by 5; don’t divide." },
          { t:"0.016 mol", why:"Use Fe²⁺’s coefficient (5), not H⁺’s (8)." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Balance in basic solution: MnO₄⁻ + SO₃²⁻ → MnO₂ + SO₄²⁻. The lowest-terms equation contains…", options:[
          { t:"2OH⁻ on the right", ok:true, why:"2MnO₄⁻ + 3SO₃²⁻ + H₂O → 2MnO₂ + 3SO₄²⁻ + 2OH⁻." },
          { t:"2H⁺ on the left", why:"That’s the acidic answer." },
          { t:"2OH⁻ on the left", why:"The OH⁻ that combined with H⁺ became water; the OH⁻ added to the right is what stays." },
          { t:"8OH⁻ on the right", why:M6 }] },
        b:{ prompt:"Balance in basic solution: MnO₄⁻ + I⁻ → MnO₂ + I₂. Where does OH⁻ appear, and how many?", options:[
          { t:"8, on the right", ok:true, why:"2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻." },
          { t:"8, on the left", why:"The OH⁻ that combined with H⁺ became water; the OH⁻ added to the right is what stays." },
          { t:"4, on the right", why:"4 is the water count." },
          { t:"None", why:"Basic solution has no H⁺: add OH⁻ to both sides." }] } }
    ]
  },
  task:{
    title:"Pick a titration reaction", summary:"Pick a titration reaction",
    statement:"<p>Choose a reducing agent (the sample in the flask) and an oxidizing agent (in the burette), then enter the multipliers that balance the electrons. Can you find all the good pairings?</p><ol class=\"rdx-conds\"><li>The electrons cancel.</li><li>The multipliers are the lowest whole numbers.</li><li>The oxidizing agent changes colour as it reacts, so the reaction can be followed by eye.</li><li>The sample dissolves, so it can be in solution in the flask (not a solid metal).</li></ol>",
    qOx:"Oxidation half (the sample)", qRed:"Reduction half (in the burette)", qA:"Multiplier <em>a</em> (oxidation half)", qB:"Multiplier <em>b</em> (reduction half)",
    ox:[
      { id:"fe", t:"Fe²⁺ → Fe³⁺ + e⁻" },
      { id:"i", t:"2I⁻ → I₂ + 2e⁻" },
      { id:"zn", t:"Zn → Zn²⁺ + 2e⁻" },
      { id:"pe", t:"H₂O₂ → O₂ + 2H⁺ + 2e⁻" },
      { id:"so", t:"SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺ + 2e⁻" }],
    red:[
      { id:"mn", t:"MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", col:"purple → nearly colourless" },
      { id:"cr", t:"Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O", col:"orange → green" },
      { id:"ag", t:"Ag⁺ + e⁻ → Ag", col:"colourless" },
      { id:"cu", t:"Cu²⁺ + 2e⁻ → Cu", col:"pale blue → colourless, but forms a solid" }],
    checks:["Electrons cancel", "Lowest whole numbers", "Colour change to follow", "Sample dissolves"],
    tips:["Multiply each half so both show the same number of electrons.", "If both multipliers share a factor, divide it out.", "Ag⁺ and Cu²⁺ don’t give a colour change you can watch in solution.", "Solid zinc can’t be measured into a flask as a solution."],
    explainPrompt:"Explain how you chose the multipliers and why your pair suits a titration.",
    vocab:"Use half-reaction, electrons, lowest terms and oxidizing agent.",
    more:"There’s more than one good pairing. Can you find them all?",
    afterAt:8,
    after3:"Permanganate always pairs with a 2-electron reducing agent as 5 : 2, because the LCM of 2 and 5 is 10."
  },
  cards:[
    ["Half-reaction", "One half of a redox reaction, showing either the electrons lost (oxidation) or gained (reduction)."],
    ["Acidic steps", "Atoms (not O, H) → H₂O for O → H⁺ for H → e⁻ for charge → equalize → add."],
    ["Where electrons go", "On the more positive side, until the charges match."],
    ["Equalize", "Multiply the halves so electrons lost = gained (use the LCM)."],
    ["Basic solution", "Add OH⁻ to both sides, one per H⁺; combine into H₂O; cancel."],
    ["H⁺(aq)", "Shorthand for H₃O⁺(aq) in redox half-reactions."],
    ["Final check", "Atoms equal <strong>and</strong> total charge equal on both sides."],
    ["Oxidation-number method", "The total rise in oxidation number = the total fall; then finish with H₂O and H⁺."],
    ["Disproportionation", "One species is both oxidized and reduced (2H₂O₂ → 2H₂O + O₂)."],
    ["Spectator ions", "Ions that don’t change (K⁺, SO₄²⁻); leave them out of the net equation."],
    ["Permanganate half", "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O"],
    ["Dichromate half", "Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O"]
  ]
};
