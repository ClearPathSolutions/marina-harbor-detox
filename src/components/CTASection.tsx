import Link from "next/link";
import { site } from "@/lib/site";
import { Message, Phone } from "./Icons";

/** Shared conversion band used at the bottom of interior pages. */
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
        <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-12 text-center shadow-card sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold text-white sm:text-3xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">{text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={site.phones.primary.href} className="btn-orange text-base">
              <Phone className="h-5 w-5" /> Call {site.phones.primary.label}
            </a>
            <a href={site.sms} className="btn-outline text-base">
              <Message className="h-5 w-5" /> Text Us Now
            </a>
            <Link href="/admission#verify" className="btn-gold text-base">
              Verify Insurance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
