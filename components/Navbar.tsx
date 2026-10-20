"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";

const LINKS = [
  ["/compare", "Compare"],
  ["/methodology", "Methodology"],
  ["/disclosure", "Disclosure"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-white" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-cyan text-ink-950">◆</span>
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-slate-400 md:flex">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 hover:text-white">{label}</Link>
          ))}
          <Link href="/compare" className="btn-primary ml-2 !px-4 !py-2">Find my platform</Link>
        </nav>

        <button
          aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-ink-900 px-4 pb-4 pt-2 md:hidden">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5">{label}</Link>
          ))}
          <Link href="/compare" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">Find my platform</Link>
        </nav>
      )}
    </header>
  );
}