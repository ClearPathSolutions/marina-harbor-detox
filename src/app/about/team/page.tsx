import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/Icons";
import { networkLeadership, teamMembers, type TeamMember } from "@/lib/content";
import { bioParagraphs, fetchStaff, nameKey } from "@/lib/staff";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the clinical and operations team at Marina Harbor Detox — the people who run our San Francisco medical detox and residential program.",
  alternates: { canonical: "/about/team" },
  openGraph: {
    title: "Our Team",
    description: "Meet the clinical and operations team at Marina Harbor Detox in San Francisco.",
    url: "/about/team",
    type: "website",
    images: [site.ogFallback],
  },
};

/** Initials fallback for anyone without a headshot yet — never a room photo. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default async function TeamPage() {
  // People whose bios live in content JSON come first and stay authoritative;
  // the portal only contributes anyone it has that they do not already cover.
  // Both render as the same rows — the portal used to get its own grid section,
  // which duplicated these three and looked broken with a single card in it.
  const fromContent = teamMembers();
  const network = networkLeadership();
  // Network leadership counts as "already covered" too: if the portal ever
  // starts returning Dr. Tambini on this facility's feed, she must not also
  // appear as a full bio row — her bio belongs on her own page, which
  // canonicalises to the group's copy.
  const known = new Set([...fromContent, ...network].map((m) => nameKey(m.name)));

  const fromPortal: TeamMember[] = (await fetchStaff("marina-harbor-detox"))
    .filter((p) => p.name && !known.has(nameKey(p.name)))
    .map((p) => ({
      slug: nameKey(p.name).replace(/\s+/g, "-"),
      name: p.credentials ? `${p.name}, ${p.credentials}` : p.name,
      title: p.title ?? "",
      photo: p.photoUrl,
      bio: bioParagraphs(p.bio),
    }));

  const team = [...fromContent, ...fromPortal];

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          title="Our team"
          crumbs={[{ label: "About", href: "/about" }]}
          lead="A small, senior team — you will meet the same faces throughout your stay in our six-bed San Francisco facility."
        />

        <section className="section pt-12 sm:pt-16 lg:pt-20">
          <div className="container-x">
            {/* One row per person: a portrait-framed photo beside the bio. Bios
                run from two to five paragraphs, which a card grid cannot balance
                — rows absorb the difference without leaving ragged whitespace.
                `container-article` is the same left-aligned frame PageHero uses,
                so these rows start on the same edge as the page title. */}
            <div className="container-article divide-y divide-navy-100">
              {team.map((m, i) => (
                <article
                  key={m.slug}
                  id={m.slug}
                  // The bio column is capped at the same ~64-character measure
                  // the article template uses; unconstrained it ran to 776px.
                  className={`grid scroll-mt-28 gap-8 sm:grid-cols-[13rem_minmax(0,39rem)] sm:gap-10 ${
                    i === 0 ? "pb-12" : "py-12"
                  }`}
                >
                  {/* Capped on phones: the column is full-width below sm, and an
                      unconstrained 4:5 portrait there is the same oversized face
                      this layout exists to avoid. */}
                  <div className="max-w-[9.5rem] sm:max-w-none">
                    {m.photo ? (
                      /* 4:5 portrait with object-top — the source headshots are
                         portrait and square, so this frames the face instead of
                         cropping the head off as the old 16:9 band did. */
                      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 shadow-soft ring-1 ring-navy-900/5">
                        <Image
                          src={m.photo}
                          alt={`${m.name}, ${m.title} at ${site.name}`}
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
                        {initials(m.name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{m.name}</h2>
                    {m.title && (
                      <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">
                        {m.title}
                      </p>
                    )}
                    <div className="mt-5 space-y-4">
                      {m.bio.map((para, n) => (
                        <p key={n} className="leading-[1.8] text-navy-900/75">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Network leadership — Quadrant Health Group, not this house.
                Deliberately a card rather than a full bio row: this bio is the
                group's, published word for word on every Quadrant site, so
                reprinting it here would put that syndicated text on a page that
                canonicalises to itself. It lives on her own page instead, which
                points at the group's original. */}
            {network.length > 0 && (
              <div className="container-article mt-14 border-t border-navy-100 pt-12">
                <h2 className="text-2xl font-bold text-navy-900">Network leadership</h2>
                <p className="mt-2 leading-relaxed text-navy-900/70">
                  Medical oversight for this program is provided network-wide across Quadrant Health
                  Group rather than from this facility.
                </p>
                <ul className="mt-6 space-y-4">
                  {network.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/about/team/${m.slug}`}
                        className="flex items-center gap-5 rounded-3xl border border-navy-100 bg-white p-5 transition-colors hover:border-navy-200 hover:bg-sand-50"
                      >
                        {m.photo ? (
                          <span className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand-100 ring-1 ring-navy-900/5">
                            <Image
                              src={m.photo}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover object-top"
                            />
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className="grid h-20 w-16 shrink-0 place-items-center rounded-2xl bg-navy-800 font-display text-lg font-bold text-gold-400"
                          >
                            {initials(m.name)}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-navy-900">{m.name}</span>
                          {m.title && (
                            <span className="block truncate text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">
                              {m.title}
                            </span>
                          )}
                          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                            Read full bio <ArrowRight className="h-4 w-4" />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="container-article mt-14 border-t border-navy-100 pt-8">
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                <ArrowRight className="h-4 w-4 rotate-180" /> Back to About
              </Link>
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
