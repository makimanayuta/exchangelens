"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { VENUES } from "@/lib/venues";
import { rank, Query } from "@/lib/rank";
import { FREQS, GOALS, PRIORITIES } from "@/lib/options";
import { DATA_UPDATED, SHOW_DATA_BANNER } from "@/lib/site";
import { jurisdiction } from "@/lib/jurisdictions";
import { Frequency, Goal, Priority } from "@/lib/types";
import VenueCard from "./VenueCard";
import RegionPicker from "./RegionPicker";

const sel = "w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-brand/60";

export default function ResultsView() {
  const sp = useSearchParams();
  const router = useRouter();
  const get = (k: string, d: string) => sp.get(k) ?? d;

  const rawRegion = get("region", "EU");
  const q: Query = {
    goal: get("goal", "spot") as Goal,
    size: Math.max(10, Number(get("size", "500")) || 500),
    freq: get("freq", "occasional") as Frequency,
    priority: get("priority", "balanced") as Priority,
    region: jurisdiction(rawRegion) ? rawRegion : "EU",
    withdraw: get("withdraw", "0") === "1",
    holdDays: Math.max(0, Number(get("hold", "7")) || 0),
    useMaker: get("maker", "0") === "1",
    bonusOnly: get("bonus", "0") === "1",
  };
  const advanced = get("adv", "0") === "1";

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    p.set(k, v);
    router.replace(`/compare?${p.toString()}`, { scroll: false });
  };

  const { ranked, excluded } = useMemo(() => rank(VENUES, q), [sp]); // eslint-disable-line
  const best = ranked[0];
  const cheapest = [...ranked].sort((a, b) => a.cost.pct - b.cost.pct)[0];
  const trades = FREQS.find((f) => f.value === q.freq)!.trades;
  const showPerp = q.goal !== "spot";

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">Your comparison</h1>
        <p className="mt-2 text-slate-400">
          Ranked by <b className="text-slate-200">{PRIORITIES.find((p) => p.value === q.priority)!.label.toLowerCase()}</b> for a €{q.size.toLocaleString()} trade.{" "}
          <Link href="/methodology" className="text-brand hover:underline">How this works</Link>
        </p>
        {SHOW_DATA_BANNER && (
          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200">
            Static data compiled {DATA_UPDATED} from public sources. Spreads and slippage are our estimates. Always confirm on the official fee page.
          </p>
        )}
      </div>

      <div className="relative z-50 card mb-6 grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4" id="controls">
        <label className="text-sm"><span className="label mb-1.5 block">Goal</span>
          <select className={sel} value={q.goal} onChange={(e) => set("goal", e.target.value)}>{GOALS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
        <label className="text-sm"><span className="label mb-1.5 block">Amount (€)</span>
          <input type="number" inputMode="decimal" min={10} step={50} className={sel} value={q.size} onChange={(e) => set("size", e.target.value || "500")} /></label>
        <label className="text-sm"><span className="label mb-1.5 block">Frequency</span>
          <select className={sel} value={q.freq} onChange={(e) => set("freq", e.target.value)}>{FREQS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
        <div className="text-sm"><span className="label mb-1.5 block">Region</span>
          <RegionPicker value={q.region} onChange={(c) => set("region", c)} /></div>
        <label className="text-sm"><span className="label mb-1.5 block">Rank by</span>
          <select className={sel} value={q.priority} onChange={(e) => set("priority", e.target.value)}>{PRIORITIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
        <label className="text-sm"><span className="label mb-1.5 block">After buying</span>
          <select className={sel} value={q.withdraw ? "1" : "0"} onChange={(e) => set("withdraw", e.target.value)}>
            <option value="0">Keep on the platform</option><option value="1">Withdraw to my wallet</option></select></label>
        {showPerp ? (
          <label className="text-sm"><span className="label mb-1.5 block">Perp holding (days)</span>
            <input type="number" inputMode="numeric" min={0} className={sel} value={q.holdDays} onChange={(e) => set("hold", e.target.value || "0")} /></label>
        ) : <div className="hidden lg:block" />}
        <div className="flex flex-col justify-end gap-2 text-sm">
          <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="accent-emerald-400" checked={advanced} onChange={(e) => set("adv", e.target.checked ? "1" : "0")} /> Advanced mode</label>
          <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="accent-emerald-400" checked={q.useMaker} onChange={(e) => set("maker", e.target.checked ? "1" : "0")} /> Assume maker (limit) orders</label>        
          <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="accent-emerald-400" checked={q.bonusOnly}onChange={(e) => set("bonus", e.target.checked ? "1" : "0")} />Only platforms with a welcome bonus</label> </div>
      </div>

      {best && (
        <div className="mb-6 grid gap-3 sm:gap-4 md:grid-cols-3">
          <div className="card p-4 sm:p-5"><div className="label">Top pick</div><div className="mt-1 text-xl font-bold text-white">{best.venue.name}</div></div>
          <div className="card p-4 sm:p-5"><div className="label">Lowest cost</div><div className="mt-1 text-xl font-bold text-white">{cheapest.venue.name} <span className="text-sm font-normal text-slate-400">{cheapest.cost.pct.toFixed(2)}%</span></div></div>
          <div className="card p-4 sm:p-5"><div className="label">Top pick monthly cost</div><div className="mt-1 text-xl font-bold text-white">≈ €{best.monthly.toFixed(2)} <span className="text-sm font-normal text-slate-400">at ~{trades} trades/mo</span></div></div>
        </div>
      )}

      <div className="space-y-4">
        {ranked.map((r, i) => <VenueCard key={`${r.venue.slug}-${q.bonusOnly}`} r={r} index={i} region={q.region}advanced={advanced} size={q.size} bonusFocus={q.bonusOnly} />)}
        {ranked.length === 0 && (<div className="card p-10 text-center text-slate-400">No platform matches these filters{q.bonusOnly ? " (try unticking the welcome-bonus filter)" : ""}.</div>
)}
      </div>

      {excluded.length > 0 && (
        <p className="mt-6 text-sm text-slate-500">Not shown (unavailable in {jurisdiction(q.region)?.name} or doesn't match the current filters): {excluded.map((v) => v.name).join(", ")}.</p>
      )}
      <p className="mt-8 text-xs leading-relaxed text-slate-500">
        Estimates use standard-tier fees without discounts. Venues labelled “Referral link” earn us a commission; this never changes ranking.{" "}
        <Link href="/disclosure" className="underline">Read the disclosure</Link>.
      </p>
    </div>
  );
}