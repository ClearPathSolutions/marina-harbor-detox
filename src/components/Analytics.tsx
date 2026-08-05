"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { analyticsPath, isClinicalRoute, REDACTED_TITLE } from "@/lib/clinicalRoutes";

/**
 * Marketing & analytics tags, ported from the WordPress site.
 *
 * Everything here is ENV-GATED: if an ID isn't set, that tag simply doesn't render,
 * so the site ships clean with no tracking until you fill these in (e.g. in Vercel
 * project env vars). All are NEXT_PUBLIC_* because they run in the browser.
 *
 *   NEXT_PUBLIC_GA_ID          GA4 measurement id            e.g. G-XXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_ID  Google Ads conversion id      e.g. AW-XXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID  Meta (Facebook) Pixel id      e.g. 123456789012345
 *   NEXT_PUBLIC_GTM_ID         Google Tag Manager (optional) e.g. GTM-XXXXXXX
 *
 * Consent: we implement Google Consent Mode v2 with all storage DENIED by default,
 * and Meta Pixel consent REVOKED by default. The CookieConsent banner flips these to
 * granted once the visitor accepts. Until then, tags send only cookieless pings.
 *
 * MH-05 — clinical routes are redacted. Automatic pageviews are switched OFF for
 * both gtag (`send_page_view: false`) and the Pixel (no `track` in the init
 * snippet); every pageview is instead dispatched from the effect below, which
 * redacts Google's payload and stays silent for Meta on clinical URLs. See
 * `src/lib/clinicalRoutes.ts` for the rule.
 *
 * MH-28 — that same effect keys on `usePathname()`, so App Router client-side
 * navigations are counted. Previously only hard loads were.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const useGtag = Boolean(gaId || adsId);
  const enabled = useGtag || Boolean(pixelId) || Boolean(gtmId);

  const pathname = usePathname();
  // The init scripts already establish the tag; the first effect run is the
  // first pageview, so nothing is double-counted.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !pathname || lastSent.current === pathname) return;
    lastSent.current = pathname;

    const clinical = isClinicalRoute(pathname);
    const path = analyticsPath(pathname);

    const w = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };

    if (useGtag && typeof w.gtag === "function") {
      w.gtag("event", "page_view", {
        page_path: path,
        page_location: `${window.location.origin}${path}`,
        page_title: clinical ? REDACTED_TITLE : document.title,
      });
    }

    // Meta cannot be redacted — fbq reads window.location directly — so on a
    // clinical route we simply do not fire it.
    if (pixelId && !clinical && typeof w.fbq === "function") {
      w.fbq("track", "PageView");
    }
  }, [pathname, enabled, useGtag, pixelId]);

  if (!enabled) return null;

  return (
    <>
      {/* Consent Mode v2 defaults — must run before any gtag/GTM load */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('js', new Date());
        `}
      </Script>

      {/* Google Tag Manager (optional container) */}
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {/* GA4 + Google Ads (gtag.js). send_page_view is off: the effect above
          owns pageviews so clinical paths can be redacted before they are sent. */}
      {useGtag && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId || adsId}`}
          />
          <Script id="gtag-config" strategy="afterInteractive">
            {`
              ${gaId ? `gtag('config', '${gaId}', { send_page_view: false });` : ""}
              ${adsId ? `gtag('config', '${adsId}', { send_page_view: false });` : ""}
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel — consent revoked until the banner grants it, and
          NO automatic PageView: the effect above fires it only off clinical routes. */}
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke');
            fbq('init', '${pixelId}');
          `}
        </Script>
      )}
    </>
  );
}
