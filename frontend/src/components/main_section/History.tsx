import {HistoryDataItem} from "@/src/types/history";
import HistoryList from "@/src/components/history/HistoryList";
import {useEffect} from "react";

export default function History({historyData} : {historyData: HistoryDataItem[]}) {
    useEffect(() => {
        console.log("historyData",historyData)
    }, []);

    return <HistoryList historyData={historyData}/>
}