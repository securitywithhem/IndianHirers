/**
 * Site-wide content: brand facts, navigation, the shell's labels (header,
 * drawer, bottom bar, floating WhatsApp, footer), per-route metadata, JSON-LD
 * and the WhatsApp message builders.
 *
 * Brand facts are defined ONCE, here, and imported everywhere else. They are
 * copied from the project CLAUDE.md and must not be paraphrased.
 *
 * Phone, WhatsApp and email are NOT in this file — they come from env vars via
 * `src/lib/env.ts`, and links are assembled in `src/lib/links.ts`.
 *
 * Note for client components: several fields are functions (templates). They
 * cannot be passed as props from a Server Component to a Client Component —
 * import this module directly inside the client component instead.
 */
import { env } from "@/lib/env";
// A leaf module (no imports of its own), so this cannot become a cycle.
import { hasTestimonials } from "./testimonialList";

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export interface BrandAddress {
  /** Display lines, in order. `oneLine` is these joined with ", ". */
  lines: string[];
  oneLine: string;
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
}

export interface Brand {
  /** Two words. */
  name: string;
  /** Family mark on the crest. */
  mark: string;
  /** What the crest reads. */
  crest: string;
  /** Lower-case "with". */
  tagline: string;
  city: string;
  region: string;
  /** "Vadodara, Gujarat" */
  cityRegion: string;
  address: BrandAddress;
  /** Footer only. Never presented as a trust badge. */
  gstin: string;
  foundedYear: number;
  /** "Malad" */
  foundedLocality: string;
  /** "Malad, Mumbai" */
  foundedPlace: string;
  vadodaraSinceYear: number;
  generations: number;
}

const STREET_LINE_1 = "3-4 Sandalwood Residency";
const STREET_LINE_2 = "Nr Urmi Char Rasta, Akota";
const CITY = "Vadodara";
const REGION = "Gujarat";
const POSTAL_CODE = "390020";
const FOUNDED_LOCALITY = "Malad";
const ADDRESS_LINES: string[] = [
  STREET_LINE_1,
  STREET_LINE_2,
  `${CITY} – ${POSTAL_CODE}`,
];

export const brand: Brand = {
  name: "Indian Hirers",
  mark: "Gabhawalas",
  crest: "IH Gabhawalas",
  tagline: "An Occasion with Dignity",
  city: CITY,
  region: REGION,
  cityRegion: `${CITY}, ${REGION}`,
  address: {
    lines: ADDRESS_LINES,
    oneLine: ADDRESS_LINES.join(", "),
    street: `${STREET_LINE_1}, ${STREET_LINE_2}`,
    locality: CITY,
    region: REGION,
    postalCode: POSTAL_CODE,
    country: "IN",
  },
  gstin: "24AABPG5066D1Z8",
  foundedYear: 1977,
  foundedLocality: FOUNDED_LOCALITY,
  foundedPlace: `${FOUNDED_LOCALITY}, Mumbai`,
  vadodaraSinceYear: 2001,
  generations: 3,
};

/** Whole years the business has been in Vadodara. Derived, never typed. */
export function yearsInVadodara(now: Date = new Date()): number {
  return now.getFullYear() - brand.vadodaraSinceYear;
}

/** Whole years since the family's first shop opened. Derived, never typed. */
export function yearsSinceFounding(now: Date = new Date()): number {
  return now.getFullYear() - brand.foundedYear;
}

// ---------------------------------------------------------------------------
// Routes and navigation
// ---------------------------------------------------------------------------

/** Every static route on the site. An unknown route is a compile error. */
export type StaticRoute =
  | "/"
  | "/collections"
  | "/founders"
  | "/gallery"
  | "/testimonials"
  | "/contact";

export interface NavItem {
  label: string;
  href: StaticRoute;
}

export interface CtaLink {
  label: string;
  href: StaticRoute;
}

export const routes: Record<
  "home" | "collections" | "founders" | "gallery" | "testimonials" | "contact",
  StaticRoute
