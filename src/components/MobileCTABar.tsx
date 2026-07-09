"use client";

import { site } from "@/lib/site";
import { Message, Phone } from "./Icons";

/** Sticky bottom call/text bar — mobile only, the highest-converting element for a treatment center. */
export default function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 border-t border-navy-100 bg-white/95 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(12,22,42,0.35)] backdrop-blur-md">
        <a href={site.phones.primary.href} className="btn-orange py-3 text-sm">
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <a href={site.sms} className="btn-navy py-3 text-sm">
          <Message className="h-4 w-4" /> Text Us
        </a>
      </div>
    </div>
  );
}
