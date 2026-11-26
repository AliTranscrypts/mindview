// ENG4U 15 Indigenous Voices & Thomas King. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/15-indigenous-voices.md
// Texts:
//  King, "Borders" (One Good Story, That One, 1993) and The Truth About Stories (2003) are in copyright. Only the short quotations
//    the plan itself prints are used, exactly as given (fair dealing, course plan §3): the mother's one-word answer "Blackfoot" and
//    the Truth line "The truth about stories is that that’s all we are." Nothing else from either book is reproduced. The detail
//    cards (d2a … d6b) are the plan's descriptions of each passage, written as paraphrase for the module, not quotations.
//  Johnson, "The Corn Husker" (Flint and Feather, 1912) and the opening sentence of "The Two Sisters" (Legends of Vancouver, 1911):
//    public domain, exactly as the plan prints them (typographic apostrophes only).
//    VERIFY: both against a scan of the 1912 / 1911 editions (not checked against a scan in this build).
//  The incident report (I1), the news item (I2) and the alternate line in P1 are written for the module (the plan's wording) and are
//    labelled on screen "Imagined: not part of King’s story".
// VERIFY: teacher note (plan §6.3, not shown to students). Reporting in 2025 indicates that Thomas King has said he learned he does
//   not have the Cherokee ancestry he long believed he had. Check current, reliable reporting before release. The module makes no
//   claim about it in student-facing text. Options: teach "Borders" and frame authorship and identity openly (Station 6, enabled with
//   the page address flag ?station6=on, ideally planned with the board's Indigenous education lead), or retitle the module and map an
//   equivalent story by an Indigenous author onto the excerpt slots' roles (trigger, official encounter, waiting, public turn,
//   resolution). Verify each author's Nation as they describe it.
// Distribution (plan §5): the module is shared only with enrolled students (the site's enrolment gate). No student data leaves the device.

// EXCERPT SLOT: page numbers. Replace each "[p.]" with the page in the class edition (plan "Page placeholders": "##").
const PG = { blackfoot:"[p.]", truth:"[p.]" };
const CK = "(King " + PG.blackfoot + ")";
const CT = "(King, <i>Truth</i> " + PG.truth + ")";
const CT2 = "(<i>Truth</i> " + PG.truth + ")";
// The plan's quotations (exact, as given). VERIFY: both against the class editions.
const TRUTH = "The truth about stories is that that’s all we are.";
const BF = "Blackfoot";

// EXCERPT SLOT X1–X6 (plan §4 Explore). For each slot, paste the passage from the class edition as paragraphs ({ pg:"…", t:"…" }),
//   and record its opening words, closing words and page. While paras is empty, the slot shows a "Read in your copy" card.
//   Map each detail ID (d2a …) to its exact sentence in the class edition; the exact tests use the IDs, not the wording.
const SLOTS = [
  { id:"x1", name:"Laetitia", where:"Early in the story: the narrator’s sister Laetitia leaves Standoff for Salt Lake City, and their mother decides to visit her.", opens:"", closes:"", pg:"[p.]", paras:[] },
  { id:"x2", name:"The first crossing", where:"At the American border: from the guard’s first question about citizenship to the refusal of entry.", opens:"", closes:"", pg:"[p.]", paras:[] },
  { id:"x3", name:"The second crossing", where:"Back at the Canadian border: the same exchange again.", opens:"", closes:"", pg:"[p.]", paras:[] },
  // VERIFY (teacher to confirm): the details of the mother's story about the stars, and how many days they wait.
  { id:"x4", name:"Between", where:"The time in the car in the duty-free store’s parking lot between the two borders, including the night the mother tells her son a story about the stars.", opens:"", closes:"", pg:"[p.]", paras:[] },
  { id:"x5", name:"The cameras", where:"The arrival of the reporters and television crews.", opens:"", closes:"", pg:"[p.]", paras:[] },
  // VERIFY (teacher to confirm): the closing image as the border falls behind.
  { id:"x6", name:"Through", where:"The resolution: the crossing at last, and the drive away from the border.", opens:"", closes:"", pg:"[p.]", paras:[] }
];

// misconception core sentences (plan §3)
const M1 = "One writer speaks from a specific place and life. Write about <em>this</em> text and <em>this</em> author.";
const M2 = "Every telling has a teller and a purpose, including official ones. Ask what each one leaves out.";
const M3 = "The son narrates. King wrote him. Say “the narrator notices…”.";
const M4 = "The comedy at the border is the critique. A joke can be the most serious line in a story.";
const M5 = "Respond in your own voice. Telling a community’s story as if you belonged to it can take what isn’t yours to take.";
const M6 = "That tells what happens. Analysis says how <em>who tells it</em> shapes what it means.";
const M7 = "She understands the question perfectly. Her answer refuses its choices.";
const SET = (m) => " <button type='button' class='btn ghost sm iv-setup' data-setup='" + m + "'>Set it up</button>";

// The tellings (plan §4 Explore). Each detail is a tappable span. ev = the event keys it carries (used for silences and
// "only this telling"). Son: the plan's detail IDs, paraphrased. Mother: only what she says (the plan's one quoted word).
const TELLINGS = [
  { id:"son", t:"The son", sub:"“Borders”, the narrator’s telling", kind:"story", who:"son", to:"readers", auth:"witness",
    whoT:"The son, the story’s narrator", toT:"Readers of the story (the son tells what he saw)",
    note:"Paraphrased for this module. Read the exact words in your copy.",
    groups:[
      { slot:"x1", d:[{ id:"x1a", t:"Laetitia, the narrator’s sister, leaves Standoff to live in Salt Lake City.", ev:["trip"] },
                       { id:"x1b", t:"Their mother decides to drive across the border to visit her.", ev:["trip"] }] },
      { slot:"x2", d:[{ id:"d2a", t:"At the American border, the guard asks the mother her citizenship.", ev:["ask"] },
                       { id:"d2b", t:"She answers with one word: “" + BF + ".”", ev:["answer"] },
                       { id:"d2c", t:"The guard asks her to choose: Canadian or American.", ev:["choose"] },
                       { id:"d2d", t:"She repeats “" + BF + ",” and they are turned back.", ev:["answer", "refused"] }] },
      { slot:"x3", d:[{ id:"d3a", t:"Back at the Canadian border, the guard asks the same question.", ev:["ask"] },
                       { id:"d3b", t:"Her answer is the same: “" + BF + ".”", ev:["answer"] }] },
      { slot:"x4", d:[{ id:"d4a", t:"With neither border letting them through, they wait in their car in the duty-free store’s parking lot between the two borders.", ev:["wait"] },
                       { id:"d4b", t:"One night in the car, the mother tells her son a story about the stars.", ev:["stars"] }] },
      { slot:"x5", d:[{ id:"d5a", t:"Reporters arrive at the border.", ev:["media"] },
                       { id:"d5b", t:"The narrator notices the cameras and the television crews.", ev:["media"] }] },
      { slot:"x6", d:[{ id:"d6a", t:"At last, they are allowed through.", ev:["through"] },
                       { id:"d6b", t:"The story closes as they drive away from the border.", ev:["through"] }] }
    ] },
  { id:"i1", t:"Incident report", sub:"an imagined border form", kind:"record", imagined:true, who:"official", to:"record", auth:"official",
    whoT:"A border official", toT:"Other officials; the record", holds:"Two citizenship choices",
    groups:[{ d:[
      { id:"i1o", t:"SECONDARY REFERRAL. Adult female and minor travelling to Salt Lake City, Utah, to visit a relative.", ev:["trip"] },
      { id:"i1a", t:"Asked to state country of citizenship.", ev:["ask"] },
      { id:"i1b", t:"Subject answered ‘" + BF + "’ and <span class='iv-dts'>declined to state</span> ‘Canadian’ or ‘American’.", ev:["answer", "choose", "declined"] },
      { id:"i1c", t:"Entry refused. Directed to return to the Canadian port of entry. Vehicle and identification recorded.", ev:["refused", "recorded"] }] }] },
  { id:"i2", t:"Evening news", sub:"an imagined TV item", kind:"broadcast", imagined:true, who:"reporter", to:"public", auth:"media",
    whoT:"A news reporter", toT:"The public, a broadcast audience",
    groups:[{ d:[
      { id:"i2a", t:"A mother and her son have spent days in a parking lot between two countries.", ev:["wait"] },
      { id:"i2b", t:"The woman says she isn’t Canadian or American. She says she’s " + BF + ".", ev:["answer", "choose", "isnt"] },
      { id:"i2c", t:"Officials on both sides say the rules are clear.", ev:["officials"] },
      { id:"i2d", t:"Supporters have begun to gather, and the story has reached audiences across the continent.", ev:["media"] }] }] },
  { id:"mom", t:"The mother’s own words", sub:"only what she says in “Borders”", kind:"spoken", who:"mother", to:"present", auth:"self",
    whoT:"The mother herself", toT:"The people present: the guards, and her son",
    note:"Her words as the plan quotes them. The notes in brackets say where she speaks.",
    groups:[{ d:[
      { id:"md2b", t:"“" + BF + ".” <span class='iv-where'>(to the American guard’s question)</span>", ev:["answer", "self"] },
      { id:"md2d", t:"“" + BF + ".” <span class='iv-where'>(again, when asked to choose)</span>", ev:["answer", "self"] },
      { id:"md3b", t:"“" + BF + ".” <span class='iv-where'>(at the Canadian border)</span>", ev:["answer", "self"] },
      { id:"md4b", t:"<span class='iv-where'>[Her story about the stars, told to her son in the car at night: read it in your copy.]</span>", ev:["stars", "self"] }] }] }
];
const EV = { trip:"the trip to visit Laetitia", ask:"the citizenship question", answer:"her answer, “" + BF + "”", choose:"the two choices, Canadian or American",
  declined:"“declined to state”", refused:"being turned back", recorded:"the vehicle and identification recorded", self:"her own naming of her nation, in her own words",
  wait:"the days in the car between the borders", stars:"the stars story", media:"the reporters and cameras", officials:"officials saying the rules are clear",
  through:"being let through at last", isnt:"“isn’t Canadian or American”" };

