// MCV4U 18 Economics and Science Optimization Problems. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/18-economics-and-science-optimization.md
// Upright d for d/dp (as in MCV4U 07/10/11/14)
const DDP = '<span class="m">d/d<i>p</i></span>';
// misconception core sentences (plan §3)
const M1 = "Revenue ignores cost. At $25 each extra sale costs $10 to make, so a higher price, fewer sales and lower costs give more profit.";
const M3 = "A fixed cost subtracts the same amount at every price: the peak moves down, not sideways.";
const M5 = "`k/x = kx^{-1}`, so its derivative is `-k/x^2`.";
const M6 = "Trip cost = hours × cost per hour, and hours = distance ÷ speed.";
const M8 = "`R′ = C′` means the <strong>next</strong> item adds no profit: profit is at its peak there, not zero.";
const HERO_EQ = "`P(x) = R(x) - C(x)` <span class=\"ec-heq-a\">⟶</span> `P′(x) = 0` <span class=\"ec-heq-a\">⟺</span> `R′(x) = C′(x)`";

export default {
  id:"18-economics-and-science-optimization",
  kind:"topic",
  title:"Economics and science optimization problems",
  topic:"Economics and Science Optimization Problems",
  readyTopic:"economics and science optimization problems",
  hero:{
    eq:HERO_EQ,
    eqLabel:"P of x equals R of x minus C of x; so P prime of x equals 0 exactly when R prime of x equals C prime of x",
    eqSize:"sm",
    headline:"The best price isn’t the one that sells the most",
    text:"A <strong>demand function</strong> says how many items sell at each price. <strong>Revenue</strong> is price times quantity, and <strong>profit</strong> is revenue minus <strong>cost</strong>. Profit peaks where <strong>marginal revenue</strong> (what one more sale brings in) equals <strong>marginal cost</strong> (what one more item costs to make).",
    fig:{ html:'<div class="ec-hero"><div class="ec-hstrip" aria-hidden="true"><div class="ec-hoodie-box" id="ec-hoodie"></div><div class="ec-crowd-box"><div class="ec-crowd" id="ec-crowd"></div><p class="ec-crowd-n" id="ec-crowd-n"></p></div></div>' +
      '<canvas class="plot" id="hero-plot" role="img" aria-label="Revenue and profit against the price of a hoodie, from $10 to $50. Revenue peaks at $25; profit peaks further right, at $30."></canvas></div>' }
  },
  goals:[
    "I can interpret marginal cost and marginal revenue as rates and as “the cost (or revenue) of one more item”.",
    "I can build revenue, cost and profit functions from a demand function and a cost rule.",
    "I can explain why profit is greatest where marginal revenue equals marginal cost, and why it differs from the revenue maximum.",
    "I can solve revenue and profit problems, including “each $1 increase loses … customers”.",
    "I can minimize average cost and trip cost using simple rational models.",
    "I can solve and interpret a science or economics optimization problem in context, with units."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Revenue", goal:2, prompt:"A café sells `x` muffins a day at `p = 5 - 0.01x` dollars each. Which is the daily revenue?",
          options:[
            { t:"`R = x(5 - 0.01x)`", ok:true, why:"Revenue = quantity × price." },
            { t:"`R = 5 - 0.01x`", why:"Multiply by the number sold." },
            { t:"`R = 5x`", why:"The price depends on `x`." },
            { t:"`R = x + (5 - 0.01x)`", why:"Revenue multiplies the number sold by the price; it doesn’t add them." }],
          hints:["What is revenue?", "Number sold × price each.", "`x(5 - 0.01x)`."] },
        { id:"w2", skill:"Revenue", goal:4, prompt:"A gym has 300 members paying $40 a month. Each $1 increase loses 5 members. After `n` increases, what is the revenue?",
          options:[
            { t:"`(40 + n)(300 - 5n)`", ok:true, why:"New price × new membership." },
            { t:"`(40 - n)(300 + 5n)`", why:"The price goes up by `n` dollars and the membership goes down by `5n`." },
            { t:"`40(300 - 5n)`", why:"The price rises too: it’s `40 + n` after `n` increases." },
            { t:"`(40 + n)(300 - n)`", why:"Each increase loses 5, so `5n`." }],
          hints:["What’s the price after `n` increases?", "`40 + n`; members `300 - 5n`.", "Multiply."] },
        { id:"w3", skill:"Derivative of k/x", goal:5, prompt:"What is the derivative of `A(x) = x + 400/x`?",
          options:[
            { t:"`1 - 400/x^2`", ok:true, why:"`400/x = 400x^{-1} -> -400x^{-2}`." },
            { t:"`1 + 400/x^2`", why:M5 },
            { t:"`1 - 400/x`", why:"The exponent drops to −2." },
            { t:"`1 - 400`", why:"Rewrite as a power first." }],
          hints:["Write `400/x` as `400x^{-1}`.", "Bring down −1.", "`1 - 400/x^2`."] },
        { id:"w4", skill:"Derivative of k/x", goal:5, prompt:"Solve `1 - 400/x^2 = 0` for `x > 0`.",
          options:[
            { t:"`x = 20`", ok:true, why:"`x^2 = 400`." },
            { t:"`x = 400`", why:"Take the square root." },
            { t:"`x = 200`", why:"`x^2 = 400`." },
            { t:"`x = ±20`", why:"The question asks for `x > 0`, so only 20 counts." }],
          hints:["Move the fraction across.", "`x^2 = 400`.", "`x = 20`."] },
        { id:"w5", skill:"Quadratic maximum", goal:4, prompt:"For `R(p) = 200p - 4p^2`, which price gives the most revenue?",
          options:[
            { t:"$25", ok:true, why:"`R′ = 200 - 8p = 0`." },
            { t:"$50", why:"`R(50) = 0`." },
            { t:"$100", why:DDP + " (`4p^2`) `= 8p`." },
            { t:"$2500", why:"$2500 is the revenue at the best price; the question asks for the price." }],
          hints:["Differentiate.", "`200 - 8p = 0`.", "`p = 25`."] },
        { id:"w6", skill:"Quadratic maximum", goal:3, prompt:"`P(x) = 40x - x^2 - 300`. What is the maximum profit?",
          options:[
            { t:"$100", ok:true, why:"`P′ = 40 - 2x = 0` at `x = 20`; `P(20) = 800 - 400 - 300`." },
            { t:"$400", why:"Subtract the $300 fixed cost." },
            { t:"20", why:"`x = 20` is where the maximum happens; the maximum profit is the value `P(20)`." },
            { t:"−$300", why:"That’s `P(0)`, not the maximum." }],
          hints:["Find `x` first.", "`x = 20`.", "`P(20) = 100`."] }
      ],
      refreshers:{
        "Revenue":"`R` = (number sold) × (price each). With “each $1 increase loses `k` customers”, write both as functions of the number of increases `n`.",
        "Derivative of k/x":"Rewrite as `kx^{-1}`; the derivative is `-k/x^2`. Setting `1 - k/x^2 = 0` gives `x = √k` for `x > 0`.",
        "Quadratic maximum":"Set the derivative to 0, then substitute back to get the maximum <strong>value</strong>."
      }
    }
  },
  explore:{
    heading:"Revenue and profit dashboard",
    intro:"A school club sells hoodies. Set the price and watch sales, revenue, cost and profit. Find the price that’s best for the club.",
    model:"<strong>Demand:</strong> `x = 200 - 4p` hoodies a month at price `p` dollars (so `p = 50 - x/4`).<br><strong>Cost:</strong> `C = 800 + 10x` (an $800 design and printing setup, plus $10 per hoodie).",
    modelNow:"Your cost settings now:",
    views:[{ id:"price", t:"By price", short:"Revenue & profit" }, { id:"qty", t:"By quantity (marginal view)", short:"Marginal" }],
    gcap:{ price:"Revenue, cost and profit by price", qty:"Marginal revenue and marginal cost by quantity" },
    sl:{ price:"Price `p`", qty:"Quantity `x`" },
    fixedLabel:"Fixed cost", unitLabel:"Cost per hoodie", curvesLabel:"Curves",
    curves:{ R:"Revenue `R`", C:"Cost `C`", P:"Profit `P`", dR:"`R′`", dC:"`C′`" },
    zone:{ up:"`R′ > C′`: profit still rising", down:"`R′ < C′`: profit falling" },
    ansLabel:"Value for the challenges", ansNote:"Type the revenue or profit a challenge asks for (whole dollars).",
    rows:{ price:"Price", sold:"Hoodies sold", rev:"Revenue", cost:"Cost", profit:"Profit", mr:"Marginal revenue `R′(x)`", mc:"Marginal cost `C′(x)`", trend:"Profit trend" },
    perHoodie:"per hoodie", loss:"(a loss)",
    trend:{ level:"level: the next hoodie adds about $0 of profit", up:"rising: the next hoodie adds about {v} of profit", down:"falling: the next hoodie lowers profit by about {v}" },
    predIntro:"Make a prediction first. Then the dashboard shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"The price rises from $20 to $25. What happens to revenue?",
        options:[{ t:"it increases", ok:true }, { t:"it decreases" }, { t:"it stays the same" }, { t:"it doubles" }],
        explain:"`R` goes from 20 × 120 = $2400 to 25 × 100 = $2500. Fewer hoodies sell, but each brings in more. Up to $25, the higher price wins.",
        start:{ view:"price", p:20, u:10, F:800 } },
      { id:"p2", prompt:"Which price gives the <strong>most revenue</strong>?",
        options:[{ t:"$25", ok:true }, { t:"$50" }, { t:"$30" }, { t:"$10" }],
        explain:"The probe sweeps; `R` peaks at $2500. `R(p) = 200p - 4p^2`, `R′ = 200 - 8p = 0` at `p = 25`. At $50 nobody buys.",
        start:{ view:"price", p:10, u:10, F:800 } },
      { id:"p3", prompt:"Will the <strong>most profit</strong> come at the same price?",
        options:[{ t:"no, at a higher price", ok:true }, { t:"yes, at $25" }, { t:"no, at a lower price" }, { t:"profit has no maximum" }],
        explain:"The profit curve peaks at $30 with $800; at $25 it’s $700. Each hoodie costs $10 to make. Selling 20 fewer at $30 loses some revenue but saves more in cost.",
        start:{ view:"price", p:25, u:10, F:800 } },
      { id:"p4", prompt:"The fixed cost rises to $1200. The best price for profit …",
        options:[{ t:"stays $30", ok:true }, { t:"rises" }, { t:"falls" }, { t:"becomes $25" }],
        explain:"The profit curve slides down by $400; its peak stays above $30 ($400 profit). A fixed cost subtracts the same amount at every price, so `P′` doesn’t change.",
        start:{ view:"price", p:30, u:10, F:800 } }
    ],
    pv:{ peakR:"most revenue: $25", peakP:"most profit: $30", before:"before", after:"after" },
    chalIntro:"Use the dashboard to meet each goal, type the value in the answer box, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Set the price for the most revenue and enter that revenue.",
        why:"`R(p) = 200p - 4p^2` and `R′(p) = 200 - 8p = 0` at `p = 25`: revenue $2500.",
        hints:["Watch the revenue dot.", "`R′(p) = 200 - 8p`.", "$25, revenue $2500."],
        general:"Move the price until the revenue dot is at its highest, then type that revenue in the answer box.",
        msgs:{ p30:"That’s the profit peak. Revenue at $30 is $2400.", empty:"The price is right. Now type the revenue at $25 in the answer box.", value:"The price is right. Type the revenue at $25 from the readout." } },
      { id:"tc2", goal:[3, 4], prompt:"Set the price for the most profit and enter that profit.",
        why:"`P′ = 240 - 8p = 0` at $30: 20 × 80 − 800 = 800.",
        hints:["Switch on the profit curve.", "`P(p) = (p - 10)(200 - 4p) - 800`.", "`P′ = 240 - 8p = 0` at $30: 20 × 80 − 800 = 800."],
        general:"Move the price until the profit dot is at its highest, then type that profit in the answer box.",
        msgs:{ cost:"Use the club’s costs for this one: fixed cost $800 and $10 per hoodie.", p25:"Profit there is $700.", rev:"That’s revenue, not profit.",
          empty:"Now type the profit at this price in the answer box.", value:"The price is right. Type the profit at $30 from the readout." } },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Fabric prices rise: each hoodie now costs $14 (fixed cost $800). Predict the new best price <strong>before</strong> moving the slider, then enter it and the new maximum profit.",
        why:"`P′(p) = 256 - 8p = 0` at `p = 32`: 18 × 72 − 800 = 496. The best price rose by $2, half the $4 cost increase.",
        hints:["`P(p) = (p - 14)(200 - 4p) - 800`.", "`P′(p) = (200 - 4p) - 4(p - 14) = 256 - 8p`.", "`p = 32`: 18 × 72 − 800 = 496."],
        general:"Set the price slider to your predicted best price, then type the maximum profit in the answer box.",
        msgs:{ cost:"Choose $14 per hoodie first, and keep the fixed cost at $800.", p34:"Raising the price by $4 loses too many sales. The best price rises by half the cost increase.",
          p30:"That was best when hoodies cost $10.", empty:"Now type the new maximum profit in the answer box.", value:"The price is right. Type the profit at $32 from the readout." } }
    ]
  },
  part3:{
    slug:"science", name:"Science",
    heading:"Science optimization",
    intro:"Three stations, each with a sweet spot. Two terms pull in opposite directions; drag to find where they balance, then check it with algebra. Then try the quick check.",
    stations:[
      { id:"s1", chip:"Least average cost", title:"Station 1: least average cost",
        text:"A workshop’s daily cost to make `x` chairs is `C(x) = x^2 + 6x + 400` dollars. The bar shows the average cost `A(x) = {C(x)}/{x} = x + 6 + 400/x` split into its parts.",
        how:"Drag the point on the graph or use the slider (arrow keys move 1 chair).",
        sl:"Chairs `x`", graph:"`A(x)`, dollars per chair", xName:"chairs",
        parts:[{ k:"a", t:"setup shared by more chairs, `400/x`" }, { k:"c", t:"$6 per chair" }, { k:"b", t:"crowding, `x`" }],
        rows:{ x:"Chairs", A:"Average cost `A(x)`", mc:"Marginal cost `C′(x) = 2x + 6`", trend:"Average cost" },
        trend:{ down:"falling: more chairs share the setup", up:"rising: crowding wins", best:"least: $46 per chair" },
        reveal:"Compare with the marginal cost",
        revealText:"`C′(20) = 2(20) + 6 = 46`, the same number. “At the least average cost, the marginal cost equals the average cost.” The teal line is `C′(x)`: it crosses `A(x)` at its lowest point.",
        foot:"Footnote: `C′(20)` = $46 is the rate “about the cost of one more chair”. The exact cost of the 21st chair is `C(21) - C(20)` = $47.",
        alg:["`A(x) = {C(x)}/{x} = x + 6 + 400/x`", "`A′(x) = 1 - 400/x^2`", "`A′(x) = 0` when `x^2 = 400`, so `x = 20` (`x > 0`).", "`A(20) = 20 + 6 + 20 = 46`: the least average cost is $46 per chair, at 20 chairs."] },
      { id:"s2", chip:"Best speed", title:"Station 2: best speed",
        text:"A truck makes a 400 km trip. The driver earns $64/h; fuel costs `v^2/100` dollars per hour at `v` km/h; legal speeds 40 to 100 km/h. Cost `C(v) = (400/v)(64 + v^2/100) = 25 600/v + 4v`.",
        how:"Drag the point on the graph or use the slider (arrow keys move 1 km/h). The shaded band is the legal speeds.",
        sl:"Speed `v`", graph:"`C(v)`, dollars", xName:"km/h",
        parts:[{ k:"a", t:"driver cost, `25 600/v`" }, { k:"b", t:"fuel cost, `4v`" }],
        rows:{ v:"Speed", time:"Trip time", C:"Trip cost `C(v)`", trend:"Trip cost" },
        trend:{ down:"falling: the driver’s hours shrink faster than fuel grows", up:"rising: fuel grows faster than the hours shrink", best:"least: $640 (driver $320, fuel $320)" },
        alg:["`C(v) = (400/v)(64 + v^2/100) = 25 600/v + 4v`", "`C′(v) = 4 - 25 600/v^2`", "`C′(v) = 0` when `v^2 = 6400`, so `v = 80` km/h.", "Endpoints: `C(40)` = $800 and `C(100)` = $656. At 80 km/h the trip costs $640 (driver $320, fuel $320), the least."] },
      { id:"s3", chip:"Best load", title:"Station 3: best load",
        text:"A 12 V battery with internal resistance 4 Ω powers a heater of resistance `R`. The power delivered is `P(R) = {144R}/{(R + 4)^2}` watts.",
        how:"Drag the point on the graph or use the slider (arrow keys move 0.5 Ω).",
        sl:"Load `R`", graph:"`P(R)`, watts", xName:"Ω",
        rows:{ R:"Load `R`", P:"Power `P(R)`", trend:"Power" },
        trend:{ up:"rising", down:"falling", best:"greatest: 9 W" },
        banner:"Best when the load matches the battery’s own resistance.",
        alg:["`P(R) = {144R}/{(R + 4)^2}`", "Quotient rule: `P′(R) = {144(R + 4)^2 - 144R · 2(R + 4)}/{(R + 4)^4} = {144(4 - R)}/{(R + 4)^3}`", "`P′(R) = 0` at `R = 4` Ω; `P′ > 0` before and `P′ < 0` after.", "`P(4) = 576/64 = 9`: the best load is 4 Ω, giving 9 W."] }
    ],
    algSummary:"Check it with algebra", signTitle:"Sign chart",
    quickCheck:{
      title:"Quick check", summary:"Science optimization quick check",
      items:[
        { id:"q1", goal:5, prompt:"Least average cost for the chairs?",
          choices:[
            { t:"$46 per chair", ok:true, fb:"Right. `A(20) = 20 + 6 + 20 = 46`." },
            { t:"$20 per chair", fb:"20 is the number of chairs; `A(20) = 20 + 6 + 20 = 46`." },
            { t:"$26 per chair", fb:"20 is the number of chairs; `A(20) = 20 + 6 + 20 = 46`." },
            { t:"$400 per chair", fb:"20 is the number of chairs; `A(20) = 20 + 6 + 20 = 46`." }] },
        { id:"q2", goal:[5, 6], prompt:"Why does the trip cost have a minimum at all?",
          choices:[
            { t:"Slow trips cost more in wages; fast trips cost more in fuel", ok:true, fb:"Right. Two terms pull in opposite directions; the best speed balances them." },
            { t:"Fuel is free at low speed", fb:"Two terms pull in opposite directions; the best speed balances them." },
            { t:"Wages fall with speed", fb:"Two terms pull in opposite directions; the best speed balances them." },
            { t:"The trip is shorter at high speed", fb:"Two terms pull in opposite directions; the best speed balances them." }] },
        { id:"q3", goal:5, prompt:"For `C(v) = 25 600/v + 4v`, `C′(v)` = …",
          choices:[
            { t:"`4 - 25 600/v^2`", ok:true, fb:"Right. The derivative of `25 600v^{-1}` is `-25 600v^{-2}`." },
            { t:"`4 + 25 600/v^2`", fb:"The derivative of `25 600v^{-1}` is `-25 600v^{-2}`." },
            { t:"`4 - 25 600/v`", fb:"The derivative of `25 600v^{-1}` is `-25 600v^{-2}`." },
            { t:"`-25 600/v^2`", fb:"The derivative of `25 600v^{-1}` is `-25 600v^{-2}`, and `4v` gives 4." }] },
        { id:"q4", goal:6, prompt:"Best load for the battery?",
          choices:[
            { t:"4 Ω", ok:true, fb:"Right. `P′ = 0` at `R = 4`, where the load matches the battery’s 4 Ω." },
            { t:"0 Ω", fb:"At 0 Ω no power reaches the heater; `P′ = 0` at `R = 4`." },
            { t:"12 Ω", fb:"At 0 Ω no power reaches the heater; `P′ = 0` at `R = 4`." },
            { t:"20 Ω", fb:"At 0 Ω no power reaches the heater; `P′ = 0` at `R = 4`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"words", type:"match", title:"Words ↔ formulas", summary:"Words ↔ formulas", goal:[1, 2, 3],
        instruction:"Match each term with its meaning or formula.",
        leftTitle:"Term", rightTitle:"Meaning or formula",
        left:[
          { id:"l1", t:"Revenue", goal:2 },
          { id:"l2", t:"Profit", goal:2 },
          { id:"l3", t:"Marginal cost", goal:1 },
          { id:"l4", t:"Marginal revenue", goal:1 },
          { id:"l5", t:"Average cost", goal:[1, 2] },
          { id:"l6", t:"Demand function", goal:2 },
          { id:"l7", t:"Break-even", goal:3 },
          { id:"l8", t:"Maximum profit", goal:3, hints:["What is `P′`?", "`P′ = R′ - C′`.", "`P′ = 0` when `R′ = C′`."] }
        ],
        right:[
          { id:"r1", t:"`R(x) = x · p(x)`" },
          { id:"r2", t:"`P(x) = R(x) - C(x)`" },
          { id:"r3", t:"`C′(x)`: about the cost of one more item" },
          { id:"r4", t:"`R′(x)`: about the revenue from one more sale" },
          { id:"r5", t:"`C(x)/x`" },
          { id:"r6", t:"The price at which `x` items will sell" },
          { id:"r7", t:"`P(x) = 0`" },
          { id:"r8", t:"`R′(x) = C′(x)`, with profit rising before and falling after" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l7|r8":"`P = 0` is break-even; the peak is where `P′ = 0`.", "l8|r7":"`P = 0` is break-even; the peak is where `P′ = 0`.",
          "l3|r5":"Average divides total cost by `x`; marginal is the rate `C′`.", "l5|r3":"Average divides total cost by `x`; marginal is the rate `C′`.",
          "l1|r6":"Demand gives the price; revenue multiplies it by `x`.", "l6|r1":"Demand gives the price; revenue multiplies it by `x`."
        } },
      { id:"solve", type:"custom", title:"Solve it", summary:"Solve it", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Solve each problem and type the answers. Problems 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type numbers only, such as 30 or 30.00 (a $ sign is fine), then press Check.",
        items:[
          { id:"s1", goal:4, prompt:"`R(x) = 120x - x^2/2`. Maximum revenue?",
            boxes:[{ k:"R", label:"Maximum revenue", pre:"$" }], answer:{ R:7200 },
            wrong:[{ k:"R", v:120, fb:"`x = 120` is where the maximum happens (the number sold). The question asks for the revenue there." }],
            why:"`R′ = 120 - x = 0` at `x = 120`; `R(120) = 14 400 - 7200 = 7200`: $7200." },
          { id:"s2", goal:[2, 4], prompt:"Demand `p = 90 - 3x`, cost `C = 30x + 100`. Price and maximum profit?",
            boxes:[{ k:"p", label:"Price", pre:"$", unit:"each" }, { k:"P", label:"Maximum profit", pre:"$" }], answer:{ p:60, P:200 },
            wrong:[{ k:"P", v:300, fb:"Subtract the $100 fixed cost." }],
            why:"`P = 60x - 3x^2 - 100`; `P′ = 60 - 6x = 0` at `x = 10`, so the price is 90 − 30 = $60 and `P(10) = 600 - 300 - 100 = 200`." },
          { id:"s3", goal:5, prompt:"`C(x) = 2x^2 + 50x + 800`. Production level with the least average cost, and that cost?",
            boxes:[{ k:"x", label:"Production level `x`", unit:"items" }, { k:"A", label:"Least average cost", pre:"$", unit:"per item" }], answer:{ x:20, A:130 },
            wrong:[{ k:"x", v:400, fb:"That’s `x^2`." }],
            why:"`A = 2x + 50 + 800/x`; `A′ = 2 - 800/x^2 = 0` at `x = 20`; `A(20) = 40 + 50 + 40 = 130`: $130 per item." },
          { id:"s4", goal:4, star:true, prompt:"An arena sells 4000 tickets at $30. Each $1 increase loses 100 fans. Best price and revenue?",
            boxes:[{ k:"p", label:"Best price", pre:"$" }, { k:"R", label:"Revenue", pre:"$" }], answer:{ p:35, R:122500 },
            wrong:[{ k:"p", v:50, fb:"That halves the crowd; `R′ = 1000 - 200n = 0` at `n = 5`." }],
            hints:["After `n` increases: price `30 + n`, fans `4000 - 100n`.", "`R′(n) = 1000 - 200n`.", "`n = 5`: $35 × 3500 = $122 500."],
            why:"`R(n) = (30 + n)(4000 - 100n)` and `R′(n) = 1000 - 200n = 0` at `n = 5`: $35 × 3500 = $122 500." },
          { id:"s5", goal:5, star:true, prompt:"A tour boat makes a 120 km trip. Crew cost $45/h; fuel costs `v^2/20` dollars per hour. Best speed and cost?",
            boxes:[{ k:"v", label:"Best speed", unit:"km/h" }, { k:"C", label:"Trip cost", pre:"$" }], answer:{ v:30, C:360 },
            wrongDefault:M6 + " Hours = 120/`v`.",
            why:"`C(v) = (120/v)(45 + v^2/20) = 5400/v + 6v`; `C′(v) = 6 - 5400/v^2 = 0` at `v = 30`; `C(30) = 180 + 180 = 360`." },
          { id:"s6", goal:[2, 6], star:true, prompt:"Demand `p = 100 - 2x`, cost `C = 20x + 50`. A tax of $`t` per item is added to the company’s cost, and the company always picks its best `x`. Which tax brings the government the most tax money, and how much?",
            boxes:[{ k:"t", label:"Tax `t`", pre:"$", unit:"per item" }, { k:"T", label:"Tax money", pre:"$" }], answer:{ t:40, T:400 },
            wrong:[{ k:"t", v:80, fb:"At `t = 80` the company makes 0 items, so the tax raises nothing." }],
            hints:["Company’s profit: `(100 - 2x)x - (20 + t)x - 50`. Its best `x`?", "`P′ = 80 - 4x - t = 0`, so `x = (80 - t)/4`.", "Tax money `T = t(80 - t)/4`, greatest at `t = 40`: `x = 10`, `T` = $400."],
            why:"`x = (80 - t)/4` and `T = t(80 - t)/4`, greatest at `t = 40`: `x = 10` items and $400 of tax." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Rosa", how:"", goal:[3, 5],
        instruction:"Rosa made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Hoodies: demand `x = 200 - 4p`, cost `C = 800 + 10x`. Find the price for maximum profit.",
            steps:["Revenue: `R(p) = p(200 - 4p) = 200p - 4p^2`.", "`R′(p) = 200 - 8p = 0`, so `p = 25`.", "So the price for maximum profit is $25."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "That correctly maximizes revenue.", ""],
            fixes:[
              { t:"Profit is `P(p) = (p - 10)(200 - 4p) - 800`; `P′ = 240 - 8p = 0` gives $30.", ok:true, why:"Maximize profit, `P = R - C`, not revenue." },
              { t:"The price is $25 + $10 = $35.", why:"Adding the unit cost overshoots." },
              { t:"The price is $50, the highest anyone pays.", why:"Nobody buys at $50." },
              { t:"Step 3 is correct.", why:"Step 2 maximized revenue, which ignores cost." }],
            hints:["What did step 2 maximize?", "Revenue.", "Maximize `P = R - C` instead."] },
          { id:"e2", goal:5, task:"`C(x) = x^2 + 10x + 900`. Find the least average cost.",
            steps:["`A(x) = {C(x)}/{x} = x + 10 + 900/x`.", "`A′(x) = 1 + 900/x^2`.", "`A′` is always positive, so the least average cost is at `x = 0`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"`A′(x) = 1 - 900/x^2 = 0` at `x = 30`, so the least average cost is `A(30) = 30 + 10 + 30` = $70.", ok:true, why:M5 },
              { t:"`A′(x) = 1 - 900/x`.", why:"The exponent becomes −2." },
              { t:"`A′(x) = 2x + 10`.", why:"That’s `C′`, not `A′`." },
              { t:"Step 2 is correct.", why:"`x^{-1}` differentiates to `-x^{-2}`." }],
            hints:["Rewrite `900/x` as a power.", "`900x^{-1} -> -900x^{-2}`.", "`x = 30`, $70."] },
          { id:"e3", goal:5, task:"A 300 km delivery: the driver earns $48/h and fuel costs `v^2/75` dollars per hour. Find the cheapest speed.",
            steps:["Time for the trip: 300/`v` hours.", "Cost per hour: `48 + v^2/75` dollars.", "Total cost: `C(v) = 300(48 + v^2/75)`.", "`C′(v) = 8v > 0`, so drive as slowly as possible."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`C(v) = (300/v)(48 + v^2/75) = 14 400/v + 4v`; `C′ = 0` at `v = 60` km/h; cost $480.", ok:true, why:M6 },
              { t:"`C(v) = 48 + v^2/75`.", why:"That’s one hour’s cost." },
              { t:"`C(v) = 300v(48 + v^2/75)`.", why:"Multiply by time, not by distance × speed." },
              { t:"Step 3 is correct.", why:"Cost per hour must be multiplied by hours, 300/`v`." }],
            hints:["What do you multiply a cost <strong>per hour</strong> by?", "The number of hours, 300/`v`.", "`v = 60` km/h."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the dashboard: that the best-profit price is higher than the best-revenue price, or that the fixed cost didn’t move it?" },
      { id:"j2", q:"In your own words, what does it mean when marginal revenue equals marginal cost?" },
      { id:"j3", q:"Explain to a friend how to set up a trip-cost problem from “cost per hour” and a distance." },
      { id:"j4", q:"Which model still feels shaky (demand, average cost, or trip cost)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A bakery’s cost to make `x` cakes is `C(x) = 500 + 8x + x^2` dollars. What is `C′(10)`, and what does it mean?", options:[
          { t:"$28: about the cost of making one more cake when 10 are made", ok:true, why:"`C′(x) = 8 + 2x`." },
          { t:"$68: the average cost per cake for 10 cakes", why:"That’s `C(10)/10`." },
          { t:"$680: the total cost of 10 cakes", why:"That’s `C(10)`." },
          { t:"$8: the cost of each cake", why:"Only when `x = 0`; `C′` grows with `x`." }] },
        b:{ prompt:"`C(x) = 300 + 5x + x^2`. What is `C′(20)`, and what does it mean?", options:[
          { t:"$45: about the cost of one more item when 20 are made", ok:true, why:"`C′(x) = 5 + 2x`." },
          { t:"$40: the average cost per item", why:"That’s `C(20)/20`." },
          { t:"$800: the total cost of 20 items", why:"That’s `C(20)`." },
          { t:"$5: the cost of each item", why:"Only when `x = 0`; `C′` grows with `x`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Demand is `p = 80 - 2x` dollars and cost is `C = 20x + 100`. Which is the profit function?", options:[
          { t:"`P(x) = 60x - 2x^2 - 100`", ok:true, why:"`R = x(80 - 2x)`; `P = R - C`." },
          { t:"`P(x) = 80 - 2x - (20x + 100)`", why:"Use revenue, not price." },
          { t:"`P(x) = 80x - 2x^2 + 20x + 100`", why:"Cost is subtracted." },
          { t:"`P(x) = 60x - 2x^2`", why:"The $100 fixed cost is missing." }] },
        b:{ prompt:"Demand `p = 120 - 3x`, cost `C = 30x + 200`. Which is the profit function?", options:[
          { t:"`P(x) = 90x - 3x^2 - 200`", ok:true, why:"`R = x(120 - 3x)`; `P = R - C`." },
          { t:"`P(x) = 120 - 3x - (30x + 200)`", why:"Use revenue, not price." },
          { t:"`P(x) = 120x - 3x^2 + 30x + 200`", why:"Cost is subtracted." },
          { t:"`P(x) = 90x - 3x^2`", why:"The $200 fixed cost is missing." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"At a production level of 60 units, `R′(60) = 12` and `C′(60) = 20`. Should the company make more than 60 units?", options:[
          { t:"No: the next unit brings in about $12 but costs about $20, so profit would fall.", ok:true, why:"`R′(60) < C′(60)`, so `P′(60) < 0`." },
          { t:"Yes: revenue is still increasing.", why:"Revenue rises, but cost rises faster." },
          { t:"Yes: `R′` is positive.", why:"Compare `R′` with `C′`, not with 0." },
          { t:"No: marginal cost is positive.", why:"Marginal cost is almost always positive; compare it with `R′`." }] },
        b:{ prompt:"At 40 units, `R′(40) = 25` and `C′(40) = 18`. Should the company make more than 40 units?", options:[
          { t:"Yes: the next unit brings in about $25 but costs about $18, so profit rises.", ok:true, why:"`R′(40) > C′(40)`, so `P′(40) > 0`." },
          { t:"No: revenue is already at its maximum.", why:"`R′ = 25 > 0`, so revenue is still rising." },
          { t:"No: marginal cost is positive.", why:"Marginal cost is almost always positive; compare it with `R′`." },
          { t:"Yes: because 25 > 0.", why:"Compare `R′` with `C′`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A bike shop rents 60 bikes a day at $20. Each $2 increase means 3 fewer rentals. Which price gives the most revenue?", options:[
          { t:"$30", ok:true, why:"`R(n) = (20 + 2n)(60 - 3n) = 1200 + 60n - 6n^2`, `R′ = 0` at `n = 5`: $30 × 45 = $1350." },
          { t:"$40", why:"That halves the rentals (`n = 10`): $40 × 30 = $1200." },
          { t:"$20", why:"`R′(0) = 60 > 0`, so raising the price helps." },
          { t:"$25", why:"That reads the increase as $1 a step; each step is $2." }] },
        b:{ prompt:"A kayak stand rents 100 kayaks a day at $20. Each $5 increase means 10 fewer rentals. Which price gives the most revenue?", options:[
          { t:"$35", ok:true, why:"`R(n) = (20 + 5n)(100 - 10n)`, `R′ = 300 - 100n = 0` at `n = 3`: $35 × 70 = $2450." },
          { t:"$45", why:"That halves the rentals." },
          { t:"$20", why:"`R′(0) > 0`." },
          { t:"$23", why:"Each step is $5, not $1." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`C(x) = 4x^2 + 20x + 900`. At what production level is the average cost least?", options:[
          { t:"`x = 15`", ok:true, why:"`A = 4x + 20 + 900/x`; `A′ = 4 - 900/x^2 = 0` at `x = 15` (`A` = $140)." },
          { t:"`x = 225`", why:"That’s `x^2`, not `x`." },
          { t:"`x = 30`", why:"That differentiates `4x` as 1; `A′ = 4 - 900/x^2`." },
          { t:"`x = 140`", why:"$140 is the least average cost, not the level." }] },
        b:{ prompt:"`C(x) = 2x^2 + 30x + 800`. At what production level is the average cost least?", options:[
          { t:"`x = 20`", ok:true, why:"`A′ = 2 - 800/x^2 = 0` at `x = 20` (`A` = $110)." },
          { t:"`x = 400`", why:"That’s `x^2`." },
          { t:"`x = 20√2`", why:"That drops the 2 in `A′ = 2 - 800/x^2`." },
          { t:"`x = 110`", why:"$110 is the least average cost, not the level." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A 560 km trip: the driver earns $49/h and fuel costs `v^2/100` dollars per hour. Which speed costs least? (Speeds 40 to 100 km/h.)", options:[
          { t:"70 km/h", ok:true, why:"`C = (560/v)(49 + v^2/100) = 27 440/v + 5.6v`; `C′ = 0` when `v^2 = 4900`. Cost $784." },
          { t:"49 km/h", why:"Matching the speed to the wage has no basis." },
          { t:"100 km/h", why:"`C(100)` = 274.40 + 560 = $834.40 > $784." },
          { t:"35 km/h", why:"Outside the legal range, and `C′(35) < 0`." }] },
        b:{ prompt:"A 480 km trip: the driver earns $36/h and fuel costs `v^2/100` dollars per hour. Which speed costs least?", options:[
          { t:"60 km/h", ok:true, why:"`C′ = 0` when `v^2 = 3600`. Cost 8 h × $72 = $576." },
          { t:"36 km/h", why:"Matching the speed to the wage has no basis." },
          { t:"100 km/h", why:"`C(100)` = 172.80 + 480 = $652.80 > $576." },
          { t:"30 km/h", why:"`C′(30) < 0`: the cost is still falling at 30 km/h." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why the price that maximizes <strong>revenue</strong> usually doesn’t maximize <strong>profit</strong>?", options:[
          { t:"“Profit also depends on cost. At the revenue peak, raising the price a little loses almost no revenue but saves the cost of the items no longer made, so profit is still rising.”", ok:true, why:"At the revenue peak one more sale adds about $0 of revenue but still costs money to make, so a slightly higher price and fewer sales raise profit." },
          { t:"“Revenue and profit always peak at the same price.”", why:M1 },
          { t:"“Profit is greatest at the lowest price, when the most items sell.”", why:"Selling more also costs more." },
          { t:"“The fixed cost moves the best price.”", why:"A fixed cost doesn’t change `P′`." }] },
        b:{ prompt:"Which is the best explanation of why raising the <strong>fixed</strong> cost doesn’t change the best price?", options:[
          { t:"“A fixed cost subtracts the same amount from profit at every price. The profit graph moves down, but its peak stays at the same price because `P′` is unchanged.”", ok:true, why:"The derivative of a constant is 0." },
          { t:"“It does change it: the price must rise to cover the cost.”", why:M3 },
          { t:"“Because revenue doesn’t depend on price.”", why:"Revenue does depend on price." },
          { t:"“Because fixed costs are zero at the maximum.”", why:"They’re the same at every price." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"A graph shows `R′(x)` and `C′(x)` crossing at `x = 50`, with `R′` above `C′` for `x < 50` and below it after. Which describes the profit?", options:[
          { t:"“Profit rises until `x = 50` and falls after, so the maximum profit is at `x = 50`.”", ok:true, why:"`P′ = R′ - C′` changes from + to − at `x = 50`." },
          { t:"“Profit is greatest where `R′` is greatest.”", why:"`R′` is greatest at the start, where profit is still climbing." },
          { t:"“Profit is zero at `x = 50`.”", why:M8 },
          { t:"“Profit is least at `x = 50`.”", why:"`P′` changes from + to −: a maximum." }] },
        b:{ prompt:"`R′` and `C′` cross at `x = 120`, with `R′` above `C′` before and below after. Which describes the profit?", options:[
          { t:"“Profit rises until `x = 120` and falls after: maximum profit at `x = 120`.”", ok:true, why:"`P′ = R′ - C′` changes from + to − at `x = 120`." },
          { t:"“Profit is greatest where `R′` is greatest.”", why:"`R′` is greatest at the start, where profit is still climbing." },
          { t:"“Profit is zero at `x = 120`.”", why:M8 },
          { t:"“Profit is least at `x = 120`.”", why:"`P′` changes from + to −: a maximum." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A club sells `x` calendars at `p = 20 - x/10` dollars each; costs are `C = 4x + 240`. Which price maximizes profit, and what is the profit?", options:[
          { t:"$12 each; $400 profit", ok:true, why:"`P = 16x - x^2/10 - 240`; `P′ = 0` at `x = 80`; `p = 20 - 8`." },
          { t:"$10 each; $360 profit", why:"That’s the revenue-maximizing price." },
          { t:"$12 each; $640 profit", why:"Subtract the $240 fixed cost." },
          { t:"$80 each", why:"80 is the number of calendars." }] },
        b:{ prompt:"`p = 30 - x/20` dollars, `C = 6x + 1000`. Which price maximizes profit, and what is the profit?", options:[
          { t:"$18 each; $1880 profit", ok:true, why:"`P = 24x - x^2/20 - 1000`; `x = 240`; `p = 30 - 12`." },
          { t:"$15 each; $1700 profit", why:"That’s the revenue-maximizing price." },
          { t:"$18 each; $2880 profit", why:"Subtract the $1000 fixed cost." },
          { t:"$240 each", why:"240 is the number of items." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A battery with internal resistance 5 Ω delivers `P(R) = {100R}/{(R + 5)^2}` watts to a device of resistance `R`. Which `R` gives the most power, and how much?", options:[
          { t:"`R` = 5 Ω; 5 W", ok:true, why:"`P′(R) = {100(5 - R)}/{(R + 5)^3} = 0` at `R = 5`; `P = 500/100`." },
          { t:"`R` = 5 Ω; 20 W", why:"100 × 5/25 forgets to square `(R + 5)`." },
          { t:"`R` = 10 Ω", why:"`P(10) = 1000/225 < 5`." },
          { t:"`R` = 0 Ω", why:"With no resistance, no power is delivered to the device: `P(0) = 0`." }] },
        b:{ prompt:"`P(R) = {64R}/{(R + 2)^2}` watts. Which `R` gives the most power, and how much?", options:[
          { t:"`R` = 2 Ω; 8 W", ok:true, why:"`P′ = 0` at `R = 2`; `P = 128/16`." },
          { t:"`R` = 2 Ω; 32 W", why:"Square `(R + 2)`." },
          { t:"`R` = 4 Ω", why:"`P(4) = 256/36 < 8`." },
          { t:"`R` = 0 Ω", why:"`P(0) = 0`." }] } }
    ]
  },
  task:{
    title:"Set up shop", summary:"Set up shop",
    statement:"<p>The hoodie demand is still `x = 200 - 4p`. You choose the cost per hoodie and the fixed cost. Meet every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The best price (for profit) is a whole number of dollars.</li><li>The best price is between $30 and $40.</li><li>The maximum profit is between $400 and $600.</li><li>The fixed cost is at least $500.</li></ol></div>",
    inputs:{ u:"Cost per hoodie `u`", F:"Fixed cost `F`", note:"`u` goes from $0 to $40 in steps of $5; `F` from $0 to $2000 in steps of $100." },
    read:{ best:"Best price", max:"Maximum profit", target:"target" },
    checks:["Best price is whole dollars", "Best price $30 to $40", "Maximum profit $400 to $600", "Fixed cost at least $500"],
    tips:["`P(p) = (p - u)(200 - 4p) - F`, so `P′ = 200 + 4u - 8p` and the best price is `25 + u/2`.",
      "For a price from $30 to $40, `u` must be from $10 to $30.",
      "Substitute the best price: the maximum profit is `(50 - u)^2 - F`.",
      "A bigger fixed cost lowers the maximum profit dollar for dollar."],
    explainPrompt:"Explain why the best price depends on the cost per hoodie but not on the fixed cost.",
    vocab:"Use the words marginal cost, fixed cost, profit and derivative.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"With `u` = $30 the best price is $40 but the maximum profit is only 400 − `F`, so any fixed cost of $500 or more makes a loss."
  },
  cards:[
    ["Demand function", "The price `p(x)` at which `x` items sell, e.g. `p = 50 - x/4`."],
    ["Revenue", "`R(x) = x · p(x)`."],
    ["Profit", "`P(x) = R(x) - C(x)`."],
    ["Marginal cost", "`C′(x)` ≈ the cost of one more item."],
    ["Marginal revenue", "`R′(x)` ≈ the revenue from one more sale."],
    ["Maximum profit", "Where `R′(x) = C′(x)` (and `P′` changes from + to −)."],
    ["Revenue max ≠ profit max", "Hoodies: most revenue at $25, most profit at $30."],
    ["Fixed cost", "Lowers profit by the same amount everywhere; doesn’t move the best price."],
    ["Average cost", "`C(x)/x`; at its minimum it equals the marginal cost."],
    ["Trip cost", "(distance/`v`) × (cost per hour)."],
    ["“Each $1 increase loses `k`”", "`R(n)` = (price + `n`)(customers − `kn`)."],
    ["Derivative of `k/x`", "`-k/x^2`."]
  ]
};
