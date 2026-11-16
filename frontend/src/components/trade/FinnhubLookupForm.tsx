import { finnhubStockSymbolLookup } from '@/src/helper/api';
import {
  StockSymbolLookupRequest,
  StockSymbolLookupResponse,
} from '@/src/types/stock';
import React from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';

export default function FinnhubLookupForm() {
  const { showNotification } = useNotification();

  const finnhubLookupFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    console.log('form submit');
    const formData = new FormData(event.target);

    const request: StockSymbolLookupRequest = {
      stock_symbol: formData.get('stock_symbol') as string,
    };

    const response: StockSymbolLookupResponse | null =
      await finnhubStockSymbolLookup(request);

    if (response === null) {
      showNotification('Something went wrong, please try again');
      return;
    }

    if ('message' in response) {
      showNotification(response.message);
    }

    showNotification(JSON.stringify(response));
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Stock lookup</h2>
        <p className="mt-1 text-sm text-slate-400">
          Search Finnhub for a stock symbol.
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={finnhubLookupFormSubmission}
      >
        <FormInput
          label="Stock symbol"
          id="stock_symbol"
          name="stock_symbol"
          type="text"
        />

        <button
          className="mt-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          type="submit"
        >
          Search
        </button>
      </form>
    </section>
  );
}
