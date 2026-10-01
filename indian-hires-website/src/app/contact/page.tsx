import { Metadata } from 'next';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: "Contact IndianHirers — Vadodara & Gujarat",
  description:
    "Get a quote in minutes — call, WhatsApp, or fill out our enquiry form. Serving hotels and caterers with 25 years of trusted service.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="bg-surface-2 min-h-screen">
      <div className="py-16 md:py-24 text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-cream font-bold">Get in Touch</h1>
        <p className="font-sans text-cream/70 mt-4 max-w-xl mx-auto">
          Have an event coming up? Reach out for a quick quote — we usually respond within a few hours.
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <ContactInfo />
        </div>
        <div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
