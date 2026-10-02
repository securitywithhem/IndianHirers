export interface ContactMapProps {
  /** `env.mapEmbedUrl`. The caller renders nothing (and shows the link alone) when it is empty. */
  src: string;
  /** The iframe's title, from `contact.map.title`. */
  title: string;
}

/**
 * The embedded map. The box has a fixed aspect ratio, so the page does not
 * move when the iframe arrives, and the iframe is lazy: it is below the fold
 * on a phone. No entrance animation (motion rule).
 */
export function ContactMap({ src, title }: ContactMapProps) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline/40 bg-muted">
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
