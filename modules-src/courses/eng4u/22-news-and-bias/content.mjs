// ENG4U 22 News, Bias & Source Evaluation. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/22-news-and-bias.md
// Public-domain texts (quoted as the plan prints them):
// VERIFY: Milton, Areopagitica (1644): "Give me the liberty to know, to utter, and to argue freely according to conscience,
//   above all liberties." Check the wording against a public-domain edition (e.g. the 1644 text or Project Gutenberg).
// VERIFY: Swift, The Examiner, no. 14 (1710): check the wording and spelling ("undeceiv'd", capitals) against a public-domain edition.
// Everything else (Port Calder, its people, outlets, posts and data) is the plan's practice model, written for the module.
// VERIFY: practice-model names (The Calder Courier, PortNow, Harbour Weekly, The Daily Puddle, @CalderTruthNow, @PortCalderCity,
//   CalderFacts.info, "Drivers for Calder"), plus the handles this build added (@harbourwatcher, @calderlaughs, @calderchat), must not
//   match real outlets, accounts, domains or groups (plan §6.3). Simulated URLs use the reserved .example domain.

// misconception core sentences (plan §3)
const M1 = "Disagreeing isn’t evidence of bias. Point to the choices: word choice, omission, photos, sources.";
const M2 = "Anyone can make a site look professional. Leave the page and find out who’s behind it.";
const M3 = "Every fact here is true, yet the m&#101;ter swung. Bias can live in what’s chosen and how it’s framed.";
const M4 = "Compare like with like: per year, per person, out of how many?";
const M5 = "Misinformation is shared in good faith; disinformation is meant to deceive; satire wants to be recognized. You often can’t know intent, but you can always check before sharing.";
const M6 = "Fairness means representing the real perspectives accurately, not treating a disproven claim as equal to the evidence.";
const M7 = "Visual tells come and go as tools improve. Trace the image’s origin instead.";
const SET = (m) => " <button type='button' class='btn ghost sm nb-setup' data-setup='" + m + "'>Set it up</button>";

const MILTON = "Give me the liberty to know, to utter, and to argue freely according to conscience, above all liberties.";
const SWIFT = "Falsehood flies, and the Truth comes limping after it; so that when Men come to be undeceiv’d, it is too late; the Jest is over, and the Tale has had its Effect.";

// The newsroom's practice model (plan, Explore). pts = the teaching model's points (plan table "The model behind the meter").
const TYPES = [{ id:"word", t:"Word choice", role:"diction" }, { id:"omission", t:"Selection and omission", role:"syntax" },
  { id:"images", t:"Images and placement", role:"image" }, { id:"sources", t:"Sources and statistics", role:"sound" }];
const VERBS = [{ id:"approves", t:"approves", pts:0 }, { id:"votesfor", t:"votes for", pts:0 }, { id:"rams", t:"rams through", pts:-2 }, { id:"finally", t:"finally delivers", pts:2 }];
const OBJECTS = [{ id:"lane", t:"Harbour Street bike lane" }, { id:"parking", t:"parking cut" }, { id:"safety", t:"safety plan" }];
const DETAILS = [{ id:"none", t:"(no detail)", pts:0 }, { id:"vote", t:"7–4", pts:0 }, { id:"outcry", t:"despite merchant outcry", pts:-1 }, { id:"injuries", t:"after nine injuries", pts:1 }];
const PHOTOS = [{ id:"a", t:"“No Parking” signs over empty spaces", pts:-1 }, { id:"b", t:"A child cycling beside a delivery truck", pts:1 },
  { id:"c", t:"A wide shot of the council chamber during the vote", pts:0 }, { id:"d", t:"The bakery owner looking worried in her doorway", pts:-1 }];
const PLACES = [{ id:"front", t:"Front page, top" }, { id:"p14", t:"Page 14" }];
const SOURCES = [
  { id:"q1", n:"Q1", who:"Marta Kowalczyk", role:"bakery owner", q:"Half my customers park right out front. Where will they go?", lead:"Bakery owner Marta Kowalczyk said", pts:-1 },
  { id:"q2", n:"Q2", who:"Councillor Ray Dunphy", role:"voted no", q:"We should have consulted merchants first.", lead:"Councillor Ray Dunphy, who voted no, said", pts:-1 },
  { id:"q3", n:"Q3", who:"Amira Haddad", role:"Harbour Street parents’ group", q:"My kids should be able to bike to school without dodging trucks.", lead:"Amira Haddad of the Harbour Street parents’ group said", pts:1 },
  { id:"q4", n:"Q4", who:"Councillor Hélène Tremblay", role:"voted yes", q:"This street has had nine cyclist injuries in three years. We can’t wait.", lead:"Councillor Hélène Tremblay, who voted yes, said", pts:1 },
  { id:"q5", n:"Q5", who:"Sunil Rao", role:"city traffic engineer", q:"Similar streets elsewhere kept most of their customers after lanes went in, but results vary.", lead:"City traffic engineer Sunil Rao said", pts:0 },
  { id:"q6", n:"Q6", who:"Ben Okafor", role:"commuter", q:"It already takes me twenty minutes to cross downtown.", lead:"Commuter Ben Okafor said", pts:-1 }];
const FACTS = [
  { id:"vote", t:"Vote count", pts:0, s:"Port Calder city council voted 7–4 on Tuesday to build a 1.2 km protected bike lane on Harbour Street." },
  { id:"injuries", t:"Injuries", pts:1, s:"City data show 9 cyclist injuries on Harbour Street in the past 3 years." },
  { id:"grant", t:"Grant share", pts:1, s:"A provincial grant covers 60% of the cost." },
  { id:"cyclists", t:"Cyclist count", pts:1, s:"A city count found 410 cyclists per weekday on the street." },
  { id:"parking", t:"Parking removed", pts:-1, s:"The lane removes 38 of the 120 street parking spots on that stretch." },
  { id:"cost", t:"Cost", pts:-1, s:"The lane costs $2.4 million." },
  { id:"months", t:"Construction months", pts:-1, s:"Construction runs from May to August." }];
const FACT_SHEET = "<h4 class='nb-fs-h'>Port Calder city council votes on a Harbour Street bike lane</h4><ul class='nb-fs'>" +
  "<li><strong>Vote:</strong> council voted <strong>7–4</strong> on Tuesday to build a <strong>1.2 km</strong> protected bike lane on Harbour Street.</li>" +
  "<li><strong>Parking:</strong> removes <strong>38 of 120</strong> street parking spots on that stretch.</li>" +
  "<li><strong>Cost and funding:</strong> costs <strong>$2.4 million</strong>; <strong>60%</strong> is covered by a provincial grant.</li>" +
  "<li><strong>Use:</strong> a city count found <strong>410</strong> cyclists per weekday on the street.</li>" +
  "<li><strong>Safety:</strong> <strong>9</strong> cyclist injuries on Harbour Street in the past <strong>3</strong> years (city data).</li>" +
  "<li><strong>Timing:</strong> construction runs from May to August.</li></ul><p class='nb-fs-q'><strong>Quotations:</strong></p><ul class='nb-fs'>" +
  SOURCES.map((s) => "<li><strong>" + s.n + "</strong> · " + s.who + ", " + s.role + ": “" + s.q + "”</li>").join("") + "</ul>";

// The three practice-model outlets (TC3). Their lead texts are written from the fact sheet.
const OUTLETS = [
  { id:"courier", name:"The Calder Courier", where:"Page 1", place:"front", photo:"c", head:"Council Approves Harbour Street Bike Lane, 7–4",
    lead:["The Harbour Street bike lane will cost $2.4 million and remove 38 of the 120 parking spots on that stretch, with construction running from May to August.",
      "“Half my customers park right out front. Where will they go?” asked bakery owner Marta Kowalczyk.", "Councillor Ray Dunphy, who voted no, said, “We should have consulted merchants first.”"] },
  { id:"portnow", name:"PortNow", where:"Online", place:"online", photo:"", head:"Council Rams Through Bike Lane Despite Merchant Outcry",
    lead:["Council voted 7–4 on Tuesday for the Harbour Street lane, a street where city data show 9 cyclist injuries in the past 3 years.",
      "Councillor Hélène Tremblay, who voted yes, said, “This street has had nine cyclist injuries in three years. We can’t wait.”"] },
  { id:"weekly", name:"Harbour Weekly", where:"Page 14", place:"p14", photo:"d", big:true, head:"Council votes 7–4 for Harbour Street bike lane",
    lead:["Council voted 7–4 on Tuesday for a 1.2 km protected lane. City data show 9 cyclist injuries on the street in 3 years, and a provincial grant covers 60% of the $2.4 million cost. The lane removes 38 of 120 parking spots.",
      "“Half my customers park right out front. Where will they go?” asked bakery owner Marta Kowalczyk. Councillor Hélène Tremblay said, “This street has had nine cyclist injuries in three years. We can’t wait.” City traffic engineer Sunil Rao said, “Similar streets elsewhere kept most of their customers after lanes went in, but results vary.”"] }];

