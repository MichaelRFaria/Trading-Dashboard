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

    if (response) {
      showNotification(JSON.stringify(response));
    } else {
      showNotification(request.stock_symbol + ' does not exist.');
    }
  };

  return (
    <>
      <p className="text-bg underline">Finnhub Lookup:</p>

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={finnhubLookupFormSubmission}
      >
        <FormInput
          label="Stock symbol"
          id="stock_symbol"
          name="stock_symbol"
          type="text"
        />

        <button type="submit">Search</button>
      </form>
    </>
  );
}
