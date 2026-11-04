# MindView Virtual Classroom — Baseline & Guardrails

**Frozen baseline:** git tag `baseline-2026-06-01` (chapter-per-page layout + Phase A Grade 11 courses in staging).
**Previous baseline:** `baseline-2026-05-21` (Phase A absent — current production state).
**Production URL:** https://mindview.pages.dev/ (only owner-approved content)
**Staging URL:** https://staging.mindview.pages.dev/ (review queue, same USERS_KV)
**Owner role for full access:** `superuser` (email allowlisted in `USERS_KV`).

## Two-environment deployment policy (STRICT)

The owner reviews changes in staging BEFORE production. No new content lands on
`https://mindview.pages.dev/` without explicit owner approval.

- **Staging** (`https://staging.mindview.pages.dev/`) — `wrangler --branch=staging`.
  Shares `USERS_KV` and `SESSION_SECRET` with production, so the same login works.
  This is the default deploy target.
- **Production** (`https://mindview.pages.dev/`) — `wrangler --branch=main`.
  Only after owner has reviewed staging and said "ship to prod".

Use `sh scripts/safe-deploy.sh` (default → staging) or
`TARGET=production sh scripts/safe-deploy.sh` (only with owner approval).
**Never run `wrangler pages deploy . --branch=main` directly.**

This file is read automatically by Claude Code at the start of every session
in this repo. **Future agents and humans must read this before changing
anything.** Its purpose is to lock the *state, structure, and visibility* of
the program as of today so that incremental work blends in without disturbing
what already works.

If a request would require breaking one of the rules below, **stop and ask
the owner first** — do not silently override.

---

## 1. Architecture (do not change without explicit approval)

The site is a **Cloudflare Pages** project deployed via **Direct Upload**
(not Git-connected; updates ship via `wrangler pages deploy`).

| Layer | Where | What it does |
|---|---|---|
| Auth | `functions/_middleware.js` | Gates every HTML request; 302 → `/login` if no valid session cookie |
| Auth | `functions/lib/session.js` | HMAC-SHA256 signed `mv_session` cookie helpers |
| Auth | `functions/lib/password.js` | PBKDF2-SHA256 password hash/verify; transparent legacy-SHA-256 upgrade path |
| Auth | `functions/api/login.js` | Email+password → cookie |
| Auth | `functions/api/logout.js` | Clear cookie |
| Auth | `functions/api/me.js` | Returns `{authenticated, user:{id,email,full_name,role,role_label,can_manage_users}}` |
| Auth | `functions/api/bootstrap.js` | One-shot seeder when KV is empty (locked after first user) |
| Admin | `functions/api/users.js` | CRUD over `USERS_KV` (admin+ only) |
| Content protection | `js/content-protection.js` | Injected via middleware into every HTML response; disables copy/paste/right-click/print for non-superusers |
| Auth UI | `admin/login.html` | Custom email+password form |
| Admin UI | `admin/dashboard.html`, `admin/users.html` | Role-based admin pages |
| Course landing pages | `courses/{code}.html` (10 files) | Slim landing page — hero, Course Resources, chapter-card grid |
| **Chapter pages** | **`courses/{code}/ch{N}.html`** (64 files) | **One file per chapter — lesson notes + videos + AS/FOR/OF + prev/next** |
| Curriculum cards | `courses/*_curriculum.html` | Ministry curriculum overview pages |
| Assessments | `assessments/{course}/Unit*_{AS,FOR,OF}.html` for science / vectors / English / CS; flat `{course}_chN_*.html` for MCR3U, MHF4U, MDM4U | Practice quizzes, diagnostics, unit tests |

### Cloudflare Pages bindings (DO NOT remove)
- `USERS_KV` — Workers KV namespace, holds user records
- `SESSION_SECRET` — Pages environment variable (Production + Preview),
  HMAC key for `mv_session` cookies. **If unset, middleware returns 500.**

---

## 2. Frozen UX patterns (additive changes only)

### 2a. Course landing pages (`courses/{code}.html`)
Each is short and contains ONLY:
1. Top hero with course code + title.
2. Chapter-pill quick-nav row, each pill linking to `{code}/ch{N}.html`.
3. **"Course Resources & Final Evaluation" block** — must be ABOVE the chapter cards. Two cards: Curriculum Document (left) + Final Exam (right).
4. **Chapter-cards grid** — one card per chapter, linking to `{code}/ch{N}.html`. Each card has a color-matched left border, chapter number tag, title, and subtitle.
5. Footer.
**No `<div class="unit-section">` inline content** (one exception per file is allowed: the resources block uses `id="resources"`; SPH4U keeps a `strandA` block; MCR3U keeps a `bridge` review block).

