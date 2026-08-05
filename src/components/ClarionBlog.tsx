"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRight } from "./Icons";

/**
 * Clarion Labs blog embed — renders posts authored & managed in the Clarion
 * dashboard into the `<div data-clarion-blog>` target below.
 *
 * Why a client component (not a native <script> like components/Clarion.tsx):
 * the widget/forms scripts live in the root layout and load once per session,
 * but blog-embed.v1.js scans the DOM for its target *when it executes*. On a
 * client-side route change into /blog, React does not re-run a server-rendered
 * <script> tag, so the embed would render on a hard load but stay blank after
 * in-app navigation. We therefore (re)inject the script on every mount and
 * remove it on unmount, guaranteeing a fresh scan each time the page appears.
 *
 * WHY THERE IS A SKELETON AND A FALLBACK
 * --------------------------------------
 * The entire article list on /blog comes from this third-party script, and
 * nothing here is server-rendered. Before, the section's whole content while
 * waiting was the literal word "Loading…" centred in an empty band — and if the
 * script was slow, blocked or failed, that was the page, permanently. Now:
 *   - a card skeleton holds the layout while the embed mounts, so the page has
 *     shape from the first paint;
 *   - if nothing has rendered after GIVE_UP_MS, we say so plainly and point at
 *     /blog/archive, which is server-rendered from local content and always
 *     works. A visitor never lands on a blank page.
 */

/** How long to wait for the embed before showing the archive fallback. */
const GIVE_UP_MS = 6000;

function CardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-soft">
      <div className="aspect-[16/10] animate-pulse bg-navy-100" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-24 animate-pulse rounded-full bg-navy-100" />
        <div className="h-5 w-full animate-pulse rounded-full bg-navy-100" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-navy-100" />
        <div className="h-3 w-full animate-pulse rounded-full bg-sand-200" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-sand-200" />
      </div>
    </div>
  );
}

export default function ClarionBlog() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const { siteKey, api } = site.widgets.clarion;
    const script = document.createElement("script");
    script.src = "https://www.clarionlabs.ai/blog-embed.v1.js";
    script.async = true;
    script.dataset.siteKey = siteKey;
    script.dataset.api = api;
    document.body.appendChild(script);

    // The embed gives us no callback, so watch its target for content instead.
    const host = hostRef.current;
    const settled = () => (host?.childElementCount ?? 0) > 0;

    const observer = host
      ? new MutationObserver(() => {
          if (settled()) setState("ready");
        })
      : null;
    if (host && observer) observer.observe(host, { childList: true, subtree: true });

    const timer = window.setTimeout(() => {
      setState(settled() ? "ready" : "failed");
    }, GIVE_UP_MS);

    return () => {
      script.remove();
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={hostRef} data-clarion-blog />

      {state === "loading" && (
        <div className="grid gap-6 md:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {state === "failed" && (
        <div className="mx-auto max-w-xl rounded-3xl border border-navy-100 bg-sand-50 p-8 text-center">
          <p className="font-display text-lg font-bold text-navy-900">Our latest articles aren’t loading</p>
          <p className="mt-3 leading-relaxed text-navy-900/70">
            This can happen if a browser extension blocks third-party scripts. Our full library is always
            available in the archive.
          </p>
          <Link href="/blog/archive" className="btn-navy mt-6">
            Browse the article archive <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  );
}
