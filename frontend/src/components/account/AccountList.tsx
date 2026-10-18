import { AccountsListItem } from '@/src/types/account';

export default function AccountList({
  accountsData,
}: {
  accountsData: AccountsListItem[];
}) {
  if (accountsData.length <= 0) {
    console.error(
      'something went wrong, the user has no accounts, or no accounts were fetched',
    );
    return <p>Loading...</p>;
  }

  return (
    <>
      <p>Accounts:</p>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Balance</th>
            <th>Selected</th>
          </tr>
        </thead>

        <tbody>
          {accountsData.map((item: AccountsListItem, index: number) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.balance}</td>
              <td>{item.selected ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
