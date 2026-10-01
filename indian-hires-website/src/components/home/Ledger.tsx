import { homeContent } from "@/content/home";

/**
 * A quiet band of facts directly under the hero. Replaces the old trust badges,
 * which repeated the 25 years already in the headline and listed a GST number
 * as though it were an achievement.
 *
 * Hairline dividers rather than cards — this should read like an engraved
 * ledger line, not three boxes.
 */
export function Ledger() {
  return (
    <section
      aria-label="At a glance"
      className="bg-surface border-y border-border"
    >
      <div className="container mx-auto px-4 md:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 py-14">
          {homeContent.ledger.map((item, i) => (
            <div
              key={item.id}
              className={`text-center px-4 lg:px-6 ${
                i > 0 ? "lg:border-l lg:border-border" : ""
              } ${i % 2 === 1 ? "border-l border-border lg:border-l" : ""}`}
            >
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-heading text-3xl md:text-4xl text-gold-light leading-none">
                  {item.value}
                </span>
                <span className="block font-body text-[11px] md:text-xs uppercase tracking-[0.16em] text-cream/60 mt-3">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
