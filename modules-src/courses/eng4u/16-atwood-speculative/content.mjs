// ENG4U 16 Atwood and Speculative Canada. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/16-atwood-speculative.md
// Texts:
//  Atwood, The Handmaid's Tale (McClelland and Stewart, 1985) is in copyright. Only the short quotations the plan itself prints
//    are used, exactly as given (fair dealing, course plan §3). Everything else is the plan's paraphrase. Typographic quotes only.
//  Forster, "The Machine Stops" (1909) is public domain; only the two lines the plan prints are quoted here.
//  "The Archivist" and the Build-mode precedent cards are written for the module (the plan's wording where it gives one).
// VERIFY: teacher note (plan §1, not shown to students). The novel depicts sexual violence, reproductive coercion, executions and
//   religious extremism. Student-facing text never describes them. Preview the novel and follow your board's guidance on parent
//   communication. Students not reading the novel follow the Forster path: add ?path=forster to the page address.
// VERIFY: distribution (plan §5, §6.4). This module quotes a copyrighted novel: share it only with enrolled students.
// VERIFY: every quotation below against the class edition (wording, chapter, page) before release (plan §6.1). Chapters are as
//   best known; where the plan gives none, the chapter shown is the builder's best knowledge or "__".
// VERIFY: the "nightmare of history" rule is quoted only in this comment: Atwood, "Margaret Atwood on What 'The Handmaid's Tale'
//   Means in the Age of Trump," The New York Times, 10 Mar. 2017 (plan §1, §6.2). The module paraphrases the rule instead.

// EXCERPT SLOT: page numbers. Replace each "__" with the class edition's page (plan §5). Every citation is built from this table.
const PG = { papers:"__", gym:"__", lydia:"__", greet:"__", temp:"__", ignore:"__", ordinary:"__", recon:"__", context:"__", story:"__", nolite:"__", notes:"__" };
// VERIFY: chapters. From the plan: gym 1, papers 10, lydia 5, recon 23, context 29, story 7, nolite 9. Builder's best knowledge:
//   greet 4–5 (plan slot B), temp 28, ignore 10, ordinary 6.
const CHN = { papers:"10", gym:"1", lydia:"5", greet:"4–5", temp:"28", ignore:"10", ordinary:"6", recon:"23", context:"29", story:"7", nolite:"9", notes:"Historical Notes" };
const CR = (k) => "(Atwood, " + (k === "notes" ? "“Historical Notes”" : "ch. " + CHN[k]) + ", p. " + PG[k] + ")";
const CREDIT = (ch) => "Margaret Atwood, <i>The Handmaid’s Tale</i> (McClelland and Stewart, 1985), " + ch + ". Quoted for study under fair dealing.";
const Q = {
  papers:"We were the people who were not in the papers. We lived in the blank white spaces at the edges of print.",
  gym:"We slept in what had once been the gymnasium.",
  lydia:"There is more than one kind of freedom [. . .]. Freedom to and freedom from.",
  fruit:"Blessed be the fruit", open:"May the Lord open", eye:"Under His Eye",
  temp:"They said it would be temporary.", ignore:"We lived, as usual, by ignoring.", ordinary:"It will become ordinary.",
  recon:"This is a reconstruction.", context:"Context is all.", story:"I would like to believe this is a story I’m telling.",
  nolite:"Nolite te bastardes carborundorum", questions:"Are there any questions?"
};
// Forster, "The Machine Stops" (1909), public domain. The plan prints these two lines.
// VERIFY: against a reliable public-domain edition (e.g. the Oxford and Cambridge Review text, 1909); part numbers as best known.
const FO = { open:"Imagine, if you can, a small room, hexagonal in shape, like the cell of a bee.", beware:"Beware of first-hand ideas!" };
const CF = { open:"(Forster, part I)", beware:"(Forster, part III)" };

// misconception core sentences (plan §3)
const M1 = "Speculative fiction magnifies the present; it doesn’t forecast it. Ask what real precedent Gilead enlarges.";
const M2 = "Could it really happen with the means we have? Gilead uses no impossible technology, so it’s speculative.";
const M3 = "That tells me <em>what</em> happens. Now tell me what the choice <em>does</em>: what it makes the reader notice, fear or question.";
const M4 = "Aunt Lydia believes “freedom from” is a gift; Atwood doesn’t. The gap between them is where the meaning lives.";
const M5 = "Notice what people got used to. “" + Q.ignore + "”";
const M6 = "Calling a public execution a “Salvaging” changes what people can <em>say</em> about it, and so what they can easily <em>think</em>.";
const M7 = "The frame tells you who survived to tell Offred’s story, and how coolly they tell it. That’s part of the meaning.";
const SET = (m) => " <button type='button' class='btn ghost sm at-setup' data-setup='" + m + "'>Set it up</button>";

// "The Archivist" (Practice 2; written for the course, plan wording)
const ARCHIVIST = "Every citizen of New Halifax is allowed one memory per year in the Archive. You choose it on your birthday, in a white booth that smells faintly of oranges, and a clerk with kind eyes seals it in glass. The rest of the year’s memories fade on schedule, gently, like ink in sunlight. People say it is a mercy. “Imagine,” the clerk told me when I was eight, “carrying every bad day forever.” This year I am seventeen, and I have chosen my memory already: the afternoon my brother taught me to skip stones at the harbour, the stone leaping five times, his laugh leaping with it. But the clerk is not smiling. She tells me that particular afternoon has been “retired.” My brother, it seems, was never here. I look at my hands, which remember the weight of the stone, and I wonder what else the Archive keeps that I have not chosen.";

const RUBROWS = [
  ["Thinking: extrapolation", "The premise isn’t rooted in a real trend", "Loosely rooted; the logic is unclear", "Rooted and logical", "Rooted, logical and illuminating: it makes the present visible"],
  ["Knowledge: conventions", "Conventions absent or misused", "One convention, used thinly", "Conventions used purposefully", "Conventions integrated so they create meaning"],
  ["Communication: voice and craft", "Flat or unclear prose", "Some vivid detail", "Controlled voice; precise diction", "A distinctive voice; every detail earns its place"],
  ["Application: craft statement", "Restates the plot", "Names choices", "Explains choices and their effects", "Explains choices with insight, linking them to Atwood’s or Forster’s methods"]
];
const RUB = "<details class='alg at-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Criterion</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  RUBROWS.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div></details>";

// conventions (Track mode tags; colours from plan §5: diction brown, syntax blue, theme magenta, figure violet)
const CONV = [
  { id:"info", t:"Control of information", role:"theme" },
  { id:"surv", t:"Surveillance", role:"theme" },
  { id:"script", t:"Scripted speech", role:"syntax" },
  { id:"rename", t:"Renaming or euphemism", role:"diction" },
  { id:"read", t:"Forbidden reading or writing", role:"theme" },
  { id:"terror", t:"Public terror", role:"theme" },
  { id:"comfort", t:"Comfort and consent", role:"image" },
  { id:"resist", t:"Resistance", role:"figure" },
  { id:"frame", t:"Frame", role:"syntax" }
];

// Track sources. The excerpt slots (plan §5) stay "Read in your copy" cards; the taggable lines are the plan's quotations.
// EXCERPT SLOT: to show a class-edition passage, add it as paras:["…", …] on the slot (the teacher chooses each passage, plan §1).
// fo = the Forster-path swap (plan §5), used with ?path=forster.
const SOURCES = [
  { id:"A", slot:"A", t:"Slot A: the opening", lines:[Q.gym], cite:CREDIT("ch. " + CHN.gym + ", p. " + PG.gym), paras:[],
    copy:"Read the opening of chapter 1 in your copy, from “We slept in what had once been the gymnasium” to the end of the first paragraph.",
    fo:{ t:"Slot A: Forster’s opening", lines:[FO.open], cite:"E. M. Forster, “The Machine Stops” (1909), part I", copy:"Read the first two sentences of “The Machine Stops” in your copy." } },
  { id:"B", slot:"B", t:"Slot B: the first walk with Ofglen", lines:[Q.fruit + ".", Q.open + ".", Q.eye + "."], cite:CREDIT("ch. " + CHN.greet + ", p. " + PG.greet), paras:[],
    copy:"Read Offred’s first walk with Ofglen in your copy, with its greetings and its parting words.",
    fo:{ t:"Slot B: the lecturer’s speech", lines:[FO.beware], cite:"E. M. Forster, “The Machine Stops” (1909), part III", copy:"Read the lecturer’s speech in part III of “The Machine Stops” in your copy." } },
  { id:"C", slot:"C", t:"Slot C: Aunt Lydia on freedom", lines:[Q.lydia], cite:CREDIT("ch. " + CHN.lydia + ", p. " + PG.lydia), paras:[],
    copy:"Read Aunt Lydia’s words on “freedom to” and “freedom from” in chapter 5 of your copy.",
    fo:{ t:"Slot C: Vashti refuses the surface", lines:[], cite:"E. M. Forster, “The Machine Stops” (1909), part I", copy:"Read the passage where Vashti refuses to visit the surface of the earth." } },
  { id:"D", slot:"D", t:"Slot D: how it began", lines:[Q.temp, Q.ignore], cite:CREDIT("ch. " + CHN.temp + " and " + CHN.ignore + ", p. " + PG.temp), paras:[],
    copy:"Read the passage where Offred remembers losing her job and her bank account, and the earlier memories of how people adjusted.",
    fo:{ t:"Slot D: Kuno and the surface", lines:[], cite:"E. M. Forster, “The Machine Stops” (1909), part II", copy:"Read Kuno’s description of the surface of the earth." } },
  { id:"E", slot:"E", t:"Slot E: “This is a reconstruction”", lines:[Q.recon], cite:CREDIT("ch. " + CHN.recon + ", p. " + PG.recon), paras:[],
    copy:"Read the passage in chapter 23 where Offred says her telling is a reconstruction.",
    fo:{ t:"Slot E: the ending", lines:[], cite:"E. M. Forster, “The Machine Stops” (1909), part III", copy:"Read the ending of “The Machine Stops”, with Kuno and Vashti." } },
  { id:"F", slot:"F", t:"Slot F: the Historical Notes", lines:[Q.questions], cite:CREDIT("“Historical Notes”, p. " + PG.notes), paras:[],
    copy:"Read the opening paragraph and the final lines of the “Historical Notes”.",
    fo:{ t:"Slot F: Forster’s final paragraph", lines:[], cite:"E. M. Forster, “The Machine Stops” (1909), part III", copy:"Read the final paragraph of “The Machine Stops”." } },
  { id:"H", t:"The hero passage", lines:[Q.papers], cite:CREDIT("ch. " + CHN.papers + ", p. " + PG.papers) },
  { id:"FO", t:"Forster’s hero passage", lines:[FO.open], cite:"E. M. Forster, “The Machine Stops” (1909), part I" },
  { id:"own", t:"Your lines" }
];

