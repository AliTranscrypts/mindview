// SBI4U 02 Light and Photosynthetic Pigments. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/02-light-and-pigments.md
// Misconception core sentences (plan §3), reused where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "We see the colours a pigment does <strong>not</strong> absorb. Leaves look green because chlorophyll absorbs little green.";
const M2 = "Shorter wavelength, more energy per photon: a 450 nm photon carries 1.5 times the energy of a 675 nm one.";
const M3 = "Other pigments absorb where chlorophyll <i>a</i> doesn’t and pass the energy along, so the action spectrum is broader.";
const M4 = "Green gives the lowest rate of the visible colours, but not zero.";
const M5 = "Rf = pigment distance ÷ solvent distance. The pigment never passes the solvent, so Rf is between 0 and 1.";
const M6 = "Carotenoids were in the leaf all summer, hidden by chlorophyll. Reds (anthocyanins) are new.";
const M7 = "Accessory pigments pass their absorbed energy to chlorophyll <i>a</i> in the reaction centre.";
const CA = "chlorophyll <i>a</i>", CB = "chlorophyll <i>b</i>", Ca = "Chlorophyll <i>a</i>", Cb = "Chlorophyll <i>b</i>";
const PIGCHIPS = () => [{ t:Ca, k:"a" }, { t:Cb, k:"b" }, { t:"Carotenoids", k:"c" }];
const pig = (right) => PIGCHIPS().map(c => c.k === right ? { t:c.t, ok:true } : { t:c.t });

