"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Close, Message, Phone } from "./Icons";

/**
 * Persistent desktop call/contact affordance — the native replacement for the
 * WordPress "Call Now Button" plugin. Desktop only (`lg:`): on phones the
 * MobileCTABar already pins Call/Text to the bottom, so this would collide.
 */
export default function FloatingCall() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[55] hidden flex-col items-start gap-3 lg:flex">
      {open && (
        <div className="w-64 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift">
          <div className="bg-navy-900 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">
              Confidential · 24/7
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">How can we help?</p>
          </div>
          <div className="flex flex-col p-2">
            <a
              href={site.phones.primary.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-sand-50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-white">
                <Phone className="h-4 w-4" />
              </span>
              Call {site.phones.primary.label}
            </a>
            <a
              href={site.sms}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-sand-50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-800 text-white">
                <Message className="h-4 w-4" />
              </span>
              Text Us Now
            </a>
            <Link
              href="/admission#verify"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center rounded-xl bg-gold-500 px-3 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Verify Insurance
            </Link>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full bg-orange-500 py-3 pl-3 pr-5 font-semibold text-white shadow-lift transition-all hover:bg-orange-600 hover:shadow-card"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
          {open ? <Close className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
        </span>
        {open ? "Close" : "Call 24/7"}
      </button>
    </div>
  );
}
