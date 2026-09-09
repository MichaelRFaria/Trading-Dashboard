import HoldingsList from "@/src/components/portfolio/HoldingsList";
import StockCards from "@/src/components/portfolio/StockCards";
import {HoldingsDataItem} from "@/src/types/trade";
import {FinnhubPriceChangesDataItem, HoldingsPrice} from "@/src/types/stock";

export default function Portfolio({holdingsData, holdingsPriceData, priceChangesData}: {
    holdingsData: HoldingsDataItem[],
    holdingsPriceData: HoldingsPrice,
    priceChangesData: FinnhubPriceChangesDataItem[]
}) {
    return (
        <div className="flex flex-col justify-center items-center">
            <HoldingsList holdingsData={holdingsData}/>
            <StockCards holdingsData={holdingsData} holdingsPriceData={holdingsPriceData}
                        priceChangesData={priceChangesData}/>
        </div>)
}