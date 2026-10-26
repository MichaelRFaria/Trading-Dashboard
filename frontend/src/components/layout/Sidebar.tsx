'use client';

import React from 'react';
import { DashboardActiveSection } from '@/src/types/misc';
import { logoutAccount } from '@/src/helper/api';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/components/common/NotificationProvider';

export default function Sidebar({
  setActiveSectionAction,
}: {
  setActiveSectionAction: React.Dispatch<
    React.SetStateAction<DashboardActiveSection>
  >;
}) {
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleLogout = async () => {
    const success = await logoutAccount();

    if (success) {
      showNotification('Successfully logged out.');
      router.push('/home');
    } else {
      showNotification('Error logging out, please try again.');
    }
  };

  return (
    <aside className="opacity-90 bg-gray space-y-4">
      <div className="flex flex-col">
        <button onClick={() => setActiveSectionAction('dashboard')}>
          Dashboard
        </button>
        <button onClick={() => setActiveSectionAction('portfolio')}>
          Portfolio
        </button>
        <button onClick={() => setActiveSectionAction('watchlist')}>
          Watchlist
        </button>
        <button onClick={() => setActiveSectionAction('trade')}>Trade</button>
        <button onClick={() => setActiveSectionAction('history')}>
          History
        </button>
      </div>
      <hr />
      <div className="flex flex-col">
        <button onClick={() => setActiveSectionAction('settings')}>
          Settings
        </button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </aside>
  );
}
