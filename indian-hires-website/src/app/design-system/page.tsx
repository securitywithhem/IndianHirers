import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Crown, CrownDivider, CrownPlaceholder, SectionHeading } from "@/components/ornament";
import { ArchImage } from "@/components/ornament/ArchImage";
import { Band, type BandTone } from "@/components/shared/Band";
import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { buttonVariants } from "@/components/ui/button-variants";
import { Chip, ChipTag } from "@/components/ui/chip";
import {
  designSystem,
  type ClassSpecimen,
  type DesignSystemSection,
  type ProductSpecimen,
  type Swatch,
} from "@/content/designSystem";
import { cx } from "@/lib/cx";
import { env } from "@/lib/env";

/* `noindex` from the content entry; the route is not in `routes`, so it is in
 * neither the navigation nor the sitemap. */
export const metadata: Metadata = pageMetadata(designSystem.metadata);

type Scope = "light" | "dark";

/* Type roles set in the display face take the heading colour. */
const DISPLAY_ROLES = new Set(["type-display", "type-h2", "type-h3", "type-h4", "type-stat"]);

/* The ring `focus-ring` draws on `:focus-visible`, applied permanently. */
const RING_SHOWN = "ring-2 ring-ring ring-offset-2 ring-offset-background";

/* Four cards across the 1280px shell; three from `md`; two on a phone. */
const CARD_GRID = "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8";
const CARD_SIZES = "(min-width: 1280px) 279px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const ARCH_SIZES = "160px";
const SCRIM_SIZES = "(min-width: 1024px) 608px, 100vw";

function Section({
  id,
  tone,
  section,
  children,
}: {
  id: string;
  tone: BandTone;
  section: DesignSystemSection;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <Band tone={tone} aria-labelledby={headingId} innerClassName="flex flex-col gap-10 md:gap-14">
      <SectionHeading as="h2" id={headingId} heading={section.heading} lead={section.lead} />
      {children}
    </Band>
  );
}

