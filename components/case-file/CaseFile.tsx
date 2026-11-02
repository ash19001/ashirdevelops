"use client";

import { ArrowCounterClockwiseIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { animate, motionValue, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { instagramUrl, site, tiktokUrl } from "@/lib/site";
import { CaseFileContext, SheetContext } from "./context";
import { Sheet } from "./Sheet";
import { FLIPPED, STEP, type Page, type SheetValues } from "./shared";

// Critically damped: a page turn should land, not wobble. Velocity from a drag is carried in.
const TURN = { type: "spring", bounce: 0, duration: 0.6 } as const;
const RIFLE = { type: "spring", bounce: 0, duration: 0.48 } as const;
const RIFLE_GAP = 0.065;
const FADE = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const depthOffset = (i: number, top: number) => (i < top ? 0 : Math.min(i - top, 3) * STEP);
/** Resistance at the end of the file: the further the drag, the less the sheet follows. */
const rubber = (p: number) => (1 - 1 / (p * 2.4 + 1)) * 14;

type Drag = {
  id: number;
  x: number;
  y: number;
  width: number;
  /** 1 turns forward (dragging left), -1 back (dragging right), 0 until the direction is known. */
  dir: 0 | 1 | -1;
  hist: { x: number; t: number }[];
};

type GoOptions = { dragged?: number; velocity?: number; fromHash?: boolean };

export function CaseFile({ pages }: { pages: Page[] }) {
  const n = pages.length;
  const reduce = useReducedMotion() ?? false;
  const reduceRef = useRef(reduce);
  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [primed, setPrimed] = useState<Set<number>>(() => new Set([0, 1]));
  const touched = useRef(false);
  // Which sheets still have unread content below their fold (see the cue in the footer).
  const [below, setBelow] = useState<boolean[]>(() => pages.map(() => false));
  const reportBelow = useCallback(
    (i: number, more: boolean) => setBelow((prev) => (prev[i] === more ? prev : prev.with(i, more))),
    [],
  );

  const values = useMemo<SheetValues[]>(
    () =>
      pages.map((_, i) => ({
        rot: motionValue(0),
        fade: motionValue(1),
        off: motionValue(depthOffset(i, 0)),
      })),
    // One set for the life of the file; the page list never changes at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n],
  );

  const prime = useCallback((target: number) => {
    setPrimed((prev) => {
      const next = new Set(prev);
      for (let i = target - 1; i <= target + 1; i++) next.add(i);
      return next.size === prev.size ? prev : next;
    });
  }, []);

  const syncHash = useCallback(
    (target: number) => {
      const url = target === 0 ? window.location.pathname + window.location.search : `#${pages[target].id}`;
      window.history.replaceState(null, "", url);
    },
    [pages],
  );

  const goTo = useCallback(
    (raw: number, opts: GoOptions = {}) => {
      const target = clamp(raw, 0, n - 1);
      touched.current = true;
      indexRef.current = target;
      setIndex(target);
      prime(target);
      if (!opts.fromHash) syncHash(target);

      if (reduceRef.current) {
        values.forEach((v, i) => {
          v.rot.set(0);
          v.off.set(depthOffset(i, target));
          animate(v.fade, i < target ? 0 : 1, FADE);
        });
        return;
      }

      // Sheets that must turn forward go in page order; sheets coming back land deepest
      // first, so the target ends up on top.
      const forward: number[] = [];
      const back: number[] = [];
      values.forEach((v, i) => {
        v.fade.set(1);
        const want = i < target ? FLIPPED : 0;
        if (Math.abs(v.rot.get() - want) < 0.25) return;
        (want === FLIPPED ? forward : back).push(i);
      });
      const order = [...forward, ...back.reverse()];
      const rifling = order.length > 1;
      order.forEach((i, k) => {
        animate(values[i].rot, i < target ? FLIPPED : 0, {
          ...(rifling ? RIFLE : TURN),
          delay: rifling ? k * RIFLE_GAP : 0,
          velocity: opts.dragged === i ? opts.velocity : undefined,
        });
      });
      values.forEach((v, i) => animate(v.off, depthOffset(i, target), TURN));
    },
    [n, prime, syncHash, values],
  );

  /** Moves straight to a page without animating: a deep link on load. */
  const jump = useCallback(
    (target: number) => {
      indexRef.current = target;
      setIndex(target);
      prime(target);
      values.forEach((v, i) => {
        v.rot.set(i < target && !reduceRef.current ? FLIPPED : 0);
        v.fade.set(i < target && reduceRef.current ? 0 : 1);
        v.off.set(depthOffset(i, target));
      });
    },
    [prime, values],
  );

  const goToId = useCallback(
    (id: string) => {
      const i = pages.findIndex((p) => p.id === id);
      if (i >= 0) goTo(i);
    },
    [goTo, pages],
  );

  // Deep links (#opuluxe, #your-case) open on their page, and hash links keep working.
  useLayoutEffect(() => {
    const fromHash = () => pages.findIndex((p) => `#${p.id}` === window.location.hash);
    const initial = fromHash();
    // The URL is the outside source here; reading it on mount is the sync the rule allows for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial > 0) jump(initial);
    const onHash = () => goTo(Math.max(fromHash(), 0), { fromHash: true });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo, jump, pages]);

  // Arrow keys turn pages, except while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable]")) return;
      const i = indexRef.current;
      if (e.key === "ArrowRight") goTo(i + 1);
      else if (e.key === "ArrowLeft") goTo(i - 1);
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(n - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, n]);

  // A first-time hint that the cover turns: its edge lifts a little and settles back, once,
  // unless the visitor has already started.
  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(async () => {
      if (touched.current || indexRef.current !== 0) return;
      await animate(values[0].rot, -16, { type: "spring", bounce: 0, duration: 0.55 });
      if (touched.current || indexRef.current !== 0) return;
      animate(values[0].rot, 0, { type: "spring", bounce: 0.25, duration: 0.6 });
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [reduce, values]);

  // ---- Dragging a page ------------------------------------------------------------------
  // Touch drags anywhere on the sheet; a mouse only from the turned-down corner, so text
  // stays selectable. Vertical moves are left to the sheet's own scroll.
  const drag = useRef<Drag | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current || e.button !== 0) return; // a second finger mid-drag is ignored
    const t = e.target as Element;
    if (t.closest("input, textarea, select, [contenteditable], video, [data-no-flip]")) return;
    if (e.pointerType === "mouse" && !t.closest("[data-flip-handle]")) return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      width: e.currentTarget.getBoundingClientRect().width,
      dir: 0,
      hist: [{ x: e.clientX, t: e.timeStamp }],
    };
    dragged.current = false;
  };

  const follow = (d: Drag, dx: number) => {
    const i = indexRef.current;
    const span = d.width * 0.8;
    const reduced = reduceRef.current;
    if (d.dir === 1) {
      const p = clamp(-dx / span, 0, 1);
      if (i >= n - 1) {
        if (!reduced) values[i].rot.set(-rubber(p));
      } else if (reduced) values[i].fade.set(1 - p);
      else values[i].rot.set(-90 * p);
    } else if (i > 0) {
      const p = clamp(dx / span, 0, 1);
      if (reduced) values[i - 1].fade.set(p);
      else values[i - 1].rot.set(-90 + 90 * p);
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.dir === 0) {
      if (Math.hypot(dx, dy) < 10) return; // hysteresis before committing to a direction
      if (Math.abs(dy) > Math.abs(dx) && e.pointerType !== "mouse") {
        drag.current = null; // a scroll, not a turn
        return;
      }
      d.dir = dx < 0 ? 1 : -1;
      dragged.current = true;
      touched.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      const i = indexRef.current;
      values[i].rot.stop();
      if (i > 0) values[i - 1].rot.stop();
    }
    d.hist.push({ x: e.clientX, t: e.timeStamp });
    if (d.hist.length > 6) d.hist.shift();
    follow(d, dx);
  };

  const release = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    if (d.dir === 0) return;

    const first = d.hist[0];
    const last = d.hist[d.hist.length - 1];
    const v = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0; // px per ms
    const span = d.width * 0.8;
    const p = clamp(((e.clientX - d.x) * -d.dir) / span, 0, 1);
    const velocity = ((90 * v) / span) * 1000; // the pointer's speed, in degrees per second
    const i = indexRef.current;
    // A flick commits whatever the distance; a slow drag commits past halfway unless it
    // was heading back.
    const toward = -d.dir * v;
    const commit = !cancelled && (toward > 0.35 || (p > 0.45 && toward > -0.35));

    if (d.dir === 1) {
      if (commit && i < n - 1) goTo(i + 1, { dragged: i, velocity });
      else if (reduceRef.current) animate(values[i].fade, 1, FADE);
      else animate(values[i].rot, 0, { ...TURN, velocity });
    } else if (i > 0) {
      if (commit) goTo(i - 1, { dragged: i - 1, velocity });
      else if (reduceRef.current) animate(values[i - 1].fade, 0, FADE);
      else animate(values[i - 1].rot, FLIPPED, { ...TURN, velocity });
    }
  };

  // A drag that ends over a link or button must not also click it.
  const onClickCapture = (e: MouseEvent) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const ctx = useMemo(() => ({ pages, index, goTo, goToId }), [pages, index, goTo, goToId]);
  const current = pages[index];
  const last = index === n - 1;

  const link = (target: number) => ({
    href: target === 0 ? "#" : `#${pages[target].id}`,
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      goTo(target);
    },
  });

  return (
    <CaseFileContext.Provider value={ctx}>
      {/* Phones have no header row: the folder and the controls take the whole screen. */}
      <div className="on-desk grid h-dvh grid-rows-[minmax(0,1fr)_auto] lg:grid-rows-[auto_minmax(0,1fr)_auto]">
        <header className="mx-auto hidden w-full max-w-[1240px] items-center justify-between gap-8 px-8 pb-3 pt-5 lg:flex">
          <p className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-bold tracking-[-0.02em] text-desk-ink">{site.brand}</span>
            <span className="t-small text-desk-soft">
              {site.name}, {site.role.toLowerCase()}
            </span>
          </p>
          <nav aria-label="Elsewhere" className="flex items-center gap-7 t-small font-semibold">
            <a href={instagramUrl} className="text-desk-soft transition-colors duration-150 hover:text-desk-ink">
              Instagram
            </a>
            <a href={tiktokUrl} className="text-desk-soft transition-colors duration-150 hover:text-desk-ink">
              TikTok
            </a>
            <a
              {...link(n - 1)}
              className="inline-flex h-11 items-center rounded-[4px] bg-stamp px-5 text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-deep active:scale-[0.97]"
            >
              Start your case
            </a>
          </nav>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-[1240px] flex-col px-2.5 pt-2.5 sm:px-6 lg:px-8 lg:pt-1">
          <nav aria-label="Pages in this file" className="relative z-10 -mb-1.5 lg:-mb-3">
            {/* Never scrolls sideways: on a very narrow phone the closed tabs shorten instead. Clipped
                sideways only, so a tab lifting on hover is not cut off at the top. */}
            <ul className="flex items-end gap-1 overflow-x-clip px-1.5 lg:gap-1.5 lg:px-3">
              {pages.map((p, i) => {
                const on = i === index;
                return (
                  <li key={p.id} className={on ? "shrink-0" : "min-w-0"}>
                    <a
                      {...link(i)}
                      aria-current={on ? "page" : undefined}
                      className={[
                        // The open page's tab reaches down through the folder's lip to join its
                        // sheet; the others stop at the lip, behind it. A closed tab lifts on hover; its
                        // ::after fills the gap under it, shown at once on the way up and kept until
                        // the tab has settled back, so no desk ever shows between tab and folder.
                        "flex items-center rounded-t-lg px-2 text-[0.8125rem] font-semibold min-[375px]:px-2.5 transition-[transform,background-color,color] duration-200 ease-out sm:px-3.5 sm:text-sm lg:px-5",
                        on
                          ? `h-[3.125rem] pb-1.5 lg:h-[3.25rem] lg:pb-3 ${pages[i].tone === "manila" ? "bg-manila text-manila-ink" : "bg-paper text-ink"}`
                          : "relative mb-1.5 h-10 bg-manila-deep text-manila-ink/75 after:absolute after:inset-x-0 after:top-full after:h-1 after:bg-manila-deep after:opacity-0 after:transition-opacity after:delay-200 after:duration-0 hover:-translate-y-0.5 hover:text-manila-ink hover:after:opacity-100 hover:after:delay-0 lg:mb-3",
                      ].join(" ")}
                    >
                      <span className="truncate">{p.tab}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="grain relative min-h-0 flex-1 rounded-[10px] bg-manila-deep p-1.5 [--grain:0.14] lg:p-3">
            <div
              className="relative h-full [perspective:2400px]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => release(e, false)}
              onPointerCancel={(e) => release(e, true)}
              onClickCapture={onClickCapture}
            >
              {pages.map((page, i) => (
                <SheetContext.Provider
                  key={page.id}
                  value={{ id: page.id, active: i === index, primed: primed.has(i) }}
                >
                  <Sheet
                    page={page}
                    i={i}
                    count={n}
                    values={values[i]}
                    above={values[i - 1]}
                    active={i === index}
                    onNext={i < n - 1 ? () => goTo(i + 1) : undefined}
                    onMore={reportBelow}
                  />
                </SheetContext.Provider>
              ))}
            </div>
          </div>
        </div>

        <footer className="mx-auto flex w-full max-w-[1240px] items-center gap-3 px-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-6 lg:px-8 lg:pb-5 lg:pt-4">
          <a
            {...link(Math.max(index - 1, 0))}
            aria-label="Previous page"
            aria-disabled={index === 0}
            tabIndex={index === 0 ? -1 : undefined}
            className="grid size-12 shrink-0 place-items-center rounded-[4px] bg-desk-raised text-desk-ink transition-[opacity,transform,background-color] duration-150 ease-out hover:bg-[#33413a] active:scale-[0.96] aria-disabled:pointer-events-none aria-disabled:opacity-35"
          >
            <ArrowLeftIcon size={20} weight="bold" aria-hidden />
          </a>
          <p className="min-w-0 flex-1 truncate text-center t-small text-desk-soft">
            <span className="font-semibold text-desk-ink">{current.title}</span>
            <span aria-hidden> · </span>
            <span>
              {index + 1} of {n}
            </span>
            {/* Wide screens: point out a page that continues below its fold, here rather than
                over the sheet. Phones show it by the content running off the bottom. */}
            {below[index] ? (
              <>
                <span aria-hidden className="hidden lg:inline"> · </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector<HTMLElement>(`#${current.id} .sheet-scroll`);
                    el?.scrollBy({ top: el.clientHeight * 0.7, behavior: reduce ? "auto" : "smooth" });
                  }}
                  className="hidden items-center gap-1 font-semibold text-desk-ink underline decoration-desk-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-desk-ink lg:inline-flex"
                >
                  More on this page <ArrowDownIcon size={13} weight="bold" aria-hidden />
                </button>
              </>
            ) : (
              <span className="hidden text-desk-soft/80 lg:inline"> · use ← → or drag the corner</span>
            )}
          </p>
          <a
            {...link(last ? 0 : index + 1)}
            className="flex h-12 shrink-0 items-center gap-2 rounded-[4px] bg-paper px-4 font-semibold text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-white active:scale-[0.97] sm:px-5"
          >
            {last ? (
              <>
                <ArrowCounterClockwiseIcon size={18} weight="bold" aria-hidden /> Back to cover
              </>
            ) : (
              <>
                {index === 0 ? "Open the file" : "Next"} <ArrowRightIcon size={18} weight="bold" aria-hidden />
              </>
            )}
          </a>
        </footer>

        <p className="sr-only" aria-live="polite">
          {`Page ${index + 1} of ${n}: ${current.title}`}
        </p>
      </div>
    </CaseFileContext.Provider>
  );
}
