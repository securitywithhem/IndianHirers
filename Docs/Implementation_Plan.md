# Indian Hires – Implementation Plan (Phase 0 → Production)

**Version:** 1.0  
**Date:** 18 July 2026

### Phase 0 – Project Scaffolding & Environment
- Create `indian-hires-website` repo on GitHub, clone locally.
- Initialize Next.js 14 with TypeScript, Tailwind, App Router.
- Install dependencies: `aos`, `lucide-react`, `react-hook-form`, `zod`, shadcn/ui.
- Customize Tailwind config (colors, fonts).
- Set `.env.local` with all required variables.
- **Check:** `npm run dev` runs without errors.

### Phase 1 – Global Layout Components
- Build `Header.tsx` (sticky, drawer, nav).
- Build `Footer.tsx` (maroon, 3 columns).
- Build `MobileBottomBar.tsx` (fixed, 3 buttons).
- Build `FloatingWhatsApp.tsx` (green circle, pulse).
- Wrap layout with `Providers.tsx` (AOS init, Toaster).
- **Check:** Responsive menu, sticky bar, and floating button work.

### Phase 2 – Home & Founders Pages
- Home: hero, trust badges, category cards, testimonials preview, CTA.
- Founders: story, quotes, image row.
- All text in `/src/content` for easy edits.
- **Check:** Pages render correctly with placeholder images and text.

### Phase 3 – Products, Gallery, Testimonials
- Products: category grid, “View Items” triggers alert.
- Gallery: masonry grid, hover captions.
- Testimonials: full list sharing data with homepage.
- **Check:** All cards interactive, layout consistent.

### Phase 4 – Contact Page & Form Integration
- Contact page: left column (phone, WhatsApp, email, map), right column (shadcn Form).
- Form fields: Name, Phone, Event Date, Message.
- Web3Forms integration with Sonner toasts.
- **Check:** Submit form, receive email; validation works.

### Phase 5 – Animations, SEO & Performance
- Add `data-aos` attributes to key sections.
- Metadata in each page, `sitemap.ts`, `robots.ts`.
- Audit with Lighthouse – target ≥ 95.
- **Check:** `npm run build` succeeds.

### Phase 6 – Testing & Accessibility
- Cross‑browser testing (Chrome, Firefox, Safari, Edge).
- Real‑device test (phone call, WhatsApp).
- Axe/Lighthouse accessibility check (WCAG 2.1 AA).

### Phase 7 – Deployment to Vercel
- Push to GitHub `main`.
- Import into Vercel, add environment variables.
- Connect custom domain.
- Submit sitemap to Google Search Console.
- **Go live!**
