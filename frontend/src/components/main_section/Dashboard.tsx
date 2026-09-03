"use client";

import Metrics from "@/src/components/Metrics";

export default function Dashboard({holdingsData, holdingsPriceData, priceChangesData, gains}) {
    return (
        <div className="flex flex-col justify-center items-center">
            <Metrics holdingsData={holdingsData} holdingsPriceData={holdingsPriceData}
                     priceChangesData={priceChangesData} gains={gains}/>
        </div>
    );
}

