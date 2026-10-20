import { Access, Availability } from "./types";

export interface Jurisdiction {
  code: string; name: string; flag: string | null; group: string; parent?: string;
}

export const GROUPS = ["Europe", "North America", "Asia-Pacific", "Middle East", "Latin America", "Other"];

export const JURISDICTIONS: Jurisdiction[] = [
  { code: "EU", name: "European Union", flag: "eu", group: "Europe" },
  { code: "FR", name: "France", flag: "fr", group: "Europe", parent: "EU" },
  { code: "DE", name: "Germany", flag: "de", group: "Europe", parent: "EU" },
  { code: "UK", name: "United Kingdom", flag: "gb", group: "Europe" },
  { code: "CH", name: "Switzerland", flag: "ch", group: "Europe" },
  { code: "RU", name: "Russia", flag: "ru", group: "Europe" },
  { code: "TR", name: "Türkiye", flag: "tr", group: "Europe" },
  { code: "US", name: "United States", flag: "us", group: "North America" },
  { code: "CA", name: "Canada", flag: "ca", group: "North America" },
  { code: "KR", name: "South Korea", flag: "kr", group: "Asia-Pacific" },
  { code: "JP", name: "Japan", flag: "jp", group: "Asia-Pacific" },
  { code: "AU", name: "Australia", flag: "au", group: "Asia-Pacific" },
  { code: "NZ", name: "New Zealand", flag: "nz", group: "Asia-Pacific" },
  { code: "SG", name: "Singapore", flag: "sg", group: "Asia-Pacific" },
  { code: "IN", name: "India", flag: "in", group: "Asia-Pacific" },
  { code: "ID", name: "Indonesia", flag: "id", group: "Asia-Pacific" },
  { code: "VN", name: "Vietnam", flag: "vn", group: "Asia-Pacific" },
  { code: "PH", name: "Philippines", flag: "ph", group: "Asia-Pacific" },
  { code: "MY", name: "Malaysia", flag: "my", group: "Asia-Pacific" },
  { code: "TH", name: "Thailand", flag: "th", group: "Asia-Pacific" },
  { code: "AE", name: "UAE & GCC", flag: "ae", group: "Middle East" },
  { code: "MX", name: "Mexico", flag: "mx", group: "Latin America" },
  { code: "AR", name: "Argentina", flag: "ar", group: "Latin America" },
  { code: "BR", name: "Brazil", flag: "br", group: "Latin America" },
  { code: "CO", name: "Colombia", flag: "co", group: "Latin America" },
  { code: "CL", name: "Chile", flag: "cl", group: "Latin America" },
  { code: "VE", name: "Venezuela", flag: "ve", group: "Latin America" },
  { code: "PE", name: "Peru", flag: "pe", group: "Latin America" },
  { code: "OTHER", name: "Other / international", flag: null, group: "Other" },
];

const BY_CODE = Object.fromEntries(JURISDICTIONS.map((j) => [j.code, j]));
export const jurisdiction = (code: string) => BY_CODE[code] as Jurisdiction | undefined;

/** Walks code -> parent -> base. */
export function availabilityOf(access: Access, code: string): Availability {
  let c: string | undefined = code;
  while (c) {
    const hit = access.set?.[c];
    if (hit) return hit;
    c = BY_CODE[c]?.parent;
  }
  return access.base;
}