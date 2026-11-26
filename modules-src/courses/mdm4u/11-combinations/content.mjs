// MDM4U 11 Combinations: Counting Without Order. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/11-combinations.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item's numbers where the plan names only the code.
const M1 = (r) => "In a committee, {Ana, Ben, Cy} and {Cy, Ana, Ben} are the same group. Count it once: divide by `" + r + "!`.";
const M2 = (r, f) => "Each group of " + r + " appears `" + r + "! = " + f + "` times in the ordered list, not " + r + " times.";
const M3 = "Picking ‘the’ grade 11 first counts a committee with two grade 11s twice. Use cases or the complement.";
const M4 = "Choosing 2 girls <strong>and</strong> 2 boys is two stages: multiply the counts.";
const M5 = "‘At least one’ = total − ‘none’, not total + ‘none’.";
const M6 = "‘At most 2 toppings’ includes 0, 1 and 2 toppings. The plain pizza is one choice.";
const M7 = (n, r) => "`C(" + n + ", " + r + ")` isn’t " + n + " × " + r + ": it counts groups. Use `n! ÷ [r!(n - r)!]`.";

// Practice 1 (Does order matter?): the plan's three hint levels; level 3 is the answer with its reason
const H1 = "Swap two of the chosen items. Is it a new outcome?";
const H2 = "Roles, ranks or positions mean order matters.";
const BOXN = { perm:"Permutation (order matters)", comb:"Combination (order doesn’t matter)" };
const sortHints = (box, why) => [H1, H2, "<strong>" + BOXN[box] + ".</strong> " + why];
const item = (id, t, box, why, wrong) => ({ id, t, answer:box, why, hints:sortHints(box, why), ...(wrong ? { wrong } : {}) });

// the stacked binomial coefficient (n over r): see .cb-bn in app.css
const binom = (a, b) => '<span class="m cb-bn" aria-hidden="true"><span class="cb-bnp">(</span><span class="cb-bns"><span>' + a + "</span><span>" + b + '</span></span><span class="cb-bnp">)</span></span>';

