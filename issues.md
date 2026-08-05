# Issues Register — QHG 12-Site Vercel Cutover

Complete issue set extracted from the QHG audit workbook, plus the Marina Harbor
repo audit run in the same session. **Generated, not hand-transcribed** — every row
below comes straight from the workbook.

| | |
|---|---|
| Source workbook | https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8 |
| Audit basis | Crawl of all 12 Vercel previews, 1,046 URLs, 2026-07-27 |
| Verification pass | 2026-07-28 (74 rows re-tested) |
| Extracted | 2026-08-04 |
| Build issues | 102 rows |
| Broken internal links | 29 rows |
| Visual issues | 1385 rows (1183 real, 202 placeholder) |
| Verification log | 74 rows |
| **Total issue IDs** | **131** (V0001–V0135, 4 gaps) |

Regenerate: `curl -sL ".../export?format=xlsx" -o sheet.xlsx && python3 gen_issues.py`

## Contents

1. [Read this first — workbook integrity warnings](#read-this-first)
2. [Cutover blockers](#cutover-blockers)
3. [Build issues by facility](#build-issues-by-facility)
4. [Broken internal links](#broken-internal-links)
5. [Visual issues](#visual-issues)
6. [Verification log — warnings and open actions](#verification-log)
7. [Marina Harbor repo audit](#marina-harbor-repo-audit)

---

<a id="read-this-first"></a>
## 1. Read this first — workbook integrity warnings

Defects found in the workbook itself. Resolve these before trusting its counts.

### 1.1 Four rows were deleted from the issue tabs but remain in the Verification Log

`V0019`, `V0023`, `V0040`, `V0046` have verification evidence but no issue row. **Two are live defects that will otherwise be lost:**

- **V0023 — Dallas Detox Center** (CONFIRMED_AMENDED). Row UNDERSTATES the copy problem and MISSTATES the fix. 1) Understated: the row says the copy "claims proximity to I-35E and Dallas North Tollway". It actually asserts "Located in Dallas TX" outright. That is a direct locality misstatement, not an aggressive proximity claim. 2) New: the JSON-LD says Weatherford while the visible copy says Dallas, so the page contradicts its own structured data. Google reads both. 3) Fix was wrong: it says "Align NAP across the site, production domain and GBP", but NAP is ALREADY aligned across all three surfaces tested. Nothing to align. The real fix is to correct the false locality sentence and settle the brand-versus-location strategy. 4) Distance: I would soften "roughly 90 minutes west" to plain distances, which are not traffic-dependent - Weatherford is roughly 30 miles west of Fort Worth and roughly 65 miles west of Dallas. "Closer to Fort Worth than Dallas" holds comfortably.

- **V0040 — Fort Worth Wellness** (CONFIRMED_AMENDED). Row describes the smaller half of the problem. 42 of 55 pages have NO og:url element at all. So the accurate picture is: 12 wrong, 42 absent, 1 correct. Recommend rewording to cover both, since the absent set is larger than the misdirected set.


`V0019` (duplicate of V0017) and `V0046` (withdrawn, no H1 defect) are legitimate closures — but the Legend
says both should still be present carrying a verdict, and its "ID STABILITY" claim is contradicted by their deletion.

### 1.2 The Legend is stale

| Legend claims | Actual |
|---|---|
| 118 total rows | **131** |
| IDs locked V0001–V0118 | **V0001–V0135**, 4 gaps |
| 49 CONFIRMED_AMENDED | 47 |
| 3 CRITICAL | 5 |
| 10 rows added during verification | 27 |
| Documents 3 tabs | there are **5** — `Visual Issues` is undocumented |

### 1.3 27 rows are stamped Verified but were never verified

Every `NEW` row carries `Verified 2026-07-28` yet has **no Verification Log entry** — they were *found* during
verification, not re-tested. The Legend's own warning applies: ~2/3 of genuinely verified rows needed a correction.

| Priority | Count | IDs |
|---|---|---|
| CRITICAL | 3 | V0109, V0124, V0127 |
| HIGH | 13 | V0110, V0111, V0115, V0116, V0117, V0119, V0120, V0121, V0122, V0125, V0128, V0132, V0134 |
| MEDIUM | 8 | V0112, V0113, V0114, V0118, V0123, V0126, V0131, V0135 |
| LOW | 3 | V0129, V0130, V0133 |

### 1.4 Visual QA covers only 5 of 12 sites

Covered: Dallas Detox, Des Moines Wellness, Hillside Mission, Laguna View Detox, Quadrant Health Group.

**No visual QA at all:** Fort Worth Wellness, Marina Harbor Detox, Ocean Coast Recovery, Greater Texas Behavioral, Seaside Wellness, Wellness Detox LA, Wellness Recovery NJ.

Also: 202 rows are placeholders (Issue=None, Fix=None), 200 of them Laguna — so Laguna's real count is 99, not 299. 8 rows carry no Location URL and cannot be actioned as written.

### 1.5 Do not use Laguna as the canonical reference build

V0067: of Laguna's 46 structural pages, **43 canonicals point at URLs that 301 and 1 points at a 404** — only 1 resolves cleanly. Laguna is nonetheless cited as the model in every canonical row in the workbook.

---

<a id="cutover-blockers"></a>
## 2. Cutover blockers

Everything at CRITICAL, COMPLIANCE or BLOCKED, plus the systemic defects that span sites.

### V0054 — Hillside Mission Recovery · `CRITICAL`

**Issue.** CRITICAL - WRONG PERSON BIOGRAPHY PUBLISHED. /staff/phillip-carter shows headings for "Phillip Carter / Director of Operations" but the body text is Monica Olivares's biography verbatim: "Hi, I'm Monica Olivares - Program Director at Hillside Mission..." The two staff pages are 97.7 percent identical, differing only in the name and title in headings. This misstates who works at the facility and what their credentials are, on a YMYL healthcare site. Secondary defect: the H1 spells "Monica Olivires" while her own bio text spells "Monica Olivares". Original row logged this as routine duplicate content with the parent domain, which hid it.

**Location.** https://hillside-mission-recovery-beryl.vercel.app/staff/monica-olivires https://hillside-mission-recovery-beryl.vercel.app/staff/phillip-carter Also at: https://quadrant-health-group.vercel.app/team/monica-olivires, https://quadrant-health-group.vercel.app/team/phillip-carter

**Fix.** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/monica-olivires https://quadrant-health-group.vercel.app/team/phillip-carter Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team

> **Verification correction.** PRIORITY CRITICAL: Wrong person biography on a named staff page, YMYL site REWRITE THIS ROW ENTIRELY. It is not a parent-domain duplicate-content issue. It is the wrong person's biography published on a named staff page of a YMYL healthcare site - a factual misstatement of who works there and what their credentials are. Escalate above every other row verified so far. Secondary defect on the same page set: the H1 spells "Monica Olivires" while her own bio text spells "Monica Olivares".

### V0102 — ALL SITES · `CRITICAL`

**Issue.** PORTFOLIO-WIDE TRAILING-SLASH MISMATCH, affecting all 1,046 preview URLs. All 12 previews serve the slashless form at 200 and 308-redirect the slash form. All 12 production sites are slash-canonical, returning 301 on the slashless form. At cutover every inbound link using the production convention hits a redirect. This also CAUSES the canonical-target redirects in V0018 and V0067, since the builds emit slashless canonicals against slash-canonical production - fixing the convention fixes those too.

**Location.** Preview: https://fort-worth-wellness.vercel.app/about-us (HTTP 200, no trailing slash) Production: https://fortworthwellness.org/about-us (HTTP 301 to the trailing-slash form)

**Fix.** Pick one convention and enforce it in the Next.js config across all 12 builds, then align the redirect map. Verify against: https://fortworthwellness.org/about-us/ https://fort-worth-wellness.vercel.app/about-us

> **Verification correction.** PRIORITY CRITICAL: Affects all 1,046 preview URLs at cutover SCOPE UNDERSTATED. The row cites Fort Worth as though it were an example of a localised problem. It is portfolio-wide and total: every preview and every production site disagree on this. That makes it the single largest cutover issue in the audit by URL count - it affects all 1,046 preview URLs, not a subset. Also worth stating in the row: because previews 308-redirect the slash form, any existing inbound link or citation using the production slash convention will hit a redirect on the new build. That is the concrete consequence, and it applies to every indexed URL in the portfolio.

### V0109 — Ocean Coast Recovery · `CRITICAL`

**Issue.** CRITICAL - 106 of 107 pages canonical to the DOMAIN ROOT instead of themselves. Every page except the homepage tells search engines its authoritative version is oceancoastrecovery.com. Zero pages are self-referencing. A wrong canonical is worse than a missing one: missing leaves attribution ambiguous, root-pointing actively instructs consolidation into the homepage, which would deindex 106 pages. og:url carries the identical wrong value on all 38 pages that have it, so it is one template error feeding both tags.

**Location.** https://ocean-coast-recovery-center.vercel.app - 106 of 107 pages e.g. https://ocean-coast-recovery-center.vercel.app/about canonical = https://oceancoastrecovery.com e.g. https://ocean-coast-recovery-center.vercel.app/treatment/detox canonical = https://oceancoastrecovery.com

**Fix.** Change the canonical template to emit the PAGE URL, not the site URL. Fix og:url in the same change. Correct pattern to copy: https://marina-harbor-detox.vercel.app/about canonicals to https://marinaharbordetox.com/about/ Do NOT copy Laguna, which points 43 of 46 canonicals at redirects (V0067).

### V0124 — ALL SITES · `CRITICAL`

**Issue.** CUTOVER CONTENT GAP - THE BUILDS PREDATE PRODUCTION AND THE GAP IS STILL GROWING. Every Vercel build appears to have been generated from a content snapshot taken around 15-16 July 2026. Production has kept publishing since. Measured across all 12 production sitemaps: 15 pages published or renamed on production are ABSENT from the corresponding build, affecting 10 of 12 sites, and almost all dated 16-17 July 2026. Fort Worth and Greater Texas are unaffected only because they published nothing after the snapshot (newest content 11 June and 27 March). Des Moines and the QHG parent show lastmod of 28 July 2026, i.e. TODAY, so the gap widens every day the builds stay frozen. This also explains three other rows: V0120 (Laguna luxury post), V0122 (Hillside /what-is-narcan) and the slug renames in V0119 are all instances of this single cause, not separate faults.

**Location.** https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/ https://desmoinesrecovery.com/how-long-does-percocet-stay-in-your-system/ https://hillsidemission.com/what-is-narcan/ https://lagunaviewdetox.com/luxury-drug-rehab-what-five-star-recovery-really-looks-like/ https://lagunaviewdetox.com/orange-county-drug-rehab/ https://lagunaviewdetox.com/why-is-crystal-meth-addictive/ https://lagunaviewdetox.com/addiction-in-families-and-loved-ones/ https://lagunaviewdetox.com/use-your-gilsbar-health-insurance-to-treat-your-addiction/ https://marinaharbordetox.com/2026/07/17/codeine-cough-syrup/ https://oceancoastrecovery.com/m365-pill/ https://seasidewellnesspb.com/drug-rehab-west-palm-beach-complete-guide/ https://wellnessdetoxla.com/luxury-rehab-in-los-angeles/ https://wellnessrecoverynj.com/php-treatment-what-to-expect/ https://quadranthealthgroup.com/locations/wellness-nj/ https://quadranthealthgroup.com/2026/07/17/alcohol-rehab-what-to-expect-costs-how-to-choose-the-right-program/

**Fix.** Two actions, in this order. 1) FREEZE OR SYNC. Either pause publishing to production until cutover, or establish a re-sync step so content added after the snapshot is pulled into the builds. Without one of these, every new post is lost at launch. 2) RE-RUN THIS DIFF IMMEDIATELY BEFORE CUTOVER. The 15 URLs above are accurate as of 2026-07-28 and will be stale by launch. The check is: production sitemap lastmod >= snapshot date, then test each URL on the build. Verify against: https://lagunaviewdetox.com/sitemap_index.xml https://hillsidemission.com/sitemap_index.xml

### V0127 — Quadrant Health Group (parent) · `CRITICAL`

**Issue.** SEVEN production pages were dropped from the build, including the entire admissions funnel. All seven return HTTP 200 on production and 404 on the build, and none exists under an alternative slug - checked /faq, /our-story, /alumni, /verify-insurance, /insurance and /admissions/process, all 404. THIS REFRAMES THREE EARLIER ROWS: V0096 (no verify-insurance page), V0099 (no FAQ page) and V0095 (no aftercare or alumni page) recorded these as gaps to build from scratch. They are not - the content already exists on production and was lost in migration. That makes them a regression to port, which is far cheaper than authoring new pages.

**Location.** https://quadranthealthgroup.com/about/alumni/ "Alumni Program" https://quadranthealthgroup.com/about/faq/ "Quadrant Health Group FAQ | Treatment, Admissions & Insurance" https://quadranthealthgroup.com/about/our-story/ "Our Story | How Quadrant Health Group Began" https://quadranthealthgroup.com/admissions/admissions-process/ "Admissions Process for Addiction Treatment" https://quadranthealthgroup.com/admissions/help-for-loved-one/ "Help a Loved One | Addiction & Mental Health Support" https://quadranthealthgroup.com/admissions/help-for-yourself/ "Get Help for Addiction & Mental Health" https://quadranthealthgroup.com/admissions/insurance-verification/ "Insurance Verification for Treatment" All seven return HTTP 404 on https://quadrant-health-group.vercel.app at the same paths.

**Fix.** Port all seven from production into the build. Four of them are the conversion path - admissions process, help for yourself, help for a loved one, and insurance verification - so launching without them removes the parent site primary enquiry routes. Existing build sections to place them under: https://quadrant-health-group.vercel.app/about https://quadrant-health-group.vercel.app/admissions Then close V0096 and V0099 as duplicates of this row, and revise V0095 to cover only the facilities that genuinely lack an aftercare page.

### V0070 — Des Moines Wellness Center · `COMPLIANCE`

**Issue.** Homepage states "LegitScript Certified" as text with no LegitScript seal image and no link to a verification record.

**Location.** https://des-moines-wellness-center-navy.vercel.app/

**Fix.** Verify the certification and link the seal to the LegitScript record: https://www.legitscript.com/certification/website-certification-status/ Claim currently appears on: https://des-moines-wellness-center-navy.vercel.app/ Compare with a site that does display a seal: https://seaside-wellness-of-palm-beach.vercel.app/

> **Verification correction.** PRIORITY COMPLIANCE: Certification claim on 34 pages; production seal verifies a different domain Two things, and the second is more serious than the row. 1) SCOPE: the row says "Homepage states". The unverified claim is on all 34 pages, not just the homepage. 2) PRODUCTION HAS A SEAL POINTING AT THE WRONG DOMAIN. desmoinesrecovery.com carries a LegitScript seal whose verification link is https://www.legitscript.com/websites/?checker_keywords=californiahorizon.com - a different domain entirely. So the fix is NOT simply "add the seal back". The certification needs confirming as held for desmoinesrecovery.com FIRST, because the only evidence on production points at californiahorizon.com. If the certification is not held for this domain, the text claim is unsubstantiated - which matters for Google Ads eligibility in addiction treatment, not just trust signalling.

### V0100 — ALL SITES · `COMPLIANCE`

**Issue.** Privacy policy: 1 site has NO privacy page at all (Greater Texas) - a compliance exposure on a YMYL healthcare site. 1 site uses a non-standard slug (/privacy on Ocean Coast). 2 sites have it live but correctly excluded from the sitemap because they are noindex (Laguna, Wellness LA) - not defects. Original row bundled all three situations as "3 sites have none in the sitemap".

**Location.** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook

**Fix.** Adopt /privacy-policy portfolio-wide. Required for a YMYL healthcare site. Outlier URL to redirect: https://ocean-coast-recovery-center.vercel.app/privacy Live but missing from sitemap on: https://laguna-view-detox.vercel.app/privacy-policy https://wellness-detox-of-la.vercel.app/privacy-policy Absent entirely on: https://greater-texas-behavioral.vercel.app Reference build already on the standard: https://dallas-detox-center.vercel.app/privacy-policy

> **Verification correction.** PRIORITY COMPLIANCE: Greater Texas has no privacy policy page at all The "3 sites" figure bundles two different situations and so misleads. Two of the three (Laguna, Wellness LA) are noindex, so their sitemap exclusion is CORRECT behaviour - already settled as by-design in V0068 and V0080. Only Greater Texas is a real gap. Reword to: 1 site has no privacy policy at all; 2 are correctly excluded because they are noindex; 1 uses a non-standard slug.

### V0043 — Greater Texas Behavioral · `BLOCKED`

**Issue.** Wrong facility phone number sitewide. Seaside Wellness's number 855-416-5648 appears on all 5 pages alongside Greater Texas's own 877-590-3665. Two different numbers on every page. Found on the footers admission hotline link

**Location.** https://greater-texas-behavioral.vercel.app/ https://greater-texas-behavioral.vercel.app/blog https://greater-texas-behavioral.vercel.app/our-story https://greater-texas-behavioral.vercel.app/verify-insurance https://greater-texas-behavioral.vercel.app/what-we-treat

**Fix.** Remove 855-416-5648 from these pages: https://greater-texas-behavioral.vercel.app/ https://greater-texas-behavioral.vercel.app/blog https://greater-texas-behavioral.vercel.app/our-story https://greater-texas-behavioral.vercel.app/verify-insurance https://greater-texas-behavioral.vercel.app/what-we-treat The number belongs to Seaside, which correctly uses it here: https://seaside-wellness-of-palm-beach.vercel.app/ Cross-check the surviving number against the production domain and GBP: https://greatertexasbehavioral.com

> **Verification correction.** PRIORITY BLOCKED: Confirm with admissions before removing a live tracked number Two corrections, the second one important. 1) INHERITED, NOT INTRODUCED. Production greatertexasbehavioral.com also publishes BOTH numbers. So this is a pre-existing condition, same category as V0041, not a rebuild regression. The row implies the new build created it. 2) The fix may be unsafe as written. It instructs removing 855-416-5648 from all 5 pages. But since both Seaside and Greater Texas are QHG facilities and both have carried this number on production, 855-416-5648 could be a deliberate shared intake line rather than contamination. Deleting a live tracked number that is actually routing calls would lose admissions enquiries. Downgrade the fix to: confirm with the admissions team which number is intended for Greater Texas BEFORE removing either.

### V0048 — Marina Harbor Detox · `BLOCKED`

**Issue.** Wrong facility phone number on homepage. Laguna View Detox's number 866-932-3206 is used on a mid-page CTA ('Call 866-932-3206') while the rest of the site correctly uses 866-525-3026.

**Location.** https://marina-harbor-detox.vercel.app/ (mid-page admissions CTA)

**Fix.** Replace 866-932-3206 with 866-525-3026 in the CTA block on: https://marina-harbor-detox.vercel.app/ The number belongs to Laguna View Detox, which correctly uses it here: https://laguna-view-detox.vercel.app/ Cross-check against the production domain and GBP: https://marinaharbordetox.com

> **Verification correction.** PRIORITY BLOCKED: Confirm with admissions before removing a live tracked number INHERITED, NOT INTRODUCED. Production marinaharbordetox.com carries the same number on its homepage, anchor "Call Us At 866-932-3206". So this is pre-existing, not a rebuild regression, same as V0041 and V0043. Apply the V0043 caution before deleting: confirm with admissions that 866-932-3206 is not a deliberate shared or overflow line. Contamination is the more likely reading here than in V0043, since Laguna Beach and San Francisco are different markets, but it is still a live number and worth one confirmation.

### V0049 — Marina Harbor Detox · `BLOCKED`

**Issue.** Third unverified phone number on homepage. 415-868-3858 appears on a 'Call Us Now' link. Three different numbers on one page breaks call attribution.

**Location.** https://marina-harbor-detox.vercel.app/ ('Call Us Now' link)

**Fix.** Confirm whether 415-868-3858 is a legitimate local line on: https://marina-harbor-detox.vercel.app/ If it is not the tracked number, replace with 866-525-3026 as used sitewide, e.g.: https://marina-harbor-detox.vercel.app/contact-location Cross-check against the production domain and GBP: https://marinaharbordetox.com

> **Verification correction.** PRIORITY BLOCKED: Number is likely a legitimate local SF line, do not replace Row calls it "unverified" and implies it may be an error. Evidence says it is most likely legitimate: 1) On production its anchor is literally "Call Now Button", the name of the WordPress Call Now Button plugin, so it is a deliberately configured mobile click-to-call line, not stray text. 2) Area code 415 matches the facility city - Marina Harbor is at 289 Marina Blvd, San Francisco. 3) It is on production in two places, so it is long-standing. Reword from "unverified third number" to: a real local SF line configured in the mobile call button, inconsistent with the tracked 866 number used everywhere else. The issue is attribution consistency, not contamination. Do NOT simply replace it, which is what the Fix currently suggests as an option.

### Systemic: canonicals

Not one row on its own — three sites have **no canonical tag on any page**:

| Site | Pages with no canonical | Row |
|---|---|---|
| Fort Worth Wellness | 55 of 55 (100%) | V0039 |
| Wellness Recovery NJ | 51 of 51 (100%) | V0082 |
| Quadrant parent | 92 of 92 (100%) | V0092 |
| Ocean Coast Recovery | 106 of 107 point at domain root | V0109 |
| Laguna View Detox | 43 of 46 point at redirects | V0067 |
| Hillside Mission | 6 of 156 missing | V0058 |
| Dallas Detox | 1 of 103 missing | V0018 |

**198 indexable pages carry no canonical at all** and compete as near-duplicates with their live production twins.

### Systemic: og:url

| Site | State | Row |
|---|---|---|
| Seaside Wellness | 70/70 wrong or absent — worst in portfolio, 0 correct | V0077 |
| Ocean Coast Recovery | 107/107 (37 root, 69 absent) — same template bug as its canonicals | V0088 |
| Quadrant parent | 92/92 (53 root, 38 absent, 0 page-specific) | V0093 |
| Wellness Recovery NJ | 51/51 (31 root, 19 absent, 0 page-specific) | V0085 |
| Wellness Detox LA | 36 of 44 point at domain root | V0081 |
| Greater Texas | 11/11 (4 root, 6 absent) | V0047 |
| Marina Harbor Detox | 2 of 118 point at domain root | V0053 |
| Fort Worth Wellness | 12 wrong, 42 absent, 1 correct | **V0040 (deleted — restore)** |

V0088 confirms og:url and canonical are one template error on Ocean Coast. Fix them together, not separately.

### Systemic: Fort Worth is a clone of Dallas

V0104/V0105/V0106 — **42 of 42 blog slugs identical to Dallas.** Body copy was find-and-replaced (0 posts mention Dallas, 42 mention Fort Worth) but slugs and in-body hrefs were left untouched, which is the **root cause of all 13 Fort Worth broken links** in section 4. Measured 81–84% word-level similarity against the Dallas twin after neutralising brand and city names. One slug still names the sister facility; another targets Irving, a Dallas suburb.

---

<a id="build-issues-by-facility"></a>
## 3. Build issues by facility

All 102 rows from the `Vercel Build Issues` tab, grouped by facility and ordered by priority.

### ALL SITES (13)

#### V0102 — `CRITICAL` · CONFIRMED_AMENDED

PORTFOLIO-WIDE TRAILING-SLASH MISMATCH, affecting all 1,046 preview URLs. All 12 previews serve the slashless form at 200 and 308-redirect the slash form. All 12 production sites are slash-canonical, returning 301 on the slashless form. At cutover every inbound link using the production convention hits a redirect. This also CAUSES the canonical-target redirects in V0018 and V0067, since the builds emit slashless canonicals against slash-canonical production - fixing the convention fixes those too.

- **Where:** Preview: https://fort-worth-wellness.vercel.app/about-us (HTTP 200, no trailing slash) Production: https://fortworthwellness.org/about-us (HTTP 301 to the trailing-slash form)
- **Fix:** Pick one convention and enforce it in the Next.js config across all 12 builds, then align the redirect map. Verify against: https://fortworthwellness.org/about-us/ https://fort-worth-wellness.vercel.app/about-us
- **Verification correction:** PRIORITY CRITICAL: Affects all 1,046 preview URLs at cutover SCOPE UNDERSTATED. The row cites Fort Worth as though it were an example of a localised problem. It is portfolio-wide and total: every preview and every production site disagree on this. That makes it the single largest cutover issue in the audit by URL count - it affects all 1,046 preview URLs, not a subset. Also worth stating in the row: because previews 308-redirect the slash form, any existing inbound link or citation using the production slash convention will hit a redirect on the new build. That is the concrete consequence, and it applies to every indexed URL in the portfolio.

#### V0124 — `CRITICAL` · NEW - Marina Harbor deep audit 2026-07-28

CUTOVER CONTENT GAP - THE BUILDS PREDATE PRODUCTION AND THE GAP IS STILL GROWING. Every Vercel build appears to have been generated from a content snapshot taken around 15-16 July 2026. Production has kept publishing since. Measured across all 12 production sitemaps: 15 pages published or renamed on production are ABSENT from the corresponding build, affecting 10 of 12 sites, and almost all dated 16-17 July 2026. Fort Worth and Greater Texas are unaffected only because they published nothing after the snapshot (newest content 11 June and 27 March). Des Moines and the QHG parent show lastmod of 28 July 2026, i.e. TODAY, so the gap widens every day the builds stay frozen. This also explains three other rows: V0120 (Laguna luxury post), V0122 (Hillside /what-is-narcan) and the slug renames in V0119 are all instances of this single cause, not separate faults.

- **Where:** https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/ https://desmoinesrecovery.com/how-long-does-percocet-stay-in-your-system/ https://hillsidemission.com/what-is-narcan/ https://lagunaviewdetox.com/luxury-drug-rehab-what-five-star-recovery-really-looks-like/ https://lagunaviewdetox.com/orange-county-drug-rehab/ https://lagunaviewdetox.com/why-is-crystal-meth-addictive/ https://lagunaviewdetox.com/addiction-in-families-and-loved-ones/ https://lagunaviewdetox.com/use-your-gilsbar-health-insurance-to-treat-your-addiction/ https://marinaharbordetox.com/2026/07/17/codeine-cough-syrup/ https://oceancoastrecovery.com/m365-pill/ https://seasidewellnesspb.com/drug-rehab-west-palm-beach-complete-guide/ https://wellnessdetoxla.com/luxury-rehab-in-los-angeles/ https://wellnessrecoverynj.com/php-treatment-what-to-expect/ https://quadranthealthgroup.com/locations/wellness-nj/ https://quadranthealthgroup.com/2026/07/17/alcohol-rehab-what-to-expect-costs-how-to-choose-the-right-program/
- **Fix:** Two actions, in this order. 1) FREEZE OR SYNC. Either pause publishing to production until cutover, or establish a re-sync step so content added after the snapshot is pulled into the builds. Without one of these, every new post is lost at launch. 2) RE-RUN THIS DIFF IMMEDIATELY BEFORE CUTOVER. The 15 URLs above are accurate as of 2026-07-28 and will be stale by launch. The check is: production sitemap lastmod >= snapshot date, then test each URL on the build. Verify against: https://lagunaviewdetox.com/sitemap_index.xml https://hillsidemission.com/sitemap_index.xml

#### V0100 — `COMPLIANCE` · CONFIRMED_AMENDED

Privacy policy: 1 site has NO privacy page at all (Greater Texas) - a compliance exposure on a YMYL healthcare site. 1 site uses a non-standard slug (/privacy on Ocean Coast). 2 sites have it live but correctly excluded from the sitemap because they are noindex (Laguna, Wellness LA) - not defects. Original row bundled all three situations as "3 sites have none in the sitemap".

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /privacy-policy portfolio-wide. Required for a YMYL healthcare site. Outlier URL to redirect: https://ocean-coast-recovery-center.vercel.app/privacy Live but missing from sitemap on: https://laguna-view-detox.vercel.app/privacy-policy https://wellness-detox-of-la.vercel.app/privacy-policy Absent entirely on: https://greater-texas-behavioral.vercel.app Reference build already on the standard: https://dallas-detox-center.vercel.app/privacy-policy
- **Verification correction:** PRIORITY COMPLIANCE: Greater Texas has no privacy policy page at all The "3 sites" figure bundles two different situations and so misleads. Two of the three (Laguna, Wellness LA) are noindex, so their sitemap exclusion is CORRECT behaviour - already settled as by-design in V0068 and V0080. Only Greater Texas is a real gap. Reword to: 1 site has no privacy policy at all; 2 are correctly excluded because they are noindex; 1 uses a non-standard slug.

#### V0116 — `HIGH` · NEW - found during verification

Preview-versus-production slug changes that need cutover redirects and are not in any other row. Wellness NJ: production serves /contact-us/ while the preview serves /contact, and the preview 308s /contact-us to /contact - the exact reverse of production. Greater Texas: production serves /insurance while the preview serves /verify-insurance. Laguna and Ocean Beach production 301 /about onward to /about-us/, so their production About slug is /about-us while their previews use /about.

- **Where:** https://wellnessrecoverynj.com/contact-us/ vs https://wellness-recovery-nj.vercel.app/contact https://greatertexasbehavioral.com/insurance vs https://greater-texas-behavioral.vercel.app/verify-insurance https://lagunaviewdetox.com/about-us/ vs https://laguna-view-detox.vercel.app/about https://oceancoastrecovery.com/about-us/ vs https://ocean-coast-recovery-center.vercel.app/about
- **Fix:** Add each of these to the cutover redirect map so existing equity transfers. Decide per pair which slug survives, then make the preview and the redirect map agree. Related: the portfolio slug rows (V0094-V0101) were written from preview data only and do not reflect these production values.

#### V0118 — `MEDIUM` · NEW - found during verification

CONTRADICTION TO RESOLVE between two existing rows. V0052 closes Marina Harbor geo-suffixed service slugs (/what-we-offer/detox-san-francisco and similar) as by-design, while V0072 flags the same pattern on Des Moines (/programs/medical-detox-des-moines and similar) as a defect. Both cannot stand. Hillside has one instance too (/treatment/executives-rehab-in-mission-viejo).

- **Where:** https://marina-harbor-detox.vercel.app/what-we-offer/detox-san-francisco (closed as by-design, V0052) https://des-moines-wellness-center-navy.vercel.app/programs/medical-detox-des-moines (flagged as defect, V0072) https://hillside-mission-recovery-beryl.vercel.app/treatment/executives-rehab-in-mission-viejo
- **Fix:** Decide one policy on geo-suffixed service slugs and apply it to all 15 affected URLs, then update V0052 and V0072 to match. Note all of them exist on production, so any rename carries redirect cost.

#### V0094 — `not triaged` · CONFIRMED

Treatment hub slug differs across the portfolio: /treatment (8 sites), /treatment-services (Dallas), /programs (Des Moines), /what-we-offer (Marina Harbor).

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /treatment portfolio-wide. Redirect the three outliers. Outlier URLs to redirect: https://dallas-detox-center.vercel.app/treatment-services -> /treatment https://des-moines-wellness-center-navy.vercel.app/programs -> /treatment https://marina-harbor-detox.vercel.app/what-we-offer -> /treatment Reference build already on the standard: https://ocean-coast-recovery-center.vercel.app/treatment

#### V0095 — `not triaged` · CONFIRMED_AMENDED

Aftercare slug has 6 distinct variants across 9 sites (count corrected from 7): /treatment/aftercare (4 sites), /treatment/aftercare-planning, /treatment/aftercare-beyond, /treatment-services/aftercare-planning, /programs/aftercare-and-alumni, /aftercare. THREE SITES HAVE NO AFTERCARE PAGE AT ALL - Wellness NJ, QHG parent, Greater Texas - so this is a rename across 9 plus a build decision for 3, not a rename across 12.

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /treatment/aftercare portfolio-wide. Outlier URLs to redirect: https://hillside-mission-recovery-beryl.vercel.app/treatment/aftercare-beyond https://dallas-detox-center.vercel.app/treatment-services/aftercare-planning https://fort-worth-wellness.vercel.app/treatment/aftercare-planning https://des-moines-wellness-center-navy.vercel.app/programs/aftercare-and-alumni https://marina-harbor-detox.vercel.app/aftercare Reference build already on the standard: https://laguna-view-detox.vercel.app/treatment/aftercare
- **Verification correction:** COUNT WRONG: the issue text says 7 variants but there are 6, and the row own list contains 6. Off by one. Also omitted: 3 sites have NO aftercare page at all - Wellness NJ, QHG parent and Greater Texas. That matters because the row reads as a rename exercise across 12 sites when it is a rename across 9 plus a build decision for 3. For Wellness NJ specifically, aftercare is a normal part of an outpatient continuum, so its absence is more likely a gap than by-design - unlike the detox and residential absence confirmed in V0084.

#### V0096 — `not triaged` · CONFIRMED_AMENDED

Verify-insurance slug has 4 variants and is ABSENT ON 5 SITES (count corrected from 7): Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth. Dallas was wrongly listed as missing in the original row - dallas-detox-center.vercel.app/verify-insurance returns HTTP 200, and its actual defect is covered by V0017. Only 3 sites use the proposed /verify-insurance standard.

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /verify-insurance portfolio-wide and build it everywhere it is missing. Existing variants: https://des-moines-wellness-center-navy.vercel.app/verify-insurance https://laguna-view-detox.vercel.app/insurance https://ocean-coast-recovery-center.vercel.app/insurance https://seaside-wellness-of-palm-beach.vercel.app/admissions/insurance-verification https://wellness-detox-of-la.vercel.app/admissions/verify-your-insurance Missing entirely on: https://hillside-mission-recovery-beryl.vercel.app https://marina-harbor-detox.vercel.app https://wellness-recovery-nj.vercel.app https://quadrant-health-group.vercel.app https://fort-worth-wellness.vercel.app https://dallas-detox-center.vercel.app Reference build already on the standard: https://des-moines-wellness-center-navy.vercel.app/verify-insurance
- **Verification correction:** Two errors, and the second contradicts another row. 1) COUNT WRONG: the row says absent on 7 sites. It is absent on 5 - Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth. 2) DALLAS IS WRONGLY LISTED AS MISSING in the Fix column. Dallas /verify-insurance returns HTTP 200. This directly contradicts V0017, which correctly states that the page IS live and the real defect is its absence from the sitemap plus one mislinked CTA. So two of my rows assert opposite things about the same URL. V0017 is the correct one; remove Dallas from this row entirely.

#### V0097 — `not triaged` · CONFIRMED_AMENDED

