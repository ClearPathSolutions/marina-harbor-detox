/** @type {import('next').NextConfig} */

// MH-31 — security headers.
//
// CSP ships in REPORT-ONLY first, deliberately: this site loads several third
// parties (Google tags, Trustindex reviews, the Maps embed) and a blocking
// policy that is even slightly wrong takes the reviews wall or the map down
// silently. Watch the violation reports, then rename the header to
// "Content-Security-Policy" once it is clean.
//
// Allowed origins correspond to what the code actually loads:
//   googletagmanager.com / google-analytics.com  — Analytics.tsx (GA4, Ads, GTM)
//   connect.facebook.net / facebook.com          — Analytics.tsx (Meta Pixel)
//   cdn.trustindex.io                            — Reviews.tsx
//   google.com/maps, gstatic.com                 — ConsentMap.tsx
// 'unsafe-inline' is required in script-src because Next injects inline
// bootstrap scripts and the consent-default snippet must run before gtag loads.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.trustindex.io",
  "style-src 'self' 'unsafe-inline' https://cdn.trustindex.io https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://cdn.trustindex.io https://*.googleusercontent.com https://maps.gstatic.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://cdn.trustindex.io",
  "frame-src https://www.google.com https://maps.google.com https://cdn.trustindex.io",
  // NOTE: `upgrade-insecure-requests` is ignored in a report-only policy and
  // logs a console warning, so it is omitted here. Add it back when this is
  // promoted to the enforcing `Content-Security-Policy` header.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Nothing on this site needs these capabilities; deny them by default.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Portal headshots (/about/team). All three people currently come back with
    // photoUrl null, but next/image throws on an unconfigured remote host — so
    // this has to be here BEFORE anyone uploads one, not after it breaks.
    remotePatterns: [
      { protocol: "https", hostname: "support.quadranthealthgroup.com", pathname: "/**" },
    ],
    // Sizes tuned for the layout's breakpoints to keep payloads small.
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // The team is one page now, not one page per person. These three URLs are live
  // on production with accumulated equity, so they redirect to the matching
  // anchor rather than 404. Permanent — the per-person pages are not coming back.
  async redirects() {
    return ["alicia-joslin", "gus-saadeh", "ashley-hurtado"].map((slug) => ({
      source: `/about/${slug}`,
      destination: `/about/team#${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
