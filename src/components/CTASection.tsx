import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRight, Check, MapPin, Message, Phone, Shield } from "./Icons";

/**
 * Full-width conversion band at the foot of interior pages.
 *
 * This absorbed the sticky tile that used to float in the right rail. That
 * widget carried the page's only persistent phone number, the Verify button,
 * Text Us and the three trust badges — removing the rail without moving them
 * here would have dropped the conversion path entirely. Everything it held now
 * lives in this band, laid out across the full width instead of stacked in a
 * 320px column.
 */
export default function CTASection({
  heading = "Ready to take the first step?",
  text = "Our compassionate admissions team is available 24/7 to answer your questions and verify your insurance — confidentially and with no obligation.",
}: {
  heading?: string;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="container-x">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-12 text-center shadow-card sm:px-12 sm:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
            Available 24/7
          </span>
          <h2 className="h-section mx-auto mt-3 max-w-2xl text-balance text-white">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">{text}</p>

          {/* ONE primary action. Call is the conversion, Text is the
              alternative, and verifying insurance is a step you take on the way,
              so it reads as a link rather than a third competing filled button. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={site.phones.primary.href} className="btn-orange w-full text-base sm:w-auto">
              <Phone className="h-5 w-5" /> Call {site.phones.primary.label}
            </a>
            <a href={site.sms} className="btn-outline w-full text-base sm:w-auto">
              <Message className="h-5 w-5" /> Text Us Now
            </a>
          </div>
          <Link
            href="/admission#verify"
            className="link-underline mx-auto mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300"
          >
            Or verify your insurance in minutes <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Trust badges, previously stacked in the sidebar tile. At full width
              they read as one row rather than a vertical list. */}
          <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-x-10 gap-y-3 border-t border-white/10 pt-8 text-sm text-white/70 sm:flex-row">
            <li className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 shrink-0 text-gold-400" /> Joint Commission Accredited
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 shrink-0 text-gold-400" /> Most PPO insurance accepted
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-gold-400" /> San Francisco, CA
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
