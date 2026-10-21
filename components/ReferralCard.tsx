import { Exchange } from "@/lib/types";
import OutLink from "./OutLink";

const TYPE = {
  "fee-voucher": "Fee-rebate vouchers",
  "bonus-credit": "Trading bonus credit",
  "fee-discount": "Fee discount",
  "crypto": "Crypto rewards",
  "cash": "Cash rewards",
  withdrawable: "Withdrawable funds",
  mixed: "Mixed rewards",
} as const;

export default function ReferralCard({ exchange }: { exchange: Exchange }) {
  const r = exchange.referral;
  if (!r) return null;
  const req = r.requirements;
  const checks = [
    req.kyc && "Complete identity verification (KYC) as a new user.",
    "Sign up through the correct referral link or mode.",
    req.deposit,
    req.volume,
    req.holding,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand/40 via-brand-cyan/20 to-transparent p-px">
      <div className="rounded-2xl bg-ink-800 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="chip border-brand/30 bg-brand/10 text-brand">🎁 Referral bonus</span>
            <div className="mt-3 text-2xl font-extrabold text-white">{r.headline}</div>
            <div className="mt-1 text-sm text-slate-400">{TYPE[r.rewardType]} · {r.availability}</div>
          </div>
          {r.modes && (
            <div className="flex flex-wrap gap-1.5">
              {r.modes.map((m) => <span key={m} className="chip">{m}</span>)}
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="label mb-2">Qualification checklist</div>
          <ul className="space-y-2 text-sm text-slate-300">
            {checks.map((c) => (
              <li key={c} className="flex gap-2"><span className="text-brand">✓</span><span>{c}</span></li>
            ))}
            <li className="flex gap-2 text-slate-400"><span>ℹ</span><span>{r.caveat}</span></li>
          </ul>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-ink-900/70 p-3"><dt className="text-xs text-slate-500">Deadline</dt><dd className="mt-0.5 text-slate-200">{r.deadline ?? "Not specified"}</dd></div>
          <div className="rounded-xl bg-ink-900/70 p-3"><dt className="text-xs text-slate-500">Eligible countries</dt><dd className="mt-0.5 text-slate-200">{r.countries}</dd></div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Terms change often. Verify on the exchange. Checked {r.verified}.</p>
          {exchange.affiliateUrl && <OutLink exchange={exchange} className="btn-primary !px-4 !py-2.5">Claim via referral link</OutLink>}
        </div>
      </div>
    </div>
  );
}