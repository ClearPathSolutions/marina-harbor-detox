import Image from "next/image";
import Link from "next/link";

export type Crumb = { label: string; href: string };

/**
 * The one page-hero band, used by every route that isn't the homepage.
 *
 * It exists because there used to be three of these, and they disagreed on the
 * three things a hero has to get right:
 *
 *  1. ALIGNMENT. Each hero laid its title out against the page container while
 *     the body copy below it sat in a centred reading frame — so on interior
 *     pages the h1 started at x=52 and the first paragraph it introduced
 *     started at x=224. Both now sit in `container-article`, so a title and its
 *     copy share a left edge.
 *
 *  2. LEGIBILITY OVER A PHOTO. The scrim was left-to-right only, at every
 *     breakpoint. That works at desktop, where the copy occupies a left column;
 *     on a phone the copy spans the full width, so the right-hand words of every
 *     line ran onto the bright side of the photo. The homepage hero was fixed
 *     for this (a vertical scrim below `lg`) and the interior heroes were not.
 *     Both scrims live here now.
 *
 *  3. THE NO-PHOTO CASE. Pages with no usable photo rendered a near-invisible
 *     pair of blurred blobs at 40% opacity, which read as an unfinished band.
 *     The fallback is now a deliberate treatment at full strength.
 */
export default function PageHero({
  title,
  crumbs = [],
  eyebrow,
  lead,
  photo,
  align = "left",
  meta,
}: {
  title: string;
  crumbs?: Crumb[];
  eyebrow?: string;
  lead?: string;
  photo?: string | null;
  align?: "left" | "center";
  meta?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <div className="absolute inset-0 -z-10">
        {photo ? (
          <>
            <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover object-center" />
            {/* Below lg the copy is full-width, so darken top-to-bottom across
                the whole band. From lg it returns to a left-weighted scrim,
                which keeps the right of the photo open. */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/75 to-navy-950/85 lg:hidden" />
            <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-r lg:from-navy-950/90 lg:via-navy-950/75 lg:to-navy-950/45" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
            <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl" />
          </>
        )}
      </div>

      <div className="container-x section-sm">
        <div className={`container-article ${centered ? "mx-auto text-center" : ""}`}>
          {crumbs.length > 0 && (
            <nav
              className={`mb-5 flex flex-wrap items-center gap-2 text-xs text-white/70 ${
                centered ? "justify-center" : ""
              }`}
              aria-label="Breadcrumb"
            >
              <Link href="/" className="transition-colors hover:text-orange-300">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center gap-2">
                  <span aria-hidden className="text-white/40">
                    /
                  </span>
                  <Link href={c.href} className="transition-colors hover:text-orange-300">
                    {c.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          {eyebrow && <span className="eyebrow mb-3 text-gold-400">{eyebrow}</span>}

          <h1 className={`h-page text-white ${centered ? "text-balance" : ""}`}>{title}</h1>

          {lead && (
            <p className={`mt-5 leading-relaxed text-white/80 ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
              {lead}
            </p>
          )}

          {meta}
        </div>
      </div>
    </section>
  );
}
