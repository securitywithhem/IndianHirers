/**
 * `/design-system` content — the visual QA sheet for the tokens, the type
 * scale and the base components (Docs/UI_UX_V2.md).
 *
 * The page exists under `next dev` only, is `noindex` and is not in `routes`,
 * so it never reaches the navigation or the sitemap.
 *
 * Nothing is invented for the specimens: the product cards are real catalogue
 * items, the finish labels are the catalogue's own, and the sample sentences
 * are the brand tagline and the site description. The labels below name
 * tokens and classes; they are written for the people who build the site.
 *
 * Every class string here is complete and literal — Tailwind reads this file
 * and can only generate a class it finds written out in full.
 */
import {
  allPublicItems,
  catalogueCopy,
  featuredItems,
  finishLabels,
  toQuoteLine,
  type CatalogueItem,
  type Finish,
} from "./collections";
import type { ProductImage } from "./products";
import { brand, siteMetadata, whatsappMessages, type RouteMetadata } from "./site";

/** A colour shown as a block, with its name and role beside it. */
export interface Swatch {
  /** Token or role name, as written in a class (`maroon-950`, `background`). */
  name: string;
  /** The `bg-*` utility that paints it. */
  className: string;
  note: string;
}

/** One text colour on one surface, shown as a sentence. */
export interface TextPair {
  /** `<text role> on <surface role>`. */
  name: string;
  surfaceClass: string;
  textClass: string;
}

export interface TypeSpecimen {
  /** The `type-*` class. */
  className: string;
  /** Family, weight and size range. */
  spec: string;
  sample: string;
}

export type SpecimenButtonVariant =
  | "default"
  | "gold"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
  | "whatsapp";

export interface ButtonSpecimen {
  variant: SpecimenButtonVariant;
  label: string;
}

/** A named class shown on a plain tile: a shadow, a radius, a surface. */
export interface ClassSpecimen {
  name: string;
  className: string;
  note: string;
}

export interface ProductSpecimen {
  id: string;
  name: string;
  image: ProductImage | null;
  finishes: string[];
  ask: { label: string; ariaLabel: string; message: string };
}

export interface DesignSystemSection {
  heading: string;
  lead: string;
}

export interface DesignSystemContent {
  metadata: RouteMetadata;
  hero: { eyebrow: string; heading: string; lead: string };
  /** Titles of the two panels every specimen is shown in. */
  scopes: { light: string; dark: string };
  colour: DesignSystemSection & {
    primitivesHeading: string;
    primitives: Swatch[];
    rolesHeading: string;
    roles: Swatch[];
    pairsHeading: string;
    pairs: TextPair[];
    pairSample: string;
  };
  type: DesignSystemSection & { specimens: TypeSpecimen[] };
  buttons: DesignSystemSection & {
    variants: ButtonSpecimen[];
    smallLabel: string;
    disabledLabel: string;
    focusLabel: string;
    statesNote: string;
  };
  chips: DesignSystemSection & {
    filterLabel: string;
    filters: { label: string; selected: boolean }[];
    tagsLabel: string;
    tags: string[];
  };
  ornaments: DesignSystemSection & {
    crownLabel: string;
    crownDrawLabel: string;
    dividerLabel: string;
    ruleLabel: string;
    placeholderLabel: string;
    archLabel: string;
    archFramedLabel: string;
    /** Null only if the catalogue ever loses every featured photograph. */
    archImage: ProductImage | null;
  };
  heading: DesignSystemSection & {
    centred: { eyebrow: string; heading: string; lead: string };
    start: { eyebrow: string; heading: string; lead: string };
  };
  cards: DesignSystemSection & { finishesLabel: string; products: ProductSpecimen[] };
  surfaces: DesignSystemSection & {
    surfaces: ClassSpecimen[];
    scrimLabel: string;
    scrimSample: string;
    shadowsHeading: string;
    shadows: ClassSpecimen[];
    radiusHeading: string;
    radii: ClassSpecimen[];
  };
}

const FILTER_FINISHES: Finish[] = ["gold", "silver", "matt", "white"];
const TAG_FINISHES: Finish[] = ["gold", "rose-gold", "ivory"];

function toSpecimen(item: CatalogueItem): ProductSpecimen {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    finishes: item.finishes.map((finish) => finishLabels[finish]),
    ask: {
      label: catalogueCopy.item.askOnWhatsApp,
      ariaLabel: catalogueCopy.item.askOnWhatsAppLabel(item.name),
      message: whatsappMessages.itemQuote(item, toQuoteLine(item).collectionTitle),
    },
  };
}

/** Three photographed designs, then one without a photograph (the crown placeholder). */
function productSpecimens(): ProductSpecimen[] {
  const photographed = featuredItems.slice(0, 3);
  const unphotographed = allPublicItems.find((item) => item.image === null && item.finishes.length > 0);
  return (unphotographed ? [...photographed, unphotographed] : photographed).map(toSpecimen);
}

