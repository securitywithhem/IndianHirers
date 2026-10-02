import { FoundersCta } from "@/components/founders/FoundersCta";
import { FoundersPeople } from "@/components/founders/FoundersPeople";
import { FoundersStory } from "@/components/founders/FoundersStory";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { founders } from "@/content/founders";
import { routeMetadata } from "@/content/site";

export const metadata = pageMetadata(routeMetadata["/founders"]);

export default function FoundersPage() {
  const { hero } = founders;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.title} lead={hero.subtitle} />
      <FoundersStory />
      <FoundersPeople />
      <FoundersCta />
    </>
  );
}
