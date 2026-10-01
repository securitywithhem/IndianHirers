import { foundersContent } from "@/content/founders";
import { FounderProfile } from "./FounderProfile";

export function FoundersRow() {
  return (
    <section className="bg-background py-16 px-4">
      <h2 className="font-heading text-3xl text-cream text-center mb-10">Meet the Family</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {foundersContent.founders.map((founder) => (
          <FounderProfile
            key={founder.id}
            name={founder.name}
            role={founder.role}
            imageAlt={founder.imageAlt}
            quote={founder.quote}
          />
        ))}
      </div>
    </section>
  );
}
