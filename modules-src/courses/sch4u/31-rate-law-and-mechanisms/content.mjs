// SCH4U 31 Rate Law and Reaction Mechanisms. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/31-rate-law-and-mechanisms.md
// The hero (highway bottleneck), the Initial-rates analyser (Explore: trials table, comparison panel, orders, k, Mechanism mode,
// Rate law check), the Mechanism detective (Part 3: cancel-and-label stations, Cl/O₃ cycle counter, which mechanism fits),
// the custom practice activities and the "Plan the trials" grid are drawn by app.js.
// Rate constants for R1–R4 are the plan's model values (plan §6.3: "model", no course-table additions); they live here,
// not in MV.chem.data, which has no kinetics table.

const K = "<i>k</i>";
const RU = "mol/(L·s)";

// Misconception core sentences (plan §3)
const M1 = "Orders come from experiments. Only for a single elementary step do the coefficients give the orders.";
const M2 = "Doubling [A] multiplied the rate by 4 = 2², so the order is 2, the exponent, not 4.";
const M3 = "Zero order means the rate doesn’t depend on that concentration, not that the reactant stays put.";
const M4 = "The units of " + K + " make the rate come out in " + RU + ", so they change with the overall order.";
const M5 = "An intermediate is made, then used up. A catalyst is used, then made again.";
const M6 = "The slowest step sets the rate, and a rate law contains only species you can add to the flask.";
const M7 = "Change only one concentration between two trials, or you can’t tell which one caused the change.";

// Units of k by overall order (ids are the overall order)
const UNITS = [{ id:"0", t:"mol/(L·s)" }, { id:"1", t:"s⁻¹" }, { id:"2", t:"L/(mol·s)" }, { id:"3", t:"L²/(mol²·s)" }];

const tbl = (title, head, rows) => ({ title, head, rows });
const D1 = tbl("Data set D1: A → products", ["Trial", "[A] (mol/L)", "Initial rate (" + RU + ")"],
  [["1", "0.10", "3.0 × 10⁻³"], ["2", "0.20", "1.2 × 10⁻²"], ["3", "0.30", "2.7 × 10⁻²"]]);
const D2 = tbl("Data set D2: X + Y → Z", ["Trial", "[X] (mol/L)", "[Y] (mol/L)", "Initial rate (" + RU + ")"],
  [["1", "0.10", "0.10", "4.0 × 10⁻⁴"], ["2", "0.20", "0.10", "8.0 × 10⁻⁴"], ["3", "0.10", "0.20", "4.0 × 10⁻⁴"]]);
const D3 = tbl("Data set D3: M + N → products", ["Trial", "[M] (mol/L)", "[N] (mol/L)", "Initial rate (" + RU + ")"],
  [["1", "0.10", "0.10", "1.5 × 10⁻³"], ["2", "0.30", "0.10", "1.35 × 10⁻²"], ["3", "0.10", "0.20", "3.0 × 10⁻³"]]);

// Mechanism steps: [[species, coefficient], …] on each side
const st = (l, r) => ({ l, r });

