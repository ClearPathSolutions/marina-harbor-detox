/**
 * Staff managed in the Quadrant support portal.
 *
 * Extracted from the old StaffGrid component so /about/team can render portal
 * people in the SAME row layout as the people who come from content JSON. The
 * grid StaffGrid drew was a separate "Our Clinical Team" section that, with one
 * person in a 3-column grid, left two thirds of the row empty and printed an
 * 1,878-character bio as a single unbroken paragraph.
 */

const FEED_ORIGIN =
  process.env.STAFF_FEED_ORIGIN ?? "https://support.quadranthealthgroup.com";

export type FeedPerson = {
  id: string;
  name: string;
  title: string;
  credentials: string | null;
  bio: string | null;
  photoUrl: string | null;
};

/** Loose key so "Dr. Jane Smith, LPC" and "Jane Smith" collapse together. */
export function nameKey(raw: string): string {
  return raw
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
    .replace(/[“”"'’]/g, "")
    .replace(/,.*$/, "")
    .replace(/\s+(sr|jr|ii|iii)\.?$/i, "")
    .replace(/[^a-z ]/gi, "")
    .trim()
    .toLowerCase();
}

/** Fails soft: a portal outage leaves the page as-is rather than breaking it. */
export async function fetchStaff(facility: string): Promise<FeedPerson[]> {
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

/**
 * The portal stores a bio as one string. Split it into paragraphs so it reads
 * as prose rather than a block — on explicit breaks where the author left them,
 * otherwise every few sentences so a 1,800-character bio is not a single slab.
 */
export function bioParagraphs(bio: string | null): string[] {
  if (!bio) return [];
  const explicit = bio.split(/\n\s*\n|\r\n\s*\r\n/).map((s) => s.trim()).filter(Boolean);
  if (explicit.length > 1) return explicit;

  const flat = bio.replace(/\s+/g, " ").trim();
  if (flat.length < 500) return [flat];

  const sentences = flat.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [flat];
  const out: string[] = [];
  let buf = "";
  for (const s of sentences) {
    buf += s;
    // ~400 chars is roughly four lines at this measure — a comfortable para.
    if (buf.length >= 400) {
      out.push(buf.trim());
      buf = "";
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}
