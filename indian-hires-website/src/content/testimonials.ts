export interface Testimonial {
  id: string;
  clientName: string;
  clientDesignation: string;
  quote: string;
  featured: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    clientName: "Rahul Sharma",
    clientDesignation: "Hotel F&B Manager",
    quote: "Indian Hires has been our go-to partner for all large-scale banquets. Their crockery quality is unmatched, and they never miss a delivery time.",
    featured: true,
  },
  {
    id: "t2",
    clientName: "Priya Patel",
    clientDesignation: "Wedding Planner",
    quote: "With 25 years of trust behind them, I don't have to worry about a thing when I book with them. The event essentials they provide are pristine.",
    featured: true,
  },
  {
    id: "t3",
    clientName: "Anil Desai",
    clientDesignation: "Catering Company Owner",
    quote: "For our premium outdoor caterings, their chafing dishes and serving equipment are reliable and exactly what we need to impress our clients.",
    featured: true,
  },
  {
    id: "t4",
    clientName: "Sonia Kapoor",
    clientDesignation: "Corporate Event Organiser",
    quote: "We've used their table linen and decor for multiple corporate galas. Excellent service, highly professional team.",
    featured: false,
  },
  {
    id: "t5",
    clientName: "Vikram Singh",
    clientDesignation: "Restaurant Owner",
    quote: "During our restaurant renovation, we relied heavily on their rental inventory. Flawless execution and great pricing.",
    featured: false,
  },
  {
    id: "t6",
    clientName: "Aarti Mehra",
    clientDesignation: "Independent Event Host",
    quote: "I rented glassware and cutlery for a private party of 100 people. Everything arrived sparkling clean and on time.",
    featured: false,
  },
  {
    id: "t7",
    clientName: "Rohit Verma",
    clientDesignation: "Banquet Director",
    quote: "Indian Hires understands the demanding nature of hospitality. Their 25 years of experience really show in how they handle last-minute requests.",
    featured: false,
  },
  {
    id: "t8",
    clientName: "Neha Gupta",
    clientDesignation: "Event Stylist",
    quote: "The sheer variety of their inventory makes my job as a stylist so much easier. Always my first recommendation.",
    featured: false,
  },
];
