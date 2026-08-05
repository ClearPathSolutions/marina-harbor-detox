"use client";

import { useEffect, useState } from "react";

/**
 * MH-34 — the footer used `new Date().getFullYear()` inside a server component,
 * which Next evaluates at BUILD time. On a site that is redeployed infrequently
 * the copyright silently freezes on the build year.
 *
 * Rendering the build year on the server keeps the markup correct for crawlers
 * and no-JS visitors, then the client corrects it on mount if the year has since
 * rolled over. `suppressHydrationWarning` covers the one night a year they differ.
 */
export default function CopyrightYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);

  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== buildYear) setYear(current);
  }, [buildYear]);

  return <span suppressHydrationWarning>{year}</span>;
}