/** The same specimen twice: on ivory, and inside `.theme-dark`. */
function Split({ children }: { children: (scope: Scope) => ReactNode }) {
  const { scopes } = designSystem;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="theme-light flex min-w-0 flex-col gap-6 rounded-card border border-hairline/40 bg-background p-5 md:p-8">
        <p className="type-eyebrow text-kicker">{scopes.light}</p>
        {children("light")}
      </div>
      <div className="theme-dark flex min-w-0 flex-col gap-6 rounded-card border border-hairline/40 bg-background p-5 md:p-8">
        <p className="type-eyebrow text-kicker">{scopes.dark}</p>
        {children("dark")}
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="type-caption text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function SwatchList({ swatches, className }: { swatches: Swatch[]; className: string }) {
  return (
    <ul className={cx("grid gap-4", className)}>
      {swatches.map((swatch) => (
        <li key={swatch.name} className="flex items-center gap-3">
          <span aria-hidden="true" className={cx("size-12 shrink-0 rounded-md border border-border", swatch.className)} />
          <span className="flex min-w-0 flex-col">
            <span className="type-small font-medium text-foreground">{swatch.name}</span>
            <span className="type-caption text-muted-foreground">{swatch.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ClassTiles({ specimens, tileClass }: { specimens: ClassSpecimen[]; tileClass: string }) {
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {specimens.map((specimen) => (
        <li key={specimen.name} className="flex flex-col gap-3">
          <span aria-hidden="true" className={cx("block", tileClass, specimen.className)} />
          <span className="flex flex-col">
            <span className="type-small font-medium text-foreground">{specimen.name}</span>
            <span className="type-caption text-muted-foreground">{specimen.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ProductGrid({ products, finishesLabel }: { products: ProductSpecimen[]; finishesLabel: string }) {
  return (
    <ul className={CARD_GRID}>
      {products.map((product) => (
        <li key={product.id} className="flex flex-col">
          <ProductCard
            name={product.name}
            image={product.image}
            finishes={product.finishes}
            finishesLabel={finishesLabel}
            ask={product.ask}
            headingLevel="h3"
            sizes={CARD_SIZES}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Visual QA sheet: every token, the type scale, each button, chip, ornament
 * and card, on ivory and inside `.theme-dark`. Development only — in a build
 * the route answers 404.
 */
export default function DesignSystemPage() {
  if (!env.isDevelopment) notFound();

  const { hero, scopes, colour, type, buttons, chips, ornaments, heading, cards, surfaces } = designSystem;
  const { archImage } = ornaments;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} heading={hero.heading} lead={hero.lead} divider={false} />

      <Section id="colour" tone="ivory" section={colour}>
        <div className="flex flex-col gap-6">
          <h3 className="type-h4 text-heading">{colour.primitivesHeading}</h3>
          <SwatchList swatches={colour.primitives} className="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="type-h4 text-heading">{colour.rolesHeading}</h3>
          <Split>{() => <SwatchList swatches={colour.roles} className="sm:grid-cols-2" />}</Split>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="type-h4 text-heading">{colour.pairsHeading}</h3>
          <Split>
            {() => (
              <ul className="flex flex-col gap-3">
                {colour.pairs.map((pair) => (
                  <li
                    key={pair.name}
                    className={cx("flex flex-col gap-1 rounded-md border border-border px-4 py-3", pair.surfaceClass, pair.textClass)}
                  >
                    <span className="type-body">{colour.pairSample}</span>
                    <span className="type-caption">{pair.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </Split>
        </div>
      </Section>

      <Section id="type" tone="ivory-alt" section={type}>
        <Split>
          {() => (
            <ul className="flex flex-col gap-6">
              {type.specimens.map((specimen) => (
                <li key={specimen.className} className="flex flex-col gap-2">
                  <span className="flex flex-wrap gap-x-3">
                    <span className="type-caption font-medium text-foreground">{specimen.className}</span>
                    <span className="type-caption text-muted-foreground">{specimen.spec}</span>
                  </span>
                  <span
                    className={cx(
                      "line-clamp-3",
                      specimen.className,
                      DISPLAY_ROLES.has(specimen.className) ? "text-heading" : "text-foreground",
                    )}
                  >
                    {specimen.sample}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Split>
      </Section>

      <Section id="buttons" tone="ivory" section={buttons}>
        <p className="type-small max-w-measure text-muted-foreground">{buttons.statesNote}</p>
        <Split>
          {() => (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {buttons.variants.map(({ variant, label }) => (
                  <button key={variant} type="button" className={buttonVariants({ variant })}>
                    {variant === "whatsapp" ? <MessageCircle aria-hidden="true" /> : null}
                    {label}
                  </button>
                ))}
              </div>
              <Labelled label={buttons.smallLabel}>
                <div className="flex flex-wrap items-center gap-3">
                  {buttons.variants.map(({ variant, label }) => (
                    <button key={variant} type="button" className={buttonVariants({ variant, size: "sm" })}>
                      {label}
                    </button>
                  ))}
                </div>
              </Labelled>
              <Labelled label={buttons.disabledLabel}>
                <div className="flex flex-wrap items-center gap-3">
                  {buttons.variants.map(({ variant, label }) => (
                    <button key={variant} type="button" disabled className={buttonVariants({ variant })}>
                      {label}
                    </button>
                  ))}
                </div>
              </Labelled>
              <Labelled label={buttons.focusLabel}>
                {/* Not controls: the ring is painted on so a screenshot can show it. */}
                <div aria-hidden="true" className="flex flex-wrap items-center gap-4 p-1">
                  {buttons.variants.map(({ variant, label }) => (
                    <span key={variant} className={cx(buttonVariants({ variant }), RING_SHOWN)}>
                      {label}
                    </span>
                  ))}
                </div>
              </Labelled>
            </>
          )}
        </Split>
      </Section>

      <Section id="chips" tone="ivory-alt" section={chips}>
        <Split>
          {() => (
            <>
              <Labelled label={chips.filterLabel}>
                <ul className="flex flex-wrap gap-2">
                  {chips.filters.map((chip) => (
                    <li key={chip.label} className="flex">
                      <Chip selected={chip.selected}>{chip.label}</Chip>
                    </li>
                  ))}
                </ul>
              </Labelled>
              <Labelled label={chips.tagsLabel}>
                <ul className="flex flex-wrap gap-2">
                  {chips.tags.map((tag) => (
                    <li key={tag} className="flex">
                      <ChipTag>{tag}</ChipTag>
                    </li>
                  ))}
                </ul>
              </Labelled>
            </>
          )}
        </Split>
      </Section>

      <Section id="ornaments" tone="ivory" section={ornaments}>
        <Split>
          {() => (
            <>
              <Labelled label={ornaments.crownLabel}>
                <div className="flex items-end gap-6 text-hairline">
                  <Crown size="sm" />
                  <Crown size="md" />
                  <Crown size="lg" />
                  <Crown size="xl" />
                </div>
              </Labelled>
              <Labelled label={ornaments.crownDrawLabel}>
                <Crown size="xl" animate className="text-hairline" />
              </Labelled>
              <Labelled label={ornaments.dividerLabel}>
                <CrownDivider className="mx-0" />
              </Labelled>
              <Labelled label={ornaments.ruleLabel}>
                <span aria-hidden="true" className="rule-double w-full max-w-xs" />
              </Labelled>
              <Labelled label={ornaments.placeholderLabel}>
                <CrownPlaceholder aspect="4/3" className="w-40 rounded-card" />
              </Labelled>
              {archImage ? (
                <div className="flex flex-wrap gap-8">
                  <Labelled label={ornaments.archLabel}>
                    <ArchImage image={archImage} aspect="3/4" sizes={ARCH_SIZES} className="w-40" />
                  </Labelled>
                  <Labelled label={ornaments.archFramedLabel}>
                    <ArchImage image={archImage} aspect="3/4" sizes={ARCH_SIZES} framed className="w-40" />
                  </Labelled>
                </div>
              ) : null}
            </>
          )}
        </Split>
      </Section>

      <Section id="section-heading" tone="ivory-alt" section={heading}>
        <Split>
          {(scope) => (
            <>
              <SectionHeading
                as="h3"
                tone={scope}
                align="center"
                divider
                eyebrow={heading.centred.eyebrow}
                heading={heading.centred.heading}
                lead={heading.centred.lead}
              />
              <SectionHeading
                as="h3"
                tone={scope}
                eyebrow={heading.start.eyebrow}
                heading={heading.start.heading}
                lead={heading.start.lead}
              />
            </>
          )}
        </Split>
      </Section>

      <Section id="cards" tone="ivory" section={cards}>
        <ProductGrid products={cards.products} finishesLabel={cards.finishesLabel} />
      </Section>
      <Band tone="maroon" aria-label={scopes.dark}>
        <ProductGrid products={cards.products} finishesLabel={cards.finishesLabel} />
      </Band>

      <Section id="surfaces" tone="ivory" section={surfaces}>
        <ClassTiles specimens={surfaces.surfaces} tileClass="h-24 rounded-card border border-border" />
        {archImage ? (
          <Labelled label={surfaces.scrimLabel}>
            <div className="theme-dark relative aspect-video w-full max-w-xl overflow-hidden rounded-card">
              <Image
                src={archImage.src}
                alt=""
                aria-hidden="true"
                fill
                sizes={SCRIM_SIZES}
                placeholder="blur"
                blurDataURL={archImage.blurDataURL}
                className="object-cover"
              />
              <div aria-hidden="true" className="hero-scrim absolute inset-0" />
              <p className="type-h3 absolute inset-x-0 bottom-0 p-6 text-heading">{surfaces.scrimSample}</p>
            </div>
          </Labelled>
        ) : null}
        <div className="flex flex-col gap-6">
          <h3 className="type-h4 text-heading">{surfaces.shadowsHeading}</h3>
          <ClassTiles specimens={surfaces.shadows} tileClass="h-24 rounded-card border border-border bg-card" />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="type-h4 text-heading">{surfaces.radiusHeading}</h3>
          <ClassTiles specimens={surfaces.radii} tileClass="size-20 border border-primary bg-muted" />
        </div>
      </Section>
    </>
  );
}