### 2b. Chapter pages (`courses/{code}/ch{N}.html`)
Each chapter page MUST contain:
1. Same `<head>` and nav as the landing (with relative paths bumped from `../` → `../../`).
2. **Breadcrumb** in the chapter hero: `<a href="../{code}.html">← Back to course (CODE Title)</a>`.
3. **Chapter hero** with the original unit-header gradient + title + subtitle.
4. All topic blocks from that chapter (each with its `<details class="lesson-notes">` and `<div class="video-card">` and worked examples).
5. The **AS → FOR → OF assessment strip** in that exact order.
6. **Prev/Next chapter-nav strip** at the bottom (`.chapter-nav` with `.chnav-btn` styled buttons):
   - First chapter: `← Back to course` + `Chapter 2 →`
   - Middle chapters: `← Chapter N-1` + `Chapter N+1 →`
   - Last chapter: `← Chapter N-1` + `↑ Back to course` (uses `.chnav-finish` green variant)
7. Footer.

### 2c. Assessment strip card order — locked
Inside every chapter page, the assessment strip is always:
1. 🔄 **Practice Quiz — Assessment AS Learning** (cyan)
2. 📋 **Diagnostic — Assessment FOR Learning** (amber)
3. ✅ **Unit Test — Assessment OF Learning** (purple)

### 2d. Manage Users page (`admin/users.html`)
- Role-reference matrix at the bottom — columns **Super User → Administrator → Teacher → Student** (left-to-right by power, descending).
- Rows grouped into 4 tiers (everyone / admin+ / superuser-only / nobody) separated by slate-300 dividers.

### 2e. Nav / chrome
- Nav shows brand logo, page links, user name + Logout. **No role pill.**

### 2f. Authentication-related rules
- **Lock-out protection:** no user can change their own role; no user can delete their own account. Edit modal disables the role field when `isMe`.
- **Bootstrap endpoint is single-use:** must return 403 once KV has any user. Do not re-enable `force_reset` or any other rescue flag.
- **Login page exemptions:** `/login`, `/admin/login`, `/admin/login.html` stay in `PUBLIC_EXACT` in `functions/_middleware.js` and in `NO_INJECT_PATHS` for content-protection.

### 2g. Curriculum lesson notes (chapter pages)
- Every `topic-block` has a `<details class="lesson-notes">` block.
- Block contains: 600–1000 words including concept paragraphs, vocabulary list, 1-2 `<div class="worked-example">`, common-mistakes list, and a `<p class="curriculum-link">` citation.
- MathJax `\( \)` and `\[ \]` for math (single backslash; NOT `\\(`).
- For ICS4U, `<pre><code>` blocks (Python).

### 2h. Content protection
- Non-superusers cannot copy, select, right-click, drag-save, print, or use view-source shortcuts.
- Superusers retain full browser interactivity.
- Script self-skips on login pages (form fields must always accept paste).

---

## 3. Rules for future changes

### "Additive only" by default
- New features add **new** files, **new** blocks, **new** rows. Never rename existing files, never delete fields, never reorder UI without an explicit request from the owner naming the thing being reordered.
- Test new pages against the auth gate. They will be 302'd unless added to `PUBLIC_EXACT` (rare) or the user is signed in.

### Before modifying any of the following, ask first:
- `functions/_middleware.js` exempt lists
- `functions/api/users.js` permission checks
- `functions/api/bootstrap.js` lock condition
- The assessment-strip card order (AS → FOR → OF)
- The Role Reference matrix structure
- The Course Resources block position
- `js/content-protection.js` (security implication)
- `_redirects` rules
- Cookie attributes (`HttpOnly`, `Secure`, `SameSite`, `Path`, `Max-Age`)
- The **chapter-per-page layout** (every chapter must be its own file at `courses/{code}/ch{N}.html`)
- Prev/Next chapter-nav (every chapter must have it)

### Safe-to-change without prior approval
- Adding a new chapter to an existing course: add `courses/{code}/ch{N+1}.html` following the chapter-page template; add a new chapter-card on the landing; AS/FOR/OF assessment files for that chapter.
- Adding lesson-notes to a topic that lacks them (use the existing `<details class="lesson-notes">` template).
- Replacing a broken YouTube video (verify via oEmbed before writing).
- Editing typos, fixing curriculum-citation phrasing inside a chapter page.
- Adding new admin pages (must include `/api/me` auth check).

### Deploy procedure
```
cd /Users/syed/Documents/work/mindview
wrangler pages deploy . --project-name=mindview --branch=main --commit-dirty=true
```
Functions get bundled automatically when wrangler is run **from inside the project directory** (`wrangler pages deploy .`). Running it with a path argument from outside skips Functions bundling — *don't do that*.

After every deploy, run `python3 scripts/verify-baseline.py` to confirm invariants hold.

