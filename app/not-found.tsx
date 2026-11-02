import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Stamp } from "@/components/paper/Stamp";
import { Strip } from "@/components/paper/Strip";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found · ${site.brand}`,
};

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

/*
 * Any address that isn't the site: one sheet in the same folder, saying so, with the way back in.
 * The links are plain, so the file opens fresh, as it does from a shared link.
 */
/* eslint-disable @next/next/no-html-link-for-pages -- full page loads on purpose: the file reads its #page on load. */
export default function NotFound() {
  return (
    <main className="grid h-dvh place-items-center overflow-y-auto overflow-x-hidden px-4 py-6 sm:py-8">
      <div className="w-full max-w-[38rem]">
        <p style={rise(0)} className="rise mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-1">
          <span className="font-display text-2xl font-bold tracking-[-0.02em] text-desk-ink">{site.brand}</span>
          <span className="t-small text-desk-soft">
            {site.name}, {site.role.toLowerCase()}
          </span>
        </p>

        <div style={rise(1)} className="rise">
          {/* The tab reaches down through the folder's lip to join its sheet, as in the file. */}
          <div className="relative z-10 -mb-1.5 flex px-1.5 lg:-mb-3 lg:px-3">
            <span className="flex h-[3.125rem] items-center rounded-t-lg bg-paper px-3.5 pb-1.5 text-sm font-semibold text-ink sm:px-5 lg:h-[3.25rem] lg:pb-3">
              Case 404
            </span>
          </div>

          <div className="grain relative rounded-[10px] bg-manila-deep p-1.5 [--grain:0.14] lg:p-3">
            <article
              aria-labelledby="missing-title"
              className="grain relative overflow-clip rounded-[3px] bg-paper text-ink shadow-[0_1px_2px_rgb(0_0_0/0.16),0_8px_24px_-14px_rgb(0_0_0/0.45)] [--grain:0.04]"
            >
              <Strip
                fields={[
                  ["Case no.", "404"],
                  ["Status", "Not on file"],
                ]}
              />
              <div className="px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8 lg:px-12">
                <h1 id="missing-title" className="t-head max-w-[13ch]">
                  This page isn&apos;t in the file
                </h1>
                <p className="t-lead mt-4 max-w-[34ch]">
                  The link may be old or mistyped. Everything is on one page: the cases, how I work, and where to start
                  yours.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href="/"
                    className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-stamp px-5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-deep active:scale-[0.97]"
                  >
                    Open the file <ArrowRightIcon size={18} weight="bold" aria-hidden />
                  </a>
                  <a
                    href="/#your-case"
                    className="inline-flex min-h-11 items-center font-semibold underline decoration-ink/35 transition-[text-decoration-color] duration-150 hover:decoration-ink"
                  >
                    Start your case
                  </a>
                </div>
              </div>

              {/* Phones: across the foot of the strip, clear of its fields and of the heading's long
                  second line. Wider: on the strip, beside its fields. */}
              <Stamp show className="right-4 top-[4.375rem] sm:right-8 sm:top-3" small tilt={-8} delay={0.7}>
                Not on
                <br />
                file
              </Stamp>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
