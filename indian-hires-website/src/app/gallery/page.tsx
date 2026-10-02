import { GalleryCta } from "@/components/gallery/GalleryCta";
import { GalleryGrid, type GalleryLabels, type GalleryTile } from "@/components/gallery/GalleryGrid";
import { galleryLayout, holdsUpLarge } from "@/components/gallery/galleryLayout";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { eventPhotos, gallery, galleryPhotoCount, galleryPhotos } from "@/content/gallery";
import { collectionPath, routeMetadata } from "@/content/site";

export const metadata = pageMetadata(routeMetadata["/gallery"]);

const EVENTS_HEADING_ID = "gallery-events-heading";

const { lightbox } = gallery;

/* The lightbox templates are functions, so they are called here, on the
 * server, and only strings cross to the client grid. */
const labels: GalleryLabels = {
  dialog: lightbox.label,
  close: lightbox.close,
  previous: lightbox.previous,
  next: lightbox.next,
};

/* Only photographs that hold up at double size are enlarged. */
const rangeLayout = galleryLayout(galleryPhotos.map((photo) => holdsUpLarge(photo.collection)));

/** The range: every photographed catalogue piece, in catalogue order. */
const rangeTiles: GalleryTile[] = galleryPhotos.map((photo, index) => ({
  id: photo.id,
  image: photo.image,
  caption: photo.caption,
  openLabel: lightbox.openLabel(photo.caption),
  positionLabel: lightbox.position(index + 1, galleryPhotoCount),
  link: {
    href: collectionPath(photo.collection),
    label: lightbox.viewCollection(photo.collectionTitle),
  },
  className: rangeLayout[index]?.className ?? "",
  sizes: rangeLayout[index]?.sizes ?? "",
}));

/* An event photograph is supplied for this page, so any of them may be enlarged. */
const eventLayout = galleryLayout(eventPhotos.map(() => true));

/** Photographs taken at events. There are none yet, and nothing stands in for them. */
const eventTiles: GalleryTile[] = eventPhotos.map((photo, index) => ({
  id: `event-${photo.id}`,
  image: photo.image,
  caption: photo.caption,
  openLabel: lightbox.openLabel(photo.caption),
  positionLabel: lightbox.position(index + 1, eventPhotos.length),
  link: null,
  className: eventLayout[index]?.className ?? "",
  sizes: eventLayout[index]?.sizes ?? "",
}));

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow={gallery.eyebrow} heading={gallery.heading} lead={gallery.lead} />

      <Band tone="ivory" aria-label={gallery.gridLabel}>
        {/* The first tile is the first photograph on screen at every width: the route's one priority image. */}
        <GalleryGrid tiles={rangeTiles} labels={labels} priorityIndex={0} />
      </Band>

      {eventTiles.length > 0 ? (
        <Band tone="ivory-alt" aria-labelledby={EVENTS_HEADING_ID}>
          <SectionHeading as="h2" id={EVENTS_HEADING_ID} align="center" heading={gallery.eventsHeading} />
          <div className="mt-10 md:mt-14">
            <GalleryGrid tiles={eventTiles} labels={labels} />
          </div>
        </Band>
      ) : null}

      <GalleryCta />
    </>
  );
}
