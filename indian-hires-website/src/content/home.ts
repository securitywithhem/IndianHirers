/**
 * Home page (`/`) content, in section order:
 *   hero → trust strip → featured collections → heritage teaser →
 *   how hiring works → testimonials → closing CTA
 *
 * Numbers on this page are derived (years from the brand facts and the
 * founders' story, the number of collections from the catalogue). None is
 * typed by hand, and no count of designs is stated anywhere on the page.
 *
 * Eyebrows: never on two sections in a row (Docs/UI_UX_V2.md §7.6). The hero,
 * the featured collections and "how hiring works" carry one; the heritage
 * teaser and the testimonials between and after them do not.
 */
import { formatPhone } from "@/lib/links";
import {
  collectionCount,
  collectionsWithPhotograph,
  getItem,
  type CollectionSlug,
} from "./collections";
import { storyYears } from "./founders";
import {
  brand,
  routes,
  whatsappMessages,
  yearsInVadodara,
  type CtaLink,
} from "./site";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A button that opens WhatsApp. Build the href with `whatsappUrl(message)`. */
export interface WhatsAppCta {
  label: string;
  message: string;
}

export interface HeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Present for a photograph taken from the photo manifest. */
  blurDataURL?: string;
}

export interface HomeHero {
  eyebrow: string;
  /** Two or three short lines, revealed one at a time. Together they are the h1. */
  headline: string[];
  lead: string;
  primaryCta: WhatsAppCta;
  secondaryCta: CtaLink;
  /**
   * The photograph in the hero's arch. Render THIS image — do not substitute
   * a collection cover. It is never the image of a featured collection tile
   * (`home.featured.collections` is derived to exclude it), so no photograph
   * appears twice on the page.
   */
  image: HeroImage;
}

export interface TrustItem {
  id: "since" | "generations" | "vadodara" | "boneChina";
  /** The number to show (and to count up to, where `countUp` is true). */
  value: number;
  /** Text directly after the number, e.g. " years". Empty when there is none. */
  suffix: string;
  label: string;
  /** False for a calendar year, which should appear as-is rather than count up. */
  countUp: boolean;
}

export interface HomeTrust {
  /** aria-label of the section. */
  ariaLabel: string;
  /** Four facts. */
  items: TrustItem[];
}

export interface HomeFeatured {
  eyebrow: string;
  heading: string;
  lead: string;
  /**
   * Collections shown on the home page, in order. Derived: collections that
   * have a photograph, four at most, never one whose photograph is the hero's.
   */
  collections: CollectionSlug[];
  link: CtaLink;
}

export interface HomeHeritage {
  /** Not set: the sections before and after this one carry an eyebrow. */
  eyebrow?: string;
  heading: string;
  body: string;
  link: CtaLink;
}

export interface HowStep {
  id: "enquire" | "confirm" | "deliver";
  title: string;
  body: string;
}

export interface HomeHowItWorks {
  eyebrow?: string;
  heading: string;
  /** Exactly three. */
  steps: [HowStep, HowStep, HowStep];
  /** Screen-reader prefix for the step number, e.g. "Step 1". */
  stepLabel: (stepNumber: number) => string;
}

/** Renders nothing while `testimonials` (testimonials.ts) is empty. */
export interface HomeTestimonials {
  /** Not set: this section follows "how hiring works", which carries one. */
  eyebrow?: string;
  heading: string;
  link: CtaLink;
}

export interface HomeClosingCta {
  heading: string;
  body: string;
  whatsapp: WhatsAppCta;
  /** Derived from NEXT_PUBLIC_PHONE. Build the href with `telUrl()`. */
  callLabel: string;
}

export interface HomeContent {
  hero: HomeHero;
  trust: HomeTrust;
  featured: HomeFeatured;
  heritage: HomeHeritage;
  howItWorks: HomeHowItWorks;
  testimonials: HomeTestimonials;
  closingCta: HomeClosingCta;
}

// ---------------------------------------------------------------------------
// Hero photograph
// ---------------------------------------------------------------------------

/**
 * The catalogue item whose photograph is the hero: Golden Rim bone china,
 * 1184×1184 in the manifest — the largest bone china photograph in the
 * library, and not the cover of any collection. Its src, size and blur are
 * read from the manifest through the catalogue, not copied here.
 *
 * A 4:5 crop of a square photograph keeps 80% of its width: 947px here. No
 * photograph in the library reaches 1000px after that crop (the largest are
 * 1200px squares → 960px); the arch is at most 488 CSS px wide.
 */
const HERO_ITEM_ID = "bone-china--golden-rim";

/** Written from the photograph. */
const HERO_ALT =
  "White bone china dinner plate, quarter plate, saucer and two bowls with a gold lattice border, on a dark cloth";

/** Used only if the hero item ever loses its photograph. */
const HERO_BACKDROP: HeroImage = {
  src: "/images/brand/hero-backdrop.webp",
  alt: "Ivory bone china dinner plate, quarter plate, saucer, cup and bowls edged with a fine gold line",
  width: 2200,
  height: 940,
};