export default {
  id:"02-light-and-pigments",
  kind:"topic",
  title:"Light and photosynthetic pigments",
  topic:"Light and Photosynthetic Pigments",
  readyTopic:"light and photosynthetic pigments",
  hero:{
    headline:"Leaves are green because they throw green away",
    text:"Sunlight is a mix of colours. <strong>Chlorophyll</strong> absorbs violet-blue and red light strongly and reflects most of the green. <strong>Accessory pigments</strong> catch some of the colours chlorophyll misses and pass the energy on. The light a leaf absorbs is the light that powers photosynthesis.",
    fig:{ aria:"A beam of white light enters a prism and fans into a rainbow. A leaf slides into the rainbow: the violet-blue and red light fades into the leaf (absorbed) while the green bounces off toward your eye, and the leaf glows green. Below, a rainbow band from 380 to 750 nm carries chlorophyll a’s absorption curve, high over the violet-blue and red ends and low over green." }
  },
  goals:[
    "I can relate a light’s colour to its wavelength and to the energy of its photons.",
    "I can read absorption spectra of " + CA + ", " + CB + " and carotenoids, and explain why leaves look green.",
    "I can compare an absorption spectrum with an action spectrum and explain what accessory pigments do.",
    "I can interpret experiments that vary the colour of light (Engelmann’s bacteria; oxygen bubbles).",
    "I can separate pigments by chromatography, calculate Rf values and identify each pigment.",
    "I can explain autumn leaf colours and other everyday uses of pigment knowledge."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"The visible spectrum", goal:1,
          prompt:"Which colour of visible light has the shortest wavelength?",
          options:[
            { t:"Violet", ok:true, why:"Violet light is about 400 nm, the short end of the visible spectrum." },
            { t:"Red", why:"Red is the long end, about 700 nm." },
            { t:"Green", why:"Green is in the middle, about 530 nm." },
            { t:"Yellow", why:"Yellow is about 580 nm." }],
          hints:["Remember the order: red, orange, yellow, green, blue, violet.", "Wavelength shrinks from red toward violet.", "Violet."] },
        { id:"w2", skill:"The visible spectrum", goal:1,
          prompt:"Which carries more energy per photon: blue light (450 nm) or red light (675 nm)?",
          options:[
            { t:"Blue", ok:true, why:"Shorter wavelength, more energy per photon." },
            { t:"Red", why:"Longer waves carry <strong>less</strong> energy per photon." },
            { t:"They carry the same", why:"Photon energy depends on wavelength." },
            { t:"It depends on how bright the light is", why:"Brightness is the number of photons, not the energy of each one." }],
          hints:["Think of ultraviolet light: short wavelength, enough energy to burn skin.", "Energy goes up as wavelength goes down.", "Blue."] },
        { id:"w3", skill:"Reading graphs", goal:2,
          prompt:"A graph has absorbance on the vertical axis and wavelength on the horizontal axis. A tall peak at 430 nm means…",
          options:[
            { t:"the pigment absorbs 430 nm light strongly", ok:true, why:"High absorbance means more light absorbed." },
            { t:"the pigment reflects 430 nm light strongly", why:"Absorbed light isn’t reflected." },
            { t:"the pigment gives off 430 nm light", why:"Absorbance measures light taken in, not given off." },
            { t:"430 nm light is the brightest in sunlight", why:"The graph is about the pigment, not the sun." }],
          hints:["What does ‘absorbance’ measure?", "How much light the sample takes in.", "Strong absorption at 430 nm."] },
        { id:"w4", skill:"Reading graphs", goal:4,
          prompt:"A water plant gives off 24 bubbles per minute in blue light and 6 per minute in green light. How many times faster is the blue rate?",
          options:[
            { t:"4 times", ok:true, why:"24 ÷ 6 = 4." },
            { t:"18 times", why:"24 − 6 = 18 is the difference, not the ratio." },
            { t:"0.25 times", why:"That’s green compared with blue." },
            { t:"3 times", why:"Check: 6 × 3 = 18, not 24." }],
          hints:["‘How many times’ means divide.", "Blue ÷ green.", "24 ÷ 6 = 4."] },
        { id:"w5", skill:"Photosynthesis measurements", goal:4,
          prompt:"Which gas is counted as bubbles to measure the rate of photosynthesis in a water plant?",
          options:[
            { t:"Oxygen", ok:true, why:"Photosynthesis releases O₂, which forms bubbles." },
            { t:"Carbon dioxide", why:"CO₂ is taken in, not given off, in light." },
            { t:"Water vapour", why:"Underwater plants don’t release water vapour bubbles." },
            { t:"Nitrogen", why:"Nitrogen isn’t a product of photosynthesis." }],
          hints:["Which gas does photosynthesis produce?", "It’s the one we breathe in.", "Oxygen."] },
        { id:"w6", skill:"Photosynthesis measurements", goal:4,
          prompt:"A student wants to compare the rate of photosynthesis under red and green light. Which must stay the same in both trials?",
          options:[
            { t:"The lamp’s brightness and distance", ok:true, why:"Only the colour should change." },
            { t:"The colour of the light", why:"Colour is what’s being tested: it must change." },
            { t:"The number of bubbles", why:"That’s the result being measured." },
            { t:"Nothing, as long as the student is careful", why:"Uncontrolled variables can change the result." }],
          hints:["What’s being tested?", "Everything else must be kept the same.", "Brightness and distance."] }
      ],
      refreshers:{
        "The visible spectrum":"From red (≈ 700 nm) to violet (≈ 400 nm), wavelength gets shorter and each photon carries more energy. Brightness is how many photons arrive, a separate idea.",
        "Reading graphs":"Read the axis labels first. ‘How many times’ means divide one value by the other: 24 ÷ 6 = 4.",
        "Photosynthesis measurements":"Counting O₂ bubbles from a water plant measures the rate. Change one variable (the independent variable), measure the bubbles (the dependent variable), and keep everything else the same (controlled variables)."
      }
    }
  },
  explore:{
    heading:"Spectrum lab",
    intro:"Slide through the spectrum to see which colours each pigment absorbs. Then shine coloured light on a water plant, and replay a famous experiment with bacteria.",
    modelNote:"Rounded model values shaped like real measurements. Absorption curves are for pigments extracted in solvent.",
    actionNote:"The action spectrum comes from a living plant. Inside a leaf, pigments are attached to proteins and light bounces around, so the plant uses a slightly wider range than the extracted pigments absorb.",
    plantNote:"Elodea (Canadian waterweed, <i>Elodea canadensis</i>): O₂ bubbles per minute at the same lamp brightness under every filter.",
    engNote:"A green algal filament lies across a spread spectrum, with oxygen-seeking bacteria in the water around it. Press <strong>Run</strong> and watch where they settle.",
    // Model action spectrum (plan: Elodea bubbles per minute, same lamp brightness every time)
    filters:[
      { nm:420, name:"violet", bubbles:20 }, { nm:450, name:"blue", bubbles:24 }, { nm:530, name:"green", bubbles:6 },
      { nm:580, name:"yellow", bubbles:8 }, { nm:610, name:"orange", bubbles:14 }, { nm:660, name:"red", bubbles:22 },
      { nm:730, name:"far red", bubbles:2, note:"barely visible" }
    ],
    predIntro:"Make a prediction first. The spectrum lab then sets itself up (Absorption mode for the first two, Engelmann mode for the third, Action mode for the last) and shows you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"abs", pig:{ a:true, b:false, c:false }, wl:430 }, to:550,
        prompt:"How much will " + CA + " absorb at 550 nm (green)?",
        options:[{ t:"Almost none", ok:true }, { t:"Most of it" }, { t:"About half" }, { t:"It absorbs green best" }],
        explain:"Green is the colour chlorophyll leaves behind, which is why leaves look green." },
      { id:"p2", start:{ mode:"abs", pig:{ a:true, b:true, c:true }, wl:430 }, to:480,
        prompt:"Which pigment absorbs most at 480 nm?",
        options:[{ t:"Carotenoids", ok:true }, { t:Ca }, { t:Cb }, { t:"None of them" }],
        explain:"Carotenoids fill the blue-green gap between " + CA + "’s peak and the green dip." },
      { id:"p3", start:{ mode:"eng", spread:true },
        prompt:"Bacteria that need O₂ swim toward where it’s made. Where will they crowd along the filament?",
        options:[{ t:"Under violet-blue and under red", ok:true }, { t:"Under green" }, { t:"Evenly along the filament" }, { t:"Only under red" }],
        explain:"Most O₂ is made where the alga’s pigments absorb most light." },
      { id:"p4", start:{ mode:"act", filter:660 }, to:530,
        prompt:"Under the green filter, the Elodea will give off…",
        options:[{ t:"fewer bubbles than under red, but some", ok:true }, { t:"no bubbles at all" }, { t:"more bubbles than under red" }, { t:"the same number" }],
        explain:"Green is the weakest visible colour for photosynthesis, but not useless: some is still absorbed." }
    ],
    chalIntro:"Use the spectrum lab to meet each goal, then press <strong>Check challenge</strong>. For the filter challenge, work in Action mode and record your two choices with the buttons under the filters. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Set the slider to a wavelength where " + CB + " absorbs more than " + CA + " (and at least 10).",
        why:Cb + "’s peaks sit just right of " + CA + "’s blue peak and just left of its red peak. In this model, 442–485 nm and 620–650 nm work.",
        hints:[Cb + "’s peaks are a little to the right of <i>a</i>’s blue peak and a little to the left of <i>a</i>’s red peak.", "Try just past 440 nm, or just before 650 nm.", "450 nm (<i>b</i> 98, <i>a</i> 41) works."] },
      { id:"tc2", goal:[3, 4], prompt:"Choose the filter that gives the <strong>most</strong> bubbles, then the filter that gives the <strong>fewest</strong>.",
        why:"Most: 450 nm (24 bubbles/min). Fewest: 730 nm (2), because chlorophyll absorbs almost nothing past 700 nm.",
        hints:["Try every filter and watch the counter.", "Compare 450 with 660, and 530 with 730.", "Most: 450 nm (24); fewest: 730 nm (2)."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Find a wavelength where " + CA + " absorbs at least 50, but " + CB + " and the carotenoids each absorb 10 or less.",
        why:"From about 665 to 672 nm only " + CA + " absorbs much: carotenoids absorb nothing in the red, and " + CB + "’s red peak (642 nm) has faded.",
        hints:["Carotenoids absorb nothing in the red, so look there.", Cb + "’s red peak is at 642, <i>a</i>’s at 662. Move just past <i>a</i>’s peak.", "Try 668 nm."] }
    ]
  },
  part3:{
    slug:"chromatography", name:"Chromatography",
    heading:"Paper chromatography",
    intro:"The Explore curves were for separated pigments. This is how they’re separated. Run a virtual chromatogram of spinach, calculate each band’s Rf, then compare summer and autumn maple leaves.",
    // Station 1 (S9 procedure lab): the correct steps in order; mistakes with visible consequences.
    steps:[
      { id:"grind", t:"Grind spinach leaves with a little solvent.", done:"Extract ready." },
      { id:"pencil", t:"Draw a <strong>pencil</strong> line 2 cm from the bottom of the paper strip.", done:"Start line drawn in pencil." },
      { id:"dot", t:"Dot the extract on the line many times, letting it dry between dots.", done:"A small, dark spot of extract sits on the line.", need:"Not yet: you need the extract and a start line to dot it on." },
      { id:"stand", t:"Stand the strip in solvent with the line <strong>above</strong> the solvent surface.", done:"The strip stands in the solvent; the spot is just above the surface.", need:"Not yet: dot the extract on the line first." },
      { id:"rise", t:"Let the solvent rise until it’s near the top.", done:"The solvent climbs and carries the pigments up at different speeds.", need:"Not yet: the strip has to stand in the solvent first." },
      { id:"mark", t:"Remove the strip and mark the solvent front at once.", done:"Solvent front marked in pencil.", need:"Not yet: let the solvent rise first." }
    ],
    mistakes:[
      { id:"pen", at:"pencil", t:"Draw a pen line 2 cm from the bottom of the paper strip.", fb:"The ink runs with the solvent and adds its own bands." },
      { id:"below", at:"stand", t:"Stand the strip in solvent with the line below the solvent surface.", fb:"The pigments dissolve into the pool instead of climbing." },
      { id:"nomark", at:"mark", t:"Remove the strip and let it dry before marking anything.", fb:"The front dries and disappears; you can’t calculate Rf." }
    ],
    // Station 2: solvent front 10.0 cm from the line; band distances (plan).
    front:10,
    bands:[
      { id:"b1", col:"yellow-orange", d:9.5, answer:0.95, pig:"car" },
      { id:"b2", col:"yellow", d:7.0, answer:0.70, pig:"xan" },
      { id:"b3", col:"blue-green", d:5.5, answer:0.55, pig:"chla" },
      { id:"b4", col:"yellow-green", d:4.0, answer:0.40, pig:"chlb" }
    ],
    pigments:[
      { id:"car", t:"Carotene", col:"yellow-orange", rf:"0.95" },
      { id:"xan", t:"Xanthophyll", col:"yellow", rf:"0.70" },
      { id:"chla", t:Ca, col:"blue-green", rf:"0.55" },
      { id:"chlb", t:Cb, col:"yellow-green", rf:"0.40" }
    ],
    m5:M5,
    rfNote:"Rf values from this virtual set-up; real values depend on the solvent and the paper.",
    whySep:"Each pigment dissolves in the solvent to a different degree and clings to the paper to a different degree. Carotene dissolves best and clings least, so it travels farthest.",
    autumnNote:"Red anthocyanins are new in autumn, made in the cell’s vacuole; they dissolve poorly in this solvent.",
    notPhoto:"Anthocyanins aren’t photosynthetic pigments: they don’t pass energy to chlorophyll.",
    blocks:[{ title:"Why leaves change colour in autumn", html:"<p>Shorter, cooler days lead to chlorophyll breaking down. The yellow-orange carotenoids that were in the leaf all along, hidden by chlorophyll, now show through. Trees such as red maples also make new red pigments (anthocyanins) in their cells as the chlorophyll breaks down.</p>" }],
    quickCheck:{
      title:"Quick check", summary:"Chromatography quick check",
      items:[
        { id:"q1", goal:5, prompt:"A pigment moves 3.0 cm while the solvent moves 6.0 cm. Rf?",
          choices:[{ t:"0.50", ok:true, fb:"Pigment ÷ solvent: 3.0 ÷ 6.0." }, { t:"2.0", fb:"Pigment ÷ solvent: 3.0 ÷ 6.0." }, { t:"3.0", fb:"Pigment ÷ solvent: 3.0 ÷ 6.0." }, { t:"0.30", fb:"Pigment ÷ solvent: 3.0 ÷ 6.0." }] },
        { id:"q2", goal:5, prompt:"Why is the start line drawn in pencil?",
          choices:[{ t:"Ink would run with the solvent", ok:true, fb:"Graphite doesn’t dissolve, so it stays put." }, { t:"Pencil absorbs light", fb:"Graphite doesn’t dissolve, so it stays put." }, { t:"Pencil speeds up the solvent", fb:"Graphite doesn’t dissolve, so it stays put." }, { t:"Ink is too dark to see the bands", fb:"Graphite doesn’t dissolve, so it stays put." }] },
        { id:"q3", goal:5, prompt:"Which pigment travels farthest?",
          choices:[{ t:"Carotene", ok:true, fb:"Highest Rf: it dissolves best in the solvent." }, { t:Cb, fb:"Highest Rf: it dissolves best in the solvent." }, { t:Ca, fb:"Highest Rf: it dissolves best in the solvent." }, { t:"Xanthophyll", fb:"Highest Rf: it dissolves best in the solvent." }] },
        { id:"q4", goal:6, prompt:"In autumn, the yellow bands are strong but the green bands are faint. Why?",
          choices:[{ t:"Chlorophyll breaks down, revealing carotenoids already there", ok:true, fb:"The carotenoids were there all summer." }, { t:"The leaf makes yellow pigments in autumn", fb:"The carotenoids were there all summer." }, { t:"Cold turns chlorophyll yellow", fb:"The carotenoids were there all summer." }, { t:"The solvent changed", fb:"The carotenoids were there all summer." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"spectra", type:"custom", title:"Read the spectra", summary:"Read the spectra", goal:[2, 3],
        instruction:"Eight questions on the model graph from Explore. Tap a point on the graph, or choose an answer.", how:"",
        items:[
          { id:"r1", kind:"tap", goal:2, prompt:"Tap " + CB + "’s blue peak.", answer:[448, 458],
            near:[{ at:430, tol:5, fb:"That’s " + CA + "’s peak." }], miss:"That isn’t the top of " + CB + "’s blue peak. " + Cb + " is the dashed curve.",
            why:Cb + "’s blue peak is at 453 nm.",
            hints:[Cb + " is the dashed curve.", "Its blue peak is a little to the right of " + CA + "’s blue peak.", "Tap the top of the dashed curve’s left peak, at about 453 nm."] },
          { id:"r2", kind:"tap", goal:2, prompt:"Tap " + CA + "’s red peak.", answer:[657, 667],
            near:[{ at:642, tol:5, fb:"That’s " + CB + "’s." }], miss:"That isn’t the top of " + CA + "’s red peak. " + Ca + " is the solid curve.",
            why:Ca + "’s red peak is at 662 nm.",
            hints:[Ca + " is the solid curve.", "Its red peak is the taller of the two red peaks, a little farther right.", "Tap the top of the solid curve’s right-hand peak, at about 662 nm."] },
          { id:"r3", kind:"tap", goal:2, prompt:"Tap a wavelength between 480 and 680 nm where none of the pigments absorbs more than 5.", answer:[513, 615],
            near:[{ at:480, tol:2, fb:"Carotenoids absorb 91 there." }], values:true,
            why:"From about 513 to 615 nm, all three curves sit at 5 or below.",
            hints:["Find where all three curves sit near zero.", "Look between the blue-green and the red peaks.", "Any wavelength from about 515 to 615 nm."] },
          { id:"r4", kind:"chips", goal:2, prompt:"At 640 nm, which pigment absorbs most?", mark:640,
            choices:pig("b"), fb:"Chlorophyll <i>a</i> is only 14 here.", why:Cb + ": 59 at 640 nm.",
            hints:["Find 640 nm on the axis and look straight up the marked line.", "Compare the heights of the three curves on the line.", Cb + ": 59, against " + CA + "’s 14."] },
          { id:"r5", kind:"chips", goal:2, prompt:"At 465 nm, which pigment absorbs most?", mark:465,
            choices:pig("c"), fb:Cb + " is 73; carotenoids are higher.", why:"Carotenoids: 99 at 465 nm.",
            hints:["Find 465 nm on the axis and look straight up the marked line.", "Two curves are high there. Which one is higher?", "Carotenoids: 99, against " + CB + "’s 73."] },
          { id:"r6", kind:"chips", goal:2, prompt:"Which colour do all three pigments absorb least?",
            choices:[{ t:"Green", ok:true }, { t:"Violet" }, { t:"Blue" }, { t:"Red" }], fb:M1, why:"That’s why green is reflected.",
            hints:["Where do all three curves sit near zero?", "Between the blue-green peaks and the red peaks.", "Green."] },
          { id:"r7", kind:"chips", goal:3, prompt:"Which bubble count is highest: violet 420, red 660 or orange 610?", action:true,
            choices:[{ t:"Violet 420" }, { t:"Red 660", ok:true }, { t:"Orange 610" }], fb:"420 gives 20; 610 gives 14.", why:"Red 660 gives 22 bubbles per minute.",
            hints:["Read the three bubble counts on the action spectrum (right-hand scale).", "Compare the points at 420, 610 and 660 nm.", "Red 660: 22 bubbles/min (420 gives 20; 610 gives 14)."] },
          { id:"r8", kind:"chips", goal:3, prompt:"From 610 to 660 nm, the bubble rate rises from 14 to 22. Which pigment explains most of the rise?", action:true, band:[610, 660],
            choices:pig("a"), fb:Ca + "’s red peak (≈ 662 nm) is right there.", why:"Its red peak (≈ 662 nm) is right there.",
            hints:["Which pigment has a peak between 610 and 660 nm?", "Look for the curve that climbs steeply across the shaded stretch.", Ca + ": its red peak (≈ 662 nm) is right there."] }
        ] },
      { id:"experiments", type:"custom", title:"Light experiments", summary:"Light experiments", star:true, goal:[1, 3, 4, 6],
        instruction:"Six questions from light experiments: planning a fair test, comparing rates and applying the spectra to new cases.", how:"",
        items:[
          { id:"x1", kind:"sel", goal:4, prompt:"Elodea bubbles under different filters. Select <strong>all</strong> the variables that must be controlled.",
            options:[
              { t:"lamp brightness", ok:true, why:"" },
              { t:"lamp distance", ok:true, why:"" },
              { t:"water temperature", ok:true, why:"" },
              { t:"the same sprig of Elodea", ok:true, why:"" },
              { t:"CO₂ supply (baking soda in the water)", ok:true, why:"" },
              { t:"the colour of the filter", why:"Filter colour is the independent variable." },
              { t:"the number of bubbles", why:"Bubble count is the dependent variable." }],
            why:"Filter colour is the independent variable; bubble count is the dependent variable. Everything else must stay the same.",
            hints:["Which variable are you changing on purpose, and which are you measuring?", "Filter colour is changed on purpose; the bubble count is measured. Everything else must stay the same.", "Control the lamp brightness, the lamp distance, the water temperature, the sprig of Elodea and the CO₂ supply."] },
          { id:"x2", kind:"num", goal:4, prompt:"Blue gives 24 bubbles/min and green 6. How many times faster is the blue rate?",
            answer:4, display:"4 times", unit:"times",
            wrong:[{ match:18, fb:"That’s the difference, not the ratio." }],
            hints:["‘How many times’ means divide.", "Blue ÷ green.", "24 ÷ 6 = 4."] },
          { id:"x3", kind:"num", goal:1, star:true, prompt:"Photon energy is inversely proportional to wavelength. How many times more energy does a 450 nm photon carry than a 675 nm photon?",
            answer:1.5, tol:0.001, display:"1.5 times", unit:"times",
            wrong:[{ match:0.67, tol:0.01, fb:"That’s red compared with blue." }],
            hints:["Inversely proportional: as wavelength goes down, energy goes up by the same factor.", "Divide the longer wavelength by the shorter one: 675 ÷ 450.", "675 ÷ 450 = 1.5, so the 450 nm photon carries 1.5 times the energy."] },
          { id:"x4", kind:"mc", goal:3, star:true, prompt:"A mutant plant has no " + CB + ". At which wavelength does it lose the largest <strong>share</strong> of the light its pigments would absorb: 430, 480, 640 or 660 nm?",
            options:[
              { t:"640 nm", ok:true, why:"At 640 nm, <i>b</i> is 59 of 73: 81%." },
              { t:"480 nm", why:"Carotenoids still absorb 91 there; <i>b</i> was only 20 of 111." },
              { t:"430 nm", why:"<i>b</i> was 31 of 177 there." },
              { t:"660 nm", why:"<i>b</i> was 19 of 93 there." }],
            hints:["Without " + CB + ", the plant loses <i>b</i>’s absorption at each wavelength.", "Compare <i>b</i> with the total absorbance at each wavelength.", "At 640 nm, <i>b</i> is 59 of 73: 81%."] },
          { id:"x5", kind:"mc", goal:6, star:true, prompt:"Greenhouse LED lights in southwestern Ontario often glow purple. Why?",
            options:[
              { t:"They mix red and blue LEDs, the colours chlorophyll absorbs best, and skip most green", ok:true, why:"Red + blue looks purple to us; it puts energy where the pigments absorb." },
              { t:"Purple light is the most energetic colour", why:"Red + blue looks purple to us; it puts energy where the pigments absorb." },
              { t:"Plants absorb purple best", why:"Red + blue looks purple to us; it puts energy where the pigments absorb." },
              { t:"Purple light keeps insects away", why:"Red + blue looks purple to us; it puts energy where the pigments absorb." }],
            hints:["Which colours does chlorophyll absorb best?", "Red and blue. What do red and blue look like together?", "They mix red and blue LEDs, which look purple to us, and skip most green."] },
          { id:"x6", kind:"mc", goal:[3, 6], star:true, prompt:"Light on the floor of a dense maple forest is rich in green and far red. Which explanation fits?",
            options:[
              { t:"The canopy leaves have absorbed most of the blue and red", ok:true, why:"The canopy’s chlorophyll takes the blue and red; what passes through is the light chlorophyll uses least." },
              { t:"Green light is made by the forest floor", why:"The canopy’s chlorophyll takes the blue and red; what passes through is the light chlorophyll uses least." },
              { t:"Far red comes from the soil", why:"The canopy’s chlorophyll takes the blue and red; what passes through is the light chlorophyll uses least." },
              { t:"The canopy reflects blue upward only", why:"The canopy’s chlorophyll takes the blue and red; what passes through is the light chlorophyll uses least." }],
            hints:["What happens to sunlight as it passes through the canopy leaves?", "Chlorophyll absorbs blue and red strongly and lets green and far red through.", "The canopy leaves have absorbed most of the blue and red."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ahmed", how:"",
        instruction:"Ahmed made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain why leaves look green.",
            steps:["Sunlight contains all the visible colours.", "Chlorophyll absorbs mostly green light.", "The absorbed green light powers photosynthesis.", "So the leaf looks green."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows."],
            fixes:[
              { t:"Chlorophyll absorbs mostly violet-blue and red, and very little green, so green is reflected.", ok:true, why:M1 },
              { t:"Chlorophyll gives off green light.", why:"Leaves reflect light; they don’t glow." },
              { t:"Carotenoids absorb green.", why:"Carotenoids absorb blue and blue-green (about 420–500 nm), not green." },
              { t:"Step 2 is correct.", why:"If green were absorbed, it wouldn’t reach your eye." }],
            hints:["Do we see absorbed light or reflected light?", "Reflected.", "So chlorophyll must absorb little green."] },
          { id:"e2", goal:5, task:"Find the Rf of a band 6.3 cm from the start when the solvent front is 9.0 cm from the start.",
            steps:["Rf = distance moved by the solvent ÷ distance moved by the pigment.", "Rf = 9.0 ÷ 6.3 ≈ 1.43.", "An Rf above 1 means the pigment is very soluble: carotene."],
            answer:0,
            stepFb:["", "Step 2 uses step 1’s formula. The mistake is earlier.", "Step 3 builds on the wrong value."],
            fixes:[
              { t:"Rf = pigment ÷ solvent = 6.3 ÷ 9.0 = 0.70: xanthophyll.", ok:true, why:M5 },
              { t:"Rf = 9.0 − 6.3 = 2.7.", why:"That’s the difference in distances." },
              { t:"Rf = 6.3 × 9.0.", why:"Rf divides the two distances: pigment ÷ solvent." },
              { t:"Step 1 is correct.", why:"The pigment never moves farther than the solvent, so Rf can’t exceed 1." }],
            hints:["Can a pigment travel farther than the solvent carrying it?", "So Rf must be less than 1.", "6.3 ÷ 9.0 = 0.70."] },
          { id:"e3", goal:1, task:"Compare red and blue light for photosynthesis.",
            steps:["Red light has a longer wavelength than blue light.", "Longer waves carry more energy, so red photons carry more energy than blue ones.", Ca + " absorbs both colours strongly.", "Both can drive photosynthesis."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct, but the mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"Shorter waves carry more energy, so blue photons carry more energy than red ones.", ok:true, why:M2 },
              { t:"All photons carry the same energy.", why:"Photon energy depends on wavelength." },
              { t:"Only blue light drives photosynthesis.", why:Ca + " absorbs red strongly too (≈ 660 nm), so red drives photosynthesis as well." },
              { t:"Step 2 is correct.", why:"A 450 nm photon carries 1.5 times the energy of a 675 nm one." }],
            hints:["Which is more dangerous to skin: ultraviolet or infrared?", "Ultraviolet: shorter wavelength, more energy.", "So blue beats red per photon."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the spectrum lab or in Engelmann’s experiment?" },
      { id:"j2", q:"In your own words, what’s the difference between an absorption spectrum and an action spectrum?" },
      { id:"j3", q:"Explain to a friend how to calculate an Rf value and what it tells you." },
      { id:"j4", q:"Which idea about light and pigments are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which colour of visible light carries the most energy per photon?", options:[
          { t:"Violet", ok:true, why:"Shortest wavelength, most energy." },
          { t:"Red", why:"Red has the longest wavelength and the least energy." },
          { t:"Green", why:"Green is in the middle." },
          { t:"All colours carry the same energy", why:"Energy depends on wavelength." }] },
        b:{ prompt:"Which colour of visible light carries the least energy per photon?", options:[
          { t:"Red", ok:true, why:"Longest wavelength, least energy." },
          { t:"Violet", why:"Violet carries the most." },
          { t:"Blue", why:"Blue is near the energetic end." },
          { t:"All colours carry the same energy", why:"Energy depends on wavelength." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Why do most leaves look green?", options:[
          { t:"Chlorophyll absorbs little green light, so green is reflected and transmitted to our eyes.", ok:true, why:M1 },
          { t:"Chlorophyll absorbs green light most strongly.", why:M1 },
          { t:"Chloroplasts give off green light.", why:"Leaves reflect light; they don’t glow." },
          { t:"Carotenoids are green.", why:"Carotenoids are yellow-orange." }] },
        b:{ prompt:"Why do carrots look orange?", options:[
          { t:"Carotene absorbs blue and blue-green light, and reflects the yellow-orange.", ok:true, why:"We see the colours a pigment does <strong>not</strong> absorb: carotene takes the blue and blue-green and leaves the yellow-orange." },
          { t:"Carotene absorbs orange light most strongly.", why:"We see the colours a pigment does <strong>not</strong> absorb, so an orange carrot can’t be absorbing orange most." },
          { t:"Carotene gives off orange light.", why:"It reflects; it doesn’t glow." },
          { t:"Carrots contain orange chlorophyll.", why:"Chlorophyll is green; the roots have carotene." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"On a chromatogram, the solvent moved 8.0 cm and a pigment moved 6.0 cm. What is the pigment’s Rf?", options:[
          { t:"0.75", ok:true, why:"6.0 ÷ 8.0." },
          { t:"1.33", why:"That’s solvent ÷ pigment." },
          { t:"2.0", why:"That’s the difference in distances." },
          { t:"0.25", why:"That’s 2.0 ÷ 8.0." }] },
        b:{ prompt:"The solvent moved 12.0 cm and a pigment moved 3.0 cm. What is the pigment’s Rf?", options:[
          { t:"0.25", ok:true, why:"3.0 ÷ 12.0." },
          { t:"4.0", why:"That’s solvent ÷ pigment. " + M5 },
          { t:"9.0", why:"That’s the difference." },
          { t:"0.75", why:"That’s 9.0 ÷ 12.0." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"The action spectrum shows a fairly high rate at 470 nm, where " + CA + " absorbs almost nothing. Which explanation fits best?", options:[
          { t:"Accessory pigments (" + CB + " and carotenoids) absorb 470 nm light and pass the energy to " + CA + ".", ok:true, why:M3 },
          { t:"Accessory pigments make their own O₂ without " + CA + ".", why:M7 },
          { t:Ca + " actually absorbs strongly at 470 nm.", why:"The model curve is near 0 there (about 3)." },
          { t:"Action spectra are unreliable.", why:"The difference has a cause. " + M3 }] },
        b:{ prompt:"The action spectrum shows a fairly high rate at 640 nm, where " + CA + " absorbs only weakly. Which explanation fits best?", options:[
          { t:Cb + " absorbs strongly at 640 nm and passes the energy to " + CA + ".", ok:true, why:M3 },
          { t:Cb + " makes its own O₂ without " + CA + ".", why:M7 },
          { t:"Carotenoids absorb strongly at 640 nm.", why:"Carotenoids absorb nothing in the red." },
          { t:"Action spectra are unreliable.", why:"The difference has a cause. " + M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"In Engelmann’s experiment with a green alga, bacteria crowded under blue and red light. What does this show?", options:[
          { t:"O₂ was made fastest where the alga’s chlorophyll absorbs most, so the light chlorophyll absorbs drives photosynthesis.", ok:true, why:"Most O₂ is made where the alga’s pigments absorb most light." },
          { t:"The bacteria simply prefer red and blue light.", why:"The bacteria follow O₂, not colour." },
          { t:"The bacteria were photosynthesizing.", why:"They were using O₂, not making it." },
          { t:"Green light kills bacteria.", why:"Green light gave less O₂, so fewer bacteria gathered." }] },
        b:{ prompt:"The experiment is repeated with a red seaweed whose extra pigments absorb green light well. Where will bacteria crowd?", options:[
          { t:"Under green as well as under blue and red, because the seaweed’s pigments absorb green and use it.", ok:true, why:"Different pigments mean a different action spectrum: this seaweed absorbs green, so it makes O₂ under green too." },
          { t:"Under blue and red only, as with the green alga.", why:"Different pigments mean a different action spectrum." },
          { t:"Under red only.", why:"Its chlorophyll still absorbs blue." },
          { t:"Nowhere, because red seaweeds reflect green.", why:"This seaweed absorbs green." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A mutant plant has no " + CB + ". Compared with a normal plant, around which wavelength will its photosynthesis rate drop the most?", options:[
          { t:"640 nm", ok:true, why:"Most of the light absorbed there is absorbed by " + CB + "." },
          { t:"660 nm", why:Ca + " absorbs 74 there and is still present." },
          { t:"550 nm", why:"Nothing absorbs much there in either plant." },
          { t:"700 nm", why:"Neither plant absorbs much at 700 nm." }] },
        b:{ prompt:"A mutant plant has no carotenoids. Around which wavelength will its photosynthesis rate drop the most?", options:[
          { t:"480 nm", ok:true, why:"Carotenoids absorb 91 there; " + CA + " absorbs 0." },
          { t:"430 nm", why:Ca + " still absorbs strongly there." },
          { t:"660 nm", why:"Carotenoids absorb nothing in the red." },
          { t:"550 nm", why:"Nothing absorbs much there in either plant." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which statement best distinguishes an absorption spectrum from an action spectrum?", options:[
          { t:"“An absorption spectrum shows how much of each wavelength a pigment absorbs; an action spectrum shows how fast photosynthesis runs at each wavelength.”", ok:true, why:"One graph is about what a pigment takes in; the other is about how fast the plant photosynthesizes." },
          { t:"“They are the same graph with different titles.”", why:M3 },
          { t:"“An absorption spectrum shows the colours a leaf reflects.”", why:M1 },
          { t:"“An action spectrum shows how much light the sun gives off at each wavelength.”", why:"It’s about the plant’s rate, not the sun." }] },
        b:{ prompt:"Which statement best explains why the action spectrum is broader than " + CA + "’s absorption spectrum?", options:[
          { t:"“" + Cb + " and carotenoids absorb wavelengths that " + CA + " misses and pass the energy to " + CA + ".”", ok:true, why:M3 },
          { t:"“" + Ca + " absorbs every colour equally.”", why:"Its curve has two clear peaks." },
          { t:"“Accessory pigments do their own photosynthesis.”", why:M7 },
          { t:"“Green light is the main driver of photosynthesis.”", why:M4 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which best explains why sugar maple leaves turn yellow-orange in autumn?", options:[
          { t:"“Shorter, cooler days lead to chlorophyll breaking down; the yellow-orange carotenoids that were there all along now show.”", ok:true, why:"Carotenoids were in the leaf all summer, hidden by chlorophyll." },
          { t:"“The leaves make new carotenoids in autumn.”", why:M6 },
          { t:"“Cold weather turns chlorophyll yellow.”", why:"Chlorophyll breaks down; it doesn’t change colour." },
          { t:"“Autumn sunlight contains more yellow light.”", why:"The leaf changed, not the light." }] },
        b:{ prompt:"Which best explains why red maple leaves turn red in autumn?", options:[
          { t:"“As chlorophyll breaks down, the leaf makes new red pigments (anthocyanins) in its cells, which reflect red.”", ok:true, why:M6 },
          { t:"“The red pigments were hidden under the chlorophyll all summer.”", why:"Anthocyanins are made new in autumn." },
          { t:"“The leaves absorb red light in autumn.”", why:"We see the colours a pigment does <strong>not</strong> absorb, so a red leaf is reflecting red." },
          { t:"“Carotenoids are red.”", why:"Carotenoids are yellow-orange." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A student counts Elodea bubbles under a red filter, then moves the lamp closer before counting under a green filter. Why are the results unfair?", options:[
          { t:"Light brightness wasn’t controlled, so the green count isn’t comparable.", ok:true, why:"Only the colour should change." },
          { t:"Green light can’t make bubbles.", why:M4 },
          { t:"The filter colour should have stayed the same.", why:"Colour is the variable being tested." },
          { t:"The student should have counted CO₂ bubbles instead.", why:"The bubbles are O₂." }] },
        b:{ prompt:"A student counts Elodea bubbles under a blue filter, then uses a different, bigger Elodea sprig for the green filter. Why are the results unfair?", options:[
          { t:"The plant wasn’t controlled: a bigger sprig photosynthesizes more, whatever the colour.", ok:true, why:"Only the colour should change." },
          { t:"Green light can’t make bubbles.", why:M4 },
          { t:"The filter colour should have stayed the same.", why:"Colour is the variable being tested." },
          { t:"The student should have counted CO₂ bubbles instead.", why:"The bubbles are O₂." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A seedling grower can buy LEDs of exactly two colours and wants to match " + CA + "’s two absorption peaks. Which pair?", options:[
          { t:"About 430 nm and 660 nm", ok:true, why:Ca + "’s peaks are near 430 nm and 660 nm." },
          { t:"About 530 nm and 580 nm", why:"Green and yellow are absorbed least." },
          { t:"About 450 nm and 480 nm", why:"Both blue: no red peak." },
          { t:"About 660 nm and 730 nm", why:"Far red is absorbed very little." }] },
        b:{ prompt:"A grower wants two LED colours that match " + CB + "’s two absorption peaks. Which pair?", options:[
          { t:"About 450 nm and 640 nm", ok:true, why:Cb + "’s peaks are near 450 nm and 640 nm." },
          { t:"About 430 nm and 660 nm", why:"Those are " + CA + "’s peaks." },
          { t:"About 530 nm and 580 nm", why:"Green and yellow are absorbed least." },
          { t:"About 480 nm and 500 nm", why:"Those are in the carotenoid region." }] } }
    ]
  },
  task:{
    title:"Design a grow-light", summary:"Design a grow-light",
    statement:"<p>Build a grow-light for a greenhouse from 25 W LED lamps. Can you find every design that works?</p><ol class=\"lp-conds\"><li>Includes " + CA + "’s red peak (a 660 nm lamp).</li><li>Total model photosynthesis of at least 56 bubbles per minute.</li><li>Fits the power budget: at most 75 W.</li></ol><p class=\"tiny muted\">Each lamp adds its action-spectrum value from the Spectrum lab (Elodea bubbles per minute) to the total.</p>",
    lamps:[420, 450, 530, 580, 610, 660, 730],
    watts:25, budget:75, target:56,
    legend:"Bars: your lamps, with their bubbles per minute (right-hand scale). Faint curves: " + CA + " (solid), " + CB + " (dashed) and carotenoids (orange).",
    checks:["Includes the red peak", "Enough photosynthesis", "Within the power budget"],
    tips:[Ca + "’s red peak is near 662 nm.", "Green, yellow and far-red lamps add little: look at the action spectrum.", "Each lamp costs 25 W, so you can afford three."],
    explainPrompt:"Explain why your lamps work, using the absorption and action spectra.",
    vocab:"Use the words wavelength, absorb, chlorophyll a, accessory pigment and action spectrum.",
    more:"Can you find every design that works?",
    allFound:"You’ve found every design that works.",
    after3:"Every design pairs the red peak with violet-blue or orange light the pigments use well, and skips green. That’s why grow-lights glow purple-pink."
  },
  cards:[
    ["Photon", "A packet of light energy. Shorter wavelength → more energy per photon."],
    ["Visible light", "About 380 nm (violet) to 750 nm (red). Plants use mostly 400–700 nm."],
    ["Pigment", "A molecule that absorbs certain wavelengths; we see the colours it doesn’t absorb."],
    [Ca, "The main photosynthetic pigment; peaks near 430 nm and 660 nm."],
    [Cb, "An accessory pigment; peaks near 450 nm and 640 nm."],
    ["Carotenoids", "Yellow-orange accessory pigments; absorb blue and blue-green (about 420–500 nm)."],
    ["Accessory pigment", "Absorbs light " + CA + " misses and passes the energy to " + CA + "."],
    ["Absorption spectrum", "A graph of how much light a pigment absorbs at each wavelength."],
    ["Action spectrum", "A graph of the rate of photosynthesis at each wavelength."],
    ["Engelmann’s experiment", "Oxygen-seeking bacteria crowded where an alga absorbed blue and red light: evidence that absorbed light drives photosynthesis."],
    ["Rf value", "Pigment distance ÷ solvent distance; always between 0 and 1."],
    ["Autumn colours", "Chlorophyll breaks down; carotenoids (already there) show; reds are new anthocyanins."]
  ]
};
