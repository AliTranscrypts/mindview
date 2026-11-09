// functions/lib/assessment-paths.js
//
// Shared helpers for matching chapter and assessment page URLs.
//
// Cloudflare Pages serves every page at two URLs: /x.html redirects (308) to
// the clean URL /x, and the clean URL serves the page. Any check that matches
// on a page URL must therefore accept both forms. Matching only "*.html" let
// students open locked chapters and supervised tests by typing the clean URL.

// Canonical "*.html" form of a page path, for matching only (never for
// redirects): "/courses/sph3u/ch2", "/courses/sph3u/ch2/" and
// "/courses/sph3u/ch2.html" all become "/courses/sph3u/ch2.html".
export function withHtmlExt(pathname) {
  let p = String(pathname || '');
  // Decode so "/courses/sph3u/ch%32" matches like "/ch2", but only when the
  // result is a plain file path. Callers echo this path into HTML/JS (the
  // locked-assessment page), so a decoded "<" or quote must never come back.
  try {
    const decoded = decodeURIComponent(p);
    if (/^[A-Za-z0-9\/_.-]*$/.test(decoded)) p = decoded;
  } catch { /* keep the raw path */ }
  p = p.replace(/\/+$/, '');
  return /\.html?$/i.test(p) ? p : p + '.html';
}

// KV-safe slug for an assessment path. Must stay identical to slugify() in
// functions/api/assessment-unlock.js and slugifyPath() in functions/_middleware.js,
// because unlock-grant keys are built with it.
export function slugifyAssessmentPath(path) {
  return String(path)
    .replace(/^\/+/, '')
    .replace(/\.html?$/i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '__');
}

// { course, ch } for a chapter's OF unit test, or null. Accepts both URL forms:
//   /assessments/sph3u/Unit1_Kinematics_OF(.html)  → { course:'sph3u', ch:1 }
//   /assessments/chv2o/Chapter2_Civic_Engagement_OF → { course:'chv2o', ch:2 }
//   /assessments/mcr3u_ch3_of(.html)               → { course:'mcr3u', ch:3 }
export function parseUnitTestPath(pathname) {
  const p = withHtmlExt(pathname);
  let m = p.match(/^\/assessments\/([a-z0-9]+)\/(?:Unit|Chapter)(\d+)_[^/]*_OF\.html$/i);
  if (!m) m = p.match(/^\/assessments\/([a-z0-9]+)_ch(\d+)_of\.html$/i);
  if (!m) return null;
  return { course: m[1].toLowerCase(), ch: parseInt(m[2], 10) };
}

// Chapters per course. Mirrors COURSE_CHAPTER_COUNTS in functions/_middleware.js
// and COURSE_CHAPTERS in admin/progress.html.
export const COURSE_CHAPTER_COUNTS = {
  baf3m:5, bat4m:5, bbb4m:5, boh4m:5,
  cgf3m:5, cgw4u:5, chc2d:5, chv2o:3,
  chw3m:5, chy4u:6, cln4u:5, clu3m:5,
  cpc3o:3, cpw4u:5, eng2d:5, eng3u:6,
  eng4u:6, glc2o:3, gle3o:5, gle4o:5,
  gpp3o:5, gwl3o:3, hfa4m:5, hfn3m:5,
  hsc4m:5, ics3u:5, ics4u:5, mcr3u:8,
  mct3m:5, mct4m:5, mcv4u:9, mdm4u:8,
  mhf4u:8, sbi3u:5, sbi4u:5, sch3u:5,
  sch4u:5, snc2d:5, sph3u:5, sph4u:5,
};
