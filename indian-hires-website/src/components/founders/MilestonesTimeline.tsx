import { foundersContent } from "@/content/founders";

export function MilestonesTimeline() {
  return (
    <section className="py-16 px-4" data-aos="fade-up">
      <h2 className="font-heading text-3xl text-maroon mb-10 text-center">Our Journey</h2>
      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 max-w-5xl mx-auto">
        {foundersContent.milestones.map((milestone, index) => (
          <div 
            key={index} 
            className={`flex-1 relative ${
              index !== foundersContent.milestones.length - 1 
                ? "border-l-2 md:border-l-0 md:border-t-2 border-gold/40 pb-8 md:pb-0" 
                : ""
            }`}
          >
            <div className="relative -left-[2px] md:-left-0 md:-top-[2px] pl-6 md:pl-0 md:pt-6">
              <div className="font-heading text-2xl text-gold-text">{milestone.year}</div>
              <div className="font-body text-sm text-text/80 mt-1">{milestone.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
