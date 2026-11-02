"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useSheet } from "@/components/case-file/context";

type Props = {
  children: ReactNode;
  className?: string;
  tilt?: number;
  /** Lands when true. Defaults to "this sheet is on top", so it re-stamps on every visit. */
  show?: boolean;
  /** Seconds to wait, so the stamp lands after the page has finished turning. */
  delay?: number;
  /** A smaller impression, for tight corners of a phone screen. */
  small?: boolean;
};

/**
 * A rubber stamp, inked onto the sheet. It slams down from slightly above (scale 1.5 → 1) on a
 * short spring with a little give, the one place on the page that bounces. It waits until it
 * is on screen, so a stamp further down a sheet lands when the visitor scrolls to it.
 * Decorative: the same status is always written somewhere on the sheet in plain text.
 */
export function Stamp({ children, className = "", tilt = -10, show, delay = 0.36, small }: Props) {
  const { active } = useSheet();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.8 });
  const on = (show ?? active) && seen;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute z-[1] mix-blend-multiply ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <motion.div
        className="stamp-motion"
        initial={{ opacity: 0, transform: "scale(1.5)" }}
        animate={on ? { opacity: 0.88, transform: "scale(1)" } : { opacity: 0, transform: "scale(1.5)" }}
        transition={on ? { type: "spring", bounce: 0.35, duration: 0.42, delay } : { duration: 0.12 }}
      >
        <div
          className={[
            "stamp-ink rounded-[6px] border-[3px] border-stamp text-center font-display font-bold uppercase leading-[0.95] tracking-[0.06em] text-stamp outline outline-[1.5px] outline-offset-[3px] outline-stamp",
            small ? "px-2.5 py-1.5 text-[0.9375rem]" : "px-3 py-2 text-[1.25rem] lg:text-[1.625rem]",
          ].join(" ")}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
