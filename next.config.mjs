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
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.trustindex.io https://*.tctm.co https://www.clarionlabs.ai",
  "style-src 'self' 'unsafe-inline' https://cdn.trustindex.io https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://cdn.trustindex.io https://*.googleusercontent.com https://maps.gstatic.com https://*.tctm.co",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://cdn.trustindex.io https://*.tctm.co https://api.clarionlabs.ai https://www.clarionlabs.ai",
  "frame-src https://www.google.com https://maps.google.com https://cdn.trustindex.io https://www.googletagmanager.com",
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

  // MH-35 — trailing slash, settled for THIS site to match production.
  //
  // Production (WP Engine) is trailing-slash canonical: /about/ serves 200 and
  // /about 301s to it, and that is the form Google has indexed and every inbound
  // link uses. This build was the exact inverse — /about served 200 and /about/
  // 308'd — so at cutover every organic entry point and every backlink would have
  // landed on a redirect. Measured on 7 sampled paths before the change:
  //   production   no-slash 301  slash 200
  //   this build   no-slash 200  slash 308
  // Matching production is the lower-risk direction (MH-35's own stated default)
  // because it preserves existing links rather than asking Google to re-learn
  // 117 URLs during a migration.
  //
  // Canonical, og:url and sitemap.ts all derive from the same pathname, so they
  // follow from this one line — see the verification note in MH-36.
  trailingSlash: true,
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

  // MH-36 — the cutover redirect map.
  //
  // Unblocked by MH-35 above: this map is written in the trailing-slash form
  // because that is now what the build serves and what production already uses.
  // Destinations MUST carry the slash — "/about/team#x" would 308 again and
  // produce the redirect chain MH-36's acceptance criterion forbids (measured:
  // /about/alicia-joslin/ -> 308 -> /about/team#alicia-joslin -> 308).
  //
  // Verified against all 120 URLs in production's live sitemap: 117 resolve 200
  // with no hop, 3 redirect once, 0 chains, 1 known gap (see codeine note).
  async redirects() {
    return [
      // The team is one page now, not one page per person. These three URLs are
      // live on production with accumulated equity, so they redirect to the
      // matching anchor rather than 404. Permanent — they are not coming back.
      ...["alicia-joslin", "gus-saadeh", "ashley-hurtado"].map((slug) => ({
        source: `/about/${slug}`,
        destination: `/about/team/#${slug}`,
        permanent: true,
      })),

      // The three 2021-08-26 posts are empty WordPress stubs — title and heading,
      // no post body, two titles truncated mid-phrase. Dropping them from the
      // build was correct; porting them would publish thin duplicate-boilerplate
      // pages onto a YMYL healthcare site. Targets are the ones recommended in
      // MH-18-missing-pages-findings.md §3. NOTE: the dual-diagnosis target
      // inherits D-6 (licensure scope for that page is still unconfirmed).
      {
        source: "/2021/08/26/depression-anxiety-and-substance",
        destination: "/what-we-offer/dual-diagnosis/",
        permanent: true,
      },
      {
        source: "/2021/08/26/marina-harbor-detox",
        destination: "/",
        permanent: true,
      },
      {
        source: "/2021/08/26/the-importance-of-in-person-addiction",
        destination: "/what-we-offer/inpatient-rehab-san-francisco/",
        permanent: true,
      },

      // /2026/07/17/codeine-cough-syrup/ is REAL content published after the
      // archive snapshot, so it is not in archive/raw-html and cannot be ported
      // until D-8 settles the content re-sync. This is a stopgap so an indexed
      // URL with inbound links does not dead-end at cutover — deliberately
      // TEMPORARY (307, not 301) because the post should return at this exact
      // URL once it is recovered. Making it permanent would tell Google the
      // article is gone for good.
      {
        source: "/2026/07/17/codeine-cough-syrup",
        destination: "/blog/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
