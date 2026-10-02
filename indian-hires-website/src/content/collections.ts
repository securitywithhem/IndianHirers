/**
 * The catalogue: eight collections, their items, the helpers that query them
 * and every string the catalogue UI shows.
 *
 * Consumed by: /collections, /collections/[slug], the home page (featured
 * collections), /gallery (via gallery.ts), the quote basket and the sitemap.
 *
 * WHERE THE DATA COMES FROM
 * - Collection and design names: supplied by the owner.
 * - Photographs: `./products.ts`, a GENERATED file that this module treats as
 *   a read-only photo manifest. Image objects are looked up there and reused;
 *   they are never copied into this file.
 * - Anything inferred (a material, a finish, a piece, which photo belongs to
 *   which name) is listed for the owner in docs/COPY_TO_CONFIRM.md.
 *
 * CONFIRMED vs ASSUMED
 * An item's `material`, `finishes` and `pieces` hold only what the owner has
 * stated (one recorded exception: the piece type of the sized chat plates,
 * see `chat-and-snack-plates`). A value read off a photograph or guessed
 * from a name is kept in the seed's `assumed` field, which never leaves this module: it is not on
 * `CatalogueItem`, no helper returns it, and so it can be neither rendered
 * nor offered as a filter. When the owner confirms a value, move it from
 * `assumed` to the real field.
 *
 * NO PRICING. Rates are never published. `NoPricing` makes any price-shaped
 * field a compile error on every catalogue type. Each item shows "Rates on
 * request" and a WhatsApp quote button instead.
 *
 * FUTURE PHOTOGRAPHS — path convention
 *   /images/catalogue/<collection>/<slug>-1.webp   (see `cataloguePhotoPath`)
 * WebP, at most 1200px wide, with a blurDataURL; `-1` is the lead photograph,
 * `-2`, `-3` … any further views. How to export them from the catalogue PDFs:
 * scripts/extract-catalogue-images.md.
 * Existing photographs keep their /images/products/** paths via the manifest.
 */
import {
  getProductCategory,
  productCategories,
  type Product,
  type ProductCategorySlug,
  type ProductImage,
} from "./products";
import { collectionPath, routes, type QuoteLine } from "./site";

// ---------------------------------------------------------------------------
// Guard
// ---------------------------------------------------------------------------

/**
 * Makes price-shaped fields compile errors. Mirrors the guard in the
 * generated products.ts (which does not export its own copy).
 */
export type NoPricing = {
  price?: never;
  mrp?: never;
  rate?: never;
  cost?: never;
  amount?: never;
  currency?: never;
  discount?: never;
};

// ---------------------------------------------------------------------------
// Taxonomy — unions, so an unknown value is a compile error
// ---------------------------------------------------------------------------

export type CollectionSlug =
  | "heritage-silver"
  | "bone-china"
  | "premium-melamine"
  | "regular-melamine"
  | "chat-and-snack-plates"
  | "chafing-dishes"
  | "cutlery-and-serveware"
  | "glassware";

/** Display order of the collections. */
export const collectionSlugs: CollectionSlug[] = [
  "heritage-silver",
  "bone-china",
  "premium-melamine",
  "regular-melamine",
  "chat-and-snack-plates",
  "chafing-dishes",
  "cutlery-and-serveware",
  "glassware",
];

export type Material =
  | "bone-china"
  | "melamine"
  | "silver-plated"
  | "steel"
  | "brass"
  | "copper"
  | "glass";

export type Finish =
  | "gold"
  | "rose-gold"
  | "silver"
  | "brass"
  | "copper"
  | "matt"
  | "black"
  | "white"
  | "ivory"
  | "yellow"
  | "blue"
  | "green"
  | "marble"
  | "clear";

export type PieceType =
  | "dinner-set"
  | "soup-set"
  | "plate"
  | "bowl"
  | "mug"
  | "glass"
  | "cutlery"
  | "serving-spoon"
  | "tray"
  | "chafing-dish";

export const materialLabels: Record<Material, string> = {
  "bone-china": "Bone china",
  melamine: "Melamine",
  "silver-plated": "Silver-plated",
  steel: "Steel",
  brass: "Brass",
  copper: "Copper",
  glass: "Glass",
};

export const finishLabels: Record<Finish, string> = {
  gold: "Gold",
  "rose-gold": "Rose gold",
  silver: "Silver",
  brass: "Brass",
  copper: "Copper",
  matt: "Matt",
  black: "Black",
  white: "White",
  ivory: "Ivory",
  yellow: "Yellow",
  blue: "Blue",
  green: "Green",
  marble: "Marble",
  clear: "Clear",
};

export const pieceTypeLabels: Record<PieceType, string> = {
  "dinner-set": "Dinner sets",
  "soup-set": "Soup sets",
  plate: "Plates",
  bowl: "Bowls",
  mug: "Mugs",
  glass: "Glasses",
  cutlery: "Cutlery",
  "serving-spoon": "Serving spoons",
  tray: "Trays",
  "chafing-dish": "Chafing dishes",
};

/** Order in which filter options are offered. */
const materialOrder: Material[] = [
  "silver-plated",
  "bone-china",
  "melamine",
  "steel",
  "brass",
  "copper",
  "glass",
];

const finishOrder: Finish[] = [
  "gold",
  "rose-gold",
  "silver",
  "brass",
  "copper",
  "white",
  "ivory",
  "yellow",
  "black",
  "matt",
  "blue",
  "green",
  "marble",
  "clear",
];

const pieceTypeOrder: PieceType[] = [
  "dinner-set",
  "soup-set",
  "plate",
  "bowl",
  "mug",
  "glass",
  "cutlery",
  "serving-spoon",
  "tray",
  "chafing-dish",
];

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

/** One piece a design is hired as. `label` is what the visitor reads. */
export interface Piece {
  type: PieceType;
  label: string;
}

/**
 * "available"   — a real item, shown publicly.
 * "todo"        — a placeholder the owner still has to fill in.
 * "unconfirmed" — an owner-listed entry held back until the owner answers a
 *                 question about it: a name that is probably the same design
 *                 as an item already shown, or a catalogue line that has no
 *                 name of its own.
 *
 * Only "available" is public. "todo" and "unconfirmed" are excluded from
 * every public helper and must never be rendered.
 */
export type ItemStatus = "available" | "todo" | "unconfirmed";

