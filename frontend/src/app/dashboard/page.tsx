'use client';

import Sidebar from '@/src/components/layout/Sidebar';
import Header from '@/src/components/layout/Header';
import DashboardPageBody from '@/src/components/layout/DashboardPageBody';
import { useEffect, useState } from 'react';
import { DashboardActiveSection } from '@/src/types/misc';

export default function DashboardPage() {
  const [activeSection, setActiveSection] =
    useState<DashboardActiveSection>('dashboard');

  useEffect(() => {
    console.log('active section changed to: ' + activeSection);
  }, [activeSection]);

  return (
    <div className="grid h-screen w-screen grid-cols-[240px_1fr] grid-rows-[70px_1fr] overflow-hidden bg-slate-950 text-slate-100">
      <aside className="col-start-1 col-span-1 row-start-2 row-span-1 border-r border-white/10 bg-slate-950/70">
        <Sidebar
          activeSection={activeSection}
          setActiveSectionAction={setActiveSection}
        />
      </aside>
      <header className="col-start-1 col-span-2 row-start-1 row-span-1 relative border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
        <Header />
      </header>
      <main className="col-start-2 col-span-1 row-start-2 row-span-2">
        <DashboardPageBody activeSection={activeSection} />
      </main>
    </div>
  );
}
