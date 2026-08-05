import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import CTASection from "@/components/CTASection";
import { ArrowRight } from "@/components/Icons";
import { excerpt, getPosts, leadImage, pathSegments, postDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog Archive — Addiction & Recovery Resources",
  description:
    "Browse the archive of expert articles on addiction, detox, and recovery from the clinical team at Marina Harbor Detox in San Francisco.",
  alternates: { canonical: "/blog/archive" },
};

export default function BlogArchive() {
  const posts = getPosts();
  const [featured, ...rest] = posts;
  const fImg = leadImage(featured);
  const fHref = "/" + pathSegments(featured.url).join("/");

  return (
    <>
      <Header />
      <main id="main">
        {/* Header band */}
        <section className="bg-navy-900">
          <div className="container-x section-sm text-center">
            <span className="eyebrow text-gold-400">From Our Archive</span>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.1]">
              Recovery Article Archive
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Our full library of insights on addiction, detox, and lasting recovery.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300"
            >
              <ArrowRight className="h-4 w-4 -scale-x-100" /> Back to the latest posts
            </Link>
          </div>
        </section>

        {/* Featured post */}
        <section className="section">
          <div className="container-x">
            <Link
              href={fHref}
              className="group grid overflow-hidden rounded-4xl border border-navy-100 bg-white shadow-soft transition-shadow hover:shadow-card lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto">
                {fImg && (
                  <Image src={fImg} alt={featured.h1} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                )}
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">Featured</span>
                <h2 className="mt-3 text-2xl font-bold leading-snug text-navy-900 group-hover:text-navy-700 sm:text-3xl">
                  {featured.h1}
                </h2>
                <p className="mt-2 text-sm text-navy-900/50">{postDate(featured.url)?.label}</p>
                <p className="mt-4 leading-relaxed text-navy-900/70">{excerpt(featured, 220)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-sand-50 section">
          <div className="container-wide">
            {/* Compact horizontal cards on phones (keeps the long list scannable),
                full image cards on sm+ */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {rest.map((post) => {
                const img = leadImage(post);
                const href = "/" + pathSegments(post.url).join("/");
                return (
                  <Link
                    key={post.url}
                    href={href}
                    className="group flex flex-row overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:h-full sm:flex-col sm:rounded-3xl"
                  >
                    <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-navy-100 sm:aspect-[16/10] sm:w-auto">
                      {img && (
                        <Image src={img} alt={post.h1} fill sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-4 sm:justify-start sm:p-6">
                      <p className="text-xs text-navy-900/50">{postDate(post.url)?.label}</p>
                      <h3 className="mt-1.5 text-base font-bold leading-snug text-navy-900 group-hover:text-navy-700 sm:mt-2 sm:text-lg">
                        {post.h1}
                      </h3>
                      <p className="mt-3 hidden flex-1 text-sm leading-relaxed text-navy-900/65 sm:block">{excerpt(post, 120)}</p>
                      <span className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 sm:mt-4">
                        Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
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
