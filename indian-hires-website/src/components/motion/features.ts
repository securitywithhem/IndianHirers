/**
 * Default feature bundle (animations, exit, in-view, hover/tap/focus).
 * Only ever reached through the dynamic import in MotionProvider.tsx, so it
 * lands in its own async chunk and never in First Load JS.
 */
import { domAnimation } from "motion/react";

export default domAnimation;
