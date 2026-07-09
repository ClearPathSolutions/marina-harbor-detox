# WordPress Site Archive

A complete local capture of the old `marinaharbordetox.com` WordPress site, taken
before/during the Next.js migration. Nothing from the original site is lost.

## What's here

### `content/` — structured text (tracked in git, ~2.6 MB)
Every page and post extracted into clean, editable data:

- `content/index.json` — master index of all 120 documents (url, type, word count, image count).
- `content/pages/*.json` + `*.md` — **48 pages** (About, staff bios, all What We Offer / detox
  pages, service areas, insurance pages, FAQ, Admissions, Contact, etc.).
- `content/posts/*.json` + `*.md` — **72 blog posts**, full article text.

Each `.json` has: `url`, `title`, `h1`, `metaDescription`, `canonical`, `ogImage`,
`headings` (document outline), `body` (paragraphs, boilerplate removed), and `images`
(every image the page referenced). The matching `.md` is the same content in readable form.

~96,300 words of body copy captured in total.

### `archive/media/` — full image library (git-ignored, ~156 MB)
**283 unique images** — the highest-resolution version of every image referenced anywhere
on the site — mirrored under the original WordPress folder structure
(`archive/media/<year>/<month>/<file>`). Size-variant duplicates (`-300x200`, `.webp` caches)
were collapsed to the best original.

### `archive/raw-html/` — raw page backups (git-ignored, ~36 MB)
The complete unmodified HTML of all 120 URLs, in case anything needs to be re-parsed later.

### `archive/urls.txt` / `archive/all-images.txt`
The full list of crawled URLs and every image URL discovered.

## Why media & raw-html are git-ignored

They're large and don't need to ship to Vercel. They live on your disk and are safe to
back up separately. If you'd rather commit them too, delete the `/archive/media/` and
`/archive/raw-html/` lines from `.gitignore`.

## Using this to build pages

When building an inner page (e.g. `/about`), read its `content/pages/about.json` for the
copy, and copy the specific images it needs from `archive/media/...` into
`public/images/...` so `next/image` can optimize them. Only images actually used by the
built site belong in `public/` — the rest stay in the archive.