> = {
  home: "/",
  collections: "/collections",
  founders: "/founders",
  gallery: "/gallery",
  testimonials: "/testimonials",
  contact: "/contact",
};

/** Path of one collection page. The slug type is enforced in collections.ts. */
export function collectionPath(slug: string): string {
  return `${routes.collections}/${slug}`;
}

/** Every page a menu can link to, in order. */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "Collections", href: routes.collections },
  { label: "Our story", href: routes.founders },
  { label: "Gallery", href: routes.gallery },
  { label: "Testimonials", href: routes.testimonials },
  { label: "Contact", href: routes.contact },
];

/**
 * Header and mobile drawer. Derived: the Testimonials entry is present only
 * when there is a testimonial to read (`hasTestimonials`). The route and its
 * page exist either way; the menus just do not send people to an empty page.
 */
export const mainNav: NavItem[] = NAV_ITEMS.filter(
  (item) => item.href !== routes.testimonials || hasTestimonials
);

/** Footer link list. Same destinations as the header, kept as its own export. */
export const footerNav: NavItem[] = mainNav;

// ---------------------------------------------------------------------------
// Shell: header, drawer, bottom bar, floating WhatsApp, footer
// ---------------------------------------------------------------------------

export interface LogoContent {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Text shown if the image fails to load. */
  fallbackText: string;
}

export interface HeaderContent {
  /**
   * aria-label of the logo link. Left unset: the link's own text — the brand
   * name beside the (decorative) logo — is its accessible name, so the name
   * and the visible label cannot disagree (WCAG 2.5.3). If one is ever set it
   * must begin with the visible text.
   */
  homeLinkLabel?: string;
  /** aria-label of the desktop <nav>. */
  primaryNavLabel: string;
  /**
   * The header's gold button, from `md`. It opens WhatsApp with
   * `whatsappMessages.quoteRequest()`; only the label lives here.
   */
  quoteCta: { label: string };
  /** First action in the drawer: the contact page. */
  enquireCta: CtaLink;
  openMenuLabel: string;
  closeMenuLabel: string;
  /** aria-label of the drawer dialog. */
  drawerLabel: string;
  /** aria-label of the <nav> inside the drawer. */
  drawerNavLabel: string;
  /** Labels for the contact shortcuts at the bottom of the drawer. */
  drawerCall: string;
  drawerWhatsApp: string;
}

export interface BottomBarAction {
  /** Visible text under the icon. */
  label: string;
  /**
   * Optional longer accessible name. When set it BEGINS with `label` (WCAG
   * 2.5.3, label in name). When unset, the visible label is the name — do not
   * render an `aria-label` attribute.
   */
  ariaLabel?: string;
}

export interface BottomBarContent {
  /** aria-label of the bar's <nav>. */
  navLabel: string;
  call: BottomBarAction;
  whatsapp: BottomBarAction;
  enquire: BottomBarAction;
}

export interface FloatingWhatsAppContent {
  /** aria-label of the landmark the button sits in. */
  regionLabel: string;
  /** The button is an icon with no visible text, so this is its whole name. */
  ariaLabel: string;
  /** Tooltip (title attribute). */
  title: string;
}

export interface FooterContent {
  /** One line under the brand name. */
  blurb: string;
  /** Screen-reader label of the address inside the Contact column. */
  addressLabel: string;
  navHeading: string;
  /** aria-label of the footer <nav>. */
  navLabel: string;
  contactHeading: string;
  phoneLabel: string;
  phoneAltLabel: string;
  emailLabel: string;
  whatsappLabel: string;
  gstinLabel: string;
  /**
   * Social profiles. A profile is rendered only when its env var is set
   * (`env.instagramUrl`, `env.facebookUrl`); with neither, the list is absent.
   */
  social: { listLabel: string; instagram: string; facebook: string };
  copyright: (year: number) => string;
}

export interface ShellContent {
  skipLink: string;
  logo: LogoContent;
  header: HeaderContent;
  bottomBar: BottomBarContent;
  floatingWhatsApp: FloatingWhatsAppContent;
  footer: FooterContent;
  /** Screen-reader suffix for links that open a new tab. */
  newTabNote: string;
}

