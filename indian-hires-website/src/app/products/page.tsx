import { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "What We Rent",
  description:
    "Explore our range of crockery, cutlery, and event essentials available for hire — from intimate gatherings to grand banquets.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <main>
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-maroon mb-4">
            What We Rent
          </h1>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything your event needs, delivered with 25 years of trust.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
