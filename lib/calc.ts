import { jurisdiction } from "./jurisdictions";
import { FeePair, Venue } from "./types";

export type Mode = "spot" | "perp";
export interface CostLine { key: string; label: string; eur: number; hint: string }
export interface CostResult { mode: Mode; lines: CostLine[]; total: number; pct: number }
export interface CalcOpts { withdraw: boolean; holdDays: number; useMaker: boolean; region: string }

const SIZES = [100, 500, 5000, 25000];

export function slippageBps(v: Venue, size: number): number {
  const s = v.slipBps;
  if (size <= SIZES[0]) return s[0] * (size / SIZES[0]);
  if (size >= SIZES[3]) return s[3] * (size / SIZES[3]);
  for (let i = 0; i < 3; i++) {
    if (size <= SIZES[i + 1]) {
      const t = (Math.log(size) - Math.log(SIZES[i])) / (Math.log(SIZES[i + 1]) - Math.log(SIZES[i]));
      return s[i] + t * (s[i + 1] - s[i]);
    }
  }
  return s[3];
}

export function spotFeeFor(v: Venue, region: string): FeePair | null {
  let c: string | undefined = region;
  while (c) {
    const o = v.spotByRegion?.[c];
    if (o) return o;
    c = jurisdiction(c)?.parent;
  }
  return v.spot;
}

export function modeFor(v: Venue, goal: string): Mode | null {
  if (goal === "perp") return v.perp ? "perp" : null;
  if (goal === "spot") return v.spot ? "spot" : null;
  if (v.spot) return "spot";
  return v.perp ? "perp" : null;
}

const bps = (size: number, b: number) => (size * b) / 10000;

export function computeCost(v: Venue, mode: Mode, size: number, o: CalcOpts): CostResult {
  const lines: CostLine[] = [];

  const sides = mode === "perp" ? 2 : 1;
  const fee = mode === "perp" ? v.perp! : spotFeeFor(v, o.region)!;
  const feeBps = o.useMaker ? fee.maker : fee.taker;
  lines.push(
    { key: "fee", label: "Trading fee", eur: bps(size, feeBps) * sides,
      hint: `${feeBps} bps × ${sides} side${sides > 1 ? "s" : ""} (${o.useMaker ? "maker" : "taker"})` },
    { key: "spread", label: "Spread", eur: bps(size, v.spreadBps / 2) * sides, hint: "Half the bid-ask gap per market order" },
    { key: "slippage", label: "Slippage", eur: bps(size, slippageBps(v, size)) * sides, hint: "Estimated impact beyond top of book" },
  );

  lines.push(
    { key: "deposit", label: "Deposit", eur: bps(size, v.deposit.bps) + v.deposit.fixedEur, hint: v.deposit.note },
    { key: "conversion", label: "Conversion", eur: bps(size, v.conversionBps), hint: "Currency conversion margin" },
  );

  if (mode === "perp") {
    const f = v.perp!.funding8h;
    lines.push({ key: "funding", label: "Funding", eur: (size * f * o.holdDays * 3) / 10000,
      hint: `${o.holdDays}d hold at ${f} bps/8h (long pays; can be negative)` });
  }
  lines.push({ key: "withdrawal", label: "Withdrawal", eur: o.withdraw ? v.withdrawBtcEur : 0,
    hint: o.withdraw ? "BTC network withdrawal (estimate)" : "Kept on platform" });

  const total = lines.reduce((a, l) => a + l.eur, 0);
  return { mode, lines, total, pct: (total / size) * 100 };
}