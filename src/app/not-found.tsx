import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRight, Phone } from "@/components/Icons";

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center bg-navy-950 px-6 text-center">
      <div className="max-w-lg">
        <p className="font-display text-7xl font-extrabold text-gold-400 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">This page has drifted out to sea</h1>
        <p className="mt-4 text-white/70">
          The page you&rsquo;re looking for can&rsquo;t be found — but help is always within reach. Our admissions
          team is available 24/7.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-orange">
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={site.phones.primary.href} className="btn-outline">
            <Phone className="h-4 w-4" /> Call {site.phones.primary.label}
          </a>
        </div>
      </div>
    </main>
  );
}
