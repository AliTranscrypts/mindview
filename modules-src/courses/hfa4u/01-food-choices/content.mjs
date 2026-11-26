// HFA4U 01 Factors Influencing Food Choices. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/01-food-choices.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags; students see the plan's wording without them.

// VERIFY: helpline numbers before release (plan §1 support note; course plan §2 wording).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';

// The six influences (Explore dials, web threads, sorter boxes)
const INF = [
  { k:"bio", name:"Biological", web:"Biological", hero:"Biology" },
  { k:"eco", name:"Economic", web:"Economic", hero:"Money" },
  { k:"acc", name:"Physical access and time", web:"Access and time", hero:"Access and time" },
  { k:"soc", name:"Social and cultural", web:"Social and cultural", hero:"Family, culture and faith" },
  { k:"psy", name:"Psychological", web:"Psychological", hero:"Mood and habits" },
  { k:"med", name:"Media", web:"Media", hero:"Media" }
];
const NOEV = "Nothing in the profile points to stress, mood or habit driving this choice.";
const NOMED = "Nothing in the profile mentions ads or creators.";

// Lever: id, label, influences, weekly cost (card text), new likely choice, dial changes (−1 lower, +1 higher, 0 shifts), extras
const lv = (id, t, inf, cost, choice, fx, x) => Object.assign({ id, t, inf, cost, choice, fx }, x || {});

