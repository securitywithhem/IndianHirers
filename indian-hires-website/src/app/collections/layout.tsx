import type { ReactNode } from "react";
import { QuoteBasketProvider } from "@/components/collections/QuoteBasket";
import { basketCopyView, basketEntries } from "@/components/collections/catalogueView";

/*
 * The quote list lives here, above both catalogue routes, so it survives a
 * move from one collection to another. Its copy and the table of items are
 * built on the server; the client components import no content module.
 * Each page places the floating `QuoteBasketButton` itself, straight after
 * its catalogue, so Tab reaches it there rather than at the end of the page.
 */
export default function CollectionsLayout({ children }: { children: ReactNode }) {
  return (
    <QuoteBasketProvider entries={basketEntries()} copy={basketCopyView()}>
      {children}
    </QuoteBasketProvider>
  );
}
