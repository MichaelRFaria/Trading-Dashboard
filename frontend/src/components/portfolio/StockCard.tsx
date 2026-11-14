export default function StockCard({
  symbol,
  quantity,
  currentPrice,
  priceChange,
  totalValue,
  percentageChange,
}: {
  symbol: string;
  quantity: number;
  currentPrice: number;
  priceChange: number;
  totalValue: string;
  percentageChange: string;
}) {
  return (
    <article className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-100 shadow-xl shadow-black/20 transition hover:border-sky-400/20">
      <p className="text-xl font-semibold tracking-tight">{symbol}</p>
      <p className="self-center text-right text-sm text-slate-400">
        {quantity} shares
      </p>

      <div>
        <p className="text-xs text-slate-500">Price</p>
        <p className="mt-1 text-lg font-semibold tabular-nums">
          ${currentPrice}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">Market value</p>
        <p className="mt-1 text-lg font-semibold tabular-nums">${totalValue}</p>
      </div>

      <p
        className={`text-sm font-medium tabular-nums ${
          priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {priceChange >= 0 ? '+' : '-'}${Math.abs(priceChange)}
      </p>
      <p
        className={`text-right text-sm font-medium tabular-nums ${
          Number(percentageChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {percentageChange}%
      </p>
    </article>
  );
}