// Explore data. Keyed situations (plan "Keys for Mode 1") store the key as `answer`; the others carry a model web for
// "Change one thing" and are reported but not tested in "Read the web". Lever tables: the plan's excerpt plus authored levers.
const PERSONAS = [
  { id:"devon", name:"Devon", age:17, profile:"Works three evening shifts a week at a grocery store, plays basketball, and has 25 minutes for lunch.",
    sits:[
      { id:"devon-lunch", name:"School-day lunch", note:"Lunch is 25 minutes, and the cafeteria line takes 10 of them.",
        choice:"A slice of cafeteria pizza, because that line is fastest", barrier:"a 25-minute lunch", enabler:"money from his job",
        model:[2, 1, 3, 2, 1, 1],
        levers:[
          lv("leftovers", "Packs dinner leftovers the night before", ["acc"], "$0 extra", "Leftover pasta and vegetables, eaten right away", { acc:-1 }, { en:"lunch ready in his bag" }),
          lv("grab", "School opens a grab-and-go fridge with wraps and salads", ["acc"], "About the same as pizza", "A wrap and a salad from the grab-and-go fridge", { acc:-1 }, { en:"a faster line" }),
          lv("longer", "Lunch period grows to 40 minutes", ["acc"], "$0", "A hot lunch from the full menu", { acc:-1 }, { en:"more time" }),
          lv("friends", "His friends start eating at the soup-and-sandwich counter", ["soc"], "About the same as pizza", "Soup and a sandwich with his friends", { soc:0 }, { en:"friends at the counter" }),
          lv("cheap", "Cafeteria pizza drops to $2 a slice", ["eco"], "Saves about $1 a day", "Two slices of pizza", { eco:1 }, { bar:"cheaper pizza" }),
          lv("creator", "Follows a creator who posts game-day lunches", ["med"], "$0", "Packs the creator’s rice bowl on game days", { med:1 }, { en:"a new lunch idea" })
        ] },
      { id:"devon-practice", name:"After-practice snack", note:"Practice ends half an hour before his shift starts. His teammates head straight to the vending machine by the gym door.",
        choice:"Vending-machine chips on the way to work", barrier:"half an hour between practice and work", enabler:"money from his job",
        answer:[3, 1, 3, 2, 1, 1],
        ev:{ bio:"He’s just finished practice: hunger is pulling hard.", eco:"Devon earns money from his job; cost isn’t his main barrier.",
          acc:"Practice ends half an hour before his shift, and the vending machine is the closest food.", soc:"His teammates snack together after practice: a real pull, but not the strongest.",
          psy:NOEV, med:"Nothing in his profile mentions ads or creators." },
        levers:[
          lv("pack", "Packs a snack the night before", ["acc"], "$0 extra", "Packed fruit, yogurt and crackers instead of vending-machine chips", { acc:-1 }, { en:"a snack ready in his bag" }),
          lv("fridge", "Team fridge stocked with milk and bananas", ["acc", "soc"], "$0 (team-funded)", "Milk and a banana from the team fridge", { acc:-1, soc:0 }, { en:"the team fridge" }),
          lv("discount", "Uses his staff discount at work before his shift", ["eco"], "Saves a little", "A sandwich and an apple from the grocery store where he works", { eco:-1 }, { en:"his staff discount" }),
          lv("biglunch", "Packs a bigger lunch on practice days", ["bio"], "$0 extra", "A smaller snack, because he’s less hungry after practice", { bio:-1 }, { en:"a bigger lunch" }),
          lv("scoreboard", "Sees an energy-drink ad on the gym scoreboard", ["med"], "$3 a can", "Chips and an energy drink", { med:1 }, { bar:"the scoreboard ad" }),
          lv("late", "Practice runs 15 minutes later", ["acc"], "$0", "Chips from the vending machine, eaten on the run", { acc:1 }, { bar:"even less time" })
        ] }
    ] },
  { id:"amira", name:"Amira", age:16, profile:"Her family keeps halal; they live in a downtown apartment two blocks from four fast-food outlets. Both parents work late shifts, and the budget is tight but steady.",
    sits:[
      { id:"amira-snack", name:"After-school snack", note:"School ends at 3:15, and her parents get home after 7. Few of the nearby outlets are halal-certified.",
        choice:"Chips from the corner store, or nothing until dinner", barrier:"few halal options nearby", enabler:"a steady family budget",
        model:[2, 3, 2, 3, 1, 1],
        levers:[
          lv("program", "School starts a halal-certified after-school snack program", ["eco", "soc"], "$0 (free to students)", "She eats the program snack: pita, hummus and fruit", { eco:-1, soc:-1 }, { en:"free halal snacks at school" }),
          lv("pack", "Packs dates and a cheese sandwich in the morning", ["acc"], "$0 extra", "Dates and a cheese sandwich from home", { acc:-1 }, { en:"a snack ready in her bag" }),
          lv("shop", "A halal-certified falafel shop opens nearby", ["soc"], "About $8 a wrap", "A falafel wrap from the new shop, some days", { soc:-1 }, { en:"a halal shop nearby" }),
          lv("swap", "Friends start a snack swap at their lockers", ["soc"], "$0", "Shares snacks with friends after class", { soc:0 }, { en:"friends who share" }),
          lv("deal", "Corner store runs a two-for-one chip deal", ["eco"], "Saves $2", "Two bags of chips", { eco:1 }, { bar:"the chip deal" }),
          lv("project", "Stays late for a stressful group project", ["psy"], "$0", "Skips the snack, then is very hungry at dinner", { psy:1 }, { bar:"stress" })
        ] },
      { id:"amira-dinner", name:"Weeknight dinner", note:"Both parents work late shifts, so dinner is often after 8. The fast-food outlets nearby rarely fit the family’s halal practice.",
        choice:"Halal takeout most weeknights", barrier:"late shifts", enabler:"a steady family budget",
        answer:[2, 2, 3, 3, 1, 1],
        ev:{ bio:"Everyone is hungry after a long day, but hunger isn’t what decides the meal.", eco:"The budget is tight but steady: cost matters without being the biggest pull.",
          acc:"Both parents work late shifts, so there’s little time to shop or cook.", soc:"The family keeps halal and eats together, so food practices shape every option.",
          psy:NOEV, med:NOMED },
        levers:[
          lv("batch", "The family batch-cooks lentil soup on Sundays", ["acc"], "$0 extra", "Reheated lentil soup and rice on shift nights", { acc:-1 }, { en:"meals ready ahead" }),
          lv("slow", "Buys a slow cooker", ["acc"], "$10 a week for the first months", "A stew that cooks while everyone is out", { acc:-1 }, { en:"a slow cooker" }),
          lv("kitchen", "Joins the community centre’s monthly shared-meal kitchen", ["soc", "acc"], "$3 a week", "Shared-meal portions to take home, plus new recipes", { soc:0, acc:-1 }, { en:"a community kitchen" }),
          lv("kit", "Meal-kit delivery three nights a week", ["acc"], "$30 a week", "Meal kits three nights, takeout the rest", { acc:-1 }, { en:"meal kits" }),
          lv("frozen", "Buys frozen vegetables in bulk at a discount grocer", ["eco"], "$0 extra", "Takeout with a side of frozen vegetables", { eco:-1 }, { en:"bulk frozen vegetables" }),
          lv("coupon", "A takeout app sends a weekly coupon", ["med", "eco"], "Saves $5 a week on takeout", "Takeout every weeknight", { med:1, eco:0 }, { bar:"app coupons" })
        ] }
    ] },
  { id:"tomas", name:"Tomas", age:18, profile:"Lives in a rural town 40 km from a full grocery store, with one small convenience store in town. The family has one car, and money is tight.",
    sits:[
      { id:"tomas-groc", name:"Weekly groceries", note:"The family shops each week at the convenience store and drives to the city store about once a month.",
        choice:"Mostly canned and frozen vegetables, with fresh produce after the monthly city trip", barrier:"distance", enabler:"canned and frozen food keeps well",
        answer:[1, 3, 3, 2, 1, 1],
        ev:{ bio:"Everyone needs to eat, but nothing here makes the body the main pull.", eco:"Money is tight, and small-store prices are higher.",
          acc:"The full grocery store is 40 km away, and the family has one car.", soc:"The family plans meals around what everyone usually eats: a real pull, but not the strongest.",
          psy:NOEV, med:NOMED },
        levers:[
          lv("delivery", "Online grocery delivery reaches town", ["acc"], "$10 a week delivery fee", "More fresh produce; delivery fee noted", { acc:-1 }, { en:"delivery service" }),
          lv("csa", "Community-supported agriculture pickup in town", ["acc", "eco"], "$0 extra (replaces store purchases)", "A weekly vegetable box", { acc:-1, eco:-1 }, { en:"a local vegetable box" }),
          lv("ride", "Rideshare to the city store twice a month", ["acc"], "$4 a week", "Bulk buying on two trips", { acc:-1 }, { en:"shared rides" }),
          lv("price", "Price of fresh vegetables rises 20%", ["eco"], "Vegetables cost 20% more", "Fewer fresh, more frozen and canned", { eco:1 }, { bar:"higher prices" }),
          lv("poster", "A poster about vegetables at school", ["med"], "$0", "No change: mostly canned and frozen vegetables", {}, { none:"No thread changed: information alone doesn’t move distance or price." }),
          lv("fastfood", "A new fast-food outlet opens in town", ["acc"], "$0", "Takeout some nights; the grocery list doesn’t change", { acc:0 }, { bar:"easy takeout" })
        ] },
      { id:"tomas-lunch", name:"School lunch", note:"His school has no cafeteria, just a microwave in the student lounge.",
        choice:"A sandwich from home, or a convenience-store snack", barrier:"a tight budget", enabler:"a microwave at school",
        model:[2, 3, 2, 1, 1, 1],
        levers:[
          lv("program", "School starts a free hot-lunch program twice a week", ["eco"], "$0", "Free soup and a bun twice a week", { eco:-1 }, { en:"free school lunches" }),
          lv("leftovers", "Brings dinner leftovers to heat in the microwave", ["acc"], "$0 extra", "Reheated leftovers", { acc:-1 }, { en:"leftovers from home" }),
          lv("bulk", "The family buys bread and fillings in bulk on city trips", ["eco"], "Saves about $5 a week", "A sandwich from home every day", { eco:-1 }, { en:"bulk buying" }),
          lv("table", "Friends share a lunch table and swap food", ["soc"], "$0", "Trades half a sandwich for a friend’s samosa", { soc:1 }, { en:"friends who share" }),
          lv("snackprice", "The convenience store raises snack prices", ["eco"], "Snacks cost more", "A sandwich from home, and fewer store snacks", { eco:1 }, { bar:"pricier snacks" }),
          lv("drinkad", "Sees an ad for a new energy drink on his phone", ["med"], "$3 a can", "Adds the energy drink to his lunch", { med:1 }, { bar:"the ad" })
        ] }
    ] },
  { id:"meilin", name:"Mei-Lin", age:17, profile:"Vegetarian for ethical reasons, follows several food creators online, and is in exam season.",
    sits:[
      { id:"meilin-exam", name:"Exam-week late night", note:"It’s 10 p.m. during exams. She studies at home, often skips dinner, and watches food videos on her breaks.",
        choice:"Skips dinner, snacks on energy bars", barrier:"exam stress", enabler:"food in the house",
        answer:[2, 1, 2, 1, 3, 2],
        ev:{ bio:"She’s hungry after skipping dinner: a real pull, but not the main driver.", eco:"Nothing suggests money is the barrier.",
          acc:"Exam time is tight, but there’s food in the house.", soc:"She’s studying alone tonight, so people aren’t shaping this choice much.",
          psy:"Exam stress is the strongest pull: stress and habit drive the late-night snacking.", med:"She follows several food creators, and their posts pull at her during breaks." },
        levers:[
          lv("batch", "Batch-cooks a lentil curry on Sunday", ["acc"], "$0 extra", "Reheated curry and rice", { acc:-1 }, { en:"a meal ready ahead" }),
          lv("group", "Study group shares food", ["soc"], "$0", "A shared meal at a friend’s house", { soc:1 }, { en:"the study group" }),
          lv("sponsored", "Follows a creator’s “study snacks” sponsored post", ["med"], "$12 a box", "Buys the advertised energy bars", { med:1 }, { bar:"the sponsored post" }),
          lv("reminder", "Sets a phone reminder to eat dinner", ["psy"], "$0", "Eats dinner before studying", { psy:-1 }, { en:"a dinner reminder", infNote:"Psychological (habit)" }),
          lv("review", "Extra exam review runs until 9 p.m.", ["acc"], "$0", "Gets home late and snacks on energy bars", { acc:1 }, { bar:"a late review session" }),
          lv("mute", "Mutes food-delivery app notifications", ["med"], "$0", "Fewer late-night prompts, but still snacks on energy bars", { med:-1 }, { en:"fewer prompts" })
        ],
        pairs:{
          "batch+group":"Eats a full meal: curry and rice, shared with the study group",
          "batch+reminder":"Eats a full meal: reheated curry and rice, before studying",
          "group+reminder":"Eats a full meal: dinner with the study group, before the evening session"
        } },
      { id:"meilin-brunch", name:"Weekend brunch with friends", note:"Her friends pick a café they saw online. She checks the menu for vegetarian dishes.",
        choice:"The one vegetarian dish on the menu, or toast", barrier:"few vegetarian dishes", enabler:"friends who share plates",
        model:[1, 1, 1, 3, 1, 2],
        levers:[
          lv("suggest", "Suggests a café with a full vegetarian menu", ["soc"], "About the same", "Shares several vegetarian plates with friends", { soc:0 }, { en:"a vegetarian-friendly café" }),
          lv("creator", "A creator she follows reviews a pancake place", ["med"], "About the same", "Pancakes and fruit at the reviewed place", { med:1 }, { bar:"the creator’s review" }),
          lv("potluck", "Friends switch to a potluck brunch at home", ["soc", "eco"], "About $5 for her dish", "A potluck, including her chickpea salad", { soc:0, eco:-1 }, { en:"a potluck" }),
          lv("diner", "One friend is saving money and suggests a cheaper diner", ["eco"], "Saves about $8", "A diner breakfast: eggs, toast and potatoes", { eco:1 }, { bar:"a tighter budget for the group" }),
          lv("late", "Brunch moves to 1 p.m.", ["bio"], "$0", "Very hungry by brunch, so she orders the biggest vegetarian dish", { bio:1 }, { bar:"a late meal" }),
          lv("newdish", "Decides to try one new dish each week", ["psy"], "$0", "Tries something new: shakshuka", { psy:0 }, { en:"curiosity" })
        ] }
    ] }
];

