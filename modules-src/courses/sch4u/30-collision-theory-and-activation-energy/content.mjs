// SCH4U 30 Collision Theory and Activation Energy. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/30-collision-theory-and-activation-energy.md
// Pictures (hero box and hill, the C6 particle box, the Maxwell–Boltzmann curve, the C4 diagram builder, the Part 3
// stations, the tap diagrams and the task profile) are drawn by app.js. R comes from MV.chem.data.const.R.

const EA = "<i>E</i><sub>a</sub>";
const EAF = "<i>E</i><sub>a</sub>(forward)";
const EAR = "<i>E</i><sub>a</sub>(reverse)";
const DH = "Δ<i>H</i>";
const EGE = "<i>E</i> ≥ " + EA;

// Misconception core sentences (plan §3)
const M1 = "Only collisions with enough energy <strong>and</strong> the right orientation react; most just bounce.";
const M2 = "Collisions rise only about 2% per 10 K, but the fraction with " + EGE + " nearly doubles. That’s the main effect.";
const M3 = "A catalyst lowers " + EA + " by offering a new pathway. " + DH + ", the products and the catalyst itself are unchanged.";
const M4 = EAR + " = " + EAF + " − " + DH + ". For an exothermic reaction, the reverse barrier is <strong>higher</strong>.";
const M5 = EA + " is measured from the <strong>reactants</strong> up to the peak.";
const M6 = "Concentration changes how often particles collide, not how much energy each collision has.";
const M7 = "The step with the highest peak (measured from the reactants) controls the rate; barriers aren’t added.";

const ARROW_HINTS = ["Which level does the arrow start from?", "Forward starts at the reactants; reverse starts at the products."];

