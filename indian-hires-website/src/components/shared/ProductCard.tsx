import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/links";
import { CrownPlaceholder } from "@/components/ornament";
import { buttonVariants } from "@/components/ui/button-variants";
import { ChipTag } from "@/components/ui/chip";
import { AppLink } from "./AppLink";

export type ProductCardHeading = "h2" | "h3" | "h4";

/** The fields of a content-file image entry that the card needs (`ProductImage` fits). */
export interface ProductCardImage {
  src: string;
  alt: string;
  blurDataURL: string;
}

export interface ProductCardAsk {
  /** Visible label of the WhatsApp action, from a content file. */
  label: string;
  /** Names the piece for a screen reader, so a list of these links is not a list of identical labels. */
  ariaLabel: string;
  /** Prefill text, already built with `whatsappMessages.*()` from `@/content/site`. */
  message: string;
}

export interface ProductCardProps {
  /** The design's name. */
  name: string;
  /** Null → the crown placeholder; never a grey box. */
  image: ProductCardImage | null;
  /** Confirmed finishes only, as display labels. An empty list renders nothing. */
  finishes: string[];
  /** Names the finish list for a screen reader. */
  finishesLabel: string;
  ask: ProductCardAsk;
  /** Tag of the title; it follows the page outline. The type role stays `type-h4`. */
  headingLevel: ProductCardHeading;
  /** Must match the real rendered width of the photograph at each breakpoint. */
  sizes: string;
  /** Only for the single LCP image of a route. Default false. */
  priority?: boolean;
  className?: string;
}

/**
 * A design on its own card (Docs/UI_UX_V2.md §7.4): photograph, name, finish
 * tags and one action — ask for rates on WhatsApp. No price, ever.
 *
 * For a piece shown outside the catalogue (a home-page feature, a related
 * design). Inside `/collections` use `collections/ItemCard`, which adds the
 * item drawer and the quote list.
 *
 * The card lifts on hover and focus (`card-royal`) and the photograph zooms to
 * 1.04 over 700ms; both are off under reduced motion. The `<article>` is not
 * `overflow-hidden` — that would clip the lift shadow; the image wrapper clips.
 */
export function ProductCard({
  name,
  image,
  finishes,
  finishesLabel,
  ask,
  headingLevel,
  sizes,
  priority = false,
  className,
}: ProductCardProps) {
  const Heading = headingLevel;

  return (
    <article
      className={cn(
        "card-royal group flex h-full flex-col rounded-card border border-hairline/40 bg-card text-card-foreground shadow-card",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            className="object-cover motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104"
          />
        ) : (
          <CrownPlaceholder aspect="1/1" className="h-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <Heading className="type-h4 text-heading">{name}</Heading>
        {finishes.length > 0 ? (
          <ul aria-label={finishesLabel} className="flex flex-wrap gap-2">
            {finishes.map((finish) => (
              <li key={finish} className="flex">
                <ChipTag>{finish}</ChipTag>
              </li>
            ))}
          </ul>
        ) : null}
        <AppLink
          href={whatsappUrl(ask.message)}
          aria-label={ask.ariaLabel}
          className={cn(buttonVariants({ variant: "link" }), "mt-auto self-start")}
        >
          <MessageCircle aria-hidden="true" />
          {ask.label}
        </AppLink>
      </div>
    </article>
  );
}
