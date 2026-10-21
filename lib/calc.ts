import { jurisdiction } from "./jurisdictions";
import { FeePair, Exchange } from "./types";

export type Mode = "spot" | "perp";
export interface CostLine { key: string; label: string; usd: number; hint: string }
export interface CostResult { mode: Mode; lines: CostLine[]; total: number; pct: number }
export interface CalcOpts { withdraw: boolean; holdDays: number; useMaker: boolean; region: string }

const SIZES = [100, 500, 5000, 25000];

export function slippagePct(e: Exchange, size: number): number {
  const s = e.slip;
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

export function spotFeeFor(e: Exchange, region: string): FeePair | null {
  let c: string | undefined = region;
  while (c) {
    const o = e.spotByRegion?.[c];
    if (o) return o;
    c = jurisdiction(c)?.parent;
  }
  return e.spot;
}

export function modeFor(e: Exchange, goal: string): Mode | null {
  if (goal === "perp") return e.perp ? "perp" : null;
  if (goal === "spot") return e.spot ? "spot" : null;
  if (e.spot) return "spot";
  return e.perp ? "perp" : null;
}

const pct = (size: number, p: number) => (size * p) / 100;

export function computeCost(e: Exchange, mode: Mode, size: number, o: CalcOpts): CostResult {
  const lines: CostLine[] = [];

  const sides = mode === "perp" ? 2 : 1;
  const fee = mode === "perp" ? e.perp! : spotFeeFor(e, o.region)!;
  const feePct = o.useMaker ? fee.maker : fee.taker;
  lines.push(
    {
      key: "fee", label: "Trading fee", usd: pct(size, feePct) * sides,
      hint: `${feePct}% × ${sides} side${sides > 1 ? "s" : ""} (${o.useMaker ? "maker" : "taker"})`
    },
    { key: "spread", label: "Spread", usd: pct(size, e.spread / 2) * sides, hint: "Half the bid-ask gap per market order" },
    { key: "slippage", label: "Slippage", usd: pct(size, slippagePct(e, size)) * sides, hint: "Estimated impact beyond top of book" },
  );

  lines.push(
    { key: "deposit", label: "Deposit", usd: pct(size, e.deposit.nominal), hint: e.deposit.note },
    { key: "conversion", label: "Conversion", usd: pct(size, e.conversion), hint: "Currency conversion margin" },
  );

  if (mode === "perp") {
    const f = e.perp!.funding8h;
    lines.push({
      key: "funding", label: "Funding", usd: (size * f * o.holdDays * 3) / 100,
      hint: `${o.holdDays}d hold at ${f}% per 8h (long pays; can be negative)`
    });
  }
  lines.push({
    key: "withdrawal", label: "Withdrawal",
    usd: o.withdraw ? pct(size, e.withdraw) : 0,
    hint: e.withdraw ? `${e.withdraw}% fee on the withdrawn amount (may be subject to a cap)` : "Free (network fees not counted)",
  });

  const total = lines.reduce((a, l) => a + l.usd, 0);
  return { mode, lines, total, pct: (total / size) * 100 };
}