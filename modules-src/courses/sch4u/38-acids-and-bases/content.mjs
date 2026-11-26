// SCH4U 38 Acids and Bases. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/38-acids-and-bases.md
// The hero handoff, the Proton transfer animator, the Strength grid (particle pictures, pH gauge), the magnesium-test
// graph and the task preview are drawn by app.js. Every Ka comes from MV.chem.data (course table); percent ionization
// and pH are computed by app.js from it. Plan error: the plan rounds 0.0010 mol/L ethanoic acid to "12%"; the course Ka
// gives 12.5% (pH 3.90), so the module shows 12.5% throughout.

// Misconception core sentences (plan §3)
const M1 = "A conjugate pair differs by exactly one H⁺: NH₄⁺ and NH₃, not NH₄⁺ and NH₂⁻.";
const M2 = "Strength is how much ionizes; concentration is how much is dissolved.";
const M3 = "A weak acid ionizes a little and reaches equilibrium; a strong acid ionizes essentially 100%.";
const M4 = "In CH₃COOH only the H on the O is donated; the CH₃ hydrogens aren’t acidic.";
const M5 = "The stronger acid gives its proton away: equilibrium favours the <strong>weaker</strong> acid and base.";
const M6 = "In Brønsted–Lowry theory a base accepts H⁺. NH₃ does, making OH⁻ from water.";
const M7 = "Water donates H⁺ to NH₃ and accepts H⁺ from HCl: it’s amphiprotic.";
const KA = "<i>K</i><sub>a</sub>", KB = "<i>K</i><sub>b</sub>";

