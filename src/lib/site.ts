// Central source of truth for site-wide content, contact info, and navigation.
// Editing copy or links here updates them everywhere they are used.

export const site = {
  name: "Marina Harbor Detox",
  tagline: "Premier Drug & Alcohol Rehab in San Francisco, CA",
  description:
    "Compassionate, accredited medical detox and residential rehab provided by experienced clinicians with over 15 years of addiction treatment expertise in a private, luxury setting designed for lasting recovery.",
  url: "https://marinaharbordetox.com",
  email: "info@marinaharbordetox.com",
  phones: {
    // Primary admissions line surfaced in the header + CTAs
    primary: { label: "1-866-525-3026", href: "tel:+18665253026" },
    advocate: { label: "866-932-3206", href: "tel:+18669323206" },
    local: { label: "415-868-3858", href: "tel:+14158683858" },
  },
  sms: "sms:+18665253026",
  address: {
    street: "289 Marina Blvd.",
    city: "San Francisco",
    state: "CA",
    zip: "94123",
    maps: "https://www.google.com/maps/place/Marina+Harbor+Detox/@37.806261,-122.4370412,15z",
  },
  license: "Licensed by the State Department of Health Care Services · DHCS License #380106AP · Expires 8/31/2027",
  social: {
    facebook: "https://www.facebook.com/Marina-Harbor-Detox-102211298893099",
    instagram: "https://www.instagram.com/marinaharbordetox_/?hl=en",
  },
  // Third-party widget IDs carried over from the WordPress site.
  // Trustindex renders the "Hear From Our Patients" Google reviews wall + star rich snippet.
  widgets: {
    trustindexLoader: "718a667695be9627c1963405c60",
    elfsightApp: "de52e11c-b5df-4d05-8281-0a00d33a23e0",
    // Clarion Labs — hosts the chat widget + insurance-verification form capture.
    clarion: {
      siteKey: "cpx_8RF5FiJFYnDZgaFMY2fjSTtjCTQ84Wmk",
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

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", desc: "Our story & clinical philosophy" },
      { label: "FAQ", href: "/faq", desc: "Answers to common questions" },
      { label: "Blog", href: "/blog", desc: "Recovery news & resources" },
      { label: "Alicia Joslin", href: "/about/alicia-joslin", desc: "Program Director" },
      { label: "Gus Saadeh", href: "/about/gus-saadeh", desc: "Operations Director" },
    ],
  },
  {
    label: "Who We Help",
    href: "/first-responders",
    children: [
      { label: "First Responders", href: "/first-responders", desc: "Specialized care for first responders" },
      { label: "Professionals", href: "/professionals", desc: "Discreet care for executives" },
      { label: "Men", href: "/men", desc: "Treatment designed for men" },
      { label: "Women", href: "/women", desc: "Treatment designed for women" },
      { label: "Young Adults", href: "/young-adults", desc: "Care for young adults" },
      { label: "College Students", href: "/college-students", desc: "Support for students in recovery" },
    ],
  },
  {
    label: "What We Offer",
    href: "/what-we-offer",
    children: [
      { label: "Medical Detox", href: "/what-we-offer/detox-san-francisco", desc: "24/7 medically supervised detox" },
      { label: "Residential Inpatient", href: "/what-we-offer/inpatient-rehab-san-francisco", desc: "Live-in residential rehab" },
      { label: "Dual Diagnosis", href: "/what-we-offer/dual-diagnosis", desc: "Co-occurring mental health care" },
      { label: "Aftercare", href: "/aftercare", desc: "Alumni & ongoing support" },
      { label: "Holistic Therapy", href: "/what-we-offer/holistic-addiction-therapy", desc: "Mind-body healing" },
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
      { label: "Admissions", href: "/admission", desc: "How to get started" },
      { label: "Verify Insurance", href: "/admission#verify", desc: "Free, confidential benefits check" },
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
  { src: "/images/facility/facility-2320.jpg", alt: "Marina Harbor Detox — luxury common living space" },
  { src: "/images/facility/facility-2309.jpg", alt: "Marina Harbor Detox — private suite interior" },
  { src: "/images/facility/facility-2377.jpg", alt: "Marina Harbor Detox — comfortable lounge area" },
  { src: "/images/facility/facility-2346.jpg", alt: "Marina Harbor Detox — dining and gathering space" },
  { src: "/images/facility/facility-2366.jpg", alt: "Marina Harbor Detox — serene interior detail" },
  { src: "/images/facility/facility-2294.jpg", alt: "Marina Harbor Detox — welcoming entryway" },
  { src: "/images/facility/facility-2390.jpg", alt: "Marina Harbor Detox — restful bedroom suite" },
  { src: "/images/facility/facility-2426.jpg", alt: "Marina Harbor Detox — outdoor lounge and grounds" },
] as const;

export const serviceAreas = [
  "Marin County", "Palo Alto", "Berkeley", "Fremont", "San Jose",
  "Santa Cruz", "Santa Barbara", "San Luis Obispo", "Elk Grove",
] as const;

export const blogPosts = [
  {
    title: "What Does Comprehensive Addiction Treatment Include?",
    category: "Treatment",
    author: "Kris Brace, CADC II",
    date: "June 17, 2026",
    excerpt:
      "When most people think about addiction treatment, they often picture detox. While detox is an important first step, long-term recovery usually requires much more than…",
    href: "/2026/06/17/what-comprehensive-addiction-treatment-includes",
    image: "/images/backgrounds/luxury-lounge.jpg",
  },
  {
    title: "Who Benefits Most From Residential Rehab?",
    category: "Rehab",
    author: "Kris Brace, CADC II",
    date: "June 3, 2026",
    excerpt:
      "When exploring addiction treatment options, one of the most common questions people ask is: 'Do I really need residential rehab?' The answer depends on several…",
    href: "/2026/06/03/who-benefits-most-from-residential-rehab",
    image: "/images/backgrounds/golden-gate-bridge.jpg",
  },
  {
    title: "What Happens to the Brain During Meth Addiction?",
    category: "Education",
    author: "Kris Brace, CADC II",
    date: "May 20, 2026",
    excerpt:
      "Methamphetamine addiction can affect the brain faster and more aggressively than many other substances. Over time, meth changes the way the brain regulates motivation…",
    href: "/2026/05/20/how-meth-affects-the-brain",
    image: "/images/backgrounds/detail.jpg",
  },
] as const;