export const shell: ShellContent = {
  skipLink: "Skip to content",
  logo: {
    src: "/images/brand/logo.webp",
    alt: `${brand.crest} crest — ${brand.name}`,
    width: 512,
    height: 512,
    fallbackText: "IH",
  },
  header: {
    primaryNavLabel: "Primary",
    quoteCta: { label: "Get a quote" },
    enquireCta: { label: "Enquire", href: routes.contact },
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
    drawerLabel: "Site menu",
    drawerNavLabel: "Menu",
    drawerCall: "Call us",
    drawerWhatsApp: "Message us on WhatsApp",
  },
  bottomBar: {
    navLabel: "Quick contact",
    // Each accessible name begins with the visible label, or is left out.
    call: { label: "Call", ariaLabel: `Call ${brand.name}` },
    whatsapp: {
      label: "WhatsApp",
      ariaLabel: `WhatsApp ${brand.name}`,
    },
    enquire: { label: "Enquire" },
  },
  floatingWhatsApp: {
    regionLabel: "WhatsApp shortcut",
    ariaLabel: `Message ${brand.name} on WhatsApp`,
    title: "Message us on WhatsApp",
  },
  footer: {
    blurb: `Crockery and event tableware on hire. In ${brand.city} since ${brand.vadodaraSinceYear}.`,
    addressLabel: "Address",
    navHeading: "Quick links",
    navLabel: "Footer",
    contactHeading: "Contact",
    phoneLabel: "Phone",
    phoneAltLabel: "Second phone",
    emailLabel: "Email",
    whatsappLabel: "Message us on WhatsApp",
    gstinLabel: "GSTIN",
    social: {
      listLabel: "Social profiles",
      instagram: `${brand.name} on Instagram`,
      facebook: `${brand.name} on Facebook`,
    },
    copyright: (year: number) =>
      `© ${year} ${brand.name}. All rights reserved.`,
  },
  newTabNote: "(opens in a new tab)",
};

// ---------------------------------------------------------------------------
// Trust badges
// ---------------------------------------------------------------------------

export interface TrustBadge {
  label: string;
  /**
   * False → the wording is still with the owner (docs/COPY_TO_CONFIRM.md §9).
   * A badge that is not confirmed must not be rendered.
   */
  confirmed: boolean;
}

/**
 * The four badges of the R3 brief, in its wording. Nothing renders them yet;
 * the home page's trust strip is `home.trust` in home.ts. All four are with
 * the owner: the first sits beside `brand.foundedYear` (1977), the second
 * names no client. The GSTIN is never one of these.
 */
export const trustBadges: TrustBadge[] = [
  { label: "25+ Years of Heritage", confirmed: false },
  { label: "Hotels & Caterers Trust Us", confirmed: false },
  { label: "Complete Event Tableware", confirmed: false },
  { label: "Careful Handling & On-time Delivery", confirmed: false },
];

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export interface RouteMetadata {
  /**
   * Page title. The layout's template appends " | <brand name>", so a title
   * here must NOT contain the brand name (the home title is the one
   * exception: it is the full default title and is emitted as absolute).
   */
  title: string;
  description: string;
  /** Canonical path. */
  path: string;
  /** False keeps the page out of search results and the sitemap. */
  index: boolean;
}

export interface SiteMetadata {
  /** Full title of the home page and the fallback for any page without one. */
  defaultTitle: string;
  /** next/metadata title template; `%s` is the page title. */
  titleTemplate: string;
  description: string;
  siteName: string;
  /** Open Graph locale. */
  locale: string;
  /** Document language (html lang). */
  lang: string;
  keywords: string[];
  /**
   * Social share image. `src` is null until a real 1200×630 image exists in
   * /public — see docs/COPY_TO_CONFIRM.md. Do not point at a missing file.
   */
  ogImage: { src: string | null; alt: string; width: number; height: number };
}

