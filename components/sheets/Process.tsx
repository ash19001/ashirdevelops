import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { PageLink } from "@/components/paper/PageLink";
import { Strip } from "@/components/paper/Strip";

type Step = { name: string; note?: string; text: ReactNode };

/*
 * The process, in Ashir's own steps. Step 3 only happens when the client wants time to think
 * after the first call; otherwise step 2 runs long and goes straight on to the build.
 */
const steps: Step[] = [
  {
    name: "Tell me what you want",
    text: (
      <>
        Just a few lines on your business and what you&apos;d like built.{" "}
        <PageLink to="your-case" className="font-semibold text-ink underline decoration-ink/30 hover:decoration-ink">
          The last page of this file
        </PageLink>{" "}
        writes the message for you.
      </>
    ),
  },
  {
    name: "A free first call",
    text: "Before we talk, I build a first mockup. We go through it together and agree a price range. Happy straight away? We stay on, go through each part of the scope, and settle a timeline and a firmer quote, then it's straight to step 4.",
  },
  {
    name: "A follow-up call",
    note: "If you'd like time to think first",
    text: "We go through the mockup in detail and you tell me everything you want. From that I work out the scope, a specific quote and an estimated timeline. We also get things set up, like a Vercel account for the hosting with me added as an admin.",
  },
  {
    name: "The build",
    text: "The site takes shape on a live preview link that updates as I work. We go round in cycles until it's ready for your customers.",
  },
  {
    name: "Launch and hand-over",
    text: "It goes live on your domain, and I hand it over and show you how to update the parts you'll want to change.",
  },
];

/** Each thing on offer, with the case that proves it. */
const capabilities: { what: string; proof: { label: string; to: string }[] }[] = [
  { what: "A site that looks as good as your work", proof: [{ label: "01", to: "opuluxe" }, { label: "02", to: "enbe" }] },
  { what: "Tools nobody else has, like a design-your-own backdrop", proof: [{ label: "01", to: "opuluxe" }] },
  { what: "Enquiry forms that ask the right questions", proof: [{ label: "01", to: "opuluxe" }] },
  { what: "Booking and consultation requests", proof: [{ label: "02", to: "enbe" }] },
  { what: "Online payments and deposits", proof: [{ label: "01", to: "opuluxe" }] },
  { what: "An admin area, so you can edit it yourself", proof: [{ label: "01", to: "opuluxe" }] },
  { what: "Launch reels for Instagram and TikTok", proof: [{ label: "01", to: "opuluxe" }] },
];

/** A run of steps, numbered from `start`. The numbers are real: step 2 refers to step 4. */
function Steps({ from, start }: { from: Step[]; start: number }) {
  return (
    <ol start={start} role="list" className="grid gap-7 lg:gap-8">
      {from.map((step, k) => (
        <li key={step.name} className="grid max-w-[46ch] grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
          <span aria-hidden className="font-display text-[1.375rem] font-bold leading-[1.05] text-ink-soft tabular-nums">
            {start + k}
          </span>
          <div>
            <h3 className="font-display text-[1.375rem] font-bold leading-[1.05] tracking-[-0.02em]">{step.name}</h3>
            {step.note && <p className="mt-1.5 t-small font-semibold text-ink-soft">{step.note}</p>}
            <p className="t-body mt-2 text-ink-soft">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Process() {
  return (
    <article className="relative min-h-full pb-12">
      <Strip
        fields={[
          ["Section", "How I work"],
          ["First call", "Free, with a mockup"],
          ["Applies to", "Every case"],
        ]}
      />

      <div className="px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <h2 id="process-title" className="t-head">
          How a case runs
        </h2>

        <div className="mt-8 grid gap-7 lg:mt-10 lg:grid-cols-2 lg:gap-x-12">
          <Steps from={steps.slice(0, 3)} start={1} />
          <div className="grid content-start gap-7 lg:gap-8">
            <Steps from={steps.slice(3)} start={4} />
            <div className="bg-paper-deep px-5 py-5">
              <h3 className="t-title">Ready for step 1?</h3>
              <p className="t-body mt-1.5">A few lines is all it takes, and the first call is free.</p>
              <PageLink
                to="your-case"
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-[4px] bg-stamp px-5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-deep active:scale-[0.97]"
              >
                Tell me what you want <ArrowRightIcon size={18} weight="bold" aria-hidden />
              </PageLink>
            </div>
          </div>
        </div>

        <section aria-labelledby="process-build" className="mt-14 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <h3 id="process-build" className="t-title">
              What I can build for you
            </h3>
            <table className="mt-4 w-full border-collapse text-left">
              <thead className="sr-only">
                <tr>
                  <th scope="col">What</th>
                  <th scope="col">Proof</th>
                </tr>
              </thead>
              <tbody>
                {capabilities.map((row) => (
                  <tr key={row.what} className="even:bg-paper-deep">
                    <td className="py-3 pl-3 pr-2 font-semibold leading-snug">{row.what}</td>
                    <td className="w-[1%] py-1 pr-1 text-right">
                      <span className="flex flex-col items-end lg:flex-row lg:justify-end">
                        {row.proof.map((p) => (
                          <PageLink
                            key={p.to}
                            to={p.to}
                            className="inline-flex h-11 items-center whitespace-nowrap px-2 t-small font-semibold text-stamp underline decoration-stamp/30 transition-[text-decoration-color] duration-150 hover:decoration-stamp"
                          >
                            Case {p.label}
                          </PageLink>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="t-body mt-6 max-w-[40ch] lg:col-span-5 lg:mt-12">
            Every site is designed for phones first, because that&apos;s where your customers will find you.
          </p>
        </section>
      </div>
    </article>
  );
}