const RUBROWS = [
  ["Knowledge/Understanding (accuracy about the text and perspective)", "Misidentifies the narrator or events", "Partly accurate", "Accurate, with apt terms", "Precise and nuanced"],
  ["Thinking (insight about perspective)", "Retells", "A simple claim", "An arguable claim explained with evidence", "An insightful claim that reveals silences and stakes"],
  ["Communication (integration, style, respectful language)", "Dropped quotations; generalizing", "Some integration; minor generalizing", "Smooth integration; specific, respectful terms", "Graceful prose; precise, respectful language throughout"],
  ["Application (use of the text)", "Little use", "Some use", "Apt evidence", "Discerning evidence and connections (e.g. to <i>The Truth About Stories</i> or Johnson)"]
];

// "The Corn Husker" (Johnson, Flint and Feather, 1912), as the plan prints it. VERIFY against the 1912 edition.
const HUSKER = [
  "Hard by the Indian lodges, where the bush", "Breaks in a clearing, through ill-fashioned fields,", "She comes to labour, when the first still hush", "Of autumn follows large and recent yields.", "",
  "Age in her fingers, hunger in her face,", "Her shoulders stooped with weight of work and years,", "But rich in tawny colouring of her race,", "She comes a-field to strip the purple ears.", "",
  "And all her thoughts are with the days gone by,", "Ere might’s injustice banished from their lands", "Her people, that to-day unheeded lie,", "Like the dead husks that rustle through her hands."
];
// "The Two Sisters" (Johnson, Legends of Vancouver, 1911), opening sentence, as the plan prints it. VERIFY against the 1911 edition.
const SISTERS = "You can see them as you look towards the north and the west, where the dream-hills swim into the sky amid their ever-drifting clouds of pearl and grey.";

// VERIFY: support-line numbers before release (plan: Hope for Wellness Help Line 1-855-242-3310; Kids Help Phone 1-800-668-6868, text CONNECT to 686868).
const SUPPORT = "This module touches on the history of injustice toward Indigenous peoples in Canada. If it brings up difficult feelings, talk to someone you trust, or contact the Hope for Wellness Help Line (1-855-242-3310, for Indigenous people across Canada) or Kids Help Phone (1-800-668-6868, or text CONNECT to 686868).";

