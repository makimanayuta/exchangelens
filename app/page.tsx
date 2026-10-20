import Finder from "@/components/Finder";
import { SITE } from "@/lib/site";
import Link from "next/link";
import { VENUES } from "@/lib/venues";

const PILLARS = [
  { t: "Real total cost", d: "Fees, spread, slippage, deposit, withdrawal and funding, summed in euros and percent for your trade." },
  { t: "Simple, then deep", d: "Plain answers by default. Maker/taker, depth, funding and fee sources one click away." },
  { t: "Commission-proof ranking", d: "Affiliate relationships never touch the ranking formula. Every method is published." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip mb-5 text-sm">Crypto exchange comparison engine</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Find the best place to{" "}
            <span className="bg-gradient-to-r from-brand to-brand-cyan bg-clip-text text-transparent">trade crypto</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400">
            Compare what you will actually pay, plus liquidity, supported assets and availability, without the guesswork.
            Beginner-friendly answers. Professional-grade detail.
          </p>
        </div>
        <div className="mt-12 relative z-10"><Finder /></div>
        <p className="mt-4 text-center text-xs text-slate-500">
          {VENUES.length} exchanges compared · CEX and DEX · No account needed
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.t} className="card p-6">
              <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-brand to-brand-cyan" />
              <h3 className="text-lg font-semibold text-white">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="card grid gap-8 p-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Fee ≠ cost</h2>
            <p className="mt-3 text-slate-400">
              A “zero-fee” venue with a wide spread or expensive withdrawals can cost more than one with a visible fee.
              {" "}{SITE.name} adds every component so you can compare like with like.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/compare" className="btn-primary">Open the calculator</Link>
              <Link href="/methodology" className="btn-ghost">How we calculate</Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[["Spread", "Gap between best buy and sell price."],
              ["Slippage", "Extra price impact for your order size, beyond the spread."],
              ["Maker / taker", "Limit orders that add liquidity vs orders that take it."],
              ["Funding", "Periodic payment between longs and shorts on perpetuals."]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/[0.06] bg-ink-900/70 p-4">
                <dt className="font-semibold text-white">{k}</dt>
                <dd className="mt-1 text-slate-400">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}