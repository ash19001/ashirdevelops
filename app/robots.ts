import type { MetadataRoute } from "next";
import { origin } from "@/lib/origin";

/** Everything may be crawled; the sitemap says where the one page is. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  };
}
