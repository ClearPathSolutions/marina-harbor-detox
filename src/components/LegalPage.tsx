import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import { legalBody, type LegalDoc } from "@/lib/legal";

/**
 * Shell for the standard legal pages (privacy policy, notice of privacy
 * practices, SMS terms): the same layout as the editorial policy, and its
 * long-form prose styles (.editorial-policy in globals.css).
 */
export default function LegalPage({ doc, title }: { doc: LegalDoc; title: string }) {
  const html = legalBody(doc);
  return (
    <>
      <Header />
      <main id="main">
        <PageHero title={title} />
        <section className="section pt-12 sm:pt-14 lg:pt-16">
          <div className="container-x">
            <div className="container-article">
              {/* suppressHydrationWarning: CallTrackingMetrics rewrites the tel: link inside. */}
              <div
                className="prose-col editorial-policy"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: html }}
              />
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
