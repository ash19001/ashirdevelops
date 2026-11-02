"use client";

import { motion, motionValue, useTransform } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { STEP, type Page, type SheetValues } from "./shared";

/** Stands in for "the sheet above" on the first sheet, which has none. */
const flat = motionValue(0);

// False in the server HTML, true once the page is running. Hidden sheets are only made inert
// from then on: without script, the #hash links bring a sheet to the top, and it must work.
const noop = () => () => {};
const useScripted = () => useSyncExternalStore(noop, () => true, () => false);

type Props = {
  page: Page;
  i: number;
  count: number;
  values: SheetValues;
  /** The sheet lying on top of this one. Its turn casts a shadow here. */
  above?: SheetValues;
  active: boolean;
  onNext?: () => void;
  /** Told whether this sheet has unread content below its fold. Must be a stable function. */
  onMore: (i: number, more: boolean) => void;
};

export function Sheet({ page, i, count, values, above, active, onNext, onMore }: Props) {
  const { rot, fade, off } = values;

  // Set on the element itself, never through a variable on a parent.
  const transform = useTransform([off, rot], ([o, r]: number[]) => `translate3d(${o}px, ${o}px, 0) rotateY(${r}deg)`);
  // Edge-on, fully faded or deep in the stack: nothing to paint.
  const visibility = useTransform([rot, fade, off], ([r, f, o]: number[]) =>
    r <= -89.5 || f <= 0.002 || o > STEP * 2 + 0.5 ? "hidden" : "visible",
  );
  // The turning face darkens as it tilts away from the light.
  const shade = useTransform(rot, (r) => Math.min(Math.max(-r, 0) / 90, 1) * 0.3);
  // While the sheet above lifts, it shadows this one; deeper sheets sit a touch darker.
  const under = useTransform([above?.rot ?? flat, off], ([r, o]: number[]) => {
    const p = Math.min(Math.max(-r, 0) / 90, 1);
    const cast = p > 0 && p < 1 ? Math.sin(p * Math.PI) * 0.22 : 0;
    return Math.max(cast, (o / STEP) * 0.035);
  });

  const manila = page.tone === "manila";
  const scroller = useRef<HTMLDivElement>(null);
  useMoreBelow(scroller, i, onMore, !page.fit);
  const scripted = useScripted();

  return (
    <motion.section
      id={page.id}
      aria-labelledby={`${page.id}-title`}
      aria-roledescription="page"
      inert={scripted && !active}
      className={[
        "sheet grain absolute bottom-2 left-0 right-2 top-0 overflow-clip rounded-[3px] shadow-[0_1px_2px_rgb(0_0_0/0.16),0_8px_24px_-14px_rgb(0_0_0/0.45)] [backface-visibility:hidden] [transform-origin:left_center]",
        manila ? "bg-manila text-manila-ink [--grain:0.13]" : "bg-paper text-ink [--grain:0.04]",
      ].join(" ")}
      style={{ transform, visibility, opacity: fade, zIndex: count - i }}
    >
      <div ref={scroller} className={`${page.fit ? "sheet-fit" : "sheet-scroll"} h-full`}>
        {page.content}
      </div>

      {/* Below the top sheet only its edges show; keep them plain paper, not slivers of text. */}
      {!active && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-inherit" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-inherit" />
        </>
      )}

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: under }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />

      {onNext && <DogEar manila={manila} onClick={onNext} />}
    </motion.section>
  );
}

/**
 * Reports whether the sheet has content below its fold that the visitor has not started on.
 * It stops for good once they scroll, so the cue never nags while they read.
 */
function useMoreBelow(ref: RefObject<HTMLDivElement | null>, i: number, onMore: Props["onMore"], scrolls: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrolls) return;
    let started = false;
    let last: boolean | null = null;
    const check = () => {
      if (el.scrollTop > 40) started = true;
      const more = !started && el.scrollHeight - el.clientHeight > 48;
      if (more !== last) onMore(i, (last = more));
    };
    const resize = new ResizeObserver(check);
    resize.observe(el);
    if (el.firstElementChild) resize.observe(el.firstElementChild);
    el.addEventListener("scroll", check, { passive: true });
    return () => {
      resize.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [ref, i, onMore, scrolls]);
}

/**
 * The turned-down corner: the page's own way of saying it turns. Click it, or drag it with a
 * mouse. Keyboard and screen-reader users have the Next button, so it stays out of the tab order.
 */
function DogEar({ manila, onClick }: { manila: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      data-flip-handle
      onClick={onClick}
      className="group absolute bottom-0 right-0 z-10 size-12 touch-none lg:size-16"
    >
      {/* Drawn at hover size and scaled down, so the hover lift is a transform, not a resize. */}
      <span className="absolute bottom-0 right-0 size-11 origin-bottom-right scale-[0.55] drop-shadow-[-1px_-1px_1.5px_rgb(0_0_0/0.18)] transition-transform duration-200 ease-out lg:scale-[0.73] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100">
        {/* What lies beneath the corner, then the corner folded back over it. */}
        <span className="absolute inset-0 bg-manila-deep [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
        <span
          className={`absolute inset-0 [clip-path:polygon(0_0,100%_0,0_100%)] ${manila ? "bg-[#e6d1a6]" : "bg-paper-deep"}`}
        />
      </span>
    </button>
  );
}
