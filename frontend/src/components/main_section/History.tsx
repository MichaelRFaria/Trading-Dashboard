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
    <div>
      <HistoryControls fetchHistory={fetchHistory} />
      <HistoryList historyData={historyData} />
    </div>
  );
}
