# Graph Report - src  (2026-10-01)

## Corpus Check
- 44 files · ~9,823 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 102 edges · 42 communities (24 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- form.tsx
- products.ts
- layout.tsx
- [slug]/page.tsx
- FounderProfile.tsx
- LogoFinale.tsx
- contact/page.tsx
- founders/page.tsx
- gallery/page.tsx
- app/page.tsx
- products/page.tsx
- testimonials/page.tsx
- Footer.tsx
- Header.tsx
- CategoryCard.tsx
- ProductTile.tsx
- button.tsx
- validations/contact.ts
- content/contact.ts
- founders.ts
- env.ts

## God Nodes (most connected - your core abstractions)
1. `useFormField()` - 5 edges
2. `NoPricing` - 3 edges
3. `FounderProfile()` - 2 edges
4. `buttonVariants` - 2 edges
5. `Button()` - 2 edges
6. `FormLabel` - 2 edges
7. `FormControl` - 2 edges
8. `FormDescription` - 2 edges
9. `FormMessage` - 2 edges
10. `Product` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (42 total, 18 thin omitted)

### Community 0 - "form.tsx"
Cohesion: 0.23
Nodes (10): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+2 more)

### Community 1 - "products.ts"
Cohesion: 0.23
Nodes (9): homeContent, allProducts, NoPricing, Product, productCategories, ProductCategory, ProductCategorySlug, productCategorySlugs (+1 more)

### Community 2 - "layout.tsx"
Cohesion: 0.29
Nodes (5): inter, metadata, playfair, TODO: replace with real 1200x630 OG image, viewport

## Knowledge Gaps
- **31 isolated node(s):** `metadata`, `metadata`, `metadata`, `inter`, `playfair` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._