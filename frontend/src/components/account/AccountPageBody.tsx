'use client';

import AccountList from '@/src/components/account/AccountList';
import { useCallback, useEffect, useState } from 'react';
import { getAccounts, getCurrentUser } from '@/src/helper/api';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/components/common/NotificationProvider';
import { AuthenticatedUser } from '@/src/types/user';
import { AccountsListItem, AccountsResponse } from '@/src/types/account';
import BalanceUpdateForm from '@/src/components/account/BalanceUpdateForm';
import AccountUpdateForm from '@/src/components/account/AccountUpdateForm';

export default function AccountPageBody() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [accountsData, setAccountsData] = useState<AccountsListItem[]>([]);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    {
      sub: 0,
      email: '',
      exp: 0,
      iat: 0,
    },
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // check if the user is authenticated
  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log('user', user);
      if (user && 'sub' in user) {
        // console.log("user response below")
        setAuthenticatedUser(user);
      } else {
        showNotification('You are not authenticated, please login in.');
        router.push('/home');
      }
    });
  }, [router]);

  // extend and refactor this to fetch other stuff like DashboardPageBody if more api calls are made
  const fetchAccountData = useCallback(async () => {
    console.log('fetching');
    setIsLoading(true);
    try {
      const accounts: AccountsResponse | null = await getAccounts();
      console.log(accounts);

      if (accounts && 'data' in accounts) {
        setAccountsData(
          accounts.data.toSorted(
            (a, b) => Number(b.selected) - Number(a.selected) || a.id - b.id,
          ),
        );
      }
    } catch (error) {
      console.error('Error when fetching account data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // once user has been authenticated, fetch dashboard data
  useEffect(() => {
    if (authenticatedUser.sub !== 0) {
      fetchAccountData();
    }
  }, [authenticatedUser, fetchAccountData]);

  if (isLoading) {
    return (
      <p className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400">
        Loading accounts...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <AccountList accountsData={accountsData} />
      </div>
      <BalanceUpdateForm
        accountsData={accountsData}
        fetchAccountData={fetchAccountData}
      />
      <AccountUpdateForm
        accountsData={accountsData}
        fetchAccountData={fetchAccountData}
      />
    </div>
  );
}
