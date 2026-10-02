/**
 * Full feature bundle: everything in `domAnimation` plus layout animations,
 * `layoutId` and drag. Only ever reached through the dynamic import in
 * MotionProvider.tsx, so it lands in its own async chunk and never in
 * First Load JS.
 */
import { domMax } from "motion/react";

export default domMax;
