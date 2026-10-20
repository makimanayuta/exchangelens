import { Suspense } from "react";
import ResultsView from "@/components/ResultsView";

export const metadata = { title: "Compare trading venues" };

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Suspense fallback={<div className="card p-10 text-center text-slate-400">Loading comparison…</div>}>
        <ResultsView />
      </Suspense>
    </div>
  );
}