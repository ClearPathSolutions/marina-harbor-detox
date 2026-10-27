import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { site } from "@/lib/site";
import { pageTitle, pageTitleText } from "@/lib/title";

// Reads the page body from disk, so it must render at build time.
export const dynamic = "force-static";

const description = `How ${site.name} collects, uses, discloses and protects information submitted through this website or shared with our team.`;

export const metadata: Metadata = {
  title: pageTitle("Privacy Policy"),
  description,
  alternates: { canonical: LEGAL_PATHS.privacy },
  openGraph: {
    title: pageTitleText("Privacy Policy"),
    description,
    url: LEGAL_PATHS.privacy,
    type: "website",
    images: [site.ogFallback],
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc="privacy-policy" title="Privacy Policy" />;
}