// Practice 1 sorter
const BOX = { bio:"Biological", eco:"Economic", acc:"Access and time", soc:"Social and cultural", psy:"Psychological", med:"Media" };
const SH1 = "Where does the pull come from: the body, money, the setting, people, the mind or messages?";
const sortItem = (id, t, box, fb, clue, goal) => {
  const wrong = {}; Object.keys(BOX).forEach(b => { if (b !== box) wrong[b] = fb; });
  return { id, t, answer:box, why:fb, goal:goal || 1, wrong, hints:[SH1, "Clue: " + clue, BOX[box] + ". " + fb] };
};

// Misconception core sentences (plan §3), reused where an option names the misconception without its own feedback
const M1 = "Knowing isn’t the same as being able. Cost, time, access and culture shape what’s possible.";
const M3 = "Everyone’s food choices are cultural: what counts as breakfast is a cultural idea too.";
const M5 = "Frozen vegetables, oats, beans, lentils and eggs are affordable and nutritious.";
const M6 = "Moral labels attach guilt to eating. Describe foods by what they offer, not by virtue.";

export default {
  id:"01-food-choices",
  kind:"topic",
  title:"Factors influencing food choices",
  topic:"Factors Influencing Food Choices",
  readyTopic:"factors influencing food choices",
  support:SUPPORT,
  hero:{
    headline:"No food choice has just one reason.",
    text:"What ends up on your plate depends on <strong>biology</strong> (hunger, taste, fullness), <strong>economics</strong> (prices, income), <strong>physical access</strong> (time, distance, skills), <strong>social and cultural</strong> ties (family, culture, faith, friends), <strong>psychology</strong> (mood, stress, habit) and <strong>media</strong> (ads, creators, labels). These <strong>influences</strong> pull at the same time. In this module you’ll map them for real-life situations, then look hard at the one designed to pull hardest: <strong>food marketing</strong>.",
    fig:{ html:'<div class="fw-hero" id="fw-hero"></div>', caption:"" },
    aria:"A lunch tray at the centre of six labelled threads: Biology, Money, Access and time, Family, culture and faith, Mood and habits, and Media. The Access and time thread tightens while a clock spins, and the packed lunch becomes a store-bought snack. Then the thread relaxes and the lunch returns.",
    caption:"Change one influence, and the choice can change."
  },
  goals:[
    "I can name the six kinds of influence on food choices and give an example of each.",
    "I can explain how several influences work together in one person’s food choices.",
    "I can describe how busy schedules, stress, expectations about body shape and scarcity can affect eating patterns.",
    "I can identify food-marketing techniques aimed at young people and explain how they work.",
    "I can write a focused research question about food choices and spot the limits of a survey’s conclusions.",
    "I can discuss people’s food choices respectfully, without moral labels, considering culture, religion and cost."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Canada’s Food Guide habits", goal:1,
          prompt:"Canada’s Food Guide (2019) gives advice beyond <em>what</em> to eat. Which of these is one of its healthy eating habits?",
          options:[
            { t:"Be aware of food marketing", ok:true, why:"The guide lists it alongside cooking more often and eating with others." },
            { t:"Avoid all foods with sugar.", why:"The guide advises limiting highly processed foods, not banning ingredients." },
            { t:"Count calories at every meal.", why:"The guide is about patterns and habits, not counting." },
            { t:"Eat only foods grown in Canada.", why:"Local food can be a choice, but the guide doesn’t require it." }],
          hints:["Think about <em>how</em> we eat, not just what.", "The guide names habits like cooking more often and eating with others.", "Be aware of food marketing."] },
        { id:"w2", skill:"Influences on behaviour", goal:1,
          prompt:"Which of these is a <strong>biological</strong> influence on food choice?",
          options:[
            { t:"Feeling full sooner after a high-fibre meal", ok:true, why:"Fullness cues are biological." },
            { t:"A grandmother’s holiday recipes", why:"That’s a social and cultural influence." },
            { t:"A sale on cereal", why:"That’s economic." },
            { t:"Seeing a snack in a creator’s video", why:"That’s media." }],
          hints:["Which one comes from inside the body?", "Fullness is a body signal.", "Feeling full sooner after a high-fibre meal."] },
        { id:"w3", skill:"Influences on behaviour", goal:3,
          prompt:"Which situation best shows a <strong>psychological</strong> influence on eating?",
          options:[
            { t:"Eating more snacks while stressed during exams", ok:true, why:"Stress and mood are psychological influences." },
            { t:"Choosing rice because it’s cheaper", why:"That’s economic." },
            { t:"Skipping pork for religious reasons", why:"That’s religious, a social and cultural influence." },
            { t:"Buying what the corner store stocks", why:"That’s physical access." }],
          hints:["Look for mood, stress or habit.", "Exams cause stress.", "Eating more snacks while stressed during exams."] },
        { id:"w4", skill:"Canada’s Food Guide habits", goal:6,
          prompt:"Canada’s Food Guide encourages eating with others. Which reason does it give?",
          options:[
            { t:"Shared meals connect people and can encourage healthier eating habits", ok:true, why:"Eating together is about connection as well as nutrition." },
            { t:"You eat fewer calories when others are watching", why:"The guide doesn’t frame shared meals around calories." },
            { t:"Meals are cheaper in restaurants", why:"Shared meals can be at home." },
            { t:"It’s required for good digestion", why:"Digestion works alone too." }],
          hints:["Think connection.", "Social benefits.", "Shared meals connect people and can encourage healthier eating habits."] },
        { id:"w5", skill:"Reading survey data", goal:5,
          prompt:"A survey of 200 Grade 11 students finds that 60 skip breakfast on school days. What percentage is that?",
          options:[
            { t:"30%", ok:true, why:"60 ÷ 200 = 0.30." },
            { t:"60%", why:"60 is the number of students, out of 200." },
            { t:"3%", why:"60 ÷ 200 = 0.3, which is 30%." },
            { t:"40%", why:"That’s 80 of 200." }],
          hints:["Part ÷ whole.", "60 ÷ 200.", "30%."] },
        { id:"w6", skill:"Reading survey data", goal:5,
          prompt:"Students who eat breakfast report higher energy in first period. What can you conclude <strong>from this survey alone</strong>?",
          options:[
            { t:"The two are linked, but the survey doesn’t show that breakfast causes the energy", ok:true, why:"Other factors, like sleep, could explain both." },
            { t:"Breakfast causes higher energy", why:"A survey shows a pattern, not a cause." },
            { t:"Higher energy causes breakfast", why:"Possible, but not shown either." },
            { t:"Nothing; surveys are useless", why:"Surveys show patterns worth studying." }],
          hints:["Pattern or proof?", "Could sleep explain both?", "A link, not a cause."] }
      ],
      refreshers:{
        // VERIFY: Food Guide habit wording before release.
        "Canada’s Food Guide habits":"Beyond the plate, the 2019 guide lists habits: be mindful of your eating habits, cook more often, enjoy your food, eat meals with others, use food labels, limit highly processed foods, be aware of food marketing.",
        "Influences on behaviour":"Sort influences by where they come from: the body (biological), money (economic), the environment and time (physical), people and traditions (social and cultural), the mind (psychological), messages (media).",
        "Reading survey data":"Percentage = part ÷ whole × 100. A link between two things in a survey is a correlation; a cause needs more evidence."
      }
    }
  },
  explore:{
    heading:"Food choice web",
    intro:"Each person below faces a real food decision. Read their profile, set how strongly each influence is pulling, then change one thing and watch what happens.",
    influences:INF,
    levels:["none", "low", "medium", "high"],
    personas:PERSONAS,
    fictional:"All four people are fictional.",
    modes:{ read:"Read the web", change:"Change one thing" },
    text:{
      dialsHow:"Set how strongly each influence pulls on this choice, using the evidence in the profile.",
      leversHow:"Choose up to two levers. Press a lever again to remove it.",
      lockedKey:"Dials are locked to the key for this situation.",
      lockedModel:"Dials are locked to the model’s web for this situation.",
      noKey:"There’s no answer key for this situation, so your web is reported but not marked. Compare each setting with the evidence in the profile. Situations with a key: Devon’s after-practice snack, Amira’s weeknight dinner, Tomas’s weekly groceries and Mei-Lin’s exam-week late night.",
      allMatch:"Your web matches the evidence in the profile.",
      slideLabel:"Survey slide",
      slideQuote:"“Most teens say ads influence <em>other</em> teens more than themselves.”",
      tpeTitle:"Third-person effect",
      tpeText:"Believing media affects other people more than yourself."
    },
    predictions:[
      { id:"p1", start:{ p:"tomas", s:"tomas-groc" }, lever:"delivery",
        prompt:"Tomas, weekly groceries. Which change would most likely increase the fresh vegetables Tomas’s family buys?",
        options:[{ t:"Online grocery delivery reaches his town", ok:true }, { t:"A poster about vegetables at school" }, { t:"An app that counts servings" }, { t:"A new fast-food outlet in town" }],
        explain:"Tomas’s main barriers are distance and cost. Information alone doesn’t move a 40 km drive." },
      { id:"p2", start:{ p:"amira", s:"amira-snack" }, lever:"program",
        prompt:"Amira, after-school snack. Amira’s school launches a free after-school snack program with halal-certified options. What changes?",
        options:[{ t:"She eats the program snack: economic and cultural barriers both drop", ok:true }, { t:"Nothing: snacks don’t matter to teens" }, { t:"She stops eating dinner" }, { t:"She buys more fast food" }],
        explain:"A change that fits her family’s food practices removes two barriers at once." },
      // VERIFY: third-person effect research summary before release.
      { id:"p3", slide:true,
        prompt:"A survey slide appears: “Most teens say ads influence <em>other</em> teens more than themselves.” What does research on this pattern usually find?",
        options:[{ t:"People underestimate how much ads affect themselves", ok:true }, { t:"Ads only affect children" }, { t:"Teens are immune to ads" }, { t:"Ads have no measurable effect" }],
        explain:"People tend to believe media affects others more than themselves." },
      { id:"p4", start:{ p:"devon", s:"devon-practice" }, lever:"pack",
        prompt:"Devon, after-practice snack. Devon starts packing a snack the night before. Which influence did he change?",
        options:[{ t:"Access and time", ok:true }, { t:"Biological" }, { t:"Media" }, { t:"Economic" }],
        explain:"He moved the decision to a time when he had time." }
    ],
    challenges:[
      { id:"tc1", goal:[1, 2], sit:"devon-practice",
        prompt:"Set the dials for <strong>Devon’s after-practice snack</strong> to match his profile. (Use <strong>Read the web</strong>.)",
        wrong:{ eco:"Devon earns money from his job; cost isn’t his main barrier.", med:"Nothing in his profile mentions ads or creators.", bio:"He’s just finished practice: hunger is pulling hard." },
        start:"Choose Devon, then his after-practice snack, and set the six dials in <strong>Read the web</strong>.",
        general:"Not yet. Read the profile again for clues: the job, the training, the time.",
        why:"Training makes hunger high, the job means cost isn’t the barrier, and the half-hour gap before work makes time pull hard.",
        hints:["Read the profile for clues: the job, the training, the time.", "Training makes hunger high; a 25-minute lunch makes time tight.", "High, low, high, medium, low, low."] },
      { id:"tc2", goal:[1, 2], sit:"tomas-groc",
        prompt:"Find a lever that gives <strong>Tomas’s family</strong> more fresh produce <strong>without</strong> adding a cost above $5 a week. (Use <strong>Change one thing</strong>.)",
        answer:["csa", "ride"],
        wrong:{ delivery:"It works, but the delivery fee in the lever card is $10 a week.", poster:"Information doesn’t change distance or price.", price:"That makes it harder.",
          fastfood:"A takeout outlet doesn’t add fresh produce to the grocery list.", many:"Pick one lever only: the challenge asks for a single change." },
        start:"Choose Tomas, then his weekly groceries, switch to <strong>Change one thing</strong>, and pick a lever.",
        general:"Check each lever card’s weekly cost and what it changes.",
        why:"Both ease the 40 km distance. The vegetable box replaces store purchases at no extra cost, and the rideshare costs $4 a week.",
        hints:["Check each lever card’s weekly cost.", "Which levers are $5 or less a week?", "The community-supported agriculture pickup, or the rideshare."] },
      { id:"tc3", goal:[1, 2], sit:"meilin-exam", stretch:true,
        prompt:"Mei-Lin’s exam-week late night: choose <strong>two</strong> levers that change her likely choice from “skips dinner, snacks on energy bars” to “eats a full meal”, using <strong>no media lever</strong> and changing <strong>two different influences</strong>.",
        answer:[["batch", "group"], ["batch", "reminder"], ["group", "reminder"]],
        wrong:{ media:"That lever is media, and it leads to the advertised bars.", same:"Both act on the same influence. Try two different ones.",
          mute:"Muting app notifications is a media lever too. This challenge asks for no media lever.",
          barrier:"That pair doesn’t end in a full meal: the late review session adds a time barrier. Choose two levers that each ease a barrier.",
          one:"Choose a second lever: the challenge needs two." },
        start:"Choose Mei-Lin, then her exam-week late night, switch to <strong>Change one thing</strong>, and pick two levers.",
        general:"Look at the likely choice: it has to become a full meal.",
        why:"Two different barriers eased at once (time, people or habit), with no advertised bars involved.",
        hints:["Which levers act on time, on people, or on habit?", "Avoid the sponsored post.", "For example: batch-cook on Sunday, plus a phone reminder."] }
    ],
    blocks:[{ title:"What the web shows", html:"<p>Influences pile up. Changing one lever can change the choice, and the levers that work best usually change <strong>access, time or cost</strong>, not willpower. That’s why this course explains food choices from the inside, never with labels like “good food” or “bad choices”.</p>" }]
  },
  part3:{
    slug:"marketing", name:"Marketing", heading:"Marketing on the menu",
    intro:"Marketing is the one influence built to change choices on purpose. Take it apart in three stations: spot the techniques, check a chart, then look at the rules.",
    stations:[{ id:"spot", t:"1. Technique spotter" }, { id:"data", t:"2. Check it with data" }, { id:"rules", t:"3. The rules" }],
    spotIntro:"Four practice-model ads, made for this course. Tap a part of an ad, then tap the technique it uses. Each correct tag shows how the technique works.",
    techniques:[
      { id:"mascot", name:"Cartoon characters or mascots", how:"A friendly character gives the product a personality that children remember and ask for by name." },
      { id:"endorse", name:"Athlete or celebrity endorsement", how:"Admiration for the star rubs off on the product, and suggests it helps people perform like them." },
      { id:"creator", name:"Influencer or creator content (sponsored)", how:"A paid post looks like a friend’s recommendation, so it feels more trustworthy than an ad." },
      { id:"games", name:"Contests, games and apps", how:"A game or contest keeps you with the brand for minutes instead of seconds, and gives you a reason to come back." },
      { id:"limited", name:"Limited-time offers", how:"A deadline creates urgency, so people decide quickly instead of comparing options." },
      { id:"halo", name:"“Health halo” claims (“made with real fruit”)", how:"One healthy-sounding detail in big type makes the whole product feel healthy." },
      { id:"shelf", name:"Bright packaging placed at eye level", how:"Bright colours catch the eye, and products at eye level (including a child’s eye level) get picked up more often." }
    ],
    ads:[
      { id:"cereal", name:"Cereal box", brand:"Comet Crunch", spots:[
        { id:"a1", t:"Cosmo, a cartoon fox, waves from the box", answer:"mascot", cue:"Who is this character, and who is it drawn for?" },
        { id:"a2", t:"“Made with real fruit!” in a big star", answer:"halo", cue:"Read the claim. Does one healthy-sounding detail make the whole cereal feel healthy?" },
        { id:"a3", t:"Scan the box to play Comet Run", answer:"games", cue:"What does the box invite you to do after you buy it?" },
        { id:"a4", t:"Bright box on the bottom shelf, at a child’s eye level", answer:"shelf", cue:"Look at where the box sits and how it looks." } ] },
      { id:"drink", name:"Sports-drink video", brand:"VoltUp", spots:[
        { id:"b1", t:"Frames 1–2: a star basketball player laces up, then drinks VoltUp courtside: “Play like a champion.”", answer:"endorse", cue:"Who appears in the video, and why would the brand pay them?" },
        { id:"b2", t:"Frame 3: “Playoff edition. Only until June.”", answer:"limited", cue:"What does “only until June” push you to do?" } ] },
      { id:"post", name:"Creator’s post", brand:"@study.with.sam", spots:[
        { id:"c1", t:"“Paid partnership with BrightBar · #ad”, with the bars in every shot", answer:"creator", cue:"What does “paid partnership” and #ad tell you about this post?" },
        { id:"c2", t:"“Use code SAM15 for 15% off, this week only!”", answer:"limited", cue:"What does “this week only” push you to do?" },
        { id:"c3", t:"“Packed with protein, basically a health food!”", answer:"halo", cue:"Does one nutrient make a whole snack a “health food”?" } ] },
      { id:"app", name:"Fast-food app", brand:"QuickBite", spots:[
        { id:"d1", t:"Spin the wheel to win free fries", answer:"games", cue:"What kind of activity is a prize wheel inside an app?" },
        { id:"d2", t:"Today only: $5 combo", answer:"limited", cue:"What does “today only” push you to do?" } ] }
    ],
    made:"Practice model made for this course",
    real:{
      title:"Real examples (your teacher chooses)",
      intro:"Your teacher will share two current real ads or posts aimed at teens, with the source and date: one that uses a creator or influencer, and one that uses a health halo claim. Add a screenshot to look at it here. The picture stays on this page only: it isn’t saved or sent anywhere.",
      slots:["Example 1: a creator or influencer", "Example 2: a health halo claim"],
      prompts:["Which techniques?", "Who is the audience?", "What is left out?"],
      criteria:["Names at least two techniques and supports each with a visible feature.", "Says who the audience is and points to the clue.", "Names something the ad leaves out, such as the price, the ingredients or who paid for it."],
      credit:"Shown for education (fair dealing)."
    },
    data:{
      title:"Average food and drink ads seen per day online, by age group",
      unit:"ads per day",
      groups:[["Ages 2–11", 15], ["Ages 12–14", 25], ["Ages 15–17", 30], ["Ages 18–24", 20]],
      note:"Model data, made for this course. Your teacher may swap in a verified source.",
      questions:[
        { id:"g1", prompt:"Which age group sees the most food and drink ads per day in this chart?",
          options:[{ t:"Ages 15–17", ok:true, why:"The 15–17 bar is the tallest: 30 ads per day." }, { t:"Ages 2–11", why:"That’s the shortest bar. Look for the tallest one." }, { t:"Ages 12–14", why:"That bar is 25. One bar is taller." }, { t:"Ages 18–24", why:"That bar is 20. Look for the tallest one." }] },
        { id:"g2", prompt:"How many more ads per day does the 15–17 group see than the 2–11 group?",
          options:[{ t:"15 more", ok:true, why:"30 − 15 = 15 more ads per day." }, { t:"45 more", why:"That adds the two bars. “How many more” means subtract." }, { t:"5 more", why:"That compares 15–17 with 12–14. Check which groups the question names." }, { t:"30 more", why:"30 is the 15–17 bar on its own. Subtract the 2–11 bar." }] },
        { id:"g3", multi:true, prompt:"What would you need to know to trust this chart? Select every one that applies.",
          options:[{ t:"Who collected the data (the source)", ok:true }, { t:"Who was surveyed, and how many people (the sample)", ok:true }, { t:"When the data was collected (the date)", ok:true }, { t:"Whether the bars are colourful" }, { t:"Whether you agree with it" }],
          why:"Source, method and date are the first checks.", wrongWhy:"Colours and your own opinion don’t make data more or less trustworthy. Check the source, the sample and the date." }
      ]
    },
    rules:{
      // VERIFY: Quebec rule (since 1980) and the current status and wording of Health Canada's work before release.
      cards:[
        "Quebec’s Consumer Protection Act has limited commercial advertising directed at children under 13 since 1980.",
        "Health Canada has worked on restricting food marketing to children.",
        "Canada’s Food Guide lists “Be aware of food marketing” as a healthy eating habit (Health Canada, 2019)."
      ],
      prompt:"Should marketing rules protect 16-year-olds too? Give one reason for and one against.",
      labels:["One reason for", "One reason against"],
      note:"This is a reflection, not scored. It saves on this device."
    },
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Consumer Protection Act, CQLR c P-40.1.</li><li>Davison, W. P. (1983). The third-person effect in communication. <i>Public Opinion Quarterly, 47</i>(1), 1–15.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Marketing quick check", summary:"Marketing quick check",
      items:[
        { id:"q1", goal:4, prompt:"A drink label says “made with real fruit” in large type; the ingredient list shows mostly sugar and water. Technique?",
          choices:[{ t:"Health halo", ok:true, fb:"Right. A small truth in big type makes the whole product feel healthy." }, { t:"Mascot", fb:"A small truth in big type makes the whole product feel healthy." }, { t:"Contest", fb:"A small truth in big type makes the whole product feel healthy." }, { t:"Endorsement", fb:"A small truth in big type makes the whole product feel healthy." }] },
        { id:"q2", goal:4, prompt:"A creator posts a snack “haul” with #ad. What does #ad tell you?",
          choices:[{ t:"It’s paid promotion", ok:true, fb:"Right. A disclosure means the brand paid for or supplied it." }, { t:"It’s a review", fb:"A disclosure means the brand paid for or supplied it." }, { t:"It’s a recipe", fb:"A disclosure means the brand paid for or supplied it." }, { t:"It’s a scientific study", fb:"A disclosure means the brand paid for or supplied it." }] },
        { id:"q3", goal:4, prompt:"Cereal for children shelved at children’s eye level is mainly using…",
          choices:[{ t:"Placement", ok:true, fb:"Right. Where a product sits is a technique too." }, { t:"Price", fb:"Where a product sits is a technique too." }, { t:"Endorsement", fb:"Where a product sits is a technique too." }, { t:"Nutrition claims", fb:"Where a product sits is a technique too." }] },
        { id:"q4", goal:[4, 5], prompt:"Which question best tests whether a marketing chart is trustworthy?",
          choices:[{ t:"Who collected the data, how, and when?", ok:true, fb:"Right. Source, method and date are the first checks." }, { t:"Is the chart colourful?", fb:"Source, method and date are the first checks." }, { t:"Do I agree with it?", fb:"Source, method and date are the first checks." }, { t:"Is it short?", fb:"Source, method and date are the first checks." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort the influence", summary:"Sort the influence", noun:"situation", txt:true, goal:[1, 6],
        instruction:"Each line describes one food choice. Sort it by the kind of influence behind it.",
        boxes:Object.keys(BOX).map(k => ({ id:k, label:BOX[k] })),
        items:[
          sortItem("i1", "Craves salty food after a long run", "bio", "Sweat loss and hunger are body signals.", "“after a long run”: what did the body just do?"),
          sortItem("i2", "Buys store-brand oats because they cost less", "eco", "Price drives this one.", "“cost less”"),
          sortItem("i3", "Fasts during daylight hours in Ramadan", "soc", "Religious practice is a social and cultural influence.", "“Ramadan”, a religious practice", [1, 6]),
          sortItem("i4", "Eats cereal for dinner after a 10-hour shift", "acc", "Time and energy, not taste, decided this.", "“after a 10-hour shift”"),
          sortItem("i5", "Snacks while bored scrolling at night", "psy", "Boredom and habit are psychological.", "“bored”"),
          sortItem("i6", "Tries a drink after seeing it in a creator’s video", "med", "The video introduced the drink.", "“a creator’s video”"),
          // VERIFY: genetic taste differences (cilantro) before release.
          sortItem("i7", "Doesn’t like the taste of cilantro (it tastes soapy to some people)", "bio", "Some taste differences are genetic.", "“tastes soapy to some people”: a difference in how bodies taste"),
          sortItem("i8", "Eats rice at every meal because that’s home cooking", "soc", "Home food is cultural, and that’s not an exception.", "“home cooking”", [1, 6]),
          sortItem("i9", "Can’t cook because the apartment has only a microwave", "acc", "Equipment and skills are part of access.", "“only a microwave”"),
          sortItem("i10", "Chooses the cheaper of two lunch specials", "eco", "Price is the deciding factor.", "“cheaper”")
        ] },
      { id:"inquiry", type:"custom", title:"Ask a better question", summary:"Ask a better question", star:true, goal:[5, 3],
        instruction:"A model survey table, then six questions about what it can and can’t tell you. Some ask you to choose, some to enter a number, and one to build a survey question.",
        how:"Answer each item, then press Check. Percentages can be typed as 40 or 40%.",
        table:{ caption:"300 students surveyed about weekday breakfast", head:["Group", "Eat breakfast most school days", "Skip most school days"], rows:[["School starts 8:00", 90, 60], ["School starts 9:00", 120, 30]] },
        items:[
          { id:"r1", kind:"num", goal:5, prompt:"What percentage of 8:00-start students skip breakfast?", answer:40, unit:"%",
            wrong:[{ match:20, fb:"60 of 150, not of 300." }, { match:60, fb:"60 is the number of students who skip. Divide by the size of their group." }],
            general:"Percentage = part ÷ whole × 100. Which whole?", why:"60 ÷ 150 = 0.4, so 40% of the 8:00-start students skip.",
            hints:["Percentage = part ÷ whole × 100. Which whole?", "The 8:00-start group has 90 + 60 = 150 students.", "60 ÷ 150 = 0.4, which is 40%."] },
          { id:"r2", kind:"num", goal:5, prompt:"What percentage of 9:00-start students skip?", answer:20, unit:"%",
            wrong:[{ match:10, fb:"30 ÷ 150." }, { match:80, fb:"That’s the percentage who eat breakfast. The question asks who skips." }],
            general:"Find the 9:00-start group’s total first.", why:"30 ÷ 150 = 0.2, so 20% of the 9:00-start students skip.",
            hints:["Find the 9:00-start group’s total first.", "The 9:00-start group has 120 + 30 = 150 students.", "30 ÷ 150 = 0.2, which is 20%."] },
          { id:"r3", kind:"mc", star:true, goal:5, prompt:"Does this table prove a later start <em>causes</em> more breakfast eating?",
            options:[
              { t:"Yes: the 9:00-start group eats breakfast more often, so the start time causes it.", why:"Ask what else differs between the two groups. A difference between groups is a link, not proof." },
              { t:"No: it shows a link; other differences between the schools (e.g. bus times, neighbourhood) could explain it.", ok:true, why:"A pattern in survey data is a correlation. Another factor could explain both." },
              { t:"No: 300 students are too few to show any pattern.", why:"300 students can show a pattern. The question is about cause: ask what else differs between the two groups." }],
            hints:["Correlation or cause?", "Name one other difference between the two schools.", "No: a link, not proof."] },
          { id:"r4", kind:"mc", star:true, goal:5, prompt:"Choose the best research question to investigate further.",
            options:[
              { t:"How does school start time relate to breakfast eating among Grade 11 students in our board, after accounting for bus travel time?", ok:true, why:"Focused, measurable, and it names the population and a factor to control." },
              { t:"Do students like breakfast?", why:"Too broad to investigate: it doesn’t name who is studied or what factor to measure." },
              { t:"Is breakfast healthy?", why:"That’s a broad nutrition question this data can’t investigate. Look for a focused, measurable question." },
              { t:"Why are some students lazy in the morning?", why:"The “lazy” option judges rather than investigates." }],
            hints:["A good research question is focused, measurable and neutral.", "Look for the one that names who is studied and a factor to control.", "The question about school start time, Grade 11 students in our board and bus travel time."] },
          { id:"r5", kind:"mc", star:true, goal:5, prompt:"A student plans to survey only their friends. What’s the main problem?",
            options:[
              { t:"Friends would finish the survey too quickly.", why:"Speed isn’t the issue. Think about who would be left out of the survey." },
              { t:"The sample isn’t representative.", ok:true, why:"Friends share schedules and habits; the results won’t generalize." },
              { t:"Friends’ answers can’t be turned into percentages.", why:"Any counts can become percentages. Think about who would be left out of the survey." }],
            hints:["Who would be left out of the survey?", "Friends often share schedules, neighbourhoods and habits.", "The sample isn’t representative, so the results won’t generalize."] },
          { id:"r6", kind:"build", star:true, goal:[5, 6], prompt:"Write a survey question about breakfast that avoids judgement. Choose a stem, a time frame and answer options.",
            stems:[
              { t:"How many school days {time} did you eat something before first period?", ok:true },
              { t:"How many school days {time} did you skip breakfast because you were lazy?" },
              { t:"On how many school days {time} did you eat breakfast at home or at school?", ok:true },
              { t:"How many days {time} did you eat an unhealthy breakfast?" },
              { t:"How many days {time} did you make the bad choice to skip breakfast?" }],
            times:[{ t:"last week", ok:true }, { t:"in the last 5 school days", ok:true }, { t:"in the last 10 school days", ok:true }],
            scales:[{ t:"A number of days: 0, 1, 2, 3, …", ok:true }, { t:"Never · Sometimes · Always" }, { t:"Yes · No" }],
            labels:{ stem:"Stem", time:"Time frame", scale:"Answer options", preview:"Your question" },
            wrong:{ judge:"Neutral wording gets more honest answers, and respects people.", scale:"Use number answers, so the results can be counted and compared.", incomplete:"Choose a stem, a time frame and answer options first." },
            why:"Neutral wording gets more honest answers, and respects people. A time frame and number answers make it measurable.",
            hints:["Read each stem: does any word judge the person answering?", "Avoid stems with “unhealthy”, “lazy” or “bad”. Any time frame works; the answers should be numbers.", "For example: “How many school days last week did you eat something before first period?”, answered with a number of days."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Aditi", how:"",
        instruction:"Aditi made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:6, task:"Explain why a family with a tight budget buys frozen pizza twice a week.",
            steps:["Both parents work evening shifts, so time is short.", "Frozen pizza is affordable and ready in 15 minutes.", "This shows the family makes bad food choices and doesn’t care about health.", "So they need to learn more about nutrition."],
            answer:2,
            stepFb:["Step 1 is correct: time is an access influence.", "Step 2 is correct: cost and time together.", "", "Step 4 builds on step 3’s assumption. The mistake is earlier."],
            fixes:[
              { t:"This shows how time and cost limit options. Changes that save time or money, like batch-cooking on a day off or adding frozen vegetables, would help more than information alone.", ok:true, why:"It explains the choice from the inside: time and cost, and changes that ease them." },
              { t:"This shows pizza is a bad food.", why:"Moral labels don’t explain anything." },
              { t:"This shows they prefer pizza.", why:"The profile points to time and cost, not taste." },
              { t:"Step 3 is correct.", why:"Step 3 judges the family instead of explaining the choice." }],
            hints:["Is step 3 an explanation or a judgement?", "What do steps 1 and 2 actually show?", "Step 3 is the first mistake. The fix explains how time and cost limit options, and suggests changes that save time or money."] },
          { id:"e2", goal:5, task:"A survey finds that students who eat lunch with friends report better moods. Conclude.",
            steps:["The survey asked 200 students two questions.", "Students who eat with friends reported better moods on average.", "So eating with friends causes better moods.", "Schools should require group lunches."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct: it reports the pattern.", "", "Step 4 depends on step 3. The mistake is earlier."],
            fixes:[
              { t:"So eating with friends is linked to better moods; students in better moods may also seek company, so we can’t tell which causes which.", ok:true, why:"A survey shows a link. The cause could run either way." },
              { t:"So better moods cause eating with friends.", why:"That’s a cause claim too, just reversed." },
              { t:"So the survey is wrong.", why:"It’s not wrong; it’s limited." },
              { t:"Step 3 is correct.", why:"A survey shows a link, not a cause." }],
            hints:["Can a survey show cause?", "Could it run the other way?", "Step 3 is the first mistake. The fix says eating with friends is linked to better moods, and the survey can’t tell which causes which."] },
          { id:"e3", goal:4, task:"Analyse a cereal ad with a cartoon tiger and the words “Part of a complete breakfast”.",
            steps:["The cartoon tiger is a mascot aimed at children.", "“Part of a complete breakfast” is a health halo: the other foods make it complete.", "Because the ad is for children, it can’t influence teens or adults.", "So the ad’s techniques are harmless for most people."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 rests on step 3."],
            fixes:[
              { t:"Mascots and health halos also work on older audiences, through nostalgia and parents’ shopping. The audience is wider than the target.", ok:true, why:"Marketing reaches beyond its target: older viewers remember the mascot, and parents do the shopping." },
              { t:"The tiger is a celebrity endorsement.", why:"It’s a mascot." },
              // VERIFY: provincial rules on advertising to children before release.
              { t:"The ad is illegal everywhere in Canada.", why:"Rules differ by province and audience." },
              { t:"Step 3 is correct.", why:"Marketing reaches beyond its target." }],
            hints:["Who else sees a cereal box?", "Parents buy it; teens remember it.", "Step 3 is the first mistake. The fix says mascots and health halos also work on older audiences, through nostalgia and parents’ shopping."] }
        ] }
    ]
  },
  reflect:{
    support:SUPPORT,
    journal:[
      { id:"j1", q:"Which lever in Explore surprised you most by how much it changed a choice? Why?" },
      { id:"j2", q:"In your own words, why is “they should just know better” a weak explanation of food choices?" },
      { id:"j3", q:"Explain to a friend how one marketing technique works, using an example you’ve noticed." },
      { id:"j4", q:'<span class="hfa-private">Optional and private</span> Describe one influence on your own food choices this week. Is it one you’d like to change, and what lever would help? (This stays on your device.)' }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is an <strong>economic</strong> influence on food choice?", options:[
          { t:"A store-brand cereal costs $2 less", ok:true, why:"Price is economic." },
          { t:"Feeling hungry after sports", why:"That’s biological." },
          { t:"Family recipes for holidays", why:"That’s social and cultural." },
          { t:"A creator’s snack review", why:"That’s media." }] },
        b:{ prompt:"Which is a <strong>physical access</strong> influence on food choice?", options:[
          { t:"The nearest grocery store is 40 km away", ok:true, why:"Distance is physical access." },
          { t:"A preference for spicy food", why:"That’s biological or cultural." },
          { t:"Stress during exams", why:"That’s psychological." },
          { t:"A buy-one-get-one sale", why:"That’s economic." }] } },
      { id:"k2", cat:"K", goal:1,
        // VERIFY: Food Guide habit wording before release.
        a:{ prompt:"Which healthy eating habit appears in Canada’s Food Guide (2019)?", options:[
          { t:"Cook more often", ok:true, why:"One of the guide’s listed habits." },
          { t:"Avoid carbohydrates after 6 p.m.", why:"Not in the guide; a diet myth." },
          { t:"Eat five small meals a day", why:"Not a guide habit." },
          { t:"Choose organic whenever possible", why:"Not a guide habit." }] },
        b:{ prompt:"Which healthy eating habit appears in Canada’s Food Guide (2019)?", options:[
          { t:"Enjoy your food", ok:true, why:"Enjoyment and culture are part of the guide." },
          { t:"Drink juice instead of water", why:"The guide says make water your drink of choice." },
          { t:"Eat only home-grown food", why:"Not a guide habit." },
          { t:"Skip breakfast to save time", why:"Not a guide habit." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is an example of a <strong>social or emotional condition</strong> linked to changes in eating patterns (C2.2)?", options:[
          { t:"A heavy work-and-school schedule that leaves little time to eat", ok:true, why:"Busy schedules are a condition named in the curriculum." },
          { t:"Lactose intolerance", why:"That’s a biological condition." },
          { t:"A sale at the grocery store", why:"That’s economic." },
          { t:"Food allergies", why:"That’s biological." }] },
        b:{ prompt:"Which is an example of a social or emotional condition linked to changes in eating patterns?", options:[
          { t:"Pressure to match expectations about body shape", ok:true, why:"Body-shape expectations are a condition named in the curriculum; they can lead to harmful eating patterns." },
          { t:"A peanut allergy", why:"Biological." },
          { t:"Rising food prices", why:"Economic." },
          { t:"A new bus route", why:"Physical access." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Tomas’s family (rural, tight budget, 40 km from a full grocery store) buys mostly canned and frozen vegetables. A classmate says, “They just don’t value fresh food.” What is the strongest response?", options:[
          { t:"“Distance and cost make fresh produce harder to get and more likely to spoil. Canned and frozen vegetables are a practical, nutritious choice under those conditions.”", ok:true, why:"It explains the choice from the inside, using the real barriers: distance and cost." },
          { t:"“They should drive to the city every day.”", why:"That ignores time and fuel costs." },
          // VERIFY: nutrient retention specifics before release.
          { t:"“Canned food has no nutrients.”", why:"Canned and frozen vegetables keep many nutrients." },
          { t:"“They probably prefer the taste.”", why:"The profile points to access and cost." }] },
        b:{ prompt:"Amira’s family (halal, two late-shift jobs, near many fast-food outlets) often buys halal takeout. A classmate says, “They’re choosing convenience over health.” What is the strongest response?", options:[
          { t:"“Late shifts limit cooking time and nearby halal options are limited, so takeout solves real constraints. Batch-cooking or a halal-certified school program would ease them.”", ok:true, why:"It names the real constraints, time and food practices, and changes that would ease them." },
          { t:"“They should stop working late.”", why:M1 },
          { t:"“Takeout is always unhealthy.”", why:"Labels like “always unhealthy” don’t help." },
          { t:"“Halal food is less nutritious.”", why:"Halal rules concern preparation and sources, not nutrient content." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Which single change would most likely increase vegetable intake for a student who has <strong>little time</strong> and a <strong>microwave-only</strong> kitchen?", options:[
          { t:"Pre-cut frozen vegetables that steam in the microwave", ok:true, why:"It addresses both time and equipment." },
          { t:"A poster listing vitamin content", why:"Information doesn’t solve time or equipment." },
          { t:"Fresh whole vegetables that need roasting", why:"No oven." },
          { t:"An expensive superfood powder", why:M5 }] },
        b:{ prompt:"Which single change would most likely increase breakfast eating for students who <strong>leave before 7 a.m.</strong> on a <strong>long bus ride</strong>?", options:[
          { t:"A grab-and-go breakfast program at school", ok:true, why:"It moves breakfast to where they have time." },
          { t:"A lesson on why breakfast matters", why:M1 },
          { t:"A breakfast that must be cooked", why:"No time at 6:45." },
          { t:"Advice to wake up earlier", why:"That shifts the burden without changing the barrier." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A model survey: students who drink energy drinks report sleeping less. A headline says “Energy drinks cause sleep loss in teens.” Best judgement?", options:[
          { t:"The survey shows a link; the headline claims a cause. Students who sleep less might drink more energy drinks to cope.", ok:true, why:"A pattern in survey data is a correlation. The cause could run the other way, or another factor could explain both." },
          { t:"The headline is correct because the link is strong.", why:"A strong link is still a correlation. A survey shows a pattern, not a cause." },
          { t:"The survey proves teens who sleep less buy energy drinks.", why:"That’s a cause claim reversed." },
          { t:"Surveys can’t show anything.", why:"They show patterns." }] },
        b:{ prompt:"A model survey: teens who cook at home report eating more vegetables. A post says “Cooking makes teens eat more vegetables.” Best judgement?", options:[
          { t:"The survey shows a link; teens who already like vegetables might cook more. It doesn’t show cause.", ok:true, why:"A pattern in survey data is a correlation, and the cause could run the other way." },
          { t:"The post is correct.", why:"A survey shows a link, not a cause." },
          { t:"Vegetables make teens cook.", why:"Reversed cause claim." },
          { t:"The survey is useless.", why:"It shows a pattern worth testing." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which sentence describes a classmate’s lunch most respectfully and accurately?", options:[
          { t:"“Her lunch is rice, dal and spinach, a combination common in many South Asian homes.”", ok:true, why:"Describes the food; no judgement." },
          { t:"“Her ethnic food smells strong.”", why:"“Ethnic” others the food, and smell is a judgement." },
          { t:"“Her lunch is a good choice, unlike mine.”", why:M6 },
          { t:"“Her lunch is unusual.”", why:"Unusual to whom?" }] },
        b:{ prompt:"Which sentence describes a family’s dinner most respectfully and accurately?", options:[
          { t:"“They eat late, after sunset, during Ramadan, often starting with dates and water.”", ok:true, why:"It describes what and when they eat, and why, with no judgement." },
          { t:"“They eat at a strange time.”", why:M3 },
          { t:"“Fasting is unhealthy.”", why:"A judgement, not a description." },
          { t:"“Their food is exotic.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which is the best rewrite of “Chips are junk food and you should feel bad eating them”?", options:[
          { t:"“Chips are a sometimes food: tasty, but they offer little fibre and a lot of sodium compared with whole foods.”", ok:true, why:"Describes nutrients, not virtue." },
          { t:"“Chips are poison.”", why:"Exaggeration and moral language." },
          { t:"“Chips are fine if you exercise them off.”", why:"Frames eating as needing compensation." },
          { t:"“Only eat chips on cheat days.”", why:"“Cheat” is a moral label." }] },
        b:{ prompt:"Which is the best rewrite of “Salad is clean eating; pasta is dirty”?", options:[
          { t:"“Salads with vegetables add fibre and vitamins; whole-grain pasta adds fibre and energy. Both can fit a balanced plate.”", ok:true, why:"It describes what each food offers, not virtue." },
          { t:"“Pasta is a cheat food.”", why:M6 },
          { t:"“Salad is always healthier.”", why:"Depends on the salad and the context." },
          { t:"“Dirty foods should be avoided.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A sports drink ad shows a famous hockey player and the slogan “Fuel like a pro.” Which techniques are used?", options:[
          { t:"Celebrity or athlete endorsement and an implied performance claim", ok:true, why:"The star’s fame is borrowed for the drink, and the slogan implies it helps you perform." },
          { t:"A contest and a mascot", why:"Neither appears." },
          { t:"A health halo from fruit imagery", why:"No fruit shown." },
          { t:"Placement and price", why:"Neither is shown." }] },
        b:{ prompt:"A creator posts a smoothie recipe using a brand’s protein powder, tagged #partner. Which techniques are used?", options:[
          { t:"Influencer content (sponsored), disclosed as a paid partnership", ok:true, why:"#partner means the brand paid for or supplied the post." },
          { t:"A mascot", why:"No mascot." },
          { t:"A government health claim", why:"It’s a brand partnership." },
          { t:"An unbiased review", why:"Sponsored content isn’t neutral." }] } },
      { id:"a2", cat:"A", goal:[6, 2],
        a:{ prompt:"A school wants more students eating lunch. Which plan best respects culture <strong>and</strong> addresses barriers?", options:[
          { t:"Offer a free lunch with vegetarian and halal options, served during a longer lunch period", ok:true, why:"Addresses cost, time and food practices." },
          { t:"Ban outside food", why:"Ignores culture and choice." },
          { t:"Post nutrition facts in the cafeteria", why:M1 },
          { t:"Sell the same pork-based special daily", why:"Excludes students who don’t eat pork." }] },
        b:{ prompt:"A community centre wants more teens to cook at home. Which plan best respects culture and addresses barriers?", options:[
          { t:"Free evening cooking classes using affordable ingredients from several food traditions, with take-home portions", ok:true, why:"It addresses cost, skills and time, and welcomes many food traditions." },
          { t:"A lecture on why home cooking matters", why:M1 },
          { t:"Classes that teach only one cuisine", why:"Narrow cultural fit." },
          { t:"Classes with expensive ingredients", why:M5 }] } }
    ]
  },
  task:{
    title:"Two changes for Amira’s family", summary:"Two changes for Amira’s family",
    statement:"<p>Choose <strong>two</strong> changes that make a nutritious after-school snack and weeknight dinner easier for Amira’s family. More than one plan works. Find one, then try for another.</p><p class=\"tiny muted\">Amira’s family keeps halal, both parents work late shifts, and the budget is tight but steady. Tap two lever cards. Each card shows its influence, weekly cost, level and a note.</p>",
    base:[2, 2, 3, 3, 1, 1],
    cards:[
      { id:"L1", t:"Batch-cook lentil soup on Sundays", inf:["acc"], infT:"Access and time", cost:0, costT:"$0 extra", level:"Household", note:"Uses pantry staples", fx:{ acc:-1 } },
      { id:"L2", t:"School after-school snack program with halal-certified options", inf:["eco", "soc"], infT:"Economic; Social and cultural", cost:0, costT:"$0", level:"Community or school", note:"Free to students", fx:{ eco:-1, soc:-1 } },
      { id:"L3", t:"Free ham sandwiches at the youth drop-in", inf:["eco"], infT:"Economic", cost:0, costT:"$0", level:"Community", note:"Contains pork", fx:{ eco:-1, soc:1 } },
      { id:"L4", t:"Buy a slow cooker", inf:["acc"], infT:"Access and time", cost:10, costT:"$10 (first months)", level:"Household", note:"One-time purchase spread over weeks", fx:{ acc:-1 } },
      { id:"L5", t:"Frozen vegetables in bulk from a discount grocer", inf:["eco"], infT:"Economic", cost:0, costT:"$0 extra", level:"Household", note:"Replaces fresh at a similar cost", fx:{ eco:-1 } },
      { id:"L6", t:"Meal-kit delivery three nights a week", inf:["acc"], infT:"Access and time", cost:30, costT:"$30", level:"Household", note:"", fx:{ acc:-1 } },
      { id:"L7", t:"Join the community centre’s monthly shared-meal kitchen", inf:["soc", "acc"], infT:"Social and cultural; Access and time (skills)", cost:3, costT:"$3", level:"Community", note:"", fx:{ soc:-1, acc:-1 } },
      { id:"L8", t:"Follow a creator’s “detox” plan", inf:["med"], infT:"Media", cost:15, costT:"$15", level:"Household", note:"No evidence for “detox” claims", fx:{ med:1 } }
    ],
    text:{ cost:"Weekly cost", level:"Level", picked:"cards chosen", total:"Total weekly cost", legend:"Thinner thread: that pull eases. Thicker: it pulls harder.", easing:"Easing", harder:"Pulling harder", none:"Tap two cards to see which threads ease." },
    checks:["Two different changes", "Works on at least two influences", "Fits the budget", "Respects the family’s food practices", "At least one community or school change", "Evidence-based"],
    tips:["Pick exactly two cards.", "Your two changes act on the same influence. Choose one that eases a different pull.", "Add up the weekly costs. The budget is $5.", "Amira’s family keeps halal. Check each card’s note.", "Families don’t solve food barriers alone. Include a school or community change.", "“Detox” plans have no evidence behind them, and they cost money."],
    explainPrompt:"Explain which influences your two changes ease and why they fit this family.",
    vocab:"Use the words influence, barrier, access, economic and culture.",
    checkLabel:"Check my plan",
    success:"Your plan works!",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Six kinds of influence", "Biological, economic, physical access and time, social and cultural, psychological, media."],
    ["Biological influence", "A body signal or trait: hunger, fullness, taste, e.g. craving salt after a long run."],
    ["Economic influence", "Price and income, e.g. choosing store-brand oats to save money."],
    ["Physical access", "Distance, time, equipment, skills, e.g. a microwave-only kitchen."],
    ["Social and cultural influence", "Family, culture, religion, friends, e.g. fasting in Ramadan."],
    ["Psychological influence", "Mood, stress, habit, e.g. snacking while studying under stress."],
    ["Health halo", "A claim that makes a whole product seem healthy, e.g. “made with real fruit”."],
    ["Third-person effect", "Believing media affects other people more than yourself."],
    ["Correlation vs cause", "A pattern in data is a link; a cause needs stronger evidence."],
    ["Neutral food language", "Describe foods by what they offer (“high in fibre”), not by virtue (“good”, “junk”)."],
    ["Lever", "One change to a situation, like time, cost or access, that can change a choice."],
    ["Food Guide habit", "“Be aware of food marketing”: one of Canada’s Food Guide’s healthy eating habits (2019)."]
  ]
};
