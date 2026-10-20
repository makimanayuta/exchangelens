import { notFound } from "next/navigation";
import Link from "next/link";
import { VENUES, getVenue } from "@/lib/venues";
import { DATA_UPDATED, SHOW_DATA_BANNER } from "@/lib/site";
import { availabilityOf, GROUPS, JURISDICTIONS } from "@/lib/jurisdictions";
import OutLink from "@/components/OutLink";
import ReferralCard from "@/components/ReferralCard";
import VenueLogo from "@/components/VenueLogo";
import Flag from "@/components/Flag";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return VENUES.map((v) => ({ slug: v.slug })); }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const v = getVenue(slug);
  return { title: v ? `${v.name} fees, availability & referral bonus` : "Exchange" };
}

const AV = { yes: ["Available", "text-emerald-400"], limited: ["Check", "text-amber-400"], no: ["No", "text-rose-400"] } as const;

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) notFound();
  const rows: [string, string][] = [
    ["Spot maker / taker", v.spot ? `${v.spot.maker} / ${v.spot.taker} bps` : "n/a"],
    ["Regional spot overrides", v.spotByRegion ? Object.entries(v.spotByRegion).map(([k, f]) => `${k}: ${f.maker}/${f.taker}`).join(" · ") : "None"],
    ["Perp maker / taker", v.perp ? `${v.perp.maker} / ${v.perp.taker} bps` : "n/a"],
    ["Typical funding", v.perp ? `${v.perp.funding8h} bps / 8h` : "n/a"],
    ["BTC bid-ask spread (est.)", `${v.spreadBps} bps`],
    ["Slippage @ €100 / 500 / 5k / 25k (est.)", v.slipBps.join(" / ") + " bps"],
    ["Deposit", v.deposit.note],
    ["BTC withdrawal (est.)", `€${v.withdrawBtcEur}`],
    ["Listed assets (approx.)", v.assets.toLocaleString()],
    ["Fiat currencies", v.fiat.join(", ") || "None (wallet-based)"],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-12">
      <Link href="/compare" className="text-sm text-slate-400 hover:text-white">← Back to comparison</Link>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <VenueLogo slug={v.slug} name={v.name} domain={v.domain} size={56} />
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{v.name}</h1>
        <span className="chip">{v.kind === "cex" ? "Centralized" : "Decentralized"}</span>
        {v.affiliateUrl && <span className="chip border-amber-400/30 text-amber-300">Referral link available</span>}
      </div>
      <p className="mt-3 text-lg text-slate-400">{v.tagline}</p>
      {SHOW_DATA_BANNER && (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200">
          Static data compiled {DATA_UPDATED}; last checked {v.lastVerified}. Confirm on the official fee page.
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
      {v.regionNote && <p className="mt-2 text-sm text-slate-400">{v.regionNote}</p>}
      <div className="mt-4 space-y-4">
        {GROUPS.map((g) => {
          const items = JURISDICTIONS.filter((j) => j.group === g);
          return (
            <div key={g}>
              <div className="label mb-2">{g}</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((j) => {
                  const [label, color] = AV[availabilityOf(v.access, j.code)];
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
        <p className="mt-3 text-sm text-slate-300">{v.risks}</p>
      </div>

      {v.referral && <div className="mt-8"><ReferralCard venue={v} /></div>}

      <div className="mt-8 flex flex-wrap gap-3">
        <OutLink venue={v} className="btn-primary">Visit {v.name}</OutLink>
        <a href={v.feeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Official fee schedule ↗</a>
      </div>
    </div>
  );
}