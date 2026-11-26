// ENG4U 13 What is "Canadian Literature"? Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/13-what-is-canlit.md
// Public-domain texts, checked word for word (typographic quotes and apostrophes only):
//  McCrae, "In Flanders Fields": In Flanders Fields and Other Poems (1919), Project Gutenberg #353 (the printed text, not the
//    manuscript facsimile in the same file). Lines 1–15.
//  Lampman, "Heat": Among the Millet (1888), pp. 12–13 (archive.org scan amongmilletother00lampuoft; also Gutenberg #12413).
//    The poem has 48 lines in six 8-line stanzas, so its last two lines are 47–48 (the plan's 31–32 is corrected here).
//  Johnson, "The Song My Paddle Sings", line 1: Flint and Feather (Wikisource text of the 1914 printing of the 1912 collection).
//    The White Wampum (1895) Gutenberg text reads "West wind blow from your prairie nest?"; Flint and Feather's punctuation is used.
//  Leacock, Sunshine Sketches of a Little Town (1912), ch. 1 "The Hostelry of Mr. Smith", opening: 1912 John Lane first-edition
//    scans (archive.org sunshinesketches00leac_1 and sunshinesketches00leac) and Gutenberg #3533 (pglaf mirror); all agree.
//  Moodie, Roughing It in the Bush (Bentley, 1852), vol. 1, ch. V "Our First Settlement, and the Borrowing System", pp. 82–84:
//    checked against the 1852 scan (archive.org roughingitinbush01mood) and Gutenberg #4389. Two omissions marked [. . .];
//    "[Moodie]" is an editorial insertion (he = her husband, J. W. Dunbar Moodie).
// Frye and Atwood: only the short quotations the plan supplies (fair dealing, course plan §3), with credit.
// VERIFY: Frye and Atwood wording and page numbers against the class editions (Frye, "Conclusion," Literary History of Canada,
//   1965, also in The Bush Garden, 1971; Atwood, Survival, 1972). The page numbers are left out of student text until confirmed.
// Modern works in the collection are named and described only; the one-line descriptions are written for this module.

const MCCRAE = ["In Flanders fields the poppies blow", "Between the crosses, row on row,", "That mark our place; and in the sky", "The larks, still bravely singing, fly", "Scarce heard amid the guns below.", "",
  "We are the Dead. Short days ago", "We lived, felt dawn, saw sunset glow,", "Loved and were loved, and now we lie,", "In Flanders fields.", "",
  "Take up our quarrel with the foe:", "To you from failing hands we throw", "The torch; be yours to hold it high.", "If ye break faith with us who die", "We shall not sleep, though poppies grow", "In Flanders fields."];
const HEAT1 = "From plains that reel to southward, dim,";
const HEAT47 = "In the full furnace of this hour";
const HEAT48 = "My thoughts grow keen and clear.";
const FURNACE = HEAT47 + " / " + HEAT48;
const PADDLE = "West wind, blow from your prairie nest,";
const LEACOCK = "I don’t know whether you know Mariposa. If not, it is of no consequence, for if you know Canada at all, you are probably well acquainted with a dozen towns just like it.";
const MOODIE = [
  "The scenery through which we were passing was so new to me, so unlike anything that I had ever beheld before, that in spite of its monotonous character, it won me from my melancholy, and I began to look about me with considerable interest. Not so my English servant, who declared that the woods were frightful to look upon; that it was a country only fit for wild beasts; that she hated it with all her heart and soul, and would go back as soon as she was able.",
  "[. . .] Just then, the carriage turned into a narrow, steep path, overhung with lofty woods, and after labouring up it with considerable difficulty, and at the risk of breaking our necks, it brought us at length to a rocky upland clearing, partially covered with a second growth of timber, and surrounded on all sides by the dark forest.",
  "[. . .] I begged the man to stay until he [Moodie] arrived, as I felt terrified at being left alone in this wild, strange-looking place."];
const FRYE_Q = "“is less perplexed by the question ‘Who am I?’ than by some such riddle as ‘Where is here?’”";
const ATWOOD_Q = "“The central symbol for Canada [. . .] is undoubtedly Survival, la Survivance”";
const FRYE_CREDIT = "Northrop Frye, “Conclusion,” <i>Literary History of Canada</i>, edited by Carl F. Klinck, U of Toronto P, 1965 (also in <i>The Bush Garden</i>, 1971)";
const ATWOOD_CREDIT = "Margaret Atwood, <i>Survival: A Thematic Guide to Canadian Literature</i>, House of Anansi, 1972";

// misconception core sentences (plan §3)
const M1 = "Each definition is a choice. Mistry writes about India from Toronto; McCrae’s poem is set in Belgium. Are they Canadian literature?";
const M2 = "Someone chose those books for reasons. Ask what the choosers valued, and whom they left out.";
// VERIFY: Indigenous storytelling framing (M3) with the board's Indigenous education lead.
const M3 = "Indigenous storytelling is older than Canada and still alive, in oral and written forms, today.";
const M4 = "A thesis that explains everything explains nothing. Look for the text that doesn’t fit.";
const M5 = "Moodie writes as an English gentlewoman newly arrived in the bush. Her Canada isn’t Johnson’s, or anyone else’s.";
const M6 = "Report the thesis, then test it. Your conclusion comes after the evidence.";
const SET = (m) => " <button type='button' class='btn ghost sm cl-setup' data-setup='" + m + "'>Set it up</button>";

// The collection (plan §4, fixed data). reg: map regions (works set outside Canada have none and sit in "Elsewhere").
// VERIFY: every one-line description below; the Indigenous authors' descriptions (4, 12, 18) with the Indigenous education lead.
const WORKS = [
  { n:1, t:"<i>Roughing It in the Bush</i>", au:"Susanna Moodie", yr:1852, form:"Memoir", era:"settler", set:"Upper Canada (Ontario)", reg:["on"], lang:"en", langT:"English", ind:"", pas:"moodie",
    d:"An English gentlewoman’s sketches of settling in the backwoods of Upper Canada in the 1830s, written partly as a warning to genteel emigrants." },
  { n:2, t:"“Heat”", au:"Archibald Lampman", yr:1888, form:"Poetry", era:"conf", set:"Ontario", reg:["on"], lang:"en", langT:"English", ind:"", pas:"lampman",
    d:"A speaker rests by a dusty country road at noon in midsummer, and finds that the heat sharpens his mind." },
  { n:3, t:"<i>Anne of Green Gables</i>", au:"L. M. Montgomery", yr:1908, form:"Fiction", era:"early", set:"Prince Edward Island", reg:["atl"], lang:"en", langT:"English", ind:"",
    d:"An orphan girl sent by mistake to a Prince Edward Island farm delights in its landscape and wins over the people around her." },
  // VERIFY: Johnson description (Mohawk and English heritage; poems of the canoe and of Indigenous history and identity).
  { n:4, t:"<i>Flint and Feather</i>", au:"E. Pauline Johnson (Tekahionwake)", yr:1912, form:"Poetry", era:"early", set:"Ontario and across Canada", reg:["on"], lang:"en", langT:"English", ind:"Mohawk", pas:"johnson",
    d:"The collected poems of a Mohawk and English poet-performer: canoe songs, landscapes, and poems on Indigenous history and identity." },
  { n:5, t:"<i>Sunshine Sketches of a Little Town</i>", au:"Stephen Leacock", yr:1912, form:"Fiction", era:"early", set:"Ontario", reg:["on"], lang:"en", langT:"English", ind:"", pas:"leacock",
    d:"Affectionate comic sketches of Mariposa, a small Ontario town, told by a wry narrator who talks straight to “you”." },
  // VERIFY: McCrae's circumstances of composition (a Canadian army doctor, near Ypres, May 1915).
  { n:6, t:"“In Flanders Fields”", au:"John McCrae", yr:1915, form:"Poetry", era:"early", set:"Belgium (written in wartime)", reg:[], away:"Belgium", lang:"en", langT:"English", ind:"", pas:"mccrae",
    d:"A rondeau in the voice of dead soldiers, written by a Canadian army doctor near Ypres during the First World War." },
  { n:7, t:"<i>As For Me and My House</i>", au:"Sinclair Ross", yr:1941, form:"Fiction", era:"mid", set:"Prairies", reg:["prairies"], lang:"en", langT:"English", ind:"",
    d:"The diary of a minister’s wife in a drought-stricken prairie town during the Depression, isolated as the wind and dust press in." },
  { n:8, t:"<i>The Tin Flute</i> (<i>Bonheur d’occasion</i>)", au:"Gabrielle Roy", yr:1945, form:"Fiction", era:"mid", set:"Quebec (Montreal)", reg:["qc"], lang:"fr", langT:"French (in translation)", ind:"",
    d:"A working-class family struggles with poverty in wartime Montreal. Written in French; widely read in English translation." },
  { n:9, t:"<i>Kamouraska</i>", au:"Anne Hébert", yr:1970, form:"Fiction", era:"boom", set:"Quebec", reg:["qc"], lang:"fr", langT:"French (in translation)", ind:"",
    d:"In snowbound nineteenth-century Quebec, a woman relives a love affair and a murder. Written in French; read here in translation." },
  { n:10, t:"<i>Obasan</i>", au:"Joy Kogawa", yr:1981, form:"Fiction", era:"plural", set:"British Columbia and Alberta", reg:["bc", "prairies"], lang:"en", langT:"English", ind:"",
    d:"A Japanese Canadian woman remembers how her family was forcibly removed from the coast by its own government during the Second World War." },
  { n:11, t:"<i>The Handmaid’s Tale</i>", au:"Margaret Atwood", yr:1985, form:"Fiction", era:"plural", set:"A future United States", reg:[], away:"A future United States", lang:"en", langT:"English", ind:"",
    d:"A dystopian novel set in a future theocracy that has replaced the United States, told by a woman whose freedoms have been taken away." },
  // VERIFY: Highway description (seven women from a reserve on Manitoulin Island set out for "the biggest bingo in the world";
  //   the play uses Cree and Ojibwe words) and the language note.
  { n:12, t:"<i>The Rez Sisters</i>", au:"Tomson Highway", yr:1986, form:"Drama", era:"plural", set:"Ontario (Manitoulin Island)", reg:["on"], lang:"en", langT:"English, with Cree and Ojibwe words", ind:"Cree",
    d:"A comic, moving play about seven women from a reserve on Manitoulin Island who set out together to win the biggest bingo in the world." },
  { n:13, t:"<i>In the Skin of a Lion</i>", au:"Michael Ondaatje", yr:1987, form:"Fiction", era:"plural", set:"Ontario (Toronto)", reg:["on"], lang:"en", langT:"English", ind:"",
    d:"Immigrant workers build early twentieth-century Toronto’s bridges and waterworks, in a novel about whose labour history remembers." },
  { n:14, t:"<i>A Fine Balance</i>", au:"Rohinton Mistry", yr:1995, form:"Fiction", era:"plural", set:"India", reg:[], away:"India", lang:"en", langT:"English", ind:"",
    d:"Four strangers share a small apartment in an Indian city during the political Emergency of the 1970s. Mistry wrote it in Toronto." },
  { n:15, t:"<i>No Great Mischief</i>", au:"Alistair MacLeod", yr:1999, form:"Fiction", era:"plural", set:"Nova Scotia (Cape Breton)", reg:["atl"], lang:"en", langT:"English", ind:"",
    d:"Generations of a Scottish-descended family on Cape Breton Island, held together by memory, the sea and the mines." },
  { n:16, t:"<i>What We All Long For</i>", au:"Dionne Brand", yr:2005, form:"Fiction", era:"plural", set:"Ontario (Toronto)", reg:["on"], lang:"en", langT:"English", ind:"", black:true,
    d:"Four young friends, children of immigrants, look for belonging in present-day Toronto." },
  { n:17, t:"<i>Ru</i>", au:"Kim Thúy", yr:2009, form:"Fiction", era:"plural", set:"Quebec and Vietnam", reg:["qc"], lang:"fr", langT:"French (in translation)", ind:"",
    d:"Short fragments of memory from a girl who fled Vietnam by boat and grew up in Quebec. Written in French; read in translation." },
  // VERIFY: Wagamese description (an Ojibwe man looks back on residential school, hockey, and healing).
  { n:18, t:"<i>Indian Horse</i>", au:"Richard Wagamese", yr:2012, form:"Fiction", era:"plural", set:"Ontario", reg:["on"], lang:"en", langT:"English", ind:"Ojibwe",
    d:"An Ojibwe man looks back on residential school, the hockey that kept him going, and the healing he finds in land and memory." }
];
const ERAS = [{ id:"settler", t:"Settler", d:"before 1867" }, { id:"conf", t:"Confederation", d:"1867–1899" }, { id:"early", t:"Early 20th century", d:"1900–1939" },
  { id:"mid", t:"Mid-century", d:"1940–1966" }, { id:"boom", t:"Boom", d:"1967–1980" }, { id:"plural", t:"Plural voices", d:"1981–present" }];
