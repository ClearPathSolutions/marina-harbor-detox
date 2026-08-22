/**
 * First-touch campaign attribution + CallTrackingMetrics identity.
 *
 * THE BUG THIS FIXES
 * ------------------
 * Clarion's forms-capture.v1.js builds its own submission envelope — and I read
 * the published script to confirm exactly what it does:
 *
 *   utm:              new URLSearchParams(location.search)   ← read at SUBMIT time
 *   gclid:            location.search                        ← read at SUBMIT time
 *   wbraid / gbraid:  never collected at all
 *   ctm_visitor_sid:  __ctm.config.sid, cached                 (already correct)
 *   landing_page_url: first touch, sessionStorage               (already correct)
 *   referrer:         first touch, sessionStorage               (already correct)
 *
 * So the campaign — and only the campaign — is read live from the address bar.
 * Land on an ad, read two pages, submit: the landing page is right, the campaign
 * is gone, and the lead files as direct traffic. It fails silently, because the
 * CRM record still looks populated. It shows up only as paid spend that appears
 * to convert at zero.
 *
 * WHY WE DO NOT JUST LEAVE THE PARAMS IN THE URL
 * ----------------------------------------------
 * The fleet-standard fix restores the campaign into location.search on every
 * pageview and leaves it there. That is wrong for this site. Our paths name a
 * substance or a condition (see lib/clinicalRoutes.ts, MH-05) and CTM's t.js,
 * the Clarion widget and Elfsight all read location.href directly on every
 * internal pageview. Pinning campaign parameters to those URLs makes a
 * shareable, loggable address that pairs an ad click with a diagnosis.
 *
 * We cannot send the fields explicitly instead: utm/gclid are TOP-LEVEL keys of
 * the vendor's envelope, built inside its closure. Anything we pass through
 * ClarionForms.submit({data}) lands nested under `data`, which their parser does
 * not read — that is the same nesting mistake that broke ctm_visitor_sid on the
 * reference site.
 *
 * So we restore the campaign for exactly the synchronous instant the vendor
 * spends serialising its payload, then put the URL back. See
 * withRestoredCampaign() for why that is safe and airtight.
 */

declare global {
  interface Window {
    __ctm?: { config?: { sid?: string | null } };
  }
}

/** Shape-compatible with the fleet snippet: { p: params, at: epoch_ms }. */
export const CAMPAIGN_KEY = "campaign.first_touch.v1";

/** localStorage, not sessionStorage: a second tab is the same visit. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Everything worth carrying. wbraid/gbraid are gclid's iOS / consent-mode substitutes. */
export const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

type Params = Record<string, string>;

/** `landing`/`referrer` are our additions; the fleet snippet ignores them. */
type FirstTouch = { p: Params; at: number; landing?: string; referrer?: string };

const MAX_VALUE = 512;

function browser(): boolean {
  return typeof window !== "undefined";
}

function liveParams(): Params {
  const found: Params = {};
  try {
    const q = new URLSearchParams(window.location.search);
    for (const k of CAMPAIGN_PARAMS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, MAX_VALUE);
    }
  } catch {
    /* malformed query string — nothing to capture */
  }
  return found;
}

function externalReferrer(): string {
  try {
    const r = document.referrer || "";
    return r && r.indexOf(window.location.origin) !== 0 ? r : "";
  } catch {
    return "";
  }
}

export function readFirstTouch(): FirstTouch | null {
  if (!browser()) return null;
  try {
    const v = JSON.parse(window.localStorage.getItem(CAMPAIGN_KEY) || "null") as FirstTouch | null;
    if (!v || typeof v !== "object" || typeof v.at !== "number") return null;
    if (Date.now() - v.at >= TTL_MS) return null;
    return { ...v, p: v.p && typeof v.p === "object" ? v.p : {} };
  } catch {
    return null;
  }
}

function write(record: FirstTouch): void {
  try {
    window.localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(record));
  } catch {
    /* private mode / storage disabled — attribution degrades, the lead does not */
  }
}

/**
 * Record the campaign on every pageview. Called by components/CampaignCapture.tsx
 * on mount and on each route change.
 */
export function captureFirstTouch(): void {
  if (!browser()) return;
  const found = liveParams();

  // A fresh click always wins — that is a new campaign, not a continuation of
  // the old one. Overwrite wholesale, including `at`, so the TTL restarts.
  if (Object.keys(found).length) {
    write({ p: found, at: Date.now(), landing: window.location.href, referrer: externalReferrer() });
    return;
  }

  // No campaign here. Keep any existing record untouched so the 30-day window
  // runs from the real first touch; only seed one if this visit has none.
  if (readFirstTouch()) return;
  write({ p: {}, at: Date.now(), landing: window.location.href, referrer: externalReferrer() });
}

/** CTM's id is 24 hex with no dashes. A UUID from our own store is NOT it. */
const CTM_ID = /^[0-9a-f]{24}$/i;

