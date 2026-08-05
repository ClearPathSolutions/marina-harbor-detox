import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import { ArrowRight } from "@/components/Icons";
import { teamMembers, type TeamMember } from "@/lib/content";
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
  const known = new Set(fromContent.map((m) => nameKey(m.name)));

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
        <section className="relative isolate overflow-hidden bg-navy-900">
          <div className="absolute inset-0 -z-10 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-900 to-navy-950" />
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
          </div>
          <div className="container-x section-sm">
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/50" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-orange-300">Home</Link>
              <span aria-hidden>/</span>
              <Link href="/about" className="hover:text-orange-300">About</Link>
            </nav>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.1]">
              Our team
            </h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-white/75">
              A small, senior team — you will meet the same faces throughout your stay in our
              six-bed San Francisco facility.
            </p>
          </div>
        </section>

        <section className="section pt-12 sm:pt-16 lg:pt-20">
          <div className="container-x">
            {/* One row per person: a portrait-framed photo beside the bio. Bios
                run from two to five paragraphs, which a card grid cannot balance
                — rows absorb the difference without leaving ragged whitespace. */}
            <div className="mx-auto max-w-[64rem] divide-y divide-navy-100">
              {team.map((m, i) => (
                <article
                  key={m.slug}
                  id={m.slug}
                  className={`grid scroll-mt-28 gap-8 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-10 ${
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

            <div className="mx-auto mt-14 max-w-[64rem] border-t border-navy-100 pt-8">
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
