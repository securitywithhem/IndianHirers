import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Band } from "@/components/shared/Band";

const CLIENTS = [
  // Hotels
  { name: "Taj Vivanta, Vadodara", logo: "/images/clients/taj-vivanta.png" },
  { name: "Taj Vivanta, Kevadia", logo: "/images/clients/taj-vivanta.png" },
  { name: "Fern, Vadodara", logo: "/images/clients/fern.png" },
  { name: "Fern, Kevadia", logo: "/images/clients/fern.png" },
  { name: "Fortune, Vadodara", logo: "/images/clients/fortune.png" },
  { name: "Fortune, Kevadia", logo: "/images/clients/fortune.png" },
  { name: "Sayaji Hotels", logo: "/images/clients/sayaji.png" },
  { name: "Suba Hotels", logo: "/images/clients/suba.svg" },
  // Restaurants
  { name: "Spice Kraft", logo: "/images/clients/spice-kraft.png" },
  { name: "Secret Kitchen", logo: "/images/clients/secret-kitchen.svg" },
  { name: "22nd Parallel", logo: "/images/clients/22nd-parallel.png" },
  // Caterers
  { name: "Shashi Catering Services", logo: "/images/clients/shashi-catering.png" },
  { name: "Sukhadiya", logo: "/images/clients/sukhadiya.svg" },
  { name: "Patel", logo: "/images/clients/patel.svg" },
  { name: "New Patel", logo: "/images/clients/new-patel.svg" },
  { name: "Shyam", logo: "/images/clients/shyam.svg" },
  { name: "Jay / Pepper Cream", logo: "/images/clients/jay-pepper-cream.svg" },
  { name: "Kuisine", logo: "/images/clients/kuisine.svg" },
];

export function HomeClients() {
  // To make the marquee infinite seamlessly, we duplicate the list
  const TickerList = () => (
    <ul className="flex items-center gap-x-12 md:gap-x-16 shrink-0 animate-marquee hover:[animation-play-state:paused] pr-12 md:pr-16">
      {CLIENTS.map((client, i) => (
        <li key={`${client.name}-${i}`} className="flex items-center shrink-0">
          <div className="relative h-10 w-32 md:h-12 md:w-40 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Band tone="ivory-alt" size="sm" className="border-t border-hairline/20 overflow-hidden" innerClassName="flex flex-col items-center">
      <Reveal>
        <h2 className="type-caption text-kicker mb-10 text-center uppercase tracking-widest">
          Trusted by Industry Leaders
        </h2>
      </Reveal>

      <Reveal className="w-full relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* We need two lists side-by-side to make the loop seamless */}
        <div className="flex min-w-full">
          <TickerList />
          <TickerList />
        </div>
      </Reveal>
    </Band>
  );
}
