import type { TocItem } from "@/lib/toc";
import { ChevronDown } from "./Icons";

/**
 * In-flow jump nav, sitting above the article body.
 *
 * The section list used to live in the sticky right rail. With the rail gone it
 * needs a home in the main column, and a single tall stack of links there would
 * just push the copy down — so it lays out as a two-column grid, which fits ten
 * entries in five rows. The labels are already condensed to nav length by
 * `lib/toc.ts`, so nothing wraps.
 *
 * Collapsed by default on phones (`<details>`, no JS) and always open from `sm`
 * up, where the two columns fit comfortably.
 */
export default function SectionNav({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;

  const list = (
    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.id} className="min-w-0">
          <a
            href={`#${s.id}`}
            className="block truncate border-l-2 border-navy-100 py-1.5 pl-3 text-sm text-navy-900/65 transition-colors hover:border-orange-500 hover:text-orange-600"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="On this page" className="mb-10 rounded-2xl border border-navy-100 bg-sand-50 p-5">
      {/* Phones: collapsible so a 12-entry list cannot bury the opening copy. */}
      <details className="group sm:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900/50">
          On this page
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 border-t border-navy-100 pt-3">{list}</div>
      </details>

      {/* sm and up: always open. */}
      <div className="hidden sm:block">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900/50">
          On this page
        </p>
        {list}
      </div>
    </nav>
  );
}
