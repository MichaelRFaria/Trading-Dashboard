'use client';

import React from 'react';
import { DashboardActiveSection } from '@/src/types/misc';
import { logoutAccount } from '@/src/helper/api';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/components/common/NotificationProvider';

export default function Sidebar({
  activeSection,
  setActiveSectionAction,
}: {
  activeSection: DashboardActiveSection;
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

  const navButtonClass = (section: DashboardActiveSection) =>
    `w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
      activeSection === section
        ? 'bg-sky-500/10 text-sky-300'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`;

  return (
    <nav
      aria-label="Dashboard sections"
      className="flex h-full flex-col gap-6 px-4 py-6"
    >
      <div>
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>
        <div className="flex flex-col gap-1">
          <button
            className={navButtonClass('dashboard')}
            aria-current={activeSection === 'dashboard' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={navButtonClass('portfolio')}
            aria-current={activeSection === 'portfolio' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={navButtonClass('watchlist')}
            aria-current={activeSection === 'watchlist' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('watchlist')}
          >
            Watchlist
          </button>
          <button
            className={navButtonClass('trade')}
            aria-current={activeSection === 'trade' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('trade')}
          >
            Trade
          </button>
          <button
            className={navButtonClass('history')}
            aria-current={activeSection === 'history' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('history')}
          >
            History
          </button>
        </div>
      </div>
      <div className="border-t border-white/10 pt-5">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Preferences
        </p>
        <div className="flex flex-col gap-1">
          <button
            className={navButtonClass('settings')}
            aria-current={activeSection === 'settings' ? 'page' : undefined}
            onClick={() => setActiveSectionAction('settings')}
          >
            Settings
          </button>
          <button
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
