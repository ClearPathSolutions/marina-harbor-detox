# Marina Harbor Detox — Issues & Content Updates

Everything outstanding for **this facility only**. Three sources, reconciled.

| Source | What it gives |
|---|---|
| [Staff bios doc](https://docs.google.com/document/d/1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA) | Source of truth for who works here and their bios |
| [Cutover audit workbook](https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8) | Crawl findings for the Vercel build |
| This repo | Source-level audit of the Next.js site |

Extracted 2026-08-04. Portfolio-wide register: [issues.md](issues.md).

---

## 1. Staff & bios — from the bios doc

Marina Harbor staff appear across **four** doc headings, not two: `Cali Leadership` and `CA Sites` (California-wide leadership, which covers this facility), `Cali NORTH` (regional — Marina Harbor is the only NorCal site listed), and `Marina Harbor Detox` (site staff).

### 1.1 Roster: doc vs. published site

**Site staff and NorCal regional**

| Person | Title per doc | On site? | Action |
|---|---|---|---|
| Alicia Joslin | Program Director | ✅ `/about/alicia-joslin` | None — bio is verbatim-current |
| Gus Saadeh | **Director of Operations** | ✅ `/about/gus-saadeh` | Title mismatch + wrong headshot — see 1.2, 1.3 |
| **Ashley Hurtado, AMFT** | Therapist | ❌ **absent** | **Build the page** — full 5-paragraph bio already written in the doc |
| **Ashley Ruiz** | Nursing Supervisor (Marina Harbor & Cali lead) | ❌ **absent** | Bio + headshot both flagged outstanding in the doc |
| TBD | Case Manager | ❌ vacancy | Doc lists `TBD - Case Manager (MHD)`; add once filled |

**California-wide leadership — covers this facility, none of them are on the site**

| Person | Title per doc | Bio in doc? | Relevance to Marina Harbor |
|---|---|---|---|
| **Erika "Riky" Hanaumi, LCSW** | Clinical Director, CA facilities | ✅ full | **Already cited on the site as the medical reviewer** — see 1.7 |
| **Michael McArthur** | Director of Nursing, CA facilities | ✅ full | Oversees medical staff at CA sites |
| **Monica Olivares, CADC II** | Clinical Supervisor, CA facilities | ✅ full | Also the subject of V0054 at Hillside |
| **Jacob Cameron, SUDCC I** | Client Care Director, QHG | ✅ full | Org-wide client care |
| Shawn Young | Executive Director | ✅ full | Bio says **Southern** California — likely *not* Marina Harbor. Confirm scope |

Decide deliberately whether the CA leadership layer belongs on facility sites or only on the parent. Right now it appears on neither, yet Riky Hanaumi is already named on Marina Harbor pages as the reviewing clinician with no bio behind the name.

**Both existing bios were diffed paragraph-by-paragraph against the doc and match verbatim** — the copy is current, so the gap is people, not text.

> **Defect in the doc itself:** the `Cali Leadership` and `CA Sites` sections are **byte-identical** (7,687 characters each, same five bios). One is a stray copy — worth resolving so nobody publishes the roster twice.

### 1.2 Gus Saadeh: og:image is a different person

`content/pages/about_gus-saadeh.json` has:

```
ogImage: .../wp-content/uploads/2021/08/carlaheadshot-1_orig-1024x576-1.jpg
```

That filename is **another employee's headshot**, and it resolves to nothing in `media-manifest.json` — so `leadImage()` falls through the images array and renders **the company logo** as both hero and og:image on a named staff page.

Gus's real photo **is already in the repo, unused**: `public/media/2026/02/IMG_2660.jpg` (118 KB).

- **Fix:** set `ogImage` to `.../2026/02/IMG_2660.jpg`. One-line change; the asset is already there.
- This is the root cause of workbook row **V0050** ("Gus Saadeh's picture does not populate") — but the underlying defect is worse than the row states: a named staff page pointing at a different person's headshot is the same class of error as V0054 at Hillside.
- Alicia's photo resolves correctly (`/media/2026/06/MHD-Alicia-Joslin.png`) — this is Gus only.

### 1.3 Job title is inconsistent three ways

| Where | Says |
|---|---|
| Bios doc (source of truth) | **Director of Operations** |
| `src/lib/site.ts:65` nav | Operations Director |
| `about_gus-saadeh.json` h3 | Operations Director |
| `about_gus-saadeh.json` body + metaDescription | Director of Operations / Operations Director |

Standardise on **Director of Operations** per the doc.

### 1.4 Stale CEO attribution on /care-providers

`content/pages/care-providers.json` attributes a testimonial to **"– Jack Terwelp, CEO"**. Jack Terwelp appears **nowhere** in the bios doc. The doc's Quad Leadership roster lists **Nicholas Petrillo as Chief Executive Officer** (with Joseph Cameron and Louis Iacona as Founders).

Either the quote predates a leadership change or the attribution is wrong. **Confirm before launch** — a misattributed named quote on a healthcare site carries the same risk as V0054.

### 1.5 Blog author is not in the roster

`src/lib/site.ts` credits all three homepage posts to **"Kris Brace, CADC II"**, and `ContentPage.tsx` separately hardcodes the byline **"Marina Harbor Detox Clinical Team"** on every post. **Kris Brace does not appear in the bios doc.**

Pick one and make it real: either add Kris Brace to the roster with a bio page to link from the byline, or reassign the posts to a named clinician who is on staff. YMYL content needs an attributable author and a named medical reviewer.

### 1.6 No team hub page — and V0051 is wrong about this

`/care-providers` is a **referral-partner page** (H1 "Care Providers", body is about accepting referrals from other treatment programs), **not** a team index.

> **Correction to workbook row V0051.** Its verification note claims *"it IS a functioning team hub … and it links both bios"*, and concludes *"Marina Harbor bios are NOT orphaned, unlike Dallas and Hillside."* **That is a false positive from counting nav links.** Measured against the built HTML:
>
> | | `about/alicia-joslin` | `about/gus-saadeh` |
> |---|---|---|
> | Inside `<main>` on /care-providers | **0** | **0** |
> | Whole /care-providers page | 2 | 2 |
> | Whole /faq page (control, not a hub) | 5 | 5 |
>
> Both occurrences on /care-providers are the header nav dropdown and mobile drawer, which render on every page — the control page carries more of them than the supposed hub does. This is the same nav-label measurement error the workbook Legend already flags once: *"Similarity was first measured by joining all &lt;p&gt; tags, which on several builds captures nav labels rather than body text."*

So the bios **are** reachable only from global chrome. Adding Ashley Hurtado and Ashley Ruiz makes a real `/about/team` hub worthwhile — it also gives the parent site something to link to instead of republishing bios (see V0050).

### 1.7 The medical reviewer is a broken bullet, and she is in the doc

Exactly **one** page in the whole site names a reviewing clinician:

```
content/pages/what-we-offer_drug-rehab-marin-county.json
  [li] "Medically Reviewed By: R.Hanaumi, LCSW"
```

That is **Erika "Riky" Hanaumi, LCSW — Clinical Director for QHG's California facilities**, who has a full five-paragraph bio in the doc. On the site she is an orphaned list item: `isNoise` in `ContentPage.tsx:27` filters `CADC|LMFT|CADC II|, MD$` but **not `LCSW`**, so the byline renders as a bullet point in the body copy.

- **1 of 118 pages** carries a reviewer byline — the same E-E-A-T gap as V0111 at Dallas (25 of 103).
- Fix properly rather than filtering it out: build her a bio page and render the byline as a real reviewer credit linking to it.

### 1.8 Other stray content artifacts found while reconciling

| Artifact | Where | Note |
|---|---|---|
| `Last Updated …` rendering as a bullet | 6 pages (`what-we-offer`, `detox-san-francisco`, `drug-detox`, `drug-rehab-marin-county`, `holistic-addiction-therapy`, `inpatient-rehab-san-francisco`) | Same `isNoise` gap as the reviewer byline |
| **"Marin County Adiction Treatment"** — *Addiction* misspelled | `content/pages/what-we-offer_drug-rehab-marin-county.json:17` | Heading text, not caught by the earlier brand-misspelling sweep |

---

## 2. Cutover audit — Marina Harbor rows

7 rows filed against this facility, plus 10 portfolio-wide rows that name it.

### V0048 — `BLOCKED` · CONFIRMED_AMENDED

Wrong facility phone number on homepage. Laguna View Detox's number 866-932-3206 is used on a mid-page CTA ('Call 866-932-3206') while the rest of the site correctly uses 866-525-3026.

- **Where:** https://marina-harbor-detox.vercel.app/ (mid-page admissions CTA)
- **Fix:** Replace 866-932-3206 with 866-525-3026 in the CTA block on: https://marina-harbor-detox.vercel.app/ The number belongs to Laguna View Detox, which correctly uses it here: https://laguna-view-detox.vercel.app/ Cross-check against the production domain and GBP: https://marinaharbordetox.com
- **Verification correction:** PRIORITY BLOCKED: Confirm with admissions before removing a live tracked number INHERITED, NOT INTRODUCED. Production marinaharbordetox.com carries the same number on its homepage, anchor "Call Us At 866-932-3206". So this is pre-existing, not a rebuild regression, same as V0041 and V0043. Apply the V0043 caution before deleting: confirm with admissions that 866-932-3206 is not a deliberate shared or overflow line. Contamination is the more likely reading here than in V0043, since Laguna Beach and San Francisco are different markets, but it is still a live number and worth one confirmation.

### V0049 — `BLOCKED` · CONFIRMED_AMENDED

Third unverified phone number on homepage. 415-868-3858 appears on a 'Call Us Now' link. Three different numbers on one page breaks call attribution.

- **Where:** https://marina-harbor-detox.vercel.app/ ('Call Us Now' link)
- **Fix:** Confirm whether 415-868-3858 is a legitimate local line on: https://marina-harbor-detox.vercel.app/ If it is not the tracked number, replace with 866-525-3026 as used sitewide, e.g.: https://marina-harbor-detox.vercel.app/contact-location Cross-check against the production domain and GBP: https://marinaharbordetox.com
- **Verification correction:** PRIORITY BLOCKED: Number is likely a legitimate local SF line, do not replace Row calls it "unverified" and implies it may be an error. Evidence says it is most likely legitimate: 1) On production its anchor is literally "Call Now Button", the name of the WordPress Call Now Button plugin, so it is a deliberately configured mobile click-to-call line, not stray text. 2) Area code 415 matches the facility city - Marina Harbor is at 289 Marina Blvd, San Francisco. 3) It is on production in two places, so it is long-standing. Reword from "unverified third number" to: a real local SF line configured in the mobile call button, inconsistent with the tracked 866 number used everywhere else. The issue is attribution consistency, not contamination. Do NOT simply replace it, which is what the Fix currently suggests as an option.

