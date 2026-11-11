'use client';

import Header from '@/src/components/layout/Header';
import AccountPageBody from '@/src/components/account/AccountPageBody';

export default function AccountPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,64,175,0.16),transparent_55%)]"
      />
      <header className="relative border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
        <Header />
      </header>
      <main className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
              Trading Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manage your accounts and balances.
            </p>
          </div>
          <AccountPageBody />
        </section>
      </main>
    </div>
  );
}
