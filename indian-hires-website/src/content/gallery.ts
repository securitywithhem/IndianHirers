/**
 * Gallery (`/gallery`) content — "the range, close up".
 *
 * There are no event photographs yet, so the gallery is built from the
 * product photographs. The list is DERIVED from the catalogue
 * (collections.ts → photo manifest); no image object is duplicated here, and
 * a photograph added to the catalogue appears in the gallery automatically.
 */
import {
  allPublicItems,
  getCollection,
  type CollectionSlug,
} from "./collections";
import type { ProductImage } from "./products";
import { routes, whatsappMessages, type CtaLink } from "./site";

export interface GalleryPhoto {
  /** The catalogue item's id — unique, usable as a React key. */
  id: string;
  /** Same object as the catalogue item's `image` (src, alt, size, blur). */
  image: ProductImage;
  /** The design's name. */
  caption: string;
  collection: CollectionSlug;
  collectionTitle: string;
}

/** A photograph of the crockery in use at an event. None exist yet. */
export interface EventPhoto {
  id: string;
  image: ProductImage;
  /** What the photograph shows, e.g. the kind of event and the setting. */
  caption: string;
}

function buildGalleryPhotos(): GalleryPhoto[] {
  const photos: GalleryPhoto[] = [];
  for (const item of allPublicItems) {
    if (item.image === null) continue;
    photos.push({
      id: item.id,
      image: item.image,
      caption: item.name,
      collection: item.collection,
      collectionTitle: getCollection(item.collection).title,
    });
  }
  return photos;
}

/** Every photographed public catalogue item, in catalogue order. */
export const galleryPhotos: GalleryPhoto[] = buildGalleryPhotos();

/** Number of photographs in the gallery. Derived. */
export const galleryPhotoCount: number = galleryPhotos.length;

/**
 * TODO(owner): event photographs — buffet lines, laid tables, chafing dishes
 * in service. Save each as /images/gallery/<slug>.webp with width, height and
 * a blurDataURL, and add it here with alt text that describes the scene.
 * While this list is empty the "events" part of the page renders nothing.
 */
export const eventPhotos: EventPhoto[] = [];

export interface LightboxCopy {
  /** aria-label of the dialog. */
  label: string;
  close: string;
  previous: string;
  next: string;
  /** Position, announced and shown, e.g. "Image 3 of 21". */
  position: (current: number, total: number) => string;
  /** aria-label of a thumbnail button that opens the lightbox. */
  openLabel: (caption: string) => string;
  /** Link from the lightbox to the design's collection. */
  viewCollection: (collectionTitle: string) => string;
}

export interface GalleryContent {
  eyebrow: string;
  heading: string;
  lead: string;
  /** aria-label of the photo grid. */
  gridLabel: string;
  lightbox: LightboxCopy;
  /** Heading of the event-photo section; unused while `eventPhotos` is empty. */
  eventsHeading: string;
  cta: {
    heading: string;
    body: string;
    whatsappLabel: string;
    whatsappMessage: string;
    link: CtaLink;
  };
}

export const gallery: GalleryContent = {
  eyebrow: "Gallery",
  heading: "The range, close up",
  lead: "Photographs of the crockery, glassware and chafing dishes we hold. Open any picture for a closer look.",
  gridLabel: "Photographs of the range",
  lightbox: {
    label: "Photograph viewer",
    close: "Close viewer",
    previous: "Previous image",
    next: "Next image",
    position: (current, total) => `Image ${current} of ${total}`,
    openLabel: (caption) => `View a larger photograph of ${caption}`,
    viewCollection: (collectionTitle) => `See ${collectionTitle}`,
  },
  eventsHeading: "At events",
  cta: {
    heading: "Looking for a piece that is not pictured?",
    body: "Not everything we hold has been photographed. Ask us and we will send you a picture.",
    whatsappLabel: "Ask us for photographs",
    whatsappMessage: whatsappMessages.photoRequest(),
    link: { label: "Browse the collections", href: routes.collections },
  },
};
