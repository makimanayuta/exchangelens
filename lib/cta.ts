import { REFERRAL_PREVIEW } from "./site";
import { Exchange } from "./types";

/** A welcome bonus exists, and (in production) you have a link that can claim it. */
export const hasBonus = (v: Exchange) => !!v.referral && (!!v.affiliateUrl || REFERRAL_PREVIEW);

export function ctaFor(v: Exchange): { href: string; label: string; referral: boolean; bonus: boolean } {
  if (v.affiliateUrl && v.referral) {
    return { href: v.affiliateUrl, label: v.referral.headline, referral: true, bonus: true };
  }
  if (v.affiliateUrl) return { href: v.affiliateUrl, label: "Sign up with our link", referral: true, bonus: false };
  return { href: v.officialUrl, label: "Visit", referral: false, bonus: false };
}