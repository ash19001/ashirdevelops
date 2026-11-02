import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { PageLink } from "@/components/paper/PageLink";
import { Stamp } from "@/components/paper/Stamp";
import { Strip } from "@/components/paper/Strip";
import type { CaseStudy } from "@/lib/cases";

type Props = {
  study: CaseStudy;
  /** The main exhibit: the live site. */
  hero: ReactNode;
  /** The supporting exhibits. */
  proof: ReactNode;
};

/**
 * One closed case. On a phone it reads top to bottom with the evidence woven between the words;
 * on a wide screen the words take the left half and the evidence the right (see .case-grid).
 */
export function CaseSheet({ study, hero, proof }: Props) {
  return (
    <article className="relative min-h-full pb-12 lg:pb-10">
      <Strip
        fields={[
          ["Case no.", study.number],
          ["Client", study.client],
          ["Trade", study.trade],
          study.timing,
        ]}
      />
      {/* Wide screens: in the strip's empty right end. */}
      <Stamp className="hidden lg:right-12 lg:top-3 lg:block">Solved</Stamp>

      <div className="case-grid px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <h2 id={`${study.id}-title`} className="t-head [grid-area:title] lg:max-w-[13ch]">
          {study.title}
        </h2>

        <div className="mt-7 [grid-area:hero] lg:mt-1">{hero}</div>

        <p className="t-lead mt-7 max-w-[38ch] [grid-area:lead] lg:mt-5">{study.lead}</p>

        <section aria-labelledby={`${study.id}-result`} className="mt-7 [grid-area:verdict] lg:mt-6">
          <div className="relative bg-paper-deep px-4 py-4 lg:px-5">
            {/* Phones: stamped on the result as it scrolls into view. */}
            <Stamp className="-top-4 right-2 lg:hidden" tilt={-8} delay={0.15}>
              Solved
            </Stamp>
            <h3 id={`${study.id}-result`} className="t-title">
              The result
            </h3>
            <p className="t-body mt-1.5">{study.result}</p>
            <p className="mt-2 t-small text-ink-soft">{study.facts.join(" · ")}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 font-semibold">
            <a
              href={study.url}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1.5 underline decoration-ink/30 transition-[text-decoration-color] duration-150 hover:decoration-ink"
            >
              Visit {study.urlLabel} <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
            </a>
            <PageLink
              to="your-case"
              className="inline-flex min-h-11 items-center gap-1.5 text-stamp underline decoration-stamp/30 transition-[text-decoration-color] duration-150 hover:decoration-stamp"
            >
              Want this for your business? <ArrowRightIcon size={16} weight="bold" aria-hidden />
            </PageLink>
          </div>
        </section>

        <section aria-labelledby={`${study.id}-built`} className="mt-9 [grid-area:built] lg:mt-7">
          <h3 id={`${study.id}-built`} className="t-title">
            What I built
          </h3>
          <ul className="mt-4 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            {study.built.map((item) => (
              <li key={item.name}>
                <p className="font-semibold leading-snug">{item.name}</p>
                <p className="t-body mt-1 text-ink-soft">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 [grid-area:proof] lg:mt-7">{proof}</div>
      </div>
    </article>
  );
}
