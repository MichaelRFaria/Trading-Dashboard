import { HistoryDataItem } from '@/src/types/history';
import { useEffect, useState } from 'react';
import { parseISOStringToDate } from '@/src/helper/format';

const ITEMS_PER_PAGE = 10;

// todo: could potentially move TS types only used by one component, out of /types/ and into the component that uses it
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
      <p>Make some trades to see your trade history or change the filters!</p>
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

  if (historyData.length <= 0) {
    return (
      <p>Make some trades to see your trade history or change the filters!</p>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex gap-4">
          <button onClick={() => handleSort('stock_symbol')}>
            Stock Symbol
          </button>

          <button onClick={() => handleSort('quantity')}>Quantity</button>

          <button onClick={() => handleSort('price')}>Price</button>

          <button onClick={() => handleSort('created_at')}>Date</button>
        </div>

        <p>
          Sorted by {sortBy} ({sortDirection})
        </p>
      </div>

      <div className="flex flex-col items-center">
        <p>History:</p>
        <table>
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Stock Symbol</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {slicedHistory.map((item: HistoryDataItem) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.stock_symbol}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.total_value}</td>
                <td>{item.type}</td>
                <td>{parseISOStringToDate(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
