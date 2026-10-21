import { notFound } from "next/navigation";
import Link from "next/link";
import { EXCHANGES, getExchange } from "@/lib/exchanges";
import { DATA_UPDATED, SHOW_DATA_BANNER } from "@/lib/site";
import { availabilityOf, GROUPS, JURISDICTIONS } from "@/lib/jurisdictions";
import OutLink from "@/components/OutLink";
import ReferralCard from "@/components/ReferralCard";
import ExchangeLogo from "@/components/ExchangeLogo";
import Flag from "@/components/Flag";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return EXCHANGES.map((e) => ({ slug: e.slug })); }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = getExchange(slug);
  return { title: e ? `${e.name} fees, availability & referral bonus` : "Exchange" };
}

const AV = { yes: ["Available", "text-emerald-400"], limited: ["Check", "text-amber-400"], no: ["No", "text-rose-400"] } as const;

export default async function ExchangePage({ params }: Props) {
  const { slug } = await params;
  const e = getExchange(slug);
  if (!e) notFound();
  const rows: [string, string][] = [
  ["Spot maker / taker", e.spot ? `${e.spot.maker}% / ${e.spot.taker}%` : "n/a"],
  ["Regional spot overrides", e.spotByRegion ? Object.entries(e.spotByRegion).map(([k, f]) => `${k}: ${f.maker}% / ${f.taker}%`).join(" · ") : "None"],
  ["Perp maker / taker", e.perp ? `${e.perp.maker}% / ${e.perp.taker}%` : "n/a"],
  ["Typical funding", e.perp ? `${e.perp.funding8h}% per 8h` : "n/a"],
  ["BTC bid-ask spread (est.)", `${e.spread}%`],
  ["Slippage @ $100 / 500 / 5k / 25k (est.)", e.slip.map((s) => `${s}%`).join(" / ")],
  ["Deposit", e.deposit.note],
  ["Withdrawal fee (% of amount)", e.withdraw ? `${e.withdraw}% (may be subject to a cap)` : "None (network fee only)"],
  ["Listed assets (approx.)", e.assets.toLocaleString()],
  ["Fiat currencies", e.fiat.join(", ") || "None (wallet-based)"],
];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-12">
      <Link href="/compare" className="text-sm text-slate-400 hover:text-white">← Back to comparison</Link>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <ExchangeLogo slug={e.slug} name={e.name} domain={e.domain} size={56} />
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{e.name}</h1>
        <span className="chip">{e.kind === "cex" ? "Centralized" : "Decentralized"}</span>
        {e.affiliateUrl && <span className="chip border-amber-400/30 text-amber-300">Referral link available</span>}
      </div>
      <p className="mt-3 text-lg text-slate-400">{e.tagline}</p>
      {SHOW_DATA_BANNER && (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200">
          Static data compiled {DATA_UPDATED}; last checked {e.lastVerified}. Confirm on the official fee page.
        </p>
      )}

      <div className="card mt-8 divide-y divide-white/5">
        {rows.map(([k, val]) => (
          <div key={k} className="flex flex-col justify-between gap-1 px-5 py-3 text-sm sm:flex-row sm:gap-6">
            <span className="text-slate-400">{k}</span><span className="font-medium text-white sm:text-right">{val}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-white">Availability by jurisdiction</h2>
      {e.regionNote && <p className="mt-2 text-sm text-slate-400">{e.regionNote}</p>}
      <div className="mt-4 space-y-4">
        {GROUPS.map((g) => {
          const items = JURISDICTIONS.filter((j) => j.group === g);
          return (
            <div key={g}>
              <div className="label mb-2">{g}</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((j) => {
                  const [label, color] = AV[availabilityOf(e.access, j.code)];
                  return (
                    <div key={j.code} className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-800/70 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><Flag code={j.flag} /> {j.name}</span>
                      <span className={color}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-8 p-5">
        <div className="label">Risks</div>
        <p className="mt-3 text-sm text-slate-300">{e.risks}</p>
      </div>

      {e.referral && <div className="mt-8"><ReferralCard exchange={e} /></div>}

      <div className="mt-8 flex flex-wrap gap-3">
        <OutLink exchange={e} className="btn-primary">Visit {e.name}</OutLink>
        <a href={e.feeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Official fee schedule ↗</a>
      </div>
    </div>
  );
}