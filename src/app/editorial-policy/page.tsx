import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import {
  editorial,
  editorialPolicyBody,
  editorialPolicyReady,
  editorialPolicyServed,
  EDITORIAL_POLICY_PATH,
  EDITORIAL_POLICY_URL,
  ORGANIZATION_ID,
} from "@/lib/editorial";

// Reads the policy template from disk, so it must render at build time.
export const dynamic = "force-static";

const title = `Editorial Policy | ${editorial.facilityName}`;
const description = `How ${editorial.facilityName} researches, writes, clinically reviews and updates the health information on ${editorial.domain}.`;

export const metadata: Metadata = {
  // Absolute: the package specifies this exact title, and the layout's
  // template would otherwise append "| Marina Harbor Detox" a second time.
  title: { absolute: title },
  description,
  alternates: { canonical: EDITORIAL_POLICY_PATH },
  openGraph: {
    title,
    description,
    url: EDITORIAL_POLICY_PATH,
    type: "website",
    images: [site.ogFallback],
  },
  // Withheld from indexing until signed off; production 404s instead (below).
  ...(editorialPolicyReady ? {} : { robots: { index: false, follow: false } }),
};

export default function EditorialPolicyPage() {
  if (!editorialPolicyServed) notFound();
  const html = editorialPolicyBody();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${EDITORIAL_POLICY_URL}#webpage`,
            url: EDITORIAL_POLICY_URL,
            name: "Editorial Policy",
            description,
            about: { "@id": ORGANIZATION_ID },
            ...(editorial.lastReviewed ? { lastReviewed: editorial.lastReviewed } : {}),
            inLanguage: "en-US",
          }),
        }}
      />
      <Header />
      <main id="main">
        <PageHero title="Editorial Policy" />
        <section className="section pt-12 sm:pt-14 lg:pt-16">
          <div className="container-x">
            <div className="container-article">
              {/* suppressHydrationWarning: CallTrackingMetrics rewrites the tel: link inside. */}
              <div
                className="prose-col"
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
