"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { onConsentChange, readConsent } from "@/lib/consent";
import Reveal from "./Reveal";
import { ArrowRight, Star } from "./Icons";

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
    // border-t is load-bearing: the section above this one is also sand-50, so
    // without a rule the two merge into one 1,264px beige block whose boundary
    // has 224px of dead space in it and nothing to mark where it falls.
    // Ungated the band is also shorter — see the empty state below.
    <section className={`border-t border-navy-100 bg-sand-50 ${allowed ? "section" : "section-sm"}`}>
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Real Stories, Real Recovery</span>
          <h2 className="mt-3 h-section text-navy-900">Hear from our patients</h2>
          <p className="mt-5 leading-relaxed text-navy-900/70">
            The people we&rsquo;ve walked alongside say it best. Read verified reviews from those who found their
            footing at Marina Harbor Detox.
          </p>
        </Reveal>
        <div ref={ref} className={allowed ? "mt-10" : undefined} />

        {/* The gated state used to be an empty 682px band holding a disclosure
            card and TWO competing outline buttons — so every first-time visitor
            met an empty social-proof section, and the second button asked for a
            review before showing any. Now it is one card with one primary
            action, and "leave a review" is demoted to a link below. */}
        {!allowed && (
          <div className="mx-auto mt-8 max-w-lg rounded-3xl border border-navy-100 bg-white p-7 text-center shadow-soft">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-sand-100 text-orange-600">
              <Star className="h-5 w-5" />
            </span>
            <p className="mt-4 leading-relaxed text-navy-900/70">
              Our Google reviews load from Trustindex, a third-party service, so we wait for your
              consent before fetching them.
            </p>
            <button type="button" onClick={() => setAllowed(true)} className="btn-orange mt-5">
              Show reviews <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Google Business Profile "write a review" shortlink — alumni & families
            land here from the Trustindex wall above. Deliberately quiet: it is a
            secondary action and should never compete with reading the reviews. */}
        <div className="mt-8 text-center">
          <a
            href={site.address.review}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mx-auto text-sm font-semibold text-navy-700 hover:text-orange-600"
          >
            Leave us a Google review
          </a>
        </div>
      </div>
    </section>
  );
}
