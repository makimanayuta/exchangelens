import { REFERRAL_PREVIEW } from "./site";
import { Venue } from "./types";

/** A welcome bonus exists, and (in production) you have a link that can claim it. */
export const hasBonus = (v: Venue) => !!v.referral && (!!v.affiliateUrl || REFERRAL_PREVIEW);

export function ctaFor(v: Venue): { href: string; label: string; referral: boolean } {
  if (v.affiliateUrl && v.referral) {
    const amount = v.referral.headline.replace(/\s*\(.*?\)/g, "").replace(/^Up to/, "up to");
    return { href: v.affiliateUrl, label: `Claim ${amount} bonus`, referral: true };
  }
  if (v.affiliateUrl) return { href: v.affiliateUrl, label: "Sign up with our link", referral: true };
  return { href: v.officialUrl, label: "Visit", referral: false };
}