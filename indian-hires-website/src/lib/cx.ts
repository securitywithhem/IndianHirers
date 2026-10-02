/**
 * Joins class names. For CLIENT components: unlike `cn` in ./utils it does not
 * pull tailwind-merge (8.6 kB gzipped) into the browser bundle, so it does no
 * conflict resolution — later classes do not override earlier ones. Keep `cn`
 * for Server Components, where its cost is paid at build time.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
