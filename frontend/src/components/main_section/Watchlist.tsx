import WatchlistForm from '@/src/components/watchlist/WatchlistForm';
import WatchlistList from '@/src/components/watchlist/WatchlistList';
import { WatchlistDataItem } from '@/src/types/watchlist';

export default function Watchlist({
  watchlistData,
  getWatchlistDataAsync,
}: {
  watchlistData: WatchlistDataItem[];
  getWatchlistDataAsync: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <WatchlistForm
        getWatchlistDataAsync={getWatchlistDataAsync}
        watchlistData={watchlistData}
      />
      <WatchlistList watchlistData={watchlistData} />
    </div>
  );
}
