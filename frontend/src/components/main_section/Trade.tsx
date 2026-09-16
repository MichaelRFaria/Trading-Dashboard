import FinnhubLookupForm from "@/src/components/trade/FinnhubLookupForm";
import TradeForm from "@/src/components/trade/TradeForm";
import {HoldingsDataItem} from "@/src/types/trade";

export default function Trade({holdingsData, getHoldingsDataAsync}: {
    holdingsData: HoldingsDataItem[], getHoldingsDataAsync: () => Promise<void>,
}) {
    return (
        <div className="flex flex-col justify-center items-center">
            <FinnhubLookupForm/>
            <TradeForm getHoldingsDataAsync={getHoldingsDataAsync} holdingsData={holdingsData}/>
        </div>
    )
}