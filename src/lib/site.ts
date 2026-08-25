// Central source of truth for site-wide content, contact info, and navigation.
// Editing copy or links here updates them everywhere they are used.

export const site = {
  name: "Marina Harbor Detox",
  tagline: "Premier Drug & Alcohol Rehab in San Francisco, CA",
  // MH-20: kept under 160 chars. The "accredited" and "15+ years" claims are
  // preserved verbatim in substance — D-4 (accreditation) and D-7 (the 15-year
  // claim) are still open, so this shortens the sentence without settling either.
  description:
    "Compassionate, accredited medical detox and residential rehab from clinicians with 15+ years of addiction expertise, in a private San Francisco setting.",
  url: "https://marinaharbordetox.com",
  email: "info@marinaharbordetox.com",
  // ONE tracked website number, per the business record. Every CTA, the header,
  // the footer and the JSON-LD all resolve here — do not reintroduce alternates
  // (an advocate line and a 415 local line used to live here and split the
  // homepage across three numbers, which broke NAP consistency + call attribution).
  phones: {
    primary: { label: "1-866-525-3026", href: "tel:+18665253026" },
  },
  sms: "sms:+18665253026",
  founded: "2021",
  address: {
    street: "289 Marina Blvd",
    city: "San Francisco",
    state: "CA",
    zip: "94123",
    maps: "https://www.google.com/maps/place/Marina+Harbor+Detox/@37.806261,-122.4370412,15z",
    // Google Business Profile "write a review" shortlink
    review: "https://g.page/r/CfD3cn_q2hyLEAI/review",
  },
  license: "Licensed by the State Department of Health Care Services · DHCS License #380106AP · Expires 8/31/2027",
  // Social-card fallback for pages with no usable hero of their own. leadImage()
  // deliberately refuses logos/seals, so this is what stands in — never the logo.
  ogFallback: "/images/photos/aerial-bridge-04.jpg",
  social: {
    facebook: "https://www.facebook.com/Marina-Harbor-Detox-102211298893099",
    instagram: "https://www.instagram.com/marinaharbordetox_/?hl=en",
  },
  // Third-party widget IDs carried over from the WordPress site.
  // Trustindex renders the "Hear From Our Patients" Google reviews wall + star rich snippet.
  widgets: {
    trustindexLoader: "718a667695be9627c1963405c60",
    elfsightApp: "de52e11c-b5df-4d05-8281-0a00d33a23e0",
    // Google Tag Manager container. Lives here rather than only in
    // NEXT_PUBLIC_GTM_ID because the Vercel project has no env vars set, so an
    // env-only gate meant GTM never actually loaded in production. The env var
    // still wins if it is set, which keeps per-environment overrides possible.
    gtmId: "GTM-5QPLKQHB",
    // Clarion Labs — hosts the chat widget + insurance-verification form capture.
    //
    // The key is read from NEXT_PUBLIC_CLARION_SITE_KEY when it is set, so it can
    // be managed in Vercel and overridden per environment. It MUST stay
    // NEXT_PUBLIC_: three browser-side scripts read it as data-site-key (the chat
    // widget and forms-capture in components/Clarion.tsx, the blog embed in
    // components/ClarionBlog.tsx), and a server-only var is invisible to them.
    // That is not a leak — a Clarion site key is public by design and already
    // ships in the page source.
    //
    // The literal stays as the fallback for the same reason gtmId above does: this
    // Vercel project has no env vars set, and an env-only gate would take the chat
    // widget, form capture and the blog embed down with it — form capture being
    // the only delivery path the insurance-verification form has.
    clarion: {
      siteKey: process.env.NEXT_PUBLIC_CLARION_SITE_KEY || "cpx_8RF5FiJFYnDZgaFMY2fjSTtjCTQ84Wmk",
      api: "https://api.clarionlabs.ai",
    },
  },
} as const;

