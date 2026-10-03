import { MessageCircle } from "lucide-react";
import { shell, whatsappMessages } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { AppLink } from "@/components/shared/AppLink";

/**
 * Floating WhatsApp button, on every width (PRD FR7; Docs/UI_UX_V2.md §7.3).
 *
 * It sits in its own complementary landmark, so no content is outside a
 * landmark; the landmark has its own label, distinct from the bottom bar's.
 *
 * Geometry: a 56px circle at `z-bar`.
 * - below `md`: 16px from the right edge and 16px above the bottom bar
 *   (the bar is 4rem + the safe-area inset tall), so the two never overlap;
 * - from `md`: 24px from the bottom and right edges.
 * Below `md` there is never more than one round button: once the quote-list
 * button is on the page (a catalogue route, with something in the list) this
 * one is hidden and that one takes its slot — its sheet sends the list on
 * WhatsApp, and the bar still carries WhatsApp. That is a `:has()` selector;
 * a browser without it keeps both, the quote-list button one slot higher.
 * From `md` the quote-list button sits in the slot above this one. See
 * src/components/shared/README.md.
 *
 * The ring pulses once every 6s (`transform` + `opacity`); under reduced
 * motion it stays at `opacity-0`. Icon and ring are never light on the green.
 */
export function FloatingWhatsApp() {
  const { floatingWhatsApp } = shell;

  return (
    <aside aria-label={floatingWhatsApp.regionLabel}>
      <AppLink
        href={whatsappUrl(whatsappMessages.general())}
        aria-label={floatingWhatsApp.ariaLabel}
        title={floatingWhatsApp.title}
        className="focus-ring fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-bar isolate grid size-14 place-items-center rounded-full bg-whatsapp text-espresso-900 shadow-lift motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal motion-safe:hover:-translate-y-0.5 max-md:[body:has([data-quote-button])_&]:hidden md:bottom-6 md:right-6"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-whatsapp opacity-0 motion-safe:animate-whatsapp-pulse"
        />
        <MessageCircle aria-hidden="true" className="size-7" />
      </AppLink>
    </aside>
  );
}