export default {
  id:"16-atwood-speculative",
  kind:"topic",
  title:"Atwood and speculative Canada",
  topic:"Atwood and Speculative Canada",
  readyTopic:"Atwood’s speculative fiction",
  hero:{
    headline:"Every imagined future is a mirror held up to now.",
    text:"<strong>Speculative fiction</strong> asks <em>What if?</em> about the world we already live in. It takes something that has really happened, somewhere, sometime, and lets it happen <em>here</em>. Margaret Atwood built the Republic of Gilead by that rule. In this module you’ll test her rule, learn the <strong>conventions</strong> of dystopia, read the most powerful tool any regime has, its control of <strong>language</strong>, and watch a narrator fight back with words.",
    fig:{ html:"<div class='at-hero' id='at-hero'></div>", caption:"" },
    line:Q.papers, credit:CREDIT("ch. " + CHN.papers + ", p. " + PG.papers),
    caption:"The story is in the margins.",
    aria:"The two sentences light up word by word. On “the papers”, a newspaper column sets itself in grey type. On “the blank white spaces at the edges of print”, the margins beside the column glow softly and small human figures appear in them. Caption: “The story is in the margins.”",
    listen:"Listen again", watch:"Watch again",
    yourself:"Read it aloud. Which word do you lean on? <em>Blank</em>? <em>Edges</em>?"
  },
  goals:[
    "I can explain how speculative fiction differs from science fiction and from prediction.",
    "I can identify Gilead’s dystopian conventions and explain how each creates meaning.",
    "I can analyse how Gilead controls language (scripted speech, renaming, euphemism, forbidden reading), and how Offred resists through words.",
    "I can trace how Gilead extrapolates from real precedents, using Atwood’s rule.",
    "I can analyse Offred’s narration and the Historical Notes frame as choices that shape meaning.",
    "I can compare <i>The Handmaid’s Tale</i> with “The Machine Stops” and connect speculative texts to my own world, responsibly."
  ],
  start:{
    blocks:[
      { title:"Word story: dystopia", html:"<p><strong><em>Utopia</em></strong> was Thomas More’s coinage (1516), a pun in Greek: <em>ou-topos</em>, “no place”, and <em>eu-topos</em>, “good place”. <strong><em>Dystopia</em></strong> swaps in <em>dys-</em>, “bad”: a bad place, and one that is very much somewhere. The word was in use by the 1800s; John Stuart Mill used a form of it in a speech in 1868.</p><p>Every dystopia carries the ghost of a utopia: Gilead’s founders thought they were building a better world.</p><p class='tiny muted'>Word stories are short histories; see a dictionary’s etymology for more.</p>" },
      // VERIFY: the Mill 1868 attribution (plan §6.6).
      { title:"Before you read", html:"<p class='at-cnote'><strong>Content note.</strong> <i>The Handmaid’s Tale</i> depicts violence, coercion and religious extremism. This module refers to them only in general terms, and it quotes only short lines from the novel. Read the longer passages in your class copy. If your class follows the Forster path, your teacher will tell you.</p>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Genre and form", goal:1,
          prompt:"Which feature most clearly marks a story as a <strong>dystopia</strong>?",
          options:[
            { t:"A society presented as orderly or ideal that is, underneath, controlling or harmful", ok:true, why:"The gap between the promise and the reality is the dystopian engine." },
            { t:"A story set in the future", why:"Plenty of future stories are hopeful, and some dystopias feel almost present-day." },
            { t:"A story with robots or aliens", why:"That’s a science-fiction prop, not the defining feature." },
            { t:"A story with a sad ending", why:"Tragedies end sadly too; what matters is the society." }],
          hints:["Think about the <em>society</em>, not the setting.", "What does the society claim to be, and what is it really?", "Ideal on the surface, controlling underneath."] },
        { id:"w2", skill:"Genre and form", goal:5,
          prompt:"A <strong>framing device</strong> in a novel is…",
          options:[
            { t:"A story or document that surrounds the main story and changes how we read it", ok:true, why:"Like a picture frame, it sets the main story in a context." },
            { t:"The first chapter", why:"A first chapter isn’t necessarily a frame." },
            { t:"The cover design", why:"That’s packaging, not a narrative device." },
            { t:"A flashback", why:"A flashback moves within the story; a frame sits around it." }],
          hints:["Think of a picture frame.", "It sits <em>around</em> the main story.", "A surrounding story or document."] },
        { id:"w3", skill:"Point of view and irony", goal:5,
          prompt:"A narrator praises her city’s “gentle” rules while describing a neighbour taken away at night. The reader feels uneasy, but she doesn’t. This gap is…",
          options:[
            { t:"Dramatic irony: the reader understands more than the narrator", ok:true, why:"We see what she can’t, or won’t." },
            { t:"Foreshadowing", why:"Foreshadowing hints at later events; this is a gap in understanding." },
            { t:"Hyperbole", why:"Nothing is exaggerated; the horror is understated." },
            { t:"A flashback", why:"There’s no shift in time." }],
          hints:["Who knows more, the reader or the narrator?", "The reader does.", "Dramatic irony."] },
        { id:"w4", skill:"Point of view and irony", goal:5,
          prompt:"Why might an author give a powerful speech in favour of the regime to a character like a teacher or official?",
          options:[
            { t:"To let readers judge the regime’s reasoning for themselves through the gap between the speech and what the story shows", ok:true, why:"The reader does the critique." },
            { t:"Because the author agrees with the speech", why:"A character’s view isn’t the author’s." },
            { t:"To make the story cheerful", why:"The speech is unsettling; that’s the point." },
            { t:"Because the author ran out of narrators", why:"This is a deliberate choice about perspective, not a shortcut." }],
          hints:["Does the author agree with every character?", "Not necessarily.", "The gap invites judgement."] },
        { id:"w5", skill:"Diction and connotation", goal:3,
          prompt:"Which word has the most <strong>comforting</strong> connotation for a place where people are held against their will?",
          options:[
            { t:"“Retreat”", ok:true, why:"It suggests rest and choice, the opposite of the truth." },
            { t:"“Prison”", why:"Accurate, not comforting." },
            { t:"“Cell”", why:"Cold and confining." },
            { t:"“Compound”", why:"Suggests fences and guards." }],
          hints:["Which word sounds like a holiday?", "Which suggests choice?", "Retreat."] },
        { id:"w6", skill:"Diction and connotation", goal:3,
          prompt:"A <strong>euphemism</strong> is…",
          options:[
            { t:"A mild word substituted for a harsh or blunt one", ok:true, why:"“Passed away” for “died”." },
            { t:"A word that sounds like its meaning", why:"That’s onomatopoeia." },
            { t:"An exaggeration for effect", why:"That’s hyperbole." },
            { t:"A contradiction in two words", why:"That’s an oxymoron." }],
          hints:["Think “passed away”.", "It softens.", "A mild substitute for a harsh word."] }
      ],
      refreshers:{
        "Genre and form":"A dystopia shows a society that claims to be ideal but controls or harms its people. A frame is a surrounding story or document, such as a later historian’s notes, that changes how we read the main story.",
        "Point of view and irony":"When the reader understands more than a speaker, that’s dramatic irony. Example: an official calls a curfew “peaceful” while the street is empty and frightened.",
        "Diction and connotation":"Words carry feelings beyond their dictionary meanings. A euphemism swaps a harsh word for a soft one: “let go” for “fired”. Regimes use euphemism so harm sounds harmless."
      }
    }
  },
  explore:{
    heading:"World-building lab",
    intro:"Atwood’s rule: nothing in Gilead without a precedent. Test her rule, then use it to build a world of your own.",
    modes:[{ id:"roots", t:"Gilead’s roots" }, { id:"track", t:"Track conventions" }, { id:"build", t:"Build" }],
    how:{
      roots:"Tap one of Gilead’s features, then tap the precedent it grows from. Each link draws a thread on the map. To change a link, tap the feature again and choose another precedent.",
      track:"Choose a passage. Tap words (Shift + tap or Shift + arrows for a run), then tap a convention to tag them. Your tags are yours and are never scored.",
      build:"Choose 1 to 3 trends and set how far to push each one. Then choose 2 to 4 elements, and link each precedent-deck element to a real precedent."
    },
    // feature cards (paraphrased, each credited to a chapter). VERIFY: the chapters (builder's best knowledge; plan §4).
    features:[
      { id:"F1", t:"Colour-coded dress for every role: red for Handmaids, blue for Wives, green for Marthas", short:"Colour-coded dress", ch:"ch. 2" },
      { id:"F2", t:"Women forbidden to read; shop signs show pictures instead of words", short:"Pictures, not words", ch:"ch. 5" },
      { id:"F3", t:"The Eyes: secret police and informers", short:"The Eyes", ch:"ch. 4" },
      { id:"F4", t:"The Wall, where the bodies of the executed are hung as warnings", short:"The Wall", ch:"ch. 6" },
      { id:"F5", t:"Overnight, women’s jobs end and their bank accounts pass to husbands or male relatives", short:"Jobs and accounts", ch:"ch. 28" },
      { id:"F6", t:"Handmaids renamed after the man they serve: Of-fred", short:"Of-fred", ch:"ch. 14 and the Historical Notes" }
    ],
    precedents:[
      { id:"Pa", short:"Clothing laws", t:"Laws that dictated clothing by rank or group" },
      { id:"Pb", short:"Bans on literacy", t:"Laws in some places and eras that made it a crime to teach enslaved people to read" },
      { id:"Pc", short:"Secret police", t:"Twentieth-century secret police and networks of informers" },
      { id:"Pd", short:"Bodies displayed", t:"Public display of the executed as a warning to others" },
      { id:"Pe", short:"Wives’ property laws", t:"Laws under which a married woman’s property and earnings belonged to her husband" },
      { id:"Pf", short:"Names as ownership", t:"Enslaved people given their enslavers’ names; wives known by their husbands’ names" }
    ],
    // the one-to-one key for TC1 (feature → precedent)
    answer:{ F1:"Pa", F2:"Pb", F3:"Pc", F4:"Pd", F5:"Pe", F6:"Pf" },
    map:{ title:"Gilead, a schematic map", gauge:"Rooted in the real", drawer:"Precedents", features:"Gilead’s features", pick:"Tap a feature first, then a precedent.", unlink:"Unlink", linkedTo:"linked to" },
    conv:CONV,
    sources:SOURCES,
    own:{ max:6, maxChars:240, how:"Paste or type up to 6 lines from your own copy, with page numbers, then tag them. Nothing leaves this device.", lineL:"A line from your copy", pageL:"Page", add:"Add the line", remove:"Remove", full:"You’ve added 6 lines, the most this list holds.", need:"Type the line and its page number." },
    trackL:{ choose:"Passage", tagWith:"Tag the selected words with", clear:"Remove tags on the selected words", chart:"Conventions you’ve tagged", none:"No tags yet.", copyTitle:"Read in your copy", credit:"Credit" },
    // TC2: Gilead's words (each credited; the teacher confirms the chapter)
    words:{ title:"Gilead’s words (challenge 2)", how:"Tap an item, then tap the bin for how it controls (or resists) language.",
      bins:[{ id:"script", t:"Scripted speech" }, { id:"rename", t:"Renaming as ownership or exclusion" }, { id:"euph", t:"Euphemism" }, { id:"read", t:"Forbidden reading" }, { id:"resist", t:"Resistance" }],
      items:[
        { id:"g1", t:"the greeting “" + Q.fruit + "”", answer:"script" },
        { id:"g2", t:"its required answer, “" + Q.open + "”", answer:"script" },
        { id:"g3", t:"the parting “" + Q.eye + "”", answer:"script" },
        { id:"g4", t:"the name “Offred”", answer:"rename" },
        { id:"g5", t:"“Unwomen”, Gilead’s label for women who don’t fit its roles", answer:"rename" },
        { id:"g6", t:"“Salvaging”, Gilead’s name for a public execution", answer:"euph" },
        { id:"g7", t:"the shop sign for the butcher’s, a picture where words used to be (the shop’s name, All Flesh, survives only in speech)", answer:"read" },
        { id:"g8", t:"the scratched phrase “" + Q.nolite + "”, found in Offred’s cupboard", answer:"resist" }
      ] },
    // TC3: How Gilead arrived (paraphrased flashbacks; short quotations credited)
    stages:{ title:"How Gilead arrived (challenge 3)", how:"Put the five stages in order, first at the top. Use Move up and Move down.", up:"Move up", down:"Move down",
      start:["C", "E", "A", "D", "B"],
      cards:[
        { id:"A", t:"An attack kills the President and Congress; the army declares an emergency and the Constitution is suspended. “" + Q.temp + "” " + CR("temp") },
        { id:"B", t:"Newspapers are censored, and checkpoints and identity passes appear, “for safety”." },
        { id:"C", t:"Overnight, women lose their jobs and their bank accounts pass to husbands or male relatives." },
        { id:"D", t:"People adjust and keep going: “" + Q.ignore + "” " + CR("ignore") },
        { id:"E", t:"The new order is taught as normal: “" + Q.ordinary + "” " + CR("ordinary") + ", as Aunt Lydia tells the Handmaids." }
      ] },
    // Build mode
    trends:[
      { id:"T1", t:"We stream everything, alone", p:"we streamed everything, alone", comfort:true },
      { id:"T2", t:"Cameras on every corner", p:"cameras watched every corner" },
      { id:"T3", t:"Fresh water is getting scarcer", p:"fresh water grew scarcer" },
      { id:"T4", t:"Lessons happen on screens", p:"lessons happened only on screens", comfort:true },
      { id:"T5", t:"Apps score our behaviour", p:"apps scored our behaviour", comfort:true },
      { id:"T6", t:"Memories live in the cloud", p:"our memories lived in the cloud", comfort:true }
    ],
    push:[{ id:"1", t:"a little" }, { id:"2", t:"a lot" }, { id:"3", t:"all the way" }],
    elements:[
      { id:"Ea", deck:"P", t:"Permits to leave home", np:"permits to leave home", conv:"control of movement and information" },
      { id:"Eb", deck:"P", t:"A list of approved words", np:"a list of approved words", conv:"limited language" },
      { id:"Ec", deck:"P", t:"Rationed water by household score", np:"water rationed by household score", conv:"control presented as fairness" },
      { id:"Ed", deck:"P", t:"Public praise for informers", np:"public praise for informers", conv:"surveillance by neighbours" },
      { id:"Ee", deck:"P", t:"Erasing names from records", np:"erasing names from records", conv:"erased language and history" },
      { id:"Ef", deck:"P", t:"Ritual greetings", np:"ritual greetings", conv:"scripted speech" },
      { id:"Ex", deck:"X", t:"Mind-reading helmets", np:"mind-reading helmets" },
      { id:"Ey", deck:"X", t:"Time-travel courts", np:"time-travel courts" },
      { id:"Ez", deck:"X", t:"Teleport checkpoints", np:"teleport checkpoints" }
    ],
    decks:{ P:"Precedent deck", X:"Impossible deck" },
    // precedent cards for Build (general historical terms, written for the module; plan §6.5)
    bprec:[
      { id:"B1", t:"Travel passes and internal permits needed to move between regions" },
      { id:"B2", t:"Official lists of approved and banned words" },
      { id:"B3", t:"Wartime rationing of food and fuel, household by household" },
      { id:"B4", t:"Campaigns that rewarded citizens for informing on neighbours" },
      { id:"B5", t:"Names erased from official records and photographs" },
      { id:"B6", t:"Ritual pledges and recitations said together each day" }
    ],
    buildL:{ trends:"Trend cards (choose 1–3)", push:"Push", elements:"Element cards (choose 2–4)", link:"Link", linked:"Linked:", choosePrec:"Link to a precedent", close:"Close",
      maxT:"You can choose up to 3 trends.", maxE:"You can choose up to 4 elements.", world:"Your world", empty:"Choose a trend to start your world.", premise:"Premise" },
    readout:{ rule:"Atwood’s rule", premise:"Premise", genre:"Genre tag", rooted:"Rooted in the real", conv:"Conventions present", comfort:"Comfort and consent",
      spec:"Speculative (could happen)", sf:"Science fiction (needs the impossible)", present:"Present", missing:"Missing", none:"None yet", more:"More", fewer:"Fewer" },
    aha:"Gilead frightens because nothing in it is invented. Each feature has a real history somewhere; Atwood only gathered them in one place and set them in Cambridge, Massachusetts. The more rooted a speculative world is, the harder it is to dismiss.",
    p1:{ caption:"Not another planet: our gymnasium, repurposed." },
    p4:{ label:"how it’s remembered" },
    predIntro:"Make a prediction first. Then the lab shows you what happens.",
    predictions:[
      { id:"p1", prompt:"The novel begins: “" + Q.gym + "” " + CR("gym") + " What does “what had once been” do?",
        options:[{ t:"It shows Gilead built inside a familiar, ordinary place, so the reader’s own world is the ruin it was made from", ok:true }, { t:"It tells us the narrator is an athlete." }, { t:"It shows the story takes place in the distant past." }, { t:"It hides the setting from the reader." }],
        explain:"Three words do the speculative work: this isn’t another planet, it’s our gymnasium, repurposed. The past tense of “had once been” makes our present into Gilead’s ruins." },
      { id:"p2", prompt:"The lab is in Build mode with “Cameras on every corner” (a lot) and “Public praise for informers” (linked). Now add “Mind-reading helmets”. What happens to the genre tag?",
        options:[{ t:"It flips to science fiction, because the element needs technology that doesn’t exist", ok:true }, { t:"It stays speculative, because cameras are real." }, { t:"It becomes fantasy." }, { t:"Nothing changes." }],
        explain:"One impossible element breaks Atwood’s rule: the world stops saying “this could be us”. Gilead’s Eyes use informers, not helmets." },
      { id:"p3", prompt:"Aunt Lydia says: “" + Q.lydia + "” " + CR("lydia") + " Does the novel want us to agree with Aunt Lydia?",
        options:[{ t:"No: the neat balance of “freedom to” and “freedom from” dresses up confinement as protection, and the novel lets us see the trick", ok:true }, { t:"Yes: Aunt Lydia is a teacher, so she speaks for Atwood." }, { t:"Yes: safety is always better than freedom." }, { t:"It’s impossible to tell from a character’s words." }],
        explain:"A character’s view isn’t the author’s. The symmetry of the phrase makes a loss sound like a gift, and that is the warning." },
      { id:"p4", prompt:"The novel ends with a scholarly conference held two centuries later, which closes: “" + Q.questions + "” " + CR("notes") + " How does that frame change Offred’s story?",
        options:[{ t:"It shows Gilead fell, but also that later scholars treat Offred’s suffering as an academic puzzle: hope and irony at once", ok:true }, { t:"It proves the story is true." }, { t:"It’s a summary for readers who skipped ahead." }, { t:"It means Atwood predicted the future." }],
        explain:"A frame is never decoration. It tells you who survived to tell the story, and how coolly they tell it. The closing question is aimed at us." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"Test Atwood’s rule: link each of Gilead’s six features to its precedent." + SET("roots"),
        msgs:{
          unlinked:"Link all six features first. The gauge reads {n} of 6.",
          F2Pc:"Secret police watch; this feature is about who may <em>read</em>. Look for a precedent about literacy.",
          F6Pa:"Clothing marks rank; Of-fred is a <em>name</em>. Look for a precedent about names as ownership.",
          F5Pd:"This is about property and money, not public terror."
        },
        general:"Not yet. Match the <em>kind</em> of control: clothing, reading, watching, terror, money, names.",
        why:"Six of six. Nothing in Gilead is invented, only gathered.",
        hints:["Match the <em>kind</em> of control: clothing, reading, watching, terror, money, names.", "F2 is literacy; F6 is naming; F5 is property.", "F1–Pa, F2–Pb, F3–Pc, F4–Pd, F5–Pe, F6–Pf."] },
      { id:"tc2", goal:3, prompt:"Gilead’s words: sort these eight items from the novel by how they control (or resist) language." + SET("track"),
        msgs:{
          unplaced:"Place all eight items first.",
          g6rename:"It’s more than a new name: “Salvaging” borrows a word for <em>rescue</em>, so killing sounds like saving. That’s euphemism.",
          g3euph:"Nothing harsh is softened here; it’s a required phrase that also reminds everyone they’re watched. Scripted speech.",
          g8read:"Someone <em>wrote</em> it, secretly, in mock Latin, and Offred treasures it. That’s resistance."
        },
        general:"Not yet. Ask: is the phrase <em>required</em>, a <em>new name</em>, a <em>softened</em> name, about <em>who may read</em>, or an act <em>against</em> the rules?",
        why:"Scripted speech 1–3, renaming 4–5, euphemism 6, forbidden reading 7, resistance 8. Gilead’s first tool is language; Offred’s last freedom is language too.",
        hints:["Ask: is the phrase <em>required</em>, a <em>new name</em>, a <em>softened</em> name, about <em>who may read</em>, or an act <em>against</em> the rules?", "Three items are greetings and replies.", "Scripted 1–3; renaming 4–5; euphemism 6; forbidden reading 7; resistance 8."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"How Gilead arrived: put these five stages from Offred’s memories in order." + SET("roots"),
        msgs:{
          CA:"The emergency comes first. Every later step is justified by it.",
          Dlast:"Ignoring is how people <em>live through</em> the changes; making it “ordinary” is the final, deliberate step.",
          BA:"Censorship is presented as a response to the attack, so the attack comes first."
        },
        general:"Not yet. Start with the crisis that excuses everything.",
        why:"Nothing changes all at once. Forster’s citizens, too, built the Machine to serve them, then forgot how to live without it.",
        hints:["Start with the crisis that excuses everything.", "Crisis → controls “for safety” → rights removed → adjustment → the new normal.", "A → B → C → D → E."] }
    ]
  },
  part3:{
    slug:"language", name:"Language",
    heading:"Language as control",
    intro:"The lab tested Gilead’s roots and built worlds. Now read the novel word by word: who controls the words, and how does a narrator take them back?",
    s1:{ title:"Station 1: “Freedom to and freedom from”", quote:Q.lydia, cite:CR("lydia"),
      how:"Climb the ladder of reading. At each rung, choose the strongest wording.",
      rungs:[
        { id:"r1", name:"Paraphrase", opts:[
          { t:"Aunt Lydia says there are two kinds of freedom.", ok:true, fb:"✓ A plain, accurate restatement: that’s a paraphrase." },
          { t:"Aunt Lydia is talking about freedom.", fb:"Too vague: say <em>what</em> she says about it." },
          { t:"Aunt Lydia shows that Gilead is cruel.", fb:"That’s already a judgement; a paraphrase only restates." }] },
        { id:"r2", name:"Observation", opts:[
          { t:"The phrase is balanced, with the same word repeated and only the small preposition changing.", ok:true, fb:"✓ You’ve noticed a craft choice: the balance and the one word that changes." },
          { t:"Aunt Lydia says there is freedom to and freedom from.", fb:"Still a paraphrase: what do you notice about <em>how</em> it’s said?" },
          { t:"The phrase is interesting.", fb:"Name the feature: what exactly repeats, and what changes?" }] },
        { id:"r3", name:"Interpretation", opts:[
          { t:"Gilead calls protection from danger a kind of freedom, to excuse taking away women’s choices.", ok:true, fb:"✓ You’ve said what the phrase means in Gilead." },
          { t:"The word “freedom” appears twice.", fb:"Still an observation: what does the balance <em>mean</em>?" },
          { t:"Freedom is important to everyone.", fb:"Too general: no link to Gilead or to the phrase." }] },
        { id:"r4", name:"Analysis", opts:[
          { t:"By balancing “freedom to” against “freedom from”, Aunt Lydia makes confinement sound like a fair trade, and Atwood lets the tidy symmetry expose how persuasive control can be.", ok:true, fb:"✓ Craft (the balance), meaning (confinement as a fair trade) and the “so what” (how persuasive control can be)." },
          { t:"Gilead takes away women’s choices and calls it freedom.", fb:"No “so what”: how does the craft make it persuasive, and why does Atwood show us?" },
          { t:"Atwood agrees that freedom from danger matters most.", fb:"That treats a character’s view as the author’s. Atwood lets us see the trick." }] }
      ],
      done:"You’ve climbed from what she says to what the words do. That’s analysis." },
    s2:{ title:"Station 2: Offred fights back with words",
      quotes:[
        { id:"q1", t:Q.recon, cite:CR("recon") },
        { id:"q2", t:Q.context, cite:CR("context") },
        { id:"q3", t:Q.story, cite:CR("story") },
        { id:"q4", t:Q.nolite, cite:CR("nolite"), note:"the scratched phrase in her cupboard" }
      ],
      scrabble:"Also: the Commander’s forbidden Scrabble games, where Offred handles letters again (ch. 23–24).",
      how:"Build one analytical sentence: a claim, a quotation, and analysis. Tap a verb to add it to your analysis. Then press <strong>Check it with craft</strong>.",
      claimL:"Claim", claimPh:"e.g. Offred refuses to let Gilead own her story.", quoteL:"Quotation", anL:"Analysis", anPh:"e.g. By calling her telling a reconstruction, she reclaims…",
      verbs:["reclaims", "reconstructs", "unsettles", "resists", "reframes"],
      check:"Check it with craft", ask:"What does this verb claim Offred’s words <em>do</em>?",
      noVerb:"Your analysis doesn’t use a verb from the bank yet. Which verb says what her words <em>do</em>?",
      need:"Write a claim, choose a quotation and write your analysis first.", pv:"Your sentence" },
    s3:{ title:"Station 3: Two regimes, one trick",
      forster:{ t:FO.beware, cite:CF.beware, who:"Forster’s lecturer" }, atwood:{ t:"Freedom to and freedom from.", cite:CR("lydia"), who:"Aunt Lydia" },
      how:"Tap a statement, then tap where it belongs.",
      regions:[{ id:"F", t:"Forster only" }, { id:"both", t:"Both" }, { id:"A", t:"Atwood only" }],
      chips:[
        { id:"v1", t:"Dependence is recast as protection.", answer:"both", fb:"Both: the Machine’s comfort and Gilead’s “freedom from” each make dependence sound like safety." },
        { id:"v2", t:"Control arrives through comfort and technology.", answer:"F", fb:"Forster: the Machine serves every need until people can’t live without it." },
        { id:"v3", t:"Control arrives through crisis and religion.", answer:"A", fb:"Atwood: an emergency and a theocracy bring Gilead." },
        { id:"v4", t:"Direct experience is treated as dangerous.", answer:"both", fb:"Both: Gilead forbids reading, the Machine forbids first-hand ideas." }
      ],
      wrong:"Not there. Ask which text shows it, or whether both do.", done:"All four placed. One trick, two regimes: dependence sold as protection." },
    quickCheck:{ title:"Language as control quick check", summary:"Language as control quick check",
      items:[
        { id:"q1", goal:3, prompt:"Gilead calls a public execution a “Salvaging”. This is an example of…",
          choices:[{ t:"euphemism", ok:true, fb:"Right. It borrows a word for rescue to soften killing." },
            { t:"alliteration", fb:"It borrows a word for rescue to soften killing." },
            { t:"onomatopoeia", fb:"It borrows a word for rescue to soften killing." },
            { t:"a flashback", fb:"It borrows a word for rescue to soften killing." }] },
        { id:"q2", goal:5, prompt:"Why might Offred insist “" + Q.recon + "”?",
          choices:[{ t:"It admits her telling is shaped and partial, and claims the right to tell it", ok:true, fb:"Right. She owns her story by admitting it’s a version, which Gilead would never allow." },
            { t:"It shows the story is false", fb:"She owns her story by admitting it’s a version, which Gilead would never allow." },
            { t:"It’s a random aside", fb:"She owns her story by admitting it’s a version, which Gilead would never allow." },
            { t:"It proves she is a historian", fb:"She owns her story by admitting it’s a version, which Gilead would never allow." }] },
        { id:"q3", goal:5, prompt:"“Freedom to and freedom from” is spoken by…",
          choices:[{ t:"Aunt Lydia, training the Handmaids", ok:true, fb:"Right. A character speaks it; don’t treat it as Atwood’s own view." },
            { t:"Atwood, in a preface", fb:"A character speaks it; don’t treat it as Atwood’s own view." },
            { t:"Offred, defending Gilead", fb:"A character speaks it; don’t treat it as Atwood’s own view." },
            { t:"Professor Pieixoto", fb:"A character speaks it; don’t treat it as Atwood’s own view." }] },
        { id:"q4", goal:3, prompt:"Which question best opens a language-as-control analysis?",
          choices:[{ t:"Who controls the words, and what does that let them hide?", ok:true, fb:"Right. Analysis asks <em>how</em> and <em>why</em>; plot questions ask <em>what</em>." },
            { t:"What happens next?", fb:"Analysis asks <em>how</em> and <em>why</em>; plot questions ask <em>what</em>." },
            { t:"Is Gilead bad?", fb:"Analysis asks <em>how</em> and <em>why</em>; plot questions ask <em>what</em>." },
            { t:"How many chapters are there?", fb:"Analysis asks <em>how</em> and <em>why</em>; plot questions ask <em>what</em>." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<div class='at-steal' data-path='atwood'><p class='steal-line'>“" + Q.papers + "”</p><p class='eng-cite'>" + CR("papers") + "</p><p><strong>The shape:</strong> “We were the people who were not in [X]. We lived in the [unnoticed space] at the edges of [Y].” The second sentence turns absence into a place to live.</p><p><strong>Model imitation:</strong> “We were the students who were not in the yearbook. We lived in the hallways between the photographs.”</p></div>" +
        "<div class='at-steal' data-path='forster' hidden><p class='steal-line'>“" + FO.open + "”</p><p class='eng-cite'>" + CF.open + "</p><p><strong>The shape:</strong> “Imagine, if you can, [a small place], [its shape], like [something from nature].” The invitation makes the reader build the strange room themselves.</p></div>" +
        "<p>Write your own in the same shape.</p>",
      prompt:"Your imitation" }],
    steal:{ master:Q.papers, source:"Atwood, <i>The Handmaid’s Tale</i>, ch. " + CHN.papers, masterF:FO.open, sourceF:"Forster, “The Machine Stops”", save:"Save it to My Art of Language (imitations)" }
  },
  practice:{
    activities:[
      { id:"sort", type:"custom", title:"Convention sort", summary:"Convention sort", goal:[2, 3, 6],
        instruction:"Sort each item by what it controls.",
        how:"Tap an item, then tap the bin it belongs in.",
        boxes:[{ id:"info", label:"Control of information" }, { id:"surv", label:"Surveillance" }, { id:"lang", label:"Language control" }, { id:"comfort", label:"Comfort and consent" }, { id:"frame", label:"Frame" }],
        wrongDefault:"Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?",
        items:[
          { id:"s1", t:"Gilead’s Eyes (secret police) and the fear that anyone might be one of them", answer:"surv", why:"Surveillance: secret police, and the fear that anyone is watching.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key word: “Eyes”.", "Surveillance: secret police, and the fear that anyone is watching."] },
          { id:"s2", t:"Women may not read; even the Bible is kept locked away", answer:"info", why:"Control of information: who may read decides who may know.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “may not read”.", "Control of information: who may read decides who may know."] },
          { id:"s3", t:"Handmaids must greet each other with “" + Q.fruit + "”", answer:"lang", why:"Language control: a required phrase limits what can be said.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “must greet”.", "Language control: a required phrase limits what can be said."] },
          { id:"s4", t:"Aunt Lydia promises “freedom from” danger in exchange for obedience", answer:"comfort", why:"Comfort and consent: safety offered in exchange for obedience.",
            wrong:{ lang:"The words matter, but the item’s focus is the <em>bargain</em>: safety in exchange for freedom." },
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “in exchange for”.", "Comfort and consent: safety offered in exchange for obedience."] },
          { id:"s5", t:"The novel closes with a conference paper given two hundred years later", answer:"frame", why:"Frame: a record from a later time surrounds the story.",
            wrong:{ info:"A record from a later time surrounds the story: a frame.", surv:"A record from a later time surrounds the story: a frame.", lang:"A record from a later time surrounds the story: a frame.", comfort:"A record from a later time surrounds the story: a frame." },
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “two hundred years later”.", "Frame: a later record surrounds the story and shapes how it’s remembered."] },
          { id:"s6", t:"The Handmaids’ wings, white headdresses that keep them from seeing or being seen", answer:"surv", why:"Surveillance: the wings keep Handmaids from being seen.",
            also:{ info:"Close: the wings limit what Handmaids see, but their stated purpose is to keep them from being seen, which is surveillance in reverse. Both work; this item’s focus is seeing." },
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “seeing or being seen”.", "Surveillance (Control of information also works): the wings are about seeing."] },
          { id:"s7", t:"Handmaids lose their own names and take the Commander’s, as “Of-fred”", answer:"lang", why:"Language control: renaming turns a woman into a possession.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “lose their own names”.", "Language control: renaming turns a woman into a possession."] },
          { id:"s8", t:"The television news shows only Gilead’s victories", answer:"info", why:"Control of information: the news is filtered.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “only Gilead’s victories”.", "Control of information: the news is filtered."] },
          { id:"s9", t:"Forster’s citizens thank the Machine and rarely leave their rooms", answer:"comfort", why:"Comfort and consent: comfort keeps them inside, and they are grateful for it.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key words: “thank the Machine”.", "Comfort and consent: comfort keeps them inside."] },
          { id:"s10", t:"Forster’s citizens worship the “Book of the Machine”", answer:"info", why:"Control of information: one approved book holds what can be known.",
            hints:["Ask: what is being controlled: knowledge, behaviour, words, or memory of the story?", "The key word: “worship”.", "Control of information: one approved book holds what can be known."] }
        ] },
      { id:"archivist", type:"custom", title:"Unseen passage: “The Archivist”", summary:"The Archivist", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Read this sight passage, written for this course. Then answer six questions. R4 to R6 sit above Final Check level.",
        why:"You’ve never seen this text, so you’ll find out whether what you learned from Gilead transfers.",
        passage:ARCHIVIST, passageTitle:"“The Archivist” (written for this course)",
        items:[
          { id:"r1", goal:3, prompt:"<strong>R1.</strong> What does “retired” most likely imply about the brother?",
            options:[{ t:"The state has erased him from the record, and perhaps from existence", ok:true, why:"“Retired” is a euphemism; the next sentence, “was never here”, shows he has been erased." },
              { t:"He retired from work", why:"Look at the next sentence: “was never here.” “Retired” is a euphemism." },
              { t:"He moved away from New Halifax", why:"Moving away wouldn’t make him “never here”. The record itself has changed." },
              { t:"The narrator has forgotten him by choice", why:"She remembers him clearly; it’s the Archive that has “retired” the memory." }],
            hints:["Read the sentence after “retired”.", "“My brother, it seems, was never here.”", "A euphemism: the state has erased him from the record."] },
          { id:"r2", goal:3, prompt:"<strong>R2.</strong> What does the simile “like ink in sunlight” do?",
            options:[{ t:"Makes forced forgetting sound natural and gentle, hiding its violence", ok:true, why:"Ink fades quietly, as if by nature; the simile disguises an erasure someone schedules." },
              { t:"Shows memories are written down", why:"The gentleness is the trick: it disguises erasure." },
              { t:"Shows the narrator likes summer", why:"The sunlight isn’t about weather; it’s about fading." },
              { t:"Shows that memories can be restored", why:"Faded ink doesn’t come back; the simile hides a loss." }],
            hints:["What happens to ink in sunlight?", "It fades slowly and quietly, as if by nature.", "The simile makes a forced erasure sound natural and gentle."] },
          { id:"r3", goal:5, star:true, prompt:"<strong>R3 ★.</strong> Is the narrator’s early view (“People say it is a mercy”) the story’s view?",
            options:[{ t:"No: the story builds toward doubting it, and “People say” distances her from it", ok:true, why:"“People say”, not “I believe”; by the end she wonders what else the Archive keeps." },
              { t:"Yes, she agrees", why:"Notice “People say”, not “I believe”." },
              { t:"Yes, because the clerk has kind eyes", why:"Kind eyes are the regime’s soft face, not proof." },
              { t:"It’s impossible to tell", why:"The ending answers it: she wonders what else the Archive keeps." }],
            hints:["Whose words are “it is a mercy”?", "“People say”, not “I believe”.", "No: the story builds toward doubt."] },
          { id:"r4", goal:2, star:true, prompt:"<strong>R4 ★.</strong> Which detail does the most to make the ending believable rather than melodramatic?",
            options:[{ t:"Her hands remembering the stone’s weight: the body keeps what the Archive erased", ok:true, why:"A quiet physical detail is the proof; no speech is needed." },
              { t:"The clerk’s kind eyes", why:"That’s the regime’s soft face; the bodily memory is the proof." },
              { t:"The booth that smells faintly of oranges", why:"A pleasant detail of the system, not the proof against it." },
              { t:"Her age, seventeen", why:"Her age sets the scene; it doesn’t prove the brother existed." }],
            hints:["What proves the brother was real?", "Look at the last sentence.", "Her hands remember the weight of the stone."] },
          { id:"r5", goal:4, star:true, prompt:"<strong>R5 ★.</strong> Which of Gilead’s methods does the Archive most resemble?",
            options:[{ t:"Erasing the past so that only the regime’s version remains, as Gilead’s banned reading and “time before” do", ok:true, why:"Both control the past, not just actions." },
              { t:"The Eyes", why:"No one is watched here; memory itself is managed." },
              { t:"The Wall", why:"There’s no public terror here; the control is quiet and gentle." },
              { t:"Colour-coded dress", why:"Nothing here marks roles by clothing; the Archive manages memory." }],
            hints:["What does the Archive control: actions, or the past?", "The past.", "Like Gilead’s control of reading and of “the time before”."] },
          { id:"r6", goal:6, star:true, prompt:"<strong>R6 ★.</strong> How is the narrator like Offred?",
            options:[{ t:"Both resist by remembering and telling what the system wants forgotten", ok:true, why:"Memory and words are their resistance." },
              { t:"Both are rebels with weapons", why:"Their resistance is memory and words, not force." },
              { t:"Both work for the regime", why:"Neither serves the system; each keeps what it erases." },
              { t:"Both have forgotten the past", why:"The opposite: each holds on to the past." }],
            hints:["What does Offred do with her memories of the time before?", "She keeps them and tells them.", "Both resist by remembering and telling."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Ulrich", goal:[1, 3, 5],
        instruction:"Ulrich made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Analyse what Offred’s name shows about Gilead.",
            steps:["In <i>The Handmaid’s Tale</i>, the narrator is known only as Offred.",
              "She is a Handmaid who lives in the Commander’s house, goes shopping with Ofglen and remembers her husband, Luke.",
              "Later she plays Scrabble with the Commander.",
              "This shows Gilead is strict."],
            answer:1,
            stepFb:["Accurate context. Keep checking.", "", "Sentence 3 continues the problem in sentence 2.", "Too broad, but the first slip came earlier."],
            fixes:[{ t:"Replace sentence 2 with analysis: “Because ‘Offred’ joins ‘of’ to the Commander’s first name, the name turns a woman into a possession, and when she is reassigned the name will pass to the next woman.”", ok:true, why:"It says what the name <em>does</em>, not what happens." },
              { t:"Add more plot details to sentence 2.", why:"More summary won’t create analysis." },
              { t:"Delete sentence 1.", why:"Sentence 1 is fine; the problem is summary in place of analysis." },
              { t:"Sentence 2 is correct.", why:"It retells events without saying what the name <em>means</em> or how it works." }],
            hints:["Which sentence only retells what happens?", "Sentence 2 is a list of events.", "Turn it into a claim about what the name does."] },
          { id:"e2", goal:1, task:"Explain why <i>The Handmaid’s Tale</i> still matters.",
            steps:["Margaret Atwood’s <i>The Handmaid’s Tale</i> (1985) imagines a theocratic regime in the former United States.",
              "The novel matters because Atwood predicted the future.",
              "Readers today can check which predictions came true.",
              "So it is a forecast more than a story."],
            answer:1,
            stepFb:["Accurate and well framed.", "", "This follows from the flawed premise in sentence 2.", "Same flaw, extended."],
            fixes:[{ t:"“The novel matters because, by Atwood’s own rule, every practice in Gilead has a historical precedent, so readers learn to recognize warning signs in their own time.”", ok:true, why:"Precedent, not prediction: that’s why it still matters." },
              { t:"“The novel matters because it is set in the future.”", why:"Setting isn’t significance." },
              { t:"“The novel matters because it is famous.”", why:"Fame isn’t an argument." },
              { t:"Sentence 2 is correct.", why:"Speculative fiction magnifies the present; it doesn’t forecast." }],
            hints:["Is speculative fiction a prediction?", "Think “magnify”, not “forecast”.", "Precedents, recognized in our own time."] },
          { id:"e3", goal:5, task:"Analyse the Historical Notes.",
            steps:["The novel ends with the “Historical Notes”, a transcript of an academic conference held long after Gilead’s fall.",
              "There, Professor Pieixoto discusses how Offred’s recorded tapes were found and pieced together.",
              "Through Pieixoto, Atwood tells readers that we should not judge Gilead.",
              "So the ending asks us to stay neutral."],
            answer:2,
            stepFb:["A clear, accurate frame.", "Accurate. Keep checking.", "", "This follows from the misreading in sentence 3."],
            // VERIFY: sentence 2's details against the class edition (plan: "the teacher confirms details").
            fixes:[{ t:"“Pieixoto’s cautious refusal to judge Gilead, and his jokes at the start of his talk, make his detachment part of what the novel criticizes: even after Gilead falls, Offred’s voice can be treated as a curiosity.”", ok:true, why:"It separates the character’s view from the author’s, and says what the frame does." },
              { t:"“Pieixoto proves the story really happened.”", why:"He studies a fictional document; the frame comments on how stories are received." },
              { t:"“The Historical Notes are an appendix and can be skipped.”", why:"The frame is part of the meaning." },
              { t:"Sentence 3 is correct.", why:"A character’s view isn’t the author’s; Atwood makes Pieixoto’s coolness something to question." }],
            hints:["Whose view is it: Pieixoto’s or Atwood’s?", "A character can say what the author questions.", "His detachment is part of what the ending examines."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which of Gilead’s six features felt closest to something you’ve read about in history, and how did linking it change the way you see the novel?" },
      { id:"j2", q:"In your own words: why are renaming and scripted greetings tools of power rather than just strange customs?" },
      { id:"j3", q:"Explain to a friend why “Atwood predicted the future” is the wrong way to praise her, using her rule." },
      { id:"j4", q:"What still puzzles you about the novel, perhaps the ending or the Historical Notes, and what will you reread to think it through?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line from this module, from <i>The Handmaid’s Tale</i>, Forster or “The Archivist”, that you want to remember. Add one sentence on why it stays with you.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one craft principle you’ve earned in this module: a rule a writer or reader could live by. Then give the master’s example (a line from <i>The Handmaid’s Tale</i>, with its page number, or from Forster), and your own imitation.",
      placeholder:"e.g. To make the strange believable, build it inside the familiar.",
      examples:[
        "“" + Q.gym + "” " + CR("gym"),
        "“" + Q.papers + "” " + CR("papers"),
        "“Freedom to and freedom from.” " + CR("lydia"),
        "“" + Q.recon + "” " + CR("recon"),
        "“" + FO.open + "” " + CF.open,
        "“" + FO.beware + "” " + CF.beware,
        "“The rest of the year’s memories fade on schedule, gently, like ink in sunlight.” (“The Archivist”)"
      ]
    },
    artSamples:[
      { p:"To make the strange believable, build it inside the familiar.", master:"“" + Q.gym + "” " + CR("gym"), imit:"“We ate in what had once been the library.”" },
      { p:"Give the oppressor the most beautiful sentence; let the reader distrust it.", master:"“Freedom to and freedom from” " + CR("lydia"), imit:"“Not the right to choose, the official said, but the right to be spared from choosing.”" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How does speculative fiction differ from science fiction, as Atwood distinguishes them?",
          options:[{ t:"Speculative fiction imagines things that could really happen with means we already have", ok:true, why:"Possibility with present means is the test." },
            { t:"Speculative fiction is about impossible technologies", why:"That’s closer to her description of science fiction." },
            { t:"Speculative fiction accurately predicts the future", why:"It magnifies the present; it doesn’t forecast." },
            { t:"Speculative fiction is any story set in the future", why:"Setting isn’t the test; possibility is." }] },
        b:{ prompt:"A novel imagines that every home camera reports “unhappy faces” to a government agency. By the module’s definition, it is…",
          options:[{ t:"Speculative fiction, because the technology and the practice could really exist", ok:true, why:"Cameras and agencies exist; the premise could happen." },
            { t:"Science fiction, because cameras are technology", why:"Science fiction needs what <em>can’t</em> happen; cameras exist." },
            { t:"Fantasy, because no government would do this", why:"History suggests otherwise; plausibility is the point." },
            { t:"Realist fiction, because it’s about families", why:"Its premise is a “what if”, not a record." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"The “Historical Notes” at the end of <i>The Handmaid’s Tale</i> are best described as…",
          options:[{ t:"a framing device: a later document that surrounds Offred’s story and shapes how we read it", ok:true, why:"It sits outside her story and changes how we read it." },
            { t:"a flashback to the time before", why:"A flashback moves within the story; this sits outside it." },
            { t:"the author’s preface", why:"It’s a fictional conference, not Atwood speaking." },
            { t:"an optional appendix", why:"It changes the meaning of the whole novel." }] },
        b:{ prompt:"Which is a common <strong>dystopian convention</strong> that Gilead uses?",
          options:[{ t:"Control of information presented as protection", ok:true, why:"Gilead calls its control of reading and news protection." },
            { t:"A happy ending in which the system is perfected", why:"That’s a utopian resolution." },
            { t:"A setting with no government at all", why:"That’s closer to post-apocalyptic anarchy." },
            { t:"A narrator who is a talking animal", why:"That’s a fable device, not a dystopian one." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Gilead calls a public execution a “Salvaging”. This is an example of…",
          options:[{ t:"euphemism", ok:true, why:"It borrows a word for rescue to soften a killing." },
            { t:"oxymoron", why:"An oxymoron joins opposites (“deafening silence”); this softens a harsh truth." },
            { t:"onomatopoeia", why:"No sound-word here." },
            { t:"hyperbole", why:"It understates; it doesn’t exaggerate." }] },
        b:{ prompt:"Handmaids must greet each other with “" + Q.fruit + "” and answer “" + Q.open + ".” " + CR("greet") + " This is an example of…",
          options:[{ t:"scripted speech that limits what people can say", ok:true, why:"The phrases are required, so nothing else can be said." },
            { t:"a simile", why:"There’s no comparison with <em>like</em> or <em>as</em>." },
            { t:"a flashback", why:"There’s no shift in time." },
            { t:"euphemism", why:"Nothing harsh is being softened; the phrases are required." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"The novel opens: “" + Q.gym + "” " + CR("gym") + " What does the opening most strongly suggest?",
          options:[{ t:"Gilead has been built inside the reader’s familiar world, which now exists only as the past", ok:true, why:"“Had once been” turns our familiar world into Gilead’s ruins." },
            { t:"The narrator is a student on a sports team", why:"Over-literal: “had once been” signals a changed purpose." },
            { t:"The story is set in ancient times", why:"A gymnasium with a remembered past points to a near future." },
            { t:"The narrator approves of her new home", why:"Nothing in the line shows approval; the reader senses loss." }] },
        b:{ prompt:"Aunt Lydia tells the Handmaids there is “freedom to and freedom from.” " + CR("lydia") + " What does the line most strongly reveal?",
          options:[{ t:"Gilead recasts confinement as protection, using neat language to make a loss sound like a gift", ok:true, why:"The tidy balance makes a loss sound like a gift." },
            { t:"Atwood believes safety matters more than freedom", why:"A character speaks it, and the novel invites us to distrust it." },
            { t:"Aunt Lydia is joking", why:"Nothing signals a joke; the danger is that she means it." },
            { t:"The Handmaids are free to leave", why:"The novel shows they are not." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A student argues: “<i>The Handmaid’s Tale</i> is far-fetched because nothing like Gilead could happen.” Which response best evaluates this claim?",
          options:[{ t:"It ignores Atwood’s rule: each of Gilead’s practices has a real precedent somewhere in history", ok:true, why:"Precedent is the answer to “far-fetched”." },
            { t:"It’s right: old novels can’t be relevant", why:"Age isn’t the test; the magnified practices are." },
            { t:"It’s right, because Gilead hasn’t literally happened", why:"Speculative fiction isn’t judged on accurate prediction." },
            { t:"It’s wrong because Atwood predicted events correctly", why:"Praise by prediction repeats the same mistake." }] },
        b:{ prompt:"A reviewer calls a dystopia weak because “nothing in it could ever happen.” Which evidence would best defend it as speculative fiction?",
          options:[{ t:"Showing that each of its controls has a real historical or present-day precedent", ok:true, why:"Plausibility is shown by precedent." },
            { t:"Showing that it won prizes", why:"Awards aren’t evidence of plausibility." },
            { t:"Showing that it’s set far in the future", why:"Distance in time doesn’t answer the charge." },
            { t:"Showing that its author predicted events correctly", why:"Plausibility, not prediction, is the defence." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"In a story, citizens happily trade their privacy for free transit passes. Years later, those without passes cannot travel at all. Which dystopian pattern does this show?",
          options:[{ t:"Comfort or safety chosen freely hardens into control", ok:true, why:"The trade is welcomed, then it becomes the only way to travel." },
            { t:"A violent revolution overthrows a tyrant", why:"No revolution occurs; the control is welcomed." },
            { t:"A natural disaster reshapes society", why:"The change is chosen, not natural." },
            { t:"A utopia is achieved", why:"Losing the freedom to travel isn’t ideal." }] },
        b:{ prompt:"A school app rewards “positive posts” with points. Soon, students with low points can’t enrol in electives. Which dystopian pattern does this show?",
          options:[{ t:"Comfort or safety chosen freely hardens into control", ok:true, why:"A reward everyone accepted becomes a gate." },
            { t:"Surveillance by a foreign enemy", why:"The app is internal and chosen." },
            { t:"A frame narrative", why:"There’s no surrounding story here." },
            { t:"A utopia is achieved", why:"Barring students from courses isn’t ideal." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best <strong>analytical thesis</strong> about language in <i>The Handmaid’s Tale</i>?",
          options:[{ t:"“By scripting greetings and renaming women after the men they serve, Gilead makes control sound holy and natural, which is why Offred’s private wordplay and her insistence on telling her own story become acts of resistance.”", ok:true, why:"It names the techniques, says what they do, and why Offred’s words matter." },
            { t:"“<i>The Handmaid’s Tale</i> is about a woman who says ‘Blessed be the fruit.’”", why:"That’s plot, not a claim." },
            { t:"“Atwood uses a lot of interesting words.”", why:"Too vague to argue." },
            { t:"“In Gilead, women are not allowed to read.”", why:"A fact, not a thesis." }] },
        b:{ prompt:"Which is the best <strong>analytical thesis</strong> about the “Historical Notes”?",
          options:[{ t:"“By ending with a scholar who jokes about Offred’s story and declines to judge Gilead, Atwood turns the frame into a final warning: even after a regime falls, the voices it silenced can be treated as curiosities.”", ok:true, why:"An arguable claim about what the frame does." },
            { t:"“The Historical Notes tell us what happened after the story.”", why:"That’s plot." },
            { t:"“Atwood thinks we shouldn’t judge Gilead.”", why:"That confuses a character’s view with the author’s." },
            { t:"“The Historical Notes are at the end of the book.”", why:"A fact, not a claim about meaning." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which sentence best avoids treating speculative fiction as prediction?",
          options:[{ t:"“Atwood’s Gilead gathers practices that have existed in history, inviting readers to recognize them in their own time.”", ok:true, why:"It treats Gilead as gathered from history, not as a forecast." },
            { t:"“Atwood predicted exactly what would happen in the twenty-first century.”", why:M1 },
            { t:"“Atwood’s novel is science fiction about the future.”", why:M2 },
            { t:"“Atwood’s novel is accurate because some events came true.”", why:M1 }] },
        b:{ prompt:"Which sentence best avoids treating speculative fiction as prediction?",
          options:[{ t:"“Forster’s Machine exaggerates his era’s growing faith in technology, which is why the story still unsettles readers in the internet age.”", ok:true, why:"It names a present trend the story magnifies." },
            { t:"“Forster predicted the internet in 1909.”", why:"Speculative fiction magnifies the present; it doesn’t forecast it." },
            { t:"“Forster’s story is science fiction because of the Machine.”", why:"Ask whether it could happen with the means we have; the Machine magnifies real technology." },
            { t:"“Forster was wrong because we don’t live underground.”", why:"Speculative fiction isn’t judged on accurate prediction." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A Canadian speculative novel (fictional: <i>Thaw</i>) imagines the North after the permafrost melts, with southern companies racing to claim land. Which reading connects it most responsibly to present Canadian contexts?",
          options:[{ t:"It magnifies current debates about climate change, resource extraction and Indigenous land rights, asking who decides the North’s future", ok:true, why:"It reads the novel as a magnifying glass on present debates." },
            { t:"It predicts that the North will be sold by 2050", why:M1 },
            { t:"It’s science fiction because permafrost can’t melt", why:"It’s already melting; that’s the point." },
            { t:"It has no connection to Canada because it’s set in the future", why:"The future here is built from Canadian present-day issues." }] },
        b:{ prompt:"A Canadian speculative novel (fictional: <i>Static</i>) imagines a national app that rates citizens’ online “civility”. Which reading connects it most responsibly to present contexts?",
          options:[{ t:"It magnifies current debates about online speech, privacy and the power of platforms to shape behaviour", ok:true, why:"It connects the premise to real, present debates." },
            { t:"It predicts a law that will pass next year", why:M1 },
            { t:"It’s fantasy because apps can’t rate behaviour", why:"Many already score behaviour." },
            { t:"It’s only about phones, not society", why:"The app is a lens on social control." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"You’re writing the opening of a dystopia set in your own town. Which choice best uses the technique of Atwood’s first sentence?",
          options:[{ t:"Place the characters in an ordinary local building that has been repurposed, so the reader recognizes their own world in ruins", ok:true, why:"Like Atwood’s gymnasium, a repurposed familiar place makes the reader’s world the ruin." },
            { t:"Begin with a battle to grab attention", why:"Atwood begins quietly, in a gym." },
            { t:"Explain the regime’s whole history first", why:"Atwood lets the world arrive in fragments." },
            { t:"List every rule in the first paragraph", why:"That’s exposition, not invitation." }] },
        b:{ prompt:"You want readers to see how your dystopia will be remembered. Which choice best uses a <strong>framing device</strong>, as Atwood does?",
          options:[{ t:"End with a document from a later era that discusses your story as an artifact", ok:true, why:"A later document that treats your story as an artifact is a frame, like the Historical Notes." },
            { t:"Write the whole story in the present tense", why:"Tense isn’t a frame." },
            { t:"Add a map at the front", why:"A map is a paratext, not a narrative frame." },
            { t:"Make the narrator a rebel", why:"A choice of protagonist, not a frame." }] } }
    ]
  },
  task:{
    title:"Performance task: Pitch a speculative world", summary:"Pitch a speculative world",
    statement:"<p>Use Atwood’s rule to pitch a speculative world rooted in the real, then write its opening paragraph. Make the familiar strange, the way Atwood’s gymnasium or Forster’s honeycomb room does. There are endless good answers.</p><p>You make: (1) a “What if…?” premise of 8–30 words; (2) a world of 2–4 precedent-deck elements, each linked to a precedent; (3) an opening paragraph of 120–220 words with at least two convention tags on its words; (4) a craft statement of at least 50 words.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["A “What if…?” premise", "Atwood’s rule: rooted in the real", "Speculative, not science fiction", "Make the familiar strange", "Conventions at work", "Opening length", "Craft statement"],
    tips:["Begin with “What if” and end with a question mark.",
      "Link every element to a precedent: where has something like this happened?",
      "Swap the impossible element for one with a real precedent: Atwood’s rule.",
      "Open with an invitation (“Imagine…”) or a repurposed place (“what had once been…”).",
      "Tag at least two places where your paragraph shows a convention.",
      "Aim for 120–220 words: one rich paragraph.",
      "Explain your choices in at least 50 words."],
    explainPrompt:"Craft statement: What present-day habit did you magnify, and what precedent keeps it within Atwood’s rule? Which convention did you use to make it frightening or moving, and how does your opening make the familiar strange?",
    explainLabel:"Craft statement",
    vocab:"Use the words extrapolate, precedent, convention and euphemism (or frame).",
    checkLabel:"Check my pitch",
    success:"Every part is there.",
    more:"There are endless good answers. Your teacher reads your pitch for insight and voice; the checklist only checked the parts. Want to try a second world?",
    min:120, max:220, pmin:8, pmax:30, craftMin:50,
    invite:["imagine", "picture", "consider", "suppose", "look"],
    repurpose:["had once been", "used to be", "once was", "what was once"],
    labels:{ premise:"1. Premise", premiseHow:"One “What if…?” question, 8–30 words.", draft:"Use the lab’s draft", world:"2. Your world (the same cards as the lab’s Build mode)",
      opening:"3. Opening paragraph", openingHow:"120–220 words. Make the familiar strange.", drafts:"Saved drafts", saveDraft:"Save a draft", restore:"Restore", maxDrafts:"Up to 3 drafts; saving a fourth replaces the oldest.",
      tag:"Tag your opening", tagHow:"Tap words in your opening, then tap a convention. Tags on words you later change are removed.", noText:"Write your opening first; its words appear here to tag.",
      pv:"Your pitch", words:"words", tags:"Tags" },
    modelsLabel:"Three model responses, three approaches",
    models:[
      { title:"Model 1: Forster’s invitation (water rationing)",
        premise:"What if fresh water grew so scarce that every household’s ration depended on its neighbours’ reports?",
        elements:"“Rationed water by household score”, linked to wartime rationing; “Public praise for informers”, linked to informer campaigns.",
        text:"Imagine, if you dare, a kitchen in Hamilton where the tap answers only to a thumbprint. Each morning it pours exactly what the Board allows: two litres for drinking, one for washing, and a half-litre more if your neighbours have rated you Considerate. Mrs. Osei rinses her cup with care. She has learned to smile at the Ferreiras on the stairs, to compliment their tomatoes, to never, ever run a bath. Last month the Ferreiras’ little boy left a hose running in the courtyard, and by Friday the family’s tap gave nothing but a polite chime and the word <em>Pending</em>. No one shouted. No one was taken anywhere. The water simply learned who deserved it, and the neighbours learned to be deserving. Mrs. Osei saves the cloudy rinse water in a jar for her plants, and wonders, sometimes, who is rating her.",
        tags:"“rated you Considerate” (surveillance); “the word <em>Pending</em>” (euphemism)." },
      { title:"Model 2: Atwood’s repurposed place (a school)",
        premise:"What if schools ranked students each day by an attention score that decided who could speak in class?",
        elements:"“A list of approved words”, linked to approved word lists; “Ritual greetings”, linked to ritual school recitations.",
        text:"We learned in what had once been the music room, though no one remembers the music. The green glow on my desk means I am Present. Mr. Halvorsen says attention is a gift we give each other, and I believe him, because my score is ninety-four. At nine we recite the Focus Pledge together, eyes on the light, and then the speakers are chosen. Only Greens may ask questions. Ambers may answer if called. Reds may listen, which Mr. Halvorsen says is the most important skill of all. Priya was Red all last week. She sits very straight now and says only words from the Clear List, like <em>agree</em> and <em>understand</em> and <em>thank you</em>. I think she is improving. Yesterday she smiled at me with her mouth and not her eyes, and I gave her a gold star in my mind.",
        tags:"“the Focus Pledge” (scripted speech); “words from the Clear List” (limited language)." },
      { title:"Model 3: A frame (an artifact from the future)",
        premise:"What if memories were stored in a national archive and citizens could keep only the ones the archive approved?",
        elements:"“Erasing names from records”, linked to erased names in official records; “Permits to leave home”, linked to travel passes.",
        text:"Consider this card, recovered in 2163 from a collapsed archive beneath what was once Saskatoon. It is the size of a hand and printed in calm blue type: <em>Memory Permit, Category C, Holder may retain one (1) personal recollection per calendar year.</em> On the back, in pencil, someone has written a list: <em>the lake, the dog, Grandpa’s laugh, the lake again.</em> Scholars disagree about the list. Some call it a request; others, an act of defiance, since unapproved recollections were officially classified as Clutter and collected each December for Processing. What we know is this: the holder never filed the card. It was found folded into a child’s shoe, as if someone hoped the memories might walk away on their own.",
        tags:"“classified as Clutter” (euphemism); “Memory Permit” (control of information)." }
    ],
    rubric:RUBROWS
  },
  cards:[
    ["Speculative fiction", "Fiction about what <em>could</em> really happen with means we already have (Atwood’s distinction)."],
    ["Atwood’s rule", "Nothing in <i>The Handmaid’s Tale</i> without a precedent in history: Gilead is gathered, not invented."],
    ["Dystopia", "A society presented as ideal that is controlling or harmful underneath. From <em>dys-</em>, “bad”, plus <em>topos</em>, “place”."],
    ["Extrapolation", "Pushing a present trend or past practice forward to see where it leads."],
    ["Precedent", "A real past or present example of something a speculative world imagines (e.g. laws against teaching enslaved people to read, behind Gilead’s ban on women reading)."],
    ["Framing device", "A story or document around the main story: the “Historical Notes”, which end “" + Q.questions + "”"],
    ["Euphemism", "A soft word for a harsh truth: Gilead’s “Salvaging” for a public execution."],
    ["Scripted speech", "Required phrases that limit what people can say: “" + Q.fruit + "” / “" + Q.open + "”."],
    ["Renaming as ownership", "“Of-fred”: a woman named for the man she serves."],
    ["Freedom to / freedom from", "Aunt Lydia’s trade: safety offered in exchange for choice (ch. 5)."],
    ["“" + Q.recon + "”", "Offred admits her telling is shaped, and so claims her story as her own (ch. 23)."],
    ["Comfort to control", "Crisis → controls “for safety” → rights removed → “" + Q.ignore + "” → “" + Q.ordinary + "”"]
  ],
  misc:{ M1, M2, M3, M4, M5, M6, M7 }
};
