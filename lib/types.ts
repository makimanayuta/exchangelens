export type Goal = "spot" | "perp" | "dex" | "all";
export type Priority = "balanced" | "cost" | "liquidity" | "simple" | "assets";
export type Frequency = "occasional" | "regular" | "active";
export type Availability = "yes" | "limited" | "no";

export interface Access { base: Availability; set?: Record<string, Availability> }
export interface FeePair { maker: number; taker: number }

export interface Referral {
  headline: string;
  rewardType: "fee-voucher" | "bonus-credit" | "withdrawable" | "mixed";
  availability: string;
  requirements: { kyc: boolean; deposit?: string; volume?: string; holding?: string };
  deadline?: string;
  modes?: string[];
  countries: string;
  caveat: string;
  verified: string;
}

export interface Venue {
  slug: string;
  name: string;
  domain: string;
  kind: "cex" | "dex";
  tagline: string;
  bestFor: string;
  products: { spot: boolean; perp: boolean };
  access: Access;
  regionNote?: string;
  /** all fees in basis points (1 bp = 0.01%) */
  spot: FeePair | null;
  /** region/parent overrides, e.g. { EU: {...} } */
  spotByRegion?: Record<string, FeePair>;
  perp: (FeePair & { funding8h: number }) | null;
 /** full bid-ask spread on BTC, bps */
  spreadBps: number;
  /** extra impact beyond top of book for [100, 500, 5000, 25000] EUR, bps (our estimates) */
  slipBps: [number, number, number, number];
  deposit: { bps: number; fixedEur: number; note: string };
  withdrawBtcEur: number;
  conversionBps: number;
  assets: number;
  liquidityScore: number;
  easeScore: number;
  fiat: string[];
  risks: string;
  referral: Referral | null;
  officialUrl: string;
  feeUrl: string;
  /** PUT YOUR AFFILIATE LINK HERE */
  affiliateUrl: string;
  lastVerified: string;
}