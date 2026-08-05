# Handoff Context — Marina Harbor Detox

Paste this whole file into a new chat to continue the work.

---

## What this is

`/Users/benjamincastro/Marina Harbor Detox` — a Next.js 15 + React 19 + TypeScript + Tailwind 3.4
rebuild of **marinaharbordetox.com**, a San Francisco luxury detox facility, migrating off WordPress
to Vercel. It is one of **12 sites** in the Quadrant Health Group (QHG) portfolio doing the same
migration.

Three audits have been completed and written to files in the repo root. **Read them before doing
anything:**

| File | What's in it |
|---|---|
| `TASKS.md` | **Start here.** 58 tasks: `D-1…D-8` decisions, `MH-01…MH-37` this repo, `PF-01…PF-13` other sites. Each has files, steps, and a runnable acceptance check. |
| `issue.md` | Marina Harbor findings in detail, with evidence. |
| `issues.md` | The full 12-site register (131 issue IDs + 1,183 visual issues). Reference only — you cannot action other sites from here. |

Your job: work `TASKS.md` in order. It has a suggested sequence at the bottom.

---

## Repo facts

- **Node 20.11.0, npm 10.2.4.** `npm run build` · `npm run dev` · `npm run lint`
- **Branch `changes`**, one commit behind it (`f3cbdb9`). **35 modified files + 4 untracked, all uncommitted.**
- 124 routes / 118 built HTML pages. Build is green — keep it that way.
- Homepage is hand-built (`src/app/page.tsx`). All 116 inner pages are data-driven: catch-all
  `src/app/[...slug]/page.tsx` renders JSON from `content/` via `src/components/ContentPage.tsx`.
  `/blog` is its own route.
- **All copy, nav, phones, programs live in `src/lib/site.ts`** — edit there, not in components.
- Images resolve through `content/media-manifest.json` (WP URL → `/media/…` path) served from
  `public/media/` (156 MB).
- `archive/` holds the original WP capture (git-ignored): `raw-html/` is useful for recovering
  content the extractor mangled (see task MH-17).

### Uncommitted work already in the tree

A phone-number consolidation was applied on 2026-08-04: `site.phones` collapsed to `primary` only,
and 138 body-copy occurrences normalised to `1-866-525-3026` across 32 content files. Also added
`foundingDate: 2021` to JSON-LD, a Google review CTA, and a normalised street address.

**This is contested — see the first hard rule below.**

---

## Hard rules — read before touching anything

**1. Do NOT write the privacy policy yourself (MH-01).** The current one is Yelp's ToS find-replaced.
It must be replaced by **counsel-drafted** text. Prepare the brief; do not draft healthcare privacy
language, HIPAA notices, or TCPA consent wording.

**2. Do NOT rewrite clinical or medical copy yourself (MH-04).** Five YMYL medical errors need a
**clinician's** sign-off. Package the passages for review; apply what comes back verbatim. Do not
invent corrected medical text.

**3. Do NOT act on `D-1`…`D-8` without answers.** They are blocked on humans (admissions, compliance,
marketing). If unanswered, skip the dependent task and say so — don't guess.

**4. The phone consolidation is contested.** Audit rows V0048/V0049 are marked `BLOCKED` and say
confirm with admissions before removing `866-932-3206` and `415-868-3858`. Evidence suggests
`415-868-3858` is a **live** SF click-to-call line (WordPress "Call Now Button" plugin, present on
production twice). **Do not revert and do not treat the removal as settled** until D-1 is answered.

**5. Do NOT use Laguna View Detox as the canonical reference build.** Every canonical row in the
workbook cites it as the model; V0067 proves it is one of the worst configured (43 of 46 canonicals
point at redirects). Use Marina Harbor, which V0109 names as correct.

**6. Do NOT port Greater Texas's Florida content (PF-12).** Two West Palm Beach posts on the Texas
domain are correctly 404'd by the build. Unlike every other missing-page row, leave them dropped.

