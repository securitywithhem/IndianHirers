import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { formatPhone } from "@/lib/links";
import { CallButton } from "@/components/shared/CallButton";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { contact, hasEnquiryForm } from "@/content/contact";
import { ContactFormLazy } from "./ContactFormLazy";

const HEADING_ID = "contact-form-heading";

export interface ContactFormPanelProps {
  /** Grid placement in the parent. */
  className?: string;
}

/**
 * The enquiry card.
 *
 * While the form cannot send (`hasEnquiryForm` is false: no Web3Forms key) it
 * is not rendered at all, and its JavaScript is never requested: the card
 * says how to enquire instead, with the WhatsApp and call buttons. Nobody is
 * asked to fill in fields that go nowhere.
 */
export function ContactFormPanel({ className }: ContactFormPanelProps) {
  const { form, details } = contact;
  const heading = hasEnquiryForm ? form.heading : form.unavailable.heading;
  const lead = hasEnquiryForm ? form.lead : form.unavailable.body;

  return (
    <section
      aria-labelledby={HEADING_ID}
      className={cn(
        "flex flex-col gap-6 rounded-card border border-hairline/40 bg-card p-6 text-card-foreground shadow-card md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 id={HEADING_ID} className="type-h3 text-heading">
          {heading}
        </h2>
        <p className="type-body max-w-measure text-muted-foreground">{lead}</p>
      </div>

      {hasEnquiryForm ? (
        <ContactFormLazy accessKey={env.web3FormsKey} labelledBy={HEADING_ID} />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton message={details.whatsapp.message} label={details.whatsapp.action} />
          {env.phone === "" ? null : <CallButton label={formatPhone(env.phone)} />}
          {env.phoneAlt === "" ? null : <CallButton phone="alt" label={formatPhone(env.phoneAlt)} />}
        </div>
      )}
    </section>
  );
}
