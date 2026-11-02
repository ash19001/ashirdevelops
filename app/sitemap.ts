import type { MetadataRoute } from "next";
import { origin } from "@/lib/origin";

/**
 * The whole site is one page. The cases are parts of it (#opuluxe, #enbe), and search engines
 * ignore the part after #, so they don't get entries of their own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: origin }];
}