About slug: /about is live on 9 sites (count corrected from 7). Only 3 sites genuinely need a rename - Dallas /about-us, Fort Worth /about-us, Greater Texas /our-story. Seaside and Wellness LA were wrongly listed as outliers: both already have /about at HTTP 200, and their nested pages are additional pages covered by V0073 and V0078. NOTE production diverges - Laguna and Ocean Coast production 301 /about to /about-us/, so their production slug is /about-us.

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /about portfolio-wide. Outlier URLs to redirect: https://dallas-detox-center.vercel.app/about-us https://fort-worth-wellness.vercel.app/about-us https://greater-texas-behavioral.vercel.app/our-story https://seaside-wellness-of-palm-beach.vercel.app/about/about-us https://wellness-detox-of-la.vercel.app/about/our-story Reference build already on the standard: https://laguna-view-detox.vercel.app/about
- **Verification correction:** Two corrections that change the size of the job. 1) COUNT WRONG: the row says /about is on 7 sites. It is on 9. 2) THE OUTLIER LIST IS WRONG. Seaside and Wellness LA are listed as outliers needing a redirect, but both ALREADY have /about at HTTP 200. Their /about/about-us and /about/our-story pages are ADDITIONAL pages, not alternative slugs - and those are already covered by V0073 and V0078 (where V0078 was withdrawn as normal architecture). So the genuine rename list is 3 sites, not 5: Dallas /about-us, Fort Worth /about-us, and Greater Texas /our-story.

#### V0098 — `not triaged` · CONFIRMED

Contact slug differs: /contact (8 sites), /contact-us (Dallas, Fort Worth), /contact-location (Marina Harbor), absent on Greater Texas.

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /contact portfolio-wide. Outlier URLs to redirect: https://dallas-detox-center.vercel.app/contact-us https://fort-worth-wellness.vercel.app/contact-us https://marina-harbor-detox.vercel.app/contact-location Missing entirely on: https://greater-texas-behavioral.vercel.app Reference build already on the standard: https://ocean-coast-recovery-center.vercel.app/contact

#### V0099 — `not triaged` · CONFIRMED_AMENDED

FAQ slug has 6 distinct variants (count corrected from 4) and is absent on 7 sites. WELLNESS DETOX LA HAS THREE SEPARATE FAQ PAGES - /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq - which the original count concealed. Only 2 sites use the proposed /faq standard, so this is a build-new task on 7 sites and a rename on 3.

- **Where:** Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
- **Fix:** Adopt /faq portfolio-wide. Outlier URLs to redirect: https://dallas-detox-center.vercel.app/faq-page https://seaside-wellness-of-palm-beach.vercel.app/about/faq https://wellness-detox-of-la.vercel.app/admissions/addiction-faq Reference build already on the standard: https://wellness-recovery-nj.vercel.app/faq
- **Verification correction:** VARIANT COUNT WRONG: the row says 4 variants; there are 6. I missed two on Wellness Detox LA. And the omission matters: WELLNESS DETOX LA HAS THREE SEPARATE FAQ PAGES - /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq. That is FAQ content fragmented across three URLs on one site, which is a distinct issue from portfolio slug inconsistency and is not logged anywhere. It should be its own row, since consolidating three FAQ pages is different work from renaming one. Also note only 2 sites use the proposed standard /faq (Marina Harbor, Wellness NJ), so this is a build-new task on 7 sites and a rename on 3, not primarily a rename.

#### V0101 — `not triaged` · CONFIRMED_AMENDED

Blog URL pattern differs 4 ways: /blog/slug (6 sites), root-level /slug (Des Moines, Hillside, Seaside, Wellness LA), dated /YYYY/MM/DD/slug (Dallas, Marina Harbor), /about/blog (Seaside index).

- **Where:** Portfolio-wide
- **Fix:** Adopt /blog/slug portfolio-wide. Dated URLs date the content and root-level posts collide with page slugs. Dated post URLs to migrate: https://dallas-detox-center.vercel.app/2026/06/17/why-dual-diagnosis-treatment-matters https://marina-harbor-detox.vercel.app/blog (dated post paths) Root-level post paths to migrate: https://hillside-mission-recovery-beryl.vercel.app/what-is-al-anon https://seaside-wellness-of-palm-beach.vercel.app/about/blog (index at a nested path) Reference build already on the standard: https://laguna-view-detox.vercel.app/blog
- **Verification correction:** One addition that changes the migration plan: TWO SITES ARE INTERNALLY MIXED, which the row does not mention. Laguna: 158 posts at /blog/slug plus 1 at root level Marina Harbor: 69 posts dated plus 1 at /blog/slug So the inconsistency is not only across sites but within them, and a per-site bulk rename would miss the stragglers. Those two single posts need finding individually. Minor: the Fix cites marina-harbor-detox.vercel.app/blog as a "dated post path" - that is the index, not a dated post. Cite an actual dated URL.

#### V0103 — `not triaged` · CONFIRMED

On production, /contact 301s to a JPEG attachment rather than the contact page. Confirmed on both Dallas and Fort Worth, a WordPress media attachment occupying the /contact slug. Any inbound link or citation using /contact currently lands on an image file.

- **Where:** https://dallasdetoxcenter.com/contact -> https://dallasdetoxcenter.com/wp-content/uploads/2022/01/contact.jpg https://fortworthwellness.org/contact -> https://fortworthwellness.org/wp-content/uploads/2022/01/contact.jpg
- **Fix:** Delete or rename the attachment, then 301 /contact to the real contact page: https://dallasdetoxcenter.com/contact-us/ https://fortworthwellness.org/contact-us/ Fix before cutover, otherwise the new builds inherit it.

### Dallas Detox Center (9)

#### V0110 — `HIGH` · NEW - found during verification

Brand suffix is doubled in the title tag on 87 of 103 pages, rendering as "| Dallas Detox Center | Dallas Detox Center". Wastes title pixels and looks unprofessional in search results.

- **Where:** https://dallas-detox-center.vercel.app - 87 of 103 pages e.g. https://dallas-detox-center.vercel.app/lp-recovery e.g. https://dallas-detox-center.vercel.app/2022/01/07/what-to-look-for-in-a-detox-center
- **Fix:** Remove the duplicated site-name append in the title template. Compare a correct one: https://dallas-detox-center.vercel.app/ (single brand suffix)

#### V0111 — `HIGH` · NEW - found during verification

Author byline reads "Written By: admin" on 18 pages, including 8 of the 14 geo pages, /meth-detox, /prescription-drugs-detox and /va-cnn. A placeholder dev account as the named author on YMYL healthcare content undermines E-E-A-T. Separately, only 25 of 103 pages name a medically reviewing clinician, so 78 pages carry no reviewer byline.

- **Where:** https://dallas-detox-center.vercel.app/va-cnn https://dallas-detox-center.vercel.app/meth-detox https://dallas-detox-center.vercel.app/prescription-drugs-detox https://dallas-detox-center.vercel.app/abilene (plus 7 more geo pages)
- **Fix:** Reassign the 18 admin-authored pages to a named credentialed author, and extend the "Medically Reviewed By" byline beyond the current 25 pages. Working example on the same site: https://dallas-detox-center.vercel.app/va-cnn already shows "Medically Reviewed By: Alexandria Grigsby LCDC"

#### V0017 — `MEDIUM` · CONFIRMED_AMENDED

No verify-insurance page in the sitemap, and the homepage CTA labelled "Verify Your Insurance" points to /contact-us instead. A /verify-insurance page is live but absent from the sitemap.

- **Where:** https://dallas-detox-center.vercel.app/ (footer CTA) Live but unlisted: https://dallas-detox-center.vercel.app/verify-insurance
- **Fix:** Repoint the footer CTA to this live page: https://dallas-detox-center.vercel.app/verify-insurance (verified live, HTTP 200) And add it to: https://dallas-detox-center.vercel.app/sitemap.xml
- **Verification correction:** PRIORITY MEDIUM: Scope narrower than written: 1 of 6 CTAs Row says "the homepage CTA ... points to /contact-us", implying the CTA or all of them. It is 1 of 6, and the other 5 are correct. The offending one is the FINAL CTA band ("Take the first step toward recovery today"). Two CTAs carry the exact label "Verify Your Insurance"; the upper one is correct, the final one is not. Reword to: "the final homepage CTA band links Verify Your Insurance to /contact-us; the other 5 verify CTAs on the page are correct."

#### V0112 — `MEDIUM` · NEW - found during verification

URL and title tag misspell CCN as CNN. The page is about VA CCN (Veterans Affairs Community Care Network) - H1 reads "VA CCN" and the body says CCN 14 times against CNN once - but the slug is /va-cnn and the title reads "VA CNN Drug Rehab in Texas". CNN is also a news brand, so the title is actively misleading on a veterans benefits page.

- **Where:** https://dallas-detox-center.vercel.app/va-cnn (/va-ccn returns HTTP 404)
- **Fix:** Rename to /va-ccn with a 301 from /va-cnn, and correct the title tag to "VA CCN". Page to fix: https://dallas-detox-center.vercel.app/va-cnn

#### V0113 — `MEDIUM` · NEW - found during verification

Landing page duplicates the homepage. /lp-recovery carries the identical H1 to the homepage ("Premier Mental Health & Addiction Recovery in Dallas, TX"), 46.4 percent body overlap, and a doubled brand suffix in its title.

- **Where:** https://dallas-detox-center.vercel.app/lp-recovery https://dallas-detox-center.vercel.app/
- **Fix:** If paid-traffic only, noindex it and remove from the sitemap. If organic, rewrite the H1 and body so it does not compete with the homepage. Pages: https://dallas-detox-center.vercel.app/lp-recovery

#### V0018 — `not triaged` · CONFIRMED_AMENDED

Missing canonical tag on 1 page(s) (homepage only, 1 of 103 pages). Verified that the preview serves robots.txt with "Allow: /", a robots meta of "index, follow" and no X-Robots-Tag header, so these pages are fully indexable. The production domain is live and self-canonicalising, so any preview page that gets discovered competes with its production twin as a near-duplicate.

- **Where:** https://dallas-detox-center.vercel.app - homepage only, 1 of 103 pages
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://dallasdetoxcenter.com Affected build: https://dallas-detox-center.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** Two corrections, one softening and one hardening. SOFTER: the preview homepage does carry og:url = https://dallasdetoxcenter.com, so a production URL signal exists even without a canonical. Row implies no signal at all. HARDER, and more important: the other 102 canonicals are present but ALL point at URLs that 301-redirect. Preview canonicalises to https://dallasdetoxcenter.com/about-us while production serves /about-us/ and 301s the slashless form. A canonical aimed at a redirect is a conflicting signal. Tested 5 Dallas pages, 5 of 5 redirect. So Dallas canonicals are wrong on 103 of 103 pages, not 1 of 103: one missing, 102 misdirected.

#### V0020 — `not triaged` · CONFIRMED_AMENDED

14 geo/city pages exist and all 14 have ZERO inbound internal links across the site. No Areas We Serve hub exists (/areas-we-serve, /locations, /service-areas all 404). Roughly 21,000 words of content, 1,406-1,675 per page, sitting unlinked. Count corrected from 13 to 14 on verification.

- **Where:** https://dallas-detox-center.vercel.app/abilene https://dallas-detox-center.vercel.app/arlington https://dallas-detox-center.vercel.app/farmers-branch https://dallas-detox-center.vercel.app/frisco https://dallas-detox-center.vercel.app/garland https://dallas-detox-center.vercel.app/highland-park https://dallas-detox-center.vercel.app/mckinney https://dallas-detox-center.vercel.app/plano https://dallas-detox-center.vercel.app/richardson https://dallas-detox-center.vercel.app/southlake https://dallas-detox-center.vercel.app/university-park https://dallas-detox-center.vercel.app/waco https://dallas-detox-center.vercel.app/wichita-falls https://dallas-detox-center.vercel.app/fort-worth-drug-rehab
- **Fix:** Build this hub and link all of them: https://dallas-detox-center.vercel.app/areas-we-serve Model on: https://wellness-recovery-nj.vercel.app/areas-we-serve Or noindex and drop from: https://dallas-detox-center.vercel.app/sitemap.xml
- **Verification correction:** COUNT WRONG: issue text says 13 geo/city pages, the Location column lists 14 and 14 are orphaned. Correct figure is 14. Roughly 21,000 words of content sitting unlinked.

#### V0021 — `not triaged` · CONFIRMED

4 staff bio pages are orphaned - there is no team hub page linking them.

- **Where:** https://dallas-detox-center.vercel.app/about-us/alexandria-grigsby https://dallas-detox-center.vercel.app/about-us/michael-young https://dallas-detox-center.vercel.app/about-us/ricki-cochran https://dallas-detox-center.vercel.app/about-us/trevor-grigsby
- **Fix:** Build this hub and link all four: https://dallas-detox-center.vercel.app/about-us/meet-the-team Model on: https://quadrant-health-group.vercel.app/about/meet-the-team

#### V0022 — `not triaged` · CONFIRMED_AMENDED

5 paid landing pages are indexable (robots "index, follow"), present in the sitemap, and linked from nowhere. Count corrected from 4 to 5 on verification.

- **Where:** https://dallas-detox-center.vercel.app/drug-alcohol-detox-lp https://dallas-detox-center.vercel.app/insurance-lp https://dallas-detox-center.vercel.app/lp-recovery https://dallas-detox-center.vercel.app/luxury-inpatient-lp https://dallas-detox-center.vercel.app/va-cnn
- **Fix:** If paid-traffic only, noindex and remove from: https://dallas-detox-center.vercel.app/sitemap.xml If organic, link them from the relevant hubs.
- **Verification correction:** COUNT WRONG: issue text says 4 paid landing pages, the Location column lists 5 and all 5 are orphaned. Correct figure is 5.

### Des Moines Wellness Center (4)

#### V0070 — `COMPLIANCE` · CONFIRMED_AMENDED

Homepage states "LegitScript Certified" as text with no LegitScript seal image and no link to a verification record.

- **Where:** https://des-moines-wellness-center-navy.vercel.app/
- **Fix:** Verify the certification and link the seal to the LegitScript record: https://www.legitscript.com/certification/website-certification-status/ Claim currently appears on: https://des-moines-wellness-center-navy.vercel.app/ Compare with a site that does display a seal: https://seaside-wellness-of-palm-beach.vercel.app/
- **Verification correction:** PRIORITY COMPLIANCE: Certification claim on 34 pages; production seal verifies a different domain Two things, and the second is more serious than the row. 1) SCOPE: the row says "Homepage states". The unverified claim is on all 34 pages, not just the homepage. 2) PRODUCTION HAS A SEAL POINTING AT THE WRONG DOMAIN. desmoinesrecovery.com carries a LegitScript seal whose verification link is https://www.legitscript.com/websites/?checker_keywords=californiahorizon.com - a different domain entirely. So the fix is NOT simply "add the seal back". The certification needs confirming as held for desmoinesrecovery.com FIRST, because the only evidence on production points at californiahorizon.com. If the certification is not held for this domain, the text claim is unsubstantiated - which matters for Google Ads eligibility in addiction treatment, not just trust signalling.

#### V0069 — `not triaged` · CONFIRMED

Homepage names 7 service areas (Des Moines, West Des Moines, Ankeny, Urbandale, Waukee, Polk County, Dallas County) but only 2 have pages, so 5 are unlinkable.

- **Where:** https://des-moines-wellness-center-navy.vercel.app/areas-we-serve Existing: /areas-we-serve/ankeny, /areas-we-serve/west-des-moines
- **Fix:** Build these pages: https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/des-moines https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/urbandale https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/waukee https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/polk-county https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/dallas-county Model on an existing one: https://des-moines-wellness-center-navy.vercel.app/areas-we-serve/ankeny Or stop naming them as served areas on: https://des-moines-wellness-center-navy.vercel.app/

#### V0071 — `not triaged` · CONFIRMED_AMENDED

Brand targets Des Moines but the NAP address is Johnston, IA 50131, a separate suburb.

- **Where:** https://des-moines-wellness-center-navy.vercel.app/ (5820 Winwood Dr, Johnston, IA 50131)
- **Fix:** Align NAP across the site, production domain and GBP: https://des-moines-wellness-center-navy.vercel.app/contact https://desmoinesrecovery.com
- **Verification correction:** Identical pair of errors to V0023, from the same generator block. 1) UNDERSTATED: the row says only that the brand targets Des Moines while the address is Johnston. The copy actually asserts "Located in Des Moines" once and "heart of Des Moines" once, with "in Des Moines" 7 times against "Johnston" once. That is a direct locality claim contradicting the NAP and the schema. 2) FIX IS WRONG: it says "Align NAP across the site, production domain and GBP". NAP is already aligned on all three surfaces tested. Nothing to align. The real action is correcting the locality claims in body copy and deciding the brand-versus-location position.

#### V0072 — `not triaged` · CONFIRMED_AMENDED

Every program and condition slug carries a geo suffix (e.g. /programs/medical-detox-des-moines, /what-we-treat/alcohol-rehab-des-moines). No other site does this, and it bloats URLs while duplicating the geo signal already in title tags.

- **Where:** https://des-moines-wellness-center-navy.vercel.app/programs
- **Fix:** Rename with 301s, e.g.: https://des-moines-wellness-center-navy.vercel.app/programs/medical-detox-des-moines -> /treatment/detox https://des-moines-wellness-center-navy.vercel.app/programs/residential-rehab-des-moines -> /treatment/residential https://des-moines-wellness-center-navy.vercel.app/what-we-treat/alcohol-rehab-des-moines -> /what-we-treat/alcohol Reference build using clean slugs: https://wellness-recovery-nj.vercel.app/what-we-treat
- **Verification correction:** Two factual overstatements in the row. 1) "EVERY program and condition slug" is wrong - 11 of 14, not 14 of 14. Three do not carry the suffix: /programs/aftercare-and-alumni, /programs/dual-diagnosis, and /programs/des-moines-outpatient-rehab, which uses a geo PREFIX instead. So the section actually mixes three naming patterns, which is a sharper point than a blanket suffix rule. 2) "No other site does this" is wrong. Marina Harbor has 3 geo-suffixed service slugs (/what-we-offer/detox-san-francisco, /inpatient-rehab-san-francisco, /drug-rehab-marin-county) and Hillside has 1 (/treatment/executives-rehab-in-mission-viejo). Des Moines is the heaviest user, not the only one - and the Marina Harbor ones are already covered by V0052, which I closed as by-design. Those two positions contradict each other and need reconciling.

### Fort Worth Wellness (10)

#### V0037 — `HIGH` · CONFIRMED

Content promises exceed the page inventory. Only 13 structural pages support 42 blog posts. The treatment section carries 4 levels of care (detox, mental health residential, dual diagnosis, aftercare) but there is no substance-abuse residential page, no substance pages and no What We Treat hub, while the homepage names 7 substances under a "Conditions We Treat" heading (alcohol, benzo, opioid, fentanyl, meth, cocaine, prescription). The treatment hub itself is internally sound - all 13 of its links verified 200 - so the gap is between what the copy claims and what pages exist, not broken navigation.

- **Where:** https://fort-worth-wellness.vercel.app/treatment
- **Fix:** Build the pages named in the broken-link rows for this facility, or unpublish the blog posts linking to them. Treatment hub to build them under: https://fort-worth-wellness.vercel.app/treatment Use the Dallas treatment section as the model: https://dallas-detox-center.vercel.app/treatment-services
- **Verification correction:** PRIORITY HIGH: Content promises exceed page inventory none - row accurate as written

#### V0039 — `HIGH` · CONFIRMED

Missing canonical tag on 55 page(s) (all 55 pages, 100 percent). Verified that the preview serves robots.txt with "Allow: /", a robots meta of "index, follow" and no X-Robots-Tag header, so these pages are fully indexable. The production domain is live and self-canonicalising, so any preview page that gets discovered competes with its production twin as a near-duplicate.

- **Where:** https://fort-worth-wellness.vercel.app - all 55 pages, 100 percent
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://fortworthwellness.org Affected build: https://fort-worth-wellness.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** PRIORITY HIGH: 100 percent of pages missing canonical, site fully indexable Minor precision only: the row says the robots meta is "index, follow", but there are two values across the site - 54 pages "index, follow" and /privacy-policy "index, nofollow". Does not affect the conclusion, since nofollow does not prevent indexing, and that page has its own row.

#### V0038 — `not triaged` · DUPLICATE · status: KEEP - merge V0107 detail in

Who We Help hub exists but has no child pages. Dallas has 7 population pages at the equivalent level.

- **Where:** https://fort-worth-wellness.vercel.app/who-we-help
- **Fix:** Model on the Dallas set, all verified live: https://dallas-detox-center.vercel.app/who-we-help/women https://dallas-detox-center.vercel.app/who-we-help/men https://dallas-detox-center.vercel.app/who-we-help/professionals https://dallas-detox-center.vercel.app/who-we-help/veterans https://dallas-detox-center.vercel.app/who-we-help/first-responders https://dallas-detox-center.vercel.app/who-we-help/young-adults https://dallas-detox-center.vercel.app/who-we-help/college-students Or remove the empty hub: https://fort-worth-wellness.vercel.app/who-we-help
- **Verification correction:** Keep V0038 as the surviving row and fold V0107 detail into it (7 populations as headings on one 565-word page, roughly 80 words each). Withdraw V0107. V0038 has the lower ID and is already positioned in the Fort Worth block.

#### V0041 — `not triaged` · CONFIRMED

The substance and residential pages the blog links to are missing on production too, so these broken links are inherited rather than introduced by the rebuild. Verified /alcohol-detox, /benzo-detox, /meth-detox, /fentanyl-detox, /opioid-detox, /luxury-treatment and /treatment/residential-inpatient all return 404 on both.

- **Where:** Production 404s: https://fortworthwellness.org/alcohol-detox https://fortworthwellness.org/luxury-treatment Preview 404s: https://fort-worth-wellness.vercel.app/alcohol-detox https://fort-worth-wellness.vercel.app/luxury-treatment V0041 — full URLs Substance and luxury links https://fort-worth-wellness.vercel.app/alcohol-detox — 3 posts, 4 instances https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year — anchor "alcohol" ×2 https://fort-worth-wellness.vercel.app/blog/grey-area-drinking — "alcohol detox program in Texas" https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas — "alcohol" https://fort-worth-wellness.vercel.app/benzo-detox — 2 posts .../blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year — "benzos" .../blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas — "benzodiazepine" https://fort-worth-wellness.vercel.app/meth-detox — 1 post .../blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas — "Methamphetamine" https://fort-worth-wellness.vercel.app/fentanyl-detox — 1 post, 2 instances .../blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas — "fentanyl" ×2 https://fort-worth-wellness.vercel.app/opioid-detox — 1 post .../blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas — "opioid dependency" https://fort-worth-wellness.vercel.app/luxury-treatment — 3 posts .../blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year — "rehab program" .../blog/evolution-of-addiction-treatment — "luxury treatment at our state-of-the-art drug and alcohol rehab facility" .../blog/how-to-convince-someone-to-get-help-for-drug-addiction — "luxury detox center in Fort Worth" Residential links https://fort-worth-wellness.vercel.app/treatment-services/inpatient — 9 posts .../blog/addiction-rehab-near-irving-texas — "Texas inpatient rehab program" .../blog/group-therapy-used-in-rehab — "residential program" .../blog/how-long-are-inpatient-programs — "inpatient treatment programs in Fort Worth" .../blog/how-to-find-alcohol-rehab-near-garland-texas — "Fort Worth inpatient program" .../blog/is-there-al-anon-for-drug-addiction — "inpatient programs" .../blog/sober-living-house — "inpatient programs in Fort Worth" .../blog/the-importance-of-having-a-hobby-in-addiction-recovery — "Fort Worth inpatient treatment programs" .../blog/what-is-drug-withdrawal — "inpatient addiction treatment in Fort Worth" .../blog/what-is-the-difference-between-inpatient-and-outpatient-treatment — "inpatient treatment" https://fort-worth-wellness.vercel.app/treatment-services/residential-inpatient — 4 posts, 5 instances .../blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year — "residential treatment" ×2 .../blog/medically-assisted-detox-near-me — "Texas inpatient program" .../blog/resources-for-children-of-parents-with-dual-diagnosis — "inpatient drug rehab" .../blog/timeline-for-alcohol-detox — "inpatient alcohol addiction treatment programs in Fort Worth"
- **Fix:** Fixing these in the new build also fixes long-standing production 404s. Model on the live Dallas pages: https://dallas-detox-center.vercel.app/alcohol-detox https://dallas-detox-center.vercel.app/luxury-treatment

#### V0042 — `not triaged` · CONFIRMED_AMENDED

Privacy policy is set to "index, nofollow" while every other page is "index, follow". Nofollow here is inconsistent and serves no purpose.

- **Where:** https://fort-worth-wellness.vercel.app/privacy-policy
- **Fix:** Change to "index, follow" to match the rest of the site: https://fort-worth-wellness.vercel.app/privacy-policy Compare with: https://dallas-detox-center.vercel.app/privacy-policy
- **Verification correction:** The row treats this as a lone Fort Worth oddity. It is actually one instance of a portfolio-wide inconsistency: the same page type carries FOUR different robots treatments. index, follow : Dallas, Des Moines, Seaside, Wellness NJ, QHG parent (5) no robots meta : Hillside, Marina Harbor, Ocean Coast (3) noindex, follow : Laguna, Wellness Detox LA (2) index, nofollow : Fort Worth (1) no privacy page : Greater Texas Recommend broadening this row, or adding a portfolio-level row, so the decision gets made once.

#### V0104 — `not triaged` · NOT YET VERIFIED

ROOT CAUSE for the Fort Worth broken links and duplicate content. All 42 blog posts were cloned from Dallas: 42 of 42 slugs are identical. Body copy was find-and-replaced (0 posts mention Dallas, 42 of 42 mention Fort Worth) but slugs and in-body hrefs were left untouched, which is exactly why the links point at Dallas URL patterns that do not exist here.

- **Where:** Compare any pair, e.g. https://fort-worth-wellness.vercel.app/blog/detox-medications https://dallas-detox-center.vercel.app/2022/02/15/detox-medications
- **Fix:** Treat as one remediation, not 13 separate link fixes. Rewrite or prune the cloned set, and correct the hrefs at the same time. Broken-link rows for this facility are listed on the Broken Internal Links tab. Blog index: https://fort-worth-wellness.vercel.app/blog

#### V0105 — `not triaged` · NOT YET VERIFIED

Cross-site duplicate content. Measured 62 to 67 percent 8-gram overlap and 81 to 84 percent word-level similarity against the Dallas twin across 6 sampled post pairs, after neutralising brand and city names. Two sites in the same portfolio are publishing near-identical articles at identical slugs.

- **Where:** Sampled pairs (Fort Worth / Dallas): https://fort-worth-wellness.vercel.app/blog/do-you-detox-from-alcohol https://dallas-detox-center.vercel.app/2022/03/17/do-you-detox-from-alcohol https://fort-worth-wellness.vercel.app/blog/group-therapy-used-in-rehab https://dallas-detox-center.vercel.app/2022/03/22/group-therapy-used-in-rehab
- **Fix:** Decide which domain owns each topic. Rewrite substantially for the other, or consolidate to one and 301. Do not leave both indexable at the same slugs. Fort Worth blog: https://fort-worth-wellness.vercel.app/blog Dallas blog: https://dallas-detox-center.vercel.app/blog

#### V0106 — `not triaged` · NOT YET VERIFIED

Blog slugs still name Dallas on the Fort Worth domain, even though the body copy now says Fort Worth. One slug contains the sister facility brand name, and another targets Irving, a Dallas suburb rather than a Fort Worth one. The URL and the content therefore target different cities.

- **Where:** https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year (body says Fort Worth 27 times) https://fort-worth-wellness.vercel.app/blog/dallas-detox-center-a-guiding-light-on-your-path-to-recovery (body says Fort Worth 24 times) https://fort-worth-wellness.vercel.app/blog/addiction-rehab-near-irving-texas (Irving is a Dallas suburb)
- **Fix:** Rewrite the slugs to match the content and 301 the old paths. Fix before launch, since renaming after indexing costs the equity twice. Blog index: https://fort-worth-wellness.vercel.app/blog

#### V0107 — `not triaged` · NOT YET VERIFIED · status: WITHDRAW - merge into V0038

Who We Help covers 7 populations as headings on a single 565-word page (Professionals, Veterans, First Responders, Women, Men, Young Adults, College Students), roughly 80 words each, with no child pages. Dallas gives each of the same 7 its own page.

- **Where:** https://fort-worth-wellness.vercel.app/who-we-help
- **Fix:** Split into child pages, using the Dallas set as the model: https://dallas-detox-center.vercel.app/who-we-help/professionals https://dallas-detox-center.vercel.app/who-we-help/veterans https://dallas-detox-center.vercel.app/who-we-help/first-responders https://dallas-detox-center.vercel.app/who-we-help/women https://dallas-detox-center.vercel.app/who-we-help/men https://dallas-detox-center.vercel.app/who-we-help/young-adults https://dallas-detox-center.vercel.app/who-we-help/college-students Page to expand: https://fort-worth-wellness.vercel.app/who-we-help

#### V0108 — `not triaged` · NOT YET VERIFIED

CONFIRM BY DESIGN: the absence of a substance-abuse residential page may be intentional. Fort Worth is positioned as mental-health-first ("Premier Mental Health & Wellness Care in Fort Worth", "Premier psychiatric and behavioral care"), and offers detox then mental health residential and dual diagnosis. If that is the model, the cloned substance-heavy blog is the thing that does not fit, not the missing page.

- **Where:** https://fort-worth-wellness.vercel.app/treatment https://fort-worth-wellness.vercel.app/
- **Fix:** Confirm the clinical scope with the facility, then either build the substance-residential page or prune the blog content that assumes it exists. Compare positioning: https://fort-worth-wellness.vercel.app/ https://dallas-detox-center.vercel.app/

### Greater Texas Behavioral (6)

#### V0043 — `BLOCKED` · CONFIRMED_AMENDED

Wrong facility phone number sitewide. Seaside Wellness's number 855-416-5648 appears on all 5 pages alongside Greater Texas's own 877-590-3665. Two different numbers on every page. Found on the footers admission hotline link

- **Where:** https://greater-texas-behavioral.vercel.app/ https://greater-texas-behavioral.vercel.app/blog https://greater-texas-behavioral.vercel.app/our-story https://greater-texas-behavioral.vercel.app/verify-insurance https://greater-texas-behavioral.vercel.app/what-we-treat
- **Fix:** Remove 855-416-5648 from these pages: https://greater-texas-behavioral.vercel.app/ https://greater-texas-behavioral.vercel.app/blog https://greater-texas-behavioral.vercel.app/our-story https://greater-texas-behavioral.vercel.app/verify-insurance https://greater-texas-behavioral.vercel.app/what-we-treat The number belongs to Seaside, which correctly uses it here: https://seaside-wellness-of-palm-beach.vercel.app/ Cross-check the surviving number against the production domain and GBP: https://greatertexasbehavioral.com
- **Verification correction:** PRIORITY BLOCKED: Confirm with admissions before removing a live tracked number Two corrections, the second one important. 1) INHERITED, NOT INTRODUCED. Production greatertexasbehavioral.com also publishes BOTH numbers. So this is a pre-existing condition, same category as V0041, not a rebuild regression. The row implies the new build created it. 2) The fix may be unsafe as written. It instructs removing 855-416-5648 from all 5 pages. But since both Seaside and Greater Texas are QHG facilities and both have carried this number on production, 855-416-5648 could be a deliberate shared intake line rather than contamination. Deleting a live tracked number that is actually routing calls would lose admissions enquiries. Downgrade the fix to: confirm with the admissions team which number is intended for Greater Texas BEFORE removing either.

#### V0134 — `HIGH` · NEW - Greater Texas deep audit 2026-07-28

PRODUCTION is publishing FLORIDA content on the TEXAS domain, and it is Seaside content specifically. Two posts on greatertexasbehavioral.com target West Palm Beach: /west-palm-beach-addiction-treatment-guide (title "Comprehensive Addiction Treatment in West Palm Beach", "West Palm Beach" x7, "Florida" x3, "Seaside" x6, and "Texas" ZERO times) and /how-to-find-a-luxury-detox (title "Luxury Detox in Palm Beach That Accepts Private Insurance", "Florida" x4, "Texas" ZERO times). Both carry the phone number 855-416-5648, which is Seaside's, and the first is duplicated at the SAME SLUG on seasidewellnesspb.com. The two posts also share an identical H1, "How to Find a Luxury Detox in Palm Beach That Accepts Private Insurance", so one was likely cloned from the other without updating it. THE NEW BUILD CORRECTLY DROPS BOTH - they 404 on the build. So unlike every other missing-page row in this audit, these should NOT be ported.

- **Where:** https://greatertexasbehavioral.com/west-palm-beach-addiction-treatment-guide/ (HTTP 200) https://greatertexasbehavioral.com/how-to-find-a-luxury-detox/ (HTTP 200) Duplicated on Seaside at the same slug: https://seasidewellnesspb.com/west-palm-beach-addiction-treatment-guide/ (HTTP 200) Both return HTTP 404 on https://greater-texas-behavioral.vercel.app - correctly.
- **Fix:** Do NOT port these into the build. Instead: unpublish or 301 them on PRODUCTION to the Seaside equivalents, since the content belongs to that facility and market: https://seasidewellnesspb.com/west-palm-beach-addiction-treatment-guide/ Then confirm the Seaside copy is the canonical one and fix its duplicate H1. This is the second piece of Seaside content found on the Texas domain - see V0043 for the phone number - so it is worth checking whether this site was cloned from Seaside and auditing anything else that carried over.

#### V0135 — `MEDIUM` · NEW - Greater Texas deep audit 2026-07-28

CUTOVER REDIRECT MAP REQUIRED - 4 URL pairs. Three blog posts move from production root /<slug>/ to /blog/<slug>, and the insurance page is renamed from /insurance-verification to /verify-insurance. MIGRATION REQUIREMENT, NOT A DEFECT - internal link integrity on the build is clean: 0 broken across 170 distinct internal URLs, 0 internal redirects, 0 unlisted pages. Smallest redirect map in the portfolio.

- **Where:** /insurance-verification -> /verify-insurance /beyond-the-dry-january-trend-when-brief-abstinence-signals-a-need-for-clinical-intervention -> /blog/<same> /holiday-pressure-and-addiction-when-its-time-to-reach-out-for-help -> /blog/<same> /when-detox-is-the-right-first-step-in-addiction-recovery -> /blog/<same> Build: https://greater-texas-behavioral.vercel.app Production: https://greatertexasbehavioral.com/sitemap_index.xml
- **Fix:** Generate the 4-pair 301 map before cutover. Note the build also adds 3 pages production does not have (/blog index, /blog/comprehensive-addiction-treatment-in-texas, /blog/detox-in-texas-that-accepts-private-insurance) - the latter two are Texas-market posts, which is the correct direction after V0134. Verify: https://greater-texas-behavioral.vercel.app/verify-insurance https://greatertexasbehavioral.com/insurance-verification/

#### V0045 — `LOW` · CONFIRMED_AMENDED

What We Treat hub exists with no child condition pages.

