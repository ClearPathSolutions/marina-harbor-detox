"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { onConsentChange, readConsent } from "@/lib/consent";
import Reveal from "./Reveal";
import { ArrowRight } from "./Icons";

/**
 * "Hear From Our Patients" — the live Google reviews wall, ported from WordPress.
 *
 * Trustindex's loader.js renders the review cards AND emits review star schema
 * (rich snippet) for search results. We inject the loader into our own container
 * so the widget mounts in-place inside this section rather than being hoisted to
 * <head> by next/script.
 *
 * MH-27 — the loader is a third-party request, so it does NOT fire until the
 * visitor has accepted cookies. Before that we render a click-to-load card,
 * which also lets someone who declined still opt in for just this widget.
 */
export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent() === "granted");
    return onConsentChange((c) => setAllowed(c === "granted"));
  }, []);

  const load = useCallback(() => {
    if (injected.current || !ref.current) return;
    injected.current = true;
    const s = document.createElement("script");
    s.src = `https://cdn.trustindex.io/loader.js?${site.widgets.trustindexLoader}`;
    s.async = true;
    s.defer = true;
    ref.current.appendChild(s);
  }, []);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  return (
    <section className="section bg-sand-50">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Real Stories, Real Recovery</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">Hear from our patients</h2>
          <p className="mt-5 leading-relaxed text-navy-900/70">
            The people we&rsquo;ve walked alongside say it best. Read verified reviews from those who found their
            footing at Marina Harbor Detox.
          </p>
        </Reveal>
        <div ref={ref} className="mt-10" />

        {!allowed && (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-card">
            <p className="leading-relaxed text-navy-900/70">
              Our Google reviews are shown by Trustindex, a third-party service. We don&rsquo;t load it
              until you agree to cookies.
            </p>
            <button type="button" onClick={() => setAllowed(true)} className="btn-outline-navy mt-5">
              Load reviews <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Google Business Profile "write a review" shortlink — alumni & families
            land here from the Trustindex wall above. */}
        <div className="mt-10 text-center">
          <a
            href={site.address.review}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-navy"
          >
            Leave Us a Google Review <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
