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
      case 'update':
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

    fetchAccountData();
  };

  return (
    <>
      <p className="text-bg underline">Account Interactions:</p>

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={accountUpdateFormSubmission}
      >
        {(actionType === 'update' || actionType === 'delete') &&
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
              <option value="update">Update</option>
            </>
          )}
        </FormSelect>

        <button type="submit">Execute</button>
      </form>
    </>
  );
}
