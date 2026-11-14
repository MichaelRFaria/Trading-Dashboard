'use client';

import React, { useState } from 'react';
import type { HistoryRequest } from '@/src/types/history';

const fieldClassName =
  'mt-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20';
const labelClassName = 'text-xs font-medium text-slate-400';

export default function HistoryControls({
  fetchHistoryAction,
}: {
  fetchHistoryAction: (request: HistoryRequest) => void;
}) {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantityFrom, setQuantityFrom] = useState('');
  const [quantityTo, setQuantityTo] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [type, setType] = useState<'' | 'buy' | 'sell'>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
      date_to: dateTo
        ? new Date(`${dateTo}T23:59:59.999Z`).toISOString()
        : undefined,
    };

    fetchHistoryAction(request);
  };

  const clearFilters = () => {
    setStockSymbol('');
    setQuantityFrom('');
    setQuantityTo('');
    setPriceFrom('');
    setPriceTo('');
    setType('');
    setDateFrom('');
    setDateTo('');

    fetchHistoryAction({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 sm:grid-cols-2 xl:grid-cols-4"
    >
      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="stock_symbol">
          Stock
        </label>
        <input
          id="stock_symbol"
          name="stock_symbol"
          type="text"
          value={stockSymbol}
          onChange={(event) => setStockSymbol(event.target.value)}
          placeholder="e.g. AAPL"
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="quantity_from">
          Quantity from
        </label>
        <input
          id="quantity_from"
          name="quantity_from"
          type="number"
          min="0"
          step="0.00000001"
          value={quantityFrom}
          onChange={(event) => setQuantityFrom(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="quantity_to">
          Quantity to
        </label>
        <input
          id="quantity_to"
          name="quantity_to"
          type="number"
          min="0"
          step="0.00000001"
          value={quantityTo}
          onChange={(event) => setQuantityTo(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="price_from">
          Price from
        </label>
        <input
          id="price_from"
          name="price_from"
          type="number"
          min="0"
          step="0.01"
          value={priceFrom}
          onChange={(event) => setPriceFrom(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="price_to">
          Price to
        </label>
        <input
          id="price_to"
          name="price_to"
          type="number"
          min="0"
          step="0.01"
          value={priceTo}
          onChange={(event) => setPriceTo(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="type">
          Trade type
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) =>
            setType(event.target.value as '' | 'buy' | 'sell')
          }
          className={fieldClassName}
        >
          <option value="">All</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="date_from">
          Date from
        </label>
        <input
          id="date_from"
          name="date_from"
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClassName} htmlFor="date_to">
          Date to
        </label>
        <input
          id="date_to"
          name="date_to"
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-4">
        <button
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          type="submit"
        >
          Apply filters
        </button>

        <button
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          type="button"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
