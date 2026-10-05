import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { brand, footerNav, shell, whatsappMessages } from "@/content/site";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { formatPhone, mailtoUrl, telUrl, whatsappUrl } from "@/lib/links";
import { CrownDivider } from "@/components/ornament";
import { AppLink } from "@/components/shared/AppLink";
import { BrandLogo } from "@/components/shared/BrandLogo";

const HEADING_CLASS = "type-h4 text-heading";
const LINK_CLASS =
  "type-small focus-ring inline-flex min-h-11 min-w-11 items-center gap-3 rounded-sm text-foreground transition-colors duration-hover ease-royal hover:text-link";
const ICON_CLASS = "size-4 shrink-0 text-hairline";

/**
 * Site footer (Docs/UI_UX_V2.md §7.11): the deepest maroon band, in three
 * columns from `lg` — the house, quick links, contact. Everything in it comes
 * from `@/content/site` and `env`; a contact detail or a social profile that
 * is not configured is left out rather than replaced by a guess.
 *
 * Its top edge is a gold-gradient hairline with candle light falling from it:
 * the glow is centred on the edge and the band clips its upper half. Text
 * under it is on `maroon-950`, darker than the `maroon-800` the glow's
 * contrast pairs are computed on.
 *
 * The GSTIN appears here and nowhere else, as small print — never as a badge.
 * No entrance animation in the footer (motion README).
 */
export function Footer() {
  const { footer } = shell;
  const contacts = [
    { label: footer.phoneLabel, href: telUrl(env.phone), text: formatPhone(env.phone), note: null, Icon: Phone },
    { label: footer.phoneAltLabel, href: telUrl(env.phoneAlt), text: formatPhone(env.phoneAlt), note: footer.phoneAltName, Icon: Phone },
    {
      label: footer.phoneJayLabel,
      href: telUrl(env.phoneJay),
      text: formatPhone(env.phoneJay),
      note: footer.phoneJayName,
      Icon: Phone,
    },
    { label: footer.emailLabel, href: mailtoUrl(env.email), text: env.email, note: null, Icon: Mail },
  ].filter((contact) => contact.text !== "");
  const offices = [
    { label: footer.officeLabel, lines: brand.address.lines },
    { label: footer.highwayOfficeLabel, lines: brand.highwayOffice.lines },
  ];
  const socials = [
    { label: footer.social.instagram, href: env.instagramUrl, Icon: Instagram },
    { label: footer.social.facebook, href: env.facebookUrl, Icon: Facebook },
  ].filter((social) => social.href !== "");

  return (
    <footer className="theme-dark relative isolate overflow-hidden bg-maroon-950 pt-section-sm">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
      <div
        aria-hidden="true"
        className="candle-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 -translate-y-1/2"
      />

      <div className="shell">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-12">
          <div className="flex flex-col items-start gap-4 md:col-span-2 lg:col-span-1">
            <BrandLogo size="footer" decorative />
            <div className="flex flex-col gap-2">
              <p className="type-h3 text-heading">{brand.name}</p>
              {/* Not `type-eyebrow`: that would uppercase a tagline whose casing is fixed. */}
              <p className="type-small font-medium text-kicker">{brand.tagline}</p>
            </div>
            <p className="type-small max-w-measure-tight text-muted-foreground">{footer.blurb}</p>
            {socials.length > 0 ? (
              <ul aria-label={footer.social.listLabel} className="-ml-3 flex gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <AppLink
                      href={href}
                      aria-label={label}
                      className="focus-ring grid size-11 place-items-center rounded-md text-foreground transition-colors duration-hover ease-royal hover:text-link"
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </AppLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label={footer.navLabel} className="flex flex-col gap-2">
            <h2 className={HEADING_CLASS}>{footer.navHeading}</h2>
            <ul className="flex flex-col gap-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <AppLink href={item.href} className={LINK_CLASS}>
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-2">
            <h2 className={HEADING_CLASS}>{footer.contactHeading}</h2>
            <div className="flex flex-col gap-2">
              <dl className="flex flex-col gap-2">
                {offices.map(({ label, lines }) => (
                  <div key={label} className="flex flex-col gap-1 pb-2 pt-3">
                    <dt className="type-caption text-kicker">{label}</dt>
                    <dd>
                      <address className="type-small not-italic text-muted-foreground">
                        {lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    </dd>
                  </div>
                ))}
                {contacts.map(({ label, href, text, note, Icon }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <AppLink href={href} className={LINK_CLASS}>
                        <Icon aria-hidden="true" className={ICON_CLASS} />
                        {text}
                        {/* Whose number it is, as part of the link's name. */}
                        {note === null ? null : <span className="text-muted-foreground">{note}</span>}
                      </AppLink>
                    </dd>
                  </div>
                ))}
              </dl>
              <AppLink href={whatsappUrl(whatsappMessages.general())} className={cn(LINK_CLASS, "self-start")}>
                <MessageCircle aria-hidden="true" className={ICON_CLASS} />
                {footer.whatsappLabel}
              </AppLink>
            </div>
          </div>
        </div>

        <CrownDivider className="mt-section-sm" />

        {/* Kept clear of the floating WhatsApp button: left-aligned from `md`
            (the button sits over the bottom-right corner), and with room on
            the right below `md`, where it floats above the bottom bar. */}
        <div className="type-caption flex flex-col gap-2 py-6 pr-16 text-muted-foreground md:flex-row md:items-center md:gap-8 md:pr-0">
          <p>{footer.copyright(new Date().getFullYear())}</p>
          <p>
            {footer.gstinLabel} {brand.gstin}
          </p>
        </div>
      </div>
    </footer>
  );
}
