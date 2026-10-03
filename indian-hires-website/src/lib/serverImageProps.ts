import type { ImageProps } from "next/image";
import { getImgProps } from "next/dist/shared/lib/get-img-props";
import defaultLoader from "next/dist/shared/lib/image-loader";
import type { ImageConfigComplete } from "next/dist/shared/lib/image-config";

/**
 * `next/image`'s `getImageProps`, without the client component.
 *
 * `import { getImageProps } from "next/image"` loads the module that also
 * exports `<Image>`, and that registers `<Image>`'s client chunk (about 5 kB)
 * on the route even when only the function is used. This is the same two
 * lines as Next.js's own `getImageProps` (next/dist/shared/lib/image-external,
 * Next 14.2): the optimised `srcset`, `sizes`, lazy loading and blur
 * placeholder, computed on the server for a plain `<img>`, with the image
 * config from next.config.mjs (`__NEXT_IMAGE_OPTS`, inlined at build time).
 *
 * Server components only. Re-check against `image-external.js` when Next.js
 * is upgraded.
 */
export function serverImageProps(imgProps: ImageProps) {
  const { props } = getImgProps(imgProps, {
    defaultLoader,
    imgConf: process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete,
  });
  return props;
}
