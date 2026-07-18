# Indian Hires – Technical Requirements Document (TRD)

**Version:** 1.0  
**Date:** 18 July 2026

### Technology Stack
| Layer | Technology |
|-------|-------------|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Button, Input, Textarea, Form, Sonner) |
| Icons | Lucide React |
| Animations | AOS (Animate on Scroll) |
| Form Backend | Web3Forms (serverless) |
| Hosting & CDN | Vercel |
| Version Control | Git & GitHub |
| Domain | Custom (e.g., `indianhires.com`) |
| Third‑Party Services | WhatsApp `wa.me` links, Google Maps embed |

### System Architecture
- Fully static site (Static Site Generation).
- Contact form posts to Web3Forms; client‑side toast on response.
- No backend server or database at launch.

### Dependencies
```json
{
  "next": "14.x",
  "react": "^18",
  "react-dom": "^18",
  "tailwindcss": "^3",
  "lucide-react": "^0.300",
  "aos": "^2.3.4",
  "react-hook-form": "^7",
  "@hookform/resolvers": "^3",
  "zod": "^3"
}
```

### Environment Variables (.env.local)
```
NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key
NEXT_PUBLIC_PHONE=+919876543210
NEXT_PUBLIC_WHATSAPP=919876543210
NEXT_PUBLIC_EMAIL=info@indianhires.com
NEXT_PUBLIC_MAP_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

### Performance Targets
- Lighthouse Performance ≥ 95
- FCP < 1.5s, TTI < 2.5s
- All images served as WebP via `next/image`
- Minimal JavaScript bundle

### Security & Browser Support
- HTTPS enforced (Vercel).
- Web3Forms honeypot spam protection.
- Latest Chrome, Firefox, Safari, Edge.
