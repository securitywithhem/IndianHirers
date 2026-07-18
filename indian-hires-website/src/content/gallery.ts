export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  eventType: string;
  width: number;
  height: number;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-01",
    imageUrl: "/images/gallery/gallery-01.jpg",
    caption: "500-cover wedding banquet, Taj Palace",
    eventType: "Wedding",
    width: 800,
    height: 1200,
  },
  {
    id: "gallery-02",
    imageUrl: "/images/gallery/gallery-02.jpg",
    caption: "Elegant table setup for an exclusive corporate gala",
    eventType: "Corporate Gala",
    width: 1200,
    height: 800,
  },
  {
    id: "gallery-03",
    imageUrl: "/images/gallery/gallery-03.jpg",
    caption: "Crystal glassware arrangement at a luxury hotel",
    eventType: "Hotel Banquet",
    width: 1000,
    height: 1000,
  },
  {
    id: "gallery-04",
    imageUrl: "/images/gallery/gallery-04.jpg",
    caption: "Intimate private party dinner service",
    eventType: "Private Party",
    width: 800,
    height: 1000,
  },
  {
    id: "gallery-05",
    imageUrl: "/images/gallery/gallery-05.jpg",
    caption: "Outdoor wedding reception tent with full furnishings",
    eventType: "Wedding",
    width: 1200,
    height: 600,
  },
  {
    id: "gallery-06",
    imageUrl: "/images/gallery/gallery-06.jpg",
    caption: "Premium chafing dishes ready for a corporate buffet",
    eventType: "Corporate Gala",
    width: 1000,
    height: 1200,
  },
  {
    id: "gallery-07",
    imageUrl: "/images/gallery/gallery-07.jpg",
    caption: "Fine bone china setting for a VIP anniversary dinner",
    eventType: "Private Party",
    width: 900,
    height: 900,
  },
  {
    id: "gallery-08",
    imageUrl: "/images/gallery/gallery-08.jpg",
    caption: "Grand ballroom prepared for a massive wedding reception",
    eventType: "Wedding",
    width: 1200,
    height: 800,
  },
  {
    id: "gallery-09",
    imageUrl: "/images/gallery/gallery-09.jpg",
    caption: "Silverware detail at a luxury hotel banquet",
    eventType: "Hotel Banquet",
    width: 800,
    height: 1200,
  },
];
