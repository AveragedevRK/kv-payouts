import React, { useState, useMemo } from 'react';
import { Payout } from '../../types';
import { PayoutRow } from './PayoutRow';
import { MobilePayoutCard } from './MobilePayoutCard';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

type SortDir = 'asc' | 'desc' | null;

export const PayoutTable: React.FC<{ payouts: Payout[] }> = ({ payouts }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payout, direction: SortDir }>({ key: 'date', direction: null });

  const sortedPayouts = useMemo(() => {
    if (!sortConfig.direction) return payouts;
    return [...payouts].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [payouts, sortConfig]);

  const toggleSort = (key: keyof Payout) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: null };
      return { key, direction: 'desc' };
    });
  };

  const SortIndicator = ({ columnKey }: { columnKey: keyof Payout }) => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return <Minus size={16} className="opacity-20" />;
    return sortConfig.direction === 'desc' 
      ? <ChevronDown size={22} className="text-[#FF2D92]" strokeWidth={3} /> 
      : <ChevronUp size={22} className="text-[#FF2D92]" strokeWidth={3} />;
  };

  return (
    <div className="mt-10">
      <div className="md:hidden flex flex-col gap-6">
        {sortedPayouts.map(p => <MobilePayoutCard key={p.id} payout={p} />)}
      </div>

      <div className="hidden md:block overflow-x-auto border-x theme-border rounded-lg shadow-2xl theme-bg-card border-t border-b">
        <table className="w-full text-left text-lg whitespace-nowrap border-collapse">
          <thead className="theme-bg-subtle theme-text-main font-black uppercase text-sm tracking-[0.2em] border-b theme-border">
            <tr>
              <th className="p-6 sort-header" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-4">DATE <SortIndicator columnKey="date" /></div>
              </th>
              <th className="p-6 sort-header" onClick={() => toggleSort('payoutAmount')}>
                <div className="flex items-center gap-4">RECEIVED <SortIndicator columnKey="payoutAmount" /></div>
              </th>
              <th className="p-6 sort-header" onClick={() => toggleSort('transferId')}>
                <div className="flex items-center gap-4">ID <SortIndicator columnKey="transferId" /></div>
              </th>
              <th className="p-6 text-right pr-12 sort-header" onClick={() => toggleSort('bankAccount')}>
                <div className="flex items-center justify-end gap-4">BANK <SortIndicator columnKey="bankAccount" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {sortedPayouts.map(p => <PayoutRow key={p.id} payout={p} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};