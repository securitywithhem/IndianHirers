import { homeContent } from "@/content/home";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="font-heading text-3xl md:text-4xl text-maroon text-center mb-10" data-aos="fade-up">
        What We Rent
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {homeContent.categories.map((category, index) => (
          <div key={category.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <CategoryCard
              name={category.name}
              description={category.description}
              imageAlt={category.imageAlt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
