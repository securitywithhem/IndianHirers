# Indian Hires – UI/UX Specification

**Version:** 1.0  
**Date:** 18 July 2026

### Design Philosophy
*Classic elegance meets modern minimalism.* The interface must convey warmth, reliability, and premium service—like a high‑end banquet hall.

### Colour Palette
| Role | Colour | Hex Code |
|------|--------|----------|
| Primary Maroon | Trust, legacy | `#800020` |
| Accent Gold | Premium, CTAs | `#C5A44E` |
| Background | Clean canvas | `#FDFBF7` |
| Text | Readability | `#1F1F1F` |
| WhatsApp Green | Brand | `#25D366` |

### Typography
- **Headings:** Playfair Display (serif) – 400, 700
- **Body:** Inter (sans‑serif) – 400, 500, 600
- Base size: 16px (mobile), responsive scaling.

### Imagery
- Hero: full‑bleed banquet photo, dark overlay.
- Founder portraits: circular, warm‑toned.
- Products: bright, clean backgrounds.
- Gallery: real event photos, hover captions.

### Component Library

**Header**
- Sticky, transparent → white/blur on scroll.
- Logo “Indian Hires”. Desktop nav links, mobile hamburger → slide‑out drawer.
- Hover: gold underline.

**Footer**
- Maroon background. 3 columns: About, Quick Links, Contact.
- Copyright line.

**Buttons**
- Primary: `bg-gold text-white rounded-full hover:scale-105`.
- Secondary: outline maroon.

**Cards**
- Product/Gallery: white, `shadow-md rounded-2xl`, image on top.
- Testimonial: light gold left border, italic quote.

**Form**
- shadcn/ui inputs, maroon focus ring, inline errors.
- Submit with loading spinner; Sonner toasts.

**Mobile Bottom Bar**
- Fixed bottom, three icons: Call / WhatsApp / Enquire. Visible <768px.

**Floating WhatsApp**
- Green circle, bottom‑right, pulse animation.

### Responsive Breakpoints
- Mobile: 0–640px
- Tablet: 641–1024px
- Desktop: 1025px+

### Accessibility (WCAG 2.1 AA)
- Descriptive alt text, sufficient contrast, keyboard focus, semantic HTML, skip‑to‑content.
