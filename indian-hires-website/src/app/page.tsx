import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TestimonialsPreview } from "@/components/home/TestimonialsPreview";

export const metadata = {
  title: "Indian Hires | Premium Crockery & Event Rentals",
  description:
    "25 years of trusted crockery, cutlery, and event essentials rental for hotels, caterers, and hosts.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryGrid />
      <TestimonialsPreview />
    </>
  );
}
