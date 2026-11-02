import type { Metadata } from "next";
import { CaseFile } from "@/components/case-file/CaseFile";
import type { Page } from "@/components/case-file/shared";
import { CaseSheet } from "@/components/sheets/CaseSheet";
import { Cover } from "@/components/sheets/Cover";
import { EnbeHero, EnbeProof, OpuluxeHero, OpuluxeProof } from "@/components/sheets/evidence";
import { Process } from "@/components/sheets/Process";
import { YourCase } from "@/components/sheets/YourCase";
import { enbe, opuluxe } from "@/lib/cases";
import { origin } from "@/lib/origin";
import { instagramUrl, site, tiktokUrl } from "@/lib/site";

export const metadata: Metadata = {
  // One address for the page, whatever tracking Instagram or TikTok add to the link.
  alternates: { canonical: "/" },
};

/**
 * For search engines: the site's name (shown above it in results), and the person behind it with
 * their profiles, so a search for the name finds this site and the accounts together.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: site.brand,
      // The handles' spelling, as one word.
      alternateName: site.brand.replaceAll(" ", ""),
      publisher: { "@id": `${origin}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${origin}/#person`,
      name: site.name,
      jobTitle: site.role,
      url: origin,
      sameAs: [instagramUrl, tiktokUrl, site.portfolio],
    },
  ],
};

/**
 * The whole site: one case file. Each entry is a page in it, in the order they turn. The id is
 * also its link (ashirdevelops.com/#enbe opens straight on that case), so keep ids stable once
 * they're shared.
 */
const pages: Page[] = [
  { id: "cover", tab: "Cover", title: "Cover", tone: "manila", fit: true, content: <Cover /> },
  {
    id: "opuluxe",
    tab: "Opuluxe",
    title: "Case 01: Opuluxe Moments",
    tone: "paper",
    content: <CaseSheet study={opuluxe} hero={<OpuluxeHero />} proof={<OpuluxeProof />} />,
  },
  {
    id: "enbe",
    tab: "ENbe",
    title: "Case 02: ENbe Education",
    tone: "paper",
    content: <CaseSheet study={enbe} hero={<EnbeHero />} proof={<EnbeProof />} />,
  },
  { id: "process", tab: "Process", title: "How I work", tone: "paper", content: <Process /> },
  { id: "your-case", tab: "Your case", title: "Your case", tone: "paper", content: <YourCase /> },
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <CaseFile pages={pages} />
    </main>
  );
}
