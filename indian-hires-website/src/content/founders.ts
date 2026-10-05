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
  /** Pull-quotes set large inside this section. */
  pullQuotes: PullQuote[];
}

/**
 * An exact excerpt of the story (`scripts/test-catalogue.cjs` checks it),
 * never new words and never attributed to anyone. Placed away from the
 * sentence it repeats, so it reads as emphasis, not as a repeated line.
 */
export interface PullQuote {
  text: string;
  /** Index of the section paragraph it follows. */
  afterParagraph: number;
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
  /** `In ${storyYears.thirdGenerationJoined}, Jay Nikesh Gabhawala … stepped into the family business". */
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
          `Our journey didn't start with a grand vision of luxury; it started with the simple desire to serve. In ${brand.foundedYear}, Mr. Jasvantlal Satilal Gabhawala opened a very small shop in Malad, Mumbai. We learned the fundamentals of this business from the ground up, fulfilling small orders and understanding exactly what it takes to make an event run smoothly. Those early days taught us that hospitality is entirely about reliability and genuine care.`,
          `In ${brand.vadodaraSinceYear}, Nikesh Jasvantlal Gabhawala brought this ethos to Vadodara. He started with nothing more than a handful of steel plates and a drive to build something lasting. Over the years, as the scale of events in Gujarat grew, so did we. Nikesh carefully expanded the inventory from basic utensils to premium melamine and fine glassware. He built the business not through marketing, but by consistently delivering on his promises to local caterers and event hosts.`,
          `By ${storyYears.boneChinaIntroduced}, we saw a shift in how people celebrated and became one of the first to introduce fine bone china on rental—a decision that redefined the standard for premium events in the region. Like many businesses, the years during the pandemic tested everything we had built. But Nikesh refused to let the legacy fade. He kept the business afloat through the hardest seasons and rebuilt our operations piece by piece, ensuring that our standard of quality was never compromised.`,
        ],
        pullQuotes: [
          // The story's closing line, set after its opening paragraph.
          { text: "Carried forward across generations, from grandfather to father to son.", afterParagraph: 0 },
          // From the 2001 paragraph, set after the next one.
          { text: "With nothing more than a handful of steel plates and a will to serve", afterParagraph: 2 },
        ],
      },
      {
        id: "growing-together",
        heading: "Growing Together",
        paragraphs: [
          `In ${storyYears.thirdGenerationJoined}, the third generation stepped in. Jay Nikesh Gabhawala joined his father, bringing fresh energy to expand our operations. Today, we are the trusted crockery partner for Gujarat's finest hotels, restaurants, and caterers. From a tiny shop in Mumbai in ${brand.foundedYear} to a premier rental service, our work remains rooted in the exact same principle we started with: providing impeccable quality and dependable service, carried forward from grandfather, to father, to son.`,
        ],
        pullQuotes: [],
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
        year: brand.foundedYear,
        title: "A very small shop in Malad",
        body: "Mr. Jasvantlal Satilal Gabhawala sets up the family's first shop in Malad (East), Mumbai.",
        status: "shown",
      },
      {
        year: brand.vadodaraSinceYear,
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
        // the builder's, from the story (docs/COPY_TO_CONFIRM.md §12).
        id: "jasvantlal",
        name: JASVANTLAL,
        role: `Founder, ${brand.foundedPlace}, ${brand.foundedYear}`,
        description: `Laid the humble foundation for a legacy of service with a very small shop in ${brand.foundedPlace}, in ${brand.foundedYear}, planting the seed that would eventually span across Gujarat.`,
        portrait: null,
        portraitAlt: `Portrait of ${JASVANTLAL}`,
      },
      {
        id: "nikesh",
        name: NIKESH,
        // Was "Founder": the story credits the 1977 shop to his father.
        role: `Founder in ${brand.city}, ${brand.vadodaraSinceYear}`,
        description: `The architect of our Vadodara operations since ${brand.vadodaraSinceYear}. Through sheer resilience and an uncompromising eye for quality, he elevated the business into a trusted name in luxury tableware.`,
        portrait: null,
        portraitAlt: `Portrait of ${NIKESH}`,
      },
      {
        id: "jay",
        name: JAY,
        role: "Partner",
        description:
          "Stepped in to champion the family legacy, infusing modern ambition and fresh energy to expand our premier services across the hospitality sector in Gujarat.",
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
