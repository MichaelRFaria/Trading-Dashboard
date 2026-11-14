import { HistoryDataItem, HistoryRequest } from '@/src/types/history';
import HistoryList from '@/src/components/history/HistoryList';
import HistoryControls from '@/src/components/history/HistoryControls';

export default function History({
  historyData,
  fetchHistory,
}: {
  historyData: HistoryDataItem[];
  fetchHistory: (request: HistoryRequest) => Promise<void>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
          Trading Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Trade history
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Search, sort, and review your past trades.
        </p>
      </div>
      <HistoryControls fetchHistoryAction={fetchHistory} />
      <HistoryList historyData={historyData} />
    </div>
  );
}
