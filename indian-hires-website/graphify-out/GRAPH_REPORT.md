# Graph Report - src  (2026-07-21)

## Corpus Check
- Corpus is ~8,269 words - fits in a single context window. You may not need a graph.

## Summary
- 134 nodes · 242 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Products & Gallery Routes
- Root Layout & Contact Info
- Homepage Sections
- Founders Story Page
- Testimonials
- Header & Form Primitives
- Contact Form & Validation
- shadcn Form Context
- Contact Route
- Button Primitive

## God Nodes (most connected - your core abstractions)
1. `cn()` - 16 edges
2. `env` - 11 edges
3. `productCategories` - 6 edges
4. `homeContent` - 5 edges
5. `CategoryCard()` - 4 edges
6. `Button()` - 4 edges
7. `foundersContent` - 4 edges
8. `Product` - 4 edges
9. `ProductCategory` - 4 edges
10. `getProductCategory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `Button()` --calls--> `cn()`  [EXTRACTED]
  components/ui/button.tsx → lib/utils.ts
- `PlateMotif()` --calls--> `cn()`  [EXTRACTED]
  components/ui/plate-motif.tsx → lib/utils.ts
- `generateMetadata()` --calls--> `getProductCategory()`  [EXTRACTED]
  app/products/[slug]/page.tsx → content/products.ts
- `CategoryPage()` --calls--> `getProductCategory()`  [EXTRACTED]
  app/products/[slug]/page.tsx → content/products.ts

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "Products & Gallery Routes"
Cohesion: 0.11
Nodes (19): metadata, metadata, CategoryPage(), CategoryPageProps, generateMetadata(), CategoryGrid(), CategoryCard(), CategoryCardProps (+11 more)

### Community 1 - "Root Layout & Contact Info"
Cohesion: 0.13
Nodes (14): inter, metadata, playfair, TODO: replace with real 1200x630 OG image, RootLayout(), viewport, FloatingWhatsApp(), Footer() (+6 more)

### Community 2 - "Homepage Sections"
Cohesion: 0.23
Nodes (8): metadata, AboutStrip(), ClosingCTA(), Hero(), TrustBadges(), PlateMotif(), PlateMotifProps, homeContent

### Community 3 - "Founders Story Page"
Cohesion: 0.24
Nodes (7): metadata, FounderProfile(), FounderProfileProps, FoundersHero(), FoundersRow(), StorySection(), foundersContent

### Community 4 - "Testimonials"
Cohesion: 0.33
Nodes (6): metadata, TestimonialsPreview(), TestimonialCard(), TestimonialCardProps, Testimonial, testimonials

### Community 5 - "Header & Form Primitives"
Cohesion: 0.33
Nodes (6): Header(), NAV_LINKS, Input(), Label(), Textarea(), cn()

### Community 6 - "Contact Form & Validation"
Cohesion: 0.28
Nodes (6): FormField(), FormItem, FormLabel, FormMessage, contactFormSchema, ContactFormValues

### Community 7 - "shadcn Form Context"
Cohesion: 0.25
Nodes (6): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue

## Knowledge Gaps
- **23 isolated node(s):** `metadata`, `metadata`, `metadata`, `inter`, `playfair` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Button Primitive` to `Header & Form Primitives`?**
  _High betweenness centrality (0.000) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Products & Gallery Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.11397849462365592 - nodes in this community are weakly interconnected._
- **Should `Root Layout & Contact Info` be split into smaller, more focused modules?**
  _Cohesion score 0.12681159420289856 - nodes in this community are weakly interconnected._