- **Where:** https://greater-texas-behavioral.vercel.app/what-we-treat
- **Fix:** Model on the Seaside condition set: https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat Or remove the empty hub: https://greater-texas-behavioral.vercel.app/what-we-treat
- **Verification correction:** PRIORITY LOW: Downgraded - hub has real content, not empty The word "empty" is wrong and the fix option is bad advice. The page is NOT empty: it has an H1, 13 headings, and substantive sections for "Substance Use Disorders" and "Mental Health Conditions" with in-page anchor navigation (/what-we-treat#substance-use, /what-we-treat#mental-health). So the Fix line "Or remove the empty hub" would delete a working content page. Reword to: single-page treatment overview using in-page anchors rather than child pages. Decide whether to split into child pages for keyword coverage, or keep as one page deliberately.

#### V0047 — `not triaged` · CONFIRMED_AMENDED

og:url is misconfigured or missing on all 11 pages: 4 point at the domain root, 6 have no og:url element at all, 1 is the homepage. Original row described only the 4.

- **Where:** https://greater-texas-behavioral.vercel.app - 4 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://greatertexasbehavioral.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Two corrections. 1) Incomplete scope, same as V0040: only 5 of 11 pages have og:url at all, so 6 have none. Accurate picture is 4 wrong, 6 absent, 1 correct. 2) FIX CITES A URL THAT DOES NOT EXIST. The example given is https://greatertexasbehavioral.com/about, which returns 404. This site uses /our-story, not /about. Replace the example with https://greatertexasbehavioral.com/our-story.

#### V0044 — `CLOSED` · CONFIRMED

Site is a 5-page stub. No treatment hub, no contact page, no admissions page, no tour, no privacy policy.

- **Where:** https://greater-texas-behavioral.vercel.app
- **Fix:** If it is a full facility site, model the page set on a complete build: https://seaside-wellness-of-palm-beach.vercel.app If it is a brand placeholder, keep it out of the launch batch and noindex: https://greatertexasbehavioral.com
- **Verification correction:** PRIORITY CLOSED: By design - virtual provider, stub is inherited none - row accurate as written

### Hillside Mission Recovery (10)

#### V0054 — `CRITICAL` · CONFIRMED_AMENDED

CRITICAL - WRONG PERSON BIOGRAPHY PUBLISHED. /staff/phillip-carter shows headings for "Phillip Carter / Director of Operations" but the body text is Monica Olivares's biography verbatim: "Hi, I'm Monica Olivares - Program Director at Hillside Mission..." The two staff pages are 97.7 percent identical, differing only in the name and title in headings. This misstates who works at the facility and what their credentials are, on a YMYL healthcare site. Secondary defect: the H1 spells "Monica Olivires" while her own bio text spells "Monica Olivares". Original row logged this as routine duplicate content with the parent domain, which hid it.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/staff/monica-olivires https://hillside-mission-recovery-beryl.vercel.app/staff/phillip-carter Also at: https://quadrant-health-group.vercel.app/team/monica-olivires, https://quadrant-health-group.vercel.app/team/phillip-carter
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/monica-olivires https://quadrant-health-group.vercel.app/team/phillip-carter Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** PRIORITY CRITICAL: Wrong person biography on a named staff page, YMYL site REWRITE THIS ROW ENTIRELY. It is not a parent-domain duplicate-content issue. It is the wrong person's biography published on a named staff page of a YMYL healthcare site - a factual misstatement of who works there and what their credentials are. Escalate above every other row verified so far. Secondary defect on the same page set: the H1 spells "Monica Olivires" while her own bio text spells "Monica Olivares".

#### V0061 — `HIGH` · CONFIRMED_AMENDED

Root-level articles are unreachable from the blog index. /blog has no server-side pagination (/blog/page/2 and /blog/2 both 404), so the earlier JS-pagination caveat does not apply. 23 article pages verified with ZERO inbound links anywhere on the site (count corrected from 26 - the original included 2 staff bios and /thank-you). SCOPE IS LARGER THAN MEASURED: the site has 116 root-level article pages and /blog lists only about 9, so roughly 107 are unreachable. Needs re-counting before action.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/blog e.g. /what-is-al-anon, /is-addiction-genetic, /signs-of-benzo-withdrawal, /what-is-drug-detox
- **Fix:** Check pagination behaviour on: https://hillside-mission-recovery-beryl.vercel.app/blog If it does not paginate server-side, move the posts under /blog/ or link them from a topic hub. Compare with a site using /blog/ paths: https://laguna-view-detox.vercel.app/blog
- **Verification correction:** PRIORITY HIGH: Scope larger than written: ~107 articles unreachable, not 23 COUNT WRONG: the row says 26. The real figure is 23 articles. My original 26 included 2 staff bios (covered separately by V0062) and /thank-you, which is not an article.

#### V0122 — `HIGH` · NEW - Hillside deep audit 2026-07-28

One production page is absent from the new build entirely. /what-is-narcan is live on production (HTTP 200, title "What Is Narcan? How It Works & How to Use It") but returns 404 on the build at both root and /blog/. It will 404 at cutover unless built or redirected. Found by diffing production Yoast sitemaps (155 URLs across page, post and staff sitemaps) against the build sitemap (156) - it is the ONLY difference.

- **Where:** https://hillsidemission.com/what-is-narcan/ (HTTP 200) https://hillside-mission-recovery-beryl.vercel.app/what-is-narcan (HTTP 404) https://hillside-mission-recovery-beryl.vercel.app/blog/what-is-narcan (HTTP 404)
- **Fix:** Port the post into the build at /what-is-narcan to match the existing root-level article structure, or 301 the production URL to the closest live page if it is being retired. Nearest existing pages: https://hillside-mission-recovery-beryl.vercel.app/opioids https://hillside-mission-recovery-beryl.vercel.app/fentanyl Naloxone/Narcan content is high-intent harm-reduction information, so retiring it rather than porting it is worth a deliberate decision.

#### V0060 — `ENHANCEMENT` · CONFIRMED_AMENDED

ENHANCEMENT, NOT A DEFECT - severity corrected on verification. No /areas-we-serve landing page exists (404 on preview and production). However all 12 city pages have 155 inbound internal links each because they sit in the site-wide nav dropdown, so there is no crawl or discovery problem. A hub is optional topical consolidation. Contrast with V0020, where the equivalent Dallas pages have ZERO inbound links.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/mission-viejo-rehab https://hillside-mission-recovery-beryl.vercel.app/orange-county https://hillside-mission-recovery-beryl.vercel.app/newport-beach https://hillside-mission-recovery-beryl.vercel.app/irvine https://hillside-mission-recovery-beryl.vercel.app/dana-point https://hillside-mission-recovery-beryl.vercel.app/san-clemente https://hillside-mission-recovery-beryl.vercel.app/san-juan-capistrano https://hillside-mission-recovery-beryl.vercel.app/lake-forest https://hillside-mission-recovery-beryl.vercel.app/costa-mesa https://hillside-mission-recovery-beryl.vercel.app/anaheim https://hillside-mission-recovery-beryl.vercel.app/long-beach https://hillside-mission-recovery-beryl.vercel.app/seal-beach
- **Fix:** Create this hub and link all 12: https://hillside-mission-recovery-beryl.vercel.app/areas-we-serve Model on: https://wellness-recovery-nj.vercel.app/areas-we-serve
- **Verification correction:** PRIORITY ENHANCEMENT: Downgraded - 155 inbound links each, no crawl problem FRAMING IS MISLEADING AND SEVERITY IS WRONG. I generated this row inside the orphan section, and it reads alongside genuine orphans, implying these pages are poorly linked. They are the most-linked pages on the site - 155 inbound links each, i.e. every page links every one of them. There is no crawl or discovery problem whatsoever. The Fix is also wrong: "Create this hub and link all 12" implies linking is needed. It is not. Reword to: no /areas-we-serve landing page exists; the 12 city pages are fully linked from the global nav. Adding a hub is an optional consolidation for topical grouping, not a fix. Downgrade from issue to enhancement.

#### V0055 — `not triaged` · CONFIRMED_AMENDED

No dedicated verify-insurance page. Every "Verify Insurance" button sitewide points to /admissions.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/admissions
- **Fix:** Build this page: https://hillside-mission-recovery-beryl.vercel.app/verify-insurance Model on: https://ocean-coast-recovery-center.vercel.app/insurance Or relabel the buttons to match their current destination: https://hillside-mission-recovery-beryl.vercel.app/admissions
- **Verification correction:** Add that it is inherited: production hillsidemission.com also has no verify page (/verify-insurance and /insurance both 404 there). So this is a pre-existing gap, not a rebuild omission - same framing as V0041, V0043 and V0048.

#### V0056 — `not triaged` · CONFIRMED

Footer What We Treat list shows 6 of 7 condition pages - /prescription-drugs is omitted.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/ (footer) Omitted: https://hillside-mission-recovery-beryl.vercel.app/prescription-drugs
- **Fix:** Add this live page to the footer list on every template: https://hillside-mission-recovery-beryl.vercel.app/prescription-drugs (verified live, HTTP 200)

#### V0057 — `not triaged` · CONFIRMED_AMENDED

No Who We Help hub. Population pages sit at root (/women, /men, /first-responders) while Executives sits under /treatment/, so one section uses two different URL patterns.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/women https://hillside-mission-recovery-beryl.vercel.app/treatment/executives-rehab-in-mission-viejo
- **Fix:** Create this hub: https://hillside-mission-recovery-beryl.vercel.app/who-we-help Move these beneath it with 301s: https://hillside-mission-recovery-beryl.vercel.app/women https://hillside-mission-recovery-beryl.vercel.app/men https://hillside-mission-recovery-beryl.vercel.app/first-responders https://hillside-mission-recovery-beryl.vercel.app/treatment/executives-rehab-in-mission-viejo Model on: https://ocean-coast-recovery-center.vercel.app/who-we-help
- **Verification correction:** Two additions. 1) INHERITED plus MIGRATION COST. Production has the identical split: hillsidemission.com/who-we-help 404s while /women, /men, /first-responders and /treatment/executives-rehab-in-mission-viejo all 301 to their trailing-slash forms. So these are established production URLs, and moving them under a hub means redirecting live pages. Same cost issue flagged in V0051, and the row does not mention it. 2) Hillside has only 4 population pages, not 7. /professionals, /veterans, /young-adults and /college-students all 404. The Fix cites the Ocean Coast hub as a model, which is fine, but anyone comparing to the Dallas set should know 3 of those populations do not exist here and would have to be written from scratch.

#### V0058 — `not triaged` · CONFIRMED_AMENDED

Missing canonical tag on 6 of 156 pages: /, /about, /admissions, /blog, /contact, /tour. Those same 6 pages also carry NO robots meta (original row wrongly said "index, follow"), so they are indexable by default. The 6 missing a canonical are exactly the 6 missing a robots meta, indicating one shared top-level-page template rather than 6 separate oversights.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app - 6 of 156 pages: /, /about, /admissions, /blog and 2 more
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://hillsidemission.com Affected build: https://hillside-mission-recovery-beryl.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** One factual error in the row text. It states these pages carry a robots meta of "index, follow". They carry NO robots meta at all - all 6 returned None. The conclusion is unaffected, since absent robots defaults to indexable, but the stated evidence is wrong and should be corrected to "no robots meta, therefore indexable by default". Note the pattern: the 6 pages missing a canonical are exactly the 6 missing a robots meta, which points to one shared template for top-level pages rather than 6 separate oversights. That makes it a single-template fix.

#### V0059 — `not triaged` · CONFIRMED_AMENDED · status: MERGE with V0083, V0087

1 live page(s) returning 200 but absent from sitemap.xml, so they will not be submitted for indexing.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/blog/what-to-expect-first-30-days-of-treatment
- **Fix:** Add these URLs to: https://hillside-mission-recovery-beryl.vercel.app/sitemap.xml Or noindex them if the omission is intentional.
- **Verification correction:** The row describes the smaller problem. The serious defect is that this page canonicals to https://hillsidemission.com/blog/what-to-expect-first-30-days-of-treatment, which returns 404 on production. A canonical pointing at a non-existent URL tells search engines the authoritative version does not exist, which is worse than being left out of a sitemap. Reframe the row around the broken canonical. Also: this same post is on 3 sites and absent from all 3 sitemaps, but each fails differently - Hillside canonicals to a 404; Ocean Coast canonicals to its DOMAIN ROOT rather than the post; Wellness NJ has no canonical at all. It looks like a new post added to three builds without sitemap or canonical wiring.

#### V0062 — `not triaged` · CONFIRMED

2 staff bio pages are orphaned - no team hub page links them.

- **Where:** https://hillside-mission-recovery-beryl.vercel.app/staff/monica-olivires https://hillside-mission-recovery-beryl.vercel.app/staff/phillip-carter
- **Fix:** Build this hub and link both: https://hillside-mission-recovery-beryl.vercel.app/team Model on: https://quadrant-health-group.vercel.app/about/meet-the-team

### Laguna View Detox (10)

#### V0115 — `HIGH` · NEW - found during verification

Canonical points at a page that does not exist. /insurance canonicals to https://lagunaviewdetox.com/insurance, which returns HTTP 404 on production, telling search engines the authoritative version of the page is absent.

- **Where:** https://laguna-view-detox.vercel.app/insurance canonical target https://lagunaviewdetox.com/insurance (HTTP 404)
- **Fix:** Point the canonical at a live URL, or create the production page. Verify the target resolves before shipping. Page to fix: https://laguna-view-detox.vercel.app/insurance

#### V0119 — `HIGH` · NEW - Laguna deep audit 2026-07-28

Three blog posts use slugs that production has already RETIRED. ROOT CAUSE NOW IDENTIFIED: production renamed these three slugs on 2026-07-16, one day after the build snapshot, and 301-redirects the old spellings to the corrected ones. So the build is not carrying an old export - it predates the rename. Titles and H1s in the build are spelled correctly; only the slugs are stale. Verified across all 158 preview blog slugs: 154 match production exactly, 3 are stale. This is one instance of the portfolio-wide snapshot gap - see the ALL SITES cutover content gap row.

- **Where:** https://laguna-view-detox.vercel.app/blog/why-is-crystal-math-addictive production 301s /why-is-crystal-math-addictive/ -> /why-is-crystal-meth-addictive/ https://laguna-view-detox.vercel.app/blog/use-your-gilsbar-health-insurance-to-treat-your-addicition production 301s -> /use-your-gilsbar-health-insurance-to-treat-your-addiction/ https://laguna-view-detox.vercel.app/blog/addiction-in-the-families-and-love-ones production 301s -> /addiction-in-families-and-loved-ones/
- **Fix:** Rename the 3 slugs to match the corrected production spellings, then 301 the misspelled forms so the existing production redirects are preserved rather than reversed: https://lagunaviewdetox.com/why-is-crystal-meth-addictive/ https://lagunaviewdetox.com/use-your-gilsbar-health-insurance-to-treat-your-addiction/ https://lagunaviewdetox.com/addiction-in-families-and-loved-ones/ "Crystal math" is the priority - it is a substance page on a treatment site.
- **Verification correction:** AMENDED 2026-07-28: originally attributed to a pre-correction export. Production lastmod data shows the renames happened 2026-07-16, after the snapshot. Same single cause as V0120, V0122 and the ALL SITES gap.

#### V0120 — `HIGH` · NEW - Laguna deep audit 2026-07-28

One production page is absent from the new build entirely. It is live on production (HTTP 200, title "Luxury Drug Rehab: What Five-Star Recovery Really Looks Like") but returns 404 on the new build at BOTH /blog/<slug> and root. It will 404 at cutover unless built or redirected. Found by diffing production Yoast sitemaps (202 URLs) against the build sitemap (205) - it is the only genuine content gap of the 29 differences.

- **Where:** https://lagunaviewdetox.com/luxury-drug-rehab-what-five-star-recovery-really-looks-like/ (HTTP 200) https://laguna-view-detox.vercel.app/blog/luxury-drug-rehab-what-five-star-recovery-really-looks-like (HTTP 404) https://laguna-view-detox.vercel.app/luxury-drug-rehab-what-five-star-recovery-really-looks-like (HTTP 404)
- **Fix:** Either port the post into the new build at /blog/luxury-drug-rehab-what-five-star-recovery-really-looks-like, or decide it is retired and 301 the production URL to the closest live page: https://laguna-view-detox.vercel.app/luxury-rehab Do not leave it unmapped - it is currently an indexed production URL.

#### V0121 — `HIGH` · NEW - Laguna deep audit 2026-07-28

CUTOVER REDIRECT MAP REQUIRED - 182 URL pairs, now fully mapped. 158 blog posts move from production root /<slug>/ to /blog/<slug> (the intended new structure), and 24 pages move into new subfolders: 7 insurance pages to /insurance/, 6 city pages to /locations/, 7 population pages to /who-we-treat/, and 4 about/bio pages to /about/. NOTE this is a migration requirement, not a defect. Internal link integrity on the new build is CLEAN - 0 broken across 305 distinct internal URLs including images, scripts, stylesheets, iframes and form actions - so the redirect map is the remaining cutover risk, not broken links.

- **Where:** https://laguna-view-detox.vercel.app - all 205 pages https://lagunaviewdetox.com/post-sitemap.xml (158 posts) https://lagunaviewdetox.com/page-sitemap.xml (44 pages) Examples: /anthem -> /insurance/anthem | /los-angeles -> /locations/los-angeles | /women -> /who-we-treat/women | /about-us -> /about | /orange-county-drug-rehab -> /locations/orange-county
- **Fix:** Generate the 182-pair 301 map before cutover. Sequence it with V0102 (trailing slash) since production is slash-canonical and the build is slashless - both belong in one redirect config rather than two passes. Build: https://laguna-view-detox.vercel.app Production: https://lagunaviewdetox.com

#### V0063 — `not triaged` · CONFIRMED_AMENDED

Header nav links /luxury-rehab while the footer links /luxury-addiction-treatment, and the two pages carry near-identical title targeting ("Luxury Drug Treatment Center" vs "Luxury Addiction Treatment"), so they compete for the same queries. They are NOT duplicate content - measured 17.8 percent word-level overlap, 1,508 words vs 692. Original row implied duplication and recommended a 301 that would delete a distinct page.

- **Where:** https://laguna-view-detox.vercel.app/luxury-rehab https://laguna-view-detox.vercel.app/luxury-addiction-treatment
- **Fix:** Keep this page: https://laguna-view-detox.vercel.app/luxury-rehab (verified live, HTTP 200. It is also the canonical URL in production: https://lagunaviewdetox.com/luxury-rehab) 301 this page to it: https://laguna-view-detox.vercel.app/luxury-addiction-treatment Then correct the footer link on every template.
- **Verification correction:** They are NOT duplicate content. Measured 6.5 percent 8-gram and 17.8 percent word-level overlap - about 82 percent different text. /luxury-rehab is 1,508 words; /luxury-addiction-treatment is 692. So the 301 in the Fix would delete a distinct 692-word page that exists on production with its own canonical. Reword the issue from "competing for the same topic" to what is actually provable: near-identical title targeting (genuine cannibalisation risk) plus an inconsistent header-versus-footer link. Change the fix from "301 one to the other" to "consolidate OR differentiate the titles, and make the header and footer agree" - and note that a 301 loses distinct content.

#### V0064 — `not triaged` · CONFIRMED_AMENDED

Footer internal-linking priority is inverted. The footer links two thin root-level pages (/drug-addiction-treatment 513 words, /alcohol-detox-and-treatment-programs 594 words) while /treatment/detoxification/alcohol (1,038 words) is not in the footer at all. These are NOT duplicates - measured 23.5 and 26.7 percent word-level overlap with the service pages.

- **Where:** https://laguna-view-detox.vercel.app/drug-addiction-treatment https://laguna-view-detox.vercel.app/alcohol-detox-and-treatment-programs
- **Fix:** Service pages that should own these topics: https://laguna-view-detox.vercel.app/treatment/detoxification https://laguna-view-detox.vercel.app/treatment/detoxification/alcohol 301 the duplicates to them, then correct the footer.
- **Verification correction:** The word "duplicate" is wrong. Measured overlap against the service pages is 23.5 percent and 26.7 percent word-level - these are distinct pages, not duplicates. The real defect is the opposite of what the row says, and it is sharper: the footer promotes the THIN pages over the substantial ones. /drug-addiction-treatment is 513 words and /alcohol-detox-and-treatment-programs is 594, while the service pages they overlap are 1,251 and 1,038 words. And /treatment/detoxification/alcohol is NOT in the footer at all, while the 594-word root version is. So internal linking priority is inverted. Reword to that, and drop the 301 recommendation, which would remove live production URLs.

#### V0065 — `not triaged` · CONFIRMED_AMENDED

1 staff bio page(s) also published on the Quadrant parent domain - duplicate content across two domains.

- **Where:** https://laguna-view-detox.vercel.app/about/karen-pettit Also at: https://quadrant-health-group.vercel.app/team/karen-pettit
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/karen-pettit Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** Same correction as the other bio rows: the facility side is already configured correctly, so the action is parent-only, not both sides. At 55.5 percent this is the borderline case of the five near-duplicates, so if a threshold is applied this is the one most arguable to drop.

#### V0066 — `not triaged` · CONFIRMED

Footer Who We Treat list shows 5 of 7 population pages - young adults and college students are omitted.

- **Where:** https://laguna-view-detox.vercel.app/ (footer) Omitted: /who-we-treat/young-adults, /who-we-treat/college-students
- **Fix:** Add these live pages to the footer list on every template: https://laguna-view-detox.vercel.app/who-we-treat/young-adults https://laguna-view-detox.vercel.app/who-we-treat/college-students (both verified live, HTTP 200)

#### V0067 — `not triaged` · CONFIRMED_AMENDED

Missing canonical tag on 1 of 205 pages (/blog), which carries NO robots meta (original row wrongly said "index, follow"). Separately and more seriously: of the 46 structural pages, 43 canonicals point at URLs that 301 and 1 points at a 404, so only 1 resolves cleanly. Laguna must NOT be used as the canonical reference build - it is cited as the model in every canonical row and is one of the worst configured.

- **Where:** https://laguna-view-detox.vercel.app - /blog only, 1 of 205 pages
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://lagunaviewdetox.com Affected build: https://laguna-view-detox.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** Two corrections, the second one affects several other rows. 1) Same wording error as V0058: the row says these pages carry a robots meta of "index, follow". /blog has NO robots meta (returned None). Correct to "no robots meta, indexable by default". 2) THE FIX CITES A BROKEN EXAMPLE. It offers Laguna /about as the "working example to copy", but that canonical points to https://lagunaviewdetox.com/about which returns 301, not 200. Measured across all 46 Laguna structural pages: 43 canonicals point at 301s, 1 at a 404, and only 1 resolves to 200. So Laguna is not a good model at all. I used this same example in the Fix text of EVERY canonical row - V0018, V0039, V0058 and V0067 - so all four need that line replaced. Marina Harbor or Ocean Beach are the sites whose canonical targets actually resolve.

#### V0068 — `CLOSED` · BY_DESIGN · status: CLOSE - by design

1 live page(s) returning 200 but absent from sitemap.xml, so they will not be submitted for indexing.

- **Where:** https://laguna-view-detox.vercel.app/privacy-policy
- **Fix:** Add these URLs to: https://laguna-view-detox.vercel.app/sitemap.xml Or noindex them if the omission is intentional.
- **Verification correction:** PRIORITY CLOSED: By design - noindex page correctly excluded from sitemap Close this row as no-action. The Fix hedges with "or noindex them if the omission is intentional", which technically covers it, but the row is framed as a defect and would send someone to add a noindex page to the sitemap - the wrong action.

### Marina Harbor Detox (7)

#### V0048 — `BLOCKED` · CONFIRMED_AMENDED

Wrong facility phone number on homepage. Laguna View Detox's number 866-932-3206 is used on a mid-page CTA ('Call 866-932-3206') while the rest of the site correctly uses 866-525-3026.

- **Where:** https://marina-harbor-detox.vercel.app/ (mid-page admissions CTA)
- **Fix:** Replace 866-932-3206 with 866-525-3026 in the CTA block on: https://marina-harbor-detox.vercel.app/ The number belongs to Laguna View Detox, which correctly uses it here: https://laguna-view-detox.vercel.app/ Cross-check against the production domain and GBP: https://marinaharbordetox.com
- **Verification correction:** PRIORITY BLOCKED: Confirm with admissions before removing a live tracked number INHERITED, NOT INTRODUCED. Production marinaharbordetox.com carries the same number on its homepage, anchor "Call Us At 866-932-3206". So this is pre-existing, not a rebuild regression, same as V0041 and V0043. Apply the V0043 caution before deleting: confirm with admissions that 866-932-3206 is not a deliberate shared or overflow line. Contamination is the more likely reading here than in V0043, since Laguna Beach and San Francisco are different markets, but it is still a live number and worth one confirmation.

#### V0049 — `BLOCKED` · CONFIRMED_AMENDED

Third unverified phone number on homepage. 415-868-3858 appears on a 'Call Us Now' link. Three different numbers on one page breaks call attribution.

- **Where:** https://marina-harbor-detox.vercel.app/ ('Call Us Now' link)
- **Fix:** Confirm whether 415-868-3858 is a legitimate local line on: https://marina-harbor-detox.vercel.app/ If it is not the tracked number, replace with 866-525-3026 as used sitewide, e.g.: https://marina-harbor-detox.vercel.app/contact-location Cross-check against the production domain and GBP: https://marinaharbordetox.com
- **Verification correction:** PRIORITY BLOCKED: Number is likely a legitimate local SF line, do not replace Row calls it "unverified" and implies it may be an error. Evidence says it is most likely legitimate: 1) On production its anchor is literally "Call Now Button", the name of the WordPress Call Now Button plugin, so it is a deliberately configured mobile click-to-call line, not stray text. 2) Area code 415 matches the facility city - Marina Harbor is at 289 Marina Blvd, San Francisco. 3) It is on production in two places, so it is long-standing. Reword from "unverified third number" to: a real local SF line configured in the mobile call button, inconsistent with the tracked 866 number used everywhere else. The issue is attribution consistency, not contamination. Do NOT simply replace it, which is what the Fix currently suggests as an option.

#### V0123 — `MEDIUM` · NEW - Marina Harbor deep audit 2026-07-28

Three production blog posts are absent from the new build. All three are OLD content - published 2021-08-26 and last modified 2023 - so unlike the portfolio snapshot gap (see the ALL SITES row) these were dropped during migration rather than published after the build was cut. All three are live and indexable on production and will 404 at cutover. Internal link integrity on the build is otherwise clean: 0 broken across 1,374 internal URLs collapsing to 141 base paths, and 0 path changes versus production.

- **Where:** https://marinaharbordetox.com/2021/08/26/depression-anxiety-and-substance/ (HTTP 200) https://marinaharbordetox.com/2021/08/26/marina-harbor-detox/ (HTTP 200) https://marinaharbordetox.com/2021/08/26/the-importance-of-in-person-addiction/ (HTTP 200) All three return HTTP 404 on the build at both the dated path and /blog/<slug>.
- **Fix:** Decide per post: port into the build at the same dated path to preserve the URL, or 301 to the closest live page if retiring. Do not leave unmapped. Build blog index: https://marina-harbor-detox.vercel.app/blog Build archive: https://marina-harbor-detox.vercel.app/blog/archive Note these are 5-year-old posts, so retiring may be the right call - but it should be a decision, not an accident.

#### V0050 — `not triaged` · CONFIRMED_AMENDED

1 staff bio page(s) also published on the Quadrant parent domain - duplicate content across two domains. Additionally, Gus Saadeh's picture on the Marina Harbor site does not populate

- **Where:** https://marina-harbor-detox.vercel.app/about/gus-saadeh Also at: https://quadrant-health-group.vercel.app/team/gus-saadeh
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/gus-saadeh Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** Two refinements. 1) Not a verbatim duplicate. The intros differ - the facility page opens "Meet Gus Saadeh, Operations..." while the parent opens "Director of Operations. As the Director of Operations at Marina Harbor Detox...". At 76 percent word-level they are near-duplicates, not copies, so describe it that way. 2) The fix is already half-implemented and the row does not say so. The Marina Harbor page ALREADY canonicals correctly to https://marinaharbordetox.com/about/gus-saadeh/. The parent copy has NO canonical at all. So the action is specifically on the parent, not both sides: add a cross-domain canonical there, or replace it with a link. This also matches V0039-style findings, since the parent has no canonicals anywhere.

#### V0051 — `not triaged` · CONFIRMED_AMENDED

Multiple non-standard slugs: /admission (singular), /contact-location, /facility instead of /tour, /care-providers instead of a team hub, /aftercare at root.

- **Where:** https://marina-harbor-detox.vercel.app
- **Fix:** Current URLs with the recommended standard beside each: https://marina-harbor-detox.vercel.app/admission -> /admissions https://marina-harbor-detox.vercel.app/contact-location -> /contact https://marina-harbor-detox.vercel.app/facility -> /tour https://marina-harbor-detox.vercel.app/care-providers -> /about/meet-the-team https://marina-harbor-detox.vercel.app/aftercare -> /treatment/aftercare https://marina-harbor-detox.vercel.app/what-we-offer -> /treatment Reference build using the standard: https://ocean-coast-recovery-center.vercel.app/treatment
- **Verification correction:** Three corrections. 1) MISSING COST. All 6 slugs also exist on PRODUCTION (each returns 301 to its trailing-slash form). These are not rebuild inventions - they are the established production URL structure with accumulated equity and inbound links. Renaming means redirecting long-standing URLs. The row presents standardisation as free; it is not. That cost belongs in the row so the decision is informed. 2) "/care-providers instead of a team hub" is wrong - it IS a functioning team hub. H1 "Care Providers", and it links both bios (/about/alicia-joslin, /about/gus-saadeh). Only the name is non-standard. Worth noting this also means Marina Harbor bios are NOT orphaned, unlike Dallas and Hillside. 3) "/facility instead of /tour" is accurate but understates it: the page title is "San Francisco Detox Center Facility Tour" with 12 images, so it is a fully built tour page, just named /facility.

#### V0053 — `not triaged` · CONFIRMED

og:url points at the domain root on 2 of 118 pages instead of the page own URL, so every affected page declares itself as the homepage to social platforms and to any crawler using og:url as a URL hint.

- **Where:** https://marina-harbor-detox.vercel.app - 2 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://marinaharbordetox.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Minor only: the Fix cites https://marinaharbordetox.com/about, which returns 301 to the trailing-slash form rather than 200. Cite /about/ to match production convention.

#### V0052 — `CLOSED` · BY_DESIGN · status: CLOSE - by design

CONFIRM BY DESIGN: detox and residential pages exist but under geo/descriptive slugs (/what-we-offer/detox-san-francisco, /what-we-offer/inpatient-rehab-san-francisco) rather than standard names, so automated checks read them as missing.

- **Where:** https://marina-harbor-detox.vercel.app/what-we-offer
- **Fix:** No page to build. Existing equivalents: https://marina-harbor-detox.vercel.app/what-we-offer/detox-san-francisco https://marina-harbor-detox.vercel.app/what-we-offer/inpatient-rehab-san-francisco Fold into the slug standardisation rows.
- **Verification correction:** PRIORITY CLOSED: By design - pages exist under geo slugs One refinement. The row implies geo-suffixed naming is the pattern for this section. It is actually the minority: of 13 children under /what-we-offer, 10 use standard names (alcohol-detox, drug-detox, meth-detox, heroin-detox, cocaine-detox, benzodiazepines-detox, prescription-drugs-detox, suboxone-detox, dual-diagnosis, holistic-addiction-therapy) and only 3 are geo-suffixed (detox-san-francisco, inpatient-rehab-san-francisco, drug-rehab-marin-county). So the inconsistency is WITHIN the section, which is a sharper point than the row makes.

### Ocean Coast Recovery (6)

#### V0109 — `CRITICAL` · NEW - found during verification

CRITICAL - 106 of 107 pages canonical to the DOMAIN ROOT instead of themselves. Every page except the homepage tells search engines its authoritative version is oceancoastrecovery.com. Zero pages are self-referencing. A wrong canonical is worse than a missing one: missing leaves attribution ambiguous, root-pointing actively instructs consolidation into the homepage, which would deindex 106 pages. og:url carries the identical wrong value on all 38 pages that have it, so it is one template error feeding both tags.

- **Where:** https://ocean-coast-recovery-center.vercel.app - 106 of 107 pages e.g. https://ocean-coast-recovery-center.vercel.app/about canonical = https://oceancoastrecovery.com e.g. https://ocean-coast-recovery-center.vercel.app/treatment/detox canonical = https://oceancoastrecovery.com
- **Fix:** Change the canonical template to emit the PAGE URL, not the site URL. Fix og:url in the same change. Correct pattern to copy: https://marina-harbor-detox.vercel.app/about canonicals to https://marinaharbordetox.com/about/ Do NOT copy Laguna, which points 43 of 46 canonicals at redirects (V0067).

#### V0086 — `HIGH` · CONFIRMED_AMENDED

2 staff bio page(s) also published on the Quadrant parent domain - duplicate content across two domains.

- **Where:** https://ocean-coast-recovery-center.vercel.app/about/elizabeth-wald https://ocean-coast-recovery-center.vercel.app/about/tami-distefano Also at: https://quadrant-health-group.vercel.app/team/elizabeth-wald, https://quadrant-health-group.vercel.app/team/tami-distefano
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/elizabeth-wald https://quadrant-health-group.vercel.app/team/tami-distefano Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** PRIORITY HIGH: Fix unsafe as written; see V0109 THE FIX IS UNSAFE HERE, for a reason that turns out to be far bigger than this row. The Fix says "the facility site owns the bio and the parent links to it". But the Ocean Coast bio pages canonical to https://oceancoastrecovery.com - the DOMAIN ROOT, not themselves. So the facility page does not "own" anything; it currently disclaims itself in favour of the homepage. Pointing the parent at it would compound the error. MEASURED SITEWIDE: 106 of 107 Ocean Coast pages canonical to the domain root. Zero pages are self-referencing. Every page except the homepage tells search engines its authoritative version is the homepage.

#### V0125 — `HIGH` · NEW - Ocean Coast deep audit 2026-07-28

CUTOVER REDIRECT MAP REQUIRED - 92 URL pairs, now fully mapped. Breakdown: 69 blog posts move from production root /<slug>/ to /blog/<slug>; 7 population pages move to /who-we-help/; 6 insurance pages move to /insurance/; 2 bios move from /about-us/ to /about/; and 8 treatment pages are renamed, including 7 from /treatment/detoxification-old/ to /treatment/detox/. Four further renames confirmed live on both sides: /about-us to /about, /tour-facility to /tour, /treatment/detoxification to /treatment/detox, and /treatment/residential-inpatient to /treatment/residential. MIGRATION REQUIREMENT, NOT A DEFECT - internal link integrity on the build is clean: 0 broken across 471 distinct internal URLs including images, scripts, stylesheets and form actions, and 0 internal redirects.

- **Where:** https://ocean-coast-recovery-center.vercel.app - all 107 pages https://oceancoastrecovery.com/sitemap_index.xml Examples: /am-i-an-alcoholic -> /blog/am-i-an-alcoholic /first-responders -> /who-we-help/first-responders /bcbs -> /insurance/bcbs /about-us/elizabeth-wald -> /about/elizabeth-wald /treatment/detoxification-old/alcohol -> /treatment/detox/alcohol /prescription-drugs -> /treatment/detox/prescription-drugs
- **Fix:** Generate the 92-pair 301 map before cutover. Sequence with V0102 (trailing slash) and V0109 (canonical template) so all three land in one redirect and canonical config rather than three passes. Build: https://ocean-coast-recovery-center.vercel.app Production: https://oceancoastrecovery.com Note V0109 must be fixed FIRST or the new URLs will inherit canonicals pointing at the homepage.

