/**
 * 404 page (`src/app/not-found.tsx`) content.
 */
import { routes, type CtaLink } from "./site";

export interface NotFoundContent {
  /** The status code, shown large. Decorative — the h1 is `heading`. */
  code: string;
  heading: string;
  body: string;
  /** First link is the primary action. */
  links: CtaLink[];
}

/** Named `notFoundContent` so it does not clash with next/navigation's `notFound()`. */
export const notFoundContent: NotFoundContent = {
  code: "404",
  heading: "Page not found",
  body: "The page you were looking for has moved or does not exist. The collections and our contact details are a click away.",
  links: [
    { label: "Back to home", href: routes.home },
    { label: "Browse the collections", href: routes.collections },
    { label: "Contact us", href: routes.contact },
  ],
};
