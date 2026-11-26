// ENG4U 07 Conventions & Citation. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/07-conventions-and-citation.md
// Public-domain texts: Austen, Pride and Prejudice (1813), opening sentence; Dickens, A Tale of Two Cities (1859), opening;
// Chopin, "The Story of an Hour" (1894; the 23-paragraph text, as in ENG4U 02); Shelley, "Ozymandias" (standard modern text, as
// in ENG4U 04); Mansfield, "Miss Brill" (1920; paragraphs 9–18 of the 18-paragraph text, as in ENG4U 05); Bacon, "Of Studies"
// (1625; one paragraph, as in ENG4U 06); Dickinson, "Because I could not stop for Death" (manuscript dashes; 1890 printing for
// comparison); Shakespeare, Hamlet (Globe text and line numbers). The anthology, journal, website and Hamlet edition used for
// Works Cited practice are fictional (plan §6.3). Every student paragraph, example sentence and model is original to the course.
// "col&#111;r" / "gr&#97;y" keep the sources' and the errors' American spellings (the spelling check reads plain text).

const M1 = "In MLA, the citation is part of your sentence. Close the quotation, add the citation, <em>then</em> the period: “…a play” (Mansfield, par. 9).";
const M2 = "MLA page citations are just the author and the number: (Chopin 42).";
const M3 = "Trimming is allowed; twisting isn’t. The shortened quotation must still mean what the source meant.";
const M4 = "Two complete sentences need a period, a semicolon, or a comma <em>plus</em> a joining word.";
const M5 = "An opening phrase describes the subject that comes right after it. The popcorn wasn’t walking.";
const M6 = "Conventions carry meaning. A master’s deliberate break (a Dickinson dash) is a choice; an accidental break is an error. Know which you’re making.";
const M7 = "Inline poetry marks line breaks with a spaced slash ( / ). Block quotations drop the quotation marks: the indent already says “quoted”.";

const ANTH = "<em>The Craft of Reading: Public-Domain Prose and Poetry</em>";

const OZ = ["I met a traveller from an antique land,", "Who said—“Two vast and trunkless legs of stone", "Stand in the desert. . . . Near them, on the sand,",
  "Half sunk a shattered visage lies, whose frown,", "And wrinkled lip, and sneer of cold command,", "Tell that its sculptor well those passions read",
  "Which yet survive, stamped on these lifeless things,", "The hand that mocked them, and the heart that fed;", "And on the pedestal, these words appear:",
  "My name is Ozymandias, King of Kings;", "Look on my Works, ye Mighty, and despair!", "Nothing beside remains. Round the decay",
  "Of that colossal Wreck, boundless and bare", "The lone and level sands stretch far away.”"];

const HOUR = [
  "Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband’s death.",
  "It was her sister Josephine who told her, in broken sentences; veiled hints that revealed in half concealing. Her husband’s friend Richards was there, too, near her. It was he who had been in the newspaper office when intelligence of the railroad disaster was received, with Brently Mallard’s name leading the list of “killed.” He had only taken the time to assure himself of its truth by a second telegram, and had hastened to forestall any less careful, less tender friend in bearing the sad message.",
  "She did not hear the story as many women have heard the same, with a paralyzed inability to accept its significance. She wept at once, with sudden, wild abandonment, in her sister’s arms. When the storm of grief had spent itself she went away to her room alone. She would have no one follow her.",
  "There stood, facing the open window, a comfortable, roomy armchair. Into this she sank, pressed down by a physical exhaustion that haunted her body and seemed to reach into her soul.",
  "She could see in the open square before her house the tops of trees that were all aquiver with the new spring life. The delicious breath of rain was in the air. In the street below a peddler was crying his wares. The notes of a distant song which some one was singing reached her faintly, and countless sparrows were twittering in the eaves.",
  "There were patches of blue sky showing here and there through the clouds that had met and piled one above the other in the west facing her window.",
  "She sat with her head thrown back upon the cushion of the chair, quite motionless, except when a sob came up into her throat and shook her, as a child who has cried itself to sleep continues to sob in its dreams.",
  "She was young, with a fair, calm face, whose lines bespoke repression and even a certain strength. But now there was a dull stare in her eyes, whose gaze was fixed away off yonder on one of those patches of blue sky. It was not a glance of reflection, but rather indicated a suspension of intelligent thought.",
  "There was something coming to her and she was waiting for it, fearfully. What was it? She did not know; it was too subtle and elusive to name. But she felt it, creeping out of the sky, reaching toward her through the sounds, the scents, the col&#111;r that filled the air.",
  "Now her bosom rose and fell tumultuously. She was beginning to recognize this thing that was approaching to possess her, and she was striving to beat it back with her will—as powerless as her two white slender hands would have been.",
  "When she abandoned herself a little whispered word escaped her slightly parted lips. She said it over and over under her breath: “free, free, free!” The vacant stare and the look of terror that had followed it went from her eyes. They stayed keen and bright. Her pulses beat fast, and the coursing blood warmed and relaxed every inch of her body.",
  "She did not stop to ask if it were or were not a monstrous joy that held her. A clear and exalted perception enabled her to dismiss the suggestion as trivial.",
  "She knew that she would weep again when she saw the kind, tender hands folded in death; the face that had never looked save with love upon her, fixed and gr&#97;y and dead. But she saw beyond that bitter moment a long procession of years to come that would belong to her absolutely. And she opened and spread her arms out to them in welcome.",
  "There would be no one to live for during those coming years; she would live for herself. There would be no powerful will bending hers in that blind persistence with which men and women believe they have a right to impose a private will upon a fellow-creature. A kind intention or a cruel intention made the act seem no less a crime as she looked upon it in that brief moment of illumination.",
  "And yet she had loved him—sometimes. Often she had not. What did it matter! What could love, the unsolved mystery, count for in face of this possession of self-assertion which she suddenly recognized as the strongest impulse of her being!",
  "“Free! Body and soul free!” she kept whispering.",
  "Josephine was kneeling before the closed door with her lips to the keyhole, imploring for admission. “Louise, open the door! I beg; open the door—you will make yourself ill. What are you doing, Louise? For heaven’s sake open the door.”",
  "“Go away. I am not making myself ill.” No; she was drinking in a very elixir of life through that open window.",
  "Her fancy was running riot along those days ahead of her. Spring days, and summer days, and all sorts of days that would be her own. She breathed a quick prayer that life might be long. It was only yesterday she had thought with a shudder that life might be long.",
  "She arose at length and opened the door to her sister’s importunities. There was a feverish triumph in her eyes, and she carried herself unwittingly like a goddess of Victory. She clasped her sister’s waist, and together they descended the stairs. Richards stood waiting for them at the bottom.",
  "Some one was opening the front door with a latchkey. It was Brently Mallard who entered, a little travel-stained, composedly carrying his grip-sack and umbrella. He had been far from the scene of the accident, and did not even know there had been one. He stood amazed at Josephine’s piercing cry; at Richards’ quick motion to screen him from the view of his wife.",
  "But Richards was too late.",
  "When the doctors came they said she had died of heart disease—of the joy that kills."];

const BRILL = [
  "Oh, how fascinating it was! How she enjoyed it! How she loved sitting here, watching it all! It was like a play. It was exactly like a play. Who could believe the sky at the back wasn’t painted? But it wasn’t till a little brown dog trotted on solemn and then slowly trotted off, like a little “theatre” dog, a little dog that had been drugged, that Miss Brill discovered what it was that made it so exciting. They were all on the stage. They weren’t only the audience, not only looking on; they were acting. Even she had a part and came every Sunday. No doubt somebody would have noticed if she hadn’t been there; she was part of the performance after all. How strange she’d never thought of it like that before! And yet it explained why she made such a point of starting from home at just the same time each week—so as not to be late for the performance—and it also explained why she had quite a queer, shy feeling at telling her English pupils how she spent her Sunday afternoons. No wonder! Miss Brill nearly laughed out loud. She was on the stage. She thought of the old invalid gentleman to whom she read the newspaper four afternoons a week while he slept in the garden. She had got quite used to the frail head on the cotton pillow, the hollowed eyes, the open mouth and the high pinched nose. If he’d been dead she mightn’t have noticed for weeks; she wouldn’t have minded. But suddenly he knew he was having the paper read to him by an actress! “An actress!” The old head lifted; two points of light quivered in the old eyes. “An actress—are ye?” And Miss Brill smoothed the newspaper as though it were the manuscript of her part and said gently; “Yes, I have been an actress for a long time.”",
  "The band had been having a rest. Now they started again. And what they played was warm, sunny, yet there was just a faint chill—a something, what was it?—not sadness—no, not sadness—a something that made you want to sing. The tune lifted, lifted, the light shone; and it seemed to Miss Brill that in another moment all of them, all the whole company, would begin singing. The young ones, the laughing ones who were moving together, they would begin, and the men’s voices, very resolute and brave, would join them. And then she too, she too, and the others on the benches—they would come in with a kind of accompaniment—something low, that scarcely rose or fell, something so beautiful—moving.... And Miss Brill’s eyes filled with tears and she looked smiling at all the other members of the company. Yes, we understand, we understand, she thought—though what they understood she didn’t know.",
  "Just at that moment a boy and girl came and sat down where the old couple had been. They were beautifully dressed; they were in love. The hero and heroine, of course, just arrived from his father’s yacht. And still soundlessly singing, still with that trembling smile, Miss Brill prepared to listen.",
  "“No, not now,” said the girl. “Not here, I can’t.”",
  "“But why? Because of that stupid old thing at the end there?” asked the boy. “Why does she come here at all—who wants her? Why doesn’t she keep her silly old mug at home?”",
  "“It’s her fu-fur which is so funny,” giggled the girl. “It’s exactly like a fried whiting.”",
  "“Ah, be off with you!” said the boy in an angry whisper. Then: “Tell me, ma petite chère—”",
  "“No, not here,” said the girl. “Not <em>yet</em>.”",
  "On her way home she usually bought a slice of honey-cake at the baker’s. It was her Sunday treat. Sometimes there was an almond in her slice, sometimes not. It made a great difference. If there was an almond it was like carrying home a tiny present—a surprise—something that might very well not have been there. She hurried on the almond Sundays and struck the match for the kettle in quite a dashing way.",
  "But to-day she passed the baker’s by, climbed the stairs, went into the little dark room—her room like a cupboard—and sat down on the red eiderdown. She sat there for a long time. The box that the fur came out of was on the bed. She unclasped the necklet quickly; quickly, without looking, laid it inside. But when she put the lid on she thought she heard something crying."];

