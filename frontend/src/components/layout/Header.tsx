import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6">
      <div>
        <p className="text-sm font-semibold tracking-wide text-slate-100">
          Trading Dashboard
        </p>
      </div>
      <nav aria-label="Main navigation" className="flex items-center gap-2">
        <Link
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          href="/account"
        >
          Accounts
        </Link>
      </nav>
    </div>
  );
}
