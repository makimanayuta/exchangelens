/* eslint-disable @next/next/no-img-element */
export default function Flag({ code, className = "" }: { code: string | null; className?: string }) {
  if (!code) return <span className={`inline-block w-5 text-center text-sm leading-none ${className}`}>🌍</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={20} height={15} alt="" loading="lazy"
      className={`inline-block h-[15px] w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-white/10 ${className}`}
    />
  );
}