#### V0126 — `MEDIUM` · NEW - Ocean Coast deep audit 2026-07-28

PRODUCTION is publicly serving 7 substance detox pages on URLs literally containing "-old", and they are the LIVE canonical versions, not leftovers: /treatment/detoxification-old/{alcohol, benzodiazepines, cocaine, fentanyl, heroin, meth, xanax}. Verified all return HTTP 200 with robots "index, follow" and are listed in the production sitemap, while the non-old equivalents (/treatment/detoxification/alcohol etc.) return 404. So these are the pages currently ranking, with "-old" visible in the URL to every searcher and visitor. The new build fixes this by moving them to /treatment/detox/<substance>, so cutover resolves it - but it is a live issue on production until then.

- **Where:** https://oceancoastrecovery.com/treatment/detoxification-old/alcohol/ (HTTP 200, index follow) https://oceancoastrecovery.com/treatment/detoxification-old/benzodiazepines/ https://oceancoastrecovery.com/treatment/detoxification-old/cocaine/ https://oceancoastrecovery.com/treatment/detoxification-old/fentanyl/ https://oceancoastrecovery.com/treatment/detoxification-old/heroin/ https://oceancoastrecovery.com/treatment/detoxification-old/meth/ https://oceancoastrecovery.com/treatment/detoxification-old/xanax/ Build equivalents (all HTTP 200): https://ocean-coast-recovery-center.vercel.app/treatment/detox/alcohol etc.
- **Fix:** Covered at cutover by the V0125 redirect map. If cutover is more than a few weeks out, consider renaming on production now with 301s, since these are high-intent substance pages carrying a visibly stale URL. Target structure already built and live: https://ocean-coast-recovery-center.vercel.app/treatment/detox/alcohol https://ocean-coast-recovery-center.vercel.app/treatment/detox/fentanyl

#### V0087 — `not triaged` · CONFIRMED_AMENDED · status: MERGE with V0059, V0083

1 live page(s) returning 200 but absent from sitemap.xml, so they will not be submitted for indexing.

- **Where:** https://ocean-coast-recovery-center.vercel.app/blog/what-to-expect-first-30-days-of-treatment
- **Fix:** Add these URLs to: https://ocean-coast-recovery-center.vercel.app/sitemap.xml Or noindex them if the omission is intentional.
- **Verification correction:** MERGE per V0059 - this is the second of the three instances of the same post. Its canonical points to https://oceancoastrecovery.com, the domain root, which I originally logged as a distinct oddity. It is now explained: Ocean Coast does this on 106 of 107 pages (see V0086), so it is not specific to this post. That means the consolidated row should describe TWO root causes, not one: (a) the post was added to three builds without sitemap wiring, and (b) each site then applied its own broken canonical behaviour to it.

#### V0088 — `not triaged` · CONFIRMED_AMENDED

og:url is misconfigured or missing on all 107 pages: 37 point at the domain root, 69 have no og:url element at all. SAME ROOT CAUSE AS THE CANONICAL DEFECT - on all 38 pages carrying both tags, og:url and canonical hold the identical domain-root value, so one template is emitting the site URL where the page URL belongs. Should be fixed as one template change alongside the canonical row, not separately.

- **Where:** https://ocean-coast-recovery-center.vercel.app - 37 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://oceancoastrecovery.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Two corrections. 1) Scope, same as V0040/V0047/V0077/V0085: 37 wrong, 69 absent, 1 homepage. No page has a correct og:url. 2) SAME ROOT CAUSE AS THE CANONICAL DEFECT, which the row does not connect. On all 38 pages that have both tags, og:url and canonical carry the IDENTICAL value - the domain root. So one template is emitting the site URL where the page URL belongs, and it is feeding both tags. Fixing them separately would be duplicated work; this row should be merged into the Ocean Coast canonical row as a single template fix.

### Quadrant Health Group (parent) (7)

#### V0127 — `CRITICAL` · NEW - QHG parent deep audit 2026-07-28

SEVEN production pages were dropped from the build, including the entire admissions funnel. All seven return HTTP 200 on production and 404 on the build, and none exists under an alternative slug - checked /faq, /our-story, /alumni, /verify-insurance, /insurance and /admissions/process, all 404. THIS REFRAMES THREE EARLIER ROWS: V0096 (no verify-insurance page), V0099 (no FAQ page) and V0095 (no aftercare or alumni page) recorded these as gaps to build from scratch. They are not - the content already exists on production and was lost in migration. That makes them a regression to port, which is far cheaper than authoring new pages.

- **Where:** https://quadranthealthgroup.com/about/alumni/ "Alumni Program" https://quadranthealthgroup.com/about/faq/ "Quadrant Health Group FAQ | Treatment, Admissions & Insurance" https://quadranthealthgroup.com/about/our-story/ "Our Story | How Quadrant Health Group Began" https://quadranthealthgroup.com/admissions/admissions-process/ "Admissions Process for Addiction Treatment" https://quadranthealthgroup.com/admissions/help-for-loved-one/ "Help a Loved One | Addiction & Mental Health Support" https://quadranthealthgroup.com/admissions/help-for-yourself/ "Get Help for Addiction & Mental Health" https://quadranthealthgroup.com/admissions/insurance-verification/ "Insurance Verification for Treatment" All seven return HTTP 404 on https://quadrant-health-group.vercel.app at the same paths.
- **Fix:** Port all seven from production into the build. Four of them are the conversion path - admissions process, help for yourself, help for a loved one, and insurance verification - so launching without them removes the parent site primary enquiry routes. Existing build sections to place them under: https://quadrant-health-group.vercel.app/about https://quadrant-health-group.vercel.app/admissions Then close V0096 and V0099 as duplicates of this row, and revise V0095 to cover only the facilities that genuinely lack an aftercare page.

#### V0092 — `HIGH` · CONFIRMED

Missing canonical tag on 92 page(s) (all 92 pages, 100 percent). Verified that the preview serves robots.txt with "Allow: /", a robots meta of "index, follow" and no X-Robots-Tag header, so these pages are fully indexable. The production domain is live and self-canonicalising, so any preview page that gets discovered competes with its production twin as a near-duplicate.

- **Where:** https://quadrant-health-group.vercel.app - all 92 pages, 100 percent
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://quadranthealthgroup.com Affected build: https://quadrant-health-group.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** PRIORITY HIGH: 100 percent of pages missing canonical none - row accurate as written

#### V0128 — `HIGH` · NEW - QHG parent deep audit 2026-07-28

CUTOVER REDIRECT MAP REQUIRED - 16 URL pairs. Eight facility location pages are renamed from short forms to full facility names, seven blog posts move from dated /YYYY/MM/DD/ paths to /blog/<slug>, and the blog index moves from /about/blog to /blog. MIGRATION REQUIREMENT, NOT A DEFECT - internal link integrity on the build is clean: 0 broken across 949 distinct internal URLs collapsing to 128 base paths, and 0 internal redirects.

- **Where:** /locations/dallas -> /locations/dallas-detox-center /locations/hillside -> /locations/hillside-mission-recovery /locations/laguna -> /locations/laguna-view-detox /locations/marina -> /locations/marina-harbor-detox /locations/ocean-coast -> /locations/ocean-coast-recovery /locations/seaside -> /locations/seaside-wellness /locations/wellness-la -> /locations/wellness-detox-la /locations/wellness-nj -> /locations/wellness-recovery-nj /about/blog -> /blog plus 7 dated posts, e.g. /2026/04/21/how-opiate-addiction-starts -> /blog/how-opiate-addiction-starts
- **Fix:** Generate the 16-pair 301 map before cutover. Sequence with V0092 (no canonicals anywhere on this domain) and V0102 (trailing slash) so redirects and canonicals ship together. Build: https://quadrant-health-group.vercel.app/locations Production: https://quadranthealthgroup.com/sitemap_index.xml Note the renamed location slugs are longer and more descriptive, which is an improvement - but all 8 old URLs are indexed today.

#### V0089 — `not triaged` · CONFIRMED_AMENDED

Naming inconsistency, not a duplicate. The parent uses 'opiate' where Seaside uses 'opioid', so the portfolio targets two different terms for the same intent. 'Opioid' is the current clinical and higher-volume term.

- **Where:** https://quadrant-health-group.vercel.app/treatment/opiate-addiction (live, HTTP 200) No /treatment/opioid-addiction page exists on the parent (verified HTTP 404).
- **Fix:** Rename to /treatment/opioid-addiction with a 301 from the opiate URL, so it matches the term chosen for the portfolio: https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat/opioid-addiction Page to rename: https://quadrant-health-group.vercel.app/treatment/opiate-addiction
- **Verification correction:** Two refinements. 1) The inconsistency is THREE-WAY, not two-way. Across the portfolio: QHG parent uses /treatment/opiate-addiction; Wellness Detox LA uses /treatment/opioid-addiction; Wellness NJ uses /what-we-treat/opioids (plural); Seaside has BOTH opiate and opioid. So the standard has to cover three variants, and Seaside also needs its pair resolved (V0074). 2) UNVALIDATED CLAIM IN MY OWN ROW. It asserts "opioid is the current clinical and higher-volume term". The clinical part is defensible - opioid is the broader modern term covering synthetics like fentanyl, while opiate strictly means naturally derived. But I have NOT checked search volume, and I stated it as fact. That should either be validated with keyword data or reworded to drop the volume claim.

#### V0090 — `not triaged` · CONFIRMED

Locations index covers only 9 facilities. Des Moines Wellness Center and Greater Texas Behavioral have no location page.

- **Where:** https://quadrant-health-group.vercel.app/locations
- **Fix:** Build these two pages: https://quadrant-health-group.vercel.app/locations/des-moines-wellness-center https://quadrant-health-group.vercel.app/locations/greater-texas-behavioral Model on an existing location page: https://quadrant-health-group.vercel.app/locations/laguna-view-detox Facilities they should describe: https://desmoinesrecovery.com https://greatertexasbehavioral.com

#### V0091 — `not triaged` · CONFIRMED

Locations page contains no outbound links to any facility website. Only social links are present, so the parent passes no authority to the facilities.

- **Where:** https://quadrant-health-group.vercel.app/locations
- **Fix:** Add an outbound link from each entry on https://quadrant-health-group.vercel.app/locations to its production domain: https://dallasdetoxcenter.com https://desmoinesrecovery.com https://hillsidemission.com https://lagunaviewdetox.com https://marinaharbordetox.com https://oceancoastrecovery.com https://seasidewellnesspb.com https://wellnessdetoxla.com https://wellnessrecoverynj.com https://fortworthwellness.org https://greatertexasbehavioral.com Then link each facility back to: https://quadranthealthgroup.com

#### V0093 — `not triaged` · CONFIRMED_AMENDED

og:url is misconfigured or missing on all 92 pages: 53 point at the domain root, 38 have no og:url element at all, 1 is the homepage, 0 are page-specific. Original row described only the 53.

- **Where:** https://quadrant-health-group.vercel.app - 53 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://quadranthealthgroup.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Same scope omission as V0040, V0047, V0077, V0085 and V0088. Full picture: 53 wrong, 38 absent, 1 homepage, 0 page-specific. So no page on the parent has a correct og:url. Minor: the Fix cites quadranthealthgroup.com/about, which 301s.

### Seaside Wellness (8)

#### V0117 — `HIGH` · NEW - found during verification

Build still serves images from WordPress /wp-content/ paths on all 70 pages, including the LegitScript seal at /wp-content/uploads/2026/04/legitscript-seaside.png. Those assets only resolve while the WordPress install stays up, so decommissioning it would break images sitewide.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app - all 70 pages reference /wp-content/
- **Fix:** Migrate assets into the Next.js build and update the references before the WordPress install is retired. Verify on: https://seaside-wellness-of-palm-beach.vercel.app/

#### V0129 — `LOW` · NEW - Seaside deep audit 2026-07-28

Production sitemap contains 4 non-page URLs. The kadence_element child sitemap lists query-string theme fragments (?kadence_element=elementor-1160-2 and three variants), all of which 301 rather than resolving. These are Kadence theme parts, not content, and should not be submitted for indexing. Minor production hygiene - the new build does not carry them, so cutover resolves it.

- **Where:** https://seasidewellnesspb.com/kadence_element-sitemap.xml https://seasidewellnesspb.com/?kadence_element=elementor-1160-2 (HTTP 301) https://seasidewellnesspb.com/?kadence_element=elementor-1160-2-2 (HTTP 301) https://seasidewellnesspb.com/?kadence_element=elementor-1160-2-2-2 (HTTP 301) https://seasidewellnesspb.com/?kadence_element=elementor-1160-2-3 (HTTP 301)
- **Fix:** Exclude the kadence_element post type from the Yoast sitemap on production. No action needed on the new build, which does not generate these. Verify at: https://seasidewellnesspb.com/sitemap_index.xml

#### V0130 — `LOW` · NEW - Seaside deep audit 2026-07-28

Production blog index is mis-titled. seasidewellnesspb.com/about/blog/ carries the title "Addiction and Mental Health FAQ | Seaside Wellness" while the page is the blog listing, not an FAQ. The new build has it correct as "Blog - Addiction & Mental Health Resources", so cutover fixes it. Noting because the production title is what is indexed today, and Seaside separately has no FAQ page at all under /faq - so the FAQ title is also competing for a query the site cannot answer.

- **Where:** https://seasidewellnesspb.com/about/blog/ title: "Addiction and Mental Health FAQ | Seaside Wellness" https://seaside-wellness-of-palm-beach.vercel.app/about/blog title: "Blog - Addiction & Mental Health Resources | Seaside Wellness" (correct)
- **Fix:** No action on the build - it is already correct. Fix the production title if cutover is not imminent. Related: https://seaside-wellness-of-palm-beach.vercel.app/about/faq exists on the build, so the FAQ intent is served there rather than by the blog index.

#### V0073 — `not triaged` · CONFIRMED_AMENDED

Slug does not match content: /about/about-us is titled "Our Story". Both pages are also thin at 361 and 363 words with topical overlap. They are NOT duplicates - measured 49.7 percent word-level with different titles and different H1s. Original row called this a nested duplicate and recommended a 301 that would delete a distinct page.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app/about https://seaside-wellness-of-palm-beach.vercel.app/about/about-us
- **Fix:** Keep this page: https://seaside-wellness-of-palm-beach.vercel.app/about 301 this page to it: https://seaside-wellness-of-palm-beach.vercel.app/about/about-us
- **Verification correction:** "Nested duplicate" is wrong. The pages have different titles ("About Seaside Wellness | Trusted South Florida Rehab Center" vs "Our Story"), different H1s ("Recovery by the ocean, backed by real clinical expertise" vs "Built for healing, grounded in expertise") and only 49.7 percent word-level overlap. The 301 in the Fix would delete a distinct page. The real defects are different and smaller: (a) the SLUG does not match the content - /about/about-us is titled "Our Story", so the URL says one thing and the page says another; (b) both pages are thin at 361 and 363 words and overlap topically. Reword to a slug-rename plus possible merge, not a redirect.

#### V0074 — `not triaged` · CONFIRMED_AMENDED

Opiate and opioid pages will cannibalise each other - same search intent, two URLs.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat/opiate-addiction https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat/opioid-addiction
- **Fix:** Keep this page: https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat/opioid-addiction 301 this page to it: https://seaside-wellness-of-palm-beach.vercel.app/what-we-treat/opiate-addiction
- **Verification correction:** The ISSUE FRAMING IS CORRECT and should be preserved - unlike V0063, V0064 and V0073, this row claims intent cannibalisation, not duplicate text, and low text overlap does not weaken that. "Opiate addiction treatment" and "opioid addiction treatment" are near-synonymous queries, so two pages will compete regardless of wording. Only the FIX needs changing. "301 opiate to opioid" would discard a 1,066-word page. Correct sequence: merge the unique material from the opiate page into the opioid page FIRST, then 301. Or differentiate deliberately if the opiate page is meant to target a distinct drug class.

#### V0075 — `not triaged` · CONFIRMED_AMENDED

4 staff bio pages show real content reuse against the Quadrant parent, measured above the site boilerplate baseline of 44 percent: timothy-foley 64.7, steve-ryan 58.0, shan-raiford 57.7, michael-meagher 54.8. Count corrected from 5 - erin-crawford at 36.4 percent is below baseline and is not reuse. All 4 facility pages already canonical correctly; the parent copies have no canonical, so the action is parent-side only.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app/about/erin-crawford https://seaside-wellness-of-palm-beach.vercel.app/about/michael-meagher https://seaside-wellness-of-palm-beach.vercel.app/about/shan-raiford https://seaside-wellness-of-palm-beach.vercel.app/about/steve-ryan https://seaside-wellness-of-palm-beach.vercel.app/about/timothy-foley Also at: https://quadrant-health-group.vercel.app/team/erin-crawford, https://quadrant-health-group.vercel.app/team/michael-meagher, https://quadrant-health-group.vercel.app/team/shan-raiford, https://quadrant-health-group.vercel.app/team/steve-ryan, https://quadrant-health-group.vercel.app/team/timothy-foley
- **Fix:** Recommended: the facility site owns the bio and the parent links to it rather than republishing. Parent copies to canonical or replace with links: https://quadrant-health-group.vercel.app/team/erin-crawford https://quadrant-health-group.vercel.app/team/michael-meagher https://quadrant-health-group.vercel.app/team/shan-raiford https://quadrant-health-group.vercel.app/team/steve-ryan https://quadrant-health-group.vercel.app/team/timothy-foley Parent team index: https://quadrant-health-group.vercel.app/about/meet-the-team
- **Verification correction:** Reduce from 5 bios to 4 - drop erin-crawford, which sits below the site boilerplate baseline. Action remains parent-side only, since the facility side already canonicals correctly.

#### V0076 — `not triaged` · CONFIRMED_AMENDED

LegitScript seal is a locally hosted image that is not linked to a verification record. Image path is also still /wp-content/uploads/, a WordPress artifact in the Next.js build.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app/ /wp-content/uploads/2026/04/legitscript-seaside.png
- **Fix:** Link the seal to the LegitScript record: https://www.legitscript.com/certification/website-certification-status/ And move the asset off the WordPress path on: https://seaside-wellness-of-palm-beach.vercel.app/
- **Verification correction:** Scope is wider than the row states. All 70 of 70 preview pages reference both /wp-content/ paths and LegitScript, so this is a sitewide template issue, not a homepage one. The /wp-content/ dependency is also broader than the seal - the whole build still serves images from WordPress paths, which is worth noting because those assets only resolve while the WordPress install stays up.

#### V0077 — `not triaged` · CONFIRMED_AMENDED

og:url is misconfigured or missing on all 70 pages: 56 point at the domain root, 13 have no og:url element at all, 1 is the homepage. Not one page has a correct page-specific og:url - the worst og:url state in the portfolio. Original row described only the 56.

- **Where:** https://seaside-wellness-of-palm-beach.vercel.app - 56 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://seasidewellnesspb.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** The row omits that NO page has a correct page-specific og:url. Breakdown is 56 wrong, 13 absent, 1 homepage (legitimately root). So the accurate statement is that og:url is misconfigured or missing on all 70 pages, which is the worst og:url state in the portfolio - worse than Fort Worth (V0040) and Greater Texas (V0047). Minor: the Fix cites seasidewellnesspb.com/about, which 301s.

### Wellness Detox LA (6)

#### V0114 — `MEDIUM` · NEW - found during verification

FAQ content is fragmented across three separate pages rather than consolidated: /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq. Splits topical authority and gives users three places to look.

- **Where:** https://wellness-detox-of-la.vercel.app/admissions/addiction-faq https://wellness-detox-of-la.vercel.app/admissions/treatment-faq https://wellness-detox-of-la.vercel.app/admissions/insurance-admissions-faq
- **Fix:** Consolidate into one /faq page and 301 the other two. Model using the portfolio standard: https://wellness-recovery-nj.vercel.app/faq

#### V0133 — `LOW` · NEW - Wellness LA deep audit 2026-07-28

PRODUCTION has two competing blog index pages, both live at HTTP 200 with different titles: /about/blog/ ("Addiction Recovery Blog | Wellness Detox of LA") and /blog/ ("Blog - Wellness Detox of LA | Top-Rated Drug & Alcohol Detox and Rehab Center in Los Angeles"). The new build CONSOLIDATES them correctly - it serves /blog and 308-redirects /about/blog to it - so cutover resolves this. Logging because both are live and indexable on production today, splitting whatever authority the blog index has.

- **Where:** https://wellnessdetoxla.com/about/blog/ (HTTP 200) https://wellnessdetoxla.com/blog/ (HTTP 200) Build, already consolidated: https://wellness-detox-of-la.vercel.app/blog (HTTP 200) https://wellness-detox-of-la.vercel.app/about/blog (HTTP 308 to /blog)
- **Fix:** No action needed on the build - it is already correct. On production, 301 /about/blog/ to /blog/ if cutover is not imminent. Add the pair to the cutover redirect map either way, since /about/blog/ is indexed today: https://wellnessdetoxla.com/about/blog/ -> https://wellness-detox-of-la.vercel.app/blog

#### V0079 — `not triaged` · CONFIRMED_AMENDED

Intent overlap plus inverted link support, not duplication. /treatment/detox (1,431 words) and /medical-detox-los-angeles (582 words) target near-identical queries via their titles, so they compete. Measured content overlap is only 11.1 percent word-level against a 6.0 percent chrome baseline, so they are NOT duplicates. The weaker 582-word page is also not linked from the homepage while the service page is.

- **Where:** https://wellness-detox-of-la.vercel.app/treatment/detox https://wellness-detox-of-la.vercel.app/medical-detox-los-angeles
- **Fix:** Keep as the service page: https://wellness-detox-of-la.vercel.app/treatment/detox Retain only if the copy is genuinely distinct, otherwise 301 to the above: https://wellness-detox-of-la.vercel.app/medical-detox-los-angeles
- **Verification correction:** "Duplicates" is wrong - 11.1 percent overlap is near-chrome level. Reframe on the two things that are real: 1) INTENT overlap, in the V0074 sense rather than the duplicate-text sense. Titles are "Alcohol & Drug Detox in Los Angeles, CA" and "Medical Detox in Los Angeles", which target near-identical queries, so the two pages will compete regardless of wording. 2) The 582-word root page is not linked from the homepage while the 1,431-word service page is - so the weaker page is also the less supported one. Keep the Fix direction (service page wins) but the reason is intent overlap plus thinness, not duplication, and the 301 should follow a content merge rather than a straight redirect.

#### V0080 — `not triaged` · CONFIRMED_AMENDED

2 live page(s) returning 200 but absent from sitemap.xml, so they will not be submitted for indexing.

- **Where:** https://wellness-detox-of-la.vercel.app/privacy-policy https://wellness-detox-of-la.vercel.app/admissions/verify-your-insurance
- **Fix:** Add these URLs to: https://wellness-detox-of-la.vercel.app/sitemap.xml Or noindex them if the omission is intentional.
- **Verification correction:** SPLIT THE ROW. It bundles a non-issue with a real one, so as written half the fix is wrong. Keep /admissions/verify-your-insurance as the genuine omission and close /privacy-policy as by-design - consistent with the V0068 verdict on Laguna privacy. Also note both canonicals point at production URLs that 301 (trailing-slash mismatch), so this site is affected by the same issue as V0018 and V0067.

#### V0081 — `not triaged` · CONFIRMED

og:url points at the domain root on 36 of 44 pages instead of the page own URL, so every affected page declares itself as the homepage to social platforms and to any crawler using og:url as a URL hint.

- **Where:** https://wellness-detox-of-la.vercel.app - 36 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://wellnessdetoxla.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)

#### V0078 — `WITHDRAWN` · NOT_CONFIRMED · status: WITHDRAW - no defect

WITHDRAWN ON VERIFICATION - NO DEFECT EXISTS. /about and /about/our-story are distinct, well differentiated pages: different titles ("About Us" vs "Our Story"), different H1s, and only 23.8 percent word-level overlap against a 6.0 percent site chrome baseline. An About hub with an Our Story child is normal architecture. The original Fix would have deleted a live 345-word page.

- **Where:** https://wellness-detox-of-la.vercel.app/about https://wellness-detox-of-la.vercel.app/about/our-story
- **Fix:** Recommended hub: https://wellness-detox-of-la.vercel.app/about Fold into it or 301: https://wellness-detox-of-la.vercel.app/about/our-story
- **Verification correction:** PRIORITY WITHDRAWN: No defect - normal About/Our Story architecture WITHDRAW. The row states only that there are "two About-type pages under one section", which is a description of the architecture rather than a defect. An About hub with an Our Story child page, distinct titles, distinct H1s and 24 percent overlap is normal, sensible structure. There is nothing to fix. The Fix is actively harmful: "Fold into it or 301" would delete a distinct 345-word page that exists on production.

### Wellness Recovery NJ (6)

#### V0082 — `HIGH` · CONFIRMED

Missing canonical tag on 51 page(s) (all 51 pages, 100 percent). Verified that the preview serves robots.txt with "Allow: /", a robots meta of "index, follow" and no X-Robots-Tag header, so these pages are fully indexable. The production domain is live and self-canonicalising, so any preview page that gets discovered competes with its production twin as a near-duplicate.

- **Where:** https://wellness-recovery-nj.vercel.app - all 51 pages, 100 percent
- **Fix:** Add a self-referencing canonical on every template, pointing at the production domain: https://wellnessrecoverynj.com Affected build: https://wellness-recovery-nj.vercel.app Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
- **Verification correction:** PRIORITY HIGH: 100 percent of pages missing canonical none - row accurate as written

#### V0132 — `HIGH` · NEW - Wellness NJ deep audit 2026-07-28

CUTOVER REDIRECT MAP REQUIRED - 37 URL pairs. Breakdown: 17 blog posts move from production root /<slug>/ to /blog/<slug>; 10 substance pages move from root to /what-we-treat/<substance>; 6 county pages move from /area-we-serve/ to /areas-we-serve/ (singular to plural - easy to miss in a bulk rule); /contact-us becomes /contact; /faq-page becomes /faq. MIGRATION REQUIREMENT, NOT A DEFECT - internal link integrity on the build is clean: 0 broken across 347 distinct internal URLs, 0 internal redirects.

- **Where:** https://wellness-recovery-nj.vercel.app - all 51 pages https://wellnessrecoverynj.com/sitemap_index.xml Examples: /area-we-serve/morris-county -> /areas-we-serve/morris-county (note singular to plural) /xanax -> /what-we-treat/xanax /opioid-withdrawal-symptoms -> /blog/opioid-withdrawal-symptoms /contact-us -> /contact /faq-page -> /faq
- **Fix:** Generate the 37-pair 301 map before cutover. The /area-we-serve to /areas-we-serve change is the one most likely to be missed by a pattern-based rule, since only one character differs. Sequence with V0082 (no canonicals on any of the 51 pages) and V0102 (trailing slash) so redirects and canonicals ship together. Build: https://wellness-recovery-nj.vercel.app/areas-we-serve Production: https://wellnessrecoverynj.com/area-we-serve/morris-county/

#### V0131 — `MEDIUM` · NEW - Wellness NJ deep audit 2026-07-28

Four production landing pages were dropped from the build. All four return HTTP 200 on production and 404 on the build (verified across 3 slow retries - initial checks returned 503 under load, which was my own request rate, not the site). All four are thin PPC-style landing pages of 227-238 words, and three are explicitly titled "LP". WORTH A DELIBERATE DECISION RATHER THAN A DEFAULT: two of them advertise services this facility does not provide directly. Production states detox is handled "through a vetted network of trusted providers" and uses "inpatient" only comparatively ("the benefits of inpatient treatment without the 24/7 stay at a residential facility"). So /drug-alcohol-detox-rehab and /inpatient-rehab-center market detox and inpatient care that is referred out. A fourth markets virtual rehab, while the production homepage mentions "virtual" zero times.

- **Where:** https://wellnessrecoverynj.com/inpatient-rehab-center/ H1 "A Trusted Inpatient Drug & Alcohol Rehab Center" (238 words) https://wellnessrecoverynj.com/drug-alcohol-detox-rehab/ H1 "A Trusted Drug & Alcohol Detox Center" (236 words) https://wellnessrecoverynj.com/drug-alcohol-addiction-rehab/ H1 "Begin Healing From Drug & Alcohol Addiction" (238 words) https://wellnessrecoverynj.com/virtual-online-rehab-new-jersey/ H1 "Online Drug & Alcohol Rehab In New jersey" (227 words) All four return HTTP 404 on https://wellness-recovery-nj.vercel.app at the same paths.
- **Fix:** Confirm with the team whether dropping these was intentional. If they are still running paid traffic, the ads will point at 404s at cutover - check the ad platforms before launch. If they are retired, 301 each to the closest genuine service page: https://wellness-recovery-nj.vercel.app/treatment/partial-hospitalization https://wellness-recovery-nj.vercel.app/treatment/intensive-outpatient-program https://wellness-recovery-nj.vercel.app/treatment Separately, if any are rebuilt, the detox and inpatient claims should be reworded to reflect that both are referred out - V0084 confirmed this is an outpatient-only facility, and production agrees.

#### V0083 — `not triaged` · CONFIRMED_AMENDED · status: MERGE with V0059, V0087

1 live page(s) returning 200 but absent from sitemap.xml, so they will not be submitted for indexing.

- **Where:** https://wellness-recovery-nj.vercel.app/blog/what-to-expect-first-30-days-of-treatment
- **Fix:** Add these URLs to: https://wellness-recovery-nj.vercel.app/sitemap.xml Or noindex them if the omission is intentional.
- **Verification correction:** Two additions. 1) The row omits that this page has NO canonical and NO og:url at all, which is a worse signal state than the sitemap omission it describes. That said, the missing canonical is already covered sitewide by V0082, so do not double-count it. 2) MERGE per V0059. This is the third of three rows describing the same post across three sites, each failing differently, now fully mapped: Hillside - canonical points at a production URL returning 404 Ocean Coast - canonical points at the domain ROOT rather than the post Wellness NJ - no canonical at all All three are absent from their sitemaps and all three 404 on production, so the post exists only in the new builds. One consolidated row covering all three sites and all three failure modes is clearer than three near-identical rows.

#### V0085 — `not triaged` · CONFIRMED_AMENDED

og:url is misconfigured or missing on all 51 pages: 31 point at the domain root, 19 have no og:url element at all, 1 is the homepage, 0 are page-specific. Original row described only the 31.

- **Where:** https://wellness-recovery-nj.vercel.app - 31 pages affected
- **Fix:** Set og:url per page to that page canonical URL on the production domain, e.g. https://wellnessrecoverynj.com/about Correct example elsewhere in the portfolio: https://des-moines-wellness-center-navy.vercel.app/about (og:url matches the page)
- **Verification correction:** Same scope omission as V0040, V0047 and V0077. Full picture: 31 wrong, 19 absent, 0 page-specific. So NOT ONE page on this site has a correct og:url. The row describes 31 of 51 when the honest statement is that og:url is misconfigured or missing on all 51.

#### V0084 — `CLOSED` · BY_DESIGN · status: CLOSE - by design

CONFIRM BY DESIGN: no detox or residential pages. Site offers PHP, IOP, mental health IOP and outpatient only. Flagged so it is not logged as a gap in error.

- **Where:** https://wellness-recovery-nj.vercel.app/treatment
- **Fix:** Confirm against the production site and GBP: https://wellnessrecoverynj.com If outpatient-only, no action.
- **Verification correction:** PRIORITY CLOSED: By design - outpatient-only facility none - row accurate as written

---

<a id="broken-internal-links"></a>
## 4. Broken internal links

All 29 broken internal URLs. Totals reconcile exactly: 29 URLs / 94 source pages / 117 link instances. Only Dallas (16) and Fort Worth (13) are affected — the other 10 builds came back clean. **All 29 are marked NOT YET VERIFIED.** See section 2 for the root cause of the Fort Worth set.

Fix types: 20× 301 redirect, 8× Build page, then link, 1× Edit page copy.

### Dallas Detox Center (16)

| ID | Broken URL (404) | Send it to | Dest | Fix type | Pages | Links |
|---|---|---|---|---|---|---|
| V0001 | `/about` | `/about-us` | 200 | 301 redirect | 1 | 1 |
| V0002 | `/aftercare-planning` | `/treatment-services/aftercare-planning` | 200 | 301 redirect | 1 | 1 |
| V0003 | `/college-student` | `/who-we-help/college-students` | 200 | 301 redirect | 1 | 1 |
| V0004 | `/contact` | `/contact-us` | 200 | 301 redirect | 9 | 9 |
| V0005 | `/detox` | `/treatment-services/detox` | 200 | 301 redirect | 6 | 15 |
| V0006 | `/dual-diagnosis` | `/treatment-services/dual-diagnosis` | 200 | 301 redirect | 5 | 7 |
| V0007 | `/home` | `/` | 200 | 301 redirect | 3 | 5 |
| V0008 | `/mental-health-residential` | `/treatment-services/mental-health-residential` | 200 | 301 redirect | 4 | 5 |
| V0009 | `/opioid-detox` | `/heroin-detox` | 200 | 301 redirect | 1 | 1 |
| V0010 | `/prescription-drugs-addiction` | `/prescription-drugs-detox` | 200 | 301 redirect | 1 | 1 |
| V0011 | `/professionals` | `/who-we-help/professionals` | 200 | 301 redirect | 1 | 1 |
| V0012 | `/residential-inpatient` | `/treatment-services/residential-inpatient` | 200 | 301 redirect | 4 | 7 |
| V0013 | `/treatment-services/_wp_link_placeholder` | `/treatment-services/aftercare-planning` | 200 | Edit page copy | 1 | 1 |
| V0014 | `/treatment-services/aftercare` | `/treatment-services/aftercare-planning` | 200 | 301 redirect | 3 | 4 |
| V0015 | `/treatment-services/inpatient` | `/treatment-services/residential-inpatient` | 200 | 301 redirect | 8 | 8 |
| V0016 | `/treatment-services/texas-dual-diagnosis` | `/treatment-services/dual-diagnosis` | 200 | 301 redirect | 3 | 3 |

<details><summary>Source pages and anchor text</summary>

**V0001** `/about`

- Pages: 1. https://dallas-detox-center.vercel.app/2022/01/26/how-to-tell-if-someone-is-on-cocaine
- Anchors: 1. "Our staff"

**V0002** `/aftercare-planning`

- Pages: 1. https://dallas-detox-center.vercel.app/treatment-services
- Anchors: 1. "aftercare planning"

**V0003** `/college-student`

- Pages: 1. https://dallas-detox-center.vercel.app/who-we-help
- Anchors: 1. "student"

**V0004** `/contact`

