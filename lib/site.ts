/**
 * Everything about you that appears on the site. Change it here, not in the components.
 *
 * TODO before launch: confirm the email and the two handles. The handles were guessed from the
 * project name, and the email is a placeholder.
 */
export const site = {
  name: "Ashir Khan",
  brand: "ashir develops",
  role: "Freelance developer",
  /** Where the "Email my case" button sends the brief. */
  email: "ashirdevelops02@gmail.com",
  instagram: "ashirdevelops",
  tiktok: "ashirdevelops",
  portfolio: "https://ashirkhan.com",
  /** Production origin, no trailing slash. Used for share links; leave empty to let the host decide. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  title: "ashir develops · Websites & custom software",
  description:
    "Ashir Khan builds software for small businesses: enquiry forms, online payments, and sites you can edit yourself. Flip through the case files.",
};

export const instagramUrl = `https://instagram.com/${site.instagram}`;
export const instagramDmUrl = `https://ig.me/m/${site.instagram}`;
export const tiktokUrl = `https://www.tiktok.com/@${site.tiktok}`;