// Real carrier logos (white marks — displayed on the navy insurance panel).
export const insuranceLogos = [
  { name: "Aetna", src: "/images/insurance/aetna.png", w: 160, h: 80 },
  { name: "Anthem", src: "/images/insurance/anthem.png", w: 271, h: 80 },
  { name: "TRICARE", src: "/images/insurance/tricare.png", w: 159, h: 80 },
  { name: "Highmark", src: "/images/insurance/highmark.png", w: 273, h: 80 },
  { name: "First Health Network", src: "/images/insurance/first-health.png", w: 528, h: 80 },
  { name: "AmeriHealth", src: "/images/insurance/amerihealth.png", w: 200, h: 80 },
  { name: "Beacon", src: "/images/insurance/beacon.png", w: 160, h: 80 },
] as const;

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Our Team", href: "/about/team" },
    ],
  },
  {
    label: "Who We Help",
    href: "/first-responders",
    children: [
      { label: "First Responders", href: "/first-responders" },
      { label: "Professionals", href: "/professionals" },
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "Young Adults", href: "/young-adults" },
      { label: "College Students", href: "/college-students" },
    ],
  },
  {
    label: "What We Offer",
    href: "/what-we-offer",
    children: [
      { label: "Medical Detox", href: "/what-we-offer/detox-san-francisco" },
      { label: "Residential Inpatient", href: "/what-we-offer/inpatient-rehab-san-francisco" },
      { label: "Dual Diagnosis", href: "/what-we-offer/dual-diagnosis" },
      { label: "Aftercare", href: "/aftercare" },
      { label: "Holistic Therapy", href: "/what-we-offer/holistic-addiction-therapy" },
      { label: "Alcohol Detox", href: "/what-we-offer/alcohol-detox" },
      { label: "Drug Detox", href: "/what-we-offer/drug-detox" },
      { label: "Benzodiazepines Detox", href: "/what-we-offer/benzodiazepines-detox" },
      { label: "Fentanyl Detox", href: "/fentanyl-detox" },
      { label: "Heroin Detox", href: "/what-we-offer/heroin-detox" },
      { label: "Meth Detox", href: "/what-we-offer/meth-detox" },
      { label: "Cocaine Detox", href: "/what-we-offer/cocaine-detox" },
      { label: "Prescription Drug Detox", href: "/what-we-offer/prescription-drugs-detox" },
      { label: "Suboxone Detox", href: "/what-we-offer/suboxone-detox" },
    ],
  },
  {
    label: "Areas We Serve",
    href: "/what-we-offer/drug-rehab-marin-county",
    children: [
      { label: "Marin County", href: "/what-we-offer/drug-rehab-marin-county" },
      { label: "Palo Alto", href: "/palo-alto" },
      { label: "Berkeley", href: "/berkeley-addiction-treatment-program" },
      { label: "Fremont", href: "/fremont-addiction-treatment" },
      { label: "San Jose", href: "/san-jose" },
      { label: "Santa Cruz", href: "/santa-cruz" },
      { label: "Santa Barbara", href: "/santa-barbara" },
      { label: "San Luis Obispo", href: "/san-luis-obispo" },
      { label: "Elk Grove", href: "/elk-grove" },
    ],
  },
  { label: "Facility", href: "/facility" },
  {
    label: "Admissions",
    href: "/admission",
    children: [
      { label: "Admissions", href: "/admission" },
      { label: "Verify Insurance", href: "/admission#verify" },
      { label: "Aetna", href: "/aetna" },
      { label: "Cigna", href: "/cigna" },
      { label: "CompPsych", href: "/comppsych" },
      { label: "First Health Network", href: "/first-health-network" },
      { label: "Geisinger", href: "/geisinger" },
      { label: "UMR", href: "/umr" },
      { label: "Care Providers", href: "/care-providers" },
    ],
  },
  { label: "Contact", href: "/contact-location" },
];

export const programs = [
  {
    title: "Medical Detox",
    body: "Start your recovery in a safe, medically supervised environment. Our 24/7 clinical team manages withdrawal symptoms with compassion and expert care, ensuring your comfort and safety as your body begins to heal.",
    href: "/what-we-offer/detox-san-francisco",
    icon: "shield",
  },
  {
    title: "Residential Inpatient",
    body: "Once stabilized, transition into our high-end residential program. Live on-site at our San Francisco campus, participating in intensive daily therapy and wellness activities that build a foundation for a substance-free life.",
    href: "/what-we-offer/inpatient-rehab-san-francisco",
    icon: "home",
  },
  {
    title: "Dual Diagnosis",
    body: "We specialize in treating co-occurring mental health disorders alongside substance use. Conditions like anxiety, depression, and PTSD are addressed together — treating the whole person, not just the addiction.",
    href: "/what-we-offer/dual-diagnosis",
    icon: "brain",
  },
  {
    title: "Aftercare & Alumni",
    body: "Recovery doesn't end when you leave. We provide comprehensive aftercare planning and access to a vibrant alumni network for the ongoing community, resources, and accountability needed for lifelong sobriety.",
    href: "/aftercare",
    icon: "heart",
  },
] as const;

