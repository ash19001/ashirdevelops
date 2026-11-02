"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useSheet } from "@/components/case-file/context";

type Props = {
  src: string;
  alt: string;
  /** The crop shown, as width / height. The picture covers it from the top. */
  ratio: number;
  sizes: string;
  caption?: ReactNode;
  tilt?: number;
  clip?: boolean;
  className?: string;
  captionClassName?: string;
};

/**
 * An evidence print: the picture on white photo stock, sometimes paperclipped to the sheet.
 * It loads only once its sheet is near the top of the stack, so a phone on mobile data fetches
 * the cover's pictures first and the rest as the visitor flips.
 */
export function Print({
  src,
  alt,
  ratio,
  sizes,
  caption,
  tilt = 0,
  clip,
  className = "",
  captionClassName = "text-ink-soft",
}: Props) {
  const { primed } = useSheet();
  return (
    <figure className={`relative ${className}`} style={{ rotate: `${tilt}deg` }}>
      <div className="bg-white p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.14),0_10px_22px_-12px_rgb(0_0_0/0.4)] sm:p-2">
        <div className="relative overflow-hidden bg-paper-deep" style={{ aspectRatio: ratio }}>
          {primed && <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />}
        </div>
      </div>
      {clip && <Paperclip className="absolute -top-5 left-6 h-14 w-5" />}
      {caption && <figcaption className={`mt-2.5 t-small ${captionClassName}`}>{caption}</figcaption>}
    </figure>
  );
}

/** A phone, for screenshots taken at phone size. */
export function Phone({ src, alt, sizes, tilt = 0, className = "" }: Omit<Props, "ratio" | "caption" | "clip" | "captionClassName">) {
  const { primed } = useSheet();
  return (
    <div
      className={`rounded-[18px] bg-ink p-[4px] shadow-[0_1px_2px_rgb(0_0_0/0.18),0_12px_24px_-14px_rgb(0_0_0/0.5)] lg:rounded-[22px] lg:p-[5px] ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <div className="relative aspect-[390/760] overflow-hidden rounded-[14px] bg-paper-deep lg:rounded-[17px]">
        {primed && <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />}
      </div>
    </div>
  );
}

export function Paperclip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 56"
      fill="none"
      aria-hidden
      className={`drop-shadow-[1px_1.5px_1px_rgb(0_0_0/0.25)] ${className}`}
    >
      <path
        d="M7 21V8.5a3.5 3.5 0 0 1 7 0V45a6 6 0 0 1-12 0V14"
        stroke="#7d848c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M7 21V8.5a3.5 3.5 0 0 1 7 0V45a6 6 0 0 1-12 0V14"
        stroke="#d5d9dd"
        strokeWidth="0.9"
        strokeLinecap="round"
        transform="translate(-0.4 -0.4)"
      />
    </svg>
  );
}
