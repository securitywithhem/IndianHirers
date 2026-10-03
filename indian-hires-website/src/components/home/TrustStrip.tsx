import { MapPin, Store, Users, Utensils, type LucideIcon } from "lucide-react";
import { Counter, Stagger, StaggerItem } from "@/components/motion";
import { Band } from "@/components/shared/Band";
import { home, type TrustItem } from "@/content/home";

/* Ornament, not information: each icon is `aria-hidden` and gold (`hairline`),
 * which is allowed on ivory for shapes and never for text. */
const ICON: Record<TrustItem["id"], LucideIcon> = {
  since: Store,
  generations: Users,
  vadodara: MapPin,
  boneChina: Utensils,
};

/**
 * Four facts the family can stand behind, on linen directly under the hero.
 * The GSTIN is not one of them — it lives in the footer only.
 *
 * Numbers with `countUp` run once when they scroll in; a calendar year (1977,
 * 2015) is printed as it is. Either way the final figure is in the server
 * HTML, so the strip is complete without JavaScript.
 *
 * Two by two below `md`; one row of four from `md`, separated by gold
 * hairlines. A small gold icon sits over each figure.
 */
export function TrustStrip() {
  const { trust } = home;

  return (
    <Band tone="ivory" linen size="sm" aria-label={trust.ariaLabel}>
      <Stagger as="ul" className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-0">
        {trust.items.map((item) => {
          const Icon = ICON[item.id];

          return (
            <StaggerItem
              as="li"
              key={item.id}
              className="flex flex-col items-center gap-2 text-center md:border-l md:border-hairline/40 md:px-4 md:first:border-l-0"
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-7 text-hairline" />
              <p className="type-stat text-heading">
                {item.countUp ? <Counter value={item.value} format="plain" /> : item.value}
                {item.suffix ? <span className="type-h4">{item.suffix}</span> : null}
              </p>
              <p className="type-small max-w-40 text-balance text-muted-foreground">{item.label}</p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Band>
  );
}
