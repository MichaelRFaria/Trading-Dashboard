import HoldingsList from "@/src/components/portfolio/HoldingsList";
import StockCards from "@/src/components/portfolio/StockCards";

export default function Portfolio({holdingsData, holdingsPriceData, priceChangesData}) {
    return (
        <div className="flex flex-col justify-center items-center">
            <HoldingsList holdingsData={holdingsData}/>
            <StockCards holdingsData={holdingsData} holdingsPriceData={holdingsPriceData}
                        priceChangesData={priceChangesData}/>
        </div>)
}