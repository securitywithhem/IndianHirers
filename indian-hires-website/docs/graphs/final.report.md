# Graph Report - src  (2026-10-03)

## Corpus Check
- 137 files · ~62,159 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 10, .woff 2, .ico 1)

## Summary
- 800 nodes · 1573 edges · 46 communities (38 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- ref_next
- LayoutItem.tsx
- ornament/index.ts
- collections.ts
- Shared kit
- ContactForm.tsx
- ref_components
- AppLink.tsx
- site.ts
- ref_lib
- GalleryGrid.tsx
- Motion primitives
- ref_lucide_react
- content/types.ts
- designSystem.ts
- home.ts
- design-system/page.tsx
- ref_content
- motion/index.ts
- founders.ts
- Header.tsx
- content/contact.ts
- observe.ts
- gallery.ts
- ref_react
- buildCollection
- catalogue.ts
- app/layout.tsx
- SlidePanel.tsx
- products.ts
- testimonials.ts
- useMotionPreference.ts
- Counter.tsx
- ContactDetails.tsx
- EnterOnLoad.tsx
- gallery/page.tsx
- DrawLine.tsx
- collections/[slug]/page.tsx
- publicItems
- products/[slug]/page.tsx
- button-variants.ts
- Breadcrumb.tsx
- HomeTestimonials.tsx
- env.ts

## God Nodes (most connected - your core abstractions)
1. `Two entry points` - 20 edges
2. `Motion primitives` - 19 edges
3. `CtaLink` - 15 edges
4. `Shared kit` - 15 edges
5. `ProductImage` - 13 edges
6. `Things to know` - 13 edges
7. `observeReveal()` - 12 edges
8. `OutboundLink()` - 11 edges
9. `AppLink()` - 11 edges
10. `CollectionCatalogue()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `DrawLine — gold rules grow from the centre` --references--> `CrownDivider()`  [INFERRED]
  src/components/motion/README.md → src/components/ornament/CrownDivider.tsx
- `Band` --references--> `SectionHeading()`  [INFERRED]
  src/components/shared/README.md → src/components/ornament/SectionHeading.tsx
- `Things to know` --references--> `MobileDrawer()`  [INFERRED]
  src/components/shared/README.md → src/components/layout/MobileDrawer.tsx
- `No tailwind-merge in here` --references--> `Counter()`  [INFERRED]
  src/components/motion/README.md → src/components/motion/Counter.tsx
- `Two entry points` --references--> `Counter()`  [INFERRED]
  src/components/motion/README.md → src/components/motion/Counter.tsx

## Import Cycles
- None detected.

## Communities (46 total, 8 thin omitted)

### Community 0 - "ref_next"
Cohesion: 0.05
Nodes (72): CatalogueIsland(), CatalogueIslandProps, collectionFacets(), collectionItemViews(), ids(), linkLabel(), listFormat, toItemView() (+64 more)

### Community 1 - "LayoutItem.tsx"
Cohesion: 0.10
Nodes (40): assignRef(), HIDDEN, InPresence, LayoutItem, LayoutItemProps, LayoutItemTag, LayoutPresence(), LayoutPresenceProps (+32 more)

### Community 2 - "ornament/index.ts"
Cohesion: 0.07
Nodes (34): ArchAspect, ArchFrame(), ArchFrameProps, ASPECT_CLASS, ArchImage(), ArchImageProps, ArchImageSource, Crown() (+26 more)

### Community 3 - "collections.ts"
Cohesion: 0.05
Nodes (35): AssumedAttributes, BONE_CHINA_PIECES, CatalogueLandingCopy, CHAFING_DISH_PIECES, CHAFING_DISH_PLACEHOLDERS, CHAT_PLATE_SIZES, CollectionPageCopy, collections (+27 more)

### Community 4 - "Shared kit"
Cohesion: 0.07
Nodes (26): robots(), Band(), BandProps, BandSize, BandTag, BandTone, SIZE, TONE (+18 more)

### Community 5 - "ContactForm.tsx"
Cohesion: 0.08
Nodes (19): ContactForm(), onValid(), ContactFormProps, ContactSuccess(), EMPTY_VALUES, FIELD_ORDER, FormRow(), FormRowProps (+11 more)

### Community 6 - "ref_components"
Cohesion: 0.08
Nodes (6): metadata, metadata, metadata, metadata, metadata, metadata

### Community 7 - "AppLink.tsx"
Cohesion: 0.13
Nodes (20): AppLink(), AppLinkProps, isWebUrl(), kindOf(), LinkKind, ButtonLink(), ButtonLinkProps, ButtonLinkSize (+12 more)

### Community 8 - "site.ts"
Cohesion: 0.08
Nodes (23): ADDRESS_LINES, BottomBarAction, BottomBarContent, BrandAddress, collectionMetadata(), CollectionMetadataInput, collectionPath(), FloatingWhatsAppContent (+15 more)

### Community 9 - "ref_lib"
Cohesion: 0.11
Nodes (8): FoundersStory(), MilestoneTimeline(), MilestoneTimelineProps, CollectionTileHeading, CollectionTileProps, pageMetadata(), shareImages(), Input

### Community 10 - "GalleryGrid.tsx"
Cohesion: 0.10
Nodes (15): ASPECT_CLASS, aspectRatio(), CAPTION_CLASS, GalleryGrid(), GalleryGridProps, GalleryLabels, GalleryTile, PLAIN_KIT (+7 more)

### Community 11 - "Motion primitives"
Cohesion: 0.11
Nodes (22): EnterOnLoad(), MaskLines(), Already in CSS — use the class, no primitive, Counter — trust stats, DrawLine — gold rules grow from the centre, EnterOnLoad — the rest of the hero, Files, How every primitive treats reduced motion (+14 more)

### Community 13 - "content/types.ts"
Cohesion: 0.12
Nodes (19): CollectionTile, CatalogueItem, Collection, CountNoun, Finish, ItemFilter, ItemSeed, ItemStatus (+11 more)

### Community 14 - "designSystem.ts"
Cohesion: 0.12
Nodes (19): catalogueCopy, featuredItems, finishLabels, toQuoteLine(), ButtonSpecimen, ClassSpecimen, designSystem, DesignSystemContent (+11 more)

### Community 15 - "home.ts"
Cohesion: 0.11
Nodes (18): collectionCount, collectionsWithPhotograph, getItem(), displayPhone, FEATURED_COLLECTIONS, HERO_BACKDROP, HERO_HEADLINE, HERO_IMAGE (+10 more)

### Community 16 - "design-system/page.tsx"
Cohesion: 0.14
Nodes (14): ClassTiles(), DesignSystemPage(), DISPLAY_ROLES, Labelled(), metadata, ProductGrid(), Scope, Section() (+6 more)

### Community 17 - "ref_content"
Cohesion: 0.21
Nodes (10): FounderCard(), FounderCardProps, FounderPortrait(), FounderPortraitProps, FounderPortraitPhoto(), FounderPortraitPhotoProps, FoundersPeople(), TestimonialCard() (+2 more)

### Community 18 - "motion/index.ts"
Cohesion: 0.19
Nodes (11): KenBurns(), KenBurnsProps, PageFade(), PageFadeProps, SlideUpAfter(), SlideUpAfterProps, SlideUpAfterTag, StaggerItemProps (+3 more)

### Community 19 - "founders.ts"
Cohesion: 0.14
Nodes (15): founders, FoundersContent, FoundersCta, FoundersHero, Milestone, StorySection, storyYears, GalleryContent (+7 more)

### Community 20 - "Header.tsx"
Cohesion: 0.26
Nodes (10): Header(), HeaderFrame(), HeaderFrameProps, MobileDrawer(), MobileDrawerLabels, MobileDrawerProps, slideItem(), currentState() (+2 more)

### Community 21 - "content/contact.ts"
Cohesion: 0.14
Nodes (13): contact, ContactContent, ContactDetails, ContactFormContent, ContactFormErrors, ContactLabel, contactLimits, ContactMap (+5 more)

### Community 22 - "observe.ts"
Cohesion: 0.23
Nodes (10): clearMarks(), handle(), ObserveOptions, observeReveal(), release(), settleTimers, Watched, StaggerProps (+2 more)

### Community 23 - "gallery.ts"
Cohesion: 0.20
Nodes (11): CollectionSlug, getCollection(), buildGalleryPhotos(), eventPhotos, gallery, GalleryPhoto, galleryPhotoCount, galleryPhotos (+3 more)

### Community 24 - "ref_react"
Cohesion: 0.18
Nodes (6): RevealProps, RevealRise, RevealTag, ENTER_LG_MS, ENTER_MS, Textarea

### Community 25 - "buildCollection"
Cohesion: 0.24
Nodes (11): buildCollection(), buildItem(), filterOptions, findManifestProduct(), finishesOf(), isPublic(), itemId(), manifestCover() (+3 more)

### Community 26 - "catalogue.ts"
Cohesion: 0.18
Nodes (4): ItemListJsonLd, ItemQuery, ListItemJsonLd, publicCollections

### Community 27 - "app/layout.tsx"
Cohesion: 0.24
Nodes (6): fontBody, fontDisplay, images, jsonLd, metadata, viewport

### Community 28 - "SlidePanel.tsx"
Cohesion: 0.20
Nodes (8): DURATIONS, Phase, SlidePanel, SlidePanelProps, SlidePanelSide, SURFACE_CLASS, SLIDE_ENTER_MS, SLIDE_EXIT_MS

### Community 29 - "products.ts"
Cohesion: 0.24
Nodes (9): CollectionSeed, ManifestRef, allProducts, NoPricing, Product, productCategories, ProductCategory, ProductCategorySlug (+1 more)

### Community 30 - "testimonials.ts"
Cohesion: 0.27
Nodes (8): brand, hasTestimonials, Testimonial, testimonials, ReviewJsonLd, testimonialsJsonLd, testimonialsPage, TestimonialsPageContent

### Community 31 - "useMotionPreference.ts"
Cohesion: 0.36
Nodes (9): CapabilityNavigator, getMotionPreference(), getQuery(), getServerSnapshot(), isLowPower(), notifySubscribers(), subscribe(), subscribers (+1 more)

### Community 32 - "Counter.tsx"
Cohesion: 0.28
Nodes (8): Counter(), CounterFormat, CounterProps, CounterTag, easeOutQuint(), formatNumber(), groupedFormatter, COUNTER_MS

### Community 33 - "ContactDetails.tsx"
Cohesion: 0.36
Nodes (6): ContactDetails(), ContactDetailsProps, DetailRow(), DetailRowProps, ContactMap(), ContactMapProps

### Community 34 - "EnterOnLoad.tsx"
Cohesion: 0.36
Nodes (6): EnterOnLoadProps, EnterOnLoadTag, EnterStep, MaskLinesProps, STAGGER_CAP, STEP_MS

### Community 35 - "gallery/page.tsx"
Cohesion: 0.29
Nodes (5): eventTiles, firstScreen, labels, metadata, rangeTiles

### Community 36 - "DrawLine.tsx"
Cohesion: 0.29
Nodes (5): DrawLine(), DrawLineProps, DrawLineTag, No tailwind-merge in here, cx()

### Community 38 - "publicItems"
Cohesion: 0.33
Nodes (6): allPublicItems, collectionCountLabel(), collectionDesignCount(), collectionFilterOptions(), collectionHasPhotographs(), publicItems()

### Community 40 - "button-variants.ts"
Cohesion: 0.40
Nodes (3): BOXED, ButtonVariantProps, buttonVariants

## Knowledge Gaps
- **243 isolated node(s):** `CollectionPageProps`, `dynamicParams`, `metadata`, `metadata`, `metadata` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Motion primitives` connect `Motion primitives` to `LayoutItem.tsx`, `DrawLine.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Shared kit` connect `Shared kit` to `ornament/index.ts`, `content/types.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Things to know` connect `ornament/index.ts` to `Shared kit`, `Header.tsx`, `DrawLine.tsx`, `AppLink.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `CollectionPageProps`, `dynamicParams`, `metadata` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_next` be split into smaller, more focused modules?**
  _Cohesion score 0.05174190888476603 - nodes in this community are weakly interconnected._
- **Should `LayoutItem.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09663120567375887 - nodes in this community are weakly interconnected._
- **Should `ornament/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07400555041628122 - nodes in this community are weakly interconnected._