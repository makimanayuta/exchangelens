"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export default function ExchangeLogo({ slug, name, domain, size = 56 }: { slug: string; name: string; domain: string; size?: number }) {
  const sources = [
    //`/logos/${slug}.svg`,
    `/logos/${slug}.png`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
  const [i, setI] = useState(0);
  const box = { width: size, height: size };

  if (i >= sources.length) {
    return (
      <div style={box} className="grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ink-600 to-ink-700 text-sm font-bold text-white ring-1 ring-white/10">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <div style={box} className="grid shrink-0 place-items-center overflow-hidden rounded-xl bg-transparent p-0">
      <img src={sources[i]} alt={`${name} logo`} onError={() => setI(i + 1)} className="object-contain" />
    </div>
  );
}