import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { HeritageTeaser } from "@/components/home/HeritageTeaser";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustStrip } from "@/components/home/TrustStrip";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { routeMetadata } from "@/content/site";

export const metadata = pageMetadata(routeMetadata["/"]);

/**
 * Section rhythm (Docs/UI_UX_V2.md §5.2): maroon-950 hero → ivory linen →
 * ivory-100 → the one maroon mid band → ivory → (ivory-100, once there are
 * testimonials) → maroon closing band, which meets the footer.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <FeaturedCollections />
      <HeritageTeaser />
      <HowItWorks />
      <HomeTestimonials />
      <HomeClosingCta />
    </>
  );
}