export default {
  id:"15-indigenous-voices",
  kind:"topic",
  title:"Indigenous voices and Thomas King",
  topic:"Indigenous Voices & Thomas King",
  readyTopic:"reading “Borders” and Indigenous voices",
  hero:{
    headline:"Who tells the story decides what the story is.",
    text:"In Thomas King’s “Borders”, a mother and her son set out to visit family across the Canada–US border. When the guard asks her citizenship, she gives one word, and the trip stops. In this module you’ll ask four questions of every telling: <strong>who tells it, to whom, with what authority, and what it leaves out.</strong> You’ll also practise <strong>reading responsibly</strong>, paying attention to the specific writer and text in front of you.",
    fig:{ html:"<div class='iv-hero' id='iv-hero'></div>", caption:"" },
    line:TRUTH, cite:CT, word:BF + ".", wordCite:CK,
    questions:["Who tells it?", "To whom?", "With what authority?", "What’s left out?"],
    aria:"King’s sentence “" + TRUTH + "” appears word by word. Below it, two small border booths are drawn in thin lines, one at each edge, with a car stopped in the space between them. The word “" + BF + ".” appears above the car and holds. Four questions fade in: Who tells it? To whom? With what authority? What’s left out?",
    listen:"Listen", watch:"Watch again", noVoice:"Read the sentence aloud yourself, slowly."
  },
  goals:[
    "I can identify who tells a story, to whom, and with what authority, and explain how that shapes meaning in “Borders”.",
    "I can explain how King uses humour, understatement and a story within the story to make serious points.",
    "I can find what a telling leaves out, and explain why its silences matter.",
    "I can analyse perspective and bias in a specific text without generalizing about a whole people.",
    "I can explain responsible reading practices: crediting tellers, appreciation vs appropriation, and why the TRC’s calls matter to classrooms.",
    "I can write an analytical response, in my own voice, about how perspective shapes meaning in “Borders”, with integrated, cited quotations."
  ],
  start:{
    blocks:[{ title:"Word story: border", html:"<p><strong><em>Border</em></strong> comes from the Old French <em>bordure</em>, “edge, hem”. It’s related to a ship’s <em>board</em>, its side. A border was first the edge of a cloth or a field, a line you could see. Political borders are edges drawn on maps, and “Borders” asks what happens when a person’s nation doesn’t stop at the line.</p><p class='tiny muted'>Word stories are short histories; see a dictionary’s etymology for more.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Narrator, speaker and perspective", goal:1,
          prompt:"A story about a flood is told twice: once as a weather report, once by a farmer whose barn washed away. What changes most between the two?",
          options:[
            { t:"The perspective: what’s noticed, what matters and how it feels", ok:true, why:"Same event, different teller, different truth." },
            { t:"The facts must contradict each other", why:"Perspective doesn’t mean lying. Both can be accurate and still differ." },
            { t:"Nothing; an event is an event", why:"Who tells it shapes what we learn." },
            { t:"Only the length", why:"Length is the least of it." }],
          hints:["What would each teller notice?", "Rainfall in millimetres vs a lost barn.", "The perspective changes everything."] },
        { id:"w2", skill:"Narrator, speaker and perspective", goal:4,
          prompt:"A short story begins, “My mother and I left before sunrise.” Who is speaking?",
          options:[
            { t:"The narrator, a character the author created", ok:true, why:"Even an “I” in fiction is a narrator, not simply the author." },
            { t:"The author, describing his own trip", why:"Never assume the narrator is the author." },
            { t:"The mother", why:"She’s mentioned; she isn’t speaking." },
            { t:"The reader", why:"The reader listens; the narrator tells." }],
          hints:["Who says “I”?", "A character inside the story.", "The narrator."] },
        { id:"w3", skill:"Inference", goal:3,
          prompt:"A town’s history plaque says: “Founded in 1851 by settlers who cleared the wilderness.” What does the plaque leave out?",
          options:[
            { t:"Anyone who lived on that land before 1851", ok:true, why:"“Wilderness” erases the people already there." },
            { t:"The year", why:"The year is given." },
            { t:"The settlers", why:"They’re named as the founders." },
            { t:"Nothing; plaques are complete", why:"Every record selects." }],
          hints:["What does “wilderness” assume?", "That no one was there.", "The people already living there."] },
        { id:"w4", skill:"Inference", goal:1,
          prompt:"A form has two boxes: ☐ Canadian ☐ American. A traveller writes a third word beside them. What does that act suggest?",
          options:[
            { t:"The traveller doesn’t accept that the two boxes describe who they are", ok:true, why:"Writing outside the boxes questions the boxes." },
            { t:"The traveller can’t read", why:"Choosing a third answer is deliberate." },
            { t:"The form is broken", why:"The form works; it just has no room for the answer." },
            { t:"The traveller is joking", why:"It might be witty, but it’s a real claim." }],
          hints:["What does each box assume?", "That there are only two possibilities.", "The traveller refuses that assumption."] },
        { id:"w5", skill:"Figurative language", goal:4,
          prompt:"“Her people… unheeded lie, / Like the dead husks that rustle through her hands” (Johnson, “The Corn Husker”). What kind of figure is this, and what is compared?",
          options:[
            { t:"A simile comparing her ignored people to dry, discarded husks", ok:true, why:"“Like” signals a simile; people are compared to husks." },
            { t:"A metaphor comparing her hands to corn", why:"“Like” makes it a simile, and the comparison is to her people." },
            { t:"Personification of the corn", why:"The husks don’t act human; people are compared to husks." },
            { t:"Alliteration", why:"Alliteration repeats sounds; this is a comparison." }],
          hints:["Find the comparing word.", "“Like”.", "A simile: people ↔ husks."] },
        { id:"w6", skill:"Perspective and bias in texts", goal:4,
          prompt:"A news headline calls a family at a border crossing “stranded travellers”. Another calls them “protesters”. What does the word choice reveal?",
          options:[
            { t:"Each outlet’s view of what the family is doing: suffering bad luck, or making a point", ok:true, why:"One word frames the whole story." },
            { t:"That one outlet has the facts wrong", why:"Both may be accurate; they frame differently." },
            { t:"Nothing; they’re neutral labels", why:"Labels carry viewpoints." },
            { t:"That the family has two members", why:"The words describe what they’re doing, not how many there are." }],
          hints:["What does “stranded” imply? “Protesters”?", "Accident vs intention.", "The words reveal each outlet’s view."] }
      ],
      refreshers:{
        "Narrator, speaker and perspective":"The narrator (fiction) or speaker (poems) is a created voice. Perspective is the position a telling comes from: who sees, who speaks, what they care about.",
        "Inference":"Ask what a word, a form or a detail assumes, and what it leaves unsaid.",
        "Figurative language":"Similes compare with “like” or “as”. Ask what each side of the comparison brings to the other.",
        "Perspective and bias in texts":"Word choice (“wilderness”, “stranded”, “protesters”) reveals a viewpoint. Bias isn’t only lying; it’s choosing what to call things."
      }
    }
  },
  explore:{
    heading:"Who tells the story?",
    intro:"One event in “Borders” (a mother answers “" + BF + "” at the border) told four ways. Switch between the tellings. Watch who speaks, to whom, with what authority, and what each one leaves out.",
    slots:SLOTS,
    copy:{
      title:"Read in your copy",
      text:"“Borders” is in copyright, so this module quotes only the mother’s one-word answer. The details below describe each passage in our own words. Keep your copy of <i>One Good Story, That One</i> open beside the switcher.",
      pageNote:"Where this module shows <strong>[p.]</strong>, use the page number from your class edition.",
      slotLabel:"Passage", where:"Where in the story"
    },
    imagined:"Imagined: not part of King’s story",
    tellings:TELLINGS, ev:EV,
    modes:[{ id:"tell", t:"Tellings" }, { id:"voice", t:"Listening for the voice" }, { id:"mine", t:"Your reading" }],
    how:{
      tell:"Choose a telling. Tap a detail to select it, then mark it: <strong>only in this telling</strong> or <strong>left out elsewhere</strong>. Fill the Four Questions for each telling; the readout confirms them.",
      voice:"King’s story carries features of oral storytelling. Tap a feature chip under a detail to tag it. Your tags are yours and are never scored; <strong>Show one reading</strong> lays a reading beside them.",
      mine:"Add up to 8 short quotations from your own copy of “Borders” (each up to 200 characters, with a page), and fill the Four Questions for each. Only the structure is checked; what you type stays on this device."
    },
    fq:{
      title:"The Four Questions",
      who:{ q:"Who tells?", opts:[{ id:"son", t:"The son (the narrator)" }, { id:"official", t:"A border official" }, { id:"reporter", t:"A news reporter" }, { id:"mother", t:"The mother herself" }] },
      to:{ q:"To whom?", opts:[{ id:"readers", t:"Readers of the story" }, { id:"record", t:"Other officials; the record" }, { id:"public", t:"The public, watching" }, { id:"present", t:"The people present" }] },
      auth:{ q:"Authority claimed", opts:[{ id:"official", t:"Official" }, { id:"media", t:"Media" }, { id:"witness", t:"Personal witness" }, { id:"self", t:"Self-identification" }] },
      left:{ q:"What’s left out?", how:"Tap details in the <em>other</em> tellings and mark them “left out elsewhere”. They appear in the silence strip." },
      pick:"Choose…"
    },
    marks:{ only:"Only in this telling", away:"Left out elsewhere", clear:"Clear mark", sel:"Selected:", none:"Tap a detail to select it.", onlyTag:"only here", awayTag:"left out elsewhere" },
    compare:"Compare two", second:"Second telling", listen:"Listen", stop:"Stop", noVoice:"No local voice on this device: read the telling aloud yourself, slowly.",
    strip:{ title:"Silence strip", empty:"Nothing yet. Mark details in the other tellings as “left out elsewhere”, and the ones this telling lacks appear here.", lead:"Found in other tellings, missing here:" },
    readout:{ teller:"Teller", listener:"Listener", auth:"Authority claimed", holds:"What the form can hold", sil:"Silences found", only:"Details only this telling has" },
    authNo:"Not this one. Ask <em>why</em> this teller expects to be believed.",
    tc3:{ title:"Silence map: the incident report (challenge 3)", how:"Choose the <strong>two</strong> things the report leaves out that King’s story supplies.",
      opts:[
        { id:"A", t:"why her answer is “" + BF + "”: a nation older than the line" },
        { id:"B", t:"the days in the car between the borders, and the stars story" },
        { id:"C", t:"that they were travelling to Salt Lake City" },
        { id:"D", t:"that entry was refused" },
        { id:"E", t:"that she wouldn’t say “Canadian” or “American”" },
        { id:"F", t:"that they were directed back to Canada" }] },
    voice:{
      lens:"Lens",
      feats:[{ id:"rep", t:"Repetition", role:"syntax" }, { id:"under", t:"Understatement", role:"diction" }, { id:"hum", t:"Humour", role:"sound" }, { id:"story", t:"Story within the story", role:"theme" }, { id:"place", t:"Sense of place", role:"image" }],
      notes:{ rep:"the answer “" + BF + "”, given again and again", under:"the son reports without commenting", hum:"the guards’ polite, useless questions", story:"the mother’s stars story", place:"the parking lot between borders" },
      // one reading (the plan's lens notes), shown beside the student's tags
      key:{ d2a:["hum"], d2b:["under"], d2c:["hum"], d2d:["rep"], d3a:["hum", "rep"], d3b:["rep", "under"], d4a:["place", "under"], d4b:["story"] },
      show:"Show one reading", hide:"Hide the reading", reading:"one reading",
      johnson:{ title:"Comparison card: E. Pauline Johnson (Tekahionwake), “The Two Sisters”", text:SISTERS,
        cite:"Johnson, <i>Legends of Vancouver</i> (1911), “The Two Sisters”, opening sentence", tags:[{ t:"address to the listener", role:"syntax", w:"You can see them" }, { t:"place pointed to", role:"image", w:"the north and the west" }],
        note:"Johnson’s opening speaks straight to a listener and points to a place you could stand and look from: two features of a telling meant to be heard." }
    },
    mine:{ max:8, maxChars:200, quoteL:"Quotation (exact words, up to 200 characters)", pageL:"Page", add:"Add to my reading", del:"Delete",
      leftL:"What’s left out? (a few words)", empty:"No quotations yet. Add your first one above.", full:"You’ve added 8 quotations, the most this list holds.",
      need:"Fill in the quotation and a page number.", done:"✓ All four questions filled", todo:"Fill the Four Questions" },
    p1:{ alt:"“Canadian,” my mother said.", cap:"Imagined: if she had said “Canadian”, the rest of the story would have nowhere to go." },
    p4:{ cap:"“declined to state” (the form) beside “" + BF + "” (her answer)" },
    aha:"<strong>The form</strong> records the facts and misses the meaning: to the form, “" + BF + "” is a refusal to answer; in the son’s telling, it’s the answer. <strong>The news</strong> gets closer, but “isn’t Canadian or American” frames her by what she <em>isn’t</em>. <strong>The son</strong>’s telling is the only one that lets us sit in the car between the borders, and hear the stars story.",
    predIntro:"Make a prediction first. Then the switcher shows you what happens.",
    predictions:[
      { id:"p1", prompt:"If the mother had answered “Canadian”, what would change?",
        options:[{ t:"There would be no story: her refusal of the guards’ categories is the conflict", ok:true }, { t:"Only the length of the trip" }, { t:"The guards would refuse her anyway" }, { t:"Laetitia would come to the border instead" }],
        explain:"She understands the question. Her answer refuses its two choices and names her nation. Everything that follows grows from that one word." },
      { id:"p2", prompt:"The guards keep asking, politely, for her to choose Canadian or American, and she keeps answering “" + BF + "”. What does this repetition do?",
        options:[{ t:"It turns the scene into gentle comedy that exposes how little room the system has for her answer", ok:true }, { t:"It shows the guards are cruel" }, { t:"It means the narrator is bored" }, { t:"It fills space" }],
        explain:"The joke is that nobody is wrong, yet nothing fits. That’s the story’s critique, made with a straight face." },
      { id:"p3", prompt:"The son tells the story. If the mother narrated it instead, what would most likely be lost?",
        options:[{ t:"The understatement: the son reports without explaining, so readers must see the meaning themselves", ok:true }, { t:"The plot" }, { t:"The border" }, { t:"The humour would increase" }],
        explain:"A child’s eye records the absurd without labelling it. The reader does the interpreting, and feels it more." },
      { id:"p4", prompt:"The imagined incident report says she “declined to state” her citizenship. Is that accurate?",
        options:[{ t:"It’s accurate to the form, but it misrepresents her: she did state a citizenship, " + BF + ", that the form has no box for", ok:true }, { t:"Yes, completely" }, { t:"No, it’s a lie" }, { t:"It doesn’t matter" }],
        explain:"Official tellings record what their boxes can hold. Ask what the boxes leave out." }
    ],
    chalIntro:"Use the switcher to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Mark the moment the story’s conflict is born: select that detail in the son’s telling." + SET("tc1"),
        msgs:{ none:"Tap a detail in the son’s telling first.", d2a:"That’s the question. The conflict begins with her answer.", d3b:"That’s the second crossing. Find the first.", x1:"The trip begins there, but the conflict hasn’t started yet.", other:"Not that one. When does the trip stop?" },
        why:"d2b: her first answer, “" + BF + "”, at the American border. One word, and the trip stops.",
        hints:["When does the trip stop?", "At the first border, after one word.", "d2b: “" + BF + "”, at the American crossing."] },
      { id:"tc2", goal:1, prompt:"Match each telling to the authority it claims: set <strong>Authority claimed</strong> in the Four Questions for all four tellings." + SET("tc2"),
        msgs:{ unset:"Set the authority for all four tellings first.", momWit:"She isn’t reporting events; she’s naming who she is.", newsOff:"The news quotes officials, but its authority is the broadcast audience." },
        general:"Not yet. Ask <em>why</em> each teller expects to be believed.",
        why:"The son: personal witness. The incident report: official. The evening news: media. The mother’s own words: self-identification.",
        hints:["Ask <em>why</em> each teller expects to be believed.", "A form, a broadcast, an eyewitness, a person naming her own nation.", "Official · media · witness · self-identification."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Silence map. Which <strong>two</strong> things does the incident report leave out that King’s story supplies? Choose them in the silence map under the tellings." + SET("tc3"),
        msgs:{ few:"Choose two.", rec:"The report records that. Find what it has no room for." },
        general:"Not yet. Find what matters in the story that a form couldn’t hold.",
        banner:"You’ve mapped a silence. The report isn’t false; it just has no box for what matters most. Ask this of every “official” telling you meet.",
        why:"A and B: her reason (a nation older than the line) and the time between the borders, with the stars story.",
        hints:["Read the report. What <em>does</em> it say?", "Now find what matters in the story that a form couldn’t hold.", "Her reason, and the time between."] }
    ]
  },
  part3:{
    slug:"responsibly", name:"Responsibly",
    heading:"Reading responsibly",
    intro:"Reading responsibly is a skill. Work through the stations: each asks you to judge a sentence, a choice or a scenario, then read why.",
    support:SUPPORT,
    s1:{ title:"Station 1: one voice is not every voice", how:"Sort each sentence: does it read the text specifically, or sweep over a whole people?",
      bins:[{ id:"spec", t:"Specific to this text" }, { id:"sweep", t:"Sweeps over a whole people" }],
      items:[
        { id:"a", t:"In “Borders”, the mother’s one-word answer refuses the guards’ two categories.", answer:"spec" },
        { id:"b", t:"Indigenous people always refuse to cooperate with officials.", answer:"sweep", better:"In “Borders”, the mother stays polite with the guards but will not choose between their two categories." },
        { id:"c", t:"In “The Corn Husker”, Johnson ends with a simile that ties the husks in the woman’s hands to her people, “unheeded”.", answer:"spec" },
        { id:"d", t:"Native poems are all about nature.", answer:"sweep", better:"In “The Corn Husker”, Johnson sets the woman’s labour in a clearing at harvest, then turns to her people’s loss of their lands." },
        { id:"e", t:"The son in “Borders” reports the standoff without explaining it.", answer:"spec" },
        { id:"f", t:"Indigenous writers all use humour the way King does.", answer:"sweep", better:"In “Borders”, King uses the guards’ polite, repeated questions to make their two categories look absurd." },
        { id:"g", t:"Johnson’s “The Two Sisters” opens by pointing the listener toward a place: “the north and the west”.", answer:"spec" },
        { id:"h", t:"Every Indigenous family has the same story about borders.", answer:"sweep", better:"In “Borders”, this family’s trip to visit Laetitia becomes a standoff over one word." }],
      good:"Specific: it points to one text and one moment.", sweepOk:"Right: it speaks for a whole people. Rewrite it about this character and this scene. A better version:",
      wrongSpec:"Look again. It names one text and one moment, so it reads specifically.", wrongSweep:M1 + " Rewrite it about this character and this scene. A better version:" },
    s2:{ title:"Station 2: the land before the line",
      // VERIFY: the Kainai (Blood) and Blackfoot Confederacy context before release (plan §6.5).
      card:"<p>The story’s family comes from Standoff, Alberta, on the Kainai (Blood) reserve.</p><p>The Kainai are one of the nations of the Blackfoot Confederacy, whose territory stretches across what is now the Canada–US border.</p>",
      q:"How does knowing that the border was drawn <em>through</em> Blackfoot territory change the meaning of the mother’s answer?",
      chips:[
        { id:"a", t:"Her answer names a nation that existed before the line", best:true, fb:"Yes. The line was drawn through her nation’s territory; her answer is older than the question." },
        { id:"b", t:"Her answer is a joke with no meaning", fb:"The scene is funny, but the answer is a real claim: it names a nation." },
        { id:"c", t:"Her answer shows she is lost", fb:M7 },
        { id:"d", t:"Her answer is about her sister", fb:"Laetitia is why they travel; the answer is about who the mother is." }] },
    s3:{ title:"Station 3: credit the teller",
      // VERIFY: Johnson's biographical details and the credit to Chief Joe Capilano of the Squamish Nation (plan §6.5).
      card:"<p>E. Pauline Johnson (Tekahionwake, 1861–1913) wrote <i>Legends of Vancouver</i> (1911). The book names the teller of its legends: Chief Joe Capilano of the Squamish Nation.</p>",
      q:"Why does naming the teller matter?",
      chips:[
        { id:"a", t:"It honours whose story it is and where it comes from", best:true, fb:"Yes. A story belongs to a teller and a community; naming them keeps that link visible." },
        { id:"b", t:"It makes the book longer", fb:"A name takes a line. What does it tell the reader?" },
        { id:"c", t:"It proves the story is fiction", fb:"Naming a teller says where a story comes from, not whether it’s fiction." },
        { id:"d", t:"It’s only a legal formality", fb:"It’s a matter of respect and accuracy, not just law." }] },
    s4:{ title:"Station 4: appreciation or appropriation?", how:"For each scenario, choose, then read the explanation.",
      opts:[{ id:"ok", t:"Respectful" }, { id:"takes", t:"Takes what isn’t theirs" }],
      items:[
        { id:"a", t:"A class reads several Indigenous authors and studies each author’s Nation and context.", answer:"ok", why:"Reading several writers, each in their own context, is specific and respectful." },
        { id:"b", t:"A student writes a story narrated by a Blackfoot mother at a border.", answer:"takes", why:M5 + " Respond in your own voice instead: write <em>about</em> “Borders”, as yourself." },
        { id:"c", t:"A teacher invites a local Indigenous storyteller, following the community’s protocols and offering an honorarium.", answer:"ok", why:"The storyteller tells their own stories, on the community’s terms, and is paid for their knowledge." },
        { id:"d", t:"A team wears a headdress as a costume for spirit day.", answer:"takes", why:"Some regalia carries sacred meaning and is earned or given, not worn as a costume." },
        { id:"e", t:"A student quotes “Borders”, with full credit, in an essay.", answer:"ok", why:"Quoting with credit, in your own analytical voice, is how readers respond to a text." }] },
    s5:{ title:"Station 5: why schools teach these voices",
      // VERIFY: the TRC facts (final report 2015; 94 Calls to Action; the wording and numbers of the education calls) before release.
      card:"<p>Canada’s Truth and Reconciliation Commission (final report, 2015) issued 94 Calls to Action. Several concern education, including calls to teach about residential schools, Treaties, and Indigenous peoples’ historical and contemporary contributions.</p>",
      q:"How does reading Indigenous writers in their own words differ from reading <em>about</em> Indigenous peoples?",
      label:"Your answer (unscored; it stays on this device)" },
    s6:{ title:"Station 6: who is an author speaking for?",
      card:"<p>Readers sometimes ask how a writer’s own life and background relate to the stories they tell. These questions are worth asking carefully, with your teacher, and are never settled by guessing about any one person.</p><ul><li>What does a reader owe a text, and what does a reader owe its author?</li><li>Who decides who belongs to a community, and who may speak about it?</li><li>How can you write about a story responsibly when questions about its author are open?</li></ul><p class='tiny muted'>Discuss in class. Your teacher will guide the conversation.</p>" },
    quickCheck:{ title:"Reading responsibly quick check", summary:"Reading responsibly quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which sentence reads “Borders” specifically?",
          choices:[{ t:"The mother’s answer refuses the guards’ two categories", ok:true, fb:"Right. It stays with this story and this character." },
            { t:"Indigenous people never follow rules", fb:"Stay with this story and this character." },
            { t:"All Native stories are about borders", fb:"Stay with this story and this character." },
            { t:"The story is about every Indigenous family", fb:"Stay with this story and this character." }] },
        { id:"q2", goal:3, prompt:"Why does the mother’s answer carry weight beyond the scene?",
          choices:[{ t:"It names a nation whose territory the border crosses", ok:true, fb:"Right. The line was drawn through Blackfoot territory." },
            { t:"It shows she misunderstood", fb:"Station 2 explains the land before the line." },
            { t:"It’s only a joke", fb:"Station 2 explains the land before the line." },
            { t:"It’s about the duty-free shop", fb:"Station 2 explains the land before the line." }] },
        { id:"q3", goal:5, prompt:"A student wants to honour King’s story. Which choice is respectful?",
          choices:[{ t:"Write an essay about the story, in the student’s own voice", ok:true, fb:"Right. Respond as yourself, a reader." },
            { t:"Write a sequel narrated as the mother", fb:"Respond as yourself, a reader." },
            { t:"Retell a sacred story found online", fb:"Respond as yourself, a reader." },
            { t:"Invent a Blackfoot legend", fb:"Respond as yourself, a reader." }] },
        // VERIFY: the TRC education calls before release.
        { id:"q4", goal:5, prompt:"The TRC’s Calls to Action (2015) include calls about…",
          choices:[{ t:"Education about residential schools, Treaties and Indigenous contributions", ok:true, fb:"Right. Several calls concern what schools teach." },
            { t:"Building new highways", fb:"Several calls concern what schools teach." },
            { t:"School sports funding", fb:"Several calls concern what schools teach." },
            { t:"Changing the national anthem", fb:"Several calls concern what schools teach." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“Age in her fingers, hunger in her face”</p><p class='eng-cite'>(Johnson, “The Corn Husker”, line 5)</p><p><strong>Pattern:</strong> [noun] in her (his, their) [body part], [noun] in her (his, their) [body part]: a two-part portrait in which each feeling or force is lodged in a part of the body.</p><p><strong>Model imitation:</strong> “Patience in her hands, the whole border in her silence.”</p><p><strong>Your turn:</strong> write one about a person you know. Make it a real person seen closely, never a stereotype or caricature.</p>",
      prompt:"Your imitation" }],
    steal:{ master:"Age in her fingers, hunger in her face", source:"Johnson, “The Corn Husker”", save:"Save it to my Art of Language notebook" }
  },
  practice:{
    activities:[
      { id:"sweep", type:"sorter", title:"Specific or sweeping?", summary:"Specific or sweeping?", goal:[4, 5], noun:"claim", txt:true,
        instruction:"Sort each claim about a text.",
        how:"Tap a claim, then tap the box it belongs in.",
        boxes:[{ id:"close", label:"Reads the text closely" }, { id:"sweep", label:"Sweeps over a whole people" }, { id:"nosup", label:"Not supported by the text" }],
        wrongDefault:"Ask: does it point to a specific text? Does it speak for a whole people? Does the text back it up?",
        items:[
          { id:"i1", t:"“In ‘Borders’, the mother answers ‘" + BF + "’ at both crossings, refusing the guards’ two choices.”", answer:"close", why:"It points to one story and one repeated moment.",
            wrong:{ sweep:"It names one story and one character.", nosup:"She does answer “" + BF + "” at both crossings." },
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Reads the text closely: one story, one repeated moment."] },
          { id:"i2", t:"“Indigenous people are always connected to nature.”", answer:"sweep", why:"It speaks for millions of people and points to no text.",
            wrong:{ close:"There’s no text here: it’s a claim about millions of people. Point to one writer and one passage.", nosup:"It’s worse than unsupported: it speaks for a whole people." },
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Sweeps over a whole people: no text, millions of people."] },
          { id:"i3", t:"“The narrator’s calm, unexplained reporting lets the absurdity of the standoff speak for itself.”", answer:"close", why:"It describes how this narrator tells this story.",
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Reads the text closely: it describes this narrator’s method."] },
          { id:"i4", t:"“The mother in ‘Borders’ hates the guards.”", answer:"nosup", why:"She stays calm and polite; nothing shows hatred.",
            wrong:{ close:"She stays calm and polite; nothing shows hatred.", sweep:"It’s about one character, but the story doesn’t back it up." },
            hints:["Does the claim point to a specific text?", "Does the text back it up?", "Not supported: she stays calm and polite."] },
          { id:"i5", t:"“All Indigenous stories have tricksters.”", answer:"sweep", why:"“All” speaks for every storyteller of many Nations.",
            wrong:{ close:"There’s no text here. Point to one writer and one passage." },
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Sweeps over a whole people: “all” stories, of many Nations."] },
          { id:"i6", t:"“The mother’s story about the stars is a story told inside the story.”", answer:"close", why:"It names one element of this story’s structure.",
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Reads the text closely: a story within the story."] },
          { id:"i7", t:"“The guards in ‘Borders’ break the law by refusing entry.”", answer:"nosup", why:"Nothing in the story shows the guards breaking the law; they apply the rules they have.",
            wrong:{ close:"The guards apply their rules; the story never shows them breaking the law." },
            hints:["Does the claim point to a specific text?", "Does the text back it up?", "Not supported: the guards apply the rules they have."] },
          { id:"i8", t:"“Native writers only write about the past.”", answer:"sweep", why:"It speaks for every Native writer; “Borders” itself is set at a modern border crossing.",
            wrong:{ close:"There’s no text here. Point to one writer and one passage." },
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Sweeps over a whole people: every Native writer."] },
          { id:"i9", t:"“In ‘The Corn Husker’, the speaker blames ‘might’s injustice’ for her people’s loss of land.”", answer:"close", why:"It quotes line 10 of one poem.",
            hints:["Does the claim point to a specific text?", "Does it speak for a whole people?", "Reads the text closely: it quotes line 10."] },
          { id:"i10", t:"“The mother in ‘Borders’ plans to move to the United States for good.”", answer:"nosup", why:"She’s travelling to visit Laetitia.",
            wrong:{ close:"She’s travelling to visit Laetitia." },
            hints:["Does the claim point to a specific text?", "Does the text back it up?", "Not supported: she’s travelling to visit Laetitia."] }
        ] },
      { id:"husker", type:"custom", title:"“The Corn Husker”: an unseen poem", summary:"The Corn Husker", star:true, goal:[1, 3, 4, 6],
        instruction:"Read the poem by E. Pauline Johnson (Tekahionwake). Then answer six questions. R4 to R6 sit above Final Check level.",
        how:"",
        poem:HUSKER, cite:"E. Pauline Johnson (Tekahionwake), “The Corn Husker”, <i>Flint and Feather</i> (1912)",
        period:"This poem was published over a century ago and uses some terms of its time (“Indian lodges”, “race”). When you quote it, quote accurately; when you write about it, use current, specific terms such as “Indigenous”, “First Nations”, or the Nation’s own name.",
        items:[
          { id:"r1", goal:1, prompt:"<strong>R1.</strong> Who sees the woman in the poem?",
            options:[{ t:"An observing speaker, outside her", ok:true, why:"The speaker watches and describes her." },
              { t:"The woman herself", why:"She’s described (“she comes”), not speaking; the speaker watches." },
              { t:"Her people", why:"Her people are remembered in her thoughts; they don’t see her in the poem." },
              { t:"The reader, who is addressed as “you”", why:"The poem never says “you”; an observing speaker describes her." }],
            hints:["Is the woman speaking, or being described?", "“She comes”: third person.", "An observing speaker, outside her."] },
          { id:"r2", goal:3, prompt:"<strong>R2.</strong> Where does the poem turn from the present scene to history?",
            options:[{ t:"Line 9, “And all her thoughts are with the days gone by”", ok:true, why:"“Days gone by” moves from the field into memory." },
              { t:"Line 5, “Age in her fingers, hunger in her face”", why:"Line 5 continues the portrait; line 9 moves into memory." },
              { t:"Line 1, “Hard by the Indian lodges, where the bush”", why:"Line 1 sets the present scene." },
              { t:"Line 12, “Like the dead husks that rustle through her hands”", why:"Line 12 returns to her hands; the turn to memory comes earlier." }],
            hints:["Look for a time phrase.", "“Days gone by”.", "Line 9."] },
          { id:"r3", goal:4, prompt:"<strong>R3.</strong> In the final simile, what is compared to “dead husks”?",
            options:[{ t:"Her people, “unheeded”", ok:true, why:"“Her people… unheeded lie, / Like the dead husks”." },
              { t:"Her hands", why:"The husks rustle <em>through</em> her hands; her people are what they’re compared to." },
              { t:"Her thoughts", why:"Her thoughts are with the days gone by; the simile compares her people." },
              { t:"The fields", why:"The fields are the setting; the simile compares her people." }],
            hints:["Find “Like”.", "What “unheeded lie”?", "Her people."] },
          { id:"r4", goal:3, star:true, prompt:"<strong>R4 ★.</strong> Why might the poem end on the sound of husks “that rustle through her hands”?",
            options:[{ t:"The faint sound makes the ignored people audible, just barely, so the reader hears what the world “unheeds”", ok:true, why:"The ending lets us hear the “unheeded”." },
              { t:"To describe the harvest", why:"That reads the line literally; the simile ties the harvest to a people’s dispossession." },
              { t:"To show that she is tired of her work", why:"The line is about her people, not her mood." },
              { t:"Because husks are the loudest part of corn", why:"A rustle is quiet: easy to ignore, but there." }],
            hints:["What kind of sound is a rustle?", "Quiet, easy to ignore, but there.", "The ending lets us hear the “unheeded”."] },
          { id:"r5", goal:4, star:true, prompt:"<strong>R5 ★.</strong> Which phrase most directly names the cause of loss?",
            options:[{ t:"“might’s injustice” (line 10)", ok:true, why:"Power used unjustly “banished” her people “from their lands”." },
              { t:"“ill-fashioned fields” (line 2)", why:"That describes the fields, not who caused the banishment." },
              { t:"“weight of work and years” (line 6)", why:"That explains her stooped shoulders, not her people’s loss." },
              { t:"“the days gone by” (line 9)", why:"That names the time remembered, not the cause." }],
            hints:["Which phrase says <em>why</em> they lost their lands?", "Look at line 10.", "“might’s injustice”."] },
          { id:"r6", goal:6, star:true, prompt:"<strong>R6 ★ (transfer).</strong> Johnson’s speaker makes the “unheeded” audible; King’s son makes a one-word answer impossible to ignore. What do the two techniques share?",
            options:[{ t:"Both make a quiet, overlooked voice the centre of attention", ok:true, why:"Each text turns attention to what others overlook." },
              { t:"Both are angry", why:"Neither text shouts; both work through restraint." },
              { t:"Both use rhyme", why:"“Borders” is prose; the shared move is about attention, not sound." },
              { t:"Both are told by the author", why:"A speaker and a narrator, created voices, tell them." }],
            hints:["What does each text make us notice?", "Something quiet that others overlook.", "Both centre an overlooked voice, with restraint."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Tomiko", goal:[1, 4, 6],
        instruction:"Tomiko made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        how:"Citations use the class-edition page, shown here as [p.].",
        problems:[
          { id:"e1", goal:4, task:"Analyse the narrator’s perspective in “Borders”.",
            steps:["“Borders” is told by the son, who travels with his mother to visit his sister in Salt Lake City.",
              "King tells us he didn’t understand why his mother wouldn’t just say “Canadian.”",
              "Because the narrator reports without explaining, the reader has to grasp the meaning of “" + BF + "” " + CK + ".",
              "That gap between what he says and what we understand is where the story’s irony lives."],
            answer:1,
            stepFb:["Correct.", "", "Fine; the problem is earlier.", "Good analysis."],
            fixes:[{ t:"“The son never explains his mother’s answer; he simply reports it, leaving readers to understand why she won’t say ‘Canadian.’”", ok:true, why:"The telling belongs to the narrator. " + M3 },
              { t:"“King admits he was confused.”", why:"Author ≠ narrator." },
              { t:"Delete the sentence.", why:"The idea is useful; the attribution is wrong." },
              { t:"Sentence 2 is correct.", why:"King wrote the story; the son narrates it." }],
            hints:["Who is the “I” in the story?", "The son, not King.", "Attribute the telling to the narrator."] },
          { id:"e2", goal:1, task:"Explain how the television crews change the situation.",
            steps:["After days in the parking lot, reporters and cameras arrive at the border.",
              "They film the car, they talk to the mother, they talk to the guards, and then more crews come, and then the story is on television.",
              "Once the private standoff becomes a public story, the guards’ rules suddenly look different to everyone watching.",
              "King shows that who hears a story can change what happens next."],
            answer:1,
            stepFb:["Correct summary, briefly.", "", "This is the analysis that belongs earlier.", "Good."],
            fixes:[{ t:"“The cameras turn a private standoff into a public telling, and a story told to the whole continent puts pressure on the rules that a single guard could ignore.”", ok:true, why:"It says what the cameras <em>do</em> to the story." },
              { t:"Add what the reporters wore.", why:"More summary isn’t analysis." },
              { t:"Delete sentence 3.", why:"Sentence 3 is the strongest." },
              { t:"Sentence 2 is correct.", why:"It retells; it doesn’t analyse. " + M6 }],
            hints:["Is sentence 2 explaining or retelling?", "Retelling.", "Say what the cameras <em>do</em> to the story."] },
          { id:"e3", goal:6, task:"Use a quotation from the first crossing.",
            steps:["The guard’s question assumes there are only two possible answers.",
              "The mother refuses that assumption.",
              "“" + BF + ".”",
              "Her one word names a nation the guard’s two choices cannot hold."],
            answer:2,
            stepFb:["A clear claim.", "Good observation.", "", "Sharp analysis, but the quotation needs integrating."],
            fixes:[{ t:"“When asked her citizenship, she answers with one word, ‘" + BF + "’ " + CK + ".”", ok:true, why:"A signal phrase introduces the word, and the citation follows it." },
              { t:"Remove the quotation marks.", why:"Exact words need them." },
              { t:"Put the citation at the end of the paragraph.", why:"Cite each quotation where it appears." },
              { t:"Sentence 3 is correct.", why:"A dropped quotation has no signal phrase and no citation." }],
            hints:["How is the quotation introduced?", "It isn’t.", "A signal phrase plus " + CK + "."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which telling in Explore surprised you most once you’d heard the others: the son’s, the form’s or the news item’s? What did it make you notice?" },
      { id:"j2", q:"In your own words, explain King’s idea that “the truth about stories is that that’s all we are”, using one moment from “Borders”." },
      { id:"j3", q:"Explain to a friend how to write about “Borders” specifically and respectfully, in two or three practical steps." },
      { id:"j4", q:"Where do you stand as a reader of this story? What do you bring, what might you be missing, and what will you do to read more fully?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line from today that you want to keep, from “Borders”, <i>The Truth About Stories</i> or Johnson. Write one line on why.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one craft principle you’ve earned, in your own words. Add a master’s example: a short quotation from “Borders” (with its page) or a line from Johnson. Then write your own sentence using the principle, in your own voice.",
      placeholder:"e.g. Ask what the official form had no box for.",
      examples:[
        "“" + BF + ".” " + CK,
        "“" + TRUTH + "” " + CT,
        "“Age in her fingers, hunger in her face” (Johnson, line 5)",
        "“Like the dead husks that rustle through her hands.” (Johnson, line 12)",
        "“" + SISTERS + "” (Johnson, “The Two Sisters”)"
      ]
    },
    artSamples:[
      { p:"Let one repeated word do the arguing.", tag:"Rhetoric" },
      { p:"Ask what the official form had no box for.", tag:"Logic" }
    ],
    principleMax:140
  },
  final:{
    intro:"Citations to “Borders” use the class-edition page, shown as [p.].",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which set of questions best analyses the perspective of a telling?",
          options:[{ t:"Who tells it, to whom, with what authority, and what it leaves out", ok:true, why:"The module’s four questions." },
            { t:"When it was printed, how long it is, and what font it uses", why:"Those are features, not perspective." },
            { t:"Whether it is true or false", why:"Accurate tellings still differ in perspective." },
            { t:"What genre it is and how many characters it has", why:"Genre and cast don’t decide perspective." }] },
        b:{ prompt:"A telling’s “authority” refers to…",
          options:[{ t:"the kind of standing the teller claims, such as official, media, witness or self-identification", ok:true, why:"Authority is why a teller expects to be believed." },
            { t:"the author’s legal rights", why:"That’s copyright, not narrative authority." },
            { t:"the number of readers", why:"Popularity isn’t authority." },
            { t:"whether the telling uses formal language", why:"Formality can signal authority but isn’t the same thing." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Who narrates “Borders”?",
          options:[{ t:"The son, who travels with his mother", ok:true, why:"He tells what he sees." },
            { t:"Thomas King, describing his own childhood", why:M3 },
            { t:"The mother", why:"She speaks in the story but doesn’t narrate it." },
            { t:"Laetitia", why:"She’s the sister they travel to visit." }] },
        b:{ prompt:"In “Borders”, where do the mother and son wait while neither border will let them through?",
          options:[{ t:"In their car, in the duty-free store’s parking lot between the two borders", ok:true, why:"They wait between the two crossings." },
            { t:"In Laetitia’s apartment in Salt Lake City", why:"That’s their destination." },
            { t:"At home in Standoff", why:"They can’t go back either." },
            { t:"In a hotel in Montana", why:"They can’t enter the United States." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which storytelling device does King use when the mother answers “" + BF + "” at both crossings?",
          options:[{ t:"Repetition, which builds both comedy and conviction", ok:true, why:"The same answer, again and again." },
            { t:"Flashback", why:"The scene happens in order." },
            { t:"Foreshadowing", why:"It’s the conflict itself, not a hint of it." },
            { t:"Rhyme", why:"There’s no rhyme." }] },
        b:{ prompt:"What is the mother’s story about the stars, told in the car at night, an example of?",
          options:[{ t:"A story within the story", ok:true, why:"A tale told inside the main story." },
            { t:"A flashback to Laetitia’s childhood", why:"It isn’t a memory of Laetitia." },
            { t:"A news report", why:"It’s told privately, to her son." },
            { t:"An epilogue", why:"It happens in the middle of the story." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"A park sign reads: “Heritage Trail, est. 1998.” An Elder tells a class: “My uncles carried canoes on this trail long before I was born.” What best explains the difference?",
          options:[{ t:"The sign dates the trail from when it was officially named; the Elder’s telling carries a much longer history the sign leaves out", ok:true, why:"Each telling has a teller and a purpose." },
            { t:"The Elder is mistaken, because the sign is official", why:"Official doesn’t mean complete." },
            { t:"The sign is lying", why:"It’s accurate about 1998; it simply leaves out the earlier history." },
            { t:"They are about different trails", why:"Nothing suggests that." }] },
        b:{ prompt:"A town brochure says: “Our harbour was discovered in 1785.” A fisher whose family has lived there for generations says, “My great-great-grandmother fished here before any ship came.” What best explains the difference?",
          options:[{ t:"“Discovered” records the newcomers’ arrival; the family’s telling carries an older presence the brochure omits", ok:true, why:"One word decides whose history counts." },
            { t:"The fisher is exaggerating, since brochures are researched", why:M2 },
            { t:"The brochure is false about the ships", why:"The issue is what “discovered” leaves out." },
            { t:"Both mean the same thing", why:"“Discovered” erases those already there." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Passage (written for this module): “My uncle says the government gave us a map of our own land, ‘in case we got lost.’ Everyone laughed. Then nobody said anything for a while.” What does the humour most likely do?",
          options:[{ t:"It exposes the absurdity of outsiders mapping land the family already knows, and the silence that follows shows the pain under the joke", ok:true, why:"The joke and the silence work together." },
            { t:"It shows the family doesn’t take the issue seriously", why:M4 },
            { t:"It proves the uncle got lost", why:"He’s being ironic." },
            { t:"It is unrelated to land", why:"The joke is entirely about land." }] },
        b:{ prompt:"In “Borders”, the guards stay polite and keep asking the same question. Why might King make the scene funny rather than angry?",
          options:[{ t:"The calm comedy shows that the problem is the system’s categories, not a villain, and that is harder to dismiss", ok:true, why:"Nobody is wrong, yet nothing fits." },
            { t:"To show the issue isn’t serious", why:M4 },
            { t:"Because the guards are joking with her", why:"They’re serious; the situation is absurd." },
            { t:"To make the guards the heroes", why:"Nobody is a hero or villain; the categories are the problem." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"What is the most significant silence in the guard’s question “Canadian or American?”",
          options:[{ t:"It has no room for a nation, like the Blackfoot Confederacy, that existed before the border and spans it", ok:true, why:"The two choices leave out her nation." },
            { t:"It doesn’t say which border crossing they’re at", why:"That’s beside the point." },
            { t:"It doesn’t ask about the car", why:"Irrelevant to identity." },
            { t:"It doesn’t mention Salt Lake City", why:"The destination isn’t the issue." }] },
        b:{ prompt:"The imagined news item says the woman “isn’t Canadian or American”. What does that phrasing leave out?",
          options:[{ t:"What she <em>is</em>: a member of the Blackfoot nation, which she named herself", ok:true, why:"It frames her by what she isn’t." },
            { t:"Where the parking lot is", why:"The location isn’t the silence that matters." },
            { t:"That officials commented", why:"It reports that." },
            { t:"That supporters gathered", why:"It reports that, too." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which thesis best analyses “Borders” specifically?",
          options:[{ t:"“In ‘Borders’, King’s son narrates the standoff without commentary, so that the mother’s one-word answer, repeated at both crossings, exposes a border that has no category for her nation.”", ok:true, why:"Specific text, specific technique, specific meaning." },
            { t:"“Indigenous stories are always about land.”", why:M1 },
            { t:"“The story is about a car trip.”", why:"That’s a topic, not a thesis." },
            { t:"“Thomas King is a well-known writer.”", why:"A fact about the author, not an argument about the story." }] },
        b:{ prompt:"Which sentence writes about Johnson responsibly and specifically?",
          options:[{ t:"“Johnson, a Kanienʼkehá꞉ka poet from Six Nations, gives the woman dignity through the turn ‘But rich in…’.”", ok:true, why:"It names her Nation and points to one line." },
            { t:"“Like all Native writers, Johnson…”", why:M1 },
            { t:"“Johnson speaks for every Indigenous woman.”", why:M1 },
            { t:"“Johnson’s poem is a typical Indian legend.”", why:"It isn’t a legend, and “typical” generalizes." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which sentence best integrates and cites the mother’s answer?",
          options:[{ t:"At both crossings, the mother answers the question of citizenship with a single word, “" + BF + "” " + CK + ".", ok:true, why:"A signal phrase, the exact word, then the citation." },
            { t:"“" + BF + ".” This shows her identity.", why:"A dropped quotation." },
            { t:"The mother says " + BF + " " + CK + " which is her identity.", why:"The quotation isn’t marked, and the sentence is unclear." },
            { t:CK + " “" + BF + "” is her answer.", why:"The citation goes after the quotation." }] },
        b:{ prompt:"Which sentence best integrates and cites King’s line from <i>The Truth About Stories</i>?",
          options:[{ t:"King argues that stories make us who we are: “" + TRUTH + "” " + CT2 + ".", ok:true, why:"A signal phrase, the exact words, then the citation." },
            { t:"“" + TRUTH + "” Stories matter.", why:"A dropped quotation." },
            { t:"King says the truth about stories " + CT2 + " is that that’s all we are.", why:"Partly quoted, unmarked, and the citation interrupts." },
            { t:CT2 + " King says stories are all we are.", why:"A misplaced citation on a paraphrase." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"For a culminating project, a student wants to share an Anishinaabe story they read online. Which approach is most responsible?",
          options:[{ t:"Credit the published source and teller, check whether the story is meant to be shared, and write about it in their own voice", ok:true, why:"Credit, permission and your own voice." },
            { t:"Retell it as if they were an Anishinaabe narrator, to show respect", why:M5 },
            { t:"Change details so no one can tell where it came from", why:"That erases the source." },
            { t:"Combine it with stories from other Nations into one “Native legend”", why:M1 }] },
        b:{ prompt:"A club wants a mural honouring a local First Nation. What should come first?",
          options:[{ t:"Talk with the Nation’s representatives and follow their guidance and protocols", ok:true, why:"The Nation decides how it is represented." },
            { t:"Copy symbols found online", why:M5 },
            { t:"Paint a general “Native” design", why:M1 },
            { t:"Ask an art class to invent traditional symbols", why:M5 }] } },
      // VERIFY: the TRC education calls (a version) before release.
      { id:"a2", cat:"A", goal:[5, 4],
        a:{ prompt:"Why did Canada’s Truth and Reconciliation Commission call for changes to what schools teach?",
          options:[{ t:"So students learn about residential schools, Treaties, and Indigenous peoples’ contributions, from accurate sources and Indigenous voices", ok:true, why:"Several calls concern what schools teach." },
            { t:"To replace English classes with history classes", why:"The calls concern content, not replacing subjects." },
            { t:"To teach one shared “Indigenous perspective”", why:M1 },
            { t:"To stop teaching literature", why:"Literature by Indigenous authors is part of the answer." }] },
        b:{ prompt:"Which reading habit best reflects the module’s guidance?",
          options:[{ t:"Attending to the specific text and the specific Nation named, rather than generalizing", ok:true, why:"Specific, not sweeping." },
            { t:"Treating all Indigenous authors as one tradition", why:M1 },
            { t:"Assuming the official record is the true version", why:M2 },
            { t:"Writing in the voice of the author’s community", why:M5 }] } }
    ]
  },
  task:{
    title:"Performance task: A reader’s response, in my own voice", summary:"A reader’s response",
    statement:"<p>Write one analytical paragraph explaining how perspective shapes meaning in “Borders”. Pick your angle: the son’s narration, the guards’ question, the cameras, or the stars story. Write as yourself, a reader.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>",
    checks:["Your claim names the text and its author", "You use the language of perspective", "Your evidence is quoted and cited", "Your analysis follows the evidence",
      "You wrote about this text, not a whole people", "You wrote in your own voice", "Your paragraph is 150–220 words"],
    tips:["Name the title in quotation marks and the author’s surname in your first sentence.",
      "Use a perspective word: who is the narrator? Who is listening? What authority does the guard’s question claim?",
      "Quote exact words, then put the author and page number from your edition in brackets, like this: (King [p.]), with your page in place of [p.].",
      "After the citation, explain how the perspective shapes the meaning: two or three sentences.",
      "That phrase speaks for a whole people. Rewrite it about this author and this text.",
      "Confirm you’ve written as yourself, responding to the text.",
      "Trim or grow to 150–220 words."],
    explainPrompt:"Craft statement: Which perspective did you focus on, and why? Name one choice in your wording that helped you write specifically and respectfully.",
    explainLabel:"Craft statement",
    vocab:"Use the words <em>perspective</em>, <em>narrator</em>, <em>authority</em> and <em>silence</em>.",
    success:"Every part is there.",
    more:"There’s more than one strong reading. Your teacher will read for insight and care; the checklist checked the parts.",
    min:150, max:220,
    persp:["narrator", "speaker", "teller", "perspective", "point of view", "listener", "voice", "audience", "authority"],
    sweep:["all Indigenous", "every Indigenous", "Indigenous people always", "Indigenous people believe", "Native people believe", "all Native", "the Indigenous perspective"],
    focus:[{ id:"son", t:"The son’s narration" }, { id:"guard", t:"The guards’ question" }, { id:"cams", t:"The cameras" }, { id:"stars", t:"The stars story" }],
    labels:{
      setup:"Setup", title:"Title", author:"Author’s surname", focus:"Your angle",
      write:"Write with", build:"Paragraph builder", free:"Free-form",
      claim:"Claim", claimHow:"Name the story and its author, and say how perspective shapes its meaning.",
      ev:"Evidence", evHow:"Introduce the words, quote them exactly, then cite: (King [p.]) with your page.", an:"Analysis", anHow:"How does the perspective shape the meaning? Two or three sentences after the citation.",
      link:"Link", linkHow:"Tie it back to the claim.", opt:"optional", freeL:"Your paragraph (free-form)", freeHow:"Free-form keeps its own text; the builder’s slots stay as they were. Your first sentence counts as your claim.",
      pull:"Use a quotation from Explore, Your reading:", pullBtn:"Add to evidence", pullNone:"No quotations saved in Explore’s “Your reading” yet (optional).",
      self:"I wrote as myself, a reader responding to the text, not in a character’s or a community’s voice.",
      pv:"Your paragraph", words:"words"
    },
    defaults:{ title:"Borders", author:"King" },
    modelsLabel:"Three model responses, three angles",
    modelsNote:"Each model has [p.] where your page number goes.",
    models:[
      { title:"Model A: the son’s narration", text:"In “Borders”, King gives the telling to a son who reports rather than explains, and that choice of narrator is what lets the story’s argument land. When the guard asks for her citizenship, the mother answers “" + BF + "” " + CK + ", and the son simply records it, along with the guard’s polite confusion. He never tells us what his mother means. Because the narrator withholds commentary, the reader has to supply it: we realize that she has understood the question perfectly and refused its two choices. The son’s flat perspective works like a clear window. Nothing in his voice pushes us, so the absurdity of a border with no word for her nation becomes something we see for ourselves, and believe more firmly for having seen it." },
      { title:"Model B: the guard’s question", text:"King’s “Borders” turns a routine question into the centre of the story, and the guard’s perspective is the one the story most carefully exposes. The guard can only offer two answers, Canadian or American, and when the mother replies “" + BF + "” " + CK + ", the exchange stalls. The humour comes from repetition: the question returns, politely, and so does the answer. Neither speaker is a villain; the guard is doing the job, and the mother is telling the truth. The authority of the question, though, rests on categories drawn long after her nation existed. By keeping the tone calm, King shows that the problem is not a rude official but a system whose boxes cannot hold the people it claims to sort." },
      { title:"Model C: the cameras", text:"In “Borders”, the arrival of the reporters changes the audience for the mother’s story, and with it, the story’s power. For days, her answer, “" + BF + "” " + CK + ", has an audience of two guards and a son in a parked car. When the television crews appear, the same answer reaches viewers far beyond the border, and the private standoff becomes a public telling. The narrator doesn’t comment on this shift; he notices the cameras and the people gathering, and lets us draw the conclusion. King’s choice suggests that who listens to a story can matter as much as who tells it. The rules have not changed, but once the story is told widely, the guards’ certainty looks different. As King writes elsewhere, the truth about stories is that that’s all we are." }
    ],
    rubric:RUBROWS
  },
  cards:[
    ["Perspective", "The position a telling comes from: who sees, who speaks, what matters to them."],
    ["The four questions", "Who tells it? To whom? With what authority? What’s left out?"],
    ["Authority", "The standing a teller claims: official, media, personal witness, self-identification."],
    ["Silence", "What a telling leaves out. A form with two boxes leaves out a nation older than the border."],
    ["Narrator ≠ author", "“The son reports…”, not “King says…”."],
    ["Understatement", "Saying less than the moment holds, so the reader feels more. The son reports the standoff without comment."],
    ["Repetition", "Saying it again: “" + BF + ",” at both crossings, builds comedy and conviction."],
    ["Story within a story", "A tale told inside the main story: the mother’s story about the stars, told between the borders."],
    ["“The truth about stories…”", "“…is that that’s all we are” (King, <i>The Truth About Stories</i>)."],
    ["Specific, not sweeping", "Write about <em>this</em> author and <em>this</em> text, never “Indigenous people always…”."],
    ["Appreciation vs appropriation", "Respond in your own voice; don’t take a community’s voice, stories or regalia as your own."],
    // VERIFY: TRC facts before release.
    ["TRC Calls to Action (2015)", "94 calls; several ask schools to teach about residential schools, Treaties and Indigenous contributions."]
  ],
  misc:{ M1, M2, M3, M4, M5, M6, M7 }
};
