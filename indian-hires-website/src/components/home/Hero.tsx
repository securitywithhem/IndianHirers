import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { homeContent } from "@/content/home";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section data-aos="fade-in" data-aos-duration="1000" className="relative h-[90vh] min-h-[500px] w-full flex items-center justify-center text-white -mt-20">
      <Image
        src="https://placehold.co/1920x1080/800020/ffffff.png"
        alt={hero.imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto" data-aos="fade-up">
        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
          {hero.headline}
        </h1>
        <p className="font-body text-lg md:text-xl mb-8 text-white/90">
          {hero.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={hero.ctaPrimary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gold text-white font-medium px-6 py-3 rounded-full hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-5 h-5 mr-2 inline" />
            {hero.ctaPrimary.label}
          </a>
          <a
            href={hero.ctaSecondary.href}
            className="inline-flex items-center justify-center border-2 border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white hover:text-maroon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-maroon"
          >
            <Phone className="w-5 h-5 mr-2 inline" />
            {hero.ctaSecondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
