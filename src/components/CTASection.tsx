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
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-12 text-center shadow-card sm:px-12 sm:py-16">
          <h2 className="h-section mx-auto max-w-2xl text-balance text-white">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">{text}</p>
          {/* ONE primary action. This row used to hold three buttons in three
              treatments — orange filled, white outline and gold filled — so the
              closing CTA on every interior page had two filled buttons in
              competing brand colours and no focal point. Call is the conversion,
              Text is the alternative, and verifying insurance is a step you take
              on the way, so it reads as a link. */}
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
            className="link-underline mx-auto mt-6 text-sm font-semibold text-gold-400 hover:text-gold-300"
          >
            Or verify your insurance in minutes
          </Link>
        </div>
      </div>
    </section>
  );
}
