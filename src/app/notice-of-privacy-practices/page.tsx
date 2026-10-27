import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL_PATHS } from "@/lib/legal";
import { site } from "@/lib/site";
import { pageTitle, pageTitleText } from "@/lib/title";

// Reads the page body from disk, so it must render at build time.
export const dynamic = "force-static";

const description = `How ${site.name} may use and disclose your health information, and how you can get access to it.`;

export const metadata: Metadata = {
  title: pageTitle("Notice of Privacy Practices"),
  description,
  alternates: { canonical: LEGAL_PATHS.npp },
  openGraph: {
    title: pageTitleText("Notice of Privacy Practices"),
    description,
    url: LEGAL_PATHS.npp,
    type: "website",
    images: [site.ogFallback],
  },
};

export default function NoticeOfPrivacyPracticesPage() {
  return <LegalPage doc="notice-of-privacy-practices" title="Notice of Privacy Practices" />;
}
