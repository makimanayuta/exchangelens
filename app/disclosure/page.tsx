import { SITE } from "@/lib/site";
export const metadata = { title: "Affiliate disclosure" };

export default function Disclosure() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 [&_p]:mt-4 [&_p]:text-slate-400">
      <h1 className="text-4xl font-extrabold text-white">Affiliate disclosure</h1>
      <p>{SITE.name} may earn a commission when you sign up through some links. It costs you nothing extra, and some venues may even offer you a bonus.</p>
      <p>Commissions never influence rankings. A venue with a referral link can rank below one without. Venues with referral links are labelled “Referral link” wherever they appear.</p>
      <p>Sponsored placements, if ever introduced, will be clearly marked and kept separate from organic results.</p>
      <p>Questions? <a className="text-brand underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
      <p className="text-sm">Crypto assets are volatile and you can lose money. Nothing here is financial advice.</p>
    </article>
  );
}