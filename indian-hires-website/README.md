# Indian Hires

25-year-old family business website — crockery, utensils & event rental supply for hotels, caterers, and event planners.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- react-hook-form + zod
- AOS (Animate on Scroll)
- Web3Forms (serverless contact form)
- Hosted on Vercel

## Getting Started
```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Environment Variables
See `.env.example`. Required at build/runtime:
- `NEXT_PUBLIC_WEB3FORMS_KEY`
- `NEXT_PUBLIC_PHONE`
- `NEXT_PUBLIC_WHATSAPP`
- `NEXT_PUBLIC_EMAIL`
- `NEXT_PUBLIC_MAP_EMBED_URL`

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Deployment
Deployed via Vercel from `main`. See Implementation Plan Phase 7.