// Real-example slots (plan: kept in a slot file the teacher refreshes each term). Empty until the teacher fills them.
// EXCERPT SLOT: real coverage of ONE recent event by at least three Canadian outlets (credited screenshot or excerpt: outlet,
//   headline, date, page or section), differing in at least two of headline verb, lead facts, photo, placement, sources.
//   Fill realSlot.event, realSlot.versions [{credit, html}] and realSlot.worked (the teacher's model diagnosis of one version).
const REAL_SLOT = { event:"", versions:[], worked:"" };
// EXCERPT SLOT: Part 3 station 5, a current real claim, post or image that a reputable fact-checker has already examined.
//   Fill liveSlot.claim (html, credited); the teacher's key compares the classification with the fact-checkers' finding.
const LIVE_SLOT = { claim:"" };

const RUBRIC = [["Level", "Knowledge: news conventions (lead, attribution)", "Thinking: fairness and selection", "Communication: clarity and style", "Application: editor’s note (naming bias)"],
  ["1", "Few present", "One-sided", "Unclear", "Missing"],
  ["2", "Some present", "Some balance", "Somewhat clear", "Names a bias vaguely"],
  ["3", "Clear and correct", "Balanced, with justified selection", "Clear and concise", "Explains a choice"],
  ["4", "Polished and economical", "Balanced, nuanced and anticipates misreadings", "Vivid, precise and fair in tone", "Insightful reflection on framing"]];
const RUB = "<details class='alg nb-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr>" + RUBRIC[0].map((h) => "<th scope='col'>" + h + "</th>").join("") + "</tr></thead><tbody>" +
  RUBRIC.slice(1).map((r) => "<tr>" + r.map((c, i) => (i ? "<td>" : "<th scope='row'>") + c + (i ? "</td>" : "</th>")).join("") + "</tr>").join("") + "</tbody></table></div></details>";

// Fair front page fact sheet (plan; teacher option: replace with a real local event, built from public sources and credited).
// Checklist lines 2 and 4 read their keywords and numbers from this object.
const TASK_FACTS = {
  title:"Port Calder District School Board votes on a later start",
  items:["<strong>Vote:</strong> the Port Calder District School Board voted <strong>8–3</strong> to move the high-school start time from 8:30 to <strong>9:15</strong> beginning in <strong>September</strong>.",
    "<strong>Cost:</strong> the change requires <strong>four</strong> additional bus routes, costing <strong>$310 000</strong> a year.",
    "<strong>Surveys:</strong> a board survey of <strong>1 240</strong> students found <strong>71%</strong> in favour. A separate parent survey found <strong>46%</strong> worried about conflicts with after-school jobs and sports."],
  quotes:[
    { id:"mensah", tag:"supports", who:"Board chair Dr. Ama Mensah", q:"Our students told us they’re exhausted. We listened." },
    { id:"ross", tag:"supports", who:"Student trustee Talwyn Ross", q:"First period at 8:30 is a room full of zombies." },
    { id:"ferreira", tag:"opposes", who:"Parent Dana Ferreira", q:"Practices will now end after dark in November." },
    { id:"baptiste", tag:"opposes", who:"Coach Luis Baptiste", q:"We’ll lose gym time we share with the community." },
    { id:"walsh", tag:"neutral", who:"Transportation manager Erin Walsh", q:"The new bell times require four additional bus routes." }],
  lead:{ who:["school board", "port calder district school board"], what:"9:15", when:"September" },
  numbers:[{ t:"8–3", alt:["8-3"] }, { t:"$310 000", alt:["310 000", "310,000", "310 000"] }, { t:"1 240", alt:["1,240", "1 240"] }, { t:"71%", alt:[] }, { t:"46%", alt:[] }, { t:"four additional bus routes", alt:[] }]
};

// Name the bias: hints 1–2 are authored; 3 is the answer with its reason (the plan gives hints for items 5 and 8)
const NH = (two, three) => ["Is the tilt in the words, in what’s missing, in the picture or the page, or in whose voices and which numbers?", two, three];