/**
 * The CallTrackingMetrics visitor session id, the value that lets CTM attach a
 * form submission to the visit that produced it.
 *
 * We read __ctm.config.sid first and the __ctmid cookie second. We deliberately
 * do NOT keep our own copy: __ctmid is a first-party cookie with a 30-day life
 * and t.js reconciles config.sid against it on load, so any cache of ours could
 * only ever be staler.
 *
 * Returning null is correct when CTM is unavailable. Substituting some other
 * session id would file the lead against a visit that does not exist.
 */
export function ctmSessionId(): string | null {
  if (!browser()) return null;

  let sid: string | null = null;
  let vid: string | null = null;
  try {
    const raw = window.__ctm?.config?.sid;
    sid = raw == null ? null : String(raw);
  } catch {
    /* t.js absent or blocked */
  }
  try {
    const m = document.cookie.match(/(?:^|;\s*)__ctmid=([^;]*)/);
    vid = m ? decodeURIComponent(m[1]) : null;
  } catch {
    /* cookies unreadable */
  }

  if (CTM_ID.test(sid || "")) return sid;
  if (CTM_ID.test(vid || "")) return vid;
  // Never fall back to the app's own session id.
  return sid || vid || null;
}

/** Stored campaign, with anything already in the live URL taking precedence. */
function mergedParams(): Params {
  return { ...(readFirstTouch()?.p ?? {}), ...liveParams() };
}

/** The params the current URL is missing, or null if it already has them all. */
function missingParams(): Params | null {
  const stored = readFirstTouch();
  if (!stored) return null;

  let live: URLSearchParams;
  try {
    live = new URLSearchParams(window.location.search);
  } catch {
    return null;
  }

  const add: Params = {};
  for (const [k, v] of Object.entries(stored.p)) if (!live.get(k)) add[k] = v;

  // forms-capture only ever reads `gclid`. Give an iOS / consent-mode click,
  // which arrives as wbraid or gbraid, a value there too — otherwise Clarion
  // sees nothing for a click CTM itself attributes fine.
  if (!live.get("gclid") && !add.gclid) {
    const alt = stored.p.wbraid || stored.p.gbraid;
    if (alt) add.gclid = alt;
  }

  return Object.keys(add).length ? add : null;
}

/**
 * Next's App Router replaces window.history.replaceState with its own wrapper
 * so it can keep the router in sync. We want a URL change that the router,
 * popstate listeners and every third-party script on the page never observe, so
 * we call the untouched prototype method instead of the patched instance one.
 */
function setUrl(href: string): void {
  try {
    History.prototype.replaceState.call(window.history, window.history.state, "", href);
  } catch {
    /* URL unchanged — the submission still goes, just without the campaign */
  }
}

/**
 * Run `submit` with the first-touch campaign present in location.search, then
 * put the URL back exactly as it was.
 *
 * Why this is safe rather than clever: forms-capture builds its entire payload
 * synchronously — it reads location.search, calls JSON.stringify, and only then
 * hands the string to fetch. JavaScript is single-threaded, so nothing else on
 * the page can run, observe or paint during that window. We revert the moment
 * `submit` returns its promise, not when the promise resolves, because the read
 * has already happened by then.
 *
 * If anything here throws, `finally` still restores the URL and the submission
 * still goes out — attribution is never worth losing an admissions enquiry for.
 */
export function withRestoredCampaign<T>(submit: () => T): T {
  if (!browser()) return submit();

  const add = missingParams();
  if (!add) return submit();

  let original: string;
  let restored = false;
  try {
    original = window.location.href;
    const url = new URL(original);
    for (const [k, v] of Object.entries(add)) url.searchParams.set(k, v);
    setUrl(url.toString());
    restored = true;
  } catch {
    return submit();
  }

  try {
    return submit();
  } finally {
    if (restored) setUrl(original);
  }
}

/**
 * Flat attribution block for our own /api/lead endpoint, which — unlike the
 * Clarion envelope — we control, so the fields go in explicitly.
 *
 * ctm_visitor_sid is TOP-LEVEL and flat. Nesting it is the whole reason the
 * reference site's leads attached to no visit.
 */
export function attributionPayload(): Record<string, unknown> {
  if (!browser()) return {};

  const stored = readFirstTouch();
  const p = mergedParams();

  const utm: Params = {};
  for (const k of ["source", "medium", "campaign", "term", "content"] as const) {
    const v = p[`utm_${k}`];
    if (v) utm[k] = v;
  }

  return {
    page_url: window.location.href,
    landing_page_url: stored?.landing || window.location.href,
    referrer: stored?.referrer || externalReferrer() || null,
    utm: Object.keys(utm).length ? utm : null,
    // Same fallback order the Clarion envelope gets, so both records agree.
    gclid: p.gclid || p.wbraid || p.gbraid || null,
    wbraid: p.wbraid || null,
    gbraid: p.gbraid || null,
    fbclid: p.fbclid || null,
    msclkid: p.msclkid || null,
    ctm_visitor_sid: ctmSessionId(),
  };
}
