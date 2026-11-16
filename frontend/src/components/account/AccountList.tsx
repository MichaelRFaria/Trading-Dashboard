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
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400 shadow-xl shadow-black/20">
        No accounts are available.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-100">Your accounts</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Account</th>
              <th className="px-5 py-3 text-right font-medium">Balance</th>
              <th className="px-5 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {accountsData.map((item: AccountsListItem) => (
              <tr className="transition hover:bg-white/[0.03]" key={item.id}>
                <td className="px-5 py-3 font-medium text-slate-100">
                  Account {item.id}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  ${Number(item.balance).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.selected
                        ? 'bg-sky-500/10 text-sky-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.selected ? 'Selected' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