/** What a collection's entries are counted as on its card and page. */
export type CountNoun = "designs" | "items";

export interface CatalogueItem extends NoPricing {
  /** Globally unique: `<collection>--<slug>`. Use as React key and basket id. */
  id: string;
  /** Unique within its collection. */
  slug: string;
  /**
   * The name to display. Inside a collection it does not repeat the
   * collection's name ("Golden Rim", not "Golden Rim Bone China").
   */
  name: string;
  collection: CollectionSlug;
  /**
   * Null → the owner has not confirmed the material. Render nothing for it:
   * no label, no "ask us" stand-in, no filter option.
   */
  material: Material | null;
  /** Confirmed finishes only. Empty when the owner has not stated one. */
  finishes: Finish[];
  /** Confirmed pieces only. Empty when the owner has not said which. */
  pieces: Piece[];
  /**
   * Null → the UI renders the branded crown placeholder. Null is a normal,
   * expected state (most named designs are not photographed yet) and must
   * not log a warning.
   */
  image: ProductImage | null;
  featured: boolean;
  status: ItemStatus;
}

export interface Collection extends NoPricing {
  slug: CollectionSlug;
  title: string;
  /** One short line for cards. */
  tagline: string;
  /** Two or three sentences for the collection page and its metadata. */
  description: string;
  /** Null → the UI renders the branded crown placeholder. */
  hero: ProductImage | null;
  /** Confirmed finishes that occur among the collection's public items. Derived. */
  finishes: Finish[];
  /**
   * "designs" for a collection of named designs (Golden Rim, Matt Black
   * Series); "items" for one that lists kinds of piece (Trays, Mug). Use
   * `collectionCountLabel(collection)` rather than reading this directly.
   */
  countAs: CountNoun;
  /**
   * Every item, INCLUDING the non-public ones (`status` "todo" and
   * "unconfirmed"). Components must not render this directly — use
   * `publicItems(collection)`.
   */
  items: CatalogueItem[];
}

// ---------------------------------------------------------------------------
// Photo manifest access (read-only view of ./products.ts)
// ---------------------------------------------------------------------------

/** Points at one photographed product in the generated manifest. */
interface ManifestRef {
  category: ProductCategorySlug;
  slug: string;
}

function manifestKey(ref: ManifestRef): string {
  return `${ref.category}/${ref.slug}`;
}

function findManifestProduct(ref: ManifestRef): Product | undefined {
  const category = getProductCategory(ref.category);
  return category
    ? category.products.find((product) => product.slug === ref.slug)
    : undefined;
}

function manifestCover(category: ProductCategorySlug | null): ProductImage | null {
  if (category === null) return null;
  const found = getProductCategory(category);
  return found ? found.cover : null;
}

/**
 * Where each OLD product category now lives. Used for two things:
 * 1. any manifest photo not placed by name below lands in this collection,
 *    so a photographed piece can never fall out of the catalogue;
 * 2. the legacy /products/* redirects.
 */
interface ManifestHome {
  collection: CollectionSlug;
  /**
   * The material every piece of that category is confirmed to be, or null
   * where the owner has not confirmed one for the whole category.
   */
  material: Material | null;
}

const manifestHome: Record<ProductCategorySlug, ManifestHome> = {
  // Only the plates and the cutlery are confirmed silver-plated.
  vintage: { collection: "heritage-silver", material: null },
  "bone-china": { collection: "bone-china", material: "bone-china" },
  melamine: { collection: "premium-melamine", material: "melamine" },
  glassware: { collection: "glassware", material: "glass" },
  // Chafing dish materials are unconfirmed.
  "chafing-dishes": { collection: "chafing-dishes", material: null },
};

/**
 * Path convention for photographs added after this phase. `index` counts from
 * 1: the lead photograph is `<slug>-1.webp`.
 */
export function cataloguePhotoPath(
  collection: CollectionSlug,
  slug: string,
  index: number = 1
): string {
  return `/images/catalogue/${collection}/${slug}-${index}.webp`;
}

// ---------------------------------------------------------------------------
// Source tables
// ---------------------------------------------------------------------------

/**
 * Values inferred from a name or a photograph and NOT confirmed by the owner.
 * Kept so the owner can be asked about them (docs/COPY_TO_CONFIRM.md). This
 * object stays on the seed: `buildItem` does not copy it, so it is never
 * rendered and never becomes a filter option.
 */
interface AssumedAttributes {
  material?: Material;
  finishes?: Finish[];
  pieces?: Piece[];
}

interface ItemSeed extends NoPricing {
  slug: string;
  /**
   * The display name. Omit only for a photographed piece that keeps exactly
   * the name it has in the manifest.
   */
  name?: string;
  /** Confirmed material, or null. An inferred one goes in `assumed`. */
  material: Material | null;
  /** Confirmed finishes. Inferred ones go in `assumed`. */
  finishes: Finish[];
  /** Confirmed pieces. Inferred ones go in `assumed`. */
  pieces: Piece[];
  assumed?: AssumedAttributes;
  /** The manifest photograph of this item, if there is one. */
  photo?: ManifestRef;
  featured?: boolean;
  status?: ItemStatus;
}

interface CollectionSeed extends NoPricing {
  title: string;
  tagline: string;
  description: string;
  /** Manifest category whose cover image is this collection's hero. */
  heroFrom: ProductCategorySlug | null;
  countAs: CountNoun;
  items: ItemSeed[];
}

/** Owner: every bone china design comes as these three. */
const BONE_CHINA_PIECES: Piece[] = [
  { type: "dinner-set", label: "Dinner Set" },
  { type: "soup-set", label: "Soup Set" },
  { type: "plate", label: "Quarter Plate" },
];

/**
 * Owner's catalogue: a melamine design is hired as a set of these two. Double
 * Color, 24KT Blue, Matt Melamine and 24KT Gold Melamine list nothing else.
 */
const MELAMINE_SET_PIECES: Piece[] = [
  { type: "dinner-set", label: "Dinner Set" },
  { type: "soup-set", label: "Soup Set" },
];

