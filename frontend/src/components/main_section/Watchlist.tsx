import WatchlistForm from '@/src/components/watchlist/WatchlistForm';
import WatchlistList from '@/src/components/watchlist/WatchlistList';
import { WatchlistDataItem, WatchlistPricesData } from '@/src/types/watchlist';

export default function Watchlist({
  watchlistData,
  priceData,
  getWatchlistDataAsync,
}: {
  watchlistData: WatchlistDataItem[];
  priceData: WatchlistPricesData;
  getWatchlistDataAsync: () => Promise<void>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
          Trading Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Watchlist
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Keep track of stocks you may want to trade.
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-5">
        <WatchlistList watchlistData={watchlistData} priceData={priceData} />
        <WatchlistForm
          getWatchlistDataAsync={getWatchlistDataAsync}
          watchlistData={watchlistData}
        />
      </div>
    </div>
  );
}