- Pages: 1. https://dallas-detox-center.vercel.app/2022/01/12/how-to-detox-safely-from-opioids 2. https://dallas-detox-center.vercel.app/2022/02/08/why-is-prescription-drug-abuse-common 3. https://dallas-detox-center.vercel.app/2022/02/24/what-is-the-difference-between-adderall-and-meth 4. https://dallas-detox-center.vercel.app/2022/03/22/group-therapy-used-in-rehab 5. https://dallas-detox-center.vercel.app/2022/04/08/sober-living-house 6. https://dallas-detox-center.vercel.app/2022/04/21/do-you-detox-from-alcohol 7. https://dallas-detox-center.vercel.app/2022/04/25/what-is-drug-withdrawal 8. https://dallas-detox-center.vercel.app/2022/05/05/how-to-find-alcohol-rehab-near-garland-texas 9. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
- Anchors: 1. "Reach out to us today" 2. "lend a hand" 3. "Reach out today" 4. "Call" 5. "Contact us today" 6. "Contact us today" 7. "Contact us today" 8. "Contact us" 9. "Contact us"

**V0005** `/detox`

- Pages: 1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas 2. https://dallas-detox-center.vercel.app/admissions 3. https://dallas-detox-center.vercel.app/treatment-services 4. https://dallas-detox-center.vercel.app/treatment-services/detox 5. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis 6. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
- Anchors: 1. "detox process"; "medical detox"; "detox"; "medical detox" 2. "detox"; "medical detox"; "medical detox" 3. "medically supervised detox"; "detox" 4. "medical detox"; "detox phase" 5. "medical detox" 6. "specific detox"; "medical detox"; "medical detox"

**V0006** `/dual-diagnosis`

- Pages: 1. https://dallas-detox-center.vercel.app/admissions 2. https://dallas-detox-center.vercel.app/treatment-services 3. https://dallas-detox-center.vercel.app/treatment-services/detox 4. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis 5. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
- Anchors: 1. "dual diagnosis" 2. "dual diagnosis"; "dual diagnosis care" 3. "Dual Diagnosis Care" 4. "co-occurring disorders" 5. "dual diagnosis"; "dual diagnosis"

**V0007** `/home`

- Pages: 1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas 2. https://dallas-detox-center.vercel.app/treatment-services 3. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
- Anchors: 1. "Dallas Detox Center"; "Dallas Detox Center" 2. "Dallas Detox Center" 3. "Dallas Detox Center"; "Dallas Detox Center"

**V0008** `/mental-health-residential`

- Pages: 1. https://dallas-detox-center.vercel.app/treatment-services 2. https://dallas-detox-center.vercel.app/treatment-services/detox 3. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis 4. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
- Anchors: 1. "mental health residential"; "mental health care" 2. "mental health residential" 3. "mental health treatment program" 4. "medically supervised residential program"

**V0009** `/opioid-detox`

- Pages: 1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "opioid dependency"

**V0010** `/prescription-drugs-addiction`

- Pages: 1. https://dallas-detox-center.vercel.app/treatment-services
- Anchors: 1. "prescription drug"

**V0011** `/professionals`

- Pages: 1. https://dallas-detox-center.vercel.app/who-we-help
- Anchors: 1. "executive"

**V0012** `/residential-inpatient`

- Pages: 1. https://dallas-detox-center.vercel.app/admissions 2. https://dallas-detox-center.vercel.app/treatment-services 3. https://dallas-detox-center.vercel.app/treatment-services/detox 4. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
- Anchors: 1. "residential care"; "residential programs"; "residential treatment" 2. "substance abuse inpatient"; "residential stabilization" 3. "residential inpatient" 4. "residential inpatient treatment"

**V0013** `/treatment-services/_wp_link_placeholder`

- Pages: 1. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
- Anchors: 1. "/afte"

**V0014** `/treatment-services/aftercare`

- Pages: 1. https://dallas-detox-center.vercel.app/2022/03/04/how-to-find-a-rehab-program 2. https://dallas-detox-center.vercel.app/2022/03/10/what-is-a-relapse-prevention-program 3. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
- Anchors: 1. "lifetime aftercare programs" 2. "relapse prevention program in Dallas"; "aftercare in Dallas" 3. "Aftercare in Dallas"

**V0015** `/treatment-services/inpatient`

- Pages: 1. https://dallas-detox-center.vercel.app/2022/01/19/is-there-al-anon-for-drug-addiction 2. https://dallas-detox-center.vercel.app/2022/03/22/group-therapy-used-in-rehab 3. https://dallas-detox-center.vercel.app/2022/04/08/sober-living-house 4. https://dallas-detox-center.vercel.app/2022/04/15/how-long-are-inpatient-programs 5. https://dallas-detox-center.vercel.app/2022/04/25/what-is-drug-withdrawal 6. https://dallas-detox-center.vercel.app/2022/05/05/how-to-find-alcohol-rehab-near-garland-texas 7. https://dallas-detox-center.vercel.app/2022/05/09/addiction-rehab-near-irving-texas 8. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
- Anchors: 1. "inpatient programs" 2. "residential program" 3. "inpatient programs in Dallas" 4. "inpatient treatment programs in Dallas" 5. "inpatient addiction treatment in Dallas" 6. "Dallas inpatient program" 7. "Texas inpatient rehab program" 8. "Dallas inpatient treatment programs"

**V0016** `/treatment-services/texas-dual-diagnosis`

- Pages: 1. https://dallas-detox-center.vercel.app/2022/02/24/what-is-the-difference-between-adderall-and-meth 2. https://dallas-detox-center.vercel.app/2022/03/04/how-to-find-a-rehab-program 3. https://dallas-detox-center.vercel.app/2022/04/15/how-long-are-inpatient-programs
- Anchors: 1. "treat co-existing disorders" 2. "dual diagnosis treatment" 3. "Texas dual diagnosis treatment"

</details>

### Fort Worth Wellness (13)

| ID | Broken URL (404) | Send it to | Dest | Fix type | Pages | Links |
|---|---|---|---|---|---|---|
| V0024 | `/about` | `/about-us` | 200 | 301 redirect | 1 | 1 |
| V0025 | `/alcohol-detox` | *(build this page)* | 404 | Build page, then link | 3 | 4 |
| V0026 | `/benzo-detox` | *(build this page)* | 404 | Build page, then link | 2 | 2 |
| V0027 | `/contact` | `/contact-us` | 200 | 301 redirect | 9 | 9 |
| V0028 | `/fentanyl-detox` | *(build this page)* | 404 | Build page, then link | 1 | 2 |
| V0029 | `/home` | `/` | 200 | 301 redirect | 1 | 2 |
| V0030 | `/luxury-treatment` | *(build this page)* | 404 | Build page, then link | 3 | 3 |
| V0031 | `/meth-detox` | *(build this page)* | 404 | Build page, then link | 1 | 1 |
| V0032 | `/opioid-detox` | *(build this page)* | 404 | Build page, then link | 1 | 1 |
| V0033 | `/treatment-services/aftercare` | `/treatment/aftercare-planning` | 200 | 301 redirect | 4 | 5 |
| V0034 | `/treatment-services/inpatient` | `/treatment/residential-inpatient` | 404 | Build page, then link | 9 | 9 |
| V0035 | `/treatment-services/residential-inpatient` | `/treatment/residential-inpatient` | 404 | Build page, then link | 4 | 5 |
| V0036 | `/treatment-services/texas-dual-diagnosis` | `/treatment/dual-diagnosis` | 200 | 301 redirect | 3 | 3 |

<details><summary>Source pages and anchor text</summary>

**V0024** `/about`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/how-to-tell-if-someone-is-on-cocaine
- Anchors: 1. "Our staff"

**V0025** `/alcohol-detox`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year 2. https://fort-worth-wellness.vercel.app/blog/grey-area-drinking 3. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "alcohol"; "alcohol" 2. "alcohol detox program in Texas" 3. "alcohol"

**V0026** `/benzo-detox`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year 2. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "benzos" 2. "benzodiazepine"

**V0027** `/contact`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/do-you-detox-from-alcohol 2. https://fort-worth-wellness.vercel.app/blog/group-therapy-used-in-rehab 3. https://fort-worth-wellness.vercel.app/blog/how-to-detox-safely-from-opioids 4. https://fort-worth-wellness.vercel.app/blog/how-to-find-alcohol-rehab-near-garland-texas 5. https://fort-worth-wellness.vercel.app/blog/sober-living-house 6. https://fort-worth-wellness.vercel.app/blog/the-importance-of-having-a-hobby-in-addiction-recovery 7. https://fort-worth-wellness.vercel.app/blog/what-is-drug-withdrawal 8. https://fort-worth-wellness.vercel.app/blog/what-is-the-difference-between-adderall-and-meth 9. https://fort-worth-wellness.vercel.app/blog/why-is-prescription-drug-abuse-common
- Anchors: 1. "Contact us today" 2. "Call" 3. "Reach out to us today" 4. "Contact us" 5. "Contact us today" 6. "Contact us" 7. "Contact us today" 8. "Reach out today" 9. "lend a hand"

**V0028** `/fentanyl-detox`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "fentanyl"; "fentanyl"

**V0029** `/home`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "Fort Worth Wellness Center"; "Fort Worth Wellness Center"

**V0030** `/luxury-treatment`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year 2. https://fort-worth-wellness.vercel.app/blog/evolution-of-addiction-treatment 3. https://fort-worth-wellness.vercel.app/blog/how-to-convince-someone-to-get-help-for-drug-addiction
- Anchors: 1. "rehab program" 2. "luxury treatment at our state-of-the-art drug and alcohol rehab facili" 3. "luxury detox center in Fort Worth"

**V0031** `/meth-detox`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "Methamphetamine"

**V0032** `/opioid-detox`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
- Anchors: 1. "opioid dependency"

**V0033** `/treatment-services/aftercare`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/how-to-find-a-rehab-program 2. https://fort-worth-wellness.vercel.app/blog/the-importance-of-having-a-hobby-in-addiction-recovery 3. https://fort-worth-wellness.vercel.app/blog/what-is-a-relapse-prevention-program 4. https://fort-worth-wellness.vercel.app/blog/what-is-the-difference-between-inpatient-and-outpatient-treatment
- Anchors: 1. "lifetime aftercare programs" 2. "Aftercare in Fort Worth" 3. "relapse prevention program in Fort Worth"; "aftercare in Fort Worth" 4. "relapse prevention strategies"

**V0034** `/treatment-services/inpatient`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/addiction-rehab-near-irving-texas 2. https://fort-worth-wellness.vercel.app/blog/group-therapy-used-in-rehab 3. https://fort-worth-wellness.vercel.app/blog/how-long-are-inpatient-programs 4. https://fort-worth-wellness.vercel.app/blog/how-to-find-alcohol-rehab-near-garland-texas 5. https://fort-worth-wellness.vercel.app/blog/is-there-al-anon-for-drug-addiction 6. https://fort-worth-wellness.vercel.app/blog/sober-living-house 7. https://fort-worth-wellness.vercel.app/blog/the-importance-of-having-a-hobby-in-addiction-recovery 8. https://fort-worth-wellness.vercel.app/blog/what-is-drug-withdrawal 9. https://fort-worth-wellness.vercel.app/blog/what-is-the-difference-between-inpatient-and-outpatient-treatment
- Anchors: 1. "Texas inpatient rehab program" 2. "residential program" 3. "inpatient treatment programs in Fort Worth" 4. "Fort Worth inpatient program" 5. "inpatient programs" 6. "inpatient programs in Fort Worth" 7. "Fort Worth inpatient treatment programs" 8. "inpatient addiction treatment in Fort Worth" 9. "inpatient treatment"

**V0035** `/treatment-services/residential-inpatient`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year 2. https://fort-worth-wellness.vercel.app/blog/medically-assisted-detox-near-me 3. https://fort-worth-wellness.vercel.app/blog/resources-for-children-of-parents-with-dual-diagnosis 4. https://fort-worth-wellness.vercel.app/blog/timeline-for-alcohol-detox
- Anchors: 1. "residential treatment"; "residential treatment" 2. "Texas inpatient program" 3. "inpatient drug rehab" 4. "inpatient alcohol addiction treatment programs in Fort Worth"

**V0036** `/treatment-services/texas-dual-diagnosis`

- Pages: 1. https://fort-worth-wellness.vercel.app/blog/how-long-are-inpatient-programs 2. https://fort-worth-wellness.vercel.app/blog/how-to-find-a-rehab-program 3. https://fort-worth-wellness.vercel.app/blog/what-is-the-difference-between-adderall-and-meth
- Anchors: 1. "Texas dual diagnosis treatment" 2. "dual diagnosis treatment" 3. "treat co-existing disorders"

</details>

---

<a id="visual-issues"></a>
## 5. Visual issues

1183 real rows across 5 sites (202 placeholders excluded), 657 distinct issue/fix pairs — a long tail, so this is grouped by facility and page rather than by frequency.

### Theme distribution

| Theme | Rows |
|---|---|
| structure / heading / widget | 317 |
| broken or missing link | 277 |
| empty / blank content | 100 |
| CTA placement | 97 |
| reviews / testimonials | 79 |
| insurance / verify | 65 |
| wrong city / location / map | 62 |
| credential / reviewer byline | 48 |
| stock or wrong imagery | 38 |
| misspelling / typo | 34 |
| phone number mismatch | 19 |
| accreditation / seal | 4 |

### Notable items

- **"Mission Veijo" misspelled ×26** (Hillside) — the facility city, misspelled in body copy.
- **"Written By: admin"** appears here too, independently corroborating V0111 (Dallas, 18 pages).
- **"Medically Reviewed by Monica Olivires"** — corroborates the secondary defect in V0054 (correct spelling is Olivares).
- **"Needs an Editorial Policy Page"** — a YMYL E-E-A-T gap that appears in **no** build-issue row.
- One fix note reads *"AI copied the section"* — some content is AI-generated.
- *"The blogs created on Clarion are appearing separate from the blogs previously published"* — Clarion is referenced nowhere else.

### Full list by facility and page

<details><summary><b>Dallas Detox</b> — 405 issues</summary>

**`(no URL given)`**

| # | Issue | Fix |
|---|---|---|
| 19 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/2026/06/17/why-dual-diagnosis-treatment-matters`**

| # | Issue | Fix |
|---|---|---|
| 380 | All blogs have a date URL using domain/2026/06/17/blog-title | should be domain/blog/blog-title |

**`/abilene`**

| # | Issue | Fix |
|---|---|---|
| 88 | We Can Help You - No Matter What. text box | remove |
| 89 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 90 | We are here for you - Blank text box | remove |
| 91 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 92 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 93 | Get the Help You Need Right Now | remove |
| 94 | Dallas Detox Center Offers Addiction Treatment near Abilene, TX | create its own designated section |
| 95 | Get Immediate Help Now text box | remove |
| 96 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 97 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/about-us`**

| # | Issue | Fix |
|---|---|---|
| 367 | We Can Help You - No Matter What. text box | remove |
| 368 | Get Immediate Help Now - Blank text box | remove |
| 369 | Trusted & Experienced | remove |
| 370 | Our Mission: Helping Others | create its own designated section |
| 371 | Our Philosophy: Everyone Deserves Treatment | create its own designated section |
| 372 | Why Dallas Detox Center Is Your Top Choice | These should be put in text box widgets, they are missing the headers for each on the original page |
| 373 | We Offer an Experience In | remove |
| 374 | Addiction Treatment section | Needs the facility video, also remove Decades of Experience |
| 375 | Meet Our Team | Missing staff images from original site |
| 376 | What Our Clients Say | Needs google reviews slide show like on the original site, also remove Get the Help You Need Right Now |
| 377 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

**`/about-us/alexandria-grigsby`**

| # | Issue | Fix |
|---|---|---|
| 10 | Our Team Alexandria Grigsby Clinical Director - Missing image of staff | Ask the facility for a picture of the staff member |
| 11 | Our Team Alexandria Grigsby Clinical Director - Partial content produced | Missing content from the original site |

**`/about-us/antoine-gross`**

| # | Issue | Fix |
|---|---|---|
| 378 | page is missing from original site | confirm if the staff member is still a part of their team, if so add an area for a picture |

**`/about-us/michael-young`**

| # | Issue | Fix |
|---|---|---|
| 12 | Our Team Michael Young Case Manager - Partial Content produced | Missing content from the original site |

**`/about-us/ricki-cochran`**

| # | Issue | Fix |
|---|---|---|
| 8 | Our Team Ricki Cochran Therapist - Content built out sloppy | The content can be built out as a faq accordian or have ai rebuild the content to match the structure in the other staff pages |

**`/about-us/sarah-bentley`**

| # | Issue | Fix |
|---|---|---|
| 379 | page is missing from original site | confirm if the staff member is still a part of their team, if so add an area for a picture |

**`/about-us/trevor-grigsby`**

| # | Issue | Fix |
|---|---|---|
| 9 | Our Team Trevor Grigsby Clinical Director - Missing image of staff | Ask the facility for a picture of the staff member |

**`/admissions`**

| # | Issue | Fix |
|---|---|---|
| 318 | Get the Help You Need Right Now - text box | remove |
| 319 | Quick & Confidential Verification. 100% Free. - text box | remove and replace with a "Verify Your Insurance Benefits" submission tool that contains Name, Phone, Date of Birth, Insurance Provider, & Member ID input |
| 320 | What to Expect - text box | remove |
| 321 | Protecting Your Career While You Prioritize Your Health | remove |
| 322 | How to Find Us | include Google Maps location that allows to view drivable distance |
| 323 | Get In Touch | remove |
| 324 | Frequently Asked Questions | leave content as is, include an accordian tool to expand the answer when the question is selected |
| 325 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/alcohol-detox`**

| # | Issue | Fix |
|---|---|---|
| 67 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 68 | "Get the Help You Need Right Now" in the "What to Expect: The Alcohol Detox Process at DDC" section | remove |
| 69 | Request a call back text box | remove |
| 70 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 71 | Most Frequently Asked Questions | missing the questions for the answers. should also be formatted as an accordian |
| 72 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/arlington`**

| # | Issue | Fix |
|---|---|---|
| 141 | Written By: admin | remove admin |
| 142 | Experience high-quality medical drug & alcohol detox services near Arlington, Texas - double title | Remove |
| 143 | We Can Help You - No Matter What. text box | remove |
| 144 | Get Help Now - Blank text box | add a link to admission page |
| 145 | We are here for you - Blank text box | remove |
| 146 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 147 | Get the Help You Need Right Now | remove |
| 148 | Get Immediate Help Now text box | remove |
| 149 | Dallas Detox Center Offers Addiction Treatment near Arlington, TX | create its own designated section |
| 150 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

**`/benzo-detox`**

| # | Issue | Fix |
|---|---|---|
| 47 | Missing Medically Reviewed By section | Add to page |
| 48 | "Benzo Detox in Dallas, Texas Drug & Alcohol Detox in Dallas, Texas" redundant title created | Remove |
| 49 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 50 | Get Help Now - Blank text box | add a link to admission page |
| 51 | learn more about benzos - text box | Remove |
| 52 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 53 | Get the Help You Need Right Now - should be above the text of "Are Benzos Addictive?" in fine text | modify page structure to match the structure in the original page |
| 54 | Do Benzos Cause Withdrawal? | Text box needs to be its own section |
| 55 | What Are Common Benzo Withdrawal Symptoms? | Text box needs to be its own section |
| 56 | Get the Help You Need at | Text box needs to be removed |
| 57 | Get the Help You Need text under "How to Detox from Benzos" | Text needs to be removed |
| 58 | Contact Us Today - we are here for you above "Dallas Detox is a Benzo Detox Center in Texas" | Text needs to be removed |
| 59 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 60 | Get Immediate Help Now - Text box | Text box needs to be removed |
| 61 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

**`/blog`**

| # | Issue | Fix |
|---|---|---|
| 364 | The blogs created on Clarion are appearing separate from the blogs previously published | All blogs published should appear on the same area |
| 365 | All blogs are appearing in one page | blogs should appear 6 at a time on this page with a next page & previous page tool that shows the following 6 blogs |
| 366 | remove the text above read more from the blog widgets that show the text in the page | remove the text above read more from the blog widgets that show the text in the page |

**`/cocaine-detox`**

| # | Issue | Fix |
|---|---|---|
| 170 | Cocaine Detox in Dallas, Texas - Double Title | remove |
| 171 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC December 28, 2022 |
| 172 | We Can Help You - No Matter What. text box | remove |
| 173 | Get Help Now - Blank text box | add a link to admission page |
| 174 | Learn more about cocaine - Blank text box | remove |
| 175 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 176 | Request a Callback | remove |
| 177 | What Are the Signs of Cocaine Addiction? | create its own designated section |
| 178 | How Long Does It Take To Detox from Cocaine? | create its own designated section |
| 179 | the symptoms text box | remove |
| 180 | We are here for you - Blank text box | remove |
| 181 | Contact Us Today - blank text box | remove |
| 182 | Get Immediate Help Now text box | remove |
| 183 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 184 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/farmers-branch`**

| # | Issue | Fix |
|---|---|---|
| 98 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · May 1, 2023 | Remove the written by: admin in this page |
| 99 | We Can Help You - No Matter What. text box | remove |
| 100 | Get Help Now - Blank text box | add a link to admission page |
| 101 | We are here for you - Blank text box | remove |
| 102 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 103 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 104 | Get the Help You Need Right Now | remove |
| 105 | Dallas Detox Center Offers Addiction Treatment near Farmers Branch, TX | create its own designated section |
| 106 | Get Immediate Help Now text box | remove |
| 107 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 108 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/fentanyl-detox`**

| # | Issue | Fix |
|---|---|---|
| 73 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 74 | Get Help Now - Blank text box | add a link to admission page |
| 75 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 76 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 77 | The Impact of Fentanyl on the Body text box | create its own designated section |
| 78 | Symptoms of Fentanyl Withdrawal text box | create its own designated section |
| 79 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 80 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/fort-worth-drug-rehab`**

| # | Issue | Fix |
|---|---|---|
| 161 | Experience high-quality medical drug & alcohol detox services near Fort Worth, Texas | double title on the page, remove |
| 162 | We Can Help You - No Matter What. text box | remove |
| 163 | Get Help Now - Blank text box | add a link to admission page |
| 164 | We are here for you - Blank text box | remove |
| 165 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 166 | Get the Help You Need Right Now | remove |
| 167 | Get Immediate Help Now | remove |
| 168 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 169 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/frisco`**

| # | Issue | Fix |
|---|---|---|
| 278 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · July 1, 2022 | remove admin |
| 279 | Experience high-quality medical drug & alcohol detox services near Frisco, Texas | remove |
| 280 | We Can Help You - No Matter What. text box | remove |
| 281 | Get Help Now - Blank text box | add a link to admission page |
| 282 | We are here for you - text box | remove |
| 283 | Request a Callback | remove |
| 284 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 285 | Get Immediate Help Now | remove |
| 286 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 287 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/garland`**

| # | Issue | Fix |
|---|---|---|
| 151 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 152 | Experience high-quality medical drug & alcohol detox services near Garland, Texas - double title | remove |
| 153 | We Can Help You - No Matter What. text box | remove |
| 154 | Get Help Now - Blank text box | add a link to admission page |
| 155 | We are here for you - Blank text box | remove |
| 156 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 157 | Get the Help You Need Right Now | remove |
| 158 | Get Immediate Help Now text box | remove |
| 159 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 160 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/heroin-detox`**

| # | Issue | Fix |
|---|---|---|
| 185 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC December 28, 2022 |
| 186 | Heroin Detox in Dallas, Texas Drug & Alcohol Detox in Dallas, Texas - double title | remove |
| 187 | We Can Help You - No Matter What. text box | remove |
| 188 | Get Help Now - Blank text box | add a link to admission page |
| 189 | Learn more about heroin - Blank text box | remove |
| 190 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 191 | Request a Callback | remove |
| 192 | Get Immediate Help Now text box | remove |
| 193 | What Are the Symptoms of Heroin Withdrawal? section content missing | add content from the original page (content is under the following header) |
| 194 | Get the Help You Need | remove |
| 195 | Contact Us Today | remove |
| 196 | Dallas Detox Center Offers Heroin Detox Programs in Texas - header in the wrong section | modify page structure to match the structure in the original page |
| 197 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 198 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/highland-park`**

| # | Issue | Fix |
|---|---|---|
| 130 | Written By: admin | remove admin |
| 131 | Experience high-quality medical drug & alcohol detox services near Highland Park, Texas - double title | Remove |
| 132 | We Can Help You - No Matter What. text box | remove |
| 133 | Get Help Now - Blank text box | add a link to admission page |
| 134 | We are here for you - Blank text box | remove |
| 135 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 136 | Get the Help You Need Right Now | remove |
| 137 | Get Immediate Help Now text box | remove |
| 138 | Dallas Detox Center Offers Addiction Treatment near Highland Park, TX | create its own designated section |
| 139 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 140 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/luxury-treatment`**

| # | Issue | Fix |
|---|---|---|
| 199 | We Can Help You - No Matter What. text box | remove |
| 200 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 201 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 202 | Request a Callback | remove |
| 203 | Get Immediate Help Now text box | remove |
| 204 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 205 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/mckinney`**

| # | Issue | Fix |
|---|---|---|
| 268 | Mickinney, Texas Addiction Treatment Experience high-quality medical drug & alcohol detox services in Mckinney, TX | double title on the page, remove |
| 269 | We Can Help You Find Long-Term Recovery from Addiction | remove |
| 270 | We Can Help You - No Matter What. text box | remove |
| 271 | Get Help Now - Blank text box | add a link to admission page |
| 272 | Mckinney, Texas Addiction Treatment - Text box | remove |
| 273 | Request a Callback | remove |
| 274 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 275 | Get Immediate Help Now | remove |
| 276 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 277 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/meth-detox`**

| # | Issue | Fix |
|---|---|---|
| 62 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC | remove written by: admin |
| 63 | We Can Help You - No Matter What. section | remove section, old cta |
| 64 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 65 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 66 | Get Immediate Help Now above "How Does Meth Impact the Body?" | Use the CTA "Take the first step toward recovery today" by the footer |

**`/plano`**

| # | Issue | Fix |
|---|---|---|
| 297 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · July 1, 2022 | remove admin |
| 298 | Experience high-quality medical drug & alcohol detox services in Plano, TX | remove |
| 299 | We Can Help You - No Matter What. text box | remove |
| 300 | Get Help Now - Blank text box | add a link to admission page |
| 301 | What type of care is right for you? - text box | remove |
| 302 | Request a Callback | remove |
| 303 | Reach Out to Dallas Detox For Help - text box | create its own designated section |
| 304 | Get Immediate Help Now text box | remove |
| 305 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 306 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 307 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

**`/prescription-drugs-detox`**

| # | Issue | Fix |
|---|---|---|
| 81 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · June 8, 2023 | Remove the written by: admin in this page |
| 82 | We Can Help You - No Matter What. | Remove section, old cta |
| 83 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 84 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 85 | "Get the Help You Need Right Now" in the "Let Us Help You Begin Your Journey to Recovery" section | remove |
| 86 | "Get Immediate Help Now" in the "What Are the Signs of Prescription Drug Abuse?" section | remove |
| 87 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/richardson`**

| # | Issue | Fix |
|---|---|---|
| 288 | We Can Help You - No Matter What. text box | remove |
| 289 | Get Help Now - Blank text box | add a link to admission page |
| 290 | Learn About Your Community - text box | remove |
| 291 | Get Help at Dallas Detox Center | remove |
| 292 | Request a Callback | remove |
| 293 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 294 | Get Immediate Help Now | remove |
| 295 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 296 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/southlake`**

| # | Issue | Fix |
|---|---|---|
| 308 | Southlake, Texas Addiction Treatment Experience high-quality medical drug & alcohol detox services in Southlake, TX | double title on the page, remove |
| 309 | Substance Abuse in Our Country | remove |
| 310 | We Can Help You - No Matter What. text box | remove |
| 311 | Get Help Now - Blank text box | add a link to admission page |
| 312 | Learn About Your Community - text box | remove |
| 313 | Request a Callback | remove |
| 314 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 315 | Get Immediate Help Now | remove |
| 316 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 317 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/tour`**

| # | Issue | Fix |
|---|---|---|
| 326 | The Magnolia House section | Include in this section only pictures from magnolia like on the original site |
| 327 | The Cedar Creek Barn section | Include in this section only pictures from cedar creek barn like on the original site |
| 328 | The Willow House | Include in this section only pictures from the willow house like on the original site |
| 329 | Missing "We Treat the Individual, Not the Disease." section from the original site | Include Individualized Care, Devices Allowed, & Dual-Diagnosis Focus from the original site |

**`/treatment-services`**

| # | Issue | Fix |
|---|---|---|
| 355 | Written By: dev · Medically Reviewed By: Alexandria Grigsby LCDC | remove dev |
| 356 | Dallas Detox Center provides medically supervised detox, substance abuse inpatient & mental health residential treatment, and dual diagnosis care for individuals struggling with substance use and co-occurring mental health disorders. | missing the bullet points from the original site |
| 357 | You Don’t Have to Carry This Alone | Needs a call button and a verify insurance button. Also remove Dallas Detox Center from this section |
| 358 | Evidence-Based Therapies & Treatment Modalities | remove Support for individuals and families |
| 359 | Specialized Detox Programs in Dallas | each bullet point needs to redirect to their respective pages on click. Also remove Get the Help You Need Right Now |
| 360 | Our Trusted Addiction Treatment Center in Dallas | remove Get the Help You Need |
| 361 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 362 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 363 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/treatment-services/aftercare-planning`**

| # | Issue | Fix |
|---|---|---|
| 330 | The Bridge to Permanent Sobriety | Missing the paragraph from the original site for this section |
| 331 | Finding Strength in a Community That Truly Understands Your Journey | remove |
| 332 | Get the Help You Need Right Now | remove |
| 333 | What Can I Expect After I Leave Treatment? | remove |
| 334 | Get Immediate Help Now | remove |
| 335 | Get Started Today | Include a "Verify Your Insurance Benefits" submission tool that contains Name, Phone, Date of Birth, Insurance Provider, & Member ID input |
| 336 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 337 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/treatment-services/detox`**

| # | Issue | Fix |
|---|---|---|
| 338 | Experience high-quality medical drug & alcohol detox services in Dallas, Texas. | remove |
| 339 | Accredited Drug and Alcohol Detox Facility in Dallas - At Glance | Needs a legit script icon |
| 340 | The first step towards recovery | remove |
| 341 | First Step Towards Recovery | remove |
| 342 | Evidence-based withdrawal management tailored to your specific recovery goals. | remove |
| 343 | The Dangers of Withdrawal And Why Medical Detox Is Essential | contains only bullet points from the main site, add paragraph content as well |
| 344 | Why Medical Detox Is Essential And How We Help At Dallas Detox Center | Missing section from the original site |
| 345 | Real Stories of Recovery from Our Dallas Community | Needs google reviews slide show like on the original site |
| 346 | Healing the mind while we stabilize the body. | remove |
| 347 | Therapeutic Support During Detox | contains only bullet points from the main site, add paragraph content as well |
| 348 | Preparing for Long-Term Recovery & Dual Diagnosis Care | Missing section from the original site |
| 349 | Get the Help You Need | remove |
| 350 | We're available 24/7 | remove |
| 351 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 352 | Frequently Asked Questions About Medical Detox in Dallas | missing FAQ questions, only shows the answers. Should be in an accordian tool type format |
| 353 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 354 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/treatment-services/dual-diagnosis`**

| # | Issue | Fix |
|---|---|---|
| 2 | Modern Tools for Complex Healing - Empty Text Box | Add content |
| 3 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 394 | Integrated Dual Diagnosis Treatment in Dallas | Double title on the page, remove |
| 395 | Accredited Dual Diagnosis Program in Dallas, Texas - At Glance | Remove The first step towards recovery and add the legitscript icon |
| 396 | What is Dual Diagnosis? | Missing paragraph, only contains bullet points from original page |
| 397 | Dual Diagnosis (Simultaneous) - text box | Remove the link to the page on the text box |
| 398 | Targeted Clinical Care for Co-Occurring Challenges | Remove text |
| 399 | Simultaneous Clinical Support from Detox through Aftercare | Remove text |
| 400 | Real Results from Our Integrated Approach | Needs google reviews slide show, also remove The Standard for Clinical Excellence and Private Recovery |
| 401 | Why Choose Dallas Detox Center for Dual Diagnosis? | remove We're available 24/7 |
| 402 | Your Confidential Path to Recovery Begins Here | add a link to verify insurance page, and remove Get the Help You Need Right Now |
| 403 | Frequently Asked Questions | Missing questions for the FAQ, only contains answers. should be in an accordian style |

**`/treatment-services/mental-health-residential`**

| # | Issue | Fix |
|---|---|---|
| 7 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

**`/treatment-services/residential-inpatient`**

| # | Issue | Fix |
|---|---|---|
| 1 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 382 | Missing a legit script logo in the Residential Treatment Program Overview | Add logo and remove Where true healing takes place |
| 383 | Is Residential Inpatient The Right Fit For You? | Missing paragraph, only contains bullet points from original page |
| 384 | Proven tools to beat addiction and mental health struggles | remove |
| 385 | Effective Therapies for Lasting Change in Dallas, TX | Missing paragraph, only contains bullet points from original page |
| 386 | Real stories of recovery from those who have been where you are. | remove |
| 387 | What Our Alumni Are Saying | Needs google reviews slide show, also remove We’re here to help 24/7. |
| 388 | Take a Look Inside Dallas Detox Center | Missing facility images, also remove Providing a full continuum of care for addiction and mental health. |
| 389 | Comprehensive Inpatient Rehab Services in Dallas, TX | Missing content from the section |
| 390 | Our Residential Mental Health Treatment in Dallas | the content in this section is the missing content from Comprehensive Inpatient Rehab Services in Dallas, TX. Remove the current title, its no where to be found on the original site. also remove Supporting your recovery at every stage. |
| 391 | Frequently Asked Questions | Should be an accordian tool format |
| 392 | Confidential help is available 24/7 - text box | remove |
| 393 | Take the First Step Toward Recovery section | remove Get the Help You Need Right Now and add a submission box like the one in the verify Insurance page |

**`/university-park`**