/** Owner's catalogue: the seven pieces of the Matt Black Series, and of it only. */
const MATT_BLACK_SERIES_PIECES: Piece[] = [
  { type: "dinner-set", label: "Dinner Set" },
  { type: "soup-set", label: "Soup Set" },
  { type: "bowl", label: "Chat Bowl (Big)" },
  { type: "bowl", label: "Chat Bowl (Small)" },
  { type: "plate", label: "Snack Plate (Big)" },
  { type: "plate", label: "Snack Plate (Small)" },
  { type: "plate", label: 'Nasta Plate 9"' },
];

/**
 * What the photographs of the other melamine designs appear to show. An
 * inference, so it is only ever used inside `assumed`.
 */
const PHOTOGRAPHED_MELAMINE_PIECES: Piece[] = [
  { type: "dinner-set", label: "Dinner Set" },
];

/** Owner's catalogue: the plain, marble and matt chat plates each come in two sizes. */
const CHAT_PLATE_SIZES: Piece[] = [
  { type: "plate", label: "Small" },
  { type: "plate", label: "Big" },
];

const CHAFING_DISH_PIECES: Piece[] = [
  { type: "chafing-dish", label: "Chafing Dish" },
];

const GLASS_PIECES: Piece[] = [{ type: "glass", label: "Glass" }];

/**
 * TODO(owner): six chafing-dish designs still to be supplied. Replace each
 * placeholder's slug, name, material and finishes, add its photograph (see
 * scripts/extract-catalogue-images.md §5), then set status "available".
 * While status is "todo" these are excluded by `publicItems` and every other
 * public helper, so they cannot appear on the site.
 */
const CHAFING_DISH_PLACEHOLDERS: ItemSeed[] = [1, 2, 3, 4, 5, 6].map(
  (n): ItemSeed => ({
    slug: `todo-design-${n}`,
    name: `TODO chafing dish design ${n}`,
    material: null,
    finishes: [],
    pieces: CHAFING_DISH_PIECES,
    status: "todo",
  })
);

