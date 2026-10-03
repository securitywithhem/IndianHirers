import Link from "next/link";
import { brand, mainNav, routes, shell, whatsappMessages } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CallButton } from "@/components/shared/CallButton";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { HeaderFrame } from "./HeaderFrame";
import { MobileDrawer } from "./MobileDrawer";
import { NavLink } from "./NavLink";

const DRAWER_ID = "site-menu";

/**
 * Site header (Docs/UI_UX_V2.md §6.6, §7.9). A server component: the three
 * client leaves are `HeaderFrame` (the two visual states), `NavLink` (the
 * current-route mark) and `MobileDrawer` (the menu below `lg`).
 *
 * The header overlays the maroon band that opens every page (see
 * `HeaderFrame`); a page must therefore start with `<PageHero>` or a
 * `<Band underHeader>` in a maroon tone.
 *
 * From `md` the header's one action is the gold "Get a quote" button, which
 * opens WhatsApp with a quote request to fill in (gold fill and maroon-950
 * type in both header states). Below
 * `md` the header carries only the logo and the menu button — Call, WhatsApp
 * and Enquire live in the bottom bar there.
 */
export function Header() {
  const { header } = shell;

  return (
    <HeaderFrame>
      <Link
        href={routes.home}
        aria-label={header.homeLinkLabel}
        className="focus-ring flex min-h-11 items-center gap-3 rounded-sm"
      >
        <BrandLogo size="header" decorative />
        <span className="type-h4 text-heading">{brand.name}</span>
      </Link>

      <nav aria-label={header.primaryNavLabel} className="hidden lg:block">
        <ul className="flex items-center gap-6 xl:gap-10">
          {mainNav.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <ButtonLink
          href={whatsappUrl(whatsappMessages.quoteRequest())}
          variant="gold"
          size="sm"
          className="hidden md:inline-flex"
        >
          {header.quoteCta.label}
        </ButtonLink>

        <MobileDrawer
          id={DRAWER_ID}
          nav={mainNav}
          labels={{
            open: header.openMenuLabel,
            close: header.closeMenuLabel,
            dialog: header.drawerLabel,
            nav: header.drawerNavLabel,
          }}
          brand={
            <span className="flex items-center gap-3">
              <BrandLogo size="header" decorative />
              <span className="type-h4 text-heading">{brand.name}</span>
            </span>
          }
        >
          <ButtonLink href={header.enquireCta.href}>{header.enquireCta.label}</ButtonLink>
          <WhatsAppButton message={whatsappMessages.general()} label={header.drawerWhatsApp} />
          <CallButton label={header.drawerCall} />
        </MobileDrawer>
      </div>
    </HeaderFrame>
  );
}
