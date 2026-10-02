import Image from "next/image";
import { cx } from "@/lib/cx";
import { ArchFrame, type ArchAspect } from "./ArchFrame";

/** The fields of a content-file image entry that the arch needs. */
export interface ArchImageSource {
  src: string;
  /** Describes what is in the frame. Empty only for a purely decorative image. */
  alt: string;
  blurDataURL: string;
}

export interface ArchImageProps {
  /** An image entry from a content file (`ProductImage` fits). */
  image: ArchImageSource;
  /** Fixed aspect ratio of the frame, so its box is reserved before the image loads. */
  aspect: ArchAspect;
  /** Must match the real rendered width of the photograph at each breakpoint. */
  sizes: string;
  /** Draw a thin gold line that follows the arch. Default false. */
  framed?: boolean;
  /** Only for the single LCP image of a route. Default false. */
  priority?: boolean;
  /**
   * Zoom the photograph to 1.04 over 700ms when an ancestor with the `group`
   * class is hovered or focused. Off under reduced motion. Default false.
   */
  zoom?: boolean;
  /** Width of the frame (it is `w-full` by default) and any outer spacing. */
  className?: string;
}

const ZOOM_CLASS =
  "motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104 motion-safe:group-focus-visible:scale-104";

/**
 * A photograph in the mehrab arch: `next/image` (fill, cover, blur
 * placeholder) inside `<ArchFrame>`. Use `<ArchFrame>` directly when the
 * child is not a single photograph — the crown placeholder, a Ken Burns image.
 */
export function ArchImage({
  image,
  aspect,
  sizes,
  framed = false,
  priority = false,
  zoom = false,
  className,
}: ArchImageProps) {
  return (
    <ArchFrame aspect={aspect} framed={framed} className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={cx("object-cover", zoom && ZOOM_CLASS)}
      />
    </ArchFrame>
  );
}
