export const metadata = { title: "Methodology" };

export default function Methodology() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_p]:mt-3 [&_p]:text-slate-400 [&_li]:text-slate-400 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-brand">
      <h1 className="text-4xl font-extrabold text-white">Methodology</h1>
      <p>Every number comes from one of four categories, and we label which: official fee schedules, live market measurements, our estimates, and affiliate status.</p>

      <h2>Total cost</h2>
      <p><code>total = fee + spread + slippage + deposit + conversion + funding + withdrawal</code></p>
      <ul>
        <li><b>Fee</b>: order size × published fee (maker or taker, standard tier, no discounts). Perpetuals pay it twice (open and close).</li>
        <li><b>Spread</b>: half the bid-ask gap per market order.</li>
        <li><b>Slippage</b>: estimated impact beyond the top of book for your size. Spread and slippage don't overlap, so impact isn't counted twice.</li>
        <li><b>Funding</b> (perps): notional × rate per 8h × 3 × days held. It can be positive or negative.</li>
        <li><b>Withdrawal</b>: only if you choose to move the asset off the platform.</li>
      </ul>

      <h2>Ranking</h2>
      <ul>
        <li><b>Lowest cost</b>: sorted by total cost %.</li>
        <li><b>Liquidity</b>: a depth-based score, not reported volume. Volume is activity; liquidity is how much you can trade without moving price.</li>
        <li><b>Balanced</b>: 50% cost, 20% liquidity, 15% ease of use, 15% asset coverage.</li>
      </ul>
      <p>Affiliate status is never an input to any ranking.</p>

      <h2>CEX vs DEX</h2>
      <p>DEXs add gas, bridge costs, wallet requirements and smart-contract risk. We show those separately and don't pretend they are equivalent to custodial risk.</p>

            <h2>Simple route vs order book</h2>
      <p>Many apps charge a single all-in percentage on the Buy button (the spread is baked into the quote). Where a venue offers both, we price the order book by default and switch to the Buy-button price when you tick “Use the simple Buy button”. Brokers and CFD providers (eToro, XTB) only have the simple route.</p>

      <h2>Regions</h2>
      <p>Each venue stores a default availability plus exceptions per jurisdiction. Sub-regions such as France and Germany inherit from the EU unless a venue overrides them. Where a venue is “Unavailable”, it is removed from your results. “Check region” means a restriction, a separate local entity, or conflicting sources. Some fees also differ by region (for example Coinbase and Upbit), and we apply the regional rate.</p>

      <h2>Limits</h2>
      <p>Fees depend on tier, product, region and promotions. Our estimates cover standard accounts. Always confirm on the official page before trading. This is not financial advice.</p>
    </article>
  );
}