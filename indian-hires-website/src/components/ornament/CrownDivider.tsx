import { cx } from "@/lib/cx";
import { Crown } from "./Crown";

export interface CrownDividerProps {
  /** Width and spacing. Defaults (centred, `max-w-xs`, gold) give way to any utility passed here. */
  className?: string;
}

/**
 * The signature divider: a thin double gold rule with the crown in the centre.
 * Purely decorative (`aria-hidden`).
 *
 * Motion hook: the two rules carry `data-divider-rule="start" | "end"` and
 * their transform-origin already points at the crown (`origin-right` /
 * `origin-left`), so the motion layer only has to animate `scaleX` 0 → 1 on
 * `[data-divider-rule]` for the lines to grow out from the centre.
 */
export function CrownDivider({ className }: CrownDividerProps) {
  return (
    <div
      aria-hidden="true"
      data-crown-divider=""
      className={cx(
        "flex w-full items-center gap-4 [:where(&)]:mx-auto [:where(&)]:max-w-xs [:where(&)]:text-hairline",
        className,
      )}
    >
      <span
        data-divider-rule="start"
        className="rule-double rule-fade-start min-w-0 flex-1 origin-right"
      />
      <Crown className="h-5" />
      <span
        data-divider-rule="end"
        className="rule-double rule-fade-end min-w-0 flex-1 origin-left"
      />
    </div>
  );
}