const collectionSeeds: Record<CollectionSlug, CollectionSeed> = {
  // No photographs yet. The owner's list reads "silver-plated plates,
  // silver-plated cutlery, serving spoons, trays, tableware": only the plates
  // and the cutlery are confirmed silver-plated. The description keeps the
  // owner's order so "silver-plated" is not stretched over the other three.
  "heritage-silver": {
    title: "Vintage & Heritage Silver",
    tagline: "Silver-plated service for the formal table",
    description:
      "Silver-plated plates and silver-plated cutlery, with serving spoons, trays and tableware, for weddings and formal dinners. Ask us on WhatsApp which pieces are available for your date.",
    heroFrom: null,
    countAs: "items",
    items: [
      {
        slug: "silver-plated-plates",
        name: "Silver-Plated Plates",
        material: "silver-plated",
        finishes: [],
        assumed: { finishes: ["silver"] },
        pieces: [{ type: "plate", label: "Plate" }],
      },
      {
        slug: "silver-plated-cutlery",
        name: "Silver-Plated Cutlery",
        material: "silver-plated",
        finishes: [],
        assumed: { finishes: ["silver"] },
        pieces: [{ type: "cutlery", label: "Cutlery" }],
      },
      {
        slug: "serving-spoons",
        name: "Serving Spoons",
        material: null,
        finishes: [],
        assumed: { material: "silver-plated", finishes: ["silver"] },
        pieces: [{ type: "serving-spoon", label: "Serving Spoon" }],
      },
      {
        slug: "trays",
        name: "Trays",
        material: null,
        finishes: [],
        assumed: { material: "silver-plated", finishes: ["silver"] },
        pieces: [{ type: "tray", label: "Tray" }],
      },
      {
        slug: "tableware",
        name: "Tableware",
        material: null,
        finishes: [],
        assumed: { material: "silver-plated", finishes: ["silver"] },
        // Which pieces "tableware" covers has not been supplied.
        pieces: [],
      },
    ],
  },

  "bone-china": {
    title: "Bone China",
    tagline: "Dinner sets, soup sets and quarter plates",
    description:
      "Bone china in gold-rimmed, patterned and plain white designs. Each design is hired as a dinner set, a soup set and quarter plates.",
    heroFrom: "bone-china",
    countAs: "designs",
    // Finishes here are the ones the owner's design name states (Golden →
    // gold, Rose Gold → rose gold, Green Golden → green + gold, White →
    // white). Names inside this collection do not repeat "Bone China".
    items: [
      {
        slug: "clay-craft-golden",
        name: "Clay Craft Golden",
        material: "bone-china",
        finishes: ["gold"],
        pieces: BONE_CHINA_PIECES,
      },
      {
        slug: "rose-gold",
        name: "Rose Gold",
        material: "bone-china",
        finishes: ["rose-gold"],
        pieces: BONE_CHINA_PIECES,
      },
      {
        // MATCHED: same name as the manifest's "Golden Rim Bone China".
        slug: "golden-rim",
        name: "Golden Rim",
        material: "bone-china",
        finishes: ["gold"],
        pieces: BONE_CHINA_PIECES,
        photo: { category: "bone-china", slug: "golden-rim" },
        featured: true,
      },
      {
        // MATCHED: the source photograph is the owner's own file
        // "Green-Golden.jpeg" (scripts/normalize-images.py, KEEP table).
        slug: "green-golden",
        name: "Green Golden",
        material: "bone-china",
        finishes: ["green", "gold"],
        pieces: BONE_CHINA_PIECES,
        photo: { category: "bone-china", slug: "emerald-gold" },
        featured: true,
      },
      {
        // UNCONFIRMED, hidden. Probably the "Haldi Ivory" photograph below.
        // Showing both would list one design twice, so this entry stays out
        // of every public helper until the owner answers (OPEN_ISSUES O2).
        // If they are the same design: delete this entry and rename Haldi
        // Ivory if the owner prefers "Yellow". If not: set status "available".
        slug: "yellow",
        name: "Yellow",
        material: "bone-china",
        finishes: ["yellow"],
        pieces: BONE_CHINA_PIECES,
        status: "unconfirmed",
      },
      {
        // MATCHED: the source photograph is the owner's "Plain-White.jpeg".
        slug: "white",
        name: "White",
        material: "bone-china",
        finishes: ["white"],
        pieces: BONE_CHINA_PIECES,
        photo: { category: "bone-china", slug: "classic-white" },
      },
      {
        // UNCONFIRMED, hidden. Possibly the "Spiral Motif" photograph below.
        // Same handling as "Yellow" above.
        slug: "black-white",
        name: "Black-White",
        material: "bone-china",
        finishes: ["black", "white"],
        pieces: BONE_CHINA_PIECES,
        status: "unconfirmed",
      },
      {
        // Photographed piece. The name is the previous site's, not the
        // owner's list, so it confirms no finish.
        slug: "haldi-ivory",
        name: "Haldi Ivory",
        material: "bone-china",
        finishes: [],
        assumed: { finishes: ["ivory", "gold"] },
        pieces: BONE_CHINA_PIECES,
        photo: { category: "bone-china", slug: "haldi-ivory" },
      },
      {
        // Photographed piece. Same as above.
        slug: "spiral-motif",
        name: "Spiral Motif",
        material: "bone-china",
        finishes: [],
        assumed: { finishes: ["black", "white"] },
        pieces: BONE_CHINA_PIECES,
        photo: { category: "bone-china", slug: "spiral-motif" },
      },
    ],
  },

  "premium-melamine": {
    title: "Premium Melamine",
    tagline: "Melamine with a finer finish",
    description:
      'Our premium melamine designs. Double Color and 24KT Blue are hired as dinner sets and soup sets; the Matt Black Series also comes as chat bowls, snack plates and a 9" nasta plate.',
    heroFrom: "melamine",
    countAs: "designs",
    items: [
      {
        slug: "double-color",
        name: "Double Color",
        material: "melamine",
        // The two colours have not been supplied.
        finishes: [],
        pieces: MELAMINE_SET_PIECES,
      },
      {
        slug: "24kt-blue",
        name: "24KT Blue",
        material: "melamine",
        finishes: ["blue"],
        pieces: MELAMINE_SET_PIECES,
      },
      {
        // MATCHED: same name as the manifest's "Matt Black Melamine".
        slug: "matt-black-series",
        name: "Matt Black Series",
        material: "melamine",
        finishes: ["matt", "black"],
        pieces: MATT_BLACK_SERIES_PIECES,
        photo: { category: "melamine", slug: "matt-black" },
        featured: true,
      },
      // The six photographed melamine designs below could not be matched to
      // an owner-listed name. Each is shown under the previous site's name
      // without the word "Melamine" (the manifest has "Blue Rim Melamine
      // Set" and so on). Those names are not the owner's, so they confirm no
      // finish; the finishes and the pieces read off the photographs are in
      // `assumed`. Whether each belongs in Premium or Regular Melamine is TO
      // CONFIRM.
      {
        slug: "blue-rim",
        name: "Blue Rim",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: { finishes: ["blue"], pieces: PHOTOGRAPHED_MELAMINE_PIECES },
        photo: { category: "melamine", slug: "blue-rim" },
      },
      {
        slug: "sky-blue",
        name: "Sky Blue",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: { finishes: ["blue"], pieces: PHOTOGRAPHED_MELAMINE_PIECES },
        photo: { category: "melamine", slug: "sky-blue" },
      },
      {
        slug: "ribbed-white",
        name: "Ribbed White",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: { finishes: ["white"], pieces: PHOTOGRAPHED_MELAMINE_PIECES },
        photo: { category: "melamine", slug: "ribbed-white" },
      },
      {
        slug: "textured-ivory",
        name: "Textured Ivory",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: { finishes: ["ivory"], pieces: PHOTOGRAPHED_MELAMINE_PIECES },
        photo: { category: "melamine", slug: "textured-ivory" },
      },
      {
        slug: "gold-medallion",
        name: "Gold Medallion",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: { finishes: ["gold"], pieces: PHOTOGRAPHED_MELAMINE_PIECES },
        photo: { category: "melamine", slug: "gold-medallion" },
      },
      {
        slug: "blue-gold-border",
        name: "Blue & Gold Border",
        material: "melamine",
        finishes: [],
        pieces: [],
        assumed: {
          finishes: ["blue", "gold"],
          pieces: PHOTOGRAPHED_MELAMINE_PIECES,
        },
        photo: { category: "melamine", slug: "blue-gold-border" },
      },
    ],
  },

  "regular-melamine": {
    title: "Regular Melamine",
    tagline: "Everyday melamine service",
    description:
      "Matt Melamine and 24KT Gold Melamine — straightforward melamine service for everyday functions. Each is hired as a dinner set and a soup set.",
    heroFrom: null,
    countAs: "designs",
    // The owner's names are "Matt Melamine" and "24KT Gold Melamine"; inside
    // this collection they are shown without the word "Melamine".
    items: [
      {
        slug: "matt-melamine",
        name: "Matt",
        material: "melamine",
        finishes: ["matt"],
        pieces: MELAMINE_SET_PIECES,
      },
      {
        slug: "24kt-gold-melamine",
        name: "24KT Gold",
        material: "melamine",
        finishes: ["gold"],
        pieces: MELAMINE_SET_PIECES,
      },
    ],
  },

  // The owner's catalogue lists eleven lines under "Chat Plates": Rectangular,
  // Dessert Bowl, Snack Plate, Mug, Small, Big, Blue Handle, Marble Small,
  // Marble Big, Matt Small, Matt Big. Each line is here exactly once: Marble
  // and Matt each carry their Small and Big, and the plain Small and Big are
  // the two sizes of one entry. The catalogue gives that entry no name; "Chat
  // Plate" is ours, taken from the heading, so the entry is "unconfirmed" and
  // hidden until the owner names it. Confirmed: the other names, the sizes,
  // the finishes the list states (blue handle → blue, marble, matt) and the
  // piece a name states (dessert bowl, snack plate, mug). NOT confirmed, and
  // so in `assumed`: the material (melamine) and what "rectangular" is a
  // piece of. The one value here that is read rather than stated: Marble and
  // Matt are filed as plates because the catalogue's heading is "Chat Plates"
  // (docs/COPY_TO_CONFIRM.md §9).
  "chat-and-snack-plates": {
    title: "Chat & Snack Plates",
    tagline: "Small plates and bowls for counters and starters",
    description:
      "Chat plates, snack plates, dessert bowls and mugs, in small and big sizes and in marble and matt finishes.",
    heroFrom: null,
    countAs: "items",
    items: [
      {
        slug: "rectangular",
        name: "Rectangular",
        material: null,
        finishes: [],
        pieces: [],
        assumed: {
          material: "melamine",
          pieces: [{ type: "plate", label: "Rectangular Plate" }],
        },
      },
      {
        slug: "dessert-bowl",
        name: "Dessert Bowl",
        material: null,
        finishes: [],
        pieces: [{ type: "bowl", label: "Dessert Bowl" }],
        assumed: { material: "melamine" },
      },
      {
        slug: "snack-plate",
        name: "Snack Plate",
        material: null,
        finishes: [],
        pieces: [{ type: "plate", label: "Snack Plate" }],
        assumed: { material: "melamine" },
      },
      {
        slug: "mug",
        name: "Mug",
        material: null,
        finishes: [],
        pieces: [{ type: "mug", label: "Mug" }],
        assumed: { material: "melamine" },
      },
      {
        // UNCONFIRMED, hidden. The catalogue's plain "Small" and "Big" lines;
        // the name is ours. Set status "available" once the owner names it.
        slug: "chat-plate",
        name: "Chat Plate",
        material: null,
        finishes: [],
        pieces: CHAT_PLATE_SIZES,
        assumed: { material: "melamine" },
        status: "unconfirmed",
      },
      {
        slug: "blue-handle",
        name: "Blue Handle",
        material: null,
        finishes: ["blue"],
        // Which piece has the blue handle has not been supplied.
        pieces: [],
        assumed: { material: "melamine" },
      },
      {
        slug: "marble",
        name: "Marble",
        material: null,
        finishes: ["marble"],
        pieces: CHAT_PLATE_SIZES,
        assumed: { material: "melamine" },
      },
      {
        slug: "matt",
        name: "Matt",
        material: null,
        finishes: ["matt"],
        pieces: CHAT_PLATE_SIZES,
        assumed: { material: "melamine" },
      },
    ],
  },

  // Five photographed chafing dishes plus six owner placeholders. The owner
  // has supplied neither names nor materials, so every material and finish is
  // null/empty and the guesses (read off the photographs) are in `assumed`.
  //
  // KNOWN GAP: each item keeps its manifest name (no `name` here), and those
  // names — like the manifest alt text — name a metal ("Round Brass Chafing
  // Dish"). They are carried over from the previous site and can only be
  // changed in the KEEP table of scripts/normalize-images.py. Listed for the
  // owner in docs/COPY_TO_CONFIRM.md §1.
  "chafing-dishes": {
    title: "Chafing Dishes & Buffet Display",
    tagline: "For the buffet line",
    description:
      "Chafing dishes for the buffet line, in round, square and handi shapes. We hold more designs than are photographed here.",
    heroFrom: "chafing-dishes",
    countAs: "designs",
    items: [
      {
        slug: "brass-round",
        material: null,
        finishes: [],
        assumed: { material: "brass", finishes: ["brass"] },
        pieces: CHAFING_DISH_PIECES,
        photo: { category: "chafing-dishes", slug: "brass-round" },
      },
      {
        slug: "silver-carved-stand",
        material: null,
        finishes: [],
        assumed: { material: "steel", finishes: ["silver"] },
        pieces: CHAFING_DISH_PIECES,
        photo: { category: "chafing-dishes", slug: "silver-carved-stand" },
      },
      {
        slug: "gold-hammered-square",
        material: null,
        finishes: [],
        assumed: { material: "steel", finishes: ["gold"] },
        pieces: CHAFING_DISH_PIECES,
        photo: { category: "chafing-dishes", slug: "gold-hammered-square" },
      },
      {
        slug: "brass-handi",
        material: null,
        finishes: [],
        assumed: { material: "brass", finishes: ["brass"] },
        pieces: CHAFING_DISH_PIECES,
        photo: { category: "chafing-dishes", slug: "brass-handi" },
        featured: true,
      },
      {
        slug: "copper-ribbed-dome",
        material: null,
        finishes: [],
        assumed: { material: "copper", finishes: ["copper"] },
        pieces: CHAFING_DISH_PIECES,
        photo: { category: "chafing-dishes", slug: "copper-ribbed-dome" },
        featured: true,
      },
      ...CHAFING_DISH_PLACEHOLDERS,
    ],
  },

  // TODO(owner): no items supplied yet. The collection page shows
  // `catalogueCopy.emptyCollection` until this list has entries.
  "cutlery-and-serveware": {
    title: "Cutlery & Serveware",
    tagline: "Cutlery and serving pieces",
    description:
      "Cutlery and serving pieces to go with the crockery. The list is not on the website yet — tell us what you need and we will confirm what we hold.",
    heroFrom: null,
    countAs: "items",
    items: [],
  },

  // Not in the owner's list of collections. Kept because four photographed
  // glasses exist and the founders' story mentions glassware. TO CONFIRM.
  // Glassware is glass (confirmed); "clear" was read off the photographs.
  glassware: {
    title: "Glassware",
    tagline: "Tumblers and wine glasses",
    description:
      "Plain glassware: water tumblers, highball and rocks tumblers, and wine glasses.",
    heroFrom: "glassware",
    countAs: "designs",
    items: [
      {
        slug: "highball",
        material: "glass",
        finishes: [],
        assumed: { finishes: ["clear"] },
        pieces: GLASS_PIECES,
        photo: { category: "glassware", slug: "highball" },
      },
      {
        slug: "wine-glass",
        material: "glass",
        finishes: [],
        assumed: { finishes: ["clear"] },
        pieces: GLASS_PIECES,
        photo: { category: "glassware", slug: "wine-glass" },
        featured: true,
      },
      {
        slug: "rocks-tumbler",
        material: "glass",
        finishes: [],
        assumed: { finishes: ["clear"] },
        pieces: GLASS_PIECES,
        photo: { category: "glassware", slug: "rocks-tumbler" },
      },
      {
        slug: "water-tumbler",
        material: "glass",
        finishes: [],
        assumed: { finishes: ["clear"] },
        pieces: GLASS_PIECES,
        photo: { category: "glassware", slug: "water-tumbler" },
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

function itemId(collection: CollectionSlug, slug: string): string {
  return `${collection}--${slug}`;
}

/**
 * Null when a seed has neither a name nor a manifest photograph to name it.
 * `seed.assumed` is deliberately not copied: unconfirmed values stop here.
 */
function buildItem(
  collection: CollectionSlug,
  seed: ItemSeed
): CatalogueItem | null {
  const product = seed.photo ? findManifestProduct(seed.photo) : undefined;
  const name = seed.name ?? (product ? product.name : undefined);
  if (name === undefined) return null;

  return {
    id: itemId(collection, seed.slug),
    slug: seed.slug,
    name,
    collection,
    material: seed.material,
    finishes: seed.finishes,
    pieces: seed.pieces,
    image: product ? product.image : null,
    featured: seed.featured ?? false,
    status: seed.status ?? "available",
  };
}

/** Every manifest photograph that a seed above has claimed. */
const placedPhotoKeys: string[] = [];
for (const slug of collectionSlugs) {
  for (const seed of collectionSeeds[slug].items) {
    if (seed.photo) placedPhotoKeys.push(manifestKey(seed.photo));
  }
}

/**
 * Safety net: a photograph added to the manifest later, and not yet placed by
 * a seed, still appears — under its manifest name, in its category's home
 * collection. A photographed piece therefore cannot drop out of the catalogue.
 */
function unplacedManifestItems(collection: CollectionSlug): CatalogueItem[] {
  const items: CatalogueItem[] = [];
  for (const category of productCategories) {
    const home = manifestHome[category.slug];
    if (home.collection !== collection) continue;
    for (const product of category.products) {
      const key = manifestKey({ category: category.slug, slug: product.slug });
      if (placedPhotoKeys.indexOf(key) !== -1) continue;
      items.push({
        id: itemId(collection, product.slug),
        slug: product.slug,
        name: product.name,
        collection,
        material: home.material,
        finishes: [],
        pieces: [],
        image: product.image,
        featured: false,
        status: "available",
      });
    }
  }
  return items;
}

/** True only for "available": drops both "todo" and "unconfirmed". */
function isPublic(item: CatalogueItem): boolean {
  return item.status === "available";
}

function finishesOf(items: CatalogueItem[]): Finish[] {
  return finishOrder.filter((finish) =>
    items.some((item) => item.finishes.indexOf(finish) !== -1)
  );
}

function buildCollection(slug: CollectionSlug): Collection {
  const seed = collectionSeeds[slug];

  const built: CatalogueItem[] = [];
  for (const itemSeed of seed.items) {
    const item = buildItem(slug, itemSeed);
    if (item !== null) built.push(item);
  }
  const all = built.concat(unplacedManifestItems(slug));

  // Display order: photographed designs first, then named designs awaiting a
  // photograph, then the non-public entries (placeholders and unconfirmed
  // names — never rendered). Order within each group is the order of the
  // table above.
  const photographed = all.filter((item) => isPublic(item) && item.image !== null);
  const unphotographed = all.filter((item) => isPublic(item) && item.image === null);
  const hidden = all.filter((item) => !isPublic(item));
  const items = photographed.concat(unphotographed, hidden);

  return {
    slug,
    title: seed.title,
    tagline: seed.tagline,
    description: seed.description,
    hero: manifestCover(seed.heroFrom),
    finishes: finishesOf(items.filter(isPublic)),
    countAs: seed.countAs,
    items,
  };
}

const collectionsBySlug: Record<CollectionSlug, Collection> = {
  "heritage-silver": buildCollection("heritage-silver"),
  "bone-china": buildCollection("bone-china"),
  "premium-melamine": buildCollection("premium-melamine"),
  "regular-melamine": buildCollection("regular-melamine"),
  "chat-and-snack-plates": buildCollection("chat-and-snack-plates"),
  "chafing-dishes": buildCollection("chafing-dishes"),
  "cutlery-and-serveware": buildCollection("cutlery-and-serveware"),
  glassware: buildCollection("glassware"),
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All eight collections, in display order. */
export const collections: Collection[] = collectionSlugs.map(
  (slug) => collectionsBySlug[slug]
);

export function getCollection(slug: CollectionSlug): Collection {
  return collectionsBySlug[slug];
}

/** Type guard for an untrusted string such as a route param. */
export function isCollectionSlug(value: string): value is CollectionSlug {
  return collectionSlugs.some((slug) => slug === value);
}

/** For `/collections/[slug]`: undefined → call `notFound()`. */
export function findCollection(slug: string): Collection | undefined {
  return isCollectionSlug(slug) ? collectionsBySlug[slug] : undefined;
}

/**
 * The items of a collection that may be rendered: `status: "available"` only.
 * Drops "todo" placeholders and "unconfirmed" names alike.
 */
export function publicItems(collection: Collection): CatalogueItem[] {
  return collection.items.filter(isPublic);
}

/** Every renderable item across all collections, in display order. */
export const allPublicItems: CatalogueItem[] = collections.reduce<
  CatalogueItem[]
>((items, collection) => items.concat(publicItems(collection)), []);

/** Looks up a public item by its global id. Hidden items are never returned. */
export function getItem(id: string): CatalogueItem | undefined {
  return allPublicItems.find((item) => item.id === id);
}

/** A collection whose `hero` is known to exist. */
export type PhotographedCollection = Collection & { hero: ProductImage };

function hasHero(collection: Collection): collection is PhotographedCollection {
  return collection.hero !== null;
}

/**
 * Collections that have a photograph to lead with (`hero` is not null), in
 * display order. These are shown as image tiles. Derived.
 */
export const collectionsWithPhotograph: PhotographedCollection[] =
  collections.filter(hasHero);

/**
 * Collections with no photograph (`hero` is null), in display order. Show
 * these as a compact text row under `catalogueCopy.textOnly.rowHeading`, not
 * as blank image tiles. Derived.
 */
export const collectionsWithoutPhotograph: Collection[] = collections.filter(
  (collection) => collection.hero === null
);

/**
 * True when at least one public item of the collection has a photograph.
 * False → list the collection's items as text (`catalogueCopy.textOnly`)
 * rather than as a grid of placeholder tiles.
 */
export function collectionHasPhotographs(collection: Collection): boolean {
  return publicItems(collection).some((item) => item.image !== null);
}

/** Public items flagged for the home page. All of them have photographs. */
export const featuredItems: CatalogueItem[] = allPublicItems.filter(
  (item) => item.featured
);

export interface ItemFilter {
  material?: Material;
  finish?: Finish;
  piece?: PieceType;
}

/** Items matching every criterion that is set. An empty filter returns all. */
export function filterItems(
  items: CatalogueItem[],
  filter: ItemFilter
): CatalogueItem[] {
  const { material, finish, piece } = filter;
  return items.filter(
    (item) =>
      (material === undefined || item.material === material) &&
      (finish === undefined || item.finishes.indexOf(finish) !== -1) &&
      (piece === undefined || item.pieces.some((p) => p.type === piece))
  );
}

export interface FilterOptions {
  materials: Material[];
  finishes: Finish[];
  pieces: PieceType[];
}

/**
 * The filter values that actually occur in `items`, in a fixed order.
 *
 * Only confirmed values can be offered: an item's `material`, `finishes` and
 * `pieces` never hold an assumption, and non-public items are ignored here
 * even if the caller passes them in.
 */
export function filterOptions(items: CatalogueItem[]): FilterOptions {
  const visible = items.filter(isPublic);
  return {
    materials: materialOrder.filter((material) =>
      visible.some((item) => item.material === material)
    ),
    finishes: finishesOf(visible),
    pieces: pieceTypeOrder.filter((piece) =>
      visible.some((item) => item.pieces.some((p) => p.type === piece))
    ),
  };
}

/** Filter options for one collection's public items. */
export function collectionFilterOptions(collection: Collection): FilterOptions {
  return filterOptions(publicItems(collection));
}

/** Number of public entries in one collection. Hidden entries are not counted. */
export function collectionDesignCount(collection: Collection): number {
  return publicItems(collection).length;
}

/**
 * The count line of a collection's card and page: "7 designs", "5 items", or
 * `catalogueCopy.landing.cardEmpty` when nothing is listed. Derived from the
 * public items only.
 */
export function collectionCountLabel(collection: Collection): string {
  const count = collectionDesignCount(collection);
  const { landing } = catalogueCopy;
  if (count === 0) return landing.cardEmpty;
  return collection.countAs === "designs"
    ? landing.cardCount(count)
    : landing.cardItemCount(count);
}

/** Number of collections. Derived. */
export const collectionCount: number = collections.length;

/** A catalogue item as one line of a WhatsApp quote request. */
export function toQuoteLine(item: CatalogueItem): QuoteLine {
  return {
    name: item.name,
    collectionTitle: collectionsBySlug[item.collection].title,
  };
}

// ---------------------------------------------------------------------------
// Legacy redirects (/products → /collections)
// ---------------------------------------------------------------------------

/** Same shape as an entry of `redirects()` in next.config. */
export interface LegacyRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const LEGACY_PRODUCTS_ROUTE = "/products";

export const legacyRedirects: LegacyRedirect[] = [
  {
    source: LEGACY_PRODUCTS_ROUTE,
    destination: routes.collections,
    permanent: true,
  },
  ...productCategories.map(
    (category): LegacyRedirect => ({
      source: `${LEGACY_PRODUCTS_ROUTE}/${category.slug}`,
      destination: collectionPath(manifestHome[category.slug].collection),
      permanent: true,
    })
  ),
];

// ---------------------------------------------------------------------------
// Catalogue UI copy
// ---------------------------------------------------------------------------

export interface CatalogueLandingCopy {
  eyebrow: string;
  heading: string;
  /** Takes the derived number of collections. No design count is stated. */
  lead: (collectionTotal: number) => string;
  /** Count line for a collection of named designs. Prefer `collectionCountLabel`. */
  cardCount: (designs: number) => string;
  /** Count line for a collection that lists kinds of piece. Prefer `collectionCountLabel`. */
  cardItemCount: (items: number) => string;
  /** Count line on a card for a collection with nothing listed yet. */
  cardEmpty: string;
  /**
   * Accessible name of a collection card link. Begins with the visible title
   * (WCAG 2.5.3); the tagline and the count describe the link.
   */
  cardLinkLabel: (collectionTitle: string) => string;
  /** Closing note under the grid, followed by the WhatsApp link. */
  footnote: string;
  footnoteCta: string;
}

export interface CollectionPageCopy {
  /** aria-label of the breadcrumb <nav>. */
  breadcrumbLabel: string;
  backLabel: string;
  /** Heading of the items grid, for assistive technology. */
  itemsHeading: (collectionTitle: string) => string;
  enquireHeading: (collectionTitle: string) => string;
  enquireBody: string;
  enquireCta: string;
  otherCollectionsHeading: string;
}

export interface FilterCopy {
  /** Heading / aria-label of the filter region. */
  heading: string;
  materialLabel: string;
  finishLabel: string;
  pieceLabel: string;
  /** The "no filter" option in each group. */
  all: string;
  clear: string;
  /** Announced in a polite live region when the result set changes. */
  /** `noun` follows the collection's `countAs` ("5 items" vs "5 designs"). */
  resultCount: (shown: number, total: number, noun?: CountNoun) => string;
  emptyHeading: string;
  emptyBody: string;
}

export interface ItemCopy {
  ratesOnRequest: string;
  addToQuote: string;
  added: string;
  remove: string;
  /** Visible text of the per-item WhatsApp action, on the card and in the drawer. */
  askOnWhatsApp: string;
  /**
   * Accessible names that add the item's name. Each BEGINS with the visible
   * label it goes with (`addToQuote`, `remove`, `askOnWhatsApp`, the item
   * name), so the name always contains what is on screen (WCAG 2.5.3).
   */
  addToQuoteLabel: (itemName: string) => string;
  removeFromQuoteLabel: (itemName: string) => string;
  askOnWhatsAppLabel: (itemName: string) => string;
  viewDetailsLabel: (itemName: string) => string;
  /** Shown on items whose `image` is null. */
  photoPending: string;
  /** Accessible name of the crown placeholder. */
  placeholderAlt: (itemName: string) => string;
}

export interface ItemDrawerCopy {
  /** aria-label of the dialog. */
  label: (itemName: string) => string;
  close: string;
  collectionLabel: string;
  materialLabel: string;
  finishLabel: string;
  piecesHeading: string;
  /** Shown instead of the list when `pieces` is empty. */
  piecesOnRequest: string;
  /** Shown instead of the value when `finishes` is empty. */
  finishOnRequest: string;
}

export interface QuoteBasketCopy {
  title: string;
  lead: string;
  /** aria-label of the button that opens the basket. */
  openLabel: (count: number) => string;
  closeLabel: string;
  count: (count: number) => string;
  emptyHeading: string;
  emptyBody: string;
  browseCta: string;
  send: string;
  clear: string;
  removeItemLabel: (itemName: string) => string;
  /** Announced in a polite live region. */
  addedAnnouncement: (itemName: string) => string;
  removedAnnouncement: (itemName: string) => string;
  clearedAnnouncement: string;
}

export interface EmptyCollectionCopy {
  heading: string;
  body: string;
  cta: string;
}

/**
 * For collections that have no photographs. Everything else such a row or
 * list needs already exists: the collection's `title` and `tagline`,
 * `collectionCountLabel(collection)`, `collectionPage.itemsHeading`, and the
 * item's `name`, pieces and `item.askOnWhatsApp`.
 */
export interface TextOnlyCopy {
  /**
   * Heading of the compact text row that lists `collectionsWithoutPhotograph`
   * on the catalogue landing and in the "other collections" strip. Each entry
   * of the row is the collection's title, its tagline and its count label.
   */
  rowHeading: string;
  /**
   * One line shown with the text list of items on the page of a collection
   * for which `collectionHasPhotographs` is false.
   */
  listNote: string;
}

export interface CatalogueCopy {
  landing: CatalogueLandingCopy;
  collectionPage: CollectionPageCopy;
  filters: FilterCopy;
  item: ItemCopy;
  drawer: ItemDrawerCopy;
  basket: QuoteBasketCopy;
  /** For a collection with no public items (cutlery-and-serveware today). */
  emptyCollection: EmptyCollectionCopy;
  textOnly: TextOnlyCopy;
  /** A note shown under a collection's grid; null when there is none. */
  collectionNotes: Record<CollectionSlug, string | null>;
}

function countDesigns(count: number): string {
  return count === 1 ? "1 design" : `${count} designs`;
}

function countItems(count: number): string {
  return count === 1 ? "1 item" : `${count} items`;
}

export const catalogueCopy: CatalogueCopy = {
  landing: {
    eyebrow: "The catalogue",
    heading: "Collections",
    lead: (collectionTotal) =>
      `Our crockery and tableware on hire, in ${collectionTotal} collections. Add what you like to a quote list and send it to us on WhatsApp.`,
    cardCount: countDesigns,
    cardItemCount: countItems,
    cardEmpty: "Ask us for the list",
    cardLinkLabel: (collectionTitle) => `${collectionTitle} collection`,
    footnote: "Rates depend on your dates, quantities and delivery location.",
    footnoteCta: "Ask for a quote on WhatsApp",
  },
  collectionPage: {
    breadcrumbLabel: "Breadcrumb",
    backLabel: "All collections",
    itemsHeading: (collectionTitle) => `${collectionTitle} designs`,
    enquireHeading: (collectionTitle) =>
      `Need ${collectionTitle} for a date?`,
    enquireBody:
      "Tell us your event date and guest count, and we will confirm what is available.",
    enquireCta: "Enquire on WhatsApp",
    otherCollectionsHeading: "Other collections",
  },
  filters: {
    heading: "Filter designs",
    materialLabel: "Material",
    finishLabel: "Finish",
    pieceLabel: "Piece",
    all: "All",
    clear: "Clear filters",
    resultCount: (shown, total, noun = "designs") => {
      const totalLabel = noun === "items" ? countItems(total) : countDesigns(total);
      return shown === total ? `Showing all ${totalLabel}` : `Showing ${shown} of ${totalLabel}`;
    },
    emptyHeading: "No designs match these filters",
    emptyBody:
      "Clear the filters to see the whole collection, or ask us on WhatsApp — not everything we hold is listed here.",
  },
  item: {
    ratesOnRequest: "Rates on request",
    addToQuote: "Add to quote",
    added: "Added",
    remove: "Remove",
    askOnWhatsApp: "Ask on WhatsApp",
    addToQuoteLabel: (itemName) => `Add to quote: ${itemName}`,
    removeFromQuoteLabel: (itemName) =>
      `Remove ${itemName} from your quote list`,
    askOnWhatsAppLabel: (itemName) => `Ask on WhatsApp about ${itemName}`,
    viewDetailsLabel: (itemName) => `${itemName} — view details`,
    photoPending: "Photograph to follow — ask us for a picture",
    placeholderAlt: (itemName) => `${itemName} — photograph to follow`,
  },
  drawer: {
    label: (itemName) => `${itemName} details`,
    close: "Close details",
    collectionLabel: "Collection",
    materialLabel: "Material",
    finishLabel: "Finish",
    piecesHeading: "Available as",
    piecesOnRequest: "Ask us which pieces are available",
    finishOnRequest: "Ask us",
  },
  basket: {
    title: "Your quote list",
    lead: "Send this list to us on WhatsApp and we will reply with availability and rates.",
    openLabel: (count) =>
      count === 0
        ? "Open your quote list"
        : `Open your quote list, ${count === 1 ? "1 item" : `${count} items`}`,
    closeLabel: "Close quote list",
    count: (count) => (count === 1 ? "1 item" : `${count} items`),
    emptyHeading: "Your quote list is empty",
    emptyBody:
      "Add the designs you are interested in and send them to us in one message.",
    browseCta: "Browse the collections",
    send: "Send list on WhatsApp",
    clear: "Clear list",
    removeItemLabel: (itemName) => `Remove ${itemName} from your quote list`,
    addedAnnouncement: (itemName) => `${itemName} added to your quote list`,
    removedAnnouncement: (itemName) =>
      `${itemName} removed from your quote list`,
    clearedAnnouncement: "Quote list cleared",
  },
  emptyCollection: {
    heading: "This list is not on the website yet",
    body: "Tell us what you need and we will confirm what we hold for your date.",
    cta: "Ask on WhatsApp",
  },
  textOnly: {
    rowHeading: "Also on hire — ask us for photographs",
    listNote:
      "This collection has not been photographed yet. Photographs on request — ask us on WhatsApp.",
  },
  collectionNotes: {
    // Its "not photographed yet" note is now `textOnly.listNote`, which every
    // collection without photographs shows.
    "heritage-silver": null,
    "bone-china": null,
    "premium-melamine": null,
    "regular-melamine": null,
    "chat-and-snack-plates": null,
    "chafing-dishes":
      "More chafing dish designs are available on request — ask us for the full list.",
    "cutlery-and-serveware": null,
    glassware: null,
  },
};
