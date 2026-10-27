import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { site } from "@/lib/site";
import { pageTitle, pageTitleText } from "@/lib/title";

// Reads the page body from disk, so it must render at build time.
export const dynamic = "force-static";

const description = `Terms for text-message communications from ${site.name}: program description, cost, opt-out and privacy.`;

export const metadata: Metadata = {
  title: pageTitle("SMS Terms"),
  description,
  alternates: { canonical: LEGAL_PATHS.sms },
  openGraph: {
    title: pageTitleText("SMS Terms"),
    description,
    url: LEGAL_PATHS.sms,
    type: "website",
    images: [site.ogFallback],
  },
};

export default function SmsTermsPage() {
  return <LegalPage doc="sms-terms" title="SMS Terms" />;
}
