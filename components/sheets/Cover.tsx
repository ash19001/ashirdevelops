import { PageLink } from "@/components/paper/PageLink";
import { Print } from "@/components/paper/Print";
import { Stamp } from "@/components/paper/Stamp";
import { site } from "@/lib/site";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

/*
 * The folder's front: who this is, what the work is, and the way in.
 *
 * It never scrolls. On a phone its gaps scale with the screen's height and the extras go as the
 * height runs out: the case prints show only on a tall phone, and the label goes on a very short
 * one. Wide screens keep their own fixed layout (the lg: classes).
 */
const shortPhone = "[@media(max-height:600px)]:hidden";
const tallPhone = "[@media(max-width:63.99rem)_and_(min-height:800px)]:grid";

export function Cover() {
  return (
    <article className="relative flex h-full flex-col px-5 pb-4 pt-5 sm:px-8 sm:py-7 cover-vars lg:grid lg:grid-cols-12 lg:gap-x-10 lg:px-12 lg:pb-(--c-pb) lg:pt-(--c-pt)">
      <div className="flex min-h-0 flex-1 flex-col lg:col-span-7">
        {/* The typed label stuck to the front of the folder. */}
        <p
          style={rise(0)}
          className={`rise flex -rotate-1 flex-col self-start bg-paper px-4 py-2.5 shadow-[0_1px_1.5px_rgb(0_0_0/0.14)] lg:py-3 ${shortPhone} [@media(min-width:64rem)_and_(max-height:800px)]:hidden`}
        >
          <span className="font-display text-[1.375rem] font-bold leading-none tracking-[-0.02em] text-ink">
            {site.brand}
          </span>
          <span className="mt-1.5 t-small text-ink-soft">
            Case files<span className="hidden sm:inline"> of {site.name}</span>
          </span>
        </p>

        <h1 id="cover-title" style={rise(1)} className="rise t-cover mt-[clamp(0.875rem,3vh,3rem)] max-w-[12ch] lg:mt-(--c-h1)">
          Websites &amp; custom software
        </h1>
        <p
          style={rise(2)}
          className="rise t-lead mt-[clamp(0.625rem,1.6vh,1.25rem)] max-w-[34ch] text-manila-ink [@media(max-height:600px)]:text-[1.0625rem] lg:mt-(--c-lead)"
        >
          I&apos;m Ashir, a freelance web developer. Flip through some of the work I&apos;ve done, then open a case of
          your own.
        </p>

        <div
          style={rise(3)}
          className="rise mt-[clamp(0.875rem,2.8vh,2rem)] flex flex-wrap items-center gap-x-5 gap-y-2 lg:mt-(--c-cta) lg:gap-x-6 lg:gap-y-3"
        >
          <PageLink
            to="opuluxe"
            className="inline-flex h-12 items-center gap-2 rounded-[4px] bg-stamp px-5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-deep active:scale-[0.97]"
          >
            Open the file <ArrowRightIcon size={18} weight="bold" aria-hidden />
          </PageLink>
          <PageLink
            to="your-case"
            className="inline-flex min-h-11 items-center font-semibold underline decoration-manila-ink/35 transition-[text-decoration-color] duration-150 hover:decoration-manila-ink"
          >
            <span className="sm:hidden">Start yours</span>
            <span className="hidden sm:inline">Skip to starting yours</span>
          </PageLink>
        </div>

        {/* Tall phones: the two cases, small, so the work shows before the first flip. */}
        <div style={rise(4)} className={`rise mt-[clamp(1rem,3vh,2rem)] hidden grid-cols-2 gap-4 ${tallPhone}`}>
          <PageLink to="opuluxe" className="block">
            <Print
              src="/cases/opuluxe/home.webp"
              alt="Case 01, the Opuluxe Moments homepage"
              ratio={1.8}
              sizes="45vw"
              tilt={-2}
              clip
              caption="Case 01 · Opuluxe Moments"
              captionClassName="text-manila-soft"
            />
          </PageLink>
          <PageLink to="enbe" className="block">
            <Print
              src="/cases/enbe/home.webp"
              alt="Case 02, the ENbe Education homepage"
              ratio={1.8}
              sizes="45vw"
              tilt={1.5}
              caption="Case 02 · ENbe Education"
              captionClassName="text-manila-soft"
            />
          </PageLink>
        </div>

        <dl
          style={rise(5)}
          className="rise mt-auto grid gap-x-8 gap-y-4 pt-[clamp(0.875rem,2.4vh,2.5rem)] sm:grid-cols-2 lg:grid-cols-(--c-facts-cols) lg:pt-(--c-facts)"
        >
          {/* Phones leave this out to fit; the tabs and the case prints name the clients. */}
          <div className="hidden sm:block lg:[display:var(--c-solved)]">
            <dt className="t-small text-manila-soft">Cases solved</dt>
            <dd className="mt-0.5 font-semibold">Opuluxe Moments, ENbe Education</dd>
          </div>
          <div>
            <dt className="t-small text-manila-soft">What I build</dt>
            <dd className="mt-0.5 font-semibold">
              Websites, enquiry and booking forms, online payments, admin areas, and a design-your-own backdrop builder
            </dd>
          </div>
        </dl>
      </div>

      {/* Wide screens: two prints tucked into the folder, one per case. Each opens its case. */}
      <div className="relative mt-12 hidden lg:col-span-5 lg:mt-0 lg:block">
        <PageLink
          to="opuluxe"
          className="group absolute right-0 top-(--c-p1-top) block w-(--c-p1-w) transition-transform duration-200 ease-out hover:-translate-y-1"
        >
          <Print
            src="/cases/opuluxe/home.webp"
            alt="Case 01, the Opuluxe Moments homepage"
            ratio={2}
            sizes="420px"
            tilt={3}
            clip
            caption="Case 01 · Opuluxe Moments"
            captionClassName="text-manila-soft"
          />
        </PageLink>
        <PageLink
          to="enbe"
          className="group absolute bottom-(--c-p2-bottom) left-0 block w-(--c-p2-w) transition-transform duration-200 ease-out hover:-translate-y-1"
        >
          <Print
            src="/cases/enbe/home.webp"
            alt="Case 02, the ENbe Education homepage"
            ratio={2}
            sizes="380px"
            tilt={-2.5}
            caption="Case 02 · ENbe Education"
            captionClassName="text-manila-soft"
          />
        </PageLink>
      </div>

      {/* Phones: small, in the corner beside the label, and gone with the label when it goes. */}
      <Stamp small className={`right-3 top-4 sm:hidden ${shortPhone}`} tilt={-8} delay={0.95}>
        Now taking
        <br />
        new cases
      </Stamp>
      <Stamp className="hidden sm:right-8 sm:top-6 sm:block lg:right-12 lg:top-10" tilt={-8} delay={0.95}>
        Now taking
        <br />
        new cases
      </Stamp>
    </article>
  );
}