| # | Issue | Fix |
|---|---|---|
| 120 | Drug Rehab Near Arlington, TX | remove |
| 121 | We Can Help You - No Matter What. text box | remove |
| 122 | Get Help Now - Blank text box | add a link to admission page |
| 123 | We are here for you - Blank text box | remove |
| 124 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 125 | Get the Help You Need Right Now | remove |
| 126 | Dallas Detox Center Offers Addiction Treatment near University Park, TX | create its own designated section |
| 127 | Get Immediate Help Now text box | remove |
| 128 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 129 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/va-cnn`**

| # | Issue | Fix |
|---|---|---|
| 13 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 29, 2023 | Remove the written by: admin in this page |
| 14 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 15 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 16 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 17 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 18 | Get the Help You Need Right Now - should be above the text of "How Common is Addiction Among Veterans?" in fine text | modify page structure to match the structure in the original page |
| 20 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 22 | Get Immediate Help Now needs to be a box with a verify your insurance button linking to the admissions page | modify page structure to match the structure in the original page |

**`/waco`**

| # | Issue | Fix |
|---|---|---|
| 33 | We Can Help You - No Matter What. - Text box doesn't match the style of the rest | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 34 | Get Help Now - Blank text box | add a link to admission page |
| 35 | We are here for you - Blank text box | Remove |
| 36 | Add "We are here for you" above "What Are the Waco Drug Rehab Options?" in fine text | modify page structure to match the structure in the original page |
| 37 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 38 | Request a Callback - Let Us Help You Begin Your Journey to Recovery - Needs a submission box with Name, Phone, Email, and a "Paying with" picklist containing PPO insurance, POS Insurance, EPO Insurance, HMO Insurance, Medicaid, Medicare, Self-Pay, and No Insurance | modify page structure to match the structure in the original page |
| 39 | "Get the Help You Need Right Now" under "Let Us Help You Begin Your Journey to Recovery" | Remove, was the fine text above an old section |
| 40 | What Should I Look for Within Addition Treatment in Waco? | Remove as a text widget and create its own section |
| 41 | Request a Callback - Let Us Help You Begin Your Journey to Recovery - Needs a call button linked to the sites number | modify page structure to match the structure in the original page |
| 42 | Get Immediate Help Now blank text box widget | Remove |
| 43 | Contact Us blank text box widget | Remove |
| 44 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 45 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 46 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

**`/who-we-help`**

| # | Issue | Fix |
|---|---|---|
| 4 | Our Customized Treatment Programs - Young Adults - Empty Text box | Add content |
| 5 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 6 | What to Expect During Residential Treatment at Dallas Detox Center - Science-backed healing for the mind - Empty Text box | Add content |
| 404 | You Don’t Have to Carry This Alone | Remove and replace with "Take the first step toward recovery today" cta at the bottom of the page |
| 405 | Real Results: Life-Changing Recovery at Our Dallas Facility | Needs google reviews slide show, also remove Get the Help You Need Right Now |
| 406 | Missing text above the first four bullet points | add "Our Dallas detox & residential center provides tailored recovery tracks for specific demographics to ensure clinical relevance and peer connection. We offer specialized programs for:" |
| 407 | Footer text on the vercel site is different from the original site | should be "Dallas Detox Center is a state-of-the-art drug & alcohol treatment program in Dallas, Texas. We offer detoxification, residential inpatient treatment and dual diagnosis in Dallas for those seeking long-term recovery." |

**`/who-we-help/college-students`**

| # | Issue | Fix |
|---|---|---|
| 214 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 1, 2022 | remove admin |
| 215 | We Can Help You - No Matter What. text box | remove |
| 216 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 217 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 218 | Request a Callback | remove |
| 219 | Get Immediate Help Now text box | remove |
| 220 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 221 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/who-we-help/first-responders`**

| # | Issue | Fix |
|---|---|---|
| 206 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 1, 2022 | remove admin |
| 207 | We Can Help You - No Matter What. text box | remove |
| 208 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 209 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 210 | Request a Callback | remove |
| 211 | Get Immediate Help Now text box | remove |
| 212 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 213 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/who-we-help/men`**

| # | Issue | Fix |
|---|---|---|
| 250 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · August 29, 2022 | remove admin |
| 251 | We Can Help You - No Matter What. text box | remove |
| 252 | Get Help Now - Blank text box | add a link to admission page |
| 253 | Eliminate Distractions and Heal | remove |
| 254 | Request a Callback | remove |
| 255 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 256 | Get Immediate Help Now | remove |
| 257 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 258 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/who-we-help/professionals`**

| # | Issue | Fix |
|---|---|---|
| 259 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · August 29, 2022 | remove admin |
| 260 | We Can Help You - No Matter What. text box | remove |
| 261 | Get Help Now - Blank text box | add a link to admission page |
| 262 | We are here for you | remove |
| 263 | Request a Callback | remove |
| 264 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 265 | Get Immediate Help Now | remove |
| 266 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 267 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/who-we-help/veterans`**

| # | Issue | Fix |
|---|---|---|
| 23 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 29, 2023 | Remove the written by: admin in this page |
| 24 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 25 | We Can Help You - No Matter What. - Text box doesn't match the style of the rest | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 26 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 27 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 28 | Get the Help You Need Right Now - should be above the text of "How Common is Addiction Among Veterans?" in fine text | modify page structure to match the structure in the original page |
| 29 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 30 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 32 | Get Immediate Help Now needs to be a box with a verify your insurance button linking to the admissions page | modify page structure to match the structure in the original page |

**`/who-we-help/women`**

| # | Issue | Fix |
|---|---|---|
| 236 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · September 28, 2022 | remove admin |
| 237 | Detox Services | need a text box widget with a link to their respective pages |
| 238 | Residential Inpatient | need a text box widget with a link to their respective pages |
| 239 | Aftercare Planning | need a text box widget with a link to their respective pages |
| 240 | Dual-Diagnosis Program | need a text box widget with a link to their respective pages |
| 241 | We Can Help You - No Matter What. text box | remove |
| 242 | Get Help Now - needs a text box | add a link to admission page |
| 243 | Eliminate Distractions and Heal | remove |
| 244 | How Does Substance Abuse Impact Women?Are There Women's Only Detox Programs? | two separate sections merged into one header. need to be split and the content from the original page should appear on under their respective headers |
| 245 | Request a Callback | remove |
| 246 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 247 | Get Immediate Help Now | remove |
| 248 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 249 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/who-we-help/young-adults`**

| # | Issue | Fix |
|---|---|---|
| 222 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · September 28, 2022 | remove admin |
| 223 | We Can Help You - No Matter What. text box | remove |
| 224 | Get Help Now - Blank text box | add a link to admission page |
| 225 | Know What to Look For - Blank text box | remove |
| 226 | Request a Callback | remove |
| 227 | Alcohol | create its own designated section |
| 228 | Marijuana | create its own designated section |
| 229 | Prescription Pills | create its own designated section |
| 230 | Ecstasy | create its own designated section |
| 231 | Cocaine | create its own designated section |
| 232 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 233 | Get Immediate Help Now | remove |
| 234 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 235 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`/wichita-falls`**

| # | Issue | Fix |
|---|---|---|
| 109 | Drug Rehab Near Arlington, TX | double title on the page, remove |
| 110 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC + March 31, 2023 |
| 111 | We Can Help You - No Matter What. text box | remove |
| 112 | Get Help Now - Blank text box | add a link to admission page |
| 113 | We are here for you - Blank text box | remove |
| 114 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 115 | Get the Help You Need Right Now | remove |
| 116 | Dallas Detox Center Offers Addiction Treatment near Wichita Falls, TX | create its own designated section |
| 117 | Get Immediate Help Now text box | remove |
| 118 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 119 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

**`https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/`**

| # | Issue | Fix |
|---|---|---|
| 381 | Latest blog is missing from the vercel site | Add the new blog to the vercel site |

</details>

<details><summary><b>Des Moines Wellness</b> — 206 issues</summary>

**`/`**

| # | Issue | Fix |
|---|---|---|
| 603 | Iowa's Trusted Destination for Quality Addiction Treatment | Missing see more about us button |
| 604 | Accredited Drug & Alcohol Addiction Rehab in Iowa | Swap section with They Trusted Us. So Can You. |
| 605 | Personalized Rehab Programs in the Heart of Iowa | widgets need links to the treatment type pages |
| 606 | Expert Care for Complex Substance Use Disorders in Iowa | widgets need links to the rehab type pages |
| 607 | Specialized Dual Diagnosis Treatment in Des Moines, Iowa | needs button link to the dual diagnosis page |
| 608 | Take a Virtual Tour of Des Moines Wellness Center | Needs button link to take virtual tour page |
| 609 | Specialized Therapeutic Approaches for Lasting Change | Missing paragraph from original page |
| 610 | Addiction Recovery for Des Moines & Beyond | missing call button |
| 611 | TOP-RATED DRUG & ALCOHOL REHAB IN DES MOINES, IA | Missing paragraph from original page |
| 612 | TOP-RATED DRUG & ALCOHOL REHAB IN DES MOINES, IA | missing call button & verify your insurance button |
| 613 | The Best Version of Your Life is Within Reach | Needs a google map with the location pinned |

**`/about`**

| # | Issue | Fix |
|---|---|---|
| 408 | Serving the Greater Des Moines Area | Needs a google map with the location pinned, also isnt mentioning multiple locations in the original site |
| 409 | Missing The Faces Behind Your Care | Needs the section, also needs the pictures of the staff |
| 410 | Take a Look Inside Our Des Moines Sanctuary | Needs a link to tour our facility |
| 411 | Footer text on the vercel site is different from the original site | should be changed to "Des Moines Wellness Center provides full-spectrum addiction treatment in Des Moines, from medical detox and residential rehab to outpatient care, using structured, evidence-based approaches." |
| 412 | Footer areas we serve section has missplaced links | Remove Verify Insurance & Privacy policy from this section of the footer |
| 413 | Header is missing a verify insurance button / link | add to header |
| 414 | About Des Moines Wellness: Our Story, Team & Values | Should use a picture of the facility instead of a stock image |

**`/admissions`**

| # | Issue | Fix |
|---|---|---|
| 415 | We Work With Your Insuranc section | Add the submission tool like in verify insurance page |
| 416 | How To Help A Loved One Struggling With Substance Abuse? | Missing paragraph, only contains bullet points from original page |
| 417 | Your Path to Recovery in 3 Simple Steps | Missing paragraph, only contains bullet points from original page |
| 418 | Navigating Local And National Support Systems | Missing clickable links to local support resources & national resources, remove the link from the widget and make the text on each widget a clickable link |

**`/areas-we-serve/`**

| # | Issue | Fix |
|---|---|---|
| 419 | The Best Version of Your Life is Within Reach | Needs a google map with the location pinned |

**`/areas-we-serve/ankeny`**

| # | Issue | Fix |
|---|---|---|
| 420 | Our evidence-based Rehab Programs Minutes from Ankeny | Missing links on the widgets to each service page |
| 421 | A Private, Accessible Sanctuary Just 15 Minutes From Ankeny | Missing paragraph, only contains bullet points from original page |
| 422 | Missing Frequently Asked Questions | Use the faqs from the original page |
| 423 | Step Out of the Darkness and Into Lasting Healing | Needs a google map with the location pinned |

**`/areas-we-serve/west-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 424 | From Detox to Outpatient in One Location: Our levels of care | Missing links on the widgets to each service page, also missing paragraph used in the original site |
| 425 | Why West Des Moines Families Choose Our Drug Rehab | Missing links on the widgets to each service page |
| 426 | Easy Driving Directions From West Des Moines | missing paragraph used in the original site |
| 427 | Missing Frequently Asked Questions | Use the faqs from the original page |
| 428 | Explore Our Beautiful Central Iowa Facility | missing tour the facility link |
| 429 | Step Out of the Darkness and Into Lasting Healing | Needs a google map with the location pinned |

**`/blog`**

| # | Issue | Fix |
|---|---|---|
| 430 | Missing blogs from main site | add the missing blogs from the site |

**`/programs/des-moines-outpatient-rehab`**

| # | Issue | Fix |
|---|---|---|
| 431 | Most Major Private Insurance Plans Accepted | Needs the insurance icons |
| 432 | PHP vs. IOP: Choosing the Right Level of Support | missing paragraph used in the original site |
| 433 | PHP vs. IOP: Choosing the Right Level of Support | Bullet points on the widgets need to be structured |
| 434 | Outpatient Programs: The Last Step In Your Recovery from Addiction | needs links to the service pages mentioned in the widgets |
| 435 | Convenient Access for Central Iowa | missing bullet points |
| 436 | Missing FAQs | add faqs from the main page |
| 437 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 438 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |
| 439 | Expert-led Outpatient Addiction Treatment Programs in Iowa | needs a verify your insurance button |
| 440 | Levels Of Care | remove the raw links, make each widget a clickable link to the raw links instead |
| 441 | Convenient Access for Central Iowa | merge this section with ""Secure Your Private Clinical Assessment" |
| 442 | url clean up, for /des-moines-outpatient-rehab | remove des-moines, leave as outpatient rehab |

**`/programs/dual-diagnosis`**

| # | Issue | Fix |
|---|---|---|
| 443 | Most Major Private Insurance Plans Accepted | Needs the insurance icons |
| 444 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 445 | Integrated Care Across the Continuum | needs links to the service pages mentioned in the widgets |
| 446 | Beyond Our Doors: Your Iowa Support Network | missing paragraph used in the original site |
| 447 | Levels Of Care | remove section or merge with Integrated Care Across the Continuum |
| 448 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |

**`/programs/iop-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 449 | Most Major Private Insurance Plans Accepted | Needs the insurance icons |
| 450 | url clean up, for /iop-des-moines | remove des-moines, leave as iop |
| 451 | IOP in Des Moines: A Foundation for Your Daily Routine | missing paragraph used in the original site |
| 452 | Where IOP Fits in the continuum of care in Iowa | needs links to the service pages mentioned in the widgets |
| 453 | Our Specialized IOP Treatment Tracks | should be an accordian tool format, only contains answers & missing questions |
| 454 | Convenient Access for Central Iowa | missing paragraph used in the original site |
| 455 | Levels Of Care | remove section or merge with Where IOP Fits in the continuum of care in Iowa |
| 456 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 457 | Missing Common Questions About Our IOP Program | use the faqs from the original page |
| 458 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |

**`/programs/medical-detox-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 459 | url clean up, for /medical-detox-des-moines | remove des-moines |
| 460 | Most Major Private Insurance Plans Accepted | Needs the insurance icons |
| 461 | Specialized Detox Programs for each substance right here in Des Moines | widgets should link to the treatment pages |
| 462 | Medical Detox Is Only The First Step | widgets should link to the program pages |
| 463 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 464 | Levels Of Care | remove section or merge with Specialized Detox Programs for each substance right here in Des Moines |
| 465 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |
| 466 | Affordable Medical Detox & Addiction Treatment in Des Moines | needs a verify your insurance button |

**`/programs/php-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 467 | url clean up, for /php-des-moines | remove des-moines |
| 468 | Most Major Private Insurance Plans Accepted | Needs the insurance icons |
| 469 | PHP vs. IOP: Choosing the Right Level of Support | Bullet points on the widgets need to be structured |
| 470 | Where PHP Fits in Your Recovery Journey | widgets should link to the program pages |
| 471 | LOCAL EXCELLENCE in Iowa | should be all capital |
| 472 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 473 | Levels Of Care | Remove raw urls, link the widgets to the raw urls |
| 474 | Missing Frequently Asked Questions About PHP | add faqs from the main page |
| 475 | TAKE THE NEXT STEP today | should be all capital |
| 476 | Premier Des Moines Partial Hospitalization Program for Lasting Recovery | add a verify insurance button |
| 477 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |

**`/programs/residential-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 478 | Our Clinical Sanctuary In Iowa | Missing a tour our facility link |
| 479 | Medical Detox Is Only The First Step | widgets should link to the program pages |
| 480 | Specialized Rehab Programs for each substance in Iowa | should be an accordian tool format, only contains answers & missing questions |
| 481 | Common Questions About Residential Treatment | should be an accordian tool format, only contains answers & missing questions |
| 482 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle |
| 483 | your RECOVERY STARTS HERE | should be all capital |
| 484 | Des Moines' Leading Inpatient Treatment Center | Needs verify your insurance button |
| 485 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned |

**`/team`**

| # | Issue | Fix |
|---|---|---|
| 486 | Experienced, Compassionate, Local | Should be above the team members, mentions select any team member below |
| 487 | Bethany Hamilton, RCS, CMA | Missing photo for staff member |
| 488 | Wesley Starlin | missing job titles, Wesley Starlin, LMHC |

**`/tour`**

| # | Issue | Fix |
|---|---|---|
| 489 | Clinical Modalities for Emotional & Behavioral Stability | Each widget needs to be linked to the therapy type |
| 490 | A Trusted Clinical Partner for Recovery in Iowa | Remove stock image, add google reviews |
| 491 | Our 3-Step Clinical Framework | Missing paragraph from original page |
| 492 | Use Your Insurance for Addiction Rehab | Needs the insurance icons |
| 493 | We Work With Your Insurance | Needs the insurance icons |
| 494 | Tour Our Luxury Facility | Missing Take the virtual tour section with facility video |

**`/what-we-treat`**

| # | Issue | Fix |
|---|---|---|
| 495 | Targeted Solutions for Complex Conditions | should be the first section |
| 496 | Targeted Solutions for Complex Conditions | Missing paragraph from original page |
| 497 | Conditions We Treat | instead of widgets use a list type format, the stock images dont help when navigating different conditions |
| 498 | Treating the Mental Health Triggers Behind Addiction | needs link to the dual diagnosis page |
| 499 | Use Your Insurance for Addiction Rehab | needs insurance icons |
| 500 | Missing Most Frequently asked questions | Use the faqs from the original page |

**`/what-we-treat/alcohol-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 501 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 502 | url clean up, for /alcohol-rehab-des-moines | remove des-moines |
| 503 | Common Red Flags of Alcoholism | Missing paragraph from original page |
| 504 | Managing Alcohol Withdrawal Symptoms Safely: | Missing paragraph from original page |
| 505 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | Missing paragraph from original page |
| 506 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | Each widget needs to be linked to the therapy type |
| 507 | Alcohol Treatment & Dual Diagnosis | needs link to the dual diagnosis page |
| 508 | THE WAY WE HEAL alcohol addiction | should be all capital |
| 509 | Our Approach to Alcohol Recovery in Des Moines, Iowa | Missing paragraph from original page |
| 510 | Keeping Your Job While Seeking Help | missing call button |
| 511 | Recovery Resources in Des Moines and Across Iowa | Missing paragraph from original page |
| 512 | Frequently Asked Questions | should be an accordian tool format, only contains answers & missing questions |
| 513 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 514 | TAKE THE FIRST STEP now | should be all capital |
| 515 | Start Your Alcohol Recovery Journey in Des Moines | missing call button & verify your insurance button |
| 516 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |
| 517 | START Your Recovery Today | should be all capital |

**`/what-we-treat/benzo-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 518 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 519 | Let Your Insurance Support Your Recovery | missing call button & verify your insurance button |
| 520 | Verify Your Insurance button | remove floating verify your insurance button |
| 521 | What Benzodiazepine Addiction Looks Like | Missing paragraph from original page |
| 522 | Managing Alcohol Withdrawal Symptoms Safely: | refrencing alcohol when it should be benzo |
| 523 | Managing Alcohol Withdrawal Symptoms Safely: | Missing paragraph from original page |
| 524 | Treating the Root Causes of Benzo Addiction in Des Moines, Iowa | Missing paragraph from original page |
| 525 | Treating the Root Causes of Benzo Addiction in Des Moines, Iowa | widgets need links to the treatment type pages |
| 526 | Dual Diagnosis Treatment for Benzo Addiction | needs button link to the dual diagnosis page |
| 527 | Our Approach to Benzo Rehab in Des Moines, Iowa | Missing paragraph from original page |
| 528 | Job Protection and FMLA During Benzo Rehab | missing call button |
| 529 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 530 | Getting to Treatment in Des Moines, Iowa | Needs a google map with the location pinned |
| 531 | Missing Most Frequently asked questions | Use the faqs from the original page |
| 532 | url clean up, for /benzo-rehab-des-moines | remove des-moines |

**`/what-we-treat/cocaine-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 533 | url clean up, for /cocaine-rehab-des-moines | remove des-moines |
| 534 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 535 | What Cocaine Addiction Looks Like | Missing bullet points |
| 536 | Our Approach to Cocaine Rehab in Des Moines, Iowa | Missing paragraph from original page |
| 537 | Missing paragraph from original page | Missing paragraph from original page |
| 538 | Cocaine Addiction Treatment After Detox in Des Moines | widgets need links to the treatment type pages |
| 539 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 540 | Missing Most Frequently asked questions | Use the faqs from the original page |
| 541 | Cocaine Rehab and Detox in Des Moines, Iowa | missing call button & verify your insurance button |
| 542 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |

**`/what-we-treat/drug-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 543 | url clean up, for /drug-rehab-des-moines | remove des-moines |
| 544 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 545 | Medical Drug Detox In Des Moines: Manage Withdrawal Safely | Missing paragraph from original page |
| 546 | Managing Drug Withdrawal Symptoms Safely: | Missing paragraph from original page |
| 547 | Managing Drug Withdrawal Symptoms Safely: | needs button link to detox program |
| 548 | What Drug Rehab in Des Moines Looks Like | widgets need links to the treatment type pages |
| 549 | Evidence-Based Therapies For Drug addiction treatment | addiction treatment needs the first letters capitalized |
| 550 | Evidence-Based Therapies For Drug addiction treatment | Missing paragraph from original page |
| 551 | Evidence-Based Therapies For Drug addiction treatment | widgets need links to the treatment type pages |
| 552 | Drug Addiction and Dual Diagnosis Treatment | needs button link to the dual diagnosis page |
| 553 | Why Choose Our Drug Rehab in Des Moines, IOWA | Iowa should not be fully capitalized, only capitalize the I |
| 554 | Go to Drug Rehab Without Losing Your Job | missing call button |
| 555 | Drug Addiction Recovery Resources In Des Moines and Broader Iowa | Missing sentence from original page |
| 556 | Missing Frequently asked questions | Use the faqs from the original page |
| 557 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 558 | Drug Rehab in Des Moines, IA: Get Help Today | missing call button & verify your insurance button |
| 559 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |

**`/what-we-treat/fentanyl-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 560 | url clean up, for /fentanyl-rehab-des-moines | remove des-moines |
| 561 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 562 | Common Red Flags of Fentanyl Use | Missing paragraph from original page |
| 563 | Step 1 Of Alcohol Addiction Recovery | references Alcohol, change to Fentanyl |
| 564 | Medical Fentanyl Detox in Des Moines | Missing paragraph from original page |
| 565 | Missing section from original page: Managing Fentanyl Withdrawal Symptoms Safely: | add section in the Medical Fentanyl Detox in Des Moines spot, above the widgets |
| 566 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | references Alcohol, change to Fentanyl |
| 567 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | widgets need links to the treatment type pages |
| 568 | Fentanyl Addiction and Dual Diagnosis | needs button link to the dual diagnosis page |
| 569 | Our Approach to Fentanyl Addiction Recovery in Iowa | Missing paragraph from original page |
| 570 | THE WAY WE HEAL alcohol addiciton | references Alcohol, change to Fentanyl |
| 571 | Job Protection and FMLA for Fentanyl Addiction Treatment | missing call button |
| 572 | Fentanyl & Addiction Resources | use the links provided in the original site page |
| 573 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 574 | Missing Frequently asked questions | Use the faqs from the original page |
| 575 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |
| 576 | START Your Recovery Today | Start shouldnt be fully capitalized, only Capital the S |

**`/what-we-treat/meth-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 577 | url clean up, for /meth-rehab-des-moines | remove des-moines |
| 578 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 579 | Recognizing the Signs: When to Seek Help | Missing top and botton paragraph from original page |
| 580 | Recognizing the Signs: When to Seek Help | missing call button |
| 581 | Medical Detox for Methamphetamine in Des Moines, IOWA | Iowa should not be fully capitalized, only capitalize the I |
| 582 | Medical Detox for Methamphetamine in Des Moines, IOWA | Missing paragraph from original page |
| 583 | One Location. Every Level of Care. | widgets need links to the treatment type pages |
| 584 | Evidence-Based Therapies for Meth Recovery | Missing top and botton paragraph from original page |
| 585 | Meth addiction Treatment & Dual Diagnosis | needs button link to the dual diagnosis page |
| 586 | Local Iowa Resources for Methamphetamine Recovery | Missing paragraph from original page |
| 587 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 588 | Cocaine Rehab and Detox in Des Moines, Iowa | missing call button & verify your insurance button |
| 589 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |
| 590 | Cocaine Rehab and Detox in Des Moines, Iowa | references Cocaine, change to Meth |

**`/what-we-treat/prescription-drug-rehab-des-moines`**

| # | Issue | Fix |
|---|---|---|
| 591 | Prescription Drug Rehab in Des Moines, Iowa | Missing paragraph from original page |
| 592 | Let Your Insurance Support Your Recovery | needs insurance icons |
| 593 | Signs of Prescription Drug Dependency | Missing paragraph from original page |
| 594 | Managing Prescription Drug Withdrawal Symptoms Safely: | Missing paragraph from original page |
| 595 | Managing Prescription Drug Withdrawal Symptoms Safely: | needs button link to detox program |
| 596 | Sustaining Recovery Through Every Stage in Des Moines, Iowa | widgets need links to the treatment type pages |
| 597 | Evidence-Based Clinical Modalities for Drug Rehab | should be an accordian tool format, only contains answers & missing treatment types |
| 598 | Dual Diagnosis: Treating the Root of Dependency | needs button link to the dual diagnosis page |
| 599 | Recovery Resources in Des Moines and Across Iowa | use the links provided in the original site page |
| 600 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page |
| 601 | Prescription Drug Addiction Treatment in Des Moines | missing call button & verify your insurance button |
| 602 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned |

</details>

<details><summary><b>Hillside Mission</b> — 242 issues</summary>

**`/about`**

| # | Issue | Fix |
|---|---|---|
| 614 | Angela “Angie” Taylor, RADT | Missing staff photo |

**`/admissions`**

| # | Issue | Fix |
|---|---|---|
| 615 | Check your coverage — free & confidential. | should be the first section |
| 616 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/alcohol`**

| # | Issue | Fix |
|---|---|---|
| 617 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 618 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 619 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 620 | Life on lifes terms. | should read, Support for Life After Treatment |
| 621 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 622 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 623 | Fading issue throughout the whole site | The fading in of the content sometimes takes a while to load, remove the feature |

**`/anaheim`**

| # | Issue | Fix |
|---|---|---|
| 624 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 625 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 626 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 627 | Life on lifes terms. | should read, Support for Life After Treatment |
| 628 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 629 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 630 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/anthem`**

| # | Issue | Fix |
|---|---|---|
| 631 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 632 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 633 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 634 | Life on lifes terms. | should read, Support for Life After Treatment |
| 635 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 636 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 637 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/bcbs`**

| # | Issue | Fix |
|---|---|---|
| 638 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 639 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 640 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 641 | Life on lifes terms. | should read, Support for Life After Treatment |
| 642 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 643 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 644 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/benzos`**

| # | Issue | Fix |
|---|---|---|
| 645 | Page title: benzos | Capitalize the B |
| 646 | Benzo DrugRehab | add a space in between Drug Rehab |
| 647 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 648 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 649 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 650 | Life on lifes terms. | should read, Support for Life After Treatment |
| 651 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 652 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 653 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/blog`**

| # | Issue | Fix |
|---|---|---|
| 654 | The Hillside Mission blog | Capitalize the B |
| 655 | Newest blog not posting along side the older blogs | Fix the placement of the new blogs |
| 656 | Latest blog article for Hillside is missing | Import the blog What Is Narcan? How It Works & How to Use It |

**`/cocaine`**

| # | Issue | Fix |
|---|---|---|
| 657 | Cocaine DrugRehab | add a space in between Drug Rehab |
| 658 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 659 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 660 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 661 | Life on lifes terms. | should read, Support for Life After Treatment |
| 662 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 663 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 664 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/costa-mesa`**

| # | Issue | Fix |
|---|---|---|
| 665 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 666 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 667 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 668 | Life on lifes terms. | should read, Support for Life After Treatment |
| 669 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 670 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 671 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/dana-point`**

| # | Issue | Fix |
|---|---|---|
| 672 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 673 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 674 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 675 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 676 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |

**`/fentanyl`**

| # | Issue | Fix |
|---|---|---|
| 677 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 678 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 679 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 680 | Missing Health Insurance Can Pay for Rehab. | add with insurance icons from the homepage |
| 681 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 682 | fentanyl addiction treatment | F should be capitalized |
| 683 | fentanyl title | F should be capitalized |

**`/first-health-network`**

| # | Issue | Fix |
|---|---|---|
| 684 | introduction to First Health Network | I should be capitalized |
| 685 | drug detoz, in the Does First Health Network Cover Drug Detox? section | misspelled, should be detox |
| 686 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 687 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 688 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 689 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/first-responders`**

| # | Issue | Fix |
|---|---|---|
| 690 | Orange County Drug Rehab for First Responders | Formatting is missing |
| 691 | First RespondersRehab programs | RespondersRehab should have a space in between |
| 692 | call (866)470-7342 now! | Using a different phone number than whats being used on the nav bar |
| 693 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 694 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 695 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 696 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 697 | Life on lifes terms. | should read, Support for Life After Treatment |
| 698 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/heroin`**

| # | Issue | Fix |
|---|---|---|
| 699 | heroin addiction treatment | H should be capitalized |
| 700 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 701 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 702 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 703 | Life on lifes terms. | should read, Support for Life After Treatment |
| 704 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/how-to-detoc-from-xanax`**

| # | Issue | Fix |
|---|---|---|
| 705 | URL Clean up | how-to-detoc-from-xanax should be detox |

**`/irvine`**

| # | Issue | Fix |
|---|---|---|
| 706 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 707 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 708 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 709 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 710 | Life on lifes terms. | should read, Support for Life After Treatment |
| 711 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/lake-forest`**

| # | Issue | Fix |
|---|---|---|
| 712 | Drug Abuse in California | should be an H4 |
| 713 | Drug Abuse in Lake Forest | should be an H4 |
| 714 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 715 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 716 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 717 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 718 | Life on lifes terms. | should read, Support for Life After Treatment |
| 719 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/long-beach`**

| # | Issue | Fix |
|---|---|---|
| 720 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 721 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 722 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 723 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 724 | Life on lifes terms. | should read, Support for Life After Treatment |
| 725 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 726 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |

**`/magellan`**

| # | Issue | Fix |
|---|---|---|
| 727 | introduction to magellan | I should be capitalized |
| 728 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 729 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 730 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 731 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 732 | Life on lifes terms. | should read, Support for Life After Treatment |
| 733 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/men`**

| # | Issue | Fix |
|---|---|---|
| 734 | Men's Treatmentin Orange County | Treatmentin, should be spaced out to "Treatment in" |
| 735 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 736 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 737 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |

**`/meth`**

| # | Issue | Fix |
|---|---|---|
| 738 | Meth addiction treatment | A & T should be capitalized |
| 739 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 740 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 741 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 742 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |

**`/mission-viejo-rehab`**

| # | Issue | Fix |
|---|---|---|
| 743 | What Our Clients Say About Hillside Mission | Needs the google reviews slide |
| 744 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 745 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 746 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 747 | Tour Our Mission Viejo Rehab Facility | Needs a tour button link |
| 748 | Frequently Asked Questions | Needs questions, has only answers. Should be in accordian format |
| 749 | 866-939-5174 | Using a different phone number than whats being used on the nav bar |
| 750 | Image sizes | fix the sizing of the images to fit the page better |
| 751 | Medically Reviewed by Monica Olivires, CADC II | should be a widget with a see full bio link to the staff page |
| 752 | Dual Diagnosis Treatment | Must be a widet like the one in the original page linking to its respective page |
| 753 | Your health insurance can pay for rehab. | Should be under "Medically Reviewed by Monica Olivires, CADC II " |

**`/newport-beach`**

| # | Issue | Fix |
|---|---|---|
| 754 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 755 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 756 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 757 | Life on lifes terms. | should read, Support for Life After Treatment |
| 758 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 759 | How Hillside Mission Can Help | Detox, Inpatient Treatment, Aftercare & Luxury Accommodations should be H4's |

**`/orange-county`**

| # | Issue | Fix |
|---|---|---|
| 763 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 764 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 765 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 766 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |

**`/orange-county-behavioral-health`**

| # | Issue | Fix |
|---|---|---|
| 760 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 761 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 762 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |

**`/prescription-drugs`**

