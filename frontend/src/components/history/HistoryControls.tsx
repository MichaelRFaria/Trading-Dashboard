"use client";

import {useState} from "react";
import type {HistoryRequest} from "@/src/types/history";

export default function HistoryControls({fetchHistory}: {
    fetchHistory: (request: HistoryRequest) => void
}) {
    const [stockSymbol, setStockSymbol] = useState("");
    const [quantityFrom, setQuantityFrom] = useState("");
    const [quantityTo, setQuantityTo] = useState("");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [type, setType] = useState<"" | "buy" | "sell">("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const request: HistoryRequest = {
            stock_symbol: stockSymbol || undefined,

            quantity_from: quantityFrom ? parseFloat(quantityFrom) : undefined,

            quantity_to: quantityTo ? parseFloat(quantityTo) : undefined,

            price_from: priceFrom ? parseFloat(priceFrom) : undefined,

            price_to: priceTo ? parseFloat(priceTo) : undefined,

            type: type || undefined,

            date_from: dateFrom ? new Date(dateFrom).toISOString() : undefined,

            // converting to ISOString makes the timestamp of the date midnight, but we want dateTo to be inclusive of the selected date,
            // so we set the timestamp to the maximum time
            date_to: dateTo ? new Date(`${dateTo}T23:59:59.999Z`).toISOString() : undefined,
        };

        fetchHistory(request);
    };

    const clearFilters = () => {
        setStockSymbol("");
        setQuantityFrom("");
        setQuantityTo("");
        setPriceFrom("");
        setPriceTo("");
        setType("");
        setDateFrom("");
        setDateTo("");

        fetchHistory({});
    };

    return (<form onSubmit={handleSubmit} className="flex flex-row flex-wrap gap-4">
        <div>
            <label htmlFor="stock_symbol">Stock</label>
            <input
                id="stock_symbol"
                name="stock_symbol"
                type="text"
                value={stockSymbol}
                onChange={(event) => setStockSymbol(event.target.value)}
                placeholder="e.g. AAPL"
            />
        </div>

        <div>
            <label htmlFor="quantity_from">Quantity from</label>
            <input
                id="quantity_from"
                name="quantity_from"
                type="number"
                min="0"
                step="0.00000001"
                value={quantityFrom}
                onChange={(event) => setQuantityFrom(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="quantity_to">Quantity to</label>
            <input
                id="quantity_to"
                name="quantity_to"
                type="number"
                min="0"
                step="0.00000001"
                value={quantityTo}
                onChange={(event) => setQuantityTo(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="price_from">Price from</label>
            <input
                id="price_from"
                name="price_from"
                type="number"
                min="0"
                step="0.01"
                value={priceFrom}
                onChange={(event) => setPriceFrom(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="price_to">Price to</label>
            <input
                id="price_to"
                name="price_to"
                type="number"
                min="0"
                step="0.01"
                value={priceTo}
                onChange={(event) => setPriceTo(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="type">Trade type</label>
            <select
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as "" | "buy" | "sell")}
            >
                <option value="">All</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>
        </div>

        <div>
            <label htmlFor="date_from">Date from</label>
            <input
                id="date_from"
                name="date_from"
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="date_to">Date to</label>
            <input
                id="date_to"
                name="date_to"
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
            />
        </div>

        <div className="flex gap-2">
            <button type="submit">
                Apply filters
            </button>

            <button
                type="button"
                onClick={clearFilters}
            >
                Clear
            </button>
        </div>
    </form>);
}
