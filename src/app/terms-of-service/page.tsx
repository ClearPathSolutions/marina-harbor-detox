import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { site } from "@/lib/site";
import { pageTitle, pageTitleText } from "@/lib/title";

// Reads the page body from disk, so it must render at build time.
export const dynamic = "force-static";

const description = `The terms that govern your use of the ${site.name} website, including our website disclaimer.`;

export const metadata: Metadata = {
  title: pageTitle("Terms of Service"),
  description,
  alternates: { canonical: LEGAL_PATHS.terms },
  openGraph: {
    title: pageTitleText("Terms of Service"),
    description,
    url: LEGAL_PATHS.terms,
    type: "website",
    images: [site.ogFallback],
  },
};

export default function TermsOfServicePage() {
  return <LegalPage doc="terms-of-service" title="Terms of Service" />;
}
