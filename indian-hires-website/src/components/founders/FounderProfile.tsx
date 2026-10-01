interface FounderProfileProps {
  name: string;
  role: string;
  imageAlt: string;
  quote: string;
}

/**
 * A gilt nameplate, not a portrait frame.
 *
 * This previously rendered `https://placehold.co/300x300` — a grey stub — for
 * Nikesh and for his father. There are no photographs of them yet, and a
 * placeholder avatar on the page that carries the family's name reads worse
 * than no image at all. Until real portraits exist, the monogram and the
 * engraved rule do the work.
 *
 * When photographs arrive: add an `image` field to `foundersContent.founders`
 * in src/content/founders.ts and render it above the monogram here.
 */
export function FounderProfile({ name, role, quote }: FounderProfileProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <figure className="relative max-w-sm mx-auto text-center rounded-2xl border border-gold/30 bg-surface-2 px-8 py-10">
      {/* Gilt corner rules — an engraved plate rather than a card. */}
      <span
        aria-hidden
        className="absolute left-4 top-4 h-6 w-6 border-l border-t border-gold/50 rounded-tl-md"
      />
      <span
        aria-hidden
        className="absolute right-4 bottom-4 h-6 w-6 border-r border-b border-gold/50 rounded-br-md"
      />

      <span
        aria-hidden
        className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold/50 font-heading text-xl text-gold"
      >
        {initials}
      </span>

      <figcaption className="mt-6">
        <h3 className="font-heading text-xl text-cream">{name}</h3>
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-gold mt-2">
          {role}
        </p>
      </figcaption>

      <span
        aria-hidden
        className="block h-px w-12 mx-auto my-6 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <blockquote className="font-body text-sm text-cream/75 leading-relaxed italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </figure>
  );
}
