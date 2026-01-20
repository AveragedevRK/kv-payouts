import React, { useState, useMemo } from 'react';
import { MobileExplorerCard } from './MobileExplorerCard';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

type SortDir = 'asc' | 'desc' | null;

export const ExplorerTable: React.FC<{ items: any[] }> = ({ items }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: SortDir }>({ key: 'date', direction: null });

  const sortedItems = useMemo(() => {
    if (!sortConfig.direction) return items;
    return [...items].sort((a, b) => {
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
  }, [items, sortConfig]);

  const toggleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: null };
      return { key, direction: 'desc' };
    });
  };

  const SortIndicator = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return <Minus size={14} className="opacity-20" />;
    return sortConfig.direction === 'desc' 
      ? <ChevronDown size={20} className="text-[#FF2D92]" strokeWidth={3} /> 
      : <ChevronUp size={20} className="text-[#FF2D92]" strokeWidth={3} />;
  };

  return (
    <>
      <div className="md:hidden flex flex-col gap-6">
        {sortedItems.map(p => <MobileExplorerCard key={p.id} item={p} />)}
      </div>

      <div className="hidden md:block overflow-x-auto border theme-border rounded shadow-2xl theme-bg-card">
        <table className="w-full text-left text-lg whitespace-nowrap border-collapse">
          <thead className="theme-bg-subtle theme-text-main font-black uppercase text-xs tracking-[0.2em] border-b theme-border">
            <tr>
               <th className="p-6 sort-header" onClick={() => toggleSort('accountName')}>
                 <div className="flex items-center gap-4">ACCOUNT <SortIndicator columnKey="accountName" /></div>
               </th>
               <th className="p-6 sort-header" onClick={() => toggleSort('date')}>
                 <div className="flex items-center gap-4">DATE <SortIndicator columnKey="date" /></div>
               </th>
               <th className="p-6 sort-header" onClick={() => toggleSort('payoutAmount')}>
                 <div className="flex items-center gap-4">AMOUNT <SortIndicator columnKey="payoutAmount" /></div>
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
            {sortedItems.map(p => (
              <tr key={p.id} className="hover:theme-bg-subtle transition-colors group">
                <td className="p-6 font-black theme-text-main group-hover:theme-accent text-xl">{p.accountName}</td>
                <td className="p-6 theme-text-sub">{p.date}</td>
                <td className="p-6 text-[#FF2D92] font-black text-2xl tracking-tight">${p.payoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-6 font-mono text-base opacity-60">{p.transferId}</td>
                <td className="p-6 text-right pr-12">
                  <span className="theme-bg-page px-4 py-1.5 border theme-border rounded font-bold font-mono text-base">***{p.bankAccount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};