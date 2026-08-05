import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import { site } from "@/lib/site";
import { ArrowRight, Phone } from "@/components/Icons";

// MH-32 — a 404 used to render bare, with no header, nav or footer, which made
// it a dead end. It now carries the same chrome as every other page so a lost
// visitor can navigate (or call) instead of bouncing.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="grid min-h-[70vh] place-items-center bg-navy-950 px-6 text-center">
        <div className="max-w-lg section-sm">
          <p className="font-display text-7xl font-extrabold text-gold-400 sm:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">This page has drifted out to sea</h1>
          <p className="mt-4 text-white/70">
            The page you&rsquo;re looking for can&rsquo;t be found — but help is always within reach. Our admissions
            team is available 24/7.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-orange">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={site.phones.primary.href} className="btn-outline">
              <Phone className="h-4 w-4" /> Call {site.phones.primary.label}
            </a>
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 text-left">
            {/* A real h2 so the jump from the page h1 to the footer's h3s
                doesn't skip a level (MH-29). */}
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Popular pages</h2>
            <ul className="mt-4 grid gap-2 text-white/75 sm:grid-cols-2">
              {[
                { href: "/what-we-offer", label: "What We Offer" },
                { href: "/admission", label: "Admissions" },
                { href: "/facility", label: "Our Facility" },
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Recovery Blog" },
                { href: "/contact-location", label: "Contact & Location" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-orange-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <MobileCTABar />
      <Footer />
    </>
  );
}
