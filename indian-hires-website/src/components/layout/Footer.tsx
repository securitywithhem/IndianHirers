import { Mail, MessageCircle, Phone } from "lucide-react";
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
 * Site footer (Docs/UI_UX_V2.md §7.11): the deepest maroon band. Everything
 * in it comes from `@/content/site` and `env`; a contact detail that is not
 * configured is left out rather than replaced by a guess.
 *
 * The GSTIN appears here and nowhere else, as small print — never as a badge.
 * No entrance animation in the footer (motion README).
 */
export function Footer() {
  const { footer } = shell;
  const contacts = [
    { label: footer.phoneLabel, href: telUrl(env.phone), text: formatPhone(env.phone), Icon: Phone },
    { label: footer.phoneAltLabel, href: telUrl(env.phoneAlt), text: formatPhone(env.phoneAlt), Icon: Phone },
    { label: footer.emailLabel, href: mailtoUrl(env.email), text: env.email, Icon: Mail },
  ].filter((contact) => contact.text !== "");

  return (
    <footer className="theme-dark border-t border-hairline/40 bg-maroon-950 pt-section-sm">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1.1fr] lg:gap-8">
          <div className="flex flex-col items-start gap-4">
            <BrandLogo size="footer" />
            <div className="flex flex-col gap-2">
              <p className="type-h3 text-heading">{brand.name}</p>
              {/* Not `type-eyebrow`: that would uppercase a tagline whose casing is fixed. */}
              <p className="type-small font-medium text-kicker">{brand.tagline}</p>
            </div>
            <p className="type-small max-w-measure-tight text-muted-foreground">{footer.blurb}</p>
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
                {contacts.map(({ label, href, text, Icon }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <AppLink href={href} className={LINK_CLASS}>
                        <Icon aria-hidden="true" className={ICON_CLASS} />
                        {text}
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

          <div className="flex flex-col gap-4">
            <h2 className={HEADING_CLASS}>{footer.addressHeading}</h2>
            <address className="type-small not-italic text-muted-foreground">
              {brand.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        <CrownDivider className="mt-section-sm" />

        {/* Left-aligned on purpose: the floating WhatsApp button sits over the
            bottom-right corner from `md` and must not cover the small print. */}
        <div className="type-caption flex flex-col gap-2 py-6 text-muted-foreground md:flex-row md:items-center md:gap-8">
          <p>{footer.copyright(new Date().getFullYear())}</p>
          <p>
            {footer.gstinLabel} {brand.gstin}
          </p>
        </div>
      </div>
    </footer>
  );
}