### Database safety
- `USERS_KV` is the only source of truth for user identity. Don't wipe it without owner approval — there is no version history.
- Password hashes: new records use PBKDF2-SHA256+salt (`v2:` prefix, see `functions/lib/password.js`). Legacy records still hold unsalted SHA-256 hex and are upgraded transparently on first login — do not wipe USERS_KV without owner approval.
- **PBKDF2 iterations must stay ≤ 100,000.** Cloudflare Workers rejects higher counts with `NotSupportedError`. The 2026-06-16 deploy used 200,000, which made every "Add user" fail with a 500 (shown as "Network error"); fixed 2026-11-04. Hash layout: `v2:<iterations>:<salt hex>:<hash hex>`.
- **Never roll production back to a deployment from before 2026-11-04.** Older builds cannot verify `v2:` hashes, so every new or upgraded user would be locked out.

---

## 4. Verifying the baseline holds

Run `python3 scripts/verify-baseline.py` from the repo root. It asserts:

- All security-critical & UX-critical files exist
- Middleware exempt list intact (login pages, API endpoints)
- `SESSION_SECRET` referenced in middleware
- No Netlify Identity remnants in any course or admin file
- No Cloudflare Access remnants (`/cdn-cgi/access/`) in admin or index files
- Logout links use `/api/logout`
- No `<span id="user-role">` role pill in nav chips
- Every course landing has the **Course Resources** block AND the **chapter-cards grid** AND NO `<div class="unit-section" id="unitN">` blocks for N≥1
- Every course has the expected number of `courses/{code}/ch{N}.html` chapter pages
- Every chapter page has: breadcrumb, hero, AS→FOR→OF strip in that order, prev/next chapter-nav, lesson-notes detail blocks
- Role Reference matrix columns are Super User → Admin → Teacher → Student
- No `\\(...\\)` double-backslash MathJax delimiters in any chapter or course HTML
- All chapter-assessment hrefs resolve to existing files under `assessments/`
- Session cookie keeps `HttpOnly` + `Secure` + `SameSite=Lax` + `Path=/`
- Bootstrap endpoint contains the "Bootstrap already complete" lock-out
- No rescue-mode (`force_reset`) code in bootstrap

If any assertion fails, the script exits non-zero. **Do not deploy a state that fails the baseline check** without explicit owner approval.

### Hard enforcement (recommended)

A **git pre-commit hook** is shipped at `scripts/git-hooks/pre-commit`. It runs
`verify-baseline.py` before every commit and rejects the commit if any check
fails. Install it once after cloning the repo:

```
sh scripts/install-hooks.sh
```

After install, `git commit` will refuse to create a commit that breaks the
baseline. You can still bypass with `git commit --no-verify` — but if you
do, you must update `CLAUDE.md` and `verify-baseline.py` in the same commit
to reflect the new baseline, then re-tag.

A **safe-deploy wrapper** is at `scripts/safe-deploy.sh`. Use it instead of
calling `wrangler pages deploy .` directly:

```
sh scripts/safe-deploy.sh
```

It runs the verifier first and only invokes wrangler if the baseline is
intact. Bypass with `FORCE=1 sh scripts/safe-deploy.sh` if absolutely needed.

---

## 5. Locked content

- Curriculum lesson notes (~314 blocks across 64 chapter pages): subject-matter accuracy was audited; do not rewrite without retaining the structure (concept paragraphs → vocabulary → worked examples → mistakes → curriculum citation).
- Role Reference matrix: 13 capability rows in the established tier-grouping (everyone / admin+ / superuser-only / nobody).
- Video replacements made on 2026-05-20: every replacement was oEmbed-verified. If a video breaks again, find another working replacement; don't restore the old (broken) ID.

---

## 6. Per-course chapter counts (for the verifier)

| Course | Expected chapter count |
|---|---:|
| MCR3U  | 8 |
| MHF4U  | 8 |
| MCV4U  | 9 |
| MDM4U  | 8 |
| SPH3U  | 5 |
| SPH4U  | 5 |
| SCH4U  | 5 |
| SBI4U  | 5 |
| ICS4U  | 5 |
| ENG4U  | 6 |
| ENG3U  | 6 |
| **Total** | **70** |

---

## 7. Where to find prior decisions

Commit messages on `main` are the canonical record. Most-relevant recent ones:

- (head) — Chapter-per-page restructure across all 10 courses
- `113cc73` — Locked the baseline (CLAUDE.md + scripts/verify-baseline.py)
- `18d3a91` — Verifier-regex fix + sph3u/sph4u MathJax delimiter fix
- `afe04b2` — Chapter strip order set to AS → FOR → OF
- `4c1350c` — Curriculum-to-top + AS/FOR/OF strips + 49 video fixes
- `e7a2b12` — MCV4U lesson notes expanded to per-topic
- `bf61f34` — Lesson notes added for 9 courses
- `b684a7e` — MCR3U lesson notes pilot
- `6e1dcc6` — Content protection script + middleware injection
- `94f3975` — Role-reference matrix added to Manage Users
- `e113e66` — Custom email+password auth built
- `fc00324` — Removed Netlify Identity

**End of baseline. Last updated 2026-05-21 by the chapter-restructure session.**
