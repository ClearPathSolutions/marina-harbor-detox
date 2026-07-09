"use client";

import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Elfsight widget ported from WordPress (app id de52e11c-…). On the old site it was
 * mounted near the top of the body — most likely a floating click-to-call / chat
 * badge. Because its exact type is unconfirmed and it could collide with the native
 * FloatingCall button, it's OFF by default. Flip it on once confirmed:
 *
 *   NEXT_PUBLIC_ENABLE_ELFSIGHT=true
 *
 * Elfsight's platform.js scans the DOM for the `.elfsight-app-<id>` div and mounts
 * the widget there (floating widgets position themselves regardless of placement).
 */
export default function Elfsight() {
  if (process.env.NEXT_PUBLIC_ENABLE_ELFSIGHT !== "true") return null;

  return (
    <>
      <Script src="https://static.elfsight.com/platform/platform.js" strategy="afterInteractive" />
      <div className={`elfsight-app-${site.widgets.elfsightApp}`} data-elfsight-app-lazy />
    </>
  );
}
