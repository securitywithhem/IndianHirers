import { FoundersHero } from "@/components/founders/FoundersHero";
import { StorySection } from "@/components/founders/StorySection";
import { FoundersRow } from "@/components/founders/FoundersRow";
import { MilestonesTimeline } from "@/components/founders/MilestonesTimeline";

export const metadata = {
  title: "Our Story",
  description:
    "For 25 years, Indian Hires has been the trusted crockery partner for hotels and caterers. Meet the family behind the business.",
  alternates: { canonical: "/founders" },
};

export default function FoundersPage() {
  return (
    <>
      <FoundersHero />
      <StorySection />
      <FoundersRow />
      <MilestonesTimeline />
    </>
  );
}
