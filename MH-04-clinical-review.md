# MH-04 — Clinical accuracy review packet

**For:** a licensed clinician (per TASKS.md, sign-off owner is a clinician, not engineering)
**From:** engineering — flagged during the site audit
**Prepared:** 2026-08-04
**Status:** awaiting review. **No corrected wording has been written.** Engineering will apply
whatever you return, verbatim.

---

## How to use this

Five passages on the Marina Harbor Detox site were flagged as clinically inaccurate. Each is quoted
**verbatim as it currently publishes**, with its file and block index so the fix can be applied
precisely.

For each item, please either:

- **Supply replacement wording**, or
- **Confirm the current text is acceptable** (and why), or
- **Mark it for deletion**.

Please also answer the **reviewer byline** question at the bottom — MH-13 will publish a
"Medically Reviewed By" line on these pages once a name is confirmed.

> Engineering has deliberately **not** drafted candidate corrections. These are YMYL (your money or
> your life) medical claims on a detox facility's website; proposing text would risk anchoring the
> review on a non-clinician's guess.

---

## 1 · Opioid/heroin withdrawal described as having no immediate health concerns

**File:** `content/pages/what-we-offer_heroin-detox.json` — block `[33]`, `<p>`
**Page:** `/what-we-offer/heroin-detox`

> Heroin withdrawal symptoms can begin within a few hours of discontinued use. Heroin withdrawal is
> known to be uncomfortable and even painful at times. **Unlike other substances, there is no
> immediate health concerns that can arise during this process.** However, individuals may experience
> dehydration depending on the severity of the symptoms they experience. Additionally, individuals
> with other health concerns may be at risk during heroin withdrawal.

**Why flagged:** states there are no immediate health concerns during opioid withdrawal. Also
contains a grammatical error ("there is no immediate health concerns").

**Risk if wrong:** this page targets people deciding whether they need medically supervised detox.

---

## 2 · Benzodiazepine withdrawal — duplicated symptom, and a symptom list that may not match

**File:** `content/pages/what-we-offer_drug-detox.json` — blocks `[26]`–`[33]`
**Page:** `/what-we-offer/drug-detox`

Intro paragraph, block `[26]`:

> Benzodiazepine withdrawal symptoms can be dangerous and life-threatening, and severe symptoms such
> as **seizures, hallucinations, and hallucinations** can occur in heavy or long-term users. Other
> benzodiazepine withdrawal symptoms can include:

The list that follows (blocks `[27]`–`[33]`):

| Block | Text |
|---|---|
| `[27]` | Agitation |
| `[28]` | **Increased appetite** |
| `[29]` | Nausea, stomach cramping, or vomiting |
| `[30]` | **Unpleasant or lucid dreams** |
| `[31]` | Suicidal thoughts |
| `[32]` | Body aches and pains |
| `[33]` | Insomnia or increased fatigue |

**Why flagged:** two issues.
1. `"hallucinations, and hallucinations"` — a word is duplicated; one slot was presumably meant to
   carry a different symptom. Please confirm what belongs there.
2. The audit's reading is that this bulleted list resembles a **stimulant**-withdrawal profile
   (notably *increased appetite* and *vivid/lucid dreams*) rather than a benzodiazepine one. Please
   confirm whether this list is correct for benzodiazepines as written, and supply the correct list
   if not.

---

## 3 · Alcohol described as a benzodiazepine

**File:** `content/posts/2023_09_22_benadryl-and-alcohol.json` — block `[29]`, `<p>`
**Page:** `/2023/09/22/benadryl-and-alcohol`

> There are serious risks involved in mixing Benadryl and alcohol. **Alcohol (like other benzos)**
> increases the sedative impact that diphenhydramine can have.

**Why flagged:** the parenthetical classifies alcohol as a benzodiazepine.

---

## 4 · Seizures and hallucinations listed as phase-2 opioid withdrawal symptoms

**File:** `content/posts/2022_04_15_opioid-detox-timeline.json` — blocks `[23]`–`[30]`
**Page:** `/2022/04/15/opioid-detox-timeline`

Section heading, block `[21]`: **"Phase 2: Detox from Opioids"** — described as starting 36–48 hours
after the last dose. The symptom list beneath it:

| Block | Text |
|---|---|
| `[23]` | Vomiting |
| `[24]` | Nausea |
| `[25]` | **Hallucinations** |
| `[26]` | Goosebumps |
| `[27]` | Intense cravings |
| `[28]` | Diarrhea |
| `[29]` | Cramps |
| `[30]` | **Seizures** |

**Why flagged:** the audit reads *hallucinations* and *seizures* as hallmarks of alcohol and
benzodiazepine withdrawal rather than opioid withdrawal. Please confirm whether either belongs in an
opioid phase-2 list, and supply the correct list if not.

---

## 5 · NAD described as an enzyme

**File:** `content/posts/2021_11_19_nad-therapy-explained.json` — block `[3]`, `<p>`
**Page:** `/2021/11/19/nad-therapy-explained`

> NAD therapy is formally known as Nicotinamide Adenine Dinucleotide Therapy. **NAD is an enzyme**
> that occurs naturally in your body. It is part of the niacin family, and niacin helps give you
> energy. Niacin is what converts your food into cellular energy.

**Why flagged:** NAD is a coenzyme, not an enzyme. Please confirm and supply the correct phrasing —
note the following two sentences about niacin may also need to change to stay consistent.

---

## Reviewer byline — needed for MH-13

Exactly **one** of the site's 118 pages currently names a reviewing clinician, and it renders as a
stray bullet rather than a byline:

- `content/pages/what-we-offer_drug-rehab-marin-county.json` → `<li>` "Medically Reviewed By:
  R.Hanaumi, LCSW"

Understood to be **Erika "Riky" Hanaumi, LCSW**, Clinical Director for the California facilities.

**Please confirm:**
1. Is Hanaumi the correct reviewer of record for these clinical pages?
2. Should a "Medically Reviewed By" byline be published on each page corrected above?
3. What name, credentials, and review date should each carry?

---

## Not in scope for this review

Two related questions are **business decisions**, not clinical corrections, and are tracked
separately as blocked items:

- **D-6** — the business record lists the facility as **SUD only** (mental-health column blank), yet
  the site markets `/what-we-offer/dual-diagnosis` and a mental-health treatment post. Licensure
  scope needs confirming before those pages take traffic.
- **D-4** — accreditation claims (Joint Commission, LegitScript, NAMI) are unverified.