const SITE_DESCRIPTION = `${brand.name} hires out bone china, melamine, glassware and chafing dishes to hotels, caterers and wedding planners. A family business since ${brand.foundedYear}, in ${brand.cityRegion} since ${brand.vadodaraSinceYear}.`;

export const siteMetadata: SiteMetadata = {
  defaultTitle: `${brand.name} — Crockery & Tableware on Hire in ${brand.city}`,
  titleTemplate: `%s | ${brand.name}`,
  description: SITE_DESCRIPTION,
  siteName: brand.name,
  locale: "en_IN",
  lang: "en-IN",
  keywords: [
    "crockery on hire Vadodara",
    "crockery rental Vadodara",
    "bone china on hire",
    "melamine crockery rental",
    "chafing dish rental",
    "event tableware hire Gujarat",
    "catering crockery hire",
  ],
  ogImage: {
    src: null,
    alt: `${brand.name} — ${brand.tagline}`,
    width: 1200,
    height: 630,
  },
};

export type MetadataKey = StaticRoute | "notFound";

/**
 * Per-route metadata. Named `routeMetadata` (not `metadata`) so a page can
 * import it without clashing with its own `export const metadata`.
 */
export const routeMetadata: Record<MetadataKey, RouteMetadata> = {
  "/": {
    title: siteMetadata.defaultTitle,
    description: SITE_DESCRIPTION,
    path: "/",
    index: true,
  },
  "/collections": {
    title: "Collections — Crockery, Glassware & Chafing Dishes on Hire",
    description: `Browse the ${brand.name} catalogue by collection: heritage silver, bone china, melamine, chat and snack plates, chafing dishes and glassware. Rates on request by WhatsApp.`,
    path: "/collections",
    index: true,
  },
  "/founders": {
    title: `Our Story — A Family Business Since ${brand.foundedYear}`,
    description: `From a small shop in ${brand.foundedPlace}, in ${brand.foundedYear} to ${brand.city} in ${brand.vadodaraSinceYear}: the story of the Gabhawala family and three generations of ${brand.name}.`,
    path: "/founders",
    index: true,
  },
  "/gallery": {
    title: "Gallery — The Range, Close Up",
    description: `Photographs of the crockery, glassware and chafing dishes ${brand.name} holds for hire in ${brand.city}.`,
    path: "/gallery",
    index: true,
  },
  "/testimonials": {
    title: "Testimonials",
    description: `What customers say about hiring from ${brand.name}, ${brand.city}.`,
    path: "/testimonials",
    // Derived: not indexed (and so not in the sitemap) while no testimonials
    // are published; indexed as soon as the list has an entry.
    index: hasTestimonials,
  },
  "/contact": {
    title: `Contact — Call, WhatsApp or Enquire in ${brand.city}`,
    description: `Call, WhatsApp or send an enquiry to ${brand.name}, ${brand.address.oneLine}.`,
    path: "/contact",
    index: true,
  },
  notFound: {
    title: "Page not found",
    description: `This page does not exist on the ${brand.name} website.`,
    path: "/",
    index: false,
  },
};

/** The fields of a collection that its page metadata is built from. */
export interface CollectionMetadataInput {
  slug: string;
  title: string;
  description: string;
}

