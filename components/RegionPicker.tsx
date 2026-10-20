"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, JURISDICTIONS, jurisdiction } from "@/lib/jurisdictions";
import Flag from "./Flag";

export default function RegionPicker({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cur = jurisdiction(value) ?? jurisdiction("OTHER")!;
  const list = useMemo(() => JURISDICTIONS.filter((j) => j.name.toLowerCase().includes(q.trim().toLowerCase())), [q]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-left text-sm text-slate-200 hover:border-white/20 focus:border-brand/60"
      >
        <span className="flex items-center gap-2 truncate"><Flag code={cur.flag} /> {cur.name}</span>
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full min-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-2xl">
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country or region…"
            className="w-full border-b border-white/5 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-500"
          />
          <div className="max-h-72 overflow-y-auto py-1">
            {GROUPS.map((g) => {
              const items = list.filter((j) => j.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{g}</div>
                  {items.map((j) => (
                    <button
                      key={j.code} type="button"
                      onClick={() => { onChange(j.code); setOpen(false); setQ(""); }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-white/5 ${j.code === value ? "text-brand" : "text-slate-300"}`}
                    >
                      <Flag code={j.flag} /> {j.name}
                    </button>
                  ))}
                </div>
              );
            })}
            {list.length === 0 && <div className="px-3 py-4 text-sm text-slate-500">No match</div>}
          </div>
        </div>
      )}
    </div>
  );
}