"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

/**
 * Records the first-touch campaign so a lead submitted three pages later still
 * carries the ad click that produced it. Renders nothing.
 *
 * Keyed on usePathname, not useSearchParams: reading search params through the
 * hook forces a Suspense boundary and opts every static page in the site into
 * dynamic rendering. lib/attribution.ts reads window.location.search directly
 * instead, which costs nothing and keeps the whole site statically generated.
 *
 * It still needs to run on every route change, not just first paint — a visitor
 * can land on an ad URL and click through to the form, and the second pageview
 * is where we confirm there is still a record to restore from.
 */
export default function CampaignCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureFirstTouch();
  }, [pathname]);

  return null;
}
