import { ctaFor } from "@/lib/cta";
import { Exchange } from "@/lib/types";

export default function OutLink({ exchange, className, children }: { exchange: Exchange; className?: string; children?: React.ReactNode }) {
  const c = ctaFor(exchange);
  const long = (c.label.length + (c.bonus ? 1 : 0)) > 26;   // switch to a smaller font for long labels

  return (
    <a
    href={c.href} target="_blank"
    rel={c.referral ? "sponsored noopener noreferrer" : "noopener noreferrer"}
    className={`${c.referral ? "btn-amber" : "btn-primary"} ${className ?? ""} min-w-0 text-center leading-tight ${long ? "!text-xs" : ""}`}
  >
      <span className="line-clamp-2 break-words">{children ?? <>{c.referral && "🎁 "}{c.label}</>}{c.bonus && "*"}</span><span className="shrink-0">↗</span>
    </a>
  );
}