const ARCH_ITEM: CatalogueItem | undefined = featuredItems[0];

export const designSystem: DesignSystemContent = {
  metadata: {
    title: "Design system",
    description: `Tokens, type scale and base components of the ${brand.name} website. A build reference, not a public page.`,
    path: "/design-system",
    index: false,
  },
  hero: {
    eyebrow: "Build reference",
    heading: "The Royal Banquet Table",
    lead: "Every token, type role and base component, on ivory and on maroon. Spec: Docs/UI_UX_V2.md.",
  },
  scopes: {
    light: "On ivory",
    dark: "On maroon — .theme-dark",
  },
  colour: {
    heading: "Colour",
    lead: "Primitives are fixed. Roles flip with the scope: the same class is ivory-and-espresso here and maroon-and-gold inside .theme-dark.",
    primitivesHeading: "Primitive scales",
    primitives: [
      { name: "maroon-950", className: "bg-maroon-950", note: "Deepest wall: footer, hero" },
      { name: "maroon-800", className: "bg-maroon-800", note: "Primary dark surface" },
      { name: "maroon-700", className: "bg-maroon-700", note: "The logo mark exactly" },
      { name: "gold-700", className: "bg-gold-700", note: "Gold as text on ivory" },
      { name: "gold-500", className: "bg-gold-500", note: "Lines, ornament, fills" },
      { name: "gold-300", className: "bg-gold-300", note: "Gold text and ring on maroon" },
      { name: "ivory-50", className: "bg-ivory-50", note: "Page, cards" },
      { name: "ivory-100", className: "bg-ivory-100", note: "Alternate section" },
      { name: "ivory-300", className: "bg-ivory-300", note: "Quiet rule; secondary text on maroon" },
      { name: "espresso-900", className: "bg-espresso-900", note: "Body text on ivory" },
      { name: "espresso-600", className: "bg-espresso-600", note: "Secondary text on ivory" },
      { name: "whatsapp", className: "bg-whatsapp", note: "WhatsApp elements only" },
      { name: "danger", className: "bg-danger", note: "Form errors, on ivory" },
      { name: "control-border", className: "bg-control-border", note: "Input and chip boundary" },
    ],
    rolesHeading: "Semantic roles",
    roles: [
      { name: "background", className: "bg-background", note: "The surface of the scope" },
      { name: "muted", className: "bg-muted", note: "Alternate surface" },
      { name: "card", className: "bg-card", note: "Cards, panels" },
      { name: "primary", className: "bg-primary", note: "The main action" },
      { name: "primary-hover", className: "bg-primary-hover", note: "Its hover" },
      { name: "accent", className: "bg-accent", note: "Gold fill" },
      { name: "heading", className: "bg-heading", note: "Heading colour" },
      { name: "kicker", className: "bg-kicker", note: "Eyebrow colour" },
      { name: "link", className: "bg-link", note: "Link colour" },
      { name: "hairline", className: "bg-hairline", note: "Gold line" },
      { name: "border", className: "bg-border", note: "Quiet structural rule" },
      { name: "input", className: "bg-input", note: "Control boundary" },
      { name: "ring", className: "bg-ring", note: "Focus ring" },
    ],
    pairsHeading: "Text on surface",
    pairs: [
      { name: "foreground on background", surfaceClass: "bg-background", textClass: "text-foreground" },
      { name: "muted-foreground on background", surfaceClass: "bg-background", textClass: "text-muted-foreground" },
      { name: "heading on background", surfaceClass: "bg-background", textClass: "text-heading" },
      { name: "kicker on background", surfaceClass: "bg-background", textClass: "text-kicker" },
      { name: "link on background", surfaceClass: "bg-background", textClass: "text-link" },
      { name: "foreground on muted", surfaceClass: "bg-muted", textClass: "text-foreground" },
      { name: "muted-foreground on muted", surfaceClass: "bg-muted", textClass: "text-muted-foreground" },
      { name: "kicker on muted", surfaceClass: "bg-muted", textClass: "text-kicker" },
      { name: "card-foreground on card", surfaceClass: "bg-card", textClass: "text-card-foreground" },
      { name: "primary-foreground on primary", surfaceClass: "bg-primary", textClass: "text-primary-foreground" },
      { name: "accent-foreground on accent", surfaceClass: "bg-accent", textClass: "text-accent-foreground" },
    ],
    pairSample: brand.tagline,
  },
  type: {
    heading: "Type scale",
    lead: "Cormorant Garamond for display, Jost for everything else. Sizes are fluid between 390px and 1440px.",
    specimens: [
      { className: "type-display", spec: "Cormorant Garamond 600 · 40 → 72px", sample: brand.tagline },
      { className: "type-h2", spec: "Cormorant Garamond 600 · 32 → 52px", sample: brand.tagline },
      { className: "type-h3", spec: "Cormorant Garamond 600 · 24 → 32px", sample: brand.tagline },
      { className: "type-h4", spec: "Cormorant Garamond 600 · 20 → 24px", sample: brand.tagline },
      { className: "type-stat", spec: "Cormorant Garamond 600, tabular · 44 → 64px", sample: String(brand.foundedYear) },
      { className: "type-lead", spec: "Jost 400 · 19 → 22px", sample: siteMetadata.description },
      { className: "type-body", spec: "Jost 400 · 17 → 18px", sample: siteMetadata.description },
      { className: "type-small", spec: "Jost 400 · 15px", sample: siteMetadata.description },
      { className: "type-caption", spec: "Jost 400 · 13px", sample: brand.address.oneLine },
      { className: "type-eyebrow", spec: "Jost 500, uppercase, 0.2em · 13px", sample: brand.cityRegion },
      { className: "type-button", spec: "Jost 500 · 16px", sample: catalogueCopy.item.askOnWhatsApp },
    ],
  },
  buttons: {
    heading: "Buttons",
    lead: "48px tall; 44px at the small size. One primary per view. Gold and WhatsApp fills never flip and always carry dark type.",
    variants: [
      { variant: "default", label: "Primary" },
      { variant: "gold", label: "Gold" },
      { variant: "outline", label: "Outline" },
      { variant: "secondary", label: "Secondary" },
      { variant: "ghost", label: "Ghost" },
      { variant: "destructive", label: "Destructive" },
      { variant: "whatsapp", label: "WhatsApp" },
      { variant: "link", label: "Text link" },
    ],
    smallLabel: "Small — 44px",
    disabledLabel: "Disabled",
    focusLabel: "Focus ring",
    statesNote:
      "Hover a filled button to see the gold sheen cross it once; Tab to see the real focus ring. The last row shows the ring drawn permanently, for a screenshot.",
  },
  chips: {
    heading: "Chips",
    lead: "A filter chip is a button that announces whether it is pressed. A tag only names a finish; it is not a control.",
    filterLabel: "Filter chips",
    filters: FILTER_FINISHES.map((finish, index) => ({ label: finishLabels[finish], selected: index === 0 })),
    tagsLabel: "Tags",
    tags: TAG_FINISHES.map((finish) => finishLabels[finish]),
  },
  ornaments: {
    heading: "Ornaments",
    lead: "The crown is an original outline, not the logo. Use each ornament sparingly: at most three crown dividers a page.",
    crownLabel: "Crown — sm, md, lg, xl",
    crownDrawLabel: "Crown, drawing itself once",
    dividerLabel: "Crown divider",
    ruleLabel: "Double rule",
    placeholderLabel: "Crown placeholder",
    archLabel: "Arch image",
    archFramedLabel: "Arch image, framed",
    archImage: ARCH_ITEM ? ARCH_ITEM.image : null,
  },
  heading: {
    heading: "Section heading",
    lead: "Eyebrow, heading, optional crown divider and lead — centred or at the start.",
    centred: {
      eyebrow: brand.cityRegion,
      heading: brand.tagline,
      lead: siteMetadata.description,
    },
    start: {
      eyebrow: brand.cityRegion,
      heading: brand.name,
      lead: siteMetadata.description,
    },
  },
  cards: {
    heading: "Product card",
    lead: "Photograph or crown placeholder, name, finish tags and one WhatsApp action. No price, ever.",
    finishesLabel: catalogueCopy.filters.finishLabel,
    products: productSpecimens(),
  },
  surfaces: {
    heading: "Surfaces, shadow and radius",
    lead: "Linen is for ivory, the candle glow for maroon. The four-stop gold gradient is decoration and never carries type.",
    surfaces: [
      { name: "surface-linen", className: "surface-linen bg-muted", note: "Ivory only" },
      { name: "candle-glow", className: "candle-glow bg-maroon-800", note: "Behind a heading on maroon" },
      { name: "bg-gold-gradient", className: "bg-gold-gradient", note: "Decoration; no type" },
      { name: "gold-sheen", className: "gold-sheen", note: "A gold fill that carries maroon-950 type" },
    ],
    scrimLabel: "hero-scrim",
    scrimSample: brand.tagline,
    shadowsHeading: "Shadow",
    shadows: [
      { name: "shadow-card", className: "shadow-card", note: "Resting card" },
      { name: "shadow-lift", className: "shadow-lift", note: "Lifted surface" },
      { name: "shadow-header", className: "shadow-header", note: "Solid header" },
    ],
    radiusHeading: "Radius",
    radii: [
      { name: "rounded-sm", className: "rounded-sm", note: "2px — plaque, tags" },
      { name: "rounded-md", className: "rounded-md", note: "4px — small controls" },
      { name: "rounded-lg", className: "rounded-lg", note: "6px — buttons, inputs" },
      { name: "rounded-card", className: "rounded-card", note: "8px — cards, panels" },
      { name: "rounded-full", className: "rounded-full", note: "Chips" },
    ],
  },
};