const BACON = "Studies serve for delight, for ornament, and for ability. Their chief use for delight, is in privateness and retiring; for ornament, is in discourse; and for ability, is in the judgment, and disposition of business. For expert men can execute, and perhaps judge of particulars, one by one; but the general counsels, and the plots and marshalling of affairs, come best, from those that are learned. To spend too much time in studies is sloth; to use them too much for ornament, is affectation; to make judgment wholly by their rules, is the humour of a scholar. They perfect nature, and are perfected by experience: for natural abilities are like natural plants, that need pruning, by study; and studies themselves, do give forth directions too much at large, except they be bounded in by experience. Crafty men contemn studies, simple men admire them, and wise men use them; for they teach not their own use; but that is a wisdom without them, and above them, won by observation. Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider. Some books are to be tasted, others to be swallowed, and some few to be chewed and digested; that is, some books are to be read only in parts; others to be read, but not curiously; and some few to be read wholly, and with diligence and attention. Some books also may be read by deputy, and extracts made of them by others; but that would be only in the less important arguments, and the meaner sort of books, else distilled books are like common distilled waters, flashy things. Reading maketh a full man; conference a ready man; and writing an exact man. And therefore, if a man write little, he had need have a great memory; if he confer little, he had need have a present wit: and if he read little, he had need have much cunning, to seem to know, that he doth not. Histories make men wise; poets witty; the mathematics subtile; natural philosophy deep; moral grave; logic and rhetoric able to contend. Abeunt studia in mores. Nay, there is no stond or impediment in the wit, but may be wrought out by fit studies; like as diseases of the body, may have appropriate exercises. Bowling is good for the stone and reins; shooting for the lungs and breast; gentle walking for the stomach; riding for the head; and the like. So if a man’s wit be wandering, let him study the mathematics; for in demonstrations, if his wit be called away never so little, he must begin again. If his wit be not apt to distinguish or find differences, let him study the Schoolmen; for they are cymini sectores. If he be not apt to beat over matters, and to call up one thing to prove and illustrate another, let him study the lawyers’ cases. So every defect of the mind, may have a special receipt.";

// Works Cited element ids (MLA 9 core elements, in template order)
const EL = { author:"Author", title:"Title of source", cont:"Title of container", contrib:"Other contributors", ver:"Version", num:"Number", pub:"Publisher", date:"Publication date", loc:"Location" };
// one Works Cited card: facts html, elements (in a scrambled starting order) with their forms, and the key (order + punctuation after each)
function card(id, label, facts, els, start, punct, real){
  const order = els.map(e => e[0]), byId = {}, f = {}; els.forEach(e => { byId[e[0]] = e; f[e[0]] = e[1].findIndex(x => x.ok); });
  return { id, label, facts, fict:!real, els:start.map(k => ({ id:k, label:EL[k], forms:byId[k][1].map(({ ok, ...x }) => x) })), answer:{ order, p:punct, f } };
}
const AU = (last, first) => [{ t:last + ", " + first, ok:true }, { t:first + " " + last, e:"name" }];
const TQ = (t) => [{ t, s:"q", ok:true }, { t, s:"i", e:"tital" }];
const TI = (t) => [{ t, s:"i", ok:true }, { t, s:"q", e:"titlq" }, { t, s:"", e:"plain" }];
const ED = (name, cap) => cap ? [{ t:"Edited by " + name, ok:true }, { t:"edited by " + name, e:"edlow" }] : [{ t:"edited by " + name, ok:true }, { t:"Edited by " + name, e:"edcap" }];
const PP = (r) => [{ t:"pp. " + r, ok:true }, { t:"pg. " + r, e:"pg" }, { t:r, e:"bare" }];
const P1 = (r) => [{ t:"p. " + r, ok:true }, { t:"pg. " + r, e:"pg" }, { t:r, e:"bare" }];
const ONE = (t) => [{ t, ok:true }];
const CR = "The Craft of Reading: Public-Domain Prose and Poetry";
const anthCard = (id, label, last, first, title, story, loc) => card(id, label,
  "<p>The " + story + " “" + title + "” by " + first + " " + last + ", printed in the course anthology " + ANTH + ", edited by Ana Ruiz (Lakeshore Press, 2024), " + (/–/.test(loc) ? "pages " : "page ") + loc + ".</p>",
  [["author", AU(last, first)], ["title", TQ(title)], ["cont", TI(CR)], ["contrib", ED("Ana Ruiz")], ["pub", ONE("Lakeshore Press")], ["date", ONE("2024")], ["loc", /–/.test(loc) ? PP(loc) : P1(loc)]],
  ["cont", "date", "title", "author", "loc", "pub", "contrib"], { author:".", title:".", cont:",", contrib:",", pub:",", date:",", loc:"." });
const screenCard = (id, label, last, first, title) => card(id, label,
  "<p>“" + title + "” by " + first + " " + last + ", as displayed on screen in this module, <em>Conventions and Citation</em> (MindView, 2026), with numbered paragraphs.</p>",
  [["author", AU(last, first)], ["title", TQ(title)], ["cont", TI("Conventions and Citation")], ["pub", ONE("MindView")], ["date", ONE("2026")]],
  ["title", "pub", "author", "date", "cont"], { author:".", title:".", cont:",", pub:",", date:"." }, true);

