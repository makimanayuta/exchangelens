import { ctaFor } from "@/lib/cta";
import { Venue } from "@/lib/types";

export default function OutLink({ venue, className, children }: { venue: Venue; className?: string; children?: React.ReactNode }) {
  const c = ctaFor(venue);
  return (
    <a
      href={c.href} target="_blank"
      rel={c.referral ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      className={`${className ?? ""} text-center leading-tight`}
    >
      {children ?? <>{c.referral && "🎁 "}{c.label}</>} ↗
    </a>
  );
}