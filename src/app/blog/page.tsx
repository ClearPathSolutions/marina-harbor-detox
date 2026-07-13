import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import ClarionBlog from "@/components/ClarionBlog";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Recovery Blog — Addiction & Recovery Resources",
  description:
    "Expert articles on addiction, detox, and recovery from the clinical team at Marina Harbor Detox in San Francisco.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main>
        {/* Header band */}
        <section className="bg-navy-900">
          <div className="container-x py-14 text-center sm:py-20">
            <span className="eyebrow text-gold-400">The Latest</span>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Recovery News &amp; Resources
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Insights on addiction, detox, and lasting recovery from our clinical team.
            </p>
          </div>
        </section>

        {/* Clarion-managed posts render here */}
        <section className="section">
          <div className="container-wide">
            <ClarionBlog />

            {/* Link to the legacy WordPress article library, still live at its
                original URLs and preserved for SEO. */}
            <div className="mt-12 border-t border-navy-100 pt-8 text-center">
              <p className="text-sm text-navy-900/60">Looking for an older article?</p>
              <Link
                href="/blog/archive"
                className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Browse our full archive
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
