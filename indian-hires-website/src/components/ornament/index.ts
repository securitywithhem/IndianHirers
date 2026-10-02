export { Crown } from "./Crown";
export type { CrownProps, CrownSize } from "./Crown";
export { CrownDivider } from "./CrownDivider";
export type { CrownDividerProps } from "./CrownDivider";
export { ArchFrame } from "./ArchFrame";
export type { ArchAspect, ArchFrameProps } from "./ArchFrame";
/* `ArchImage` is NOT re-exported here on purpose: it imports `next/image`, a
 * client component, and a barrel export would add that chunk (about 5 kB) to
 * every route that imports any ornament. Import it from
 * "@/components/ornament/ArchImage". */
export { CrownPlaceholder } from "./CrownPlaceholder";
export type { CrownPlaceholderProps, PlaceholderAspect } from "./CrownPlaceholder";
export { SectionHeading } from "./SectionHeading";
export type {
  SectionHeadingAlign,
  SectionHeadingLevel,
  SectionHeadingProps,
  SectionHeadingTone,
} from "./SectionHeading";