### V0123 — `MEDIUM` · NEW - Marina Harbor deep audit 2026-07-28

Three production blog posts are absent from the new build. All three are OLD content - published 2021-08-26 and last modified 2023 - so unlike the portfolio snapshot gap (see the ALL SITES row) these were dropped during migration rather than published after the build was cut. All three are live and indexable on production and will 404 at cutover. Internal link integrity on the build is otherwise clean: 0 broken across 1,374 internal URLs collapsing to 141 base paths, and 0 path changes versus production.

- **Where:** https://marinaharbordetox.com/2021/08/26/depression-anxiety-and-substance/ (HTTP 200) https://marinaharbordetox.com/2021/08/26/marina-harbor-detox/ (HTTP 200) https://marinaharbordetox.com/2021/08/26/the-importance-of-in-person-addiction/ (HTTP 200) All three return HTTP 404 on the build at both the dated path and /blog/<slug>.
- **Fix:** Decide per post: port into the build at the same dated path to preserve the URL, or 301 to the closest live page if retiring. Do not leave unmapped. Build blog index: https://marina-harbor-detox.vercel.app/blog Build archive: https://marina-harbor-detox.vercel.app/blog/archive Note these are 5-year-old posts, so retiring may be the right call - but it should be a decision, not an accident.

### V0050 — `not triaged` · CONFIRMED_AMENDED

