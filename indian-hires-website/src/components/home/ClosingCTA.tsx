import { env } from "@/lib/env";
import { homeContent } from "@/content/home";

export function ClosingCTA() {
  return (
    <section className="py-20 md:py-28 bg-maroon text-cream text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl text-gold mb-6">
          {homeContent.closingCta.heading}
        </h2>
        <p className="font-body text-lg md:text-xl text-cream/90 leading-relaxed mb-10">
          {homeContent.closingCta.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-whatsapp text-cream hover:bg-[#1DA851] rounded-full px-8 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp font-medium"
          >
            {homeContent.closingCta.whatsappButton}
          </a>
          <a
            href={`tel:${env.phone}`}
            className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold hover:text-gold-light rounded-full px-8 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold font-medium"
          >
            {homeContent.closingCta.callButton}
          </a>
        </div>
      </div>
    </section>
  );
}
