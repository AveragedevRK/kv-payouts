import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExplorerFilters } from '../components/payouts/explorer/ExplorerFilters';
import { ExplorerTable } from '../components/payouts/explorer/ExplorerTable';
import { Payout } from '../types';

export const PayoutsPage: React.FC = () => {
  const { accounts } = useApp();
  // Flatten payouts with account context
  const allPayouts = accounts.flatMap(acc => 
    acc.payouts.map(p => ({ ...p, accountName: acc.name, platform: acc.platform }))
  );

  const [filtered, setFiltered] = useState(allPayouts);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-light theme-text-main mb-6">Payout Explorer</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-72 flex-shrink-0 z-20">
          <ExplorerFilters allItems={allPayouts} onFilter={setFiltered} />
        </aside>
        <main className="flex-1 min-w-0">
          <ExplorerTable items={filtered} />
        </main>
      </div>
    </div>
  );
};