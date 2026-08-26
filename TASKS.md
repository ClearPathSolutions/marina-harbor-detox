# Execution Plan

Actionable tasks derived from every issue in [issue.md](issue.md) (Marina Harbor) and
[issues.md](issues.md) (12-site portfolio).

**ID scheme**

| Prefix | Scope | Executable here? |
|---|---|---|
| `D-##` | Decision needed from a human — blocks other tasks | No — needs an answer |
| `MH-##` | Marina Harbor, this repo | **Yes** |
| `PF-##` | Portfolio — the other 11 sites | No — ticket for that site's owner |

**Every task carries:** what it traces to, files, concrete steps, and an acceptance check you can run.
Effort is one engineer: `S` <1h · `M` half-day · `L` 1–3 days · `XL` >3 days or needs another function.

**Order:** Phase 0 first (it unblocks everything and costs only email). Phases 1→4 are Marina Harbor in
dependency order. Phase 5 runs in parallel, owned elsewhere.

---

## Status — verified 2026-08-05

Build green at **125 routes**. Verification was empirical, not by inspection: a headless-Chrome probe
confirmed the analytics redaction, a live `POST /api/lead` exercised every failure path, and an
overflow sweep covered 4 viewports × 8 pages.

**26 of 37 Marina Harbor tasks are done.** Everything still open is blocked on a human decision
(`D-1`…`D-8`) or on the portfolio-wide `MH-35`.

| | Tasks |
|---|---|
| ✅ **Done** | MH-02, 03, 05, 06, 08, 09, 10, 13, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34 |
| 📝 **Deferred to a named owner** | **MH-01** counsel (`MH-01-counsel-brief.md`) · **MH-04** clinician (`MH-04-clinical-review.md`) · **MH-26** folded into the counsel brief, item 4 |
| ⛔ **Blocked on a decision** | **MH-07**←D-4 · **MH-11** needs bio+headshot · **MH-12**←D-5 · **MH-14**←D-2 · **MH-15**←D-3 · **MH-18** part-done, see below · **MH-36**←MH-35 · **MH-37**←D-8 |
| ⬜ **Open** | **MH-35** trailing-slash convention — a portfolio decision nobody has made |
| 🌍 **Portfolio** | PF-01…PF-13 all open, owned by the other sites |

**Notes on specific outcomes**

- **MH-22** was superseded. Rather than downsampling the four 26–28 MB JPEGs, the whole image library
  was replaced with 57 client-approved photos. `public/` went **159 MB → 21 MB**, and all 64 image
  references in the built output resolve — zero broken. `leadImage()` now resolves only from the
  approved set, with two real staff headshots as documented exceptions.
