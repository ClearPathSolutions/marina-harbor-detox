import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "./Icons";
import CopyrightYear from "./CopyrightYear";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Tour Facility", href: "/facility" },
  { label: "Admissions", href: "/admission" },
  { label: "Contact", href: "/contact-location" },
  { label: "FAQ", href: "/faq" },
];

const offerLinks = [
  { label: "Medical Detox", href: "/what-we-offer/detox-san-francisco" },
  { label: "Alcohol Detox", href: "/what-we-offer/alcohol-detox" },
  { label: "Meth Detox", href: "/what-we-offer/meth-detox" },
  { label: "Heroin Detox", href: "/what-we-offer/heroin-detox" },
  { label: "Benzo Detox", href: "/what-we-offer/benzodiazepines-detox" },
  { label: "Fentanyl Detox", href: "/fentanyl-detox" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-white/70 lg:pb-0">
      <div className="container-x section-sm grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/images/brand/logo-mark.png"
            alt={site.name}
            width={1828}
            height={1028}
            sizes="(max-width: 640px) 150px, 180px"
            className="h-20 w-auto sm:h-24"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Marina Harbor Detox offers evidence-based treatment for substance abuse in a private, luxury setting in
            the San Francisco Bay Area.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-orange-500 hover:text-white"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-orange-500 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="link-underline hover:text-orange-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* What we offer */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">What We Offer</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {offerLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="link-underline hover:text-orange-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={site.phones.primary.href} className="flex items-start gap-3 hover:text-orange-400">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {site.phones.primary.label}
              </a>
            </li>
            <li>
              <a
                href={site.address.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-orange-400"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 break-all hover:text-orange-400">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              Open 24 hours · 7 days a week
            </li>
          </ul>
        </div>
      </div>

      {/* License strip */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/50 sm:flex-row sm:text-left">
          <p>{site.license}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-orange-400">
              Privacy Policy
            </Link>
            <span>© <CopyrightYear buildYear={new Date().getFullYear()} /> {site.name}. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
