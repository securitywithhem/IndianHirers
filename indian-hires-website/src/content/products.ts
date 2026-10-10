/**
 * GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:
 *   python3 scripts/normalize-images.py
 *   python3 scripts/generate-products-content.py
 * Product names, slugs and alt text live in the `KEEP` table in
 * scripts/normalize-images.py; category copy lives in `META` in
 * scripts/generate-products-content.py. See Docs/Phase3_Assets.md.
 *
 * Product catalogue content — the single source of truth for /products.
 *
 * PRD FR3: the Products page is images only, with NO pricing. The source
 * catalogues carry internal wholesale rates (e.g. "Matt Melamine = 12/-").
 * Those must never reach this file or the public site. The `NoPricing` guard
 * below turns any attempt to add a price-shaped field into a compile error,
 * so it cannot be reintroduced by accident.
 */
type NoPricing = {
  price?: never;
  mrp?: never;
  rate?: never;
  cost?: never;
  amount?: never;
  currency?: never;
  discount?: never;
};

export type ProductCategorySlug =
  | "vintage"
  | "bone-china"
  | "melamine"
  | "glassware"
  | "wooden"
  | "chafing-dishes";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Inline 16px WebP so tiles fade in from the artwork, not from grey. */
  blurDataURL: string;
}

export interface Product extends NoPricing {
  slug: string;
  name: string;
  category: ProductCategorySlug;
  image: ProductImage;
}

export interface ProductCategory extends NoPricing {
  slug: ProductCategorySlug;
  name: string;
  tagline: string;
  description: string;
  /** Null while a real range is still awaiting photography. */
  cover: ProductImage | null;
  products: Product[];
  /** Real stock, not yet photographed — renders as an enquiry route. */
  comingSoon?: boolean;
}

