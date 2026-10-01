import { Hero } from "@/components/home/Hero";
import { Ledger } from "@/components/home/Ledger";
import { AboutStrip } from "@/components/home/AboutStrip";
import { HorizontalReveal } from "@/components/home/HorizontalReveal";
import { LogoFinale } from "@/components/home/LogoFinale";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export const metadata = {
  title: "IndianHirers — Crockery & Banquet Rental in Vadodara Since 1977",
  description:
    "Three generations of crockery, glassware and service-ware rental for hotels, banquet halls and caterers. A very small shop in Malad in 1977; serving Vadodara since 2001.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Ledger />
      {/* The short version of the story. The full account lives on /founders —
          it is far stronger read whole than chopped across the homepage. */}
      <AboutStrip />
      <HorizontalReveal />
      <LogoFinale />
      <ClosingCTA />
    </>
  );
}