**7. Settle the trailing-slash convention (MH-35) BEFORE fixing the canonical (MH-21).** MH-21 strips
the trailing slash, but all 12 production sites are slash-canonical. Doing MH-21 first may fight the
portfolio decision.

---

## Design decisions that must not be regressed

These were deliberate. A fresh pass will be tempted to "fix" them:

- **No `overflow-x: hidden/clip` on `<html>`** — it makes html a scroll container and breaks the
  sticky header. It is on `body`, which is correct.
- **Hero photo stays clean.** No card, no panel, no white wash/film over `coastal.jpg`. Legibility
  comes from white text plus a text-shadow. The user explicitly dislikes an opaque layer on the image.
- **Nav breakpoint is `xl`, not `lg`.** With 7 nav groups it only fits single-line ≥1280px. Below that
  it's the hamburger. Do not drop it back.
- **No "Home" item in `nav`** (`site.ts`) — the logo links home. Footer Quick Links keeps Home; that's fine.
- **Article reading column is capped at `max-w-[62rem]`** while global containers are wide
  (`maxWidth.content` 1400 / `wide` 1560). Don't widen the reading column or narrow the containers.
- **`SidebarCTA` is `hidden lg:block`** — deliberately not on mobile.
- Grid/flex children need `min-w-0`; prose `<ul>` must be block not grid; long tokens need
  `[overflow-wrap:anywhere]`.

---

## How to verify

```bash
npm run build                    # must stay green at 124 routes

# canonical vs sitemap agreement
grep -oE '<link rel="canonical" href="[^"]*"' .next/server/app/about.html

# phone consistency sitewide
find .next/server/app -name "*.html" -exec grep -ohE '\(?[0-9]{3}\)? ?[-.]?[0-9]{3}[-.][0-9]{4}' {} + | sort | uniq -c
# expect: 866-525-3026 only, plus 877-696-6775 (HHS OCR, legitimate)
# and (415) 555-0123 (form placeholder, legitimate)

# heading order + alt text + one-h1-per-page
# (see the acceptance blocks in TASKS.md for the full scripts)
```

Visual checks use headless Chrome via `npm i --no-save puppeteer-core@23` driving
`/Applications/Google Chrome.app`. Measure overflow as
`document.documentElement.scrollWidth - window.innerWidth`. The check script must live in the project
dir (ESM ignores NODE_PATH). `next/image` is slow on first cold hit of lazy homepage images — a
screenshot artifact, not a prod issue.

**Source workbooks** (fetch without auth, parse with openpyxl):
- Audit workbook: `https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/export?format=xlsx`
- Staff bios doc: `https://docs.google.com/document/d/1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA/export?format=md`

---

## Where to start

Per `TASKS.md`, the cheapest high-impact work with no blockers:

1. **MH-22** — downsample 4 JPEGs that are 26–28 MB each (7952×5304). ~2h, removes ~110 MB and a
   Vercel image-optimizer timeout risk. Biggest effort:impact ratio in the plan.
2. **MH-08** — one line. `about_gus-saadeh.json` has `ogImage: …carlaheadshot-1_orig…jpg`, a different
   person's headshot, which resolves to nothing so the page renders the company logo. His real photo
   is already in the repo at `public/media/2026/02/IMG_2660.jpg`.
3. **MH-16** — scripted misspelling sweep (Mariana/Marnia/Habor Harbor, San Franciso/Fransico, Adiction, Comission).
4. **MH-23** — add a skip link. ~15 min.
5. **MH-02**, **MH-03** — remove the competitor name and fix the false location claims.

Then MH-09, MH-10, MH-13, MH-19 and the Phase 3 a11y block.

**Commit discipline:** nothing is committed yet and there are 35 modified files in the tree from the
phone work. Commit that separately and first, before starting new tasks, so the diffs stay reviewable.
