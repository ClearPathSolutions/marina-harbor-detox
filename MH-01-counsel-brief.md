# MH-01 — Privacy policy replacement: brief for counsel

**For:** outside counsel (privacy / healthcare marketing)
**From:** engineering — Marina Harbor Detox website rebuild
**Prepared:** 2026-08-04
**Status:** awaiting counsel-drafted text. **Engineering has not drafted any policy language** and
will not — this brief is an inventory of what the site does and what the current document gets
wrong, so you can draft against facts.

---

## 1 · What we need back

1. A **website privacy policy** (there is effectively none today).
2. A **cookie / tracking-technologies disclosure**.
3. **CCPA/CPRA** consumer-rights language, including a **"Do Not Sell or Share My Personal
   Information"** mechanism — engineering will add the footer link once the wording exists.
4. **TCPA / SMS consent wording** for the lead forms (tracked separately as **MH-26**; the phone
   field is required and every CTA is a `tel:`/`sms:` link, with no consent language anywhere today).
5. A ruling on whether the retained **HIPAA Notice of Privacy Practices** (see §3) is acceptable
   as-is.

---

## 2 · The headline problem

`content/pages/privacy-policy.json` — 151 content blocks, published at `/privacy-policy`.

**Numbered sections 1–25 (blocks `[0]`–`[65]`) are Yelp's Terms of Service with the brand name
find-replaced.** Still present verbatim in production:

| Marker | Occurrences |
|---|---|
| "compliments or friend requests" | 1 |
| "Marina Harbor Detox Deals & Gift Certificates" | 1 |
| `"Your Content"` — grants the company rights to use and commercialize user submissions | 23 |

**Section 26 onward (blocks `[66]`–`[150]`) is a genuine HHS-model HIPAA Notice of Privacy
Practices** and appears legitimate. TASKS.md's instruction is to keep it, subject to your review.

**What is missing entirely:**

| Required topic | Occurrences in the current document |
|---|---|
| "cookie" | **0** |
| "CCPA" | **0** |
| "CPRA" | **0** |
| "Do Not Sell" | **0** |

Zero cookie disclosure despite a live cookie-consent banner and the tracking stack in §4.

**Known typo in the section we intend to retain:** block `[94]` reads *"U.S. Department of Health
and Human Services **Offi e** for Civil Rights"* — a dropped character. Engineering will fix this
on your confirmation that the surrounding section stands.

---

## 3 · Direct contradiction to resolve

The lead form tells users their data is **not shared**, in two places
(`src/components/LeadForm.tsx`):

> "Your information is kept strictly confidential and is **never shared with third parties**."

> "Your information is kept strictly confidential and is **never sold or shared**."

As of the current production deployment this is **not accurate** — see §4.3. Either the sentence
changes or the data flow does. We need your direction on which.

---

## 4 · What the site actually collects and transmits

### 4.1 Lead intake — `src/app/api/lead/route.ts`

Two form intents, `verify` (insurance verification) and `contact`. Fields accepted:

| Field | Notes |
|---|---|
| `firstName` / `lastName` / `name` | required |
| `phone` | **required**, validated to ≥10 digits |
| `email` | required on verify |
| `dob` (date of birth) | **required on the verify form in the deployed build** — see §4.3 |
| `insurance` | carrier name, required on verify |
| `message` | free text, up to 4,000 chars, prompted with "Who is seeking treatment, timing, questions…" |
| `company` | honeypot, never shown to users |

Delivery is environment-gated and **currently unconfigured**: optionally `LEAD_WEBHOOK_URL` (POSTs
the lead JSON to an external endpoint) and/or Resend email (`RESEND_API_KEY`, `LEAD_TO_EMAIL`,
`LEAD_FROM_EMAIL`). With neither set — the current default — the handler writes **the full lead,
including name, phone, email and free-text message, to the server log** (`route.ts:104`). There is
no rate limiting. Both defects are tracked as **MH-06** and will be fixed independently of this
brief; flagging them because they bear on what the policy can truthfully promise.

Combination worth your attention: **name + date of birth + insurance carrier + a free-text
description of who needs addiction treatment** is individually identifiable health information.

### 4.2 Analytics — `src/components/Analytics.tsx`

All environment-gated and **currently switched off** (no IDs set on the deployment; `gtag`, `fbq`
and `dataLayer` were all confirmed undefined in the live browser). Wired and ready to enable:

- GA4 (`NEXT_PUBLIC_GA_ID`)
- Google Ads conversions (`NEXT_PUBLIC_GOOGLE_ADS_ID`)
- Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
- Google Tag Manager (`NEXT_PUBLIC_GTM_ID`)

Google Consent Mode v2 defaults to **denied** for `ad_storage`, `ad_user_data`,
`ad_personalization` and `analytics_storage`; the banner flips them to granted on Accept.

Separately tracked as **MH-05**: when enabled, these tags would transmit `page_location` for
substance-specific URLs (`/what-we-offer/heroin-detox`, `/fentanyl-detox`, …). We intend to suppress
or redact clinical routes. Please confirm that approach is sufficient, and whether blanket cookie
consent can ever substitute for HIPAA authorization here.

### 4.3 Third-party scripts live in production — **please read**

⚠️ These are on the deployed build (`origin/main`) and are **not** in the working tree this brief
was otherwise written from. They materially change the data map:

| Script | What it does |
|---|---|
| `clarionlabs.ai/forms-capture.v1.js` | Serializes the submitted lead form and POSTs it to `api.clarionlabs.ai`, together with `gclid`/UTM/page attribution. This is the flow that contradicts §3. |
| `clarionlabs.ai/widget.v1.js` | Live chat widget. Visitors can type anything into it, including health details. |
| `264810.tctm.co/t.js` | CallTrackingMetrics — visitor tracking / call attribution, loaded site-wide. |

All three are plain `<script>` tags in the root layout and therefore **load regardless of the cookie
banner choice**. The Trustindex reviews widget and the contact page's Google Maps embed have the
same problem (tracked as **MH-27**).

Two questions for counsel:
1. Do we need a **BAA or DPA** with Clarion Labs and CallTrackingMetrics before launch?
2. Should any of these be blocked until consent, and does that change if the visitor is on a
   substance-specific URL?

### 4.4 Cookie banner — `src/components/CookieConsent.tsx`

Stores the choice in `localStorage` under `mhd-consent`. Current copy, in full:

> "We use cookies to analyze traffic and improve your experience. Your privacy matters — read our
> [Privacy Policy]." — buttons: **Accept** / **Decline**

Please advise whether this copy is adequate and whether Decline must also block the §4.3 scripts.

---

## 5 · Files attached / to send with this brief

| File | Why |
|---|---|
| `content/pages/privacy-policy.json` | the document being replaced |
| `src/components/LeadForm.tsx` | the "never shared" promise + the fields collected |
| `src/app/api/lead/route.ts` | what is collected, validated, stored, and transmitted |
| `src/components/Analytics.tsx` | which tags fire and the consent defaults |
| `src/components/CookieConsent.tsx` | banner copy and storage |
| `src/components/Clarion.tsx` (on `origin/main`) | the third-party form capture and chat widget |

---

## 6 · Acceptance (from TASKS.md)

```bash
grep -ci "cookie" content/pages/privacy-policy.json                    # must be > 0
grep -ci "friend requests\|fake review\|Gift Certificate" content/pages/privacy-policy.json   # must be 0
grep -ci "CCPA\|CPRA\|Do Not Sell" content/pages/privacy-policy.json   # must be > 0
```

Plus: legal sign-off recorded, and a "Do Not Sell or Share My Personal Information" link added to
the footer.
