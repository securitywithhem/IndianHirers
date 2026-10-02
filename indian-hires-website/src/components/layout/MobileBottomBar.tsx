import { MessageCircle, Phone, Send } from "lucide-react";
import { routes, shell, whatsappMessages } from "@/content/site";
import { telUrl, whatsappUrl } from "@/lib/links";
import { SlideUpAfter } from "@/components/motion";
import { AppLink } from "@/components/shared/AppLink";

const ACTION_CLASS =
  "type-caption focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-md font-medium text-foreground";
const ICON_CLASS = "size-5 text-primary";

/**
 * Call / WhatsApp / Enquire, always within thumb reach below `md`
 * (Docs/UI_UX_V2.md §7.10). Three 56px targets with 8px between them.
 *
 * The bar is 4rem tall plus the bottom safe-area inset; `<body>` reserves
 * exactly that (`layout.tsx`), so the bar never covers the end of the page.
 * It slides up 1.2s after load and is simply present under reduced motion.
 */
export function MobileBottomBar() {
  const { bottomBar } = shell;

  return (
    <SlideUpAfter
      as="nav"
      aria-label={bottomBar.navLabel}
      className="fixed inset-x-0 bottom-0 z-bar grid grid-cols-3 gap-2 bg-background/95 px-2 pb-[calc(0.25rem+env(safe-area-inset-bottom))] pt-1 shadow-bar backdrop-blur-md md:hidden"
    >
      <AppLink href={telUrl()} aria-label={bottomBar.call.ariaLabel} className={ACTION_CLASS}>
        <Phone aria-hidden="true" className={ICON_CLASS} />
        {bottomBar.call.label}
      </AppLink>
      <AppLink
        href={whatsappUrl(whatsappMessages.general())}
        aria-label={bottomBar.whatsapp.ariaLabel}
        className={ACTION_CLASS}
      >
        <MessageCircle aria-hidden="true" className={ICON_CLASS} />
        {bottomBar.whatsapp.label}
      </AppLink>
      <AppLink href={routes.contact} aria-label={bottomBar.enquire.ariaLabel} className={ACTION_CLASS}>
        <Send aria-hidden="true" className={ICON_CLASS} />
        {bottomBar.enquire.label}
      </AppLink>
    </SlideUpAfter>
  );
}