const REGIONS = [{ id:"bc", t:"British Columbia", miss:"No British Columbia" }, { id:"prairies", t:"Prairies", miss:"No Prairies" }, { id:"on", t:"Ontario", miss:"No Ontario" },
  { id:"qc", t:"Quebec", miss:"No Quebec" }, { id:"atl", t:"Atlantic Canada", miss:"No Atlantic Canada" }, { id:"north", t:"The North", miss:"Nothing set in the North" }];

// The five public-domain passages for Lens mode, with the plan's lens-fit table (fixed). lines = the lines TC2 can mark.
const PASSAGES = [
  { id:"moodie", short:"Moodie", label:"Moodie, <i>Roughing It in the Bush</i> (excerpt)", card:"Moodie’s account of the backwoods", kind:"prose", text:MOODIE,
    cite:"Susanna Moodie, <i>Roughing It in the Bush</i> (1852), chapter 5, “Our First Settlement, and the Borrowing System”",
    lines:["the woods were frightful to look upon", "surrounded on all sides by the dark forest", "I felt terrified at being left alone in this wild, strange-looking place"],
    fit:{ garrison:["Strong fit", "the bush as threat; the settler household as refuge"], survival:["Strong fit", "hardship endured"], speaking:["An English gentlewoman newly arrived as a settler", ""] } },
  { id:"lampman", short:"Lampman", label:"Lampman, “Heat”", card:"Lampman’s “Heat”", kind:"verse", listen:true,
    text:[{ n:1, t:HEAT1 }, { gap:true }, { n:47, t:HEAT47 }, { n:48, t:HEAT48 }],
    cite:"Archibald Lampman, “Heat,” <i>Among the Millet</i> (1888), lines 1 and 47–48",
    lines:[HEAT1, FURNACE],
    fit:{ garrison:["Counterexample", "the land clarifies; it doesn’t threaten"], survival:["Weak", "no victim here"], speaking:["A Canadian-born poet in an Ontario summer", ""] } },
  // VERIFY: Johnson "Who's speaking?" wording (plan text) with the Indigenous education lead.
  { id:"johnson", short:"Johnson", label:"Johnson, “The Song My Paddle Sings”", card:"Johnson’s paddle song", kind:"verse",
    text:[{ n:1, t:PADDLE }],
    cite:"E. Pauline Johnson (Tekahionwake), “The Song My Paddle Sings” (1895), line 1, as printed in <i>Flint and Feather</i> (1912)",
    lines:[PADDLE],
    fit:{ garrison:["Counterexample", "the wind is addressed like a partner"], survival:["Weak", ""], speaking:["A Mohawk and English poet-performer, at ease on the water", ""] } },
  { id:"leacock", short:"Leacock", label:"Leacock, the Mariposa opening", card:"Leacock’s Mariposa", kind:"prose", text:[LEACOCK],
    cite:"Stephen Leacock, <i>Sunshine Sketches of a Little Town</i> (1912), chapter 1, “The Hostelry of Mr. Smith”",
    lines:["I don’t know whether you know Mariposa.", "If not, it is of no consequence, for if you know Canada at all, you are probably well acquainted with a dozen towns just like it."],
    fit:{ garrison:["Sidesteps", "a comic, comfortable small town; no wilderness"], survival:["Weak", ""], speaking:["A wry, affectionate narrator talking to “you”", ""] } },
  { id:"mccrae", short:"McCrae", label:"McCrae, “In Flanders Fields”", card:"McCrae’s poppies", kind:"verse", listen:true,
    text:MCCRAE.reduce((a, l) => { if (!l) a.out.push({ gap:true }); else a.out.push({ n:++a.k, t:l }); return a; }, { out:[], k:0 }).out,
    cite:"John McCrae, “In Flanders Fields” (1915), lines 1–15, text of <i>In Flanders Fields and Other Poems</i> (1919)",
    lines:["In Flanders fields the poppies blow / Between the crosses, row on row,", "Take up our quarrel with the foe:", "If ye break faith with us who die / We shall not sleep, though poppies grow / In Flanders fields."],
    fit:{ garrison:["Doesn’t apply", "war overseas, not the Canadian land"], survival:["Partial", "the dead refuse to let death end their cause (“Take up our quarrel with the foe”)"], speaking:["The dead, speaking as “we”", ""] } }
];
const LENSES = [{ id:"garrison", t:"Garrison (Frye)", name:"Garrison lens" }, { id:"survival", t:"Survival (Atwood)", name:"Survival lens" }, { id:"speaking", t:"Who’s speaking?", name:"Who’s speaking?" }];

const RUBRIC = [["Level", "Knowledge (the works and contexts)", "Thinking (criteria and perspective)", "Communication (statement)", "Application (connections)"],
  ["1", "Descriptions inaccurate", "No clear criteria", "Unclear; a list", "Choices unconnected"],
  ["2", "Mostly accurate", "Criteria named, inconsistently applied", "Some justification", "Some connections"],
  ["3", "Accurate", "Criteria applied to each choice; exclusions named", "Clear, organized justification", "Works placed in conversation with each other"],
  ["4", "Precise and nuanced", "Criteria examined critically, including their own perspective", "Persuasive, elegant statement", "Insightful links among works, history and readers"]];
const RUB = "<details class='alg cl-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr>" + RUBRIC[0].map((h) => "<th scope='col'>" + h + "</th>").join("") + "</tr></thead><tbody>" +
  RUBRIC.slice(1).map((r) => "<tr>" + r.map((c, i) => (i ? "<td>" : "<th scope='row'>") + c + (i ? "</td>" : "</th>")).join("") + "</tr>").join("") + "</tbody></table></div></details>";

// Activity 1 hints: 1 and 2 are the plan's; 3 is the answer with its reason
const SH = (a) => ["Is the land a threat, a friend, or absent?", "Threat → supports. Friend or absent → complicates or doesn’t apply.", a];

