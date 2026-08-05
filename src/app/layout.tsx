import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { site } from "@/lib/site";
import Analytics from "@/components/Analytics";
import Clarion from "@/components/Clarion";
import CookieConsent from "@/components/CookieConsent";
import Elfsight from "@/components/Elfsight";
import FloatingCall from "@/components/FloatingCall";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "drug rehab San Francisco",
    "alcohol detox San Francisco",
    "medical detox Bay Area",
    "residential rehab",
    "dual diagnosis treatment",
    "addiction treatment California",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: site.ogFallback,
        width: 2560,
        height: 1707,
        alt: `${site.name} facility`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [site.ogFallback],
  },
  robots: { index: true, follow: true },
  // Favicon + apple touch icon are auto-detected from app/icon.png & app/apple-icon.png
};

export const viewport: Viewport = {
  themeColor: "#0c1830",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phones.primary.label,
  email: site.email,
  foundingDate: site.founded,
  image: `${site.url}/images/photos/lounge-01.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 37.806261, longitude: -122.4370412 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [site.social.facebook, site.social.instagram],
  medicalSpecialty: "Addiction Medicine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so scroll-reveal never hides content for no-JS users */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }} />
        {/* Site-wide visitor tracking */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="//264810.tctm.co/t.js" />
      </head>
      <body>
        {/* First focusable element on every page — lets keyboard and screen-reader
            users jump the header nav straight to <main id="main">. Visually hidden
            until focused. */}
        <a
          href="#main"
          className="sr-only rounded-xl bg-white px-5 py-3 font-semibold text-navy-900 shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          Skip to content
        </a>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <FloatingCall />
        <Clarion />
        <Elfsight />
        <CookieConsent />
      </body>
    </html>
  );
}
