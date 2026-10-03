import { serverImageProps } from "@/lib/serverImageProps";
import type { ProductImage } from "@/content/products";

export interface FounderPortraitPhotoProps {
  image: ProductImage;
  /** `profile.portraitAlt`, from src/content/founders.ts. */
  alt: string;
}

/**
 * The portrait photograph, cropped to the circle by its parent.
 *
 * `serverImageProps` is `next/image`'s `getImageProps`: the same optimised
 * `srcset`, `sizes`, lazy loading and blur placeholder, rendered on the server
 * with no client code. `<Image>` itself would add its client chunk (about
 * 5 kB) and put /founders over its 100 kB budget (docs/OPEN_ISSUES.md E16).
 *
 * A soft gold wash in `soft-light` warms it into the palette without
 * recolouring the face; it is static (no filter, nothing animated).
 */
export function FounderPortraitPhoto({ image, alt }: FounderPortraitPhotoProps) {
  const props = serverImageProps({
    src: image.src,
    alt,
    fill: true,
    sizes: "176px",
    placeholder: "blur",
    blurDataURL: image.blurDataURL,
  });

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- props come from next/image's getImgProps */}
      <img {...props} alt={alt} className="object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-gold-500/25 mix-blend-soft-light" />
    </>
  );
}