export default {
  id:"11-combinations",
  kind:"topic",
  title:"Combinations: counting without order",
  topic:"Combinations: Counting Without Order",
  readyTopic:"combinations",
  hero:{
    eq:'<span class="cb-heq">`C(n, r) = P(n, r)` <span class="cb-hdiv">÷ <span class="cb-hbox"><span class="cb-hbm">`r!`</span><span class="cb-hbl">orderings of each group</span></span></span></span>' +
      '<span class="cb-halso">also written <span class="m cb-ncr"><sub><i>n</i></sub>C<sub><i>r</i></sub></span> or ' + binom("<i>n</i>", "<i>r</i>") + "</span>",
    eqLabel:"C of n, r equals P of n, r divided by r factorial, the orderings of each group. Also written n C r, or n over r in brackets.", eqSize:"sm",
    headline:"Same people, same committee",
    text:"A <strong>combination</strong> counts selections where <strong>order doesn’t matter</strong>. List the ordered selections, notice that each group shows up `r!` times, and divide: that’s <strong>`C(n, r)`</strong>, read ‘`n` choose `r`’.",
    fig:{ html:'<div class="cb-h" role="img" aria-label="Five people, A, B, C, D and E, sit in a row. Twenty tiles appear, one for each ordered pair: AB, BA, AC, CA and so on. Tiles with the same two letters slide together into stacks of 2, and each stack gets a badge ×2!. Ten stacks remain: 20 ordered pairs ÷ 2! = 10 committees.">' +
      '<svg class="cb-hsvg" id="cb-hsvg" viewBox="0 0 360 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can decide whether order matters and choose between a permutation and a combination.",
    "I can explain and use `C(n, r) = P(n, r) ÷ r! = n! ÷ [r!(n - r)!]`.",
    "I can evaluate combinations by hand by cancelling factorials.",
    "I can solve “at least” and “at most” problems by cases or by the complement.",
    "I can solve for `n` when a combination’s value is given.",
    "I can count selections from two groups with conditions, such as “exactly 2 from each group”."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factorials", goal:3, prompt:"Evaluate `6! ÷ (4! × 2!)`.",
          options:[
            { t:"15", ok:true, why:"720 ÷ (24 × 2) = 15." },
            { t:"30", why:"That ignores the `2!`. `6! ÷ 4!` = 30; you still divide by `2! = 2`." },
            { t:"360", why:"That ignores the `4!`. `6! ÷ 2!` = 360." },
            { t:"3", why:"That divides 6 by 2. Factorials aren’t the numbers themselves." }],
          hints:["Cancel `4!` from `6!`.", "`6! ÷ 4!` = 6 × 5 = 30.", "30 ÷ `2!` = 15."] },
        { id:"w2", skill:"Factorials", goal:3, prompt:"Simplify `10! ÷ 8!`.",
          options:[
            { t:"90", ok:true, why:"10 × 9 × `8! ÷ 8!` = 90." },
            { t:"2", why:"That subtracts. `10! ÷ 8!` isn’t `(10 - 8)!`." },
            { t:"`5/4`", why:"That divides 10 by 8. Cancel the common `8!`." },
            { t:"80", why:"That multiplies 10 × 8. `10! = 10 × 9 × 8!`." }],
          hints:["Write `10!` as `10 × 9 × 8!`.", "The `8!` cancels.", "90."] },
        { id:"w3", skill:"Permutations", goal:1, prompt:"In how many ways can gold, silver and bronze be awarded among 7 runners?",
          options:[
            { t:"210", ok:true, why:"`P(7, 3)` = 7 × 6 × 5." },
            { t:"35", why:"That ignores order. Gold-silver-bronze are different prizes, so order matters." },
            { t:"343", why:"That allows repeats. One runner can’t win two medals." },
            { t:"21", why:"That multiplies 7 × 3, which isn’t a counting rule: 7 choices for gold, then 6 for silver, then 5 for bronze." }],
          hints:["How many choices for gold?", "7, then 6 for silver, then 5.", "210."] },
        { id:"w4", skill:"Permutations", goal:2, prompt:"Evaluate `P(8, 2)`.",
          options:[
            { t:"56", ok:true, why:"8 × 7." },
            { t:"28", why:"That divides by 2: 28 is `C(8, 2)`, not `P(8, 2)`." },
            { t:"16", why:"That’s 8 × 2. `P(8, 2)` = 8 × 7." },
            { t:"64", why:"`8^2` allows repeats." }],
          hints:["`P(n, r) = n! ÷ (n - r)!`.", "`8! ÷ 6!`.", "56."] },
        { id:"w5", skill:"And vs or", goal:6, prompt:"A café offers 4 soups and 3 salads. In how many ways can you choose a soup <strong>and</strong> a salad?",
          options:[
            { t:"12", ok:true, why:"4 × 3: two stages." },
            { t:"7", why:"That adds for “and”. A soup <strong>and</strong> a salad is two stages: multiply." },
            { t:"81", why:"That’s `3^4`. Each stage happens once." },
            { t:"24", why:"That doubles for order. Soup and salad isn’t an ordered pair of the same kind." }],
          hints:["Two stages: multiply.", "4 soups × 3 salads.", "12."] },
        { id:"w6", skill:"And vs or", goal:4, prompt:"Same café. In how many ways can you choose <strong>either</strong> one soup <strong>or</strong> one salad (just one item)?",
          options:[
            { t:"7", ok:true, why:"4 + 3: the choices don’t overlap." },
            { t:"12", why:"That multiplies for “or”. One item from separate menus: add." },
            { t:"1", why:"You choose one item, but there are 7 items to choose from." },
            { t:"14", why:"That doubles. One item from 4 soups or 3 salads: 4 + 3." }],
          hints:["Is it one stage or two?", "One item from two separate menus.", "4 + 3 = 7."] }
      ],
      refreshers:{
        "Factorials":"`n! = n × (n - 1) × … × 1`. To simplify a ratio, write the larger one down to the smaller and cancel: `10!/8!` = 10 × 9.",
        "Permutations":"`P(n, r) = n!/(n - r)!` counts <strong>ordered</strong> selections of `r` from `n`: `P(8, 3)` = 8 × 7 × 6.",
        "And vs or":"‘And’ (stages one after another): multiply. ‘Or’ (one choice from separate options): add."
      }
    }
  },
  explore:{
    heading:"Order eraser",
    intro:"List every ordered selection, then erase the order. Watch how many ordered lists collapse into each committee.",
    predIntro:"Make a prediction first. Then the order eraser will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"list", n:5, r:2 },
        prompt:"How many 2-person committees can be made from 5 people?",
        options:[{ t:"10", ok:true }, { t:"20" }, { t:"25" }, { t:"5" }],
        explain:"AB and BA are the same committee. 20 ordered ÷ `2!` = 10." },
      { id:"p2", start:{ mode:"list", n:4, r:3 },
        prompt:"In the ordered list, how many times does the committee {A, B, C} appear?",
        options:[{ t:"6", ok:true }, { t:"3" }, { t:"4" }, { t:"24" }],
        explain:"3 people can be ordered in `3! = 6` ways." },
      { id:"p3", start:{ mode:"formula", n:6, r:2 },
        prompt:"Which is larger: `C(6, 2)` or `C(6, 4)`?",
        options:[{ t:"They’re equal", ok:true }, { t:"`C(6, 2)`" }, { t:"`C(6, 4)`" }, { t:"It depends on the people" }],
        explain:"Choosing 2 to serve is the same as choosing 4 to stay home." },
      { id:"p4", start:{ mode:"list", n:5, r:5 },
        prompt:"How many committees use all 5 people?",
        options:[{ t:"1", ok:true }, { t:"120" }, { t:"5" }, { t:"0" }],
        explain:"`C(5, 5) = {5!}/{5! 0!} = 1`: there’s only one way to choose everyone." }
    ],
    chalIntro:"Set up the order eraser, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"Set `n` and `r` so there are exactly <strong>35</strong> committees.",
        why:"`C(7, 3) = {7 × 6 × 5}/{6}` = 35, and `C(7, 4)` = 35 too: choosing 3 to serve = choosing 4 to leave out.",
        hints:["Try `n = 7` and change `r`.", "`C(7, 3) = {7 × 6 × 5}/{6}`.", "35: (7, 3), and also (7, 4)."] },
      { id:"tc2", goal:[2, 5], prompt:"Find `n` and `r` where each committee matches exactly <strong>6</strong> slates and there are <strong>20</strong> committees.",
        why:"`r! = 6` means `r = 3`, and `C(6, 3) = 120/6 = 20`.",
        hints:["`r! = 6` tells you `r`.", "`r = 3`; now find `n` with `C(n, 3) = 20`.", "`C(6, 3) = 120/6 = 20`."] },
      { id:"tc3", goal:5, stretch:true, prompt:"With `2 <= n <= 8` and `1 <= r <= n - 1`, find <strong>every</strong> setting that gives exactly <strong>28</strong> committees. Put each one on <strong>Your 28 list</strong> with <strong>Add this setting</strong>.",
        why:"`C(8, 2) = 28` and its partner `C(8, 6) = 28`: choosing 2 of 8 to serve = choosing 6 of 8 to leave out.",
        hints:["`C(n, 2) = n(n - 1)/2`. Which `n` gives 28?", "`n = 8`: 8 × 7/2 = 28.", "Choosing 2 to serve = choosing 6 to leave out, so (8, 6) works too."] }
    ]
  },
  part3:{
    slug:"at-least", name:"At least",
    heading:"At least and at most",
    intro:"“At least” and “at most” questions are where combinations meet the additive principle. At each station, build the count by cases or by the complement, then watch what goes wrong with the “guarantee one first” shortcut.",
    stations:[
      { id:"s1", title:"Two routes to “at least one”",
        problem:"A committee of 4 is chosen from 5 grade 11s and 6 grade 12s. How many include at least one grade 11?",
        zero:"A committee with 0 grade 11s has no grade 11, so it isn’t part of “at least one”. It’s the case the complement route subtracts.",
        done:"Both routes give 315." },
      { id:"s2", title:"“At most”",
        problem:"A committee of 3 is chosen from 4 teachers and 6 students. How many have at most one teacher?",
        tooMany:"“At most one” stops at 1 teacher: this case has too many teachers.",
        missing:"Have you included every case that “at most one” allows? It includes 0 teachers too.",
        done:"0 teachers + 1 teacher: 20 + 60 = 80 (out of `C(10, 3)` = 120)." },
      { id:"s3", title:"The double-count trap",
        problem:"Same club as Station 1: a committee of 4 is chosen from 5 grade 11s and 6 grade 12s. How many include at least one grade 11?",
        claim:"Pick 1 grade 11 to guarantee one (5 ways), then any 3 of the other 10 (`C(10, 3) = 120`): 600.",
        impossible:"600 is bigger than the total 330, which is impossible.",
        m3:M3,
        done:"Every committee with two or more grade 11s is counted more than once." }
    ],
    quickCheck:{
      title:"Quick check", summary:"At least and at most quick check",
      items:[
        { id:"q1", goal:1, prompt:"How many 3-person committees from 7 people?",
          choices:[
            { t:"35", ok:true, fb:"Right. `C(7, 3)` = 210 ÷ 6 = 35." },
            { t:"210", fb:"210 is `P(7, 3)`; divide by `3! = 6`." },
            { t:"21", fb:"7 × 3 isn’t a counting rule. 210 is `P(7, 3)`; divide by `3! = 6`." },
            { t:"343", fb:"`7^3` lets one person be chosen twice. 210 is `P(7, 3)`; divide by `3! = 6`." }] },
        { id:"q2", goal:4, prompt:"Groups of 3 from 4 girls and 5 boys with at least one girl?",
          choices:[
            { t:"74", ok:true, fb:"Right. `C(9, 3) - C(5, 3)` = 84 − 10 = 74." },
            { t:"84", fb:"84 is every group, including the all-boy ones. `C(9, 3) - C(5, 3)` = 84 − 10." },
            { t:"10", fb:"10 is the all-boy groups, the ones to remove. `C(9, 3) - C(5, 3)` = 84 − 10." },
            { t:"94", fb:"That adds the all-boy groups. `C(9, 3) - C(5, 3)` = 84 − 10." }] },
        { id:"q3", goal:1, prompt:"Which is a combination question?",
          choices:[
            { t:"Choosing 3 toppings", ok:true, fb:"Right. Toppings have no order." },
            { t:"Ranking 3 songs", fb:"First place and second place are different, so order matters. Toppings have no order." },
            { t:"A 3-digit PIN", fb:"123 and 321 are different PINs, so order matters. Toppings have no order." },
            { t:"Gold, silver, bronze", fb:"Different medals make order matter. Toppings have no order." }] },
        { id:"q4", goal:4, prompt:"Teams of 3 from 4 boys and 4 girls with at most one boy?",
          choices:[
            { t:"28", ok:true, fb:"Right. 0 boys: `C(4, 3) = 4`; 1 boy: 4 × `C(4, 2)` = 24; total 28." },
            { t:"24", fb:"That’s only the 1-boy teams. 0 boys: `C(4, 3) = 4`; 1 boy: 4 × `C(4, 2)` = 24; total 28." },
            { t:"4", fb:"That’s only the 0-boy teams. 0 boys: `C(4, 3) = 4`; 1 boy: 4 × `C(4, 2)` = 24; total 28." },
            { t:"56", fb:"56 is `C(8, 3)`, every team. 0 boys: `C(4, 3) = 4`; 1 boy: 4 × `C(4, 2)` = 24; total 28." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"sorter", title:"Does order matter?", summary:"Does order matter?", goal:1, noun:"situation", txt:true,
        instruction:"Sort each situation. If you swap two of the chosen items, do you get a different outcome?",
        boxes:[
          { id:"perm", label:"Permutation", sub:"order matters" },
          { id:"comb", label:"Combination", sub:"order doesn’t matter" }],
        wrongDefault:"Ask: if I swap two chosen items, is it a different outcome? Try another box.",
        items:[
          item("i1", "Choosing 3 toppings for a pizza", "comb", "The same toppings in any order make the same pizza."),
          item("i2", "Electing a president, a vice-president and a secretary", "perm", "The roles are different: swapping two people changes the slate."),
          item("i3", "Dealing a 5-card hand", "comb", "A hand is the same whatever order the cards were dealt in."),
          item("i4", "Setting a 4-digit PIN with no repeated digits", "perm", "1234 and 4321 are different PINs."),
          item("i5", "Picking 2 of 9 friends to invite to a movie", "comb", "Inviting Sam and Lee is the same as inviting Lee and Sam."),
          item("i6", "Arranging 4 of 10 books on a shelf", "perm", "A shelf has a left end and a right end: swapping two books changes the arrangement."),
          item("i7", "Choosing 5 starters from 12 players (positions not assigned)", "comb", "No positions are assigned, so it’s just a group.",
            { perm:"No positions are assigned, so it’s just a group." }),
          item("i8", "Giving 3 different prizes to 3 of 20 entrants", "perm", "First prize and third prize aren’t the same; swapping winners changes the outcome.",
            { comb:"First prize and third prize aren’t the same; swapping winners changes the outcome." }),
          item("i9", "Choosing 6 numbers for a lottery ticket", "comb", "A ticket with 3-12-27-30-41-45 wins however the numbers are drawn: order doesn’t matter. (A lottery is a probability model here, not advice: on average, players lose money.)",
            { perm:"A ticket with 3-12-27-30-41-45 wins however the numbers are drawn: order doesn’t matter." }),
          item("i10", "Ranking your top 3 songs from 15", "perm", "First place and second place are different ranks.")
        ] },
      { id:"count", type:"numeric", title:"Count it", summary:"Count it", goal:[2, 3, 4, 5, 6], star:true,
        instruction:"Count the selections. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"c1", goal:3, prompt:"Evaluate `C(9, 4)`.", answer:126, display:"126", label:"Your answer:",
            why:"`C(9, 4) = {9 × 8 × 7 × 6}/{4 × 3 × 2 × 1}` = 3024 ÷ 24 = 126.",
            wrong:[{ match:3024, fb:"That’s `P(9, 4)`; divide by `4! = 24`." }, { match:36, fb:M7(9, 4) }] },
          { id:"c2", goal:2, prompt:"A pizza place has 10 toppings. How many 3-topping pizzas?", answer:120, display:"120", label:"Your answer:",
            why:"`C(10, 3) = {10 × 9 × 8}/{3 × 2 × 1}` = 720 ÷ 6 = 120.",
            wrong:[{ match:720, fb:"720 counts ordered picks. {mushroom, olive, pepper} and {pepper, mushroom, olive} are the same pizza. Count it once: divide by `3!`." },
                   { match:30, fb:M7(10, 3) }] },
          { id:"c3", goal:6, star:true, prompt:"A committee of 5 is chosen from 6 women and 4 men. How many have exactly 2 men?", answer:120, display:"120", label:"Your answer:",
            why:"Choose the 2 men and the 3 women: `C(4, 2) × C(6, 3)` = 6 × 20 = 120.",
            wrong:[{ match:21, fb:"6 + 15? Choosing 2 men <strong>and</strong> 3 women: multiply `C(4, 2) × C(6, 3)`." },
                   { match:26, fb:"6 + 20 adds the stages. Choosing 2 men <strong>and</strong> 3 women: multiply `C(4, 2) × C(6, 3)`." }] },
          { id:"c4", goal:4, star:true, prompt:"Same group. How many committees of 5 include at least one man?", answer:246, display:"246", label:"Your answer:",
            why:"Total `C(10, 5)` = 252; no men `C(6, 5)` = 6; 252 − 6 = 246.",
            wrong:[{ match:258, fb:"Subtract the all-women committees: 252 − 6." }, { match:252, fb:"252 is every committee, including the 6 with no men. Subtract them: 252 − 6." }],
            hints:["‘At least one man’ is easier as total − none.", "Total `C(10, 5)` = 252; no men `C(6, 5)` = 6.", "246."] },
          { id:"c5", goal:5, star:true, prompt:"At a party everyone shakes hands once with everyone else: 15 handshakes. How many people?", answer:6, display:"6 people", label:"Number of people:",
            why:"`C(n, 2) = {n(n - 1)}/{2}` = 15, so `n(n - 1) = 30` = 6 × 5: 6 people.",
            wrong:[{ match:15, fb:"15 is the number of handshakes: solve `C(n, 2) = 15`." }, { match:30, fb:"`n(n - 1)/2 = 15`, so `n(n - 1) = 30`." }] },
          { id:"c6", goal:6, star:true, prompt:"How many diagonals does a 10-sided polygon have?", answer:35, display:"35", label:"Your answer:",
            why:"`C(10, 2)` = 45 segments join two corners; 10 of them are sides, so 45 − 10 = 35 diagonals.",
            wrong:[{ match:45, fb:"`C(10, 2) = 45` counts every segment joining two corners, including the 10 sides." }],
            hints:["Any two corners make a segment.", "`C(10, 2)` = 45 segments.", "45 − 10 sides = 35."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Kalinda", how:"", goal:[1, 3, 4],
        instruction:"Kalinda made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"In how many ways can 3 class reps be chosen from 8 students? (All reps have the same role.)",
            steps:["The reps are picked one at a time, so order matters.", "`P(8, 3)` = 8 × 7 × 6 = 336."],
            answer:0,
            stepFb:["", "Step 2 calculates `P(8, 3)` correctly. The mistake is earlier."],
            fixes:[
              { t:"The reps share one role, so order doesn’t matter: `C(8, 3)` = 336 ÷ `3!` = 56.", ok:true, why:"One role means a group is a group: each group of 3 appears `3! = 6` times among the 336 ordered picks." },
              { t:"8 × 3 = 24.", why:"That isn’t a counting formula." },
              { t:"`8^3` = 512.", why:"A student can’t be chosen twice." },
              { t:"Step 1 is correct.", why:"Choosing Ana, then Ben, then Cy gives the same reps as Cy, Ben, Ana." }],
            hints:["Do the reps have different jobs?", "No, so a group is a group.", "56."] },
          { id:"e2", goal:4, task:"How many 3-person committees from 4 grade 11s and 5 grade 12s include at least one grade 12?",
            steps:["All committees: `C(9, 3)` = 84.", "Committees with no grade 12s: `C(4, 3)` = 4.", "At least one grade 12: 84 + 4 = 88."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", ""],
            fixes:[
              { t:"84 − 4 = 80.", ok:true, why:M5 + " Remove the 4 committees with no grade 12s." },
              { t:"`C(5, 1) × C(8, 2)` = 140.", why:"That guarantees one, then double-counts." },
              { t:"4 × 5 = 20.", why:"That’s not a committee count." },
              { t:"Step 3 is correct.", why:"88 is more than the 84 committees that exist." }],
            hints:["Can ‘at least one’ be more than the total?", "Remove the committees you don’t want.", "84 − 4 = 80."] },
          { id:"e3", goal:3, task:"Evaluate `C(10, 4)`.",
            steps:["`C(10, 4) = 10! ÷ (4! × 6!)`.", "= (10 × 9 × 8 × 7) ÷ 4 = 1260.", "So `C(10, 4)` = 1260."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"(10 × 9 × 8 × 7) ÷ (4 × 3 × 2 × 1) = 5040 ÷ 24 = 210.", ok:true, why:"The `6!` cancels, and what’s left is divided by all of `4! = 24`." },
              { t:"10 × 4 = 40.", why:M7(10, 4) },
              { t:"`10! ÷ 6!` = 5040.", why:"That’s `P(10, 4)`, the ordered count." },
              { t:"Step 2 is correct.", why:M2(4, 24) }],
            hints:["What does `4!` equal?", "24, not 4.", "5040 ÷ 24 = 210."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the order eraser: how many ordered lists collapse into one committee, or that `C(6, 2) = C(6, 4)`?" },
      { id:"j2", q:"In your own words, why do we divide by `r!` to get from permutations to combinations?" },
      { id:"j3", q:"Explain to a friend how to count ‘at least one’ without double-counting." },
      { id:"j4", q:"Which kind of question still trips you up (order or no order, ‘at least’, two groups)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In how many ways can 3 people be chosen from 8 to form a committee?", options:[
          { t:"56", ok:true, why:"`C(8, 3)` = 336 ÷ 6." },
          { t:"336", why:"That counts ordered slates. " + M1(3) },
          { t:"24", why:"8 × 3 isn’t a combination." },
          { t:"512", why:"`8^3` lets the same person be chosen more than once." }] },
        b:{ prompt:"In how many ways can 2 people be chosen from 9 to form a committee?", options:[
          { t:"36", ok:true, why:"`C(9, 2)` = 72 ÷ 2." },
          { t:"72", why:"That counts ordered pairs. " + M1(2) },
          { t:"18", why:M7(9, 2) },
          { t:"81", why:"`9^2` repeats people." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which expression equals `C(n, r)`?", options:[
          { t:"`P(n, r) ÷ r!`", ok:true, why:"Each group appears `r!` times among the ordered selections." },
          { t:"`P(n, r) × r!`", why:"Multiplying makes the count bigger, not smaller." },
          { t:"`n! ÷ r!`", why:"The `(n - r)!` is missing." },
          { t:"`P(n, r) ÷ r`", why:"Each group of `r` appears `r!` times in the ordered list, not `r` times." }] },
        b:{ prompt:"Which expression equals `C(7, 3)`?", options:[
          { t:"`7! ÷ (3! × 4!)`", ok:true, why:"Divide `7!` by `4!` for the 4 people left out and by `3!` for the orders of each group." },
          { t:"`7! ÷ 4!`", why:"That’s `P(7, 3)`. " + M1(3) },
          { t:"`7! ÷ 3!`", why:"Divide by both `3!` and `4!`." },
          { t:"`(7 × 6 × 5) ÷ 3`", why:M2(3, 6) }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which situation is counted by `C(10, 3)`?", options:[
          { t:"Choosing 3 toppings from 10", ok:true, why:"No order: a set of toppings." },
          { t:"Awarding gold, silver and bronze among 10 runners", why:"Different medals: `P(10, 3)`." },
          { t:"Making a 3-digit code from the digits 0–9", why:"Digits can repeat and order matters: `10^3`." },
          { t:"Arranging 3 of 10 books on a shelf", why:"A shelf has an order: swapping two books changes it, so that’s `P(10, 3)`." }] },
        b:{ prompt:"Which situation is counted by `C(12, 4)`?", options:[
          { t:"Choosing 4 volunteers from 12", ok:true, why:"The volunteers have no roles: a group of 4." },
          { t:"Choosing the running order of a 4-person relay from 12", why:"A running order is ordered: `P(12, 4)`." },
          { t:"Making a 4-letter code from 12 letters, repeats allowed", why:"That’s `12^4`." },
          { t:"Seating 4 of 12 guests in a row", why:"A row has an order: `P(12, 4)`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A committee of 4 is chosen from 6 women and 5 men. How many committees include at least one man?", options:[
          { t:"315", ok:true, why:"`C(11, 4) - C(6, 4)` = 330 − 15." },
          { t:"600", why:"5 × `C(10, 3)` counts some committees more than once." },
          { t:"345", why:"Subtract the all-women committees; don’t add them." },
          { t:"100", why:"`C(5, 1) × C(6, 3)` counts exactly one man only." }] },
        b:{ prompt:"A committee of 4 is chosen from 5 women and 7 men. How many include at least one woman?", options:[
          { t:"460", ok:true, why:"`C(12, 4) - C(7, 4)` = 495 − 35." },
          { t:"825", why:"5 × `C(11, 3)` double-counts." },
          { t:"530", why:M5 + " 495 − 35." },
          { t:"175", why:"That’s exactly one woman." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Every pair in a group of `n` players plays exactly one game: 28 games in all. Find `n`.", options:[
          { t:"8", ok:true, why:"`C(n, 2) = 28` means `n(n - 1) = 56`, so `n = 8`." },
          { t:"7", why:"`C(7, 2) = 21`." },
          { t:"14", why:"28 ÷ 2 = 14 treats `C(n, 2)` as `n × 2`." },
          { t:"56", why:"56 = `n(n - 1)`, not `n`." }] },
        b:{ prompt:"Every pair in a group of `n` players plays exactly one game: 66 games in all. Find `n`.", options:[
          { t:"12", ok:true, why:"`n(n - 1) = 132`, so `n = 12`." },
          { t:"11", why:"`C(11, 2) = 55`." },
          { t:"33", why:"66 ÷ 2 = 33 treats `C(n, 2)` as `n × 2`." },
          { t:"132", why:"132 = `n(n - 1)`, not `n`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A pizza shop has 8 toppings. How many different pizzas have at most 2 toppings (a plain pizza counts)?", options:[
          { t:"37", ok:true, why:"`C(8, 0) + C(8, 1) + C(8, 2)` = 1 + 8 + 28." },
          { t:"36", why:"The plain pizza is one more choice." },
          { t:"28", why:"‘At most 2’ includes 0 and 1 topping too." },
          { t:"65", why:"1 + 8 + 56 uses `P(8, 2)` for 2 toppings, but toppings have no order." }] },
        b:{ prompt:"A pizza shop has 7 toppings. How many different pizzas have at most 2 toppings (a plain pizza counts)?", options:[
          { t:"29", ok:true, why:"1 + 7 + 21." },
          { t:"28", why:M6 + " 1 + 7 + 21." },
          { t:"21", why:"‘At most 2’ includes 0 and 1 topping too." },
          { t:"50", why:"1 + 7 + 42 uses `P(7, 2)`, but toppings have no order." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `C(n, r) = P(n, r) ÷ r!`?", options:[
          { t:"`P(n, r)` lists every ordered selection. Each unordered group of `r` appears in `r!` different orders, so dividing by `r!` counts each group once.", ok:true, why:"It says what `r!` counts: the orders of one group." },
          { t:"Combinations are always smaller, so you divide by something.", why:"True but it doesn’t say why `r!`." },
          { t:"Because `r!` is the number of people left out.", why:"`(n - r)!` relates to the people left out, not `r!`." },
          { t:"Dividing by `r!` removes repeated people.", why:"No one is repeated in `P(n, r)`; it’s repeated <strong>orders</strong>." }] },
        b:{ prompt:"Which is the best explanation of why there are fewer committees of 3 than slates of president, VP and treasurer from the same club?", options:[
          { t:"Each committee of 3 can be turned into `3! = 6` different slates by assigning the roles, so slates are 6 times as many.", ok:true, why:"Assigning the 3 roles to one committee gives `3!` slates." },
          { t:"Committees have fewer people.", why:"Both use 3 people." },
          { t:"Slates allow the same person twice.", why:"No one holds two offices." },
          { t:"Committees divide by 3 because there are 3 people.", why:"Each committee matches `3! = 6` slates, not 3." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which statement is written correctly?", options:[
          { t:"The number of 3-person committees from 9 people is `C(9, 3)` = 84.", ok:true, why:"`C(9, 3) = {9 × 8 × 7}/{3 × 2 × 1}` = 84, and a committee is a combination." },
          { t:"`P(9, 3)` = 84.", why:"`P(9, 3)` = 504." },
          { t:"`C(9, 3)` = 504.", why:"That’s the permutation value." },
          { t:"₉C₃ = 9 × 3 = 27.", why:M7(9, 3) }] },
        b:{ prompt:"Which statement is written correctly?", options:[
          { t:"The number of 4-person teams from 10 people is `C(10, 4)` = 210.", ok:true, why:"`C(10, 4) = {10 × 9 × 8 × 7}/{4 × 3 × 2 × 1}` = 210, and a team without roles is a combination." },
          { t:"`P(10, 4)` = 210.", why:"`P(10, 4)` = 5040; 210 is the combination." },
          { t:"`C(10, 4)` = 5040.", why:"That’s `P(10, 4)`." },
          { t:"₁₀C₄ = 10 × 4 = 40.", why:M7(10, 4) }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A student council has 7 grade 11s and 5 grade 12s. A committee of 4 must have exactly 2 from each grade. How many committees are possible?", options:[
          { t:"210", ok:true, why:"`C(7, 2) × C(5, 2)` = 21 × 10." },
          { t:"31", why:"21 + 10 adds the stages; multiply instead." },
          { t:"495", why:"`C(12, 4)` ignores the 2-and-2 rule." },
          { t:"840", why:"`P(7, 2) × P(5, 2)` orders each pair." }] },
        b:{ prompt:"A council has 6 grade 11s and 4 grade 12s. A committee of 4 must have exactly 2 from each grade. How many committees are possible?", options:[
          { t:"90", ok:true, why:"`C(6, 2) × C(4, 2)` = 15 × 6." },
          { t:"21", why:"15 + 6 adds the stages. " + M4 },
          { t:"210", why:"`C(10, 4)` ignores the rule." },
          { t:"360", why:"`P(6, 2) × P(4, 2)` orders each pair." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"How many diagonals does an octagon (8 sides) have?", options:[
          { t:"20", ok:true, why:"`C(8, 2)` = 28 segments, minus the 8 sides." },
          { t:"28", why:"Those are all segments, including the sides." },
          { t:"56", why:"`P(8, 2)` counts each segment twice." },
          { t:"40", why:"8 × 5 counts each diagonal from both ends." }] },
        b:{ prompt:"How many diagonals does a hexagon (6 sides) have?", options:[
          { t:"9", ok:true, why:"`C(6, 2)` − 6 = 15 − 6." },
          { t:"15", why:"Subtract the 6 sides." },
          { t:"30", why:"`P(6, 2)` counts each segment twice." },
          { t:"18", why:"6 × 3 counts each diagonal twice." }] } }
    ]
  },
  task:{
    title:"The fair committee", summary:"The fair committee",
    statement:"<p>A club has some grade 11s and some grade 12s. A committee of 3 will be chosen. Design the club so every condition holds. Can you find all the answers?</p>" +
      '<ol class="cb-conds"><li>Fewer than 10 possible committees are all grade 11s.</li><li>At least 100 possible committees include at least one grade 11.</li><li>There are at most 200 possible committees in total.</li></ol>',
    checks:["Fewer than 10 all-grade-11 committees", "At least 100 with a grade 11", "At most 200 committees"],
    tips:["`C(5, 3) = 10` already, so keep `g` at 4 or fewer.", "Use the complement: total minus the all-grade-12 committees.", "`C(12, 3) = 220` is too many; keep the club at 11 or fewer."],
    explainPrompt:"Explain how you counted the committees with at least one grade 11, and why the club size had to be 10 or 11.",
    vocab:"Use the words combination, complement, at least and total.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"(4, 6) sits exactly on 100. Every answer has 10 or 11 members: smaller clubs fail line 2, larger ones fail line 3."
  },
  cards:[
    ["Combination", "A selection where order doesn’t matter: committees, hands, toppings."],
    ["Permutation vs combination", "Swap two chosen items: a new outcome means permutation; the same outcome means combination."],
    ["`C(n, r)`", "`n! ÷ [r!(n - r)!]`, read “`n` choose `r`”."],
    ["From P to C", "`C(n, r) = P(n, r) ÷ r!`: each group appears `r!` times in order."],
    ["`C(8, 3)` by hand", "(8 × 7 × 6) ÷ (3 × 2 × 1) = 56."],
    ["`C(n, 0)` and `C(n, n)`", "Both equal 1: one way to choose nobody, one way to choose everyone."],
    ["Symmetry", "`C(n, r) = C(n, n - r)`: choosing who serves = choosing who stays out."],
    ["“At least one”", "Total − “none”."],
    ["“At most 2”", "Add the cases 0, 1 and 2."],
    ["Two groups", "“2 girls and 2 boys”: `C(g, 2) × C(b, 2)`."],
    ["The double-count trap", "“Guarantee one, then choose the rest” counts some groups twice."],
    ["Handshakes", "`n` people, everyone shakes once: `C(n, 2)` handshakes."]
  ]
};
