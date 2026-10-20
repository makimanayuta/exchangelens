import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { VENUES } from "@/lib/venues";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/compare", "/methodology", "/disclosure"].map((p) => ({ url: SITE.url + p, lastModified: new Date() }));
  const venues = VENUES.map((v) => ({ url: `${SITE.url}/venues/${v.slug}`, lastModified: new Date() }));
  return [...pages, ...venues];
}