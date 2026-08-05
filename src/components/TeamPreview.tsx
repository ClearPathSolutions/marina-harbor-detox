import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { teamMembers } from "@/lib/content";

/** Initials fallback for anyone without a headshot — never a room photo. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Compact team strip for /about.
 *
 * The archived page listed the team as bare "Name" + "Job title" text pairs —
 * no photos, no links, and hardcoded, so it silently went stale the moment a
 * third person was published. This reads the same source as /about/team, so the
 * two can never disagree.
 */
export default function TeamPreview() {
  const team = teamMembers();
  if (!team.length) return null;

  return (
    <div className="mt-8">
      <ul className="grid gap-4 sm:grid-cols-2">
        {team.map((m) => (
          <li key={m.slug} className="min-w-0">
            <Link
              href={`/about/team#${m.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-200 hover:bg-sand-50"
            >
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={112}
                  height={112}
                  sizes="56px"
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-gold-400"
                >
                  {initials(m.name)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate font-semibold text-navy-900">{m.name}</span>
                <span className="block truncate text-sm text-navy-900/60">{m.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/about/team"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        Meet the full team <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
