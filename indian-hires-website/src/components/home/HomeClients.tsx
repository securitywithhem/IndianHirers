import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Marquee } from "@/components/motion/Marquee";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { home } from "@/content/home";

const HEADING_ID = "home-clients-heading";

/**
 * The hotels the family serves, as a full-bleed slider of their logos. Each
 * logo is `alt=""` because the name is printed under it, which is also what
 * tells the two Taj Vivanta, Fern and Fortune entries apart.
 *
 * Nine tiles of 224–256px make one set at most 2304px wide, so the slider stops
 * growing there (144rem) and never shows a gap. Gold hairlines separate the
 * tiles, as in the trust strip. Under reduced motion the tiles wrap, still and
 * centred.
 */
export function HomeClients() {
  const { clients } = home;

  return (
    <Band tone="ivory-alt" aria-labelledby={HEADING_ID} innerClassName="max-w-none px-0">
      <Reveal className="shell flex flex-col items-center">
        <SectionHeading as="h2" id={HEADING_ID} align="center" heading={clients.heading} />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <Marquee maxWidthClass="max-w-[144rem]" pauseLabel={clients.pauseLabel} playLabel={clients.playLabel}>
          <ul role="list" className="flex motion-reduce:flex-wrap motion-reduce:justify-center">
            {clients.hotels.map((hotel) => (
              <li
                key={hotel.name}
                className="flex w-56 shrink-0 flex-col items-center gap-4 border-l border-hairline/40 px-6 text-center motion-reduce:w-1/2 motion-reduce:border-l-0 motion-reduce:px-3 motion-reduce:py-4 md:w-64 motion-reduce:md:w-64"
              >
                <Image
                  src={hotel.logo.src}
                  alt=""
                  aria-hidden="true"
                  width={hotel.logo.width}
                  height={hotel.logo.height}
                  sizes="(min-width: 768px) 208px, 176px"
                  className="h-20 w-full object-contain"
                />
                <p className="type-small min-h-[3.1em] text-balance text-muted-foreground">{hotel.name}</p>
              </li>
            ))}
          </ul>
        </Marquee>
      </Reveal>
    </Band>
  );
}