| # | Issue | Fix |
|---|---|---|
| 767 | Prescription Drugs addiction treatment | addition treatment should have the A & T capitalized |
| 768 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 769 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 770 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 771 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/privacy-policy`**

| # | Issue | Fix |
|---|---|---|
| 772 | Page content missing | All the content got stuck in the title description area, needs to be reinput into the content area |

**`/san-clemente`**

| # | Issue | Fix |
|---|---|---|
| 773 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 774 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 775 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 776 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 777 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |

**`/san-juan-capistrano`**

| # | Issue | Fix |
|---|---|---|
| 778 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 779 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 780 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 781 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 782 | How Hillside Mission is Different | Supervised Detox, Inpatient Treatment, Outpatient Care & Luxury Accommodations can all be H4's |
| 783 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 784 | Life on lifes terms. | should read, Support for Life After Treatment |

**`/seal-beach`**

| # | Issue | Fix |
|---|---|---|
| 785 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 786 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 787 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 788 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 789 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 790 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 791 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 792 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 793 | How Hillside Mission is Different | Supervised Detox, Inpatient Treatment, Outpatient Care & Luxury Accommodations can all be H4's |
| 794 | (866)470-7342 | Using a different phone number than whats being used on the nav bar |
| 795 | Life on lifes terms. | should read, Support for Life After Treatment |

**`/treatment`**

| # | Issue | Fix |
|---|---|---|
| 796 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 797 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 798 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 799 | Life on lifes terms. | should read, Support for Life After Treatment |
| 800 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 801 | Dual Diagnosis Treatment | Must be a widet like the one in the original page linking to its respective page |
| 802 | A Few Words from Our Alumni | Needs the google reviews slide |
| 803 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |

**`/treatment/aftercare-beyond`**

| # | Issue | Fix |
|---|---|---|
| 804 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 805 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 806 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 807 | Life on lifes terms. | should read, Support for Life After Treatment |
| 808 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 809 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |

**`/treatment/detoxification`**

| # | Issue | Fix |
|---|---|---|
| 810 | Drug & Alcohol Detox in mission viejo - at a glance | capitalize the Mission Viejo |
| 811 | Image sizes | fix the sizing of the images to fit the page better |
| 812 | Medically Reviewed by Monica Olivires, CADC II | should be a widget with a see full bio link to the staff page |
| 813 | Your health insurance can pay for rehab. | Should be under "Medically Reviewed by Monica Olivires, CADC II " |
| 814 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 815 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 816 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 817 | Life on lifes terms. | should read, Support for Life After Treatment |
| 818 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 819 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 820 | Trusted by Families, Proven by Results | Needs the google reviews slide |

**`/treatment/dual-diagnosis`**

| # | Issue | Fix |
|---|---|---|
| 821 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 822 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 823 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 824 | Life on lifes terms. | should read, Support for Life After Treatment |
| 825 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 826 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 827 | Image sizes | fix the sizing of the images to fit the page better |
| 828 | Specialized Dual Diagnosis Care in South Orange County | Missing Legit script icon and NAMI icon |

**`/treatment/executives-rehab-in-mission-viejo`**

| # | Issue | Fix |
|---|---|---|
| 829 | Orange County Executives REhab | Lower case the E in rehab |
| 830 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 831 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 832 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 833 | Life on lifes terms. | should read, Support for Life After Treatment |
| 834 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 835 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 836 | Request a Confidential Callback 24/7 | Remove and replace with the "You don't have to do this alone." section |
| 837 | SPECIALIZED PROGRAM FOR HIGH-FUNCTIONING PROFESSIONALS | remove or bake into the top of the title for "What is an Executive Rehab Program?" using the green text used in other sections |

**`/treatment/residential-inpatient`**

| # | Issue | Fix |
|---|---|---|
| 838 | Residential Rehab in mission viejo - at a glance | capitalize the Mission Viejo |
| 839 | Residential Rehab in mission viejo - at a glance | Missing Legit script icon |
| 840 | Image sizes | fix the sizing of the images to fit the page better |
| 841 | Medically Reviewed by Monica Olivires, CADC II | should be a widget with a see full bio link to the staff page |
| 842 | Your health insurance can pay for rehab. | Should be under "Medically Reviewed by Monica Olivires, CADC II " |
| 843 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 844 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 845 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 846 | Life on lifes terms. | should read, Support for Life After Treatment |
| 847 | Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Mission Veijo facility. | Mission Viejo is misspelled |
| 848 | Clinical Excellence & Real Recovery: Our Patient Reviews | Needs the google reviews slide |

**`/women`**

| # | Issue | Fix |
|---|---|---|
| 849 | Detoxification | Must be a widet like the one in the original page linking to its respective page |
| 850 | Residential Inpatient | Must be a widet like the one in the original page linking to its respective page |
| 851 | Aftercare & Alumni | Must be a widet like the one in the original page linking to its respective page |
| 852 | Life on lifes terms. | should read, Support for Life After Treatment |
| 853 | Addiction in Men and Women is Different | remove or bake into the top of the title for "How Does Substance Abuse Impact Women?" using the green text used in other sections |
| 854 | Don’t Wait Any Longer | Remove and replace with the "You don't have to do this alone." section |
| 855 | Request a Confidential Callback 24/7 | Remove and replace with the "You don't have to do this alone." section |

</details>

<details><summary><b>Laguna View Detox</b> — 99 issues</summary>

**`(no URL given)`**

| # | Issue | Fix |
|---|---|---|
| 1179 | Missing Table of Content tool | Add tool |
| 1180 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1181 | Remove the paragraph under the title | remove content |
| 1182 | Create new section as the introduction named "Benzo Rehab Center in California" | Use the missing 3 paragraphs from the original page for this section |
| 1183 | What Are Benzos? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1184 | Signs of Benzo Use | display what shouldve been bullet points. and add the last paragraph on the original page |
| 1185 | How Do Benzos Affect the Body? | add missing bullet points and missing content from original page |

**`/`**

| # | Issue | Fix |
|---|---|---|
| 1087 | Needs an Editorial Policy Page | Create Editorial Policy and append to the footer next to privacy page |
| 1088 | Footer Yelp logo is broken | Fix the logo structure for Yelp |
| 1089 | Footer DHCS License missing link | provide the following link to the DHCS page: https://geohub-cadhcs.hub.arcgis.com/datasets/63459617d2604decab840bd2ca047ee2_11/explore?filters=eyJMZWdhbF9FbnRpdHlfTmFtZSI6WyJMQUdVTkEgVklFVyBDRU5URVIsIExMQyJdfQ%3D%3D&location=36.665989%2C-119.372965%2C7&showTable=true |

**`/admissions`**

| # | Issue | Fix |
|---|---|---|
| 1133 | Content under Admissions Title | remove from below the title |
| 1134 | Missing Google Reviews | Add Google review slide show |

**`/alcohol-detox-and-treatment-programs`**

| # | Issue | Fix |
|---|---|---|
| 1142 | Why Choose Us | In this section, add the missing boxes appearing on the original site |
| 1143 | Start Your Journey to Sobriety Today | Add the section, "Your treatment may be fully covered." from the Admissions Page |

**`/blog`**

| # | Issue | Fix |
|---|---|---|
| 1136 | CPTX test blog is not populating next to the other facilities | Fix placement of new blogs next to old ones |
| 1137 | Blog categories | New CPTX Blogs need to populate using categories like the old ones shown on the page |

**`/contact`**

| # | Issue | Fix |
|---|---|---|
| 1135 | Google Map Bug | Map is not showing the location bird eye view |

**`/drug-addiction-treatment`**

| # | Issue | Fix |
|---|---|---|
| 1138 | Why Choose Us? | Below this section, add the missing boxes appearing on the original site |
| 1139 | Start Your Journey Today | Add the CTA "Your journey to recovery begins today." near the footer |
| 1140 | Client Stories of Hope & Recovery | Clean up structure for this section to make it look less sloppy |
| 1141 | We Work With Most Insurance | Add the section, "Your treatment may be fully covered." from the Admissions Page |

**`/luxury-rehab`**

| # | Issue | Fix |
|---|---|---|
| 1122 | Luxury drug & alcohol treatment | Capitalize the first letters of each word |
| 1123 | Missing Table of Content tool | Add tool |
| 1124 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: June 22, 2021 |
| 1125 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Remove picture to help with the long section |
| 1126 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Remove from the bottom of the section: "Laguna View Detox offers a state-of-the-art drug & alcohol detox program that is safe & effective at our Orange County facility. The evidence-based approach at Laguna View Detox's luxury residential inpatient program offers world-class methods that work. We offer thorough aftercare planning & alumni programming to keep clients connected to the recovery community." |
| 1127 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1128 | The Difference Between Luxury Drug Rehab Centers and Non-Luxury | Have AI clean the size of this section while keeping the message |
| 1129 | Discover Our Luxury Drug Treatment Center | Remove "We work with most PPO and POS insurance carriers, like Aetna, Cigna, and BlueCross BlueShield, to help cover the cost of rehabilitation. We also offer private payment methods to get you the treatment you need. If luxury drug rehabilitation can help you or your loved one, contact us today." from section |

**`/tour`**

| # | Issue | Fix |
|---|---|---|
| 1130 | Content under Step inside our oceanview estate Title | remove from below the title |
| 1131 | Real Treatment in a Luxury Setting | Repalce header with "Explore Laguna View Detox" |
| 1132 | Real Treatment in a Luxury Setting | Include Laguna View Video under the first paragraph in the center |

**`/treatment`**

| # | Issue | Fix |
|---|---|---|
| 1090 | Finding Help at the best addiction treatment center in California. | Should be a header in the page content |
| 1091 | Content under Addiction Treatment Programs in Laguna Beach Title | Should be the first section of content, remove from below the title and create its own dedicated section |

**`/treatment/addiction-therapies`**

| # | Issue | Fix |
|---|---|---|
| 1116 | Missing Table of Content tool | Add tool |
| 1117 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: January 18, 2024 |
| 1118 | Content under Addiction Therapy Services Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Customizing treatment to your needs". |
| 1119 | Why is therapy needed? — Understanding Addiction | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1120 | At a Glance | Remove section |
| 1121 | Missing Resources | Add whole section |

**`/treatment/aftercare`**

| # | Issue | Fix |
|---|---|---|
| 1108 | Missing Table of Content tool | Add tool |
| 1109 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Written On: February 17, 2020 Last Review: Feb 2026 |
| 1110 | Content under Aftercare & Alumni Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Aftercare Planning". |
| 1111 | Planning for Long-term Success in Recovery — Aftercare Planning | Change title to "What is Aftercare Planning?" |
| 1112 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide |
| 1113 | Missing Google Review slide "Aftercare: Support That Keeps You on Track After Treatment" | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Dual Diagnosis) |
| 1114 | Missing last section "Find Long-Term Recovery Today" and its content | Add whole section |
| 1115 | Missing Resources | Add whole section |

**`/treatment/detoxification`**

| # | Issue | Fix |
|---|---|---|
| 1092 | Needs table of contents tool | Add tool |
| 1093 | Specialized Detox Tracks We Offer In Laguna Beach | Section needs to contain widgets for each Detox type linking back to the referred page |
| 1094 | Missing content for program types | Add "A Full Continuum of Specialized Care in Laguna Beach, CA" with the different programs as widgets with a link back to the referred page. (Detoxification, Residential Inpatient, Dual Diagnosis + Aftercare & Alumni) |
| 1095 | What Exactly is Detox? | Partial content from the original site. Upload the rest of the section from the main site |
| 1096 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide above "Take Back Your Life Today" |
| 1097 | At a Glance bullets in the wrong section | Add the section to What Exactly is Detox |
| 1098 | Missing Medically Reviewed, Written By, and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: May 2026 |

**`/treatment/detoxification/alcohol`**

| # | Issue | Fix |
|---|---|---|
| 1144 | Missing Table of Content tool | Add tool |
| 1145 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: Feb 2026 |
| 1146 | Remove the paragraph under the title | Create a new section as the introduction using that content, with the new header being, "Alcohol Addiction Treatment in Orange County" |
| 1147 | What is Alcohol? | Add to the end of the paragraph, "As a holistic treatment facility, our staff will modify your treatment program to ensure that you receive the support you need for a healthy recovery. Call (866) 932-3206 to learn more about Laguna View Detox’s treatment options today!" |
| 1148 | What is Alcohol? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1149 | What Are the Signs of Alcohol Use? | Missing Common signs and symptoms bullets in the section from the original page |
| 1150 | How Does Alcohol Affect the Body? | Missing short-term and long-term bullets |
| 1151 | How Does Alcohol Affect the Body? | After adding the missing bullets, include the following paragraph: "Struggling with an alcohol addiction can have a significant impact on your life. The ideal alcohol addiction treatment in Orange County is available at Laguna View Detox. As an inpatient treatment provider, we offer detoxification and inpatient rehab programming. To learn more about our luxurious alcohol rehab in Laguna Beach, call (866) 932-3206." |

**`/treatment/detoxification/heroin`**

| # | Issue | Fix |
|---|---|---|
| 1152 | Missing Table of Content tool | Add tool |
| 1153 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1154 | Remove the paragraph under the title | remove content |
| 1155 | Create new section as the introduction named "Heroin Addiction Treatment" | Use the missing 3 paragraphs from the original page for this section |
| 1156 | What is Heroin? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1157 | What Are the Signs of Heroin Use? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1158 | What Are the Signs of Heroin Use? | Add the missing paragraph in the beginning of this section |
| 1159 | At a Glance | Remove |

**`/treatment/dual-diagnosis`**

| # | Issue | Fix |
|---|---|---|
| 1099 | Missing Medically Reviewed, Written By, Written On and Last Updated | Kris Brace, CADC II Written on: January 5, 2026 Medically-Reviewed By: Riky Hanaumi, LCSW Last Updated: April 2026 |
| 1100 | Content under Dual Diagnosis Treatment in Laguna Beach, CA Title | Should be the first section of content, remove from below the title and create its own dedicated section with the header "Luxury Dual Diagnosis Program in Orange County". The currrent content is missing the second paragraph on the original page. |
| 1101 | Conditions We Treat Through Dual Diagnosis Care | Missing the Substance Abuse Disorders & Mental Health Disorders bullet points. Also missing the last sentence in this section "By treating both addiction and mental health..." |
| 1102 | Missing Google Review slide "They Trusted Us With Their Recovery" | Add the trust index google reviews slide above "How Dual Diagnosis Fits Into the Treatment Process" |
| 1103 | How Dual Diagnosis Fits Into the Treatment Process | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1104 | What to Expect During Dual Diagnosis Treatment in Laguna Beach, CA | Add the following missing content to this section first "Dual diagnosis treatment is structured to support both physical stabilization and mental health care from the beginning. While each treatment plan is personalized, there are common elements you can expect throughout the process:" |
| 1105 | What to Expect During Dual Diagnosis Treatment in Laguna Beach, CA | Create a widget for each treatment plan referenced in the section |
| 1106 | At a Glance | Remove section, randomly populated and not used in any section |
| 1107 | Missing Table of Content tool | Add tool |

**`https://lagunaviewdetox.com/treatment/detoxification/cocaine/`**

| # | Issue | Fix |
|---|---|---|
| 1160 | Missing Table of Content tool | Add tool |
| 1161 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1162 | Remove the paragraph under the title | remove content |
| 1163 | Create new section as the introduction named "Cocaine Addiction Treatment" | Use the missing 4 paragraphs from the original page for this section |
| 1164 | What is Cocaine? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1165 | What Are the Signs of Cocaine Use? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1166 | What Are the Signs of Cocaine Use? | Add the missing paragraphs in the section |
| 1167 | How Does Cocaine Affect the Body? | fix the sloppy ai output to proerly display what shouldve been bullet points. |
| 1168 | How Does Cocaine Affect the Body? | Add the missing paragraphs in the section |
| 1169 | At a Glance | Remove |
| 1170 | How to Treat Cocaine Addiction | Add the missing paragraphs in the section |
| 1171 | Laguna View Detox is a Cocaine Detox Center in California | Add the missing paragraphs in the section |

**`https://lagunaviewdetox.com/treatment/detoxification/meth/`**

| # | Issue | Fix |
|---|---|---|
| 1172 | Missing Table of Content tool | Add tool |
| 1173 | Missing Medically Reviewed, Written By, Written On and Last Updated | Written By: Kris Brace, CADC II Medically-Reviewed By: Riky Hanaumi, LCSW January 18, 2024 |
| 1174 | Remove the paragraph under the title | remove content |
| 1175 | Create new section as the introduction named "Meth Addiction Treatment" | Use the missing 3 paragraphs from the original page for this section |
| 1176 | What is Cocaine? | Add the different programs as widgets in this section with a link back to the referred page. (Detoxification, Residential Inpatient + Aftercare & Alumni) |
| 1177 | What Are the Signs of Meth Use? | display what shouldve been bullet points. |
| 1178 | At a Glance | Remove |

</details>

<details><summary><b>Quadrant Health Group</b> — 231 issues</summary>

**`Des Moines`**

| # | Issue | Fix |
|---|---|---|
| 1083 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |
| 1084 | Des Moines location page is not complete | Shows as coming soon |

**`/`**

| # | Issue | Fix |
|---|---|---|
| 1086 | Needs an Editorial Policy Page | Create Editorial Policy and append to the footer next to privacy page |

**`/about`**

| # | Issue | Fix |
|---|---|---|
| 858 | Replace photo | Replace image with something more appropriate to the message in the content |
| 859 | 10 Locations Nationwide | Should be 12 |

**`/about/meet-the-team`**

| # | Issue | Fix |
|---|---|---|
| 856 | Missing categories of staff positions | Separate the staff by appointed positions Founders, Corporate Leadership Team, Business Development & Alumni Services, Admissions & client care Team, California Leadership, Marina Harbor Detox, South California Leadership, Laguna view detox, Ocean Coast Recovery Center, Hillside Mission Recovery. Texas Facilities > Dallas Detox Center / Fort Worth Wellness Center, Greater Texas Behavioral. Florida Facilities > Seaside Wellness of Palm Beach. New Jersey Facilities > Wellness Recovery Center NJ. Iowa Facilites > Des Moines Wellness Center. Kentucky Facilities > Wellness Ranch. |
| 857 | Add staff photos | For staff that do not have a photo, use the photo used on "Angela Taylor's" page |

**`/blog`**

| # | Issue | Fix |
|---|---|---|
| 861 | The blogs created on Clarion are appearing separate from the blogs previously published | All blogs published should appear on the same area |

**`/locations`**

| # | Issue | Fix |
|---|---|---|
| 860 | Missing facilities in the list | Wellness Detox LA Greater Texas Behavioral Wellness Ranch KY |
| 1085 | Make the whole widget a clickable link | Each facility widget should be a clickable link so if someone clicks on the picture in the widget it redirects to the location page |

**`/locations/dallas-detox-center`**

| # | Issue | Fix |
|---|---|---|
| 1079 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/fort-worth-wellness`**

| # | Issue | Fix |
|---|---|---|
| 1080 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/hillside-mission-recovery`**

| # | Issue | Fix |
|---|---|---|
| 1076 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/laguna-view-detox`**

| # | Issue | Fix |
|---|---|---|
| 1074 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/marina-harbor-detox`**

| # | Issue | Fix |
|---|---|---|
| 1077 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/ocean-coast-recovery`**

| # | Issue | Fix |
|---|---|---|
| 1075 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/seaside-wellness`**

| # | Issue | Fix |
|---|---|---|
| 1081 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/wellness-detox-la`**

| # | Issue | Fix |
|---|---|---|
| 1078 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/locations/wellness-recovery-nj`**

| # | Issue | Fix |
|---|---|---|
| 1082 | Needs a button link to the website | Add a button link next to the call and verify insurance button to their website |

**`/treatment/alcohol-addiction`**

| # | Issue | Fix |
|---|---|---|
| 986 | Struggling with Alcohol? We're Here to Help | Remove the content under the page title as its a duplicated on the pages first section |
| 987 | Recovering from alcohol addiction Is Possible | add google reviews slide |
| 988 | The real Cost of abusing alcohol | remove |
| 989 | Health risks | make an H3 |
| 990 | Life & social consequences | make an H3 |
| 991 | Alcohol withdrawal symptoms: What to expect | make an H3 |
| 992 | Alcohol withdrawal symptoms: What to expect | make an H3 |
| 993 | Trust quadrant health to detox from alcohol safely | create widgets for the topics mentioned in the sections content. |
| 994 | step-by-step alcohol addiction recovery journey | Fix capitalization issues in the header |
| 995 | step-by-step alcohol addiction recovery journey | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 996 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 997 | Therapies we offer: | Link the bullet points to their respective pages |
| 998 | About us: | Link the bullet points to their respective pages |

**`/treatment/ambien-addiction`**

| # | Issue | Fix |
|---|---|---|
| 973 | Ambien addiction treatment | Fix the lack of capitalization on the first letters of each word in the title |
| 974 | Ambien addiction treatment | Remove the content under the page title as its a duplicated on the pages first section |
| 975 | Recovering from ambien addiction Is Possible | add google reviews slide |
| 976 | Consequences of Ambien Addiction - The full impact of ambien addiction: Health & social risks | Wrong header name, remove Health & Social Risks |
| 977 | Missing header under "Consequences of Ambien Addiction" | Add "Health & social risks" |
| 978 | ambien Overdose, what do do | Capitalize the A |
| 979 | ambien Overdose, what do do | Rewrite the misspelling to "What to do" |
| 980 | Trust quadrant health to detox from ambien safely | create widgets for the topics mentioned in the sections content. |
| 981 | step-by-step ambien addiction recovery journey - Comprehensive ambien Addiction Treatment Across All Levels of Care | Fix the capitalization throughout the header |
| 982 | step-by-step ambien addiction recovery journey - Comprehensive ambien Addiction Treatment Across All Levels of Care | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 983 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 984 | Therapies we offer: | Link the bullet points to their respective pages |
| 985 | About us: | Link the bullet points to their respective pages |

**`/treatment/benzo-addiction`**

| # | Issue | Fix |
|---|---|---|
| 893 | Struggling with benzodiazepine addiction? Call today for help | Remove section |
| 894 | Street names of benzodiazepine: | make an H3 |
| 895 | The different types of benzodiazepine: | make an H3 |
| 896 | Stats we see about benzo addiction: | make an H3 |
| 897 | Recovering from Benzo Addiction Is Possible | add google reviews slide |
| 898 | Risks associated: | make an H3 |
| 899 | Benzodiazepine Overdose: | make an H3 |
| 900 | Benzo withdrawal symptoms: What to expect: | make an H3 |
| 901 | The two phases of benzo withdrawal: | make an H3 |
| 902 | Acute withdrawal: | make an H4 |
| 903 | Post-acute withdrawal syndrome: | make an H4 |
| 904 | We Help You Detox Safely from Benzo | create widgets for the topics mentioned in the sections content. |
| 905 | Step-by-Step Benzo Addiction Recovery Journey — Comprehensive Benzo Addiction Treatment Across All Levels of Care | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 906 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 907 | Therapies we offer: | Link the bullet points to their respective pages |
| 908 | About us: | Link the bullet points to their respective pages |

**`/treatment/cocaine-addiction`**

| # | Issue | Fix |
|---|---|---|
| 862 | Recovery starts today | Replace with "Let healing begin today" CTA |
| 863 | Recovering from Cocaine addiction Is Possible | Remove random capitalization |
| 864 | Recovering from Cocaine addiction Is Possible | Add the google reviews slide |
| 865 | The dangers of cocaine Addiction | Remove random capitalization |
| 866 | Health & social risks | make an H3 |
| 867 | Cocaine Overdose, what to do | make an H3 |
| 868 | Cocaine Overdose, what to do | Remove random capitalization |
| 869 | The phases of cocaine withdrawal: | make an H3 |
| 870 | Cocaine withdrawal symptoms: What to expect | make an H3 |
| 871 | Trust quadrant health to detox from cocaine safely | create widgets for the topics mentioned in the sections content |
| 872 | Treatment for Cocaine Addiction | create widgets for the topics mentioned in the sections content |
| 873 | Explore: | make an H4 |
| 874 | Therapies we offer: | Link the bullet points to their respective pages |
| 875 | About us: | Link the bullet points to their respective pages |

**`/treatment/detox`**

| # | Issue | Fix |
|---|---|---|
| 1018 | alcohol and substance abuse detox | Fix the lack of capitalization on the first letters of each word in the title |
| 1019 | Clear your body and mind with expert support | remove section |
| 1020 | Substances We Help Detoxing From | Add links to the substance pages list in the bullets |
| 1021 | Recovering from alcohol & drug addiction Is Possible | add google reviews slide |
| 1022 | Detox: the first step towards sobriety — From Stabilization to Long-Term Recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1023 | Detox: What to Expect | make an H3 |
| 1024 | The Benefits of Detoxification | make an H3 |
| 1025 | Therapies Offered: | Link the bullet points to their respective pages |
| 1026 | About Us: | Link the bullet points to their respective pages |
| 1027 | Therapies Offered: | make an H3 |
| 1028 | About Us: | make an H3 |
| 1029 | Expert care is always within reach — Nationwide drug and alcohol Rehab Centers | add widgets showing the other facilities with their names and links to the location pages. Include a check our locations button that takes the user to the locations page to view all facilities. |

**`/treatment/dual-diagnosis`**

| # | Issue | Fix |
|---|---|---|
| 1067 | Co-Occurring Conditions We Treat | Add links to the substance pages list in the bullets |
| 1068 | Dual Diagnosis Support at Every Step | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1069 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1070 | Therapies we offer: | Link the bullet points to their respective pages |
| 1071 | About us: | Link the bullet points to their respective pages |
| 1072 | DUAL DIAGNOSIS TREATMENT CENTERS NATIONWIDE | Fix the capitalization to only be on the first letters of each word in the title |
| 1073 | DUAL DIAGNOSIS TREATMENT CENTERS NATIONWIDE | add widgets showing the other facilities with their names and links to the location pages. Include a check our locations button that takes the user to the locations page to view all facilities. |

**`/treatment/equine-therapy`**

| # | Issue | Fix |
|---|---|---|
| 1010 | Recovering from alcohol & drug addiction Is Possible | add google reviews slide |
| 1011 | Why Equine Therapy Works: The Neuroscience of Connection | make an H3 |
| 1012 | Horses as Co-Therapists: A Unique Therapeutic Alliance | make an H3 |
| 1013 | Benefits of equine therapy for drug & alcohol addiction | create widgets for the topics mentioned in the sections content. |
| 1014 | Equine Therapy at Every Stage of Recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1015 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1016 | Therapies we offer: | Link the bullet points to their respective pages |
| 1017 | About us: | Link the bullet points to their respective pages |

**`/treatment/family-therapy`**

| # | Issue | Fix |
|---|---|---|
| 999 | Family Therapy for Addiction Recovery | Remove the content under the page title as its a duplicated on the pages first section |
| 1000 | Healing Relationships, Strengthening Recovery | Rename section to " Family therapy and why it matters" |
| 1001 | Recovering from alcohol & drug addiction Is Possible | add google reviews slide |
| 1002 | Common Family Roles in Addiction | make an H3 |
| 1003 | Emotional and Relational Impact | make an H3 |
| 1004 | Benefits of family therapy for drug & alcohol addiction | create widgets for the topics mentioned in the sections content. |
| 1005 | We incorporate family therapy at every stage | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1006 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1007 | Therapies we offer: | Link the bullet points to their respective pages |
| 1008 | About us: | Link the bullet points to their respective pages |
| 1009 | Take the first step Today | Remove section |

**`/treatment/group-therapy`**

| # | Issue | Fix |
|---|---|---|
| 945 | Group Therapy for Addiction Recovery | Remove the content under the page title as its a duplicated on the pages first section |
| 946 | Recovering from alcohol & drug addiction Is Possible | add google reviews slide |
| 947 | Benefits of group therapy for drug and alcohol addiction | create widgets for the topics mentioned in the sections content. make sure the capitalization is proper on the widgets. |
| 948 | Group therapy at every stage of recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 949 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 950 | Therapies we offer: | Link the bullet points to their respective pages |
| 951 | About us: | Link the bullet points to their respective pages |

**`/treatment/heroin-addiction`**

| # | Issue | Fix |
|---|---|---|
| 876 | Missing blog picture | add blog picture from original page |
| 877 | the dangers of heroin Addiction — Devastating effects that touch every aspect of life | Remove random capitalization. only capitalize the first letter of the sentence |
| 878 | Trust quadrant health to detox from heroin safely | create widgets for the topics mentioned in the sections content |
| 879 | Complete treatment for Heroin Addiction — Every step of care under one trusted roof | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 880 | Why Quadrant health? | make an H2 |
| 881 | Therapies we offer: | Link the bullet points to their respective pages |
| 882 | About us: | Link the bullet points to their respective pages |

**`/treatment/individual-therapy`**

| # | Issue | Fix |
|---|---|---|
| 964 | Individual Therapy for Addiction Recovery | Remove the content under the page title as its a duplicated on the pages first section |
| 965 | Missing "Recovering from alcohol & drug addiction Is Possible" section under "What to Expect in Individual Therapy at Quadrant" | add google reviews slide |
| 966 | Core Clinical Techniques Used in Individual Therapy | make an H3 |
| 967 | How Individual Therapy Evolves Through the Recovery Process | make an H3 |
| 968 | Benefits of Individual therapy for drug & alcohol addiction | create widgets for the topics mentioned in the sections content. |
| 969 | Individual Therapy at Every Stage of Recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 970 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 971 | Therapies we offer: | Link the bullet points to their respective pages |
| 972 | About us: | Link the bullet points to their respective pages |

**`/treatment/inhalant-addiction`**

| # | Issue | Fix |
|---|---|---|
| 883 | Recovering from Inhalant addiction Is Possible | add google reviews slide |
| 884 | The Hidden Dangers of Inhalant Abuse | "And why you should take them seriously" - should be a part of the header |
| 885 | inhalant Overdose: react | Capitalize the first letter of Inhalant and react |
| 886 | Inhalant withdrawal symptoms: What to expect | make an H3 |
| 887 | The phases of cocaine withdrawal: | make an H3 |
| 888 | Trust quadrant health to detox from inhalant safely | create widgets for the topics mentioned in the sections content. |
| 889 | Individualized care at every stage of recovery | "Recovery that meets you where you are." - should be a part of the header |
| 890 | Individualized care at every stage of recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 891 | Therapies we offer: | Link the bullet points to their respective pages |
| 892 | About us: | Link the bullet points to their respective pages |

**`/treatment/intensive-outpatient`**

| # | Issue | Fix |
|---|---|---|
| 1043 | Intensive outpatient program | Fix the lack of capitalization on the first letters of each word in the title |
| 1044 | Intensive outpatient program | Remove the content under the page title as its a duplicated on the pages first section |
| 1045 | Intensive outpatient program | Fix the lack of capitalization on the first letters of each word in the header |
| 1046 | Substances we help detoxing from | Add links to the substance pages list in the bullets |
| 1047 | Missing "Recovering from alcohol & drug addiction Is Possible" section under "Substances we help detoxing from" | add google reviews slide to the missing section |
| 1048 | Missing H2 above "What to Expect During IOP at Quadrant Health" | add Understanding IOP |
| 1049 | What to Expect During IOP at Quadrant Health | make an h3 |
| 1050 | IOP vs PHP: How to know what's right for you | make an h3 |
| 1051 | IOP: One Step in a Complete Continuum of Care | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1052 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1053 | Therapies we offer: | Link the bullet points to their respective pages |
| 1054 | About us: | Link the bullet points to their respective pages |
| 1055 | Trusted Care, Wherever You Are — Accredited Rehab Facilities Nationwide | add widgets showing the other facilities with their names and links to the location pages. Include a check our locations button that takes the user to the locations page to view all facilities. |

**`/treatment/methadone-addiction`**

| # | Issue | Fix |
|---|---|---|
| 909 | Overcoming Methadone Addiction | add blog picture from original page |
| 910 | Break free from dependence on a treatment drug | Add section and duplicate content |
| 911 | Fighting methadone addiction: success stories | add google reviews slide |
| 912 | Health & social risks: | make an H3 |
| 913 | Methadone Overdose, what to do: | make an H3 |
| 914 | The phases of methadone withdrawal: | make an H3 |
| 915 | Initial phase: | make an H4 |
| 916 | Peak phase: | make an H4 |
| 917 | Prolonged phase: | make an H4 |
| 918 | Trust Quadrant to detox from methadone safely | create widgets for the topics mentioned in the sections content. |
| 919 | Full-Spectrum Methadone Addiction Care | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 920 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 921 | Therapies we offer: | Link the bullet points to their respective pages |
| 922 | About us: | Link the bullet points to their respective pages |

**`/treatment/methamphetamine-addiction`**

| # | Issue | Fix |
|---|---|---|
| 923 | Hear from those who overcame meth addiction | add google reviews slide |
| 924 | The dangers of methamphetamine Addiction | Capitalize the first letters of Dangers and Methamphetamine |
| 925 | Health & social risks | make an H3 |
| 926 | Overdose, what do do | make an H3 |
| 927 | Understanding the withdrawal symptoms | make an H3 |
| 928 | The phases of cocaine withdrawal: | make an H3 |
| 929 | The phases of cocaine withdrawal: | The content should be put in bullet format and the main points arent properly capitalized |
| 930 | Safe Methamphetamine Detox at Quadrant Health | create widgets for the topics mentioned in the sections content. |
| 931 | Meth Treatment Built for Long-Term Healing | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 932 | Explore: | make an H3 |
| 933 | Therapies we offer: | make an H4 and turn the content in that section into bullets |
| 934 | About us: | make an H4 and turn the content in that section into bullets |
| 935 | Therapies we offer: | Link the bullet points to their respective pages |
| 936 | About us: | Link the bullet points to their respective pages |
| 937 | Recovery starts today | remove old cta |

**`/treatment/opiate-addiction`**

| # | Issue | Fix |
|---|---|---|
| 952 | Struggling with opiate abuse? We're here to help you get better | Remove the content under the page title as its a duplicated on the pages first section |
| 953 | Opiate Addiction Treatment (Intro) | Remove (Intro) |
| 954 | Missing "they overcame their addiction. so can you" section under "Who is most at risk for opiate addiction?" | add google reviews slide |
| 955 | Missing "the dangers of opiate Addiction" section | Add above Health & Social Risks |
| 956 | Health & Social Risks | make an H3 |
| 957 | Opiate Overdose, What to Do | make an H3 |
| 958 | Detox Safely from Opiates at Quadrant Health | create widgets for the topics mentioned in the sections content. |
| 959 | A Complete Continuum of Opiate Recovery Care | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 960 | Levels of Care: | make an H3 |
| 961 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 962 | Therapies we offer: | Link the bullet points to their respective pages |
| 963 | About us: | Link the bullet points to their respective pages |

**`/treatment/partial-hospitalization`**

| # | Issue | Fix |
|---|---|---|
| 1056 | Who Is a PHP For? | Missing content under the bullet points, "At Quadrant Health, our PHP offers the flexibility to begin reintegrating into everyday life while still receiving high-level support from our experienced treatment team." |
| 1057 | Substances Treated | Missing content from original page also the substances should be listed in bullets linked to their respective pages |
| 1058 | Missing section under Substances Treated section, "Recovering from alcohol & drug addiction Is Possible" | Add google reviews to the missing section |
| 1059 | Missing H2 section above What to Expect, "Understanding the Partial Hospitalization program" | add the missing H2, "Understanding the Partial Hospitalization program" |
| 1060 | Why PHP Matters | Missing the last 2 paragraphs of content from the original page |
| 1061 | Treatment Continuum | Should be named "PHP: A Vital Step in Structured Recovery" and missing paragraph of content from the section |
| 1062 | PHP: A Vital Step in Structured Recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1063 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1064 | Therapies we offer: | Link the bullet points to their respective pages |
| 1065 | About us: | Link the bullet points to their respective pages |
| 1066 | Missing section under Why Quadrant Health, add section "Nationwide Rehab Centers You Can Trust" | add widgets showing the other facilities with their names and links to the location pages. Include a check our locations button that takes the user to the locations page to view all facilities. |

**`/treatment/residential-inpatient`**

| # | Issue | Fix |
|---|---|---|
| 1030 | alcohol and drug abuse residential inpatient | Fix the lack of capitalization on the first letters of each word in the title |
| 1031 | alcohol and drug abuse residential inpatient | Remove the content under the page title as its a duplicated on the pages first section |
| 1032 | Substances we help recovering from | Add links to the substance pages list in the bullets |
| 1033 | Recovering from alcohol & drug addiction Is Possible | add google reviews slide |
| 1034 | details about the residential inpatient program | Fix the lack of capitalization on the first letters of each word in the header |
| 1035 | Residential: What to expect | make an H3 |
| 1036 | Comfort & Amenities for healing | make an H3 |
| 1037 | Residential: The Foundation for Lasting Recovery | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 1038 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 1039 | Therapies we offer: | Link the bullet points to their respective pages |
| 1040 | About us: | Link the bullet points to their respective pages |
| 1041 | Nationwide drug and alcohol Rehab Centers | Fix the lack of capitalization on the first letters of each word in the header |
| 1042 | Nationwide drug and alcohol Rehab Centers | add widgets showing the other facilities with their names and links to the location pages. Include a check our locations button that takes the user to the locations page to view all facilities. |

**`/treatment/virtual-intensive-outpatient`**

| # | Issue | Fix |
|---|---|---|
| 938 | Substances We Help Treat | Link the bullet points to their respective pages |
| 939 | Recovering from Alcohol & Drug Addiction | add google reviews slide |
| 940 | Connected Care at Every Stage | create widgets for the topics mentioned in the sections content. add links to their respective pages |
| 941 | Why Quadrant Health? | Missing "Therapies we offer:" & "About us:" |
| 942 | Therapies we offer: | Link the bullet points to their respective pages |
| 943 | About us: | Link the bullet points to their respective pages |
| 944 | Nationwide Drug and Alcohol Rehab Centers | add widgets showing the other facilities with their names and links to the location page. Include a check our location button that takes the user to the locations page to view all facilities. |

</details>

---

<a id="verification-log"></a>
## 6. Verification log — warnings and open actions

14 of 74 log rows carry a warning or an unactioned item.

**V0023** — CONFIRMED_AMENDED

> GBP could not be checked from here, so NAP-versus-GBP consistency stays open and needs someone with profile access. Flagging that the fix as written would send someone to align something that is not broken.

