// ENG4U 18 Research & Secondary Sources. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/18-research-and-sources.md
// Public-domain texts: Samuel Johnson in Boswell's Life of Johnson (1791), two sentences; F. Scott Fitzgerald, The Great Gatsby
// (1925), a small index of short passages (chapters 1, 2, 3, 6 and 9). The module never contains the full novel.
// Every secondary source is fictional, written for the course (plan §1, §6.2): Okafor, QuickLit Notes, Ng, the Northern
// Encyclopedia, TextPal, Lindqvist, Bélanger, the library index and its decoys; web addresses use the reserved .example domain
// and the DOI uses the 10.5555 test prefix. Every model sentence, scenario and student paragraph is original to the course.
// Verified 2026-11-26: Johnson's two sentences match Boswell's Life of Johnson (Project Gutenberg #1564, Osgood abridgement).
// Verified 2026-11-26: all eight NOVEL passages match the 1925 first edition on Wikisource ("The Great Gatsby (1925)"), including
// "orgastic" and "Every one". PG #64317 is a later text ("orgiastic", "Everyone", "tomorrow"). Page numbers are illustrative.
// VERIFY: the MLA 9 citation for an AI prompt (S5) against current MLA Style Center guidance (plan §6.3).

const M1 = "Ask who’s accountable, what evidence is shown, and who checked it. An unsigned page or a chatbot can’t answer those.";
const M2 = "Same shape, new words is still the source’s sentence. Close the source, then write the idea your way.";
const M3 = "The idea is borrowed even when the words are yours, so cite it.";
const M4 = "Whose argument is this paragraph? Start with your claim, then bring the critic in.";
const M5 = "Check every quotation against your copy of the novel. Secondhand quotations drift, and AI ones can be invented.";
const M6 = "Containers (journals, books, websites) are italic; parts inside them (articles, chapters, posts) go in quotation marks.";
const M7 = "In literary study an older essay can still be essential. Note its date and see who has responded to it.";

const GG = "<em>The Great Gatsby</em>";
const OKA = "Okafor, Adaeze. “Borrowed Light: Narration and Guilt in " + GG + ".” <em>North Shore Review of Literature</em>, vol. 41, no. 2, 2019, pp. 115–38.";
const LIN = "Lindqvist, Marta. <em>Dreamers and Debts: The American Novel, 1920–1940</em>. Harbourfront UP, 2016.";
const BEL = "Bélanger, Thomas. “Ash Heaps and Gold: Waste in Fitzgerald.” <em>New Readings of the Jazz Age</em>, edited by Priya Sandhu, Harbourfront UP, 2020, pp. 44–61.";
const NG = "Ng, Ricky. “Why Nick Carraway Is a Liar.” <em>Reading in the Dark</em>, 14 Mar. 2022, readinginthedark.example/nick-liar.";
const JAZZ = "“Jazz Age.” <em>Northern Encyclopedia of Literature</em>, 2018, northern-encyclopedia.example/jazz-age.";

// S1 passage (fictional, Okafor p. 120)
const PASSAGE = "Nick’s narration does not simply report Gatsby’s story; it launders it. By arranging events out of order and lingering on moments of beauty, Nick invites the reader to admire what he himself can neither fully condemn nor fully forgive. The novel’s famous final images thus belong less to Gatsby than to the narrator who needs Gatsby to have been great.";

// novel index: short public-domain passages (1925 text); ch = chapter, pg = illustrative page in the class edition
const NOVEL = [
  { id:"n1", ch:1, t:"In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since." },
  { id:"n2", ch:1, t:"Involuntarily I glanced seaward—and distinguished nothing except a single green light, minute and far away, that might have been the end of a dock." },
  { id:"n3", ch:2, t:"This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens", part:true },
  { id:"n4", ch:3, t:"In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars." },
  { id:"n5", ch:3, t:"Every one suspects himself of at least one of the cardinal virtues, and this is mine: I am one of the few honest people that I have ever known." },
  { id:"n6", ch:6, t:"The truth was that Jay Gatsby of West Egg, Long Island, sprang from his Platonic conception of himself." },
  { id:"n7", ch:9, t:"Gatsby believed in the green light, the orgastic future that year by year recedes before us." },
  { id:"n8", ch:9, t:"So we beat on, boats against the current, borne back ceaselessly into the past." }
];

// library index: the bank sources, Bélanger and 30 decoys (all fictional). Wilson's "Green Lights and Gold" is deliberately absent.
const LIB = [
  ["Okafor, Adaeze", "Borrowed Light: Narration and Guilt in The Great Gatsby", "North Shore Review of Literature, vol. 41, no. 2", "2019"],
  ["(no author)", "The Great Gatsby: Chapter 3 Summary", "QuickLit Notes (website)", "2021"],
  ["Ng, Ricky", "Why Nick Carraway Is a Liar", "Reading in the Dark (blog)", "2022"],
  ["(no author)", "Jazz Age", "Northern Encyclopedia of Literature", "2018"],
  ["Lindqvist, Marta", "Dreamers and Debts: The American Novel, 1920–1940", "Harbourfront UP (book)", "2016"],
  ["Bélanger, Thomas", "Ash Heaps and Gold: Waste in Fitzgerald", "New Readings of the Jazz Age, ed. Priya Sandhu", "2020"],
  ["Achebe-Lowe, Rhiannon", "Weather and Memory in Wuthering Heights", "Northern Review of Fiction, vol. 9, no. 1", "2014"],
  ["Barros, Inês", "The Unreliable Witness: First-Person Narration, 1900–1950", "Lakeshore Press (book)", "2011"],
  ["Chaudhry, Samir", "Money Talk in the Novels of Edith Wharton", "Studies in the Novel Quarterly, vol. 33, no. 4", "2018"],
  ["Delacroix, Hélène", "Cars, Speed and Risk in Modernist Fiction", "Modern Letters Review, vol. 22, no. 3", "2009"],
  ["Eriksen, Tove", "East Egg, West Egg: Class Geography on Long Island", "American Places Journal, vol. 15, no. 2", "2020"],
  ["Fofanah, Musa", "Prohibition and the Party Novel", "Harbourfront UP (book)", "2013"],
  ["Gallagher, Siobhan", "Reading Daisy’s Voice", "North Shore Review of Literature, vol. 37, no. 1", "2015"],
  ["Hashemi, Darius", "The Dock and the Horizon: Light in American Fiction", "Coastal Studies in Literature, vol. 6", "2017"],
  ["Ishikawa, Ren", "Gatsby on Film, 1926–2013", "Screen and Page, vol. 12, no. 2", "2016"],
  ["Jovanović, Mila", "Tom Buchanan and the Rhetoric of Power", "Studies in the Novel Quarterly, vol. 29, no. 1", "2014"],
  ["Kowalczyk, Piotr", "Myrtle’s Apartment: Space and Desire", "Urban Fictions, vol. 4, no. 3", "2021"],
  ["Laurent, Odile", "Jordan Baker and the New Woman", "Modern Letters Review, vol. 30, no. 1", "2019"],
  ["Mbeki-Shaw, Tendai", "Ash and Ember: Industrial Landscapes in the 1920s Novel", "Lakeshore Press (book)", "2018"],
  ["Nakamura, Aiko", "Dreams Deferred: Hope in American Fiction", "Harbourfront UP (book)", "2010"],
  ["O’Rourke, Declan", "The Narrator’s Confession", "North Shore Review of Literature, vol. 40, no. 3", "2018"],
  ["Petrov, Anya", "Owl Eyes and the Library Scene", "Notes on American Fiction, vol. 18", "2012"],
  ["Quispe, Lucía", "Time Out of Joint: Chronology in Fitzgerald", "Narrative Form, vol. 11, no. 2", "2022"],
  ["Rahman, Nadia", "Silence and Gossip in Jazz Age Fiction", "Modern Letters Review, vol. 27, no. 2", "2016"],
  ["Sørensen, Lars", "The Self-Made Man Myth", "American Ideas Review, vol. 8, no. 4", "2008"],
  ["Tremblay, Josée", "Fitzgerald in Translation: French Readings", "Comparative Letters, vol. 5, no. 1", "2019"],
  ["Underhill, Grace", "Wolfsheim and the World Series", "Sport and Story, vol. 3", "2017"],
  ["Vasquez, Mateo", "Colour Symbolism in Modern Novels", "Lakeshore Press (book)", "2015"],
  ["Whitlock, Harriet", "Nick and the Midwest", "Regional Literature Review, vol. 14, no. 2", "2013"],
  ["Xu, Lin", "Parties as Performance", "Theatre and Fiction, vol. 9, no. 1", "2020"],
  ["Yilmaz, Deniz", "The Ending We Remember: Closing Lines in Fiction", "Narrative Form, vol. 13, no. 1", "2023"],
  ["Zielinski, Marek", "Gold, Glitter and Debt", "Studies in the Novel Quarterly, vol. 35, no. 2", "2021"],
  ["Abernathy, Claire", "Teaching The Great Gatsby with Primary Sources", "Classroom Literature, vol. 7", "2022"],
  ["Bose, Arjun", "The Valley of Ashes as Wasteland", "Modern Letters Review, vol. 25, no. 4", "2014"],
  ["Castellano, Rosa", "Who Tells the Story? Narrators and Power", "Harbourfront UP (book)", "2019"],
  ["Duchêne, Marc", "Clocks and Calendars in Fitzgerald", "Narrative Form, vol. 8, no. 3", "2012"]
];

// ---------- MLA 9 citation builder cards (E8; elements, forms and the key) ----------
const EL = { author:"Author", title:"Title of source", orig:"Original publication date", cont:"Title of container", contrib:"Other contributors", ver:"Version", num:"Number",
  pub:"Publisher", date:"Publication date", loc:"Location", cont2:"Title of second container", loc2:"Location (second container)" };
