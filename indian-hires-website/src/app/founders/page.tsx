import { FoundersHero } from "@/components/founders/FoundersHero";
import { StorySection } from "@/components/founders/StorySection";
import { FoundersRow } from "@/components/founders/FoundersRow";

export const metadata = {
  title: "Our Story — 25 Years of IndianHirers",
  description:
    "For 25 years, IndianHirers has been the trusted crockery partner for hotels and caterers. Meet the family behind the business.",
  alternates: { canonical: "/founders" },
};

export default function FoundersPage() {
  return (
    <>
      <FoundersHero />
      <StorySection />
      <FoundersRow />
    </>
  );
}
