import { buyHolding, sellHolding } from '@/src/helper/api';
import {
  TradeBasicResponse,
  TradeRequest,
} from '@/src/types/trade';
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';
import FormSelect from '@/src/components/common/FormSelect';
import {HoldingsDataItem} from "@/src/types/holding";

export default function TradeForm({
  getHoldingsDataAsync,
  holdingsData,
}: {
  getHoldingsDataAsync: () => Promise<void>;
  holdingsData: HoldingsDataItem[];
}) {
  const { showNotification } = useNotification();

  const [tradeType, setTradeType] = useState('buy');
  const [selectedStock, setSelectedStock] = useState('');

  useEffect(() => {
    // if the user no longer has holdings (they have sold their last holding), set trade type to buy
    if (holdingsData.length === 0) {
      setTradeType('buy');
      return;
    }

    // if the selectedStock state is no longer in their holdingsData (they have sold all their shares in the holding),
    // then set the selected stock to the first stock in their holdingsData
    if (!holdingsData.find((stock) => stock.stock_symbol === selectedStock)) {
      setSelectedStock(holdingsData[0].stock_symbol);
    }
  }, [holdingsData, selectedStock]);

  const selectedStockObj = holdingsData.find(
    (stock) => stock.stock_symbol === selectedStock,
  );

  const selectedStockMaxQuantity = selectedStockObj?.quantity ?? 0;

  const tradeStocksFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    //console.log(authenticatedUser.sub)

    //console.log("form submit")

    const formData = new FormData(event.target);

    const request: TradeRequest = {
      stock_symbol: formData.get('stock_symbol') as string,
      quantity: parseFloat(formData.get('quantity') as string) as number,
    };

    console.log(request);

    let response: TradeBasicResponse | null;

    if (request.quantity > selectedStockMaxQuantity && tradeType === 'sell') {
      showNotification('You cannot sell more shares than you own.');
      return;
    }

    switch (tradeType) {
      case 'buy':
        response = await buyHolding(request);
        break;
      case 'sell':
        response = await sellHolding(request);
        break;
      default:
        console.error(
          "trade form's action value was unexpected, something went wrong",
        );
        return;
    }

    //console.log(response)
    // console.log("trade form test")

    if (response === null) {
      showNotification(
        'Error encountered while executing trade, please try again.',
      );
      return;
    }

    if (response.message) {
      showNotification(response.message);
    }

    await getHoldingsDataAsync();
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Place a trade</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose a stock, quantity, and action.
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={tradeStocksFormSubmission}
      >
        {tradeType === 'buy' ? (
          <FormInput
            label="Stock symbol"
            id="stock_symbol"
            name="stock_symbol"
            type="text"
          />
        ) : (
          <FormSelect
            label="Stock symbol"
            id="stock_symbol"
            name="stock_symbol"
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            {holdingsData.map((item: HoldingsDataItem) => (
              <option key={item.stock_symbol} value={item.stock_symbol}>
                {item.stock_symbol}
              </option>
            ))}
          </FormSelect>
        )}

        <FormInput
          label="Quantity"
          id="quantity"
          name="quantity"
          type="number"
          min="0.00000001"
          step="0.00000001"
        />

        <FormSelect
          label="Action"
          id="action"
          name="action"
          value={tradeType}
          onChange={(e) => setTradeType(e.target.value)}
        >
          <option value="buy">Buy</option>
          {holdingsData.length > 0 && <option value="sell">Sell</option>}
        </FormSelect>

        <button
          className="mt-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          type="submit"
        >
          Execute trade
        </button>
      </form>
    </section>
  );
}
