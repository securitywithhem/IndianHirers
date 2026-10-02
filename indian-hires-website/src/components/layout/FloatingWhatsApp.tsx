import { MessageCircle } from "lucide-react";
import { shell, whatsappMessages } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { AppLink } from "@/components/shared/AppLink";

/**
 * Floating WhatsApp button for tablet and desktop (Docs/UI_UX_V2.md §7.3).
 * Hidden below `md`, where the bottom bar already carries WhatsApp — the two
 * never overlap, and are never both in the accessibility tree.
 *
 * It sits in its own complementary landmark, so no content is outside a
 * landmark. The label is the bottom bar's ("Quick contact"): it is the same
 * shortcut at a different width, and only one of the two is ever rendered.
 *
 * Geometry: 56px circle, 24px from the bottom and right edges, `z-bar`. The
 * 72px above it (bottom-24 right-6) is left free for the quote-basket button
 * on catalogue routes; see src/components/shared/README.md.
 *
 * The ring pulses once every 6s (`transform` + `opacity`); under reduced
 * motion it stays at `opacity-0`. Icon and ring are never light on the green.
 */
export function FloatingWhatsApp() {
  const { floatingWhatsApp, bottomBar } = shell;

  return (
    <aside aria-label={bottomBar.navLabel} className="hidden md:block">
      <AppLink
        href={whatsappUrl(whatsappMessages.general())}
        aria-label={floatingWhatsApp.ariaLabel}
        title={floatingWhatsApp.title}
        className="focus-ring fixed bottom-6 right-6 z-bar isolate grid size-14 place-items-center rounded-full bg-whatsapp text-espresso-900 shadow-lift motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal motion-safe:hover:-translate-y-0.5"
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
