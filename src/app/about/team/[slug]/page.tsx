import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/Icons";
import { bioDoc, networkLeadership } from "@/lib/content";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * A page for one person — but only for network leadership.
 *
 * The facility team is deliberately NOT routed here: Alicia, Gus and Ashley are
 * rows on /about/team and their old per-person URLs redirect there (see
 * lib/content.ts and next.config.mjs). This route exists because Quadrant Health
 * Group's own people are not staff of this house, are shared across the network,
 * and need a page that can point search engines at the group's original bio
 * rather than compete with it. `dynamicParams = false` keeps everything else a
 * 404, so this cannot quietly resurrect the retired bio pages.
 */
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return networkLeadership().map((m) => ({ slug: m.slug }));
}

/**
 * Bios that belong to the group, not to this site.
 *
 * Dr. Tambini's bio is published on quadranthealthgroup.com and syndicated word
 * for word to all thirteen Quadrant facility sites. Left self-referential, those
 * thirteen canonicals ask Google to index thirteen near-identical pages and it
 * picks a winner for us — usually not the one we want, and the group's original
 * loses to its own copies. Pointing this page at the group's URL consolidates
 * the lot.
 *
 * Keyed by slug so it stays a per-person decision that is visible in one line:
 * anyone without an entry keeps the normal self-referential canonical, and no
 * other page on the site is touched.
 */
const CANONICAL_AT_PARENT: Record<string, string> = {
  "pamela-tambini": "https://www.quadranthealthgroup.com/team/pamela-tambini/",
};

/** The group these people actually work for — used in metadata and JSON-LD. */
const NETWORK = { name: "Quadrant Health Group", url: "https://www.quadranthealthgroup.com/" };

/** Initials fallback for anyone without a headshot yet — never a room photo. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = bioDoc(slug);
  if (!doc) return {};

  const path = `/about/team/${slug}`;
  const person = networkLeadership().find((m) => m.slug === slug);

  return {
    title: doc.title,
    description: doc.metaDescription,
    // The one page on this site whose canonical leaves the domain — see
    // CANONICAL_AT_PARENT above. og:url stays this page, which is where the
    // share actually lands.
    alternates: { canonical: CANONICAL_AT_PARENT[slug] ?? path },
    openGraph: {
      title: doc.title,
      description: doc.metaDescription,
      url: path,
      type: "profile",
      images: [person?.photo ?? site.ogFallback],
    },
  };
}

export default async function NetworkLeaderPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const person = networkLeadership().find((m) => m.slug === slug);
  const doc = bioDoc(slug);
  if (!person || !doc) notFound();

  const path = `/about/team/${slug}`;
  const crumbs = [
    { label: "About", href: "/about" },
    { label: "Our Team", href: "/about/team" },
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    personSchema(doc, path, person.title || null, person.photo, {
      "@type": "Organization",
      name: NETWORK.name,
      url: NETWORK.url,
    }),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Header />
      <main id="main">
        {/* No photo behind the title: the only image here is a portrait, and a
            face cropped to a wide strip under white type is the framing problem
            /about/team was rebuilt to remove. */}
        <PageHero
          title={person.name}
          crumbs={crumbs}
          eyebrow={NETWORK.name}
          lead={`Network-wide medical oversight across ${NETWORK.name} facilities, including ${site.name}.`}
        />

        <section className="section pt-12 sm:pt-16 lg:pt-20">
          <div className="container-x">
            {/* The same portrait-beside-bio row /about/team uses, so a person
                reads the same whether you meet them in the list or here. */}
            <div className="container-article">
              <article className="grid gap-8 sm:grid-cols-[13rem_minmax(0,39rem)] sm:gap-10">
                {/* Capped on phones: below sm the column is full-width, and an
                    unconstrained 4:5 portrait there is an oversized face. */}
                <div className="max-w-[9.5rem] sm:max-w-none">
                  {person.photo ? (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 shadow-soft ring-1 ring-navy-900/5">
                      <Image
                        src={person.photo}
                        alt={`${person.name}, ${person.title}`}
                        fill
                        sizes="(max-width: 640px) 60vw, 208px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      aria-hidden
                      className="grid aspect-[4/5] place-items-center rounded-3xl bg-navy-800 font-display text-4xl font-bold text-gold-400 shadow-soft"
                    >
                      {initials(person.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  {person.title && (
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">
                      {person.title}
                    </p>
                  )}
                  <div className="mt-5 space-y-4">
                    {person.bio.map((para, n) => (
                      <p key={n} className="leading-[1.8] text-navy-900/75">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              <div className="mt-14 border-t border-navy-100 pt-8">
                <Link
                  href="/about/team"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" /> Back to our team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
