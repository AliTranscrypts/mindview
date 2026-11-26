// SCH4U 36 Quantitative Equilibrium (Keq). Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/36-keq.md
// The hero (three flasks reaching K = 36), the ICE table workbench (Explore: C7 + C8), the colorimetry lab (Part 3),
// the "Solve it" set and the "Same equilibrium, different starts" task are drawn by app.js. Every K here is a model value.

const F = (s) => s.replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>").replace(/\^(\d*)([+-])/g, (m, d, g) => "<sup>" + d + (g === "-" ? "−" : "+") + "</sup>");
const K = "<i>K</i>", Q = "<i>Q</i>", x = "<i>x</i>", y = "<i>y</i>", KP = "<i>K</i><sub>p</sub>", KC = "<i>K</i><sub>c</sub>";
const b = (s, n) => "[" + F(s) + "]" + (n > 1 ? "<sup>" + n + "</sup>" : "");
const P = (s, n) => "<i>P</i>(" + F(s) + ")" + (n > 1 ? "<sup>" + n + "</sup>" : "");
const EQ = (s) => F(s).replace(/<=>/g, "⇌");

// Misconception core sentences (plan §3)
const M1 = "A pure solid or liquid has a fixed concentration, so it’s built into " + K + ". Leave it out.";
const M2 = "Coefficients become <strong>exponents</strong>: 2NH<sub>3</sub> gives " + b("NH3", 2) + ", not 2" + b("NH3") + ".";
const M3 = "If 1 mol of H<sub>2</sub> reacts, 2 mol of HI form: the change for HI is +2" + x + ".";
const M4 = K + " changes only with temperature. Different starts reach different positions with the same " + K + ".";
const M5 = Q + " &lt; " + K + ": too few products, so the reaction shifts right. " + Q + " &gt; " + K + ": it shifts left.";
const M6 = "Check: " + x + " ÷ initial concentration must be under 5%, or solve the full quadratic.";
const M7 = K + " uses <strong>equilibrium</strong> concentrations. Initial values go in the I row.";
const M8 = K + " says where equilibrium lies, not how fast it’s reached.";

const R2X = b("NH3", 2) + " ÷ (" + b("N2") + b("H2", 3) + ")";