**V0037** — CONFIRMED

> Clean because this row was already rewritten after the earlier deep-dive. Its original wording, "only 13 structural pages against 43 blog posts", had the post count wrong; the current text says 42 and is right. Reads as a caution against verifying only the latest version of a row. Related open question sits in V0108 (whether the missing substance-residential page is by design).

**V0043** — CONFIRMED_AMENDED

> Reclassifying from launch blocker to blocked-pending-confirmation. This is the one row so far where following the fix as written could do real harm.

**V0046** — NOT_CONFIRMED

> Root cause of my error: the original reading came from audit2.py, the same script run that also wrongly reported Greater Texas as missing a homepage canonical. Two false negatives for the same site in the same run points to a bad or truncated response that the script recorded as absence rather than error. ACTION: any other row sourced from that script pass (H1 counts, canonical counts) should be re-tested rather than trusted. The canonical counts were already re-measured and corrected.

**V0048** — CONFIRMED_AMENDED

> Reclassify from launch blocker to blocked-pending-confirmation, consistent with V0043.

**V0049** — CONFIRMED_AMENDED

> Second row this batch where the Fix would remove a working phone line. Same class of risk as V0043.

**V0057** — CONFIRMED_AMENDED

> Finding is sound. Severity depends on whether the extra population pages are wanted at all.

**V0063** — CONFIRMED_AMENDED

> Separate quality issue on the same page: /luxury-addiction-treatment has H1 "Laguna View Detox", which is the brand name rather than a descriptive heading. Worth fixing whichever way the consolidation goes.

**V0064** — CONFIRMED_AMENDED

> Thin overlapping pages plus inverted footer priority. Real issue, different issue, lower risk fix.

**V0068** — BY_DESIGN

> Same applies to the Wellness Detox LA privacy row when it comes up: verified also "noindex, follow". The other two pages flagged by that same generator loop are genuine - Dallas /verify-insurance and Wellness LA /admissions/verify-your-insurance are both "index, follow", so those omissions are real defects. So of the 6 sitemap-omission rows: 2 close as by-design, 3 relate to the shared blog post (consolidate per V0059), and 1 is genuine.

**V0072** — CONFIRMED_AMENDED

> Same unstated migration cost as V0051 and V0057: renaming means redirecting live production URLs. The proposed targets (/treatment/detox, /treatment/residential, /what-we-treat/alcohol) all 404 today, which is expected, but note the rename also implies moving /programs to /treatment, a bigger change than the row suggests.

**V0083** — CONFIRMED_AMENDED

> Root cause reads as a newly written post added to three builds without sitemap or canonical wiring. Worth asking whether other new posts share the same gap - the three I found were only detected because they appeared in the live crawl but not the sitemap.

**V0084** — BY_DESIGN

> Close as no-action. The row did its job - it prevented detox and residential pages being built for a facility that deliberately does not offer them. Worth keeping this row visible rather than deleting it, so the absence is not re-flagged by a future crawl.

**V0098** — CONFIRMED

> The most accurate of the slug rows verified so far - correct variant count, correct site count, and it is the only one that explicitly accounts for all 12 sites including the site with none. The cited model (Ocean Coast /contact) is fine for slug shape, but see the V0094 caution about citing Ocean Coast as a general reference build.

<details><summary>All 74 verification records</summary>

| ID | Verdict | Batch | What was tested, and the result |
|---|---|---|---|
| V0017 | CONFIRMED_AMENDED | B1 | sitemap.xml: 103 URLs, zero matching "verify" -> omission CONFIRMED. /verify-insurance -> HTTP 200 -> live CONFIRMED. Enumerated ALL homepage links whose text mentions verify/insurance: 6 found. 5 correctly target /verify-insurance (all HTTP 200). 1 targets /contact-us. |
| V0018 | CONFIRMED_AMENDED | B1 | preview homepage: canonical ABSENT (confirmed), robots meta "index, follow", x-robots-tag none, robots.txt "Allow: /" -> all sub-claims CONFIRMED. preview /about-us DOES have canonical -> homepage-only scope CONFIRMED (1 of 103). production homepage: canonical https://dallasdetoxcenter.com/ -> self-canonicalising CONFIRMED. |
| V0019 | DUPLICATE | B1 | Claim re-tested and factually true: /verify-insurance HTTP 200, absent from the 103-URL sitemap. However V0017 already states exactly this, in its issue text, location and fix. |
| V0020 | CONFIRMED_AMENDED | B2 | Re-harvested every <a href> across all 103 Dallas pages. All 14 geo pages: 0 inbound internal links. All HTTP 200, all robots "index, follow", all 14 present in sitemap.xml. No hub exists: /areas-we-serve, /locations and /service-areas all HTTP 404. Pages are substantial, 1,406-1,675 words each. |
| V0021 | CONFIRMED | B2 | All 4 bio pages: HTTP 200, 0 inbound internal links across all 103 pages, all present in sitemap.xml. /about-us was checked directly and links to zero bio pages. /about-us/meet-the-team -> HTTP 404, so no team hub exists. Count of 4 is correct. |
| V0022 | CONFIRMED_AMENDED | B2 | All 5 landing pages: HTTP 200, robots "index, follow" (so indexable, as claimed), 0 inbound internal links, all 5 present in sitemap.xml. Orphan and indexable claims CONFIRMED. |
| V0023 | CONFIRMED_AMENDED | B3 | Address confirmed as 100 Mariah Drive, Weatherford, Texas 76087, and it is CONSISTENT everywhere: preview homepage, preview /contact-us, and production https://dallasdetoxcenter.com/contact-us/ all show the same one. JSON-LD MedicalBusiness/MedicalClinic on the homepage carries addressLocality "Weatherford", addressRegion "TX", postalCode 76087 - i.e. the structured data is CORRECT. Body copy verified verbatim: "Located in Dallas TX, our facility is accessible from I-35E, I-30 and Dallas North Tollway, and close to Dallas Fort Worth International Airport and Love Field." Also "Need detox or residential treatment in Dallas TX?" |
| V0037 | CONFIRMED | B3 | Every claim re-tested and holds: 13 structural pages (matches), 42 blog posts (matches), 4 levels of care under /treatment/ (aftercare-planning, detox, dual-diagnosis, mental-health-residential). /what-we-treat -> 404. /treatment/residential, /treatment/residential-inpatient and /treatment/substance-abuse-residential all -> 404, so no substance-residential page exists under any plausible slug. "Conditions We Treat" confirmed present as a homepage heading, with all 7 substances named in copy (alcohol, benzo, opioid, fentanyl, meth, cocaine, prescription). Treatment hub: 13 internal links, all HTTP 200. |
| V0038 | DUPLICATE | B3 | Claim re-tested and true: /who-we-help has 0 child links under /who-we-help/, 7 population H3s (Professionals, Veterans, First Responders, Women, Men, Young Adults, College Students), 565 words total. All 7 Dallas equivalents verified HTTP 200. However V0107 describes the same page and the same defect with more detail. |
| V0039 | CONFIRMED | B4 | Re-tested all 55 sitemap URLs: 55 of 55 have NO canonical link element. Matches the row exactly. robots.txt: "Allow: /" plus "Disallow: /api/". No X-Robots-Tag header. Production homepage HTTP 200 with canonical https://fortworthwellness.org/ so it is self-canonicalising. All four sub-claims hold. |
| V0040 | CONFIRMED_AMENDED | B4 | Tested all 55 pages. 13 carry og:url; 12 of those point at the bare domain root while not being the homepage, so the row figure of 12 of 55 is exactly right. The homepage own og:url legitimately equals the root. Cited correct example verified: Des Moines /about has og:url https://desmoinesrecovery.com/about, so the reference in the Fix column is valid. |
| V0041 | CONFIRMED | B4 | All 7 URLs tested against both hosts. production=404 and preview=404 on every one: /alcohol-detox, /benzo-detox, /meth-detox, /fentanyl-detox, /opioid-detox, /luxury-treatment, /treatment/residential-inpatient. 7 of 7 match, confirming the links are inherited rather than introduced by the rebuild. |
| V0042 | CONFIRMED_AMENDED | B5 | Both claims hold: /privacy-policy is "index, nofollow", and all 54 other Fort Worth pages are "index, follow". It is the only nofollow page on the site. Also checked every privacy page in the portfolio - no other build uses "index, nofollow", so it is an anomaly portfolio-wide as well as site-wide. |
| V0043 | CONFIRMED_AMENDED | B5 | All stated facts verified. 855-416-5648 and 877-590-3665 both appear on all 5 Greater Texas preview pages. Portfolio scan: only Seaside and Greater Texas use 855-416-5648. Seaside production publishes 855-416-5648 and nothing else, so the attribution to Seaside is well supported. |
| V0044 | CONFIRMED | B5 | Every claimed absence verified on the preview: /treatment, /treatment-services, /programs, /contact, /contact-us, /admissions, /admission, /tour, /privacy-policy, /privacy and /about all return 404. Sitemap contains exactly 5 URLs: /, /blog, /our-story, /verify-insurance, /what-we-treat. Count correct. |
| V0045 | CONFIRMED_AMENDED | B6 | /what-we-treat -> HTTP 200 with 0 child links under /what-we-treat/ and only /what-we-treat in the sitemap, so the literal claim of no child condition pages is TRUE. Probed /alcohol, /what-we-treat/alcohol, /alcohol-addiction, /anxiety, /depression - all 404, confirming no condition pages under any slug. |
| V0046 | NOT_CONFIRMED | B6 | FALSE. The homepage HAS exactly one H1: "Structured online addiction & mental health treatment, statewide." Fetched 5 separate times, every run returned h1 count = 1 with one literal "<h1" in the raw HTML. Production greatertexasbehavioral.com also has an H1. All 11 Greater Texas preview pages have exactly one H1 each - zero H1 problems anywhere on the site. |
| V0047 | CONFIRMED_AMENDED | B6 | Count is exactly right: 4 of 11 pages carry og:url pointing at the bare domain root while not being the homepage (/blog, /our-story, /verify-insurance, /what-we-treat). The homepage own root value is legitimate. |
| V0048 | CONFIRMED_AMENDED | B7 | Enumerated all 9 tel: links on the preview homepage. 7 use 866-525-3026; link 6 is 866-932-3206 with anchor "Call 866-932-3206". Portfolio scan: only Laguna and Marina Harbor carry 866-932-3206, and Laguna uses it exclusively, so the attribution to Laguna holds. |
| V0049 | CONFIRMED_AMENDED | B7 | 415-868-3858 confirmed on the preview homepage, anchor "Call Us Now". Three distinct numbers on one page confirmed. Also present on production homepage AND on production /contact-location. |
| V0050 | CONFIRMED_AMENDED | B7 | Both pages live at HTTP 200 with H1 "Gus Saadeh". Marina Harbor version 379 words; parent version 352 words. Measured overlap: 59.5 percent 8-gram Jaccard, 76.1 percent word-level. Substantial reuse confirmed, so the duplicate-content concern is real. Both also exist on production (301 to trailing-slash forms). |
| V0051 | CONFIRMED_AMENDED | B8 | All 6 non-standard slugs verified HTTP 200 on the preview: /admission, /contact-location, /facility, /care-providers, /aftercare, /what-we-offer. All 6 standard forms verified 404: /admissions, /contact, /tour, /about/meet-the-team, /treatment/aftercare, /treatment. So the divergence is real. |
| V0052 | BY_DESIGN | B8 | Both cited pages verified HTTP 200 with real content: /what-we-offer/detox-san-francisco (H1 "Medical Detox") and /what-we-offer/inpatient-rehab-san-francisco (H1 "Luxury Alcohol & Drug Residential Treatment in San Francisco, CA"). Standard-named equivalents /what-we-offer/detox, /what-we-offer/residential and /treatment/detox all 404. So the row is correct: the pages exist, automated checks simply missed them. |
| V0053 | CONFIRMED | B8 | Tested all 118 pages. Exactly 2 carry og:url pointing at the bare domain root while not being the homepage: /blog and /blog/archive. Row figure of 2 of 118 is exact. Notably ALL 118 pages have an og:url element, so there is no absent-tag gap here. |
| V0054 | CONFIRMED_AMENDED | B16-recheck | SUPERSEDES my batch 9 entry. Re-measured with clean content extraction. Hillside baseline is 97.7 percent - the two bio pages are 97.7 percent identical to EACH OTHER, with only 4 differing segments, all of them the name and job title in headings. Root cause found by diffing: /staff/phillip-carter carries MONICA OLIVARES'S BIOGRAPHY VERBATIM. The headings read "Phillip Carter / Director of Operations" while the body text reads "Hi, I'm Monica Olivares - Program Director at Hillside Mission and a firm believer that healing doesn't have to be boring. With over 11 years in the behavioral health field..." |
| V0055 | CONFIRMED_AMENDED | B9 | No verify page exists under any plausible slug: /verify-insurance, /insurance, /verify and /admissions/verify-insurance all 404. /admissions returns 200. Every verify-labelled link tested points to /admissions - 7 on the homepage, 5 on /admissions itself, 7 on /treatment/detoxification. Claim holds exactly. |
| V0056 | CONFIRMED | B9 | Isolated the <footer> element and checked all 7 condition pages. All 7 return HTTP 200. Six are present in the footer (/alcohol, /heroin, /cocaine, /meth, /benzos, /fentanyl); /prescription-drugs is absent. Exactly 6 of 7 as claimed. |
| V0057 | CONFIRMED_AMENDED | B10 | Confirmed exactly. /who-we-help and /who-we-treat both 404. /women, /men and /first-responders all 200 at root. /treatment/executives-rehab-in-mission-viejo 200 under the treatment path. So the section genuinely spans two URL patterns with no hub. |
| V0058 | CONFIRMED_AMENDED | B10 | RE-MEASURED from scratch because the original figure came from the same script pass that produced the false V0046 reading. Result: 6 of 156 confirmed exactly - /, /about, /admissions, /blog, /contact, /tour. Zero fetch errors across all 156 pages. Each of the 6 re-fetched 3 more times and returned no canonical every time, so this is not transient. robots.txt "Allow: /", no X-Robots-Tag, production self-canonicalising to https://hillsidemission.com/. |
| V0059 | CONFIRMED_AMENDED | B10 | Absence from sitemap confirmed: 156 sitemap URLs, this one not among them. Page is HTTP 200, 1,232 words, H1 present, and IS linked from /blog. robots meta is absent, so it is NOT noindex - the omission is a genuine defect rather than intentional exclusion. |
| V0060 | CONFIRMED_AMENDED | B11 | Only the literal claim survives. /areas-we-serve returns 404 on both preview and production, so no hub page exists - TRUE. But the 12 geo pages each have 155 inbound internal links, and all 12 appear in the homepage HTML, because they sit in the site-wide nav dropdown on every page. All 12 return HTTP 200. |
| V0061 | CONFIRMED_AMENDED | B11 | Orphan status CONFIRMED and the JS-pagination caveat is now RESOLVED. /blog has no server-side pagination: no pagination links in the HTML, /blog/page/2 and /blog/2 both 404. So the earlier caveat does not apply. Of the 23 root-level article pages checked, 0 are linked from /blog and 0 have ANY inbound link anywhere on the site. They are genuinely orphaned. |
| V0062 | CONFIRMED | B11 | Both bios HTTP 200 with 0 inbound links from any of the 156 pages. No team hub exists under any tested slug: /team, /staff, /about/meet-the-team, /care-providers and /our-team all 404. /about was checked directly and links neither bio. Count of 2 is correct. |
| V0063 | CONFIRMED_AMENDED | B12 | Linking split CONFIRMED exactly: /luxury-rehab appears in the header and not the footer; /luxury-addiction-treatment appears in the footer and not the header. Both HTTP 200 with different titles ("Luxury Drug Treatment Center" vs "Luxury Addiction Treatment"). Both exist on production and both self-canonical to their own production URLs. |
| V0064 | CONFIRMED_AMENDED | B12 | All four pages HTTP 200. Footer membership verified: /drug-addiction-treatment and /alcohol-detox-and-treatment-programs are both in the footer. Both root pages exist on production (301 to trailing-slash forms). |
| V0065 | CONFIRMED_AMENDED | B12 | Both pages HTTP 200 with H1 "Karen Pettit". Facility 386 words, parent 252. Measured overlap 40.1 percent 8-gram, 55.5 percent word-level, so it does qualify as a near-duplicate, though it is the weakest of the five. Facility canonicals correctly to https://lagunaviewdetox.com/about/karen-pettit; the parent copy has NO canonical - the same asymmetry as V0050 and V0054. |
| V0066 | CONFIRMED | B13 | Isolated the <footer> element. All 7 population pages return HTTP 200. Five are in the footer (/women, /men, /professionals, /veterans, /first-responders); /who-we-treat/young-adults and /who-we-treat/college-students are absent. Exactly 5 of 7 as claimed. |
| V0067 | CONFIRMED_AMENDED | B13 | RE-MEASURED all 205 pages: exactly 1 missing a canonical, /blog. Zero fetch errors. Re-fetched /blog 3 more times, no canonical every time. Count is exact. |
| V0068 | BY_DESIGN | B13 | /privacy-policy returns HTTP 200 and IS absent from the 205-URL sitemap, so the literal claim is true. But its robots meta is "noindex, follow". A noindex page SHOULD be excluded from the sitemap - including it would be the error. So the omission is correct behaviour, not a defect. |
| V0069 | CONFIRMED | B14 | All 7 areas confirmed present as H3 headings on the homepage under "Addiction Recovery for Des Moines & Beyond": Des Moines, West Des Moines, Ankeny, Urbandale, Waukee, Polk County, Dallas County. Page existence: /areas-we-serve/west-des-moines and /areas-we-serve/ankeny return 200; /des-moines, /urbandale, /waukee, /polk-county and /dallas-county all 404. Sitemap contains only the hub plus those 2. The hub links only those 2. None of the 5 missing areas is linked anywhere on the homepage. Exactly 2 of 7 as claimed. |
| V0070 | CONFIRMED_AMENDED | B14 | Preview confirmed exactly as written: "LegitScript Certified" appears as text with zero LegitScript images and zero links to legitscript.com. Verified across ALL 34 preview pages - text mentions on every one, images 0, links 0 everywhere. |
| V0071 | CONFIRMED_AMENDED | B14 | Address confirmed as 5820 Winwood Dr, Johnston, IA 50131 and it is CONSISTENT everywhere: preview homepage, preview /contact, and production /contact. JSON-LD addressLocality = "Johnston", so structured data is correct. |
| V0072 | CONFIRMED_AMENDED | B15 | The geo-suffix pattern is real and dominant: 11 of 14 program and condition slugs end in "-des-moines". Production carries the same slugs (301 to trailing-slash forms), so they are established URLs. |
| V0073 | CONFIRMED_AMENDED | B15 | Both pages HTTP 200 and both linked from the homepage. Both exist on production. Measured overlap: 19.5 percent 8-gram, 49.7 percent word-level. |
| V0074 | CONFIRMED_AMENDED | B15 | Both pages HTTP 200, substantial at 1,066 and 1,082 words, both linked from the /what-we-treat hub, both on production. Titles and H1s differ: "Opiate Addiction Treatment in West Palm Beach, FL" vs "Opioid Addiction Treatment & Detox Program in Florida". Text overlap is low at 6.8 percent 8-gram / 28.4 percent word-level. |
| V0075 | CONFIRMED_AMENDED | B16 | Re-measured with nav/header/footer stripped and <main> preferred. Against a Seaside baseline of 44.0 percent (two different bios on the same site), 4 of 5 show reuse ABOVE baseline: timothy-foley 64.7, steve-ryan 58.0, shan-raiford 57.7, michael-meagher 54.8. Only erin-crawford at 36.4 is below baseline. All 5 facility pages canonical correctly; all 5 parent copies have NO canonical. |
| V0076 | CONFIRMED_AMENDED | B16 | Confirmed precisely. Two LegitScript seal images on the preview homepage, both served from /wp-content/uploads/2026/04/legitscript-seaside.png, and NEITHER is wrapped in a link. Zero links to legitscript.com anywhere on the page. Production behaves the same way - seal present, not linked. |
| V0077 | CONFIRMED_AMENDED | B16 | Count exact: 56 of 70 pages carry og:url pointing at the bare domain root while not being the homepage. 57 pages have og:url, 13 have none. |
| V0078 | NOT_CONFIRMED | B17 | Measured with the corrected content-only extraction. The two pages share 7.4 percent 8-gram and 23.8 percent word-level text, against a site chrome baseline of 6.0 percent (/tour vs /contact). So overlap is barely above template chrome. They are clearly differentiated: /about is titled "About Us" with H1 "Leading Drug & Alcohol Detox & Rehab Center in Los Angeles, CA" (302 words); /about/our-story is titled "Our Story" with H1 "A new facility built on experience and proven results" (345 words). Both are linked from the homepage and both exist on production. |
| V0079 | CONFIRMED_AMENDED | B17 | Both pages HTTP 200 and both on production. Content overlap is 0.2 percent 8-gram and 11.1 percent word-level against a 6.0 percent chrome baseline - so essentially no shared content. /treatment/detox is 1,431 words; /medical-detox-los-angeles is 582. /medical-detox-los-angeles is NOT linked from the homepage, while /treatment/detox is. |
| V0080 | CONFIRMED_AMENDED | B17 | Sitemap has 44 URLs; both cited pages are absent, so the literal claim is true for both. But they differ materially: /privacy-policy - robots "noindex, follow", 155 words. A noindex page SHOULD be excluded from the sitemap, so this is correct behaviour. /admissions/verify-your-insurance - robots "index, follow", 266 words, linked from the homepage. Indexable and wrongly omitted, so this one is a GENUINE defect. |
| V0081 | CONFIRMED | B18 | Count exact: 36 of 44 pages carry og:url pointing at the bare domain root while not being the homepage. All 44 pages have an og:url element, so there is NO absent-tag population here, and 7 pages carry a correct page-specific value. |
| V0082 | CONFIRMED | B18 | Re-measured all 51 pages: 51 of 51 missing a canonical, zero fetch errors. Re-fetched /, /about, /treatment and /faq three times each - no canonical every time, so not transient. robots meta is "index, follow" on all 51 pages, so the row wording is accurate here. No X-Robots-Tag. robots.txt "Allow: /". Production homepage self-canonicalises to https://wellnessrecoverynj.com/. |
| V0083 | CONFIRMED_AMENDED | B18 | Confirmed: sitemap has 51 URLs and this one is absent. Page is HTTP 200, robots "index, follow", linked from /blog, and production returns 404 for it. So it is indexable, wrongly omitted, and has no production twin. |
| V0084 | BY_DESIGN | B19 | Outpatient-only model CONFIRMED with strong evidence. Treatment pages are exactly /treatment, /dual-diagnosis, /intensive-outpatient-program, /mental-health-iop, /outpatient, /partial-hospitalization. Probed 7 plausible detox/residential slugs (/treatment/detox, /detoxification, /residential, /residential-inpatition, /detox, /medical-detox, /treatment/inpatient) - all 404. Homepage language: "outpatient" x9, PHP x5, IOP x8, "residential" x0. DECISIVE: the homepage says "From detox REFERRAL to partial hospitalization and intensive outpatient treatment", so the site explicitly refers detox out rather than providing it. Production shows the same pattern. |
| V0085 | CONFIRMED_AMENDED | B19 | Count exact: 31 of 51 pages carry og:url pointing at the bare domain root while not being the homepage. |
| V0086 | CONFIRMED_AMENDED | B19 | Reuse CONFIRMED with the corrected extraction: elizabeth-wald 72.2 percent and tami-distefano 79.8 percent word-level, against an Ocean Coast baseline of 35.3 percent. Both well above baseline, so this is real reuse. Both facility bios ARE linked from /about, so they are not orphaned. |
| V0087 | CONFIRMED_AMENDED | B20 | Confirmed: sitemap has 107 URLs and this one is absent. Page HTTP 200, no robots meta so indexable by default, linked from /blog, and production returns 404 for it. |
| V0088 | CONFIRMED_AMENDED | B20 | Count exact: 37 of 107 pages carry og:url pointing at the bare domain root while not being the homepage. Only 38 of 107 have og:url at all, 69 have none, and 0 are page-specific. |
| V0089 | CONFIRMED_AMENDED | B20 | Confirmed on both hosts: /treatment/opiate-addiction returns 200 on preview and 301 on production; /treatment/opioid-addiction returns 404 on BOTH. So my earlier correction was right - the parent has only the opiate page and there is no duplicate. Title and H1 both use "opiate"; body uses "opiate" 46 times and "opioid" 10 times. The page is linked from the /treatment hub. |
| V0090 | CONFIRMED | B21 | Exactly 9 location pages exist, matching the row. Probed 6 plausible slugs for the two missing facilities (/locations/des-moines-wellness-center, /des-moines, /des-moines-recovery, /greater-texas-behavioral, /greater-texas, /greater-texas-behavioral-health) - all 404. The /locations page itself links exactly those 9 and no more. |
| V0091 | CONFIRMED | B21 | Confirmed exactly. The /locations page links only 3 external domains - facebook.com, instagram.com and linkedin.com. Zero facility production domains. Extended the check beyond the row: the 9 individual /locations/<facility> pages ALSO contain no outbound links to their facility domains, tested on 5 of 9. Production /locations behaves the same way - no facility domains linked. |
| V0092 | CONFIRMED | B21 | Re-measured all 92 pages: 92 of 92 missing a canonical, zero fetch errors. Re-fetched /, /about, /locations and /treatment three times each - no canonical every time, so not transient. robots meta is "index, follow" on all 92, so the row wording is accurate here. No X-Robots-Tag. robots.txt "Allow: /". Production homepage self-canonicalises to https://quadranthealthgroup.com/. |
| V0093 | CONFIRMED_AMENDED | B22 | Count exact: 53 of 92 pages carry og:url pointing at the bare domain root while not being the homepage. |
| V0094 | CONFIRMED | B22 | Tested all 4 candidate slugs on all 12 sites. Counts are exactly as claimed: /treatment on 8 sites (Hillside, Laguna, Ocean Coast, Seaside, Wellness LA, Wellness NJ, QHG parent, Fort Worth), /treatment-services on Dallas only, /programs on Des Moines only, /what-we-offer on Marina Harbor only. |
| V0095 | CONFIRMED_AMENDED | B22 | Enumerated aftercare pages across all 12 sites and verified each returns HTTP 200. Measured 6 distinct URL patterns: /treatment/aftercare (4 sites - Laguna, Ocean Coast, Seaside, Wellness LA), /treatment/aftercare-planning (Fort Worth), /treatment/aftercare-beyond (Hillside), /treatment-services/aftercare-planning (Dallas), /programs/aftercare-and-alumni (Des Moines), /aftercare (Marina Harbor). The 5 outliers listed in the Fix are correct. |
| V0096 | CONFIRMED_AMENDED | B23 | Tested 7 candidate slugs on all 12 sites. 4 distinct variants confirmed, matching the row: /verify-insurance (Dallas, Des Moines, Greater Texas), /insurance (Laguna, Ocean Coast), /admissions/insurance-verification (Seaside), /admissions/verify-your-insurance (Wellness LA). |
| V0097 | CONFIRMED_AMENDED | B23 | Tested all 5 candidate slugs on all 12 sites. 5 distinct variants confirmed. Every site has some About page - none is missing entirely. |
| V0098 | CONFIRMED | B23 | Tested all candidate slugs on all 12 sites. Every figure in the row is exact: /contact live on 8 sites (Des Moines, Hillside, Laguna, Ocean Coast, Seaside, Wellness LA, Wellness NJ, QHG parent), /contact-us on Dallas and Fort Worth, /contact-location on Marina Harbor, and absent entirely on Greater Texas. 3 distinct variants, 12 sites fully accounted for. |
| V0099 | CONFIRMED_AMENDED | B24 | Tested 7 candidate FAQ slugs on all 12 sites. The "absent on 7 sites" figure is CORRECT: Des Moines, Hillside, Laguna, Ocean Coast, QHG parent, Fort Worth and Greater Texas have no FAQ page under any tested slug. |
| V0100 | CONFIRMED_AMENDED | B24 | Checked /privacy-policy and /privacy plus sitemap presence and robots on all 12 sites. Full picture: 8 sites have /privacy-policy live AND in the sitemap (Dallas, Des Moines, Hillside, Marina Harbor, Seaside, Wellness NJ, QHG parent, Fort Worth) 2 sites have it live but NOT in the sitemap, both "noindex, follow" (Laguna, Wellness Detox LA) 1 site uses /privacy instead, and it IS in that sitemap (Ocean Coast) 1 site has NO privacy page at all under either slug (Greater Texas) So the row figure of 3 sites without one in the sitemap is technically right - Laguna, Wellness LA, Greater Texas. |
| V0101 | CONFIRMED_AMENDED | B24 | Classified every post URL on all 12 sites. All four patterns confirmed with the stated site groupings: /blog/slug on 6 sites (Laguna, Ocean Coast, Wellness NJ, QHG parent, Fort Worth, Greater Texas); root-level /slug on 4 (Des Moines, Hillside, Seaside, Wellness LA); dated /YYYY/MM/DD/slug on 2 (Dallas 50 posts, Marina Harbor 69); and Seaside is the only site whose blog INDEX sits at /about/blog rather than /blog. |
| V0102 | CONFIRMED_AMENDED | B25 | Tested a known page on all 12 sites in both slash forms, preview and production. PREVIEWS: all 12 serve the slashless form at HTTP 200 and 308-redirect the slash form. So every preview enforces NO trailing slash. PRODUCTION: all 12 return 301 on the slashless form. 10 of 12 serve the slash form at 200. The 2 exceptions (Laguna, Ocean Coast) 301 both forms because their /about redirects onward to /about-us/ - so they are still slash-canonical, just via a second hop. Net: 12 of 12 previews are slashless, 12 of 12 production sites are slash-canonical. |
| V0103 | CONFIRMED | B25 | Tested /contact on all 12 production domains. Exactly 2 redirect to a JPEG attachment, as claimed: dallasdetoxcenter.com/contact and fortworthwellness.org/contact both 301 to /wp-content/uploads/2022/01/contact.jpg. The other 10 behave correctly - 9 redirect to a real contact page and Greater Texas 404s (consistent with V0044, which established it has no contact page). |

</details>

---

<a id="marina-harbor-repo-audit"></a>
## 7. Marina Harbor repo audit

Findings from the head-to-toe audit of this repository (2026-07-09, re-verified 2026-08-04). Separate from the workbook — these are source-level, not crawl-level. Build is healthy: 124 static routes, 0 type/lint errors, 105 kB shared JS, 0 broken internal links, exactly one `<h1>` per page, 0 missing `alt`.

### Fixed 2026-08-04

- **Single canonical phone number.** `site.phones` collapsed to `primary` only; 138 body-copy occurrences normalised to `1-866-525-3026` across 32 content files (10 were genuinely wrong numbers, 128 were format variants). Verified: 1,663 phone strings and 1,407 `tel:` links sitewide, all canonical.
- Added `foundingDate: 2021` to the JSON-LD, a Google review CTA, and normalised the street address.

> ⚠️ **This conflicts with workbook rows V0048 and V0049, both `BLOCKED`.** They cover the two numbers removed (866-932-3206 and 415-868-3858) and say to confirm with admissions first — V0049 argues 415-868-3858 is a legitimate SF line wired to the WordPress Call Now Button plugin. Nothing is committed; one `git checkout` reverts it.

### P0 — legal, safety, trust (open)

| # | Issue | Location |
|---|---|---|
| 1 | Privacy policy is Yelp's ToS find-replaced (blocks 1–25). No cookie disclosure at all despite the consent banner and GA4/Ads/Meta Pixel; no CCPA/CPRA, no Do Not Sell. Blocks 26+ are a genuine HIPAA NPP. | `content/pages/privacy-policy.json` |
| 2 | Competitor named in the wrong city as an H2: "Laguna View Detox … Laguna Beach" | `content/pages/first-responders.json:105` |
| 3 | Location claims: "located in Santa Cruz"; ~7 pages say "in Marin County"; dual-diagnosis meta advertises "Orange County"; Santa Barbara (~330 mi) marketed as local | multiple |
| 4 | YMYL medical errors: opioid withdrawal has "no immediate health concerns"; benzo bullet list is a stimulant list omitting seizures; alcohol called "like other benzos"; seizures/hallucinations listed as opioid withdrawal; "NAD is an enzyme" | 5 files |
| 5 | GA4 + Meta Pixel send `page_location` for substance-specific URLs (healthcare-wiretap pattern); lead API logs full PII and has no rate limiting | `src/components/Analytics.tsx`, `src/app/api/lead/route.ts:104` |
| 6 | Unverified accreditation claims — "Joint Commission Accredited" and LegitScript/NAMI logos, all unlinked | `src/app/page.tsx:94` |

### P1 — correctness, performance, accessibility (open)

| # | Issue | Location |
|---|---|---|
| 1 | Four source JPEGs are 25–27 MB each (up to 8688×5792), ~109 MB of 156 MB, used as hero+og on `/men`, `/professionals`, `/young-adults` and two posts | `public/media/2023/08/` |
| 2 | FAQ page has 30 answers and no questions, plus raw staff notes shipping as public copy | `content/pages/faq.json` |
| 3 | Brand/city misspellings across 20 files ("Mariana Harbor" ×17, "San Franciso" ×4, …) | content |
| 4 | Canonical emits a trailing slash while the sitemap does not | `src/app/[...slug]/page.tsx:23` |
| 5 | No skip link; closed mobile drawer is focusable (~45 invisible tab stops below `xl`); no focus trap/Escape; LeadForm has no `aria-invalid` or live regions; 23 pages skip a heading level | `Header.tsx:148`, `LeadForm.tsx` |
| 6 | No TCPA/SMS consent line on either form intent | `src/components/LeadForm.tsx` |
| 7 | Trustindex loader and the Google Maps iframe both bypass the cookie consent choice | `Reviews.tsx`, `ContentPage.tsx` |
| 8 | Analytics fires only on hard load — no `usePathname`, so App Router client navigations are never counted | `src/components/Analytics.tsx` |

### P2 — polish (open)

- `leadImage()` returns the company logo as hero + og:image on 13 pages
- 17 meta descriptions exceed 160 chars (worst 408, 362, 257)
- `wpengine` renders as a visible byline bullet on 7 pages; "Medically Reviewed By: R.Hanaumi, LCSW" as a stray bullet
- Only `MedicalBusiness` JSON-LD — no BreadcrumbList/BlogPosting/FAQPage
- Post byline hardcodes "Marina Harbor Detox Clinical Team" while `site.ts` credits "Kris Brace, CADC II"
- `not-found.tsx` drops Header and Footer
- No CSP or security headers in `next.config.mjs`
- Homepage `blogPosts` hardcoded in `site.ts`, will drift from `/blog`
- Footer copyright year is evaluated at build time and freezes until redeploy

### Open questions from the business record

- Est. 2021 vs. the homepage stat tile "15+ Years of clinical expertise"
- Record lists SUD only (MH blank), but the site markets dual diagnosis and mental health treatment