function card(id, label, facts, els, start, punct, real){
  const order = els.map(e => e[0]), byId = {}, f = {}; els.forEach(e => { byId[e[0]] = e; f[e[0]] = e[1].findIndex(x => x.ok); });
  return { id, label, facts, fict:!real, els:start.map(k => ({ id:k, label:EL[k], forms:byId[k][1].map(({ ok, ...x }) => x) })), answer:{ order, p:punct, f } };
}
// "_…_" inside a form marks a title within a title (rendered in italics, or roman inside an italic title)
const AU = (last, first) => [{ t:last + ", " + first, ok:true }, { t:first + " " + last, e:"name" }];
const TQ = (t) => [{ t, s:"q", ok:true }, { t, s:"i", e:"tital" }];
const TI = (t) => [{ t, s:"i", ok:true }, { t, s:"q", e:"titlq" }, { t, s:"", e:"plain" }];
const PP = (r) => [{ t:"pp. " + r, ok:true }, { t:"pg. " + r, e:"pg" }, { t:r, e:"bare" }];
const URL = (u) => [{ t:u, ok:true }, { t:"https://" + u, e:"https" }];
const ONE = (t) => [{ t, ok:true }];
const OKA_T = "Borrowed Light: Narration and Guilt in _The Great Gatsby_";
const JOURNAL = [["author", AU("Okafor", "Adaeze")], ["title", TQ(OKA_T)], ["cont", TI("North Shore Review of Literature")], ["num", [{ t:"vol. 41, no. 2", ok:true }, { t:"41(2)", e:"apa" }]], ["date", ONE("2019")], ["loc", PP("115–38")]];
const CARDS = [
  card("s1", "S1 Okafor (journal)", "<p>Adaeze Okafor’s article “Borrowed Light: Narration and Guilt in " + GG + "”, in the peer-reviewed journal <em>North Shore Review of Literature</em>, volume 41, number 2, 2019, pages 115–38.</p>",
    JOURNAL, ["date", "title", "loc", "author", "num", "cont"], { author:".", title:".", cont:",", num:",", date:",", loc:"." }),
  card("s1db", "S1 via a database", "<p>The same Okafor article, read in the database <em>Literary Index Online</em> at https://doi.org/10.5555/nsrl.2019.412. The database is a second container.</p>",
    JOURNAL.concat([["cont2", TI("Literary Index Online")], ["loc2", [{ t:"https://doi.org/10.5555/nsrl.2019.412", ok:true }, { t:"doi.org/10.5555/nsrl.2019.412", e:"doi" }]]]),
    ["cont2", "author", "loc", "title", "loc2", "num", "date", "cont"], { author:".", title:".", cont:",", num:",", date:",", loc:".", cont2:",", loc2:"." }),
  card("s2", "S2 <em>QuickLit Notes</em>", "<p>A web page titled “" + GG + ": Chapter 3 Summary” on the website <em>QuickLit Notes</em>, 2021, at https://quicklitnotes.example/gatsby-3. No author is named.</p>",
    [["title", TQ("_The Great Gatsby_: Chapter 3 Summary")], ["cont", TI("QuickLit Notes")], ["date", ONE("2021")], ["loc", URL("quicklitnotes.example/gatsby-3")]],
    ["loc", "date", "cont", "title"], { title:".", cont:",", date:",", loc:"." }),
  card("s3", "S3 Ng (blog post)", "<p>Ricky Ng’s blog post “Why Nick Carraway Is a Liar”, on his book blog <em>Reading in the Dark</em>, posted 14 March 2022, at https://readinginthedark.example/nick-liar.</p>",
    [["author", AU("Ng", "Ricky")], ["title", TQ("Why Nick Carraway Is a Liar")], ["cont", TI("Reading in the Dark")], ["date", [{ t:"14 Mar. 2022", ok:true }, { t:"March 14, 2022", e:"datef" }]], ["loc", URL("readinginthedark.example/nick-liar")]],
    ["cont", "loc", "author", "date", "title"], { author:".", title:".", cont:",", date:",", loc:"." }),
  card("s4", "S4 “Jazz Age” (encyclopedia)", "<p>An unsigned entry, “Jazz Age”, in the <em>Northern Encyclopedia of Literature</em>, 2018, at https://northern-encyclopedia.example/jazz-age.</p>",
    [["title", TQ("Jazz Age")], ["cont", TI("Northern Encyclopedia of Literature")], ["date", ONE("2018")], ["loc", URL("northern-encyclopedia.example/jazz-age")]],
    ["date", "loc", "title", "cont"], { title:".", cont:",", date:",", loc:"." }),
  card("s5", "S5 TextPal (AI tool)", "<p>The prompt “Explain the symbolism of the green light in " + GG + "”, typed into <em>TextPal</em>, 2 Feb. version, made by Brightline Labs, on 5 February 2026, at https://textpal.example. Cite it only if your teacher allows AI use.</p>",
    [["title", [{ t:"“Explain the symbolism of the green light in _The Great Gatsby_” prompt", s:"", ok:true }, { t:"Explain the symbolism of the green light in _The Great Gatsby_", s:"i", e:"aiTitle" }]],
      ["cont", TI("TextPal")], ["ver", ONE("2 Feb. version")], ["pub", ONE("Brightline Labs")], ["date", [{ t:"5 Feb. 2026", ok:true }, { t:"February 5, 2026", e:"datef" }]], ["loc", URL("textpal.example")]],
    ["pub", "loc", "title", "date", "cont", "ver"], { title:".", cont:",", ver:",", pub:",", date:",", loc:"." }),
  card("s6", "S6 Lindqvist (book)", "<p>Marta Lindqvist’s book <em>Dreamers and Debts: The American Novel, 1920–1940</em>, published by Harbourfront University Press in 2016.</p>",
    [["author", AU("Lindqvist", "Marta")], ["title", TI("Dreamers and Debts: The American Novel, 1920–1940")], ["pub", [{ t:"Harbourfront UP", ok:true }, { t:"Harbourfront University Press", e:"up" }]], ["date", ONE("2016")]],
    ["date", "title", "pub", "author"], { author:".", title:".", pub:",", date:"." }),
  card("bel", "Bélanger (essay in a collection)", "<p>Thomas Bélanger’s essay “Ash Heaps and Gold: Waste in Fitzgerald”, in the collection <em>New Readings of the Jazz Age</em>, edited by Priya Sandhu, Harbourfront University Press, 2020, pages 44–61.</p>",
    [["author", AU("Bélanger", "Thomas")], ["title", TQ("Ash Heaps and Gold: Waste in Fitzgerald")], ["cont", TI("New Readings of the Jazz Age")], ["contrib", [{ t:"edited by Priya Sandhu", ok:true }, { t:"Edited by Priya Sandhu", e:"edcap" }]],
      ["pub", [{ t:"Harbourfront UP", ok:true }, { t:"Harbourfront University Press", e:"up" }]], ["date", ONE("2020")], ["loc", PP("44–61")]],
    ["pub", "cont", "loc", "author", "date", "contrib", "title"], { author:".", title:".", cont:",", contrib:",", pub:",", date:",", loc:"." }),
  card("nov", "The novel", "<p>F. Scott Fitzgerald’s novel " + GG + ", first published in 1925; your edition was published by Scribner in 2004.</p>",
    [["author", AU("Fitzgerald", "F. Scott")], ["title", TI("The Great Gatsby")], ["orig", ONE("1925")], ["pub", ONE("Scribner")], ["date", ONE("2004")]],
    ["pub", "title", "date", "author", "orig"], { author:".", title:".", orig:".", pub:",", date:"." }, true)
];

const SOURCES = [
  { id:"s1", n:"S1", head:"Adaeze Okafor, “Borrowed Light: Narration and Guilt in " + GG + ",” <em>North Shore Review of Literature</em> (peer-reviewed), 2019",
    says:"Nick doesn’t just report Gatsby’s story; he reshapes it so readers admire what he can’t judge.", key:[2, 2, 2, 2, 1],
    note:"A named scholar in a peer-reviewed journal, with documented close readings. Currency 1: recent enough; criticism doesn’t expire quickly." },
  { id:"s2", n:"S2", head:"“" + GG + ": Chapter 3 Summary,” <em>QuickLit Notes</em> (no author; ads), 2021",
    says:"A plot summary. It misquotes the last line as “borne back endlessly into the past”.", key:[0, 0, 0, 1, 1],
    note:"No author, no evidence, no review, and it misquotes the novel. Its purpose is partly to sell ads." },
  { id:"s3", n:"S3", head:"Ricky Ng, “Why Nick Carraway Is a Liar,” <em>Reading in the Dark</em> (a teacher’s book blog), 2022",
    says:"Nick calls himself honest yet hides his part in the affair.", key:[1, 1, 0, 1, 2],
    note:"A named teacher with some quoted evidence, but nobody reviewed it. Good for ideas; look for scholarship to cite." },
  { id:"s4", n:"S4", head:"“Jazz Age,” <em>Northern Encyclopedia of Literature</em> (editorial board), 2018",
    says:"An overview of 1920s culture; notes that Fitzgerald popularized the phrase.", key:[1, 1, 1, 2, 1],
    note:"Edited and reliable for context, but unsigned and general: it says nothing about the novel’s craft." },
  { id:"s5", n:"S5", ai:true, head:"A TextPal (AI chatbot) answer about the green light, 2026",
    says:"A fluent, confident answer with an invented quotation and an invented article.", key:[0, 0, 0, 1, 2],
    note:"No accountable author, no checkable evidence, no review. AI answers are always “Don’t use as evidence”, whatever their total." },
  { id:"s6", n:"S6", head:"Marta Lindqvist, <em>Dreamers and Debts: The American Novel, 1920–1940</em>, Harbourfront UP (university press), 2016",
    says:"Characters in 1920s novels treat dreams like loans that come due.", key:[2, 2, 2, 2, 1],
    note:"A scholar’s book from a university press, reviewed before publication and fully documented." }
];

