import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatBar } from '../payouts/StatBar';
import { PayoutTable } from '../payouts/PayoutTable';
import { Button } from '../common/Button';
import { ForceFetchButton } from '../payouts/ForceFetchButton';
import { AddPayoutModal } from '../payouts/AddPayoutModal';
import { ArrowLeft, Plus } from 'lucide-react';

export const AccountDetailView: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { accounts, selectAccount } = useApp();
  const [isAddOpen, setAddOpen] = useState(false);
  const account = accounts.find(a => a.id === accountId);

  if (!account) return <div className="p-10 theme-text-main">Account not found</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div className="flex-1">
           <button onClick={() => selectAccount(null)} className="flex items-center theme-text-sub hover:theme-text-main mb-3 text-sm transition-colors group">
             <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform"/> Back to Accounts
           </button>
           <h1 className="text-2xl md:text-3xl font-light theme-text-main leading-tight">
            {account.name} 
            <span className="theme-text-sub block sm:inline sm:ml-2 text-xl md:text-2xl opacity-60">Payout History</span>
           </h1>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="w-full sm:w-auto">
             <ForceFetchButton accountId={account.id} />
          </div>
          <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />} className="w-full sm:w-auto">
            Add Payout
          </Button>
        </div>
      </div>

      <StatBar payouts={account.payouts} nextDate={account.nextPayoutDate} />
      <PayoutTable payouts={account.payouts} />
      <AddPayoutModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} accountId={account.id} />
    </div>
  );
};