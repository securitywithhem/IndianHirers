#!/usr/bin/env python3
"""Generate src/content/products.ts from the normalized asset manifest."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = f"{ROOT}/scripts/.image-manifest.json"
DEST = f"{ROOT}/src/content/products.ts"

META = {
    "bone-china": (
        "Bone China",
        "For weddings and premium banquets",
        "Our finest service. Translucent bone china in gold-rimmed, patterned and "
        "plain white finishes — the range hotels reach for when the room has to "
        "look its best.",
    ),
    "melamine": (
        "Melamine",
        "Hard-wearing service at banquet scale",
        "Lightweight, chip-resistant and stackable. Melamine takes the volume of a "
        "large function without the breakage risk of ceramic, in finishes from matt "
        "black to gold medallion.",
    ),
    "glassware": (
        "Glassware",
        "Tumblers and stemware by the crate",
        "Plain, sturdy glassware for water, soft drinks and wine service. Supplied "
        "in crates, counted out and counted back.",
    ),
    "wooden": (
        "Wooden Plates",
        "Warm, natural wood for a relaxed table",
        "Wooden plates, bowls and platters in natural wood. An earthy option "
        "alongside the melamine and bone china ranges.",
    ),
    "chafing-dishes": (
        "Chafing Dishes",
        "Keeping the buffet hot",
        "Brass, copper and silver chafers in round, square and handi forms — "
        "including carved-stand pieces for front-of-house buffet lines.",
    ),
}
ORDER = ["vintage", "bone-china", "melamine", "glassware", "wooden", "chafing-dishes"]

# Categories that are real stock but not yet photographed. They render as a
# named collection with an enquiry route rather than an empty grid, so the range
# can be sold before the shoot lands. Move one into META and add its rows to
# KEEP in normalize-images.py once photography exists.
PENDING = {
    "vintage": (
        "Vintage Collection",
        "Real silver-plated service",
        "Our newest range — genuine silver-plated plates and service pieces, for "
        "weddings and formal dinners where the table itself should be the "
        "centrepiece. Photography is in progress; ask us for available pieces "
        "and quantities.",
    ),
}


def s(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def image_lit(d: dict, indent: str) -> str:
    i2 = indent + "  "
    return (
        "{\n"
        f"{i2}src: {s(d['src'])},\n"
        f"{i2}alt: {s(d['alt'])},\n"
        f"{i2}width: {d['width']},\n"
        f"{i2}height: {d['height']},\n"
        f"{i2}blurDataURL:\n{i2}  {s(d['blurDataURL'])},\n"
        f"{indent}}}"
    )


def main():
    with open(MANIFEST) as f:
        m = json.load(f)

    out = ['''/**
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

export const productCategories: ProductCategory[] = [''']

    for cat in ORDER:
        pending = cat in PENDING
        name, tagline, desc = (PENDING if pending else META)[cat]
        data = m["categories"].get(cat)
        out.append("  {")
        out.append(f"    slug: {s(cat)},")
        out.append(f"    name: {s(name)},")
        out.append(f"    tagline: {s(tagline)},")
        out.append(f"    description:\n      {s(desc)},")
        if pending and data is None:
            out.append("    cover: null,")
            out.append("    comingSoon: true,")
            out.append("    products: [],")
            out.append("  },")
            continue
        out.append(f"    cover: {image_lit(data['cover'], '    ')},")
        if pending:
            out.append("    comingSoon: true,")
        out.append("    products: [")
        for p in data["products"]:
            out.append("      {")
            out.append(f"        slug: {s(p['slug'])},")
            out.append(f"        name: {s(p['name'])},")
            out.append(f"        category: {s(cat)},")
            img = {k: p[k] for k in ("src", "alt", "width", "height", "blurDataURL")}
            out.append(f"        image: {image_lit(img, '        ')},")
            out.append("      },")
        out.append("    ],")
        out.append("  },")

    out.append("];\n")
    out.append("""export const productCategorySlugs = productCategories.map((c) => c.slug);

export function getProductCategory(
  slug: string
): ProductCategory | undefined {
  return productCategories.find((c) => c.slug === slug);
}

/** Flat list across every category, for counts and the sitemap. */
export const allProducts: Product[] = productCategories.flatMap(
  (c) => c.products
);
""")

    with open(DEST, "w") as f:
        f.write("\n".join(out))
    print("wrote", DEST)


if __name__ == "__main__":
    main()
