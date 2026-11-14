import { HistoryDataItem } from '@/src/types/history';
import { useEffect, useState } from 'react';
import { parseISOStringToDate } from '@/src/helper/format';

const ITEMS_PER_PAGE = 10;

type SortField = 'stock_symbol' | 'quantity' | 'price' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function HistoryList({
  historyData,
}: {
  historyData: HistoryDataItem[];
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    setCurrentPage(1);
  }, [historyData]);

  if (historyData.length <= 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400">
        Make some trades to see your trade history.
      </p>
    );
  }

  const handleSort = (field: SortField) => {
    // if the sorting field hasn't changed, flip the sorting direction
    if (sortBy === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
      // otherwise the sorting field has changed, so we need to update the field, and reset the sorting direction
    } else {
      setSortBy(field);

      // sorting by stock symbol defaults to ascending for alphabetical ordering but everything else defaults to descending
      setSortDirection(field === 'stock_symbol' ? 'asc' : 'desc');
    }

    setCurrentPage(1);
  };

  const sortedHistory = [...historyData].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'stock_symbol':
        comparison = a.stock_symbol.localeCompare(b.stock_symbol);
        break;

      case 'quantity':
        comparison = Number(a.quantity) - Number(b.quantity);
        break;

      case 'price':
        comparison = Number(a.price) - Number(b.price);
        break;

      case 'created_at':
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedHistory.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const slicedHistory = sortedHistory.slice(startIndex, endIndex);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Trades</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort by
          </span>
          {(
            [
              ['stock_symbol', 'Symbol'],
              ['quantity', 'Quantity'],
              ['price', 'Price'],
              ['created_at', 'Date'],
            ] as const
          ).map(([field, label]) => (
            <button
              key={field}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                sortBy === field
                  ? 'bg-sky-500/10 text-sky-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
              onClick={() => handleSort(field)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-white/3 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Trade ID</th>
              <th className="px-5 py-3 font-medium">Stock symbol</th>
              <th className="px-5 py-3 text-right font-medium">Price</th>
              <th className="px-5 py-3 text-right font-medium">Quantity</th>
              <th className="px-5 py-3 text-right font-medium">Total value</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-slate-300">
            {slicedHistory.map((item: HistoryDataItem) => (
              <tr className="transition hover:bg-white/3" key={item.id}>
                <td className="px-5 py-3 text-slate-500">{item.id}</td>
                <td className="px-5 py-3 font-medium text-slate-100">
                  {item.stock_symbol}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  ${item.price}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-100">
                  ${item.total_value}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      item.type === 'buy'
                        ? 'bg-sky-500/10 text-sky-300'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                  {parseISOStringToDate(item.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
        <span className="text-sm text-slate-400">
          Page <span className="font-medium text-slate-200">{currentPage}</span>{' '}
          of <span className="font-medium text-slate-200">{totalPages}</span>
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
