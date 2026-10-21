import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { EXCHANGES } from "@/lib/exchanges";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/compare", "/methodology", "/disclosure"].map((p) => ({ url: SITE.url + p, lastModified: new Date() }));
  const exchanges = EXCHANGES.map((v) => ({ url: `${SITE.url}/exchange/${v.slug}`, lastModified: new Date() }));
  return [...pages, ...exchanges];
}