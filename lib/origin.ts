import { site } from "./site";

/**
 * The site's full address, for the links that must be absolute: the canonical link, the sitemap,
 * robots.txt and the structured data. NEXT_PUBLIC_SITE_URL wins; on Vercel, the production domain
 * is used when it isn't set. Server only: the Vercel variable never reaches the browser.
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const origin = site.url || (vercel ? `https://${vercel}` : "http://localhost:3000");
