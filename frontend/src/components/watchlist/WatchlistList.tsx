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
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Stock symbol</th>
              <th className="px-5 py-3 text-right font-medium">
                Current Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {watchlistData.map((item: WatchlistDataItem, index: number) => (
              <tr key={item.id} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                <td className="px-5 py-3 font-medium text-slate-100">
                  {item.stock_symbol}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {parseNumberToDollars(priceData[item.stock_symbol].current)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
