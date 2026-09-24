'use client';

import React from 'react';
import { DashboardActiveSection } from '@/src/types/misc';
import { logoutAccount } from '@/src/helper/api';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/components/common/NotificationProvider';

export default function Sidebar({
  setActiveSection,
}: {
  setActiveSection: React.Dispatch<
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
    <aside className="opactity-90 bg-gray">
      <div className="flex flex-col">
        <button onClick={() => setActiveSection('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveSection('portfolio')}>Portfolio</button>
        <button onClick={() => setActiveSection('watchlist')}>Watchlist</button>
        <button onClick={() => setActiveSection('trade')}>Trade</button>
        <button onClick={() => setActiveSection('history')}>History</button>
      </div>
      <hr />
      <div className="flex flex-col">
        <button>Settings</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </aside>
  );
}
