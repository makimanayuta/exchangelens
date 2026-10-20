import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 text-sm text-slate-500">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>© {new Date().getFullYear()} {SITE.name}</div>
          <div className="flex gap-5">
            <Link href="/methodology" className="hover:text-white">Methodology</Link>
            <Link href="/disclosure" className="hover:text-white">Affiliate disclosure</Link>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed">
          We may earn commission from some links; it never affects rankings. Fees and availability change; confirm on the
          official site. Crypto is high-risk and you can lose all your capital. This is information, not financial advice.
        </p>
      </div>
    </footer>
  );
}