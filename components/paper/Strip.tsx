import type { ReactNode } from "react";

/**
 * The printed header of a case form: a band of labelled fields across the top of the sheet.
 * It carries the facts (case number, client, dates) so the heading can carry the story.
 */
export function Strip({ fields }: { fields: [label: string, value: ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 bg-paper-deep px-5 py-4 sm:flex sm:flex-wrap sm:gap-x-10 lg:px-12 lg:py-5">
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="t-small text-ink-soft">{label}</dt>
          <dd className="mt-0.5 font-semibold leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