export default {
  id:"18-research-and-sources",
  kind:"topic",
  title:"Research and secondary sources",
  topic:"Research & Secondary Sources",
  readyTopic:"research and secondary sources",
  hero:{
    headline:"Join the conversation; don’t hide in it.",
    text:"Research is how your reading joins a conversation that started long before you. A <strong>secondary source</strong> (a critic’s article, a scholar’s book) comments on your <strong>primary source</strong>, the novel. In this module you’ll learn to judge which voices deserve your trust, take notes that are honest and your own, cite with <strong>MLA 9</strong> precision, and put critics in conversation with <em>your</em> argument.",
    fig:{ html:"<div class='rs-hero' id='rs-hero' role='group' aria-label='Samuel Johnson’s two sentences about knowledge. As they are read, a single book glows at the centre; then thin lines run out from it to a ring of other books and papers, like a conversation map. Final frame: your novel in the centre, critics around it, and the caption Your novel. Your voice. Their voices.'></div>", caption:"" },
    passage:["Knowledge is of two kinds.", "We know a subject ourselves,", "or we know where we can find information upon it."],
    cite:"Samuel Johnson, as recorded in James Boswell’s <em>Life of Johnson</em> (1791)",
    caption:"Your novel. Your voice. Their voices.",
    readIt:"Read it yourself: read it aloud. Which kind of knowing do you rely on more?",
    ring:["critic", "scholar", "journal", "encyclopedia", "blog", "study guide"]
  },
  goals:[
    "I can evaluate the credibility and usefulness of a source for literary research.",
    "I can take notes as quotation, paraphrase or summary, without patchwriting.",
    "I can write MLA 9 Works Cited entries and in-text citations.",
    "I can verify quotations and claims, including those from AI tools, against the primary text.",
    "I can put a critic in conversation with my own argument: agree and extend, complicate, or push back.",
    "I can act with academic integrity, including following my teacher’s policy on generative AI."
  ],
  start:{
    blocks:[
      // VERIFY: wording of the plagiarius / Martial summary (plan §6.5).
      { title:"Word story: <em>plagiarism</em>", html:"<p>From Latin <em>plagiarius</em>, a kidnapper, someone who stole a child or enslaved a free person. The Roman poet Martial used the word for a rival who passed off Martial’s verses as his own: the poems were his “children”, stolen.</p><p>To plagiarize, then, is to kidnap someone’s words. Citing is how you return them home.</p>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Primary and secondary sources", goal:1, prompt:"For an essay on " + GG + ", which is the <strong>primary</strong> source?",
          options:[
            { t:"The novel itself", ok:true, why:"The text you’re analysing is primary." },
            { t:"A scholar’s article about the novel", why:"That comments on the primary source: secondary." },
            { t:"A study guide’s chapter summary", why:"Secondary (and weak)." },
            { t:"An encyclopedia entry on the 1920s", why:"Background, secondary." }],
          hints:["Which text are you analysing?", "Everything else comments on it.", "The novel."] },
        { id:"w2", skill:"Primary and secondary sources", goal:1, prompt:"A <strong>scholarly journal article</strong> usually differs from a blog post because it…",
          options:[
            { t:"Is reviewed by other experts before publication and cites its evidence", ok:true, why:"Peer review and documentation." },
            { t:"Is always longer", why:"Length isn’t the difference." },
            { t:"Is always more recent", why:"Many blog posts are newer." },
            { t:"Has pictures", why:"Irrelevant." }],
          hints:["Who checks it before it appears?", "Other experts.", "Peer review and citations."] },
        { id:"w3", skill:"Quoting and paraphrasing", goal:2, prompt:"Which best describes a <strong>paraphrase</strong>?",
          options:[
            { t:"The source’s idea in your own words and sentence structure, with a citation", ok:true, why:"Their idea, your words and structure, and a citation." },
            { t:"The source’s sentence with a few synonyms swapped", why:"That’s patchwriting. " + M2 },
            { t:"An exact copy in quotation marks", why:"That’s a quotation." },
            { t:"Your own idea, with no source", why:"Then nothing is being paraphrased." }],
          hints:["Whose idea, whose words?", "Their idea, your words <em>and</em> structure.", "A cited restatement in your own words."] },
        { id:"w4", skill:"Quoting and paraphrasing", goal:2, prompt:"Which notes need a citation?",
          options:[
            { t:"Quotations, paraphrases and summaries", ok:true, why:"All borrow someone’s ideas." },
            { t:"Quotations only", why:"Paraphrases borrow ideas too. " + M3 },
            { t:"Quotations and summaries only", why:"Paraphrases borrow ideas too. " + M3 },
            { t:"None, if it’s for a bibliography", why:"Every borrowed idea is cited." }],
          hints:["Is the idea yours or borrowed?", "All three are borrowed.", "All three."] },
        { id:"w5", skill:"Citation basics", goal:3, prompt:"In MLA style, which is set in <strong>italics</strong>?",
          options:[
            { t:"The title of a journal, book or website", ok:true, why:"The container is italic." },
            { t:"The title of an article", why:"Articles go in quotation marks. " + M6 },
            { t:"The author’s name", why:"Names are plain." },
            { t:"The page numbers", why:"Plain." }],
          hints:["Is it a container or a part inside one?", "Containers are italic.", "The journal, book or website."] },
        { id:"w6", skill:"Citation basics", goal:3, prompt:"Which in-text citation is correct MLA for page 120 of an article by Adaeze Okafor?",
          options:[
            { t:"(Okafor 120)", ok:true, why:"Author, then page: no comma, no “p.”." },
            { t:"(Okafor, p. 120)", why:"MLA uses no comma or “p.”" },
            { t:"(Adaeze Okafor, 2019)", why:"MLA doesn’t use the year in the parentheses." },
            { t:"(120 Okafor)", why:"The author comes first." }],
          hints:["Author, then page.", "No comma, no “p.”", "(Okafor 120)."] }
      ],
      refreshers:{
        "Primary and secondary sources":"The primary source is the text you analyse. Secondary sources comment on it. Scholarly sources are reviewed by experts and cite their evidence.",
        "Quoting and paraphrasing":"Quote exact words in quotation marks. Paraphrase the idea in your own words and structure. Summarize the main point briefly. Cite all three.",
        "Citation basics":"In-text: (Author page), e.g. (Okafor 120). Works Cited: containers in italics, parts in quotation marks, elements in MLA’s order."
      }
    }
  },
  explore:{
    heading:"Source evaluator",
    intro:"Six sources are waiting outside your essay. Question each one, take honest notes, and cite it precisely. Then decide who gets to speak.",
    m1:M1, m2:M2, m3:M3, m5:M5, m6:M6,
    aha:"<strong>The most fluent source in the room (TextPal) is the least trustworthy one.</strong> Fluency isn’t evidence: a source earns trust by showing its work.",
    crit:[
      { id:"A", t:"Authority", q:"Who wrote it, and are they accountable?" },
      { id:"E", t:"Evidence", q:"Does it show and cite its evidence?" },
      { id:"R", t:"Review", q:"Did editors or other experts check it?" },
      { id:"P", t:"Purpose", q:"Is it informing, arguing, selling or entertaining?" },
      { id:"C", t:"Currency", q:"Is it recent <em>enough</em>? For criticism, an older essay can still be essential." }],
    verdicts:[{ id:"cite", t:"Cite" }, { id:"bg", t:"Background only" }, { id:"dont", t:"Don’t use as evidence" }],
    rule:"Verdict rule: total ≥ 8 → <strong>Cite</strong>; 5–7 → <strong>Background only</strong> (ideas and context; verify before relying on it; cite it if you use its idea); ≤ 4 → <strong>Don’t use as evidence</strong>. AI chatbot answers are always “Don’t use as evidence”, whatever their total.",
    sources:SOURCES,
    passage:PASSAGE, passageCite:"Adaeze Okafor, “Borrowed Light” (fictional), page 120",
    keys:[
      { id:"K1", t:"Nick reshapes or “cleans” the story rather than just telling it." },
      { id:"K2", t:"He does it by reordering events and dwelling on beauty." },
      { id:"K3", t:"He steers readers to admire Gatsby." },
      { id:"K4", t:"Nick’s own judgement is unresolved." },
      { id:"K5", t:"The ending serves Nick’s need more than Gatsby’s." }],
    noteTypes:[{ id:"quotation", t:"Quotation" }, { id:"paraphrase", t:"Paraphrase" }, { id:"summary", t:"Summary" }],
    draft:"Nick’s narration doesn’t just tell Gatsby’s story; it cleans it. By arranging events out of order and dwelling on moments of beauty, Nick asks the reader to admire…",
    chat:{
      q:"What does the green light symbolize in " + GG + "?",
      parts:[
        { t:"The green light in " + GG + " symbolizes Gatsby’s hope for the future and his longing for Daisy. In Chapter 5, Fitzgerald writes, " },
        { id:"q1", kind:"quote", t:"“The green light is the heartbeat of the past.”", real:false },
        { t:" Critic James Wilson argues in " },
        { id:"r1", kind:"ref", t:"“Green Lights and Gold” (<em>Journal of American Letters</em>, 2015)", real:false },
        { t:" that the light represents the American Dream itself. As the novel’s final page says, " },
        { id:"q2", kind:"quote", t:"“Gatsby believed in the green light, the orgastic future that year by year recedes before us.”", real:true }],
      ask:"What are your sources?",
      answer:"Here are my sources: Fitzgerald, F. Scott. <em>The Great Gatsby</em>. 1925. Wilson, James. “Green Lights and Gold.” <em>Journal of American Letters</em>, 2015."
    },
    novel:NOVEL, library:LIB,
    wc:{ intro:"Put the core elements in MLA order, choose each element’s form, and set the punctuation after it. Then press <strong>Check</strong>.",
      template:"Author. Title of source. Title of container, Other contributors, Version, Number, Publisher, Publication date, Location. Title of second container, Location.",
      rules:["The list is titled “Works Cited”, centred.", "Entries are alphabetical by their first element, ignoring <em>A</em>, <em>An</em> and <em>The</em>.", "Each entry has a hanging indent and the list is double-spaced.", "URLs are given without “https://” (DOIs keep “https://doi.org/”)."],
      cards:CARDS,
      intext:{ s1:"(Okafor 120)", s1db:"(Okafor 120)", s2:"(“<em>Great Gatsby</em>: Chapter 3”)", s3:"(Ng)", s4:"(“Jazz Age”)", s5:"(“Explain the symbolism”)", s6:"(Lindqvist 87)", bel:"(Bélanger 52)", nov:"(Fitzgerald 180)" },
      fb:{ name:"Last name first: surname, comma, given name.", tital:"The article, post or entry is a part inside a container: quotation marks, not italics. " + M6,
        titlq:"Journals, books, websites and databases are containers: italics. " + M6, plain:"A container’s title needs italics.", pg:"MLA writes pp. for a page range.", bare:"MLA writes pp. for a page range.",
        apa:"That’s APA-style numbering. MLA writes vol. 41, no. 2.", https:"URLs are given without “https://”.", doi:"DOIs keep “https://doi.org/”.", datef:"MLA writes the day first and abbreviates the month: 14 Mar. 2022.",
        up:"MLA abbreviates University Press as UP.", edcap:"Mid-entry it’s lower case: edited by.", aiTitle:"For an AI prompt, describe the prompt in quotation marks, then the word “prompt”, in plain type.",
        order:"Core elements in MLA order: Author. Title of source. Title of container, Other contributors, Version, Number, Publisher, Publication date, Location.",
        general:"Put the elements in MLA order, choose each form, and set the punctuation: a period after the author and the title, commas inside the container, a period at the end." }
    },
    predIntro:"Make a prediction first. Then the evaluator shows you what happens.",
    predictions:[
      { id:"p1", prompt:"<em>Evaluate mode, S2 (total 2).</em> Suppose <em>QuickLit Notes</em> added a named author with a PhD, but still cited nothing and was reviewed by no one. What happens to its verdict?",
        options:[{ t:"It stays “Don’t use as evidence”: authority rises from 0 to 2, but the total is only 4", ok:true }, { t:"It becomes “Cite” because the author is an expert" }, { t:"It becomes “Background only”" }, { t:"Nothing changes, because authority doesn’t count" }],
        explain:"Credentials help, but a source still has to show its evidence and be checked." },
      { id:"p2", prompt:"<em>Notes mode, with a draft paraphrase prefilled:</em> “Nick’s narration doesn’t just tell Gatsby’s story; it cleans it. By arranging events out of order and dwelling on moments of beauty, Nick asks the reader to admire…” Three words were swapped. What will the overlap check find?",
        options:[{ t:"Several shared 4-word sequences, such as “by arranging events out” and “events out of order”: patchwriting", ok:true }, { t:"No overlap: the words were changed" }, { t:"One overlap at most" }, { t:"Overlap only in the quotation marks" }],
        explain:"Swapped synonyms in the source’s sentence shape are still the source’s sentence." },
      { id:"p3", prompt:"<em>Cite mode, the S3 entry built.</em> Delete the author “Ng, Ricky.” What becomes the first element?",
        options:[{ t:"The title, in quotation marks: “Why Nick Carraway Is a Liar.”", ok:true }, { t:"The website name, in italics" }, { t:"The date" }, { t:"“Anonymous.”" }],
        explain:"With no author, MLA begins with the title, and alphabetizes it by its first significant word." },
      { id:"p4", prompt:"<em>Evaluate mode, S5.</em> Ask TextPal, “What are your sources?” What do you predict?",
        options:[{ t:"A confident list that includes an article the library index can’t find", ok:true }, { t:"Accurate links to peer-reviewed articles" }, { t:"A refusal to answer" }, { t:"The novel’s page numbers" }],
        explain:"Chatbots can produce plausible but invented sources. Verify everything before you trust it." }
    ],
    chalIntro:"Use the evaluator to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Give all six sources a verdict: Cite, Background only, or Don’t use as evidence. <button type=\"button\" class=\"btn ghost sm rs-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Each verdict follows the evidence: totals by the rule, and the chatbot never counts as evidence.",
        hints:["Check each profile’s total against the verdict rule.", "AI answers are always “Don’t use as evidence”.", "Cite: S1, S6. Background: S3, S4. Don’t use: S2, S5."] },
      { id:"tc2", goal:2, prompt:"Write an honest paraphrase of the Okafor passage. It keeps K1, K2 and K3, shares <strong>no</strong> 4-word sequence with the source, has a signal phrase naming Okafor and the citation (120), and is 25–70 words. <button type=\"button\" class=\"btn ghost sm rs-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"Okafor’s idea in your own words and structure, credited twice over: by name and by page.",
        hints:["Read the passage, then hide it (the <strong>Hide source</strong> button).", "Explain the idea aloud as if to a friend, then write that.", "Start “According to Okafor, …” and end with (120). A model: “According to Okafor, Nick shapes Gatsby’s story rather than merely telling it: by reordering events and dwelling on beautiful moments, he steers readers toward an admiration that hides his own unresolved judgement (120).”"] },
      { id:"tc3", goal:4, stretch:true, prompt:"Catch the fabrications. In TextPal’s answer, mark each quotation and each reference as Verified or Unverified, using the check tools. <button type=\"button\" class=\"btn ghost sm rs-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"You just did what scholars do: never trust a quotation you haven’t seen in the original.",
        hints:["Search the novel for an exact phrase from each quotation.", "Search the library index for the article title.", "Two inventions, one real line."] }
    ]
  },
  part3:{
    slug:"critics", name:"Critics",
    heading:"Using critics without hiding behind them",
    intro:"Explore taught you to judge and cite sources; this part teaches you to <em>use</em> them. Let other voices strengthen your argument without taking it over.",
    moves:[{ id:"agree", t:"agree and extend" }, { id:"comp", t:"complicate" }, { id:"push", t:"push back" }, { id:"hide", t:"hiding" }, { id:"bg", t:"background only" }],
    st1:[
      { id:"m1", s:"Okafor rightly argues that Nick “launders” Gatsby’s story (120); the same laundering shapes how Nick describes Daisy.", answer:"agree", why:"She’s right, and the writer carries her idea somewhere new: to Daisy." },
      { id:"m2", s:"While Okafor shows how Nick flatters Gatsby (120), chapter 6, where Nick plainly exposes Gatsby’s invented past, suggests the laundering is never complete.", answer:"comp", why:"“While” accepts part of her claim; chapter 6 adds a limit." },
      { id:"m3", s:"Okafor overlooks the final chapter, where Gatsby’s belief in “the green light” (Fitzgerald 180) belongs to Gatsby, not Nick, and so the ending honours the dreamer as much as the narrator.", answer:"push", why:"“Overlooks” signals disagreement, and the novel supplies the evidence." },
      { id:"m4", s:"Okafor says Nick “launders” the story (120). Lindqvist says dreams are “like loans that come due” (87).", answer:"hide", why:"Two quotations, no claim: the writer has vanished. " + M4 },
      { id:"m5", s:"The 1920s saw rapid economic growth and new consumer habits (“Jazz Age”).", answer:"bg", why:"Context from the encyclopedia, not an argument about the novel." }],
    st1Wrong:"Look at what the sentence does with the critic: does it build on her, limit her, oppose her, only repeat her, or just set the scene?",
    critics:[
      { id:"oka", name:"Okafor", t:"Adaeze Okafor (S1): Nick’s narration “launders” Gatsby’s story (120)." },
      { id:"lin", name:"Lindqvist", t:"Marta Lindqvist (S6): dreams in 1920s novels are “like loans that come due” (87)." },
      { id:"bel", name:"Bélanger", t:"Thomas Bélanger: ash and gold are “twin currencies” in the novel (52)." }],
    frames:{ agree:"[Critic] rightly argues that … (page); the same … also …", comp:"While [critic] shows … (page), chapter … suggests …", push:"[Critic] overlooks …, where … (Fitzgerald page), so …" },
    hinges:["while", "however", "overlooks", "extends", "extend", "like", "although", "though", "rightly", "but", "yet", "complicates", "agree", "agrees", "same", "also", "whereas"],
    policies:[{ id:"none", t:"No AI" }, { id:"brain", t:"Brainstorming with disclosure" }, { id:"edit", t:"Editing help with disclosure" }],
    policyText:{ none:"No AI tools for any part of the ISU.", brain:"AI may be used to brainstorm topics or questions. Disclose every use. Every sentence you submit is your own.",
      edit:"AI may point out errors in your own writing (spelling, punctuation, grammar). Disclose every use. You make the fixes; the ideas and sentences stay yours." },
    rule:"Never submit AI-written sentences as your own.",
    aiCite:"“Explain the symbolism of the green light in " + GG + "” prompt. <em>TextPal</em>, 2 Feb. version, Brightline Labs, 5 Feb. 2026, textpal.example.",
    judges:[{ id:"ok", t:"OK as is" }, { id:"disc", t:"OK with disclosure and citation" }, { id:"not", t:"Not OK" }],
    scenarios:[
      { id:"a1", policy:"none", t:"Jordan asks TextPal to summarize chapter 5 instead of rereading it, then builds notes from the summary.", answer:"not", why:"The policy allows no AI at all, and a secondhand summary can drift from the novel. Reread the chapter." },
      { id:"a2", policy:"brain", t:"Priya asks TextPal for a list of possible ISU topics, picks one, and starts researching it.", answer:"disc", why:"Brainstorming is allowed here, but only with disclosure. Note the use as the policy asks." },
      { id:"a3", policy:"edit", t:"Ravi pastes his paragraph into TextPal and accepts its rewritten version of every sentence.", answer:"not", why:"Rewriting isn’t editing help: those are AI-written sentences, not his." },
      { id:"a4", policy:"none", t:"Chen finds Okafor’s article in the school library database and cites it in his Works Cited.", answer:"ok", why:"No AI was used, and a library database is a research tool. Cite the article as usual." },
      { id:"a5", policy:"brain", t:"Dana asks TextPal to write her thesis statement and submits it unchanged.", answer:"not", why:"Brainstorming doesn’t cover writing the thesis. That sentence is AI-written." },
      { id:"a6", policy:"edit", t:"Amir asks TextPal to point out comma splices in his own paragraph, then fixes them himself.", answer:"disc", why:"Editing help is allowed here with disclosure: note the use. The ideas and sentences remain his." }],
    quickCheck:{
      title:"Using critics quick check", summary:"Using critics quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which sentence keeps the student in charge?",
          choices:[{ t:"My claim first, then the critic as support", ok:true, fb:"Right. Your claim leads; critics join the conversation." },
            { t:"A critic’s quotation first, with no claim", fb:"Your claim leads; critics join the conversation." },
            { t:"Two critics’ quotations back to back", fb:"Your claim leads; critics join the conversation." },
            { t:"A summary of a critic’s whole article", fb:"Your claim leads; critics join the conversation." }] },
        { id:"q2", goal:5, prompt:"“While Okafor shows X, chapter 6 suggests Y” is which move?",
          choices:[{ t:"complicate", ok:true, fb:"Right. It accepts part of her claim and adds a limit." },
            { t:"agree and extend", fb:"It accepts part of her claim and adds a limit." },
            { t:"push back completely", fb:"It accepts part of her claim and adds a limit." },
            { t:"background", fb:"It accepts part of her claim and adds a limit." }] },
        { id:"q3", goal:6, prompt:"Your teacher allows AI for brainstorming <em>with disclosure</em>. You used TextPal to list possible topics. What do you do?",
          choices:[{ t:"Disclose it as the policy asks", ok:true, fb:"Right. Follow the policy exactly; disclosure is part of integrity." },
            { t:"Nothing; it was only ideas", fb:"Follow the policy exactly; disclosure is part of integrity." },
            { t:"Delete the history", fb:"Follow the policy exactly; disclosure is part of integrity." },
            { t:"Cite TextPal as evidence", fb:"Follow the policy exactly; disclosure is part of integrity." }] },
        { id:"q4", goal:4, prompt:"Where should every quotation of the novel come from?",
          choices:[{ t:"Your copy of the novel", ok:true, fb:"Right. Primary evidence comes from the primary source." },
            { t:"A study guide", fb:"Primary evidence comes from the primary source." },
            { t:"A chatbot", fb:"Primary evidence comes from the primary source." },
            { t:"A critic’s article", fb:"Primary evidence comes from the primary source." }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"steal-line\">“Knowledge is of two kinds. We know a subject ourselves, or we know where we can find information upon it.”</p><p class=\"eng-cite\">Samuel Johnson, in Boswell’s <em>Life of Johnson</em> (1791)</p><p><strong>The shape:</strong> a short definition sentence (“X is of two kinds.”) followed by a balanced either/or that names both kinds.</p><p><strong>Model imitation (original):</strong> “Reading is of two kinds. We listen to a book, or we argue with it.”</p><p><strong>Your turn:</strong> write your own two sentences in Johnson’s shape. Then save it to your commonplace book.</p>",
      prompt:"Your imitation (“… is of two kinds. We …, or we ….”):" }]
  },
  practice:{
    activities:[
      { id:"notes", type:"custom", title:"Quotation, paraphrase or summary?", summary:"Quotation, paraphrase or summary?", goal:[2, 3],
        instruction:"For each note, choose its type, then whether it’s correctly cited. The notes use Okafor (S1, pp. 115–38, the passage on p. 120), Lindqvist (S6) and the novel.",
        how:"Choose a type and a citation verdict for a note, then press Check.",
        types:[{ id:"quotation", t:"Quotation" }, { id:"paraphrase", t:"Paraphrase" }, { id:"summary", t:"Summary" }, { id:"patch", t:"Patchwriting" }, { id:"common", t:"Common knowledge" }],
        cites:[{ id:"yes", t:"Correctly cited" }, { id:"missing", t:"Missing its citation" }, { id:"other", t:"Cited, but something else needs fixing" }, { id:"none", t:"No citation needed" }],
        h1:"Exact words in quotation marks? Restated? Shortened?", h2:"Is it too close to the source?",
        items:[
          { id:"n1", goal:2, t:"Okafor argues that Nick’s narration “launders” Gatsby’s story (120).", answer:["quotation", "yes"], why:"An embedded quotation: one exact word in quotation marks, a signal phrase and the page." },
          { id:"n2", goal:2, t:"Okafor claims Nick reshapes the story so readers admire what he can’t judge.", answer:["paraphrase", "missing"], why:"A paraphrase, but it’s missing (120). " + M3 },
          { id:"n3", goal:2, t:"Okafor’s article reads Nick as a narrator who protects his own image by protecting Gatsby’s (115–38).", answer:["summary", "yes"], why:"The whole article’s main point, much shorter, cited with its page range." },
          { id:"n4", goal:3, t:"“By arranging events out of order and lingering on moments of beauty” (Okafor 120).", answer:["quotation", "other"], why:"Correctly cited, but it’s a fragment: it needs a signal phrase and your own sentence around it." },
          { id:"n5", goal:2, t:"Nick arranges events out of order and lingers on beautiful moments (Okafor 120).", answer:["patch", "other"], why:"Cited, but too close to the source. " + M2 },
          { id:"n6", goal:2, t:"Lindqvist reads 1920s novels as stories of debt, in which dreams must be repaid (87).", answer:["paraphrase", "yes"], why:"Her idea in new words and structure, with the page." },
          { id:"n7", goal:3, t:"The novel ends: “So we beat on, boats against the current, borne back ceaselessly into the past” (Fitzgerald 180).", answer:["quotation", "yes"], why:"Exact words, a signal phrase, and the citation after the closing quotation mark." },
          { id:"n8", goal:3, t:"The 1920s were a time of rapid change.", answer:["common", "none"], why:"Widely known facts that can be found in many general sources need no citation." }],
        fbType:{ quotation:"Are these the source’s exact words in quotation marks?", paraphrase:"A paraphrase restates one idea in your own words and structure.", summary:"A summary shrinks a whole argument to its main point.",
          patch:"Patchwriting keeps the source’s sentence shape with a few words swapped.", common:"Common knowledge is a widely known fact, not someone’s idea." },
        fbSpecial:{ "n5|paraphrase":"Check the overlap: “arranging events out of order” is the source’s own phrase.",
          "n8|cite":"Widely known facts that can be found in many general sources need no citation, but any specific claim does." },
        fbCite:{ yes:"Look again at the citation, and at how the borrowed words sit in the sentence.", missing:"Is there really no citation? Look at the end of the note.",
          other:"Is anything wrong besides the citation?", none:"Is this a widely known fact, or someone’s idea? " + M3 } },
      { id:"cases", type:"mc", title:"Integrity cases", summary:"Integrity cases", star:true, goal:[4, 6],
        instruction:"Six scenarios. Choose the best judgement and fix. Cases I3–I6 (★) sit above Final Check level.",
        how:"Choose the best judgement, then press Check.",
        items:[
          { id:"i1", goal:4, prompt:"<strong>I1.</strong> Taylor quotes the novel’s last line from <em>QuickLit Notes</em>, which says “endlessly”.",
            options:[{ t:"Misquotation: check your copy, which says “ceaselessly”, and quote the novel", ok:true, why:"The primary source is the authority on its own words." },
              { t:"Fine, it’s cited", why:"Citing a wrong quotation doesn’t fix it. " + M5 },
              { t:"Fine, if Taylor adds the website’s URL", why:"A fuller citation of a wrong quotation is still a wrong quotation." },
              { t:"Replace “endlessly” with a synonym of her own", why:"Quotations must be exact; check the novel." }],
            hints:["Where should a quotation of the novel come from?", "Your copy of the novel.", "The novel says “ceaselessly”: quote it from your copy."] },
          { id:"i2", goal:6, prompt:"<strong>I2.</strong> Kim summarizes Okafor’s whole argument in her own words, with no citation, because “it’s a summary”.",
            options:[{ t:"Plagiarism of ideas: add (Okafor 115–38) or a signal phrase", ok:true, why:"The idea is Okafor’s; credit it." },
              { t:"Summaries are fine without citations", why:M3 },
              { t:"Fine, because the words are all Kim’s", why:M3 },
              { t:"Kim should quote the whole article instead", why:"A summary is the right tool; it just needs a citation." }],
            hints:["Whose argument is it?", "Okafor’s.", "Add a signal phrase naming Okafor, or (Okafor 115–38)."] },
          { id:"i3", goal:6, star:true, prompt:"<strong>I3 ★.</strong> Sam translates a French article with an online tool and pastes the English into his essay with the French citation.",
            options:[{ t:"Still the author’s words: quote and cite the translation as such (or paraphrase and cite), and follow the teacher’s tool policy", ok:true, why:"The sentences are the author’s in any language." },
              { t:"Translation makes it his own", why:"Changing the language doesn’t change the author." },
              { t:"Fine, because the French citation is included", why:"The pasted English is presented as Sam’s prose; it isn’t." },
              { t:"Fine, as long as the tool is free", why:"Price has nothing to do with authorship." }],
            hints:["Whose ideas and sentences are these?", "The original author’s.", "Cite the translation; never present it as your own."] },
          { id:"i4", goal:6, star:true, prompt:"<strong>I4 ★.</strong> Ava’s teacher allows editing help with disclosure. She asks TextPal to fix comma splices in her own paragraph.",
            options:[{ t:"OK with disclosure: note the use as the policy asks; the ideas and sentences remain hers", ok:true, why:"The policy decides, and this use fits it." },
              { t:"Not OK: any AI use is cheating", why:"The policy decides; here it’s allowed with disclosure." },
              { t:"OK, and no disclosure is needed", why:"This policy asks for disclosure." },
              { t:"OK only if she cites TextPal as evidence", why:"Editing help isn’t evidence; she discloses it." }],
            hints:["What does this teacher’s policy allow?", "Editing help, with disclosure.", "It’s allowed: disclose it."] },
          { id:"i5", goal:6, star:true, prompt:"<strong>I5 ★.</strong> Leo reuses two paragraphs from his Grade 11 essay on a different novel, without saying so.",
            options:[{ t:"Self-plagiarism: ask the teacher first, and disclose or rewrite", ok:true, why:"Submitting old work as new needs permission." },
              { t:"It’s his own work, so it’s fine", why:"Submitting old work as new needs permission." },
              { t:"Fine, if he changes a few words", why:"That hides the reuse; it doesn’t make it new." },
              { t:"Fine, because it was a different novel", why:"It’s still old work presented as new." }],
            hints:["Is this new work for this assignment?", "No: it was submitted before.", "Ask the teacher, and disclose or rewrite."] },
          { id:"i6", goal:4, star:true, prompt:"<strong>I6 ★.</strong> Mia finds a perfect line attributed to Fitzgerald on a quotes website, but can’t find it in the novel.",
            options:[{ t:"Don’t use it unless it’s verified in the novel (or a reliable edition of his letters or essays, cited as such)", ok:true, why:"Verification comes before quotation." },
              { t:"Quote it with the website’s citation", why:"Unverified attributions are often false. " + M5 },
              { t:"Quote it, because many websites repeat it", why:"Repetition isn’t verification." },
              { t:"Paraphrase it so it doesn’t need checking", why:"An idea you can’t trace can’t be credited honestly." }],
            hints:["Where should a Fitzgerald quotation be checked?", "In the novel, or a reliable edition of his other writing.", "If you can’t verify it, don’t use it."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Wesley", goal:[3, 5, 2], how:"",
        instruction:"Wesley made one mistake in each piece. Tap the line or sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, unit:"Line", task:"Wesley’s Works Cited list, in order.",
            steps:["Fitzgerald, F. Scott. " + GG + ". 1925. Scribner, 2004.", LIN,
              "Okafor, Adaeze. <em>Borrowed Light: Narration and Guilt in The Great Gatsby</em>. “North Shore Review of Literature,” vol. 41, no. 2, 2019, pp. 115–38.", JAZZ],
            answer:2, stepFb:["Correct MLA 9 for the novel.", "Correct.", "", "Correct form, but it’s out of alphabetical order after Okafor; the first mistake is earlier."],
            fixes:[{ t:OKA, ok:true, why:"The article is in quotation marks; the journal, its container, is italic." },
              { t:"Keep line 3; move line 4 to the top.", why:"Alphabetical order matters too, but line 3 swaps italics and quotation marks. " + M6 },
              { t:"Okafor, Adaeze. Borrowed Light. North Shore Review, 2019.", why:"Missing elements, and no italics or quotation marks. " + M6 },
              { t:"Line 3 is correct.", why:"The article title belongs in quotation marks; the journal, its container, in italics." }],
            hints:["Article or journal: which is the container?", "Journal = italics; article = quotation marks.", "Swap them in line 3."] },
          { id:"e2", goal:5, unit:"Sentence", task:"Wesley’s paragraph on Nick as narrator.",
            steps:["Adaeze Okafor writes that Nick’s narration “launders” Gatsby’s story (120).", "Marta Lindqvist writes that dreams in such novels are “like loans that come due” (87).",
              "Thomas Bélanger writes that ash and gold are “twin currencies” in the novel (52).", "Therefore Nick is an unreliable narrator."],
            answer:0, stepFb:["", "Another critic, but still no claim of Wesley’s own; the first slip came earlier.", "Same pattern.", "A claim at last, but it arrives unearned at the end."],
            fixes:[{ t:"Begin with Wesley’s own claim, for example: “Nick protects himself by protecting Gatsby’s legend,” then bring in Okafor to support it.", ok:true, why:"Now the paragraph is Wesley’s, and Okafor supports it." },
              { t:"Add a fourth critic before sentence 4.", why:"More voices won’t make the paragraph Wesley’s. " + M4 },
              { t:"Delete all the quotations.", why:"Critics can help; they just shouldn’t lead." },
              { t:"Sentence 1 is correct.", why:"A paragraph that opens with a critic’s claim lets the critic own it. " + M4 }],
            hints:["Whose claim does the paragraph open with?", "Okafor’s, not Wesley’s.", "Lead with your claim; use critics as support."] },
          { id:"e3", goal:2, unit:"Sentence", task:"Wesley’s paraphrase of Okafor (p. 120).",
            steps:["Nick’s narration does not simply tell Gatsby’s story; it cleans it.", "By arranging events out of order and lingering on beautiful moments, Nick invites readers to admire Gatsby.", "In this way the ending belongs to the narrator."],
            answer:0, stepFb:["", "Also too close: “by arranging events out of order”.", "Closer to his own words, but still uncited."],
            fixes:[{ t:"“According to Okafor, Nick shapes Gatsby’s story rather than merely recounting it, and in doing so he guides readers toward an admiration that hides his own unresolved judgement (120).”", ok:true, why:"Her idea, Wesley’s words and structure, with a signal phrase and the page." },
              { t:"Change “cleans” to “washes” and add (120).", why:"Still the source’s sentence shape: patchwriting. " + M2 },
              { t:"Put sentences 1–3 in quotation marks.", why:"Then it must be an exact quotation, and it isn’t exact." },
              { t:"Sentence 1 is correct.", why:"It copies the structure and most of the words of the source. " + M2 }],
            hints:["Run the overlap check on sentence 1.", "“Nick’s narration does not simply” is the source’s phrase.", "Rewrite in your own structure, with a signal phrase and (120)."] }
        ] }
    ]
  },
  reflect:{
    blocks:[
      { title:"Commonplace book", html:"<p>Save one sentence, from Johnson, from a critic in this module, or from your own ISU research, that shows how ideas travel between people. Add one sentence on why it matters to you.</p><div id=\"cp-app\"></div>" }
    ],
    journal:[
      { id:"j1", q:"Which source surprised you most: the fluent chatbot, the misquoting study guide, or the blog with a good idea? Why?" },
      { id:"j2", q:"In your own words: what’s the difference between paraphrasing and patchwriting, and why does it matter?" },
      { id:"j3", q:"Explain to a friend how to use a critic without letting the critic take over your paragraph." },
      { id:"j4", q:"What is your teacher’s policy on AI tools for the ISU, and what will you do to follow it with confidence?" }
    ],
    art:{
      intro:"Write one principle about using other people’s words honestly and powerfully. Add a master’s example (Johnson’s sentences, or a well-integrated critic sentence from this module) and your own imitation.",
      placeholder:"Your principle about using other people’s words honestly and powerfully (at least 6 words)",
      examples:["Knowledge is of two kinds. We know a subject ourselves, or we know where we can find information upon it. (Johnson)",
        "While Okafor shows how Nick flatters Gatsby (120), chapter 6, where Nick plainly exposes Gatsby’s invented past, suggests the laundering is never complete.",
        "Okafor overlooks the final chapter, where Gatsby’s belief in “the green light” (Fitzgerald 180) belongs to Gatsby, not Nick, and so the ending honours the dreamer as much as the narrator."]
    },
    artSamples:"<details class=\"alg art-samples\"><summary>Two sample principles (models only; write your own)</summary><p class=\"an-note an-syntax\">“Lead with your claim; let critics follow.” <span class=\"muted\">Master: “While Okafor shows how Nick flatters Gatsby (120), chapter 6… suggests the laundering is never complete.” My imitation: “While Lindqvist reads dreams as debts (87), Daisy’s voice suggests some debts are never called in.”</span></p><p class=\"an-note an-sound\">“Never quote what you haven’t seen in the original.” <span class=\"muted\">Master: Johnson’s “we know where we can find information upon it”. My imitation: “I know where my quotation lives: page 180, in my own copy.”</span></p></details>",
    commonplaceLines:["Knowledge is of two kinds. We know a subject ourselves, or we know where we can find information upon it. (Johnson)",
      "Nick’s narration does not simply report Gatsby’s story; it launders it. (Okafor, fictional critic)",
      "So we beat on, boats against the current, borne back ceaselessly into the past. (Fitzgerald)"],
    cpNote:"Why it matters to you"
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which source is <strong>peer-reviewed</strong>?", options:[
          { t:"An article in a scholarly journal whose submissions are evaluated by other experts before publication", ok:true, why:"Peer review means experts check it before it’s published." },
          { t:"A popular website with many visitors", why:"Traffic isn’t review." },
          { t:"A chatbot’s answer to your question", why:M1 },
          { t:"A blog written by a teacher", why:"Expertise, but no outside review." }] },
        b:{ prompt:"A <strong>secondary source</strong> for an ISU essay is…", options:[
          { t:"a work that analyses or comments on the novel you’re studying", ok:true, why:"It comments on the primary source." },
          { t:"the novel itself", why:"That’s the primary source." },
          { t:"your own notes", why:"Those are your working notes, not a source." },
          { t:"any website", why:"Many websites aren’t sources you should cite." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which is the correct MLA 9 Works Cited entry?", options:[
          { t:OKA, ok:true, why:"Article in quotation marks, journal in italics, elements in MLA order." },
          { t:"Okafor, Adaeze. <em>Borrowed Light: Narration and Guilt in The Great Gatsby</em>. “North Shore Review of Literature,” vol. 41, no. 2, 2019, pp. 115–38.", why:"Italics and quotation marks are swapped." },
          { t:"Adaeze Okafor. “Borrowed Light.” <em>North Shore Review of Literature</em>, 2019.", why:"Surname first, and elements are missing." },
          { t:"Okafor, Adaeze (2019). “Borrowed Light: Narration and Guilt in " + GG + ".” North Shore Review of Literature, 41(2), 115–38.", why:"That’s APA-style punctuation, not MLA." }] },
        b:{ prompt:"Which is the correct MLA 9 Works Cited entry for a book?", options:[
          { t:LIN, ok:true, why:"A book is a container: italics, then publisher and date." },
          { t:"Lindqvist, Marta. “Dreamers and Debts: The American Novel, 1920–1940.” Harbourfront UP, 2016.", why:"Books are containers: italics." },
          { t:"Marta Lindqvist. <em>Dreamers and Debts</em>. 2016, Harbourfront UP.", why:"Surname first; publisher before date." },
          { t:"Lindqvist, M. (2016). <em>Dreamers and Debts</em>. Harbourfront University Press.", why:"APA style, not MLA." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which best describes <strong>patchwriting</strong>?", options:[
          { t:"Copying a source’s sentence structure while swapping in a few synonyms", ok:true, why:M2 },
          { t:"Combining quotations from several critics", why:"That’s hiding behind critics, a different problem." },
          { t:"Writing a summary that’s too short", why:"Length isn’t the issue." },
          { t:"Quoting a source with a citation", why:"That’s legitimate quotation." }] },
        b:{ prompt:"Which note is an honest <strong>paraphrase</strong> of “Nick’s narration does not simply report Gatsby’s story; it launders it” (Okafor 120)?", options:[
          { t:"“Okafor suggests that Nick reshapes Gatsby’s story instead of just telling it (120).”", ok:true, why:"New words, new structure, a signal phrase and the page." },
          { t:"“Nick’s narration does not just report Gatsby’s story; it cleans it (Okafor 120).”", why:"Patchwriting. " + M2 },
          { t:"“Nick reshapes Gatsby’s story instead of just telling it.”", why:"No citation. " + M3 },
          { t:"“Okafor says the narration ‘does not simply report Gatsby’s story’ (120), which is true.”", why:"That’s a quotation, not a paraphrase." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"You need evidence for an argument about Nick’s reliability. Which source is best to <strong>cite</strong>?", options:[
          { t:"Okafor’s peer-reviewed article, which analyses Nick’s narration with documented evidence", ok:true, why:"Accountable, documented and reviewed." },
          { t:"<em>QuickLit Notes</em>’ chapter summary", why:"No author, no evidence, and it misquotes the novel." },
          { t:"TextPal’s answer", why:"Unverified, and it contains inventions." },
          { t:"Ng’s blog post", why:"Good for ideas; it’s unreviewed, so look for scholarship to cite." }] },
        b:{ prompt:"Ng’s blog makes a sharp point you want to develop. What’s the best use of it?", options:[
          { t:"Treat it as a lead: test the idea against the novel, look for scholarly support, and cite the blog if you use its idea", ok:true, why:"Background only, verified, and credited." },
          { t:"Quote it as your main evidence", why:"Unreviewed opinion shouldn’t carry an argument." },
          { t:"Use the idea without citing it, since it’s only a blog", why:M3 },
          { t:"Ignore it completely because blogs are worthless", why:"Blogs can spark good ideas; they just need checking." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A chatbot says a critic wrote “Gatsby is a mirror with no face” in a 2015 article, but no library index lists the article. What’s the best conclusion?", options:[
          { t:"Treat it as unverified and possibly invented: don’t quote it unless you can find the original", ok:true, why:"No original, no quotation." },
          { t:"Quote it and cite the chatbot", why:"Citing the chatbot doesn’t verify the critic." },
          { t:"Quote it, because chatbots summarize real sources", why:"Chatbots can produce plausible but invented sources. " + M5 },
          { t:"Quote it with the year 2015, because the year sounds precise", why:"Precision isn’t proof." }] },
        b:{ prompt:"A study guide quotes the novel’s last line as “…borne back endlessly into the past.” Your copy says “ceaselessly.” What’s best?", options:[
          { t:"Quote your copy of the novel, the primary source, and treat the guide as unreliable", ok:true, why:"The primary source decides." },
          { t:"Quote the guide, because guides are written by experts", why:M1 },
          { t:"Average the two by using neither word", why:"Quotations must be exact." },
          { t:"Use “endlessly” and cite the guide", why:"A cited misquotation is still a misquotation." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Okafor argues that Nick “launders” Gatsby’s story (120). You notice that in chapter 6 Nick plainly reveals Gatsby’s invented past. Which move fits best?", options:[
          { t:"Complicate: agree that Nick shapes the story, but show that he also exposes Gatsby, so the laundering is incomplete", ok:true, why:"Your evidence limits her claim without erasing it." },
          { t:"Agree and extend: chapter 6 proves Okafor completely right", why:"Chapter 6 cuts against her, at least partly." },
          { t:"Push back: Okafor is entirely wrong", why:"Your evidence limits her claim; it doesn’t erase it." },
          { t:"Hide: quote Okafor and say nothing", why:M4 }] },
        b:{ prompt:"Lindqvist argues that dreams in 1920s novels are “like loans that come due” (87). You notice that Gatsby’s dream is paid for by others, like Myrtle and George Wilson. Which move fits best?", options:[
          { t:"Agree and extend: the debt image fits, and the novel shows the loan being collected from people who never borrowed", ok:true, why:"Your evidence supports her and carries the idea further." },
          { t:"Push back: Lindqvist is wrong about debt", why:"Your evidence supports her idea." },
          { t:"Background only: debts are just context", why:"This is an argument, not context." },
          { t:"Hide: quote Lindqvist twice", why:M4 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which sentence best integrates a critic while keeping the student’s voice in charge?", options:[
          { t:"“Nick protects his own image by protecting Gatsby’s, which is why, as Okafor puts it, his narration ‘launders’ the story (120).”", ok:true, why:"The student’s claim leads; Okafor supports it." },
          { t:"“Okafor says, ‘Nick’s narration does not simply report Gatsby’s story; it launders it’ (120).”", why:"A quotation with no claim of the student’s own. " + M4 },
          { t:"“Okafor’s article is about Nick.”", why:"A topic, not an argument." },
          { t:"“Nick launders the story.”", why:"Okafor’s idea, uncited. " + M3 }] },
        b:{ prompt:"Which sentence best <strong>pushes back</strong> on a critic, with evidence?", options:[
          { t:"“Okafor overlooks the final chapter, where Gatsby’s belief in ‘the green light’ (Fitzgerald 180) belongs to Gatsby himself, so the ending honours the dreamer as much as the narrator.”", ok:true, why:"A clear objection, grounded in the novel." },
          { t:"“Okafor is wrong.”", why:"A verdict with no evidence." },
          { t:"“I don’t like Okafor’s article.”", why:"A preference, not an argument." },
          { t:"“Okafor overlooks things, as Lindqvist says (87).”", why:"Hides behind a second critic. " + M4 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which in-text citation is correct MLA for Ng’s blog post, which has no page numbers?", options:[
          { t:"(Ng)", ok:true, why:"No page numbers: the author alone." },
          { t:"(Ng, n.p.)", why:"MLA doesn’t use “n.p.” in the parentheses." },
          { t:"(Ng 2022)", why:"MLA doesn’t add the year." },
          { t:"(readinginthedark.example)", why:"The author comes first." }] },
        b:{ prompt:"Which in-text citation is correct MLA for the unsigned encyclopedia entry “Jazz Age”?", options:[
          { t:"(“Jazz Age”)", ok:true, why:"With no author, the title in quotation marks." },
          { t:"(Anonymous)", why:"Use the title when there’s no author." },
          { t:"(<em>Northern Encyclopedia of Literature</em>)", why:"Use the entry’s title, not the container." },
          { t:"(Jazz Age 2018)", why:"Quotation marks, no year." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Your teacher allows AI tools for brainstorming only, with disclosure. You used TextPal to list possible ISU topics. What should you do?", options:[
          { t:"Disclose the use as the policy asks, and write every sentence of the essay yourself", ok:true, why:"Follow the policy exactly." },
          { t:"Nothing: brainstorming doesn’t count", why:"The policy asks for disclosure." },
          { t:"Cite TextPal as evidence for your thesis", why:"Brainstorming help isn’t evidence." },
          { t:"Use TextPal to write the introduction, since the topic came from it", why:"The policy allows brainstorming only." }] },
        b:{ prompt:"Your teacher bans AI tools for the ISU. A friend says grammar checkers are AI too. What’s best?", options:[
          { t:"Ask your teacher which tools count before using any", ok:true, why:"When a policy is unclear, ask the person who set it." },
          { t:"Use any tool your friend thinks is fine", why:"Your teacher’s policy decides." },
          { t:"Use AI as long as you don’t get caught", why:"That’s a breach of integrity." },
          { t:"Stop writing until the policy changes", why:"Ask; don’t stall." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Three days before your ISU is due, you can find only a study guide about your novel. What’s the best plan?", options:[
          { t:"Ask your school librarian for help finding a scholarly source, and meanwhile build your argument from your own close reading of the novel", ok:true, why:"Get help, and keep the novel as your primary evidence." },
          { t:"Cite the study guide as your main secondary source", why:M1 },
          { t:"Ask a chatbot for critics’ quotations to use", why:M5 },
          { t:"Skip secondary sources and don’t mention it", why:"Ask for help, and be transparent with your teacher." }] },
        b:{ prompt:"You find an excellent critical essay on your novel from the 1950s. Is it usable?", options:[
          { t:"Yes: literary criticism can stay valuable; note its date, and check whether later critics have responded to it", ok:true, why:M7 },
          { t:"No: anything older than ten years is outdated", why:M7 },
          { t:"Only if a chatbot confirms it", why:M1 },
          { t:"Only if you remove the date from the citation", why:"Never hide a date." }] } }
    ]
  },
  task:{
    title:"Annotated bibliography and a critic conversation", summary:"Annotated bibliography and a critic conversation",
    statement:"<p>Build a three-source annotated bibliography, then write one paragraph that puts a critic in conversation with your own claim. Use the module’s sources (about " + GG + ") or your own ISU sources.</p><p><strong>What you make:</strong> (1) three Works Cited entries, built in the citation builder and alphabetized, each with a 40–90-word annotation that summarizes, evaluates and plans its use; (2) one paragraph of 100–200 words that opens with a claim you tag as <strong>My claim</strong>, brings in at least one critic from your bibliography, and uses at least one novel quotation with a citation; (3) a craft statement of at least 50 words.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class=\"alg\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Criterion</th><th scope=\"col\">Level 1</th><th scope=\"col\">Level 2</th><th scope=\"col\">Level 3</th><th scope=\"col\">Level 4</th></tr></thead><tbody><tr><td>Knowledge: MLA 9 and integrity</td><td>Frequent errors; uncited ideas</td><td>Some errors</td><td>Accurate entries and citations</td><td>Flawless entries; scrupulous attribution</td></tr><tr><td>Thinking: source evaluation</td><td>Annotations only summarize</td><td>Some evaluation</td><td>Evaluates and plans the use of each source</td><td>Weighs strengths and limits insightfully</td></tr><tr><td>Communication: critic conversation</td><td>Hides behind critics</td><td>The student’s claim is present but weak</td><td>A clear claim with a purposeful move</td><td>An authoritative voice; the critic deepens the argument</td></tr><tr><td>Application: use of evidence</td><td>Novel evidence missing or misquoted</td><td>Evidence present, loosely tied</td><td>Accurate novel evidence tied to the claim</td><td>Precise evidence that tests the critic’s claim</td></tr></tbody></table></div></details>",
    checks:["Three sources", "MLA 9 form", "Alphabetical", "Annotations that evaluate and plan", "A critic in the conversation", "Your own claim", "A move", "Paragraph length", "Craft statement"],
    tips:["Add or remove entries to make exactly three.", "Open the citation builder: it shows which element is in the wrong slot.", "Alphabetize by the first word of each entry, skipping <em>A</em>, <em>An</em> and <em>The</em>.",
      "Say what the source argues, how useful it is, and how you’ll use it.", "Bring one of your bibliography’s critics into the paragraph, with a citation.", "Your claim should be yours: no quotation and no citation in that sentence.",
      "Signal your move: agree and extend, complicate, or push back.", "Aim for 100–200 words.", "Explain your choices in at least 50 words."],
    annWords:["useful", "I will use", "I can use", "will help", "limitation", "however"],
    moveWords:["agree", "extends", "while", "however", "overlooks", "complicates", "although", "but"],
    explainPrompt:"Craft statement: Which critic did you put in conversation with your claim, and which move did you choose (agree and extend, complicate, push back)? Why that move? How did you make sure every borrowed word and idea was credited?",
    explainLabel:"Craft statement",
    vocab:"Use the words secondary source, paraphrase, citation and claim.",
    success:"Your sources are judged, cited and in conversation with you. Try a different move with the same critic and notice how the paragraph’s argument shifts.",
    more:"Each combination of sources is a different answer.",
    bank:["s1", "s1db", "s2", "s3", "s4", "s5", "s6", "bel", "nov"],
    own:[{ id:"last", t:"Author’s surname (leave blank if none)" }, { id:"first", t:"Author’s given name(s)" }, { id:"title", t:"Title of source" }, { id:"cont", t:"Title of container (journal, book, website)" },
      { id:"pub", t:"Publisher" }, { id:"date", t:"Publication date" }, { id:"loc", t:"Location (pages, or URL without https://)" }],
    models:[
      { title:"Model 1: Agree and extend", wc:[
          [BEL, "Bélanger traces ash and gold as paired images, arguing that the novel’s glamour is built on what it throws away. His reading of the valley of ashes is detailed and well documented. It will help me connect Nick’s beautiful descriptions to the costs they hide, though he says little about narration itself."],
          [LIN, "Lindqvist reads 1920s novels as stories of debt, in which dreams behave like loans that must be repaid. Her chapter on Fitzgerald is useful because it gives me language for who pays for Gatsby’s dream. I will use her debt image to extend Okafor’s argument about Nick’s narration."],
          [OKA, "Okafor argues that Nick reshapes Gatsby’s story so readers admire what he cannot judge. Her close readings of the final chapter are persuasive and carefully documented. I will use her idea of “laundering” to frame my claim about Nick’s reliability, while testing it against chapter 6."]],
        para:"Nick’s narration does not only flatter Gatsby; it also moves the cost of Gatsby’s dream onto other people. Adaeze Okafor argues that Nick “launders” Gatsby’s story by lingering on its beauty (120), and her reading extends further than she takes it. Marta Lindqvist observes that dreams in such novels behave “like loans that come due” (87), and Nick’s account fits that pattern: he dwells on the “blue gardens” where “men and girls came and went like moths” (Fitzgerald 39; ch. 3), while the bill arrives in the valley of ashes. The laundering Okafor describes is also an accounting trick, one that charges Myrtle, George Wilson and finally Gatsby himself for a dream Nick prefers to admire." },
      { title:"Model 2: Complicate", wc:[
          [JAZZ, "This unsigned entry gives a reliable overview of 1920s American culture, including prohibition and the consumer boom, and notes that Fitzgerald popularized the phrase. It is useful only as background: it offers no analysis of the novel. I will use it to set the scene in my introduction, not to support my argument."],
          [NG, "Ng, a teacher writing on his book blog, argues that Nick’s claim to honesty is a lie because he hides his part in the affair. The post is lively but unreviewed, so it has limitations as evidence. However, it sharpened my question, and I will use it as a view to complicate rather than as authority."],
          [OKA, "Okafor argues that Nick reshapes Gatsby’s story so readers admire what he cannot judge. Her evidence is careful and her argument is persuasive. I will use her account of Nick’s divided judgement to complicate the simpler view that Nick simply lies."]],
        para:"Nick is less a liar than a narrator who cannot see the shape of his own bias. When Nick claims, “I am one of the few honest people that I have ever known” (Fitzgerald 59; ch. 3), Ricky Ng reads the line as proof that Nick is lying (Ng). That judgement is too simple. Adaeze Okafor shows that Nick “invites the reader to admire what he himself can neither fully condemn nor fully forgive” (120), which suggests divided loyalty rather than deliberate deceit. However, a narrator who cannot condemn may still mislead. The novel asks us to read Nick the way he refuses to read himself: closely, and against the grain of his own praise." },
      { title:"Model 3: Push back", wc:[
          [LIN, "Lindqvist argues that 1920s novels treat dreams as debts that come due. Her account is useful for seeing who pays for Gatsby’s ambitions. However, her focus on economics leaves little room for the novel’s final tone of wonder, which is where I will build my counter-argument."],
          [NG, "Ng argues that Nick’s self-description as honest is ironic. As an unreviewed blog post it has limitations, but it is useful as an example of the common view that Nick is untrustworthy. I can use it to show that my reading of the ending runs against a popular interpretation."],
          [OKA, "Okafor argues that the novel’s final images belong to Nick more than to Gatsby. Her evidence is strong, which makes her the critic I most need to answer. I will use her claim as the position my paragraph pushes back against."]],
        para:"The novel’s ending belongs to Gatsby after all. Adaeze Okafor argues that the final images “belong less to Gatsby than to the narrator who needs Gatsby to have been great” (120), but she overlooks how the last page shifts from Nick’s judgement to Gatsby’s belief. “Gatsby believed in the green light, the orgastic future that year by year recedes before us” (Fitzgerald 180; ch. 9): the sentence grants Gatsby a faith Nick can only describe, not share. Although Nick holds the pen, the dreamer holds the image. The ending honours the capacity to hope, even as it shows that hope receding, and that double movement is Gatsby’s, not Nick’s." }
    ],
    modelNote:"Each model passes every line; the Fitzgerald page numbers are illustrative. The tagged claim is the first sentence."
  },
  cards:[
    ["Primary source", "The text you analyse: your novel."],
    ["Secondary source", "A work that analyses or comments on the primary source."],
    ["Peer review", "Experts evaluate a scholarly article before it is published."],
    ["Five questions for a source", "Authority · Evidence · Review · Purpose · Currency."],
    ["Paraphrase", "The idea in your own words <em>and</em> structure, cited."],
    ["Patchwriting", "The source’s sentence with synonyms swapped. Still plagiarism."],
    ["Summary", "The main point, much shorter, cited."],
    ["Container (MLA)", "The larger whole holding a source (journal, book, website), in <em>italics</em>."],
    ["In-text citation", "(Okafor 120); no page: (Ng); no author: (“Jazz Age”)."],
    ["Critic moves", "Agree and extend · complicate · push back, always after your own claim."],
    ["Invented citation", "A plausible but non-existent quotation or source, as AI tools can produce. Verify everything."],
    ["<em>Plagiarius</em>", "Latin “kidnapper”: Martial’s word for a poet who stole his verses."]
  ]
};
