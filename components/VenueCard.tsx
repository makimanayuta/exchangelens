"use client";
import { useState } from "react";
import Link from "next/link";
import { Ranked } from "@/lib/rank";
import { spotFeeFor } from "@/lib/calc";
import { availabilityOf } from "@/lib/jurisdictions";
import CostBar from "./CostBar";
import OutLink from "./OutLink";
import ReferralCard from "./ReferralCard";
import VenueLogo from "./VenueLogo";
import { hasBonus } from "@/lib/cta";

const AV = { yes: ["Available", "text-emerald-400"], limited: ["Check region", "text-amber-400"], no: ["Unavailable", "text-rose-400"] } as const;
const level = (n: number) => (n >= 90 ? "Very high" : n >= 80 ? "High" : n >= 65 ? "Medium" : "Lower");
const eur = (n: number) => `€${n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
type Tab = "cost" | "fees" | "bonus";

export default function VenueCard({ r, index, region, advanced, size, bonusFocus }: { r: Ranked; index: number; region: string; advanced: boolean; size: number; bonusFocus: boolean }) {
  const v = r.venue;
  const hasBonusProgram = hasBonus(v);
  const hasBonusTab = hasBonusProgram;
  const [open, setOpen] = useState(bonusFocus && hasBonusProgram);
  const [tab, setTab] = useState<Tab>(bonusFocus && hasBonusProgram ? "bonus" : "cost");
  const [avLabel, avColor] = AV[availabilityOf(v.access, region)];
  const show = open || advanced;
  const sf = spotFeeFor(v, region);
  const slipEur = r.cost.lines.find((l) => l.key === "slippage")?.eur ?? 0;
  const tabs: [Tab, string][] = [["cost", "Cost breakdown"], ["fees", "Fees & market"], ...(hasBonusTab ? [["bonus", "Referral bonus"] as [Tab, string]] : [])];

  return (
    <div className={`card p-4 transition sm:p-5 ${index === 0 ? "border-brand/40 shadow-glow" : ""}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3 md:w-80">
          <div className="relative">
            <VenueLogo slug={v.slug} name={v.name} domain={v.domain} />
            <span className={`absolute -left-2 -top-2 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${index === 0 ? "bg-brand text-ink-950" : "bg-ink-600 text-slate-300"}`}>{index + 1}</span>
          </div>
          <div className="min-w-0">
            <Link href={`/venues/${v.slug}`} className="block truncate text-lg font-semibold text-white hover:text-brand">{v.name}</Link>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="chip">{v.kind === "cex" ? "CEX" : "DEX"}</span>
              <span className="chip">{v.bestFor}</span>
              {hasBonusTab && <span className="chip border-brand/30 bg-brand/10 text-brand">🎁 Referral bonus</span>}
              {v.affiliateUrl && <span className="chip border-amber-400/30 text-amber-300">Referral link</span>}
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-3 text-sm">
          <div>
            <div className="label">Est. cost</div>
            <div className="mt-1 text-base font-semibold tabular-nums text-white sm:text-lg">{eur(r.cost.total)}</div>
            <div className="text-xs text-slate-500">{r.cost.pct.toFixed(2)}%</div>
          </div>
          <div><div className="label">Liquidity</div><div className="mt-1 font-medium text-white">{level(v.liquidityScore)}</div></div>
          <div><div className="label">Access</div><div className={`mt-1 font-medium ${avColor}`}>{avLabel}</div></div>
        </div>

        <div className="flex gap-2 md:w-56 md:justify-end">
          <button onClick={() => setOpen(!open)} className="btn-ghost flex-1 !px-4 !py-2.5 md:flex-none">{show ? "Hide" : "Details"}</button>
          <OutLink venue={v} className="btn-primary flex-1 !px-4 !py-2.5 md:flex-none">Visit</OutLink>
        </div>
      </div>

      <div className="mt-4"><CostBar cost={r.cost} /></div>

      {show && (
        <div className="mt-5 border-t border-white/5 pt-4">
          <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1">
            {tabs.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${tab === k ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "cost" && (
            <div className="space-y-3">
              <CostBar cost={r.cost} showLegend />
              {<p className="text-xs text-slate-500">Priced as the simple Buy-button route, not the order book.</p>}
            </div>
          )}

          {tab === "fees" && (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                {[
                  ["Spot maker/taker", sf ? `${sf.maker}/${sf.taker} bps` : "n/a"],
                  ["Perp maker/taker", v.perp ? `${v.perp.maker}/${v.perp.taker} bps` : "n/a"],
                  ["Funding / 8h", v.perp ? `${v.perp.funding8h} bps` : "n/a"],
                  ["Spread (BTC)", `${v.spreadBps} bps`],
                  ["Slippage at size", `${((slipEur / size) * 10000 / (r.cost.mode === "perp" ? 2 : 1)).toFixed(2)} bps`],
                  ["Assets listed", `~${v.assets.toLocaleString()}`],
                  ["Fiat", v.fiat.join(", ") || "Wallet only"],
                ].map(([k, val]) => (
                  <div key={k} className="rounded-xl bg-ink-900/70 p-3"><dt className="text-xs text-slate-500">{k}</dt><dd className="mt-0.5 font-medium capitalize text-slate-200">{val}</dd></div>
                ))}
              </dl>
              {v.regionNote && <p className="text-sm text-slate-400"><span className="text-slate-300">Region note:</span> {v.regionNote}</p>}
              <p className="text-sm text-slate-400"><span className="text-slate-300">Risks:</span> {v.risks}</p>
              <p className="text-xs text-slate-500">Verified {v.lastVerified} · <a href={v.feeUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Official fee schedule ↗</a></p>
            </div>
          )}

          {tab === "bonus" && <ReferralCard venue={v} />}
        </div>
      )}
    </div>
  );
}