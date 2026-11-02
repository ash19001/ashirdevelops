"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion components follow the visitor's reduced-motion setting: no travel, fades kept. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
