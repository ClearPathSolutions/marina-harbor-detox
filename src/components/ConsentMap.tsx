"use client";

import { useEffect, useState } from "react";
import { onConsentChange, readConsent } from "@/lib/consent";
import { MapPin } from "./Icons";

/**
 * Google Maps embed, consent-gated (MH-27).
 *
 * The iframe is a third-party request to google.com that sets cookies, so it is
 * not rendered until the visitor accepts. Until then we show a click-to-load
 * placeholder holding the same aspect ratio, so the layout does not shift.
 * ContentPage is a server component, hence this small client wrapper.
 */
export default function ConsentMap({ query }: { query: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "granted");
    return onConsentChange((c) => setAllowed(c === "granted"));
  }, []);

  if (allowed) {
    return (
      <iframe
        title="Marina Harbor Detox location map"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        className="aspect-[4/3] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="grid aspect-[4/3] w-full place-items-center bg-sand-100 px-6 text-center">
      <div>
        <MapPin className="mx-auto h-8 w-8 text-orange-500" />
        <p className="mt-3 text-sm leading-relaxed text-navy-900/70">
          The map is loaded from Google, which sets cookies. We don&rsquo;t load it until you agree.
        </p>
        <button type="button" onClick={() => setAllowed(true)} className="btn-outline-navy mt-4">
          Show map
        </button>
      </div>
    </div>
  );
}
