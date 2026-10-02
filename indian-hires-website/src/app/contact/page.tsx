import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactFormPanel } from "@/components/contact/ContactFormPanel";
import { Band } from "@/components/shared/Band";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { contact, hasEnquiryForm } from "@/content/contact";
import { routeMetadata } from "@/content/site";

export const metadata = pageMetadata(routeMetadata["/contact"]);

export default function ContactPage() {
  return (
    <>
      {/* The lead mentions the form only when there is one to send. */}
      <PageHero
        eyebrow={contact.eyebrow}
        heading={contact.heading}
        lead={hasEnquiryForm ? contact.lead : contact.leadWithoutForm}
      />

      {/* Details first: on a phone the fastest answers are a call or a WhatsApp message. */}
      <Band as="div" tone="ivory" linen innerClassName="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
        <ContactDetails className="lg:col-span-5" />
        <ContactFormPanel className="lg:col-span-6 lg:col-start-7" />
      </Band>
    </>
  );
}
