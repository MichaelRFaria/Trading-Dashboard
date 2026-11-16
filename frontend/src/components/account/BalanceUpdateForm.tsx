import {
  depositBalance,
  transferBalance,
  withdrawBalance,
} from '@/src/helper/api';
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';
import FormSelect from '@/src/components/common/FormSelect';
import { AccountsListItem, BalanceUpdateResponse } from '@/src/types/account';

export default function BalanceUpdateForm({
  accountsData,
  fetchAccountData,
}: {
  accountsData: AccountsListItem[];
  fetchAccountData: () => Promise<void>;
}) {
  const { showNotification } = useNotification();

  const [updateType, setUpdateType] = useState('deposit');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(
    accountsData[0].id,
  );

  const availableAccounts = accountsData.filter((item) => !item.selected);

  useEffect(() => {
    if (updateType === 'transfer' && availableAccounts.length === 0) {
      setUpdateType('deposit');
      setSelectedAccountId(accountsData[0].id);
    }
  }, [updateType, accountsData, availableAccounts]);

  const balanceUpdateFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    const formData = new FormData(event.target);

    const amount = parseFloat(formData.get('amount') as string);

    let response: BalanceUpdateResponse | null;

    switch (updateType) {
      case 'deposit':
        response = await depositBalance({ amount });
        break;
      case 'withdraw':
        response = await withdrawBalance({ amount });
        break;
      case 'transfer': {
        const accountId = formData.get('account');

        if (accountId === null) {
          showNotification('Select an account to transfer to.');
          return;
        }

        response = await transferBalance({
          amount,
          account_id: parseFloat(accountId as string),
        });
        break;
      }
      default:
        console.error(
          "balance update form's action value was unexpected, something went wrong",
        );
        return;
    }

    if (response === null) {
      showNotification(
        'Error encountered while executing account update, please try again.',
      );
      return;
    }

    if (response.message) {
      showNotification(response.message);
    }

    await fetchAccountData();
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Manage funds</h2>
        <p className="mt-1 text-sm text-slate-400">
          Deposit, withdraw, or transfer money between accounts.
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={balanceUpdateFormSubmission}
      >
        <FormInput
          label="Amount"
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
        />

        <FormSelect
          label="Action"
          id="action"
          name="action"
          value={updateType}
          onChange={(e) => setUpdateType(e.target.value)}
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          {availableAccounts.length >= 1 && (
            <option value="transfer">Transfer</option>
          )}
        </FormSelect>

        {updateType === 'transfer' && (
          <FormSelect
            label="Account"
            id="account"
            name="account"
            value={String(selectedAccountId)}
            onChange={(e) => setSelectedAccountId(parseInt(e.target.value))}
          >
            {availableAccounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </FormSelect>
        )}

        <button
          className="mt-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          type="submit"
        >
          Apply balance change
        </button>
      </form>
    </section>
  );
}
