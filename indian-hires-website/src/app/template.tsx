import { PageFade } from "@/components/motion";

/* Remounts on every navigation: the incoming page fades in (opacity only,
 * 300ms). First load and reduced motion: nothing happens. The header, footer
 * and bottom bar stay in layout.tsx, outside the fade. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
