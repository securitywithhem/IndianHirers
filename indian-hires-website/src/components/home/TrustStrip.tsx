import { Counter, Stagger, StaggerItem } from "@/components/motion";
import { Band } from "@/components/shared/Band";
import { home } from "@/content/home";

/**
 * Four facts the family can stand behind, on linen directly under the hero.
 * The GSTIN is not one of them — it lives in the footer only.
 *
 * Numbers with `countUp` run once when they scroll in; a calendar year (1977,
 * 2015) is printed as it is. Either way the final figure is in the server
 * HTML, so the strip is complete without JavaScript.
 *
 * Two by two below `md`; one row of four from `md`, separated by gold
 * hairlines.
 */
export function TrustStrip() {
  const { trust } = home;

  return (
    <Band tone="ivory" linen size="sm" aria-label={trust.ariaLabel}>
      <Stagger as="ul" className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-0">
        {trust.items.map((item) => (
          <StaggerItem
            as="li"
            key={item.id}
            className="flex flex-col items-center gap-2 text-center md:border-l md:border-hairline/40 md:px-4 md:first:border-l-0"
          >
            <p className="type-stat text-heading">
              {item.countUp ? <Counter value={item.value} format="plain" /> : item.value}
              {item.suffix ? <span className="type-h4">{item.suffix}</span> : null}
            </p>
            <p className="type-small max-w-40 text-muted-foreground">{item.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Band>
  );
}
