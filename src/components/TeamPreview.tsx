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
/**
 * How many of the roster this strip shows. The full list is 11 people; all of
 * them here filled four rows and made /about a second copy of /about/team.
 * Six is two clean rows of three, in roster order, with the link below carrying
 * the rest.
 */
const PREVIEW_COUNT = 6;

export default function TeamPreview() {
  const roster = teamMembers();
  if (!roster.length) return null;
  const team = roster.slice(0, PREVIEW_COUNT);
  const remaining = roster.length - team.length;

  return (
    /* Full container width, three across. At the old two-across the third
       person sat alone on a second row with an empty cell beside them. */
    /* No heading of its own: the "Dedicated Team" h2 in about.json already
       introduces this, and adding another produced two near-identical headings
       one after the other. */
    <div className="mt-10">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        {remaining > 0 ? `Meet the full team — ${remaining} more` : "Meet the full team"}{" "}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