function heroImage(): HeroImage {
  const item = getItem(HERO_ITEM_ID);
  const photograph = item ? item.image : null;
  if (photograph === null) return HERO_BACKDROP;
  return {
    src: photograph.src,
    alt: HERO_ALT,
    width: photograph.width,
    height: photograph.height,
    blurDataURL: photograph.blurDataURL,
  };
}

const HERO_IMAGE: HeroImage = heroImage();

// ---------------------------------------------------------------------------
// Featured collections
// ---------------------------------------------------------------------------

const FEATURED_MAX = 4;

/**
 * Only collections with a photograph, so the row never opens on a blank
 * tile, and never the one whose cover is the hero photograph.
 */
const FEATURED_COLLECTIONS: CollectionSlug[] = collectionsWithPhotograph
  .filter((collection) => collection.hero.src !== HERO_IMAGE.src)
  .slice(0, FEATURED_MAX)
  .map((collection) => collection.slug);

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const ENQUIRE_ON_WHATSAPP = "Enquire on WhatsApp";
const HERO_EYEBROW = `Since ${brand.foundedYear} · ${brand.city} since ${brand.vadodaraSinceYear}`;

const displayPhone = formatPhone();
const CALL_LABEL = displayPhone ? `Call ${displayPhone}` : "Call us";

export const home: HomeContent = {
  hero: {
    eyebrow: HERO_EYEBROW,
    headline: [`Since ${brand.foundedYear},`, "one family has", "laid the table."],
    lead: `Bone china, melamine, glassware and chafing dishes on hire for hotels, caterers and wedding planners. A family business in its third generation, in ${brand.city} since ${brand.vadodaraSinceYear}.`,
    primaryCta: {
      label: ENQUIRE_ON_WHATSAPP,
      message: whatsappMessages.general(),
    },
    secondaryCta: { label: "See the collections", href: routes.collections },
    image: HERO_IMAGE,
  },

  // Four facts the business can stand behind, each from the brand facts or
  // the founders' own story. No catalogue counts: how many "designs" the
  // list holds depends on questions the owner has not answered yet. The
  // GSTIN is not here either — it belongs in the footer only.
  trust: {
    ariaLabel: "At a glance",
    items: [
      {
        id: "since",
        value: brand.foundedYear,
        suffix: "",
        label: `First shop opened in ${brand.foundedPlace}`,
        countUp: false,
      },
      {
        id: "generations",
        value: brand.generations,
        suffix: "",
        label: "Generations of the family",
        countUp: true,
      },
      {
        id: "vadodara",
        value: yearsInVadodara(),
        suffix: " years",
        label: `In ${brand.city}`,
        countUp: true,
      },
      {
        id: "boneChina",
        value: storyYears.boneChinaIntroduced,
        suffix: "",
        label: "Bone china introduced on hire",
        countUp: false,
      },
    ],
  },

  featured: {
    eyebrow: "The collections",
    heading: "Choose by collection",
    lead: `${collectionCount} collections of crockery and tableware. Rates on request.`,
    collections: FEATURED_COLLECTIONS,
    link: { label: "See all collections", href: routes.collections },
  },

  // Every statement here is taken from the founders' story (founders.ts).
  heritage: {
    heading: `From ${brand.foundedLocality} to ${brand.city}`,
    body: `The family's first shop opened in ${brand.foundedPlace}, in ${brand.foundedYear}. In ${brand.vadodaraSinceYear} Nikesh Gabhawala brought the business to ${brand.city}, starting with steel plates and simple melamine. Bone china followed in ${storyYears.boneChinaIntroduced}, and in ${storyYears.thirdGenerationJoined} his son Jay joined him.`,
    link: { label: "Read the founders' story", href: routes.founders },
  },

  // Step 3: that the business delivers is carried over from the previous
  // site; "clean" and "collected after" are not confirmed — see
  // docs/COPY_TO_CONFIRM.md §4.
  howItWorks: {
    eyebrow: "How hiring works",
    heading: "Three steps from enquiry to event",
    steps: [
      {
        id: "enquire",
        title: "Tell us what you need",
        body: "Send us the designs you like, your event date and your guest count on WhatsApp, or call us.",
      },
      {
        id: "confirm",
        title: "We confirm pieces, quantities and dates",
        body: "We check what is available for your dates and confirm the pieces, the quantities and the rates with you.",
      },
      {
        id: "deliver",
        title: "Delivered clean, collected after",
        body: "The crockery is delivered clean and ready to use, and collected once your event is over.",
      },
    ],
    stepLabel: (stepNumber: number) => `Step ${stepNumber}`,
  },

  testimonials: {
    heading: "What our customers say",
    link: { label: "Read all testimonials", href: routes.testimonials },
  },

  closingCta: {
    heading: "Planning an event?",
    body: "Tell us the date, the guest count and the designs you like. We will reply with availability and rates.",
    whatsapp: {
      label: ENQUIRE_ON_WHATSAPP,
      message: whatsappMessages.general(),
    },
    callLabel: CALL_LABEL,
  },
};
