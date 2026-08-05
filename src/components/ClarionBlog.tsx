"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

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
 */
export default function ClarionBlog() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { siteKey, api } = site.widgets.clarion;
    const script = document.createElement("script");
    script.src = "https://www.clarionlabs.ai/blog-embed.v1.js";
    script.async = true;
    script.dataset.siteKey = siteKey;
    script.dataset.api = api;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div ref={hostRef} data-clarion-blog />;
}
