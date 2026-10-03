import { Crown } from "@/components/ornament";

export interface ContactMapProps {
  /** `env.mapEmbedUrl`. The caller renders nothing (and shows the link alone) when it is empty. */
  src: string;
  /** The iframe's title, from `contact.map.title`. */
  title: string;
  /** The address, shown in the box until (or unless) the map paints over it. */
  addressLines: string[];
}

/**
 * The embedded map. The box has a fixed aspect ratio, so the page does not
 * move when the iframe arrives, and the iframe is lazy: it is below the fold
 * on a phone. No entrance animation (motion rule).
 *
 * Under the iframe sits the crown and the address, so a slow, blocked or
 * not-yet-loaded embed shows where the business is rather than an empty box.
 * It repeats the address listed above it, so it is hidden from assistive
 * technology; the map's own link sits under the box.
 */
export function ContactMap({ src, title, addressLines }: ContactMapProps) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline/40 bg-muted">
      <div
        aria-hidden="true"
        className="surface-linen absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <Crown size="lg" className="text-hairline" />
        <span className="rule-double w-12" />
        <p className="type-small text-muted-foreground">
          {addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}
