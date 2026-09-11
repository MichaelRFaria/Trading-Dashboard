import {HistoryDataItem} from "@/src/types/history";
import HistoryList from "@/src/components/history/HistoryList";
import {useEffect} from "react";
import HistoryControls from "@/src/components/history/HistoryControls";

export default function History({historyData, fetchHistory}: { historyData: HistoryDataItem[] }) {
    return <div>
        <HistoryControls fetchHistory={fetchHistory}/>
        <HistoryList historyData={historyData}/>
    </div>
}