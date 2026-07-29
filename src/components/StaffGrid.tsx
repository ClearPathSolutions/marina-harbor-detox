/**
 * Team members managed in the Quadrant support portal
 * (support.quadranthealthgroup.com/dev/staff).
 *
 * This site's own staff live as prose blocks in content/pages/about.json and are
 * rendered by ContentPage above this section, so this grid only shows people the
 * portal has that the page does not already name. That keeps the existing bio
 * pages (/about/gus-saadeh, /about/alicia-joslin) authoritative.
 *
 * Renders nothing when the portal has no additional people, so /about is
 * unchanged until content lands. Fails soft on a portal outage.
 */

const FEED_ORIGIN =
  process.env.STAFF_FEED_ORIGIN ?? "https://support.quadranthealthgroup.com";

type FeedPerson = {
  id: string;
  name: string;
  title: string;
  credentials: string | null;
  bio: string | null;
  photoUrl: string | null;
};

/** Loose key so "Dr. Jane Smith, LPC" and "Jane Smith" collapse together. */
function nameKey(raw: string): string {
  return raw
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
    .replace(/[“”"'’]/g, "")
    .replace(/,.*$/, "")
    .replace(/\s+(sr|jr|ii|iii)\.?$/i, "")
    .replace(/[^a-z ]/gi, "")
    .trim()
    .toLowerCase();
}

function initials(name: string): string {
  return nameKey(name)
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

async function fetchStaff(facility: string): Promise<FeedPerson[]> {
  try {
    const res = await fetch(
      `${FEED_ORIGIN}/api/public/facilities/${encodeURIComponent(facility)}/staff`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { staff?: FeedPerson[] };
    return data.staff ?? [];
  } catch {
    return [];
  }
}

export default async function StaffGrid({
  facility,
  /** Names already shown on the page, so nobody appears twice. */
  exclude = [],
}: {
  facility: string;
  exclude?: readonly string[];
}) {
  const all = await fetchStaff(facility);
  const already = new Set(exclude.map(nameKey));
  const staff = all.filter((p) => p.name && !already.has(nameKey(p.name)));
  if (staff.length === 0) return null;

  return (
    <section className="bg-sand-50 section">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our Clinical Team</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            The people caring for you
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((person) => (
            <article key={person.id} className="card p-7">
              <div className="flex items-center gap-4">
                {person.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-900/90 font-display text-lg font-bold text-sand-50"
                  >
                    {initials(person.name)}
                  </span>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    {person.name}
                    {person.credentials && (
                      <span className="font-sans text-sm font-normal text-navy-900/60">
                        , {person.credentials}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm font-semibold text-orange-600">
                    {person.title}
                  </p>
                </div>
              </div>
              {person.bio && (
                <p className="mt-4 text-sm leading-relaxed text-navy-900/70">
                  {person.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
