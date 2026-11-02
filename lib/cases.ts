/**
 * The case studies. Every claim here comes from the project itself (its code, its history or
 * the live site); keep it that way when you add a case.
 */
export type CaseStudy = {
  id: string;
  number: string;
  client: string;
  trade: string;
  /** The fourth field in the form strip: when it was opened, or how long it took. */
  timing: [label: string, value: string];
  /** The story in a line: what changed for the client. Two lines at most on any screen. */
  title: string;
  /** The problem as the client had it. */
  lead: string;
  built: { name: string; text: string }[];
  result: string;
  facts: string[];
  url: string;
  urlLabel: string;
};

export const opuluxe: CaseStudy = {
  id: "opuluxe",
  number: "01",
  client: "Opuluxe Moments",
  trade: "Luxury event styling",
  timing: ["Opened", "June 2026"],
  title: "From DMs to booked and paid",
  lead: "Every enquiry used to arrive as an Instagram DM with no date, guest count or budget. Each one meant a long back-and-forth before Opuluxe could even quote.",
  built: [
    // First: the part nobody had done before.
    {
      name: "Design-your-own backdrop",
      text: "Something new for event styling: customers build their backdrop piece by piece on the site and watch the estimate update as they go.",
    },
    {
      name: "Build Your Event",
      text: "An enquiry form that collects the desired date, venue, guests, palette, budget and, inspiration photos to create a bespoke event plan.",
    },
    {
      name: "Online payments",
      text: "Every enquiry gets its own secure Stripe link, so deposits are paid without a phone call.",
    },
    {
      name: "An admin portal",
      text: "The owner edits prices, products, FAQs, policies and emails without needing a developer.",
    },
  ],
  result:
    "Enquiries now arrive with everything needed to quote, including any backdrop the customer designed, and deposits are paid online.",
  facts: ["Next.js, Supabase and Stripe", "75+ pages", "800+ automated tests"],
  url: "https://www.opuluxemoments.co.uk/",
  urlLabel: "opuluxemoments.co.uk",
};

export const enbe: CaseStudy = {
  id: "enbe",
  number: "02",
  client: "ENbe Education",
  trade: "English tutoring for girls",
  timing: ["Turnaround", "2 weeks"],
  title: "Trusted before the first lesson",
  lead: "A qualified English teacher was launching private tutoring. Parents needed to trust the teacher, see the prices and book a first chat, all from one link.",
  built: [
    {
      name: "Credentials first",
      text: "QTS, PGCE and an enhanced DBS check are the first thing a parent sees.",
    },
    {
      name: "The whole offer on one page",
      text: "Who it's for, how sessions work and answers to common questions, in the order parents ask.",
    },
    {
      name: "Clear prices",
      text: "Online, in-person and marking rates up front, plus a free 20-minute consultation.",
    },
    {
      name: "A spam-proof enquiry form",
      text: "Requests land straight in the inbox, with hCaptcha keeping the bots out.",
    },
  ],
  result: "Designed, built and live in two weeks, with every parent's question answered on one page.",
  facts: ["Next.js, TypeScript and Tailwind CSS", "1 page, 11 sections"],
  url: "https://www.enbe.org.uk/",
  urlLabel: "enbe.org.uk",
};