1 staff bio page(s) also published on the Quadrant parent domain - duplicate content across two domains. Additionally, Gus Saadeh's picture on the Marina Harbor site does not populate

- **Where:** https://marina-harbor-detox.vercel.app/about/gus-saadeh Also at: https://quadrant-health-group.vercel.app/team/gus-saadeh
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/gus-saadeh Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** Two refinements. 1) Not a verbatim duplicate. The intros differ - the facility page opens "Meet Gus Saadeh, Operations..." while the parent opens "Director of Operations. As the Director of Operations at Marina Harbor Detox...". At 76 percent word-level they are near-duplicates, not copies, so describe it that way. 2) The fix is already half-implemented and the row does not say so. The Marina Harbor page ALREADY canonicals correctly to https://marinaharbordetox.com/about/gus-saadeh/. The parent copy has NO canonical at all. So the action is specifically on the parent, not both sides: add a cross-domain canonical there, or replace it with a link. This also matches V0039-style findings, since the parent has no canonicals anywhere.

### V0051 — `not triaged` · CONFIRMED_AMENDED

Multiple non-standard slugs: /admission (singular), /contact-location, /facility instead of /tour, /care-providers instead of a team hub, /aftercare at root.

- **Where:** https://marina-harbor-detox.vercel.app
- **Fix:** Current URLs with the recommended standard beside each: https://marina-harbor-detox.vercel.app/admission -> /admissions https://marina-harbor-detox.vercel.app/contact-location -> /contact https://marina-harbor-detox.vercel.app/facility -> /tour https://marina-harbor-detox.vercel.app/care-providers -> /about/meet-the-team https://marina-harbor-detox.vercel.app/aftercare -> /treatment/aftercare https://marina-harbor-detox.vercel.app/what-we-offer -> /treatment Reference build using the standard: https://ocean-coast-recovery-center.vercel.app/treatment
- **Verification correction:** Three corrections. 1) MISSING COST. All 6 slugs also exist on PRODUCTION (each returns 301 to its trailing-slash form). These are not rebuild inventions - they are the established production URL structure with accumulated equity and inbound links. Renaming means redirecting long-standing URLs. The row presents standardisation as free; it is not. That cost belongs in the row so the decision is informed. 2) "/care-providers instead of a team hub" is wrong - it IS a functioning team hub. H1 "Care Providers", and it links both bios (/about/alicia-joslin, /about/gus-saadeh). Only the name is non-standard. Worth noting this also means Marina Harbor bios are NOT orphaned, unlike Dallas and Hillside. 3) "/facility instead of /tour" is accurate but understates it: the page title is "San Francisco Detox Center Facility Tour" with 12 images, so it is a fully built tour page, just named /facility.

