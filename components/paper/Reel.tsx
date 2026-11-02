"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSheet } from "@/components/case-file/context";

type Props = { src: string; poster: string; label: string; caption?: ReactNode; tilt?: number; className?: string };

/**
 * A muted, looping vertical video printed onto the sheet. It plays only while its sheet is on
 * top, never fetches before then, and starts paused for visitors who prefer reduced motion.
 */
export function Reel({ src, poster, label, caption, tilt = 0, className = "" }: Props) {
  const { active, primed } = useSheet();
  const reduce = useReducedMotion();
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const video = useRef<HTMLVideoElement>(null);
  const playing = active && (choice === "play" || (choice === "auto" && !reduce));

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, primed]);

  return (
    <figure className={`relative ${className}`} style={{ rotate: `${tilt}deg` }}>
      <div className="bg-white p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.14),0_10px_22px_-12px_rgb(0_0_0/0.4)] sm:p-2">
        <div className="relative aspect-[9/16] overflow-hidden bg-paper-deep">
          {primed && (
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              poster={poster}
              aria-label={label}
              className="absolute inset-0 size-full object-cover"
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          <button
            type="button"
            onClick={() => setChoice(playing ? "pause" : "play")}
            aria-label={playing ? "Pause the reel" : "Play the reel"}
            className="group absolute bottom-0 right-0 grid size-11 place-items-center"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink/75 text-white transition-transform duration-150 ease-out group-active:scale-90">
              {playing ? <PauseIcon size={14} weight="fill" aria-hidden /> : <PlayIcon size={14} weight="fill" aria-hidden />}
            </span>
          </button>
        </div>
      </div>
      {caption && <figcaption className="mt-2.5 t-small text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}
