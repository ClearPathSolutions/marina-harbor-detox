import { site } from "@/lib/site";

/**
 * Clarion Labs integration — loaded site-wide from the root layout.
 *
 *  1. widget.v1.js        → floating chat widget
 *  2. forms-capture.v1.js → captures submissions from any
 *                           `<form data-clarion-form="…">` (the insurance
 *                           verification form in components/LeadForm.tsx).
 *
 * THEMING
 * -------
 * Confirmed against widget.v1.js: the widget renders in the LIGHT DOM and reads
 * theming from `data-*` attributes on its <script> tag (with `--clarion-chat-*`
 * CSS-var fallbacks). Its default accent is teal (#0d9488); we override it to
 * the site's Golden-Gate orange. `data-color` sets `--clarion-accent` (header,
 * buttons, Send, focus borders) and auto-derives the soft focus-ring tint.
 *
 * Recognized attributes: data-color, data-position ("left"|"right"),
 * data-font, data-header-text, data-title.
 */
const BRAND = {
  color: "#c8452e", // Golden Gate orange (orange-500) — widget accent
  headerText: "#ffffff",
  title: "Chat with us",
  position: "right", // keep chat bottom-right; the Call button now lives bottom-left
  font: "var(--font-poppins), system-ui, sans-serif",
} as const;

export default function Clarion() {
  const { siteKey, api } = site.widgets.clarion;

  return (
    <>
      {/* Belt-and-suspenders: the same accent via CSS vars, in case the script
          attributes are ever stripped. The widget prefers data-* over these. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{
  --clarion-chat-color: ${BRAND.color};
  --clarion-chat-header-text: ${BRAND.headerText};
  --clarion-chat-font: ${BRAND.font};
  --clarion-chat-position: ${BRAND.position};
}
/* The launcher parks itself at bottom:20px, which on phones lands directly on
   top of MobileCTABar (the fixed Call/Text bar, 65px tall, lg:hidden) and
   covers the "Text Us" button. Lift it clear below lg. !important because the
   widget's own stylesheet loads after this one. */
@media (max-width: 1023.98px){
  .clarion-chat{ bottom: calc(5.5rem + env(safe-area-inset-bottom)) !important; }
}
/* While the cookie banner is up, the launcher has nowhere to go on a phone:
   the banner occupies 4.75rem to ~17rem from the bottom and the CTA bar owns
   everything below it, so the lift above dropped the launcher inside the
   banner. The banner is a first-load, one-time decision — let it own that
   moment and bring the launcher back the instant the choice is made.
   html[data-consent-banner] is set by components/CookieConsent.tsx. */
@media (max-width: 1023.98px){
  html[data-consent-banner] .clarion-chat{ display: none !important; }
}`,
        }}
      />

      {/* Native <script> tags (not next/script) so every data-* theming
          attribute is preserved verbatim for the widget to read. */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src="https://www.clarionlabs.ai/widget.v1.js"
        async
        data-site-key={siteKey}
        data-api={api}
        data-color={BRAND.color}
        data-header-text={BRAND.headerText}
        data-title={BRAND.title}
        data-position={BRAND.position}
        data-font={BRAND.font}
      />

      {/* Insurance-verification form capture */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src="https://www.clarionlabs.ai/forms-capture.v1.js"
        async
        data-site-key={siteKey}
        data-api={api}
      />
    </>
  );
}