- **MH-08** was absorbed by that swap: the `carlaheadshot` reference (a different employee's photo on
  Gus Saadeh's page) is gone.
- **MH-18** — investigation complete (`MH-18-missing-pages-findings.md`). The three 2021 posts **are**
  the junk duplicates removed during migration, so the action is *redirect*, not port. The
  `/2026/07/17/codeine-cough-syrup/` post is still unported and blocked on D-8. Redirects belong to MH-36.
- **MH-21** was fixed on 2026-08-05 despite being listed as blocked by MH-35. Justification: the
  canonical was emitting `/about/`, which this build 308-redirects — a canonical pointing at a redirect,
  the exact defect V0067 flags on Laguna. Stripping it makes the tag self-referential and agrees with
  `sitemap.ts`. This does **not** pre-empt MH-35: if the portfolio chooses trailing slashes, set
  `trailingSlash: true` in `next.config.mjs` and canonical, `og:url` and sitemap all follow from the
  same pathname.
- **MH-06** was hardened on 2026-08-05. `fetch` resolves normally on a 4xx/5xx, so a revoked webhook or
  a bad `RESEND_API_KEY` was being reported to the visitor as success and the lead lost. Each channel
  is now attempted independently and the request succeeds if **any** delivers — failing the whole
  submission because the second channel errored would tell someone their request did not go through
  when it did. Verified live: bad webhook → `502` with the phone number, and no PII in the logs.

---

## Phase 0 — Decisions (no code, unblocks the rest)

These are all "ask someone and write down the answer." None take more than a conversation, and eight
downstream tasks are blocked until they land.

### D-1 · Confirm which phone numbers are live · `BLOCKED` · S
**Traces to:** V0048, V0049 · **Blocks:** MH-08 (already-done work may need reverting)

Two numbers were removed from this repo on 2026-08-04 per the business record. The audit marks both
`BLOCKED` pending admissions sign-off.

| Number | Claim | Evidence against removing |
|---|---|---|
| `866-932-3206` | Laguna's number appearing on the MH homepage | On production too — may be a deliberate shared/overflow line |
| `415-868-3858` | "unverified third number" | Area code matches SF; anchor on production is literally "Call Now Button" (the WP plugin), so it is a configured mobile click-to-call line, live in two places |

**Ask admissions:** is either number routing calls today? If yes, does it need to stay on the website?

**Outcome → action:**
- Both dead → keep current state, close V0048/V0049.
- `415` is live → restore it as the mobile click-to-call number; keep the 866 consolidation.
- `866-932-3206` is a shared intake line → restore and document why, so no future audit strips it.

**Acceptance:** answer recorded in this file; V0048/V0049 moved off `BLOCKED`.

---

### D-2 · Is Jack Terwelp still CEO? · S
**Traces to:** issue.md §1.4 · **Blocks:** MH-14

`/care-providers` attributes a testimonial to "– Jack Terwelp, CEO". The bios doc names **Nicholas
Petrillo** as CEO and does not mention Terwelp at all.

**Ask:** was Terwelp a former CEO (quote is historical), or is the attribution wrong?
**Outcome → action:** keep with a date, re-attribute, or remove the quote.

---

### D-3 · Who is Kris Brace, CADC II? · S
**Traces to:** issue.md §1.5 · **Blocks:** MH-15

Credited as author on all three homepage posts; absent from the bios doc. Meanwhile `ContentPage.tsx`
hardcodes a different byline ("Marina Harbor Detox Clinical Team") on every post.

**Ask:** current staff, former staff, or an agency pen-name?
**Outcome → action:** add to roster with a bio page, or reassign posts to a named clinician on staff.

---

### D-4 · Verify Joint Commission and LegitScript · COMPLIANCE · M
**Traces to:** MH repo P0-6, V0070 · **Blocks:** MH-07

The homepage hero claims "Joint Commission Accredited" and the accreditation strip shows Joint
Commission / LegitScript / NAMI logos, all unlinked. The FAQ separately says "Joint Comission/IMS
certified" (sic). Across the portfolio, Des Moines' production LegitScript seal verifies
`californiahorizon.com` — a different domain — so this needs checking, not assuming.

**Ask compliance:** are these current, held for `marinaharbordetox.com`, and what are the verification URLs?
**Why it matters:** unsubstantiated certification claims affect Google Ads eligibility in addiction
treatment, not just trust.

---

### D-5 · Do CA leadership bios belong on facility sites? · S
**Traces to:** issue.md §1.1 · **Blocks:** MH-12

Four full bios exist and are published nowhere: Riky Hanaumi (Clinical Director CA), Michael McArthur
(Nursing Director CA), Monica Olivares (Clinical Supervisor CA), Jacob Cameron (Client Care Director).
Shawn Young's bio says *Southern* California — probably out of scope for a NorCal site; confirm.

**Ask marketing:** facility sites, parent only, or both? Note Hanaumi is *already* named on MH pages as
the reviewing clinician with no bio behind the name.

---

### D-6 · Confirm licensure scope: SUD only, or SUD + MH? · S
**Traces to:** business record (MH column blank)

The business record lists SUD only, but the site markets `/what-we-offer/dual-diagnosis` and a
"mental health treatment San Francisco" post. Confirm what the DHCS licence covers before those pages
take traffic.

---

### D-7 · Settle the "15+ Years" claim · S
**Traces to:** business record (Est. 2021)

`page.tsx` `stats` shows a bare tile "15+ Years of clinical expertise" next to a 2021 founding date.
Body copy elsewhere attributes the 15 years to the *clinicians*, which is defensible; the tile isn't.
**Outcome → action:** reword the tile (e.g. "15+ Years clinical experience on staff") or drop it.

---

### D-8 · Freeze or sync content before cutover · `CRITICAL` · M
**Traces to:** V0124 · **Blocks:** MH-18, MH-37, PF-09

Builds were cut from a ~15–16 July 2026 snapshot; production kept publishing. 15 pages portfolio-wide
are already missing and the gap grows daily.

**Decide:** pause publishing to production until cutover, **or** establish a re-sync step. Without one,
every new post is lost at launch.

---

## Phase 1 — Marina Harbor: legal & safety

Do not launch with any of these open.

### MH-01 · Replace the privacy policy · `P0` · XL
**Traces to:** repo P0-1

Blocks 1–25 of `content/pages/privacy-policy.json` are **Yelp's Terms of Service, find-replaced** —
they reference "compliments or friend requests", "writing a fake review", and "Marina Harbor Detox
Deals & Gift Certificates", and grant the company rights to commercialize "Your Content". Blocks 26+
*are* a legitimate HHS-model HIPAA notice and can stay.

Missing entirely: any actual website privacy policy. The word "cookie" appears **zero** times despite a
live consent banner and GA4 / Google Ads / Meta Pixel. No CCPA/CPRA section, no "Do Not Sell or Share".
It also contradicts the lead form's promise that data is "never sold or shared".

**Files:** `content/pages/privacy-policy.json`

**Steps**
1. Send counsel: current file, `Analytics.tsx` (what tags fire), `api/lead/route.ts` (what's collected/stored), and the cookie banner copy.
2. Get back: website privacy policy + cookie disclosure + CCPA/CPRA rights + Do Not Sell/Share.
3. Replace blocks 1–25. **Keep blocks 26+** (the HIPAA NPP) — verify counsel is happy with them.
4. Fix the `"Offi e for Civil Rights"` typo (dropped character) in the retained section.
5. Add a "Do Not Sell or Share My Personal Information" link to the footer.

**Acceptance**
```bash
grep -ci "cookie" content/pages/privacy-policy.json          # > 0
grep -ci "friend requests\|fake review\|Gift Certificate" …  # == 0
grep -ci "CCPA\|CPRA\|Do Not Sell" content/pages/privacy-policy.json  # > 0
```
Legal sign-off recorded. **Effort:** XL (external dependency — start it first).

---

### MH-02 · Remove the competitor name · `P0` · S
**Traces to:** repo P0-2

`content/pages/first-responders.json:105` is an H2 reading
**"Laguna View Detox Offers First Responders Rehab Programs in Laguna Beach"** — a sister facility's
brand, in the wrong city, on a Marina Harbor page.

**Steps:** rewrite to "Marina Harbor Detox Offers First Responders Rehab Programs in San Francisco".
Then check the rest of that page for other Laguna-derived copy (it was likely cloned).

**Acceptance:** `grep -ri "laguna" content/pages/first-responders.json` → no hits. Build passes.

---

### MH-03 · Correct the location claims · `P0` · M
**Traces to:** repo P0-3

The facility is at 289 Marina Blvd, San Francisco.

| Claim | Where | Fix |
|---|---|---|
| "located in Santa Cruz, California" | `santa-cruz.json:101` | Rewrite — MH serves Santa Cruz, isn't in it |
| "Marina Harbor Detox in Marin County" | ~7 drug pages (`meth-detox`, `benzodiazepines-detox`, `drug-detox`, `fentanyl-detox`, `heroin-detox`, `cocaine-detox`, `prescription-drugs-detox`) | Change to "in San Francisco" |
| "Dual diagnosis treatment in **Orange County**" | `what-we-offer_dual-diagnosis.json:7` metaDescription | Rewrite to San Francisco |
| Santa Barbara marketed as local (~330 mi) | `santa-barbara.json` | Add a distance disclosure — copy the pattern already used on `san-luis-obispo.json` |

Note `drug-rehab-marin-county.json` is a legitimate service-area page — keep "Marin County" there, just
don't claim the facility is *located* in Marin.

**Acceptance**
```bash
grep -ri "located in Santa Cruz\|Detox in Marin County\|Orange County" content/ # == 0
```

---

### MH-04 · Clinical accuracy review · `P0` · L
**Traces to:** repo P0-4 · **Owner:** a clinician, not an engineer

Five errors on a YMYL site. A clinician must sign off on the replacement wording; engineering only
applies it.

| Error | File |
|---|---|
| "Unlike other substances, there is **no immediate health concerns**" for opioid withdrawal | `what-we-offer_heroin-detox.json:145` |
| Benzo withdrawal bullet list is a **stimulant** list (increased appetite, vivid dreams) and omits seizures; intro says "seizures, hallucinations, and hallucinations" | `what-we-offer_drug-detox.json` |
| Alcohol described as "**like other benzos**" | `2023_09_22_benadryl-and-alcohol.json` |
| Seizures + hallucinations listed as **opioid** withdrawal symptoms | `2022_04_15_opioid-detox-timeline.json` |
| "NAD is an **enzyme**" (it is a coenzyme) | `2021_11_19_nad-therapy-explained.json:25` |

**Steps**
1. Package the five passages with surrounding context; send for review.
2. Apply returned wording verbatim.
3. Add a reviewer byline to each corrected page (see MH-13).

**Acceptance:** clinician sign-off recorded per page; corrected text in the JSON; build passes.

---

### MH-05 · Stop sending clinical URLs to ad platforms · `P0` · M
**Traces to:** repo P0-5

GA4 and Meta Pixel transmit `page_location` for substance-specific URLs (`/what-we-offer/heroin-detox`,
`/fentanyl-detox`, …). This is the healthcare-pixel pattern behind ongoing litigation. Blanket cookie
consent is **not** HIPAA authorization.

**Files:** `src/components/Analytics.tsx`

**Steps**
1. Define the clinical route set: everything under `/what-we-offer/`, plus `/fentanyl-detox`, `/dual-diagnosis`, and any page naming a substance.
2. On those routes, either suppress the tags entirely or send a redacted `page_location` (path replaced with a generic token) and set `page_title` to a non-clinical constant.
3. Verify no substance term reaches the network layer.

**Acceptance:** with tag IDs set, load `/what-we-offer/heroin-detox` and confirm no outbound request
to `google-analytics.com` or `facebook.com` contains "heroin". Document the approach in the file header.

---

### MH-06 · Stop logging PII; add rate limiting · `P0` · M
**Traces to:** repo P0-5

`src/app/api/lead/route.ts:104` writes the full lead — name, phone, email, free-text message — to
server logs whenever no delivery method is configured, which is the default. On Vercel those logs
persist and are broadly readable. The endpoint also has no rate limit.

**Steps**
1. Replace the `console.info` payload with a non-identifying record: intent, timestamp, and a boolean for each field's presence.
2. If no delivery is configured, return an error surfacing the phone number rather than silently accepting and dropping the lead.
3. Add rate limiting keyed on IP — e.g. 5 requests / 10 min — returning 429.
4. Confirm `LEAD_WEBHOOK_URL` / Resend are actually configured before launch.

**Acceptance:** submit a lead with no env vars set → logs contain no name/phone/email/message. Sixth
rapid submission returns 429.

---

### MH-07 · Substantiate or remove accreditation claims · `P0` · S
**Traces to:** repo P0-6, V0070 · **Blocked by:** D-4

**Steps**
- Verified → link each badge to its verification record; link the hero claim too.
- Not verified → remove the hero text, the badge, and the FAQ line.
- Either way fix "Joint **Comission**/IMS certified" in `faq.json`.

**Acceptance:** every accreditation claim either links to a verification URL or is gone.

---

## Phase 2 — Marina Harbor: content & data integrity

### MH-08 · Fix Gus Saadeh's headshot · S
**Traces to:** issue.md §1.2, V0050

`content/pages/about_gus-saadeh.json` has
`ogImage: .../2021/08/carlaheadshot-1_orig-1024x576-1.jpg` — **another person's headshot**. It resolves
to nothing, so `leadImage()` falls through and renders **the company logo** as hero and og:image on a
named staff page. His real photo is already in the repo, unused: `public/media/2026/02/IMG_2660.jpg`.

**Steps:** set `ogImage` to `https://marinaharbordetox.com/wp-content/uploads/2026/02/IMG_2660.jpg`
(the manifest maps it to `/media/2026/02/IMG_2660.jpg`).

**Acceptance**
```bash
grep -c carlaheadshot content/pages/about_gus-saadeh.json   # == 0
```
`/about/gus-saadeh` renders his photo, not the logo. **This also removes one of MH-19's 13 pages.**

---

### MH-09 · Standardise Gus's job title · S
**Traces to:** issue.md §1.3

Doc says **Director of Operations**. Site says "Operations Director" in `site.ts:65` and the page h3,
but "Director of Operations" in body copy and metaDescription.

**Files:** `src/lib/site.ts:65`, `content/pages/about_gus-saadeh.json` (h3, title, metaDescription)
**Acceptance:** one spelling sitewide, matching the doc.

---

### MH-10 · Publish Ashley Hurtado, AMFT · M
**Traces to:** issue.md §1.1

Therapist at Marina Harbor. **The full five-paragraph bio is already written** in the doc — this is a
transcription task, not an authoring one.

**Steps**
1. Create `content/pages/about_ashley-hurtado.json` mirroring the `about_alicia-joslin.json` shape:
   `url` → `https://marinaharbordetox.com/about/ashley-hurtado/`, `type: "page"`, `h1: "Ashley Hurtado"`,
   `title: "Ashley Hurtado, AMFT - Therapist"`, blocks = `h3` title + `h2 "More About Ashley"` + 5 `p` blocks.
2. Write a metaDescription under 160 chars.
3. Request a headshot; until then omit `ogImage` rather than letting it fall through to the logo (see MH-19).
4. Add to `nav` in `src/lib/site.ts` under About.

**Acceptance:** `/about/ashley-hurtado` builds and renders; route count 124 → 125.

---

### MH-11 · Publish Ashley Ruiz · M · *needs content*
**Traces to:** issue.md §1.1

Nursing Supervisor (Marina Harbor & Cali lead). The doc flags **both bio and headshot as outstanding** —
this one is blocked on content, unlike MH-10.

**Steps:** request bio + headshot; then follow MH-10's steps.

---

### MH-12 · Build a real team hub · M
**Traces to:** issue.md §1.6 · **Blocked by:** D-5

`/care-providers` is a referral-partner page, not a team index — verified: **zero** links to either bio
inside `<main>`; the two occurrences on that page are the global nav. So the bios are reachable only
from the header dropdown.

**Steps**
1. Create `/about/team` listing Joslin, Saadeh, Hurtado, Ruiz — photo, name, title, excerpt, link.
2. Add to nav; link from `/about`.
3. Per D-5, decide whether CA leadership appears here.
4. Give the parent site this URL to link to instead of republishing bios (closes the MH half of V0050).

**Acceptance:** `/about/team` links all bios from inside `<main>`; re-run the `<main>` link count that
disproved V0051 and confirm it now passes for the real hub.

---

### MH-13 · Fix the medical reviewer byline · M
**Traces to:** issue.md §1.7, §1.8

Exactly **one page in 118** names a reviewing clinician, and it renders as a stray bullet:
`what-we-offer_drug-rehab-marin-county.json` → `[li] "Medically Reviewed By: R.Hanaumi, LCSW"`. That is
Erika "Riky" Hanaumi, LCSW, Clinical Director for QHG's California facilities — she has a full bio in
the doc. `isNoise` (`ContentPage.tsx:27`) filters `CADC|LMFT|CADC II|, MD$` but **not `LCSW`**.

Six more pages have `Last Updated …` rendering as bullets for the same reason.

**Steps**
1. Add a first-class reviewer/updated concept: parse `Medically Reviewed By:` and `Last Updated` out of the block stream in `ContentPage.tsx` and render them as a byline under the h1, not as list items.
2. Link the reviewer name to her bio page once it exists (D-5 / MH-12).
3. Extend the reviewer byline to the pages corrected in MH-04 — clinical pages should name a reviewer.
4. Add `BlogPosting`/`MedicalWebPage` JSON-LD carrying `reviewedBy` (folds into MH-30).

**Acceptance:** no `<li>` in the built HTML begins "Medically Reviewed By" or "Last Updated"; the byline
appears under the h1 on all 7 affected pages.

---

### MH-14 · Resolve the CEO quote · S
**Traces to:** issue.md §1.4 · **Blocked by:** D-2
**Files:** `content/pages/care-providers.json`

---

### MH-15 · Resolve blog authorship · M
**Traces to:** issue.md §1.5 · **Blocked by:** D-3

Two competing bylines: `site.ts` credits "Kris Brace, CADC II"; `ContentPage.tsx` hardcodes "Marina
Harbor Detox Clinical Team" on every post.

**Steps:** pick one per D-3; remove the hardcoded string; if a named author, add a bio page and link the
byline; add `author` to post JSON-LD (MH-30).

**Acceptance:** one byline per post, resolving to a real person or an explicit editorial entity.

---

### MH-16 · Fix misspellings sitewide · M
**Traces to:** repo P1-3, issue.md §1.8

| Wrong | Count | Right |
|---|---|---|
| Mariana Harbor | 17 | Marina Harbor |
| Marnia Harbor | 7 | Marina Harbor |
| Marina Habor | 4 | Marina Harbor |
| Marianna Harbor | 1 | Marina Harbor |
| San Franciso | 4 | San Francisco |
| San Fransico | 3 | San Francisco |
| San Fransisco | 1 | San Francisco |
| Marin County **Adiction** Treatment | 1 | Addiction |
| Joint **Comission** | 1 | Commission |

Across 20 files. Script it like the phone normalisation: regex replace, `json.loads` to validate, write.

**Acceptance:** all patterns return zero; build passes; 124 routes.

---

### MH-17 · Reconstruct the FAQ · L
**Traces to:** repo P1-2

`content/pages/faq.json` has **30 answers and no questions** — the extractor lost them. It also ships raw
staff notes as public copy: "Presence in treatment letter, attend via zoom", "Groups 4x per week + 1:1
session weekly", "Aetna, beacon, UMR, Anthem".

**Steps**
1. Recover questions from `archive/raw-html/faq.html`, or from production `marinaharbordetox.com/faq/`.
2. Rebuild as `h3` question + `p` answer pairs.
3. Rewrite the three staff-note fragments into real answers or drop them.
4. Then render as an accordion and add `FAQPage` JSON-LD (MH-30).

**Acceptance:** every answer has a question; no internal shorthand in the copy.

---

### MH-18 · Recover 4 missing pages · M
**Traces to:** V0123, V0124 · **Blocked by:** D-8

Live on production, 404 on the build:

| URL | Age | Source |
|---|---|---|
| `/2026/07/17/codeine-cough-syrup/` | **recent** (17 Jul 2026) | V0124 — post-snapshot |
| `/2021/08/26/depression-anxiety-and-substance/` | 2021 | V0123 — dropped in migration |
| `/2021/08/26/marina-harbor-detox/` | 2021 | V0123 |
| `/2021/08/26/the-importance-of-in-person-addiction/` | 2021 | V0123 |

The codeine post is a different problem from the other three: it postdates the build snapshot, so it's
D-8's content-freeze issue, not a migration drop.

**Steps**
1. Port the codeine post — it's current content and should not be lost.
2. For the three 2021 posts, decide per post: port at the same dated path, or 301 to the nearest live page. **Do not leave unmapped.** Note earlier migration work deliberately removed three junk 2021-08-26 duplicates — confirm these aren't the same ones before porting.
3. Record the decision per URL.

**Acceptance:** each of the 4 URLs either resolves 200 on the build or has a redirect entry.

---

### MH-19 · Stop using the logo as hero/og:image · M
**Traces to:** repo P2

`leadImage()` returns `marina-final-logo.png` on **13 pages**: `about_gus-saadeh` (fixed by MH-08),
`contact-location`, `faq`, `privacy-policy`, `thank-you`, and 8 posts.

**Files:** `src/lib/content.ts:74`

**Steps**
1. In `leadImage()`, skip candidates matching `/logo|badge|seal|favicon|icon|font/i`.
2. Return `null` when nothing suitable resolves — let the page render without a hero rather than with a logo.
3. Add a site-level OG fallback in metadata (the facility photo already used in `layout.tsx`) so social cards still work.

**Acceptance:** re-run the logo-as-hero check → 0 pages. No page renders the logo as a hero image.

---

### MH-20 · Trim meta descriptions · S
**Traces to:** repo P2

17 exceed 160 chars; worst are 408, 362 and 257.
**Acceptance:** all ≤ 160; none duplicated.

---

## Phase 3 — Marina Harbor: code, accessibility, performance

### MH-21 · Fix the canonical/sitemap disagreement · S
**Traces to:** repo P1-4, V0053

`src/app/[...slug]/page.tsx:23` emits `…/about/` (trailing slash, confirmed in built HTML) while
`sitemap.ts` emits `…/about`. Two different signals for the same page.

**Fix:** `const canonicalPath = new URL(doc.url).pathname.replace(/\/$/, "") || "/";`

**Careful — coordinate with MH-35.** V0102 says all 12 *production* sites are slash-canonical while the
previews are slashless. If the portfolio standardises on trailing slashes, the sitemap should change
instead. Do MH-35's decision first, then make both ends agree.

Also fix V0053: 2 of 118 pages emit `og:url` pointing at the domain root.

**Acceptance:** canonical, `og:url` and sitemap agree for every route.

---

### MH-22 · Downsample four enormous images · S — *highest effort:impact ratio here*
**Traces to:** repo P1-1

| File | Dimensions | Size | Used by |
|---|---|---|---|
| `shutterstock_1483265618-1.jpg` | 7952×5304 | **28.5 MB** | `/men`, `why-heroin-withdrawal-is-so-difficult` |
| `shutterstock_1712082700.jpg` | 7952×5304 | **28.2 MB** | `/professionals` |
| `shutterstock_1712082700-1.jpg` | 7952×5304 | **28.2 MB** | `prescription-drug-withdrawal-timeline` |
| `shutterstock_572935282.jpg` | 8688×5792 | **26.5 MB** | `/young-adults` |

111 MB of a 156 MB media directory. Vercel's optimizer must decode a 28 MB JPEG on every cold hit —
real timeout and cost exposure.

**Steps**
1. `sharp` each to max 2560px on the long edge, quality ~82, same filenames.
2. Note `shutterstock_1712082700.jpg` and `-1.jpg` are duplicates — dedupe to one and repoint.
3. Re-run the build.

**Acceptance:** no file in `public/media` exceeds ~1.5 MB; `du -sh public/media` drops ~110 MB; the five
pages still render their images.

---

### MH-23 · Add a skip link · S
**Traces to:** repo P1-5. There is none. Add a visually-hidden, focus-visible "Skip to content" as the
first focusable element; give `<main>` an `id`.

---

### MH-24 · Fix the mobile drawer · M
**Traces to:** repo P1-5

`Header.tsx:148` — when closed the drawer is only `translate-x-full`, not `inert`/`hidden`, so below
`xl` keyboard users tab through ~45 invisible links. No focus trap, no Escape handler, no return-focus.

**Steps:** add `inert` (or `hidden`) when closed; trap focus while open; Escape closes; return focus to
the toggle; keep `aria-modal`.

**Acceptance:** with the drawer closed at 1024px, tabbing never enters it. Open → focus moves in, Escape
closes, focus returns to the button.

---

### MH-25 · LeadForm accessibility · S
**Traces to:** repo P1-5

Add `aria-invalid` + `aria-describedby` on errored fields, `role="alert"` on messages, and `role="status"`
on the success state (it currently replaces the form silently). Move focus to the first error on failure.

---

### MH-26 · Add TCPA/SMS consent · S
**Traces to:** repo P1-6 · Phone is required and every CTA is `tel:`/`sms:`, with no consent language
anywhere. Add a consent line above the submit button covering autodialed/prerecorded calls and texts,
message rates, and opt-out. Store consent text + timestamp with the lead. **Get the wording from counsel
alongside MH-01.**

---

### MH-27 · Consent-gate third-party scripts · M
**Traces to:** repo P1-7

`Reviews.tsx` injects `cdn.trustindex.io/loader.js` unconditionally in a `useEffect`, and
`ContentPage.tsx` embeds a Google Maps iframe — neither honours a Decline.

**Steps:** read `mhd-consent` before injecting Trustindex; render a click-to-load placeholder for the map
until consent; re-check on consent change.

**Acceptance:** with consent declined, no request to `trustindex.io` or `google.com/maps`.

---

### MH-28 · Track client-side navigations · S
**Traces to:** repo P1-8 · `Analytics.tsx` fires a pageview only on hard load — no `usePathname`, so App
Router client navigations are never counted. Add a `usePathname`/`useSearchParams` effect firing
`page_view` / `PageView` on change — **respecting MH-05's clinical-route exclusions.**

---

### MH-29 · Fix heading order · M
**Traces to:** repo P1-5 · 23 pages skip a level, mostly h1→h3, because `buildSections` splits at h2 but
source copy starts at h3. Demote/promote in `buildSections` so levels never skip.
**Acceptance:** re-run the heading-order check → 0 skips.

---

### MH-30 · Expand structured data · M
**Traces to:** repo P2 · Only `MedicalBusiness` exists, though the site renders breadcrumbs, posts and an
FAQ. Add `BreadcrumbList` (all inner pages), `BlogPosting` with `author` + `reviewedBy` (posts),
`FAQPage` (after MH-17), `Person` (bio pages).
**Acceptance:** all types validate in Google's Rich Results Test.

---

### MH-31 · Add security headers · S
**Traces to:** repo P2 · None in `next.config.mjs`. Add CSP (allowing the analytics/Trustindex/Maps
origins actually used), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Strict-Transport-Security`. Ship CSP in report-only first.

---

### MH-32 · Give the 404 page site chrome · S
**Traces to:** repo P2 · `not-found.tsx` drops Header and Footer — a dead end with no nav.

---

### MH-33 · Derive homepage blog cards from content · S
**Traces to:** repo P2 · `blogPosts` is hardcoded in `site.ts` and will drift from `/blog`. Derive from
`getPosts()` at build time.

---

### MH-34 · Fix the frozen copyright year · S
**Traces to:** repo P2 · `Footer.tsx` uses `new Date().getFullYear()` in a server component, evaluated at
build time — it freezes until redeploy. Render client-side or accept a documented build-time stamp.

---

## Phase 4 — Marina Harbor: cutover

### MH-35 · Settle the trailing-slash convention · `CRITICAL` · M
**Traces to:** V0102 · **Blocks:** MH-21, MH-36

All 12 previews serve slashless and 308-redirect the slash form; all 12 production sites are
slash-canonical and 301 the slashless form. Every inbound link using the production convention hits a
redirect at cutover. This is the largest cutover issue in the portfolio by URL count (1,046).

**Steps:** pick one convention portfolio-wide (production's trailing slash is the lower-risk default
since it preserves existing links); set `trailingSlash` in `next.config.mjs`; align sitemap, canonical
and `og:url`; align the redirect map.

**Acceptance:** for 20 sampled URLs, production form and build form agree with no redirect hop.

---

### MH-36 · Build the redirect map · M
**Traces to:** V0102, V0123, V0124, V0051 · **Blocked by:** MH-35

Marina Harbor's internal link integrity is clean — 0 broken across 1,374 internal URLs — so redirects
are the remaining risk, not broken links.

**Cover:** trailing-slash convention (MH-35); the 4 pages in MH-18; any slug renames if V0051's
standardisation is accepted (note all 6 slugs exist on production with real equity — renaming has a
cost the row doesn't state); the parent's `/locations/marina` → `/locations/marina-harbor-detox` (V0128,
parent-side).

**Acceptance:** every production URL either resolves 200 on the build or has a redirect; zero chains.

---

### MH-37 · Re-run the content diff immediately before cutover · S
**Traces to:** V0124 · **Blocked by:** D-8

The missing-page list is accurate as of 2026-07-28 and **will be stale at launch**.

**Check:** production sitemap `lastmod` ≥ snapshot date → test each URL against the build.
**Acceptance:** run within 24h of cutover; zero unmapped production URLs.

---

### MH-38 · CTM + Clarion attribution · DONE

**Traces to:** the CTM + Clarion attribution rollout spec. Both lead forms (`intent="verify"` on
`/admission`, `intent="contact"` on `/contact-location`) now carry the ad click that produced them.

**What was wrong:** only Fault B. `forms-capture.v1.js` builds its own envelope and reads `utm`/`gclid`
live from `location.search` at submit time, so anyone who read a second page before converting filed as
direct traffic — silently, because the CRM record still looked populated. `wbraid`/`gbraid` were never
collected, so CTM attributed those clicks while Clarion could not.

**Fix:** `lib/attribution.ts` + `components/CampaignCapture.tsx` record first touch and restore it for
exactly the synchronous instant the vendor spends serialising its payload. The parameters are never left
in the URL — our paths name a substance (MH-05) and `t.js`, the Clarion widget and Elfsight all read
`location.href` on every pageview.

**Deliberately NOT done — read this before re-opening:**

| Rollout step | Why it does not apply here |
|---|---|
| Add `api/verify-insurance` server relay | **Q4 passes on this origin.** `OPTIONS /forms/public/submit` with `Origin: https://marinaharbordetox.com` returns `204` + `access-control-allow-origin` for that origin; the POST is not origin-pinned (invalid-key probe → `404` *with* the ACAO header). Spec §1: "Keep the vendor script." §6: "Do not port the server relay to a site where the browser POST works." Preflight now also passes for `desmoinesrecovery.com`, so the CORS/allowlist condition that justified the relay there has been fixed on Clarion's side. |
| Delete `data-clarion-form` | Never present. No form here uses auto-wire — both call `window.ClarionForms.submit()` manually, so there is exactly one Clarion request per submit. Adding a relay *without* removing that call is what would double-send. |
| Rebuild `ctm_visitor_sid` handling | Fault C absent. The vendor already reads `__ctm.config.sid`, hooks `__ctm_loaded` and polls as a fallback. Verified live: `6a8906e5…`, 24 hex, flat, equal to the `__ctmid` cookie. |
| ~~Add `async` to `t.js`~~ — **done, spec §2 is wrong** | Superseded. §2's "load eagerly" guidance breaks the swap outright and was reverted. A sync tag in `<head>` runs before `<body>` exists, and CTM's number scan defaults its root to `document.body` and no-ops on null; on React it also swaps pre-hydration and gets reverted. Measured on the deployed preview with the sync tag: valid 24-hex `config.sid` but `__ctm_tracked_numbers` was `{}` and every `tel:` link still matched the hardcoded number — session created, zero numbers swapped, so calls could not be tied to a session. `async` is now required; do not revert. Count copies with `script[src*="tctm.co/t.js"]` (must be 1), never `script[src*="tctm.co"]`, which returns 2 because `t.js` injects `p.js`. |
| Remove the Clarion key literal | The key is read in the browser by three scripts as `data-site-key`. `NEXT_PUBLIC_CLARION_SITE_KEY` now wins when set, but the literal stays as a fallback — an env-only gate is exactly what took GTM down in production before. |

**Still open:** confirm in CTM that a test submission attaches to the visit and routes to Marina Harbor.
No `200` substitutes for that, and it needs account access. Q4 was proven at the CORS layer, not by a
real submission from the deployed origin.

---

## Phase 5 — Portfolio (the other 11 sites)

Not executable from this repo — tickets for each site's owner. Ordered by blast radius.

### PF-01 · Canonicals — 5 sites · `CRITICAL` · L
**198 indexable pages carry no canonical at all**, competing with live production twins.

| Site | State | Row |
|---|---|---|
| Fort Worth | 55/55 missing | V0039 |
| Wellness NJ | 51/51 missing | V0082 |
| QHG parent | 92/92 missing | V0092 |
| Ocean Coast | 106/107 point at domain root | V0109 |
| Laguna | 43/46 point at redirects | V0067 |
| Hillside | 6/156 missing | V0058 |

⚠️ **Every canonical row in the workbook cites Laguna as the model. Do not.** V0067 shows Laguna is one
of the worst configured. Use Marina Harbor, which V0109 names as the correct pattern.

### PF-02 · og:url template — 7 sites · HIGH · M
Seaside 70/70 (0 correct), Ocean Coast 107/107, QHG 92/92, Wellness NJ 51/51, Wellness LA 36/44,
Greater Texas 11/11, Fort Worth 54/55 (**V0040 — restore this deleted row first**).
V0088 confirms og:url and canonical are **one template bug** — fix with PF-01, not separately.

### PF-03 · Fort Worth is a clone of Dallas · HIGH · L
V0104/V0105/V0106 — 42 of 42 blog slugs identical; body find-and-replaced but slugs and in-body hrefs
left pointing at Dallas patterns, which is the **root cause of all 13 Fort Worth broken links**.
81–84% word-level similarity. Fixing the slugs closes V0024–V0036 too.

### PF-04 · Wrong person's biography · `CRITICAL` · S
V0054 — Hillside `/staff/phillip-carter` publishes Monica Olivares's bio verbatim; pages 97.7%
identical. H1 also misspells "Olivires" vs "Olivares". Escalate above everything else.

### PF-05 · LegitScript · COMPLIANCE · M
V0070 — claimed on 34 Des Moines pages; the production seal verifies **californiahorizon.com**.
Confirm the certification is held for the domain *before* re-adding any seal.

### PF-06 · Greater Texas has no privacy policy · COMPLIANCE · M
V0100 — no privacy page at all on a YMYL healthcare site. (Laguna and Wellness LA are noindex and
correctly excluded — not defects.)

### PF-07 · QHG parent lost its admissions funnel · `CRITICAL` · L
V0127 — 7 production pages 404 on the build, four of them the conversion path. They exist on production,
so this is a port, not authoring. Closes V0096/V0099 and narrows V0095.

### PF-08 · Content freeze / re-sync · `CRITICAL` · M
V0124 — see D-8. Portfolio-wide; 15 pages missing across 10 of 12 sites and growing daily.

### PF-09 · Redirect maps — 331 pairs · HIGH · L
Laguna 182 (V0121), Ocean Coast 92 (V0125), Wellness NJ 37 (V0132), QHG 16 (V0128), Greater Texas 4
(V0135). All flagged migration requirements, not defects.

### PF-10 · Broken internal links · M
29 URLs / 94 source pages / 117 instances — Dallas 16, Fort Worth 13, all other builds clean. 20 are
one-line 301s; 8 need the destination built first; 1 is a `_wp_link_placeholder` needing a copy edit.
**All 29 are NOT YET VERIFIED** — re-test before actioning.

### PF-11 · Visual QA backlog · XL
1,183 real issues across only 5 sites. **7 sites have had no visual QA at all** — Fort Worth, Marina
Harbor, Ocean Coast, Greater Texas, Seaside, Wellness LA, Wellness NJ. Either run the pass or record
the decision not to.

### PF-12 · Do not port Greater Texas's Florida content · S
V0134 — two West Palm Beach / Seaside posts on the Texas domain carrying Seaside's phone number. The
build correctly 404s both. **Unlike every other missing-page row, leave these dropped.**

### PF-13 · Workbook hygiene · M
1. **Restore V0023 and V0040** — deleted from the issue tabs but confirmed live defects (V0023: Dallas copy says "Located in Dallas TX"; the address is Weatherford, ~65 mi west, contradicting its own JSON-LD).
2. Re-stamp the **27 NEW rows** as unverified; run the 3 CRITICAL ones through verification.
3. Update the Legend — it is wrong on six counts (118 vs 131 rows, ID range, verdict counts, tab count).
4. Action V0046's buried note: any row sourced from that `audit2.py` pass needs re-testing.
5. Correct V0051 (`/care-providers` is not a team hub) and V0101 (Marina Harbor is not internally mixed).
6. Resolve V0118 — V0052 and V0072 give opposite verdicts on geo-suffixed slugs.

---

## Suggested sequence

| When | Do |
|---|---|
| **Today** | D-1 … D-8 — all email/conversation, unblocks 8 tasks. Start MH-01 (counsel has the longest lead time). |
| **Week 1** | MH-22 (2h, removes 110 MB), MH-16, MH-08, MH-09, MH-02, MH-03. High impact, low risk, no dependencies. |
| **Week 1–2** | MH-04 out for clinical review. MH-05, MH-06 — the privacy work. |
| **Week 2** | MH-10, MH-13, MH-19, MH-23 … MH-28 — content and a11y. |
| **Week 3** | MH-17, MH-29 … MH-34. MH-35 decision, then MH-21. |
| **Pre-launch** | MH-36, then MH-37 within 24h of cutover. |
| **Parallel** | PF-04 and PF-01 immediately — they're the portfolio's sharpest. PF-13 so the tracker stops losing findings. |

**Cheapest wins:** MH-22 (~2h, −110 MB), MH-08 (one line, fixes a wrong-person image), MH-16 (scripted),
MH-23 (~15 min). **Longest lead:** MH-01 and MH-04 — both need someone outside engineering, so start them first.