export default {
  id:"13-what-is-canlit",
  kind:"topic",
  title:"What is “Canadian literature”?",
  topic:"What is “Canadian Literature”?",
  readyTopic:"testing what counts as Canadian literature",
  hero:{
    headline:"Is this a Canadian poem?",
    // VERIFY: McCrae biography (Guelph, Ontario; serving near Ypres, Belgium, 1915) and the bill (the 2001-series $10 note).
    text:"It was written in 1915 by John McCrae, a doctor from Guelph, Ontario, serving near Ypres in Belgium. It’s set in Belgium, it has been recited on November 11 for over a century, and it’s on the back of a Canadian bill. So: is it Canadian literature because of its author, its readers, or its story? In this module you’ll test the big theories of what makes writing Canadian, and then build a <strong>canon</strong> of your own: a short list you can defend.",
    fig:{ html:"<div class='cl-hero' id='cl-hero' role='group' aria-label='The first stanza of In Flanders Fields. As each line is read, a poppy blooms in a row along the bottom. The rhyme words blow, row and below glow together, then sky and fly. Beneath the poem, a simple map shows two pins, one at Guelph in Ontario and one near Ypres in Belgium, joined by a dotted line across the Atlantic.'></div>", caption:"" },
    stanza:MCCRAE.slice(0, 5),
    rhymes:[[0, "blow", "A"], [1, "row,", "A"], [4, "below.", "A"], [2, "sky", "B"], [3, "fly", "B"]],
    cite:"John McCrae, “In Flanders Fields,” lines 1–5",
    full:MCCRAE,
    fullCite:"John McCrae, “In Flanders Fields” (1915), text of <i>In Flanders Fields and Other Poems</i> (1919)",
    pins:{ home:"Guelph, Ontario", away:"near Ypres, Belgium", ocean:"Atlantic Ocean" },
    caption:"Written where? About where? For whom?",
    listen:"Listen", watch:"Watch again", wholeLabel:"Read the whole poem", poppyLabel:"poppy",
    noVoice:"Read it yourself: say each line slowly, and let the rhymes ring."
  },
  goals:[
    "I can explain competing definitions of “Canadian literature” and what each includes and excludes.",
    "I can summarize a critical thesis (the garrison mentality, survival) in my own words and test it against texts.",
    "I can identify the perspective a text or collection represents, and who is missing from it.",
    "I can build and justify a small canon using clear criteria.",
    "I can read public-domain Canadian texts closely for how they picture land and community.",
    "I can describe Indigenous storytelling as a living tradition, not a “before” to Canadian literature."
  ],
  start:{
    blocks:[{ title:"Word story: canon", html:"<p><strong><em>Canon</em></strong> comes from Greek <em>kanōn</em>, a straight rod or reed used for measuring: a rule. It came to mean the list of books a community accepted as sacred, then the list of works treated as essential. Every canon is a measuring rod, and the useful question is always: whose ruler?</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Imagery and setting", goal:5, prompt:"In “The larks, still bravely singing, fly / Scarce heard amid the guns below,” what contrast does McCrae draw?",
          options:[{ t:"Fragile, persistent life (the larks’ song) against the overwhelming noise of war", ok:true, why:"“Still” and “bravely” make the birds persist; “scarce heard” shows what drowns them out." },
            { t:"Day against night", why:"No time-of-day contrast here." },
            { t:"Canada against Belgium", why:"The lines contrast sounds, not countries." },
            { t:"Hope against faith", why:"Abstract labels with no anchor in the text: which words show hope, or faith?" }],
          hints:["Which two sounds are in these lines?", "Birdsong and guns.", "Life persisting under war."] },
        { id:"w2", skill:"Imagery and setting", goal:5, prompt:"Which phrase makes the setting feel most like a graveyard?",
          options:[{ t:"“Between the crosses, row on row”", ok:true, why:"Rows of crosses: grave markers." },
            { t:"“the poppies blow”", why:"Poppies later became a remembrance symbol, but here they are flowers in wind." },
            { t:"“in the sky”", why:"The sky isn’t the graveyard image." },
            { t:"“still bravely singing”", why:"That describes the larks." }],
          hints:["What marks a grave?", "Crosses.", "Rows of crosses."] },
        { id:"w3", skill:"Perspective and point of view", goal:3, prompt:"Who speaks in “In Flanders Fields”?",
          options:[{ t:"The dead soldiers, speaking together as “we”", ok:true, why:"“We are the Dead. Short days ago / We lived…”" },
            { t:"A living general", why:"Look at who says “we”: the speakers are the dead, not a commander." },
            { t:"The poppies", why:"That confuses the image with the speaker. The poppies are part of what the speakers see." },
            { t:"McCrae himself, describing his own death", why:"That confuses poet and speaker. McCrae wrote the poem; the speaker is the dead “we”." }],
          hints:["Find the pronoun.", "“We are the Dead.”", "The fallen soldiers."] },
        // VERIFY: W4 feedback on Indigenous presence in the forest (with the Indigenous education lead).
        { id:"w4", skill:"Perspective and point of view", goal:3, prompt:"A diary of a nineteenth-century English settler describes the forest as dark, dangerous and empty. What is the most careful way to read it?",
          options:[{ t:"As one settler’s perspective: the forest was not empty to the Indigenous peoples who lived there", ok:true, why:"A diary records its writer’s view. Ask who else was there, and whose view is missing." },
            { t:"As a fact about the forest", why:"That treats one perspective as true for everyone." },
            { t:"As fiction that can be ignored", why:"That dismisses the document. A diary is real evidence, of one person’s view." },
            { t:"As proof that everyone feared the forest", why:"That overgeneralizes from one writer to everyone." }],
          hints:["Who wrote it?", "Was the forest empty to everyone?", "One perspective among many."] },
        { id:"w5", skill:"Evaluating a claim with evidence", goal:2, prompt:"A classmate claims, “All Canadian poems are about winter.” What’s the best response?",
          options:[{ t:"Look for a counterexample, such as a Canadian poem about summer heat, and test the claim against it", ok:true, why:"One counterexample defeats an “all” claim." },
            { t:"Agree, because Canada is cold", why:"A stereotype isn’t evidence." },
            { t:"Count the winter poems you know", why:"Confirming instances can’t prove “all”. A thesis that explains everything explains nothing." },
            { t:"Ignore it; claims about literature can’t be tested", why:"They can: look for the poem that doesn’t fit." }],
          hints:["How do you disprove an “all” claim?", "Find one that doesn’t fit.", "A counterexample."] },
        { id:"w6", skill:"Evaluating a claim with evidence", goal:2, prompt:"Which evidence best supports the claim “Many early settler writers feared the wilderness”?",
          options:[{ t:"Several settler memoirs that describe the bush as threatening, from different writers", ok:true, why:"Several sources, directly on point." },
            { t:"A single modern film set in a forest", why:"Wrong period, wrong kind of source." },
            { t:"A poem that celebrates a lake", why:"That’s a counterexample, not support." },
            { t:"The fact that Canada is large", why:"A fact, but not evidence about writers’ attitudes." }],
          hints:["Evidence must match the claim’s time and subject.", "Settler writing, more than one.", "Several settler memoirs, from different writers."] }
      ],
      refreshers:{
        "Imagery and setting":"Notice what senses an image calls on, and what it sets against what: song against guns, crosses in rows.",
        "Perspective and point of view":"The speaker isn’t always the author, and an author’s view is one view. Ask: who is speaking, from where, and who isn’t heard?",
        "Evaluating a claim with evidence":"“All” and “every” claims fall to one counterexample. Support should match the claim’s time, place and subject, and come from more than one source."
      }
    }
  },
  explore:{
    heading:"CanLit map and timeline",
    intro:"Here is a collection of eighteen works, from 1852 to 2012. Explore them by time and by place, try on the big theories as lenses, and then build a canon that you could defend.",
    modes:[{ id:"timeline", t:"Timeline" }, { id:"map", t:"Map" }, { id:"lens", t:"Lens" }, { id:"canon", t:"Canon builder" }],
    how:{
      timeline:"Tap a card to read about it, then add it to your canon. Filter by form, language or Indigenous author.",
      map:"Regions light up as works arrive on your shelf. Tap a region to see what’s set there.",
      lens:"Choose a lens, then tap a passage card to see its lens fit. Mark a line, or test the garrison thesis below.",
      canon:"Choose up to six works. The readouts and “Who’s missing?” update as you go."
    },
    works:WORKS, eras:ERAS, regions:REGIONS, passages:PASSAGES, lenses:LENSES,
    // VERIFY: band wording (plan text) with the Indigenous education lead.
    band:"Indigenous oral and written storytelling: thousands of years, continuing now",
    elsewhere:"Set elsewhere: still Canadian literature?",
    filters:{ form:"Form", lang:"Language", ind:"Indigenous author", all:"All", yes:"Yes", en:"English", fr:"French (in translation)" },
    readout:{ chosen:"Works chosen", eras:"Eras represented", langs:"Languages", ind:"Indigenous authors", forms:"Forms", span:"Span", missing:"Who’s missing?",
      lens:"Lens", passage:"Passage", fit:"Lens fit", line:"Line marked", test:"Your test of the garrison thesis", open:"Card", shelf:"On your shelf" },
    fixedMissing:{ indLang:"No work written in an Indigenous language", black:"No Black Canadian writer in this selection" },
    langMissing:{ en:"No English-language work", fr:"No French-language work" },
    aha:"Every theory lights up some texts and leaves others dark, and every selection of six leaves most voices out. The question isn’t “Which is the real Canadian literature?” but “What does each way of choosing let us see, and what does it hide?”",
    lensNote:"A lens is a way of seeing, not a rule for reading. Fit labels are always words.",
    predictions:[
      { id:"p1", start:{ mode:"lens", lens:"garrison" },
        prompt:"Which public-domain passage do you predict fits the garrison thesis best?",
        options:[{ t:"Moodie’s account of the backwoods", ok:true }, { t:"Lampman’s “Heat”" }, { t:"Leacock’s Mariposa" }, { t:"McCrae’s poppies" }],
        explain:"Moodie’s settler household braced against the bush is exactly the picture the thesis describes. Other texts don’t share it." },
      { id:"p2", start:{ mode:"canon", canon:[1, 2, 4, 8, 12, 18] }, cut:1930,
        prompt:"Remove every work written before 1930. What happens to the “Indigenous authors” readout?",
        options:[{ t:"It drops from 3 to 2", ok:true }, { t:"It stays at 3" }, { t:"It drops to 0" }, { t:"It rises" }],
        explain:"Cutting early works quietly erases an early Indigenous voice. How you set the dates is a choice about who counts." },
      { id:"p3", start:{ mode:"lens", lens:"survival", pas:"lampman" },
        prompt:"Predict the fit of the survival lens on “Heat”.",
        options:[{ t:"Weak: the speaker rests in the heat, and his “thoughts grow keen and clear”, so there is no struggle to survive", ok:true }, { t:"Strong: the heat is killing him" }, { t:"Strong, because all Canadian poems are about survival" }, { t:"The lens can’t read poems" }],
        explain:"A lens that fits everything is no longer telling you anything. “Heat” is a useful test." },
      { id:"p4", start:{ mode:"canon", canon:[1, 3, 4, 10, 15] }, add:17,
        prompt:"Add Kim Thúy’s <i>Ru</i>. Which readout changes?",
        options:[{ t:"Languages: French (in translation) goes from 0 to 1", ok:true }, { t:"Only the regions row" }, { t:"Nothing" }, { t:"The forms row" }],
        explain:"One book adds a language, Quebec, and a refugee’s arrival story. Choices widen or narrow the conversation." }
    ],
    chalIntro:"Use the timeline, the map, the lenses and the canon builder to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Build a six-work collection that spans at least four eras and includes at least one Indigenous author and at least one work translated from French." + SET("canon"),
        msgs:{ count:"A canon here is exactly six. You have {n}.", eras:"Your shelf covers {n} eras. Reach further back: before 1940 there are works from the Settler, Confederation and Early 20th century eras.", ind:"Who’s speaking? Add Johnson, Highway or Wagamese.", fr:"Quebec is missing. Add Roy, Hébert or Thúy." },
        why:"Four eras, an Indigenous voice and a work from Quebec: a small shelf that already talks across time, language and nation. Now read “Who’s missing?”: even this shelf leaves most voices out.",
        hints:["Check the eras row first.", "One pre-1900 work, one early 20th-century work, one mid-century and one recent gives four.", "For example: Moodie, Johnson, Roy, Kogawa, Highway, Thúy."] },
      { id:"tc2", goal:2, prompt:"Find a counterexample to the garrison thesis: choose the passage and the line that challenge it most clearly." + SET("lens"),
        answer:[["lampman", 1], ["johnson", 0]],
        msgs:{ none:"Tap a passage card, then mark the line that challenges the thesis.", moodie:"Moodie <em>supports</em> the thesis; her fear of the bush is the garrison feeling.", mccrae:"This poem is about war overseas, not the Canadian land. It doesn’t really test this thesis.", leacock:"Mariposa sidesteps the thesis (no wilderness at all) rather than contradicting it. Find a text where the land itself is friendly.", line:"Right passage, but that line only sets the scene. Mark the line where the speaker is most at ease in the land." },
        general:"Not yet. The thesis says the land is hostile. Mark a line where a speaker is at ease in it.",
        why:"A speaker at home in the land is exactly what the garrison thesis can’t explain: “In the full furnace of this hour / My thoughts grow keen and clear” (Lampman, lines 47–48), or Johnson’s call to the west wind.",
        hints:["The thesis says the land is hostile. Find a speaker at ease in it.", "Look at Lampman’s last lines, or Johnson’s first.", "In the full furnace of this hour / My thoughts grow keen and clear."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"<strong>Test the garrison thesis fairly:</strong> choose <strong>one</strong> passage that supports it, <strong>two</strong> that challenge it, and the <strong>most defensible conclusion</strong>." + SET("lens"),
        answer:{ sup:"moodie", ch:["lampman", "johnson", "leacock"] },
        options:[{ t:"The garrison thesis fits some early settler writing, but not all; it reflects a settler perspective rather than Canadian literature as a whole.", ok:true, fb:"" },
          { t:"The thesis is proved: Canadian literature fears nature.", fb:M4 },
          { t:"The thesis is useless and should be ignored.", fb:"It does illuminate Moodie, so “useless” overcorrects." },
          { t:"Only poems count as evidence, so the thesis can’t be tested.", fb:"Any text can be evidence." }],
        msgs:{ count:"Choose exactly one passage that supports the thesis, two that challenge it, and a conclusion.", mccrae:"McCrae doesn’t challenge the thesis; it’s outside its subject.", lampSup:"Re-read “Heat”: the speaker isn’t threatened.", sup:"That passage doesn’t picture the land as a threat. Which one does?", ch:"Moodie can’t challenge the thesis; she’s its best evidence." },
        general:"Not yet. Check your supporting passage, your two challenges and your conclusion.",
        why:"You did what critics should do: reported a big idea, then tested it on both kinds of evidence. Your conclusion is narrower than the thesis, and stronger for it.",
        hints:["Which passage pictures the land as a threat?", "Which passages picture it as calm, friendly or beside the point?", "Moodie supports; Lampman and Johnson challenge; the thesis fits <em>some</em> settler writing."] }
    ]
  },
  part3:{
    slug:"thesis", name:"Thesis",
    heading:"Test a thesis",
    intro:"Explore tried the lenses one passage at a time. Here you build a whole evidence board for two famous theses, then ask whose perspective each thesis carries.",
    s1:{ title:"Station 1: Two theses, in their own words and in plain words",
      how:"Read each card, then choose the summary that matches it.",
      cards:[
        // EXCERPT SLOT: Frye, "Conclusion," Literary History of Canada (1965): the passage on the "garrison mentality" (the plan leaves
        //   the opening and closing words to the teacher). Paste the class-edition text into slot below, with its page, when confirmed.
        { id:"frye", name:"The garrison mentality", who:"Northrop Frye, 1965", lead:"Canadian sensibility ", quote:FRYE_Q, cite:"(Frye, “Conclusion”)", credit:FRYE_CREDIT, answer:"frye",
          slot:"<strong>Read in your copy:</strong> the passage in Frye’s “Conclusion” to the <i>Literary History of Canada</i> (1965) where he describes the “garrison mentality”. Your teacher will give you the pages.",
          gloss:"Early settler writing pictures small, close-knit communities that feel surrounded by a huge, indifferent or menacing land, and turn inward to protect themselves: a “garrison mentality”." },
        // EXCERPT SLOT: Atwood, Survival (1972): the passages naming survival as the central symbol and setting out the "Basic Victim
        //   Positions". Paste the class-edition text into slot below, with its pages, when confirmed.
        { id:"atwood", name:"<i>Survival</i>", who:"Margaret Atwood, 1972", lead:"", quote:ATWOOD_Q, cite:"(Atwood, <i>Survival</i>)", credit:ATWOOD_CREDIT, answer:"atwood",
          slot:"<strong>Read in your copy:</strong> the passages in Atwood’s <i>Survival</i> (1972) where she names survival as the central symbol and sets out the “Basic Victim Positions”. Your teacher will give you the pages.",
          gloss:"Atwood lays out “Basic Victim Positions”: denying you are a victim, blaming fate, refusing that victimhood is inevitable, and finally becoming a “creative non-victim”." }
      ],
      summaries:[
        { id:"frye", t:"Early settler writing pictures small communities that feel besieged by a vast, menacing land, and turn inward." },
        { id:"atwood", t:"Survival, and the ways characters respond to being victims, is a central pattern in Canadian writing." },
        { id:"mil", t:"Frye said Canada was a military country." },
        { id:"vict", t:"Atwood said all Canadians are victims." }
      ],
      fb:{ right:"Right. That’s the thesis in plain words.", other:"That’s an accurate summary, but of the other thesis.",
        mil:"A distortion: “garrison” is a metaphor for a fortified settlement, not the army.", vict:"A distortion: Atwood describes positions characters take, not a verdict on every Canadian." } },
    s2:{ title:"Station 2: The evidence board",
      how:"Choose a thesis. Tap a passage, then tap the column it belongs in. A placement that differs from the lens table needs a “because” reason from the menu.",
      cols:[{ id:"s", t:"Supports" }, { id:"c", t:"Complicates" }, { id:"d", t:"Doesn’t apply" }],
      theses:[{ id:"garrison", t:"Garrison" }, { id:"survival", t:"Survival" }],
      because:[
        { id:"dead", t:"because the dead refuse to let their cause die" },
        { id:"nowild", t:"because there is no wilderness in it at all" },
        { id:"persp", t:"because it shows one settler’s fear, not everyone’s" },
        { id:"nostrug", t:"because no one in it is struggling to survive" },
        { id:"endure", t:"because the speaker endures the noon heat" },
        { id:"all", t:"because every Canadian text is about the land" },
        { id:"old", t:"because it was written long ago" }
      ],
      // the lens table's placement per thesis and passage, and the alternatives a "because" chip can defend
      cells:[
        { th:"garrison", p:"moodie", answer:{ k:"s", alt:{ c:["persp"] } } },
        { th:"garrison", p:"lampman", answer:{ k:"c", alt:{} } },
        { th:"garrison", p:"johnson", answer:{ k:"c", alt:{} } },
        { th:"garrison", p:"leacock", answer:{ k:"c", alt:{ d:["nowild"] } } },
        { th:"garrison", p:"mccrae", answer:{ k:"d", alt:{} } },
        { th:"survival", p:"moodie", answer:{ k:"s", alt:{} } },
        { th:"survival", p:"lampman", answer:{ k:"c", alt:{ d:["nostrug"] } } },
        { th:"survival", p:"johnson", answer:{ k:"c", alt:{ d:["nostrug"] } } },
        { th:"survival", p:"leacock", answer:{ k:"c", alt:{ d:["nostrug", "nowild"] } } },
        { th:"survival", p:"mccrae", answer:{ k:"c", alt:{ s:["dead"] } } }
      ],
      st:{ key:"✓ Matches the lens table.", alt:"✓ Accepted, with your reason.", need:"Defend this placement: choose a “because” reason.", bad:"✗ That reason doesn’t hold for this placement. Try another, or move the card." },
      bar:"{t}: supported by {s}, complicated by {c}, doesn’t apply to {d}" },
    // VERIFY: Station 3 reading card (plan text) with the Indigenous education lead.
    s3:{ title:"Station 3: Whose thesis?",
      card:"Both theses grew out of reading mostly settler, English-language writing. Many Indigenous writers picture the land as home and kin, a relation rather than a wilderness to survive (Johnson’s paddle-song is one early example; module 15 goes further). French-language and newcomer writers often place the struggle elsewhere: in cities, in history, in language itself.",
      prompt:"Rewrite one thesis so that it’s honest about its perspective.",
      chips:["settler", "English-language", "nineteenth-century"],
      frame:"In much early {who} writing, ",
      ph:"complete the thesis, e.g. communities feel…",
      ok:"✓ Your thesis names whose writing it describes. That’s narrower, and truer.",
      need:"Choose at least one chip to say whose writing, then complete the sentence (at least five words)." },
    blocks:[{ title:"Craft → meaning", html:"<p>A thesis is a way of seeing. Use it like a lens: look through it, notice what comes into focus, then take it off and notice what it blurred.</p>" }],
    quickCheck:{ title:"Thesis quick check", summary:"Thesis quick check",
      items:[
        { id:"q1", goal:2, prompt:"Which best summarizes the garrison mentality?",
          choices:[{ t:"Communities huddled against a vast, menacing land", ok:true, fb:"Right. A small settlement, turned inward against the land around it." },
            { t:"Canada’s love of the military", fb:"“Garrison” is a metaphor for a fortified settlement, not the army." },
            { t:"Cities more important than nature", fb:"“Garrison” is a metaphor for a fortified settlement, not the army." },
            { t:"Nature as paradise", fb:"“Garrison” is a metaphor for a fortified settlement, not the army." }] },
        { id:"q2", goal:[2, 5], prompt:"Lampman’s “Heat”, for the garrison thesis, is…",
          choices:[{ t:"a counterexample", ok:true, fb:"Right. The land clarifies the speaker; it doesn’t besiege him." },
            { t:"strong support", fb:"The land clarifies the speaker; it doesn’t besiege him." },
            { t:"irrelevant", fb:"The land clarifies the speaker; it doesn’t besiege him." },
            { t:"proof", fb:"The land clarifies the speaker; it doesn’t besiege him." }] },
        { id:"q3", goal:2, prompt:"A fair test of a thesis needs…",
          choices:[{ t:"evidence that supports it and evidence that might not", ok:true, fb:"Right. Testing means looking for the case that doesn’t fit." },
            { t:"only supporting examples", fb:"Testing means looking for the case that doesn’t fit." },
            { t:"the critic’s fame", fb:"Testing means looking for the case that doesn’t fit." },
            { t:"one strong quotation", fb:"Testing means looking for the case that doesn’t fit." }] },
        { id:"q4", goal:3, prompt:"The best way to make a thesis honest about its perspective is to…",
          choices:[{ t:"name whose writing it describes", ok:true, fb:"Right. “In much early settler writing…” is narrower and truer." },
            { t:"make it broader", fb:"“In much early settler writing…” is narrower and truer." },
            { t:"remove the critic’s name", fb:"“In much early settler writing…” is narrower and truer." },
            { t:"add more adjectives", fb:"“In much early settler writing…” is narrower and truer." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='cl-steal'>“" + LEACOCK + "”</p><p class='eng-cite'>Stephen Leacock, <i>Sunshine Sketches of a Little Town</i> (1912), chapter 1</p><p><strong>The shape:</strong> a casual aside to “you”, a shrug (“it is of no consequence”), then a sweeping, slyly comic generalization.</p><p><strong>Frame:</strong> “I don’t know whether you know ______. If not, it is of no consequence, for if you know ______ at all, you are probably well acquainted with ______ just like it.”</p><p><strong>Model imitation:</strong> “I don’t know whether you know our cafeteria. If not, it is of no consequence, for if you know high school at all, you are probably well acquainted with a dozen lunch lines just like it.”</p>",
      prompt:"Your imitation" }],
    steal:{ master:LEACOCK, source:"Leacock, Sunshine Sketches of a Little Town", save:"Save it to my commonplace book" }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Supports, complicates or doesn’t apply?", summary:"Supports, complicates or doesn’t apply?", goal:[2, 5], txt:true, noun:"description",
        instruction:"Thesis tested: the garrison mentality. Sort each described text by what it does to the thesis. Trivium: Logic.",
        boxes:[{ id:"s", label:"Supports" }, { id:"c", label:"Complicates" }, { id:"d", label:"Doesn’t apply" }],
        items:[
          { id:"i1", t:"Moodie warns genteel emigrants against settling in the backwoods", answer:"s", why:"The bush as threat: the garrison feeling exactly.",
            wrong:{ c:"This is the garrison feeling exactly: the bush as threat.", d:"This is the garrison feeling exactly: the bush as threat." }, hints:SH("Supports: the bush is a threat to the settler household.") },
          { id:"i2", t:"Lampman’s speaker rests in the noon heat, and his “thoughts grow keen and clear”", answer:"c", why:"Calm, not siege: the land sharpens his mind.",
            wrong:{ s:"Calm, not siege.", d:"Calm, not siege. The land is right there, and it’s friendly: that complicates the thesis." }, hints:SH("Complicates: the land is calm, not a siege.") },
          { id:"i3", t:"Leacock’s affectionate comedy about a small Ontario town", answer:"c", why:"The town isn’t besieged; it’s comfortable, even absurd.",
            wrong:{ s:"The town isn’t besieged; it’s comfortable, even absurd.", d:"The town isn’t besieged; it’s comfortable, even absurd. A small community at ease complicates the picture." }, hints:SH("Complicates: a small town at ease, not under siege.") },
          { id:"i4", t:"McCrae’s dead soldiers speak from a battlefield in Belgium", answer:"d", why:"War overseas isn’t the thesis’s subject.",
            wrong:{ s:"War overseas isn’t the thesis’s subject.", c:"War overseas isn’t the thesis’s subject." }, hints:SH("Doesn’t apply: the thesis is about the Canadian land, not a war overseas.") },
          { id:"i5", t:"Johnson’s paddler calls to the west wind as if to a companion", answer:"c", why:"The land is a partner here.",
            wrong:{ s:"The land is a partner here.", d:"The land is a partner here, and that pushes against the thesis." }, hints:SH("Complicates: the land is a partner.") },
          { id:"i6", t:"Montgomery’s Anne delights in the landscape of Prince Edward Island", answer:"c", why:"Wonder, not fear.",
            wrong:{ s:"Wonder, not fear.", d:"Wonder, not fear: a friendly land complicates the thesis." }, hints:SH("Complicates: wonder, not fear.") },
          { id:"i7", t:"Ross’s minister’s wife feels isolated in a drought-stricken prairie town, the wind and dust pressing in", answer:"s", why:"A small community hemmed in by a harsh land.",
            wrong:{ c:"A small community hemmed in by a harsh land.", d:"A small community hemmed in by a harsh land." }, hints:SH("Supports: a small community hemmed in by a harsh land.") },
          { id:"i8", t:"Roy’s family struggles with poverty in wartime Montreal", answer:"d", why:"An urban story; there’s no wilderness in it.",
            wrong:{ s:"An urban story; there’s no wilderness in it.", c:"An urban story; there’s no wilderness in it." }, hints:SH("Doesn’t apply: a city story with no wilderness.") },
          { id:"i9", t:"Kogawa’s Japanese Canadian family is forcibly removed from the coast by its own government during the Second World War", answer:"c", why:"The threat comes from inside the “garrison”, from the nation itself: the thesis turned inside out.",
            wrong:{ d:"It does apply, in reverse: here the threat comes from inside the “garrison”, from the nation itself.", s:"The threat here isn’t the land. Look at who removes the family." }, hints:SH("Complicates: the threat comes from inside the “garrison”, from the nation itself.") }
        ] },
      { id:"across", type:"custom", title:"Reading across texts", summary:"Reading across texts", goal:[2, 3, 5], star:true,
        instruction:"Six questions that read the passages against each other. The last two go beyond the Final Check. Trivium: Logic.", how:"",
        items:[
          { id:"x1", goal:5, prompt:"Which two passages show the most opposite relationships to the land?",
            options:[{ t:"Moodie and Lampman", ok:true, why:"Moodie dreads the dark forest; Lampman’s speaker rests easy in the heat." },
              { t:"McCrae and Leacock", why:"McCrae is about war overseas, and Leacock has no wilderness at all: neither pictures a relationship to the Canadian land." },
              { t:"Johnson and Lampman", why:"Johnson and Lampman agree: both are at ease." },
              { t:"Leacock and Johnson", why:"Leacock’s Mariposa has no wilderness, so there’s little to set against Johnson’s ease." }],
            hints:["Which passage fears the land most?", "Which speaker is most at ease in it?", "Moodie and Lampman: dread against ease."] },
          { id:"x2", goal:5, star:true, prompt:"Each stanza of “In Flanders Fields” returns to the words “In Flanders fields”. What does the refrain do?",
            options:[{ t:"It brings us back to the graves, so the dead’s voice keeps insisting on the place where they lie", ok:true, why:"Repetition is insistence. The dead won’t let us forget where they are." },
              { t:"It fills space", why:"Repetition is insistence. The dead won’t let us forget where they are." },
              { t:"It names a Canadian place", why:"Flanders is in Belgium, where the dead lie." },
              { t:"It shows McCrae forgot the rhyme", why:"The refrain is a rule of the rondeau form, and a choice." }],
            hints:["Where are the speakers?", "What do they keep returning to?", "Their graves: the refrain insists on the place."] },
          { id:"x3", goal:3, star:true, prompt:"Leacock’s narrator speaks to “you” (“if you know Canada at all”). What is the effect?",
            options:[{ t:"Intimacy and gentle irony: a “typical” town becomes a sly portrait of a whole country", ok:true, why:"The direct address pulls you in. The generalization is part of the joke." },
              { t:"Confusion about who’s speaking", why:"The narrator is clear; he’s chatting with you." },
              { t:"A formal, distant tone", why:"The direct address pulls you in. The generalization is part of the joke." },
              { t:"An accusation against the reader", why:"There’s no blame here, only a wink." }],
            hints:["How does being called “you” feel?", "Is “a dozen towns just like it” meant literally?", "Intimacy and gentle irony."] },
          { id:"x4", goal:2, star:true, prompt:"Which passage best fits Atwood’s idea of <em>refusing</em> to accept that victimhood is inevitable?",
            options:[{ t:"McCrae: “Take up our quarrel with the foe” (line 10)", ok:true, why:"The dead don’t accept death as the end; they hand on the “torch”." },
              { t:"Lampman’s resting speaker", why:"He isn’t a victim at all, so there’s nothing to refuse." },
              { t:"Moodie’s warnings", why:"Moodie endures and warns; she doesn’t refuse her lot here." },
              { t:"Leacock’s Mariposa", why:"No one in Mariposa is a victim." }],
            hints:["Which speakers act, and which only describe?", "Who hands something on?", "McCrae’s dead: “To you from failing hands we throw / The torch”."] },
          { id:"x5", goal:3, star:true, prompt:"Which question best exposes the limit of using only these five public-domain texts as “Canadian literature”?",
            options:[{ t:"Whose voices are missing (French-language, Black, Asian Canadian and most Indigenous writers)?", ok:true, why:"Five English-language texts, four by settlers, can’t speak for a country." },
              { t:"Are they long enough?", why:"Length isn’t the limit; whose voices are heard is." },
              { t:"Are they all poems?", why:"They aren’t (two are prose), and form isn’t the main limit." },
              { t:"Were they popular?", why:"Popularity doesn’t tell you who is missing. Five English-language texts, four by settlers, can’t speak for a country." }],
            hints:["Who wrote these five?", "In what language, and from what perspective?", "Ask whose voices are missing."] }
        ],
        x6:{ id:"x6", goal:[2, 5], prompt:"Write one sentence that tests the garrison thesis with a quotation from “Heat” and a citation.",
          lines:[HEAT1, HEAT47, HEAT48],
          verbs:["suggest", "impl", "undercut", "juxtapos", "foreshadow", "refram", "intensif", "complicat"],
          bank:"suggests, implies, undercuts, juxtaposes, foreshadows, reframes, intensifies, complicates",
          checks:["A quotation from “Heat”, in quotation marks", "A line citation: (Lampman, lines 47–48) or (lines 47–48)", "The word “garrison”", "A verb from the analysis bank"],
          tips:["Quote a few words from “Heat” inside quotation marks.", "Add a line citation such as (lines 47–48).", "Name the thesis: use the word “garrison”.", "Say what the quotation does to the thesis, with a verb such as “complicates” or “undercuts”."],
          model:"Lampman’s speaker finds that “In the full furnace of this hour / My thoughts grow keen and clear” (lines 47–48), which complicates the garrison thesis: the land sharpens his mind instead of besieging his household.",
          hints:["Quote a few words from the last two lines.", "Poems cite line numbers: (lines 47–48).", "Say what the quotation does to the thesis: “complicates”, “undercuts”."] } },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Seraphina", goal:[2, 1, 6],
        instruction:"Seraphina made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:2, task:"Testing a thesis",
            steps:["Frye’s idea of a “garrison mentality” describes settler communities that turn inward against a vast, menacing land.", "Moodie’s warnings against the backwoods support this idea.", "Therefore all Canadian literature is about surviving a hostile wilderness.", "Even Lampman’s “Heat” shows the danger of summer.", "The garrison is everywhere in our books."],
            answer:2, stepFb:["An accurate summary.", "Good evidence.", "", "This follows from sentence 3. The problem is earlier.", "This follows from sentence 3. The problem is earlier."],
            fixes:[{ t:"“Moodie supports the thesis, but Lampman’s ‘Heat’, where the speaker’s ‘thoughts grow keen and clear’, complicates it.”", ok:true, why:"Right: one supporting text can’t prove “all”, and the counterexample narrows the claim." },
              { t:"“Therefore most Canadian literature is about winter.”", why:"A new overgeneralization." },
              { t:"“Therefore Frye must be right, because he is a famous critic.”", why:"Fame isn’t evidence. " + M6 },
              { t:"Sentence 3 is fine.", why:"One example can’t prove “all”. " + M4 }],
            hints:["How many texts support the “all” in sentence 3?", "Is there a counterexample in this module?", "The fix that sets Moodie against Lampman’s “Heat”."] },
          { id:"e2", goal:1, task:"Defining the field",
            steps:["Canadian literature is simply any book set in Canada.", "So <i>A Fine Balance</i>, set in India, is not Canadian literature.", "And neither is “In Flanders Fields”.", "Our canon should include only books set here."],
            answer:0, stepFb:["", "This follows from sentence 1. The problem is earlier.", "This follows from sentence 1. The problem is earlier.", "This follows from sentence 1. The problem is earlier."],
            fixes:[{ t:"“Definitions differ: some focus on where authors live, others on setting, language or readers, and each includes and excludes different writers.”", ok:true, why:"Right: each definition is a choice, with its own gains and losses." },
              { t:"“Canadian literature is any book written by someone born in Canada.”", why:"Another single rule, which leaves out Mistry, Brand and Thúy." },
              { t:"“Canadian literature is whatever sells well here.”", why:"Popularity is one measure, not a definition." },
              { t:"Sentence 1 is fine.", why:"It would exclude a poem recited every November 11. " + M1 }],
            hints:["Test sentence 1 against McCrae and Mistry.", "Is there one rule everyone agrees on?", "The fix that says definitions differ, and each includes and excludes."] },
          // VERIFY: E3 (Indigenous storytelling) wording with the Indigenous education lead.
          { id:"e3", goal:6, task:"Indigenous storytelling",
            steps:["Any history of literature in Canada should include Indigenous storytelling.", "Indigenous stories belong to the time before Canadian literature began.", "They were replaced by written books.", "Johnson was one of the last to remember them."],
            answer:1, stepFb:["Agreed.", "", "This follows from sentence 2. The problem is earlier.", "This follows from sentence 2. The problem is earlier."],
            fixes:[{ t:"“Indigenous storytelling is a living tradition, much older than Canada, continuing today in oral and written forms; Johnson, Highway and Wagamese are part of it.”", ok:true, why:"Right. " + M3 },
              { t:"“Indigenous stories are one single tradition shared by all nations.”", why:"There are many nations, languages and traditions." },
              { t:"“Indigenous stories are interesting folklore.”", why:"“Folklore” can belittle living literature." },
              { t:"Sentence 2 is fine.", why:"It erases a living tradition." }],
            hints:["Are these traditions over?", "Look at the band under the timeline.", "The fix that calls it a living tradition, continuing today."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result surprised you most in Explore: a thesis that didn’t fit, a card in “Elsewhere”, or what disappeared when you changed the dates?" },
      { id:"j2", q:"In your own words, why is choosing a canon an argument rather than a fact?" },
      { id:"j3", q:"Explain to a friend how to test a critic’s big idea fairly, step by step." },
      { id:"j4", q:"Where do your own family’s stories fit in the map of Canadian literature? What would you add to the collection, and why?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save the line from today’s texts that felt most like <em>your</em> Canada, and say why. (Optional.)</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write a principle about reading claims and collections, something that will keep you honest when you meet a big idea. Add a master’s example from today and your own imitation.",
      placeholder:"e.g. Ask who is missing before you decide what is central.",
      examples:["In the full furnace of this hour / My thoughts grow keen and clear. (Lampman, “Heat”, lines 47–48)",
        "West wind, blow from your prairie nest, (Johnson, “The Song My Paddle Sings”, line 1)",
        "If not, it is of no consequence, for if you know Canada at all, you are probably well acquainted with a dozen towns just like it. (Leacock, <i>Sunshine Sketches</i>, chapter 1)",
        "Take up our quarrel with the foe: (McCrae, “In Flanders Fields”, line 10)",
        "surrounded on all sides by the dark forest (Moodie, <i>Roughing It in the Bush</i>, chapter 5)"]
    },
    artSamples:[
      { p:"Ask who is missing before you decide what is central.", m:"a canon of five settler texts with no Indigenous or French voice" },
      { p:"Test a big idea on the text that fits it least.", m:"Lampman’s “In the full furnace of this hour / My thoughts grow keen and clear” against the garrison thesis" }
    ],
    principleMin:6
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which best summarizes the “garrison mentality” thesis?",
          options:[{ t:"Early settler writing pictures small communities huddled against a vast, menacing land", ok:true, why:"That’s Frye’s picture: a settlement turned inward against the land." },
            { t:"Canadian writers prefer military subjects", why:"A literal misreading of “garrison”." },
            { t:"Canadian literature is mostly about cities", why:"The thesis is about land and settlement." },
            { t:"Canadian writers picture the wilderness as a paradise", why:"The opposite of the thesis." }] },
        b:{ prompt:"Which best summarizes the thesis of Margaret Atwood’s <i>Survival</i> (1972)?",
          options:[{ t:"Survival, and the ways characters respond to being victims, is a central pattern in Canadian writing", ok:true, why:"Survival as the central symbol, and the “Basic Victim Positions” characters take." },
            { t:"Canadian literature is about winning wars", why:"Not her subject." },
            { t:"All Canadians are victims", why:"An overstatement; she describes positions characters take." },
            { t:"Canadian literature is mostly science fiction", why:"Unrelated." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which work in the collection was written in French and is often read in English translation?",
          options:[{ t:"Gabrielle Roy’s <i>The Tin Flute</i>", ok:true, why:"First published in French as <i>Bonheur d’occasion</i> (1945)." },
            { t:"<i>Anne of Green Gables</i>", why:"Written in English." }, { t:"<i>Obasan</i>", why:"Written in English." }, { t:"<i>Indian Horse</i>", why:"Written in English." }] },
        b:{ prompt:"Which work in the collection was written in French?",
          options:[{ t:"Kim Thúy’s <i>Ru</i>", ok:true, why:"Written in French in Quebec, and widely read in translation." },
            { t:"<i>Sunshine Sketches of a Little Town</i>", why:"English." }, { t:"<i>The Rez Sisters</i>", why:"English, with Cree and Ojibwe words." }, { t:"“In Flanders Fields”", why:"English." }] } },
      // VERIFY: K3 (Indigenous storytelling; Johnson's biography: Mohawk and English heritage, Six Nations, toured widely around 1900, died 1913).
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"Which statement about Indigenous storytelling is accurate?",
          options:[{ t:"It is a living tradition, far older than Canada, continuing in oral and written forms today", ok:true, why:"Older than Canada, and still alive." },
            { t:"It ended when written literature arrived", why:M3 },
            { t:"It is one single tradition shared by all Indigenous nations", why:"Many nations, many traditions." },
            { t:"It is a genre invented in the twentieth century", why:"Far older." }] },
        b:{ prompt:"E. Pauline Johnson (Tekahionwake) was…",
          options:[{ t:"a poet and performer of Mohawk and English heritage from Six Nations who toured widely around 1900", ok:true, why:"Her collected poems are <i>Flint and Feather</i> (1912)." },
            { t:"a fictional character from <i>Anne of Green Gables</i>", why:"A real poet." },
            { t:"a twenty-first-century novelist", why:"She died in 1913." },
            { t:"a French-language playwright from Quebec", why:"An English-language poet from Ontario." }] } },
      { id:"t1", cat:"T", goal:[2, 5],
        a:{ prompt:"Which passage most challenges the garrison thesis?",
          options:[{ t:"Lampman: “In the full furnace of this hour / My thoughts grow keen and clear.”", ok:true, why:"The land sharpens the speaker; it doesn’t besiege him." },
            { t:"Moodie’s warning against the backwoods", why:"Supports the thesis." },
            { t:"McCrae: “Take up our quarrel with the foe”", why:"About war overseas; it doesn’t test the thesis." },
            { t:"A settler’s account of barricading a cabin against wolves in winter", why:"Supports the thesis." }] },
        b:{ prompt:"Which passage best <em>supports</em> the garrison thesis?",
          options:[{ t:"A settler’s account of barricading a cabin against wolves in winter", ok:true, why:"A household walled in against a threatening land: the garrison picture." },
            { t:"Lampman’s resting speaker in “Heat”", why:"A counterexample." },
            { t:"Leacock’s comic Mariposa", why:"Sidesteps the thesis." },
            { t:"Johnson’s paddler calling the west wind", why:"A counterexample." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"An anthology from the 1950s called “Canadian Poetry” includes thirty poets: all English-speaking, all of European descent, two of them women. What is the most defensible conclusion?",
          options:[{ t:"It presents one perspective as if it were all of Canadian poetry, leaving out Indigenous, French-language and many women’s voices", ok:true, why:"The title claims the whole; the contents show one perspective." },
            { t:"There were no other poets in Canada then", why:"Johnson, for one, was famous decades earlier." },
            { t:"Anthologies are neutral records", why:M2 },
            { t:"The anthology is worthless", why:"Overcorrection; it records one tradition well." }] },
        b:{ prompt:"A school course on Canadian literature includes only novels published after 2000. What is the most defensible conclusion?",
          options:[{ t:"It hears contemporary voices but loses the conversation with earlier writers, so “Canadian literature” looks newer than it is", ok:true, why:"A gain and a loss: name both." },
            { t:"Older Canadian books aren’t literature", why:"A value judgment with no basis." },
            { t:"The course covers all of Canadian literature", why:"It covers one period. " + M2 },
            { t:"Recent novels are always better", why:"Unsupported." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Read this original passage: “Every January my grandmother drilled a hole in the lake ice and handed me the line. ‘The lake feeds us,’ she said, ‘if we listen to it.’” How does it relate to the survival thesis?",
          options:[{ t:"It complicates it: the frozen land is home and provider, not an enemy to endure", ok:true, why:"Cold, but not hostile: the lake feeds them." },
            { t:"It proves the thesis, because it’s cold", why:"Cold isn’t victimhood. " + M4 },
            { t:"It has nothing to do with Canada", why:"Ice fishing on a lake in January is a strongly Canadian scene." },
            { t:"It supports the garrison thesis, because the town is small", why:"No town and no siege in the passage." }] },
        b:{ prompt:"Read this original passage: “In our first winter in Winnipeg, my father learned English from the bus schedule and my mother learned it from the doctor.” How does it relate to the survival thesis?",
          options:[{ t:"It moves “survival” from the wilderness to a new country’s systems: surviving language, work and belonging", ok:true, why:"Survival is still there, transformed." },
            { t:"It disproves survival entirely", why:"Survival is present, but transformed." },
            { t:"It’s about the weather", why:"Winter is the setting, not the struggle." },
            { t:"It isn’t Canadian literature, because the family is new to Canada", why:M1 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which sentence best justifies a choice in a canon?",
          options:[{ t:"“I included <i>Ru</i> and <i>The Tin Flute</i> because a canon that hears only English misses how Quebec writers, including a refugee from Vietnam, have shaped the country’s story.”", ok:true, why:"A criterion (language) and a reason it matters." },
            { t:"“I included them because they’re good books.”", why:"No criteria." },
            { t:"“I included them because they’re French.”", why:"A label, not a reason." },
            { t:"“I included every book I’ve heard of.”", why:"No selection, so no canon." }] },
        b:{ prompt:"Which sentence best justifies a choice in a canon?",
          options:[{ t:"“I paired Johnson’s <i>Flint and Feather</i> with Wagamese’s <i>Indian Horse</i> to show that Indigenous writing in Canada spans more than a century, not just recent decades.”", ok:true, why:"The pairing itself makes an argument about time and voice." },
            { t:"“I chose them because they’re Indigenous.”", why:"A label, not a reason." },
            { t:"“I chose them because they were on a list.”", why:"Whose list, and why?" },
            { t:"“I chose them randomly.”", why:"No criteria." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which sentence best uses a critic’s thesis in an essay?",
          options:[{ t:"“Atwood argues in <i>Survival</i> (1972) that victimhood shapes Canadian writing; Lampman’s ‘Heat’ tests that claim, since its speaker is no victim at all.”", ok:true, why:"It reports the thesis, then tests it with evidence." },
            { t:"“<i>Survival</i> is true, so ‘Heat’ must be about survival.”", why:M6 },
            { t:"“Atwood is famous, so her thesis is right.”", why:"Authority isn’t evidence." },
            { t:"“<i>Survival</i> says lots of things about Canadian books.”", why:"Vague." }] },
        b:{ prompt:"Which sentence best uses a critic’s thesis in an essay?",
          options:[{ t:"“Frye describes settler communities that turn inward against the land; Johnson’s paddler, who calls the wind like a companion, shows a relationship his idea doesn’t cover.”", ok:true, why:"It reports the thesis, then finds the case it doesn’t cover." },
            { t:"“Frye proves that all Canadians fear nature.”", why:M4 + " " + M6 },
            { t:"“Frye is an old critic, so he’s wrong.”", why:"Age isn’t evidence." },
            { t:"“Frye wrote about garrisons.”", why:"A fragment, not a use." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A school library display has five English-language novels from Ontario, all by authors of European descent. Which addition best broadens it, and why?",
          options:[{ t:"Tomson Highway’s <i>The Rez Sisters</i>: an Indigenous playwright and a play, adding both a voice and a form", ok:true, why:"One choice widens two things at once." },
            { t:"Another Ontario novel", why:"More of the same." },
            { t:"A book chosen at random", why:"No criteria." },
            { t:"“In Flanders Fields”, because it’s famous", why:"Fame alone doesn’t broaden this display much." }] },
        b:{ prompt:"A display has only books published after 2000. Which addition best broadens it, and why?",
          options:[{ t:"E. Pauline Johnson’s <i>Flint and Feather</i> (1912): an early Indigenous voice that adds both history and perspective", ok:true, why:"It reaches back a century, and adds a voice." },
            { t:"Another recent novel", why:"More of the same." },
            { t:"A bestseller from last month", why:"Still recent." },
            { t:"A cookbook", why:"A different kind of book, but not literature in this sense." }] } },
      // VERIFY: A2 (Indigenous presence on the land "for millennia"; Confederation framing) with the Indigenous education lead.
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A tourism ad shows an empty northern lake with the tagline “Untouched wilderness.” Which response best reflects this module’s questions?",
          options:[{ t:"Ask whose land it is: “untouched” erases the Indigenous peoples who have lived with and cared for that land for millennia", ok:true, why:"Who’s missing from the frame is the question to ask." },
            { t:"It’s accurate, since there are no buildings", why:"Absence of buildings isn’t absence of people." },
            { t:"It’s a beautiful photo, so the words don’t matter", why:"Words frame how we see." },
            { t:"Ads aren’t literature, so the question doesn’t apply", why:"Perspective matters in every text." }] },
        b:{ prompt:"A short historical video tells “the story of Canada” beginning in 1867. Which response best reflects this module’s questions?",
          options:[{ t:"It starts the story at Confederation, leaving out the Indigenous nations and the long histories before it", ok:true, why:"Where a story starts decides who is in it." },
            { t:"It’s correct, because Canada began in 1867", why:"The country did; the land’s stories didn’t." },
            { t:"It’s too short to matter", why:"Short texts shape views too." },
            { t:"Videos can’t have a perspective", why:"Every text chooses what to show." }] } }
    ]
  },
  task:{
    title:"Performance task: Curate a canon", summary:"Curate a canon",
    statement:"<p>Choose six works from the collection to make a small Canadian canon, then write a curator’s statement that explains your criteria, and names what your choice leaves out.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["Exactly six works", "Range across time", "More than one kind of voice", "More than one form", "Your statement names your criteria", "Your statement names what’s missing", "Length"],
    tips:["A canon here is exactly six. Choose carefully.", "Reach back in time: add something from before 1940.", "Add an Indigenous author (Johnson, Highway, Wagamese) and a work translated from French (Roy, Hébert, Thúy).",
      "Mix your forms: a poem, a play or a memoir.", "Use the word for each criterion you chose, so your reader can see your ruler.", "Every canon leaves voices out. Say which.", "Too short: justify each choice. Too long: cut the summaries."],
    chipTip:"Choose 2 or 3 criteria chips.",
    explainPrompt:"Craft statement: Which of your six was hardest to include, and which was hardest to leave out? What does that tell you about your ruler?",
    explainLabel:"Craft statement",
    vocab:"Use the words canon, criteria, perspective and missing.",
    checkLabel:"Check my canon",
    success:"Your canon has every part.",
    more:"Try another canon with different criteria: each complete one joins your list.",
    min:140, max:240,
    chips:[{ id:"rep", t:"Representation", kw:"represent" }, { id:"craft", t:"Craft", kw:"craft" }, { id:"inf", t:"Influence", kw:"influen" },
      { id:"hist", t:"Historical importance", kw:"histor" }, { id:"conn", t:"Connection to readers", kw:"connect" }, { id:"forms", t:"Range of forms", kw:"form" }],
    missWords:["missing", "left out", "leaves out", "absent", "omit"],
    labels:{ pick:"Your six works", pickHow:"Tap a card to add it to your canon; tap it again to take it off. Six slots.", copy:"Copy my Explore shelf", copied:"Copied your shelf from Explore.", noShelf:"Your Explore shelf is empty.",
      chips:"Criteria (choose 2 or 3)", draft:"Curator’s statement", glance:"Your canon at a glance", models:"One way it can be done: three model responses", modelsNote:"Three different rulers, three different canons. Each one names what it leaves out." },
    rubric:RUBRIC,
    models:[
      { title:"Model 1: “Many places, many voices”", works:[1, 4, 3, 8, 10, 12], chips:["rep", "forms"],
        text:"My canon is built to represent as many ways of living in this country as six works allow. Moodie’s <i>Roughing It in the Bush</i> shows a settler’s fear of the backwoods, and Johnson’s poems answer it with a Mohawk poet’s ease on the water, so the collection opens as a conversation rather than a single story. Montgomery adds Prince Edward Island and a girl’s delight in her landscape; Roy’s <i>The Tin Flute</i> brings Montreal’s poverty, read in translation from French; Kogawa’s <i>Obasan</i> shows a Japanese Canadian family uprooted by its own government; and Highway’s <i>The Rez Sisters</i> puts Indigenous women’s humour on stage. I chose a range of forms (memoir, poetry, fiction and drama) because each form lets different voices speak. What is missing is large: there is no Black Canadian writer here, nothing from the North, and nothing written in an Indigenous language, so any reader should treat this list as a beginning." },
      { title:"Model 2: “The land as a character”", works:[2, 6, 7, 9, 15, 18], chips:["craft", "hist"],
        text:"This canon follows one question across a century and a half of history: what does this land do to the people who live on it? Lampman’s “Heat” finds clarity in the noon glare, and McCrae’s poppies grow over soldiers far from home, so even the earliest pieces disagree. Ross’s prairie town is pressed by dust and wind; Hébert’s <i>Kamouraska</i>, read in translation from French, turns snowbound Quebec into a stage for passion and crime; MacLeod’s Cape Breton families carry the sea in their blood; and Wagamese’s <i>Indian Horse</i> finds healing in land and memory after a residential school. I chose each work for its craft: every writer makes landscape do the work of feeling. Left out are the cities, the North and most writing by newcomers to Canada. That is the price of choosing one theme, and a reason to read beyond this list." },
      { title:"Model 3: “New Canadians, old questions”", works:[5, 8, 12, 14, 16, 17], chips:["conn", "inf"],
        text:"I built this canon for readers like the students in my school, many of whose families arrived recently, so connection was my first test. Leacock’s gentle mockery of a small Ontario town shows the older Canada that newcomers often hear about. Roy’s Montreal family and Thúy’s <i>Ru</i>, both read in translation from French, show poverty in one century and a refugee’s arrival in another; Mistry writes about India from Toronto, reminding us that Canadian writers carry other countries with them; Brand’s Toronto children of immigrants ask what belonging means; and Highway’s <i>The Rez Sisters</i> reminds every newcomer story that it takes place on Indigenous land. My second test was influence: each book changed what people expected Canadian literature to be. Missing are the poets, the Atlantic provinces and anything before 1900, so this canon speaks loudly about the present and quietly about the past." }
    ]
  },
  // VERIFY: card 9 (Johnson, 1861–1913) and card 10 (McCrae, written in Belgium) biographical details.
  cards:[
    ["Canon", "A list of works treated as essential, from Greek <em>kanōn</em>, “measuring rod”. Always ask: whose ruler?"],
    ["Garrison mentality (Frye, 1965)", "Early settler writing pictures small communities huddled against a vast, menacing land. Frye: less “Who am I?” than “Where is here?”"],
    ["<i>Survival</i> (Atwood, 1972)", "“The central symbol for Canada [. . .] is undoubtedly Survival”: the “Basic Victim Positions” run up to the “creative non-victim”."],
    ["Testing a thesis", "Find support and counterexamples; narrow the claim to what the evidence shows."],
    ["Counterexample", "A case that doesn’t fit: Lampman’s “My thoughts grow keen and clear” against the garrison thesis."],
    ["Perspective", "Who is speaking, from where, and for whom. One text is one view."],
    ["Who’s missing?", "The question that reveals a canon’s or a thesis’s limits."],
    ["Indigenous storytelling", "A living tradition, older than Canada and continuing now, in many nations and forms."],
    ["E. Pauline Johnson (Tekahionwake)", "Poet and performer of Mohawk and English heritage (1861–1913): <i>Flint and Feather</i>."],
    ["“In Flanders Fields”", "John McCrae, 1915: a rondeau in the voice of the dead; written in Belgium, recited every November 11."],
    ["Literature in translation", "Works like Roy’s <i>The Tin Flute</i> and Thúy’s <i>Ru</i>, written in French and widely read in English."],
    ["Confederation Poets", "Late-nineteenth-century poets, such as Lampman, who wrote closely about Canadian landscape."]
  ]
};
