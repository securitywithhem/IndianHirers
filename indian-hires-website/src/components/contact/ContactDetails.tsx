import type { ReactNode } from "react";
import { Clock, Mail, MapPin, MapPinned, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { formatPhone, mailtoUrl, mapSearchUrl, telUrl, whatsappUrl } from "@/lib/links";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { contact } from "@/content/contact";
import { ContactMap } from "./ContactMap";

const HEADING_ID = "contact-details-heading";

export interface ContactDetailsProps {
  /** Grid placement in the parent. */
  className?: string;
}

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

/* A valid definition-list group: the `div` holds one `dt` and one `dd` and
 * nothing else. The icon is decoration inside the `dt`, set in the row's left
 * padding. */
function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="relative min-w-0 py-4 pl-[3.75rem]">
      <dt className="type-caption text-muted-foreground">
        <span
          aria-hidden="true"
          className="absolute left-0 top-4 grid size-11 place-items-center rounded-full border border-hairline/40 text-primary"
        >
          <Icon className="size-5" />
        </span>
        {label}
      </dt>
      <dd className="type-body text-foreground">{children}</dd>
    </div>
  );
}

/**
 * Every way to reach the business, in one list: both phones, WhatsApp, email,
 * the address, hours and the towns served. Phone, WhatsApp and email come from
 * `env` through `src/lib/links.ts`; a detail that is not configured is left
 * out rather than shown empty. The address is the brand's single definition.
 */
export function ContactDetails({ className }: ContactDetailsProps) {
  const { details, map } = contact;
  const hasMap = env.mapEmbedUrl !== "";
  const mapLink = (
    <ButtonLink href={mapSearchUrl(map.query)} variant="link">
      {map.openLabel}
    </ButtonLink>
  );

  return (
    <section aria-labelledby={HEADING_ID} className={cn("flex flex-col gap-6", className)}>
      <h2 id={HEADING_ID} className="type-h3 text-heading">
        {contact.detailsHeading}
      </h2>

      <dl className="divide-y divide-hairline/30 border-y border-hairline/30">
        {env.phone === "" ? null : (
          <DetailRow icon={Phone} label={details.phone.label}>
            <ButtonLink href={telUrl(env.phone)} variant="link">
              {formatPhone(env.phone)}
            </ButtonLink>
          </DetailRow>
        )}

        {env.phoneAlt === "" ? null : (
          <DetailRow icon={Phone} label={details.phoneAlt.label}>
            <ButtonLink href={telUrl(env.phoneAlt)} variant="link">
              {formatPhone(env.phoneAlt)}
            </ButtonLink>
          </DetailRow>
        )}

        {env.whatsapp === "" ? null : (
          <DetailRow icon={MessageCircle} label={details.whatsapp.label}>
            <ButtonLink href={whatsappUrl(details.whatsapp.message)} variant="link">
              {details.whatsapp.action}
            </ButtonLink>
          </DetailRow>
        )}

        {env.email === "" ? null : (
          <DetailRow icon={Mail} label={details.email.label}>
            <ButtonLink href={mailtoUrl(env.email)} variant="link" className="break-all">
              {env.email}
            </ButtonLink>
          </DetailRow>
        )}

        <DetailRow icon={MapPin} label={details.address.label}>
          <address className="py-2 not-italic">
            {details.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          {/* With a map below, the link sits under the map instead. */}
          {hasMap ? null : mapLink}
        </DetailRow>

        <DetailRow icon={Clock} label={details.hours.label}>
          <span className="block py-2">{details.hours.value}</span>
        </DetailRow>

        <DetailRow icon={MapPinned} label={details.serviceAreas.label}>
          <span className="block py-2">{details.serviceAreas.value}</span>
        </DetailRow>
      </dl>

      {hasMap ? (
        <div className="flex flex-col gap-2">
          <ContactMap src={env.mapEmbedUrl} title={map.title} addressLines={details.address.lines} />
          {mapLink}
        </div>
      ) : null}
    </section>
  );
}
