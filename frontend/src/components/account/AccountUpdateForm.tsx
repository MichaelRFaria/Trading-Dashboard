import {
  createAccount,
  deleteAccount,
  updateSelectedAccount,
} from '@/src/helper/api';
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormSelect from '@/src/components/common/FormSelect';
import {
  AccountActionRequest,
  AccountActionResponse,
  AccountsListItem,
} from '@/src/types/account';

export default function AccountUpdateForm({
  accountsData,
  fetchAccountData,
}: {
  accountsData: AccountsListItem[];
  fetchAccountData: () => Promise<void>;
}) {
  const { showNotification } = useNotification();

  const [actionType, setActionType] = useState('create');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(
    accountsData[0].id,
  );

  const availableAccounts = accountsData.filter((item) => !item.selected);

  useEffect(() => {
    if (actionType === 'update' || actionType === 'delete') {
      setSelectedAccountId(availableAccounts[0].id);
    } else {
      setSelectedAccountId(accountsData[0].id);
    }
  }, [actionType, accountsData, availableAccounts]);

  const accountUpdateFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    const request: AccountActionRequest = {
      account_id: selectedAccountId as number,
    };

    console.log(request);

    let response: AccountActionResponse | null;

    switch (actionType) {
      case 'create':
        response = await createAccount();
        break;
      case 'select':
        response = await updateSelectedAccount(request);
        break;
      case 'delete':
        response = await deleteAccount(request);
        break;
      default:
        console.error(
          "account update form's action value was unexpected, something went wrong",
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
        <h2 className="text-lg font-semibold text-slate-100">
          Account settings
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Create, select, or remove an account.
        </p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={accountUpdateFormSubmission}
      >
        {(actionType === 'select' || actionType === 'delete') &&
          accountsData.length > 1 && (
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

        <FormSelect
          label="Action"
          id="action"
          name="action"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
        >
          <option value="create">Create</option>
          {accountsData.length > 1 && (
            <>
              <option value="delete">Delete</option>
              <option value="select">Select</option>
            </>
          )}
        </FormSelect>

        <button
          className="mt-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          type="submit"
        >
          Apply account action
        </button>
      </form>
    </section>
  );
}
