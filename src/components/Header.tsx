"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ChevronDown, Clock, Close, Facebook, Instagram, MapPin, Menu, Phone } from "./Icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile drawer
  const [openGroup, setOpenGroup] = useState<string | null>(null); // mobile accordion

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── MH-24: mobile drawer keyboard accessibility ──────────────────────────
  // The closed panel is only translated off-screen, so without `inert` every
  // link inside it stays in the tab order — below xl that is ~45 invisible stops
  // before a keyboard user reaches the page. `inert` removes the whole subtree
  // from focus and the a11y tree; the layer below also gets aria-hidden.
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    // Return focus to the control that opened the drawer.
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // Move focus into the panel when it opens.
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap focus inside the panel.
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeDrawer]);

  return (
    <>
      {/* ── Utility bar ─────────────────────────────────────────── */}
      <div className="hidden bg-navy-950 text-white/80 md:block">
        <div className="container-wide flex h-9 items-center justify-between text-xs">
          <p className="tracking-wide">
            <span className="text-gold-400">Accredited</span> Medical Detox &amp; Residential Rehab · San Francisco, CA
          </p>
          <div className="flex items-center gap-5">
            <span className="text-white/60">Confidential &amp; available 24/7</span>
            <a href={`mailto:${site.email}`} className="link-underline hover:text-orange-300">
              {site.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main header (night-navy so the logo glows) ────────────
          Solid, and no backdrop-blur. The header is sticky in normal flow, not
          overlaid on the hero — so the old `bg-navy-900/70 backdrop-blur-xl`
          was compositing against the white page behind it, which is what
          produced the washed grey band above the photo. Nothing is behind it
          worth blurring; a solid bar matches the utility strip above and keeps
          the white logotype legible. */}
      <header
        className={`sticky top-0 z-50 w-full border-b border-white/10 bg-navy-900 transition-shadow duration-300 ${
          scrolled ? "shadow-lift" : ""
        }`}
      >
        <div className="container-wide flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
            <Image
              src="/images/brand/logo-mark.png"
              alt={site.name}
              width={1828}
              height={1028}
              priority
              sizes="(max-width: 768px) 260px, 380px"
              className={`w-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-all duration-300 ${scrolled ? "h-16 sm:h-20" : "h-20 sm:h-24"}`}
            />
          </Link>

          {/* Desktop nav (shows at xl, where all 7 items + CTAs fit on one line; below that → hamburger) */}
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[min(92vw,26rem)] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="grid grid-cols-1 gap-1 rounded-2xl border border-navy-100 bg-white p-3 shadow-lift sm:grid-cols-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="rounded-xl px-3 py-2 transition-colors hover:bg-sand-50"
                        >
                          <span className="block text-sm font-semibold text-navy-900">{child.label}</span>
                          {child.desc && (
                            <span className="mt-0.5 block text-xs text-navy-900/55">{child.desc}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 xl:flex">
            <a href={site.phones.primary.href} className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-gold-400">
                <Phone className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">
                  Call 24/7
                </span>
                {site.phones.primary.label}
              </span>
            </a>
            <Link href="/admission#verify" className="btn-orange">
              Verify Insurance
            </Link>
          </div>

          {/* Mobile / tablet / small-laptop: call + hamburger (everything below xl) */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={site.phones.primary.href}
              aria-label="Call us now"
              className="grid h-11 w-11 place-items-center rounded-full bg-orange-500 text-white shadow-soft active:scale-95"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {/* Off-canvas layer: fixed to the viewport and clipped, so the closed panel
          (translated off-screen) can never widen the page. Because this layer is a
          sibling of <header> — not an ancestor — it doesn't affect the sticky header. */}
      <div
        className={`fixed inset-0 z-[60] overflow-hidden xl:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
        // React 19 renders `inert=""` for true and omits it for false.
        inert={!open}
      >
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        {/* Panel */}
        <div
          ref={panelRef}
          id="mobile-drawer"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-navy-900 shadow-lift transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Image
            src="/images/brand/logo-mark.png"
            alt={site.name}
            width={1828}
            height={1028}
            className="h-14 w-auto"
          />
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white active:scale-95"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Mobile">
          {nav.map((item) => {
            const isOpen = openGroup === item.label;
            return (
              <div key={item.label} className="border-b border-white/5 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-white active:bg-white/10"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className="pb-2 pl-3">
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-orange-400 active:bg-white/10"
                          >
                            View all {item.label} →
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-white/70 active:bg-white/10"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-[15px] font-semibold text-white active:bg-white/10"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Contact + trust — fills the panel so it never feels empty, and aids conversion */}
          <div className="mt-6 border-t border-white/10 px-3 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Confidential &amp; available 24/7
            </p>
            <a href={site.phones.primary.href} className="mt-3 flex items-center gap-3 text-white active:opacity-80">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold-400">
                <Phone className="h-4 w-4" />
              </span>
              <span className="font-display text-base font-bold">{site.phones.primary.label}</span>
            </a>
            <a
              href={site.address.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-start gap-3 text-sm text-white/70 active:text-white"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                {site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}
              </span>
            </a>
            <p className="mt-3 flex items-center gap-3 text-sm text-white/70">
              <Clock className="h-4 w-4 shrink-0 text-gold-400" /> Open 24 hours · 7 days a week
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors active:bg-orange-500"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors active:bg-orange-500"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <a href={site.phones.primary.href} className="btn-orange w-full">
            <Phone className="h-4 w-4" /> Call {site.phones.primary.label}
          </a>
          <Link href="/admission#verify" onClick={() => setOpen(false)} className="btn-gold w-full">
            Verify Insurance
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