/** Metadata template for `/collections/[slug]`. */
export function collectionMetadata(
  collection: CollectionMetadataInput
): RouteMetadata {
  return {
    title: `${collection.title} on Hire`,
    description: `${collection.description} Rates on request — ask ${brand.name}, ${brand.city}, on WhatsApp.`,
    path: collectionPath(collection.slug),
    index: true,
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export interface PostalAddressJsonLd {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface LocalBusinessJsonLd {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  alternateName: string;
  slogan: string;
  description: string;
  foundingDate: string;
  address: PostalAddressJsonLd;
  areaServed: string;
  telephone?: string[];
  email?: string;
  url?: string;
  logo?: string;
}

/**
 * LocalBusiness schema for the layout's <script type="application/ld+json">.
 * Contact fields are included only when the env var is set, so the schema
 * never carries `undefined` or an empty string.
 *
 * Opening hours are deliberately left out until the owner confirms them
 * (docs/COPY_TO_CONFIRM.md).
 */
export function localBusinessJsonLd(): LocalBusinessJsonLd {
  const phones: string[] = [env.phone, env.phoneAlt].filter(
    (phone) => phone !== ""
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    alternateName: brand.crest,
    slogan: brand.tagline,
    description: SITE_DESCRIPTION,
    foundingDate: String(brand.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.street,
      addressLocality: brand.address.locality,
      addressRegion: brand.address.region,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.country,
    },
    areaServed: brand.cityRegion,
    ...(phones.length > 0 ? { telephone: phones } : {}),
    ...(env.email ? { email: env.email } : {}),
    ...(env.siteUrl
      ? { url: env.siteUrl, logo: `${env.siteUrl}${shell.logo.src}` }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// WhatsApp message builders
// ---------------------------------------------------------------------------

/**
 * Label of the quote list's free-text field, and of the line it becomes in
 * the WhatsApp message. One string, so the two cannot drift apart.
 */
export const QUOTE_NOTE_LABEL = "Event date and guest count";

/** One line of a quote request: a catalogue item and the collection it is in. */
export interface QuoteLine {
  name: string;
  collectionTitle: string;
}

export interface WhatsAppMessages {
  /** Footer, bottom bar, floating button, hero, closing CTA. */
  general: () => string;
  /**
   * The header's "Get a quote": the three things a quote needs, as blanks to
   * fill in, so it does a different job from the general enquiry beside it.
   */
  quoteRequest: () => string;
  /** One catalogue item. */
  itemQuote: (item: { name: string }, collectionTitle: string) => string;
  /**
   * The quote basket: every item with its collection, one per line, then the
   * visitor's own note (event date and guest count) when there is one.
   */
  basketQuote: (lines: QuoteLine[], note?: string) => string;
  /** The catalogue's "Not sure what you need?" strip: blanks to fill in. */
  suggestSet: () => string;
  /** A whole collection, including ones with nothing listed yet. */
  collectionEnquiry: (collectionTitle: string) => string;
  /** Gallery page: ask for more photographs. */
  photoRequest: () => string;
  /** Testimonials page: ask to speak to the family. */
  speakToFamily: () => string;
}

/**
 * Builders return plain text. Turn the text into a link with
 * `whatsappUrl(message)` from `src/lib/links.ts`.
 */
export const whatsappMessages: WhatsAppMessages = {
  general: () =>
    `Hello ${brand.name}, I'd like to enquire about crockery on hire for my event.`,
  quoteRequest: () =>
    [
      `Hello ${brand.name}, I'd like a quote for crockery on hire.`,
      "Event date: ",
      "Number of guests: ",
      "Pieces or designs: ",
    ].join("\n"),
  itemQuote: (item, collectionTitle) =>
    `Hello ${brand.name}, I'd like a quote for: ${item.name} (${collectionTitle})`,
  basketQuote: (lines, note = "") => {
    if (lines.length === 0) return whatsappMessages.general();
    const details = note.trim();
    return [
      `Hello ${brand.name}, I'd like a quote for:`,
      ...lines.map(
        (line, index) => `${index + 1}. ${line.name} (${line.collectionTitle})`
      ),
      ...(details === "" ? [] : ["", `${QUOTE_NOTE_LABEL}: ${details}`]),
    ].join("\n");
  },
  suggestSet: () =>
    [
      `Hello ${brand.name}, I'm not sure what I need. Could you suggest a set?`,
      "Number of guests: ",
      "Event date: ",
    ].join("\n"),
  collectionEnquiry: (collectionTitle) =>
    `Hello ${brand.name}, I'd like to know what you have in ${collectionTitle}.`,
  photoRequest: () =>
    `Hello ${brand.name}, could you send me photographs of the pieces I'm interested in?`,
  speakToFamily: () =>
    `Hello ${brand.name}, I'd like to speak to you about hiring crockery for my event.`,
};
