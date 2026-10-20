import { CalcOpts, computeCost, CostResult, modeFor } from "./calc";
import { availabilityOf } from "./jurisdictions";
import { FREQS } from "./options";
import { Frequency, Goal, Priority, Venue } from "./types";
import { hasBonus } from "./cta";

export interface Ranked { venue: Venue; cost: CostResult; score: number; monthly: number }

export interface Query {
  goal: Goal; size: number; freq: Frequency; priority: Priority; region: string;
  withdraw: boolean; holdDays: number; useMaker: boolean; bonusOnly: boolean;
}

// NOTE: affiliateUrl and referral are intentionally never read here.
export function rank(venues: Venue[], q: Query): { ranked: Ranked[]; excluded: Venue[] } {
  const opts: CalcOpts = { withdraw: q.withdraw, holdDays: q.holdDays, useMaker: q.useMaker, region: q.region };
  const trades = FREQS.find((f) => f.value === q.freq)?.trades ?? 2;
  const excluded: Venue[] = [];
  const rows: Omit<Ranked, "score">[] = [];

  for (const v of venues) {
    if (q.bonusOnly && !hasBonus(v)) continue;
    if (q.goal === "dex" && v.kind !== "dex") continue;
    const mode = modeFor(v, q.goal);
    if (!mode || availabilityOf(v.access, q.region) === "no") { excluded.push(v); continue; }
    const cost = computeCost(v, mode, q.size, opts);
    rows.push({ venue: v, cost, monthly: cost.total * trades });
  }

  const pcts = rows.map((r) => r.cost.pct);
  const min = Math.min(...pcts), max = Math.max(...pcts);
  const costScore = (p: number) => (max === min ? 100 : 100 * (1 - (p - min) / (max - min)));
  const assetScore = (n: number) => Math.min(100, (Math.log(n) / Math.log(3000)) * 100);

  const scored: Ranked[] = rows.map((r) => {
    const c = costScore(r.cost.pct), l = r.venue.liquidityScore, e = r.venue.easeScore, a = assetScore(r.venue.assets);
    const score =
      q.priority === "cost" ? c : q.priority === "liquidity" ? l : q.priority === "simple" ? e :
      q.priority === "assets" ? a : 0.5 * c + 0.2 * l + 0.15 * e + 0.15 * a;
    return { ...r, score };
  });

  scored.sort((x, y) => y.score - x.score || x.cost.pct - y.cost.pct);
  return { ranked: scored, excluded };
}