export default {
  id:"31-rate-law-and-mechanisms",
  kind:"topic",
  title:"Rate law and reaction mechanisms",
  topic:"Rate Law and Reaction Mechanisms",
  readyTopic:"rate laws and mechanisms",
  hero:{
    eq:'<span class="rl-heq">rate = ' + K + '[A]<sup class="rl-ord">m</sup>[B]<sup class="rl-ord">n</sup><span class="rl-fbe"><span class="rl-ordc">m</span> <span class="rl-ordc">n</span> found by experiment</span></span>',
    eqSize:"md",
    eqLabel:"rate equals k times the concentration of A to the power m times the concentration of B to the power n; m and n are found by experiment",
    headline:"The slowest step sets the pace",
    text:"A <strong>rate law</strong> tells you how the rate depends on each concentration. The <strong>orders</strong> come from experiments, and the <strong>rate constant</strong> " + K + " ties it all together. Behind every rate law is a <strong>mechanism</strong>: a chain of simple steps, and the slowest one controls the whole reaction.",
    fig:{ html:'<div class="rl-hx"><svg class="rl-hx-svg" id="rl-hx-svg" viewBox="0 0 480 270" role="img" aria-label="A three-lane highway narrows to one lane labelled slow step, then widens again. Cars pile up before the narrow point. Labels then read Step 1 (slow): A + B → AB under the narrow lane and Step 2 (fast): AB + A → A₂B under the wide part, the slow lane glows, and the rate law rate = k[A][B] appears."></svg><div class="rl-hx-row"><p class="rl-hx-cap" id="rl-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="rl-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can write a rate law and state the order with respect to each reactant and the overall order.",
    "I can determine the orders and the rate constant <i>k</i> (with units) from initial-rates data.",
    "I can use a rate law to predict how the rate changes when concentrations change.",
    "I can describe a mechanism: elementary steps, intermediates, catalysts and the rate-determining step.",
    "I can decide whether a proposed mechanism is consistent with an experimental rate law.",
    "I can plan initial-rates trials that change one concentration at a time."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rate and its units", goal:2,
          prompt:"[C] rises from 0 to 0.060 mol/L in 20 s. What is the average rate of formation of C?",
          options:[
            { t:"3.0 × 10⁻³ " + RU, ok:true, why:"0.060 ÷ 20 = 0.0030." },
            { t:"1.2 " + RU, why:"Rate is change divided by time." },
            { t:"333 " + RU, why:"20 ÷ 0.060 has units of s·L/mol." },
            { t:"0.060 " + RU, why:"That’s the change, not the rate." }],
          hints:["Rate = Δ[C] ÷ Δ<i>t</i>.", "0.060 mol/L ÷ 20 s.", "3.0 × 10⁻³ " + RU + "."] },
        { id:"w2", skill:"Rate and its units", goal:1,
          prompt:"For 2X → Y, [X] falls at 0.010 " + RU + ". How fast does [Y] rise?",
          options:[
            { t:"0.0050 " + RU, ok:true, why:"2 X are used per Y made, so Y forms at half the rate." },
            { t:"0.010 " + RU, why:"Two X make one Y." },
            { t:"0.020 " + RU, why:"Y forms more slowly than X is used." },
            { t:"−0.010 " + RU, why:"[Y] is rising." }],
          hints:["Look at the coefficients.", "Each Y needs 2 X.", "0.010 ÷ 2 = 0.0050."] },
        { id:"w3", skill:"Powers and ratios", goal:2,
          prompt:"If 2<sup><i>n</i></sup> = 8, what is <i>n</i>?",
          options:[
            { t:"3", ok:true, why:"2 × 2 × 2 = 8." },
            { t:"4", why:"8 ÷ 2 = 4, but 2⁴ = 16." },
            { t:"8", why:"2⁸ = 256." },
            { t:"6", why:"2 × 3 = 6 isn’t a power." }],
          hints:["Multiply 2 by itself until you reach 8.", "2, 4, 8.", "Three factors: <i>n</i> = 3."] },
        { id:"w4", skill:"Powers and ratios", goal:3,
          prompt:"A quantity is proportional to <i>x</i>². If <i>x</i> is tripled, the quantity is multiplied by…",
          options:[
            { t:"9", ok:true, why:"3² = 9." },
            { t:"3", why:"That’s for <i>x</i>¹." },
            { t:"6", why:"Square, don’t double." },
            { t:"27", why:"That’s for <i>x</i>³." }],
          hints:["Replace <i>x</i> with 3<i>x</i>.", "(3<i>x</i>)² = 9<i>x</i>².", "× 9."] },
        { id:"w5", skill:"Collision theory and catalysts", goal:4,
          prompt:"How does a catalyst speed up a reaction?",
          options:[
            { t:"It provides a pathway with a lower activation energy", ok:true, why:"More collisions have enough energy." },
            { t:"It raises the temperature", why:"Temperature is a separate factor." },
            { t:"It is used up and supplies energy", why:"A catalyst is regenerated." },
            { t:"It shifts the products to a lower energy", why:"Δ<i>H</i> doesn’t change." }],
          hints:["Think about the energy diagram.", "The hump gets lower.", "Lower <i>E</i><sub>a</sub> pathway."] },
        { id:"w6", skill:"Collision theory and catalysts", goal:4,
          prompt:"Why does a higher concentration usually increase the rate?",
          options:[
            { t:"More particles per litre means more frequent collisions", ok:true, why:"More particles in the same space collide more often." },
            { t:"Each collision has more energy", why:"That’s temperature." },
            { t:"The activation energy drops", why:"That’s a catalyst." },
            { t:"The particles get bigger", why:"Particle size doesn’t change." }],
          hints:["Picture the particle box.", "Crowd more particles in.", "More collisions per second."] }
      ],
      refreshers:{
        "Rate and its units":"Rate = change in concentration ÷ time, in " + RU + ". Rates of different species are linked by the coefficients.",
        "Powers and ratios":"If doubling something multiplies a result by 2<sup><i>n</i></sup>, the exponent is <i>n</i>: ×2 → 1, ×4 → 2, ×1 → 0. Tripling: ×3 → 1, ×9 → 2.",
        "Collision theory and catalysts":"Reactions need collisions with enough energy (<i>E</i><sub>a</sub>) and the right orientation. Catalysts lower <i>E</i><sub>a</sub> and are regenerated."
      }
    }
  },
  explore:{
    heading:"Initial-rates analyser",
    intro:"Run trials, compare them two at a time, and build the rate law. Then switch to Mechanism mode and build the steps behind it.",
    how:"Choose a reaction and set the starting concentrations, then press <strong>Run trial</strong>. Tap two trials in the table to compare them. Choose an order for each reactant and watch the rate law, " + K + " and the fit update. In <strong>Mechanism</strong> mode, add step cards, mark the slow step and press <strong>Check mechanism</strong>.",
    modes:[{ id:"rates", t:"Initial rates" }, { id:"mech", t:"Mechanism" }, { id:"check", t:"Rate law check" }],
    model:"Model data: the simulator’s rate constants are model values chosen for clean arithmetic.",
    concs:[0.10, 0.20, 0.30, 0.40],
    orders:[0, 1, 2, 3, 4],
    units:UNITS,
    rx:[
      { id:"r1", t:"R1", eq:"A + B → C", sp:["A", "B"], answer:[1, 2], k:2.0 },
      { id:"r2", t:"R2", eq:"2X → Y", sp:["X"], answer:[2], k:0.50 },
      { id:"r3", t:"R3", eq:"P + Q → R", sp:["P", "Q"], answer:[1, 0], k:0.030 },
      { id:"r4", t:"R4", eq:"2H₂O₂ → 2H₂O + O₂ (I⁻ catalyst)", sp:["H₂O₂", "I⁻"], answer:[1, 1], k:0.010 }
    ],
    mechs:[{ id:"r4", t:"R4: H₂O₂ with I⁻" }, { id:"build", t:"Build: 2A + B → A₂B" }],
    r4mech:{ overall:st([["H₂O₂", 2]], [["H₂O", 2], ["O₂", 1]]), exp:[["H₂O₂", 1], ["I⁻", 1]],
      steps:[st([["H₂O₂", 1], ["I⁻", 1]], [["H₂O", 1], ["IO⁻", 1]]), st([["H₂O₂", 1], ["IO⁻", 1]], [["H₂O", 1], ["O₂", 1], ["I⁻", 1]])] },
    build:{ overall:st([["A", 2], ["B", 1]], [["A₂B", 1]]), exp:[["A", 1], ["B", 1]],
      cards:[
        { id:"S1", s:st([["A", 1], ["B", 1]], [["AB", 1]]) },
        { id:"S2", s:st([["AB", 1], ["A", 1]], [["A₂B", 1]]) },
        { id:"S3", s:st([["A", 2]], [["A₂", 1]]) },
        { id:"S4", s:st([["A₂", 1], ["B", 1]], [["A₂B", 1]]) },
        { id:"S5", s:st([["A", 1], ["AB", 1]], [["A₂", 1], ["B", 1]]) }] },
    read:{ rx:"Reaction", n:"Trials run", pair:"Selected pair", conc:"Concentration change", rate:"Rate change", ord:"Order implied", law:"Your rate law", k:"<i>k</i> (from trial 1)", fit:"Fit to all trials",
      add:"Steps add up to the overall equation", ints:"Intermediates", cats:"Catalysts", slow:"Rate law from the slow step", match:"Matches the experimental rate law", exp:"Experimental rate law" },
    predIntro:"Each prediction sets up the analyser. Choose an answer, then watch what happens.",
    predictions:[
      { id:"p1", prompt:"R3 (P + Q → R). You double [Q] and keep [P] the same. What happens to the initial rate?",
        options:[{ t:"Doubles" }, { t:"Stays the same", ok:true }, { t:"Quadruples" }, { t:"Halves" }],
        explain:"The rate doesn’t depend on [Q]: zero order in Q. The balanced equation has a 1 in front of Q, but orders come from experiments. Q is still used up as R forms." },
      { id:"p2", prompt:"R1, trials (0.10, 0.10) and (0.10, 0.20). The rate goes from 2.0 × 10⁻³ to 8.0 × 10⁻³ " + RU + ". What is the order in B?",
        options:[{ t:"2", ok:true }, { t:"4" }, { t:"1" }, { t:"8" }],
        explain:"The order is the exponent: 2<sup><i>n</i></sup> = 4 gives <i>n</i> = 2." },
      { id:"p3", prompt:"R2’s rate law is rate = " + K + "[X]². What are the units of " + K + "?",
        options:[{ t:"s⁻¹" }, { t:"L/(mol·s)", ok:true }, { t:"mol/(L·s)" }, { t:"L²/(mol²·s)" }],
        explain:"For second order overall, " + K + " is in L/(mol·s)." },
      { id:"p4", prompt:"Mechanism mode, R4. Step 1 (slow): H₂O₂ + I⁻ → H₂O + IO⁻. Step 2 (fast): H₂O₂ + IO⁻ → H₂O + O₂ + I⁻. Which species is the catalyst?",
        options:[{ t:"I⁻", ok:true }, { t:"IO⁻" }, { t:"H₂O₂" }, { t:"O₂" }],
        explain:"I⁻ is used in step 1 and remade in step 2. IO⁻ is made, then used up: it’s an intermediate." }
    ],
    predSetup:{ p1:"R3 in Initial rates mode.", p2:"R1 in Initial rates mode.", p3:"R2: building the units of " + K + ".", p4:"R4 in Mechanism mode." },
    chalIntro:"Use the analyser to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6], prompt:"Find R1’s rate law using <strong>no more than 3 trials</strong>.",
        why:"Rate × 2 when only [A] doubled and × 4 when only [B] doubled: rate = " + K + "[A][B]².",
        hints:["Start with a reference trial.", "Change only [A] in one trial and only [B] in another.", "(0.10, 0.10), (0.20, 0.10), (0.10, 0.20): rate × 2 and × 4, so rate = " + K + "[A][B]²."] },
      { id:"tc2", goal:2, prompt:"Find " + K + " for R2, with units.",
        why:K + " = 5.0 × 10⁻³ ÷ (0.10)² = 0.50 L/(mol·s).",
        hints:["Use one trial: [X] = 0.10, rate = 5.0 × 10⁻³.", K + " = rate ÷ [X]².", "5.0 × 10⁻³ ÷ 0.010 = 0.50 L/(mol·s)."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Mechanism mode. The overall reaction is 2A + B → A₂B and the experimental rate law is rate = " + K + "[A][B]. Build a two-step mechanism from the cards and mark the slow step so that it fits.",
        why:"S1 (slow) + S2 (fast): AB cancels, the sum is 2A + B → A₂B, and the slow step gives rate = " + K + "[A][B].",
        hints:["The slow step’s reactants become the rate law: you need A and B, once each.", "S1 is A + B → AB. What uses up AB and another A?", "S1 (slow) + S2 (fast): AB cancels and the sum is 2A + B → A₂B."] }
    ],
    msgs:{
      tc1:{ none:"Choose R1 and run some trials first.", orders:"Choose an order for both A and B.", swap:"Check which concentration changed in each pair.",
        four:"× 4 means 2², so order 2.", tooMany:"Plan so that every comparison changes only one concentration from the same reference trial.",
        pairs:"Your trials need one pair that changes only [A] and one pair that changes only [B].", wrong:"Your rate law doesn’t fit every trial. Compare two trials where only one concentration changes." },
      tc2:{ empty:"Enter " + K + " for R2 and choose its units.", tenth:"rate = " + K + "[X]², so divide by [X]² = 0.010, not by [X].", first:"Those are first-order units. " + M4,
        rate:"That’s the rate itself.", unit:"Choose the units of " + K + ".", units:M4, wrong:"Substitute one trial into rate = " + K + "[X]² and solve for " + K + "." },
      tc3:{ need2:"Build a two-step mechanism: add two cards.", slow:"Mark the slow step.", s34:"The steps add up, but the slow step predicts rate = " + K + "[A]².",
        s12:"The slow step’s rate law would contain AB, an intermediate you can’t add to the flask. Here the slow step must be the first one.",
        s14:"AB and A₂ don’t cancel; the steps must add up to 2A + B → A₂B.", order:"An intermediate has to be made before a step can use it. Put the step that makes it first.",
        sum:"The steps must add up to 2A + B → A₂B.", inter:M6, nomatch:"The steps add up, but the slow step doesn’t give rate = " + K + "[A][B]." },
      noDup:"That trial is already in the table.", full:"The table is full. Clear the trials to start again.",
      needLaw:"Choose every order and run at least one trial in Initial rates first.", needPred:"Type your predicted rate first.",
      maxSteps:"Two steps at most: remove one first."
    },
    blocks:[
      { title:"The big idea", html:"<p>Orders come from data, compared one variable at a time. " + K + "’s units follow from the order. The slow step’s rate law is the reaction’s rate law.</p>" }
    ]
  },
  part3:{
    slug:"mechanism", name:"Mechanisms", heading:"Mechanism detective",
    intro:"Real mechanisms, one step at a time. Cancel what appears on both sides, label the intermediate and the catalyst, then decide which mechanism fits the evidence.",
    s1:{ title:"Station 1: Add up the steps",
      intro:"R4: hydrogen peroxide with iodide. Tap a species that appears on both sides to cancel it. Then tap a label and tap the species it belongs on.",
      steps:[st([["H₂O₂", 1], ["I⁻", 1]], [["H₂O", 1], ["IO⁻", 1]]), st([["H₂O₂", 1], ["IO⁻", 1]], [["H₂O", 1], ["O₂", 1], ["I⁻", 1]])],
      slow:0,
      zoom:"Zoom to the particles",
      zoomText:"Step 1 is one H₂O₂ molecule colliding with one I⁻ ion. That collision is why the rate law is rate = " + K + "[H₂O₂][I⁻], and the catalyst appears in it." },
    s2:{ title:"Station 2: One atom, thousands of molecules",
      intro:"Chlorine atoms in the stratosphere destroy ozone. Cancel, label, then run the cycle.",
      steps:[st([["Cl", 1], ["O₃", 1]], [["ClO", 1], ["O₂", 1]]), st([["ClO", 1], ["O", 1]], [["Cl", 1], ["O₂", 1]])],
      run:"Run the cycle",
      // VERIFY: ozone recovery timeline (plan §6.4: "verify before release"); no dates are given to students.
      html:"<p><strong>CFCs and the ozone layer.</strong> Chlorofluorocarbons (CFCs) from old refrigerators and spray cans drifted up to the stratosphere, where sunlight broke them apart and released chlorine atoms. Because each Cl atom is a catalyst, a little chlorine destroyed a lot of ozone. The Montreal Protocol, signed in Montreal in 1987, phased out CFCs, and the ozone layer is slowly recovering.</p>" },
    s3:{ title:"Station 3: Which mechanism fits?",
      intro:"The overall reaction is 2A + B → A₂B and the experimental rate law is rate = " + K + "[A]². Test each mechanism with the two rules.",
      rules:["The steps add up to 2A + B → A₂B", "The slow step matches rate = " + K + "[A]²"],
      cands:[
        { id:"I", t:"Mechanism I", steps:["Step 1 (slow): 2A → A₂", "Step 2 (fast): A₂ + B → A₂B"], answer:["y", "y"],
          fb:"Mechanism I fits: A₂ cancels, and the slow step 2A → A₂ gives rate = " + K + "[A]²." },
        { id:"II", t:"Mechanism II", steps:["Step 1 (slow): A + B → AB", "Step 2 (fast): AB + A → A₂B"], answer:["y", "n"],
          fb:"Mechanism II adds up, but its slow step predicts rate = " + K + "[A][B]." },
        { id:"III", t:"Mechanism III", steps:["One step: 2A + B → A₂B"], answer:["y", "n"],
          fb:"Mechanism III adds up, but it predicts rate = " + K + "[A]²[B]; and three particles colliding at once is very unlikely." }
      ],
      addWrong:"Add the steps and cancel what appears on both sides. What is left?",
      matchWrong:"Only the slow step counts: its reactants, with their coefficients, give the rate law.",
      done:"Only mechanism I passes both tests. Evidence can rule mechanisms out; it never proves one is right." },
    quickCheck:{
      title:"Quick check", summary:"Mechanism detective quick check",
      items:[
        { id:"q1", goal:4, prompt:"In Station 2, what is ClO?",
          choices:[{ t:"intermediate", ok:true, fb:"Right. It’s made in step 1 and used in step 2." }, { t:"catalyst", fb:"It’s made in step 1 and used in step 2. " + M5 }, { t:"reactant", fb:"It’s made in step 1 and used in step 2." }, { t:"product", fb:"It’s made in step 1 and used in step 2." }] },
        { id:"q2", goal:4, prompt:"Overall equation for Station 2?",
          choices:[{ t:"O₃ + O → 2O₂", ok:true, fb:"Right. Cl and ClO cancel." }, { t:"Cl + O₃ → ClO + O₂", fb:"Cancel Cl and ClO." }, { t:"O₃ + Cl → 2O₂", fb:"Cancel Cl and ClO." }, { t:"2O₃ → 3O₂", fb:"Cancel Cl and ClO." }] },
        { id:"q3", goal:5, prompt:"Slow step 2A → A₂, then fast A₂ + B → A₂B. Predicted rate law?",
          choices:[{ t:"rate = " + K + "[A]²", ok:true, fb:"Right. Only the slow step counts, and it has no intermediates." }, { t:"rate = " + K + "[A]²[B]", fb:"Only the slow step counts, and it has no intermediates." }, { t:"rate = " + K + "[A₂][B]", fb:"Only the slow step counts, and it has no intermediates." }, { t:"rate = " + K + "[B]", fb:"Only the slow step counts, and it has no intermediates." }] },
        { id:"q4", goal:4, prompt:"Why can one Cl atom destroy thousands of O₃ molecules?",
          choices:[{ t:"It’s regenerated each cycle", ok:true, fb:"Right. A catalyst comes out unchanged and goes round again." }, { t:"It’s an intermediate", fb:"A catalyst comes out unchanged and goes round again." }, { t:"It’s very large", fb:"A catalyst comes out unchanged and goes round again." }, { t:"It reacts with O₂", fb:"A catalyst comes out unchanged and goes round again." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"orders", type:"custom", title:"Orders from data", summary:"Orders from data", goal:[1, 2],
        instruction:"Read each data set, then find the orders and " + K + ".",
        how:"Type a number or tap a chip, then press <strong>Check</strong>. Numbers like 4.0e-3 or 4.0 × 10^-3 are fine.",
        units:UNITS,
        items:[
          { id:"o1", kind:"ord", goal:2, table:D1, prompt:"Order in A (D1)?", sp:["A"], answer:[2],
            wrong:[{ at:{ A:4 }, fb:"Doubling gave × 4 = 2². " + M2 }],
            why:"Doubling [A] gave × 4 = 2², and tripling gave × 9 = 3²: order 2.",
            hints:["Compare trials 1 and 2: [A] doubled.", "The rate went × 4.", "2² = 4, so order 2."] },
          { id:"o2", kind:"k", goal:2, prompt:K + " for D1 (rate = " + K + "[A]²), with units?", answer:{ v:0.30, u:"2" },
            wrong:[{ v:0.030, fb:"Divide by [A]² = 0.010." }, { v:3.0e-3, fb:"That’s the rate itself." }, { u:"1", fb:"Overall second order: L/(mol·s). " + M4 }],
            why:K + " = 3.0 × 10⁻³ ÷ (0.10)² = 0.30 L/(mol·s).",
            hints:["Use trial 1: [A] = 0.10, rate = 3.0 × 10⁻³.", K + " = rate ÷ [A]².", "3.0 × 10⁻³ ÷ 0.010 = 0.30 L/(mol·s)."] },
          { id:"o3", kind:"ord", goal:2, table:D2, prompt:"Orders in X and Y (D2)?", sp:["X", "Y"], answer:[1, 0],
            wrong:[{ at:{ Y:1 }, fb:"Doubling [Y] left the rate unchanged." }, { at:{ X:2 }, fb:"Doubling [X] doubled the rate: 2¹ = 2." }],
            why:"Doubling [X] gave × 2 (order 1); doubling [Y] gave × 1 (order 0).",
            hints:["Compare trials 1 and 2 for X, trials 1 and 3 for Y.", "× 2 for X; × 1 for Y.", "X: 1, Y: 0."] },
          { id:"o4", kind:"k", goal:2, prompt:K + " for D2 (rate = " + K + "[X]), with units?", answer:{ v:4.0e-3, u:"1" },
            wrong:[{ u:"2", fb:"Overall first order: s⁻¹. " + M4 }, { v:0.040, fb:"Divide the rate by [X] = 0.10." }],
            why:K + " = 4.0 × 10⁻⁴ ÷ 0.10 = 4.0 × 10⁻³ s⁻¹.",
            hints:["Use trial 1: [X] = 0.10, rate = 4.0 × 10⁻⁴.", K + " = rate ÷ [X].", "4.0 × 10⁻⁴ ÷ 0.10 = 4.0 × 10⁻³ s⁻¹."] },
          { id:"o5", kind:"ord", goal:2, table:D3, prompt:"Orders in M and N (D3)?", sp:["M", "N"], answer:[2, 1],
            wrong:[{ at:{ M:9 }, fb:"Tripling gave × 9 = 3²." }, { at:{ M:3 }, fb:"× 9 for tripling means 3², not order 3." }, { at:{ N:2 }, fb:"Doubling [N] gave × 2: order 1." }],
            why:"Tripling [M] gave × 9 = 3² (order 2); doubling [N] gave × 2 (order 1).",
            hints:["Compare trials 1 and 2: only [M] changed.", "× 9 when [M] tripled.", "3² = 9, so order 2; trials 1 and 3 give order 1 in N."] },
          { id:"o6", kind:"units", goal:1, prompt:"Units of " + K + " for D3 (rate = " + K + "[M]²[N])?", answer:"3",
            wrong:[{ u:"2", fb:"Overall order 3." }, { u:"1", fb:"Overall order 3. " + M4 }, { u:"0", fb:"Overall order 3." }],
            why:"Overall order 3: L²/(mol²·s).",
            hints:["Add the exponents.", "2 + 1 = 3.", "Third order: L²/(mol²·s)."] }
        ] },
      { id:"puzzles", type:"custom", title:"Rate-law puzzles", summary:"Rate-law puzzles", star:true, goal:[2, 6],
        instruction:"Six puzzles. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number or tap a chip, then press <strong>Check</strong>.",
        units:UNITS,
        items:[
          { id:"r1", kind:"num", goal:3, prompt:"rate = " + K + "[A][B]². The rate is 2.0 × 10⁻³ " + RU + ". New rate if [A] is halved and [B] tripled?", unit:RU, answer:9.0e-3,
            wrong:[{ v:3.0e-3, fb:"[B] tripled multiplies by 3² = 9, not 3." }, { v:1.8e-2, fb:"Halving [A] divides the rate by 2." }],
            why:"2.0 × 10⁻³ × ½ × 3² = 9.0 × 10⁻³ " + RU + ".",
            hints:["Find the factor for each concentration.", "[A]: × ½. [B]: × 3² = 9.", "2.0 × 10⁻³ × 4.5 = 9.0 × 10⁻³ " + RU + "."] },
          { id:"r2", kind:"num", goal:2, prompt:"Both [A] and [B] are doubled together and the rate × 8. The order in A is 1. Order in B?", answer:2,
            wrong:[{ v:3, fb:"2¹ × 2<sup><i>n</i></sup> = 8, so 2<sup><i>n</i></sup> = 4." }, { v:8, fb:"The order is an exponent. " + M2 }],
            why:"2¹ × 2<sup><i>n</i></sup> = 8, so 2<sup><i>n</i></sup> = 4 and <i>n</i> = 2.",
            hints:["Doubling [A] alone gives × 2.", "The rest of the × 8 comes from B: × 4.", "2<sup><i>n</i></sup> = 4, so <i>n</i> = 2."] },
          { id:"r3", kind:"choice", goal:6, star:true, prompt:"<strong>Investigation:</strong> You have trials (0.10, 0.10) and (0.20, 0.10) for ([A], [B]). Which third trial finds the order in B?",
            options:[
              { t:"(0.10, 0.20)", ok:true, why:"Only [B] changes from trial 1." },
              { t:"(0.30, 0.20)", why:"Both concentrations differ from every existing trial. " + M7 },
              { t:"(0.30, 0.10)", why:"[B] still never changes." },
              { t:"(0.20, 0.10)", why:"That repeats trial 2." }],
            hints:["Which concentration hasn’t changed yet?", "Keep [A] the same as one existing trial.", "(0.10, 0.20): only [B] changes from trial 1."] },
          { id:"r4", kind:"num", goal:3, star:true, prompt:"A zero-order reaction runs at 2.0 × 10⁻³ " + RU + ". How long until 0.10 mol/L of reactant is used up?", unit:"s", answer:50,
            alt:{ t:"Never", fb:"Zero order means a constant rate, not no reaction. " + M3 },
            wrong:[{ v:0.02, fb:"That divides the wrong way." }, { v:2.0e-4, fb:"That multiplies." }],
            why:"Constant rate: 0.10 ÷ (2.0 × 10⁻³) = 50 s.",
            hints:["Zero order: the rate stays constant.", "time = amount used ÷ rate.", "0.10 ÷ 0.0020 = 50 s."] },
          { id:"r5", kind:"units", goal:2, star:true, prompt:"rate = " + K + "[A]²[B]. Units of " + K + "?", answer:"3",
            wrong:[{ u:"2", fb:"Overall order is 3. " + M4 }, { u:"1", fb:"Overall order is 3. " + M4 }, { u:"0", fb:"Overall order is 3." }],
            why:"Overall order 3: L²/(mol²·s).",
            hints:["Add the exponents.", "2 + 1 = 3.", "L²/(mol²·s)."] },
          { id:"r6", kind:"choice", goal:5, star:true, prompt:"E + F → G + H has rate = " + K + "[E]². Proposed: step 1 (slow) 2E → J + G; step 2 (fast) J + F → E + H. Is it consistent, and what is J?",
            options:[
              { t:"Consistent; J is an intermediate", ok:true, why:"J cancels, one E cancels from each side, and the slow step gives " + K + "[E]²." },
              { t:"Not consistent, because E appears in step 2", why:"E is remade in step 2, but the steps still add up: 2E + F → E + G + H gives E + F → G + H, and the slow step gives " + K + "[E]²." },
              { t:"Consistent; J is a catalyst", why:M5 },
              { t:"Not consistent, because the slow step has two E", why:"An elementary step’s coefficients give its orders: 2E gives [E]², which matches." }],
            hints:["Add the steps and cancel.", "J cancels; one E cancels from each side.", "The slow step 2E → J + G gives " + K + "[E]², which matches."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Saanvi", how:"", goal:[1, 2],
        instruction:"Saanvi made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the order in A from trials (0.10, 0.10) at 2.0 × 10⁻³ and (0.20, 0.10) at 8.0 × 10⁻³.",
            steps:["Only [A] changed: it doubled.", "The rate went from 2.0 × 10⁻³ to 8.0 × 10⁻³: × 4.", "So the order in A is 4.", "rate = " + K + "[A]⁴[B]<sup><i>n</i></sup>."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"2<sup><i>n</i></sup> = 4, so the order in A is 2.", ok:true, why:"The order is the exponent, not the ratio." },
              { t:"The order is 8, from 8.0 × 10⁻³.", why:"The order is the exponent, not the ratio. " + M2 },
              { t:"The order is 1, because [A] doubled.", why:"The order is the exponent, not the ratio. " + M2 },
              { t:"Step 3 is correct.", why:"The order is the exponent, not the ratio. " + M2 }],
            hints:["What power of 2 gives 4?", "2² = 4.", "Order 2."] },
          { id:"e2", goal:1, task:"Write the rate law for A + 2B → C (one-step mechanism not known).",
            steps:["The coefficients are 1 for A and 2 for B.", "So rate = " + K + "[A][B]².", "The overall order is 3."],
            answer:1,
            stepFb:["Step 1 is a correct reading of the equation.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"The orders must be found from initial-rates experiments; the coefficients don’t give them.", ok:true, why:"Only an elementary step’s coefficients give its orders." },
              { t:"rate = " + K + "[A]²[B].", why:"Only an elementary step’s coefficients give its orders. " + M1 },
              { t:"rate = " + K + "[C].", why:"Only an elementary step’s coefficients give its orders. " + M1 },
              { t:"Step 2 is correct.", why:"Only an elementary step’s coefficients give its orders. " + M1 }],
            hints:["Where do orders come from?", "From data.", "Run trials first."] },
          { id:"e3", goal:1, task:"Find the units of " + K + " for rate = " + K + "[A]².",
            steps:[K + " = rate ÷ [A]².", "Units: (" + RU + ") ÷ (mol/L)².", "= mol³/(L³·s).", "So " + K + " is in mol³/(L³·s)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 copies step 3."],
            fixes:[
              { t:"Dividing by (mol/L)² multiplies by L²/mol²: (" + RU + ") × (L²/mol²) = L/(mol·s).", ok:true, why:"Dividing by a fraction means multiplying by its reciprocal." },
              { t:"= s⁻¹.", why:"Those are first-order units. " + M4 },
              { t:"= " + RU + ".", why:"Those are zero-order units. " + M4 },
              { t:"Step 3 is correct.", why:"Dividing by a fraction means multiplying by its reciprocal." }],
            hints:["Dividing by a fraction means multiplying by its reciprocal.", "× L²/mol².", "L/(mol·s)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In Explore, what surprised you more: a reactant with zero order, or a catalyst appearing in a rate law?" },
      { id:"j2", q:"In your own words, explain why the slowest step sets the overall rate." },
      { id:"j3", q:"Explain to a friend how you find an order from two trials, and why only one concentration may change." },
      { id:"j4", q:"Which part (orders, units of " + K + ", or mechanisms) still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"rate = " + K + "[A]²[B]. What is the overall order?", options:[
          { t:"3", ok:true, why:"2 + 1 = 3." },
          { t:"2", why:"That’s the order in A only." },
          { t:"1", why:"That’s the order in B only." },
          { t:"4", why:"Add the exponents: 2 + 1." }] },
        b:{ prompt:"rate = " + K + "[X]⁰[Y]². What is the overall order?", options:[
          { t:"2", ok:true, why:"0 + 2 = 2." },
          { t:"3", why:"X contributes 0, not 1." },
          { t:"0", why:"Y contributes 2." },
          { t:"1", why:"Add the exponents." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"In a mechanism, a species made in one step and used up in a later step is a(n)…", options:[
          { t:"intermediate", ok:true, why:"Made, then used up." },
          { t:"catalyst", why:"A catalyst is used first, then remade." },
          { t:"product", why:"Products remain at the end." },
          { t:"reactant", why:"Reactants are there at the start." }] },
        b:{ prompt:"A species used in an early step and made again in a later step is a(n)…", options:[
          { t:"catalyst", ok:true, why:"Used, then made again." },
          { t:"intermediate", why:M5 },
          { t:"product", why:"It doesn’t build up." },
          { t:"inhibitor", why:"Inhibitors slow reactions; this one speeds it up." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What are the units of " + K + " for a first-order reaction?", options:[
          { t:"s⁻¹", ok:true, why:"(" + RU + ") ÷ (mol/L) = s⁻¹." },
          { t:"L/(mol·s)", why:"That’s second order." },
          { t:"mol/(L·s)", why:"That’s zero order." },
          { t:"L²/(mol²·s)", why:"That’s third order." }] },
        b:{ prompt:"What are the units of " + K + " for a zero-order reaction?", options:[
          { t:"mol/(L·s)", ok:true, why:"rate = " + K + ", so " + K + " has the rate’s units." },
          { t:"s⁻¹", why:"That’s first order. " + M4 },
          { t:"L/(mol·s)", why:"Second order." },
          { t:"no units", why:K + " always has units here." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Trials for A + B → products: (0.10, 0.10) → 3.0 × 10⁻³; (0.30, 0.10) → 2.7 × 10⁻²; (0.10, 0.20) → 6.0 × 10⁻³ " + RU + ". Rate law?", options:[
          { t:"rate = " + K + "[A]²[B]", ok:true, why:"Tripling [A] gave × 9 = 3²; doubling [B] gave × 2." },
          { t:"rate = " + K + "[A]⁹[B]²", why:"The orders are exponents, not ratios." },
          { t:"rate = " + K + "[A][B]²", why:"Check which concentration changed in each pair." },
          { t:"rate = " + K + "[A]³[B]", why:"× 9 for tripling means 3², not order 3." }] },
        b:{ prompt:"Trials: (0.10, 0.10) → 5.0 × 10⁻⁴; (0.20, 0.10) → 1.0 × 10⁻³; (0.10, 0.30) → 4.5 × 10⁻³ " + RU + ". Rate law?", options:[
          { t:"rate = " + K + "[A][B]²", ok:true, why:"Doubling [A] gave × 2; tripling [B] gave × 9." },
          { t:"rate = " + K + "[A]²[B]", why:"Check which concentration changed in each pair." },
          { t:"rate = " + K + "[A][B]⁹", why:"The orders are exponents, not ratios." },
          { t:"rate = " + K + "[A][B]³", why:"× 9 for tripling means 3², not order 3." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"rate = " + K + "[A][B]². [A] is doubled and [B] is halved. The rate…", options:[
          { t:"halves", ok:true, why:"2 × (½)² = ½." },
          { t:"stays the same", why:"That ignores the square on [B]." },
          { t:"doubles", why:"[B] halved divides by 4." },
          { t:"quarters", why:"[A] doubling multiplies by 2." }] },
        b:{ prompt:"rate = " + K + "[A]²[B]. [A] is tripled and [B] is halved. The rate is multiplied by…", options:[
          { t:"4.5", ok:true, why:"3² × ½ = 4.5." },
          { t:"1.5", why:"Square the 3." },
          { t:"9", why:"Don’t forget [B] halved." },
          { t:"18", why:"Halving [B] divides by 2, not multiplies." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Overall 2A + B → A₂B; experimental rate = " + K + "[A]². Which mechanism fits?", options:[
          { t:"Step 1 (slow): 2A → A₂; step 2 (fast): A₂ + B → A₂B", ok:true, why:"The steps add up and the slow step gives " + K + "[A]²." },
          { t:"Step 1 (slow): A + B → AB; step 2 (fast): AB + A → A₂B", why:"That predicts " + K + "[A][B]." },
          { t:"One step: 2A + B → A₂B", why:"That predicts " + K + "[A]²[B]." },
          { t:"Step 1 (fast): 2A → A₂; step 2 (slow): A₂ + B → A₂B", why:"The slow step contains the intermediate A₂." }] },
        b:{ prompt:"Overall 2A + B → A₂B; experimental rate = " + K + "[A][B]. Which mechanism fits?", options:[
          { t:"Step 1 (slow): A + B → AB; step 2 (fast): AB + A → A₂B", ok:true, why:"The steps add up and the slow step gives " + K + "[A][B]." },
          { t:"Step 1 (slow): 2A → A₂; step 2 (fast): A₂ + B → A₂B", why:"That predicts " + K + "[A]²." },
          { t:"One step: 2A + B → A₂B", why:"That predicts " + K + "[A]²[B]. " + M1 },
          { t:"Step 1 (fast): A + B → AB; step 2 (slow): AB + A → A₂B", why:"The slow step contains the intermediate AB. " + M6 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of the rate-determining step?", options:[
          { t:"“The slowest step limits how fast the whole reaction can go, like the narrowest point of a highway; the rate law comes from that step.”", ok:true, why:"The slowest step sets the pace." },
          { t:"“The first step always determines the rate.”", why:"Only if it’s the slowest." },
          { t:"“The fastest step determines the rate because it uses reactants quickest.”", why:M6 },
          { t:"“The step with the most particles determines the rate.”", why:"Speed matters, not size." }] },
        b:{ prompt:"Which statement correctly distinguishes a catalyst from an intermediate?", options:[
          { t:"“Both cancel from the overall equation, but a catalyst is present at the start and is remade, while an intermediate is formed and then used up.”", ok:true, why:M5 },
          { t:"“A catalyst appears in the overall equation; an intermediate doesn’t.”", why:"Neither appears." },
          { t:"“An intermediate speeds the reaction; a catalyst is made in a step.”", why:M5 },
          { t:"“They’re the same thing.”", why:M5 }] } },
      { id:"c2", cat:"C", goal:[2, 6],
        a:{ prompt:"A student says, ‘The order in B is 2 because B’s coefficient is 2.’ Which is the best response?", options:[
          { t:"“Orders must be found from experiments; coefficients equal orders only for a single elementary step.”", ok:true, why:M1 },
          { t:"“Correct: orders always match coefficients.”", why:M1 },
          { t:"“The order in B is 1, because there is one B in the formula.”", why:"Formulas don’t set orders." },
          { t:"“The order equals the rate ratio from one trial.”", why:"The order is an exponent, not a ratio." }] },
        b:{ prompt:"A student doubled [A] and [B] together, saw the rate × 8, and concluded the order in A is 3. Which is the best response?", options:[
          { t:"“Two concentrations changed at once; compare trials where only [A] changes.”", ok:true, why:M7 },
          { t:"“Correct: 2³ = 8.”", why:M7 },
          { t:"“The order is 8.”", why:"The order is an exponent, not a ratio." },
          { t:"“The order is 4, because two concentrations doubled.”", why:"Isolate one variable." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"On a hot catalytic-converter surface, a reaction is zero order at 4.0 × 10⁻³ " + RU + ". How long does it take to use up 0.20 mol/L of the reactant?", options:[
          { t:"50 s", ok:true, why:"Constant rate: 0.20 ÷ (4.0 × 10⁻³) = 50 s." },
          { t:"0.020 s", why:"That divides the wrong way." },
          { t:"8.0 × 10⁻⁴ s", why:"That multiplies." },
          { t:"It is never used up", why:M3 }] },
        b:{ prompt:"A zero-order reaction runs at 2.5 × 10⁻³ " + RU + ". How long does it take to use up 0.10 mol/L?", options:[
          { t:"40 s", ok:true, why:"Constant rate: 0.10 ÷ (2.5 × 10⁻³) = 40 s." },
          { t:"0.025 s", why:"That divides the wrong way." },
          { t:"2.5 × 10⁻⁴ s", why:"That multiplies." },
          { t:"It is never used up", why:M3 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Cl + O₃ → ClO + O₂; then ClO + O → Cl + O₂. Why did phasing out CFCs (which release Cl) matter so much?", options:[
          { t:"Cl is a catalyst: it’s remade in step 2, so each Cl atom can destroy many O₃ molecules", ok:true, why:"A catalyst goes round again and again." },
          { t:"Cl is an intermediate that builds up", why:M5 },
          { t:"Cl is a product of ozone breakdown", why:"It’s regenerated, not produced overall." },
          { t:"ClO is the catalyst", why:M5 }] },
        b:{ prompt:"For 2H₂O₂ → 2H₂O + O₂ with I⁻ (step 1, slow: H₂O₂ + I⁻ → H₂O + IO⁻; step 2, fast: H₂O₂ + IO⁻ → H₂O + O₂ + I⁻), doubling [I⁻] doubles the rate. Why?", options:[
          { t:"I⁻ is a reactant in the slow step, so it appears in the rate law even though it’s a catalyst", ok:true, why:"The slow step’s reactants set the rate law." },
          { t:"I⁻ is a reactant in the overall equation", why:"It cancels out of the overall equation." },
          { t:"IO⁻ builds up and speeds things up", why:M5 },
          { t:"Catalysts never appear in rate laws", why:"They can, if they’re in the slow step." }] } }
    ]
  },
  task:{
    title:"Plan the trials", summary:"Plan the trials",
    statement:"<p>You’ll measure the rate law of A + B → products. Choose <strong>three</strong> trials from the grid so that both orders can be read off cleanly. Can you find every good plan?</p>",
    inputs:{ grid:"Tap three trials", a:"[A] (mol/L)", b:"[B] (mol/L)", vals:[0.10, 0.20, 0.30], max:"Three trials only: tap a chosen trial to remove it first.",
      preview:"Comparison panel", none:"Choose trials to see which pairs isolate one concentration.", onlyA:"only [A] changes", onlyB:"only [B] changes", both:"both change: can’t isolate an order" },
    checks:["A pair changes only [A]", "A pair changes only [B]", "Both comparisons start from the reference trial"],
    tips:["Keep [B] the same in one pair.", "Keep [A] the same in another pair.", "Use (0.10, 0.10) as the starting point for both comparisons, so each ratio is a clean × 2 or × 3."],
    explainPrompt:"Explain why your three trials let you find both orders, and what you’d compare to get each one.",
    vocab:"Use the words order, initial rate, controlled variable and reference trial.",
    more:"There’s more than one good plan. Can you find them all?",
    afterAt:4,
    after3:"Every good plan is an L shape with its corner at the reference trial: one step along [A], one step along [B]."
  },
  cards:[
    ["Rate law", "rate = " + K + "[A]<sup><i>m</i></sup>[B]<sup><i>n</i></sup>; <i>m</i> and <i>n</i> found by experiment."],
    ["Order with respect to A", "The exponent on [A]. Doubling [A] multiplies the rate by 2<sup><i>m</i></sup>."],
    ["Overall order", "The sum of the exponents."],
    ["Zero order", "The rate doesn’t depend on that concentration; the reactant is still used up."],
    ["Finding an order", "Compare two trials where only that concentration changes."],
    ["Finding " + K, "Substitute one trial into the rate law."],
    ["Units of " + K, "0: mol/(L·s) · 1: s⁻¹ · 2: L/(mol·s) · 3: L²/(mol²·s)."],
    ["Elementary step", "One collision event; its coefficients give its own rate law."],
    ["Rate-determining step", "The slowest step; its rate law is the reaction’s rate law."],
    ["Intermediate", "Made in one step, used up in a later one."],
    ["Catalyst in a mechanism", "Used in one step, remade in a later one; can appear in the rate law."],
    ["Checking a mechanism", "The steps add up to the overall equation, and the slow step matches the rate law."]
  ]
};