export const productCategories: ProductCategory[] = [
  {
    slug: "vintage",
    name: "Vintage Collection",
    tagline: "Real silver-plated service",
    description:
      "Our newest range — genuine silver-plated plates and service pieces, for weddings and formal dinners where the table itself should be the centrepiece. Photography is in progress; ask us for available pieces and quantities.",
    cover: {
      src: "/images/products/vintage/cover.webp",
      alt: "Ornate silverware: engraved trays, a covered vessel and hammered bowls on a dark backdrop",
      width: 1086,
      height: 1086,
      blurDataURL:
        "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQAgCdASoQABAAA4BaJQBOgMXhtq9FwxwAAP7vhdt8l6WRHccPm1l54vPLEwdReCoAgS5UvrSuqJ8YGXCtodW2lIovoTdTWDVMbReS0XKiCoXuu3Q3/BmJXunQ2L0QyPAfkOQAAAA=",
    },
    comingSoon: true,
    products: [
    ],
  },
  {
    slug: "bone-china",
    name: "Bone China",
    tagline: "For weddings and premium banquets",
    description:
      "Our finest service. Translucent bone china in gold-rimmed, patterned and plain white finishes — the range hotels reach for when the room has to look its best.",
    cover: {
      src: "/images/products/bone-china/cover.webp",
      alt: "Close detail of an emerald and gold bone china place setting",
      width: 864,
      height: 864,
      blurDataURL:
        "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADQAQCdASoQABAAA4BaJQBdgBrV45wXsAD+qrOuyNxfACt29c0nX2UfRW9rUOmZoTikHXrertynsbKPn/ZY5LiY9sl4IwO3iJIwij5I0cNVxYbdTbeLgAAA",
    },
    products: [
      {
        slug: "golden-rim",
        name: "Golden Rim Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/golden-rim.webp",
          alt: "Bone china dinner plate, side plate and bowls with a woven gold rim",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABQAgCdASoQABAAA4BaJZgCdAEQ1xXZmYKP0wAA/pjHgCYm4gTYAym/D84RarjvETPUaRGZkrOKepjn1f+RQ6XtKYBlijQrx2ZrrJCviBje+zYeux1aZduhX3GDkP5ztDlZ0Gj6ESnwM2KAEtWEAAAA",
        },
      },
      {
        slug: "emerald-gold",
        name: "Emerald & Gold Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/emerald-gold.webp",
          alt: "Bone china place setting with emerald green and gold patterned borders",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQAgCdASoQABAAA4BaJZACdAEebtpJsLrGJKAA/teIemQ3SOPyI8eaZWgmElFvC1U6b2YYgS7w2kWMGBBLpCuT20QdSGrl+4sCVa7VocvRfTEphvBfVOiXfvK89992Iw3RzNs9AAA=",
        },
      },
      {
        slug: "haldi-ivory",
        name: "Haldi Ivory Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/haldi-ivory.webp",
          alt: "Warm ivory bone china plates, cup and bowls edged with a fine gold line",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoQABAAA4BaJZACdAEfwGc6Ft+TAAD+5/4QsadXc4OTQCkuMq2htf72ui7VqAqdO7ZI0qh6kKq8IkPvGcmo1JVJ0rmMP9/64WyzJwTTX0AAAA==",
        },
      },
      {
        slug: "classic-white",
        name: "Classic White Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/classic-white.webp",
          alt: "Plain white bone china dinner plate, side plate and serving bowls",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABwAgCdASoQABAAA4BaJZwC7AYv12s3ALlPCklAAN5kH+2bP2Wvl4j1vdqouUHuWjPmw4P7Z1GKaIDBxKLQAEzty1XEcb+DZHZlLT3zTtFz5D5cegBRiEKCJxP6pvrdf/sAm1YP1v4Ki6uAAAA=",
        },
      },
      {
        slug: "spiral-motif",
        name: "Spiral Motif Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/spiral-motif.webp",
          alt: "White bone china set decorated with black spiral motifs",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwAgCdASoQABAAA4BaJZwAD5DxdOO3+MMymAD6mXuINvrPrJ3k4mA0bAst5U+ggJ7tWuksVxDQYRkAJb3tiDZ/r7O9lS5deB1LnEXqE9EScXUNorFtRXLTSKwaJmFkI19X9J73v3cLY9W2AAA=",
        },
      },
      {
        slug: "black-scallop",
        name: "Black Scallop Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/black-scallop.webp",
          alt: "Bone china dinner plate, side plate, cup and saucer and bowl with a black scallop lattice border and a fine gold rim",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAwAgCdASoQABAAA4BaJYwCdAEfStppO+yNAAD+6laZECdDD1fO/c07pTYU0jmxxVPLttLYu60DIzkWbrl63CNTxkIdcZxemQ6ViXroOH+Zk/EuTPGVktVyQvZK3OHXUbAruyqAAAA=",
        },
      },
    ],
  },
  {
    slug: "melamine",
    name: "Melamine",
    tagline: "Hard-wearing service at banquet scale",
    description:
      "Lightweight, chip-resistant and stackable. Melamine takes the volume of a large function without the breakage risk of ceramic, in finishes from matt black to gold medallion.",
    cover: {
      src: "/images/products/melamine/blue-rim.webp",
      alt: "Melamine place setting with a fine blue rim, cutlery, bowls and cups",
      width: 1200,
      height: 1200,
      blurDataURL:
        "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQAgCdASoQABAAA4BaJZQCw7YvN2upm4B94gAA/i/FuDWHGcLmJ7TEdG+M0ka955Tm/wiBuqH+5OFxZAvy/YnAa/li76ax2B8JcXBaPTb6e6fM7nzdEO8s+ERSi26PqiHrFblaHysRYcy2LdAAAA==",
    },
    products: [
      {
        slug: "matt-black",
        name: "Matt Black Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/matt-black.webp",
          alt: "Matt black melamine charger, dinner plate and two bowls",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABQAgCdASoQABAAA4BaJZQCw7Efk/1AcfMKa4AAzjuJacdB/VBAxkJPBAtSk19OSCtLxqrXIVAMPRhUlvKq1d7dPyymBdULJhQdqftBOzy9Fz2LPSgU9F4HZmkAAA==",
        },
      },
      {
        slug: "blue-matt",
        name: "Blue Matt Melamine Set",
        category: "melamine",
        image: {
          src: "/images/products/melamine/blue-matt.webp",
          alt: "Blue matt melamine plates and bowls",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAwAgCdASoQABAAA4BaJZQCw7DwoftX8NUoAADgC68Ng3d0n2yGrjkNYmMbiUXy/Z3RMrDomBvlrSqdPoVKT1ExfcNkBP2q1l9SXs8dymwKgcNRHtdIjx+C/qNfL6DJdGlVgsAsMiPRAWdDGAAAAA==",
        },
      },
      {
        slug: "white-matt",
        name: "White Matt Melamine Set",
        category: "melamine",
        image: {
          src: "/images/products/melamine/white-matt.webp",
          alt: "White matt melamine plates and bowls",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQABAAA4BaJZQCw7EfwHVuyTq7yGwAzfARtejwJ4nVL6iqt8jCI3HJNdxTGqYVWEG9S+SxS34ypnm5Ii1hsfVKdmtvwkTPoVHBW4O/E082c0u4pYkmZiSI4QAAAA==",
        },
      },
      {
        slug: "blue-rim",
        name: "Blue Rim Melamine Set",
        category: "melamine",
        image: {
          src: "/images/products/melamine/blue-rim.webp",
          alt: "Melamine place setting with a fine blue rim, cutlery, bowls and cups",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQAgCdASoQABAAA4BaJZQCw7YvN2upm4B94gAA/i/FuDWHGcLmJ7TEdG+M0ka955Tm/wiBuqH+5OFxZAvy/YnAa/li76ax2B8JcXBaPTb6e6fM7nzdEO8s+ERSi26PqiHrFblaHysRYcy2LdAAAA==",
        },
      },
    ],
  },
  {
    slug: "glassware",
    name: "Glassware",
    tagline: "Tumblers and stemware by the crate",
    description:
      "Plain, sturdy glassware for water, soft drinks and wine service. Supplied in crates, counted out and counted back.",
    cover: {
      src: "/images/products/glassware/wine-glass.webp",
      alt: "Stemmed clear glass wine glass",
      width: 1200,
      height: 1200,
      blurDataURL:
        "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQABAAA4BaJZwAAq4KSD0SCMAA/vK0L1s0sv53dbvuzPJItsk3xBi9ySb+W6w28Vvo3CUFJcTjwYCAAAA=",
    },
    products: [
      {
        slug: "highball",
        name: "Highball Tumbler",
        category: "glassware",
        image: {
          src: "/images/products/glassware/highball.webp",
          alt: "Tall plain glass highball tumbler",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQABAAA4BaJZwAAq4PQRPr1hAA/u7edS3EZVRkr+xOhVsHw51Trlw6YD2OoPxksQaSANdwIGrXAAAA",
        },
      },
      {
        slug: "wine-glass",
        name: "Wine Glass",
        category: "glassware",
        image: {
          src: "/images/products/glassware/wine-glass.webp",
          alt: "Stemmed clear glass wine glass",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQABAAA4BaJZwAAq4KSD0SCMAA/vK0L1s0sv53dbvuzPJItsk3xBi9ySb+W6w28Vvo3CUFJcTjwYCAAAA=",
        },
      },
      {
        slug: "rocks-tumbler",
        name: "Rocks Tumbler",
        category: "glassware",
        image: {
          src: "/images/products/glassware/rocks-tumbler.webp",
          alt: "Short wide-bowled clear glass rocks tumbler",
          width: 1037,
          height: 1037,
          blurDataURL:
            "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQABAAA4BaJZQAAvc6YvV6qqAA/t11ZS90XPPt0Otz7lnEPL1lgms6GndUTUyazA7wNQZUnEfBy7oHtY2utzhVFD+wweH/BIRj7PKiV1gAAA==",
        },
      },
      {
        slug: "water-tumbler",
        name: "Straight Water Tumbler",
        category: "glassware",
        image: {
          src: "/images/products/glassware/water-tumbler.webp",
          alt: "Straight-sided clear glass water tumbler",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQABAAA4BaJZQAAuP03RWYAAD+5ZJ884FLpH0GbBASXGqb6iaDXX859kSeCSI/iZThDp3BHTVGq6wA",
        },
      },
    ],
  },
  {
    slug: "wooden",
    name: "Wooden Plates",
    tagline: "Warm, natural wood for a relaxed table",
    description:
      "Wooden plates, bowls and platters in natural wood. An earthy option alongside the melamine and bone china ranges.",
    cover: {
      src: "/images/products/wooden/wooden-plates.webp",
      alt: "Round natural wooden plates and small bowls on a dark backdrop",
      width: 1086,
      height: 1086,
      blurDataURL:
        "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACQAgCdASoQABAAA4BaJbACdGaA2wAGYCR4Ru8UQAD+6PD5YZ366eP8JvnU8/yz7VWso1RHdL2o1PKN6i1HUvJzTEMZRBrSF6FcpttgWyOqnqrkv9GEo7w1p9OTa24vh8JuadMi8AA=",
    },
    products: [
      {
        slug: "wooden-plates",
        name: "Wooden Plates",
        category: "wooden",
        image: {
          src: "/images/products/wooden/wooden-plates.webp",
          alt: "Round natural wooden plates and small bowls on a dark backdrop",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACQAgCdASoQABAAA4BaJbACdGaA2wAGYCR4Ru8UQAD+6PD5YZ366eP8JvnU8/yz7VWso1RHdL2o1PKN6i1HUvJzTEMZRBrSF6FcpttgWyOqnqrkv9GEo7w1p9OTa24vh8JuadMi8AA=",
        },
      },
      {
        slug: "wooden-platters-display",
        name: "Wooden Plates Display",
        category: "wooden",
        image: {
          src: "/images/products/wooden/wooden-platters-display.webp",
          alt: "Scalloped wooden platters and a wooden bowl beside a gold tiered stand",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADQAQCdASoQABAAA4BaJbACdACvWb64AAD+70t8yywDndvXrZ/F7R2pu+/pAgdMDYRC0QAKZus9UzwwJa+iK0L16QHbGh3mDdnoI2ogtq7t2kr69HLX+BA5XIA9ZQiqPCXYeAAA",
        },
      },
    ],
  },
  {
    slug: "chafing-dishes",
    name: "Chafing Dishes",
    tagline: "Keeping the buffet hot",
    description:
      "Brass, copper and silver chafers in round, square and handi forms — including carved-stand pieces for front-of-house buffet lines.",
    cover: {
      src: "/images/products/chafing-dishes/golden-urn-pedestal.webp",
      alt: "Ornate golden urn on pedestal",
      width: 1086,
      height: 1086,
      blurDataURL:
        "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQABAAA4BaJbACdAEfTpDMNySjSAD+zc/+LUfjS173oU+d5IV/Gn3/jkhY1bu8okSiZaiXLBlfKstoOoXGu/cPguQR2pnDbmW90hP5Tf/eBZ5opTVHVkCUFdzcifFciwAAAA==",
    },
    products: [
      {
        slug: "antique-bronze-vessel",
        name: "Ornate Antique Bronze Vessel",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/antique-bronze-vessel.webp",
          alt: "Ornate antique bronze vessel",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAwAgCdASoQABAAA4BaJbACdADQ8no2Da1BQAD+71m/TDxlj1+AQ97529QXPBL3WyJU8ybtbrkGfXEp6D6sNjSqCGJ3CoLIb094XaoolvfaTU3eAXutGzRd9XY3/ckbUReEy32AAAA=",
        },
      },
      {
        slug: "golden-ribbed-serving-pot",
        name: "Ornate Golden Ribbed Serving Pot",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/golden-ribbed-serving-pot.webp",
          alt: "Ornate golden ribbed serving pot",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQABAAA4BaJYgCdAEO+nfI2ZwAAP7s+5dL+jCkE7ZA7+/KxJgXe4TNiDD4ewRa9x5sA0pLK2ETQ6K/NtkNIFi7CfotpxVtZ5oAAA==",
        },
      },
      {
        slug: "golden-urn-pedestal",
        name: "Ornate Golden Urn on Pedestal",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/golden-urn-pedestal.webp",
          alt: "Ornate golden urn on pedestal",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQABAAA4BaJbACdAEfTpDMNySjSAD+zc/+LUfjS173oU+d5IV/Gn3/jkhY1bu8okSiZaiXLBlfKstoOoXGu/cPguQR2pnDbmW90hP5Tf/eBZ5opTVHVkCUFdzcifFciwAAAA==",
        },
      },
      {
        slug: "hammered-brass-chafing-dish",
        name: "Ornate Hammered Brass Chafing Dish",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/hammered-brass-chafing-dish.webp",
          alt: "Ornate hammered brass chafing dish",
          width: 1062,
          height: 1062,
          blurDataURL:
            "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwAQCdASoQABAAA4BaJbACdADA5fjAAP7qISQHReY7qlsLpxZ9OzuJrqktIDQ6/2CFMqZoljXjy/mo8gra0VCmHTwyxrB+uXFsFMcFY5OMhdIPyDL0P1+DSZ2o8lMPN4AAAA==",
        },
      },
      {
        slug: "golden-brass-canister",
        name: "Golden Brass Canister",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/golden-brass-canister.webp",
          alt: "Golden brass canister on dark stone",
          width: 1086,
          height: 1086,
          blurDataURL:
            "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAQAgCdASoQABAAA4BaJbACdADb8HWetCIAAP7zSSThVN2JF9gDIEwHXqIGdoLhZ76cmOXalRfXxWR9+YIi8o0GNKeUy7IFzXNctn1Gk+U42fqPNFrJV6FdLyiuNZAUEqt7E3gUuLqtM4AA",
        },
      },
    ],
  },
];

export const productCategorySlugs = productCategories.map((c) => c.slug);

export function getProductCategory(
  slug: string
): ProductCategory | undefined {
  return productCategories.find((c) => c.slug === slug);
}

/** Flat list across every category, for counts and the sitemap. */
export const allProducts: Product[] = productCategories.flatMap(
  (c) => c.products
);