### V0053 — `not triaged` · CONFIRMED

og:url points at the domain root on 2 of 118 pages instead of the page own URL, so every affected page declares itself as the homepage to social platforms and to any crawler using og:url as a URL hint.

- **Where:** https://marina-harbor-detox.vercel.app - 2 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://marinaharbordetox.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Minor only: the Fix cites https://marinaharbordetox.com/about, which returns 301 to the trailing-slash form rather than 200. Cite /about/ to match production convention.

### V0052 — `CLOSED` · BY_DESIGN · status: CLOSE - by design

CONFIRM BY DESIGN: detox and residential pages exist but under geo/descriptive slugs (/what-we-offer/detox-san-francisco, /what-we-offer/inpatient-rehab-san-francisco) rather than standard names, so automated checks read them as missing.

- **Where:** https://marina-harbor-detox.vercel.app/what-we-offer
- **Fix:** No page to build. Existing equivalents: https://marina-harbor-detox.vercel.app/what-we-offer/detox-san-francisco https://marina-harbor-detox.vercel.app/what-we-offer/inpatient-rehab-san-francisco Fold into the slug standardisation rows.
- **Verification correction:** PRIORITY CLOSED: By design - pages exist under geo slugs One refinement. The row implies geo-suffixed naming is the pattern for this section. It is actually the minority: of 13 children under /what-we-offer, 10 use standard names (alcohol-detox, drug-detox, meth-detox, heroin-detox, cocaine-detox, benzodiazepines-detox, prescription-drugs-detox, suboxone-detox, dual-diagnosis, holistic-addiction-therapy) and only 3 are geo-suffixed (detox-san-francisco, inpatient-rehab-san-francisco, drug-rehab-marin-county). So the inconsistency is WITHIN the section, which is a sharper point than the row makes.

