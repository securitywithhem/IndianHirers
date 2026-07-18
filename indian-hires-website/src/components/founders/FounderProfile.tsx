import Image from "next/image";

interface FounderProfileProps {
  name: string;
  role: string;
  imageAlt: string;
  quote: string;
}

export function FounderProfile({ name, role, imageAlt, quote }: FounderProfileProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 max-w-sm mx-auto">
      <Image
        src="https://placehold.co/300x300/800020/ffffff.png"
        alt={imageAlt}
        width={160}
        height={160}
        className="rounded-full w-40 h-40 object-cover"
      />
      <div>
        <h3 className="font-heading text-xl text-maroon font-semibold">{name}</h3>
        <p className="font-body text-sm text-maroon uppercase tracking-wide">{role}</p>
      </div>
      <blockquote className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6 italic" data-aos="fade-left">
        &quot;{quote}&quot;
      </blockquote>
    </div>
  );
}
