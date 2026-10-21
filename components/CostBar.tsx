import { CostResult } from "@/lib/calc";
import { Currency, formatUsd } from "@/lib/currencies";

const COLORS: Record<string, string> = {
  fee: "bg-emerald-400", spread: "bg-cyan-400", slippage: "bg-sky-500",
  deposit: "bg-violet-400", conversion: "bg-fuchsia-400", funding: "bg-amber-400", withdrawal: "bg-rose-400",
};

export default function CostBar({ cost, showLegend, ccy }: { cost: CostResult; showLegend?: boolean; ccy: Currency }) {
  const lines = cost.lines.filter((l) => l.usd > 0);
  const total = cost.total || 1;
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
        {lines.map((l) => (
          <div key={l.key} className={COLORS[l.key]} style={{ width: `${(l.usd / total) * 100}%` }} title={`${l.label}: ${formatUsd(l.usd, ccy)}`} />
        ))}
      </div>
      {showLegend && (
        <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {cost.lines.map((l) => (
            <li key={l.key} className="flex items-start justify-between gap-3">
              <span className="flex items-start gap-2">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${COLORS[l.key]}`} />
                <span><span className="text-slate-200">{l.label}</span><br /><span className="text-xs text-slate-500">{l.hint}</span></span>
              </span>
              <span className="tabular-nums text-slate-200">{formatUsd(l.usd, ccy)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}