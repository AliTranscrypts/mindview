// ENG4U 14 Alice Munro & the Canadian Short Story. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/14-munro-short-story.md
// Texts:
//  Munro, "Boys and Girls" (Dance of the Happy Shades, 1968) is in copyright. Only the four short quotations the plan prints are
//    used, exactly as given (fair dealing, course plan §3): the opening sentence, the reflection on the word "girl", the phrase
//    "what I had to become", and the father's "She’s only a girl". Nothing else from the story is reproduced; the moment cards
//    and activity items are the plan's paraphrases. Typographic quotes and apostrophes only.
//  Leacock, Sunshine Sketches of a Little Town (1912), ch. 1 "The Hostelry of Mr. Smith", opening two sentences: checked
//    against Project Gutenberg (see LEACOCK below).
//  "The Fair Ribbon" and the unseen Final Check passages are written for the module (the plan's wording).
// VERIFY: teacher note (plan §6.3, not shown to students). In July 2024 Munro's daughter, Andrea Robin Skinner, published an
//   account in the Toronto Star of being sexually abused as a child by Munro's husband, Gerald Fremlin, and said Munro stayed with
//   him after learning of it; Fremlin pleaded guilty to indecent assault in 2005. Some schools have reconsidered teaching Munro.
//   Whether to teach the story, and how to frame it, is the teacher's choice. Any "art and artist" discussion is in class only.
// VERIFY: alternative-author path (plan §6.4): to swap in another Canadian story, replace READING, the ten moment cards (MOMENTS),
//   the quotations (Q), and the story-specific items (K1, K2 A, T3, C1, C2, P1–P4, TC1–TC3, Activities 1 and 3).

// EXCERPT SLOT: page numbers. Replace each "[p.]" with the page in the class edition (plan §5 "Excerpt and page handling").
// Every citation of the story in the module is built from this table.
const PG = { open:"[p.]", girl:"[p.]", only:"[p.]" };
const CM = (k) => "(Munro " + PG[k] + ")";
const PG_OPEN = Object.keys(PG).some(k => PG[k] === "[p.]");
// The four quotations (plan §6.1); exact wording as the plan prints it.
// VERIFY: all four against the class edition before release (plan §5).
const Q = {
  open:"My father was a fox farmer.",
  girl:"A girl was not, as I had supposed, simply what I was; it was what I had to become.",
  become:"what I had to become",
  only:"She’s only a girl"
};
// Leacock, Sunshine Sketches of a Little Town (1912), ch. 1, "The Hostelry of Mr. Smith", sentences 1–2 (public domain).
// Checked word for word against Project Gutenberg ebook #3533 (plain text, read from the PGLAF mirror aleph.pglaf.org on
//   2026-11-26 while gutenberg.org was down for maintenance): exact match; only the apostrophe is typographic here.
const LEACOCK = "I don’t know whether you know Mariposa. If not, it is of no consequence, for if you know Canada at all, you are probably well acquainted with a dozen towns just like it.";
const LEACOCK_CITE = "Stephen Leacock, <i>Sunshine Sketches of a Little Town</i> (1912), chapter 1";

// EXCERPT SLOT: the Reading room (plan §4 Explore, E1). Paste the full story from the class edition here as paragraphs,
//   one object per paragraph, with the class-edition page it starts on: { pg:"112", t:"…" }. While the list is empty, the
//   module shows a "Read in your copy" card instead. Modules holding the full story are shared only with enrolled students
//   through the school's learning platform (course plan §3).
// EXCERPT SLOT: the class edition for the credit line and Works Cited entry: publisher, year and page range.
const READING = { paras:[], edition:{ publisher:"", year:"", range:"" } };
// EXCERPT SLOT: the night stories (TC3). Paste the early and the later night-story passages from the class edition:
//   { pg:"…", t:"…" } objects. While empty, TC3 shows a "Read in your copy" card.
const NIGHT = { early:[], later:[] };

// misconception core sentences (plan §3)
const M1 = "The narrator is a character the author built. Say “the narrator recalls…”, not “Munro says…”.";
const M2 = "The page and the calendar can disagree. Put events back in time order to see the writer’s choice.";
const M3 = "Listen for the older self explaining what the girl couldn’t know yet.";
const M4 = "That tells what happens. Analysis says how a choice makes meaning, and why it matters.";
const M5 = "Ask why this detail is here. A cellar where foxes are skinned is not just a cellar.";
const M6 = "An open ending is built. It leaves a question with the reader on purpose.";
const M7 = "Introduce the words, cite them, then explain what they do.";
const M8 = "That’s a character speaking. The story shows the verdict, and how the girl takes it in; it leaves you to judge it.";
const SET = (m) => " <button type='button' class='btn ghost sm mu-setup' data-setup='" + m + "'>Set it up</button>";

// The moment cards (plan §4 Explore; paraphrases written for the module, not quotations). Listed in telling order.
// time: H habit · S a stretch of time · E event.  world: F father's · M mother's · G between (the gate) · O her own.
// ten: the fixed tension value (0–5) for the E9 tension line: it rises at m7 and peaks at m8 (plan "What updates live").
// VERIFY: m5 (the feed salesman's visit and the "hired man" introduction), and the place of m6 (the grandmother's visit) in the
//   telling order, against the class edition (plan §6.2). m6 is not used in any exact test.
const MOMENTS = [
  { id:"m1", t:"The pelting season: her father and the hired man, Henry Bailey, skin the foxes in the cellar", short:"Pelting season", time:"H", world:"F", wl:"Father’s", ten:1 },
  { id:"m2", t:"Night after night, once Laird is asleep, she tells herself stories in which she is the hero", short:"Night stories", time:"H", world:"O", wl:"Neither (her own)", ten:1 },
  { id:"m3", t:"She works outside with her father, carrying water to the foxes", short:"Water for the foxes", time:"H", world:"F", wl:"Father’s", ten:1 },
  { id:"m4", t:"Her mother needs her in the hot kitchen, putting up preserves", short:"Preserves", time:"H", world:"M", wl:"Mother’s", ten:1.5 },
  { id:"m5", t:"Her father introduces her to a feed salesman as his new hired man, and she glows with pride", short:"“Hired man”", time:"E", world:"F", wl:"Father’s", ten:1.5 },
  { id:"m6", t:"Her grandmother’s visit and her rules about how girls behave", short:"Grandmother’s rules", time:"S", world:"M", wl:"Mother’s", ten:2 },
  { id:"m7", t:"Mack is shot behind the barn, and she and Laird watch in secret", short:"Mack is shot", time:"E", world:"F", wl:"Father’s", ten:4 },
  { id:"m8", t:"Flora breaks loose, and the narrator opens the gate instead of shutting it", short:"The gate", time:"E", world:"G", wl:"Between", ten:5 },
  { id:"m9", t:"Laird tells at supper what she did", short:"Laird tells", time:"E", world:"M", wl:"Mother’s (the family table)", table:true, ten:3.5 },
  { id:"m10", t:"Her father’s verdict, “She’s only a girl”, and her silence", short:"The verdict", time:"E", world:"M", wl:"Mother’s (the family table)", table:true, ten:3 }
];

const RUBROWS = [
  ["Knowledge/Understanding (accuracy about time, voice and events)", "Confuses habit and event, or the narrator with the author", "Some accurate mapping", "Accurate map and terms", "Precise, nuanced use of terms"],
  ["Thinking (insight of the argument)", "Retells", "A simple claim with limited explanation", "A clear arguable claim explained with evidence", "An insightful claim; analysis reveals subtle effects (e.g. the double work of “only”)"],
  ["Communication (integration, organization, style)", "Quotations dropped; unclear", "Some integration", "Smooth integration and a logical flow", "Graceful, precise prose; the quotations are woven in"],
  ["Application (use of the story)", "Little use of the text", "Some use", "Apt evidence from across the story", "Evidence chosen with real discernment"]
];
const RUB = "<details class='alg mu-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Category</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  RUBROWS.map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div></details>";

// "The Fair Ribbon" (Activity 2; written for the module, plan wording)
const RIBBON = [
  "The ribbon is still in my jewellery box, though it has faded from blue to the colour of a vein. Second prize, Huron County Fall Fair, Junior Preserves.",
  "That September my grandmother let me make the strawberry jam alone. She sat at the table with her tea going cold and watched my hands, not my face.",
  "I won’t pretend I understood her silence. I was eleven, and silence was what adults did instead of praising you.",
  "At the fair a judge with a pencil behind his ear lifted my jar to the window. Behind me, my grandmother said to no one, “She didn’t need me at all.”",
  "She died that winter. I have made the jam every year since, and every year I set out two cups, and every year I let one go cold."
];

