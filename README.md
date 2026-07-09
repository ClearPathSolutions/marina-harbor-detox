# Marina Harbor Detox — Next.js Website

A modern, fast, mobile-first rebuild of [marinaharbordetox.com](https://marinaharbordetox.com),
migrated off WordPress to **Next.js 15 (App Router)** for deployment on **Vercel**.

## Highlights

- ⚡ **Fast** — fully static homepage, ~120 kB First Load JS, images auto-served as AVIF/WebP.
- 📱 **Mobile-first** — sticky slide-in nav drawer, sticky Call/Text bar, and **zero horizontal
  overflow at every width from 320 px → 1440 px** (verified).
- 🎨 **On-brand** — navy `#13297E` + gold `#D4AF37` + sand `#D2B48C` palette, Montserrat + Poppins fonts.
- 🔍 **SEO-ready** — per-page metadata, Open Graph/Twitter cards, `MedicalBusiness` JSON-LD schema,
  auto-generated `robots.txt` and `sitemap.xml`.
- ♿ **Accessible** — semantic landmarks, focus-visible rings, `prefers-reduced-motion` support,
  and scroll animations that never hide content from no-JS users or crawlers.
- 🖼️ **Real assets** — all logos, accreditation badges, and professional facility photos pulled
  from the original site.

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| Images | `next/image` (AVIF/WebP, responsive `sizes`) |
| Fonts | `next/font/google` (Montserrat, Poppins) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset auto-detects **Next.js**. No env vars needed. Click **Deploy**.
4. Add the custom domain `marinaharbordetox.com` under **Settings → Domains** and point DNS.

Or from the CLI:

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

## Project structure

```
public/images/
  brand/           logo
  facility/        8 facility photos
  backgrounds/     hero / section imagery
  accreditation/   Joint Commission, DHCS, LegitScript, NAMI
src/
  app/
    layout.tsx     fonts, metadata, JSON-LD schema
    page.tsx       homepage (all sections)
    not-found.tsx  branded 404
    robots.ts      /robots.txt
    sitemap.ts     /sitemap.xml
    icon.png       favicon (auto-detected)
  components/
    Header.tsx         sticky nav + mobile drawer
    Footer.tsx
    MobileCTABar.tsx   sticky call/text bar (mobile)
    FacilityGallery.tsx  photo grid + lightbox
    Reveal.tsx         no-JS-safe scroll animations
    Icons.tsx          inline SVG icon set
  lib/
    site.ts        ALL site content, nav, contact info — edit copy here
```

## Editing content

Nearly all text, navigation, phone numbers, service areas, programs, and blog
previews live in **`src/lib/site.ts`**. Edit that one file to update copy across the site.

## Full site archive

The entire old WordPress site is captured locally so nothing is lost — all **48 pages** and
**72 blog posts** as structured JSON + Markdown in [`content/`](content/), and the complete
**283-image media library** plus raw HTML backups in `archive/`. See
[`content/ARCHIVE.md`](content/ARCHIVE.md) for details.

## What's next

The homepage is complete. The navigation links to inner pages (`/about`, `/what-we-offer/*`,
service-area pages, `/blog`, etc.) that can be built out next using the same components and
design system — the copy and images for each already live in `content/` and `archive/`.
Until a page is built, its route gracefully shows the branded 404.
