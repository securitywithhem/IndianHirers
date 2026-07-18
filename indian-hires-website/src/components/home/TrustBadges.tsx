import { homeContent } from "@/content/home";

export function TrustBadges() {
  return (
    <section aria-label="Trust indicators" className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {homeContent.trustBadges.map((badge, index) => (
            <div key={badge.id} className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay={index * 100}>
              <span className="text-4xl font-heading font-bold text-gold-text">{badge.value}</span>
              <span className="font-body text-sm text-text/80 mt-1">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
