# MH-18 — missing pages: verification findings

**Prepared:** 2026-08-05 · **Status:** investigation complete, decision still owned by a human.

TASKS.md MH-18 step 2 says: *"Note earlier migration work deliberately removed three junk
2021-08-26 duplicates — confirm these aren't the same ones before porting."*

**They are the same ones.** Confirmed below. That changes the recommended action from "port" to
"redirect", because there is nothing to port.

---

## 1 · The three 2021-08-26 URLs (V0123)

`archive/raw-html/` contains exactly three `2021__08__26__*` files, and they are precisely the three
URLs the workbook lists as missing:

| V0123 URL | In archive | In `content/posts` |
|---|---|---|
| `/2021/08/26/depression-anxiety-and-substance/` | ✅ `2021__08__26__depression-anxiety-and-substance.html` | ❌ |
| `/2021/08/26/marina-harbor-detox/` | ✅ `2021__08__26__marina-harbor-detox.html` | ❌ |
| `/2021/08/26/the-importance-of-in-person-addiction/` | ✅ `2021__08__26__the-importance-of-in-person-addiction.html` | ❌ |

## 2 · They are empty stubs, not lost content

Each archived page was parsed directly:

| Page | `<h1>` | `.entry-content` | Substantive body copy |
|---|---|---|---|
| depression-anxiety-and-substance | "Depression, Anxiety, and Substance" | **absent** | none |
| marina-harbor-detox | "Marina Harbor Detox" | **absent** | none |
| the-importance-of-in-person-addiction | "The Importance of In-Person Addiction" | **absent** | none |

Every one has a title and heading but **no post body element at all**. The only prose the parser
recovers is the site-wide boilerplate that renders in the sidebar/footer of every page on the old
site ("Marina Harbor Detox Is A Private, Luxury, Professional Drug Detox And Alcohol Detox Facility
Located On Marina Boulevard In San Francisco…").

Two of the three titles are also visibly **truncated mid-phrase** — "…and Substance", "…In-Person
Addiction" — the signature of an abandoned draft rather than a published article.

**Conclusion:** these are empty WordPress stubs. Dropping them from the build was correct. Porting
them would publish three thin, duplicate-boilerplate pages onto a YMYL healthcare site.

## 3 · Recommended action (decision is yours)

Do **not** port. Redirect each to the nearest live page so no inbound link or indexed URL dead-ends:

| From | Suggested 301 target | Why |
|---|---|---|
| `/2021/08/26/depression-anxiety-and-substance/` | `/what-we-offer/dual-diagnosis` | closest topical match — **see D-6**, licensure scope for that page is unconfirmed |
| `/2021/08/26/marina-harbor-detox/` | `/` | the title is the brand name |
| `/2021/08/26/the-importance-of-in-person-addiction/` | `/what-we-offer/inpatient-rehab-san-francisco` | in-person / residential care |

**Not implemented here.** Redirects belong to MH-36, which is blocked by MH-35 (the trailing-slash
convention). Adding them before that decision risks writing the whole map in the wrong URL form.

## 4 · The codeine post is a separate problem

`/2026/07/17/codeine-cough-syrup/` is **not** in `archive/raw-html/` — consistent with V0124: it was
published after the ~15–16 July 2026 snapshot. It is real, current content and should not be lost,
but recovering it needs a fresh fetch from production, which is exactly the re-sync step **D-8** has
to settle. Blocked, not forgotten.
