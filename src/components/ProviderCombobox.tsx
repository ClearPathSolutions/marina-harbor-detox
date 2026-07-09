"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { INSURANCE_PROVIDERS } from "@/lib/insuranceProviders";
import { Check, ChevronDown } from "./Icons";

type Props = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

/**
 * Accessible, dependency-free insurance-provider autocomplete.
 *
 * It's an editable text <input> — not a <select> — so it *suggests* known payers
 * (filtered as the user types) while still accepting any free-typed plan name.
 * Follows the ARIA combobox (listbox popup) pattern.
 */
export default function ProviderCombobox({
  value,
  onChange,
  name,
  id,
  required,
  placeholder = "Start typing, e.g. Aetna, Cigna, UMR",
  className,
}: Props) {
  const reactId = useId();
  const inputId = id ?? `provider-${reactId}`;
  const listboxId = `${inputId}-listbox`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // index of the keyboard-highlighted option

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Case-insensitive substring match; an empty query shows the full list.
  const options = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return INSURANCE_PROVIDERS as readonly string[];
    return INSURANCE_PROVIDERS.filter((p) => p.toLowerCase().includes(q));
  }, [value]);

  // Reset the highlight whenever the visible option set changes.
  useEffect(() => {
    setActive(-1);
  }, [value, open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || active < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  function select(option: string) {
    onChange(option);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (options.length ? (i + 1) % options.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && options[active]) {
        e.preventDefault();
        select(options[active]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  }

  const activeId = open && active >= 0 ? `${inputId}-opt-${active}` : undefined;

  return (
    <div ref={rootRef} className="relative">
      <input
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        autoComplete="off"
        required={required}
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // Delay the close so an option's onMouseDown selection lands first.
          closeTimer.current = setTimeout(() => setOpen(false), 120);
        }}
      />

      <button
        type="button"
        tabIndex={-1}
        aria-label={open ? "Close provider list" : "Open provider list"}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-navy-900/40 transition-colors hover:text-navy-900/70"
        onMouseDown={(e) => {
          // Prevent the input blur so the toggle isn't immediately reopened/closed twice.
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && options.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-navy-100 bg-white py-1.5 shadow-card"
        >
          {options.map((option, i) => {
            const isActive = i === active;
            const isSelected = option === value;
            return (
              <li
                key={option}
                id={`${inputId}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-orange-500/10 text-orange-700" : "text-navy-900"
                }`}
                // onMouseDown (not onClick) + preventDefault so the click registers
                // before the input's onBlur closes the dropdown.
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(option);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{option}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-orange-600" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
