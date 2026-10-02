import Image from "next/image";
import { cn } from "@/lib/utils";
import { shell } from "@/content/site";

export type BrandLogoSize = "header" | "footer";

export interface BrandLogoProps {
  /** `header` 48px (also the drawer) · `footer` 80px. Default `header`. */
  size?: BrandLogoSize;
  /**
   * True when the logo repeats a name that is already in text beside it (the
   * header link, the drawer): empty alt and `aria-hidden`. Default false.
   */
  decorative?: boolean;
  className?: string;
}

const SIZE: Record<BrandLogoSize, { box: string; sizes: string }> = {
  header: { box: "size-12", sizes: "48px" },
  footer: { box: "size-20", sizes: "80px" },
};

/**
 * The logo plaque (Docs/UI_UX_V2.md §6.8). The supplied file has an opaque
 * white ground, so it is always shown whole inside a gold-ringed plaque — the
 * same one on ivory and on maroon — and is never filtered, recoloured,
 * cropped or animated.
 *
 * The initials sit behind the image and show only if it fails to load.
 */
export function BrandLogo({ size = "header", decorative = false, className }: BrandLogoProps) {
  const { logo } = shell;
  const { box, sizes } = SIZE[size];

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-sm bg-ivory-50 ring-1 ring-hairline/40",
        box,
        className,
      )}
    >
      <span aria-hidden="true" className="type-caption font-semibold text-maroon-700">
        {logo.fallbackText}
      </span>
      <Image
        src={logo.src}
        alt={decorative ? "" : logo.alt}
        aria-hidden={decorative ? true : undefined}
        fill
        sizes={sizes}
        className="object-contain"
      />
    </span>
  );
}
