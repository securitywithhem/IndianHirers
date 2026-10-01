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
    cover: null,
    comingSoon: true,
    products: [],
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
          width: 1184,
          height: 1184,
          blurDataURL:
            "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQABAAA4BaJZwAApQDKarX49WAAP7vkvmfdPlz5wsH2oc9AIviJIWGECgqdJL3xifR+zTYnx8geUbLJFNavUSP7lzqa7zFc34OaJVYxYk7AV+7eS1ay8AA",
        },
      },
      {
        slug: "emerald-gold",
        name: "Emerald & Gold Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/emerald-gold.webp",
          alt: "Bone china place setting with emerald green and gold patterned borders",
          width: 1043,
          height: 1043,
          blurDataURL:
            "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQABAAA4BaJZQAD5FMeipGwEfaAAD+8YEirIju+RfY/gm9PBPnWZo8ysZxAfJtyncyrPRzkqhujwkE2iRCS4Vl66VS/9+5eCpnt/UFFkxXVzIaogsyXk2nXX+v2Zkad1gAAA==",
        },
      },
      {
        slug: "haldi-ivory",
        name: "Haldi Ivory Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/haldi-ivory.webp",
          alt: "Warm ivory bone china plates, cup and bowls edged with a fine gold line",
          width: 1108,
          height: 1108,
          blurDataURL:
            "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAABQAgCdASoQABAAA4BaJbACdAEfwHDoW8b87AAA/sKGpu9hegSn/pz03GS6+u2mxeKMsd11QOxtHXg0fd9nr3q3mXmN2qEeJd5gzH03D/VFKmI+Ka23CUovFpORT3NDECar/Y4rlAAAAA==",
        },
      },
      {
        slug: "classic-white",
        name: "Classic White Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/classic-white.webp",
          alt: "Plain white bone china dinner plate, side plate and serving bowls",
          width: 1148,
          height: 1148,
          blurDataURL:
            "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAQCdASoQABAAA4BaJZwAAxZMb/sU8IAA/vNe6bnK/T+70OBf31/tYt3uxUwAX9UnRIKw885lls4zotzKkd1mdJHdapBMsscmMXdnIzSKahxRruuiD6hs1IJDAAAA",
        },
      },
      {
        slug: "spiral-motif",
        name: "Spiral Motif Bone China",
        category: "bone-china",
        image: {
          src: "/images/products/bone-china/spiral-motif.webp",
          alt: "White bone china set decorated with black spiral motifs",
          width: 996,
          height: 996,
          blurDataURL:
            "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAABQAgCdASoQABAAA4BaJZwAD5ORdOPk0HD5uAAA/sKGs5HgNStcs+3GngmjzkBPyGXA48TmD5hMHHR9RMQNtz9s4mCovO996SSMoRzsEyRyeESWIkEA6c5/UvuCcWtQcUWsKwAA",
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
      src: "/images/products/melamine/blue-gold-border.webp",
      alt: "Melamine dinner service with a blue geometric and gold border",
      width: 1200,
      height: 1200,
      blurDataURL:
        "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQABAAA4BaJaQAAxZnzpD78h5UMoAA/ubQjxuUDCIKNFM2qvjuba+CIfjvUB9kUZ9vQhJ8t8Tbhpkxl/uRJ/RGRRoPBOdb9KGkutvvMVCvHC4ZD4I2k/GWd0AAAA==",
    },
    products: [
      {
        slug: "matt-black",
        name: "Matt Black Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/matt-black.webp",
          alt: "Matt black melamine charger, dinner plate and two bowls",
          width: 1174,
          height: 1174,
          blurDataURL:
            "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAgCdASoQABAAA4BaJZwAAxbQYrSTKIaYAAD8/faXkLyyxoqYilH/Ary0Zu9ceoULvnihy10dSIuG/oYsQrxuDw2rhQWGRj9SnE0MI/AYdCgA",
        },
      },
      {
        slug: "blue-rim",
        name: "Blue Rim Melamine Set",
        category: "melamine",
        image: {
          src: "/images/products/melamine/blue-rim.webp",
          alt: "Melamine place setting with a fine blue rim, cutlery, bowls and cups",
          width: 960,
          height: 960,
          blurDataURL:
            "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoQABAAA4BaJaQAAXDDR/sQAP7HIuo6UUtpiGf7WKJiNZcaYg/d/uPIcbVO0tKeXQsuEL5GJvPe11ytTuDq0vFvQAA=",
        },
      },
      {
        slug: "sky-blue",
        name: "Sky Blue Melamine Set",
        category: "melamine",
        image: {
          src: "/images/products/melamine/sky-blue.webp",
          alt: "Melamine place setting with a light blue banded border and cutlery",
          width: 960,
          height: 960,
          blurDataURL:
            "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAQCdASoQABAAA4BaJZwAAf8fLo8KgAD+xyGHyREddNCN9stK5GJfEyP2ZzUVw6HdUzBqf4HyHn/yjwGkZie8a+z0Dfctjyvve6/2WBwAAA==",
        },
      },
      {
        slug: "ribbed-white",
        name: "Ribbed White Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/ribbed-white.webp",
          alt: "Ribbed off-white melamine plates and bowls",
          width: 1193,
          height: 1193,
          blurDataURL:
            "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoQABAAA4BaJYgCdAD1kkjsU2qAAP4FtY6AkZEOM5j9CzK2J/uVwx6wd3jHZ1WHl7MRxvRDQ5we4gx9yXPPK4FNoGj1xD4/1KtqyKIe/iiT3U3AAAA=",
        },
      },
      {
        slug: "textured-ivory",
        name: "Textured Ivory Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/textured-ivory.webp",
          alt: "Ivory melamine plates with a brushed linear texture and matching bowls",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQABAAA4BaJaQAAuR6fETZVDgA/upWw5k4h2WdWYVhK+0H80rvOowrURZXzeYzPZNT6QMDgpg12iOeJaiZ2Rm/r8cmFxZs4dJ/bAzjVl2kMAAA",
        },
      },
      {
        slug: "gold-medallion",
        name: "Gold Medallion Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/gold-medallion.webp",
          alt: "Pale melamine plates and bowls with a gold medallion motif",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQABAAA4BaJaQAD4zNtwaFaInQGhAA/vG0RtoiMUWcJ2fsyzTdOW9fB8Ub6v5fyGD8Ml0FPiRPNhk9JaTTvhkZPX9hDWxFjkT1un5ep0UatFps1KgVoKAA",
        },
      },
      {
        slug: "blue-gold-border",
        name: "Blue & Gold Border Melamine",
        category: "melamine",
        image: {
          src: "/images/products/melamine/blue-gold-border.webp",
          alt: "Melamine dinner service with a blue geometric and gold border",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQABAAA4BaJaQAAxZnzpD78h5UMoAA/ubQjxuUDCIKNFM2qvjuba+CIfjvUB9kUZ9vQhJ8t8Tbhpkxl/uRJ/RGRRoPBOdb9KGkutvvMVCvHC4ZD4I2k/GWd0AAAA==",
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
    slug: "chafing-dishes",
    name: "Chafing Dishes",
    tagline: "Keeping the buffet hot",
    description:
      "Brass, copper and silver chafers in round, square and handi forms — including carved-stand pieces for front-of-house buffet lines.",
    cover: {
      src: "/images/products/chafing-dishes/brass-handi.webp",
      alt: "Large rounded brass handi chafing dish with a scrolled lid handle",
      width: 1179,
      height: 1179,
      blurDataURL:
        "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAACQAgCdASoQABAAA4BaJbACdAdwLg2tXGHZSvn8AAD88sW76MVZhQCA4oub35Xcqidi0GTq0HvkHEvWpWeVgc5AngkI2dnxoA8KAuGRBq1RfSbguXOJHXBrnvu4v+qk/tBenZo3PHzrYbTkdrTfQP+uwJfAAAAA",
    },
    products: [
      {
        slug: "brass-round",
        name: "Round Brass Chafing Dish",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/brass-round.webp",
          alt: "Round polished brass chafing dish on a three-legged stand",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAQCdASoQABAAA4BaJZgCdACj6dMJ24AA/u9Mv0GJ+Q/OX+1RynxUubYzvyZkB7qs/Y12Fn5Ohl2bJ31Ftz1tYjWXju2ZO3jWNRiDe7MK0JzCuPBN5k/M4kYYAAAA",
        },
      },
      {
        slug: "silver-carved-stand",
        name: "Silver Chafer on Carved Stand",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/silver-carved-stand.webp",
          alt: "Silver chafing dish resting on an ornately carved metal stand",
          width: 853,
          height: 853,
          blurDataURL:
            "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQAgCdASoQABAAA4BaJbACdADiaHNEj+WoAP7p4ZZW3wAyCVgd3EnmotDJu+1O9ci7i7PS2vJMoRFO+ev9xySnsSL+g8GWJIm89ZgXkYUsE/Og4tPQkRxiWQAAAA==",
        },
      },
      {
        slug: "gold-hammered-square",
        name: "Hammered Gold Square Chafer",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/gold-hammered-square.webp",
          alt: "Square gold chafing dish with a hammered lid on tapered legs",
          width: 1200,
          height: 1200,
          blurDataURL:
            "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAwAgCdASoQABAAA4BaJagCdH8AEMjiQP1mAADOGgtMqjtYtEuHDk0CASaEYAw9FJW8eT4l/cUPBLiC1DJnOEf6fFka/OHzMbvRrllH8QAAAA==",
        },
      },
      {
        slug: "brass-handi",
        name: "Large Brass Handi Chafer",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/brass-handi.webp",
          alt: "Large rounded brass handi chafing dish with a scrolled lid handle",
          width: 1179,
          height: 1179,
          blurDataURL:
            "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAACQAgCdASoQABAAA4BaJbACdAdwLg2tXGHZSvn8AAD88sW76MVZhQCA4oub35Xcqidi0GTq0HvkHEvWpWeVgc5AngkI2dnxoA8KAuGRBq1RfSbguXOJHXBrnvu4v+qk/tBenZo3PHzrYbTkdrTfQP+uwJfAAAAA",
        },
      },
      {
        slug: "copper-ribbed-dome",
        name: "Ribbed Copper Dome Chafer",
        category: "chafing-dishes",
        image: {
          src: "/images/products/chafing-dishes/copper-ribbed-dome.webp",
          alt: "Copper and silver ribbed chafing dish with a domed lid",
          width: 877,
          height: 877,
          blurDataURL:
            "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoQABAAA4BaJQBOgCKfO+tl8WAAAP3wWXMB120OD+gNTWW3T81Pp5ghuBaqSxOefsfbzBCt7cU7oWQBZpMTUnR6BwTDslrO+inUFf3uWwAAAA==",
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