export default {
  id:"30-collision-theory-and-activation-energy",
  kind:"topic",
  title:"Collision theory and activation energy",
  topic:"Collision Theory and Activation Energy",
  readyTopic:"collision theory and activation energy",
  hero:{
    eq:'<span class="nw">effective collisions = collisions</span> <span class="nw">× (fraction with ' + EGE + ")</span> <span class=\"nw\">× (fraction with the right orientation)</span>",
    eqSize:"sm",
    eqLabel:"effective collisions equals collisions, times the fraction with energy at least the activation energy, times the fraction with the right orientation",
    headline:"Most collisions fail.",
    text:"Particles must <strong>collide</strong> to react, but that isn’t enough. They need at least the <strong>activation energy</strong> and the <strong>right orientation</strong>. Temperature, concentration and <strong>catalysts</strong> change the rate by changing how many collisions succeed.",
    fig:{ html:'<div class="ct-hx"><svg class="ct-hx-svg" id="ct-hx-svg" viewBox="0 0 480 270" role="img" aria-label="A box of moving blue A and teal B particles. Most collisions just bounce off. One fast pair hits end-on, glows at the top of a small energy hill drawn beside the box and forms AB. A counter reads 1 effective out of 400 collisions. Then the energy hill appears in full: the reactants, a brown activation energy arrow up to the peak, the products lower down and an orange enthalpy change arrow."></svg><div class="ct-hx-row"><p class="ct-hx-ctr" id="ct-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ct-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can state the conditions for an effective collision.",
    "I can explain how temperature and concentration change the rate, using collision theory and the Maxwell–Boltzmann distribution.",
    "I can read and draw potential energy diagrams, including " + EA + " (forward and reverse) and " + DH + ".",
    "I can explain how a catalyst works, using an energy diagram.",
    "I can apply collision theory to catalysts and conditions in technology and living things."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Kinetic energy", goal:2,
          prompt:"Temperature is a measure of…",
          options:[
            { t:"the average kinetic energy of the particles", ok:true, why:"Faster particles mean a higher temperature." },
            { t:"the total heat in a sample", why:"Heat depends on amount too; temperature doesn’t." },
            { t:"the number of particles", why:"That’s amount." },
            { t:"how fast a reaction goes", why:"Temperature affects rate but measures particle motion." }],
          hints:["Think about particle motion.", "Faster particles mean a higher temperature.", "Average kinetic energy."] },
        { id:"w2", skill:"Kinetic energy", goal:2,
          prompt:"In a gas at one temperature, the particles…",
          options:[
            { t:"have a range of speeds, from slow to fast", ok:true, why:"Collisions keep changing speeds, so there’s always a spread." },
            { t:"all move at exactly the same speed", why:"Collisions constantly change speeds." },
            { t:"are all at rest", why:"Gas particles move constantly." },
            { t:"all have the activation energy", why:"Only a small fraction do." }],
          hints:["Do collisions change speeds?", "Yes, all the time.", "A spread of speeds."] },
        { id:"w3", skill:"Enthalpy diagrams", goal:3,
          prompt:"On an enthalpy diagram for an exothermic reaction, the products are…",
          options:[
            { t:"lower than the reactants", ok:true, why:"Energy was released." },
            { t:"higher than the reactants", why:"That’s endothermic." },
            { t:"at the same level", why:"Then " + DH + " = 0." },
            { t:"at the very top of the diagram", why:"The top is the activated complex." }],
          hints:["Exothermic: the system loses energy.", "Lower energy afterwards.", "Lower."] },
        { id:"w4", skill:"Enthalpy diagrams", goal:3,
          prompt:"A reaction has " + DH + " = −30 kJ. On the diagram, the products are…",
          options:[
            { t:"30 kJ below the reactants", ok:true, why:DH + " = products − reactants = −30 kJ." },
            { t:"30 kJ above", why:"Negative " + DH + " means below." },
            { t:"at 30 kJ", why:DH + " is a difference, not a level." },
            { t:"60 kJ below", why:"Just 30 kJ." }],
          hints:[DH + " = products − reactants.", "Negative: products lower.", "30 kJ below."] },
        { id:"w5", skill:"Rate factors", goal:5,
          prompt:"From module 29, which change increases the rate of a solid reacting with acid?",
          options:[
            { t:"Grinding the solid into smaller pieces", ok:true, why:"More exposed surface means more collisions." },
            { t:"Using bigger lumps", why:"Less surface exposed." },
            { t:"Cooling the acid", why:"That slows it." },
            { t:"Diluting the acid", why:"That slows it." }],
          hints:["Which change gives more contact?", "More exposed surface.", "Grinding."] },
        { id:"w6", skill:"Rate factors", goal:2,
          prompt:"In module 29’s model, raising the temperature by 10 °C made the rate…",
          options:[
            { t:"about double", ok:true, why:"The 30 s run became a 15 s run." },
            { t:"about 10 times larger", why:"The model used about ×2." },
            { t:"slightly smaller", why:"Warmer is faster." },
            { t:"unchanged", why:"Temperature matters a lot." }],
          hints:["Recall the 30 s → 15 s runs.", "Twice as fast.", "About double."] }
      ],
      refreshers:{
        "Kinetic energy":"Temperature is average kinetic energy. At any temperature, particles have a spread of energies.",
        "Enthalpy diagrams":DH + " = products − reactants; exothermic products sit lower.",
        "Rate factors":"Temperature, concentration, surface area, catalysts and the nature of the reactants all change rate (module 29). This module explains why."
      }
    }
  },
  explore:{
    heading:"Particle box",
    intro:"Watch the collisions, then change the conditions and count the ones that work.",
    how:"Choose a mode. In Box and Energy curve modes, set the concentrations, the temperature and the catalyst; the readout updates as you go. In Diagram builder mode, drag the three levels or type them (5 kJ steps), and switch the catalysed path on or off.",
    modes:[{ id:"box", t:"Box" }, { id:"curve", t:"Energy curve" }, { id:"dia", t:"Diagram builder" }],
    concs:[{ id:"h", t:"×½", v:0.5 }, { id:"1", t:"×1", v:1 }, { id:"2", t:"×2", v:2 }, { id:"3", t:"×3", v:3 }],
    temps:[280, 290, 300, 310, 320],
    cats:[{ id:"none", t:"None", ea:50 }, { id:"X", t:"Catalyst X (" + EA + " 45 kJ/mol)", ea:45 }, { id:"Y", t:"Catalyst Y (" + EA + " 40 kJ/mol)", ea:40 }],
    model:"<p><strong>About this model.</strong> Collisions per second = 2000 × (A factor) × (B factor) × √(<i>T</i> ÷ 300). The fraction with " + EGE + " is scaled for display so that 300 K and 50 kJ/mol shows 1.0%. Real fractions are far smaller; the ratios are real. They come from the factors exp[(" + EA + " ÷ <i>R</i>)(1/300 − 1/<i>T</i>)] and exp(Δ" + EA + " ÷ <i>RT</i>) with <i>R</i> = 8.314 J/(mol·K). The display tops out at 100%.</p><p>Only end-to-end hits of the marked reactive ends count, so the orientation fraction is 25%. Effective collisions per second = collisions × fraction × 25%. The energy curve is a picture of the spread of energies; its energy axis isn’t to scale.</p>",
    tc3:{ pred:"Your prediction:", opts:[{ id:"conc", t:"doubling [A]" }, { id:"cat", t:"catalyst X" }],
      eConc:"Factor for doubling [A], compared with standard: ×", eCat:"Factor for catalyst X, compared with standard: ×", final:"Your answer: more effective collisions with…" },
    predictions:[
      { id:"p1", prompt:"Box mode, standard settings. About what share of collisions produce AB?",
        options:[{ t:"a small fraction", ok:true }, { t:"about half" }, { t:"all of them" }, { t:"none" }],
        explain:"After 10 s the counter shows 20 000 collisions and 50 effective (0.25%). Most collisions lack the energy or the right orientation." },
      { id:"p2", prompt:"Energy curve mode; the temperature goes from 300 K to 310 K. Which changes more: the number of collisions or the fraction with " + EGE + "?",
        options:[{ t:"the fraction with " + EGE, ok:true }, { t:"the number of collisions" }, { t:"both by the same factor" }, { t:"neither" }],
        explain:"Collisions ×1.02; shaded tail ×1.9. The curve flattens and shifts right, so far more particles clear the bar." },
      { id:"p3", prompt:"Diagram builder, exothermic default (reactants 0, peak 50, products −30 kJ). Switch on the catalyst. Which changes?",
        options:[{ t:"only the peak (" + EA + ") gets lower", ok:true }, { t:DH + " gets more negative" }, { t:"the products get lower" }, { t:"the reactants get higher" }],
        explain:"A teal dashed path peaks at 30 kJ; the reactant and product levels don’t move. A catalyst offers a lower pathway; the start and end are the same." },
      { id:"p4", prompt:"The same diagram, no catalyst. What is " + EA + " for the reverse reaction?",
        options:[{ t:"80 kJ", ok:true }, { t:"20 kJ" }, { t:"50 kJ" }, { t:"30 kJ" }],
        explain:"A second brown arrow runs from the products (−30 kJ) up to the peak (50 kJ). " + EAR + " = 50 − (−30) = 80 kJ." }
    ],
    chalIntro:"Use the particle box or the diagram builder to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 has its own boxes under the readout in Box mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2], prompt:"Box mode: <strong>double</strong> the effective collisions per second without changing temperature or adding a catalyst.",
        why:"One reactant at ×2 doubles the collisions (4000 per second); the energy fraction stays at 1.0%, so effective collisions go from 5.0 to 10.0 per second.",
        general:"Effective collisions aren’t 10.0 per second yet. Start from the standard settings and change one concentration.",
        hints:["Collisions depend on how crowded each reactant is.", "Doubling one reactant doubles the collisions; the energy fraction stays at 1.0%. " + M6, "Set A to ×2."] },
      { id:"tc2", goal:[3], prompt:"Diagram builder: draw an <strong>endothermic</strong> reaction with " + EAF + " = 40 kJ and " + DH + " = +25 kJ. Then read off " + EAR + " and type it in the box.",
        why:"Peak − reactants = 40 kJ and products − reactants = +25 kJ. The reverse climb starts at the products: 40 − 25 = 15 kJ.",
        general:"The diagram doesn’t match yet. Check " + EAF + " (reactants up to the peak) and " + DH + " (reactants to products).",
        hints:["Put the reactants at 0 and the peak at 40.", "Products at +25.", "Reverse: from 25 up to 40 is 15 kJ."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"At 300 K, which gives more effective collisions: doubling the concentration of A, or adding catalyst X (" + EA + " 50 → 45 kJ/mol)? Predict first, then test both and enter each one’s factor compared with standard.",
        why:"Doubling [A] gives ×2.0; catalyst X gives ×7.4 (37.1 ÷ 5.0). <strong>Small drops in " + EA + " have big effects. That’s why catalysts matter so much in industry and in cells.</strong>",
        hints:["Concentration changes collisions; a catalyst changes the energy fraction.", "Test each one separately from the standard settings.", "×2.0 for concentration; ×7.4 for catalyst X."] }
    ]
  },
  part3:{
    slug:"catalysts", name:"Catalysts", heading:"Catalysts at work",
    intro:"Catalysts make reactions efficient in cars, in cells and in industry. Visit three stations and zoom in to the particles at each one to see the energy diagram at work.",
    s1:{ title:"Station 1: The catalytic converter",
      html:"<p>Exhaust passes over a honeycomb coated with platinum, palladium and rhodium. Exhaust gases stick to the metal surface, their bonds weaken, and they react:</p>",
      zoom:"Molecules <strong>adsorb</strong> on the metal surface, held in the right orientation, so a lower-" + EA + " pathway opens up. The catalyst is a solid and the gases aren’t: it’s a <strong>heterogeneous</strong> catalyst.",
      ask:"Tap the <strong>two</strong> things the catalyst does <strong>not</strong> change, then press Check.",
      opts:[{ id:"dh", t:DH, ok:true }, { id:"prod", t:"which products are possible", ok:true }, { id:"ea", t:"the activation energy" }, { id:"rate", t:"the rate of reaction" }],
      good:"Right. The catalyst only lowers the peak. " + M3, bad:M3, two:"Choose exactly two." },
    s2:{ title:"Station 2: Enzymes",
      html:"<p>Enzymes are biological catalysts (you’ll meet them again in Biology). <strong>Catalase</strong> speeds the decomposition of hydrogen peroxide in cells: " + "2H₂O₂ → 2H₂O + O₂" + ".</p>",
      cap:"Model data: the rate of a catalase-catalysed reaction at different temperatures (% of the fastest rate).",
      qs:[
        { id:"up", prompt:"Why does the rate <strong>rise</strong> from 10 °C to about 37 °C?",
          opts:[{ t:"More particles have energy above " + EA, ok:true, fb:"Right. Warmer particles clear the barrier more often." },
            { t:"The enzyme gets used up faster", fb:"A catalyst isn’t used up. " + M3 },
            { t:"Warmth lowers " + EA, fb:EA + " of a pathway stays the same; the particles’ energies rise." }] },
        { id:"down", prompt:"Why does the rate <strong>fall</strong> sharply above about 45 °C?",
          opts:[{ t:"The enzyme’s shape changes (it denatures), so the lower-" + EA + " pathway is lost", ok:true, fb:"Right. Without its shape, the enzyme can’t offer its lower-" + EA + " pathway." },
            { t:"Fewer particles have enough energy", fb:"More particles have enough energy when it’s hotter." },
            { t:"The hydrogen peroxide evaporates", fb:"The drop means the catalyst stopped working." }] }
      ] },
    s3:{ title:"Station 3: Industrial conditions",
      // VERIFY: the ammonia plant's operating temperature, about 400–500 °C (plan Station 3 and §6 risk 2: "verify before release").
      html:"<p>Ammonia is made from N₂ and H₂ over an <strong>iron catalyst</strong> at a moderately high temperature, about 400–500 °C. Why not run it cooler?</p>",
      opts:[
        { t:"At low temperature the reaction is far too slow, even with a catalyst.", ok:true, fb:"Right. Even the catalysed barrier needs hot particles to be cleared often enough." },
        { t:"The catalyst only works when hot.", fb:"Partly true, but not the main reason." },
        { t:"Higher temperature makes more ammonia.", fb:"Module 35 shows the opposite for this exothermic reaction: it’s a compromise." }],
      preview:"Module 35 explains why too hot lowers the yield." },
    sort:{ title:"Homogeneous or heterogeneous?",
      intro:"A <strong>homogeneous</strong> catalyst is in the same phase as the reactants (for example, dissolved with them). A <strong>heterogeneous</strong> catalyst is in a different phase (usually a solid surface). Sort the four examples.",
      boxes:[{ id:"homo", t:"Homogeneous" }, { id:"het", t:"Heterogeneous" }],
      cards:[
        { id:"c1", t:"Catalase dissolved in the fluid inside a cell", answer:"homo", why:"An enzyme in solution, with dissolved reactants." },
        { id:"c2", t:"Amylase dissolved in saliva, breaking down starch", answer:"homo", why:"An enzyme in solution." },
        { id:"c3", t:"Platinum, palladium and rhodium in a catalytic converter", answer:"het", why:"Solid metal; gaseous reactants." },
        { id:"c4", t:"Iron in an ammonia plant", answer:"het", why:"Solid iron; gaseous N₂ and H₂." }] },
    quickCheck:{
      title:"Quick check", summary:"Catalysts quick check",
      items:[
        { id:"q1", goal:4, prompt:"A catalyst speeds a reaction by…",
          choices:[
            { t:"providing a pathway with lower " + EA, ok:true, fb:"Right. A lower peak means more collisions clear it." },
            { t:"giving particles more energy", fb:M3 },
            { t:"increasing " + DH, fb:M3 },
            { t:"being used up", fb:M3 }] },
        { id:"q2", goal:4, prompt:"After the reaction, the catalyst is…",
          choices:[
            { t:"still present, chemically unchanged", ok:true, fb:"Right. It’s regenerated and can work again." },
            { t:"used up", fb:M3 },
            { t:"turned into product", fb:M3 },
            { t:"always destroyed by heat", fb:M3 }] },
        { id:"q3", goal:4, prompt:"A catalyst’s effect on the reverse reaction is to…",
          choices:[
            { t:"speed it up too", ok:true, fb:"Right. Lowering the peak lowers both climbs." },
            { t:"slow it down", fb:"Lowering the peak lowers both climbs." },
            { t:"stop it", fb:"Lowering the peak lowers both climbs." },
            { t:"have no effect", fb:"Lowering the peak lowers both climbs." }] },
        { id:"q4", goal:5, prompt:"<strong>Investigation:</strong> In the enzyme data, the rate at 60 °C is lower than at 37 °C. Best explanation?",
          choices:[
            { t:"the enzyme denatured, so its lower-" + EA + " pathway was lost", ok:true, fb:"Right. Heat changed the enzyme’s shape, so the catalyst stopped working." },
            { t:"fewer particles had enough energy", fb:"Higher temperature would normally speed it up; the drop means the catalyst stopped working." },
            { t:"the substrate evaporated", fb:"Higher temperature would normally speed it up; the drop means the catalyst stopped working." },
            { t:"enzymes work faster when cold", fb:"Higher temperature would normally speed it up; the drop means the catalyst stopped working." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tap", type:"custom", title:"Read the energy diagram", summary:"Read the energy diagram", goal:[3, 4],
        instruction:"Tap the point, arrow or region each question asks for.",
        how:"Tap (or Tab to and press Enter on) a point, an arrow or a band on the diagram. Arrows and bands are lettered so colour isn’t a clue.",
        dias:{
          d1:{ name:"Diagram 1 (exothermic)", r:0, pk:60, p:-40, cat:35 },
          d2:{ name:"Diagram 2 (endothermic)", r:0, pk:90, p:50 } },
        items:[
          { id:"a1", dia:"d1", set:"pts", goal:3, prompt:"Tap the activated complex (Diagram 1, uncatalysed).", answer:"pk",
            fb:"The activated complex is at the top of the hill.",
            why:"The peak at 60 kJ: the short-lived arrangement at the top of the barrier.",
            hints:["The activated complex sits where the energy is highest.", "Follow the solid (uncatalysed) path to its top.", "The peak at 60 kJ."] },
          { id:"a2", dia:"d1", set:"arrows", goal:3, prompt:"Tap the arrow that shows " + EAF + ".", answer:"ea",
            fb:"Start from the reactants, not zero or the products. " + M5,
            why:"From the reactants (0 kJ) up to the peak (60 kJ): 60 kJ.",
            hints:ARROW_HINTS.concat(["The arrow from the reactants (0) up to the peak (60)."]) },
          { id:"a3", dia:"d1", set:"arrows", goal:3, prompt:"Tap the arrow that shows " + DH + ".", answer:"dh",
            fb:DH + " runs from reactants to products.",
            why:"From the reactants (0 kJ) down to the products (−40 kJ): " + DH + " = −40 kJ.",
            hints:ARROW_HINTS.concat(["The arrow from the reactants (0) down to the products (−40)."]) },
          { id:"a4", dia:"d1", set:"pts", goal:4, prompt:"Tap the catalysed pathway’s peak.", answer:"cpk",
            fb:"The dashed path is the catalysed one.",
            why:"The teal dashed path peaks at 35 kJ, lower than the uncatalysed 60 kJ.",
            hints:["Look for the dashed path.", "It starts and ends at the same levels but has a lower top.", "The teal peak at 35 kJ."] },
          { id:"a5", dia:"d1", set:"arrows", goal:3, prompt:"Tap the arrow that shows " + EAR + ".", answer:"rev",
            fb:"The reverse climb starts at the products. " + M4,
            why:"From the products (−40 kJ) up to the peak (60 kJ): 100 kJ.",
            hints:ARROW_HINTS.concat(["The arrow from the products (−40) up to the peak (60): 100 kJ."]) },
          { id:"a6", dia:"d2", set:"bands", goal:3, prompt:"Diagram 2: tap the region that shows the reaction is endothermic.", answer:"rp",
            fb:"Products above reactants: energy absorbed.",
            why:"The gap between the reactants (0 kJ) and the products (+50 kJ): the products sit higher, so energy was absorbed.",
            hints:["Endothermic means the products end up higher than the reactants.", "Find the band between the two flat levels.", "The band from the reactants (0) up to the products (+50)."] },
          { id:"a7", dia:"d2", set:"arrows", goal:3, prompt:"Diagram 2: tap " + EAR + ".", answer:"rev",
            fb:M4,
            why:"From the products (+50 kJ) up to the peak (90 kJ): 40 kJ.",
            hints:ARROW_HINTS.concat(["The arrow from the products (+50) up to the peak (90): 40 kJ."]) }
        ] },
      { id:"calc", type:"numeric", title:"Barriers and collisions", summary:"Barriers and collisions", star:true, goal:[2, 4],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer, then press Check. Use + or − for signs.",
        items:[
          { id:"d1", goal:3, prompt:EAF + " = 75 kJ, " + DH + " = −40 kJ. " + EAR + "?", answer:115, unit:"kJ", display:"115 kJ",
            wrong:[{ match:35, fb:M4 }],
            why:"75 − (−40) = 115 kJ.",
            hints:["The reverse climb starts at the products.", EAR + " = " + EAF + " − " + DH + ".", "75 − (−40) = 115 kJ."] },
          { id:"d2", goal:3, prompt:EAF + " = 120 kJ, " + EAR + " = 50 kJ. " + DH + "?", answer:70, unit:"kJ", display:"+70 kJ",
            wrong:[{ match:-70, fb:"Products sit 70 above the reactants." }],
            why:DH + " = " + EAF + " − " + EAR + " = 120 − 50 = +70 kJ.",
            hints:["The forward climb is longer than the reverse one. Which level is higher?", DH + " = " + EAF + " − " + EAR + ".", "120 − 50 = +70 kJ."] },
          { id:"d3", goal:4, star:true, prompt:"Uncatalysed " + EAF + " = 90 kJ; catalysed 60 kJ; " + DH + " = −20 kJ. Catalysed " + EAR + "?", answer:80, unit:"kJ", display:"80 kJ",
            wrong:[{ match:110, fb:"That’s the uncatalysed reverse barrier." }, { match:40, fb:M4 }],
            why:"60 − (−20) = 80 kJ: the catalyst lowers both climbs by 30 kJ.",
            hints:["Use the catalysed forward barrier.", EAR + " = 60 − " + DH + ".", "60 − (−20) = 80 kJ."] },
          { id:"d4", goal:2, star:true, prompt:"Model: from 300 K to 320 K (" + EA + " 50), the fraction with " + EGE + " rises ×3.5 and collisions ×1.03. By about what factor does the rate rise?", answer:3.55, tol:0.0142, unit:"times", display:"about 3.6 times",
            wrong:[{ match:1.03, fb:M2 }, { match:4.53, fb:"Multiply the factors; don’t add." }, { match:4.5, fb:"Multiply the factors; don’t add." }],
            why:"1.03 × 3.5 ≈ 3.6.",
            hints:["Effective collisions = collisions × fraction × orientation.", "Both factors multiply the rate.", "1.03 × 3.5 ≈ 3.6."] },
          { id:"d5", goal:2, star:true, prompt:"Model: 2000 collisions/s, 1.0% with enough energy, 25% correctly oriented. Effective collisions per second? Then [B] is tripled: effective per second?", answer:[5, 15], unit:"per second", display:"5.0, then 15.0 per second", label:"Both answers, separated by a comma:",
            wrong:[{ match:[20], fb:"Multiply by both fractions." }, { match:[20, 60], fb:"Multiply by both fractions." }, { match:[5, 45], fb:"Tripling one reactant triples collisions, not ×9." }, { match:[45], fb:"Tripling one reactant triples collisions, not ×9." }],
            why:"2000 × 0.010 × 0.25 = 5.0; tripling [B] triples the collisions: 15.0.",
            hints:["Multiply the collisions by both fractions.", "2000 × 0.010 × 0.25; then ×3.", "5.0, then 15.0."] },
          { id:"d6", goal:3, star:true, prompt:"A two-step reaction: reactants 0 kJ, first peak 60 kJ, intermediate 20 kJ, second peak 50 kJ, products −30 kJ. Overall " + EA + " (from the reactants)?", answer:60, unit:"kJ", display:"60 kJ",
            wrong:[{ match:90, fb:M7 }, { match:30, fb:"Measure from the reactants, not the intermediate." }],
            why:"The highest peak above the reactants is the first one: 60 kJ, so step 1 is the slow step.",
            hints:["Which peak is highest above the reactants?", "The first: 60 kJ; the second is 50 kJ above the reactants.", "Overall " + EA + " = 60 kJ; step 1 is the slow step."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Quentin", how:"", goal:[2, 4],
        instruction:"Quentin made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Explain how a catalyst speeds up a reaction.",
            steps:["Reactant particles must collide with at least the activation energy.", "A catalyst provides a different reaction pathway.", "The catalyst makes " + DH + " more negative, so more energy is released.", "So more collisions are effective."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:"The new pathway has a lower " + EA + ", so more collisions have enough energy; " + DH + " is unchanged.", ok:true, why:"A catalyst lowers only the peak." },
              { t:"The catalyst gives particles extra kinetic energy.", why:M3 + " It doesn’t heat them." },
              { t:"The catalyst is used up, releasing energy.", why:M3 },
              { t:"Step 3 is correct.", why:"The diagram’s start and end don’t move." }],
            hints:["Does a catalyst change the reactant or product levels?", "No; only the peak.", "Lower " + EA + ", same " + DH + "."] },
          { id:"e2", goal:3, task:EAF + " = 50 kJ and " + DH + " = −30 kJ. Find " + EAR + ".",
            steps:["The products are 30 kJ below the reactants.", "The peak is 50 kJ above the reactants.", EAR + " = " + EAF + " + " + DH + " = 50 + (−30) = 20 kJ.", "So the reverse reaction is easier than the forward one."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:EAR + " = " + EAF + " − " + DH + " = 50 − (−30) = 80 kJ: from the products up to the peak.", ok:true, why:"The reverse climb starts 30 kJ lower, at the products." },
              { t:EAR + " = 50 kJ, the same as forward.", why:"The climbs start from different levels." },
              { t:EAR + " = 30 kJ.", why:"That’s |" + DH + "|." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Where does the reverse climb start?", "At the products, 30 kJ below the reactants.", "30 + 50 = 80 kJ."] },
          { id:"e3", goal:2, task:"Explain why raising the temperature by 10 °C nearly doubles the rate.",
            steps:["Particles move faster at higher temperature.", "So they collide about twice as often, which is the main reason the rate doubles.", "The fraction with enough energy stays the same."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2."],
            fixes:[
              { t:"Collisions rise only slightly (about 2%); the main reason is that the fraction of particles with " + EGE + " nearly doubles.", ok:true, why:"The energy tail is what matters." },
              { t:"The activation energy drops at higher temperature.", why:EA + " stays the same; the particles’ energies rise." },
              { t:"Particles become more concentrated.", why:M6 },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Compare the model’s collision factor and energy factor.", "×1.02 vs ×1.9.", "The energy tail is what matters."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the particle box: how few collisions work, or how much the energy tail grows?" },
      { id:"j2", q:"In your own words, explain why a small rise in temperature has a large effect on rate." },
      { id:"j3", q:"Explain to a friend how to read " + EAF + ", " + EAR + " and " + DH + " from one diagram." },
      { id:"j4", q:"What’s still unclear about catalysts? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which two conditions must a collision meet to cause a reaction?", options:[
          { t:"Energy at least equal to " + EA + ", and the right orientation", ok:true, why:"Both are needed; most collisions miss one of them." },
          { t:"High concentration and a catalyst", why:"Those raise the rate; they’re not conditions for a single collision." },
          { t:"Any collision at all", why:M1 },
          { t:"Enough time and enough space", why:"Not collision conditions." }] },
        b:{ prompt:"What is the activated complex?", options:[
          { t:"The short-lived arrangement of atoms at the top of the energy barrier", ok:true, why:"It sits at the peak of the diagram." },
          { t:"The catalyst", why:M3 },
          { t:"The final product", why:"Products sit after the peak." },
          { t:"A stable intermediate that can be bottled", why:"It exists only briefly at the peak." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"On a potential energy diagram, the activation energy (forward) is measured from…", options:[
          { t:"the reactants up to the peak", ok:true, why:M5 },
          { t:"the products up to the peak", why:M5 },
          { t:"zero up to the peak", why:M5 },
          { t:"the reactants down to the products", why:"That’s " + DH + "." }] },
        b:{ prompt:"On a potential energy diagram, " + DH + " is measured from…", options:[
          { t:"the reactants to the products", ok:true, why:DH + " = products − reactants." },
          { t:"the reactants to the peak", why:"That’s " + EA + "." },
          { t:"the products to the peak", why:"That’s " + EAR + "." },
          { t:"zero to the products", why:DH + " is a difference from the reactants." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which statement about a catalyst is correct?", options:[
          { t:"It provides a pathway with a lower " + EA + " and is unchanged at the end", ok:true, why:"Lower peak; same start, end and catalyst." },
          { t:"It makes " + DH + " more negative", why:M3 },
          { t:"It is used up as the reaction proceeds", why:M3 },
          { t:"It speeds up only the forward reaction", why:"It lowers the peak for both directions." }] },
        b:{ prompt:"Which quantity is <strong>not</strong> changed by adding a catalyst?", options:[
          { t:DH, ok:true, why:"The reactant and product levels don’t move." },
          { t:EAF, why:"That’s lowered." },
          { t:EAR, why:"That’s lowered too." },
          { t:"The rate", why:"That increases." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:EAF + " = 60 kJ and " + DH + " = −25 kJ. " + EAR + "?", options:[
          { t:"85 kJ", ok:true, why:"60 − (−25)." },
          { t:"35 kJ", why:M4 },
          { t:"25 kJ", why:"That’s |" + DH + "|." },
          { t:"60 kJ", why:"Reverse starts from the products." }] },
        b:{ prompt:EAF + " = 45 kJ and " + DH + " = +15 kJ. " + EAR + "?", options:[
          { t:"30 kJ", ok:true, why:"45 − 15." },
          { t:"60 kJ", why:M4 },
          { t:"15 kJ", why:"That’s " + DH + "." },
          { t:"45 kJ", why:"Reverse starts from the products." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Model: from 300 K to 310 K, collisions rise ×1.02 and the fraction with " + EGE + " rises ×1.9. About how much faster is the reaction?", options:[
          { t:"About 1.9 times", ok:true, why:"1.02 × 1.9 ≈ 1.94." },
          { t:"About 1.02 times", why:M2 },
          { t:"About 2.9 times", why:"Multiply the factors; don’t add." },
          { t:"About 10 times", why:"Not for a 10 K rise." }] },
        b:{ prompt:"Model: from 300 K to 320 K, collisions rise ×1.03 and the fraction rises ×3.5. About how much faster?", options:[
          { t:"About 3.6 times", ok:true, why:"1.03 × 3.5 ≈ 3.6." },
          { t:"About 1.03 times", why:M2 },
          { t:"About 4.5 times", why:"Multiply; don’t add." },
          { t:"About 2 times", why:"That’s for a 10 K rise." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A two-step reaction: reactants 0 kJ, first peak 70 kJ, intermediate 10 kJ, second peak 40 kJ, products −20 kJ. Which step is rate-determining, and what is the overall " + EA + "?", options:[
          { t:"Step 1; overall " + EA + " = 70 kJ", ok:true, why:"The highest peak above the reactants." },
          { t:"Step 2; 40 kJ", why:M7 + " The last step isn’t automatically the slow one." },
          { t:"Both; 100 kJ", why:M7 + " Barriers aren’t added." },
          { t:"Step 1; 60 kJ", why:"Measure from the reactants (0), not the intermediate." }] },
        b:{ prompt:"Reactants 0 kJ, first peak 30 kJ, intermediate 15 kJ, second peak 65 kJ, products +5 kJ. Which step is rate-determining, and what is the overall " + EA + "?", options:[
          { t:"Step 2; overall " + EA + " = 65 kJ", ok:true, why:"The second peak is the highest above the reactants." },
          { t:"Step 1; 30 kJ", why:M7 + " The first step isn’t always the slow one." },
          { t:"Both; 95 kJ", why:M7 },
          { t:"Step 2; 50 kJ", why:"Measure from the reactants (0), not the intermediate." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why a small temperature increase raises the rate so much?", options:[
          { t:"“Many more particles now have energy at least equal to " + EA + "; collision frequency rises only slightly.”", ok:true, why:"The energy tail grows far faster than the collision count." },
          { t:"“Particles collide twice as often.”", why:M2 },
          { t:"“The activation energy decreases.”", why:EA + " doesn’t change with temperature." },
          { t:"“Particles become more crowded.”", why:M6 }] },
        b:{ prompt:"Which is the best explanation of why increasing concentration raises the rate?", options:[
          { t:"“More particles per volume means more collisions per second; the fraction with enough energy is unchanged.”", ok:true, why:M6 },
          { t:"“Particles gain energy when crowded.”", why:M6 },
          { t:"“" + EA + " decreases.”", why:"Only a catalyst does that." },
          { t:"“Every collision now succeeds.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:[3, 4],
        a:{ prompt:"Which description correctly shows the same exothermic reaction with and without a catalyst on one diagram?", options:[
          { t:"“The same reactant and product levels; the catalysed path has a lower peak.”", ok:true, why:"A catalyst changes only the peak." },
          { t:"“The catalysed products are lower.”", why:M3 },
          { t:"“The catalysed path starts higher.”", why:"The reactants don’t change." },
          { t:"“The catalysed path has a higher peak but finishes faster.”", why:"Lower peak, not higher." }] },
        b:{ prompt:"In an endothermic reaction’s diagram, which arrow correctly shows " + EAR + "?", options:[
          { t:"From the products up to the peak", ok:true, why:"The reverse climb starts at the products." },
          { t:"From the reactants up to the peak", why:"That’s " + EAF + "." },
          { t:"From the products down to the reactants", why:"That’s −" + DH + "." },
          { t:"From zero up to the peak", why:M5 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"What does a car’s catalytic converter do?", options:[
          { t:"It speeds up the conversion of CO and NO into CO₂ and N₂, and isn’t used up", ok:true, why:"The metals offer a lower-" + EA + " pathway and stay unchanged." },
          { t:"It burns extra fuel to clean the exhaust", why:"It doesn’t burn fuel." },
          { t:"It makes the reactions more exothermic", why:M3 },
          { t:"It stores the pollutants permanently", why:"It converts them." }] },
        b:{ prompt:"An enzyme-catalysed reaction slows sharply above about 45 °C. Why?", options:[
          { t:"The enzyme’s shape changes (it denatures), so the lower-" + EA + " pathway is lost", ok:true, why:"The catalyst stops working." },
          { t:"Fewer particles have enough energy when hot", why:"More do." },
          { t:"The activation energy rises with temperature", why:EA + " of a pathway doesn’t rise; the pathway is lost." },
          { t:"The enzyme gets used up faster", why:M3 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Ammonia plants run at a moderately high temperature with an iron catalyst. Why not room temperature?", options:[
          { t:"At room temperature the reaction would be far too slow, even with the catalyst", ok:true, why:"Too few particles would clear even the catalysed barrier." },
          { t:"Catalysts only work above 400 °C", why:"Some need heat, but the main issue is rate." },
          { t:"The catalyst raises " + DH + " at low temperature", why:M3 },
          { t:"Ammonia can’t form below 400 °C", why:"It can; just very slowly." }] },
        b:{ prompt:"Why does food spoil more slowly in a freezer?", options:[
          { t:"Fewer particles have energy at least equal to " + EA + ", so spoilage reactions slow down", ok:true, why:"The energy tail shrinks in the cold." },
          { t:"Cold kills every chemical reaction", why:"Reactions slow; they don’t all stop." },
          { t:"Freezing raises the activation energy", why:EA + " stays the same." },
          { t:"Cold increases the number of collisions", why:M2 }] } }
    ]
  },
  task:{
    title:"Design a reaction profile", summary:"Design a reaction profile",
    statement:"<p>A self-heating meal pack needs a reaction that releases heat, runs quickly once a catalyst is added, and won’t easily run backwards. Design its energy profile. There’s more than one answer.</p><p>Choose " + EAF + " without a catalyst, " + DH + " and how much the catalyst lowers " + EA + ". The diagram shows both paths and all three arrows.</p>",
    checks:["Releases heat", "Hard to reverse", "Quick once catalysed", "Uses a catalyst"],
    tips:["Exothermic: products below reactants.", "The reverse barrier is the forward barrier plus |" + DH + "| when " + DH + " is negative.", "Catalysed " + EA + " = " + EA + " − drop.", "Pick a drop of 20 or 40."],
    explainPrompt:"Explain how your profile meets each condition, and what the catalyst does and doesn’t change.",
    vocab:"Use the words activation energy, activated complex, " + DH + ", catalyst and reverse reaction.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"Every answer pairs a big release of heat with a high reverse barrier. The catalyst lowers both barriers by the same amount, so the reverse reaction gets faster too."
  },
  cards:[
    ["Collision theory", "Particles react only when they collide with energy ≥ " + EA + " and the right orientation."],
    ["Activation energy (" + EA + ")", "The minimum collision energy needed to react; from the reactants to the peak."],
    ["Activated complex", "The short-lived arrangement at the top of the energy barrier."],
    ["Effective collisions", "Collisions × fraction with " + EGE + " × fraction correctly oriented."],
    ["Maxwell–Boltzmann distribution", "The spread of particle energies; higher temperature flattens it and shifts it right."],
    ["Temperature effect", "Mostly more particles above " + EA + "; collision frequency rises only slightly."],
    ["Concentration and surface area", "More collisions per second; the same energy fraction."],
    ["Catalyst", "A lower-" + EA + " pathway; " + DH + " unchanged; not used up; speeds both directions."],
    [EAR, EAF + " − " + DH + "."],
    ["Exothermic diagram", "Products below reactants; the reverse barrier is higher than the forward one."],
    ["Rate-determining step", "In a multi-step reaction, the step with the highest peak above the reactants."],
    ["Enzymes", "Biological catalysts; they stop working when denatured by heat."]
  ]
};