### Rows filed elsewhere that name Marina Harbor

10 rows. Filtering only on `ALL SITES` misses V0091, V0109 and V0128, which are filed under other facilities but carry Marina Harbor actions.

**V0109** · `CRITICAL` · Ocean Coast Recovery — CRITICAL - 106 of 107 pages canonical to the DOMAIN ROOT instead of themselves. Every page except the homepage tells search engines its authoritative version is oceancoastrecovery.com. Zero pages are self-referencing. A wrong canonical is worse than a missing one: missing leaves attribution ambiguous, root-pointing actively instructs cons

**V0124** · `CRITICAL` · ALL SITES — CUTOVER CONTENT GAP - THE BUILDS PREDATE PRODUCTION AND THE GAP IS STILL GROWING. Every Vercel build appears to have been generated from a content snapshot taken around 15-16 July 2026. Production has kept publishing since. Measured across all 12 production sitemaps: 15 pages published or renamed on production are ABSENT from the correspo

**V0128** · `HIGH` · Quadrant Health Group (parent) — CUTOVER REDIRECT MAP REQUIRED - 16 URL pairs. Eight facility location pages are renamed from short forms to full facility names, seven blog posts move from dated /YYYY/MM/DD/ paths to /blog/<slug>, and the blog index moves from /about/blog to /blog. MIGRATION REQUIREMENT, NOT A DEFECT - internal link integrity on the build is clean: 0 bro

