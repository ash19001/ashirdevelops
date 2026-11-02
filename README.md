# ashirdevelops

The freelance site: a one-page case file you flip through. Each page is a client case; the
last one is the visitor's own ("Your business is case 03"), which writes them a ready-made
message to send by email or Instagram DM.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Phosphor icons.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before launch

- **`lib/site.ts`**: confirm the Instagram and TikTok handles (guessed as `ashirdevelops`).
- **The domain**: on Vercel there is nothing to do; the production domain is used for the
  canonical link, the sitemap, robots.txt and the share card. On any other host, set
  `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.co.uk`, no trailing slash), or they point at
  localhost.
- **Google Search Console**: once live, verify the domain there and submit `/sitemap.xml`.
  Instagram and TikTok bio links are nofollow, so search engines won't find the site through them.
- The Opuluxe photo pair (`public/cases/opuluxe/designed.webp` and `real.webp`) comes from the
  client's own site and shows a couple's names on a sign. Check the client is happy for it to
  appear here.

## Where things live

```
app/
  page.tsx              the list of pages, in the order they turn; the canonical link and
                        structured data (who you are, your profiles) for search engines
  layout.tsx            fonts, metadata, viewport
  not-found.tsx         the 404 page: a "Not on file" sheet in the same folder
  robots.ts, sitemap.ts robots.txt and sitemap.xml
  globals.css           colour and type tokens, paper grain, stamp ink, the case grids
  opengraph-image.png   the share card (regenerate if the cover changes)
components/
  case-file/
    CaseFile.tsx        the engine: page state, turning, dragging, keys, tabs, controls
    Sheet.tsx           one sheet: the 3D turn, its shading, the turned-down corner
  sheets/               the page layouts: Cover, CaseSheet, Process, YourCase, evidence
  paper/                the objects on the paper: Stamp, Print, Phone, Strip, Reel, PageLink
lib/
  site.ts               your name, contact details and handles
  origin.ts             the site's full address, for links that must be absolute
  cases.ts              the words of each case study
public/cases/           screenshots, photos and the reel, per client
```

## Adding a case

1. Put its pictures in `public/cases/<client>/` (WebP, about 1600–1900px wide for laptop
   screenshots; phone screenshots at 390px wide and 2x).
2. Add a `CaseStudy` to `lib/cases.ts`. Every claim should be checkable in the project itself.
3. Add its exhibits to `components/sheets/evidence.tsx` (a `…Hero` and a `…Proof`).
4. Add a page to the list in `app/page.tsx`, before Process. Its `id` becomes its link
   (`/#client`), so keep it short and stable.
5. Bump "case 03" in `YourCase.tsx` and the Process table's case references.

## How the turning works

Each sheet has three motion values: its rotation (`rotateY`, 0 at rest, -100° once turned),
a fade used instead of rotation for visitors who prefer reduced motion, and its offset in the
stack. Turning animates the rotation on a critically damped spring; past -90° the sheet is
edge-on and hidden. Jumping several pages turns them one after another, 65ms apart.

On touch, a horizontal drag anywhere on the sheet turns it with the finger and hands the
release speed to the spring; a vertical drag scrolls the sheet instead. With a mouse, drag
or click the turned-down corner. Arrow keys, the tabs and the Next/Back buttons all go
through the same `goTo`.

No sheet scrolls sideways. The cover is marked `fit` in `app/page.tsx` and never scrolls at
all: its gaps and headline scale with the screen's height, and it drops extras as the height
runs out (see the notes in `Cover.tsx`). If you add to the cover, check it still fits on a
short phone (375×560) and a short laptop (1280×720).

Only the top sheet is interactive (`inert` on the rest), and the page's URL hash follows the
open page, so `/#enbe` opens straight on that case. Without script the tabs are plain hash
links and CSS brings the linked sheet to the top.
