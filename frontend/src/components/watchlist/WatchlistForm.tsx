import {
  addToWatchlist,
  deleteFromWatchlist,
  updateWatchlist,
} from '@/src/helper/api';
import {
  WatchlistDataItem,
  WatchlistRequest,
  WatchlistResponse,
} from '@/src/types/watchlist';
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';
import FormSelect from '@/src/components/common/FormSelect';

export default function WatchlistForm({
  getWatchlistDataAsync,
  watchlistData,
}: {
  getWatchlistDataAsync: () => Promise<void>;
  watchlistData: WatchlistDataItem[];
}) {
  const { showNotification } = useNotification();

  const [actionType, setActionType] = useState('add');
  const [priceTargetType, setPriceTargetType] = useState('buy_below');
  const [selectedStock, setSelectedStock] = useState('');

  useEffect(() => {
    // if the user no longer has holdings in their watchlist (they have deleted their last holding from the watchlist), set action type to add
    if (watchlistData.length === 0) {
      setActionType('add');
      return;
    }

    // if the selectedStock state is no longer in their watchlistData (they have just deleted a holding from the watchlist),
    // then set the selected holding to the first holding in their watchlistData
    if (!watchlistData.find((stock) => stock.stock_symbol === selectedStock)) {
      setSelectedStock(watchlistData[0].stock_symbol);
    }
  }, [selectedStock, watchlistData]);

  const modifyWatchlistFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    //console.log(authenticatedUser.sub)

    //console.log("form submit")
    const formData = new FormData(event.target);

    const entries = Object.fromEntries(formData.entries());

    console.log(entries);

    const { action, ...requestEntries } = entries; // action not needed in request

    const request: WatchlistRequest = {
      ...requestEntries,
      stock_symbol: formData.get('stock_symbol') as string,
    };

    //console.log(action)

    let response: WatchlistResponse | null;

    if (request.stock_symbol === '' || !request.stock_symbol || !actionType) {
      showNotification('Invalid form inputs, please try again.', 3000, true);
      return;
    }

    switch (actionType) {
      case 'add':
        response = await addToWatchlist(request);
        break;
      case 'delete':
        response = await deleteFromWatchlist(request);
        break;
      case 'update':
        response = await updateWatchlist(request);
        break;
      default:
        console.error(
          "watchlist form's action value was unexpected, something went wrong",
        );
        return;
    }

    //console.log

    if (response === null) {
      console.error(
        'watchlist modification response is null, something went wrong',
      );
      return;
    }

    if ('message' in response) {
      showNotification(response.message);
    }

    await getWatchlistDataAsync();
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">
          Manage watchlist
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Add a stock symbol, update its targets or notes, or remove it from
          your list.
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={modifyWatchlistFormSubmission}
      >
        {actionType === 'add' ? (
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
            {watchlistData.map((item: WatchlistDataItem) => (
              <option key={item.stock_symbol} value={item.stock_symbol}>
                {item.stock_symbol}
              </option>
            ))}
          </FormSelect>
        )}

        {(actionType === 'add' || actionType === 'update') && (
          <>
            <FormSelect
              label="Price type"
              id="price_type"
              name="price_type"
              defaultValue="buy_below"
              onChange={(e) => setPriceTargetType(e.target.value)}
            >
              <option value="buy_below">Buy below</option>
              <option value="sell_above">Sell above</option>
              <option value="no_price_target">No price target</option>
            </FormSelect>
            {priceTargetType !== 'no_price_target' && (
              <FormInput
                label="Price target"
                id="price_target"
                name="price_target"
                type="number"
                step="0.01"
                min="0.01"
              />
            )}
            <FormInput
              label="Notes"
              id="notes"
              name="notes"
              type="text"
              placeholder="Add a note"
            />
          </>
        )}

        <FormSelect
          label="Action"
          id="action"
          name="action"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
        >
          <option value="add">Add</option>
          {watchlistData.length > 0 && (
            <>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </>
          )}
        </FormSelect>

        <button
          className="mt-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          type="submit"
        >
          Update watchlist
        </button>
      </form>
    </section>
  );
}
