import { depositBalance, withdrawBalance } from '@/src/helper/api';
import React, { useState } from 'react';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';
import FormSelect from '@/src/components/common/FormSelect';
import {
  BalanceUpdateRequest,
  BalanceUpdateResponse,
} from '@/src/types/account';

export default function BalanceUpdateForm({
  fetchAccountData,
}: {
  fetchAccountData: () => Promise<void>;
}) {
  const { showNotification } = useNotification();

  const [updateType, setUpdateType] = useState('deposit');

  const balanceUpdateFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    const formData = new FormData(event.target);

    const request: BalanceUpdateRequest = {
      amount: parseFloat(formData.get('amount') as string) as number,
    };

    console.log(request);

    let response: BalanceUpdateResponse | null;

    switch (updateType) {
      case 'deposit':
        response = await depositBalance(request);
        break;
      case 'withdraw':
        response = await withdrawBalance(request);
        break;
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

    fetchAccountData();
  };

  return (
    <>
      <p className="text-bg underline">Deposit/Withdraw Funds:</p>

      <form
        className="flex flex-col items-center gap-3"
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
        </FormSelect>

        <button type="submit">Execute</button>
      </form>
    </>
  );
}