export const therapies = [
  "Individual & Group Counseling",
  "Cognitive Behavioral Therapy (CBT)",
  "Dialectical Behavior Therapy (DBT)",
  "Trauma-Informed Care",
  "Relapse Prevention Planning",
  "Holistic Mindfulness & Meditation",
  "Drama & Art Therapy",
] as const;

export const amenities = [
  "24/7 Expert Clinical Supervision",
  "Private & Semi-Private Suites",
  "Fully Equipped Fitness Gym",
  "Chef-Inspired Gourmet Meals",
  "Secluded Outdoor Lounges",
  "Secure & Confidential Gated Campus",
] as const;

export const accreditations = [
  { name: "The Joint Commission", src: "/images/accreditation/joint-commission.png", w: 300, h: 300 },
  { name: "DHCS Licensed", src: "/images/accreditation/dhcs.webp", w: 898, h: 857 },
  { name: "LegitScript Certified", src: "/images/accreditation/legitscript.png", w: 151, h: 180 },
  { name: "NAMI Member", src: "/images/accreditation/nami.gif", w: 330, h: 126 },
] as const;

export const facilityPhotos = [
  { src: "/images/photos/lounge-01.jpg", alt: "Common living room at Marina Harbor Detox with floor-to-ceiling windows over Marina Green" },
  { src: "/images/photos/room-fireplace-03.jpg", alt: "Private guest room with a queen bed, sitting area and Marina District view" },
  { src: "/images/photos/lounge-bridge-view.jpg", alt: "Lounge seating looking out to the Golden Gate Bridge" },
  { src: "/images/photos/kitchen-01.jpg", alt: "Bright residential kitchen with a breakfast bar" },
  { src: "/images/photos/room-twin-03.jpg", alt: "Shared guest room with two beds and a bay view" },
  { src: "/images/photos/bath-marble.jpg", alt: "Marble-tiled ensuite bathroom with a walk-in glass shower" },
  { src: "/images/photos/dining-conference.jpg", alt: "Dining and group meeting room at Marina Harbor Detox" },
  { src: "/images/photos/mural-marina-harbor.jpg", alt: "Hand-painted Marina Harbor Detox mural of the Golden Gate Bridge at sunset" },
  // NINE, not eight. The gallery is a 4-column grid whose lead tile spans 2x2,
  // so it holds 4 + 8 = 12 cells across 3 rows. At eight photos the last row
  // ran 3-of-4 and left an empty cell in the bottom-right corner.
  { src: "/images/photos/room-single-01.jpg", alt: "Private single guest room with natural light and a work area" },
] as const;

export const serviceAreas = [
  "Marin County", "Palo Alto", "Berkeley", "Fremont", "San Jose",
  "Santa Cruz", "Santa Barbara", "San Luis Obispo", "Elk Grove",
] as const;

/**
 * MH-33 — homepage blog cards are now derived from content/posts at build time
 * (see `homepagePosts()` in lib/content.ts). Posts carry no category field, so
 * the coloured chip is opt-in per slug here; a post with no entry simply renders
 * without a chip rather than inventing one.
 */
export const postCategories: Record<string, string> = {
  "2026__06__17__what-comprehensive-addiction-treatment-includes": "Treatment",
  "2026__06__03__who-benefits-most-from-residential-rehab": "Rehab",
  "2026__05__20__how-meth-affects-the-brain": "Education",
  "2026__05__08__why-heroin-withdrawal-is-so-difficult": "Education",
  "2026__04__21__prescription-drug-withdrawal-timeline": "Education",
};

/**
 * Byline shown on the homepage blog cards. Authorship is contested — site.ts
 * credits this name while ContentPage hardcodes "Marina Harbor Detox Clinical
 * Team" — and is blocked on D-3 / MH-15. Left exactly as it was.
 */
export const blogAuthor = "Kris Brace, CADC II";