export default {
  id:"36-keq",
  kind:"topic",
  title:"Quantitative equilibrium (Keq)",
  topic:"Quantitative Equilibrium (Keq)",
  readyTopic:"quantitative equilibrium",
  hero:{
    eq:'<span class="kq-heq"><span class="nw"><i>a</i>A + <i>b</i>B ⇌ <i>c</i>C + <i>d</i>D</span> <span class="nw">⟶ ' + K + ' = [C]<sup><i>c</i></sup>[D]<sup><i>d</i></sup> ÷ ([A]<sup><i>a</i></sup>[B]<sup><i>b</i></sup>)</span></span>',
    eqSize:"sm",
    eqLabel:"a A plus b B in equilibrium with c C plus d D; K equals the concentration of C to the power c times the concentration of D to the power d, divided by the concentration of A to the power a times the concentration of B to the power b",
    headline:"One number describes every equilibrium mixture",
    text:"At a fixed temperature, every equilibrium mixture of a reaction gives the same value of the <strong>equilibrium constant</strong>, " + K + ". Write it as products over reactants, with <strong>coefficients as exponents</strong>, and leave out pure solids and liquids. Compare the <strong>reaction quotient</strong> " + Q + " with " + K + " to see which way a mixture will go, and use an <strong>ICE table</strong> to find where it ends up.",
    fig:{ html:'<div class="kq-hx"><svg class="kq-hx-svg" id="kq-hx-svg" viewBox="0 0 540 300" role="img" aria-label="Three flasks of hydrogen, iodine and hydrogen iodide start with different mixtures: one with only H₂ and I₂, one with only HI, and one with a mix. Their concentration bars settle to different heights. Under each flask, HI squared divided by H₂ times I₂ is calculated, and all three land on 36."></svg><div class="kq-hx-row"><p class="kq-hx-cap" id="kq-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="kq-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can write " + K + " and " + KP + " expressions, leaving out pure solids and liquids.",
    "I can calculate " + K + " from equilibrium concentrations, interpret its size, and manipulate " + K + " when an equation is reversed, multiplied or added.",
    "I can compare " + Q + " with " + K + " to predict the direction a mixture will shift.",
    "I can use an ICE table to find equilibrium concentrations, including perfect-square cases.",
    "I can decide whether the small-" + x + " approximation is valid using the 5% check.",
    "I can determine " + K + " from experimental data and apply " + K + " to industrial and lab systems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Concentration", goal:4,
          prompt:"0.60 mol of HI is placed in a 2.0 L flask. What is [HI]?",
          options:[
            { t:"0.30 mol/L", ok:true, why:"<i>c</i> = <i>n</i> ÷ <i>V</i> = 0.60 ÷ 2.0." },
            { t:"1.2 mol/L", why:"<i>n</i> × <i>V</i> isn’t a concentration." },
            { t:"0.60 mol/L", why:"Moles per <strong>litre</strong>." },
            { t:"3.3 mol/L", why:"Divide moles by litres, not the reverse." }],
          hints:["Concentration = moles ÷ litres.", "0.60 ÷ 2.0.", "0.30 mol/L."] },
        { id:"w2", skill:"Concentration", goal:6,
          prompt:"Equal volumes of 2.0 × 10⁻³ mol/L " + F("Fe^3+") + " and 2.0 × 10⁻³ mol/L " + F("SCN^-") + " are mixed. What is [" + F("Fe^3+") + "] right after mixing, before any reaction?",
          options:[
            { t:"1.0 × 10⁻³ mol/L", ok:true, why:"Doubling the volume halves the concentration." },
            { t:"2.0 × 10⁻³ mol/L", why:"The total volume doubled." },
            { t:"4.0 × 10⁻³ mol/L", why:"Only one solution contains " + F("Fe^3+") + "." },
            { t:"4.0 × 10⁻⁶ mol/L", why:"Multiplying is for " + K + ", not for dilution." }],
          hints:["What happens to the volume?", "It doubles.", "Half of 2.0 × 10⁻³."] },
        { id:"w3", skill:"Equilibrium ideas", goal:3,
          prompt:"At equilibrium, which statement is true?",
          options:[
            { t:"The forward and reverse rates are equal", ok:true, why:"That’s what makes it dynamic (module 34)." },
            { t:"Reactant and product concentrations are equal", why:"Concentrations are constant, not equal." },
            { t:"The reaction has stopped", why:"Both reactions continue." },
            { t:"Only products are present", why:"Reactants remain too." }],
          hints:["Think of module 34’s two-way traffic.", "Do the reactions stop?", "Rates are equal."] },
        { id:"w4", skill:"Equilibrium ideas", goal:3,
          prompt:"Le Chatelier: adding more reactant to a system at equilibrium makes it…",
          options:[
            { t:"shift toward products", ok:true, why:"It uses up some of the added reactant." },
            { t:"shift toward reactants", why:"The system opposes the change." },
            { t:"stay the same", why:"A stress causes a shift." },
            { t:"change its " + K, why:"Only temperature changes " + K + "." }],
          hints:["The system partly undoes the change.", "Too much reactant → use it up.", "Shift right."] },
        { id:"w5", skill:"Exponents and roots", goal:4,
          prompt:"Solve (2" + x + ")² ÷ (1.00 − " + x + ")² = 36 by taking the square root of both sides first.",
          options:[
            { t:x + " = 0.75", ok:true, why:"2" + x + " ÷ (1.00 − " + x + ") = 6, so 2" + x + " = 6 − 6" + x + " and 8" + x + " = 6." },
            { t:x + " = 3.0", why:"2" + x + " = 6 ignores (1.00 − " + x + ")." },
            { t:x + " = 0.86", why:"The numerator is 2" + x + "." },
            { t:x + " = 18", why:"Take the square root first." }],
          hints:["√36 = 6.", "2" + x + " = 6(1.00 − " + x + ").", x + " = 0.75."] },
        { id:"w6", skill:"Exponents and roots", goal:5,
          prompt:"4" + x + "² = 4.0 × 10⁻⁶. What is " + x + "?",
          options:[
            { t:"1.0 × 10⁻³", ok:true, why:x + "² = 1.0 × 10⁻⁶, so " + x + " = 1.0 × 10⁻³." },
            { t:"1.0 × 10⁻⁶", why:"That’s " + x + "²." },
            { t:"2.0 × 10⁻³", why:"Divide by 4 first." },
            { t:"1.0 × 10⁻¹²", why:"Undo a square with a root." }],
          hints:["Divide both sides by 4.", x + "² = 1.0 × 10⁻⁶.", "√(10⁻⁶) = 10⁻³."] }
      ],
      refreshers:{
        "Concentration":"<i>c</i> = <i>n</i> ÷ <i>V</i>. Mixing equal volumes halves each concentration.",
        "Equilibrium ideas":"At equilibrium the rates are equal and the concentrations stay constant (not equal). A stress shifts the system to partly undo it.",
        "Exponents and roots":"If both sides are perfect squares, take the square root first. For <i>ax</i>² = <i>b</i>, divide first, then root."
      }
    }
  },
  explore:{
    heading:"ICE table workbench",
    intro:"Pick a reaction and a starting mixture. Watch " + Q + " chase " + K + ", build the ICE table, and check whether the shortcut is allowed.",
    how:"Choose a reaction and a mode. <strong>" + K + " from data:</strong> read an equilibrium data set and enter " + K + ". <strong>ICE solver</strong> and <strong>" + Q + " vs " + K + ":</strong> set the starting concentrations, then press <strong>Run to equilibrium</strong>. Sliders take the arrow keys (Shift for bigger steps).",
    reactions:[
      { id:"r1", t:EQ("H2(g) + I2(g) <=> 2HI(g)"), k:K + " = 36 (model)" },
      { id:"r2", t:EQ("N2(g) + 3H2(g) <=> 2NH3(g)"), k:K + " = 0.50 (model)" },
      { id:"r3", t:EQ("X2(g) <=> 2X(g)"), k:K + " = 4.0 × 10⁻⁶ (model)" },
      { id:"r4", t:EQ("CaCO3(s) <=> CaO(s) + CO2(g)"), k:K + " = 0.010 (model)" }
    ],
    modes:[{ id:"data", t:K + " from data" }, { id:"ice", t:"ICE solver" }, { id:"qk", t:Q + " vs " + K }],
    rows:{ expr:K + " expression", q0:Q + " at the start", dir:"Direction", x:x, check5:"5% check", eq:"Equilibrium concentrations", check:"Check" },
    approx:"Use small-" + x + " approximation",
    r4note:"The flask is sealed (1.0 L). CaCO<sub>3</sub>(s) and CaO(s) aren’t graphed: as pure solids, their concentrations don’t change.",
    predIntro:"Each prediction sets up the workbench. Choose an answer, then watch the mixture run to equilibrium.",
    predictions:[
      { id:"p1", prompt:"R1, start [H<sub>2</sub>]<sub>0</sub> = [I<sub>2</sub>]<sub>0</sub> = 1.00 mol/L, no HI. At equilibrium, which concentration will be largest?",
        options:[{ t:"[HI]", ok:true }, { t:"[H<sub>2</sub>]" }, { t:"All three equal" }, { t:"[I<sub>2</sub>]" }],
        explain:K + " = 36 is greater than 1, so products are favoured. The ICE table gives 2" + x + " ÷ (1.00 − " + x + ") = 6, so " + x + " = 0.75 and [HI] = 1.50 mol/L." },
      { id:"p2", prompt:"R1, start with [HI]<sub>0</sub> = 2.00 mol/L only. Compared with P1, the equilibrium concentrations will be…",
        options:[{ t:"the same", ok:true }, { t:"higher in HI" }, { t:"higher in H<sub>2</sub>" }, { t:"undefined, because " + K + " only works forward" }],
        explain:"2.00 mol/L of HI holds the same atoms as 1.00 mol/L each of H<sub>2</sub> and I<sub>2</sub>. Same atoms, same temperature, same equilibrium. " + M4 },
      { id:"p3", prompt:"R1 in " + Q + " vs " + K + " mode: [H<sub>2</sub>] = 0.50, [I<sub>2</sub>] = 0.50, [HI] = 2.00 mol/L. Which way will this mixture shift?",
        options:[{ t:"Right", ok:true }, { t:"Left" }, { t:"No shift" }, { t:"You can’t tell without solving for " + x }],
        explain:Q + " = 4.00 ÷ 0.25 = 16, which is less than 36, so [HI] climbs from 2.00 to 2.25 mol/L. " + Q + " &lt; " + K + " means too few products for equilibrium, so more form." },
      { id:"p4", prompt:"R4 at equilibrium in a sealed flask. Doubling the amount of CaCO<sub>3</sub>(s) does what to [CO<sub>2</sub>] at equilibrium?",
        options:[{ t:"Nothing", ok:true }, { t:"Doubles it" }, { t:"Halves it" }, { t:"Raises it a little" }],
        explain:K + " = [CO<sub>2</sub>]. The solid isn’t in " + K + ", so adding more solid can’t change [CO<sub>2</sub>]. " + M1 }
    ],
    predSetup:{ p1:"R1, ICE solver: 1.00, 1.00 and 0 mol/L.", p2:"R1, ICE solver: HI only, 2.00 mol/L.", p3:"R1, " + Q + " vs " + K + ": 0.50, 0.50 and 2.00 mol/L.", p4:"R4, ICE solver: 10 g, then 20 g, then 40 g of CaCO₃(s)." },
    chalIntro:"Use the workbench to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"In “" + K + " from data” mode, use R2 set 1 ([N<sub>2</sub>] = 0.50, [H<sub>2</sub>] = 1.0, [NH<sub>3</sub>] = 0.50 mol/L) and enter " + K + ".",
        why:K + " = " + R2X + " = 0.50² ÷ (0.50 × 1.0³) = 0.50. Set 2 gives the same " + K + " at a different equilibrium position.",
        hints:["Write " + K + " = " + R2X + ".", "0.50² = 0.25; 0.50 × 1.0³ = 0.50.", "0.25 ÷ 0.50 = 0.50."] },
      { id:"tc2", goal:4, prompt:"In ICE solver mode for R1, start with <strong>no HI</strong> and reach [HI] = 1.50 mol/L at equilibrium.",
        why:"[H<sub>2</sub>]<sub>0</sub> = [I<sub>2</sub>]<sub>0</sub> = 1.00 mol/L: 2" + x + " ÷ (1.00 − " + x + ") = 6 gives " + x + " = 0.75 and [HI] = 1.50 mol/L.",
        hints:["Equal starts keep the algebra a perfect square.", "If [HI] = 2" + x + " = 1.50, then " + x + " = 0.75, and 2" + x + " ÷ (<i>a</i> − " + x + ") = 6.", "1.50 = 6(<i>a</i> − 0.75), so <i>a</i> = 1.00 mol/L."] },
      { id:"tc3", goal:5, stretch:true, prompt:"R3 (" + K + " = 4.0 × 10⁻⁶) with the approximation on. Find the starting [X<sub>2</sub>] for which the shortcut <strong>fails</strong>, then switch it off and read the true [X].",
        why:"At [X<sub>2</sub>]<sub>0</sub> = 1.0 × 10⁻⁶ mol/L the start is about the size of " + K + ", so " + x + " can’t be tiny. Solved exactly, " + x + " = 6.2 × 10⁻⁷ and [X] = 1.2 × 10⁻⁶ mol/L.",
        hints:["The shortcut assumes " + x + " is tiny compared with [X<sub>2</sub>]<sub>0</sub>.", "When [X<sub>2</sub>]<sub>0</sub> is about the same size as " + K + ", " + x + " can’t be tiny.", "Choose 1.0 × 10⁻⁶ and solve exactly: 4" + x + "² = 4.0 × 10⁻⁶(1.0 × 10⁻⁶ − " + x + ") gives " + x + " = 6.2 × 10⁻⁷."] }
    ],
    msgs:{
      tc1:{ where:"Choose R2 (N<sub>2</sub> + 3H<sub>2</sub> ⇌ 2NH<sub>3</sub>) in “" + K + " from data” mode.", empty:"Type your value of " + K + " in the box first.",
        bad:"Enter a number, such as 0.75 or 4.0e-3.", w1:"You ignored the exponents: " + b("NH3", 2) + " and " + b("H2", 3) + ".", w2:"That’s reactants over products, upside down.",
        w067:"You multiplied by the coefficients instead of using them as exponents.", other:"Not quite. Write " + K + " = " + R2X + " and substitute set 1." },
      tc2:{ where:"Choose R1 (H<sub>2</sub> + I<sub>2</sub> ⇌ 2HI) in ICE solver mode.", hi0:"Start with no HI: set [HI]<sub>0</sub> to 0.",
        a1b05:"Too little I<sub>2</sub>: [HI] only reaches 0.91 mol/L.", a075:"[HI] reaches 1.13 mol/L. You need more of both.", reach:"[HI] reaches {v} mol/L, not 1.50." },
      tc3:{ where:"Choose R3 (X<sub>2</sub> ⇌ 2X) in ICE solver mode.", m025:x + " = 5.0 × 10⁻⁴ is 0.2% of 0.25: the shortcut works here.", m4:x + " = 2.0 × 10⁻³, only 0.05%.",
        m1:x + " = 1.0 × 10⁻³, only 0.10% of 1.0: the shortcut works here.",
        stay:"The readout says " + x + " ≈ 1.0 × 10⁻⁶, which is 100% of the start. Switch to the exact solution.",
        first:"First turn the approximation on at this start and read the 5% check." }
    },
    blocks:[
      { title:"The big idea", html:"<p>" + K + " is fixed; the mixture moves until " + Q + " equals it. Coefficients are exponents; solids drop out; the shortcut needs a check.</p>" }
    ]
  },
  part3:{
    slug:"lab-k", name:"Lab K", heading:"Determine " + K + " in the lab",
    intro:"A virtual colorimetry investigation with model data. Turn colour into concentration, then concentrations into " + K + ", and judge the data. The system is " + F("Fe^3+") + "(aq) + " + F("SCN^-") + "(aq) ⇌ " + F("FeSCN^2+") + "(aq). The product is red-orange; the reactants are nearly colourless at these concentrations.",
    note:"Model data. Real values depend on temperature and the other ions in solution.",
    s1:{ title:"Station 1: From colour to concentration",
      intro:"A colorimeter reading is proportional to [" + F("FeSCN^2+") + "]. Calibration (model data): a 1.0 × 10⁻⁴ mol/L standard reads 0.40, so [" + F("FeSCN^2+") + "] = reading ÷ 4000 mol/L. Tap a cuvette to measure it, then convert each reading.",
      std:"Standard (1.0 × 10⁻⁴ mol/L)" },
    s2:{ title:"Station 2: Three trials",
      intro:"Concentrations after mixing (model data). Fill in the equilibrium concentrations and " + K + " for each trial. Each " + F("FeSCN^2+") + " formed used one " + F("Fe^3+") + " and one " + F("SCN^-") + ".",
      head:["Trial", "[" + F("Fe^3+") + "]<sub>0</sub>", "[" + F("SCN^-") + "]<sub>0</sub>", "Reading", "[" + F("FeSCN^2+") + "]<sub>eq</sub>", "[" + F("Fe^3+") + "]<sub>eq</sub>", "[" + F("SCN^-") + "]<sub>eq</sub>", K],
      checkTitle:"Check it with data", message:"Three different starts, one " + K + "." },
    s3:{ title:"Station 3: Judging the inquiry",
      intro:"Tap the <strong>two</strong> most important sources of error in a real version of this lab, then press Check.",
      chips:[
        { id:"temp", t:"Temperature not controlled", need:true, why:K + " depends on temperature, so a drifting temperature changes the very " + K + " you’re measuring." },
        { id:"blank", t:"Colorimeter not zeroed with a blank", need:true, why:"Without a blank, every reading includes the cuvette and the solvent, so every [" + F("FeSCN^2+") + "] comes out too high." },
        { id:"cuv", t:"Using the same cuvette", why:"Using the same cuvette is good practice: it keeps the light path identical for every reading." },
        { id:"vol", t:"Rounding the volumes to the nearest 0.1 mL", why:"A 0.1 mL rounding is tiny compared with the volumes mixed, so its effect is minor." }],
      right:"Right: temperature and the blank matter most.", wrong:"Not quite. Read why each choice matters, then try again." },
    quickCheck:{
      title:"Quick check", summary:"Lab <i>K</i> quick check",
      items:[
        { id:"q1", goal:6, prompt:"In trial 1, why is [" + F("Fe^3+") + "]<sub>eq</sub> = 2.0 × 10⁻³ mol/L?",
          choices:[{ t:"2.2 × 10⁻³ − 2.0 × 10⁻⁴", ok:true, fb:"Right. Each " + F("FeSCN^2+") + " formed used one " + F("Fe^3+") + "." },
            { t:"It’s the initial value", fb:"Each " + F("FeSCN^2+") + " formed used one " + F("Fe^3+") + "." },
            { t:"Half of 4.0 × 10⁻³", fb:"Each " + F("FeSCN^2+") + " formed used one " + F("Fe^3+") + "." },
            { t:"2.0 × 10⁻⁴ × 10", fb:"Each " + F("FeSCN^2+") + " formed used one " + F("Fe^3+") + "." }] },
        { id:"q2", goal:6, prompt:"A reading of 0.60 means [" + F("FeSCN^2+") + "] = ?",
          choices:[{ t:"1.5 × 10⁻⁴", ok:true, fb:"Right. Reading ÷ 4000 = 0.60 ÷ 4000." },
            { t:"2.4 × 10³", fb:"Reading ÷ 4000." }, { t:"6.0 × 10⁻⁴", fb:"Reading ÷ 4000." }, { t:"1.5 × 10⁻³", fb:"Reading ÷ 4000." }] },
        { id:"q3", goal:[2, 6], prompt:"The three trials give the same " + K + ". This shows…",
          choices:[{ t:K + " is constant at a given temperature", ok:true, fb:"Right. Different equilibrium positions, the same " + K + "." },
            { t:"the reactions all stopped", fb:"Different equilibrium positions, the same " + K + ". " + M4 },
            { t:"the concentrations were equal", fb:"Different equilibrium positions, the same " + K + ". " + M4 },
            { t:"the colorimeter was broken", fb:"Different equilibrium positions, the same " + K + ". " + M4 }] },
        { id:"q4", goal:6, prompt:"Repeated at a higher temperature, " + K + " = 125. So the forward reaction is…",
          choices:[{ t:"exothermic", ok:true, fb:"Right. Heating shifted it left (smaller " + K + "), so heat is a product: exothermic." },
            { t:"endothermic", fb:"Heating shifted it left (smaller " + K + "), so heat is a product: exothermic." },
            { t:"not at equilibrium", fb:"Heating shifted it left (smaller " + K + "), so heat is a product: exothermic." },
            { t:"faster", fb:"Heating shifted it left (smaller " + K + "), so heat is a product: exothermic." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Equation ↔ " + K + " expression", summary:"Equation ↔ <i>K</i> expression", goal:1,
        instruction:"Match each equation with its " + K + " expression. Two expressions on the right are traps.",
        leftTitle:"Equation", rightTitle:K + " expression",
        left:[
          { id:"l1", t:EQ("N2(g) + 3H2(g) <=> 2NH3(g)"), why:"Coefficients become exponents." },
          { id:"l2", t:EQ("2SO2(g) + O2(g) <=> 2SO3(g)"), why:"Both 2s become exponents." },
          { id:"l3", t:EQ("CaCO3(s) <=> CaO(s) + CO2(g)"), why:"Both solids drop out, leaving the gas." },
          { id:"l4", t:EQ("CH3COOH(aq) + H2O(l) <=> CH3COO^-(aq) + H3O^+(aq)"), why:"Liquid water is the solvent, so it’s left out.",
            hints:["Which species is a pure liquid?", "H<sub>2</sub>O(l) is left out.", b("CH3COO^-") + b("H3O^+") + " ÷ " + b("CH3COOH") + "."] },
          { id:"l5", t:EQ("AgCl(s) <=> Ag^+(aq) + Cl^-(aq)"), why:"The solid drops out, so there’s no denominator." },
          { id:"l6", t:EQ("2NO2(g) <=> N2O4(g)"), why:"The 2 on NO<sub>2</sub> becomes an exponent." },
          { id:"l7", t:EQ("H2O(l) <=> H2O(g)"), why:"Only the vapour appears." },
          { id:"l8", t:EQ("N2O4(g) <=> 2NO2(g)") + ", written as " + KP, why:KP + " uses partial pressures, with the same exponents." }],
        right:[
          { id:"r1", t:R2X }, { id:"r2", t:b("SO3", 2) + " ÷ (" + b("SO2", 2) + b("O2") + ")" }, { id:"r3", t:b("CO2") },
          { id:"r4", t:b("CH3COO^-") + b("H3O^+") + " ÷ " + b("CH3COOH") }, { id:"r5", t:b("Ag^+") + b("Cl^-") },
          { id:"r6", t:b("N2O4") + " ÷ " + b("NO2", 2) }, { id:"r7", t:"[H<sub>2</sub>O(g)]" }, { id:"r8", t:P("NO2", 2) + " ÷ " + P("N2O4") },
          { id:"x1", t:b("CaO") + b("CO2") + " ÷ " + b("CaCO3") }, { id:"x2", t:b("CH3COO^-") + b("H3O^+") + " ÷ (" + b("CH3COOH") + b("H2O") + ")" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l3|x1":"The solids drop out. " + M1, "l6|r8":"Pair 8 is the reverse reaction, using pressures.", "l8|r6":"Pair 8 is the reverse reaction, using pressures.",
          "l4|x2":"Liquid water is the solvent; it’s left out. " + M1, "l5|x1":"Pure solids drop out of every " + K + " expression." },
        wrongDefault:"Products on top, coefficients as exponents, solids and liquids out." },
      { id:"solve", type:"custom", title:"Solve it", summary:"Solve it", star:true, goal:[2, 3, 4, 5],
        instruction:"Six problems. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type each answer and press <strong>Check</strong>. Scientific notation is fine: 4.0e-3 or 4.0 × 10^-3.",
        items:[
          { id:"s1", goal:2, prompt:"H<sub>2</sub> + I<sub>2</sub> ⇌ 2HI at equilibrium: [H<sub>2</sub>] = [I<sub>2</sub>] = 0.20, [HI] = 1.20 mol/L. Find " + K + ".",
            parts:[{ label:K + " =" }], answer:[36], why:K + " = 1.20² ÷ (0.20 × 0.20) = 1.44 ÷ 0.040 = 36.",
            wrong:[{ part:0, match:30, fb:"Square [HI]. " + M2 }],
            hints:["Write " + K + " = " + b("HI", 2) + " ÷ (" + b("H2") + b("I2") + ").", "1.20² = 1.44; 0.20 × 0.20 = 0.040.", "1.44 ÷ 0.040 = 36."] },
          { id:"s2", goal:3, prompt:"CO(g) + H<sub>2</sub>O(g) ⇌ CO<sub>2</sub>(g) + H<sub>2</sub>(g), " + K + " = 9.0 (model). All four at 1.0 mol/L. Find " + Q + " and the direction.",
            parts:[{ label:Q + " =" }], answer:[1.0],
            choice:{ label:"Direction", options:[{ t:"Shifts right", ok:true }, { t:"Shifts left", why:Q + " &lt; " + K + " means too few products." }, { t:"No shift", why:Q + " = 1.0 isn’t equal to " + K + " = 9.0." }] },
            why:Q + " = (1.0 × 1.0) ÷ (1.0 × 1.0) = 1.0, which is less than 9.0, so the mixture shifts right.",
            hints:["" + Q + " has the same form as " + K + ", with the current concentrations.", Q + " = (1.0 × 1.0) ÷ (1.0 × 1.0).", Q + " = 1.0 &lt; 9.0: shifts right."] },
          { id:"s3", star:true, goal:4, prompt:"Same reaction (" + K + " = 9.0), start [CO] = [H<sub>2</sub>O] = 1.00 mol/L, no products. Find [CO<sub>2</sub>]<sub>eq</sub>.",
            parts:[{ label:"[CO<sub>2</sub>]<sub>eq</sub> =", unit:"mol/L" }], answer:[0.75], why:x + "² ÷ (1.00 − " + x + ")² = 9.0, so " + x + " ÷ (1.00 − " + x + ") = 3, 4" + x + " = 3 and " + x + " = 0.75 mol/L.",
            wrong:[{ part:0, match:0.9, fb:"√9 = 3, so " + x + " ÷ (1.00 − " + x + ") = 3." }],
            hints:["Both sides are perfect squares.", x + " ÷ (1.00 − " + x + ") = 3.", "4" + x + " = 3, so " + x + " = 0.75 mol/L."] },
          { id:"s4", star:true, goal:2, prompt:"A ⇌ B, " + K + "<sub>1</sub> = 4.0; B ⇌ C, " + K + "<sub>2</sub> = 0.50. Find " + K + " for 2C ⇌ 2A.",
            parts:[{ label:K + " =" }], answer:[0.25], why:"A ⇌ C has " + K + " = 4.0 × 0.50 = 2.0. Reversing gives 1 ÷ 2.0 = 0.50; doubling squares it: 0.50² = 0.25.",
            wrong:[{ part:0, match:4, fb:"Reverse (1 ÷ 2.0 = 0.50), then square." }, { part:0, match:0.5, fb:"You reversed but didn’t square." }],
            hints:["Add the two equations first: A ⇌ C has " + K + " = 2.0.", "Reversing gives 1 ÷ 2.0.", "Doubling squares it: 0.50² = 0.25."] },
          { id:"s5", star:true, goal:5, prompt:"X<sub>2</sub> ⇌ 2X, " + K + " = 4.0 × 10⁻⁶, [X<sub>2</sub>]<sub>0</sub> = 4.0 mol/L. Find [X]<sub>eq</sub> and do the 5% check.",
            parts:[{ label:"[X]<sub>eq</sub> =", unit:"mol/L" }, { label:x + " ÷ 4.0 as a percentage =", unit:"%" }], answer:[4.0e-3, 0.05],
            why:"(2" + x + ")² ÷ 4.0 ≈ 4.0 × 10⁻⁶ gives " + x + " = 2.0 × 10⁻³, so [X] = 2" + x + " = 4.0 × 10⁻³ mol/L. " + x + " is 0.05% of 4.0, well under 5%, so the shortcut is valid.",
            wrong:[{ part:0, match:2.0e-3, fb:"That’s " + x + "; [X] = 2" + x + ". " + M3 }, { part:1, match:0.1, fb:"Use " + x + " (2.0 × 10⁻³), not [X], for the 5% check." }],
            hints:["Assume 4.0 − " + x + " ≈ 4.0: 4" + x + "² = 4.0 × 4.0 × 10⁻⁶.", x + " = 2.0 × 10⁻³, so [X] = 2" + x + ".", "[X] = 4.0 × 10⁻³ mol/L; 2.0 × 10⁻³ ÷ 4.0 = 0.05%."] },
          { id:"s6", star:true, goal:4, prompt:"A 1.00 L flask starts with 0.40 mol HI only (" + K + " = 36 for H<sub>2</sub> + I<sub>2</sub> ⇌ 2HI). Find [H<sub>2</sub>]<sub>eq</sub>.",
            parts:[{ label:"[H<sub>2</sub>]<sub>eq</sub> =", unit:"mol/L" }], answer:[0.05], why:"(0.40 − 2" + y + ") ÷ " + y + " = 6, so 0.40 = 8" + y + " and " + y + " = [H<sub>2</sub>] = 0.050 mol/L.",
            wrong:[{ part:0, match:0.4 / 36, fb:"Set up the ICE table for the reverse direction." }, { part:0, match:0.2, fb:"That assumes all the HI decomposes." }],
            hints:["HI decomposes: [HI] = 0.40 − 2" + y + ", [H<sub>2</sub>] = [I<sub>2</sub>] = " + y + ".", "(0.40 − 2" + y + ")² ÷ " + y + "² = 36, so (0.40 − 2" + y + ") ÷ " + y + " = 6.", "0.40 = 8" + y + ", so " + y + " = 0.050 mol/L."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Tamsin", goal:[1, 4, 5],
        instruction:"Tamsin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Write " + K + " for " + EQ("2H2(g) + O2(g) <=> 2H2O(l)") + ".",
            steps:[K + " is products over reactants.", "The product is H<sub>2</sub>O(l), so the numerator is " + b("H2O", 2) + ".", K + " = " + b("H2O", 2) + " ÷ (" + b("H2", 2) + b("O2") + ")."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Liquid water is left out, so " + K + " = 1 ÷ (" + b("H2", 2) + b("O2") + ").", ok:true, why:M1 },
              { t:"The numerator is 2" + b("H2O") + ".", why:"Coefficients are exponents, and the liquid is left out anyway." },
              { t:"Leave out O<sub>2</sub> instead.", why:"O<sub>2</sub> is a gas; it stays." },
              { t:"Step 2 is correct.", why:"A pure liquid’s concentration is constant. " + M1 }],
            hints:["Which species is a pure liquid?", "H<sub>2</sub>O(l).", K + " = 1 ÷ (" + b("H2", 2) + b("O2") + ")."] },
          { id:"e2", goal:4, task:"N<sub>2</sub> + 3H<sub>2</sub> ⇌ 2NH<sub>3</sub>; start [N<sub>2</sub>] = 1.0, [H<sub>2</sub>] = 3.0 mol/L. Set up the ICE table.",
            steps:["I: 1.0, 3.0, 0.", "C: −" + x + ", −" + x + ", +" + x + ".", "E: 1.0 − " + x + ", 3.0 − " + x + ", " + x + ".", K + " = " + x + "² ÷ ((1.0 − " + x + ")(3.0 − " + x + ")³)."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier.", "Step 4 uses step 3’s rows."],
            fixes:[
              { t:"C: −" + x + ", −3" + x + ", +2" + x + ", following the coefficients.", ok:true, why:"For every N<sub>2</sub> used, 3 H<sub>2</sub> are used and 2 NH<sub>3</sub> form." },
              { t:"C: +" + x + ", +3" + x + ", −2" + x + ".", why:"That’s a shift left; the flask starts with no NH<sub>3</sub>." },
              { t:"C: −1, −3, +2.", why:"Changes need " + x + "." },
              { t:"Step 2 is correct.", why:"The change row must follow the coefficients: 1, 3 and 2." }],
            hints:["For every 1 N<sub>2</sub> used, how many H<sub>2</sub>?", "3.", "−" + x + ", −3" + x + ", +2" + x + "."] },
          { id:"e3", goal:5, task:"A(g) ⇌ B(g) + C(g), " + K + " = 0.010, [A]<sub>0</sub> = 0.10 mol/L. Find [B]<sub>eq</sub>.",
            steps:[x + "² ÷ (0.10 − " + x + ") = 0.010.", "Assume 0.10 − " + x + " ≈ 0.10: " + x + "² = 1.0 × 10⁻³, so " + x + " = 0.032.", "So [B] = 0.032 mol/L."],
            answer:2,
            stepFb:["Step 1 is correct.", "Trying the shortcut is fine. What must come next?", ""],
            fixes:[
              { t:"First check: 0.032 ÷ 0.10 = 32%, more than 5%. Solve " + x + "² + 0.010" + x + " − 0.0010 = 0 instead: " + x + " = 0.027 mol/L.", ok:true, why:"The 5% check fails, so the full quadratic gives [B] = 0.027 mol/L." },
              { t:"[B] = 2" + x + " = 0.064.", why:"Only one B forms per A." },
              { t:"The shortcut is always fine when " + K + " &lt; 1.", why:M6 },
              { t:"Step 3 is correct.", why:"The shortcut was never checked. " + M6 }],
            hints:["What check must follow the shortcut?", x + " ÷ 0.10 = ?", "32% fails; the quadratic gives 0.027."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which reveal surprised you most: P2 (starting from HI gave the same mixture) or P4 (adding solid changed nothing)? Why?" },
      { id:"j2", q:"In your own words, explain why " + K + " stays the same while " + Q + " changes." },
      { id:"j3", q:"Explain to a friend how to set up an ICE table, using N<sub>2</sub> + 3H<sub>2</sub> ⇌ 2NH<sub>3</sub> as your example." },
      { id:"j4", q:"When will you trust the small-" + x + " shortcut? Which step still slows you down, and what will you do about it?" }
    ]
  },
  final:{
    intro:"Ten questions, no hints. " + K + " values marked “model” are invented for the question.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is " + K + " for " + EQ("2SO2(g) + O2(g) <=> 2SO3(g)") + "?", options:[
          { t:b("SO3", 2) + " ÷ (" + b("SO2", 2) + b("O2") + ")", ok:true, why:"Coefficients become exponents." },
          { t:b("SO3") + " ÷ (" + b("SO2") + b("O2") + ")", why:"The 2s must be exponents. " + M2 },
          { t:"2" + b("SO3") + " ÷ (2" + b("SO2") + b("O2") + ")", why:"Coefficients aren’t multipliers. " + M2 },
          { t:b("SO2", 2) + b("O2") + " ÷ " + b("SO3", 2), why:"That’s upside down: products go on top." }] },
        b:{ prompt:"Which is " + K + " for " + EQ("Fe2O3(s) + 3CO(g) <=> 2Fe(s) + 3CO2(g)") + "?", options:[
          { t:b("CO2", 3) + " ÷ " + b("CO", 3), ok:true, why:"Both solids drop out." },
          { t:b("Fe", 2) + b("CO2", 3) + " ÷ (" + b("Fe2O3") + b("CO", 3) + ")", why:"Pure solids are left out. " + M1 },
          { t:b("CO2") + " ÷ " + b("CO"), why:"The 3s must be exponents. " + M2 },
          { t:b("CO", 3) + " ÷ " + b("CO2", 3), why:"Upside down." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A reaction has " + K + " = 2.5 × 10⁻¹⁰ at 25 °C. What does this tell you?", options:[
          { t:"At equilibrium the mixture is mostly reactants", ok:true, why:K + " ≪ 1." },
          { t:"At equilibrium the mixture is mostly products", why:"A negative exponent makes " + K + " tiny, not large." },
          { t:"The reaction is very slow", why:K + " says nothing about speed. " + M8 },
          { t:"Reactants and products are present in equal amounts", why:"That would need " + K + " near 1, and even then amounts needn’t be equal." }] },
        b:{ prompt:"A reaction has " + K + " = 6.0 × 10⁸ at 25 °C. What does this tell you?", options:[
          { t:"At equilibrium the mixture is mostly products", ok:true, why:K + " ≫ 1." },
          { t:"At equilibrium the mixture is mostly reactants", why:"A large " + K + " favours products." },
          { t:"The reaction is very fast", why:M8 },
          { t:"The reaction can’t reach equilibrium", why:"Every reaction in a closed system can." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which is " + KP + " for " + EQ("N2(g) + 3H2(g) <=> 2NH3(g)") + "?", options:[
          { t:P("NH3", 2) + " ÷ (" + P("N2") + " · " + P("H2", 3) + ")", ok:true, why:KP + " uses partial pressures, with the same exponents." },
          { t:R2X, why:"That’s " + KC + ", written with concentrations." },
          { t:P("NH3") + " ÷ (" + P("N2") + " · " + P("H2") + ")", why:M2 },
          { t:P("N2") + " · " + P("H2", 3) + " ÷ " + P("NH3", 2), why:"Upside down." }] },
        b:{ prompt:"Which is " + KP + " for " + EQ("CaCO3(s) <=> CaO(s) + CO2(g)") + "?", options:[
          { t:KP + " = " + P("CO2"), ok:true, why:"Only the gas appears." },
          { t:P("CaO") + " · " + P("CO2") + " ÷ " + P("CaCO3"), why:M1 },
          { t:"1 ÷ " + P("CO2"), why:"CO<sub>2</sub> is a product, so it goes on top." },
          { t:KP + " = " + b("CO2"), why:"That’s " + KC + "." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:EQ("H2(g) + I2(g) <=> 2HI(g)") + ", " + K + " = 36 (model). A flask starts with [H<sub>2</sub>] = [I<sub>2</sub>] = 0.50 mol/L and no HI. Find [HI] at equilibrium.", options:[
          { t:"0.75 mol/L", ok:true, why:"2" + x + " ÷ (0.50 − " + x + ") = 6, so 8" + x + " = 3.0, " + x + " = 0.375 and [HI] = 2" + x + " = 0.75." },
          { t:"0.38 mol/L", why:"That’s " + x + "; [HI] = 2" + x + ". " + M3 },
          { t:"0.43 mol/L", why:"You wrote +" + x + " for HI; the change is +2" + x + ". " + M3 },
          { t:"3.0 mol/L", why:"You put initial values into " + K + ": 6 × 0.50. Use the ICE table. " + M7 }] },
        b:{ prompt:EQ("CO(g) + H2O(g) <=> CO2(g) + H2(g)") + ", " + K + " = 9.0 (model). A flask starts with [CO] = [H<sub>2</sub>O] = 0.40 mol/L, no products. Find [CO<sub>2</sub>] at equilibrium.", options:[
          { t:"0.30 mol/L", ok:true, why:x + " ÷ (0.40 − " + x + ") = 3, so 4" + x + " = 1.2 and " + x + " = 0.30." },
          { t:"0.10 mol/L", why:"That’s [CO] at equilibrium: 0.40 − 0.30." },
          { t:"0.20 mol/L", why:"Splitting evenly assumes " + K + " = 1." },
          { t:"1.2 mol/L", why:"3 × 0.40 uses initial values. Solve the ICE table. " + M7 }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:EQ("2SO2(g) + O2(g) <=> 2SO3(g)") + ", " + K + " = 4.0 (model). A mixture has [SO<sub>2</sub>] = 0.50, [O<sub>2</sub>] = 0.50, [SO<sub>3</sub>] = 1.0 mol/L. What happens?", options:[
          { t:"It shifts left, because " + Q + " = 8.0 is greater than " + K, ok:true, why:Q + " = 1.0² ÷ (0.50² × 0.50) = 8.0." },
          { t:"It shifts right, because " + Q + " = 8.0 is greater than " + K, why:Q + " &gt; " + K + " means too many products. " + M5 },
          { t:"It’s already at equilibrium, because " + Q + " = 4.0", why:"You dropped the exponents: " + b("SO3", 2) + " and " + b("SO2", 2) + "." },
          { t:"It shifts right, because " + Q + " = 0.13 is less than " + K, why:"That " + Q + " is upside down." }] },
        b:{ prompt:EQ("N2(g) + 3H2(g) <=> 2NH3(g)") + ", " + K + " = 0.50 (model). A mixture has [N<sub>2</sub>] = 1.0, [H<sub>2</sub>] = 1.0, [NH<sub>3</sub>] = 0.50 mol/L. What happens?", options:[
          { t:"It shifts right, because " + Q + " = 0.25 is less than " + K, ok:true, why:Q + " = 0.50² ÷ (1.0 × 1.0³) = 0.25." },
          { t:"It shifts left, because " + Q + " = 0.25 is less than " + K, why:M5 },
          { t:"It’s already at equilibrium, because " + Q + " = 0.50", why:b("NH3") + " must be squared." },
          { t:"It shifts left, because " + Q + " = 4.0 is greater than " + K, why:"That " + Q + " is upside down." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"At one temperature (model values): " + EQ("N2(g) + O2(g) <=> 2NO(g)") + ", " + K + "<sub>1</sub> = 1.0 × 10⁻³⁰; " + EQ("2NO(g) + O2(g) <=> 2NO2(g)") + ", " + K + "<sub>2</sub> = 4.0 × 10¹². What is " + K + " for " + EQ("N2(g) + 2O2(g) <=> 2NO2(g)") + "?", options:[
          { t:"4.0 × 10⁻¹⁸", ok:true, why:"Adding equations multiplies " + K + " values: " + K + "<sub>1</sub> × " + K + "<sub>2</sub>." },
          { t:"4.0 × 10¹²", why:"Adding " + K + " values isn’t the rule; the tiny " + K + "<sub>1</sub> disappears that way." },
          { t:"4.0 × 10⁴²", why:"That’s " + K + "<sub>2</sub> ÷ " + K + "<sub>1</sub>." },
          { t:"2.5 × 10⁻⁴³", why:"That’s " + K + "<sub>1</sub> ÷ " + K + "<sub>2</sub>." }] },
        b:{ prompt:EQ("A(g) <=> 2B(g)") + " has " + K + " = 0.25 (model). What is " + K + " for " + EQ("4B(g) <=> 2A(g)") + "?", options:[
          { t:"16", ok:true, why:"Reverse: 1 ÷ 0.25 = 4. Double the coefficients: 4² = 16." },
          { t:"0.0625", why:"You squared without reversing." },
          { t:"8.0", why:"Doubling coefficients squares " + K + "; it doesn’t double it." },
          { t:"−0.25", why:"Reversing gives the reciprocal, not a negative." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why CaCO<sub>3</sub>(s) doesn’t appear in " + K + " for " + EQ("CaCO3(s) <=> CaO(s) + CO2(g)") + "?", options:[
          { t:"“A pure solid’s concentration (its own density ÷ molar mass) stays constant as it reacts, so that constant is folded into " + K + ".”", ok:true, why:"The solid’s concentration never changes, so it becomes part of " + K + "." },
          { t:"“Solids don’t take part in the reaction.”", why:"CaCO<sub>3</sub> does react; it decomposes." },
          { t:"“Its coefficient is 1, so it cancels.”", why:"A coefficient of 1 still leaves [CaCO<sub>3</sub>] in the expression." },
          { t:"“Solids are always too small to measure.”", why:"Amount isn’t the issue; concentration doesn’t change." }] },
        b:{ prompt:"Which is the best explanation of why H<sub>2</sub>O(l) is left out of " + K + " for " + EQ("CH3COOH(aq) + H2O(l) <=> CH3COO^-(aq) + H3O^+(aq)") + "?", options:[
          { t:"“Water is the solvent, a nearly pure liquid; its concentration barely changes, so it’s built into " + K + ".”", ok:true, why:"The solvent’s concentration is effectively constant." },
          { t:"“Water isn’t a reactant.”", why:"It donates nothing here, but it accepts a proton: it’s a reactant." },
          { t:"“Water is neutral.”", why:"Charge isn’t the reason." },
          { t:"“Only ions appear in " + K + ".”", why:"CH<sub>3</sub>COOH is a molecule, and it appears." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A student solves " + x + "² ÷ (0.20 − " + x + ") = 1.8 × 10⁻⁵ by assuming 0.20 − " + x + " ≈ 0.20 and gets " + x + " = 1.9 × 10⁻³. Which is the clearest justification?", options:[
          { t:"“" + x + " ÷ 0.20 ≈ 0.95%, which is under 5%, so ignoring " + x + " in the denominator changes the answer very little.”", ok:true, why:"The 5% check is the justification." },
          { t:"“" + K + " is small, so the shortcut always works.”", why:"Small " + K + " helps, but the check decides. " + M6 },
          { t:"“" + x + " is less than 1, so it can be ignored.”", why:"Compare " + x + " with 0.20, not with 1." },
          { t:"“The answer has two significant figures.”", why:"Sig figs don’t justify the shortcut." }] },
        b:{ prompt:"A student approximates " + x + "² ÷ (0.010 − " + x + ") = 1.0 × 10⁻³ and gets " + x + " = 3.2 × 10⁻³. Which statement is correct?", options:[
          { t:"“The shortcut isn’t valid: " + x + " is 32% of 0.010, more than 5%, so the full quadratic is needed.”", ok:true, why:"32% fails the 5% check." },
          { t:"“It’s valid because " + K + " &lt; 1.”", why:M6 },
          { t:"“It’s valid because " + x + " is smaller than 0.010.”", why:"Smaller isn’t enough; it must be under 5% of it." },
          { t:"“It’s invalid because " + K + " must be below 10⁻⁵.”", why:"There’s no such rule; use the 5% check." }] } },
      { id:"a1", cat:"A", goal:[2, 6],
        a:{ prompt:"Methanol is made by " + EQ("CO(g) + 2H2(g) <=> CH3OH(g)") + ". In one reactor (model data) the equilibrium concentrations are [CO] = 0.20, [H<sub>2</sub>] = 0.50, [CH<sub>3</sub>OH] = 0.10 mol/L. Find " + K + ".", options:[
          { t:"2.0", ok:true, why:"0.10 ÷ (0.20 × 0.50²) = 0.10 ÷ 0.050." },
          { t:"1.0", why:"[H<sub>2</sub>] must be squared. " + M2 },
          { t:"0.50", why:"That’s reactants over products." },
          { t:"5.0", why:"You squared [CO] instead of [H<sub>2</sub>]." }] },
        b:{ prompt:"In an ammonia plant model, equilibrium concentrations are [N<sub>2</sub>] = 0.40, [H<sub>2</sub>] = 1.0, [NH<sub>3</sub>] = 0.20 mol/L. Find " + K + " for " + EQ("N2(g) + 3H2(g) <=> 2NH3(g)") + ".", options:[
          { t:"0.10", ok:true, why:"0.20² ÷ (0.40 × 1.0³) = 0.040 ÷ 0.40." },
          { t:"0.50", why:"Square [NH<sub>3</sub>]. " + M2 },
          { t:"10", why:"Upside down." },
          { t:"0.25", why:"You squared [N<sub>2</sub>] instead of [NH<sub>3</sub>]." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"In the iron(III) thiocyanate lab, " + K + " = 250 (model). A mixture at equilibrium has [" + F("Fe^3+") + "] = 2.0 × 10⁻³ and [" + F("SCN^-") + "] = 1.0 × 10⁻⁴ mol/L. What [" + F("FeSCN^2+") + "] should the colorimeter show?", options:[
          { t:"5.0 × 10⁻⁵ mol/L", ok:true, why:"[" + F("FeSCN^2+") + "] = " + K + "[" + F("Fe^3+") + "][" + F("SCN^-") + "] = 250 × 2.0 × 10⁻⁷." },
          { t:"2.0 × 10⁻⁷ mol/L", why:"You forgot to multiply by " + K + "." },
          { t:"8.0 × 10⁻¹⁰ mol/L", why:"You divided by " + K + ": the expression was used upside down." },
          { t:"5.3 × 10⁻¹ mol/L", why:"You added the concentrations before multiplying." }] },
        b:{ prompt:"At a higher temperature the same lab gives " + K + " = 125 (model). An equilibrium mixture has [" + F("Fe^3+") + "] = 1.0 × 10⁻³ and [" + F("SCN^-") + "] = 4.0 × 10⁻⁴ mol/L. Which is correct?", options:[
          { t:"[" + F("FeSCN^2+") + "] = 5.0 × 10⁻⁵ mol/L, and the forward reaction is exothermic", ok:true, why:"125 × 4.0 × 10⁻⁷; " + K + " fell on heating, so heat is a product." },
          { t:"[" + F("FeSCN^2+") + "] = 5.0 × 10⁻⁵ mol/L, and the forward reaction is endothermic", why:"A smaller " + K + " at higher temperature means exothermic." },
          { t:"[" + F("FeSCN^2+") + "] = 1.0 × 10⁻⁴ mol/L, and the forward reaction is exothermic", why:"That used the old " + K + " of 250." },
          { t:"[" + F("FeSCN^2+") + "] = 3.2 × 10⁻⁹ mol/L, and the forward reaction is exothermic", why:"You divided by " + K + "." }] } }
    ]
  },
  task:{
    title:"Same equilibrium, different starts", summary:"Same equilibrium, different starts",
    statement:"<p>For " + EQ("H2(g) + I2(g) <=> 2HI(g)") + " with " + K + " = 36 (model), design a starting mixture that meets every condition. Can you find all the answers?</p><ol class=\"kq-conds\"><li>The mixture is not at equilibrium when it starts.</li><li>The reaction runs forward (to the right) to reach equilibrium.</li><li>At equilibrium, [HI] = 1.50 mol/L.</li></ol>",
    inputs:{ h:"[H<sub>2</sub>]<sub>0</sub>", i:"[I<sub>2</sub>]<sub>0</sub>", hi:"[HI]<sub>0</sub>" },
    checks:["Not at equilibrium yet", "Runs forward", "[HI] = 1.50 mol/L at equilibrium"],
    tips:["Compute " + Q + " = [HI]<sub>0</sub>² ÷ ([H<sub>2</sub>]<sub>0</sub>[I<sub>2</sub>]<sub>0</sub>). If it equals 36, nothing happens.",
      "For a forward shift you need " + Q + " &lt; 36: fewer products than equilibrium needs.",
      "Every start that holds the same atoms as 1.00 mol/L each of H<sub>2</sub> and I<sub>2</sub> ends at [HI] = 1.50. Try trading H<sub>2</sub> and I<sub>2</sub> for HI: two HI for each H<sub>2</sub> + I<sub>2</sub>."],
    explainPrompt:"Explain why all your answers reach the same equilibrium, and how you made sure the reaction runs forward.",
    vocab:"Use the words reaction quotient, equilibrium constant, ICE table and shift.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each has [H<sub>2</sub>]<sub>0</sub> + ½[HI]<sub>0</sub> = 1.00, so each holds the same atoms. The starts (0.25, 0.25, 1.50) and (0, 0, 2.00) hold the same atoms too, but one is already at equilibrium (" + Q + " = 36) and the other runs backward."
  },
  cards:[
    [K + " expression", "Products over reactants, each raised to its coefficient: " + K + " = [C]<sup><i>c</i></sup>[D]<sup><i>d</i></sup> ÷ ([A]<sup><i>a</i></sup>[B]<sup><i>b</i></sup>)."],
    ["Solids and liquids", "Pure solids and liquids are left out of " + K + "."],
    ["What changes " + K + "?", "Only temperature."],
    [K + " ≫ 1 / " + K + " ≪ 1", "Mostly products / mostly reactants. Nothing about speed."],
    ["Reaction quotient " + Q, "Same form as " + K + ", using the current concentrations."],
    [Q + " &lt; " + K + " / " + Q + " &gt; " + K, "Shifts right / shifts left."],
    ["ICE table", "Initial, Change (follows coefficients), Equilibrium."],
    ["Perfect-square case", "Take the square root of both sides first: (2" + x + ")² ÷ (1 − " + x + ")² = 36 → 2" + x + " ÷ (1 − " + x + ") = 6."],
    ["Small-" + x + " shortcut", "Assume initial − " + x + " ≈ initial, then check " + x + " ÷ initial &lt; 5%."],
    ["Manipulating " + K, "Reverse → 1/" + K + "; multiply by <i>n</i> → " + K + "<sup><i>n</i></sup>; add equations → multiply " + K + " values."],
    [KP, "The same expression with partial pressures: " + KP + " = " + P("NO2", 2) + " ÷ " + P("N2O4") + "."],
    ["Lab " + K, "Measure one equilibrium concentration (colour), use an ICE table for the rest, and average several trials."]
  ]
};
