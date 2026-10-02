import type { Metadata } from "next";
import { Crown } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { notFoundContent } from "@/content/notFound";
import { routeMetadata } from "@/content/site";

/* Next.js adds `noindex` to a not-found response by itself; `robots: null`
 * keeps ours (and the layout's `index, follow`) out, so there is one tag. */
export const metadata: Metadata = { ...pageMetadata(routeMetadata.notFound), robots: null };

export default function NotFound() {
  const { code, heading, body, links } = notFoundContent;

  return (
    <>
      <PageHero
        heading={heading}
        lead={body}
        divider={false}
        before={
          /* Decorative: the crown draws itself once, the status code sits under
           * it. The page's heading is the `h1` below. */
          <div aria-hidden="true" className="crown-draw flex flex-col items-center gap-3 text-hairline">
            <Crown className="h-12" />
            <p className="type-stat gold-sheen bg-clip-text text-transparent">{code}</p>
          </div>
        }
      />

      <Band tone="ivory" linen size="sm">
        <ul className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          {links.map((link, index) => (
            <li key={link.href} className="flex flex-col">
              {/* The first link is the primary action; one primary per view. */}
              <ButtonLink href={link.href} variant={index === 0 ? "primary" : "secondary"}>
                {link.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
