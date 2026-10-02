import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalogueCopy, collectionCountLabel, type Collection } from "@/content/collections";
import { collectionPath } from "@/content/site";

export interface CollectionTextRowProps {
  /** Collections without a photograph (`collectionsWithoutPhotograph`). */
  collections: Collection[];
  /** Tag of the row's heading; it follows the page outline. */
  headingLevel: "h2" | "h3";
  className?: string;
}

/**
 * Collections that have no photograph to lead with, as a compact row of text
 * links under `catalogueCopy.textOnly.rowHeading` — never as blank image
 * tiles. Each entry is one link: title, tagline and the derived count.
 *
 * Server Component. Renders nothing when the list is empty.
 */
export function CollectionTextRow({ collections, headingLevel, className }: CollectionTextRowProps) {
  if (collections.length === 0) return null;
  const Heading = headingLevel;

  return (
    <div className={className}>
      <Heading className="type-h3 text-heading">{catalogueCopy.textOnly.rowHeading}</Heading>
      <ul className="mt-6 grid gap-x-8 border-t border-hairline/40 sm:grid-cols-2 sm:border-t-0 lg:grid-cols-4">
        {collections.map((collection) => (
          <li key={collection.slug} className="border-b border-hairline/40 sm:border-t">
            <Link
              href={collectionPath(collection.slug)}
              className="group focus-ring flex h-full min-h-11 items-start justify-between gap-4 rounded-sm py-4"
            >
              <span className="flex flex-col gap-1">
                <span className="type-h4 text-heading">{collection.title}</span>
                <span className="type-small text-muted-foreground">{collection.tagline}</span>
                <span className="type-caption text-kicker">{collectionCountLabel(collection)}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-hairline motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
