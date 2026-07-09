"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

/**
 * "Hear From Our Patients" — the live Google reviews wall, ported from WordPress.
 *
 * Trustindex's loader.js renders the review cards AND emits review star schema
 * (rich snippet) for search results. We inject the loader into our own container
 * so the widget mounts in-place inside this section rather than being hoisted to
 * <head> by next/script.
 */
export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !ref.current) return;
    injected.current = true;
    const s = document.createElement("script");
    s.src = `https://cdn.trustindex.io/loader.js?${site.widgets.trustindexLoader}`;
    s.async = true;
    s.defer = true;
    ref.current.appendChild(s);
  }, []);

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
      </div>
    </section>
  );
}
