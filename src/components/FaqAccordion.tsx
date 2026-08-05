import type { Block } from "@/lib/content";
import { ChevronDown } from "./Icons";

export type FaqItem = { id: string; q: string; a: string[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "question";

/**
 * Pair the FAQ's heading/paragraph run into question → answer items.
 *
 * The page is 42 clean `h3` question + `p` answer pairs under a single `h2`.
 * Rendered as flat prose that was 11,053px — 12.3 screens desktop, 19.3 on a
 * phone — and because every question sits at h3 under one h2, the section
 * splitter produced exactly ONE section, so both "On this page" navs
 * self-hid (they need 3+). The longest page on the site had no way to navigate
 * it. Answers stay in the DOM inside <details>, so this costs nothing in
 * crawlability and closes MH-17 step 4.
 */
export function buildFaq(blocks: Block[]): FaqItem[] {
  const items: FaqItem[] = [];
  const seen = new Set<string>();

  for (const b of blocks) {
    if (b.tag === "h3" || b.tag === "h4") {
      let id = slugify(b.text);
      let n = 2;
      while (seen.has(id)) id = `${slugify(b.text)}-${n++}`;
      seen.add(id);
      items.push({ id, q: b.text.trim(), a: [] });
    } else if ((b.tag === "p" || b.tag === "li") && items.length) {
      const t = b.text.trim();
      if (t) items[items.length - 1].a.push(t);
    }
  }

  // A question with no answer is the same broken promise as a trailing heading.
  return items.filter((i) => i.a.length > 0);
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <div className="divide-y divide-navy-100 border-y border-navy-100">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group scroll-mt-28">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left">
            <span className="font-display text-lg font-semibold leading-snug text-navy-900 transition-colors group-hover:text-orange-600">
              {item.q}
            </span>
            <span
              aria-hidden
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-navy-100 bg-sand-50 text-navy-700 transition-all group-hover:border-orange-300 group-hover:text-orange-600 group-open:rotate-180"
            >
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <div className="pb-6 pr-10">
            {item.a.map((para, i) => (
              <p key={i} className={`break-words leading-[1.8] text-navy-900/75 ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