export default {
  id:"22-news-and-bias",
  kind:"topic",
  title:"News, bias and source evaluation",
  topic:"News, Bias & Source Evaluation",
  readyTopic:"reading the news for bias",
  hero:{
    headline:"Free to know. Free to check.",
    text:"News arrives already shaped. Someone chose the headline verb, the photo, the page, the people quoted and the numbers compared. <strong>Bias</strong> usually hides in those choices, not in outright lies. This module puts you in the editor’s chair, then teaches you the fact-checker’s trick: <strong>leave the page</strong> to find out what’s true.",
    fig:{ html:"<div class='nb-hero' id='nb-hero' role='group' aria-label='Milton’s sentence appears in an old printed typeface, as if pressed onto paper. As it is read, the phrases to know, to utter, and to argue lift into three rising steps. The paper slides away to show a phone feed scrolling the same sentence in a modern typeface, among headlines. Caption: three hundred and eighty years later, the liberty is the same; the tools have changed.'></div>", caption:"" },
    quote:MILTON,
    steps:[[5, "to know,"], [7, "to utter,"], [10, "and to argue"]],
    cite:"John Milton, <i>Areopagitica</i> (1644)",
    feed:["Council vote tonight: what you need to know", "Is this photo real? Three ways to check", "Snow likely by Friday, forecasters say"],
    caption:"Three hundred and eighty years later, the liberty is the same. The tools have changed.",
    listen:"Listen", watch:"Watch again", noVoice:"Read it aloud yourself, and lean on the three steps: to know, to utter, and to argue."
  },
  goals:[
    "I can identify the main types of bias in news: word choice, selection and omission, images and placement, and sources and statistics.",
    "I can explain how the same facts can be framed to create different impressions, including misleading statistics.",
    "I can evaluate a source’s credibility by reading laterally and using the SIFT moves.",
    "I can distinguish accurate reporting, misinformation, disinformation, satire and sponsored content, including AI-generated images.",
    "I can analyse the perspective a text writes from, and acknowledge my own.",
    "I can write a fair news story and explain my editorial choices."
  ],
  start:{
    blocks:[{ title:"Word story: bias (and news)", html:"<p><strong>Bias</strong> comes from the French <em>biais</em>, “slant”. In the old game of lawn bowling, a <em>bias</em> is the weight built into one side of the ball so that it curves as it rolls. Every bowl runs on a bias; the skill is knowing which way it will bend.</p><p>And <strong>news</strong>? It’s a popular myth that the word comes from <strong>N</strong>orth, <strong>E</strong>ast, <strong>W</strong>est and <strong>S</strong>outh. It simply means “new things”, the plural of <em>new</em>. Even the story of the word <em>news</em> needs checking.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Fact vs opinion", goal:2, prompt:"Which statement is a fact that could be checked?",
          options:[{ t:"“Council voted 7–4 on Tuesday to build the lane.”", ok:true, why:"A vote count and a day can be verified." },
            { t:"“The lane is a waste of money.”", why:"Opinion presented as fact. “Waste” is a judgment." },
            { t:"“Everyone hates the new lane.”", why:"An overgeneralization. “Everyone” can’t be true or checked." },
            { t:"“The lane is the best thing to happen to downtown.”", why:"An opinion. “Best” is evaluative." }],
          hints:["Could you check it with a record?", "Votes are recorded.", "“Council voted 7–4 on Tuesday to build the lane.”"] },
        { id:"w2", skill:"Fact vs opinion", goal:5, prompt:"A news article quotes a merchant: “The lane will ruin my business.” What is the quotation?",
          options:[{ t:"An accurate report of an opinion: it’s a fact that she said it, but her claim is a prediction", ok:true, why:"Reporting an opinion doesn’t make it a fact." },
            { t:"A proven fact, because it’s in the news", why:"Source authority: being reported ≠ being true." },
            { t:"Bias by the reporter", why:"Quoting someone isn’t itself biased; <em>who</em> is quoted, and how many on each side, matters." },
            { t:"A statistic", why:"No numbers." }],
          hints:["Separate <em>that she said it</em> from <em>what she said</em>.", "Her claim predicts the future.", "An accurate report of an opinion."] },
        { id:"w3", skill:"Connotation", goal:1, prompt:"Which verb gives a <em>negative</em> connotation to a council decision?",
          options:[{ t:"“Rams through”", ok:true, why:"Suggests force and disregard." },
            { t:"“Approves”", why:"Neutral." }, { t:"“Passes”", why:"Neutral." }, { t:"“Votes for”", why:"Neutral." }],
          hints:["Which verb makes you picture something forceful?", "Ramming is violent.", "“Rams through”."] },
        { id:"w4", skill:"Connotation", goal:1, prompt:"“Long-suffering cyclists finally get their due.” Which words carry the writer’s attitude?",
          options:[{ t:"“Long-suffering” and “finally … their due”", ok:true, why:"They cast cyclists as victims now rewarded." },
            { t:"“Cyclists”", why:"That’s the subject, a neutral noun." },
            { t:"“Get”", why:"A plain verb." },
            { t:"None; the sentence is neutral", why:"Read the adjectives again." }],
          hints:["Find the adjectives and adverbs.", "“Long-suffering”, “finally”.", "“Long-suffering” and “finally … their due”."] },
        { id:"w5", skill:"Judging a source", goal:3, prompt:"You find a statistic on a website with no author, no “About” page and no sources. What’s the best first move?",
          options:[{ t:"Open a new tab and search for who runs the site, and whether better coverage of the statistic exists", ok:true, why:"Leave the page: lateral reading." },
            { t:"Read the site’s other pages carefully to judge its tone", why:"That’s vertical reading. A site can’t vouch for itself." },
            { t:"Trust it if the design looks professional", why:"Design isn’t evidence." },
            { t:"Ignore all statistics online", why:"Cynicism isn’t evaluation; check it." }],
          hints:["Who could tell you about this site besides the site?", "Other sources.", "Open a new tab and search for who runs the site."] },
        { id:"w6", skill:"Judging a source", goal:3, prompt:"Which feature most strengthens a news story’s credibility?",
          options:[{ t:"Named sources, a named reporter and a published corrections policy", ok:true, why:"Accountability signals." },
            { t:"A large number of shares", why:"Popularity: popular ≠ accurate." },
            { t:"Many exclamation marks for urgency", why:"Urgency is a warning sign, not a credential." },
            { t:"A dramatic photo", why:"Photos can be chosen to persuade." }],
          hints:["What lets you hold a story accountable?", "Names and corrections.", "Named sources, a named reporter and a corrections policy."] }
      ],
      refreshers:{
        "Fact vs opinion":"A fact can be checked against a record. An opinion judges. A quoted opinion is a fact <em>about what someone said</em>, not proof of what they claim.",
        "Connotation":"Words carry feelings beyond their dictionary meaning: “approves” vs “rams through”. Writers’ attitudes hide in verbs, adjectives and adverbs.",
        "Judging a source":"Ask: who made this, how do they know, and what do <em>other</em> sources say? Leave the page to find out."
      }
    }
  },
  explore:{
    heading:"Newsroom simulator",
    intro:"You’re the editor at a city paper. One true event, many ways to tell it. Every fact on the fact sheet is accurate. Watch what your choices do to a reader. Then read real coverage of a real event with the same eyes.",
    modes:[{ id:"editor", t:"Editor" }, { id:"reader", t:"Reader" }, { id:"lateral", t:"Lateral reading" }],
    how:{ editor:"Build the story: choose a headline, a photo, a page, up to three sources and the facts. The m&#101;ter shows how a reader is likely to see the decision.",
      reader:"Read versions of one event side by side. Ask what each version <em>chooses</em>, never whether an outlet is “biased” overall.",
      lateral:"A post about the lane is going around. Don’t stare harder at it: open new tabs to check the source and the claim." },
    types:TYPES, verbs:VERBS, objects:OBJECTS, details:DETAILS, photos:PHOTOS, places:PLACES, sources:SOURCES, facts:FACTS, factSheet:FACT_SHEET, outlets:OUTLETS,
    realSlot:REAL_SLOT,
    meterWords:["Strongly: bad decision", "Leans: bad decision", "Slightly: bad decision", "Balanced", "Slightly: good decision", "Leans: good decision", "Strongly: good decision"],
    about:"<strong>About this model:</strong> a teaching model of how framing tilts readers; real readers vary. Each choice carries points: verbs (“rams through” −2, “finally delivers” +2), details (±1), photos (±1), sources (±1) and facts (±1). The reader impression is the sum, kept between −3 and +3. Placement doesn’t move the impression; it sets importance.",
    aha:"With identical facts, the verb and the photo alone can swing a reader from “good” to “bad”. Bias is in the building.",
    readout:{ imp:"Reader impression", importance:"Importance", balance:"Balance", flags:"Bias flags", facts:"Facts included" },
    lateral:{
      post:{ handle:"@CalderTruthNow", name:"Calder Truth Now", followers:"12.4k followers", text:"BREAKING: Port Calder blows <strong>$24 MILLION</strong> on a bike lane!!", reposts:"1.3k reposts" },
      tabs:[
        { id:"post", t:"The post", url:"social.example/CalderTruthNow" },
        { id:"who", t:"Who’s behind it?", url:"search.example/?q=CalderTruthNow", sift:"I",
          html:"<h5>Search results for “CalderTruthNow”</h5><ul class='nb-res'><li>The account was created three weeks ago and posts only about the bike lane.</li><li>No names, address or contact details are listed anywhere.</li><li>No news outlet or official source cites it.</li></ul><p class='tiny muted'>Followers and a confident tone aren’t credentials.</p>" },
        { id:"budget", t:"City budget page", url:"portcalder.example/budget", sift:"T",
          html:"<h5>City of Port Calder · Capital budget</h5><table class='nb-bud'><tbody><tr><th scope='row'>Harbour Street protected bike lane (1.2 km)</th><td>$2.4 million</td></tr><tr><th scope='row'>Provincial grant</th><td>60%</td></tr><tr><th scope='row'>City share</th><td>40%</td></tr></tbody></table>" },
        { id:"paper", t:"Local paper", url:"caldercourier.example", sift:"F",
          html:"<h5>The Calder Courier</h5><p>The Harbour Street bike lane will cost <strong>$2.4 million</strong>; a provincial grant covers 60% of it, city budget documents show.</p>" }],
      sift:[{ id:"S", t:"Stop" }, { id:"I", t:"Investigate the source" }, { id:"F", t:"Find better coverage" }, { id:"T", t:"Trace claims" }],
      note:"Every page here is a simulation; no real web requests are made."
    },
    reader:{
      sets:[{ id:"real", t:"Real coverage" }, { id:"model", t:"Practice model" }],
      slotEmpty:"<strong>Real coverage slot.</strong> Your teacher will add three Canadian outlets’ coverage of one recent event here (credited screenshots or excerpts). Until then, use the coverage your teacher shares in class, and record your analysis below.",
      ask:"For each version, ask “What does this headline choose?”, not “Is this outlet biased?”",
      fields:[{ id:"credit", t:"Outlet, headline, date and page or section (credit)" }, { id:"verb", t:"Headline verb" }, { id:"lead", t:"Facts in the lead" },
        { id:"photo", t:"Photo" }, { id:"place", t:"Placement" }, { id:"src", t:"Sources quoted" }, { id:"miss", t:"The fact or voice most missing" }],
      frameLabel:"Dominant framing choice",
      accept:"A diagnosis counts when it names one of the four bias types and points to a specific element of that version as evidence."
    },
    predictions:[
      { id:"p1", start:"base", change:{ verb:"rams" },
        prompt:"Change only the verb to <strong>“rams through”</strong>. What happens to the reader impression?",
        options:[{ t:"It drops to −2, even though every fact is the same", ok:true }, { t:"It stays at 0, because facts haven’t changed" }, { t:"It rises, because strong verbs are exciting" }, { t:"The story becomes false" }],
        explain:"No new fact was added, yet one verb tilted the reader. Bias can live entirely in word choice." },
      { id:"p2", start:"base", change:{ photo:"b" },
        prompt:"From the same start, swap the photo from the council chamber to <strong>the child cycling beside a truck</strong>. How will readers now tend to see the decision?",
        options:[{ t:"More as a safety decision; the impression rises to +1", ok:true }, { t:"No change, because readers ignore photos" }, { t:"As a business decision" }, { t:"As a traffic jam" }],
        explain:"Photos frame the story before readers reach a word." },
      { id:"p3", start:"base", change:{ place:"p14" },
        prompt:"Move the same story from the front page to <strong>page 14</strong>. What changes?",
        options:[{ t:"The impression is unchanged, but readers judge the story less important", ok:true }, { t:"The impression flips to negative" }, { t:"Nothing at all" }, { t:"The facts become less accurate" }],
        explain:"Placement is a choice about importance. Burying a story is a quiet kind of bias." },
      { id:"p4", start:"lateral",
        prompt:"A post from @CalderTruthNow: “BREAKING: Port Calder blows <strong>$24 MILLION</strong> on a bike lane!!” Opening the city’s budget page in a new tab shows <strong>$2.4 million</strong>, 60% grant-funded, and the local paper agrees. What is the best next step?",
        options:[{ t:"Don’t share it; trace the claim to the city’s own figure, and if you reply, link the source", ok:true }, { t:"Read the post’s other replies to see what people think" }, { t:"Share it with a question mark, to be safe" }, { t:"Trust it, because the account has many followers" }],
        explain:"Off by a factor of ten. The post’s confidence is no evidence; the original record is." }
    ],
    base:{ verb:"approves", obj:"lane", detail:"none", photo:"c", place:"front", sources:["q2", "q4", "q5"], facts:["vote", "injuries", "parking"] },
    predIntro:"Every prediction starts from the same story: verb “approves”, the council-chamber photo, sources Q2, Q4 and Q5, and the vote count, injuries and parking facts (impression 0).",
    chalIntro:"Build in the newsroom, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build the <strong>fairest</strong> front-page version you can." + SET("tc1"),
        msgs:{ verb:"Start with a neutral verb: “approves” or “votes for”.", detail:"That detail carries a charge. Leave it off, or use “7–4”.",
          photo:"That photo tilts the reader before the text does. Which photo shows the event itself?",
          sides:"Readers hear only one side. Add a voice from the other.", facts:"Include at least one fact that favours the lane and one that counts against it.",
          vote:"Include the vote count: it’s the event itself.", lean:"Your facts lean one way. Balance the facts as well as the quotes.", place:"Put the story where a fair editor would put a city-wide decision: the front page." },
        why:"A neutral verb, the event’s own photo, both sides heard and both kinds of fact: your balance checks all read ✔. Many versions meet this test; yours is one.",
        hints:["Start with a neutral verb and the council photo.", "Pick one supporter and one opponent; Q5 (the engineer) adds evidence without tilting.", "For example: “Council approves Harbour Street bike lane, 7–4”; photo (c); Q2, Q4, Q5; vote count, injuries, parking removed."] },
      { id:"tc2", goal:[1, 2], prompt:"The sources and facts are now <strong>locked</strong> to a balanced set (Q2, Q4, Q5; vote count, injuries, parking removed). Using only the <strong>headline verb</strong> and <strong>photo</strong>, make readers see the decision as a bad one: impression ≤ −2." + SET("tc2"),
        msgs:{ lock:"Press Set it up to lock the sources and facts first.", detail:"Use only the verb and the photo: set the detail back to none (or “7–4”).",
          small:"The photo alone tilts it only a little. Which element carries the biggest charge?", truck:"The child-and-truck photo pulls readers back toward safety." },
        general:"Not yet. The impression needs to reach −2 or lower.",
        why:"Same facts, same quotes, opposite impression. Remember how easy that was.",
        hints:["Which lever has the biggest number in the model?", "The verb: “rams through” is −2.", "“Rams through” with a parking, council or worried-owner photo."] },
      { id:"tc3", goal:[1, 2], stretch:true, prompt:"<strong>Reader mode, practice model.</strong> Match each outlet to its main bias type, then choose the <strong>one fact</strong> that would most improve <i>The Calder Courier</i>’s balance." + SET("tc3"),
        answer:{ courier:"omission", portnow:"word", weekly:"images", fact:"injuries" },
        msgs:{ count:"Match all three outlets and choose one fact.", courier:"Its headline is neutral. Look at what’s <em>missing</em> from the lead.",
          grant:"That helps too, but the council’s stated <em>reason</em> for the vote was safety. Without the injury data, the “why” disappears.",
          weekly:"Its text is balanced. The tilt comes from the page and the picture." },
        general:"Not yet. For each outlet, ask: is the slant in the words, the missing facts, or the layout?",
        why:"The <i>Courier</i> tilts by omission, <i>PortNow</i> by word choice and <i>Harbour Weekly</i> by images and placement. Adding the injury figure restores the reason council gave.",
        hints:["For each outlet, ask: is the slant in the words, the missing facts, or the layout?", "The <i>Courier</i> never says <em>why</em> council voted yes.", "The <i>Courier</i>: omission; <i>PortNow</i>: word choice; <i>Harbour Weekly</i>: images and placement. Add the injury figure."] }
    ]
  },
  part3:{
    slug:"check", name:"Check",
    heading:"Check before you share",
    intro:"Explore was about framing true facts. This part is about checking claims: is it true at all? Work through the stations in a simulated browser. Each one practises a <strong>SIFT</strong> move: <strong>S</strong>top, <strong>I</strong>nvestigate the source, <strong>F</strong>ind better coverage, <strong>T</strong>race claims to their original context.",
    // VERIFY: SIFT attribution (Mike Caulfield) and date before release (plan §6.4).
    credit:"The SIFT method was developed by digital-literacy educator Mike Caulfield.",
    sift:[{ id:"S", t:"Stop" }, { id:"I", t:"Investigate the source" }, { id:"F", t:"Find better coverage" }, { id:"T", t:"Trace" }],
    s1:{ title:"Station 1: Stop", post:{ handle:"@harbourwatcher", text:"Port Calder’s new lane, already underwater!" },
      prompt:"Before anything else: what do you notice about your own reaction?",
      chips:["Angry", "Amused", "Wanting to share", "Curious"],
      note:"Strong feelings are the moment to slow down." },
    s2:{ title:"Station 2: Investigate the source and trace the image",
      how:"Open the image-search tabs, then say what each trace shows.",
      posts:[
        { id:"flood", label:"Post 1: the flooded lane", search:"<h5>Image search: the flooded-lane photo</h5><p><strong>Earliest match:</strong> a news story about spring flooding in a different city, dated 2019. The same photo appears on dozens of later pages.</p>",
          prompt:"What does the trace show about the flooded-lane photo?",
          choices:[{ t:"It’s a real photo from a 2019 flood in another city, used with a false caption", ok:true, fb:"Right. The image is real; the caption’s claim isn’t." },
            { t:"It was taken this week on Harbour Street", fb:"The earliest copy is from 2019, in another city." },
            { t:"It’s AI-generated", fb:"It traces to a real 2019 news photo. Real photos can carry false captions." },
            { t:"Nothing: image search can’t help", fb:"The search found the original story. That’s the trace." }] },
        { id:"mayor", label:"Post 2: the mayor in a blizzard", search:"<h5>Image search: the mayor-in-a-blizzard image</h5><p><strong>Earliest match:</strong> an account that posts AI-generated art, two days ago. No news outlet has published it.</p>",
          prompt:"What does the trace show about the mayor-in-a-blizzard image?",
          choices:[{ t:"It first appeared on an AI-art account and no reliable outlet carries it, so treat it as AI-generated", ok:true, fb:"Right. The origin is the evidence." },
            { t:"It’s real, because it looks real", fb:"Convincing isn’t the same as authentic. Trace it." },
            { t:"It’s fake: you can tell from the hands", fb:M7 },
            { t:"It’s real, because so many people shared it", fb:"Popularity isn’t evidence." }] }],
      tells:"Visual tells (garbled sign text, odd hands) can help, but improving tools make them unreliable. <strong>Tracing the origin is the dependable move.</strong>",
      // VERIFY: Pope Francis puffer-coat image details (March 2023; made with Midjourney; traced to its creator) before release.
      example:"<strong>A real case.</strong> In March 2023, an AI-generated image of Pope Francis in a long white puffer coat spread widely as if it were a real photo. It was made with the image generator Midjourney, and reporting traced it to its creator." },
    s3:{ title:"Station 3: Find better coverage", post:{ handle:"@calderchat", text:"City says lane will be built by June!" },
      tabs:[{ id:"city", t:"City website", url:"portcalder.example/harbour-street", html:"<h5>City of Port Calder · Harbour Street bike lane</h5><p><strong>Construction:</strong> May to August.</p>" },
        { id:"paper", t:"Local paper", url:"caldercourier.example", html:"<h5>The Calder Courier</h5><p>Construction on Harbour Street runs from May to August, the city says.</p>" }],
      prompt:"Is the post accurate, misleading or false?",
      choices:[{ t:"Accurate", fb:"The city says May to August, not done by June." }, { t:"Misleading", ok:true, fb:"Right. Partly true (the city is building it), but wrong on timing." }, { t:"False", fb:"Not entirely: the lane is being built. The timing is what’s wrong." }] },
    s4:{ title:"Station 4: Trace, and name what it is",
      how:"Tap a label for each item.",
      labels:[{ id:"fc", t:"False context" }, { id:"fcl", t:"False claim, intent unknown" }, { id:"sat", t:"Satire" }, { id:"acc", t:"Accurate" }, { id:"spon", t:"Sponsored content" }],
      items:[
        { id:"i1", t:"The flooded-lane photo", answer:"fc", why:"A real photo used with a false caption, shared in good faith by many, so mostly misinformation." },
        { id:"i2", t:"The $24 million post", answer:"fcl", why:"Without evidence of intent, treat it as misinformation and don’t share." },
        { id:"i3", t:"“City replaces all cars with very tall bicycles,” from <i>The Daily Puddle</i> (a fictional satire site)", answer:"sat", why:"Satire, which becomes misinformation when shared as real." },
        { id:"i4", t:"A post from @PortCalderCity with the construction schedule", answer:"acc", why:"Official and corroborated." },
        { id:"i5", t:"“5 Reasons Bike Lanes Hurt Business,” labelled in small grey type “Paid content from Drivers for Calder”", answer:"spon", why:"Advocacy dressed as news." }],
      wrong:"Not that label. Trace it: where did it come from, and what is it trying to do?" },
    s5:{ title:"Station 5: Live trace",
      slotEmpty:"Your teacher will choose a current real claim, post or image that a fact-checking organization has already examined. Type it below, then run SIFT in your own browser. This module records your work; it makes no web requests.",
      claimLabel:"The claim you’re tracing",
      fields:[{ id:"first", t:"Where the claim first appeared" }, { id:"who", t:"Who is behind that source" }, { id:"better", t:"Better coverage found (outlet and date)" }, { id:"context", t:"The original context" }],
      classes:["Accurate", "Misleading", "False context", "Satire", "Sponsored", "False"],
      ok:"✓ Every part is there. Your teacher compares your classification with the fact-checkers’ finding.",
      need:{ fields:"Fill in all four fields.", date:"In “better coverage”, name the outlet and a date with a 4-digit year.", cls:"Choose a classification." },
      // VERIFY: AP Twitter hack details (April 2013; false report of explosions at the White House; brief stock dip) before release.
      example:"<strong>A real case.</strong> In April 2013, a hacked news-agency account (the Associated Press’s Twitter account) posted a false report of explosions at the White House. Stock prices dipped sharply within minutes before recovering once the claim was traced and corrected. A trusted account is not the same as a verified claim.",
      slot:LIVE_SLOT },
    blocks:[{ title:"Craft → meaning", html:"<p class='an-note an-theme'>A fact-checker’s skill is mostly <em>where to look</em>, not <em>how hard to stare</em>. The four moves are a habit, and habits are what protect us when we’re tired, angry or rushed.</p>" }],
    quickCheck:{ title:"Check quick check", summary:"Check quick check",
      items:[
        { id:"q1", goal:4, prompt:"A real photo with a false caption is…",
          choices:[{ t:"False context", ok:true, fb:"Right. The image is real; the claim attached to it isn’t." }, { t:"Satire", fb:"The image is real; the claim attached to it isn’t." },
            { t:"Accurate", fb:"The image is real; the claim attached to it isn’t." }, { t:"Sponsored content", fb:"The image is real; the claim attached to it isn’t." }] },
        { id:"q2", goal:3, prompt:"Which SIFT move fits “open new tabs to see what reliable outlets say”?",
          choices:[{ t:"Find better coverage", ok:true, fb:"Right. Look for the best coverage of the <em>claim</em>." }, { t:"Stop", fb:"Look for the best coverage of the <em>claim</em>." },
            { t:"Trace", fb:"Look for the best coverage of the <em>claim</em>." }, { t:"Investigate the source", fb:"Look for the best coverage of the <em>claim</em>." }] },
        { id:"q3", goal:4, prompt:"Your best defence against convincing AI-generated images is…",
          choices:[{ t:"Tracing where the image first appeared", ok:true, fb:"Right. Visual tells fade as tools improve; origins don’t." }, { t:"Zooming in on the hands", fb:"Visual tells fade as tools improve; origins don’t." },
            { t:"Trusting your gut", fb:"Visual tells fade as tools improve; origins don’t." }, { t:"Counting the likes", fb:"Visual tells fade as tools improve; origins don’t." }] },
        { id:"q4", goal:4, prompt:"A satirical headline shared as if real becomes…",
          choices:[{ t:"Misinformation", ok:true, fb:"Right. Shared in good faith, it misinforms." }, { t:"Disinformation always", fb:"Shared in good faith, it misinforms." },
            { t:"Accurate news", fb:"Shared in good faith, it misinforms." }, { t:"Sponsored content", fb:"Shared in good faith, it misinforms." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='nb-steal'>“" + SWIFT + "”</p><p class='eng-cite'>Jonathan Swift, <i>The Examiner</i>, no. 14 (1710)</p><p><strong>The pattern:</strong> personify two abstractions with contrasting verbs (<em>flies</em> / <em>comes limping</em>), then show the consequence.</p><p><strong>Your turn:</strong> write your own about any pair, such as Rumour and Correction, or Outrage and Evidence. For example: “Outrage sprints; Evidence ties its shoes.” The best go to the commonplace book.</p>",
      prompt:"Your imitation" }],
    steal:{ master:"Falsehood flies, and the Truth comes limping after it", source:"Swift, The Examiner, no. 14", save:"Save it to my commonplace book" }
  },
  practice:{
    activities:[
      { id:"sort", type:"custom", title:"Name the bias", summary:"Name the bias", goal:[1, 2], txt:true, noun:"item",
        instruction:"Ten moments from coverage of the lane. Sort each by its main type of bias. Trivium: Logic.", how:"",
        boxes:[{ id:"word", label:"Word choice" }, { id:"omission", label:"Selection and omission" }, { id:"images", label:"Images and placement" }, { id:"sources", label:"Sources and statistics" }],
        items:[
          { id:"n1", t:"Headline: “Merchants Fume as Lane Plan Bulldozes Parking”", answer:"word", why:"“Fume” and “bulldozes” carry the attitude.",
            wrong:{ sources:"The tilt is in “fume” and “bulldozes”." }, hints:NH("Which words would you swap for neutral ones?", "Word choice: “fume” and “bulldozes”.") },
          { id:"n2", t:"The article quotes three business owners and no cyclists", answer:"sources", why:"Whose voices appear: a source imbalance.",
            wrong:{ omission:"It’s specifically about <em>whose voices</em> appear: sources." }, hints:NH("Count the voices on each side.", "Sources and statistics: only one side is quoted.") },
          { id:"n3", t:"The story never mentions that 60% of the cost is grant-funded", answer:"omission", why:"A missing fact that would change the reader’s view.",
            wrong:{ word:"No loaded word; a missing fact." }, hints:NH("Is anything in the story loaded, or is something left out?", "Selection and omission: the grant is missing.") },
          { id:"n4", t:"A crash photo from a different street runs beside the lane story", answer:"images", why:"The picture frames the story, and it isn’t even this street.",
            wrong:{ sources:"The photo itself frames the story." }, hints:NH("What does the reader see before reading?", "Images and placement: the photo does the framing.") },
          { id:"n5", t:"“Collisions up 50%!” (6 in 2 years before; 9 in 3 years after)", answer:"sources", why:"A misleading statistic: 3 per year both times.",
            wrong:{ word:"The problem is the comparison: 3 per year both times." }, hints:["How many years in each count?", "6 ÷ 2 and 9 ÷ 3.", "3 per year both times: no increase. Sources and statistics."] },
          { id:"n6", t:"The council vote runs on page 22; a celebrity visit gets the front page", answer:"images", why:"Included, but buried: placement.",
            wrong:{ omission:"It’s included, but buried: placement." }, hints:NH("Is the vote missing, or just hard to find?", "Images and placement: page 22.") },
          { id:"n7", t:"“Long-suffering cyclists finally get their due”", answer:"word", why:"“Long-suffering” and “finally” carry the attitude.",
            wrong:{ omission:"Look at “long-suffering” and “finally”." }, hints:NH("Find the adjectives and adverbs.", "Word choice: “long-suffering” and “finally”.") },
          { id:"n8", t:"An online poll of a cycling club’s followers reported as “Residents overwhelmingly support the lane”", answer:"sources", why:"A self-selected sample treated as residents.",
            wrong:{ omission:"The issue is a self-selected sample treated as residents." }, hints:["Who answered the poll?", "People who follow a cycling club.", "Sources and statistics: an unrepresentative sample."] },
          { id:"n9", t:"The report gives the vote count but leaves out the reason councillors gave", answer:"omission", why:"The “why” is missing.",
            wrong:{ sources:"The <em>reason</em> is missing, not a voice." }, hints:NH("Is a voice missing, or a reason?", "Selection and omission: the reason is left out.") },
          { id:"n10", t:"Caption: “A lone shopper wanders a deserted Harbour Street,” under a photo taken at 7 a.m.", answer:"images", why:"The frame (a deserted 7 a.m. street) does the main work.",
            wrong:{ word:"The caption’s words help, but the frame (a deserted 7 a.m. street) does the main work." }, hints:NH("When was the photo taken, and what would the street look like then?", "Images and placement: the 7 a.m. frame.") }
        ],
        ext:{ title:"Real-world extension (not scored)", how:"Find one example of each bias type in the real coverage from Explore. Describe it in a sentence and credit it (outlet, headline, date). Your teacher sees these in your summary.", ph:"Example and credit" } },
      { id:"lab", type:"custom", title:"Lateral reading lab", summary:"Lateral reading lab", goal:[3, 4, 5], star:true,
        instruction:"Six source puzzles from Port Calder. Items 3 to 6 are ★ non-routine; items 4 and 6 go beyond the Final Check. Trivium: Logic.", how:"",
        items:[
          { id:"l1", goal:3, prompt:"CalderFacts.info has no author, no “About” page, and cites “studies show”. Best next step?",
            options:[{ t:"Search for who runs the site (Investigate the source)", ok:true, why:"Leave the page: find out who’s behind it." },
              { t:"Read its other articles", why:"A site can’t vouch for itself. " + M2 },
              { t:"Trust it, because it cites studies", why:"“Studies show” isn’t a source. Which studies?" },
              { t:"Share it and ask your followers", why:"Sharing spreads a claim no one has checked." }],
            hints:["Who could tell you about this site besides the site?", "Open a new tab.", "Search for who runs the site."] },
          { id:"l2", goal:3, prompt:"A local-paper article has a named reporter, three named sources and a corrections policy. Your stance?",
            options:[{ t:"Reasonably credible, but corroborate key figures", ok:true, why:"Strong accountability signals, and you still check the numbers that matter." },
              { t:"Fully proven", why:"Credible isn’t infallible; check the numbers that matter." },
              { t:"Unreliable, because all news is biased", why:"Cynicism skips the evaluation. These are strong accountability signals." },
              { t:"Credible only if it has many shares", why:"Popularity isn’t accuracy." }],
            hints:["What do names and a corrections policy tell you?", "Accountable, but not perfect.", "Reasonably credible; corroborate key figures."] },
          { id:"l3", goal:5, star:true, prompt:"A screenshot shows Councillor Tremblay saying “…We can’t wait.” The full quotation (Q4) begins with the injury figure. What does the crop change?",
            options:[{ t:"It removes her reason, making her sound impatient rather than safety-driven", ok:true, why:"The crop keeps her words and loses her reason." },
              { t:"Nothing; the words are hers", why:"Accurate words in a misleading frame still mislead. Trace to the original context." },
              { t:"It makes the quotation false", why:"The words are accurate; the frame is what misleads." },
              { t:"It shows that she voted no", why:"Tremblay voted yes. The original context (Q4) shows why." }],
            hints:["Read the whole of Q4.", "What did the crop cut off?", "Her reason: the injury figure."] },
          { id:"l4", goal:[1, 6], star:true, type:"build", prompt:"Rewrite “Council Rams Through Bike Lane Despite Merchant Outcry” as a neutral headline using the chip builder.",
            verbs:["approves", "votes for", "passes", "rams through", "caves on"], objects:["Harbour Street bike lane", "bike lane chaos"], details:["(no detail)", "7–4", "despite merchant outcry", "amid fury"],
            neutral:["approves", "votes for", "passes"], loaded:["rams", "outcry", "slams", "caves", "finally", "chaos", "fury"],
            msgs:{ loaded:"“{w}” is a judgment. Report the vote.", vote:"Add the vote count: 7–4.", verb:"Choose a verb that reports, such as “approves”." },
            why:"A neutral verb and the vote count: the facts carry the story.",
            hints:["Which verbs report without judging?", "“Approves”, “votes for” or “passes”, plus the vote count.", "For example: “Council approves Harbour Street bike lane, 7–4”."] },
          { id:"l5", goal:[3, 2], star:true, prompt:"“Bike lane kills downtown: 38 parking spots gone!” What do you most need to judge this?",
            options:[{ t:"The total (38 of 120) and evidence about how customers actually arrive", ok:true, why:"A number needs its base, and a claim about business needs evidence about customers." },
              { t:"The number of likes", why:"Popularity says nothing about accuracy. " + M4 },
              { t:"The emotional tone of the headline", why:"The tone tells you about framing, not about the facts you need." },
              { t:"Whether you agree with the lane", why:M1 }],
            hints:["38 out of how many?", "And do most customers arrive by car?", "The total (38 of 120) and evidence about how customers arrive."] },
          { id:"l6", goal:[4, 5], star:true, prompt:"A news-style article, “5 Reasons Bike Lanes Hurt Business”, carries a small grey label: “Paid content from Drivers for Calder”. Also, a reader complains that a story on the injury data “didn’t give equal space to people who say bike lanes cause injuries”. Which response is best?",
            options:[{ t:"Treat the paid piece as advocacy and check its claims elsewhere; fairness means representing perspectives accurately, not giving equal weight to claims the evidence doesn’t support", ok:true, why:"Purpose first, then evidence. " + M6 },
              { t:"Give every claim equal space", why:"That’s false balance. " + M6 },
              { t:"Trust the paid piece, because it looks like news", why:"“Paid content” tells you its purpose. " + M2 },
              { t:"Ignore both: the paid piece and the complaint are equally worthless", why:"Sponsored content may contain true points; check them. And the complaint deserves an answer: accuracy, not equal airtime." }],
            hints:["What does “paid content” tell you about purpose?", "Fair isn’t the same as equal airtime.", "Advocacy, to be checked; avoid false balance."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Anouk", goal:[5, 3, 2],
        instruction:"Anouk made one mistake in each analysis. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:5, task:"Is <i>The Calder Courier</i>’s lane story biased?",
            steps:["“The <i>Courier</i>’s story says the lane will cost $2.4 million and remove 38 spots.”", "“I think the lane is a good idea.”", "“Because the story makes the lane sound bad and I disagree with that, it’s biased.”", "“So the <i>Courier</i> can’t be trusted.”"],
            answer:2, stepFb:["Accurate summary.", "It’s fine to state your view, as long as you don’t treat it as evidence.", "", "Step 4 builds on step 3’s faulty reasoning."],
            fixes:[{ t:"“The story omits the injury data and the grant, the facts behind the council’s reasoning, so its selection tilts readers against the lane.”", ok:true, why:"Evidence from the text: what’s missing." },
              { t:"“Because I disagree strongly, it’s very biased.”", why:"Same mistake, louder. " + M1 },
              { t:"“All newspapers are biased, so it doesn’t matter.”", why:"Cynicism skips the analysis." },
              { t:"Step 3 is fine.", why:"Disagreement isn’t evidence of bias." }],
            hints:["What evidence <em>in the text</em> shows a tilt?", "Look at what’s missing.", "Omission of the injury data and the grant."] },
          { id:"e2", goal:3, task:"Evaluate CalderFacts.info as a source.",
            steps:["“CalderFacts.info has a clean design and lots of graphs.”", "“So it must be a reliable source.”", "“Its claim that lanes hurt business is probably true.”", "“I’ll cite it in my essay.”"],
            answer:1, stepFb:["Accurate observation.", "", "This follows from step 2. The problem is earlier.", "This follows from step 2. The problem is earlier."],
            fixes:[{ t:"“Design tells me nothing about reliability. I’ll search for who runs the site and whether reliable sources support its claims.”", ok:true, why:"Leave the page: investigate the source laterally." },
              { t:"“So it’s unreliable because it looks too good.”", why:"Appearance isn’t evidence either way." },
              { t:"“The graphs prove it.”", why:"Graphs can be made to show anything; check the data’s source." },
              { t:"Step 2 is fine.", why:M2 }],
            hints:["Does a clean design prove anything?", "Leave the page.", "Investigate the source laterally."] },
          { id:"e3", goal:2, task:"Judge the claim “Harbour Street got 50% more dangerous.”",
            steps:["“Before the speed change there were 6 collisions in 2 years.”", "“After it there were 9 collisions in 3 years.”", "“9 is 50% more than 6.”", "“So the street became 50% more dangerous.”"],
            answer:3, stepFb:["An accurate figure. Keep going.", "An accurate figure. Keep going.", "The arithmetic is right; the comparison is the issue. Keep going.", ""],
            fixes:[{ t:"“Per year, it’s 3 before and 3 after, so the rate didn’t change; the totals cover different lengths of time.”", ok:true, why:"Compare rates, not totals over different periods." },
              { t:"“So the street became 150% more dangerous.”", why:"Same mistake, worse arithmetic." },
              { t:"“So collisions dropped.”", why:"The rate stayed the same." },
              { t:"Step 4 is fine.", why:M4 }],
            hints:["Are the time periods equal?", "Divide each by its years.", "3 per year both times."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In the newsroom, which single choice (verb, photo, placement or sources) moved the m&#101;ter more than you expected? Why do you think it’s so powerful?" },
      { id:"j2", q:"In your own words, explain how a story made entirely of true facts can still be biased." },
      { id:"j3", q:"Explain the four SIFT moves to a friend, using a post you’ve actually seen (no names needed)." },
      { id:"j4", q:"What perspective do <em>you</em> bring to news about your city or school? How might it bend your reading, the way a bowl’s bias bends its roll?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one headline, line or idea from today that changed how you’ll read, with one sentence on why.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one principle for reading, or writing, the news fairly, in your own words. Add a master’s example (Milton, Swift, or a line from the newsroom), and an imitation: one sentence of your own that follows the principle.",
      placeholder:"e.g. Leave the page: a claim can’t vouch for itself.",
      examples:["Give me the liberty to know, to utter, and to argue freely according to conscience, above all liberties. (Milton, <i>Areopagitica</i>)",
        "Falsehood flies, and the Truth comes limping after it (Swift, <i>The Examiner</i>, no. 14)",
        "Council approves Harbour Street bike lane, 7–4 (the newsroom)",
        "Council rams through Harbour Street bike lane (the newsroom)"]
    },
    artSamples:[
      { p:"Ask what was left out of the frame before you judge what’s in it.", m:"The <i>Courier</i>’s neutral headline over a lead with no injury figures and no grant" },
      { p:"Leave the page: a claim can’t vouch for itself.", m:"@CalderTruthNow’s “$24 MILLION” against the city’s own budget page ($2.4 million)" }
    ],
    principleMin:6
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Leaving out important facts that would change a reader’s view is called…",
          options:[{ t:"bias by omission", ok:true, why:"What’s missing tilts the story." }, { t:"loaded language", why:"That’s about word choice." },
            { t:"placement bias", why:"That’s about where a story runs." }, { t:"false balance", why:"That’s giving unequal claims equal weight." }] },
        b:{ prompt:"Using emotionally charged words such as “rams through” or “outcry” is called…",
          options:[{ t:"loaded language (word-choice bias)", ok:true, why:"The words carry the attitude." }, { t:"bias by omission", why:"Nothing is left out; the words carry the tilt." },
            { t:"satire", why:"Satire is intentionally false humour." }, { t:"lateral reading", why:"That’s a checking method." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"False information shared by someone who believes it’s true is…",
          options:[{ t:"misinformation", ok:true, why:"False, but shared in good faith." }, { t:"disinformation", why:"Disinformation is false <em>and meant to deceive</em>." },
            { t:"satire", why:"Satire is meant to be recognized as false." }, { t:"sponsored content", why:"That’s paid persuasion." }] },
        b:{ prompt:"False information created deliberately to deceive is…",
          options:[{ t:"disinformation", ok:true, why:"False and meant to deceive." }, { t:"misinformation", why:"That’s shared in good faith." },
            { t:"parody", why:"Parody wants to be recognized." }, { t:"a correction", why:"A correction fixes errors." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"In the SIFT method, what does the <strong>T</strong> stand for?",
          options:[{ t:"Trace claims, quotes and media to their original context", ok:true, why:"Follow it back to where it started." }, { t:"Trust sources with many followers", why:M2 },
            { t:"Type the claim into the post’s comments", why:"Comments aren’t a source." }, { t:"Test the website’s design", why:"Design isn’t evidence." }] },
        b:{ prompt:"What is <strong>lateral reading</strong>?",
          options:[{ t:"Leaving a site to see what other sources say about it and its claims", ok:true, why:"Open new tabs; a site can’t vouch for itself." }, { t:"Reading a site’s pages from top to bottom carefully", why:"That’s vertical reading." },
            { t:"Reading only headlines across many sites", why:"Headlines alone don’t verify." }, { t:"Reading the comments under a post", why:"Comments aren’t verification." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"Lead paragraph (<i>PortNow</i>, from the newsroom’s practice model): “Despite fierce opposition from the small businesses who built this street, council voted 7–4 Tuesday to hand Harbour Street over to cyclists.” Which bias technique dominates?",
          options:[{ t:"Loaded word choice and framing: “fierce opposition”, “who built this street”, “hand over”", ok:true, why:"The facts are few; the framing words do the work." },
            { t:"Bias by omission only", why:"Something may be missing, but the words carry the tilt here." },
            { t:"Placement bias", why:"No information about the page." },
            { t:"None; it reports the vote count", why:M3 }] },
        b:{ prompt:"Lead (<i>The Calder Courier</i>, practice model): “Council voted 7–4 Tuesday for a bike lane on Harbour Street. Bakery owner Marta Kowalczyk, Councillor Ray Dunphy and commuter Ben Okafor all criticized the plan.” Which bias technique dominates?",
          options:[{ t:"Source imbalance: only critics are quoted", ok:true, why:"Three voices, all on one side." },
            { t:"Loaded language", why:"The verbs are neutral." },
            { t:"Placement bias", why:"No placement information." },
            { t:"No bias, because all the quotes are accurate", why:M3 }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Headline: “Collisions Up 50%!” The data: 6 collisions in the 2 years before; 9 in the 3 years after. Is the headline justified?",
          options:[{ t:"No. Per year it’s 3 before and 3 after, so the rate didn’t change", ok:true, why:"Compare rates over equal periods." },
            { t:"Yes, because 9 is 50% more than 6", why:M4 },
            { t:"Yes, because any increase is news", why:"The “increase” is an artifact of the different time periods." },
            { t:"No, because collisions actually fell by 50%", why:"The rate held steady." }] },
        b:{ prompt:"“Two out of three residents support the lane,” based on an online poll posted on a cycling club’s page. Is the claim justified?",
          options:[{ t:"No. The sample is self-selected and not representative of residents", ok:true, why:"Who answered matters more than the fraction." },
            { t:"Yes, because two out of three is a clear majority", why:"The sample matters more than the fraction." },
            { t:"Yes, if more than 100 people answered", why:"A large biased sample is still biased." },
            { t:"No, because polls are always fake", why:"Some polls are well designed; this one isn’t." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A video captioned “Tonight’s protest at City Hall!” is spreading fast. What is the best first step before believing or sharing it?",
          options:[{ t:"Trace it: find where and when the video was first posted, and whether reliable outlets report the event", ok:true, why:"Origins and better coverage are the evidence." },
            { t:"Watch it several times to look for editing", why:"Staring is less reliable than tracing." },
            { t:"Check how many shares it has", why:"Popularity isn’t evidence. " + M2 },
            { t:"Share it with “Is this real?”", why:"Sharing spreads it either way." }] },
        b:{ prompt:"A post quotes “an expert” saying bike lanes raise asthma rates. The expert is a dentist with a large following. What’s the best evaluation?",
          options:[{ t:"Check whether the person’s expertise matches the claim, and find better coverage from public-health sources", ok:true, why:"Authority is field-specific; find the right experts." },
            { t:"Trust it, because experts are experts", why:"Expertise is field-specific." },
            { t:"Dismiss it, because dentists can’t have opinions", why:"Anyone can have an opinion; the question is authority on <em>this</em> claim." },
            { t:"Trust it if the post has a checkmark", why:"A checkmark isn’t expertise. " + M2 }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best neutral rewrite of “Cyclists Win Again as Council Caves”?",
          options:[{ t:"“Council approves Harbour Street bike lane in 7–4 vote”", ok:true, why:"A neutral verb and the vote count." },
            { t:"“Council finally does the right thing on bike lane.”", why:"“Finally” and “right thing” are loaded." },
            { t:"“Council surrenders to cycling lobby.”", why:"“Surrenders” and “lobby” are loaded." },
            { t:"“Bike lane chaos: council votes.”", why:"“Chaos” is loaded." }] },
        b:{ prompt:"Which sentence best explains how a photo choice creates bias?",
          options:[{ t:"“By pairing the vote story with a photo of a worried shop owner, the outlet frames the lane as a threat to business before readers reach a single fact.”", ok:true, why:"It names the choice and its effect on readers." },
            { t:"“The photo is of a shop owner.”", why:"That’s description, not analysis." },
            { t:"“The photo is biased because I don’t like it.”", why:M1 },
            { t:"“Photos can’t be biased because cameras record reality.”", why:"Choosing <em>which</em> photo is a framing decision." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which sentence best analyses the <i>Courier</i>’s perspective?",
          options:[{ t:"“The <i>Courier</i> writes from a downtown-business perspective: it quotes only merchants and leads with parking, so the safety rationale disappears.”", ok:true, why:"A perspective, with evidence from the text." },
            { t:"“The <i>Courier</i> is biased.”", why:"A label without evidence." },
            { t:"“The <i>Courier</i> is wrong about the lane.”", why:"That judges the policy, not the perspective. " + M1 },
            { t:"“I don’t like the <i>Courier</i>.”", why:M1 }] },
        b:{ prompt:"Which sentence best acknowledges the writer’s own perspective while evaluating a story?",
          options:[{ t:"“As a cyclist, I’m inclined to favour the lane, so I checked that the injury figures came from the city before relying on them.”", ok:true, why:"It names the perspective and checks it." },
            { t:"“I’m a cyclist, so I know the lane is good.”", why:M1 },
            { t:"“My perspective doesn’t matter; I’m objective.”", why:"Everyone reads from somewhere." },
            { t:"“As a cyclist, I ignored the merchants’ quotes.”", why:"Acknowledging bias means checking it, not indulging it." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Before a municipal election, a shocking, unsourced post about a candidate goes viral in your class group chat. What’s the best action?",
          options:[{ t:"Don’t share; look for coverage by reliable outlets; if it’s false, tell the group kindly and link what you found", ok:true, why:"Check first, then correct with evidence and kindness." },
            { t:"Share it, because people deserve to know", why:"Spreading an unverified claim can do real harm." },
            { t:"Assume it’s disinformation and report everyone who shared it", why:"Many sharers act in good faith. " + M5 },
            { t:"Ignore it completely", why:"Silence is allowed, but checking and gently correcting helps more." }] },
        b:{ prompt:"A friend shares an image of the mayor riding a bike through a blizzard in a suit, calling it real. What’s the best response?",
          options:[{ t:"Point out kindly that it traces back to an AI-art account and no reliable outlet carries it, and share what you found", ok:true, why:"The origin is the evidence; share it kindly." },
            { t:"Tell them it’s obviously fake from the hands", why:"Visual tells are unreliable; the origin is the evidence." },
            { t:"Share it yourself as a joke", why:"It may spread as real." },
            { t:"Say nothing and unfollow", why:"Allowed, but a kind correction with evidence helps more." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"You want to understand the Harbour Street debate fully. Which set of three sources is best?",
          options:[{ t:"The city’s report (data), a local news story quoting both sides, and the merchants’ association statement (read as advocacy)", ok:true, why:"Data, balanced reporting and a named perspective, each read for what it is." },
            { t:"Three posts from the same passionate account", why:"One voice, three times." },
            { t:"Three outlets that all oppose the lane", why:"Range matters." },
            { t:"A satire site, a meme and a comment thread", why:"None of these is built to inform. " + M5 }] },
        b:{ prompt:"A news-style article is labelled “Sponsored by Drivers for Calder”. How should you evaluate it?",
          options:[{ t:"As advocacy: note its purpose and check its claims against independent sources", ok:true, why:"Purpose first, then evidence." },
            { t:"As neutral reporting, because it looks like news", why:M2 },
            { t:"Ignore it entirely, because sponsored content is always false", why:"It may contain true points; check them." },
            { t:"Trust it, because sponsors must tell the truth", why:"Sponsorship doesn’t guarantee accuracy." }] } }
    ]
  },
  task:{
    title:"Performance task: Fair front page", summary:"Fair front page",
    statement:"<p>A new event just happened in Port Calder. Write a fair front-page story (headline plus 120–180 words), then a short editor’s note explaining your choices. There are many good stories. Make yours fair, clear and alive.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["Headline: clear and unloaded", "Lead covers who, what, when", "Both sides heard", "Facts with numbers", "Story length", "Editor’s note names a bias you avoided"],
    tips:["Keep the headline to 6–14 words and let the facts do the work. Swap any loaded word for a neutral verb.", "Put who, what and when in your first sentence or two.",
      "Insert one supporting and one opposing quotation from the fact sheet.", "Use at least two numbers. They anchor fairness.", "Aim for 120–180 words.", "In 60–100 words, name a bias you steered around and how."],
    explainPrompt:"Craft statement: Which sentence in your story was hardest to make fair, and what did you change?",
    explainLabel:"Craft statement",
    vocab:"Use framing, selection, word choice and perspective.",
    checkLabel:"Check my front page",
    success:"Your front page has every part.",
    more:"Try another angle (hard news, human interest or data-led): each complete one joins your list.",
    facts:TASK_FACTS,
    headMin:6, headMax:14, min:120, max:180, noteMin:60, noteMax:100, leadWords:40,
    loaded:["slams", "rams", "caves", "chaos", "finally", "disaster", "outrage", "shocking", "destroys", "war", "fury", "blasts", "bombshell", "zombies"],
    noteWords:["word choice", "loaded language", "omission", "selection", "placement", "photo", "sources", "statistics"],
    labels:{ head:"Headline", story:"Story", note:"Editor’s note", quotes:"Quotation picker", quotesHow:"Tap a quotation to insert it, exactly, at the cursor in your story. Each is tagged by the side it takes.",
      facts:"Fact sheet (practice model)", pv:"Your front page", models:"One way it can be done: three model responses", modelsNote:"Three different approaches. All three pass the checklist; your teacher reads for fairness and style." },
    rubric:RUBRIC,
    models:[
      { title:"Model 1: Hard news, inverted pyramid", head:"School board votes 8–3 to start high school at 9:15",
        text:"The Port Calder District School Board voted 8–3 on Tuesday to move the high-school start time from 8:30 to 9:15 beginning in September. The change will require four additional bus routes at a cost of $310 000 a year, according to transportation manager Erin Walsh. In a board survey of 1 240 students, 71% supported a later start. “Our students told us they’re exhausted. We listened,” said board chair Dr. Ama Mensah. A separate survey found 46% of parents worried about conflicts with jobs and sports. “Practices will now end after dark in November,” said parent Dana Ferreira. Coach Luis Baptiste said schools could lose gym time shared with community groups. The board said it will publish a revised athletics schedule before the change takes effect.",
        note:"I used the neutral verb “votes” in the headline, not “caves” or “slams”, so the word choice doesn’t tilt readers before they reach a fact. I put the vote, the new time and the date first, because every reader needs them, and the cost next. I paired the 71% student figure with the 46% parent figure to avoid selection bias: reporting only one survey would have made the decision look either obvious or reckless." },
      { title:"Model 2: Human angle, still balanced", head:"Later bell coming for Port Calder high schools in September",
        text:"In a dark bedroom, a high-school student’s alarm rings at 7 a.m. On Tuesday, the Port Calder District School Board voted 8–3 to let it ring later: the high-school start time moves from 8:30 to 9:15 in September. The decision follows a board survey of 1 240 students, in which 71% favoured a later start. “Our students told us they’re exhausted. We listened,” said board chair Dr. Ama Mensah. Not every family agrees. A separate survey found 46% of parents worried about conflicts with after-school jobs and sports. “Practices will now end after dark in November,” said parent Dana Ferreira. Coach Luis Baptiste added, “We’ll lose gym time we share with the community.” The change has a cost as well. Transportation manager Erin Walsh said, “The new bell times require four additional bus routes,” which will cost $310 000 a year. For students, the difference is 45 minutes of sleep or study. For families and coaches, it means new schedules to work out before the first bell rings.",
        note:"I opened on a student’s alarm to give readers a person to picture, but I avoided loaded language: the board “voted”, parents “worried”, and nobody “slammed” anything. I left out the student trustee’s “zombies” quotation. It is vivid, but it mocks tired students and could tilt the tone toward the later start, so the board chair speaks for that side instead. I gave each side a quotation and paired the student survey with the parent survey." },
      { title:"Model 3: Data-led", head:"Students and parents split on 9:15 start for Port Calder high schools",
        text:"Surveys found 71% of 1 240 students favoured a later start and 46% of parents worried about jobs and sports. On Tuesday, the Port Calder District School Board voted 8–3 for a 9:15 high-school start in September, replacing the current 8:30 bell. “Our students told us they’re exhausted. We listened,” said board chair Dr. Ama Mensah. Parent Dana Ferreira saw a different problem: “Practices will now end after dark in November.” Coach Luis Baptiste said community groups could lose shared gym time. The plan also has a price. Transportation manager Erin Walsh said, “The new bell times require four additional bus routes,” at a cost of $310 000 a year. The board has not yet said how the routes will be funded.",
        note:"I led with the two survey numbers because the tension between them is the story. I was careful with the statistics: the 71% comes from 1 240 students and the 46% from a separate parent survey that asked a different question, so I reported them side by side instead of setting one against the other as if they measured the same thing. I quoted one supporter and one opponent and gave the cost, so readers see both the reasons and the price." }
    ]
  },
  cards:[
    ["Bias", "From French <em>biais</em>, “slant”: a tilt in how a story is built. Like a lawn bowl, every story rolls on one; know which way it bends."],
    ["Word-choice bias (loaded language)", "Charged words that carry attitude: “rams through” vs “approves”."],
    ["Bias by omission", "Leaving out facts that would change a reader’s view."],
    ["Placement bias", "Choosing a story’s page or position to raise or lower its importance."],
    ["Source imbalance", "Quoting mostly one side."],
    ["Misleading statistics", "Comparing totals over different periods or bases; always ask “per what?”"],
    ["Lateral reading", "Leaving a site to see what other sources say about it."],
    ["SIFT", "Stop · Investigate the source · Find better coverage · Trace to the original context."],
    ["Misinformation vs disinformation", "False and shared in good faith, vs false and meant to deceive."],
    ["Satire and sponsored content", "Satire is false on purpose and meant to be recognized; sponsored content is paid persuasion styled as news."],
    ["False balance", "Giving a claim the evidence doesn’t support equal weight with well-supported evidence."],
    ["Swift on falsehood", "“Falsehood flies, and the Truth comes limping after it.” So check before you share."]
  ]
};
