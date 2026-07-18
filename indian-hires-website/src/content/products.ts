export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: "crockery-sets",
    name: "Elegant Crockery Sets",
    category: "Crockery Sets",
    description: "Fine bone china and ceramic dinnerware for banquets and weddings.",
    imageUrl: "/images/products/crockery-sets.jpg"
  },
  {
    id: "cutlery-silverware",
    name: "Premium Cutlery & Silverware",
    category: "Cutlery & Silverware",
    description: "Polished stainless steel and silver-finish cutlery sets.",
    imageUrl: "/images/products/cutlery-silverware.jpg"
  },
  {
    id: "glassware",
    name: "Crystal & Glassware",
    category: "Glassware",
    description: "Wine glasses, tumblers, and serving glassware for every occasion.",
    imageUrl: "/images/products/glassware.jpg"
  },
  {
    id: "serving-equipment",
    name: "Chafing Dishes & Serving Equipment",
    category: "Serving Equipment",
    description: "Buffet-ready chafing dishes, trays, and warmers.",
    imageUrl: "/images/products/serving-equipment.jpg"
  },
  {
    id: "table-linen",
    name: "Table Linen & Decor",
    category: "Table Linen",
    description: "Tablecloths, runners, and napkins in premium fabrics.",
    imageUrl: "/images/products/table-linen.jpg"
  },
  {
    id: "event-essentials",
    name: "Complete Event Essentials",
    category: "Event Essentials",
    description: "Everything else your event needs — tents, furniture, and more.",
    imageUrl: "/images/products/event-essentials.jpg"
  }
];
