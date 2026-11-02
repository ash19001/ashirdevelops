"use client";

import { Stamp } from "@/components/paper/Stamp";
import { Strip } from "@/components/paper/Strip";
import { instagramDmUrl, instagramUrl, site, tiktokUrl } from "@/lib/site";
import { CheckIcon, EnvelopeSimpleIcon, InstagramLogoIcon } from "@phosphor-icons/react";
import { useId, useState, useSyncExternalStore } from "react";

/** What a visitor can ask for, and how it reads in the message. */
const needs = [
  { label: "A new website", phrase: "a new website" },
  { label: "A redesign", phrase: "redesigning my current site" },
  { label: "Enquiries or bookings", phrase: "taking enquiries or bookings online" },
  { label: "Online payments", phrase: "taking payments online" },
  { label: "Editing it myself", phrase: "being able to edit it myself" },
  { label: "Not sure yet", phrase: "working out what I need" },
];

const listed = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function compose(business: string, picked: string[], notes: string) {
  const phrases = needs.filter((n) => picked.includes(n.label)).map((n) => n.phrase);
  // "Bloom & Co." already ends the sentence; don't add a second full stop.
  const run = business ? `I run ${business}${/[.!?]$/.test(business) ? "" : "."}` : "I run a small business.";
  const lines = ["Hi Ashir,", "", run];
  if (phrases.length) lines.push(`I'd like help with ${listed(phrases)}.`);
  if (notes.trim()) lines.push("", notes.trim());
  lines.push("", "Found you through your case file.");
  return lines.join("\n");
}

// The date is read in the browser only: the page is prerendered, and the visitor's today is
// the one that belongs on their case.
const subscribe = () => () => {};
const formatToday = () =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
const thisYear = () => new Date().getFullYear();
const useToday = () => useSyncExternalStore(subscribe, formatToday, () => null);
const useYear = () => useSyncExternalStore(subscribe, thisYear, () => null);

const linkClass = "inline-flex min-h-11 items-center underline decoration-ink/30 hover:decoration-ink";

/**
 * The visitor's own case: three questions that write the first message for them. Nothing is
 * sent from the page. Email opens their mail app with it written; Instagram copies it and
 * opens the DM thread, since a DM link cannot carry text.
 */