// Practice 1: conjugate pairs (acid, conjugate base, why)
const PAIRS = [
  ["HCl", "Cl⁻", "HCl minus one H⁺ is Cl⁻."],
  ["H₂O", "OH⁻", "Water minus one H⁺ is OH⁻."],
  ["H₃O⁺", "H₂O", "H₃O⁺ loses one H⁺ to give H₂O."],
  ["NH₄⁺", "NH₃", "NH₄⁺ loses one H⁺ to give NH₃."],
  ["CH₃COOH", "CH₃COO⁻", "The H on the O leaves: CH₃COO⁻."],
  ["H₂CO₃", "HCO₃⁻", "H₂CO₃ minus one H⁺ is HCO₃⁻."],
  ["HCO₃⁻", "CO₃²⁻", "As an acid, HCO₃⁻ loses one H⁺ to give CO₃²⁻."],
  ["HSO₄⁻", "SO₄²⁻", "HSO₄⁻ minus one H⁺ is SO₄²⁻."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const pairHints = (p) => ["Remove one H⁺ from " + p[0] + ".", "Take away one H and lower the charge by one.", p[1] + "."];

export default {
  id:"38-acids-and-bases",
  kind:"topic",
  title:"Acids and bases",
  topic:"Acids and Bases",
  readyTopic:"acids and bases",
  hero:{
    eq:'<span class="ab-heq"><span class="nw">HA + H₂O ⇌ <span class="ab-c-h3o">H₃O⁺</span> + <span class="ab-c-an">A⁻</span></span> <span class="ab-heq-sub">(acid + base ⇌ conjugate acid + conjugate base)</span></span>', eqSize:"sm",
    eqLabel:"H A plus H 2 O, equilibrium arrow, H 3 O plus plus A minus: acid plus base gives conjugate acid plus conjugate base",
    headline:"An acid–base reaction is a proton handoff",
    text:"In the <strong>Brønsted–Lowry</strong> picture, an <strong>acid</strong> gives away H⁺ and a <strong>base</strong> takes it. What’s left of the acid is its <strong>conjugate base</strong>; what the base becomes is its <strong>conjugate acid</strong>. <strong>Strong</strong> acids hand off every proton; <strong>weak</strong> acids reach an equilibrium where only a few do.",
    fig:{ html:'<div class="ab-hx"><svg class="ab-hx-svg" id="ab-hx-svg" viewBox="0 0 480 280" role="img" aria-label="An HF molecule and a water molecule approach. An H⁺ token hops from HF to water, making F⁻ and H₃O⁺. Brackets labelled conjugate pair link HF with F⁻ and H₂O with H₃O⁺. Then the token hops back and forth, leaving HF mostly intact: a weak acid is a two-way handoff."></svg><div class="ab-hx-row"><button type="button" class="btn ghost sm" id="ab-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can identify Brønsted–Lowry acids, bases and conjugate pairs in a reaction.",
    "I can recognize amphiprotic species and write their reactions as an acid and as a base.",
    "I can explain the difference between strong and weak acids and bases using dynamic equilibrium and percent ionization.",
    "I can distinguish an acid’s strength from its concentration.",
    "I can predict which side of an acid–base equilibrium is favoured using relative acid strengths.",
    "I can compare the Arrhenius and Brønsted–Lowry definitions and apply them to everyday substances."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Ions and formulas", goal:1,
          prompt:"What is left when a water molecule loses one H⁺?",
          options:[
            { t:"OH⁻", ok:true, why:"H₂O − H⁺ = OH⁻." },
            { t:"O²⁻", why:"Only one proton leaves." },
            { t:"H₃O⁺", why:"That’s water <strong>gaining</strong> H⁺." },
            { t:"H₂", why:"H⁺ is a proton, not an H atom pair." }],
          hints:["Remove one H and one + charge.", "H₂O → OH and the charge drops by one.", "OH⁻."] },
        { id:"w2", skill:"Ions and formulas", goal:1,
          prompt:"What forms when NH₃ gains one H⁺?",
          options:[
            { t:"NH₄⁺", ok:true, why:"Add H and add a + charge." },
            { t:"NH₄", why:"Don’t forget the charge from the proton." },
            { t:"NH₂⁻", why:"That’s NH₃ <strong>losing</strong> H⁺." },
            { t:"NH₃⁺", why:"The H must be added to the formula." }],
          hints:["H⁺ adds an H and a + charge.", "NH₃ + H⁺.", "NH₄⁺."] },
        { id:"w3", skill:"Neutralization", goal:6,
          prompt:"Which equation shows neutralization?",
          options:[
            { t:"HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)", ok:true, why:"Acid + base → salt + water." },
            { t:"2H₂(g) + O₂(g) → 2H₂O(l)", why:"That’s a synthesis (combustion) reaction." },
            { t:"NaCl(s) → Na⁺(aq) + Cl⁻(aq)", why:"That’s dissolving." },
            { t:"CaCO₃(s) → CaO(s) + CO₂(g)", why:"That’s a decomposition." }],
          hints:["Look for an acid and a base.", "HCl and NaOH.", "HCl + NaOH → NaCl + H₂O."] },
        { id:"w4", skill:"Neutralization", goal:6,
          prompt:"In Arrhenius theory, a base is a substance that…",
          options:[
            { t:"produces OH⁻ in water", ok:true, why:"That’s the Arrhenius definition." },
            { t:"accepts H⁺", why:"That’s the Brønsted–Lowry definition, coming next." },
            { t:"tastes sour", why:"Acids taste sour; never taste lab chemicals." },
            { t:"contains hydrogen", why:"Many acids contain hydrogen; that isn’t a base definition." }],
          hints:["Arrhenius focuses on ions in water.", "Acids give H⁺; bases give…", "OH⁻."] },
        { id:"w5", skill:"Equilibrium position", goal:5,
          prompt:"A reaction has <i>K</i> = 4.0 × 10⁵. At equilibrium, which side dominates?",
          options:[
            { t:"Products", ok:true, why:"<i>K</i> ≫ 1 (module 36)." },
            { t:"Reactants", why:"That’s <i>K</i> ≪ 1." },
            { t:"Neither: always half and half", why:"The size of <i>K</i> decides." },
            { t:"It depends only on speed", why:"<i>K</i> tells position, not speed." }],
          hints:["Is <i>K</i> bigger or smaller than 1?", "Much bigger.", "Products."] },
        { id:"w6", skill:"Equilibrium position", goal:3,
          prompt:"In a sealed flask at equilibrium, the forward and reverse rates are…",
          options:[
            { t:"equal, so the amounts stay constant", ok:true, why:"Dynamic equilibrium." },
            { t:"both zero", why:"The reactions continue." },
            { t:"forward faster", why:"Then the amounts would keep changing." },
            { t:"reverse faster", why:"Same problem." }],
          hints:["Recall module 34.", "Nothing changes overall, but both reactions continue.", "Equal."] }
      ],
      refreshers:{
        "Ions and formulas":"Losing H⁺: remove one H and subtract one from the charge. Gaining H⁺: add one H and add one to the charge.",
        "Neutralization":"Acid + base → salt + water. Arrhenius: acids make H⁺ (H₃O⁺) in water; bases make OH⁻.",
        "Equilibrium position":"<i>K</i> ≫ 1 favours products; <i>K</i> ≪ 1 favours reactants. At equilibrium, the rates are equal."
      }
    }
  },
  explore:{
    heading:"Proton transfer animator",
    intro:"Pick an acid and a base, watch the proton move, and switch to the particle view to see how much ionizes.",
    how:"Choose a mode. <strong>Pair up:</strong> pick an acid and a base and watch the H⁺ move. <strong>Particle view:</strong> pick an acid and a concentration to see 100 of its molecules in water. <strong>Which side wins?:</strong> compare the two acids’ " + KA + " values on the balance. Arrow keys move through each row of choices.",
    modes:[{ id:"pair", t:"Pair up" }, { id:"particle", t:"Particle view" }, { id:"wins", t:"Which side wins?" }],
    reasonQ:"Why is this side favoured? (challenge 3)",
    reasons:[
      { id:"weaker", t:"The acid on the left is the weaker acid" },
      { id:"stronger", t:"The acid on the left is the stronger acid" },
      { id:"base", t:"The base on the left is the stronger base" },
      { id:"even", t:"Both acids are weak, so it’s even" }],
    note:KA + " values: course data table (25 °C). The particle view shows 100 molecules; percent ionization is computed from " + KA + ".",
    predictions:[
      { id:"p1", prompt:"Pair up: HCl + H₂O. Which species is the conjugate base of HCl?",
        options:[{ t:"Cl⁻", ok:true }, { t:"H₃O⁺" }, { t:"H₂O" }, { t:"OH⁻" }],
        explain:"Remove one H⁺ from HCl: Cl⁻. H₃O⁺ is the conjugate acid of water." },
      { id:"p2", prompt:"Pair up: NH₃ + H₂O. What role does water play here?",
        options:[{ t:"acid", ok:true }, { t:"base" }, { t:"neither" }, { t:"catalyst" }],
        explain:"Water donates H⁺, so it’s the acid. NH₃ is a base even though it has no OH⁻." },
      { id:"p3", prompt:"Particle view: 0.10 mol/L CH₃COOH. About how many of every 100 ethanoic acid molecules are ionized?",
        options:[{ t:"about 1", ok:true }, { t:"about 50" }, { t:"all 100" }, { t:"none" }],
        explain:"1 of the 100 tokens splits (1.3%). A weak acid reaches equilibrium with most molecules intact; it does ionize a little." },
      { id:"p4", prompt:"Which side wins: HF + CH₃COO⁻ ⇌ F⁻ + CH₃COOH. Which side is favoured?",
        options:[{ t:"products", ok:true }, { t:"reactants" }, { t:"neither" }, { t:"you need concentrations to tell" }],
        explain:"The balance tips right. HF (" + KA + " 6.6 × 10⁻⁴) is the stronger acid, so it gives its proton away. The side with the weaker acid, CH₃COOH, is favoured." }
    ],
    chalIntro:"Use the animator to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build a reaction in which HCO₃⁻ acts as a <strong>base</strong>.",
        why:"HCO₃⁻ accepts H⁺ and becomes its conjugate acid, H₂CO₃. With another acid it would give H⁺ away instead: it’s amphiprotic.",
        hints:["A base accepts H⁺.", "Choose an acid to give HCO₃⁻ a proton.", "e.g. HCl + HCO₃⁻ → Cl⁻ + H₂CO₃."] },
      { id:"tc2", goal:3, prompt:"Particle view, CH₃COOH: make <strong>more than 10%</strong> of the molecules ionize.",
        why:"At 0.0010 mol/L, 12.5% of the ethanoic acid is ionized. Diluting a weak acid shifts its equilibrium toward the side with more dissolved particles, so a larger fraction ionizes.",
        hints:["Try each concentration and watch the percentage.", "Diluting favours the side with more particles.", "0.0010 mol/L gives 12.5%."] },
      { id:"tc3", goal:5, stretch:true, prompt:"In <strong>Which side wins?</strong>, build a reaction from table acids (CH₃COOH, HCOOH, HF, NH₄⁺) and their conjugate bases in which the <strong>reactants</strong> are favoured, and pick the reason.",
        why:"The acid on the left is weaker than the acid it would make, so it keeps its proton: the reactants are favoured. Six pairs work: CH₃COOH + F⁻, CH₃COOH + HCOO⁻, HCOOH + F⁻, NH₄⁺ + CH₃COO⁻, NH₄⁺ + HCOO⁻ and NH₄⁺ + F⁻.",
        hints:["Reactants are favoured when the acid on the left is weaker than the acid it would make.", "Compare the " + KA + " of your acid with the " + KA + " of the base’s conjugate acid.", "e.g. NH₄⁺ (5.6 × 10⁻¹⁰) + F⁻ would make HF (6.6 × 10⁻⁴): reactants win."] }
    ]
  },
  part3:{
    slug:"strength", name:"Strength", heading:"Strong vs weak, concentrated vs dilute",
    intro:"Two ideas students often mix up: how much of an acid <strong>ionizes</strong> (strength) and how much is <strong>dissolved</strong> (concentration). Here you work from particle pictures, pH and conductivity: data, not the animator.",
    grid:{ title:"Station 1: The strength grid",
      intro:"Each card shows 100 acid molecules: an ionized one splits into H₃O⁺ (magenta) and its anion (teal). Tap a card to see how its pH was found.",
      cols:["Concentrated (1.0 mol/L)", "Dilute (0.0010 mol/L)"], rows:["Strong (HCl)", "Weak (CH₃COOH)"],
      cond:{ sc:"very high", sd:"low", wc:"low", wd:"very low" },
      dataTitle:"Check it with data",
      note:"pH values are computed from the course " + KA + "; conductivities are described in words. You’ll calculate values like these yourself in modules 39 and 40." },
    mg:{ title:"Station 2: The magnesium test",
      intro:"Equal volumes (50 mL) of 0.10 mol/L HCl and 0.10 mol/L CH₃COOH each react with excess magnesium ribbon. The hydrogen gas is collected and its volume graphed over time. Equal concentrations and volumes are the controlled variables.",
      ask:"Why do both curves level off at the same volume? Tap the best explanation.",
      chips:[
        { t:"Same moles of acid; as H₃O⁺ is used up, more CH₃COOH ionizes (Le Chatelier).", ok:true, why:"Both flasks hold 0.0050 mol of acid. Mg removes H₃O⁺, so the ethanoic acid equilibrium keeps shifting right until all of it has reacted." },
        { t:"CH₃COOH makes more gas per mole, so it catches up.", why:"Each mole of either acid gives the same amount of H₂. What differs is how fast." },
        { t:"The magnesium ran out in both flasks.", why:"The magnesium is in excess: the acid runs out first." },
        { t:"The HCl gas escaped early.", why:"The gas collected is hydrogen from the reaction, not HCl." }],
      note:"Model data: rounded, shaped like real results." },
    blocks:[{ title:"Safety", html:"<p><strong>Strong acids and bases are corrosive. Weak doesn’t mean safe.</strong></p>" }],
    quickCheck:{
      title:"Quick check", summary:"Strength quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which has the lower pH: 1.0 mol/L CH₃COOH or 0.0010 mol/L HCl?",
          choices:[
            { t:"1.0 mol/L CH₃COOH", ok:true, fb:"Right. pH 2.37 vs 3.00: concentration can beat strength." },
            { t:"0.0010 mol/L HCl", fb:"pH 2.37 vs 3.00: concentration can beat strength." },
            { t:"equal", fb:"pH 2.37 vs 3.00: concentration can beat strength." },
            { t:"can’t tell", fb:"pH 2.37 vs 3.00: concentration can beat strength." }] },
        { id:"q2", goal:4, prompt:"Which word describes 0.0010 mol/L HCl?",
          choices:[
            { t:"strong and dilute", ok:true, fb:"Right. It ionizes completely, but there’s little of it." },
            { t:"weak and dilute", fb:"It ionizes completely, but there’s little of it." },
            { t:"strong and concentrated", fb:"It ionizes completely, but there’s little of it." },
            { t:"weak and concentrated", fb:"It ionizes completely, but there’s little of it." }] },
        { id:"q3", goal:3, prompt:"Why do both acids in the magnesium test give the same final gas volume?",
          choices:[
            { t:"Same moles of acid react eventually", ok:true, fb:"Right. Removing H₃O⁺ makes more CH₃COOH ionize." },
            { t:"Mg runs out first", fb:"Removing H₃O⁺ makes more CH₃COOH ionize." },
            { t:"Weak acids make more gas", fb:"Removing H₃O⁺ makes more CH₃COOH ionize." },
            { t:"The gas escapes", fb:"Removing H₃O⁺ makes more CH₃COOH ionize." }] },
        { id:"q4", goal:3, prompt:"Which variable must be the same for a fair strength comparison?",
          choices:[
            { t:"concentration", ok:true, fb:"Right. Compare strength at equal concentration and volume." },
            { t:"colour", fb:"Compare strength at equal concentration and volume." },
            { t:"beaker shape", fb:"Compare strength at equal concentration and volume." },
            { t:"room lighting", fb:"Compare strength at equal concentration and volume." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Conjugate pairs", summary:"Conjugate pairs", goal:[1, 2],
        instruction:"Match each acid to its conjugate base. One base on the right has no partner.",
        leftTitle:"Acid", rightTitle:"Conjugate base",
        left:PAIRS.map((p, i) => ({ id:"l" + (i + 1), t:p[0], why:p[2], hints:i === 6 ? ["HCO₃⁻ appears twice in the list.", "As an acid, it loses H⁺.", "CO₃²⁻."] : pairHints(p) })),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r9", t:"NH₂⁻" }]),
        answer:MATCH_ANS,
        wrong:{ "l4|r9":"That removes a second H⁺ from NH₃; NH₄⁺’s conjugate base is NH₃.", "l6|r7":"Two H⁺ apart: H₂CO₃ → HCO₃⁻ → CO₃²⁻.", "l3|r2":"H₃O⁺ loses one H⁺ to give H₂O." },
        wrongDefault:"Conjugates differ by exactly one H⁺." },
      { id:"wins", type:"mc", title:"Which side wins?", summary:"Which side wins?", star:true, goal:[2, 3, 4, 5],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check. " + KA + " values are from the course table.",
        items:[
          { id:"r1", goal:5, prompt:"CH₃COOH + NH₃ ⇌ CH₃COO⁻ + NH₄⁺: favoured side?",
            options:[
              { t:"Products", ok:true, why:"CH₃COOH (1.8 × 10⁻⁵) is far stronger than NH₄⁺ (5.6 × 10⁻¹⁰), so it gives its proton to NH₃." },
              { t:"Reactants", why:"CH₃COOH (1.8 × 10⁻⁵) is far stronger than NH₄⁺ (5.6 × 10⁻¹⁰). " + M5 },
              { t:"Neither", why:"The two " + KA + " values differ by about 32 000 times." },
              { t:"You need concentrations to tell", why:"Relative acid strength predicts the favoured side." }] },
          { id:"r2", goal:5, prompt:"NH₄⁺ + F⁻ ⇌ NH₃ + HF: favoured side?",
            options:[
              { t:"Reactants", ok:true, why:"NH₄⁺ (5.6 × 10⁻¹⁰) is far weaker than HF (6.6 × 10⁻⁴), so the weaker acid keeps its proton." },
              { t:"Products", why:"HF is the stronger acid; it would give the proton back." },
              { t:"Neither", why:"The two " + KA + " values differ by about a million times." },
              { t:"You need concentrations to tell", why:"Relative acid strength predicts the favoured side." }] },
          { id:"r3", goal:2, star:true, prompt:"Choose the two equations showing HCO₃⁻ as an acid and as a base.",
            options:[
              { t:"HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O and HCO₃⁻ + H₃O⁺ → H₂CO₃ + H₂O", ok:true, why:"In the first, HCO₃⁻ donates H⁺ (acid); in the second, it accepts H⁺ (base)." },
              { t:"HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O and HCO₃⁻ + NH₃ → CO₃²⁻ + NH₄⁺", why:"Both show HCO₃⁻ donating H⁺. One must donate, the other accept." },
              { t:"HCO₃⁻ + H₃O⁺ → H₂CO₃ + H₂O and HCO₃⁻ + HF → H₂CO₃ + F⁻", why:"Both show HCO₃⁻ accepting H⁺. One must donate, the other accept." },
              { t:"HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O and CO₃²⁻ + H₂O → HCO₃⁻ + OH⁻", why:"In the second, HCO₃⁻ is a product, not the reactant. One must donate, the other accept." }] },
          { id:"r4", goal:2, star:true, prompt:"How many acidic hydrogens does ethanoic acid, CH₃COOH, have?",
            options:[
              { t:"1", ok:true, why:M4 },
              { t:"4", why:"Only the H on the oxygen is donated." },
              { t:"3", why:"The three CH₃ hydrogens aren’t acidic; only the H on the O is." },
              { t:"2", why:"Only the H on the oxygen is donated." }] },
          { id:"r5", goal:5, star:true, prompt:"Rank the conjugate bases F⁻, CH₃COO⁻, NH₃ from weakest to strongest.",
            options:[
              { t:"F⁻ < CH₃COO⁻ < NH₃", ok:true, why:"HF is the strongest of the three acids and NH₄⁺ the weakest, so F⁻ is the weakest base and NH₃ the strongest." },
              { t:"NH₃ < CH₃COO⁻ < F⁻", why:"The stronger the acid, the weaker its conjugate base." },
              { t:"CH₃COO⁻ < F⁻ < NH₃", why:"HF is a stronger acid than CH₃COOH, so F⁻ is the weaker base." },
              { t:"F⁻ < NH₃ < CH₃COO⁻", why:"NH₄⁺ is the weakest acid, so NH₃ is the strongest base." }],
            hints:["Find each conjugate acid’s " + KA + ": HF, CH₃COOH, NH₄⁺.", "HF is strongest, NH₄⁺ weakest.", "So F⁻ is the weakest base and NH₃ the strongest."] },
          { id:"r6", goal:[3, 4], star:true, prompt:"<strong>Investigation:</strong> equal volumes of 0.10 mol/L HCl and 0.10 mol/L CH₃COOH react with excess magnesium. Predict the initial rate and the final gas volume.",
            options:[
              { t:"HCl faster; same final volume", ok:true, why:"HCl starts with far more H₃O⁺, so it reacts faster; the same moles of acid give the same total gas." },
              { t:"HCl faster; more gas from HCl", why:"Same moles of acid give the same total gas." },
              { t:"Same rate; same final volume", why:"HCl starts with far more H₃O⁺, so it reacts faster." },
              { t:"CH₃COOH faster; more gas from CH₃COOH", why:"CH₃COOH starts with much less H₃O⁺, and the same moles of acid give the same total gas." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Usman", how:"", goal:[1, 4, 5],
        instruction:"Usman made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Identify the conjugate pairs in NH₄⁺ + OH⁻ ⇌ NH₃ + H₂O.",
            steps:["NH₄⁺ gives H⁺ to OH⁻, so NH₄⁺ is the acid.", "OH⁻ accepts H⁺, so OH⁻ is the base.", "The conjugate base of NH₄⁺ is NH₂⁻.", "The conjugate acid of OH⁻ is H₂O."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"NH₄⁺ loses one H⁺ to give NH₃, its conjugate base.", ok:true, why:M1 },
              { t:"The conjugate base of NH₄⁺ is H₂O.", why:"H₂O comes from OH⁻." },
              { t:"The conjugate base of NH₄⁺ is NH₄.", why:"Losing H⁺ removes an H." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["How many H⁺ does NH₄⁺ lose here?", "One.", "NH₃."] },
          { id:"e2", goal:4, task:"Compare 0.0010 mol/L HCl with 1.0 mol/L CH₃COOH.",
            steps:["HCl ionizes completely in water.", "But this HCl is only 0.0010 mol/L, so it’s a weak acid.", "CH₃COOH at 1.0 mol/L is concentrated, so it’s a strong acid."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 repeats the same mix-up; the first one is earlier."],
            fixes:[
              { t:"0.0010 mol/L HCl is a <strong>dilute strong</strong> acid; 1.0 mol/L CH₃COOH is a <strong>concentrated weak</strong> acid.", ok:true, why:M2 },
              { t:"Both are weak.", why:"HCl ionizes completely at any concentration." },
              { t:"Both are strong.", why:"CH₃COOH ionizes only about 0.4%." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["What does ‘weak’ describe?", "How much ionizes, not how much is dissolved.", "Dilute strong vs concentrated weak."] },
          { id:"e3", goal:5, task:"Which side is favoured: HCOOH + F⁻ ⇌ HCOO⁻ + HF?",
            steps:["The acids are HCOOH (" + KA + " 1.8 × 10⁻⁴) and HF (" + KA + " 6.6 × 10⁻⁴).", "HF is the stronger acid.", "So the side with HF, the products, is favoured."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"The stronger acid gives its proton away, so the side with the weaker acid (HCOOH, the reactants) is favoured.", ok:true, why:M5 },
              { t:"Neither is favoured, because both are weak.", why:"Relative strength still decides." },
              { t:"Products, because F⁻ is a strong base.", why:"F⁻ is a weak base." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Which acid holds its proton more loosely?", "HF: it gives H⁺ away.", "Equilibrium sits on the HCOOH side."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: water acting as an acid (P2) or 1.0 mol/L ethanoic acid beating 0.0010 mol/L HCl (Part 3)?" },
      { id:"j2", q:"In your own words, explain the difference between a strong acid and a concentrated acid." },
      { id:"j3", q:"Explain to a friend how to find the conjugate pairs in any acid–base reaction." },
      { id:"j4", q:"Which idea still trips you up (conjugates, amphiprotic species, or which side wins)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In HNO₃ + H₂O → NO₃⁻ + H₃O⁺, what is the conjugate base of HNO₃?", options:[
          { t:"NO₃⁻", ok:true, why:"HNO₃ minus one H⁺." },
          { t:"H₃O⁺", why:"That’s the conjugate acid of water." },
          { t:"H₂O", why:"Water is the base here." },
          { t:"NO₂⁻", why:"Only one H⁺ is removed; the oxygens stay." }] },
        b:{ prompt:"In NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, what is the conjugate acid of NH₃?", options:[
          { t:"NH₄⁺", ok:true, why:"NH₃ plus one H⁺." },
          { t:"OH⁻", why:"That’s the conjugate base of water." },
          { t:"H₂O", why:"Water is the acid here." },
          { t:"NH₂⁻", why:"That’s NH₃ losing H⁺, not gaining it." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which species is amphiprotic?", options:[
          { t:"HCO₃⁻", ok:true, why:"It can donate H⁺ (to CO₃²⁻) or accept H⁺ (to H₂CO₃)." },
          { t:"CO₃²⁻", why:"It has no H⁺ to donate." },
          { t:"Cl⁻", why:"It neither donates nor (effectively) accepts H⁺ in water." },
          { t:"NH₄⁺", why:"It can only donate H⁺." }] },
        b:{ prompt:"Which species can act as both an acid and a base?", options:[
          { t:"H₂O", ok:true, why:"It donates H⁺ to NH₃ and accepts H⁺ from HCl." },
          { t:"H₃O⁺", why:"It can only donate." },
          { t:"Na⁺", why:"It has no H⁺ and doesn’t accept one." },
          { t:"F⁻", why:"It can only accept." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which statement describes a strong acid in water?", options:[
          { t:"It ionizes essentially 100%", ok:true, why:"A strong acid donates essentially every proton to water." },
          { t:"It stays mostly un-ionized.", why:"That’s a weak acid." },
          { t:"It must be concentrated.", why:"Strength isn’t concentration." },
          { t:"It always has a pH of 0.", why:"pH depends on concentration too." }] },
        b:{ prompt:"Which statement describes a weak base such as NH₃ in water?", options:[
          { t:"Only a small fraction accepts H⁺, and an equilibrium forms with most NH₃ unchanged", ok:true, why:"A weak base reacts a little and reaches equilibrium." },
          { t:"It doesn’t react with water at all.", why:"A weak base does react a little: some NH₃ accepts H⁺ and an equilibrium forms." },
          { t:"It reacts completely, like NaOH.", why:"That’s a strong base." },
          { t:"It must be dilute.", why:M2 }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Which side is favoured: HF + NH₃ ⇌ F⁻ + NH₄⁺?", options:[
          { t:"Products, because HF (" + KA + " 6.6 × 10⁻⁴) is a much stronger acid than NH₄⁺ (" + KA + " 5.6 × 10⁻¹⁰)", ok:true, why:"The stronger acid, HF, gives its proton away, so the side with the weaker acid, NH₄⁺, is favoured." },
          { t:"Reactants, because HF is the stronger acid.", why:M5 },
          { t:"Neither: both sides are equally favoured.", why:"The " + KA + " values differ by about a million times." },
          { t:"It can’t be predicted without concentrations.", why:"Relative strength predicts the favoured side." }] },
        b:{ prompt:"Which side is favoured: CH₃COOH + F⁻ ⇌ CH₃COO⁻ + HF?", options:[
          { t:"Reactants, because CH₃COOH (" + KA + " 1.8 × 10⁻⁵) is a weaker acid than HF (" + KA + " 6.6 × 10⁻⁴)", ok:true, why:"The weaker acid keeps its proton, so the reactants are favoured." },
          { t:"Products, because HF forms.", why:M5 },
          { t:"Neither.", why:"The " + KA + " values differ by about 37 times." },
          { t:"It can’t be predicted without concentrations.", why:"Relative strength predicts the favoured side." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which has the higher [H₃O⁺]: 1.0 mol/L CH₃COOH (about 0.42% ionized) or 0.0010 mol/L HCl?", options:[
          { t:"1.0 mol/L CH₃COOH: 0.42% of 1.0 mol/L is 4.2 × 10⁻³ mol/L, more than 1.0 × 10⁻³", ok:true, why:"Concentration can beat strength." },
          { t:"0.0010 mol/L HCl, because strong acids always give more H₃O⁺.", why:M2 },
          { t:"They’re equal, because both are acids.", why:"Work out each [H₃O⁺]." },
          { t:"You can’t compare a strong acid with a weak one.", why:"You can: compare [H₃O⁺]." }] },
        b:{ prompt:"Which has the higher [OH⁻]: 1.0 mol/L NH₃ (about 0.42% ionized) or 0.0010 mol/L NaOH?", options:[
          { t:"1.0 mol/L NH₃: about 4.2 × 10⁻³ mol/L of OH⁻, more than 1.0 × 10⁻³", ok:true, why:"Concentration can beat strength." },
          { t:"0.0010 mol/L NaOH, because strong bases always give more OH⁻.", why:M2 },
          { t:"They’re equal.", why:"Work out each [OH⁻]." },
          { t:"NH₃ gives no OH⁻, because it has no OH group.", why:M6 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"0.10 mol/L CH₃COOH is 1.3% ionized. If it’s diluted to 0.010 mol/L, its percent ionization will…", options:[
          { t:"increase (to about 4%), because dilution favours the side with more dissolved particles", ok:true, why:"Less acid in total, but a larger fraction ionizes: 4.2%." },
          { t:"decrease, because there’s less acid.", why:"Less acid in total, but a larger fraction ionizes." },
          { t:"stay at 1.3%, because the acid’s strength doesn’t change.", why:KA + " stays the same; the percentage changes." },
          { t:"drop to zero.", why:M3 }] },
        b:{ prompt:"1.0 × 10⁻³ mol/L CH₃COOH is about 12.5% ionized. If it’s made 100 times more concentrated, its percent ionization will…", options:[
          { t:"decrease (to about 1.3%)", ok:true, why:"Crowding the solution favours the un-ionized side." },
          { t:"increase, because there’s more acid.", why:"More acid, but a smaller fraction ionizes." },
          { t:"stay at 12.5%.", why:KA + " stays the same; the percentage changes." },
          { t:"reach 100%.", why:"Weak acids never ionize completely." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why NH₃ is a base even though it has no OH⁻ in its formula?", options:[
          { t:"“In Brønsted–Lowry theory a base accepts H⁺. NH₃ accepts H⁺ from water, which leaves OH⁻ in solution.”", ok:true, why:"It uses the Brønsted–Lowry definition and shows where the OH⁻ comes from." },
          { t:"“NH₃ secretly contains an OH group.”", why:"Its formula has no O." },
          { t:"“NH₃ is an Arrhenius base, so it contains OH⁻.”", why:M6 },
          { t:"“Every compound with nitrogen is a base.”", why:"Nitric acid, HNO₃, contains nitrogen and is an acid." }] },
        b:{ prompt:"Which statement best describes water’s role in HCl(aq) and in NH₃(aq)?", options:[
          { t:"“Water is a base toward HCl (it accepts H⁺) and an acid toward NH₃ (it donates H⁺): it’s amphiprotic.”", ok:true, why:M7 },
          { t:"“Water is neutral in both, so it does nothing.”", why:M7 },
          { t:"“Water is an acid in both.”", why:"It accepts H⁺ from HCl." },
          { t:"“Water is a base in both.”", why:"It donates H⁺ to NH₃." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the clearest explanation of the difference between a weak acid and a dilute acid?", options:[
          { t:"“‘Weak’ describes how much of the acid ionizes; ‘dilute’ describes how much acid is dissolved per litre.”", ok:true, why:"It separates the two ideas: how much ionizes vs how much is dissolved." },
          { t:"“They mean the same thing.”", why:M2 },
          { t:"“Weak acids are always dilute.”", why:"1.0 mol/L ethanoic acid is weak and concentrated." },
          { t:"“Dilute acids ionize less than concentrated ones.”", why:"Dilution actually raises a weak acid’s percent ionization." }] },
        b:{ prompt:"A student says, ‘1.0 mol/L ethanoic acid is a strong acid because it’s concentrated.’ Which is the best correction?", options:[
          { t:"“Strength is about ionization: ethanoic acid ionizes only about 0.4% even at 1.0 mol/L, so it’s a concentrated weak acid.”", ok:true, why:"It says what strength measures and gives the evidence." },
          { t:"“It’s strong only above 1.0 mol/L.”", why:M2 },
          { t:"“It’s a strong base.”", why:"It’s an acid." },
          { t:"“Its strength depends on the temperature only.”", why:"Strength comes from how much ionizes." }] } },
      { id:"a1", cat:"A", goal:[2, 6],
        a:{ prompt:"Baking soda (NaHCO₃) is sprinkled on a vinegar spill. Which equation shows HCO₃⁻ acting as a base?", options:[
          { t:"CH₃COOH + HCO₃⁻ → CH₃COO⁻ + H₂CO₃", ok:true, why:"HCO₃⁻ accepts H⁺ from ethanoic acid." },
          { t:"HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O", why:"Here HCO₃⁻ donates H⁺: acting as an acid." },
          { t:"HCO₃⁻ → H⁺ + CO₃²⁻", why:"Also acting as an acid." },
          { t:"Na⁺ + CH₃COOH → NaCH₃COO + H⁺", why:"Na⁺ isn’t the base." }] },
        b:{ prompt:"An antacid tablet contains carbonate ions. Which equation shows it neutralizing stomach acid?", options:[
          { t:"CO₃²⁻ + H₃O⁺ → HCO₃⁻ + H₂O", ok:true, why:"CO₃²⁻ accepts H⁺." },
          { t:"HCO₃⁻ + H₂O → CO₃²⁻ + H₃O⁺", why:"That makes more acid." },
          { t:"CO₃²⁻ + OH⁻ → HCO₃⁻ + O²⁻", why:"CO₃²⁻ can’t donate H⁺; it has none." },
          { t:"CO₃²⁻ + H₂O → CO₂ + 2OH⁻", why:"Unbalanced, and not a neutralization of H₃O⁺." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Methylamine (" + KB + " 4.4 × 10⁻⁴) is a stronger base than ammonia (" + KB + " 1.8 × 10⁻⁵). Which side is favoured: CH₃NH₂ + NH₄⁺ ⇌ CH₃NH₃⁺ + NH₃?", options:[
          { t:"Products, because the stronger base (CH₃NH₂) takes the proton", ok:true, why:"Equilibrium favours the weaker base, NH₃." },
          { t:"Reactants, because NH₄⁺ is a weak acid.", why:"NH₄⁺ is weak, but the comparison is between the two bases." },
          { t:"Reactants, because CH₃NH₂ is the stronger base.", why:"The stronger base wins the proton." },
          { t:"Neither.", why:"Their " + KB + " values differ by about 24 times." }] },
        b:{ prompt:"Which side is favoured: HCOOH + CH₃COO⁻ ⇌ HCOO⁻ + CH₃COOH?", options:[
          { t:"Products, because HCOOH (" + KA + " 1.8 × 10⁻⁴) is the stronger acid", ok:true, why:"The stronger acid gives its proton away, so the side with the weaker acid, CH₃COOH, is favoured." },
          { t:"Reactants, because HCOOH is the stronger acid.", why:M5 },
          { t:"Neither, because both are carboxylic acids.", why:"Their " + KA + " values differ tenfold." },
          { t:"It can’t be predicted without concentrations.", why:"Relative strength predicts the favoured side." }] } }
    ]
  },
  task:{
    title:"Pick the proton transfer", summary:"Pick the proton transfer",
    statement:"<p>Choose an acid and a base from the menus to build a reaction that strongly favours products. Can you find all the answers?</p><ol class=\"ab-conds\"><li>The acid and base are not a conjugate pair of each other (a real proton transfer happens).</li><li>Products are favoured.</li><li>Strongly favoured: the reaction’s <i>K</i> = " + KA + "(acid) ÷ " + KA + "(acid formed) is at least 100.</li></ol>",
    qA:"Acid", qB:"Base",
    acids:["CH3COOH", "HCOOH", "HF", "NH4+"], bases:["CH3COO-", "HCOO-", "F-", "NH3"],
    checks:["A real transfer", "Products favoured", "Strongly favoured"],
    tips:["HF with F⁻ just swaps the same proton back and forth. Pick a different base.", "The acid on the left must be stronger than the acid it makes.", "Your acids are too close in strength (e.g. HF vs CH₃COOH is only about 37 times). Pick a base whose conjugate acid is much weaker."],
    explainPrompt:"Explain why your reaction strongly favours products, using the strengths of the two acids and the two bases.",
    vocab:"Use the words conjugate acid, conjugate base, Ka and favoured.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every answer uses NH₃. Its conjugate acid, NH₄⁺, is by far the weakest acid on the menu, so NH₃ is by far the strongest base."
  },
  cards:[
    ["Brønsted–Lowry acid", "A proton (H⁺) donor."],
    ["Brønsted–Lowry base", "A proton acceptor; it needn’t contain OH⁻ (NH₃)."],
    ["Conjugate pair", "Two species that differ by exactly one H⁺: HF/F⁻, NH₄⁺/NH₃."],
    ["Amphiprotic", "Can act as an acid or a base: H₂O, HCO₃⁻."],
    ["Strong acid", "Ionizes essentially 100% in water: HCl, HBr, HI, HNO₃, HClO₄, H₂SO₄ (first H⁺)."],
    ["Weak acid", "Ionizes partly; reaches a dynamic equilibrium: CH₃COOH, HF."],
    ["Strong vs concentrated", "Strength = fraction ionized; concentration = amount dissolved per litre."],
    ["Percent ionization", "(amount ionized ÷ initial amount) × 100%; rises when a weak acid is diluted."],
    ["Which side wins?", "Equilibrium favours the weaker acid and weaker base."],
    ["Conjugate strength", "The stronger the acid, the weaker its conjugate base."],
    ["Arrhenius vs Brønsted–Lowry", "Arrhenius: acids give H⁺, bases give OH⁻ in water. Brønsted–Lowry: proton donors and acceptors."],
    ["H₃O⁺", "Hydronium: a water molecule that has accepted H⁺; the acid present in all acidic solutions."]
  ]
};
