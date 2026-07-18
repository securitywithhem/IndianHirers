import { foundersContent } from "@/content/founders";

export function FoundersHero() {
  const { hero } = foundersContent;

  return (
    <section className="bg-maroon text-white py-20 px-4 text-center" data-aos="fade-in">
      <h1 className="font-heading text-4xl md:text-5xl mb-3">{hero.title}</h1>
      <p className="font-body text-white/85 max-w-2xl mx-auto text-lg">{hero.subtitle}</p>
    </section>
  );
}