export function YourCase() {
  const [business, setBusiness] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [filed, setFiled] = useState(false);
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const id = useId();
  const today = useToday();
  const year = useYear();

  const name = business.trim();
  const message = compose(name, picked, notes);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`New case: ${name || "my business"}`)}&body=${encodeURIComponent(message)}`;

  const toggle = (label: string) =>
    setPicked((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));

  const sendDm = () => {
    setFiled(true);
    // Start the copy while this page still has focus, then open the DM inside the same click
    // so it is not treated as a pop-up. Where pop-ups are blocked, go to it in this tab.
    const copying = navigator.clipboard?.writeText(message);
    const tab = window.open(instagramDmUrl, "_blank");
    if (tab) tab.opener = null;
    else window.location.href = instagramDmUrl;
    if (copying) copying.then(() => setCopy("copied"), () => setCopy("failed"));
    else setCopy("failed");
  };

  const field =
    "w-full rounded-[4px] bg-paper-deep px-4 text-[1.0625rem] text-ink placeholder:text-ink-soft/80 transition-[background-color] duration-150 focus:bg-white";

  return (
    <article className="relative min-h-full pb-10">
      <Strip
        fields={[
          ["Case no.", "03"],
          ["Client", name || "Your business"],
          ["Opened", today ?? "Today"],
          ["Status", filed ? "Filed" : "Open"],
        ]}
      />
      {/* Wide screens: in the strip's empty right end. */}
      <Stamp show={filed} delay={0.05} className="hidden lg:right-12 lg:top-3 lg:block">
        Case opened
      </Stamp>

      <div className="brief-grid px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <div className="relative [grid-area:head]">
          <h2 id="your-case-title" className="t-head">
            Your business is case 03
          </h2>
          {/* Phones: beside the headline's short second line. */}
          <Stamp show={filed} delay={0.05} tilt={-8} className="right-0 top-9 sm:top-2 lg:hidden">
            Case opened
          </Stamp>
          <p className="t-lead mt-4 max-w-[40ch]">
            Tell me a little about it. This writes the message for you, ready to send by email or Instagram DM.
          </p>
        </div>

        <form className="mt-8 grid gap-6 [grid-area:form] lg:mt-7 lg:gap-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor={`${id}-business`} className="font-semibold">
              Business name
            </label>
            <input
              id={`${id}-business`}
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              autoComplete="organization"
              placeholder="e.g. Bloom & Co. Florist"
              className={`${field} mt-2 h-12`}
            />
          </div>

          <fieldset>
            <legend className="font-semibold">What do you need?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {needs.map((n) => {
                const on = picked.includes(n.label);
                return (
                  <button
                    key={n.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(n.label)}
                    className={[
                      "inline-flex h-11 items-center gap-1.5 rounded-[4px] px-4 text-base font-semibold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                      on ? "bg-ink text-paper" : "bg-paper-deep text-ink hover:bg-paper-edge",
                    ].join(" ")}
                  >
                    {on && <CheckIcon size={15} weight="bold" aria-hidden />}
                    {n.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor={`${id}-notes`} className="font-semibold">
              Anything else? <span className="font-normal text-ink-soft">Optional</span>
            </label>
            <textarea
              id={`${id}-notes`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. I get lots of DMs asking for prices"
              className={`${field} mt-2 resize-none py-3 leading-[1.5]`}
            />
          </div>
        </form>

        <section
          aria-labelledby="your-case-preview"
          className={`mt-10 [grid-area:preview] lg:mt-1 ${copy === "failed" ? "block" : "hidden lg:block"}`}
        >
          <h3 id="your-case-preview" className="t-title">
            Your message
          </h3>
          {/* An index card, typed out as the visitor fills in the form. */}
          <div className="mt-4 rotate-[0.6deg] bg-white px-5 py-5 shadow-[0_1px_2px_rgb(0_0_0/0.14),0_10px_22px_-14px_rgb(0_0_0/0.4)]">
            <p className="t-small text-ink-soft">
              To {site.name} · Re: New case{name ? `: ${name}` : ""}
            </p>
            <p className="t-body mt-3 select-all whitespace-pre-line">{message}</p>
          </div>
        </section>

        <div className="mt-7 [grid-area:send] lg:mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={mailto}
              onClick={() => setFiled(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-stamp px-5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stamp-deep active:scale-[0.97]"
            >
              <EnvelopeSimpleIcon size={19} weight="bold" aria-hidden /> Email my case
            </a>
            <button
              type="button"
              onClick={sendDm}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-ink px-5 font-semibold text-paper transition-[background-color,transform] duration-150 ease-out hover:bg-[#34312b] active:scale-[0.97]"
            >
              <InstagramLogoIcon size={19} weight="bold" aria-hidden /> Send as Instagram DM
            </button>
          </div>
          <p className="mt-3 t-small text-ink-soft" aria-live="polite">
            {copy === "copied"
              ? "Copied. Paste it into the DM that just opened."
              : copy === "failed"
                ? "Couldn't copy it automatically. Copy the message from the card instead."
                : "You'll see the message before it is sent."}
          </p>
        </div>

        <section aria-labelledby="your-case-direct" className="mt-10 [grid-area:direct] lg:mt-9">
          <h3 id="your-case-direct" className="t-title">
            Or reach me directly
          </h3>
          <ul className="mt-2 flex flex-col font-semibold lg:flex-row lg:flex-wrap lg:gap-x-6">
            <li>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={instagramUrl} className={linkClass}>
                Instagram @{site.instagram}
              </a>
            </li>
            <li>
              <a href={tiktokUrl} className={linkClass}>
                TikTok @{site.tiktok}
              </a>
            </li>
          </ul>
          <p className="mt-4 t-small text-ink-soft">
            More of my work at{" "}
            <a href={site.portfolio} className="font-semibold text-ink underline decoration-ink/30 hover:decoration-ink">
              ashirkhan.com
            </a>
            . © {year ?? 2026} {site.name}.
          </p>
        </section>
      </div>
    </article>
  );
}
