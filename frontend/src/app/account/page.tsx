'use client';

import Header from '@/src/components/layout/Header';
import AccountPageBody from '@/src/components/account/AccountPageBody';

export default function AccountPage() {
  return (
    <div className="grid-rows-[70px_1fr] h-screen w-screen">
      <header className="row-start-1 row-span-1">
        <Header />
      </header>
      <main className="row-start-2 row-span-2">
        <AccountPageBody />
      </main>
    </div>
  );
}
