import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import Reveal from "@/components/Reveal";
import Reviews from "@/components/Reviews";
import FacilityGallery from "@/components/FacilityGallery";
import { ArrowRight, Check, Clock, iconMap, Message, Phone, Shield, Sparkle } from "@/components/Icons";
import {
  accreditations,
  amenities,
  blogAuthor,
  insuranceLogos,
  programs,
  serviceAreas,
  site,
  therapies,
} from "@/lib/site";
import { homepagePosts } from "@/lib/content";

// Blog authors have no headshot on the source site, so we render a tidy monogram
// (e.g. "Kris Brace, CADC II" → "KB") instead of a broken image or fake stock photo.
function initials(name: string) {
  return name
    .split(",")[0]
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const stats = [
  { value: "15+", label: "Years of clinical expertise" },
  { value: "24/7", label: "Medical supervision" },
  { value: "6", label: "Private, boutique beds" },
  { value: "1:1", label: "Personalized care plans" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/photos/aerial-bridge-04.jpg"
              alt="Aerial view over the Marina District and marina toward the Golden Gate Bridge"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* The scrim has to follow the text, and the text changes shape:
                on phones the copy spans the full column, so a left-to-right
                gradient leaves the right half of every line sitting on bright
                sky and grass (measured 1.86:1 on the h1). Below lg we darken
                top-to-bottom across the full width; from lg the copy is back in
                a left column, so we return to the directional scrim that keeps
                the bridge and bay clean. */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950/80 lg:hidden" />
            <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/45 lg:to-transparent" />
            <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-t lg:from-navy-950/55 lg:via-transparent lg:to-transparent" />
          </div>

          <div className="container-wide flex min-h-[76vh] items-center py-16 sm:min-h-[82vh] sm:py-20">
            <div className="max-w-xl [text-shadow:0_2px_16px_rgba(7,15,32,0.65)]">
              <Reveal>
                <span className="eyebrow !text-orange-200">
                  <Sparkle className="h-4 w-4" /> Welcome to Marina Harbor Detox
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-white sm:text-5xl sm:leading-[1.08]">
                  Premier Drug &amp; Alcohol Rehab in{" "}
                  <span className="text-orange-400">San Francisco</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/90 sm:text-lg">
                  Compassionate, accredited medical detox and residential rehab from experienced clinicians with
                  over 15 years of expertise — in a private, luxury setting designed for lasting recovery.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-7 flex flex-col gap-3 [text-shadow:none] sm:flex-row sm:items-center">
                  <a href={site.phones.primary.href} className="btn-orange text-base">
                    <Phone className="h-5 w-5" /> Get Help Now
                  </a>
                  <Link href="/what-we-offer" className="btn-outline text-base">
                    Our Programs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
                  <span className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-300" /> Joint Commission Accredited
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-300" /> Available 24/7
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-300" /> Most Insurance Accepted
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ INTRO + STATS ═════════════════════════════════════ */}
        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <span className="eyebrow">San Francisco Medical Detox &amp; Rehab</span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                Safe, private addiction treatment in the Bay Area
              </h2>
              <p className="mt-5 leading-relaxed text-navy-900/70">
                Marina Harbor is San Francisco&rsquo;s premier addiction treatment center, offering specialized
                medical detox and residential programs on Marina Boulevard. We use advanced clinical protocols to
                treat addictions to alcohol, opiates, benzodiazepines, cocaine, methamphetamines, heroin, fentanyl,
                and more.
              </p>
              <p className="mt-4 leading-relaxed text-navy-900/70">
                Our integrated dual-diagnosis approach stabilizes the body while addressing underlying mental health
                challenges. Our intimate, 6-bed setting offers the privacy and professional care necessary to build a
                resilient foundation for long-term sobriety.
              </p>
              <Link href="/about" className="btn-navy mt-8">
                Discover Who We Are <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-3xl border border-navy-100 bg-sand-50 p-6 text-center shadow-soft"
                  >
                    <div className="font-display text-4xl font-extrabold text-navy-700 sm:text-5xl">{s.value}</div>
                    <div className="mt-2 text-sm text-navy-900/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ ACCREDITATION STRIP ═══════════════════════════════ */}
        <section className="border-y border-navy-100 bg-sand-50">
          <div className="container-x section-sm">
            <Reveal className="text-center">
              <span className="eyebrow">Certified for Clinical Excellence</span>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-900/60">
                Marina Harbor Detox proudly maintains accreditation and licensure from leading healthcare and
                regulatory organizations.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
              {accreditations.map((a) => (
                <Image
                  key={a.name}
                  src={a.src}
                  alt={a.name}
                  width={a.w}
                  height={a.h}
                  sizes="(max-width: 640px) 150px, 180px"
                  className="h-14 w-auto object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-16"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROGRAMS ══════════════════════════════════════════ */}
        <section id="programs" className="section">
          <div className="container-x">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Comprehensive Care</span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                Addiction treatment programs in San Francisco
              </h2>
              <p className="mt-5 leading-relaxed text-navy-900/70">
                A seamless transition from initial stabilization to long-term wellness — a full spectrum of
                evidence-based services within a private, boutique environment.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p, i) => {
                const Icon = iconMap[p.icon];
                return (
                  <Reveal key={p.title} delay={i * 90}>
                    <Link
                      href={p.href}
                      className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-card"
                    >
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-white transition-colors group-hover:bg-orange-500 group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-navy-900">{p.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/65">{p.body}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ RECOVERY ADVOCATE BAND ════════════════════════════ */}
        <section className="relative isolate overflow-hidden bg-navy-950">
          <div className="absolute inset-0 -z-10">
            <Image src="/images/photos/aerial-bridge-04.jpg" alt="" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-900/45" />
          </div>
          <div className="container-x section-sm flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <Reveal className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Speak with a recovery advocate today</h2>
              <p className="mt-3 text-white/75">
                If you or a loved one are ready to take the first step, our compassionate admissions team is available
                24/7 to answer your questions and verify your insurance.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a href={site.phones.primary.href} className="btn-orange whitespace-nowrap">
                <Phone className="h-4 w-4" /> Call {site.phones.primary.label}
              </a>
              <Link href="/admission#verify" className="btn-outline whitespace-nowrap">
                Verify Your Insurance
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ══ THERAPIES & AMENITIES ═════════════════════════════ */}
        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            <Reveal className="order-2 lg:order-1 lg:h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-4xl shadow-card lg:aspect-auto lg:h-full">
                <Image
                  src="/images/photos/lounge-sofa.jpg"
                  alt="Private living lounge with Marina District views at Marina Harbor Detox"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="order-1 lg:order-2">
              <Reveal>
                <span className="eyebrow">Treatment That Cares About Outcomes</span>
                <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                  Evidence-based therapies &amp; luxury amenities
                </h2>
                <p className="mt-5 leading-relaxed text-navy-900/70">
                  True recovery requires a balance of intensive clinical work and a supportive, comfortable
                  environment. Our facility is designed to reduce the stressors of early sobriety so you can focus
                  entirely on your well-being.
                </p>
              </Reveal>

              <Reveal delay={100} className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-navy-700">Therapies</h3>
                  <ul className="mt-4 space-y-3">
                    {therapies.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-sm text-navy-900/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-navy-700">Amenities</h3>
                  <ul className="mt-4 space-y-3">
                    {amenities.map((a) => (
                      <li key={a} className="flex items-start gap-3 text-sm text-navy-900/75">
                        <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ FACILITY GALLERY ══════════════════════════════════ */}
        <section className="bg-sand-50 section">
          <div className="container-wide">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Explore Our Space</span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                Tour our San Francisco facility
              </h2>
              <p className="mt-5 leading-relaxed text-navy-900/70">
                A sophisticated, 6-bed boutique setting in San Francisco&rsquo;s iconic Marina District, where healing
                begins with peace and privacy.
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <FacilityGallery />
            </Reveal>
            <div className="mt-10 text-center">
              <Link href="/facility" className="btn-navy">
                Learn More About Our Facility <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ INSURANCE ═════════════════════════════════════════ */}
        <section className="section">
          <div className="container-x">
            <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-card">
              <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-12">
                <Reveal>
                  <span className="eyebrow text-gold-400">Insurance &amp; Admissions</span>
                  <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">We work with most insurances</h2>
                  <p className="mt-5 leading-relaxed text-white/75">
                    Financial barriers should never stand in the way of life-saving treatment. We work with a vast
                    network of providers and are experienced in maximizing benefits for residential treatment and
                    medical detox services.
                  </p>
                  <Link href="/admission#verify" className="btn-orange mt-8">
                    Verify Your Insurance <ArrowRight className="h-4 w-4" />
                  </Link>
                </Reveal>
                <Reveal delay={120}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {insuranceLogos.map((logo) => (
                      <div
                        key={logo.name}
                        className="grid h-16 place-items-center rounded-2xl border border-white/10 bg-white/5 px-4"
                      >
                        <Image
                          src={logo.src}
                          alt={`${logo.name} insurance accepted`}
                          width={logo.w}
                          height={logo.h}
                          sizes="170px"
                          className="max-h-8 w-auto object-contain opacity-90 [filter:brightness(0)_invert(1)]"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs text-white/50 sm:text-left">
                    …and many more. Coverage varies by plan.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SERVICE AREAS ═════════════════════════════════════ */}
        <section className="bg-sand-50 section">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            <Reveal>
              <span className="eyebrow">Areas We Serve</span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                Serving San Francisco, the Bay Area &amp; beyond
              </h2>
              <p className="mt-5 leading-relaxed text-navy-900/70">
                We provide specialized withdrawal management and residential support across Northern California. For
                those traveling from out of the area, our full-concierge team coordinates private, secure transport
                from SFO, OAK, and SJC airports directly to our doors.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-800"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-4xl shadow-card lg:aspect-auto lg:h-full">
                <Image
                  src="/images/photos/aerial-bridge-01.jpg"
                  alt="The Golden Gate Bridge seen across the marina from Marina Harbor Detox"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ REVIEWS (Trustindex Google reviews) ═══════════════ */}
        <Reviews />

        {/* ══ BLOG ══════════════════════════════════════════════ */}
        <section className="section">
          <div className="container-x">
            <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="eyebrow">The Latest</span>
                <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                  Recovery news &amp; resources
                </h2>
                <p className="mt-4 text-navy-900/70">
                  Stay up to date with all things addiction &amp; recovery.
                </p>
              </div>
              <Link href="/blog" className="btn-outline-navy shrink-0">
                View All Articles <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {homepagePosts(3).map((post, i) => (
                <Reveal key={post.href} delay={i * 90}>
                  <Link
                    href={post.href}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image ?? site.ogFallback}
                        alt={post.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {post.category && (
                        <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-800 text-[11px] font-bold text-gold-400">
                          {initials(blogAuthor)}
                        </span>
                        <div className="text-xs leading-tight text-navy-900/60">
                          <span className="block font-semibold text-navy-900/80">{blogAuthor}</span>
                          {post.date}
                        </div>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-700">
                        {post.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/65">{post.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/photos/aerial-marina-01.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/55 to-navy-950/80" />
          </div>
          <div className="container-x section text-center">
            <Reveal className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.1]">
                Escape the chaos of addiction today
              </h2>
              <p className="mt-6 leading-relaxed text-white/80">
                No two clients are alike. We offer each person a unique experience that fits their individual needs —
                a safe, comfortable place to heal the core issues behind substance use. Our admissions coordinators
                are standing by day and night to help you find your personal solution.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={site.phones.primary.href} className="btn-orange text-base">
                  <Phone className="h-5 w-5" /> Call {site.phones.primary.label}
                </a>
                <a href={site.sms} className="btn-outline text-base">
                  <Message className="h-5 w-5" /> Text Us Now
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCTABar />
    </>
  );
}