export default {
  id:"14-munro-short-story",
  kind:"topic",
  title:"Alice Munro and the Canadian short story",
  topic:"Alice Munro & the Canadian Short Story",
  readyTopic:"Alice Munro’s “Boys and Girls”",
  hero:{
    headline:"One sentence, and a whole world. Whose world is it?",
    text:"Canadian writers have made the <strong>short story</strong> one of the country’s great art forms, and Alice Munro, who won the Nobel Prize in 2013, is one of its masters. “Boys and Girls” is told by a woman looking back on the year she learned what being a girl on her father’s fox farm would mean. In this module you’ll learn three of the form’s most powerful moves: the shift from <strong>habit</strong> to <strong>event</strong>, the <strong>two voices</strong> of a narrator looking back, and the <strong>ordinary detail</strong> that carries dread.",
    fig:{ html:"<div class='mu-hero' id='mu-hero'></div>", caption:"" },
    line:Q.open, cite:CM("open"), lit:"father",
    question:"Notice who isn’t in the first sentence.",
    caption:"The narrator begins with her father’s work, not with herself.",
    aria:"The sentence “My father was a fox farmer.” lights up word by word, and “father” stays lit a beat longer. Beneath it, a line drawing of a farm builds: a row of fox pens, a barn, a field, and a kitchen window with steam on it. A second line reads: “Notice who isn’t in the first sentence.”",
    listen:"Listen", watch:"Watch again", noVoice:"Read it aloud yourself, and let “father” land."
  },
  goals:[
    "I can tell habit time from single events, and story order from telling order, and map both in “Boys and Girls”.",
    "I can hear the two voices of a retrospective narrator and explain what the older voice adds.",
    "I can explain how the story’s turn (the gate) and its ending (the supper verdict) change how earlier moments read.",
    "I can read ordinary details as charged with meaning (the “Southern Ontario Gothic” lens), with evidence.",
    "I can place a story in the Canadian short-story tradition and compare narrative stances.",
    "I can write an analytical paragraph that argues how a structural choice creates meaning, with integrated, cited quotations."
  ],
  start:{
    blocks:[{ title:"Word story: girl", html:"<p><strong><em>Girl</em></strong> once meant any child. In Middle English, <em>gyrle</em> or <em>gurle</em> named a young person of either sex; a boy could be a “knave girl”. Only later did the word narrow to mean a female child. The narrator of “Boys and Girls” discovers a narrowing of her own: the word she thought simply described her turns out to carry a list of rules.</p><p class='tiny muted'>Word stories are short histories; see a dictionary’s etymology for more.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Narrator and point of view", goal:2,
          prompt:"“I believed her, because I was twelve.” Which point of view is this?",
          options:[
            { t:"First person, looking back on the past", ok:true, why:"“I” tells the story, and “was twelve” shows the speaker is older now." },
            { t:"Third person limited", why:"The narrator says “I”, which is first person." },
            { t:"Second person", why:"Second person addresses “you”." },
            { t:"Third person omniscient", why:"An omniscient narrator is outside the story and isn’t “I”." }],
          hints:["Look at the pronouns.", "“I” is the narrator.", "First person, recalling the past."] },
        { id:"w2", skill:"Narrator and point of view", goal:2,
          prompt:"A story’s narrator says, “I was a coward that summer.” Which statement is most accurate?",
          options:[
            { t:"The narrator, a character, judges her younger self", ok:true, why:"The “I” is a character the author created." },
            { t:"The author admits she was a coward", why:"Narrator ≠ author, even in first person." },
            { t:"The narrator is lying, so the story is unreliable", why:"Nothing here shows a lie; it’s self-judgement." },
            { t:"The sentence is dialogue", why:"There are no quotation marks; it’s narration." }],
          hints:["Who is “I”?", "A character inside the story.", "The narrator judging her past self."] },
        { id:"w3", skill:"Plot and time", goal:1,
          prompt:"“Every Saturday we would walk to the store for licorice.” What kind of time is this sentence describing?",
          options:[
            { t:"A habit: something that happened again and again", ok:true, why:"“Every Saturday” and “would” mark repeated time." },
            { t:"A single event on one Saturday", why:"Which words say it happened many times?" },
            { t:"A flashback to one moment", why:"A flashback jumps to a particular past moment; this summarizes many." },
            { t:"A flash-forward", why:"Nothing here jumps ahead." }],
          hints:["Find the time words.", "“Every” and “would”.", "Repeated time: a habit."] },
        { id:"w4", skill:"Plot and time", goal:3,
          prompt:"Why might a writer describe many ordinary days before telling one dramatic event?",
          options:[
            { t:"So the reader feels the pattern that the event will break", ok:true, why:"Habit builds a world; the event cracks it." },
            { t:"Because the writer couldn’t decide where to start", why:"Order in published stories is chosen." },
            { t:"To make the story longer", why:"Length isn’t a purpose." },
            { t:"Because stories must begin with description", why:"Many stories begin in the middle of action." }],
          hints:["What does the reader learn from the ordinary days?", "What “normal” looks like.", "So the event can break it."] },
        { id:"w5", skill:"Inference from detail", goal:4,
          prompt:"“She folded the letter into a very small square and put it in the cutlery drawer, under the good knives.” What can you best infer?",
          options:[
            { t:"She wants the letter hidden and kept, but not looked at", ok:true, why:"Folding small and hiding it under rarely used knives suggests concealment." },
            { t:"She has finished with the letter and will throw it away", why:"She stores it carefully." },
            { t:"She is preparing to cook", why:"The knives are a hiding place, not a recipe." },
            { t:"The letter is about knives", why:"Where she puts it says how she feels, not what it says." }],
          hints:["Why fold it so small?", "Why under the good knives (rarely used)?", "Hidden but kept."] },
        { id:"w6", skill:"Quotation and citation", goal:6,
          prompt:"Which sentence correctly integrates and cites a quotation from page 112 of a story collection, in MLA style?",
          options:[
            { t:"The aunt’s flat reply, “A rest. Is that what we’re calling it” (Ross 112), judges her sister without a word of argument.", ok:true, why:"A signal, the exact words, the author and page, then analysis." },
            { t:"“A rest. Is that what we’re calling it.” This shows the aunt is angry.", why:"That’s a dropped quotation with no citation. Introduce, cite, then analyse." },
            { t:"The aunt asks whether a rest is what they’re calling it (112).", why:"That’s a paraphrase; it still needs the author’s name, or a signal phrase that names her." },
            { t:"The aunt’s reply (Ross 112) “A rest. Is that what we’re calling it” is bitter.", why:"The citation goes after the quotation." }],
          hints:["Is there a signal phrase?", "Where does the citation go?", "“The aunt’s flat reply, ‘A rest. Is that what we’re calling it’ (Ross 112), judges her sister…”: the words, then (Author page), then the point."] }
      ],
      refreshers:{
        "Narrator and point of view":"The narrator is the voice telling the story. In first person (“I”), the narrator is a character, never simply the author. A narrator who looks back is <em>retrospective</em>.",
        "Plot and time":"Habit time tells what used to happen (“we would…”, “every winter”). Event time tells what happened once (“that afternoon”). Story order is when things happened; telling order is when the story tells them.",
        "Inference from detail":"Ask what a detail suggests beyond its literal meaning. Where and how something is done often reveals feeling.",
        "Quotation and citation":"Introduce the quotation, keep the exact words in quotation marks, cite the author and page, then explain."
      }
    }
  },
  explore:{
    heading:"Time-shift mapper",
    intro:"Read “Boys and Girls” in the Reading room, or reread it in your own copy. Then map how the story spends its time, whose voice is speaking, and which of the farm’s two worlds the narrator stands in.",
    contentNote:"This story includes the killing of farm animals for fur and meat.",
    reading:{
      title:"The Reading room",
      paras:READING.paras, edition:READING.edition,
      copyTitle:"Read in your copy",
      copy:"Read “Boys and Girls” in your class copy of <i>Dance of the Happy Shades</i> (1968), or reread it there. The story is in copyright, so this module quotes only four short lines from it; everything else here is described in our own words. Keep your copy open beside the mapper.",
      pageNote:"Where this module shows <strong>[p.]</strong>, use the page number from your class edition.",
      pagesFound:"Find these lines in your copy and note their pages (they stay on this device):",
      lines:[{ k:"open", t:Q.open }, { k:"girl", t:Q.girl }, { k:"only", t:Q.only }],
      edTitle:"Your Works Cited entry (MLA 9)",
      edHow:"Fill in your class edition’s details from its title page and copyright page. The entry builds itself.",
      edFields:[{ k:"publisher", t:"Publisher", ph:"e.g. Penguin Canada" }, { k:"year", t:"Year of your edition", ph:"e.g. 2005" }, { k:"range", t:"Pages of the story", ph:"e.g. 111–127" }],
      credit:"Munro, Alice. “Boys and Girls.” <i>Dance of the Happy Shades</i>, {publisher}, {year}, pp. {range}.",
      creditBlank:{ publisher:"[publisher of the class edition]", year:"[year]", range:"[range]" },
      tagsTitle:"Tag the text",
      saveLine:"Save the selected words to my commonplace book"
    },
    pageNote:PG_OPEN,
    cite:{ open:CM("open"), girl:CM("girl"), only:CM("only") },
    q:Q,
    moments:MOMENTS,
    lanes:[{ id:"H", t:"Habit (what used to happen)", short:"Habit" }, { id:"S", t:"A stretch of time", short:"Stretch" }, { id:"E", t:"Event (what happened once)", short:"Event" }],
    worlds:[{ id:"F", t:"Father’s world", sub:"the barn, the fox pens, the field", short:"Father’s" }, { id:"G", t:"The gate", sub:"between the barnyard and the field", short:"between" },
      { id:"M", t:"Mother’s world", sub:"the house and the kitchen", short:"Mother’s" }, { id:"O", t:"Her own", sub:"her bed at night, upstairs", short:"her own" }],
    modes:[{ id:"time", t:"Habit and event" }, { id:"voice", t:"Two voices" }, { id:"worlds", t:"Two worlds" }, { id:"map", t:"Your map" }],
    how:{
      time:"Tap a moment card, then tap a lane. Arrow keys (↑/↓) move the selected card between lanes. <strong>Read the shape</strong> lays the cards out in telling order.",
      voice:"The lens colours the spans you mark: <strong>child, in the moment</strong> or <strong>adult, looking back</strong>. Tap words (Shift + tap or Shift + arrows for a run), then choose a tag. Your marks are yours and are never scored.",
      worlds:"Tap a moment card, then tap the part of the farm where it belongs. The narrator line joins the cards in telling order.",
      map:"For the performance task: add 5 to 10 short quotations from your copy of the story, each with its page and three tags. The map builds itself. What you type stays on this device."
    },
    labels:{
      strip:"How the story spends its time", tray:"Moment cards not yet placed", allPlaced:"All ten cards are placed.",
      shape:"Read the shape", unshape:"Back to the lanes", tellingOrder:"Telling order", turnHow:"Tap the card where the story turns (challenge 2).",
      moveTo:"Move to lane", takeOff:"Take it off", selected:"Selected", tension:"Tension",
      laneLine:"Lane line", narrLine:"Narrator line", tone:"Tone", farm:"The farm"
    },
    voice:{
      lens:"Voice lens", lensOn:"on", lensOff:"off",
      tags:[{ id:"child", t:"Child, in the moment", role:"image", tag:"child" }, { id:"adult", t:"Adult, looking back", role:"theme", tag:"adult" },
        { id:"habit", t:"Habit", role:"syntax", tag:"habit" }, { id:"event", t:"Event", role:"syntax", tag:"event" },
        { id:"father", t:"Father’s world", role:"diction", tag:"father’s world" }, { id:"mother", t:"Mother’s world", role:"diction", tag:"mother’s world" }],
      preTitle:"The adult’s voice, pre-marked",
      quotesTitle:"The module’s other lines from the story",
      ownTitle:"Lines from your copy",
      ownHow:"Type or paste a line from your copy of the story (up to 300 characters), then mark it. It stays on this device.",
      ownAdd:"Add the line", ownPage:"Page", remove:"Remove", clearMark:"Remove marks on the selected words",
      p3cap:"This sentence needs an older self. A child in the moment couldn’t say it."
    },
    night:{
      title:"The night stories (challenge 3)",
      copy:"Reread the stories the narrator tells herself at night in your copy: the early ones, and the later ones. The details below are paraphrased.",
      slots:NIGHT,
      cards:[
        { id:"s1", t:"Stories in which she is brave and active: rescuing people, facing danger, admired for what she does" },
        { id:"s2", t:"Stories that dwell on how she looks, and in which she is the one who is rescued or noticed" }],
      chips:[
        { id:"c1", t:"She is taking in what she has been told a girl must become" },
        { id:"c2", t:"She is getting bored of adventure stories" },
        { id:"c3", t:"Laird has started telling the stories" },
        { id:"c4", t:"She has stopped telling herself stories" }],
      orderL:"Put the two kinds in order (first at the top)", chipL:"What the change shows", up:"Move up", down:"Move down"
    },
    map:{ max:10, maxChars:200,
      quoteL:"Quotation (exact words, up to 200 characters)", pageL:"Page", add:"Add to my map", save:"Save changes", cancel:"Cancel", edit:"Edit", del:"Delete",
      timeL:"Time", worldL:"World", voiceL:"Voice",
      times:[{ id:"H", t:"Habit" }, { id:"E", t:"Event" }],
      worlds:[{ id:"F", t:"Father’s" }, { id:"M", t:"Mother’s" }, { id:"G", t:"Between" }],
      voices:[{ id:"child", t:"Child" }, { id:"adult", t:"Adult" }],
      empty:"Your map is empty. Add your first quotation above.", full:"Your map has 10 moments, the most it can hold.",
      need:"Fill in the quotation, the page and all three tags.", built:"Your map"
    },
    readout:{ counts:"Habit cards / event cards", breaks:"Where the pattern breaks", turn:"The turn", path:"Narrator’s path", adult:"Adult-voice spans marked" },
    aha:"The story builds a world out of habits (the farm year she loves) and then lets two single events break it. The narrator’s path runs from her father’s world, through the gate, to the family table, where the word <em>girl</em> is spoken over her.",
    p1:{ before:"forgiving and dismissing", after:"neutral", with:"She’s only a girl.", without:"She’s a girl." },
    p4:{ caption:"She has seen what the gun does." },
    predIntro:"Make a prediction first. Then the mapper shows you what happens.",
    predictions:[
      { id:"p1", prompt:"Her father says, “She’s only a girl.” If we delete “only”, what changes?",
        options:[{ t:"It becomes a plain fact, not a verdict: the excuse and the dismissal disappear", ok:true }, { t:"Nothing; “only” is filler" }, { t:"It becomes a compliment" }, { t:"It becomes a question" }],
        explain:"“Only” does two jobs at once. It excuses her (she can’t be expected to understand men’s work) and it shrinks her (so she won’t be taken seriously). It’s the father’s word, not the story’s verdict." },
      { id:"p2", prompt:"Suppose the story ended at the gate, with Flora running into the field. What would the reader lose most?",
        options:[{ t:"The family’s verdict on what she did, and her silent acceptance of it", ok:true }, { t:"The setting on the farm" }, { t:"The names of the horses" }, { t:"Nothing; the gate is the climax" }],
        explain:"The gate is the turn, but the supper is where the turn is given a meaning by others. Without it, we’d never see how she takes in the word “girl”." },
      { id:"p3", prompt:"What if the whole story were told by a narrator who knows only what the girl knows at the time?",
        options:[{ t:"The adult’s understanding disappears, including the reflection on what “girl” would come to mean", ok:true }, { t:"The plot would change" }, { t:"Laird would become the narrator" }, { t:"The story would be in second person" }],
        explain:"Retrospection is what lets the story understand itself. Remove the older voice and the girl’s year becomes a set of events with no reckoning." },
      { id:"p4", prompt:"Move Mack’s shooting (m7) to after Flora’s escape (m8). Which moment loses the most force?",
        options:[{ t:"The gate: she would no longer know exactly what was waiting for Flora", ok:true }, { t:"The pelting season" }, { t:"The bedtime stories" }, { t:"The salesman’s visit" }],
        explain:"Because she watched Mack die, opening the gate is not a whim. The earlier event loads the later one." }
    ],
    chalIntro:"Use the mapper to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Sort the eight cards m1–m5 and m7–m9 into <strong>Habit</strong> and <strong>Event</strong>." + SET("time"),
        msgs:{
          unplaced:"Place all eight cards first: m1 to m5 and m7 to m9. (m6 and m10 aren’t part of this challenge.)",
          m1:"The pelting happens every fall and winter. It’s a season, not a single night.",
          m5:"The salesman’s visit happens once; it’s the pride she remembers.",
          m2:"The stories happen “night after night”. Repeated time.",
          stretch:"This challenge uses only two lanes. Move {ids} to Habit or Event."
        },
        general:"Some cards are in the wrong lane. Ask: did this happen again and again, or once?",
        why:"Habits: m1 to m4. Events: m5, m7, m8 and m9. The farm year is told as habit; single days break into it.",
        hints:["Ask: did this happen again and again, or once?", "Seasons, chores and nightly routines are habits.", "Habits: m1–m4. Events: m5, m7, m8, m9."] },
      { id:"tc2", goal:3, prompt:"Tap the card where the story <strong>turns</strong>: the moment after which nothing can go back to how it was." + SET("time"),
        msgs:{
          none:"Tap a card in the telling-order strip under the tension line first.",
          m7:"Mack’s death prepares the turn, but the narrator only watches. Where does she <em>act</em>?",
          m10:"The verdict is the consequence. It gives the turn a meaning; it isn’t the turn itself.",
          m9:"Laird’s telling reveals the turn; it happens because of it."
        },
        general:"Not that one. Where does the narrator do something she can’t undo?",
        why:"m8: she opens the gate instead of shutting it. After that, nothing can go back to how it was.",
        hints:["Where does the narrator do something she can’t undo?", "It involves Flora.", "m8: she opens the gate instead of shutting it."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"The narrator’s night stories change as the story goes on. Put the two kinds in order, then choose what the change shows." + SET("voice"),
        msgs:{
          order:"Check the story again: the heroic stories come first, in the early winters.",
          c2:"Look at what replaces them, and at what the adults around her keep telling her about girls.",
          c3:"The stories are hers, told to herself after Laird falls asleep.",
          none:"Choose what the change shows."
        },
        general:"Not yet. What does she do in the early stories? What happens to her in the later ones?",
        why:"You’ve found something the narrator never says outright. The change in her private stories shows the change in her before she can name it. That’s how Munro trusts her readers.",
        hints:["What does she do in the early stories? What happens to her in the later ones?", "Set the change beside the grandmother’s rules and the reflection on the word “girl”.", "s1 then s2. The change shows her absorbing the role she’s been handed."] }
    ]
  },
  part3:{
    slug:"tradition", name:"Tradition",
    heading:"The short story in Canada",
    intro:"Where does “Boys and Girls” sit among Canadian stories? Browse a shelf of story collections, compare two famous openings, and try a critic’s lens on the farm.",
    s1:{ title:"Station 1: the shelf", how:"Tap a spine to read about the writer’s stance.",
      books:[
        { id:"leacock", au:"Stephen Leacock", t:"<i>Sunshine Sketches of a Little Town</i>", yr:"1912", stance:"A genial chronicler who teases the town he loves." },
        // VERIFY: the stance sentences for Ross, Laurence, MacLeod, Gallant and King (written for the module; the plan gives only titles and dates).
        { id:"ross", au:"Sinclair Ross", t:"<i>The Lamp at Noon and Other Stories</i>", yr:"1968", stance:"A spare, close observer of prairie farm families held in place by drought, wind and silence." },
        { id:"munro", au:"Alice Munro", t:"<i>Dance of the Happy Shades</i>", yr:"1968", stance:"Retrospective narrators look back on rural and small-town Ontario lives, finding the dread under ordinary days.",
          note:"Governor General’s Award. It contains “Boys and Girls”. Later collections include <i>Dear Life</i> (2012). Munro received the Nobel Prize in Literature in 2013." },
        { id:"laurence", au:"Margaret Laurence", t:"<i>A Bird in the House</i>", yr:"1970", stance:"A grown woman looks back on her childhood in a small Manitoba town, hearing what the girl could not." },
        { id:"macleod", au:"Alistair MacLeod", t:"<i>The Lost Salt Gift of Blood</i>", yr:"1976", stance:"Elegiac first-person stories of Cape Breton families, hard work and leaving home." },
        { id:"gallant", au:"Mavis Gallant", t:"<i>Home Truths</i>", yr:"1981", stance:"A cool, ironic observer of Canadians at home and abroad." },
        { id:"king", au:"Thomas King", t:"<i>One Good Story, That One</i>", yr:"1993", stance:"A storyteller’s voice that talks to the listener, with humour and trickster play." },
        { id:"yours", au:"Chosen by your teacher", t:"<i>A story your class reads</i>", yr:"", stance:"Your teacher may add a story here. Ask: who tells it, and where does it put you?" }],
      // VERIFY: the magazines and CBC Radio note (e.g. Robert Weaver's CBC programme Anthology) before release.
      note:"Many Canadian stories first reached readers through magazines and through CBC Radio, whose programmes (such as Robert Weaver’s <i>Anthology</i>) broadcast new stories and helped writers like Munro find an audience." },
    s2:{ title:"Station 2: two openings, two stances", how:"Tap a feature, then tap the column it describes. When every feature is placed, the craft → meaning panel opens. Your placements are yours; the panel shows one reading beside them.",
      leacock:{ who:"Leacock", text:LEACOCK, cite:LEACOCK_CITE },
      munro:{ who:"Munro", text:Q.open, cite:CM("open") },
      features:[
        { id:"addr", t:"who is addressed", L:"“you”, the reader", M:"no one; we overhear a memory" },
        { id:"dist", t:"distance", L:"a whole town", M:"one family’s work" },
        { id:"tone", t:"tone", L:"amused and confiding", M:"plain and withholding" },
        { id:"first", t:"who comes first", L:"the town", M:"the father, with the narrator herself left out of her own first sentence" }],
      panelTitle:"Craft → meaning",
      panel:"Leacock’s “you” makes us visitors being shown around. Munro’s plain statement makes us listeners to a memory that begins, tellingly, with someone else. Stance decides our relationship to the world of the story.",
      reading:"One reading" },
    s3:{ title:"Station 3: the Southern Ontario Gothic lens", how:"Switch the lens on. For each detail from “Boys and Girls”, choose “just setting” or “carries pressure”, and say why if you like. The rating is yours.",
      lens:"Gothic lens",
      details:[
        { id:"d1", t:"the skinning of the foxes in the cellar, under the family’s feet" },
        { id:"d2", t:"the old horses kept through the winter to be killed for fox meat" },
        { id:"d3", t:"the gun brought out behind the barn" },
        { id:"d4", t:"the steam and heat of the kitchen in preserving season" },
        { id:"d5", t:"the gate between the barnyard and the field" }],
      rates:[{ id:"set", t:"just setting" }, { id:"press", t:"carries pressure" }],
      whyL:"Why? (optional)",
      kinds:{
        violence:["kill", "killed", "killing", "kills", "shoot", "shot", "shooting", "gun", "blood", "skin", "skinned", "skinning", "death", "dead", "die", "dies", "dying", "slaughter", "violence", "violent", "hurt", "pain", "cruel", "cruelty", "butcher", "meat"],
        confinement:["trap", "trapped", "cage", "caged", "pen", "pens", "penned", "fence", "fenced", "gate", "locked", "lock", "shut", "closed", "confined", "confinement", "stuck", "escape", "escapes", "free", "freedom", "prison", "trapped", "hidden", "hide", "under", "beneath", "below"],
        loss:["loss", "lose", "loses", "lost", "losing", "grief", "gone", "ending", "leave", "leaving", "never", "childhood", "innocence", "mourning", "sad", "sadness", "fear", "dread"]
      },
      good:"✓ Your reason links the detail to {kinds}. That’s the lens at work.",
      neutral:"That’s your call. Ask why this detail is here. A cellar where foxes are skinned is not just a cellar.",
      noteTitle:"The lens note",
      note:"Southern Ontario Gothic is a name critics use for fiction in which respectable rural and small-town surfaces hide pain, secrets or violence. The dread lives in ordinary places: the cellar, the barn, the family table.",
      after:"Rate all five details to read the lens note." },
    quickCheck:{ title:"Tradition quick check", summary:"Tradition quick check",
      items:[
        { id:"q1", goal:5, prompt:"Whom does Leacock’s narrator address?",
          choices:[{ t:"The reader as “you”", ok:true, fb:"Right. “I don’t know whether you know Mariposa” speaks straight to us." },
            { t:"A character in the town", fb:"“I don’t know whether you know Mariposa” speaks straight to us." },
            { t:"No one", fb:"“I don’t know whether you know Mariposa” speaks straight to us." },
            { t:"Leacock’s editor", fb:"“I don’t know whether you know Mariposa” speaks straight to us." }] },
        { id:"q2", goal:5, prompt:"Whom does Munro’s opening sentence put at the centre?",
          choices:[{ t:"The father", ok:true, fb:"Right. The narrator begins with her father’s work. She isn’t even the subject of her own first sentence." },
            { t:"The narrator", fb:"The narrator begins with her father’s work. She isn’t even the subject of her own first sentence." },
            { t:"Laird", fb:"The narrator begins with her father’s work. She isn’t even the subject of her own first sentence." },
            { t:"The foxes", fb:"The narrator begins with her father’s work. She isn’t even the subject of her own first sentence." }] },
        { id:"q3", goal:4, prompt:"Which detail from “Boys and Girls” best fits the Southern Ontario Gothic lens?",
          choices:[{ t:"The foxes skinned in the cellar under the house", ok:true, fb:"Right. Killing and skinning beneath the family’s living space is dread folded into the domestic." },
            { t:"The colour of the barn", fb:"Killing and skinning beneath the family’s living space is dread folded into the domestic." },
            { t:"The season of the year", fb:"Killing and skinning beneath the family’s living space is dread folded into the domestic." },
            { t:"Laird’s age", fb:"Killing and skinning beneath the family’s living space is dread folded into the domestic." }] },
        { id:"q4", goal:5, prompt:"Which award did Alice Munro receive in 2013?",
          choices:[{ t:"Nobel Prize in Literature", ok:true, fb:"Right. She was the first Canadian-based writer to win it, for a body of short stories." },
            { t:"Giller Prize", fb:"She received the Nobel Prize in Literature: the first Canadian-based writer to win it, for a body of short stories." },
            { t:"Pulitzer Prize", fb:"She received the Nobel Prize in Literature: the first Canadian-based writer to win it, for a body of short stories." },
            { t:"Booker Prize", fb:"She received the Nobel Prize in Literature: the first Canadian-based writer to win it, for a body of short stories." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“" + Q.open + "”</p><p class='eng-cite'>" + CM("open") + "</p><p><strong>What it does:</strong> five plain words name a person by their work. The next sentence then explains what that work means.</p><p><strong>Pattern:</strong> “My ___ was a ___. [Next sentence: what that really meant.]”</p><p><strong>Model imitation:</strong> “My grandmother was a seamstress. That is, she spent forty years making other people’s weddings fit.”</p><p>Write your own two sentences in the same shape.</p>",
      prompt:"Your imitation" }],
    steal:{ master:Q.open, source:"Munro, “Boys and Girls”", save:"Save it to my Art of Language notebook" }
  },
  practice:{
    activities:[
      { id:"worlds", type:"custom", title:"Two worlds", summary:"Two worlds", goal:[1, 4], noun:"moment", txt:true,
        instruction:"Sort each moment from “Boys and Girls” into the world it belongs to.",
        how:"Tap a moment, then tap the box it belongs in.",
        boxes:[{ id:"father", label:"Father’s world", sub:"outside work" }, { id:"mother", label:"Mother’s world", sub:"the house and kitchen" }],
        wrongDefault:"Ask who does this work, and where: the barn and fields, or the house and kitchen?",
        items:[
          { id:"i1", t:"Carrying water to the foxes", answer:"father", why:"Outdoor work with the foxes is her father’s work.",
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Father’s world: outdoor work with the foxes."] },
          { id:"i2", t:"The pelting in the cellar with Henry Bailey", answer:"father", why:"It happens under the house, but it’s the men’s work with the foxes.",
            wrong:{ mother:"The pelting happens in the house’s cellar, but it’s the men’s work. Which world is it part of?" },
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Father’s world: it happens under the house, but it’s the men’s work."] },
          { id:"i3", t:"Being introduced as the new hired man", answer:"father", why:"Being called a hired man places her inside her father’s work.",
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Father’s world: a hired man works outside with him."] },
          { id:"i4", t:"The shooting of Mack behind the barn", answer:"father", why:"The killing is the men’s work, behind the barn.",
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Father’s world: behind the barn, the men’s work."] },
          { id:"i5", t:"Laird riding out in the truck to catch Flora", answer:"father", why:"Laird goes out with the men: the brother is taken into the father’s world.",
            wrong:{ mother:"Laird goes with the men. That’s the point: the brother is taken into the world she’s leaving." },
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Father’s world: Laird goes out with the men."] },
          { id:"i6", t:"Putting up preserves in the hot kitchen", answer:"mother", why:"The kitchen and its preserving are her mother’s work.",
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Mother’s world: the kitchen."] },
          { id:"i7", t:"The grandmother’s rules about how girls behave", answer:"mother", why:"The rules prepare her for the house.",
            wrong:{ father:"The rules are about how girls should sit, walk and close doors, which prepare her for the house." },
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Mother’s world: the rules prepare her for the house."] },
          { id:"i8", t:"Her mother’s wish that she help in the house", answer:"mother", why:"Her mother wants her inside, in the house.",
            hints:["Who does this work, and where?", "Is it the barn and fields, or the house and kitchen?", "Mother’s world: help in the house."] }
        ],
        reflect:{ q:"Where does the gate belong? Why might Munro have put the turn at a boundary?", label:"Your answer (one line, unscored; it goes into your results summary)", after:"After sorting:" } },
      { id:"ribbon", type:"custom", title:"The fair ribbon: an unseen story", summary:"The fair ribbon", star:true, goal:[1, 2, 3, 4, 6],
        instruction:"Read this short passage, written for this module. Then answer six questions. R4 to R6 sit above Final Check level.",
        why:"“Boys and Girls” is told largely in time order, so this short passage, written for the module, gives practice with <strong>telling order that differs from story order</strong>, a move Munro uses in many later stories.",
        passage:RIBBON, passageTitle:"“The Fair Ribbon” (written for this module; cited by paragraph)",
        r1:{ id:"r1", goal:1, prompt:"<strong>R1.</strong> Which paragraph is told from the latest point in time?",
          answer:"F5", why:"F5 reaches across “every year since”, to the present.",
          wrong:{ F1:"F1 is also “now”, but F5 reaches across all the years since, to the present." },
          wrongDefault:"That paragraph is set at one moment in the past. Which one reaches all the way to now?",
          hints:["Look for time words in each paragraph.", "Two paragraphs speak from “now”. Which one spans the most years?", "F5: “every year since” reaches to the present."] },
        r2:{ id:"r2", goal:1, prompt:"<strong>R2.</strong> Put the paragraphs in story order (when things happened).",
          start:["F1", "F4", "F2", "F5", "F3"],
          first:"F1 first: the ribbon is described as it is <em>now</em>; the fair happens in F4.",
          other:"Not yet. Start with the earliest event, the September jam-making, and end with now.",
          why:"F2 (September), F3 (her reflection on that silence; it can sit next to F2 or F4), F4 (the fair), then F5 and F1, both told from now.",
          hints:["Which paragraph happens first in time? Look for “That September”.", "The fair comes after the jam-making. F1 and F5 both speak from now.", "F2, F3, F4, F5, F1. (F3 is flexible; F1’s present framing may sit with F5 at the end.)"] },
        items:[
          { id:"r3", goal:4, prompt:"<strong>R3.</strong> Which detail is the strongest foreshadowing?",
            options:[{ t:"Her grandmother watching “my hands, not my face” (F2)", ok:true, why:"She watches the skill, not the girl: she is already measuring whether she is still needed." },
              { t:"“a judge with a pencil behind his ear” (F4)", why:"Vivid, but it doesn’t anticipate the grandmother letting go of her role." },
              { t:"“Second prize, Huron County Fall Fair, Junior Preserves” (F1)", why:"That labels the ribbon; it doesn’t hint at what is coming." },
              { t:"“That September” (F2)", why:"A time marker, not a hint of what is to come." }],
            hints:["Foreshadowing hints at what will happen later.", "What happens later? The grandmother lets go of her role.", "“my hands, not my face” (F2): she watches the skill that will replace her."] },
          { id:"r4", goal:2, star:true, prompt:"<strong>R4 ★.</strong> What does “She didn’t need me at all” (F4) most likely reveal?",
            options:[{ t:"Pride mixed with grief at being outgrown", ok:true, why:"Pride that she’s grown, and grief that she’s not needed." },
              { t:"Disappointment that the jam was bad", why:"The jam wins a prize; the line is about being no longer needed." },
              { t:"Anger at the judge", why:"She says it “to no one”, not to the judge; it’s about her own place." },
              { t:"Relief that her work is done", why:"Relief leaves out the grief, and the narrator keeps her memory every year." }],
            hints:["Who says it, and to whom?", "“To no one” means it isn’t said to the girl.", "Pride that she’s grown, and grief that she’s not needed."] },
          { id:"r5", goal:3, star:true, prompt:"<strong>R5 ★.</strong> Which statement best describes the ending?",
            options:[{ t:"An open ending: the ritual of the cold cup keeps her absence present without stating the narrator’s feeling", ok:true, why:"The final image is built to leave the feeling with us." },
              { t:"There is no ending", why:"The final image is built to leave the feeling with us. An open ending is built; it leaves a question with the reader on purpose." },
              { t:"A twist ending that reveals a secret", why:"Nothing is revealed; the ending gathers what we already know into one image." },
              { t:"A happy ending: the narrator has moved on", why:"She keeps the ritual every year; the absence is still present." }],
            hints:["What is the last image?", "Does the narrator name her feeling?", "Open: the cold cup keeps the absence present without naming the feeling."] },
          { id:"r6", goal:6, star:true, prompt:"<strong>R6 ★ (investigation).</strong> Which quotation best supports the claim “The narrator honours her grandmother by repeating her silence”?",
            options:[{ t:"“every year I let one go cold” (par. 5)", ok:true, why:"Each year she lets a cup of tea go cold, as her grandmother did while she watched." },
              { t:"“I won’t pretend I understood her silence” (par. 3)", why:"That shows the child didn’t understand. It doesn’t show the adult repeating the silence." },
              { t:"“She didn’t need me at all” (par. 4)", why:"Those are the grandmother’s words, not the narrator’s ritual." },
              { t:"“watched my hands, not my face” (par. 2)", why:"That is the grandmother’s silence; the claim is about the narrator repeating it." }],
            hints:["The claim is about the adult narrator, now.", "Find what she does every year.", "“every year I let one go cold” (par. 5)."] }
        ],
        connection:"Like “Boys and Girls”, this passage ends with a ritual of silence. Compare: the narrator of “Boys and Girls” doesn’t protest her father’s verdict. What do both writers trust silence to say?" },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Thaddeus", goal:[2, 3, 6],
        instruction:"Thaddeus made one mistake in each paragraph about “Boys and Girls”. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write an analytical paragraph on the narrator’s voice.",
            steps:["“Boys and Girls” is narrated by a woman looking back on her childhood on a fox farm.",
              "Munro tells us that a girl was “" + Q.become + "” " + CM("girl") + ".",
              "This reflection lets the adult voice explain what the child couldn’t see.",
              "The double voice makes the reader feel the cost of understanding too late."],
            answer:1,
            stepFb:["Sentence 1 is correct. Keep checking.", "", "Sentence 3 is fine. The mistake is earlier.", "This is the analysis; the problem is earlier."],
            fixes:[{ t:"“The narrator, looking back, reflects that a girl was ‘" + Q.become + "’ " + CM("girl") + ".”", ok:true, why:"The “I” is the narrator, a character, so the narrator reflects." },
              { t:"“Laird tells us that a girl was…”", why:"Laird isn’t the narrator." },
              { t:"Remove the quotation.", why:"The quotation is good evidence; the problem is who it’s attributed to." },
              { t:"Sentence 2 is correct.", why:"The “I” is the narrator, a character, not Munro herself." }],
            hints:["Who says “I” in the story?", "A character, not the writer.", "“The narrator reflects…”."] },
          { id:"e2", goal:3, task:"Explain the meaning of the gate.",
            steps:["The story’s turn comes when the narrator opens the gate instead of shutting it.",
              "Flora runs out into the field, and the men get in the truck, and Laird goes with them, and they catch her, and later they come home for supper.",
              "Because she has watched Mack die, her act reads as a choice against the men’s work she once longed to share.",
              "The gate marks the point where she leaves her father’s world."],
            answer:1,
            stepFb:["Correct observation.", "", "This is the analysis the paragraph needed sooner.", "A good concluding claim."],
            fixes:[{ t:"“Opening the gate is the first time she acts against her father’s world, and the story leaves her reasons unexplained, so the reader has to weigh pity against belonging.”", ok:true, why:"It says what the act <em>means</em> instead of retelling it." },
              { t:"Add more plot detail about the chase.", why:"More summary is the problem, not the solution." },
              { t:"Delete sentence 3.", why:"Sentence 3 is the strongest analysis." },
              { t:"Sentence 2 is correct.", why:"It retells events instead of explaining what the act means." }],
            hints:["Is sentence 2 explaining or retelling?", "Retelling.", "Replace it with what the act <em>means</em>."] },
          { id:"e3", goal:6, task:"Use a quotation about the father’s verdict.",
            steps:["The father’s last words decide what the narrator’s act will mean.",
              "They come at the supper table, after Laird tells.",
              "“" + Q.only + ".”",
              "The word “only” both excuses her and makes her smaller."],
            answer:2,
            stepFb:["A clear claim.", "Accurate support.", "", "Good analysis, but the quotation needs integrating first."],
            fixes:[{ t:"“Her father ends the matter with a verdict that is also a pardon: ‘" + Q.only + "’ " + CM("only") + ".”", ok:true, why:"A signal phrase introduces the words, and the citation follows them." },
              { t:"Remove the quotation marks.", why:"Exact words need quotation marks." },
              { t:"Move the citation to the end of the paragraph.", why:"Each quotation is cited where it appears." },
              { t:"Sentence 3 is correct.", why:"A dropped quotation has no signal phrase and no citation." }],
            hints:["How is the quotation introduced?", "It isn’t, and it isn’t cited.", "Add a signal phrase and " + CM("only") + "."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In the mapper, which move surprised you most: the long stretch of habit before the events, the change in the night stories, or the word “only”? Why?" },
      { id:"j2", q:"In your own words, explain how “Boys and Girls” uses habit and event. Why might Munro spend so long on the farm year before Mack and Flora?" },
      { id:"j3", q:"Explain to a friend how to find the places where the adult narrator’s understanding speaks inside the girl’s year." },
      { id:"j4", q:"The narrator learns that “girl” came with rules. What words in your own life have carried rules you didn’t choose? What would you like to say back to them?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one sentence from “Boys and Girls”, from Leacock or from “The Fair Ribbon” that you’d like to remember. Write one line on why it stays with you.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one craft principle you’ve earned from this module, in your own words. Add the master’s example (a short line from “Boys and Girls”, from Leacock, or from “The Fair Ribbon”, with a page or paragraph number) and write your own sentence that uses the principle.",
      placeholder:"e.g. Build the habit first; the reader will feel the moment it breaks.",
      examples:[
        "“" + Q.open + "” " + CM("open"),
        "“" + Q.girl + "” " + CM("girl"),
        "“" + Q.only + "” " + CM("only"),
        "“" + LEACOCK + "” (Leacock, ch. 1)",
        "“She sat at the table with her tea going cold and watched my hands, not my face.” (“The Fair Ribbon,” par. 2)",
        "“I have made the jam every year since, and every year I set out two cups, and every year I let one go cold.” (“The Fair Ribbon,” par. 5)"
      ]
    },
    artSamples:[
      { p:"Build the habit first; the reader will feel the moment it breaks.", tag:"Logic" },
      { p:"Let a character’s small word carry a large verdict, and let the narrator’s silence answer it.", tag:"Rhetoric" }
    ],
    principleMax:140
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which moment in “Boys and Girls” is told as a single event rather than a habit?",
          options:[{ t:"Flora’s escape through the gate", ok:true, why:"It happens once, on one particular day." },
            { t:"The pelting season in the cellar", why:"That happens every fall and winter." },
            { t:"The stories she tells herself at night", why:"Those happen night after night." },
            { t:"Carrying water to the foxes", why:"That’s a daily chore, a habit." }] },
        b:{ prompt:"Which moment in “Boys and Girls” is told as a habit (what used to happen)?",
          options:[{ t:"The stories she tells herself after Laird falls asleep", ok:true, why:"They happen again and again." },
            { t:"Mack’s shooting", why:"That happens once." },
            { t:"The opening of the gate", why:"That happens once." },
            { t:"Laird telling at supper", why:"That happens once." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"“" + Q.girl + "” Whose understanding speaks here?",
          options:[{ t:"The adult narrator, looking back", ok:true, why:"Only an older self could see the word’s weight so clearly." },
            { t:"Munro, speaking directly to the reader", why:"The “I” is the narrator, a character." },
            { t:"The girl, in the moment", why:"The child is still inside the role; this sentence stands outside it." },
            { t:"The grandmother", why:"She gives rules; this is the narrator’s reflection." }] },
        b:{ prompt:"“I laughed at his hat; I didn’t know yet that he’d bought it for the funeral.” Whose voice adds “I didn’t know yet”?",
          options:[{ t:"The adult narrator, looking back", ok:true, why:"“Didn’t know yet” implies later knowledge." },
            { t:"The author, interrupting", why:"The narrator is a character the author built. “Didn’t know yet” is the narrator’s own later knowledge." },
            { t:"The child, in the moment", why:"Listen for the older self explaining what the child couldn’t know yet." },
            { t:"The man with the hat", why:"He isn’t the “I”." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which best describes the narrator’s stance in the opening of Leacock’s <i>Sunshine Sketches</i> (“I don’t know whether you know Mariposa…”)?",
          options:[{ t:"A genial guide who speaks directly to the reader as “you”", ok:true, why:"The address draws us in like visitors." },
            { t:"A girl recalling a painful year", why:"That’s Munro’s narrator." },
            { t:"An omniscient narrator who never addresses the reader", why:"He says “you” at once." },
            { t:"A character in a play speaking to the audience", why:"It’s prose narration, not drama." }] },
        b:{ prompt:"What does the term “Southern Ontario Gothic” name?",
          options:[{ t:"Fiction in which respectable rural and small-town surfaces hide pain, secrets or violence", ok:true, why:"Respectable surfaces, hidden dread: that’s the lens." },
            { t:"Medieval castles in Ontario fiction", why:"Gothic here means a mood, not architecture." },
            { t:"Stories set only in Toronto", why:"It’s associated with small towns and farms." },
            { t:"Ghost stories with supernatural monsters", why:"The dread is domestic, not supernatural." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"A story is told in this order: (1) a wedding in 1990, (2) a childhood fight in 1960, (3) the narrator today, (4) a reconciliation in 1975. What is the story order?",
          options:[{ t:"2, 4, 1, 3", ok:true, why:"1960 → 1975 → 1990 → today." },
            { t:"1, 2, 3, 4", why:"That’s the telling order." },
            { t:"2, 1, 4, 3", why:"1975 comes before 1990." },
            { t:"3, 2, 4, 1", why:"“Today” is latest, not earliest." }] },
        b:{ prompt:"Told in this order: (1) a funeral in 2010, (2) a first meeting in 1980, (3) an argument in 1995, (4) the narrator today. What is the story order?",
          options:[{ t:"2, 3, 1, 4", ok:true, why:"1980 → 1995 → 2010 → today." },
            { t:"1, 2, 3, 4", why:"That’s the telling order." },
            { t:"2, 1, 3, 4", why:"1995 comes before 2010." },
            { t:"4, 2, 3, 1", why:"“Today” is last." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Passage: “My brother taught me to skate on the pond behind the church. He held my mittens and skated backwards, and I thought he could do anything. He was fifteen; he could not, it turned out, do almost anything.” Which best explains the effect of the last sentence?",
          options:[{ t:"The adult’s later knowledge undercuts the child’s wonder, adding sorrow to a happy memory", ok:true, why:"“It turned out” is later knowledge; it sets the grown narrator’s view beside the child’s." },
            { t:"It contradicts the story, so the narrator is unreliable", why:"The narrator is honest about two perspectives." },
            { t:"It summarizes the skating lesson", why:"It reinterprets; it doesn’t summarize." },
            { t:"It shows the brother was a bad skater", why:"It’s about life, not skating." }] },
        b:{ prompt:"Passage: “Dad said the old truck would run forever, and I believed him the way you believe weather. It was the summer before the plant closed. I didn’t know yet that ‘forever’ had a date on it.” Which best explains the effect of the last sentence?",
          options:[{ t:"The adult’s hindsight turns a child’s certainty into foreshadowed loss", ok:true, why:"“Didn’t know yet” comes from later, and “a date on it” points to the loss ahead." },
            { t:"It proves the truck broke down", why:"It’s about more than the truck." },
            { t:"It is the child’s thought at the time", why:"“Didn’t know yet” comes from later." },
            { t:"It repeats the father’s words", why:"It reframes them." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Why does “Boys and Girls” end at the supper table, with “" + Q.only + "”, rather than at the gate?",
          options:[{ t:"So that her family gives the act its meaning, and her silence shows how far she has taken in the word “girl”", ok:true, why:"The gate is the turn; the supper gives it a meaning, and her silence shows what she has absorbed." },
            { t:"Because the gate is unimportant", why:"The gate is the turn; the ending interprets it." },
            { t:"Because Munro agrees that she is only a girl", why:"The verdict is the father’s; the story shows it without endorsing it." },
            { t:"To tell the events out of order", why:"The supper comes last in time, too." }] },
        b:{ prompt:"Why does “Boys and Girls” spend its first half on habits (the pelting, the chores, the night stories) before Mack and Flora?",
          options:[{ t:"To build the world she loves and belongs to, so the single events can break it", ok:true, why:"Habit builds a world; the events crack it." },
            { t:"Because nothing important happens in the first half", why:"The habits are what’s at stake." },
            { t:"Because the narrator forgot the events at first", why:"Order is the writer’s design." },
            { t:"To show that the farm never changes", why:"The point is that it <em>does</em> change, for her." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which sentence is the best analysis (not summary) of the gate scene?",
          options:[{ t:"“By opening the gate instead of shutting it, the narrator acts against the men’s work she once longed to share, and the story leaves her reasons unexplained, so the reader must weigh pity against belonging.”", ok:true, why:"It says how the act makes meaning, and why it matters." },
            { t:"“Flora gets loose and the narrator opens the gate and Flora runs away.”", why:"Accurate, but only says what happens." },
            { t:"“The gate scene is exciting because a horse runs away.”", why:"Excitement isn’t meaning." },
            { t:"“The men chase Flora in the truck and Laird goes with them.”", why:"A retelling." }] },
        b:{ prompt:"Which sentence is the best analysis of the change in the narrator’s night stories?",
          options:[{ t:"“As her private stories shift from rescuing others to being rescued and looked at, the narrator shows us, before she can say it, that the role of ‘girl’ has begun to shape even her imagination.”", ok:true, why:"It names the change and says what it shows." },
            { t:"“She tells herself stories at night after Laird falls asleep.”", why:"That tells what happens. Analysis says how a choice makes meaning, and why it matters." },
            { t:"“The stories get longer as she gets older.”", why:"Length isn’t the change that matters." },
            { t:"“In some stories she is brave and in others she is not.”", why:"Accurate, but it doesn’t say what the change means." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which sentence best integrates and cites the narrator’s reflection on the word <em>girl</em>?",
          options:[{ t:"Looking back, the narrator sees that the word was an assignment, not a description: “" + Q.girl.replace(/\.$/, "") + "” " + CM("girl") + ".", ok:true, why:"A signal phrase, the exact words, the citation after them, and the point." },
            { t:"“" + Q.girl + "” This shows she is sad.", why:"Introduce the words, cite them, then explain what they do." },
            { t:"Munro admits that a girl “was " + Q.become + "” " + CM("girl") + ".", why:"The “I” is the narrator, not Munro." },
            { t:CM("girl") + " “A girl was not, as I had supposed, simply what I was,” shows she changes.", why:"The citation belongs after the quotation." }] },
        b:{ prompt:"Which sentence best integrates and cites the father’s verdict?",
          options:[{ t:"The father’s last words both pardon and dismiss her: “" + Q.only + "” " + CM("only") + ".", ok:true, why:"A signal phrase, the exact words, the citation, and what the words do." },
            { t:"“" + Q.only + ".” The father is being kind.", why:"Introduce the words, cite them, then explain what they do." },
            { t:"The father says she’s only a girl " + CM("only") + " “which ends the story.”", why:"The quotation isn’t marked, and the citation is in the wrong place." },
            { t:CM("only") + " “" + Q.only + "” is the last line of dialogue.", why:"The citation comes after." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Passage: “Every Sunday Mrs. Fowler polished the brass knocker on her front door until it shone, though no one had knocked in years.” Using the Southern Ontario Gothic lens, what does the detail most suggest?",
          options:[{ t:"Keeping up appearances over a loneliness or loss that no one names", ok:true, why:"A shining knocker no one uses: a respectable surface over an unnamed loss." },
            { t:"Mrs. Fowler loves cleaning", why:"That reads it only literally." },
            { t:"The town is wealthy", why:"Nothing suggests that." },
            { t:"A ghost knocks at night", why:"The Gothic here is domestic, not supernatural." }] },
        b:{ prompt:"Passage: “The Hendersons’ front room had plastic covers on the sofa, and the children were not allowed in it, not even at Christmas.” What does the detail most suggest?",
          options:[{ t:"A household guarding a respectable surface at the cost of warmth and use", ok:true, why:"A room kept for show, closed even at Christmas: appearance over warmth." },
            { t:"The sofa was very expensive", why:"Ask why this detail is here; that reading stays on the surface." },
            { t:"The children were messy", why:"It’s about the parents’ priorities." },
            { t:"The room was haunted", why:"No supernatural element." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A student wants to write a story about her town that makes readers feel like welcomed visitors. Which choice best fits that aim?",
          options:[{ t:"A genial narrator who addresses the reader as “you”, as Leacock does", ok:true, why:"The “you” makes us visitors being shown around." },
            { t:"A retrospective narrator who never names a listener", why:"That makes the reader an eavesdropper, not a guest." },
            { t:"Third-person omniscient with no narrator personality", why:"There’d be no one welcoming us." },
            { t:"A diary of private secrets", why:"A diary shuts the reader out." }] },
        b:{ prompt:"A student wants readers to feel they’re overhearing a painful memory, as in “Boys and Girls”. Which choice best fits?",
          options:[{ t:"A retrospective first-person narrator who speaks without addressing a listener", ok:true, why:"No one is addressed, so we overhear a memory." },
            { t:"A narrator who keeps saying “you will enjoy this town”", why:"That’s a guide’s stance." },
            { t:"A comic, exaggerated chronicle", why:"Comedy works against the ache." },
            { t:"A newspaper report", why:"Reports don’t overhear memory." }] } }
    ]
  },
  task:{
    title:"Performance task: Map and argue", summary:"Map and argue",
    statement:"<p>Map “Boys and Girls”, then argue in one paragraph how one structural choice creates meaning: the move from habit to event, the adult narrator’s voice, the turn at the gate, or the ending.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["Your map has at least 5 moments", "Your map uses both kinds of time", "Your claim names the story and its author", "Your claim says how and why",
      "Your evidence is quoted and cited", "Your analysis follows the evidence", "Your paragraph is 120–200 words"],
    tips:["Add moments from across the story: the farm year, the horses, the gate, the supper.",
      "Tag at least one moment as a habit and one as an event.",
      "Name the story in quotation marks and the author’s surname in your first sentence.",
      "Say <em>which</em> choice and <em>why</em> it matters: “…ends at the supper table, so that…”.",
      "Put the exact words in quotation marks, then the author and page in brackets: (Munro 112).",
      "After the citation, explain what the words <em>do</em>: two or three sentences.",
      "Trim or grow to 120–200 words."],
    explainPrompt:"Craft statement: Which choice did you argue about, and why that one? Name one sentence in your paragraph you’re proud of and explain the choice you made in it.",
    explainLabel:"Craft statement",
    vocab:"Use the words habit, event, retrospective narrator and turn.",
    checkLabel:"Check my map and paragraph",
    success:"Every part is there.",
    more:"There’s more than one way to argue this. Your teacher will read your paragraph for insight and style; the checklist only checked the parts. Want to try a second claim from a different moment?",
    min:120, max:200,
    craft:["habit", "habitual", "event", "ending", "turn", "turning point", "narrator", "voice", "retrospective", "hindsight", "structure", "order", "frame", "opening"],
    whySig:["because", "so that", "to show", "revealing", "suggesting", "suggests", "which", "so the reader"],
    focus:[{ id:"habit", t:"Habit to event" }, { id:"voice", t:"The adult narrator’s voice" }, { id:"turn", t:"The turn at the gate" }, { id:"ending", t:"The ending" }],
    labels:{
      setup:"Setup", title:"Story title", author:"Author’s surname", focus:"The choice you’re arguing about",
      map:"Your map (the same map as Explore, Mode 4)", include:"Include my map in the summary",
      write:"Write with", build:"Paragraph builder", free:"Free-form",
      claim:"Claim", claimHow:"Name the story and its author, the choice, and why it matters.",
      ev:"Evidence", evHow:"Introduce the words, quote them exactly, then cite: (Munro 112).", an:"Analysis", anHow:"What do the words do? Two or three sentences after the citation.",
      link:"Link", linkHow:"Tie it back to the claim.", opt:"optional", freeL:"Your paragraph (free-form)", freeHow:"Free-form keeps its own text; the builder’s slots stay as they were. Your first sentence counts as your claim.",
      pv:"Your paragraph", words:"words"
    },
    defaults:{ title:"Boys and Girls", author:"Munro" },
    modelsLabel:"Three model responses, three approaches",
    models:[
      { title:"Model A: the ending", text:"In “Boys and Girls”, Alice Munro’s ending moves from the gate to the supper table, so that the meaning of the narrator’s act is decided by her family rather than by her. When Laird tells what she did, her father answers with a verdict that is also a pardon: “" + Q.only + "” " + CM("only") + ". The word “only” does double work, because it excuses her disobedience and dismisses her in the same breath; she will not be punished, but she will not be taken seriously either. The narrator’s response is the quietest moment in the story: she does not protest, even inwardly. By closing on that acceptance, the story suggests that the strongest lessons about who we are allowed to be are delivered calmly, at ordinary family meals, and are absorbed rather than argued with." },
      { title:"Model B: the adult voice", text:"Alice Munro’s “Boys and Girls” is narrated by an adult looking back, and Munro uses that retrospective voice to show a girl learning a role she cannot yet see. At the point where the child begins to feel the weight of the word, the older narrator names what was happening: “" + Q.girl.replace(/\.$/, "") + "” " + CM("girl") + ". The semicolon divides two selves, revealing the gap between the child who thought “girl” was a plain fact and the adult who knows it was an assignment. The phrase “had to” carries the pressure of the grandmother’s rules and the mother’s kitchen, which the child obeys before she understands them. Because only the older voice could make this sentence, the story turns memory into analysis: the narrator is still working out how she was made." },
      { title:"Model C: the opening and the habits", text:"From its first sentence, “My father was a fox farmer” " + CM("open") + ", Alice Munro’s “Boys and Girls” defines the narrator’s world through her father’s work, revealing whose story she believes she is living. The narrator introduces herself only indirectly, as a daughter attached to a trade, and the early pages are told as habit: the seasons of watering, feeding and pelting that fill her days. That habitual time makes the father’s world seem permanent and her place in it secure. When single events break the pattern, first Mack’s death and then Flora’s escape through the gate she opens, the reader feels the habits give way. The opening sentence, so plain on first reading, becomes ironic by the end, because the farm was never going to be hers; the structure shows a belonging that was borrowed, not owned." }
    ],
    modelsNote:"Each model has [p.] where your page number goes.",
    rubric:RUBROWS
  },
  cards:[
    ["Habit time", "What used to happen, again and again: in “Boys and Girls”, the pelting season and the night stories."],
    ["Event time", "What happened once: Mack’s death, the gate, the supper."],
    ["Story order vs telling order", "When events happened vs when the text tells them. “The Fair Ribbon” tells the ribbon (now) before the fair (then)."],
    ["Retrospective narrator", "A narrator looking back from later: “A girl was not, as I had supposed, simply what I was…”"],
    ["Two voices", "The child in the moment and the adult who now understands, sometimes in one sentence."],
    ["The turn", "The moment after which nothing can go back: the narrator opens the gate."],
    ["A verdict in one word", "“" + Q.only + "”: “only” both pardons and dismisses."],
    ["Character’s view ≠ story’s view", "The father’s verdict is shown, not endorsed; the reader judges it."],
    ["Southern Ontario Gothic", "Fiction in which respectable rural and small-town surfaces hide pain, secrets or violence."],
    ["Narrator ≠ author", "“The narrator recalls…”, not “Munro says…”."],
    ["Stance", "The narrator’s relationship to the reader. Leacock: “I don’t know whether you know Mariposa.” Munro: “" + Q.open + "”"],
    ["<em>Girl</em> (word story)", "Once meant a child of either sex; the word narrowed, as the narrator’s world does."]
  ],
  misc:{ M1, M2, M3, M4, M5, M6, M7, M8 }
};
