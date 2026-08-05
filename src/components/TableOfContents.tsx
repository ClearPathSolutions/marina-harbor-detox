"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * Desktop jump-nav for the article rail.
 *
 * Deliberately unstyled compared to what it replaced. It used to be a bordered,
 * shadowed card sitting *above* the conversion card — two competing objects, with
 * ~440px of navigation pushing the phone number below the fold. It is now a quiet
 * list underneath the CTA: no border, no shadow, no background. The only emphasis
 * is a 2px marker on the section you are currently reading.
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const nodes = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    // Track which headings are above the reading line; the last one wins. Using
    // a top-biased rootMargin means a section becomes "current" as its heading
    // reaches the upper third, which matches where the eye actually is.
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const firstVisible = items.find((i) => seen.get(i.id));
        if (firstVisible) {
          setActive(firstVisible.id);
          return;
        }
        // Nothing intersecting (mid-section): pick the last heading scrolled past.
        const passed = nodes.filter((n) => n.getBoundingClientRect().top < 140);
        if (passed.length) setActive(passed[passed.length - 1].id);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900/40">
        On this page
      </p>
      <ul className="mt-3 space-y-0.5">
        {items.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "border-orange-500 font-semibold text-navy-900"
                    : "border-navy-100 text-navy-900/55 hover:border-navy-300 hover:text-navy-900"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
