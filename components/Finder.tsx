"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FREQS, GOALS, PRIORITIES } from "@/lib/options";
import RegionPicker from "./RegionPicker";
import { currencyFor, formatAmount, presetsFor } from "@/lib/currencies";

function Group<T extends string | number>({
  title, value, onChange, options,
}: { title: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div>
      <div className="label mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)} type="button" onClick={() => onChange(o.value)}
            className={`rounded-xl border px-3.5 py-2 text-left text-sm transition ${value === o.value
              ? "border-brand/60 bg-brand/10 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.3)]"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Finder() {
  const router = useRouter();
  const [goal, setGoal] = useState("spot");
  const [freq, setFreq] = useState("occasional");
  const [priority, setPriority] = useState("balanced");
  const [region, setRegion] = useState("OTHER");
  const [tier, setTier] = useState(1);                 // 0..3 -> index into the presets

  const ccy = currencyFor(region);
  const presets = presetsFor(ccy);
  const sizeOptions = presets.map((v, i) => ({
    value: i,
    label: i === 3 ? `${formatAmount(v, ccy)} or more` : `Around ${formatAmount(v, ccy)}`,
  }));

  <Group title="How much per transaction?" value={tier} onChange={setTier} options={sizeOptions} />

  const go = () => {
    const p = new URLSearchParams({ goal, size: String(presets[tier]), freq, priority, region });
    router.push(`/compare?${p.toString()}`);
  };

  return (
    <div className="card mx-auto max-w-4xl space-y-6 p-5 shadow-glow sm:p-6 md:p-8">
      <h2 className="text-xl font-bold text-white">Find my trading platform</h2>
      <Group title="What do you want to do?" value={goal} onChange={setGoal} options={GOALS} />
      <div>
        <div className="label mb-2">Where will you use it?</div>
        <div className="max-w-sm"><RegionPicker value={region} onChange={setRegion} /></div>
      </div>
      <Group title="How much per transaction?" value={tier} onChange={setTier} options={sizeOptions} />
      <Group title="How often?" value={freq} onChange={setFreq} options={FREQS} />
      <Group title="What matters most?" value={priority} onChange={setPriority} options={PRIORITIES} />
      <button onClick={go} className="btn-primary w-full !py-3.5 text-base">Show my results →</button>
    </div>
  );
}