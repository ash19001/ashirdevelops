import { Phone, Print } from "@/components/paper/Print";
import { Reel } from "@/components/paper/Reel";

/*
 * The exhibits for each case. All of it is the real thing: screenshots of the live sites, the
 * client's own photographs, and the launch reel.
 */

const heroSizes = "(min-width: 1240px) 560px, (min-width: 1024px) 45vw, 92vw";
const phoneSizes = "(min-width: 1024px) 140px, 30vw";

/** A laptop-width screenshot with a phone laid across its corner. */
function SiteAndPhone({
  site,
  phone,
  caption,
  tilt = -1.2,
}: {
  site: { src: string; alt: string };
  phone: { src: string; alt: string };
  caption: string;
  tilt?: number;
}) {
  return (
    <div className="relative pr-7 sm:pr-12 lg:pr-10">
      <Print
        src={site.src}
        alt={site.alt}
        ratio={2.2}
        sizes={heroSizes}
        tilt={tilt}
        clip
        caption={caption}
        className="max-w-[82%] sm:max-w-none"
        captionClassName="max-w-[70%] text-ink-soft"
      />
      <Phone
        src={phone.src}
        alt={phone.alt}
        sizes={phoneSizes}
        tilt={-tilt * 2.4}
        className="absolute -bottom-2 right-0 w-[30%] max-w-[150px] lg:w-[25%]"
      />
    </div>
  );
}

export function OpuluxeHero() {
  return (
    <SiteAndPhone
      site={{
        src: "/cases/opuluxe/home.webp",
        alt: "The Opuluxe Moments homepage: 'Luxury Event Styling & Bespoke Decor' over film of a styled event, with Build Your Event and View Our Setups buttons.",
      }}
      phone={{
        src: "/cases/opuluxe/phone-build.webp",
        alt: "Build Your Event on a phone, at step 1 of 13: choosing the event type, from wedding to graduation.",
      }}
      caption="The homepage, and step 1 of 13 on a phone"
    />
  );
}

export function OpuluxeProof() {
  return (
    <div className="grid grid-cols-2 items-start gap-x-4 gap-y-7 lg:grid-cols-[1fr_1fr_0.7fr] lg:gap-x-5">
      <Print
        src="/cases/opuluxe/designed.webp"
        alt="A backdrop designed in the browser: a teal arch cut with a floral pattern beside a painted Mughal-style arch panel, with plinths, candles, a vintage phone and a bowl of rose petals."
        ratio={4 / 5}
        sizes="(min-width: 1024px) 200px, 45vw"
        tilt={-2}
        caption="Designed on the site's backdrop designer"
      />
      <Print
        src="/cases/opuluxe/real.webp"
        alt="The same backdrop built at a real mehndi: the floral arch, the painted panel with the couple's names, plinths, candles and a bowl of rose petals on a marble floor."
        ratio={4 / 5}
        sizes="(min-width: 1024px) 200px, 45vw"
        tilt={1.6}
        caption="The same backdrop, set up on the day"
      />
      <Reel
        src="/cases/opuluxe/reel.mp4"
        poster="/cases/opuluxe/reel-poster.webp"
        label="Launch reel: a backdrop being designed step by step on a phone, with its estimate updating."
        tilt={2.2}
        caption={<span className="hidden lg:inline">The launch reel</span>}
      />
      <p className="t-small self-center text-ink-soft lg:hidden">
        Plus a launch reel for their Instagram and TikTok, recorded on the live designer.
      </p>
    </div>
  );
}

export function EnbeHero() {
  return (
    <SiteAndPhone
      tilt={1}
      site={{
        src: "/cases/enbe/home.webp",
        alt: "The ENbe Education homepage: 'Helping girls be confident in English' in white and gold on navy, with QTS, PGCE, Experienced and DBS listed beneath.",
      }}
      phone={{
        src: "/cases/enbe/phone-hero.webp",
        alt: "The same first screen on a phone, with the Book a free session button.",
      }}
      caption="The first screen, on a laptop and a phone"
    />
  );
}

export function EnbeProof() {
  return (
    <div className="grid grid-cols-2 items-end gap-x-5 gap-y-5 lg:grid-cols-[minmax(0,112px)_minmax(0,112px)_1fr] lg:gap-x-6">
      <figure>
        <Phone
          src="/cases/enbe/phone-rates.webp"
          alt="The pricing section on a phone: online sessions at £25 an hour and in-person sessions at £35."
          sizes={phoneSizes}
          tilt={-1.5}
          className="mx-auto max-w-[150px]"
        />
        <figcaption className="mt-3 text-center t-small text-ink-soft">Prices up front</figcaption>
      </figure>
      <figure>
        <Phone
          src="/cases/enbe/phone-contact.webp"
          alt="The enquiry form on a phone: parent's name, email, year group, service and a message, with a Send Enquiry button."
          sizes={phoneSizes}
          tilt={1.5}
          className="mx-auto max-w-[150px]"
        />
        <figcaption className="mt-3 text-center t-small text-ink-soft">The free-consultation form</figcaption>
      </figure>
      <p className="col-span-2 t-small text-ink-soft lg:col-span-1 lg:pb-8">
        Every section was laid out for a phone first, then opened up for a laptop.
      </p>
    </div>
  );
}
