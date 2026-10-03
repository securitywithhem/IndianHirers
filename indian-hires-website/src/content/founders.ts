/**
 * Founders page (`/founders`) content.
 *
 * The story paragraphs are the family's own text, with two spelling fixes
 * (the brand name as two words, and "Jasvantlal") and four small edits made
 * in Phase R1 so the page states only what the site can stand behind:
 *   - growth is described plainly, twice;
 *   - a typed count of years, which would have been wrong from 2027, is
 *     replaced by the start year (`brand.vadodaraSinceYear`);
 *   - a ranking claim about the business is replaced by what is evidenced.
 * The family's ORIGINAL sentences are recorded word for word in
 * docs/COPY_TO_CONFIRM.md §5 so the owner can restore them. Do not rewrite
 * the story any further.
 */
import type { ProductImage } from "./products";
import { brand, routes, whatsappMessages, type CtaLink } from "./site";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FoundersHero {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface StorySection {
  id: string;
  /** Null for the opening section, which runs straight on from the hero. */
  heading: string | null;
  paragraphs: string[];
  /**
   * A pull-quote set large after the section: an exact excerpt of the
   * paragraphs above (`scripts/test-catalogue.cjs` checks it), never new
   * words and never attributed to anyone. Null for none.
   */
  pullQuote: string | null;
}

export interface FounderProfile {
  id: "jasvantlal" | "nikesh" | "jay";
  name: string;
  role: string;
  /** A third-person description. Not a quotation — never render in quote marks. */
  description: string;
  /** Null until a real portrait is supplied; the UI shows the crown medallion. */
  portrait: ProductImage | null;
  /** Alt text to use once `portrait` exists. */
  portraitAlt: string;
}

export interface Milestone {
  /** Null while the owner has not given the year (a `todo` entry). */
  year: number | null;
  title: string;
  body: string;
  /**
   * `shown` — a date the story states; rendered.
   * `todo` — an event the story mentions without a year; NOT rendered until
   * the owner supplies the year (docs/OPEN_ISSUES.md).
   */
  status: "shown" | "todo";
}

export interface FoundersCta {
  heading: string;
  body: string;
  whatsappLabel: string;
  whatsappMessage: string;
  link: CtaLink;
}

/**
 * Years the story states, defined once so the milestones here and the home
 * page (trust strip, heritage teaser) cannot disagree. 1977 and 2001 are
 * brand facts and live in site.ts → `brand`.
 */
export interface StoryYears {
  /** "By 2015, he had introduced bone china on rental". */
  boneChinaIntroduced: number;
  /** "In 2023, Jay Nikesh Gabhawala … stepped into the family business". */
  thirdGenerationJoined: number;
}

export interface FoundersContent {
  hero: FoundersHero;
  story: {
    /** Visually hidden heading of the story region. */
    heading: string;
    sections: StorySection[];
  };
  milestones: {
    heading: string;
    /** Only dates stated in the story, plus `todo` entries. In chronological order. */
    items: Milestone[];
  };
  people: {
    heading: string;
    profiles: FounderProfile[];
  };
  cta: FoundersCta;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const JASVANTLAL = "Jasvantlal Satilal Gabhawala";
const NIKESH = "Nikesh Jasvantlal Gabhawala";
const JAY = "Jay Nikesh Gabhawala";

export const storyYears: StoryYears = {
  boneChinaIntroduced: 2015,
  thirdGenerationJoined: 2023,
};

export const founders: FoundersContent = {
  hero: {
    eyebrow: `Since ${brand.foundedYear}`,
    title: "Three Generations, One Promise",
    // Brand facts only. The story's closing sentence is said once, in the
    // story, and is not repeated here.
    subtitle: `A family crockery hire business that began in ${brand.foundedPlace}, in ${brand.foundedYear} and has been in ${brand.city} since ${brand.vadodaraSinceYear}.`,
  },

  story: {
    heading: "Our story",
    sections: [
      {
        id: "beginnings",
        heading: null,
        paragraphs: [
          `Our story begins in ${brand.foundedYear}, in Malad (East), Mumbai — where Nikesh's father, Mr. Jasvantlal Satilal Gabhawala, set up a very small shop that would plant the seed for everything that followed. It was here that the family first learned the business of serving others, one small order at a time.`,
          `In ${brand.vadodaraSinceYear}, after Nikesh Jasvantlal Gabhawala's marriage, his father decided it was time to carry the same concept forward — this time to Vadodara, Gujarat. With nothing more than a handful of steel plates and a will to serve, Nikesh started this new chapter from a small shop of his own. In the beginning, he offered utensils, steel plates, and simple melamine plates on rental for local events. Slowly and steadily, he upgraded to premium-quality melamine and added glassware to the collection, building trust one order at a time.`,
          `By ${storyYears.boneChinaIntroduced}, he had introduced bone china on rental — a bold step that set us apart in the market. The years that followed brought steady growth. Then came COVID, and the two years after it were some of the hardest the business had ever faced. But Nikesh held firm, kept the business alive, and rebuilt it piece by piece. Today, his dedication since ${brand.vadodaraSinceYear} — built on the foundation his father laid in Mumbai decades earlier — stands as the bedrock of everything we are.`,
        ],
        pullQuote: "With nothing more than a handful of steel plates and a will to serve",
      },
      {
        id: "growing-together",
        heading: "Growing Together",
        paragraphs: [
          "In 2023, Jay Nikesh Gabhawala, Nikesh's elder son, stepped into the family business to support his father through its next chapter. Together, they have grown the business steadily, bringing fresh energy and renewed ambition to a legacy that now spans three generations. Under their combined leadership, Indian Hirers serves hotels and caterers across Gujarat from Vadodara, with quality crockery and dependable service. What began as a very small shop in Malad, Mumbai, in 1977 is now a growing name across Gujarat — carried forward across generations, from grandfather to father to son.",
        ],
        pullQuote: "Carried forward across generations, from grandfather to father to son.",
      },
    ],
  },

  // Each shown entry restates a date and an event from the story above.
  // Nothing here is new information. The `todo` entries are events the story
  // names without a year; they stay hidden until the owner gives the year.
  milestones: {
    heading: "Milestones",
    items: [
      {
        year: 1977,
        title: "A very small shop in Malad",
        body: "Mr. Jasvantlal Satilal Gabhawala sets up the family's first shop in Malad (East), Mumbai.",
        status: "shown",
      },
      {
        year: 2001,
        title: "A new chapter in Vadodara",
        body: "Nikesh Jasvantlal Gabhawala starts a small shop of his own in Vadodara, hiring out utensils, steel plates and simple melamine plates for local events.",
        status: "shown",
      },
      {
        // TODO(owner): the year premium-quality melamine and glassware joined.
        year: null,
        title: "Premium melamine and glassware",
        body: "Premium-quality melamine and glassware join the collection.",
        status: "todo",
      },
      {
        year: storyYears.boneChinaIntroduced,
        title: "Bone china on rental",
        body: "Bone china is introduced, after premium-quality melamine and glassware had joined the collection.",
        status: "shown",
      },
      {
        // TODO(owner): the years of the COVID setback and the rebuilding after it.
        year: null,
        title: "Through COVID",
        body: "The two hardest years the business had faced; Nikesh keeps it alive and rebuilds it piece by piece.",
        status: "todo",
      },
      {
        year: storyYears.thirdGenerationJoined,
        title: "The third generation",
        body: "Jay Nikesh Gabhawala, Nikesh's elder son, steps into the family business.",
        status: "shown",
      },
    ],
  },

  people: {
    heading: "Meet the Family",
    profiles: [
      {
        // Restates the story's first paragraph; no new fact. Role wording is
        // the builder's, from the story (docs/COPY_TO_CONFIRM.md §11).
        id: "jasvantlal",
        name: JASVANTLAL,
        role: `Founder, ${brand.foundedPlace}, ${brand.foundedYear}`,
        description: `Set up the family's first, very small shop in Malad (East), Mumbai, in ${brand.foundedYear}, and later sent the same idea forward to ${brand.city}.`,
        portrait: null,
        portraitAlt: `Portrait of ${JASVANTLAL}`,
      },
      {
        id: "nikesh",
        name: NIKESH,
        // Was "Founder": the story credits the 1977 shop to his father.
        role: `Founder in ${brand.city}, ${brand.vadodaraSinceYear}`,
        description: `Built the foundation of ${brand.name} piece by piece since ${brand.vadodaraSinceYear}, with dedication and a will to serve.`,
        portrait: null,
        portraitAlt: `Portrait of ${NIKESH}`,
      },
      {
        id: "jay",
        name: JAY,
        role: "Partner",
        description:
          "Stepped in to support the family legacy, bringing fresh energy and renewed ambition to grow the business across Gujarat.",
        portrait: null,
        portraitAlt: `Portrait of ${JAY}`,
      },
    ],
  },

  cta: {
    heading: "Speak to the family directly",
    body: "Tell us about your event and we will take it from there.",
    whatsappLabel: "Message us on WhatsApp",
    whatsappMessage: whatsappMessages.speakToFamily(),
    link: { label: "See the collections", href: routes.collections },
  },
};
