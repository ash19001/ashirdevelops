import type { MotionValue } from "motion/react";
import type { ReactNode } from "react";
import type { PageMeta } from "./context";

export type Page = PageMeta & {
  tone: "manila" | "paper";
  content: ReactNode;
  /** The page is laid out to fit the sheet and never scrolls (the cover). */
  fit?: boolean;
};

export type SheetValues = {
  /** rotateY in degrees: 0 at rest on the stack, FLIPPED once turned. */
  rot: MotionValue<number>;
  /** Opacity, used instead of rotation when the visitor prefers reduced motion. */
  fade: MotionValue<number>;
  /** How far the sheet sits down and right of the top one, in px: the depth of the stack. */
  off: MotionValue<number>;
};

/** Past -90° a sheet is edge-on and hidden, so a turned sheet rests a little beyond it. */
export const FLIPPED = -100;
/** Offset per sheet below the top. Two show beneath it; deeper ones are hidden. */
export const STEP = 4;
