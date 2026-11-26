// MDM4U 07 Permutations of Distinct Objects. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/07-permutations-distinct.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = (n, r) => "Divide by the factorial of the objects <strong>left out</strong>: `(" + n + " - " + r + ")! = " + (n - r) + "!`.";
const M1n = "Divide by the factorial of the objects <strong>left out</strong>: `(n - r)!`.";
const M2 = "Once someone is chosen, they can’t be chosen again: the choices shrink, `n`, `n - 1`, …";
const M5 = "`n` counts objects: reject negative or impossible values.";
const M6 = (n, r, list) => n + " × " + r + " isn’t a counting rule. Use " + list + " for " + r + " places.";
const NB = " ";   // no-break space for thousands (13 800)

// Part 3 station chips for P(n, 2) (S1 and S4)
const two = () => [
  { t:"`n(n - 1)`", ok:true, why:"Two places: `n` choices, then `n - 1` left." },
  { t:"`n^2`", why:"That lets the same object fill both places. " + M2 },
  { t:"`{n!}/{2!}`", why:M1n.replace("`(n - r)!`", "`(n - 2)!`, not `2!`") },
  { t:"`n - 2`", why:"`P(n, 2)` multiplies 2 factors. It doesn’t subtract." }];

export default {
  id:"07-permutations-distinct",
  kind:"topic",
  title:"Permutations of distinct objects",
  topic:"Permutations of Distinct Objects",
  readyTopic:"permutations of distinct objects",
  hero:{
    eq:"`P(n, r) = {n!}/{(n - r)!}`", eqLabel:"P of n, r equals n factorial over n minus r factorial", eqSize:"md",
    headline:"Order matters: first, second, third",
    text:"Eight runners, three medals. Gold can go to any of 8, silver to any of the 7 left, bronze to any of the 6 left: 8 × 7 × 6 = 336. That’s a <strong>permutation</strong>: an arrangement of `r` of `n` objects where <strong>order matters</strong>. In factorials, it’s `8!/5!`, written <strong>`P(8, 3)`</strong> (also `_8P_3`).",
    fig:{ html:'<div class="pm-h" role="img" aria-label="Eight runners, A to H, line up. A podium with three steps lights up: first place, then second, then third. As each step lights, a runner hops up, with the labels 8 choices, 7 choices and 6 choices. The product 8 × 7 × 6 = 336 forms. Below it, 8 factorial is written as 8 7 6 5 4 3 2 1 over 5 4 3 2 1; the 5 factorial tail fades, leaving 8 × 7 × 6.">' +
      '<svg class="pm-hsvg" id="pm-hsvg" viewBox="0 0 360 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg>' +
      '<div class="pm-hprod" id="pm-hprod" aria-hidden="true"></div><div class="pm-hfact" id="pm-hfact" aria-hidden="true"></div></div>' }
  },
  goals:[
    "I can tell whether order matters in a selection.",
    "I can count ordered selections of `r` objects from `n` using the fundamental counting principle.",
    "I can evaluate `P(n, r)` using `n!/(n - r)!`.",
    "I can solve equations involving `P(n, r)`, such as `P(n, 2) = 56`.",
    "I can explain why `P(n, r)` is faster than listing, and when repeats make it `n^r` instead.",
    "I can solve problems with permutations in real contexts."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Fundamental counting principle", goal:2, prompt:"A 3-digit code uses the digits 1 to 9 with no digit repeated. How many codes are possible?",
          options:[
            { t:"504", ok:true, why:"9 × 8 × 7 = 504." },
            { t:"729", why:"`9^3` reuses digits." },
            { t:"27", why:"Multiply the choices for each position." },
            { t:"362" + NB + "880", why:"Only 3 positions." }],
          hints:["How many choices for the first digit?", "Then 8, then 7.", "504."] },
        { id:"w2", skill:"Fundamental counting principle", goal:1, prompt:"In which situation does order matter?",
          options:[
            { t:"Choosing a president and a vice-president from a club", ok:true, why:"Swapping the two people changes who holds which role." },
            { t:"Choosing 2 people for a committee", why:"Both seats are the same." },
            { t:"Picking 3 pizza toppings", why:"Pepperoni–olive is the same pizza as olive–pepperoni." },
            { t:"Dealing a 5-card hand", why:"A hand is the same in any order." }],
          hints:["Does swapping two choices give a different result?", "Roles make positions different.", "President and VP."] },
        { id:"w3", skill:"Factorials", goal:3, prompt:"Simplify `{7!}/{4!}`.",
          options:[
            { t:"210", ok:true, why:"7 × 6 × 5 = 210." },
            { t:"840", why:"4 is part of `4!`, which cancels." },
            { t:"6", why:"Factorials don’t subtract like that." },
            { t:"35", why:"Only `4!` is in the denominator." }],
          hints:["Write `7! = 7 × 6 × 5 × 4!`.", "`4!` cancels.", "210."] },
        { id:"w4", skill:"Factorials", goal:3, prompt:"Evaluate `{5!}/{0!}`.",
          options:[
            { t:"120", ok:true, why:"`0! = 1`, so `5!/0! = 120`." },
            { t:"Undefined", why:"`0! = 1`." },
            { t:"0", why:"Dividing by 1 doesn’t give 0." },
            { t:"5", why:"`5! = 120`." }],
          hints:["What is `0!`?", "1.", "120."] },
        { id:"w5", skill:"Quadratics", goal:4, prompt:"Solve `n^2 - n = 56` for `n > 0`.",
          options:[
            { t:"8", ok:true, why:"64 − 8 = 56." },
            { t:"7", why:"49 − 7 = 42." },
            { t:"56", why:"Reads the constant." },
            { t:"28", why:"Halves 56." }],
          hints:["`n(n - 1) = 56`.", "Consecutive numbers multiplying to 56.", "8 × 7, so `n = 8`."] },
        { id:"w6", skill:"Quadratics", goal:4, prompt:"Solve `(n - 1)(n - 2) = 30` for `n > 2`.",
          options:[
            { t:"7", ok:true, why:"6 × 5 = 30." },
            { t:"6", why:"5 × 4 = 20." },
            { t:"8", why:"7 × 6 = 42." },
            { t:"30", why:"Reads the constant." }],
          hints:["Consecutive numbers multiplying to 30.", "6 × 5.", "`n - 1 = 6`, so `n = 7`."] }
      ],
      refreshers:{
        "Fundamental counting principle":"Multiply the choices at each stage. If an item can’t be reused, each stage has one fewer choice.",
        "Factorials":"`n!/m!` for `m < n` is the product from `n` down to `m + 1`. `0! = 1`.",
        "Quadratics":"For `n(n - 1) = k`, look for consecutive whole numbers with product `k`, or factor `n^2 - n - k = 0` and keep the positive root."
      }
    }
  },
  explore:{
    heading:"Podium and seats",
    intro:"Fill ranked places from a group. Watch the choices shrink and the count build, then test it against a full list.",
    predIntro:"Make a prediction first. Then the podium and seats will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"podium", n:8, r:3 },
        prompt:"Podium, 8 runners, 3 medals. How many ways can gold, silver and bronze be awarded?",
        options:[{ t:"336", ok:true }, { t:"512" }, { t:"56" }, { t:"24" }],
        explain:"8 × 7 × 6 = 336. 512 = `8^3` lets one runner win twice; 56 ignores the order of medals; 24 is 8 × 3." },
      { id:"p2", start:{ mode:"rep", n:5, r:3 },
        prompt:"Codes of length 3 from 5 digits. Which is larger: codes with repeated digits allowed, or without?",
        options:[{ t:"With repeats: 125 vs 60", ok:true }, { t:"Without repeats" }, { t:"They’re equal" }, { t:"It depends on the digits" }],
        explain:"With repeats every slot has 5 choices: `5^3 = 125`. Without, 5 × 4 × 3 = 60." },
      { id:"p3", start:{ mode:"podium", n:5, r:5 },
        prompt:"Podium with 5 runners and 5 places. `P(5, 5)` equals…",
        options:[{ t:"120", ok:true }, { t:"1" }, { t:"25" }, { t:"undefined" }],
        explain:"`5!/0! = 5!/1 = 120`: arranging all 5 is a full line-up." },
      { id:"p4", start:{ mode:"list", n:4, r:2 },
        prompt:"List mode, 4 people (A, B, C, D), 2 places. Among the 12 permutations, how many times does the pair {A, B} appear?",
        options:[{ t:"2", ok:true }, { t:"1" }, { t:"4" }, { t:"12" }],
        explain:"Each pair appears in `2! = 2` orders. If order didn’t matter, you’d divide by 2: that’s a combination (module 11)." }
    ],
    chalIntro:"Set up the podium and seats, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Set `n` and `r` so the count is exactly 60.",
        why:"60 = 5 × 4 × 3 = `P(5, 3)`: the only pair with `n ≤ 10`.",
        hints:["60 = 5 × 4 × 3.", "Three consecutive factors starting at 5.", "`n = 5`, `r = 3`."] },
      { id:"tc2", goal:2, prompt:"Seats mode: 7 club members, 3 roles (President, VP, Treasurer). Lock Ana as President. How many slates?",
        why:"President is decided, so VP has 6 choices and Treasurer 5: 1 × 6 × 5 = 30.",
        hints:["President is decided.", "VP: 6 choices; Treasurer: 5.", "6 × 5 = 30."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Find <strong>every</strong> pair (`n`, `r`) with `n ≤ 10` and `r ≥ 2` for which `P(n, r) = 720`. The tool records each pair you find.",
        why:"`P(6, 5) = 6!/1! = 720`, `P(6, 6) = 6!/0! = 720` and `P(10, 3) = 10 × 9 × 8 = 720`.",
        hints:["720 = `6!`.", "`P(6, 5) = 6!/1!` and `P(6, 6) = 6!/0!`: both are 720, because `1! = 0! = 1`.", "720 = 10 × 9 × 8 too: `P(10, 3)`."] }
    ]
  },
  part3:{
    slug:"equations", name:"Equations",
    heading:"Permutations as equations",
    intro:"Work backwards from a count to `n` or `r`. At each station, choose the expanded form, find the answer on the consecutive-products ladder, then check it with algebra.",
    stations:[
      { id:"s1", eq:"`P(n, 2) = 56`", ask:"Which expression equals `P(n, 2)`?", ladder:"two", target:56, answer:8, unknown:"n",
        options:two(),
        alg:["`{n!}/{(n - 2)!} = 56`", "`n(n - 1) = 56`", "`n^2 - n - 56 = 0`", "`(n - 8)(n + 7) = 0`", "`n = 8` or `n = -7`"],
        roots:[{ t:"Keep `n = 8`", ok:true, why:"`n` counts objects, so it’s a whole number. `P(8, 2) = 8 × 7 = 56`." },
               { t:"Keep `n = -7`", why:"You can’t choose from −7 people. " + M5 },
               { t:"Keep both", why:"−7 satisfies the quadratic, but you can’t have −7 people. " + M5 }] },
      { id:"s2", eq:"`P(n, 3) = 4 × P(n, 2)`", ask:"Write both sides as products. Which equation do you get?", ladder:"pair", mult:4, answer:6, unknown:"n",
        options:[
          { t:"`n(n - 1)(n - 2) = 4n(n - 1)`", ok:true, why:"Three factors on the left, two on the right." },
          { t:"`n^3 = 4n^2`", why:"That lets objects repeat. " + M2 },
          { t:"`{n!}/{3!} = 4 × {n!}/{2!}`", why:"Divide by the factorial of the objects <strong>left out</strong>: `(n - 3)!` and `(n - 2)!`." },
          { t:"`3n = 4 × 2n`", why:"`n × r` isn’t a counting rule. Use `n`, `n - 1`, … for `r` places." }],
        alg:["`n(n - 1)(n - 2) = 4n(n - 1)`", "Divide both sides by `n(n - 1)`, which isn’t 0 because `n ≥ 3`.", "`n - 2 = 4`", "`n = 6`. Check: `P(6, 3) = 120 = 4 × 30 = 4 × P(6, 2)`."] },
      { id:"s3", eq:"`P(7, r) = 210`", ask:"Which expression equals `P(7, r)`?", ladder:"seven", target:210, answer:3, unknown:"r",
        options:[
          { t:"7 × 6 × 5 × ⋯, with `r` factors", ok:true, why:"Each place has one fewer choice: start at 7 and stop after `r` factors." },
          { t:"`7^r`", why:"That lets objects repeat. " + M2 },
          { t:"`{7!}/{r!}`", why:"Divide by the factorial of the objects <strong>left out</strong>: `(7 - r)!`." },
          { t:"`7r`", why:"`n × r` isn’t a counting rule. Use 7, 6, … for `r` places." }],
        alg:["`{7!}/{(7 - r)!} = 210`", "`(7 - r)! = {5040}/{210} = 24 = 4!`", "`7 - r = 4`", "`r = 3`. Check: 7 × 6 × 5 = 210."] },
      { id:"s4", eq:"`P(n, 2) = 30`", ask:"Which expression equals `P(n, 2)`?", ladder:"two", target:30, answer:6, unknown:"n",
        options:two(),
        alg:["`{n!}/{(n - 2)!} = 30`", "`n(n - 1) = 30`", "`n^2 - n - 30 = 0`", "`(n - 6)(n + 5) = 0`", "`n = 6` or `n = -5`"],
        roots:[{ t:"Keep `n = 6`", ok:true, why:"`n` counts objects, so it’s a whole number. `P(6, 2) = 6 × 5 = 30`." },
               { t:"Keep `n = -5`", why:"You can’t choose from −5 people. " + M5 },
               { t:"Keep both", why:"−5 satisfies the quadratic, but you can’t have −5 people. " + M5 }] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Permutations as equations quick check",
      items:[
        { id:"q1", goal:4, prompt:"Solve `P(n, 2) = 42`.",
          choices:[
            { t:"7", ok:true, fb:"Right. `n(n - 1) = 42 = 7 × 6`, so `n = 7`." },
            { t:"6", fb:"`n(n - 1) = 42 = 7 × 6`." },
            { t:"42", fb:"`n(n - 1) = 42 = 7 × 6`." },
            { t:"−6", fb:"`n(n - 1) = 42 = 7 × 6`." }] },
        { id:"q2", goal:4, prompt:"Solve `P(n, 3) = 4 × P(n, 2)`.",
          choices:[
            { t:"6", ok:true, fb:"Right. `P(n, 3) = P(n, 2) × (n - 2)`, so `n - 2 = 4` and `n = 6`." },
            { t:"4", fb:"`P(n, 3) = P(n, 2) × (n - 2)`, so `n - 2 = 4`." },
            { t:"2", fb:"`P(n, 3) = P(n, 2) × (n - 2)`, so `n - 2 = 4`." },
            { t:"12", fb:"`P(n, 3) = P(n, 2) × (n - 2)`, so `n - 2 = 4`." }] },
        { id:"q3", goal:4, prompt:"Solve `P(7, r) = 210`.",
          choices:[
            { t:"3", ok:true, fb:"Right. 7 × 6 × 5 = 210: three factors, so `r = 3`." },
            { t:"4", fb:"7 × 6 × 5 = 210: three factors." },
            { t:"2", fb:"7 × 6 × 5 = 210: three factors." },
            { t:"5", fb:"7 × 6 × 5 = 210: three factors." }] },
        { id:"q4", goal:4, prompt:"Why reject `n = -7` in `n^2 - n - 56 = 0`?",
          choices:[
            { t:"`n` counts objects, so it’s a whole number ≥ 2", ok:true, fb:"Right. −7 satisfies the quadratic, but you can’t have −7 people." },
            { t:"−7 makes the product negative", fb:"−7 satisfies the quadratic, but you can’t have −7 people." },
            { t:"Negative roots are always wrong", fb:"−7 satisfies the quadratic, but you can’t have −7 people." },
            { t:"−7 doesn’t satisfy the quadratic", fb:"−7 satisfies the quadratic, but you can’t have −7 people." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"sorter", title:"Order, no order, or repeats?", summary:"Order, no order, or repeats?", goal:[1, 5], noun:"situation", txt:true,
        instruction:"Sort each situation. Ask two questions: does order matter, and can the same item be used twice?",
        boxes:[
          { id:"perm", label:"Order matters, no repeats: `P(n, r)`" },
          { id:"none", label:"Order doesn’t matter" },
          { id:"rep", label:"Repeats allowed: `n^r`" }],
        wrongDefault:"Ask the two checks: would swapping two choices give something different, and can the same item be used twice?",
        items:[
          { id:"i1", t:"Awarding gold, silver and bronze to 3 of 12 skaters", answer:"perm", goal:1,
            why:"Different medals make the order matter, and no skater wins twice: `P(12, 3)`.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order matters, no repeats: swapping two skaters changes who gets gold, and nobody wins twice."] },
          { id:"i2", t:"Choosing 3 toppings from 10", answer:"none", goal:1,
            why:"Pepperoni–olive is the same pizza as olive–pepperoni.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order doesn’t matter: the same toppings in any order make the same pizza."] },
          { id:"i3", t:"A 4-digit PIN where digits may repeat", answer:"rep", goal:5,
            why:"Each of the 4 digits has 10 choices: `10^4`.",
            wrong:{ perm:"The PIN can reuse digits: `10^4`." },
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Repeats allowed: the digits may repeat, so it’s `10^4`."] },
          { id:"i4", t:"Picking a committee of 4 from 20 students", answer:"none", goal:1,
            why:"Every committee seat is the same, so the order of picking doesn’t matter.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order doesn’t matter: all four seats on a committee are the same."] },
          { id:"i5", t:"Seating 5 guests in 5 numbered chairs", answer:"perm", goal:1,
            why:"Numbered chairs make the order matter, and nobody sits twice: `P(5, 5) = 5!`.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order matters, no repeats: swapping two guests changes who sits in chair 1."] },
          { id:"i6", t:"A licence plate of 3 letters where letters may repeat", answer:"rep", goal:5,
            why:"Each of the 3 letters has 26 choices: `26^3`.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Repeats allowed: letters may repeat, so it’s `26^3`."] },
          { id:"i7", t:"Electing a president, VP and treasurer from 15", answer:"perm", goal:1,
            why:"Different roles make the order matter: `P(15, 3)`.",
            wrong:{ none:"The roles are different, so swapping people changes the slate." },
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order matters, no repeats: the roles are different, and one person can’t hold two roles."] },
          { id:"i8", t:"Choosing 2 library books to borrow from 30", answer:"none", goal:1,
            why:"You borrow the same two books whichever you pick first.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order doesn’t matter: the same two books in either order are the same loan."] },
          { id:"i9", t:"Hanging 4 of 9 photos in a row on a wall", answer:"perm", goal:1,
            why:"A row has a left end and a right end, and each photo hangs once: `P(9, 4)`.",
            wrong:{ none:"A row of photos has a left end and a right end, so order matters." },
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order matters, no repeats: swapping two photos changes the row."] },
          { id:"i10", t:"A 5-card hand from a deck", answer:"none", goal:1,
            why:"A hand is the same in any order.",
            hints:["Would swapping two choices give something different?", "Can the same item be used twice?", "Order doesn’t matter: a hand is the same in any order."] }
        ] },
      { id:"count", type:"numeric", title:"Count it", summary:"Count it", goal:[2, 3, 6], star:true,
        instruction:"Count the arrangements. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number (15 120 and 15120 are both fine), then press Check.",
        items:[
          { id:"n1", goal:3, prompt:"Evaluate `P(9, 4)`.", answer:3024, display:"3024", label:"Number of ways:",
            why:"`P(9, 4) = {9!}/{5!}` = 9 × 8 × 7 × 6 = 3024.",
            wrong:[{ match:15120, fb:"That’s `9!/4!`. Divide by `(9 - 4)! = 5!`." }],
            hints:["How many factors does `P(9, 4)` have?", "Four factors, starting at 9.", "9 × 8 × 7 × 6 = 3024."] },
          { id:"n2", goal:2, prompt:"12 runners: how many ways to fill 1st, 2nd and 3rd?", answer:1320, display:"1320", label:"Number of ways:",
            why:"12 × 11 × 10 = 1320.",
            wrong:[{ match:1728, fb:"`12^3` lets one runner place twice." }],
            hints:["How many runners can finish 1st? How many are left for 2nd?", "12, then 11, then 10.", "12 × 11 × 10 = 1320."] },
          { id:"n3", goal:6, star:true, prompt:"How many even 3-digit numbers with all different digits can be made from 1, 2, 3, 4, 5, 6?", answer:60, display:"60", label:"Number of ways:",
            why:"Last digit: 3 even choices (2, 4 or 6). Then 5 × 4 for the other two: 3 × 5 × 4 = 60.",
            wrong:[{ match:120, fb:"The last digit must be even: 3 choices. Then 5 × 4." }],
            hints:["Which position has a condition? Fill it first.", "The last digit: 3 even choices. Then 5, then 4.", "3 × 5 × 4 = 60."] },
          { id:"n4", goal:6, star:true, prompt:"How many 4-digit numbers have all different digits (digits 0–9)?", answer:4536, display:"4536", label:"Number of ways:",
            why:"9 × 9 × 8 × 7 = 4536.",
            wrong:[{ match:5040, fb:"A number can’t start with 0: 9 × 9 × 8 × 7." }],
            hints:["Which digit can’t go first?", "First digit: 9 choices (1–9). Second digit: 9 (0 is now allowed).", "9 × 9 × 8 × 7 = 4536."] },
          { id:"n5", goal:6, star:true, prompt:"In how many ways can 5 people sit in a row of 8 chairs (3 chairs stay empty)?", answer:6720, display:"6720", label:"Number of ways:",
            why:"Seat the people one at a time: 8 × 7 × 6 × 5 × 4 = 6720 = `P(8, 5)`.",
            wrong:[{ match:56, fb:"People are different and seats are different: `P(8, 5)`." }],
            hints:["Seat the first person. How many chairs can they choose?", "8, then 7, then 6, then 5, then 4.", "`P(8, 5)` = 8 × 7 × 6 × 5 × 4 = 6720."] },
          { id:"n6", goal:6, star:true, prompt:"A club of 10 elects a president, VP and secretary. Two members refuse to serve together. How many slates?", answer:672, display:"672", label:"Number of ways:",
            why:"All slates: `P(10, 3) = 720`. Slates with both: 3 × 2 × 8 = 48. 720 − 48 = 672.",
            wrong:[{ match:720, fb:"Remove the slates with both: 3 × 2 × 8 = 48." }],
            hints:["Count all slates, then subtract the bad ones.", "Both serving: choose their 2 roles in order (3 × 2 = 6), and fill the third role from the other 8 (8 ways).", "720 − 48 = 672."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Gaurav", how:"", goal:[3, 4, 5],
        instruction:"Gaurav made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"How many ways can 4 of 9 students line up for a photo?",
            steps:["Order matters, so this is a permutation.", "`P(9, 4) = {9!}/{4!}`", "= 15" + NB + "120"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"`P(9, 4) = {9!}/{(9 - 4)!} = {9!}/{5!}` = 9 × 8 × 7 × 6 = 3024.", ok:true, why:M1(9, 4) + " Four places leave four factors." },
              { t:"`P(9, 4) = 9^4`.", why:"That allows a student twice." },
              { t:"`P(9, 4)` = 9 × 4.", why:M6(9, 4, "9, 8, 7, 6") },
              { t:"Step 2 is correct.", why:"`9!/4!` keeps 5 factors, but only 4 places are filled." }],
            hints:["How many factors should the answer have?", "4 places: 9 × 8 × 7 × 6.", "Divide by `5!`, not `4!`."] },
          { id:"e2", goal:4, task:"Solve `P(n, 2) = 72`.",
            steps:["`{n!}/{(n - 2)!} = 72`", "`n(n - 1) = 72`", "`n^2 - n - 72 = 0`, so `(n - 9)(n + 8) = 0`", "`n = 9` or `n = -8`: both are answers."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Reject −8, because `n` counts objects: `n = 9`.", ok:true, why:M5 + " Check: `P(9, 2)` = 9 × 8 = 72." },
              { t:"`n = -8` only.", why:M5 },
              { t:"`n = 72`.", why:"72 × 71 is far bigger than 72." },
              { t:"Step 4 is correct.", why:"You can’t choose from −8 people." }],
            hints:["Can a group have −8 people?", "No.", "`n = 9`."] },
          { id:"e3", goal:5, task:"How many 3-digit codes use the digits 0–9 with no repeated digit (0 is allowed first)?",
            steps:["There are 10 choices for each digit.", "10 × 10 × 10 = 1000"],
            answer:0,
            stepFb:["", "Step 2 follows step 1."],
            fixes:[
              { t:"10 choices, then 9, then 8: 10 × 9 × 8 = 720.", ok:true, why:"With no repeats, each used digit is gone, so the choices shrink: 10, 9, 8." },
              { t:"9 × 9 × 8 = 648.", why:"That rule is for numbers, which can’t start with 0. Codes can." },
              { t:"10!", why:"Only 3 positions." },
              { t:"Step 1 is correct.", why:"With no repeats, each used digit is gone." }],
            hints:["Can a digit be used twice?", "No: 10, then 9, then 8.", "720."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the list mode, the repeats comparison, or how each group appears `r!` times?" },
      { id:"j2", q:"In your own words, explain the difference between `P(n, r)` and `n^r`." },
      { id:"j3", q:"Explain to a friend how to decide whether order matters, using an example from your own life." },
      { id:"j4", q:"Which part of permutations still feels shaky? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"Evaluate `P(7, 3)`.", options:[
          { t:"210", ok:true, why:"7 × 6 × 5 = 210." },
          { t:"35", why:"That ignores order: 210 ÷ `3!`." },
          { t:"343", why:"`7^3` allows repeats." },
          { t:"840", why:"`7!/3! = 840`: divide by `4!`, not `3!`." }] },
        b:{ prompt:"Evaluate `P(6, 2)`.", options:[
          { t:"30", ok:true, why:"6 × 5 = 30." },
          { t:"15", why:"That ignores order: 30 ÷ `2!`." },
          { t:"36", why:"`6^2` allows repeats." },
          { t:"360", why:"`6!/2! = 360`: divide by `4!`, not `2!`." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"In which situation does order matter?", options:[
          { t:"Awarding 1st, 2nd and 3rd prizes at a science fair", ok:true, why:"Different prizes make different outcomes." },
          { t:"Choosing 3 students to stay after the event", why:"All three do the same job." },
          { t:"Choosing 3 apps to delete from a phone", why:"The same apps in any order give the same result." },
          { t:"Choosing 3 paint colours for a mural", why:"A set of colours, not a sequence." }] },
        b:{ prompt:"In which situation does order matter?", options:[
          { t:"Assigning 4 swimmers to 4 different lanes", ok:true, why:"Different lanes make different outcomes: swapping two swimmers changes the result." },
          { t:"Picking 4 people for a team", why:"Every spot on the team is the same, so swapping two people gives the same team." },
          { t:"Selecting 4 songs for a download bundle", why:"The same songs in any order give the same bundle." },
          { t:"Packing 4 sweaters for a trip", why:"A set of sweaters, not a sequence." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which expression equals `P(n, r)`?", options:[
          { t:"`{n!}/{(n - r)!}`", ok:true, why:"Divide `n!` by the factorial of the `n - r` objects left out." },
          { t:"`{n!}/{r!}`", why:M1n },
          { t:"`n^r`", why:"That allows repeats. " + M2 },
          { t:"`{n!}/{r!(n - r)!}`", why:"That’s a combination." }] },
        b:{ prompt:"Which expression equals `P(10, 4)`?", options:[
          { t:"`{10!}/{6!}`", ok:true, why:"10 − 4 = 6 objects are left out: `10!/6!` = 10 × 9 × 8 × 7." },
          { t:"`{10!}/{4!}`", why:M1(10, 4) },
          { t:"`10^4`", why:"That allows repeats. " + M2 },
          { t:"`{10!}/{4! × 6!}`", why:"That’s a combination: it ignores order." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Solve `P(n, 2) = 110`.", options:[
          { t:"`n = 11`", ok:true, why:"`n(n - 1) = 110 = 11 × 10`." },
          { t:"`n = 10`", why:"10 × 9 = 90." },
          { t:"`n = 11` or `n = -10`", why:M5 },
          { t:"`n = 55`", why:"Halving doesn’t solve it." }] },
        b:{ prompt:"Solve `P(n, 2) = 132`.", options:[
          { t:"`n = 12`", ok:true, why:"12 × 11 = 132." },
          { t:"`n = 11`", why:"11 × 10 = 110." },
          { t:"`n = 12` or `n = -11`", why:M5 },
          { t:"`n = 66`", why:"Halving doesn’t solve it." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"How many 4-digit odd numbers with all different digits can be made from 1, 2, 3, 4, 5, 6?", options:[
          { t:"180", ok:true, why:"Last digit odd: 3 choices; then 5 × 4 × 3 = 60 for the rest. 3 × 60 = 180." },
          { t:"360", why:"That’s `P(6, 4)`, ignoring ‘odd’." },
          { t:"648", why:"`6^4 ÷ 2` reuses digits." },
          { t:"60", why:"Multiply by the 3 choices for the last digit." }] },
        b:{ prompt:"How many 4-digit even numbers with all different digits can be made from 1, 2, 3, 4, 5, 6, 7?", options:[
          { t:"360", ok:true, why:"Last digit 2, 4 or 6: 3 choices; then `P(6, 3) = 120`. 3 × 120 = 360." },
          { t:"840", why:"That’s `P(7, 4)`, ignoring ‘even’." },
          { t:"1029", why:"That reuses digits: 3 × `7^3`. " + M2 },
          { t:"120", why:"Multiply by 3 for the last digit." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`P(n, 3) = 5 × P(n, 2)`. Find `n`.", options:[
          { t:"`n = 7`", ok:true, why:"`P(n, 3) = P(n, 2)(n - 2)`, so `n - 2 = 5`." },
          { t:"`n = 5`", why:"`n - 2 = 5`, not `n = 5`." },
          { t:"`n = 3`", why:"Reads the 3 from `P(n, 3)`." },
          { t:"`n = 10`", why:"`n × 2 = 10` isn’t the relationship." }] },
        b:{ prompt:"`P(n, 4) = 6 × P(n, 3)`. Find `n`.", options:[
          { t:"`n = 9`", ok:true, why:"`P(n, 4) = P(n, 3)(n - 3)`, so `n - 3 = 6`." },
          { t:"`n = 6`", why:"`n - 3 = 6`, not `n = 6`." },
          { t:"`n = 10`", why:"That solves `n - 4 = 6`. The new factor is `n - 3`." },
          { t:"`n = 3`", why:"Reads the 3 from `P(n, 3)`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why choosing a president, VP and treasurer from 10 people is a permutation?", options:[
          { t:"The three roles are different, so the same three people in different roles give a different slate. Order matters.", ok:true, why:"Different roles make the order matter." },
          { t:"Because exactly three people are chosen.", why:"The number chosen doesn’t decide it." },
          { t:"Because nobody can be chosen twice.", why:"That rules out repeats, but committees also have no repeats; what matters is the roles." },
          { t:"Because 10 is greater than 3.", why:"Irrelevant." }] },
        b:{ prompt:"Which is the best explanation of why choosing 3 people for a committee is <strong>not</strong> a permutation?", options:[
          { t:"All three seats are the same, so rearranging the same people gives the same committee.", ok:true, why:"Identical seats mean order doesn’t matter." },
          { t:"Because people can’t repeat.", why:"Permutations don’t allow repeats either." },
          { t:"Because committees are smaller than clubs.", why:"Irrelevant." },
          { t:"Because `P(n, 3)` is too big to compute.", why:"Size isn’t the reason." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which work for `P(8, 3)` is correct?", options:[
          { t:"`{8!}/{(8 - 3)!} = {8!}/{5!}` = 8 × 7 × 6 = 336", ok:true, why:"The 5 objects left out cancel, leaving 3 factors." },
          { t:"`{8!}/{3!}` = 6720", why:M1(8, 3) },
          { t:"8 × 3 = 24", why:M6(8, 3, "8, 7, 6") },
          { t:"`8^3` = 512", why:"That allows repeats. " + M2 }] },
        b:{ prompt:"Which work for `P(9, 2)` is correct?", options:[
          { t:"`{9!}/{7!}` = 9 × 8 = 72", ok:true, why:"The 7 objects left out cancel, leaving 2 factors." },
          { t:"`{9!}/{2!}` = 181" + NB + "440", why:M1(9, 2) },
          { t:"9 × 2 = 18", why:M6(9, 2, "9, 8") },
          { t:"`9^2` = 81", why:"That allows repeats. " + M2 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A Grade 12 class of 25 elects a president, VP and treasurer. How many slates are possible?", options:[
          { t:"13" + NB + "800", ok:true, why:"25 × 24 × 23 = 13" + NB + "800." },
          { t:"2300", why:"That ignores the roles." },
          { t:"15" + NB + "625", why:"`25^3` lets one student hold two roles." },
          { t:"75", why:M6(25, 3, "25, 24, 23") }] },
        b:{ prompt:"A film festival awards 1st, 2nd and 3rd place to 3 of 15 films. How many outcomes?", options:[
          { t:"2730", ok:true, why:"15 × 14 × 13 = 2730." },
          { t:"455", why:"That ignores the order of the places: 2730 ÷ `3!`." },
          { t:"3375", why:"`15^3` lets one film win twice." },
          { t:"45", why:M6(15, 3, "15, 14, 13") }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A locker code is 2 different letters (A–Z) followed by 3 different digits (0–9). How many codes?", options:[
          { t:"468" + NB + "000", ok:true, why:"26 × 25 = 650 and 10 × 9 × 8 = 720; 650 × 720 = 468" + NB + "000." },
          { t:"676" + NB + "000", why:"`26^2 × 10^3` allows repeats." },
          { t:"1370", why:"650 + 720: the stages happen together, so multiply." },
          { t:"45" + NB + "239" + NB + "040", why:"`P(36, 5)` lets letters and digits go anywhere." }] },
        b:{ prompt:"A code is 3 different letters followed by 2 different digits. How many codes?", options:[
          { t:"1" + NB + "404" + NB + "000", ok:true, why:"26 × 25 × 24 = 15" + NB + "600 and 10 × 9 = 90; 15" + NB + "600 × 90 = 1" + NB + "404" + NB + "000." },
          { t:"1" + NB + "757" + NB + "600", why:"`26^3 × 10^2` allows repeats." },
          { t:"15" + NB + "690", why:"Multiply the stages." },
          { t:"45" + NB + "239" + NB + "040", why:"`P(36, 5)` ignores the letter-then-digit pattern." }] } }
    ]
  },
  task:{
    title:"Code designer", summary:"Code designer",
    statement:"<p>Design a code system with no repeated symbols. Choose how many symbols are available (`n`) and how long each code is (`r`). Meet every condition. Can you find all the answers?</p>" +
      '<ol class="pm-conds"><li>There are at least 1000 possible codes.</li><li>There are at most 3000 possible codes (so the codes stay easy to manage).</li><li>Each code is at least 3 symbols long.</li></ol>',
    checks:["At least 1000 codes", "At most 3000 codes", "Codes of length 3 or more"],
    tips:["Start with `r = 3`: which `n` puts `n(n - 1)(n - 2)` between 1000 and 3000?",
          "`P(9, 4) = 3024` is just over the limit. Try fewer symbols.",
          "Longer codes need fewer symbols: try `r = 5`."],
    explainPrompt:"Explain how you searched for the answers and why longer codes need fewer symbols.",
    vocab:"Use the words permutation, P(n, r) and no repeats.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each extra symbol in the code multiplies by a smaller number, so you need fewer symbols for longer codes."
  },
  cards:[
    ["Permutation", "An arrangement where order matters."],
    ["`P(n, r)`", "`n!/(n - r)! = n(n - 1)⋯(n - r + 1)`. Example: `P(8, 3) = 336`."],
    ["`P(n, n)`", "`n!` (since `0! = 1`)."],
    ["`P(n, 1)`", "`n`."],
    ["Repeats allowed", "`n^r`, not `P(n, r)`. Example: 4-digit PINs: `10^4`."],
    ["Order test", "Swap two choices: if the result changes, order matters."],
    ["Roles vs a committee", "Different roles mean a permutation; identical seats mean a combination."],
    ["Each group of `r`", "appears `r!` times among the permutations."],
    ["`P(n, 2) = 56`", "`n(n - 1) = 56`, so `n = 8` (reject −7)."],
    ["Numbers can’t start with 0", "First digit: 9 choices from 1–9; then 0 is allowed."],
    ["Why not list?", "`P(n, r)` counts thousands of arrangements in one line."]
  ]
};