**V0118** · `MEDIUM` · ALL SITES — CONTRADICTION TO RESOLVE between two existing rows. V0052 closes Marina Harbor geo-suffixed service slugs (/what-we-offer/detox-san-francisco and similar) as by-design, while V0072 flags the same pattern on Des Moines (/programs/medical-detox-des-moines and similar) as a defect. Both cannot stand. Hillside has one instance too (/treatment

**V0091** · `not triaged` · Quadrant Health Group (parent) — Locations page contains no outbound links to any facility website. Only social links are present, so the parent passes no authority to the facilities.

**V0094** · `not triaged` · ALL SITES — Treatment hub slug differs across the portfolio: /treatment (8 sites), /treatment-services (Dallas), /programs (Des Moines), /what-we-offer (Marina Harbor).

**V0095** · `not triaged` · ALL SITES — Aftercare slug has 6 distinct variants across 9 sites (count corrected from 7): /treatment/aftercare (4 sites), /treatment/aftercare-planning, /treatment/aftercare-beyond, /treatment-services/aftercare-planning, /programs/aftercare-and-alumni, /aftercare. THREE SITES HAVE NO AFTERCARE PAGE AT ALL - Wellness NJ, QHG parent, Greater Texas -

**V0096** · `not triaged` · ALL SITES — Verify-insurance slug has 4 variants and is ABSENT ON 5 SITES (count corrected from 7): Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth. Dallas was wrongly listed as missing in the original row - dallas-detox-center.vercel.app/verify-insurance returns HTTP 200, and its actual defect is covered by V0017. Only 3 sites use the p

**V0098** · `not triaged` · ALL SITES — Contact slug differs: /contact (8 sites), /contact-us (Dallas, Fort Worth), /contact-location (Marina Harbor), absent on Greater Texas.

**V0101** · `not triaged` · ALL SITES — Blog URL pattern differs 4 ways: /blog/slug (6 sites), root-level /slug (Des Moines, Hillside, Seaside, Wellness LA), dated /YYYY/MM/DD/slug (Dallas, Marina Harbor), /about/blog (Seaside index).

#### What each one actually means for this site

| Row | Marina Harbor action |
|---|---|
| **V0124** `CRITICAL` | `marinaharbordetox.com/2026/07/17/codeine-cough-syrup/` is live on production and **absent from the build** — confirmed missing from `content/posts/`. This is *recent* content (17 Jul 2026), separate from V0123's three 2021 posts. **Marina Harbor is missing 4 pages, not 3.** |
| **V0109** `CRITICAL` | Positive mention — Marina Harbor is cited as the **correct canonical pattern to copy**. Its canonicals are right; the open question is only the trailing slash (see repo audit). |
| **V0091** | The QHG parent locations page carries no outbound link to `marinaharbordetox.com`, so the parent passes this site no authority. Parent-side fix. |
| **V0128** `HIGH` | Parent renames `/locations/marina` → `/locations/marina-harbor-detox`; needs a redirect in the parent cutover map. |
| **V0094** | Treatment hub slug: Marina Harbor uses `/what-we-offer`, 8 sites use `/treatment`. |
| **V0095** | Aftercare slug: Marina Harbor has `/aftercare` at root — one of 6 variants. |
| **V0096** | No verify-insurance page; Marina Harbor is one of the 5 sites missing it. |
| **V0098** | Contact slug: `/contact-location` vs `/contact` on 8 sites. |
| **V0101** | Blog URL pattern: dated `/YYYY/MM/DD/slug`. **But see the correction below.** |
| **V0118** | Unresolved contradiction — V0052 closes Marina Harbor geo-slugs as by-design while V0072 flags the same pattern on Des Moines as a defect. |

> **Correction to V0101's verification note.** It states *"Marina Harbor: 69 posts dated plus 1 at /blog/slug"* and warns that a bulk rename would miss the straggler. **There is no straggler.** Measured in this repo: **69 posts, all 69 on dated paths, zero under `/blog/`.** The `+1` is almost certainly the `/blog` index route being counted as a post — the same note already spots that the Fix miscites `/blog` as a dated post path. Laguna may genuinely be mixed; Marina Harbor is not.

---

## 3. Repo audit — source-level

Build is healthy: 124 static routes, 0 type/lint errors, 105 kB shared JS, 0 broken internal links, exactly one `<h1>` per page, 0 missing `alt`. Everything below is content or configuration.

### Fixed 2026-08-04 (uncommitted)

- Single canonical phone number sitewide. 138 body-copy occurrences normalised to `1-866-525-3026` across 32 files (10 genuinely wrong, 128 format variants). Verified 1,663 phone strings and 1,407 `tel:` links, all canonical.
- Added `foundingDate: 2021` to JSON-LD, a Google review CTA, normalised the street address.

> ⚠️ **Conflicts with V0048 / V0049 above, both `BLOCKED`.** Those rows cover the two numbers removed (866-932-3206, 415-868-3858) and say confirm with admissions first. Nothing is committed.

### P0 — legal, safety, trust

| Issue | Location |
|---|---|
| Privacy policy is Yelp's ToS find-replaced (blocks 1–25). Zero cookie disclosure despite the consent banner + GA4/Ads/Meta Pixel; no CCPA/CPRA, no Do Not Sell. Blocks 26+ are a genuine HIPAA NPP. | `content/pages/privacy-policy.json` |
| Competitor named in the wrong city as an H2: "Laguna View Detox … Laguna Beach" | `content/pages/first-responders.json:105` |
| Location claims: "located in Santa Cruz"; ~7 pages say "in Marin County"; dual-diagnosis meta advertises "Orange County"; Santa Barbara (~330 mi) marketed as local | multiple |
| YMYL medical errors: opioid withdrawal has "no immediate health concerns"; benzo bullet list is a stimulant list omitting seizures; alcohol called "like other benzos"; seizures/hallucinations listed as opioid withdrawal; "NAD is an enzyme" | 5 files |
| GA4 + Meta Pixel send `page_location` for substance-specific URLs; lead API logs full PII, no rate limit | `Analytics.tsx`, `api/lead/route.ts:104` |
| Unverified accreditation — "Joint Commission Accredited" + LegitScript/NAMI logos, all unlinked | `src/app/page.tsx:94` |

### P1 — correctness, performance, accessibility

| Issue | Location |
|---|---|
| Four source JPEGs are 25–27 MB each (up to 8688×5792), ~109 MB of 156 MB, used as hero+og on `/men`, `/professionals`, `/young-adults` and two posts | `public/media/2023/08/` |
| FAQ page has 30 answers and no questions, plus raw staff notes as public copy | `content/pages/faq.json` |
| Brand/city misspellings across 20 files ("Mariana Harbor" ×17, "San Franciso" ×4, …) | content |
| Canonical emits a trailing slash, sitemap does not | `src/app/[...slug]/page.tsx:23` |
| No skip link; closed mobile drawer keeps ~45 focusable links below `xl`; no focus trap/Escape; LeadForm has no `aria-invalid`/live regions; 23 pages skip a heading level | `Header.tsx:148`, `LeadForm.tsx` |
| No TCPA/SMS consent line on either form intent | `src/components/LeadForm.tsx` |
| Trustindex loader + Google Maps iframe bypass the cookie consent choice | `Reviews.tsx`, `ContentPage.tsx` |
| Analytics fires only on hard load — no `usePathname`, client navigations uncounted | `Analytics.tsx` |

### P2 — polish

- `leadImage()` returns the company logo as hero + og:image on 13 pages (**includes `/about/gus-saadeh`** — see 1.2)
- 17 meta descriptions exceed 160 chars (worst 408, 362, 257)
- `wpengine` renders as a visible byline bullet on 7 pages; "Medically Reviewed By: R.Hanaumi, LCSW" as a stray bullet
- Only `MedicalBusiness` JSON-LD — no BreadcrumbList/BlogPosting/FAQPage
- `not-found.tsx` drops Header and Footer
- No CSP or security headers in `next.config.mjs`
- Homepage `blogPosts` hardcoded in `site.ts`, will drift from `/blog`
- Footer copyright year evaluated at build time, freezes until redeploy

---

## 4. Open questions

| Question | Why it matters |
|---|---|
| Are 866-932-3206 and 415-868-3858 live? | Gates whether the phone consolidation ships or reverts (V0048/V0049) |
| Is Jack Terwelp still CEO? | Named quote on `/care-providers`; doc says Nicholas Petrillo |
| Who is Kris Brace, CADC II? | Blog author byline, absent from the bios roster |
| Est. 2021 vs "15+ Years of clinical expertise" | Homepage stat tile reads as facility age |
| Business record lists SUD only (MH blank) | Site markets dual diagnosis and mental health treatment |
| Is the Joint Commission / LegitScript accreditation current? | Claimed in the hero, unlinked and unverified |
| Should CA leadership (Hanaumi, McArthur, Olivares, Cameron) appear on facility sites? | Four full bios exist; none are published anywhere |
| Is Shawn Young in scope for Marina Harbor? | His bio says *Southern* California; Marina Harbor is NorCal |

---

## 5. Coverage — what was searched

So this can be audited rather than trusted.

| Source | Coverage |
|---|---|
| Bios doc | All 840 lines read. All 22 sections mapped; Marina Harbor is touched by 4 of them. |
| Workbook — Build Issues | All 102 rows scanned for `marina.harbor|marinaharbordetox` across Issue, Location and Fix. 7 filed here + 10 elsewhere naming it. |
| Workbook — Broken Links | All 29 rows. **0 for Marina Harbor** (Dallas 16, Fort Worth 13 only). |
| Workbook — Visual Issues | All 1,385 rows. **0 for Marina Harbor** — this site has had no visual QA pass. |
| Workbook — Verification Log | All 74 rows. 6 of the 7 MH rows have evidence; **V0123 has none** (it is a NEW row). 17 further entries mention Marina Harbor. |
| Repo | `content/` (47 pages + 69 posts), `src/`, built HTML for all 118 pages. |