export default {
  id:"07-conventions-and-citation",
  kind:"topic",
  title:"Conventions and citation",
  topic:"Conventions & Citation",
  readyTopic:"conventions and citation",
  hero:{
    headline:"Every mark is a signal",
    text:"Austen’s commas don’t follow today’s rules: we’d drop the comma before “that” and the one before “must”. In 1813, commas marked where a reader <em>breathed</em>; today they mostly mark grammar. Conventions are <strong>agreements between writers and readers</strong>, and they change. This module teaches the agreements that matter now (<strong>punctuation</strong>, <strong>sentence grammar</strong> and <strong>MLA 9 citation</strong>) so that your reader hears your thinking, not your mistakes.",
    fig:{ html:'<div class="cvh" id="cv-hero" role="group" aria-label="Austen’s opening sentence twice: as printed in 1813, with two breath commas, and as today’s grammar would punctuate it"></div>', caption:"" },
    passage:"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    cite:"Jane Austen, <em>Pride and Prejudice</em> (1813), opening sentence",
    caption:"Same words. Different agreement. Know the rules you’re keeping, and the ones you’re breaking.",
    tags:["1813: breath", "today: grammar"]
  },
  goals:[
    "I can write MLA 9 in-text citations for prose (page or paragraph), poetry (lines) and drama (act.scene.line).",
    "I can build MLA 9 Works Cited entries from the core elements, in the right order with the right punctuation.",
    "I can integrate quotations with signal phrases, brackets, ellipses and block format, without changing the source’s meaning.",
    "I can use commas, semicolons, colons and dashes to shape meaning and rhythm.",
    "I can find and fix sentence-level errors (comma splices, dangling and misplaced modifiers, agreement, pronoun reference) and tell an error from a deliberate stylistic choice.",
    "I can proofread my own writing with strategies matched to the errors I tend to make."
  ],
  start:{
    blocks:[
      { title:"Word story: <em>comma</em>, <em>colon</em>, <em>period</em>", html:"<p>Three marks are named after parts of a spoken sentence in Greek rhetoric:</p><ul><li>a <strong>comma</strong> (<em>komma</em>, “a piece cut off”) was a short phrase;</li><li>a <strong>colon</strong> (<em>kolon</em>, “a limb”) was a longer member of a sentence;</li><li>a <strong>period</strong> (<em>periodos</em>, “a going round, a circuit”) was the whole sentence, coming round to its end.</li></ul><p>The names moved from the spoken units to the marks that signal them. Every time you punctuate, you’re scoring speech for a silent reader.</p>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Quotation punctuation", goal:1, prompt:"Which sentence is punctuated correctly in MLA style?",
          options:[
            { t:"Miss Brill decides the scene is “exactly like a play” (Mansfield, par. 9).", ok:true, why:"Quotation marks close, then the citation, then the period." },
            { t:"Miss Brill decides the scene is “exactly like a play.” (Mansfield, par. 9)", why:"The period belongs after the citation." },
            { t:"Miss Brill decides the scene is “exactly like a play” (Mansfield par 9.)", why:"MLA writes “par.” with a period and a comma after the author, and the sentence’s period goes outside the parenthesis." },
            { t:"Miss Brill decides the scene is exactly like a play (Mansfield, par. 9).", why:"Borrowed words need quotation marks." }],
          hints:["Where does the sentence actually end?", "After the citation.", "Miss Brill decides the scene is “exactly like a play” (Mansfield, par. 9)."] },
        { id:"w2", skill:"Quotation punctuation", goal:3, prompt:"What does an ellipsis ( . . . ) in a quotation tell the reader?",
          options:[
            { t:"Words have been left out of the original", ok:true, why:"It marks words the quoter removed." },
            { t:"The speaker trailed off.", why:"In a quotation you’ve trimmed, it marks your omission, not the speaker’s pause." },
            { t:"Words have been added.", why:"Added words go in square brackets." },
            { t:"The quotation is from a poem.", why:"Line breaks use a slash." }],
          hints:["What did the quoter do to the original?", "Removed something.", "Words have been left out of the original."] },
        { id:"w3", skill:"Sentence boundaries", goal:5, prompt:"Which is a <strong>comma splice</strong>?",
          options:[
            { t:"The bell rang, everyone ran for the doors.", ok:true, why:"Two complete sentences joined by only a comma." },
            { t:"The bell rang, and everyone ran for the doors.", why:"The comma plus “and” joins them correctly." },
            { t:"When the bell rang, everyone ran for the doors.", why:"The first part is a dependent clause." },
            { t:"The bell rang; everyone ran for the doors.", why:"A semicolon can join two related sentences." }],
          hints:["Can each half stand alone?", "If both can, a comma alone isn’t enough.", "The bell rang, everyone ran for the doors."] },
        { id:"w4", skill:"Sentence boundaries", goal:4, prompt:"Which mark best introduces the explanation? “The story ends with a single, devastating word ___ crying.”",
          options:[
            { t:"a colon (:)", ok:true, why:"A colon announces what follows: here, the word itself." },
            { t:"a semicolon (;)", why:"Semicolons join two complete sentences; “crying” isn’t one." },
            { t:"a comma (,)", why:"It would work grammatically, but loses the drumroll." },
            { t:"no mark", why:"Run together, it blurs the emphasis." }],
          hints:["Which mark says “here it comes”?", "The one that announces.", "A colon."] },
        { id:"w5", skill:"Titles", goal:2, prompt:"Which is formatted correctly?",
          options:[
            { t:"Shelley’s “Ozymandias” and Shakespeare’s <em>Hamlet</em>", ok:true, why:"Quotation marks for short works, italics for long ones." },
            { t:"Shelley’s <em>Ozymandias</em> and Shakespeare’s “Hamlet”", why:"Reversed. A sonnet is short; a play is long." },
            { t:"Shelley’s Ozymandias and Shakespeare’s Hamlet", why:"Titles need formatting." },
            { t:"Shelley’s ‘OZYMANDIAS’ and Shakespeare’s HAMLET", why:"Capitals aren’t a title format." }],
          hints:["Short or long work?", "Short works take quotation marks; long ones take italics.", "Shelley’s “Ozymandias” and Shakespeare’s <em>Hamlet</em>."] },
        { id:"w6", skill:"Spelling", goal:6, prompt:"Which sentence uses Canadian spelling and the correct homophone?",
          options:[
            { t:"The theatre’s colour scheme had its own charm.", ok:true, why:"Canadian <em>theatre</em> and <em>colour</em>, and <em>its</em> for “belonging to it”." },
            { t:"The theater’s col&#111;r scheme had it’s own charm.", why:"American spelling, and “it’s” means “it is”. Canadian: theatre, colour; possessive: its." },
            { t:"The theatre’s colour scheme had it’s own charm.", why:"“It’s” means “it is”." },
            { t:"The theatres colour scheme had its own charm.", why:"The possessive needs an apostrophe: theatre’s." }],
          hints:["Check <em>-re</em>/<em>-er</em> and <em>-our</em>/<em>-or</em>.", "Then test “it’s”: can you say “it is”?", "The theatre’s colour scheme had its own charm."] }
      ],
      refreshers:{
        "Quotation punctuation":"Signal phrase → “quoted words” → (citation) → period. Square brackets for changes, spaced ellipsis ( . . . ) for omissions.",
        "Sentence boundaries":"Two complete sentences need a period, a semicolon, or a comma plus <em>and, but, or, nor, for, so, yet</em>.",
        "Titles":"Short works (poems, stories, essays, articles) take “quotation marks”; long works (plays, novels, films, websites, journals) take <em>italics</em>.",
        "Spelling":"Canadian: colour, honour, centre, theatre, analyse, travelled, defence. It’s = it is; its = belonging to it."
      }
    }
  },
  explore:{
    heading:"The quotation workshop",
    intro:"Borrow words honestly and fit them into your sentence. Then hear how punctuation changes the music.",
    m1:M1, m3:M3, m7:M7,
    aha:"<strong>Every convention carries information.</strong> The citation tells the reader <em>where</em>, the slash <em>where the line broke</em>, the brackets <em>what you changed</em>, and the colon <em>what’s coming</em>. Readers rely on these signals the way musicians rely on a score.",
    sources:[
      { id:"oz", label:"“Ozymandias”", type:"poetry", author:"Shelley", lines:OZ, start:1, cite:"Percy Bysshe Shelley, “Ozymandias” (1818), lines 1–14. Cite by line: (Shelley, lines 10–11)." },
      { id:"hour", label:"“The Story of an Hour”", type:"prose", author:"Chopin", pars:HOUR, start:1, cite:"Kate Chopin, “The Story of an Hour” (1894), paragraphs 1–23. Cite by paragraph: (Chopin, par. 5)." },
      { id:"brill", label:"“Miss Brill”", type:"prose", author:"Mansfield", pars:BRILL, start:9, cite:"Katherine Mansfield, “Miss Brill” (1920), paragraphs 9–18 of 18 (the ending). Cite by paragraph: (Mansfield, par. 9)." },
      { id:"bacon", label:"“Of Studies”", type:"prose", one:true, author:"Bacon", pars:[BACON], start:1, cite:"Francis Bacon, “Of Studies” (1625), one paragraph, no numbers. Cite the author only: (Bacon)." },
      { id:"ham", label:"<em>Hamlet</em>", type:"drama", author:"Shakespeare", title:"Hamlet", cite:"William Shakespeare, <em>Hamlet</em> (c. 1600), Globe text and line numbers. Cite by act, scene and line: (<em>Hamlet</em> 3.1.56–60).",
        passages:[
          { id:"h1", ref:"1.2", start:129, who:"Hamlet", lines:["O, that this too too solid flesh would melt", "Thaw and resolve itself into a dew!"] },
          { id:"h2", ref:"1.3", start:78, who:"Polonius", lines:["This above all: to thine own self be true,", "And it must follow, as the night the day,", "Thou canst not then be false to any man."] },
          { id:"h3", ref:"3.1", start:56, who:"Hamlet", lines:["To be, or not to be: that is the question:", "Whether ’tis nobler in the mind to suffer", "The slings and arrows of outrageous fortune,", "Or to take arms against a sea of troubles,", "And by opposing end them? To die: to sleep;"] }] }
    ],
    leads:["{a} writes,", "the speaker reports that", "As the narrator observes,"],
    breaks:[{ id:"slash", t:"slash ( / )" }, { id:"none", t:"nothing" }, { id:"nl", t:"new line" }, { id:"comma", t:"comma" }],
    music:{
      marks:[{ id:"comma", t:"comma", ms:150 }, { id:"semicolon", t:"semicolon", ms:350 }, { id:"colon", t:"colon", ms:350 }, { id:"dash", t:"dash", ms:250 }, { id:"period", t:"period", ms:600 }, { id:"but", t:"comma + “but”", ms:150 }],
      sents:[
        { id:"s1", a:"Miss Brill had imagined herself on a stage", b:"the couple’s laughter brought the curtain down.",
          fx:{ comma:["Comma splice (two independent clauses): the halves run together.", 0], semicolon:["Semicolon: balances the dream against the fall.", 1],
            colon:["Colon: makes the laughter a cruel punchline.", 1], dash:["Dash: the laughter cuts in like an interruption.", 1],
            period:["Period: two separate beats, dream then fall.", 1], but:["Comma + “but”: spells out the reversal, less suddenly.", 1] } },
        { id:"s2", a:"Mrs. Mallard whispered one word", b:"free.",
          fx:{ comma:["Comma: grammatical, but “free” slips in without a drumroll.", 1], semicolon:["Semicolon: needs a complete sentence after it; “free” is one word.", 0],
            colon:["Colon: announces “free” like a drumroll.", 1], dash:["Dash: a sudden reveal, less formal than the colon.", 1],
            period:["Period: “Free.” becomes a fragment, dramatic but informal.", 0], but:["Comma + “but”: there’s no contrast to mark.", 0] } },
        { id:"s3", a:"Bacon divides books into three kinds", b:"some to taste, some to swallow, some to chew.",
          fx:{ comma:["Comma: the list runs on unannounced; it wants a colon.", 0], semicolon:["Semicolon: the list isn’t a complete sentence.", 0],
            colon:["Colon: announces the three kinds.", 1], dash:["Dash: introduces the list with a lurch; informal.", 1],
            period:["Period: strands the list as a fragment.", 0], but:["Comma + “but”: there’s no contrast, so it makes no sense.", 0] } }
      ]
    },
    wc:{
      intro:"Build each entry from MLA’s core elements: put the elements in template order, choose each element’s form, then set the punctuation after it.",
      template:"Author. Title of source. Title of container, Other contributors, Version, Number, Publisher, Publication date, Location.",
      cards:[
        anthCard("a", "(a) A story in the anthology", "Mansfield", "Katherine", "Miss Brill", "story", "45–52"),
        card("c", "(c) A journal article", "<p>Simrit Kaur’s article “Silence and Sound in Mansfield’s Endings”, in the journal <em>Northern Review of Fiction</em>, volume 14, number 2, 2021, pages 33–48.</p>",
          [["author", AU("Kaur", "Simrit")], ["title", TQ("Silence and Sound in Mansfield’s Endings")], ["cont", TI("Northern Review of Fiction")], ["num", ONE("vol. 14, no. 2")], ["date", ONE("2021")], ["loc", PP("33–48")]],
          ["num", "title", "loc", "cont", "author", "date"], { author:".", title:".", cont:",", num:",", date:",", loc:"." }),
        card("d", "(d) A web article with no author", "<p>An article titled “How Sonnets Turn” on the website <em>Poetry Commons</em>, posted 4 February 2023, at poetrycommons.example/sonnets-turn. No author is named.</p>",
          [["title", TQ("How Sonnets Turn")], ["cont", TI("Poetry Commons")], ["date", [{ t:"4 Feb. 2023", ok:true }, { t:"February 4, 2023", e:"datef" }]], ["loc", ONE("poetrycommons.example/sonnets-turn")]],
          ["loc", "cont", "date", "title"], { title:".", cont:",", date:",", loc:"." }),
        card("e", "(e) An edition of <em>Hamlet</em>", "<p>William Shakespeare’s play <em>Hamlet</em>, edited by Marion Lee, published by Lakeshore Press in 2020.</p>",
          [["author", AU("Shakespeare", "William")], ["title", TI("Hamlet")], ["contrib", ED("Marion Lee", true)], ["pub", ONE("Lakeshore Press")], ["date", ONE("2020")]],
          ["pub", "title", "date", "contrib", "author"], { author:".", title:".", contrib:",", pub:",", date:"." })
      ],
      list:{ start:["a", "e", "c", "b", "d"], answer:["d", "c", "a", "e", "b"] },
      fb:{ name:"Last name first: Mansfield, Katherine.", tital:"A story inside a book takes quotation marks; the book is italicized.", edcap:"Mid-entry, it’s lower case: edited by.", pg:"MLA writes pp. for a page range.", bare:"MLA writes pp. for a page range.",
        order:"Core elements order: … Publisher, Publication date, Location.", titlq:"The book is italicized; the story inside it takes quotation marks.", plain:"The book’s title needs italics.",
        general:"Put the elements in template order, choose each form, and set the punctuation: a period after the author and the title, commas inside the container, a period at the end." }
    },
    predIntro:"Make a prediction first. Then the workshop will show you what happens.",
    predictions:[
      { id:"p1", prompt:"<em>Integrate, “Ozymandias”, lines 10–11 chosen, inline.</em> What must appear where line 10 ends and line 11 begins?",
        options:[{ t:"A slash with a space on each side ( / )", ok:true }, { t:"A comma" }, { t:"Nothing; just run them together" }, { t:"A new line inside the quotation marks" }],
        explain:"Inline poetry keeps the poet’s line break visible with a spaced slash." },
      { id:"p2", prompt:"<em>Integrate, “Of Studies”.</em> Source: “Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider.” A student trims it to: Bacon tells us to read “to contradict and confute . . . and take for granted.” What has the ellipsis done?",
        options:[{ t:"Reversed Bacon’s meaning by cutting the “not”", ok:true }, { t:"Shortened it fairly" }, { t:"Added Bacon’s opinion" }, { t:"Nothing; ellipses are always fine" }],
        explain:"An ellipsis may remove words, never meaning. Here it made Bacon advise the opposite." },
      { id:"p3", prompt:"<em>Punctuation as music, sentence 1.</em> Choose a comma alone between “stage” and “the couple’s”. What happens?",
        options:[{ t:"It becomes a comma splice: two complete sentences joined by a comma", ok:true }, { t:"It’s perfect" }, { t:"It becomes a fragment" }, { t:"It changes the meaning to a question" }],
        explain:"Each half can stand alone. Use a semicolon, a period, or a comma plus “but”." },
      { id:"p4", prompt:"<em>Integrate, “Miss Brill”.</em> The quotation ends with “a play.” and the citation (Mansfield, par. 9) is placed after it. Where does the sentence’s period belong?",
        options:[{ t:"After the citation: …a play” (Mansfield, par. 9).", ok:true }, { t:"Inside the quotation marks: …a play.” (Mansfield, par. 9)" }, { t:"Both places" }, { t:"Neither" }],
        explain:"The citation belongs to your sentence, so the sentence isn’t finished until it’s cited." }
    ],
    chalIntro:"Use the workshop to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Integrate Ozymandias’s boast (lines 10–11) into a sentence that is correctly punctuated and cited. <button type=\"button\" class=\"btn ghost sm cv-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Two lines inline, one spaced slash at the break, the citation form that matches your signal phrase, the poem’s own “!” inside the quotation marks, and the period last.",
        hints:["Two lines of poetry: inline, with a slash.", "Cite lines, not pages: (lines 10–11).",
          "<span class=\"cv-lab\">signal phrase</span> Shelley’s king commands, <span class=\"cv-lab\">quotation, with a slash at the line break</span> “My name is Ozymandias, King of Kings; / Look on my Works, ye Mighty, and despair!” <span class=\"cv-lab\">citation (Shelley is named, so lines only)</span> (lines 10–11)<span class=\"cv-lab\">period last</span>."] },
      { id:"tc2", goal:2, prompt:"Build the Works Cited entry for “Miss Brill” as printed in the course anthology. <button type=\"button\" class=\"btn ghost sm cv-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"Every element in core order, each in the right form, with the right punctuation.",
        hints:["Author. Title of source. Title of container, contributors, publisher, date, location.", "The story’s title is in quotation marks and ends with a period inside them.",
          "<span class=\"cv-lab\">Author</span> Mansfield, Katherine. <span class=\"cv-lab\">Title of source</span> “Miss Brill.” <span class=\"cv-lab\">Title of container</span> " + ANTH + ", <span class=\"cv-lab\">Other contributors</span> edited by Ana Ruiz, <span class=\"cv-lab\">Publisher</span> Lakeshore Press, <span class=\"cv-lab\">Publication date</span> 2024, <span class=\"cv-lab\">Location</span> pp. 45–52."] },
      { id:"tc3", goal:3, stretch:true, prompt:"A student wrote: <em>Bacon tells readers to read “to contradict and confute . . . and take for granted” (Bacon).</em> Repair the quotation so it is shorter than the original but keeps Bacon’s meaning, and is correctly cited. Original: “Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider.” <button type=\"button\" class=\"btn ghost sm cv-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"Shorter, still honest: Bacon’s “not … nor … but” survives, and the on-screen essay is cited by author only.",
        hints:["What is Bacon actually recommending?", "Keep “not” and keep “but to weigh and consider”.",
          "Bacon urges readers to read “not to contradict and confute; nor to believe and take for granted; . . . but to weigh and consider” (Bacon)."] }
    ]
  },
  part3:{
    slug:"punctuation", name:"Meaning",
    heading:"Punctuation changes meaning",
    intro:"In Explore, conventions were signals about <em>sources</em>. Here, tap single marks on and off and watch the <strong>meaning</strong> change in the literal-reading panel. Then meet masters who break rules on purpose.",
    stations:[
      { id:"st1", label:"One mark, two meanings", intro:"Tap a gap to add or remove a comma. The literal-reading panel shows what the sentence now says.",
        sents:[
          { id:"r1", w:["The", "students", "who", "had", "read", "the", "story", "wrote", "excellent", "essays."], gaps:[1, 6], icon:"class",
            without:"only the students who read it", with:"all the students, who (by the way) had read it" },
          { id:"r2", w:["Call", "me", "Ray."], gaps:[1], icon:"ray", without:"my name is Ray", with:"Ray, phone me" },
          { id:"r3", w:["The", "judge", "said", "the", "witness", "was", "lying."], gaps:[1, 4], icon:"court", without:"the judge accused the witness", with:"the witness accused the judge" }],
        half:"One comma alone leaves the sentence lopsided: commas around extra information come in pairs." },
      { id:"st2", label:"Fix the splice", intro:"Choose how to join the two halves. Each fix is correct; each sets up a different relationship.",
        a:"Mrs. Mallard heard the news", b:"she wept at once.",
        opts:[
          { id:"period", t:"period", s:"Mrs. Mallard heard the news. She wept at once.", fx:"separate beats", note:"Two sentences, two beats: the news lands, then the tears.", ms:600 },
          { id:"semicolon", t:"semicolon", s:"Mrs. Mallard heard the news; she wept at once.", fx:"balance", note:"The semicolon holds the two actions in balance, closely related.", ms:350 },
          { id:"and", t:"comma + “and”", s:"Mrs. Mallard heard the news, and she wept at once.", fx:"sequence", note:"“And” makes it a sequence: this, then that.", ms:150 },
          { id:"when", t:"“When … ,”", s:"When Mrs. Mallard heard the news, she wept at once.", fx:"cause or time", note:"“When” ties the weeping to the moment of hearing: time, and a hint of cause.", ms:150 },
          { id:"dash", t:"dash", s:"Mrs. Mallard heard the news—she wept at once.", fx:"sudden turn", note:"The dash makes the tears arrive suddenly, as if they interrupt.", ms:250 },
          { id:"comma", t:"comma alone", s:"Mrs. Mallard heard the news, she wept at once.", fx:"comma splice", note:M4, bad:true, ms:150 }],
        twist:{ q:"Error or art?", text:"It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, …",
          cite:"Charles Dickens, <em>A Tale of Two Cities</em> (1859), opening",
          expl:"By today’s rules, Dickens’s opening is a chain of comma splices. The repeated rhythm builds a deliberate incantation of contradictions. Breaking the rule works <em>because</em> readers feel the rule." } },
      { id:"st3", label:"Where the modifier lands", intro:"Toggle each sentence and watch what it literally says.",
        pairs:[
          { id:"m1", bad:"Walking into the gym, the smell of popcorn was overwhelming.", good:"Walking into the gym, I was overwhelmed by the smell of popcorn.", icon:"gym",
            badRead:"the smell of popcorn was walking into the gym", goodRead:"I walked into the gym, and the smell overwhelmed me", badT:"Dangling", goodT:"Fixed" },
          { id:"m2", bad:"She almost failed every test.", good:"She failed almost every test.", icon:"tests",
            badRead:"she nearly failed but passed them all", goodRead:"she failed most of them", badT:"“almost failed”", goodT:"“almost every”" }],
        masters:"<p><strong>Masters’ corner.</strong> Chopin’s first sentence: “Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband’s death” (Chopin, par. 1).</p><p>By modern rules “Knowing…” dangles: “great care” doesn’t know anything. This was more accepted in 1894; today, editors would revise it.</p><p class=\"muted\">Something to think about (not scored): Does the passive, subjectless opening fit a story about a woman whose own feelings no one asks about?</p>" },
      { id:"st4", label:"Dickinson’s dashes", intro:"Toggle the dashes into commas, and listen to both. The dashes make the lines hesitate and hang.",
        dash:["Because I could not stop for Death –", "He kindly stopped for me –", "The Carriage held but just Ourselves –", "And Immortality."],
        comma:["Because I could not stop for Death,", "He kindly stopped for me,", "The Carriage held but just Ourselves,", "And Immortality."],
        cite:"Emily Dickinson, “Because I could not stop for Death” (c. 1863), stanza 1, with the dashes of her manuscript",
        note:"Dickinson’s manuscript dashes vary in length, and editors print them differently. When the poem was first printed in 1890, its editors made a similar swap: “Because I could not stop for Death, / He kindly stopped for me;”." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Punctuation changes meaning quick check",
      items:[
        { id:"q1", goal:4, prompt:"“The players, who were tired, left early.” How many players left early?",
          right:"Right. Commas make “who were tired” extra information about all the players.", wrong:"Commas make “who were tired” extra information about all the players.",
          choices:[{ t:"All of them", ok:true }, { t:"Only the tired ones" }, { t:"None" }, { t:"Can’t tell" }] },
        { id:"q2", goal:5, prompt:"Which is NOT a correct fix for “The bell rang, everyone ran”?",
          right:"Right. Adding a comma inside the second clause doesn’t fix the splice; it adds an error.", wrong:"Adding a comma inside the second clause doesn’t fix the splice; it adds an error.",
          choices:[{ t:"The bell rang, everyone, ran.", ok:true }, { t:"The bell rang; everyone ran." }, { t:"The bell rang, and everyone ran." }, { t:"When the bell rang, everyone ran." }] },
        { id:"q3", goal:5, prompt:"“Running for the bus, my backpack ripped.” What’s wrong?",
          right:"Right. Put the runner right after the phrase: “Running for the bus, I ripped my backpack.”", wrong:"Put the runner right after the phrase: “Running for the bus, I ripped my backpack.”",
          choices:[{ t:"The backpack seems to be running", ok:true }, { t:"Nothing" }, { t:"A comma splice" }, { t:"A missing colon" }] },
        { id:"q4", goal:5, prompt:"Why are Dickens’s comma splices not errors in his novel?",
          right:"Right. A deliberate break with a clear effect is a choice. Know the rule to break it well.", wrong:"A deliberate break with a clear effect is a choice. Know the rule to break it well.",
          choices:[{ t:"They create a deliberate, rhythmic effect readers can feel", ok:true }, { t:"Rules didn’t exist in 1859" }, { t:"Novels have no rules" }, { t:"They are errors" }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"steal-line\">“It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness…”</p><p class=\"eng-cite\">Charles Dickens, <em>A Tale of Two Cities</em> (1859), opening clauses</p><p><strong>The shape:</strong> anaphora (“it was the…”) plus antithesis in pairs (best/worst, wisdom/foolishness), joined by commas into a rolling chant. By today’s rules these are comma splices; Dickens uses them for momentum.</p><p><strong>The challenge:</strong> Write at least four clauses in this pattern about your school year, a place or a season. Then say in one sentence why the splices work here, and why you wouldn’t use them in an essay’s analysis.</p><p><strong>Model imitation (original):</strong> “It was the loudest of hallways, it was the quietest of libraries, it was the week of exams, it was the week of snow days…”</p>",
      prompt:"Your imitation (at least four “it was the…” clauses):" }],
    reasonLabel:"Why the splices work here, and why you wouldn’t use them in an essay’s analysis (one sentence):",
    stealChecks:["At least four clauses that begin “it was the”, separated by commas", "Your reason has at least 12 words"]
  },
  practice:{
    activities:[
      { id:"fix", type:"mc", title:"Fix the citation", summary:"Fix the citation", goal:[1, 2],
        instruction:"Each item names a source and a quotation. Choose the correct MLA 9 citation.", how:"Choose a citation, then press Check.",
        h1:"What kind of source is it: prose, poetry, drama or web? Is the author already named?",
        items:[
          { id:"f1", err:"Page citation form", prompt:"Chopin quoted from the printed anthology, page 42; author not named in your sentence.",
            options:[{ t:"(Chopin 42)", ok:true, why:"Author and page number, with nothing between them." }, { t:"(Chopin, pg. 42)", why:"No comma, no “pg.”." },
              { t:"(Chopin, 42)", why:M2 }, { t:"(42)", why:"Your sentence doesn’t name Chopin, so the citation must." }],
            hints:["", "Printed prose: (Author page), with no comma and no “p.” or “pg.”.", "(Chopin 42): author and page, because the sentence doesn’t name her."] },
          { id:"f2", err:"Author named twice", prompt:"The same quotation, but your sentence already says “Chopin writes”.",
            options:[{ t:"(42)", ok:true, why:"Chopin is already named, so the page is enough." }, { t:"(Chopin 42)", why:"When the author is named in the signal phrase, cite just the page." },
              { t:"(p. 42)", why:M2 }, { t:"(Chopin, 42)", why:"No comma, and Chopin is already named in your sentence." }],
            hints:["", "Printed prose with the author named in your sentence: (page).", "(42): the signal phrase already names Chopin."] },
          { id:"f3", err:"Paragraph citation", prompt:"Mansfield from the on-screen text, paragraph 18.",
            options:[{ t:"(Mansfield, par. 18)", ok:true, why:"On-screen numbered paragraphs: author, comma, “par.”, number." }, { t:"(Mansfield 18)", why:"On-screen paragraphs aren’t pages. Write “par.” after a comma." },
              { t:"(Mansfield, paragraph 18)", why:"MLA abbreviates it: par." }, { t:"(Mansfield, pg. 18)", why:"There are no pages on screen, and MLA never writes “pg.”." }],
            hints:["", "On-screen prose with numbered paragraphs: (Author, par. n).", "(Mansfield, par. 18): the on-screen text numbers its paragraphs, not pages."] },
          { id:"f4", err:"Poetry citation", prompt:"Shelley, lines 2–3, first citation, author not named.",
            options:[{ t:"(Shelley, lines 2–3)", ok:true, why:"Author, comma, then “lines” the first time." }, { t:"(Shelley 2–3)", why:"Poetry cites lines, labelled the first time." },
              { t:"(Shelley, pg. 2–3)", why:"Poems are cited by line, not page." }, { t:"(lines Shelley 2–3)", why:"Author first." }],
            hints:["", "Poetry, first citation: (Author, lines n–m).", "(Shelley, lines 2–3): the first poetry citation labels the lines."] },
          { id:"f5", err:"Repeat poetry citation", prompt:"Shelley again later in the same essay, line 12.",
            options:[{ t:"(12)", ok:true, why:"After the first poetry citation, the number alone is enough." }, { t:"(Shelley, lines 12)", why:"After the first poetry citation, just the number. And “line” is singular anyway." },
              { t:"(Shelley 12)", why:"Without “lines”, a number after an author reads as a page." }, { t:"(line twelve)", why:"Use numerals; and later citations drop the label." }],
            hints:["", "Poetry, later citations: just the line number.", "(12): the reader already knows these are Shelley’s lines."] },
          { id:"f6", err:"Drama citation", prompt:"<em>Hamlet</em>, Act 3, Scene 1, lines 56–60, title not named.",
            options:[{ t:"(<em>Hamlet</em> 3.1.56–60)", ok:true, why:"Italicized title, then act.scene.line with periods." }, { t:"(Act 3, Scene 1, lines 56–60)", why:"MLA uses periods: act.scene.line, after the italicized title (or MLA’s abbreviation, <em>Ham.</em>)." },
              { t:"(Shakespeare 56–60)", why:"Plays in verse are cited by act, scene and line, with the title." }, { t:"(<em>Hamlet</em>, pg. 3.1.56)", why:"No “pg.”, and no comma." }],
            hints:["", "Verse drama: (<em>Title</em> act.scene.line).", "(<em>Hamlet</em> 3.1.56–60): act 3, scene 1, lines 56–60."] },
          { id:"f7", err:"Source with no author", prompt:"A web article with no author, titled “How Sonnets Turn”.",
            options:[{ t:"(“How Sonnets Turn”)", ok:true, why:"With no author, the title (shortened if long) takes the author’s place." }, { t:"(Poetry Commons)", why:"With no author, use the title (shortened if long) in quotation marks." },
              { t:"(Anonymous)", why:"MLA uses the title." }, { t:"(poetrycommons.example)", why:"Not the URL." }],
            hints:["", "Web, no author: (“Title”), shortened if long.", "(“How Sonnets Turn”): the title stands in for the missing author."] },
          { id:"f8", err:"Block quotation period", prompt:"A 6-line prose block quotation from Chopin, page 42.",
            options:[{ t:". . . end of the quotation. (Chopin 42)", ok:true, why:"Right: in a block quotation the period comes <strong>before</strong> the citation. This is the one exception; every inline quotation still puts the period last." },
              { t:". . . end of the quotation (Chopin 42).", why:"In block quotations, the period comes <strong>before</strong> the citation, the reverse of inline quotations." },
              { t:". . . end of the quotation.” (Chopin 42)", why:"Block quotations drop the quotation marks: the indent already says “quoted”." }, { t:". . . end of the quotation. (Chopin, pg. 42)", why:"No comma, no “pg.”." }],
            hints:["", "Block quotation: indented, no quotation marks, the period, then the citation.", "The quotation’s final period, then (Chopin 42): block quotations reverse the inline order."] }
        ] },
      { id:"proof", type:"custom", title:"The editor’s proofread", summary:"Editor’s proofread", star:true, goal:[4, 5, 6],
        instruction:"This paragraph (original student writing about “The Story of an Hour”) has <strong>eight errors</strong>. It also has <strong>three spots that look suspicious but are correct or deliberate</strong>. Tap a spot to mark it, then choose: fix it (and pick the fix), or leave it.",
        how:"Tap an underlined spot, then choose “Leave it” or a fix. Read each sentence aloud in your head first.",
        h1:"Read the sentence aloud. Does anything snag?",
        para:[
          "Chopin’s story moves in a single ",
          { id:"x1", goal:5, t:"hour, it moves", answer:[0, 1, 2], err:"Comma splice", leaveFb:M4, h2:"Error family: sentence boundaries (a comma splice).",
            menu:[{ t:"hour; it moves" }, { t:"hour, moving" }, { t:"hour. It moves" }, { t:"hour it moves", why:"Now it’s a run-on: no mark at all between two complete sentences." }] },
          " from grief to secret joy. ",
          { id:"x2", goal:5, t:"Sitting alone in her room, the open window shows Mrs. Mallard trees", answer:[0], err:"Dangling modifier", leaveFb:"Who is sitting? Not the window.", h2:"Error family: a dangling modifier. Who is doing the sitting?",
            menu:[{ t:"Sitting alone in her room, Mrs. Mallard sees through the open window trees" }, { t:"Sitting alone in her room; the open window shows Mrs. Mallard trees", why:"A semicolon can’t attach a phrase, and the window still seems to sit." }, { t:"The open window, sitting alone in her room, shows Mrs. Mallard trees", why:"Now the window is plainly the one sitting." }] },
          " “all aquiver with the new spring ",
          { id:"x3", goal:1, t:"life.” (Chopin, par. 5)", answer:[0], err:"Period before citation", leaveFb:M1, h2:"Error family: quotation punctuation. Where does the sentence end?",
            menu:[{ t:"life” (Chopin, par. 5)." }, { t:"life.” (Chopin 5)", why:"Still the period-first error, and on-screen paragraphs need “par.”." }, { t:"life” (Chopin, par. 5)", why:"Now the sentence has no period at all. Put it after the citation." }] },
          " The details of the scene, even the ",
          { id:"x5", goal:6, t:"col&#111;r", answer:[0], err:"Spelling", leaveFb:"This is American spelling. Canadian: colour.", h2:"Error family: spelling. Check <em>-our</em>/<em>-or</em>.",
            menu:[{ t:"colour" }, { t:"colours", why:"The clouds share one colour here; keep it singular, just spelled the Canadian way." }] },
          " of the clouds, ",
          { id:"x4", goal:5, t:"is full", answer:[0], err:"Subject–verb agreement", leaveFb:"Find the subject: “the details”, which is plural. The details … are.", h2:"Error family: agreement. What is the verb’s real subject?",
            menu:[{ t:"are full" }, { t:"was full", why:"Still singular. The subject is “details”." }] },
          " of renewal. She whispers one word over and over",
          { id:"l1", goal:4, t:":", answer:"leave", err:"Over-correcting", fixFb:"This colon is correct and deliberate: it announces the word. Leave it.", h2:"This spot is correct.",
            menu:[{ t:";", why:"A semicolon needs a complete sentence after it." }, { t:",", why:"Grammatical, but it loses the drumroll." }] },
          " free. The narrator never explains the change or ",
          { id:"x6", goal:6, t:"it’s", answer:[0], err:"Homophones (its/it’s)", leaveFb:"Try “it is effect”. It doesn’t work, so it’s the possessive: its.", h2:"Error family: homophones. Can you say “it is” here?",
            menu:[{ t:"its" }, { t:"its’", why:"“Its’” isn’t a word. The possessive is “its”." }] },
          " effect on her heart, ",
          { id:"x7", goal:5, t:"and they leave", answer:[0], err:"Pronoun agreement", leaveFb:"“The narrator” is singular, so the pronoun must be too.", h2:"Error family: pronoun–antecedent agreement. Who is “they”?",
            menu:[{ t:"and leaves" }, { t:"and they leaves", why:"A singular verb with a plural pronoun mixes the two. Drop the pronoun: “and leaves”." }] },
          " the reader to infer it. Her family misreads her completely",
          { id:"l2", goal:4, t:";", answer:"leave", err:"Over-correcting", fixFb:"This semicolon correctly joins two closely related clauses. Leave it.", h2:"This spot is correct.",
            menu:[{ t:",", why:"A comma here would make a comma splice." }, { t:":", why:"The second half doesn’t explain the first; it sets the reader against the family. A semicolon balances them." }] },
          " the reader knows better. The irony is total. ",
          { id:"x8", goal:1, t:"“Free! Body and soul free!”", answer:[0], err:"Uncited quotation", leaveFb:"Every quotation needs a citation.", h2:"Error family: citation. Where does this come from?",
            menu:[{ t:"“Free! Body and soul free!” (Chopin, par. 16)." }, { t:"“Free! Body and soul free!” (Chopin 16).", why:"On-screen paragraphs need “par.”: (Chopin, par. 16)." }] },
          " ",
          { id:"l3", goal:5, t:"A cry she never gets to live.", answer:"leave", err:"Over-correcting", fixFb:"This fragment is a deliberate, emphatic choice. In a conclusion, used once, it’s style, not error. (Some teachers ask for full sentences in formal essays; follow your teacher’s guidance.)", h2:"This spot is a deliberate choice.",
            menu:[{ t:"It is a cry she never gets to live.", why:"Grammatically complete, but flatter. The fragment is a deliberate choice." }] }
        ],
        done:"8 fixed, 3 wisely left alone." },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Hollis", goal:[1, 3, 5], how:"",
        instruction:"Hollis made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, err:"Period before citation", task:"a paragraph on “Miss Brill”.",
            steps:["Mansfield builds Miss Brill’s happiness on an illusion.", "Watching the crowd, Miss Brill decides the scene is “exactly like a play.” (Mansfield, par. 9)", "The metaphor gives her a role among strangers.", "When the couple mock her, the play’s audience turns on its actor."],
            answer:1, stepFb:["Sentence 1 is a clear claim.", "", "Sentence 3 follows from sentence 2. Look earlier.", "Sentence 4 follows from sentence 2. Look earlier."],
            fixes:[{ t:"“…‘exactly like a play’ (Mansfield, par. 9).” The period moves after the citation.", ok:true, why:"The sentence isn’t finished until it’s cited." },
              { t:"“…‘exactly like a play.’ (Mansfield 9).”", why:"Still the period-first error, and on-screen paragraphs need “par.”." },
              { t:"Remove the citation.", why:"Every quotation needs one." }, { t:"Sentence 2 is correct.", why:"The sentence ends after the citation, so the period moves outside." }],
            hints:["Check the punctuation around the citation.", "Where’s the period?", "Sentence 2. Move the period after the parenthesis."] },
          { id:"e2", goal:3, err:"Poetry line breaks", task:"a paragraph on “Ozymandias”.",
            steps:["Shelley lets the statue’s own words condemn it.", "The inscription commands, “Look on my Works, ye Mighty, and despair!” (Shelley, line 11).", "The next line answers it: “Nothing beside remains. Round the decay” (lines 12–13).", "The boast survives only as a joke against the boaster."],
            answer:2, stepFb:["Sentence 1 is the claim.", "Sentence 2 is cited correctly; the exclamation mark belongs to the quotation.", "", "Sentence 4 follows from sentence 3. Look earlier."],
            fixes:[{ t:"“…‘Nothing beside remains. / Round the decay’ (lines 12–13).” A slash marks the line break.", ok:true, why:"Two lines quoted inline need one slash where the line breaks." },
              { t:"Put lines 12–13 in a block quotation.", why:"Two lines fit inline; block format is for more than three." },
              { t:"Change the citation to (Shelley 12–13).", why:"Poetry citations name lines; and the problem is the missing slash." }, { t:"Sentence 3 is correct.", why:"Two lines of poetry are quoted without showing the break." }],
            hints:["How many lines does sentence 3 quote?", "Two, so the reader needs to see where one ends.", "Sentence 3. Add “ / ” at the line break."] },
          { id:"e3", goal:5, err:"Dangling modifier", task:"a paragraph on “The Story of an Hour”.",
            steps:["Chopin’s story turns on a final, bitter irony.", "Believing she has died of happiness, the doctors’ diagnosis is “the joy that kills” (Chopin, par. 23).", "The reader, however, knows the opposite.", "Her heart fails at the loss of freedom, not at the sight of her husband."],
            answer:1, stepFb:["Sentence 1 is the claim.", "", "Sentence 3 follows from sentence 2. Look earlier.", "Sentence 4 follows from sentence 2. Look earlier."],
            fixes:[{ t:"“Believing she has died of happiness, the doctors diagnose ‘the joy that kills’ (Chopin, par. 23).”", ok:true, why:"Now the doctors are the ones believing." },
              { t:"“Believing she has died of happiness; the doctors’ diagnosis…”", why:"A semicolon can’t attach a phrase." },
              { t:"Remove the quotation.", why:"The quotation is the key evidence." }, { t:"Sentence 2 is correct.", why:"The opening phrase describes “the diagnosis”, which can’t believe anything." }],
            hints:["Who is “believing”?", "The word right after the comma should be the believer.", "Sentence 2. Make “the doctors” the subject."] }
        ] }
    ]
  },
  reflect:{
    blocks:[
      { title:"Errors I make", html:"<p class=\"muted\">Every Practice item you missed added its error type here (private, on this device). The list is ranked by count, with a proofreading strategy for each.</p><div id=\"cv-errs\"></div>" },
      { title:"Commonplace book", html:"<p>Save one sentence from today whose punctuation you’d like to remember (Austen’s commas, Dickinson’s dashes, Bacon’s semicolons) and note what the punctuation does.</p><div id=\"cp-app\"></div>" }
    ],
    errFamilies:{
      "Comma splices":"Find every comma and test whether both sides are complete sentences.",
      "Citations":"Do a separate pass that checks only citations.",
      "Spelling and homophones":"Read backwards, word by word.",
      "Missing words":"Read aloud, slowly.",
      "Modifiers":"Find each opening phrase and check that the word right after the comma is the one doing it.",
      "Agreement":"Read aloud, slowly, pointing from each verb and pronoun to the word it agrees with.",
      "Over-correcting":"Before you change a mark, name the rule it breaks. If you can’t, it may be a deliberate choice."
    },
    errMap:{ "Comma splice":"Comma splices", "Period before citation":"Citations", "Page citation form":"Citations", "Author named twice":"Citations", "Paragraph citation":"Citations", "Poetry citation":"Citations",
      "Repeat poetry citation":"Citations", "Drama citation":"Citations", "Source with no author":"Citations", "Block quotation period":"Citations", "Uncited quotation":"Citations", "Poetry line breaks":"Citations",
      "Spelling":"Spelling and homophones", "Homophones (its/it’s)":"Spelling and homophones", "Dangling modifier":"Modifiers", "Subject–verb agreement":"Agreement", "Pronoun agreement":"Agreement", "Over-correcting":"Over-correcting" },
    journal:[
      { id:"j1", q:"Which punctuation toggle changed meaning most surprisingly for you? Why?" },
      { id:"j2", q:"In your own words, explain why the period goes after an MLA citation in a normal quotation, but before it in a block quotation." },
      { id:"j3", q:"Explain to a friend the difference between a deliberate rule-break (Dickens, Dickinson) and an error, using an example." },
      { id:"j4", q:"Look at your “Errors I make” list. Which error is most common for you, and which proofreading strategy will you use against it?" }
    ],
    art:{
      intro:"Write one principle about punctuation, grammar or honest quotation in your own words. Choose a master’s example (Austen, Dickens, Dickinson, Shelley or Bacon) and write your own imitation.",
      placeholder:"Your principle about punctuation, grammar or honest quotation (at least 6 words)",
      examples:["It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. (Austen)",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness… (Dickens)",
        "Because I could not stop for Death – / He kindly stopped for me – (Dickinson, lines 1–2)",
        "Look on my Works, ye Mighty, and despair! / Nothing beside remains. (Shelley, lines 11–12)",
        "Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider. (Bacon)"]
    },
    artSamples:"<details class=\"alg art-samples\"><summary>Two sample principles (examples only; write your own)</summary><p class=\"an-note an-syntax\">“Use a colon when you want the reader to lean forward.” <span class=\"muted\">Example: “Mrs. Mallard whispered one word: free.”</span></p><p class=\"an-note an-sound\">“Break a rule only when the reader can feel why.” <span class=\"muted\">Example: Dickens, “It was the best of times, it was the worst of times…”</span></p></details>",
    commonplaceLines:["It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. (Austen)",
      "Because I could not stop for Death – / He kindly stopped for me – (Dickinson)", "Reading maketh a full man; conference a ready man; and writing an exact man. (Bacon)",
      "It was the best of times, it was the worst of times… (Dickens)"],
    cpNote:"What the punctuation does"
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"You quote Chopin from a printed book, page 42, without naming her in your sentence. Which citation is correct?", options:[
          { t:"(Chopin 42)", ok:true, why:"Author and page, with nothing between them." }, { t:"(Chopin, 42)", why:"No comma between author and page." },
          { t:"(Chopin, pg. 42)", why:"No “pg.”." }, { t:"(pg. 42, Chopin)", why:"Author first, then the number." }] },
        b:{ prompt:"You quote lines 2–3 of “Ozymandias” for the first time without naming Shelley. Which citation is correct?", options:[
          { t:"(Shelley, lines 2–3)", ok:true, why:"Author, comma, and “lines” the first time." }, { t:"(Shelley 2–3)", why:"Poetry cites lines, labelled the first time." },
          { t:"(Shelley, pg. 2–3)", why:"Poems are cited by line, not page." }, { t:"(lines Shelley 2–3)", why:"Author first." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which Works Cited entry follows MLA 9?", options:[
          { t:"Kaur, Simrit. “Silence and Sound in Mansfield’s Endings.” <em>Northern Review of Fiction</em>, vol. 14, no. 2, 2021, pp. 33–48.", ok:true, why:"Core elements in order, with the article in quotation marks and the journal in italics." },
          { t:"Simrit Kaur. “Silence and Sound in Mansfield’s Endings.” <em>Northern Review of Fiction</em>, vol. 14, no. 2, 2021, pp. 33–48.", why:"Last name first." },
          { t:"Kaur, Simrit. <em>Silence and Sound in Mansfield’s Endings</em>. “Northern Review of Fiction,” vol. 14, no. 2, 2021, pp. 33–48.", why:"Article in quotation marks; journal in italics." },
          { t:"Kaur, Simrit. “Silence and Sound in Mansfield’s Endings.” <em>Northern Review of Fiction</em>, 2021, vol. 14, no. 2, pp. 33–48.", why:"Volume and number come before the date." }] },
        b:{ prompt:"Which Works Cited entry follows MLA 9 for a web article with no author?", options:[
          { t:"“How Sonnets Turn.” <em>Poetry Commons</em>, 4 Feb. 2023, poetrycommons.example/sonnets-turn.", ok:true, why:"With no author, the entry starts with the title." },
          { t:"Anonymous. “How Sonnets Turn.” <em>Poetry Commons</em>, 4 Feb. 2023, poetrycommons.example/sonnets-turn.", why:"MLA skips the author rather than writing “Anonymous”." },
          { t:"<em>How Sonnets Turn</em>. “Poetry Commons,” 4 Feb. 2023, poetrycommons.example/sonnets-turn.", why:"Article in quotation marks; site in italics." },
          { t:"“How Sonnets Turn.” <em>Poetry Commons</em>, poetrycommons.example/sonnets-turn, 4 Feb. 2023.", why:"The date comes before the location (URL)." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which mark introduces a list, an explanation or a punchline after a complete sentence?", options:[
          { t:"A colon", ok:true, why:"A colon announces what follows." }, { t:"A semicolon", why:"Semicolons join two complete sentences." },
          { t:"A comma", why:"Too weak to announce." }, { t:"An apostrophe", why:"Marks possession or contraction." }] },
        b:{ prompt:"Which mark can join two closely related complete sentences without a joining word?", options:[
          { t:"A semicolon", ok:true, why:"It balances two complete, closely related sentences." }, { t:"A comma", why:"That’s a comma splice." },
          { t:"A colon", why:"Possible when the second explains the first, but the general joiner is the semicolon." }, { t:"An apostrophe", why:"Not a joiner." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Original (Bacon): “Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider.” Which shortened quotation is honest?", options:[
          { t:"Bacon advises reading “not to contradict and confute; . . . but to weigh and consider” (Bacon).", ok:true, why:"Shorter, and the “not … but” logic survives." },
          { t:"Bacon advises reading “to contradict and confute . . . and take for granted” (Bacon).", why:"It reverses his meaning." },
          { t:"Bacon advises reading “[only] to find talk and discourse” (Bacon).", why:"The brackets twist it." },
          { t:"Bacon advises reading “to weigh and consider.” (Bacon)", why:"Honest wording, but the period comes before the citation." }] },
        b:{ prompt:"Original (Chopin, describing Mrs. Mallard): “She did not hear the story as many women have heard the same, with a paralyzed inability to accept its significance.” A student needs “she” to be clear. Which version uses brackets correctly?", options:[
          { t:"“[Mrs. Mallard] did not hear the story as many women have heard the same” (Chopin, par. 3).", ok:true, why:"The bracket replaces “she” and clarifies without changing the meaning." },
          { t:"“Mrs. Mallard did not hear the story as many women have heard the same” (Chopin, par. 3).", why:"A change to the quoted words must be bracketed." },
          { t:"“[Mrs. Mallard] did [happily] hear the story” (Chopin, par. 3).", why:"Brackets can’t add a meaning the source lacks." },
          { t:"“She did not hear the story” [Mrs. Mallard] (Chopin, par. 3).", why:"The bracket goes in place of the word it clarifies." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Which sentence contains a dangling modifier?", options:[
          { t:"Turning the last page, the ending surprised me.", ok:true, why:"The ending didn’t turn the page." },
          { t:"Turning the last page, I was surprised by the ending.", why:"Correct: “I” turned the page." },
          { t:"The ending surprised me as I turned the last page.", why:"Correct." },
          { t:"When I turned the last page, the ending surprised me.", why:"Correct: a full clause." }] },
        b:{ prompt:"Which revision fixes the comma splice <em>and</em> shows that the second idea is a result of the first? “The couple laughed at her fur, Miss Brill went home in silence.”", options:[
          { t:"“Because the couple laughed at her fur, Miss Brill went home in silence.”", ok:true, why:"“Because” fixes the splice and names the cause." },
          { t:"“The couple laughed at her fur, Miss Brill, went home in silence.”", why:"Still spliced, with a new error." },
          { t:"“The couple laughed at her fur; Miss Brill went home in silence.”", why:"Fixes the splice, but doesn’t show the cause." },
          { t:"“The couple laughed at her fur Miss Brill went home in silence.”", why:"A run-on." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"“The students, who had read the story, wrote excellent essays.” What do the commas tell us?", options:[
          { t:"All the students had read the story; the clause adds information about all of them", ok:true, why:"Commas mark “who had read the story” as extra information about every student." },
          { t:"Only some students had read the story.", why:"That’s the version without commas." },
          { t:"The students wrote the story.", why:"Nothing says so." },
          { t:"Nothing; the commas are optional decoration.", why:"Commas here change the meaning." }] },
        b:{ prompt:"Compare “She answered only the first question” with “She only answered the first question.” Which most clearly means she answered no other questions?", options:[
          { t:"“She answered only the first question.”", ok:true, why:"“Only” sits right before what it limits." },
          { t:"“She only answered the first question.”", why:"Ambiguous: it could mean she <em>only answered</em> (didn’t explain)." },
          { t:"Both mean exactly the same.", why:"Placement changes what “only” limits." },
          { t:"Neither.", why:"The first is clear." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"You need to quote six lines of prose from Chopin (printed anthology, page 42). How should it appear?", options:[
          { t:"As an indented block, without quotation marks, with the citation after the final period: … . (Chopin 42)", ok:true, why:"More than four lines of prose make a block: indented, no quotation marks, period then citation." },
          { t:"Inline, in quotation marks, with (Chopin 42) and then a period.", why:"More than four lines of prose call for a block." },
          { t:"As an indented block in quotation marks.", why:"The indent replaces the quotation marks." },
          { t:"Paraphrased, with no citation.", why:"Paraphrase still needs a citation." }] },
        b:{ prompt:"You quote lines 1–2 of Dickinson’s poem inline. How should the line break appear?", options:[
          { t:"“Because I could not stop for Death – / He kindly stopped for me –” (Dickinson, lines 1–2)", ok:true, why:"A spaced slash shows the line break; her dashes stay, because they’re hers." },
          { t:"“Because I could not stop for Death – He kindly stopped for me –” (Dickinson, lines 1–2)", why:"Show the break with a slash." },
          { t:"“Because I could not stop for Death –, He kindly stopped for me –” (lines 1–2)", why:"Use a spaced slash, not a comma." },
          { t:"As a block quotation.", why:"Two lines fit inline." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which proofreading strategy is best for catching <strong>spelling</strong> errors your eyes skip over?", options:[
          { t:"Read the paragraph backwards, word by word", ok:true, why:"It breaks the sense, so you see each word." },
          { t:"Read it quickly once.", why:"Speed hides errors." },
          { t:"Check only the first sentence.", why:"Errors hide everywhere." },
          { t:"Ask a spell-checker and trust it fully.", why:"It misses homophones (its/it’s)." }] },
        b:{ prompt:"Which proofreading strategy is best for catching <strong>missing words</strong> and awkward rhythm?", options:[
          { t:"Read it aloud slowly", ok:true, why:"Your ear hears gaps your eye fills in." },
          { t:"Read it backwards.", why:"Good for spelling, not for flow." },
          { t:"Change the font.", why:"May help a little, but reading aloud targets this." },
          { t:"Count the words.", why:"Doesn’t reveal gaps." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"You quote Hamlet, Act 1, Scene 2, lines 129–130, without naming the play in your sentence. Which citation is correct?", options:[
          { t:"(<em>Hamlet</em> 1.2.129–130)", ok:true, why:"Italicized title, then act.scene.line." },
          { t:"(Hamlet, Act 1, Scene 2, 129–130)", why:"MLA uses act.scene.line with periods." },
          { t:"(Shakespeare 129–130)", why:"Plays in verse are cited by act, scene and line, with the title." },
          { t:"(<em>Hamlet</em>, pg. 1.2.129)", why:"No “pg.”." }] },
        b:{ prompt:"Your source is a website article with no author, titled “Reading the Ghost in <em>Hamlet</em>”. Which in-text citation fits?", options:[
          { t:"(“Reading the Ghost”)", ok:true, why:"With no author, use a shortened title." },
          { t:"(Anonymous)", why:"MLA uses the title." },
          { t:"(Website)", why:"Too vague." },
          { t:"(www.example)", why:"Not the URL." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"You’re emailing a university admissions office. Which sentence is ready to send?", options:[
          { t:"“I’m writing to ask whether my portfolio may include a short film; its running time is four minutes.”", ok:true, why:"Formal, correctly joined with a semicolon, and “its” is the possessive." },
          { t:"“im writing to ask if my portfolio can include a short film its four minutes”", why:"Missing capitals, an apostrophe and a boundary." },
          { t:"“I’m writing to ask whether my portfolio may include a short film, it’s running time is four minutes.”", why:"A comma splice, and “it’s” should be “its”." },
          { t:"“Writing to ask, may my portfolio include a short film?: four minutes.”", why:"Garbled punctuation." }] },
        b:{ prompt:"Which statement about conventions across contexts is most accurate?", options:[
          { t:"A text message to a friend can drop capitals and periods, but an essay or application follows formal conventions, because the audience and stakes differ", ok:true, why:"Register changes with audience and purpose." },
          { t:"Conventions are the same in every context.", why:"Register changes with audience." },
          { t:"Formal conventions are never needed anymore.", why:"Admissions readers and teachers rely on them." },
          { t:"Only spelling matters in formal writing.", why:"Punctuation and grammar carry meaning too." }] } }
    ]
  },
  task:{
    title:"The editor’s desk", summary:"The editor’s desk",
    statement:"<p>Write and polish one analytical paragraph about a public-domain text from this unit, so that its quotations, punctuation and citation are all exactly right. The checklist tests the conventions precisely; your teacher reads the thinking.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class=\"alg\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Category</th><th scope=\"col\">Level 1</th><th scope=\"col\">Level 2</th><th scope=\"col\">Level 3</th><th scope=\"col\">Level 4</th></tr></thead><tbody><tr><td>Knowledge (conventions and MLA)</td><td>Frequent errors obscure meaning</td><td>Several errors; citations inconsistent</td><td>Few errors; citations correct</td><td>Virtually error-free; citations precise</td></tr><tr><td>Thinking (honest integration)</td><td>Quotations dropped or distorted</td><td>Integrated mechanically</td><td>Integrated smoothly and accurately</td><td>Integrated elegantly; trims sharpen the point</td></tr><tr><td>Communication (punctuation for effect)</td><td>Punctuation confuses</td><td>Correct but flat</td><td>Correct, with some purposeful choices</td><td>Punctuation shapes rhythm and emphasis deliberately</td></tr><tr><td>Application (proofreading and revision)</td><td>Little evidence of proofreading</td><td>Some errors remain</td><td>Careful proofreading</td><td>Meticulous; the craft statement shows insight into the writer’s own error patterns</td></tr></tbody></table></div></details>",
    checks:["Your paragraph is the right length", "Every quotation is cited, MLA style", "Periods sit after citations", "You trimmed or clarified honestly", "Poetry shows its line breaks (“Ozymandias” only)",
      "You used a mark on purpose", "Your Works Cited entry is exact", "You proofread three ways", "You explained your choices"],
    tips:["One full paragraph: claim, evidence, analysis, link. 100–180 words.",
      "Every borrowed phrase needs a citation right after it: (Chopin 42), (Mansfield, par. 9), (lines 10–11), or (Bacon).",
      "Close the quotation, add the citation, <em>then</em> the period.",
      "Shorten a quotation with “ . . . ” or clarify a word with [brackets], and make sure the meaning stays true.",
      "Show each line break in a poetry quotation with a spaced slash ( / ).",
      "Choose a semicolon, colon or dash you used deliberately, and say what it does.",
      "Author. “Title.” <em>Container</em>, edited by Name, Publisher, Year, pp. x–y.",
      "Three passes, three kinds of error. Tick each when it’s done.",
      "Which convention choice are you proudest of, and why?"],
    explainPrompt:"Craft statement: Which convention choice (a citation, an ellipsis, a bracket, a semicolon, colon or dash) are you proudest of, and what does it do for your reader?",
    explainLabel:"Craft statement",
    vocab:"Use the words citation, integrate, ellipsis or brackets, and the name of your mark.",
    checkLabel:"Check my paragraph",
    success:"Clean copy. Every signal is where your reader expects it. Try the same paragraph citing the other context (anthology vs on-screen) and notice what changes.",
    more:"Each text and citation context is a different answer.",
    texts:[{ id:"hour", t:"“The Story of an Hour”", author:"Chopin", first:"Kate", title:"The Story of an Hour", kind:"story", pages:"41–43" },
      { id:"oz", t:"“Ozymandias”", author:"Shelley", first:"Percy Bysshe", title:"Ozymandias", kind:"poem", pages:"112" },
      { id:"brill", t:"“Miss Brill”", author:"Mansfield", first:"Katherine", title:"Miss Brill", kind:"story", pages:"45–52" },
      { id:"bacon", t:"“Of Studies”", author:"Bacon", first:"Francis", title:"Of Studies", kind:"essay", pages:"15–16" }],
    contexts:[{ id:"screen", t:"On-screen text (paragraph or line numbers)" }, { id:"anth", t:"Printed course anthology (page numbers)" }],
    // the eight Works Cited cards are derived in app.js from two templates with the same key: explore.wc.cards[0] (anthology,
    // Mansfield) and this on-screen card (Chopin), by swapping the author, title, kind and pages
    screen:screenCard("hour-screen", "On screen", "Chopin", "Kate", "The Story of an Hour"),
    passes:["Read it aloud", "Read it backwards for spelling", "Check every citation"],
    hyphen:"MLA uses an en dash (–) in ranges; a hyphen is accepted here.",
    models:[
      { title:"Model 1: “Ozymandias” (anthology context; poetry is cited by line in either context)",
        para:"Shelley lets a dead king testify against himself. The pedestal still proclaims, “My name is Ozymandias, King of Kings; / Look on my Works, ye Mighty, and despair!” (Shelley, lines 10–11). Yet the very next words answer with a flat, devastating fact: “Nothing beside remains. Round the decay / Of that colossal Wreck . . .” (12–13). The boast and the reply sit side by side; Shelley needs no comment of his own to judge the king. The despair that Ozymandias demanded from rival rulers now belongs to him, and the only works that survive are the sculptor’s record of his arrogance and the poem that preserves it. Power, the sonnet suggests, lasts exactly as long as the stone, and stone is patient.",
        mark:"The semicolon after “side by side”: “It balances the two halves of the poem’s argument, boast and ruin, with equal weight.”", wc:"oz-anth",
        craft:"I quoted two pairs of lines and marked each line break with a slash. I trimmed the end of line 13 with an ellipsis because “boundless and bare” belongs to the next idea. The semicolon lets the boast and the ruin sit side by side, the way Shelley sets them." },
      { title:"Model 2: “Of Studies” (on-screen context)",
        para:"Bacon’s essay is less about <em>what</em> to read than <em>how</em>. He tells his reader to “[r]ead not to contradict and confute; nor to believe and take for granted; . . . but to weigh and consider” (Bacon). The semicolons keep each wrong motive separate, so that each is weighed and set aside before the right one arrives. His famous sorting of books follows the same logic: “Some books are to be tasted, others to be swallowed, and some few to be chewed and digested” (Bacon). The metaphor of eating turns reading into a matter of appetite; a good reader adjusts the bite to the book. Bacon’s balanced clauses perform the judgment he recommends, which is why his advice still sounds less like a rule than a habit worth acquiring.",
        mark:"The colon after “the same logic”: “It announces the example that proves the claim.”", wc:"bacon-screen",
        craft:"I lower-cased “Read” in brackets so the quotation fits my sentence, and cut one clause with an ellipsis without changing Bacon’s meaning, because the “not … nor … but” structure stays intact. The on-screen essay is a single paragraph, so I cited the author only." },
      { title:"Model 3: “The Story of an Hour” (on-screen context)",
        para:"Chopin’s ending is a diagnosis that misdiagnoses everything. When the doctors arrive, they say that Mrs. Mallard “had died of heart disease—of the joy that kills” (Chopin, par. 23). The dash in Chopin’s own sentence is a trapdoor: the official explanation drops into an irony only the reader can hear. The household believes her heart failed from happiness at seeing her husband alive; we know it failed at losing a future in which “[Mrs. Mallard] would live for herself” (par. 14). Chopin never states this directly. Instead, she trusts punctuation and juxtaposition to do the accusing. The joy that kills is real, but it isn’t the joy the doctors mean.",
        mark:"The semicolon after “alive”: “It sets the household’s belief against the reader’s knowledge.”", wc:"hour-screen",
        craft:"I replaced “she” with “[Mrs. Mallard]” in brackets so the reader knows who will live for herself, and I cited by paragraph because I worked from the on-screen text. I kept Chopin’s dash inside the quotation because it’s hers. My semicolon is mine." }
    ]
  },
  cards:[
    ["MLA prose citation", "(Chopin 42). With the author named in the sentence: (42). On-screen numbered paragraphs: (Mansfield, par. 9)."],
    ["MLA poetry citation", "First time: (Shelley, lines 10–11); later: (12). Show line breaks with “ / ”."],
    ["MLA drama citation", "(<em>Hamlet</em> 3.1.56–60): act.scene.line."],
    ["Period placement", "Inline: “…quoted words” (Author 42). Block: …quoted words. (Author 42)"],
    ["Ellipsis", "A spaced “. . .” marks words you removed. Never remove meaning."],
    ["Square brackets", "Mark words you changed or added for clarity: “[Mrs. Mallard] did not hear the story…”"],
    ["Block quotation", "More than 4 lines of prose or 3 of poetry; indented; no quotation marks."],
    ["Works Cited core elements", "Author. Title of source. Title of container, other contributors, version, number, publisher, publication date, location."],
    ["Comma splice", "Two complete sentences joined by only a comma. Fix with a period, a semicolon, or a comma plus a joining word."],
    ["Colon", "Announces a list, an explanation or a punchline: “Mrs. Mallard whispered one word: free.”"],
    ["Dangling modifier", "An opening phrase with no proper subject: “Walking in, the smell…” Fix: “Walking in, I smelled…”"],
    ["Comma, colon, period (word story)", "Greek <em>komma</em> “a piece cut off”, <em>kolon</em> “a limb”, <em>periodos</em> “a circuit”: parts of a spoken sentence."]
  ]
};
