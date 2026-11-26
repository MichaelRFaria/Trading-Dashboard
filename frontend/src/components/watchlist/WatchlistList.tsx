import { WatchlistDataItem, WatchlistPricesData } from '@/src/types/watchlist';
import { parseNumberToDollars } from '@/src/helper/format';

export default function WatchlistList({
  watchlistData,
  priceData,
}: {
  watchlistData: WatchlistDataItem[];
  priceData: WatchlistPricesData;
}) {
  if (watchlistData.length <= 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400 shadow-xl shadow-black/20">
        Add some items to your watchlist to view them.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-100">Watchlist</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left text-sm">
          <thead className="bg-white/3 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Stock symbol</th>
              <th className="px-5 py-3 text-right font-medium">
                Current Price
              </th>
              <th className="px-5 py-3 font-medium">Price Target Type</th>
              <th className="px-5 py-3 text-right font-medium">Price Target</th>
              <th className="px-5 py-3 text-right font-medium">Distance</th>
              <th className="px-5 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {watchlistData.map((item: WatchlistDataItem, index: number) => {
              const currentPrice = priceData[item.stock_symbol]?.current;
              const targetPrice = item.price_target
                ? Number(item.price_target)
                : undefined;
              const priceType = item.price_type
                ?.trim()
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll('-', '_');
              const distance =
                currentPrice !== undefined && targetPrice !== undefined
                  ? targetPrice - currentPrice
                  : undefined;
              const distancePercent =
                distance !== undefined &&
                currentPrice !== undefined &&
                currentPrice !== 0
                  ? (distance / currentPrice) * 100
                  : undefined;
              const targetReached =
                currentPrice !== undefined &&
                targetPrice !== undefined &&
                Number.isFinite(currentPrice) &&
                Number.isFinite(targetPrice) &&
                ((priceType === 'buy_below' && currentPrice <= targetPrice) ||
                  (priceType === 'sell_above' && currentPrice >= targetPrice));
              const targetStatusKnown =
                currentPrice !== undefined &&
                Number.isFinite(currentPrice) &&
                targetPrice !== undefined &&
                Number.isFinite(targetPrice) &&
                (priceType === 'buy_below' || priceType === 'sell_above');

              return (
                <tr key={item.id} className="transition hover:bg-white/3">
                  <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-5 py-3 font-medium text-slate-100">
                    {item.stock_symbol}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {currentPrice !== undefined
                      ? parseNumberToDollars(currentPrice)
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {priceType?.replaceAll('_', ' ') ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    <span
                      className={
                        targetStatusKnown
                          ? targetReached
                            ? 'font-semibold text-emerald-400'
                            : 'font-semibold text-red-400'
                          : ''
                      }
                    >
                      {targetPrice !== undefined && Number.isFinite(targetPrice)
                        ? parseNumberToDollars(targetPrice)
                        : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {distance !== undefined && Number.isFinite(distance)
                      ? parseNumberToDollars(distance)
                      : '—'}{' '}
                    (
                    {distancePercent !== undefined &&
                    Number.isFinite(distancePercent)
                      ? `${distancePercent.toFixed(2)}%`
                      : '—'}
                    )
                  </td>
                  <td className="max-w-xs px-5 py-3">{item.notes || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
